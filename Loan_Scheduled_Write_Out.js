'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Subsystems_Special_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Library_Contracts
'USEUNIT Library_CheckDB
'USEUNIT Library_Colour
'USEUNIT Mortgage_Library
Option Explicit

'Test case ID 176403

Dim sDate, eDate, loanScheduled, folderName, fBase, operName(5)
Dim ChrgfISN, ChrgDocNum, store, writeOut, agreeAllOperations
Dim dbo_FOLDERS(4), dbo_FOLDERS_Pay(4), dbo_CONTRACTS, fBODY, i, obj, Money, PrMoney

Sub Loan_Scheduled_Write_Out_Test()

		Call Test_Inintialize()
		Call Test_StartUp()

		'¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ
		Log.Message "Գրաֆիկով վարկային պայմանագրի ստեղծում", "", pmNormal, DivideColor
		Call loanScheduled.CreatePlLoan(folderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
		
		Call Close_Pttel("frmPttel")
		
		'¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Գրաֆիկով վարկային պայմանագրի ստեղծումից հետո SQL ստուգում", "", pmNormal, DivideColor
		Call DB_Initialize()
		Call Check_DB_Create()
				
		'ä³ÛÙ³Ý³·ñÇ áõÕ³ñÏáõÙ Ñ³ëï³ïÙ³Ý
		Log.Message "Պայմանագրի ուղարկում հաստատման", "", pmNormal, DivideColor
		Call loanScheduled.SendToVerify(folderName & "²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
		
		'ä³ÛÙ³Ý³·ñÇ Ñ³ëï³ïÙ³Ý áõÕ³ñÏáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պայմանագրի հաստատման ուղարկումից հետո SQL ստուգում", "", pmNormal, DivideColor
		Call Check_DB_SendToVerify()

		'ö³ëï³ÃÕÃÇ Ñ³ëï³ïáõÙ
		Log.Message "Փաստաթղթի հաստատում", "", pmNormal, DivideColor
		Call loanScheduled.Verify(folderName & "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
		
		'ö³ëï³ÃÕÃÇ Ñ³ëï³ïáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Փաստաթղթի հաստատումից հետո SQL ստուգում", "", pmNormal, DivideColor
		Call Check_DB_Verify()
	
		'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
		Log.Message "Փաստաթղթի առկայության ստուգում ""Պայմանագրեր"" թղթապանակում", "", pmNormal, DivideColor
		Call loanScheduled.OpenInFolder(folderName)
		
		'¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó
		Log.Message "Գանձում տրամադրումից", "", pmNormal, DivideColor
		Call Collect_From_Provision ("151121", null, "2", null, ChrgfISN)
		
		'¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Գանձում տրամադրումից հետո SQL ստուգում", "", pmNormal, DivideColor
		Call Check_DB_Collect_From_Prov()
		
		'ì³ñÏÇ ïñ³Ù³¹ñáõÙ
		Log.Message "Վարկի տրամադրում", "", pmNormal, DivideColor
		Call Give_Credit ("151121", "10000", "2", null, fBase)
		
		'ì³ñÏÇ ïñ³Ù³¹ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Վարկի տրամադրումից հետո SQL ստուգում", "", pmNormal, DivideColor
		Call Check_DB_Give_Credit()
		
		'ä³Ñáõëï³íáñáõÙ
		Log.Message "Պահուստավորում", "", pmNormal, DivideColor
		store.ExpectedAgreementN = loanScheduled.DocNum
		Call Doc_Store(store)
		
		'ä³Ñáõëï³íáñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պահուստավորումից հետո SQL ստուգում", "", pmNormal, DivideColor
		Call Check_DB_Doc_Store()
		
		'¸áõñë ·ñáõÙ
		Log.Message "Դուրս գրում", "", pmNormal, DivideColor
		writeOut.ExpectedAgreementN = loanScheduled.DocNum
		Call Create_WriteOut(writeOut)
		
		'¸áõñë ·ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Դուրս գրումից հետո SQL ստուգում", "", pmNormal, DivideColor
		Call Check_DB_Create_WriteOut()
		
		'¶ñ³ýÇÏÇ í»ñ³Ý³ÛáõÙ
		Log.Message "Երկարաձգում", "", pmNormal, DivideColor
		fBase = PaymentScheduleReview("151121", "151122", 1, 10, Money, PrMoney)
		
		'¶ñ³ýÇÏÇ í»ñ³Ý³ÛáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Երկարաձգումից հետո SQL ստուգում", "", pmNormal, DivideColor
		Call Check_DB_Pay_Schedule()
		
		Call Close_Pttel("frmPttel")
		
		'ö³ëï³ÃÕÃÇ Ñ³ëï³ïáõÙ
		Log.Message "Փաստաթղթի հաստատում", "", pmNormal, DivideColor
		Call loanScheduled.Verify(folderName & "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
		
		'ö³ëï³ÃÕÃÇ Ñ³ëï³ïáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Փաստաթղթի հաստատումից հետո SQL ստուգում", "", pmNormal, DivideColor
		Call Check_DB_Verify2()
		
		'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
		Log.Message "Փաստաթղթի առկայության ստուգում ""Պայմանագրեր"" թղթապանակում", "", pmNormal, DivideColor
		Call loanScheduled.OpenInFolder(folderName)
		
		'ÊÙµ³ÛÇÝ Ñ³ßí³ñÏ
		Log.Message "Խմբային հաշվարկ", "", pmNormal, DivideColor
		Call Percent_Group_Calculate("171121", "171121", true, false)
		
		'ÊÙµ³ÛÇÝ Ñ³ßí³ñÏÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Խմբային հաշվարկից հետո SQL ստուգում", "", pmNormal, DivideColor
		Call Check_DB_Percent_Group_Calc()
		
		Call Close_Pttel("frmPttel")
		
		'æÝç»É µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñÁ
		Log.Message "Ջնջել բոլոր գործողությունները", "", pmNormal, DivideColor
		agreeAllOperations.agreementN = loanScheduled.DocNum
		folderName = "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|Üáñ ÷³ëï³Ã., ÃÕÃ³å³Ý³ÏÝ»ñ, Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|"
		Call Delete_AgreementAllOperations(folderName, agreeAllOperations, "frmPttel", 4, operName)
		
		'æÝç»É µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Ջնջել բոլոր գործողություններից հետո SQL ստուգում", "", pmNormal, DivideColor
		Call Check_DB_Delete()
		
		'Test EndUp
		Call Close_AsBank()
End Sub

Sub Test_StartUp()
		Call Initialize_AsBank("bank", sDate, eDate)   
		Call Login("CREDITOPERATOR")
End Sub

Sub Test_Inintialize()
		sDate = "20120101"
		eDate = "20260101"
		
		folderName = "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|"
		
		Set loanScheduled = New_LoanDocument() 
		With loanScheduled
				.DocType = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ"
				.CalcAcc = "000007800"
				.Limit = "10000"
				.Date = "151121"
				.GiveDate = "151121"
				.Term = "151122"
				.CheckPayDates = 1
				.PayDates = "15"
				.Direction = "2"
				.Percent = "18"
				.Baj = "365"
				.Sector = "E"
				.UsageField = "03.001"
				.Aim = "00"
				.Schedule = "9"
				.Guarantee = "1"
				.Country = "AM"
				.District = "001"
				.RegionLR = "010000008"
				.PaperCode = "12"
				.Time = "15"
		End With
		
		Set store = New_RcStore()
		With store
				.Date = "151121"
				.Provision = "4500"
		End With
		
		Set writeOut = New_RcWriteOut()
		With writeOut
				.Date = "151121"
				.BaseSum = "3500"
				.TotalSum = "3,500.00"
		End With
		
		Set agreeAllOperations = New_AgreementAllOperations()
		With agreeAllOperations
				.startDate = "011121"
				.endDate = "301121"
		End With
		
		operName(0) = "ä³ñ³Ù»ïñ»ñ"
		operName(1) = "¸áõñë ·ñáõÙ"
		operName(2) = "ä³Ñáõëï³íáñáõÙ"
		operName(3) = "ì³ñÏÇ ïñ³Ù³¹ñáõÙ"
		operName(4) = "¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó"
		operName(5) = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ"
End Sub

Sub DB_Initialize()
		Set dbo_CONTRACTS = New_DB_CONTRACTS()
		dbo_CONTRACTS.fDGISN = loanScheduled.fBase
		dbo_CONTRACTS.fDGPARENTISN = loanScheduled.fBase
		dbo_CONTRACTS.fDGISN1 = loanScheduled.fBase
		dbo_CONTRACTS.fDGISN3 = loanScheduled.fBase
		dbo_CONTRACTS.fDGAGRKIND = "8C"
		dbo_CONTRACTS.fDGSTATE = 206
		dbo_CONTRACTS.fDGTYPENAME = "C1Univer"
		dbo_CONTRACTS.fDGCODE = loanScheduled.DocNum
		dbo_CONTRACTS.fDGPPRCODE = "12"
		dbo_CONTRACTS.fDGCAPTION = "§Ø³ëÇë ´³ÝÏ¦"
		dbo_CONTRACTS.fDGCLICODE = "00000004"
		dbo_CONTRACTS.fDGCUR = "000"
		dbo_CONTRACTS.fDGSUMMA = "10000.00"
		dbo_CONTRACTS.fDGALLSUMMA = "0.00"
		dbo_CONTRACTS.fDGRISKDEGREE = "0.00"
		dbo_CONTRACTS.fDGRISKDEGNB = "0.00"
		dbo_CONTRACTS.fDGSCHEDULE = "9"
		dbo_CONTRACTS.fDGDISTRICT = "001"
		dbo_CONTRACTS.fDGACSBRANCH = "00"
		dbo_CONTRACTS.fDGACSDEPART = "1"
		dbo_CONTRACTS.fDGACSTYPE = "C10 "
		dbo_CONTRACTS.fDGAIM = "00"
		dbo_CONTRACTS.fDGUSAGEFIELD = "03.001"
		dbo_CONTRACTS.fDGCOUNTRY = "AM "
		dbo_CONTRACTS.fDGREGION = "010000008"
		
		For i = 0 to 3
				Set dbo_FOLDERS(i) = New_DB_FOLDERS()
				dbo_FOLDERS(i).fKEY = loanScheduled.fBase
				dbo_FOLDERS(i).fISN = loanScheduled.fBase
				dbo_FOLDERS(i).fNAME = "C1Univer"
				dbo_FOLDERS(i).fSTATUS = "1"
		Next
		dbo_FOLDERS(0).fFOLDERID = "Agr." & loanScheduled.fBase
		dbo_FOLDERS(0).fCOM = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ"
		dbo_FOLDERS(0).fSPEC = "1¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ- " & loanScheduled.DocNum & " {§Ø³ëÇë ´³ÝÏ¦}"
		dbo_FOLDERS(1).fFOLDERID = "C.1628319"
		dbo_FOLDERS(1).fCOM = " ¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ"
		dbo_FOLDERS(1).fSPEC = loanScheduled.DocNum & " (§Ø³ëÇë ´³ÝÏ¦),     10000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
		dbo_FOLDERS(2).fFOLDERID = "SSWork.CRC120211115"
		dbo_FOLDERS(2).fCOM = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ"
		dbo_FOLDERS(2).fSPEC = loanScheduled.DocNum & "      C10 20211115            0.0091  00000004Üáñ å³ÛÙ³Ý³·Çñ      "
		dbo_FOLDERS(2).fECOM = "Credit with Repayment Schedule"
		dbo_FOLDERS(2).fDCBRANCH = "00 "
		dbo_FOLDERS(2).fDCDEPART = "1  "
		dbo_FOLDERS(3).fFOLDERID = "SSConf.CRC1001"
		dbo_FOLDERS(3).fSTATUS = "4"
		dbo_FOLDERS(3).fCOM = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ"
		dbo_FOLDERS(3).fSPEC = loanScheduled.DocNum & "      C10 20211115            0.0091  00000004"
		dbo_FOLDERS(3).fECOM = "Credit with Repayment Schedule"
		dbo_FOLDERS(3).fDCBRANCH = "00 "
		dbo_FOLDERS(3).fDCDEPART = "1  "
		
		For i = 0 to 3
				Set dbo_FOLDERS_Pay(i) = New_DB_FOLDERS()
				dbo_FOLDERS_Pay(i).fNAME = "C1TSDtUn"
				dbo_FOLDERS_Pay(i).fSTATUS = "0"
		Next
		dbo_FOLDERS_Pay(0).fFOLDERID = "Agr." & loanScheduled.fBase
		dbo_FOLDERS_Pay(0).fCOM = "Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ"
		dbo_FOLDERS_Pay(0).fSPEC = "1Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ`  15/11/21  /àõÕ³ñÏí³Í Ñ³ëï³ïÙ³Ý/"
		dbo_FOLDERS_Pay(0).fECOM = "Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ"
		dbo_FOLDERS_Pay(1).fFOLDERID = "AgrConf." & loanScheduled.fBase
		dbo_FOLDERS_Pay(1).fCOM = "Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ"
		dbo_FOLDERS_Pay(2).fFOLDERID = "SSConf.EDC1001"
		dbo_FOLDERS_Pay(2).fSTATUS = "4"
		dbo_FOLDERS_Pay(2).fCOM = "Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ"
		dbo_FOLDERS_Pay(2).fSPEC = loanScheduled.DocNum & "      C10 20211115            0.0091  00000004"
		dbo_FOLDERS_Pay(2).fECOM = "Repayment schedule"
		dbo_FOLDERS_Pay(2).fDCBRANCH = "00 "
		dbo_FOLDERS_Pay(2).fDCDEPART = "1  "
		dbo_FOLDERS_Pay(3).fFOLDERID = "SSWork.EDC120211115"
		dbo_FOLDERS_Pay(3).fCOM = "Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ"
		dbo_FOLDERS_Pay(3).fSPEC = loanScheduled.DocNum & "      C10 20211115            0.0091  00000004àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³"
		dbo_FOLDERS_Pay(3).fECOM = "Repayment schedule"
		dbo_FOLDERS_Pay(3).fDCBRANCH = "00 "
		dbo_FOLDERS_Pay(3).fDCDEPART = "1  "
End	Sub

Sub Check_DB_Create()
		'SQL Ստուգում AGRNOTES աղուսյակում  
		Log.Message "SQL Ստուգում AGRNOTES աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("AGRNOTES", "fAGRISN", loanScheduled.fBase, 1)
		
		'SQL Ստուգում CONTRACTS աղուսյակում 
		Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("CONTRACTS", "fDGISN", loanScheduled.fBase, 1)
		Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
		'SQL Ստուգում DOCLOG աղուսյակում համար
		Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", loanScheduled.fBase, 2)
		Call CheckDB_DOCLOG(loanScheduled.fBase, "91", "N", "1", "", 1)
		Call CheckDB_DOCLOG(loanScheduled.fBase, "91", "C", "206", "", 1)
  
		'SQL Ստուգում DOCP աղուսյակում  
		Log.Message "SQL Ստուգում DOCP աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCP", "fPARENTISN", loanScheduled.fBase, 1)
		Call CheckDB_DOCP("1630204", "Acc", loanScheduled.fBase, 1)
  
		'SQL Ստուգում DOCS աղուսյակում 
		Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & loanScheduled.DocNum & " CLICOD:00000004 NAME:§Ø³ëÇë ´³ÝÏ¦ CURRENCY:000 ACCACC:000007800 SUMMA:10000 DATE:20211115 DATEGIVE:20211115 DATEAGR:20221115 EXISTSPROLPERSCH:0 ISLINE:0 ALLOCATEWITHLIM:0 ISREGENERATIVE:0 ISCRCARD:0 AUTOCAP:0 ISLIMPERPR:0 ISPERPR:0 ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C10 AUTODEBT:1 DEBTJPART1:1 DEBTJPART:0 USECLICONNSCH:0 USECODEBTORSACCS:0 ONLYOVERDUE:0 DATESFILLTYPE:1 AGRMARBEG:20211115 AGRMARFIN:20221115 ISNOTUSETHISM:0 FIXEDDAYS:15 PASSOVDIRECTION:2 PASSOVTYPE:0 SUMSDATESFILLTYPE:1 SUMSFILLTYPE:01 FILLROUND:2 MIXEDSUMSINSCH:0 FIXEDROWSINSCH:1 APARTPERDATES:0 KINDSCALE:1 PCAGR:18.0000/365 PCNOCHOOSE:8.0000/365 PCGRANT:0/1 CONSTPER:0 ISCONSCURPRD:0 FILLROUNDPR:2 DONOTCALCPCBASE:0 PAYPERGIVE:0 PAYPERGIVEPER:0 PCNDERAUTO:1 KINDPENCALC:1 PCPENAGR:0/1 PCPENPER:0/1 PCLOSS:0/1 CALCFINPER:1 CALCJOUTS:0 SECTOR:E USAGEFIELD:03.001 AIM:00 SCHEDULE:9 GUARANTEE:1 COUNTRY:AM LRDISTR:001 REGION:010000008 REDUCEOVRDDAYS:0 WEIGHTAMDRISK:0 PPRCODE:12 TIMEOP:15:00:00 CHRGFIRSTDAY:1 GIVEN:0 SUBJRISK:0 UPDINS:0 DOOVRDINWORKDAYS:0 ISNBOUT:0 PUTINLR:0 NOTCLASS:0 OTHERCOLLATERAL:0 OVRDDAYSCALCACRA:0 OVRDAGRSUMACRA:0 OVRDPERSUMACRA:0 RISKACRA:0 "
		fBODY = Replace(fBODY, " ", "%")
		Call CheckQueryRowCount("DOCS", "fISN", loanScheduled.fBase, 1)
		Call CheckDB_DOCS(loanScheduled.fBase, "C1Univer", "206", fBODY, 1)
  
		'SQL Ստուգում DOCSG աղուսյակում 
		Log.Message "SQL Ստուգում DOCSG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCSG", "fISN", loanScheduled.fBase, 40)
  
		'SQL Ստուգում FOLDERS աղուսյակում 
		Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("FOLDERS", "fISN", loanScheduled.fBase, 3)
		for i = 0 to 2
				Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
		next
  
		'SQL Ստուգում RESNUMBERS աղուսյակում 
		Log.Message "SQL Ստուգում RESNUMBERS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("RESNUMBERS", "fISN", loanScheduled.fBase, 1)
		Call CheckDB_RESNUMBERS(loanScheduled.fBase, "C", loanScheduled.DocNum, 1)		
End	Sub

Sub Check_DB_SendToVerify()
		'SQL Ստուգում AGRSCHEDULE աղուսյակում  
		Log.Message "SQL Ստուգում AGRSCHEDULE աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("AGRSCHEDULE", "fAGRISN", loanScheduled.fBase, 1)
		
		'SQL Ստուգում AGRSCHEDULEVALUES աղուսյակում  
		Log.Message "SQL Ստուգում AGRSCHEDULEVALUES աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("AGRSCHEDULEVALUES", "fAGRISN", loanScheduled.fBase, 24)

		'SQL Ստուգում CONTRACTS աղուսյակում 
		Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
		dbo_CONTRACTS.fDGSTATE = 101
		Call CheckQueryRowCount("CONTRACTS", "fDGISN", loanScheduled.fBase, 1)
		Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
		'SQL Ստուգում DOCLOG աղուսյակում համար
		Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", loanScheduled.fBase, 5)
		Call CheckDB_DOCLOG(loanScheduled.fBase, "91", "E", "1", "", 1)
		Call CheckDB_DOCLOG(loanScheduled.fBase, "91", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(loanScheduled.fBase, "91", "C", "101", "", 1)
  
		'SQL Ստուգում DOCS աղուսյակում 
		Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCS", "fISN", loanScheduled.fBase, 1)
		Call CheckDB_DOCS(loanScheduled.fBase, "C1Univer", "101", fBODY, 1)
		
		'SQL Ստուգում FOLDERS աղուսյակում 
		Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
		dbo_FOLDERS(0).fSTATUS = "0"
		dbo_FOLDERS(1).fSTATUS = "0"
		dbo_FOLDERS(2).fSTATUS = "0"
		dbo_FOLDERS(2).fSPEC = loanScheduled.DocNum & "      C10 20211115            0.0091  00000004àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³"
		Call CheckQueryRowCount("FOLDERS", "fISN", loanScheduled.fBase, 4)
		for i = 0 to 3
				Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
		next
End	Sub

Sub Check_DB_Verify()
		'SQL Ստուգում CAGRACCS աղուսյակում  
		Log.Message "SQL Ստուգում CAGRACCS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("CAGRACCS", "fAGRISN", loanScheduled.fBase, 1)
		
		'SQL Ստուգում CONTRACTS աղուսյակում 
		Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
		dbo_CONTRACTS.fDGSTATE = 7
		obj = Get_SQL_ColumnValue("CONTRACTS", "fDGCRDTCODE", "fDGISN = " & loanScheduled.fBase)
		dbo_CONTRACTS.fDGCRDTCODE = "" & obj
		Call CheckQueryRowCount("CONTRACTS", "fDGISN", loanScheduled.fBase, 1)
		Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
		
		'SQL Ստուգում DOCLOG աղուսյակում համար
		Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", loanScheduled.fBase, 7)
		Call CheckDB_DOCLOG(loanScheduled.fBase, "91", "W", "102", "", 1)
		Call CheckDB_DOCLOG(loanScheduled.fBase, "91", "T", "7", "", 1)
		
		'SQL Ստուգում DOCP աղուսյակում  
		Log.Message "SQL Ստուգում DOCP աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCP", "fPARENTISN", loanScheduled.fBase, 1)
		Call CheckDB_DOCP("1630204", "Acc", loanScheduled.fBase, 1)
		
		'SQL Ստուգում DOCS աղուսյակում 
		Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCS", "fISN", loanScheduled.fBase, 1)
		Call CheckDB_DOCS(loanScheduled.fBase, "C1Univer", "7", fBODY, 1)
		
		'SQL Ստուգում DOCSG աղուսյակում 
		Log.Message "SQL Ստուգում DOCSG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCSG", "fISN", loanScheduled.fBase, 40)
		
		'SQL Ստուգում FOLDERS աղուսյակում 
		Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
		dbo_FOLDERS(0).fSTATUS = "1"
		dbo_FOLDERS(1).fSTATUS = "1"
		dbo_FOLDERS(1).fECOM = "1"
		Call CheckQueryRowCount("FOLDERS", "fISN", loanScheduled.fBase, 2)
		for i = 0 to 1
				Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
		next
		
		'SQL Ստուգում HIF  աղուսյակում 
		Log.Message "SQL Ստուգում HIF աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HIF", "fOBJECT", loanScheduled.fBase, 19)
		
		'SQL Ստուգում HIREST  աղուսյակում 
		Log.Message "SQL Ստուգում HIREST աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HIREST", "fOBJECT", "1630204", 10)
