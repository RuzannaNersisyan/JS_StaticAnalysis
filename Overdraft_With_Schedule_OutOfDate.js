Option Explicit
'USEUNIT Library_Common  
'USEUNIT Subsystems_SQL_Library 
'USEUNIT Constants
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_CheckDB

'Test Case Id 165844

Sub Overdraft_With_Schedule_OutOfDate_Test()
  Dim fDATE, sDATE, attr
  Dim CalcDoc_ISN, RepayDoc_ISN, GiveOverdradt_ISN, RepaySchedule_ISN
  Dim MesBox, Data, Money, FolderName, IfExists, CalcAcc, opDat, Payed1, ExpMoney, Name, NameLen, ColNum, Pttel,_
      Typ, Date, Key, opDate
  Dim QueryString, ExpSQLValue, SQL_IsEqual
  Dim Overdraft,dbFOLDERS(2)
  
 '--------------------------------------
  Set attr = Log.CreateNewAttributes
  attr.BackColor = RGB(0, 255, 255)
  attr.Bold = True
  attr.Italic = True
'--------------------------------------   
  
  ''1, Համակարգ մուտք գործել ARMSOFT օգտագործողով
  fDATE = "20260101"
  sDATE = "20140101"
  Call Initialize_AsBank("bank", sDATE, fDATE)
  Call Create_Connection()

  ''2, Անցում "Օվերդրաֆտ (տեղաբաշխված)" ԱՇՏ
  Call ChangeWorkspace(c_Overdraft)

  CalcAcc = "00001850100"
'---------------------------------------------------------------------------------    
  'Ջնջել Փաստաթղթերը
  'Ջնջել Տոկոսների կուտակում/պարտքերի մարում -ները
  'Մուտք գործել "Օվերդրաֆտ (տեղաբաշխված)/Օվերդրաֆտ ունեցող հաշիվներ"
  FolderName = "|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
  Call wTreeView.DblClickItem(FolderName & "úí»ñ¹ñ³ýï áõÝ»óáÕ Ñ³ßÇíÝ»ñ")
  Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", CalcAcc) 
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  '"Գործողություններ/Բոլոր գործողություններ/Թղթապանակներ/Պայմանագրի թղթապանակ"
  If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 0 Then
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
    Name = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
    NameLen = 30
    ColNum = 0
    Pttel = "_2"
    Call Find_Doc_By(Name, NameLen,ColNum, Pttel)
    
    'Ջնջել "060218" ասմաթվով Օվերդրաֆտի մարումը
    Date = "060218"
    Typ = "22"
    Key = "0"
    Call DeleteD(Date, Typ, Key)
  
    'Ջնջել "050218" ասմաթվով ԲՏՀԴ տոկոսագումարի հաշվարկումը
    Date = "050218"
    Typ = "L1"
    Key = "0"
    Call DeleteD(Date, Typ, Key)
  
    'Ջնջել "040218" ասմաթվով Տոկոսի հաշվարկումը
    Date = "040218"
    Typ = "51"
    Key = "0"
    Call DeleteD(Date, Typ, Key)
    
    'Ջնջել "010218" ասմաթվով Տոկոսի հաշվարկումը
    Date = "010218"
    Typ = "21"
    Key = "0"
    Call DeleteD(Date, Typ, Key)    
        
    wMDIClient.VBObject("frmPttel_2").Close
  End If
  
  If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 1 Then
    Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
    Call ClickCmdButton(3, "²Ûá")
  End If  
  wMDIClient.VBObject("frmPttel").Close
