'USEUNIT Library_Common  
'USEUNIT Library_Colour
'USEUNIT Library_Contracts 
'USEUNIT Constants
'USEUNIT Library_CheckDB
'USEUNIT Mortgage_Library
'USEUNIT Pledge_Library
Option Explicit

'Test Case N 154719

Dim fDATE, sDATE, folderName, rowCount, securities, row, securitiesRow, gridRows
Dim Working_Docs, Verification_Doc, goToAgreement, additionalOper, reletion
Dim fBODY, agrISN, dbo_CONTRACTS, dbo_FOLDERS(6), dbo_FOLDERSVerify(5), agrISN2, agrISN3, agrISN4, agrISN5, agrISN6

Sub ReceivedMortgage_Securities_Test()
    Call Test_Initialize()

    ' Ð³Ù³Ï³ñ· Ùáõïù ·áñÍ»É ARMSOFT û·ï³·áñÍáÕáí
    Log.Message "Համակարգ մուտք գործել ARMSOFT օգտագործողով", "", pmNormal, DivideColor
    Call Test_StartUp()
  
    ' êï³óí³Í ·ñ³í` ²ñÅ»ÃÕÃ»ñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ
    Log.Message "Ստացված գրավ՝ Արժեթղթեր պայմանագրի ստեղծում", "", pmNormal, DivideColor
    BuiltIn.Delay(2000)
    Call Create_Mortgage_Securities(folderName, securities, "²ñÅ»ÃÕÃ»ñ")
		
    ' êï³óí³Í ·ñ³í` ²ñÅ»ÃÕÃ»ñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
    Log.Message "Ստացված գրավ՝ Արժեթղթեր պայմանագրի ստաղծումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
    Call DB_Initialize()
    Call Check_DB_MortgageCreation()
		
    ' ä³ÛÙ³Ý³·ÇñÁ áõÕ³ñÏ»É Ñ³ëï³ïÙ³Ý
    Log.Message "Պայմանագիրը ուղարկել հաստատման", "", pmNormal, DivideColor
    Working_Docs.agreeN = securities.General.agreeN
    Call GoTo_SubsystemWorkingDocuments(folderName, Working_Docs)
    BuiltIn.Delay(3000)
    Call SendToVerify_Contrct(2, 5, "²Ûá")
		
    ' ä³ÛÙ³Ý³·ÇñÁ Ñ³ëï³ïÙ³Ý áõÕ³ñÏ»Éáõó Ñ»ïá SQL ëïáõ·áõÙ
    Log.Message "Պայմանագիրը հաստատման ուղարկելուց հետո SQL ստուգում", "", pmNormal, SqlDivideColor
    Call Check_DB_SendToVerify()
		
    ' ì³í»ñ³óÝ»É å³ÛÙ³Ý³·ñÇÁ
    Log.Message "Վավերացնել պայմանագիրը", "", pmNormal, DivideColor
    Verification_Doc.AgreementN = securities.General.agreeN
    Call Verify_Contract(folderName & "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I" , Verification_Doc) 
		
    ' ä³ÛÙ³Ý³·ñÇ í³í»ñ³óáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
    Log.Message "Պայմանագրի վավերացումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
    Call Check_DB_VerifyContract()
		
    ' ä³ÛÙ³Ý³·ñ»ñ ÃÕÃ³å³Ý³ÏáõÙ ÷³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ  
    Log.Message "Պայմանագրեր թղթապանակում փաստատթղթի առկայության ստուգում", "", pmNormal, DivideColor
    goToAgreement.AgreementN = securities.General.agreeN
    Call Check_AgreementExisting(folderName, goToAgreement)
		
    ' Èñ³óáõÙ 
    Log.Message "Լրացում", "", pmNormal, DivideColor
    Call Addition_Operation(additionalOper)
		
    BuiltIn.Delay(3000)
    wMDIClient.VBObject("frmPttel").Close

    ' ì³í»ñ³óÝ»É å³ÛÙ³Ý³·ñÇÁ
    Log.Message "Վավերացնել պայմանագիրը", "", pmNormal, DivideColor
    Call Verify_Contract(folderName & "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I" , Verification_Doc)

    ' Èñ³óáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
    Log.Message "Լրացումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
    Call Check_DB_Addition()
		
    ' Öß·ñïáõÙ/í»ñ³·Ý³Ñ³ïáõÙ
    Log.Message "Ճշգրտում/վերագնահատում", "", pmNormal, DivideColor
    Call GoTo_Contracts(folderName, goToAgreement)
    BuiltIn.Delay(3000)
    agrISN3 = RevaluationDepPledge("17/03/21", 100000, 1)
		
    ' Öß·ñïáõÙ/í»ñ³·Ý³Ñ³ïáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
    Log.Message "Ճշգրտում/վերագնահատումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
    Call Check_DB_Revaluation()
		
    ' îñ³Ù³¹ñáõÙ
    Log.Message "Տրամադրում", "", pmNormal, DivideColor
    agrISN4 = Provide_Mortgage("18/03/21")
		
    ' îñ³Ù³¹ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
    Log.Message "Տրամադրումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
    Call Check_DB_Provide()
		
    ' ì»ñ³¹³ñÓ
    Log.Message "Վերադարձ", "", pmNormal, DivideColor
    agrISN5 = Mortgage_Return("19/03/21")
		
    ' ì»ñ³¹³ñÓÇó Ñ»ïá SQL ëïáõ·áõÙ
    Log.Message "Վերադարձից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
    Call Check_DB_MortgageReturn()
		
    ' ä³ÛÙ³Ý³·ñÇ Ï³å³ÏóáõÙ
    Log.Message "Պայմանագրի կապակցում", "", pmNormal, DivideColor
    agrISN6 = Reletion_Operation(reletion)
		
    ' ä³ÛÙ³Ý³·ñÇ Ï³å³ÏóáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
    Log.Message "Պայմանագրի կապակցումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
    Call Check_DB_Reletion()
		
    ' ä³ÛÙ³Ý³·ñÇ ÷³ÏáõÙ
    Log.Message "Պայմանագրի փակում", "", pmNormal, DivideColor
    Call Close_Agr(Date())
  
    ' ä³ÛÙ³Ý³·ñÇ µ³óáõÙ
    Log.Message "Պայմանագրի բացում", "", pmNormal, DivideColor
    Call Open_Agr()
		
    ' æÝç»É å³ÛÙ³Ý³·ÇñÁ
    Log.Message "Ջնջել պայմանագիրը", "", pmNormal, DivideColor
    Call SearchInPttel("frmPttel", 1, securities.general.agreeN)
    Call Delete()
		
    ' ä³ÛÙ³Ý³·ñÇ æÝç»Éáõó Ñ»ïá SQL ëïáõ·áõÙ
    Log.Message "Պայմանագրի ջնջելուց հետո SQL ստուգում", "", pmNormal, SqlDivideColor
    Call Check_DB_Delete()
		
    BuiltIn.Delay(3000)
    wMDIClient.VBObject("frmPttel").Close
		
    Call Close_AsBank()    
