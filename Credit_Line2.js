'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Payment_Except_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Contract_Summary_Report_Library
'USEUNIT Library_CheckDB
'USEUNIT Subsystems_SQL_Library
'USEUNIT Credit_Line_Library
'USEUNIT Loan_Agreements_With_Schedule_Linear_Library
'USEUNIT Constants

'Test case ID 165654

Sub Credit_Line_Not_Regenerative_Test()
    
    Dim fDATE, data, startDATE , calcPRBase1, fadeBase, fadeBase1, calcPRBase, queryString, giveCrBase, fBaseCP, fDate1, isExists, docNumber, fISN, actionCount, dateStart, dateEnd
    Dim clientCode, curr, accacc, summ, date_arg, pcPenAgr, fadeDate, finishFadeDate, docN
    Dim passDirection, sumDates, sumFill, pCalcDate, agrIntRate, agrIntRatePart, branch, sector, schedule
    Dim guarante, startFadeDate, district, note, paperCode, fBASE, docExist, isEqual, round, percent, summa
    Dim dategive, dateconcl, newSchedule, date_perm , percSumma , Count, mainSumma, groupOpIsn, fadePeriod
    
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20030101"
    fDATE = "20250101"
    clientCode = "00034851"
    curr = "000"
    accacc = "30220042300"          
    summ = "100,000.00"
    dateconcl = "19/03/13"
    agrIntRate = "19"
    agrIntRatePart = "365"
    part = "1"
    dateGive = "19/03/13"
    finishFadeDate = "19/03/14"
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
    restore = False
    pCalcDate = "18/06/13"
    fDate1 = "19/06/13"
    mainSumma = "5000"
    
    'Test StartUp 
    Call Initialize_AsBank("bank", startDATE, fDATE)
    Call Login("CREDITOPERATOR")
    Call Create_Connection()
    
    '¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ
    Call Select_Credit_Type("ì³ñÏ³ÛÇÝ ·ÇÍ")
    Call Credit_Line_Doc_Fill (clientCode, curr, accacc, summ, restore, AutoCap,dateconcl, agrIntRate, agrIntRatePart, pcPenAgr, _
                               part, dateGive , finishFadeDate , perMonth , passDirection, _
                               sector, UsageField, Aim, schedule, guarante, district, note, paperCode, Time, fBASE, docNumber)
    
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
    Call Collect_From_Provision(dateconcl, summa, "2", accacc, fBaseCP)
    
    'ì³ñÏÇ ïñ³Ù³¹ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    docN = Give_Credit(dateconcl, summ, "2", accacc, giveCrBase)
    
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    calcPRBase = Calculate_Percents(pCalcDate, pCalcDate, False)
    
    '¸ÇïáõÙ ¨ ËÙµ³·ñáõÙ Ù»ÝÛáõÇó ê³ÑÙ³Ý³ã³÷Ç ïáÕ»ñÇ ù³Ý³ÏÇ ïáõ·áõÙ
    Count = 1
    isEqual = Check_Limit_Count(Count)
    If Not isEqual Then
        Log.Error("Wrong count of limits")
    End If
    
    'ê³ÑÙ³Ý³ã³÷ ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(3))<>"100,000.00" Then
        Log.Error("Wrong Limit ")
    End If
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel_2").Close()
    
    'ì³ñÏ³ÛÇÝ ·ÍÇ ¹³¹³ñ»óáõÙ
    data = "19/06/13"
    status = "1"
    Call Credit_Line_Stop_Recovery_DocFill(data, status)

    'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    Call Fade_Debt(fDate1, fadeBase, Null, mainSumma, null, False)
   
'    -----------------------------------------------
'    new îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    pCalcDate = "19/06/13"
    calcPRBase = Calculate_Percents(pCalcDate, pCalcDate, False)
