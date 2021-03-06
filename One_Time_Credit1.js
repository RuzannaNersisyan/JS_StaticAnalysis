'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Payment_Except_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Contract_Summary_Report_Library
'USEUNIT Library_CheckDB
'USEUNIT Subsystems_SQL_Library
'USEUNIT One_Time_Credit_Library
'USEUNIT Constants

'Test case ID 165652

Sub One_Time_Credit_With_Constant_Percent_Test()
    
    Dim fDATE, data, startDATE , calcPRBase1, fadeBase,fadeBase1, calcPRBase, queryString, giveCrBase, fBaseCP, fDate1, isExists, docNumber, fISN, actionCount, dateStart, dateEnd
    Dim clientCode, tmpltype, curr, accacc, summ, date_arg, pcPenAgr, fadeDate, finishFadeDate, docN
    Dim passDirection, sumDates, sumFill, pCalcDate, agrIntRate, agrIntRatePart, branch, sector, schedule
    Dim guarante, startFadeDate, district, note, paperCode, fBASE, docExist, isEqual, round, percent, sum
    Dim dategive, dateconcl, newSchedule, date_perm , percSumma , Count, mainSumma, groupOpIsn, fadePeriod,confInput
    
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20030101"
    fDATE = "20250101"
    clientCode = "00034851"
    curr = "000"
    accacc = "30220042300"
    summ = "100,000.00"
    dateconcl = "11/03/13"
    agrIntRate = "19"
    agrIntRatePart = "365"
    part = "1"
    dateGive = "11/03/13"
    finishFadeDate = "11/03/14"
    constPer = True
    perMonth = "3"
    passDirection = "2"
    branch = "9"
    sector = "U2"
    Aim = "00"
    schedule = "9"
    guarante = "9"
    district = "001"
    paperCode = "12"
    pcPenAgr = "0.5"
    pCalcDate = "10/06/13"
    fDate1 = "11/06/13"
    mainSumma = "1000"
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
    Call Select_Credit_Type("ØÇ³Ý·³ÙÛ³ í³ñÏ")
    Call One_Time_Credit_Doc_Fill (clientCode, tmpl_type, curr, accacc, summ, dateconcl, agrIntRate, agrIntRatePart, pcPenAgr, _
                                   part, dateGive , finishFadeDate , constPer, perMonth , passDirection, _
                                   branch, sector, Aim, schedule, guarante, district, note, paperCode, fBASE, docNumber)
    
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
    
    '¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    Call Collect_From_Provision(dateconcl, sum, "2", accacc, fBaseCP)
    
    'ì³ñÏÇ ïñ³Ù³¹ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    docN = Give_Credit(dateconcl, summ, "1", Null, giveCrBase)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close
    
    Call ChangeWorkspace(c_CustomerService)
    'Î³ÝËÇÏ »ÉùÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ ²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ ÃÕÃ³å³Ý³ÏáõÙ
    docExist = Online_PaySys_Check_Doc_In_Workpapers(docN, dateconcl, dateconcl)
    If Not docExist Then
        Log.Error("The document with number " & docN & " must exist in workpapers" )
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ñ³ëï³ïÙ³Ý
    Call Online_PaySys_Send_To_Verify(2)
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
    Login("VERIFIER")
    docExist = Online_PaySys_Check_Doc_In_Verifier(docN, dateconcl, dateconcl)
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
    calcPRBase = Calculate_Percents(pCalcDate, pCalcDate, False)
    
    'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    Call Fade_Debt(fDate1, fadeBase, null,mainSumma,  Null, False)
    
    
    wMDIClient.vbObject("frmPttel").Close()
    
    dateStart = "10/06/13"
    Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ")
    Call Contract_Sammary_Report_Fill(dateStart, Null, Null, Null, docNumber, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, False, False, _
                                      Null, False, False, False, _
                                      False, False, False, False, False, _
                                      True, True, False, False, False, False, _
                                      False, False, True, True, False, False, False,1)
                                      
    'îáÏáë ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(7)) <> "4,789.00" Then
        Log.Error("Wrong percent " & Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").Columns.Item(7))
    End If
 '--------------------------------------------------------------   
    ' NEW îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³ÝÇó Ñ»ïá 
      pCalcDate = "11/06/13"
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    calcPRBase = Calculate_Percents(pCalcDate, pCalcDate, False)
 '-------------------------------------------------------------- 
    pCalcDate = "09/09/13"
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    calcPRBase = Calculate_Percents(pCalcDate, pCalcDate, False)
    
    fDate1 = "10/09/13"
    percSumma = "1000"
    'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    Call Fade_Debt(fDate1, fadeBase1, Null, percSumma, Null, False)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    dateStart = "09/09/13"
    Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ")
    Call Contract_Sammary_Report_Fill(dateStart, Null, Null, Null, docNumber, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, False, False, _
                                      Null, False, False, False, _
                                      False, False, False, False, False, _
                                      True, True, False, False, False, False, _
                                      False, False, True, True, False, False, False,1)
                                      
    'îáÏáë ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(7)) <> "4,736.90" Then
        Log.Error("Wrong percent" & Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").Columns.Item(7))
    End If
    
    'ä³ÛÙ³Ý³·ñÇ ¹ÇïáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    isExists = View_Contract()
    If Not isExists Then
        Log.Error("The document view doesn't exist")
    End If
    
    queryString = "select COUNT(*) from DOCS where fSTATE=7 and fNEXTTRANS=2  and fISN= '" & fBASE & "'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "Select COUNT(*) From DOCSG Where fISN= '" & fBASE & "'And fGRID='DATES'"
    sql_Value = 8
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from dbo.HIF  where fDATE='2013-03-10' and fOBJECT='" & fBASE & "'"
    sql_Value = 5
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from dbo.HIF  where fDATE='2013-03-11' and fOBJECT= '" & fBASE & "'And fOP<>'DTP'"
    sql_Value = 13
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from dbo.HIF  where fDATE='2013-03-11' and fOBJECT= '" & fBASE & "' And fOP='DTP'"
    sql_Value = 4
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from dbo.HIF  where fDATE='2013-06-10' and fOBJECT= '" & fBASE & "'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from dbo.HIF  where fDATE='2013-09-09' and fOBJECT='" & fBASE & "'"
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
    
    queryString = "select COUNT(*) from  dbo.HIR where fOBJECT='" & fBASE & "'"
    sql_Value = 14
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fCURSUM) from  dbo.HIR where fOBJECT='" & fBASE & "'"
    sql_Value = 126230.2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIT where fTYPE='N2' and fOP='PER' and fOBJECT='" & fBASE & "'"
    sql_Value = 3
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select Sum(fCURSUM) from  dbo.HIT where fTYPE='N2' and fOP='PER' and fOBJECT= '" & fBASE & "'"
    sql_Value = 9525.9
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIT where fOBJECT='" & fBASE & "'"
    sql_Value = 6
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fSUM), SUM(fCURSUM) from  dbo.HIF where fOBJECT='" & fBASE & "'"
    sql_Value = 100061.4225
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    sql_Value = 20107.9
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select Sum(fCURSUM) from  dbo.HIT where fOBJECT='" & fBASE & "'"
    sql_Value = 9663.2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "Select Sum(XX.fCURSUM) From (Select HI.fADB,HI.fACR,HI.fCURSUM,HI.fDBCR From HIR Join HI On (HIR.fBASE=HI.fBASE And HIR.fTRANS=HI.fTRANS) Where HIR.fOBJECT='" & fBASE & "'Group By HI.fADB,HI.fACR,HI.fCURSUM,HI.fDBCR) As XX"
    sql_Value = 50556.2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "Select Count(XX.fCURSUM) From (Select HI.fADB,HI.fACR,HI.fCURSUM,HI.fDBCR From HIR Join HI On (HIR.fBASE=HI.fBASE And HIR.fTRANS=HI.fTRANS) Where HIR.fOBJECT='" & fBASE & "'Group By HI.fADB,HI.fACR,HI.fCURSUM,HI.fDBCR) As XX"
    sql_Value = 22
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from HI where fDATE='2013-06-11' and fSUM=4789.00 and  fBASE='" & fadeBase & "'"
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from HI where fDATE='2013-09-10' and fSUM=1000.00 and  fBASE='" & fadeBase1 & "'"
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from HI where fTYPE='01' and fBASE='" & giveCrBase & "' "
    sql_Value = 4
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "22"
    opdate = "10/09/13"
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏ(2-ñ¹) ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "511"
    opdate = "09/09/13"
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
     'îáÏáëÝ»ñÇ Ñ³ßí³ñÏ(2-ñ¹) ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "511"
    opdate = "11/06/13"
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ        
    optype = "53"
    opdate = "11/06/13"
    group = False                        
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏ(1-ÇÝ) ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
    optype = "511"
    opdate = "10/06/13"
    group = False
    fdDoc = False
    Call DeleteOP(optype, opdate, group, fdDoc)
    
'    Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").Close
''    Î³ÝËÇÏ »Éù ÷³ëï³ÃÕÃÇ Ñ»é³óáõÙ
'    Call ChangeWorkspace("Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ (ÁÝ¹É³ÛÝí³Í)")
''    ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ ÃÕÃ³å³Ý³ÏáõÙ
'    docExist = Online_PaySys_Check_Doc_In_Registered_Payment_Documents(docN, dateconcl, dateconcl)
'    If Not docExist Then
'        Log.Error("The document with number " & docN & " doesn't exist in payments folder ")
'        Exit Sub
'    End If
'    Call Paysys_Delete_Doc(True)
'    Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").Close
'    
'    Call ChangeWorkspace("ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)")
''    ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
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
''    ì³ñÏÇ ïñ³Ù³¹ñáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ å³ÛÙ³Ý³·ñÇ ÃÕÃ³å³Ý³ÏÇó
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
''    ì³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñÇ çÝçáõÙ
'    Call Online_PaySys_Delete_Agr()
    
    'Test CleanUp
    Call Close_AsBank()
End Sub