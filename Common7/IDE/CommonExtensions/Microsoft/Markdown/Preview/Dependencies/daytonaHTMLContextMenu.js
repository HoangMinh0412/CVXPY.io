const plugin = require("plugin-vs-v2");

let SaveAPI = null;

var menuItems = new Array();
var htmlContextMenu;
var copyLabel;
var saveLabel;
var printLabel;

const copyCommand = () => {

    const selectedText = window.getSelection().toString();

    navigator.clipboard.writeText(selectedText).then(() => {
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
};

const saveCommand = () => {
    SaveAPI ??= plugin.JSONMarshaler.attachToMarshaledObject("SaveObject", {
        save: function (html) {
            return this._call("SaveHtmlContent", html);
        }

    }, true);

    var htmlContent = document.querySelector("html").innerHTML;
    SaveAPI.save(htmlContent);
};

const printCommand = () => {
    window.print();
};

// Uncomment access key and event listener when the Daytona Key down event can handle 2 keys being pressed
// Will verify that pressing the keys trigger the commands
// Bug 2175234 needs to be resolved first

/* document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key == "p") {
        printCommand();
    }

    if (event.ctrlKey && event.key == "s") {
        saveCommand();
    }

    if (event.ctrlKey && event.key == "c") {
        copyCommand();
    }
}); */

const createMenuItems = () => {
    return [
        {
            id: "Copy",
            callback: copyCommand,
            label: copyLabel,
            type: plugin.ContextMenu.MenuItemType.command,
            //accessKey: "Ctrl+C",
        },
        {
            id: "Save",
            callback: saveCommand,
            label: saveLabel,
            type: plugin.ContextMenu.MenuItemType.command,
            // accessKey: "Ctrl+S",
        },
        {
            id: "Print",
            callback: printCommand,
            label: printLabel,
            type: plugin.ContextMenu.MenuItemType.command,
            // accessKey: "Ctrl+P",
        }
    ];
};

plugin.Messaging.addEventListener("pluginready", function () {
    copyLabel = plugin.Resources.getString("CopyMenuItem");
    saveLabel = plugin.Resources.getString("SaveAsHTMLMenuItem");
    printLabel = plugin.Resources.getString("PrintHTMLMenuItem");

    menuItems = createMenuItems();

    htmlContextMenu = plugin.ContextMenu.create(menuItems, null, null, null, null);
    htmlContextMenu.attach(document.getElementById("___markdown-content___"));
    return htmlContextMenu;
});
// SIG // Begin signature block
// SIG // MIIoWQYJKoZIhvcNAQcCoIIoSjCCKEYCAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // mowwAMySSdxfMYSOGR94Pd1yVkNOHNv4PkNqk6o7ttKg
// SIG // gg2LMIIGCTCCA/GgAwIBAgITMwAAA/S4xF3hTnC2fgAA
// SIG // AAAD9DANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTI0MDcxNzIxMDIzNVoX
// SIG // DTI1MDkxNTIxMDIzNVowgYgxCzAJBgNVBAYTAlVTMRMw
// SIG // EQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRt
// SIG // b25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRp
// SIG // b24xMjAwBgNVBAMTKU1pY3Jvc29mdCAzcmQgUGFydHkg
// SIG // QXBwbGljYXRpb24gQ29tcG9uZW50MIIBIjANBgkqhkiG
// SIG // 9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr9z/Gy9PBiqJRVu0
// SIG // DQ1ThdGjOIqjMVbwFlTNduP/NsW4wK2iZCsYnjK0GtRX
// SIG // PeS1RoMZiSIuUekCjM9jDvW58Au5EpD6qGSYpdum0S2O
// SIG // o4p428D6St0821u8/W131sOWzxZbe9jVSHVyd8bR6GGv
// SIG // gDovvghdkcu/u6NQM76LScBupUEogjCnjLfGqahBdX/k
// SIG // JAxRFL+bXs8Pe+PA3h1vaK76OCD81mu71kIJYwdPCykp
// SIG // 80zffyaLdnKFqRb+GLhKCWZkdqHzyTJw1FK7gzkU158c
// SIG // IX73f8FJiEqBMrEqqG5DVfqhblJkkoWK8fEdcx5uz+hv
// SIG // 4kTCCmJkqyGASlL53QIDAQABo4IBczCCAW8wHwYDVR0l
// SIG // BBgwFgYKKwYBBAGCN0wRAQYIKwYBBQUHAwMwHQYDVR0O
// SIG // BBYEFA8+LjI0vGAkmWlNOOPRiWENbn8qMEUGA1UdEQQ+
// SIG // MDykOjA4MR4wHAYDVQQLExVNaWNyb3NvZnQgQ29ycG9y
// SIG // YXRpb24xFjAUBgNVBAUTDTIzMTUyMis1MDI1MTgwHwYD
// SIG // VR0jBBgwFoAUSG5k5VAF04KqFzc3IrVtqMp1ApUwVAYD
// SIG // VR0fBE0wSzBJoEegRYZDaHR0cDovL3d3dy5taWNyb3Nv
// SIG // ZnQuY29tL3BraW9wcy9jcmwvTWljQ29kU2lnUENBMjAx
// SIG // MV8yMDExLTA3LTA4LmNybDBhBggrBgEFBQcBAQRVMFMw
// SIG // UQYIKwYBBQUHMAKGRWh0dHA6Ly93d3cubWljcm9zb2Z0
// SIG // LmNvbS9wa2lvcHMvY2VydHMvTWljQ29kU2lnUENBMjAx
// SIG // MV8yMDExLTA3LTA4LmNydDAMBgNVHRMBAf8EAjAAMA0G
// SIG // CSqGSIb3DQEBCwUAA4ICAQAVAgIhJ+IPIuU91Qj/NetC
// SIG // GOBEXb2YuUGdqUpwT1tXbMFYS8ZDU4gk1Vyg400OBMAw
// SIG // TUmWRiXj8+PrfOqSoZQTjd0u8LMH+XwqLyS5SIim8PhO
// SIG // E2XmOsQMXfuc1e0NpbEITx8YjmNDyBlBNCiX7/w0FLpQ
// SIG // /A6xNK67u8jjvgySNJrqCtAWx4UX3ZgCYadoG2EZGqxC
// SIG // JITC/Zt4EddpggW+vVaHJuCMjgYr1DzI470DJBERe3Ed
// SIG // O5Nrj+nZqUfMLaH/ZWtPytMIIj+V7kFLAKoM4V65Yx+3
// SIG // Su56hqwQ4yba0XWH71S/kXM/YmGTtvNINrjbWnOXptxz
// SIG // hLGnLQC+1yqmeKO7PbEcqf20zSy0ZoRTAe9vSC/h4tGD
// SIG // OwvLYdx2eZz/u+y+OilBoqekIESCbPhDtGDVvgMIDMT3
// SIG // yqU8fxoIfGfOZD+xyw2SZGXTzv93IFTkzuGsdtbztsjD
// SIG // wnX6Bhq9mS2cOEoxGxrjmSdtohjFe7Qbx5PJ1gLd6vo/
// SIG // 4nAKvfRgNZyD58N4ytyvTsBqsAPXolrDvP2xzJurOdFC
// SIG // iBbqTCpuqjm6LGlQckefK3/AsbppGu4T8tXkiUs0MgOF
// SIG // KmDU1rgobE36oES5i6JkusgLu7eK/2zOJhpftiovmr4U
// SIG // OAjpt41lndFelBiD90+M2ijbNhlhQSGLG/+l1b74u6c/
// SIG // yTCCB3owggVioAMCAQICCmEOkNIAAAAAAAMwDQYJKoZI
// SIG // hvcNAQELBQAwgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xMjAw
// SIG // BgNVBAMTKU1pY3Jvc29mdCBSb290IENlcnRpZmljYXRl
// SIG // IEF1dGhvcml0eSAyMDExMB4XDTExMDcwODIwNTkwOVoX
// SIG // DTI2MDcwODIxMDkwOVowfjELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEoMCYGA1UEAxMfTWljcm9zb2Z0IENvZGUgU2lnbmlu
// SIG // ZyBQQ0EgMjAxMTCCAiIwDQYJKoZIhvcNAQEBBQADggIP
// SIG // ADCCAgoCggIBAKvw+nIQHC6t2G6qghBNNLrytlghn0Ib
// SIG // KmvpWlCquAY4GgRJun/DDB7dN2vGEtgL8DjCmQawyDnV
// SIG // ARQxQtOJDXlkh36UYCRsr55JnOloXtLfm1OyCizDr9mp
// SIG // K656Ca/XllnKYBoF6WZ26DJSJhIv56sIUM+zRLdd2MQu
// SIG // A3WraPPLbfM6XKEW9Ea64DhkrG5kNXimoGMPLdNAk/jj
// SIG // 3gcN1Vx5pUkp5w2+oBN3vpQ97/vjK1oQH01WKKJ6cuAS
// SIG // OrdJXtjt7UORg9l7snuGG9k+sYxd6IlPhBryoS9Z5JA7
// SIG // La4zWMW3Pv4y07MDPbGyr5I4ftKdgCz1TlaRITUlwzlu
// SIG // ZH9TupwPrRkjhMv0ugOGjfdf8NBSv4yUh7zAIXQlXxgo
// SIG // tswnKDglmDlKNs98sZKuHCOnqWbsYR9q4ShJnV+I4iVd
// SIG // 0yFLPlLEtVc/JAPw0XpbL9Uj43BdD1FGd7P4AOG8rAKC
// SIG // X9vAFbO9G9RVS+c5oQ/pI0m8GLhEfEXkwcNyeuBy5yTf
// SIG // v0aZxe/CHFfbg43sTUkwp6uO3+xbn6/83bBm4sGXgXvt
// SIG // 1u1L50kppxMopqd9Z4DmimJ4X7IvhNdXnFy/dygo8e1t
// SIG // wyiPLI9AN0/B4YVEicQJTMXUpUMvdJX3bvh4IFgsE11g
// SIG // lZo+TzOE2rCIF96eTvSWsLxGoGyY0uDWiIwLAgMBAAGj
// SIG // ggHtMIIB6TAQBgkrBgEEAYI3FQEEAwIBADAdBgNVHQ4E
// SIG // FgQUSG5k5VAF04KqFzc3IrVtqMp1ApUwGQYJKwYBBAGC
// SIG // NxQCBAweCgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8G
// SIG // A1UdEwEB/wQFMAMBAf8wHwYDVR0jBBgwFoAUci06AjGQ
// SIG // Q7kUBU7h6qfHMdEjiTQwWgYDVR0fBFMwUTBPoE2gS4ZJ
// SIG // aHR0cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwv
// SIG // cHJvZHVjdHMvTWljUm9vQ2VyQXV0MjAxMV8yMDExXzAz
// SIG // XzIyLmNybDBeBggrBgEFBQcBAQRSMFAwTgYIKwYBBQUH
// SIG // MAKGQmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kv
// SIG // Y2VydHMvTWljUm9vQ2VyQXV0MjAxMV8yMDExXzAzXzIy
// SIG // LmNydDCBnwYDVR0gBIGXMIGUMIGRBgkrBgEEAYI3LgMw
// SIG // gYMwPwYIKwYBBQUHAgEWM2h0dHA6Ly93d3cubWljcm9z
// SIG // b2Z0LmNvbS9wa2lvcHMvZG9jcy9wcmltYXJ5Y3BzLmh0
// SIG // bTBABggrBgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwAXwBw
// SIG // AG8AbABpAGMAeQBfAHMAdABhAHQAZQBtAGUAbgB0AC4g
// SIG // HTANBgkqhkiG9w0BAQsFAAOCAgEAZ/KGpZjgVHkaLtPY
// SIG // dGcimwuWEeFjkplCln3SeQyQwWVfLiw++MNy0W2D/r4/
// SIG // 6ArKO79HqaPzadtjvyI1pZddZYSQfYtGUFXYDJJ80hpL
// SIG // HPM8QotS0LD9a+M+By4pm+Y9G6XUtR13lDni6WTJRD14
// SIG // eiPzE32mkHSDjfTLJgJGKsKKELukqQUMm+1o+mgulaAq
// SIG // PyprWEljHwlpblqYluSD9MCP80Yr3vw70L01724lruWv
// SIG // J+3Q3fMOr5kol5hNDj0L8giJ1h/DMhji8MUtzluetEk5
// SIG // CsYKwsatruWy2dsViFFFWDgycScaf7H0J/jeLDogaZiy
// SIG // WYlobm+nt3TDQAUGpgEqKD6CPxNNZgvAs0314Y9/HG8V
// SIG // fUWnduVAKmWjw11SYobDHWM2l4bf2vP48hahmifhzaWX
// SIG // 0O5dY0HjWwechz4GdwbRBrF1HxS+YWG18NzGGwS+30HH
// SIG // Diju3mUv7Jf2oVyW2ADWoUa9WfOXpQlLSBCZgB/QACnF
// SIG // sZulP0V3HjXG0qKin3p6IvpIlR+r+0cjgPWe+L9rt0uX
// SIG // 4ut1eBrs6jeZeRhL/9azI2h15q/6/IvrC4DqaTuv/DDt
// SIG // BEyO3991bWORPdGdVk5Pv4BXIqF4ETIheu9BCrE/+6jM
// SIG // pF3BoYibV3FWTkhFwELJm3ZbCoBIa/15n8G9bW1qyVJz
// SIG // Ew16UM0xghomMIIaIgIBATCBlTB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExAhMzAAAD9LjEXeFOcLZ+AAAA
// SIG // AAP0MA0GCWCGSAFlAwQCAQUAoIGuMBkGCSqGSIb3DQEJ
// SIG // AzEMBgorBgEEAYI3AgEEMBwGCisGAQQBgjcCAQsxDjAM
// SIG // BgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCAXiuop
// SIG // Eka7Pe6uSAcUQzG8qaT0c7slz7LsZCfmAIywLzBCBgor
// SIG // BgEEAYI3AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBm
// SIG // AHShGoAYaHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0G
// SIG // CSqGSIb3DQEBAQUABIIBAK3due2h1HJccmKaq4DHYb+i
// SIG // gtgBrvDNxS0q01A5zreX5WuuHJ+FHVn2rfmUuRB+tq1P
// SIG // WwykawsAA2DkYnC3EjApmOkOYIUCjTK7I9tV2PaeQc7C
// SIG // LdoloKpYUup0Yg+7Jh/l7ZQGl/HNGtBFjZlgfE0lnyMK
// SIG // 2EW0vjMUqzzfJzGWI+uQGLg7vFCoF1Y6wpWc/mtTnjKz
// SIG // jXwR/oeXdBdgaXvDCU8BAtzFcPpW//28KnAcd2SEEccK
// SIG // sxw7Yh/keaxi+me6Dk4RcwiHXBZYK4Z6yS1r6WQjunXg
// SIG // fHHQVrcsD/bnyjaS0uuoB9vAIn3ikDsoS27zSRp7LXAM
// SIG // ddxV+ccliu2hghewMIIXrAYKKwYBBAGCNwMDATGCF5ww
// SIG // gheYBgkqhkiG9w0BBwKggheJMIIXhQIBAzEPMA0GCWCG
// SIG // SAFlAwQCAQUAMIIBWgYLKoZIhvcNAQkQAQSgggFJBIIB
// SIG // RTCCAUECAQEGCisGAQQBhFkKAwEwMTANBglghkgBZQME
// SIG // AgEFAAQgAp8xb6+Hg4d5ztj5vTCHqz420urRRJw9J+4O
// SIG // HatagroCBmeaqQ+GyxgTMjAyNTAyMTMxOTQ3MjQuMjM0
// SIG // WjAEgAIB9KCB2aSB1jCB0zELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEtMCsGA1UECxMkTWljcm9zb2Z0IElyZWxhbmQgT3Bl
// SIG // cmF0aW9ucyBMaW1pdGVkMScwJQYDVQQLEx5uU2hpZWxk
// SIG // IFRTUyBFU046NDAxQS0wNUUwLUQ5NDcxJTAjBgNVBAMT
// SIG // HE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2WgghH+
// SIG // MIIHKDCCBRCgAwIBAgITMwAAAf7QqMJ7NCELAQABAAAB
// SIG // /jANBgkqhkiG9w0BAQsFADB8MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFt
// SIG // cCBQQ0EgMjAxMDAeFw0yNDA3MjUxODMxMThaFw0yNTEw
// SIG // MjIxODMxMThaMIHTMQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0w
// SIG // KwYDVQQLEyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRp
// SIG // b25zIExpbWl0ZWQxJzAlBgNVBAsTHm5TaGllbGQgVFNT
// SIG // IEVTTjo0MDFBLTA1RTAtRDk0NzElMCMGA1UEAxMcTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgU2VydmljZTCCAiIwDQYJ
// SIG // KoZIhvcNAQEBBQADggIPADCCAgoCggIBALy8IRcVpagO
// SIG // N6JbBODwnoGeJkn7B9mE0ihGL/Bp99+tgZmsnHX+U97U
// SIG // MaT9zVputmB1IniEF8PtLuKpWsuADdyKJyPuOzaYvX6O
// SIG // dsXQFzF9KRq3NHqlvEVjd2381zyr9OztfIth4w8i7ssG
// SIG // MigPRZlm3j42oX/TMHfEIMoJD7cA61UBi8jpMjN1U4hy
// SIG // qoRrvQQhlUXR1vZZjzK61JT1omFfS1QgeVWHfgBFLXX6
// SIG // gHapc1cQOdxIMUqoaeiW3xCp03XHz+k/DIq9B68E07Vd
// SIG // odsgwbY120CGqsnCjm+t9xn0ZJ9teizgwYN+z/8cIaHV
// SIG // 0/NWQtmhze3sRA5pm4lrLIxrxSZJYtoOnbdNXkoTohpo
// SIG // W6J69Kl13AXqjW+kKBfI1/7g1bWPaby+I/GhFkuPYSlB
// SIG // 9Js7ArnCK8FEvsfDLk9Ln+1VwhTRW4glDUU6H8SdweOe
// SIG // HhiYS9H8FE0W4Mgm6S4CjCg4gkbm+uQ4Wng71AACU/dy
// SIG // kgqHhQqJJT2r24EMmoRmQy/71gFY1+W/Cc4ZcvYBgnSv
// SIG // 6ouovnMWdEvMegdsoz22X3QVXx/zQaf9S5+8W3jhEwDp
// SIG // +zk/Q91BrdKvioloGONh5y48oZdWwLuR34K8gDtwwmiH
// SIG // VdrY75CWstqjpxew4I/GutCkE/UIHyX8F5692Som2DI2
// SIG // lGwjSA58c9spAgMBAAGjggFJMIIBRTAdBgNVHQ4EFgQU
// SIG // b857ifUlNoOZf+f2/uQgYm2xxd0wHwYDVR0jBBgwFoAU
// SIG // n6cVXQBeYl2D9OXSZacbUzUZ6XIwXwYDVR0fBFgwVjBU
// SIG // oFKgUIZOaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3Br
// SIG // aW9wcy9jcmwvTWljcm9zb2Z0JTIwVGltZS1TdGFtcCUy
// SIG // MFBDQSUyMDIwMTAoMSkuY3JsMGwGCCsGAQUFBwEBBGAw
// SIG // XjBcBggrBgEFBQcwAoZQaHR0cDovL3d3dy5taWNyb3Nv
// SIG // ZnQuY29tL3BraW9wcy9jZXJ0cy9NaWNyb3NvZnQlMjBU
// SIG // aW1lLVN0YW1wJTIwUENBJTIwMjAxMCgxKS5jcnQwDAYD
// SIG // VR0TAQH/BAIwADAWBgNVHSUBAf8EDDAKBggrBgEFBQcD
// SIG // CDAOBgNVHQ8BAf8EBAMCB4AwDQYJKoZIhvcNAQELBQAD
// SIG // ggIBAIk+DVLztpcPtHQzLbAbsZl9qN5VUKp0JLiEwBiB
// SIG // goCPrJe2amTkw3fC6sbB+Blgj087XN7a/AIAb7GCM1ox
// SIG // cIqAowkDg6taATFjcxLCs3JB8QM2KOUs3uzj5DANwwMV
// SIG // auEkkfMvk0QthnDndCUXmdZT5YZT5fVyPs/DoLTj5kJy
// SIG // y4j/as6Ux8Bc3vrG6kp/HHpHbjGXS8hyZNzYsNwJ4JVP
// SIG // 1k8xrEAHXIfUlVeCx4n1J5sE39ItO4irU5TZKt28dYsl
// SIG // oOze4xmQAUVk9pl/mAFR5Stu7fZ/lrWG5+nDiTV+i7B/
// SIG // MT1QUWACEVZFrDMhAHaD/Xan2mc8Fxpo7lUPd9TYcx44
// SIG // xvhH8NdfA145N1at6lCNa3t+MzDE0c2WRMPNhbqRd74l
// SIG // zUdw1TpUvSR+MeXpnyDWtbrkmnOheAniQg9RmpH0uw+W
// SIG // sjbGmdnvrAVIetilU5YRLEER2UcAk8W4sdWOIicPjwzS
// SIG // 3NB39fal9l4l9LtkjPQlk047M/UrwoyCksQmRQjb/86S
// SIG // iJbB8e4UDUB0jGyodP8MJ/OroiACxI2s1LMxNPl+q3Dm
// SIG // w31OIfzv9L5mxdwTEfuOawGTABEybEQz8RyQqP+VxoVn
// SIG // YPy6CeV1gazgy+OGDazexUZxxAAK9OrH5amfHnldxbgy
// SIG // nT+YdfVlJxlsDtR/2Y1MzqFRold4MIIHcTCCBVmgAwIB
// SIG // AgITMwAAABXF52ueAptJmQAAAAAAFTANBgkqhkiG9w0B
// SIG // AQsFADCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldh
// SIG // c2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNV
// SIG // BAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UE
// SIG // AxMpTWljcm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0
// SIG // aG9yaXR5IDIwMTAwHhcNMjEwOTMwMTgyMjI1WhcNMzAw
// SIG // OTMwMTgzMjI1WjB8MQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYw
// SIG // JAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0Eg
// SIG // MjAxMDCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoC
// SIG // ggIBAOThpkzntHIhC3miy9ckeb0O1YLT/e6cBwfSqWxO
// SIG // dcjKNVf2AX9sSuDivbk+F2Az/1xPx2b3lVNxWuJ+Slr+
// SIG // uDZnhUYjDLWNE893MsAQGOhgfWpSg0S3po5GawcU88V2
// SIG // 9YZQ3MFEyHFcUTE3oAo4bo3t1w/YJlN8OWECesSq/XJp
// SIG // rx2rrPY2vjUmZNqYO7oaezOtgFt+jBAcnVL+tuhiJdxq
// SIG // D89d9P6OU8/W7IVWTe/dvI2k45GPsjksUZzpcGkNyjYt
// SIG // cI4xyDUoveO0hyTD4MmPfrVUj9z6BVWYbWg7mka97aSu
// SIG // eik3rMvrg0XnRm7KMtXAhjBcTyziYrLNueKNiOSWrAFK
// SIG // u75xqRdbZ2De+JKRHh09/SDPc31BmkZ1zcRfNN0Sidb9
// SIG // pSB9fvzZnkXftnIv231fgLrbqn427DZM9ituqBJR6L8F
// SIG // A6PRc6ZNN3SUHDSCD/AQ8rdHGO2n6Jl8P0zbr17C89XY
// SIG // cz1DTsEzOUyOArxCaC4Q6oRRRuLRvWoYWmEBc8pnol7X
// SIG // KHYC4jMYctenIPDC+hIK12NvDMk2ZItboKaDIV1fMHSR
// SIG // lJTYuVD5C4lh8zYGNRiER9vcG9H9stQcxWv2XFJRXRLb
// SIG // JbqvUAV6bMURHXLvjflSxIUXk8A8FdsaN8cIFRg/eKtF
// SIG // tvUeh17aj54WcmnGrnu3tz5q4i6tAgMBAAGjggHdMIIB
// SIG // 2TASBgkrBgEEAYI3FQEEBQIDAQABMCMGCSsGAQQBgjcV
// SIG // AgQWBBQqp1L+ZMSavoKRPEY1Kc8Q/y8E7jAdBgNVHQ4E
// SIG // FgQUn6cVXQBeYl2D9OXSZacbUzUZ6XIwXAYDVR0gBFUw
// SIG // UzBRBgwrBgEEAYI3TIN9AQEwQTA/BggrBgEFBQcCARYz
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9wcy9E
// SIG // b2NzL1JlcG9zaXRvcnkuaHRtMBMGA1UdJQQMMAoGCCsG
// SIG // AQUFBwMIMBkGCSsGAQQBgjcUAgQMHgoAUwB1AGIAQwBB
// SIG // MAsGA1UdDwQEAwIBhjAPBgNVHRMBAf8EBTADAQH/MB8G
// SIG // A1UdIwQYMBaAFNX2VsuP6KJcYmjRPZSQW9fOmhjEMFYG
// SIG // A1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9z
// SIG // b2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Jvb0Nl
// SIG // ckF1dF8yMDEwLTA2LTIzLmNybDBaBggrBgEFBQcBAQRO
// SIG // MEwwSgYIKwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9z
// SIG // b2Z0LmNvbS9wa2kvY2VydHMvTWljUm9vQ2VyQXV0XzIw
// SIG // MTAtMDYtMjMuY3J0MA0GCSqGSIb3DQEBCwUAA4ICAQCd
// SIG // VX38Kq3hLB9nATEkW+Geckv8qW/qXBS2Pk5HZHixBpOX
// SIG // PTEztTnXwnE2P9pkbHzQdTltuw8x5MKP+2zRoZQYIu7p
// SIG // Zmc6U03dmLq2HnjYNi6cqYJWAAOwBb6J6Gngugnue99q
// SIG // b74py27YP0h1AdkY3m2CDPVtI1TkeFN1JFe53Z/zjj3G
// SIG // 82jfZfakVqr3lbYoVSfQJL1AoL8ZthISEV09J+BAljis
// SIG // 9/kpicO8F7BUhUKz/AyeixmJ5/ALaoHCgRlCGVJ1ijbC
// SIG // HcNhcy4sa3tuPywJeBTpkbKpW99Jo3QMvOyRgNI95ko+
// SIG // ZjtPu4b6MhrZlvSP9pEB9s7GdP32THJvEKt1MMU0sHrY
// SIG // UP4KWN1APMdUbZ1jdEgssU5HLcEUBHG/ZPkkvnNtyo4J
// SIG // vbMBV0lUZNlz138eW0QBjloZkWsNn6Qo3GcZKCS6OEua
// SIG // bvshVGtqRRFHqfG3rsjoiV5PndLQTHa1V1QJsWkBRH58
// SIG // oWFsc/4Ku+xBZj1p/cvBQUl+fpO+y/g75LcVv7TOPqUx
// SIG // UYS8vwLBgqJ7Fx0ViY1w/ue10CgaiQuPNtq6TPmb/wrp
// SIG // NPgkNWcr4A245oyZ1uEi6vAnQj0llOZ0dFtq0Z4+7X6g
// SIG // MTN9vMvpe784cETRkPHIqzqKOghif9lwY1NNje6CbaUF
// SIG // EMFxBmoQtB1VM1izoXBm8qGCA1kwggJBAgEBMIIBAaGB
// SIG // 2aSB1jCB0zELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldh
// SIG // c2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNV
// SIG // BAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEtMCsGA1UE
// SIG // CxMkTWljcm9zb2Z0IElyZWxhbmQgT3BlcmF0aW9ucyBM
// SIG // aW1pdGVkMScwJQYDVQQLEx5uU2hpZWxkIFRTUyBFU046
// SIG // NDAxQS0wNUUwLUQ5NDcxJTAjBgNVBAMTHE1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMC
// SIG // GgMVAIRjRw/2u0NG0C1lRvSbhsYC0V7HoIGDMIGApH4w
// SIG // fDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZI
// SIG // hvcNAQELBQACBQDrWEQWMCIYDzIwMjUwMjEzMTAxMjM4
// SIG // WhgPMjAyNTAyMTQxMDEyMzhaMHcwPQYKKwYBBAGEWQoE
// SIG // ATEvMC0wCgIFAOtYRBYCAQAwCgIBAAICBR8CAf8wBwIB
// SIG // AAICEmAwCgIFAOtZlZYCAQAwNgYKKwYBBAGEWQoEAjEo
// SIG // MCYwDAYKKwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgC
// SIG // AQACAwGGoDANBgkqhkiG9w0BAQsFAAOCAQEAC4LvWGnY
// SIG // R6aCjBWLwa9SnqqUQWywaxt1BMvOvDpoNYdMg3fAliD9
// SIG // 1jFOE211iMA6B6XG2mrqzkxOx/w3/PPxZ+bziBLuXghK
// SIG // wWOclp8gs8JD39xH1EWBdq2PwF2GsdZVPNA3YtDvTF/Y
// SIG // 0CO2Pyp4rV8y0ntsUjJhYE7Ie60WjShyWBszrukqIX0q
// SIG // qTttFun7yuQfHZR0utotCy3LhM8dJ+dVPv7KrMzVI5+e
// SIG // oijAlwIR5JR3ctl7o0drd18K+SVowp5GM7zlUqLQ0sGl
// SIG // d3Ik01e/Z8u5UdhlYckFsfHWD/QzhC22hEFd+UNGEV4V
// SIG // /R8lwC+kD/qcLpMRO0FJa8Oa7DGCBA0wggQJAgEBMIGT
// SIG // MHwxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5n
// SIG // dG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVN
// SIG // aWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1p
// SIG // Y3Jvc29mdCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAAB
// SIG // /tCowns0IQsBAAEAAAH+MA0GCWCGSAFlAwQCAQUAoIIB
// SIG // SjAaBgkqhkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQwLwYJ
// SIG // KoZIhvcNAQkEMSIEIG27Mv084W32HJkqpPg2Zkeg6KKP
// SIG // pePuBM5Zx/OoMFiJMIH6BgsqhkiG9w0BCRACLzGB6jCB
// SIG // 5zCB5DCBvQQgEYXM3fxTyJ8Y0fdptoT1qnPrxjhtfvyN
// SIG // FrZArLcodHkwgZgwgYCkfjB8MQswCQYDVQQGEwJVUzET
// SIG // MBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
// SIG // bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
// SIG // aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFt
// SIG // cCBQQ0EgMjAxMAITMwAAAf7QqMJ7NCELAQABAAAB/jAi
// SIG // BCDGaFk4sqO86Yw4b5a6x2eb+xS7X5/YV5XKKmXPuc93
// SIG // vDANBgkqhkiG9w0BAQsFAASCAgBlCJ3x0tyfnrlJDNQc
// SIG // mBOHs10pkXzdnGLwc9hzIKqsN1D16hp9moicRqDI38cz
// SIG // Okoktao487ycVTwigENiBM+hWKr9p15gswPNyOnlpPu9
// SIG // LpdRXMkNpvIBmoenU112aqbfyZV6akZJyufq6xjLOjia
// SIG // bjj+vbiMYJ/K6wOLBfS/qncfnePKug9TT5Il3whRCGhE
// SIG // K3iTRfqTK2bw+yEfzFeZqYRlZUD22O36A2LfVighibHd
// SIG // sUM74qi1CJafStIjuGIdrbuhygAGvz4iey7uqnehXS+m
// SIG // RM8f4cf7GdDdCBFdTC29abUA3vVbxn04/UXoDS9JwWMn
// SIG // pqovDFWEAxE9btPEqmtvU8zpGw7uBpxkjP39AYOJvVb4
// SIG // jY/eX7MkQ/Y6ASemrIuTLlazJ0HlrftkuAioe90I2A/u
// SIG // JTQXnCKev48A+R0LTO1T4IxX0pkSOVUHPbE1S2aqppJD
// SIG // eynchXwmfnPcFt3b0bTa9acy+YcyJyRbqtGQrmI3e7C6
// SIG // rZwPk9RFW0QUcdHSkqhV39dKozmuNDhPMI9MBc9uokgF
// SIG // 0Rtc6b/lQLfwd3anByIYPPbh8HEb25dBIBeWAnK9ye2K
// SIG // bX+z8/sEXlG3kWjlbuzimAg0ZnM/a4pamAvNhUhuXqpl
// SIG // NNMBEVcA1z/Xnr/APEeFdJ+yOXfwFgVT8vbQ4XUCTQrt
// SIG // zLKkDQ==
// SIG // End signature block
