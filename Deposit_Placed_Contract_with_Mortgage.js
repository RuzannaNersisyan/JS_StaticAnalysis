OPTION Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Financial_Leasing_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Akreditiv_Library 
'USEUNIT Library_Common  
'USEUNIT Repo_Library
'USEUNIT Constants

'Test case Id 166683


Sub Deposit_Placed_Contract_with_Mortgage_Test()

    Dim startDate,fDATE,fBASE,contractNum,actionType2,actType,template,thirdPerson,accAc,thirdAcc,perAcc
    Dim depositContractType,colItem,clientCode,curr,money,signDate,chbKap,chbAuto,chbEx
    Dim kindScale,depositPer,per,dateGive,dateAgr,part,actionDate,actionType,sumPer
    Dim queryString,sql_Value,colNum,sql_isEqual,verify,param,level,invDate,closeDate,perCalc
    Dim cashORno,Acc,Calculate_Date,Action_Date,summ,exDate,exTerm,period,direction, tabN
    Dim repDate,mainSum,actionT,actionExists,griddate,date_arg,scale,withScale,docNum,actingType
    Dim faddate,faDate,debtDate,docExist,eDate,fPeriod,fDirection,calcDate,fOBJECT,perSum,dateStart
    Dim MortgageType,docTyp,Mcurr,mortSum,DocN,mortCount,sealDate,giveDate,mortPlace,mortSub
    
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
    clientCode = ""
    thirdPerson = ""
    curr = "000"
    thirdAcc = ""
    perAcc = ""
    money = "1000000"
    chbKap = 0
    chbAuto = 1
    chbEx = 1
    signDate = "230516"
    kindScale = "1"
    depositPer = "10"
    part = "365"
    per = "5"
    dateGive = "230516"
    dateAgr = "230518"      
    Acc = "30220042300"      
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
    param = "²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ- "& Trim(contractNum) &" {öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1}"
    fPeriod = 1
    fDirection = 2
    If Not Other_Payment_Schedule_AllTypes(param,signDate,signDate,dateAgr,fPeriod,fDirection) Then 
        Log.Error("There was no document")
        Exit Sub
    End If
    Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").Keys("[Up]")

    'Ուղարկել  հաստատման
    Call PaySys_Send_To_Verify()
    Sys.Process("Asbank").Refresh
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    BuiltIn.Delay(2000)
    
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
 
     MortgageType = "²ÛÉ ·ñ³í"
     docTyp = "9"
     Mcurr = "000"
     mortSum = "1000000"
     mortCount ="2000"
     sealDate = "230516"
     giveDate = "230518"
     mortPlace = "1"
     mortSub = "0"
     
    'Գրավի փաստաթղթի ստեղծում
    Call Create_Mortgage(MortgageType,DocN,docTyp,Mcurr,mortSum,mortCount,sealDate,giveDate,mortPlace,mortSub)
    'Ուղարկում է պայմանագիրը հաստատման       
    Call PaySys_Send_To_Verify()
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClAllWindows)
    
    Call ChangeWorkspace(c_RecPledge)
    
    Call wTreeView.DblClickItem("|êï³óí³Í ·ñ³í|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    Call Rekvizit_Fill("Dialog",1,"General","NUM",DocN)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Վավերացնում է փաստաթուղթը
    Call Validate_Doc()
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClCurrWindow)
    
    Call ChangeWorkspace(c_DepositPlaced)
    Call wTreeView.DblClickItem("|î»Õ³µ³ßËí³Í ³í³Ý¹Ý»ñ|ä³ÛÙ³Ý³·ñ»ñ")
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    'Ավանդի տրամադրում
    Call Give_Deposit(signDate, money, direction, Acc) 
    
    'Տոկոսների խմբային հաշվարկ
    closeDate = "201117"
    Call Group_Persent_Calculate(closeDate,closeDate)
    
    'Պարտքերի մարում
    repDate = "211117"
    mainSum = ""
    perSum = "160000"
    cashORno = 1
    tabN = 2
    Call Debt_Repayment(fOBJECT,repDate, mainSum,perSum,cashORno,Acc,docNum, tabN)
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClCurrWindow)
    
    Call ChangeWorkspace(c_CustomerService)  
    Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ") 
    Call Rekvizit_Fill("Dialog",1,"General","PERN","![End]" & "[Del]" & "211117")
    Call Rekvizit_Fill("Dialog",1,"General","PERK","![End]" & "[Del]" & "211117")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    'Ուղարկում է պայմանագիրը հաստատման       
    Call Online_PaySys_Send_To_Verify(2)

    Call ChangeWorkspace(c_Verifier1)   
    'Փաստաթղթի առկայության ստուգում 1-ին հաստատողի մոտ
    docExist = Online_PaySys_Check_Doc_In_Verifier(DocNum, repDate, repDate)
    If Not docExist Then
      Log.Error("The document with number " & DocNumb & " doesn՚t exist in 1st verify documents")
      Exit Sub
    End If
    'Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    'Փաստաթղթի վավերացում 1-ին հաստաոտղի կողմից
    Call PaySys_Verify(True) 
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClCurrWindow)   
    
    Call ChangeWorkspace(c_CustomerService)  
    Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ") 
    Call Rekvizit_Fill("Dialog",1,"General","PERN","![End]" & "[Del]" & repDate)
    Call Rekvizit_Fill("Dialog",1,"General","PERK","![End]" & "[Del]" & repDate)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    'ՎավերացնոSys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()ւմ է փաստաթուղթը
    Call Validate_Doc()
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    
    Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    Call Rekvizit_Fill("Dialog",1,"General","PERN","![End]" & "[Del]" & repDate)
    Call Rekvizit_Fill("Dialog",1,"General","PERK","![End]" & "[Del]" & repDate)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete)
    Call ClickCmdButton(5, "Î³ï³ñ»É")
    Call ClickCmdButton(3, "²Ûá")
    Call ClickCmdButton(5, "²Ûá")
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClAllWindows)
    BuiltIn.Delay(1000)
    
    Call ChangeWorkspace(c_DepositPlaced)
    Call wTreeView.DblClickItem("|î»Õ³µ³ßËí³Í ³í³Ý¹Ý»ñ|ä³ÛÙ³Ý³·ñ»ñ")
    Call Rekvizit_Fill("Dialog",1,"General","NUM",contractNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(3000)
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
    'Պայմանագրի փնտրում պայմանագրի թղթապանակաում
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").MoveFirst
    Do Until Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").EOF
        If Trim(Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").Columns.Item(0).Text) = "ä³ñïù»ñÇ Ù³ñÙ³Ý Ñ³Ûï, ¶áõÙ³ñÁª 160000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù" Then                                                	
            Call wMainForm.MainMenu.Click(c_AllActions)
            Call wMainForm.PopupMenu.Click(c_Delete)
            Call ClickCmdButton(3, "²Ûá")
            Exit Do
        Else
            Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
        End If
    Loop  

    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").MoveLast
    'Գրավի փակում
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_AgrClose)
    BuiltIn.Delay(2000)
    Call Rekvizit_Fill("Dialog",1,"General","DATECLOSE","![End]" & "[Del]" & dateAgr)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(4000)
    'Ջնջել գրավի  փաստաթուղթը
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_Delete)
    Call ClickCmdButton(3, "²Ûá")
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClCurrWindow)
        
    'Ջնջում է բոլոր  փաստաթղթերը
    actionType = ""
    BuiltIn.Delay(3000)
   Call wMainForm.MainMenu.Click(c_AllActions)
   Call wMainForm.PopupMenu.Click(c_OpersView)
   'Լրացնում է սկզբնաժամկետ դաշտը
   Call Rekvizit_Fill("Dialog",1,"General","START","![End]" & "[Del]" & "230516")
   'Լրացնում է վերջնաժամկետ դաշտը
   Call Rekvizit_Fill("Dialog",1,"General","END","![End]" & "[Del]" & "230518")
   Call ClickCmdButton(2, "Î³ï³ñ»É")
  
   wMDIClient.Refresh
   BuiltIn.Delay(2000)
   
   'Անցնում է ցուցակի մեջով `վեջից սկսած , և ջնջում է ամբողջը
   'Անցում է կատարում վերջին տողին
   wMDIClient.VBObject("frmPttel").VBObject("tdbgView").MoveLast
   Do Until wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 0
             'Կատարում է ջնջել գործողությունը
             BuiltIn.Delay(2000)
             Call wMainForm.MainMenu.Click(c_AllActions)
             Call wMainForm.PopupMenu.Click(c_Delete)
             If p1.WaitVBObject("frmAsMsgBox", 2500).Exists Then
                Call ClickCmdButton(5, "²Ûá")
                Call ClickCmdButton(3, "²Ûá")
                BuiltIn.Delay(7000)
             Else  
                Call ClickCmdButton(3, "²Ûá")
                If p1.WaitVBObject("frmAsMsgBox", 2500).Exists Then
                   p1.VBObject("frmAsMsgBox").VBObject("cmdButton").Click()
                   BuiltIn.Delay(7000)
                   wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Refresh
                   wMDIClient.VBObject("frmPttel").VBObject("tdbgView").MovePrevious
                End If
             End If       
    Loop
     'Փակում է պատուհանը
     BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClCurrWindow)
    
   'Մայր պայմանագրի ջնջում
    Call Delete_Doc()
    
    Call Close_AsBank()
     
End Sub