Option Explicit
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Derivative_Tools_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants

'Test Case Id 166679

Sub Deposit_Placed_Contract_Black_List_Test()

    Dim startDate,fDATE,fBASE,contractNum,actionType2,actType,template,thirdPerson,accAc,thirdAcc,perAcc
    Dim depositContractType,colItem,clientCode,curr,money,signDate,chbKap,chbAuto,chbEx
    Dim kindScale,depositPer,per,dateGive,dateAgr,part,actionDate,actionType,sumPer
    Dim queryString,sql_Value,colNum,sql_isEqual,verify,param,level,invDate,closeDate,perCalc
    Dim cashORno,Acc,Calculate_Date,Action_Date,summ,exDate,exTerm,period,direction, tabN
    Dim repDate,mainSum,actionT,actionExists,actionEx,scale,withScale,docNum,actingType
    Dim faddate,faDate,eDate,fPeriod,fDirection,calcDate,fOBJECT,perSum,dateStart
    
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
    clientCode = "00000668"
    thirdPerson = ""
    curr = "000"
    thirdAcc = ""
    perAcc = ""
    money = "1000000"
    chbKap = 0
    chbAuto = 1
    chbEx = 1
    signDate = "101016"
    kindScale = "1"
    depositPer = "10"
    part = "365"
    per = "5"
    dateGive = "101016"
    dateAgr = "101018"      
    Acc = "33170160500"      
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
    param = "²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ- "& Trim(contractNum) &" {²ÝáõÝ ²½·³ÝáõÝÛ³Ý}"
    fPeriod = 1
    fDirection = 2
    If Not Other_Payment_Schedule_AllTypes(param,signDate,signDate,dateAgr,fPeriod,fDirection) Then 
        Log.Error("There was no document")
        Exit Sub
    End If
    Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").Keys("[Up]")

    'Ուղարկել <<Սև ցուցակ>> հաստատման
    Call PaySys_Send_To_Verify()
    Sys.Process("Asbank").Refresh
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    'Վավերացնում է պայմանագիրը «Սև ցուցակ» ԱՇՏ-ում
    Call ChangeWorkspace(c_BLVerifyer)
    Call wTreeView.DblClickItem("|§ê¨ óáõó³Ï¦ Ñ³ëï³ïáÕÇ ²Þî|Ð³ëï³ïíáÕ ï»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ ¨ »ñ³ßË³íáñáõÃÛáõÝÝ»ñ")
    Call Rekvizit_Fill("Dialog",1,"General","SUBSYS","C2")
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    Call Validate_Doc()
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
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
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
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
    calcDate = "091116"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 8219.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 8219.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 8219.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 8219.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fSUM) from HI where fBASE = '" & fOBJECT & "' and fDBCR = 'C' "
        sql_Value = 16438.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fSUM) from HI where fBASE = '" & fOBJECT & "' and fDBCR = 'D'"
        sql_Value = 16438.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
     
    'Պահուստավորում
    faddate = "101116"
    Call FillDoc_Store(faddate,fOBJECT)
    Log.Message(fOBJECT)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R4'"
        sql_Value = 10082.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R4'"
        sql_Value = 10082.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If        
    
    'Դուրս գրում  
    dateStart = "101116"  
    perSum = "219.20"
    mainSum = "8000"
    Call FillDoc_Write_Out(dateStart, fOBJECT, mainSum,perSum)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R4'"
        sql_Value = 1863
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R4'"
        sql_Value = 10082.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R5'"
        sql_Value = 8000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R6'"
        sql_Value = 219.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIT where fOBJECT = '" & fBASE & "'"
        sql_Value = 8219.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Դուրս գրման վերականգնում գործողություն 
    mainSum = "4000"
    sumPer = "0.00"
    Call FillDoc_Write_Back(dateStart, mainSum,sumPer, fOBJECT)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R4'"
        sql_Value = 5863
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R5'"
        sql_Value = 4000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R6'"
        sql_Value = 219.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R5' and fOP = 'INC'"
        sql_Value = 4000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R4' and fOP = 'INC'"
        sql_Value = 4000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Պարտքերի զիջում գործողություն
    summ = "2000"
    Call FillDoc_YieldDebt(dateStart, summ, fOBJECT)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R5'"
        sql_Value = 2000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 998000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R5' and fOP = 'LET'"
        sql_Value = 2000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R1' and fOP = 'LET'"
        sql_Value = 2000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If    
    
    'Դուրս գրման վերականգնում և մարում
    perSum = ""
    Call FillDoc_RestoreFade(dateStart,summ, perSum, fOBJECT)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R5'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 996000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R4'"
        sql_Value = 8082.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 8219.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R4'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
        
        queryString = "select Sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 8438.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
        
    'Տոկոսների խմբային հաշվարկ
    closeDate = "100518"
    Call Group_Persent_Calculate(closeDate,closeDate)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 156990.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R4'"
        sql_Value = 8082.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 157263.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 148804.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select Sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 157701.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
        
    'Պարտքերի մարում
    repDate = "110518"
    mainSum = ""
    perSum = "156990.60"
    cashORno = 2
    tabN = 2
    Call Debt_Repayment(fOBJECT,repDate, mainSum,perSum,cashORno,Acc,docNum, tabN)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 272.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 156990.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 157263.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select Sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 314692.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
    
    'Տոկոսների խմբային հաշվարկ
    closeDate = "101018"
    Call Group_Persent_Calculate(closeDate,closeDate)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 41750.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 41750.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 272.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 33563.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select Sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 356169.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
        
    'Պարտքերի մարում
    repDate = "111018"
    mainSum = "996000"
    perSum = "41750.20"
    tabN = 2
    Call Debt_Repayment(fOBJECT,repDate, mainSum,perSum,cashORno,Acc,docNum, tabN)
    BuiltIn.Delay(1000)
    'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 0 '41750.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 41750.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 41750.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 996000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select Sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 397920.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If 
    
    'Մարման աղբյուր դաշտի խմբային խմբագրում
    Call Rekvizit_Group_Fill(0,0,0,0,0,1,1,0,0,0,0,0)    
    
    'Պայմանագրի փակում
    CloseDate = "111018"
    Call Close_Contract(CloseDate)
    BuiltIn.Delay(1000)
    'Ստուգում է փակման ամսաթիվ սյունը
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fDATECLOSE")
    If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("11/10/18") Then
          Log.Error("Don't match")
    End If
    'Բացում է պայմանագիրը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen)
    Call ClickCmdButton(5,"²Ûá")
  
    Action_Date = "100518"
    actionExists = True
    actionEx = False
    actionType = ""
    'Ջնջում է Գործողությունների դիտում թղթապանակի  փաստաթղթերը
    Call Delete_Actions(repDate,repDate,actionEx,actionType,c_ViewEdit & "|" & c_Other & "|" & c_CalcDates)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(repDate,repDate,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Action_Date = "101018"
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Action_Date = "110518"
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Action_Date = "100518"
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)

    Action_Date = "101116"
   BuiltIn.Delay(delay_middle)
   
   Call wMainForm.MainMenu.Click(c_AllActions)
   Call wMainForm.PopupMenu.Click(c_OpersView)
   'Լրացնում է սկզբնաժամկետ դաշտը
   Call Rekvizit_Fill("Dialog",1,"General","START","![End]" & "[Del]" & Action_Date)
   'Լրացնում է վերջնաժամկետ դաշտը
   Call Rekvizit_Fill("Dialog",1,"General","END","![End]" & "[Del]" & Action_Date)
   '՚Լրացնում է Գործողության տեսակ դաշտը  
   If actionExists Then
     Call Rekvizit_Fill("Dialog",1,"General","DEALTYPE", "22")
   End If
   Call ClickCmdButton(2, "Î³ï³ñ»É")
  
   Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).Refresh
   BuiltIn.Delay(2000)
   
     'Կատարում է ջնջել գործողությունը
     Call wMainForm.MainMenu.Click(c_AllActions)
     Call wMainForm.PopupMenu.Click(c_Delete)
     If Sys.Process("Asbank").WaitVBObject("frmDeleteDoc", 1500).Exists Then
        Call ClickCmdButton(3, "²Ûá")
        Call ClickCmdButton(5, "²Ûá")
        BuiltIn.Delay(2000)
     End If
     
     'Փակում է պատուհանը
     BuiltIn.Delay(1000)
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClCurrWindow)
   
    'Ջնջում է Գործողությունների դիտում թղթապանակի "Ավանդի զիջում" փաստաթղթերը
    actionType = "25"
    Call Delete_Actions(dateStart,dateStart,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի "Ավանդի վերականգնում" փաստաթղթերը 
    actionType = "T2"   
    Call Delete_Actions(dateStart,dateStart,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի "Տոկոսի վերականգնում"  փաստաթղթերը
    actionType = "U3"
    Call Delete_Actions(dateStart,dateStart,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    actionType = ""
    dateStart = ""
    Call Delete_Actions(dateStart,dateStart,actionExists,actionType,c_OpersView)
    
    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    
    'Փակում է ASBANK - ը
    Call Close_AsBank()    
    
End Sub