End	Sub

Sub Check_DB_Collect_From_Prov()
		'SQL Ստուգում DOCLOG աղուսյակում համար
		Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", loanScheduled.fBase, 7)
		Call CheckQueryRowCount("DOCLOG", "fISN", ChrgfISN, 4)
		Call CheckDB_DOCLOG(ChrgfISN, "91", "N", "1", "", 1)
		Call CheckDB_DOCLOG(ChrgfISN, "91", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(ChrgfISN, "91", "T", "2", "", 1)
		Call CheckDB_DOCLOG(ChrgfISN, "91", "C", "5", "", 1)
		
		'SQL Ստուգում DOCS աղուսյակում 
		Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCS", "fISN", loanScheduled.fBase, 1)
		Call CheckQueryRowCount("DOCS", "fISN", ChrgfISN, 1)
		fBODY = " CODE:" & loanScheduled.DocNum & " DATE:20211115 SUMMA:10 CASHORNO:2 APPLYCONNSCH:0 ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C10 USERID:  91 " 
		fBODY = Replace(fBODY, " ", "%")
		Call CheckDB_DOCS(ChrgfISN, "C1DSPay ", "5", fBODY, 1)
		
		'SQL Ստուգում HI աղուսյակում համար
		Log.Message "SQL Ստուգում HI աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HI", "fBASE", ChrgfISN, 2)
		obj = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & ChrgfISN & " and fDBCR = 'C'")
		Call Check_HI_CE_accounting ("2021-11-15", ChrgfISN, "01", "1630204", "10.00", "000", "10.00", "FEE", "D")
		Call Check_HI_CE_accounting ("2021-11-15", ChrgfISN, "01", obj, "10.00", "000", "10.00", "FEE", "C")
		
		'SQL Ստուգում HIR աղուսյակում 
		Log.Message "SQL Ստուգում HIR աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HIR", "fOBJECT", loanScheduled.fBase, 1)
		Call Check_HIR("2021-11-15", "R^", loanScheduled.fBase, "000", "10.00", "PAY", "D")

		'SQL Ստուգում HIRREST  աղուսյակում 
		Log.Message "SQL Ստուգում HIRREST աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HIRREST", "fOBJECT", loanScheduled.fBase, 1)
		Call CheckDB_HIRREST("R^", loanScheduled.fBase, "10.00", "2021-11-15", 1)		
