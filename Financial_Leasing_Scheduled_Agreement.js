'USEUNIT Library_Common  
'USEUNIT Library_Colour
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Library_Contracts 
'USEUNIT Financial_Leasing_Library 
'USEUNIT Akreditiv_Library
'USEUNIT Loan_Agreements_Library 
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Group_Operations_Library
'USEUNIT Constants
'USEUNIT Deposit_Contract_Library
'USEUNIT Library_CheckDB
'USEUNIT Mortgage_Library
Option Explicit

'Test Case N 151450

Dim fDATE, sDATE, folderName, fBase, summ, agreementAllOperations, documentType
Dim scheduledLeasing 
Dim dbo_CONTRACTS, dbo_FOLDERS(4), fBODY

Sub Financial_Leasing_Scheduled_Agreement_Test()
    Call Test_Initialize()

		'Ð³ÙÏ³ñ· Ùáõïù ·áñÍ»É ARMSOFT û·ï³·áñÍáÕáí
		Log.Message "Համակարգ մուտք գործել ARMSOFT օգտագործողով", "", pmNormal, DivideColor
    Call Test_StartUp()
  
    '¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ
		Log.Message "Գրաֆիկով լիզինգի պայմանագրի ստեղծում", "", pmNormal, DivideColor
    Call scheduledLeasing.CreateLeasing(folderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
		
		'ä³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պայմանագրի ստեղծումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call DB_Initialize()
    Call Check_DB_AfterCreatingLeasingDoc()
    
		'Ø³ñÙ³Ý ·ñ³ýÇÏÇ Ýß³Ý³ÏáõÙ 
		Log.Message "Մարման գրաֆիկի նշանակում", "", pmNormal, DivideColor
		Call wMainForm.MainMenu.Click(c_AllActions)
		Call wMainForm.PopupMenu.Click(c_RepaySchedule)    
  
		BuiltIn.Delay(3000)
		Call Close_Pttel("frmPttel")
		
		'Ø³ñÙ³Ý ·ñ³ýÇÏÇ Ýß³Ý³ÏáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Մարման գրաֆիկի նշանակումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_RepaymentSchedule()
  
		'ä³ÛÙ³Ý³·ÇñÁ áõÕ³ñÏ»É Ñ³ëï³ïÙ³Ý
		Log.Message "Պայմանագիրը ուղարկել հաստատման", "", pmNormal, DivideColor
		scheduledLeasing.SendToVerify(FolderName & "²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
		
		'ä³ÛÙ³Ý³·ÇñÁ Ñ³ëï³ïÙ³Ý áõÕ³ñÏ»Éáõó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պայմանագիրը հաստատման ուղարկելուց հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_SendToVerify()
		
		'ì³í»ñ³óÝ»É å³ÛÙ³Ý³·ñÇÁ
		Log.Message "Վավերացնել պայմանագիրը", "", pmNormal, DivideColor
		scheduledLeasing.Verify(FolderName & "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
		
		'ä³ÛÙ³Ý³·ñÇ í³í»ñ³óáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պայմանագրի վավերացումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_VerifyContract()
		
		'ä³ÛÙ³Ý³·ñ»ñ ÃÕÃ³å³Ý³ÏáõÙ ÷³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ  
		Log.Message "Պայմանագրեր թղթապանակում փաստատթղթի առկայության ստուգում", "", pmNormal, DivideColor
		Call LetterOfCredit_Filter_Fill(FolderName, "1", scheduledLeasing.DocNum)

		'¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó  
		Log.Message "Գանձում տրամադրումից", "", pmNormal, DivideColor
		Call Collect_From_Provision("03/02/21", "", 2, scheduledLeasing.CalcAcc, fBase)
		
		'¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Գանձում տրամադրումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_CollectFromProvision()
		
		'ÈÇ½ÇÝ·Ç ïñ³Ù³¹ñáõÙ  
		Log.Message "Լիզինգի տրամադրում", "", pmNormal, DivideColor
		Call Give_Leasing("03/02/21")
		
		'ÈÇ½ÇÝ·Ç ïñ³Ù³¹ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Լիզիգին տրամադրումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_GiveLeasing()

		'îáÏáëÝ»ñÇ Ñ³ßí³ñÏ  
		Log.Message "Տոկոսների հաշվարկ", "", pmNormal, DivideColor
		fBase = Calculate_Percents("13/03/21", "13/03/21", false)
		
		'îáÏáëÝ»ñÇ Ñ³ßí³ñÏÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Տոկոսների հաշվարկից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_CalculatePercents()

		'¶ñ³ýÇÏÇ í»ñ³Ý³ÛáõÙ
		Log.Message "Գրաֆիկի վերանայում", "", pmNormal, DivideColor
		Call Fading_Schedule_Fill("14/03/21", "01/01/22", scheduledLeasing.Summa)
		
		'¶ñ³ýÇÏÇ í»ñ³Ý³ÛáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Գրաֆիկի վերանայումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_FadingSchedule()
  
		'ä³ñïù»ñÇ Ù³ñáõÙ    
		Log.Message "Պարտքերի մարում", "", pmNormal, DivideColor
		Call Fade_Debt("14/03/21", fBase, "", "10000", null, false)
		
		'ä³ñïù»ñÇ Ù³ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պարտքերի մարումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_FadeDebt()
  
		'îáÏáë³¹ñáõÛùÝ»ñ    
		Log.Message "Տոկոսադրույքներ", "", pmNormal, DivideColor
		fBase = ChangeRete("14/03/21", "15", "10")
		
		'îáÏáë³¹ñáõÛùÝ»ñÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Տոկոսադրույքներից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_ChangeRate()
  
		'²ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛù  
		Log.Message "Արդյունավետ տոկոսադրույք", "", pmNormal, DivideColor
		fBase = ChangeEffRete("14/03/21", "", "")
		
		'²ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛùÝ»ñÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Արդյունավետ տոկոսադրույքներից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_ChangeEffRate()
  
		'êáõµëÇ¹³íáñÙ³Ý ïáÏáë³¹ñáõÛù  
		Log.Message "Սուբսիդավորման տոկոսադրույք", "", pmNormal, DivideColor
		fBase = SubsidyRate_DocFill("14/03/21", "^A[Del]" & 5)
		
		'êáõµëÇ¹³íáñÙ³Ý ïáÏáë³¹ñáõÛùÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Սուբսիդավորման տոկոսադրույքից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_SubsidyRate()
		
		'æÝç»É ëáõµëÇ¹³íáñÙ³Ý ïáÏáë³¹ñáõÛùÁ
		Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Percentages & "|" & c_SubsidyRate)
		
		'êáõµëÇ¹³íáñÙ³Ý ïáÏáë³¹ñáõÛùÁ çÝç»Éáõó Ñ»ïá SQL ëïáõ·áõÙ 
		Log.Message "Սուբսիդավորման տոկոսադրույքը ջնջելուց հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_SubsidyRateDelete()
  
		'îáÏáëÝ»ñÇ Ñ³ßí³ñÏ  
		Log.Message "Տոկոսների հաշվարկ", "", pmNormal, DivideColor
		fBase = Calculate_Percents("14/03/21", "14/03/21", false)
		
		'îáÏáëÝ»ñÇ Ñ³ßí³ñÏÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Տոկոսների հաշվարկից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_CalculatePercents2()
  
		'úµÛ»ÏïÇí éÇëÏÇ ¹³ëÇã    
		Log.Message "Օբյեկտիվ ռիսկի դասիչ", "", pmNormal, DivideColor
		fBase = ObjectiveRisk("14/03/21", "04")
		
		'úµÛ»ÏïÇí éÇëÏÇ ¹³ëÇãÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Օբյեկտիվ ռիսկի դասիչից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_ObjectiveRisk()
           
		'èÇëÏÇ ¹³ëÇã ¨ å³Ñáõëï³íáñÙ³Ý ïáÏáë  
		Log.Message "Ռիսկի դասիչ և պահուստավորման տոկոս", "", pmNormal, DivideColor
		fBase = FillDoc_Risk_Classifier("14/03/21", "05", 100)
		
		'èÇëÏÇ ¹³ëÇã ¨ å³Ñáõëï³íáñÙ³Ý ïáÏáëÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Ռիսկի դասիչ և պահուստավորման տոկոսից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_RiskClassifier()
  
		'ä³Ñáõëï³íáñáõÙ  
		Log.Message "Պահուստավորում", "", pmNormal, DivideColor
		Call FillDoc_Store("14/03/21", fBase)
		
		'ä³Ñáõëï³íáñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պահուստավորումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_Store()
  
		'¸áõñë ·ñáõÙ  
		Log.Message "Դուրս գրում", "", pmNormal, DivideColor
		Call FillDoc_WriteOut("14/03/21", fBase)
		
		'¸áõñë ·ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Դուրս գրումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_WriteOut()
  
		'¸áõñë ·ñ³ÍÇ í»ñ³Ï³Ý·ÝáõÙ  
		Log.Message "Դուրս գրածի վերականգնում", "", pmNormal, DivideColor
		fBase = WriteOffReconstruction("15/03/21", "", "")
		
		'¸áõñë ·ñ³ÍÇ í»ñ³Ï³Ý·ÝáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Դուրս գրածի վերականգնումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_WriteOffReconstruction()
  
		'äñ³ïù»ñÇ Ù³ñáõÙ
		Log.Message "Պարտքերի մարում", "", pmNormal, DivideColor
		Call Fade_Debt("15/03/21", fBase, "01/01/23", 40000, 690.40, false)
		
		'ä³ñïù»ñÇ Ù³ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պարտքերի մարումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_FadeDebt2()
  
		'ä³ÛÙ³Ý³·ñÇ ÷³ÏáõÙ
		Log.Message "Պայմանագրի փակում", "", pmNormal, DivideColor
		scheduledLeasing.CloseDate = "15/03/21"
		scheduledLeasing.CloseAgr()
  
		'ä³ÛÙ³Ý³·ñÇ µ³óáõÙ
		Log.Message "Պայմանագրի բացում", "", pmNormal, DivideColor
		scheduledLeasing.OpenAgr()
		
		BuiltIn.Delay(3000)
		Call Close_Pttel("frmPttel")
				
    'æÝç»É µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñÁ
    Log.Message "Բոլոր փաստաթղթերի ջնջում", "", pmNormal, DivideColor
		agreementAllOperations.agreementN = scheduledLeasing.DocNum
    Call Delete_AgreementAllOperations(FolderName, agreementAllOperations, "frmPttel", 4, documentType)
		
		'´áÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñÁ çÝç»Éáõó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Բոլոր գործողությունները ջնջելուց հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_Delete_AgreeAllOperations()
		
  Call Close_AsBank()    
End Sub

Sub Test_StartUp()
		Call Initialize_AsBank("bank", sDATE, fDATE)
    Login("ARMSOFT")
		Call ChangeWorkspace(c_Subsystems)
End	Sub

Sub Test_Initialize()
		folderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|"
	
		sDATE = "20030101"
		fDATE = "20260101"  

		Set scheduledLeasing = New_LeasingDoc()
		with scheduledLeasing
				.DocType = "¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ"
				.CalcAcc = "00000113032"
				.PermAsAcc = ""
				.Summa = "50000"
				.BuyPrice = "10000"
				.Term = "01/01/22"
				.Date = "03/02/21"
				.GiveDate = "03/02/21"
				.office = "01"
				.department = "3"
				.accessType = "C40"
				.AutoDebt = "1"
				.PayMode = "2"
				.Percent = "12"
				.Baj = "365"
				.EffPercent = "10"
				.ActualPercent = "14"
				.DatesFillType = "2"
				.periodStart = "3"
				.periodEnd = "15"
'				.PayDates = "3"
				.sumPayStart = "1"
				.payCount = "9"
				.pause = "7"
				.Direction = "1"
				.SumsDatesFillType = "4"
				.SumsFillType = "04"
				.Sector = "41.2"
				.UsageField = "04.001"
				.Aim = "03"
				.Schedule = "COVID-19/3"
				.Guarantee = "1"
				.Country = "AM"
				.District = "001"
				.RegionLR = "010000008"
				.PaperCode = "00018627"
				.StartDate = ""
				.DateFill = ""
				.FirstDate = ""
				.LastDate = ""
				.Paragraph = ""
				.UseOtherAcc = ""
				.CheckPayDates = ""
				.SalePrice = ""
				.CreditCode = ""
				.Client = ""
				.Curr = ""
				.RepayCurr = ""
				.WeightAMDRisk = ""
				.Note = ""
				.DocLevel = ""
				.SubsidyRate = ""
		  .CloseDate = ""
		End With

		Set agreementAllOperations = New_AgreementAllOperations()
    agreementAllOperations.startDate = "01/01/20"
    agreementAllOperations.endDate = "01/01/23"
  
		Redim documentType(14)
    documentType(14) = "¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ"
    documentType(13) = "¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó"
    documentType(12) = "ÈÇ½ÇÝ·Ç ïñ³Ù³¹ñáõÙ"
    documentType(11) = "îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ"
    documentType(10) = "Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ"
    documentType(9) = "ÈÇ½ÇÝ·Ç å³ñïù»ñÇ Ù³ñáõÙ"
    documentType(8) = "îáÏáë³¹ñáõÛùÝ»ñ"
    documentType(7) = "²ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛù"
    documentType(6) = "îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ"
    documentType(5) = "úµÛ»ÏïÇí éÇëÏÇ ¹³ëÇã"
    documentType(4) = "èÇëÏÇ ¹³ëÇã ¨ å³Ñáõëï³íáñÙ³Ý ïáÏáë"
    documentType(3) = "ä³Ñáõëï³íáñáõÙ"
    documentType(2) = "¸áõñë ·ñáõÙ"
    documentType(1) = "¸áõñë ·ñí³ÍÇ í»ñ³Ï³Ý·ÝáõÙ"
    documentType(0) = "ÈÇ½ÇÝ·Ç å³ñïù»ñÇ Ù³ñáõÙ"
End Sub

Sub DB_Initialize()
		Dim i
		Set dbo_CONTRACTS = New_DB_CONTRACTS()
        dbo_CONTRACTS.fDGISN = scheduledLeasing.ISN
        dbo_CONTRACTS.fDGPARENTISN = scheduledLeasing.ISN
        dbo_CONTRACTS.fDGISN1 = scheduledLeasing.ISN
        dbo_CONTRACTS.fDGISN3 = scheduledLeasing.ISN
        dbo_CONTRACTS.fDGAGRKIND = "8"
        dbo_CONTRACTS.fDGSTATE = "206"
        dbo_CONTRACTS.fDGTYPENAME = "C4Univer"
        dbo_CONTRACTS.fDGCODE = scheduledLeasing.DocNum
        dbo_CONTRACTS.fDGPPRCODE = "00018627"
        dbo_CONTRACTS.fDGCAPTION = "ý²àôêî"
        dbo_CONTRACTS.fDGCLICODE = "00034852"
        dbo_CONTRACTS.fDGCUR = "000"
        dbo_CONTRACTS.fDGSUMMA = "50000.00"
        dbo_CONTRACTS.fDGALLSUMMA = "0.00"
        dbo_CONTRACTS.fDGRISKDEGREE = "0.00"
        dbo_CONTRACTS.fDGRISKDEGNB = "0.00"
        dbo_CONTRACTS.fDGSCHEDULE = "COVID-19/3          "
        dbo_CONTRACTS.fDGDISTRICT = "001"
        dbo_CONTRACTS.fDGACSBRANCH = "01"
        dbo_CONTRACTS.fDGACSDEPART = "3"
        dbo_CONTRACTS.fDGACSTYPE = "C40"
        dbo_CONTRACTS.fDGAIM = "03"
        dbo_CONTRACTS.fDGUSAGEFIELD = "04.001"
        dbo_CONTRACTS.fDGCOUNTRY = "AM "
        dbo_CONTRACTS.fDGREGION = "010000008"
        dbo_CONTRACTS.fDGCRDTCODE = scheduledLeasing.CreditCode
		
  	For i = 0 to 3
        Set dbo_FOLDERS(i) = New_DB_FOLDERS()
        dbo_FOLDERS(i).fKEY = scheduledLeasing.ISN
        dbo_FOLDERS(i).fISN = scheduledLeasing.ISN
        dbo_FOLDERS(i).fNAME = "C4Univer"
        dbo_FOLDERS(i).fSTATUS = "1"
    Next
      dbo_FOLDERS(0).fFOLDERID = "Agr." & scheduledLeasing.ISN
      dbo_FOLDERS(0).fCOM = "¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ"
      dbo_FOLDERS(0).fSPEC = "1¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ- " & scheduledLeasing.DocNum & " {ý²àôêî}"
      dbo_FOLDERS(1).fFOLDERID = "C.903824400"
      dbo_FOLDERS(1).fCOM = " ¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ"
      dbo_FOLDERS(1).fSPEC = scheduledLeasing.DocNum & " (ý²àôêî),     50000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
      dbo_FOLDERS(2).fFOLDERID = "SSWork.CRC420210203"
      dbo_FOLDERS(2).fCOM = "¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ"
      dbo_FOLDERS(2).fSPEC = scheduledLeasing.DocNum & "          C40 20210203            0.0077  00034852Üáñ å³ÛÙ³Ý³·Çñ      "
    	dbo_FOLDERS(2).fECOM = "Agreement of leasing  with schedule"
  		dbo_FOLDERS(2).fDCBRANCH = "01 "
  		dbo_FOLDERS(2).fDCDEPART = "3  "
End	Sub

Sub Check_DB_AfterCreatingLeasingDoc()
    Dim i
    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", scheduledLeasing.ISN, 1)
    Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 2)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "N", "1", "", 1)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "C", "206", "", 1)
  
    'SQL Ստուգում DOCP աղյուսակում  
    Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCP", "fPARENTISN", scheduledLeasing.ISN, 1)
    Call CheckDB_DOCP("443871031", "Acc", scheduledLeasing.ISN, 1)
  
    'SQL Ստուգում DOCS աղյուսակում 
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " CLICOD:00034852 NAME:ý²àôêî CURRENCY:000 ACCACC:00000113032 BUYPRICE:10000 SUMMA:50000 DATE:20210203 DATEGIVE:20210203 DATEAGR:20220101 ACSBRANCH:01 ACSDEPART:3 ACSTYPE:C40 AUTODEBT:1 DEBTJPART1:2 DEBTJPART:0 USECLICONNSCH:0 USECODEBTORSACCS:0 ONLYOVERDUE:0 DATESFILLTYPE:2 AGRMARBEG:20210203 AGRMARFIN:20220101 AGRPERIOD:3/15 PASSOVDIRECTION:1 PASSOVTYPE:0 SUMSDATESFILLTYPE:4 MARBEG:1 AGRMARCNT:9 AGRMARPER:7 SUMSFILLTYPE:04 FILLROUND:2 MIXEDSUMSINSCH:0 FIXEDROWSINSCH:1 KINDSCALE:2 PCAGR:12.0000/365 PCGRANT:0/1 CONSTPER:0 ISCONSCURPRD:0 FILLROUNDPR:2 PCNDER:10 PCNDERALL:14 PCNDERAUTO:0 KINDPENCALC:1 PCPENAGR:0/1 PCPENPER:0/1 PCLOSS:0/1 CALCFINPER:0 CALCJOUTS:0 SECTOR:41.2 USAGEFIELD:04.001 AIM:03 SCHEDULE:COVID-19/3 GUARANTEE:1 COUNTRY:AM LRDISTR:001 REGION:010000008 REDUCEOVRDDAYS:0 WEIGHTAMDRISK:0 PPRCODE:00018627 CHRGFIRSTDAY:1 GIVEN:0 SUBJRISK:0 UPDINS:0 DOOVRDINWORKDAYS:0 ISNBOUT:0 PUTINLR:1 NOTCLASS:0 OTHERCOLLATERAL:0 OVRDDAYSCALCACRA:0 LASTOVRDDATEACRA:0 OVRDAGRSUMACRA:0 OVRDPERSUMACRA:0 RISKACRA:0 "
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", scheduledLeasing.ISN, 1)
    Call CheckDB_DOCS(scheduledLeasing.ISN, "C4Univer", "206", fBODY, 1)
  
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("FOLDERS", "fISN", scheduledLeasing.ISN, 3)
    For i = 0 To 2
        Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
    Next
  
    'SQL Ստուգում RESNUMBERS աղյուսակում 
    Log.Message "SQL Ստուգում RESNUMBERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("RESNUMBERS", "fISN", scheduledLeasing.ISN, 1)
    Call CheckDB_RESNUMBERS(scheduledLeasing.ISN, "C", scheduledLeasing.DocNum, 1)		
