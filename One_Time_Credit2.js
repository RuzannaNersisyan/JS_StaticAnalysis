'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Contract_Summary_Report_Library
'USEUNIT Library_CheckDB
'USEUNIT Subsystems_SQL_Library
'USEUNIT One_Time_Credit_Library
'USEUNIT Constants
Option Explicit

'tast case N  165053

Sub One_Time_Credit_With_NonConstant_Percent_Test()
  Dim fDATE, data, startDATE , calcPRBase1, fadeBase, fadeBase1, calcPRBase, queryString, giveCrBase, fBaseCP, fDate1, isExists, docNumber, fISN, actionCount, dateStart, dateEnd
  Dim clientCode, tmpltype, curr, accacc, summ, date_arg, pcPenAgr, fadeDate, finishFadeDate, docN, Aim, tmpl_type, sql_Value, colNum
  Dim passDirection, sumDates, sumFill, pCalcDate, agrIntRate, agrIntRatePart, branch, sector, schedule, perMonth, sql_isEqual
  Dim guarante, startFadeDate, district, note, paperCode, fBASE, docExist, isEqual, round, percent,sum, part, constPer
  Dim dategive, dateconcl, newSchedule, date_perm , percSumma , Count, mainSumma, groupOpIsn, fadePeriod,wMainForm
    
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
  constPer = False
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
  mainSumma = "5000"
    
  'Test StartUp 
  Call Initialize_AsBank("bank", startDATE, fDATE)
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
  docN = Give_Credit(dateconcl, summ, "2", accacc, giveCrBase)
    
  'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
  calcPRBase = Calculate_Percents(pCalcDate, pCalcDate, False)
    
  'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
  Call Fade_Debt(fDate1, fadeBase, null , mainSumma, Null, False)
      
  BuiltIn.Delay(1000)  
  wMDIClient.vbObject("frmPttel").Close()
    
  dateStart = "10/06/13"
  Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ")
  Call Contract_Sammary_Report_Fill(dateStart, Null, Null, Null, docNumber, Null, Null, Null, _
                                Null, Null, Null, Null, Null, Null, Null, _
                                Null, Null, Null, Null, Null, Null, Null, False, False, _
                                Null, False, False, False, _
                                False, False, False, False, False, _
                                True, True, False, False, False, False, _
                                False, False, True, True, False, False, False, 1)
                                      
  'îáÏáë ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
  If Trim(Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").Columns.Item(7)) <> "4,789.00" Then
    Log.Error("Wrong percent")
  End If 
     
  '--------------------------------------------------------------   
  'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
  pCalcDate = "11/06/13"
  calcPRBase = Calculate_Percents(pCalcDate, pCalcDate, False)
  '--------------------------------------------------------------  
  
  'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
  pCalcDate = "10/09/13"
  calcPRBase = Calculate_Percents(pCalcDate, pCalcDate, False)  
      
  BuiltIn.Delay(1000)
  wMDIClient.vbObject("frmPttel").Close()
    
  dateStart = "10/09/13"
  Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ")
  Call Contract_Sammary_Report_Fill(dateStart, Null, Null, Null, docNumber, Null, Null, Null, _
                                Null, Null, Null, Null, Null, Null, Null, _
                                Null, Null, Null, Null, Null, Null, Null, False, False, _
                                Null, False, False, False, _
                                False, False, False, False, False, _
                                True, True, False, False, False, False, _
                                False, False, True, True, False, False, False, 1)
    
  'îáÏáë ëÛ³Ý ³ñÅ»ùÇ ëïáõ·áõÙ
  If Trim(Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").Columns.Item(7)) <> "4,549.60" Then
    Log.Error("Wrong percent")
  End If
      
  'îáÏáëÝ»ñÇ ËÙµ³ÛÇÝ Ñ³ßí³ñÏÇ Ï³ï³ñáõÙ
  pCalcDate = "11/03/14"
  Call Percent_Group_Calculate(pCalcDate, pCalcDate, False , False)
       
  'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
  fDate1 = "12/03/14"
  pCalcDate = "11/03/14"
  Call Fade_Debt(fDate1, fadeBase1, pCalcDate, Null, Null, False)
    
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
  sql_Value = 4
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from dbo.HIF  where fDATE='2013-06-10' and fOBJECT='" & fBASE & "'"
  sql_Value = 1
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
    
  queryString = "select COUNT(*) from dbo.HIF  where fDATE='2013-09-10' and fOBJECT='" & fBASE & "'"
  sql_Value = 1
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from dbo.HIF  where fDATE='2014-03-11' and fOBJECT= '" & fBASE & "'"
  sql_Value = 7
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
  sql_Value = 34
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select SUM(fCURSUM) from  dbo.HIR where fOBJECT='" & fBASE & "'"
  sql_Value = 464470
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from  dbo.HIT where fTYPE='N2' and fOP='PER' and fOBJECT='" & fBASE & "'"
  sql_Value = 8
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select Sum(fCURSUM) from  dbo.HIT where fTYPE='N2' and fOP='PER' and fOBJECT= '" & fBASE & "'"
  sql_Value = 18289.4
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from  dbo.HIT where fOBJECT='" & fBASE & "'"
  sql_Value = 18
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("QuIerystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select SUM(fSUM), SUM(fCURSUM) from  dbo.HIF where fOBJECT='" & fBASE & "'"
  sql_Value = 100061.4225
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
    
  queryString = "select Sum(fCURSUM) from  dbo.HIT where fOBJECT='" & fBASE & "'"
  sql_Value = 18895.6
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "Select Sum(XX.fCURSUM) From (Select HI.fADB,HI.fACR,HI.fCURSUM,HI.fDBCR From HIR Join HI On (HIR.fBASE=HI.fBASE And HIR.fTRANS=HI.fTRANS) Where HIR.fOBJECT='" & fBASE & "'Group By HI.fADB,HI.fACR,HI.fCURSUM,HI.fDBCR) As XX"
  sql_Value = 512358.4
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "Select Count(XX.fCURSUM) From (Select HI.fADB,HI.fACR,HI.fCURSUM,HI.fDBCR From HIR Join HI On (HIR.fBASE=HI.fBASE And HIR.fTRANS=HI.fTRANS) Where HIR.fOBJECT='" & fBASE & "'Group By HI.fADB,HI.fACR,HI.fCURSUM,HI.fDBCR) As XX"
  sql_Value = 44
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
    
  queryString = "select COUNT(*) from HI where fDATE='2013-06-11' and fSUM=5000.00 and  fBASE='" & fadeBase & "'"
  sql_Value = 2
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from HI where fTYPE='01' and fACR=82335686 and fBASE='" & giveCrBase & "' "
  sql_Value = 2
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from HI where fTYPE='01' and fACR=82335686 and fBASE='" & giveCrBase & "'"
  sql_Value = 2
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
    
  queryString = "select COUNT(*) from HI where fDATE='2013-03-11' and fTYPE='01' and fACR=82335686 and fBASE='" & giveCrBase & "'"
  sql_Value = 2
  colNum = 0
  sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
  If Not sql_isEqual Then
    Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
  End If
   
'    'ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
'    optype = "22"
'    opdate = "12/03/14"
'    group = False
'    fdDoc = False
'    Call DeleteOP(optype, opdate, group, fdDoc)
'    
'    'îáÏáëÝ»ñÇ Ñ³ßí³ñÏ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
'    optype = "511"
'    opdate = "11/03/14"
'    group = True
'    fdDoc = False
'    Call DeleteOP(optype, opdate, group, fdDoc)
'    
'    'ØÝ³ó³Í ·áñÍáÕáõÃÛáõÝÝ»ñÇ Ñ»é³óáõÙ
'    actionCount = Delete_Operations_From_OperationsView_Folder(9)
'    If Not actionCount Then
'        Log.Error("Wrong count of actions")
'    End If
'    
'    'ì³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñÇ çÝçáõÙ
'    Call Online_PaySys_Delete_Agr()
'    Call Close_AsBank()
'''    'Test CleanUp end
End Sub