// Copyright (c) Microsoft Corporation. All rights reserved.

function OnPrep(selProj, selObj)
{
	var L_WizardDialogTitle_Text = "Resource File Wizard";
	return PrepCodeWizard(selProj, L_WizardDialogTitle_Text);
}

function OnFinish(selProj, selObj)
{
	var oCM;
    try
    {
		oCM	= selProj.CodeModel;

		var strFileName = wizard.FindSymbol("ITEM_NAME");
		if (!ValidateFileExtension(strFileName))
		{
			wizard.ReportError();
			return VS_E_WIZARDBACKBUTTONPRESS;
		}

        var L_TRANSACTION_Text = "Add resource file";
        oCM.StartTransaction(L_TRANSACTION_Text);
        var strTemplatePath = wizard.FindSymbol("TEMPLATES_PATH");
        var strProjectPath = wizard.FindSymbol("PROJECT_PATH");
        var strFileName = wizard.FindSymbol("ITEM_NAME");
        
        var strParamList = strFileName.split("\\");
        wizard.AddSymbol("FILE_ONLY_NAME", strParamList[strParamList.length - 1]);

        var strFile = strProjectPath + "\\" + "resource.h";
        var strTemplate = strTemplatePath + "\\" + "resource.h";
        var rcfile;

        var InfFile = CreateInfFile();
        var strTextStream = InfFile.OpenAsTextStream(1, -2);
        while (!strTextStream.AtEndOfStream)
        {
            strTpl = strTextStream.ReadLine();
            if (strTpl != "")
            {
                strName = strTpl;
                if(strName == "resource.h")
                {
                    var res_file_count = 1;
                    if (IsFileInProject(selProj, "resource.h"))
                    {
                        var res_file_name = "resource" + res_file_count + ".h";

                        while (IsFileInProject(selProj, res_file_name))
                        {
                            res_file_count++;
                            res_file_name = "resource" + res_file_count + ".h";
                        }
	                    strName = res_file_name;
                    }
                    wizard.AddSymbol("RESOURCE_INCLUDE", strName);
                }
                var strTarget = GetTargetName(strName);
                var strTemplate = strTemplatePath + "\\" + strTpl;
                var strFile = strTarget;


                wizard.RenderTemplate(strTemplate, strFile);

                var projfile = selProj.ProjectItems.AddFromFile(strFile);
                if( strName == "rcfile.rc" )
                {
                    rcfile = projfile;
                }
            
            }
        }
        
        if( rcfile )
        {
            var window = rcfile.Open(vsViewKindPrimary);
            if(window)
                window.visible = true;
        }

        strTextStream.Close();
        oCM.CommitTransaction();    
        InfFile.Delete();
    }
    catch(e)
    {
		if (oCM)
			oCM.AbortTransaction();

		if (e.description.length != 0)
			SetErrorInfo(e);
		return e.number
    }
}

function GetTargetName(strName)
{
	try
	{
		var strFileName = wizard.FindSymbol("ITEM_NAME");

		if(strName.substring(0,8) == "resource")
		{
			// The resource file needs to be in the same directory as the rc file, not the project path.
			strName = strFileName.substr(0, strFileName.lastIndexOf("\\") + 1) + strName;
			return strName;
		}
		else
		{
			return strFileName;
		}
	}
	catch(e)
	{
		throw e;
	}
}

function ValidateFileExtension(strFileName)
{
	if(!wizard.dte.VCLanguageManager.ValidateFileName(strFileName, vsCMValidateFileExtNone))
	{
		return false;
	}

	var rgstrSplitPathName = strFileName.split(".");
	if((rgstrSplitPathName.length != 1) && (rgstrSplitPathName[rgstrSplitPathName.length - 1] != "rc"))
	{
		var L_Err2_Text = "File extension has to be \".rc\".";
		oErrObj = new Error(L_Err2_Text);
		SetErrorInfo(oErrObj);
		return false;
	}
	return true;
}

function IsFileInProject(oProj, strFileIn)
{
    try
    {
        var fileItems = oProj.Object.Files;
        var count = fileItems.count;
        for (var nPos = 0; nPos < count; nPos++)
        {
            var fileItem = fileItems.Item(nPos+1);
            var strFileName = fileItem.Name;
                if (strFileName.toLowerCase() == strFileIn.toLowerCase())
                return true;
        }
        return false;
    }
    catch(e)
    {   
		throw e;
    }
}

