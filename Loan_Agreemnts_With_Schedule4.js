'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Payment_Except_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Contract_Summary_Report_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Constants

'Test case ID 165062    

Sub Credit_With_Schedule_Actions_Test()
    
    Dim fDATE, data, startDATE , arrFOP, arrVal, percSumma, work, aCon, aCmd1, calcPRBase1, fadeBase, calcPRBase, queryString, giveCrBase, fBaseCP, fDate1, isExists, docNumber, fISN, actionCount, dateStart, dateEnd
    Dim clientCode, tmpltype, curr, accacc, summ, date_arg, dateFillType, fadeDate, finishFadeDate
    Dim passDirection, sumDates, i, sumFill, pCalcDate, agrIntRate, agrIntRatePart, branch, sector, schedule
    Dim guarante, startFadeDate, district, paperCode, fBASE, docExist, isEqual, round, percent
    Dim dategive, dateconcl, calcPRBase2, calcPRBase3, calcPRBase4, rpBase , note, ccalcBase, fBase1
    Dim wrBase, opTp, fBase2 , yldBase, aim, newSchedule,acc,cashORno,sum
    Dim mainSum, perSum,fDocStore
    
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20030101"
    fDATE = "20250101"
    dateStart = "17/12/12"
    dateEnd = "04/12/14"
    clientCode = "00034851"
    curr = Null
    accacc = "03485190101"
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
    sumFill = "04"
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
    percent = "10,291.39"
    pCalcDate = "15/12/12"
    fDate1 = "16/12/12"
    percSumma = "9000"
    opTp = "U4"
    acc = "30220042300"
    cashORno = "2"

    arrFOP = Array("AGJ", "AGR" , "DBT" , "INC" , "LET"  , "NCJ", "OUT", "PAY", "PER", "PRJ","RAC", "RES" , "RET" , "RTP")
    arrVal = Array("100000", "100000", "35056.49", "5248548.65", "255301.8", "10" , "39455412.55", "40100", "18521.85", "8301.39", "50" , "39357020", "5000","6000")
    newSchedule = True
    
    'Test StartUp start
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
    BuiltIn.Delay(2000)
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
    
    ' ¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    Call Collect_From_Provision(data, sum, "2", Null, fBaseCP)
    
    'ì³ñÏÇ ïñ³Ù³¹ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    Call Give_Credit(data, summ, "2", accacc, giveCrBase)
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    calcPRBase1 = Calculate_Percents(pCalcDate, pCalcDate, False)
    
    'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    Call Fade_Debt(fDate1, fadeBase, null,null, percSumma, False)
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    pCalcDate = "16/12/12"
    calcPRBase2 = Calculate_Percents(pCalcDate, pCalcDate, False)
    
    'Î³ÝË³í í×³ñí³Í ïáÏáëÝ»ñÇ í»ñ³¹³ñÓ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    summ = "5000"
    Call Return_Payed_Percents(dateStart, summ, cashORno, acc, rpBase, true)
    
    'Ð³ßí. % ÙÝ³óáñ¹ ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(4)) <> "-3,323.29" Then
        Log.Error("Wrong percent after returning payed percents")
    End If
    
    '¶áõÙ³ñÇ Ù³ñáõÙ ïáÏáëÝ»ñÇ Ñ³ßíÇÝ
    summ = "2000"
    Call Fadeing_CreditSumma_From_PayedPercents(dateStart, summ)
    
    'Ø³ñ³Í ³í»É ïáÏáë³·áõÙ³ñÇ Ñ³ßíÇÝ ·áõÙ³ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛáõÝÇó Ñ»ïá ÙÝ³óáñ¹ ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(3)) <> "98,000.00" Then
        Log.Error("Wrong summa after fadeing credit from payed percents")
    End If
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    pCalcDate = "17/12/12"
    Call Calculate_Percents(pCalcDate, pCalcDate, False)
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    pCalcDate = "14/01/13"
    calcPRBase3 = Calculate_Percents(pCalcDate, pCalcDate, False)
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
    Login("CREDITOPERATOR")
    docExist = Contracts_Filter_Fill("1", docNumber, "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Log.Error("The document doesn't exist in payments folder ")
        Exit Sub
    End If
    
    'Ð³ßí³ñÏÝ»ñÇ ×ß·ñïáõÙ
    dateStart = "15/01/13"
    summperc = "10"
    Call Correction_Calculation(dateStart, summperc, ccalcBase)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ")
    dateStart = "16/01/13"
    Call Contract_Sammary_Report_Fill(dateStart, Null, Null, Null, docNumber, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, False, False, _
                                      Null, False, False, False, _
                                      False, False, False, False, False, _
                                      True, True, False, False, False, False, _
                                      False, False, True, True, False, False, False, 1)
    
    'îáÏáë ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(7)) <> "78.44" Then
        Log.Error("Wrong summa after fadeing credit from payed percents : actual =" & wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(6)& " : Expected = 78.44" )
        Exit Sub
    End If
    
    ' ãû·ï. Ù³ëÇ ïáÏáë ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(9)) <> "10.00" Then
        Log.Error("Wrong summa after fadeing credit from payed percents")
        Exit Sub
    End If
    
    'Å³ÙÏ»ï³Ýó ãû·ï. Ù³ëÇ ïáÏáë ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(10)) <> "0.00" Then
        Log.Error("Wrong summa after fadeing credit from payed percents")
         Exit Sub
    End If
    
    'Å³ÙÏ»ï³Ýó ïáÏáë ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(12)) <> "68.44" Then
        Log.Error("Wrong summa after fadeing credit from payed percents")
         Exit Sub
    End If
    
    '´îÐ¸ ïáÏáë³·áõÙ³ñ ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(15)) <> "65.37" Then
         Log.Error("Wrong summa after fadeing credit from payed percents")
         Exit Sub
    End If
    
    'Ä³ÙÏ»ï³Ýó ·áõÙ³ñÇ ïáõÛÅ ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(17)) <> "10.00" Then
        Log.Error("Wrong summa after fadeing credit from payed percents")
         Exit Sub
    End If
    
    'Ä³ÙÏ»ï³Ýó ïáÏáëÇ ïáõÛÅ ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(18)) <> "10.00" Then
        Log.Error("Wrong summa after fadeing credit from payed percents")
         Exit Sub
    End If
    
    'Ä³ÙÏ»ï³Ýó ·áõÙ³ñÇ ïáÏáë ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(22)) <> "10.00" Then
        Log.Error("Wrong summa after fadeing credit from payed percents")
         Exit Sub
    End If
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
    docExist = Contracts_Filter_Fill("1", docNumber, "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Log.Error("The document doesn't exist in payments folder ")
        Exit Sub
    End If
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    pCalcDate = "15/01/13"
    Call Calculate_Percents(pCalcDate, pCalcDate, False)
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    pCalcDate = "20/01/13"
    calcPRBase4 = Calculate_Percents(pCalcDate, pCalcDate, False)
    
    'èÇëÏ³ÛÝáõÃÛ³Ý Ýß³Ý³ÏáõÙ
    dateStart = "21/01/13"
    risk = "05"
    perc = "100"
    Call FillDoc_Risk_Classifier(dateStart, risk, perc)
    
    'ä³Ñáõëï³íáñáõÙ ÷³ëï³ïÃÕÃÇ Éñ³óáõÙ
    Call FillDoc_Store(dateStart,fDocStore)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ")
    Call Contract_Sammary_Report_Fill(dateStart, Null, Null, Null, docNumber, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, False, False, _
                                      Null, False, False, False, _
                                      False, False, False, False, False, _
                                      False, False, True, False, False, False, _
                                      False, False, False, False, False, True, False, 1)
    
    'ä³Ñáõëï³íáñí³Í ·áõÙ³ñ ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(9)) <> "39,357,020.00" Then
        Log.Error("Wrong summa after fadeing credit from payed percents")
        exit Sub
        
    End If
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
    docExist = Contracts_Filter_Fill("1", docNumber, "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Log.Error("The document doesn't exist in payments folder ")
        Exit Sub
    End If
    
    '¸áõñë ·ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    Call FillDoc_WriteOut(dateStart, wrBase)
    
    '¸áõñë ·ñ³ÍÇ í»ñ³Ï³Ý·ÝáõÙ ¨ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    dateStart = "21/01/13"
    Call FillDoc_RestoreFade(dateStart,mainSum, perSum, fBase1)
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    pCalcDate = "03/12/13"
    Call Percent_Group_Calculate(pCalcDate, pCalcDate, False,false)
    
    'ä³ñïù»ñÇ ½ÇçáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    dateStart = "04/12/13"
    summ = "85,100.60"
    BuiltIn.Delay(2000)
    Call FillDoc_YieldDebt(dateStart, summ, yldBase)
    
    'îáÏáëÝ»ñÇ í»ñ³Ï³Ý·ÝáõÙ ÷³ëï³ÃÕÃÇ ISN- Ç ëï³óáõÙ
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_OpersView)
    BuiltIn.Delay(2000)
    Call Rekvizit_Fill("Dialog", 1, "General", "START", "![End][Del]")
    Call Rekvizit_Fill("Dialog", 1, "General", "END", "![End][Del]")
    Call Rekvizit_Fill("Dialog", 1, "General", "DEALTYPE", opTp)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_View)
    BuiltIn.Delay(1000)
    fBase2 = Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmASDocForm").DocFormCommon.Doc.isn
    Call ClickCmdButton(1, "OK")
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel_2").Close
    
    'ºñÏñáñ¹ í³ñÏÇ Ù³ñáõÙ ÷³ëï³ÃÕÃÇ ISN-Ç ëï³óáõÙ
    dateStart = "21/01/13"
    opTp = "22"
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_OpersView)
    BuiltIn.Delay(1000)
    
    Call Rekvizit_Fill("Dialog", 1, "General", "START", dateStart)
    Call Rekvizit_Fill("Dialog", 1, "General", "END", dateStart)
    Call Rekvizit_Fill("Dialog", 1, "General", "DEALTYPE", opTp)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_View)
    fBase3 = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    Call ClickCmdButton(1, "OK")
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel_2").Close
    
   queryString = "select COUNT(*) from AGRSCHEDULE where fAGRISN=  '" & fBASE & "'"
    sql_Value = 8
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fINC), SUM(fKIND) from AGRSCHEDULE where fAGRISN=  '" & fBASE & "'"
    sql_Value = 36
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
    
    queryString = "select COUNT(*) from AGRSCHEDULEVALUES where fAGRISN='" & fBASE & "'"
    sql_Value = 200
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fSUM), SUM(fVALUETYPE)  from .AGRSCHEDULEVALUES where fAGRISN= '" & fBASE & "'"
    sql_Value = 751971.42
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 300
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIF where fOBJECT='" & fBASE & "'"
    sql_Value = 127
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fSUM), SUM(fCURSUM) from  dbo.HIF where fOBJECT='" & fBASE & "'"
    sql_Value = 100161.7767 '100161.7504
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 1100.00
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIR where fOBJECT= '" & fBASE & "'"
    Log.Message(fBASE)
    sql_Value = 169
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
    sql_Value = 8232.95
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If

    queryString =  "select SUM(fLASTREM) from  dbo.HIRREST where fOBJECT= '" & fBASE & "'"
    sql_Value = 5300188.85
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If

    queryString = "select fOP, SUM(fCURSUM) from  dbo.HIR where fOBJECT='" & fBASE & "' group by fOP  order by fOP"
    colNum = 0
    sql_isEqual = CheckDB_Column_Values_With_String(queryString, arrFOP, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " &  "arrFOP")
    End If
    colNum = 1
    sql_isEqual = CheckDB_Column_Values_With_String(queryString, arrVal, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString& ":  Expected result = " & " arrVal")
    End If
    
    arrFOP(0) = "PER"
    arrFOP(1) = "RAC"
    arrVal(0) = "18521.85"
    arrVal(1) = "20"
    
    queryString = "select fOP,  SUM(fCURSUM) from  dbo.HIT where fOBJECT= '" & fBASE & "'group by fOP  order by fOP"
    colNum = 0
    sql_isEqual = CheckDB_Column_Values_With_String(queryString, arrFOP, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & " arrFOP")
    End If
    
    colNum = 1
    sql_isEqual = CheckDB_Column_Values_With_String(queryString, arrVal, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString& ":  Expected result = " &  arrVal(1) )
    End If
    
    queryString = "select COUNT(*) from HI where fDATE='2012-12-04' and  fBASE='" & giveCrBase & "' and fSUM=40000000.00	and fCURSUM=100000.00 and fACR=403980281 and fOP='MSC' "
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from HI where fDATE='2012-12-04' and  fBASE = '" & giveCrBase & "'and fSUM=40000.00	and fCURSUM=40000.00 and fADB=1629496 and fACR=1629176 and fOP='MSC'"
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from HI where fDATE='2012-12-15' and  fBASE = '" & calcPRBase1 & "' and fSUM=249864.00	and fCURSUM=624.66 and fOP='PRC' "
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = " select COUNT(*) from HI where fDATE='2012-12-16' and  fBASE = '" & fadeBase & "' and fSUM=249864.00	and fCURSUM=624.66 and fOP='PRX' and fADB=82335686 "
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = " select COUNT(*) from HI where fDATE='2012-12-16' and  fBASE = '" & fadeBase & "' and fSUM=3350136.00	and fCURSUM=8375.34 and fOP='PRX' and fADB=82335686 "
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select sum(fSUM),sum(fCURSUM) from HI where fDATE='2012-12-16' and  fBASE='" & fadeBase & "' and fTYPE='CE'	and fOP='SAL'"
    sql_Value = 9000.00
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 3600000.00
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = " select COUNT(*) from HI where fDATE='2012-12-17' and  fBASE='" & rpBase & "' and fTYPE='CE'	and fSUM=2000000.00 and fCURSUM=5000.00 and fOP='PUR'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = " select sum(fSUM),sum(fCURSUM) from HI where fDATE='2012-12-17' and  fBASE='" & rpBase & "'  and fOP='CEX'and fACR=82335686"
    sql_Value = 4000000.00
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 2005000.00
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "  select sum(fSUM),sum(fCURSUM) from HI where fDATE='2013-01-14' and  fBASE='" & calcPRBase3 & "'and fOP='PRC'"
    sql_Value = 2187824.00
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 560494.52
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "  select sum(fSUM),sum(fCURSUM) from HI where fDATE='2013-01-15' and  fBASE='" & ccalcBase & "' and fOP='MSC'"
    sql_Value = 48000.00
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 20070.00
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = " select COUNT(*) from HI where fDATE='2013-01-21' and  fBASE='" & fBase3 & "'and fSUM=5159760.00	and fCURSUM=12899.40 and fOP='MSC'  "
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = " select COUNT(*) from HI where fDATE='2013-01-21' and  fBASE='" & fBase3 & "' and fSUM=27376.00	and fCURSUM=68.44 and fOP='PRX'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = " select COUNT(*) from HI where fDATE='2013-01-21' and  fBASE='" & fBase3 & "' and fOP='PRX' and fADB=82335686 and fCURSUM=27376.00 and fSUM=27376.00"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = " select COUNT(*) from HI where fDATE='2013-01-21' and  fBASE='" & fBase3 & "' and fTYPE='CE'	and fOP='SAL'"
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = " select sum(fSUM),sum(fCURSUM) , count(*) from HI where fDATE='2013-01-21' and  fBASE='" & wrBase & "' and fTYPE='01'"
    sql_Value = 78846040.00
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 39521577.55
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 10
    colNum = 2
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select sum(fSUM),sum(fCURSUM) , count(*) from HI where fDATE='2013-01-21' and  fBASE='" & wrBase & "' and fTYPE='02'"
    sql_Value = 39423020.00
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 98557.55
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 4
    colNum = 2
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select sum(fSUM),sum(fCURSUM) , count(*) from HI where fDATE='2013-01-21' and  fBASE='" & fBase2 & "' and fTYPE='01'"
    sql_Value = 10470920.00
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 5248548.65
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 6
    colNum = 2
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select sum(fSUM),sum(fCURSUM) , count(*) from HI where fDATE='2013-01-21' and  fBASE='" & fBase2 & "' and fTYPE='02'"
    
    sql_Value = 5235460.00
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    sql_Value = 13088.65
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    sql_Value = 3
    colNum = 2
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from HI where fDATE='2013-12-04' and  fBASE='" & yldBase & "'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If    
    
    'ì³ñÏÇ å³ñïù»ñÇ ½ÇçáõÙ ÷³ëï³ÃÕÃÇ Ñ»é³óáõÙ
    optype = "25"
    opdate = Null
    group = False 
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'ÊÙµ³ÛÇÝ ïáÏáëÝ»ñÇ Ñ³ßí³ñÏ ÷³ëï³ÃÕÃÇ Ñ»é³óáõÙ
    optype = "511"
    opdate = "03/12/13"
    group = True
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'ì³ñÏÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    BuiltIn.Delay(5000)
    optype = "22"
    opdate = Null
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'ì³ñÏÇ ¹áõñë·ñáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "T1"
    opdate = Null
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
     optype = "P1"
    opdate = "21/01/13"
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'èÇëÏ³ÛÝáõÃÛ³Ý Ýß³Ý³ÏáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    Call Delete_Risk_Doc()
    
    '²ßË³ïáÕ ã³ßË³ïáÕÇ Ó¨³Ï»ñåÙ³Ý Ñ»é³óáõÙ
'    Call Delete_Work_NotWork_Doc()
   
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "511"
    opdate = "20/01/13"
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
       
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "511"
    opdate = "15/01/13"
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏÇ ×ß·ñïáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "52"
    opdate = Null
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)

    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "511"
    opdate = "14/01/13"
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
        'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "511"
    opdate = "17/12/12"
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    '¶áõÙ³ñÇ Ù³ñáõÙ ïáÏáëÝ»ñÇ Ñ³ßíÇÝ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "55"
    opdate = Null
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'Î³ÝË³í í×³ñí³Í ïáÏáëÝ»ñÇ í»ñ³¹³ñÓ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "56"
    opdate = Null
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'ä³Ñáõëï³íáñáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "P1"
    opdate = Null
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "511"
    opdate = "16/12/12"
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'ØÝ³ó³Í ·áñÍáÕáõÃÛáõÝÝ»ñÇ Ñ»é³óáõÙ
    actionCount = Delete_Operations_From_OperationsView_Folder(7)
    If Not actionCount Then
        Log.Error("Wrong count of actions")
    End If
    
    'ì³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñÇ çÝçáõÙ
    Call Online_PaySys_Delete_Agr()
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close
    
    'Test CleanUp
    Call Close_AsBank()
End Sub