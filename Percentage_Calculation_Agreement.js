Option Explicit
'USEUNIT  Percentage_Calculation_Library
'USEUNIT  Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT BankMail_Library
'USEUNIT Clients_Library
'USEUNIT Debit_Dept_Library
'USEUNIT Akreditiv_Library
'USEUNIT Mortgage_Library

'Test Case ID 137742

' Գործողությունների կտարում Տոկոսների հաշվարկաման պայմանագրի նկատմամբ
Sub Percentage_Calculation_Agreement_Test()

      Dim fDATE, sDATE
      
      Dim direction, scaleISN, wScale, wName, wPrice, wPercent, wDay, wPrice2, wPercent2, wDay2, wPrice3, wPercent3, wDay3, _
              wAPR, dayClcType, scaleType, prcCalcType, permBalCheck, permBalDays, permBalSum, permSumInAMD, _ 
              modSumCalc, modSumm, modRemPerc, modRemPercSect
              
      Dim status, perCalcISN, wAcc, balance, wCur, standContract, autoFill, wSumma, accAccount, accSource, stDate, endDate, _
              eCalcDate, dateClose, intDate, capitMonth, capitDay, capitLastDate, intComm, intAcc, intAccCur, _
              taxAcc, taxValue, groupCode, repCode, comment, intRateType, changMonth, changDay, n16AccType
              
       Dim colN, action, doNum, doActio, state, folderDirect, folderName, rekvName, wFrmPttel, wMainForm
       
       Dim wAction, wOffice, wSecton, calcDate, formulDate, wComment, intRecalcfISN, reCalcDocN, percfISN
       
       Dim CaptDocN, CalcCapitISN, calcDocN, CalcISN, scaleISN2, wScale2, doAction, opMainAcc, opOtherAcc
       
       Dim chngDate, changScale, notCalcIntRep, newSum, newStDate, newEDate, acsBranch, acsSection, acsType
       
       Dim wCode, fISNst, wEName, onlySpecRep, wSrok, wSrokDay, wPeriod, calcDays, hpAcc, hType, wNote, _
               wNote2, wNote3, autoAcc, accNotes, inhertOffice, inhertDep, inhertType, hTypeAcc, hpAccAcc,_
               resTypeAcc, incExpAcc, contWithCustom, wOfficeAcc, wSectionAcc, accTyeAcc, wNoteAcc, wNote2Acc,_
               wNote3Acc, wNote2Corr, wNote3Corr,wSection, accType, autoSourc, srcNotes, srcInDiv, srcInDep, srcInType, _
               hTypeCorr2, hpAccCorr2, resTypeCorr2, incExpCorr2, contWithCustCorr2, wOfficeCorr2, accTyeCorr2, wNoteCorr2, _
               wNote2Corr2, wNote3Corr2, intOnSelf, cliAMDAcc, reFillAcc, autoIntAcc, intNotes, intInhertDiv, intInhertDep, _
               intInhertType, hTypeCapt, hpAccCapt, resTypeCapt, incExpCapt, contWithCustCapt, wOfficeCapt, wSectionCapt, _
               accTyeCapt, wNoteCapt, wNote2Capt, wNote3Capt, calcTex, wGroup, pcBaseType, chngPer
               
       Dim fISN, coaNum, balAcc, wType, accAcbBranch, inhOfficefromAcc, inhSectfromAcc, accAcsType, _
                baseType, fromOptType, capitISN, capitDocNum, actionType, reCalcISN, reCalcDocNum
                
       Dim ignorDate, ignorCalc,ignorAmount, closeAcc, closeAccum, doInt, capitDocNum2, capitISN2
       
       Dim queryString, sqlValue, colNum, sql_isEqual, param, dateGive, eDate, dateAgr
       
      fDATE = "20250101"
      sDATE = "20120101"
      Call Initialize_AsBank("bank", sDATE, fDATE)
      
      ' Մուտք գործել համակարգ ARMSOFT օգտագործողով 
      Call Create_Connection()

      Login("ARMSOFT")
      
      ' Մուտք Տոկոսների հաշվարկման ԱՇՏ
      Call ChangeWorkspace(c_PercentCalc)
      ' Սանդղակ փաստաթղթի ստեղծում
      direction = "|îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ²Þî|Üáñ ë³Ý¹Õ³Ï"
      wName = "AMD"
      wPrice = "100000"
      wPercent = "2"
      wDay = "365"
      wPrice2 = "500000"
      wPercent2 = "4"
      wPrice3 = "1000000"
      wPercent3 = "5"
      wAPR = "5"
      dayClcType = "1"
      scaleType = "2"
      prcCalcType = "1"
      permBalCheck = 1
      permBalDays= "365"
      permBalSum = "10000"
      permSumInAMD = 1
      modSumCalc = 1
      modSumm = "500000"
      modRemPerc = "3"
      modRemPercSect = "365"
      Call CreateScale(direction,  scaleISN, wScale, wName, wPrice, wPercent, wDay, wPrice2, wPercent2, wDay, wPrice3, wPercent3, wDay, _
               wAPR, dayClcType, scaleType, prcCalcType, permBalCheck, permBalDays, permBalSum, permSumInAMD, _ 
               modSumCalc, modSumm, modRemPerc, modRemPercSect )
               
      Log.Message("Սանդղակի ISN ` " & scaleISN)
      Log.Message("Սանդղակի համարը՝ " & wScale)
      
      ' SQL ստուգում
                        
              'DOCS
              queryString = "select COUNT(*) from DOCS where fISN = " & scaleISN & " and fNAME = 'SCALE' and fBODY = '" & vbCRLF _ 
                                      & "CODE:"& wScale & vbCRLF _ 
                                      & "NAME:AMD" & vbCRLF _ 
                                      &  "APR:5" & vbCRLF _ 
                                      &  "DAYCLCTP:1" & vbCRLF _ 
                                      &  "SCALETP:2" & vbCRLF _ 
                                      &  "PRCCLCTP:1" & vbCRLF _ 
                                      &  "PERMBALCHCK:1" & vbCRLF _ 
                                      &  "PERMBALDAYS:365" & vbCRLF _ 
                                      &  "PERMBALSUM:10000" & vbCRLF _ 
                                      &  "PERMSUMINAMD:1" & vbCRLF _ 
                                      &  "MODSUMCALC:1" & vbCRLF _ 
                                      &  "MODSUMM:500000" & vbCRLF _ 
                                      &  "MODREMPERC:3.0000/365"  & vbCRLF _ 
                                      & "'"

              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' TREES
              queryString = "select COUNT(*)  from TREES where fCODE = '"& wScale &"' and fNAME = 'AMD' and fISN =" & scaleISN & "  and fDOCTYPE = 'SCALE' "

              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
      ' Սանդղակ փաստաթղթի ստեղծում
      direction = "|îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ²Þî|Üáñ ë³Ý¹Õ³Ï"
      wPrice2 = "250000"
      wPercent2 = "3"
      wAPR = "4"
      permBalDays= "365"
      permBalSum = "20000"
      modSumm = "400000"
      Call CreateScale(direction,  scaleISN2, wScale2, wName, wPrice, wPercent, wDay, wPrice2, wPercent2, wDay, wPrice3, wPercent3, wDay, _
               wAPR, dayClcType, scaleType, prcCalcType, permBalCheck, permBalDays, permBalSum, permSumInAMD, _ 
               modSumCalc, modSumm, modRemPerc, modRemPercSect )
               
      Log.Message("Սանդղակի ISN ` " & scaleISN2)
      Log.Message("Սանդղակի համարը՝ " & wScale2)
      
      ' SQL ստուգում
                
              'DOCS
              queryString = "select COUNT(*) from DOCS where fISN = " & scaleISN2 & " and fNAME = 'SCALE' and fBODY = '" & vbCRLF _
                                      & "CODE:"& wScale2 & vbCRLF _
                                      & "NAME:AMD" & vbCRLF _
                                      & "APR:4" & vbCRLF _
                                      & "DAYCLCTP:1" & vbCRLF _
                                      & "SCALETP:2" & vbCRLF _
                                      & "PRCCLCTP:1" & vbCRLF _
                                      & "PERMBALCHCK:1" & vbCRLF _
                                      & "PERMBALDAYS:365" & vbCRLF _
                                      & "PERMBALSUM:20000" & vbCRLF _
                                      & "PERMSUMINAMD:1" & vbCRLF _
                                      & "MODSUMCALC:1" & vbCRLF _
                                      & "MODSUMM:400000" & vbCRLF _
                                      & "MODREMPERC:3.0000/365" & vbCRLF _
                                      & "'" 

              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' TREES
              queryString = "select COUNT(*) from TREES where fCODE = '"&wScale2&"' and fNAME = 'AMD' and fISN =" & scaleISN2 & "  and fDOCTYPE = 'SCALE' "

              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
      ' Նոր պայմանագրի ստանդարտ փաստաթղթի ստեղծում
      direction = "|îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ²Þî|Üáñ å³ÛÙ³Ý³·ñÇ ëï³Ý¹³ñï"
      wCode = "00222"
      wName = "îáÏáëÇ Ñ³ßí. å³ÛÙ³Ý³·ñÇ ëï³Ý¹³ñï"
      wEName = "Interest calc. contract standard"
      wSrok = "1"
      wSrokDay = "5"
      wPeriod = "1"
      calcDays = "1"
      hpAcc = "999999"
      hType = "01"
      wNote = "11"
      wOffice = "00"
      wSection = "1"
      accType = "01"
      accAccount = "000001100"
      accSource = "000002900"
      stDate = "010119"
      capitMonth = "1"
      capitDay = "15"
      capitLastDate = 1
      wGroup = "N09"
      repCode = "10102"
      intAcc = "000008600"
      n16AccType = "01"
      Call NewContractStandard(direction, fISNst, wCode, wName, wEName, onlySpecRep, wSrok, wSrokDay, wPeriod, wScale, wSumma, calcDays, _
                                                 hpAcc, hType, wNote, wNote2, wNote3, wOffice, wSection, accType, accAccount, autoAcc, accNotes, inhertOffice, _
                                                 inhertDep, inhertType, hTypeAcc, hpAccAcc, resTypeAcc, incExpAcc, contWithCustom, wOfficeAcc, wSectionAcc, _
                                                 accTyeAcc, wNoteAcc, wNote2Acc, wNote3Acc, hpAcc, hType, wNote, wNote2Corr, wNote3Corr, _
                                                 wOffice, wSection, accType, accSource, autoSourc, srcNotes, srcInDiv, srcInDep, srcInType, _
                                                 hTypeCorr2, hpAccCorr2, resTypeCorr2, incExpCorr2, contWithCustCorr2, wOfficeCorr2, accTyeCorr2, wNoteCorr2, _
                                                 wNote2Corr2, wNote3Corr2, stDate, capitMonth, capitDay, capitLastDate, intOnSelf, cliAMDAcc, reFillAcc, intAcc, _
                                                 autoIntAcc, intNotes, intInhertDiv, intInhertDep, intInhertType, hTypeCapt, hpAccCapt, resTypeCapt, incExpCapt, _
                                                 contWithCustCapt, wOfficeCapt, wSectionCapt, accTyeCapt, wNoteCapt, wNote2Capt, wNote3Capt, calcTex, _
                                                 wGroup, repCode, wComment, pcBaseType, chngPer, n16AccType)
                                                 
      Log.Message("Տոկեսի հաշվարկման պայմանագրի ստանդարտ fINS` " & fISNst)
      
              ' DOCS
              queryString = "select COUNT(*) from DOCS where fISN = '"& fISNst &"' and fBODY = '" & vbCRLF _
                                     & "CODE:"& wCode & vbCRLF _
                                     & "NAME:îáÏáëÇ Ñ³ßí. å³ÛÙ³Ý³·ñÇ ëï³Ý¹³ñï" & vbCRLF _
                                     & "ENAME:Interest calc. contract standard" & vbCRLF _
                                     &  "ONLYSPECREP:0" & vbCRLF _
                                     &  "SROK:1/5" & vbCRLF _
                                     &  "SPERIOD:1" & vbCRLF _
                                     &  "SCALE:"& wScale & vbCRLF _
                                     &  "CALCDAYS:1" & vbCRLF _
                                     &  "AUTOACCUM:0" & vbCRLF _
                                     &  "ACCNOTES:0" & vbCRLF _
                                     &  "ACCINHERTDIV:1" & vbCRLF _
                                     &  "ACCINHERTDEP:1" & vbCRLF _
                                     &  "ACCINHERTTYP:1" & vbCRLF _
                                     &  "AUTOSOURCE:0" & vbCRLF _
                                     &  "SRCNOTES:0" & vbCRLF _
                                     &  "SRCINHERTDIV:1" & vbCRLF _
                                     &  "SRCINHERTDEP:1" & vbCRLF _
                                     &  "SRCINHERTTYP:1" & vbCRLF _
                                     &  "INTDATE:20190101" & vbCRLF _
                                     &  "PERIODICITY:1/15" & vbCRLF _
                                     &  "INTONEND:1" & vbCRLF _
                                     &  "INTONSELF:0" & vbCRLF _
                                     &  "CLIAMDACC:0" & vbCRLF _
                                     &  "REFILLACC:0" & vbCRLF _
                                     &  "INTACC:000008600" & vbCRLF _
                                     &  "AUTOINTACC:0" & vbCRLF _
                                     &  "INTNOTES:0" & vbCRLF _
                                     &  "INTINHERTDIV:1" & vbCRLF _
                                     &  "INTINHERTDEP:1" & vbCRLF _
                                     &  "INTINHERTTYP:1" & vbCRLF _
                                     &  "CALCTAX:0" & vbCRLF _
                                     &  "GROUP:N09" & vbCRLF _
                                     &  "REPCODE:10102" & vbCRLF _
                                     &  "N16ACCTYPE:01" & vbCRLF _
                                     &  "'"

              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' FOLDERS
              queryString = "select COUNT(*) from FOLDERS where fISN = '"& fISNst &"' and fKEY = '00222'"
 
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
      Call wTreeView.DblClickItem("|îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ²Þî|ä³ÛÙ³Ý³·ñ»ñÇ ëï³Ý¹³ñïÝ»ñÇ ï»Õ»Ï³ïáõ")
      
      If p1.WaitVBObject("frmAsUstPar",2000).Exists Then
            Call ClickCmdButton(2, "Î³ï³ñ»É")
      Else
            Log.Error("Տոկեսի հաշվարկման պայմանագրի ստանդարտ դիալոգը չի բացվել")
      End If
      
      wFrmPttel = "frmPttel"
      colN = 0
      state = CheckContractDocument(wFrmPttel, colN, wCode)
      
      If Not state Then
            Log.Error("Տոկեսի հաշվարկման պայմանագրի ստանդարտն առկա չէ Տոկոսի հաշվարկման պայմանագրի ստանդարտ թղթապանակում")
      End If
      Call Close_Pttel("frmPttel")
                                                 
      ' Տոկոսի հաշվարկման պայմանագրի ստեղծում
      direction = "|îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ²Þî|Üáñ  å³ÛÙ³Ý³·Çñ"
      wAcc = "01059353313"
      endDate = "01082019"
      intComm = "test"
      taxAcc = "000006000"
      taxValue = "10"
      Call CreateInterestCalcAgreement(direction, perCalcISN, wAcc, balance, wCur, wCode, autoFill, wScale, wSumma, accAccount, accSource, stDate, endDate, _
                                                                        calcDays, eCalcDate, dateClose, stDate, capitMonth, capitDay, capitLastDate, intComm, intAcc, intAccCur, _
                                                                        reFillAcc, taxAcc, taxValue, wGroup, repCode, comment, intRateType, changMonth, changDay, n16AccType)
      
      Log.Message("Տոկոսի հաշվարկման պայմանագրի ISN` " & perCalcISN)
      BuiltIn.Delay(2000) 
      
              ' DOCS
              queryString = "select COUNT(*) from DOCS where fISN = '"& perCalcISN & "' and fBODY = '" & vbCRLF _
                                      & "ACC:01059353313" & vbCRLF _
                                      & "BALACC:3310200" & vbCRLF _
                                      & "CUR:000" & vbCRLF _
                                      & "FILLALG:00222" & vbCRLF _
                                      & "SCALE:"& wScale & vbCRLF _
                                      & "ACCUMACC:000001100" & vbCRLF _
                                      & "ACCSOURCE:000002900" & vbCRLF _
                                      & "SDATE:20190101" & vbCRLF _
                                      & "EDATE:20190801" & vbCRLF _
                                      & "CALCDAYS:1" & vbCRLF _
                                      & "INTDATE:20190101" & vbCRLF _
                                      & "PERIODICITY:1/15" & vbCRLF _
                                      & "INTONEND:1" & vbCRLF _
                                      & "INTCOMM:test" & vbCRLF _
                                      & "INTACC:000008600" & vbCRLF _
                                      & "INTACCCUR:000" & vbCRLF _
                                      & "REFILLACC:0" & vbCRLF _
                                      & "TAXACC:000006000" & vbCRLF _
                                      & "TAXVALUE:10" & vbCRLF _
                                      & "GROUP:N09" & vbCRLF _
                                      & "REPCODE:10102" & vbCRLF _
                                      & "N16ACCTYPE:01" & vbCRLF _
                                      & "'"
 
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' FOLDERS
              queryString = "select COUNT(*) from FOLDERS where fISN = '"& perCalcISN &"' and fKEY = '"& wAcc &"' "
 
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
      ' Մուտք նոր ստեղծված քարտ փաստաթղթեր թղթապանակ 
      folderDirect = "|îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ²Þî|Üáñ ëï»ÕÍí³Í ù³ñï ÷³ëï³ÃÕÃ»ñ" 
      folderName = "Նոր ստեղծված քարտ փաստաթղթեր "
      state = OpenFolderClickDo(folderDirect, folderName) 
      
      If Not state Then
          Log.Error("Նոր ստեղծված քարտ փաստաթղթեր թղթապանակը չի բացվել")
          Exit Sub
      End If
      
      ' Հաստատել Տոկոսի հաշվարկամն պայմանագիրը 
      colN = 3
      action = c_ToVerify
      doNum = 5
      doActio = "²Ûá"
      state = ConfirmContractDoc(colN, wAcc, action, doNum, doActio)
      BuiltIn.Delay(2000)
      
              ' FOLDERS
              queryString = "select COUNT(*) from FOLDERS where fISN = '"& perCalcISN &"' and fKEY = '"& wAcc &"' "
 
              sqlValue = 2
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If

      If Not state Then
            Log.Error(" Տոկոսի հաշվարկամն պայմանագիրը առկա չէ նոր ստեղծված քարտ փաստաթղթեր թղթապանակում")
            Exit Sub
      End If
      
      Call Close_Pttel("frmPttel")
          
      ' Պայմանագրի առկայության ստուգում Պայմանագրեր թղթապանակում
      folderDirect = "|îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ²Þî|ä³ÛÙ³Ý³·ñ»ñ"
      folderName = "Պայմանագրեր"
      rekvName = "ACCMASK"
      state = OpenFolder(folderDirect, folderName, rekvName, wAcc)
          
      If Not state Then
            Log.Error(" Տոկոսի հաշվարկման պայմանագիրը առկա չէ Պայմանագրեր թղթապանակում")
            Exit Sub
      End If 
      
      ' Կատարել պայմանագրի խմբային բացում
      doAction = c_GroupOpenContr
      opMainAcc = 1
      opOtherAcc = 1
      Call Contracts_Group_Close(doAction, opMainAcc, opOtherAcc, stDate)
      
      ' Տոկոսների հաշվարկ գործողության կատարում
      wAction = c_CalcPercent
      calcDate  = "010219"
      formulDate = "020219"
      wComment = "Test"
      wOffice = ""
      Call CalcPercentAndCapitalization(wAction, CalcISN, calcDocN, wOffice, wSecton, calcDate, formulDate, wComment)
      Log.Message("Տոկոսների հաշվարկ փաստաթղթի ISN` " & CalcISN)
      Log.Message("Տոկոսների հաշվարկ փաստաթղթի N` " & calcDocN)
      BuiltIn.Delay(1000)
      
              ' DOCS
              queryString = "select COUNT(*) from DOCS where fISN = '"&CalcISN&"' and fNAME = 'PercCalc'"
 
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HI
              queryString = "select COUNT(*) from HI where fBASE = "& CalcISN &_
                                       " and ((fTYPE = '01' and fSUM = '131.50' and fCURSUM = '131.50' and fOP = 'PRC' and fDBCR = 'D' ) " &_
                                       " or (fTYPE = '01' and fSUM = '131.50' and fCURSUM = '131.50' and fOP = 'PRC' and fDBCR = 'C' ) " &_
                                       " or (fTYPE = 'P1' and fSUM = '0.00' and fCURSUM = '0.00' and fOP = 'CLP' and fDBCR = 'D' ) " &_
                                       " or (fTYPE = 'P1' and fSUM = '0.00' and fCURSUM = '131.50' and fOP = 'PRC' and fDBCR = 'D' )) "

 
              sqlValue = 4
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HIREST
              queryString = "select COUNT(*) from HIREST where fOBJECT = "& perCalcISN &_
                                       " and fTYPE = 'P1' and fREM = '0.00' and fCUR = '000' and (fCURREM = '0.00' or fCURREM = '131.50')"
 
              sqlValue = 2
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' MEMORDERS
              queryString = "select COUNT(*) from MEMORDERS where fISN = '"&CalcISN&"' "
 
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
      ' Կատարել տոկոսների կապիտալացում 
      wAction = c_PercCapital
      intDate = "030219"
      wSumma = "139.70"
      Call CalcCapitalizationAndRecalc(wAction, capitISN, capitDocNum, wOffice, wSecton, acsType, actionType, intDate, intDate, wAcc, wSumma, wComment)
      Log.Message("Տոկոսների կապիտալացում փաստաթղթի ISN` " & capitISN)
      Log.Message("Տոկոսների կապիտալացում փաստաթղթի N` " & capitDocNum)
      
              ' DOCS
              queryString = "select COUNT(*) from DOCS where fISN = '"&capitISN&"' and fNAME = 'PrcReClc'"
 
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HI
              queryString = "select COUNT(*) from HI where fBASE = "& capitISN 

              sqlValue = 10
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HIREST
              queryString = "select COUNT(*) from HIREST where fOBJECT = "& perCalcISN &_
                                       "and fTYPE = 'P1' and fREM = '0.00' and fCUR = '000' and fCURREM = '0.00' "
 
              sqlValue = 2
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' MEMORDERS
              queryString = "select COUNT(*) from MEMORDERS where fISN = '"&capitISN&"' "&_
                                       "and fSUMMA = '139.70' and fCOM = 'Test' " 
 
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
      ' Կատարել տոկոսների վերահաշվարկ
      wAction = c_RecalcPercent
      intDate = "010319"
      wSumma = "106.80"
      Call CalcCapitalizationAndRecalc(wAction, reCalcISN, reCalcDocNum, wOffice, wSecton, acsType, actionType, intDate, intDate, wAcc, wSumma, wComment)
      Log.Message("Տոկոսների վերահաշվարկ փաստաթղթի ISN` " & reCalcISN)
      Log.Message("Տոկոսների վերահաշվարկ փաստաթղթի N` " & reCalcDocNum)
      BuiltIn.Delay(1000)
      
              ' DOCS
              queryString = "select COUNT(*) from DOCS where fISN = '"&reCalcISN&"' and fNAME = 'PrcReClc'"
 
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HI
              queryString = "select COUNT(*) from HI where fBASE = "& reCalcISN &_
                                       " and ((fTYPE = '01' and fSUM = '106.80' and fCURSUM = '106.80' and fOP = 'PRC' and fDBCR = 'D' ) "&_
                                       " or (fTYPE = '01' and fSUM = '106.80' and fCURSUM = '106.80' and fOP = 'PRC' and fDBCR = 'C' ) "&_
                                       " or(fTYPE = 'P1' and fSUM = '0.00' and fCURSUM = '106.80' and fOP = 'PRC' and fDBCR = 'D' ) "&_
                                       " or(fTYPE = 'P1' and fSUM = '0.00' and fCURSUM = '0.00' and fOP = 'CLP' and fDBCR = 'D' )) "

 
              sqlValue = 4
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HIREST
              queryString = "select COUNT(*) from HIREST where fOBJECT = "& perCalcISN &_
                                       " and fTYPE = 'P1' and fREM = '0.00' and fCUR = '000' and (fCURREM = '0.00' or fCURREM = '106.80')"
 
              sqlValue = 2
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' MEMORDERS
              queryString = "select COUNT(*) from MEMORDERS where fISN = '"&reCalcISN&"' "&_
                                        "and fSUMMA = '106.80' and fCOM = 'Test'"
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      

      ' Տոկոսների հաշվարկ և կապիտալացում գործողության կատարում
      wAction = c_CalcPercAndCapit
      calcDate = "010419"
      Call CalcPercentAndCapitalization(wAction, CalcCapitISN, CaptDocN, wOffice, wSecton, calcDate, calcDate, wComment)
      Log.Message("Տոկոսների հաշվարկ և կապիտալացում փաստաթղթի ISN` " & CalcCapitISN)
      Log.Message("Տոկոսների հաշվարկ և կապիտալացում փաստաթղթի N` " & CaptDocN)
      BuiltIn.Delay(1000)
      
              ' DOCS
              queryString = "select COUNT(*) from DOCS where fISN = '"&CalcCapitISN&"' and fNAME = 'PercCalc'"
 
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HI
              queryString = "select COUNT(*) from HI where fBASE = "& CalcCapitISN &_
                                       " and ((fTYPE = '01' and fSUM = '127.40' and fCURSUM = '127.40' and fOP = 'PRC' and fDBCR = 'D' ) "&_
                                       " or (fTYPE = '01' and fSUM = '127.40' and fCURSUM = '127.40' and fOP = 'PRC' and fDBCR = 'C' ) " &_
                                       " or(fTYPE = 'P1' and fSUM = '0.00' and fCURSUM = '0.00' and fOP = 'CLP' and fDBCR = 'D' ) "&_
                                       " or(fTYPE = 'P1' and fSUM = '0.00' and fCURSUM = '127.40' and fOP = 'PRC' and fDBCR = 'D' )) "

 
              sqlValue = 4
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HIREST
              queryString = "select COUNT(*) from HIREST where fOBJECT = "& perCalcISN &_
                                       " and fTYPE = 'P1' and fREM = '0.00' and fCUR = '000' and (fCURREM = '0.00' or fCURREM = '234.20')"
 
              sqlValue = 2
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' MEMORDERS
              queryString = "select COUNT(*) from MEMORDERS where fISN = '"&CalcCapitISN&"' "&_
                                        "and fSUMMA = '0.00' and fCOM = 'Test' "
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
               
      ' Սանդղակի խմբային խմբագրում գործողության կատարում
      endDate = ""
      stDate = ""
      chngDate = "010519"
      Call ScaleOrAmountGroupEditing(changScale, chngDate, chngDate, wScale2, notCalcIntRep, newSum, stDate, endDate, acsBranch, acsSection, acsType)
      Log.Message("Սանդղակի խմբային խմբագրում փաստաթղթի ISN` " & changScale)
      BuiltIn.Delay(2000)
              ' DCR
              queryString = "select COUNT(*) from DCR where fISN = ' "&perCalcISN&" ' "
              
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' DOCS
              queryString = "select COUNT(*) from DOCS where fISN = '"&perCalcISN&"' and fNAME = 'Percent' "
              
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' FOLDERS
              queryString = "select COUNT(*) from FOLDERS where fISN = '"&perCalcISN&"' "
              
              sqlValue = 2
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' GROUPOPERISNLIST
              queryString = "select COUNT(*) from GROUPOPERISNLIST where fOPBASE = '"&changScale&"' and fUNITISN = " & perCalcISN
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HI
              queryString = " select COUNT(*) from HI where fBASE = '"&changScale&"' "&_
                                        " and ((fTYPE = '01' and fSUM = '123.30' and fCURSUM = '123.30' and fOP = 'PRC' and fDBCR = 'D' ) "&_
                                        " or (fTYPE = '01' and fSUM = '123.30' and fCURSUM = '123.30' and fOP = 'PRC' and fDBCR = 'C' ) "&_
                                        " or(fTYPE = 'P1' and fSUM = '0.00' and fCURSUM = '0.00' and fOP = 'CLP' and fDBCR = 'D' ) "&_
                                        " or(fTYPE = 'P1' and fSUM = '0.00' and fCURSUM = '123.30' and fOP = 'PRC' and fDBCR = 'D' ) "&_
                                        " or(fTYPE = 'P1' and fSUM = '0.00' and fCURSUM = '0.00' and fOP = 'RFP' and fDBCR = 'C' ))"
              sqlValue = 5
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HIREST
              queryString = "select COUNT(*) from HIREST where fOBJECT = '"&perCalcISN&"' "&_
                                        "and fTYPE = 'P1' and fREM = '0.00' and fCUR = '000' and (fCURREM = '0.00' or fCURREM = '357.50')"
              sqlValue = 2
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HIREST
              queryString = "select COUNT(*) from MEMORDERS where fISN = '"&changScale&"' and fSUMMA = '0.00' and fCOM = 'ê³Ý¹Õ³ÏÇ ÷á÷áËáõÙ' and fDOCTYPE = 'GrpEdPcS' "
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
      Set wMainForm = Sys.Process("Asbank").VBObject("MainForm")

      Call wMainForm.MainMenu.Click(c_ToRefresh)
      
      ' Տոկոսի պայմանագրի հաշիվների խմբային խմբագրում
      coaNum = "2"
      balAcc = "101100"
      wType = "01"
      wNote = "2"
      wNote2 = "404"
      wNote3 = "405"
      inhOfficefromAcc = 1
      inhSectfromAcc = 1
      baseType = 1
      acsBranch = "01"
      wSection = ""
      Call GroupEditingOfAccounts(percfISN, coaNum, balAcc, wType, wNote, wNote2, wNote3, accAcbBranch, inhOfficefromAcc, wSection, inhSectfromAcc, accAcsType, _
                                                               baseType, fromOptType, acsBranch, acsSection, acsType) 
      Log.Message("Տոկոսի պայմանագրի հաշիվների խմբային խմբագրում փաստաթղթի ISN` " & percfISN)
      BuiltIn.Delay(1000)
      
              ' DOCS
              queryString = " select COUNT(*) from DOCS where fISN = '"&perCalcISN&"' and fNAME = 'Percent' and fBODY = '"& vbCRLF _
                                       & "ACC:01059353313" & vbCRLF _
                                       & "BALACC:3310200" & vbCRLF _
                                       & "CUR:000" & vbCRLF _
                                       & "FILLALG:00222" & vbCRLF _
                                       & "SCALE:"& wScale2 & vbCRLF _
                                       & "ACCUMACC:000001100" & vbCRLF _
                                       & "ACCSOURCE:000002900" & vbCRLF _
                                       & "SDATE:20190101" & vbCRLF _
                                       & "EDATE:20190801" & vbCRLF _
                                       & "CALCDAYS:1" & vbCRLF _
                                       & "INTDATE:20190101" & vbCRLF _
                                       & "PERIODICITY:1/15" & vbCRLF _
                                       & "INTONEND:1" & vbCRLF _
                                       & "INTCOMM:test" & vbCRLF _
                                       & "INTACC:000008600" & vbCRLF _
                                       & "INTACCCUR:000" & vbCRLF _
                                       & "REFILLACC:0" & vbCRLF _
                                       & "TAXACC:000006000" & vbCRLF _
                                       & "TAXVALUE:10" & vbCRLF _
                                       & "GROUP:N09" & vbCRLF _
                                       & "REPCODE:10102" & vbCRLF _
                                       & "N16ACCTYPE:01" &  vbCRLF _
                                       & "'"
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' FOLDERS
              queryString = "select COUNT(*) from FOLDERS where fISN = '"&percfISN&"' and fNAME = 'GrpEdPcA'"
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' GROUPOPERISNLIST
              queryString = "select COUNT(*) from GROUPOPERISNLIST where fOPBASE = '"&percfISN&"' and fUNITISN = " & perCalcISN
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
      Call wMainForm.MainMenu.Click(c_ToRefresh)
      
      ' Կատարել տոկոսների վերահաշվարկ
      wAction = c_RecalcPercent
      intDate = "010619"
      wSumma = "127.40"
      Call CalcCapitalizationAndRecalc(wAction, intRecalcfISN, reCalcDocN, wOffice, wSecton, acsType, actionType, intDate, intDate, wAcc, wSumma, wComment)
      Log.Message("Տոկոսների վերահաշվարկ փաստաթղթի ISN` " & intRecalcfISN)
      Log.Message("Տոկոսների վերահաշվարկ փաստաթղթի N` " & reCalcDocN)
      BuiltIn.Delay(1000)
      
              ' DOCS
              queryString = "select COUNT(*) from DOCS where fISN = '"&intRecalcfISN&"' and fNAME = 'PrcReClc'"
 
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HI
              queryString = " select COUNT(*) from HI where fBASE = "& intRecalcfISN &_
                                        " and ((fTYPE = '01' and fSUM = '127.40' and fCURSUM = '127.40' and fOP = 'PRC' and fDBCR = 'D' ) " &_
                                        " or (fTYPE = '01' and fSUM = '127.40' and fCURSUM = '127.40' and fOP = 'PRC' and fDBCR = 'C' ) " &_
                                        " or(fTYPE = 'P1' and fSUM = '0.00' and fCURSUM = '0.00' and fOP = 'CLP' and fDBCR = 'D' ) " &_
                                        " or(fTYPE = 'P1' and fSUM = '0.00' and fCURSUM = '127.40' and fOP = 'PRC' and fDBCR = 'D' )) "

 
              sqlValue = 4
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HIREST
              queryString = "select COUNT(*) from HIREST where fOBJECT = "& perCalcISN &_
                                       " and fTYPE = 'P1' and fREM = '0.00' and fCUR = '000' and (fCURREM = '0.00' or fCURREM = '484.90')"
 
              sqlValue = 2
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' MEMORDERS
              queryString = "select COUNT(*) from MEMORDERS where fISN = '"&intRecalcfISN&"' "&_
                                        "and fSUMMA = '127.40' and fCOM = 'Test' and fDOCTYPE = 'PrcReClc'"
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
      ' Կատարել տոկոսների կապիտալացում 
      wAction = c_PercCapital
      intDate = "010819"
      wSumma = "735.60"
      Call CalcCapitalizationAndRecalc(wAction, capitISN2, capitDocNum2, wOffice, wSecton, acsType, actionType, intDate, intDate, wAcc, wSumma, wComment)
      Log.Message("Տոկոսների կապիտալացում փաստաթղթի ISN` " & capitISN2)
      Log.Message("Տոկոսների կապիտալացում փաստաթղթի N` " & capitDocNum2)
      BuiltIn.Delay(1000)
        
               ' DOCS
              queryString = "select COUNT(*) from DOCS where fISN = '"&capitISN2&"' and fNAME = 'PrcReClc' "
 
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HI
              queryString = " select COUNT(*) from HI where fBASE = "& capitISN2 

 
              sqlValue = 10
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' HIREST
              queryString = "select COUNT(*) from HIREST where fOBJECT = "& perCalcISN &_
                                       " and fTYPE = 'P1' and fREM = '0.00' and fCUR = '000' and fCURREM = '0.00'"
 
              sqlValue = 2
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' MEMORDERS
              queryString = "select COUNT(*) from MEMORDERS where fISN = '"&capitISN2&"' "&_
                                        "and fSUMMA = '735.60' and fCOM = 'Test' and fDOCTYPE = 'PrcReClc' "
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
      ' Փակել պայմանագիրը
      doAction = c_Close
      dateClose = "010819"
      state = False
      Call Contracts_Group_Close_With_CheckBoxes(doAction, dateClose, state, ignorDate, ignorCalc, ignorAmount, closeAcc, closeAccum, doInt)
      
      Call wMainForm.MainMenu.Click(c_ToRefresh)
      
      ' Կատարել գործողությունների հեռացում
      param = c_OpersView
      action = c_OperDel
      dateGive = "010119"
      sDate = "SDATE"
      eDate = "EDATE"
      Call Delete_Group_PercentCalc(param, sDate, dateGive, eDate, dateAgr, action ) 
      
      ' Ջնջել պայմանագիրը
      Call Delete_Doc()
      
      Call Close_Pttel("frmPttel")
      
      Call wTreeView.DblClickItem("|îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ²Þî|ä³ÛÙ³Ý³·ñ»ñÇ ëï³Ý¹³ñïÝ»ñÇ ï»Õ»Ï³ïáõ")
      
      If Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Call ClickCmdButton(2, "Î³ï³ñ»É")
      Else
            Log.Error("Տոկոսի հաշվարկման պայմանագրի ստանդարտ դիալոգը չի բացվել")
      End If
      
      wFrmPttel = "frmPttel"
      colN = 0
      Call CheckContractDocument(wFrmPttel, colN, wCode)
      
      ' Ջնջել Տոկոսի հաշվարկման պայմանագրի ստանդարտը
      Call Delete_Doc()

      Call Close_Pttel("frmPttel")
      
      ' Փակել ծրագիրը
      Call Close_AsBank()
      
End Sub