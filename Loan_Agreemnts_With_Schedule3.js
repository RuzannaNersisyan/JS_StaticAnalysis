'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Payment_Except_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Contract_Summary_Report_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Constants

'Test case ID 165634

Sub Credit_With_Schedule_WithMortage_BlackList_Test()
    
    Dim fDATE, data, startDATE , aCon, aCmd1, calcPRBase1, fadeBase, calcPRBase, queryString, giveCrBase, fBaseCP, fDate1, isExists, docNumber, fISN, actionCount, dateStart, dateEnd
    Dim clientCode, tmpltype, curr, accacc, summ, date_arg, dateFillType, fadeDate, finishFadeDate
    Dim passDirection, sumDates, sumFill, pCalcDate, agrIntRate, agrIntRatePart, branch, sector, schedule
    Dim guarante, startFadeDate, district, paperCode, fBASE, docExist, isEqual, round, percent,sum
    Dim dategive, dateconcl, agrType, Count, aim, place, safety, effIntRate, actIntRate, note, newSchedule
    
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20030101"
    fDATE = "20250101"
    dateStart = "17/12/12"
    dateEnd = "04/12/14"
    clientCode = "00000668"
    curr = "000"
    accacc = "33170160500"
    summ = "100,000.00"
    dateconcl = "04/12/12"
    data = "04/12/12"
    dategive = "04/12/12"
    date_arg = "04/12/13"
    dateFillType = "1"
    fadeDate = "15"
    startFadeDate = "04/12/12"
    finishFadeDate = "04/12/13"
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
    percent = "10,038.70"
    pCalcDate = "15/12/12"
    fDate1 = "16/12/12"
    agrType = "9"
    Count = "1"
    place = "2"
    safety = "2"
    effIntRate = "25.0000"
    actIntRate = "30.0000"
    newSchedule = True
    
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
    'Ø³ñÙ³Ý ·ñ³ýÇÏÇ Ýß³Ý³ÏáõÙ
    docExist = Fade_Schedule()
    If Not docExist Then
        Log.Error("Cannot create fade schedule")
        Exit Sub
    End If
    
    'Ø³ñÙ³Ý ·ñ³ýÇÏÇ ·áõÙ³ñ ¨ ïáÏáë ¹³ßï»ñÇ ³ñÅ»ùÝ»ñÇ ëïáõ·áõÙ
    isEqual = Compare_FadeSchedule_Values (summ, percent, newSchedule)
    If Not isEqual Then
        Log.Error("Fading schedule values are wrong")
    End If
    
    '²ÛÉ í×³ñáõÙÝ»ñÇ ·ñ³ýÇÏÇ Ýß³Ý³ÏáõÙ
    docExist = Other_Payment_Schedule(date_arg, "1000")
    If Not docExist Then
        Log.Error("Cannot create payment schedule")
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
    
    Call Login("ARMSOFT")
    Call ChangeWorkspace(c_BLVerifyer)
    
    docExist = Check_Doc_In_BlackList_Verifier(docNumber)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & " must exist in 1st verify documents")
        Exit Sub
    End If
    
    Call PaySys_Verify(True)
    BuiltIn.Delay(2000)
    wMDIClient.vbObject("frmPttel").Close
    
    'ä³ÛÙ³Ý³·ñÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ Ñ³ëï³ïíáÕ ÷³ëïÃÕÃ»ñ 1 ÃÕÃ³å³Ý³ÏáõÙ
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
    
    ' ²ÛÉ ·ñ³íÇ µ³óáõÙ
    Call wMainForm.MainMenu.Click(c_AllActions)
    BuiltIn.Delay(1000)
    Call wMainForm.PopupMenu.Click(c_Safety & "|" & c_AgrOpen & "|" & c_Mortgage)
    Do Until Sys.Process("Asbank").frmModalBrowser.vbObject("tdbgView").EOF
        If RTrim(Sys.Process("Asbank").frmModalBrowser.vbObject("tdbgView").Columns.Item(1).Text) = "²ÛÉ ·ñ³í" Then
            Call Sys.Process("Asbank").frmModalBrowser.vbObject("tdbgView").Keys("[Enter]")
            Exit Do
        Else
            Call Sys.Process("Asbank").frmModalBrowser.vbObject("tdbgView").MoveNext
        End If
    Loop
    
    Call Other_Mortgage_Fill (agrType, curr, summ, Count, dateconcl, dateGive, place, safety, paperCode, docN)
    Call PaySys_Send_To_Verify()
    
    BuiltIn.Delay(2000)
    wMDIClient.vbObject("frmPttel_2").Close
    BuiltIn.Delay(2000)
    wMDIClient.vbObject("frmPttel").Close
    
    '¶ñ³íÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ ³å³Ñáíí³ÍáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñáõÙ
    Call ChangeWorkspace(c_CollateralAgr)
    docExist = Check_Doc_In_SafetyDocs_Verify_Folder(docN)
    If Not docExist Then
        Log.Error("The document with number " & docN & " doesn't exist in payments folder ")
        Exit Sub
    End If
    
    Call PaySys_Verify(True)
    BuiltIn.Delay(2000)
    wMDIClient.vbObject("frmPttel").Close
    
    '¶ñ³íÇ ÷³ÏáõÙ
    Call Close_Mortage(docN)
    
    '¶ñ³íÇ çÝçáõÙ
    Call Paysys_Delete_Doc(False)
    
    BuiltIn.Delay(2000)
    wMDIClient.vbObject("frmPttel").Close
    
    Call ChangeWorkspace(c_Loans)
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
    docExist = Contracts_Filter_Fill("1", docNumber, "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Log.Error("The document doesn't exist in payments folder ")
        Exit Sub
    End If
    
    ' ¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    Call Collect_From_Provision(data, sum, "2", accacc, fBaseCP)
    
    'ì³ñÏÇ ïñ³Ù³¹ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    docN = Give_Credit(data, summ, "2", Null, giveCrBase)
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    Call Percent_Group_Calculate(pCalcDate, pCalcDate, False,false)
    Call Effective_InterestRate_DocFill (fDate1, effIntRate, actIntRate)
    
    'Î³ï³ñí³Í ÷á÷áËáõÃÛáõÝÝ»ñÇ ëïáõ·áõÙ "¸ÇïáõÙ ¨ ËÙµ³·ñáõÙ" Ù»ÝÛáõÇó
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" & c_Percentages & "|" & c_EffRate)
    BuiltIn.Delay(1000)
    Call Rekvizit_Fill("Dialog", 1, "General", "START", fDate1)
    Call Rekvizit_Fill("Dialog", 1, "General", "End", fDate1)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    ' ²ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛù ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If (Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(3).Text)) <> effIntRate Then
        Log.Error("Wrong interest rate ")
        Exit Sub
    End If
    
    'ö³ëï³óÇ ïáïë³¹ñáõÛù ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If (Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(4).Text)) <> actIntRate Then
        Log.Error("Wrong interest rate ")
        Exit Sub
    End If
    
    BuiltIn.Delay(2000)
    wMDIClient.vbObject("frmPttel_2").Close
    BuiltIn.Delay(2000)
    wMDIClient.vbObject("frmPttel").Close
    
    'Î³ï³ñí³Í ÷á÷áËáõÃÛáõÝÝ»ñÇ ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ" ÃÕÃ³å³Ý³ÏáõÙ
    Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ")
    Call Contract_Sammary_Report_Fill(fDate1, Null, Null, Null, docNumber, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, False, False, _
                                      Null, False, False, False, _
                                      False, False, True, False, False, _
                                       False, False, False, False, False, False, _
                                      False, False, False, False, False, False, False, 1)
    
    ' ²ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛù ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If (Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(9).Text)) <> effIntRate Then
        Log.Error("Wrong interest rate ")
        Exit Sub
    End If
    'ö³ëï³óÇ ïáïë³¹ñáõÛù ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If (Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(10).Text)) <> actIntRate Then
        Log.Error("Wrong interest rate ")
        Exit Sub
    End If
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
    docExist = Contracts_Filter_Fill("1", docNumber, "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Log.Error("The document doesn't exist in payments folder ")
        Exit Sub
    End If
    
    '´³ÝÏÇ ³ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛùÇ ÷á÷áËáõÙ
    Call BankEffective_InterestRate_DocFill (dateStart, "^A[Del]" & actIntRate)
    
    'Î³ï³ñí³Í ÷á÷áËáõÃÛáõÝÝ»ñÇ ëïáõ·áõÙ "¸ÇïáõÙ ¨ ËÙµ³·ñáõÙ" Ù»ÝÛáõÇó
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" & c_Percentages & "|" & c_BankEffRate)
    BuiltIn.Delay(1000)
    Call Rekvizit_Fill("Dialog", 1, "General", "START", dateStart)
    Call Rekvizit_Fill("Dialog", 1, "General", "END", dateStart)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    ' ´³ÝÏÇ ³ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛù ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If (Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(3).Text)) <> Left(actIntRate, 2) Then
        Log.Error("Wrong interest rate ")
        Exit Sub
    End If
    
    BuiltIn.Delay(2000)
    wMDIClient.vbObject("frmPttel_2").Close
    BuiltIn.Delay(2000)
    wMDIClient.vbObject("frmPttel").Close
    
    'Î³ï³ñí³Í ÷á÷áËáõÃÛáõÝÝ»ñÇ ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ" ÃÕÃ³å³Ý³ÏáõÙ
    Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ")
    Call Contract_Sammary_Report_Fill(dateStart, Null, Null, Null, docNumber, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, False, False, _
                                      Null, False, False, False, _
                                      False, False, False, False, False, _
                                      False, False, True, False, False, False, _
                                      False, False, False, False, False, False, False, 1)
    
    '´³ÝÏÇ ³ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛù ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If (Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(12).Text)) <> Left(actIntRate, 2) Then
        Log.Error("Wrong interest rate ")
        Exit Sub
    End If
    
    'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    Call Fade_Debt(fDate1, fadeBase, date_arg, Null,null,False)
    
    'ä³ÛÙ³Ý³·ñÇ ¹ÇïáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    isExists = View_Contract()
    If Not isExists Then
        Log.Error("The document view doesn't exist")
    End If
    
    queryString = "select COUNT(*) from  dbo.CONTRACTS where fDGISN= '" & fBASE & "'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from AGRSCHEDULE where fAGRISN= '" & fBASE & "'"
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fINC), SUM(fKIND) from AGRSCHEDULE  where fAGRISN= '" & fBASE & "'"
    sql_Value = 3
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 11
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from .AGRSCHEDULEVALUES  where fAGRISN= '" & fBASE & "'"
    sql_Value = 28
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fSUM), SUM(fVALUETYPE)  from .AGRSCHEDULEVALUES where fAGRISN=  '" & fBASE & "'"
    sql_Value = 110038.70
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 42
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIF where fOBJECT= '" & fBASE & "'"
    sql_Value = 24
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fSUM), SUM(fCURSUM) from  dbo.HIF where fOBJECT= '" & fBASE & "'"
    sql_Value = 100118.7551
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 1830.00
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIR where fOBJECT='" & fBASE & "'"
    Log.Message(fBASE)
    sql_Value = 8     
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString =  "select SUM(fLASTREM) from  dbo.HIRREST where fTYPE = 'R1' and fOBJECT= '" & fBASE & "'"
    sql_Value = 0.00
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If

    queryString =  "select SUM(fLASTREM) from  dbo.HIRREST where fTYPE = 'R2' and fOBJECT= '" & fBASE & "'"
    sql_Value = 0.00
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString =  "select SUM(fLASTREM) from  dbo.HIRREST where fOBJECT= '" & fBASE & "'"
    sql_Value = 100.00
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fCURSUM) from  dbo.HIR where fOBJECT= '" & fBASE & "'"
    sql_Value = 201549.20
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIT where fOBJECT= '" & fBASE & "' and fTYPE='N2' and fOP='PER'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from HI where fDATE='2012-12-16' and fBASE='" & fadeBase & "'and fSUM=624.60 and fCURSUM=624.60 and fADB=539747719"
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from HI where fDATE='2012-12-16'  and fBASE='" & fadeBase & "'and fSUM=96.60 and fCURSUM=96.60 "
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from HI where fDATE='2012-12-16' and fBASE='" & fadeBase & "'and fSUM=100000.00 and fCURSUM=100000.00 and fADB=539747719"
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "22"
    opdate = "16/12/12"
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'ËÙµ³ÛÇÝ ïáÏáëÝ»ñÇ Ñ³ßí³ñÏ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "511"
    opdate = "15/12/12"
    group = True
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'ØÝ³ó³Í ·áñÍáÕáõÃÛáõÝÝ»ñÇ Ñ»é³óáõÙ
    actionCount = Delete_Operations_From_OperationsView_Folder(3)
    If Not actionCount Then
        Log.Error("Wrong count of actions")
    End If
    
    '²ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛù ÷³ëï³ÃÕÃÇ Ñ»é³óáõÙ
    Call Delete_Effective_IntRate()
    
    '´³ÝÏÇ ³ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛù ÷³ëï³ÃÕÃÇ Ñ»é³óáõÙ
    Call Delete_Bank_Effective_IntRate()
    
    'ì³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñÇ çÝçáõÙ
    Call Online_PaySys_Delete_Agr()
    
    BuiltIn.Delay(2000)
    wMDIClient.vbObject("frmPttel").Close
    
    ' Test CleanUp 
    Call Close_AsBank()    
End Sub