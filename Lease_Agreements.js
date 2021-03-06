'USEUNIT Library_Common  
'USEUNIT Library_Colour
'USEUNIT Library_Contracts 
'USEUNIT Constants
'USEUNIT Library_CheckDB
'USEUNIT Deposit_Contract_Library
'USEUNIT Mortgage_Library
'USEUNIT Akreditiv_Library
Option Explicit

'Test Case N 152287

Dim fDATE, sDATE, folderName, fBase, summ, agreementAllOperations, documentType
Dim leaseAgreement, fill_date, Working_Docs, Verification_Doc, goToAgreement, accuralOfExpDates
Dim dbo_LEASES, dbo_FOLDERS(5), fBODY, i, leaseAgreement2

Sub Lease_Agreement_Test()
  Call Test_Initialize()

		' Ð³Ù³Ï³ñ· Ùáõïù ·áñÍ»É ARMSOFT û·ï³·áñÍáÕáí
		Log.Message "Համակարգ մուտք գործել ARMSOFT օգտագործողով", "", pmNormal, DivideColor
  Call Test_StartUp()
  
  ' ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ
		Log.Message "Վարձակալության պայմանագրի ստեղծում", "", pmNormal, DivideColor
		Call Create_LeaseAgreement(folderName, leaseAgreement)
		
		' ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Վարձակալության պայմանագրի ստաղծումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call DB_Initialize()
		Call Check_DB_LeaseAgreeCreation()
		
		' Ø³ñÙ³Ý ·ñ³ýÇÏÇ Ýß³Ý³ÏáõÙ 
		Log.Message "Մարման գրաֆիկի նշանակում", "", pmNormal, DivideColor
		Call RepaymentSchedule_Assignment("16/02/21", 1, fill_date, fBase)
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' Ø³ñÙ³Ý ·ñ³ýÇÏÇ Ýß³Ý³ÏáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Մարման գրաֆիկի նշանակումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_RepaySchedulAssign()
		
		' ä³ÛÙ³Ý³·ÇñÁ áõÕ³ñÏ»É Ñ³ëï³ïÙ³Ý
		Log.Message "Պայմանագիրը ուղարկել հաստատման", "", pmNormal, DivideColor
		Call GoTo_SubsystemWorkingDocuments(folderName, Working_Docs)
    BuiltIn.Delay(3000)
		Call SendToVerify_Contrct(2, 5, "²Ûá")
		
		' ä³ÛÙ³Ý³Ç·ñÁ Ñ³ëï³ïÙ³Ý áõÕ³ñÏáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պայմանագրիտ հաստատման ուղարկումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_SendToVerify()
		
		' ì³í»ñ³óÝ»É å³ÛÙ³Ý³·ñÇÁ
		Log.Message "Վավերացնել պայմանագիրը", "", pmNormal, DivideColor
		Call Verify_Contract(folderName & "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I" , Verification_Doc) 
		
		' ä³ÛÙ³Ý³·ñÇ í³í»ñ³óáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պայմանագրի վավերացումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_VerifyContract()
		
		' ä³ÛÙ³Ý³·ñ»ñ ÃÕÃ³å³Ý³ÏáõÙ ÷³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ  
		Log.Message "Պայմանագրեր թղթապանակում փաստատթղթի առկայության ստուգում", "", pmNormal, DivideColor
		Call Check_AgreementExisting(folderName, goToAgreement)
		
		' Ì³Ëë»ñÇ Ñ³ßí»·ñáõÙ
		Log.Message "Ծախսերի հաշվեգրում", "", pmNormal, DivideColor
		Call Accrual_Of_Expenses("16/02/21", "16/02/21", "", "", fBase)
		
		' Ì³Ëë»ñÇ Ñ³ßí»·ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Ծախսերի հաշվեգրումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_AccuralOfEpenses()
		
		' ì»ñ³ÏÝùáõÙ
		Log.Message "Վերակնքում", "", pmNormal, DivideColor
		Call Reconclude(leaseAgreement2)
		
		' ì»ñ³ÏÝùáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Վերակնքումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_Reconclude()
		
		' ä³ÛÙ³Ý³·ñÇ ÷³ÏáõÙ
		Log.Message "Պայմանագրի փակում", "", pmNormal, DivideColor
		Call CloseContract("21/03/21")
  
		' ä³ÛÙ³Ý³·ñÇ µ³óáõÙ
		Log.Message "Պայմանագրի բացում", "", pmNormal, DivideColor
		Call OpenContract()
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		'æÝç»É ì»ñ³ÏÝùí³Í å³ÛÙ³Ý³·ÇñÁ
		Log.Message "Ջնջել Վերակնքված պայմանագիրը", "", pmNormal, DivideColor
		Working_Docs.agreeN = leaseAgreement2.general.agreeN
		Call GoTo_SubsystemWorkingDocuments(folderName, Working_Docs)
    BuiltIn.Delay(3000)
		Call SearchAndDelete("frmPttel", 2, leaseAgreement2.general.agreeN, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' ì»ñ³ÏÝùí³Í å³ÛÙ³Ý³·ñÇ çÝçáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Վերակնքված պայմանագիր ջնջումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_DeleteReconclude()
				
		'æÝç»É Ì³Ëë»ñÇ Ñ³ßí»·ñÙ³Ý ³Ùë³Ãí»ñÁ
		Log.Message "Ջնջել Ծախսերի հաշվեգրման ամսաթվերը", "", pmNormal, DivideColor
		Working_Docs.agreeN = leaseAgreement.general.agreeN
		Call GoTo_AgreementsCommomFilter(folderName & "¶áñÍáÕáõÃÛáõÝÝ»ñ, ÷á÷áËáõÃÛáõÝÝ»ñ|", "Ì³Ëë»ñÇ Ñ³ßí»·ñÙ³Ý ³Ùë³Ãí»ñ", accuralOfExpDates)
    BuiltIn.Delay(3000)
		Call SearchAndDelete("frmPttel", 0, leaseAgreement.general.agreeN, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' Ì³Ëë»ñÇ Ñ³ßí»·ñÙ³Ý ³Ùë³Ãí»ñÇ çÝáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Ծախսերի հաշվեգրման ամսաթվերի ջնջումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_DeleteAccuralOfExpenses()
		
		'æÝç»É ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·ÇñÁ
		Log.Message "Ջնջել Վարձակալության պայմանագիրը", "", pmNormal, DivideColor
		Call GoTo_Contracts(folderName, goToAgreement)
    BuiltIn.Delay(3000)
		Call SearchAndDelete("frmPttel", 0, leaseAgreement.general.agreeN, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·ñÇ çÝçáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Վարձակալության պայմանագրի ջնջումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_DeleteLeaseAgree()
		
  Call Close_AsBank()    
End Sub

Sub Test_StartUp()
		Call Initialize_AsBank("bank", sDATE, fDATE)
  Login("ARMSOFT")
		Call ChangeWorkspace(c_Subsystems)
End	Sub

Sub Test_Initialize()
		folderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñ|"
	
		sDATE = "20030101"
		fDATE = "20260101"  

		Set leaseAgreement = New_LeaseAgreements()
		with leaseAgreement
				.general.agreeType = "1"
				.general.agreeN = "5847"
				.general.landlord = "00000012"
				.general.name = "§´áõñ· ´³ÝÏ¦"
				.general.curr = "060"
				.general.leaseSumma = "125000"
				.general.signingDate = "16/02/21"
				.general.repayDate = "28/02/22"
				.general.AAHTaxable = "0"
				.general.marketInterestRate = "12"
				.general.comment = "Ø»ÏÝ³µ³ÝáõÃÛáõÝ"
				.general.office = "01"
				.general.department = "2"
				.general.accessType = "LC1"
				.additional.note = ""
				.additional.note2 = ""
				.additional.note3 = ""
				.additional.agreePaperN = "123456"
				.additional.closeDate = ""
		end with
		
		Set leaseAgreement2 = New_LeaseAgreements()
		with leaseAgreement2
				.general.agreeType = "1"
				.general.agreeN = "5848"
				.general.landlord = "00000012"
				.general.curr = "060"
				.general.leaseSumma = "125000"
				.general.signingDate = "16/02/21"
				.general.repayDate = "16/02/22"
				.general.AAHTaxable = "0"
				.general.marketInterestRate = "12"
				.general.office = "01"
				.general.department = "2"
				.general.accessType = "LC1"
		end with
		
		Set fill_date = New_DateFill()
		fill_date.paragraph_mounth = "10"
  fill_date.paragraph_day = "7"
		
		Set Working_Docs = New_SubsystemWorkingDocuments()
		Working_Docs.agreeN = "5847"
		
		Set Verification_Doc = New_VerifyContract()
		Verification_Doc.AgreementN = "5847"
		
		Set goToAgreement = New_ContractsFilter()
		goToAgreement.DateFill = true
		goToAgreement.AgreementN = "5847"
		goToAgreement.AgreementLevelExist = false
		goToAgreement.LeaseAgree = true
		goToAgreement.ShowClosed = 1
		
		Set accuralOfExpDates = New_AgreementsCommomFilter()
		accuralOfExpDates.leaseAgree = true
End Sub

Sub DB_Initialize()
		Set dbo_LEASES = New_dbo_LEASES()
		with dbo_LEASES
				.fISN = leaseAgreement.isn
				.fAGRKIND = "11"
				.fCODE = leaseAgreement.general.agreeN
				.fPPRCODE = "123456              "
				.fCLICODE = "00000012"
				.fCUR = "060"
				.fSUMMA = "125000.00"
				.fPCMARKET = "12.0000"
				.fVATMETH = "0"
				.fDATEGIVE = "2021-02-16"
				.fDATEAGR = "2022-02-28"
				.fDATECLOSE = null
				.fSTATE = 206
				.fNOTE = ""
				.fNOTE2 = ""
				.fNOTE3 = ""
				.fACSBRANCH = "01"
				.fACSDEPART = "2"
				.fACSTYPE = "LC1"
				.fLCNAME = "§´áõñ· ´³ÝÏ¦                    "
		end with
		
		for i = 0 to 3
    Set dbo_FOLDERS(i) = New_DB_FOLDERS()
    dbo_FOLDERS(i).fKEY = leaseAgreement.isn
    dbo_FOLDERS(i).fISN = leaseAgreement.isn
    dbo_FOLDERS(i).fNAME = "LCLease "
    dbo_FOLDERS(i).fSTATUS = "1"
  next
  dbo_FOLDERS(0).fFOLDERID = "Agr." & leaseAgreement.isn
  dbo_FOLDERS(0).fCOM = "ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS(0).fSPEC = "1ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ- " & leaseAgreement.general.agreeN & " {§´áõñ· ´³ÝÏ¦}"
  dbo_FOLDERS(1).fFOLDERID = "C.1628327"
  dbo_FOLDERS(1).fCOM = " ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS(1).fSPEC = leaseAgreement.general.agreeN & " (§´áõñ· ´³ÝÏ¦),     125000 - Ö³åáÝ³Ï³Ý Ç»Ý"
  dbo_FOLDERS(2).fFOLDERID = "LEASES"
  dbo_FOLDERS(2).fCOM = "§´áõñ· ´³ÝÏ¦"
		dbo_FOLDERS(2).fSTATUS = "0"
		dbo_FOLDERS(2).fKEY = leaseAgreement.general.agreeN
		dbo_FOLDERS(3).fFOLDERID = "SSWork.CRLC20210216"
  dbo_FOLDERS(3).fCOM = "ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS(3).fSPEC = leaseAgreement.general.agreeN & "          LC1 20210216            0.0077  00000012Üáñ å³ÛÙ³Ý³·Çñ      "
		dbo_FOLDERS(3).fECOM = "Lease Agreement"
		dbo_FOLDERS(3).fDCBRANCH = "01 "
		dbo_FOLDERS(3).fDCDEPART = "2  "
End	Sub

Sub Check_DB_LeaseAgreeCreation()
  'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", leaseAgreement.isn, 2)
  Call CheckDB_DOCLOG(leaseAgreement.isn, "77", "N", "1", "", 1)
		Call CheckDB_DOCLOG(leaseAgreement.isn, "77", "C", "206", "", 1)
  
  'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
		fBODY = " LCTYPE:1 CODE:" & leaseAgreement.general.agreeN & " CLICOD:00000012 NAME:§´áõñ· ´³ÝÏ¦ CURRENCY:060 SUMMA:125000 DATE:20210216 DATEAGR:20220228 VATMETH:0 PCMARKET:12 COMMENT:Ø»ÏÝ³µ³ÝáõÃÛáõÝ ACSBRANCH:01 ACSDEPART:2 ACSTYPE:LC1 PPRCODE:123456 "
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", leaseAgreement.isn, 1)
  Call CheckDB_DOCS(leaseAgreement.isn, "LCLease ", "206", fBODY, 1)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("FOLDERS", "fISN", leaseAgreement.isn, 4)
  for i = 0 to 3
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
  next
		
		'SQL Ստուգում LEASES աղյուսակում 
		Log.Message "SQL Ստուգում LEASES աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("LEASES", "fISN", leaseAgreement.isn, 1)
		Call Check_dbo_LEASES(dbo_LEASES, 1)
  
  'SQL Ստուգում RESNUMBERS աղյուսակում 
  Log.Message "SQL Ստուգում RESNUMBERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("RESNUMBERS", "fISN", leaseAgreement.isn, 1)
  Call CheckDB_RESNUMBERS(leaseAgreement.isn, "L ", leaseAgreement.general.agreeN, 1)
End	Sub

Sub Check_DB_RepaySchedulAssign()
		'SQL Ստուգում AGRSCHEDULE աղյուսակում 
		Log.Message "SQL Ստուգում AGRSCHEDULE աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("AGRSCHEDULE", "fAGRISN", leaseAgreement.isn, 1)
		Call Check_AGRSCHEDULE(leaseAgreement.isn, "2021-02-16", "2021-02-16", 1, 0, 0)
		
		'SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում 
		Log.Message "SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("AGRSCHEDULEVALUES", "fAGRISN", leaseAgreement.isn, 2)
		Call Check_AGRSCHEDULEVALUES(leaseAgreement.isn, 1, "2021-12-23", "62500.00", 1, 0)
		Call Check_AGRSCHEDULEVALUES(leaseAgreement.isn, 1, "2022-02-28", "62500.00", 1, 0)
		
		'SQL Ստուգում LEASES աղյուսակում 
		Log.Message "SQL Ստուգում LEASES աղյուսակում", "", pmNormal, SqlDivideColor
		dbo_LEASES.fSTATE = 1
		Call CheckQueryRowCount("LEASES", "fISN", leaseAgreement.isn, 1)
		Call Check_dbo_LEASES(dbo_LEASES, 1)
  
  'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", leaseAgreement.isn, 4)
  Call CheckDB_DOCLOG(leaseAgreement.isn, "77", "E", "1", "", 2)
		Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 2)
		Call CheckDB_DOCLOG(fBase, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(fBase, "77", "C", "5", "", 1)

  'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", leaseAgreement.isn, 1)
  Call CheckDB_DOCS(leaseAgreement.isn, "LCLease ", "1", fBODY, 1)
		Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
  Call CheckDB_DOCS(fBase, "LCTSDtUn", "5", "%CODE:" & leaseAgreement.general.agreeN & "%DATE:20210216%DATEAGR:20220228%AUTODATELC:0%IMPFROMEXCEL:0%COMMENT:Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ%USERID:  77%", 1)
  
		'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		Set dbo_FOLDERS(4) = New_DB_FOLDERS()
		dbo_FOLDERS(4).fKEY = "LCTSDtUn"
  dbo_FOLDERS(4).fISN = fBase
  dbo_FOLDERS(4).fNAME = "LCTSDtUn"
  dbo_FOLDERS(4).fSTATUS = "1"
		dbo_FOLDERS(4).fFOLDERID = "Agr." & leaseAgreement.isn
		dbo_FOLDERS(4).fCOM = "Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ"
		dbo_FOLDERS(4).fSPEC = "1Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ`  16/02/21"
		dbo_FOLDERS(4).fECOM = "Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ"
		dbo_FOLDERS(4).fDCBRANCH = ""
		dbo_FOLDERS(4).fDCDEPART = ""
		dbo_FOLDERS(1).fCOM = " ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ (Ý³Ë³·ÇÍ)"
  Call CheckQueryRowCount("FOLDERS", "fISN", leaseAgreement.isn, 4)
		Call CheckQueryRowCount("FOLDERS", "fISN", fBase, 1)
  for i = 0 to 4
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
  next
End	Sub

Sub Check_DB_SendToVerify()
		'SQL Ստուգում LEASES աղյուսակում 
		Log.Message "SQL Ստուգում LEASES աղյուսակում", "", pmNormal, SqlDivideColor
		dbo_LEASES.fSTATE = 101
		Call CheckQueryRowCount("LEASES", "fISN", leaseAgreement.isn, 1)
		Call Check_dbo_LEASES(dbo_LEASES, 1)
  
  'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", leaseAgreement.isn, 6)
  Call CheckDB_DOCLOG(leaseAgreement.isn, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(leaseAgreement.isn, "77", "C", "101", "", 1)

  'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", leaseAgreement.isn, 1)
  Call CheckDB_DOCS(leaseAgreement.isn, "LCLease ", "101", fBODY, 1)
  
		'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		dbo_FOLDERS(4).fKEY = leaseAgreement.isn
  dbo_FOLDERS(4).fISN = leaseAgreement.isn
  dbo_FOLDERS(4).fNAME = "LCLease "
  dbo_FOLDERS(4).fSTATUS = "4"
		dbo_FOLDERS(4).fFOLDERID = "SSConf.CRLC001" 
		dbo_FOLDERS(4).fCOM = "ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
		dbo_FOLDERS(4).fSPEC = leaseAgreement.general.agreeN & "          LC1 20210216            0.0077  00000012"
		dbo_FOLDERS(4).fECOM = "Lease Agreement"
		dbo_FOLDERS(4).fDCBRANCH = "01 "
		dbo_FOLDERS(4).fDCDEPART = "2  "
		dbo_FOLDERS(0).fSTATUS = "0"
		dbo_FOLDERS(1).fSTATUS = "0"
		dbo_FOLDERS(3).fSTATUS = "0"
		dbo_FOLDERS(3).fSPEC = leaseAgreement.general.agreeN & "          LC1 20210216            0.0077  00000012àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³"
		dbo_FOLDERS(1).fCOM = " ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
  Call CheckQueryRowCount("FOLDERS", "fISN", leaseAgreement.isn, 5)
  for i = 0 to 4
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
  next
End	Sub

Sub Check_DB_VerifyContract()
		'SQL Ստուգում LEASES աղյուսակում 
		Log.Message "SQL Ստուգում LEASES աղյուսակում", "", pmNormal, SqlDivideColor
		dbo_LEASES.fSTATE = 7
		Call CheckQueryRowCount("LEASES", "fISN", leaseAgreement.isn, 1)
		Call Check_dbo_LEASES(dbo_LEASES, 1)
  
  'SQL Ստուգում LAGRACCS աղյուսակում 
  Log.Message "SQL Ստուգում LAGRACCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("LAGRACCS", "fAGRISN", leaseAgreement.isn, 1)
  
  'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", leaseAgreement.isn, 8)
  Call CheckDB_DOCLOG(leaseAgreement.isn, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(leaseAgreement.isn, "77", "T", "7", "", 1)
		
  'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", leaseAgreement.isn, 1)
  Call CheckDB_DOCS(leaseAgreement.isn, "LCLease ", "7", fBODY, 1)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		dbo_FOLDERS(0).fSTATUS = "1"
		dbo_FOLDERS(1).fSTATUS = "1"
  Call CheckQueryRowCount("FOLDERS", "fISN", leaseAgreement.isn, 3)
  for i = 0 to 2
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
  next
  
		'SQL Ստուգում HIF  աղյուսակում 
  Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIF", "fOBJECT", leaseAgreement.isn, 4)
		Call Check_HIF("2021-02-15", "N0", leaseAgreement.isn, "0.00", "0.00", "DTC", "20210215")
		Call Check_HIF("2021-02-16", "N0", leaseAgreement.isn, "0.00", "0.00", "AGJ", "0")
		Call Check_HIF("2021-02-16", "N0", leaseAgreement.isn, "0.00", "0.00", "PRJ", "0")
    Call Check_HIF("2021-02-16", "N0", leaseAgreement.isn, "0.00", "0.00", "TAX", "")
End	Sub

Sub Check_DB_AccuralOfEpenses()
		'SQL Ստուգում DOCLOG աղյուսակում 
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)
  Call CheckDB_DOCLOG(fBase, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(fBase, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(fBase, "77", "T", "2", "", 1)
		Call CheckDB_DOCLOG(fBase, "77", "C", "5", "", 1)
		
  'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
  Call CheckDB_DOCS(fBase, "LCDSChrg", "5", "%CODE:" & leaseAgreement.general.agreeN & "%DATECHARGE:20210216%DATE:20210216%COMMENT:Ì³Ëë»ñÇ Ñ³ßí»·ñáõÙ%ACSBRANCH:00%ACSDEPART:1%ACSTYPE:LC1%USERID:  77%", 1)
		
		'SQL Ստուգում HIF  աղյուսակում 
  Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIF", "fBASE", fBase, 1)
		Call Check_HIF("2021-02-16", "N0", leaseAgreement.isn, "0.00", "0.00", "DTC", "20210216")
End	Sub

Sub Check_DB_Reconclude()
		'SQL Ստուգում LEASES աղյուսակում 
		Log.Message "SQL Ստուգում LEASES աղյուսակում", "", pmNormal, SqlDivideColor
		dbo_LEASES.fSTATE = 206
		dbo_LEASES.fISN = leaseAgreement2.isn
		dbo_LEASES.fCODE = leaseAgreement2.general.agreeN
		dbo_LEASES.fDATEAGR = "2022-02-16"
		Call CheckQueryRowCount("LEASES", "fISN", leaseAgreement2.isn, 1)
		Call Check_dbo_LEASES(dbo_LEASES, 1)
  
  'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", leaseAgreement2.isn, 3)
  Call CheckDB_DOCLOG(leaseAgreement2.isn, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(leaseAgreement2.isn, "77", "B", "1", leaseAgreement.isn, 1)
		Call CheckDB_DOCLOG(leaseAgreement2.isn, "77", "C", "206", "", 1)
		
  'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
		fBODY = " LCTYPE:1 CODE:" & leaseAgreement2.general.agreeN & " CLICOD:00000012 NAME:§´áõñ· ´³ÝÏ¦ CURRENCY:060 SUMMA:125000 DATE:20210216 DATEAGR:20220216 VATMETH:0 PCMARKET:12 COMMENT:Ø»ÏÝ³µ³ÝáõÃÛáõÝ ACSBRANCH:01 ACSDEPART:2 ACSTYPE:LC1 PPRCODE:123456 "
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", leaseAgreement2.isn, 1)
  Call CheckDB_DOCS(leaseAgreement2.isn, "LCLease ", "206", fBODY, 1)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		for i = 0 to 3
    Set dbo_FOLDERS(i) = New_DB_FOLDERS()
    dbo_FOLDERS(i).fKEY = leaseAgreement2.isn
    dbo_FOLDERS(i).fISN = leaseAgreement2.isn
    dbo_FOLDERS(i).fNAME = "LCLease "
    dbo_FOLDERS(i).fSTATUS = "1"
  next
  dbo_FOLDERS(0).fFOLDERID = "Agr." & leaseAgreement2.isn
  dbo_FOLDERS(0).fCOM = "ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS(0).fSPEC = "1ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ- " & leaseAgreement2.general.agreeN & " {§´áõñ· ´³ÝÏ¦}"
  dbo_FOLDERS(1).fFOLDERID = "C.1628327"
  dbo_FOLDERS(1).fCOM = " ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS(1).fSPEC = leaseAgreement2.general.agreeN & " (§´áõñ· ´³ÝÏ¦),     125000 - Ö³åáÝ³Ï³Ý Ç»Ý"
  dbo_FOLDERS(2).fFOLDERID = "LEASES"
  dbo_FOLDERS(2).fCOM = "§´áõñ· ´³ÝÏ¦"
		dbo_FOLDERS(2).fSTATUS = "0"
		dbo_FOLDERS(2).fKEY = leaseAgreement2.general.agreeN
		dbo_FOLDERS(3).fFOLDERID = "SSWork.CRLC20210216"
  dbo_FOLDERS(3).fCOM = "ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS(3).fSPEC = leaseAgreement2.general.agreeN & "          LC1 20210216            0.0077  00000012Üáñ å³ÛÙ³Ý³·Çñ      "
		dbo_FOLDERS(3).fECOM = "Lease Agreement"
		dbo_FOLDERS(3).fDCBRANCH = "01 "
		dbo_FOLDERS(3).fDCDEPART = "2  "
  Call CheckQueryRowCount("FOLDERS", "fISN", leaseAgreement2.isn, 4)
  for i = 0 to 3
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
  next
		
		'SQL Ստուգում RESNUMBERS աղյուսակում 
  Log.Message "SQL Ստուգում RESNUMBERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("RESNUMBERS", "fISN", leaseAgreement2.isn, 1)
  Call CheckDB_RESNUMBERS(leaseAgreement2.isn, "L ", leaseAgreement2.general.agreeN, 1)
End	Sub

Sub Check_DB_DeleteReconclude()
		'SQL Ստուգում LEASES աղյուսակում 
		Log.Message "SQL Ստուգում LEASES աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("LEASES", "fISN", leaseAgreement2.isn, 0)
  
  'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", leaseAgreement2.isn, 4)
		Call CheckDB_DOCLOG(leaseAgreement2.isn, "77", "D", "999", "", 1)
		
  'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", leaseAgreement2.isn, 1)
  Call CheckDB_DOCS(leaseAgreement2.isn, "LCLease ", "999", fBODY, 1)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		Set dbo_FOLDERS(0) = New_DB_FOLDERS()
		dbo_FOLDERS(0).fKEY = leaseAgreement2.isn
  dbo_FOLDERS(0).fISN = leaseAgreement2.isn
  dbo_FOLDERS(0).fSTATUS = "0"
  dbo_FOLDERS(0).fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")
  dbo_FOLDERS(0).fCOM = ""
  dbo_FOLDERS(0).fSPEC = Left_Align(Get_Compname_DOCLOG(leaseAgreement2.isn), 16) & "Cred&DepARMSOFT                       00206"
		dbo_FOLDERS(0).fDCBRANCH = "01 "
		dbo_FOLDERS(0).fDCDEPART = "2  "
		dbo_FOLDERS(0).fNAME = "LCLease "
  Call CheckQueryRowCount("FOLDERS", "fISN", leaseAgreement2.isn, 1)
  Call CheckDB_FOLDERS(dbo_FOLDERS(0), 1)
		
		'SQL Ստուգում RESNUMBERS աղյուսակում 
  Log.Message "SQL Ստուգում RESNUMBERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("RESNUMBERS", "fISN", leaseAgreement2.isn, 0)
End	Sub

Sub Check_DB_DeleteAccuralOfExpenses()
		'SQL Ստուգում DOCLOG աղյուսակում համար
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", leaseAgreement.isn, 11)
		Call CheckDB_DOCLOG(leaseAgreement.isn, "77", "M", "77", "ä³ÛÙ³Ý³·ñÇ ÷³ÏáõÙ", 1)
		Call CheckDB_DOCLOG(leaseAgreement.isn, "77", "C", "7", "", 1)
		Call CheckDB_DOCLOG(leaseAgreement.isn, "77", "M", "7", "ä³ÛÙ³Ý³·ñÇ µ³óáõÙ", 1)
		
  'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
		fBODY = " LCTYPE:1 CODE:" & leaseAgreement.general.agreeN & " CLICOD:00000012 NAME:§´áõñ· ´³ÝÏ¦ CURRENCY:060 SUMMA:125000 DATE:20210216 DATEAGR:20220228 VATMETH:0 PCMARKET:12 COMMENT:Ø»ÏÝ³µ³ÝáõÃÛáõÝ ACSBRANCH:01 ACSDEPART:2 ACSTYPE:LC1 PPRCODE:123456 "
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", leaseAgreement.isn, 1)
  Call CheckDB_DOCS(leaseAgreement.isn, "LCLease ", "7", fBODY, 1)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
  for i = 0 to 2
    Set dbo_FOLDERS(i) = New_DB_FOLDERS()
    dbo_FOLDERS(i).fKEY = leaseAgreement.isn
    dbo_FOLDERS(i).fISN = leaseAgreement.isn
    dbo_FOLDERS(i).fNAME = "LCLease "
    dbo_FOLDERS(i).fSTATUS = "1"
  next
  dbo_FOLDERS(0).fFOLDERID = "Agr." & leaseAgreement.isn
  dbo_FOLDERS(0).fCOM = "ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS(0).fSPEC = "1ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ- " & leaseAgreement.general.agreeN & " {§´áõñ· ´³ÝÏ¦}"
  dbo_FOLDERS(1).fFOLDERID = "C.1628327"
  dbo_FOLDERS(1).fCOM = " ì³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS(1).fSPEC = leaseAgreement.general.agreeN & " (§´áõñ· ´³ÝÏ¦),     125000 - Ö³åáÝ³Ï³Ý Ç»Ý"
  dbo_FOLDERS(2).fFOLDERID = "LEASES"
  dbo_FOLDERS(2).fCOM = "§´áõñ· ´³ÝÏ¦"
		dbo_FOLDERS(2).fSTATUS = "0"
		dbo_FOLDERS(2).fKEY = leaseAgreement.general.agreeN
  Call CheckQueryRowCount("FOLDERS", "fISN", leaseAgreement.isn, 3)
  for i = 0 to 2
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
  next
		
		'SQL Ստուգում HIF  աղյուսակում 
  Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIF", "fOBJECT", leaseAgreement.isn, 4)
End	Sub

Sub Check_DB_DeleteLeaseAgree()
				'SQL Ստուգում AGRSCHEDULE աղյուսակում 
		Log.Message "SQL Ստուգում AGRSCHEDULE աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("AGRSCHEDULE", "fAGRISN", leaseAgreement.isn, 0)
		
		'SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում 
		Log.Message "SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("AGRSCHEDULEVALUES", "fAGRISN", leaseAgreement.isn, 0)
		
		'SQL Ստուգում LEASES աղյուսակում 
		Log.Message "SQL Ստուգում LEASES աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("LEASES", "fISN", leaseAgreement.isn, 0)
  
  'SQL Ստուգում LAGRACCS աղյուսակում 
  Log.Message "SQL Ստուգում LAGRACCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("LAGRACCS", "fAGRISN", leaseAgreement.isn, 0)
		
		'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", leaseAgreement.isn, 12)
		Call CheckDB_DOCLOG(leaseAgreement.isn, "77", "D", "999", "", 1)

  'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", leaseAgreement.isn, 1)
  Call CheckDB_DOCS(leaseAgreement.isn, "LCLease ", "999", fBODY, 1)
		
		'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		Set dbo_FOLDERS(0) = New_DB_FOLDERS()
		dbo_FOLDERS(0).fKEY = leaseAgreement.isn
  dbo_FOLDERS(0).fISN = leaseAgreement.isn
  dbo_FOLDERS(0).fSTATUS = "0"
  dbo_FOLDERS(0).fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")
  dbo_FOLDERS(0).fCOM = ""
		dbo_FOLDERS(0).fECOM = ""
  dbo_FOLDERS(0).fSPEC = Left_Align(Get_Compname_DOCLOG(leaseAgreement.isn), 16) & "Cred&DepARMSOFT                       007  "
		dbo_FOLDERS(0).fDCBRANCH = "01 "
		dbo_FOLDERS(0).fDCDEPART = "2  "
		dbo_FOLDERS(0).fNAME = "LCLease "
  Call CheckQueryRowCount("FOLDERS", "fISN", leaseAgreement.isn, 1)
  Call CheckDB_FOLDERS(dbo_FOLDERS(0), 1)
		
		'SQL Ստուգում HIF  աղյուսակում 
  Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIF", "fOBJECT", leaseAgreement.isn, 0)
End	Sub