End Sub

Sub Test_StartUp()
		Call Initialize_AsBank("bank", sDATE, fDATE)
    Login("ARMSOFT")
		Call ChangeWorkspace(c_Subsystems)
End	Sub

Sub Test_Initialize()
    folderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²å³Ñáíí³ÍáõÃÛáõÝ|êï³óí³Í ·ñ³í|"
	
    sDATE = "20030101"
    fDATE = "20260101"  
		
    Set securities = New_Mortgage_Securities(2)
    With securities
        .general.agreeType = "11"
        .general.agreeN = ""
        .general.insuranceAgreeN.agreeN = "V-000241"
        .general.insuranceAgreeN.searchedValue = "V-000241"
        .general.client = "00000090"
        .general.clientName = "Ð³ßí»ï»ñ 00000090"
        .general.includeInterests = 1
        .general.ratio = "10"
        .general.comment = "²Ýëå³ë»ÉÇ ÙÇ Ï³ï³Õ»óñ»ù ²Ýëå³ë Î³ï³Õ»óÛ³ÝÇÝ"
        .general.signingDate = "12/03/21"
        .general.allocationDate = "12/03/21"
        .general.office = "01"
        .general.department = "3"
        .general.accessType = "N10"	
        securitiesRow = 1
        .mortgageSubject.mortgageLocation = "2"
        .mortgageSubject.thingsGrid(0, 0) = "000"
        .mortgageSubject.thingsGrid(0, 1) = "S-0033"
        .mortgageSubject.thingsGrid(0, 2) = "CB15052C05"
        .mortgageSubject.thingsGrid(0, 3) = 1
        .mortgageSubject.thingsGrid(0, 4) = ""
        .mortgageSubject.thingsGrid(1, 0) = "000"
        .mortgageSubject.thingsGrid(1, 1) = "S-0034"
        .mortgageSubject.thingsGrid(1, 2) = "AMGM6016B091"
        .mortgageSubject.thingsGrid(1, 3) = 1
        .mortgageSubject.thingsGrid(1, 4) = ""
        .additional.restrictAvilability = 1
        .additional.riskWeight = "20"
        .additional.CRD = 1
        .additional.fulctCoefficient = "7"
        .additional.subjectACRA = "07"
        .additional.subjectNewLR = "12"
        .additional.agreePaperN = "00000090"
    End With
		
    Set Working_Docs = New_SubsystemWorkingDocuments()
    Working_Docs.agreeN = securities.General.agreeN
		
    Set Verification_Doc = New_VerifyContract()
    Verification_Doc.AgreementN = securities.General.agreeN
		
    Set goToAgreement = New_ContractsFilter()
    goToAgreement.AgreementN = securities.General.agreeN
    goToAgreement.ShowClosed = 1
    goToAgreement.AgreementLevelExist = false
    goToAgreement.Mortgage = true
		
    Set additionalOper = New_Addition(1)
    additionalOper.date = "16/03/21"
    additionalOper.agreems(0, 0) = "001"
    additionalOper.agreems(0, 1) = "S-0024"
    additionalOper.agreems(0, 2) = "AMGM48905470"
    additionalOper.agreems(0, 3) = 1
    additionalOper.agreems(0, 4) = ""
    additionalOper.agreems(0, 5) = 0
		
    Set reletion = New_InsuranceAgreeN()
    reletion.searchedValue = "V-000252"
