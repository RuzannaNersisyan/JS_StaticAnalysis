Option Explicit
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Derivative_Tools_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Derivatives_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants

'Test Case Id 166734

Sub Futures_Test()
  
    Dim startDATE,fDATE ,CurrSwap,FolderPath,fBASE,actionExist,contr
    Dim date,revDate,sumRevl,repDate,extention,actionEndDate,CloseDate
    Dim per,part, sPer,Calculate_Date,dateStart, summperc, docType
    Dim repType, time, sold, place,actionDate,actionExists,actionType
    Dim queryString,sql_Value,colNum,sql_isEqual,docAcc,docISN
    startDATE = "20120101"
    fDATE = "20250101"    
    
    'Test StartUp start
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
    Call Create_Connection()
    
    Call ChangeWorkspace(c_Derivatives)
    'Ստեղծել Ածանցյալ գործիք/ Արժույթային գործիկ տեսակի փաստաթուղթ
    Set CurrSwap = New_DerivativeDoc()  
    With CurrSwap
    .Client = "00000014"
    .BuyAcc = "10310070100"
    .RepayAcc = "10330030101"
    .Date = "210617"
    .ForwardExchg = "365" & "[Tab]" & "1"
    .SaleAmount = 1000000
    .Term = "210618"
    .PurAmount = 1500000
    .PaperCode = 123
  
    Call .CreateDerivative("|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ", "üÛáõã»ñë") 
    WMDIClient.VBObject("frmPttel").Close
  
    Log.Message(CurrSwap.fBASE)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fSTATE from DOCS where fISN = '" & CurrSwap.fBASE & "'"
        sql_Value = 1
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Պայմանագիրը ուղարկել հաստատման
    .SendToVerify("|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Վավերացնել պայմանագիրը
    .Verify("|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    BuiltIn.Delay(3000)

    FolderPath = "|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|ä³ÛÙ³Ý³·ñ»ñ"
    .OpenInFolder(FolderPath)
    End with

        'Կատարում ենք SQL ստուգում
        queryString = "select fSTATE from DOCS where fISN = '" & CurrSwap.fBASE & "'"
        sql_Value = 7
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    ' " Վերագնահատում" գործողության կատարում
    revDate = "220617"
    sumRevl = "-143,840.00"
    Call Leasing_ReEvaluation(revDate,sumRevl)
    
         'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1500000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R²'"
        sql_Value = 4109.59
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rì'"
        sql_Value = 143840.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1500000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R²'"
        sql_Value = 4109.59
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rì'"
        sql_Value = -143840.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    '" Ժամկետների վերանայում" գործողության կատարում
    repDate = "011218"
    extention = "1"
    Call ReviewTerms(revDate,repDate,extention)
    
    ' " Մարում" գործողության կատարում
    date = "011218"
    time = "1"
    sold = "1"
    place = "1"
    docType = 1
    Call Repayments(date, repType, time, sold, place,docType,contr )
    wMDIClient.VBObject("frmPttel").Close()
    
        'Կատարում ենք SQL ստուգում
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1500000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If

        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R²'"
        sql_Value = 4109.59
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fCURSUM from HIR where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rì'"
        sql_Value = 143840.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R²'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fLASTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rì'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R1'"
        sql_Value = 1500000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'R²'"
        sql_Value = 4109.59
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
        queryString = "select fPENULTREM from HIRREST where fOBJECT = '" & CurrSwap.fBASE & "' and fTYPE = 'Rì'"
        sql_Value = -143840.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
    
    'Ստուգվում է 19-րդ հաշվետվության մեջ պայմանագրի հայտնվելը ճիշտ տվյալներով 
    Call ChangeWorkspace(c_ChiefAcc)
    Call wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î´ Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|19 ²ñï³ñÅáõÛÃÇ ³éù/í³×³éù")
    Call Rekvizit_Fill("Dialog", 1, "General", "SDATE" ,date)
    Call Rekvizit_Fill("Dialog", 1, "General", "EDATE" ,date)
    Call ClickCmdButton(2,"Î³ï³ñ»É")
    'Ստուգում է որ լինի գոնե 1 տող
    If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 0  then 
       'Ստուգում է Առք-1/Վաճ-2 սյան արժեքը
      If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(1).Text) = Trim(1) Then
            Log.Error("Don't match sold")
      End If 
      'Ստուգում է Գործ. տեսակ սյան արժեքը
      If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(2).Text) = Trim(4) Then
            Log.Error("Don't match type")
      End If
      'Ստուգում է Գործ. վայր սյան արժեքը
      If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(3).Text) = Trim(1) Then
            Log.Error("Don't match place")
      End If
      'Ստուգում է Առքի ծավալ սյան արժեքը
      If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(6).Text) = Trim("1,500,000.00") Then
            Log.Error("Don't match money")
      End If
      'Ստուգում է Առքի միջին փոխարժեք սյան արժեքը
      If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(7).Text) = Trim("364.9999") Then
            Log.Error("Don't match currency")
      End If
      
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").DblClick()
      If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").VBObject("tdbgView").ApproxCount = 0  then 
       'Ստուգում է Առք-1/Վաճ-2 սյան արժեքը
          If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(3).Text) = Trim(1) Then
                Log.Error("Don't match sold")
          End If 
          'Ստուգում է Գործ. տեսակ սյան արժեքը
          If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(4).Text) = Trim(4) Then
                Log.Error("Don't match type")
          End If
          'Ստուգում է Գործ. վայր սյան արժեքը
          If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(5).Text) = Trim(1) Then
                Log.Error("Don't match place")
          End If
          'Ստուգում է Գործ.ոլորտ սյան արժեքը
          If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(7).Text) = Trim(7) Then
                Log.Error("Don't match money")
          End If
          'Ստուգում է Գործ ոլորտ(19) սյան արժեքը
          If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(8).Text) = Trim(1) Then
                Log.Error("Don't match currency")
          End If
          'Ստուգում է Գումար(գնվող) սյան արժեքը
          If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(10).Text) = Trim("1,500,000.00") Then
                Log.Error("Don't match place")
          End If
          'Ստուգում է Գումար (վաճարվող) սյան արժեքը
          If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(11).Text) = Trim("4,109.59") Then
                Log.Error("Don't match money")
          End If
          'Ստուգում է Փոխարժեք սյան արժեքը
          If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(12).Text) = Trim("364.9999") Then
                Log.Error("Don't match currency")
          End If
          'Ստուգում է Իրավ. կարգ սյան արժեքը
          If Not Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(14).Text) = Trim(21) Then
                Log.Error("Don't match currency")
          End If
          wMDIClient.VBObject("frmPttel_2").Close()
      Else 
          Log.Error("There was no line")
      End If
    Else 
      Log.Error("There was no line")
    End If
    wMDIClient.VBObject("frmPttel").Close()
        
    Call ChangeWorkspace(c_Derivatives)
    FolderPath = "|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|ä³ÛÙ³Ý³·ñ»ñ"
    CurrSwap.OpenInFolder(FolderPath)
    
    'Մարման աղբյուր դաշտի խմբային խմբագրում
    Call Rekvizit_Group_Fill(0,0,0,0,0,1,1,0,0,0,0,0)    
    
    'Պայմանագրի փակում
    CloseDate = "010119"
    Call Close_Contract(CloseDate)
    BuiltIn.Delay(2000)
    
    'Ստուգում է փակման ամսաթիվ սյունը
    If Not Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(11).Text) = Trim("01/01/19") Then
          Log.Error("Don't match")
    End If
    'Բացում է պայմանագիրը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen)
    Call ClickCmdButton(5,"²Ûá")
    
    actionDate = "220617"
    actionEndDate = "010119"
    actionExists = True
    actionType = Null
    
    'Ջնջում է Գործողությունների դիտում թղթապանակի բոլոր փաստաթղթերը
    Call Delete_Actions(actionDate,actionEndDate,actionExists,actionType,c_OpersView)

    'Ջնջում է Դիտում և խմբագրում/Ժամկետներ/Պայմ.մարման ժամկետներ թղթապանակի բոլոր փաստաթղթերը
    actionExist = False 
    Call Delete_Actions(revDate,revDate,actionExist,actionType,c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates )

    'Ջնջում է գլխավոր պայմանագիրը
    Call Delete_Doc()
    wMDIClient.VBObject("frmPttel").Close()    

    Call Close_AsBank()
     
End Sub
