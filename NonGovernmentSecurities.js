'USEUNIT Library_Common  
'USEUNIT Library_Colour
'USEUNIT Library_Contracts 
'USEUNIT Constants
'USEUNIT Library_CheckDB
'USEUNIT Securities_Library
'USEUNIT Akreditiv_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Clients_Library
'USEUNIT CashInput_Confirmphases_Library
'USEUNIT BankMail_Library
'USEUNIT Subsystems_Special_Library
Option Explicit

'Test Case N 157582

Dim fDATE, sDATE, folderName, fBase, agreementAllOperations, documentType() 
Dim nonGovSecurity, Working_Docs, Verification_Doc, goToAgreement, custAccApp_new
Dim cashInputfISN, cashInputDocN, custAccApp2
Dim folder, fName, state, obj
Dim dbo_CONTRACTS, dbo_FOLDERS(4), fBODY, dbo_HI2_1, dbo_HI2_2

'àã å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñ|îáÏáë³ÛÇÝ »Ï. ãµ»ñáÕ ³ñÅ»ÃáõÕÃ
Sub NonGovernment_Securities_Test()
  Call Test_Initialize()

		' Ð³Ù³Ï³ñ· Ùáõïù ·áñÍ»É ARMSOFT û·ï³·áñÍáÕáí
		Log.Message "Համակարգ մուտք գործել ARMSOFT օգտագործողով", "", pmNormal, DivideColor
  Call Test_StartUp()
		
		' êï»ÕÍ»É àã å»ï³Ï³Ý ³ñÅÃÕÃ»ñ/îáÏáë³ÛÇÝ »Ï. ãµ»ñáÕ ³ñÅ»ÃáõÕÃ
		Log.Message "Ստեղծել Ոչ պետական արժեթղթեր/Տոկոսային եկ. չբերող արժեթուղթ", "", pmNormal, DivideColor
		Call nonGovSecurity.CreateNonGovSecurity(folderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ") 
		
		BuiltIn.Delay(3000)
  wMDIClient.VBObject("frmPttel").Close 
		
		' àã å»ï³Ï³Ý ³ñÅÃÕÃ»ñ/îáÏáë³ÛÇÝ »Ï. ãµ»ñáÕ ³ñÅ»ÃÕÃÇ ëï»ÕÍáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Ոչ պետական արժեթղթեր/Տոկոսային եկ. չբերող արժեթղթի ստեղծումից հետո SQL ստուգում", "", pmNormal, DivideColor
		Call DB_Inirtialize()
		Call Check_DB_CreateNonGovSec()
		
		' ä³ÛÙ³Ý³·ÇñÁ áõÕ³ñÏ»É Ñ³ëï³ïÙ³Ý
		Log.Message "Պայմանագիրը ուղարկել հաստատման", "", pmNormal, DivideColor
		Working_Docs.agreeN = nonGovSecurity.DocNum
		Call GoTo_SubsystemWorkingDocuments(folderName, Working_Docs)
		BuiltIn.Delay(2000)
		Call SendToVerify_Contrct(2, 5, "²Ûá")
		
		' ä³ÛÙ³Ý³·ÇñÁ Ñ³ëï³ïÙ³Ý áõÕ³ñÏ»Éáõó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պայմանագիրը հաստատման ուղարկելուց հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_SendToVerify()
		
		' ì³í»ñ³óÝ»É å³ÛÙ³Ý³·ñÇÁ
		Log.Message "Վավերացնել պայմանագիրը", "", pmNormal, DivideColor
		Verification_Doc.AgreementN = nonGovSecurity.DocNum
		Call Verify_Contract(folderName & "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I" , Verification_Doc)
		
		' ä³ÛÙ³Ý³·ñÇ í³í»ñ³óáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պայմանագրի վավերացումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_VerifyContract()
		
		' ä³ÛÙ³Ý³·ñ»ñ ÃÕÃ³å³Ý³ÏáõÙ ÷³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ  
		Log.Message "Պայմանագրեր թղթապանակում փաստատթղթի առկայության ստուգում", "", pmNormal, DivideColor
		goToAgreement.AgreementN = nonGovSecurity.DocNum
		Call Check_AgreementExisting(folderName, goToAgreement)

		' àã å»ï³Ï³Ý ³ñÅ»ÃÕÃÇ ³éù		
		Log.Message "Ոչ պետական արժեթղթի առք", "", pmNormal, DivideColor
  fBase = SecBuy_NonGov("01/04/21", 1, "00000777", 10000)
		
		' àã å»ï³Ï³Ý ³ñÅ»ÃÕÃÇ ³éùÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Ոչ պետական արժեթղթի առքից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_SecBuy()
		
		' Ð³×³Ëáñ¹Ç ³ñÅ»ÃÕÃÇ Ùáõïù
		Log.Message "Հաճախորդի արժթղթի մուտք", "", pmNormal, DivideColor
		fBase = ClientSec_Input("02/04/21", "00000777", 12222)
		
		' Ð³×³Ëáñ¹Ç ³ñÅ»ÃÕÃÇ ÙáõïùÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Հաճախորդի արժթղթի մուտքից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_CliSecInp()
		
		' Ð³×³Ëáñ¹Ý»ñÇ áã å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñÇ ³éáõÍ³Ë		
		Log.Message "Հաճախորդների ոչ պետական արժեթղթերի առուծախ", "", pmNormal, DivideColor
		BuiltIn.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_CliSecTrade)
		fBase = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  Call Rekvizit_Fill("Document", 1, "General", "DATE", "03/04/21") 
  Call ClickCmdButton(1, "Î³ï³ñ»É")
  BuiltIn.Delay(2000)
  wMDIClient.VBObject("frmPttel_2").Close
		
		' Ð³×³Ëáñ¹Ý»ñÇ áã å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñÇ ³éáõÍ³ËÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Հաճախորդների ոչ պետական արժեթղթերի առուծախից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_CliSecGivBack()
		
	' ²ñÅ»ÃÕÃÇ ·ñ³í³¹ñáõÙ
	 Log.Message "Արժեթղթի գրավադրում", "", pmNormal, DivideColor
		Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Pledging & "|" & c_SecPledging)
		fBase = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  Call Rekvizit_Fill("Document", 1, "General", "DATE", "04/04/21") 
  Call ClickCmdButton(1, "Î³ï³ñ»É")
		
		' ²ñÅ»ÃÕÃÇ ·ñ³í³¹ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Արժեթղթի գրավադրումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_SecPledge()
		
		' ¶ñ³í³¹ñí³Í ³ñÅ»ÃÕÃÇ í»ñ³¹³ñÓ
	 Log.Message "Գրավադրված արժեթղթի վերադարձ", "", pmNormal, DivideColor
		Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Pledging & "|" & c_SecPledgeOut)
		fBase = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  Call Rekvizit_Fill("Document", 1, "General", "DATE", "05/04/21") 
  Call ClickCmdButton(1, "Î³ï³ñ»É")
		
		' ¶ñ³í³¹ñí³Í ³ñÅ»ÃÕÃÇ í»ñ³¹³ñÓÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Գրավադրված արժեթղթի վերադարձից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_SecPledgeOut()
		
		' æÝç»É "Ð³×³Ëáñ¹Ý»ñÇ ³ñÅ»ÃÕÃ»ñÇ ³éáõÍ³Ë" ÷³ëï³ÃáõÕÃÁ
		Log.Message "Ջնջել ""Հաճախորդների արժեթղթերի առուծախ"" փաստաթուղթը", "", pmNormal, DivideColor
  BuiltIn.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
  wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").MoveNext
  Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
  Call ClickCmdButton(3, "²Ûá")
  wMDIClient.VBObject("frmPttel_2").Close
		
		' Ð³×³Ëáñ¹Ç ³ñÅ»ÃÕÃÇ »Éù
		Log.Message "Հաճախորդի արժթղթի ելք", "", pmNormal, DivideColor
		fBase = ClientSec_Output("05/04/21")
		
		' Ð³×³Ëáñ¹Ç ³ñÅ»ÃÕÃÇ »ÉùÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Հաճախորդի արժթղթի ելքից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_CliSecOutput()
    
		' ä³ÛÙ³Ý³·ñÇ ÷³ÏáõÙ
		Log.Message "Պայմանագրի փակում", "", pmNormal, DivideColor
  nonGovSecurity.CloseDate = "06/04/21"
  nonGovSecurity.CloseAgr()
    
		' ä³ÛÙ³Ý³·ñÇ µ³óáõÙ
		Log.Message "Պայմանագրի բացում", "", pmNormal, DivideColor
  nonGovSecurity.OpenAgr()
		
		BuiltIn.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
		
		' æÝç»É ä³ÛÙ³Ý³·ñÇ µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñÁ
		Log.Message "Ջնջել Պայմանագրի բոլոր գործողությունները", "", pmNormal, DivideColor
		agreementAllOperations.agreementN = nonGovSecurity.DocNum
  Call Delete_AgreementAllOperations(FolderName, agreementAllOperations, "frmPttel", 4, documentType)
		
	 ' ä³ÛÙ³Ý³·ñÇ µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñÁ æÝç»Éáõó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պայմանագրի բոլոր գործողությունները Ջնջելուց հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_Delete()
		
	 Call Test_EndUp()
