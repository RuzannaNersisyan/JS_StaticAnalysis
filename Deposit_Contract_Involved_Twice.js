
Option Explicit
'USEUNIT Library_Common
'USEUNIT Online_PaySys_Library
'USEUNIT Constants
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Insurance_Agreement_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Library_Contracts
'USEUNIT Akreditiv_Library
'USEUNIT Derivative_Tools_Library
'USEUNIT Subsystems_Special_Library
'USEUNIT Credit_Line_Library
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Payment_Except_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Debit_Dept_Library
' Test Case ID 155959
 
' Ավանդներ (ներգրավված) պայմանագրի կրկնակի ներգրավվում
Sub Deposit_Contract_Involved_Twice_Test()
      
      Dim fDATE, sDATE
      Dim fISN,contractNum,template,depositContractType,colItem, _
              ClientCode,thirdPerson,curr,accAc,thirdAcc,perAcc,money,chbKap,_
              chbAuto,chbEx,signDate,kindScale,scale,withScale,depositPer,part,per,dateGive,_
              dateAgr,startDate,period,direction
      Dim VerifyContract, ContractsFilter, DepositInvolved
      Dim involveISN, invDate, cashORno, wAcc, tabN
      Dim MortgageType, DocN, docType, mortSum, mortCount, sealDate, giveDate, mortPlace, mortSub
      Dim debtRepayISN, mainSum, perSum, docNum
      Dim param, repDate, rekvName, summ, percCalcISN, Calculate_Date , Action_Date
      Dim extDate, cap, ext, rep, perc, perCalc, close, pladgeNumber
      Dim dateStart, percentMoney, calcfISN, summperc, specCalcISN, fCaptISN, Overdraft
      Dim state, fileName1, savePath, fName, fileName2, name, name_len, colNum, Pttel, endDate
      Dim CloseDate, datePar, rChng, rDeal, ContractStatement, paramN, status, dateType, fedSummISN, mortgISN
      Dim queryString, sqlValue, sql_isEqual, frmPttel, retIntPaidISN

      fDATE = "20250101"
      sDATE = "20130101"
      
      Call Initialize_AsBank("bank", sDATE, fDATE)
      
      Call Create_Connection()
      
      ' Մուտք գործել համակարգ ARMSOFT օգտագործողով 
      Login("ARMSOFT")
      
      ' Մուտք ադմինիստրատորի ԱՇՏ
      Call ChangeWorkspace(c_Subsystems)
      Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|¸³ï³ñÏ å³ÛÙ³Ý³·Çñ")
               
      depositContractType = "²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ"
      template = "0002"             
      clientCode = "00000018"
      thirdPerson = "00000235"
      curr = "000"
      accAc = "00001850100"
      thirdAcc = "77790393321"
      perAcc = "00001850100"
      money = "100000"
      chbKap = 1
      chbAuto = 1
      chbEx = 1
      signDate = "010321"
      kindScale = "1"
      scale = False
      depositPer = "11"
      part = "365"
      per = "5"
      dateGive = "020321"
      dateAgr = "010821"
      startDate = "020321"
      period = "1"
      direction = "2"
      Call Deposit_Contract_Fill(fISN,contractNum,template,depositContractType,colItem, _
                                                      ClientCode,thirdPerson,curr,accAc,thirdAcc,perAcc,money,chbKap,_
                                                      chbAuto,chbEx,signDate,kindScale,scale,withScale,depositPer,part,per,dateGive,_
                                                      dateAgr,startDate,period,direction)
  
      Log.Message(fISN)
      Log.Message(contractNum)
      BuiltIn.Delay(3000)
      
               ' CONTRACTS
                queryString = " SELECT COUNT(*)  FROM CONTRACTS  where fDGISN =  " & fISN & _
                                         " and fDGCODE = '"& contractNum &"' and fDGCAPTION = 'ä»ïñáëÛ³Ý ä»ïñáë' " &_
                                         " and fDGECAPTION = 'Pogosyan Pogos' and fDGCLICODE = '00000018' " &_
                                         " and fDGCUR = '000' and fDGSUMMA = '100000.00' and fDGALLSUMMA = '0.00' " &_
                                         " and fDGRISKDEGREE = '0.00' and fDGRISKDEGNB = '0.00' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCP
                queryString = " SELECT COUNT(*)  FROM DOCP where fPARENTISN =  " & fISN & _
                                         "and fNAME = 'Acc' "
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCS
                queryString = " SELECT COUNT(*)  FROM DOCS  WHERE fISN =  " & fISN & _
                                         "and fNAME = 'D1AS21' and fSTATE = '1' and fBODY like '" & vbCRLF _
                                      &"CODE:"& contractNum & vbCRLF _
                                      &"AGRTYPE:0002" & vbCRLF _
                                      &"CLICOD:00000018" & vbCRLF _
                                      &"CLICOD3:00000235" & vbCRLF _
                                      &"NAME:ä»ïñáëÛ³Ý ä»ïñáë" & vbCRLF _
                                      &"CURRENCY:000" & vbCRLF _
                                      &"ACCACC:00001850100" & vbCRLF _
                                      &"ACCACC3:77790393321" & vbCRLF _
                                      &"ACCACCPR:00001850100" & vbCRLF _
                                      &"SUMMA:100000" & vbCRLF _
                                      &"CHRGFIRSTDAY:0" & vbCRLF _
                                      &"AUTOCAP:1" & vbCRLF _
                                      &"AUTODEBT:1" & vbCRLF _
                                      &"AUTOPROLONG:1" & vbCRLF _
                                      &"DATE:20210301" & vbCRLF _
                                      &"ACSBRANCH:00" & vbCRLF _
                                      &"ACSDEPART:1" & vbCRLF _
                                      &"ACSTYPE:D10" & vbCRLF _
                                      &"KINDSCALE:1" & vbCRLF _
                                      &"PCAGR:11.0000/365" & vbCRLF _
                                      &"WITHSCALE:0" & vbCRLF _
                                      &"DONOTCALCPCBASE:0" & vbCRLF _
                                      &"PCNOCHOOSE:0/1" & vbCRLF _
                                      &"PCBREAK:5.0000/365" & vbCRLF _
                                      &"TAXVALUE:10" & vbCRLF _
                                      &"PAYPERGIVE:0" & vbCRLF _
                                      &"PCNDERAUTO:0" & vbCRLF _
                                      &"PCPENAGR:0/1" & vbCRLF _
                                      &"PCPENPER:0/1" & vbCRLF _
                                      &"DATEGIVE:20210302" & vbCRLF _
                                      &"DATEAGR:20210801" & vbCRLF _
                                      &"AUTODATE:0" & vbCRLF _
                                      &"SECTOR:U2" & vbCRLF _
                                      &"LRDISTR:001" & vbCRLF _
                                      &"REPAYADVANCE:100" & vbCRLF _
                                      &"PPRCODE:%%%" & vbCRLF _
                                      &"CONSTPER:0" & vbCRLF _
                                      &"'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
                ' RESNUMBERS
                queryString = " SELECT COUNT(*)  FROM RESNUMBERS where fISN =  " & fISN & _
                                         " and fTYPE = 'D' and fNUMBER = '" & contractNum &"'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCSG
                queryString = " SELECT COUNT(*)  FROM DOCSG where fISN =  " & fISN & _
                                         " and fGRID = 'DATES' and fCOL = 'DATEPER'"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' FOLDERS
                queryString = " SELECT COUNT(*)  FROM FOLDERS where fISN =  " & fISN & _
                                         " and ((fCOM = '²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ' and fSPEC = '1²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ- "& contractNum &" {ä»ïñáëÛ³Ý ä»ïñáë}')" & _
                                         " or (fCOM = ' ²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ (Ý³Ë³·ÇÍ)' and fSPEC = '"& contractNum &", (ä»ïñáëÛ³Ý ä»ïñáë), »ññáñ¹ ³ÝÓ` (00000235), 100000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù')" & _
                                         " or (fCOM = ' ²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ (Ý³Ë³·ÇÍ)' and fSPEC = '"& contractNum &" (ä»ïñáëÛ³Ý ä»ïñáë),     100000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù')" & _
                                         " or (fCOM = '²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ' and fSPEC = '"& contractNum &"      D10 20210301            0.0077  00000018Üáñ å³ÛÙ³Ý³·Çñ      '))" 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      ' Փաստաթուղթն ուղարկել հաստատման
      Call PaySys_Send_To_Verify()
      BuiltIn.Delay(3000)
      
      Set frmPttel = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel")
      frmPttel.Close
      
               ' DOCLOG
                queryString = " SELECT COUNT(*)  FROM DOCLOG where fISN =  " & fISN & _
                                         " and fSUIDCOR = '-1' and fSUID = '77'"  & _
                                         " and  (( fOP = 'N' and fSTATE = '1' )"  & _
                                         " or (fOP = 'M' and fSTATE = '99' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý')"  & _
                                         " or (fOP = 'C' and fSTATE = '101' ))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCS
                queryString = " SELECT COUNT(*)  FROM DOCS where fISN =  " & fISN & _
                                         "and fNAME = 'D1AS21  ' and fSTATE = '101' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' FOLDERS
                queryString = " SELECT COUNT(*)  FROM FOLDERS where fISN =  " & fISN & _
                                         " and (fCOM = ' ²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ' or  fCOM = '²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ')"  & _
                                         " and (( fSPEC = '1²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ- "& contractNum &" {ä»ïñáëÛ³Ý ä»ïñáë}') " & _
                                         " or ( fSPEC = '"& contractNum &", (ä»ïñáëÛ³Ý ä»ïñáë), »ññáñ¹ ³ÝÓ` (00000235), 100000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù') " & _
                                         " or ( fSPEC = '"& contractNum &" (ä»ïñáëÛ³Ý ä»ïñáë),     100000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù') " & _
                                         " or ( fSPEC = '"& contractNum &"      D10 20210301            0.0077  00000018') "& _
                                         " or ( fSPEC = '"& contractNum &"      D10 20210301            0.0077  00000018àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³'))"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
    
      Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
           
      Set VerifyContract = New_VerifyContract()
      VerifyContract.AgreementN = contractNum
    
      ' Մուտք Հաստատող փաստաթղթեր1  թղթապանակ
      Call Fill_Verify(VerifyContract)
    
      ' Վավերացնել փաստաթուղթը
      Call Validate_Doc()
      BuiltIn.Delay(2000)
      frmPttel.Close
      
                ' DAGRACCS
                queryString = " SELECT COUNT(*)  FROM DAGRACCS where fAGRISN =  " & fISN & _
                                         " and fACCACC = '00001850100' and fACCACC3 = '77790393321' and fACCACCPR = '00001850100' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCLOG
                queryString = " SELECT COUNT(*)  FROM DOCLOG where fISN =  " & fISN & _
                                         " and fSUIDCOR = '-1' and fSUID = '77'"  & _
                                         " and  (( fOP = 'N' and fSTATE = '1' )"  & _
                                         " or (fOP = 'M' and fSTATE = '99' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý')" & _
                                         " or (fOP = 'C' and fSTATE = '101' )" & _
                                         " or (fOP = 'W' and fSTATE = '102' )" & _
                                         " or (fOP = 'T' and fSTATE = '7' ))"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCP
                queryString = " SELECT COUNT(*)  FROM DOCP where fPARENTISN =  " & fISN & _
                                         "and fNAME = 'Acc'"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCS
                queryString = " SELECT COUNT(*)  FROM DOCS where fISN =  " & fISN & _
                                         "and fNAME = 'D1AS21  ' and fSTATE = '7' and fNEXTTRANS = '2'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' FOLDERS
                queryString = " SELECT COUNT(*)  FROM FOLDERS where fISN =  " & fISN & _
                                         " and fNAME = 'D1AS21' and fSTATUS = '1'" & _
                                         " and fCOM = '²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ' or fCOM = ' ²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ'" & _
                                         " and (fSPEC = '1²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ- "& contractNum &" {ä»ïñáëÛ³Ý ä»ïñáë}'" & _
                                         " or fSPEC = '"& contractNum &", (ä»ïñáëÛ³Ý ä»ïñáë), »ññáñ¹ ³ÝÓ` (00000235), 100000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù'" & _
                                         " or fSPEC = '"& contractNum &" (ä»ïñáëÛ³Ý ä»ïñáë),     100000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù' )"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
      Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
      
      Set ContractsFilter = New_ContractsFilter()
      ContractsFilter.AgreementN = contractNum
      ContractsFilter.AgreementLevel = "1"
      
      Call Fill_ContractsFilter(ContractsFilter)
      BuiltIn.Delay(2000)
      
       ' Գրավի ստեղծում
      MortgageType = "²ÛÉ ·ñ³í"
      docType = "3"
      mortSum = "400000"
      mortCount = "1"
      sealDate = "020321"
      giveDate = "020321"
      mortPlace = "2"
      mortSub = "0"
      Call Create_Mortgage(MortgageType, DocN, docType, curr, mortSum, mortCount, sealDate, giveDate, mortPlace, mortSub)
      Log.Message("Գրավի փաստաթղթի N` " & DocN)
      BuiltIn.Delay(2000)
      
      mortgISN = GetIsn()
      BuiltIn.Delay(1000)
      
                ' CONTRACTS
                queryString = " SELECT COUNT(*)  FROM CONTRACTS where fDGISN =  " & mortgISN & _
                                         " and fDGAGRTYPE = 'M' and fDGTYPENAME = 'M1Other' and fDGCODE = '"& DocN &"' and fDGCAPTION = 'ä»ïñáëÛ³Ý ä»ïñáë'" & _
                                         " and fDGECAPTION = 'Pogosyan Pogos' and fDGCLICODE = '00000018' and fDGCUR = '000' and fDGSUMMA = '400000.00'" & _
                                         " and fDGALLSUMMA = '1.00' and fDGRISKDEGNB = '0.00' and fDGRISKDEGREE = '0.00' and fDGACSTYPE = 'M10'" & _
                                         " and fDGMCODESS = '"& contractNum &"' and fDGMPERCENTAGE = '0.00'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
                ' DOCLOG
                queryString = " SELECT COUNT(*)  FROM DOCLOG where fISN =  " & mortgISN & _
                                         "and fSUIDCOR = '-1' and fSUID = '77' and fOP = 'N' and fSTATE = '1' and fDCRID = '0'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCP
                queryString = " SELECT COUNT(*)  FROM DOCP where fPARENTISN =  " & mortgISN & _
                                         "and fNAME = 'REMINDER'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCS
                queryString = " SELECT COUNT(*)  FROM DOCS where fISN =  " & mortgISN & _
                                         "and fNAME = 'M1Other ' and fSTATE = '1' and fNEXTTRANS = '1' and fBODY = '" & vbCRLF _
                                      & "TRNSINNB:1" & vbCRLF _
                                      & "SECTYPE:3" & vbCRLF _
                                      & "CODE:"& DocN & vbCRLF _
                                      & "CODESS:"& contractNum & vbCRLF _
                                      & "CODESSISN:" & fISN  & vbCRLF _
                                      & "CLICOD:00000018" & vbCRLF _
                                      & "NAME:ä»ïñáëÛ³Ý ä»ïñáë" & vbCRLF _
                                      & "WITHPER:1" & vbCRLF _
                                      & "CURRENCY:000" & vbCRLF _
                                      & "SUMMA:400000" & vbCRLF _
                                      & "COUNT:1" & vbCRLF _
                                      & "DATE:20210302" & vbCRLF _
                                      & "DATEGIVE:20210302" & vbCRLF _
                                      & "ACSBRANCH:00" & vbCRLF _
                                      & "ACSDEPART:1" & vbCRLF _
                                      & "ACSTYPE:M10" & vbCRLF _
                                      & "PLACE:2" & vbCRLF _
                                      & "MORTSUBJECT:0" & vbCRLF _
                                      & "GIVEN:0" & vbCRLF _
                                      & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' FOLDERS
                queryString = " SELECT COUNT(*)  FROM FOLDERS where fISN =  " & mortgISN & _
                                         " and fNAME = 'M1Other' and fSTATUS = '1'" & _
                                         " and ((fCOM = '¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í'and fSPEC = '1¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í (Ý³Ë³·ÇÍ)- "& DocN &"         "& contractNum &"       ') " & _
                                         " or (fCOM = '¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í (Ý³Ë³·ÇÍ)'and fSPEC = '"& DocN &" (ä»ïñáëÛ³Ý ä»ïñáë) ,     400000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù -            1.00 Ñ³ï ') " & _
                                         " or (fCOM = 'ä»ïñáëÛ³Ý ä»ïñáë'and fSPEC = '13"& DocN &"') " & _
                                         " or (fCOM = '¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í'and fSPEC = '1¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í- "& DocN &" {ä»ïñáëÛ³Ý ä»ïñáë} ') " & _
                                         " or (fCOM = '¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í'and fSPEC = '"& DocN &"        M10 20210302            0.0077  00000018Üáñ å³ÛÙ³Ý³·Çñ      ') )"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' RESNUMBERS
                queryString = " SELECT COUNT(*)  FROM RESNUMBERS where fISN =  " & mortgISN & _
                                         "and fTYPE = 'M'  and fNUMBER = '"& DocN &"'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      ' Փաստաթուղթն ուղարկել հաստատման
      Call PaySys_Send_To_Verify()
      BuiltIn.Delay(3000)
      
                ' DOCLOG
                queryString = " SELECT COUNT(*)  FROM DOCLOG where fISN =  " & mortgISN & _
                                         " and fSUIDCOR = '-1' and fSUID = '77'  and fDCRID = '0'" & _
                                         " and ((fOP = 'N' and fSTATE = '1')" & _
                                         " or (fOP = 'M' and fSTATE = '99')" & _
                                         " or (fOP = 'C' and fSTATE = '101'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCS
                queryString = " SELECT COUNT(*)  FROM DOCS where fISN =  " & mortgISN & _
                                         "and fNAME = 'M1Other ' and fSTATE = '101' and fNEXTTRANS = '1' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' FOLDERS
                queryString = " SELECT COUNT(*)  FROM FOLDERS where fISN =  " & mortgISN & _
                                         " and fNAME = 'M1Other' and (fSTATUS = '0' or fSTATUS = '4')" & _
                                         " and (fCOM = '¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í' or fCOM = 'ä»ïñáëÛ³Ý ä»ïñáë') " & _
                                         " and ((fSPEC = '1¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í- "& DocN &"         "& contractNum &"       ')" & _
                                         " or (fSPEC = '"& DocN &" (ä»ïñáëÛ³Ý ä»ïñáë) ,     400000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù -            1.00 Ñ³ï ') or (fSPEC = '13"& DocN &"')" & _
                                         " or (fSPEC = '1¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í- "& DocN &" {ä»ïñáëÛ³Ý ä»ïñáë} ')" & _
                                         " or (fSPEC = '"& DocN &"        M10 20210302            0.0077  00000018')" & _
                                         " or (fSPEC = '"& DocN &"        M10 20210302            0.0077  00000018àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³'))"
                sqlValue = 6
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").Close()
      frmPttel.Close()
    
      ' Մուտք Տրամադրված գրավ ԱՇՏ
      Call ChangeWorkspace(c_GivenPledge)
    
      Call wTreeView.DblClickItem("|îñ³Ù³¹ñí³Í ·ñ³í|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    
      Set VerifyContract = New_VerifyContract()
      VerifyContract.AgreementN = DocN
    
      ' Մուտք Հաստատող փաստաթղթեր1  թղթապանակ
      Call Fill_Verify(VerifyContract)
    
      ' Վավերացնել փաստաթուղթը
      Call Validate_Doc()
      BuiltIn.Delay(2000)
      frmPttel.Close
      
                ' DOCLOG
                queryString = " SELECT COUNT(*)  FROM DOCLOG where fISN =  " & mortgISN & _
                                         " and fSUIDCOR = '-1' and fSUID = '77' and fDCRID = '0'" & _
                                         " and ((fOP = 'N' and fSTATE = '1')" & _
                                         " or (fOP = 'M' and fSTATE = '99' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý')" & _
                                         " or (fOP = 'C' and fSTATE = '101')" & _
                                         " or (fOP = 'W' and fSTATE = '102')" & _
                                         " or (fOP = 'C' and fSTATE = '7'))"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCS
                queryString = " SELECT COUNT(*)  FROM DOCS where fISN =  " & mortgISN & _
                                         "and fNAME = 'M1Other ' and fSTATE = '7' and fNEXTTRANS = '1' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' FOLDERS
                queryString = " SELECT COUNT(*)  FROM FOLDERS where fISN =  " & mortgISN & _
                                         " and fNAME = 'M1Other' and fSTATUS = '1'" & _
                                         " and ((fCOM = '¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í' or fCOM = 'ä»ïñáëÛ³Ý ä»ïñáë') " & _
                                         " or fSPEC = '1¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í- "& DocN &"         "& contractNum &"       ' or fSPEC = '13"& DocN &"'" & _
                                         " or fSPEC = '"& DocN &" (ä»ïñáëÛ³Ý ä»ïñáë) ,     400000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù -            1.00 Ñ³ï '" & _
                                         " or fSPEC = '1¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í- "& DocN &" {ä»ïñáëÛ³Ý ä»ïñáë} ')" 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                 ' MAGRACCS
                queryString = " SELECT COUNT(*)  FROM MAGRACCS where fAGRISN =  " & mortgISN & _
                                         " and fTYPEPEN = '0' and fTYPEPEN2 = '0' and fLIMUNUSE = '1'" 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
      ' Մուտք Պայմանագրեր թղթապանակ
      Call ChangeWorkspace(c_Subsystems)
      Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|ä³ÛÙ³Ý³·ñ»ñ")

      Set ContractsFilter = New_ContractsFilter()
      ContractsFilter.AgreementN = contractNum
      ContractsFilter.AgreementLevel = "1"
      
      Call Fill_ContractsFilter(ContractsFilter)

      ' Կատարել Ավանդի ներգրավվում
      Set DepositInvolved = New_DepositInvolved()
      With DepositInvolved
      .wAction = c_Opers & "|" & c_GiveAndBack & "|" & c_DepositAttr 
      .invDate = "030321"
      .wMoney = money
      .cashORno = "2"
      .wAcc = perAcc
      .ExpectedMessage = contractNum &" Ñ³Ù³ñáí å³ÛÙ³Ý³·ÇñÁ Ï³ñáÕ »ù Ñ³Ù³Éñ»É ³é³í»É³·áõÛÝÁ 900000" & vbCRLF _ 
                                            & "·áõÙ³ñáí"
      End With
      
      Call Fill_DepositInvolved(DepositInvolved)
      Log.Message("Ավանդի ներգրավվում փաստաթղթի ISN` " & DepositInvolved.involveISN)
      
               ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & DepositInvolved.involveISN & _
                                         " and fTYPE = '01' and fSUM = '100000.00' and fCURSUM = '100000.00' " & _
                                         " and fOP = 'MSC' and (fDBCR = 'C' or fDBCR = 'D') and fSUID = '77'"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & DepositInvolved.involveISN & _
                                         " and fCUR = '000' and fCURSUM = '100000.00' and fOP = 'AGR' "& _
                                         " and fSPEC = '²í³Ý¹Ç Ý»ñ·ñ³íáõÙ' and fDBCR = 'D'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      Set DepositInvolved = New_DepositInvolved()
      With DepositInvolved
      .wAction = c_Opers & "|" & c_GiveAndBack & "|" & c_DepositAttr 
      .invDate = "030321"
      .wMoney = "1000000"
      .cashORno = "2"
      .wAcc = perAcc
      .ExpectedMessage = contractNum &" Ñ³Ù³ñáí å³ÛÙ³Ý³·ÇñÁ Ï³ñáÕ »ù Ñ³Ù³Éñ»É ³é³í»É³·áõÛÝÁ 900000 "& vbNewLine &"·áõÙ³ñáí"
      .wMoney2 = "200000"
      .state = True
      End With
      
      Call Fill_DepositInvolved(DepositInvolved)
      Log.Message("Ավանդի ներգրավվում փաստաթղթի ISN` " & DepositInvolved.involveISN)
 
                ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & DepositInvolved.involveISN & _
                                         " and fTYPE = '01' and fSUM = '200000.00' and fCURSUM = '200000.00'" &_
                                         " and fOP = 'MSC' and (fDBCR = 'C' or fDBCR = 'D') and fSUID = '77'"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & DepositInvolved.involveISN & _
                                         " and fCUR = '000' and fCURSUM = '200000.00' and fOP = 'AGR'" & _
                                         " and fSPEC = '²í³Ý¹Ç Ý»ñ·ñ³íáõÙ' and fDBCR = 'D'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      ' Տոկոսների հաշվարկում
      dateStart = "010421"
      percentMoney = "2621.90"
      Call PercentCalculation(dateStart, dateStart, percentMoney, calcfISN )
      Log.Message("Տոկոսների հաշվարկում փաստաթղթի ISN` " & calcfISN)
      
                ' DOCP
                queryString = " SELECT COUNT(*)  FROM DOCP where fPARENTISN =  " & fISN & _
                                         " and fNAME = 'Acc'"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCLOG
                queryString = " SELECT COUNT(*)  FROM DOCLOG where fISN =  " & calcfISN & _
                                         " and fSUIDCOR = '-1' and fSUID = '77' and fDCRID = '0'" & _
                                         " and ((fOP = 'N' and fSTATE = '1')" & _
                                         " or (fOP = 'M' and fSTATE = '99' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý')" & _
                                         " or (fOP = 'T' and fSTATE = '2')" & _
                                         " or (fOP = 'C' and fSTATE = '5'))" 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & calcfISN & _
                                         " and fTYPE = '01' and fSUM = '2621.90' and fCURSUM = '2621.90' and fCUR = '000'" & _
                                         " and fOP = 'PRC' and (fDBCR = 'C' or fDBCR = 'D') and fSUID = '77'"
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & calcfISN & _
                                         " and fCUR = '000' and fCURSUM = '2621.90' and fDBCR = 'D'" & _
                                         " and ((fOP = 'PER' and fSPEC = 'îáÏáëÇ Ñ³ßí³ñÏáõÙ' and fTYPE = 'R2')" & _
                                         " or (fOP = 'PRJ' and fSPEC = 'Ä³ÙÏ»ï³Ýó ïáÏáëÇ Ó¨³íáñáõÙ' and fTYPE = 'R¸'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                
                ' HIF
                queryString = " SELECT COUNT(*)  FROM HIF where fBASE =  " & calcfISN & _
                                         " and fTYPE = 'N0' and fSUM = '0.00' and fCURSUM = '0.00' and fOP = 'DTC'" & _
                                         " and fADB = '0' and fTRANS = '1'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIT
                queryString = " SELECT COUNT(*)  FROM HIT where fBASE =  " & calcfISN & _
                                         " and fTYPE = 'N2' and fCUR = '000' and fCURSUM = '2621.90' and fSPEC = 'Îáõï³ÏáõÙ'" & _
                                         " and fDBCR = 'D' and fOP = 'PER' and fADB = '0' and fTRANS = '1'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fPENULTREM = '0.00' and fSTARTREM = '0.00' "& _
                                         " and ((fTYPE = 'R1' and fLASTREM = '300000.00') "& _
                                         " or (fTYPE = 'R2' and fLASTREM = '2621.90') " & _
                                         " or (fTYPE = 'R¸' and fLASTREM = '2621.90')) " 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      ' Հաշվարկների ճշգրտում
      dateStart = "020421"
      summperc = "5000"
      Call Correction_Calculation(dateStart, summperc, specCalcISN)
      Log.Message("Հաշվարկների ճշգրտում փաստաթղթի ISN` " & specCalcISN)
      
                ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & specCalcISN & _
                                         " and fTYPE = '01' and fSUM = '5000.00' and fCURSUM = '5000.00' and fCUR = '000'" & _
                                         " and fOP = 'MSC' and (fDBCR = 'C' or fDBCR = 'D') and fSUID = '77'"
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & specCalcISN & _
                                         " and fCUR = '000' and fCURSUM = '5000.00' and fOP = 'RAC' and fDBCR = 'D'" & _
                                         " and (( fSPEC = 'Ð³ßí³ñÏí³Í ïáÏáëÇ ×ß·ñïáõÙ' and fTYPE = 'R2')" & _
                                         " or (fSPEC = 'Ä³ÙÏ»ï³Ýó ïáÏáëÇ ×ß·ñïáõÙ' and fTYPE = 'R¸'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fSTARTREM = '0.00' and ((fTYPE = 'R1' and fLASTREM = '300000.00' and fPENULTREM = '0.00') "& _
                                         " or (fTYPE = 'R2' and fLASTREM = '7621.90' and fPENULTREM = '2621.90')"& _
                                         " or (fTYPE = 'R¸' and fLASTREM = '7621.90' and fPENULTREM = '0.00'))" 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      ' Պարտքերի մարում
      dateStart = "020421"
      mainSum = "50000"
      perSum = "2,621.90"
      tabN = 2
      Call Debt_Repayment(debtRepayISN, dateStart, mainSum, perSum, cashORno, perAcc, docNum, tabN)
      Log.Message("Պարտքերի մարում փաստաթղթի ISN` " & debtRepayISN) 
      
                ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & debtRepayISN & _
                                         " and fTYPE = '01' and fCUR = '000'" & _
                                         " and ((fSUM = '262.20' and fCURSUM = '262.20' and (fDBCR = 'C' or fDBCR = 'D') )" & _
                                         " or (fSUM = '50000.00' and fCURSUM = '50000.00' and (fDBCR = 'C' or fDBCR = 'D') )" & _
                                         " or (fSUM = '2621.90' and fCURSUM = '2621.90' and (fDBCR = 'C' or fDBCR = 'D')))"
                sqlValue = 6
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & debtRepayISN & _
                                         " and fCUR = '000'  and fDBCR = 'C'" & _
                                         " and ((fSPEC = '²í³Ý¹Ç Ù³ñáõÙ' and fTYPE = 'R1' and fCURSUM = '50000.00' and fOP = 'DBT')" & _
                                         " or (fSPEC = 'îáÏáëÇ Ù³ñáõÙ' and fTYPE = 'R2'  and fCURSUM = '2359.70' and fOP = 'DBT') " & _
                                         " or (fSPEC = 'Ð³ñÏÇ ·³ÝÓáõÙ ïáÏáëÇ Ù³ñáõÙÇó' and fTYPE = 'R2'  and fCURSUM = '262.20' and fOP = 'TXD') " & _
                                         " or (fSPEC = 'Ä³ÙÏ»ï³Ýó ïáÏáëÇ Ù³ñáõÙ' and fTYPE = 'R¸'  and fCURSUM = '2359.70' and fOP = 'DBT') " & _
                                         " or (fSPEC = 'Ð³ñÏÇ ·³ÝÓáõÙ Å³ÙÏ»ï³Ýó ïáÏáëÇ Ù³ñáõÙÇó' and fTYPE = 'R¸'  and fCURSUM = '262.20' and fOP = 'TXD'))"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fSTARTREM = '0.00' and ((fTYPE = 'R1' and fLASTREM = '250000.00' and fPENULTREM = '300000.00')"& _
                                         " or (fTYPE = 'R2' and fLASTREM = '5000.00' and fPENULTREM = '2621.90')"& _
                                         " or (fTYPE = 'R¸' and fLASTREM = '5000.00' and fPENULTREM = '0.00'))" 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      ' Տոկոսների խմբային հաշվարկում
      dateStart = "020421"
      cap = 0
      ext = 0
      rep = 0
      perc = 0
      perCalc = 1
      close = 0
      Call Group_Calculate(dateStart,dateStart,cap,ext,rep,perc,perCalc,close)
      BuiltIn.Delay(2000)
      wMDIClient.Refresh
      
                ' DOCS
                queryString = " SELECT COUNT(*)  FROM DOCS where fISN =  " & fISN & _
                                         " and fNAME = 'D1AS21' and fSTATE = '7' and fNEXTTRANS = '2'" 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCLOG
                queryString = " SELECT COUNT(*)  FROM DOCLOG where fISN =  " & fISN & _
                                         " and fSUIDCOR = '-1' and fSUID = '77' and fDCRID = '0' " & _
                                         " and ((fOP = 'N' and fSTATE = '1') "& _
                                         " or (fOP = 'M' and fSTATE = '99' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý') "& _
                                         " or (fOP = 'C' and fSTATE = '101') "& _
                                         " or (fOP = 'W' and fSTATE = '102') "& _
                                         " or (fOP = 'T' and fSTATE = '7')) "
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
          
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         "and fSTARTREM = '0.00' and ((fTYPE = 'R1' and fLASTREM = '250000.00' and fPENULTREM = '300000.00')" & _
                                         " or (fTYPE = 'R2' and fLASTREM = '5075.30' and fPENULTREM = '2621.90')" & _
                                         " or (fTYPE = 'R¸' and fLASTREM = '5000.00' and fPENULTREM = '0.00'))" 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      ' Տոկոսների կապիտալացում
      dateStart = "030421"
      summ = "5000"
      Call Percent_Capitalization(fCaptISN , dateStart , summ)
      Log.Message("Տոկոսների կապիտալացում փաստաթղթի ISN` " & fCaptISN)

                ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & fCaptISN & _
                                         " and fTYPE = '01' and fCUR = '000' " & _
                                         " and ((fSUM = '500.00' and fCURSUM = '500.00' and (fDBCR = 'C' or fDBCR = 'D')) " & _
                                         " or (fSUM = '5000.00' and fCURSUM = '5000.00' and (fDBCR = 'C' or fDBCR = 'D')) " & _
                                         " or (fSUM = '4500.00' and fCURSUM = '4500.00' and (fDBCR = 'C' or fDBCR = 'D')))"
                sqlValue = 6
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & fCaptISN & "and fCUR = '000'" & _
                                         "and ((fSPEC = 'îáÏáëÝ»ñÇ Ï³åÇï³É³óáõÙ' and fTYPE = 'R1' and fCURSUM = '4500.00' and fOP = 'CAP' and fDBCR = 'D')" & _
                                         " or (fSPEC = 'îáÏáëÝ»ñÇ Ï³åÇï³É³óáõÙ' and fTYPE = 'R2'  and fCURSUM = '4500.00' and fOP = 'CAP' and fDBCR = 'C')" & _
                                         " or (fSPEC = 'Ð³ñÏÇ ·³ÝÓáõÙ ïáÏáëÇ Ï³åÇï³É³óáõÙÇó' and fTYPE = 'R2'  and fCURSUM = '500.00' and fOP = 'TXC' and fDBCR = 'C')" & _
                                         " or (fSPEC = 'Ä³ÙÏ»ï³Ýó ïáÏáëÇ Ï³åÇï³É³óáõÙ' and fTYPE = 'R¸'  and fCURSUM = '4500.00' and fOP = 'CAP' and fDBCR = 'C')" & _
                                         " or (fSPEC = 'Ð³ñÏÇ ·³ÝÓáõÙ Å³ÙÏ»ï³Ýó ïáÏáëÇ Ñ³ßí»·ñáõÙÇó' and fTYPE = 'R¸'  and fCURSUM = '500.00' and fOP = 'TXC' and fDBCR = 'C'))"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fSTARTREM = '0.00' and ((fTYPE = 'R1' and fLASTREM = '254500.00' and fPENULTREM = '250000.00')"& _
                                         " or (fTYPE = 'R2' and fLASTREM = '75.30' and fPENULTREM = '5075.30')"& _
                                         " or (fTYPE = 'R¸' and fLASTREM = '0.00' and fPENULTREM = '5000.00'))" 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      ' Տոկոսների հաշվարկում
      dateStart = "020521"
      percentMoney = "2,299.60"
      Call PercentCalculation(dateStart, dateStart, percentMoney, calcfISN )
      Log.Message("Տոկոսների հաշվարկում փաստաթղթի ISN` " & calcfISN)
      
                ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & calcfISN & _
                                         " and fTYPE = '01' and fCUR = '000' and fCURSUM = '2299.60'" & _
                                         " and fSUM = '2299.60'  and (fDBCR = 'C' or fDBCR = 'D') " 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & calcfISN & _
                                         " and fCUR = '000'  and fDBCR = 'D'" & _
                                         " and ((fSPEC = 'îáÏáëÇ Ñ³ßí³ñÏáõÙ' and fTYPE = 'R2' and fCURSUM = '2299.60' and fOP = 'PER')" & _
                                         " or (fSPEC = 'Ä³ÙÏ»ï³Ýó ïáÏáëÇ Ó¨³íáñáõÙ' and fTYPE = 'R¸'  and fCURSUM = '2374.90' and fOP = 'PRJ'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fSTARTREM = '0.00' and ((fTYPE = 'R1' and fLASTREM = '254500.00' and fPENULTREM = '250000.00')"& _
                                         " or (fTYPE = 'R2' and fLASTREM = '2374.90' and fPENULTREM = '75.30')"& _
                                         " or (fTYPE = 'R¸' and fLASTREM = '2374.90' and fPENULTREM = '0.00'))" 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIT
                queryString = " SELECT COUNT(*)  FROM HIT where fBASE =  " & calcfISN & _
                                         " and fTYPE = 'N2' and fCUR = '000' and fCURSUM = '2299.60'"& _
                                         " and fOP = 'PER' and fDBCR = 'D' and fSUID = '77' and fSPEC = 'Îáõï³ÏáõÙ'" 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      ' Պարտքերի մարում
      dateStart = "030521"
      mainSum = ""
      perSum = "12,374.90"
      Call Debt_Repayment(debtRepayISN, dateStart, mainSum, perSum, cashORno, perAcc, docNum, tabN)
      Log.Message("Պարտքերի մարում փաստաթղթի ISN` " & debtRepayISN) 
      
                ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & debtRepayISN & _
                                         " and fTYPE = '01' and fCUR = '000'" & _
                                         " and ((fSUM = '1237.50' and fCURSUM = '1237.50' and (fDBCR = 'C' or fDBCR = 'D'))" & _
                                         " or (fSUM = '2374.90' and fCURSUM = '2374.90' and (fDBCR = 'C' or fDBCR = 'D'))" & _
                                         " or (fSUM = '10000.00' and fCURSUM = '10000.00' and (fDBCR = 'C' or fDBCR = 'D')))" 
                sqlValue = 6
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & debtRepayISN & _
                                         " and fCUR = '000'  and fDBCR = 'C'" & _
                                         " and ((fSPEC = 'îáÏáëÇ Ù³ñáõÙ' and fTYPE = 'R2' and fCURSUM = '11137.40' and fOP = 'DBT')" & _
                                         " or (fSPEC = 'Ð³ñÏÇ ·³ÝÓáõÙ ïáÏáëÇ Ù³ñáõÙÇó' and fTYPE = 'R2'  and fCURSUM = '1237.50' and fOP = 'TXD')" & _
                                         " or (fSPEC = 'Ä³ÙÏ»ï³Ýó ïáÏáëÇ Ù³ñáõÙ' and fTYPE = 'R¸'  and fCURSUM = '2374.90' and fOP = 'DBT'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fSTARTREM = '0.00' and ((fTYPE = 'R1' and fLASTREM = '254500.00' and fPENULTREM = '250000.00')"& _
                                         " or (fTYPE = 'R2' and fLASTREM = '-10000.00' and fPENULTREM = '2374.90')"& _
                                         " or (fTYPE = 'R¸' and fLASTREM = '0.00' and fPENULTREM = '0.00'))" 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
      BuiltIn.Delay(1000)
      wMDIClient.Refresh
      
       ' Տոկոսների հաշվարկում
      dateStart = "030521"
      percentMoney = "76.70"
      Call PercentCalculation(dateStart, dateStart, percentMoney, calcfISN )
      Log.Message("Տոկոսների հաշվարկում փաստաթղթի ISN` " & calcfISN)
      
                ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & calcfISN & _
                                         " and fTYPE = '01' and fCUR = '000' and fSUM = '76.70' and fCURSUM = '76.70'"& _
                                         " and (fDBCR = 'C' or fDBCR = 'D') "& _
                                         " and (fSPEC = '                         îáÏáëÇ Ñ³ßí³ñÏáõÙ                 1     1.0000    1' "& _
                                         " or fSPEC = '                         îáÏáëÇ Ñ³ßí³ñÏáõÙ                 0     1.0000    1')" 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & calcfISN & _
                                         " and fCUR = '000'  and fDBCR = 'D'" & _
                                         " and fSPEC = 'îáÏáëÇ Ñ³ßí³ñÏáõÙ' and fTYPE = 'R2' and fCURSUM = '76.70' and fOP = 'PER'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fSTARTREM = '0.00'"& _
                                         " and ((fTYPE = 'R1' and fLASTREM = '254500.00' and fPENULTREM = '250000.00')"& _
                                         " or (fTYPE = 'R2' and fLASTREM = '-9923.30' and fPENULTREM = '2374.90')"& _
                                         " or (fTYPE = 'R¸' and fLASTREM = '0.00' and fPENULTREM = '0.00'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIT
                queryString = " SELECT COUNT(*)  FROM HIT where fBASE =  " & calcfISN & _
                                         " and fTYPE = 'N2' and fCUR = '000' and fCURSUM = '76.70' "& _
                                         " and fOP = 'PER' and fDBCR = 'D' and fSUID = '77' and fSPEC = 'Îáõï³ÏáõÙ'" 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
                ' HIF
                queryString = " SELECT COUNT(*)  FROM HIF where fBASE =  " & calcfISN & _
                                         " and fTYPE = 'N0' and fTRANS = '1'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      '  Գումարի մարում տոկոսների հաշվին
      param = c_FadeDepFromPercent
      dateStart = "050521"
      summ = "5000"
      rekvName = "RETSUMMTAX"
      Call Fadeing_LeasingSumma_From_PayedPercents(param, dateStart, rekvName, summ)
      
      ' Ստանալ Գումարի մարում տոկոսների հաշվին թաստաթղթի ISN-ը
      paramN = c_OpersView
      status = False
      Call GetDocISN(paramN, dateStart, status, dateType, fedSummISN)
      Log.Message("Տոկոսների հաշվարկում փաստաթղթի ISN` " & fedSummISN)
      
                 ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & fedSummISN & _
                                         " and fTYPE = '01' and fCUR = '000' "& _
                                         " and ((fSUM = '500.00' and fCURSUM = '500.00' and (fDBCR = 'C' or fDBCR = 'D')) "& _
                                         " or (fSUM = '4500.00' and fCURSUM = '4500.00' and (fDBCR = 'C' or fDBCR = 'D')))"
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & fedSummISN & " and fCUR = '000' "& _
                                         " and ((fSPEC = '²í³Ý¹Ç Ù³ñáõÙ ïáÏáëÝ»ñÇ Ñ³ßíÇÝ' and fTYPE = 'R1' and fCURSUM = '4500.00' and fOP = 'RTP' and fDBCR = 'C')"& _
                                         " or (fSPEC = '²í³Ý¹Ç Ù³ñáõÙ ïáÏáëÝ»ñÇ Ñ³ßíÇÝ' and fTYPE = 'R2' and fCURSUM = '4500.00' and fOP = 'RTP' and fDBCR = 'D')"& _
                                         " or (fSPEC = 'Ð³ñÏ³ÛÇÝ í×³ñÇ í»ñ³¹³ñÓ' and fTYPE = 'R2' and fCURSUM = '500.00' and fOP = 'TXR' and fDBCR = 'D'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fSTARTREM = '0.00' and ((fTYPE = 'R1' and fLASTREM = '250000.00' and fPENULTREM = '254500.00')"& _
                                         " or (fTYPE = 'R2' and fLASTREM = '-4923.30' and fPENULTREM = '-9923.30')"& _
                                         " or (fTYPE = 'R¸' and fLASTREM = '0.00' and fPENULTREM = '0.00'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      ' Տոկոսների խմբային հաշվարկում
      dateStart = "010621"
      cap = 0
      ext = 0
      rep = 0
      perc = 0
      perCalc = 1
      close = 0
      Call Group_Calculate(dateStart,dateStart,cap,ext,rep,perc,perCalc,close)

      BuiltIn.Delay(1000)
      wMDIClient.Refresh
      
                ' DOCS
                queryString = " SELECT COUNT(*)  FROM DOCS where fISN =  " & fISN & _
                                         " and fNAME = 'D1AS21' and fSTATE = '7' and fNEXTTRANS = '2'" 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' DOCLOG
                queryString = " SELECT COUNT(*)  FROM DOCLOG where fISN =  " & fISN & _
                                         " and fSUIDCOR = '-1' and fSUID = '77' " & _
                                         " and ((fOP = 'N' and fSTATE = '1')" & _
                                         " or (fOP = 'M' and fSTATE = '99' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý')" & _
                                         " or (fOP = 'C' and fSTATE = '101')" & _
                                         " or (fOP = 'W' and fSTATE = '102')" & _
                                         " or (fOP = 'T' and fSTATE = '7')" & _
                                         " or (fOP = 'M' and fSTATE = '7' and fCOM = '3 Ï³ñ·Ç ³ñ·»Éí³Í ·áñÍáÕáõÃÛáõÝ'))"
                sqlValue = 6
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
          
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fSTARTREM = '0.00'  and ((fTYPE = 'R1' and fLASTREM = '250000.00' and fPENULTREM = '254500.00')" & _
                                         " or (fTYPE = 'R2' and fLASTREM = '-2737.00' and fPENULTREM = '-4923.30')" & _
                                         " or (fTYPE = 'R¸' and fLASTREM = '0.00' and fPENULTREM = '0.00')) "
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
      ' Տոկոսների հաշվարկում
      dateStart = "020621"
      percentMoney = "75.30"
      Call PercentCalculation(dateStart, dateStart, percentMoney, calcfISN )
      Log.Message("Տոկոսների հաշվարկում փաստաթղթի ISN` " & calcfISN)
      
                ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & calcfISN & _
                                         " and fTYPE = '01' and fCUR = '000' and fOP = 'PRC'" & _
                                         " and fSUM = '75.30' and fCURSUM = '75.30' and (fDBCR = 'C' or fDBCR = 'D') "
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & calcfISN & _
                                         " and fCUR = '000'  and fDBCR = 'D'and fSPEC = 'îáÏáëÇ Ñ³ßí³ñÏáõÙ' "& _
                                         " and fTYPE = 'R2' and fCURSUM = '75.30' and fOP = 'PER'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fSTARTREM = '0.00'  and ((fTYPE = 'R1' and fLASTREM = '250000.00' and fPENULTREM = '254500.00')"& _
                                         " or (fTYPE = 'R2' and fLASTREM = '-2661.70' and fPENULTREM = '-2737.00')"& _
                                         " or (fTYPE = 'R¸' and fLASTREM = '0.00' and fPENULTREM = '0.00'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIT
                queryString = " SELECT COUNT(*)  FROM HIT where fBASE =  " & calcfISN & _
                                         " and fTYPE = 'N2' and fCUR = '000' and fCURSUM = '75.30'"& _
                                         " and fOP = 'PER' and fDBCR = 'D' and fSUID = '77' and fSPEC = 'Îáõï³ÏáõÙ'" 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If

      ' Կանխավ վճարված տոկոսների վերադարձ
      dateStart = "050621"
      summ = "2,661.70"
      state = True
      Call Return_Payed_Percent(dateStart, summ,cashORno,perAcc,retIntPaidISN, state)
      Log.Message("Կանխավ վճարված տոկոսների վերադարձ փաստաթղթի ISN` " & retIntPaidISN)
      
                ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & retIntPaidISN & _
                                         " and fTYPE = '01' and fCUR = '000' and fOP = 'MSC'"& _
                                         " and ((fSUM = '266.20' and fCURSUM = '266.20' and (fDBCR = 'C' or fDBCR = 'D'))"& _
                                         " or (fSUM = '2395.50' and fCURSUM = '2395.50' and (fDBCR = 'C' or fDBCR = 'D'))) "
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & retIntPaidISN & _
                                         " and fCUR = '000'  and fDBCR = 'D'"& _
                                         " and ((fSPEC = 'Î³ÝË³í í×³ñí³Í ïáÏáëÇ í»ñ³¹³ñÓ' and fTYPE = 'R2' and fCURSUM = '2395.50' and fOP = 'RET')"& _
                                         " or (fSPEC = 'Ð³ñÏ³ÛÇÝ í×³ñÇ í»ñ³¹³ñÓ' and fTYPE = 'R2' and fCURSUM = '266.20' and fOP = 'TXR'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fSTARTREM = '0.00' and ((fTYPE = 'R1' and fLASTREM = '250000.00' and fPENULTREM = '254500.00')"& _
                                         " or (fTYPE = 'R2' and fLASTREM = '0.00' and fPENULTREM = '-2661.70')"& _
                                         " or (fTYPE = 'R¸' and fLASTREM = '0.00' and fPENULTREM = '0.00'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      ' Քաղվածքի դիտում
       Set ContractStatement = New_DepositContractStatement()
      With ContractStatement
          .wAction = c_References & "|" & c_Statement
          .frstDate = "010321"
          .lastDate = "050621"
          .giveState = "2"
          .showChrg = 1
          .showGrOper = 1
          .showTerms = 1
          .showInner = 1
          .stateTimeOut = "90"
      End With
      
      Call Fill_DepositContractStatement(ContractStatement)
      BuiltIn.Delay(3000)
      
      If wMDIClient.WaitVBObject("FrmSpr", 3000).Exists  Then
      
          ' Ֆայլի ջնջում
          fileName1 = "\\host2\Sys\Testing\Deposit\Act_ContractStatement.txt"
          aqFile.Delete(fileName1)
      
          savePath = "\\host2\Sys\Testing\Deposit\"
          fName = "Act_ContractStatement.txt"
          fileName2 = "\\host2\Sys\Testing\Deposit\Exp_ContractStatement.txt"

          ' Հիշել քաղվածքը
          Call SaveDoc(savePath, fName)

          ' Ամսաթվերի բացառում
          param = "([0-9][0-9][:][0-9][0-9])|([0-9]{2}[/][0-9]{2}[/][0-9]{2}).[0-9] [0-9]{2}[:][0-9]{2}|([0-9]{2}[/][0-9]{2}[/][0-9]{2})|([A][-][0][0][0-9][0-9][0-9][0-9])|([N][ ][ ][ ][0-9][0-9][0-9])"
          
          ' Ֆայլերի համեմատում 
          Call Compare_Files(fileName2, fileName1, param)
          wMDIClient.VBObject("FrmSpr").Close
     
      Else
            Log.Error("Պայմանագրի քաղվածք պատուհանը չի բացվել")
      End If
      
      ' Տոկոսների հաշվարկում
      dateStart = "010721"
      percentMoney = "2,185.00"
      Call PercentCalculation(dateStart, dateStart, percentMoney, calcfISN )
      Log.Message("Տոկոսների հաշվարկում փաստաթղթի ISN` " & calcfISN)
      
                ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & calcfISN & _
                                         " and fTYPE = '01' and fCUR = '000' and fOP = 'PRC'"& _
                                         " and fSUM = '2185.00' and fCURSUM = '2185.00' and (fDBCR = 'C' or fDBCR = 'D')" 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & calcfISN & _
                                         " and fCUR = '000'  and fDBCR = 'D' and fCURSUM = '2185.00'"& _
                                         " and ((fSPEC = 'îáÏáëÇ Ñ³ßí³ñÏáõÙ' and fTYPE = 'R2'  and fOP = 'PER')"& _
                                         " or (fSPEC = 'Ä³ÙÏ»ï³Ýó ïáÏáëÇ Ó¨³íáñáõÙ' and fTYPE = 'R¸' and fOP = 'PRJ'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fSTARTREM = '0.00' and ((fTYPE = 'R1' and fLASTREM = '250000.00' and fPENULTREM = '254500.00')"& _
                                         " or (fTYPE = 'R2' and fLASTREM = '2185.00' and fPENULTREM = '0.00')"& _
                                         " or (fTYPE = 'R¸' and fLASTREM = '2185.00' and fPENULTREM = '0.00'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIT
                queryString = " SELECT COUNT(*)  FROM HIT where fBASE =  " & calcfISN & _
                                         " and fTYPE = 'N2' and fCUR = '000' and fCURSUM = '2185.00'"& _
                                         " and fOP = 'PER' and fDBCR = 'D' and fSUID = '77' and fSPEC = 'Îáõï³ÏáõÙ'" 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
                ' HIF
                queryString = " SELECT COUNT(*)  FROM HIF where fBASE =  " & calcfISN & _
                                         " and fTYPE = 'N0' and fTRANS = '1' and fOP = 'DTC' and fSUM = '0.00' and fSUM = '0.00'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
      ' Տոկոսների հաշվարկում
      dateStart = "020721"
      percentMoney = "75.30"
      Call PercentCalculation(dateStart, dateStart, percentMoney, calcfISN )
      Log.Message("Տոկոսների հաշվարկում փաստաթղթի ISN` " & calcfISN)
      
                ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & calcfISN & _
                                         " and fTYPE = '01' and fCUR = '000' and fOP = 'PRC'"& _
                                         " and fSUM = '75.30' and fCURSUM = '75.30' and (fDBCR = 'C' or fDBCR = 'D')" 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & calcfISN & _
                                         " and fCUR = '000'  and fDBCR = 'D' and fCURSUM = '75.30'"& _
                                         " and fSPEC = 'îáÏáëÇ Ñ³ßí³ñÏáõÙ' and fTYPE = 'R2'  and fOP = 'PER'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fSTARTREM = '0.00' and ((fTYPE = 'R1' and fLASTREM = '250000.00' and fPENULTREM = '254500.00')"& _
                                         " or (fTYPE = 'R2' and fLASTREM = '2260.30' and fPENULTREM = '2185.00')"& _
                                         " or (fTYPE = 'R¸' and fLASTREM = '2185.00' and fPENULTREM = '0.00'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIT
                queryString = " SELECT COUNT(*)  FROM HIT where fBASE =  " & calcfISN & _
                                         " and fTYPE = 'N2' and fCUR = '000' and fCURSUM = '75.30'"& _
                                         " and fOP = 'PER' and fDBCR = 'D' and fSUID = '77' and fSPEC = 'Îáõï³ÏáõÙ'" 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
                ' HIF
                queryString = " SELECT COUNT(*)  FROM HIF where fBASE =  " & calcfISN & _
                                         " and fTYPE = 'N0' and fTRANS = '1' and (fOP = 'DTC' or fOP = 'PRJ') and fSUM = '0.00' and fSUM = '0.00'"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      ' Պարտքերի մարում
      dateStart = "030721"
      mainSum = "250000"
      perSum = "2,260.30"
      Call Debt_Repayment(debtRepayISN, dateStart, mainSum, perSum, cashORno, perAcc, docNum,tabN)
      Log.Message("Պարտքերի մարում փաստաթղթի ISN` " & debtRepayISN) 
      
               ' HI
                queryString = " SELECT COUNT(*)  FROM HI where fBASE =  " & debtRepayISN & _
                                         " and fTYPE = '01' and fCUR = '000' and fOP = 'MSC'"& _
                                         " and ((fSUM = '226.00' and fCURSUM = '226.00' and (fDBCR = 'C' or fDBCR = 'D'))"& _
                                         " or (fSUM = '250000.00' and fCURSUM = '250000.00' and (fDBCR = 'C' or fDBCR = 'D'))"& _
                                         " or (fSUM = '2260.30' and fCURSUM = '2260.30' and (fDBCR = 'C' or fDBCR = 'D')))" 
                sqlValue = 6
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*)  FROM HIR where fBASE =  " & debtRepayISN & _
                                         " and fCUR = '000'  and fDBCR = 'C'"& _
                                         " and ((fSPEC = '²í³Ý¹Ç Ù³ñáõÙ' and fTYPE = 'R1'  and fOP = 'DBT' and fCURSUM = '250000.00')"& _
                                         " or (fSPEC = 'îáÏáëÇ Ù³ñáõÙ' and fTYPE = 'R2'  and fOP = 'DBT' and fCURSUM = '2034.30')"& _
                                         " or (fSPEC = 'Ð³ñÏÇ ·³ÝÓáõÙ ïáÏáëÇ Ù³ñáõÙÇó' and fTYPE = 'R2'  and fOP = 'TXD' and fCURSUM = '226.00')"& _
                                         " or (fSPEC = 'Ä³ÙÏ»ï³Ýó ïáÏáëÇ Ù³ñáõÙ' and fTYPE = 'R¸'  and fOP = 'DBT' and fCURSUM = '2034.30')"& _
                                         " or (fSPEC = 'Ð³ñÏÇ ·³ÝÓáõÙ Å³ÙÏ»ï³Ýó ïáÏáëÇ Ù³ñáõÙÇó' and fTYPE = 'R¸'  and fOP = 'TXD' and fCURSUM = '150.70'))"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIRREST
                queryString = " SELECT COUNT(*)  FROM HIRREST where fOBJECT =  " & fISN & _
                                         " and fSTARTREM = '0.00' and fLASTREM = '0.00'"& _
                                         " and ((fTYPE = 'R1' and fPENULTREM = '250000.00')"& _
                                         " or (fTYPE = 'R2' and fPENULTREM = '2260.30')"& _
                                         " or (fTYPE = 'R¸' and fPENULTREM = '2185.00'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
      ' Մուտք Պայմանագրի թղթապանակ
      ' Գործողություններ / Բոլոր գործողությունները
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Մուտք Պայմանագրի թղթապանակ
      Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder )
        
      ' Գրավի պայմանագրի առկայության ստուգում  
      name = "¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í- "& DocN &"         "& contractNum
      name_len = 51
      colNum = 0
      Pttel = "_2"
      state = Find_Doc_By(name, name_len,colNum, Pttel)
    
      If state Then
            BuiltIn.Delay(3000)
            ' Փակել գրավի պայմանագիրը
            CloseDate = "100721"
            Call Close_Contract(CloseDate)
      Else
            Log.Error("Գրավի պայմանագիրն առկա չէ Պայմանագրի թղթապանակում")
      End If

      wMDIClient.VBObject("frmPttel_2").Close
      BuiltIn.Delay(7000)
      
     ' Փակել Ավանդային պայմանագիրը
      Call Close_Contract(CloseDate)
      BuiltIn.Delay(3000)
      frmPttel.Close
      BuiltIn.Delay(3000)
      
      ' Մուտք պայմանագրեր թղթապանակ
      Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
      
      ContractsFilter.ShowClosed = 1
      Call Fill_ContractsFilter(ContractsFilter)
      BuiltIn.Delay(2000)

      ' Ստուգում պայմանագիրը փակվել է թե ոչ
      colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fDATECLOSE")
      If Not frmPttel.VBObject("TDBGView").Columns.Item(colNum) = "10/07/21" Then
            Log.Error("Պայամանգիրը չի փակվել")
      End If
      
      ' Ընդհանուր դիտում 
      dateStart = "050721"
      rChng = 1
      rDeal = 1
	    datePar = "LASTDATE"
      Call OverallView(datePar, dateStart, rChng, rDeal)
      
     ' Ֆայլի ջնջում
      fileName1 = "\\host2\Sys\Testing\Deposit\Act_DepositInvolvedTwice.txt"
      aqFile.Delete(fileName1)
      
      savePath = "\\host2\Sys\Testing\Deposit\"
      fName = "Act_DepositInvolvedTwice.txt"
      fileName2 = "\\host2\Sys\Testing\Deposit\Exp_DepositInvolvedTwice.txt"

      ' Հիշել քաղվածքը
      Call SaveDoc(savePath, fName)

      ' Ամսաթվերի բացառում
      param = "([0-9][0-9][:][0-9][0-9])|([0-9]{2}[/][0-9]{2}[/][0-9]{2}).[0-9] [0-9]{2}[:][0-9]{2}|([0-9]{2}[/][0-9]{2}[/][0-9]{2})|([A][-][0][0][0-9][0-9][0-9][0-9])|([N][ ][ ][ ][0-9][0-9][0-9])"
      
      ' Ֆայլերի համեմատում 
      Call Compare_Files(fileName2, fileName1, param)
      
      wMDIClient.VBObject("FrmSpr").Close

      ' Բացել պայմանագիրը
      Set Overdraft = New_Overdraft()
      Overdraft.OpenAgr()
      
      ' Ստուգում պայմանագիրը բացվել է թե ոչ
      If Not Trim(frmPttel.VBObject("TDBGView").Columns.Item(colNum)) = Trim("/  /") Then
            Log.Error("Պայամանգիրը չի բացվել")
      End If
      
      ' Ջնջել փաստաթղթերը
      param = c_ViewEdit  & "|" & c_Other  & "|" & c_CalcDates
      dateGive = "100721"
      status = False
      Call DeleteActionOverdraft(param, dateGive, dateGive, status, dateType ) 
      
      param = c_OpersView
      dateGive = "030721"
      Call DeleteActionOverdraft(param, dateGive, dateGive, status, dateType ) 
      
      dateGive = "020721"
      Call Delete_Actions(dateGive, dateGive, status, dateType, param)
      
      dateGive = "050621"
      Call Delete_Actions(dateGive, dateGive, status, dateType, param)
      
      dateGive = "020621"
      Call Delete_Actions(dateGive, dateGive, status, dateType, param)
      
      dateGive = "010621"
      Call Delete_Actions(dateGive, dateGive, status, dateType, param)
      
      dateGive = "050521"
      Call Delete_Actions(dateGive, dateGive, status, dateType, param)
      
      Call wMainForm.MainMenu.Click(c_AllActions)
     Call wMainForm.PopupMenu.Click(c_OpersView)
     
     dateGive = "030521"
     ' Լրացնում է սկզբնաժամկետ դաշտը
     Call Rekvizit_Fill("Dialog",1,"General","START","![End]" & "[Del]" & dateGive)
     ' Լրացնում է վերջնաժամկետ դաշտը
     Call Rekvizit_Fill("Dialog",1,"General","END","![End]" & "[Del]" & dateGive)

     Call ClickCmdButton(2, "Î³ï³ñ»É")
     BuiltIn.Delay(1000)
      
      Call SearchAndDelete( "frmPttel_2", 5, "îáÏáëÇ Ñ³ßí³ñÏáõÙ", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ" )
      wMDIClient.VBObject("frmPttel_2").Close
      BuiltIn.Delay(1000)
      
     Call wMainForm.MainMenu.Click(c_AllActions)
     Call wMainForm.PopupMenu.Click(c_OpersView)
     ' Լրացնում է սկզբնաժամկետ դաշտը
     Call Rekvizit_Fill("Dialog",1,"General","START","![End]" & "[Del]" & dateGive)
     ' Լրացնում է վերջնաժամկետ դաշտը
     Call Rekvizit_Fill("Dialog",1,"General","END","![End]" & "[Del]" & dateGive)

     Call ClickCmdButton(2, "Î³ï³ñ»É")
     BuiltIn.Delay(1000)
      
      Call SearchAndDelete( "frmPttel_2", 5, "Ð³ñÏÇ ·³ÝÓáõÙ ïáÏáëÇ Ù³ñáõÙÇó", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ" )
      wMDIClient.VBObject("frmPttel_2").Close
      
      Call DeleteActionOverdraft(param, dateGive, dateGive, status, dateType ) 
      
      BuiltIn.Delay(1000)
      
     Call wMainForm.MainMenu.Click(c_AllActions)
     Call wMainForm.PopupMenu.Click(c_OpersView)
     ' Լրացնում է սկզբնաժամկետ դաշտը
     Call Rekvizit_Fill("Dialog",1,"General","START","![End]" & "[Del]" & "030321")
     ' Լրացնում է վերջնաժամկետ դաշտը
     Call Rekvizit_Fill("Dialog",1,"General","END","![End]" & "[Del]" & "010821")
     Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)
      
      Call wMainForm.MainMenu.Click(c_Editor & "|" & c_MarkAll)
      BuiltIn.Delay(1000)
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_GroupDel)
      
      If  MessageExists(2, "Ð³ëï³ï»ù ·áñÍáÕáõÃÛáõÝÝ»ñÇ ËÙµ³ÛÇÝ Ñ»é³óáõÙÁ/çÝçáõÙÁ") Then
            Call ClickCmdButton(5, "²Ûá")  
      End If
      If  MessageExists(1, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") Then
            Call ClickCmdButton(3, "²Ûá")
      End If
      
      BuiltIn.Delay(3000)
      wMDIClient.VBObject("frmPttel_2").Close
      
      ' Ջնջել Գրավի պայմանագիրը
      pladgeNumber = "¶ñ³íÇ å³ÛÙ³Ý³·Çñª ²ÛÉ ·ñ³í- "& DocN &"         "& contractNum &"       [ö³Ïí³Í]"
      Call DelTermsDoc(pladgeNumber)
     
      ' Ջնջել պայամանգիրը
      Call DelDoc()
      
      ' Փակել ծրագիրը
      Call Close_AsBank()
      
End Sub