End	Sub

Sub Check_DB_Give_Credit()
		'SQL Ստուգում CAGRACCS աղուսյակում  
		Log.Message "SQL Ստուգում CAGRACCS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("CAGRACCS", "fAGRISN", loanScheduled.fBase, 1)
		
		'SQL Ստուգում CONTRACTS աղուսյակում 
		Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("CONTRACTS", "fDGISN", loanScheduled.fBase, 1)
		Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
		
		'SQL Ստուգում DOCLOG աղուսյակում համար
		Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", loanScheduled.fBase, 8)
		Call CheckDB_DOCLOG(loanScheduled.fBase, "91", "E", "7", "", 1)
		Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)
		Call CheckDB_DOCLOG(fBase, "91", "N", "1", "", 1)
		Call CheckDB_DOCLOG(fBase, "91", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(fBase, "91", "T", "2", "", 1)
		Call CheckDB_DOCLOG(fBase, "91", "C", "5", "", 1)
		
		'SQL Ստուգում DOCP աղուսյակում  
		Log.Message "SQL Ստուգում DOCP աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCP", "fPARENTISN", loanScheduled.fBase, 1)
		Call CheckDB_DOCP("1630204", "Acc", loanScheduled.fBase, 1)
		
		'SQL Ստուգում DOCS աղուսյակում 
		Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & loanScheduled.DocNum & " DATE:20211115 SUMMA:10000 CASHORNO:2 COMMENT:ì³ñÏÇ ïñ³Ù³¹ñáõÙ ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C10 USERID:  91 SYSTEMTYPE:1 "  
		fBODY = Replace(fBODY, " ", "%")
		Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
		Call CheckDB_DOCS(fBase, "C1DSAgr ", "5", fBODY, 1)
		
		'SQL Ստուգում FOLDERS աղուսյակում 
		Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("FOLDERS", "fISN", loanScheduled.fBase, 2)
		for i = 0 to 1
				Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
		next
		
		'SQL Ստուգում HIF  աղուսյակում 
		Log.Message "SQL Ստուգում HIF աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HIF", "fOBJECT", loanScheduled.fBase, 20)
		
		'SQL Ստուգում HI աղուսյակում համար
		Log.Message "SQL Ստուգում HI աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HI", "fBASE", fBase, 6)
		Call Check_HI_CE_accounting ("2021-11-15", fBase, "01", "1630204", "10000.00", "000", "10000.00", "MSC", "C")
		obj = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & fBase & " and fDBCR = 'D' and fSUM = '10000.00'")
		Call Check_HI_CE_accounting ("2021-11-15", fBase, "01", obj, "10000.00", "000", "10000.00", "MSC", "D")
	
		'SQL Ստուգում HIR աղուսյակում 
		Log.Message "SQL Ստուգում HIR աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HIR", "fOBJECT", loanScheduled.fBase, 3)
		Call Check_HIR("2021-11-15", "R^", loanScheduled.fBase, "000", "10.00", "PAY", "D")
		Call Check_HIR("2021-11-15", "R1", loanScheduled.fBase, "000", "10000.00", "AGR", "D")
		Call Check_HIR("2021-11-15", "R¾", loanScheduled.fBase, "000", "10.00", "PAY", "C")

		'SQL Ստուգում HIRREST  աղուսյակում 
		Log.Message "SQL Ստուգում HIRREST աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HIRREST", "fOBJECT", loanScheduled.fBase, 3)
		Call CheckDB_HIRREST("R1", loanScheduled.fBase, "10000.00", "2021-11-15", 1)
		Call CheckDB_HIRREST("R^", loanScheduled.fBase, "10.00", "2021-11-15", 1)
		Call CheckDB_HIRREST("R¾", loanScheduled.fBase, "-10.00", "2021-11-15", 1)
