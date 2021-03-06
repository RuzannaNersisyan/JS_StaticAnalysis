'USEUNIT  Library_Common
'USEUNIT Library_Colour
'USEUNIT OLAP_Library
'USEUNIT Card_Library
'USEUNIT Mortgage_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Constants
Option Explicit

'Test Case Id - 161173
'Test Case Id - 162448

Sub Check_Reports_6(SaveRAM)
  
    Dim sDATE,fDATE
    Dim Path1,Path2,resultWorksheet
    Dim ReceivedTrans,RecClearingTrans
    Dim SortArr(4)
     
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20030101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank_Report", sDATE, fDATE)
    Login("ARMSOFT")

    If SaveRAM Then
        Call SaveRAM_RowsLimit("1000")
    End If
    
    'Մուտք գործել "Պլաստիկ քարտերի ԱՇՏ (SV)"
    Call ChangeWorkspace(c_CardsSV)    
     
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''--- Պլաստիկ Քարտեր ԱՇՏ/Ստացված գործողություններ ---''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Ստացված գործողություններ ---" ,,, DivideColor  
    
    SortArr(0) = "fDATE"
    SortArr(1) = "fBILLSUM"
    SortArr(2) = "fCARD"
    
    Set ReceivedTrans = New_ReceivedTransactions()
    With ReceivedTrans
        .FileDate_1 = "^A[Del]"&"300713"
        .FileDate_2 = "^A[Del]"&"010120"
        .CardsTransactions = 1
        .MerchantPointTransactions = 1
        .ShowMadeTransactions = 1
        .ShowAllRows = 1
        .View = "VRecTrns"
        .FillInto = "0"
    End With
    Call GoToReceivedTrans_PlasticCarts(ReceivedTrans) 
    Call CheckPttel_RowCount("frmPttel", 229014)
    Call ColumnSorting(SortArr, 3, "frmPttel")
    
    Path1 = Project.Path & "Stores\Reports\Plastic Cards\Actual\Actual_28.xlsx"
    Path2 = Project.Path & "Stores\Reports\Plastic Cards\Expected\Expected_28.xlsx"
    resultWorksheet = Project.Path & "Stores\Reports\Plastic Cards\Result\Result_28.xlsx"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ EXCEL ý³ÛÉ»ñ
    Call ExportToExcel("frmPttel",Path1)
    Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)  
    Call CloseAllExcelFiles()
    Call Close_Pttel("frmPttel") 
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''--- Պլաստիկ Քարտեր ԱՇՏ/Ստացված հանրագումարներ ---''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Ստացված հանրագումարներ ---" ,,, DivideColor  
    
    Set RecClearingTrans = New_ReceivedClearingTransactions()
    With RecClearingTrans
        .FileDate_1 = "010503"
        .FileDate_2 = "160807"
        .CardBank = ""
        .ShowMadeTransactions = 1
        .View = "VRcClear"
        .FillInto = "0"
    End With

    Call GoToRecClearingTrans_PlasticCarts(RecClearingTrans) 
    Call CheckPttel_RowCount("frmPttel", 111107)
    
    BuiltIn.Delay(1000)
    Call wMainForm.MainMenu.Click(c_Views & "|" & "Հերթական համար -> առաջին սյուն")
    BuiltIn.Delay(50000)
    
    Path1 = Project.Path & "Stores\Reports\Plastic Cards\Actual\Actual_29.xlsx"
    Path2 = Project.Path & "Stores\Reports\Plastic Cards\Expected\Expected_29.xlsx"
    resultWorksheet = Project.Path & "Stores\Reports\Plastic Cards\Result\Result_29.xlsx"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ EXCEL ý³ÛÉ»ñ
    Call ExportToExcel("frmPttel",Path1)
    Call CompareTwoExcelFiles(Path1, Path2, resultWorksheet)
    Call CloseAllExcelFiles()
    Call Close_Pttel("frmPttel") 
    
    Call Close_AsBank() 
End Sub