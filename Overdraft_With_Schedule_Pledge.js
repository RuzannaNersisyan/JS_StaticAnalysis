Option Explicit
'USEUNIT Library_Common  
'USEUNIT Subsystems_SQL_Library 
'USEUNIT Constants
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Contracts

'Test case Id 165845

Sub Overdraft_With_Schedule_Pledge_Test()
  Dim fDATE, sDATE, my_vbObj, DateS, DateF, attr
  Dim fBASE, RepaySchedule_ISN, GiveOverdradt_ISN, CalcDoc_ISN, RepayDoc_ISN, PledgeDoc_ISN, InterestRateDoc_ISN
  Dim CalcAcc, Name, NameLen, ColNum, Pttel, IfExists, Data
  Dim docType, FolderName, Money, oType, Num, Sum
  Dim PledgeType, ContractType, PledgeDocNum, Cur, Count, Date, Pledge
  Dim opDate, opSum, IntDate, IntRate, RealRate, PayerCode
  Dim Typ, Key, PaymentDocType, Exists  
  Dim QueryString, ExpSQLValue, SQL_IsEqual
  Dim Overdraft
  
 '--------------------------------------
  Set attr = Log.CreateNewAttributes
  attr.BackColor = RGB(0, 255, 255)
  attr.Bold = True
  attr.Italic = True
'--------------------------------------   
  
  DateS = "010117" 
  DateF = "010119" 
  
  ''1, Համակարգ մուտք գործել ARMSOFT օգտագործողով
  fDATE = "20260101"
  sDATE = "20140101"
  Call Initialize_AsBank("bank", sDATE, fDATE)
  Call Create_Connection()

  ''2, Անցում "Օվերդրաֆտ (տեղաբաշխված)" ԱՇՏ
  Call ChangeWorkspace(c_Overdraft)
     