End	Sub

Sub Check_DB_Doc_Store()
		'SQL Ստուգում DOCLOG աղուսյակում համար
		Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", store.isn, 4)
		Call CheckDB_DOCLOG(store.isn, "91", "N", "1", "", 1)
		Call CheckDB_DOCLOG(store.isn, "91", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(store.isn, "91", "T", "2", "", 1)
		Call CheckDB_DOCLOG(store.isn, "91", "C", "5", "", 1)
		
		'SQL Ստուգում DOCS աղուսյակում 
		Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & loanScheduled.DocNum & " DATE:20211115 SUMRES:4500 ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C10 USERID:  91 "  
		fBODY = Replace(fBODY, " ", "%")
		Call CheckQueryRowCount("DOCS", "fISN", store.isn, 1)
		Call CheckDB_DOCS(store.isn, "C1DSRes ", "5", fBODY, 1)
		
		'SQL Ստուգում HI աղուսյակում համար
		Log.Message "SQL Ստուգում HI աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HI", "fBASE", store.isn, 2)
		obj = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & store.isn & " and fDBCR = 'D'")
		Call Check_HI_CE_accounting ("2021-11-15", store.isn, "01", obj, "4500.00", "000", "4500.00", "RST", "D")
		obj = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & store.isn & " and fDBCR = 'C'")
		Call Check_HI_CE_accounting ("2021-11-15", store.isn, "01", obj, "4500.00", "000", "4500.00", "RST", "C")
	
		'SQL Ստուգում HIR աղուսյակում 
		Log.Message "SQL Ստուգում HIR աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HIR", "fOBJECT", loanScheduled.fBase, 4)
		Call Check_HIR("2021-11-15", "R4", loanScheduled.fBase, "000", "4500.00", "RES", "D")

		'SQL Ստուգում HIRREST  աղուսյակում 
		Log.Message "SQL Ստուգում HIRREST աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HIRREST", "fOBJECT", loanScheduled.fBase, 4)
		Call CheckDB_HIRREST("R4", loanScheduled.fBase, "4500.00", "2021-11-15", 1)
