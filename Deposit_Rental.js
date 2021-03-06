'USEUNIT Library_Common 
'USEUNIT Library_Colour
'USEUNIT Constants
'USEUNIT Subsystems_Special_Library
'USEUNIT Mortgage_Library
'USEUNIT Library_Contracts
'USEUNIT Library_CheckDB
'USEUNIT Deposit_Library

Option Explicit
'Test Case Id - 154223

Dim Deposit_Box_Filter,Deposit_Box,NewDepositCondition
Dim DepositRental,DepositRentalAgr_ForCheck
Dim Deposit_Box_WorkingAgr_Filter,WorkingAgreement
Dim DocForm,dbFOLDERS(12),ISN,fBODY,dbHI2

'Պահատեղերի ԱՇՏ
Sub Check_DepositRental_Agreement()
    
    Dim sDATE,fDATE
     
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20020101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Login("ARMSOFT")

    'Մուտք գործել "Պահատեղերի ԱՇՏ"
    Call ChangeWorkspace(c_Deposit_Boxes)

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''--- Մուտք գործել Պահատեղեր թղթապանակ ---'''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Call Test_InitializeFor_DepositRental()

    Call GoTo_DepositBoxes(Deposit_Box_Filter)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''--- Ստեղծել Պահատեղ ---''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Create New Deposit Boxes ---",,,DivideColor
           
    Call Create_DepositBox(Deposit_Box)
    
    Log.Message "SQL Check After Create Deposit Box",,,SqlDivideColor
    Log.Message "fISN = "& Deposit_Box.Isn,,,SqlDivideColor
    
    Call SQL_Initialize_ForDepositRental(Deposit_Box.Isn) 
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  NUMBER:00001  TYPE:011  OPENDATE:20190101  ACSBRANCH:00  ADDINFO:Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_1111111111111111111111111111111111111111111111Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Depos1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",Deposit_Box.Isn,1)
    Call CheckDB_DOCS(Deposit_Box.Isn,"DBOX     ","1",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",Deposit_Box.Isn,1)
    Call CheckDB_DOCLOG(Deposit_Box.Isn,"77","N","1"," ",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",Deposit_Box.Isn,1)
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''--- Աջ կլիկ(Ստեղծել Պահատեղ վարձ.պայմանագիր) ---'''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Right Click(Create Deposit box rental Agreement) ---",,,DivideColor
    
    Call Create_DepositRental(c_Deposit_Rental,NewDepositCondition,DepositRentalAgr_ForCheck,DepositRental)
    Call Close_Pttel("frmPttel") 
    
    Log.Message "SQL Check After Right Click(Create Deposit box rental Agreement)",,,SqlDivideColor
    Log.Message "fISN = "& DepositRental.Isn,,,SqlDivideColor
    
    Call SQL_Initialize_ForDepositRental(DepositRental.Isn) 
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  AGRNUM:555555555  DATE:20190101  CLICODE:00000025  NAME:²µ»É Îáµ»ÉÛ³Ý  ENAME:Client 00000025  ACC:000286800  FORCEACCCON:0  FORCECLISCH:0  ACCCONNECT:001  USECLISCH:1  STANDARD:011  DURATION:04  STARTDATE:20190101  ENDDATE:20190401  SUMMA:15000  VATMETH:0  PAYTYPE:2  NONWD:0  FORCEAPVAL:0  AUTOPROL:1  REMSMS:0  REMEMAIL:0  REMIB:0  DBOXTYPE:011  DBOXNUMBER:00001  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:01  AUTOPROLONGED:0  DOCDATE:20190101  JOINT:1  ADDINFO:Additional_Information_________Additional_Information_________Additional_Information_________Additional_Information_________Additional_Information_________Additional_Information_________Additional_Information_________1Additional_Information_________Addit_1  USERID:77  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","1",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",DepositRental.Isn,2)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","T","1"," ",1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",DepositRental.Isn,6)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","ADDRESS","²ñß³ÏáõÝÛ³ó                                                                                         ",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","CLICODE","00000018",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","ISSUEAUTHORITY","001",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","ISSUEDATE","19900101",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","NAME","ä»ïñáëÛ³Ý ä»ïñáë                ",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","PASSPORT","AB3333332           ",1)

    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",DepositRental.Isn,6)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
    Call CheckDB_FOLDERS(dbFOLDERS(4),1)
    Call CheckDB_FOLDERS(dbFOLDERS(5),1)
    Call CheckDB_FOLDERS(dbFOLDERS(12),1)
    
    'SQL Ստուգում HI2 աղուսյակում 
    Set dbHI2 = New_DB_HI2()
    With dbHI2
        .fDATE = "2019-01-01"
        .fTYPE = "BB"
        .fOBJECT = Deposit_Box.Isn
        .fGLACC = DepositRental.Isn
        .fSUM = "1.00"
        .fCURSUM = "1.00"
        .fOP = "OCP"
        .fBASE = DepositRental.Isn
        .fDBCR = "D"
        .fBASEBRANCH = "00"
        .fBASEDEPART = "1"
    End With
        
    Call CheckQueryRowCount("HI2","fBASE",DepositRental.Isn,1)
    Call CheckDB_HI2(dbHI2,1)
    
    'SQL Ստուգում HIREST2 աղուսյակում 
    Call CheckQueryRowCount("HIREST2","fOBJECT",DepositRental.Isn,1)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,DepositRental.Isn,"1.00","XXX","0.00", 1)
    
    'SQL Ստուգում PARAMS աղուսյակում 
    Call CheckQueryRowCount("PARAMS","fVALUE","555555556",1)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''--- Ուղարկել հաստատման ---''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Send To Verify ---",,,DivideColor
    
    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
    
    If WaitForPttel("frmPttel") Then
      If SearchInPttel("frmPttel",3, "555555555") Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_SendToVer)
          BuiltIn.Delay(2000)
          Call MessageExists(2,"àõÕ³ñÏ»±É Ñ³ëï³ïÙ³Ý:")
          Call ClickCmdButton(5, "²Ûá")
      End If
      Call Close_Pttel("frmPttel")
    Else
        Log.Error "Can Not Open Deposit Working Agreement pttel",,,ErrorColor      
    End If 
    
    Log.Message "SQL Check After Send To Verify",,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","101",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",DepositRental.Isn,3)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","E","101"," ",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    dbFOLDERS(1).fSTATUS = "0"
    dbFOLDERS(1).fSPEC = "555555555 (²µ»É Îáµ»ÉÛ³Ý, ²Ùë³ÃÇí- 01/01/19) [àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý]"
    dbFOLDERS(12).fSPEC = "555555555 (²µ»É Îáµ»ÉÛ³Ý, ²Ùë³ÃÇí- 01/01/19), ÉÇ³½áñí³Í ³ÝÓ  [àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý]"
    dbFOLDERS(2).fSPEC = "101 77  00000025000286800  20190101201901012019040101104        15000.00201000         1000.00      01100001       1201901010         0         00000000000000000011001  "
    dbFOLDERS(4).fSTATUS = "0"
    dbFOLDERS(4).fSPEC = "555555555       101 77  555555555     0000002501100001       àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý                                                                           "
    dbFOLDERS(5).fSPEC = "101 77  00000025000286800  20190101201901012019040101104        15000.00201000         1000.00      01100001       1201901010         0         00000000000000000011001  "
    
    Call CheckQueryRowCount("FOLDERS","fISN",DepositRental.Isn,7)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
    Call CheckDB_FOLDERS(dbFOLDERS(4),1)
    Call CheckDB_FOLDERS(dbFOLDERS(5),1)
    Call CheckDB_FOLDERS(dbFOLDERS(6),1)
    Call CheckDB_FOLDERS(dbFOLDERS(12),1) 

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''--- Հաստատել պայմանագիրը (Հաստատող | ԱՇՏ)-ից ---'''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Verify Agreement---",,,DivideColor
    
    'Մուտք գործել "Հաստատող | ԱՇՏ"
    Call ChangeWorkspace(c_Verifier1)
    
    Call wTreeView.DblClickItem("|Ð³ëï³ïáÕ I ²Þî|ä³Ñ³ï»ÕÇ Ñ³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ")
    If WaitForPttel("frmPttel") Then
        If SearchInPttel("frmPttel",3, "555555555") Then
            Call wMainForm.MainMenu.Click(c_AllActions)
            Call wMainForm.PopupMenu.Click(c_ToConfirm)
            BuiltIn.Delay(2000)
            Call ClickCmdButton(1, "Ð³ëï³ï»É")
        End If    
        Call Close_Pttel("frmPttel")  
    Else
        Log.Error "Can Not Open Verify Deposit Agreement pttel",,,ErrorColor      
    End If
    
    Log.Message "SQL Check After Verify Agreement",,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","2",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",DepositRental.Isn,5)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","W","102"," ",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","M","2","Ð³ëï³ïí»É ¿",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    dbFOLDERS(1).fSPEC = "555555555 (²µ»É Îáµ»ÉÛ³Ý, ²Ùë³ÃÇí- 01/01/19) [ºÝÃ³Ï³ ¿ ïñ³Ù³¹ñÙ³Ý]"
    dbFOLDERS(12).fSPEC = "555555555 (²µ»É Îáµ»ÉÛ³Ý, ²Ùë³ÃÇí- 01/01/19), ÉÇ³½áñí³Í ³ÝÓ  [ºÝÃ³Ï³ ¿ ïñ³Ù³¹ñÙ³Ý]"
    dbFOLDERS(2).fSPEC = "2   77  00000025000286800  20190101201901012019040101104        15000.00201000         1000.00      01100001       1201901010         0         00000000000000000011001  "
    dbFOLDERS(4).fSTATUS = "1"
    dbFOLDERS(4).fSPEC = "555555555       2   77  555555555     0000002501100001       ºÝÃ³Ï³ ¿ ïñ³Ù³¹ñÙ³Ý                                                                             "
    dbFOLDERS(5).fSPEC = "2   77  00000025000286800  20190101201901012019040101104        15000.00201000         1000.00      01100001       1201901010         0         00000000000000000011001  "
    
    Call CheckQueryRowCount("FOLDERS","fISN",DepositRental.Isn,6)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
    Call CheckDB_FOLDERS(dbFOLDERS(4),1)
    Call CheckDB_FOLDERS(dbFOLDERS(5),1)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Պահատեղի աշխատանքային փաստաթղթեր-ից կատարել Գանձում/տրամադրում գործողություն ---'''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Check RC - Charge/Provide Action ---",,,DivideColor
    
    'Մուտք գործել "Պահատեղերի ԱՇՏ"
    Call ChangeWorkspace(c_Deposit_Boxes)
    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
    
    ISN = RC_ChargeAndProvideAction("555555555","000868")
    Call Close_Pttel("frmPttel")
    
    Log.Message "SQL Check After RC - Charge/Provide Action",,,SqlDivideColor
    Log.Message "fISN = "& ISN,,,SqlDivideColor
    
    Call SQL_Initialize_ForDepositRental(ISN)
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  USERID:  77  ACSBRANCH:00  ACSDEPART:1  DOCNUM:000868  DATE:20190101  CLICODE:00000025  PAYSYSIN:Ð  USEOVERLIMIT:0  CURTES:1  CURVAIR:3  SYSCASE:DEPBOX  SBQENABLED:0  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",ISN,1)
    Call CheckDB_DOCS(ISN,"GenOrdPk","9",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",ISN,1)
    Call CheckDB_DOCLOG(ISN,"77","N","9"," ",1)
    
    'SQL Ստուգում DOCP աղուսյակում  
    Call CheckQueryRowCount("DOCP","fISN",ISN,1)
    Call CheckDB_DOCP(ISN,"GenOrdPk",DepositRental.Isn,1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",ISN,13)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","ACCCR","00000110700",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","ACCDB","000286800  ",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","AIM","ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 555555555                                                                                              ",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","CASHAC","0",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","CURCR","000",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","CURDB","000",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","NOTCALCINCEXP","0",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","NOTCUPUSA","0",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","NOTSENDABLECR","0",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","NOTSENDABLEDB","0",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","OPERTYPE","FEE",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","SUMCR","15000",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","SUMDB","15000",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",ISN,2)
    Call CheckDB_FOLDERS(dbFOLDERS(7),1)
    Call CheckDB_FOLDERS(dbFOLDERS(8),1)
    
    'SQL Ստուգում HI աղուսյակում  
    Call CheckQueryRowCount("HI","fBASE",ISN,2)
    Call Check_HI_CE_accounting ("20190101",ISN, "11",  "1630392", "15000.00", "000", "15000.00", "FEE", "D")
    Call Check_HI_CE_accounting ("20190101",ISN, "11",  "645244712", "15000.00", "000", "15000.00", "FEE", "C")
    
    'SQL Ստուգում HIREST  աղուսյակում 
    Call CheckDB_HIREST("11", "1630392","15000.00","000","15000.00",1)    
    Call CheckDB_HIREST("11", "1630392","15000.00","000","15000.00",1)   
    Call CheckDB_HIREST("02", "656522192","15000.00","000","15000.00",1) 
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Աշխատանքային փաստաթղթեր-ից կատարել Հաշվառել գործողություն ---'''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- ToCount Charge/Provide Action ---",,,DivideColor
    
    Call GoTo_WorkingAgreement(WorkingAgreement) 
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToCount)

    BuiltIn.Delay(2000)
    Call MessageExists(2,"Ð³ßí³é»É")
    BuiltIn.Delay(1000)
    Call ClickCmdButton(5, "²Ûá")
    Call Close_Pttel("frmPttel")
    
    Log.Message "SQL Check After ToCount Charge/Provide Action",,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckDB_DOCS(ISN,"GenOrdPk","5",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",ISN,2)
    Call CheckDB_DOCLOG(ISN,"77","N","9"," ",1)
    Call CheckDB_DOCLOG(ISN,"77","M","5","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",ISN,0)
    Call CheckQueryRowCount("FOLDERS","fISN",DepositRental.Isn,5)
    
    'SQL Ստուգում HI աղուսյակում  
    Call CheckQueryRowCount("HI","fBASE",ISN,2)
    Call Check_HI_CE_accounting ("20190101",ISN, "01",  "1630392", "15000.00", "000", "15000.00", "FEE", "D")
    Call Check_HI_CE_accounting ("20190101",ISN, "01",  "645244712", "15000.00", "000", "15000.00", "FEE", "C")
    
    'SQL Ստուգում HI2 աղուսյակում 
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
        
    Call CheckQueryRowCount("HI2","fBASE",DepositRental.Isn,2)
    Call CheckDB_HI2(dbHI2,1)
    dbHI2.fTYPE = "BB"
    dbHI2.fOBJECT = Deposit_Box.Isn
    dbHI2.fOP = "OCP"
    Call CheckDB_HI2(dbHI2,1)
    
    'SQL Ստուգում HIREST  աղուսյակում 
    Call CheckDB_HIREST("02", "151420649","15000.00","000","15000.00",1)    
    Call CheckDB_HIREST("02", "656522192","15000.00","000","15000.00",1)
    
    'SQL Ստուգում HIREST2 աղուսյակում 
    Call CheckQueryRowCount("HIREST2","fOBJECT",DepositRental.Isn,3)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,DepositRental.Isn,"0.00","","0.00", 1)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,DepositRental.Isn,"1.00","","1.00", 1)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,DepositRental.Isn,"1.00","XXX","0.00", 1)
    Call CheckQueryRowCount("HIREST2","fGLACC",DepositRental.Isn,6)
    Call CheckDB_HIREST2("BB",Deposit_Box.Isn,DepositRental.Isn,"0.00","","0.00", 1)
    Call CheckDB_HIREST2("BB",Deposit_Box.Isn,DepositRental.Isn,"1.00","","1.00", 1)
    Call CheckDB_HIREST2("BB",Deposit_Box.Isn,DepositRental.Isn,"1.00","XXX","0.00", 1)
    
    'SQL Ստուգում HI աղուսյակում 
    Call CheckQueryRowCount("HI","fBASE",DepositRental.Isn,1)
    Call Check_HI_CE_accounting ("20190101",DepositRental.Isn, "LL",  "1630392", "0.00", "000", "1000.00", "DEP", "C")
    
    'SQL Ստուգում MEMORDERS աղուսյակում  
    Call CheckDB_MEMORDERS(ISN,"GenOrdPk","1","2019-01-01","5","0.00","",1)

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Գլխավոր հաշվապահի ԱՇՏ/Վճարային փաստաթղթեր-ից հեռացնել հաշվառած փաստաթուղթը ---'''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Check Exists And Delete In Cheif Acountant ---",,,DivideColor
    
    'Մուտք Գլխավոր հաշվապահի ԱՇՏ   
    Call ChangeWorkspace(c_ChiefAcc)
    
    wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Լրացնել "Ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERN", "^A[Del]" & "010119")
    Call Rekvizit_Fill("Dialog",1,"General","PERK", "^A[Del]" & "010119")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    
    Set DocForm = wMDIClient.VBObject("frmPttel")
    If WaitForPttel("frmPttel") Then
        Call SearchAndDelete("frmPttel", 2, "000868", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
        BuiltIn.Delay(2000)
        Call Close_Pttel("frmPttel")
     Else
        Log.Error "Can Not Open Հաշվառված վճարային փաստաթղթեր Window",,,ErrorColor      
     End If     
     If DocForm.Exists Then
        Log.Error "Can Not Close Հաշվառված վճարային փաստաթղթեր Window",,,ErrorColor
     End If
     
     Log.Message "SQL Check After Delete In Cheif Acountant",,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckDB_DOCS(ISN,"GenOrdPk","999",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",ISN,3)
    Call CheckDB_DOCLOG(ISN,"77","D","999","",1)
    
    'SQL Ստուգում DOCP աղուսյակում  
    Call CheckQueryRowCount("DOCP","fISN",ISN,0)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",ISN,1)
    Call CheckDB_FOLDERS(dbFOLDERS(9),1)
    
    'SQL Ստուգում HI աղուսյակում  
    Call CheckQueryRowCount("HI","fBASE",ISN,0)
    
    'SQL Ստուգում HI2 աղուսյակում 
    Call CheckQueryRowCount("HI2","fBASE",DepositRental.Isn,1)
    Call CheckDB_HI2(dbHI2,1)
    
    'SQL Ստուգում MEMORDERS աղուսյակում  
    Call CheckQueryRowCount("MEMORDERS","fISN",ISN,0)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Պահատեղի աշխատանքային փաստաթղթեր-ից հեռացնել փաստաթուղթը ---'''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- DELETE - Deposit Box Working Agreement  ---",,,DivideColor
    
    'Մուտք գործել "Պահատեղերի ԱՇՏ"
    Call ChangeWorkspace(c_Deposit_Boxes)
    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
     
    Set DocForm = wMDIClient.VBObject("frmPttel")
    If WaitForPttel("frmPttel") Then
        Call SearchAndDelete("frmPttel", 2, "555555555", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
        BuiltIn.Delay(2000)
        Call Close_Pttel("frmPttel")
    Else
        Log.Error "Can Not Open Պահատեղի աշխատանքային փաստաթղթե Window",,,ErrorColor      
    End If     
    If DocForm.Exists Then
        Log.Error "Can Not Close Պահատեղի աշխատանքային փաստաթղթե Window",,,ErrorColor
    End If
     
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Պահատեղեր-ից հեռացնել ստեղծված փաստաթուղթը ---'''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- DELETE - Deposit Box Agreement ---",,,DivideColor     
    
    Call GoTo_DepositBoxes(Deposit_Box_Filter) 
     
    Set DocForm = wMDIClient.VBObject("frmPttel")
    If WaitForPttel("frmPttel") Then
        Call SearchAndDelete("frmPttel", 0, "00001", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
        BuiltIn.Delay(2000)
        Call Close_Pttel("frmPttel")
    Else
        Log.Error "Can Not Open Պահատեղեր Window",,,ErrorColor      
    End If     
    If DocForm.Exists Then
        Log.Error "Can Not Close Պահատեղեր Window",,,ErrorColor
    End If
    
    Log.Message "SQL Check After DELETE - Deposit Box Agreement",,,SqlDivideColor

    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  NUMBER:00001  TYPE:011  OPENDATE:20190101  ACSBRANCH:00  ADDINFO:Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_1111111111111111111111111111111111111111111111Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Depos1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",Deposit_Box.Isn,1)
    Call CheckDB_DOCS(Deposit_Box.Isn,"DBOX     ","999",fBODY,1)
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  AGRNUM:555555555  DATE:20190101  CLICODE:00000025  NAME:²µ»É Îáµ»ÉÛ³Ý  ENAME:Client 00000025  ACC:000286800  FORCEACCCON:0  FORCECLISCH:0  ACCCONNECT:001  USECLISCH:1  STANDARD:011  DURATION:04  STARTDATE:20190101  ENDDATE:20190401  SUMMA:15000  VATMETH:0  PAYTYPE:2  NONWD:0  FORCEAPVAL:0  AUTOPROL:1  REMSMS:0  REMEMAIL:0  REMIB:0  DEPSUMMA:1000  DBOXTYPE:011  DBOXNUMBER:00001  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:01  AUTOPROLONGED:0  DOCDATE:20190101  JOINT:1  ADDINFO:Additional_Information_________Additional_Information_________Additional_Information_________Additional_Information_________Additional_Information_________Additional_Information_________Additional_Information_________1Additional_Information_________Addit_1  USERID:77  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","999",fBODY,1)
    
    'SQL Ստուգում HIREST2 աղուսյակում 
    Call CheckQueryRowCount("HIREST2","fOBJECT",DepositRental.Isn,0)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckDB_DOCLOG(Deposit_Box.Isn,"77","D","999"," ",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","D","999"," ",1)
    
    'SQL Ստուգում HI2 աղուսյակու
    Call CheckQueryRowCount("HI2","fBASE",DepositRental.Isn,0)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",DepositRental.Isn,1)
    Call CheckQueryRowCount("FOLDERS","fISN",Deposit_Box.Isn,1)
    Call CheckDB_FOLDERS(dbFOLDERS(10),1)
    Call SQL_Initialize_ForDepositRental(Deposit_Box.Isn) 
    Call CheckDB_FOLDERS(dbFOLDERS(11),1)
    
    'SQL Ստուգում HI աղուսյակում  
    Call CheckQueryRowCount("HI","fBASE",DepositRental.Isn,0)
    
    Call Close_AsBank()
End Sub    

Sub SQL_Initialize_ForDepositRental(fISN)
    Set dbFOLDERS(0) = New_DB_FOLDERS()
    With dbFOLDERS(0)
        .fFOLDERID = "DepositBox"
        .fNAME = "DBOX    "
        .fKEY = "00 00001       "
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "ä³Ñ³ï»Õ"
        .fSPEC = "0112019010100000000Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_1111111111111111111111111111111111111111111111Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Depos1"
        .fECOM = "Deposit Box"
        .fDCBRANCH = "00"
    End With
        
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1)
      .fFOLDERID = "C.1628339"
      .fNAME = "DBoxAgr "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "1"
      .fCOM = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
      .fSPEC = "555555555 (²µ»É Îáµ»ÉÛ³Ý, ²Ùë³ÃÇí- 01/01/19) [Üáñ]"
      .fECOM = "Deposit Box rental agreement"
    End With

    Set dbFOLDERS(2) = New_DB_FOLDERS()
    With dbFOLDERS(2)
      .fFOLDERID = "DBAGR"
      .fNAME = "DBoxAgr "
      .fKEY = "555555555"
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "²µ»É Îáµ»ÉÛ³Ý"
      .fSPEC = "1   77  00000025000286800  20190101201901012019040101104        15000.00201000         1000.00      01100001       1201901010         0         00000000000000000011001  "
      .fECOM = "Client 00000025"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(3) = New_DB_FOLDERS()
    With dbFOLDERS(3)
      .fFOLDERID = "DBAgr."&fISN
      .fNAME = "DBoxAgr "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
      .fSPEC = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 555555555      (²µ»É Îáµ»ÉÛ³Ý)"
      .fECOM = "Deposit Box rental agreement"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(4) = New_DB_FOLDERS()
    With dbFOLDERS(4)
      .fFOLDERID = "DBAgrWork.20190101"
      .fNAME = "DBoxAgr "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "1"
      .fCOM = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
      .fSPEC = "555555555       1   77  555555555     0000002501100001       Üáñ                                                                                             "
      .fECOM = "Deposit Box rental agreement"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(5) = New_DB_FOLDERS()
    With dbFOLDERS(5)
      .fFOLDERID = "DBBaseAgrs"
      .fNAME = "DBoxAgr "
      .fKEY = "555555555"
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "²µ»É Îáµ»ÉÛ³Ý"
      .fSPEC = "1   77  00000025000286800  20190101201901012019040101104        15000.00201000         1000.00      01100001       1201901010         0         00000000000000000011001  "
      .fECOM = "Client 00000025"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(6) = New_DB_FOLDERS()
    With dbFOLDERS(6)
      .fFOLDERID = "DBVer.20190101001"
      .fNAME = "DBoxAgr "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "4"
      .fCOM = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
      .fSPEC = "555555555       101 77  555555555     0000002501100001       àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý                                                                           1"
      .fECOM = "Deposit Box rental agreement"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(7) = New_DB_FOLDERS()
    With dbFOLDERS(7)
      .fFOLDERID = "C.1628339"
      .fNAME = "GenOrdPk"
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "1"
      .fCOM = "ÊÙµ³ÛÇÝ ÑÇß³ñ³ñ ûñ¹»ñ"
      .fSPEC = "²Ùë³ÃÇí- 01/01/19 N- 000868 ¶áõÙ³ñ-                 0.00 ²ñÅ.-     [Üáñ]"
      .fECOM = "Group Memorial Order"
    End With
    
    Set dbFOLDERS(8) = New_DB_FOLDERS()
    With dbFOLDERS(8)
      .fFOLDERID = "Oper.20190101"
      .fNAME = "GenOrdPk"
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "1"
      .fCOM = "ÊÙµ³ÛÇÝ ÑÇß³ñ³ñ ûñ¹»ñ"
      .fSPEC = "000868                                        15000.00000Üáñ                                                   77                                                                                       Ð                                                                                                                                                    "
      .fECOM = "Group Memorial Order"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(9) = New_DB_FOLDERS()
    With dbFOLDERS(9)
        .fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")
        .fNAME = "GenOrdPk"
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "0"
        .fSPEC = Left_Align(Get_Compname_DOCLOG(fISN), 16)&"GlavBux ARMSOFT                       115  "
        .fDCBRANCH = "00"
        .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(10) = New_DB_FOLDERS()
    With dbFOLDERS(10)
        .fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")
        .fNAME = "GenOrdPk"
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "0"
        .fSPEC = Left_Align(Get_Compname_DOCLOG(fISN), 16)&"GlavBux ARMSOFT                       115  "
        .fDCBRANCH = "00"
        .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(11) = New_DB_FOLDERS()
    With dbFOLDERS(11)
        .fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")
        .fNAME = "DBOX    "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "0"
        .fSPEC = Left_Align(Get_Compname_DOCLOG(fISN), 16)&"DEPBOX  ARMSOFT                       001  "
        .fDCBRANCH = ""
        .fDCDEPART = ""
    End With
    
    Set dbFOLDERS(12) = New_DB_FOLDERS()
    With dbFOLDERS(12)
      .fFOLDERID = "C.317432892"
      .fNAME = "DBoxAgr "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
      .fSPEC = "555555555 (²µ»É Îáµ»ÉÛ³Ý, ²Ùë³ÃÇí- 01/01/19), ÉÇ³½áñí³Í ³ÝÓ  [Üáñ]"
      .fECOM = "Deposit Box rental agreement"
    End With
End Sub

Sub Test_InitializeFor_DepositRental()
  
    Set Deposit_Box_Filter = New_Deposit_Boxes_Filter()
    
    Set Deposit_Box = New_Deposit_Box()
    With Deposit_Box
        .Number = "00001"
        .Type1 = "011"
        .OpeningDate = "^A[Del]" &"010119"
        .ClosingDate = ""
        .Division = "00"
        .AdditionalInformation = "Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_1111111111111111111111111111111111111111111111Deposit_Box_Deposit_Box_Deposit_Box_Deposit_Box_Depos1"
    End With   
     
    Set NewDepositCondition = New_DepositCondition()
    With NewDepositCondition
        .SigningDate = "^A[Del]" & "010119"
        .Standard = "011"
        .Duration = "04"
        .EndDate = "01/04/19"
        .DepositBoxType = "011"
        .DepositBoxNumber = "00001"
        .Client = "00000025"
        .PaymentType = "2"
        .ServiceFee = "15,000.00"
        .DepositionAmount = "1000"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With    
        
    Set DepositRentalAgr_ForCheck = New_DepositRentalAgreement()
    With DepositRentalAgr_ForCheck
        .Client = "00000025"
        .Name = "²µ»É Îáµ»ÉÛ³Ý"
        .EnglishName = "Client 00000025"
        .OtherAccs = "001"
        .UseClientSchema = 1
        .Standard = "011"
        .Duration = "04"
        .StartDate = "01/01/19"
        .EndDate = "01/04/19"
        .ServiceFee = "15,000.00"
        .VatTaxable = "0"
        .PaymentType = "2"
        .NonperformingDaysAvoiding = "0"
        .AutoProlong = 0
        .RemindBySMS = 0
        .EmailAddress = 0
        .IntBank = 0
        .DepositionAmount = "1,000.00"
        .AllowDelayedPayment = 0
        .StandardPay = ""
        .ServContrStandForPenalCalc = ""
        .DepositBoxType = "011"
        .Number = "00001"
        .ClosingDate = "/  /"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With
    
    Set DepositRental = New_DepositRentalAgreement()
    With DepositRental
        .Agreement = "^A[Del]"&"555555555"
        .Account = "000286800"
        .UseClientSchema = 1
        .AutoProlong = 1
        .EmailAddress = 1
        .DepositionAmount = "1,000.00"
        .OnlyJointEntrance = 1
        .GridClient = "00000018"
        .AdditionalaInfo = "Additional_Information_________Additional_Information_________Additional_Information_________Additional_Information_________Additional_Information_________Additional_Information_________Additional_Information_________1Additional_Information_________Addit_1"
    End With

    Set Deposit_Box_WorkingAgr_Filter = New_Deposit_Boxes_WorkingAgr()
    With Deposit_Box_WorkingAgr_Filter
        .DataPeriod_Start = "^A[Del]"&"010118"
        .DataPeriod_End = "^A[Del]"&"010120"
        .Executors = "77"
        .DocumentType = "DBoxAgr"
        .Client = "00000025"
        .Agreement = "555555555"
        .DepositBoxNumber = "00001"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With
     
    Set WorkingAgreement = New_WorkingAgreementForDeposit()
    With WorkingAgreement
        .DataPeriod_Start = "^A[Del]"&"010118"
        .DataPeriod_End = "^A[Del]"&"010120"
        .Curr = "000"
        .Executors = "77"
        .DocumentType = "GenOrdPk"
        .RecPaySystem = "Ð"
        .SentPaySystem = ""
        .Note = ""
        .Division = "00"
        .Department = "1"
    End With
End Sub