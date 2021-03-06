Option Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Derivative_Tools_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Derivatives_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Mortgage_Library

'Test Case Id 166732

Sub Currency_Swap_Test()
  
    Dim startDATE,fDATE ,CurrSwap,FolderPath,fBASE,actionExist,contr
    Dim date,revDate,sumRevl,repDate,extention,actionEndDate,CloseDate
    Dim per,part, sPer,Calculate_Date,dateStart, summperc,docType,fOBJECT
    Dim repType, time, sold, place,actionDate,actionExists,actionType
    Dim queryString,sql_Value,colNum,sql_isEqual,docAcc,docISN
    startDATE = "20120101"
    fDATE = "20250101"
        
    'Test StartUp start
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
    Call Create_Connection()
    
    Call ChangeWorkspace(c_Derivatives)
    'Ստեղծել Ածանցյալ գործիք/ Արժույթային գործիկ տեսակի փաստաթուղթ
    Set CurrSwap = New_DerivativeDoc()  
    With CurrSwap
    .Client = "00000014"
    .BuyAcc = "10310070100"
    .RepayAcc = "10330030101"
    .Date = "210817"
    .ForwardExchg = "400" & "[Tab]" & "1"
    .SaleAmount = 1000000
    .Term = "210818"
    .PurAmount = 1000000
    .PaperCode = 123
    .FirstDate = "210817"
    .Paragraph = 1
    .Direction = 2
  
    Call .CreateDerivative("|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ", "²ñÅáõÃ³ÛÇÝ ëíá÷") 
    'Փակել պտըտելը
    Call Close_Pttel("frmPttel")
  
    Log.Message( CurrSwap.fBASE)
        'Կատարում ենք SQL ստուգում
        queryString = "select fSTATE from DOCS where fISN = '" & CurrSwap.fBASE & "'"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Պայմանագիրը ուղարկել հաստատման
    .SendToVerify("|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Վավերացնել պայմանագիրը
    .Verify("|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    BuiltIn.Delay(6000)

        'Կատարում ենք SQL ստուգում
        queryString = "select fSTATE from DOCS where fISN = '" & CurrSwap.fBASE & "'"
        sql_Value = 7
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fSUM from HIF where fBASE = '" & CurrSwap.fBASE & "' and fOP = 'PAG'"
        sql_Value = 12.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fSUM from HIF where fBASE = '" & CurrSwap.fBASE & "' and fOP = 'PCR'"
        sql_Value = 5.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM from HIF where fBASE = '" & CurrSwap.fBASE & "' and fOP = 'PAG'"
        sql_Value = 365.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIF where fBASE = '" & CurrSwap.fBASE & "' and fOP = 'PCR'"
        sql_Value = 365.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If    
    
    FolderPath = "|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|ä³ÛÙ³Ý³·ñ»ñ"
    .OpenInFolder(FolderPath)
    End with

    'Կատարել "Ձևակերպում" գործողությունը
    date = "210817"
    Call Entry(date)
    
        BuiltIn.Delay(3000)
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "'  and fTYPE = 'R1'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fOP = 'BCR'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fOP = 'SCR'"
        sql_Value = 2857.14
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R²'"
        sql_Value = 2500.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If  
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'RI'"
        sql_Value = 1002857.14
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R²'"
        sql_Value = 2500.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
    
    '" Տոկոսի հաշվարկ" գործողության կատարում
    Call Calculate_Percent(fBASE, date , date)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "'  and fTYPE = 'R1'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fOP = 'BCR'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fOP = 'SCR'"
        sql_Value = 2857.14
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R²'"
        sql_Value = 2500.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If  
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'RI'"
        sql_Value = 1002857.14
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R²'"
        sql_Value = 2500.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
    
    ' " Վերագնահատում" գործողության կատարում
    revDate = "220817"
    sumRevl = "1200000"
    Call Leasing_ReEvaluation(revDate,sumRevl)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "'  and fTYPE = 'Rì' and fOP = 'RAI'"
        sql_Value = 1200000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rì'"
        sql_Value = 1200192.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    '" Ժամկետների վերանայում" գործողության կատարում
    repDate = "021218"
    extention = "1"
    Call ReviewTerms(revDate,repDate,extention)
    ' "Տոկոսադրույք" գործողության կատարում
    per = "14"
    part = "365"
    sPer = "8"
    Call Set_Persentage(fOBJECT,revDate,per,part, sPer,part)
    Log.Message(fOBJECT)
    
        BuiltIn.Delay(2000)
        'Կատարում ենք SQL ստուգում
        queryString = "select fSUM from HIF where fBASE= '" & fOBJECT & "' and fOP = 'PAG'"
        sql_Value = 14.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fSUM from HIF where fBASE = '" & fOBJECT & "' and fOP = 'PCR'"
        sql_Value = 8.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    '" Տոկոսի հաշվարկ" գործողության կատարում
    Calculate_Date = "200818"
    Call Calculate_Percent(fBASE, Calculate_Date , Calculate_Date)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HIR where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'RÆ'"
        sql_Value = 199.79
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 139945.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'R2' and fDATE = '2018-08-20'"
        sql_Value = 139616.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'Rì' and fOP = 'PCR' and fDATE = '2018-08-20'"
        sql_Value = 79780.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 139945.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'Rì'"
        sql_Value = 1260029.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'Rî'"
        sql_Value = 199.79
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 328.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'Rì'"
        sql_Value = 1200192.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    ' "Հաշվարկների ճշգրտում " գոևշողության կատարում
    dateStart = "210818"
    summperc = "5000"
    Call Correc_Calculation(dateStart, summperc, fBase)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HIR where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R2'  and fDATE = '2018-08-21'"
        sql_Value = 5000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'Rì'  and fDATE = '2018-08-21'"
        sql_Value = 5000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'R¸' and fDATE = '2018-08-21'"
        sql_Value = 139945.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'R2' "
        sql_Value = 144945.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'Rì'"
        sql_Value = 1265029.2	
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 139945.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'Rì'"
        sql_Value = 1260029.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'Rî'"
        sql_Value = 0.34
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    '" Տոկոսի հաշվարկ" գործողության կատարում
    Calculate_Date = "210818"
    Call Calculate_Percent(fBASE, Calculate_Date , Calculate_Date)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HIR where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R2'  and fDATE = '2018-08-21' and fOP = 'PER'"
        sql_Value = 383.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'Rî'  and fDATE = '2018-08-21'"
        sql_Value = 0.55
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'Rì' and fDATE = '2018-08-21' and fOP = 'PER'"
        sql_Value = 383.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'R2' "
        sql_Value = 145328.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 144945.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    ' " Մարում" գործողության կատարում
    date = "220818"
    repType = "1"
    time = "1"
    sold = "1"
    place = "1"
    Call Repayments(date, repType, time, sold, place,docType,contr )
    'Փակել պտըտելը
    Call Close_Pttel("frmPttel")
    
        BuiltIn.Delay(2000)
        'Կատարում ենք SQL ստուգում
        queryString = "select fPENULTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 145328.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 144945.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'RÆ'"
        sql_Value = 199.79
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'Rì' "
        sql_Value = 1265192.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'Rî'"
        sql_Value = 200.34
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'RÆ'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'Rì' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rî'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R2' and fDATE = '2018-08-22'"
        sql_Value = 145328.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R¸' and fDATE = '2018-08-22'"
        sql_Value = 144945.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'RÆ' and fDATE = '2018-08-22'"
        sql_Value = 199.79
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rì' and fDATE = '2018-08-22' and fOP = 'DPD'"
        sql_Value = 145328.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rì' and fDATE = '2018-08-22' and fOP = 'DPC'"
        sql_Value = 80136.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rì' and fDATE = '2018-08-22' and fOP = 'RAE'"
        sql_Value = 1200000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rî' and fDATE = '2018-08-22'"
        sql_Value = 200.34
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    

    'Ստուգվում է 19-րդ հաշվետվության մեջ պայմանագրի հայտնվելը ճիշտ տվյալներով 
    Call ChangeWorkspace(c_ChiefAcc)
    Call wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î´ Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|19 ²ñï³ñÅáõÛÃÇ ³éù/í³×³éù")
    Call Rekvizit_Fill("Dialog", 1, "General", "SDATE" ,date)
    Call Rekvizit_Fill("Dialog", 1, "General", "EDATE" ,date)
    Call ClickCmdButton(2,"Î³ï³ñ»É")
    'Ստուգում է որ լինի գոնե 1 տող
    If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 0  then 
         'Ստուգում է Առք-1/Վաճ-2 սյան արժեքը
        colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("CUPUSA")
        If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(1) Then
              Log.Error("Don't match sold")
        End If 
        'Ստուգում է Գործ. տեսակ սյան արժեքը
        colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("CURTES")
        If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(4) Then
              Log.Error("Don't match type")
        End If
        'Ստուգում է Գործ. վայր սյան արժեքը
        colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("CURVAIR")
        If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(1) Then
              Log.Error("Don't match place")
        End If
        'Ստուգում է Առքի ծավալ սյան արժեքը
        colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("PUSUMMA")
        If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("80,136.00") Then
              Log.Error("Don't match money")
        End If
        'Ստուգում է Առքի միջին փոխարժեք սյան արժեքը
        colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("PUCRS")
        If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("400.0000") Then
              Log.Error("Don't match currency")
        End If
        Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").DblClick()
        If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").VBObject("tdbgView").ApproxCount = 0  then 
              'Ստուգում է Առք-1/Վաճ-2 սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("CUPUSA")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(1) Then
                    Log.Error("Don't match sold")
              End If 
              'Ստուգում է Գործ. տեսակ սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("CURTES")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(4) Then
                    Log.Error("Don't match type")
              End If
              'Ստուգում է Գործ. վայր սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("CURVAIR")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(1) Then
                    Log.Error("Don't match place")
              End If
              'Ստուգում է Գործ.ոլորտ սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("VOLORTINIT")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(7) Then
                    Log.Error("Don't match money")
              End If
              'Ստուգում է Գործ ոլորտ(19) սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("VOLORT")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(1) Then
                    Log.Error("Don't match currency")
              End If
              'Ստուգում է Գումար(գնվող) սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("SUMMA1")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("80,136.00") Then
                    Log.Error("Don't match place")
              End If
              'Ստուգում է Գումար (վաճարվող) սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("SUMMA2")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("200.34") Then
                    Log.Error("Don't match money")
              End If
              'Ստուգում է Փոխարժեք սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("AVGCRSSTR")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("400.0000") Then
                    Log.Error("Don't match currency")
              End If
              'Ստուգում է Իրավ. կարգ սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("JURSTAT")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(21) Then
                    Log.Error("Don't match currency")
              End If
              'Փակել պտըտելը
              Call Close_Pttel("frmPttel_2")
        Else 
              Log.Error("There was no line")
        End If
    Else 
      Log.Error("There was no line")
    End If
    'Փակել պտըտելը
    Call Close_Pttel("frmPttel")
    
    date = "210817"
    Call wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î´ Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|19 ²ñï³ñÅáõÛÃÇ ³éù/í³×³éù")
    Call Rekvizit_Fill("Dialog", 1, "General", "SDATE" ,date)
    Call Rekvizit_Fill("Dialog", 1, "General", "EDATE" ,date)
    Call ClickCmdButton(2,"Î³ï³ñ»É")
    'Ստուգում է որ լինի գոնե 1 տող
    If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 0  then 
         'Ստուգում է Առք-1/Վաճ-2 սյան արժեքը
         colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("CUPUSA")
        If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(1) Then
              Log.Error("Don't match sold")
        End If 
        'Ստուգում է Գործ. տեսակ սյան արժեքը
        colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("CURTES")
        If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(4) Then
              Log.Error("Don't match type")
        End If
        'Ստուգում է Գործ. վայր սյան արժեքը
        colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("CURVAIR")
        If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(4) Then
              Log.Error("Don't match place")
        End If
        'Ստուգում է Առքի ծավալ սյան արժեքը
        colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("PUSUMMA")
        If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("2,857.14") Then
              Log.Error("Don't match money")
        End If
        'Ստուգում է Առքի միջին փոխարժեք սյան արժեքը
        colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("PUCRS")
        If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("350.0004") Then
              Log.Error("Don't match currency")
        End If
      
        Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").DblClick()
        If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").VBObject("tdbgView").ApproxCount = 0  then 
              'Ստուգում է Առք-1/Վաճ-2 սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("CUPUSA")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(3).Text) = Trim(1) Then
                    Log.Error("Don't match sold")
              End If 
              'Ստուգում է Գործ. տեսակ սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("CURTES")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(4) Then
                    Log.Error("Don't match type")
              End If
              'Ստուգում է Գործ. վայր սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("CURVAIR")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(4) Then
                    Log.Error("Don't match place")
              End If
              'Ստուգում է Գործ.ոլորտ սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("VOLORTINIT")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(7) Then
                    Log.Error("Don't match money")
              End If
              'Ստուգում է Գործ ոլորտ(19) սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("VOLORT")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(1) Then
                    Log.Error("Don't match currency")
              End If
              'Ստուգում է Գումար(գնվող) սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("SUMMA1")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("2,857.14") Then
                    Log.Error("Don't match place")
              End If
              'Ստուգում է Գումար (վաճարվող) սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("SUMMA2")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("1,000,000.00") Then
                    Log.Error("Don't match money")
              End If
              'Ստուգում է Փոխարժեք սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("AVGCRSSTR")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("350.0004") Then
                    Log.Error("Don't match currency")
              End If
              'Ստուգում է Իրավ. կարգ սյան արժեքը
              colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("JURSTAT")
              If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(21) Then
                    Log.Error("Don't match currency")
              End If
              Call Close_Pttel("frmPttel_2")
        Else 
              Log.Error("There was no line")
        End If
      Else 
      Log.Error("There was no line")
    End If
    Call Close_Pttel("frmPttel")

    
    Call ChangeWorkspace(c_Derivatives)
    FolderPath = "|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|ä³ÛÙ³Ý³·ñ»ñ"
    CurrSwap.OpenInFolder(FolderPath)
    '" Տոկոսի հաշվարկ" գործողության կատարում
    Calculate_Date = "011218"
    Call Calculate_Percent(fBASE, Calculate_Date , Calculate_Date)
    
         BuiltIn.Delay(2000)
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 39123.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'RÆ'"
        sql_Value = 55.89
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'Rì' "
        sql_Value = 16767.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rî'"
        sql_Value = 55.89
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R2' and fDATE = '2018-12-01'"
        sql_Value = 39123.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rì' and fDATE = '2018-12-01' and fOP = 'PER'"
        sql_Value = 39123.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rì' and fDATE = '2018-12-01' and fOP = 'PCR'"
        sql_Value = 22356.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rî' and fDATE = '2018-12-01' "
        sql_Value = 55.89
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R¸' and fDATE = '2018-12-02'"
        sql_Value = 39123.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'RÆ' and fDATE = '2018-12-02' "
        sql_Value = 55.89
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    ' " Մարում" գործողության կատարում
    date = "021218"
    repType = "2"
    Call Repayments(date, repType, time, sold, place,docType,contr )
    BuiltIn.Delay(2000)
        'Կատարում ենք SQL ստուգում
        queryString = "select fPENULTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 39123.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'R²'"
        sql_Value = 2500.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT=  '" & CurrSwap.fBASE & "' and fTYPE = 'Rì' "
        sql_Value = 16767.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'Rî'"
        sql_Value = 55.89
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rì' and fDATE = '2018-12-02' and fOP = 'DPC'"
        sql_Value = 22356.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT= '" & CurrSwap.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Մարման աղբյուր դաշտի խմբային խմբագրում
    Call Rekvizit_Group_Fill(0,0,0,0,0,1,1,0,0,0,0,0) 
    
    'Պայմանագրի փակում
    CloseDate = "010119"
    Call Close_Contract(CloseDate)
    BUiltIn.Delay(1000)
    
    'Ստուգում է փակման ամսաթիվ սյունը
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fDATECLOSE")
    If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("01/01/19") Then
          Log.Error("Don't match")
    End If
    'Բացում է պայմանագիրը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen)
    Call ClickCmdButton(5,"²Ûá")    
    
    actionDate = "210817"
    actionEndDate = "010119"
    actionExists = True
    actionType = Null
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_OpersView)

    'Ջնջում է Դիտում և խմբագրում/Ժամկետներ/Պայմ.մարման ժամկետներ թղթապանակի բոլոր փաստաթղթերը
    actionExist = False 
    Call Delete_Actions(revDate,revDate,actionExist,actionType,c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates )

    'Ջնջում է Դիտում և խմբագրում/Տոկոսադրույքներ/Տոկոսադրույքներ թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(revDate,revDate,actionExist,actionType,c_ViewEdit & "|" & c_Percentages & "|" & c_Percentages)

    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    Call Close_Pttel("frmPttel")   

    Call Close_AsBank()
     
End Sub