End	Sub

Sub Check_DB_RepaymentSchedule()
		Dim i
		'SQL Ստուգում AGRSCHEDULE աղյուսակում 
		Log.Message "SQL Ստուգում AGRSCHEDULE աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("AGRSCHEDULE", "fAGRISN", scheduledLeasing.ISN, 1)
		Call Check_AGRSCHEDULE(scheduledLeasing.ISN, "2021-02-03", "2021-02-03", 1, 0, 9)
		
		'SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում 
		Log.Message "SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("AGRSCHEDULEVALUES", "fAGRISN", scheduledLeasing.ISN, 8)
		Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 1, "2021-05-18", "11797.20", 1, 0)
		Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 1, "2021-05-18", "1726.00", 2, 0)
		Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 1, "2021-09-02", "12162.90", 1, 0)
		Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 1, "2021-09-02", "1306.20", 2, 0)
		Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 1, "2021-12-17", "12599.30", 1, 0)
		Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 1, "2021-12-17", "898.90", 2, 0)
		Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 1, "2022-01-01", "13440.60", 1, 0)
		Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 1, "2022-01-01", "61.90", 2, 0)
		
    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    dbo_CONTRACTS.fDGSTATE = 1
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", scheduledLeasing.ISN, 1)
    Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 3)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "E", "1", "", 1)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCS", "fISN", scheduledLeasing.ISN, 1)
    Call CheckDB_DOCS(scheduledLeasing.ISN, "C4Univer", "1", fBODY, 1)
    Call CheckQueryRowCount("DOCS", "fISN", "443871031", 1)
    Call CheckDB_DOCS("443871031", "Acc", "2", "%BALACC:3032000%CLICOD:00034852%ENAME:FAUST%DK:2%CODVAL:000%ACCTYPE:01%DATOTK:20131004%CODE:00000113032%GENCODE:0%BLREP:0%ACSBRANCH:00%ACSDEPART:1%ACSTYPE:01%ULIMIT:999999999999.99%CASHAC:0%BALACC2:999999%BALACC3:999999%FROZEN:0%", 1)
  
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		
    dbo_FOLDERS(1).fCOM = " ¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ (Ý³Ë³·ÇÍ)"
    Call CheckQueryRowCount("FOLDERS", "fISN", scheduledLeasing.ISN, 3)
    Call CheckQueryRowCount("FOLDERS", "fISN", "443871031", 1)
    For i = 0 to 2
        Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
    Next
