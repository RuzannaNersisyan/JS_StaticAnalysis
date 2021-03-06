'USEUNIT Library_Common  
'USEUNIT Library_Colour
'USEUNIT Deposit_Contract_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Akreditiv_Library
'USEUNIT Loan_Agreements_Library 
'USEUNIT Credit_Line_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Group_Operations_Library
'USEUNIT Constants
'USEUNIT Overlimit_Library
'USEUNIT Library_Contracts
'USEUNIT Library_CheckDB
Option Explicit
'Test Case ID 137750

Dim fDATE, sDATE, FolderName, oneTimeDepositAdd, verifyFilter1, agreementAllOperations1
Dim DocLevel, documentType(), calcPercent, tabN
Dim dbo_CONTRACTS, DOCSG(11), dbo_FOLDERS(5), fBODY, fBASE, dbo_FOLDERSVerify(3), ISN, Query

Sub Deposit_Contract_OneTime_Actions_Test()
  
  Call Test_Initialize()

  ''1. Ð³Ù³Ï³ñ· Ùáõïù ·áñÍ»É ARMSOFT û·ï³·áñÍáÕáí
  Log.Message "Համակարգ մուտք գործել ARMSOFT օգտագործողով", "", pmNormal, DivideColor
  Call Test_StartUp()
  
  ''2. Øáõïù ·áñÍ»É ""ºÝÃ³Ñ³Ù³Ï³ñ·»ñ(ÐÌ)
  Log.Message "Մուտք գործել ""Ենթահամակարգեր(ՀԾ)""", "", pmNormal, DivideColor
  Call ChangeWorkspace(c_Subsystems) 

  ''3. êï»ÕÍ»É ØÇ³Ý·³ÙÛ³ ³í³Ý¹
  Log.Message "Ստեղծել Միանգամյա ավանդ", "", pmNormal, DivideColor
  Call CreateNewDepositContract(FolderName, "¸³ï³ñÏ å³ÛÙ³Ý³·Çñ", "ØÇ³Ý·³ÙÛ³ ³í³Ý¹", oneTimeDepositAdd)
  
  Log.Message "Ստեղծել Միանգամյա ավանդ-ի SQL ստուգում", "", pmNormal, SqlDivideColor
  Call DB_Initialize(oneTimeDepositAdd)
  Call Check_DB_AfterCreatingDoc(oneTimeDepositAdd)
  
  ''4. ä³ÛÙ³Ý³·ÇñÁ áõÕ³ñÏ»É Ñ³ëï³ïÙ³Ý
  Log.Message "Պայմանագիրը ուղարկել հաստատման", "", pmNormal, DivideColor
  Call PaySys_Send_To_Verify()
	
		BuiltIn.Delay(3000)
  wMDIClient.VBObject("frmPttel").Close
  
  Log.Message "Պայմանագիրը ուղարկել հաստատման SQL ստուգում", "", pmNormal, SqlDivideColor
  Call Check_DB_AfterSendToVerify(oneTimeDepositAdd)
  

  ''5. Ð³ëï³ï»É å³ÛÙ³Ý³·ÇñÁ
  Log.Message "Հաստատել պայմանագիրը", "", pmNormal, DivideColor
  Call Verify_Contract(FolderName & "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I", verifyFilter1) 
  
  Log.Message "Հաստատել պայմանագիրը SQL ստուգում", "", pmNormal, SqlDivideColor
  Call Check_DB_VerifyContract(oneTimeDepositAdd)
  
	''6. Պայմանագրեր թղթապանակում փաստաթղթի առկայության ստուգում
  Log.Message "Պայմանագրեր թղթապանակում փաստաթղթի առկայության ստուգում", "", pmNormal, DivideColor
  DocLevel = 1
  Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, oneTimeDepositAdd.general.agreementN)

	''7. Ավանդի ներգրավվում  
  Log.Message "Ավանդի ներգրավում", "", pmNormal, DivideColor
  Call Deposit_Involvment(fBASE, oneTimeDepositAdd.general.agreementN, "23/11/20", oneTimeDepositAdd.general.amount, 2, oneTimeDepositAdd.general.settlementAccount)
  
  Log.Message "Ավանդի ներգրավում SQL ստուգում", "", pmNormal, SqlDivideColor
  Call Check_DB_DepositInvolvment(oneTimeDepositAdd)
  
	''8. Տոկոսների հաշվարկ
  Log.Message "Տոկոսների հաշվարկ", "", pmNormal, DivideColor
  calcPercent.agreementN = oneTimeDepositAdd.general.agreementN
  Call calculatePercent_1TimeDeposit(fBASE, calcPercent, false)
  
  Log.Message "Տոկոսների հաշվարկ SQL ստուգում", "", pmNormal, SqlDivideColor
  Call Check_DB_CalculatePercent(oneTimeDepositAdd)
  
	''9. Տոկոսների կապիտալացում
  Log.Message "Տոկոսների կապիտալացում", "", pmNormal, DivideColor
  Call Percent_Capitalization(fBASE, "23/12/20", "")
  
  Log.Message "Տոկոսների կապիտալացում  SQL ստուգում", "", pmNormal, SqlDivideColor
  Call Check_DB_Capitalization(oneTimeDepositAdd)
	
	''10. Ժամկետների վերանայում
  Log.Message "Ժամկետների վերանայում", "", pmNormal, DivideColor
  Call Deposit_Extension("23/12/20", "23/11/22", "", 1, 2, c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms)
  
  Log.Message "Ժամկետների վերանայում  SQL ստուգում", "", pmNormal, SqlDivideColor
  Call Check_DB_DepositExtension(oneTimeDepositAdd)
  
	''11. Պարտքերի մարում
  Log.Message "Պարտքերի մարում", "", pmNormal, DivideColor
  tabN = 2
  Call Debt_Repayment(fBASE, "23/12/20", 10000, "", 2, oneTimeDepositAdd.general.settlementAccount, oneTimeDepositAdd.general.agreementN,tabN)

  Log.Message "Պարտքերի մարում SQL ստուգում", "", pmNormal, SqlDivideColor
  Call Check_DB_DebtRepayment(oneTimeDepositAdd)
  
	''12. Տոկոսադրույքներ
  Log.Message "Տոկոսադրույքներ", "", pmNormal, DivideColor
  Call ChangeRete("23/12/20", 15, 10)
    
  Log.Message "Տոկոսադրույքներ SQL ստուգում", "", pmNormal, SqlDivideColor
  Call Check_DB_ChangeRete(oneTimeDepositAdd)
  
	''13. Արդյունավետ տոկոսադրույք
  Log.Message "Արդյունավետ տոկոսադրույք", "", pmNormal, DivideColor
  Call ChangeEffRete("23/12/20", "", "")
  
  Log.Message "Արդյունավետ տոկոսադրույք SQL ստուգում", "", pmNormal, SqlDivideColor
  Call Check_DB_ChangeEffRete(oneTimeDepositAdd)
  
	''14. Պարտքերի մարում
  Log.Message "Պարտքերի մարում", "", pmNormal, DivideColor
  Call Debt_Repayment(fBASE, "23/12/20", 90715, "", 2, oneTimeDepositAdd.general.settlementAccount, oneTimeDepositAdd.general.agreementN,tabN)
  
  Log.Message "Պարտքերի մարում SQL ստուգում", "", pmNormal, SqlDivideColor
  Call Check_DB_DebtRepayment2(oneTimeDepositAdd)
  
	''15. Պայմանագրի փակում
  Log.Message "Պայմանագրի փակում", "", pmNormal, DivideColor 
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_AgrClose)
  Call Rekvizit_Fill("Dialog", 1, "General", "DATECLOSE", "23/12/20")
  p1.VBObject("frmAsUstPar").VBObject("CmdOK").ClickButton

  Log.Message "Պայմանագրի փակում SQL ստուգում", "", pmNormal, SqlDivideColor
  Call Check_DB_DateClose(oneTimeDepositAdd)
  
	''16. Պայմանագրի բացում
  Log.Message "Պայմանագրի բացում", "", pmNormal, DivideColor
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_AgrOpen)
  Call ClickCmdButton(5, "²Ûá")
		BuiltIn.Delay(3000)
  wMDIClient.VBObject("frmPttel").Close()
  
  Log.Message "Պայմանագրի բացում SQL ստուգում", "", pmNormal, SqlDivideColor
  Call Check_DB_DateOpen(oneTimeDepositAdd)
  
	''17. æÝç»É µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñÁ
  Log.Message "Բոլոր փաստաթղթերի ջնջում", "", pmNormal, DivideColor
  agreementAllOperations1.agreementN = oneTimeDepositAdd.general.agreementN
  Call Delete_AgreementAllOperations(FolderName, agreementAllOperations1, "frmPttel", 4, documentType)

  Log.Message "Բոլոր փաստաթղթերի ջնջում SQL ստուգում", "", pmNormal, SqlDivideColor
  Call Check_DB_Delete_AgreementAllOperations(oneTimeDepositAdd)
  
  Call Close_AsBank()  
End Sub

Sub Test_StartUp()
  Call Initialize_AsBank("bank", sDATE, fDATE)
  Login("ARMSOFT") 
