'USEUNIT  Library_Common
'USEUNIT Library_Colour
'USEUNIT OLAP_Library
'USEUNIT Card_Library
'USEUNIT Mortgage_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Constants
Option Explicit

'Test Case Id - 160996

Sub Check_Reports_3()
  
    Dim sDATE,fDATE
    Dim SendableCard,MerchantPoints,Transactions,BalanceOfCards,TurnoverOfCards
    Dim Path1,Path2,resultWorksheet,exists
    Dim SortArr(3)
     
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20030101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank_Report", sDATE, fDATE)
    Login("ARMSOFT")
    
    Call SaveRAM_RowsLimit("100")
    
    'Մուտք գործել "Պլաստիկ քարտերի ԱՇՏ (SV)"
    Call ChangeWorkspace(c_CardsSV)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''--- Պլաստիկ Քարտեր ԱՇՏ/Թղթապանակներ/Ուղարկվող քարտեր ---'''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Ուղարկվող քարտեր ---" ,,, DivideColor  

    SortArr(0) = "CARDNUM"
    
    Set SendableCard = New_SendableCards()
    With SendableCard
        .ShowCilInfo = 1
        .User = "95"
        .ChangeType = "A,C,N,O,S"
        .ChangeMakerCode = "95"
        .ShowChangeMakerAndDate = 1
        .ShowChangedFields = 1
        .Division = "P00"
        .Department = "061"
        .View = "VCrdsNew"
        .FillInto = "0"
    End With
    
    Call GoTo_SendableCard_PlasticCarts(SendableCard)
    Call CheckPttel_RowCount("frmPttel", 22)
    
    BuiltIn.Delay(1000)
    Call wMainForm.MainMenu.Click(c_Views & "|" & "Սորտավորած սյուներով")
    BuiltIn.Delay(1000)
    Call ColumnSorting(SortArr, 1, "frmPttel")
    
    Path1 = Project.Path & "Stores\Reports\Plastic Cards\Actual\Actual_14.xlsx"
    Path2 = Project.Path & "Stores\Reports\Plastic Cards\Expected\Expected_14.xlsx"
    resultWorksheet = Project.Path & "Stores\Reports\Plastic Cards\Result\Result_14.xlsx"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ EXCEL ý³ÛÉ»ñ
    Call ExportToExcel("frmPttel",Path1)
    Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)  
    Call CloseAllExcelFiles()
    Call Close_Pttel("frmPttel")
    
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''--- Պլաստիկ Քարտեր ԱՇՏ/Թղթապանակներ/Սպասարկման կետեր ---'''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Սպասարկման կետեր ---" ,,, DivideColor  
    
    SortArr(0) = "fMerchID"
    Set MerchantPoints = New_MerchantPoints()
    With MerchantPoints
        .ShowClosed = 1
        .ShowTerminals = 1
        .ShowFees = 1
        .View = "VMerch"
        .FillInto = "0"
    End With
    
    Call GoTo_PlasticCardsMerchantPoints(MerchantPoints)
    Call CheckPttel_RowCount("frmPttel", 236)
    Call ColumnSorting(SortArr, 1, "frmPttel")
    
    Path1 = Project.Path & "Stores\Reports\Plastic Cards\Actual\Actual_15.xlsx"
    Path2 = Project.Path & "Stores\Reports\Plastic Cards\Expected\Expected_15.xlsx"
    resultWorksheet = Project.Path & "Stores\Reports\Plastic Cards\Result\Result_15.xlsx"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ EXCEL ý³ÛÉ»ñ
    Call ExportToExcel("frmPttel",Path1)
    Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)  
    Call CloseAllExcelFiles()
    Call Close_Pttel("frmPttel")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''--- Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Գործողություններ ---''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Գործողություննե ---" ,,, DivideColor  
    
    Set Transactions = New_TransactionsPlasticCards()
    With Transactions
        .FileDate_1 = "^A[Del]"
        .FileDate_2 = "^A[Del]"&"270612"
        .OperationDate_1 = "^A[Del]"
        .OperationDate_2 = "^A[Del]"&"270612"
        .InnerOuterTx = "O"
        .CardNumber = "5160????00982868"
        .CardsTransactions = 1
        .MerchantPointTransactions = 1
        .ShowCardDetails = 1
        .ShowMerchDetails = 1
        .ShowArchivedOpers = 0
        .CalcDate = "^A[Del]"&"010120"
        .View = "CrdMchTX\1"
        .FillInto = "0"
    End With
    
    Call GoTo_TransactionsForPlasticCards(Transactions)
    Call CheckPttel_RowCount("frmPttel", 13)
    
    Path1 = Project.Path & "Stores\Reports\Plastic Cards\Actual\Actual_16.txt"
    Path2 = Project.Path & "Stores\Reports\Plastic Cards\Expected\Expected_16.txt"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ txt ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    Call Compare_Files(Path2, Path1, "")  
    Call Close_Pttel("frmPttel") 
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''--- Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտերի մնացորդներ ---'''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Քարտերի մնացորդներ ---" ,,, DivideColor  
    
    SortArr(0) = "CARDNUM"
    
    Set BalanceOfCards = New_BalanceOfCardsPlasticCards()
    With BalanceOfCards
        .Date = "^A[Del]"&"010121"
        .ShowLinkedAccRem = 1
        .ShowClosed = 1
        .ShowLimits = 1
        .ShowOverLimits = 1
        .ShowCliInf = 1
        .ShowOtherInfo = 1
        .View = "VCrdsRem"
        .FillInto = "0"
    End With
    
    Call GoTo_BalanceOfCardsForPlasticCards(BalanceOfCards)
    BuiltIn.Delay(60000)
    Call CheckPttel_RowCount("frmPttel", 13604)
    Call ColumnSorting(SortArr, 1, "frmPttel")
    
    Path1 = Project.Path & "Stores\Reports\Plastic Cards\Actual\Actual_17.xlsx"
    Path2 = Project.Path & "Stores\Reports\Plastic Cards\Expected\Expected_17.xlsx"
    resultWorksheet = Project.Path & "Stores\Reports\Plastic Cards\Result\Result_17.xlsx"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ EXCEL ý³ÛÉ»ñ
    Call ExportToExcel("frmPttel",Path1)
    Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)  
    Call CloseAllExcelFiles()
    Call Close_Pttel("frmPttel")

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''--- Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտերի շրջանառություն ---''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Քարտերի շրջանառություն ---" ,,, DivideColor  
    
    Set TurnoverOfCards = New_TurnoverOfCardsPlasticCards()
    With TurnoverOfCards
        .DatePeriod_Start = "010120"
        .DatePeriod_End = "010120"
        .CardType = "361"
        .CardNumber = "5160880000005017"
        .Curr = "000"
        .CardName = "Ð³×³Ëáñ¹ 00008602"
        .AccountMask = "00860240100"
        .Client = "00008602"
        .Company = "106"
        .ShowOverdraftDisRepayment = 1
        .ShowClosed = 1
        .InWhichCurrShowSums = "1"
        .Division = "P00"
        .Department = "061"
        .View = "PCrdTurn"
        .FillInto = "1"
    End With
    
    Call GoTo_TurnoverOfCardsForPlasticCards(TurnoverOfCards)
    
    Path1 = Project.Path & "Stores\Reports\Plastic Cards\Actual\Actual_18.xlsx"
    Path2 = Project.Path & "Stores\Reports\Plastic Cards\Expected\Expected_18.xlsx"
    resultWorksheet = Project.Path & "Stores\Reports\Plastic Cards\Result\Result_18.xlsx"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ EXCEL ý³ÛÉ»ñ
    'Î³ï³ñáõÙ ¿ ëïáõ·áõÙ,»Ã» ÝÙ³Ý ³ÝáõÝáí ý³ÛÉ Ï³ ïñí³Í ÃÕÃ³å³Ý³ÏáõÙ ,çÝçáõÙ ¿   
    exists = aqFile.Exists(Path1)
    If exists Then
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
    Call Close_AsBank()
End Sub    