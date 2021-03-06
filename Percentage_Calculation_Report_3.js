Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT  Percentage_Calculation_Filter_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Colour
'USEUNIT OLAP_Library
'USEUNIT Mortgage_Library

' Test Case ID 161140

' Տոկոսների Հաշվարկման ԱՇՏ-ում Ֆիլտրերի ստուգում (3)
Sub Percentage_Calculation_Report_3_Test()

      Dim fDATE, sDATE
      Dim folderDirect, stDate, eDate, docsP, wISN, accRow, wUser, acsBranch, acsDepart
      Dim showAccs, showInt, showPer, SortArr(5), PttelName, status
      Dim Path1, Path2, resultWorksheet, balAcc, accMask, wCur, ascType
      Dim wTabStrip, FilterWin, i, wFrame3
      
      fDATE = "20250101"
      sDATE = "20030101"
      Call Initialize_AsBank("bank_Report", sDATE, fDATE)
      
      ' Մուտք գործել համակարգ ARMSOFT օգտագործողով 
      Call Create_Connection()
      Login("ARMSOFT")
      
      ' Մուտք Տոկոսների հաշվարկման ԱՇՏ
      Call ChangeWorkspace(c_PercentCalc)
      
       ' Դրույթներից, Տնտեսել հիշողոթյունը սկսած (Տողերի քանակ) դաշտի արժեքի փոփոխում
      Call  SaveRAM_RowsLimit("10")
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Ջնջված փաստաթղթեր - 1 ---" ,,, DivideColor       
      ' Մուտք  Ջնջված փաստաթղթեր դիալոգ և արժեքների լրացում
      folderDirect = "|îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ²Þî|æÝçí³Í ÷³ëï³ÃÕÃ»ñ"
      stDate = "010113"
      eDate = "010122"
      docsP = ""
      wISN = ""
      accRow = 0
      wUser = ""
      acsBranch = ""
      acsDepart = ""
      Call DeletedDocFilter(folderDirect, stDate, eDate, docsP, wISN, accRow, wUser, acsBranch, acsDepart)
      
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
      
      ' Ստուգում է  Ջնջված փաստաթղթեր թղթապանակը բացվել է թե ոչ
      PttelName = "frmPttel"
      status =  WaitForPttel(PttelName) 
      
      If  status Then

         ' Համեմատել պտտելի տողերի քանակը
         Call CheckPttel_RowCount("frmPttel", 263)

         ' Բացել Ֆիլտրել պատուհանը
         Call wMainForm.MainMenu.Click(c_Opers)
         Call wMainForm.PopupMenu.Click( c_Folder & "|" & c_Filter)
         
         Set FilterWin = p1.WaitVBObject("frmPttelFilter", 2000)
         ' Ստուգել Ֆիլտրել պատուհանը բացվել է թե ոչ
         If FilterWin.Exists Then
    
              ' Անցում 2րդ թաբ
              Set wTabStrip = FilterWin.VBObject("TabStrip1")
     			    wTabStrip.SelectedItem = wTabStrip.Tabs(2)
                  
              Set wFrame3= Sys.Process("Asbank").VBObject("frmPttelFilter").VBObject("Frame3")
              ' "Մեկնաբանություն" սյունը տեղափոխել սկիզբ  
              i = 0
              Call wFrame3.VBObject("List4").FocusItem("æÝçÙ³Ý ³Ùë³ÃÇí")
              For i = 0 To 13
                   wFrame3.VBObject("List4").Keys("[Down]")
              Next
                      
              i = 0
              For i = 0 To 14
                   wFrame3.VBObject("Command6").Click
              Next
               
              ' Սեղմել "Կատարել" կոճակը
              FilterWin.VBObject("Command5").Click  
               
         Else
             Log.Error "Ֆիլտրել պատուհանը չի բացվել",,,ErrorColor   
         End if
    
         BuiltIn.Delay(2000)
         ' Ֆիլտրել ըստ "Հաճախորդ" , "ժամանակ", "Հաշվի", "Անձնագիր/ՀՎՀՀ"  սյուների
         wMDIClient.VBObject("frmPttel").Keys("[Hold]" & "^!" & (6))
         BuiltIn.Delay(500)
				 wMDIClient.VBObject("frmPttel").Keys("[Hold]" & "^!" & (7))
         BuiltIn.Delay(500)
         wMDIClient.VBObject("frmPttel").Keys("[Hold]" & "^!" & (9))
         BuiltIn.Delay(500)
         wMDIClient.VBObject("frmPttel").Keys("[Hold]" & "^!" & (1))
         BuiltIn.Delay(500)
         wMDIClient.VBObject("frmPttel").Keys("[Hold]" & "^!" & (2))

          ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
          Path1 = Project.Path & "Stores\Reports\Percentage Calculation\Report_3\Actual\DeletedDocAct_1.xlsx"
      
          ' Արտահանել excel ֆայլ
          Call ExportToExcel("frmPttel",Path1)

          ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
          Path2 = Project.Path &  "Stores\Reports\Percentage Calculation\Report_3\Expected\DeletedDocExp_1.xlsx"
          resultWorksheet = Project.Path &  "Stores\Reports\Percentage Calculation\Report_3\Result\DeletedDocRes_1.xlsx"
          Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
          ' Փակել  թղթապանակը
          Call Close_Pttel(PttelName)
      
          ' Փակել բոլոր excel ֆայլերը
          Call CloseAllExcelFiles()
      
      Else
            Log.Error "Ջնջված փաստաթղթեր թղթապանակը չի բացվել",,,ErrorColor
      End If
      
       '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       Log.Message "--- Ջնջված փաստաթղթեր - 2 ---" ,,, DivideColor   
      ' Մուտք  Ջնջված փաստաթղթեր դիալոգ և արժեքների լրացում
      stDate = "220518"
      wISN = "1879383710"
      docsP = "GenOrdPk"
      accRow = 1
      wUser = "10"
      acsBranch = "P00"
      acsDepart = "061"
      Call DeletedDocFilter(folderDirect, stDate, stDate, docsP, wISN, accRow, wUser, acsBranch, acsDepart)
      
      ' Ստուգում է Ջնջված փաստաթղթեր թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
          ' Համեմատել պտտելի տողերի քանակը
          Call CheckPttel_RowCount("frmPttel", 1)
      
          ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
          Path1 = Project.Path & "Stores\Reports\Percentage Calculation\Report_3\Actual\DeletedDocAct_2.txt"
      
          ' Արտահանել txt ֆայլ
          Call ExportToTXTFromPttel(PttelName,Path1)

          ' Համեմատել երկու txt ֆայլերը
          Path2 = Project.Path &  "Stores\Reports\Percentage Calculation\Report_3\Expected\DeletedDocExp_2.txt"
          Call Compare_Files(Path2, Path1, "")
      
          Call Close_Pttel("frmPttel")
      
      Else
           Log.Error "Ջնջված փաստաթղթեր թղթապանակը չի բացվել",,,ErrorColor
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      Log.Message "--- Գործողությունների դիտում - 1 ---" ,,, DivideColor   
      ' Գործողությունների դիտում ֆիլտրի բացում և տվյալների լրացում
      folderDirect = "|îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ²Þî|¶áñÍáÕáõÃÛáõÝÝ»ñÇ ¹ÇïáõÙ"
      stDate = "080513"
      eDate = "100513"
      balAcc = ""
      accMask = ""
      wCur = ""
      acsBranch = ""
      acsDepart = ""
      ascType = ""
      Call ViewActionFilter(folderDirect, stDate, eDate, balAcc, accMask, wCur, acsBranch, acsDepart, ascType)
      
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress() 
      
      ' Ստուգում է Գործողությունների դիտում թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
          ' Համեմատել պտտելի տողերի քանակը
          Call CheckPttel_RowCount("frmPttel", 13197)
      
          ' Դասավորել ըստ պայմանագրերի համարի
          SortArr(0) = "fISN"
          SortArr(1) = "ACCDB"
          SortArr(2) = "BALACC"
          SortArr(3) = "ACC"
          SortArr(4) = "fCURSUM"
          Call columnSorting(SortArr, 5, "frmPttel")
      
          ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
          Path1 = Project.Path & "Stores\Reports\Percentage Calculation\Report_3\Actual\ViewActionAct_1.xlsx"
      
          ' Արտահանել excel ֆայլ
          Call ExportToExcel("frmPttel",Path1)

          ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
          Path2 = Project.Path &  "Stores\Reports\Percentage Calculation\Report_3\Expected\ViewActionExp_1.xlsx"
          resultWorksheet = Project.Path &  "Stores\Reports\Percentage Calculation\Report_3\Result\ViewActionRes_1.xlsx"
          Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
          ' Փակել Գործողությունների դիտում թղթապանակը
          Call Close_Pttel(PttelName)
      
          ' Փակել բոլոր excel ֆայլերը
          Call CloseAllExcelFiles()
      
      Else
            Log.Error "Գործողությունների դիտում թղթապանակը չի բացվել",,,ErrorColor
      End If
      
       '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       Log.Message "--- Գործողությունների դիտում - 2 ---" ,,, DivideColor  
      ' Գործողությունների դիտում ֆիլտրի բացում և տվյալների լրացում
      stDate = "051113"
      eDate = "291113"
      wCur = "000"
      acsBranch = "P10"
      acsDepart = "03"
      ascType = "01"
      Call ViewActionFilter(folderDirect, stDate, eDate, balAcc, accMask, wCur, acsBranch, acsDepart, ascType)
      
      ' Ստուգում է Գործողությունների դիտում թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then
      
          ' Համեմատել պտտելի տողերի քանակը
          Call CheckPttel_RowCount("frmPttel", 234)
      
          ' Դասավորել ըստ պայմանագրերի համարի
          Call FastColumnSorting(SortArr, 5, "frmPttel")
      
          ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
          Path1 = Project.Path & "Stores\Reports\Percentage Calculation\Report_3\Actual\ViewActionAct_2.xlsx"
      
          ' Արտահանել excel ֆայլ
          Call ExportToExcel("frmPttel",Path1)

          ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
          Path2 = Project.Path &  "Stores\Reports\Percentage Calculation\Report_3\Expected\ViewActionExp_2.xlsx"
          resultWorksheet = Project.Path &  "Stores\Reports\Percentage Calculation\Report_3\Result\ViewActionRes_2.xlsx"
          Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
          ' Փակել Գործողությունների դիտում թղթապանակը
          Call Close_Pttel(PttelName)
      
          ' Փակել բոլոր excel ֆայլերը
          Call CloseAllExcelFiles()
      
      Else
            Log.Error "Գործողությունների դիտում թղթապանակը չի բացվել",,,ErrorColor
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ 
      Log.Message "--- Պայմանագրերի ստանդարտների տեղեկատու -1 ---" ,,, DivideColor       
      ' Տոկոսների հաշվարկման ԱՇՏ-ում "Պայմանագրերի ստանդարտների տեղեկատու" ֆիլտրի լրացում
      folderDirect = "|îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ²Þî|ä³ÛÙ³Ý³·ñ»ñÇ ëï³Ý¹³ñïÝ»ñÇ ï»Õ»Ï³ïáõ"
      showAccs = 0
      showInt = 0
      showPer = 0
      Call ContractScaleInformation(folderDirect, showAccs, showInt, showPer)
      
      ' Ստուգում է Պայմանագրերի ստանդարտների տեղեկատու թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then

          ' Համեմատել պտտելի տողերի քանակը
          Call CheckPttel_RowCount("frmPttel", 31)
      
          ' Դասավորել ըստ պայմանագրերի համարի
          SortArr(0) = "CODE"
          Call FastColumnSorting(SortArr, 1, "frmPttel")
      
          ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
          Path1 = Project.Path & "Stores\Reports\Percentage Calculation\Report_3\Actual\ContractStandInfoAct_1.xlsx"
      
          ' Արտահանել excel ֆայլ
          Call ExportToExcel("frmPttel",Path1)

          ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
          Path2 = Project.Path &  "Stores\Reports\Percentage Calculation\Report_3\Expected\ContractStandInfoExp_1.xlsx"
          resultWorksheet = Project.Path &  "Stores\Reports\Percentage Calculation\Report_3\Result\ContractStandInfoRes_1.xlsx"
          Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
          ' Փակել Պայմանագրերի ստանդարտների տեղեկատու թղթապանակը
          Call Close_Pttel(PttelName)
      
          ' Փակել բոլոր excel ֆայլերը
          Call CloseAllExcelFiles()
      
      Else
            Log.Error "Պայմանագրերի ստանդարտների տեղեկատու թղթապանակը չի բացվել",,,ErrorColor
      End If
      
      '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
       Log.Message "--- Պայմանագրերի ստանդարտների տեղեկատու -2 ---" ,,, DivideColor   
      ' Տոկոսների հաշվարկման ԱՇՏ-ում "Պայմանագրերի ստանդարտների տեղեկատու" ֆիլտրի լրացում
      showAccs = 1
      showInt = 1
      showPer = 1
      Call ContractScaleInformation(folderDirect, showAccs, showInt, showPer)
      
      ' Ստուգում է Պայմանագրերի ստանդարտների տեղեկատու թղթապանակը բացվել է թե ոչ
      status =  WaitForPttel(PttelName) 
      
      If  status Then

          ' Համեմատել պտտելի տողերի քանակը
          Call CheckPttel_RowCount("frmPttel", 31)
      
          ' Դասավորել ըստ պայմանագրերի համարի
          Call FastColumnSorting(SortArr, 1, "frmPttel")
      
          ' Արտահանել թղթապանակի տողերը բացված Pttel-ից
          Path1 = Project.Path & "Stores\Reports\Percentage Calculation\Report_3\Actual\ContractStandInfoAct_2.xlsx"
      
          ' Արտահանել excel ֆայլ
          Call ExportToExcel("frmPttel",Path1)

          ' Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
          Path2 = Project.Path &  "Stores\Reports\Percentage Calculation\Report_3\Expected\ContractStandInfoExp_2.xlsx"
          resultWorksheet = Project.Path &  "Stores\Reports\Percentage Calculation\Report_3\Result\ContractStandInfoRes_2.xlsx"
          Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
      
          ' Փակել Պայմանագրերի ստանդարտների տեղեկատու թղթապանակը
          Call Close_Pttel(PttelName)
      
          ' Փակել բոլոր excel ֆայլերը
          Call CloseAllExcelFiles()
      
      Else
            Log.Error "Պայմանագրերի ստանդարտների տեղեկատու թղթապանակը չի բացվել",,,ErrorColor
      End If
      
      ' Փակել ՀԾ-Բանկ ծրագիրը
      Call Close_AsBank()
End Sub