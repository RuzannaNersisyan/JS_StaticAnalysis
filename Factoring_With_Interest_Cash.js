Option Explicit

'USEUNIT Library_Common  
'USEUNIT Factoring_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Akreditiv_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Group_Operations_Library
'USEUNIT Subsystems_SQL_Library 
'USEUNIT Constants
'USEUNIT Library_Contracts

'Test Case Id 165851

Sub Factoring_With_Interest_Cash_Test()
  Dim attr, fDATE, sDATE, ParentAgr, FolderName, Agr, CashOutNum, CashOutISN, Exists,_
      PerAcc, calcDate, opDate, summa
  Dim CollectFromProvision_ISN, GiveFactoring_ISN, CalculatePercents_ISN, FadeDebt_ISN       
  Dim queryString, sqlValue, colNum, sql_isEqual
  
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
  
  Call Log.Message("Ֆակտորինգի գլխավոր պայմանագրի ստեղծում",,,attr)
  Set ParentAgr = New_FactoringDoc()
  With ParentAgr
    .LenderAcc = "00000113032"                                    
    .Amount = 1000000
    .Date = "220419" 
    .GiveDate = "220419"
    .Term = "220420"
    .DocLevel = 2
    .DocType = "ü³ÏïáñÇÝ·Ç ·ÉË³íáñ å³ÛÙ³Ý³·Çñ"
    .DocTypeNum = "Y"
    
    Call .CreateFactoring(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
    Log.Message("Ֆակտորինգի գլխավոր պայմանագրի համարը և ISN-ը`")
    Log.Message(.DocNum)
    Log.Message(.fBASE)
  End With  
  
      ''SQL ստուգում պայամանգիր ստեղցելուց հետո: 
          ''CONTRACTS
          queryString = "SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & ParentAgr.fBASE &_
                          "AND fDGAGRTYPE = 'C' AND fDGMODTYPE = 5 " &_
                          "AND fDGAGRKIND = 'Y' AND fDGSTATE = 1 " &_
                          "AND fDGSUMMA = 1000000.00 and fDGALLSUMMA = 0.00"
          sqlValue = 1
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
          End If  
                                
          ''FOLDERS
          queryString = "SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & ParentAgr.fBASE 
          sqlValue = 3
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
          End If   
  
  'Պայմանագրը ուղարկել հաստատման                               
  Call PaySys_Send_To_Verify()
    
  Call Log.Message("Ենթապայմանագրի բացում` Տոկոս.եկ.բերող ֆակտորինգ",,,attr)
  If Left(wMDIClient.VBObject("frmPttel").VBObject("TDBGView").Columns.Item(0).Text, 32) = "ü³ÏïáñÇÝ·Ç Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³Í" Then
    wMDIClient.VBObject("frmPttel").VBObject("TDBGView").MoveNext
  End If
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_OpenSubAgr)
  
  Set Agr = New_FactoringDoc()
  With Agr
    .PayerAcc = "^A[Del]" & "000115900"
    .LenderAcc = "00000113032"
    .Amount = 100000
    .Date = "220419" 
    .GiveDate = "220419"
    .Term = "220420"
    .DocLevel = 1
    .PaidAmount = 100000
    .DocType = "îáÏáë.»Ï.µ»ñáÕ ý³ÏïáñÇÝ·"
    .DocTypeNum = "2"
    
    Call .CreateFactoring(Null)
    
    Log.Message("Տոկոս.եկ.բերող ֆակտորինգի համարը  և ISN-ը`")
    Log.Message(.DocNum)
    Log.Message(.fBASE)
  
        ''SQL ստուգում ենթապայամանգիր ստեղցելուց հետո: 
          ''CONTRACTS
          queryString = "SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & .fBASE &_
                          "AND fDGAGRTYPE = 'C' AND fDGMODTYPE = 5 " &_
                          "AND fDGAGRKIND = '2' AND fDGSTATE = 1 " &_
                          "AND fDGSUMMA = 100000.00 and fDGALLSUMMA = 100000.00"
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
  
    'Վերցնել "Տոկոսային եկամուտների հաշիվ" ռեկվիզիտի արժեքը`
    If Not Left(wMDIClient.VBObject("frmPttel_2").VBObject("TDBGView").Columns.Item(0).Text, 32) = "ü³ÏïáñÇÝ·Ç Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³Í" Then
      wMDIClient.VBObject("frmPttel_2").VBObject("TDBGView").MoveNext
    End If
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_View)
  
    BuiltIn.Delay(2000)
    Set wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip").SelectedItem = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip").Tabs(2)
    PerAcc = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("AsTypeFolder_13").VBObject("TDBMask").Text
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmASDocForm").Close
    BuiltIn.Delay(1000)
    wMDIClient.VBObject("frmPttel_2").Close
    BuiltIn.Delay(1000)
    wMDIClient.VBObject("frmPttel").Close
  
    Call LetterOfCredit_Filter_Fill(FolderName, .DocLevel, .DocNum)
    
    Call Log.Message("Գանձում տրամադրումից",,,attr)
    Call Collect_From_Provision(.Date, summa, 2, .PayerAcc, Null)
    'Վերցնել Գանձում տրամադրումից փաստաթղթի ISN-ը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_OpersView)
    Call Rekvizit_Fill("Dialog", 1, "General", "START", "^A[Del]") 
    Call Rekvizit_Fill("Dialog", 1, "General", "END", "^A[Del]") 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  
    BuiltIn.Delay(2000)
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_View)
    CollectFromProvision_ISN = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmASDocForm").Close
    BuiltIn.Delay(1000)
    wMDIClient.VBObject("frmPttel_2").Close
    
        ''SQL ստուգում Գանձում տրամադրումից հետո: 
          ''CONTRACTS
            queryString = "SELECT fDGSTATE FROM CONTRACTS WHERE fDGISN = " & ParentAgr.fBASE
            sqlValue = 7
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If  
            
            ''CONTRACTS
            queryString = "SELECT fDGSTATE FROM CONTRACTS WHERE fDGISN = " & .fBASE 
            sqlValue = 7
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If

            ''FOLDERS
            queryString = "SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & ParentAgr.fBASE 
            sqlValue = 2
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If
            
            ''FOLDERS
            queryString = "SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & .fBASE 
            sqlValue = 2
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If
          
            ''HI
            queryString = "SELECT COUNT(*) FROM HI WHERE fBASE = " & CollectFromProvision_ISN &_
                           "AND fSUM = 100.00 AND fCURSUM = 100.00"  
            sqlValue = 2
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If
            
            ''HIF
            queryString = "SELECT COUNT(*) FROM HIF WHERE fBASE = " & ParentAgr.fBASE 
            sqlValue = 10
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If
            
            ''HIR
            queryString = "SELECT fCURSUM FROM HIR WHERE fOBJECT = " & .fBASE  
            sqlValue = 100.00
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If
            
            ''HIRREST
            queryString = "SELECT fLASTREM FROM HIRREST WHERE fOBJECT = " & .fBASE 
            sqlValue = 100.00
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If
                        
        
    Call Log.Message("ՄՄԺՊ ֆակտորինգի տրամադրում",,,attr)
    GiveFactoring_ISN = GiveFactoring(.Date, 1, CashOutNum)
    
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
  
    'Մուտք գործել "Հաճախորդի սպասարկում և դրամարկղ" 
    Call ChangeWorkspace(c_CustomerService)
    Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Ð³ßÇíÝ»ñ")
    Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", PerAcc)
    Call ClickCmdButton(2, "Î³ï³ñ»É") 
    BuiltIn.Delay(2000)
    'Փոխել սոտորին սահմանը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ChangeLowerBound)
    Call Rekvizit_Fill("Document", 1, "General", "CHGDATE", "220419")
    Call Rekvizit_Fill("Document", 1, "General", "LLIMIT", "-999999999")
    Call ClickCmdButton(1, "Î³ï³ñ»É") 
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
    
    Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    Call Rekvizit_Fill("Dialog", 1, "General", "PERN", .Date) 
    Call Rekvizit_Fill("Dialog", 1, "General", "PERK", .Date) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    Exists = Find_Data(CashOutNum, 2)
    If Not Exists then
       Call Log.Error("Կանխիկ ելք փաստաթուղթը չի գտնվել") 
       Exit Sub
    End If
   
    '"Կանխիկ ելք" փաստաթուղթը ուղարկել հաստատման:
    Call ContractAction(c_SendToVer)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
   
    'Մուտք գործել "Հաստատող 1 ԱՇՏ/Հաստատվող վճարային փաստաթղթեր " թղթապանակ - "Կանխիկ ելք " փաստաթուղթը պետք է առկա լինի : 
    Call ChangeWorkspace(c_Verifier1)
    
    Dim VerificationDoc
    Set VerificationDoc = New_VerificationDocument()
        VerificationDoc.User = "77"
        
    Call GoToVerificationDocument("|Ð³ëï³ïáÕ I ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ",VerificationDoc)
    Builtin.Delay(2000)
  
    Exists = Find_Data (CashOutNum, 3)
    If Not Exists then
      Call Log.Error("Փաստաթուղթը չի գտնվել Հաստատվող վճարային փաստաթղթեր թղթապանակում:") 
      Exit Sub
    End If
    
    'Վերցնել պայմանագրի ISN - ը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_View)
    CashOutISN = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmASDocForm").Close
    
    'Վավերացնել փաստաթուղթը 
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToConfirm)
    Call ClickCmdButton(1, "Ð³ëï³ï»É")

    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close

    Call ChangeWorkspace(c_Factoring)
    Call LetterOfCredit_Filter_Fill(FolderName, .DocLevel, .DocNum)
    
          ''SQL ստուգում ֆակտորինգի տրամադրումից հետո: 
            ''HI
            queryString = "SELECT COUNT(*) FROM HI WHERE fBASE = " & GiveFactoring_ISN &_
                           "AND ((fSUM = 100.00 AND fCURSUM = 100.00 AND fTYPE = '01')" 	&_		
													 "OR (fSUM = 100000.00 AND fCURSUM = 100000.00 AND fTYPE = '02'))"  
            sqlValue = 5
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If  
            
            ''HI2
            queryString = "SELECT COUNT(*) FROM HI2 WHERE fBASE = " & GiveFactoring_ISN &_
                           "AND fSUM = 100000.00 AND fCURSUM = 100000.00"  
            sqlValue = 1
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If 
            
            ''HIF
            queryString = "SELECT COUNT(*) FROM HIF WHERE fBASE = " & GiveFactoring_ISN &_
                           "AND fSUM = 0.00 AND fCURSUM = 0.00"  
            sqlValue = 1
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If 
            
            ''HIR
            queryString = "SELECT COUNT(*) FROM HIR WHERE fBASE = " & GiveFactoring_ISN &_
                           "AND ((fCURSUM = 100000.00 AND fOP = 'AGR')" &_
													 "OR (fCURSUM = 100.00 AND fOP = 'PAY'))"  
            sqlValue = 2
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If
            
            ''HIREST2
            queryString = "SELECT COUNT(*) FROM HIREST2 WHERE fOBJECT = " & ParentAgr.fBASE &_
                           "AND ((fREM = 0.00 AND fCURREM = 0.00)" &_
													 "OR (fREM = 100000.00 AND fCURREM = 100000.00))"  
            sqlValue = 2
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If 
            
            ''HIRREST
            queryString = "SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " & .fBASE &_
                           "AND (fLASTREM = 100000.00 OR fLASTREM = 100.00" &_
                           "OR fLASTREM = -100.00) AND fPENULTREM = 0.00 AND fSTARTREM = 0.00"  
            sqlValue = 3
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If 
    
    Call Log.Message("Տոկոսների հաշվարկ",,,attr)
    calcDate = "210519"
    CalculatePercents_ISN = Calculate_Percents(calcDate, calcDate, False)

          ''SQL ստուգում Տոկոսների հաշվարկց հետո: 
            ''HI
            queryString = "SELECT COUNT(*) FROM HI WHERE fBASE = " & CalculatePercents_ISN &_
                           "AND ((fSUM = 986.30 AND fCURSUM = 986.30)" 	&_		
													 "OR (fSUM = 993.90 AND fCURSUM = 993.90))"  
            sqlValue = 4
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If  
        
            ''HIF
            queryString = "SELECT COUNT(*) FROM HIF WHERE fBASE = " & CalculatePercents_ISN &_
                           "AND fSUM = 0.00 AND fCURSUM = 0.00"  
            sqlValue = 1
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If  
            
            ''HIR
            queryString = "SELECT COUNT(*) FROM HIR WHERE fBASE = " & CalculatePercents_ISN &_
                           "AND (fCURSUM = 986.30 OR fCURSUM = 7.60)"  
            sqlValue = 3
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If  
            
            ''HIRREST
            queryString = "SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " & .fBASE
            sqlValue = 5
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If  
            
            ''HIT
            queryString = "SELECT COUNT(*) FROM HIT WHERE fBASE = " & CalculatePercents_ISN &_
                           "AND (fCURSUM = 986.30 OR fCURSUM = 7.60)"
            sqlValue = 2
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If
                        
    Call Log.Message("Պարտքերի մարում",,,attr)
    opDate = "220519"
    Call Fade_Debt(opDate, FadeDebt_ISN, "220420", "", "", False)

          ''SQL ստուգում Պարտքերի մարումից հետո: 
            ''HI
            BuiltIn.Delay(1000)
            queryString = "SELECT COUNT(*) FROM HI WHERE fBASE = " & FadeDebt_ISN 
            sqlValue = 7
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If  
        
            ''HI2
            queryString = "SELECT COUNT(*) FROM HI2 WHERE fBASE = " & FadeDebt_ISN &_
                           "AND fSUM = 100000.00 AND fCURSUM = 100000.00"
            sqlValue = 1
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If 
            
            ''HIR
            queryString = "SELECT COUNT(*) FROM HIR WHERE fBASE = " & FadeDebt_ISN &_
                           "AND (fCURSUM = 100000.00 OR fCURSUM = 986.30 OR fCURSUM = 92.40)"
            sqlValue = 4
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If 
            
            ''HIRREST
            queryString = "SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " & .fBASE &_
                           "AND (fLASTREM = 0.00 OR fLASTREM = 100.00)"
            sqlValue = 5
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If
            
            ''HIRREST
            queryString = "SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " & .fBASE &_
                           "AND (fLASTREM = 0.00 OR fLASTREM = 100.00)"
            sqlValue = 5
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If
            
            ''HIREST2
            queryString = "SELECT COUNT(*) FROM HIREST2 WHERE fOBJECT = " & ParentAgr.fBASE &_
                           "AND fREM = 0.00 AND fCURREM = 0.00"
            sqlValue = 2
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If
            
    Call Log.Message("Բոլոր փաստաթղթերի ջնջում",,,attr)
    'Ջնջում "Գործողությունների դիտումից"
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
    Call GroupDelete(FolderName, 1, .DocNum, "^A[Del]", "^A[Del]", "^A[Del]")
    
    'Ջնջել "Կանխիկ ելք"-ը
    Call ChangeWorkspace(c_CustomerService)
    Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    
    Call Rekvizit_Fill("Dialog", 1, "General", "PERN", .Date) 
    Call Rekvizit_Fill("Dialog", 1, "General", "PERK", .Date) 
    Call Rekvizit_Fill("Dialog", 1, "General", "DOCISN", CashOutISN)
    Call ClickCmdButton(2, "Î³ï³ñ»É")

    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete)
    Call ClickCmdButton(3, "²Ûá")
    Call ClickCmdButton(5, "²Ûá")
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
    
    Call ChangeWorkspace(c_Factoring)
    Call LetterOfCredit_Filter_Fill(FolderName, 1, .DocNum)
    
    'Ջնջել "Գանձում տրամադրումից" գործողությունը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_OpersView)
    Call Rekvizit_Fill("Dialog", 1, "General", "START", "^A[Del]") 
    Call Rekvizit_Fill("Dialog", 1, "General", "END", "^A[Del]")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete)
    Call ClickCmdButton(3, "²Ûá")
    
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmPttel_2").Close
    
    'Պայմանագրի սեփ.թղթապանակից ջնջել "Գումարի տրամադրում" գործողությունը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrOwnFolder)
    wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").MoveNext
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete)
    Call ClickCmdButton(3, "²Ûá")
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmPttel_2").Close
    
    'Ջնջել Մայր պայմանագիրը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_ParentAgr)
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete)
    Call ClickCmdButton(3, "²Ûá")
    
    Call Close_AsBank() 
  End With
End Sub