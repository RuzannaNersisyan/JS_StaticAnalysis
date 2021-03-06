'USEUNIT  Library_Common
'USEUNIT Library_Colour
'USEUNIT OLAP_Library
'USEUNIT Card_Library
'USEUNIT Mortgage_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Contracts
'USEUNIT Constants
Option Explicit

'Test Case Id - 161579

Sub Subsystems_Registers_Reports_2()
  
    Dim sDATE,fDATE
    Dim Path1,Path2,resultWorksheet,folderName,Exists
    Dim SummaryOfContracts,Cached,SummOfOperations,onlyClosed,RepayNewsletter
    Dim SortArr(4)
     
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20030101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank_Report", sDATE, fDATE)
    Login("ARMSOFT")

    Call SaveRAM_RowsLimit("1000")
    
    'Մուտք գործել "Ենթահամակարգեր (ՀԾ)"
    Call ChangeWorkspace(c_Subsystems)   
    folderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|î»Õ³µ³ßËí³Í ³í³Ý¹Ý»ñ|" 
    
    Log.Message "folderName = Ենթահամակարգեր (ՀԾ)|Հաշվ, մատյաններ/Տեղաբաշխված միջոցներ/Տեղաբաշխված ավանդներ" ,,, DivideColor  
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''--Ենթահամակարգեր (ՀԾ)|Հաշվ, մատյաններ|Տեղաբաշխված միջոցներ|Տեղաբաշխված ավանդներ|Պայմանագրերի ամփոփում --'''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Տեղաբաշխված միջոցներ/Տեղաբաշխված ավանդներ/Պայմանագրերի ամփոփում --" ,,, DivideColor  
    
    SortArr(0) = "fKEY"
		SortArr(1) = "fAGRNAME"
		Set SummaryOfContracts = New_Deposites_SumOfContracts()
		With SummaryOfContracts
				.general.closeAgreeExists = true
				.general.repayDateExists = true
				.general.date = "01/01/20"
				.general.agreeLevel = "1"
				.general.showClosed = 1
				.general.showNotAllClosed = 1
				.general.amountsWithoutOverPart = 1
        .show.clientMainData = 1
				.show.mainDate = 1 
				.show.overlimitAmounts = 1
				.show.notes = 1
				.show.riskyInformation = 1
				.show.otherAmounts = 1 
				.show.otherDates = 1
				.show.addData = 1
				.show.writhdrawnAmounts = 1
				.show.addAmounts = 1 
		End with

    Call GoTo_DepositesSumOfCont(folderName, "ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ", SummaryOfContracts)
    Call WaitForExecutionProgress()
    Call CheckPttel_RowCount("frmPttel", 58)
    Call columnSorting(SortArr, 2, "frmPttel")
    
    Path1 = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Actual\Actual_7.xlsx"
    Path2 = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Expected\Expected_7.xlsx"
    resultWorksheet = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Result\Result_7.xlsx"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ EXCEL ý³ÛÉ»ñ
    Call ExportToExcel("frmPttel",Path1)
    Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)  
    Call CloseAllExcelFiles()
    Call Close_Pttel("frmPttel")

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''--Ենթահամակարգեր (ՀԾ)|Հաշվ, մատյաններ|Տեղաբաշխված միջոցներ|Տեղաբաշխված ավանդներ|Պայմանագրերի ամփոփում (Քեշավորված) --''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Տեղաբաշխված միջոցներ/Տեղաբաշխված ավանդներ/Պայմանագրերի ամփոփում (Քեշավորված) --" ,,, DivideColor  

		Set Cached = New_DepositesSumOfCont_Cached()
        Cached.fill = "1"

    Call GoTo_DepositesSumOfCont_Cached(folderName, "ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ (ø»ß³íáñí³Í)", Cached)
    
    Path1 = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Actual\Actual_8.xlsx"
    Path2 = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Expected\Expected_8.xlsx"
    resultWorksheet = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Result\Result_8.xlsx"
    
    'Î³ï³ñáõÙ ¿ ëïáõ·áõÙ,»Ã» ÝÙ³Ý ³ÝáõÝáí ý³ÛÉ Ï³ ïñí³Í ÃÕÃ³å³Ý³ÏáõÙ, ապա çÝçáõÙ ¿   
    Exists = aqFile.Exists(Path1)
    If Exists Then
        aqFileSystem.DeleteFile(Path1)
    End If
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ EXCEL ý³ÛÉ»ñ
    BuiltIn.Delay(3000)
    If Sys.Process("EXCEL").Exists Then
        Sys.Process("EXCEL").Window("XLMAIN", "* - Excel", 1).Window("XLDESK", "", 1).Window("EXCEL7", "*", 1).Keys("[F12]")
        Sys.Process("EXCEL").Window("#32770", "Save As", 1).Keys(Path1 & "[Enter]")
    Else 
        Log.Error "Excel does not Open!" ,,,ErrorColor
    End If
        
    Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)  
    Call CloseAllExcelFiles() 
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''--Ենթահամակարգեր (ՀԾ)|Հաշվ, մատյաններ|Տեղաբաշխված միջոցներ|Տեղաբաշխված ավանդներ|Պայմանագրերի ամփոփում (Միայն փակված) --'''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Տեղաբաշխված միջոցներ/Տեղաբաշխված ավանդներ/Պայմանագրերի ամփոփում (Միայն փակված) --" ,,, DivideColor  
    
    SortArr(0) = "fKEY"
		SortArr(1) = "fAGRNAME"
	  Set OnlyClosed = New_Deposites_SumOfContracts()
		With OnlyClosed
				.general.closeDateExists = true
				.general.agreeLevel = "1"
				.general.curr = "045"
				.general.agreePaperN = "00006649"
				.general.office = "P00"
				.general.accessType = "C21"
				.general.circulatingInfo = 0
				.general.amountsWithoutOverPart = 1
				.general.showType = "AGRTOTL"
				.general.fill = "0"
				.show.mainAmounts = 1
		End with

    Call GoTo_DepositesSumOfCont(folderName, "ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ (ØÇ³ÛÝ ÷³Ïí³Í)", OnlyClosed)
    Call WaitForExecutionProgress()
    Call CheckPttel_RowCount("frmPttel", 5)
    Call columnSorting(SortArr, 2, "frmPttel")
    
    Path1 = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Actual\Actual_9.txt"
    Path2 = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Expected\Expected_9.txt"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ xml ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    Call Compare_Files(Path2, Path1, "")
    Call Close_Pttel("frmPttel")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''-- Ենթահամակարգեր (ՀԾ)|Հաշվետվություններ,  մատյաններ|Տեղաբաշխված միջոցներ|Տեղաբաշխված ավանդներ/Գործողությունների ամփոփում --''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Տեղաբաշխված միջոցներ/Տեղաբաշխված ավանդներ/Գործողությունների ամփոփում --" ,,, DivideColor  
    
    SortArr(0) = "fKEY"
		SortArr(1) = "fAGRNAME"
    SortArr(2) = "fDATE"
    SortArr(3) = "fSUM"
    SortArr(4) = "fSPEC"
    Set SummOfOperations = New_SummaryOfOperations()

    Call GoTo_SummaryOfOperations(folderName, SummOfOperations)
    Call WaitForExecutionProgress()
    Call CheckPttel_RowCount("frmPttel", 662)
    Call columnSorting(SortArr, 5, "frmPttel")
    
    Path1 = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Actual\Actual_10.xlsx"
    Path2 = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Expected\Expected_10.xlsx"
    resultWorksheet = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Result\Result_10.xlsx"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ EXCEL ý³ÛÉ»ñ
    Call ExportToExcel("frmPttel",Path1)
    Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)  
    Call CloseAllExcelFiles()
    Call Close_Pttel("frmPttel")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''-- Ենթահամակարգեր (ՀԾ)|Հաշվետվություններ,  մատյաններ|Տեղաբաշխված միջոցներ|Տեղաբաշխված ավանդներ/Մարումների տեղեկագիր --''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Տեղաբաշխված միջոցներ/Տեղաբաշխված ավանդներ/Մարումների տեղեկագիր --" ,,, DivideColor  
    
    SortArr(0) = "fDATE"
    SortArr(1) = "fKEY"
		SortArr(2) = "fMARDATE"
    Set RepayNewsletter = New_RepaymentNewsletter()
    
    Call GoTo_RepaymentNewsletter(folderName, RepayNewsletter)
    Call WaitForExecutionProgress()
    Call CheckPttel_RowCount("frmPttel", 61)
    Call columnSorting(SortArr, 3, "frmPttel")
    
    Path1 = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Actual\Actual_11.xlsx"
    Path2 = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Expected\Expected_11.xlsx"
    resultWorksheet = Project.Path & "Stores\Reports\Subsystems\Reports Registers\Result\Result_11.xlsx"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ EXCEL ý³ÛÉ»ñ
    Call ExportToExcel("frmPttel",Path1)
    Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)  
    Call CloseAllExcelFiles()
    Call Close_Pttel("frmPttel")
    
    Call Close_AsBank() 
End Sub