'--------------------------------------------------------------------------------------------      
  PaymentDocType = "KasRsOrd"
  IntDate = "150518"
  CalcAcc = "33170160500"
  
  ''Ջնջել բոլոր փաստաթղթերը 
 'Մուտք գործել "Օվերդրաֆտ (տեղաբաշխված)/Օվերդրաֆտ ունեցող հաշիվներ"
  FolderName = "|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
  Call wTreeView.DblClickItem(FolderName & "úí»ñ¹ñ³ýï áõÝ»óáÕ Ñ³ßÇíÝ»ñ")
  Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", CalcAcc) 
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  BuiltIn.delay(2000)
  
  '"Գործողություններ/Բոլոր գործողություններ/Թղթապանակներ/Պայմանագրի թղթապանակ"
  If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 0 Then
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
    Name = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
    NameLen = 30
    ColNum = 0
    Pttel = "_2"
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)

    If IfExists Then
      'Ջնջել Օվերդրաֆտի մարումը
      Date = "160518"
      Typ = "22"
      Key = "0"
      Call DeleteD(Date, Typ, Key)
    
      'Ջնջել Տոկոսի հաշվարկումը
      Date = "150518"
      Typ = "51"
      Key = "0"
      Call DeleteD(Date, Typ, Key)
      
      BuiltIn.delay(1000)
      wMDIClient.VBObject("frmPttel_2").Close  
      BuiltIn.delay(1000)
      wMDIClient.VBObject("frmPttel").Close
  
      'Ջնջել "Կանխիկ ելք"-ը
      'Մուտք գործել "Հաճախորդի սպասարկում և դրամարկղ / Հաշվառված վճարային փաստաթղթեր"
      Call ChangeWorkspace(c_CustomerService)
      Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", DateS) 
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", DateF) 
      Call Rekvizit_Fill("Dialog", 1, "General", "CLICODE", PayerCode) 
      Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", PaymentDocType) 
      Call ClickCmdButton(2, "Î³ï³ñ»É")
  
      BuiltIn.delay(2000)
      If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 1 Then
      Name = "úí»ñ¹ñ³ýïÇ ïñ³Ù³¹ñáõÙ"
      NameLen = 21
      ColNum = 9
      Pttel = ""
      Exists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    
        If Exists Then
          Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
          Call ClickCmdButton(3, "²Ûá")
          Call ClickCmdButton(5, "²Ûá")
        End If
      End If 
      BuiltIn.delay(2000)
      wMDIClient.VBObject("frmPttel").Close
    
      'Ջնջել "Աշխատանքային փաստաթղթեր"-ից
      'Մուտք գործել "Հաճախորդի սպասարկում և դրամարկղ / Աշխատանքային փաստաթղթեր"
      Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
  
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", "^A[Del]" & DateS) 
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", "^A[Del]" & DateF)  
      Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", PaymentDocType)
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.delay(2000)
      If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 1 Then
        Name = "úí»ñ¹ñ³ýïÇ ïñ³Ù³¹ñáõÙ"
        NameLen = 21
        ColNum = 12
        Pttel = ""
        Exists = Find_Doc_By(Name, NameLen, ColNum, Pttel)
    
        If Exists Then
          Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
          Call ClickCmdButton(3, "²Ûá")
          Call ClickCmdButton(5, "²Ûá")
        End If
      End If 
      BuiltIn.delay(2000)
      wMDIClient.VBObject("frmPttel").Close

    
      'Պայմանագրի թղթապանակից Ջնջել "Գումարի տրամադրում..."
      Call ChangeWorkspace(c_Overdraft)
      'Մուտք գործել "Օվերդրաֆտ (տեղաբաշխված)/Օվերդրաֆտ ունեցող հաշիվներ"
      FolderName = "|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
      Call wTreeView.DblClickItem(FolderName & "úí»ñ¹ñ³ýï áõÝ»óáÕ Ñ³ßÇíÝ»ñ")
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", CalcAcc) 
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.delay(2000)
      '"Գործողություններ/Բոլոր գործողություններ/Թղթապանակներ/Պայմանագրի թղթապանակ"
      If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 0 Then  
        BuiltIn.delay(1000)
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
   
        '''Պայմանագրի թղթապանակից Ջնջել "Գումարի տրամադրում..."
  
        Name = "¶áõÙ³ñÇ ïñ³Ù³¹ñáõÙ"
        NameLen = 18
        ColNum = 0
        Pttel = "_2"
        Exists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
        If Exists Then
          Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
          Call ClickCmdButton(3, "²Ûá")
        End If
      
        'Ջնջել "Արդյունավետ տոկոսադրույքը"
        Name = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
        NameLen = 30
        ColNum = 0
        Pttel = "_2"
        IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)

        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" & c_Percentages & "|" & c_EffRate)
        Call Rekvizit_Fill("Dialog", 1, "General", "START", IntDate) 
        Call Rekvizit_Fill("Dialog", 1, "General", "END", IntDate) 
        Call Rekvizit_Fill("Dialog", 1, "CheckBox", "ONLYCH", 1)
        Call ClickCmdButton(2, "Î³ï³ñ»É")
        BuiltIn.delay(2000)
        
        If wMDIClient.VBObject("frmPttel_3").VBObject("tdbgView").ApproxCount = 1 Then
          Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
          Call ClickCmdButton(3, "²Ûá")
        End IF
        BuiltIn.delay(2000)
        wMDIClient.VBObject("frmPttel_3").Close
      
        'Ջնջել Գրավի առարկան
        Name = "¶ñ³íÇ å³ÛÙ³Ý³·Çñ"
        NameLen = 16
        ColNum = 0
        Pttel = "_2"
        IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
        If IfExists then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
      
          Name = "¶ñ³íÇ ³é³ñÏ³"
          NameLen = 12
          ColNum = 0
          Pttel = "_3"
          IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
          If IfExists then
             Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
             Call ClickCmdButton(3, "²Ûá")           
          End If
          Name = "¶ñ³íÇ å³ÛÙ³Ý³·Çñ"
          NameLen = 16
          ColNum = 0
          Pttel = "_3"
          IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
          Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)           
          Call ClickCmdButton(3, "²Ûá")
          BuiltIn.delay(2000)
          wMDIClient.VBObject("frmPttel_3").Close
        End If 
      
        Name = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
        NameLen = 30
        ColNum = 0
        Pttel = "_2"
        IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
        If IfExists then
          Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)           
          Call ClickCmdButton(3, "²Ûá")
        End If  
       
        BuiltIn.delay(1000)
        wMDIClient.VBObject("frmPttel_2").Close
      End If
    End If
  End IF  
  BuiltIn.delay(2000)
  wMDIClient.VBObject("frmPttel").Close
'--------------------------------------------------------------------------------------------  

  ''3.Գրաֆիկով Օվերդրաֆտ պայմանագրի ստեղծում
  Set Overdraft = New_Overdraft()
  With Overdraft
    .DocType = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ" 
    .Template = "0001"
    .CalcAcc = "33170160500"                                    
    .Limit = 100000
    .Date = "160418" 
    .GiveDate = "160418"
    .Term = "160419"
    .Percent = "18"
    .Percent = ""
    .NonUsedPercent = ""
    .Baj = ""
    .DateFill = ""
    .Paragraph = ""
    .SumsDateFillType = ""
    .PayDates = ""
    .PaperCode = 111
    
    Call Log.Message("Գրաֆիկով օվերդրաֆտ պայմանագրի ստեղծում",,,attr)
    Call .CreatePlOverdraft(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
    
    Log.Message(.DocNum)
       
      ''SQL ստուգում պայամանգիր ստեղցելուց հետո: 
        ''CONTRACTS
        QueryString = "select count(*) from CONTRACTS where fDGISN = " & .fBASE &_
                        "and fDGAGRTYPE = 'C' and fDGMODTYPE = 3 and fDGAGRKIND = '8L'" &_
                        "and fDGSTATE = 206 and fDGSUMMA = 100000.00 and fDGALLSUMMA = 0.00"
        ExpSQLValue = 1
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If  
                                
        ''FOLDERS
        QueryString = "select count(*) from FOLDERS where fISN = " & .fBASE 
        ExpSQLValue = 3
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If                          
                                                                            
    ''4.Մարման գրաֆիկի նշանակում
    BuiltIn.delay(1000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_RepaySchedule)  
    
    Name = "Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ"
    NameLen = 17
    ColNum = 0
    Pttel = ""
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If IfExists Then 
      BuiltIn.delay(2000)
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_View)
      RepaySchedule_ISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
      wMDIClient.VBObject("frmASDocForm").Close
    End If
  
      ''SQL ստուգում Մարման գրաֆիկ ստեղցելուց հետո: 
        ''AGRSCHEDULE
        QueryString = "select count(*) from AGRSCHEDULE where fBASE = " & RepaySchedule_ISN &_
                        "and fKIND = 9 and fTYPE = 0 and fINC = 1"
        ExpSQLValue = 1
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If  
    
        ''CONTRACTS
        QueryString = "select count(*) from CONTRACTS where fDGISN = " & .fBASE &_
                        "and fDGAGRTYPE = 'C' and fDGMODTYPE = 3 and fDGAGRKIND = '8L'" &_
                        "and fDGSTATE = 1 and fDGSUMMA = 100000.00 and fDGALLSUMMA = 0.00"
        ExpSQLValue = 1
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If    
       
        ''FOLDERS
        QueryString = "select count(*) from FOLDERS where fISN= '" & RepaySchedule_ISN & "'"
        ExpSQLValue = 1
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If
  
    ''5.Այլ վճարումների գրաֆիկի նշանակում
    Name = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
    NameLen = 30
    ColNum = 0
    Pttel = ""
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If Not IfExists then
       Call Log.Error("Փաստաթուղթը չի գտնվել") 
       Exit Sub
     End If
     
    Call ContractAction (c_OtherPaySchedule)
    wMDIClient.VBObject("frmASDocForm").VBObject("CmdOk_2").ClickButton
    
    Call Log.Message("Գրավի պայմանագրի ստեղծում",,,attr)
    Name = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
    NameLen = 30
    ColNum = 0
    Pttel = ""
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If Not IfExists Then
       Call Log.Error("Փաստաթուղթը չի գտնվել") 
       Exit Sub
     End If
   
    PledgeType = "¶ñ³í`³íïáÙ³ï µ³óíáÕ"
    ContractType = 9
    Cur = "000"
    Sum = 200000
    Count = 1
    Date = "160418"
    Pledge = 0
    PledgeDoc_ISN = CreatePledge(PledgeType, ContractType, PledgeDocNum, Cur, Sum, Count, Date, Pledge)
   
      ''SQL ստուգում Գրավի պայմանագիր ստեղցելուց հետո: 
        ''CONTRACTS
        QueryString = "select count(*) from CONTRACTS where fDGISN = " & PledgeDoc_ISN &_
                        "and fDGAGRTYPE = 'N' and fDGSUMMA = 200000.00 and fDGALLSUMMA = 1.00" 
        ExpSQLValue = 1
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If
      
        ''FOLDERS
        QueryString = "select count(*) from FOLDERS where fISN = " & PledgeDoc_ISN
        ExpSQLValue = 5
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If
  
    ''7."Գրաֆիկով օվերդրաֆտ" և "Գրավի" պայմանագրերը ուղարկել հաստատման
    Name = "¶ñ³íÇ å³ÛÙ³Ý³·Çñ"
    NameLen = 16
    ColNum = 0
    Pttel = "_2"
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If Not IfExists then
       Call Log.Error("Փաստաթուղթը չի գտնվել") 
       Exit Sub
    End If
   
     Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendToVer)
    Call ClickCmdButton(5, "²Ûá")
 
  
     Builtin.Delay(2000)
    wMDIClient.VBObject("frmPttel_2").Close
  
    Name = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
    NameLen = 30
    ColNum = 0
    Pttel = ""
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If Not IfExists then
       Call Log.Error("Փաստաթուղթը չի գտնվել") 
       Exit Sub
     End If
   
      Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendToVer)
    Call ClickCmdButton(5, "²Ûá")  
    
     Builtin.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
  
    ''8.Մուտք գործել "Սև ցուցակ հաստատողի ԱՇՏ/Հաստատվող տեղաբաշխված միջոցներ"
    Call ChangeWorkspace(c_BLVerifyer)
  
    Call wTreeView.DblClickItem("|§ê¨ óáõó³Ï¦ Ñ³ëï³ïáÕÇ ²Þî|Ð³ëï³ïíáÕ ï»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ ¨ »ñ³ßË³íáñáõÃÛáõÝÝ»ñ")
	Call Rekvizit_Fill("Dialog", 1, "General", "SUBSYS", "C3") 
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", .DocNum) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    Builtin.Delay(2000)
    
    ''9.Վավերացնել պայմանագիրը
    If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 1 Then
      Call Log.Error("Պայմանագիրը չի գտնվել <<Հաստատվող տեղաբաշխված միջոցներ>> թղթապանակում:")
    End If
  
     Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToConfirm)
    Call ClickCmdButton(1, "Ð³ëï³ï»É")
     Builtin.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
  
    ''10.Մուտք գործել "Օվերդրաֆտ(տեղաբաշխված)/Հաստատվող փաստաթղթեր 1" թղթապանակ - Պայմանագիրը պետք է առկա լինի
    Call ChangeWorkspace(c_Overdraft)
  
    Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", .DocNum) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    Builtin.Delay(3000)
    Set my_vbObj = wMDIClient.VBObject("frmPttel").VBObject("tdbgView")
    If my_vbObj.ApproxCount <> 1 Then
      Call Log.Error("Պայմանագիրը առկա չէ Հաստատվող փաստաթղթեր 1 թղթապանակում:")
      Exit Sub
    End If
  
    ''11.Վավերացնել պայմանագիրը
     Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToConfirm)
    Call ClickCmdButton(1, "Ð³ëï³ï»É")
  
     Builtin.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
  
    ''12.Մուտք գործել "Ապահովվածության պայմանագրեր" ԱՇՏ
    Call ChangeWorkspace(c_CollateralAgr)
  
    ''13.Մուտք գործել "Պայմանագրեր/Ստացված գրավ/Հաստատվող փաստաթղթեր 1" թղթապանակ - Գրավի պայմանագիրը պետք է առկա լինի :
    Call wTreeView.DblClickItem("|²å³Ñáíí³ÍáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñ|ä³ÛÙ³Ý³·ñ»ñ|êï³óí³Í ·ñ³í|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", PledgeDocNum) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")

    ''14.Վավերացնել Գրավի պայմանագիրը
     Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToConfirm)
    Call ClickCmdButton(1, "Ð³ëï³ï»É")
  
     Builtin.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
   
    ''15.Մուտք գործել "Օվերդրաֆտ (տեղաբաշխված)" ԱՇՏ
    Call ChangeWorkspace(c_Overdraft)
  
    ''16.Մուտք գործել "Պայմանագրեր" թղթապանակ - Պայմանգիրը պետք է առկա լինի :
    docType = "1"
    FolderName = "|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
    IfExists = LetterOfCredit_Filter_Fill(FolderName, docType, .DocNum)
    If (Not IfExists) Then
      Call Log.Error("Պայմանագիրը առկա չէ")
      Exit Sub
    End If
  
    Call Log.Message("Օվերդրաֆտի տրամադրում (կանխիկ եղանակով)",,,attr)
    oType = "1"
     Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_GiveOverdraft)
  
    'Լրացնել Ամսաթիվ դաշտը GiveDate արժեքով
    Call Rekvizit_Fill("Document", 1, "General", "DATE", .GiveDate) 
    'Լրացնել Գումար դաշտը Money արժեքով
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", .Limit)
    'Լրացնել Կանխիկ/Անկանխիկ դաշտը oType արժեքով
    Call Rekvizit_Fill("Document", 1, "General", "CASHORNO", oType)
  
    GiveOverdradt_ISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Սեղմել "Կատարել" կոճակը 
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    BuiltIn.delay(2000)
    
    'Վերցնել "Կանխիկ  ելք " փաստաթուղթի համարը
    Num = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TextC").Text
    'Սեղմել "Կատարել" կոճակը - Պետք է հայտնվի հաղորդագրություն "Սև ցուցակ" ուղրկելու մասին 
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    'Սեղմել "Կատարել" կոճակը
    Call ClickCmdButton(5, "Î³ï³ñ»É")

    'Փակել "Կանխիկ ելք փաստաթղթի տպելու ձևը" պատուհանը
    BuiltIn.delay(1000)
    wMDIClient.VBObject("FrmSpr").Close
    Builtin.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
  
      ''SQL ստուգում Օվերդրաֆտ տրամադրելուց հետո:   
      BuiltIn.Delay(delay_small) 
        ''CONTRACTS
        QueryString = "select count(*) from CONTRACTS where fDGISN =" & .fBASE &_
                        "and fDGAGRTYPE = 'C' and fDGMODTYPE = 3 and fDGAGRKIND = '8L'" &_
                        "and fDGSTATE = 7 and fDGSUMMA = 100000.00 and fDGALLSUMMA = 0.00"
        ExpSQLValue = 1
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If
    
        ''FOLDERS
        QueryString = "select count(*) from FOLDERS where fISN = " & GiveOverdradt_ISN
        ExpSQLValue = 5
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If 
        
        ''HI
        QueryString = "select count(*) from HI where fBASE = " & .fBASE &_
                          "and fSUM = 100000.00 and fCURSUM = 100000.00 and fTYPE = 02"
        ExpSQLValue = 2
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If

        ''HIF
        QueryString = "select count(*) from HIF where fBASE= " & .fBASE
        ExpSQLValue = 19
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If

  
    ''18.Մուտք գործել "Հաճախորդի սպասարկում և դրամարկղ(ընդլայնված)"
    Call ChangeWorkspace(c_CustomerService)
    
    ''19.Մուտք գործել "Հաճախորդի սպասարկում և դրամարկղ / Աշխատանքային փաստաթղթեր " թղթապանակ - "Կանխիկ ելք " փաստաթուղթը պետք է առկա լինի :
    Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    Call Rekvizit_Fill("Dialog", 1, "General", "PERN", .Date) 
    Call Rekvizit_Fill("Dialog", 1, "General", "PERK", .Date) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.delay(2000)
    
    Name = Num
    NameLen = 6
    ColNum = 2
    Pttel = ""
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If Not IfExists then
       Call Log.Error("Կանխիկ ելք փաստաթուղթը չի գտնվել") 
       Exit Sub
     End If
  
    ''20."Կանխիկ ելք" փաստաթուղթը ուղարկել հաստատման
    Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendtoVerBL)
    Sys.Process("Asbank").VBObject("frmAsMsgBox").VBObject("cmdButton").ClickButton
    wMDIClient.VBObject("frmPttel").Close  
  
    ''21.Մուտք գործել "Սև ցուցակ հաստատող ԱՇՏ/Հաստատվող վճարային փաստաթղթեր"
    Call ChangeWorkspace(c_BLVerifyer)
    Call wTreeView.DblClickItem("|§ê¨ óáõó³Ï¦ Ñ³ëï³ïáÕÇ ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
   
    Name = Num
    NameLen = 6
    ColNum = 1
    Pttel = ""
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If Not IfExists then
       Call Log.Error("Կանխիկ ելք փաստաթուղթը չի գտնվել") 
       Exit Sub
    End If
  
    ''22.Վավերացնել "Կանխիկ ելք" փաստաթուղթը
     Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToConfirm)
    Call ClickCmdButton(1, "Ð³ëï³ï»É")
     Builtin.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close  
  
    ''23.Մուտք գործել "Հաստատող 1 ԱՇՏ/Հաստատվող վճարյին փաստաթղթեր"
    Call ChangeWorkspace(c_Verifier1)
    
    Dim VerificationDoc
    Set VerificationDoc = New_VerificationDocument()
        VerificationDoc.User = "77"
        
    Call GoToVerificationDocument("|Ð³ëï³ïáÕ I ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ",VerificationDoc)
    Builtin.Delay(2000)
  
    Name = Num
    NameLen = 6
    ColNum = 3
    Pttel = ""
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If Not IfExists then
       Call Log.Error("Կանխիկ ելք փաստաթուղթը չի գտնվել") 
       Exit Sub
    End If
  
    ''24.Վավերացնել "Կանխիկ ելք" փաստաթուղթը
     Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToConfirm)
    Call ClickCmdButton(1, "Ð³ëï³ï»É")
    wMDIClient.VBObject("frmPttel").Close
  
    ''25.Մուտք գործել "Օվերդրաֆտ տղաբաշխված" 
    Call ChangeWorkspace(c_Overdraft)
  
    Call Log.Message("Օվերդրաֆտի տոկոսների հաշվարկ",,,attr)
    opDate = "150518"
    CalcDoc_ISN = Overdraft_Percent_Accounting(.DocNum, opDate)

    Call Log.Message("Արդյունավետ տոկոսադրույք փաստաթղթի ստեղծում",,,attr) 
    IntDate = "150518"
    IntRate = "12.0000" 
    RealRate = "12.0000"
    InterestRateDoc_ISN = InterestRate(IntDate, IntRate, RealRate) 
  
      'SQL ստուգում տոկոսների հաշվարկից հետո: 
        ''HIF
        QueryString = "select count(*) from HIF where fBASE = " & InterestRateDoc_ISN &_
                       "and fSUM = 12.00 and fCURSUM = 365.00"
        ExpSQLValue = 2
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If
      
    ''28.Փաստաթղթի համար կատարել "Գործողություններ/Բոլոր գործողություններ/Դիտում և խմբագրում/Տոկոսադրույքներ/Արդյունավետ տոկոսադրույք" գործողությունը 
    BuiltIn.delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" & c_Percentages & "|" & c_EffRate)
    Call Rekvizit_Fill("Dialog", 1, "General", "START", IntDate) 
    Call Rekvizit_Fill("Dialog", 1, "General", "END", IntDate) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")

    If wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").ApproxCount = 0 Then
      Call Log.Error("Արդյունավետ տոկոսադրույք փաստաթուղթը բացակայում է:")
    End If
   
    ''29.Ստուգել "Արդյունավետ տոկոսադրույք" սյան արժեքը 
    Name = IntRate
    NameLen = 7
    ColNum = 3
    Pttel = "_2"
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If Not IfExists then
       Call Log.Error("Արդյունավետ տոկոսադրույք սյան արժեքի սխալ:") 
       Exit Sub
    End If
  
    ''30.Ստուգել "Փաստացի տոկոսադրույք" սյան արժեքը 
    Name = RealRate
    NameLen = 7
    ColNum = 4
    Pttel = "_2"
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If Not IfExists then
       Call Log.Error("Փաստացի տոկոսադրույք սյան արժեքի սխալ:") 
       Exit Sub
    End If
  
    Builtin.Delay(1000)
    wMDIClient.VBObject("frmPttel_2").Close
    Builtin.Delay(1000)
    wMDIClient.VBObject("frmPttel").Close
  
    ''31.Մուտք գործել "Պայմանագրերի ամփոփում " թղթապանակ 
    Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ (ø»ß³íáñí³Í)")
    Call Rekvizit_Fill("Dialog", 1, "General", "RDATE", IntDate) 
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", .DocNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.delay(2000)
  
    ''32.Ստուգել "Արդյունավետ տոկոսադրույք" սյան արժեքը 
    Name = IntRate
    NameLen = 7
    ColNum = 32
    Pttel = ""
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If Not IfExists then
       Call Log.Error("Արդյունավետ տոկոսադրույք սյան արժեքի սխալ:") 
       Exit Sub
    End If
  
    ''33.Ստուգել "Փաստացի տոկոսադրույք" սյան արժեքը 
    Name = RealRate
    NameLen = 7
    ColNum = 33
    Pttel = ""
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If Not IfExists then
       Call Log.Error("Փաստացի տոկոսադրույք սյան արժեքի սխալ:") 
       Exit Sub
    End If
  
    Builtin.Delay(1000)
    wMDIClient.VBObject("frmPttel").Close
   
    Call Log.Message("Կատարել պարտքերի մարումը ժամկետից շուտ",,,attr)
    opDate = "160518"
    opSum = "100000"
    RepayDoc_ISN = Overdraft_Repayment_Operation(.DocNum,opDate,opSum, Null, Null)

        ''SQL ստուգում Օվերդրաֆտի պարտքերի մարումից հետո:
        BuiltIn.Delay(delay_small)
      
        ''AGRSCHEDULEVALUES
        QueryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN = " & .fBASE 
        ExpSQLValue = 50
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If
      
        ''HI
        QueryString = "select count(*) from HI where fBASE = " & RepayDoc_ISN &_
                       "and ((fSUM = 100000.00 and fCURSUM = 100000.00)" &_
                       "or (fSUM = 821.90 and fCURSUM = 821.90))"
        ExpSQLValue = 5
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If
      
        ''HIR
        QueryString = "select count(*) from HIR where fBASE= " & RepayDoc_ISN &_
                          "and (fCURSUM = 100000.00 or fCURSUM = 821.90 or fCURSUM = 8333.30)"
        ExpSQLValue = 4
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If
      
        ''HIRREST
        QueryString = "select count(*) from HIRREST where fOBJECT = " & .fBASE &_
                          "and fLASTREM = 0.00 and (fPENULTREM = 100000.00 or fPENULTREM = 821.90 or fPENULTREM = 0.00) and fSTARTREM = 0.00"
        ExpSQLValue = 4
        colNum = 0
        SQL_IsEqual = CheckDB_Value(QueryString, ExpSQLValue, colNum)
        If Not SQL_IsEqual Then
          Log.Error("QueryString = " & QueryString & ":  Expected result = " & ExpSQLValue)
        End If
   
  
    ''37.Ստուգել, որ մնացորդ զրոյացած լինի
    Name = "0.00"
    NameLen = 4
    ColNum = 3
  '  Pttel = "_2"
    Pttel = ""
    IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    If Not IfExists then
       Call Log.Error("Օվերդրաֆտի մնացորդ չի զրոյացել:") 
       Exit Sub
    End If
  
    ''38.Փաստաթղթի նկատմամբ կատարել "Գործողություններ/Բոլոր գործողություններ/Տեղեկանքներ/Ընդհանուր դիտում" - Պետք է հայտվի "Պայմանգրի դիտում" հաշվետվությունը :
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_References & "|" & c_CommView)
    Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("TDBDate").Keys(opDate & "[Tab]")
    Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("CmdOK").ClickButton 
  
    If Not wMDIClient.VBObject("FrmSpr").Exists then
      Call Log.Error("Պայմանգրի դիտում հաշվետվությունը չի հայտնվել:")
    End If
    Builtin.Delay(1000)
    wMDIClient.VBObject("FrmSpr").Close
    BuiltIn.delay(2000)
    wMDIClient.VBObject("frmPttel").Close

  '--------------------------------------------------------------------------------------------      
    PayerCode  = "00000668"
    IntDate = "150518"
  
    Call Log.Message("Ջնջել բոլոր փաստաթղթերը ",,,attr)
   'Մուտք գործել "Օվերդրաֆտ (տեղաբաշխված)/Օվերդրաֆտ ունեցող հաշիվներ"
    FolderName = "|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
    Call wTreeView.DblClickItem(FolderName & "úí»ñ¹ñ³ýï áõÝ»óáÕ Ñ³ßÇíÝ»ñ")
    Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", .CalcAcc)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    '"Գործողություններ/Բոլոր գործողություններ/Թղթապանակներ/Պայմանագրի թղթապանակ"
    If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 0 Then
      Builtin.Delay(1000)
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
      Name = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
      NameLen = 30
      ColNum = 0
      Pttel = "_2"
      IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)

      If IfExists Then
        'Ջնջել Օվերդրաֆտի մարումը
        Date = "160518"
        Typ = "22"
        Key = "0"
        Call DeleteD(Date, Typ, Key)
    
        'Ջնջել Տոկոսի հաշվարկումը
        Date = "150518"
        Typ = "51"
        Key = "0"
        Call DeleteD(Date, Typ, Key)
      
        Builtin.Delay(1000)
        wMDIClient.VBObject("frmPttel_2").Close  
        BuiltIn.delay(1000)
        wMDIClient.VBObject("frmPttel").Close
  
        'Ջնջել "Կանխիկ ելք"-ը
        'Մուտք գործել "Հաճախորդի սպասարկում և դրամարկղ / Հաշվառված վճարային փաստաթղթեր"
        Call ChangeWorkspace(c_CustomerService)
        Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
        Call Rekvizit_Fill("Dialog", 1, "General", "PERN", DateS) 
        Call Rekvizit_Fill("Dialog", 1, "General", "PERK", DateF) 
        Call Rekvizit_Fill("Dialog", 1, "General", "CLICODE", PayerCode) 
        Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", PaymentDocType)
        Call ClickCmdButton(2, "Î³ï³ñ»É")
        BuiltIn.delay(2000)
        
        If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 1 Then
        Name = "úí»ñ¹ñ³ýïÇ ïñ³Ù³¹ñáõÙ"
        NameLen = 21
        ColNum = 9
        Pttel = ""
        Exists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    
          If Exists Then
            Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
            Call ClickCmdButton(3, "²Ûá")
            Sys.Process("Asbank").VBObject("frmAsMsgBox").VBObject("cmdButton").ClickButton
          End If
        End If 
        BuiltIn.delay(2000)
        wMDIClient.VBObject("frmPttel").Close
    
        'Ջնջել "Աշխատանքային փաստաթղթեր"-ից
        'Մուտք գործել "Հաճախորդի սպասարկում և դրամարկղ / Աշխատանքային փաստաթղթեր"
        Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
  
        Call Rekvizit_Fill("Dialog", 1, "General", "PERN", "^A[Del]" & DateS) 
        Call Rekvizit_Fill("Dialog", 1, "General", "PERK", "^A[Del]" & DateF)  
        Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", PaymentDocType)
        Call ClickCmdButton(2, "Î³ï³ñ»É")
      
        If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 1 Then
          Name = "úí»ñ¹ñ³ýïÇ ïñ³Ù³¹ñáõÙ"
          NameLen = 21
          ColNum = 12
          Pttel = ""
          Exists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
    
          If Exists Then
            Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
            Call ClickCmdButton(3, "²Ûá")
            Call ClickCmdButton(5, "²Ûá")
          End If
        End If 
        BuiltIn.delay(2000)
        wMDIClient.VBObject("frmPttel").Close

    
        'Պայմանագրի թղթապանակից Ջնջել "Գումարի տրամադրում..."
        Call ChangeWorkspace(c_Overdraft)
        'Մուտք գործել "Օվերդրաֆտ (տեղաբաշխված)/Օվերդրաֆտ ունեցող հաշիվներ"
        FolderName = "|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
        Call wTreeView.DblClickItem(FolderName & "úí»ñ¹ñ³ýï áõÝ»óáÕ Ñ³ßÇíÝ»ñ")
        Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", CalcAcc)
        Call ClickCmdButton(2, "Î³ï³ñ»É")
        '"Գործողություններ/Բոլոր գործողություններ/Թղթապանակներ/Պայմանագրի թղթապանակ"
        If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 0 Then  
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
   
          '''Պայմանագրի թղթապանակից Ջնջել "Գումարի տրամադրում..."
  
          Name = "¶áõÙ³ñÇ ïñ³Ù³¹ñáõÙ"
          NameLen = 18
          ColNum = 0
          Pttel = "_2"
          Exists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
          If Exists Then
            Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
            Call ClickCmdButton(3, "²Ûá")
          End If
      
          'Ջնջել "Արդյունավետ տոկոսադրույքը"
          Name = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
          NameLen = 30
          ColNum = 0
          Pttel = "_2"
          IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)

          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" & c_Percentages & "|" & c_EffRate)
          Call Rekvizit_Fill("Dialog", 1, "General", "START", IntDate) 
          Call Rekvizit_Fill("Dialog", 1, "General", "END", IntDate) 
          Call Rekvizit_Fill("Dialog", 1, "CheckBox", "ONLYCH", 1)
          Call ClickCmdButton(2, "Î³ï³ñ»É")
          BuiltIn.delay(2000)
          
          If wMDIClient.VBObject("frmPttel_3").VBObject("tdbgView").ApproxCount = 1 Then
            Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
            Call ClickCmdButton(3, "²Ûá")
          End IF
        
          BuiltIn.delay(2000)
          wMDIClient.VBObject("frmPttel_3").Close
      
          'Ջնջել Գրավի առարկան
          Name = "¶ñ³íÇ å³ÛÙ³Ý³·Çñ"
          NameLen = 16
          ColNum = 0
          Pttel = "_2"
          IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
          If IfExists then
            Call wMainForm.MainMenu.Click(c_AllActions)
            Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
      
            Name = "¶ñ³íÇ ³é³ñÏ³"
            NameLen = 12
            ColNum = 0
            Pttel = "_3"
            IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
            If IfExists then
               Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
               Call ClickCmdButton(3, "²Ûá")           
            End If
            Name = "¶ñ³íÇ å³ÛÙ³Ý³·Çñ"
            NameLen = 16
            ColNum = 0
            Pttel = "_3"
            IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
            Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)           
            Call ClickCmdButton(3, "²Ûá")
            wMDIClient.VBObject("frmPttel_3").Close
          End If 
      
          Name = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
          NameLen = 30
          ColNum = 0
          Pttel = "_2"
          IfExists = Find_Doc_By(Name, NameLen,ColNum, Pttel)
          If IfExists then
            Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)           
            Call ClickCmdButton(3, "²Ûá")
          End If  
       
          BuiltIn.delay(2000)
          wMDIClient.VBObject("frmPttel_2").Close
        End If
      End If
    End IF  
    BuiltIn.delay(2000)
    wMDIClient.VBObject("frmPttel").Close
  '--------------------------------------------------------------------------------------------      
  End With
  Call Close_AsBank()
End Sub