Option Explicit
'USEUNIT Library_Common  
'USEUNIT Subsystems_SQL_Library 
'USEUNIT Constants
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Akreditiv_Library
'USEUNIT Group_Operations_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Library_CheckDB
'USEUNIT Mortgage_Library

'Test case ID 165841

Sub Overdraft_With_Schedule_Actions_Test()
  Dim RepaySchedule_ISN, GiveOverdradt_ISN, CalcDoc_ISN, RepayDoc_ISN, AccruingAdjustment_ISN, OverdraftRiskIndex_ISN, Provision_ISN,_
      WriteOff_ISN, WriteOffReconstruction_ISN, NeglectingOfDebts_ISN
  Dim fDATE, sDATE, my_vbObj, sDOCNUM, FolderName, name, name_len, ColNum, Pttel, IfExists, CashOrNo, Date, opDate, PerSum, NonPastPer,_
      NonUsedPer, NonPastNonUsedSum, BankRatePer, PastSum, PastPer, PastPerSum, RiskIndex, Percent, ExpectedValue, CalcAcc, Sum
  Dim queryString, sql_Value, sql_isEqual, attr, dbFOLDERS(2)
  Dim Overdraft
  
  ''1, Համակարգ մուտք գործել ARMSOFT օգտագործողով
  fDATE = "20260101"
  sDATE = "20140101"
  Call Initialize_AsBank("bank", sDATE, fDATE)
  Login("ARMSOFT")
  Call Create_Connection()

'--------------------------------------
  Set attr = Log.CreateNewAttributes
  attr.BackColor = RGB(0, 255, 255)
  attr.Bold = True
  attr.Italic = True
'-------------------------------------- 
  
  ''2, Անցում կատարել "Օվերդրաֆտ (տեղաբաշխված)" ԱՇՏ
  Call ChangeWorkspace(c_Overdraft)

'-------------------------------------------------------------------------------------
''Ջնջել բոլոր փաստաթղթերը:
  CalcAcc = "00001850100"
  'Մուտք գործել "Օվերդրաֆտ ունեցող հաշիվներ" թղթապանակ
  FolderName = "|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
  Call wTreeView.DblClickItem(FolderName & "úí»ñ¹ñ³ýï áõÝ»óáÕ Ñ³ßÇíÝ»ñ")
  BuiltIn.Delay(2000)
  Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", CalcAcc)
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  BuiltIn.Delay(2000)
    
  If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 1 Then
    Call wMainForm.MainMenu.Click(c_Opers & "|" & c_View)
    sDOCNUM = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TextC").Text
    Call Close_Pttel("frmASDocForm")
    Call Close_Pttel("frmPttel")
    
    Call GroupDelete(FolderName, 1, sDOCNUM, "^A[Del]", "^A[Del]", "^A[Del]")
    
    Call LetterOfCredit_Filter_Fill(FolderName, 1, sDOCNUM)
    
    'Ջնջել "Ռիսկի դասիչ և պահուստավորման տոկոս" - ը 
    Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Risking & "|" & c_RisksPersRes)
        
    'Ջնջել Օվերդրաֆտ պայմանագիրը
    Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
    BuiltIn.Delay(2000)
    Call ClickCmdButton(3, "²Ûá")

  End If  
  Call Close_Pttel("frmPttel")
