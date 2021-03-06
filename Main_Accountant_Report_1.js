Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT  Main_Accountant_Filter_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Colour
'USEUNIT OLAP_Library
'USEUNIT Mortgage_Library
' Test Case ID 161695

' Գլխավոր հաշվապահի ԱՇՏ-ում ֆիլտրերի ստուգում (1)
Sub Main_Accountant_Report_1_Test()

      Dim fDATE, sDATE
      Dim folderDirect, accChartNum, acsBranch, acsDepart, selectView, exportExcel 
      Dim stDate, eDate, wUser, docType, wName, passNum, cliCode, paySysIn, paySysOut, docISN 
      Dim PttelName, status, Path1, Path2, resultWorksheet, exists, backBalance
      Dim SortArr(1)
      
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
      Log.Message "--- Ետհաշվեկշռային հաշիվներ - 1 ---" ,,, DivideColor 
      ' Մուտք Ետհաշվեկշռային հաշիվներ թղթապանակ
      Set backBalance = New_BackBalanceSheetAcc
      With backBalance
        .folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ºïÑ³ßí»Ïßé³ÛÇÝ Ñ³ßÇíÝ»ñ"
        .accChartNum = "1"
        .showLimits = 1
        .showCli = 1
      End With
      Call Fill_BackBalanceSheetAcc(backBalance)
                                                   
      ' Ստուգում է Ետհաշվեկշռային հաշիվներ թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForExecutionProgress() 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 37345)
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_1\Actual\BackBalSheetAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_1\Expected\BackBalSheetExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Main Accountant\Report_1\Result\BackBalSheetRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Ետհաշվեկշռային հաշիվներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Ետհաշվեկշռային հաշիվներ թղթապանակը չի բացվել")
      End If
      
      
      '---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Ետհաշվեկշռային հաշիվներ - 2 ---" ,,, DivideColor 
      ' Մուտք Ետհաշվեկշռային հաշիվներ թղթապանակ      
      Set backBalance = New_BackBalanceSheetAcc
      With backBalance
        .folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ºïÑ³ßí»Ïßé³ÛÇÝ Ñ³ßÇíÝ»ñ"
        .accChartNum = "2"
        .accMask = "0042400101"
        .accCur = "001"
        .accType = "26"
        .clName = "Ð³×³Ëáñ¹ 00004240"
        .clCode = "00004240"
        .showLimits = 1
        .showCli = 1
        .oldAccMask = "0005001"
        .opDate = "020407"
        .endOpDAte = "190711"
        .acsBranch = "P00"
        .acsDepart = "05"
        .acsType = "26"
      End With
      Call Fill_BackBalanceSheetAcc(backBalance)
                                                 
      ' Ստուգում է Ետհաշվեկշռային հաշիվներ թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 1)
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_1\Actual\BackBalSheetAct_2.txt"
      
            ' Արտահանել txt ֆայլ
            Call ExportToTXTFromPttel(PttelName,Path1)

            ' Համեմատել երկու txt ֆայլերը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_1\Expected\BackBalSheetExp_2.txt"
            Call Compare_Files(Path2, Path1, "")
      
            ' Փակել Ետհաշվեկշռային հաշիվներ թղթապանակը
            Call Close_Pttel(PttelName)
      
      Else
            Log.Error("Ետհաշվեկշռային հաշիվներ թղթապանակը չի բացվել")
      End If
      
      '---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Ետհաշվեկշռային հաշիվներ - 3 ---" ,,, DivideColor 
      ' Մուտք Ետհաշվեկշռային հաշիվներ թղթապանակ      
      Set backBalance = New_BackBalanceSheetAcc
      With backBalance
        .folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ºïÑ³ßí»Ïßé³ÛÇÝ Ñ³ßÇíÝ»ñ"
        .accChartNum= "3"
        .balAcc = "999998"
        .accCur = "000"
        .accType = "22"
        .accName = "Ð³×³Ëáñ¹ 00001999"
        .clName = "Ð³×³Ëáñ¹ 00001999"
        .clCode = "00001999"
        .showLimits = 1
        .showCli = 1
        .accNote = "1"
        .accNote2 = "03"
        .accNote3 = "01"
        .opDate = "100507"
        .endOpDAte = "130617"
        .acsBranch = "P00"
        .acsDepart = "061"
        .acsType = "22"
      End With
      Call Fill_BackBalanceSheetAcc(backBalance)   
                                               
      ' Ստուգում է Ետհաշվեկշռային հաշիվներ թղթապանակը բացվել է թե ոչ
      BuiltIn.Delay(20000)
      PttelName = "frmPttel"
      status =  WaitForExecutionProgress() 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 4)
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_1\Actual\BackBalSheetAct_3.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_1\Expected\BackBalSheetExp_3.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Main Accountant\Report_1\Result\BackBalSheetRes_3.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Ետհաշվեկշռային հաշիվներ թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Ետհաշվեկշռային հաշիվներ թղթապանակը չի բացվել")
      End If
      
      
       '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------      
       Log.Message "--- հաշվառված վճարային փաստաթղթեր - 1 ---" ,,, DivideColor 
      ' Մուտք հաշվառված վճարային փաստաթղթեր թղթապանակ
      folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      stDate = "010314"
      eDate = "100315"
      wUser = ""
      docType = ""
      wName = "" 
      passNum = ""
      cliCode = ""
      paySysIn = ""
      paySysOut = ""
      acsBranch = ""
      acsDepart = ""
      docISN = ""
      selectView = "Payments"
      exportExcel = "0"
      Call OpenAccPaymentDocFolder(folderDirect, stDate, eDate, wUser, docType, wName, passNum, cliCode,_
                                                                      paySysIn, paySysOut, acsBranch, acsDepart, docISN, selectView, exportExcel)

      ' Ստուգում է Հաշվառված վճարային փաստաթղթեր թղթապանակը բացվել է թե ոչ
      status =  WaitForExecutionProgress() 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 43566)
      
            ' Դասավորել ըստ Փաստաթղթի ISN և Ամսաթիվ սյուների(եթե ամսաթիվ սյունը սորտավորած չէ)
            Call wMainForm.MainMenu.Click(c_Views)
            Call wMainForm.PopupMenu.Click(c_SortDocISN)
      
            BuiltIn.Delay(10000)
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_1\Actual\AccPaymentDocAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_1\Expected\AccPaymentDocExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Main Accountant\Report_1\Result\AccPaymentDocRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Հաշվառված վճարային փաստաթղթեր թղթապանակը
            PttelName = "frmPttel"
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Հաշվառված վճարային փաստաթղթեր թղթապանակը չի բացվել")
      End If
      
       '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------   
       Log.Message "--- հաշվառված վճարային փաստաթղթեր - 2 ---" ,,, DivideColor    
      ' Մուտք հաշվառված վճարային փաստաթղթեր թղթապանակ
      stDate = "010106"
      eDate = "010606"
      wUser = "17"
      docType = "DbPayOrd"
      wName = "êï³óáÕ" 
      passNum = "0000"
      cliCode = "00000024"
      paySysIn = "2"
      paySysOut = ""
      acsBranch = "P00"
      acsDepart = "02"
      docISN = "357168748"
      Call OpenAccPaymentDocFolder(folderDirect, stDate, eDate, wUser, docType, wName, passNum, cliCode,_
                                                                      paySysIn, paySysOut, acsBranch, acsDepart, docISN, selectView, exportExcel)

                                                  
      ' Ստուգում է Հաշվառված վճարային փաստաթղթեր թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 1)
      
            ' Դասավորել ըստ N սյան
            SortArr(0) = "DOCNUM"
            Call FastColumnSorting(SortArr, 1, "frmPttel")
      
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_1\Actual\AccPaymentDocAct_2.txt"
      
            ' Արտահանել txt ֆայլ
            Call ExportToTXTFromPttel(PttelName,Path1)

            ' Համեմատել երկու txt ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_1\Expected\AccPaymentDocExp_2.txt"
            Call Compare_Files(Path2, Path1, "")
      
            ' Փակել Հաշվառված վճարային փաստաթղթեր թղթապանակը
            Call Close_Pttel(PttelName)
      
      Else
            Log.Error("Հաշվառված վճարային փաստաթղթեր թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------       
      Log.Message "--- Հաշվառված ետհաշվեկշռային փաստաթղթեր - 1 ---" ,,, DivideColor   
      ' Մուտք Հաշվառված ետհաշվեկշռային փաստաթղթեր թղթապանակ
      folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ßí³éí³Í »ïÑ³ßí»Ïßé³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      stDate = "010103"
      eDate = "010122"
      wUser = ""
      docType = ""
      acsBranch = ""
      acsDepart = ""
      selectView = "RegNBDoc"
      exportExcel = "0"
      Call OpenSentTransfersFolder(folderDirect, stDate, eDate, wUser, docType, acsBranch, acsDepart, selectView, exportExcel)
        
      ' Ստուգում է Հաշվառված ետհաշվեկշռային փաստաթղթեր թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForExecutionProgress() 
      
      If  status Then
      
            ' Համեմատել պտտելի տողերի քանակը
            Call CheckPttel_RowCount("frmPttel", 43501)
      
            ' Դասավորել ըստ Փաստաթղթի ISN սյան
            Call wMainForm.MainMenu.Click(c_Views)
            Call wMainForm.PopupMenu.Click(c_SortDocISN)
      
            BuiltIn.Delay(10000)
      
            ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
            Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_1\Actual\PeymBalanceSheetAct_1.xlsx"
      
            ' Արտահանել excel ֆայլ
            Call ExportToExcel("frmPttel",Path1)

            ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
            Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_1\Expected\PeymBalanceSheetExp_1.xlsx"
            resultWorksheet = Project.Path &  "Stores\Reports\Main Accountant\Report_1\Result\PeymBalanceSheetRes_1.xlsx"
            Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
            ' Փակել Հաշվառված ետհաշվեկշռային փաստաթղթեր թղթապանակը
            Call Close_Pttel(PttelName)
      
            ' Փակել բոլոր excel ֆայլերը
            Call CloseAllExcelFiles()
      
      Else
            Log.Error("Հաշվառված ետհաշվեկշռային փաստաթղթեր թղթապանակը չի բացվել")
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------   
      Log.Message "--- Հաշվառված ետհաշվեկշռային փաստաթղթեր - 2 ---" ,,, DivideColor         
      ' Մուտք Հաշվառված ետհաշվեկշռային փաստաթղթեր թղթապանակ
      stDate = "101209"
      eDate = "120314"
      wUser = "17"
      docType = "RvlAccs"
      acsBranch = "P00"
      acsDepart = "02"
      selectView = "RegNBDoc\1"
      exportExcel = "1"
      Call OpenSentTransfersFolder(folderDirect, stDate, eDate, wUser, docType, acsBranch, acsDepart, selectView, exportExcel)
        
      ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
      Path1 = Project.Path & "Stores\Reports\Main Accountant\Report_1\Actual\PeymBalanceSheetAct_2.xlsx"
      Path2 = Project.Path &  "Stores\Reports\Main Accountant\Report_1\Expected\PeymBalanceSheetExp_2.xlsx"
      resultWorksheet = Project.Path &  "Stores\Reports\Main Accountant\Report_1\Result\PeymBalanceSheetRes_2.xlsx"              

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
      Log.Message "--- Հաշվառված ետհաշվեկշռային փաստաթղթեր - 3 ---" ,,, DivideColor    
      ' Մուտք Հաշվառված ետհաշվեկշռային փաստաթղթեր թղթապանակ
      stDate = "010103"
      eDate = "010122"
      wUser = "10"
      docType = "EPSIPay"
      acsBranch = ""
      acsDepart = "03"
      selectView = "RegNBDoc"
      exportExcel = "0"
      Call OpenSentTransfersFolder(folderDirect, stDate, eDate, wUser, docType, acsBranch, acsDepart, selectView, exportExcel)
      
      ' Ստուգում է Հաշվառված ետհաշվեկշռային փաստաթղթեր թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
          ' Համեմատել պտտելի տողերի քանակը
          Call CheckPttel_RowCount("frmPttel", 0)
          BuiltIn.Delay(1000)
          ' Փակել Պտտելը
          Call Close_Pttel("frmPttel")
      Else
            Log.Error("Հաշվառված ետհաշվեկշռային փաստաթղթեր թղթապանակը չի բացվել")
      End If
      
      Call Close_AsBank()  
End Sub