End	Sub

Sub Check_DB_SendToVerify()
    Dim i		
    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    dbo_CONTRACTS.fDGSTATE = 101
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", scheduledLeasing.ISN, 1)
    Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 5)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "C", "101", "", 1)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCS", "fISN", scheduledLeasing.ISN, 1)
    Call CheckDB_DOCS(scheduledLeasing.ISN, "C4Univer", "101", fBODY, 1)
  
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		
    dbo_FOLDERS(3).fKEY = scheduledLeasing.ISN
    dbo_FOLDERS(3).fISN = scheduledLeasing.ISN
    dbo_FOLDERS(3).fNAME = "C4Univer"
    dbo_FOLDERS(3).fSTATUS = "4"
    dbo_FOLDERS(3).fFOLDERID = "SSConf.CRC4001" 
    dbo_FOLDERS(3).fCOM = "¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ"
    dbo_FOLDERS(3).fSPEC = scheduledLeasing.DocNum & "          C40 20210203            0.0077  00034852"
    dbo_FOLDERS(3).fECOM = "Agreement of leasing  with schedule"
    dbo_FOLDERS(3).fDCBRANCH = "01 "
    dbo_FOLDERS(3).fDCDEPART = "3  "
    Call CheckQueryRowCount("FOLDERS", "fISN", scheduledLeasing.ISN, 4)
    Call CheckDB_FOLDERS(dbo_FOLDERS(3), 1)
End	Sub

Sub Check_DB_VerifyContract()
    Dim i  
    'SQL Ստուգում ACCOUNTS աղյուսակում 
    Log.Message "SQL Ստուգում ACCOUNTS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("ACCOUNTS", "fISN", "443871031", 1)
		
    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    dbo_CONTRACTS.fDGSTATE = 7
    dbo_CONTRACTS.fDGCRDTCODE = scheduledLeasing.CreditCode
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", scheduledLeasing.ISN, 1)
    Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
    'SQL Ստուգում CAGRACCS աղյուսակում 
    Log.Message "SQL Ստուգում CAGRACCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CAGRACCS", "fAGRISN", scheduledLeasing.ISN, 1)
  
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 7)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "W", "102", "", 1)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "T", "7", "", 1)
  
    'SQL Ստուգում DOCP աղյուսակում  
    Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCP", "fPARENTISN", scheduledLeasing.ISN, 1)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCS", "fISN", scheduledLeasing.ISN, 1)
    Call CheckDB_DOCS(scheduledLeasing.ISN, "C4Univer", "7", fBODY, 1)
  
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    dbo_FOLDERS(1).fECOM = "1"
    dbo_FOLDERS(1).fSTATUS = "1"
    dbo_FOLDERS(1).fCOM = " ¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ"
    dbo_FOLDERS(2).fSTATUS = "1"
    dbo_FOLDERS(2).fFOLDERID = "LOANREGISTER" 
    dbo_FOLDERS(2).fCOM = "ý²àôêî"
    dbo_FOLDERS(2).fSPEC = "C48" & scheduledLeasing.DocNum & "          00018627                          0                                                                                                                                                             0.00                                                                                                                                                                                                                                                                                               "
    dbo_FOLDERS(2).fECOM = ""
    dbo_FOLDERS(2).fDCBRANCH = ""
    dbo_FOLDERS(2).fDCDEPART = ""
    Call CheckQueryRowCount("FOLDERS", "fISN", scheduledLeasing.ISN, 4)
    For i = 1 To 2
        Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
    Next
  
    'SQL Ստուգում HIF  աղյուսակում 
    Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIF", "fOBJECT", scheduledLeasing.ISN, 16)
		
    'SQL Ստուգում HIREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIREST", "fOBJECT", "443871031", 10)
