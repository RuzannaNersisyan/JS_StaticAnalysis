Option Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Loan_Agreements_Library 
'USEUNIT Subsystems_SQL_Library
'USEUNIT Credit_Line_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common  
'USEUNIT Constants
'USEUNIT  Subsystems_Special_Library

'Test case Id 166694

Sub Loan_Attrached_OneTime_Test()

    Dim fDATE, sDATE, Count, i, DocNum, DocLevel, FolderName,colNum,sql_isEqual
    Dim Date, isExists, fBASE, Sum, calcDate, Param, dategive, CLSate
    Dim CreditLine, CashOrNo, acc, Climit,isEqual,actionExists,actionType
    Dim attr, mainSum,perSum, capData ,docExist, perS, date_arg, summa,closeDate,queryString,sql_Value
    Dim griddate,Period,Direction, state, status, dateType , tabN
    
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    fDATE = "20250101"
    sDATE = "20010101"
    Date = "260417"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Call Create_Connection()
    Login("ARMSOFT")
    Call ChangeWorkspace(c_LoanAttrached)
  
    Call Log.Message("Ներգրավված վարկեր/Միանգամյա վարկ",,,attr)
    Set CreditLine = New_LoanDocument()
    With CreditLine
        .CalcAcc = "77787753818"                                    
        .Limit = 1850000
        .Date = "260417" 
        .GiveDate = "260417"
        .Term = "260418"
        .FirstDate = "260417"
        .PaperCode = 555
    
        .DocType = "ØÇ³Ý·³ÙÛ³ í³ñÏ"
        Call .CreateAttrLoan(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
  
        Log.Message(.DocNum) 
        
        'Այլ վճարումների գրաֆիկի նշանակում
        param = "ØÇ³Ý·³ÙÛ³ í³ñÏ- " & Trim(.DocNum) & " {äáÕáëÛ³Ý äáÕáë}"
        griddate = "260418"
        period = 1
        direction = 2
        If Not Other_Payment_Schedule_AllTypes(param,Date,Date,griddate,Period,Direction) Then 
            Log.Error("There was no document")
            Exit Sub
        End If
        'wMDIClient.VBObject("frmPttel").Close
        Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").Keys("[Up]")
        Call PaySys_Send_To_Verify() 
        BuiltIn.Delay(2000) 
        Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close
        'Հաստատել
        Call wTreeView.DblClickItem("|Ü»ñ·ñ³íí³Í í³ñÏ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
         'Call ClickCmdButton(2,"Î³ï³ñ»É")
        'Կատարում է ստուգում , եթե գլխավոր պայմանագիրը առկա է ,ապա ուղարկում է հաստատման, հակառակ դեպքում դուրս է բերում սխալ
        isExists = Find_Doc_ByNum(CreditLine.DocNum,2)
        If Not isExists Then
            Log.Error("The document does՚t exist")
            Exit sub
        End If
        'Վավերացնում է փաստաթուղթը
        Call Validate_Doc()
        Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close
        Log.Message(CreditLine.fBASE)
    
        Call ChangeWorkspace(c_LoanAttrached)
        Call LetterOfCredit_Filter_Fill(FolderName, .DocLevel, .DocNum)
    
    End With
        
        'Կատարում ենք SQL ստուգում
        queryString = "select fSTATE from DOCS where fISN = '" & CreditLine.fBASE & "'"
        sql_Value = 7
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select count(*) from DAGRACCS where fAGRISN = '" & CreditLine.fBASE & "' "
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select count(*) from HIF where fBASE = '" & CreditLine.fBASE & "'"
        sql_Value = 24
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Գանձում ներգավվումից գործողության կատարում 
    Date = "260417"
    Sum = "1550000"
    Call ChargeForAttraction(fBASE,Date, Sum, CashOrNo,acc)
    'Վարկի ներգրավվում գործողության կատարում 
    Call Loan_Attraction(fBASE,Date,Sum,CashOrNo,acc)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R^'"
        sql_Value = 1550000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1550000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R^' and fOP = 'PAY'"
        sql_Value = 1395000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R^' and fOP = 'TAX' "
        sql_Value = 155000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¾' "
        sql_Value = -1550000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¾' "
        sql_Value = 1550000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Տոկոսի հաշվարկ
    calcDate = "250517" 
    Call Calculate_Percent(fBASE , calcDate , calcDate)
    Log.Message(fBASE)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 14778.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 14778.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 14778.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 14778.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
     'Պարտքերի մարում
    dategive = "260517"
    perSum = "20778.10"
    tabN = 2
    Call Debt_Repayment(fBASE,dategive, mainSum,perSum,cashORno,Acc,docNum, tabN)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = -6000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2' and fOP = 'TXD'"
        sql_Value = 2077.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 14778.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¾' "
        sql_Value = -1564778.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¾' "
        sql_Value = -1550000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¾'  and fOP = 'PER'"
        sql_Value = -14778.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Կանխավ վճարված տոկոսի հաշվարկ
    state = True
    Call Return_Payed_Percent(dategive, "3000","2",acc,fBASE,state)
    Log.Message(fBASE)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = -3000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Գումարի մարում տոկոսների հաշվին
    Call Fadeing_LeasingSumma_From_PayedPercents(c_FadeLoanFromPercent, dategive,"SUMMA", "1980.80")
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = -1019.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1548019.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1550000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Տոկոսի հաշվարկ
    calcDate = "260517" 
    Call Calculate_Percent(fBASE , calcDate , calcDate)
    Log.Message(fBASE)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = -510.3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
            
    'Տոկոսի հաշվարկ
    calcDate = "250617" 
    Call Calculate_Percent(fBASE , calcDate , calcDate)
    Log.Message(fBASE)
    BuiltIn.Delay(1000)
        
         'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 14757.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 14757.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
             
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = -510.3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Հաշվարկների ճշգրտում
    dategive = "260617"
    perSum = "2000"
    Call Correction_Calculation(dategive, perSum, fBASE)
    Log.Message(fBASE)
    
         'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 16757.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 16757.9 ''---
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 14757.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Տոկոսի խմբային հաշվարկ գորշողության կատարում 
    closeDate = "250418"
    Call Group_Persent_Calculate(closeDate,closeDate)
    
         'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 171475
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 171475
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 16757.9 ''---
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 155697.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If    
        
    'Պարտքերի մարում
    dategive = "260418"
    Call Debt_Repayment(fBASE,dategive, mainSum,perS,cashORno,Acc,docNum, tabN)
    Log.Message(fBASE)
    BuiltIn.Delay(1000)
    
         'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R^'"
        sql_Value = 1550000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 171475
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¾' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¾' "
        sql_Value = -1484638.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Ջնջում է Պարտքերի մարման փաստաթուղթը
    dategive = "260418"
    actionExists = True
    actionType = "12"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
    'Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը
    dategive = "250418"
    actionType = "211"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
'    Ջնջում է Տոկոսի կապիտալացում փաստաթուղթը
    dategive = "260617"
    actionType = "73"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
    'Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը
    dategive = "250617"
    actionType = "211"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
    'Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը
    dategive = "260517"
    actionType = "211"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
    'Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը   
    dategive = "260517"
    actionType = "261"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
    'Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը
    dategive = "260517"
    actionType = "14"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)

    actionType = "2"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
    
     dategive = "260517"
     status = False
     Call DeleteActionOverdraft(c_OpersView, dategive, dategive, status, dateType ) 

'    Ջնջում է Պարտքերի մարման փաստաթուղթը
    dategive = "260417"
    actionType = "11"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
     
'    Ջնջում է Պարտքերի մարման փաստաթուղթը
    dategive = "260417"
    actionType = ""
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)

    Call Delete_Doc()
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    'Փակում է ASBANK - ը
    Call Close_AsBank()   
  
End Sub