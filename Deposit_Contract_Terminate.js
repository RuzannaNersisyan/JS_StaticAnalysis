Option Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Credit_Line_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants

'Test Case Id 166661

Sub Deposit_Contract_Terminate_Test()

    Dim startDate,fDATE,fBASE,contractNum,actionType2,template,thirdPerson,accAc,thirdAcc,perAcc
    Dim depositContractType,colItem,clientCode,curr,money,signDate,chbKap,chbAuto,chbEx
    Dim kindScale,depositPer,per,dateGive,dateAgr,part,actionDate,actionType
    Dim queryString,sql_Value,colNum,sql_isEqual,verify,level,invDate,capData
    Dim cashORno,Acc,Calculate_Date,Action_Date,exDate,period,direction,scale,withScale
    Dim actionT,actionExists,actionEx,partlyTerm,summa,balance,docNum, fBASE_depInv
    
    startDATE = "20120101"
    fDATE = "20250101"
    
    'Test StartUp start
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
    Call Create_Connection()
    
    Call ChangeWorkspace(c_Deposits)
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|¸³ï³ñÏ å³ÛÙ³Ý³·Çñ")
  
    depositContractType = "²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ"
    colItem = "0"
    template = ""             
    clientCode = "00000014"
    thirdPerson = ""
    curr = "000"
    thirdAcc = ""
    perAcc = ""
    money = "500000"
    chbKap = 1
    chbAuto = 1
    chbEx = 0
    signDate = "110317"
    kindScale = "1"
    depositPer = "10"
    part = "365"
    per = "0.5"
    dateGive = "110317"
    dateAgr = "020419"    
    Acc = "77786923818"    
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
    'Լրացնել "Պայմանագարի համար"   
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    'Սեղմել "Կատարել" կոճակը
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
    invDate = "110317"
    cashORno = "2"
    Call Deposit_Involvment(fBASE_depInv, docNum, invDate, money, cashORno, Acc)
    'Կատարել Տոկոսների հաշվարկում 
    Calculate_Date  = "100417"
    Action_Date = "100417"
    Call Calculate_Percent(fBASE, Calculate_Date , Action_Date)
    Log.Message(fBASE)
    
      'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
        sql_Value = 4109.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "'"
        sql_Value = 4109.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fCURSUM from HIT where fBASE = '" & fBASE & "'"
        sql_Value = 4109.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
    'Կատարել Տոկոսների կապիտալացում
    capData = "110417"
    summa = ""
    Call  Percent_Capitalization(fBASE , capData , summa)
      
    'Կատարում է Պայմանագրի դադարեցում գործողությունը
    exDate = "110417"
    partlyTerm = false
    Call Contract_Termination(fBASE,exDate,partlyTerm,summa)
      
    'Ստուգում ենք , որ Հասշվ.% Մնացորդը նվազալինի
    balance = "499,794.50"
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fAgrRem")
    If Not Trim(wMainForm.Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(balance) Then
        Log.Error("Don՚t match")
    End If
    Log.Message(fBASE)
      
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
        sql_Value = 3904.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "'"
        sql_Value = 3904.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    
    actionDate = "110417"
    actionType = 262  
    actionT = Null
    actionExists = True
    actionEx  = False  
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(dateGive,dateAgr,actionExists,actionType,c_OpersView)
    Call Delete_Actions(dateGive,dateAgr,actionExists,actionT,c_OpersView)
    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    'Փակում է ASBANK - ը
    Call Close_AsBank()
      
End Sub