End	Sub

Sub Check_DB_Create_WriteOut()
		'SQL Ստուգում DOCLOG աղուսյակում համար
		Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", writeOut.isn, 4)
		Call CheckDB_DOCLOG(writeOut.isn, "91", "N", "1", "", 1)
		Call CheckDB_DOCLOG(writeOut.isn, "91", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(writeOut.isn, "91", "T", "2", "", 1)
		Call CheckDB_DOCLOG(writeOut.isn, "91", "C", "5", "", 1)
		
		'SQL Ստուգում DOCS աղուսյակում 
		Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & loanScheduled.DocNum & " DATE:20211115 SUMMA:3500 SUMAGR:3500 ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C10 USERID:  91 "  
		fBODY = Replace(fBODY, " ", "%")
		Call CheckQueryRowCount("DOCS", "fISN", writeOut.isn, 1)
		Call CheckDB_DOCS(writeOut.isn, "C1DSOut  ", "5", fBODY, 1)
		
		'SQL Ստուգում HI աղուսյակում համար
		Log.Message "SQL Ստուգում HI աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HI", "fBASE", writeOut.isn, 3)
		obj = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & writeOut.isn & " and fDBCR = 'D' and fTYPE = '02'")
		Call Check_HI_CE_accounting ("2021-11-15", writeOut.isn, "02", obj, "3500.00", "000", "3500.00", "MSC", "D")
		obj = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & writeOut.isn & " and fDBCR = 'C' and fSUM = '3500.00'")
		Call Check_HI_CE_accounting ("2021-11-15", writeOut.isn, "01", obj, "3500.00", "000", "3500.00", "MSC", "C")
		obj = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & writeOut.isn & " and fDBCR = 'D' and fTYPE = '01'")
		Call Check_HI_CE_accounting ("2021-11-15", writeOut.isn, "01", obj, "3500.00", "000", "3500.00", "MSC", "D")
	
		'SQL Ստուգում HIR աղուսյակում 
		Log.Message "SQL Ստուգում HIR աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HIR", "fOBJECT", loanScheduled.fBase, 6)
		Call Check_HIR("2021-11-15", "R4", loanScheduled.fBase, "000", "3500.00", "OUT", "C")
		Call Check_HIR("2021-11-15", "R5", loanScheduled.fBase, "000", "3500.00", "OUT", "D")

		'SQL Ստուգում HIRREST  աղուսյակում 
		Log.Message "SQL Ստուգում HIRREST աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HIRREST", "fOBJECT", loanScheduled.fBase, 5)
		Call CheckDB_HIRREST("R4", loanScheduled.fBase, "1000.00", "2021-11-15", 1)
		Call CheckDB_HIRREST("R5", loanScheduled.fBase, "3500.00", "2021-11-15", 1)