End	Sub

Sub Check_DB_CollectFromProvision()
    Dim i, obj
    'SQL Ստուգում ACCOUNTS աղյուսակում 
    Log.Message "SQL Ստուգում ACCOUNTS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("ACCOUNTS", "fISN", "443871031", 1)
  
    'SQL Ստուգում CAGRACCS աղյուսակում 
    Log.Message "SQL Ստուգում CAGRACCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CAGRACCS", "fAGRISN", scheduledLeasing.ISN, 1)
  
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 7)
  
    'SQL Ստուգում DOCP աղյուսակում  
    Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCP", "fPARENTISN", scheduledLeasing.ISN, 1)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCS", "fISN", scheduledLeasing.ISN, 1)
    Call CheckDB_DOCS(scheduledLeasing.ISN, "C4Univer", "7", fBODY, 1)
  
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("FOLDERS", "fISN", scheduledLeasing.ISN, 4)
    For i = 1 To 2
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
    Next
  
    'SQL Ստուգում HI աղյուսակում համար
    Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HI", "fBASE", fBase, 2)
    obj = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & fBase & " and fDBCR = 'C'")
    Call Check_HI_CE_accounting ("2021-02-03", fBase, "01", "443871031", "5000.00", "000", "5000.00", "FEE", "D")
    Call Check_HI_CE_accounting ("2021-02-03", fBase, "01", obj, "5000.00", "000", "5000.00", "FEE", "C")
		
    'SQL Ստուգում HIR աղյուսակում 
    Log.Message "SQL Ստուգում HIR աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIR", "fOBJECT", scheduledLeasing.ISN, 1)
    Call Check_HIR("2021-02-03", "R^", scheduledLeasing.ISN, "000", "5000.00", "PAY", "D")
    '		Call CheckQueryRowCount("HIR", "fOBJECT", "319280882", 1)
    '  Call Check_HIR("2021-02-03", "R^", "319280882", "000", "5000.00", "PAY", "D")
    '		Call CheckQueryRowCount("HIR", "fOBJECT", "1834319472", 7)
    '  Call Check_HIR("2021-02-03", "R1", "1834319472", "000", "50000.00", "AGR", "D")
    '		Call Check_HIR("2021-02-03", "R8", "1834319472", "000", "3993.00", "AGR", "D")
    '		Call Check_HIR("2021-02-03", "RI", "1834319472", "000", "40000.00", "AIE", "D")
    '		Call Check_HIR("2021-02-03", "R^", "1834319472", "000", "5000.00", "PAY", "D")
    '		Call Check_HIR("2021-02-03", "RÒ", "1834319472", "000", "10000.00", "AGR", "D")
		
    'SQL Ստուգում HIREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIREST", "fOBJECT", "443871031", 10)
		
    'SQL Ստուգում HIRREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIRREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIRREST", "fOBJECT", scheduledLeasing.ISN, 1)
    Call CheckDB_HIRREST("R^", scheduledLeasing.ISN, "5000.00", "2021-02-03", 1)	
    '		Call CheckQueryRowCount("HIRREST", "fOBJECT", "1834319472", 10)
    '  Call CheckDB_HIRREST("R1", "1834319472", "50000.00", "2021-02-03", 1)	
    '		Call CheckDB_HIRREST("R2", "1834319472", "674.00", "2021-03-13", 1)	
    '		Call CheckDB_HIRREST("R4", "1834319472", "0.00", "1980-01-01", 1)	
    '		Call CheckDB_HIRREST("R5", "1834319472", "0.00", "1980-01-01", 1)	
    '		Call CheckDB_HIRREST("R6", "1834319472", "0.00", "1980-01-01", 1)	
    '		Call CheckDB_HIRREST("R8", "1834319472", "4099.50", "2021-03-14", 1)	
    '		Call CheckDB_HIRREST("RB", "1834319472", "0.00", "1980-01-01", 1)	
    '		Call CheckDB_HIRREST("RI", "1834319472", "40000.00", "2021-02-03", 1)	
    '		Call CheckDB_HIRREST("R^", "1834319472", "5000.00", "2021-02-03", 1)	
    '		Call CheckDB_HIRREST("RÒ", "1834319472", "10000.00", "2021-02-03", 1)	
    '		Call CheckQueryRowCount("HIRREST", "fOBJECT", "319280882", 1)
    '  Call CheckDB_HIRREST("R^", "319280882", "5000.00", "2021-02-03", 1)	
End	Sub

Sub Check_DB_GiveLeasing()
    Dim i, obj
    'SQL Ստուգում ACCOUNTS աղյուսակում 
    Log.Message "SQL Ստուգում ACCOUNTS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("ACCOUNTS", "fISN", "443871031", 1)
  
    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", scheduledLeasing.ISN, 1)
    Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 8)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "E", "7", "", 1)

    'SQL Ստուգում DOCP աղյուսակում  
    Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCP", "fPARENTISN", scheduledLeasing.ISN, 2)
    obj = Get_ColumnValueSQL("DOCP", "fISN", "fPARENTISN = " & scheduledLeasing.ISN & " and fISN != 443871031")
    Call CheckDB_DOCP(obj, "Acc     ", scheduledLeasing.ISN, 1)
    Call CheckDB_DOCP("443871031", "Acc     ", scheduledLeasing.ISN, 1)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " CRDTCODE:"&scheduledLeasing.CreditCode&" CLICOD:00034852 NAME:ý²àôêî CURRENCY:000 ACCACC:00000113032 LEASSUMMA:53993 BUYPRICE:10000 SUMMA:50000 DATE:20210203 DATEGIVE:20210203 DATEAGR:20220101 ACSBRANCH:01 ACSDEPART:3 ACSTYPE:C40 AUTODEBT:1 DEBTJPART1:2 DEBTJPART:0 USECLICONNSCH:0 USECODEBTORSACCS:0 ONLYOVERDUE:0 DATESFILLTYPE:2 AGRMARBEG:20210203 AGRMARFIN:20220101 AGRPERIOD:3/15 PASSOVDIRECTION:1 PASSOVTYPE:0 SUMSDATESFILLTYPE:4 MARBEG:1 AGRMARCNT:9 AGRMARPER:7 SUMSFILLTYPE:04 FILLROUND:2 MIXEDSUMSINSCH:0 FIXEDROWSINSCH:1 KINDSCALE:2 PCAGR:12.0000/365 PCGRANT:0/1 CONSTPER:0 ISCONSCURPRD:0 FILLROUNDPR:2 PCNDER:10 PCNDERALL:14 PCNDERAUTO:0 KINDPENCALC:1 PCPENAGR:0/1 PCPENPER:0/1 PCLOSS:0/1 CALCFINPER:0 CALCJOUTS:0 SECTOR:41.2 USAGEFIELD:04.001 AIM:03 SCHEDULE:COVID-19/3 GUARANTEE:1 COUNTRY:AM LRDISTR:001 REGION:010000008 PERRES:1 REDUCEOVRDDAYS:0 WEIGHTAMDRISK:0 PPRCODE:00018627 CHRGFIRSTDAY:1 GIVEN:1 SUBJRISK:0 UPDINS:0 DOOVRDINWORKDAYS:0 ISNBOUT:0 PUTINLR:1 NOTCLASS:0 OTHERCOLLATERAL:0 OVRDDAYSCALCACRA:0 LASTOVRDDATEACRA:0 OVRDAGRSUMACRA:0 OVRDPERSUMACRA:0 RISKACRA:0 LASTCLASSDATEACRA:0 "  
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", scheduledLeasing.ISN, 1)
    Call CheckDB_DOCS(scheduledLeasing.ISN, "C4Univer", "7", fBODY, 1)
  
    'SQL Ստուգում HI աղյուսակում համար
    Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HI", "fBASE", fBase, 2)

    'SQL Ստուգում HIR աղյուսակում 
    Log.Message "SQL Ստուգում HIR աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIR", "fOBJECT", scheduledLeasing.ISN, 5)
    Call Check_HIR("2021-02-03", "R1", scheduledLeasing.ISN, "000", "50000.00", "AGR", "D")
    Call Check_HIR("2021-02-03", "R8", scheduledLeasing.ISN, "000", "3993.00", "AGR", "D")
    Call Check_HIR("2021-02-03", "RI", scheduledLeasing.ISN, "000", "40000.00", "AIE", "D")
    Call Check_HIR("2021-02-03", "RÒ", scheduledLeasing.ISN, "000", "10000.00", "AGR", "D")
    '		Call CheckQueryRowCount("HIR", "fOBJECT", "319280882", 1)
    '		Call CheckQueryRowCount("HIR", "fOBJECT", "1834319472", 7)
		
    'SQL Ստուգում HIREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIREST", "fOBJECT", "443871031", 10)
    Call CheckQueryRowCount("HIREST", "fOBJECT", obj, 8)
		
    'SQL Ստուգում HIRREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIRREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIRREST", "fOBJECT", scheduledLeasing.ISN, 5)
    Call CheckDB_HIRREST("R1", scheduledLeasing.ISN, "50000.00", "2021-02-03", 1)	
    Call CheckDB_HIRREST("R8", scheduledLeasing.ISN, "3993.00", "2021-02-03", 1)
    Call CheckDB_HIRREST("RI", scheduledLeasing.ISN, "40000.00", "2021-02-03", 1)
    Call CheckDB_HIRREST("RÒ", scheduledLeasing.ISN, "10000.00", "2021-02-03", 1)
    '		Call CheckQueryRowCount("HIRREST", "fOBJECT", "1834319472", 10)
    '		Call CheckQueryRowCount("HIRREST", "fOBJECT", "319280882", 1)
