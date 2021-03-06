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
'USEUNIT Mortgage_Library

'Test case Id 166725


Sub Leasing_with_Mortgage_Test()

   Dim fDATE,sDATE,DocType,FolderPath,LeasingSch,attr,Date,docExist
   Dim fBASE,griddate,summ,isExists,param,cash, acc, fBaseCP,DocNumb
   Dim calcDate,fadeDate,dateStart,perSum,summperc,actionExist,actionExists,actionType
   Dim dategive,date_arg,c_OpersView,cls,DocN, effIntRate, actIntRate
   Dim cap,ext,rep,per,perCalc,close,SumSell,SumRevl,dateEnd,mainSumma,result
   Dim MortgageType,docTyp,curr,mortSum,mortCount,sealDate,giveDate,mortPlace,mortSub
   Dim queryString,sql_Value,colNum,sql_isEqual,docAcc,docISN, fOBJECT
   Dim docNum,faddate,faDate,eDate,period,direction,sum
    fDATE = "20250101"
    sDATE = "20140101"
    Date = "310318"
    griddate = "310319"
    summ = "50000"
    cash = "2"
    acc = "30220042300"
    calcDate = "100418"
    perSum = "10000"
      
    Call Initialize_AsBank("bank", sDATE, fDATE)
      
    Call Create_Connection()
    
    Call ChangeWorkspace(c_FinantialLeasing)
    
    'Գրաֆիկով լիզինգի պայմանագրի ստեղծում
    FolderPath = "|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ"
    DocType = "¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ"

    Set LeasingSch = New_LeasingDoc()
    With LeasingSch
      .CalcAcc = "30220042300"
      .Date = "310318"
      .GiveDate = "310318"
      .Term = "310319"
      .Summa = 1000000
      .BuyPrice = 800000
      .DatesFillType = "1"
      .PaperCode = 111
      .DatesFillType = 1
      .DocType = "¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ"
      .office = "00"
      .department = "1"
      .DatesFillType = "1"
    End With

    Call LeasingSch.CreateLeasing(FolderPath)
    Log.Message(LeasingSch.DocNum)

    'Մարումների գրաֆիկի նշանակում
    isExists = Fade_Schedule()
    If Not isExists Then
        Log.Error("Cannot create fade schedule")
        Exit Sub
    End If
   'Այլ վճարումների գրաֆիկի նշանակում
    param = "¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ- " & Trim(LeasingSch.DocNum)& " {öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1}"
    period = 1
    direction = 2
    If Not Other_Payment_Schedule_AllTypes(param,Date,Date,griddate,Period,Direction) Then 
        Log.Error("There was no document")
        Exit Sub
    End If
    wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Keys("[Up]")
    'Ուղարկում է պայմանագիրը հաստատման       
    Call PaySys_Send_To_Verify()
    BuiltIn.Delay(2000) 
    'Փակում է պատուհանը
    Call Close_Pttel("frmPttel")
    
    Call wTreeView.DblClickItem("|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    
    'Կատարում է ստուգում , եթե գլխավոր պայմանագիրը առկա է ,ապա ուղարկում է հաստատման, հակառակ դեպքում դուրս է բերում սխալ
    isExists = Find_Doc_ByNum(LeasingSch.DocNum,2)
    If Not isExists Then
      Log.Error("The document does՚t exist")
      Exit sub
    End If
    'Վավերացնում է փաստաթուղթը
    Call Validate_Doc()
    Call Close_Pttel("frmPttel")
    
        'Կատարում ենք SQL ստուգում
        queryString = "select count(*) from AGRSCHEDULE where fAGRISN =  '" & LeasingSch.fBASE & "'"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN =  '" & LeasingSch.fBASE & "'"
        sql_Value = 26
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    Call wTreeView.DblClickItem("|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    
    'Կատարում է ստուգում , եթե գլխավոր պայմանագիրը առկա է ,ապա ուղարկում է հաստատման, հակառակ դեպքում դուրս է բերում սխալ
    isExists = Find_Doc_ByNum(LeasingSch.DocNum,0)
    If Not isExists Then
      Log.Error("The document does՚t exist")
      Exit sub
    End If
    
    'Ստանում է չվաստակած եկամուտի հաշիվը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
    'Պայմանագրի փնտրում պայմանագրի թղթապանակաում
    wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveFirst
    Do Until wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").EOF
        colNum =	wMDIClient.VBObject("frmPttel_2").GetColumnIndex("fSPEC")
        If Trim(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text) = "î»Õ³µ³ßËí³Í ýÇÝ.ÉÇ½ÇÝ·Ç Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³Í- " & Trim(LeasingSch.DocNum) Then                                                	
            Call wMainForm.MainMenu.Click(c_AllActions)
            Call wMainForm.PopupMenu.Click(c_View)
            Exit Do
        Else
            Log.Message(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(colNum).Text)
            Call wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").MoveNext
        End If
    Loop
    docAcc = Get_Rekvizit_Value("Document",2,"Mask","ACCDISCNT")

    docISN = Get_Query_Result("select fISN from FOLDERS  where fSPEC like '" & docAcc &"%' and fFOLDERID = 'C.900733668' ")
    Log.Message(docAcc)
    Log.Message(docISN)
    wMDIClient.VBObject("frmASDocForm").Close()
    Call Close_Pttel("frmPttel_2")
    
     MortgageType = "²ÛÉ ·ñ³í"
     docTyp = "9"
     curr = "000"
     mortSum = "1000000"
     mortCount ="2000"
     sealDate = "310318"
     giveDate = "310319"
     mortPlace = "1"
     mortSub = "0"
     
    'Գրավի փաստաթղթի ստեղծում
    Call Create_Mortgage(MortgageType,DocN,docTyp,curr,mortSum,mortCount,sealDate,giveDate,mortPlace,mortSub)
    'Ուղարկում է պայմանագիրը հաստատման       
    Call PaySys_Send_To_Verify()
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClAllWindows)
    BuiltIn.Delay(1000)
    Call ChangeWorkspace(c_RecPledge)
    
    Call wTreeView.DblClickItem("|êï³óí³Í ·ñ³í|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    Call Rekvizit_Fill("Dialog",1,"General","NUM",DocN)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Վավերացնում է փաստաթուղթը
    Call Validate_Doc()
    Call Close_Pttel("frmPttel")
    
    Call ChangeWorkspace(c_FinantialLeasing)
    Call wTreeView.DblClickItem("|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    Call Rekvizit_Fill("Dialog",1,"General","NUM",LeasingSch.DocNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    'Գանձում տրամադրումից գործողության կատարում
    sum = "100000"
    Call Collect_From_Provision (Date, sum, cash, acc, fOBJECT)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & Trim(docISN) & "','2019-01-01 00:00:00' ) as Acc"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from HIF  where fOBJECT =  '" & LeasingSch.fBASE & "'"
        sql_Value = 16
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R^'"
        sql_Value = 100000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT =  '" & LeasingSch.fBASE & "'"
        sql_Value = 100000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    Log.Message("Լիզինգի տրամադրում")
    'Լիզինգի տրամադրում
    Call Give_Leasing(Date)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
        sql_Value = -63578.5
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R^'"
        sql_Value = 100000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R8'"
        sql_Value = 63578.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RI'"
        sql_Value = 200000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÒ'"
        sql_Value = 800000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    Log.Message("Խմբային տոկոսի հաշվարկ")
    'Խմբային տոկոսի հաշվարկ
    calcDate = "150818"
    cap = 0
    ext = 1
    rep = 0
    per = 0
    perCalc = 0
    close = 0
    cls = 0
    Call Leasing_Group_Calculate(calcDate,calcDate,cap,ext,rep,per,perCalc,close,cls)
   
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & Trim(docISN) & "','2019-01-01 00:00:00' ) as Acc"
        sql_Value = -26857.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from HIF  where fOBJECT = '" & LeasingSch.fBASE & "'"
        sql_Value = 52
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2' and fTRANS = '2' "
        sql_Value = 4931.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2' and fTRANS = '3' "
        sql_Value = 303.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2' and fTRANS = '4' "
        sql_Value = 8497.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2' and fTRANS = '5' "
        sql_Value = 278.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2' and fTRANS = '6' "
        sql_Value = 8067.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2' and fTRANS = '7' "
        sql_Value = 252.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2' and fTRANS = '8' "
        sql_Value = 7586.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2' and fTRANS = '9' "
        sql_Value = 227.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2' and fTRANS = '10' "
        sql_Value = 6373.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2' and fTRANS = '11' "
        sql_Value = 202.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R8'"
        sql_Value = 63578.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RI'"
        sql_Value = 200000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R^'"
        sql_Value = 100000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÒ'"
        sql_Value = 800000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
   
    dateStart = "160818"
    effIntRate = "11"
    actIntRate = "10"
    Log.Message("Արդյունավետ տոկոսադրույքի նշանակում")
    'Արդյունավետ տոկոսադրույքի նշանակում
    Call Effective_InterestRate_DocFill (dateStart, effIntRate, actIntRate)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select count(*) from HIF  where fOBJECT = '" & LeasingSch.fBASE & "'"
        sql_Value = 54
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    Call wMainForm.MainMenu.Click(c_AllActions)  
    Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
    wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").MoveLast
    BuiltIn.Delay(3000)
    'Գրավի փակում
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_AgrClose)
    Call Rekvizit_Fill("Dialog",1,"General","DATECLOSE","![End]" & "[Del]" & griddate)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Ջնջել գրավի  փաստաթուղթը
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_Delete)
    Call ClickCmdButton(3, "²Ûá")
    Call Close_Pttel("frmPttel_2")
    Log.Message("Տոկոսի խմբային հաշվարկ")
    'Տոկոսի խմբային հաշվարկ
    calcDate = "300319"
    cap = 0
    ext = 1
    rep = 0
    per = 0
    perCalc = 0
    close = 0
    cls = 0
    Call Leasing_Group_Calculate(calcDate,calcDate,cap,ext,rep,per,perCalc,close,cls)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & Trim(docISN) & "','2019-01-01 00:00:00' ) as Acc"
        sql_Value = -26857.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    Log.Message("Պարտքերի մարում")
    'Պարտքերի մարում
    fadeDate = "310319"
    perSum = "63,578.50"
    Call Leasing_Fade_Debt(fOBJECT,fadeDate,Null,perSum,"1", acc,DocNumb)
    Call Close_Pttel("frmPttel")
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R8'"
        sql_Value = 63578.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 63578.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÄ'"
        sql_Value = 923077.20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 36720.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    Call ChangeWorkspace(c_CustomerService)  
    Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ") 
    Call Rekvizit_Fill("Dialog",1,"General","PERN","![End]" & "[Del]" & fadeDate)
    Call Rekvizit_Fill("Dialog",1,"General","PERK","![End]" & "[Del]" & fadeDate)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    Log.Message("Պայմանագիրը ուղարկել հաստատման")
    'Ուղարկում է պայմանագիրը հաստատման       
    Call Online_PaySys_Send_To_Verify(2)
    Call ChangeWorkspace(c_Verifier1)   
    'Փաստաթղթի առկայության ստուգում 1-ին հաստատողի մոտ
    docExist = Online_PaySys_Check_Doc_In_Verifier(DocNumb, fadeDate, fadeDate)
    If Not docExist Then
        Log.Error("The document with number " & DocNumb & " doesn՚t exist in 1st verify documents")
        Exit Sub
    End If
   
    'Փաստաթղթի վավերացում 1-ին հաստաոտղի կողմից
    Call PaySys_Verify(True)
    Call Close_Pttel("frmPttel")
    
    Call ChangeWorkspace(c_CustomerService)  
    Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ") 
    Call Rekvizit_Fill("Dialog",1,"General","PERN","![End]" & "[Del]" & fadeDate)
    Call Rekvizit_Fill("Dialog",1,"General","PERK","![End]" & "[Del]" & fadeDate)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    'Վավերացնում է փաստաթուղթը
    Call Validate_Doc()
    Call Close_Pttel("frmPttel")
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & Trim(docISN) & "','2019-01-01 00:00:00' ) as Acc"
        sql_Value = -26857.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from AGRSCHEDULE where fAGRISN =  '" & LeasingSch.fBASE & "'"
        sql_Value = 2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN =  '" & LeasingSch.fBASE & "'"
        sql_Value = 28
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÒ'"
        sql_Value = 800000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R8'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÒ'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 63578.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    Log.Message("Ջնջել գործողությունների կատարում")
    
    Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    Call Rekvizit_Fill("Dialog",1,"General","PERN","![End]" & "[Del]" & fadeDate)
    Call Rekvizit_Fill("Dialog",1,"General","PERK","![End]" & "[Del]" & fadeDate)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete)
    Call ClickCmdButton(3, "²Ûá")
    Call ClickCmdButton(5, "²Ûá")
    Call Close_Pttel("frmPttel")
    Call ChangeWorkspace(c_FinantialLeasing)

    BuiltIn.Delay(3000)
    
    Call wTreeView.DblClickItem("|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|Î³ñ·³¹ñáõÃÛáõÝÝ»ñ")
    wMDIClient.VBObject("frmPttel").VBObject("tdbgView").MoveFirst
    Do Until wMDIClient.VBObject("frmPttel").VBObject("tdbgView").EOF
        If Trim(wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(6).Text) = "ÈÇ½ÇÝ·Ç å³ñïù»ñÇ Ù³ñáõÙ" Then                                                	
            Call wMainForm.MainMenu.Click(c_AllActions)
            Call wMainForm.PopupMenu.Click(c_Delete)
            Call ClickCmdButton(3, "²Ûá")
            Exit Do
        Else
            wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
        End If
    Loop
    Call Close_Pttel("frmPttel")
    
    Call DeleteAllActions("|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|Üáñ ÷³ëï³Ã., ÃÕÃ³å³Ý³ÏÝ»ñ, Ñ³ßí»ïíáõÃÛáõÝÝ»ñ",LeasingSch.DocNum,"010118","010119")
    
    Call Close_AsBank()
     
End Sub