'-------------------------------------------------------------------------------------
  Call Log.Message("Գրաֆիկով Օվերդրաֆտ պայմանագրի ստեղծում",,,attr)
  Set Overdraft = New_Overdraft()
  With Overdraft
    .DocType = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ" 
    .CalcAcc = "00001850100"                                    
    .Limit = 100000
    .Date = "200418" 
    .GiveDate = "200418"
    .Term = "200419"
    .Percent = 18
    .NonUsedPercent = 0
    .PayDates = 5
    .PaperCode = 123
    Call .CreatePlOverdraft(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
  
  
        ''SQL ստուգում պայամանգիր ստեղցելուց հետո: 
        ''CONTRACTS
        queryString = "select count(*) from CONTRACTS where fDGISN = " & .fBASE &_
                        "and fDGAGRTYPE = 'C' and fDGMODTYPE = 3 and fDGAGRKIND = '8L'" &_
                        "and fDGSTATE = 206 and fDGSUMMA = 100000.00 and fDGALLSUMMA = 0.00"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If  
                                
        ''FOLDERS
        queryString = "select count(*) from FOLDERS where fISN = " & .fBASE 
        sql_Value = 3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If                          
                                     
    ''4.Մարման գրաֆիկի նշանակում
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_RepaySchedule)  
    
    name = "Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ"
    name_len = 17
    ColNum = 0
    Pttel = ""
    IfExists = Find_Doc_By(name, name_len,ColNum, Pttel)
    If IfExists Then 
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_View)
      BuiltIn.Delay(2000)
      RepaySchedule_ISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
      Call Close_Pttel("frmASDocForm")
    End If
  
    ''SQL ստուգում Մարման գրաֆիկ ստեղցելուց հետո: 
        ''AGRSCHEDULE
        queryString = "select count(*) from AGRSCHEDULE where fBASE = " & RepaySchedule_ISN &_
                        "and fKIND = 9 and fTYPE = 0 and fINC = 1"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If  
    
        ''CONTRACTS
        queryString = "select count(*) from CONTRACTS where fDGISN = " & .fBASE &_
                        "and fDGAGRTYPE = 'C' and fDGMODTYPE = 3 and fDGAGRKIND = '8L'" &_
                        "and fDGSTATE = 1 and fDGSUMMA = 100000.00 and fDGALLSUMMA = 0.00"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If    
       
        ''FOLDERS
        queryString = "select count(*) from FOLDERS where fISN= '" & RepaySchedule_ISN & "'"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

 
    ''5.Այլ վճարումների գրաֆիկի նշանակում
    name = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
    name_len = 30
    ColNum = 0
    Pttel = ""
    IfExists = Find_Doc_By(name, name_len,ColNum, Pttel)
    If Not IfExists then
     Call Log.Error("Փաստաթուղթը չի գտնվել") 
     Exit Sub
    End If
     
    Call ContractAction (c_OtherPaySchedule)
  
    With wMDIClient.VBObject("frmASDocForm")
      'Լրացնե "Ամսաթիվ" դաշտը
      .VBObject("TabFrame").VBObject("TDBDate").Keys(Overdraft.GiveDate & "[Tab]")
      'Լրացնե "Մարումների գրաֆիկ"  աղյուսակի "Ամսաթիվ" դաշտը
      Date = "260718"
      With .vbObject("TabFrame").vbObject("DocGrid")
        .Col = 0
        .Row = 0
        .Keys(Date & "[Tab]")
        'Լրացնե "Մարումների գրաֆիկ"  աղյուսակի "Գումար" դաշտը
        Sum = 1000
        .Col = 2
        .Row = 0
        .Keys(Sum & "[Tab]")
      End With
      .VBObject("CmdOk_2").ClickButton
    End With
                 
    ''6.Գրաֆիկով օվերդրաֆտի պայմանագիրը ուղարկել հաստատման:
    name = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
    name_len = 30
    ColNum = 0
    Pttel = ""
    IfExists = Find_Doc_By(name, name_len,ColNum, Pttel)
    If Not IfExists then
       Call Log.Error("Գրաֆիկով օվերդրաֆտի պայմանագիրը փաստաթուղթը չի գտնվել") 
       Exit Sub
     End If
    Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendToVer)
    Call ClickCmdButton(5, "²Ûá") 
    Builtin.Delay(5000) 
    Call Close_Pttel("frmPttel")
  
    ''7.Մուտք գործել "Հաստատվող փաստաթղթեր 1" թղթապանակ 
    Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", .DocNum) 
    Call ClickCmdButton(2, "Î³ï³ñ»É") 
    Builtin.Delay(5000)
    Set my_vbObj = wMDIClient.VBObject("frmPttel").VBObject("tdbgView")
    If my_vbObj.ApproxCount <> 1 Then
      Call Log.Error("Պայմանագիրը առկա չէ Հաստատվող փաստաթղթեր 1 թղթապանակում:")
      Exit Sub
    End If
  
    ''8.Վավերացնել պայմանագիրը
     Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToConfirm)
    BuiltIn.Delay(2000)
    Call ClickCmdButton(1, "Ð³ëï³ï»É")
     Builtin.Delay(2000)
    Call Close_Pttel("frmPttel")

    ''9.Մուտք գործել "Պայմանագրեր" թղթապանակ - Փաստաթուղթը պետք է առկա լինի:
    IfExists = LetterOfCredit_Filter_Fill(FolderName, .DocLevel, .DocNum)
    If (Not IfExists) Then
      Call Log.Error("Պայմանագիրը առկա չէ")
      Exit Sub
    End If

    Call Log.Message("Օվերդրաֆտի տրամադրում",,,attr)
    CashOrNo = "2"
    GiveOverdradt_ISN = Give_Overdradt(.GiveDate, .Limit, CashOrNo, Null, .CalcAcc, "")

    BuiltIn.Delay(2000)
    Call Close_Pttel("frmPttel")
  
        ''SQL ստուգում Օվերդրաֆտ տրամադրելուց հետո:   
        BuiltIn.Delay(delay_small) 
        ''CONTRACTS
        queryString = "select count(*) from CONTRACTS where fDGISN =" & .fBASE &_
                        "and fDGAGRTYPE = 'C' and fDGMODTYPE = 3 and fDGAGRKIND = '8L'" &_
                        "and fDGSTATE = 7 and fDGSUMMA = 100000.00 and fDGALLSUMMA = 0.00"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
           
        ''FOLDERS
        queryString = "select count(*) from FOLDERS where fISN = " & .fBASE 
        sql_Value = 5
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        Set dbFOLDERS(1) = New_DB_FOLDERS()
            dbFOLDERS(1).fFOLDERID = "LOANREGISTER"
            dbFOLDERS(1).fNAME = "C3Univer"
            dbFOLDERS(1).fKEY = .fBASE 
            dbFOLDERS(1).fISN = .fBASE 
            dbFOLDERS(1).fSTATUS = 1
            dbFOLDERS(1).fCOM = "ä»ïñáëÛ³Ý ä»ïñáë"
            dbFOLDERS(1).fSPEC = "C38"& Trim(.DocNum) &"          123                               0                                                                                                                                                             0.00                                                                                                                                                                                                                                                                                               "

        Set dbFOLDERS(2) = New_DB_FOLDERS()
            dbFOLDERS(2).fFOLDERID = "LOANREGISTER2"
            dbFOLDERS(2).fNAME = "C3Univer"
            dbFOLDERS(2).fKEY = .fBASE 
            dbFOLDERS(2).fISN = .fBASE 
            dbFOLDERS(2).fSTATUS = "1"
            dbFOLDERS(2).fCOM = "ä»ïñáëÛ³Ý ä»ïñáë"
            dbFOLDERS(2).fSPEC = "0"
        
        Call CheckDB_FOLDERS(dbFOLDERS(1), 1)
        Call CheckDB_FOLDERS(dbFOLDERS(2), 1)
        
        ''HI
        queryString = "select count(*) from HI where fBASE = " & GiveOverdradt_ISN &_
                          "and fSUM = 100000.00 and fCURSUM = 100000.00"
        sql_Value = 3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        ''HI
        queryString = "select count(*) from HI where fBASE = " & .fBASE
        sql_Value = 2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        ''HIF
        queryString = "select count(*) from HIF where fBASE = " & .fBASE
        sql_Value = 19
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

    Call Log.Message("Օվերդրաֆտի տոկոսների հաշվարկ",,,attr)
    opDate = "060518"
    CalcDoc_ISN = Overdraft_Percent_Accounting(.DocNum, opDate)
  
      ''SQL ստուգում Օվերդրաֆտի տոկոսների հաշվարկից հետո:      
        ''AGRSCHEDULEVALUES
        queryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN = " & .fBASE
        sql_Value = 28
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        ''HIF
        queryString = "select count(*) from HIF where fBASE = " & CalcDoc_ISN &_
                       "and fSUM = 0.00 and fCURSUM = 0.00"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        ''HIR
        queryString = "select count(*) from HIR where fBASE = " & CalcDoc_ISN &_
                       "and (fCURSUM = 838.40 or fCURSUM = 7692.30)"
        sql_Value = 3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        BuiltIn.Delay(delay_small) 
      
        ''HIRREST
        queryString = "select count(*) from HIRREST where fOBJECT = " & .fBASE &_
                       "and (fLASTREM = 100000.00 or fLASTREM = 838.40 or fLASTREM = 7692.30) and fSTARTREM = 0.00 and fPENULTREM = 0.00"
        sql_Value = 4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        ''HIT
        queryString = "select count(*) from HIT where fOBJECT = " & .fBASE &_ 
                       "and fCURSUM = 838.40"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If  
  
    Call Log.Message("Օվերդրաֆտի պարտքերի մարում",,,attr)
    Call Close_Pttel("frmPttel")
    opDate = "070518"
    Sum = ""
    RepayDoc_ISN = Overdraft_Repayment_Operation(.DocNum,opDate,Sum, "", "")

    Call Close_Pttel("frmPttel")
 
      ''SQL ստուգում Օվերդրաֆտի պարտքերի մարումից հետո:
        BuiltIn.Delay(delay_small)
      
        ''AGRSCHEDULEVALUES
        queryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN = " & .fBASE 
        sql_Value = 52
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        ''HIR
        queryString = "select count(*) from HIR where fBASE= " & RepayDoc_ISN &_
                       "and (fCURSUM = 7692.30 or fCURSUM = 838.40)"
        sql_Value = 4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        ''HIRREST
        queryString = "select count(*) from HIRREST where fOBJECT = " & .fBASE &_
                       "and (fLASTREM = 92307.70 or fLASTREM = 0.00) and (fPENULTREM = 100000.00 or fPENULTREM = 838.40 or fPENULTREM = 0.00) and fSTARTREM = 0.00"
        sql_Value = 4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
    Call Log.Message("Օվերդրաֆտի տոկոսների հաշվարկ",,,attr)
    opDate = "070518"
    CalcDoc_ISN = Overdraft_Percent_Accounting(.DocNum, opDate)
  
      ''SQL ստուգում Օվերդրաֆտի տոկոսների հաշվարկից հետո:      
        ''HI
        queryString = "select count(*) from HI where fBASE= " & CalcDoc_ISN &_
                       "and fSUM = 45.50 and fCURSUM = 45.50"
        sql_Value = 4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        ''HIF
        queryString = "select count(*) from HIF where fBASE = " & CalcDoc_ISN &_
                       "and fSUM = 0.00 and fCURSUM = 0.00"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        ''HIR
        queryString = "select count(*) from HIR where fBASE = " & CalcDoc_ISN &_
                       "and fCURSUM = 45.50"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If  
     
    Call Log.Message("Հաշվարկների ճշգրտում փաստաթղթի լրացում",,,attr)
    Date = "080518"
    PerSum = "1000"
    NonPastPer = "5"
    NonUsedPer = "100"
    NonPastNonUsedSum = "5"
    BankRatePer = "50"
    PastSum = "100"  
    PastPer = "100"
    PastPerSum = "200"
    AccruingAdjustment_ISN =  Accruing_Adjustment(Date, PerSum, NonPastPer, NonUsedPer, NonPastNonUsedSum, BankRatePer, PastSum, PastPer, PastPerSum)   
  
    Call Close_Pttel("frmPttel")
  
        ''SQL ստուգում Հաշվարկների ճշգրտումից հետո
        ''AGRSCHEDULEVALUES
        queryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN = " & .fBASE 
        sql_Value = 78
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        ''HI
        queryString = "select count(*) from HI where fBASE= " & AccruingAdjustment_ISN &_
                       "and ((fSUM = 1000.00 and fCURSUM = 1000.00) or " &_ 
                       "(fSUM = 100.00 and fCURSUM = 100.00) or (fSUM = 200.00 and fCURSUM = 200.00) " &_
                       "or (fSUM = 250.00 and fCURSUM = 250.00))"
        sql_Value = 10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        ''HIR
        queryString = "select count(*) from HIR where fBASE = " & AccruingAdjustment_ISN 
        sql_Value = 8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
           
        ''HIRREST
        queryString = "select count(*) from HIRREST where fOBJECT = " & .fBASE                   
        sql_Value = 10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If   
      
        ''HIT
         queryString = "select count(*) from HIT where fOBJECT = " & .fBASE &_ 
                       "and (fCURSUM = 838.40 or fCURSUM = 45.50 or fCURSUM = 5.00)"
        sql_Value = 4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

  
    Call Log.Message("Պայմանագրերի ամփոփում(Քեշավորված)-ում ստուգել սյուների արժեքները",,,attr)
    Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ (ø»ß³íáñí³Í)")
    BuiltIn.Delay(2000)
    Call Rekvizit_Fill("Dialog", 1, "General", "RDATE", Date)
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", .DocNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
  
    ''15.Ստուգել  "Տոկոս", "Ոչ ժամկետանց տոկոս ", "Ոչ ժամկետանց չօգտ. մասի տոկոս","ԲՏՀԴ տոկոսագումար", "Ժամկետանց գումարի տույժ","Ժամկետանց տոկոսի տույժ" , "Ժամկետանց գումարի տոկոս(վնաս)" 
    'Ստուգել "Տոկոս" դաշտի արժեքը
    name = "1,045.50"
    ColNum = 9
    IfExists = Find_Data(name, ColNum)
    If Not IfExists Then
      Call Log.Error("Տոկոս դաշտի սխալ արժեք:")
    End If
    'Ստուգել "Ոչ ժամկետնանց տոկոս" դաշտի արժեքը
  
    'Ստուգել "Չօգտ. մասի տոկոս" դաշտի արժեքը
    name = "100.00"
    ColNum = 10
    IfExists = Find_Data(name, ColNum)
    If Not IfExists Then
      Call Log.Error("Չօգտ. մասի տոկոս դաշտի սխալ արժեք:")
    End If
  
    'Ստուգել "Ոչ ժամկետնանց չօգտ. մասի տոկոս" դաշտի արժեքը
  
    'Ստուգել "ԲՏՀԴ տոկոսագումար" դաշտի արժեքը
    name = "50.00"
    ColNum = 16
    IfExists = Find_Data(name, ColNum)
    If Not IfExists Then
      Call Log.Error("ԲՏՀԴ տոկոսագումար դաշտի սխալ արժեք:")
    End If
  
    'Ստուգել "Ժամկետնանց գումարի տույժ" դաշտի արժեքը
    name = "100.00"
    ColNum = 18
    IfExists = Find_Data(name, ColNum)
    If Not IfExists Then
      Call Log.Error("Ժամկետնանց գումարի տույժ դաշտի սխալ արժեք:")
    End If
  
    'Ստուգել "Ժամկետնանց տոկոսի տույժ" դաշտի արժեքը
    name = "100.00"
    ColNum = 19
    IfExists = Find_Data(name, ColNum)
    If Not IfExists Then
      Call Log.Error("ԲՏՀԴ տոկոսագումար դաշտի սխալ արժեք:")
    End If
  
    'Ստուգել "Ժամկետնանց գումարի տոկոս(վնաս)" դաշտի արժեքը
    name = "200.00"
    ColNum = 24
    IfExists = Find_Data(name, ColNum)
    If Not IfExists Then
      Call Log.Error("ԲՏՀԴ տոկոսագումար դաշտի սխալ արժեք:")
    End If
    Call Close_Pttel("frmPttel")

    ''16.Մուտք գործել "Պայմանագրեր" թղթապանակ - Փաստաթուղթը պետք է առկա լինի:.
    Call Log.Message("Ռիսկի դաշիչ և պահուստավորման տոկոս փաստաթղթի լրացում",,,attr)
    opDate = "090518"
    RiskIndex = "02"
    Percent = 12
    OverdraftRiskIndex_ISN = Overdraft_Risk_Index(.DocNum, RiskIndex, Percent, opDate)

    Call Log.Message("Պահուստավորում փաստաթղթի լրացում",,,attr)
    opDate = "090518" 
    Provision_ISN = Provision(opDate, "", "")
  
    Call Close_Pttel("frmPttel")
  
    Call Log.Message("Պայմանագրերի ամփոփում(Քեշավորված)-ում ստուգել սյուների արժեքները",,,attr)
    Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ (ø»ß³íáñí³Í)")
    Call Rekvizit_Fill("Dialog", 1, "General", "RDATE", opDate)
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", .DocNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")

    ''20.Ստուգել "Պահուստավորման գումար" սյան արժեքը :
    ExpectedValue = "11,268.40"
    ColNum = 35
    IfExists = Find_Data(ExpectedValue, ColNum)
    If Not IfExists Then
      Call Log.Error("Պահուստավորման գումար սյան սխալ արժեք:")
    End If
  
    Call Close_Pttel("frmPttel")
 
    Call Log.Message("Օվերդրաֆտի տոկոսների հաշվարկ",,,attr) 
    opDate = "090518"
    CalcDoc_ISN = Overdraft_Percent_Accounting(.DocNum, opDate)
  
      ''SQL ստուգում Օվերդրաֆտի տոկոսների հաշվարկից հետո:      
        ''HI
        queryString = "select count(*) from HI where fBASE= " & CalcDoc_ISN &_
                         "and fSUM = 91.00  and fCURSUM = 91.00"
        sql_Value = 4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        ''HIF
        queryString = "select count(*) from HIF where fBASE = " & CalcDoc_ISN &_
                         "and fSUM = 0.00 and fCURSUM = 0.00"
        sql_Value = 3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        ''HIR
        queryString = "select count(*) from HIR where fBASE = " & CalcDoc_ISN &_
                          "and fCURSUM = 91.00"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        ''HIT
        queryString = "select count(*) from HIT where fOBJECT = " & .fBASE &_ 
                       "and fCURSUM = 91.00"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If  
      
    Call Log.Message("Դուրս գրում փաստաթղթի լրացում",,,attr)
    opDate = "100518"
    Sum = 1000
    PerSum = ""
    WriteOff_ISN = WriteOff(opDate, Sum, PerSum)
  
        ''SQL ստուգում Դուրս գրում փաստաթղթի ստեղծումից հետո
        ''HI
        queryString = "select count(*) from HI where fBASE= " & WriteOff_ISN &_
                         "and fSUM = 1000.0 and fCURSUM = 1000.0"
        sql_Value = 3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        ''HIR
        queryString = "select count(*) from HIR where fBASE = " & WriteOff_ISN &_
                       "and fCURSUM = 1000.0"
        sql_Value = 2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        ''HIRREST
        queryString = "select count(*) from HIRREST where fOBJECT = " & .fBASE                   
        sql_Value = 12
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
  
    Call Close_Pttel("frmPttel")
 
    Call Log.Message("Օվերդրաֆտի տոկոսների հաշվարկ",,,attr)
    opDate = "100518"
    CalcDoc_ISN = Overdraft_Percent_Accounting(.DocNum, opDate)
  
        ''SQL ստուգում Օվերդրաֆտի տոկոսների հաշվարկից հետո:      
        ''HI
        queryString = "select count(*) from HI where fBASE= " & CalcDoc_ISN &_
                       "and fSUM = 45.50  and fCURSUM = 45.50"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        ''HIF
        queryString = "select count(*) from HIF where fBASE = " & CalcDoc_ISN &_
                       "and fSUM = 0.00 and fCURSUM = 0.00"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        ''HIR
        queryString = "select count(*) from HIR where fBASE = " & CalcDoc_ISN &_
                       "and fCURSUM = 45.50"
        sql_Value = 2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        ''HIT
        queryString = "select count(*) from HIT where fOBJECT = " & .fBASE &_ 
                       "and (fCURSUM = 838.40 or fCURSUM = 45.50 or fCURSUM = 5.00 or fCURSUM = 91.00)"
        sql_Value = 7
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If  
  
    Call Log.Message("Դուրս գրվածի վերականգնում փաստաթղթի լրացում",,,attr)
    opDate = "110518"
    Sum = 500
    PerSum = ""
    WriteOffReconstruction_ISN = WriteOffReconstruction(opDate, Sum, PerSum)
  
        ''SQL ստուգում Դուրս գրվածի վերականգնում փաստաթղթի ստեղծումից հետո
        ''HI
        queryString = "select count(*) from HI where fBASE= " & WriteOffReconstruction_ISN &_
                       "and ((fSUM = 45.50 and fCURSUM = 45.50) or (fSUM = 500.00 and fCURSUM = 500.00))"
        sql_Value = 10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        ''HIR
        queryString = "select count(*) from HIR where fBASE = " & WriteOffReconstruction_ISN &_
                       "and (fCURSUM = 545.50 or fCURSUM = 500.00 or fCURSUM = 45.50)"
        sql_Value = 4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        ''HIRREST
        queryString = "select count(*) from HIRREST where fOBJECT = " & .fBASE                   
        sql_Value = 14
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    Call Log.Message("Պարտքերի զիջում փաստաթղթի լրացում",,,attr)
    opDate = "110518"
    Sum = 500
    PerSum = ""
    NeglectingOfDebts_ISN = Neglecting_Of_Debts(opDate, Sum, PerSum)
  
        ''SQL ստուգում Պարտքերի զիջում փաստաթղթի ստեղծումից հետո
        ''HI
        queryString = "select count(*) from HI where fBASE= " & NeglectingOfDebts_ISN &_
                       "and fSUM = 500.00 and fCURSUM = 500.00"
        sql_Value = 3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        ''HIR
        queryString = "select count(*) from HIR where fBASE = " & NeglectingOfDebts_ISN &_
                       "and fCURSUM = 500.00"
        sql_Value = 2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If  
      
    Call Log.Message("Ընդհանուր դիտում",,,attr)
     Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_References & "|" & c_CommView)
    BuiltIn.Delay(2000)
    Call Rekvizit_Fill("Dialog", 1, "General", "LASTDATE", opDate)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
  
    If Not wMDIClient.VBObject("FrmSpr").Exists then
      Call Log.Error("Պայմանգրի դիտում հաշվետվությունը չի հայտնվել:")
    End If

     Builtin.Delay(2000)
    wMDIClient.VBObject("FrmSpr").Close
     Builtin.Delay(2000)
    Call Close_Pttel("frmPttel")

  '-------------------------------------------------------------------------------------
    Call Log.Message("Ջնջել բոլոր փաստաթղթերը",,,attr)
    'Ջնջել բոլոր գործողությունները
    Call GroupDelete(FolderName, .DocLevel, .DocNum, "^A[Del]", "^A[Del]", "^A[Del]")
    
    Call LetterOfCredit_Filter_Fill(FolderName, .DocLevel, .DocNum)
    
    'Ջնջել "Ռիսկի դասիչ և պահուստավորման տոկոս" - ը 
    Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Risking & "|" & c_RisksPersRes)
        
    'Ջնջել Օվերդրաֆտ պայմանագիրը
    Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
    Call ClickCmdButton(3, "²Ûá")
    
     Builtin.Delay(2000)
    Call Close_Pttel("frmPttel")
  '-------------------------------------------------------------------------------------
  End With
  Call Close_AsBank()
End Sub