End	Sub

Sub Check_DB_CalculatePercents()
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 8)
		
    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCS", "fISN", scheduledLeasing.ISN, 1)
    Call CheckDB_DOCS(scheduledLeasing.ISN, "C4Univer", "7", fBODY, 1)
  
    'SQL Ստուգում HI աղյուսակում համար
    Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HI", "fBASE", fBase, 2)
		
    'SQL Ստուգում HIF  աղյուսակում 
    Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIF", "fOBJECT", scheduledLeasing.ISN, 17)

    'SQL Ստուգում HIR աղյուսակում 
    Log.Message "SQL Ստուգում HIR աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIR", "fOBJECT", scheduledLeasing.ISN, 6)
    Call Check_HIR("2021-03-13", "R2", scheduledLeasing.ISN, "000", "674.00", "PER", "D")
		
    'SQL Ստուգում HIREST  աղյուսակում 
    '  Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
		
    'SQL Ստուգում HIRREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIRREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIRREST", "fOBJECT", scheduledLeasing.ISN, 6)
    Call CheckDB_HIRREST("R2", scheduledLeasing.ISN, "674.00", "2021-03-13", 1)	
		
    'SQL Ստուգում HIT  աղյուսակում 
    Log.Message "SQL Ստուգում HIT աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIT", "fOBJECT", scheduledLeasing.ISN, 1)
End	Sub

Sub Check_DB_FadingSchedule()
    Dim i
    'SQL Ստուգում AGRSCHEDULE աղյուսակում 
    Log.Message "SQL Ստուգում AGRSCHEDULE աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("AGRSCHEDULE", "fAGRISN", scheduledLeasing.ISN, 2)
    Call Check_AGRSCHEDULE(scheduledLeasing.ISN, "2021-03-14", "2021-02-03", 2, 0, 9)
		
    'SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում 
    Log.Message "SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("AGRSCHEDULEVALUES", "fAGRISN", scheduledLeasing.ISN, 14)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 2, "2021-06-29", "15600.30", 1, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 2, "2021-06-29", "2432.90", 2, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 2, "2021-10-14", "16823.10", 1, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 2, "2021-10-14", "1210.10", 2, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 2, "2022-01-01", "17576.60", 1, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 2, "2022-01-01", "456.50", 2, 0)

    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", scheduledLeasing.ISN, 1)
    Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
		
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 10)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "E", "7", "", 3)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCS", "fISN", scheduledLeasing.ISN, 1)
    Call CheckDB_DOCS(scheduledLeasing.ISN, "C4Univer", "7", fBODY, 1)
		
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("FOLDERS", "fISN", scheduledLeasing.ISN, 4)
    for i = 1 to 2
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
    next
  
    'SQL Ստուգում HI աղյուսակում համար
    Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HI", "fBASE", fBase, 2)
		
    'SQL Ստուգում HIF  աղյուսակում 
    Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIF", "fOBJECT", scheduledLeasing.ISN, 18)

    'SQL Ստուգում HIR աղյուսակում 
    Log.Message "SQL Ստուգում HIR աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIR", "fOBJECT", scheduledLeasing.ISN, 7)
    Call Check_HIR("2021-03-14", "R8", scheduledLeasing.ISN, "000", "106.50", "RPR", "D")
		
    'SQL Ստուգում HIREST  աղյուսակում 
    '  Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
		
    'SQL Ստուգում HIRREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIRREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIRREST", "fOBJECT", scheduledLeasing.ISN, 6)
    Call CheckDB_HIRREST("R8", scheduledLeasing.ISN, "4099.50", "2021-03-14", 1)	
End	Sub

Sub Check_DB_FadeDebt()
    Dim i, obj
    'SQL Ստուգում AGRSCHEDULE աղյուսակում 
    Log.Message "SQL Ստուգում AGRSCHEDULE աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("AGRSCHEDULE", "fAGRISN", scheduledLeasing.ISN, 3)
    Call Check_AGRSCHEDULE(scheduledLeasing.ISN, "2021-03-14", "2021-02-03", 3, 0, 2)
		
    'SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում 
    Log.Message "SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("AGRSCHEDULEVALUES", "fAGRISN", scheduledLeasing.ISN, 20)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 3, "2021-06-29", "5600.30", 1, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 3, "2021-06-29", "2054.80", 2, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 3, "2021-10-14", "16823.10", 1, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 3, "2021-10-14", "1187.50", 2, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 3, "2022-01-01", "17576.60", 1, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 3, "2022-01-01", "445.00", 2, 0)
		
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 10)
    Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)
    Call CheckDB_DOCLOG(fBase, "77", "N", "1", "", 1)
    Call CheckDB_DOCLOG(fBase, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
    Call CheckDB_DOCLOG(fBase, "77", "T", "2", "", 1)
    Call CheckDB_DOCLOG(fBase, "77", "C", "5", "", 1)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " DATE:20210314 CORROFFPER:0 FILLSUMS:0 AMDSUMDBT:10000 SUMAGR:10000 SUMMA:10000 ISPUSA:0 APPLYCONNSCH:0 ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C40 USERID:  77 SYSTEMTYPE:1 REPSOURCE:1 " 
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
    Call CheckDB_DOCS(fBase, "C4DSDebt", "5", fBODY, 1)
		
    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", scheduledLeasing.ISN, 1)
    Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
		
    '		'SQL Ստուգում FOLDERS աղյուսակում 
    '  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    '  Call CheckQueryRowCount("FOLDERS", "fISN", scheduledLeasing.ISN, 3)
    '  for i = 1 to 2
    '    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
    '  next
  
    'SQL Ստուգում HI աղյուսակում համար
    Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HI", "fBASE", fBase, 2)

    'SQL Ստուգում HIR աղյուսակում 
    Log.Message "SQL Ստուգում HIR աղյուսակում", "", pmNormal, SqlDivideColor
    obj = Get_ColumnValueSQL("HIR", "fOBJECT", "fBASE = " & fBase & " and fDBCR = 'C'")
    Call CheckQueryRowCount("HIR", "fBASE", fBase, 1)
    Call Check_HIR("2021-03-14", "R1", obj, "000", "10000.00", "DBT", "C")
		
    'SQL Ստուգում HIREST  աղյուսակում 
    '  Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
		
    'SQL Ստուգում HIRREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIRREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIRREST", "fOBJECT", scheduledLeasing.ISN, 6)
    Call CheckDB_HIRREST("R8", scheduledLeasing.ISN, "3687.30", "2021-03-14", 1)	
End	Sub

Sub Check_DB_ChangeRate()
    'SQL Ստուգում AGRSCHEDULE աղյուսակում 
    Log.Message "SQL Ստուգում AGRSCHEDULE աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("AGRSCHEDULE", "fAGRISN", scheduledLeasing.ISN, 4)
    Call Check_AGRSCHEDULE(scheduledLeasing.ISN, "2021-03-14", "2021-02-03", 4, 0, 1)
		
    'SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում 
    Log.Message "SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("AGRSCHEDULEVALUES", "fAGRISN", scheduledLeasing.ISN, 26)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 4, "2021-06-29", "5600.30", 1, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 4, "2021-06-29", "2400.00", 2, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 4, "2021-10-14", "16823.10", 1, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 4, "2021-10-14", "1484.40", 2, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 4, "2022-01-01", "17576.60", 1, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 4, "2022-01-01", "556.20", 2, 0)
		
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 11)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "E", "7", "", 4)
    Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " DATE:20210314 PCAGR:15.0000/365 PCPENAGR:0.0000/1 PCPENPER:0/1 PCLOSS:0/1 COMMENT:îáÏáë³¹ñáõÛùÝ»ñ USERID:  77 "  
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
    Call CheckDB_DOCS(fBase, "C4TSPC  ", "5", fBODY, 1)
		
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("FOLDERS", "fISN", fBase, 1)
    dbo_FOLDERS(3).fKEY = fBase
    dbo_FOLDERS(3).fISN = fBase
    dbo_FOLDERS(3).fNAME = "C4TSPC  "
    dbo_FOLDERS(3).fSTATUS = "1"
    dbo_FOLDERS(3).fFOLDERID = "Agr." & scheduledLeasing.ISN
    dbo_FOLDERS(3).fCOM = "îáÏáë³¹ñáõÛùÝ»ñ"
    dbo_FOLDERS(3).fSPEC = "1îáÏáë³¹ñáõÛùÝ»ñ`  14/03/21,  { 15.0000/365,  0.0000/1,  0/1,  0/1 }"
    dbo_FOLDERS(3).fECOM = ""
    dbo_FOLDERS(3).fDCBRANCH = ""
    dbo_FOLDERS(3).fDCDEPART = ""
    Call CheckDB_FOLDERS(dbo_FOLDERS(3), 1)
  
    '		'SQL Ստուգում HI աղյուսակում համար
    '  Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
    '  Call CheckQueryRowCount("HI", "fBASE", fBase, 2)

    'SQL Ստուգում HIF  աղյուսակում 
    Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIF", "fOBJECT", scheduledLeasing.ISN, 22)
		
    'SQL Ստուգում HIR աղյուսակում 
    Log.Message "SQL Ստուգում HIR աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIR", "fOBJECT", scheduledLeasing.ISN, 10)
    Call Check_HIR("2021-03-14", "R8", scheduledLeasing.ISN, "000", "-412.20", "RPR", "D")
    Call Check_HIR("2021-03-14", "R8", scheduledLeasing.ISN, "000", "753.30", "RPR", "D")
		
    'SQL Ստուգում HIREST  աղյուսակում 
    '  Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
		
    'SQL Ստուգում HIRREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIRREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIRREST", "fOBJECT", scheduledLeasing.ISN, 6)
    Call CheckDB_HIRREST("R8", scheduledLeasing.ISN, "4440.60", "2021-03-14", 1)	
