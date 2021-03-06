Option Explicit
'USEUNIT Library_Common  
'USEUNIT Subsystems_SQL_Library 
'USEUNIT Constants
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Akreditiv_Library
'USEUNIT CashInput_Confirmphases_Library
'USEUNIT CashOutput_Confirmpases_Library
'USEUNIT Acc_Statements_Library
'USEUNIT Group_Operations_Library
'USEUNIT Library_Contracts
'USEUNIT Library_CheckDB

'Test case Id 165847

Sub Overdraft_With_Schedule_AccTurnover_Test()
  Dim RepaySchedule_ISN, GiveOverdradt_ISN, CashInputDoc_ISN, CashOutputDoc_ISN,_
      CalcDoc_ISN, RepayDoc_ISN, InputDoc_ISN, OutputDoc_ISN
  Dim fDATE, sDATE, my_vbObj, frmAsMsgBox
  Dim OverdraftType, CreditCard, payerCode,TemplateType, curCode, _
      CalcAcc, Sum, Renewable, Limit, opDate, Term, RepayBy,_
      DateType, SumsDateType, Percent, Baj, SumsFillType,_
      PaymentDate, Sector, UsageField, Aim, Schedule, Guarantee, Country, District, RegionLR,_
      PaperCode, fBASE, DocNum, AutoDebt, PledgeCode, PledgeCur, PledgeValue, PledgeCount
  Dim name, name_len, Pttel, docType, FolderName, IfExists
  Dim GiveDate, Money, oType, accNum, Num, accCredit, opPerSum, opUnUsePerSum
  Dim docNumber, summa, Statement, AvailableBalance, Date, opType, InputDocNumber, OutputDocNumber,_
      Workspace, Action, template
  Dim queryString, sql_isEqual, sql_Value, colNum  
  Dim attr,dbFOLDERS(2),Name1
   
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
  
  OverdraftType = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
  PayerCode = "00000018"
  CalcAcc = "00001103022"
  Sum = "100000"
  Renewable = 1
  Limit = 0
  opDate = "080618"
  Term = "080619"
  RepayBy = 1
  DateType = 1
  SumsDateType = 1
  Percent = 12
  Baj = 365
  SumsFillType = "01"
  PaymentDate = 15
  Sector = "U2"
  Aim = "00"
  schedule = 9
  Guarantee = 9
  Country = "AM" 
  district = "001"
  RegionLR = "010000008"
  PaperCode = 123
  
''------------------------------------------------------------------------------
 ''Ջնջել բոլոր փաստաթղթերը
  'Ջնջել Օվերդրաֆտ պայամանգրի վրա կատարված գործողությունները 
  FolderName = "|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
  Call wTreeView.DblClickItem(FolderName & "úí»ñ¹ñ³ýï áõÝ»óáÕ Ñ³ßÇíÝ»ñ")
  Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", CalcAcc)
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  
  If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 0 Then
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_View)
    DocNum = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TextC").Text
    wMDIClient.VBObject("frmASDocForm").Close
    wMDIClient.VBObject("frmPttel").Close

    Workspace = "|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
    DocType = 1
    sDate = ""
    fDate = ""
    Action = ""  
    Call GroupDelete(Workspace, DocType, DocNum, sDate, fDate, Action)
   
   'Ջնջել Օվերդրաֆտ պայմանագիրը
    docType = "1"
    FolderName = "|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
    IfExists = LetterOfCredit_Filter_Fill(FolderName, docType, DocNum)
    Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
    Call ClickCmdButton(3, "²Ûá")
  End If
  wMDIClient.VBObject("frmPttel").Close
     
   'Ջնջել Կանխիկ մուտքը և Կանխիկ ելքը
   Call ChangeWorkspace(c_CustomerService) 
   
   Date = "140618"
   
   opType = "KasRsOrd"
   Call DeletePayingDoc(Date, opType, OutputDoc_ISN)
   opType = "KasPrOrd"
  Call DeletePayingDoc(Date, opType, InputDoc_ISN)
