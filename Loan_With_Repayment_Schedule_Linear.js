Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT Subsystems_Special_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Library_Contracts
'USEUNIT BankMail_Library
'USEUNIT Library_Colour
' Test Case ID 165952

' Գրաֆիկով վարկային պայմանագր(Գծային)-ի համար Մարումների գրաֆիկի վերանայում մինչև վարկի տրամադրում կատարելը
Sub Loan_With_Repayment_Schedule_Linear_Test()

      ' Գրաֆիկով վարկային պայմանագր(Գծային)-ի ստեղծման համար նախատեսված փոփոխականներ
      Dim  contType, fISN, docNum, clientCode, mAccacc, summ, mDate, dateGive, dateAgr, dateLngEnd, valCheck,_
              datesFilltype, fixDays, passDirection, summDateSelect, summFillType, loanRates,_
              loanRatesSect, unusedPortRate, unusedPortRateSec, subsRate, subsRateSect,_
              penOverMoney, penOverMoneySect, penOverLoan, penOverLoanSect, sect, purpose,_
              mShedule, mGuarantee, mCountry, lRegion, mRegion, mNote, paperCode, mixedSum, wCurr

      Dim queryString, sqlValue, colNum, sql_isEqual, contractName, VerifyContract, agrPeriod, agrPeriodPer
      Dim frmPttel, ContractsFilter, repShedISN, reDate, reDateAgr, sumTotal, colN, status
           
      Dim fDATE, sDATE, fISNOut, docNumOut, repScheduleISN
        
      valCheck = 1
      contType = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ (·Í³ÛÇÝ)"
      
      fDATE = "20250101"
      sDATE = "20120101"
      Call Initialize_AsBank("bank", sDATE, fDATE)
      Call Create_Connection()
      
      ' Մուտք գործել համակարգ CREDITOPERATOR օգտագործողով 
      Login("CREDITOPERATOR")
         
      ' Մուտք գործել վարկեր տեղաբաշխված/Նոր պայմանագրի ստեղծում դաշտ
      Call ChangeWorkspace(c_Loans)
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
      clientCode = "00000015"
      mAccacc = "01045993311"
      summ = "100000"
      mDate = "010120"
      dateGive = "050120"
      dateAgr = "050121"
      dateLngEnd = "050121"
      datesFilltype = "1"
      mixedSum = 1
      fixDays = "15"
      passDirection ="2"
      summDateSelect = "1"
      summFillType = "04"
      loanRates = "24"
      loanRatesSect = "365"   
      unusedPortRate = ""
      unusedPortRateSec = ""
      subsRate = ""
      subsRateSect = ""
      penOverMoney = ""
      penOverMoneySect = ""
      penOverLoan = ""
      penOverLoanSect = ""
      sect = "35.1"
      purpose = "09"
      mShedule = "IFC/CCCP"
      mGuarantee = "9"
      lRegion = "001"
      mCountry = "AM"
      mRegion = "010000008"
      mNote = ""
      paperCode = "1234"
      
      Call CreatingLoanAgrWithSchedule(contType, fISN, docNum, clientCode, wCurr, mAccacc, summ, mDate, dateGive, dateAgr, dateLngEnd, valCheck,_
                                                                        mixedSum, datesFilltype, fixDays, agrPeriod, agrPeriodPer, passDirection, summDateSelect, summFillType, loanRates,_
                                                                        loanRatesSect, unusedPortRate, unusedPortRateSec, subsRate, subsRateSect,_
                                                                        penOverMoney, penOverMoneySect, penOverLoan, penOverLoanSect, sect, purpose,_
                                                                        mShedule, mGuarantee, mCountry, lRegion, mRegion, mNote, paperCode )  
      Log.Message(docNum)
      Log.Message(fISN)    
      
             'CONTRACTS
             queryString = " SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & fISN & _
                                      " and fDGSTATE = '206' and fDGCODE = '"&docNum&"' and fDGCAPTION = 'ä³ÛÍ³é Ø»éÝ»ÙçÛ³Ý' " & _
                                      " and fDGECAPTION = 'Client 00000015' and fDGCLICODE = '00000015' and fDGCUR = '000' " & _
                                      " and fDGSUMMA= '100000.00' and fDGALLSUMMA = '0.00' and fDGRISKDEGREE = '0.00' " & _
                                      " and fDGRISKDEGNB = '0.00' and fDGBRANCH = '35.1' and fDGDISTRICT = '001' " & _
                                      " and fDGMPERCENTAGE = '0.00' and fDGAIM = '09' and fDGCOUNTRY = 'AM' and fDGREGION = '010000008'"

              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If 
      
              'FOLDERS
              queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISN  & _
                                        " and ((fCOM = '¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ' and fSPEC = '1¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ- "&docNum&" {ä³ÛÍ³é Ø»éÝ»ÙçÛ³Ý}') " & _
                                        " or (fCOM = ' ¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ' and fSPEC = '"&docNum&" (ä³ÛÍ³é Ø»éÝ»ÙçÛ³Ý),     100000 - Ð³ÛÏ³Ï³Ý ¹ñ³Ù') " & _
                                        " or (fCOM = '¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ' and fECOM = 'Credit with Repayment Schedule (Line)' and fSPEC = '"&docNum&"      C10 20200101            0.0091  00000015Üáñ å³ÛÙ³Ý³·Çñ'))"

              sqlValue = 3
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
          
              ' DOCLOG
              queryString = "SELECT COUNT(*)  FROM DOCLOG  WHERE fISN =" & fISN &_
                                       " and fSUID = '91'and fDCRID = '0' and fSUIDCOR = '-1'" & _
                                       "  and ((fOP = 'N' and fSTATE = '1') " & _
                                       "  or (fOP = 'C' and fSTATE = '206'))"
              sqlValue = 2
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' DOCP
              queryString = "SELECT COUNT(*)  FROM DOCP  WHERE fPARENTISN =" & fISN &_
                                       " and fNAME = 'Acc'"
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' DOCS
              queryString = "SELECT COUNT(*)  FROM DOCS  WHERE fISN =" & fISN &_
                                       " and fNAME = 'C1Univer' and fSTATE = '206' and fNEXTTRANS = '1' "&_
                                       " and fCREATORSUID = '91' and fBODY like '"& vbCRLF _
                                    & "CODE:"&docNum& vbCRLF _
                                    & "CLICOD:00000015"& vbCRLF _
                                    & "NAME:ä³ÛÍ³é Ø»éÝ»ÙçÛ³Ý"& vbCRLF _
                                    & "CURRENCY:000"& vbCRLF _
                                    & "ACCACC:01045993311"& vbCRLF _
                                    & "SUMMA:100000"& vbCRLF _
                                    & "DATE:20200101"& vbCRLF _
                                    & "DATEGIVE:20200105"& vbCRLF _
                                    & "DATEAGR:20210105"& vbCRLF _
                                    & "EXISTSPROLPERSCH:0"& vbCRLF _
                                    & "ISLINE:1"& vbCRLF _
                                    & "ALLOCATEWITHLIM:0"& vbCRLF _
                                    & "DATELNGEND:20210105"& vbCRLF _
                                    & "ISREGENERATIVE:0"& vbCRLF _
                                    & "ISCRCARD:0"& vbCRLF _
                                    & "AUTOCAP:0"& vbCRLF _
                                    & "ISLIMPERPR:0"& vbCRLF _
                                    & "ISPERPR:0"& vbCRLF _
                                    & "ACSBRANCH:00"& vbCRLF _
                                    & "ACSDEPART:1"& vbCRLF _
                                    & "ACSTYPE:C10"& vbCRLF _
                                    & "AUTODEBT:1"& vbCRLF _
                                    & "DEBTJPART1:1"& vbCRLF _
                                    & "DEBTJPART:0"& vbCRLF _
                                    & "USECLICONNSCH:0"& vbCRLF _
                                    & "USECODEBTORSACCS:0"& vbCRLF _
                                    & "ONLYOVERDUE:0"& vbCRLF _
                                    & "DATESFILLTYPE:1"& vbCRLF _
                                    & "AGRMARBEG:20200105"& vbCRLF _
                                    & "AGRMARFIN:20210105"& vbCRLF _
                                    & "ISNOTUSETHISM:0"& vbCRLF _
                                    & "FIXEDDAYS:15"& vbCRLF _
                                    & "PASSOVDIRECTION:2"& vbCRLF _
                                    & "PASSOVTYPE:0"& vbCRLF _
                                    & "SUMSDATESFILLTYPE:1"& vbCRLF _
                                    & "SUMSFILLTYPE:04"& vbCRLF _
                                    & "FILLROUND:2"& vbCRLF _
                                    & "MIXEDSUMSINSCH:1"& vbCRLF _
                                    & "FIXEDROWSINSCH:0"& vbCRLF _
                                    & "APARTPERDATES:0"& vbCRLF _
                                    & "KINDSCALE:1"& vbCRLF _
                                    & "PCAGR:24.0000/365"& vbCRLF _
                                    & "PCNOCHOOSE:0/1"& vbCRLF _
                                    & "PCGRANT:0/1"& vbCRLF _
                                    & "CONSTPER:0"& vbCRLF _
                                    & "ISCONSCURPRD:0"& vbCRLF _
                                    & "FILLROUNDPR:2"& vbCRLF _
                                    & "DONOTCALCPCBASE:0"& vbCRLF _
                                    & "PAYPERGIVE:0"& vbCRLF _
                                    & "PAYPERGIVEPER:0"& vbCRLF _
                                    & "PCNDERAUTO:1"& vbCRLF _
                                    & "KINDPENCALC:1"& vbCRLF _
                                    & "PCPENAGR:0/1"& vbCRLF _
                                    & "PCPENPER:0/1"& vbCRLF _
                                    & "PCLOSS:0/1"& vbCRLF _
                                    & "CALCFINPER:1"& vbCRLF _
                                    & "CALCJOUTS:0"& vbCRLF _
                                    & "SECTOR:35.1"& vbCRLF _
                                    & "AIM:09"& vbCRLF _
                                    & "SCHEDULE:IFC/CCCP"& vbCRLF _
                                    & "GUARANTEE:9"& vbCRLF _
                                    & "COUNTRY:AM"& vbCRLF _
                                    & "LRDISTR:001"& vbCRLF _
                                    & "REGION:010000008"& vbCRLF _
                                    & "REDUCEOVRDDAYS:0"& vbCRLF _
                                    & "WEIGHTAMDRISK:0"& vbCRLF _
                                    & "PPRCODE:1234"& vbCRLF _
                                    & "CHRGFIRSTDAY:1"& vbCRLF _
                                    & "GIVEN:0"& vbCRLF _
                                    & "SUBJRISK:0"& vbCRLF _
                                  	& "SRCSEND:0"& vbCRLF _
                                    & "UPDINS:0"& vbCRLF _
                                    & "DOOVRDINWORKDAYS:0"& vbCRLF _
                                    & "ISNBOUT:0"& vbCRLF _
                                    & "PUTINLR:1"& vbCRLF _
                                    & "NOTCLASS:0"& vbCRLF _
                                    & "OTHERCOLLATERAL:0"& vbCRLF _
                                    & "OVRDDAYSCALCACRA:0"& vbCRLF _
                                    & "LASTOVRDDATEACRA:0"& vbCRLF _
                                    & "OVRDAGRSUMACRA:0"& vbCRLF _
                                    & "OVRDPERSUMACRA:0"& vbCRLF _
                                    & "RISKACRA:0"& vbCRLF _
                                    & "LASTCLASSDATEACRA:0"& vbCRLF _
                                    & "'"
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' DOCP
              queryString = "SELECT COUNT(*)  FROM DOCSG  WHERE fISN =" & fISN &_
                                       " and fGRID = 'NOTES'"
              sqlValue = 40
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' RESNUMBERS
              queryString = "SELECT COUNT(*)  FROM RESNUMBERS  WHERE fISN =" & fISN &_
                                       " and fTYPE = 'C' and fNUMBER = '"&docNum&"'"
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
                                                         
      ' Մարման գրաֆիկի նշանակում
      Builtin.Delay(2000)
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_RepaySchedule)  
      BuiltIn.Delay(1000)
      
      
              ' AGRSCHEDULE
              queryString = "SELECT fBASE  FROM AGRSCHEDULE  WHERE fAGRISN =" & fISN &_
                                       " and fINC = '1' and fTYPE = '0' and fSUID = '91'"

              repScheduleISN = Get_Query_Result(queryString)
              Log.Message("Մարումների գրաֆիկի ISN` " & repScheduleISN)
              
               ' AGRSCHEDULEVALUES
              queryString = "SELECT COUNT(*)  FROM AGRSCHEDULEVALUES  WHERE fAGRISN =" & fISN &_
                                       " and fSUM = '0.00' and fREDPERIOD = '0' and fCHILDNUM = '0' "&_
                                       " and fPERDATE = '0' and (fVALUETYPE = '1' or fVALUETYPE = '2')"
              sqlValue = 2
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' CONTRACTS
              queryString = "SELECT COUNT(*)  FROM CONTRACTS  WHERE fDGISN =" & fISN &_
                                       " and fDGSTATE = '1'"
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
              
              ' DOCLOG
              queryString = "SELECT COUNT(*)  FROM DOCLOG  WHERE fISN =" & fISN &_
                                       " and fSUID = '91'and fDCRID = '0' and fSUIDCOR = '-1' "&_
                                       " and ((fOP = 'N' and fSTATE = '1') "&_
                                       " or (fOP = 'C' and fSTATE = '206') "&_
                                       " or (fOP = 'E' and fSTATE = '1'))"
              sqlValue = 3
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' FOLDERS
              queryString = "SELECT COUNT(*)  FROM FOLDERS  WHERE fISN =" & repScheduleISN &_
                                       " and fNAME = 'C1TSDtUn' and fCOM = 'Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ' "&_
                                       " and fSPEC = '1Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ`  05/01/20'"
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' DOCS
              queryString = "SELECT COUNT(*)  FROM DOCS WHERE fISN = " & repScheduleISN &_
                                        " and fNAME = 'C1TSDtUn' and fSTATE = '5' and fNEXTTRANS = '1'"&_
                                        " and fCREATORSUID = '91' and fBODY like '"& vbCRLF _
                                    & "CODE:"&docNum& vbCRLF _
                                    & "DATE:20200105"& vbCRLF _
                                    & "DATEAGR:20210105"& vbCRLF _
                                    & "TIMEOP:%%%%%%%%"& vbCRLF _
                                    & "ISPROLONG:0"& vbCRLF _
                                    & "AUTODATEUN:0"& vbCRLF _
                                    & "COPYSCHEDULE:0"& vbCRLF _
                                    & "IMPFROMEXCEL:0"& vbCRLF _
                                    & "REFRPERSUM:0"& vbCRLF _
                                    & "USERID:  91"& vbCRLF _
                                    & "'"
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If

      ' Պայմանագիրն ուղարկել հաստատման
       contractName = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ- " & docNum  & " {ä³ÛÍ³é Ø»éÝ»ÙçÛ³Ý}"
      Call SendContractForApproval(contractName)         
      BuiltIn.Delay(1000)
      
             'CONTRACTS
             queryString = " SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & fISN & _
                                      " and fDGSTATE = '101'"
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If 
      
              'FOLDERS
              queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISN  
              sqlValue = 4
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
          
              ' DOCLOG
              queryString = "SELECT COUNT(*)  FROM DOCLOG  WHERE fISN =" & fISN &_
                                       " and fSUID = '91'and fDCRID = '0' and fSUIDCOR = '-1' " & _
                                       "  and ((fOP = 'N' and fSTATE = '1') " & _
                                       " or (fOP = 'C' and fSTATE = '206') " & _
                                       " or (fOP = 'E' and fSTATE = '1') " & _
                                       " or (fOP = 'M' and fSTATE = '99' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý') " & _
                                       " or (fOP = 'C' and fSTATE = '101'))"
              sqlValue = 5
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' DOCS
              queryString = "SELECT COUNT(*)  FROM DOCS  WHERE fISN =" & fISN &_
                                       " and fNAME = 'C1Univer' and fSTATE = '101' and fNEXTTRANS = '1' "&_
                                       " and fCREATORSUID = '91' "
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If   

      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
      
      ' Մուտք Հաստատող փաստաթղթեր1  թղթապանակ
      Set VerifyContract = New_VerifyContract()
      VerifyContract.AgreementN = docNum
    
      Call Fill_Verify(VerifyContract)

      ' Փաստաթղթի վավերացում 
      Call DocValidate(docNum)
      BuiltIn.Delay(5000)
      Set frmPttel = wMDIClient.VBObject("frmPttel")
      frmPttel.Close
      
            'CAGRACCS
             queryString = " SELECT COUNT(*) FROM CAGRACCS WHERE fAGRISN = " & fISN 
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If 
              
            'CONTRACTS
             queryString = " SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & fISN & _
                                      " and fDGSTATE = '7' "
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If 
          
              ' DOCLOG
              queryString = "SELECT COUNT(*)  FROM DOCLOG  WHERE fISN =" & fISN &_
                                        "and fSUID = '91'and fDCRID = '0' and fSUIDCOR = '-1'"
              sqlValue = 7
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If
      
              ' DOCP
              queryString = "SELECT COUNT(*)  FROM DOCP WHERE fPARENTISN =" & fISN &_
                                       " and fNAME = 'Acc' "
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If  
              
              ' DOCS
              queryString = "SELECT COUNT(*)  FROM DOCS  WHERE fISN =" & fISN &_
                                       " and fNAME = 'C1Univer' and fSTATE = '7' and fNEXTTRANS = '2' "&_
                                       " and fCREATORSUID = '91' "
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If   
              
              ' DOCS
              queryString = "SELECT COUNT(*)  FROM DOCS  WHERE fISN =" & repScheduleISN &_
                                       " and fNAME = 'C1TSDtUn' and fSTATE = '5' and fNEXTTRANS = '1' "
              sqlValue = 1
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If   
              
              ' HI
              queryString = "SELECT COUNT(*)  FROM HI  WHERE fBASE =" & fISN &_
                                       " and fTYPE = '02' and fSUM = '100000.00'and fCUR = '000' "&_
                                       " and fCURSUM = '100000.00' and fOP = 'MSC' and fDBCR = 'D' and fBASEDEPART = '1'  "&_
                                       " and fADB = '-1' and fACR = '-1' and fTRANS = '1' and fBASEBRANCH = '00' "
              sqlValue = 2
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If  
      
              ' HIF
              queryString = "SELECT COUNT(*)  FROM HIF  WHERE fBASE =" & fISN 
              sqlValue = 21
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If     

      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
      
      Set ContractsFilter = New_ContractsFilter()
      ContractsFilter.AgreementN = docNum
      ContractsFilter.AgreementLevel = "1"
      
      Call Fill_ContractsFilter(ContractsFilter)
      BuiltIn.Delay(1500)
      
      ' Պայմանագրի առկայության ստուգում 
      colN = 0
      status = CheckContractDoc(colN, docNum)

      If Not status Then
            Log.Error"Պայմանագիրն առկա չէ Պայմանագրեր/Վարկեր տեղաբաշխված թղթապանակում"  ,,,ErrorColor
            Exit Sub  
      End If 

      ' Կատարել բոլոր գործողությունները
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Կատարել Գործողություններ/Ժամկետներ/Գրաֆիկի վերանայում
      Call wMainForm.PopupMenu.Click(c_TermsStates & "|" & c_Dates & "|" & c_ReviewSchedule)

      ' Ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "DATE", "050120" )
      ' Մարման ժամկետ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "DATEAGR", "050121" )
      ' Նշել Ամսաթվերի լրացում չեքբոքսը
       wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("CheckBox").Click
        
      BuiltIn.Delay(1000)   
      ' Ստուգում որ Գրաֆիկի լրացման ձև դիալոգը բացվել է
      If Not Sys.Process("Asbank").WaitVBObject("frmAsUstPar", 2000).Exists Then
              Log.Error "Գրաֆիկի լրացման ձև դիալոգը չի բացվել"  ,,,ErrorColor
      End If
        
      ' Ընդհանուր գումար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SUMTOT", "50000" )
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")  
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")     
      BuiltIn.Delay(1500)
                
      If  MessageExists(2, "¶Í³ÛÇÝ å³ÛÙ³Ý³·ñ»ñÇ Ù³ñáõÙÝ»ñÇ ·ñ³ýÇÏÁ ÙÇÝã¨ ïñ³Ù³¹ñáõÙÁ å»ïù ¿ " & vbCRLF _ 
                                            & "ÉÇÝÇ 0-³Ï³Ý:") Then
          Call ClickCmdButton(5, "OK")  
      Else
           Log.Error" Սխալի հաղորդագրության պատուհանը չի բացվել" ,,,ErrorColor
      End If
      
      ' Դադարեցնել կոճակի սեղմում
      Call ClickCmdButton(1, "¸³¹³ñ»óÝ»É") 
        
      ' Ջնջել պայմանագիրը
      Call DelDoc()
      frmPttel.Close
                     
      ' Փակել ծրագիրը
      Call Close_AsBank()
      
End Sub