'USEUNIT Subsystems_SQL_Library
'USEUNIT Library_Common
'USEUNIT Library_Contracts
'USEUNIT Constants
'USEUNIT Library_Colour
'USEUNIT OLAP_Library
'USEUNIT SWIFT_International_Payorder_Library
Option Explicit

'Test case ID 161866
'Test case ID 161919

Dim folderName, sDATE, fDATE, colName(5), param
Dim contracts,operations, clientGovSecurOpers, reverseRepoSale, allOperations, calculationDates
Dim actualFile1, actualFile2, actualFile3, actualFile4, actualFile5, actualFile6
Dim expectedFile1, expectedFile2, expectedFile3, expectedFile4, expectedFile5, expectedFile6
Dim resultFile1, resultFile2, resultFile3, resultFile4, resultFile5, resultFile6

Sub AllocatedFunds_SecuritiesMSMP_Reports(rowLimit)
		' ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ ØØÄä
		Call Test_Initialize()

		' Համակարգ մուտք գործել ARMSOFT օգտագործողով
		Log.Message "Համակարգ մուտք գործել ARMSOFT օգտագործողով", "", pmNormal, DivideColor
  Call Test_StartUp(rowLimit) 
		
		'''''''''''''''''''''''''''''''''''''''''''''''''
		'''''''''''''''''''ä³ÛÙ³Ý³·ñ»ñ'''''''''''''''''''
		
		' Լրացնել Պայմանագրեր դիալոգային պատուհանը
		Log.Message "Պայմանագրեր", "", pmNormal, DivideColor
		Call GoTo_ContractsFilterMini(folderName, contracts)
		
		if WaitForExecutionProgress() then		
				' êáñï³íáñ»É µ³óí³Í åïï»ÉÁ
				Call columnSorting(colName, 4, "frmPttel")
				' Արտահանել, որպես txt ֆայլ
				Call ExportToTXTFromPttel("frmPttel", actualFile1)
				' Ստուգել տողերի քանակը
				Call CheckPttel_RowCount("frmPttel", 13)
				' Համեմատել txt ֆայլերը
				Call Compare_Files(actualFile1, expectedFile1, param)
				' ö³Ï»É åïï»ÉÁ
				BuiltIn.Delay(3000) 
		  wMDIClient.VBObject("frmPttel").Close
		else																																	
						Log.Error "Can't open pttel window.", "", pmNormal, ErrorColor
		end if
		
		folderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ ØØÄä|¶áñÍáÕáõÃÛáõÝÝ»ñ, ÷á÷áËáõÃÛáõÝÝ»ñ|"
		
		'''''''''''''''''''''''''''''''''''''''''''''''''
		'''''''''''''''¶áñÍáÕáõÃÛáõÝÝ»ñ''''''''''''''''''
		
		' Լրացնել Գործողությունների դիտում դիալոգային պատուհանը
		Log.Message "Գործողություններ", "", pmNormal, DivideColor
		Call GoTo_AllocFundsOperations(folderName, operations)
		
		if WaitForExecutionProgress() then		
				BuiltIn.Delay(10000) 
				' ä³Ñå³Ý»É Excel
				Call SaveExcelFile(actualFile2)
				' Համեմատել Excel ֆայլերը
				Call CompareTwoExcelFiles(actualFile2, expectedFile2, resultFile2)
				' ö³Ï»É բոլոր Excel ֆայլերը
				Call CloseAllExcelFiles()
		else																																	
						Log.Error "Can't open pttel window.", "", pmNormal, ErrorColor
		end if
		
		'''''''''''''''''''''''''''''''''''''''''''''''''
		'Ð³×³Ëáñ¹Ý»ñÇ å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñÇ ·áñÍáÕáõÃÛáõÝÝ»ñ
		
		' Լրացնել Հաճախորդների պետական արժեթղթերի գործողություններ դիալոգային պատուհանը
		Log.Message "Հաճախորդների պետական արժեթղթերի գործողություններ", "", pmNormal, DivideColor
		Call GoTo_OperationsViewMini(folderName, "Ð³×³Ëáñ¹Ý»ñÇ å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñÇ ·áñÍáÕáõÃÛáõÝÝ»ñ", clientGovSecurOpers)
		
		if WaitForExecutionProgress() then	
				' êáñï³íáñ»É µ³óí³Í åïï»ÉÁ
				Call columnSorting(colName, 4, "frmPttel")	
				' Արտահանել, որպես txt ֆայլ
				Call ExportToTXTFromPttel("frmPttel", actualFile3)
				' Ստուգել տողերի քանակը
				Call CheckPttel_RowCount("frmPttel", 4)
				' Համեմատել txt ֆայլերը
				Call Compare_Files(actualFile3, expectedFile3, param)
				' ö³Ï»É åïï»ÉÁ
				BuiltIn.Delay(3000)
		  wMDIClient.VBObject("frmPttel").Close
		else																																	
						Log.Error "Can't open pttel window.", "", pmNormal, ErrorColor
		end if
		
		'''''''''''''''''''''''''''''''''''''''''''''''''
		'''''''Ð³Ï³¹³ñÓ é»åáÛáí í³×. ·áñÍáÕ. ¹ÇïáõÙ''''''
		
		' Լրացնել Հակադարձ ռեպոյով վաճ. գործող. դիտում դիալոգային պատուհանը
		Log.Message "Հակադարձ ռեպոյով վաճ. գործող. դիտում", "", pmNormal, DivideColor
		Call GoTo_OperationsViewMini(folderName, "Ð³Ï³¹³ñÓ é»åáÛáí í³×. ·áñÍáÕ. ¹ÇïáõÙ", reverseRepoSale)
		
		if WaitForExecutionProgress() then		
				' êáñï³íáñ»É µ³óí³Í åïï»ÉÁ
				Call columnSorting(colName, 3, "frmPttel")
				' Արտահանել Excel
				Call ExportToExcel("frmPttel", actualFile4)
				' Ստուգել տողերի քանակը
				Call CheckPttel_RowCount("frmPttel", 5488)
				' Համեմատել Excel ֆայլերը
				Call CompareTwoExcelFiles(actualFile4, expectedFile4, resultFile4)
				' ö³Ï»É բոլոր Excel ֆայլերը
				Call CloseAllExcelFiles()
				' ö³Ï»É åïï»ÉÁ
				BuiltIn.Delay(3000) 
		  wMDIClient.VBObject("frmPttel").Close
		else																																	
						Log.Error "Can't open pttel window.", "", pmNormal, ErrorColor
		end if
		
		'''''''''''''''''''''''''''''''''''''''''''''''''
		'''''''ä³ÛÙ³Ý³·ñÇ µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñ'''''''''
		
		' Լրացնել Պայմանագրի բոլոր գործողություններ դիալոգային պատուհանը
		Log.Message "Պայմանագրի բոլոր գործողություններ", "", pmNormal, DivideColor
		Call GoTo_AgreementAllOperations(folderName, allOperations)
		
		if WaitForExecutionProgress() then		
				'êáñï³íáñ»É µ³óí³Í åïï»ÉÁ
				Call columnSorting(colName, 4, "frmPttel")
				' Արտահանել, որպես txt ֆայլ
				Call ExportToTXTFromPttel("frmPttel", actualFile5)
				' Ստուգել տողերի քանակը
				Call CheckPttel_RowCount("frmPttel", 36)
				' Համեմատել txt ֆայլերը
				Call Compare_Files(actualFile5, expectedFile5, param) 
				' ö³Ï»É åïï»ÉÁ
				BuiltIn.Delay(3000)
		  wMDIClient.VBObject("frmPttel").Close
		else																																	
						Log.Error "Can't open pttel window.", "", pmNormal, ErrorColor
		end if
		
		'''''''''''''''''''''''''''''''''''''''''''''''''
		''''''''''îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ³Ùë³Ãí»ñ'''''''''''
		
		' Լրացնել Տոկոսների հաշվարկման ամսաթվեր դիալոգային պատուհանը
		Log.Message "Տոկոսների հաշվարկման ամսաթվեր", "", pmNormal, DivideColor
		Call GoTo_AgreementsCommomFilter(folderName & "²ÛÉ|", "îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ³Ùë³Ãí»ñ", calculationDates)
		
		if WaitForExecutionProgress() then		
				colName(4) = "fCHARGE"
				'êáñï³íáñ»É µ³óí³Í åïï»ÉÁ
				Call columnSorting(colName, 5, "frmPttel")
				' Արտահանել Excel
				Call ExportToExcel("frmPttel", actualFile6)
				' Ստուգել տողերի քանակը
				Call CheckPttel_RowCount("frmPttel", 105225)
				' Համեմատել Excel ֆայլերը
				Call CompareTwoExcelFiles(actualFile6, expectedFile6, resultFile6)
				'ö³Ï»É բոլոր Excel ֆայլերը
				Call CloseAllExcelFiles()
				BuiltIn.Delay(3000) 
				'ö³Ï»É åïï»ÉÁ
		  wMDIClient.VBObject("frmPttel").Close
		else																																	
						Log.Error "Can't open pttel window.", "", pmNormal, ErrorColor
		end if
		
		Call Close_AsBank()		
