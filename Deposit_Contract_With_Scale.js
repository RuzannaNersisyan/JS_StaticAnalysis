Option Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants

'Test Case Id 166665

Sub Deposit_Contract_With_Scale_Test()
      Dim startDate,fDATE,fBASE,contractNum,actionType2,template,thirdPerson,accAc,thirdAcc,perAcc
      Dim depositContractType,colItem,clientCode,curr,money,signDate,chbKap,chbAuto,chbEx
      Dim kindScale,depositPer,per,dateGive,dateAgr,part,actionDate,actionType,my_vbObj
      Dim queryString,sql_Value,colNum,sql_isEqual,verify,param,level,invDate,Name
      Dim cashORno,Acc,Calculate_Date,Action_Date,exDate,exTerm,period,direction
      Dim repDate,mainSum,actionT,actionExists,actionEx,scale,withScale,fOBJECT, tabN
      Dim sendTo,cashReg,docNum,isExists,cap,ext,rep,perSum,perc,perCalc,close,perCe,perCal, fBASE_depInv
    
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
      clientCode = "00034851"
      thirdPerson = ""
      curr = "000"
      accAc = "30220042300"
      thirdAcc = ""
      perAcc = ""
      money = "300000"
      chbKap = 0
      chbAuto = 1
      chbEx = 1
      signDate = "010618"
      kindScale = "1"
      scale = True
      withScale = "001"
      depositPer = ""
      part = "365"
      per = "0.5"
      dateGive = "010618"
      dateAgr = "010619"
      level = "1"
      cashORno = "1"
      Acc = ""
      period = "1"
      direction = "2"      
      mainSum = "2000"
      
      param = c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms
      verify = True
      sendTo = 2
      isExists = False

      'Ավանդ տեսակի պայմանագրի ստեղծում 
      Call Deposit_Contract_Fill(fOBJECT,contractNum,template,depositContractType,colItem, _
                          ClientCode,thirdPerson,curr,accAc,thirdAcc,perAcc,money,chbKap,_
                          chbAuto,chbEx,signDate,kindScale,scale,withScale,depositPer,part,per,dateGive,_
                          dateAgr,dateGive,period,direction)
                        
      Log.Message(fOBJECT)
      Log.Message(contractNum)
      'Ուղարկել հաստատման
      Call PaySys_Send_To_Verify()
      Sys.Process("Asbank").Refresh
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
      Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
      'Լրացնել "Պայմանագրի համար" դաշտը
      Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
      'Սեղմել "Կատարել" կոճակը
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
      Call Deposit_Involvment(fBASE_depInv, docNum, dateGive, money, cashORno, Acc)
      Log.Message(docNum)
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
      Call ChangeWorkspace(c_CustomerService)
      'Ստուգում է փաստաթղթի առկայությունը
      isExists = Online_PaySys_Check_Doc_In_Workpapers(docNum, dateGive, dateAgr)
      If isExists  then
            'Ուղարկել Կանխիկ ելքի փաստաթուղթը հաստատման
            Call Online_PaySys_Send_To_Verify(sendTo)
      Else 
        Log.Error("document doesn՚t exist")
      End If
     
      Call ChangeWorkspace(c_Verifier1)
      'Ստուգում է փաստաթղթի առկայությունը
      isExists = Online_PaySys_Check_Doc_In_Verifier(docNum, dateGive, dateAgr)
      If isExists  then
          'Ուղարկել Կանխիկ ելքի փաստաթուղթը հաստատման
          Call PaySys_Verify(verify)
      Else 
        Log.Error("document doesn՚t exist")
      End If
       Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).frmPttel.Close()
      Call ChangeWorkspace(c_CustomerService)
      'Ստուգում է փաստաթղթի առկայությունը
      isExists = Online_PaySys_Check_Doc_In_Workpapers(docNum, dateGive, dateAgr)
      If isExists  then
          'Ուղարկել Կանխիկ ելքի փաստաթուղթը հաստատման
          Call PaySys_Verify(verify)
      Else 
        Log.Error("document doesn՚t exist")
      End If
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).frmPttel.Close()
      'Ստուգում է փաստաթղթի առկայությունը
      isExists = Online_PaySys_Check_Doc_In_Registered_Payment_Documents(docNum, dateGive, dateAgr)
      If Not isExists Then
          Log.Error("document doesn՚t exist")
      End If
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).frmPttel.Close()
    
      Call ChangeWorkspace(c_Deposits)
      Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
     ' Լրացնել "Պայմանագարի համար"   
      Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
      'Սեղմել "Կատարել" կոճակը
      Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("CmdOK").Click()
    
      'Կատարել Տոկոսների հաշվարկում       
      Calculate_Date  = "010718"
      Call Calculate_Percent(fBASE, Calculate_Date , Calculate_Date)
      BuiltIn.Delay(1000)
      Log.Message(fBASE)
    
          'Կատարում է SQL ստուգում
          queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R2'"
          sql_Value = 1232.90
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R¸' "
          sql_Value = 1232.90
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If        
        
          queryString = "select count(*) from HIF where fBASE = '" & fBASE & "'"
          sql_Value = 1
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fCURSUM from HIT where fBASE = '" & fBASE & "'"
          sql_Value = 1232.90
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R1'"
          sql_Value = 300000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          BuiltIn.Delay(500)
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
          sql_Value = 1232.90
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          BuiltIn.Delay(500)
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
          sql_Value = 1232.90
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
      'Տոկոսների խմբային նշանակում
      exDate = "020718"
      cap = 0
      ext = 0
      rep = 0
      perc = 1
      perCalc = 0
      close = 0      
      Call Group_Calculate(exDate,exDate,cap,ext,rep,perc,perCalc,close)
      BuiltIn.Delay(2000)
      
      Call wMainForm.MainMenu.Click(c_AllActions)  
      Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" & c_Percentages & "|" & c_Percentages)
      'Լրացնում է հաշվարկման ամսաթիվ դաշտը
      Call Rekvizit_Fill("Dialog",1,"General","START","![End]" & "[Del]" & dateGive )
      'Լրացնում է հաշվարկման ամսաթիվ դաշտը
      Call Rekvizit_Fill("Dialog",1,"General","END","![End]" & "[Del]" & dateAgr )
      'Սեղմում է Կարարել կոճակը
      Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("CmdOK").Click()
      BuiltIn.Delay(2000)
      'Ստուգում է որ պայմանագրի տոկոսադրույքը փոխված լինի
      If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(3) = "7.0000" Then
              Log.Error("Document don՚t  exist")
      End If
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").Close()
      
      'Կատարել Տոկոսների հաշվարկում       
      exTerm = "300519"
      perCe = 0
      perCal = 1
      Call Group_Calculate(exTerm,exTerm,cap,ext,rep,perCe,perCal,close)
      BuiltIn.Delay(4000)
      Log.Message(fBASE)
    
          'Կատարում է SQL ստուգում
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R1'"
          sql_Value = 300000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
          sql_Value = 20391.90
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
          sql_Value = 18665.90
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R1'"
          sql_Value = 0.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
          sql_Value = 1232.90
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
          sql_Value = 16939.90
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
      'Կատարում է պարտքերի մարում
      repDate = "310519"
      perSum = "18665.90"
      cashORno = 2
      tabN = 2
      Call Debt_Repayment(fBASE,repDate, money,perSum,cashORno,Acc,docNum,tabN)
      Log.Message(fBASE)
      BuiltIn.Delay(1000)
    
          'Կատարում է SQL ստուգում
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R1'"
          sql_Value = 0.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fLASTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
          sql_Value = 1726.00
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
        
          queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R1'"
          sql_Value = 300000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R2'"
          sql_Value = 20391.90
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
          queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & fOBJECT & "' and fTYPE = 'R¸'"
          sql_Value = 18665.90
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
        
           queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R¸' and fOP = 'TXD'"
          sql_Value = 1866.60
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If 
         
           queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R1' "
          sql_Value = 300000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If 
        
           queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R2' and fOP = 'DBT' "
          sql_Value = 16799.30
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If          
        
           queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R2' and fOP = 'TXD' "
          sql_Value = 1866.60
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If 
        
           queryString = "select fCURSUM from HIR where fBASE = '" & fBASE & "' and fTYPE = 'R¸' and fOP = 'DBT' "
          sql_Value = 16799.30
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If  
          
      Action_Date = "020618"
      actionType = "" 
      actionExists = True
      actionEx = False
      'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
      Call Delete_Actions(Action_Date,dateAgr,actionExists,actionType,c_OpersView)
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
      'Ջնձում է կանխիկ ելքի փաստաթուղթը
      Call ChangeWorkspace(c_CustomerService)
      isExists = Online_PaySys_Check_Doc_In_Registered_Payment_Documents(docNum, dateGive,dateAgr)
      If isExists Then
           Call wMainForm.MainMenu.Click(c_AllActions)
           Call wMainForm.PopupMenu.Click(c_Delete)
           Sys.Process("Asbank").VBObject("frmDeleteDoc").VBObject("YesButton").Click()
           Sys.Process("Asbank").VBObject("frmAsMsgBox").VBObject("cmdButton").Click()
      End If  
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
   
      Call ChangeWorkspace(c_Deposits)
      Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
      BuiltIn.Delay(1000)
      'Լրացնել "Պայմանագարի համար"   
      Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
      'Սեղմել "Կատարել" կոճակը
      Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("CmdOK").Click()
      Call Delete_Actions(dateGive,dateAgr,actionEx,actionType,c_ViewEdit & "|" & c_Percentages & "|" & c_Percentages)
      
      Name = "²í³Ý¹Ç Ý»ñ·ñ³íáõÙ, ¶áõÙ³ñÁª 300000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
      isExists = False
      Set my_vbObj =  Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).WaitVBObject("frmPttel_2", delay_middle)
      If my_vbObj.Exists Then
      'Ցուցակի մեջ փնտրում է գլխավոր պայմանագիրը ,չգտնելու դեպքում է դուրս է բերում սխալ
      colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fKEY")
       Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel_2").vbObject("tdbgView").MoveFirst
          Do Until Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel_2").vbObject("tdbgView").EOF
              If Trim( Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim(Name) Then
                  isExists = True
                  Exit Do
              Else
                  Call  Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel_2").vbObject("tdbgView").MoveNext
              End If
          Loop
      Else
          Log.Message("The double input frmPttel does՚t exist")
      End If
      If isExists Then
           Call wMainForm.MainMenu.Click(c_AllActions)
           Call wMainForm.PopupMenu.Click(c_Delete)
           Sys.Process("Asbank").VBObject("frmDeleteDoc").VBObject("YesButton").Click()
      End If  
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").Close()
      'Ջնջում է մայր պայմանագիրը
      Call Delete_Doc()
      Call Close_AsBank()

End Sub