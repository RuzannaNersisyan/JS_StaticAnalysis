Option Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants

'Test Case Id 166639

Sub Deposit_Contract_OneTime_Black_List_Test()

    Dim startDate,fDATE,fBASE,contractNum,actionType2,template,thirdPerson,accAc,thirdAcc,perAcc
    Dim depositContractType,colItem,clientCode,curr,money,signDate,chbKap,chbAuto,chbEx
    Dim kindScale,depositPer,per,dateGive,dateAgr,part,actionDate,actionType
    Dim queryString,sql_Value,colNum,sql_isEqual,verify,param,level,invDate,perSum
    Dim cashORno,Acc,Calculate_Date,Action_Date,exDate,exTerm,period,direction, tabN
    Dim repDate,mainSum,actionT,actionExists,actionEx,scale,withScale,docNum, fBASE_depInv
    
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
    clientCode = "00000668"
    thirdPerson = ""
    curr = "000"
    thirdAcc = ""
    perAcc = ""
    money = "100000"
    chbKap = 0
    chbAuto = 1
    chbEx = 0
    signDate = "290317"
    kindScale = "1"
    depositPer = "10"
    part = "365"
    per = "0.5"
    dateGive = "290317"
    dateAgr = "020419"
    Acc = "33170160500"
    period = "1"
    direction = "2"
    mainSum = "2000"
    actionDate = "290417"
    actionType = 21  
    actionT = Null
    actionExists = True
    actionEx  = False
      
     scale = False
    withScale = ""
  
    'Ավանդ տեսակի պայմանագրի ստեղծում
    Call Deposit_Contract_Fill(fBASE,contractNum,template,depositContractType,colItem,_
                              ClientCode,thirdPerson,curr,Acc,thirdAcc,perAcc,money,chbKap,_
                              chbAuto,chbEx,signDate,kindScale,scale,withScale,depositPer,part,per,dateGive,_
                              dateAgr,dateGive,period,direction)
    Log.Message(fBASE)
    Log.Message(contractNum)
    'Ուղարկել «Սև ցուցակ» հաստատման
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
    Calculate_Date  = "280417"
    Action_Date = "280417"
    Call Calculate_Percent(fBASE, Calculate_Date , Action_Date)
    BuiltIn.Delay(1000)
    Log.Message(fBASE)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
        sql_Value = 821.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "'"
        sql_Value = 821.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fCURSUM from HIT where fBASE = '" & fBASE & "'"
        sql_Value = 821.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
    'Կատարում է Ժամկետների վերանայում
    exDate = "290417"
    exTerm = "010120"
    param = c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms     
    Call Deposit_Extension(exDate,exTerm,dateAgr,period,direction,Param)

    'Կատարել Տոկոսների հաշվարկում 
    Call Calculate_Percent(fBASE, exDate , exDate)
    BuiltIn.Delay(1000)
    Log.Message(fBASE)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
        sql_Value = 27.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "'"
        sql_Value = 27.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
   
        queryString = "select fCURSUM from HIT where fBASE = '" & fBASE & "'"
        sql_Value = 27.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

    'Կատարում է Պարտքերի մարում    
    repDate = "300417"
    perSum = ""
    tabN = 2
    Call Debt_Repayment (fBASE,repDate, money,perSum,cashORno,Acc,docNum,tabN)
    BuiltIn.Delay(1000)
    Log.Message(fBASE)
        
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
        sql_Value = 100000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "'"
        sql_Value = 100000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    actionDate = "300417"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView)
    
    actionType = ""
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    actionDate = "290417"
    actionType = "211"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView)
    
    'Ջնջում է Պայմ.մարման ժամկետներ թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(dateGive,dateAgr,actionT,actionEx,c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    actionT= Null
    Call Delete_Actions(dateGive,dateAgr,actionT,actionExists,c_OpersView)
    
    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    'Փակում է ASBANK - ը
    Call Close_AsBank()
    
End Sub 