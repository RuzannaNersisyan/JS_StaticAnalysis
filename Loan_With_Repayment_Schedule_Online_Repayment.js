Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_Special_Library
'USEUNIT Library_Contracts
'USEUNIT Library_Colour
'USEUNIT Subsystems_SQL_Library
'USEUNIT BankMail_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Percentage_Calculation_Filter_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Mortgage_Library
'USEUNIT Akreditiv_Library
'USEUNIT Card_Library
'Test Case ID 176493

' Գրաֆիկով վարկային պայմանագրի համար Արտարժութային վարկի վաղաժամկետ մասնակի առցանց մարում
Sub Loan_With_Repayment_Schedule_Online_Repayment_Test()
           
      Dim fDATE, sDATE
      Dim contType, fISN, docNum, clientCode, wCurr, mAccacc,summ, mDate,dateGive, dateLngEnd, dateAgr, valCheck,_
               mixedSum, datesFilltype, fixDays, passDirection, summDateSelect, summFillType, loanRates,_
               loanRatesSect, unusedPortRate, unusedPortRateSec, subsRate, subsRateSect,_
               penOverMoney, penOverMoneySect, penOverLoan, penOverLoanSect, sect, purpose,_
               mShedule, mGuarantee,mCountry, lRegion, mRegion, mNote, paperCode, agrPeriod, agrPeriodPer
               
      Dim verifyContract, contractsFilter, colN, contractName, status, client
      Dim fISNChar, docNumChar, fISNInput, docNumInput, accCorr, applayConn
      Dim  giveCrBase, docNumLoan, fISNLoan, docNumOut, fISNOut, accCor, incMessProcessed
      Dim verifyDocuments, workEnvName, workEnv, isnRekName, state, percentMoney, kassNish
      Dim queryString, sqlValue, sql_isEqual, colNum, payerCompanies, recipientCompanies, calcfISN
      Dim repayDebts, folderDirect, stDate, eDate, selectView, exportExcel, partOfPayments, loanRepISN
      Dim wCur, wUser, docType, paySysin, paySysOut, payNotes, acsBranch, acsDepart, forSQLGive, forSQL
      
      fDATE = "20250101"
      sDATE = "20120101"
      Call Initialize_AsBank("bank", sDATE, fDATE)
      Call Create_Connection()
      
      ' Մուտք գործել համակարգ  օգտագործողով 
      Login("ARMSOFT")
      Call SetParameter("OEUSEASPAYMENT ", "1")
      
      ' Մուտք ադմինիստրատորի ԱՇՏ4.0
      Call ChangeWorkspace(c_Admin40)
      Call wTreeView.DblClickItem("|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|î»Õ»Ï³ïáõÝ»ñ|Ð³×³Ëáñ¹Ý»ñ")
       
      ' Խմբագրել հաճախորդի տվյալները
      Set client = New_Clients()  
      client.ClientsCode = "00034851"
      
      Call Fill_Clients(client)  
      Call WaitForExecutionProgress()
      Call CheckPttel_RowCount("frmPttel", 1)
       
      ' Կատարել բոլոր գործողությունները
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Վավերացնել գործողության կատարում
      Call wMainForm.PopupMenu.Click(c_ToEdit)

      If wMDIClient.WaitVBObject("frmASDocForm",10000).Exists Then
            ' Վավեր է մինչև դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "DATEEXPIRE", "01012030")  
            
            ' Սեռ դաշտի լրացում
            Call Rekvizit_Fill("Document", 2, "General", "GENDER", "M")
            ' Ծննդավայր դաշտի լրացում
            Call Rekvizit_Fill("Document", 2, "General", "BIRTHPLACE", "AM")
            
            ' Երկիր (փաստացի հասցե) դաշտի լրացում
            Call Rekvizit_Fill("Document", 3, "General", "COUNTRY", "AM")
            ' Բնակավայր (գրանցման հասցե) դաշտի լրացում
            Call Rekvizit_Fill("Document", 3, "General", "COMMUNITY", "010010635")
            ' Քաղաք (գրանցման հասցե) դաշտի լրացում
            Call Rekvizit_Fill("Document", 3, "General", "CITY",  "^A[Del]" & "ºñ¨³Ý")      
            ' Երկիր (փաստացի հասցե) դաշտի լրացում
            Call Rekvizit_Fill("Document", 3, "General", "COUNTRY2", "AM")
            ' Բնակավայր (փաստացի հասցե) դաշտի լրացում
            Call Rekvizit_Fill("Document", 3, "General", "COMMUNITY2", "010010635")
            ' Քաղաք (փաստացի հասցե) դաշտի լրացում
            Call Rekvizit_Fill("Document", 3, "General", "CITY2",  "^A[Del]" & "ºñ¨³Ý")
            ' Փողոց (փաստացի հասցե) դաշտի լրացում
            Call Rekvizit_Fill("Document", 3, "General", "STREET2",  "^A[Del]" & "ºñ¨³Ý")
            Call ClickCmdButton(1, "Î³ï³ñ»É")
            Call Close_Pttel("frmPttel")
      End If
      
      ' Մուտք գործել վարկեր տեղաբաշխված
      Call ChangeWorkspace(c_Loans)
      
      ' Ստեղծել Գրաֆիկով վարկային պայմանագիր
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
      contType = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ"
      clientCode = "00034851"
      wCurr = "001"
      summ = "15000"
      dateAgr = aqConvert.DateTimeToFormatStr(aqDateTime.Today+720,"%d/%m/%y") 
      stDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today-15,"%d/%m/%y") 
      datesFilltype = "2"
      fixDays = "15"
      passDirection = "0"
      summDateSelect = "1"
      summFillType = "01"
      loanRates = "10"
      loanRatesSect = "365"
      unusedPortRate = "5"
      unusedPortRateSec = "365"
      penOverMoney = "2"
      penOverMoneySect = "7"
      penOverLoan = "2"
      penOverLoanSect = "7"
      sect = "B"
      purpose = "00"
      mShedule = "9"
      mGuarantee = "9"
      mCountry = "AM"
      lRegion = "001"
      mRegion = "010000008"
      paperCode = "1111"
      agrPeriodPer = "15"
      Call CreatingLoanAgrWithSchedule(contType, fISN, docNum, clientCode, wCurr, mAccacc,summ, stDate, stDate, dateLngEnd, dateAgr, valCheck,_
                                                                       mixedSum, datesFilltype, fixDays, agrPeriod, agrPeriodPer, passDirection, summDateSelect, summFillType, loanRates,_
                                                                       loanRatesSect, unusedPortRate, unusedPortRateSec, subsRate, subsRateSect,_
                                                                       penOverMoney, penOverMoneySect, penOverLoan, penOverLoanSect, sect, purpose,_
                                                                       mShedule, mGuarantee,mCountry, lRegion, mRegion, mNote, paperCode)
      Log.Message(docNum)
      Log.Message(fISN)  
      forSQL = aqConvert.DateTimeToFormatStr(aqDateTime.Today-15,"20%y%m%d") 
      forSQLGive = aqConvert.DateTimeToFormatStr(aqDateTime.Today+720,"20%y%m%d") 
      
              ' AGRNOTES
                queryString = " SELECT COUNT(*) FROM AGRNOTES WHERE fAGRISN = " & fISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                 ' CONTRACTS
                queryString = " SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & fISN & _
                                        " and fDGCODE = '"& docNum &"' and fDGPPRCODE = '1111' and fDGCAPTION = 'öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1' " & _ 
                                        " and fDGECAPTION = 'For test' and fDGCLICODE = '00034851' and fDGCUR = '001' and fDGSUMMA = '15000.00' " & _ 
                                        " and fDGALLSUMMA = '0.00' and fDGRISKDEGREE = '0.00' and fDGRISKDEGNB = '0.00'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 

                ' CONTRACTS
                queryString = " SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & fISN
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                      
               ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISN & _
                                        " and fNAME = 'C1Univer' and fSTATE = '206' and fNEXTTRANS = '1' and fBODY = '" & vbCRLF _ 
                                        & "CODE:"& docNum & vbCRLF _
                                        & "CLICOD:00034851"& vbCRLF _
                                        & "NAME:öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1"& vbCRLF _
                                        & "CURRENCY:001"& vbCRLF _
                                        & "REPAYCURR:1"& vbCRLF _
                                        & "SUMMA:15000"& vbCRLF _
                                        & "DATE:"& forSQL & vbCRLF _
                                        & "DATEGIVE:"& forSQL & vbCRLF _
                                        & "DATEAGR:"& forSQLGive & vbCRLF _
                                        & "EXISTSPROLPERSCH:0"& vbCRLF _
                                        & "ISLINE:0"& vbCRLF _
                                        & "ALLOCATEWITHLIM:0"& vbCRLF _
                                        & "ISREGENERATIVE:0"& vbCRLF _
                                        & "ISCRCARD:0"& vbCRLF _
                                        & "AUTOCAP:0"& vbCRLF _
                                        & "ISLIMPERPR:0"& vbCRLF _
                                        & "ISPERPR:0"& vbCRLF _
                                        & "ACSBRANCH:00"& vbCRLF _
                                        & "ACSDEPART:1"& vbCRLF _
                                        & "ACSTYPE:C10"& vbCRLF _
                                        & "AUTODEBT:0"& vbCRLF _
                                        & "DEBTJPART1:1"& vbCRLF _
                                        & "DEBTJPART:0"& vbCRLF _
                                        & "USECLICONNSCH:0"& vbCRLF _
                                        & "USECODEBTORSACCS:0"& vbCRLF _
                                        & "ONLYOVERDUE:0"& vbCRLF _
                                        & "DATESFILLTYPE:2"& vbCRLF _
                                        & "AGRMARBEG:"& forSQL & vbCRLF _
                                        & "AGRMARFIN:"& forSQLGive & vbCRLF _
                                        & "ISNOTUSETHISM:0"& vbCRLF _
                                        & "AGRPERIOD:0/15"& vbCRLF _
                                        & "PASSOVDIRECTION:0"& vbCRLF _
                                        & "SUMSDATESFILLTYPE:1"& vbCRLF _
                                        & "SUMSFILLTYPE:01"& vbCRLF _
                                        & "FILLROUND:1"& vbCRLF _
                                        & "MIXEDSUMSINSCH:0"& vbCRLF _
                                        & "FIXEDROWSINSCH:1"& vbCRLF _
                                        & "APARTPERDATES:0"& vbCRLF _
                                        & "KINDSCALE:1"& vbCRLF _
                                        & "PCAGR:10.0000/365"& vbCRLF _
                                        & "PCNOCHOOSE:5.0000/365"& vbCRLF _
                                        & "PCGRANT:0/1"& vbCRLF _
                                        & "CONSTPER:0"& vbCRLF _
                                        & "ISCONSCURPRD:0"& vbCRLF _
                                        & "FILLROUNDPR:1"& vbCRLF _
                                        & "DONOTCALCPCBASE:0"& vbCRLF _
                                        & "PAYPERGIVE:0"& vbCRLF _
                                        & "PAYPERGIVEPER:0"& vbCRLF _
                                        & "PCNDERAUTO:1"& vbCRLF _
                                        & "KINDPENCALC:1"& vbCRLF _
                                        & "PCPENAGR:2.0000/7"& vbCRLF _
                                        & "PCPENPER:2.0000/7"& vbCRLF _
                                        & "PCLOSS:0/1"& vbCRLF _
                                        & "CALCFINPER:1"& vbCRLF _
                                        & "CALCJOUTS:0"& vbCRLF _
                                        & "SECTOR:B"& vbCRLF _
                                        & "AIM:00"& vbCRLF _
                                        & "SCHEDULE:9"& vbCRLF _
                                        & "GUARANTEE:9"& vbCRLF _
                                        & "COUNTRY:AM"& vbCRLF _
                                        & "LRDISTR:001"& vbCRLF _
                                        & "REGION:010000008"& vbCRLF _
                                        & "REDUCEOVRDDAYS:0"& vbCRLF _
                                        & "WEIGHTAMDRISK:0"& vbCRLF _
                                        & "PPRCODE:1111"& vbCRLF _
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

                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                      
                ' DOCSG
                queryString = " SELECT COUNT(*) FROM DOCSG WHERE fISN = " & fISN  
                sqlValue = 40
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISN & _
                                        " and fSUID = '77' and fSUIDCOR = '-1' and fDCRID = '0' " & _ 
                                        " and ((fOP = 'N' and fSTATE = '1') or (fOP = 'C' and fSTATE = '206')) " 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISN  
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISN 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' RESNUMBERS
                queryString = " SELECT COUNT(*) FROM RESNUMBERS WHERE fISN = " & fISN & _
                                        " and fTYPE = 'C' and fNUMBER = '"& docNum &"'" 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' RESNUMBERS
                queryString = " SELECT COUNT(*) FROM RESNUMBERS WHERE fISN = " & fISN 
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
                queryString = " SELECT COUNT(*) FROM AGRSCHEDULE WHERE fAGRISN = " & fISN & _
                                        " and fINC = '1' and fTYPE = '0' and fSUID = '77' and fKIND = '9' " 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' AGRSCHEDULE
                queryString = " SELECT COUNT(*) FROM AGRSCHEDULE WHERE fAGRISN = " & fISN
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' AGRSCHEDULEVALUES
                queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN = " & fISN 
                sqlValue = 98
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISN & _
                                        " and fSUID = '77' and fSUIDCOR = '-1' and fDCRID = '0' "& _
                                        " and ((fOP = 'N' and fSTATE = '1') "& _
                                        " or (fOP = 'C' and fSTATE = '206') "& _
                                        " or (fOP = 'E' and fSTATE = '1')) " 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISN  
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISN & _
                                        " and fSTATE = '1' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISN
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISN & _
                                        " and fNAME = 'C1Univer' and fSTATUS = '1' "
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISN 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' CONTRACTS
                queryString = " SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & fISN & _
                                        " and fDGSTATE = '1'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' CONTRACTS
                queryString = " SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & fISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
      ' Պայմանագիրն ուղարկել հաստատման
      contractName = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ- " & docNum  & " {öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1}"
      Call SendContractForApproval(contractName)         
      BuiltIn.Delay(1000)
      
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISN & _
                                        " and fSUID = '77' and fSUIDCOR = '-1' and fDCRID = '0' "& _
                                        " and ((fOP = 'N' and fSTATE = '1') "& _
                                        " or (fOP = 'C' and fSTATE = '206') "& _
                                        " or (fOP = 'E' and fSTATE = '1') "& _
                                        " or (fOP = 'M' and fSTATE = '99') "& _
                                        " or (fOP = 'C' and fSTATE = '101'))"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISN 
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISN & _
                                        " and fSTATE = '101' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                 ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISN & _
                                         " and fNAME = 'C1Univer' and  "& _
                                         " ((fSTATUS = '0' and fCOM = '¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ' and fSPEC = '1¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ- "&docNum&" {öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1}' and fECOM = '') "& _
                                         " or(fSTATUS = '0' and fCOM = ' ¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ' and fSPEC = '"&docNum&" (öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1),     15000 - ²ØÜ ¹áÉ³ñ' and fECOM = '') "& _
                                         " or (fSTATUS = '4' and fCOM = '¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ' and fSPEC = '"&docNum&"      C10 "&forSQL&"            0.0077  00034851' and fECOM = 'Credit with Repayment Schedule') "& _
                                         " or (fSTATUS = '0' and fCOM = '¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ' and fSPEC = '"&docNum&"      C10 "&forSQL&"            0.0077  00034851àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³' and fECOM = 'Credit with Repayment Schedule'))"
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISN
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
      ' Մուտք Հաստատող փաստաթղթեր1  թղթապանակ
      Set verifyContract = New_VerifyContract()
      verifyContract.AgreementN = docNum

      ' Փաստաթղթի վավերացում 
       Call Verify_Contract("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I",verifyContract)
       BuiltIn.Delay(3000)
      
                ' CONTRACTS
                queryString = " SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & fISN & _
                                        " and fDGCODE = '"&docNum&"' and fDGPPRCODE = '1111' and fDGCAPTION = 'öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1' "& _
                                        " and fDGECAPTION = 'For test' and fDGCLICODE = '00034851' and fDGCUR = '001' and fDGSUMMA = '15000.00' "& _
                                        " and fDGALLSUMMA = '0.00' and fDGRISKDEGREE = '0.00' and fDGRISKDEGNB = '0.00' and fDGSTATE = '7' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' CONTRACTS
                queryString = " SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & fISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISN 
                sqlValue = 7
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISN & _
                                        " and fSTATUS = '1'"
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISN 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIF
                queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & fISN 
                sqlValue = 19
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' CAGRACCS
                queryString = " SELECT COUNT(*) FROM CAGRACCS WHERE fAGRISN = " & fISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
            
      Set contractsFilter = New_ContractsFilter()
      contractsFilter.AgreementN = docNum
      contractsFilter.AgreementLevel = "1"
      
      Call Check_AgreementExisting("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|", contractsFilter)
      
       ' Գանձում տրամադրումից գործողության կատարում
       Call Charging(fISNChar, docNumChar, stDate, "1", fISNInput, docNumInput, kassNish, accCorr, applayConn)
       Log.Message("Գանձում տրամադրումից փաստաթղթի ISN` " & fISNChar)
       Log.Message("Գանձում տրամադրումից փաստաթղթի համար՝  " & docNumChar)
       Log.Message("Կանխիկ մուտք փաստաթղթի ISN` " & fISNInput)
       Log.Message("Կանխիկ մուտք փաստաթղթի համար՝  " & docNumInput)
       Call Close_Pttel("frmPttel")
       BuiltIn.Delay(3000)
      
               ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNChar  &_
                                         " and fSUIDCOR = '-1' and ((fOP = 'N' and fSTATE = '1') "&_
                                         " or (fOP = 'M' and fSTATE = '99' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý') "&_
                                         " or (fOP = 'C' and fSTATE = '1') "&_
                                         " or (fOP = 'M' and fSTATE = '1' and fCOM = 'CREATED') "&_
                                         " or (fOP = 'C' and fSTATE = '1'))"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNChar 
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNInput  &_
                                         " and fOP = 'N' and fSTATE = '5' and fSUIDCOR = '-1' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNInput  
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCP
                queryString = " SELECT COUNT(*) FROM DOCP WHERE fISN = " & fISNInput  &_
                                         " and fNAME = 'KasPrOrd' and fPARENTISN = "& fISNChar
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCP
                queryString = " SELECT COUNT(*) FROM DOCP WHERE fISN = " & fISNInput 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNInput  &_
                                         " and fNAME = 'KasPrOrd' and fSTATUS = '5' and fCOM = 'Î³ÝËÇÏ Ùáõïù' and fECOM = 'Cash Deposit Advice' " &_
                                         " and ((fSPEC = '²Ùë³ÃÇí- "&stDate&" N- "&docNumInput&" ¶áõÙ³ñ-             6,000.00 ²ñÅ.- 000 [Üáñ]')   " &_
                                         " or (fSPEC = '"&docNumInput&"77700000001100  7770036610090100         6000.00000Üáñ                                                   77öáË³ÝóÙ³Ý ëïáõ·Ù³Ý              AA000044 001 01/01/2000                                         ¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó ä³ÛÙ³Ý³·Çñª 1111'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNInput 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNChar  &_
                                         " and fSTATUS = '1' and fNAME = 'C1DSPay' and fCOM = '¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó'"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNChar  
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & fISNInput  &_
                                         " and fTYPE = '11' and fSUM = '6000.00' and fCUR = '000' and fCURSUM = '6000.00' "&_
                                         " and fOP = 'FEE' and ((fDBCR = 'D' and fSPEC = '"&docNumInput&"                   ¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó              1     1.0000    1' ) "&_
                                         " or (fDBCR = 'C' and fSPEC = '"&docNumInput&"                   ¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó              0     1.0000    1'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & fISNInput
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
      ' Մուտք ադմինիստրատորի ԱՇՏ4.0
      Call ChangeWorkspace(c_Admin40)
      
      ' Մուտք Աշխատանքային փաստաթղթեր թղթապանակ
      workEnvName = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      workEnv = "Աշխատանքային փաստաթղթեր "
      state = AccessFolder(workEnvName, workEnv, "PERN", stDate, "PERK", stDate, False, isnRekName, fISNInput)
      
      If Not state Then
            Log.Error("Մուտք Աշխատանքային փաստաթղթեր թղթապանակ ձախողվել է")
      End If
      
      ' Կանխիկ մուտք փաստաթուղթն ուղարկել հաստատման Verifier
      state = ConfirmContractDoc(2, docNumInput, c_SendToVer, 2, "Î³ï³ñ»É")
      
      If Not state Then
            Log.Error("Կանխիկ մուտք փաստաթուղթը չի ուղարկվել հաստատման")
            Exit Sub
      End If
      
      BuiltIn.Delay(2000)
      Call Close_Pttel("frmPttel")
      
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNInput  &_
                               " and fSUIDCOR = '-1' "&_
                               " and ((fOP = 'N' and fSTATE = '5') "&_
										           " or (fOP = 'M' and fSTATE = '101' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNInput  
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISNInput  &_
                                         " and fSTATE = '101' and fNAME = 'KasPrOrd'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISNInput  
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNInput  &_
                                         " and fNAME = 'KasPrOrd' and fCOM = 'Î³ÝËÇÏ Ùáõïù' and fECOM = 'Cash Deposit Advice'  "&_
                                         " and ((fSPEC = '²Ùë³ÃÇí- "&stDate&" N- "&docNumInput&" ¶áõÙ³ñ-             6,000.00 ²ñÅ.- 000 [àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý]' and fSTATUS = '0' ) "&_
                                         " or (fSPEC = '"&docNumInput&"77700000001100  7770036610090100         6000.00000àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý                                 77öáË³ÝóÙ³Ý ëïáõ·Ù³Ý                                              001                             ¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó ä³ÛÙ³Ý³·Çñª 1111' and fSTATUS = '0') "&_
                                         " or (fSPEC = '"&docNumInput&"77700000001100  7770036610090100         6000.00000  77¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó            ä³ÛÙ³Ý³·Çñª 1111                öáË³ÝóÙ³Ý ëïáõ·Ù³Ý' and fSTATUS = '4' ))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNInput  
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
      ' Մուտք Հաստատող I ԱՇՏ
      Call ChangeWorkspace(c_Verifier1)
      
      Set verifyDocuments = New_VerificationDocument()
            verifyDocuments.DocType = "KasPrOrd"
            verifyDocuments.User = "^A[Del]"
            verifyDocuments.Division = "00"
            verifyDocuments.Department = "1"
      Call GoToVerificationDocument("|Ð³ëï³ïáÕ I ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ",verifyDocuments)
      
      ' Վավերացնել Կանխիկ մուտքի փաստաթուղթը
      state = ConfirmContractDoc(3, docNumInput, c_ToConfirm, 1,  "Ð³ëï³ï»É")
      
      If Not state Then
            Log.Error("Կանխիկ մուտքի փաստաթուղթը չի վավերացվել")
            Exit Sub
      End If
      BuiltIn.Delay(1000)
      Call Close_Pttel("frmPttel") 
      
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNInput  &_
                               " and fSUIDCOR = '-1' "&_
                               " and ((fOP = 'N' and fSTATE = '5') "&_
					                     " or (fOP = 'M' and fSTATE = '101' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý') "&_
                               " or (fOP = 'W' and fSTATE = '102') "&_
                               " or (fOP = 'C' and fSTATE = '15'))"
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNInput 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISNInput  &_
                                         " and fSTATE = '15' and fNAME = 'KasPrOrd'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISNInput  
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNInput  &_
                                         " and fNAME = 'KasPrOrd' and fCOM = 'Î³ÝËÇÏ Ùáõïù' and fECOM = 'Cash Deposit Advice' and fSTATUS = '4' "&_
                                         " and ((fSPEC = '²Ùë³ÃÇí- "&stDate&" N- "&docNumInput&" ¶áõÙ³ñ-             6,000.00 ²ñÅ.- 000 [Ð³ëï³ïí³Í]')"&_
                                         " or (fSPEC = '"&docNumInput&"77700000001100  7770036610090100         6000.00000Ð³ëï³ïí³Í                                             77öáË³ÝóÙ³Ý ëïáõ·Ù³Ý              AA000044 001 01/01/2000                                         ¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó ä³ÛÙ³Ý³·Çñª 1111')) "
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNInput
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
      ' Մուտք ադմինիստրատորի ԱՇՏ4.0
      Call ChangeWorkspace(c_Admin40)
      
      ' Մուտք Աշխատանքային փաստաթղթեր թղթապանակ
      workEnvName = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      workEnv = "Աշխատանքային փաստաթղթեր "
      state = AccessFolder(workEnvName, workEnv, "PERN", stDate, "PERK", stDate, False, isnRekName, fISNInput)
      
      ' Վավերացնել Կանխիկ մուտք փաստաթուղթը
      state = ConfirmContractDoc(2, docNumInput, c_ToConfirm, 1, "Ð³ëï³ï»É")
      
      If Not state Then
            Log.Error("Կանխիկ մուտքի փաստաթուղթը չի վավերացվել")
            Exit Sub
      End If
      BuiltIn.Delay(1000)
      Call Close_Pttel("frmPttel")
      
                ' DOCLOG 
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNInput  &_
                               " and fSUIDCOR = '-1' "&_
                               " and ((fOP = 'N' and fSTATE = '5') "&_
					                     " or (fOP = 'M' and fSTATE = '101' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý') "&_
                               " or (fOP = 'W' and fSTATE = '102') "&_
                               " or (fOP = 'C' and fSTATE = '15') "&_
                               " or (fOP = 'W' and fSTATE = '16') "&_
                               " or (fOP = 'M' and fSTATE = '11' and fCOM = '¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ'))"
                sqlValue = 6
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNInput
                sqlValue = 6
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISNInput  &_
                                         " and fSTATE = '11' and fNAME = 'KasPrOrd'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISNInput  
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNInput  
                sqlValue = 0
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & fISNInput  &_
                                         " and fTYPE = '01' and fSUM = '6000.00' and fCUR = '000' and fCURSUM = '6000.00' "&_
                                         " and fOP = 'FEE' and ((fDBCR = 'D' and fSPEC = '" & docNumInput & kassNish &"                ¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó              1     1.0000    1' ) "&_
                                         " or (fDBCR = 'C' and fSPEC = '"&docNumInput&"                   ¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó              0     1.0000    1                                                                        öáË³ÝóÙ³Ý ëïáõ·Ù³Ý')) "
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & fISNInput 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIR
                queryString = " SELECT COUNT(*) FROM HIR WHERE fOBJECT = " & fISN  &_
                                         " and fTYPE = 'R^' and fCUR = '000' and fCURSUM = '6000.00' and fOP = 'PAY' and fDBCR = 'D' "&_
                                         " and fADB = '0' and fSPEC = '¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó' and fSUID = '77' and fTRANS = '3' "&_
                                         " and fBASEBRANCH = '00' and fBASEDEPART = '1' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIR
                queryString = " SELECT COUNT(*) FROM HIR WHERE fOBJECT = " & fISN  
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIRREST
                queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " & fISN  &_
                                         " and fTYPE = 'R^' and fLASTREM = '6000.00' and fPENULTREM = '0.00' and fSTARTREM = '0.00'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIRREST
                queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " & fISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' PAYMENTS
                queryString = " SELECT COUNT(*) FROM PAYMENTS WHERE fISN = " & fISNInput  &_
                                         " and fSTATE = '11' and fDOCNUM = '"&docNumInput&"' and fCLIENT = '00034851' "&_
                                         " and fPAYER = 'öáË³ÝóÙ³Ý ëïáõ·Ù³Ý' and fCUR = '000' and fSUMMA = '6000.00' and fSUMMAAMD = '6000.00' "&_
                                         " and fSUMMAUSD = '15.00' and fCOM  = '¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó ä³ÛÙ³Ý³·Çñª 1111' and fCHARGESUM = '0.00' "&_
                                         " and fCHARGESUMAMD = '0.00' and fCHARGESUM2 = '0.00' and fCHARGESUMAMD2 = '0.00' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' PAYMENTS
                queryString = " SELECT COUNT(*) FROM PAYMENTS WHERE fISN = " & fISNInput  
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
      ' Մուտք գործել վարկեր տեղաբաշխված
      Call ChangeWorkspace(c_Loans)
      
      Set ContractsFilter = New_ContractsFilter()
      ContractsFilter.AgreementN = docNum
      ContractsFilter.AgreementLevel = "1"

      Call Check_AgreementExisting("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|", contractsFilter)
      BuiltIn.Delay(1000)
      
      ' Տոկոսների հաշվարկ
      Call PercentCalculation(stDate,stDate, percentMoney, calcfISN )
      Log.Message("Տոկոսների հաշվարկ փաստաթղթի ISN` " & calcfISN)
     
               ' CAGRACCS
                queryString = " SELECT COUNT(*) FROM CAGRACCS WHERE fAGRISN = " & fISN
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & calcfISN  &_
                                         " and fSUID = '77' and fSUIDCOR = '-1' and fDCRID = '0' " &_
                                         " and ((fOP = 'N' and fSTATE = '1') " &_
                                         " or (fOP = 'M' and fSTATE = '99') " &_
                                         " or (fOP = 'T' and fSTATE = '2') " &_
                                         " or (fOP = 'C' and fSTATE = '5'))"
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & calcfISN  
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISN  &_
                                         " and fSTATE = '7' and fNAME = 'C1Univer' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISN  
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISN    &_
                                         " and fNAME = 'C1Univer'  and fSTATUS = '1' " &_
                                         " and ((fCOM = '¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ' and  fECOM = '' and fSPEC = '1¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ- "&docNum&" {öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1}') " &_
                                         " or (fCOM = ' ¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ' and  fECOM = '1' and fSPEC = '"&docNum&" (öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1),     15000 - ²ØÜ ¹áÉ³ñ') " &_
                                         " or (fCOM = 'öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1' and  fECOM = '' and fSPEC = 'C18"&docNum&"      1111                              0                                                                                                                                                             0.00') " &_
                                         " or (fCOM = 'öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1' and  fECOM = '' and fSPEC = '0'))"
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISN 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & calcfISN  &_
                                         " and fTYPE = '01' and fSUM = '820.00' and fOP = 'PRC' and fTRANS = '1' " &_
                                         " and fBASEBRANCH = '00' and fBASEDEPART = '1' " &_
                                         " and ((fCUR = '000' and fCURSUM = '820.00' and fDBCR = 'C' and fSPEC = '                         âû·ï. Ù³ëÇ ïáÏáëÇ Ñ³ßí³ñÏáõÙ      0     1.0000    1') " &_
                                         " or (fCUR = '001' and fCURSUM = '2.05' and fDBCR = 'D' and fSPEC = '                         âû·ï. Ù³ëÇ ïáÏáëÇ Ñ³ßí³ñÏáõÙ      1   400.0000    1')) "
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & calcfISN 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                 ' HIF
                queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & calcfISN  &_
                                         " and fTYPE = 'N0' and fSUM = '0.00' and fCURSUM = '0.00' and fOP = 'DTC' and fADB = '0' "&_
                                         " and fTRANS = '1'  and fBASEDEPART = '1' and fBASEBRANCH = '00' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIF
                queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & calcfISN  
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIR
                queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & calcfISN  &_
                                         " and fTYPE = 'RH' and fCUR = '001' and fCURSUM = '2.05' and fOP = 'PER' "&_
                                         " and fDBCR = 'D' and fADB = '0' and fSPEC = 'âû·ï. Ù³ëÇ ïáÏáëÇ Ñ³ßí³ñÏáõÙ' "&_
                                         " and fTRANS = '1'  and fBASEDEPART = '1' and fBASEBRANCH = '00' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIR
                queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & calcfISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIRREST
                queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " & fISN  &_
                                         " and fPENULTREM = '0.00' and fSTARTREM = '0.00' "&_
                                         " and ((fTYPE = 'RH' and fLASTREM = '2.05') "&_
                                         " or (fTYPE = 'R^' and fLASTREM = '6000.00'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIRREST
                queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " & fISN  
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIT
                queryString = " SELECT COUNT(*) FROM HIT WHERE fOBJECT = " & fISN  &_
                                         " and fCUR = '001' and fOP = 'PER' and fDBCR = 'D' and fSPEC = 'Îáõï³ÏáõÙ' "&_
                                         " and ((fTYPE = 'N2' and fCURSUM = '0.00') "&_
                                         " or (fTYPE = 'NH' and fCURSUM = '2.05')) "
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIT
                queryString = " SELECT COUNT(*) FROM HIT WHERE fOBJECT = " & fISN 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
      ' Վարկի տրամադրում 
      stDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today-14,"%d%m%y") 
      forSQL = aqConvert.DateTimeToFormatStr(aqDateTime.Today-14,"20%y%m%d") 
      Call SupplyCredit(docNumLoan, fISNLoan, stDate, "1", docNumOut, fISNOut, accCor)
      Log.Message("Վարկի Տրամադրում փաստաթղթի համար՝  " & docNumLoan)
      Log.Message("Վարկի Տրամադրում փաստաթղթի ISN`  " & fISNLoan)
      Log.Message("Վարկի Տրամադրում Կանխիկ ելք փաստաթղթի համար՝  " & docNumOut)
      Log.Message("Վարկի Տրամադրում Կանխիկ ելք փաստաթղթի ISN`  " & fISNOut)
      
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNLoan  &_
                                         " and fSUID = '77' and fSUIDCOR = '-1'  "&_
                                         " and ((fOP = 'N' and fSTATE = '1' and fDCRID = '0') "&_
                                         " or (fOP = 'M' and fSTATE = '99' and fDCRID = '0') "&_
                                         " or (fOP = 'C' and fSTATE = '1' and fDCRID = '0') "&_
                                         " or (fOP = 'M' and fSTATE = '1' and fDCRID = '-1') "&_
                                         " or (fOP = 'C' and fSTATE = '1' and fDCRID = '0'))"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNLoan 
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 

                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISNLoan  &_
                                         " and fSTATE = '1' and fNAME = 'C1DSAgr '  and fBODY = '"& vbCRLF _
                                      & "CODE:"&docNum& vbCRLF _
                                      & "DATE:"& forSQL & vbCRLF _
                                      & "SUMMA:15000"& vbCRLF _
                                      & "CASHORNO:1"& vbCRLF _
                                      & "COMMENT:ì³ñÏÇ ïñ³Ù³¹ñáõÙ"& vbCRLF _
                                      & "ACSBRANCH:00"& vbCRLF _
                                      & "ACSDEPART:1"& vbCRLF _
                                      & "ACSTYPE:C10"& vbCRLF _
                                      & "USERID:  77"& vbCRLF _
                                      & "SYSTEMTYPE:1"& vbCRLF _
                                      & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISNLoan 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISNOut  &_
                                         " and fSTATE = '5' and fNAME = 'KasRsOrd'  and fBODY like  '"& vbCRLF _
                                      & "ACSBRANCH:00"& vbCRLF _
                                      & "ACSDEPART:1"& vbCRLF _
                                      & "BLREP:0"& vbCRLF _
                                      & "OPERTYPE:MSC"& vbCRLF _
                                      & "TYPECODE:20,21,27,90,99"& vbCRLF _
                                      & "USERID:  77"& vbCRLF _
                                      & "DOCNUM:"& docNumOut & vbCRLF _
                                      & "DATE:"& forSQL & vbCRLF _
                                      & "ACCDB:%%%%%%%%%%%"& vbCRLF _
                                      & "CUR:001"& vbCRLF _
                                      & "KASSA:001"& vbCRLF _
                                      & "ACCCR:000001101"& vbCRLF _
                                      & "SUMMA:15000"& vbCRLF _
                                      & "TOTAL:15000"& vbCRLF _
                                      & "KASSIMV:051"& vbCRLF _
                                      & "BASE:ä³ÛÙ³Ý³·Çñª 1111"& vbCRLF _
                                      & "AIM:ì³ñÏÇ ïñ³Ù³¹ñáõÙ"& vbCRLF _
                                      & "CLICODE:00034851"& vbCRLF _
                                      & "RECEIVER:öáË³ÝóÙ³Ý"& vbCRLF _
                                      & "RECEIVERLASTNAME:ëïáõ·Ù³Ý"& vbCRLF _
                                      & "PASSNUM:AA000044"& vbCRLF _
                                      & "PASTYPE:01"& vbCRLF _
                                      & "PASBY:001"& vbCRLF _
                                      & "DATEPASS:20000101"& vbCRLF _
                                      & "DATEEXPIRE:20300101"& vbCRLF _
                                      & "DATEBIRTH:19700101"& vbCRLF _
                                      & "CITIZENSHIP:1"& vbCRLF _
                                      & "COUNTRY:AM"& vbCRLF _
                                      & "COMMUNITY:010010635"& vbCRLF _	
                                      & "CITY:ºñ¨³Ý"& vbCRLF _
                                      & "ADDRESS:ºñ¨³Ý"& vbCRLF _
                                      & "FROMPAYORD:0"& vbCRLF _
                                      & "ACSBRANCHINC:00"& vbCRLF _
                                      & "ACSDEPARTINC:1"& vbCRLF _
                                      & "FRSHNOCRG:0"& vbCRLF _
                                      & "NONREZ:0"& vbCRLF _
                                      & "PAYSYSIN:Ð"& vbCRLF _
                                      & "SYSCASE:SubSys"& vbCRLF _
                                      & "NOTSENDABLE:0"& vbCRLF _
                                      & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISNOut 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNLoan  &_
                                         " and fNAME = 'C1DSAgr '  and fSTATUS = '1' and fCOM = 'ì³ñÏÇ ïñ³Ù³¹ñáõÙ'"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNLoan 
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNOut  &_
                                         " and fNAME = 'KasRsOrd '  and fSTATUS = '5' and fCOM = 'Î³ÝËÇÏ »Éù'"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNOut  
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & fISNOut  &_
                                         " and fTYPE = '11' and fSUM = '6000000.00' and fOP = 'MSC' and fTRANS = '0' " &_
                                         " and fBASEBRANCH = '' and fBASEDEPART = '' and fCURSUM = '15000.00' and fCUR = '001'  " &_
                                         " and ((fDBCR = 'C' and fSPEC = '"&docNumOut&"                   ì³ñÏÇ ïñ³Ù³¹ñáõÙ                  1   400.0000    1') " &_
                                         " or (fDBCR = 'D' and fSPEC = '"&docNumOut&"                   ì³ñÏÇ ïñ³Ù³¹ñáõÙ                  0   400.0000    1')) "
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & fISNOut 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCP
                queryString = " SELECT COUNT(*) FROM DOCP WHERE fISN = " & fISNOut  &_
                                         " and fNAME = 'KasRsOrd' and fPARENTISN = '"&fISNLoan&"'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCP
                queryString = " SELECT COUNT(*) FROM DOCP WHERE fISN = " & fISNOut  
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
      ' Մուտք ադմինիստրատորի ԱՇՏ4.0
      Call ChangeWorkspace(c_Admin40)
      
      ' Մուտք Աշխատանքային փաստաթղթեր թղթապանակ
      workEnvName = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      workEnv = "Աշխատանքային փաստաթղթեր "
      state = AccessFolder(workEnvName, workEnv, "PERN", stDate, "PERK", stDate, False, isnRekName, fISNOut)
      
      If Not state Then
            Log.Error("Մուտք Աշխատանքային փաստաթղթեր թղթապանակ ձախողվել է")
            Exit Sub
      End If
      
      ' Վավերացնել Կանխիկ ելք փաստաթուղթը
      state = ConfirmContractDoc(2, docNumOut, c_ToConfirm, 1, "Ð³ëï³ï»É")
      
      If Not state Then
            Log.Error("Կանխիկ ելք փաստաթուղթը չի ուղարկվել հաստատման")
      End If
      BuiltIn.Delay(2000)
      Call Close_Pttel("frmPttel")
