Option Explicit
'USEUNIT Deposit_Contract_Library
'USEUNIT Group_Operations_Library
'USEUNIT Loan_Agreements_Library 
'USEUNIT Subsystems_SQL_Library
'USEUNIT Credit_Line_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common  
'USEUNIT Constants

'Test Case - 107013

Sub Loan_Attrached_Credit_Line_Test()

    Dim fDATE, sDATE, Count, i, DocNum, DocLevel, FolderName,colNum,sql_isEqual
    Dim Date, isExists, fBASE, Sum, calcDate, Param, dategive, CLSate, DocType, tabN
    Dim CreditLine, CashOrNo, acc, Climit,isEqual,actionExists,actionType, Workspace
    Dim attr, mainSum,perSum, capData , perS, summa,closeDate,queryString,sql_Value, state
      
    ''Համակարգ մուտք գործել ARMSOFT օգտագործողով
    fDATE = "20250101"
    sDATE = "20010101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Call Create_Connection()
    Login("ARMSOFT")
    Call ChangeWorkspace(c_LoanAttrached)
  
    Call Log.Message("Ներգրավված վարկեր/Վարկային գիծ",,,attr)
    Set CreditLine = New_LoanDocument()
    With CreditLine
        .CalcAcc = "00000113032"                                    
        .Limit = 2500000
        .Date = "060217" 
        .GiveDate = "060217"
        .Term = "060218"
        .FirstDate = "060217"
        .PaperCode = 555
    
        .DocType = "ì³ñÏ³ÛÇÝ ·ÇÍ"
        Call .CreateAttrLoan(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
  
        Log.Message(.DocNum)

        wMDIClient.VBObject("frmPttel").Close
  
        'Պայմանագրին ուղղարկել հաստատման
        .SendToVerify("|Ü»ñ·ñ³íí³Í í³ñÏ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
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
        
        queryString = "select fSUM from HI where fBASE = '" & CreditLine.fBASE & "'"
        sql_Value = 2500000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select count(*) from HIF where fBASE = '" & CreditLine.fBASE & "'"
        sql_Value =26
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Գանձում ներգավվումից գործողության կատարում 
    Date = "060217"
    Sum = "25000"
    Call ChargeForAttraction(fBASE,Date, Sum, CashOrNo,acc)
    'Վարկի ներգրավվում գործողության կատարում 
    Call Loan_Attraction(fBASE,Date,Sum,CashOrNo,acc)
    BuiltIn.Delay(6000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 25000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R^'"
        sql_Value = 25000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 25000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R^' and fOP = 'PAY'"
        sql_Value = 22500.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R^' and fOP = 'TAX' "
        sql_Value = 2500.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Տոկոսի հաշվարկ
    calcDate = "050317" 
    Call Calculate_Percent(fBASE , calcDate , calcDate)
    Log.Message(fBASE)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value =221.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RH'"
        sql_Value = 14646.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 221.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RÂ'"
        sql_Value = 14646.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 221.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RH'"
        sql_Value = 14646.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 221.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RÂ'"
        sql_Value = 14646.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
     'Պարտքերի մարում
    dategive = "060317"
    perSum = "5221.90"
    tabN = 2
    Call Debt_Repayment(fBASE,dategive, mainSum,perSum,cashORno,Acc,docNum, tabN)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = -5000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RH'"
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
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RÂ'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2' and fOP = 'TXD'"
        sql_Value = 522.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 221.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RH'"
        sql_Value = 14646.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Կանխավ վճարված տոկոսի հաշվարկ
    state = True
    Call Return_Payed_Percent(dategive, "3000","2",acc,fBASE, state)
    Log.Message(fBASE)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = -2000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Գումարի մարում տոկոսների հաշվին
    Call Fadeing_LeasingSumma_From_PayedPercents(c_FadeLoanFromPercent, dategive,"SUMMA", "2000")
    BuiltIn.Delay(3000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 23000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 25000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        
    'Տոկոսի հաշվարկ
    calcDate = "060317" 
    Call Calculate_Percent(fBASE , calcDate , calcDate)
    Log.Message(fBASE)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 7.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RH'"
        sql_Value = 542.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Տոկոսի հաշվարկ
    calcDate = "050417" 
    Call Calculate_Percent(fBASE , calcDate , calcDate)
    Log.Message(fBASE)
    BuiltIn.Delay(1000)
        
         'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 234.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RH'"
        sql_Value = 16830.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 234.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RÂ'"
        sql_Value = 16830.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 7.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RH'"
        sql_Value = 542.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Հաշվարկների ճշգրտում
    dategive = "060417"
    perSum = "2000"
    Call Correction_Calculation(dategive, perSum, fBASE)
    Log.Message(fBASE)
    
         'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 2234.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 2234.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value =234.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    ' Հաշիվ % մնացորդ դաշտի ստուգում
'    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fAgrRem")
    If Not Trim(wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(4).Text) = "2,234.40" Then
      Log.Error("The cell doesn.t updated")
    End If
    
    'Տոկոսի խմբային հաշվարկ գորշողության կատարում 
    closeDate = "050218"
    Call Group_Persent_Calculate(closeDate,closeDate)
    
         'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 4548.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RH'"
        sql_Value = 182958.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 4548.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RÂ'"
        sql_Value = 182958.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 2234.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RH'"
        sql_Value = 16830.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RÂ'"
        sql_Value = 167214.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 4328.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        
    'Պարտքերի մարում
    dategive = "060218"
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
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RH'"
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
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RÂ'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R^'"
        sql_Value = 25000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 4548.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CreditLine.fBASE & "' and fTYPE = 'RH'"
        sql_Value = 182958.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
        
    'Ջնջում է Պարտքերի մարման փաստաթուղթը
    dategive = "060218"
    actionExists = True
    actionType = "12"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
'    Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը
    dategive = "050218"
    actionType = "211"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
    'Ջնջում է Տոկոսի կապիտալացում փաստաթուղթը
    dategive = "060417"
    actionType = "73"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
    'Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը
    dategive = "050417"
    actionType = "211"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
    'Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը
    dategive = "060317"
    actionType = "211"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
    'Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը   
    dategive = "060317"
    actionType = "261"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
    'Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը
    dategive = "060317"
    actionType = "14"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
    'Ջնջում է Պարտքերի մարման փաստաթուղթը
    dategive = "160317"
    actionType = "71"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,c_OpersView)
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    'Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը
    Workspace = "|Ü»ñ·ñ³íí³Í í³ñÏ»ñ|"
    dategive = "^A[Del]"
    actionType = ""
    Call GroupDelete(Workspace, DocType, CreditLine.DocNum, dategive, dategive, actionType)
    'Ջնջում է գլխավոր պայմանագիրը
    Log.Message(CreditLine.DocNum)
    Call wTreeView.DblClickItem(Workspace & "ä³ÛÙ³Ý³·ñ»ñ")
    Call Rekvizit_Fill("Dialog", 1, "General", "LEVEL", DocType) 
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM",  CreditLine.DocNum) 
  	Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    Call Delete_Doc()
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    'Փակում է ASBANK - ը
    Call Close_AsBank()   
  
End Sub