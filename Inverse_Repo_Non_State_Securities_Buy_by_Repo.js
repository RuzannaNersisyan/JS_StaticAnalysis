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
'USEUNIT BankMail_Library

'TestCase Id 166622

Sub Inverse_Repo_State_Securities_Buy_by_Repo_Test()

    Dim fDATE,sDATE
    Dim client, curr, acc, summa, date, kindscale,per, baj, dateAgr, DateFill,CheckPayDates
    Dim PayDates, Paragraph, Direction ,secState, secClass, security,fBASE, docNum,Price 
    Dim queryString, sql_Value, colNum, docN, sql_isEqual,fOBJECT,calcDate, perCalcISN1, perCalcISN2
    Dim mainSum,perSum,newSec,oldSecCost,newSecCost,exTerm,Param,CloseDate, tabN
    Dim actionDate,actionEndDate,actionExists,actionType,sumAgr,sumPer
    Dim workEnvName, workEnv, stRekName, todayDMY, endRekName, wStatus, isnRekName
     
    fDATE = "20250101"
    sDATE = "20140101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Call Create_Connection()
    Call ChangeWorkspace(c_RevRepo) 
    
    client = ""
    curr = "001"          
    acc = "03485190101"          
    summa = "1055000"              
    date = "010517"                         
    kindscale = "1"  
    per = "12.6"
    baj = "365"
    dateAgr = "010917"   
    DateFill = 1 
    CheckPayDates = 0
    PayDates = ""
    Paragraph = 1
    Direction = 2
    secState = 2
    secClass = "6"
    security ="R-0010"
    
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
    BuiltIn.Delay(2000)               
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
    BuiltIn.Delay(3000)
    
         'Կատարում ենք SQL ստուգում        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

    'Տոկոսի հաշվարկ
    calcDate = "310517"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT) 
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում      
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 10.70
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 10.70
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 10.70
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 10.70
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Պարտքերի մարում
    Date = "010617"
    tabN = 2
    Call Debt_Repayment(fOBJECT,Date, mainSum,perSum,2,acc,docNum,tabN)
    Log.Message(fOBJECT) 
    BuiltIn.Delay(4000)
    
        'Կատարում ենք SQL ստուգում 
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' and fOP = 'DBT'"
        sql_Value = 10.70
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' and fOP = 'DBT'"
        sql_Value = 10.70
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
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 10.7
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
     'Տոկոսի հաշվարկ
    calcDate = "010617"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 0.35
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' and fOP = 'PER' and fDATE = '2017-06-01'"
        sql_Value = 0.35
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
     'Տոկոսի հաշվարկ
    calcDate = "020717"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 11.05
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 11.05
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 0.35
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' and fOP = 'PRJ' and fDATE = '2017-07-03'"
        sql_Value = 11.05 '10.70
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Արժեթղթի փոփոխություն
    date = "030717"
    newSec = "R-0011"
    Call Change_Security(date,security,newSec,oldSecCost,newSecCost)
    BuiltIn.Delay(2000)
    
    Call wMainForm.MainMenu.Click(c_AllActions )
    Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" & c_Other & "|" & c_SecChng)
    'Լրացնում է ամսաթիվ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","START",date)
    'Լրացնում է ամսաթիվ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","END",date) 
    Call ClickCmdButton(2,"Î³ï³ñ»É")

    colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("fNEWSECNAME")    
    Log.Message(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text)
    If Not Trim(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text) = "RU0007252813" then
        Log.Error("New security is not right")
    End If
    
    colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("fOLDSECNAME")
    Log.Message(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text)
    If Not Trim(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text) = "AMNMCCB2HER2" then
        Log.Error("Old security is not right")
    End If
    Call Close_Pttel("frmPttel_2")   
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fSPEC  from HI2  where fOBJECT = '" & fBASE & "' and fDATE = '2017-07-03' and fDBCR = 'C' "
        sql_Value = "AMNMCCB2HER2"
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fSPEC  from HI2  where fOBJECT = '" & fBASE & "' and fDATE = '2017-07-03' and fDBCR = 'D' "
        sql_Value = "RU0007252813"
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Տոկոսների խմբային հաշվարկ
    Date = "010817"
    Call Group_Persent_Calculate(Date,Date)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում       
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 21.42
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 21.07
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = -0.01
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 11.05
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 11.05
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select SUM(fCURSUM) from HIR  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 42.82
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fCURSUM) from HIR  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 42.47
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Կատարում է Ժամկետների վերանայում
    Date = "020817"
    exTerm = "010118"
    PayDates = "010917"
    param = c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms
    Call Deposit_Extension(Date,exTerm,PayDates,Paragraph,direction,Param)
    
    'Տոկոսադորւյքի նշանակում
    per = "15"
    baj = "365"
    Call Set_Persentage_Repo(fOBJECT,date,per,baj)
    Log.Message(fOBJECT)
    
    'Տոկոսների խմբային հաշվարկ
    Date = "011017"
    Call Group_Persent_Calculate(Date,Date)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում       
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 46.49
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value =  46.49
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 21.42
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value =  33.75
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾'"
        sql_Value = -0.01
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fCURSUM) from HIR  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 67.89
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fCURSUM) from HIR  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 67.89
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fCURSUM) from HIT  where fOBJECT = '" & fBASE & "' and fTYPE = 'N2' "
        sql_Value = 57.19
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

    'Կատարում է Գումարների տեղափոխում գործողությունը
    docN = "HR-00010"
    date = "021017"
    Call Repo_Sum_Transfer(fOBJECT,docN,date,sumAgr,sumPer)    
    Log.Message(fOBJECT)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում  
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R1'"
        sql_Value = 3366.81
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
             
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R2'"
        sql_Value = 404.46
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
                
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R¸'"
        sql_Value =  355.63
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R¾'"
        sql_Value =  -0.02	
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R1'"
        sql_Value = 2366.81
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R2' "
        sql_Value = 357.97
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R¸'"
        sql_Value =  331.51
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R¾'"
        sql_Value = -0.01
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
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
        sql_Value =  0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾'"
        sql_Value =  0.00	
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 46.49
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value =  33.75
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾'"
        sql_Value = -0.01
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fCURSUM) from HIR  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 114.38
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fCURSUM) from HIR  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 114.38
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Տոկոսի հաշվարկ
    Call Calculate_Percent(fOBJECT , date , date)
    Call Close_Pttel("frmPttel")
    Log.Message("Տոկոսների հաշվարկման ISN` " & fOBJECT)
    perCalcISN1 = fOBJECT
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում  
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R2'"
        sql_Value = 404.46
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R¾'"
        sql_Value =  -0.02	
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R¾'"
        sql_Value = -0.01
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    Call LetterOfCredit_Filter_Fill("|Ð³Ï³¹³ñÓ é»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, docN)
    
    'Տոկոսի հաշվարկ
    Call Calculate_Percent(fOBJECT , date , date)
    perCalcISN2 = fOBJECT
    Log.Message("Տոկոսների հաշվարկման ISN` " & perCalcISN2)
    docN = "HR-00011"
    date = "031017"
    Call Repo_Sum_Transfer(fOBJECT,docN,date,sumAgr,sumPer)
    Call Close_Pttel("frmPttel")
    Log.Message(fOBJECT)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում  
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R1'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
             
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R2'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
                
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R¸'"
        sql_Value =  0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R¾'"
        sql_Value =  0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R1'"
        sql_Value = 3366.81
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R2' "
        sql_Value = 405.57
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R¸'"
        sql_Value =  355.63
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '642899117' and fTYPE = 'R¾'"
        sql_Value = -0.41
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 3366.81
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 405.57
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If        
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value =  0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾'"
        sql_Value =  0.00	
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 0.00	
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 0.00	
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fCURSUM) from HIR  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 519.95
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fCURSUM) from HIT  where fOBJECT = '" & fBASE & "' and fTYPE = 'N2' "
        sql_Value = 462.76
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    Call LetterOfCredit_Filter_Fill("|Ð³Ï³¹³ñÓ é»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, docN)
    
    'Տոկոսների խմբային հաշվարկ
    Date = "311217"
    Call Group_Persent_Calculate(Date,Date)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում         
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 530.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If        
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value =  530.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'RÄ'"
        sql_Value =  3366.81
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 405.57
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 487.21
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fCURSUM) from HIR  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 644.48
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fCURSUM) from HIR  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 644.48
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fCURSUM) from HIT  where fOBJECT = '" & fBASE & "' and fTYPE = 'N2' "
        sql_Value = 587.29
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Պարտքերի մարում
    exTerm = "010118"
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
        sql_Value =  0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'RÄ'"
        sql_Value =  0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R1' "
        sql_Value = 3366.81
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 530.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 487.21
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fCURSUM) from HIR  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 1174.58
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select SUM(fCURSUM) from HIR  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 1174.58
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Տոկոսի հաշվարկ
    Call Calculate_Percent(fOBJECT , exTerm , exTerm)
    
    'Պայմանագրի փակում
    Call Close_Contract(exTerm)
    wMDIClient.Refresh
    BuiltIn.Delay(1500)
    
    'Ստուգում է փակման ամսաթիվ սյունը
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fDATECLOSE")
    If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(colNum).Text) = Trim("01/01/18") Then
          Log.Error("Don't match")
    End If
   
    'Բացում է պայմանագիրը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen)
    Call ClickCmdButton(5,"²Ûá")

    actionExists = False
    
    'Ջնջում է Դիտում և խմբագրում/Այլ/Հաշվարկման ամսաթվեր թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(exTerm,exTerm,actionExists,actionType,c_ViewEdit & "|" & c_Other & "|" & c_CalcDates)
    'Ջնջում է Ռեպոյի մարում գործողությունը
    actionExists = True
    actionType = "12"
    Call Delete_Actions(exTerm,exTerm,actionExists,actionType,c_OpersView )
    'Ջնջում է Տոկոսի հաշվարկ փաստաթութը
    actionDate = "311217"
    actionType = "211"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    'Ջնջում է Ռեպոյի մարում գործողությունը
    actionDate = "031017"
    actionType = ""
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    actionDate = "031017"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    actionDate = "021017"
    'Ջնջում է Դիտում և խմբագրում/Այլ/Հաշվարկման ամսաթվեր թղթապանակի բոլոր փաստաթղթերը
    actionExists = False
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_ViewEdit & "|" & c_Other & "|" & c_CalcDates)
    Call Close_Pttel("frmPttel")
    BuiltIn.Delay(2000)
  ' Մուտք ադմինիստրատորի ԱՇՏ4.0
    Call ChangeWorkspace(c_Admin40)

    ' Մուտք ստեղծված փաստաթղթեր թղթապանակ
    workEnvName = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|êï»ÕÍí³Í ÷³ëï³ÃÕÃ»ñ"
    workEnv = "Ստեղծված փաստաթղթեր"
    stRekName = "SDATE"
    endRekName = "EDATE"
    wStatus = True
    isnRekName = "ISN"
    todayDMY = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
    If Not AccessFolder(workEnvName, workEnv, stRekName, todayDMY, endRekName, todayDMY, wStatus, isnRekName, perCalcISN2) Then
          Log.Error("Սխալ՝ Ստեղծված փաստաթղթեր թղթապանակ մուտք գործելիս")
          Exit Sub
    End If
    ' Տոկոսների հաշվարկում փաստաթղթի ջնջում
    Call Paysys_Delete_Doc(False)
    Call Close_Pttel("frmPttel")
    
    Call ChangeWorkspace(c_RevRepo) 
    Call LetterOfCredit_Filter_Fill("|Ð³Ï³¹³ñÓ é»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)
    
    'Ջնջում է Ռեպոյի մարում գործողությունը
    actionDate = "021017"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    
    'Ջնջում է Դիտում և խմբագրում/Տոկոսադրույքներ/Տոկոսադրույքներ թղթապանակի բոլոր փաստաթղթերը
    actionDate = "020817" 
    actionExists = False
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_ViewEdit & "|"  & c_Percentages & "|" & c_Percentages)
    'Ջնջում է Երկարաձգման փաստաթուղթը   
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates)
    'Ջնջում է Երկարաձգման փաստաթուղթը 
    actionDate = "061018"  
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_ViewEdit & "|" & c_Other & "|" & c_SecChng)
    'Ջնջում է Տոկոսի մարում փաստաթութը
    actionDate = "010817"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    ' Ջնջել արժեթղթի փոփոխությունը
    actionDate ="030717"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_ViewEdit & "|" & c_Other & "|" & c_SecChng)

    'Ջնջում է Գործողությունների դիտում թղթապանակի մնացած գործողությունները
    actionDate = "010117"
    actionEndDate = "010118"
    actionType = ""
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_OpersView )
    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    'Փակել ASBANK համակարգը
    Call Close_AsBank()
    
End Sub