'USEUNIT Library_Common 
'USEUNIT Library_Colour
'USEUNIT Constants
'USEUNIT Subsystems_Special_Library
'USEUNIT Mortgage_Library
'USEUNIT Library_Contracts
'USEUNIT Library_CheckDB
'USEUNIT Deposit_Library

Option Explicit
'Test Case Id - 155602

Dim GroupCreation,DepositContractsStandard,DepositBoxRentalFilter
Dim NewDepositCondition,DepositRentalAgr_ForCheck,DepositRental
Dim Deposit_Box_WorkingAgr_Filter,WorkingAgr_Filter,DepositBoxChange
Dim Deposit_Box_Filter,ServContIsn,Query,fKEY,ChangeIsn,DepBoxIsn
Dim fBODY,dbFOLDERS(6),dbHI2,PenaltyServContIsn,RegisterForDepositBox

'Պահատեղերի ԱՇՏ
Sub Check_DepositRenaltyCount()
    
    Dim sDATE,fDATE
    
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20020101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Login("ARMSOFT")
    
    Call Test_InitializeRenaltyCount()
    
    'Մուտք գործել "Պահատեղերի ԱՇՏ"
    Call ChangeWorkspace(c_Deposit_Boxes)

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''--- Կարարել Պահատեղերի խմբային ստեղծում գործողությունը ---'''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Group Creation Of Deposit Boxes ---",,,DivideColor
    
    Call GroupCreationDialog(GroupCreation,3)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''--- Մուտք գործել "Պահատեղի պայմանագրի ստանդարտներ" թղթապանակ ---'''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Call GoTo_DepositContractsStandards(DepositContractsStandard)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''--- Աջ կլիկ(Ստեղծել Պահատեղ վարձ.պայմանագիր) ---'''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Right Click(Create Deposit box rental Agreement/Ստեղծել Պահատեղ վարձ.պայմանագիր) ---",,,DivideColor
    
    Call Create_DepositRental(c_Deposit_Rental,NewDepositCondition,DepositRentalAgr_ForCheck,DepositRental)
    Call Close_Pttel("frmPttel")
    
    Log.Message "SQL Check After Right Click(Create Deposit box rental Agreement/Ստեղծել Պահատեղ վարձ.պայմանագիր)",,,SqlDivideColor
    Log.Message "fISN = "& DepositRental.Isn,,,SqlDivideColor
    
     Call SQL_Initialize_DepositRenaltyCount(DepositRental.Isn)
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  AGRNUM:0000001  DATE:20190101  CLICODE:00000014  NAME:äáÕáëÛ³Ý äáÕáë  ENAME:Pogosyan Pogos  ACC:77787753311  FORCEACCCON:0  FORCECLISCH:0  USECLISCH:1  STANDARD:002  DURATION:03  STARTDATE:20190101  ENDDATE:20190201  SUMMA:10000  VATMETH:1  PAYTYPE:2  NONWD:1  FORCEAPVAL:0  AUTOPROL:1  REMSMS:0  REMEMAIL:1  REMIB:0  DEPSUMMA:5555  DELAYST:001  PENALTYST:002  DBOXTYPE:011  DBOXNUMBER:LP0001  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:01  AUTOPROLONGED:0  DOCDATE:20190101  JOINT:0  ADDINFO:Check_DepositRenaltyCount  USERID:77  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","1",fBODY,1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",DepositRental.Isn,8)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
        
    'SQL Ստուգում HI2 աղուսյակում 
    Call CheckQueryRowCount("HI2","fBASE",DepositRental.Isn,1)

    'SQL Ստուգում HIREST2 աղուսյակում 
    Call CheckQueryRowCount("HIREST2","fOBJECT",DepositRental.Isn,1)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,DepositRental.Isn,"1.00","XXX","0.00", 1)
    
    'SQL Ստուգում PARAMS աղուսյակում 
    Call CheckQueryRowCount("PARAMS","fPARID","DBOXAGRNUM          ",1)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''--- Պահատեղի աշխատանքային փաստաթղթեր-ից կատարել Տրամադրում հետաձգ. վճարումով գործողություն ---''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Provide With Delayed Payment/Տրամադրում հետաձգ. վճարումով Action ---",,,DivideColor
    
    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 

    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ProvideWithDelayedPaym)
    BuiltIn.Delay(2000)
    Call ClickCmdButton(5, "OK")
    Call Close_Pttel("frmPttel")
    
    Log.Message "SQL Check After Provide With Delayed Payment/Տրամադրում հետաձգ. վճարումով Action",,,SqlDivideColor
    
    Query = "select fISN from DOCP where fPARENTISN = '" & DepositRental.Isn &"'"
    ServContIsn = my_Row_Count(Query) 
    Query = "select fKEY from FOLDERS where fFOLDERID = 'ServCont' and fISN = " & ServContIsn
    fKEY = my_Row_Count(Query)
    Log.Message "fISN = "& ServContIsn,,,SqlDivideColor
    
    Call SQL_Initialize_DepositRenaltyCount(ServContIsn) 
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  CONTCODE:"&fKEY&"  TYPE:21  PCSTAND:001  CLICODE:00000014  NAME:äáÕáëÛ³Ý äáÕáë  ENAME:Pogosyan Pogos  ACC:77787753311  CUR:000  OPENDATE:20190101  PAYDATE:20190101  ENDDATE:20190101  PERIOD:0/1  NONWORKDAYS:1  SERVFEE:10000  VATMETH:1  ACSBRANCH:00  ACSDEPART:2  ACSTYPE:00  FEEFROMCARD:0  TAKEAVLB:0  FEETYPE:1  ADDINFO:ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 0000001  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",ServContIsn,1)
    Call CheckDB_DOCS(ServContIsn,"ServCont ","2",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում ¶»ñ³Í³ËëÇ Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³Í-Ի համար
    Call CheckQueryRowCount("DOCLOG","fISN",ServContIsn,2)
    Call CheckDB_DOCLOG(ServContIsn,"77","N","1","",1)
    Call CheckDB_DOCLOG(ServContIsn,"77","C","2","",1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",ServContIsn,1)
    Call CheckDB_DOCSG(ServContIsn,"FEEACCS","0","FEEACCCODE","1",1)
    
    'SQL Ստուգում DOCP աղուսյակում  
    Call CheckQueryRowCount("DOCP","fPARENTISN",DepositRental.Isn,1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    dbFOLDERS(4).fKEY = fKEY
    Call CheckQueryRowCount("FOLDERS","fISN",ServContIsn,2)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
    Call CheckDB_FOLDERS(dbFOLDERS(4),1)
    
    'SQL Ստուգում ACCOUNTS աղուսյակում 
    Call CheckQueryRowCount("ACCOUNTS","fLLIMIT","5555.00",1)
    
    'SQL Ստուգում HI աղուսյակում  
    Call CheckQueryRowCount("HI","fBASE",DepositRental.Isn,1)
    Call Check_HI_CE_accounting ("20190101",DepositRental.Isn, "LL", "1733802","0.00", "000", "5555.00", "DEP", "C")
    
    'SQL Ստուգում HI2 աղուսյակում 
    Call CheckQueryRowCount("HI2","fBASE",DepositRental.Isn,2)
    
    Set dbHI2 = New_DB_HI2()
    With dbHI2
        .fDATE = "2019-01-01"
        .fTYPE = "BA"
        .fOBJECT = DepositRental.Isn
        .fGLACC = DepositRental.Isn
        .fSUM = "1.00"
        .fCURSUM = "1.00"
        .fOP = "PVD"
        .fBASE = DepositRental.Isn
        .fDBCR = "D"
        .fBASEBRANCH = "00"
        .fBASEDEPART = "1"
    End With
    Call CheckDB_HI2(dbHI2,1)
    
    Query = "Select fOBJECT from HI2 where fTYPE = 'BB' and fBASE = " & DepositRental.Isn
    DepBoxIsn = my_Row_Count(Query)
    
    dbHI2.fTYPE = "BB"
    dbHI2.fOBJECT = DepBoxIsn
    dbHI2.fOP = "OCP"
    Call CheckDB_HI2(dbHI2,1)
    
    'SQL Ստուգում HIREST  աղուսյակում 
    Call CheckDB_HIREST("01", "1733802","-5555.00","XXX","-999999999999.99",1)
    Call CheckDB_HIREST("LL", "1733802","0.00","000","-5555.00",1)
    
    'SQL Ստուգում HIREST2 աղուսյակում 
    Call CheckQueryRowCount("HIREST2","fOBJECT",DepositRental.Isn,3)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,DepositRental.Isn,"0.00","","0.00", 1)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,DepositRental.Isn,"1.00","","1.00", 1)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,DepositRental.Isn,"1.00","XXX","0.00", 1)
    Call CheckQueryRowCount("HIREST2","fGLACC",DepositRental.Isn,6)
    Call CheckDB_HIREST2("BB",DepBoxIsn, DepositRental.Isn,"0.00","","0.00", 1)
    Call CheckDB_HIREST2("BB",DepBoxIsn, DepositRental.Isn,"1.00","","1.00", 1)
    Call CheckDB_HIREST2("BB",DepBoxIsn, DepositRental.Isn,"1.00","XXX","0.00", 1)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''- Պահատեղի Վարձակալության պայմանագրերից-ից կատարել "Փոխել պահատեղը" գործողությունը -''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''  
    Log.Message "Check RC (Change Deposit Box/Փոխել պահատեղը) Action",,,DivideColor 
    
    Call GoTo_DepositBoxRental(DepositBoxRentalFilter) 
    Call RC_ChangeDepositBox("0000001","010119","LP0002") 
    Call Close_Pttel("frmPttel")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''-- Պայմանագիրը ուղարկել Ռեեստր --'''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''      
    Log.Message "-- Send to Register --",,,DivideColor        
    
    Call GoTo_AccRegisterForDepositBox(RegisterForDepositBox)
    Call EditRegisterStatus("1","àõÕ³ñÏí³Í")
    Call Close_Pttel("frmPttel")
    BuiltIn.Delay(2000)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''--- Պահատեղի աշխատանքային փաստաթղթեր-ից կատարել Վավերացնել գործողություն Փոխել պահատեղը պայմանագրի համար ---'''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- To Confirm For Change Deposit Box ---",,,DivideColor
    
    Call GoTo_DepositBoxes_WorkingAgr(WorkingAgr_Filter) 
    
    If WaitForPttel("frmPttel") Then
      If SearchInPttel("frmPttel",3, "0000001") Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_ToConfirm)
          BuiltIn.Delay(2000)
          'ISN-ի վերագրում փոփոխականին
          ChangeIsn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
          Call ClickCmdButton(1, "Ð³ëï³ï»É")
      End If
      Call Close_Pttel("frmPttel")
    Else
        Log.Error "Can Not Open Deposit Working Agreement pttel",,,ErrorColor      
    End If   
    
    Log.Message "SQL Check After Send To Verify For Change Deposit Box/Փոխել պահատեղը",,,SqlDivideColor
    Log.Message "fISN = "& ChangeIsn,,,SqlDivideColor
    
    Call SQL_Initialize_DepositRenaltyCount(ChangeIsn)
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  ACSBRANCH:00  ACSDEPART:1  USERID:77  DATE:20190101  AGRNUM:0000001  DBOXTYPE:011  OLDDBNUM:LP0001  NEWDBNUM:LP0002  VISIT:0  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",ChangeIsn,1)
    Call CheckDB_DOCS(ChangeIsn,"DBoxChng ","2",fBODY,1)
  
    'SQL Ստուգում DOCLOG աղուսյակում ¶»ñ³Í³ËëÇ Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³Í-Ի համար
    Call CheckQueryRowCount("DOCLOG","fISN",ChangeIsn,3)
    Call CheckDB_DOCLOG(ChangeIsn,"77","N","1","",1)
    Call CheckDB_DOCLOG(ChangeIsn,"77","W","2","",1)
    Call CheckDB_DOCLOG(ChangeIsn,"77","T","2","",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",ChangeIsn,2)
    dbFOLDERS(5).fFOLDERID = "DBAgr." & DepositRental.Isn
    Call CheckDB_FOLDERS(dbFOLDERS(5),1)
    Call CheckDB_FOLDERS(dbFOLDERS(6),1)
    
    'SQL Ստուգում HI2 աղուսյակում 
    Call CheckQueryRowCount("HI2","fBASE",ChangeIsn,3)
    
    Set dbHI2 = New_DB_HI2()
    With dbHI2
        .fDATE = "2019-01-01"
        .fTYPE = "BA"
        .fOBJECT = DepositRental.Isn
        .fGLACC = DepositRental.Isn
        .fSUM = "0.00"
        .fCURSUM = "0.00"
        .fOP = "DBC"
        .fBASE = ChangeIsn
        .fDBCR = "D"
        .fBASEBRANCH = "00"
        .fBASEDEPART = "1"
    End With
    
    Call CheckDB_HI2(dbHI2,1)
         dbHI2.fTYPE = "BB"
         dbHI2.fOBJECT = DepBoxIsn
         dbHI2.fSUM = "1.00"
         dbHI2.fCURSUM = "1.00"
         dbHI2.fOP = "RLS"
         dbHI2.fDBCR = "C"
         
    Call CheckDB_HI2(dbHI2,1)
         Query = "Select fOBJECT from HI2 where fOP = 'OCP' and fBASE =  " & ChangeIsn
         DepBoxIsn = my_Row_Count(Query)
         dbHI2.fOBJECT = DepBoxIsn
         dbHI2.fSUM = "1.00"
         dbHI2.fCURSUM = "1.00"
         dbHI2.fOP = "OCP"
         dbHI2.fDBCR = "D"
    Call CheckDB_HI2(dbHI2,1)
    
    Call CheckQueryRowCount("HIREST2","fGLACC",DepositRental.Isn,9)
    Call CheckDB_HIREST2("BB",DepBoxIsn, DepositRental.Isn,"0.00","","0.00", 1)
    Call CheckDB_HIREST2("BB",DepBoxIsn, DepositRental.Isn,"1.00","","1.00", 1)
    Call CheckDB_HIREST2("BB",DepBoxIsn, DepositRental.Isn,"1.00","XXX","0.00", 1)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''- Պահատեղի Վարձակալության պայմանագրերից-ից կատարել "Փոխկապ. սխեմայի խմբագրում" գործողությունը -'''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "Check RC (Edit Conn Schema/Փոխկապ. սխեմայի խմբագրում) Action",,,DivideColor 
    
    DepositBoxRentalFilter.DepositBoxNumber = "LP0002"
    Call GoTo_DepositBoxRental(DepositBoxRentalFilter) 
    Call RC_EditConnSchema("0000001","002",0) 
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_View)
    BuiltIn.Delay(2000)
    'Ստուգում է "Այլ հաշիվներ(փոխկապ. սխեմա)" դաշտի արժեքը
    Call Compare_Two_Values("Այլ հաշիվներ(փոխկապ. սխեմա)",Get_Rekvizit_Value("Document",1,"Mask","ACCCONNECT"),"002")
    Call ClickCmdButton(1, "OK")
    
    Log.Message "SQL Check After RC (Edit Conn Schema/Փոխկապ. սխեմայի խմբագրում) Action",,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  AGRNUM:0000001  DATE:20190101  CLICODE:00000014  NAME:äáÕáëÛ³Ý äáÕáë  ENAME:Pogosyan Pogos  ACC:77787753311  FORCEACCCON:0  FORCECLISCH:0  ACCCONNECT:002  USECLISCH:1  STANDARD:002  DURATION:03  STARTDATE:20190101  ENDDATE:20190201  SUMMA:10000  VATMETH:1  PAYTYPE:2  NONWD:1  FORCEAPVAL:0  AUTOPROL:1  REMSMS:0  REMEMAIL:1  REMIB:0  DEPSUMMA:5555  DELAYST:001  PENALTYST:002  DBOXTYPE:011  DBOXNUMBER:LP0001  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:01  AUTOPROLONGED:0  DOCDATE:20190101  JOINT:0  ADDINFO:Check_DepositRenaltyCount  USERID:77  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","7",fBODY,1)
  
    'SQL Ստուգում DOCLOG աղուսյակում ¶»ñ³Í³ËëÇ Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³Í-Ի համար
    Call CheckQueryRowCount("DOCLOG","fISN",DepositRental.Isn,7)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","N","1","",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","T","1","",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","M","1","CREATED",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","C","3","",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","M","3","PROCESSED",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","C","7","",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","E","7","",1)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''- Պահատեղի Վարձակալության պայմանագրերից-ից կատարել "Տույժի հաշվարկում" գործողությունը -'''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "Check RC (Penalty Count/Տույժի հաշվարկում) Action",,,DivideColor 
    
    Call RC_PenaltyCount("0000001","020219") 
    Call Close_Pttel("frmPttel")
    
    Log.Message "SQL Check After RC (Penalty Count/Տույժի հաշվարկում) Action",,,SqlDivideColor
    
    Query = "Select * from DOCP WHERE fPARENTISN = "& DepositRental.Isn &" and fISN != " & ServContIsn
    PenaltyServContIsn = my_Row_Count(Query) 
    
    Query = "select fKEY from FOLDERS where fFOLDERID = 'ServCont' and fISN = " & PenaltyServContIsn
    fKEY = my_Row_Count(Query)
    
    Log.Message "fISN = "& PenaltyServContIsn,,,SqlDivideColor
    
    Call SQL_Initialize_DepositRenaltyCount(PenaltyServContIsn) 
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  CONTCODE:"&fKEY&"  TYPE:21  PCSTAND:002  CLICODE:00000014  NAME:äáÕáëÛ³Ý äáÕáë  ENAME:Pogosyan Pogos  ACC:77787753311  CUR:000  OPENDATE:20190202  PAYDATE:20190202  PERIOD:1/0  NONWORKDAYS:1  SERVSCHEM:005  VATMETH:1  ACSBRANCH:00  ACSDEPART:2  ACSTYPE:00  ACCCONNECT:002  FEEFROMCARD:0  TAKEAVLB:0  FEETYPE:2  ADDINFO:ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 0000001  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",PenaltyServContIsn,1)
    Call CheckDB_DOCS(PenaltyServContIsn,"ServCont ","2",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում ¶»ñ³Í³ËëÇ Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³Í-Ի համար
    Call CheckQueryRowCount("DOCLOG","fISN",PenaltyServContIsn,2)
    Call CheckDB_DOCLOG(PenaltyServContIsn,"77","N","1","",1)
    Call CheckDB_DOCLOG(PenaltyServContIsn,"77","C","2","",1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",PenaltyServContIsn,1)
    Call CheckDB_DOCSG(PenaltyServContIsn,"FEEACCS","0","FEEACCCODE","1",1)
    
    'SQL Ստուգում DOCP աղուսյակում  
    Call CheckQueryRowCount("DOCP","fPARENTISN",DepositRental.Isn,2)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    dbFOLDERS(4).fSPEC = "00000014777877533110002100220190202000000002019020200000000 1/  0005           002ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 0000001                             100  02"
    dbFOLDERS(4).fKEY = fKEY
    Call CheckQueryRowCount("FOLDERS","fISN",PenaltyServContIsn,2)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
    Call CheckDB_FOLDERS(dbFOLDERS(4),1)
    
    'SQL Ստուգում PARAMS աղուսյակում 
    Call CheckQueryRowCount("PARAMS","fPARID","SERVCONTCODE        ",1)

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Մուտք գործել "Պահատեղի փոփոխություններ" թղթապանակ և հեռացնել ստեղծված փաստաթղթերը---''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
     Log.Message "Delete (Change Deposit Box) Agreement",,,DivideColor 

    Call GoTo_DepositBoxChanges(DepositBoxChange) 
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete)
    BuiltIn.Delay(2000)
    Call MessageExists(1,"Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
    Call ClickCmdButton(3, "²Ûá") 
    Call Close_Pttel("frmPttel")
    
'Քանի որ Ռեեստր ուղարկված պայմանագիրը հնարավոր չի հեռացնել, այդ պատճառով տվյալ տողերը փակված են
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''--- Մուտք գործել "Սպասարկման պայմանագրեր" թղթապանակ և հեռացնել ստեղծված փաստաթղթերը---''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'    Call GoTo_ServiseContracts("00000014") 
'    
'    If SearchInPttel("frmPttel",7, "02/02/19") Then
'        Call wMainForm.MainMenu.Click(c_AllActions)
'        Call wMainForm.PopupMenu.Click(c_ToEdit)
'        'Դատարկել "Հաշիվ" դաշտը
'        Call Rekvizit_Fill("Document",1,"General","ACC","^A[Del]")
'        Call ClickCmdButton(1, "Î³ï³ñ»É")
'    
'        Call wMainForm.MainMenu.Click(c_AllActions)
'        Call wMainForm.PopupMenu.Click(c_Delete)
'        BuiltIn.Delay(2000)
'        Call MessageExists(1,"Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
'        Call ClickCmdButton(3, "²Ûá")
'    Else
'        Log.Error "Can Not find row!",,,ErrorColor
'    End If 
'    
'    If SearchInPttel("frmPttel",7, "01/01/19") Then
'        Call wMainForm.MainMenu.Click(c_AllActions)
'        Call wMainForm.PopupMenu.Click(c_ToEdit)
'        'Դատարկել "Հաշիվ" դաշտը
'        Call Rekvizit_Fill("Document",1,"General","ACC","^A[Del]")
'        Call ClickCmdButton(1, "Î³ï³ñ»É")
'    
'        Call wMainForm.MainMenu.Click(c_AllActions)
'        Call wMainForm.PopupMenu.Click(c_Delete)
'        BuiltIn.Delay(2000)
'        Call MessageExists(1,"Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
'        Call ClickCmdButton(3, "²Ûá")
'    Else
'        Log.Error "Can Not find row!",,,ErrorColor
'    End If 
'    Call Close_Pttel("frmPttel")
'    
'    'SQL Ստուգում DOCS աղուսյակում
'    fBODY = "  AGRNUM:0000001  DATE:20190101  CLICODE:00000014  NAME:äáÕáëÛ³Ý äáÕáë  ENAME:Pogosyan Pogos  ACC:77787753311  FORCEACCCON:0  FORCECLISCH:0  USECLISCH:1  STANDARD:002  DURATION:03  STARTDATE:20190101  ENDDATE:20190201  SUMMA:10000  VATMETH:1  PAYTYPE:2  NONWD:1  FORCEAPVAL:0  AUTOPROL:1  REMSMS:0  REMEMAIL:1  REMIB:0  DEPSUMMA:5555  DELAYST:001  PENALTYST:002  DBOXTYPE:011  DBOXNUMBER:LP0001  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:01  AUTOPROLONGED:0  DOCDATE:20190101  JOINT:0  ADDINFO:Check_DepositRenaltyCount  USERID:77  "
'    fBODY = Replace(fBODY, "  ", "%")
'    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
'    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","1",fBODY,1)
'    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''--- Պահատեղի աշխատանքային փաստաթղթեր-ից հեռացնել փաստաթուղթը ---'''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'    Log.Message "--- DELETE - Deposit Box Working Agreement  ---",,,DivideColor
'    
'    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
'     
'    Set DocForm = wMDIClient.VBObject("frmPttel")
'    If WaitForPttel("frmPttel") Then
'        Call SearchAndDelete("frmPttel", 2, "0000001", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
'        BuiltIn.Delay(2000)
'        Call Close_Pttel("frmPttel")
'    Else
'        Log.Error "Can Not Open Պահատեղի աշխատանքային փաստաթղթե Window",,,ErrorColor      
'    End If     
'    If DocForm.Exists Then
'        Log.Error "Can Not Close Պահատեղի աշխատանքային փաստաթղթե Window",,,ErrorColor
'    End If     

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Պահատեղեր-ից հեռացնել ստեղծված Պահատեղերը ---''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- DELETE - Deposit Box Agreement ---",,,DivideColor     
    
    Call GoTo_DepositBoxes(Deposit_Box_Filter) 
     
    Set DocForm = wMDIClient.VBObject("frmPttel")
    If WaitForPttel("frmPttel") Then
'        Call SearchAndDelete("frmPttel", 0, "LP0001", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
        Call SearchAndDelete("frmPttel", 0, "LP0002", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
        Call SearchAndDelete("frmPttel", 0, "LP0003", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
        BuiltIn.Delay(2000)
        Call Close_Pttel("frmPttel")
    Else
        Log.Error "Can Not Open Պահատեղեր Window",,,ErrorColor      
    End If        
     
    Call Close_AsBank()
End Sub

Sub SQL_Initialize_DepositRenaltyCount(fISN)
        
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1)
      .fFOLDERID = "UsedServContStand"
      .fNAME = "DBoxAgr "
      .fKEY = "001" & fISN
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "ú·ï³·áñÍíáÕ ëå³ë³ñÏÙ³Ý å³ÛÙ³Ý³·ñÇ ëï³Ý¹³ñï"
      .fECOM = "Service contract standard in use"
    End With

    Set dbFOLDERS(2) = New_DB_FOLDERS()
    With dbFOLDERS(2)
      .fFOLDERID = "UsedServContStand"
      .fNAME = "DBoxAgr "
      .fKEY = "002" & fISN
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "ú·ï³·áñÍíáÕ ëå³ë³ñÏÙ³Ý å³ÛÙ³Ý³·ñÇ ëï³Ý¹³ñï"
      .fECOM = "Service contract standard in use"
    End With
    
    Set dbFOLDERS(3) = New_DB_FOLDERS()
    With dbFOLDERS(3)
      .fFOLDERID = "C.1628329"
      .fNAME = "ServCont"
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "1"
      .fCOM = "  êå³ë³ñÏÙ³Ý å³ÛÙ³Ý³·Çñ"
      .fSPEC = "îÇå- ä³ÛÙ³Ý³·ñÇ ïÇå"
      .fECOM = "  Service Contract"
    End With
    
    Set dbFOLDERS(4) = New_DB_FOLDERS()
    With dbFOLDERS(4)
      .fFOLDERID = "ServCont"
      .fNAME = "ServCont"
      .fKEY = ""
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "äáÕáëÛ³Ý äáÕáë"
      .fSPEC = "00000014777877533110002100120190101000000002019010120190101 0/  1                 ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 0000001                             100  01"
      .fECOM = "Pogosyan Pogos"
      .fDCBRANCH = "00"
      .fDCDEPART = "2"
    End With
    
    Set dbFOLDERS(5) = New_DB_FOLDERS()
    With dbFOLDERS(5)
      .fFOLDERID = "DBAgr."
      .fNAME = "DBoxChng"
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "ä³Ñ³ï»ÕÇ ÷á÷áËáõÃÛáõÝ"
      .fSPEC = "ä³Ñ³ï»ÕÇ ÷á÷áËáõÃÛáõÝ (ÐÇÝ å³Ñ³ï»ÕÇ N - LP0001, Üáñ å³Ñ³ï»ÕÇ N - LP0002) - Ð³ëï³ïí³Í"
      .fECOM = "Deposit Box change"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(6) = New_DB_FOLDERS()
    With dbFOLDERS(6)
      .fFOLDERID = "DBC.0000001       "
      .fNAME = "DBoxChng"
      .fKEY = "20190101LP0002      " & Trim(fISN)
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "ä³Ñ³ï»ÕÇ ÷á÷áËáõÃÛáõÝ"
      .fSPEC = "77  LP0001      011      " 
      .fECOM = "Deposit Box change"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
End Sub


Sub Test_InitializeRenaltyCount()
    Set Deposit_Box_Filter = New_Deposit_Boxes_Filter()
    With Deposit_Box_Filter
      .Type1 = "011"
      .Number = ""
      .Division = "00"
      .OccupState = ""
      .AgrInfo = 0
      .ShowClosed = 1
      .View = "DBoxes"
      .FillInto = "0"
    End With

    Set GroupCreation = New_GroupCreationOfDepositBoxes()
    With GroupCreation
        .OpeningDate = "050518"
        .Type1 = "011"
        .Prefix = "LP"
        .Begin = "1"
        .Endd = "3"
        .FillWithZeros = 1
        .UptoDigits = "4"
        .Division = "00"
        .AdditionalInformation = "GroupCreationOfDepositBoxes"
    End With
    
    Set DepositContractsStandard = New_DepositContractsStandards
    With DepositContractsStandard
        .Code = "002"
        .DepositBoxType = "011"
        .ShowClosed = 0
        .View = "DBAgrSts"
        .FillInto = "0"
    End With
    
    Set NewDepositCondition = New_DepositCondition()
    With NewDepositCondition
        .SigningDate = "^A[Del]" & "010119"
        .Duration = "03"
        .EndDate = "01/02/19"
        .DepositBoxNumber = "LP0001"
        .Client = "00000014"
        .PaymentType = "2"
        .ServiceFee = "10,000.00"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With    
        
    Set DepositRentalAgr_ForCheck = New_DepositRentalAgreement()
    With DepositRentalAgr_ForCheck
        .Client = "00000014"
        .Name = "äáÕáëÛ³Ý äáÕáë"
        .EnglishName = "Pogosyan Pogos"
        .OtherAccs = ""
        .UseClientSchema = 0
        .Standard = "002"
        .Duration = "03"
        .StartDate = "01/01/19"
        .EndDate = "01/02/19"
        .ServiceFee = "10,000.00"
        .VatTaxable = "1"
        .PaymentType = "2"
        .NonperformingDaysAvoiding = "1"
        .AutoProlong = 0
        .RemindBySMS = 0
        .EmailAddress = 0
        .IntBank = 0
        .DepositionAmount = "5,000.00"
        .AllowDelayedPayment = 1
        .StandardPay = "001"
        .ServContrStandForPenalCalc = "002"
        .DepositBoxType = "011"
        .Number = "LP0001"
        .ClosingDate = "/  /"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With
    
    Set DepositRental = New_DepositRentalAgreement()
    With DepositRental
        .Agreement = "^A[Del]"&"0000001"
        .Account = "77787753311"
        .UseClientSchema = 1
        .AutoProlong = 1
        .EmailAddress = 1
        .DepositionAmount = "5,555.00"
        .AllowDelayedPayment = 1
        .StandardPay = "001"
        .AdditionalaInfo = "Check_DepositRenaltyCount"
        .GridClient = "00000018"
    End With
    
    Set DepositBoxRentalFilter = New_DepositBoxRental()
    With DepositBoxRentalFilter          
        .Data = "^A[Del]"&"010119"
        .Client = "00000014"
        .AgreementName = "äáÕáëÛ³Ý äáÕáë"
        .DepositBoxNumber = "LP0001"
        .AgreementN = "0000001"
        .Standard = "002"
        .DepositBoxType = "011"
        .ShowDebt = 1
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
        .View = "DBAgrs"
        .FillInto = "0"
    End With
    
    Set Deposit_Box_WorkingAgr_Filter = New_Deposit_Boxes_WorkingAgr()
    With Deposit_Box_WorkingAgr_Filter
        .DataPeriod_Start = "^A[Del]"&"010119"
        .DataPeriod_End = "^A[Del]"&"010120"
        .Executors = "77"
        .DocumentType = "DBoxAgr"
        .Client = "00000014"
        .Agreement = "0000001"
        .DepositBoxNumber = "LP0001"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With
    
    Set WorkingAgr_Filter = New_Deposit_Boxes_WorkingAgr()
    With WorkingAgr_Filter
        .DataPeriod_Start = "^A[Del]"&"010119"
        .DataPeriod_End = "^A[Del]"&"010120"
        .Executors = "77"
        .DocumentType = "DBoxChng"
        .Client = "00000014"
        .Agreement = "0000001"
        .DepositBoxNumber = "LP0002"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With
    
    Set DepositBoxChange = New_DepositBoxChanges()
    With DepositBoxChange
        .DataPeriod_Start = "^A[Del]"&"010119"
        .DataPeriod_End = "^A[Del]"&"020219"
        .AgreementN = "0000001"
        .OldDepositBoxN = "LP0001"
        .NewDepositBoxN = "LP0002"
        .Division= "00"
        .View = "DBChngs"
        .FillInto = "0"
    End With
    
    Set RegisterForDepositBox = New_AccountsRegisterForDepositBox()
    With RegisterForDepositBox
      .RegisterState = ""
      .DepositBoxNumber = ""
      .DepositBoxDivision = "00"
      .ClientCode = "00000014"
      .Division = ""
      .Department = ""
      .AccessType = ""
      .LegPos = ""
      .TaxID = ""
      .Note1 = ""
      .Note2 = ""
      .Note3 = ""
      .ShowClientsData = 1
      .ShowChanges = 1
      .ShowReadyToSends = 0
      .View = "RegBoxes"
      .FillInto = "0"
    End With
End Sub