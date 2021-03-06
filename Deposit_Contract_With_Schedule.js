Option Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants

'TestCase Id 166666

Sub Deposit_Contract_With_Schedule_Test()

    Dim startDate,fDATE,fBASE,contractNum,actionType2,thirdPerson,accAc,thirdAcc,perAcc
    Dim depositContractType,colItem,clientCode,curr,money,signDate,chbKap,chbAuto,chbEx, payDates,sumsDateFillType,sumsFillType
    Dim kindScale,depositPer,per,dateGive,dateAgr,part,actionDate,actionType,fillType,agrStart,agrEnd
    Dim queryString,sql_Value,colNum,sql_isEqual,verify,level,invDate,dirrection,actionT
    Dim agrType,filType,fixDate,sumType,fOBJECT,template,perSum, tabN
    Dim cashORno,Acc,Calculate_Date,Action_Date,period,direction
    Dim repDate,mainSum,actionExists,actionEx,docNum, fBASE_depInv
    
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
    clientCode = "00000014"
    thirdPerson = ""
    curr = "000"
    thirdAcc = ""
    perAcc = ""
    money = "100000"
    chbKap = 0
    chbAuto = 1
    signDate = "180917"
    dateGive = "180917"
    dateAgr = "180919"
    kindScale = "1"
    depositPer = "10"
    part = "365"
    per = "5"    
    Acc = "77786923818"
    period = "1"
    dirrection = "2"    
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
        
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").MoveFirst
    'Ուղարկել հաստատման
    Call PaySys_Send_To_Verify()
    Sys.Process("Asbank").Refresh
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    'Լրացնել "Պայմանագրի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    'Սեղմեձլ "Կատարել" կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Հաստատել Հաստատող փաստաթղթեր |- ում
    verify = True
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
    BuiltIn.Delay(4000)
    
          'Կատարում ենք SQL ստուգում
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "'"
          sql_Value = 100000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
    'Կատարել Տոկոսների հաշվարկում 
    Calculate_Date  = "091017"
    Action_Date = "091017"
    Call Calculate_Percent(fBASE, Calculate_Date , Action_Date)
    BuiltIn.Delay(3000)
    Log.Message(fBASE)
    
          'Կատարում ենք SQL ստուգում
          queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
          sql_Value = 575.30
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R¸'"
          sql_Value = 575.30
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
      
          queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R2'"
          sql_Value = 575.30
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'RÄ'"
          sql_Value = 4000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "'"
          sql_Value = 100000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
          sql_Value = 575.30
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
      
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
          sql_Value = 575.30
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'RÄ'"
          sql_Value = 4000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
          
    'Կատարում է Պարտքերի մարում
    repDate = "101017"
    mainSum = "1000"
    cashORno = "2"
    perSum = "575.30"
    tabN = 2
    Call Debt_Repayment(fBASE,repDate, mainSum,perSum,cashORno,Acc,docNum,tabN)
    BuiltIn.Delay(3000)
    Log.Message(fBASE)
    
       'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
        sql_Value = 57.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R2' and fOP = 'DBT'"
        sql_Value = 517.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R2' and fOP = 'TXD'"
        sql_Value = 57.50 
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R¸' and fOP = 'TXD'"
        sql_Value = 57.50 
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R¸' and fOP = 'DBT'"
        sql_Value = 517.80 
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000.00 
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'RÄ'"
        sql_Value = 1000.00 
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "'"
        sql_Value = 99000.00
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
        sql_Value = 3000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R1'"
        sql_Value = 100000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
        sql_Value = 575.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'RÄ'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    actionDate = Null
    actionType = "261"
    actionExists = True
    actionT = ""    
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(dateGive,dateAgr,actionExists,actionType,c_OpersView)
    Call Delete_Actions(dateGive,dateAgr,actionExists,actionT,c_OpersView)
    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    'Փակում է ASBANK - ը
    Call Close_AsBank()
      
End Sub