Option Explicit
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Derivative_Tools_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants

'Test Case Id 166670

Sub Deposit_Placed_Contract_Test()

    Dim startDate,fDATE,fBASE,contractNum,actionType2,actType,template,thirdPerson,accAc,thirdAcc,perAcc
    Dim depositContractType,colItem,clientCode,curr,money,signDate,chbKap,chbAuto,chbEx
    Dim kindScale,depositPer,per,dateGive,dateAgr,part,actionDate,actionType,sumPer
    Dim queryString,sql_Value,colNum,sql_isEqual,verify,param,level,invDate,closeDate,perCalc
    Dim cashORno,Acc,Calculate_Date,Action_Date,summ,exDate,exTerm,period,direction, tabN
    Dim repDate,mainSum,actionT,actionExists,actionEx,scale,withScale,docNum,actingType
    Dim faddate,faDate,debtDate,eDate,fPeriod,fDirection,calcDate,fOBJECT,perSum,dateStart, state
    
    startDATE = "20120101"
    fDATE = "20250101"
    
    
    'Test StartUp start
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
    Call Create_Connection()
    
    Call ChangeWorkspace(c_DepositPlaced)
    Call wTreeView.DblClickItem("|î»Õ³µ³ßËí³Í ³í³Ý¹Ý»ñ|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
  
    depositContractType = "²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ"
    colItem = "0"
    template = ""             
    clientCode = ""
    thirdPerson = ""
    curr = "000"
    thirdAcc = ""
    perAcc = ""
    money = "1000000"
    chbKap = 0
    chbAuto = 1
    chbEx = 1
    signDate = "180516"
    kindScale = "1"
    depositPer = "10"
    part = "365"
    per = "5"
    dateGive = "180516"
    dateAgr = "180518"      
    Acc = "30220042300"      
    period = "1"
    direction = "2"      
    scale = False
    withScale = ""
  
    'Ավանդ տեսակի պայմանագրի ստեղծում
    Call Deposit_Contract_Fill(fBASE,contractNum,template,depositContractType,colItem, _
                                ClientCode,thirdPerson,curr,Acc,thirdAcc,perAcc,money,chbKap,_
                                chbAuto,chbEx,signDate,kindScale,scale,withScale,depositPer,part,per,dateGive,_
                                dateAgr,dateGive,period,direction)
    Log.Message(fBASE)
    Log.Message(contractNum) 
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fSTATE from DOCS where fISN = '" & fBASE & "'"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Այլ վճարումների գրաֆիկի նշանակում
    param = "²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ- "& Trim(contractNum) &" {öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1}"
    fPeriod = 1
    fDirection = 2
    If Not Other_Payment_Schedule_AllTypes(param,signDate,signDate,dateAgr,fPeriod,fDirection) Then 
        Log.Error("There was no document")
        Exit Sub
    End If
    Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").Keys("[Up]")

    'Ուղարկել  հաստատման
    Call PaySys_Send_To_Verify()
    Call Close_Window(wMDIClient, "frmPttel")
    'Անցում կատարել "Ավանդներ(ներգրաված)" ԱՇՏ
    Call ChangeWorkspace(c_DepositPlaced)
    Call wTreeView.DblClickItem("|î»Õ³µ³ßËí³Í ³í³Ý¹Ý»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    BuiltIn.Delay(1000)
    'Լրացնել "Պայմանագարի համար"   
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    '՚Սեղմել "Կատարել" կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Հաստատել Հաստատող փաստաթղթեր |- ում
    verify = True
    Call PaySys_Verify(verify)
    Call Close_Window(wMDIClient, "frmPttel" )   
    Call wTreeView.DblClickItem("|î»Õ³µ³ßËí³Í ³í³Ý¹Ý»ñ|ä³ÛÙ³Ý³·ñ»ñ")
    'Լրացնում է Պայմանագրի մակարդակ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","LEVEL",level)
    'Լրացնում է Պայմանագրի համար դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fSTATE from DOCS where fISN = '" & fBASE & "'"
        sql_Value = 7
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fSUM from HIF where fBASE = '" & fBASE & "' and fOP = 'PAG'"
        sql_Value = 10.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fSUM from HIF where fBASE = '" & fBASE & "' and fOP = 'PBR'"
        sql_Value = 5.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM from HIF where fBASE = '" & fBASE & "' and fOP = 'PBR'"
        sql_Value = 365.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIF where fBASE = '" & fBASE & "' and fOP = 'PAG'"
        sql_Value = 365.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Ավանդի տրամադրում
    Call Give_Deposit(signDate, money, direction, Acc) 
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R1' "
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Տոկոսի հաշվարկ
    calcDate = "190616"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 8767.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 8767.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 8767.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 8767.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fSUM) from HI where fBASE = '" & fOBJECT & "' and fDBCR = 'C' "
        sql_Value = 17534.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fSUM) from HI where fBASE = '" & fOBJECT & "' and fDBCR = 'D'"
        sql_Value = 17534.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
     
    'Պարտքերի մարում
    repDate = "200616"
    mainSum = ""
    perSum = "10000"
    CashOrNo = 2
    tabN = 2
    Call Debt_Repayment(fOBJECT,repDate, mainSum,perSum,cashORno,Acc,docNum,tabN)
    BuiltIn.Delay(1000)
      
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = -1232.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 8767.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        
    'Կանխավ վճարված տոկոսների վցերադարձ 
    summ = "1232.90"
    state = False
    Call Return_Payed_Percent(repDate, summ,cashORno,acc,fOBJECT, state)  
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' and fOP = 'RET' "
        sql_Value = 1232.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Տոկոսների խմբային հաշվարկ
    closeDate = "201117"
    Call Group_Persent_Calculate(closeDate,closeDate)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 142192.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value =141918.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 132876.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 162192.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIT where fOBJECT = '" & fBASE & "'"
        sql_Value = 150959.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If        
    
    'Պարտքերի մարում
    repDate = "211117"
    mainSum = ""
    perSum = "160000"
    Call Debt_Repayment(fOBJECT,repDate, mainSum,perSum,cashORno,Acc,docNum, tabN)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = -17808.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 142192.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 141918.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 322192.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Գումարի մարում տոկոսների հաշվին
    summ = "17808"
    Call Fadeing_LeasingSumma_From_PayedPercents(c_FadeDepFromPercent,repDate,"SUMMA", summ)
    BuiltIn.Delay(1000)
   
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 340000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Հաշվարկների ճշգրտում
    perSum = "5000"
    Call Correction_Calculation(repDate, perSum, fOBJECT)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 5000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 5000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 345000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
   
    'Տոկոսների խմբային հաշվարկ
    repDate = "100518"
    Call Group_Persent_Calculate(repDate,repDate)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 51015.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 44825.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 5000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 36753.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 391015.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIT where fOBJECT = '" & fBASE & "'"
        sql_Value = 196974.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If     
    
   'Պարտքերի մարում
    repDate = "110518"
    mainSum = "982192"
    perSum = "51015"
    Call Debt_Repayment(fOBJECT,repDate, mainSum,perSum,cashORno,Acc,docNum, tabN)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R1' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 51015.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 44825.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 982192.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 442030.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Մարման աղբյուր դաշտի խմբային խմբագրում
    Call Rekvizit_Group_Fill(0,0,0,0,0,1,1,0,0,0,0,0)    
    
    'Պայմանագրի փակում
    CloseDate = "120518"
    Call Close_Contract(CloseDate)
    BuiltIn.Delay(2000)
    
    'Ստուգում է փակման ամսաթիվ սյունը
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fDATECLOSE")
    If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("12/05/18") Then
          Log.Error("Don't match")
    End If
    'Բացում է պայմանագիրը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen)
    Call ClickCmdButton(5,"²Ûá")
  
    actionExists = True
    actionEx = False
    actionType = ""
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի  փաստաթղթերը
    Call Delete_Actions(CloseDate,CloseDate,actionEx,actionType,c_ViewEdit & "|" & c_Other & "|" & c_CalcDates)
    BuiltIn.Delay(1000)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակից
    Action_Date = "110518"
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակից
    Action_Date = "100518"
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)

    Action_Date = "211117"
    actionType = "53"
    'Ջնջում է Գործողությունների դիտում թղթապանակի  փաստաթղթերը
    Call Delete_Actions(Action_Date,Action_Date,actionEx,actionType,c_ViewEdit & "|" & c_Other & "|" & c_AccAdjust)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակից
    Action_Date = "211117"
    actionType = "24"
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակից
    Action_Date = "211117"
    actionType = "53"
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակից
    Action_Date = "211117"
    actionType = ""
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)

    'Ջնջում է Գործողությունների դիտում թղթապանակից
    Action_Date = "201117"
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի "Տոկոսի վերականգնում"  փաստաթղթերը
    Action_Date = "200616"
    actionType = "53"
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)
    'Ջնջում է Գործողությունների դիտում, կարամ թղթապանակի "Ավանդի զիջում" փաստաթղթերը
    actionType = "57"
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)
    'Ջնջում է Գործողությունների դիտում, կարամ թղթապանակի "Ավանդի զիջում" փաստաթղթերը
    actionType = ""
    Call Delete_Actions(dateGive,Action_Date,actionExists,actionType,c_OpersView)
    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    Call Close_Window(wMDIClient, "frmPttel")
    'Փակում է ASBANK - ը
    Call Close_AsBank()       
    
End Sub