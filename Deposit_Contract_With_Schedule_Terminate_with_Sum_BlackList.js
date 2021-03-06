Option Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Credit_Line_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants

'TestCase Id 166668

Sub Deposit_Contract_With_Schedule_Terminate_with_Sum_BlackList_Test()
   
    Dim startDate,fDATE,fBASE,contractNum,actionType2,thirdPerson,accAc,thirdAcc,perAcc
    Dim depositContractType,colItem,clientCode,curr,money,signDate,chbKap,chbAuto,chbEx, payDates,sumsDateFillType,sumsFillType
    Dim kindScale,depositPer,per,dateGive,dateAgr,part,fillType,agrStart,agrEnd
    Dim queryString,sql_Value,colNum,sql_isEqual,verify,level,invDate,dirrection
    Dim agrType,filType,fixDate,sumType,balance,sum,capData,action,fOBJECT, tabN
    Dim cashORno,Acc,Calculate_Date,Action_Date,exDate,exTerm,period,direction
    Dim repDate,actionExists,actionEx,partlyTerm,summa,perSum,summ,template,docNum, fBASE_depInv
    
    startDATE = "20120101"
    fDATE = "20250101"
    
    'Test StartUp start
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
    Call Create_Connection()
    
    Call ChangeWorkspace(c_Deposits)
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|¸³ï³ñÏ å³ÛÙ³Ý³·Çñ")
  
    depositContractType = "¶ñ³ýÇÏáí ³í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ"
    colItem = "1"    
    template = ""       
    clientCode = "00000668"
    thirdPerson = ""
    curr = "000"
    thirdAcc = ""
    perAcc = ""
    money = "700000"
    chbKap = 1
    chbAuto = 1
    signDate = "180917"
    dateGive = "180917"
    dateAgr = "180919"
    kindScale = "1"
    depositPer = "10"
    part = "365"
    per = "5"    
    Acc = "33170160500"    
    exTerm = "170919"
    period = "1"
    dirrection = "2"    
    verify = True
    fillType = ""
    agrStart = ""
    agrEnd = ""       
    
    'Ավանդ տեսակի պայմանագրի ստեղծում
    Call Deposit_Contract_With_Schedule_Fill(fOBJECT,contractNum,depositContractType,colItem,template, _
                                  ClientCode,thirdPerson,curr,Acc,thirdAcc,perAcc,money,chbKap,_
                                  chbAuto,signDate,dateGive,dateAgr,fillType,agrStart,agrEnd,_
                                  payDates,sumsDateFillType,sumsFillType,dirrection,kindScale,depositPer,part,per)
    Log.Message(fOBJECT)
    Log.Message(contractNum)
    'Մարումների գրաֆիկի նշանակում
    filType = "1"
    fixDate = "10"
    sumType = "1"
    agrType = "01"
    Call Deposit_Fade_Schedule_fill(fBASE,dateGive,filType,fixDate,sumType,agrType)    
    Log.Message(fBASE)    
    
          'Կատարում ենք SQL ստուգում
          queryString = "select Count(*) from AGRSCHEDULE where fBASE = '" & fBASE & "'"
          sql_Value = 1
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select Count(*) from AGRSCHEDULEVALUES where fAGRISN = '" & fOBJECT & "'"
          sql_Value = 50
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").MoveFirst
    'Ուղարկել հաստատման «Սև ցուցակ» 
    Call PaySys_Send_To_Verify()
    Sys.Process("Asbank").Refresh
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()

    'Վավերացնում է պայմանագիրը «Սև ցուցակ» ԱՇՏ-ում
    Call ChangeWorkspace(c_BLVerifyer)
    Call wTreeView.DblClickItem("|§ê¨ óáõó³Ï¦ Ñ³ëï³ïáÕÇ ²Þî|Ð³ëï³ïíáÕ Ý»ñ·ñ³íí³Í ÙÇçáóÝ»ñ")
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")    
    Call Validate_Doc()
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()

    'Անցում կատարել "Ավանդներ(ներգրաված)" ԱՇՏ
    Call ChangeWorkspace(c_Deposits)
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    'Լրացնել "Պայմանագրի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    'Սեղմեձլ "Կատարել" կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Հաստատել Հաստատող փաստաթղթեր |- ում
    Call PaySys_Verify(verify)
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    'Լրացնել "Պայմանագրի Մակարդակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","LEVEL",level)
    'Լրացնել "Պայմանագրի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    'Սեղմեձլ "Կատարել" կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Կատարում է Ավանդի ներգրավում
    level = "1"
    invDate = "180917"
    cashORno = "2"
    Call Deposit_Involvment(fBASE_depInv, docNum, invDate, money, cashORno, Acc)
    'Կատարել Տոկոսների հաշվարկում 
    Calculate_Date  = "091017"
    Action_Date = "091017"
    Call Calculate_Percent(fBASE, Calculate_Date , Action_Date)
    BuiltIn.Delay(1000)
    Log.Message(fBASE)
    
          'Կատարում ենք SQL ստուգում
          queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
          sql_Value = 4027.40
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select  fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R¸'"
          sql_Value = 4027.40
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
      
          queryString = "select  fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R2'"
          sql_Value = 4027.40
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select  fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'RÄ'"
          sql_Value = 28000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "'"
          sql_Value = 700000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
          sql_Value = 4027.40
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
      
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
          sql_Value = 4027.40
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'RÄ'"
          sql_Value = 28000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
         
    'Կատարել Տոկոսների կապիտալացում
    capData = "101017"    
    summ = ""
    Call  Percent_Capitalization(fBASE , capData , summ)
    Log.Message(fBASE)
    
          'Կատարում է SQL  ստուգում
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "'"
          sql_Value = 703624.70
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
          sql_Value = 0.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
      
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
          sql_Value = 0.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'RÄ'"
          sql_Value = 28000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select Count(*) from HIR where fBASE = '" & fBASE & "'"
          sql_Value = 5
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
           queryString = "select Count(*) from HI where fBASE = '" & fBASE & "'"
          sql_Value = 6
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select Count(*) from AGRSCHEDULEVALUES where fAGRISN = '" & fOBJECT & "'"
          sql_Value = 100
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
    'Կատարում է Պարտքերի մարում
    repDate = "101017"
    sum = "50000"
    perSum = ""
    tabN = 2
    Call Debt_Repayment(fBASE,repDate, sum,perSum,cashORno,Acc,docNum, tabN)
    BuiltIn.Delay(1000)
    Log.Message(fBASE)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
        sql_Value = 50000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "'  and fTYPE = 'RÄ' "
        sql_Value = 28000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
       queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "'"
       sql_Value = 653624.70
       colNum = 0
       sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
       If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
       End If
    
       queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
       sql_Value = 0.00
       colNum = 0
       sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
       If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
       End If
      
       queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
       sql_Value = 0.00
       colNum = 0
       sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
       If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
       End If
        
       queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'RÄ'"
       sql_Value = 0.00
       colNum = 0
       sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
       If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
       End If
       
       queryString = "select Count(*) from AGRSCHEDULEVALUES where fAGRISN = '" & fOBJECT & "'"
       sql_Value = 148
       colNum = 0
       sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
       If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
       End If
      
    'Կատարում է Պայմանագրի դադարեցում գործողությունը 
    exDate = "101017"
    partlyTerm = True
    summa = "5000"
    Call Contract_Termination(fBASE,exDate,partlyTerm,summa)
     
    'Ստուգում ենք , որ Հասշվ.% Մնացորդը նվազալինի
    balance = "653,610.30"
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fAgrRem")
    If Not Trim(wMainForm.Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(balance) Then
        Log.Error("Don՚t match")
    End If
    Log.Message(fBASE)
      
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
        sql_Value = 14.4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "'"
        sql_Value = 14.4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "'"
        sql_Value = 653610.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'RÄ'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
    dateGive = "101017"
    actionExists = True
    action = "12"
    'Ջնջում է Գործողությունների դիտում թղթապանակից
    Call Delete_Actions(dateGive,dateGive,actionExists,action,c_OpersView)
    'Ջնջում է Գործողությունների դիտում թղթապանակից
    action = "262"
    Call Delete_Actions(dateGive,dateGive,actionExists,action,c_OpersView)
    'Ջնջում է Գործողությունների դիտում թղթապանակից
    action = "27"
    Call Delete_Actions(dateGive,dateGive,actionExists,action,c_OpersView)
    'Ջնջում է Գործողությունների դիտում թղթապանակից
    action = "15"
    Call Delete_Actions(dateGive,dateGive,actionExists,action,c_OpersView)
    'Ջնջում է Գործողությունների դիտում թղթապանակից
    action = "71"
    Call Delete_Actions(dateGive,dateGive,actionExists,action,c_OpersView)
    'Ջնջում է Գործողությունների դիտում թղթապանակից
    dateGive = ""
    action = ""
    Call Delete_Actions(dateGive,dateGive,actionExists,action,c_OpersView)
    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    wMDIClient.VBObject("frmPttel").Close()
    'Փակում է ASBANK - ը
    Call Close_AsBank()
      
End Sub
    