End Sub

Sub Test_Initialize()
  fDATE = "20250101"
  sDATE = "20030101"
  
  FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|"
  
  Set oneTimeDepositAdd = New_OneTimeDeposit()
  oneTimeDepositAdd.general.agreementN = ""
  oneTimeDepositAdd.general.client = "00034850"
  oneTimeDepositAdd.general.thirdPerson = "00000093"
  oneTimeDepositAdd.general.expName = "êäÀ111" 
  oneTimeDepositAdd.general.name = "êäÀ111" 
  oneTimeDepositAdd.general.curr = "000"
  oneTimeDepositAdd.general.repaymentCurrency = ""
  oneTimeDepositAdd.general.settlementAccount = "03485010100"
  oneTimeDepositAdd.general.thirdPersonsAccount = "000360100"
  oneTimeDepositAdd.general.interestRepayAccount = "03485010100"
  oneTimeDepositAdd.general.amount = "100000"
  oneTimeDepositAdd.general.capitalized = 0
  oneTimeDepositAdd.general.automaticallyPaym = 1
  oneTimeDepositAdd.general.prologation = 1
  oneTimeDepositAdd.general.signingDate = "23/11/20"
  oneTimeDepositAdd.general.division = "01"
  oneTimeDepositAdd.general.department = "1"
  oneTimeDepositAdd.general.accessType = "D10"
  oneTimeDepositAdd.interests.kindOfScale = "1"
  oneTimeDepositAdd.interests.depositRate = "10.0000"'"12.5"
  oneTimeDepositAdd.interests.depositeRateDiv = "365"'"30"
  oneTimeDepositAdd.interests.recalculateRate = "0.5000"
  oneTimeDepositAdd.interests.recalculateRate_div = "365"
  oneTimeDepositAdd.interests.taxRate = "10"
  oneTimeDepositAdd.dates.disbursemenDate = "23/11/20"
  oneTimeDepositAdd.dates.maturityDate = "23/11/21"
  oneTimeDepositAdd.dates.fixedInterests = 0
  oneTimeDepositAdd.dates.dateFill = 1
  oneTimeDepositAdd.dates.dateFill_win.paragraph_mounth = "1"
  oneTimeDepositAdd.dates.dateFill_win.detourDirection = "2"
  oneTimeDepositAdd.dates.fillInterestSum = 1
  oneTimeDepositAdd.additional.sector = "U2"
  oneTimeDepositAdd.additional.project_ = "AtlanticAG/EXPIMP"
  oneTimeDepositAdd.additional.region = "001"
  oneTimeDepositAdd.additional.thePerOfTheAToBeRBDD = "100.00"
  oneTimeDepositAdd.additional.agreePaperN = "221"
  oneTimeDepositAdd.statement.deliverStateMode = "3"
  oneTimeDepositAdd.statement.sendStateAddress = ""
  oneTimeDepositAdd.statement.deliverStateModeToTPerson = "3"
  oneTimeDepositAdd.statement.sendStmAdrToTPerson = "2"
  oneTimeDepositAdd.statement.startDate = Date()
  oneTimeDepositAdd.statement.periodicity_months = "1"
  oneTimeDepositAdd.statement.periodicity_days = "4"
  oneTimeDepositAdd.statement.datePeriodDifference = "3"
  oneTimeDepositAdd.statement.nonDaysAvoiding = "1"

  Set verifyFilter1 = New_VerifyContract()
  verifyFilter1.AgreementN = oneTimeDepositAdd.general.agreementN
  
  Set agreementAllOperations1 = New_AgreementAllOperations()
  agreementAllOperations1.startDate = "20/11/20"
  agreementAllOperations1.endDate = "31/12/22"
  agreementAllOperations1.agreementN = oneTimeDepositAdd.general.agreementN
  
  Redim documentType(8)
  documentType(8) = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  documentType(7) = "²í³Ý¹Ç Ý»ñ·ñ³íáõÙ"
  documentType(6) = "îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ"
  documentType(5) = "îáÏáëÝ»ñÇ Ï³åÇï³É³óáõÙ"
  documentType(4) = "ºñÏ³ñ³Ó·áõÙ"
  documentType(3) = "²í³Ý¹Ç å³ñïù»ñÇ í×³ñáõÙ"
  documentType(2) = "îáÏáë³¹ñáõÛùÝ»ñ"
  documentType(1) = "²ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛù"
  documentType(0) = "²í³Ý¹Ç å³ñïù»ñÇ í×³ñáõÙ"
  
  Set calcPercent = New_PercentCalculate_1TimeDeposit()
  calcPercent.agreementN = oneTimeDepositAdd.general.agreementN
  calcPercent.calcDate = "22/12/20"
  calcPercent.operDate = "22/12/20" 
  calcPercent.expComment = "îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ" 
  calcPercent.comment = "îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ"
  calcPercent.division = "00"
  calcPercent.department = "1"
End Sub

Sub DB_Initialize(oneTimeDepositAdd)
  Dim i
  
  fBODY = "  CODE:"&oneTimeDepositAdd.general.agreementN&"  CLICOD:00034850  CLICOD3:00000093  NAME:êäÀ111  CURRENCY:000  ACCACC:03485010100  ACCACC3:000360100  ACCACCPR:03485010100  SUMMA:100000  CHRGFIRSTDAY:0  AUTOCAP:0  AUTODEBT:1  AUTOPROLONG:1  DATE:20201123  ACSBRANCH:01  ACSDEPART:1  ACSTYPE:D10  KINDSCALE:1  PCAGR:10.0000/365  WITHSCALE:0  DONOTCALCPCBASE:0  PCNOCHOOSE:0/1  PCBREAK:0.5000/365  TAXVALUE:10  PAYPERGIVE:0  PCNDERAUTO:0  PCPENAGR:0/1  PCPENPER:0/1  DATEGIVE:20201123  DATEAGR:20211123  CONSTPER:0  AUTODATE:0  REFRPERSUM:0  SECTOR:U2  SCHEDULE:AtlanticAG/EXPIMP  LRDISTR:001  REPAYADVANCE:100  PPRCODE:221  GIVEN:0  DLVSTMVIEW:3  DLVSTMVIEW3:3  SENDSTMADRS3:2  PERIODICITY:1/4  DATEDIFF:3  NONWORKDAYS:1  "
  fBODY = Replace(fBODY, "  ", "%")
  
  Set dbo_CONTRACTS = New_DB_CONTRACTS()
  dbo_CONTRACTS.fDGISN = oneTimeDepositAdd.ISN
  dbo_CONTRACTS.fDGPARENTISN = oneTimeDepositAdd.ISN
  dbo_CONTRACTS.fDGISN1 = oneTimeDepositAdd.ISN
  dbo_CONTRACTS.fDGISN3 = oneTimeDepositAdd.ISN
  dbo_CONTRACTS.fDGAGRKIND = 2
  dbo_CONTRACTS.fDGSTATE = 1
  dbo_CONTRACTS.fDGTYPENAME = "D1Disp"
  dbo_CONTRACTS.fDGCODE = oneTimeDepositAdd.general.agreementN
  dbo_CONTRACTS.fDGPPRCODE = "221"
  dbo_CONTRACTS.fDGCAPTION = "êäÀ111"
  dbo_CONTRACTS.fDGCLICODE = "00034850"
  dbo_CONTRACTS.fDGCUR = "000"
  dbo_CONTRACTS.fDGSUMMA = "100000.00"
  dbo_CONTRACTS.fDGALLSUMMA = "0.00"
  dbo_CONTRACTS.fDGRISKDEGREE = "0.00"
  dbo_CONTRACTS.fDGRISKDEGNB = "0.00"
  dbo_CONTRACTS.fDGSCHEDULE = "AtlanticAG/EXPIMP"
  dbo_CONTRACTS.fDGDISTRICT = "001"
  dbo_CONTRACTS.fDGACSBRANCH = "01"
  dbo_CONTRACTS.fDGACSDEPART = "1"
  dbo_CONTRACTS.fDGACSTYPE = "D10"
  
  DOCSG(0) = "20201223"
  DOCSG(1) = "20210125"
  DOCSG(2) = "20210223"
  DOCSG(3) = "20210323"
  DOCSG(4) = "20210423"
  DOCSG(5) = "20210524"
  DOCSG(6) = "20210623"
  DOCSG(7) = "20210723"
  DOCSG(8) = "20210823"
  DOCSG(9) = "20210923"
  DOCSG(10) = "20211025"
  DOCSG(11) = "20211123"
  
  for i = 0 to 4
    Set dbo_FOLDERS(i) = New_DB_FOLDERS()
    dbo_FOLDERS(i).fKEY = oneTimeDepositAdd.ISN
    dbo_FOLDERS(i).fISN = oneTimeDepositAdd.ISN
    dbo_FOLDERS(i).fNAME = "D1Disp  "
    dbo_FOLDERS(i).fSTATUS = "1"
  next
  dbo_FOLDERS(0).fFOLDERID = "Agr." & oneTimeDepositAdd.ISN
  dbo_FOLDERS(0).fCOM = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERS(0).fSPEC = "1ØÇ³Ý·³ÙÛ³ ³í³Ý¹- "&oneTimeDepositAdd.general.agreementN&" {êäÀ111}"
  dbo_FOLDERS(1).fFOLDERID = "C.1654739"
  dbo_FOLDERS(1).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹ (Ý³Ë³·ÇÍ)"
  dbo_FOLDERS(1).fSPEC = oneTimeDepositAdd.general.agreementN&", (êäÀ111), »ññáñ¹ ³ÝÓ` (00000093), 100000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERS(2).fFOLDERID = "C.977053288"
  dbo_FOLDERS(2).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹ (Ý³Ë³·ÇÍ)"
  dbo_FOLDERS(2).fSPEC = oneTimeDepositAdd.general.agreementN&" (êäÀ111),     100000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERS(3).fFOLDERID = "SSWork.CRD120201123" 
  dbo_FOLDERS(3).fCOM = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERS(3).fSPEC = oneTimeDepositAdd.general.agreementN&"      D10 20201123            0.0077  00034850Üáñ å³ÛÙ³Ý³·Çñ      "
  dbo_FOLDERS(3).fECOM = "Non-repeat Deposits"
  dbo_FOLDERS(3).fDCBRANCH = "01 "
  dbo_FOLDERS(3).fDCDEPART = "1  "
  dbo_FOLDERS(4).fFOLDERID = "SSConf.CRD1001" 
  dbo_FOLDERS(4).fSTATUS = "4"
  dbo_FOLDERS(4).fCOM = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERS(4).fSPEC = oneTimeDepositAdd.general.agreementN&"      D10 20201123            0.0077  00034850"
  dbo_FOLDERS(4).fECOM = "Non-repeat Deposits"
  dbo_FOLDERS(4).fDCBRANCH = "01 "
  dbo_FOLDERS(4).fDCDEPART = "1  "
  
  for i = 0 to 2
    Set dbo_FOLDERSVerify(i) = New_DB_FOLDERS()
    dbo_FOLDERSVerify(i).fKEY = oneTimeDepositAdd.ISN
    dbo_FOLDERSVerify(i).fISN = oneTimeDepositAdd.ISN
    dbo_FOLDERSVerify(i).fNAME = "D1Disp  "
    dbo_FOLDERSVerify(i).fSTATUS = "1"
  next
  dbo_FOLDERSVerify(0).fFOLDERID = "Agr." & oneTimeDepositAdd.ISN
  dbo_FOLDERSVerify(0).fSPEC = "1ØÇ³Ý·³ÙÛ³ ³í³Ý¹- "&oneTimeDepositAdd.general.agreementN&" {êäÀ111}"
  dbo_FOLDERSVerify(0).fCOM = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(1).fFOLDERID = "C.1654739"
  dbo_FOLDERSVerify(1).fSPEC = oneTimeDepositAdd.general.agreementN&", (êäÀ111), »ññáñ¹ ³ÝÓ` (00000093), 100000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERSVerify(1).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(2).fFOLDERID = "C.977053288"
  dbo_FOLDERSVerify(2).fSPEC = oneTimeDepositAdd.general.agreementN&" (êäÀ111),     100000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERSVerify(2).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
