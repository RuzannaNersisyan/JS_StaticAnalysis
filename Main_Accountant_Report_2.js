Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT  Main_Accountant_Filter_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Colour
'USEUNIT OLAP_Library
'USEUNIT Mortgage_Library
' Test Case ID 161719

' Գլխավոր հաշվապահի ԱՇՏ-ում ֆիլտրերի ստուգում (2)
Sub Main_Accountant_Report_2_Test()

      Dim fDATE, sDATE
      Dim folderDirect, stDate, eDate, wUser, docType, acsBranch, acsDepart, selectedView, exportExcel
      Dim accMask, accBranch, accDepart, accAcsType, balAcc, accType, accNote, accNote2, accNote3, _
              showOp, showCl, fnState, showFnState, cliCode, cliBranch, cliDepart, cliAccType, _
              jurState, wVolort, petBuj, wRez, cliNote, cliNote2, cliNote3, distRict, taxCode
      Dim PttelName, status, Path1, Path2, resultWorksheet
      Dim SortArr(4)
      
      fDATE = "20220101"
      sDATE = "20030101"
      Call Initialize_AsBank("bank_Report", sDATE, fDATE)
      
      ' Մուտք գործել համակարգ ARMSOFT օգտագործողով 
      Call Create_Connection()
      Login("ARMSOFT")
      
      ' Մուտք Գլխավոր հաշվապահի ԱՇՏ
      Call ChangeWorkspace(c_ChiefAcc)
      
      ' Դրույթներից, Տնտեսել հիշողոթյունը սկսած (Տողերի քանակ) դաշտի արժեքի փոփոխում
      Call  SaveRAM_RowsLimit("10")
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------   
      Log.Message "--- Ուղարկված փոխանցումներ - 1 ---" ,,, DivideColor       
      ' Մուտք Ուղարկված փոխանցումներ թղթապանակ
      folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|àõÕ³ñÏí³Í ÷áË³ÝóáõÙÝ»ñ"
      stDate = "010103"
      eDate = "190804"
      wUser = ""
      docType = ""
      acsBranch = ""
      acsDepart = ""
      selectedView = "SentPay"
      exportExcel = "0"
      Call OpenSentTransfersFolder(folderDirect, stDate, eDate, wUser, docType, acsBranch, acsDepart, selectedView, exportExcel)
        
      ' Ստուգում է Ուղարկված փոխանցումներ թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForExecutionProgress() 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 26131)
      
            ' Դասավորել ըստ Փաստաթղթի տեսակ, Փաստաթղթի N, Հաշիվ, Թղթակից հաշիվ սյան
            SortArr(0) = "DOCNUM"
            SortArr(1) = "ACC"
            SortArr(2) = "CORACC"
            SortArr(3) = "SUMMA"
            Call columnSorting(SortArr, 4, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_2\Actual\SentTransfersAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Expected\SentTransfersExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Result\SentTransfersRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Ուղարկված փոխանցումներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Ուղարկված փոխանցումներ թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------        
      Log.Message "--- Ուղարկված փոխանցումներ - 2 ---" ,,, DivideColor      
      ' Մուտք Ուղարկված փոխանցումներ թղթապանակ
      stDate = "010103"
      eDate = "010105"
      wUser = "11"
      docType = "CrPayOrd"
      acsBranch = "P00"
      acsDepart = "02"
      Call OpenSentTransfersFolder(folderDirect, stDate, eDate, wUser, docType, acsBranch, acsDepart, selectedView, exportExcel)
        
      ' Ստուգում է Ուղարկված փոխանցումներ թղթապանակը բացվել է թե ոչ
      status =  WaitForExecutionProgress() 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 8099)
      
            ' Դասավորել ըստ Փաստաթղթի տեսակ, Փաստաթղթի N, Հաշիվ, Թղթակից հաշիվ սյան
            Call columnSorting(SortArr, 4, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_2\Actual\SentTransfersAct_2.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Expected\SentTransfersExp_2.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Result\SentTransfersRes_2.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Ուղարկված փոխանցումներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Ուղարկված փոխանցումներ թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------       
      Log.Message "--- Ստացված փոխանցումներ - 1 ---" ,,, DivideColor       
      ' Մուտք Ստացված փոխանցումներ թղթապանակ
      folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|êï³óí³Í ÷áË³ÝóáõÙÝ»ñ"
      stDate = "010103"
      eDate = "061107"
      wUser = ""
      docType = ""
      acsBranch = ""
      acsDepart = ""
      selectedView = "SentPay"
      exportExcel = "0"
      Call OpenSentTransfersFolder(folderDirect, stDate, eDate, wUser, docType, acsBranch, acsDepart, selectedView, exportExcel)
        
      ' Ստուգում է Ստացված փոխանցումներ թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForExecutionProgress() 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 57377)
      
            ' Դասավորել ըստ Փաստաթղթի տեսակ, Փաստաթղթի N, Հաշիվ, Թղթակից հաշիվ սյան
            SortArr(0) = "DOCNUM"
            SortArr(1) = "ACC"
            SortArr(2) = "CORACC"
            SortArr(3) = "SUMMA"
            Call columnSorting(SortArr, 4, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_2\Actual\ReceivedTransfersAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Expected\ReceivedTransfersExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Result\ReceivedTransfersRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Ստացված փոխանցումներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Ստացված փոխանցումներ թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Ստացված փոխանցումներ - 2 ---" ,,, DivideColor              
      ' Մուտք Ստացված փոխանցումներ թղթապանակ
      stDate = "300911"
      eDate = "300911"
      wUser = "54"
      docType = "DbPayOrd"
      acsBranch = "P00"
      acsDepart = "031"
      Call OpenSentTransfersFolder(folderDirect, stDate, eDate, wUser, docType, acsBranch, acsDepart, selectedView, exportExcel)
        
      ' Ստուգում է Ստացված փոխանցումներ թղթապանակը բացվել է թե ոչ
      status =  WaitForExecutionProgress() 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 94)
      
            ' Դասավորել ըստ Փաստաթղթի տեսակ, Փաստաթղթի N, Հաշիվ, Թղթակից հաշիվ սյան
            Call columnSorting(SortArr, 4, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_2\Actual\ReceivedTransfersAct_2.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Expected\ReceivedTransfersExp_2.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Result\ReceivedTransfersRes_2.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Ստացված փոխանցումներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Ստացված փոխանցումներ թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------      
      Log.Message "--- ՖՆ-ում հաշիվների կարգավիճակներ - 1 ---" ,,, DivideColor     
      ' Մուտք ՖՆ-ում հաշիվների կարգավիճակներ թղթապանակ
       folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|üÜ-áõÙ Ñ³ßÇíÝ»ñÇ Ï³ñ·³íÇ×³ÏÝ»ñ"                                    
       stDate = "010103"
       eDate = "010122"
       accMask = ""
       accBranch = ""
       accDepart = ""
       accAcsType = ""
       balAcc = ""
       accType = ""
       accNote = ""
       accNote2 = ""
       accNote3 = ""
       showOp = 1
       showCl = 1
       fnState = ""
       showFnState = 1
       selectedView = "FNStat"
       exportExcel = "0"
       cliCode = ""
       cliBranch = ""
       cliDepart = ""
       cliAccType = ""
       jurState = ""
       wVolort = ""
       petBuj = ""
       wRez = ""
       cliNote = ""
       cliNote2 = ""
       cliNote3 = ""
       distRict = ""
       taxCode = 1
       Call OpenFnAccStatusesFolder(folderDirect, stDate, eDate, accMask, accBranch, accDepart, accAcsType, balAcc, accType, accNote, accNote2, accNote3, _
                                                                    showOp, showCl, fnState, showFnState, selectedView, exportExcel, cliCode, cliBranch, cliDepart, cliAccType, _
                                                                    jurState, wVolort, petBuj, wRez, cliNote, cliNote2, cliNote3, distRict, taxCode)
             
      ' Ստուգում է ՖՆ-ում հաշիվների կարգավիճակներ թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 540)
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_2\Actual\AccStatusesAct_1.xlsx"

            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Expected\AccStatusesExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Result\AccStatusesRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել ՖՆ-ում հաշիվների կարգավիճակներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("ՖՆ-ում հաշիվների կարգավիճակներ թղթապանակը չի բացվել")
      End If
      
       '-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------      
       Log.Message "--- ՖՆ-ում հաշիվների կարգավիճակներ - 2 ---" ,,, DivideColor 
      ' Մուտք ՖՆ հաշիվների կարգավիճակներ թղթապանակ
       stDate = "160207"
       eDate = "160207"
       accMask = "0022??20201"
       accBranch = "P00"
       accDepart = "031"
       accAcsType = "01"
       balAcc = "3020201"
       accType = "01"
       accNote = ""
       accNote2 = ""
       accNote3 = ""
       showOp = 1
       showCl = 1
       fnState = "3"
       showFnState = 1
       cliCode = "00002248"
       cliBranch = "P00"
       cliDepart = "031"
       cliAccType = "01"
       jurState = "11"
       wVolort = "9X"
       petBuj = "2"
       wRez = "1"
       cliNote = "1"
       cliNote2 = "03"
       cliNote3 = "01"
       distRict = "001"
       taxCode = 1
       Call OpenFnAccStatusesFolder(folderDirect, stDate, eDate, accMask, accBranch, accDepart, accAcsType, balAcc, accType, accNote, accNote2, accNote3, _
                                                                    showOp, showCl, fnState, showFnState, selectedView, exportExcel, cliCode, cliBranch, cliDepart, cliAccType, _
                                                                    jurState, wVolort, petBuj, wRez, cliNote, cliNote2, cliNote3, distRict, taxCode)
             
      ' Ստուգում է ՖՆ-ում հաշիվների կարգավիճակներ թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 1)
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_2\Actual\AccStatusesAct_2.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Expected\AccStatusesExp_2.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Result\AccStatusesRes_2.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել ՖՆ-ում հաշիվների կարգավիճակներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("ՖՆ-ում հաշիվների կարգավիճակներ թղթապանակը չի բացվել")
      End If
      
       '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------  
       Log.Message "--- Ստեղծված փաստաթղթեր - 1 ---" ,,, DivideColor        
      ' Մուտք Ստեղծված փաստաթղթեր թղթապանակ
      folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|êï»ÕÍí³Í ÷³ëï³ÃÕÃ»ñ"
      stDate = "110912"
      eDate = "230912"
      wUser = ""
      docType = ""
      Call OpenCreatedDocFolder(folderDirect, stDate, eDate, wUser, docType)
        
      ' Ստուգում է Ստեղծված փաստաթղթեր թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForExecutionProgress() 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 48351)
      
            ' Դասավորել ըստ Փաստաթղթի ISN սյան
            SortArr(0) = "fISN"
            Call columnSorting(SortArr, 1, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_2\Actual\CreatedDocAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Expected\CreatedDocExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Result\CreatedDocRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Ստեղծված փաստաթղթեր թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Ստեղծված փաստաթղթեր թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------     
      Log.Message "--- Ստեղծված փաստաթղթեր - 2 ---" ,,, DivideColor            
      ' Մուտք Ստեղծված փաստաթղթեր թղթապանակ
      stDate = "160104"
      eDate = "160104"
      wUser = "17"
      docType = "D5GrOp"
      Call OpenCreatedDocFolder(folderDirect, stDate, eDate, wUser, docType)
        
      ' Ստուգում է Ստեղծված փաստաթղթեր թղթապանակը բացվել է թե ոչ
      status =  WaitForExecutionProgress() 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 6)
      
            ' Դասավորել ըստ Փաստաթղթի ISN սյան
            Call columnSorting(SortArr, 1, "frmPttel")
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_2\Actual\CreatedDocAct_2.txt"
      
            ' Արտահանել tzt ֆայլ
            Call ExportToTXTFromPttel(PttelName,Path1)

            ' Համեմատել երկու tzt ֆայլերը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_2\Expected\CreatedDocExp_2.txt"
            Call Compare_Files(Path2, Path1, "")
      
            ' Փակել Ստեղծված փաստաթղթեր թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Ստեղծված փաստաթղթեր թղթապանակը չի բացվել")
      End If
      
      Call Close_AsBank()  
      
End Sub