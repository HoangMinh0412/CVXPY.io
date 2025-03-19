"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const assert_1 = require("assert");
const crypto_1 = require("crypto");
const metadata_file_1 = require("./amf/metadata-file");
const artifact_1 = require("./artifacts/artifact");
const constants_1 = require("./constants");
const http_filesystem_1 = require("./fs/http-filesystem");
const local_filesystem_1 = require("./fs/local-filesystem");
const unified_filesystem_1 = require("./fs/unified-filesystem");
const vsix_local_filesystem_1 = require("./fs/vsix-local-filesystem");
const i18n_1 = require("./i18n");
const git_1 = require("./installers/git");
const nuget_1 = require("./installers/nuget");
const untar_1 = require("./installers/untar");
const unzip_1 = require("./installers/unzip");
const registries_1 = require("./registries/registries");
const channels_1 = require("./util/channels");
function hexsha(content) {
    return (0, crypto_1.createHash)('sha256').update(content, 'ascii').digest('hex');
}
function formatArtifactEntry(entry) {
    // we hash all the things to remove PII
    return `${hexsha(entry.registryUri)}:${hexsha(entry.id)}:${hexsha(entry.version)}`;
}
/**
 * The Session class is used to hold a reference to the
 * message channels,
 * the filesystems,
 * and any other 'global' data that should be kept.
 *
 */