End Sub

'Ստեղծել Միանգամյա ավանդ-ի SQL ստուգում
Sub Check_DB_AfterCreatingDoc(oneTimeDepositAdd)
  Dim i
  'SQL Ստուգում CONTRACTS աղուսյակում 
  Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("CONTRACTS", "fDGISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  
  'SQL Ստուգում DOCP աղուսյակում  
  Log.Message "SQL Ստուգում DOCP աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCP", "fPARENTISN", oneTimeDepositAdd.ISN, 2)
  Call CheckDB_DOCP("1705626", "Acc", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCP("187118585", "Acc", oneTimeDepositAdd.ISN, 1)
  
  'SQL Ստուգում DOCS աղուսյակում 
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp  ", "1", fBODY, 1)
  
  'SQL Ստուգում DOCSG աղուսյակում 
  Log.Message "SQL Ստուգում DOCSG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", oneTimeDepositAdd.ISN, 12)
  for i = 0 to 11
    Call CheckDB_DOCSG(oneTimeDepositAdd.ISN, "DATES", i, "DATEPER", DOCSG(i), 1)
  next
  
  'SQL Ստուգում FOLDERS աղուսյակում 
  Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("FOLDERS", "fISN", oneTimeDepositAdd.ISN, 4)
  for i = 0 to 3
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
  next
  
  'SQL Ստուգում RESNUMBERS աղուսյակում 
  Log.Message "SQL Ստուգում RESNUMBERS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("RESNUMBERS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_RESNUMBERS(oneTimeDepositAdd.ISN, "D", oneTimeDepositAdd.general.agreementN, 1)
End Sub

'Պայմանագիրը ուղարկել հաստատման SQL ստուգում
Sub Check_DB_AfterSendToVerify(oneTimeDepositAdd)
  Dim i
  'SQL Ստուգում CONTRACTS աղուսյակում 
  Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
  dbo_CONTRACTS.fDGSTATE = 101
  Call CheckQueryRowCount("CONTRACTS", "fDGISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 3)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "101", "", 1)
  
  'SQL Ստուգում DOCS աղուսյակում համար
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp  ", "101", fBODY, 1)
  
  'SQL Ստուգում FOLDERS աղուսյակում 
  Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("FOLDERS", "fISN", oneTimeDepositAdd.ISN, 5)
	for i = 0 to 4
    dbo_FOLDERS(i).fNAME = "D1Disp  "
    dbo_FOLDERS(i).fSTATUS = "0"
  next
	dbo_FOLDERS(0).fFOLDERID = "Agr." & oneTimeDepositAdd.ISN
  dbo_FOLDERS(0).fCOM = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERS(0).fSPEC = "1ØÇ³Ý·³ÙÛ³ ³í³Ý¹- "&oneTimeDepositAdd.general.agreementN&" {êäÀ111}"
  dbo_FOLDERS(1).fFOLDERID = "C.1654739"
  dbo_FOLDERS(1).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERS(1).fSPEC = oneTimeDepositAdd.general.agreementN&", (êäÀ111), »ññáñ¹ ³ÝÓ` (00000093), 100000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERS(2).fFOLDERID = "C.977053288"
  dbo_FOLDERS(2).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERS(2).fSPEC = oneTimeDepositAdd.general.agreementN&" (êäÀ111),     100000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERS(3).fFOLDERID = "SSWork.CRD120201123" 
  dbo_FOLDERS(3).fCOM = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERS(3).fSPEC = oneTimeDepositAdd.general.agreementN&"      D10 20201123            0.0077  00034850àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³"
  dbo_FOLDERS(3).fECOM = "Non-repeat Deposits"
  dbo_FOLDERS(3).fDCBRANCH = "01 "
  dbo_FOLDERS(3).fDCDEPART = "1  "
  dbo_FOLDERS(4).fFOLDERID = "SSConf.CRD1001" 
  dbo_FOLDERS(4).fSTATUS = "4"
  dbo_FOLDERS(4).fCOM = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERS(4).fSPEC = oneTimeDepositAdd.general.agreementN&"      D10 20201123            0.0077  00034850"
  dbo_FOLDERS(4).fECOM = "Non-repeat Deposits"
  dbo_FOLDERS(4).fDCBRANCH = "01 "
  dbo_FOLDERS(4).fDCDEPART = "1  "
  for i = 0 to 4
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
  next
End Sub

'Հաստատել պայմանագիրը SQL ստուգում
Sub Check_DB_VerifyContract(oneTimeDepositAdd)
  Dim i  
  'SQL Ստուգում CONTRACTS աղուսյակում 
  Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
  dbo_CONTRACTS.fDGSTATE = 7
  Call CheckQueryRowCount("CONTRACTS", "fDGISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
  'SQL Ստուգում DAGRACCS աղուսյակում 
  Log.Message "SQL Ստուգում DAGRACCS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DAGRACCS", "fAGRISN", oneTimeDepositAdd.ISN, 1)
  
  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 5)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "101", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "T", "7", "", 1)
  
  'SQL Ստուգում DOCP աղուսյակում  
  Log.Message "SQL Ստուգում DOCP աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCP", "fPARENTISN", oneTimeDepositAdd.ISN, 2)
  Call CheckDB_DOCP("1705626", "Acc", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCP("187118585", "Acc", oneTimeDepositAdd.ISN, 1)
  
  'SQL Ստուգում DOCS աղուսյակում համար
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp  ", "7", fBODY, 1)
  
  'SQL Ստուգում FOLDERS աղուսյակում 
  Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
	for i = 0 to 2
    dbo_FOLDERSVerify(i).fNAME = "D1Disp  "
    dbo_FOLDERSVerify(i).fSTATUS = "1"
  next
  dbo_FOLDERSVerify(0).fFOLDERID = "Agr." & oneTimeDepositAdd.ISN
  dbo_FOLDERSVerify(0).fSPEC = "1ØÇ³Ý·³ÙÛ³ ³í³Ý¹- "&oneTimeDepositAdd.general.agreementN&" {êäÀ111}"
  dbo_FOLDERSVerify(0).fCOM = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(1).fFOLDERID = "C.1654739"
  dbo_FOLDERSVerify(1).fSPEC = oneTimeDepositAdd.general.agreementN&", (êäÀ111), »ññáñ¹ ³ÝÓ` (00000093), 100000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERSVerify(1).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(2).fFOLDERID = "C.977053288"
  dbo_FOLDERSVerify(2).fSPEC = oneTimeDepositAdd.general.agreementN&" (êäÀ111),     100000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERSVerify(2).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  Call CheckQueryRowCount("FOLDERS", "fISN", oneTimeDepositAdd.ISN, 3)
  for i = 0 to 2
    Call CheckDB_FOLDERS(dbo_FOLDERSVerify(i), 1)
  next
  
' SQL Ստուգում HIF  աղուսյակում 
  Log.Message "SQL Ստուգում HIF աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIF", "fOBJECT", oneTimeDepositAdd.ISN, 26)
