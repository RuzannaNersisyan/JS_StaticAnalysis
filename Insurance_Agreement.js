'USEUNIT Library_Common 
'USEUNIT Library_Colour
'USEUNIT Constants
'USEUNIT Subsystems_Special_Library
'USEUNIT Mortgage_Library
'USEUNIT Library_Contracts
'USEUNIT Library_CheckDB
'USEUNIT Insurance_Agreement_Library

Option Explicit
'Test Case Id - 151482

Dim InsuranceAgreement,FolderName
Dim fISN,fBODY,dbPOLICIES,dbFOLDERS(5)

'Ենթահամակարգեր (ՀԾ)/Ապահովագրության պայմանագրեր
Sub Check_Insurance_Agreement()
    
    Dim sDATE,fDATE
     
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20140101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Login("ARMSOFT")

    'Մուտք գործել "Ենթահամակարգեր (ՀԾ)"
    Call ChangeWorkspace(c_Subsystems)
    Call Test_InitializeFor_InsuranceAgreement()

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''--- Ստեղծել Ապահովագրության պայմանագրիր ---'''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Create Insurance Agreement ---",,,DivideColor

    Call Create_Insurance_Agreement(InsuranceAgreement)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''--- SQL Ստուգում ---''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''' 
    Log.Message "SQL Check After Create Insurance Agreement",,,SqlDivideColor
    Log.Message "fISN = " & InsuranceAgreement.isn,,,SqlDivideColor  
    
    fISN = InsuranceAgreement.isn
    Call SQL_InitFor_InsuranceAgreement(fISN)
    
    fBODY = "  CODE:55555555555555  INSCOMP:00034854  SURETY:00000009  INSTYPE:2  INSSUBJ:Pahest__Pahest__Pahest__Pahest_1  MARKETVALUE:1000000000000  INSVALUE:111111111111.1  INSSUMMA:888888888888.9  COMMENT:_InsuranceAgreement_InsuranceAgreement_InsuranceA1  DATEBEGIN:20200101  DATEEND:20210101  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:IP1  MORTGAGE:1  MORTCODE:N10179  CODESSAGR:V-0177  CODESSAGRISN:1756941  PLACEDFUND:0  "
    fBODY = Replace(fBODY, "  ", "%")
    
    'SQL Ստուգում DOCS աղուսյակում  
    Call CheckQueryRowCount("DOCS","fISN",fISN,1)
    Call CheckDB_DOCS(fISN,"IPolicy ","1",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",fISN,1)
    Call CheckDB_DOCLOG(fISN,"77","N","1","",1) 
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",fISN,3)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1) 
    
    'SQL Ստուգում POLICIES աղուսյակում 
    Call CheckQueryRowCount("POLICIES","fIPISN",fISN,1)
    Call CheckDB_POLICIES(dbPOLICIES,1)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''--- Պայմանագիրը ուղարկում է հաստատման ---''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''    
    Log.Message "Send To Verify Contract ",,,DivideColor 
    
    FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
    
    Call GoToFolder_ByDocNum(FolderName,"NUM",InsuranceAgreement.AgreementN)
    Call SendToVerify_Contrct(2, 5, "²Ûá")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''--- SQL Ստուգում ---''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''' 
    Log.Message "SQL Check After Send To Verify Contrct",,,SqlDivideColor
    
    dbFOLDERS(1).fCOM = " ²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
    dbFOLDERS(1).fSTATUS = "0"
    dbFOLDERS(2).fSTATUS = "0"
    dbFOLDERS(2).fSPEC = "1²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 55555555555555 (  /àõÕ³ñÏí³Í Ñ³ëï³ïÙ³Ý/)"
    dbFOLDERS(3).fSTATUS = "0"
    dbFOLDERS(3).fSPEC = "55555555555555IP1 20200101            0.0077  00000009àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³"  
    dbPOLICIES.fIPSTATE = "101"
    
    'SQL Ստուգում DOCS աղուսյակում  
    Call CheckQueryRowCount("DOCS","fISN",fISN,1)
    Call CheckDB_DOCS(fISN,"IPolicy ","101",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",fISN,3)
    Call CheckDB_DOCLOG(fISN,"77","N","1","",1) 
    Call CheckDB_DOCLOG(fISN,"77","M","99","àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý",1) 
    Call CheckDB_DOCLOG(fISN,"77","C","101","",1) 
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",fISN,4)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1) 
    Call CheckDB_FOLDERS(dbFOLDERS(4),1) 
    
    'SQL Ստուգում POLICIES աղուսյակում 
    Call CheckQueryRowCount("POLICIES","fIPISN",fISN,1)
    Call CheckDB_POLICIES(dbPOLICIES,1)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''--- 'Հաստատում է պայմանագիրը(Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I) ---'''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''     
    Log.Message "Verify Contract",,,DivideColor
    
    FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I"
    
    Call GoToFolder_ByDocNum(FolderName,"NUM",InsuranceAgreement.AgreementN)
    
    If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 0 Then
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_ToConfirm)
        Call ClickCmdButton(1, "Ð³ëï³ï»É")
    Else 
        Log.Error InsuranceAgreement.AgreementN & " Համարի պայմանագիրը չի գտնվել Հաստատվող փաստաթղթեր 1-ում" ,,,ErrorColor
    End If 
    Call Close_Pttel("frmPttel") 
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''--- SQL Ստուգում ---''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''' 
    Log.Message "SQL Check After Verify Contrct",,,SqlDivideColor
    
    Call SQL_InitFor_InsuranceAgreement(fISN)
    dbFOLDERS(1).fCOM = " ²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
    dbPOLICIES.fIPSTATE = "2"
    
    'SQL Ստուգում DOCS աղուսյակում  
    Call CheckQueryRowCount("DOCS","fISN",fISN,1)
    Call CheckDB_DOCS(fISN,"IPolicy ","2",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",fISN,5)
    Call CheckDB_DOCLOG(fISN,"77","N","1","",1) 
    Call CheckDB_DOCLOG(fISN,"77","M","99","àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý",1) 
    Call CheckDB_DOCLOG(fISN,"77","C","101","",1) 
    Call CheckDB_DOCLOG(fISN,"77","W","102","",1) 
    Call CheckDB_DOCLOG(fISN,"77","M","2","²å³Ñáí³·ñ³Ï³Ý å³ÛÙ³Ý³·ñÇ Ñ³ëï³ïáõÙ",1) 
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",fISN,2)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    
    'SQL Ստուգում POLICIES աղուսյակում 
    Call CheckQueryRowCount("POLICIES","fIPISN",fISN,1)
    Call CheckDB_POLICIES(dbPOLICIES,1)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''--- Ապահովագրության պայմանագրեր թղթապանակում փաստատթղթի առկայության ստուգում ---'''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "Check Existing (Insurance Agreement) Function",,,DivideColor
    
    FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñ|²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñ"
    Call GoToFolder_ByDocNum(FolderName,"CODEMASK",InsuranceAgreement.AgreementN)
    
    If Not(wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 0) Then
        Log.Error InsuranceAgreement.AgreementN & " Համարի պայմանագիրը չի գտնվել Ապահովագրության պայմանագրեր-ում" ,,,ErrorColor
    End If 
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''--- Հեռացնել  Ապահովագրության պայմանագիրը ---'''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''      
    Log.Message "Deleted (Insurance Agreement)",,,DivideColor 
 
    Call SearchInPttel("frmPttel", 0, InsuranceAgreement.AgreementN)
    Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
    
    BuiltIn.Delay(1000) 
    Call MessageExists(3,"¶áñÍáÕáõÃÛ³Ý ³ñ¹ÛáõÝùáõÙ Ïëï»ÕÍíÇ çÝçÙ³Ý Ñ³Ûï: Þ³ñáõÝ³Ï»±É:")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    Call MessageExists(2,"æÝçÙ³Ý Ñ³ÛïÝ áõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý:")
    Call ClickCmdButton(5, "OK")
    
    Call Close_Pttel("frmPttel")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''--- Հաստատել Ջնջման հայտը Ապահովագրության պայմանագիրը ---''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''    
    FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I"
    
    Call GoToFolder_ByDocNum(FolderName,"NUM","")
    
    If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 0 Then
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_ToConfirm)
        Call ClickCmdButton(1, "Ð³ëï³ï»É")
    Else
        Log.Error InsuranceAgreement.AgreementN & " Համարի պայմանագիրը Ջնջման հայտը չի գտնվել Հաստատվող փաստաթղթեր 1-ում" ,,,ErrorColor
    End If 
    Call Close_Pttel("frmPttel") 

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''--- SQL Ստուգում ---''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''' 
    Log.Message "SQL Check After Deleted (Insurance Agreement)",,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում  
    Call CheckQueryRowCount("DOCS","fISN",fISN,1)
    Call CheckDB_DOCS(fISN,"IPolicy ","999",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",fISN,6)
    Call CheckDB_DOCLOG(fISN,"77","D","999","",1) 
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",fISN,1)
    Call CheckDB_FOLDERS(dbFOLDERS(5),1)
    
    'SQL Ստուգում POLICIES աղուսյակում 
    Call CheckQueryRowCount("POLICIES","fIPISN",fISN,0)
    
    Call Close_AsBank()
End Sub   

Sub Test_InitializeFor_InsuranceAgreement()
  
    Set InsuranceAgreement = New_InsuranceAgreement()
    With InsuranceAgreement
      .AgreementN = "55555555555555"
      .InsuranceCompany = "00034854"
      .Surety = "00000009"
      .InsuranceType = "2"
      .InsuranceSubject = "Pahest__Pahest__Pahest__Pahest_1"
      .MarketValue = "999999999999.99"
      .InsuranceAmount = "111111111111.11"
      .InsurancePremium = "888888888888.88"
      .Comment = "_InsuranceAgreement_InsuranceAgreement_InsuranceA1"
      .PeriodOfValid_Start = "010120"
      .PeriodOfValid_End = "010121"
      .Division = "00"
      .Department = "1"
      .AccessType = "IP1"
      'Tab - 2
      .ReceivedCollateral = 1
      .MortgageN = "N10179"
      .CollateralArgN = "V-0177"
      .Placement = 0
      .PlacementN = ""
      'Tab - 3
      .Note = ""
      .Note2 = ""
      .Note3 = ""
      .ClosingDate = ""
    End With
End Sub

Sub SQL_InitFor_InsuranceAgreement(fISN)
    
    Set dbFOLDERS(1) = New_DB_FOLDERS()
        dbFOLDERS(1).fFOLDERID = "C.1628324"
        dbFOLDERS(1).fNAME = "IPolicy "
        dbFOLDERS(1).fKEY = fISN
        dbFOLDERS(1).fISN = fISN
        dbFOLDERS(1).fSTATUS = 1
        dbFOLDERS(1).fCOM = " ²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·Çñ (Ý³Ë³·ÇÍ)"
        dbFOLDERS(1).fSPEC = "55555555555555, 111111111111.1 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù"

    Set dbFOLDERS(2) = New_DB_FOLDERS()
        dbFOLDERS(2).fFOLDERID = "Mort.1756942"
        dbFOLDERS(2).fNAME = "IPolicy "
        dbFOLDERS(2).fKEY = fISN
        dbFOLDERS(2).fISN = fISN
        dbFOLDERS(2).fSTATUS = "1"
        dbFOLDERS(2).fCOM = "²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
        dbFOLDERS(2).fSPEC = "1²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 55555555555555"

    Set dbFOLDERS(3) = New_DB_FOLDERS()
        dbFOLDERS(3).fFOLDERID = "SSWork.CRIP20200101"
        dbFOLDERS(3).fNAME = "IPolicy "
        dbFOLDERS(3).fKEY = fISN
        dbFOLDERS(3).fISN = fISN
        dbFOLDERS(3).fSTATUS = "1"
        dbFOLDERS(3).fCOM = "²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
        dbFOLDERS(3).fSPEC = "55555555555555IP1 20200101            0.0077  00000009Üáñ å³ÛÙ³Ý³·Çñ      "  
        dbFOLDERS(3).fECOM = "Insurance Agreement"
        dbFOLDERS(3).fDCBRANCH = "00"
        dbFOLDERS(3).fDCDEPART = "1"
        
    Set dbFOLDERS(4) = New_DB_FOLDERS()
        dbFOLDERS(4).fFOLDERID = "SSConf.CRIP001"
        dbFOLDERS(4).fNAME = "IPolicy "
        dbFOLDERS(4).fKEY = fISN
        dbFOLDERS(4).fISN = fISN
        dbFOLDERS(4).fSTATUS = "4"
        dbFOLDERS(4).fCOM = "²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
        dbFOLDERS(4).fSPEC = "55555555555555IP1 20200101            0.0077  00000009"  
        dbFOLDERS(4).fECOM = "Insurance Agreement"
        dbFOLDERS(4).fDCBRANCH = "00"
        dbFOLDERS(4).fDCDEPART = "1"
    
    'After Delete
    Set dbFOLDERS(5) = New_DB_FOLDERS()
        dbFOLDERS(5).fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")
        dbFOLDERS(5).fNAME = "IPolicy "
        dbFOLDERS(5).fKEY = fISN
        dbFOLDERS(5).fISN = fISN
        dbFOLDERS(5).fSTATUS = "0"
        dbFOLDERS(5).fSPEC = Left_Align(Get_Compname_DOCLOG(fISN), 16)&"Cred&DepARMSOFT                       002  "
        dbFOLDERS(5).fDCBRANCH = "00"
        dbFOLDERS(5).fDCDEPART = "1"
        
    Set dbPOLICIES = New_DB_POLICIES()
        dbPOLICIES.fIPISN = fISN
        dbPOLICIES.fIPCODE = "55555555555555"
        dbPOLICIES.fSURETY = "00000009"
        dbPOLICIES.fINSCOMP = "00034854"
        dbPOLICIES.fDATEBEGIN = "2020-01-01"
        dbPOLICIES.fDATEEND = "2021-01-01"
        dbPOLICIES.fDATECLOSE = NULL
        dbPOLICIES.fIPTYPE = "2"
        dbPOLICIES.fIPSTATE = "1"
        dbPOLICIES.fNOTE = ""
        dbPOLICIES.fNOTE2 = ""
        dbPOLICIES.fNOTE3 = ""
        dbPOLICIES.fACSBRANCH = "00"
        dbPOLICIES.fACSDEPART = "1"
        dbPOLICIES.fACSTYPE = "IP1 "
End Sub

