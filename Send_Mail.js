'fromName - ուղարկողի անվանումը 
'fromMail - ուղարկողի մեյլը 
'toMail - ստացող մեյլ 
'toMail - ստացողի մեյլը 
'mailSubject - մեյլի subject 
'mailBody - մեյլի պարունակություն
'mailAttachment - մեյլին կցված ֆայլեր
Function SendEmail(fromName, fromMail, toMail, mailSubject, mailBody, mailAttachment)
                       
    Dim i, schema, messageConfig, mailMessage
    Dim finalSender
        
    finalSender = """" & fromName & """ <" & Trim(fromMail) & ">"

    Err.Clear
    On Error Resume Next

    schema = "http://schemas.microsoft.com/cdo/configuration/"
    Set messageConfig = Sys.OleObject("CDO.Configuration")
    With messageConfig.Fields
        .Item(schema + "sendusing") = 2 ' cdoSendUsingPort
        .Item("http://schemas.microsoft.com/cdo/configuration/smtpusessl") = True
      ' use Outlook --
        .Item(schema + "smtpserver") = "armsoft-am.mail.protection.outlook.com"
        .Item(schema + "smtpserverport") = 25    
        .Item(schema + "smtpauthenticate") = 0 ' Authentication mechanism
       ' .Item(schema + "sendusername") = fromMail ' User name (if needed)
        '.Item(schema + "sendpassword") = fromPassword' User password (if needed)
        .Update
    End With

    Set mailMessage = Sys.OleObject("CDO.Message")
    With mailMessage
        .Configuration = messageConfig
        .From = finalSender
        .Sender = finalSender
        .To = toMail
        .Subject = mailSubject
        .HTMLBody = mailBody
        If Not IsNull(mailAttachment) Then
           aqString.ListSeparator = ","
           For i = 0 To aqString.GetListLength(mailAttachment) - 1
               .AddAttachment aqString.GetListItem(mailAttachment, i)
           Next
         End If  
        .Send
    End With
    

    If Err.Number <> 0 Then
       Log.Error "Email cannot be sent " & Err.Description,,,ErrorColor
       SendEMail = False
    Else
       Log.Message "Message to <" + toMail + "> was successfully sent" ,,, MessageColor 
       SendEMail = True
    End If
End Function

Function SendEmailFromSender(toMail, mailSubject, mailBody, mailAttachment)

    Dim compName, wsNetwork
    Dim fromMail, frompassword
    
    Set wsNetwork = CreateObject("WScript.Network")
    compName = wsNetwork.ComputerName
    
    fromMail = "testcomplete@armsoft.am"
     
    Call SendEmail(compName, fromMail, toMail, mailSubject, mailBody, mailAttachment)
    
End Function

Sub SendMailTest

    Dim toMail, mailSubject, mailBody, mailAttachment
    toMail = "vahan.saghatelyan@armsoft.am"
    mailSubject = "Subject"
    mailBody = "Message body"
    mailAttachment = "D:\File1.txt, D:\File2.txt, D:\File3.txt, D:\Logggg.png"

    Call SendEmailFromSender(toMail, mailSubject, mailBody, mailAttachment)
    
End Sub

'Runs at last to save test results 
'and sends e-mail
Sub SendingTestsResult(Mail)
  Dim folderPath: folderPath = "C:\TestResults\Bank\" + aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y.%m.%d.%H.%M") + "\"
  Dim picName: picName = "TestResults.jpg"
  
  Log.Message "---Saving Test Results---", "", pmNormal, DivideColor  
  Call Log.SaveResultsAs(folderPath, lsHTML, False, lesFull)
  
  Log.Message "---Taking Screenshot of Test Results---", "", pmNormal, DivideColor  
  Call GetScreenshotOfResults(folderPath, picName) 
  
  Log.Message "---Sanding E-Mail---", "", pmNormal, DivideColor  
  Call SendEmailFromSender(Mail, "Current test results report", "Current test results are attached", folderPath + picName)
End Sub

'Open file with Microsoft Edge
'and gets screenshot of it
Sub GetScreenshotOfResults(folderPath, picName) 
  Dim msedgeWin
  If Sys.WaitProcess("msedge", 1000).Exists Then
    Call Sys.Process("msedge").Terminate
  End If            
  
  Dim WshShell: Set WshShell = CreateObject("WScript.Shell")
  WshShell.Run "msedge " + GetResultFilePath(folderPath)
  
  BuiltIn.Delay(5000)
  If Sys.Process("msedge").WaitWindow("Chrome_WidgetWin_1", "Summary Report *", 1,1000).Exists Then
      Set msedgeWin = Sys.Process("msedge").Window("Chrome_WidgetWin_1", "Summary Report *", 1)
    
      Call msedgeWin.Maximize
      Call msedgeWin.Picture(25, 170, 535, 505, False).SaveToFile(folderPath + picName)
      Call Sys.Process("msedge").Terminate
  Else
    If Sys.Process("msedge").WaitWindow("Chrome_WidgetWin_1", "Summary Report *", 2,1000).Exists Then
      Set msedgeWin = Sys.Process("msedge").Window("Chrome_WidgetWin_1", "Summary Report *", 2)
    
      Call msedgeWin.Maximize
      Call msedgeWin.Picture(25, 170, 535, 505, False).SaveToFile(folderPath + picName)
      Call Sys.Process("msedge").Terminate
    Else
      Log.Error "Microsoft Edge wasn't found.", "", pmNormal, ErrorColor
    End If
  End If
  
  Set msedgeWin = Nothing
  Set WshShell = Nothing
End Sub

'Find Results File in folderPath Folder
Function GetResultFilePath(folderPath)
  Dim fs: Set fs = CreateObject("Scripting.FileSystemObject")
  Dim fld: Set fld = fs.GetFolder(folderPath)
  Dim fileNotFound: fileNotFound = True
    
  Dim fi1: For Each fi1 In fld.Files
    If InStr(fi1.name, "htm") > 0 And fi1.name <> "index.htm" Then
      GetResultFilePath = folderPath + fi1.name
      fileNotFound = False
      Exit For
    End If
  Next
  
  If fileNotFound Then
    Log.Error "Results file wasn't found.", "", pmNormal, ErrorColor
  End If
    
  Set fld= Nothing
  Set fs = Nothing
End Function

Sub a()
  Log.Message  aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y.%m.%d.%H:%M") + "\"
End Sub