End Sub

'Ավանդի ներգրավում SQL ստուգում
Sub Check_DB_DepositInvolvment(oneTimeDepositAdd)
  'SQL Ստուգում CONTRACTS աղուսյակում 
  Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
  dbo_CONTRACTS.fDGSTATE = 7
  Call CheckQueryRowCount("CONTRACTS", "fDGISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 6)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "101", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "T", "7", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "E", "7", "", 1)
  
  'SQL Ստուգում DOCS աղուսյակում համար
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  fBODY = "  CODE:"&oneTimeDepositAdd.general.agreementN&"  CLICOD:00034850  CLICOD3:00000093  NAME:êäÀ111  CURRENCY:000  ACCACC:03485010100  ACCACC3:000360100  ACCACCPR:03485010100  SUMMA:100000  CHRGFIRSTDAY:0  AUTOCAP:0  AUTODEBT:1  AUTOPROLONG:1  DATE:20201123  ACSBRANCH:01  ACSDEPART:1  ACSTYPE:D10  KINDSCALE:1  PCAGR:10.0000/365  WITHSCALE:0  DONOTCALCPCBASE:0  PCNOCHOOSE:0/1  PCBREAK:0.5000/365  TAXVALUE:10  PAYPERGIVE:0  PCNDERAUTO:0  PCPENAGR:0/1  PCPENPER:0/1  DATEGIVE:20201123  DATEAGR:20211123  CONSTPER:0  AUTODATE:0  REFRPERSUM:0  SECTOR:U2  SCHEDULE:AtlanticAG/EXPIMP  LRDISTR:001  REPAYADVANCE:100  PPRCODE:221  GIVEN:1  DLVSTMVIEW:3  DLVSTMVIEW3:3  SENDSTMADRS3:2  PERIODICITY:1/4  DATEDIFF:3  NONWORKDAYS:1  "
  fBODY = Replace(fBODY, "  ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp", "7", fBODY, 1)
  
  'SQL Ստուգում HI աղուսյակում համար
  Log.Message "SQL Ստուգում HI աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HI", "fBASE", fBASE, 2)
  Call Check_HI_CE_accounting ("2020-11-23", fBASE, "01", "187118585", "100000.00", "000", "100000.00", "MSC", "D")
  Call Check_HI_CE_accounting ("2020-11-23", fBASE, "01", "241020717", "100000.00", "000", "100000.00", "MSC", "C")
  
  'SQL Ստուգում HIF  աղուսյակում 
  Log.Message "SQL Ստուգում HIF աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIF", "fOBJECT", oneTimeDepositAdd.ISN, 27)

  'SQL Ստուգում HIR աղուսյակում 
  Log.Message "SQL Ստուգում HIR աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIR", "fOBJECT", oneTimeDepositAdd.ISN, 1)
  Call Check_HIR("2020-11-23", "R1", oneTimeDepositAdd.ISN, "000", "100000.00", "AGR", "D")
  
  'SQL Ստուգում HIREST  աղուսյակում 
  Log.Message "SQL Ստուգում HIREST աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIREST", "fOBJECT", "187118585", 8)
	Call CheckQueryRowCount("HIREST", "fOBJECT", "241020717", 10)

  'SQL Ստուգում HIRREST  աղուսյակում 
  Log.Message "SQL Ստուգում HIRREST աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIRREST", "fOBJECT", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_HIRREST("R1", oneTimeDepositAdd.ISN, "100000.00", "2020-11-23", 1)
End Sub

'Տոկոսների հաշվարկ SQL ստուգում
Sub Check_DB_CalculatePercent(oneTimeDepositAdd)
  Dim i  
  'SQL Ստուգում DAGRACCS աղուսյակում
  Log.Message "SQL Ստուգում DAGRACCS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DAGRACCS", "fAGRISN", oneTimeDepositAdd.ISN, 1)
  
  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 6)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "101", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "T", "7", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "E", "7", "", 1)
  
  'SQL Ստուգում DOCP աղուսյակում  
  Log.Message "SQL Ստուգում DOCP աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCP", "fPARENTISN", oneTimeDepositAdd.ISN, 2)
  Call CheckDB_DOCP("1705626", "Acc", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCP("187118585", "Acc", oneTimeDepositAdd.ISN, 1)
  
  'SQL Ստուգում DOCS աղուսյակում համար
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  fBODY = "  CODE:"&oneTimeDepositAdd.general.agreementN&"  CLICOD:00034850  CLICOD3:00000093  NAME:êäÀ111  CURRENCY:000  ACCACC:03485010100  ACCACC3:000360100  ACCACCPR:03485010100  SUMMA:100000  CHRGFIRSTDAY:0  AUTOCAP:0  AUTODEBT:1  AUTOPROLONG:1  DATE:20201123  ACSBRANCH:01  ACSDEPART:1  ACSTYPE:D10  KINDSCALE:1  PCAGR:10.0000/365  WITHSCALE:0  DONOTCALCPCBASE:0  PCNOCHOOSE:0/1  PCBREAK:0.5000/365  TAXVALUE:10  PAYPERGIVE:0  PCNDERAUTO:0  PCPENAGR:0/1  PCPENPER:0/1  DATEGIVE:20201123  DATEAGR:20211123  CONSTPER:0  AUTODATE:0  REFRPERSUM:0  SECTOR:U2  SCHEDULE:AtlanticAG/EXPIMP  LRDISTR:001  REPAYADVANCE:100  PPRCODE:221  GIVEN:1  DLVSTMVIEW:3  DLVSTMVIEW3:3  SENDSTMADRS3:2  PERIODICITY:1/4  DATEDIFF:3  NONWORKDAYS:1  "
  fBODY = Replace(fBODY, "  ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp", "7", fBODY, 1)
  
  'SQL Ստուգում FOLDERS աղուսյակում 
  Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
	for i = 0 to 2
    dbo_FOLDERSVerify(i).fNAME = "D1Disp  "
    dbo_FOLDERSVerify(i).fSTATUS = "1"
  next
  dbo_FOLDERSVerify(0).fFOLDERID = "Agr." & oneTimeDepositAdd.ISN
  dbo_FOLDERSVerify(0).fSPEC = "1ØÇ³Ý·³ÙÛ³ ³í³Ý¹- "&oneTimeDepositAdd.general.agreementN&" {êäÀ111}"
  dbo_FOLDERSVerify(0).fCOM = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(1).fFOLDERID = "C.1654739"
  dbo_FOLDERSVerify(1).fSPEC = oneTimeDepositAdd.general.agreementN&", (êäÀ111), »ññáñ¹ ³ÝÓ` (00000093), 100000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERSVerify(1).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(2).fFOLDERID = "C.977053288"
  dbo_FOLDERSVerify(2).fSPEC = oneTimeDepositAdd.general.agreementN&" (êäÀ111),     100000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERSVerify(2).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  Call CheckQueryRowCount("FOLDERS", "fISN", oneTimeDepositAdd.ISN, 3)
  for i = 0 to 2
    Call CheckDB_FOLDERS(dbo_FOLDERSVerify(i), 1)
  next
  
  'SQL Ստուգում HI աղուսյակում համար
  Log.Message "SQL Ստուգում HI աղուսյակում", "", pmNormal, SqlDivideColor
	Query = "Select fOBJECT From HI Where fBASE = '" & fBASE & "' and fOP = 'PRC' and fDBCR = 'C' and fSUM = '819.50'"
  ISN = my_Row_Count(Query)
  Call CheckQueryRowCount("HI", "fBASE", fBASE, 4)
  Call Check_HI_CE_accounting ("2020-12-22", fBASE, "01", "1629999", "819.50", "000", "819.50", "PRC", "D")
  Call Check_HI_CE_accounting ("2020-12-22", fBASE, "01", "877353073", "794.50", "000", "794.50", "PRC", "C")
  Call Check_HI_CE_accounting ("2020-12-22", fBASE, "01", ISN, "819.50", "000", "819.50", "PRC", "C")
  Call Check_HI_CE_accounting ("2020-12-22", fBASE, "01", ISN, "794.50", "000", "794.50", "PRC", "D")
  
  'SQL Ստուգում HIF  աղուսյակում 
  Log.Message "SQL Ստուգում HIF աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIF", "fOBJECT", oneTimeDepositAdd.ISN, 28)

  'SQL Ստուգում HIR աղուսյակում 
  Log.Message "SQL Ստուգում HIR աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIR", "fOBJECT", oneTimeDepositAdd.ISN, 4)
  Call Check_HIR("2020-11-23", "R1", oneTimeDepositAdd.ISN, "000", "100000.00", "AGR", "D")
  Call Check_HIR("2020-12-22", "R2", oneTimeDepositAdd.ISN, "000", "794.50", "PER", "D")
  Call Check_HIR("2020-12-22", "R¾", oneTimeDepositAdd.ISN, "000", "25.00", "PER", "D")
  Call Check_HIR("2020-12-23", "R¸", oneTimeDepositAdd.ISN, "000", "794.50", "PRJ", "D")
  
  'SQL Ստուգում HIREST  աղուսյակում 
  Log.Message "SQL Ստուգում HIREST աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIREST", "fOBJECT", ISN, 10)
	Call CheckQueryRowCount("HIREST", "fOBJECT", "1629999", 8)
	Call CheckQueryRowCount("HIREST", "fOBJECT", "877353073", 10)

  'SQL Ստուգում HIRREST  աղուսյակում 
  Log.Message "SQL Ստուգում HIRREST աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIRREST", "fOBJECT", oneTimeDepositAdd.ISN, 4)
  Call CheckDB_HIRREST("R1", oneTimeDepositAdd.ISN, "100000.00", "2020-11-23", 1)
  Call CheckDB_HIRREST("R2", oneTimeDepositAdd.ISN, "794.50", "2020-12-22", 1)
  Call CheckDB_HIRREST("R¸", oneTimeDepositAdd.ISN, "794.50", "2020-12-23", 1)
  Call CheckDB_HIRREST("R¾", oneTimeDepositAdd.ISN, "25.00", "2020-12-22", 1)
  
  'SQL Ստուգում HIT աղուսյակում 
  Log.Message "SQL Ստուգում HIT աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIT", "fOBJECT", oneTimeDepositAdd.ISN, 2)
  Call Check_HIT("2020-12-22", "N2", oneTimeDepositAdd.ISN, "000", "794.50", "PER", "D")
  Call Check_HIT("2020-12-22", "N¾", oneTimeDepositAdd.ISN, "000", "25.00", "PER", "D")
