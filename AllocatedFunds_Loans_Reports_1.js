'USEUNIT Subsystems_SQL_Library
'USEUNIT Library_Common
'USEUNIT Library_Contracts
'USEUNIT Constants
'USEUNIT Library_Colour
'USEUNIT OLAP_Library
'USEUNIT SWIFT_International_Payorder_Library
Option Explicit

'Test case ID 161811
'Test case ID 161816

Dim folderName, sDATE, fDATE, colName(5), param
Dim workingDocs, contracts, creditCards, operations, allOperations
Dim actualFile1, actualFile2, actualFile3, actualFile4, actualFile5
Dim expectedFile1, expectedFile2, expectedFile3, expectedFile4, expectedFile5
Dim resultFile1, resultFile2, resultFile3, resultFile4, resultFile5

Sub AllocatedFunds_Loans_Reports_1(rowLimit)
		' ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|ì³ñÏ»ñ (î»Õ³µ³ßËí³Í)
		Call Test_Initialize()

		' Համակարգ մուտք գործել ARMSOFT օգտագործողով
		Log.Message "Համակարգ մուտք գործել ARMSOFT օգտագործողով", "", pmNormal, DivideColor
  Call Test_StartUp(rowLimit)
		
		'''''''''''''''''''''''''''''''''''''''''''''''''
		'''''''''''''²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ'''''''''''''
		
		' Լրացնել Աշխատանքային փաստաթղթեր դիալոգային պատուհանը
		Log.Message "Աշխատանքային փաստաթղթեր", "", pmNormal, DivideColor
		Call GoTo_SubsystemWorkingDocuments(folderName, workingDocs)
		
		if WaitForExecutionProgress() then		
				' Սորտավորել բացված պտտելը
				Call columnSorting(colName, 3, "frmPttel")
				' Արտահանել, որպես txt ֆայլ
				Call ExportToTXTFromPttel("frmPttel", actualFile1)
				' Ստուգել տողերի քանակը
				Call CheckPttel_RowCount("frmPttel", 14)
				' Համեմատել txt ֆայլերը
				Call Compare_Files(actualFile1, expectedFile1, param)
				' ö³Ï»É åïï»ÉÁ
				BuiltIn.Delay(3000)
		  wMDIClient.VBObject("frmPttel").Close
		else																																	
						Log.Error "Can't open pttel window.", "", pmNormal, ErrorColor
		end if
		
		'''''''''''''''''''''''''''''''''''''''''''''''''
		''''''''''''''''''''ä³ÛÙ³Ý³·ñ»ñ''''''''''''''''''
		
		' Լրացնել Պայմանագրեր դիալոգային պատուհանը
		Log.Message "Պայմանագրեր", "", pmNormal, DivideColor
		Call GoTo_Contracts(folderName & "ä³ÛÙ³Ý³·ñ»ñ|", contracts)

		if WaitForExecutionProgress() then		
				' êáñï³íáñ»É µ³óí³Í åïï»ÉÁ
				Call columnSorting(colName, 4, "frmPttel")
				' Արտահանել Excel
				Call ExportToExcel("frmPttel", actualFile2)
				' Ստուգել տողերի քանակը
				Call CheckPttel_RowCount("frmPttel", 3847)
				' Համեմատել Excel ֆայլերը
				Call CompareTwoExcelFiles(actualFile2, expectedFile2, resultFile2)
				' ö³Ï»É բոլոր Excel ֆայլերը
				Call CloseAllExcelFiles()
				' ö³Ï»É åïï»ÉÁ
				BuiltIn.Delay(3000) 
		  wMDIClient.VBObject("frmPttel").Close
		else																																	
						Log.Error "Can't open pttel window.", "", pmNormal, ErrorColor
		end if
		
		'''''''''''''''''''''''''''''''''''''''''''''''''
		''''''''''''''''ì³ñÏ³ÛÇÝ ù³ñï»ñ''''''''''''''''''
		
		' Լրացնել Վարկային քարտեր դիալոգային պատուհանը
		Log.Message "Վարկային քարտեր", "", pmNormal, DivideColor
		Call GoTo_CreditCards(folderName & "ä³ÛÙ³Ý³·ñ»ñ|", creditCards)
		
		if WaitForExecutionProgress() then		
				' Արտահանել, որպես txt ֆայլ
				Call ExportToTXTFromPttel("frmPttel", actualFile3)
				' Ստուգել տողերի քանակը
				Call CheckPttel_RowCount("frmPttel", 1)
				' Համեմատել txt ֆայլերը
				Call Compare_Files(actualFile3, expectedFile3, param) 
				' ö³Ï»É åïï»ÉÁ
				BuiltIn.Delay(3000)
		  wMDIClient.VBObject("frmPttel").Close
		else																																	
						Log.Error "Can't open pttel window.", "", pmNormal, ErrorColor
		end if
		
		'''''''''''''''''''''''''''''''''''''''''''''''''
		''''''''''''''''¶áñÍáÕáõÃÛáõÝÝ»ñ'''''''''''''''''
		
		' Լրացնել Գործողություններ դիալոգային պատուհանը
		Log.Message "Գործողություններ", "", pmNormal, DivideColor
		Call GoTo_AllocFundsOperations(folderName & "¶áñÍáÕáõÃÛáõÝÝ»ñ, ÷á÷áËáõÃÛáõÝÝ»ñ|", operations)
		
		if WaitForExecutionProgress() then		
				' ä³Ñå³Ý»É Excel
				Call SaveExcelFile(actualFile4)
				' Համեմատել Excel ֆայլերը
				Call CompareTwoExcelFiles(actualFile4, expectedFile4, resultFile4)
				' ö³Ï»É Excel ֆայլերը
				Call CloseAllExcelFiles()
		else																																	
						Log.Error "Can't open pttel window.", "", pmNormal, ErrorColor
		end if
		
		'''''''''''''''''''''''''''''''''''''''''''''''''
		'''''''''ä³ÛÙ³Ý³·ñÇ µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñ'''''''
		
		' Լրացնել Պայմանագրի բոլոր գործողություններ դիալոգային պատուհանը
		Log.Message "Պայմանագրի բոլոր գործողություններ դիալոգային պատուհանի լրացման հինգերորդ տարբերակ", "", pmNormal, DivideColor
		Call GoTo_AgreementAllOperations(folderName & "¶áñÍáÕáõÃÛáõÝÝ»ñ, ÷á÷áËáõÃÛáõÝÝ»ñ|", allOperations)
		
		if WaitForExecutionProgress() then		
				' êáñï³íáñ»É µ³óí³Í åïï»ÉÁ
				Call columnSorting(colName, 2, "frmPttel")
				' Արտահանել Excel
				Call ExportToExcel("frmPttel", actualFile5)
				' Ստուգել տողերի քանակը
				Call CheckPttel_RowCount("frmPttel", 83)
				' Համեմատել Excel ֆայլերը
				Call CompareTwoExcelFiles(actualFile5, expectedFile5, resultFile5)
				' ö³Ï»É բոլոր Excel ֆայլերը
				Call CloseAllExcelFiles()
				' ö³Ï»É åïï»ÉÁ
				BuiltIn.Delay(3000) 
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
		folderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|"
	
		sDATE = "20030101"
		fDATE = "20260101"  
		
		colName(0) = "fKEY"
		colName(1) = "fCOM"
		colName(2) = "fCURRENCY"
		colName(3) = "fDATE"
		colName(4) = "fSUID"
		
		' ²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ
		expectedFile1 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\LoansTest1\Expected\expectedFile1.txt"
		' ä³ÛÙ³Ý³·ñ»ñ
		expectedFile2 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\LoansTest1\Expected\expectedFile2.xlsx"
		' ì³ñÏ³ÛÇÝ ù³ñï»ñ
		expectedFile3 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\LoansTest1\Expected\expectedFile3.txt"
		' ¶áñÍáÕáõÃÛáõÝÝ»ñ
		expectedFile4 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\LoansTest1\Expected\expectedFile4.xlsx"
		' ä³ÛÙ³Ý³·ñÇ µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñ
		expectedFile5 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\LoansTest1\Expected\expectedFile5.xlsx"
	
  ' ²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ
		actualFile1 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\LoansTest1\Actual\actualFile1.txt"
		' ä³ÛÙ³Ý³·ñ»ñ
		actualFile2 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\LoansTest1\Actual\actualFile2.xlsx"
		' ì³ñÏ³ÛÇÝ ù³ñï»ñ
		actualFile3 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\LoansTest1\Actual\actualFile3.txt"
		' ¶áñÍáÕáõÃÛáõÝÝ»ñ
		actualFile4 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\LoansTest1\Actual\actualFile4.xlsx"
		' ä³ÛÙ³Ý³·ñÇ µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñ
		actualFile5 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\LoansTest1\Actual\actualFile5.xlsx"
		
  ' ²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ
		resultFile2 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\LoansTest1\Result\resultFile2.xlsx"
		' ¶áñÍáÕáõÃÛáõÝÝ»ñ
		resultFile4 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\LoansTest1\Result\resultFile4.xlsx"
		' ä³ÛÙ³Ý³·ñÇ µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñ
		resultFile5 = Project.Path & "Stores\Reports\Subsystems\Allocated Funds\LoansTest1\Result\resultFile5.xlsx"
		
  ' ²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ
		Set workingDocs = New_SubsystemWorkingDocuments()
		
		' ä³ÛÙ³Ý³·ñ»ñ
		Set contracts = New_ContractsFilter()
		with contracts
				.GroupExists = true
				.ShowOnlyLinearExists = true
		end with
		
		' ì³ñÏ³ÛÇÝ ù³ñï»ñ
		Set creditCards = New_CreditCards()
		with creditCards
				.agreeN = "TV22127"
				.curr = "000"
				.client = "00026342"
				.calcAcc = "02634250300"
				.clientName = "Ð³×³Ëáñ¹ 00026342"
				.office = "P00"
				.section = "08"
				.accessType = "C11"
				.showClientFeatures = 1
				.showNotes = 1
				.showAccNote = 1
		end with
		
		' ¶áñÍáÕáõÃÛáõÝÝ»ñ
		Set operations = New_AllocFundsOperations()
		with operations 
				.startDate = "01/11/17"
				.endDate = "01/02/18"
				.fill = "1"
				.creditCodeExists = true
				.clientExists = true
		end with
		
		' ä³ÛÙ³Ý³·ñÇ µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñ
		Set allOperations = New_AgreementAllOperations()
		with allOperations 
    .agreementN = "00893330101"
    .onlyChanges = 1
		end with
		
End Sub