End	Sub

Sub Check_DB_Pay_Schedule()
		'SQL Ստուգում CONTRACTS աղուսյակում 
		Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("CONTRACTS", "fDGISN", loanScheduled.fBase, 1)
		Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
		
		'SQL Ստուգում DOCLOG աղուսյակում համար
		Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 3)
		Call CheckDB_DOCLOG(fBase, "91", "N", "1", "", 1)
		Call CheckDB_DOCLOG(fBase, "91", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(fBase, "91", "C", "101", "", 1)
				
		'SQL Ստուգում DOCS աղուսյակում 
		Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & loanScheduled.DocNum & " DATE:20211115 DATEAGR:20221115 TIMEOP:10:00:00 ISPROLONG:1 AUTODATEUN:0 COPYSCHEDULE:0 IMPFROMEXCEL:0 REFRPERSUM:0 COMMENT:Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ USERID:  91 "  
		fBODY = Replace(fBODY, " ", "%")
		Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
		Call CheckDB_DOCS(fBase, "C1TSDtUn", "101", fBODY, 1)
		
		'SQL Ստուգում DOCSG աղուսյակում 
		Log.Message "SQL Ստուգում DOCSG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCSG", "fISN", fBase, 72)
		
		'SQL Ստուգում FOLDERS աղուսյակում 
		Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("FOLDERS", "fISN", fBase, 4)
		for i = 0 to 3
				dbo_FOLDERS_Pay(i).fKEY = fBase
				dbo_FOLDERS_Pay(i).fISN = fBase
				dbo_FOLDERS_Pay(0).fKEY = "C1TSDtUn"
				Call CheckDB_FOLDERS(dbo_FOLDERS_Pay(i), 1)
		next
End	Sub

