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

'Test Case Id 166628

Sub Repo_Non_State_Different_Curr_Securities_Extension_Test()

    Dim fDATE, sDATE, attr, frmAsMsgBox, FrmSpr, opDate, exTerm, MainSum, PerSum, Prc, NonUsedPrc
    Dim EffRete, ActRete,calcDate,fOBJECT,mainSumm,perSumm,CloseDate
    Dim Client, Curr, CalcAcc, Summa, Date, SecState, SecName, Nominal, Price, Kindscale
    Dim Percent, GiveDate, Term, DateFill, CheckPayDates, PayDates, Paragraph, Direction
    Dim Sector, Aim, Country,District, Region, PaperCode, fBASE, DocNum, Workspace
    Dim actionDate,actionEndDate,actionExists,actionType,Param, tabN
    Dim queryString, sql_Value, colNum, sql_isEqual,fDocBASE,per,part
    
    fDATE = "20250101"
    sDATE = "20030101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Call Create_Connection()
    Call ChangeWorkspace(c_RepoAgrs) 

    'Ռեպոի ստեղծում
    Curr = "000"
    CalcAcc = "77786923818"
    Summa = 1200000
    Date = "010118"
    SecState = 2
    SecName = "AMGLBLB25ER6"
    Nominal = "800" 
    Price = "1000"
    Percent = "12"
    GiveDate = "010118"
    Term = "280918"
    DateFill = 1
    CheckPayDates = 0
    Direction = 2
    Paragraph = 1
    Sector = "U2"
    Aim = "00"
    District = "001"
    Region = "010000008"
    Country = "AM"
    PaperCode = 111
    
    Call Repo_Create(Client, Curr, CalcAcc, Summa, Date, SecState, SecName, Nominal, Price,_
               "", Percent, GiveDate, Term, DateFill, CheckPayDates, PayDates, Paragraph,_
               Direction, Sector, Aim, Country, District, Region, PaperCode, fBASE, DocNum)
  
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
    Log.Message(fBASE)     
    BuiltIn.Delay(2000)              
    'Հաստատել պայմանագիրը
    Call Close_Pttel("frmPttel")
    Call wTreeView.DblClickItem("|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
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
  
    Call LetterOfCredit_Filter_Fill("|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)
  
    'Ստանում է Ռեպոյով գնված արժեթղթեր փաստաթղթի ISN-ը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_SecsFromRepo)
    BuiltIn.Delay(1000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_View)
    BuiltIn.Delay(2000)
    fDocBASE = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    Log.Message(fDocBASE)
    wMDIClient.vbObject("frmASDocForm").Close()
    BuiltIn.Delay(2000)
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").Close()

    'Ռեպոյի տրամադրում
    Call Repo_Provide(Date)
    
         'Կատարում ենք SQL ստուգում
        queryString = "select count(*)  from HIF where fOBJECT = '" & fBASE & "'"
        sql_Value = 25
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1200000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R9' "
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1200000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R9' "
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HN'"
        sql_Value = 800.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HP' "
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HN'"
        sql_Value = 800.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HP' "
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    Call LetterOfCredit_Filter_Fill("|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)

    'Տոկոսի հաշվարկ
    calcDate = "310118"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select count(*)  from HIF where fOBJECT = '" & fBASE & "'"
        sql_Value = 26
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 12230.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R9'"
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 12230.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 12230.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R9'"
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 12230.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIT where fOBJECT = '" & fBASE & "' and fTYPE = 'N2'"
        sql_Value = 12230.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Պարտքերի մարում
    Date = "010218"
    tabN = 2
    Call Debt_Repayment(fOBJECT,Date, mainSum,perSum,2,CalcAcc,docNum, tabN)
    Log.Message(fOBJECT)    
    
         'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' and fOP = 'PER'"
        sql_Value = 12230.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' and fOP = 'DBT'"
        sql_Value = 12230.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' and fOP = 'DBT' "
        sql_Value = 12230.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
         queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' and fOP = 'PRJ' "
        sql_Value = 12230.1
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
        sql_Value = 12230.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Տոկոսի հաշվարկ
    calcDate = "010218"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    
         'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM  from HIT where fOBJECT = '" & fBASE & "' and fTYPE = 'N2' and fDATE = '2018-02-01'"
        sql_Value = 394.5
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' and fDATE = '2018-02-01' "
        sql_Value = 12230.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If        
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R9'"
        sql_Value = 1000
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 394.5
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R9' "
        sql_Value = 0
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Տոկոսի հաշվարկ
    calcDate = "280218"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R9'"
        sql_Value =  1000
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 11046.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R9' "
        sql_Value = 0
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Տոկոսների խմբային հաշվարկ
    Date = "030918"
    Call Group_Persent_Calculate(Date,Date)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում        
        queryString = "select count(*)  from HIR where fOBJECT = '" & fBASE & "'"
        sql_Value = 44
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If        
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value =  84821.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R9' "
        sql_Value = 1000
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 84427.3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 11046.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R9' "
        sql_Value = 0
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 71408.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
   'Կատարում է Ժամկետների վերանայում
    Date = "040918"
    exTerm = "281218"
    param = c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms
    Call Deposit_Extension(Date,exTerm,Date,Paragraph,direction,Param)
    
    'Տոկոսադորւյքի նշանակում
    per = "15"
    part = "365"
    Call Set_Persentage_Repo(fOBJECT,date,per,part)
    
    'Արժեթղթերի վաճառք
    Call Repo_Sell_Security(Date, mainSum, "2", "77029243818")
    
    Call LetterOfCredit_Filter_Fill("|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)

    'Տոկոսի հաշվարկ
    calcDate = "270918"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    
         'Կատարում ենք SQL ստուգում
        queryString = "select count(*)  from HIR where fOBJECT = '" & fBASE & "'"
        sql_Value = 49
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If  
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value =  96657.4 '94290.3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R9' "
        sql_Value = 0
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value =  96657.4''94290.3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'RS' "
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R9' "
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 84821.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 84427.3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R9' "
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HL'"
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HN' and fOP = 'AGR'"
        sql_Value = 800.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HN' and fOP = 'SEL' "
        sql_Value = 800.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HP' and fOP = 'AGR'"
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HP' and fOP = 'SEL'"
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HS'"
        sql_Value = 800.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HL'"
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HN'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HP'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HS'"
        sql_Value = 800.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select count(*) from HIR where fOBJECT = '" & fDocBASE & "'"
        sql_Value = 6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Տոկոսի հաշվարկ
    calcDate = "280918"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    
         'Կատարում ենք SQL ստուգում
        queryString = "select count(*)  from HIR where fOBJECT = '" & fBASE & "'"
        sql_Value = 51
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If  
    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 97150.6 '94684.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = -0.7
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = 2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 96657.4 '94290.3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Արժեթղթերի գնում
    Date = "290918"
    mainSum = 5000
    Call Repo_Buy_Security(Date, mainSum, "2", "77029243818")
    
        'Կատարում ենք SQL ստուգում
        queryString = "select count(*)  from HIR where fOBJECT = '" & fBASE & "'"
        sql_Value = 53
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If  
    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'RS' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
   
        queryString = "select fLASTREM  from HIRREST where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HL'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HN'"
        sql_Value = 800.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HP'"
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HS'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HL'"
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HN'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HP'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fDocBASE & "' and fTYPE = 'HS'"
        sql_Value = 800.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select count(*) from HIR where fOBJECT = '" & fDocBASE & "'"
        sql_Value = 10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
            
    Call LetterOfCredit_Filter_Fill("|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)
 
    'Տոկոսների խմբային հաշվարկ
    Date = "271218"
    Call Group_Persent_Calculate(Date,Date)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select count(*)  from HIR where fOBJECT = '" & fBASE & "'"
        sql_Value = 72
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If  
    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 141534.4 '130191.6
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
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'RÄ' "
        sql_Value = 1200000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = -0.7
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 97150.6 '94684.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 129698.7 '120723.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

    'Պարտքերի մարում
    Date = "281218"
    Call Debt_Repayment(fOBJECT,Date, mainSumm,perSumm,2,CalcAcc,docNum, tabN)
    Log.Message(fOBJECT)
    BuiltIn.Delay(1000)
    
         'Կատարում ենք SQL ստուգում    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R1' "
        sql_Value = 0'''--1200000.00 
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R9' "
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
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'RÄ' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R1' "
        sql_Value = 1200000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 141534.4 '130191.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R9' "
        sql_Value = 1000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 129698.7 '120723.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = -0.7
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'RÄ' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select count(*) from HIR where fOBJECT = '" & fDocBASE & "'"
        sql_Value = 12
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
    'Տոկոսի հաշվարկ
    calcDate = "281218"
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
  
    actionDate = "281218"
    actionEndDate = "281218"
    actionExists = False
    
    'Ջնջում է Դիտում և խմբագրում/Այլ/Հաշվարկման ամսաթվեր թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_ViewEdit & "|" & c_Other & "|" & c_CalcDates)
    'Ջնջում է Ռեպոյի մարում գործողությունը
    actionExists = true
    actionType = "22"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    'Ջնջում է Տոկոսի հաշվարկ փաստաթութը
    actionDate = "270918"
    actionEndDate = "271218"
    actionType = 511
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_OpersView )
    'Ջնջում է Ռեպո համ-ով ձեռք բերված արժեթղթերի վաճառված մասի առք փաստաթուղթը
    actionDate = "290918"
    actionType = "B4"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    'Ջնջում է Ռեպո համ-ով ձեռք բերված արժեթղթերի վաճառք փաստաթուղթը 
    actionDate = "040918"   
    actionType = "B3"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    'Ջնջում է Դիտում և խմբագրում/Տոկոսադրույքներ/Տոկոսադրույքներ թղթապանակի բոլոր փաստաթղթերը
    actionExists = False
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_ViewEdit & "|"  & c_Percentages & "|" & c_Percentages)
    'Ջնջում է Երկարաձգման փաստաթուղթը    
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates)
    'Ջնջում է Տոկոսի հաշվարկ փաստաթութը
    actionExists = True
    actionDate = "010218"
    actionEndDate = "030918"
    actionType = 511
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_OpersView )
    'Ջնջում է Տոկոսի մարում փաստաթութը
    actionType = "53"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    'Ջնջում է Գործողությունների դիտում էղէապանակի մնացած գործողությունները
    actionDate = "010118"
    actionEndDate = "030918"
    actionType = Null
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_OpersView )
    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    'Փակել ASBANK համակարգը
    Call Close_AsBank()
    
End Sub