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
'USEUNIT  DAHK_Library_Filter
'Test Case ID 161573

' ԴԱՀԿ հաղ. մշակման ԱՇՏ-ում Հաշիվներ ֆիլտրի ստուգում -1
Sub DAHK_Report_1_Test()
      
      Dim fDATE, sDATE
      Dim folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
               oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
               acsBranch, acsDepart, acsType, selectView, exportExcel, exists
      Dim PttelName, status, Path1, Path2, resultWorksheet, sentMess, filterName
      Dim  folderName, stDate, eDate, messType, inqNumber, inquestId, messId, cliCode, _
               passTax, wSSN, wName, wAddress, wProcess, wDuplicate, relMess, onlyNotBlock
      Dim SortArr(1)
      
      fDATE = "20220101"
      sDATE = "20030101"
      Call Initialize_AsBank("bank_Report", sDATE, fDATE)
      
      ' Մուտք գործել համակարգ ARMSOFT օգտագործողով 
      Call Create_Connection()
      Login("ARMSOFT")
      
      ' Մուտք ԴԱՀԿ հաղ. մշակման ԱՇՏ
      Call ChangeWorkspace(c_DAHK)
      
      ' Դրույթներից, Տնտեսել հիշողոթյունը սկսած (Տողերի քանակ) դաշտի արժեքի փոփոխում
      Call  SaveRAM_RowsLimit("10")
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Հաշիվներ - 1 ---" ,,, DivideColor 
      ' Բացել Հաշիվներ թղթապանակը 
      folderDirect = "|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|Ð³ßÇíÝ»ñ"
      accChartNum = "1" 
      balAcc = ""
      accMAsk = ""
      accCur = ""
      accType = "20"
      accName = ""
      clName = ""
      clCode = ""
      incExp = ""
      showLimits = 0
      oldAccMask = ""
      newAccMask = ""
      accNote = ""
      accNote2 = ""
      accNote3 = ""
      cashAcc = 0
      showCli = 0
      showOthInfo = 0
      opDate = ""
      endOpDAte = ""
      acsBranch = ""
      acsDepart = ""
      acsType = ""
      selectView = "ACCS"
      exportExcel = "0"
      Call OpenAccauntsFolder(folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
                                               oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
                                               acsBranch, acsDepart, acsType, selectView, exportExcel )
                                               
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Հաշիվներ թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 26326)
      
            ' Դասավորել ըստ Հաշիվ սյան
            SortArr(0) = "ACC"
            Call columnSorting(SortArr, 1, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\DAHK\Report_1\Actual\AccountsAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\DAHK\Report_1\Expected\AccountsExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\DAHK\Report_1\Result\AccountsRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Հաշիվներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Հաշիվներ թղթապանակը չի բացվել")
      End If
      
        '-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        Log.Message "--- Հաշիվներ - 2 ---" ,,, DivideColor 
      ' Բացել Հաշիվներ թղթապանակը 
      accChartNum = "1" 
      balAcc = "988888"
      accMAsk = "9609453"
      accCur = "000"
      accType = "90"
      accName = "Ð³ßÇí 9609453"
      clName = ""
      clCode = ""
      incExp = "6.01.2"
      showLimits = 1
      oldAccMask = "96?945"
      newAccMask = ""
      accNote = ""
      accNote2 = "555"
      accNote3 = ""
      cashAcc = 0
      showCli = 1
      showOthInfo = 1
      opDate = "311295"
      endOpDAte = "150114"
      acsBranch = "P00"
      acsDepart = "061"
      acsType = "901"
      Call OpenAccauntsFolder(folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
                                               oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
                                               acsBranch, acsDepart, acsType, selectView, exportExcel )
                                               
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Հաշիվներ թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 1)
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\DAHK\Report_1\Actual\AccountsAct_2.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\DAHK\Report_1\Expected\AccountsExp_2.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\DAHK\Report_1\Result\AccountsRes_2.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Հաշիվներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Հաշիվներ թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Դասավորել ըստ հաշիվներ սյան ---" ,,, DivideColor 
      ' Բացել Հաշիվներ թղթապանակը 
      accChartNum = "3" 
      balAcc = "777777"
      accMAsk = ""
      accCur = "000"
      accType = "03"
      accName = ""
      clName = ""
      clCode = ""
      incExp = ""
      showLimits = 0
      oldAccMask = ""
      newAccMask = ""
      accNote = ""
      accNote2 = ""
      accNote3 = ""
      cashAcc = 0
      showCli = 1
      showOthInfo = 1
      opDate = "200407"
      endOpDAte = ""
      acsBranch = "P00"
      acsDepart = "061"
      acsType = "031"
      Call OpenAccauntsFolder(folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
                                               oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
                                               acsBranch, acsDepart, acsType, selectView, exportExcel )
                                               
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Հաշիվներ թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
       If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 518)
      
            ' Դասավորել ըստ  Հաշիվ սյան
            Call FastColumnSorting(SortArr, 1, "frmPttel")
      
            ' Ստեղծել ֆիլտր
            filterName = "¸³ë³íáñ»É Áëï Ð³ßÇí ëÛ³Ý"
            Call CreateFilterForSort(filterName)
            
            ' Փակել Հաշիվներ թղթապանակը
            BuiltIn.Delay(5000)
            Call Close_Pttel(PttelName)
            BuiltIn.Delay(1000)
      
      Else
            Log.Error("Հաշիվներ թղթապանակը չի բացվել")
      End If

      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       Log.Message "--- Հաշիվներ - 3 ---" ,,, DivideColor 
      ' Բացել Հաշիվներ թղթապանակը 
      accChartNum = "3" 
      balAcc = "777777"
      accMAsk = ""
      accCur = "000"
      accType = "03"
      accName = ""
      clName = ""
      clCode = ""
      incExp = ""
      showLimits = 0
      oldAccMask = ""
      newAccMask = ""
      accNote = ""
      accNote2 = ""
      accNote3 = ""
      cashAcc = 0
      showCli = 1
      showOthInfo = 1
      opDate = "200407"
      endOpDAte = ""
      acsBranch = "P00"
      acsDepart = "061"
      acsType = "031"
      Call OpenAccauntsFolder(folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
                                               oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
                                               acsBranch, acsDepart, acsType, selectView, exportExcel )
                                               
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Հաշիվներ թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 518)
      
            ' Դասավորել ըստ Հաշիվ սյան
            Call wMainForm.MainMenu.Click(c_Views)
            Call wMainForm.PopupMenu.Click("Դասավորել ըստ Հաշիվ սյան")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\DAHK\Report_1\Actual\AccountsAct_3.xlsx"
            
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\DAHK\Report_1\Expected\AccountsExp_3.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\DAHK\Report_1\Result\AccountsRes_3.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Հաշիվներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
            BuiltIn.Delay(4000)
      
      Else
            Log.Error("Հաշիվներ թղթապանակը չի բացվել")
      End If
      
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Հաշիվներ - 4 ---" ,,, DivideColor 
      ' Բացել Հաշիվներ թղթապանակը 
      accChartNum = "2" 
      balAcc = "999999"
      accMAsk = ""
      accCur = ""
      accType = "01"
      accName = ""
      clName = "Ð³×³Ëáñ¹ 00016313"
      clCode = "00016313"
      incExp = ""
      showLimits = 0
      oldAccMask = ""
      newAccMask = ""
      accNote = ""
      accNote2 = ""
      accNote3 = ""
      cashAcc = 0
      showCli = 1
      showOthInfo = 1
      opDate = "270412"
      endOpDAte = ""
      acsBranch = "P04"
      acsDepart = "03"
      acsType = "01"
      selectView = "ACCS\1"
      exportExcel = "1"
      Call OpenAccauntsFolder(folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
                                               oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
                                               acsBranch, acsDepart, acsType, selectView, exportExcel )
                               
      ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
      Path1 = Project.Path & "Stores\Reports\DAHK\Report_1\Actual\AccountsAct_4.xlsx"
      Path2 = Project.Path &  "Stores\Reports\DAHK\Report_1\Expected\AccountsExp_4.xlsx"
      resultWorksheet = Project.Path &  "Stores\Reports\DAHK\Report_1\Result\AccountsRes_4.xlsx"                

       exists = aqFile.Exists(Path1)
      If exists Then
          aqFileSystem.DeleteFile(Path1)
      End If
      
      ' Արտահանել և Համեմատել EXCEL ֆայլերը
      BuiltIn.Delay(3000)
      
      If Sys.Process("EXCEL").Exists Then
      
          Sys.Process("EXCEL").Window("XLMAIN", "* - Excel", 1).Window("XLDESK", "", 1).Window("EXCEL7", "*", 1).Keys("[F12]")
          Sys.Process("EXCEL").Window("#32770", "Save As", 1).Keys(Path1 & "[Enter]")
          
      Else 
          Log.Error "Excel does not Open!" ,,,ErrorColor
      End If 
      
      ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
      Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet) 
       
      ' Փակել բոլոր excel ֆայլերը
      Call CloseAllExcelFiles()
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Ընդունված հաղորդագրություններ - 1 ---" ,,, DivideColor 
      ' Բացել Ընդունված հաղորդագրություններ թղթապանակը 
      folderDirect = "|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|ÀÝ¹áõÝí³Í Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ"
      folderName = "Ընդունված հաղորդագրություններ "
      stDate = "010103"
      eDate = "010122"
      messType = ""
      inqNumber = ""
      inquestId = ""
      messId = ""
      cliCode = ""
      passTax = ""
      wSSN = ""
      wName = ""
      wAddress = ""
      wProcess = 1
      wDuplicate = 1
      relMess = 1
      Call OpenReceivedMessagesFolder(folderDirect, folderName, stDate, eDate, messType, inqNumber, inquestId, messId, cliCode, _
                                             passTax, wSSN, wName, wAddress, wProcess, wDuplicate, relMess, onlyNotBlock)
                                               
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Ընդունված հաղորդագրություններ թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 40)
      
            ' Դասավորել ըստ հաղորդագրության համար սյան
            SortArr(0) = "fMESSAGEID"
            Call FastColumnSorting(SortArr, 1, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\DAHK\Report_1\Actual\ReceivedMessAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\DAHK\Report_1\Expected\ReceivedMessExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\DAHK\Report_1\Result\ReceivedMessRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Ընդունված հաղորդագրություններ թղթապանակը
            BuiltIn.Delay(4000)
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Ընդունված հաղորդագրություններ թղթապանակը չի բացվել")
      End If
      
       '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       Log.Message "--- Ընդունված հաղորդագրություններ - 2 ---" ,,, DivideColor 
      ' Բացել Ընդունված հաղորդագրություններ թղթապանակը 
      stDate = "220115"
      eDate = "220115"
      messType = "01"
      inqNumber = "01/04-02056/10"
      inquestId = "00013046"
      messId = "º01000113259"
      cliCode = "00032224"
      passTax = "A?03211??"
      wSSN = ""
      wName = "²ñ³Ù ØËÇÃ³ñÛ³Ý è³½ÙÇÏÇ"
      wAddress = "ù.ºñ¨³Ý, ²ñ³µÏÇñ, ºñ½ÝÏÛ³Ý 39ï"
      wProcess = 1
      wDuplicate = 1
      relMess = 1
      Call OpenReceivedMessagesFolder(folderDirect, folderName, stDate, eDate, messType, inqNumber, inquestId, messId, cliCode, _
                                             passTax, wSSN, wName, wAddress, wProcess, wDuplicate, relMess, onlyNotBlock)
                                               
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Ընդունված հաղորդագրություններ թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 1)
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\DAHK\Report_1\Actual\ReceivedMessAct_2.txt"
      
            ' Արտահանել txt ֆայլ
            Call ExportToTXTFromPttel(PttelName,Path1)

            ' Համեմատել երկու txt ֆայլերը
            Path2 = Project.Path &  "Stores\Reports\DAHK\Report_1\Expected\ReceivedMessExp_2.txt"
            Call Compare_Files(Path2, Path1, "")
      
            ' Փակել Ընդունված հաղորդագրություններ թղթապանակը
            BuiltIn.Delay(4000)
            Call Close_Pttel(PttelName)
      
      Else
            Log.Error("Ընդունված հաղորդագրություններ թղթապանակը չի բացվել")
      End If
      
       '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       Log.Message "--- խմբագրվող հաղորդագրություններ - 1 ---" ,,, DivideColor 
      ' Բացել խմբագրվող հաղորդագրություններ թղթապանակը 
      folderDirect = "|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|ÊÙµ³·ñíáÕ"
      folderName = "Խմբագրվող հաղորդագրություններ"
      stDate = "050615"
      eDate = "050615"
      messType = "04"
      inqNumber = "07/01-04012/10"
      inquestId = ""
      Call OpenEditableMessFolder(folderDirect, folderName, stDate, eDate, messType, inqNumber, inquestId, sentMess, passTax )
                                  
      ' Ստուգում է խմբագրվող հաղորդագրություններ թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 1)
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\DAHK\Report_1\Actual\EditableMessAct_1.txt"
      
            ' Արտահանել txt ֆայլ
            Call ExportToTXTFromPttel(PttelName,Path1)

            ' Համեմատել երկու txt ֆայլերը
            Path2 = Project.Path &  "Stores\Reports\DAHK\Report_1\Expected\EditableMessExp_1.txt"
            Call Compare_Files(Path2, Path1, "")
      
            ' Փակել խմբագրվող հաղորդագրություններ թղթապանակը
            BuiltIn.Delay(4000)
            Call Close_Pttel(PttelName)
      
      Else
            Log.Error("Ստուգում 2 ՝ խմբագրվող հաղորդագրություններ թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- խմբագրվող հաղորդագրություններ - 2 ---" ,,, DivideColor 
      ' Բացել խմբագրվող հաղորդագրություններ թղթապանակը 
      folderDirect = "|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|ÊÙµ³·ñíáÕ"
      folderName = "Խմբագրվող հաղորդագրություններ"
      stDate = "050615"
      eDate = "050615"
      messType = "05"
      inqNumber = "07/01-04012/10"
      Call OpenEditableMessFolder(folderDirect, folderName, stDate, eDate, messType, inqNumber, inquestId, sentMess, passTax )
                                  
      ' Ստուգում է խմբագրվող հաղորդագրություններ թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
          ' Համեմատել պտտելի տողերի քանակը
          Call CheckPttel_RowCount("frmPttel", 0)
          BuiltIn.Delay(3000)
          ' Փակել Պտտելը  
          Call Close_Pttel("frmPttel")
      Else
            Log.Error("խմբագրվող հաղորդագրություններ թղթապանակը չի բացվել")
      End If
      
      Call Close_AsBank()
End Sub