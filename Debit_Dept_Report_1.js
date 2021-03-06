Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT  Debit_Dept_Filter_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT OLAP_Library
'USEUNIT Mortgage_Library
'USEUNIT  Library_Contracts
'USEUNIT Library_Colour
'USEUNIT Deposit_Contract_Library
'Test Case ID 161278

' Դեբիտորական պարտքեր ԱՇՏ-ում ֆիլտրերի ստուգում
Sub Debit_Dept_Report_1_Test()
      
      Dim fDATE, sDATE
      Dim folderDirect, wLevel, eDate, accBal, wAcc, pprCode, agrAccType, wCur, defaultCur, wClient, wName, wNote, wNote2, _
               wNote3, acsBranch, acsDepart, ascType, clientInfo, showInfo, showOutSum, showNotes, showAcc, wClose, notFullClose
      Dim filterName, stDate, wAgr, FilterLibWin, i
        
      Dim folderName, WorkingDocuments
      Dim PttelName, status, Path1, Path2, resultWorksheet
      Dim SortArr(4)
      
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
      Log.Message "--- Աշխատանքային փաստաթղթեր թղթապանակ -1---" ,,, DivideColor 
      Set WorkingDocuments = New_SubsystemWorkingDocuments()
      
      With WorkingDocuments
          .startDate = "310313"
          .endDate = "270317"
          .approvalGroup = ""
          .states = ""
          .agreeOpers = ""
          .agreeN = ""
          .agreePaperN = ""
          .curr = ""
          .client = ""
          .clientName = ""
          .note = ""
          .note2 = ""
          .note3 = ""
          .performers = ""
          .office = ""
          .section = ""
          .accessType = ""
      End With
      
      ' Աշխատանքային փաստաթղթեր ֆիլտրի բացում և տվյալների լրացում
      folderName = "|¸»µÇïáñ³Ï³Ý å³ñïù»ñ|"
      Call GoTo_SubsystemWorkingDocuments(folderName, WorkingDocuments)
      
      ' Ստուգում է Աշխատանքային փաստաթղթեր թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForPttel(PttelName) 
      
      If  status Then

            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 5)
      
            ' Դասավորել ըստ պայմանագրերի համարի
            SortArr(0) = "CODE"
            Call FastColumnSorting(SortArr, 1, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_1\Actual\WorkingDocAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_1\Expected\WorkingDocExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Debit Dept\Report_1\Result\WorkingDocRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Աշխատանքային փաստաթղթեր  թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Ստուգում 1 ՝ Աշխատանքային փաստաթղթեր թղթապանակը չի բացվել")
      End If
            
       '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Աշխատանքային փաստաթղթեր թղթապանակ -2 ---" ,,, DivideColor 
      Set WorkingDocuments = New_SubsystemWorkingDocuments()
      
      With WorkingDocuments
          .startDate = "310313"
          .endDate = "310313"
          .approvalGroup = "CR"
          .states = ""
          .agreeOpers = ""
          .agreeN = "10200060200"
          .agreePaperN = "10200060200"
          .curr = "000"
          .client = "00026343"
          .clientName = "§¼³ñ·³óÙ³Ý Ð³ÛÏ³Ï³Ý µ³ÝÏ¦ ´´À"
          .note = ""
          .note2 = ""
          .note3 = ""
          .performers = "253"
          .office = "P00"
          .section = "08"
          .accessType = "BR1"
      End With
      
      ' Աշխատանքային փաստաթղթեր ֆիլտրի բացում և տվյալների լրացում
      folderName = "|¸»µÇïáñ³Ï³Ý å³ñïù»ñ|"
      Call GoTo_SubsystemWorkingDocuments(folderName, WorkingDocuments)
      
      ' Ստուգում է Աշխատանքային փաստաթղթեր թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then

            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 1)
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_1\Actual\WorkingDocAct_2.txt"
      
            ' Արտահանել txt ֆայլ
            Call ExportToTXTFromPttel(PttelName,Path1)

            ' Համեմատել երկու txt ֆայլերը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_1\Expected\WorkingDocExp_2.txt"
            Call Compare_Files(Path2, Path1, "")
      BuiltIn.Delay(2000)
      Call Close_Pttel("frmPttel")

      Else
            Log.Error("Ստուգում 2 ՝ Աշխատանքային փաստաթղթեր թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Պայմանագրեր թղթապանակի համար ֆիլտրի ստեղծում ---" ,,, DivideColor 
       ' Բացել և լրացնել Պայմանագրեր ֆիլտրը
       folderDirect = "|¸»µÇïáñ³Ï³Ý å³ñïù»ñ|ä³ÛÙ³Ý³·ñ»ñ"
       folderName = "Պայմանագրեր "
       wLevel = "1"
       eDate = ""
       accBal = ""
       wAcc = ""
       pprCode = ""
       agrAccType = ""
       wCur = ""
       defaultCur = ""
       wClient = ""
       wName = ""
       wNote = ""
       wNote2 = ""
       wNote3 = ""
       acsBranch = ""
       acsDepart = ""
       ascType = ""
       clientInfo = 1
       showInfo = 1
       showOutSum = 1
       showNotes = 1
       showAcc = 1
       wClose = 1
       notFullClose = 1
       Call DebitDeptContractsFilter(folderDirect, folderName, wLevel, eDate, accBal, wAcc, pprCode, agrAccType, wCur, defaultCur, wClient, wName, wNote, wNote2, _
                                                     wNote3, acsBranch, acsDepart, ascType, clientInfo, showInfo, showOutSum, showNotes, showAcc, wClose, notFullClose )
                         
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Պայմանագրեր  թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 870)
      
            ' Դասավորել ըստ պայմանագրերի համարի
            SortArr(0) = "fCODE"
            Call columnSorting(SortArr, 1, "frmPttel")
      
            ' Ստեղծել ֆիլտր
            filterName = "¸³ë³íáñ»É Áëï Ð³ßÇí ëÛ³Ý"
            Call CreateFilterForSort(filterName)
            
            ' Փակել Պայմանագրեր թղթապանակը
            BuiltIn.Delay(5000)
            Call Close_Pttel(PttelName)
            BuiltIn.Delay(2000)
      
      Else
            Log.Error("Պայմանագրեր թղթապանակը չի բացվել")
      End If
      
       '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       Log.Message "--- Պայմանագրեր թղթապանակ -1 ---" ,,, DivideColor 
       ' Բացել և լրացնել Պայմանագրեր ֆիլտրը
       folderDirect = "|¸»µÇïáñ³Ï³Ý å³ñïù»ñ|ä³ÛÙ³Ý³·ñ»ñ"
       folderName = "Պայմանագրեր "
       wLevel = "1"
       eDate = ""
       accBal = ""
       wAcc = ""
       pprCode = ""
       agrAccType = ""
       wCur = ""
       defaultCur = ""
       wClient = ""
       wName = ""
       wNote = ""
       wNote2 = ""
       wNote3 = ""
       acsBranch = ""
       acsDepart = ""
       ascType = ""
       clientInfo = 1
       showInfo = 1
       showOutSum = 1
       showNotes = 1
       showAcc = 1
       wClose = 1
       notFullClose = 1
       Call DebitDeptContractsFilter(folderDirect, folderName, wLevel, eDate, accBal, wAcc, pprCode, agrAccType, wCur, defaultCur, wClient, wName, wNote, wNote2, _
                                                     wNote3, acsBranch, acsDepart, ascType, clientInfo, showInfo, showOutSum, showNotes, showAcc, wClose, notFullClose )
                         
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Պայմանագրեր  թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 870)

            ' Դասավորել ըստ Հաշիվ սյան
            Call wMainForm.MainMenu.Click(c_Views)
            Call wMainForm.PopupMenu.Click("Դասավորել ըստ Հաշիվ սյան")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_1\Actual\ContractsAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_1\Expected\ContractsExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Debit Dept\Report_1\Result\ContractsRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Պայմանագրեր թղթապանակը
            BuiltIn.Delay(4000)
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
            BuiltIn.Delay(4000)
      
      Else
            Log.Error("Պայմանագրեր թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Պայմանագրեր թղթապանակ -2 ---" ,,, DivideColor 
       ' Բացել և լրացնել Պայմանագրեր ֆիլտրը
       accBal = "1912000"
       wAcc = ""
       pprCode = ""
       wCur = "000"
       defaultCur = "000"
       wClient = "00007899"
       wName = "Ð³×³Ëáñ¹ 00007899"
       clientInfo = 0
       showInfo = 0
       showOutSum = 1
       showNotes = 1
       showAcc = 1
       wClose = 1
       notFullClose = 0
       Call DebitDeptContractsFilter(folderDirect, folderName, wLevel, eDate, accBal, wAcc, pprCode, agrAccType, wCur, defaultCur, wClient, wName, wNote, wNote2, _
                                                     wNote3, acsBranch, acsDepart, ascType, clientInfo, showInfo, showOutSum, showNotes, showAcc, wClose, notFullClose )
                         
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Պայմանագրեր  թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 9)
      
            ' Դասավորել ըստ պայմանագրերի համարի
            SortArr(0) = "fCODE"
            Call FastColumnSorting(SortArr, 1, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_1\Actual\ContractsAct_2.txt"
      
            ' Արտահանել txt ֆայլ
            Call ExportToTXTFromPttel(PttelName,Path1)

            ' Համեմատել երկու txt ֆայլերը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_1\Expected\ContractsExp_2.txt"
            Call Compare_Files(Path2, Path1, "")
      
            BuiltIn.Delay(4000)
            Call Close_Pttel("frmPttel")
      
      Else 
            Log.Error("Պայմանագրեր թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Գործողություններ թղթապանակ -1 ---" ,,, DivideColor 
       ' Բացել և լրացնել Գործողություններ ֆիլտրը
       folderDirect = "|¸»µÇïáñ³Ï³Ý å³ñïù»ñ|¶áñÍáÕáõÃÛáõÝÝ»ñ, ÷á÷áËáõÃÛáõÝÝ»ñ|¶áñÍáÕáõÃÛáõÝÝ»ñ"
       stDate = ""
       eDate = ""
       wAgr = ""
       pprCode = ""
       wClient = ""
       wName = ""
       acsBranch = ""
       acsDepart = ""
       ascType = ""
       Call OpenViewActionFilterFromDebitDept(folderDirect, stDate, eDate, wAgr, pprCode, wClient, wName, acsBranch, acsDepart, ascType)

      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Գործողություններ թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 7983)
      
            ' Դասավորել ըստ ամսաթիվ, Պայմանագրի N, Անվանում, Գումար սյուների
            SortArr(0) = "fDATE"
            SortArr(1) = "fKEY"
            SortArr(2) = "fCOM"
            SortArr(3) = "fDEALSUM"
            Call columnSorting(SortArr, 4, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_1\Actual\ActionsAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_1\Expected\ActionsExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Debit Dept\Report_1\Result\ActionsRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Գործողություններ թղթապանակը
            BuiltIn.Delay(4000)
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
            BuiltIn.Delay(4000)
      
      Else
            Log.Error(" Գործողություններ թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Գործողություններ թղթապանակ -2 ---" ,,, DivideColor 
       ' Բացել և լրացնել Գործողություններ ֆիլտրը
       stDate = "300605"
       eDate = "301209"
       wAgr = "0932086001"
       pprCode = ""
       wClient = ""
       wName = ""
       acsBranch = ""
       acsDepart = ""
       ascType = "BR1"
       Call OpenViewActionFilterFromDebitDept(folderDirect, stDate, eDate, wAgr, pprCode, wClient, wName, acsBranch, acsDepart, ascType)

      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Գործողություններ թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 31)
      
            ' Դասավորել ըստ ամսաթիվ, Անվանում, Գումար սյուների
            SortArr(0) = "fDATE"
            SortArr(1) = "fKEY"
            SortArr(2) = "fCOM"
            SortArr(3) = "fDEALSUM"
            Call FastColumnSorting(SortArr, 4, "frmPttel")
      
           ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Debit Dept\Report_1\Actual\ActionsAct_2.txt"
      
            ' Արտահանել txt ֆայլ
            Call ExportToTXTFromPttel(PttelName,Path1)

            ' Համեմատել երկու txt ֆայլերը
            Path2 = Project.Path &  "Stores\Reports\Debit Dept\Report_1\Expected\ActionsExp_2.txt"
            Call Compare_Files(Path2, Path1, "")
      
            BuiltIn.Delay(4000)
            Call Close_Pttel("frmPttel")
            BuiltIn.Delay(1000)
      
      Else
            Log.Error("Գործողություններ թղթապանակը չի բացվել")
      End If
      
      Log.Message "-- Դիտելու ձևի ֆիլտրերի գրադարանից հեռացնել ստեղծված դիտելու ձևը --" ,,, DivideColor  
      folderDirect = "|¸»µÇïáñ³Ï³Ý å³ñïù»ñ|ä³ÛÙ³Ý³·ñ»ñ"
      folderName = "Պայմանագրեր "
      eDate = ""
      Call DebitDeptContractsFilter(folderDirect, folderName, wLevel, eDate, accBal, wAcc, pprCode, agrAccType, wCur, defaultCur, wClient, wName, wNote, wNote2, _
                                                               wNote3, acsBranch, acsDepart, ascType, clientInfo, showInfo, showOutSum, showNotes, showAcc, wClose, notFullClose )
                         
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
    
      BuiltIn.Delay(2000)
      'Բացել "Դիտելու ձևի ֆիլտրերի գրադարան" պատուհանը
      Call wMainForm.MainMenu.Click(c_Opers)
      Call wMainForm.PopupMenu.Click( c_Folder & "|" & c_FilterLib)
     
      Set FilterLibWin = P1.WaitVBObject("FrmPttBibl",1000)
    
      For i = 1 To FilterLibWin.VBObject("List1").ListCount
          If Trim(FilterLibWin.VBObject("List1").Text) = "¸³ë³íáñ»É Áëï Ð³ßÇí ëÛ³Ý" Then
              FilterLibWin.VBObject("cmdDelete").Click
              Exit For
          Else
              FilterLibWin.VBObject("List1").Keys("[Down]")
              BuiltIn.Delay(500)
          End If
      Next
      FilterLibWin.Close
      
      Call Close_AsBank()
      
End Sub