End Sub

Sub Test_StartUp()
		Call Initialize_AsBank("bank", sDATE, fDATE)
  Login("ARMSOFT")
		Call Start_CustAccApp()
		Call Start_CashInput()
		Call ChangeWorkspace(c_Subsystems)
End	Sub

'Ավելացնել Հաճախորդի արժեթղթի հաշվապահական հավելված
Sub Start_CustAccApp()
		Call ChangeWorkspace(c_Subsystems)
		folder = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|Ð³ßí³å³Ñ³Ï³Ý Ù³ë|Ð³×³Ëáñ¹Ý»ñÇ ³ñÅ»ÃÕÃ»ñÇ Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³ÍÝ»ñ|"
		fName = "Ð³×³Ëáñ¹Ý»ñÇ ³ñÅ»ÃÕÃ»ñÇ Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³ÍÝ»ñ"
		Call Create_CustomerAccApp(folder, custAccApp_new)
		state =  OpenFolder(folder & fName, fName, "CLICODE", "00000777")
  if not state Then
		  Log.Error "Սխալ՝ " & fName & " թղթապանակ մուտք գործելիս", "", pmNormal, ErrorColor
  End If
		BuiltIn.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
End	Sub

'Կանխիկի մուտք
Sub Start_CashInput()
		Call ChangeWorkspace(c_ChiefAcc)
		folder = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|"
		fName = "²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
		
		'Կատարել Կանխիկի մուտք գործողություն
		Call CashInput_Doc_Fill(cashInputDocN, "33140059600", "10000", cashInputfISN, false)
		wMDIClient.Window("ThunderRT6FormDC", "«Կանխիկ մուտք» փաստաթղթի տպելու ձևը", 1).Close
		BuiltIn.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
		
		'Ստուգել փաստաթղթի առկայությունը և կատարել Ուղարկել հաստատման գործողություն 
		Call AccessFolder(folder & fName, fName, "PERN", Date(), "PERK", Date(), false, , "")
		Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_SendToVer)
  Call ClickCmdButton(2, "Î³ï³ñ»É")
		BuiltIn.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
		
		'Հաստատվող փաստաթղթերից կատարել Վավերացնել գործողությունը
		Call wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ (I)")
    BuiltIn.Delay(2000)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
		Call SearchInPttel("frmPttel", 2, cashInputDocN)
		BuiltIn.Delay(3000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_ToConfirm)
  Call ClickCmdButton(1, "Ð³ëï³ï»É")
		BuiltIn.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
		
		'Աշխատանքային փաստաթղթերից Վավերացնել վերջնական փաստաթուղթը
		Call wTreeView.DblClickItem(folder & fName)
		Call ClickCmdButton(2, "Î³ï³ñ»É")
		Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_ToConfirm)
		Call ClickCmdButton(1, "Ð³ëï³ï»É")
		BuiltIn.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
		
		'Ստուգել փաստաթղթի առկայությունը Հաշվառված վճարային փաստաթղթերում
		Call wTreeView.DblClickItem(folder & "Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
		Call ClickCmdButton(2, "Î³ï³ñ»É")
		If wMDIClient.vbObject("frmPttel").vbObject("tdbgView").VisibleRows <> 1 Then
						Log.Error "There are no document with specified ID or there are more than one.", "", pmNormal, ErrorColor
  End If
		BuiltIn.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
End	Sub

Sub Test_EndUp()		
		'Ստուգել Հաճախորդի արժեթղթի հաշվապահական հավելված փաստաթղթի առկայությունը
		folder = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|Ð³ßí³å³Ñ³Ï³Ý Ù³ë|Ð³×³Ëáñ¹Ý»ñÇ ³ñÅ»ÃÕÃ»ñÇ Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³ÍÝ»ñ|"
		fName = "Ð³×³Ëáñ¹Ý»ñÇ ³ñÅ»ÃÕÃ»ñÇ Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³ÍÝ»ñ"
		state = OpenFolder(folder & fName, fName, "CLICODE", "00000777")
		if not state Then
		  Log.Error "Սխալ՝ " & fName & " թղթապանակ մուտք գործելիս", "", pmNormal, ErrorColor
  End If
		
		'Ջնջել Հաճախորդի արժեթղթի հաշվապահական հավելված փաստաթուղթը
		BuiltIn.Delay(1000)
		Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_ToEdit)
	 Call Fill_CustomerAccApp(custAccApp2)
		Call ClickCmdButton(1, "Î³ï³ñ»É")
		Call DelDoc()
		BuiltIn.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
		
		'Ջնջել Հաշվառված վճարային փաստաթուղթը
		Call ChangeWorkspace(c_ChiefAcc)
		folder = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|"
		fName = "²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
		Call wTreeView.DblClickItem(folder & "Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
		Call ClickCmdButton(2, "Î³ï³ñ»É")
		If wMDIClient.vbObject("frmPttel").vbObject("tdbgView").VisibleRows <> 1 Then
						Log.Error "There are no document with specified ID or there are more than one.", "", pmNormal, ErrorColor
  End If
		BuiltIn.Delay(2000)
		Call DelDoc()
		BuiltIn.Delay(2000)
  wMDIClient.VBObject("frmPttel").Close
		
		'Փակել ծրագիրը
		Call Close_AsBank()   
End	Sub

Sub Test_Initialize()
		folderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|àã å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñ|"
	
		sDATE = "20030101"
		fDATE = "20260101"  
		
		Set custAccApp_new = New_CustomerAccApp()
		with custAccApp_new
				.client = "00000777"
				.settlAcc = "33140058300"
				.freeSecAcc = "8100100/770227"
				.pledgedSecAcc = "8100100/770234"
				.curr = "000"
				.clientNo = "33140059600"
				.clientFreeNo = "8100100/770240"
				.clientPledgedNo = "8100100/770236"
		end with
		
		Set custAccApp2 = New_CustomerAccApp()
		with custAccApp2
				.client = "00000777"
				.settlAcc = "^![Right]" & "[Del]"
				.freeSecAcc = "^![Right]" & "[Del]"
				.pledgedSecAcc = "^![Right]" & "[Del]"
				.curr = "[Del]"
				.clientNo = "[Del]"
				.clientFreeNo = "[Del]"
				.clientPledgedNo = "[Del]"
		end with
		
		Set nonGovSecurity = New_SecurityDoc()
		With nonGovSecurity
    .Nominal = 100000
    .PublishDate = "310321" 
    .PrevRepDate = "310321"
    .BuyDate = "310321"
    .Term = "010422"
    .SecType = 4
    .CalcAcc = "00000113032"
    .RepayType = 1
    .FirstDate = "310321"
    .DiscMethod = 2
    .Name = "EkChberox" 
				.Client = "00000777"
				.Count = 3
				.unitPriceFill = true
				.unitPrice = 500000
    .DocType = "îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ áã å»ï.³ñÅ»ÃáõÕÃ"
		End With
		
		Set Working_Docs = New_SubsystemWorkingDocuments()
		
		Set Verification_Doc = New_VerifyContract()
		
		Set goToAgreement = New_ContractsFilter()
		goToAgreement.AgreementLevelExist = false
		goToAgreement.ShowClosed = 1
		
		Set agreementAllOperations = New_AgreementAllOperations()
		
		Redim documentType(3)
		documentType(3) = "îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ"
		documentType(2) = "àã å»ï³Ï³Ý ³ñÅ»ÃÕÃÇ ³éù"
		documentType(1) = "Ð³×³Ëáñ¹Ç ³ñÅ»ÃÕÃÇ Ùáõïù"
		documentType(0) = "Ð³×³Ëáñ¹Ç ³ñÅ»ÃÕÃÇ »Éù"
		
End Sub

Sub DB_Inirtialize()
		Dim i
		
		Set dbo_CONTRACTS = New_DB_CONTRACTS()
  dbo_CONTRACTS.fDGISN = nonGovSecurity.fBASE
  dbo_CONTRACTS.fDGPARENTISN = nonGovSecurity.fBASE
  dbo_CONTRACTS.fDGISN1 = nonGovSecurity.fBASE
  dbo_CONTRACTS.fDGISN3 = nonGovSecurity.fBASE
  dbo_CONTRACTS.fDGAGRKIND = 5
  dbo_CONTRACTS.fDGSTATE = 1
  dbo_CONTRACTS.fDGTYPENAME = "CVSimpl "
  dbo_CONTRACTS.fDGCODE = nonGovSecurity.DocNum
  dbo_CONTRACTS.fDGCAPTION = "ý²àôêî"
  dbo_CONTRACTS.fDGCLICODE = "00034852"
  dbo_CONTRACTS.fDGCUR = "000"
  dbo_CONTRACTS.fDGSUMMA = "0.00"
  dbo_CONTRACTS.fDGALLSUMMA = "0.00"
  dbo_CONTRACTS.fDGRISKDEGREE = "0.00"
  dbo_CONTRACTS.fDGRISKDEGNB = "0.00"
  dbo_CONTRACTS.fDGACSBRANCH = "00 "
  dbo_CONTRACTS.fDGACSDEPART = "1  "
  dbo_CONTRACTS.fDGACSTYPE = "CV1 "
		
		for i = 0 to 4
    Set dbo_FOLDERS(i) = New_DB_FOLDERS()
    dbo_FOLDERS(i).fKEY = nonGovSecurity.fBASE
    dbo_FOLDERS(i).fISN = nonGovSecurity.fBASE
    dbo_FOLDERS(i).fNAME = "CVSimpl "
    dbo_FOLDERS(i).fSTATUS = "1"
  next
  dbo_FOLDERS(0).fFOLDERID = "Agr." & nonGovSecurity.fBASE
  dbo_FOLDERS(0).fCOM = "îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ"
  dbo_FOLDERS(0).fSPEC = "1îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ- "& nonGovSecurity.DocNum & " {ý²àôêî}"
  dbo_FOLDERS(1).fFOLDERID = "C.471187179"
  dbo_FOLDERS(1).fCOM = " îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ (Ý³Ë³·ÇÍ)"
  dbo_FOLDERS(1).fSPEC = nonGovSecurity.DocNum & " (ý²àôêî),     1500000"
  dbo_FOLDERS(2).fFOLDERID = "C.903824400"
  dbo_FOLDERS(2).fCOM = " îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ (Ý³Ë³·ÇÍ)"
  dbo_FOLDERS(2).fSPEC = nonGovSecurity.DocNum & " (ý²àôêî),     0 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
  dbo_FOLDERS(3).fFOLDERID = "CLISECURITIES" 
		dbo_FOLDERS(3).fKEY = "471187179 " & nonGovSecurity.fBASE
  dbo_FOLDERS(3).fCOM = "EkChberox"
  dbo_FOLDERS(4).fFOLDERID = "SSWork.CRCV20210331" 
  dbo_FOLDERS(4).fCOM = "îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ"
  dbo_FOLDERS(4).fSPEC = nonGovSecurity.DocNum & "        CV1 20210331            0.0077  00034852Üáñ å³ÛÙ³Ý³·Çñ      "
  dbo_FOLDERS(4).fECOM = "Noninterest-Bearing Securities"
  dbo_FOLDERS(4).fDCBRANCH = "00 "
  dbo_FOLDERS(4).fDCDEPART = "1  "
		
		Set dbo_HI2_1 = New_DB_HI2()
		with dbo_HI2_1 
				.fDATE = "2021-04-01"
		  .fTYPE = "SC"
		  .fGLACC = "471187179"
		  .fSUM = "1500000.00"
		  .fCUR = "000"
		  .fCURSUM = "1500000.00"
		  .fOP = "AGR"
		  .fDBCR = "D"
		end with
		
		Set dbo_HI2_2 = New_DB_HI2()
		with dbo_HI2_2 
				.fDATE = "2021-04-01"
		  .fTYPE = "SP"
		  .fGLACC = "471187179"
		  .fSUM = "10000.00"
		  .fCUR = "000"
		  .fCURSUM = "10000.00"
		  .fOP = "AGR"
		  .fDBCR = "D"
		end with
End	Sub

Sub Check_DB_CreateNonGovSec()
		Dim i
  'SQL Ստուգում CONTRACTS աղյուսակում 
  Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("CONTRACTS", "fDGISN", nonGovSecurity.fBASE, 1)
  Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
  'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", nonGovSecurity.fBASE, 1)
  Call CheckDB_DOCLOG(nonGovSecurity.fBASE, "77", "N", "1", "", 1)
  
  'SQL Ստուգում DOCP աղյուսակում  
  Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCP", "fPARENTISN", nonGovSecurity.fBASE, 1)
  Call CheckDB_DOCP("443871031", "Acc", nonGovSecurity.fBASE, 1)
  
  'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
		fBODY = " ISCLISEC:1 SECFUNC:7 SECTYPE:4 CODE:" & nonGovSecurity.DocNum & " CLICOD:00034852 NAME:ý²àôêî ACCACC:00000113032 SECNAME:EkChberox CURRENCY:000 COUNT:3 CHILDPRICE:500000 ISDISCOUNT:2 APPRAISE:0 DATE:20210331 DATEAGR:20220401 CONSTPER:0 REFRPERSUM:0 CHRGFIRSTDAY:1 GIVEN:0 ACSBRANCH:00 ACSDEPART:1 ACSTYPE:CV1 MARKETTYPE:1 DATEGIVE:20210331 PCAGRINC:15.0000/365 INCMETHOD:1 STRAIGHTCH:2 SECMODTYPE:0 ISDISCHRG:0 PCCHARGE:15 AUTODEBT:0 KINDSCALE:1 SUBJRISK:0 "
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", nonGovSecurity.fBASE, 1)
  Call CheckDB_DOCS(nonGovSecurity.fBASE, "CVSimpl ", "1", fBODY, 1)
  
		'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", nonGovSecurity.fBASE, 4)
  Call CheckDB_DOCSG(nonGovSecurity.fBASE, "CLIENTS", 0, "ALLSUMMA", "1500000", 1)
		Call CheckDB_DOCSG(nonGovSecurity.fBASE, "CLIENTS", 0, "CLICOD", "00000777", 1)
		Call CheckDB_DOCSG(nonGovSecurity.fBASE, "CLIENTS", 0, "PCAGRINC", "12", 1)
		Call CheckDB_DOCSG(nonGovSecurity.fBASE, "CLIENTS", 0, "SUMMA", "1338892.7", 1)
		
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("FOLDERS", "fISN", nonGovSecurity.fBASE, 5)
  for i = 0 to 4
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
  next
  
  'SQL Ստուգում RESNUMBERS աղյուսակում 
  Log.Message "SQL Ստուգում RESNUMBERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("RESNUMBERS", "fISN", nonGovSecurity.fBASE, 1)
  Call CheckDB_RESNUMBERS(nonGovSecurity.fBASE, "C", nonGovSecurity.DocNum, 1)	
End	Sub

Sub Check_DB_SendToVerify()
		'SQL Ստուգում CONTRACTS աղյուսակում 
  Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
  dbo_CONTRACTS.fDGSTATE = 101
  Call CheckQueryRowCount("CONTRACTS", "fDGISN", nonGovSecurity.fBASE, 1)
  Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
  'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", nonGovSecurity.fBASE, 3)
  Call CheckDB_DOCLOG(nonGovSecurity.fBASE, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(nonGovSecurity.fBASE, "77", "C", "101", "", 1)

  'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", nonGovSecurity.fBASE, 1)
  Call CheckDB_DOCS(nonGovSecurity.fBASE, "CVSimpl ", "101", fBODY, 1)
  
		'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		dbo_FOLDERS(4).fKEY = nonGovSecurity.fBASE
  dbo_FOLDERS(4).fISN = nonGovSecurity.fBASE
  dbo_FOLDERS(4).fNAME = "CVSimpl "
  dbo_FOLDERS(4).fSTATUS = "4"
		dbo_FOLDERS(4).fFOLDERID = "SSConf.CRCV001" 
		dbo_FOLDERS(4).fCOM = "îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ"
		dbo_FOLDERS(4).fSPEC = nonGovSecurity.DocNum & "        CV1 20210331            0.0077  00034852"
		dbo_FOLDERS(4).fECOM = "Noninterest-Bearing Securities"
		dbo_FOLDERS(4).fDCBRANCH = "00 "
		dbo_FOLDERS(4).fDCDEPART = "1  "
  Call CheckQueryRowCount("FOLDERS", "fISN", nonGovSecurity.fBASE, 6)
  Call CheckDB_FOLDERS(dbo_FOLDERS(4), 1)
End	Sub

Sub Check_DB_VerifyContract()
		Dim i 
		
		'SQL Ստուգում CONTRACTS աղյուսակում 
  Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
  dbo_CONTRACTS.fDGSTATE = 7
  Call CheckQueryRowCount("CONTRACTS", "fDGISN", nonGovSecurity.fBASE, 1)
  Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
  'SQL Ստուգում CAGRACCS աղյուսակում 
  Log.Message "SQL Ստուգում CAGRACCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("CAGRACCS", "fAGRISN", nonGovSecurity.fBASE, 1)
  
  'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", nonGovSecurity.fBASE, 5)
  Call CheckDB_DOCLOG(nonGovSecurity.fBASE, "77", "W", "102", "", 1)
  Call CheckDB_DOCLOG(nonGovSecurity.fBASE, "77", "T", "7", "", 1)
		
		'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", nonGovSecurity.fBASE, 4)

  'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", nonGovSecurity.fBASE, 1)
  Call CheckDB_DOCS(nonGovSecurity.fBASE, "CVSimpl ", "7", fBODY, 1)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		dbo_FOLDERS(0).fFOLDERID = "Agr." & nonGovSecurity.fBASE
  dbo_FOLDERS(0).fCOM = "îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ"
  dbo_FOLDERS(0).fSPEC = "1îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ- "& nonGovSecurity.DocNum & " {ý²àôêî}"
  dbo_FOLDERS(1).fFOLDERID = "C.471187179"
  dbo_FOLDERS(1).fCOM = " îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ"
  dbo_FOLDERS(1).fSPEC = nonGovSecurity.DocNum & " (ý²àôêî),     1500000"
  dbo_FOLDERS(2).fFOLDERID = "C.903824400"
  dbo_FOLDERS(2).fCOM = " îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ"
  dbo_FOLDERS(2).fSPEC = nonGovSecurity.DocNum & " (ý²àôêî),     0 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
		dbo_FOLDERS(2).fECOM = "1"
  dbo_FOLDERS(3).fFOLDERID = "CLISECURITIES" 
		dbo_FOLDERS(3).fKEY = "471187179 " & nonGovSecurity.fBASE
  dbo_FOLDERS(3).fCOM = "EkChberox"
  dbo_FOLDERS(4).fFOLDERID = "ALLSECURITIES" 
		dbo_FOLDERS(4).fKEY = "CV" & nonGovSecurity.fBASE
  dbo_FOLDERS(4).fCOM = "EkChberox"
  dbo_FOLDERS(4).fSPEC =  nonGovSecurity.DocNum & "        00000000    20210331"
  dbo_FOLDERS(4).fECOM = ""
  dbo_FOLDERS(4).fDCBRANCH = ""
  dbo_FOLDERS(4).fDCDEPART = ""
		dbo_FOLDERS(4).fSTATUS = "1"
  Call CheckQueryRowCount("FOLDERS", "fISN", nonGovSecurity.fBASE, 5)
  for i = 0 to 4
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
  next
  
		'SQL Ստուգում HIF  աղյուսակում 
  Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIF", "fOBJECT", nonGovSecurity.fBASE, 12)
End	Sub

Sub Check_DB_SecBuy()
		'SQL Ստուգում CONTRACTS աղյուսակում 
  Log.Message "SQL Ստուգում CONTRACTS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("CONTRACTS", "fDGISN", nonGovSecurity.fBASE, 1)
  Call CheckDB_CONTRACTS(dbo_CONTRACTS, 1)
  
  'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", nonGovSecurity.fBASE, 6)
  Call CheckDB_DOCLOG(nonGovSecurity.fBASE, "77", "E", "7", "", 1)
		Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)
  Call CheckDB_DOCLOG(fBase, "77", "N", "1", "", 1)
		Call CheckDB_DOCLOG(fBase, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(fBase, "77", "T", "2", "", 1)
		Call CheckDB_DOCLOG(fBase, "77", "C", "5", "", 1)
		
		'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", fBase, 3)
		Call CheckDB_DOCSG(fBase, "CLIENTS", 0, "CLICOD", "00000777", 1)
		Call CheckDB_DOCSG(fBase, "CLIENTS", 0, "NOMINAL", "1500000", 1)
		Call CheckDB_DOCSG(fBase, "CLIENTS", 0, "SUMMA", "10000", 1)

  'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & nonGovSecurity.DocNum & " DATE:20210401 COMMENT:àã å»ï³Ï³Ý ³ñÅ»ÃÕÃÇ ³éù FROMAGCL:0 ACSBRANCH:00 ACSDEPART:1 ACSTYPE:CV1 USERID:  77 "
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
  Call CheckDB_DOCS(fBase, "CVDSAgr", "5", fBODY, 1)
		
		'SQL Ստուգում HI աղյուսակում 
  Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HI", "fBASE", fBase, 3)
  Call Check_HI_CE_accounting ("2021-04-01", fBase, "01", "443871031", "10000.00", "000", "10000.00", "MSC", "C")
		obj = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & fBase & " and fDBCR = 'D' and fSUM = '10000.00'")
		Call Check_HI_CE_accounting ("2021-04-01", fBase, "01", obj, "10000.00", "000", "10000.00", "MSC", "D")
		obj = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & fBase & " and fDBCR = 'D' and fSUM = '1500000.00'")
		Call Check_HI_CE_accounting ("2021-04-01", fBase, "02", obj, "1500000.00", "000", "1500000.00", "MSC", "D")
		
		'SQL Ստուգում HI2 աղյուսակում
  Log.Message "SQL Ստուգում HI2 աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HI2", "fBASE", fBase, 2)
		dbo_HI2_1.fOBJECT = nonGovSecurity.fBASE
		dbo_HI2_1.fBASE = fBase
		dbo_HI2_2.fOBJECT = nonGovSecurity.fBASE
		dbo_HI2_2.fBASE = fBase
  Call CheckDB_HI2(dbo_HI2_1, 1)
		Call CheckDB_HI2(dbo_HI2_2, 1)
		