End	Sub

Sub Check_DB_ChangeEffRate()
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 11)
    Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " DATE:20210314 COMMENT:365²ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛù USERID:  77 "  
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
    Call CheckDB_DOCS(fBase, "C4TSNDER", "5", fBODY, 1)
		
    'SQL Ստուգում HIF  աղյուսակում 
    Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIF", "fOBJECT", scheduledLeasing.ISN, 24)
End	Sub

Sub Check_DB_SubsidyRate()
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 11)
    Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " DATE:20210314 PCGRANT:5.0000/365 COMMENT:êáõµëÇ¹³íáñÙ³Ý ïáÏáë³¹ñáõÛù USERID:  77 "  
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
    Call CheckDB_DOCS(fBase, "C4TSGrt ", "5", fBODY, 1)
		
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("FOLDERS", "fISN", fBase, 1)
    dbo_FOLDERS(3).fKEY = fBase
    dbo_FOLDERS(3).fISN = fBase
    dbo_FOLDERS(3).fNAME = "C4TSGrt "
    dbo_FOLDERS(3).fSTATUS = "1"
    dbo_FOLDERS(3).fFOLDERID = "Agr." & scheduledLeasing.ISN
    dbo_FOLDERS(3).fCOM = "êáõµëÇ¹³íáñÙ³Ý ïáÏáë³¹ñáõÛù"
    dbo_FOLDERS(3).fSPEC = "1êáõµëÇ¹³íáñÙ³Ý ïáÏáë³¹ñáõÛù`  14/03/21,  { 5.0000/365 }"
    dbo_FOLDERS(3).fECOM = ""
    dbo_FOLDERS(3).fDCBRANCH = ""
    dbo_FOLDERS(3).fDCDEPART = ""
    Call CheckDB_FOLDERS(dbo_FOLDERS(3), 1)
		
    'SQL Ստուգում HIF  աղյուսակում 
    Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIF", "fOBJECT", scheduledLeasing.ISN, 25)
End	Sub

Sub Check_DB_SubsidyRateDelete()
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 11)
    Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 5)
    Call CheckDB_DOCLOG(fBase, "77", "D", "999", "", 1)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " DATE:20210314 PCGRANT:5.0000/365 COMMENT:êáõµëÇ¹³íáñÙ³Ý ïáÏáë³¹ñáõÛù USERID:  77 "  
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
    Call CheckDB_DOCS(fBase, "C4TSGrt ", "999", fBODY, 1)
		
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("FOLDERS", "fISN", fBase, 1)
    dbo_FOLDERS(3).fKEY = fBase
    dbo_FOLDERS(3).fISN = fBase
    dbo_FOLDERS(3).fNAME = "C4TSGrt "
    dbo_FOLDERS(3).fSTATUS = "0"
    dbo_FOLDERS(3).fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")
    dbo_FOLDERS(3).fCOM = ""
    dbo_FOLDERS(3).fSPEC = Left_Align(Get_Compname_DOCLOG(scheduledLeasing.ISN), 16) &  "Cred&DepARMSOFT                       005  "
    dbo_FOLDERS(3).fECOM = ""
    dbo_FOLDERS(3).fDCBRANCH = ""
    dbo_FOLDERS(3).fDCDEPART = ""
    Call CheckDB_FOLDERS(dbo_FOLDERS(3), 1)
		
    'SQL Ստուգում HIF  աղյուսակում 
    Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIF", "fOBJECT", scheduledLeasing.ISN, 24)
End	Sub

Sub Check_DB_CalculatePercents2()
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 11)
    Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)
		
    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " DATECHARGE:20210314 DATE:20210314 SUMPER:16.4/0 SUMALLPER:16.4/0 COMMENT:îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C40 USERID:  77 "  
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
    Call CheckDB_DOCS(fBase, "C4DSChrg", "5", fBODY, 1)
  
    'SQL Ստուգում HI աղյուսակում համար
    Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HI", "fBASE", fBase, 2)
		
    'SQL Ստուգում HIF  աղյուսակում 
    Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIF", "fOBJECT", scheduledLeasing.ISN, 25)

    'SQL Ստուգում HIR աղյուսակում 
    Log.Message "SQL Ստուգում HIR աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIR", "fOBJECT", scheduledLeasing.ISN, 11)
    Call Check_HIR("2021-03-14", "R2", scheduledLeasing.ISN, "000", "16.40", "PER", "D")
		
    'SQL Ստուգում HIREST  աղյուսակում 
    '  Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
		
    'SQL Ստուգում HIRREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIRREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIRREST", "fOBJECT", scheduledLeasing.ISN, 6)
    Call CheckDB_HIRREST("R1", scheduledLeasing.ISN, "40000.00", "2021-03-14", 1)	
    Call CheckDB_HIRREST("R8", scheduledLeasing.ISN, "4440.60", "2021-03-14", 1)	
    Call CheckDB_HIRREST("R2", scheduledLeasing.ISN, "690.40", "2021-03-14", 1)	
		
    'SQL Ստուգում HIT  աղյուսակում 
    Log.Message "SQL Ստուգում HIT աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIT", "fOBJECT", scheduledLeasing.ISN, 2)
End	Sub

Sub Check_DB_ObjectiveRisk()
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 11)
    Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " DATE:20210314 RISK:04 COMMENT:úµÛ»ÏïÇí éÇëÏÇ ¹³ëÇã USERID:  77 "  
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
    Call CheckDB_DOCS(fBase, "C4TSORC ", "5", fBODY, 1)
		
    'SQL Ստուգում HIF  աղյուսակում 
    Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIF", "fOBJECT", scheduledLeasing.ISN, 26)
End	Sub

Sub Check_DB_RiskClassifier()
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 11)
    Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " DATE:20210314 RISK:05 PERRES:100 COMMENT:èÇëÏÇ ¹³ëÇã ¨ å³Ñáõëï³íáñÙ³Ý ïáÏáë USERID:  77 "
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
    Call CheckDB_DOCS(fBase, "C4TSRsPr", "5", fBODY, 1)
		
    'SQL Ստուգում HIF  աղյուսակում 
    Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIF", "fOBJECT", scheduledLeasing.ISN, 28)
End	Sub

