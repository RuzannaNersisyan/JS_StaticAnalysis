Option Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Financial_Leasing_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Akreditiv_Library 
'USEUNIT Library_Common  
'USEUNIT Constants
'USEUNIT Mortgage_Library

'Test case Id 166728

Sub Leasing_With_Schedule_Test()

     Dim fDATE,sDATE,DocType,FolderPath,LeasingSch,attr,Date
     Dim fBASE,griddate,summ,isExists,param,cash, acc,result
     Dim calcDate,fadeDate,dateStart,perSum,summperc,actionExist
     Dim dategive,date_arg,actionExists,actionType,c_OpersView,DocNumb
     Dim queryString,sql_Value,colNum,sql_isEqual,docAcc,docISN, fOBJECT
     Dim mainSum,docNum,faddate,faDate,eDate,period,direction,sum, state
     
      fDATE = "20250101"
      sDATE = "20010101"
      Date = "310318"
      griddate = "310319"
      summ = "50000"
      cash = "2"
      acc = "30220042300"
      
    Call Initialize_AsBank("bank", sDATE, fDATE)
      
    Call Create_Connection()

    Dim obj
    obj = Get_Query_Result("select dbo.asf_GetRem('01','582276740','2019-01-01 00:00:00' ) as Acc")
    Log.Message(obj)

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
    griddate = "310319"
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
    Log.Message(LeasingSch.fBASE)
    BuiltIn.Delay(1000)
    
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
   
    'Գանձում տրամադրումից գործողության կատարում
    sum = "100000"
    Call Collect_From_Provision (Date, sum, cash, acc, fOBJECT)
    BuiltIn.Delay(1000)

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
    BuiltIn.Delay(1000)
    
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
    BuiltIn.Delay(1000)
    
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

    
    'Պարտքերի մարում
    fadeDate = "110418"
    perSum = "10000"
    Call Leasing_Fade_Debt(fOBJECT,fadeDate,Null,perSum,"2", acc,DocNumb)
    Log.Message(fOBJECT)
    BuiltIn.Delay(1000)

        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
        sql_Value = -60290.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "'  and fTYPE = 'R8' and fOP = 'DBT' "
        sql_Value = 10000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "'  and fTYPE = 'R2' and fOP = 'DBT' "
        sql_Value = 10000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R8'"
        sql_Value = 53578.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = -6712.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R8'"
        sql_Value = 63578.50
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
   
    'Տոկոսի հաշվարկ
    calcDate = "110418"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)

        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
        sql_Value = -59962.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fBASE = '" & fOBJECT & "'"
        sql_Value = 328.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIT where fBASE = '" & fOBJECT & "'"
        sql_Value = 328.80
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from HIF  where fOBJECT = '" & LeasingSch.fBASE & "'"
        sql_Value = 18
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = -6383.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Կանխավ վճարված տոկոսի հաշվարկ
    dateStart = "120418"
    state = True
    Call Return_Payed_Percent(dateStart, "5000","2",acc,fOBJECT, state)
    Log.Message(fOBJECT)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
        sql_Value = -59962.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from AGRSCHEDULE where fAGRISN  = '" & LeasingSch.fBASE & "'"
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
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = -1383.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R8'"
        sql_Value = 58578.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = -6383.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R8'"
        sql_Value = 53578.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If    
    
        queryString = "select fCURSUM from HIR  where fBASE = '" & fOBJECT & "' and fTYPE = 'R2'"
        sql_Value = 5000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fBASE = '" & fOBJECT & "' and fTYPE = 'R8'"
        sql_Value = 5000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HI  where fBASE = '" & fOBJECT & "' and fDBCR = 'C'"
        sql_Value = 5000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HI  where fBASE = '" & fOBJECT & "' and fDBCR = 'D'"
        sql_Value = 5000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Գումարի մարում տոկոսների հաշվին
    Call Fadeing_LeasingSumma_From_PayedPercents(c_FadeLeasingFromPercent, dateStart,"SUMPAY", "1000")
    BuiltIn.Delay(1000)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
        sql_Value = -59960.80 'poxac
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from AGRSCHEDULE where fAGRISN = '" & LeasingSch.fBASE & "'"
        sql_Value = 3 ''poxvac 2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN = '" & LeasingSch.fBASE & "'"
        sql_Value = 78
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = -383.50
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R8'"
        sql_Value = 59577.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 999000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R8'  and fOP = 'RPR' "
        sql_Value = -1.2
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Տոկոսի հաշվարկ
    calcDate = "120418"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)    
    'Տոկոսի հաշվարկ
    calcDate = "150418"
    Call Calculate_Percent(fOBJECT , calcDate , calcDate)
    Log.Message(fOBJECT)

        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
        sql_Value = -58647.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 930.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 930.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = -55.00
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
        sql_Value = 104
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
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'RÄ'"
        sql_Value = 75923.10
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸' "
        sql_Value = 930.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIT  where fOBJECT = '" & LeasingSch.fBASE & "'"
        sql_Value = 3287.7
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Հաշվարկների ճշգրտում
    dateStart = "160418"
    summperc = "2000"
    Call Correction_Calculation(dateStart, summperc, fOBJECT)
    Log.Message(fOBJECT)

        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
        sql_Value = -58647.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from AGRSCHEDULE where fAGRISN = '" & LeasingSch.fBASE & "'"
        sql_Value = 5
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from AGRSCHEDULEVALUES where fAGRISN = '" & LeasingSch.fBASE & "'"
        sql_Value = 130
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select count(*) from HIF  where fOBJECT = '" & LeasingSch.fBASE & "'"
        sql_Value = 22
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 2930.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸'"
        sql_Value = 2930.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R8'"
        sql_Value = 61577.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
        sql_Value = 930.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R8'"
        sql_Value = 59577.30
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR  where fOBJECT = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸' and fOP = 'RAC'"
        sql_Value = 2000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fSUM from HI  where fBASE = '" & fOBJECT & "' and fDBCR = 'D'"
        sql_Value = 2000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fSUM from HI  where fBASE = '" & fOBJECT & "' and fDBCR = 'C'"
        sql_Value = 2000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Ռիսկայնության նշանակում
    Call FillDoc_Risk_Classifier(dateStart, "02", "10")
    'Պահուստավորում
    Call FillDoc_Store(dateStart,fOBJECT)
    Log.Message(fOBJECT)

        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
        sql_Value = -58647.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R4'"
        sql_Value = 100193
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Դուրս գրում
    Call FillDoc_Write_Out(dateStart, fOBJECT, "3000","500")
   
        queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R5'"
        sql_Value = 3000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R6'"
        sql_Value = 500.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If    
    
        queryString = "select fCURSUM from HIR where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'RB'"
        sql_Value = 59147.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R4'and fOP = 'OUT'  "
        sql_Value = 3500.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Դուրս գրման վերականգնում և մարում
    perSum = "500"
    mainSum = "3000"
    Call FillDoc_RestoreFade(dateStart,mainSum, perSum, fOBJECT)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
        sql_Value = -58647
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R5'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R6'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'RB' and fOP = 'INC'"
        sql_Value = 59147
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    dategive = "160418"
    date_arg = "160418"
    actionExists = True
        
    'Ջնջում է լիզինգի վերականգնում փաստաթուղթը
    actionType = "T2"
    Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
    'Ջնջում է Լիզինգի դուրսգրում (զեղչ./հավ) փաստաթուղթը
    actionType = "b"
    Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
    'Ջնջում է Պահուստավորման փաստաթուղթը
    actionType = "P"
    Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
    'Հաշվարկված տոկոսների ճշգրտում փաստաթղթի ջնջում
    actionType = "5"
    Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
    'Ժամկետանց գումարի մարում փաստաթղթի ջնջում
    actionType = "g"
    Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
    'Ռիսկայնության փաստաթղթր ջնջում
    actionExist = False
    Call Delete_Actions(dategive,date_arg,actionExist,actionType,c_ViewEdit & "|" & c_Risking & "|" & c_RisksPersRes)

    'Տոկոսի հաշվարկ փաստաթղթի ջնջում    
    dategive = "120418"
    date_arg = "120418"
    actionType = "51"
    Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
    'Կանխավ վճարված տոկոսների վերադարձ փաստաթղթի ջնջում
    actionType = "57"
    Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
    'Տոկոսների հաշվարկ փաստաթղթի ջնջում
    actionType = "51"
    Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
    'Մարում Տոկոսի հաշվին փաստաթղթի ջնջում
    actionType = "56"
    Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")    

    'Տոկոսների հաշվարկ փաստաթղթի ջնջում
    dategive = "110418"
    date_arg = "110418"
    actionType = ""
    Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
        
    'Տոկոսների հաշվարկ փաստաթղթի ջնջում    
    dategive = "100418"
    date_arg = "100418"
    actionType = "51"
    Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
    'Մնացած գործողությունների ջնջում
    dategive = "310318"
    date_arg = "160418"
    actionType = Null
    Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
    'Մայր պայմանագրի ջնջում
    Call Delete_Doc()
    Call Close_AsBank()
    
End Sub