End Sub

'Տոկոսների կապիտալացում  SQL ստուգում
Sub Check_DB_Capitalization(oneTimeDepositAdd)
  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 6)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "101", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "T", "7", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "E", "7", "", 1)
  
  'SQL Ստուգում DOCS աղուսյակում համար
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  fBODY = "  CODE:"&oneTimeDepositAdd.general.agreementN&"  CLICOD:00034850  CLICOD3:00000093  NAME:êäÀ111  CURRENCY:000  ACCACC:03485010100  ACCACC3:000360100  ACCACCPR:03485010100  SUMMA:100000  CHRGFIRSTDAY:0  AUTOCAP:0  AUTODEBT:1  AUTOPROLONG:1  DATE:20201123  ACSBRANCH:01  ACSDEPART:1  ACSTYPE:D10  KINDSCALE:1  PCAGR:10.0000/365  WITHSCALE:0  DONOTCALCPCBASE:0  PCNOCHOOSE:0/1  PCBREAK:0.5000/365  TAXVALUE:10  PAYPERGIVE:0  PCNDERAUTO:0  PCPENAGR:0/1  PCPENPER:0/1  DATEGIVE:20201123  DATEAGR:20211123  CONSTPER:0  AUTODATE:0  REFRPERSUM:0  SECTOR:U2  SCHEDULE:AtlanticAG/EXPIMP  LRDISTR:001  REPAYADVANCE:100  PPRCODE:221  GIVEN:1  DLVSTMVIEW:3  DLVSTMVIEW3:3  SENDSTMADRS3:2  PERIODICITY:1/4  DATEDIFF:3  NONWORKDAYS:1  "
  fBODY = Replace(fBODY, "  ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp", "7", fBODY, 1)
  
  'SQL Ստուգում HI աղուսյակում համար
  Log.Message "SQL Ստուգում HI աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HI", "fBASE", fBASE, 6)
  Call Check_HI_CE_accounting ("2020-12-23", fBASE, "01", "1729922", "79.50", "000", "79.50", "MSC", "C")
  Call Check_HI_CE_accounting ("2020-12-23", fBASE, "01", "187118585", "794.50", "000", "794.50", "INT", "C")
  Call Check_HI_CE_accounting ("2020-12-23", fBASE, "01", "187118585", "715.00", "000", "715.00", "INT", "D")
  Call Check_HI_CE_accounting ("2020-12-23", fBASE, "01", "187118585", "79.50", "000", "79.50", "MSC", "D")
  Call Check_HI_CE_accounting ("2020-12-23", fBASE, "01", "241020717", "715.00", "000", "715.00", "INT", "C")
  Call Check_HI_CE_accounting ("2020-12-23", fBASE, "01", "877353073", "794.50", "000", "794.50", "INT", "D")
  
  'SQL Ստուգում HIR աղուսյակում 
  Log.Message "SQL Ստուգում HIR աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIR", "fOBJECT", oneTimeDepositAdd.ISN, 9)
  Call Check_HIR("2020-11-23", "R1", oneTimeDepositAdd.ISN, "000", "100000.00", "AGR", "D")
  Call Check_HIR("2020-12-22", "R2", oneTimeDepositAdd.ISN, "000", "794.50", "PER", "D")
  Call Check_HIR("2020-12-22", "R¾", oneTimeDepositAdd.ISN, "000", "25.00", "PER", "D")
  Call Check_HIR("2020-12-23", "R¸", oneTimeDepositAdd.ISN, "000", "794.50", "PRJ", "D")
  Call Check_HIR("2020-12-23", "R1", oneTimeDepositAdd.ISN, "000", "715.00", "CAP", "D")
  Call Check_HIR("2020-12-23", "R2", oneTimeDepositAdd.ISN, "000", "715.00", "CAP", "C")
  Call Check_HIR("2020-12-23", "R2", oneTimeDepositAdd.ISN, "000", "79.50", "TXC", "C")
  Call Check_HIR("2020-12-23", "R¸", oneTimeDepositAdd.ISN, "000", "715.00", "CAP", "C")
  Call Check_HIR("2020-12-23", "R¸", oneTimeDepositAdd.ISN, "000", "79.50", "TXC", "C")
  
  'SQL Ստուգում HIREST  աղուսյակում 
  Log.Message "SQL Ստուգում HIREST աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIREST", "fOBJECT", ISN, 10)
	Call CheckQueryRowCount("HIREST", "fOBJECT", "187118585", 8)
	Call CheckQueryRowCount("HIREST", "fOBJECT", "241020717", 10)
	Call CheckQueryRowCount("HIREST", "fOBJECT", "877353073", 10)

  'SQL Ստուգում HIRREST  աղուսյակում 
  Log.Message "SQL Ստուգում HIRREST աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIRREST", "fOBJECT", oneTimeDepositAdd.ISN, 4)
  Call CheckDB_HIRREST("R1", oneTimeDepositAdd.ISN, "100715.00", "2020-12-23", 1)
  Call CheckDB_HIRREST("R2", oneTimeDepositAdd.ISN, "0.00", "2020-12-23", 1)
  Call CheckDB_HIRREST("R¸", oneTimeDepositAdd.ISN, "0.00", "2020-12-23", 1)
  Call CheckDB_HIRREST("R¾", oneTimeDepositAdd.ISN, "25.00", "2020-12-22", 1)
End Sub

