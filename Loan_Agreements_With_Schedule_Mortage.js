'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Payment_Except_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Contract_Summary_Report_Library
'USEUNIT Library_CheckDB
'USEUNIT Subsystems_SQL_Library
'USEUNIT Constants

'Test case ID 165647

Sub Loan_Agreements_With_Schedule_Mortage_Test()
    
    Dim fDATE, data, startDATE , calcPRBase1, fadeBase, calcPRBase, queryString, giveCrBase, fBaseCP, fDate1, isExists, docNumber, fISN, actionCount, dateStart, dateEnd
    Dim clientCode, tmpltype, curr, accacc, summ, date_arg, dateFillType, fadeDate, finishFadeDate
    Dim passDirection, sumDates, sumFill, pCalcDate, agrIntRate, agrIntRatePart, branch, sector, schedule
    Dim guarante, startFadeDate, district, note, paperCode, fBASE, docExist, isEqual, round, percent
    Dim dategive, dateconcl, wTabStrip, aim, wTabFrame_10, mortCurr, code, mortsumm, mortCount
    
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20030101"
    fDATE = "20250101"
    dateStart = "17/12/12"
    dateEnd = "04/12/14"
    clientCode = "00034851"
    curr = "000"
    accacc = "30220042300"
    summ = "100,000.00"
    dateconcl = "27/03/13"
    data = "04/12/12"
    dategive = "27/03/13"
    date_arg = "27/03/14"
    dateFillType = "1"
    fadeDate = "15"
    startFadeDate = "27/03/13"
    finishFadeDate = "27/03/14"
    passDirection = "2"
    sumDates = "1"
    sumFill = "01"
    round = "2"
    agrIntRate = "19"
    agrIntRatePart = "365"
    branch = "9"
    sector = "U2"
    aim = "00"
    schedule = "9"
    guarante = "9"
    district = "001"
    paperCode = "12"
    mortCurr = "000"
    code = "00001"
    mortsumm = "10000"
    mortCount = "1"
    
    'Test StartUp 
    Call Initialize_AsBank("bank", startDATE, fDATE)
    Call Login("CREDITOPERATOR")
    Call Create_Connection()
    
    '¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ
    Call Select_Credit_Type("¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ")
    Call Credit_With_Schedule_Doc_Fill(clientCode, tmpltype, curr, accacc, summ, dateconcl, dategive, date_arg, dateFillType, fadeDate, _
                                       finishFadeDate, startFadeDate, passDirection, sumDates, sumFill, round, agrIntRate, _
                                       agrIntRatePart, pcnotchoose , pcGrant , pcPenAgr, pcPenPer , part, _
                                       branch, sector, aim, schedule, guarante, district, note, paperCode, fBASE, docNumber)
    BuiltIn.Delay(3000)
    '¶ñ³í ¿çÇ Éñ³óÙ³Ý ëÏÇ½µ
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToEdit)
    
    If wMDIClient.WaitvbObject("frmASDocForm", 3000).Exists Then
      'Îá¹ ¹³ßïÇ Éñ³óáõÙ   
      Call Rekvizit_Fill("Document", 11, "General", "CODESTND", code)           
      '²ñÅáõÛÃ ¹³ßïÇ Éñ³óáõÙ
      Call Rekvizit_Fill("Document", 11, "General", "MORTCURR", mortCurr)  
      '¶ñ³íÇ ³ñÅ»ùÁ ¹³ßïÇ Éñ³óáõÙ
      Call Rekvizit_Fill("Document", 11, "General", "MSUMMA", mortsumm)  
      'ø³Ý³Ï ¹³ßïÇ Éñ³óáõÙ
      Call Rekvizit_Fill("Document", 11, "General", "MCOUNT", mortCount)  
      'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
      Call ClickCmdButton(1, "Î³ï³ñ»É")
    Else
      Log.Error("Can't open frmASDocForm window")
    End If
    
    'Ø³ñÙ³Ý ·ñ³ýÇÏÇ Ýß³Ý³ÏáõÙ
    docExist = Fade_Schedule()
    If Not docExist Then
        Log.Error("Cannot create fade schedule")
        Exit Sub
    End If
    
    'ä³ÛÙ³Ý³·ñÇ ÷ÝïñáõÙ å³ÛÙ³Ý³·ñÇ ÃÕÃ³å³Ý³Ï³áõÙ
    wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveFirst
    Do Until wMDIClient.vbObject("frmPttel").vbObject("tdbgView").EOF
        If Left(Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Text), 28) = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ" Then
            Exit Do
        Else
            Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
        End If
    Loop
    
    'ä³ÛÙ³Ý³·ñÇ áõÕ³ñÏáõÙ Ñ³ëï³ïÙ³Ý
    Call PaySys_Send_To_Verify()
    
    'ä³ÛÙ³Ý³·ñÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ Ñ³ëï³ïíáÕ ÷³ëïÃÕÃ»ñ 1 ÃÕÃ³å³Ý³ÏáõÙ
    Call Login("ARMSOFT")
    Call ChangeWorkspace(c_Loans)
    docExist = Verify_Credit(docNumber)
    If Not docExist Then
        Log.Error("The document doesn't exist in verifier folder")
    End If
    
    'ö³ëï³ÃÕÃÇ Ñ³ëï³ïáõÙ
    Call PaySys_Verify(True)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
    docExist = Contracts_Filter_Fill("1", docNumber, "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Log.Error("The document doesn't exist in payments folder ")
        Exit Sub
    End If
    
    '¶ñ³íÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ ä³ÛÙ³Ý³·ñÇ ÃÕÃ³å³Ý³ÏáõÙ
    docExist = False
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
    Do Until wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").EOF
        If Left(Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").columns.Item(0)), 26) = "¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í" Then
            docExist = True
            Exit Do
        Else
            Call wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").MoveNext
        End If
    Loop
    
    If docExist Then
        BuiltIn.Delay(3000)
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_View)
        Str = GetVBObject ("CODE", wMDIClient.vbObject("frmASDocForm"))
        docN = wMDIClient.vbObject("frmASDocForm").vbObject("TabFrame").vbObject(Str).Text
        fBASE = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn 
        Call ClickCmdButton(1, "OK")
    Else
        Log.Error("The mortage doesn't exist")
        Exit Sub
    End If
    
    queryString = "select COUNT(*) from DOCS where fSTATE=7 and fISN='" & fBASE & "'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.CONTRACTS where fDGISN='" & fBASE & "'And fDGSTATE=7"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*)  from  dbo.CONTRACTS where fDGISN='" & fBASE & "'And fDGMCODESSM2='1' And fDGMCODESS='" & docNumber & "'And fDGCUR='000' And fDGSUMMA=10000 And fDGALLSUMMA=1"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIR where fOBJECT= '" & fBASE & "'"
    sql_Value = 3
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fCURSUM) from  dbo.HIR where fOBJECT='" & fBASE & "'"
    sql_Value = 20001
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIRREST where fOBJECT= '" & fBASE & "'"
    sql_Value = 3
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fLASTREM) from  dbo.HIRREST where fOBJECT='" & fBASE & "'"
    sql_Value = 20001
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    'ºïÑ³ßí»Ïßé³ÛÇÝ Ó¨³Ï»ñåÙ³Ý Ñ»é³óáõÙ
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click("Հաշվապահական ձևակերպումներ|Ետհաշվեկշռային")
    If p1.WaitVBObject("frmAsUstPar", 3000).Exists Then
      Call Rekvizit_Fill("Dialog", 1, "General", "START", "![End]" & "[Del]")
      Call Rekvizit_Fill("Dialog", 1, "General", "END", "![End]" & "[Del]")
      Call ClickCmdButton(2, "Î³ï³ñ»É")
    Else 
      Log.Error "Can't find frmAsUstPar window", "", pmNormal, ErrorColor
    End If
    
    Call Online_PaySys_Delete_Agr()
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel_3").Close
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel_2").Close
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close
    
    '¶ñ³íÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ ³å³Ñáíí³ÍáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñáõÙ
    Call ChangeWorkspace(c_CollateralAgr)

    '¶ñ³íÇ ÷³ÏáõÙ
    Call Close_Mortage(docN)
    
    '¶ñ³íÇ çÝçáõÙ
    Call Paysys_Delete_Doc(False)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close
    
    Call ChangeWorkspace(c_Loans)
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
    docExist = Contracts_Filter_Fill("1", docNumber, "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Log.Error("The document doesn't exist in payments folder ")
        Exit Sub
    End If
    
    'ì³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñÇ çÝçáõÙ
    Call Online_PaySys_Delete_Agr()
    
    'Test CleanUp
    Call Close_AsBank()
End Sub