class Session {
    context;
    settings;
    /** @internal */
    stopwatch = new channels_1.Stopwatch();
    fileSystem;
    channels;
    homeFolder;
    nextPreviousEnvironment;
    installFolder;
    registryFolder;
    telemetryFile;
    get vcpkgCommand() { return this.settings.vcpkgCommand; }
    globalConfig;
    downloads;
    currentDirectory;
    configuration;
    /** register installer functions here */
    installers = new Map([
        ['nuget', nuget_1.installNuGet],
        ['unzip', unzip_1.installUnZip],
        ['untar', untar_1.installUnTar],
        ['git', git_1.installGit]
    ]);
    registryDatabase = new registries_1.RegistryDatabase();
    globalRegistryResolver = new registries_1.RegistryResolver(this.registryDatabase);
    processVcpkgArg(argSetting, defaultName) {
        return argSetting ? this.fileSystem.file(argSetting) : this.homeFolder.join(defaultName);
    }
    constructor(currentDirectory, context, settings) {
        this.context = context;
        this.settings = settings;
        this.fileSystem = new unified_filesystem_1.UnifiedFileSystem(this).
            register('file', new local_filesystem_1.LocalFileSystem(this)).
            register('vsix', new vsix_local_filesystem_1.VsixLocalFilesystem(this)).
            register('https', new http_filesystem_1.HttpsFileSystem(this));
        this.channels = new channels_1.Channels(this);
        if (settings.telemetryFile) {
            this.telemetryFile = this.fileSystem.file(settings.telemetryFile);
        }
        this.homeFolder = this.fileSystem.file(settings.homeFolder);
        this.downloads = this.processVcpkgArg(settings.vcpkgDownloads, 'downloads');
        this.globalConfig = this.processVcpkgArg(settings.globalConfig, constants_1.configurationName);
        this.registryFolder = this.processVcpkgArg(settings.vcpkgRegistriesCache, 'registries').join('artifact');
        this.installFolder = this.processVcpkgArg(settings.vcpkgArtifactsRoot, 'artifacts');
        this.nextPreviousEnvironment = this.processVcpkgArg(settings.nextPreviousEnvironment, `previous-environment-${Date.now().toFixed()}.json`);
        this.currentDirectory = this.fileSystem.file(currentDirectory);
    }
    parseLocation(location) {
        // Drive letter, absolute Unix path, or drive-relative windows path, treat as a file
        if (/^[A-Za-z]:/.exec(location) || location.startsWith('/') || location.startsWith('\\')) {
            return this.fileSystem.file(location);
        }
        // Otherwise, it's a URI
        return this.fileSystem.parseUri(location);
    }
    async saveConfig() {
        await this.configuration?.save(this.globalConfig);
    }
    async init() {
        // load global configuration
        if (!await this.fileSystem.isDirectory(this.homeFolder)) {
            // let's create the folder
            try {
                await this.fileSystem.createDirectory(this.homeFolder);
            }
            catch (error) {
                // if this throws, let it
                this.channels.debug(error?.message);
            }
            // check if it got made, because at an absolute minimum, we need a folder, so failing this is catastrophic.
            assert_1.strict.ok(await this.fileSystem.isDirectory(this.homeFolder), (0, i18n_1.i) `Fatal: The root folder '${this.homeFolder.fsPath}' cannot be created`);
        }
        if (!await this.fileSystem.isFile(this.globalConfig)) {
            try {
                await this.globalConfig.writeUTF8(constants_1.defaultConfig);
            }
            catch {
                // if this throws, let it
            }
            // check if it got made, because at an absolute minimum, we need the config file, so failing this is catastrophic.
            assert_1.strict.ok(await this.fileSystem.isFile(this.globalConfig), (0, i18n_1.i) `Fatal: The global configuration file '${this.globalConfig.fsPath}' cannot be created`);
        }
        // got past the checks, let's load the configuration.
        this.configuration = await metadata_file_1.MetadataFile.parseMetadata(this.globalConfig.fsPath, this.globalConfig, this);
        this.channels.debug(`Loaded global configuration file '${this.globalConfig.fsPath}'`);
        // load the registries
        for (const [name, regDef] of this.configuration.registries) {
            const loc = regDef.location.get(0);
            if (loc) {
                const uri = this.parseLocation(loc);
                const reg = await this.registryDatabase.loadRegistry(this, uri);
                this.globalRegistryResolver.add(uri, name);
                if (reg) {
                    this.channels.debug(`Loaded global manifest ${name} => ${uri.formatted}`);
                }
            }
        }
        return this;
    }
    async findProjectProfile(startLocation = this.currentDirectory) {
        let location = startLocation;
        const path = location.join(constants_1.configurationName);
        if (await this.fileSystem.isFile(path)) {
            return path;
        }
        location = location.join('..');
        return (location.toString() === startLocation.toString()) ? undefined : this.findProjectProfile(location);
    }
    async getInstalledArtifacts() {
        const result = new Array();
        if (!await this.installFolder.exists()) {
            return result;
        }
        for (const [folder, stat] of await this.installFolder.readDirectory(undefined, { recursive: true })) {
            try {
                const artifactJsonPath = folder.join('artifact.json');
                const metadata = await metadata_file_1.MetadataFile.parseMetadata(artifactJsonPath.fsPath, artifactJsonPath, this);
                result.push({
                    folder,
                    id: metadata.id,
                    artifact: await new artifact_1.InstalledArtifact(this, metadata)
                });
            }
            catch {
                // not a valid install.
            }
        }
        return result;
    }
    /** returns an installer function (or undefined) for a given installerkind */
    artifactInstaller(installInfo) {
        return this.installers.get(installInfo.installerKind);
    }
    async openManifest(filename, uri) {
        return await metadata_file_1.MetadataFile.parseConfiguration(filename, await uri.readUTF8(), this);
    }
    #acquiredArtifacts = [];
    #activatedArtifacts = [];
    trackAcquire(registryUri, id, version) {
        this.#acquiredArtifacts.push({ registryUri: registryUri, id: id, version: version });
    }
    trackActivate(registryUri, id, version) {
        this.#activatedArtifacts.push({ registryUri: registryUri, id: id, version: version });
    }
    writeTelemetry() {
        const acquiredArtifacts = this.#acquiredArtifacts.map(formatArtifactEntry).join(',');
        const activatedArtifacts = this.#activatedArtifacts.map(formatArtifactEntry).join(',');
        const telemetryFile = this.telemetryFile;
        if (telemetryFile) {
            return telemetryFile.writeUTF8(JSON.stringify({
                'acquired-artifacts': acquiredArtifacts,
                'activated-artifacts': activatedArtifacts
            }));
        }
        return Promise.resolve(undefined);
    }
}
exports.Session = Session;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWljcm9zb2Z0L3ZjcGtnLXRvb2wvbWFpbi92Y3BrZy1hcnRpZmFjdHMvIiwic291cmNlcyI6WyJzZXNzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEMsbUNBQWdDO0FBQ2hDLG1DQUFvQztBQUNwQyx1REFBbUQ7QUFDbkQsbURBQW1FO0FBQ25FLDJDQUErRDtBQUUvRCwwREFBdUQ7QUFDdkQsNERBQXdEO0FBQ3hELGdFQUE0RDtBQUM1RCxzRUFBaUU7QUFDakUsaUNBQTJCO0FBQzNCLDBDQUE4QztBQUM5Qyw4Q0FBa0Q7QUFDbEQsOENBQWtEO0FBQ2xELDhDQUFrRDtBQUdsRCx3REFBNkU7QUFDN0UsOENBQXNEO0FBNkN0RCxTQUFTLE1BQU0sQ0FBQyxPQUFlO0lBQzdCLE9BQU8sSUFBQSxtQkFBVSxFQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JFLENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLEtBQW9CO0lBQy9DLHVDQUF1QztJQUN2QyxPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztBQUNyRixDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBYSxPQUFPO0lBZ0NvQztJQUFrQztJQS9CeEYsZ0JBQWdCO0lBQ1AsU0FBUyxHQUFHLElBQUksb0JBQVMsRUFBRSxDQUFDO0lBQzVCLFVBQVUsQ0FBYTtJQUN2QixRQUFRLENBQVc7SUFDbkIsVUFBVSxDQUFNO0lBQ2hCLHVCQUF1QixDQUFNO0lBQzdCLGFBQWEsQ0FB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
// SIG // Begin signature block
// SIG // MIIoKAYJKoZIhvcNAQcCoIIoGTCCKBUCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // lvgQpfCWjvkronYRzkEqlnaYeL84+8B0+BilLb4ybiug
// SIG // gg12MIIF9DCCA9ygAwIBAgITMwAABARsdAb/VysncgAA
// SIG // AAAEBDANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTI0MDkxMjIwMTExNFoX
// SIG // DTI1MDkxMTIwMTExNFowdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // tCg32mOdDA6rBBnZSMwxwXegqiDEUFlvQH9Sxww07hY3
// SIG // w7L52tJxLg0mCZjcszQddI6W4NJYb5E9QM319kyyE0l8
// SIG // EvA/pgcxgljDP8E6XIlgVf6W40ms286Cr0azaA1f7vaJ
// SIG // jjNhGsMqOSSSXTZDNnfKs5ENG0bkXeB2q5hrp0qLsm/T
// SIG // WO3oFjeROZVHN2tgETswHR3WKTm6QjnXgGNj+V6rSZJO
// SIG // /WkTqc8NesAo3Up/KjMwgc0e67x9llZLxRyyMWUBE9co
// SIG // T2+pUZqYAUDZ84nR1djnMY3PMDYiA84Gw5JpceeED38O
// SIG // 0cEIvKdX8uG8oQa047+evMfDRr94MG9EWwIDAQABo4IB
// SIG // czCCAW8wHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFPIboTWxEw1PmVpZS+AzTDwo
// SIG // oxFOMEUGA1UdEQQ+MDykOjA4MR4wHAYDVQQLExVNaWNy
// SIG // b3NvZnQgQ29ycG9yYXRpb24xFjAUBgNVBAUTDTIzMDAx
// SIG // Mis1MDI5MjMwHwYDVR0jBBgwFoAUSG5k5VAF04KqFzc3
// SIG // IrVtqMp1ApUwVAYDVR0fBE0wSzBJoEegRYZDaHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraW9wcy9jcmwvTWlj
// SIG // Q29kU2lnUENBMjAxMV8yMDExLTA3LTA4LmNybDBhBggr
// SIG // BgEFBQcBAQRVMFMwUQYIKwYBBQUHMAKGRWh0dHA6Ly93
// SIG // d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY2VydHMvTWlj
// SIG // Q29kU2lnUENBMjAxMV8yMDExLTA3LTA4LmNydDAMBgNV
// SIG // HRMBAf8EAjAAMA0GCSqGSIb3DQEBCwUAA4ICAQCI5g/S
// SIG // KUFb3wdUHob6Qhnu0Hk0JCkO4925gzI8EqhS+K4umnvS
// SIG // BU3acsJ+bJprUiMimA59/5x7WhJ9F9TQYy+aD9AYwMtb
// SIG // KsQ/rst+QflfML+Rq8YTAyT/JdkIy7R/1IJUkyIS6srf
// SIG // G1AKlX8n6YeAjjEb8MI07wobQp1F1wArgl2B1mpTqHND
// SIG // lNqBjfpjySCScWjUHNbIwbDGxiFr93JoEh5AhJqzL+8m
// SIG // onaXj7elfsjzIpPnl8NyH2eXjTojYC9a2c4EiX0571Ko
// SIG // mhENF3RtR25A7/X7+gk6upuE8tyMy4sBkl2MUSF08U+E
// SIG // 2LOVcR8trhYxV1lUi9CdgEU2CxODspdcFwxdT1+G8YNc
// SIG // gzHyjx3BNSI4nOZcdSnStUpGhCXbaOIXfvtOSfQX/UwJ
// SIG // oruhCugvTnub0Wna6CQiturglCOMyIy/6hu5rMFvqk9A
// SIG // ltIJ0fSR5FwljW6PHHDJNbCWrZkaEgIn24M2mG1M/Ppb
// SIG // /iF8uRhbgJi5zWxo2nAdyDBqWvpWxYIoee/3yIWpquVY
// SIG // cYGhJp/1I1sq/nD4gBVrk1SKX7Do2xAMMO+cFETTNSJq
// SIG // fTSSsntTtuBLKRB5mw5qglHKuzapDiiBuD1Zt4QwxA/1
// SIG // kKcyQ5L7uBayG78kxlVNNbyrIOFH3HYmdH0Pv1dIX/Mq
// SIG // 7avQpAfIiLpOWwcbjzCCB3owggVioAMCAQICCmEOkNIA
// SIG // AAAAAAMwDQYJKoZIhvcNAQELBQAwgYgxCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xMjAwBgNVBAMTKU1pY3Jvc29mdCBSb290
// SIG // IENlcnRpZmljYXRlIEF1dGhvcml0eSAyMDExMB4XDTEx
// SIG // MDcwODIwNTkwOVoXDTI2MDcwODIxMDkwOVowfjELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEoMCYGA1UEAxMfTWljcm9zb2Z0
// SIG // IENvZGUgU2lnbmluZyBQQ0EgMjAxMTCCAiIwDQYJKoZI
// SIG // hvcNAQEBBQADggIPADCCAgoCggIBAKvw+nIQHC6t2G6q
// SIG // ghBNNLrytlghn0IbKmvpWlCquAY4GgRJun/DDB7dN2vG
// SIG // EtgL8DjCmQawyDnVARQxQtOJDXlkh36UYCRsr55JnOlo
// SIG // XtLfm1OyCizDr9mpK656Ca/XllnKYBoF6WZ26DJSJhIv
// SIG // 56sIUM+zRLdd2MQuA3WraPPLbfM6XKEW9Ea64DhkrG5k
// SIG // NXimoGMPLdNAk/jj3gcN1Vx5pUkp5w2+oBN3vpQ97/vj
// SIG // K1oQH01WKKJ6cuASOrdJXtjt7UORg9l7snuGG9k+sYxd
// SIG // 6IlPhBryoS9Z5JA7La4zWMW3Pv4y07MDPbGyr5I4ftKd
// SIG // gCz1TlaRITUlwzluZH9TupwPrRkjhMv0ugOGjfdf8NBS
// SIG // v4yUh7zAIXQlXxgotswnKDglmDlKNs98sZKuHCOnqWbs
// SIG // YR9q4ShJnV+I4iVd0yFLPlLEtVc/JAPw0XpbL9Uj43Bd
// SIG // D1FGd7P4AOG8rAKCX9vAFbO9G9RVS+c5oQ/pI0m8GLhE
// SIG // fEXkwcNyeuBy5yTfv0aZxe/CHFfbg43sTUkwp6uO3+xb
// SIG // n6/83bBm4sGXgXvt1u1L50kppxMopqd9Z4DmimJ4X7Iv
// SIG // hNdXnFy/dygo8e1twyiPLI9AN0/B4YVEicQJTMXUpUMv
// SIG // dJX3bvh4IFgsE11glZo+TzOE2rCIF96eTvSWsLxGoGyY
// SIG // 0uDWiIwLAgMBAAGjggHtMIIB6TAQBgkrBgEEAYI3FQEE
// SIG // AwIBADAdBgNVHQ4EFgQUSG5k5VAF04KqFzc3IrVtqMp1
// SIG // ApUwGQYJKwYBBAGCNxQCBAweCgBTAHUAYgBDAEEwCwYD
// SIG // VR0PBAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wHwYDVR0j
// SIG // BBgwFoAUci06AjGQQ7kUBU7h6qfHMdEjiTQwWgYDVR0f
// SIG // BFMwUTBPoE2gS4ZJaHR0cDovL2NybC5taWNyb3NvZnQu
// SIG // Y29tL3BraS9jcmwvcHJvZHVjdHMvTWljUm9vQ2VyQXV0
// SIG // MjAxMV8yMDExXzAzXzIyLmNybDBeBggrBgEFBQcBAQRS
// SIG // MFAwTgYIKwYBBQUHMAKGQmh0dHA6Ly93d3cubWljcm9z
// SIG // b2Z0LmNvbS9wa2kvY2VydHMvTWljUm9vQ2VyQXV0MjAx
// SIG // MV8yMDExXzAzXzIyLmNydDCBnwYDVR0gBIGXMIGUMIGR
// SIG // BgkrBgEEAYI3LgMwgYMwPwYIKwYBBQUHAgEWM2h0dHA6
// SIG // Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvZG9jcy9w
// SIG // cmltYXJ5Y3BzLmh0bTBABggrBgEFBQcCAjA0HjIgHQBM
// SIG // AGUAZwBhAGwAXwBwAG8AbABpAGMAeQBfAHMAdABhAHQA
// SIG // ZQBtAGUAbgB0AC4gHTANBgkqhkiG9w0BAQsFAAOCAgEA
// SIG // Z/KGpZjgVHkaLtPYdGcimwuWEeFjkplCln3SeQyQwWVf
// SIG // Liw++MNy0W2D/r4/6ArKO79HqaPzadtjvyI1pZddZYSQ
// SIG // fYtGUFXYDJJ80hpLHPM8QotS0LD9a+M+By4pm+Y9G6XU
// SIG // tR13lDni6WTJRD14eiPzE32mkHSDjfTLJgJGKsKKELuk
// SIG // qQUMm+1o+mgulaAqPyprWEljHwlpblqYluSD9MCP80Yr
// SIG // 3vw70L01724lruWvJ+3Q3fMOr5kol5hNDj0L8giJ1h/D
// SIG // Mhji8MUtzluetEk5CsYKwsatruWy2dsViFFFWDgycSca
// SIG // f7H0J/jeLDogaZiyWYlobm+nt3TDQAUGpgEqKD6CPxNN
// SIG // ZgvAs0314Y9/HG8VfUWnduVAKmWjw11SYobDHWM2l4bf
// SIG // 2vP48hahmifhzaWX0O5dY0HjWwechz4GdwbRBrF1HxS+
// SIG // YWG18NzGGwS+30HHDiju3mUv7Jf2oVyW2ADWoUa9WfOX
// SIG // pQlLSBCZgB/QACnFsZulP0V3HjXG0qKin3p6IvpIlR+r
// SIG // +0cjgPWe+L9rt0uX4ut1eBrs6jeZeRhL/9azI2h15q/6
// SIG // /IvrC4DqaTuv/DDtBEyO3991bWORPdGdVk5Pv4BXIqF4
// SIG // ETIheu9BCrE/+6jMpF3BoYibV3FWTkhFwELJm3ZbCoBI
// SIG // a/15n8G9bW1qyVJzEw16UM0xghoKMIIaBgIBATCBlTB+
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQDEx9NaWNy
// SIG // b3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDExAhMzAAAE
// SIG // BGx0Bv9XKydyAAAAAAQEMA0GCWCGSAFlAwQCAQUAoIGu
// SIG // MBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEEMBwGCisG
// SIG // AQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3
// SIG // DQEJBDEiBCC/oGgJ7xs86tVzCtrVxMpb2TyEGGZ9FMpQ
// SIG // mqdbjQjHRTBCBgorBgEEAYI3AgEMMTQwMqAUgBIATQBp
// SIG // AGMAcgBvAHMAbwBmAHShGoAYaHR0cDovL3d3dy5taWNy
// SIG // b3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBAF5t7UH8
// SIG // vj54UUTO36Cj8UspchH5Ni2dbUFXyNxswv49GEmQjmX3
// SIG // zBcTN9DFEBnH7uPgH7TsJn3secFv9/aMqOrg6rDidcMb
// SIG // GK4mjEPBrjkDeQxcS4f4D1rf9Tx7pVGdh5X7sFbu2AWV
// SIG // eKr3fsB08IcITKzqaAYaoGqDAt5ei/m3C+vfAViVrcPA
// SIG // 2bONDNqWE4JAZXPbVymWUprOwuu9I7tr0TlGquPGjTmw
// SIG // PApMzTJ/hwdLgoEQP3dwRQ4LgPL54CdUdkgvYnqopAB/
// SIG // g2YyIjv80IUtZbOjxpfRzautMGsxRK/U+mKvwVYsaxtF
// SIG // paxMCl3aHzNOzhxl44obDOd416yhgheUMIIXkAYKKwYB
// SIG // BAGCNwMDATGCF4Awghd8BgkqhkiG9w0BBwKgghdtMIIX
// SIG // aQIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBUgYLKoZIhvcN
// SIG // AQkQAQSgggFBBIIBPTCCATkCAQEGCisGAQQBhFkKAwEw
// SIG // MTANBglghkgBZQMEAgEFAAQg36Mt82EbxCGTr9ppJ1xI
// SIG // nFPWCv75NAdr91IcMkIM7d8CBmc/F3RkZxgTMjAyNDEy
// SIG // MDkyMTAzMzMuNTQ4WjAEgAIB9KCB0aSBzjCByzELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0
// SIG // IEFtZXJpY2EgT3BlcmF0aW9uczEnMCUGA1UECxMeblNo
// SIG // aWVsZCBUU1MgRVNOOkE0MDAtMDVFMC1EOTQ3MSUwIwYD
// SIG // VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNl
// SIG // oIIR6jCCByAwggUIoAMCAQICEzMAAAHs4CukgtCRUoAA
// SIG // AQAAAewwDQYJKoZIhvcNAQELBQAwfDELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBIDIwMTAwHhcNMjMxMjA2MTg0NTM4WhcN
// SIG // MjUwMzA1MTg0NTM4WjCByzELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3Bl
// SIG // cmF0aW9uczEnMCUGA1UECxMeblNoaWVsZCBUU1MgRVNO
// SIG // OkE0MDAtMDVFMC1EOTQ3MSUwIwYDVQQDExxNaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIICIjANBgkqhkiG
// SIG // 9w0BAQEFAAOCAg8AMIICCgKCAgEAsEf0bgk24MVFlZv1
// SIG // XbpdtrsHRGZtCKABbOqCK9/VSvyLT/NHJ/vE5rT+u4mm
// SIG // weA5gCifRh+nSRoRDyaWOL0ykUjsK0TcVSCqDz3lBd3+
// SIG // FchxHKP7tUFGnZcA9d9jbmQsW54ejItpSxu6Q77M2ajB
// SIG // u0tzAotm5Np77RinXgCC/h++4C+K9NU0lm+67BNiW9T/
// SIG // zemP1tQqg4tfyG9/80all7eM8b3SBnD40uGSskBBd0hG
// SIG // QKuFyI4sqMDx2qjW2cXX9pFjv2o3X01PObfd+AlwIp29
// SIG // KPrkPSrWijS1VXDX+UKUuH+vzLFzryBbgmDEXSg46Zr6
// SIG // MAHi/tY9u2wsQgaQ0B61pHz82af1/m7fQuxOYTz+h1Ua
// SIG // KgWEe7tYFH+RhKvua9RwNI2o59EOjr32HJBNB3Tr+ilm
// SIG // vrAJiRuzw702Wnu+4aJs8eiD6oIFaTWbgpO/Un1Zpyrv
// SIG // RefFAJ1OfE6gxxMxrEJzFECrLUt845+klNDSxBTQnrZb
// SIG // mipKlg0VSxFm7t9vSBId7alz138ukYf8Am8HvUgiSKKr
// SIG // QXsQaz8kGANl2s9XyvcrE7MdJAPVdScFVeOCGvXPjMLQ
// SIG // EerKinQIEaP27P17vILmvCw3uilsrve+HvZhlu2TvJ2q
// SIG // wxawE9RFxhw7nsoEir79iu8AfJQIDBiY+9wkL6/o6qFs
// SIG // Mel3cnkCAwEAAaOCAUkwggFFMB0GA1UdDgQWBBT0WtBH
// SIG // ZP4r9cIWELFfFIBH+EyFhjAfBgNVHSMEGDAWgBSfpxVd
// SIG // AF5iXYP05dJlpxtTNRnpcjBfBgNVHR8EWDBWMFSgUqBQ
// SIG // hk5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3Bz
// SIG // L2NybC9NaWNyb3NvZnQlMjBUaW1lLVN0YW1wJTIwUENB
// SIG // JTIwMjAxMCgxKS5jcmwwbAYIKwYBBQUHAQEEYDBeMFwG
// SIG // CCsGAQUFBzAChlBodHRwOi8vd3d3Lm1pY3Jvc29mdC5j
// SIG // b20vcGtpb3BzL2NlcnRzL01pY3Jvc29mdCUyMFRpbWUt
// SIG // U3RhbXAlMjBQQ0ElMjAyMDEwKDEpLmNydDAMBgNVHRMB
// SIG // Af8EAjAAMBYGA1UdJQEB/wQMMAoGCCsGAQUFBwMIMA4G
// SIG // A1UdDwEB/wQEAwIHgDANBgkqhkiG9w0BAQsFAAOCAgEA
// SIG // krzEpDEq745Qz2oPAEW9DhawELUizA6TdFGNxY7z4cBi
// SIG // g664sZp7jH465lY0atbvCIZA7xhf2332xU6/iAJw0noP
// SIG // Ewfc3xv+Mm5J7qKZJW3ho27ezC8aX4aJQhEchHNtDzGS
// SIG // ic/Ur837jtZ+ca6yzi/JtJ5r+ZAXL/stQFyeUHC4nJoX
// SIG // tiKd/w+uxHeqD6kCNN5g42GktTUIQTbbue8Dyl2dRKDU
// SIG // 6AZPGwOvN/cNdfW/mvVk6KiLJHURqD+cYwyL/pnNLwR4
// SIG // WRpCVb3yIZuAKfM6bQu8VQJctI3jr+XVBjAmIGY76E5o
// SIG // HeOW6gMLp3Zj5Rrq+3pXlmHnS0H+7Ny+fqn2mP8RIf/b
// SIG // qNe0pzP4B1UhgM7563hoTqwdi7XSqFUnuS22KYoV3LQ3
// SIG // u+omLS/pocVzxKc3Wt2yZYT0zkNyjhGQKVREQaOcpbVo
// SIG // zwlpV8cgqZeY4/Z2NJ33dO9W3pp6LvAN61Ga3YCiGrrb
// SIG // B+0hzojnm2RqjbvuttrybWt3gGLAgGsQHAfQYiT5Wu12
// SIG // nfaq02HU+OVZQmE7QUmOKFUbHnUgA7/fY7/4mCABstWw
// SIG // srbmtKP0Kr/Xqyps0Ak1TF2g3NuQ0y3DBia0bmtytMYr
// SIG // 3bZ6AXsc1Sa+sl6jPgWtsISFUbxnK4gZCl9BSRXlu69v
// SIG // V1/pNHuA5xuogRykI3nOlTcwggdxMIIFWaADAgECAhMz
// SIG // AAAAFcXna54Cm0mZAAAAAAAVMA0GCSqGSIb3DQEBCwUA
// SIG // MIGIMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
// SIG // Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMV
// SIG // TWljcm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQDEylN
// SIG // aWNyb3NvZnQgUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3Jp
// SIG // dHkgMjAxMDAeFw0yMTA5MzAxODIyMjVaFw0zMDA5MzAx
// SIG // ODMyMjVaMHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpX
// SIG // YXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
// SIG // VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNV
// SIG // BAMTHU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEw
// SIG // MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA
// SIG // 5OGmTOe0ciELeaLL1yR5vQ7VgtP97pwHB9KpbE51yMo1
// SIG // V/YBf2xK4OK9uT4XYDP/XE/HZveVU3Fa4n5KWv64NmeF
// SIG // RiMMtY0Tz3cywBAY6GB9alKDRLemjkZrBxTzxXb1hlDc
// SIG // wUTIcVxRMTegCjhuje3XD9gmU3w5YQJ6xKr9cmmvHaus
// SIG // 9ja+NSZk2pg7uhp7M62AW36MEBydUv626GIl3GoPz130
// SIG // /o5Tz9bshVZN7928jaTjkY+yOSxRnOlwaQ3KNi1wjjHI
// SIG // NSi947SHJMPgyY9+tVSP3PoFVZhtaDuaRr3tpK56KTes
// SIG // y+uDRedGbsoy1cCGMFxPLOJiss254o2I5JasAUq7vnGp
// SIG // F1tnYN74kpEeHT39IM9zfUGaRnXNxF803RKJ1v2lIH1+
// SIG // /NmeRd+2ci/bfV+AutuqfjbsNkz2K26oElHovwUDo9Fz
// SIG // pk03dJQcNIIP8BDyt0cY7afomXw/TNuvXsLz1dhzPUNO
// SIG // wTM5TI4CvEJoLhDqhFFG4tG9ahhaYQFzymeiXtcodgLi
// SIG // Mxhy16cg8ML6EgrXY28MyTZki1ugpoMhXV8wdJGUlNi5
// SIG // UPkLiWHzNgY1GIRH29wb0f2y1BzFa/ZcUlFdEtsluq9Q
// SIG // BXpsxREdcu+N+VLEhReTwDwV2xo3xwgVGD94q0W29R6H
// SIG // XtqPnhZyacaue7e3PmriLq0CAwEAAaOCAd0wggHZMBIG
// SIG // CSsGAQQBgjcVAQQFAgMBAAEwIwYJKwYBBAGCNxUCBBYE
// SIG // FCqnUv5kxJq+gpE8RjUpzxD/LwTuMB0GA1UdDgQWBBSf
// SIG // pxVdAF5iXYP05dJlpxtTNRnpcjBcBgNVHSAEVTBTMFEG
// SIG // DCsGAQQBgjdMg30BATBBMD8GCCsGAQUFBwIBFjNodHRw
// SIG // Oi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL0RvY3Mv
// SIG // UmVwb3NpdG9yeS5odG0wEwYDVR0lBAwwCgYIKwYBBQUH
// SIG // AwgwGQYJKwYBBAGCNxQCBAweCgBTAHUAYgBDAEEwCwYD
// SIG // VR0PBAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wHwYDVR0j
// SIG // BBgwFoAU1fZWy4/oolxiaNE9lJBb186aGMQwVgYDVR0f
// SIG // BE8wTTBLoEmgR4ZFaHR0cDovL2NybC5taWNyb3NvZnQu
// SIG // Y29tL3BraS9jcmwvcHJvZHVjdHMvTWljUm9vQ2VyQXV0
// SIG // XzIwMTAtMDYtMjMuY3JsMFoGCCsGAQUFBwEBBE4wTDBK
// SIG // BggrBgEFBQcwAoY+aHR0cDovL3d3dy5taWNyb3NvZnQu
// SIG // Y29tL3BraS9jZXJ0cy9NaWNSb29DZXJBdXRfMjAxMC0w
// SIG // Ni0yMy5jcnQwDQYJKoZIhvcNAQELBQADggIBAJ1Vffwq
// SIG // reEsH2cBMSRb4Z5yS/ypb+pcFLY+TkdkeLEGk5c9MTO1
// SIG // OdfCcTY/2mRsfNB1OW27DzHkwo/7bNGhlBgi7ulmZzpT
// SIG // Td2YurYeeNg2LpypglYAA7AFvonoaeC6Ce5732pvvinL
// SIG // btg/SHUB2RjebYIM9W0jVOR4U3UkV7ndn/OOPcbzaN9l
// SIG // 9qRWqveVtihVJ9AkvUCgvxm2EhIRXT0n4ECWOKz3+SmJ
// SIG // w7wXsFSFQrP8DJ6LGYnn8AtqgcKBGUIZUnWKNsIdw2Fz
// SIG // Lixre24/LAl4FOmRsqlb30mjdAy87JGA0j3mSj5mO0+7
// SIG // hvoyGtmW9I/2kQH2zsZ0/fZMcm8Qq3UwxTSwethQ/gpY
// SIG // 3UA8x1RtnWN0SCyxTkctwRQEcb9k+SS+c23Kjgm9swFX
// SIG // SVRk2XPXfx5bRAGOWhmRaw2fpCjcZxkoJLo4S5pu+yFU
// SIG // a2pFEUep8beuyOiJXk+d0tBMdrVXVAmxaQFEfnyhYWxz
// SIG // /gq77EFmPWn9y8FBSX5+k77L+DvktxW/tM4+pTFRhLy/
// SIG // AsGConsXHRWJjXD+57XQKBqJC4822rpM+Zv/Cuk0+CQ1
// SIG // ZyvgDbjmjJnW4SLq8CdCPSWU5nR0W2rRnj7tfqAxM328
// SIG // y+l7vzhwRNGQ8cirOoo6CGJ/2XBjU02N7oJtpQUQwXEG
// SIG // ahC0HVUzWLOhcGbyoYIDTTCCAjUCAQEwgfmhgdGkgc4w
// SIG // gcsxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xJTAjBgNVBAsTHE1p
// SIG // Y3Jvc29mdCBBbWVyaWNhIE9wZXJhdGlvbnMxJzAlBgNV
// SIG // BAsTHm5TaGllbGQgVFNTIEVTTjpBNDAwLTA1RTAtRDk0
// SIG // NzElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAg
// SIG // U2VydmljZaIjCgEBMAcGBSsOAwIaAxUAjhz7YFXc/RFt
// SIG // IjzS/wV6iaKlTH+ggYMwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0BAQsFAAIFAOsB
// SIG // T6cwIhgPMjAyNDEyMDkxMTE0NDdaGA8yMDI0MTIxMDEx
// SIG // MTQ0N1owdDA6BgorBgEEAYRZCgQBMSwwKjAKAgUA6wFP
// SIG // pwIBADAHAgEAAgIG9zAHAgEAAgISWTAKAgUA6wKhJwIB
// SIG // ADA2BgorBgEEAYRZCgQCMSgwJjAMBgorBgEEAYRZCgMC
// SIG // oAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqGSIb3
// SIG // DQEBCwUAA4IBAQBOlFS2AB5qaGZvV0WYQngzxwIJwofk
// SIG // oNpu3mgdnEne6liA/lGS94+7WfZo31o4SlKtJRmv/bhs
// SIG // CB7S6jLZovzxvBM6g0TfU5IfjmVl9p+yYDWoY8xQs7G2
// SIG // HfQKxOesYtuhpy4z15motGOxj9nuA3vpPdgOmOrL4f/y
// SIG // cDYHRA/g4sNdWgAXXSqDpMaNVijuZLkw3be8CXpv0c9T
// SIG // ICeYqE0/hkVeIC6UV2CnrkK6t3EXa19P7P+/wuHhV64F
// SIG // dYYH8o9noSXXZTzPOSm2daYkYdCUESGerGyEeLQGuH8E
// SIG // Vq7x8PT/xDSNx8hsNaLKTDenOd6tWp75Q2Zq0xbBBkWK
// SIG // CvllMYIEDTCCBAkCAQEwgZMwfDELMAkGA1UEBhMCVVMx
// SIG // EzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1Jl
// SIG // ZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3Jh
// SIG // dGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUtU3Rh
// SIG // bXAgUENBIDIwMTACEzMAAAHs4CukgtCRUoAAAQAAAeww
// SIG // DQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJAzEN
// SIG // BgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQgcryj
// SIG // rQTaCOyzeqT9QqQdPgFAqO826VuqTJK+kqLvAEcwgfoG
// SIG // CyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCAnCeb1an03
// SIG // yIcdtUAQWysqP8XIkCF2qDFlC3owBNUKgzCBmDCBgKR+
// SIG // MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1p
// SIG // Y3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAAB
// SIG // 7OArpILQkVKAAAEAAAHsMCIEIIKmL3NSpf7k0h45+nSS
// SIG // g1q2IHM7dDbpxffZgkrZLDkjMA0GCSqGSIb3DQEBCwUA
// SIG // BIICAD0eYJhA0bnL4x7dIZ9WOk4Eljh3nd/T+WaKdlIT
// SIG // E0090Sl9G3SeR607Jt6/cWNvXPB+P3b13ouW/w5sHCHM
// SIG // eocyP3MppKqwADscn5NcR+emus6fvi0SgbPqj7sEyKPt
// SIG // 2o5DjpLqqTI3HEdAuEJEc6I7Kp6FojEeJzuFgSir5GY/
// SIG // bemnTwfINZdamwrQtuk++hqOElY5+8W/faX8z8dn4Qf2
// SIG // wlqJVBXMtT7atkspF4IdeTeGAtHxQL2Dp5q27yt7RR/q
// SIG // hFqTooQrNV3A1VySa0a/q2aw49L92CwIZmVMY7ytjDRf
// SIG // PpIRPlbnX2469qIyn4wPU9hlhMLq0ZVKL5Uz3A9EYa3o
// SIG // zQrtLJHdPuY68YN3tV833gYc1AzBjLSegP7JOBqHO+CH
// SIG // nwv2gYXboTHjpaB5mbJMdn2eoOLqE+v9u+Dw4eYMwyv/
// SIG // bo88xYjEmR4OjFGKbjz5+B6taI0Td8B/ryQGlETBG7+8
// SIG // TBg/v0NodVLdtbuuTvAewGKhc48vi2eOmwHKFTkJ0SaM
// SIG // 6MlKPdIvo3rFt1B/gplacSwH2xWLtYa4TuF4XXSjL8RU
// SIG // fMm2r/ZQ6Vx/0lv52GOhxsoTXvpJqDwOkDx9N6J+DxEW
// SIG // z1Jlv+fNS9gdJS9nXVm3zeXg/h5LZa01D4uQRlD3hoAY
// SIG // 6WR8KfKmdnd158EEckNLP8jVuIFZ
// SIG // End signature block