Sub Check_DB_Verify2()
		'SQL Ստուգում AGRSCHEDULE աղուսյակում  
		Log.Message "SQL Ստուգում AGRSCHEDULE աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("AGRSCHEDULE", "fAGRISN", loanScheduled.fBase, 2)
		
		'SQL Ստուգում AGRSCHEDULEVALUES աղուսյակում  
		Log.Message "SQL Ստուգում AGRSCHEDULEVALUES աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("AGRSCHEDULEVALUES", "fAGRISN", loanScheduled.fBase, 48)

		'SQL Ստուգում CONTRACTS աղուսյակում 
		Log.Message "SQL Ստուգում CONTRACTS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("CONTRACTS", "fDGISN", loanScheduled.fBase, 1)
		Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
		'SQL Ստուգում DOCLOG աղուսյակում համար
		Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", loanScheduled.fBase, 11)
		Call CheckDB_DOCLOG(loanScheduled.fBase, "91", "E", "7", "", 4)
  
		'SQL Ստուգում DOCS աղուսյակում 
		Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & loanScheduled.DocNum & " CRDTCODE:" & dbo_CONTRACTS.fDGCRDTCODE & " CLICOD:00000004 NAME:§Ø³ëÇë ´³ÝÏ¦ CURRENCY:000 ACCACC:000007800 SUMMA:10000 DATE:20211115 DATEGIVE:20211115 DATEAGR:20221115 EXISTSPROLPERSCH:0 ISLINE:0 ALLOCATEWITHLIM:0 ISREGENERATIVE:0 ISCRCARD:0 AUTOCAP:0 ISLIMPERPR:0 ISPERPR:0 ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C10 AUTODEBT:1 DEBTJPART1:1 DEBTJPART:0 USECLICONNSCH:0 USECODEBTORSACCS:0 ONLYOVERDUE:0 DATESFILLTYPE:1 AGRMARBEG:20211115 AGRMARFIN:20221115 ISNOTUSETHISM:0 FIXEDDAYS:15 PASSOVDIRECTION:2 PASSOVTYPE:0 SUMSDATESFILLTYPE:1 SUMSFILLTYPE:01 FILLROUND:2 MIXEDSUMSINSCH:0 FIXEDROWSINSCH:1 APARTPERDATES:0 KINDSCALE:1 PCAGR:18.0000/365 PCNOCHOOSE:8.0000/365 PCGRANT:0/1 CONSTPER:0 ISCONSCURPRD:0 FILLROUNDPR:2 DONOTCALCPCBASE:0 PAYPERGIVE:0 PAYPERGIVEPER:0 PCNDER:19.5616 PCNDERALL:19.7951 PCNDERAUTO:1 KINDPENCALC:1 PCPENAGR:0/1 PCPENPER:0/1 PCLOSS:0/1 CALCFINPER:1 CALCJOUTS:0 SECTOR:E USAGEFIELD:03.001 AIM:00 SCHEDULE:9 GUARANTEE:1 COUNTRY:AM LRDISTR:001 REGION:010000008 PERRES:1 REDUCEOVRDDAYS:0 WEIGHTAMDRISK:0 PPRCODE:12 TIMEOP:15:00:00 CHRGFIRSTDAY:1 GIVEN:1 SUBJRISK:0 UPDINS:0 DOOVRDINWORKDAYS:0 ISNBOUT:0 PUTINLR:0 NOTCLASS:0 OTHERCOLLATERAL:0 OVRDDAYSCALCACRA:0 OVRDAGRSUMACRA:0 OVRDPERSUMACRA:0 RISKACRA:0   "
		fBODY = Replace(fBODY, " ", "%")
		Call CheckQueryRowCount("DOCS", "fISN", loanScheduled.fBase, 1)
		Call CheckDB_DOCS(loanScheduled.fBase, "C1Univer", "7", fBODY, 1)
		
		'SQL Ստուգում DOCSG աղուսյակում 
		Log.Message "SQL Ստուգում DOCSG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCSG", "fISN", loanScheduled.fBase, 40)
		
		'SQL Ստուգում FOLDERS աղուսյակում 
		Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("FOLDERS", "fISN", loanScheduled.fBase, 2)
		dbo_FOLDERS(1).fECOM = "1"
		for i = 0 to 1
				dbo_FOLDERS(i).fSTATUS = "1"
				Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
		next
		
		'SQL Ստուգում HIF  աղուսյակում 
		Log.Message "SQL Ստուգում HIF աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("HIF", "fOBJECT", loanScheduled.fBase, 24)
End	Sub

Sub Check_DB_Percent_Group_Calc()
		'SQL Ստուգում DOCLOG աղուսյակում համար
		Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", loanScheduled.fBase, 11)
		
		'SQL Ստուգում DOCS աղուսյակում 
		Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & loanScheduled.DocNum & " CRDTCODE:" & dbo_CONTRACTS.fDGCRDTCODE & " CLICOD:00000004 NAME:§Ø³ëÇë ´³ÝÏ¦ CURRENCY:000 ACCACC:000007800 SUMMA:10000 DATE:20211115 DATEGIVE:20211115 DATEAGR:20221115 EXISTSPROLPERSCH:0 ISLINE:0 ALLOCATEWITHLIM:0 ISREGENERATIVE:0 ISCRCARD:0 AUTOCAP:0 ISLIMPERPR:0 ISPERPR:0 ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C10 AUTODEBT:1 DEBTJPART1:1 DEBTJPART:0 USECLICONNSCH:0 USECODEBTORSACCS:0 ONLYOVERDUE:0 DATESFILLTYPE:1 AGRMARBEG:20211115 AGRMARFIN:20221115 ISNOTUSETHISM:0 FIXEDDAYS:15 PASSOVDIRECTION:2 PASSOVTYPE:0 SUMSDATESFILLTYPE:1 SUMSFILLTYPE:01 FILLROUND:2 MIXEDSUMSINSCH:0 FIXEDROWSINSCH:1 APARTPERDATES:0 KINDSCALE:1 PCAGR:18.0000/365 PCNOCHOOSE:8.0000/365 PCGRANT:0/1 CONSTPER:0 ISCONSCURPRD:0 FILLROUNDPR:2 DONOTCALCPCBASE:0 PAYPERGIVE:0 PAYPERGIVEPER:0 PCNDER:19.5616 PCNDERALL:19.7951 PCNDERAUTO:1 KINDPENCALC:1 PCPENAGR:0/1 PCPENPER:0/1 PCLOSS:0/1 CALCFINPER:1 CALCJOUTS:0 SECTOR:E USAGEFIELD:03.001 AIM:00 SCHEDULE:9 GUARANTEE:1 COUNTRY:AM LRDISTR:001 REGION:010000008 PERRES:1 REDUCEOVRDDAYS:0 WEIGHTAMDRISK:0 PPRCODE:12 TIMEOP:15:00:00 CHRGFIRSTDAY:1 GIVEN:1 SUBJRISK:0 UPDINS:0 DOOVRDINWORKDAYS:0 ISNBOUT:0 PUTINLR:0 NOTCLASS:0 OTHERCOLLATERAL:0 OVRDDAYSCALCACRA:0 OVRDAGRSUMACRA:0 OVRDPERSUMACRA:0 RISKACRA:0 "  
		fBODY = Replace(fBODY, " ", "%")
		Call CheckQueryRowCount("DOCS", "fISN", loanScheduled.fBase, 1)
		Call CheckDB_DOCS(loanScheduled.fBase, "C1Univer", "7", fBODY, 1)
