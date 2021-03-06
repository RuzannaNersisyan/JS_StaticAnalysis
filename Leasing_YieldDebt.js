  Option Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Financial_Leasing_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Akreditiv_Library 
'USEUNIT Library_Common  
'USEUNIT Mortgage_Library
'USEUNIT Constants

  'Test case Id 166729

Sub Leasing_YieldDebt_Test()

     Dim fDATE,sDATE,DocType,FolderPath,LeasingSch,attr,Date
     Dim fBASE,griddate,summ,isExists,param,cash, acc
     Dim calcDate,fadeDate,dateStart,perSum,summperc,actionExist
     Dim dategive,date_arg,actionExists,actionType,c_OpersView,DocNumb
     Dim queryString,sql_Value,colNum,sql_isEqual,docAcc,docISN, fOBJECT
     Dim mainSum,cap,ext,rep,per,perCalc,close,cls,sumPer,result
     Dim docNum,faddate,faDate,eDate,period,direction,sum

      fDATE = "20250101"
      sDATE = "20140101"
      Date = "310318"   
      griddate = "310319"
      cash = "2"
      acc = "30220042300"
         
      fadeDate = "110418"
      perSum = "10000"
      
      Call Initialize_AsBank("bank", sDATE, fDATE)
      
      Call Create_Connection()

      Dim obj
      obj = Get_Query_Result("select dbo.asf_GetRem('01','582276740','2019-01-01 00:00:00' ) as Acc")
      Log.Message(obj)

      Call ChangeWorkspace(c_FinantialLeasing)
    
      'Գրաֆիկով լիզինգային պայմանագրի ստեղծում
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

      'Պահուստավորում
      dateStart = "160818"
      Call FillDoc_Store(dateStart,fOBJECT)
      Log.Message(fOBJECT)

          'Կատարում ենք SQL ստուգում
          queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
          sql_Value = -26857.9
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R4'"
          sql_Value = 10367.2
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
      'Դուրս գրում
      Call FillDoc_Write_Out(dateStart, fOBJECT, "10000","367.20")
   
          'Կատարում ենք SQL ստուգում
          queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
          sql_Value = 0.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R5'"
          sql_Value = 10000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R6'"
          sql_Value = 367.2
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If    
    
          queryString = "select fCURSUM from HIR where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'RB'"
          sql_Value = 27225.1
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fCURSUM from HIR where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R4'and fOP = 'OUT'  "
          sql_Value = 10367.2
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'RÄ'"
          sql_Value = 384615.50
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If     
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸'"
          sql_Value = 36518.30
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If 
    
          queryString = "select fPENULTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'RÄ'"
          sql_Value = 307692.40
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If 
    
          queryString = "select fPENULTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸'"
          sql_Value = 29917.70
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If 
    
      'Դուրս գրման վերականգնում գործողություն 
      mainSum = "5000"
      sumPer = "0.00"
      Call FillDoc_Write_Back(dateStart, mainSum,sumPer, fOBJECT)
    
          'Կատարում ենք SQL ստուգում
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R4'"
          sql_Value = 5000
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R5'"
          sql_Value = 5000
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
      'Պարտքերի զիջում գործողություն
      summ = "2000"
      Call FillDoc_YieldDebt(dateStart, summ, fOBJECT)
    
          'Կատարում ենք SQL ստուգում
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R5'"
          sql_Value = 3000
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
          sql_Value = 0.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
      'Դուրս գրման վերականգնում և մարում 
      mainSum = "3000"
      perSum = "367.20"
      Call FillDoc_RestoreFade(dateStart,mainSum, perSum, fOBJECT)
    
          'Կատարում ենք SQL ստուգում
          queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
          sql_Value = -26857.9
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
          sql_Value = 27225.1
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If  
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R4'"
          sql_Value = 8367.20
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'RÄ'"
          sql_Value = 379615.50
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸'"
          sql_Value = 36151.10
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
          sql_Value = 36353.40
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R8'"
          sql_Value = 63211.30
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fPENULTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'RÄ'"
          sql_Value = 384615.50
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fPENULTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸'"
          sql_Value = 36518.30
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If

      'Խմբային տոկոսի հաշվարկ
      calcDate = "310319"
      cap = 0
      ext = 1
      rep = 0
      per = 0
      perCalc = 0
      close = 0
      cls = 0
      Call Leasing_Group_Calculate(calcDate,calcDate,cap,ext,rep,per,perCalc,close,cls)

          'Կատարում ենք SQL ստուգում
          queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
          sql_Value = -26857.9
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If    
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'RÄ'"
          sql_Value = 995000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸'"
          sql_Value = 63211.30
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fLASTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R2'"
          sql_Value = 63211.30
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fPENULTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'RÄ'"
          sql_Value = 918077.20
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fPENULTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸'"
          sql_Value = 62806.70
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
      'Պարտքերի մարում
      fadeDate = "010419"
      perSum = "63,211.30"
      Call Leasing_Fade_Debt(fOBJECT,fadeDate,Null,perSum,"2", acc,DocNumb)
      Log.Message(fOBJECT)
      BuiltIn.Delay(1000)

          'Կատարում ենք SQL ստուգում
          queryString = "select dbo.asfb_GetRemHI('01','" & docISN & "','2019-01-01 00:00:00' )"
          sql_Value = -26857.9
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fPENULTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'RÄ'"
          sql_Value = 995000.00
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If
    
          queryString = "select fPENULTREM from HIRREST where fOBJECT  = '" & LeasingSch.fBASE & "' and fTYPE = 'R¸'"
          sql_Value = 63211.30
          colNum = 0
          sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
          If Not sql_isEqual Then
            Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
          End If    

      'Լիզինգի մարում  փաստաթղթի ջնջում    
      dategive = "010419"
      date_arg = "010419"
      actionExists = True
      actionType = "22"
      Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
      'Տոկոսի խմբային հաշվարկ փաստաթղթի ջնջում
      actionType = "51"
      dategive = "310319"
      date_arg = "310319"
      Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
      actionType = ""
      dategive = "310319"
      date_arg = "310319"
      Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
        
      'Տոկոսի Մարում փաստաթղթի ջնջում
      dategive = "160818"
      date_arg = "160818"
      actionType = "53"    
      Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
      'Լիզինգի զիջում փաստաթղթի ջնջում 
      actionType = "25"
      Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")        
    
      'Լիզինգի վերագնահատում փաստաթղթի ջնջում
      dategive = "160818"
      date_arg = "160818"
      actionType = "T2"    
      Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
      'Լիզինգի դուրսգորւմ փաստաթղթի ջնջում
      actionType = "T1"
      Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
      'Պահուստավորում Փաստաթղթի ջնջում
      actionType = "P1"
      Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
      'Տոկոսների հաշվարկ փաստաթղթի ջնջում
      dategive = "150818"
      date_arg = "150818"
      actionType = "51"    
      Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
      dategive = "150818"
      date_arg = "150818"
      actionType = ""    
      Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
      'Մնացած գործողությունների ջնջում
      dategive = "310318"
      date_arg = "160818"
      actionType = Null
      Call Delete_Actions(dategive,date_arg,actionExists,actionType,"Գործողությունների դիտում")
    
      'Մայր պայմանագրի ջնջում
      Call Delete_Doc()
    
      Call Close_AsBank()   
    
End Sub