'		'SQL Ստուգում HIREST  աղյուսակում 
'  Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
'  Call CheckQueryRowCount("HIREST", "fOBJECT", nonGovSecurity.fBASE, 1)	
		
		'SQL Ստուգում HIREST2  աղյուսակում 
  Log.Message "SQL Ստուգում HIREST2 աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIREST2", "fOBJECT", nonGovSecurity.fBASE, 4)
  Call CheckDB_HIREST2("SC", nonGovSecurity.fBASE ,"471187179", "0.00" ,"000", "0.00", 1)
		Call CheckDB_HIREST2("SC", nonGovSecurity.fBASE ,"471187179", "1500000.00" ,"000", "1500000.00", 1)
		Call CheckDB_HIREST2("SP", nonGovSecurity.fBASE ,"471187179", "0.00" ,"000", "0.00", 1)
		Call CheckDB_HIREST2("SP", nonGovSecurity.fBASE ,"471187179", "10000.00" ,"000", "10000.00", 1)
End	Sub

Sub Check_DB_CliSecInp()
		'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)
  Call CheckDB_DOCLOG(fBase, "77", "N", "1", "", 1)
		Call CheckDB_DOCLOG(fBase, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(fBase, "77", "T", "2", "", 1)
		Call CheckDB_DOCLOG(fBase, "77", "C", "5", "", 1)
		
		'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", fBase, 4)
		Call CheckDB_DOCSG(fBase, "CLISECBUY", 0, "CLICOD", "00000777", 1)
		Call CheckDB_DOCSG(fBase, "CLISECBUY", 0, "COUNT", "3", 1)
		Call CheckDB_DOCSG(fBase, "CLISECBUY", 0, "NOMINAL", "1500000", 1)
		Call CheckDB_DOCSG(fBase, "CLISECBUY", 0, "PRICE", "12222", 1)

  'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & nonGovSecurity.DocNum & " DATE:20210402 COMMENT:Ð³×³Ëáñ¹Ç ³ñÅ»ÃÕÃÇ Ùáõïù ACSBRANCH:00 ACSDEPART:1 ACSTYPE:CV1 USERID:  77 "
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
  Call CheckDB_DOCS(fBase, "CVDSInCl", "5", fBODY, 1)
		
		'SQL Ստուգում HI աղյուսակում
  Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HI", "fBASE", fBase, 1)
		obj = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & fBase & " and fDBCR = 'D' and fSUM = '1500000.00'")
		Call Check_HI_CE_accounting ("2021-04-02", fBase, "02", obj, "1500000.00", "000", "1500000.00", "MSC", "D")
		
		'SQL Ստուգում HI2 աղյուսակում
  Log.Message "SQL Ստուգում HI2 աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HI2", "fBASE", fBase, 2)
		with dbo_HI2_1
				.fDATE = "2021-04-02"
				.fOBJECT = nonGovSecurity.fBASE
				.fBASE = fBase
				.fOP = "BUY"
		end with
		with dbo_HI2_2
				.fDATE = "2021-04-02"
				.fOBJECT = nonGovSecurity.fBASE
				.fBASE = fBase
				.fSUM = "12222.00"
				.fCURSUM = "12222.00"
				.fOP = "BUY"
		end with
  Call CheckDB_HI2(dbo_HI2_1, 1)
		Call CheckDB_HI2(dbo_HI2_2, 1)
		
		'SQL Ստուգում HIF  աղյուսակում 
  Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIF", "fOBJECT", nonGovSecurity.fBASE, 13)
		