End Sub

Sub DB_Initialize()
    Dim i
    Set dbo_CONTRACTS = New_DB_CONTRACTS()
    dbo_CONTRACTS.fDGISN = securities.fISN
    dbo_CONTRACTS.fDGPARENTISN = securities.fISN
    dbo_CONTRACTS.fDGISN1 = securities.fISN
    dbo_CONTRACTS.fDGISN3 = 0 'securities.fISN
    dbo_CONTRACTS.fDGAGRKIND = 1
    dbo_CONTRACTS.fDGSTATE = 1
    dbo_CONTRACTS.fDGTYPENAME = "N1StSec "
    dbo_CONTRACTS.fDGCODE = securities.general.agreeN
    dbo_CONTRACTS.fDGPPRCODE = "00000090"
    dbo_CONTRACTS.fDGCAPTION = "Ð³ßí»ï»ñ 00000090"
    dbo_CONTRACTS.fDGCLICODE = "00000090"
    dbo_CONTRACTS.fDGSUMMA = "0.00"
    dbo_CONTRACTS.fDGALLSUMMA = "0.00"
    dbo_CONTRACTS.fDGRISKDEGREE = "20.00"
    dbo_CONTRACTS.fDGRISKDEGNB = "0.00"
    dbo_CONTRACTS.fDGACSBRANCH = "01 "
    dbo_CONTRACTS.fDGACSDEPART = "3  "
    dbo_CONTRACTS.fDGACSTYPE = "N10 "
    dbo_CONTRACTS.fDGMORTSUBJECT = "12"
    dbo_CONTRACTS.fDGACRANOTE = "07"
		
    agrISN = Get_ColumnValueSQL("DOCP", "fISN", "fPARENTISN = " & securities.fISN)
		
    For i = 0 to 5
        Set dbo_FOLDERS(i) = New_DB_FOLDERS()
        dbo_FOLDERS(i).fKEY = securities.fISN
        dbo_FOLDERS(i).fISN = securities.fISN
        dbo_FOLDERS(i).fNAME = "N1StSec "
        dbo_FOLDERS(i).fSTATUS = "1"
    Next
    dbo_FOLDERS(0).fFOLDERID = "Agr.876586227"
    dbo_FOLDERS(0).fCOM = "¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ"
    dbo_FOLDERS(0).fSPEC = "1¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ (Ý³Ë³·ÇÍ)- " & securities.general.agreeN & "         V-000241       "
    dbo_FOLDERS(1).fFOLDERID = "C.1628350"
    dbo_FOLDERS(1).fCOM = "¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ (Ý³Ë³·ÇÍ)"
    dbo_FOLDERS(1).fSPEC = securities.general.agreeN & " (Ð³ßí»ï»ñ 00000090)  "
    dbo_FOLDERS(2).fFOLDERID = "C.1628398"
    dbo_FOLDERS(2).fCOM = "¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ (Ý³Ë³·ÇÍ)"
    dbo_FOLDERS(2).fSPEC = securities.general.agreeN & " (Ð³ßí»ï»ñ 00000090)  "
    dbo_FOLDERS(3).fFOLDERID = "Mort." & securities.fISN
    dbo_FOLDERS(3).fCOM = "¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ"
    dbo_FOLDERS(3).fSPEC = "1¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ- " & securities.general.agreeN & " {Ð³ßí»ï»ñ 00000090} "
    dbo_FOLDERS(4).fFOLDERID = "NADDITINFO"
    dbo_FOLDERS(4).fCOM = "Ð³ßí»ï»ñ 00000090"
    dbo_FOLDERS(4).fSPEC = "11" & securities.general.agreeN
    dbo_FOLDERS(5).fFOLDERID = "SSWork.CRN120210312"
    dbo_FOLDERS(5).fCOM = "¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ"
    dbo_FOLDERS(5).fSPEC = securities.general.agreeN & "        N10 20210312            0.0077  00000090Üáñ å³ÛÙ³Ý³·Çñ      "
    dbo_FOLDERS(5).fECOM = "Mortgage Agreement: Securities"
    dbo_FOLDERS(5).fDCBRANCH = "01 "
    dbo_FOLDERS(5).fDCDEPART = "3  "
		
    For i = 0 to 4
    Set dbo_FOLDERSVerify(i) = New_DB_FOLDERS()
    dbo_FOLDERSVerify(i).fKEY = securities.fISN
    dbo_FOLDERSVerify(i).fISN = securities.fISN
    dbo_FOLDERSVerify(i).fCOM = "¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ"
    dbo_FOLDERSVerify(i).fNAME = "N1StSec "
    dbo_FOLDERSVerify(i).fSTATUS = "1"
    Next
    dbo_FOLDERSVerify(0).fFOLDERID = "Agr.876586227"
    dbo_FOLDERSVerify(0).fSPEC = "1¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ- " & securities.general.agreeN & "         V-000241       "
    dbo_FOLDERSVerify(1).fFOLDERID = "C.1628350"
    dbo_FOLDERSVerify(1).fSPEC = securities.general.agreeN & " (Ð³ßí»ï»ñ 00000090)  "
    dbo_FOLDERSVerify(2).fFOLDERID = "C.1628398"
    dbo_FOLDERSVerify(2).fSPEC = securities.general.agreeN & " (Ð³ßí»ï»ñ 00000090)  "
    dbo_FOLDERSVerify(3).fFOLDERID = "Mort." & securities.fISN
    dbo_FOLDERSVerify(3).fSPEC = "1¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ- " & securities.general.agreeN & " {Ð³ßí»ï»ñ 00000090} "
    dbo_FOLDERSVerify(4).fFOLDERID = "NADDITINFO"
    dbo_FOLDERSVerify(4).fCOM = "Ð³ßí»ï»ñ 00000090"
    dbo_FOLDERSVerify(4).fSPEC = "11" & securities.general.agreeN
