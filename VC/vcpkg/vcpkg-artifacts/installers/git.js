"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.installGit = void 0;
const git_1 = require("../archivers/git");
const i18n_1 = require("../i18n");
const vcpkg_1 = require("../vcpkg");
async function installGit(session, name, version, targetLocation, install, events, options) {
    const gitPath = await (0, vcpkg_1.vcpkgFetch)(session, 'git');
    if (!gitPath) {
        throw new Error((0, i18n_1.i) `Git is not installed`);
    }
    const repo = session.parseLocation(install.location);
    const targetDirectory = targetLocation.join(options.subdirectory ?? '');
    const gitTool = new git_1.Git(gitPath, targetDirectory);
    events.unpackArchiveStart?.(repo);
    // changing the clone process to do an init/add remote/fetch/checkout because
    // it's far faster to clone a specific commit and this allows us to support
    // recursive shallow submodules as well.
    if (!await gitTool.init()) {
        events.unpackArchiveHeartbeat?.((0, i18n_1.i) `Initializing repository folder`);
        throw new Error((0, i18n_1.i) `Failed to initialize git repository folder (${targetDirectory.fsPath})`);
    }
    if (!await gitTool.addRemote('origin', repo)) {
        events.unpackArchiveHeartbeat?.((0, i18n_1.i) `Adding remote ${repo.toString()} to git repository folder`);
        throw new Error((0, i18n_1.i) `Failed to set git origin (${repo.toString()}) in folder (${targetDirectory.fsPath})`);
    }
    if (!await gitTool.fetch('origin', events, { commit: install.commit, depth: install.full ? undefined : 1 })) {
        events.unpackArchiveHeartbeat?.((0, i18n_1.i) `Fetching remote ${repo.toString()} for git repository folder`);
        throw new Error((0, i18n_1.i) `Unable to fetch git data for (${repo.toString()}) in folder (${targetDirectory.fsPath})`);
    }
    if (!await gitTool.checkout(events, { commit: 'FETCH_HEAD' })) {
        events.unpackArchiveHeartbeat?.((0, i18n_1.i) `Checking out commit ${install.commit} for ${repo.toString()} to git repository folder`);
        throw new Error((0, i18n_1.i) `Unable to checkout data for (${repo.toString()}) in folder (${targetDirectory.fsPath})`);
    }
    if (install.recurse) {
        events.unpackArchiveHeartbeat?.((0, i18n_1.i) `Updating submodules for repository ${repo.toString()} in the git repository folder`);
        if (!await gitTool.config('.gitmodules', 'submodule.*.shallow', 'true')) {
            throw new Error((0, i18n_1.i) `Unable to set submodule shallow data for (${repo.toString()}) in folder (${targetDirectory.fsPath})`);
        }
        if (!await gitTool.updateSubmodules(events, { init: true, recursive: true, depth: install.full ? undefined : 1 })) {
            throw new Error((0, i18n_1.i) `Unable update submodules for (${repo.toString()}) in folder (${targetDirectory.fsPath})`);
        }
    }
}
exports.installGit = installGit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0LmpzIiwic291cmNlUm9vdCI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9taWNyb3NvZnQvdmNwa2ctdG9vbC9tYWluL3ZjcGtnLWFydGlmYWN0cy8iLCJzb3VyY2VzIjpbImluc3RhbGxlcnMvZ2l0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsa0NBQWtDOzs7QUFFbEMsMENBQXFEO0FBQ3JELGtDQUE0QjtBQUs1QixvQ0FBc0M7QUFFL0IsS0FBSyxVQUFVLFVBQVUsQ0FBQyxPQUFnQixFQUFFLElBQVksRUFBRSxPQUFlLEVBQUUsY0FBbUIsRUFBRSxPQUFxQixFQUFFLE1BQThCLEVBQUUsT0FBK0Q7SUFDM04sTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFBLGtCQUFVLEVBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWpELElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixNQUFNLElBQUksS0FBSyxDQUFDLElBQUEsUUFBQyxFQUFBLHNCQUFzQixDQUFDLENBQUM7S0FDMUM7SUFFRCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNyRCxNQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDLENBQUM7SUFFeEUsTUFBTSxPQUFPLEdBQUcsSUFBSSxTQUFHLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ2xELE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWxDLDZFQUE2RTtJQUM3RSwyRUFBMkU7SUFDM0Usd0NBQXdDO0lBRXhDLElBQUksQ0FBRSxNQUFNLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUMxQixNQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxJQUFBLFFBQUMsRUFBQSxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ25F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
// SIG // Begin signature block
// SIG // MIIoKwYJKoZIhvcNAQcCoIIoHDCCKBgCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // wZVc+SfnI7qI7YQADgtGMTcvOGlMZu6bybnxpnTkn+eg
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
// SIG // a/15n8G9bW1qyVJzEw16UM0xghoNMIIaCQIBATCBlTB+
// SIG // MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
// SIG // bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
// SIG // cm9zb2Z0IENvcnBvcmF0aW9uMSgwJgYDVQQDEx9NaWNy
// SIG // b3NvZnQgQ29kZSBTaWduaW5nIFBDQSAyMDExAhMzAAAE
// SIG // BGx0Bv9XKydyAAAAAAQEMA0GCWCGSAFlAwQCAQUAoIGu
// SIG // MBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEEMBwGCisG
// SIG // AQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3
// SIG // DQEJBDEiBCBeGCYfTUQw7et7iqK5lzu4Nq6cIzj+W9XV
// SIG // 7sC2uBzpmzBCBgorBgEEAYI3AgEMMTQwMqAUgBIATQBp
// SIG // AGMAcgBvAHMAbwBmAHShGoAYaHR0cDovL3d3dy5taWNy
// SIG // b3NvZnQuY29tMA0GCSqGSIb3DQEBAQUABIIBAB2uW6zx
// SIG // ic0U0HznphwMhogmlas80awR/0nYbo6fnIedWp8d5w1g
// SIG // 1St4AIYrg5ZGANiHwGTNV4x55v9S8iynq0512DNovQkH
// SIG // 1V7Wu2sAdY7GlWNxGk7BGW5POlrJjF+k/HH0w2DOws/W
// SIG // j4YKLumY31UADmQhmU0Y2OTffOzvvKM/BFQk8X/rKT5P
// SIG // clj312FgumfP2P1+9UP3HVTkJF4k6b043piQVFUas3uW
// SIG // IQjD5Mc2ZEcHcnDTiorfiSiWsFHk/ZXdGNUQZGcaXD8U
// SIG // EPfc7g0voLv1ZiB8cSdtQB2d2TfrYb6sNgLBkcZn2xVY
// SIG // xuuoPt2EA00+G/Kow/YQW+DT/v6hgheXMIIXkwYKKwYB
// SIG // BAGCNwMDATGCF4Mwghd/BgkqhkiG9w0BBwKgghdwMIIX
// SIG // bAIBAzEPMA0GCWCGSAFlAwQCAQUAMIIBUgYLKoZIhvcN
// SIG // AQkQAQSgggFBBIIBPTCCATkCAQEGCisGAQQBhFkKAwEw
// SIG // MTANBglghkgBZQMEAgEFAAQgPmLEZ5ByfQMihfmAivma
// SIG // yJVnIiBJuhet1nY4LPBjfZ8CBmc/GeJ/OBgTMjAyNDEy
// SIG // MDkyMTAzMzQuMTAxWjAEgAIB9KCB0aSBzjCByzELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0
// SIG // IEFtZXJpY2EgT3BlcmF0aW9uczEnMCUGA1UECxMeblNo
// SIG // aWVsZCBUU1MgRVNOOkE5MzUtMDNFMC1EOTQ3MSUwIwYD
// SIG // VQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNl
// SIG // oIIR7TCCByAwggUIoAMCAQICEzMAAAHpD3Ewfl3xEjYA
// SIG // AQAAAekwDQYJKoZIhvcNAQELBQAwfDELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBIDIwMTAwHhcNMjMxMjA2MTg0NTI2WhcN
// SIG // MjUwMzA1MTg0NTI2WjCByzELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3Bl
// SIG // cmF0aW9uczEnMCUGA1UECxMeblNoaWVsZCBUU1MgRVNO
// SIG // OkE5MzUtMDNFMC1EOTQ3MSUwIwYDVQQDExxNaWNyb3Nv
// SIG // ZnQgVGltZS1TdGFtcCBTZXJ2aWNlMIICIjANBgkqhkiG
// SIG // 9w0BAQEFAAOCAg8AMIICCgKCAgEArJqMMUEVYKeE0nN5
// SIG // 02usqwDyZ1egO2mWJ08P8sfdLtQ0h/PZ730Dc2/uX5gS
// SIG // vKaR++k5ic4x1HCJnfOOQP6b2WOTvDwgbuxqvseV3uqZ
// SIG // ULeMcFVFHECE8ZJTmdUZvXyeZ4fIJ8TsWnsxTDONbAyO
// SIG // yzKSsCCkDMFw3LWCrwskMupDtrFSwetpBfPdmcHGKYiF
// SIG // cdy09Sz3TLdSHkt+SmOTMcpUXU0uxNSaHJd9DYHAYiX6
// SIG // pzHHtOXhIqSLEzuAyJ//07T9Ucee1V37wjvDUgofXcbM
// SIG // r54NJVFWPrq6vxvEERaDpf+6DiNEX/EIPt4cmGsh7CPc
// SIG // Lbwxxp099Da+Ncc06cNiOmVmiIT8DLuQ73ZBBs1e72E9
// SIG // 7W/bU74mN6bLpdU+Q/d/PwHzS6mp1QibT+Ms9FSQUhlf
// SIG // oeumXGlCTsaW0iIyJmjixdfDTo5n9Z8A2rbAaLl1lxSu
// SIG // xOUtFS0cqE6gwsRxuJlt5qTUKKTP1NViZ47LFkJbivHm
// SIG // /jAypZPRP4TgWCrNin3kOBxu3TnCvsDDmphn8L5CHu3Z
// SIG // Mpc5vAXgFEAvC8awEMpIUh8vhWkPdwwJX0GKMGA7cxl6
// SIG // hOsDgE3ihSN9LvWJcQ08wLiwytO93J3TFeKmg93rlwOs
// SIG // VDQqM4O64oYh1GjONwJm/RBrkZdNtvsj8HJZspLLJN9G
// SIG // uEad7/UCAwEAAaOCAUkwggFFMB0GA1UdDgQWBBSRfjOJ
// SIG // xQh2I7iI9Frr/o3I7QfsTjAfBgNVHSMEGDAWgBSfpxVd
// SIG // AF5iXYP05dJlpxtTNRnpcjBfBgNVHR8EWDBWMFSgUqBQ
// SIG // hk5odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3Bz
// SIG // L2NybC9NaWNyb3NvZnQlMjBUaW1lLVN0YW1wJTIwUENB
// SIG // JTIwMjAxMCgxKS5jcmwwbAYIKwYBBQUHAQEEYDBeMFwG
// SIG // CCsGAQUFBzAChlBodHRwOi8vd3d3Lm1pY3Jvc29mdC5j
// SIG // b20vcGtpb3BzL2NlcnRzL01pY3Jvc29mdCUyMFRpbWUt
// SIG // U3RhbXAlMjBQQ0ElMjAyMDEwKDEpLmNydDAMBgNVHRMB
// SIG // Af8EAjAAMBYGA1UdJQEB/wQMMAoGCCsGAQUFBwMIMA4G
// SIG // A1UdDwEB/wQEAwIHgDANBgkqhkiG9w0BAQsFAAOCAgEA
// SIG // VrEqfq5rMRS3utQBPdCnp9lz4EByQ4kuEmy4b831Ywzw
// SIG // 5jnURO+bkKIWIRTHRsBym1ZiytJR1dQKc/x3ImaKMnqA
// SIG // L5B0Gh5i4cARpKMgAFcXGmlJxzSFEvS73i9ND8JnEgy4
// SIG // DdFfxcpNtEKRwxLpMCkfJH2gRF/NwMr0M5X/26AzaFih
// SIG // IKXQLC/Esws1xS5w6M8wiRqtEc8EIHhAa/BOCtsENlly
// SIG // P2ScWUv/ndxXcBuBKwRc81Ikm1dpt8bDD93KgkRQ7SdQ
// SIG // t/yZ41zAoZ5vWyww9cGie0z6ecGHb9DpffmjdLdQZjsw
// SIG // o/A5qirlMM4AivU47cOSlI2jukI3oB853V/7Wa2O/dnX
// SIG // 0QF6+XRqypKbLCB6uq61juD5S9zkvuHIi/5fKZvqDSV1
// SIG // hl2CS+R+izZyslyVRMP9RWzuPhs/lOHxRcbNkvFML6wW
// SIG // 2HHFUPTvhZY+8UwHiEybB6bQL0RKgnPv2Mc4SCpAPPEP
// SIG // EISSlA7Ws2rSR+2TnYtCwisIKkDuB/NSmRg0i5LRbzUY
// SIG // YfGQQHp59aVvuVARmM9hqYHMVVyk9QrlGHZR0fQ+ja1Y
// SIG // RqnYRk4OzoP3f/KDJTxt2I7qhcYnYiLKAMNvjISNc16y
// SIG // IuereiZCe+SevRfpZIfZsiSaTZMeNbEgdVytoyVoKu1Z
// SIG // Qbj9Qbl42d6oMpva9cL9DLUwggdxMIIFWaADAgECAhMz
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
// SIG // ahC0HVUzWLOhcGbyoYIDUDCCAjgCAQEwgfmhgdGkgc4w
// SIG // gcsxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xJTAjBgNVBAsTHE1p
// SIG // Y3Jvc29mdCBBbWVyaWNhIE9wZXJhdGlvbnMxJzAlBgNV
// SIG // BAsTHm5TaGllbGQgVFNTIEVTTjpBOTM1LTAzRTAtRDk0
// SIG // NzElMCMGA1UEAxMcTWljcm9zb2Z0IFRpbWUtU3RhbXAg
// SIG // U2VydmljZaIjCgEBMAcGBSsOAwIaAxUAq2mH9cQ5NqzJ
// SIG // 1P1SaNhhitZ8aPGggYMwgYCkfjB8MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1T
// SIG // dGFtcCBQQ0EgMjAxMDANBgkqhkiG9w0BAQsFAAIFAOsB
// SIG // UhUwIhgPMjAyNDEyMDkxMTI1MDlaGA8yMDI0MTIxMDEx
// SIG // MjUwOVowdzA9BgorBgEEAYRZCgQBMS8wLTAKAgUA6wFS
// SIG // FQIBADAKAgEAAgIifAIB/zAHAgEAAgISszAKAgUA6wKj
// SIG // lQIBADA2BgorBgEEAYRZCgQCMSgwJjAMBgorBgEEAYRZ
// SIG // CgMCoAowCAIBAAIDB6EgoQowCAIBAAIDAYagMA0GCSqG
// SIG // SIb3DQEBCwUAA4IBAQCD/yfspwYz+dee6lxHZ+k1ULp5
// SIG // 6acgHsEVyuqg+X74q+DtXTzMPDQfzlr2Xd649+9N8tMq
// SIG // 6LE+09vAYz4yex/iuHgZP9a6IkAS1qZr344lczKsMzY7
// SIG // l9Geexa88AEG45rZRUiryXHYZo/L921vCnip/EiEjgxA
// SIG // za7PBcvn6aEOLrw9Ax3cSzaQoQ7EOhU+tCju6wA4BPBh
// SIG // 4/+t4716ilDyILUEV/gFhEzIQQKN8HGL4Xas99PmroLS
// SIG // 2/fw1Tu/gSZvjbVAfddLpobVFxClRnJwTAbb/re2ARsD
// SIG // eZVz1wKMKhuoNWcMla5aVWu8etuGjg55huUcH8PA7YVU
// SIG // J2of24W6MYIEDTCCBAkCAQEwgZMwfDELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBIDIwMTACEzMAAAHpD3Ewfl3xEjYAAQAA
// SIG // AekwDQYJYIZIAWUDBAIBBQCgggFKMBoGCSqGSIb3DQEJ
// SIG // AzENBgsqhkiG9w0BCRABBDAvBgkqhkiG9w0BCQQxIgQg
// SIG // 62oO006m5wSFMj/1JKxkrbs1T2AxwQdIXx3w5It+Oxcw
// SIG // gfoGCyqGSIb3DQEJEAIvMYHqMIHnMIHkMIG9BCCkkJJ4
// SIG // l2k3Jo9UykFhfsdlOK4laKxg/E8JoFWzfarEJTCBmDCB
// SIG // gKR+MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMT
// SIG // HU1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMz
// SIG // AAAB6Q9xMH5d8RI2AAEAAAHpMCIEIBYJAMJBRqn+XM2l
// SIG // WElh3ibesWz288iPj1kta7iZyaKwMA0GCSqGSIb3DQEB
// SIG // CwUABIICAAiEp/6W8ecB2NVoOdLZ3e9VnmxICx0Iowfl
// SIG // CbF5L4DXd/wwCA05o9mCcR/b5eAdovIp5GhveEqHkS3B
// SIG // adI6T0Rbx3tUxbiZGNpgXuRBQiKtA8Hg/0Lfe/TRyC3c
// SIG // KwOgNSGfgiVwiBt4hYKPj1OiOKl/t6NtQJQlBTz0G3k4
// SIG // fwSK+luUHpJ80LKiBSjRKXkXfvb7bc542zdzaSJSWLbE
// SIG // IngkUPM3myHIxXE0LLeHez07YXrpwAgVD77mv0pns1GC
// SIG // 3Wbee8tQXuqvLCg0ONok0GnJBNf7w3eXCKGv1lK0aUeS
// SIG // ZhDNqx37Uhky1WnAYQK7shn5zGV4yXNtTVgKYjUyVR+G
// SIG // zh8k9KxM+w7Y3wZAnuxlQTAy7tphhLD79/Nf91r9SxM/
// SIG // H9PJGgQtxfPWcBa4aozfY+j6rRCCm1cCai6x9MeQGpqA
// SIG // FLRaB2CQGlSFO8d8UmkWXyeF180aa6nfWvKb9GTu7z5s
// SIG // 2YGY6m1iHfsi0nCtk3DiBcTUnWhphlnPgWCGOiGRy4p2
// SIG // g9/mP5neCT/fM58p5y/+LX3Ye6DFuHF6JfT0/si3Pjt5
// SIG // G/89PnTizmbOjGIfmvO55bKmCvKa5pesb+hyqapqLzLY
// SIG // V/DYREbRj8/yG8n+eUf0JkAWv/LboN4VfjKWtATUvooZ
// SIG // +Rw4Kie3yGUhldCeDl04nriKHv50VQLT
// SIG // End signature block