'Ժամկետների վերանայում  SQL ստուգում
Sub Check_DB_DepositExtension(oneTimeDepositAdd)
  Dim i  
  'SQL Ստուգում CONTRACTS աղուսյակում 
  Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("CONTRACTS", "fDGISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 7)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "101", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "T", "7", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "E", "7", "", 2)
  
  'SQL Ստուգում DOCS աղուսյակում համար
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  fBODY = "  CODE:"&oneTimeDepositAdd.general.agreementN&"  CLICOD:00034850  CLICOD3:00000093  NAME:êäÀ111  CURRENCY:000  ACCACC:03485010100  ACCACC3:000360100  ACCACCPR:03485010100  SUMMA:100000  CHRGFIRSTDAY:0  AUTOCAP:0  AUTODEBT:1  AUTOPROLONG:1  DATE:20201123  ACSBRANCH:01  ACSDEPART:1  ACSTYPE:D10  KINDSCALE:1  PCAGR:10.0000/365  WITHSCALE:0  DONOTCALCPCBASE:0  PCNOCHOOSE:0/1  PCBREAK:0.5000/365  TAXVALUE:10  PAYPERGIVE:0  PCNDERAUTO:0  PCPENAGR:0/1  PCPENPER:0/1  DATEGIVE:20201123  DATEAGR:20211123  CONSTPER:0  AUTODATE:0  REFRPERSUM:0  SECTOR:U2  SCHEDULE:AtlanticAG/EXPIMP  LRDISTR:001  REPAYADVANCE:100  PPRCODE:221  GIVEN:1  DLVSTMVIEW:3  DLVSTMVIEW3:3  SENDSTMADRS3:2  PERIODICITY:1/4  DATEDIFF:3  NONWORKDAYS:1  "
  fBODY = Replace(fBODY, "  ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp", "7", fBODY, 1)
  
  'SQL Ստուգում DOCSG աղուսյակում 
  Log.Message "SQL Ստուգում DOCSG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", oneTimeDepositAdd.ISN, 12)
  for i = 0 to 11
    Call CheckDB_DOCSG(oneTimeDepositAdd.ISN, "DATES", i, "DATEPER", DOCSG(i), 1)
  next
  
  'SQL Ստուգում FOLDERS աղուսյակում 
  Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
	for i = 0 to 2
    dbo_FOLDERSVerify(i).fNAME = "D1Disp  "
    dbo_FOLDERSVerify(i).fSTATUS = "1"
  next
  dbo_FOLDERSVerify(0).fFOLDERID = "Agr." & oneTimeDepositAdd.ISN
  dbo_FOLDERSVerify(0).fSPEC = "1ØÇ³Ý·³ÙÛ³ ³í³Ý¹- "&oneTimeDepositAdd.general.agreementN&" {êäÀ111}"
  dbo_FOLDERSVerify(0).fCOM = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(1).fFOLDERID = "C.1654739"
  dbo_FOLDERSVerify(1).fSPEC = oneTimeDepositAdd.general.agreementN&", (êäÀ111), »ññáñ¹ ³ÝÓ` (00000093), 100000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERSVerify(1).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(2).fFOLDERID = "C.977053288"
  dbo_FOLDERSVerify(2).fSPEC = oneTimeDepositAdd.general.agreementN&" (êäÀ111),     100000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERSVerify(2).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  Call CheckQueryRowCount("FOLDERS", "fISN", oneTimeDepositAdd.ISN, 3)
  for i = 0 to 2
    Call CheckDB_FOLDERS(dbo_FOLDERSVerify(i), 1)
  next
  
  'SQL Ստուգում HIF  աղուսյակում 
  Log.Message "SQL Ստուգում HIF աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIF", "fOBJECT", oneTimeDepositAdd.ISN, 42)
End Sub

'Պարտքերի մարում SQL ստուգում
Sub Check_DB_DebtRepayment(oneTimeDepositAdd)
  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 7)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "101", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "T", "7", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "E", "7", "", 2)
  
  'SQL Ստուգում DOCS աղուսյակում համար
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  fBODY = "  CODE:"&oneTimeDepositAdd.general.agreementN&"  CLICOD:00034850  CLICOD3:00000093  NAME:êäÀ111  CURRENCY:000  ACCACC:03485010100  ACCACC3:000360100  ACCACCPR:03485010100  SUMMA:100000  CHRGFIRSTDAY:0  AUTOCAP:0  AUTODEBT:1  AUTOPROLONG:1  DATE:20201123  ACSBRANCH:01  ACSDEPART:1  ACSTYPE:D10  KINDSCALE:1  PCAGR:10.0000/365  WITHSCALE:0  DONOTCALCPCBASE:0  PCNOCHOOSE:0/1  PCBREAK:0.5000/365  TAXVALUE:10  PAYPERGIVE:0  PCNDERAUTO:0  PCPENAGR:0/1  PCPENPER:0/1  DATEGIVE:20201123  DATEAGR:20211123  CONSTPER:0  AUTODATE:0  REFRPERSUM:0  SECTOR:U2  SCHEDULE:AtlanticAG/EXPIMP  LRDISTR:001  REPAYADVANCE:100  PPRCODE:221  GIVEN:1  DLVSTMVIEW:3  DLVSTMVIEW3:3  SENDSTMADRS3:2  PERIODICITY:1/4  DATEDIFF:3  NONWORKDAYS:1  "
  fBODY = Replace(fBODY, "  ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp", "7", fBODY, 1)  
  
  'SQL Ստուգում HI աղուսյակում համար
  Log.Message "SQL Ստուգում HI աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HI", "fBASE", fBASE, 2)
  Call Check_HI_CE_accounting ("2020-12-23", fBASE, "01", "187118585", "10000.00", "000", "10000.00", "MSC", "C")
  Call Check_HI_CE_accounting ("2020-12-23", fBASE, "01", "241020717", "10000.00", "000", "10000.00", "MSC", "D")
  
  'SQL Ստուգում HIR աղուսյակում 
  Log.Message "SQL Ստուգում HIR աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIR", "fOBJECT", oneTimeDepositAdd.ISN, 10)
  Call Check_HIR("2020-11-23", "R1", oneTimeDepositAdd.ISN, "000", "100000.00", "AGR", "D")
  Call Check_HIR("2020-12-22", "R2", oneTimeDepositAdd.ISN, "000", "794.50", "PER", "D")
  Call Check_HIR("2020-12-22", "R¾", oneTimeDepositAdd.ISN, "000", "25.00", "PER", "D")
  Call Check_HIR("2020-12-23", "R¸", oneTimeDepositAdd.ISN, "000", "794.50", "PRJ", "D")
  Call Check_HIR("2020-12-23", "R1", oneTimeDepositAdd.ISN, "000", "715.00", "CAP", "D")
  Call Check_HIR("2020-12-23", "R2", oneTimeDepositAdd.ISN, "000", "715.00", "CAP", "C")
  Call Check_HIR("2020-12-23", "R2", oneTimeDepositAdd.ISN, "000", "79.50", "TXC", "C")
  Call Check_HIR("2020-12-23", "R¸", oneTimeDepositAdd.ISN, "000", "715.00", "CAP", "C")
  Call Check_HIR("2020-12-23", "R¸", oneTimeDepositAdd.ISN, "000", "79.50", "TXC", "C")
  Call Check_HIR("2020-12-23", "R1", oneTimeDepositAdd.ISN, "000", "10000.00", "DBT", "C")
  
  'SQL Ստուգում HIREST  աղուսյակում 
  Log.Message "SQL Ստուգում HIREST աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIREST", "fOBJECT", ISN, 10)
	Call CheckQueryRowCount("HIREST", "fOBJECT", "187118585", 8)
	Call CheckQueryRowCount("HIREST", "fOBJECT", "241020717", 10)

  'SQL Ստուգում HIRREST  աղուսյակում 
  Log.Message "SQL Ստուգում HIRREST աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIRREST", "fOBJECT", oneTimeDepositAdd.ISN, 4)
  Call CheckDB_HIRREST("R1", oneTimeDepositAdd.ISN, "90715.00", "2020-12-23", 1)
  Call CheckDB_HIRREST("R2", oneTimeDepositAdd.ISN, "0.00", "2020-12-23", 1)
  Call CheckDB_HIRREST("R¸", oneTimeDepositAdd.ISN, "0.00", "2020-12-23", 1)
  Call CheckDB_HIRREST("R¾", oneTimeDepositAdd.ISN, "25.00", "2020-12-22", 1)
End Sub

'Տոկոսադրույքներ SQL ստուգում
Sub Check_DB_ChangeRete(oneTimeDepositAdd)
  Dim i
  'SQL Ստուգում CONTRACTS աղուսյակում 
  Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("CONTRACTS", "fDGISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)

  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 8)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "101", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "T", "7", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "E", "7", "", 3)
  
  'SQL Ստուգում DOCS աղուսյակում համար
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  fBODY = "  CLICOD:00034850  CLICOD3:00000093  NAME:êäÀ111  CURRENCY:000  ACCACC:03485010100  ACCACC3:000360100  ACCACCPR:03485010100  SUMMA:100000  CHRGFIRSTDAY:0  AUTOCAP:0  AUTODEBT:1  AUTOPROLONG:1  DATE:20201123  ACSBRANCH:01  ACSDEPART:1  ACSTYPE:D10  KINDSCALE:1  PCAGR:10.0000/365  WITHSCALE:0  DONOTCALCPCBASE:0  PCNOCHOOSE:0/1  PCBREAK:0.5000/365  TAXVALUE:10  PAYPERGIVE:0  PCNDERAUTO:0  PCPENAGR:0/1  PCPENPER:0/1  DATEGIVE:20201123  DATEAGR:20211123  CONSTPER:0  AUTODATE:0  REFRPERSUM:0  SECTOR:U2  SCHEDULE:AtlanticAG/EXPIMP  LRDISTR:001  REPAYADVANCE:100  PPRCODE:221  GIVEN:1  DLVSTMVIEW:3  DLVSTMVIEW3:3  SENDSTMADRS3:2  PERIODICITY:1/4  DATEDIFF:3  NONWORKDAYS:1  "
  fBODY = Replace(fBODY, "  ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp", "7", fBODY, 1)  
  
  'SQL Ստուգում FOLDERS աղուսյակում 
  Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
	for i = 0 to 2
    dbo_FOLDERSVerify(i).fNAME = "D1Disp  "
    dbo_FOLDERSVerify(i).fSTATUS = "1"
  next
  dbo_FOLDERSVerify(0).fFOLDERID = "Agr." & oneTimeDepositAdd.ISN
  dbo_FOLDERSVerify(0).fSPEC = "1ØÇ³Ý·³ÙÛ³ ³í³Ý¹- "&oneTimeDepositAdd.general.agreementN&" {êäÀ111}"
  dbo_FOLDERSVerify(0).fCOM = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(1).fFOLDERID = "C.1654739"
  dbo_FOLDERSVerify(1).fSPEC = oneTimeDepositAdd.general.agreementN&", (êäÀ111), »ññáñ¹ ³ÝÓ` (00000093), 100000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERSVerify(1).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(2).fFOLDERID = "C.977053288"
  dbo_FOLDERSVerify(2).fSPEC = oneTimeDepositAdd.general.agreementN&" (êäÀ111),     100000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERSVerify(2).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  Call CheckQueryRowCount("FOLDERS", "fISN", oneTimeDepositAdd.ISN, 3)
  for i = 0 to 2
    Call CheckDB_FOLDERS(dbo_FOLDERSVerify(i), 1)
  next
  
  'SQL Ստուգում HIF  աղուսյակում 
  Log.Message "SQL Ստուգում HIF աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIF", "fOBJECT", oneTimeDepositAdd.ISN, 47)
