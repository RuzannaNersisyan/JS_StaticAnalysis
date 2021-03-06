Option Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Mortgage_Library
'USEUNIT Library_Contracts

'Test Case Id 166641

Sub Deposit_Contract_Group_Extension_Test()

    Dim fBASE,contractNum,depositContractType,ClientCode,thirdPerson
    Dim accAc,thirdAcc,perAcc,money,chbKap, chbAuto,chbEx,signDate
    Dim kindScale,depositPer,part,per,dateAgr,startDATE,fDATE, contractNum2
    Dim level,invDate,cashORno,Acc,Calculate_Date,Action_Date, onlyCh
    Dim exDate,exTerm,period,direction,repDate,mainSum,actionT,actionType
    Dim actionExists,actionEx,param, verify,contractDate,extDate, endDate
    Dim queryString,sql_Value,colNum,sql_isEqual,fOBJECT,fOBJECT1,contracts
    Dim cap,ext,rep,perc,perCalc,close,docNum,depositPerc,actionDate,dateGive, fBASE_depInv
    startDATE = "20120101"
    fDATE = "20250101"
    
    'Test StartUp start
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
    Call Create_Connection()
    
    Call ChangeWorkspace(c_Deposits)
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
  
    contractDate = "100618"
    depositContractType = "0001"    
    clientCode = "00000668"
    thirdPerson = ""
    thirdAcc = ""
    accAc = ""
    perAcc = ""
    money = "100000"
    chbKap = 0
    chbAuto = 1
    chbEx = 1
    kindScale = "1"
    depositPer = "10"
    depositPerc = "15"
    part = "365"
    per = "0.5"
    dateAgr = "101218"      
    Acc = "33170160500"      
    period = "1"
    direction = "2"
    repDate = "300416"      
         
    Call Deposit_Contract_Fill_with_Template(fOBJECT,contractNum,depositContractType,contractDate, _
                    ClientCode,thirdPerson,accAc,thirdAcc,perAcc,money,chbKap,_
                    chbAuto,chbEx,kindScale,depositPerc,part,per,dateAgr)

    Log.Message(fOBJECT)
    Log.Message(contractNum)
    'Ուղարկել «Սև ցուցակ» հաստատման
    BuiltIn.Delay(2000)
    Call PaySys_Send_To_Verify()
    BuiltIn.Delay(2000)
    Sys.Process("Asbank").Refresh
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClAllWindows)
    BuiltIn.Delay(1000)
    'Վավերացնում է պայմանագիրը «Սև ցուցակ» ԱՇՏ-ում
    Call ChangeWorkspace(c_BLVerifyer)
    BuiltIn.Delay(2000)
    Call wTreeView.DblClickItem("|§ê¨ óáõó³Ï¦ Ñ³ëï³ïáÕÇ ²Þî|Ð³ëï³ïíáÕ Ý»ñ·ñ³íí³Í ÙÇçáóÝ»ñ")
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É") 
    BuiltIn.Delay(2000)   
    Call Validate_Doc()
    Call Close_Pttel("frmPttel")
    'Անցում կատարել "Ավանդներ(ներգրաված)" ԱՇՏ
    Call ChangeWorkspace(c_Deposits)
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    'Լրացնել "Պայմանագարի համար"   
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    'Սեղմել "Կատարել" կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Հաստատել Հաստատող փաստաթղթեր |- ում
    verify = True
    BuiltIn.Delay(2000)
    Call PaySys_Verify(verify)
    Call Close_Pttel("frmPttel")
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    'Լրացնել "Պայմանագրի Մակարդակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","LEVEL",level)
    'Լրացնել "Պայմանագրի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    'Սեղմեձլ "Կատարել" կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Կատարում է Ավանդի ներգրավում
    level = "1"
    invDate = "100618"
    cashORno = "2"
    Call Deposit_Involvment(fBASE_depInv, docNum, invDate, money, cashORno, Acc)
    'Կատարել Տոկոսների հաշվարկում 
    Calculate_Date  = "090718"
    Action_Date = "090718"
    Call Calculate_Percent(fBASE, Calculate_Date , Action_Date)
    BuiltIn.Delay(1000)
    Log.Message(fBASE)
    Call Close_Pttel("frmPttel")
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
        sql_Value = 1225.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 1191.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R¾'"
        sql_Value = 34
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fCURSUM from HIT where fBASE = '" & fBASE & "'"
        sql_Value = 1191.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R1'"
        sql_Value = 100000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
        sql_Value = 1191.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
        sql_Value = 1191.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¾'"
        sql_Value = 34
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    Sys.Process("Asbank").VBObject("MainForm").Refresh()
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
   
    depositContractType = "0002"
    
    Call Deposit_Contract_Fill_with_Template(fOBJECT1,contractNum2,depositContractType,contractDate, _
                        ClientCode,thirdPerson,accAc,thirdAcc,perAcc,money,chbKap,_
                        chbAuto,chbEx,kindScale,depositPer,part,per,dateAgr)

    Log.Message(fOBJECT1)
    Log.Message(contractNum2)
    BuiltIn.Delay(2000)
    'Ուղարկել «Սև ցուցակ» հաստատման
    Call PaySys_Send_To_Verify()
    BuiltIn.Delay(4000)
    Sys.Process("Asbank").Refresh
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClAllWindows)
    BuiltIn.Delay(1000)
    'Վավերացնում է պայմանագիրը «Սև ցուցակ» ԱՇՏ-ում
    Call ChangeWorkspace(c_BLVerifyer)
    Call wTreeView.DblClickItem("|§ê¨ óáõó³Ï¦ Ñ³ëï³ïáÕÇ ²Þî|Ð³ëï³ïíáÕ Ý»ñ·ñ³íí³Í ÙÇçáóÝ»ñ")
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum2)
    Call ClickCmdButton(2, "Î³ï³ñ»É") 
    BuiltIn.Delay(2000)   
    Call Validate_Doc()
    Call Close_Pttel("frmPttel")
    'Անցում կատարել "Ավանդներ(ներգրաված)" ԱՇՏ
    Call ChangeWorkspace(c_Deposits)
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    'Լրացնել "Պայմանագարի համար"   
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum2)
    'Սեղմել "Կատարել" կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(3000)
    'Հաստատել Հաստատող փաստաթղթեր |- ում
    Call PaySys_Verify(verify)
    Call Close_Pttel("frmPttel")
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    'Լրացնել "Պայմանագրի Մակարդակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","LEVEL",level)
    'Լրացնել "Պայմանագրի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum2)
    'Սեղմեձլ "Կատարել" կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Կատարում է Ավանդի ներգրավում
    Call Deposit_Involvment(fBASE_depInv, docNum, invDate, money, cashORno, Acc)
    'Կատարել Տոկոսների հաշվարկում 
    Call Calculate_Percent(fBASE, Calculate_Date , Action_Date)
    BuiltIn.Delay(1000)
    Log.Message(fBASE)
    Call Close_Pttel("frmPttel")
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HI where fBASE = '" & fBASE & "'"
        sql_Value = 794.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 794.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 794.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fCURSUM from HIT where fBASE = '" & fBASE & "'"
        sql_Value = 794.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT1 & "' and fTYPE = 'R1'"
        sql_Value = 100000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT1 & "' and fTYPE = 'R2'"
        sql_Value = 794.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT1 & "' and fTYPE = 'R¸'"
        sql_Value = 794.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
    'Մուտք գործել Պյամանգրեր թղթապանակ
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    'Լրացնել "Պայմանագարի մակարդակ"   
    Call Rekvizit_Fill("Dialog",1,"General","LEVEL",level)
    'Լրացնել "Պայմանագարի համար"   
    Call Rekvizit_Fill("Dialog",1,"General","CLIENT",clientCode)
    'Սեղմել "Կատարել" կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    'Խմբային երկարաձգում
    extDate = "010119"
    cap = 0
    ext = 1
    rep = 0
    perc = 0
    perCalc = 0
    close = 0
    Call Group_Calculate(extDate,extDate,cap,ext,rep,perc,perCalc,close)
    Call Close_Pttel("frmPttel")
    
   	Set contracts = New_ContractsFilter()
  		With contracts
  				.AgreementN = contractNum2
  		End With
    
    Call GoTo_Contracts("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|", contracts)
    
    BuiltIn.Delay(2000)
     'Ստուգում է որ պայմանագրի մարման ժամկետԹ երկարաւգված լինի
    If Not wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(6) = "01/07/19" Then
            Log.Error("Don՚t do extension")
    End If
    Call Close_Pttel("frmPttel")
    
    BuiltIn.Delay(5000)    
    Set contracts = New_ContractsFilter()
  		With contracts
  				.AgreementN = contractNum
  		End With
    
    Call GoTo_Contracts("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|", contracts)
    
    BuiltIn.Delay(2000)
    'Ստուգում է որ պայմանագրի մարման ժամկետԹ երկարաւգված լինի
    If Not wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(6) = "01/07/19" Then
            Log.Error("Don՚t do extension")
    End If

    actionDate = "300416"
    endDate = "010120"
    actionExists = False
    actionType = ""
    Call Delete_Actions(actionDate,endDate,actionExists,actionType,c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates)
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(actionDate,endDate,actionExists,actionType,c_OpersView)
    
    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    Call Close_Pttel("frmPttel")
    
   	Set contracts = New_ContractsFilter()
  		With contracts
  				.AgreementN = contractNum2
  		End With
    
    Call GoTo_Contracts("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|", contracts)

    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(actionDate,endDate,actionExists,actionType,c_OpersView)
    
    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()

    Call Close_Pttel("frmPttel")
    
    'Փակում է ASBANK - ը
    Call Close_AsBank()
    
End Sub