End	Sub

Sub Check_DB_MortgageCreation()
    Dim i
    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", securities.fISN, 1)
    Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
		
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", securities.fISN, 1)
    Call CheckDB_DOCLOG(securities.fISN, "77", "N", "1", "", 1)
  
    'SQL Ստուգում DOCP աղյուսակում  
    Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCP", "fPARENTISN", securities.fISN, 1)
    Call CheckDB_DOCP(agrISN, "REMINDER", securities.fISN, 1)
  
    'SQL Ստուգում DOCS աղյուսակում 
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " TRNSINNB:1 SECTYPE:11 CODE:" & securities.general.agreeN & " CODESS:V-000241 CODESSISN:876586227 CLICODSS:00000036 CLICOD:00000090 NAME:Ð³ßí»ï»ñ 00000090 WITHPER:1 RATIO:10 COMMENT:²Ýëå³ë»ÉÇ ÙÇ Ï³ï³Õ»óñ»ù ²Ýëå³ë Î³ï³Õ»óÛ³ÝÇÝ DATE:20210312 DATEGIVE:20210312 ACSBRANCH:01 ACSDEPART:3 ACSTYPE:N10 FILLSEC:0 PLACE:2 LIMITEDRISK:1 RISKDEGREE:20 VRZM:1 VARIATION:7 ACRANOTE:07 MORTSUBJECT:12 PPRCODE:00000090 GIVEN:0 "
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", securities.fISN, 1)
    Call CheckDB_DOCS(securities.fISN, "N1StSec ", "1", fBODY, 1)
  
    'SQL Ստուգում DOCSG աղյուսակում 
    Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCSG", "fISN", securities.fISN, 10)
  
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("FOLDERS", "fISN", securities.fISN, 6)
    For i = 0 to 5
        Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
    Next
  
    'SQL Ստուգում RESNUMBERS աղյուսակում 
    Log.Message "SQL Ստուգում RESNUMBERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("RESNUMBERS", "fISN", securities.fISN, 1)
    Call CheckDB_RESNUMBERS(securities.fISN, "N ", securities.general.agreeN, 1)		