End Sub

'Արդյունավետ տոկոսադրույք SQL ստուգում
Sub Check_DB_ChangeEffRete(oneTimeDepositAdd)
  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 8)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "101", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "T", "7", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "E", "7", "", 3)
  
  'SQL Ստուգում DOCS աղուսյակում համար
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  fBODY = "  CLICOD:00034850  CLICOD3:00000093  NAME:êäÀ111  CURRENCY:000  ACCACC:03485010100  ACCACC3:000360100  ACCACCPR:03485010100  SUMMA:100000  CHRGFIRSTDAY:0  AUTOCAP:0  AUTODEBT:1  AUTOPROLONG:1  DATE:20201123  ACSBRANCH:01  ACSDEPART:1  ACSTYPE:D10  KINDSCALE:1  PCAGR:10.0000/365  WITHSCALE:0  DONOTCALCPCBASE:0  PCNOCHOOSE:0/1  PCBREAK:0.5000/365  TAXVALUE:10  PAYPERGIVE:0  PCNDERAUTO:0  PCPENAGR:0/1  PCPENPER:0/1  DATEGIVE:20201123  DATEAGR:20211123  CONSTPER:0  AUTODATE:0  REFRPERSUM:0  SECTOR:U2  SCHEDULE:AtlanticAG/EXPIMP  LRDISTR:001  REPAYADVANCE:100  PPRCODE:221  GIVEN:1  DLVSTMVIEW:3  DLVSTMVIEW3:3  SENDSTMADRS3:2  PERIODICITY:1/4  DATEDIFF:3  NONWORKDAYS:1  "
  fBODY = Replace(fBODY, "  ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp", "7", fBODY, 1)    
  
  'SQL Ստուգում HIF  աղուսյակում 
  Log.Message "SQL Ստուգում HIF աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIF", "fOBJECT", oneTimeDepositAdd.ISN, 49)
End Sub

'Պարտքերի մարում SQL ստուգում
Sub Check_DB_DebtRepayment2(oneTimeDepositAdd)
  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 8)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "101", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "T", "7", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "E", "7", "", 3)
  
  'SQL Ստուգում DOCS աղուսյակում համար
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  fBODY = "  CLICOD:00034850  CLICOD3:00000093  NAME:êäÀ111  CURRENCY:000  ACCACC:03485010100  ACCACC3:000360100  ACCACCPR:03485010100  SUMMA:100000  CHRGFIRSTDAY:0  AUTOCAP:0  AUTODEBT:1  AUTOPROLONG:1  DATE:20201123  ACSBRANCH:01  ACSDEPART:1  ACSTYPE:D10  KINDSCALE:1  PCAGR:10.0000/365  WITHSCALE:0  DONOTCALCPCBASE:0  PCNOCHOOSE:0/1  PCBREAK:0.5000/365  TAXVALUE:10  PAYPERGIVE:0  PCNDERAUTO:0  PCPENAGR:0/1  PCPENPER:0/1  DATEGIVE:20201123  DATEAGR:20211123  CONSTPER:0  AUTODATE:0  REFRPERSUM:0  SECTOR:U2  SCHEDULE:AtlanticAG/EXPIMP  LRDISTR:001  REPAYADVANCE:100  PPRCODE:221  GIVEN:1  DLVSTMVIEW:3  DLVSTMVIEW3:3  SENDSTMADRS3:2  PERIODICITY:1/4  DATEDIFF:3  NONWORKDAYS:1  "
  fBODY = Replace(fBODY, "  ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp", "7", fBODY, 1)      
  
  'SQL Ստուգում HI աղուսյակում համար
  Log.Message "SQL Ստուգում HI աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HI", "fBASE", fBASE, 4)
  Call Check_HI_CE_accounting ("2020-12-23", fBASE, "01", "1629999", "25.00", "000", "25.00", "PRC", "C")
  Call Check_HI_CE_accounting ("2020-12-23", fBASE, "01", "187118585", "90715.00", "000", "90715.00", "MSC", "C")
  Call Check_HI_CE_accounting ("2020-12-23", fBASE, "01", "241020717", "90715.00", "000", "90715.00", "MSC", "D")
  Call Check_HI_CE_accounting ("2020-12-23", fBASE, "01", ISN, "25.00", "000", "25.00", "PRC", "D")
  
  'SQL Ստուգում HIR աղուսյակում 
  Log.Message "SQL Ստուգում HIR աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIR", "fOBJECT", oneTimeDepositAdd.ISN, 12)
  Call Check_HIR("2020-11-23", "R1", oneTimeDepositAdd.ISN, "000", "100000.00", "AGR", "D")
  Call Check_HIR("2020-12-22", "R2", oneTimeDepositAdd.ISN, "000", "794.50", "PER", "D")
  Call Check_HIR("2020-12-22", "R¾", oneTimeDepositAdd.ISN, "000", "25.00", "PER", "D")
  Call Check_HIR("2020-12-23", "R¸", oneTimeDepositAdd.ISN, "000", "794.50", "PRJ", "D")
  Call Check_HIR("2020-12-23", "R1", oneTimeDepositAdd.ISN, "000", "715.00", "CAP", "D")
  Call Check_HIR("2020-12-23", "R2", oneTimeDepositAdd.ISN, "000", "715.00", "CAP", "C")
  Call Check_HIR("2020-12-23", "R2", oneTimeDepositAdd.ISN, "000", "79.50", "TXC", "C")
  Call Check_HIR("2020-12-23", "R¸", oneTimeDepositAdd.ISN, "000", "715.00", "CAP", "C")
  Call Check_HIR("2020-12-23", "R¸", oneTimeDepositAdd.ISN, "000", "79.50", "TXC", "C")
  Call Check_HIR("2020-12-23", "R1", oneTimeDepositAdd.ISN, "000", "10000.00", "DBT", "C")
  Call Check_HIR("2020-12-23", "R1", oneTimeDepositAdd.ISN, "000", "90715.00", "DBT", "C")
  Call Check_HIR("2020-12-23", "R¾", oneTimeDepositAdd.ISN, "000", "-25.00", "DB1", "D")
  
  'SQL Ստուգում HIREST  աղուսյակում 
  Log.Message "SQL Ստուգում HIREST աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIREST", "fOBJECT", ISN, 10)
	Call CheckQueryRowCount("HIREST", "fOBJECT", "187118585", 8)
	Call CheckQueryRowCount("HIREST", "fOBJECT", "241020717", 10)
	Call CheckQueryRowCount("HIREST", "fOBJECT", "1629999", 8)

  'SQL Ստուգում HIRREST  աղուսյակում 
  Log.Message "SQL Ստուգում HIRREST աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIRREST", "fOBJECT", oneTimeDepositAdd.ISN, 4)
  Call CheckDB_HIRREST("R1", oneTimeDepositAdd.ISN, "0.00", "2020-12-23", 1)
  Call CheckDB_HIRREST("R2", oneTimeDepositAdd.ISN, "0.00", "2020-12-23", 1)
  Call CheckDB_HIRREST("R¸", oneTimeDepositAdd.ISN, "0.00", "2020-12-23", 1)
  Call CheckDB_HIRREST("R¾", oneTimeDepositAdd.ISN, "0.00", "2020-12-23", 1)
End Sub

