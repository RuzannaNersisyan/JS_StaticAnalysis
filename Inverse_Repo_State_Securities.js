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

'Test Case Id 166624
 
Sub Inverse_Repo_State_Securities_Test()

    Dim fDATE,sDATE
    Dim client, curr, acc, summa, date, kindscale,per, baj, dateAgr, DateFill,CheckPayDates
    Dim PayDates, Paragraph, Direction ,secState, secClass, security,fBASE, docNum,Price 
    Dim queryString, sql_Value, colNum, sql_isEqual,fOBJECT,calcDate
    Dim mainSum, perSum, newSec, oldSecCost, newSecCost, exTerm, Param, CloseDate
    Dim actionDate, actionEndDate, actionExists, actionType, tabN
     
    fDATE = "20250101"
    sDATE = "20140101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Call Create_Connection()
    Call ChangeWorkspace(c_RevRepo) 
    
    client = ""
    curr = "000"          
    acc = "000007800"             
    summa = "1055000"              
    date = "290516"                         
    kindscale = "1"  
    per = "12"
    baj = "365"
    dateAgr = "291217"   
    DateFill = 1 
    CheckPayDates = 0
    PayDates = ""
    Paragraph = 1
    Direction = 2
    secState = 1
    secClass = "B"
    security ="SS-000"
    
    Call wTreeView.DblClickItem("|Ð³Ï³¹³ñÓ é»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
    Call Inverse_Repo_Create(client, curr, acc, summa, date, kindscale,per, baj, date, dateAgr, DateFill,date,CheckPayDates, _
                     PayDates, Paragraph, Direction ,secState, secClass, security,summa,fBASE, docNum)
    Log.Message(fBASE)
    Log.Message(docNum)
    BuiltIn.Delay(1000)
  
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
    BuiltIn.Delay(4000)
    
         'Կատարում ենք SQL ստուգում        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 946724.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R1'"
        sql_Value = 946724.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If


    'Call LetterOfCredit_Filter_Fill("|Ð³Ï³¹³ñÓ é»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)
    
    'Տոկոսի հաշվարկ
    calcDate = "280616"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT) 
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում      
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 9648.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾'"
        sql_Value = 0.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM  from HIR where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 9648.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 9648.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾'"
        sql_Value = 0.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 9648.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Պարտքերի մարում
    Date = "290616"
    tabN = 2
    Call Debt_Repayment(fOBJECT,Date, mainSum,perSum,2,acc,docNum,tabN)
    Log.Message(fOBJECT) 
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում       
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾'"
        sql_Value = 0.8
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
        sql_Value = 9648.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
     'Տոկոսի հաշվարկ
    calcDate = "290616"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾'"
        sql_Value = -0.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 311.3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    Call Close_Pttel("frmPttel")
    Call ChangeWorkspace(c_SecForSale)
    Call LetterOfCredit_Filter_Fill("|²ñÅ»ÃÕÃ»ñ í³×³éùÇ|", 1, "SS-000") 
   
    'Տոկոսների խմբային հաշվարկ
    Date = "300616"
    Call Group_Persent_Calculate(Date,Date)
    BuiltIn.Delay(2000)
    Call Close_Pttel("frmPttel")
    
    Call ChangeWorkspace(c_RevRepo)
    Call LetterOfCredit_Filter_Fill("|Ð³Ï³¹³ñÓ é»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)    
    
    'Արժեթղթի փոփոխություն
    date = "300616"
    newSec = "SS-001"
    Call Change_Security(date,security,newSec,oldSecCost,newSecCost)
    
    Call wMainForm.MainMenu.Click(c_AllActions )
    Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" & c_Other & "|" & c_SecChng)
    'Լրացնում է ամսաթիվ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","START","^!A[Del]" & date)
    'Լրացնում է ամսաթիվ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","END","^!A[Del]" & date) 
    Call ClickCmdButton(2,"Î³ï³ñ»É")
    
    colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("fNEWSECNAME")    
    Log.Message(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text)
    If Not Trim(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text) = "AMGN60294193" then
        Log.Error("New security is not right")
    End If
    
    colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("fOLDSECNAME")
    Log.Message(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text)
    If Not Trim(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text) = "AMGB1029A250" then
        Log.Error("Old security is not right")
    End If
    Call Close_Pttel("frmPttel_2")
        
    'Տոկոսների խմբային հաշվարկ
    Date = "010517"
    Call Group_Persent_Calculate(Date,Date)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում       
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 95554.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 95243.5
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = 1.3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 311.3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 84972.1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = -0.80
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
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում       
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2'"
        sql_Value = 213441.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fLASTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value =  213441.6
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
        sql_Value = 946724
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 95554.8
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value =  213052.5
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = 1.3
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
        
    Call Close_Pttel("frmPttel")
    Call ChangeWorkspace(c_SecForSale)
    Call LetterOfCredit_Filter_Fill("|²ñÅ»ÃÕÃ»ñ í³×³éùÇ|", 1, "SS-001") 
   
    'Տոկոսների խմբային հաշվարկ
    Date = "280218"
    Call Group_Persent_Calculate(Date,Date)
    BuiltIn.Delay(2000)
    ' Փակել ընթացիկ պատուհանը
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClCurrWindow)
     
    Call LetterOfCredit_Filter_Fill("|²ñÅ»ÃÕÃ»ñ í³×³éùÇ|", 1, "SS-000") 
   
    'Տոկոսների խմբային հաշվարկ
    Date = "280218"
    Call Group_Persent_Calculate(Date,Date)
    BuiltIn.Delay(2000)
    ' Փակել ընթացիկ պատուհանը
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClCurrWindow)    
    
    Call ChangeWorkspace(c_RevRepo)
    Call LetterOfCredit_Filter_Fill("|Ð³Ï³¹³ñÓ é»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)    
    
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
        sql_Value = 946724
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R2' "
        sql_Value = 213441.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 213052.5
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fPENULTREM  from HIRREST  where fOBJECT = '" & fBASE & "' and fTYPE = 'R¾' "
        sql_Value = 1.3
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
    BuiltIn.Delay(3000)
    
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
    actionType = 211
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_OpersView )
    'Ջնջում է Դիտում և խմբագրում/Տոկոսադրույքներ/Տոկոսադրույքներ թղթապանակի բոլոր փաստաթղթերը
    actionDate = "020517" 
    actionExists = False
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_ViewEdit & "|"  & c_Percentages & "|" & c_Percentages)
    'Ջնջում է Երկարաձգման փաստաթուղթը   
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates)
    'Ջնջում է Տոկոսի մարում փաստաթութը
    actionDate = "290616"
    actionEndDate = "010517"
    actionType = "211"
    actionExists = True
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_OpersView )
    'Ջնջում է Տոկոսի հաշվարկ փաստաթութը
    actionType = 23
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    actionDate = "290616"
    actionType = "211"
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
'    'Ջնջում է Գործողությունների դիտում էղէապանակի մնացած գործողությունները
'    actionEndDate = "030918"
'    actionType = Null
'    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_OpersView )
'    BuiltIn.Delay(1000) 
    'Ջնջում է SS-001 պայմանագրի Տոկոսների հաշվարկ փաստաթուղթը
    Call Close_Pttel("frmPttel")
    Call ChangeWorkspace(c_SecForSale)
    Call LetterOfCredit_Filter_Fill("|²ñÅ»ÃÕÃ»ñ í³×³éùÇ|", 1, "SS-000") 
    actionDate = "280218"
    actionType = 511
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    'Ջնջում է SS-000 պայմանագրի Տոկոսների հաշվարկ փաստաթուղթը
    Call Close_Pttel("frmPttel")
    Call LetterOfCredit_Filter_Fill("|²ñÅ»ÃÕÃ»ñ í³×³éùÇ|", 1, "SS-001") 
    actionType = 511
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    Call Close_Pttel("frmPttel")
    
    Call ChangeWorkspace(c_RevRepo)
    Call LetterOfCredit_Filter_Fill("|Ð³Ï³¹³ñÓ é»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)    
    
    actionDate = "300616"
    actionExists = False
    actionType = Null
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_ViewEdit & "|" & c_Other & "|" & c_SecChng )
    actionDate = "290516"
    actionEndDate = "010118"
    actionExists = True
    actionType = Null
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_OpersView )
    
    Call Close_Pttel("frmPttel")
    Call ChangeWorkspace(c_SecForSale)
    Call LetterOfCredit_Filter_Fill("|²ñÅ»ÃÕÃ»ñ í³×³éùÇ|", 1, "SS-000") 
    actionDate = "300616"
    actionType = 511
    Call Delete_Actions(actionDate,actionDate,actionExists,actionType,c_OpersView )
    Call Close_Pttel("frmPttel")
    
    Call ChangeWorkspace(c_RevRepo)
    Call LetterOfCredit_Filter_Fill("|Ð³Ï³¹³ñÓ é»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)    
    
    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    'Փակել ASBANK համակարգը
    Call Close_AsBank()
        
End Sub