End	Sub

Sub Check_DB_SendToVerify()
    Dim i		
    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    dbo_CONTRACTS.fDGSTATE = 101
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", securities.fISN, 1)
    Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", securities.fISN, 3)
    Call CheckDB_DOCLOG(securities.fISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
    Call CheckDB_DOCLOG(securities.fISN, "77", "C", "101", "", 1)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCS", "fISN", securities.fISN, 1)
    Call CheckDB_DOCS(securities.fISN, "N1StSec ", "101", fBODY, 1)
  
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		
    Set dbo_FOLDERS(6) = New_DB_FOLDERS()
        dbo_FOLDERS(6).fKEY = securities.fISN
        dbo_FOLDERS(6).fISN = securities.fISN
        dbo_FOLDERS(6).fNAME = "N1StSec "
        dbo_FOLDERS(6).fSTATUS = "4"
        dbo_FOLDERS(6).fFOLDERID = "SSConf.CRN1001" 
        dbo_FOLDERS(6).fCOM = "¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ"
        dbo_FOLDERS(6).fSPEC = securities.general.agreeN & "        N10 20210312            0.0077  00000090"
        dbo_FOLDERS(6).fECOM = "Mortgage Agreement: Securities"
        dbo_FOLDERS(6).fDCBRANCH = "01 "
        dbo_FOLDERS(6).fDCDEPART = "3  "
    Call CheckQueryRowCount("FOLDERS", "fISN", securities.fISN, 7)
    Call CheckDB_FOLDERS(dbo_FOLDERS(6), 1)
End	Sub

Sub Check_DB_VerifyContract()
    Dim i  
    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    dbo_CONTRACTS.fDGSTATE = 7
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", securities.fISN, 1)
    Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
		
    'SQL Ստուգում NAGRACCS աղյուսակում 
    '  Log.Message "SQL Ստուգում NAGRACCS աղյուսակում", "", pmNormal, SqlDivideColor
    '    Call CheckQueryRowCount("NAGRACCS", "fACCMAGR", "8100100/900077", 2)

    'SQL Ստուգում NBACCOUNTS աղյուսակում 
    Log.Message "SQL Ստուգում NBACCOUNTS աղյուսակում", "", pmNormal, SqlDivideColor
    agrISN2 = Get_ColumnValueSQL("NBACCOUNTS", "fISN", "fCLICODE = 00000090 and fACCTYPE = 26")
    Call CheckQueryRowCount("NBACCOUNTS", "fISN", agrISN2, 1)
  
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", securities.fISN, 5)
    Call CheckDB_DOCLOG(securities.fISN, "77", "N", "1", "", 1)
    Call CheckDB_DOCLOG(securities.fISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
    Call CheckDB_DOCLOG(securities.fISN, "77", "C", "101", "", 1)
    Call CheckDB_DOCLOG(securities.fISN, "77", "W", "102", "", 1)
    Call CheckDB_DOCLOG(securities.fISN, "77", "C", "7", "", 1)
  
    'SQL Ստուգում DOCP աղյուսակում  
    Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCP", "fPARENTISN", securities.fISN, 3)
		
    'SQL Ստուգում DOCSG աղյուսակում  
    Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCSG", "fISN", securities.fISN, 12)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCS", "fISN", securities.fISN, 1)
    Call CheckDB_DOCS(securities.fISN, "N1StSec ", "7", fBODY, 1)
  
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("FOLDERS", "fISN", securities.fISN, 5)
    For i = 0 to 4
    Call CheckDB_FOLDERS(dbo_FOLDERSVerify(i), 1)
    Next
  
    'SQL Ստուգում HIF  աղյուսակում 
    Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIF", "fACR", securities.fISN, 2)
		
    'SQL Ստուգում HIREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIREST", "fOBJECT", agrISN2, 1)
End	Sub

Sub Check_DB_Addition()
    Dim i  
    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", securities.fISN, 1)
    Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
		
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", securities.fISN, 5)
    Call CheckQueryRowCount("DOCLOG", "fISN", additionalOper.isn, 5)
    Call CheckDB_DOCLOG(additionalOper.isn, "77", "N", "1", "", 1)
    Call CheckDB_DOCLOG(additionalOper.isn, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
    Call CheckDB_DOCLOG(additionalOper.isn, "77", "C", "101", "", 1)
    Call CheckDB_DOCLOG(additionalOper.isn, "77", "W", "102", "", 1)
    Call CheckDB_DOCLOG(additionalOper.isn, "77", "C", "7", "", 1)
    Call CheckQueryRowCount("DOCLOG", "fISN", agrISN, 1)
    Call CheckQueryRowCount("DOCLOG", "fISN", agrISN2, 2)
  
    'SQL Ստուգում DOCP աղյուսակում  
    Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCP", "fPARENTISN", securities.fISN, 4)
		
    'SQL Ստուգում DOCSG աղյուսակում  
    Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCSG", "fISN", additionalOper.isn, 8)
    Call CheckQueryRowCount("DOCSG", "fISN", securities.fISN, 12)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCS", "fISN", securities.fISN, 1)
    Call CheckDB_DOCS(securities.fISN, "N1StSec ", "7", fBODY, 1)
    fBODY = " CODE:" & securities.general.agreeN & " CLICOD:00000090 FILLSEC:0 COMMENT:Èñ³óáõÙ (ëï³ó.³ñÅ»ÃÕÃÇ ·ñ³í) "
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", additionalOper.isn, 1)
    Call CheckDB_DOCS(additionalOper.isn, "N1Addit ", "7", fBODY, 1)
    fBODY = " FOLDIDBEG:Mort. FIXEDKEY:0 REMIND:0 "
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", agrISN, 1)
    Call CheckDB_DOCS(agrISN, "REMINDER", "1", fBODY, 1)
    fBODY = "  CODBAL:8100100  CLICOD:00000090  NAME:Ð³ßí»ï»ñ 00000090  ENAME:Client 00000090  CODVAL:000  ACCTYPE:26  COUNT:1  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:26  ULIMIT:999999999999.99  CODBAL2:999998  CODBAL3:999998  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", agrISN2, 1)
    Call CheckDB_DOCS(agrISN2, "NBAcc   ", "2", fBODY, 1)
  
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("FOLDERS", "fISN", securities.fISN, 5)
    Call CheckQueryRowCount("FOLDERS", "fISN", additionalOper.isn, 2)
    Call CheckQueryRowCount("FOLDERS", "fISN", agrISN, 1)
    Call CheckQueryRowCount("FOLDERS", "fISN", agrISN2, 1)
    For i = 0 to 2
        Set dbo_FOLDERSVerify(i) = New_DB_FOLDERS()
        dbo_FOLDERSVerify(i).fKEY = additionalOper.isn
        dbo_FOLDERSVerify(i).fISN = additionalOper.isn
        dbo_FOLDERSVerify(i).fCOM = "Èñ³óáõÙ (ëï³ó.³ñÅ»ÃÕÃÇ ·ñ³í)"
        dbo_FOLDERSVerify(i).fNAME = "N1Addit "
        dbo_FOLDERSVerify(i).fSTATUS = "1"
    Next
    dbo_FOLDERSVerify(0).fFOLDERID = "ADDITIONS"
    dbo_FOLDERSVerify(0).fSPEC = aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & Right_Align(securities.fISN, 10)
    dbo_FOLDERSVerify(1).fFOLDERID = "Mort." & securities.fISN
    dbo_FOLDERSVerify(1).fSPEC = "1Èñ³óáõÙ (ëï³ó.³ñÅ»ÃÕÃÇ ·ñ³í)- " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")
    dbo_FOLDERSVerify(2).fKEY = "REMINDER"
    dbo_FOLDERSVerify(2).fISN = agrISN
    dbo_FOLDERSVerify(2).fCOM = "ÐÇß»óáõÙ-"
    dbo_FOLDERSVerify(2).fNAME = "REMINDER"
    dbo_FOLDERSVerify(2).fSTATUS = "1"
    dbo_FOLDERSVerify(2).fFOLDERID = "Mort." & securities.fISN
    dbo_FOLDERSVerify(2).fSPEC = "1ÐÇß»óáõÙ   -   "
    dbo_FOLDERSVerify(2).fECOM = "Notice-"
    dbo_FOLDERSVerify(3).fKEY = agrISN2
    dbo_FOLDERSVerify(3).fISN = agrISN2
    dbo_FOLDERSVerify(3).fCOM = " º/Ð Ñ³ßÇí"
    dbo_FOLDERSVerify(3).fNAME = "NBAcc   "
    dbo_FOLDERSVerify(3).fSTATUS = "1"
    dbo_FOLDERSVerify(3).fFOLDERID = "C.1628398"
    dbo_FOLDERSVerify(3).fSPEC = "900077       ²ñÅ.- 000  îÇå- 26  Ð/Ð³ßÇí- 8100100   ²Ýí³ÝáõÙ-Ð³ßí»ï»ñ 00000090"
    dbo_FOLDERSVerify(3).fECOM = " Balance-Out Account"
    For i = 0 to 3
    BuiltIn.Delay(1000)
    Call CheckDB_FOLDERS(dbo_FOLDERSVerify(i), 1)
    Next
  
    'SQL Ստուգում HIF  աղյուսակում 
    Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIF", "fACR", securities.fISN, 3)
		
    'SQL Ստուգում NAGRACCS աղյուսակում 
    '  Log.Message "SQL Ստուգում NAGRACCS աղյուսակում", "", pmNormal, SqlDivideColor
    '    Call CheckQueryRowCount("NAGRACCS", "fACCMAGR", "8100100/900077", 3)
End	Sub

Sub Check_DB_Revaluation()
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", agrISN3, 3)
    Call CheckDB_DOCLOG(agrISN3, "77", "N", "1", "", 1)
    Call CheckDB_DOCLOG(agrISN3, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
    Call CheckDB_DOCLOG(agrISN3, "77", "C", "5", "", 1)
 
    'SQL Ստուգում DOCSG աղյուսակում  
    Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCSG", "fISN", agrISN3, 8)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & securities.general.agreeN & " DATE:20210317 COMMENT:¶ñ³íÇ ³ñÅ»ùÇ ×ß·ñïáõÙ/í»ñ³·Ý³Ñ³ïáõÙ ACSBRANCH:00 ACSDEPART:1 ACSTYPE:N10 USERID:  77 " 
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", agrISN3, 1)
    Call CheckDB_DOCS(agrISN3, "N1DSMAjM", "5", fBODY, 1)
End	Sub

Sub Check_DB_Provide()
    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", securities.fISN, 1)
    Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)

    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", agrISN4, 3)
    Call CheckDB_DOCLOG(agrISN4, "77", "N", "1", "", 1)
    Call CheckDB_DOCLOG(agrISN4, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
    Call CheckDB_DOCLOG(agrISN4, "77", "C", "5", "", 1)
 
    'SQL Ստուգում DOCSG աղյուսակում  
    Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCSG", "fISN", agrISN4, 8)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & securities.general.agreeN & " DATE:20210318 COMMENT:¶ñ³íÇ ïñ³Ù³¹ñáõÙ ACSBRANCH:00 ACSDEPART:1 ACSTYPE:N10 USERID:  77  "  
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", agrISN4, 1)
    Call CheckDB_DOCS(agrISN4, "N1DSMInM", "5", fBODY, 1)
    End	Sub

    Sub Check_DB_MortgageReturn() 
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", agrISN5, 3)
    Call CheckDB_DOCLOG(agrISN5, "77", "N", "1", "", 1)
    Call CheckDB_DOCLOG(agrISN5, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
    Call CheckDB_DOCLOG(agrISN5, "77", "C", "5", "", 1)
 
    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & securities.general.agreeN & " DATE:20210319 COMMENT:¶ñ³íÇ í»ñ³¹³ñÓ ACSBRANCH:00 ACSDEPART:1 ACSTYPE:N10 USERID:  77 "  
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", agrISN5, 1)
    Call CheckDB_DOCS(agrISN5, "N1DSMOtM", "5", fBODY, 1)
End	Sub

Sub Check_DB_Reletion()
    Dim i
    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", securities.fISN, 1)
    Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)

    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", agrISN6, 9)
    Call CheckDB_DOCLOG(agrISN6, "77", "R", "7", "", 2)
    Call CheckDB_DOCLOG(agrISN6, "77", "E", "7", "", 2)
 
    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " TRNSINNB:1 SECTYPE:11 CODE:" & securities.general.agreeN & " CODESS:V-000252 CODESSISN:540090593 CLICODSS:00000207 CLICOD:00000090 NAME:Ð³ßí»ï»ñ 00000090 WITHPER:1 RATIO:10 COMMENT:²Ýëå³ë»ÉÇ ÙÇ Ï³ï³Õ»óñ»ù ²Ýëå³ë Î³ï³Õ»óÛ³ÝÇÝ DATE:20210312 DATEGIVE:20210312 ACSBRANCH:01 ACSDEPART:3 ACSTYPE:N10 FILLSEC:0 PLACE:2 LIMITEDRISK:1 RISKDEGREE:20 VRZM:1 VARIATION:7 ACRANOTE:07 MORTSUBJECT:12 PPRCODE:00000090 GIVEN:1 "   
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", agrISN6, 1)
    Call CheckDB_DOCS(agrISN6, "N1StSec ", "7", fBODY, 1)
		
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("FOLDERS", "fISN", agrISN6, 5)
    For i = 0 to 4
        Set dbo_FOLDERSVerify(i) = New_DB_FOLDERS()
        dbo_FOLDERSVerify(i).fKEY = securities.fISN
        dbo_FOLDERSVerify(i).fISN = securities.fISN
        dbo_FOLDERSVerify(i).fCOM = "¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ"
        dbo_FOLDERSVerify(i).fNAME = "N1StSec "
        dbo_FOLDERSVerify(i).fSTATUS = "1"
    Next
    dbo_FOLDERSVerify(0).fFOLDERID = "Agr.540090593"
    dbo_FOLDERSVerify(0).fSPEC = "1¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ- " & securities.general.agreeN & "         V-000252       "
    dbo_FOLDERSVerify(1).fFOLDERID = "C.1628398"
    dbo_FOLDERSVerify(1).fSPEC = securities.general.agreeN & " (Ð³ßí»ï»ñ 00000090)  "
    dbo_FOLDERSVerify(2).fFOLDERID = "C.1724487"
    dbo_FOLDERSVerify(2).fSPEC = securities.general.agreeN & " (Ð³ßí»ï»ñ 00000090)  "
    dbo_FOLDERSVerify(3).fFOLDERID = "Mort." & securities.fISN
    dbo_FOLDERSVerify(3).fSPEC = "1¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ñÅ»ÃÕÃ»ñ- " & securities.general.agreeN & " {Ð³ßí»ï»ñ 00000090} "
    dbo_FOLDERSVerify(4).fFOLDERID = "NADDITINFO"
    dbo_FOLDERSVerify(4).fCOM = "Ð³ßí»ï»ñ 00000090"
    dbo_FOLDERSVerify(4).fSPEC = "11" & securities.general.agreeN
    For i = 0 to 4
        Call CheckDB_FOLDERS(dbo_FOLDERSVerify(i), 1)
    Next
		
    'SQL Ստուգում DCR աղյուսակում 
    Log.Message "SQL Ստուգում DCR աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DCR", "fISN", agrISN6, 1)
		
    'SQL Ստուգում DCR_FIELDS աղյուսակում 
    Log.Message "SQL Ստուգում DCR_FIELDS աղյուսակում", "", pmNormal, SqlDivideColor
    Call GetSQL_ColumnValue("DCR", "fISN", agrISN6, "fDCRID")
    Call CheckQueryRowCount("DCR_FIELDS", "fDCRID", Get_ColumnValueSQL("DCR", "fDCRID", "fISN = " & agrISN6), 3)
End	Sub

Sub Check_DB_Delete()
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", securities.fISN, 15)
    Call CheckDB_DOCLOG(securities.fISN, "77", "R", "7", "", 4)
    Call CheckDB_DOCLOG(securities.fISN, "77", "C", "7", "", 3)
    Call CheckDB_DOCLOG(securities.fISN, "77", "M", "77", "ä³ÛÙ³Ý³·ñÇ ÷³ÏáõÙ", 1)
    Call CheckDB_DOCLOG(securities.fISN, "77", "M", "67", "ä³ÛÙ³Ý³·ñÇ µ³óáõÙ", 1)
    Call CheckDB_DOCLOG(securities.fISN, "77", "D", "999", "", 1)
 
    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCS", "fISN", securities.fISN, 1)
    Call CheckDB_DOCS(securities.fISN, "N1StSec ", "999", fBODY, 1)
		
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("FOLDERS", "fISN", securities.fISN, 1)
    Set dbo_FOLDERS(0) = New_DB_FOLDERS()
        dbo_FOLDERS(0).fKEY = securities.fISN
        dbo_FOLDERS(0).fISN = securities.fISN
        dbo_FOLDERS(0).fSTATUS = "0"
        dbo_FOLDERS(0).fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")
        dbo_FOLDERS(0).fCOM = ""
        dbo_FOLDERS(0).fECOM = ""
        dbo_FOLDERS(0).fSPEC = Left_Align(Get_Compname_DOCLOG(securities.fISN), 16) & "Cred&DepARMSOFT                       007  "
        dbo_FOLDERS(0).fDCBRANCH = "01 "
        dbo_FOLDERS(0).fDCDEPART = "3  "
        dbo_FOLDERS(0).fNAME = "N1StSec "
    Call CheckDB_FOLDERS(dbo_FOLDERS(0), 1)
End	Sub