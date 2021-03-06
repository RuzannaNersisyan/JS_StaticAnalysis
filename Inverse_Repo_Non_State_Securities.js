Option Explicit
'USEUNIT Loan_Agreements_With_Schedule_Linear_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Group_Operations_Library
'USEUNIT Derivative_Tools_Library
'USEUNIT Loan_Agreements_Library 
'USEUNIT Subsystems_SQL_Library
'USEUNIT Credit_Line_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common 
'USEUNIT Repo_Library
'USEUNIT Constants
'USEUNIT Mortgage_Library

'Test Case Id 166621

Sub Inverse_Repo_Non_State_Securities_Test()

    Dim fDATE, sDATE
    Dim client, curr, acc, summa, date, kindscale,per, baj, dateAgr, DateFill,CheckPayDates
    Dim PayDates, Paragraph, Direction ,secState, secClass, security,fBASE, docNum,Price 
    Dim queryString, sql_Value, colNum, sql_isEqual,fOBJECT,calcDate, tabN
    Dim mainSum, perSum, newSec, oldSecCost, newSecCost, exTerm, Param, CloseDate
    Dim actionDate, actionEndDate, actionExists, actionType
     
    fDATE = "20250101"
    sDATE = "20140101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Call Create_Connection()
    Call ChangeWorkspace(c_RevRepo) 
    
    client = ""
    curr = "000"          
    acc = "30220042300"          
    summa = "100000"              
    date = "240216"                         
    kindscale = "1"  
    per = "12"
    baj = "365"
    dateAgr = "241216"   
    DateFill = 1 
    CheckPayDates = 0
    PayDates = ""
    Paragraph = 1
    Direction = 2
    secState = 1
    secClass = "6"
    security ="R-0008"
    
    Call wTreeView.DblClickItem("|Ð³Ï³¹³ñÓ é»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
    Call Inverse_Repo_Create(client, curr, acc, summa, date, kindscale,per, baj, date, dateAgr, DateFill,date,CheckPayDates, _
                     PayDates, Paragraph, Direction ,secState, secClass, security,summa,fBASE, docNum)
    Log.Message(fBASE)
    Log.Message(docNum)
    BuiltIn.Delay(5000)
  
       'Կատարում ենք SQL ստուգում
        queryString = "select fSTATE from DOCS where fISN = '" & fBASE & "'"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Պայմանագրը ուղարկել հաստատման                               
    Call PaySys_Send_To_Verify()        
    BuiltIn.Delay(1000)
    'Հաստատել պայմանագիրը
    Call Close_Pttel("frmPttel")
    Call wTreeView.DblClickItem("|Ð³Ï³¹³ñÓ é»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    'Լրացնել "Պայմանագարի համար"   
    Call Rekvizit_Fill("Dialog",1,"General","NUM",DocNum)
    'Սեղմել "Կատարել" կոճակը
    Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("CmdOK").Click()
    BuiltIn.Delay(4000)
    'Հաստատել Հաստատող փաստաթղթեր 1- ում
    Call PaySys_Verify(True)
    Call Close_Pttel("frmPttel")
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fSTATE from DOCS where fISN = '" & fBASE & "'"
        sql_Value = 7
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
  
    Call LetterOfCredit_Filter_Fill("|Ð³Ï³¹³ñÓ é»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)

    'Ռեպոյի տրամադրում
    Call InverseRepoAttraction (date)
    BuiltIn.Delay(2000)
    
         'Կատարում ենք SQL ստուգում        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 730676.4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 730676.4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

    'Տոկոսի հաշվարկ
    calcDate = "230316"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT) 
    
        'Կատարում ենք SQL ստուգում      
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 6966.4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾'"
        sql_Value = -1.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 6966.4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 6966.4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾'"
        sql_Value = -1.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 6966.4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Պարտքերի մարում
    Date = "240316"
    tabN = 2
    Call Debt_Repayment(fOBJECT,Date, mainSum,perSum,2,acc,docNum,tabN)
    Log.Message(fOBJECT) 
    
        'Կատարում ենք SQL ստուգում       
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾'"
        sql_Value = -1.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 6966.4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
     'Տոկոսի հաշվարկ
    calcDate = "240316"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾'"
        sql_Value = -2.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 240.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Արժեթղթի փոփոխություն
    date = "250316"
    newSec = "R-0009"
    Call Change_Security(date,security,newSec,oldSecCost,oldSecCost)
    
    Call wMainForm.MainMenu.Click(c_AllActions )
    Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" & c_Other & "|" & c_SecChng)
    'Լրացնում է ամսաթիվ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","START",date)
    'Լրացնում է ամսաթիվ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","END",date) 
    Call ClickCmdButton(2,"Î³ï³ñ»É")
    
    BuiltIn.Delay(2000)
    colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("fNEWSECNAME")    
    Log.Message(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text)
    'Նոր արժեթղթի անվանում սյան արժեքի ստուգում
    If Not Trim(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text) = "AMGB20172327" then
        Log.Error("New security is not right")
    End If
    
    colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("fOLDSECNAME")
    Log.Message(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text)
    'Հին արժեթղթի անվանում սյան արժեքի ստուգում
    If Not Trim(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text) = "AMGN60294201" then
        Log.Error("Old security is not right")
    End If
    Call Close_Pttel("frmPttel_2")
    
    'Տոկոսների խմբային հաշվարկ
    Date = "010517"
    Call Group_Persent_Calculate(Date,Date)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում       
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 66060.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 66060.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = 0 '18.5
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 240.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 58854.3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = -2.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Կատարում է Ժամկետների վերանայում
    Date = "020517"
    exTerm = "010318"
    PayDates = "291217"
    param = c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms
    Call Deposit_Extension(Date,exTerm,PayDates,Paragraph,direction,Param)
    
    'Տոկոսադորւյքի նշանակում
    per = "15"
    baj = "365"
    Call Set_Persentage_Repo(fOBJECT,date,per,baj)
    
    'Տոկոսների խմբային հաշվարկ
    Date = "280218"
    Call Group_Persent_Calculate(Date,Date)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում       
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 157045.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value =  157045.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'RÄ'"
        sql_Value = 730676.4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 66060.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value =  156744.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = 0
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'RÄ'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

    'Պարտքերի մարում
    Call Debt_Repayment(fOBJECT,exTerm, mainSum,perSum,2,acc,docNum,tabN)
    Log.Message(fOBJECT) 
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում  
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
             
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'RÄ'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 730676.4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 157045.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 156744.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = 0
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'RÄ'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If        
        
    'Տոկոսի հաշվարկ
    calcDate = "010318"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    
    'Պայմանագրի փակում
    CloseDate = "010119"
    Call Close_Contract(CloseDate)
    BuiltIn.Delay(2000)

    'Ստուգում է փակման ամսաթիվ սյունը
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fDATECLOSE")
    If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("01/01/19") Then
          Log.Error("Don't match")
    End If
   
    'Բացում է պայմանագիրը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen)
    Call ClickCmdButton(5,"²Ûá")
  
    actionDate = "010318"
    actionEndDate = "010318"
    actionExists = False
    
    'Ջնջում է Դիտում և խմբագրում/Այլ/Հաշվարկման ամսաթվեր թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(calcDate,calcDate,actionExists,actionType,c_ViewEdit & "|" & c_Other & "|" & c_CalcDates)

    'Ջնջում է Ռեպոյի մարում գործողությունը
    actionExists = true
    actionType = "12"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )

    'Ջնջում է Տոկոսի հաշվարկ փաստաթութը
    actionDate = "280218"
    actionEndDate = "280218"
    actionType = "211"
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_OpersView )

    'Ջնջում է Դիտում և խմբագրում/Տոկոսադրույքներ/Տոկոսադրույքներ թղթապանակի բոլոր փաստաթղթերը
    actionDate = "020517" 
    actionExists = False
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_ViewEdit & "|"  & c_Percentages & "|" & c_Percentages)

    'Ջնջում է Երկարաձգման փաստաթուղթը   
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates)

    'Ջնջում է Տոկոսի մարում փաստաթութը
    actionExists = True
    actionDate = "240316"
    actionEndDate = "010517"
    actionType = "211"
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_OpersView )
    
    actionType = "82"
    Call Delete_Actions(actionEndDate,actionEndDate,actionExists,actionType,c_OpersView )
    
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    
    actionType = "23"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    
    actionType = "71"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    
    actionDate = "230316"
    actionType = "211"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )

    'Ջնջում է Արժեթղթի փոփոխություն փաստաթուղթը
    actionEndDate = "250316"
    actionExists = False
    Call Delete_Actions(actionEndDate,actionEndDate,actionExists,actionType,c_ViewEdit & "|" & c_Other & "|" & c_SecChng)

    'Ջնջում է Գործողությունների դիտում էղէապանակի մնացած գործողությունները
    actionExists = True
    actionDate = "240216"
    actionEndDate = "030918"
    actionType = Null
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_OpersView )

    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    Call Close_Pttel("frmPttel")
    
    'Փակել ASBANK համակարգը
    Call Close_AsBank()
End Sub