'______________________________________________________________________________     
  Call ChangeWorkspace(c_Overdraft) 
  Call Log.Message("3.Գրաֆիկով Օվերդրաֆտ պայմանագրի ստեղծում",,,attr)
  Call Letter_Of_Overdraft_Doc_Fill(OverdraftType, CreditCard, payerCode,TemplateType, curCode, _
                                      CalcAcc, Sum, Renewable, Limit, opDate, opDate, Term, RepayBy,_
                                      DateType, SumsDateType, Percent, Baj, SumsFillType,_
                                      PaymentDate, Sector, UsageField, Aim, Schedule, Guarantee, Country, District, RegionLR,_
                                      PaperCode, fBASE, DocNum, AutoDebt, PledgeCode, PledgeCur, PledgeValue, PledgeCount)
  
  ''SQL ստուգում պայամանգիր ստեղցելուց հետո: 
      ''CONTRACTS
      queryString = "select count(*) from CONTRACTS where fDGISN = " & fBASE &_
                      "and fDGAGRTYPE = 'C' and fDGMODTYPE = 3 and fDGAGRKIND = '8L'" &_
                      "and fDGSTATE = 206 and fDGSUMMA = 100000.00 and fDGALLSUMMA = 0.00"
      sql_Value = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
      End If  
                                
      ''FOLDERS
      queryString = "select count(*) from FOLDERS where fISN = " & fBASE 
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
    RepaySchedule_ISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    wMDIClient.VBObject("frmASDocForm").Close
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
      queryString = "select count(*) from CONTRACTS where fDGISN = " & fBASE &_
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
  Builtin.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
  
  ''7.Մուտք գործել "Հաստատվող փաստաթղթեր 1" թղթապանակ 
  Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
  Call Rekvizit_Fill("Dialog", 1, "General", "NUM", DocNum)
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
  Call ClickCmdButton(1, "Ð³ëï³ï»É")
  Builtin.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close

  ''9.Մուտք գործել "Պայմանագրեր" թղթապանակ - Փաստաթուղթը պետք է առկա լինի:
  docType = "1"
  FolderName = "|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
  IfExists = LetterOfCredit_Filter_Fill(FolderName, docType, DocNum)
  If Not IfExists Then
    Call Log.Error("Պայմանագիրը առկա չէ")
    Exit Sub
  End If
  
  Call Log.Message("10.Օվերդրաֆտի տրամադրում",,,attr) 
  GiveDate = opDate
  Money = "100000"
  oType = "2"
  accNum = PayerCode
  accCredit = ""
  GiveOverdradt_ISN = Give_Overdradt(GiveDate, Money, oType, Num, accNum, accCredit)

  Builtin.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
  
      ''SQL ստուգում Օվերդրաֆտ տրամադրելուց հետո:   
      BuiltIn.Delay(delay_small) 
      ''CONTRACTS
      queryString = "select count(*) from CONTRACTS where fDGISN =" & fBASE &_
                      "and fDGAGRTYPE = 'C' and fDGMODTYPE = 3 and fDGAGRKIND = '8L'" &_
                      "and fDGSTATE = 7 and fDGSUMMA = 100000.00 and fDGALLSUMMA = 0.00"
      sql_Value = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
      End If
           
      ''FOLDERS
      queryString = "select count(*) from FOLDERS where fISN = " & fBASE 
      sql_Value = 5
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
      End If
      
      Set dbFOLDERS(1) = New_DB_FOLDERS()
          dbFOLDERS(1).fFOLDERID = "LOANREGISTER"
          dbFOLDERS(1).fNAME = "C3Univer"
          dbFOLDERS(1).fKEY = fBASE 
          dbFOLDERS(1).fISN = fBASE 
          dbFOLDERS(1).fSTATUS = 1
          dbFOLDERS(1).fCOM = "ä»ïñáëÛ³Ý ä»ïñáë"
          dbFOLDERS(1).fSPEC = "C38"& Trim(DocNum) &"          123                               0                                                                                                                                                             0.00                                                                                                                                                                                                                                                                                               "

      Set dbFOLDERS(2) = New_DB_FOLDERS()
          dbFOLDERS(2).fFOLDERID = "LOANREGISTER2"
          dbFOLDERS(2).fNAME = "C3Univer"
          dbFOLDERS(2).fKEY = fBASE 
          dbFOLDERS(2).fISN = fBASE 
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
      queryString = "select count(*) from HI where fBASE = " & fBASE
      sql_Value = 2
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
      End If

      ''HIF
      queryString = "select count(*) from HIF where fBASE = " & fBASE
      sql_Value = 19
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
      End If
  
  Call Log.Message("11.Կատարել Կանխիկ մուտք առաջիկա մարվելիք գումարի չափով",,,attr)
  Call ChangeWorkspace(c_CustomerService)   
  opDate = "140618"
  opType = "CashInput"
  Summa = "7922.40" 
  Name1 = "Պետրոսյան Պետրոս"
  Call CashInputOutput(opDate, opType, CalcAcc, Summa, InputDocNumber, Name1, InputDoc_ISN)
  wMDIClient.VBObject("FrmSpr").Close
  
  ''12.Կանխիկ մուտք փաստաթուղթը ուղարկել հաստատման:
  Builtin.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_SendToVer)
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  Builtin.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
  
  Call Log.Message("13.Կատարել Կանխիկ ելք նույն գումարի չափով",,,attr)
  opType = "CashOutput"
  Call CashInputOutput(opDate, opType, CalcAcc, Summa, OutputDocNumber, Name1, OutputDoc_ISN)       
  Builtin.Delay(2000)
  wMDIClient.VBObject("FrmSpr").Close
  
  ''14.Կանխիկ ելք փաստաթուղթը ուղարկել հաստատման:
  Builtin.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_SendToVer)
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  Builtin.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
  
  ''15.Մուտք գործել "Հաստատող 1 ԱՇՏ/Հաստատվող վճարային փաստաթղթեր " թղթապանակ - "Կանխիկ ելք" և "Կանխիկ մուտք" փաստաթղթերը պետք է առկա լինեն:
  Call ChangeWorkspace(c_Verifier1)
  
  Dim VerificationDoc
  Set VerificationDoc = New_VerificationDocument()
      VerificationDoc.User = "77"
        
  Call GoToVerificationDocument("|Ð³ëï³ïáÕ I ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ",VerificationDoc)
  Builtin.Delay(2000)
  
  name_len = 6
  ColNum = 3
  Pttel = ""
  
  ''16.Վավերացնել "Կանխիկ ելք" փաստաթուղթը:
  Call Find_Doc_By(OutputDocNumber, name_len, ColNum, Pttel)
  Builtin.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_ToConfirm)
  Call ClickCmdButton(1, "Ð³ëï³ï»É")
  
  ''17.Վավերացնել "Կանխիկ մուտք" փաստաթուղթը:
  Call Find_Doc_By(InputDocNumber, name_len, ColNum, Pttel)
  Builtin.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_ToConfirm)
  Call ClickCmdButton(1, "Ð³ëï³ï»É")
  
  Builtin.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
  
  ''18.Մուտք գործել "Հաճախորդի սպասարկում և դրամարկղ/Աշխատանքային փաստաթղթեր" - "Կանխիկ մուտք" փաստաթուղթը պետք է առկա լինի:
  Call ChangeWorkspace(c_CustomerService)  
  Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
  Call Rekvizit_Fill("Dialog", 1, "General", "PERN", opDate)
  Call Rekvizit_Fill("Dialog", 1, "General", "PERK", opDate)
  Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", "KasPrOrd")
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  
  ''19.Վավերացնել "Կանխիկ մուտք" փաստաթուղթը:
  Builtin.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_ToConfirm)
  Call ClickCmdButton(1, "Ð³ëï³ï»É")
  Builtin.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
   
  Call Log.Message("20.Օվերդրաֆտի տոկոսների հաշվարկ",,,attr) 
  Call ChangeWorkspace(c_Overdraft)  
  opDate = "140618"
  CalcDoc_ISN = Overdraft_Percent_Accounting(DocNum, opDate)
  Builtin.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
  
    ''SQL ստուգում Օվերդրաֆտի տոկոսների հաշվարկից հետո:      
      ''AGRSCHEDULEVALUES
      queryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN = " & fBASE
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
                     "and (fCURSUM = 230.10 or fCURSUM = 7692.30)"
      sql_Value = 3
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
      End If
      
      BuiltIn.Delay(delay_small) 
      
      ''HIRREST
      queryString = "select count(*) from HIRREST where fOBJECT = " & fBASE &_
                     "and (fLASTREM = 100000.00 or fLASTREM = 230.10 or fLASTREM = 7692.30) and fSTARTREM = 0.00 and fPENULTREM = 0.00"
      sql_Value = 4
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
      End If
    
      ''HIT
      queryString = "select count(*) from HIT where fOBJECT = " & fBASE &_ 
                     "and fCURSUM = 230.10"
      sql_Value = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
      End If  
  
  Call Log.Message("21.Օվերդրաֆտի պարտքերի մարում",,,attr)
  opDate = "150618"
  Sum = ""
  RepayDoc_ISN = Overdraft_Repayment_Operation(DocNum, opDate, Sum, opPerSum, opUnUsePerSum)

  Builtin.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
 
    ''SQL ստուգում Օվերդրաֆտի պարտքերի մարումից հետո:
      BuiltIn.Delay(delay_small)
      
      ''AGRSCHEDULEVALUES
      queryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN = " & fBASE 
      sql_Value = 52
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
      End If
      
      ''HIRREST
      queryString = "select count(*) from HIRREST where fOBJECT = " & fBASE &_
                     "and (fLASTREM = 92307.70 or fLASTREM = 0.00) and (fPENULTREM = 100000.00 or fPENULTREM = 230.10 or fPENULTREM = 0.00) and fSTARTREM = 0.00"
      sql_Value = 4
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
      End If
     
  ''22.Անցնել "Հաճախորդի սպասարկում և դրամարկղ(ԱՇՏ)"
  Call ChangeWorkspace(c_CustomerService) 
  Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Ð³ßÇíÝ»ñ")
  Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", CalcAcc)
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  
  Call Log.Message("14.Ստեղծել Քղվածք հաշվից ",,,attr)
  sDate = "150618"   
  fDate = "150618"
  Statement = View_ACC_Statment (sDate, fDate, template)  
  
  If Not Statement Then
    Log.Error("Քաղվածքը առկա չէ:")
  End If  
  
  ''15.Ստուգել, որ հաշվի Վերջնական հասանելի մնացորդը նվազած լինի տոկոսագումարի չափով
  Call wMainForm.MainMenu.Click(c_Editor)
  Call wMainForm.PopupMenu.Click(c_Find)
  Sys.Process("Asbank").VBObject("frmSprFind").VBObject("Frame1").VBObject("TDBMask1").Keys("99,769.90" & "[Tab]")
  Sys.Process("Asbank").VBObject("frmSprFind").VBObject("Command1").ClickButton
  
  Set frmAsMsgBox = AsBank.WaitVBObject("frmAsMsgBox", delay_small)
  If frmAsMsgBox.Exists Then
    Log.Error("Այդպիսի գրառում չկա:")
  End If  
  
  Builtin.Delay(2000)
  Sys.Process("Asbank").VBObject("frmSprFind").Close
  
  Builtin.Delay(2000)
  wMDIClient.VBObject("FrmSpr").Close
  wMDIClient.VBObject("frmPttel").Close
 
   Call Log.Message("Ջնջել բոլոր փաստաթղթերը",,,attr)
  'Ջնջել Օվերդրաֆտ պայամանգրի վրա կատարված գործողությունները
   Call ChangeWorkspace(c_Overdraft)  
   Workspace = "|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
   DocType = 1
   sDate = "^A[Del]" & "[Tab]"
   fDate = "^A[Del]" & "[Tab]"
   Action = "^A[Del]" & "[Tab]"  
   Call GroupDelete(Workspace, DocType, DocNum, sDate, fDate, Action)
   
   'Ջնջել Օվերդրաֆտ պայմանագիրը
   docType = "1"
   FolderName = "|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
   IfExists = LetterOfCredit_Filter_Fill(FolderName, docType, DocNum)
   Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
   Call ClickCmdButton(3, "²Ûá")
   wMDIClient.VBObject("frmPttel").Close
   
   'Ջնջել Կանխիկ մուտքը և Կանխիկ ելքը
   Call ChangeWorkspace(c_CustomerService) 
   
   opType = Null
   opDate = "140618"
   Call DeletePayingDoc(opDate, opType, OutputDoc_ISN)
   Call DeletePayingDoc(opDate, opType, InputDoc_ISN)
   
   Call Close_AsBank()
End Sub