End	Sub

Sub Check_DB_Delete()
		'SQL Ստուգում DOCLOG աղուսյակում համար
		Log.Message "SQL Ստուգում DOCLOG աղուսյակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", loanScheduled.fBase, 13)
		Call CheckDB_DOCLOG(loanScheduled.fBase, "91", "E", "7", "", 5)
		Call CheckDB_DOCLOG(loanScheduled.fBase, "91", "D", "999", "", 1)
				
		'SQL Ստուգում DOCS աղուսյակում համար
		Log.Message "SQL Ստուգում DOCS աղուսյակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & loanScheduled.DocNum & " CRDTCODE:" & dbo_CONTRACTS.fDGCRDTCODE & " CLICOD:00000004 NAME:§Ø³ëÇë ´³ÝÏ¦ CURRENCY:000 ACCACC:000007800 SUMMA:10000 DATE:20211115 DATEGIVE:20211115 DATEAGR:20221115 EXISTSPROLPERSCH:0 ISLINE:0 ALLOCATEWITHLIM:0 ISREGENERATIVE:0 ISCRCARD:0 AUTOCAP:0 ISLIMPERPR:0 ISPERPR:0 ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C10 AUTODEBT:1 DEBTJPART1:1 DEBTJPART:0 USECLICONNSCH:0 USECODEBTORSACCS:0 ONLYOVERDUE:0 DATESFILLTYPE:1 AGRMARBEG:20211115 AGRMARFIN:20221115 ISNOTUSETHISM:0 FIXEDDAYS:15 PASSOVDIRECTION:2 PASSOVTYPE:0 SUMSDATESFILLTYPE:1 SUMSFILLTYPE:01 FILLROUND:2 MIXEDSUMSINSCH:0 FIXEDROWSINSCH:1 APARTPERDATES:0 KINDSCALE:1 PCAGR:18.0000/365 PCNOCHOOSE:8.0000/365 PCGRANT:0/1 CONSTPER:0 ISCONSCURPRD:0 FILLROUNDPR:2 DONOTCALCPCBASE:0 PAYPERGIVE:0 PAYPERGIVEPER:0 PCNDER:19.5616 PCNDERALL:19.7951 PCNDERAUTO:1 KINDPENCALC:1 PCPENAGR:0/1 PCPENPER:0/1 PCLOSS:0/1 CALCFINPER:1 CALCJOUTS:0 SECTOR:E USAGEFIELD:03.001 AIM:00 SCHEDULE:9 GUARANTEE:1 COUNTRY:AM LRDISTR:001 REGION:010000008 PERRES:1 REDUCEOVRDDAYS:0 WEIGHTAMDRISK:0 PPRCODE:12 TIMEOP:15:00:00 CHRGFIRSTDAY:1 GIVEN:0 SUBJRISK:0 UPDINS:0 DOOVRDINWORKDAYS:0 ISNBOUT:0 PUTINLR:0 NOTCLASS:0 OTHERCOLLATERAL:0 OVRDDAYSCALCACRA:0 OVRDAGRSUMACRA:0 OVRDPERSUMACRA:0 RISKACRA:0 "  
		fBODY = Replace(fBODY, " ", "%")
		Call CheckQueryRowCount("DOCS", "fISN", loanScheduled.fBase, 1)
		Call CheckDB_DOCS(loanScheduled.fBase, "C1Univer", "999", fBODY, 1)
		
		'SQL Ստուգում FOLDERS աղուսյակում 
		Log.Message "SQL Ստուգում FOLDERS աղուսյակում", "", pmNormal, SqlDivideColor
		dbo_FOLDERS(0).fKEY = loanScheduled.fBase
		dbo_FOLDERS(0).fISN = loanScheduled.fBase
		dbo_FOLDERS(0).fNAME = "C1Univer"
		dbo_FOLDERS(0).fSTATUS = "0"
		dbo_FOLDERS(0).fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")' & Leasing.ISN
		dbo_FOLDERS(0).fSPEC = Left_Align(Get_Compname_DOCLOG(loanScheduled.fBase), 16) & "Cred1   CREDITOPERATOR                007  "
		dbo_FOLDERS(0).fCOM = ""
		dbo_FOLDERS(0).fDCBRANCH	= "00 "
		dbo_FOLDERS(0).fECOM = ""
		dbo_FOLDERS(0).fDCDEPART = "1  "
		Call CheckQueryRowCount("FOLDERS", "fISN", loanScheduled.fBase, 1)
		Call CheckDB_FOLDERS(dbo_FOLDERS(0), 1)
End	Sub