Sub Check_DB_Store()
    Dim i, obj1, obj2
    '		'SQL Ստուգում ACCOUNTS աղյուսակում 
    '  Log.Message "SQL Ստուգում ACCOUNTS աղյուսակում", "", pmNormal, SqlDivideColor
    '  Call CheckQueryRowCount("ACCOUNTS", "fISN", "443871031", 1)
  
    'SQL Ստուգում CAGRACCS աղյուսակում 
    Log.Message "SQL Ստուգում CAGRACCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CAGRACCS", "fAGRISN", scheduledLeasing.ISN, 1)
  
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 11)
    Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)
  
    'SQL Ստուգում DOCP աղյուսակում  
    Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCP", "fPARENTISN", scheduledLeasing.ISN, 2)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " DATE:20210314 SUMRES:40690.4 COMMENT:ä³Ñáõëï³íáñáõÙ ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C40 USERID:  77 "
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
    Call CheckDB_DOCS(fBase, "C4DSRes ", "5", fBODY, 1)
  
    '  'SQL Ստուգում FOLDERS աղյուսակում 
    '  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    '  Call CheckQueryRowCount("FOLDERS", "fISN", scheduledLeasing.ISN, 3)
    '  for i = 1 to 2
    '    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
    '  next
  
    'SQL Ստուգում HI աղյուսակում համար
    Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HI", "fBASE", fBase, 2)
    obj1 = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & fBase & " and fDBCR = 'D'")
    obj2 = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & fBase & " and fDBCR = 'C'")
    Call Check_HI_CE_accounting ("2021-03-14", fBase, "01", obj1, "40690.40", "000", "40690.40", "RST", "D")
    Call Check_HI_CE_accounting ("2021-03-14", fBase, "01", obj2, "40690.40", "000", "40690.40", "RST", "C")
		
    'SQL Ստուգում HIR աղյուսակում 
    Log.Message "SQL Ստուգում HIR աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIR", "fOBJECT", scheduledLeasing.ISN, 12)
    Call Check_HIR("2021-03-14", "R4", scheduledLeasing.ISN, "000", "40690.40", "RES", "D")
		
    'SQL Ստուգում HIREST  աղյուսակում 
    '  Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
    '		Call CheckQueryRowCount("HIREST", "fOBJECT", "443871031", 10)
		
    'SQL Ստուգում HIRREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIRREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIRREST", "fOBJECT", scheduledLeasing.ISN, 7)
    Call CheckDB_HIRREST("R4", scheduledLeasing.ISN, "40690.40", "2021-03-14", 1)	
End	Sub

Sub Check_DB_WriteOut()
    'SQL Ստուգում CAGRACCS աղյուսակում 
    Log.Message "SQL Ստուգում CAGRACCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CAGRACCS", "fAGRISN", scheduledLeasing.ISN, 1)
  
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 11)
    Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)
  
    'SQL Ստուգում DOCP աղյուսակում  
    Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCP", "fPARENTISN", scheduledLeasing.ISN, 2)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " DATE:20210314 SUMMA:40690.4 SUMAGR:40000 SUMPER:690.4 DISSUM:4440.6 COMMENT:¸áõñë ·ñáõÙ ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C40 USERID:  77 "
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
    Call CheckDB_DOCS(fBase, "C4DSOut ", "5", fBODY, 1)
  
    '  'SQL Ստուգում FOLDERS աղյուսակում 
    '  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    '  Call CheckQueryRowCount("FOLDERS", "fISN", scheduledLeasing.ISN, 3)
    '  for i = 1 to 2
    '    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
    '  next
  
    'SQL Ստուգում HI աղյուսակում համար
    Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HI", "fBASE", fBase, 8)
		
    'SQL Ստուգում HIR աղյուսակում 
    Log.Message "SQL Ստուգում HIR աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIR", "fOBJECT", scheduledLeasing.ISN, 16)
    Call Check_HIR("2021-03-14", "R4", scheduledLeasing.ISN, "000", "40690.40", "OUT", "C")
    Call Check_HIR("2021-03-14", "R5", scheduledLeasing.ISN, "000", "40000.00", "OUT", "D")
    Call Check_HIR("2021-03-14", "R6", scheduledLeasing.ISN, "000", "690.40", "OUT", "D")
    Call Check_HIR("2021-03-14", "RB", scheduledLeasing.ISN, "000", "4440.60", "OUT", "D")
		
    'SQL Ստուգում HIREST  աղյուսակում 
    '  Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
    '		Call CheckQueryRowCount("HIREST", "fOBJECT", "443871031", 10)
		
    'SQL Ստուգում HIRREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIRREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIRREST", "fOBJECT", scheduledLeasing.ISN, 10)
    Call CheckDB_HIRREST("R6", scheduledLeasing.ISN, "690.40", "2021-03-14", 1)
    Call CheckDB_HIRREST("RB", scheduledLeasing.ISN, "4440.60", "2021-03-14", 1)
    Call CheckDB_HIRREST("R4", scheduledLeasing.ISN, "0.00", "2021-03-14", 1)
End	Sub

Sub Check_DB_WriteOffReconstruction()
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 11)
    Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " DATE:20210315 SUMMA:40690.4 SUMAGR:40000 SUMPER:690.4 DISSUM:4440.6 COMMENT:¸áõñë ·ñí³ÍÇ í»ñ³Ï³Ý·ÝáõÙ ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C40 USERID:  77 "
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
    Call CheckDB_DOCS(fBase, "C4DSInc ", "5", fBODY, 1)
  
    'SQL Ստուգում HI աղյուսակում համար
    Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HI", "fBASE", fBase, 8)
		
    'SQL Ստուգում HIR աղյուսակում 
    Log.Message "SQL Ստուգում HIR աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIR", "fOBJECT", scheduledLeasing.ISN, 20)
    Call Check_HIR("2021-03-15", "R4", scheduledLeasing.ISN, "000", "40690.40", "INC", "D")
    Call Check_HIR("2021-03-15", "R5", scheduledLeasing.ISN, "000", "40000.00", "INC", "C")
    Call Check_HIR("2021-03-15", "R6", scheduledLeasing.ISN, "000", "690.40", "INC", "C")
    Call Check_HIR("2021-03-15", "RB", scheduledLeasing.ISN, "000", "4440.60", "INC", "C")
		
    'SQL Ստուգում HIREST  աղյուսակում 
    '  Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
    '		Call CheckQueryRowCount("HIREST", "fOBJECT", "443871031", 10)
		
    'SQL Ստուգում HIRREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIRREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIRREST", "fOBJECT", scheduledLeasing.ISN, 10)
    Call CheckDB_HIRREST("R6", scheduledLeasing.ISN, "0.00", "2021-03-15", 1)
    Call CheckDB_HIRREST("RB", scheduledLeasing.ISN, "0.00", "2021-03-15", 1)
    Call CheckDB_HIRREST("R5", scheduledLeasing.ISN, "0.00", "2021-03-15", 1)
    Call CheckDB_HIRREST("R4", scheduledLeasing.ISN, "40690.40", "2021-03-15", 1)
End	Sub