'   -----------------------------------------
    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    pCalcDate = "18/09/13"
    calcPRBase = Calculate_Percents(pCalcDate, pCalcDate, False)
    
    'ì³ñÏ³ÛÇÝ ·ÍÇ í»ñ³Ï³Ý·ÝáõÙ
    data = "19/09/13"
    status = "2"
    Call Credit_Line_Stop_Recovery_DocFill(data, status)
    
    '¸ÇïáõÙ ¨ ËÙµ³·ñáõÙ Ù»ÝÛáõÇó ê³ÑÙ³Ý³ã³÷Ç ïáÕ»ñÇ ù³Ý³ÏÇ ïáõ·áõÙ
    Count = 3
    isEqual = Check_Limit_Count(Count)
    If Not isEqual Then
        Log.Error("Wrong count of limits")
    End If
    With wMDIClient
      'ê³ÑÙ³Ý³ã³÷ ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
      .Refresh
      If Trim(.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(3))<>"100,000.00" Then
          Log.Error("Wrong Limit ")
      End If
      '³ÝóáõÙ  ÙÛáõë ïáÕÇÝ
      .vbObject("frmPttel_2").vbObject("tdbgView").MoveNext
      'ê³ÑÙ³Ý³ã³÷ ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
      If Trim(.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(3))<>"0.00" Then
          Log.Error("Wrong Limit ")
      End If
      '³ÝóáõÙ  ÙÛáõë ïáÕÇÝ
      .vbObject("frmPttel_2").vbObject("tdbgView").MoveNext
      'ê³ÑÙ³Ý³ã³÷ ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
      .Refresh
      If Trim(.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(3))<>"95,000.00" Then
          Log.Error("Wrong Limit ")
      End If
    
      BuiltIn.Delay(1000)
      .vbObject("frmPttel_2").Close()
    End With
    
    
    'ê³ÑÙ³Ý³ã³÷Ç ÷á÷áËáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
    data = "20/09/13"
    Call Change_Limit(data , summ)
    
    '¸ÇïáõÙ ¨ ËÙµ³·ñáõÙ Ù»ÝÛáõÇó ê³ÑÙ³Ý³ã³÷Ç ïáÕ»ñÇ ù³Ý³ÏÇ ïáõ·áõÙ
    Count = 4
    isEqual = Check_Limit_Count(Count)
    If Not isEqual Then
        Log.Error("Wrong count of limits")
    End If
    
    wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").MoveLast
    'ê³ÑÙ³Ý³ã³÷ ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
    If Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(3))<>"100,000.00" Then
        Log.Error("Wrong Limit ")
    End If
    
    Call Online_PaySys_Delete_Agr()
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel_2").Close()
    
    queryString = "Select COUNT(*) From DOCSG Where fISN= '" & fBASE & "'And fGRID='DATES'"
    sql_Value = 4
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from DOCS where fISN= '" & fBASE & "'and fSTATE=7 and fNEXTTRANS=2 "
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.CONTRACTS where fDGISN=  '" & fBASE & "'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIF where fOBJECT='" & fBASE & "'and fDATE='2013-03-19'"
    sql_Value = 16
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIF where fOBJECT= '" & fBASE & "'and fDATE='2013-03-18'"
    sql_Value = 6
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
     
    queryString = "select COUNT(*) from  dbo.HIR where fOBJECT='" & fBASE & "'"
    sql_Value = 10
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
       Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIF where fOBJECT='" & fBASE & "'and fDATE>'2013-03-19'"
    sql_Value = 9
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fSUM), SUM(fCURSUM) from  dbo.HIF where fOBJECT= '" & fBASE & "'and fDATE>'2013-03-19'"
    sql_Value = 95000
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    sql_Value = 0 
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If

    queryString = "select COUNT(*) from  dbo.HIR where fOBJECT='" & fBASE & "'"
    sql_Value = 10
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*)  from  dbo.HIT where fTYPE='N2' and fOP='PER' and fOBJECT= '" & fBASE & "'"
    sql_Value = 3
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.HIR where fOBJECT= '" & fBASE & "'and fOP='PAY'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from dbo.HIF  where fDATE='2013-06-18' and fOBJECT= '" & fBASE & "'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from dbo.HIF  where fDATE='2013-06-19' and fOBJECT= '" & fBASE & "'And fOP='LIM'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from dbo.HIF  where fDATE='2013-06-19' and fOBJECT=  '" & fBASE & "'And fOP='LNB'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from dbo.HIF  where fDATE='2013-06-19' and fOBJECT=  '" & fBASE & "'And fOP='LNG'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from dbo.HIF  where fDATE='2013-09-18' and fOBJECT=  '" & fBASE & "'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from dbo.HIF  where fDATE='2013-09-19' and fOBJECT=  '" & fBASE & "'"
    sql_Value = 3
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select SUM(fSUM), SUM(fCURSUM) from  dbo.HIF where fOBJECT='" & fBASE & "'"
    sql_Value = 195061.4225
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    sql_Value = 1108
    colNum = 1
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from  dbo.CONTRACTS where fDGISN='" & fBASE & "' And fDGSTATE=7"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "Select Sum(XX.fCURSUM) From (Select HI.fADB,HI.fACR,HI.fCURSUM,HI.fDBCR From HIR Join HI On (HIR.fBASE=HI.fBASE And HIR.fTRANS=HI.fTRANS) Where HIR.fOBJECT='" & fBASE & "'Group By HI.fADB,HI.fACR,HI.fCURSUM,HI.fDBCR) As XX"
    sql_Value = 357132.4
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "Select Count(XX.fCURSUM) From (Select HI.fADB,HI.fACR,HI.fCURSUM,HI.fDBCR From HIR Join HI On (HIR.fBASE=HI.fBASE And HIR.fTRANS=HI.fTRANS) Where HIR.fOBJECT='" & fBASE & "'Group BY HI.fADB,HI.fACR,HI.fCURSUM,HI.fDBCR) As XX"
    sql_Value = 21
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
    
    queryString = "select COUNT(*) from HI where fTYPE='01' and fBASE='" & giveCrBase & "' "
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
    End If