// SIG // Begin signature block
// SIG // MIIoUwYJKoZIhvcNAQcCoIIoRDCCKEACAQExDzANBglg
// SIG // hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
// SIG // BgEEAYI3AgEeMCQCAQEEEBDgyQbOONQRoqMAEEvTUJAC
// SIG // AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
// SIG // Jd7hMQnCjIkEIrWkrfN11j83IBoQSq2LK/lnr6C4KHSg
// SIG // gg2FMIIGAzCCA+ugAwIBAgITMwAABAO91ZVdDzsYrQAA
// SIG // AAAEAzANBgkqhkiG9w0BAQsFADB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExMB4XDTI0MDkxMjIwMTExM1oX
// SIG // DTI1MDkxMTIwMTExM1owdDELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEeMBwGA1UEAxMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA
// SIG // n3RnXcCDp20WFMoNNzt4s9fV12T5roRJlv+bshDfvJoM
// SIG // ZfhyRnixgUfGAbrRlS1St/EcXFXD2MhRkF3CnMYIoeMO
// SIG // MuMyYtxr2sC2B5bDRMUMM/r9I4GP2nowUthCWKFIS1RP
// SIG // lM0YoVfKKMaH7bJii29sW+waBUulAKN2c+Gn5znaiOxR
// SIG // qIu4OL8f9DCHYpME5+Teek3SL95sH5GQhZq7CqTdM0fB
// SIG // w/FmLLx98SpBu7v8XapoTz6jJpyNozhcP/59mi/Fu4tT
// SIG // 2rI2vD50Vx/0GlR9DNZ2py/iyPU7DG/3p1n1zluuRp3u
// SIG // XKjDfVKH7xDbXcMBJid22a3CPbuC2QJLowIDAQABo4IB
// SIG // gjCCAX4wHwYDVR0lBBgwFgYKKwYBBAGCN0wIAQYIKwYB
// SIG // BQUHAwMwHQYDVR0OBBYEFOpuKgJKc+OuNYitoqxfHlrE
// SIG // gXAZMFQGA1UdEQRNMEukSTBHMS0wKwYDVQQLEyRNaWNy
// SIG // b3NvZnQgSXJlbGFuZCBPcGVyYXRpb25zIExpbWl0ZWQx
// SIG // FjAUBgNVBAUTDTIzMDAxMis1MDI5MjYwHwYDVR0jBBgw
// SIG // FoAUSG5k5VAF04KqFzc3IrVtqMp1ApUwVAYDVR0fBE0w
// SIG // SzBJoEegRYZDaHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L3BraW9wcy9jcmwvTWljQ29kU2lnUENBMjAxMV8yMDEx
// SIG // LTA3LTA4LmNybDBhBggrBgEFBQcBAQRVMFMwUQYIKwYB
// SIG // BQUHMAKGRWh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9w
// SIG // a2lvcHMvY2VydHMvTWljQ29kU2lnUENBMjAxMV8yMDEx
// SIG // LTA3LTA4LmNydDAMBgNVHRMBAf8EAjAAMA0GCSqGSIb3
// SIG // DQEBCwUAA4ICAQBRaP+hOC1+dSKhbqCr1LIvNEMrRiOQ
// SIG // EkPc7D6QWtM+/IbrYiXesNeeCZHCMf3+6xASuDYQ+AyB
// SIG // TX0YlXSOxGnBLOzgEukBxezbfnhUTTk7YB2/TxMUcuBC
// SIG // P45zMM0CVTaJE8btloB6/3wbFrOhvQHCILx41jTd6kUq
// SIG // 4bIBHah3NG0Q1H/FCCwHRGTjAbyiwq5n/pCTxLz5XYCu
// SIG // 4RTvy/ZJnFXuuwZynowyju90muegCToTOwpHgE6yRcTv
// SIG // Ri16LKCr68Ab8p8QINfFvqWoEwJCXn853rlkpp4k7qzw
// SIG // lBNiZ71uw2pbzjQzrRtNbCFQAfmoTtsHFD2tmZvQIg1Q
// SIG // VkzM/V1KCjHL54ItqKm7Ay4WyvqWK0VIEaTbdMtbMWbF
// SIG // zq2hkRfJTNnFr7RJFeVC/k0DNaab+bpwx5FvCUvkJ3z2
// SIG // wfHWVUckZjEOGmP7cecefrF+rHpif/xW4nJUjMUiPsyD
// SIG // btY2Hq3VMLgovj+qe0pkJgpYQzPukPm7RNhbabFNFvq+
// SIG // kXWBX/z/pyuo9qLZfTb697Vi7vll5s/DBjPtfMpyfpWG
// SIG // 0phVnAI+0mM4gH09LCMJUERZMgu9bbCGVIQR7cT5YhlL
// SIG // t+tpSDtC6XtAzq4PJbKZxFjpB5wk+SRJ1gm87olbfEV9
// SIG // SFdO7iL3jWbjgVi1Qs1iYxBmvh4WhLWr48uouzCCB3ow
// SIG // ggVioAMCAQICCmEOkNIAAAAAAAMwDQYJKoZIhvcNAQEL
// SIG // BQAwgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
// SIG // aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQK
// SIG // ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xMjAwBgNVBAMT
// SIG // KU1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1dGhv
// SIG // cml0eSAyMDExMB4XDTExMDcwODIwNTkwOVoXDTI2MDcw
// SIG // ODIxMDkwOVowfjELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYG
// SIG // A1UEAxMfTWljcm9zb2Z0IENvZGUgU2lnbmluZyBQQ0Eg
// SIG // MjAxMTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoC
// SIG // ggIBAKvw+nIQHC6t2G6qghBNNLrytlghn0IbKmvpWlCq
// SIG // uAY4GgRJun/DDB7dN2vGEtgL8DjCmQawyDnVARQxQtOJ
// SIG // DXlkh36UYCRsr55JnOloXtLfm1OyCizDr9mpK656Ca/X
// SIG // llnKYBoF6WZ26DJSJhIv56sIUM+zRLdd2MQuA3WraPPL
// SIG // bfM6XKEW9Ea64DhkrG5kNXimoGMPLdNAk/jj3gcN1Vx5
// SIG // pUkp5w2+oBN3vpQ97/vjK1oQH01WKKJ6cuASOrdJXtjt
// SIG // 7UORg9l7snuGG9k+sYxd6IlPhBryoS9Z5JA7La4zWMW3
// SIG // Pv4y07MDPbGyr5I4ftKdgCz1TlaRITUlwzluZH9TupwP
// SIG // rRkjhMv0ugOGjfdf8NBSv4yUh7zAIXQlXxgotswnKDgl
// SIG // mDlKNs98sZKuHCOnqWbsYR9q4ShJnV+I4iVd0yFLPlLE
// SIG // tVc/JAPw0XpbL9Uj43BdD1FGd7P4AOG8rAKCX9vAFbO9
// SIG // G9RVS+c5oQ/pI0m8GLhEfEXkwcNyeuBy5yTfv0aZxe/C
// SIG // HFfbg43sTUkwp6uO3+xbn6/83bBm4sGXgXvt1u1L50kp
// SIG // pxMopqd9Z4DmimJ4X7IvhNdXnFy/dygo8e1twyiPLI9A
// SIG // N0/B4YVEicQJTMXUpUMvdJX3bvh4IFgsE11glZo+TzOE
// SIG // 2rCIF96eTvSWsLxGoGyY0uDWiIwLAgMBAAGjggHtMIIB
// SIG // 6TAQBgkrBgEEAYI3FQEEAwIBADAdBgNVHQ4EFgQUSG5k
// SIG // 5VAF04KqFzc3IrVtqMp1ApUwGQYJKwYBBAGCNxQCBAwe
// SIG // CgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8GA1UdEwEB
// SIG // /wQFMAMBAf8wHwYDVR0jBBgwFoAUci06AjGQQ7kUBU7h
// SIG // 6qfHMdEjiTQwWgYDVR0fBFMwUTBPoE2gS4ZJaHR0cDov
// SIG // L2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVj
// SIG // dHMvTWljUm9vQ2VyQXV0MjAxMV8yMDExXzAzXzIyLmNy
// SIG // bDBeBggrBgEFBQcBAQRSMFAwTgYIKwYBBQUHMAKGQmh0
// SIG // dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kvY2VydHMv
// SIG // TWljUm9vQ2VyQXV0MjAxMV8yMDExXzAzXzIyLmNydDCB
// SIG // nwYDVR0gBIGXMIGUMIGRBgkrBgEEAYI3LgMwgYMwPwYI
// SIG // KwYBBQUHAgEWM2h0dHA6Ly93d3cubWljcm9zb2Z0LmNv
// SIG // bS9wa2lvcHMvZG9jcy9wcmltYXJ5Y3BzLmh0bTBABggr
// SIG // BgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwAXwBwAG8AbABp
// SIG // AGMAeQBfAHMAdABhAHQAZQBtAGUAbgB0AC4gHTANBgkq
// SIG // hkiG9w0BAQsFAAOCAgEAZ/KGpZjgVHkaLtPYdGcimwuW
// SIG // EeFjkplCln3SeQyQwWVfLiw++MNy0W2D/r4/6ArKO79H
// SIG // qaPzadtjvyI1pZddZYSQfYtGUFXYDJJ80hpLHPM8QotS
// SIG // 0LD9a+M+By4pm+Y9G6XUtR13lDni6WTJRD14eiPzE32m
// SIG // kHSDjfTLJgJGKsKKELukqQUMm+1o+mgulaAqPyprWElj
// SIG // HwlpblqYluSD9MCP80Yr3vw70L01724lruWvJ+3Q3fMO
// SIG // r5kol5hNDj0L8giJ1h/DMhji8MUtzluetEk5CsYKwsat
// SIG // ruWy2dsViFFFWDgycScaf7H0J/jeLDogaZiyWYlobm+n
// SIG // t3TDQAUGpgEqKD6CPxNNZgvAs0314Y9/HG8VfUWnduVA
// SIG // KmWjw11SYobDHWM2l4bf2vP48hahmifhzaWX0O5dY0Hj
// SIG // Wwechz4GdwbRBrF1HxS+YWG18NzGGwS+30HHDiju3mUv
// SIG // 7Jf2oVyW2ADWoUa9WfOXpQlLSBCZgB/QACnFsZulP0V3
// SIG // HjXG0qKin3p6IvpIlR+r+0cjgPWe+L9rt0uX4ut1eBrs
// SIG // 6jeZeRhL/9azI2h15q/6/IvrC4DqaTuv/DDtBEyO3991
// SIG // bWORPdGdVk5Pv4BXIqF4ETIheu9BCrE/+6jMpF3BoYib
// SIG // V3FWTkhFwELJm3ZbCoBIa/15n8G9bW1qyVJzEw16UM0x
// SIG // ghomMIIaIgIBATCBlTB+MQswCQYDVQQGEwJVUzETMBEG
// SIG // A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
// SIG // ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9u
// SIG // MSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBTaWduaW5n
// SIG // IFBDQSAyMDExAhMzAAAEA73VlV0POxitAAAAAAQDMA0G
// SIG // CWCGSAFlAwQCAQUAoIGuMBkGCSqGSIb3DQEJAzEMBgor
// SIG // BgEEAYI3AgEEMBwGCisGAQQBgjcCAQsxDjAMBgorBgEE
// SIG // AYI3AgEVMC8GCSqGSIb3DQEJBDEiBCCd4HvllSg0bywd
// SIG // Rz+umSVEtsMRs7tCXL0s01/Vu+WyzzBCBgorBgEEAYI3
// SIG // AgEMMTQwMqAUgBIATQBpAGMAcgBvAHMAbwBmAHShGoAY
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tMA0GCSqGSIb3
// SIG // DQEBAQUABIIBACtbB+1wVCPWF9+Cbk3Q3C2mL0q4Rb8q
// SIG // +n40XgGmjmE4UKkeF0kpA1JdQ/ey4+h+scX9WbZmdxOv
// SIG // wtXH3wzZZYrb5J1TnQhtR94+pE1Bpll1qHAHgmEZJhrm
// SIG // wBPT/k8/m/WUU4JOTGGjz8KGECxAoGBHQHbaGq8q+sQo
// SIG // tzfcTFlZyxqMLDk1JDOEO7rHJFvxxBqpa+pYIle9R7Mr
// SIG // Afx7I3XDZhoYb4oN2tGhJYXtXptyhCx+Y9+tF2zrTfs2
// SIG // a+8XPtSkzlYH796BchQaynmOa0/7y0/i0OtzJLHWVhwf
// SIG // 76yMX3d+SIQqF/6C7GtriNeRztq0PYGLd+mDGKYPr630
// SIG // F+ihghewMIIXrAYKKwYBBAGCNwMDATGCF5wwgheYBgkq
// SIG // hkiG9w0BBwKggheJMIIXhQIBAzEPMA0GCWCGSAFlAwQC
// SIG // AQUAMIIBWgYLKoZIhvcNAQkQAQSgggFJBIIBRTCCAUEC
// SIG // AQEGCisGAQQBhFkKAwEwMTANBglghkgBZQMEAgEFAAQg
// SIG // mty4Ire915L4FZhi/XwsvW4DNZIssrWGzYI9KpzxW2MC
// SIG // Bmdi8zMZPBgTMjAyNTAxMTYxODE0NDcuMzg1WjAEgAIB
// SIG // 9KCB2aSB1jCB0zELMAkGA1UEBhMCVVMxEzARBgNVBAgT
// SIG // Cldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
// SIG // BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEtMCsG
// SIG // A1UECxMkTWljcm9zb2Z0IElyZWxhbmQgT3BlcmF0aW9u
// SIG // cyBMaW1pdGVkMScwJQYDVQQLEx5uU2hpZWxkIFRTUyBF
// SIG // U046NTcxQS0wNUUwLUQ5NDcxJTAjBgNVBAMTHE1pY3Jv
// SIG // c29mdCBUaW1lLVN0YW1wIFNlcnZpY2WgghH+MIIHKDCC
// SIG // BRCgAwIBAgITMwAAAfvLy2w3Z+UwlQABAAAB+zANBgkq
// SIG // hkiG9w0BAQsFADB8MQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYw
// SIG // JAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0Eg
// SIG // MjAxMDAeFw0yNDA3MjUxODMxMTNaFw0yNTEwMjIxODMx
// SIG // MTNaMIHTMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMS0wKwYDVQQL
// SIG // EyRNaWNyb3NvZnQgSXJlbGFuZCBPcGVyYXRpb25zIExp
// SIG // bWl0ZWQxJzAlBgNVBAsTHm5TaGllbGQgVFNTIEVTTjo1
// SIG // NzFBLTA1RTAtRDk0NzElMCMGA1UEAxMcTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgU2VydmljZTCCAiIwDQYJKoZIhvcN
// SIG // AQEBBQADggIPADCCAgoCggIBAKjCVkHlgKuC8L0o2LIz
// SIG // 9FL4b5tI9GgDiYjC4NLC38SqE1wHSg+qDLquaxeaBIjs
// SIG // VfvaMdB/eUPH4aGat8fZcYLmckziuJdsbXILSQrY10ZZ
// SIG // TNm06YzoN+UVKwctHAJaAVPRiQbOywTa3Gx+qwYjr6g0
// SIG // DYnD0WcKtescozInVNSdQCbmrfci5+7Won6A+fG5WBHA
// SIG // b5I+XR9ZWvc1POOkA3jqETujXKhy7A8fP81SmcT99Jlu
// SIG // mO0TLKrQfHBgoBsFVbqzp2jS17N9ak0U8lR1/KaTnaEo
// SIG // oQl3qnm4CQkcxvMxv3v5NKGgYxRRpfvLhRC8AsoeMCvW
// SIG // efms0832thg+KeoobbJF7N5Z1tOVCnwyYQAA7er4jnNE
// SIG // ZP3PMzoqs4dJSqX/3llGNqP4b3Az2TYC2h78nw6m/AFm
// SIG // irzt+okWUl6oUsPEsSaNEwqbGwo5rcdC6R56m29VBe3K
// SIG // tPZAnH1kwz3DddqW2C6nJNGyCHzym3Ox565DUJLP5km1
// SIG // WU5w8k9zvMxfauAwn1nrEq9WpMnA3bhsQnSgb4LSYdWM
// SIG // Q6tbJE8HmMeYgFl5weyjMpbN1kGW07m0wiy7fF5/LfrJ
// SIG // XCpuQ5L6G7m5h0q4rkwN8E8iMuBcWpkyptFQ7vZlnbPD
// SIG // LY1EiVcDVVZQV2kN2THFY4o8laFDVbgWPTHMGHCECuts
// SIG // ENtBAgMBAAGjggFJMIIBRTAdBgNVHQ4EFgQUR1UhmFDU
// SIG // N0cDpe9cyALlIyCoNSowHwYDVR0jBBgwFoAUn6cVXQBe
// SIG // Yl2D9OXSZacbUzUZ6XIwXwYDVR0fBFgwVjBUoFKgUIZO
// SIG // aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9wcy9j
// SIG // cmwvTWljcm9zb2Z0JTIwVGltZS1TdGFtcCUyMFBDQSUy
// SIG // MDIwMTAoMSkuY3JsMGwGCCsGAQUFBwEBBGAwXjBcBggr
// SIG // BgEFBQcwAoZQaHR0cDovL3d3dy5taWNyb3NvZnQuY29t
// SIG // L3BraW9wcy9jZXJ0cy9NaWNyb3NvZnQlMjBUaW1lLVN0
// SIG // YW1wJTIwUENBJTIwMjAxMCgxKS5jcnQwDAYDVR0TAQH/
// SIG // BAIwADAWBgNVHSUBAf8EDDAKBggrBgEFBQcDCDAOBgNV
// SIG // HQ8BAf8EBAMCB4AwDQYJKoZIhvcNAQELBQADggIBAMM6
// SIG // CCjmNnZ1I31rjIhqM/6L6HNXvOlcFmmTRXYEZjqELkXu
// SIG // Jy3bWTjbUxzZN0o955MgbM88Um2RENA3bsihxyOT/FfO
// SIG // 4xbbRp5UdMDz9thQHm27wG7rZDDFUDBc4VQVolg9FQJ7
// SIG // vcdH44nyygwFVy8KLp+awhasG2rFxXOx/9Az4gvgwZ97
// SIG // VMXn73MVAsrOPgwt7PAmKe1ll6WfFm/73QYQ5Yh5ge6V
// SIG // nJrAfN7nOPz9hpgCNxzJDhLu3wmkmKEIaLljq9O5fyjO
// SIG // E53cpSIq5vH9lsF0HBRM5lLyEjOpbnVMBpVTX00yVKtm
// SIG // 0wxHd7ZQyrVfQFGN665xcB08Ca8i7U+CBYb4AXzQ95i9
// SIG // XnkmpCn+8UyCOCcrdeUl4R3eaCP1xo0oMpICa1gOe6xp
// SIG // wAu67t/2WxTQjCvyY+l/F+C+pgTmGtjRisB+AN+2Bg63
// SIG // nCf6l11lGL3y2Khxn/E4WJddmINa8EiqVi6JQPwdXqgc
// SIG // OE0XL1WNCLzTYubJvv/xyfQMOjSbkf7g0e1+7w14nKVz
// SIG // JUTYBTMgA2/ABSL0D3R6nEaUaK2PmFBpb83icf9oDWMn
// SIG // swKJG6xYQArCdgX8ni8ghKOgLsBB5+ddTyhPHSuCb5Zi
// SIG // 0qB4+1RUdzRw5N80ZMdBMZJhfGjnab6CobsAQsaGfyYW
// SIG // 80s672e+BlYyiiMreRQNMIIHcTCCBVmgAwIBAgITMwAA
// SIG // ABXF52ueAptJmQAAAAAAFTANBgkqhkiG9w0BAQsFADCB
// SIG // iDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWlj
// SIG // cm9zb2Z0IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5
// SIG // IDIwMTAwHhcNMjEwOTMwMTgyMjI1WhcNMzAwOTMwMTgz
// SIG // MjI1WjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
// SIG // aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UE
// SIG // ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYwJAYDVQQD
// SIG // Ex1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDCC
// SIG // AiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAOTh
// SIG // pkzntHIhC3miy9ckeb0O1YLT/e6cBwfSqWxOdcjKNVf2
// SIG // AX9sSuDivbk+F2Az/1xPx2b3lVNxWuJ+Slr+uDZnhUYj
// SIG // DLWNE893MsAQGOhgfWpSg0S3po5GawcU88V29YZQ3MFE
// SIG // yHFcUTE3oAo4bo3t1w/YJlN8OWECesSq/XJprx2rrPY2
// SIG // vjUmZNqYO7oaezOtgFt+jBAcnVL+tuhiJdxqD89d9P6O
// SIG // U8/W7IVWTe/dvI2k45GPsjksUZzpcGkNyjYtcI4xyDUo
// SIG // veO0hyTD4MmPfrVUj9z6BVWYbWg7mka97aSueik3rMvr
// SIG // g0XnRm7KMtXAhjBcTyziYrLNueKNiOSWrAFKu75xqRdb
// SIG // Z2De+JKRHh09/SDPc31BmkZ1zcRfNN0Sidb9pSB9fvzZ
// SIG // nkXftnIv231fgLrbqn427DZM9ituqBJR6L8FA6PRc6ZN
// SIG // N3SUHDSCD/AQ8rdHGO2n6Jl8P0zbr17C89XYcz1DTsEz
// SIG // OUyOArxCaC4Q6oRRRuLRvWoYWmEBc8pnol7XKHYC4jMY
// SIG // ctenIPDC+hIK12NvDMk2ZItboKaDIV1fMHSRlJTYuVD5
// SIG // C4lh8zYGNRiER9vcG9H9stQcxWv2XFJRXRLbJbqvUAV6
// SIG // bMURHXLvjflSxIUXk8A8FdsaN8cIFRg/eKtFtvUeh17a
// SIG // j54WcmnGrnu3tz5q4i6tAgMBAAGjggHdMIIB2TASBgkr
// SIG // BgEEAYI3FQEEBQIDAQABMCMGCSsGAQQBgjcVAgQWBBQq
// SIG // p1L+ZMSavoKRPEY1Kc8Q/y8E7jAdBgNVHQ4EFgQUn6cV
// SIG // XQBeYl2D9OXSZacbUzUZ6XIwXAYDVR0gBFUwUzBRBgwr
// SIG // BgEEAYI3TIN9AQEwQTA/BggrBgEFBQcCARYzaHR0cDov
// SIG // L3d3dy5taWNyb3NvZnQuY29tL3BraW9wcy9Eb2NzL1Jl
// SIG // cG9zaXRvcnkuaHRtMBMGA1UdJQQMMAoGCCsGAQUFBwMI
// SIG // MBkGCSsGAQQBgjcUAgQMHgoAUwB1AGIAQwBBMAsGA1Ud
// SIG // DwQEAwIBhjAPBgNVHRMBAf8EBTADAQH/MB8GA1UdIwQY
// SIG // MBaAFNX2VsuP6KJcYmjRPZSQW9fOmhjEMFYGA1UdHwRP
// SIG // ME0wS6BJoEeGRWh0dHA6Ly9jcmwubWljcm9zb2Z0LmNv
// SIG // bS9wa2kvY3JsL3Byb2R1Y3RzL01pY1Jvb0NlckF1dF8y
// SIG // MDEwLTA2LTIzLmNybDBaBggrBgEFBQcBAQROMEwwSgYI
// SIG // KwYBBQUHMAKGPmh0dHA6Ly93d3cubWljcm9zb2Z0LmNv
// SIG // bS9wa2kvY2VydHMvTWljUm9vQ2VyQXV0XzIwMTAtMDYt
// SIG // MjMuY3J0MA0GCSqGSIb3DQEBCwUAA4ICAQCdVX38Kq3h
// SIG // LB9nATEkW+Geckv8qW/qXBS2Pk5HZHixBpOXPTEztTnX
// SIG // wnE2P9pkbHzQdTltuw8x5MKP+2zRoZQYIu7pZmc6U03d
// SIG // mLq2HnjYNi6cqYJWAAOwBb6J6Gngugnue99qb74py27Y
// SIG // P0h1AdkY3m2CDPVtI1TkeFN1JFe53Z/zjj3G82jfZfak
// SIG // Vqr3lbYoVSfQJL1AoL8ZthISEV09J+BAljis9/kpicO8
// SIG // F7BUhUKz/AyeixmJ5/ALaoHCgRlCGVJ1ijbCHcNhcy4s
// SIG // a3tuPywJeBTpkbKpW99Jo3QMvOyRgNI95ko+ZjtPu4b6
// SIG // MhrZlvSP9pEB9s7GdP32THJvEKt1MMU0sHrYUP4KWN1A
// SIG // PMdUbZ1jdEgssU5HLcEUBHG/ZPkkvnNtyo4JvbMBV0lU
// SIG // ZNlz138eW0QBjloZkWsNn6Qo3GcZKCS6OEuabvshVGtq
// SIG // RRFHqfG3rsjoiV5PndLQTHa1V1QJsWkBRH58oWFsc/4K
// SIG // u+xBZj1p/cvBQUl+fpO+y/g75LcVv7TOPqUxUYS8vwLB
// SIG // gqJ7Fx0ViY1w/ue10CgaiQuPNtq6TPmb/wrpNPgkNWcr
// SIG // 4A245oyZ1uEi6vAnQj0llOZ0dFtq0Z4+7X6gMTN9vMvp
// SIG // e784cETRkPHIqzqKOghif9lwY1NNje6CbaUFEMFxBmoQ
// SIG // tB1VM1izoXBm8qGCA1kwggJBAgEBMIIBAaGB2aSB1jCB
// SIG // 0zELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEtMCsGA1UECxMkTWlj
// SIG // cm9zb2Z0IElyZWxhbmQgT3BlcmF0aW9ucyBMaW1pdGVk
// SIG // MScwJQYDVQQLEx5uU2hpZWxkIFRTUyBFU046NTcxQS0w
// SIG // NUUwLUQ5NDcxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1l
// SIG // LVN0YW1wIFNlcnZpY2WiIwoBATAHBgUrDgMCGgMVAARx
// SIG // 5+zQhrrGc9kX1W8rsGMD8pAVoIGDMIGApH4wfDELMAkG
// SIG // A1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAO
// SIG // BgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0
// SIG // IFRpbWUtU3RhbXAgUENBIDIwMTAwDQYJKoZIhvcNAQEL
// SIG // BQACBQDrM6unMCIYDzIwMjUwMTE2MTYwMDM5WhgPMjAy
// SIG // NTAxMTcxNjAwMzlaMHcwPQYKKwYBBAGEWQoEATEvMC0w
// SIG // CgIFAOszq6cCAQAwCgIBAAICIQ8CAf8wBwIBAAICEuYw
// SIG // CgIFAOs0/ScCAQAwNgYKKwYBBAGEWQoEAjEoMCYwDAYK
// SIG // KwYBBAGEWQoDAqAKMAgCAQACAwehIKEKMAgCAQACAwGG
// SIG // oDANBgkqhkiG9w0BAQsFAAOCAQEAw7EWGWzwoo0aJmM7
// SIG // LZyKlCqowAz8PerZ9dktDMorfqfeFDwtFa5CINVg52Ro
// SIG // ZnvQtZmJ0KnIWtJRfBZTLumkOnrVAWzBfui4qHN2xHRI
// SIG // tQyhoWMEU0zYV3h+45hWvoV3Ky7eLm6fkpTUz4ii8BvX
// SIG // 6i7cR0wUE0Pq1D4mQtkf/vsQsxwcm9MDrjaf+keJsyi0
// SIG // 4zvBxcjr5PiJdgwOuANrbiuOje8clyPqF9FYbJBCMiSq
// SIG // WQN6CKP5IlkkWyHodFcre6uSo0ildVLt4y/m585z7vH0
// SIG // BdpxchkQOh/Au2L4Z0CKReRf5jA2DJufwb7LW4hcbxkl
// SIG // bWKiNkrT1u+bPlQKITGCBA0wggQJAgEBMIGTMHwxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29m
// SIG // dCBUaW1lLVN0YW1wIFBDQSAyMDEwAhMzAAAB+8vLbDdn
// SIG // 5TCVAAEAAAH7MA0GCWCGSAFlAwQCAQUAoIIBSjAaBgkq
// SIG // hkiG9w0BCQMxDQYLKoZIhvcNAQkQAQQwLwYJKoZIhvcN
// SIG // AQkEMSIEILxVNclHRAJosrXksKMCknSeUfGEk5oHRTbX
// SIG // j4lRKfFjMIH6BgsqhkiG9w0BCRACLzGB6jCB5zCB5DCB
// SIG // vQQgOdsCq/yghZVTWIlrAi7AeKoYxGBD98R6mKg7tUkk
// SIG // 5RgwgZgwgYCkfjB8MQswCQYDVQQGEwJVUzETMBEGA1UE
// SIG // CBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEe
// SIG // MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYw
// SIG // JAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0Eg
// SIG // MjAxMAITMwAAAfvLy2w3Z+UwlQABAAAB+zAiBCDXJLx2
// SIG // czG+4QCXBZWm9W86NVUGKCreMGdt400PnhK67jANBgkq
// SIG // hkiG9w0BAQsFAASCAgBXZFauUUkwogBS7AYThFfTr+uQ
// SIG // ATx5JIDbFnerV79dXwf7V+Xy/QS7icrm/3iL5oeaq+ES
// SIG // /6go0QyOePlKqSdkgR2Oxr/U6/Vd7xN3wld71AhkPMQl
// SIG // RiK5ST+hJp6/HTrjshFnEtb9+XIX3kGQLHNpS0uEz4Se
// SIG // Q6ArXdZsES5Ww9VSkUBJ/HdxJ2VNXXmGILBVD/77JzWw
// SIG // h306yAtHoybHXdZnwGB9UQKncsIHfpxj/47X180PFDne
// SIG // 8f1r2ebTkyqlqUg2GtvyPKkBaQ7DwI3UG0AkzzNkOBi/
// SIG // RH1zdMe0uwZkatGx1liCMcLaAiArSsuLq1xJtO2XbVVX
// SIG // l2TGqcqy+usX56QOSXHOuch+JheK/DsaaiHu7RX8iczJ
// SIG // aQg49+rbYD46L3byvxTMlcEFRXgaURa4lzz/Xr6qBx1J
// SIG // pGgdSVRLpoaenhyqK8pIK+4a5KY/bVjQZ38DkFqI5GFo
// SIG // IFJ0/cGs4v0zKYK74s9HJmkWdA4zYLQCBlt/Qp4/WHST
// SIG // 2ZtWgQZPWqZD6TssbGs7G6AwUbPNxhWOa+s+d8BD6AAY
// SIG // mTMx8eB1u98enyCpCREZmjQCvbOmUYSswhLgRZLAoMKF
// SIG // 57bx94703Gxhsgi2BJYWEw0r2LRMBTPBk7nwoK8QLuCJ
// SIG // zxpa/Q+wASRDyU3viw+XiXtzPIZLrLvr9pBSjudqtw==
// SIG // End signature block