'---------------------------------------------------------------------------------  
  
  Set Overdraft = New_Overdraft()
  With Overdraft
    .DocType = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ" 
    .CalcAcc = "00001850100"                                    
    .Limit = 100000
    .Date = "010218" 
    .GiveDate = "010218"
    .Term = "010219"
    .Percent = "18"
    .NonUsedPercent = ""
    .Paragraph = ""
    .Paragraph = 0
    .PayDates = 5
    .PaperCode = 123
    
    Call Log.Message("Գրաֆիկով օվերդրաֆտ պայմանագրի ստեղծում",,,attr)
    Call .CreatePlOverdraft(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
    
    Log.Message(.DocNum)
  
   ''SQL ստուգում Օվերդրաֆտ պայմանագիր ստեղծելուց հետո                             
      ''CONTRACTS
        QueryString = "select count(*) from CONTRACTS where fDGISN = " & .fBASE &_
                        "and fDGAGRTYPE = 'C' and fDGMODTYPE = 3 and fDGAGRKIND = '8L'" &_
                        "and fDGSTATE = 206 and fDGSUMMA = 100000.00 and fDGALLSUMMA = 0.00"
        ExpSQLValue = 1
        ColNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If  
                                
        ''FOLDERS
        QueryString = "select count(*) from FOLDERS where fISN = " & .fBASE 
        ExpSQLValue = 3
        ColNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If
                               
    Call Log.Message("Մարման գրաֆիկի նշանակում",,,attr)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_RepaySchedule)     
  
    Name = "Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ"
    NameLen = 17
    ColNum = 0
    Pttel = ""
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If IfExists Then 
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_View)
      RepaySchedule_ISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
      wMDIClient.VBObject("frmASDocForm").Close
    End If
  
    ''SQL ստուգում Մարման գրաֆիկ ստեղցելուց հետո: 
        ''AGRSCHEDULE
        QueryString = "select count(*) from AGRSCHEDULE where fAGRISN = " & .fBASE &_
                       "and fKIND = 9 and fTYPE = 0 and fINC = 1"
        ExpSQLValue = 1
        ColNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If  
    
        ''AGRSCHEDULEVALUES
         QueryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN = " & .fBASE &_
                        "and fSUM = 0.00 and (fVALUETYPE = 1 or fVALUETYPE = 2)"
        ExpSQLValue = 2
        ColNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If     
      
        ''CONTRACTS
        QueryString = "select count(*) from CONTRACTS where fDGISN = " & .fBASE &_
                       "and fDGSTATE = 1"
        ExpSQLValue = 1
        ColNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If
       
        ''FOLDERS
        QueryString = "select count(*) from FOLDERS where fISN = " & RepaySchedule_ISN 
        ExpSQLValue = 1
        ColNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If
  
    ''5.Այլ վճարումների գրաֆիկի նշանակում
    Data = Find_Data ("¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ- "& Trim(.DocNum) &" {ä»ïñáëÛ³Ý ä»ïñáë}",0)
    If Not Data then
       call Log.Error("Փաստաթուղթը չի գտնվել") 
       exit Sub
     End If
     
    Call ContractAction (c_OtherPaySchedule)
    wMDIClient.VBObject("frmASDocForm").VBObject("CmdOk_2").ClickButton
 
    ''6."Գրաֆիկով օվերդրաֆտային պայմանագրի" համար կատարել "Գործողություններ/Բոլոր գործողություններ/Ուղարկել հաստատման " գործողությունը 
    'կանգնել պայմանագրի վրա
    Data = Find_Data ("¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ- "& Trim(.DocNum) &" {ä»ïñáëÛ³Ý ä»ïñáë}",0)
    If Not Data then
       call Log.Error("Փաստաթուղթը չի գտնվել") 
       exit Sub
     End If
    call ContractAction(c_SendToVer)
    Sys.Process("Asbank").VBObject("frmAsMsgBox").VBObject("cmdButton").ClickButton 
  
     Builtin.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
  
    ''7.Մուտք գործել Հաստատվող փաստաթղթեր 1 թղթապանակ - Պայմանագիրը պետք է առկա լինի
    Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", .DocNum) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    Builtin.Delay(3000)
    If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 1 Then
      Call Log.Error("Պայմանագիրը առկա չէ Հաստատվող փաստաթղթեր 1 թղթապանակում:")
      Exit Sub
    End If
  
    ''8.Վավերացնել պայմանագիրը    
     Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToConfirm)
    wMDIClient.vbObject("frmASDocForm").vbObject("CmdOk_2").Click()
 
     Builtin.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
   
    ''9.Մուտք գործել "Պայմանագրեր" թղթապանակ - Պայմանագիրը պետք է առկա լինի:
    IfExists = LetterOfCredit_Filter_Fill(FolderName, .DocLevel, .DocNum)
    If (Not IfExists) Then
      Call Log.Error("Պայմանագիրը առկա չէ Պայմանագրեր թղթապանակում:")
      Exit sub
    End If  
  
    Call Log.Message("Օվերդրաֆտի տրամադրում",,,attr)
    Money = "100000"
    GiveOverdradt_ISN = Give_Overdradt(.GiveDate, Money, 2, Null, Null, "")
  
    ''SQL ստուգում Օվերդրաֆտի տրամադրելուց հետո:
      BuiltIn.Delay(delay_small)
      ''AGRSCHEDULEVALUES
      QueryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN = " & .fBASE
      ExpSQLValue = 28
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If 
        
      ''FOLDERS
      QueryString = "select count(*) from FOLDERS where fISN = " & .fBASE 
      ExpSQLValue = 5
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
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
      QueryString = "select count(*) from HI where fBASE = " & GiveOverdradt_ISN &_
                     "and (fTYPE = 01 or fTYPE = 02) and fSUM = 100000.00 and fCURSUM = 100000.00"
      ExpSQLValue = 3
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If

      ''HIF
      QueryString = "select count(*) from HIF where fBASE = " & .fBASE 
      ExpSQLValue = 19
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If
    
      ''HIR
      QueryString = "select count(*) from HIR where fBASE = " & GiveOverdradt_ISN &_
                     "and fCURSUM = 100000.00"  
      ExpSQLValue = 1
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If
    
      ''HIRREST
      QueryString = "select count(*) from HIRREST where fOBJECT = " & .fBASE &_ 
                     "and fLASTREM = 100000.00 and fPENULTREM = 0.00 and fSTARTREM = 0.00"
      ExpSQLValue = 1
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If
    
    Call Log.Message("Օվերդրաֆտի տոկոսների հաշվարկ",,,attr)
    wMDIClient.VBObject("frmPttel").Close
    opDate = "040218"
    CalcDoc_ISN = Overdraft_Percent_Accounting(.DocNum,opDate)
  
    ''SQL ստուգում տոկոսների հաշվարկից հետո:
      ''HI
      QueryString = "select count(*) from HI where fBASE = " & .fBASE &_
                     "and fTYPE = 02 and fSUM = 100000.00 and fCURSUM = 100000.00"
      ExpSQLValue = 2
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If

      ''HIF
      QueryString = "select count(*) from HIF where fBASE = " & CalcDoc_ISN &_ 
                     "and fSUM = 0.00 and fCURSUM = 0.00"
      ExpSQLValue = 1
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If
    
      ''HIT
      QueryString = "select count(*) from HIT where fOBJECT = " & .fBASE &_
                     "and fCURSUM = 197.30"  
      ExpSQLValue = 1
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If
    
      ''HIRREST
      QueryString = "select count(*) from HIRREST where fOBJECT = " & .fBASE &_ 
                     "and (fLASTREM = 100000.00 or fLASTREM = 197.30 or fLASTREM = 7692.30) and fPENULTREM = 0.00 and fSTARTREM = 0.00 "
      ExpSQLValue = 4
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If  
  
    ''12.Օվերդրաֆտի տոկոսների հաշվարկ 
     Builtin.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
    opDate = "050218"
    CalcDoc_ISN = Overdraft_Percent_Accounting(.DocNum, opDate)
  
    ''SQL ստուգում տոկոսների հաշվարկից հետո:
      ''HIF
      QueryString = "select count(*) from HIF where fBASE = " & CalcDoc_ISN &_ 
                     "and fSUM = 0.00 and fCURSUM = 0.00"
      ExpSQLValue = 5
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If
    
      ''HIT
      QueryString = "select count(*) from HIT where fOBJECT = " & .fBASE &_
                     "and (fCURSUM = 197.30 or fCURSUM = 45.50 or fCURSUM = 2.50)"  
      ExpSQLValue = 3
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If
    
      ''HIRREST
      QueryString = "select count(*) from HIRREST where fOBJECT = " & .fBASE &_ 
                     "and (fLASTREM = 100000.00 or fLASTREM = 242.80 or fLASTREM = 2.50 or fLASTREM = 197.30 or fLASTREM = 7692.30) and (fPENULTREM = 0.00 or fPENULTREM = 197.30) and fSTARTREM = 0.00"
      ExpSQLValue = 5
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If 
  
    ''13.Կատարել Օվերդրաֆտի ժամկետնանց մարում
    Call Log.Message("Օվերդրաֆտի պարտքերի մարում",,,attr)
     Builtin.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
    opDate = "060218"
    Payed1 = 100000
    RepayDoc_ISN = Overdraft_Repayment_Operation(.DocNum, opDate, Payed1, "", "")
  
    ''SQL ստուգում պարտքերի մարումից հետո:
      BuiltIn.Delay(delay_small)
      ''AGRSCHEDULE
      QueryString = "select count(*) from AGRSCHEDULE where fAGRISN = " & .fBASE &_
                     "and fTYPE = 0 and (fKIND = 2 or fKIND = 3 or fKIND = 9)"
      ExpSQLValue = 3
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If  
  
      BuiltIn.Delay(delay_small)
      
      ''AGRSCHEDULEVALUES
      QueryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN = " & .fBASE
      ExpSQLValue = 30
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If 
    
      ''HI
      QueryString = "select count(*) from HI where fBASE = " & RepayDoc_ISN &_
                     "and (fSUM = 197.30 or fSUM = 100000.00 or fSUM = 2.50) and (fCURSUM = 197.30 or fCURSUM = 100000.00  or fCURSUM = 2.50)"
      ExpSQLValue = 7
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If
    
      ''HIR
      QueryString = "select count(*) from HIR where fBASE = " & RepayDoc_ISN &_
                     "and (fCURSUM = 100000.00 or fCURSUM = 197.30 or fCURSUM = 2.50 or fCURSUM = 7692.30)"  
      ExpSQLValue = 5
      ColNum = 0
      SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, ColNum)
      If Not SQL_IsEqual Then
        Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
      End If
  
    ''15.Ստուգել, որ հաշվի մնացորդը զրոյացած լինի:
    ExpMoney = "0.00"
    Data = Find_Data (ExpMoney,3)
    If Not Data then
       call Log.Error("Հաշվի մնացորդը չի զրոյացել:") 
       exit Sub
    End If 
   
     Builtin.Delay(2000)
   wMDIClient.VBObject("frmPttel").Close     
 
  '---------------------------------------------------------------------------------    
    ''16.Ջնջել բոլոր փաստաթղթերը:
    'Ջնջել Տոկոսների կուտակում/պարտքերի մարում -ները
    'Մուտք գործել "Օվերդրաֆտ (տեղաբաշխված)/Օվերդրաֆտ ունեցող հաշիվներ"
    Call wTreeView.DblClickItem(FolderName & "úí»ñ¹ñ³ýï áõÝ»óáÕ Ñ³ßÇíÝ»ñ")
    Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", .CalcAcc) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    '"Գործողություններ/Բոլոր գործողություններ/Թղթապանակներ/Պայմանագրի թղթապանակ"
     Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
    Name = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
    NameLen = 30
    ColNum = 0
    Pttel = "_2"
    Call Find_Doc_By(Name, NameLen,ColNum, Pttel)
    
    'Ջնջել "060218" ասմաթվով Օվերդրաֆտի մարումը
    Date = "060218"
    Typ = "22"
    Key = "0"
    Call DeleteD(Date, Typ, Key)
  
    'Ջնջել "050218" ասմաթվով ԲՏՀԴ տոկոսագումարի հաշվարկումը
    Date = "050218"
    Typ = "L1"
    Key = "0"
    Call DeleteD(Date, Typ, Key)
  
    'Ջնջել "040218" ասմաթվով Տոկոսի հաշվարկումը
    Date = "040218"
    Typ = "51"
    Key = "0"
    Call DeleteD(Date, Typ, Key)
    
    'Ջնջել "010218" ասմաթվով Տոկոսի հաշվարկումը
    Date = "010218"
    Typ = "21"
    Key = "0"
    Call DeleteD(Date, Typ, Key)    
        
    wMDIClient.VBObject("frmPttel_2").Close

    If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 1 Then
      Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
      Call ClickCmdButton(3, "²Ûá")
    End If  
    wMDIClient.VBObject("frmPttel").Close
  '---------------------------------------------------------------------------------  
 End With 
 Call Close_AsBank()  
End Sub