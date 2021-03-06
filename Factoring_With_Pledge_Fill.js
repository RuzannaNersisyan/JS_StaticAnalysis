Option Explicit

'USEUNIT Library_Common  
'USEUNIT Factoring_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Akreditiv_Library
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Group_Operations_Library
'USEUNIT Subsystems_SQL_Library 
'USEUNIT Constants

'Test Case Id 165857

Sub Factoring_With_Pledge_Fill_Test()
  Dim attr, fDATE, sDATE, FolderName, queryString, sqlValue, colNum, sql_isEqual
  Dim Agr, PlCode, PlCur, PlValue, PlCount, PlDocNum, Name, NameLen, Pttel, Exists
  Dim wTabStrip
'--------------------------------------
  Set attr = Log.CreateNewAttributes
  attr.BackColor = RGB(0, 255, 255)
  attr.Bold = True
  attr.Italic = True
'--------------------------------------  

  'Համակարգ մուտք գործել ARMSOFT օգտագործողով
  fDATE = "20260101"
  sDATE = "20140101"
  Call Initialize_AsBank("bank", sDATE, fDATE)
  Login("ARMSOFT")
  Call Create_Connection()
  
  Call ChangeWorkspace(c_Factoring)
  FolderName = "|ØØÄä ü³ÏïáñÇÝ·|"
  
  Call Log.Message("Ֆակտորինգի պայմանագրի ստեղծում",,,attr)
  Set Agr = New_FactoringDoc()
  With Agr
    .PayerAcc = "03485010100"
    .LenderAcc = "00000113032"
    .Amount = 100000
    .Date = "220419" 
    .GiveDate = "220419"
    .Term = "220420"
    .DocLevel = 1
    .PaidAmount = 100000
    .PaperCode = 333
    .DocType = "ü³ÏïáñÇÝ·"
    .DocTypeNum = "5"
    
    Call .CreateFactoring(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
    
    PlCode = "00001"
    PlCur = "000"
    PlValue = "100000"
    PlCount = 5
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToEdit) 
    Call Rekvizit_Fill("Document", 9, "General", "CODESTND", PlCode) 
    Call Rekvizit_Fill("Document", 9, "General", "MORTCURR", PlCur) 
    Call Rekvizit_Fill("Document", 9, "General", "MSUMMA", PlValue) 
    Call Rekvizit_Fill("Document", 9, "General", "MCOUNT", PlCount) 
    Call ClickCmdButton(1, "Î³ï³ñ»É")

    Log.Message("Ֆակտորինգի պայմանագրի համարը  և ISN-ը`")
    Log.Message(.DocNum)
    Log.Message(.fBASE)
    
    
      ''SQL ստուգում պայամանգիր ստեղցելուց հետո: 
          ''CONTRACTS
          queryString = "SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & .fBASE &_
                          "AND fDGAGRTYPE = 'C' AND fDGMODTYPE = 5 " &_
                          "AND fDGAGRKIND = '5' AND fDGSTATE = 1 " &_
                          "AND fDGSUMMA = 100000.00 AND fDGALLSUMMA = 100000.00"
          sqlValue = 1
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
          End If  
                                
          ''FOLDERS
          queryString = "SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & .fBASE 
          sqlValue = 3
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
          End If   
          
    'Պայմանագրը ուղարկել հաստատման                               
    Call PaySys_Send_To_Verify()
    
    BuiltIn.Delay(3000)
    
    'Ստուգել Գրավի պայմանագրի առկայությունը
    Name = "¶ñ³íÇ å³ÛÙ³Ý³·Çñ"
    NameLen = 16
    ColNum = 0
    Exists = Find_Doc_By(Name, NameLen, ColNum, Pttel)
    If Not Exists then
       Call Log.Error("Գրավի պայմանագիրը առկա չէ:") 
       Exit Sub
    End If
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_View) 
    PlDocNum = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TextC").Text
    wMDIClient.VBObject("frmASDocForm").Close
    wMDIClient.VBObject("frmPttel").Close
    
    Call ChangeWorkspace(c_CollateralAgr)
    wTreeView.DblClickItem("|²å³Ñáíí³ÍáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñ|ä³ÛÙ³Ý³·ñ»ñ|êï³óí³Í ·ñ³í|ä³ÛÙ³Ý³·ñ»ñ")
    Call Rekvizit_Fill("Dialog", 1, "General", "AGRNUM", PlDocNum) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")

    If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 1 Then
      Log.Error("Գրավի պայմանագիրը առկա չէ:")
    End If
      
    Call Log.Message("Բոլոր փաստաթղթերի ջնջում",,,attr)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_OpersView)
    Call Rekvizit_Fill("Dialog", 1, "General", "START", "^A[Del]") 
    Call Rekvizit_Fill("Dialog", 1, "General", "END", "^A[Del]") 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.Delay(2000)
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete) 
    Call ClickCmdButton(3, "²Ûá")
    wMDIClient.VBObject("frmPttel_2").Close
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete) 
    Call ClickCmdButton(3, "²Ûá")
    wMDIClient.VBObject("frmPttel").Close
    
    Call ChangeWorkspace(c_Factoring)
    
    Call LetterOfCredit_Filter_Fill(FolderName, .DocLevel, .DocNum)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete) 
    Call ClickCmdButton(3, "²Ûá")
  End With
  
  Call Close_AsBank()
End Sub