'''''''    
'''''''    'Test CleanUp start
'''''''    'ì³ñÏ³ÛÇÝ ·ÍÇ í»ñ³Ï³Ý·ÝáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
'''''''    Call wMainForm.MainMenu.Click(c_AllActions)
'''''''    BuiltIn.Delay(1000)
'''''''    Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" &  c_CrLineBrRec)
'''''''    Sys.Process("Asbank").vbObject("frmAsUstPar").vbObject("TabFrame").vbObject("TDBDate").Keys("[Home]![End][Del]" & "[Tab]")
'''''''    Sys.Process("Asbank").vbObject("frmAsUstPar").vbObject("TabFrame").vbObject("TDBDate_2").Keys("[Home]![End][Del]" & "[Tab]")
'''''''    Sys.Process("Asbank").vbObject("frmAsUstPar").vbObject("TabFrame").vbObject("Checkbox").click()
'''''''    Sys.Process("Asbank").vbObject("frmAsUstPar").vbObject("CmdOK").Click()
'''''''    wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").MoveLast
'''''''    Call wMainForm.MainMenu.Click(c_AllActions)
'''''''    BuiltIn.Delay(1000)
'''''''    Call wMainForm.PopupMenu.Click(c_Delete)
'''''''    BuiltIn.Delay(1000)
'''''''    Sys.Process("Asbank").vbObject("frmDeleteDoc").vbObject("YesButton").Click()
'''''''    BuiltIn.Delay(1000)
'''''''    wMDIClient.vbObject("frmPttel_2").Close()
'''''''    'îáÏáëÝ»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
'''''''    optype = "53"
'''''''    opdate = "19/06/13"
'''''''    group = True
'''''''    fdDoc = False
'''''''    Call DeleteOP(optype, opdate, group, fdDoc)
'''''''    
'''''''    
'''''''    'ì³ñÏ³ÛÇÝ ·ÍÇ ¹³¹³ñ»óáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
'''''''    Call wMainForm.MainMenu.Click(c_AllActions)
'''''''    BuiltIn.Delay(1000)
'''''''    Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" &  c_CrLineBrRec)
'''''''    Sys.Process("Asbank").vbObject("frmAsUstPar").vbObject("TabFrame").vbObject("TDBDate").Keys("[Home]![End][Del]" & "[Tab]")
'''''''    Sys.Process("Asbank").vbObject("frmAsUstPar").vbObject("TabFrame").vbObject("TDBDate_2").Keys("[Home]![End][Del]" & "[Tab]")
'''''''    Sys.Process("Asbank").vbObject("frmAsUstPar").vbObject("TabFrame").vbObject("Checkbox").click()
'''''''    Sys.Process("Asbank").vbObject("frmAsUstPar").vbObject("CmdOK").Click()
'''''''    Call wMainForm.MainMenu.Click(c_AllActions)
'''''''    BuiltIn.Delay(1000)
'''''''    Call wMainForm.PopupMenu.Click(c_Delete)
'''''''    BuiltIn.Delay(1000)
'''''''    '    Sys.Process("Asbank").vbObject("frmAsMsgBox").vbObject("cmdButton").click()
'''''''    BuiltIn.Delay(1000)
'''''''    Sys.Process("Asbank").vbObject("frmDeleteDoc").vbObject("YesButton").Click()
'''''''    wMDIClient.vbObject("frmPttel_2").Close()
'''''''    
'''''''    
'''''''    '¶áñÍáÕáõÃÛáõÝÝ»ñÇ Ñ»é³óáõÙ ¶áñÍáÕáõÃÛáõÝÝ»ñÇ ¹ÇïáõÙÇó
'''''''    actionCount = Delete_Operations_From_OperationsView_Folder(4)
'''''''    If Not actionCount Then
'''''''        Log.Error("Wrong count of actions")
'''''''    End If
'''''''    'ì³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñÇ çÝçáõÙ
'''''''    Call Online_PaySys_Delete_Agr()
    
    'Test CleanUp
    Call Close_AsBank()
End Sub