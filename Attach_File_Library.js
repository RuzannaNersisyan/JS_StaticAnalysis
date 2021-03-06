'USEUNIT Subsystems_SQL_Library
'USEUNIT  Library_Common
'USEUNIT Constants
'USEUNIT SWIFT_International_Payorder_Library

' Ստեղծել փաստաթղթի ընդլայնում
' wDocType - Փաստաթղթի տեսակ
' attachments - Առաջացնել կցված ֆայլերի էջ
Sub CreateDocumentExtension(wDocType, attachments)
      Dim wMainForm
      
      Set wMainForm = Sys.Process("Asbank").VBObject("MainForm") 
      
      ' Կատարել բոլոր գործողությունները
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Գործողության տիպը պայամանագրի նկատմամբ
      Call wMainForm.PopupMenu.Click(c_CrDocExtens)
      
      ' Փաստաթղթի տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "DOCTYPE", wDocType)
      ' Առաջացնել կցված ֆայլերի էջ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "CheckBox", "ATTACHMENTS", attachments)
      
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      
End Sub


' Ֆայլի կցման հետ կապված գործողությունների իրականացում արտարժույթի փոխանակում փաստաթղթում
' fISN - Փաստաթղթի ISN
' department - Բաժին
' docNumber - Փաստաթղթի N
' accDeb - Հաշիվ դեբետ
' accCred - Հաշիվ կրեդիտ
' cur1 - Արժույթ 1
' cur2 - Արժույթ 2
' summa1 - Գումար 1
' aim - Նպատակ
' ptype - Գանձման տեսակ
' clientCode - Հաճախորդի կոդ
' clientName - Վճարող/Ստացող
' filePathName - Ֆայլի ճանապարհը, որն անհրաժեշտ է բեռնել
' creatFileName - Բեռնված փաստաթղթի ճանապարհը
' sameFileName - Բեռնվող ֆայլի ճանապարհ
' saveAs - Պահպանված ֆայլի ճանապարհը
' filePathName1 - Բեռնվող ֆայլի ճանապարհ 
' fileName - Բեռնվող ֆայլի անուն
' fileName1 - Բեռնվող ֆայլի անուն
Sub CheckAttachedAction(fISN, department, docNumber, wDate, accDeb, accCred, cur1, cur2, summa1, aim, ptype, clientCode, clientName, filePathName, _
                                                creatFileName, sameFileName, saveAs, filePathName1, fileName, fileName1 )

      Dim rekvName, wTabStrip, asAttachments1, compareFile
      Call wTreeView.DblClickItem("|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|Üáñ ÷³ëï³ÃÕÃ»ñ|ì×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ|²ñï³ñÅáõÛÃÇ ÷áË³Ý³ÏáõÙ|²ñï³ñÅáõÛÃÇ ÷áË³Ý³ÏáõÙ")
        
      BuiltIn.Delay(1000)
      ' Ստեղծվող փաստաթղթի ISN - ի վերագրում փոփոխականին
      fISN = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACSDEPART", department)
      ' Փաստաթղթի N դաշտի արժեքի վերագրում փոփոխականին
      rekvName = GetVBObject("DOCNUM", wMDIClient.vbObject("frmASDocForm"))
      docNumber = wMDIClient.vbObject("frmASDocForm").vbObject("TabFrame").vbObject(rekvName).Text
    
      ' Ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "DATE", wDate)
      ' Հաշիվ դեբետ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACCDB", accDeb)
      ' Հաշիվ կրեդիտ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACCCR", accCred)
      ' Արժույթ 1 դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "CURDB", cur1)
      ' Արժույթ 2 դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "CURCR", cur2)
      ' Գումար 1 արժույթով դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SUMDB", summa1 & "[Tab]")
      ' Նպատակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "AIM", aim)
      
      ' Անցում 2.Լրացուցիչ էջ
      Set wTabStrip = wMDIClient.vbObject("frmASDocForm").vbObject("TabStrip")
      wTabStrip.SelectedItem = wTabStrip.Tabs(2)
      
      ' Գանձման տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "PAYSCALE", ptype)
         
      ' Անցում 3.Դրամարկղ էջ
      wTabStrip.SelectedItem = wTabStrip.Tabs(3)
       
      ' Հաճախորդի կոդ դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "CliCode", clientCode)
      ' Վճարող/Ստացող դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "PAYREC", "^A[Del]" & clientName)
        
      ' Անցում 4.Կցված էջ
      wTabStrip.SelectedItem = wTabStrip.Tabs(4)
      Set asAttachments1 = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").VBObject("TabFrame_4").VBObject("AsAttachments1")
      
      asAttachments1.VBObject("CmdAdd").Click
      
      ' Ընտրել ֆայլը
      Sys.Process("Asbank").Window("#32770", "Open", 1).Window("ComboBoxEx32", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(filePathName)
      BuiltIn.Delay(1000) 
      ' Բեռնել ֆայլը
      Sys.Process("Asbank").Window("#32770", "Open", 1).Window("Button", "&Open", 1).Click
      BuiltIn.Delay(10000) 
      
      ' Ստուգում որ ֆայլը ստեղծվել է SQL  բազայում
      queryString = "select COUNT(*) from DOCSATTACH where fFILE = '" & fileName & "' and fISN = '" & fISN & "'"
      count = Get_Query_Result(queryString)
      
      If count <> 1 Then
            Log.Error(fileName & " ֆայլի կցումը չի հաջողվել")
            Exit Sub
      End If
      
      ' Ֆայլերի համեմատում
      compareFile = creatFileName & fISN &"\" & fileName
      If NOT Files.Compare(filePathName , compareFile)  Then
              Log.Warning("Ֆայլերը նման չեն")
              Exit Sub
      End If
      
      ' Կցել ֆայլ գործողության կատարում
      asAttachments1.VBObject("CmdAdd").Click
      
      ' Ընտրել ֆայլը
      Sys.Process("Asbank").Window("#32770", "Open", 1).Window("ComboBoxEx32", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(sameFileName)
      ' Բեռնել ֆայլը
      Sys.Process("Asbank").Window("#32770", "Open", 1).Window("Button", "&Open", 1).Click
      
      Call ClickCmdButton(5, "²Ûá")
      BuiltIn.Delay(4000) 
      
      ' Բացել ֆայլի թղթապանակը գործողության ստուգում
      asAttachments1.VBObject("CmdFolder").Click
      
      If Not Sys.Process("explorer").Window("CabinetWClass", "" & fISN & "", 1).Exists Then
            Log.Error("'Բացել ֆայլի թղթապանակը' կոճակի սեղմման ժամանակ համապատասխան թղթապանակը չի բացվել")
            Exit Sub 
      End If
      
      Sys.Process("explorer").Window("CabinetWClass", "" & fISN & "", 1).Close  
      
      ' Ֆայլերի համեմատում
      compareFile = creatFileName & fISN &"\" & fileName
      If NOT Files.Compare(sameFileName , compareFile)  Then
              Log.Warning("Ֆայլերը նման չեն")
              Exit Sub
      End If

      ' Դիտել գործողության ստուգում
      asAttachments1.VBObject("CmdView").Click
      BuiltIn.Delay(1500)
      If Not Sys.Process("notepad").Window("Notepad", "ForTest.txt - Notepad", 1).Exists Then
            Log.Error("'Դիտել' կոճակի սեղմման ժամանակ համապատասխան ֆայլը չի բացվել")
            Exit Sub 
      End If
      
      Sys.Process("notepad").Window("Notepad", "ForTest.txt - Notepad", 1).Close
      
      ' Հիշել որպես գործողության ստուգում
      asAttachments1.VBObject("CmdSaveAs").Click
      
      If Not Sys.Process("Asbank").Window("#32770", "Save As", 1).Exists Then
            Log.Error("'Հիշել որպես' կոճակի սեղմման ժամանակ համապատասխան թղթապանակը չի բացվել")
            Exit Sub 
      End If
      
      Sys.Process("Asbank").Window("#32770", "Save As", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(saveAs)
      Sys.Process("Asbank").Window("#32770", "Save As", 1).Window("Button", "&Save", 1).Click
      BuiltIn.Delay(4000)
     
      ' Ֆայլերի համեմատում
      compareFile = creatFileName & fISN &"\" & fileName
      If NOT Files.Compare(saveAs, compareFile)  Then
              Log.Warning("Ֆայլերը նման չեն")
              Exit Sub
      End If
           
      ' Ջնջել գործողության ստուգում
      asAttachments1.VBObject("CmdDelete").Click
      
      If Not Sys.Process("Asbank").VBObject("frmAsMsgBox").Exists Then
            Log.Error("'Ջնջել' գործողության իրականացումը ձախողվել է")
            Exit Sub      
      End If
      
      Call ClickCmdButton(5, "²Ûá")
        
      ' Կցել հղում գործողության կատարում
      AsAttachments1.VBObject("CmdAddLink").Click
      
      Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("AsTypePath").VBObject("TxtPath").Keys(filePathName)
        
      ' Բեռնել ֆայլը
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000) 
      
      ' Ստուգում որ ֆայլը ստեղծվել է SQL  բազայում
      queryString = "select COUNT(*) from DOCSATTACH where fFILE = '" & filePathName & "' and fISN = '" & fISN & "'"
      count = Get_Query_Result(queryString)
      
      If count <> 1 Then
            Log.Error(filePathName & " ֆայլի կցումը չի հաջողվել")
            Exit Sub
      End If

      ' Դիտել գործողության ստուգում
      asAttachments1.VBObject("CmdView").Click
      BuiltIn.Delay(1000) 
      
      If Not Sys.Process("notepad").Window("Notepad", "ForTest.txt - Notepad", 1).Exists Then
            Log.Error("'Դիտել' կոճակի սեղմման ժամանակ համապատասխան ֆայլը չի բացվել")
            Exit Sub 
      End If
      
      Sys.Process("notepad").Window("Notepad", "ForTest.txt - Notepad", 1).Close        
      
      ' Ջնջել գործողության ստուգում
      asAttachments1.VBObject("CmdDelete").Click
      
      If Not Sys.Process("Asbank").VBObject("frmAsMsgBox").Exists Then
            Log.Error("Ջնջել գործողությունը չի իրականացել")
            Exit Sub      
      End If
      
      Call ClickCmdButton(5, "²Ûá")

      ' Կցել ֆայլ գործողության կատարում
      AsAttachments1.VBObject("CmdAdd").Click
      
      ' Ընտրել ֆայլը
      Sys.Process("Asbank").Window("#32770", "Open", 1).Window("ComboBoxEx32", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(filePathName1)
      ' Բեռնել ֆայլը
      Sys.Process("Asbank").Window("#32770", "Open", 1).Window("Button", "&Open", 1).Click
      BuiltIn.Delay(3000) 
      
      ' Ստուգում որ ֆայլը ստեղծվել է SQL  բազայում
      queryString = "select COUNT(*) from DOCSATTACH where fFILE = '" & fileName1 & "' and fISN = '" & fISN & "'"
      count = Get_Query_Result(queryString)
      
      If count <> 1 Then
            Log.Error(fileName1 & " ֆայլի կցումը չի հաջողվել և ֆայլը չի ավելացել SQL բազայում")
            Exit Sub
      End If

      Call ClickCmdButton(1, "Î³ï³ñ»É")
      BuiltIn.Delay(1000) 
      
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("FrmSpr").Close

End Sub


' Կցված ֆայլի և փաստաթղթի առկայության ստուգում կցված ֆայլեր թղթապանակում
' wDocType - Փաստաթղթի տեսակ
' wSDate - Ժամանակահատվածի սկիզբ
' wEDate - Ժամականահատվածի ավարտ
' fileCount - Կցված ֆայլերի քանակ
Sub CheckAttachedFilesFromAttachFileDoc(wDocType, wSDate, wEDate, fISN, fileCount)

      Dim wMDIClient, tdbgView, wTabStrip, tabFrame

      Call wTreeView.DblClickItem("|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|Îóí³Í ý³ÛÉ»ñ")
      
      ' Փաստաթղթի տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", wDocType)
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SDATE", wSDate)
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EDATE", wEDate)
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000) 
      
      Set wMDIClient = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1)
      Set tdbgView = wMDIClient.VBObject("frmPttel").VBObject("TDBGView")
      
      Do Until tdbgView.EOF
        
          If Trim( tdbgView.Columns.Item(1).Value) = Trim(fISN) Then
              ' Կատարել բոլոր գործողությունները
              Call wMainForm.MainMenu.Click(c_AllActions)
              ' Այլ վճարումների գրաֆիկի նշանակում
              Call wMainForm.PopupMenu.Click(c_View)
              
              If wMDIClient.WaitvbObject("frmASDocForm",12000).Exists Then
      
                  Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")
      
                  wTabStrip.SelectedItem = wTabStrip.Tabs(4)
                  Set tabFrame = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_4") 
      
                  If  Not Trim(tabFrame.VBObject("AsAttachments1").VBObject("ListViewAttachments").wItemCount) = Trim(fileCount) Then
                      Call ClickCmdButton(1, "OK") 
                      Log.Error("Ֆայլի կցումը չի իրականացել, Կցված ֆայլեր էջը դատարկ է")
                      Exit Sub
                  End If
      
                  Log.Message("Ֆայլերը հաջողությամբ կցվել են և առկա են Կցված ֆայլեր թղթապանակում")      
      
                  Call ClickCmdButton(1, "OK") 
              Else  
                  Log.Error("Արտարժույթի փոխանակում փաստաթղթը չի բացվել")
              End If
              Exit Do                   
          Else
               tdbgView.MoveNext
          End If
      Loop
End Sub