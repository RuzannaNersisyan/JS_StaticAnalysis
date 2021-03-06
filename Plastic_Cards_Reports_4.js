'USEUNIT  Library_Common
'USEUNIT Library_Colour
'USEUNIT OLAP_Library
'USEUNIT Card_Library
'USEUNIT Mortgage_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Constants
Option Explicit

'Test Case Id - 161006

Sub Check_Reports_4()
  
    Dim sDATE,fDATE
    Dim Path1,Path2,resultWorksheet,exists
    Dim AverageBalance_Turnover,Service_Fees,CardFeeOperation
    Dim CardServiceFeeGeneral,ReceivedDevelopedTrans,General_Report
    Dim SortArr(3)
     
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20030101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank_Report", sDATE, fDATE)
    Login("ARMSOFT")
    
    Call SaveRAM_RowsLimit("100")
    
    'Մուտք գործել "Պլաստիկ քարտերի ԱՇՏ (SV)"
    Call ChangeWorkspace(c_CardsSV)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''--- Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտերի միջին մնացորդ.շրջանառություն ---'''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Քարտերի միջին մնացորդ.շրջանառություն ---" ,,, DivideColor  

    SortArr(0) = "CARDNUM"
    Set AverageBalance_Turnover = New_AverageBalance_TurnoverPlasticCards()
    With AverageBalance_Turnover
        .DatePeriod_Start = "010113"
        .DatePeriod_End = "010120"
        .ShowClosed = 1
        .View = "PCrdTurn"
        .FillInto = "0"
    End With
    
    Call GoTo_AverageBalance_TurnoverForPlasticCards(AverageBalance_Turnover)
    Call CheckPttel_RowCount("frmPttel", 8243)
    Call ColumnSorting(SortArr, 1, "frmPttel")
    
    Path1 = Project.Path & "Stores\Reports\Plastic Cards\Actual\Actual_19.xlsx"
    Path2 = Project.Path & "Stores\Reports\Plastic Cards\Expected\Expected_19.xlsx"
    resultWorksheet = Project.Path & "Stores\Reports\Plastic Cards\Result\Result_19.xlsx"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ EXCEL ý³ÛÉ»ñ
    Call ExportToExcel("frmPttel",Path1)
    Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)  
    Call CloseAllExcelFiles()
    
    Call Close_Pttel("frmPttel")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''--- Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Սպասարկման վարձավճարներ ---''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Սպասարկման վարձավճարներ ---" ,,, DivideColor  
    
    Set Service_Fees = New_Service_Fees_PlasticCards()
    With Service_Fees
        .Date = "010121"
        .ShowLinkedAccRem = 1
        .ShowClosed = 1
        .ShowLimits = 1
        .ShowCliInf = 1
        .ShowOnlyDebts = 0
        .ShowOtherInfo = 1
        .View = "SERVFEE"
        .FillInto = "0"
    End With
    
    Call GoTo_Service_FeesPlasticCards(Service_Fees)
    Call WaitForExecutionProgress()
    Call CheckPttel_RowCount("frmPttel", 13604)
    Call ColumnSorting(SortArr, 1, "frmPttel")
    
    Path1 = Project.Path & "Stores\Reports\Plastic Cards\Actual\Actual_20.xlsx"
    Path2 = Project.Path & "Stores\Reports\Plastic Cards\Expected\Expected_20.xlsx"
    resultWorksheet = Project.Path & "Stores\Reports\Plastic Cards\Result\Result_20.xlsx"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ EXCEL ý³ÛÉ»ñ
    Call ExportToExcel("frmPttel",Path1)
    Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)  
    Call CloseAllExcelFiles()
    Call Close_Pttel("frmPttel")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''--- Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Վարձավճարների գանձման գործող. ---'''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Վարձավճարների գանձման գործող.   ---" ,,, DivideColor  
    
    Set CardFeeOperation = New_CardFeeOperation()
    With CardFeeOperation
        .DatePeriod_Start = "^A[Del]"&"051109"
        .DatePeriod_End = "^A[Del]"&"051109"
        .CardNumber = "6772170000035604"
        .Curr = "000"
        .AccountMask = "01055010100"
        .ShowCardFields = 1
        .Division = "P00"
        .Department = "061"
    End With
    
    Call GoTo_CardFeeOperation_PlasticCards(CardFeeOperation)
    Call CheckPttel_RowCount("frmPttel", 1)
    
    Path1 = Project.Path & "Stores\Reports\Plastic Cards\Actual\Actual_21.txt"
    Path2 = Project.Path & "Stores\Reports\Plastic Cards\Expected\Expected_21.txt"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ txt ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    Call Compare_Files(Path2, Path1, "")  
    Call Close_Pttel("frmPttel")     
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''--- Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Վարձավճ. ընդհանուր հաշվետվություն ---''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Վարձավճ. ընդհանուր հաշվետվություն ---" ,,, DivideColor  
    
    Set CardServiceFeeGeneral = New_CardServiceFeeGeneral()
    With CardServiceFeeGeneral
      .DatePeriod_Start = "010612"
      .DatePeriod_End = "010115"
      .Division = 1
      .CardType = 1
      .CardTypeLevel = "2"
      .CardCurr = 1
      .CardCompany = 1
      .CardNote1 = 1
      .CardNote2 = 1
      .CardNote3 = 1
    End With
    
    Call GoTo_CardServiceFeeGeneral_PlasticCards(CardServiceFeeGeneral)
    Call CheckPttel_RowCount("frmPttel", 13)
    Call ColumnSorting(SortArr, 3, "frmPttel")
    
    Path1 = Project.Path & "Stores\Reports\Plastic Cards\Actual\Actual_22.txt"
    Path2 = Project.Path & "Stores\Reports\Plastic Cards\Expected\Expected_22.txt"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ txt ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    Call Compare_Files(Path2, Path1, "")  
    Call Close_Pttel("frmPttel")   
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''--- Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Ստացված, հաշվառված գործողություններ ---''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Ստացված, հաշվառված գործողություններ ---" ,,, DivideColor  
    
    Set ReceivedDevelopedTrans = New_ReceivedDevelopedTransaction()
    With ReceivedDevelopedTrans
         .FileDate_1 = "240113"
         .FileDate_2 = "010118"
         .OperationDate_1 = "111012"
         .OperationDate_2 = "150518"
         .CardNumber = "51????0000154880"
         .AccountMask = "???70120100"
         .View = "ArCaTrns\1"
    End With
    
    Call GoTo_ReceivedDevelopedTrans_PlasticCards(ReceivedDevelopedTrans)
    Call CheckPttel_RowCount("frmPttel", 20)
    
    Path1 = Project.Path & "Stores\Reports\Plastic Cards\Actual\Actual_23.txt"
    Path2 = Project.Path & "Stores\Reports\Plastic Cards\Expected\Expected_23.txt"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ txt ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    Call Compare_Files(Path2, Path1, "")  
    Call Close_Pttel("frmPttel")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''--- Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Ընդհանուր հաշվետվություն ---''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Ընդհանուր հաշվետվություն ---" ,,, DivideColor  
    
    Set General_Report = New_General_Report()
    With General_Report
        .FileDate_1 = "^A[Del]"&"010103"
        .FileDate_2 = "^A[Del]"&"010120"
        .OperationDate_1 = "^A[Del]"&"010103"
        .OperationDate_2 = "^A[Del]"&"010120"
        .OperType_checkbox = 1
        .CommunPayType_checkbox = 1
        .Division_checkbox = 1
        .CardType_checkbox = 1
        .CardCurr_checkbox = 1
        .CardCompany_checkbox = 1
        .CardNote1_checkbox = 1
        .CardNote2_checkbox = 1
        .CardNote3_checkbox = 1
        .MerchType_checkbox = 1
        .MerchCategory_checkbox = 1
        .MerchEquipType_checkbox = 1
        .OperCurr_checkbox = 1
        .MerchN_checkbox = 1
        .CardNote1 = "100"
        .CardNote2 = ""
        .CardNote3 = "300"
        .ArchivedOpers = 0
    End With
    
    Call GoTo_General_Report_PlasticCards(General_Report)
    Call CheckPttel_RowCount("frmPttel", 3)
    Call wMainForm.MainMenu.Click(c_Views & "|" & "Սորտավորած Գործ գումար")
    
    Path1 = Project.Path & "Stores\Reports\Plastic Cards\Actual\Actual_24.txt"
    Path2 = Project.Path & "Stores\Reports\Plastic Cards\Expected\Expected_24.txt"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ txt ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    Call Compare_Files(Path2, Path1, "")  
    Call Close_Pttel("frmPttel")
      
    Call Close_AsBank()
End Sub    