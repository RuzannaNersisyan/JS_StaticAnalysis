Option Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants

'Test Case Id 166669

Sub Deposit_Contract_with_Template_Test()

  Dim fBASE,contractNum,depositContractType,ClientCode,thirdPerson
  Dim accAc,thirdAcc,perAcc,money,chbKap, chbAuto,chbEx,signDate
  Dim kindScale,depositPer,part,per,dateAgr,startDATE,fDATE,tabN
  Dim level,invDate,cashORno,Acc,Calculate_Date,Action_Date
  Dim exDate,exTerm,period,direction,repDate,mainSum,actionT,actionType
  Dim actionExists,actionEx,param, verify,contractDate,extDate,perSum
  Dim queryString,sql_Value,colNum,sql_isEqual,fOBJECT,fOBJECT1
  Dim cap,ext,rep,perCalc,close,setDate,perCal,exten,actType,docNum, fBASE_depInv
      startDATE = "20120101"
      fDATE = "20250101"
    
      'Test StartUp start
      Call Initialize_AsBank("bank", startDATE, fDATE)
    
      Call Create_Connection()
    
      Call ChangeWorkspace(c_Deposits)
      Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
  
      contractDate = "010618"
      depositContractType = "0001"    
      clientCode = "00034851"
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
      part = "365"
      per = "0.5"
      dateAgr = "031218"
      level = "1"      
      Acc = "30220042300"
      exDate = "290416"
      period = "1"
      direction = "2"      
      param = c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms
      verify = True    
      
      
      'Ավանդ տեսակի պայմանագրի ստեղծումրում
      Call Deposit_Contract_Fill_with_Template(fOBJECT,contractNum,depositContractType,contractDate, _
                          ClientCode,thirdPerson,accAc,thirdAcc,perAcc,money,chbKap,_
                          chbAuto,chbEx,kindScale,depositPer,part,per,dateAgr)

      Log.Message(fOBJECT)
      Log.Message(contractNum)
      BuiltIn.Delay(2000)
      'Ուղարկում է հաստատման
      Call PaySys_Send_To_Verify()
      BuiltIn.Delay(4000)
      Call wMainForm.MainMenu.Click(c_Windows)
      Call wMainForm.PopupMenu.Click(c_ClAllWindows)
      BuiltIn.Delay(4000)
      
      Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
      'Լրացնել "Պայմանագարի համար"   
      Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
      'Սեղմել "Կատարել" կոճակը
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(2000)
      'Հաստատել Հաստատող փաստաթղթեր |- ում
      Call PaySys_Verify(verify)
      BuiltIn.Delay(2000)
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
      
      Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
       'Լրացնել "Պայմանագրի Մակարդակ" դաշտը
      Call Rekvizit_Fill("Dialog",1,"General","LEVEL",level)
      'Լրացնել "Պայմանագրի համար" դաշտը
      Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
      'Սեղմեձլ "Կատարել" կոճակը
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
      'Կատարում է Ավանդի ներգրավում
      invDate = "010618"
      cashORno = "2"
      Call Deposit_Involvment(fBASE_depInv, docNum, invDate, money, cashORno, Acc)
        
          'Կատարում է SQL ստուգում
          queryString = "select count(*) from HIF where fBASE = '" & fOBJECT & "'"
          sql_Value = 20
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
     
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "'"
          sql_Value = 100000.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
          
      'Կատարում է Տոկոսների խմբային հաշվարկ
      setDate = "021218"
      cap = 0
      ext = 0
      rep = 0
      per = 0
      perCal = 1 
      close = 0
      Call Group_Calculate(setDate,setDate,cap,ext,rep,per,perCal,close)
    
          'Կատարում է SQL ստուգում
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "'"
          sql_Value = 100000.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
          sql_Value = 5041.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
          sql_Value = 5041.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
         
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¾'"
          sql_Value = 0.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'RÄ'"
          sql_Value = 100000.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
      'Կատարում է Խմբային երկարաձգում 
      perCalc = 0 
      exten = 1
      Call Group_Calculate(dateAgr,dateAgr,cap,exten,rep,per,perCalc,close)
      BuiltIn.Delay(3000)
      
      Call wMainForm.MainMenu.Click(c_AllActions)  
      Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" & c_Percentages & "|" & c_Percentages)
      'Լրացնում է հաշվարկման ամսաթիվ դաշտը
      Call Rekvizit_Fill("Dialog",1,"General","START","![End]" & "[Del]" & dateAgr )
      'Լրացնում է հաշվարկման ամսաթիվ դաշտը
      Call Rekvizit_Fill("Dialog",1,"General","END","![End]" & "[Del]" & dateAgr )
      'Սեղմում է Կարարել կոճակը
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(2000)
   
      'Ստուգում է որ պայմանագրի տոկոսադրույքը փոխված լինի
      If Not Trim(Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(3)) = "20.0000" Then
              Log.Error("Don՚t extension")
      End If
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").Close()
    
          'Կատարում է SQL ստուգում
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'RÄ'"
          sql_Value = 0.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
          sql_Value = 4164.30
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
      'Կատարում է տոկոսի հաշվարկ
      Calculate_Date  = "031218"
      Call Calculate_Percent(fBASE, Calculate_Date , Calculate_Date)
      Log.Message(fBASE)
    
          'Կատարում է SQL ստուգում
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R1'"
          sql_Value = 100000.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
          sql_Value = 5095.80
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
          sql_Value = 5041.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¾'"
          sql_Value = -0.40
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'RÄ'"
          sql_Value = 0.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R1'"
          sql_Value = 0.00
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
          sql_Value = 5041.00
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
          sql_Value = 4164.30
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¾'"
          sql_Value = 0.00
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'RÄ'"
          sql_Value = 0.00
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
  
          queryString = "select * from HI where fBASE = '" & fBASE & "'"
          sql_Value = 54.40
          colNum = 3
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
  
          queryString = "select * from HIT where fBASE = '" & fBASE & "' and fTYPE = 'N2'"
          sql_Value = 54.80
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
     
          queryString = "select * from HIT where fBASE = '" & fBASE & "' and fTYPE = 'N¾'"
          sql_Value = -0.40
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
     
          queryString = "select * from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R2'"
          sql_Value = 54.80
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R¾'"
          sql_Value = -0.40
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
      'Կատարում է պարտքերի մարում
      repDate = "041218"
      perSum = "5041"
      tabN = 2
      Call Debt_Repayment(fBASE,repDate, money,perSum, cashORno,Acc,docNum,tabN)
      Log.Message(fBASE)
    
          'Կատարում է SQL ստուգում
          queryString = "select * from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R1'"
          sql_Value = 100000.00
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R2' and fOP  ='DBT'"
          sql_Value = 4536.90
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If        
        
          queryString = "select * from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R2' and fOP = 'TXD'"
          sql_Value = 504.10
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R¸' and fOP = 'DBT'"
          sql_Value = 4536.90
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R¸' and fOP = 'TXD'"
          sql_Value = 504.10
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R¾'"
          sql_Value = 0.40
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select SUM(fSUM) from HI where fBASE = '" & fBASE & "' and  fDBCR = 'D'"
          sql_Value = 105545.50
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select SUM(fSUM) from HI where fBASE = '" & fBASE & "' and fDBCR = 'C'"
          sql_Value = 105545.50
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R1'"
          sql_Value = 0.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
          sql_Value = 54.80
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
          sql_Value = 0.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¾'"
          sql_Value = 0.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'RÄ'"
          sql_Value = 0.00
          colNum = 2
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R1'"
          sql_Value = 100000.00
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
          sql_Value = 5095.80
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
          sql_Value = 5041.00
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¾'"
          sql_Value = -0.40
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select * from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'RÄ'"
          sql_Value = 0.00
          colNum = 4
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
      exTerm = "010119"
      actionExists = True
      actionType = "12"
      'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
      Call Delete_Actions(invDate,exTerm,actionExists,actionType,c_OpersView)
      
      'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
      actionType = "82" 
      Call Delete_Actions(Calculate_Date,Calculate_Date,actionExists,actionType,c_OpersView)
      
      'Ջնջում է Պայմ.մարման ժամկետներ թղթապանակի բոլոր փաստաթղթերը
      actionType = ""
      Call Delete_Actions(invDate,exTerm,actionExists,actionType,c_OpersView)
      
      'Ջնջում է գլխավոր պայմանագիրը
      Call Delete_Doc()
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
      
      'Փակում է ASBANK - ը
      Call Close_AsBank()
    
End Sub