Option Explicit

'USEUNIT Comunal_Library
'USEUNIT Library_Common  
'USEUNIT Subsystems_SQL_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Constants

'Test Case N 121504

Sub Comunal_Other_Test()
  Dim fDATE, sDATE, attr, FolderName, FrmSpr, FrmMsgBox, FileForCompare, ExportedFile, ExportedFileToTxt, day, month,_ 
      param, StrToFind, TXTFileName, ExportPath, ActualMessage, ExpectedMessage
  Dim QueryString, ExpSQLValue, ColNum, SQL_IsEqual, Amount, Debt, AmountUSD      
  Dim CommunalPayment
  Dim wndNotepad, progress, comboBox, edit
  Dim fso, objFolder, obj
  
  'Համակարգ մուտք գործել ADMIN օգտագործողով
  fDATE = "20240101"
  sDATE = "20140101"
  Call Initialize_AsBankQA(sDATE, fDATE)
  Login("ADMIN")
  Call Create_Connection()
  
'--------------------------------------
  Set attr = Log.CreateNewAttributes
  attr.BackColor = RGB(0, 255, 255)
  attr.Bold = True
  attr.Italic = True
'--------------------------------------  

  FileForCompare = Project.Path & "Stores\Communal\Expected\Other.txt"
  ExportPath = Project.Path & "Stores\Communal\Actual\Other"
  
  ' Ջնջել գոյություն ունեցող ֆայլերը  
  Set fso = CreateObject("Scripting.FileSystemObject")
  Set objFolder = fso.GetFolder(ExportPath)
  For Each obj in objFolder.Files
      If aqString.StrMatches("Z001.*_1.dbf", obj.Name) Then
         Call aqFileSystem.DeleteFile(ExportPath & "\" & obj.Name)
      ElseIf aqString.StrMatches("Z001.*_1.txt", obj.Name) Then
         Call aqFileSystem.DeleteFile(ExportPath & "\" & obj.Name)
      End If
  Next
  If aqFileSystem.Exists(ExportPath & "\Actual Message.txt") Then
    Call aqFileSystem.DeleteFile(ExportPath & "\Actual Message.txt")
  End If
  
  Call ChangeWorkspace(c_ComPay)
  wTreeView.DblClickItem("|ÎáÙáõÝ³É í×³ñáõÙÝ»ñÇ ²Þî|²ÛÉ ÏáÙáõÝ³É í×³ñáõÙÝ»ñ|²ÛÉ ÏáÙáõÝ³É í×³ñáõÙÝ»ñÇ Ï³ñ·³íáñáõÙÝ»ñ")
  With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
   'Արտահնման ճանապարհի կարգավորում
    .Row = 0
    .Col = 8
    .Keys(ExportPath)
    Call ClickCmdButton(1, "Î³ï³ñ»É")
  End With
  
  FolderName = "|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |"
  Call ChangeWorkspace(c_CustomerService)
  
  Call Log.Message("Կոմունալ վճարումներ փաստաթղթի ստեղծում",,,attr)
  Set CommunalPayment = New_CommunalPaymentDoc()
  With CommunalPayment
    .Date = aqConvert.DateTimeToStr(aqDateTime.Today)
    .arrayServicesToBePaid = Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1)
    .OtherComCode = "2222222222"
    .Amount = 1500.00
    Call .CreateComPay(FolderName & "²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    
    Amount = 1500.00
    Debt = 0.00
    AmountUSD = 3.615
    
       'SQL ստուգում Կոմունալ վճարումների հանձնարարագիրը ստեղցելուց հետո: 
          'HI
          QueryString = "SELECT COUNT(*) FROM HI WHERE fBASE = " & .fBASE &_
                          " AND fSUM = " & Amount & " AND fCURSUM = " & Amount
          ExpSQLValue = 2
          ColNum = 0
          SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
          If Not SQL_IsEqual Then
            Log.Error("Expected result = " & ExpSQLValue)
          End If  
    
    'Վավերացնել Կոմունալ վճարումների հանձնարարագիրը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToConfirm)
    Call ClickCmdButton(1, "Ð³ëï³ï»É")
    wMDIClient.VBObject("frmPttel").Close
    
       'SQL ստուգում Կոմունալ վճարումների հանձնարարագիրը Վավերացնելուց հետո: 
          'COM_PAYMENTS
          QueryString = "SELECT COUNT(*) FROM COM_PAYMENTS WHERE fISN = " & .fBASE &_
                         "AND fAMOUNT = " & Amount & " AND fDEBT = " & Debt & " AND fEXPDATE IS NULL"
          ExpSQLValue = 1
          ColNum = 0
          SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
          If Not SQL_IsEqual Then
            Log.Error("Expected result = " & ExpSQLValue)
          End If  
          
          'PAYMENTS
          QueryString = "SELECT COUNT(*) FROM PAYMENTS WHERE fISN = " & .fBASE &_
                         "AND fSUMMA = " & Amount & " AND fSUMMAAMD = " & Amount & " AND fSUMMAUSD = " & AmountUSD
          ExpSQLValue = 1
          ColNum = 0
          SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
          If Not SQL_IsEqual Then
            Log.Error("Expected result = " & ExpSQLValue)
          End If  
    
    Call ChangeWorkspace(c_ComPay)
    wTreeView.DblClickItem("|ÎáÙáõÝ³É í×³ñáõÙÝ»ñÇ ²Þî|ÎáÙáõÝ³É í×³ñáõÙÝ»ñ")
    Call Rekvizit_Fill("Dialog", 1, "General", "DSDATE", .Date)
    Call Rekvizit_Fill("Dialog", 1, "General", "DEDATE", .Date)
    Call Rekvizit_Fill("Dialog", 1, "General", "DISN", .fBASE)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 1 Then
      Log.Error("Կոմունալ վճարումների հանձնարարագիրը առկա չէ Կոմունալ վճարումներ թղթապանակում")
      Exit Sub
    End If

    Call Log.Message("Արտահանել Կոմունալ վճարումների հանձնարարագիրը",,,attr)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ExportData)
	BuiltIn.Delay(5000)   
    Call wMainForm.MainMenu.Click("Պատուհաններ|2  Տվյալների արտահանման սխալներ")
    Set FrmSpr = wMDIClient.WaitVbObject("FrmSpr", 2000)
	If FrmSpr.Exists Then
      FrmSpr.SetFocus
      'Սեղմել "Հիշել որպես"
      Call wMainForm.MainMenu.Click(c_SaveAs)
      ActualMessage = Project.Path & "Stores\Communal\Actual\Other\Actual Message.txt"
      ExpectedMessage = Project.Path & "Stores\Communal\Expected\Expected Message.txt"
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(ActualMessage)
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("Button", "&Save", 1).Click()
    
      Call Compare_Files(ExpectedMessage, ActualMessage, "")
      FrmSpr.Close
    Else  
      Call Log.Error("Մշակված/Չմշակված տողերի մասին հաղորդագրությունը չի հայտնվել") 
    End If
    
       'SQL ստուգում Կոմունալ վճարումների հանձնարարագիրը Արտահանելուց հետո: 
          'COM_PAYMENTS
          QueryString = "SELECT COUNT(*) FROM COM_PAYMENTS WHERE fISN = " & .fBASE &_
                          "AND fAMOUNT = " & Amount & " AND fDEBT = " & Debt & " AND NOT fEXPDATE IS NULL"
          ExpSQLValue = 1
          ColNum = 0
          SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
          If Not SQL_IsEqual Then
            Log.Error("Expected result = " & ExpSQLValue)
          End If  
          
          'HI
          QueryString = "SELECT COUNT(*) FROM HI WHERE fBASE = " & .fBASE &_
                          "AND fSUM = " & Amount & " AND fCURSUM = " & Amount & " AND fTRANS = 0"
          ExpSQLValue = 2
          ColNum = 0
          SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
          If Not SQL_IsEqual Then
            Log.Error("Expected result = " & ExpSQLValue)
          End If  
    
    'Համեմատել արտահանված ֆայլը           
    If aqDateTime.GetDay(aqDateTime.Today) < 10 Then
      day = "0" & aqDateTime.GetDay(aqDateTime.Today)
    Else
      day = aqDateTime.GetDay(aqDateTime.Today)  
    End If
    If aqDateTime.GetMonth(aqDateTime.Today) < 10 Then
      month = "0" & aqDateTime.GetMonth(aqDateTime.Today)
    Else
      month = aqDateTime.GetMonth(aqDateTime.Today)  
    End If
    
    ExportedFile = Project.Path & "Stores\Communal\Actual\Other\Z001" & month & day & "_1" & ".dbf"   
    ExportedFileToTxt = Project.Path & "Stores\Communal\Actual\Other\Z001" & month & day & "_1" & ".txt" 
    TXTFileName = "Z001" & month & day & "_1" & ".txt"
    Call aqFileSystem.CopyFile(ExportedFile, ExportedFileToTxt)
    TestedApps.Notepad.Run
    Set wndNotepad = Sys.Process("notepad").Window("Notepad")
    Call wndNotepad.MainMenu.Click("File|Open...")
    Set progress = Sys.Process("notepad").Window("#32770", "Open").Window("WorkerW").Window("ReBarWindow32").Window("Address Band Root").Window("msctls_progress32")
    Call Sys.Process("notepad").Window("#32770", "Open").Window("WorkerW").Window("ReBarWindow32").Window("Address Band Root").Window("msctls_progress32").Window("ToolbarWindow32", "Address band toolbar").ClickItem(202, False)
    Sys.Process("notepad").Window("#32770", "Open", 1).Window("ComboBoxEx32", "", 1).Window("ComboBox", "", 1).Keys(ExportedFileToTxt)
    Sys.Process("notepad").Window("#32770", "Open", 1).Window("Button", "&Open", 1).ClickButton
    Call wndNotepad.MainMenu.Click("File|Save As...")
    Sys.Process("notepad").Window("#32770", "Save As", 1).Window("Button", "&Save", 1).ClickButton
    Sys.Process("notepad").Window("#32770", "Confirm Save As", 1).UIAObject("Confirm_Save_As").Window("CtrlNotifySink", "", 7).Window("Button", "&Yes", 1).ClickButton
    Sys.Process("notepad").Window("Notepad", TXTFileName & " - Notepad", 1).Close

    param = "(..........Ú)|(.........Ú)|(........Ú)|(.......Ú)|202..........."
    Call Compare_Files(FileForCompare, ExportedFileToTxt, param)

    Call Log.Message("Մարել (առանձին) գործողության կատարում",,,attr)
    Call ComunalRepaySingle(.Date) 
    
    wMDIClient.VBObject("frmPttel").SetFocus()
    
    Call Log.Message("Բոլոր փաստաթղթերի ջնջում",,,attr)
    'Ջնջել փաստաթուղթը COM_PAYMENTS աղյուսակից
    queryString = "DELETE FROM COM_PAYMENTS WHERE fISN = " & .fBASE
    Call Execute_SLQ_Query(queryString)
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_ToRefresh)
    BuiltIn.Delay(2000)
    If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 0 Then
      Log.Error("Փաստաթուղթը չի ջնջվել COM_PAYMENTS աղյուսակից")
    End If

    wMDIClient.VBObject("frmPttel").Close
    Call ChangeWorkspace(c_CustomerService)
    wTreeView.DblClickItem(FolderName & "Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    
    'Ջնջել Խմբային հիշարար օրդեր փաստաթուղթը
    Call Rekvizit_Fill("Dialog", 1, "General", "PERN", "^A[Del]" &.Date) 
    Call Rekvizit_Fill("Dialog", 1, "General", "PERK", "^A[Del]" &.Date) 
    Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", "^A[Del]" & "CmMOrdPk")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.Delay(2000)
    If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 1 Then
      Log.Error("'Հաշվառված վճարային փաստաթղթեր' թղթապանակում 'Խմբային հիշարար օրդեր' տեսակի փաստաթղթերի քանակը 1 չէ:")
    Else  
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_Delete)
      Call ClickCmdButton(3, "²Ûá")
    End If
    
    wMDIClient.VBObject("frmPttel").Close
    
    wTreeView.DblClickItem(FolderName & "Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    
    'Ջնջել Կոմունալ վճարումների հանձնարարագիրը
    Call Rekvizit_Fill("Dialog", 1, "General", "PERN", "^A[Del]" &.Date) 
    Call Rekvizit_Fill("Dialog", 1, "General", "PERK", "^A[Del]" &.Date) 
    Call Rekvizit_Fill("Dialog", 1, "General", "DOCISN", .fBASE)
    Call ClickCmdButton(2, "Î³ï³ñ»É")    

    BuiltIn.Delay(2000)
    If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 1 Then
      Log.Error("Կոմունալ վճարումների հանձնարարագիրը առկա չէ 'Հաշվառված վճարային փաստաթղթեր' թղթապանակում:")
      Exit Sub
    Else  
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_Delete)
      Call ClickCmdButton(3, "²Ûá")
    End If
  End With 
  
  'Ջնջել արտահանված փաստաթուղթը (.dbf և .txt ֆայլերը)
  Call aqFileSystem.DeleteFile(ExportedFile)
  Call aqFileSystem.DeleteFile(ExportedFileToTxt)
  Call aqFileSystem.DeleteFile(ActualMessage)
  
  Call Close_AsBank()
End Sub