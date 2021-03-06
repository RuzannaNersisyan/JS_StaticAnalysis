'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Payment_Except_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Contract_Summary_Report_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Constants

'tast case ID 165632

Sub Credit_With_Schedule_WithCash_Test()
    BuiltIn.Delay(20000)
    
    Dim fDATE, data, startDATE , aCon, aCmd1, calcPRBase1, fadeBase, calcPRBase, queryString, giveCrBase, fBaseCP, fDate1, isExists, docNumber, fISN, actionCount, dateStart, dateEnd
    Dim clientCode, tmpltype, curr, accacc, summ, date_arg, dateFillType, fadeDate, finishFadeDate
    Dim passDirection, sumDates, sumFill, pCalcDate, agrIntRate, agrIntRatePart, branch, sector, schedule
    Dim guarante, startFadeDate, district, aim, paperCode, fBASE, note, docExist, isEqual, round, percent
    Dim dategive, dateconcl, newSchedule,confInput,confPath,sum
    
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20030101"
    fDATE = "20250101"
    dateStart = "17/12/12"
    dateEnd = "04/12/14"
    clientCode = "00034851"
    curr = "000"
    accacc = "30220042300"
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
    pCalcDate = "18/12/12"
    fDate1 = "19/12/12"
    newSchedule = True
    confPath = "X:\Testing\CashOutput confirm phases\CashOutput_Allverify.txt" 
    
    'Test StartUp 
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
  'Î³ñ·³íáñáõÙÝ»ñÇ Ý»ñÙáõÍáõÙ
    confInput = Input_Config(confPath)
    If Not confInput Then
        Log.Error("The configuration doesn't input")
    End If
    
    Call Login("CREDITOPERATOR")
    Call Create_Connection()
    
    '¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ
    Call Select_Credit_Type("¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ")
    Call Credit_With_Schedule_Doc_Fill(clientCode, tmpltype, curr, accacc, summ, dateconcl, dategive, date_arg, dateFillType, fadeDate, _
                                       finishFadeDate, startFadeDate, passDirection, sumDates, sumFill, round, agrIntRate, _
                                       agrIntRatePart, pcnotchoose , pcGrant , pcPenAgr, pcPenPer , part, _
                                       branch, sector, aim,schedule, guarante, district, note, paperCode, fBASE, docNumber)
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
    Call Collect_From_Provision(data, sum, "2", accacc, fBaseCP)
    
    'ì³ñÏÇ ïñ³Ù³¹ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    docN = Give_Credit(data, summ, "1", Null, giveCrBase)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close
    
    Call ChangeWorkspace(c_CustomerService)
    'Î³ÝËÇÏ »ÉùÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ ²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ ÃÕÃ³å³Ý³ÏáõÙ
    docExist = Online_PaySys_Check_Doc_In_Workpapers(docN, data, data)
    If Not docExist Then
        Log.Error("The document with number " & docN & " must exist in workpapers" )
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ñ³ëï³ïÙ³Ý
    Call Online_PaySys_Send_To_Verify(2)
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
    Login("VERIFIER")
    docExist = Online_PaySys_Check_Doc_In_Verifier(docN, data, data)
    If Not docExist Then
        Log.Error("The document with number " & docN & " must exist in 1st verify documents")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ 1-ÇÝ  Ñ³ëï³áïÕÇ ÏáÕÙÇó
    Call PaySys_Verify(True)
    
    Call Login("ARMSOFT")
    Call ChangeWorkspace(c_Loans)
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
    docExist = Contracts_Filter_Fill("1", docNumber, "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Log.Error("The document doesn't exist in payments folder ")
        Exit Sub
    End If
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    Call Percent_Group_Calculate(pCalcDate, pCalcDate, False ,false)
    
    'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    Call Fade_Debt(fDate1, fadeBase, Null,null, Null, False)
    
    'ä³ÛÙ³Ý³·ñÇ ¹ÇïáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    isExists = View_Contract()
    If Not isExists Then
        Log.Error("The document view doesn't exist")
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
    sql_Value = 50
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fSUM), SUM(fVALUETYPE)  from .AGRSCHEDULEVALUES where fAGRISN=  '" & fBASE & "'"
    sql_Value = 211708.40
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 75
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIF where fOBJECT= '" & fBASE & "'"
    sql_Value = 29
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fSUM), SUM(fCURSUM) from  dbo.HIF where fOBJECT= '" & fBASE & "'"
    sql_Value = 100063.7551
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 1100
    colNum = 1    
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIR where fOBJECT='" & fBASE & "'"
    Log.Message(fBASE)
    sql_Value = 17
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString =  "select SUM(fLASTREM) from  dbo.HIRREST where fTYPE = 'R1' and fOBJECT= '" & fBASE & "'"
    sql_Value = 92307.70
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString =  "select SUM(fLASTREM) from  dbo.HIRREST where fTYPE = 'R2' and fOBJECT= '" & fBASE & "'"
    sql_Value = 96.20
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString =  "select SUM(fLASTREM) from  dbo.HIRREST where fOBJECT= '" & fBASE & "'"
    sql_Value = 92407.80
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fCURSUM) from  dbo.HIR where fOBJECT= '" & fBASE & "'"
    sql_Value = 126093.8
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIT where fOBJECT= '" & fBASE & "' and fTYPE='N2' and fOP='PER'"
    sql_Value = 3
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from HI where fDATE='2012-12-19' and fBASE='" & fadeBase & "'and fSUM=5.00 and fCURSUM=5.00 and fADB=82335686"
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from HI where fDATE='2012-12-19'  and fBASE='" & fadeBase & "'and fSUM=676.70 and fCURSUM=676.70 and fADB=82335686 "
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from HI where fDATE='2012-12-19' and fBASE='" & fadeBase & "' and fSUM=7692.30 and fCURSUM=7692.30 and fADB=82335686"
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
'    
'    'Test CleanUp start
'    'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
'    optype = "22"
'    opdate = "19/12/12"
'    group = False
'    fdDoc = False
'    Call DeleteOP(optype, opdate, group, fdDoc)
'    
'    'ÊÙµ³ÛÇÝ ïáÏáëÝ»ñÇ Ñ³ßí³ñÏ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
'    optype = "511"
'    opdate = "18/12/12"
'    group = True
'    fdDoc = False
'    Call DeleteOP(optype, opdate, group, fdDoc)
'    
'    Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").Close
'    'Î³ÝËÇÏ »Éù ÷³ëï³ÃÕÃÇ Ñ»é³óáõÙ
'    Call ChangeWorkspace("Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ (ÁÝ¹É³ÛÝí³Í)")
'    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ ÃÕÃ³å³Ý³ÏáõÙ
'    docExist = Online_PaySys_Check_Doc_In_Registered_Payment_Documents(docN, dategive, dategive)
'    If Not docExist Then
'        Log.Error("The document doesn't exist in payments folder ")
'        Exit Sub
'    End If
'    Call Paysys_Delete_Doc(True)
'    Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").Close
'    
'    Call ChangeWorkspace("ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)")
'    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
'    docExist = Contracts_Filter_Fill("1", docNumber)
'    If Not docExist Then
'        Log.Error("The document doesn't exist in payments folder ")
'        Exit Sub
'    End If
'    
'    '¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
'    optype = "G1"
'    opdate = Null
'    group = False
'    fdDoc = False
'    Call DeleteOP(optype, opdate, group, fdDoc)
'    
'    'ì³ñÏÇ ïñ³Ù³¹ñáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ å³ÛÙ³Ý³·ñÇ ÃÕÃ³å³Ý³ÏÇó
'    Call wMainForm.MainMenu.Click("¶áñÍáÕáõÃÛáõÝÝ»ñ|´áÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñÁ . . .")
'    Call wMainForm.PopupMenu.Click("ÂÕÃ³å³Ý³ÏÝ»ñ|ä³ÛÙ³Ý³·ñÇ ÃÕÃ³å³Ý³Ï")
'    Do Until Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel_2").vbObject("tdbgView").EOF
'        If Left(Trim(Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel_2").vbObject("tdbgView").columns.Item(0)), 16) = "ì³ñÏÇ ïñ³Ù³¹ñáõÙ" Then
'            Exit Do
'        Else
'            Call Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel_2").vbObject("tdbgView").MoveNext
'        End If
'    Loop
'    BuiltIn.Delay(delay_middle)
'    Call Online_PaySys_Delete_Agr()
'    Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel_2").Close
'    
'    'ì³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñÇ çÝçáõÙ
'    Call Online_PaySys_Delete_Agr()
'    Call Close_AsBank()
'    'Test CleanUp end
    
End Sub