OPTION Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Financial_Leasing_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Akreditiv_Library 
'USEUNIT Library_Common  
'USEUNIT Constants
'USEUNIT Mortgage_Library
'Test case Id 166724

Sub Leasing_Reevaluate_Test()

   Dim fDATE,sDATE,DocType,FolderPath,LeasingSch,attr,Date
   Dim fBASE,griddate,summ,isExists,param,cash,acc,fBaseCP,actionType
   Dim calcDate,fadeDate,dateStart,perSum,summperc,actionExist,actionExists
   Dim dategive,date_arg,c_OpersView,cls,DocNumb,fOBJECT,result
   Dim cap,ext,rep,per,perCalc,close,SumSell,SumRevl,dateEnd,mainSumma
   Dim queryString,sql_Value,colNum,sql_isEqual,docAcc,docISN
   Dim docNum,faddate,faDate,eDate,period,direction,sum
   
    fDATE = "20250101"
    sDATE = "20140101"
    Date = "310318"    
    griddate = "310319"
    summ = "50000"
    cash = "2"
    acc = "30220042300" 
      
    Call Initialize_AsBank("bank", sDATE, fDATE)
      
    Call Create_Connection()
    
    Call ChangeWorkspace(c_FinantialLeasing)
    
      'Գրաֆիկով լիզինգի պայմանագրի ստեղծում
    FolderPath = "|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ"
   
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
    If Not Other_Payment_Schedule_AllTypes(param,Date,Date,griddate,Period,direction) Then 
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
    Log.Message(LeasingSch.fBASE)
    BuiltIn.Delay(2000)
    
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
    Call Sys.Process("Asbank").VBObject("MainForm").MainMenu.Click(c_AllActions)
    Call Sys.Process("Asbank").VBObject("MainForm").PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
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
    
    'Լիզինգի տրամադրում
    Call Give_Leasing(Date)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
        sql_Value = -63578.50
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
    
    'Տոկոսի հաշվարկ    
    calcDate = "100418" 
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
        sql_Value = -60290.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 3287.70
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from HIF  where fOBJECT = '" & LeasingSch.fBASE & "'"
        sql_Value = 17
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIT  where fOBJECT = '" & LeasingSch.fBASE & "'"
        sql_Value = 3287.70
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

    'Գրաֆիկի վերանայում
    dateStart = "110418"
    dateEnd = "310319"
    mainSumma = "1000000"
    Call Fading_Schedule_Fill(dateStart, dateEnd, mainSumma)
    BuiltIn.Delay(2000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & Trim(docISN) & "','2019-01-01 00:00:00' ) as Acc"
        sql_Value = -60290.8
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
        sql_Value = 52
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Տոկոսի հաշվարկ
    calcDate = "150418"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & Trim(docISN) & "','2019-01-01 00:00:00' ) as Acc"
        sql_Value = -58647
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 4931.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 4931.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIT  where fBASE = '" & fOBJECT & "'"
        sql_Value = 1643.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fBASE = '" & fOBJECT & "' and fOP = 'PER'"
        sql_Value = 1643.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 3287.70
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from HIF  where fOBJECT = '" & LeasingSch.fBASE & "'"
        sql_Value = 19
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

    
    'Պարտքերի մարում        
    fadeDate = "160418"
    perSum = "10000"
    Call Leasing_Fade_Debt(fOBJECT,fadeDate,Null,Null,"2", acc,DocNumb)
    Log.Message(fOBJECT)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & Trim(docISN) & "','2019-01-01 00:00:00' ) as Acc"
        sql_Value = -58647
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from HIF  where fOBJECT = '" & LeasingSch.fBASE & "'"
        sql_Value = 20
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from AGRSCHEDULE  where fAGRISN = '" & LeasingSch.fBASE & "'"
        sql_Value = 3
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from AGRSCHEDULEVALUES  where fAGRISN = '" & LeasingSch.fBASE & "'"
        sql_Value = 78
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R8' "
        sql_Value = 63578.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÄ' and fOP = 'AGJ'"
        sql_Value = 76923.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÄ' and fOP = 'DBT'"
        sql_Value = 76923.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 923076.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
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
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & Trim(docISN) & "','2019-01-01 00:00:00' ) as Acc"
        sql_Value = -26857.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 36518.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 36720.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 4931.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 29917.70
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÄ'"
        sql_Value = 230769.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from HIF  where fOBJECT = '" & LeasingSch.fBASE & "'"
        sql_Value = 44
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸' and fTRANS = '3'"
        sql_Value = 8800.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸' and fTRANS = '5'"
        sql_Value = 8345.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸' and fTRANS = '7'"
        sql_Value = 7839.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸' and fTRANS = '9'"
        sql_Value = 6600.60
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Վերագնահատում գործողության կատարում
    Date = "160818"
    SumRevl = "1200000"
    Call Leasing_ReEvaluation(Date,SumRevl)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & Trim(docISN) & "','2019-01-01 00:00:00' ) as Acc"
        sql_Value = -26857.9
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÒ' and fOP = 'RVL'"
        sql_Value = 400000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÒ'"
        sql_Value = 1200000.00
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
    
    'Տոկոսի հաշվարկ
    calcDate = "160818"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & Trim(docISN) & "','2019-01-01 00:00:00' ) as Acc"
        sql_Value = -26655.6
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
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 36720.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from HIF where fOBJECT = '" & LeasingSch.fBASE & "'"
        sql_Value = 45
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Լիզինգի վաճառք գործողության կատարում
    Date = "170818"
    SumSell = "923076.90"
    Call Leasing_Sale(Date,SumSell,"2",acc)
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & Trim(docISN) & "','2019-01-01 00:00:00' ) as Acc"
        sql_Value = 0 '-26655.6
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from HIF where fOBJECT = '" & LeasingSch.fBASE & "'"
        sql_Value = 47
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from AGRSCHEDULE where fAGRISN = '" & LeasingSch.fBASE & "'"
        sql_Value = 4
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN = '" & LeasingSch.fBASE & "'"
        sql_Value = 80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If    
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & LeasingSch.fBASE & "' and  fTYPE = 'R2' "
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÒ'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÒ'"
        sql_Value = 1200000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 36518.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÄ' "
        sql_Value = 307692.40
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 36922.90
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Ջնջում է լիզինգի վաճառք փաստաթուղթը
    actionExists = True
    actionType = "27"
    Call Delete_Actions(Date,Date,actionExists,actionType,"Գործողությունների դիտում")
    'Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը
    actionType = "51"
    Call Delete_Actions(calcDate,calcDate,actionExists,actionType,"Գործողությունների դիտում")
    'Ջնջում է Վերագնահատում փաստաթուղթը
    actionType = "q3"
    Call Delete_Actions(calcDate,calcDate,actionExists,actionType,"Գործողությունների դիտում")
    'Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը
    actionType = "51"
    dategive = "150818"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,"Գործողությունների դիտում")
    'Ժամկետանց գումարի մարում փաստաթղթի ջնջում
    actionType = "22"
    calcDate = "160418"
    Call Delete_Actions(calcDate,calcDate,actionExists,actionType,"Գործողությունների դիտում")    'Հաշվարկված տոկոսների ճշգրտում փաստաթղթի ջնջում
    'Ջնջում է Տոկոսի հաշվարկ փաստաթուղթը
    actionType = "51"
    dategive = "150418"
    Call Delete_Actions(dategive,dategive,actionExists,actionType,"Գործողությունների դիտում")
    'Ջնջում է Մարումների  գրաֆիկ փաստաթուղթը 

    BuiltIn.Delay(delay_middle)
    wMainForm.Refresh
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_SchFolder)
    wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").MoveLast
    BuiltIn.Delay(2000)
    Sys.Process("Asbank").Refresh
    'Կատարում է ջնջել գործողությունը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete)
    If Sys.Process("Asbank").WaitVBObject("frmAsMsgBox", 1500).Exists Then
        Call ClickCmdButton(5, "²Ûá")
        Call ClickCmdButton(3, "²Ûá")
    Else
        Call ClickCmdButton(3, "²Ûá")
    End If  
     Call Close_Pttel("frmPttel_2")
    
    'Ջնջում է մնացած գործողությունները
    dategive = "310318"
    date_arg = "120418"
    actionType = Null
    Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")

    'Մայր պայմանագրի ջնջում
    Call Delete_Doc()
    Call Close_AsBank()

End Sub