Sub Check_DB_FadeDebt2()
    'SQL Ստուգում AGRSCHEDULE աղյուսակում 
    Log.Message "SQL Ստուգում AGRSCHEDULE աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("AGRSCHEDULE", "fAGRISN", scheduledLeasing.ISN, 5)
    Call Check_AGRSCHEDULE(scheduledLeasing.ISN, "2021-03-15", "2021-02-03", 5, 0, 2)
		
    'SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում 
    Log.Message "SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("AGRSCHEDULEVALUES", "fAGRISN", scheduledLeasing.ISN, 28)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 5, "2022-01-01", "0.00", 1, 0)
    Call Check_AGRSCHEDULEVALUES(scheduledLeasing.ISN, 5, "2022-01-01", "0.00", 2, 0)
		
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 11)
    Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " DATE:20210315 DATEFOROFF:20230101 CORROFFPER:0 FILLSUMS:0 AMDSUMDBT:40690.4 SUMAGR:40000 SUMPER:690.4 SUMPAY:690.4 SUMMA:40690.4 ISPUSA:0 APPLYCONNSCH:0 COMMENT:ÈÇ½ÇÝ·Ç å³ñïù»ñÇ Ù³ñáõÙ ACSBRANCH:00 ACSDEPART:1 ACSTYPE:C40 USERID:  77 SYSTEMTYPE:1 REPSOURCE:1 "
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
    Call CheckDB_DOCS(fBase, "C4DSDebt", "5", fBODY, 1)
  
    '		'SQL Ստուգում FOLDERS աղյուսակում 
    '  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    '  Call CheckQueryRowCount("FOLDERS", "fISN", fBase, 1)
    '  dbo_FOLDERS(3).fKEY = fBase
    '  dbo_FOLDERS(3).fISN = fBase
    '  dbo_FOLDERS(3).fNAME = "C4TSPC  "
    '  dbo_FOLDERS(3).fSTATUS = "1"
    '		dbo_FOLDERS(3).fFOLDERID = "Agr." & scheduledLeasing.ISN
    '		dbo_FOLDERS(3).fCOM = "îáÏáë³¹ñáõÛùÝ»ñ"
    '		dbo_FOLDERS(3).fSPEC = "1îáÏáë³¹ñáõÛùÝ»ñ`  14/03/21,  { 15.0000/365,  0.0000/1,  0/1,  0/1 }"
    '		dbo_FOLDERS(3).fECOM = ""
    '		dbo_FOLDERS(3).fDCBRANCH = ""
    '		dbo_FOLDERS(3).fDCDEPART = ""
    '  Call CheckDB_FOLDERS(dbo_FOLDERS(3), 1)
		
    'SQL Ստուգում HI աղյուսակում համար
    Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HI", "fBASE", fBase, 5)
		
    'SQL Ստուգում HIR աղյուսակում 
    Log.Message "SQL Ստուգում HIR աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIR", "fOBJECT", scheduledLeasing.ISN, 25)
    Call Check_HIR("2021-03-15", "R1", scheduledLeasing.ISN, "000", "40000.00", "DBT", "C")
    Call Check_HIR("2021-03-15", "R2", scheduledLeasing.ISN, "000", "690.40", "DBT", "C")
    Call Check_HIR("2021-03-15", "R8", scheduledLeasing.ISN, "000", "690.40", "DBT", "C")
    Call Check_HIR("2021-03-15", "R8", scheduledLeasing.ISN, "000", "3750.20", "DB1", "C")
    Call Check_HIR("2021-03-15", "RÒ", scheduledLeasing.ISN, "000", "10000.00", "DBT", "C")
		
    'SQL Ստուգում HIREST  աղյուսակում 
    '  Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
    '		Call CheckQueryRowCount("HIREST", "fOBJECT", "443871031", 10)
		
    'SQL Ստուգում HIRREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIRREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIRREST", "fOBJECT", scheduledLeasing.ISN, 10)
    Call CheckDB_HIRREST("R1", scheduledLeasing.ISN, "0.00", "2021-03-15", 1)
    Call CheckDB_HIRREST("R2", scheduledLeasing.ISN, "0.00", "2021-03-15", 1)
    Call CheckDB_HIRREST("R8", scheduledLeasing.ISN, "0.00", "2021-03-15", 1)
End	Sub

Sub Check_DB_Delete_AgreeAllOperations()
    'SQL Ստուգում AGRSCHEDULE աղյուսակում 
    Log.Message "SQL Ստուգում AGRSCHEDULE աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("AGRSCHEDULE", "fAGRISN", scheduledLeasing.ISN, 0)
		
    'SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում 
    Log.Message "SQL Ստուգում AGRSCHEDULEVALUES աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("AGRSCHEDULEVALUES", "fAGRISN", scheduledLeasing.ISN, 0)
		
    'SQL Ստուգում ACCOUNTS աղյուսակում 
    Log.Message "SQL Ստուգում ACCOUNTS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("ACCOUNTS", "fISN", scheduledLeasing.ISN, 0)
		
    'SQL Ստուգում CONTRACTS աղյուսակում 
    Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CONTRACTS", "fDGISN", scheduledLeasing.ISN, 0)
		
    'SQL Ստուգում CAGRACCS աղյուսակում 
    Log.Message "SQL Ստուգում CAGRACCS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("CAGRACCS", "fAGRISN", scheduledLeasing.ISN, 0)
		
    'SQL Ստուգում DOCLOG աղյուսակում համար
    Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCLOG", "fISN", scheduledLeasing.ISN, 17)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "M", "7", "§Ø³ñÙ³Ý ³ÕµÛáõñ¦ ¹³ßïÇ ËÙµ³·ñáõÙ", 1)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "M", "77", "ä³ÛÙ³Ý³·ñÇ ÷³ÏáõÙ", 1)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "C", "7", "", 1)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "M", "7", "ä³ÛÙ³Ý³·ñÇ µ³óáõÙ", 1)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "E", "7", "", 5)
    Call CheckDB_DOCLOG(scheduledLeasing.ISN, "77", "D", "999", "", 1)
		
    'SQL Ստուգում DOCP աղյուսակում  
    Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("DOCP", "fPARENTISN", scheduledLeasing.ISN, 0)

    'SQL Ստուգում DOCS աղյուսակում համար
    Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
    fBODY = " CODE:" & scheduledLeasing.DocNum & " CRDTCODE:"&scheduledLeasing.CreditCode&" CLICOD:00034852 NAME:ý²àôêî CURRENCY:000 ACCACC:00000113032 LEASSUMMA:53993 BUYPRICE:10000 SUMMA:50000 DATE:20210203 DATEGIVE:20210203 DATEAGR:20220101 ACSBRANCH:01 ACSDEPART:3 ACSTYPE:C40 AUTODEBT:1 DEBTJPART1:2 DEBTJPART:0 USECLICONNSCH:0 USECODEBTORSACCS:0 ONLYOVERDUE:0 DATESFILLTYPE:2 AGRMARBEG:20210203 AGRMARFIN:20220101 AGRPERIOD:3/15 PASSOVDIRECTION:1 PASSOVTYPE:0 SUMSDATESFILLTYPE:4 MARBEG:1 AGRMARCNT:9 AGRMARPER:7 SUMSFILLTYPE:04 FILLROUND:2 MIXEDSUMSINSCH:0 FIXEDROWSINSCH:1 KINDSCALE:2 PCAGR:12.0000/365 PCGRANT:0/1 CONSTPER:0 ISCONSCURPRD:0 FILLROUNDPR:2 PCNDER:10 PCNDERALL:14 PCNDERAUTO:0 KINDPENCALC:1 PCPENAGR:0/1 PCPENPER:0/1 PCLOSS:0/1 CALCFINPER:0 CALCJOUTS:0 SECTOR:41.2 USAGEFIELD:04.001 AIM:03 SCHEDULE:COVID-19/3 GUARANTEE:1 COUNTRY:AM LRDISTR:001 REGION:010000008 PERRES:1 REDUCEOVRDDAYS:0 WEIGHTAMDRISK:0 PPRCODE:00018627 CHRGFIRSTDAY:1 GIVEN:0 SUBJRISK:0 UPDINS:0 DOOVRDINWORKDAYS:0 ISNBOUT:0 PUTINLR:1 NOTCLASS:0 REPSOURCE:1 OTHERCOLLATERAL:0 OVRDDAYSCALCACRA:0 LASTOVRDDATEACRA:0 OVRDAGRSUMACRA:0 OVRDPERSUMACRA:0 RISKACRA:0 LASTCLASSDATEACRA:0 " 
  
    fBODY = Replace(fBODY, " ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", scheduledLeasing.ISN, 1)
    Call CheckDB_DOCS(scheduledLeasing.ISN, "C4Univer", "999", fBODY, 1)
		
    'SQL Ստուգում FOLDERS աղյուսակում 
    Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("FOLDERS", "fISN", scheduledLeasing.ISN, 1)
    dbo_FOLDERS(3).fKEY = scheduledLeasing.ISN
    dbo_FOLDERS(3).fISN = scheduledLeasing.ISN
    dbo_FOLDERS(3).fNAME = "C4Univer"
    dbo_FOLDERS(3).fSTATUS = "0"
    dbo_FOLDERS(3).fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")
    dbo_FOLDERS(3).fCOM = ""
    dbo_FOLDERS(3).fSPEC = Left_Align(Get_Compname_DOCLOG(scheduledLeasing.ISN), 16) &  "Cred&DepARMSOFT                       007  "
    dbo_FOLDERS(3).fECOM = ""
    dbo_FOLDERS(3).fDCBRANCH = "01 "
    dbo_FOLDERS(3).fDCDEPART = "3  "
    Call CheckDB_FOLDERS(dbo_FOLDERS(3), 1)
		
    'SQL Ստուգում HI աղյուսակում համար
    Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HI", "fBASE", scheduledLeasing.ISN, 0)
		
    'SQL Ստուգում HIF  աղյուսակում 
    Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIF", "fOBJECT", scheduledLeasing.ISN, 0)
		
    'SQL Ստուգում HIR աղյուսակում 
    Log.Message "SQL Ստուգում HIR աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIR", "fOBJECT", scheduledLeasing.ISN, 0)
		
    'SQL Ստուգում HIREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIREST", "fOBJECT", scheduledLeasing.ISN, 0)
		
    'SQL Ստուգում HIRREST  աղյուսակում 
    Log.Message "SQL Ստուգում HIRREST աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIRREST", "fOBJECT", scheduledLeasing.ISN, 0)
		
    'SQL Ստուգում HIT  աղյուսակում 
    Log.Message "SQL Ստուգում HIT աղյուսակում", "", pmNormal, SqlDivideColor
    Call CheckQueryRowCount("HIT", "fOBJECT", scheduledLeasing.ISN, 0)
End	Sub