'		'SQL Ստուգում HIREST  աղյուսակում 
'  Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
'  Call CheckQueryRowCount("HIREST", "fOBJECT", nonGovSecurity.fBASE, 1)	
		
		'SQL Ստուգում HIREST2  աղյուսակում 
  Log.Message "SQL Ստուգում HIREST2 աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIREST2", "fOBJECT", nonGovSecurity.fBASE, 4)
		Call CheckDB_HIREST2("SC", nonGovSecurity.fBASE ,"471187179", "3000000.00" ,"000", "3000000.00", 1)
		Call CheckDB_HIREST2("SP", nonGovSecurity.fBASE ,"471187179", "22222.00" ,"000", "22222.00", 1)
End	Sub

Sub Check_DB_CliSecGivBack()
		Dim i
		
		'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 3)
  Call CheckDB_DOCLOG(fBase, "77", "N", "1", "", 1)
		Call CheckDB_DOCLOG(fBase, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(fBase, "77", "C", "1", "", 1)
		
		'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & nonGovSecurity.DocNum & " DATE:20210403 COMMENT:Ð³×³Ëáñ¹Ý»ñÇ áã å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñÇ ³éáõÍ³Ë ACSBRANCH:00 ACSDEPART:1 ACSTYPE:CV1 USERID:  77 "
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
  Call CheckDB_DOCS(fBase, "CVDSAgCl", "1", fBODY, 1)
		
		'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		for i = 0 to 4
    Set dbo_FOLDERS(i) = New_DB_FOLDERS()
    dbo_FOLDERS(i).fKEY = fBase
    dbo_FOLDERS(i).fISN = fBase
    dbo_FOLDERS(i).fNAME = "CVDSAgCl"
    dbo_FOLDERS(i).fSTATUS = "1"
				dbo_FOLDERS(i).fCOM = "Ð³×³Ëáñ¹Ý»ñÇ áã å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñÇ ³éáõÍ³Ë"
  next
		dbo_FOLDERS(0).fFOLDERID = "Agr." & nonGovSecurity.fBASE
  dbo_FOLDERS(0).fSPEC = "1Ð³×³Ëáñ¹Ý»ñÇ áã å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñÇ ³éáõÍ³Ë"
  dbo_FOLDERS(1).fFOLDERID = "AgrOrd." & nonGovSecurity.fBASE
  dbo_FOLDERS(2).fFOLDERID = "C.903824400"
  dbo_FOLDERS(2).fSPEC = "ä³ÛÙ³Ý³·Çñ N% " & nonGovSecurity.DocNum
  dbo_FOLDERS(3).fFOLDERID = "ORDGOWAY" 
		dbo_FOLDERS(3).fSPEC = "20210403000ý²àôêî                          " & nonGovSecurity.DocNum & "            00034852CV1 "
  dbo_FOLDERS(3).fDCBRANCH = "00 "
		dbo_FOLDERS(3).fDCDEPART = "1  "
  dbo_FOLDERS(4).fFOLDERID = "AGRORDERS" 
  dbo_FOLDERS(4).fSPEC = "20210403" & nonGovSecurity.DocNum & "            "
  Call CheckQueryRowCount("FOLDERS", "fISN", fBase, 5)
  for i = 0 to 4
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
  next
End	Sub

Sub Check_DB_SecPledge()
		'SQL Ստուգում DOCLOG աղյուսակում 
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 3)
  Call CheckDB_DOCLOG(fBase, "77", "N", "1", "", 1)
		Call CheckDB_DOCLOG(fBase, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(fBase, "77", "C", "5", "", 1)
		
		'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & nonGovSecurity.DocNum & " DATE:20210404 COMMENT:àã å»ï³Ï³Ý ³ñÅ»ÃÕÃÇ ·ñ³í³¹ñáõÙ ACSBRANCH:00 ACSDEPART:1 ACSTYPE:CV1 USERID:  77  "
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
  Call CheckDB_DOCS(fBase, "CVDSPldg", "5", fBODY, 1)
		
		'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", fBase, 1)
		Call CheckDB_DOCSG(fBase, "CLIENTS", 0, "CLICOD", "00000777", 1)
End	Sub

Sub Check_DB_SecPledgeOut()
		'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 3)
  Call CheckDB_DOCLOG(fBase, "77", "N", "1", "", 1)
		Call CheckDB_DOCLOG(fBase, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(fBase, "77", "C", "5", "", 1)
		
		'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & nonGovSecurity.DocNum & " DATE:20210405 COMMENT:¶ñ³í³¹ñí³Í áã å»ï³Ï³Ý ³ñÅ»ÃÕÃÇ í»ñ³¹³ñÓ ACSBRANCH:00 ACSDEPART:1 ACSTYPE:CV1 USERID:  77 "
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
  Call CheckDB_DOCS(fBase, "CVDSPlUn", "5", fBODY, 1)
End	Sub

Sub Check_DB_CliSecOutput()		
		'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", fBase, 4)
  Call CheckDB_DOCLOG(fBase, "77", "N", "1", "", 1)
		Call CheckDB_DOCLOG(fBase, "77", "M", "99", "àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý", 1)
		Call CheckDB_DOCLOG(fBase, "77", "T", "2", "", 1)
		Call CheckDB_DOCLOG(fBase, "77", "C", "5", "", 1)
		
		'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
		fBODY = " CODE:" & nonGovSecurity.DocNum & " DATE:20210405 COMMENT:Ð³×³Ëáñ¹Ç ³ñÅ»ÃÕÃÇ »Éù ACSBRANCH:00 ACSDEPART:1 ACSTYPE:CV1 USERID:  77 "
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", fBase, 1)
  Call CheckDB_DOCS(fBase, "CVDSDbCl", "5", fBODY, 1)
		
		'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", fBase, 3)
		Call CheckDB_DOCSG(fBase, "CLISECSELL", 0, "CLICOD", "00000777", 1)
		Call CheckDB_DOCSG(fBase, "CLISECSELL", 0, "COUNT", "6", 1)
		Call CheckDB_DOCSG(fBase, "CLISECSELL", 0, "NOMINAL", "3000000", 1)
		
		'SQL Ստուգում HI աղյուսակում 
  Log.Message "SQL Ստուգում HI աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HI", "fBASE", fBase, 1)
		obj = Get_ColumnValueSQL("HI", "fOBJECT", "fBASE = " & fBase & " and fDBCR = 'C' and fSUM = '3000000.00'")
		Call Check_HI_CE_accounting ("2021-04-05", fBase, "02", obj, "3000000.00", "000", "3000000.00", "MSC", "C")
		
		'SQL Ստուգում HI2 աղյուսակում
  Log.Message "SQL Ստուգում HI2 աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HI2", "fBASE", fBase, 2)
		with dbo_HI2_1
				.fDATE = "2021-04-05"
				.fOBJECT = nonGovSecurity.fBASE
				.fBASE = fBase
				.fSUM = "3000000.00"
				.fCURSUM = "3000000.00"
				.fOP = "SEL"
				.fDBCR = "C"
		end with
		with dbo_HI2_2
				.fDATE = "2021-04-05"
				.fOBJECT = nonGovSecurity.fBASE
				.fBASE = fBase
				.fSUM = "22222.00"
				.fCURSUM = "22222.00"
				.fOP = "SEL"
				.fDBCR = "C"
		end with
  Call CheckDB_HI2(dbo_HI2_1, 1)
		Call CheckDB_HI2(dbo_HI2_2, 1)
		
		'SQL Ստուգում HIF  աղյուսակում 
  Log.Message "SQL Ստուգում HIF աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIF", "fOBJECT", nonGovSecurity.fBASE, 14)
		
		'		'SQL Ստուգում HIREST  աղյուսակում 