'      
'                ' FOLDERS
'                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNOut  &_
'                                         " and fSUID = '77' and ((fOP = 'N' and fSTATE = '5' and fCOM = '') " &_
'                                         " or (fOP = 'M' and fSTATE = '99' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý') " &_
'                                         " or (fOP = 'C' and fSTATE = '101' and fCOM = ''))"
'                sqlValue = 3
'                colNum = 0
'                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
'                If Not sql_isEqual Then
'                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
'                End If 
'                
'                ' DOCS
'                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISNOut  &_
'                                         " and fNAME = 'KasRsOrd' and fSTATE = '101' and fNEXTTRANS = '1'"
'                sqlValue = 1
'                colNum = 0
'                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
'                If Not sql_isEqual Then
'                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
'                End If 
'                
'                ' FOLDERS
'                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & fISNOut  &_
'                                          " and fNAME = 'KasRsOrd' and fCOM = 'Î³ÝËÇÏ »Éù' and fECOM = 'Cash Withdrawal Advice' " &_
'                                          " and ((fSTATUS = '0' and fSPEC = '²Ùë³ÃÇí- 02/09/21 N- "&docNumOut&" ¶áõÙ³ñ-            15,000.00 ²ñÅ.- 001 [àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý]') " &_
'                                          " or (fSTATUS = '0' and fSPEC = '"&docNumOut&"157000001949162015700000001101          15000.00001àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý                                 77öáË³ÝóÙ³Ý ëïáõ·Ù³Ý              AA000044 001 01/01/2000         001                    Ð        ì³ñÏÇ ïñ³Ù³¹ñáõÙ ä³ÛÙ³Ý³·Çñª 1111') " &_
'                                          " or (fSTATUS = '4' and fSPEC = '"&docNumOut&"157000001949162015700000001101          15000.00001  77ì³ñÏÇ ïñ³Ù³¹ñáõÙ                ä³ÛÙ³Ý³·Çñª 1111                öáË³ÝóÙ³Ý ëïáõ·Ù³Ý                     Ð'))"
'                sqlValue = 3
'                colNum = 0
'                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
'                If Not sql_isEqual Then
'                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
'                End If 
''      
'      ' Մուտք Հաստատող I ԱՇՏ
'      Call ChangeWorkspace(c_Verifier1)
'      
'      ' Մուտք հաստատվող վճարային փաստաթղթեր թղթապանակ      
'      Set verifyDocuments = New_VerificationDocument()
'            verifyDocuments.DocType = "KasRsOrd"
'            verifyDocuments.User = "^A[Del]"
'            verifyDocuments.Division = "00"
'            verifyDocuments.Department = "1"
'      Call GoToVerificationDocument("|Ð³ëï³ïáÕ I ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ",verifyDocuments)
'      
'      If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Exists Then
'            Log.Error("Հաստատվող վճարային փաստաթղթեր թղթապանակը չի բացվել")
'            Exit Sub
'      End If
'      
'      ' Վավերացնել Կանխիկ ելք փաստաթուղթը
'      state = ConfirmContractDoc(3, docNumOut, c_ToConfirm, 1, "Ð³ëï³ï»É")
'      
'      If Not state Then
'            Log.Error("Կանխիկ ելք փաստաթուղթը չի վավերացվել")
'            Exit Sub
'      End If
'      BuiltIn.Delay(1500)
'      Call Close_Pttel("frmPttel")
      
                ' AGRSCHEDULE
                queryString = " SELECT COUNT(*) FROM AGRSCHEDULE WHERE fAGRISN = " & fISN &_
                                          " and fTYPE = '0' and fSUID = '77' " &_
                                          " and ((fINC = '1' and fKIND = '9') " &_
                                          " or (fINC = '2' and fKIND = '3'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' AGRSCHEDULE
                queryString = " SELECT COUNT(*) FROM AGRSCHEDULE WHERE fAGRISN = " & fISN 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' AGRSCHEDULEVALUES
                queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN = " & fISN 
                sqlValue = 196
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNLoan 
                sqlValue = 9
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISNOut 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISNOut &_
                                          " and fNAME = 'KasRsOrd' and fSTATE = '14' and fNEXTTRANS = '1' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISNOut 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & fISNOut &_
                                          " and fTYPE = '01' and fSUM = '6000000.00' and fOP = 'MSC' and fTRANS = '0' " &_
                                          " and fBASEBRANCH = '00' and fBASEDEPART = '1' and fCURSUM = '15000.00' and fCUR = '001'  " &_
                                          " and ((fDBCR = 'C' and fSPEC = '"&docNumOut&"051                ì³ñÏÇ ïñ³Ù³¹ñáõÙ                  1   400.0000    1') " &_
                                          " or (fDBCR = 'D' and fSPEC = '"&docNumOut&"                   ì³ñÏÇ ïñ³Ù³¹ñáõÙ                  0   400.0000    1                                                                        öáË³ÝóÙ³Ý ëïáõ·Ù³Ý')) "
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & fISNOut 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIR
                queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & fISNLoan &_
                                          " and fCUR = '001' and fADB = '0' and fTRANS = '3' and fBASEBRANCH = '00' and fBASEDEPART = '1' " &_
                                          " and ((fTYPE = 'R1' and fCURSUM = '15000.00' and fOP = 'AGR' and fDBCR = 'D') " &_
                                          " or (fTYPE = 'R¾' and fCURSUM = '15.00' and fOP = 'PAY' and fDBCR = 'C'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIR
                queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & fISNLoan 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIR
                queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & fISN
                sqlValue = 19
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIRREST
                queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " & fISN &_
                                          " and fPENULTREM = '0.00' and fSTARTREM = '0.00' " &_
                                          " and ((fTYPE = 'R1' and fLASTREM = '15000.00') " &_
                                          " or (fTYPE = 'RH' and fLASTREM = '2.05') " &_
                                          " or (fTYPE = 'R^' and fLASTREM = '6000.00') " &_
                                          " or (fTYPE = 'R¾' and fLASTREM = '-15.00'))"
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIRREST
                queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " & fISN 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' PAYMENTS
                queryString = " SELECT COUNT(*) FROM PAYMENTS WHERE fISN = " & fISNOut &_
                                          " and fSTATE = '14' and fPAYER = 'öáË³ÝóÙ³Ý ëïáõ·Ù³Ý' and fCUR = '001' " &_
                                          " and fSUMMA = '15000.00' and fSUMMAAMD = '6000000.00' and fSUMMAUSD = '15000.00' " &_
                                          " and fCOM = 'ì³ñÏÇ ïñ³Ù³¹ñáõÙ ä³ÛÙ³Ý³·Çñª 1111' and fCHARGESUM = '0.00' " &_
                                          " and fCHARGESUMAMD = '0.00' and fCHARGESUM2 = '0.00' and fCHARGESUMAMD2 = '0.00'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' PAYMENTS
                queryString = " SELECT COUNT(*) FROM PAYMENTS WHERE fISN = " & fISNOut 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
      ' Մուտք գործել վարկեր տեղաբաշխված
      Call ChangeWorkspace(c_Loans)

      Set contractsFilter = New_ContractsFilter()
      contractsFilter.AgreementN = docNum
      contractsFilter.AgreementLevel = "1"
      
      BuiltIn.Delay(1500)
      Call GoTo_Contracts("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|", contractsFilter)
      
      ' Տոկոսների հաշվարկ
      stDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today-1,"%d%m%y") 
      forSQL = aqConvert.DateTimeToFormatStr(aqDateTime.Today-1,"20%y%m%d") 
      Call PercentCalculation(stDate,stDate, percentMoney, calcfISN)
      Log.Message("Տոկոսների հաշվարկ փաստաթղթի ISN`" & calcfISN)
      
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & calcfISN &_
                                          " and fSUID = '77' and fSUIDCOR = '-1' and fDCRID = '0' " &_
                                          " and ((fOP = 'N' and fSTATE = '1' and fCOM = '') " &_
                                          " or (fOP = 'M' and fSTATE = '99' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý') " &_
                                          " or (fOP = 'T' and fSTATE = '2' and fCOM = '') " &_
                                          " or (fOP = 'C' and fSTATE = '5' and fCOM = ''))"
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & calcfISN 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & calcfISN &_
                                          " and fSTATE = '5' and fNEXTTRANS = '2' and fNAME = 'C1DSChrg' and fBODY = '"& vbCRLF _
                                          & "CODE:"& Trim(docNumLoan) & vbCRLF _
                                          & "DATECHARGE:"& forSQL & vbCRLF _
                                          & "DATE:"& forSQL &  vbCRLF _
                                          & "SUMEFFINC:0.54/0"& vbCRLF _
                                          & "SUMPER:57.53/0.00"& vbCRLF _
                                          & "SUMALLPER:57.53/0"& vbCRLF _
                                          & "COMMENT:îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ"& vbCRLF _
                                          & "ACSBRANCH:00"& vbCRLF _
                                          & "ACSDEPART:1"& vbCRLF _
                                          & "ACSTYPE:C10"& vbCRLF _
                                          & "USERID:  77"& vbCRLF _
                                          & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & calcfISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & calcfISN &_
                                          " and fTYPE = '01' and fOP = 'PRC' and fTRANS = '1' " &_
                                         " and ((fSUM = '23228.00' and fCURSUM = '23228.00' and fDBCR = 'C' and fSPEC = '                         ²ñ¹ÛáõÝ³í»ï ïáÏáëÇ Ñ³ßí³ñÏáõÙ, îáÏ0     1.0000    1') " &_
                                         " or (fSUM = '23228.00' and fCURSUM = '58.07' and fDBCR = 'D' and fSPEC = '                         ²ñ¹ÛáõÝ³í»ï ïáÏáëÇ Ñ³ßí³ñÏáõÙ, îáÏ1   400.0000    1') " &_
                                         " or (fSUM = '23012.00' and fCURSUM = '57.53' and fDBCR = 'C' and fSPEC = '                         îáÏáëÇ Ñ³ßí³ñÏáõÙ                 1   400.0000    1') " &_
                                         " or (fSUM = '23012.00' and fCURSUM = '57.53' and fDBCR = 'D' and fSPEC = '                         îáÏáëÇ Ñ³ßí³ñÏáõÙ                 0   400.0000    1'))"
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & calcfISN 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIF
                queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & calcfISN &_
                                          " and fTYPE = 'N0' and fSUM = '0.00' and fCURSUM = '0.00' and fOP = 'DTC' " &_
                                          " and fBASEBRANCH = '00' and fBASEDEPART = '1' and fTRANS = '1'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIF
                queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & calcfISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                
                ' HIR
                queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & calcfISN &_
                                          " and fCUR = '001' and fDBCR = 'D' and fADB = '0' " &_
                                          " and ((fTYPE = 'R2' and fCURSUM = '57.53' and fOP = 'PER' and fSPEC = 'îáÏáëÇ Ñ³ßí³ñÏáõÙ') " &_
                                          " or (fTYPE = 'R¸' and fCURSUM = '57.53' and fOP = 'PRJ' and fSPEC = 'Ä³ÙÏ»ï³Ýó ïáÏáëÇ Ó¨³íáñáõÙ') " &_
                                          " or (fTYPE = 'R¾' and fCURSUM = '0.54' and fOP = 'PER' and fSPEC = '²ñ¹ÛáõÝ³í»ï ïáÏáëÇ Ñ³ßí³ñÏáõÙ') " &_
                                          " or (fTYPE = 'RÂ' and fCURSUM = '2.05' and fOP = 'NCJ' and fSPEC = 'âû·ï. Ù³ëÇ Å³ÙÏ»ï³Ýó ïáÏáëÇ Ó¨³íáñáõÙ') " &_
                                          " or (fTYPE = 'RÄ' and fCURSUM = '306.12' and fOP = 'AGJ' and fSPEC = 'Ä³ÙÏ»ï³Ýó ·áõÙ³ñÇ Ó¨³íáñáõÙ'))"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                 ' HIR
                queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & calcfISN 
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIRREST
                queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " & fISN 
                sqlValue = 8
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIT
                queryString = " SELECT COUNT(*) FROM HIT WHERE fOBJECT = " & fISN &_
                                          " and fCUR = '001' and fOP = 'PER' and fDBCR = 'D' and fADB = '0' " &_
                                          " and fSUID = '77' and fTRANS = '1' and fSPEC = 'Îáõï³ÏáõÙ' " &_
                                          " and ((fTYPE = 'N2' and fCURSUM = '0.00') " &_
                                          " or (fTYPE = 'NH' and fCURSUM = '2.05') " &_
                                          " or (fTYPE = 'N2' and fCURSUM = '57.53') " &_
                                          " or (fTYPE = 'N¾' and fCURSUM = '0.54'))"    
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIT
                queryString = " SELECT COUNT(*) FROM HIT WHERE fOBJECT = " & fISN 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
      BuiltIn.Delay(2000)
      Call Close_Pttel("frmPttel")
      
      ' Մուտք ՀԾ-Վճարումներ ԱՇՏ 
      ' Ավելացնել §ՀԾ-Վճարումներ¦-ի մասնակից
      Call ChangeWorkspace(c_ASPayments)
      
      Set partOfPayments = New_ASPartOfPayments()
      With partOfPayments
              .wCode = "77700"
              .wName = "Ø»ñ ´³ÝÏÁ"
              .eName = "Our Bank"
      End With
      
      Call Fill_ASPartOfPayments(partOfPayments)
      
               ' TREES
                queryString = " SELECT COUNT(*) FROM TREES WHERE fCODE = '77700' " &_
                                          " and fNAME = 'Ø»ñ ´³ÝÏÁ' and fENAME = 'Our Bank' "    
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 

      ' Վճարող կազմակերպությունների կարգավորումներ փաստաթղթի ստեղծում
      Set payerCompanies =  New_SettingsForPayerCompanies(2,2,2)
      With payerCompanies
          .partCode = "77700"
          .cliCode = "00034851"
          .partName = "öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1"
          .eName = "Client 1"
          .partKey = "1234567"
          .ourKey = "1234567"
          .dateClose = "ê"
          .payloanCnt = "2"
          .wCurr(0) = "001"
          .wCurr(1) = "000"
          .lowerLimit(0) = "10"
          .upperLimit(0) = "10000000"
          .upperLimit(1) = "10000000"
          .lowerLimit(1) = "10"
          .accDebt2(0) = "30220042300"
          .accDebt2(1) = "03485190101"
          .accDebt(0) = "30220042300"
          .accDebt(1) = "03485190101"
          .getLoan = 1
          .getByPas = 1
          .payLoan = 1
      End With
      
      Call Fill_SettingsForPayerCompanies(payerCompanies)
      Log.Message("Վճարող կազմակերպությունների կարգավորումներ փաստաթղթի ISN` " & payerCompanies.payerCompISN)
      BuiltIn.Delay(4000)
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & payerCompanies.payerCompISN &_
                                          " and ((fOP = 'N' and fSTATE = '1') or (fOP = 'C' and fSTATE = '2')) "    
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & payerCompanies.payerCompISN 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
               ' DOCP
                queryString = " SELECT COUNT(*) FROM DOCP WHERE fPARENTISN = " & payerCompanies.payerCompISN     
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & payerCompanies.payerCompISN &_
                                          "and fNAME = 'ISIOpts ' and fBODY = '"& vbCRLF _
                                      & "PARTCODE:77700"& vbCRLF _
                                      & "CLICODE:00034851"& vbCRLF _
                                      & "PARTNAME:öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1"& vbCRLF _
                                      & "PARTENAME:Client 1"& vbCRLF _
                                      & "PARTKEY:1234567"& vbCRLF _
                                      & "OURKEY:1234567"& vbCRLF _
                                      & "PAYSYS:ê"& vbCRLF _
                                      & "GETLOAN:1"& vbCRLF _
                                      & "GETLOANP:0"& vbCRLF _
                                      & "GETBYPAS:1"& vbCRLF _
                                      & "SHOWBASESUMS:0"& vbCRLF _
                                      & "PAYLOAN:1"& vbCRLF _
                                      & "PAYLOANP:0"& vbCRLF _
                                      & "PAYLOANCNT:2"& vbCRLF _
                                      & "GETCREDIT:0"& vbCRLF _
                                      & "SHOWPHONESCR:0"& vbCRLF _
                                      & "SHOWBALANCECR:0"& vbCRLF _
                                      & "CRDISB:0"& vbCRLF _
                                      & "GETACC:0"& vbCRLF _
                                      & "GETACCBYCARD:0"& vbCRLF _
                                      & "GETACCP:0"& vbCRLF _
                                      & "SHOWRESTR:0"& vbCRLF _
                                      & "SHOWPHONES:0"& vbCRLF _
                                      & "SHOWBALANCE:0"& vbCRLF _
                                      & "FILLACC:0"& vbCRLF _
                                      & "FILLACCP:0"& vbCRLF _
                                      & "CASHAC:0"& vbCRLF _
                                      & "TRANSFER:0"& vbCRLF _
                                      & "TRANSFEREX:0"& vbCRLF _
                                      & "GETCARD:0"& vbCRLF _
                                      & "GETEXTCARD:0"& vbCRLF _
                                      & "FILLEMBNAME:0"& vbCRLF _
                                      & "TF2CARD:0"& vbCRLF _
                                      & "TF2EXTCARD:0"& vbCRLF _
                                      & "CASHOUT:0"& vbCRLF _
                                      & "CASHACS:0"& vbCRLF _
                                      & "CASHOUTBYPHN:0"& vbCRLF _
                                      & "CASHACSBYPHN:0"& vbCRLF _
                                      & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If   
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & payerCompanies.payerCompISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If     
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & payerCompanies.payerCompISN &_
                                         " and fNAME = 'ISIOpts' and ((fCOM = 'ì×³ñáÕ Ï³½Ù³Ï»ñåáõÃÛáõÝÝ»ñÇ Ï³ñ·³íáñáõÙÝ»ñ' and" &_
                                         " fECOM = 'Settings for Payer Companies' and fSPEC = '000277  Ð³ëï³ïí³Í')" &_
                                         " or (fCOM = 'öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1' and fECOM = 'Client 1'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If        
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & payerCompanies.payerCompISN 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If           
                
      ' Ստացող կազմակերպությունների կարգավորումներ փաստաթղթի ստեղծում
      Set recipientCompanies = New_SettingsForRecipientCompanies(2,1)
      With recipientCompanies
              .partCode = "77700"
              .partName = "öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1"
              .partEName = "Client 1"
              .partKey = "1234567"
              .endPoint = "http://appserverx64.armsoft.am/banktesting_Sona_IntegrationService/ASBankIntegrationService.svc"
              .ourKey = "1234567"
              .getLoan = 1
              .getByPas = 1
              .payLoan = 1
              .actType(0) = "1"
              .accDbt(0) = "30220042300"
              .actType(1) = "1"
              .accDbt(1) = "03485190101"
              .actionType(0) = "1"
              .wCurrency(0) = "000"
              .wActor(0) = "000434400"
      End With
      
      Call Fill_SettingsForRecipientCompanies(recipientCompanies)
      Log.Message("Վճարող կազմակերպությունների կարգավորումներ փաստաթղթի ISN` " & recipientCompanies.recCompISN)
      BuiltIn.Delay(4000)
      
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & recipientCompanies.recCompISN &_
                                          " and ((fOP = 'N' and fSTATE = '1') or (fOP = 'C' and fSTATE = '2')) "    
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & recipientCompanies.recCompISN 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
               ' DOCP
                queryString = " SELECT COUNT(*) FROM DOCP WHERE fPARENTISN = " & recipientCompanies.recCompISN     
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & recipientCompanies.recCompISN &_
                                          "and fNAME = 'ISOOpts' and fBODY = '"& vbCRLF _
                                          & "PARTCODE:77700"& vbCRLF _
                                          & "PARTNAME:öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1"& vbCRLF _
                                          & "PARTENAME:Client 1"& vbCRLF _
                                          & "PARTKEY:1234567"& vbCRLF _
                                          & "ENDPOINT:http://appserverx64.armsoft.am/banktesting_Sona_IntegrationService/ASBankIntegrationService.svc"& vbCRLF _
                                          & "OURCODE:77700"& vbCRLF _
                                          & "OURKEY:1234567"& vbCRLF _
                                          & "PAYSYS:ê"& vbCRLF _
                                          & "GETLOAN:1"& vbCRLF _
                                          & "GETLOANP:0"& vbCRLF _
                                          & "GETBYPAS:1"& vbCRLF _
                                          & "PAYLOAN:1"& vbCRLF _
                                          & "PAYLOANP:0"& vbCRLF _
                                          & "GETACC:0"& vbCRLF _
                                          & "GETACCBYCARD:0"& vbCRLF _
                                          & "GETACCP:0"& vbCRLF _
                                          & "FILLACC:0"& vbCRLF _
                                          & "FILLACCP:0"& vbCRLF _
                                          & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If    
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & recipientCompanies.recCompISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If    
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & recipientCompanies.recCompISN &_
                                          " and fNAME = 'ISOOpts' and ((fCOM = 'êï³óáÕ Ï³½Ù³Ï»ñåáõÃÛáõÝÝ»ñÇ Ï³ñ·³íáñáõÙÝ»ñ' and"&_ 
                                          " fECOM = 'Settings for Receiver Companies' and fSPEC = '000277  Ð³ëï³ïí³Í' and fSTATUS = '1')"&_
                                          " or (fCOM = 'öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1' and fECOM = 'Client 1' and fSTATUS = '0'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If    
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & recipientCompanies.recCompISN 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If         
                
      ' Մուտք Տոկոսների հաշվարկման ԱՇՏ
      Call ChangeWorkspace(c_PercentCalc)
      
      Log.Message "Մուտք Աշխատանքային փաստաթղթեր թղթապանակ" 
      ' Մուտք աշխատանքային փաստաթղթեր դիալոգ և արժեքների լրացում
      folderDirect = "|îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ²Þî|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      stDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
      forSQL = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"20%y%m%d")
      selectView = "Oper"
      exportExcel = "0"
      Call WorkingDocsFilter(folderDirect, stDate, stDate, wCur, wUser, docType, paySysin, paySysOut, payNotes, acsBranch, acsDepart, selectView, exportExcel)

      ' ՀԾ-Վճարումներ Պայմանագրի պարտքերի մարում գործողության կատարում
      Set repayDebts = New_RepaymentOfContractDebts ()
      With repayDebts
               .wPartner = "77700"
               .wPassport = ""
               .creditCode = ""
               .wContract = docNum
               .docNum = docNum
               .wAmount = "6000000"
               .passNum = "AA000044"
               .pasBy = "001"
               .datePress = "01012000"
               .dateBirth = "01011970"
               .birthPlace = "ºñ¨³Ý"
               .wAddress = "ºñ¨³Ý"
      End With

      Call Fill_RepaymentOfContractDebts(repayDebts)
      Log.Message("Պարտքերի մարում փաստաթղթի համարը` " & repayDebts.payDocNum)
      Log.Message("Պարտքերի մարում փաստաթղթի ISN` " & repayDebts.repayContrISN)
      
      BuiltIn.Delay(2000)
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & repayDebts.repayContrISN &_
                                          " and fOP = 'N' and fSTATE = '1' "    
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & repayDebts.repayContrISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & repayDebts.repayContrISN &_
                                          "and fNAME = 'OCOPay' and fBODY like '"& vbCRLF _
                                      & "ACSBRANCH:00"& vbCRLF _
                                      & "ACSDEPART:1"& vbCRLF _
                                      & "BLREP:0"& vbCRLF _
                                      & "USERID:  77"& vbCRLF _
                                      & "PAYSYS:ê"& vbCRLF _
                                      & "CUR:000"& vbCRLF _
                                      & "DOCNUM:"&repayDebts.payDocNum & vbCRLF _
                                      & "DATE:"&forSQL& vbCRLF _
                                      & "ACCDB:%%%%%%%%%%%%%%"& vbCRLF _
                                      & "CURDB:000"& vbCRLF _
                                      & "TCORRACC:%%%%%%%%%%%"& vbCRLF _
                                      & "PAYER:öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1"& vbCRLF _
                                      & "PASSNUM:AA000044"& vbCRLF _
                                      & "PASBY:001"& vbCRLF _
                                      & "DATEPASS:20000101"& vbCRLF _
                                      & "RECEIVER:öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1"& vbCRLF _
                                      & "COUNTRY:AM"& vbCRLF _
                                      & "SUMMA:6000000"& vbCRLF _
                                      & "AIM:ä³ñïù»ñÇ Ù³ñáõÙ (å³ÛÙ³Ý³·Çñ "& docNum &")"& vbCRLF _
                                      & "ACCTYPE:I"& vbCRLF _
                                      & "BMDOCNUM:%%%%%%%%%%"& vbCRLF _
                                      & "PAYDATE:"&forSQL& vbCRLF _
                                      & "ISPARTID:77700"& vbCRLF _
                                      & "ISPAYMENTID:1"& vbCRLF _
                                      & "ISCONTR:"& docNum & vbCRLF _
                                      & "ARUSALTFONT:0"& vbCRLF _
                                      & "NOTSENDABLE:0"& vbCRLF _
                                      & "CANCELREQ:0"& vbCRLF _
                                      & "CHRGACC:000001100"& vbCRLF _
                                      & "CHRGCUR:000"& vbCRLF _
                                      & "INCACC:000434400"& vbCRLF _
                                      & "PAYSYSIN:Ð"& vbCRLF _
                                      & "KASSA:001"& vbCRLF _
                                      & "KASSIMV:022"& vbCRLF _
                                      & "PAYER0:öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1"& vbCRLF _
                                      & "PASSNUM0:AA000044"& vbCRLF _
                                      & "PASBY0:001"& vbCRLF _
                                      & "DATEPASS0:20000101"& vbCRLF _
                                      & "BASE:AS-Payments"& vbCRLF _
                                      & "INSUM:6000000"& vbCRLF _
                                      & "INCUR:000"& vbCRLF _
                                      & "FORTRADE:0"& vbCRLF _
                                      & "TYPECODE1:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
                                      & "TYPECODE2:93 99 91 01"& vbCRLF _
                                      & "DATEBIRTH:19700101"& vbCRLF _
                                      & "BIRTHPLACE:ºñ¨³Ý"& vbCRLF _
                                      & "ADDRESS:ºñ¨³Ý"& vbCRLF _
                                      & "NONREZ:0"& vbCRLF _
                                      & "XSUMMAIN:6000000"& vbCRLF _
                                      & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If     
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & repayDebts.repayContrISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If  

                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & repayDebts.repayContrISN &_
                                          "and fTYPE = '11' and fSUM = '6000000.00' and fCURSUM = '6000000.00' "&_
                                          " and fOP = 'TRF' and (fDBCR = 'D' or fDBCR = 'C') and fCUR = '000'"    
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & repayDebts.repayContrISN 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & repayDebts.repayContrISN &_
                                          " and fNAME = 'OCOPay' and fCOM = 'ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (Online ¾ìÐ áõÕ.)'"&_
                                          " and (fSPEC = '   I  1ê"&forSQL&"      6000000.0000000000000                77700000001100  öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1                                                  "&_
                                          "                 AM            0.00ÊÙµ³·ñíáÕ               00177700            0.00 AS-Payments                                                                 0.00      77                                              Ð' "&_
                                          " or fSPEC = '"&repayDebts.payDocNum&"77700000001100  7770030220042300      6000000.00000ÊÙµ³·ñíáÕ                                             77öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ "&_
                                          "1   AA000044 001 01/01/2000                                Ðê       ä³ñïù»ñÇ Ù³ñáõÙ (å³ÛÙ³Ý³·Çñ "&docNum&") AS-Payments') "&_
                                          " and fECOM = 'Payment Order (Online EPS Send)' and fDCBRANCH = '00' and fDCDEPART = '1'"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If     
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & repayDebts.repayContrISN 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' IB_AGREEMENT_PAYMENT
                queryString = " SELECT COUNT(*) FROM IB_AGREEMENT_PAYMENT WHERE fCLIENT = '00034851'" &_
                                          "and fSTATE = '0' and fCURISO = 'AMD' and fTYPE = '0' and fAMOUNT = '6000000.00' "&_
                                          " and fPARTNERID = '77700'"    
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' IB_AGREEMENT_PAYMENT
                queryString = " SELECT COUNT(*) FROM IB_AGREEMENT_PAYMENT WHERE fCLIENT = '00034851'" 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
           
      ' Վավերացվել Վճարման հանձնարարագիր փաստաթուղթը 
      state = ConfirmContractDoc(2, repayDebts.payDocNum, c_ToConfirm, 1, "Ð³ëï³ï»É")
      
      If Not state Then
            Log.Error("Վճարման հանձնարարագիր փաստաթուղթը չի վավերացվել")
            Exit Sub
      End If
      BuiltIn.Delay(1000)
      Call Close_Pttel("frmPttel")
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & repayDebts.repayContrISN &_
                                          " and fNAME = 'OCOPay' and fCOM = 'ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (Online ¾ìÐ áõÕ.)'"&_
                                          " and (fSPEC = '   I  1ê"&forSQL&"      6000000.0000000000000                77700000001100  öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1                                                "&_
                                          "                   AM            0.00àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³    10177700            0.00 AS-Payments                                                                 0.00      77                                              Ð' "&_
                                          " or fSPEC = '"&repayDebts.payDocNum&"77700000001100  7770030220042300      6000000.00000àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³                                  77öáË³ÝóÙ³Ý ëïáõ·Ù³Ý "&_
                                          "Ñ³×³Ëáñ¹ 1   AA000044 001 01/01/2000                                Ðê       ä³ñïù»ñÇ Ù³ñáõÙ (å³ÛÙ³Ý³·Çñ "&docNum&") AS-Payments' "&_
                                          " or fSPEC = '"&repayDebts.payDocNum&"77700000001100  7770030220042300      6000000.00000  77ä³ñïù»ñÇ Ù³ñáõÙ (å³ÛÙ³Ý³·Çñ V-00öáË³ÝóÙ³Ý ëïáõ·Ù³Ý "&_
                                          "Ñ³×³Ëáñ¹ 1   öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1          Ðê') "&_
                                          " and fECOM = 'Payment Order (Online EPS Send)' and fDCBRANCH = '00' and fDCDEPART = '1'"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & repayDebts.repayContrISN 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & repayDebts.repayContrISN &_
                                          "and fTYPE = '01' and fSUM = '6000000.00' and fCURSUM = '6000000.00' "&_
                                          " and fOP = 'TRF' and (fDBCR = 'D' or fDBCR = 'C') and fCUR = '000'"    
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & repayDebts.repayContrISN 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & repayDebts.repayContrISN &_
                                          "and fSTATE = '101'"    
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & repayDebts.repayContrISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & repayDebts.repayContrISN &_
                                          " and fSUID = '77' and ((fOP = 'N' and fSTATE = '1' )"&_
                                          " or (fOP = 'W' and fSTATE = '2' )"&_
                                          " or (fOP = 'M' and fSTATE = '2' and fCOM = '¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ')"&_
                                          " or (fOP = 'M' and fSTATE = '2' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý')"&_
                                          " or (fOP = 'C' and fSTATE = '101' ))"    
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & repayDebts.repayContrISN 
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
      ' Մուտք Հաստատող I ԱՇՏ
      Call ChangeWorkspace(c_Verifier1)
      
      Set verifyDocuments = New_VerificationDocument()
            verifyDocuments.DocType = "OCOPay"
            verifyDocuments.User = "^A[Del]"
            verifyDocuments.Division = "00"
            verifyDocuments.Department = "1"
      Call GoToVerificationDocument("|Ð³ëï³ïáÕ I ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ",verifyDocuments)
      
      ' Վավերացնել Վճարման հանձնարարագիր փաստաթուղթը
      state = ConfirmContractDoc(3, repayDebts.payDocNum, c_ToConfirm, 1,  "Ð³ëï³ï»É")
      
      If Not state Then
            Log.Error("Վճարման հանձնարարագիր փաստաթուղթը չի վավերացվել")
            Exit Sub
      End If
      BuiltIn.Delay(1000)
      Call Close_Pttel("frmPttel") 
               
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & repayDebts.repayContrISN &_
                                          " and fSUID = '77' and ((fOP = 'N' and fSTATE = '1' )"&_
                                          " or (fOP = 'W' and fSTATE = '2' )"&_
                                          " or (fOP = 'M' and fSTATE = '2' and fCOM = '¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ')"&_
                                          " or (fOP = 'M' and fSTATE = '2' and fCOM = 'àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý')"&_
                                          " or (fOP = 'C' and fSTATE = '101' )"&_
                                          " or (fOP = 'W' and fSTATE = '102' )"&_
                                          " or (fOP = 'C' and fSTATE = '4' ))"    
                sqlValue = 7
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & repayDebts.repayContrISN 
                sqlValue = 7
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & repayDebts.repayContrISN &_
                                          "and fSTATE = '4'"    
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & repayDebts.repayContrISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & repayDebts.repayContrISN &_
                                          " and fNAME = 'OCOPay' and fCOM = 'ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (Online ¾ìÐ áõÕ.)' "&_
                                          " and fSPEC = '   I  1ê"&forSQL&"      6000000.0000000000000                77700000001100  öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1                                      "&_
                                          "                             AM            0.00Ð³ëï³ïí³Í               00477700            0.00 AS-Payments                                                                 0.00      77                                              Ð'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & repayDebts.repayContrISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' IB_AGREEMENT_PAYMENT
                queryString = " SELECT COUNT(*) FROM IB_AGREEMENT_PAYMENT WHERE fCLIENT = '00034851'" &_
                                          " and fSTATE = '8' and fCURISO = 'AMD' and fAMOUNT = '6000000.00' and fPARTNERID = '77700'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' IB_AGREEMENT_PAYMENT
                queryString = " SELECT COUNT(*) FROM IB_AGREEMENT_PAYMENT WHERE fCLIENT = '00034851'" 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' ONLINEEPS_DOCID
                queryString = " SELECT COUNT(*) FROM ONLINEEPS_DOCID WHERE fISN = " & repayDebts.repayContrISN &_
                                          " and fDocID = '1' and fPAYSYS = 'ê' and fDCRID = '0'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' ONLINEEPS_DOCID
                queryString = " SELECT COUNT(*) FROM ONLINEEPS_DOCID WHERE fISN = " & repayDebts.repayContrISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' PAYMENTS
                queryString = " SELECT COUNT(*) FROM PAYMENTS WHERE fISN = " & repayDebts.repayContrISN &_
                                          " and fDOCTYPE = 'OCOPay' and fSTATE = '4' and fPAYER = 'öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1' "&_
                                          " and fRECEIVER = 'öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1' and fCUR = '000' "&_
                                          " and fSUMMA = '6000000.00' and fSUMMAAMD = '6000000.00' and fSUMMAUSD = '15000.00' "&_
                                          "and fCOM = 'ä³ñïù»ñÇ Ù³ñáõÙ (å³ÛÙ³Ý³·Çñ "& docNum &") AS-Payments' and fKASCODE = '001' "&_
                                          "and fCOUNTRY = 'AM' and fCHARGECUR = '000' and fCHARGESUM = '0.00' and fCHARGESUMAMD = '0.00' "&_
                                          "and fCHARGESUM2 = '0.00' and fCHARGESUMAMD2 = '0.00' and fBRANCHEXP = '77700' and fTYPE = '3' "&_
                                          " and fACSBRANCH = '00' and fPAYCUR = '000'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' PAYMENTS
                queryString = " SELECT COUNT(*) FROM PAYMENTS WHERE fISN = " & repayDebts.repayContrISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
      ' Մուտք Հեռահար համակարգեր ԱՇՏ
      Call ChangeWorkspace(c_RemoteSyss)
      
      ' Մուտք Մշակման ենթանա մուտքային հաղորդագրություններ թղթապանակ
      Set incMessProcessed = New_IncMessToBeProcessed()
      With incMessProcessed
                .direction = "|Ð»é³Ñ³ñ Ñ³Ù³Ï³ñ·»ñ|Øß³ÏÙ³Ý »ÝÃ³Ï³ Ùáõïù³ÛÇÝ Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ(ÀÝ¹Ñ³Ýáõñ)"
                .sDate = stDate
                .eDate = stDate
                .sysTem = "3"
                .cliMask = "00034851"
      End With
            
      Call Fill_IncMessToBeProcessed(incMessProcessed)
      
     ' Մշակել Վճարման հանձնարարագիր փաստաթուղթը
      state = ConfirmContractDoc(0, "00034851", c_ToProcess, 5,  "²Ûá")
      Call Close_Pttel("frmPttel")
      
      forSQL = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"20%y%m%d") 
      
                ' AGRSCHEDULE
                queryString = " SELECT COUNT(*) FROM AGRSCHEDULE WHERE fAGRISN = " & fISN &_
                                          " and fTYPE = '0' and fSUID = '77' " &_
                                          " and ((fINC = '1' and fKIND = '9') " &_
                                          " or (fINC = '2' and fKIND = '3')" &_
                                          " or (fINC = '3' and fKIND = '2'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' AGRSCHEDULE
                queryString = " SELECT COUNT(*) FROM AGRSCHEDULE WHERE fAGRISN = " & fISN 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' AGRSCHEDULEVALUES
                queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN = " & fISN 
                sqlValue = 292
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & fISN 
                sqlValue = 8
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & fISN & _
                                        " and fSTATE = '7' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                queryString = "select fBASE from HIR where fOBJECT = '"&fISN&"' and fOP = 'CPD'"
                loanRepISN = Get_Query_Result(queryString)
  
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & loanRepISN & _
                                        " and fSUID = '77' and fSUIDCOR = '-1' and fDCRID = '0' "& _
                                        " and ((fOP = 'N' and fSTATE = '1') "& _
                                        " or (fOP = 'M' and fSTATE = '99') "& _
                                        " or (fOP = 'T' and fSTATE = '2') "& _
                                        " or (fOP = 'C' and fSTATE = '5')) "
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & loanRepISN 
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & loanRepISN & _
                                        " and fNAME = 'C1DSDebt' and fSTATE = '5' and fNEXTTRANS = '2'  and fBODY like '"& vbCRLF _
                                    & "CODE:"&docNum& vbCRLF _
                                    & "DATE:"& forSQL & vbCRLF _
                                    & "CORROFFPER:0"& vbCRLF _
                                    & "FILLSUMS:0"& vbCRLF _
                                    & "AMDSUMDBT:6000000"& vbCRLF _
                                    & "FROMIBSUM:16666.67"& vbCRLF _
                                    & "FROMIBSUMAMD:6000000"& vbCRLF _
                                    & "MSGDATE:"& forSQL & vbCRLF _
                                    & "MSGTIME:%%%%%%%%"& vbCRLF _
                                    & "REPAYCURR:2"& vbCRLF _
                                    & "SUMAGR:7071.61"& vbCRLF _
                                    & "AMDSUMAGR:2545780"& vbCRLF _
                                    & "SUMPER:57.53"& vbCRLF _
                                    & "AMDSUMPER:23012"& vbCRLF _
                                    & "SUMPAY:57.53"& vbCRLF _
                                    & "AMDSUMPAY:23012"& vbCRLF _
                                    & "SUMPERNCH:2.05"& vbCRLF _
                                    & "AMDSUMPERNCH:820"& vbCRLF _
                                    & "SUMCHRGPREMATURE:8575.97"& vbCRLF _
                                    & "AMDSUMCHRGPREMATURE:3430388"& vbCRLF _
                                    & "SUMMA:15707.16"& vbCRLF _
                                    & "CASHORNO:2"& vbCRLF _
                                    & "CURSONLINE:   360.0000/    1"& vbCRLF _
                                    & "CURS:400.0000/1"& vbCRLF _
                                    & "ISPUSA:0"& vbCRLF _
                                    & "CURTYPE:1"& vbCRLF _
                                    & "AMDACCCORR:%%%%%%%%%%%"& vbCRLF _
                                    & "APPLYCONNSCH:0"& vbCRLF _
                                    & "COMMENT:ì³ñÏÇ å³ñïù»ñÇ Ù³ñáõÙ(²éó³Ýó)"& vbCRLF _
                                    & "MARDOCISN:%%%%%%%%%"& vbCRLF _
                                    & "ACSBRANCH:00"& vbCRLF _
                                    & "ACSDEPART:1"& vbCRLF _
                                    & "ACSTYPE:C10"& vbCRLF _
                                    & "USERID:  77"& vbCRLF _
                                    & "MSGID:1"& vbCRLF _
                                    & "ISOCOD:AMD"& vbCRLF _
                                    & "SYSTEMTYPE:3"& vbCRLF _
                                    & "REPAYMENTTYPE:2"& vbCRLF _
                                    & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & loanRepISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & loanRepISN 
                sqlValue = 12
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIR
                queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & loanRepISN 
                sqlValue = 8
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' HIRREST
                queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " & fISN
                sqlValue = 9
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' IB_AGREEMENT_PAYMENT
                queryString = " SELECT COUNT(*) FROM IB_AGREEMENT_PAYMENT WHERE fAGRISN = " & fISN &_
                                          " and fSTATE = '9' and fCURISO = 'AMD' and fAMOUNT = '6000000.00' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' IB_AGREEMENT_PAYMENT
                queryString = " SELECT COUNT(*) FROM IB_AGREEMENT_PAYMENT WHERE fAGRISN = " & fISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                ' IB_AGREEMENT_PAYMENT_LOG
                queryString = " SELECT COUNT(*) FROM IB_AGREEMENT_PAYMENT_LOG WHERE fISN = " & loanRepISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 

      ' Մուտք գործել վարկեր տեղաբաշխված
      Call ChangeWorkspace(c_Loans)
      ' Մուտք Պայմանագրեր թղթապանակ

      Set contractsFilter = New_ContractsFilter()
      contractsFilter.AgreementN = docNum
      contractsFilter.AgreementLevel = "1"
      
      Call Check_AgreementExisting("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|", contractsFilter)
      BuiltIn.Delay(1500)
      
      Call Delete_Actions(stDate,stDate,False,"",c_OpersView )
      ' Ջնջել գործողությունների դիտում թղթապանակից
      Call Close_Pttel("frmPttel")

      ' Մուտք ադմինիստրատորի ԱՇՏ4.0
      Call ChangeWorkspace(c_Admin40)
      
      ' Մուտք ստեղծված փաստաթղթեր թղթապանակ
      workEnvName = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|êï»ÕÍí³Í ÷³ëï³ÃÕÃ»ñ"
      state = AccessFolder(workEnvName, "Ստեղծված փաստաթղթեր", "SDATE", stDate, "EDATE", stDate, True,  "ISN", fISNOut)
      
      If Not state Then
            Log.Error("Սխալ՝ Ստեղծված փաստաթղթեր թղթապանակ մուտք գործելիս")
            Exit Sub
      End If
      
      ' Կանխիկ ելք փաստաթղթի ջնջում
      Call Paysys_Delete_Doc(False)
      If  MessageExists(2, "Ð»é³óÝ»É Ó¨³Ï»ñåáõÙÝ»ñÁ") Then
          Call ClickCmdButton(5, "²Ûá")  
      End If
      
      Call Close_Pttel("frmPttel")
      
      ' Մուտք ստեղծված փաստաթղթեր թղթապանակ
      state = AccessFolder(workEnvName, "Ստեղծված փաստաթղթեր", "SDATE", stDate, "EDATE", stDate, True,  "ISN", fISNInput)
      
      If Not state Then
            Log.Error("Սխալ՝ Ստեղծված փաստաթղթեր թղթապանակ մուտք գործելիս")
            Exit Sub
      End If
      
      ' Կանխիկ մուտք փաստաթղթի ջնջում
      Call Paysys_Delete_Doc(False)
      If  MessageExists(2, "Ð»é³óÝ»É Ó¨³Ï»ñåáõÙÝ»ñÁ") Then
          Call ClickCmdButton(5, "²Ûá")  
      End If
      Call Close_Pttel("frmPttel")

      ' Մուտք գործել վարկեր տեղաբաշխված
      Call ChangeWorkspace(c_Loans)
      ' Մուտք Պայմանագրեր թղթապանակ

      Set contractsFilter = New_ContractsFilter()
      contractsFilter.AgreementN = docNum
      contractsFilter.AgreementLevel = "1"
      
      Call Check_AgreementExisting("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|", contractsFilter)
      BuiltIn.Delay(1500)
      
      ' Ջնջել "գործողությունների դիտում" թղթապանակից
      Call DeleteActionOverdraft(c_OpersView, "011121", stDate,  False, "") 
    
      ' Ջնջել Վարկի տրամադրում փաստաթուղթը
      Call  DelTermsDoc("ì³ñÏÇ ïñ³Ù³¹ñáõÙ, ¶áõÙ³ñÁª 15000 -²ØÜ ¹áÉ³ñ")
      
      ' Ջնջել Գանձում տրամադրումից փաստաթուղթը
      Call  DelTermsDoc("¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó, ¶áõÙ³ñÁª 6000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù")

      ' Ջնջել պայմանագիրը                
      Call DelDoc()
      Call Close_Pttel("frmPttel")
      
      ' Փակել ՀԾ-Բանկ ծրագիրը
      Call Close_AsBank()
      
End Sub