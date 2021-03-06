Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT  Debit_Dept_Filter_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Colour
'USEUNIT OLAP_Library
'USEUNIT Mortgage_Library
'USEUNIT  Library_Contracts
'Test Case ID 161295

' Դեբիտորական պարտքեր ԱՇՏ-ում ֆիլտրերի ստուգում
Sub Debit_Dept_Report_2_Test()
      
      Dim fDATE, sDATE
      Dim folderDirect, stDate, eDate, agrNum, accMaskOld, accMaskNew, wUser
      Dim PttelName, status, Path1, Path2, resultWorksheet
      Dim wCur, dealType, wNote, wNote2, wNote3, acsBranch, acsDepart, asType, dState, dUser, dAcsBranch, dAcsDepart
      Dim SortArr(5)
      
      fDATE = "20220101"
      sDATE = "20030101"
      Call Initialize_AsBank("bank_Report", sDATE, fDATE)
      
      ' Մուտք գործել համակարգ ARMSOFT օգտագործողով 
      Call Create_Connection()
      Login("ARMSOFT")
      
      ' Մուտք Տոկոսների հաշվարկման ԱՇՏ
      Call ChangeWorkspace(c_BillReceivables)
      
      ' Դրույթներից, Տնտեսել հիշողոթյունը սկսած (Տողերի քանակ) դաշտի արժեքի փոփոխում
      Call  SaveRAM_RowsLimit("10")
      
       '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       Log.Message "--- Հաշիվների խմբագրումներ թղթապանակ -1---" ,,, DivideColor 
       ' Բացել և լրացնել Հաշիվների խմբագրումներ ֆիլտրը
       folderDirect = "|¸»µÇïáñ³Ï³Ý å³ñïù»ñ|¶áñÍáÕáõÃÛáõÝÝ»ñ, ÷á÷áËáõÃÛáõÝÝ»ñ|Ð³ßÇíÝ»ñÇ ËÙµ³·ñáõÙÝ»ñ"
       stDate = ""
       eDate = ""
       agrNum = ""
       accMaskOld = ""
       accMaskNew = ""
       wUser = ""
       Call EditAccFromDebitDebt(folderDirect, stDate, eDate, agrNum, accMaskOld, accMaskNew, wUser)

      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Հաշիվների խմբագրումներ թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 226)
      
            ' Դասավորել ըստ ամսաթիվ, Պայմանագրի N, Անվանում սյուների
            SortArr(0) = "fAGRNUM"
            SortArr(1) = "fDATE"
            SortArr(2) = "fCOM"
            SortArr(3) = "ACCNEW"
            Call FastColumnSorting(SortArr, 4, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_2\Actual\Edit_AccAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_2\Expected\Edit_AccExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Debit Dept\Report_2\Result\Edit_AccRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Հաշիվների խմբագրումներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Հաշիվների խմբագրումներ թղթապանակը չի բացվել")
      End If
      
       '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       ' Բացել և լրացնել Հաշիվների խմբագրումներ ֆիլտրը
       Log.Message "--- Հաշիվների խմբագրումներ թղթապանակ -2---" ,,, DivideColor 
       stDate = "170212"
       agrNum = "9040022"
       accMaskOld = "9450726000"
       accMaskNew = "19400134400"
       wUser = "11"
       Call EditAccFromDebitDebt(folderDirect, stDate, stDate, agrNum, accMaskOld, accMaskNew, wUser)
                                  
      ' Ստուգում է Հաշիվների խմբագրումներ թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
       If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 1)
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_2\Actual\Edit_AccAct_2.txt"
      
            ' Արտահանել excel ֆայլ
            Call ExportToTXTFromPttel(PttelName,Path1)

            ' Համեմատել երկու txt  ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_2\Expected\Edit_AccExp_2.txt"
            Call Compare_Files(Path2, Path1, "")
      
            ' Փակել Հաշիվների խմբագրումներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Հաշիվների խմբագրումներ թղթապանակը չի բացվել")
      End If
       '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       Log.Message "--- Հաշիվների խմբագրումներ թղթապանակ -3---" ,,, DivideColor 
       ' Բացել և լրացնել Հաշիվների խմբագրումներ ֆիլտրը
       stDate = "160312"
       agrNum = "13920090258"
       accMaskOld = "18400055000"
       accMaskNew = "15350032700"
       wUser = "11"
       Call EditAccFromDebitDebt(folderDirect, stDate, stDate, agrNum, accMaskOld, accMaskNew, wUser)
       
        ' Ստուգում է Հաշիվների խմբագրումներ  թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
          ' Համեմատել պտտելի տողերի քանակը
          Call CheckPttel_RowCount("frmPttel", 0)
          BuiltIn.Delay(1000)
          ' Փակել Պտտելը  
          Call Close_Pttel("frmPttel")
      Else
            Log.Error("Հաշիվների խմբագրումներ  թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Հաշվեկշռային ձևակերպումներ թղթապանակ -1---" ,,, DivideColor 
       ' Բացել և լրացնել Հաշվեկշռային ձևակերպումներ ֆիլտրը
       folderDirect = "|¸»µÇïáñ³Ï³Ý å³ñïù»ñ|¶áñÍáÕáõÃÛáõÝÝ»ñ, ÷á÷áËáõÃÛáõÝÝ»ñ|Ð³ßí»Ïßé³ÛÇÝ Ó¨³Ï»ñåáõÙÝ»ñ"
       stDate = ""
       eDate = ""
       agrNum = ""
       wCur = ""
       dealType = ""
       wUser = ""
       wNote = ""
       wNote2 = ""
       wNote3 = ""
       acsBranch = "" 
       acsDepart = ""
       asType = ""
       Call BalanceSheetFormulation(folderDirect, stDate, eDate, agrNum, wCur, dealType, wUser, wNote, wNote2, wNote3, acsBranch, acsDepart, asType)

      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Հաշվեկշռային ձևակերպումներ թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 7901)
      
            ' ' Դասավորել ըստ ամսաթիվ, Անվանում, Հ/Պ դեբետ, Գումար, Հ/Պ կրեդիտ սյուների
            SortArr(0) = "fDATE"
            SortArr(1) = "fKEY"
            SortArr(2) = "fCOM"
            SortArr(3) = "ACCCR"
            SortArr(4) = "BALDB"
            Call columnSorting(SortArr, 5, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_2\Actual\BalanceSheetAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_2\Expected\BalanceSheetExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Debit Dept\Report_2\Result\BalanceSheetRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Հաշվեկշռային ձևակերպումներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Հաշվեկշռային ձևակերպումներ թղթապանակը չի բացվել")
      End If
      
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Հաշվեկշռային ձևակերպումներ թղթապանակ -2---" ,,, DivideColor 
       ' Բացել և լրացնել Հաշվեկշռային ձևակերպումներ ֆիլտրը
       stDate = "010111"
       eDate = "010116"
       agrNum = ""
       wCur = "000"
       dealType = "21"
       wUser = "11"
       wNote = ""
       wNote2 = ""
       wNote3 = ""
       acsBranch = "P00" 
       acsDepart = "02"
       asType = "BR1"
       Call BalanceSheetFormulation(folderDirect, stDate, eDate, agrNum, wCur, dealType, wUser, wNote, wNote2, wNote3, acsBranch, acsDepart, asType)

      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Հաշվեկշռային ձևակերպումներ թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 40)
      
            ' Դասավորել ըստ ամսաթիվ, Անվանում, Հ/Պ դեբետ, Գումար, Հ/Պ կրեդիտ սյուների
            SortArr(0) = "fDATE"
            SortArr(1) = "ACCCR"
            SortArr(2) = "fCOM"
            SortArr(3) = "BALDB"
            SortArr(4) = "BALCR"
            Call FastColumnSorting(SortArr, 5, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_2\Actual\BalanceSheetAct_2.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_2\Expected\BalanceSheetExp_2.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Debit Dept\Report_2\Result\BalanceSheetRes_2.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Հաշվեկշռային ձևակերպումներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Հաշվեկշռային ձևակերպումներ թղթապանակը չի բացվել")
      End If
      
       '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       Log.Message "--- Ետհաշվեկշռային ձևակերպումներ թղթապանակ -1---" ,,, DivideColor 
       ' Բացել և լրացնել Ետհաշվեկշռային ձևակերպումներ ֆիլտրը
       folderDirect = "|¸»µÇïáñ³Ï³Ý å³ñïù»ñ|¶áñÍáÕáõÃÛáõÝÝ»ñ, ÷á÷áËáõÃÛáõÝÝ»ñ|ºïÑ³ßí»Ïßé³ÛÇÝ Ó¨³Ï»ñåáõÙÝ»ñ"
       stDate = ""
       eDate = ""
       agrNum = ""
       wCur = ""
       dealType = ""
       wUser = ""
       wNote = ""
       wNote2 = ""
       wNote3 = ""
       acsBranch = "" 
       acsDepart = ""
       asType = ""
       Call BalanceSheetFormulation(folderDirect, stDate, eDate, agrNum, wCur, dealType, wUser, wNote, wNote2, wNote3, acsBranch, acsDepart, asType)
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Ետհաշվեկշռային ձևակերպումներ թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 64)
      
            ' Դասավորել ըստ ամսաթիվ, Պայմանագրի N,  Մուտքային արժ. սյուների
            SortArr(0) = "fNUMAGR"
            SortArr(1) = "fDATE"
            SortArr(2) = "fCURSUMIN"
            Call FastColumnSorting(SortArr, 3, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_2\Actual\BackBalanceSheetAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_2\Expected\BackBalanceSheetExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Debit Dept\Report_2\Result\BackBalanceSheetRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Ետհաշվեկշռային ձևակերպումներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Ետհաշվեկշռային ձևակերպումներ թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       Log.Message "--- Ետհաշվեկշռային ձևակերպումներ թղթապանակ -2---" ,,, DivideColor 
       ' Բացել և լրացնել Ետհաշվեկշռային ձևակերպումներ ֆիլտրը
       stDate = "300813"
       eDate = "311213"
       agrNum = "19330003100"
       wCur = "000"
       dealType = "21"
       wUser = "11"
       acsBranch = "P00" 
       acsDepart = "02"
       asType = "BR1"
       Call BalanceSheetFormulation(folderDirect, stDate, eDate, agrNum, wCur, dealType, wUser, wNote, wNote2, wNote3, acsBranch, acsDepart, asType)

      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Ետհաշվեկշռային ձևակերպումներ թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 3)
      
            ' Դասավորել ըստ ամսաթիվ սյան
            SortArr(0) = "fDATE"
            Call FastColumnSorting(SortArr, 1, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_2\Actual\BackBalanceSheetAct_2.txt"
      
            ' Արտահանել txt ֆայլ
            Call ExportToTXTFromPttel(PttelName,Path1)

            ' Համեմատել երկու txt ֆայլերը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_2\Expected\BackBalanceSheetExp_2.txt"
            Call Compare_Files(Path2, Path1, "")
      
            ' Փակել Ետհաշվեկշռային ձևակերպումներ թղթապանակը
            Call Close_Pttel(PttelName)
      
      Else
            Log.Error("Ետհաշվեկշռային ձևակերպումներ թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Պայմանագրերի դաշտերի փոփոխման հայտեր թղթապանակ -1---" ,,, DivideColor 
       ' Բացել և լրացնել "Պայմանագրերի դաշտերի փոփոխման հայտեր"  ֆիլտրը
       folderDirect = "|¸»µÇïáñ³Ï³Ý å³ñïù»ñ|ä³ÛÙ³Ý³·ñ»ñÇ ¹³ßï»ñÇ ÷á÷áËÙ³Ý Ñ³Ûï»ñ"
       dState = ""
       stDate = ""
       eDate = ""
       dUser = ""
       dAcsBranch = ""
       dAcsDepart = ""
       Call OpenChangeRequestContractFieldsDoc(folderDirect, dState, stDate, eDate, dUser, dAcsBranch, dAcsDepart)
       
      ' Ստուգում է "Պայմանագրերի դաշտերի փոփոխման հայտեր" թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 2)
      
            ' Դասավորել ըստ NN սյան
            SortArr(0) = "fDCRID"
            Call FastColumnSorting(SortArr, 1, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_2\Actual\ChangeRequestAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_2\Expected\ChangeRequestExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Debit Dept\Report_2\Result\ChangeRequestRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել "Պայմանագրերի դաշտերի փոփոխման հայտեր" թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error(" 'Պայմանագրերի դաշտերի փոփոխման հայտեր ' թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Պայմանագրերի դաշտերի փոփոխման հայտեր թղթապանակ -2---" ,,, DivideColor 
       ' Բացել և լրացնել "Պայմանագրերի դաշտերի փոփոխման հայտեր"  ֆիլտրը
       dState = "10"
       stDate = "270617"
       eDate = "270617"
       dUser = "253"
       dAcsBranch = "P00"
       dAcsDepart = "02"
       Call OpenChangeRequestContractFieldsDoc(folderDirect, dState, stDate, eDate, dUser, dAcsBranch, dAcsDepart)
                                  
      ' Ստուգում է "Պայմանագրերի դաշտերի փոփոխման հայտեր" թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 2)
      
            ' Դասավորել ըստ NN սյան
            Call FastColumnSorting(SortArr, 1, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_2\Actual\ChangeRequestAct_2.txt"
      
            ' Արտահանել txt ֆայլ
            Call ExportToTXTFromPttel(PttelName,Path1)

            ' Համեմատել երկու txt ֆայլերը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_2\Expected\ChangeRequestExp_2.txt"
            Call Compare_Files(Path2, Path1, "")
      
            ' Փակել "Պայմանագրերի դաշտերի փոփոխման հայտեր" թղթապանակը
            Call Close_Pttel(PttelName)
      
      Else
            Log.Error(" 'Պայմանագրերի դաշտերի փոփոխման հայտեր ' թղթապանակը չի բացվել")
      End If
      
      Call Close_AsBank()
End Sub