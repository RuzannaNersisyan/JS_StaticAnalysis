'USEUNIT Library_Common 
'USEUNIT Library_Colour
'USEUNIT Constants
'USEUNIT Subsystems_Special_Library
'USEUNIT Mortgage_Library
'USEUNIT Library_Contracts
'USEUNIT Library_CheckDB
'USEUNIT Deposit_Library
'USEUNIT Card_Library

Option Explicit
'Test Case Id - 157465

Dim NewDepositCondition,DepositRentalAgr_ForCheck,DepositRental
Dim Isn,Deposit_Box_WorkingAgr_Filter,DepositBoxRentalFilter
Dim fBODY,VisitISN,Query,fDCRID,dbFOLDERS(4)

'Պահատեղերի ԱՇՏ
Sub Check_DepositVisitAction()
    
    Dim sDATE,fDATE
    
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20020101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Login("ARMSOFT")
    
    Call Test_InitializeVisitAction()

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Մուտք գործել "Պահատեղի աշխատանքային փաստաթղթեր" թղթապանակ ---''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    
    'Մուտք գործել "Պահատեղերի ԱՇՏ"
    Call ChangeWorkspace(c_Deposit_Boxes)
    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''--- Թղթապանակում կատարել աջ կլիկ "Ստեղծել Պահատեղի վարձակալության պայմանագիր" ---''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Right Click(Create Deposit box rental Agreement/Ստեղծել Պահատեղ վարձ.պայմանագիր) ---",,,DivideColor
    
    Call Create_DepositRental(c_CreateDepositBoxContract,NewDepositCondition,DepositRentalAgr_ForCheck,DepositRental)
    Log.Message "fISN = "& DepositRental.Isn,,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  AGRNUM:300000009  DATE:20200202  CLICODE:00000019  NAME:¶»Õ³ÙÛ³Ý ²ñï³ß»ë  ENAME:Client 00000019  ACC:000355101  FORCEACCCON:0  FORCECLISCH:0  ACCCONNECT:001  USECLISCH:1  STANDARD:002  DURATION:00  STARTDATE:20200202  ENDDATE:20200303  VATMETH:1  PAYTYPE:2  NONWD:1  FORCEAPVAL:0  AUTOPROL:0  REMSMS:0  REMEMAIL:0  REMIB:0  DELAYST:001  PENALTYST:002  DBOXTYPE:011  DBOXNUMBER:3000003  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:01  AUTOPROLONGED:0  DOCDATE:20200202  JOINT:0  ADDINFO:Check_DepositRenaltyCount  USERID:77  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","1",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",DepositRental.Isn,2)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","T","1"," ",1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",DepositRental.Isn,11)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","ADDRESS","Ð³Ýñ³å»ïáõÃÛ³Ý Ðñ³å³ñ³Ï 1                                                                           ",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","1","ADDRESS","Î»ÝïñáÝ                                                                                             ",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","CLICODE","00000676",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","ISSUEAUTHORITY","001",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","1","ISSUEAUTHORITY","005",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","ISSUEDATE","19990101",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","1","ISSUEDATE","19950101",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","NAME","äáÕáë äáÕáëÇ äáÕáëÛ³Ý           ",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","1","NAME","²ÝáõÝ ²½·³ÝáõÝ                  ",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","PASSPORT","AA0589348625        ",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","1","PASSPORT","AA006007008         ",1)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''---  Îատարել Գանձում/տրամադրում գործողությունը ---'''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Check RC - Charge/Provide Action ---",,,DivideColor
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ChargeAndProvide)
    Call Close_Pttel("frmPttel")  
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","7",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",DepositRental.Isn,3)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","T","1"," ",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","T","7"," ",1)

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Պահատեղի վարձակալության պայմանագրեր-ից կատարել Այցելություն գործողություն ---'''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Check RC - Visit Action ---",,,DivideColor 
    
    Call GoTo_DepositBoxRental(DepositBoxRentalFilter) 
    
    VisitISN = RC_VisitAction("300000009","888888","020220","","","300000009","AddInfo",True,"²ÝáõÝ ²½·³ÝáõÝ","AA006007008") 
    Call Close_Pttel("frmPttel")
    
    Log.Message "fISN = "& VisitISN,,,SqlDivideColor
    Call SQL_Initialize_VisitAction(VisitISN)
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  ACSBRANCH:00  ACSDEPART:1  USERID:77  DOCNUM:888888  DATE:20200202  AGRNUM:300000009  DBOXNUMBER:3000003  ADDINFO:AddInfo  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",VisitISN,1)
    Call CheckDB_DOCS(VisitISN,"DBVisit ","1",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",VisitISN,1)
    Call CheckDB_DOCLOG(VisitISN,"77","N","1"," ",1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",VisitISN,2)
    Call CheckDB_DOCSG(VisitISN,"VISITORS","0","NAME","²ÝáõÝ ²½·³ÝáõÝ                  ",1)
    Call CheckDB_DOCSG(VisitISN,"VISITORS","0","PASSPORT","AA006007008         ",1)

    'SQL Ստուգում FOLDERS աղուսյակում 
    dbFOLDERS(1).fFOLDERID = "DBAgr." & DepositRental.Isn
    Call CheckQueryRowCount("FOLDERS","fISN",VisitISN,3)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''--- Պահատեղի աշխատանքային փաստաթղթերից կատարել այցելության սկիզբ գործողությունը ---''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Check RC - Start Visit Action ---",,,DivideColor 

    Deposit_Box_WorkingAgr_Filter.DocumentType  = "DBVisit"
    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
    
    Call StartOfVisit("12:59")
    
    'SQL Ստուգում DCR աղուսյակում 
    Call CheckQueryRowCount("DCR", "fISN", VisitISN, 1)
    
    'SQL Ստուգում DCR_FIELDS աղուսյակում 
    Query = "Select fDCRID from DCR WHERE fISN = " & VisitISN
    fDCRID = my_Row_Count(Query)
    
    Query = "Select count(*) from DCR_FIELDS WHERE fNEWVALUE = '12:59' and fDCRID = " & fDCRID
    If my_Row_Count(Query) = 1 Then
        Log.Message "DCR_FIELDS record is correct.",,,MessageColor
    Else
       Log.Error "DCR_FIELDS record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & Query,,,ErrorColor
    End If

    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",VisitISN,3)
    Call CheckDB_DOCLOG(VisitISN,"77","M","3","²Ûó»ÉáõÃÛ³Ý ëÏÇ½µ",1)
    Call CheckDB_DOCLOG(VisitISN,"77","T","3","",1)
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  ACSBRANCH:00  ACSDEPART:1  USERID:77  DOCNUM:888888  DATE:20200202  IN:12:59  AGRNUM:300000009  DBOXNUMBER:3000003  ADDINFO:AddInfo  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",VisitISN,1)
    Call CheckDB_DOCS(VisitISN,"DBVisit ","3",fBODY,1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    dbFOLDERS(1).fSPEC = "²Ûó»ÉáõÃÛáõÝ N 888888 , ëÏÇ½µ - 12:59 ²Ûó»ÉáõÝ»ñ - ²ÝáõÝ ²½·³ÝáõÝ"
    dbFOLDERS(2).fSPEC = "300000009       3   77  888888        000000190113000003     ÀÝÃ³óùáõÙ ¿                     ëÏÇ½µ - 12:59                                                   "
    dbFOLDERS(3).fSPEC = "77  00000019¶»Õ³ÙÛ³Ý ²ñï³ß»ë                3000003     300000009       2020020212:5900:00²ÝáõÝ ²½·³ÝáõÝ"

    Call CheckQueryRowCount("FOLDERS","fISN",VisitISN,3)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
   
    'SQL Ստուգում HI2 աղուսյակում
    Call CheckQueryRowCount("HI2", "fBASE", VisitISN, 1)
    Call CheckQueryRowCount("HI2", "fGLACC", DepositRental.Isn, 3)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''--- Պահատեղի աշխատանքային փաստաթղթերից կատարել այցելության Ավարտ գործողությունը ---''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Check RC - End Visit Action ---",,,DivideColor 
    
    Call EndOfVisit("14:59")
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  ACSBRANCH:00  ACSDEPART:1  USERID:77  DOCNUM:888888  DATE:20200202  IN:12:59  AGRNUM:300000009  DBOXNUMBER:3000003  ADDINFO:AddInfo  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",VisitISN,1)
    Call CheckDB_DOCS(VisitISN,"DBVisit ","2",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",VisitISN,5)
    Call CheckDB_DOCLOG(VisitISN,"77","M","2","²Ûó»ÉáõÃÛ³Ý ³í³ñï",1)
    Call CheckDB_DOCLOG(VisitISN,"77","T","2","",1)
    
    'SQL Ստուգում DCR աղուսյակում 
    Call CheckQueryRowCount("DCR", "fISN", VisitISN, 2)
    
    'SQL Ստուգում DCR_FIELDS աղուսյակում 
    Query = "Select count(*) from DCR_FIELDS WHERE fNEWVALUE = '14:59' and fDCRID = " & fDCRID + 1
    If my_Row_Count(Query) = 1 Then
        Log.Message "DCR_FIELDS record is correct.",,,MessageColor
    Else
       Log.Error "DCR_FIELDS record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & Query,,,ErrorColor
    End If
    
    'SQL Ստուգում FOLDERS աղուսյակում                                                "
    dbFOLDERS(3).fSPEC = "77  00000019¶»Õ³ÙÛ³Ý ²ñï³ß»ë                3000003     300000009       2020020212:5914:59²ÝáõÝ ²½·³ÝáõÝ"
    Call CheckQueryRowCount("FOLDERS","fISN",VisitISN,1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''--- Հեռացնել այցելություն գործողությունը ---'''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- DELETE Visit Action ---",,,DivideColor 
    
    Call SearchAndDelete("frmPttel", 2, "888888", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
    Call Close_Pttel("frmPttel")
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckDB_DOCS(VisitISN,"DBVisit ","999",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",VisitISN,6)
    Call CheckDB_DOCLOG(VisitISN,"77","D","999","",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում
    Call CheckQueryRowCount("FOLDERS","fISN",VisitISN,1)
    Call CheckDB_FOLDERS(dbFOLDERS(4),1)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''- "Պահատեղի վարձակալության պայմանագրեր" թղթապանակից հեռացնել պայմանագիրը (Ստեղծվում է ջնջման հայտ)-''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "DELETE Deposit Box Rental Agreement",,,DivideColor    
    
    Call GoTo_DepositBoxRental(DepositBoxRentalFilter) 
    Call Delete_DepositBoxAgr("300000009")
    Call Close_Pttel("frmPttel")
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  AGRNUM:300000009  DATE:20200202  CLICODE:00000019  NAME:¶»Õ³ÙÛ³Ý ²ñï³ß»ë  ENAME:Client 00000019  ACC:000355101  FORCEACCCON:0  FORCECLISCH:0  ACCCONNECT:001  USECLISCH:1  STANDARD:002  DURATION:00  STARTDATE:20200202  ENDDATE:20200303  VATMETH:1  PAYTYPE:2  NONWD:1  FORCEAPVAL:0  AUTOPROL:0  REMSMS:0  REMEMAIL:0  REMIB:0  DELAYST:001  PENALTYST:002  DBOXTYPE:011  DBOXNUMBER:3000003  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:01  AUTOPROLONGED:0  DOCDATE:20200202  JOINT:0  ADDINFO:Check_DepositRenaltyCount  USERID:77  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","7",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",DepositRental.Isn,3)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","T","7"," ",1)
    
    
'Քանի որ Ռեեստր ուղարկված պայմանագիրը հնարավոր չի հեռացնել, այդ պատճառով տվյալ տողերը փակված են

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''--- Վավերացնել ջնջման հայտը (Հաստատող | ԱՇՏ)-ից ---''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'    Log.Message "--- Verify Delete Agreement---",,,DivideColor
'    
'    'Մուտք գործել "Հաստատող | ԱՇՏ"
'    Call ChangeWorkspace(c_Verifier1)
'    Call wTreeView.DblClickItem("|Ð³ëï³ïáÕ I ²Þî|ä³Ñ³ï»ÕÇ Ñ³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ")
'    
'    If WaitForPttel("frmPttel") Then
'        If SearchInPttel("frmPttel",3, "300000009") Then
'            Call wMainForm.MainMenu.Click(c_AllActions)
'            Call wMainForm.PopupMenu.Click(c_ToConfirm)
'            BuiltIn.Delay(2000)
'            Call ClickCmdButton(1, "Ð³ëï³ï»É")
'        End If    
'        Call Close_Pttel("frmPttel")  
'    Else
'        Log.Error "Can Not Open Verify Deposit Agreement pttel",,,ErrorColor      
'    End If
'    
'    'SQL Ստուգում DOCS աղուսյակում
'    fBODY = "  AGRNUM:300000009  DATE:20200202  CLICODE:00000019  NAME:¶»Õ³ÙÛ³Ý ²ñï³ß»ë  ENAME:Client 00000019  ACC:000355101  FORCEACCCON:0  FORCECLISCH:0  ACCCONNECT:001  USECLISCH:1  STANDARD:002  DURATION:00  STARTDATE:20200202  ENDDATE:20200303  VATMETH:1  PAYTYPE:2  NONWD:1  FORCEAPVAL:0  AUTOPROL:0  REMSMS:0  REMEMAIL:0  REMIB:0  DELAYST:001  PENALTYST:002  DBOXTYPE:011  DBOXNUMBER:3000003  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:01  AUTOPROLONGED:0  DOCDATE:20200202  JOINT:0  ADDINFO:Check_DepositRenaltyCount  USERID:77  "
'    fBODY = Replace(fBODY, "  ", "%")
'    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
'    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","999",fBODY,1)
'    
'    'SQL Ստուգում DOCLOG աղուսյակում 
'    Call CheckDB_DOCLOG(DepositRental.Isn,"77","D","999"," ",1)

    Call Close_AsBank()

End Sub    

Sub SQL_Initialize_VisitAction(fISN)
        
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1)
      .fFOLDERID = "DBAgr.2057289239"
      .fNAME = "DBVisit "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "²Ûó»ÉáõÃÛáõÝ"
      .fSPEC = "²Ûó»ÉáõÃÛáõÝ N 888888 , ëÏÇ½µ - 00:00 ²Ûó»ÉáõÝ»ñ - ²ÝáõÝ ²½·³ÝáõÝ"
      .fECOM = "Visit"
    End With

    Set dbFOLDERS(2) = New_DB_FOLDERS()
    With dbFOLDERS(2)
      .fFOLDERID = "DBAgrWork.20200202"
      .fNAME = "DBVisit "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "1"
      .fCOM = "²Ûó»ÉáõÃÛáõÝ"
      .fSPEC = "300000009       1   77  888888        000000190113000003     Üáñ                                                                                             "
      .fECOM = "Visit"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(3) = New_DB_FOLDERS()
    With dbFOLDERS(3)
      .fFOLDERID = "DBoxVisits"
      .fNAME = "DBVisit "
      .fKEY = "2020888888"
      .fISN = fISN
      .fSTATUS = "1"
      .fCOM = "²Ûó»ÉáõÃÛáõÝ"
      .fSPEC = "77  00000019¶»Õ³ÙÛ³Ý ²ñï³ß»ë                3000003     300000009       2020020200:0000:00²ÝáõÝ ²½·³ÝáõÝ"
      .fECOM = "Visit"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(4) = New_DB_FOLDERS()
    With dbFOLDERS(4)
        .fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")
        .fNAME = "DBVisit "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "0"
        .fSPEC = Left_Align(Get_Compname_DOCLOG(fISN), 16)&"DEPBOX  ARMSOFT                       002  "
        .fDCBRANCH = "00 "
        .fDCDEPART = "1  "
    End With
End Sub    

Sub Test_InitializeVisitAction()

    Set Deposit_Box_WorkingAgr_Filter = New_Deposit_Boxes_WorkingAgr()
    With Deposit_Box_WorkingAgr_Filter
        .DataPeriod_Start = "^A[Del]"&"020220"
        .DataPeriod_End = "^A[Del]"&"020221"
    End With
    
    Set NewDepositCondition = New_DepositCondition()
    With NewDepositCondition
        .SigningDate = "^A[Del]" & "020220"
        .Standard = "002"
        .Duration = "00"
        .EndDate = "/  /"
        .FillEndDate = "^A[Del]" & "030320"
        .DepositBoxNumber = "3000003"
        .Client = "00000019"
        .PaymentType = "2"
        .ServiceFee = "30,000.00"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With    
        
    Set DepositRentalAgr_ForCheck = New_DepositRentalAgreement()
    With DepositRentalAgr_ForCheck
        .Client = "00000019"
        .Name = "¶»Õ³ÙÛ³Ý ²ñï³ß»ë"
        .EnglishName = "Client 00000019"
        .OtherAccs = ""
        .UseClientSchema = 0
        .Standard = "002"
        .Duration = "00"
        .StartDate = "02/02/20"
        .EndDate = "03/03/20"
        .ServiceFee = ""
        .VatTaxable = "1"
        .PaymentType = "2"
        .NonperformingDaysAvoiding = "1"
        .AutoProlong = 0
        .RemindBySMS = 0
        .EmailAddress = 0
        .IntBank = 0
        .ServiceFee = "30,000.00"
        .DepositionAmount = "5,000.00"
        .AllowDelayedPayment = 1
        .StandardPay = "001"
        .ServContrStandForPenalCalc = "002"
        .DepositBoxType = "011"
        .Number = "3000003"
        .ClosingDate = "/  /"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With
    
    Set DepositRental = New_DepositRentalAgreement()
    With DepositRental
        .Agreement = "^A[Del]"&"300000009"
        .Account = "000355101"
        .OtherAccs = "001"
        .UseClientSchema = 1
        .Duration = "00"
        .AutoProlong = 1
        .EmailAddress = 1
        .ServiceFee = "0.00"
        .DepositionAmount = "0.00"
        .AllowDelayedPayment = 1
        .StandardPay = "001"
        .AdditionalaInfo = "Check_DepositRenaltyCount"
        .GridClient = "00000676"
        .OtherPerson(0) = True
        .OtherPerson(1) = "²ÝáõÝ ²½·³ÝáõÝ"
        .OtherPerson(2) = "AA006007008"
        .OtherPerson(3) = "005"
        .OtherPerson(4) = "01011995"
        .OtherPerson(5) = ""
        .OtherPerson(6) = "Î»ÝïñáÝ"
    End With

    Set DepositBoxRentalFilter = New_DepositBoxRental()
    With DepositBoxRentalFilter          
        .Data = "^A[Del]"&"020220"
        .Client = "00000019"
        .DepositBoxNumber = "3000003"
        .AgreementN = "300000009"
        .View = "DBAgrs"
        .FillInto = "0"
    End With
End Sub