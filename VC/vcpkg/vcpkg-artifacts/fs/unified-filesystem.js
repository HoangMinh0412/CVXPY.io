"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedFileSystem = exports.schemeOf = void 0;
const assert_1 = require("assert");
const i18n_1 = require("../i18n");
const filesystem_1 = require("./filesystem");
/**
 * gets the scheme off the front of an uri.
 * @param uri the uri to get the scheme for.
 * @returns the scheme, undefined if the uri has no scheme (colon)
 */
function schemeOf(uri) {
    assert_1.strict.ok(uri, (0, i18n_1.i) `Uri may not be empty`);
    return /^(\w*):/.exec(uri)?.[1];
}
exports.schemeOf = schemeOf;
class UnifiedFileSystem extends filesystem_1.FileSystem {
    filesystems = {};
    /** registers a scheme to a given filesystem
     *
     * @param scheme the Uri scheme to reserve
     * @param fileSystem the filesystem to associate with the scheme
     */
    register(scheme, fileSystem) {
        assert_1.strict.ok(!this.filesystems[scheme], (0, i18n_1.i) `scheme '${scheme}' already registered`);
        this.filesystems[scheme] = fileSystem;
        return this;
    }
    /**
     * gets the filesystem for the given uri.
     *
     * @param uri the uri to check the filesystem for
     *
     * @returns the filesystem. Will throw if no filesystem is valid.
     */
    filesystem(uri) {
        const scheme = schemeOf(uri.toString());
        assert_1.strict.ok(scheme, (0, i18n_1.i) `uri ${uri.toString()} has no scheme`);
        const filesystem = this.filesystems[scheme];
        assert_1.strict.ok(filesystem, (0, i18n_1.i) `scheme ${scheme} has no filesystem associated with it`);
        return filesystem;
    }
    /**
    * Creates a new URI from a string, e.g. `https://www.msft.com/some/path`,
    * `file:///usr/home`, or `scheme:with/path`.
    *
    * @param uri A string which represents an URI (see `URI#toString`).
    */
    parseUri(uri, _strict) {
        return this.filesystem(uri).parseUri(uri);
    }
    stat(uri) {
        return this.filesystem(uri).stat(uri);
    }
    async readDirectory(uri, options) {
        return this.filesystem(uri).readDirectory(uri, options);
    }
    createDirectory(uri) {
        return this.filesystem(uri).createDirectory(uri);
    }
    readFile(uri) {
        return this.filesystem(uri).readFile(uri);
    }
    openFile(uri) {
        return this.filesystem(uri).openFile(uri);
    }
    writeFile(uri, content) {
        return this.filesystem(uri).writeFile(uri, content);
    }
    readStream(uri, options) {
        return this.filesystem(uri).readStream(uri, options);
    }
    writeStream(uri, options) {
        return this.filesystem(uri).writeStream(uri, options);
    }
    delete(uri, options) {
        return this.filesystem(uri).delete(uri, options);
    }
    rename(source, target, options) {
        assert_1.strict.ok(source.fileSystem === target.fileSystem, (0, i18n_1.i) `may not rename across filesystems`);
        return source.fileSystem.rename(source, target, options);
    }
    copy(source, target, options) {
        return target.fileSystem.copy(source, target);
    }
    createSymlink(original, symlink) {
        return symlink.fileSystem.createSymlink(original, symlink);
    }
}
exports.UnifiedFileSystem = UnifiedFileSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pZmllZC1maWxlc3lzdGVtLmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImZzL3VuaWZpZWQtZmlsZXN5c3RlbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUNBQXVDO0FBQ3ZDLGtDQUFrQzs7O0FBRWxDLG1DQUFnQztBQUVoQyxrQ0FBNEI7QUFFNUIsNkNBQThGO0FBRTlGOzs7O0dBSUc7QUFDSCxTQUFnQixRQUFRLENBQUMsR0FBVztJQUNsQyxlQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFBLFFBQUMsRUFBQSxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3hDLE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFIRCw0QkFHQztBQUVELE1BQWEsaUJBQWtCLFNBQVEsdUJBQVU7SUFFdkMsV0FBVyxHQUFnQyxFQUFFLENBQUM7SUFFdEQ7Ozs7T0FJRztJQUNILFFBQVEsQ0FBQyxNQUFjLEVBQUUsVUFBc0I7UUFDN0MsZUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBQSxRQUFDLEVBQUEsV0FBVyxNQUFNLHNCQUFzQixDQUFDLENBQUM7UUFDL0UsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDdEMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksVUFBVSxDQUFDLEdBQWlCO1FBQ2pDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUV4QyxlQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFBLFFBQUMsRUFBQSxP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
// SIG // Begin signature block
// SIG // MIIoJwYJKoZIhvcNAQcCoIIoGDCCKBQCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // sRZBMBxBGlgwsbhIWxMtsY2CdT0RPX4OClbRYsxtIEyg
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
// SIG // a/15n8G9bW1qyVJzEw16UM0xghoJMIIaBQIBATCBlTB+
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQDEx9NaWNy
// SIG // b3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDExAhMzAAAE
// SIG // BGx0Bv9XKydyAAAAAAQEMA0GCWCGSAFlAwQCAQUAoIGu
// SIG // MBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEEMBwGCisG
// SIG // AQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3
// SIG // DQEJBDEiBCCuFqzGSaFAkUZipLh5sB0hca974Yh7qpoc
// SIG // Prmgv7ygTzBCBgorBgEEAYI3AgEMMTQwMqAUgBIATQBp
// SIG // AGMAcgBvAHMAbwBmAHShGoAYaHR0cDovL3d3dy5taWNy
// SIG // b3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBAEo3gGAK
// SIG // 3bLJ636jIe/5MxyxyP3ZUIlEGWKGPi9dsvnMjRywflpq
// SIG // dAr21FC+0DxOPdxP3F2fLA3I5ZyVwz+/ZpEavTawus0A
// SIG // juWi9svo84ivUeynXa5Prb4pEKu4D2Hsplu+2l9+V0rz
// SIG // Q0wPn6gQpApVU9uTAMOTwVO18F+w+wN45yiv9MO2WjgX
// SIG // mrk7oDlxi9lrDylND9OIm+uTreQLxR3jtfOI3C7WETEq
// SIG // h0hxIRzrLcAaNkdIl9O4+0Ax1S8JEOXEWjOeiJrJT1z4
// SIG // 4Xd+SOv7iR274g5CDt6NghO3dyRG4PgpGREfvDDjBw0A
// SIG // wJt3g2wRIYi0Valym/RzSHKJIeGhgheTMIIXjwYKKwYB
// SIG // BAGCNwMDATGCF38wghd7BgkqhkiG9w0BBwKgghdsMIIX
// SIG // aAIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBUQYLKoZIhvcN
// SIG // AQkQAQSgggFABIIBPDCCATgCAQEGCisGAQQBhFkKAwEw
// SIG // MTANBglghkgBZQMEAgEFAAQgj7TRTLM3nEfMMm8gqUWR
// SIG // DF+8790jiug2202/xSfkEqsCBmc/IxeYqRgSMjAyNDEy
// SIG // MDkyMTAzMzQuMTdaMASAAgH0oIHRpIHOMIHLMQswCQYD
// SIG // VQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
// SIG // A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0
// SIG // IENvcnBvcmF0aW9uMSUwIwYDVQQLExxNaWNyb3NvZnQg
// SIG // QW1lcmljYSBPcGVyYXRpb25zMScwJQYDVQQLEx5uU2hp
// SIG // ZWxkIFRTUyBFU046QTAwMC0wNUUwLUQ5NDcxJTAjBgNV
// SIG // BAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2Wg
// SIG // ghHqMIIHIDCCBQigAwIBAgITMwAAAevgGGy1tu847QAB
// SIG // AAAB6zANBgkqhkiG9w0BAQsFADB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMDAeFw0yMzEyMDYxODQ1MzRaFw0y
// SIG // NTAzMDUxODQ1MzRaMIHLMQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSUwIwYDVQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVy
// SIG // YXRpb25zMScwJQYDVQQLEx5uU2hpZWxkIFRTUyBFU046
// SIG // QTAwMC0wNUUwLUQ5NDcxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2UwggIiMA0GCSqGSIb3
// SIG // DQEBAQUAA4ICDwAwggIKAoICAQDBFWgh2lbgV3eJp01o
// SIG // qiaFBuYbNc7hSKmktvJ15NrB/DBboUow8WPOTPxbn7gc
// SIG // mIOGmwJkd+TyFx7KOnzrxnoB3huvv91fZuUugIsKTnAv
// SIG // g2BU/nfN7Zzn9Kk1mpuJ27S6xUDH4odFiX51ICcKl6EG
// SIG // 4cxKgcDAinihT8xroJWVATL7p8bbfnwsc1pihZmcvIuY
// SIG // Gnb1TY9tnpdChWr9EARuCo3TiRGjM2Lp4piT2lD5hnd3
// SIG // VaGTepNqyakpkCGV0+cK8Vu/HkIZdvy+z5EL3ojTdFLL
// SIG // 5vJ9IAogWf3XAu3d7SpFaaoeix0e1q55AD94ZwDP+izq
// SIG // LadsBR3tzjq2RfrCNL+Tmi/jalRto/J6bh4fPhHETnDC
// SIG // 78T1yfXUQdGtmJ/utI/ANxi7HV8gAPzid9TYjMPbYqG8
// SIG // y5xz+gI/SFyj+aKtHHWmKzEXPttXzAcexJ1EH7wbuiVk
// SIG // 3sErPK9MLg1Xb6hM5HIWA0jEAZhKEyd5hH2XMibzakbp
// SIG // 2s2EJQWasQc4DMaF1EsQ1CzgClDYIYG6rUhudfI7k8L9
// SIG // KKCEufRbK5ldRYNAqddr/ySJfuZv3PS3+vtD6X6q1H4U
// SIG // OmjDKdjoW3qs7JRMZmH9fkFkMzb6YSzr6eX1LoYm3PrO
// SIG // 1Jea43SYzlB3Tz84OvuVSV7NcidVtNqiZeWWpVjfavR+
// SIG // Jj/JOQIDAQABo4IBSTCCAUUwHQYDVR0OBBYEFHSeBazW
// SIG // Vcxu4qT9O5jT2B+qAerhMB8GA1UdIwQYMBaAFJ+nFV0A
// SIG // XmJdg/Tl0mWnG1M1GelyMF8GA1UdHwRYMFYwVKBSoFCG
// SIG // Tmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMv
// SIG // Y3JsL01pY3Jvc29mdCUyMFRpbWUtU3RhbXAlMjBQQ0El
// SIG // MjAyMDEwKDEpLmNybDBsBggrBgEFBQcBAQRgMF4wXAYI
// SIG // KwYBBQUHMAKGUGh0dHA6Ly93d3cubWljcm9zb2Z0LmNv
// SIG // bS9wa2lvcHMvY2VydHMvTWljcm9zb2Z0JTIwVGltZS1T
// SIG // dGFtcCUyMFBDQSUyMDIwMTAoMSkuY3J0MAwGA1UdEwEB
// SIG // /wQCMAAwFgYDVR0lAQH/BAwwCgYIKwYBBQUHAwgwDgYD
// SIG // VR0PAQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4ICAQCD
// SIG // dN8voPd8C+VWZP3+W87c/QbdbWK0sOt9Z4kEOWng7Kmh
// SIG // +WD2LnPJTJKIEaxniOct9wMgJ8yQywR8WHgDOvbwqdqs
// SIG // LUaM4NrertI6FI9rhjheaKxNNnBZzHZLDwlkL9vCEDe9
// SIG // Rc0dGSVd5Bg3CWknV3uvVau14F55ESTWIBNaQS9Cpo2O
// SIG // pz3cRgAYVfaLFGbArNcRvSWvSUbeI2IDqRxC4xBbRiNQ
// SIG // +1qHXDCPn0hGsXfL+ynDZncCfszNrlgZT24XghvTzYMH
// SIG // cXioLVYo/2Hkyow6dI7uULJbKxLX8wHhsiwriXIDCnjL
// SIG // VsG0E5bR82QgcseEhxbU2d1RVHcQtkUE7W9zxZqZ6/jP
// SIG // maojZgXQO33XjxOHYYVa/BXcIuu8SMzPjjAAbujwTawp
// SIG // azLBv997LRB0ZObNckJYyQQpETSflN36jW+z7R/nGyJq
// SIG // RZ3HtZ1lXW1f6zECAeP+9dy6nmcCrVcOqbQHX7Zr8WPc
// SIG // ghHJAADlm5ExPh5xi1tNRk+i6F2a9SpTeQnZXP50w+Jo
// SIG // TxISQq7vBij2nitAsSLaVeMqoPi+NXlTUNZ2NdtbFr6I
// SIG // ir9ZK9ufaz3FxfvDZo365vLOozmQOe/Z+pu4vY5zPmtN
// SIG // iVIcQnFy7JZOiZVDI5bIdwQRai2quHKJ6ltUdsi3HjNn
// SIG // ieuE72fT4eWhxtmnN5HYCDCCB3EwggVZoAMCAQICEzMA
// SIG // AAAVxedrngKbSZkAAAAAABUwDQYJKoZIhvcNAQELBQAw
// SIG // gYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xMjAwBgNVBAMTKU1p
// SIG // Y3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhvcml0
// SIG // eSAyMDEwMB4XDTIxMDkzMDE4MjIyNVoXDTMwMDkzMDE4
// SIG // MzIyNVowfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldh
// SIG // c2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNV
// SIG // BAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UE
// SIG // AxMdTWljcm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAw
// SIG // ggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDk
// SIG // 4aZM57RyIQt5osvXJHm9DtWC0/3unAcH0qlsTnXIyjVX
// SIG // 9gF/bErg4r25PhdgM/9cT8dm95VTcVrifkpa/rg2Z4VG
// SIG // Iwy1jRPPdzLAEBjoYH1qUoNEt6aORmsHFPPFdvWGUNzB
// SIG // RMhxXFExN6AKOG6N7dcP2CZTfDlhAnrEqv1yaa8dq6z2
// SIG // Nr41JmTamDu6GnszrYBbfowQHJ1S/rboYiXcag/PXfT+
// SIG // jlPP1uyFVk3v3byNpOORj7I5LFGc6XBpDco2LXCOMcg1
// SIG // KL3jtIckw+DJj361VI/c+gVVmG1oO5pGve2krnopN6zL
// SIG // 64NF50ZuyjLVwIYwXE8s4mKyzbnijYjklqwBSru+cakX
// SIG // W2dg3viSkR4dPf0gz3N9QZpGdc3EXzTdEonW/aUgfX78
// SIG // 2Z5F37ZyL9t9X4C626p+Nuw2TPYrbqgSUei/BQOj0XOm
// SIG // TTd0lBw0gg/wEPK3Rxjtp+iZfD9M269ewvPV2HM9Q07B
// SIG // MzlMjgK8QmguEOqEUUbi0b1qGFphAXPKZ6Je1yh2AuIz
// SIG // GHLXpyDwwvoSCtdjbwzJNmSLW6CmgyFdXzB0kZSU2LlQ
// SIG // +QuJYfM2BjUYhEfb3BvR/bLUHMVr9lxSUV0S2yW6r1AF
// SIG // emzFER1y7435UsSFF5PAPBXbGjfHCBUYP3irRbb1Hode
// SIG // 2o+eFnJpxq57t7c+auIurQIDAQABo4IB3TCCAdkwEgYJ
// SIG // KwYBBAGCNxUBBAUCAwEAATAjBgkrBgEEAYI3FQIEFgQU
// SIG // KqdS/mTEmr6CkTxGNSnPEP8vBO4wHQYDVR0OBBYEFJ+n
// SIG // FV0AXmJdg/Tl0mWnG1M1GelyMFwGA1UdIARVMFMwUQYM
// SIG // KwYBBAGCN0yDfQEBMEEwPwYIKwYBBQUHAgEWM2h0dHA6
// SIG // Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvRG9jcy9S
// SIG // ZXBvc2l0b3J5Lmh0bTATBgNVHSUEDDAKBggrBgEFBQcD
// SIG // CDAZBgkrBgEEAYI3FAIEDB4KAFMAdQBiAEMAQTALBgNV
// SIG // HQ8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSME
// SIG // GDAWgBTV9lbLj+iiXGJo0T2UkFvXzpoYxDBWBgNVHR8E
// SIG // TzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5j
// SIG // b20vcGtpL2NybC9wcm9kdWN0cy9NaWNSb29DZXJBdXRf
// SIG // MjAxMC0wNi0yMy5jcmwwWgYIKwYBBQUHAQEETjBMMEoG
// SIG // CCsGAQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5j
// SIG // b20vcGtpL2NlcnRzL01pY1Jvb0NlckF1dF8yMDEwLTA2
// SIG // LTIzLmNydDANBgkqhkiG9w0BAQsFAAOCAgEAnVV9/Cqt
// SIG // 4SwfZwExJFvhnnJL/Klv6lwUtj5OR2R4sQaTlz0xM7U5
// SIG // 18JxNj/aZGx80HU5bbsPMeTCj/ts0aGUGCLu6WZnOlNN
// SIG // 3Zi6th542DYunKmCVgADsAW+iehp4LoJ7nvfam++Kctu
// SIG // 2D9IdQHZGN5tggz1bSNU5HhTdSRXud2f8449xvNo32X2
// SIG // pFaq95W2KFUn0CS9QKC/GbYSEhFdPSfgQJY4rPf5KYnD
// SIG // vBewVIVCs/wMnosZiefwC2qBwoEZQhlSdYo2wh3DYXMu
// SIG // LGt7bj8sCXgU6ZGyqVvfSaN0DLzskYDSPeZKPmY7T7uG
// SIG // +jIa2Zb0j/aRAfbOxnT99kxybxCrdTDFNLB62FD+Cljd
// SIG // QDzHVG2dY3RILLFORy3BFARxv2T5JL5zbcqOCb2zAVdJ
// SIG // VGTZc9d/HltEAY5aGZFrDZ+kKNxnGSgkujhLmm77IVRr
// SIG // akURR6nxt67I6IleT53S0Ex2tVdUCbFpAUR+fKFhbHP+
// SIG // CrvsQWY9af3LwUFJfn6Tvsv4O+S3Fb+0zj6lMVGEvL8C
// SIG // wYKiexcdFYmNcP7ntdAoGokLjzbaukz5m/8K6TT4JDVn
// SIG // K+ANuOaMmdbhIurwJ0I9JZTmdHRbatGePu1+oDEzfbzL
// SIG // 6Xu/OHBE0ZDxyKs6ijoIYn/ZcGNTTY3ugm2lBRDBcQZq
// SIG // ELQdVTNYs6FwZvKhggNNMIICNQIBATCB+aGB0aSBzjCB
// SIG // yzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjElMCMGA1UECxMcTWlj
// SIG // cm9zb2Z0IEFtZXJpY2EgT3BlcmF0aW9uczEnMCUGA1UE
// SIG // CxMeblNoaWVsZCBUU1MgRVNOOkEwMDAtMDVFMC1EOTQ3
// SIG // MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBT
// SIG // ZXJ2aWNloiMKAQEwBwYFKw4DAhoDFQCABol1u1wwwYgU
// SIG // tUowMnqYvbul3qCBgzCBgKR+MHwxCzAJBgNVBAYTAlVT
// SIG // MRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdS
// SIG // ZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBUaW1lLVN0
// SIG // YW1wIFBDQSAyMDEwMA0GCSqGSIb3DQEBCwUAAgUA6wFb
// SIG // SzAiGA8yMDI0MTIwOTEyMDQyN1oYDzIwMjQxMjEwMTIw
// SIG // NDI3WjB0MDoGCisGAQQBhFkKBAExLDAqMAoCBQDrAVtL
// SIG // AgEAMAcCAQACAi26MAcCAQACAhNuMAoCBQDrAqzLAgEA
// SIG // MDYGCisGAQQBhFkKBAIxKDAmMAwGCisGAQQBhFkKAwKg
// SIG // CjAIAgEAAgMHoSChCjAIAgEAAgMBhqAwDQYJKoZIhvcN
// SIG // AQELBQADggEBAH+evW1MjNw+3kyHb6s3OE5vsB8tL0EI
// SIG // gUTa2bQSvyzXlxTv4udB/Vlb9cR+pBFAa6ziqdvI2AeU
// SIG // 6rOL7cPgRr7gKY6XgrJrR/48MTvsGjK5x7noeB94KrPs
// SIG // 8KHCqm3F2rR9qNC2IsWuf7ZKzcXfUOzUIjSVwm1VM16o
// SIG // leey0Q+Vk8Gzuj/jGv/TuHWcVioWoTFrpgeNEqETKxKA
// SIG // aPfnz/SdvJG2D9o9vX2VaAz/8NasoEmppqaUVbxoqFJo
// SIG // 7q7CsFWFaKF3mDSFMWaV/t3wmQGddHhwDxUhHnUKZw7t
// SIG // V/KExFzs8C+BoTbsrDp4gQCjIb2jN7wJwBlsUa8qwKtd
// SIG // vdcxggQNMIIECQIBATCBkzB8MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFt
// SIG // cCBQQ0EgMjAxMAITMwAAAevgGGy1tu847QABAAAB6zAN
// SIG // BglghkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0G
// SIG // CyqGSIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCBO6OcZ
// SIG // VRZqleIMrmmtXkXY+RLP/nW/Lvsys1X20NruqTCB+gYL
// SIG // KoZIhvcNAQkQAi8xgeowgecwgeQwgb0EIM63a75faQPh
// SIG // f8SBDTtk2DSUgIbdizXsz76h1JdhLCz4MIGYMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTACEzMAAAHr
// SIG // 4BhstbbvOO0AAQAAAeswIgQgVcT+5IAifkEuEhwZQwkA
// SIG // wDr0Ow5lmv69fdYuBK0+7UQwDQYJKoZIhvcNAQELBQAE
// SIG // ggIAA2qm3KA4CqfdSmsKB0vG+9yAOLYeyiNmN2Ih6wX9
// SIG // Z55bqBNZI7lZB6sg8loMUjbG/7EN4VnnHwAPMWrW84ZM
// SIG // jYqt1EglEfxBK/ZRkgyjaa72XsLz/EiL8SEmHICQzg2I
// SIG // D1h8q0Xb3WshAaQQJi2+74ZKARVdooh+53FzCqgwcGBV
// SIG // af4S+iJZcBFmsfeC5SALS6SpC1QUWfCulXL2FG55LOH9
// SIG // ZqmdTWrInyvYSLZOnbMaM9Qo5M6GhnWC3f654ZJxlrtd
// SIG // JCikzJATQ7XfS2Kx21iyDbMoXhZPt9Ds6KxNlKphGKxt
// SIG // qg9mXtHsord6ihbTbu24X8nqzSGkjf7YjG3g1L5n5o+U
// SIG // LTzPlVwcn13B5BvuphjC/JyYLkh9DfZB3agInl0bHwdo
// SIG // Jl+rUVeXtEqb8NUXaCvpKiIxExJ/GlhEE/Hs6SeBy+6j
// SIG // GiKdba+UnlcHdA6pZQHjUAGYddIPVRgJcQhJw7+jljs2
// SIG // qUPtiRWvEPkUCROJekQU9NrFVlqNIqlkzB58ALn/ktV9
// SIG // tMvYDj2OePRiNDV7ydk9jwtmVJtU9goM2GNtAhDrtrFI
// SIG // m0DHzT7ADR+0RL6vDQnxGHg5FDw9n3kA/Rzmi8/8B/tN
// SIG // R42qiyJVowr7RSsfMAObV3hcxDRrgmCutvVpy1nNwgbb
// SIG // 0BL3X5FiUTIBGmm0p6fpykoUXxU=
// SIG // End signature block
