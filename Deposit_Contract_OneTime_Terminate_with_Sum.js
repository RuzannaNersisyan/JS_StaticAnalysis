Option Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Credit_Line_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants

'Test Case Id 166644

Sub Deposit_Contract_OneTime_Terminate_with_Sum_Test()

    Dim startDate,fDATE,fBASE,contractNum,actionType2,template,thirdPerson,accAc,thirdAcc,perAcc
    Dim depositContractType,colItem,clientCode,curr,money,signDate,chbKap,chbAuto,chbEx
    Dim kindScale,depositPer,per,dateGive,dateAgr,part,actionDate,actionType,summ
    Dim queryString,sql_Value,colNum,sql_isEqual,verify,level,invDate,capData
    Dim cashORno,Acc,Calculate_Date,Action_Date,exDate,exTerm,period,direction,docNum
    Dim actionT,actionExists,actionEx,partlyTerm,summa,balance,scale,withScale, fBASE_depInv
    
    startDATE = "20120101"
    fDATE = "20250101"
    
    'Test StartUp start
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
    Call Create_Connection()
    
    Call ChangeWorkspace(c_Deposits)
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|¸³ï³ñÏ å³ÛÙ³Ý³·Çñ")
  
    depositContractType = "²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ"
    colItem = "2"
    template = ""             
    clientCode = "00000014"
    thirdPerson = ""
    curr = "000"
    thirdAcc = ""
    perAcc = ""
    money = "300000"
    chbKap = 1
    chbAuto = 1
    chbEx = 0
    signDate = "290317"
    kindScale = "1"
    depositPer = "10"
    part = "365"
    per = "0.5"
    dateGive = "290317"
    dateAgr = "020419"     
    Acc = "77786923818"
    exTerm = "010120"
    period = "1"
    direction = "2"    
    scale = False
    withScale = ""
  
    'Ավանդ տեսակի պայմանագրի ստեղծում
    Call Deposit_Contract_Fill(fBASE,contractNum,template,depositContractType,colItem,_
                              ClientCode,thirdPerson,curr,Acc,thirdAcc,perAcc,money,chbKap,_
                              chbAuto,chbEx,signDate,kindScale,scale,withScale,depositPer,part,per,dateGive,_
                              dateAgr,dateGive,period,direction)
    Log.Message(fBASE)
    Log.Message(contractNum)
    'Ուղարկել հաստատման
    Call PaySys_Send_To_Verify()
    Sys.Process("Asbank").Refresh
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    'Լրացնել "Պայմանագրի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    'Սեղմել "Կատարել: կոճակը
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
    invDate = "290317"
    cashORno = "2"
    Call Deposit_Involvment(fBASE_depInv, docNum, invDate, money, cashORno, Acc)
    'Կատարել Տոկոսների հաշվարկում    
    Calculate_Date  = "300417"
    Action_Date = "300417"
    Call Calculate_Percent(fBASE, Calculate_Date , Action_Date)
    BuiltIn.Delay(1000)
    Log.Message(fBASE)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
        sql_Value = 2630.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "'"
        sql_Value = 2630.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fCURSUM from HIT where fBASE = '" & fBASE & "'"
        sql_Value = 2630.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
    'Կատարել Տոկոսների կապիտալացում
    summ = ""
    capData = "010517"
    Call  Percent_Capitalization(fBASE , capData , summ)
      
    'Կատարում է Պայմանագրի դադարեցում գործողությունը
    exDate = "010517"
    partlyTerm = True
    summa = "5000"
    Call Contract_Termination(fBASE,exDate,partlyTerm,summa)
      
    'Ստուգում ենք , որ Հասշվ.% Մնացորդը լինի 302,325.50
    balance = "302,325.50"
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fAgrRem")
    If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(balance) Then
        Log.Error("Don՚t match")
    End If
    Log.Message(fBASE)
      
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
        sql_Value = 41.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "'"
        sql_Value = 41.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
          
    actionDate = "290417"
    actionType = 262  
    actionT = Null
    actionExists = True
    actionEx  = False
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(dateGive,dateAgr,actionExists,actionType,c_OpersView)
    actionT = "15"
    Call Delete_Actions(dateGive,dateAgr,actionExists,actionT,c_OpersView)
     actionT = Null
    Call Delete_Actions(dateGive,dateAgr,actionExists,actionT,c_OpersView)
    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    'Փակում է ASBANK - ը
    Call Close_AsBank()
    
End Sub