'  Log.Message "SQL Ստուգում HIREST աղյուսակում", "", pmNormal, SqlDivideColor
'  Call CheckQueryRowCount("HIREST", "fOBJECT", nonGovSecurity.fBASE, 1)	
		
		'SQL Ստուգում HIREST2  աղյուսակում 
  Log.Message "SQL Ստուգում HIREST2 աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("HIREST2", "fOBJECT", nonGovSecurity.fBASE, 4)
		Call CheckDB_HIREST2("SC", nonGovSecurity.fBASE, "471187179", "0.00", "000", "0.00", 2)
		Call CheckDB_HIREST2("SP", nonGovSecurity.fBASE, "471187179", "0.00", "000", "0.00", 2)
End	Sub

Sub Check_DB_Delete()
		'SQL Ստուգում DOCLOG աղյուսակում
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
		Call CheckQueryRowCount("DOCLOG", "fISN", nonGovSecurity.fBASE, 10)
  Call CheckDB_DOCLOG(nonGovSecurity.fBASE, "77", "M", "77", "ä³ÛÙ³Ý³·ñÇ ÷³ÏáõÙ( ÉñÇí ÷³ÏáõÙ)", 1)
		Call CheckDB_DOCLOG(nonGovSecurity.fBASE, "77", "C", "7", "", 1)
		Call CheckDB_DOCLOG(nonGovSecurity.fBASE, "77", "M", "7", "ä³ÛÙ³Ý³·ñÇ µ³óáõÙ", 1)
		Call CheckDB_DOCLOG(nonGovSecurity.fBASE, "77", "D", "999", "", 1)
		
		'SQL Ստուգում DOCS աղյուսակում
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
		fBODY = " ISCLISEC:1 SECFUNC:7 SECTYPE:4 CLICOD:00034852 NAME:ý²àôêî ACCACC:00000113032 SECNAME:EkChberox CURRENCY:000 COUNT:3 CHILDPRICE:500000 ISDISCOUNT:2 APPRAISE:0 DATE:20210331 DATEAGR:20220401 CONSTPER:0 REFRPERSUM:0 CHRGFIRSTDAY:1 GIVEN:1 ACSBRANCH:00 ACSDEPART:1 ACSTYPE:CV1 MARKETTYPE:1 DATEGIVE:20210331 PCAGRINC:15.0000/365 INCMETHOD:1 STRAIGHTCH:2 SECMODTYPE:0 ISDISCHRG:0 PCCHARGE:15 AUTODEBT:0 KINDSCALE:1 SUBJRISK:0 " 
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", nonGovSecurity.fBASE, 1)
  Call CheckDB_DOCS(nonGovSecurity.fBASE, "CVSimpl ", "999", fBODY, 1)
		
		'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("FOLDERS", "fISN", nonGovSecurity.fBASE, 1)
  dbo_FOLDERS(3).fKEY = nonGovSecurity.fBASE
  dbo_FOLDERS(3).fISN = nonGovSecurity.fBASE
  dbo_FOLDERS(3).fNAME = "CVSimpl "
  dbo_FOLDERS(3).fSTATUS = "0"
		dbo_FOLDERS(3).fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")
		dbo_FOLDERS(3).fCOM = ""
		dbo_FOLDERS(3).fSPEC = Left_Align(Get_Compname_DOCLOG(nonGovSecurity.fBASE), 16) &  "Cred&DepARMSOFT                       007  "
		dbo_FOLDERS(3).fECOM = ""
		dbo_FOLDERS(3).fDCBRANCH = "00 "
		dbo_FOLDERS(3).fDCDEPART = "1  "
  Call CheckDB_FOLDERS(dbo_FOLDERS(3), 1)
End	Sub