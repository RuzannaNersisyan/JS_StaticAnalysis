Option Explicit
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Derivative_Tools_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants

'Test Case Id 166689

Sub Deposit_Placed_OneTime_Contract_BlackList_Test()

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

    depositContractType = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
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
    signDate = "080116"
    kindScale = "1"
    depositPer = "10"
    part = "365"
    per = "5"
    dateGive = "080116"
    dateAgr = "090117"      
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
    Call wTreeView.DblClickItem("|î»Õ³µ³ßËí³Í ³í³Ý¹Ý»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
    Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").Close()
    BuiltIn.Delay(2000)

    'Ուղարկել <<Սև ցուցակ>> հաստատման
    Call PaySys_Send_To_Verify()
    BuiltIn.Delay(2000)
    Sys.Process("Asbank").Refresh
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClAllWindows)
    BuiltIn.Delay(1000)

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
        
'    param = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹- " & Trim(contractNum) & " {²ÝáõÝ ²½·³ÝáõÝÛ³Ý}"
'    faddate = "080116"
'    eDate = "090117"
'    fPeriod = 1
'    fDirection = 2
'    If Not Other_Payment_Schedule_AllTypes(param,faddate,faddate,eDate,fPeriod,fDirection) Then 
'        Log.Error("There was no document")
'        Exit Sub
'    End If
'    Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").Keys("[Up]")
'        
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
    calcDate = "070216"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    BuiltIn.Delay(5000)
    
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
        sql_Value = 16688.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fSUM) from HI where fBASE = '" & fOBJECT & "' and fDBCR = 'D'"
        sql_Value = 16688.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
     
    'Պարտքերի մարում
    repDate = "080216"
    mainSum = ""
    perSum = "10000"
    CashOrNo = 2
    tabN = 2
    Call Debt_Repayment(fOBJECT,repDate, mainSum,perSum,cashORno,Acc,docNum,tabN)
    BuiltIn.Delay(1000)
      
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = -1780.80
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
        
        
    'Կանխավ վճարված տոկոսների վցերադարձ 
    summ = "1232.90"
    state = True
    Call Return_Payed_Percent(repDate, summ,cashORno,acc,fOBJECT, state)  
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = -547.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' and fOP = 'RET' "
        sql_Value = 1232.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Տոկոսների խմբային հաշվարկ
    closeDate = "080716"
    Call Group_Persent_Calculate(closeDate,closeDate)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 41096.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 40822.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = -547.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 32602.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 61096.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIT where fOBJECT = '" & fBASE & "'"
        sql_Value = 49999.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If        
    
    'Պարտքերի մարում
    repDate = "090716"
    mainSum = ""
    perSum = "50000"
    Call Debt_Repayment(fOBJECT,repDate, mainSum,perSum,cashORno,Acc,docNum, tabN)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = -8903.9
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
        sql_Value = 41096.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 40822.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 111096.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Գումարի մարում տոկոսների հաշվին
    summ = "8356"
    Call Fadeing_LeasingSumma_From_PayedPercents(c_FadeDepFromPercent,repDate,"SUMMA", summ)
    BuiltIn.Delay(1000)
   
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = -547.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 119452.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
          
    'Տոկոսի հաշվարկ
    calcDate = "070816"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    BuiltIn.Delay(3000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select COUNT(*) from HIRREST  where fOBJECT = '" & fBASE & "' and ((fTYPE = 'R1' and fLASTREM = '991644.00' and fPENULTREM = '1000000.00')" & _
													        " or (fTYPE = 'R2' and fLASTREM = '7602.60' and fPENULTREM = '-547.90')" &_
													        " or (fTYPE = 'R¸' and fLASTREM = '7602.60' and fPENULTREM = '00')"  &_
													        " or (fTYPE = 'R¾' and fLASTREM = '115.00' and fPENULTREM = '136.70'))"
        sql_Value = 4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select COUNT(*) from HI where fBASE =  '" & fOBJECT & "'  and fCUR = '000' and fOP = 'PRC' " &_
          											" and ((fSUM = '8128.80'  and fCURSUM = '8128.80' and fDBCR = 'C' ) " &_
          											" or (fSUM = '8150.50' and fCURSUM = '8150.50' and fDBCR = 'D' ) " &_
          											" or (fSUM = '547.90' and fCURSUM = '547.90' and fDBCR = 'C' ) " &_
          											" or (fSUM = '8128.80' and fCURSUM = '8128.80' and fDBCR = 'D' ) " &_
          											" or (fSUM = '8150.50' and fCURSUM = '8150.50' and fDBCR = 'C' ) " &_
          											" or (fSUM = '547.90' and fCURSUM = '547.90' and fDBCR = 'D' ))"
        sql_Value = 6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select COUNT(*) from HIR where fBASE =  '" & fOBJECT & "'  and fCUR = '000' and fDBCR = 'D'  " &_
                                  " and ((fTYPE = 'R2' and fCURSUM = '8150.50' and fOP = 'PER') " &_
																	" or (fTYPE = 'R¸' and fCURSUM = '7602.60' and fOP = 'PRJ') " &_
																	" or (fTYPE = 'R¾' and fCURSUM = '-21.70' and fOP = 'PER'))"
        sql_Value = 3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select COUNT(*) from HIF where fBASE =  '" & fBASE & "'  "
        sql_Value = 28
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select COUNT(*) from HIF where fBASE = '" & fOBJECT & "' and fSUM = '0.00' and fCURSUM = '0.00' and (fOP = 'DTC' or fOP = 'PRJ')"
        sql_Value = 2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select COUNT(*) from HIT where fBASE = '" & fOBJECT & "' and fOP = 'PER' and fCUR = '000' and fSPEC = 'Îáõï³ÏáõÙ'" &_
                                 " and  fDATE = '2016-08-07 00:00:00' and ((fCURSUM = '8150.50' or fCURSUM = '-21.70')) "
        sql_Value = 2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
 
    'Հաշվարկների ճշգրտում
    repDate = "080816"
    perSum = "5000"
    Call Correction_Calculation(repDate, perSum, fOBJECT)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = " select COUNT(*) from HI where fBASE = '" & fOBJECT & "' and " &_
                                  " fSUM = '5000.00' AND fCURSUM = '5000.00' AND fOP = 'MSC'  and " &_
                                  " ((fDBCR = 'D' and fSPEC = '                         Ð³ßí³ñÏí³Í ïáÏáëÇ ×ß·ñïáõÙ        1     1.0000    1')" &_
                                  " or (fDBCR = 'C' and fSPEC = '                         Ð³ßí³ñÏí³Í ïáÏáëÇ ×ß·ñïáõÙ        0     1.0000    1'))"
        sql_Value = 2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select COUNT(*) from HIRREST  where fOBJECT =  '" & fBASE & "' and fSTARTREM = '0.00' and " &_
                                  " ((fTYPE = 'R1' and fLASTREM = '991644.00' and fPENULTREM = '1000000.00') " &_
                                  " or (fTYPE = 'R2' and fLASTREM = '12602.60' and fPENULTREM = '7602.60') " &_
                                  " or (fTYPE = 'R¸' and fLASTREM = '12602.60' and fPENULTREM = '0.00') " &_
                                  " or (fTYPE = 'R¾' and fLASTREM = '-4885.00' and fPENULTREM = '115.00'))"
        sql_Value = 4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select COUNT(*) from HIR  where fOBJECT =  '" & fBASE & "' "
        sql_Value = 44
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select COUNT(*) from HIR  where fBASE = '" & fOBJECT & "'  and fADB = '0' and fDBCR = 'D' and fCUR = '000'  " &_
                                  " and ((fTYPE = 'R2' and fCURSUM = '5000.00' and fSPEC = 'Ð³ßí³ñÏí³Í ïáÏáëÇ ×ß·ñïáõÙ') " &_
                                  " or (fTYPE = 'R¸' and fCURSUM = '5000.00' and fSPEC = 'Ä³ÙÏ»ï³Ýó ïáÏáëÇ ×ß·ñïáõÙ') " &_
                                  " or (fTYPE = 'R¾' and fCURSUM = '-5000.00' and fSPEC = '²ñ¹ÛáõÝ³í»ï ïáÏáëÇ ×ß·ñïáõÙ'))"
        sql_Value = 3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
   
    'Տոկոսների խմբային հաշվարկ
    repDate = "090117"
    Call Group_Persent_Calculate(repDate,repDate)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 54441.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 54441.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 12602.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 45748.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 174441.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIT where fOBJECT = '" & fBASE & "'"
        sql_Value = 105179.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If     
    
   'Պարտքերի մարում
    repDate = "100117"
    mainSum = "991644"
    perSum = "54441.90"
    Call Debt_Repayment(fOBJECT,repDate, mainSum,perSum,cashORno,Acc,docNum,tabN)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում " 
        queryString = " select COUNT(*) from HIRREST  where fOBJECT = " & fBASE & _
                                  " and fLASTREM = '0.00' and fSTARTREM = '0.00' " & _
                                  " and((fTYPE = 'R1' AND fPENULTREM = '991644.00') " & _
                                  " or (fTYPE = 'R2' AND fPENULTREM = '54441.90') " & _
                                  " or (fTYPE = 'RF' AND fPENULTREM = '326.00') " & _
                                  " or (fTYPE = 'R¸' AND fPENULTREM = '54441.90') " & _
                                  " or (fTYPE = 'R¾' AND fPENULTREM = '-4885.00') " & _
                                  " or (fTYPE = 'RÄ' AND fPENULTREM = '991644.00'))" 
        sql_Value = 6
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
        sql_Value = 54441.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 54441.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 991644.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select sum(fCURSUM) from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 228883.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Մարման աղբյուր դաշտի խմբային խմբագրում
    Call Rekvizit_Group_Fill(0,0,0,0,0,1,1,0,0,0,0,0)     
    
    'Պայմանագրի փակում
    CloseDate = "100117"
    Call Close_Contract(CloseDate)
    BuiltIn.Delay(2000)
    
    'Ստուգում է փակման ամսաթիվ սյունը
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fDATECLOSE")
    If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("10/01/17") Then
          Log.Error("Don't match")
    End If
    'Բացում է պայմանագիրը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen)
    Call ClickCmdButton(5,"²Ûá")
  
    actionExists = True
    actionType = ""
    
    actionEx = False
    'Ջնջում է Գործողությունների դիտում թղթապանակի  փաստաթղթերը
    Call Delete_Actions(CloseDate,CloseDate,actionEx,actionType,c_ViewEdit & "|" & c_Other & "|" & c_CalcDates)
    
    Action_Date = "100117"
    actionType = "L3"
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)    
    
    Action_Date = "090117"
    actionType = "g1"
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)    
    
    actionType = ""
    Call Delete_Actions("070816","070816",actionEx,actionType,c_ViewEdit & "|" & c_Other & "|" & c_CalcDates)
    
    Action_Date = "090716"
    actionType = "53"
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը tokosi marum
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)    
        
    Action_Date = "090716"
    actionType = "24"
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը tokosi marum
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)    
     
    Action_Date = "090716"
    actionType = "e9"
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)    

    actionType = ""
    Action_Date = "080716"
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(Action_Date,repDate,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի "Տոկոսի վերականգնում"  փաստաթղթերը
    Action_Date = "080216"
    actionType = "53"
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի "Տոկոսի վերականգնում"  փաստաթղթերը
    Action_Date = "080216"
    actionType = "57"
    Call Delete_Actions(Action_Date,Action_Date,actionExists,actionType,c_OpersView)

    'Ջնջում է Գործողությունների դիտում թղթապանակի "Ավանդի զիջում" փաստաթղթերը
    actionType = ""
    Call Delete_Actions(dateGive,Action_Date,actionExists,actionType,c_OpersView)

    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    'Փակում է ASBANK - ը
    Call Close_AsBank()       
    
End Sub