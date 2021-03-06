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
Option Explicit

'tast case N  165061

Sub Credit_With_Schedule_WithoutCash_Test()
  BuiltIn.Delay(20000)
  
  Dim fDATE, data, startDATE , calcPRBase1, fadeBase, calcPRBase, queryString, giveCrBase, fBaseCP, fDate1, isExists, docNumber, fISN, actionCount, dateStart, dateEnd
  Dim clientCode, tmpltype, curr, accacc, summ, date_arg, dateFillType, fadeDate, finishFadeDate, sql_Value, colNum, fdDoc
  Dim passDirection, sumDates, sumFill, pCalcDate, agrIntRate, agrIntRatePart, branch, sector, schedule, sql_isEqual
  Dim guarante, startFadeDate, district,aim, note, paperCode, fBASE, docExist, isEqual, round, percent, optype, opdate
  Dim dategive, dateconcl, newSchedule, confPath, sum, confInput, pcnotchoose, pcGrant, pcPenAgr, part, pcPenPer, group
    
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
  pCalcDate = "16/12/12"
  fDate1 = "15/01/13"
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
                                   branch, sector, aim, schedule, guarante, district, note, paperCode, fBASE, docNumber)
    
  'Ø³ñÙ³Ý ·ñ³ýÇÏÇ Ýß³Ý³ÏáõÙ
  docExist = Fade_Schedule()
  If Not docExist Then
    Log.Error("Can't create fade schedule")
    Exit Sub
  End If
    
  'Ø³ñÙ³Ý ·ñ³ýÇÏÇ ·áõÙ³ñ ¨ ïáÏáë ¹³ßï»ñÇ ³ñÅ»ùÝ»ñÇ ëïáõ·áõÙ
  isEqual = Compare_FadeSchedule_Values(summ, percent, newSchedule)
  If Not isEqual Then
    Log.Error("Fading schedule values are wrong")
  End If
    
  '²ÛÉ í×³ñáõÙÝ»ñÇ ·ñ³ýÇÏÇ Ýß³Ý³ÏáõÙ
  docExist = Other_Payment_Schedule(date_arg, "1000")
  If Not docExist Then
    Log.Error("Can't create payment schedule")
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
    
  queryString = "select COUNT(*) from DOCS where fISN= '" & fBASE & "' and fSTATE=7 and fNEXTTRANS=2"
  sql_Value = 1
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from AGRSCHEDULE where fAGRISN= '" & fBASE & "'"
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
    
  queryString = "select COUNT(*) from  dbo.HIF where fOBJECT= '" & fBASE & "' and fDATE='2012-12-04'"
  sql_Value = 14
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select SUM(fSUM), SUM(fCURSUM) from  dbo.HIF where fOBJECT='" & fBASE & "' and fDATE='2012-12-04'"
  sql_Value = 100062.7551
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
    
  queryString = "select COUNT(*) from  dbo.HIF where fOBJECT='" & fBASE & "'and fDATE<='2012-12-04'"
  sql_Value = 19
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from  dbo.HIR where fOBJECT='" & fBASE & "'and fDATE='2012-12-04'"
  Log.Message(fBASE)
  sql_Value = 0
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
   
  queryString = "select COUNT(*) from  dbo.HIT where fOBJECT='" & fBASE & "'and fDATE='2012-12-04' and fTYPE='N2' and fOP='PER' "
  sql_Value = 0
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
  docExist = Contracts_Filter_Fill("1", docNumber, "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
  If Not docExist Then
    Log.Error("The document doesn't exist in payments folder ")
    Exit Sub
  End If
    
  ' ¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
  Call Collect_From_Provision(data, sum, "2", accacc, fBaseCP)
    
  'ì³ñÏÇ ïñ³Ù³¹ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
  Call Give_Credit(data, summ, "2", accacc, giveCrBase) 
    
  'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
  calcPRBase = Calculate_Percents(pCalcDate, pCalcDate, False)
    
  'Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏÇ ÷á÷áËáõÙ
  Call Fading_Schedule_Fill(dateStart, dateEnd ,Null)
  
  BuiltIn.Delay(1000)
  wMDIClient.vbObject("frmPttel").Close()
    
  'Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ 1" ÃÕÃ³å³Ý³ÏÇó
  docExist = Verify_Credit(docNumber)
  If Not docExist Then
    Log.Error("The document doesn't exist in verifier folder")
  End If
    
  'Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏÇ Ñ³ëï³ïáõÙ
  Call PaySys_Verify(True)
  
  BuiltIn.Delay(1000)
  wMDIClient.vbObject("frmPttel").Close()
    
  'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏáõÙ
  docExist = Contracts_Filter_Fill("1", docNumber, "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
  If Not docExist Then
    Log.Error("The document doesn't exist in payments folder ")
    Exit Sub
  End If
    
  'ÀÝÃ³óÇÏ ·ñ³ýÇÏÇ ¹ÇïáõÙ
  percent = "20,353.20"
  BuiltIn.Delay(3000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_CurrentSchedules)
    
  'Ø³ñÙ³Ý ·ñ³ýÇÏÇ ·áõÙ³ñ ¨ ïáÏáë ¹³ßï»ñÇ ³ñÅ»ùÝ»ñÇ ëïáõ·áõÙ
  newSchedule = False
  isEqual = Compare_FadeSchedule_Values (summ, percent, newSchedule)
  If Not isEqual Then
    Log.Error("Fading schedule values are wrong")
  End If
    
  BuiltIn.Delay(1000)
  wMDIClient.vbObject("frmPttel").Close()
    
  Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ")
  Call Contract_Sammary_Report_Fill(fDate1, Null, Null, Null, docNumber, Null, Null, Null, _
                                  Null, Null, Null, Null, Null, Null, Null, _
                                  Null, Null, Null, Null, Null, Null, Null, False, False, _
                                  Null, False, False, False, _
                                  False, False, False, False, False, _
                                  False, False, False, True, True, True, _
                                  False, False, False, False, False, False, False, 1)
    
  'êÏ½µÝ³Ï³Ý Ù³ñÙ³Ý Å³ÙÏ»ï ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
  If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(7)) <> finishFadeDate Then
    Log.Error("Wrong initial fade date" & " : Expexted Result  = " & finishFadeDate & " : Actual result = " & Trim(Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").Columns.Item(7)))
  End If
    
  'Ø³ñÙ³Ý Å³ÙÏ»ï ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
  If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(8)) <> dateEnd Then
    Log.Error("Wrong finish fade date" & " : Expexted Result  = " & dateEnd & " : Actual result = " & Trim(Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").Columns.Item(8)))
  End If
    
  'ºñÏ³ñ³Ó·í³Í ûñ»ñÇ ù³Ý³Ï ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
  If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(24)) <> 0 Then
    Log.Error("Wrong count of prolonged dates" & " : Expexted Result  = " & "0" & " : Actual result = " & Trim(Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").Columns.Item(24)))
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
  pCalcDate = "17/12/12"
  Call Calculate_Percents(pCalcDate, pCalcDate, False)
    
  'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
  pCalcDate = "14/01/13"
  calcPRBase1 = Calculate_Percents(pCalcDate, pCalcDate, False)
    
  'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
  Call Fade_Debt(fDate1, fadeBase, Null,null, null, False)
    
  'ä³ÛÙ³Ý³·ñÇ ¹ÇïáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
  isExists = View_Contract()
  If Not isExists Then
    Log.Error("The document view doesn't exist")
  End If
    
  queryString = "select COUNT(*) from AGRSCHEDULE where fAGRISN= '" & fBASE & "'"
  sql_Value = 3
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select SUM(fINC), SUM(fKIND) from AGRSCHEDULE where fAGRISN= '" & fBASE & "'"
  sql_Value = 6
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
  sql_Value = 20
  colNum = 1
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from .AGRSCHEDULEVALUES where fAGRISN= '" & fBASE & "'"
  sql_Value = 120
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select SUM(fSUM), SUM(fVALUETYPE)  from .AGRSCHEDULEVALUES where fAGRISN=  '" & fBASE & "'"
  sql_Value = 344392.10
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
  sql_Value = 180
  colNum = 1
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
    
  queryString = "select COUNT(*) from  dbo.HIF where fOBJECT= '" & fBASE & "'"
  sql_Value =  26
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select SUM(fSUM), SUM(fCURSUM) from  dbo.HIF where fOBJECT='" & fBASE & "'"
  sql_Value = 100108.1083
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  sql_Value = 1830
  colNum = 1
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from  dbo.HIR where fOBJECT= '" & fBASE & "'"
  sql_Value = 19
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If

  queryString =  "select SUM(fLASTREM) from  dbo.HIRREST where fTYPE = 'R1' and fOBJECT= '" & fBASE & "'"
  sql_Value = 95833.30
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
  sql_Value = 95755.00
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If

  queryString = "select SUM(fCURSUM) from  dbo.HIR where fOBJECT='" & fBASE & "'"
  sql_Value = 138105.00
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
    
  queryString = "select COUNT(*) from HI where fDATE='2012-12-04' and fBASE='" & fBaseCP & "' and fSUM=100 and fCURSUM=100 and fADB=82335686 and fACR=230416894"
  sql_Value = 2
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from HI where fDATE='2012-12-04' and fBASE='" & giveCrBase & "'"
  sql_Value = 6
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from HI where fDATE='2012-12-04' and fBASE='" & giveCrBase & "'and fSUM=100 and fCURSUM=100 and fADB=1629496 and fACR=1629176"
  sql_Value = 2
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from HI where fDATE='2012-12-04' and fBASE='" & giveCrBase & "'and fSUM=100 and fCURSUM=100 and fADB=230416894"
  sql_Value = 2
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If

  queryString = "select COUNT(*) from HI where fDATE='2012-12-04' and fBASE='" & giveCrBase & "'and fSUM=100000 and fCURSUM=100000 and fACR=82335686"
  sql_Value = 2
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If

  queryString = "select COUNT(*) from HI where fDATE='2012-12-16' and fBASE='" & calcPRBase & "'and fSUM=676.70 and fCURSUM=676.70"
  sql_Value = 2
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If

  queryString = "select COUNT(*) from HI where fDATE='2013-01-14' and fBASE='" & calcPRBase1 & "'and fSUM=1480.60 and fCURSUM=1480.60"
  sql_Value = 2
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If

  queryString = "select COUNT(*) from HI where fDATE='2013-01-15' and fBASE='" & fadeBase & "'and fSUM=2186.30 and fCURSUM=2186.30"
  sql_Value = 2
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If

  queryString = "select COUNT(*) from HI where fDATE='2013-01-15' and fBASE='" & fadeBase & "'and fSUM=4166.70 and fCURSUM=4166.70"
  sql_Value = 2
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
  optype = "53"
  opdate = "15/01/13"
  group = False
  fdDoc = False
  Call DeleteOP(optype, opdate, group, fdDoc)
    
  optype = "511"
  opdate = "14/01/13"
  group = False
  fdDoc = False
  Call DeleteOP(optype, opdate, group, fdDoc)
    
  optype = "511"
  opdate = "17/12/12"
  group = False
  fdDoc = False
  Call DeleteOP(optype, opdate, group, fdDoc)
    
  '¶áñÍáÕáõÃÛáõÝÝ»ñÇ Ñ»é³óáõÙ ¶áñÍáÕáõÃÛáõÝÝ»ñÇ ¹ÇïáõÙÇó
  actionCount = Delete_Operations_From_OperationsView_Folder(9) 
  If Not actionCount Then                      
    Log.Error("Wrong count of actions")
  End If
    
  '    Üáñ Ù³ñáõÙÝ»ñÇ ·ñ³ýÇÏÇ Ñ»é³óáõÙ
  '    Call wMainForm.MainMenu.Click("¶áñÍáÕáõÃÛáõÝÝ»ñ|´áÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñÁ . . .")
  '    Call wMainForm.PopupMenu.Click("ÂÕÃ³å³Ý³ÏÝ»ñ|¶ñ³ýÇÏÝ»ñÇ ÃÕÃ³å³Ý³Ï")
  '    Do Until Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel_2").vbObject("tdbgView").EOF
  '        If Left(Trim(Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel_2").vbObject("tdbgView").columns.Item(0)), 28) = "Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ`  17/12/12" Then
  '            Exit Do
  '        Else
  '            Call Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel_2").vbObject("tdbgView").MoveNext
  '        End If
  '    Loop
  '    BuiltIn.Delay(delay_middle)
  '    Call Online_PaySys_Delete_Agr()
  '    Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel_2").Close
    
  ' ì³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñÇ çÝçáõÙ
  Call Online_PaySys_Delete_Agr()
    
  'Test CleanUp
  Call Close_AsBank()
End Sub