'Պայմանագրի փակում SQL ստուգում
Sub Check_DB_DateClose(oneTimeDepositAdd)
  Dim i
  'SQL Ստուգում CONTRACTS աղուսյակում 
  Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("CONTRACTS", "fDGISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)

  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 10)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "101", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "T", "7", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "E", "7", "", 3)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "77", "ä³ÛÙ³Ý³·ñÇ ÷³ÏáõÙ", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "7", "", 1)
    
  'SQL Ստուգում DOCS աղուսյակում համար
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  fBODY = "  CLICOD:00034850  CLICOD3:00000093  NAME:êäÀ111  CURRENCY:000  ACCACC:03485010100  ACCACC3:000360100  ACCACCPR:03485010100  SUMMA:100000  CHRGFIRSTDAY:0  AUTOCAP:0  AUTODEBT:1  AUTOPROLONG:1  DATE:20201123  ACSBRANCH:01  ACSDEPART:1  ACSTYPE:D10  KINDSCALE:1  PCAGR:10.0000/365  WITHSCALE:0  DONOTCALCPCBASE:0  PCNOCHOOSE:0/1  PCBREAK:0.5000/365  TAXVALUE:10  PAYPERGIVE:0  PCNDERAUTO:0  PCPENAGR:0/1  PCPENPER:0/1  DATEGIVE:20201123  DATEAGR:20211123  CONSTPER:0  AUTODATE:0  REFRPERSUM:0  SECTOR:U2  SCHEDULE:AtlanticAG/EXPIMP  LRDISTR:001  REPAYADVANCE:100  PPRCODE:221  GIVEN:1  DLVSTMVIEW:3  DLVSTMVIEW3:3  SENDSTMADRS3:2  PERIODICITY:1/4  DATEDIFF:3  NONWORKDAYS:1  "
  fBODY = Replace(fBODY, "  ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp", "7", fBODY, 1)      
  
  'SQL Ստուգում FOLDERS աղուսյակում 
  Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
	for i = 0 to 2
    dbo_FOLDERSVerify(i).fNAME = "D1Disp  "
    dbo_FOLDERSVerify(i).fSTATUS = "1"
  next
  dbo_FOLDERSVerify(0).fFOLDERID = "Agr." & oneTimeDepositAdd.ISN
  dbo_FOLDERSVerify(0).fSPEC = "1ØÇ³Ý·³ÙÛ³ ³í³Ý¹- "&oneTimeDepositAdd.general.agreementN&" {êäÀ111}"
  dbo_FOLDERSVerify(0).fCOM = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(1).fFOLDERID = "C.1654739"
  dbo_FOLDERSVerify(1).fSPEC = oneTimeDepositAdd.general.agreementN&", (êäÀ111), »ññáñ¹ ³ÝÓ` (00000093), 100000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù[ö³Ïí³Í]"
  dbo_FOLDERSVerify(1).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(2).fFOLDERID = "C.977053288"
  dbo_FOLDERSVerify(2).fSPEC = oneTimeDepositAdd.general.agreementN&" (êäÀ111),     100000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù[ö³Ïí³Í]"
  dbo_FOLDERSVerify(2).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"  
  Call CheckQueryRowCount("FOLDERS", "fISN", oneTimeDepositAdd.ISN, 3)
  for i = 0 to 2
    Call CheckDB_FOLDERS(dbo_FOLDERSVerify(i), 1)
  next
End Sub

'Պայմանագրի բացում SQL ստուգում
Sub Check_DB_DateOpen(oneTimeDepositAdd)
  Dim i  
  'SQL Ստուգում CONTRACTS աղուսյակում 
  Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("CONTRACTS", "fDGISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)

  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 11)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "101", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "T", "7", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "E", "7", "", 3)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "77", "ä³ÛÙ³Ý³·ñÇ ÷³ÏáõÙ", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "7", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "7", "ä³ÛÙ³Ý³·ñÇ µ³óáõÙ", 1)
    
  'SQL Ստուգում DOCP աղուսյակում  
  Log.Message "SQL Ստուգում DOCP աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCP", "fPARENTISN", oneTimeDepositAdd.ISN, 2)
  Call CheckDB_DOCP("1705626", "Acc", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCP("187118585", "Acc", oneTimeDepositAdd.ISN, 1)
  
  'SQL Ստուգում DOCS աղուսյակում համար
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  fBODY = "  CODE:"&oneTimeDepositAdd.general.agreementN&"  CLICOD:00034850  CLICOD3:00000093  NAME:êäÀ111  CURRENCY:000  ACCACC:03485010100  ACCACC3:000360100  ACCACCPR:03485010100  SUMMA:100000  CHRGFIRSTDAY:0  AUTOCAP:0  AUTODEBT:1  AUTOPROLONG:1  DATE:20201123  ACSBRANCH:01  ACSDEPART:1  ACSTYPE:D10  KINDSCALE:1  PCAGR:10.0000/365  WITHSCALE:0  DONOTCALCPCBASE:0  PCNOCHOOSE:0/1  PCBREAK:0.5000/365  TAXVALUE:10  PAYPERGIVE:0  PCNDERAUTO:0  PCPENAGR:0/1  PCPENPER:0/1  DATEGIVE:20201123  DATEAGR:20211123  CONSTPER:0  AUTODATE:0  REFRPERSUM:0  SECTOR:U2  SCHEDULE:AtlanticAG/EXPIMP  LRDISTR:001  REPAYADVANCE:100  PPRCODE:221  GIVEN:1  DLVSTMVIEW:3  DLVSTMVIEW3:3  SENDSTMADRS3:2  PERIODICITY:1/4  DATEDIFF:3  NONWORKDAYS:1  "
  fBODY = Replace(fBODY, "  ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp", "7", fBODY, 1)      
  
  'SQL Ստուգում FOLDERS աղուսյակում 
  Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
	for i = 0 to 2
    dbo_FOLDERSVerify(i).fNAME = "D1Disp  "
    dbo_FOLDERSVerify(i).fSTATUS = "1"
  next
  dbo_FOLDERSVerify(0).fFOLDERID = "Agr." & oneTimeDepositAdd.ISN
  dbo_FOLDERSVerify(0).fSPEC = "1ØÇ³Ý·³ÙÛ³ ³í³Ý¹- "&oneTimeDepositAdd.general.agreementN&" {êäÀ111}"
  dbo_FOLDERSVerify(0).fCOM = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(1).fFOLDERID = "C.1654739"
  dbo_FOLDERSVerify(1).fSPEC = oneTimeDepositAdd.general.agreementN&", (êäÀ111), »ññáñ¹ ³ÝÓ` (00000093), 100000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERSVerify(1).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  dbo_FOLDERSVerify(2).fFOLDERID = "C.977053288"
  dbo_FOLDERSVerify(2).fSPEC = oneTimeDepositAdd.general.agreementN&" (êäÀ111),     100000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERSVerify(2).fCOM = " ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
  Call CheckQueryRowCount("FOLDERS", "fISN", oneTimeDepositAdd.ISN, 3)
  for i = 0 to 2
    Call CheckDB_FOLDERS(dbo_FOLDERSVerify(i), 1)
  next  
End Sub

'Բոլոր փաստաթղթերի ջնջում SQL ստուգում
Sub Check_DB_Delete_AgreementAllOperations(oneTimeDepositAdd)  
  'SQL Ստուգում CONTRACTS աղուսյակում 
  Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("CONTRACTS", "fDGISN", oneTimeDepositAdd.ISN, 0)

  'SQL Ստուգում DOCLOG աղուսյակում համար
  Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", oneTimeDepositAdd.ISN, 13)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "N", "1", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "101", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "T", "7", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "E", "7", "", 4)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "77", "ä³ÛÙ³Ý³·ñÇ ÷³ÏáõÙ", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "C", "7", "", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "M", "7", "ä³ÛÙ³Ý³·ñÇ µ³óáõÙ", 1)
  Call CheckDB_DOCLOG(oneTimeDepositAdd.ISN, "77", "D", "999", "", 1)
    
  'SQL Ստուգում DOCP աղուսյակում  
  Log.Message "SQL Ստուգում DOCP աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCP", "fPARENTISN", oneTimeDepositAdd.ISN, 0)
  
  'SQL Ստուգում DOCS աղուսյակում համար
  Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
  fBODY = " CODE:"&oneTimeDepositAdd.general.agreementN&" CLICOD:00034850 CLICOD3:00000093 NAME:êäÀ111 CURRENCY:000 ACCACC:03485010100 ACCACC3:000360100 ACCACCPR:03485010100 SUMMA:100000 CHRGFIRSTDAY:0 AUTOCAP:0 AUTODEBT:1 AUTOPROLONG:1 DATE:20201123 ACSBRANCH:01 ACSDEPART:1 ACSTYPE:D10 KINDSCALE:1 PCAGR:10.0000/365 WITHSCALE:0 DONOTCALCPCBASE:0 PCNOCHOOSE:0/1 PCBREAK:0.5000/365 TAXVALUE:10 PAYPERGIVE:0 PCNDERAUTO:0 PCPENAGR:0/1 PCPENPER:0/1 DATEGIVE:20201123 DATEAGR:20211123 CONSTPER:0 AUTODATE:0 REFRPERSUM:0 SECTOR:U2 SCHEDULE:AtlanticAG/EXPIMP LRDISTR:001 REPAYADVANCE:100 PPRCODE:221 GIVEN:0 DLVSTMVIEW:3 DLVSTMVIEW3:3 SENDSTMADRS3:2 PERIODICITY:1/4 DATEDIFF:3 NONWORKDAYS:1 "
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", oneTimeDepositAdd.ISN, 1)
  Call CheckDB_DOCS(oneTimeDepositAdd.ISN, "D1Disp", "999", fBODY, 1)      
    
  'SQL Ստուգում DAGRACCS աղուսյակում 
  Log.Message "SQL Ստուգում DAGRACCS աղուսյակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DAGRACCS", "fAGRISN", oneTimeDepositAdd.ISN, 0)
End Sub