End	Sub

Sub Test_StartUp(rowLimit)
		Call Initialize_AsBank("bank_Report", sDATE, fDATE)
  Login("ARMSOFT")
		Call SaveRAM_RowsLimit(rowLimit)
		Call ChangeWorkspace(c_Subsystems)
End	Sub

Sub Test_Initialize()
		folderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ ØØÄä|"
	
		sDATE = "20030101"
		fDATE = "20260101"  
		
		colName(0) = "fDATE"
		colName(1) = "fKEY"
		colName(3) = "fCOM"
		colName(2) = "fSUID"
		
		' ä³ÛÙ³Ý³·ñ»ñ
		expectedFile1 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Expected\expectedFile1.txt"
		' ¶áñÍáÕáõÃÛáõÝÝ»ñ
		expectedFile2 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Expected\expectedFile2.xlsx"
		' Ð³×³Ëáñ¹Ý»ñÇ å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñÇ ·áñÍáÕáõÃÛáõÝÝ»ñ
		expectedFile3 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Expected\expectedFile3.txt"
		' Ð³Ï³¹³ñÓ é»åáÛáí í³×. ·áñÍáÕ. ¹ÇïáõÙ
		expectedFile4 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Expected\expectedFile4.xlsx"
		' ä³ÛÙ³Ý³·ñÇ µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñ
		expectedFile5 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Expected\expectedFile5.txt"
		' îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ³Ùë³Ãí»ñ
		expectedFile6 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Expected\expectedFile6.xlsx"
	
  ' ä³ÛÙ³Ý³·ñ»ñ
		actualFile1 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Actual\actualFile1.txt"
		' ¶áñÍáÕáõÃÛáõÝÝ»ñ
		actualFile2 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Actual\actualFile2.xlsx"
		' Ð³×³Ëáñ¹Ý»ñÇ å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñÇ ·áñÍáÕáõÃÛáõÝÝ»ñ
		actualFile3 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Actual\actualFile3.txt"
		' Ð³Ï³¹³ñÓ é»åáÛáí í³×. ·áñÍáÕ. ¹ÇïáõÙ
		actualFile4 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Actual\actualFile4.xlsx"
		' ä³ÛÙ³Ý³·ñÇ µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñ
		actualFile5 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Actual\actualFile5.txt"
		' îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ³Ùë³Ãí»ñ
		actualFile6 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Actual\actualFile6.xlsx"
		
  ' ¶áñÍáÕáõÃÛáõÝÝ»ñ
		resultFile2 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Result\resultFile2.xlsx"
		' Ð³Ï³¹³ñÓ é»åáÛáí í³×. ·áñÍáÕ. ¹ÇïáõÙ
		resultFile4 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Result\resultFile4.xlsx"
		' îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ³Ùë³Ãí»ñ
		resultFile6 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\SecuritiesMSMP\Result\resultFile6.xlsx"
		
  ' ä³ÛÙ³Ý³·ñ»ñ
		Set contracts = New_ContractsFilterMini()
		with contracts
				.agreeLevel = "1"
				.name = "Ð³×³Ëáñ¹ 00002346"
				.showClientsSecurities = 1
				.department = "063"
				.accessType = "C71"
		end with
		
		' ¶áñÍáÕáõÃÛáõÝÝ»ñ
		Set operations = New_AllocFundsOperations()
		operations.fill = "1"
		
		' Ð³×³Ëáñ¹Ý»ñÇ å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñÇ ·áñÍáÕáõÃÛáõÝÝ»ñ
		Set clientGovSecurOpers = New_OperationsViewMini()
		with clientGovSecurOpers
				.clientExists = true
				.startDate = "21/12/05"
				.endDate = "21/12/05"
				.agreeN = "000149"
				.client = "00002747"
				.performer = "17"
		end with
		
		' Ð³Ï³¹³ñÓ é»åáÛáí í³×. ·áñÍáÕ. ¹ÇïáõÙ
		Set reverseRepoSale = New_OperationsViewMini()
		with reverseRepoSale
				.agreeLevelExists = false
				.reverseRepoAgreeExists = true
		end with
		
		' ä³ÛÙ³Ý³·ñÇ µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñ
		Set allOperations = New_AgreementAllOperations()
		with allOperations
    .agreementN = "01007750100"
		end with
		
		' îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ³Ùë³Ãí»ñ
		Set calculationDates = New_AgreementsCommomFilter()
						
End Sub