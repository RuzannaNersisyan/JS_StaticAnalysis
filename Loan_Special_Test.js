Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT Subsystems_Special_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Agreements_From_Loans_Placed

' Test Case ID 166635

Sub Loan_Special_Test()

      ' Գրաֆիկով վարկային պայմանագրի ստեղծման համար նախատեսված փոփոխականներ
      Dim  clientCode,mAccacc, summ, mDate, dateGive, dateAgr, datesFilltype, fixDays, dateLngEnd, passDirection,_
               summDateSelect, summFillType, loanRates, loanRatesSect, unusedPortRate, unusedPortRateSec,_
               subsRate, subsRateSect, penOverMoney, penOverMoneySect, penOverLoan, penOverLoanSect,_
               sect, purpose,mShedule, mGuarantee,mCountry, lRegion,mRegion, mNote, paperCode, mixedSum, agrPeriod, agrPeriodPer

      ' Գրադարանից ստացվող արժեքներ       
      Dim docNum, docNumOut, docNumIn, contractName, fISN, fISNOut, fISNIn, plfISN, calcfISN, loanReptISN,_
              insGrISN, repShedISN, debtGrISN, pladgeDocNum, pladgeNumber, paramN, status, docNumber, state, wCurr
      
      Dim param, i, frmASDocForm, nominal, price, frmAsUstPar, tdbgView, frmPttel, cliPledge, datePledge,_
              curPledge, dateType, commPledge, checkbox, docNumb, customer, thPledge, newthPledge, datePay,_
              cashOrNo, acccor, fISNn, stDate, enDate, dateAction, percentMoney, dateCharge, mDIClient, debtDate,_
              debtSum, debtSumPer, calcDate, regDate, MainForm, wMainForm, paramIn, paramOut, reDate, reDateAgr,_
              sumTotal, sStart, eStart, actType,valCheck,pledgeType, contType, tdbgViewn, docType, checkCount, frmPttel_2 
              
      Dim createDate, giveLoan, confPath, confInput, docNumChar, fISNInput, docNumInput, accCorr, applayConn, fISNChar

      Dim queryString, sqlValue, colNum, sql_isEqual, docNumLoan, fISNLoan, kassNish
           
      Dim fDATE, sDATE
        
      valCheck = 1
      pledgeType =  "¶ñ³í(áëÏÇ)"
      contType = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ"
      
      fDATE = "20250101"
      sDATE = "20120101"
      Call Initialize_AsBank("bank", sDATE, fDATE)
      Call Create_Connection()
      
      ' Մուտք գործել համակարգ CREDITOPERATOR օգտագործողով 
      Login("CREDITOPERATOR")
         
      ' Մուտք գործել վարկեր տեղաբաշխված/Նոր պայմանագրի ստեղծում դաշտ
      Call ChangeWorkspace(c_Loans)
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
      clientCode = "00034851"
      mAccacc = "03485190101"
      summ = "10000"
      mDate = "161213"
      dateGive = "161213"
      dateAgr = "161216"
      datesFilltype = "1"
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
      sect = "U2"
      purpose = "00"
      mShedule = "9"
      mGuarantee = "9"
      lRegion = "001"
      mCountry = "AM"
      mRegion = "010000008"
      mNote = ""
      paperCode = "123"
      
      Call CreatingLoanAgrWithSchedule(contType, fISN, docNum, clientCode, wCurr, mAccacc, summ, mDate, dateGive, dateLngEnd, dateAgr, valCheck,_
                                          mixedSum, datesFilltype, fixDays, agrPeriod, agrPeriodPer, passDirection, summDateSelect, summFillType, loanRates,_
                                          loanRatesSect, unusedPortRate, unusedPortRateSec, subsRate, subsRateSect,_
                                          penOverMoney, penOverMoneySect, penOverLoan, penOverLoanSect, sect, purpose,_
                                          mShedule, mGuarantee, mCountry, lRegion, mRegion, mNote, paperCode )  
              
      Log.Message(docNum)
      Log.Message(fISN)
      
                ' SQL ստուգում պայամանգիրը ստեղծելուց հետո: 
                ' CONTRACTS
                queryString = " SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & fISN & _
                                        "AND  fDGSTATE = 206 AND  fDGSUMMA = 10000 AND fDGALLSUMMA = 0 " & _ 
                                        "AND fDGRISKDEGREE = 0 AND fDGRISKDEGNB = 0 AND fDGMPERCENTAGE = 0"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                                
                ' FOLDERS
                queryString = " SELECT COUNT(*)   FROM FOLDERS WHERE fISN = " & fISN 
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
          
                ' RESNUMBERS
                queryString = "SELECT COUNT(*)  FROM RESNUMBERS WHERE fISN = " & fISN & "And fTYPE = 'C' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                      
      nominal =  "161213"
      price = "100"
      contractName =  "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ- " & docNum  & " {öáË³ÝóÙ³Ý ëïáõ·Ù³Ý Ñ³×³Ëáñ¹ 1}"
      
      ' Վճարումների գրաֆիկի փաստաթղթերի ստեղծում
      Call PaymentScheduleDocumentCreation(contractName, nominal, price)
       
                ' AGRSCHEDULE
                queryString = " SELECT COUNT(*)  FROM AGRSCHEDULE  WHERE fAGRISN =  " & fISN & _
                                         "AND fKIND = 9 "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
       
                ' AGRSCHEDULEVALUES
                queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN =  " & fISN
                sqlValue = 74
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
       
      ' Պայմանագիրն ուղարկել հաստատման
      Call SendContractForApproval(contractName)         
       
      ' Մուտք համակարգ ARMSOFT օգտագործողով
      Login("ARMSOFT")
      
      ' Մուտք Ադմինիստրատորի ԱՇՏ
      Call ChangeWorkspace(c_Admin)
      
      ' Կարգավորումների ներմուծում
      confPath = "X:\Testing\Order confirm phases\Verifier_Output.txt"
      confInput = Input_Config(confPath)
      If Not confInput Then
          Log.Error("Կարգավորումները չեն ներմուծվել")
         Exit Sub
      End If
      
      ' Մուտք Վարկեր (տեղաբաշխված) ԱՇՏ
      Call ChangeWorkspace(c_Loans)
      
      ' Մուտք Հաստատող փաստաթղթեր 1
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
      Set frmAsUstPar = Sys.Process("Asbank").VBObject("frmAsUstPar")
        
      ' Ստուգում որ Աշխատանքային Փաստաթղթեր դիալոգը բացվել է
      If  Not frmAsUstPar.Exists Then
          Log.Error("Աշխատանքային Փաստաթղթեր դիալոգը չի բացվել")
          Exit Sub
      End If
      
      ' Պայմանագրի համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NUM", docNum )
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      ' Փաստաթղթի վավերացում 
      Call DocValidate(docNum)
      
                'SQL ստուգում փաստաթուղթը վավերացնելուց հետո
                ' HIF
                queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE =  " & fISN 
                sqlValue = 19
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
      Set frmPttel = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel")
      frmPttel.Close
         
      ' Մուտք պայմանագրեր թղթապանակ
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
      ' Ստեղծված փաստաթղթի համարի ներմուծում
      Call Rekvizit_Fill("Dialog", 1, "General", "NUM", docNum )
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
      Set tdbgView= Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView")
      BuiltIn.Delay(2000) 
      
      ' Ստուգում, որ Պայմանագրեր Պատուհանը բացվել է
      If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Exists Then
          Log.Error("Պայմանագրեր պատուհանը չի բացվել")
          Exit Sub
      ElseIf tdbgView.ApproxCount <> 1 Then
                Log.Error("Վարկային պայմանագրիը չի ստեղծվել")
                Exit Sub
      End If   
      
      ' Գրավ փաստաթղթի ստեղծման ֆունկցիայի կանչ
      cliPledge = "00034851"
      datePledge = ""
      curPledge = "000"                                      
      commPledge = ""  
      checkbox = true
      customer = ""                   
      docNumb = ""
      thPledge = "áëÏÇ"
      newthPledge = "1"
      Call CreationOfPledgeContract(pledgeType, plfISN, pladgeDocNum, cliPledge, datePledge, curPledge, commPledge,_
                                                                  docNumb, customer, thPledge, newthPledge)
      Log.Message(pladgeDocNum)
      
                ' SQL ստուգում Գրավ Պայմանագրի ստեղծումից հետո
                'CONTRACTS
                queryString = " SELECT COUNT(*) FROM CONTRACTS WHERE fDGISN = " & plfISN & _
                                         " AND  fDGSTATE = 1 AND  fDGSUMMA = 0 AND fDGALLSUMMA = 0" & _ 
          	                             " AND fDGRISKDEGREE = 100 AND fDGRISKDEGNB = 0 AND fDGMPERCENTAGE = 0"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 

               ' LINKEDAGRS
                queryString = " SELECT COUNT(*)  FROM LINKEDAGRS  WHERE fBASE = " & plfISN 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
          
                ' RESNUMBERS
                queryString = "SELECT COUNT(*)  FROM RESNUMBERS  WHERE fISN = " & plfISN
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
      ' Գանձում տրամադրումից ֆունկցիայի կանչ
      datePay = "161213"
      cashOrNo = "1"
      Call Charging(fISNChar, docNumChar, datePay, cashOrNo, fISNIn, docNumIn, kassNish, accCorr, applayConn)
      
                ' SQL ստուգում Գանձում տրամադրումից հետո
                ' HI
               queryString = " SELECT SUM(fSUM) FROM HI  WHERE fBASE = " & fISNIn 
               sqlValue = 8000.00
               colNum = 0
               sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
               If Not sql_isEqual Then
                 Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
               End If
  
      ' Վարկի տրամադրում ֆունցիայի կանչ
      Call SupplyCredit(docNumLoan, fISNLoan, mDate, cashOrNo, docNumOut, fISNOut, accCorr) 
      
               ' SQL ստուգում Վարկի տրամադրումից հետո
                ' HI
               queryString = "  SELECT SUM(fSUM) FROM HI  WHERE fBASE = " & fISNOut 
               sqlValue = 8000000.00
               colNum = 0
               sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
               If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
               End If
       
      ' Մուտք Հաճախորդի սպասարկում և դրամարկղ ԱՇՏ
      Call ChangeWorkspace(c_CustomerService) 
      
      ' Կանխիկ մուտք փաստաթուղթը ուղարկել հաստատման
      stDate = "161213"
      enDate = "161213"
      Call SendConfirmCashAccessDoc(stDate, enDate, docNumIn)
        
      ' Մուտք VERIFIER օգտագործողով
      Login("VERIFIER")
      ' Մուտք Հաստատվող 1 ԱՇՏ
      Call ChangeWorkspace(c_Verifier1)
        
      ' Մուտք Հաստատող վճարային փաստաթղթեր 
      Call wTreeView.DblClickItem("|Ð³ëï³ïáÕ I ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
      BuiltIn.Delay(2000)
      Call Rekvizit_Fill("Dialog", 1, "General", "USER","^A[Del]" & "")
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(2000)
      
      ' Կանխիկ մուտք փաստաթղթի հաստատում
      state =  ConfirmCashAccessDoc(docNumIn)
      
      ' Ստուգում որ Կանխիկ մուտք փաստաթուղթը չի գտնվել և չի հաստատվել
      If Not state Then
            Log.Error("Կանխիկ մուտք փաստաթուղթը չի գտնվել և չի հաստատվել")
            Exit Sub
      End If
      
      ' Մուտք համակարգ ARMSOFT օգտագործողով
      Login("ARMSOFT")
      ' Մուտք Հաճախորդի սպասարկում և դրամարկղ ԱՇՏ
      Call ChangeWorkspace(c_CustomerService) 
        
      ' Մուտք աշխատանքային փաստաթղթեր թղթապանակ
      Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
                
      ' Ստուգում որ Աշխատանքային Փաստաթղթեր դիալոգը բացվել է
      If  Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
              Log.Error("Աշխատանքային Փաստաթղթեր դիալոգը չի բացվել")
              Exit Sub
      End If
        
      docType = "KasPrOrd"
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", stDate)
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", enDate)      
      ' Փաստաթղթի տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", docType )
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)
          
      Call DocValidate(docNumIn)
      frmPttel.Close 

      BuiltIn.Delay(1500)
                   
                   ' SQL ստուգում կանխիկ մուտք փաստաթղթի վավերացումից հետո
                    ' HI
                   queryString = " SELECT COUNT(*) FROM HI  WHERE fBASE = " & fISNIn & _
                                            " AND (( fSUM = 4000 AND fCURSUM = 4000 AND fDBCR = 'D' ) " & _
                                            " OR ( fSUM = 4000 AND fCURSUM = 4000 AND fDBCR = 'C' )) "
                   sqlValue = 2
                   colNum = 0
                   sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                   If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                   End If   
                   
      Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
      
      ' Ստուգում որ Աշխատանքային Փաստաթղթեր դիալոգը բացվել է
      If  Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
              Log.Error("Աշխատանքային Փաստաթղթեր դիալոգը չի բացվել")
              Exit Sub
      End If
      
      docType = "KasRsOrd"
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", stDate)
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", enDate)  
      ' Փաստաթղթի տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", docType )
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")

       Call DocValidate(docNumOut)
       frmPttel.Close 
      
                    'FOLDERS
                    queryString = " SELECT COUNT(*) FROM HI WHERE fBASE=" & fISNOut & _
                                              " AND (( fSUM =' 4000000' AND fCURSUM = '10000' AND fDBCR = 'D' ) " & _
                                              " OR ( fSUM = '4000000' AND fCURSUM = '10000' AND fDBCR = 'C' )) "
                    sqlValue = 2
                    colNum = 0
                    sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                    If Not sql_isEqual Then
                        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                    End If                          
                    
      ' Մուտք համակարգ CREDITOPERATOR օգտագործողով
      Login("CREDITOPERATOR")    
      ' Մուտք գործել վարկեր տեղաբաշխված/ պայմանագրեր դաշտ
      Call ChangeWorkspace(c_Loans)
    
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")  
        
      ' Ստուգում, որ Պայմանագրեր վարկեր տեղաբաշխված դիալոգը բացվել է
      If Not  Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error("Պայմանագրեր/վարկեր տեղաբաշխված դիալոգը չի բացվել")
            Exit Sub
      End If
        
      ' Պայմանագրի համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NUM", docNum )
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
       BuiltIn.Delay(2000)
       
      ' Ստուգում որ Պայմանագրի թղթապանակը բացվել է
      If  Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Exists Then
             Log.Error("Պայմանագրի թղթապանակը չի բացվել")
             Exit Sub
      ElseIf tdbgView.ApproxCount <> 1 Then
             Log.Error("")
             Exit Sub
      End If 
            
      ' Տոկոսների հաշվարկ  31
      dateCharge = "140114"        
      dateAction = "140114"
      dateType = ""
      Call PercentCalculation(dateCharge,dateAction, percentMoney, calcfISN )
      BuiltIn.Delay(1500)
       
                 'ISN- ի ստուգում Տոկոսների հաշվարկից հետո
                 'HI
                  queryString = " SELECT COUNT(*) FROM HI WHERE fBASE=  " & calcfISN & _
                                           " AND (( fSUM = '79052' AND fCURSUM = '79052' AND fDBCR = 'C' ) " & _
                                					 " OR ( fSUM = '78904' AND fCURSUM = '197.26' AND fDBCR = 'D' ) " & _
                                					 " OR ( fSUM = '79052' AND fCURSUM = '197.63' AND fDBCR = 'D' ) " & _
                                					 " OR ( fSUM = '78904' AND fCURSUM = '197.26 ' AND fDBCR = 'C' )) "
                  sqlValue = 4
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE=  " & calcfISN & _
                                           " AND (( fCURSUM = '197.26' AND fTYPE = 'R2' ) " & _
                  												 " OR ( fCURSUM = '197.26' AND fTYPE = 'R¸' ) " & _
                  												 " OR ( fCURSUM = '0.37' AND fTYPE = 'R¾' ) " & _
                  												 " OR ( fCURSUM = '187.53' AND fTYPE = 'RÄ' )) "
                  sqlValue = 4
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIF
                  queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & calcfISN & _
                                           " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' " 
                  sqlValue = 1
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
      ' Վարկի պարտքի մարում փաստաթղթի ստեղծում 32
      debtDate = "150114"
      debtSum = ""
      debtSumPer = ""
      Call LoanDebtRepaymentDocCreate(loanReptISN, debtDate,debtSum,debtSumPer)
      BuiltIn.Delay(1500)
      
                  'HI
                  queryString = "  SELECT COUNT(*) FROM HI WHERE fBASE=  " & loanReptISN & _
                                           "  AND (( fSUM = 78904 AND fCURSUM = 78904 AND fDBCR = 'D' ) " & _ 
                                					 " OR ( fSUM = 75012 AND fCURSUM = 187.53 AND fDBCR = 'D' ) " & _ 
                                					 " OR ( fSUM = 78904 AND fCURSUM = 197.26 AND fDBCR = 'C' ) " & _ 
                                					 " OR ( fSUM = 75012 AND fCURSUM = 187.53 AND fDBCR = 'C' ) " & _ 
                                					 " OR ( fSUM = 197.26 AND fCURSUM = 78904 AND fDBCR = 'D' )) "

                  sqlValue = 5
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
        
                  'HIR
                  queryString = "  SELECT COUNT (*) FROM HIR WHERE fBASE = " & loanReptISN  & _
                                           " AND (( fCURSUM = 187.53 AND fTYPE = 'R1' ) " & _
                  												 " OR ( fCURSUM = 197.26 AND fTYPE = 'R2' ) " & _
                  												 " OR ( fCURSUM = 197.26 AND fTYPE = 'R¸' ) " & _
                  												 " OR ( fCURSUM = 187.53 AND fTYPE = 'RÄ' )) "
                  sqlValue = 4
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
                  ' AGRSCHEDULEVALUES
                  queryString = "  SELECT  Count(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN = " & fISN
                  sqlValue = 146
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
       
                  ' AGRSCHEDULE
                  queryString = " SELECT COUNT(*)  FROM AGRSCHEDULE  WHERE fAGRISN =  " & fISN & _
                                           " AND fKIND = 9 "
                  sqlValue = 1
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
      ' խմբային տոկոսների հաշվարկ 33
      calcDate = "160214"
      regDate = "160214"
      checkCount = 1
      Call  InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      status = False
      paramN = c_OpersView
      dateType = "511"
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
        
      BuiltIn.Delay(1500)
      
                  'HI
                  queryString =  " SELECT COUNT(*) FROM HI WHERE fBASE = " & insGrISN  & _
                                            " AND (( fSUM = 85416 AND fCURSUM = 85416 AND fDBCR = 'C' ) " & _
                                      		  " OR ( fSUM = 85168 AND fCURSUM = 212.92 AND fDBCR = 'D' ) " & _
                                      	  	" OR ( fSUM = 85416 AND fCURSUM = 213.54 AND fDBCR = 'D' ) " & _
                                      			"	OR ( fSUM = 85168 AND fCURSUM = 212.92 AND fDBCR = 'C' )) " 
                  sqlValue = 4
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & insGrISN  & _
                                           " AND (( fCURSUM = 212.92 AND fTYPE = 'R2' ) " & _
                  												 " OR ( fCURSUM = 212.92 AND fTYPE = 'R¸' ) " & _
                  												 " OR ( fCURSUM = 0.62 AND fTYPE = 'R¾' ) " & _
                  												 " OR ( fCURSUM = 171.87 AND fTYPE = 'RÄ' )) " 
                  sqlValue = 4
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
          
                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                           " AND (( fLASTREM = 9812.47and fPENULTREM = 10000 AND fTYPE = 'R1' ) " & _
                            							 " OR ( fLASTREM = 212.92 AND fPENULTREM = 0 AND fTYPE = 'R2' )  " & _
                            						   " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                            						   " OR ( fLASTREM = 212.92 AND fPENULTREM = 0 AND fTYPE = 'R¸' ) " & _
                            					     " OR ( fLASTREM = -9.01 AND fPENULTREM = -9.63 AND fTYPE = 'R¾' ) " & _
                            							 " OR ( fLASTREM = 171.87 AND fPENULTREM = 0 AND fTYPE = 'RÄ' )) "
                  sqlValue = 6
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIT
                  queryString = " SELECT COUNT(*) FROM HIT WHERE fBASE = " & insGrISN  & _
                                           " AND (( fCURSUM = 212.92 AND fTYPE = 'N2' ) " & _
          												         " OR ( fCURSUM = 0.62 AND fTYPE = 'N¾' )) "
                  sqlValue = 2
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
      ' խմբային տոկոսների հաշվարկ 34
      calcDate =  "170214"
      regDate = "170214"
      Call  InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      dateType = "511"
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)

      BuiltIn.Delay(1500)
      
                 'HI
                  queryString =  " SELECT COUNT(*) FROM HI WHERE fBASE = " & insGrISN  & _
                                            " AND (( fSUM = 2516 AND fCURSUM = 2516 AND fDBCR = 'C' ) " & _
                                						" OR ( fSUM = 2536 AND fCURSUM = 6.34 AND fDBCR = 'D' ) " & _
                                						" OR ( fSUM = 24 AND fCURSUM = 0.06 AND fDBCR = 'D' ) " & _
                                						" OR ( fSUM = 24 AND fCURSUM = 24 AND fDBCR = 'C' ) " & _
                                						" OR ( fSUM = 2516 AND fCURSUM = 6.29 AND fDBCR = 'D' ) " & _
                                						" OR ( fSUM = 2536 AND fCURSUM = 6.34 AND fDBCR = 'C' )) "
                  sqlValue = 6
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & insGrISN  & _
                                           " AND (( fCURSUM = 6.34 AND fTYPE = 'R2' ) " & _
                  												 " OR ( fCURSUM = 0.06 AND fTYPE = 'RF' ) " & _
                  												 " OR ( fCURSUM = -0.05 AND fTYPE = 'R¾' )) " 
                  sqlValue = 3
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                           " AND (( fLASTREM = 9812.47and fPENULTREM = 10000 AND fTYPE = 'R1' ) " & _
                            							 " OR ( fLASTREM = 219.26 AND fPENULTREM = 212.92 AND fTYPE = 'R2' ) " & _
                            						   " OR ( fLASTREM = 0.06 AND fPENULTREM = 0 AND fTYPE = 'RF' ) " & _
                            						   " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                            					     " OR ( fLASTREM = 212.92 AND fPENULTREM = 0 AND fTYPE = 'R¸' ) " & _
                            							 " OR ( fLASTREM = -9.06 AND fPENULTREM = -9.01 AND fTYPE = 'R¾' ) " & _
                                           " OR ( fLASTREM = 171.87 AND fPENULTREM = 0 AND fTYPE = 'RÄ' )) "
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
              
                  'HIT
                  queryString = " SELECT COUNT(*) FROM HIT WHERE fBASE = " & insGrISN  & _
                                           " AND (( fCURSUM = 6.34 AND fTYPE = 'N2' ) " & _
          												         " OR ( fCURSUM = 0.06 AND fTYPE = 'NF' ) " & _
                                           " OR ( fCURSUM = -0.05 AND fTYPE = 'N¾' )) "
                  sqlValue = 3
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
               
                  'HIF
                  queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                           " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' " 
                  sqlValue = 5
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
      ' խմբային տոկոսների հաշվարկ 35
      calcDate =   "200214"
      regDate = "200214"
      Call  InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
       
                  'HIF
                  queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                           " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' " 
                  sqlValue = 1
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
             
                 'HI
                  queryString =  " SELECT COUNT(*) FROM HI WHERE fBASE = " & insGrISN  & _
                                            " AND (( fSUM = 7560 AND fCURSUM = 7560 AND fDBCR = 'C' ) " & _
                                            " OR ( fSUM = 7608 AND fCURSUM = 19.02 AND fDBCR = 'D' ) " & _
                                						" OR ( fSUM = 68 AND fCURSUM = 0.17 AND fDBCR = 'D' ) " & _
                                						" OR ( fSUM = 68 AND fCURSUM = 68 AND fDBCR = 'C' ) " & _
                                						" OR ( fSUM = 7560 AND fCURSUM = 18.90 AND fDBCR = 'D' ) " & _
                                						" OR ( fSUM = 7608 AND fCURSUM = 19.02 AND fDBCR = 'C' )) "
                  sqlValue = 6
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
 
                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & insGrISN  & _
                                           " AND (( fCURSUM = 19.02 AND fTYPE = 'R2' ) " & _
                  												 " OR ( fCURSUM = 0.17 AND fTYPE = 'RF' ) " & _
                  												 " OR ( fCURSUM = -0.12 AND fTYPE = 'R¾' )) " 
                  sqlValue = 3
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                           " AND (( fLASTREM = '9812.47' AND fPENULTREM = '10000' AND fTYPE = 'R1' ) " & _
                            							 " OR ( fLASTREM = '238.28' AND fPENULTREM = '219.26' AND fTYPE = 'R2' ) " & _
                                           " OR ( fLASTREM = '0.23' AND fPENULTREM = '0.06' AND fTYPE = 'RF' ) " & _
                              						 " OR ( fLASTREM = '4000' AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                              						 " OR ( fLASTREM = '212.92' AND fPENULTREM = 0 AND fTYPE = 'R¸' ) " & _
                              						 " OR ( fLASTREM = '-9.18' AND fPENULTREM = '-9.06' AND fTYPE = 'R¾' ) " & _
                              						 " OR ( fLASTREM = '171.87' AND fPENULTREM = 0 AND fTYPE = 'RÄ' )) "
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIT
                  queryString = " SELECT COUNT(*) FROM HIT WHERE fBASE = " & insGrISN  & _
                                           " AND (( fCURSUM = '19.02' AND fTYPE = 'N2' ) " & _
          												         " OR ( fCURSUM = '0.17' AND fTYPE = 'NF' ) " & _
                                           " OR ( fCURSUM =' -0.12' AND fTYPE = 'N¾' )) "
                  sqlValue = 3
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
      ' Վարկի պարտքի մարում փաստաթղթի ստեղծում 36
      debtDate ="210214"
      debtSum = " "
      debtSumPer = " "
      Call LoanDebtRepaymentDocCreate(loanReptISN, debtDate, debtSum, debtSumPer)
      BuiltIn.Delay(1500)
             
                 'HI
                  queryString =  " SELECT COUNT(*) FROM HI WHERE fBASE =  " & loanReptISN  & _
                                            " AND (( fSUM = 85168 AND fCURSUM = 85168 AND fDBCR = 'D' ) " & _
                              							"	OR ( fSUM = 92 AND fCURSUM = 92 AND fDBCR = 'D' ) " & _
                              							"	OR ( fSUM = 68748 AND fCURSUM = 171.87 AND fDBCR = 'D' ) " & _
                              							"	OR ( fSUM = 85168 AND fCURSUM = 212.92 AND fDBCR = 'C' ) " & _
                              							"	OR ( fSUM = 92 AND fCURSUM = 0.23 AND fDBCR = 'C' ) " & _
                              							"	OR ( fSUM = 68748 AND fCURSUM = 171.87 AND fDBCR = 'C' ) " & _
                              							"	OR ( fSUM = 212.92 AND fCURSUM = 85168.00 AND fDBCR = 'D' ) " & _
                              							"	OR ( fSUM = 0.23 AND fCURSUM = 92.00 AND fDBCR = 'D' )) "
                  sqlValue = 8
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & loanReptISN  & _
                                           " AND (( fCURSUM = '171.87' AND fTYPE = 'R1' ) " & _
                    											 " OR ( fCURSUM = '212.92' AND fTYPE = 'R2' ) " & _
                    											 " OR ( fCURSUM = '0.23' AND fTYPE = 'RF' ) " & _
                                           " OR ( fCURSUM = '212.92' AND fTYPE = 'R¸' ) " & _
                    											 " OR ( fCURSUM = '171.87' AND fTYPE = 'RÄ' )) " 
                  sqlValue = 5
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                           " AND (( fLASTREM = 9640.60 AND fPENULTREM = 9812.47 AND fTYPE = 'R1' ) " & _
                            							 " OR ( fLASTREM = 25.36 AND fPENULTREM = 238.28 AND fTYPE = 'R2' ) " & _
                            							 " OR ( fLASTREM = 0 AND fPENULTREM = 0.23 AND fTYPE = 'RF' ) " & _
                            							 " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                            							 " OR ( fLASTREM = 0 AND fPENULTREM = 212.92 AND fTYPE = 'R¸' ) " & _
                            							 " OR ( fLASTREM = -9.18 AND fPENULTREM = -9.06 AND fTYPE = 'R¾' ) " & _
                            							 " OR ( fLASTREM = 0 AND fPENULTREM = 171.87 AND fTYPE = 'RÄ' )) "
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
      ' Մարումների գրաֆիկի վերանայում   37
      reDate = "210214"
      reDateAgr = "161217"
      sumTotal = ""
      Call RepaymentScheduleReview(repShedISN, reDate, reDateAgr, sumTotal)                    
      frmPttel.Close
            
      ' Մուտք Հաստատվող փաստաթղթեր 1
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
           
      Set frmAsUstPar=Sys.Process("Asbank").VBObject("frmAsUstPar")
      ' Ստուգում որ Վարկեր (Տեղաբաշխված) ՝ հաստատվող փաստաթղթեր 1 դիալոգը բացվել է
      If  Not frmAsUstPar.Exists Then
               Log.Error("Վարկեր (Տեղաբաշխված) ՝ հաստատվող փաստաթղթեր 1 դիալոգը չի բացվել")
               Exit Sub
      End If
        
      ' Պայմանագրի համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NUM", docNum )
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
      ' Մարումներ գրաֆիկ փաստաթղթի վավերացում 
      Call DocValidate(docNum)
      frmPttel.Close
      
                  'AGRSCHEDULE
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULE  WHERE fAGRISN =  " & fISN  & _
                                           " AND ( fKIND = 9 OR fKIND = 2 ) " 
                  sqlValue = 4
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
                  BuiltIn.Delay(1500)
                  
                  'AGRSCHEDULEVALUES
                  queryString = " SELECT Count(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN= " & fISN 
                  sqlValue = 310
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIF
                  queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & repShedISN  & _
                                           " AND (( fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' ) " & _
          												         " OR ( fSUM = 27.0217 AND fCURSUM = 365 AND fTYPE = 'N0' ) " & _
                                           " OR ( fSUM = 27.0217 AND fCURSUM = 365 AND fTYPE = 'N0' )) "
                  sqlValue = 3
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
      ' Մուտք գործել Պայմանագրեր թղթապանակ
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ") 
         
      ' Ստուգում որ Պայմանագրեր/ Վարկեր տեղաբաշխված պատուհանը բացվել է
      If  Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
             Log.Error("Պայմանագրեր/ Վարկեր տեղաբաշխված պատուհանը չի բացվել")
             Exit Sub
      End If     
        
      ' Պայմանագրի համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NUM", docNum )   
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
        
      ' Ստուգում որ Պայմանագրեր/ Վարկեր տեղաբաշխված դիալոգը բացվել է
      If  Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Exists Then
             Log.Error("Պայմանագրեր/ Վարկեր տեղաբաշխված դիալոգը չի բացվել")
             Exit Sub
      End If
      
      ' խմբային տոկոսների հաշվարկ 41
      calcDate = "060314 "
      regDate = "060314 "
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
      
                     'HIF
                    queryString = " SELECT COUNT (*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                             " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' "
                    sqlValue = 3
                    colNum = 0
                    sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                    If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                    End If
             
                   'HI
                    queryString =  " SELECT COUNT(*) FROM HI WHERE fBASE = " & insGrISN  & _
                                              " AND (( fSUM = 34448 AND fCURSUM = 34448 AND fDBCR = 'C' ) " & _
                                  						"	OR ( fSUM = 35500 AND fCURSUM = 88.75 AND fDBCR = 'D' ) " & _
                                  						"	OR ( fSUM = 34448 AND fCURSUM = 86.12 AND fDBCR = 'D' ) " & _
                                  						"	OR ( fSUM = 35500 AND fCURSUM = 88.75 AND fDBCR = 'C' )) "
                    sqlValue = 4
                    colNum = 0
                    sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                    If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                    End If
           
                    'HIR
                    queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & insGrISN  & _
                                             " AND (( fCURSUM = 88.75 AND fTYPE = 'R2' ) " & _
                    												 " OR ( fCURSUM = -2.63 AND fTYPE = 'R¾' )) " 
                    sqlValue = 2
                    colNum = 0
                    sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                    If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                    End If
        
                    'HIRREST
                    queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                             " AND (( fLASTREM = 9640.60 AND fPENULTREM = 9812.47 AND fTYPE = 'R1' ) " & _
                              							 " OR ( fLASTREM = 114.11 AND fPENULTREM = 25.36 AND fTYPE = 'R2' ) " & _
                                             " OR ( fLASTREM = 0 AND fPENULTREM = 0.23 AND fTYPE = 'RF' ) " & _
                                						 " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                                						 " OR ( fLASTREM = 0 AND fPENULTREM = 212.92 AND fTYPE = 'R¸' ) " & _
                                						 " OR	( fLASTREM = -11.81 AND fPENULTREM = -9.18 AND fTYPE = 'R¾' ) " & _
                                						 " OR	( fLASTREM = 0 AND fPENULTREM = 171.87 AND fTYPE = 'RÄ' )) "
                    sqlValue = 7
                    colNum = 0
                    sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                    If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                    End If
        
                    'HIT
                    queryString = " SELECT COUNT(*) FROM HIT WHERE fBASE = " & insGrISN  & _
                                             " AND ((fCURSUM = 88.75 AND fTYPE = 'N2')" & _
            												         " OR (fCURSUM = -2.63 AND fTYPE = 'N¾'))"
                    sqlValue = 2
                    colNum = 0
                    sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                    If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                    End If
      
      ' Վարկի պարտքի մարում փաստաթղթի ստեղծում 42
      debtDate = "070314"
      debtSum = "82"
      debtSumPer = "88"
      Call LoanDebtRepaymentDocCreate(loanReptISN, debtDate, debtSum, debtSumPer)
      Log.Message(loanReptISN)
      BuiltIn.Delay(1500)
      
                  'HI
                  queryString =  " SELECT COUNT(*) FROM HI WHERE fBASE=  " & loanReptISN  & _
                                            " AND (( fSUM = 35200 AND fCURSUM = 35200 AND fOP = 'PRX' ) " & _
                              							"	OR ( fSUM = 32800 AND fCURSUM = 82 AND fOP = 'MSC' ) " & _
                              							"	OR ( fSUM = 32800 AND fCURSUM = 82 AND fOP = 'MSC' ) " & _
                              							"	OR ( fSUM = 35200 AND fCURSUM = 88 AND fOP = 'PRX' ) " & _
                              							"	OR ( fSUM = 88 AND fCURSUM = 35200 AND fOP = 'SAL' )) " 

                  sqlValue = 5
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & loanReptISN  & _
                                           " AND (( fCURSUM = 82.00 AND fTYPE = 'R1' ) " & _
                    											 " OR ( fCURSUM = 88.00 AND fTYPE = 'R2' )) " 
                  sqlValue =  2
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                           " AND (( fLASTREM = 9558.6 and fPENULTREM = 9640.6 and fTYPE = 'R1' ) " & _
                            							 " OR ( fLASTREM = 26.11 and fPENULTREM = 114.11 and fTYPE = 'R2' ) " & _
                            							 " OR ( fLASTREM = 0 and fPENULTREM = 0.23 and fTYPE = 'RF' ) " & _
                            							 " OR ( fLASTREM = 4000.00 AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                            							 " OR ( fLASTREM = 0 and fPENULTREM = 212.92 and fTYPE = 'R¸' ) " & _
                            							 " OR ( fLASTREM = -11.81 and fPENULTREM = -9.18 and fTYPE = 'R¾' ) " & _
                            							 " OR ( fLASTREM = 0 and fPENULTREM = 171.87 and fTYPE = 'RÄ' )) "
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'AGRSCHEDULEVALUES
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN = " & fISN  
                  sqlValue = 404
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                 'AGRSCHEDULE
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULE WHERE fAGRISN = " & fISN  & _
                                           " AND ( fKIND = 9 OR fKIND = 2 OR fKIND = 7 ) "
                  sqlValue = 5
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
      ' խմբային տոկոսների հաշվարկ 43
      calcDate = "160314 "
      regDate = "160314 "
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      Log.Message(insGrISN)
      BuiltIn.Delay(1500)
             
                 'HI
                  queryString =  " SELECT COUNT(*) FROM HI WHERE fBASE = " & insGrISN  & _
                                            " AND (( fSUM = 25316 AND fCURSUM = 25316 ) " & _
                                						"	OR ( fSUM = 25316 AND fCURSUM = 63.29 ) " & _
                                						"	OR ( fSUM = 25140 AND fCURSUM = 62.85  ) " & _
                                						"	OR ( fSUM = 25140 AND fCURSUM = 62.85 )) "
                  sqlValue = 4
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & insGrISN  & _
                                           " AND (( fCURSUM = 62.85 AND fTYPE = 'R2' ) " & _
                  												 " OR ( fCURSUM = 88.96 AND fTYPE = 'R¸' ) " & _
                                           " OR ( fCURSUM = 0.44 AND fTYPE = 'R¾' ) " & _
                                           " OR ( fCURSUM = 58.19 AND fTYPE = 'RÄ' )) " 
                  sqlValue = 4
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                           " AND (( fLASTREM = 9558.6 AND fPENULTREM = 9640.6 AND fTYPE = 'R1' ) " & _
                            							 " OR ( fLASTREM = 88.96 AND fPENULTREM = 26.11 AND fTYPE = 'R2' ) " & _
                                           " OR ( fLASTREM = 0 AND fPENULTREM = 0.23 AND fTYPE = 'RF' ) " & _
                              						 " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                              						 " OR ( fLASTREM = 88.96 AND fPENULTREM = 0 AND fTYPE = 'R¸' ) " & _
                              						 " OR	( fLASTREM = -11.37 AND fPENULTREM = -11.81 AND fTYPE = 'R¾' ) " & _
                              						 " OR ( fLASTREM = 58.19 AND fPENULTREM = 0 AND fTYPE = 'RÄ' )) "
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIT
                  queryString = " SELECT COUNT(*) FROM HIT WHERE fBASE = " & insGrISN  & _
                                           " AND (( fCURSUM = 62.85 AND fTYPE = 'N2' ) " & _
          												         " OR ( fCURSUM = 0.44 AND fTYPE = 'N¾' )) "
                  sqlValue = 2
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
      ' Վարկի պարտքի մարում փաստաթղթի ստեղծում 44
      debtDate = "170314"
      debtSum = "50"
      debtSumPer = "50"
      Call LoanDebtRepaymentDocCreate(loanReptISN, debtDate, debtSum, debtSumPer)
      Log.Message(loanReptISN)
      BuiltIn.Delay(1500)
          
                    'HI
                    queryString =  " SELECT COUNT(*) FROM HI WHERE fBASE=  " & loanReptISN  & _
                                              " AND (( fSUM = 20000 AND fCURSUM = 20000 AND fOP = 'PRX') " & _
                                							"	OR ( fSUM = 20000 AND fCURSUM = 50 AND fOP = 'MSC' ) " & _
                                							"	OR ( fSUM = 20000 AND fCURSUM = 50 AND fOP = 'PRX' ) " & _
                                							"	OR ( fSUM = 20000 AND fCURSUM = 50 AND fOP = 'MSC' ) " & _
                                							"	OR ( fSUM = 50 AND fCURSUM = 20000 AND fOP = 'SAL' )) " 

                    sqlValue = 5
                    colNum = 0
                    sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                    If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                    End If
           
                    'HIR
                    queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & loanReptISN  & _
                                             " AND (( fCURSUM = 50 AND fTYPE = 'R1' ) " & _
                      											 " OR ( fCURSUM = 50 AND fTYPE = 'R2' ) " & _
                                             " OR ( fCURSUM = 50 AND fTYPE = 'R¸' ) " & _
                                             " OR ( fCURSUM = 50 AND fTYPE = 'RÄ' )) " 
                    sqlValue = 4
                    colNum = 0
                    sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                    If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                    End If

                    'HIRREST
                    queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                             " AND (( fLASTREM = 9508.6 AND fPENULTREM = 9558.6 AND fTYPE = 'R1' ) " & _
                              							 " OR ( fLASTREM = 38.96 AND fPENULTREM = 88.96 AND fTYPE = 'R2' ) " & _
                              							 " OR ( fLASTREM = 0 AND fPENULTREM = 0.23 AND fTYPE = 'RF' ) " & _
                              							 " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                              							 " OR ( fLASTREM =  38.96 AND fPENULTREM = 0 AND fTYPE = 'R¸' ) " & _
                              							 " OR ( fLASTREM = -11.37 AND fPENULTREM = -11.81 AND fTYPE = 'R¾' ) " & _
                              							 " OR ( fLASTREM = 8.19 AND fPENULTREM = 0 AND fTYPE = 'RÄ' )) "
                    sqlValue = 7
                    colNum = 0
                    sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                    If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                    End If
        
                    'HIF
                    queryString = "   SELECT COUNT(*) FROM HIF WHERE fBASE = " &  fISN 
                    sqlValue = 19
                    colNum = 0
                    sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                    If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                    End If

                    'AGRSCHEDULEVALUES
                    queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN = " & fISN  
                    sqlValue = 592
                    colNum = 0
                    sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                    If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                    End If

                   'AGRSCHEDULE
                    queryString = " SELECT COUNT(*) FROM AGRSCHEDULE WHERE fAGRISN = " & fISN  & _
                                             " AND (fKIND = 9 OR fKIND = 2 OR fKIND = 7) "
                    sqlValue = 7 
                    colNum = 0
                    sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                    If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                    End If
      
      ' Մարումներ գրաֆիկի վերանայում  
      reDate = "170314 "
      reDateAgr = "161216"
      Call RepaymentScheduleReview(repShedISN, reDate, reDateAgr, sumTotal)
      
      frmPttel.Close
         
      ' Մուտք Հաստատվող փաստաթղթեր 1 թղթապանակ
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
      Set frmAsUstPar = Sys.Process("Asbank").VBObject("frmAsUstPar")
      
      ' Ստուգում որ Վարկեր (Տեղաբաշխված) ՝ հաստատվող փաստաթղթեր 1 դիալոգը բացվել է
      If  Not frmAsUstPar.Exists Then
            Log.Error("Վարկեր (Տեղաբաշխված) ՝ հաստատվող փաստաթղթեր 1 դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Պայմանագրի համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NUM", docNum )
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      Call DocValidate(docNum)
      BuiltIn.Delay(1500)
      
                  'AGRSCHEDULE
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULE  WHERE fAGRISN =  " & fISN  & _
                                           " AND ( fKIND = 9 OR fKIND = 2 ) " 
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       

                  'AGRSCHEDULEVALUES
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN= " & fISN 
                  sqlValue = 660
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       

                  'HIF
                  queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & repShedISN  & _
                                           " and fTYPE = 'N0' and fADB = '0' " & _
                                           " AND (( fSUM = 0 AND fCURSUM = 0 AND fOP = 'DAJ' ) " & _
                                           " OR ( fSUM = 0.00 AND fCURSUM = 0.00 AND fOP = 'DPJ' ) " & _
                                           " OR ( fSUM = 0.00 AND fCURSUM = 0.00 AND fOP = 'DUA' ) " & _
                                           " OR ( fSUM = 27.2173 AND fCURSUM = 365.00 AND fOP = 'PN1' ) " & _
                                           " OR ( fSUM = 27.2173 AND fCURSUM = 365.00 AND fOP = 'PN2' ))  "
                  sqlValue = 5
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR   WHERE fBASE = " & repShedISN  & _
                                           " and fDBCR = 'C' and fADB = '0' " & _
                                           " AND (( fTYPE = 'RÄ' AND fCURSUM = 8.19 and fOP = 'AGP') " & _
                                           " or ( fTYPE = 'R¸' AND fCURSUM = 38.96 and fOP = 'PRP')) "
                  sqlValue = 2
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                           " AND (( fLASTREM = 9508.6 AND fPENULTREM = 9558.6 AND fTYPE = 'R1' ) " & _
                            							 " OR ( fLASTREM = 38.96 AND fPENULTREM = 88.96 AND fTYPE = 'R2' ) " & _
                            							 " OR ( fLASTREM = 0 AND fPENULTREM = 0.23 AND fTYPE = 'RF' ) " & _
                            							 " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                            							 " OR ( fLASTREM =  38.96 AND fPENULTREM = 0 AND fTYPE = 'R¸' ) " & _
                            							 " OR ( fLASTREM = -11.37 AND fPENULTREM = -11.81 AND fTYPE = 'R¾' ) " & _
                            							 " OR ( fLASTREM = 0 AND fPENULTREM = 0 AND fTYPE = 'RÄ' ) " & _
                                           " OR ( fLASTREM = 0 AND fPENULTREM = 0 AND fTYPE = 'R¸' )) "
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
      frmPttel.Close  
       
      ' Մուտք Պայմանագրեր թղթապանակ
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ") 
      
      ' Ստուգում որ Պայմանագրեր/ Վարկեր տեղաբաշխված դիալոգը բացվել է
      If  Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
             Log.Error("Պայմանագրեր/ Վարկեր տեղաբաշխված դիալոգը չի բացվել")
             Exit Sub
      End If    
      
      ' Պայմանագրի համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NUM", docNum )
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      Set wMainForm = Sys.Process("Asbank").VBObject("MainForm")
       
      ' Ստուգում որ Պայմանագրեր/ Վարկեր տեղաբաշխված թղթապանակը բացվել է
      If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Exists Then
             Log.Error("Պայմանագրեր/ Վարկեր տեղաբաշխված թղթապանակը չի բացվել")
             Exit Sub
      End If
       
      ' խմբային տոկոսների հաշվարկ 49
      calcDate = "140414 "
      regDate = "140414 "
      Call InterestGroupCalculation (calcDate,regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
      
                  'HI
                  queryString =  " SELECT COUNT(*) FROM HI WHERE fBASE = " & insGrISN  & _
                                            " AND (( fSUM = 73660.00 AND fCURSUM = 73660.00 AND fDBCR = 'C' ) " & _
                                            " OR	( fSUM = 73660.00 AND fCURSUM = 184.15 AND fDBCR = 'D' ) " & _
                                      			" OR	( fSUM = 72528.00 AND fCURSUM = 181.32 AND fDBCR = 'C' ) " & _
                                      			" OR	( fSUM = 72528.00 AND fCURSUM = 181.32 AND fDBCR = 'D' ))"
                  sqlValue = 4
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & insGrISN  & _
                                           " AND (( fCURSUM = 181.32 AND fTYPE = 'R2' and fOP = 'PER' )  " & _
                                           " OR ( fCURSUM = 220.28 AND fTYPE = 'R¸' and fOP = 'PRJ' )  " & _
                                           " OR ( fCURSUM = 2.83 AND fTYPE = 'R¾' and fOP = 'PER' ) " & _
                                           " OR ( fCURSUM = 169.15 AND fTYPE = 'RÄ' and fOP = 'AGJ')) " 
                  sqlValue = 4
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                           " AND (( fLASTREM = 9508.6 AND fPENULTREM = 9558.6 AND fTYPE = 'R1' ) " & _
                                           " OR ( fLASTREM = 220.28 AND fPENULTREM = 38.96 AND fTYPE = 'R2' ) " & _
                                           " OR ( fLASTREM = 0 AND fPENULTREM = 0.23 AND fTYPE = 'RF' ) " & _
                                           " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                                           " OR ( fLASTREM = 220.28 AND fPENULTREM = 00.00 AND fTYPE = 'R¸' ) " & _
                                           " OR	( fLASTREM = -8.54 AND fPENULTREM = -11.37 AND fTYPE = 'R¾' ) " & _
                                           " OR ( fLASTREM = 169.15 AND fPENULTREM = 0 AND fTYPE = 'RÄ' )) "
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIT
                  queryString = " SELECT COUNT(*) FROM HIT WHERE fBASE = " & insGrISN  & _
                                           " and fCUR = '001' and fOP = 'PER' " & _
                                           " AND (( fCURSUM = 181.32 AND fTYPE = 'N2' )  " & _
                                           " OR ( fCURSUM = 2.83 AND fTYPE = 'N¾' ))"
                  sqlValue = 2
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                  'HIF
                  queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                           " and fSUM = '0.00' and fCURSUM = '0.00' and fTYPE = 'N0' and fOP = 'DTC' " 
                  sqlValue = 1
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
      ' խմբային տոկոսների հաշվարկ
      calcDate = "150414 "
      regDate = "150414 "
      Call InterestGroupCalculation (calcDate,regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
      
                 'HI
                  queryString =  " SELECT COUNT(*) FROM HI WHERE fBASE = " & insGrISN  & _
                                            " AND (( fSUM = 2440.00 AND fCURSUM = 2440.00 AND fDBCR = 'C' and fCUR = '000') " & _
                                            " or ( fSUM = 24.00 AND fCURSUM = 0.06 AND fDBCR = 'D' and fCUR = '001') " & _
                                            " or ( fSUM = 24.00 AND fCURSUM = 24.00 AND fDBCR = 'C' and fCUR = '000') " & _
                                            " or ( fSUM = 2440.00 AND fCURSUM = 6.10 AND fDBCR = 'D' and fCUR = '001') " & _
                                            " or ( fSUM = 2456.00 AND fCURSUM = 6.14 AND fDBCR = 'C' and fCUR = '001') " & _
                                            " or ( fSUM = 2456.00 AND fCURSUM = 6.14 AND fDBCR = 'D' and fCUR = '001')) "
                  sqlValue = 6
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & insGrISN  & _
                                           " and fDBCR = 'D' and fADB = '0' and fCUR = '001' " & _
                                           " AND (( fCURSUM = 6.14 AND fTYPE = 'R2' )  " & _
                  												 " OR ( fCURSUM = 0.06 AND fTYPE = 'RF' ) " & _
                                           " OR ( fCURSUM = -0.04 AND fTYPE = 'R¾' )) " 
                  sqlValue = 3
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                           " AND (( fLASTREM = 9508.6 AND fPENULTREM = 9558.6 AND fTYPE = 'R1' )  " & _
                                           " OR ( fLASTREM = 226.42 AND fPENULTREM = 220.28 AND fTYPE = 'R2' )  " & _
                                           " OR ( fLASTREM = 0.06 AND fPENULTREM = 0 AND fTYPE = 'RF' )  " & _
                                           " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                                           " OR ( fLASTREM = 220.28 AND fPENULTREM = 0.00 AND fTYPE = 'R¸' ) " & _
                                           " OR ( fLASTREM = -8.58 AND fPENULTREM = -8.54 AND fTYPE = 'R¾' )  " & _
                                           " OR ( fLASTREM = 169.15 AND fPENULTREM = 0 AND fTYPE = 'RÄ' )) "
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIT
                  queryString = " SELECT COUNT(*) FROM HIT WHERE fBASE = " & insGrISN  & _
                                           " and fDBCR = 'D' and fADB = '0' and fCUR = '001' " & _
                                           " AND (( fCURSUM = 6.14 AND fTYPE = 'N2' ) " & _
          												         " OR ( fCURSUM = 0.06 AND fTYPE = 'NF' ) " & _
                                           " OR ( fCURSUM = -0.04 AND fTYPE = 'N¾' )) "
                  sqlValue = 3
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                 'HIF
                  queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                           " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' "
                  sqlValue = 5
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
      ' խմբային տոկոսների հաշվարկ  51
      calcDate = "210414 "
      regDate = "210414 "
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
      
                 'HI
                  queryString =  " SELECT COUNT(*) FROM HI WHERE fBASE = " & insGrISN  & _
                                            " AND (( fSUM = 14660.00 AND fCURSUM = 14660.00 AND fDBCR = 'C' ) " & _
                                            " OR ( fSUM = 132.00 AND fCURSUM = 0.33 AND fDBCR = 'D' ) " & _
                                            " OR ( fSUM = 132.00 AND fCURSUM = 132 AND fDBCR = 'C' ) " & _
                                            " OR ( fSUM = 14660.00 AND fCURSUM = 36.65 AND fDBCR = 'D' ) " & _
                                            " OR ( fSUM = 14740.00 AND fCURSUM = 36.85 AND fDBCR = 'C' ) " & _
                                            " OR ( fSUM = 14740.00 AND fCURSUM = 36.85 AND fDBCR = 'D' )) "
                  sqlValue = 6
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & insGrISN  & _
                                           " AND (( fCURSUM = 36.85 AND fTYPE = 'R2' ) " & _
                  												 " OR ( fCURSUM = 0.33 AND fTYPE = 'RF' ) " & _
                                           " OR ( fCURSUM = -0.20 AND fTYPE = 'R¾' )) " 
                  sqlValue = 3
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                           " AND (( fLASTREM = 9508.6 AND fPENULTREM = 9558.6 AND fTYPE = 'R1' ) " & _
                                           " OR ( fLASTREM = 263.27 AND fPENULTREM = 226.42 AND fTYPE = 'R2' ) " & _
                                           " OR ( fLASTREM = 0.39 AND fPENULTREM = 0.06 AND fTYPE = 'RF' ) " & _
                                           " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                                           " OR ( fLASTREM = 220.28 AND fPENULTREM = 0.00 AND fTYPE = 'R¸' ) " & _
                                           " OR ( fLASTREM = -8.78 AND fPENULTREM = -8.58 AND fTYPE = 'R¾' ) " & _
                                           " OR ( fLASTREM = 169.15 AND fPENULTREM = 0 AND fTYPE = 'RÄ' ))  "
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIT
                  queryString = " SELECT COUNT(*) FROM HIT WHERE fBASE = " & insGrISN  & _
                                           " AND (( fCURSUM = 36.85 AND fTYPE = 'N2' ) " & _
          												         " OR ( fCURSUM = 0.33 AND fTYPE = 'NF' ) " & _
                                           " OR ( fCURSUM = -0.20 AND fTYPE = 'N¾' )) "
                  sqlValue = 3
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                  'HIF
                 queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                          " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' "
                  sqlValue = 1
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
      ' Վարկի պարտքի մարում փաստաթղթի ստեղծում 52
      debtDate = "220414"
      debtSum = "700"
      debtSumPer = "700"
      Call LoanDebtRepaymentDocCreate(loanReptISN, debtDate, debtSum, debtSumPer)
      BuiltIn.Delay(1500)
      
                 'HI
                  queryString =  " SELECT COUNT(*) FROM HI WHERE fBASE=  " & loanReptISN  & _
                                            " AND (( fSUM = 105308.00 AND fCURSUM = 105308.00 AND fOP = 'PRX' ) " & _
                                            " OR ( fSUM = 174692.00 AND fCURSUM = 174692.00 AND fOP = 'PRX' )  " & _
                                            " OR ( fSUM = 156.00 AND fCURSUM = 156.00 AND fOP = 'PEX' )  " & _
                                            " OR ( fSUM = 156.00 AND fCURSUM = 0.39 AND fOP = 'PEX' ) " & _
                                            " OR ( fSUM = 280000 AND fCURSUM = 700 AND fOP = 'MSC' )  " & _
                                            " OR ( fSUM = 174692.00 AND fCURSUM = 436.73 AND fOP = 'PRX' )  " & _
                                            " OR ( fSUM = 105308.00 AND fCURSUM = 263.27 AND fOP = 'PRX' )  " & _
                                            " OR ( fSUM = 280000.00 AND fCURSUM = 700.00 AND fOP = 'MSC' )  " & _
                                            " OR ( fSUM = 263.27 AND fCURSUM = 105308.00 AND fOP = 'SAL' )  " & _
                                            " OR ( fSUM = 436.73 AND fCURSUM = 174692.00 AND fOP = 'SAL' )  " & _
                                            " OR ( fSUM = 0.39 AND fCURSUM = 156.00 AND fOP = 'SAL' )) " 

                  sqlValue = 11
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & loanReptISN  & _
                                           " and fOP = 'DBT' and fDBCR = 'C' " & _
                                           " AND (( fCURSUM = 700 AND fTYPE = 'R1' )" & _
                    											 " OR ( fCURSUM = 700 AND fTYPE = 'R2' ) " & _
                                           " OR ( fCURSUM = 0.39 AND fTYPE = 'RF' ) " & _
                                           " OR ( fCURSUM = 220.28 AND fTYPE = 'R¸' )" & _
                                           " OR ( fCURSUM = 169.15 AND fTYPE = 'RÄ' )) " 
                  sqlValue = 5
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                           " AND (( fLASTREM = 8808.6 AND fPENULTREM = 9508.6 AND fTYPE = 'R1' )  " & _
                            							 " OR ( fLASTREM = -436.73 AND fPENULTREM = 263.27 AND fTYPE = 'R2' ) " & _
                            							 " OR ( fLASTREM = 0 AND fPENULTREM = 0.39 AND fTYPE = 'RF' ) " & _
                            							 " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                            							 " OR ( fLASTREM =  0 AND fPENULTREM = 220.28 AND fTYPE = 'R¸' ) " & _
                            							 " OR ( fLASTREM = -8.78 AND fPENULTREM = -8.58 AND fTYPE = 'R¾' ) " & _
                            							 " OR ( fLASTREM = 0 AND fPENULTREM = 169.15 AND fTYPE = 'RÄ' )) "
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIF
                  queryString = "   SELECT COUNT(*) FROM HIF WHERE fBASE = " &  fISN 
                  sqlValue = 19
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'AGRSCHEDULEVALUES
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN = " & fISN  
                  sqlValue = 726
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                 'AGRSCHEDULE
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULE WHERE fAGRISN = " & fISN  & _
                                           " AND ( fKIND = 9 OR fKIND = 2 OR fKIND = 7 ) "
                  sqlValue = 9
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
      ' Մարումներ գրաֆիկի վերանայում       53      
      reDate = "220414"
      reDateAgr = "161216"
      sumTotal = "100000"
      Call RepaymentScheduleReview(repShedISN, reDate, reDateAgr, sumTotal)
      Log.Message(repShedISN)
      
      frmPttel.Close
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
      Set frmAsUstPar = Sys.Process("Asbank").VBObject("frmAsUstPar")
     
      ' Ստուգում որ Պայմանագրեր/ Վարկեր տեղաբաշխված դիալոգը բացվել է
      If Not  frmAsUstPar.Exists Then
             Log.Error("Պայմանագրեր/ Վարկեր տեղաբաշխված դիալոգը չի բացվել")
             Exit Sub
      End If     
      
      ' Պայմանագրի համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NUM", docNum )
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
                  'AGRSCHEDULE
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULE  WHERE fAGRISN =  " & fISN  & _
                                           " AND ( fKIND = 9 OR fKIND = 2 OR fKIND = 7 OR fKIND = 13 ) " 
                  sqlValue = 9
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'AGRSCHEDULEVALUES
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN= " & fISN 
                  sqlValue = 726
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIF
                  queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & fISN  & _
                                           " AND (( fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' ) " & _
          												         " OR ( fSUM = 10000 AND fCURSUM = 0 AND fTYPE = 'N0' ) " & _
                                           " OR ( fSUM = 24 AND fCURSUM = 365 AND fTYPE = 'N0' ) " & _
                                           " OR ( fSUM = 0 AND fCURSUM = 1 AND fTYPE = 'N0' ) " & _
                                           " OR ( fSUM = 26.8238 AND fCURSUM = 365 AND fTYPE = 'N0' ) " & _
                                           " OR ( fSUM = 26.9275 AND fCURSUM = 365 AND fTYPE = 'N0' ) " & _
                                           " OR ( fSUM = 1 AND fCURSUM = 0 AND fTYPE = 'N0' )) "
                  sqlValue = 19
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                           " AND (( fLASTREM = 8808.60 AND fPENULTREM = 9508.60 AND fTYPE = 'R1' )  " & _
                                           " OR ( fLASTREM = -436.73 AND fPENULTREM = 263.27 AND fTYPE = 'R2' )  " & _
                                           " OR ( fLASTREM = 0.00 AND fPENULTREM = 0.39 AND fTYPE = 'RF' )  " & _
                                           " OR ( fLASTREM = 4000.00 AND fPENULTREM = 0.00 AND fTYPE = 'R^' )  " & _
                                           " OR ( fLASTREM = 0.00 AND fPENULTREM = 220.28 AND fTYPE = 'R¸' )  " & _
                                           " OR ( fLASTREM = -8.78 AND fPENULTREM = -8.58 AND fTYPE = 'R¾' )  " & _
                                           " OR ( fLASTREM = 0.00 AND fPENULTREM = 169.15 AND fTYPE = 'RÄ' ) )"
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
      ' Մարումների գրաֆիկ փաստաթղթի վավերացում 
      Call DocValidate(docNum)
      BuiltIn.Delay(1500)
      
      ' Կատարել կոճակի սեղմում           
      Call ClickCmdButton(5, "Î³ï³ñ»É")
      ' Կատարել կոճակի սեղմում 
      Call ClickCmdButton(5, "Î³ï³ñ»É")
      ' Այո կոճակի սեղմում 
      Call ClickCmdButton(5, "²Ûá")
      frmPttel.Close  
         
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ") 
      
      ' Ստուգում որ Պայմանագրեր/ Վարկեր տեղաբաշխված դիալոգը բացվել է
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
             Log.Error("Պայմանագրեր/ Վարկեր տեղաբաշխված դիալոգը չի բացվել")
             Exit Sub
      End If  
      
      ' Փաստաթղթի համարի ներմուծում
      Call Rekvizit_Fill("Dialog", 1, "General", "NUM", docNum )
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
          
      ' Ստուգում որ Պայմանագրեր/ Վարկեր տեղաբաշխված թղթապանակը բացվել է
      If  Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Exists Then
              Log.Error("Պայմանագրեր/ Վարկեր տեղաբաշխված թղթապանակը չի բացվել")
              Exit Sub
      End If
       
      ' Վարկի տրամադրում փաստաթղթի ստեղծում
      createDate = "22/04/14"
      giveLoan = "ì³ñÏÇ ïñ³Ù³¹ñáõÙ"
       state = CheckCreatedLoanDocOrNo(mDate, dateAgr, createDate, giveLoan )
      
      ' Ստուգում որ Վարկի տրամադրում փաստաթուղթը ստեղծվել է
      If Not state Then
            Log.Error("Վարկի տրամադրում փաստաթուղթը չի ստեղծվել")
            Exit Sub 
      End If
      
      frmPttel.Close
        
      ' Մուտք Պայմանագրեր թղթապանակ
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ") 
      
      ' Ստուգում որ Պայմանագրեր/ Վարկեր տեղաբաշխված պատուհանը բացվել է
      If  Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
              Log.Error("Պայմանագրեր/ Վարկեր տեղաբաշխված պատուհանը չի բացվել")
              Exit Sub
      End If            
           
      ' Փաստաթղթի համարի ներմուծում
      Call Rekvizit_Fill("Dialog", 1, "General", "NUM", docNum ) 
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")          
        
      Set wMainForm = Sys.Process("Asbank").VBObject("MainForm")
          
      ' Ստուգել որ Պայմանագրեր/ Վարկեր տեղաբաշխված թղթապանակը բացվել է
      If  Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Exists Then
             Log.Error("Պայմանագրեր/ Վարկեր տեղաբաշխված թղթապանակը չի բացվել")
             Exit Sub
      End If
      
      BuiltIn.Delay(1500)
      
                  'AGRSCHEDULE
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULE  WHERE fAGRISN =  " & fISN  & _
                                           " AND (fKIND = 9 OR fKIND = 2 OR fKIND = 7 OR fKIND = 13) " 
                  sqlValue = 10
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       

                  'AGRSCHEDULEVALUES
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN= " & fISN 
                  sqlValue = 792
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
      ' խմբային տոկոսների հաշվարկ 59
      calcDate = "200514 "
      regDate = "200514 "
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      
                  'HI
                  queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE =  " & insGrISN 
                  sqlValue = 2913992.00
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIR
                  queryString = " SELECT SUM(fCURSUM) FROM HIR WHERE fBASE = " & insGrISN  
                  sqlValue = 5069.85 
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " & fISN & _
                                           " AND (( fLASTREM = 100000 AND fPENULTREM = 9508.6 AND fTYPE = 'R1' ) " & _
                                           " OR ( fLASTREM =1459.88 AND fPENULTREM = -436.73 AND fTYPE = 'R2' )  " & _
                                           " OR ( fLASTREM = 5.12 AND fPENULTREM = 0 AND fTYPE = 'RF' ) " & _
                                           " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' )  " & _
                                           " OR ( fLASTREM = 1075.60 AND fPENULTREM = 0 AND fTYPE = 'R¸' )  " & _
                                           " OR ( fLASTREM = -513.55 AND fPENULTREM = -8.78 AND fTYPE = 'R¾' ) " & _
                                           " OR ( fLASTREM = 2597.29 AND fPENULTREM = 0 AND fTYPE = 'RÄ' ))"
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIT
                  queryString = " SELECT SUM(fCURSUM) FROM HIT WHERE fBASE = " & insGrISN  
                  sqlValue = 1396.96
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                  'HIF
                 queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                          " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' "
                  sqlValue = 9
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
      ' Վարկի պարտքի մարում փաստաթղթի ստեղծում 60
      debtDate = "210514"
      debtSum = "100"
      debtSumPer = ""
      Call LoanDebtRepaymentDocCreate(loanReptISN, debtDate, debtSum, debtSumPer)
      Log.Message(loanReptISN)
      BuiltIn.Delay(3000)
      
                 'AGRSCHEDULE
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULE  WHERE fAGRISN =  " & fISN  & _
                                           " AND ( fKIND = 9 OR fKIND = 2 OR fKIND = 7 OR fKIND = 13 ) " 
                  sqlValue = 12
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
                  'AGRSCHEDULEVALUES
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN= " & fISN 
                  sqlValue = 924
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                 'HI
                  queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE =  " & loanReptISN  
                  sqlValue =  945656.72
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & loanReptISN   & _
                                            "  and fOP = 'DBT' and fDBCR = 'C' " & _
                                            " AND (( fCURSUM = 100 AND fTYPE = 'R1' )  " & _
                                            " OR ( fCURSUM = 1075.60 AND fTYPE = 'R2' )  " & _
                                            " OR ( fCURSUM = 5.12 AND fTYPE = 'RF' )  " & _
                                            " OR ( fCURSUM = 1075.60 AND fTYPE = 'R¸' )  " & _
                                            " OR ( fCURSUM = 100 AND fTYPE = 'RÄ' )) "  
                  sqlValue = 5
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIRREST
                  queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                           " AND fSTARTREM = '0.00'  " & _
                                           " AND (( fLASTREM = 99900 AND fPENULTREM = 100000 AND fTYPE = 'R1' )  " & _
                                           " OR ( fLASTREM = 384.28 AND fPENULTREM = 1459.88 AND fTYPE = 'R2' )  " & _
                                           " OR ( fLASTREM = 0 AND fPENULTREM = 5.12 AND fTYPE = 'RF' )  " & _
                                           " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' )  " & _
                                           " OR ( fLASTREM =  0 AND fPENULTREM = 1075.60 AND fTYPE = 'R¸' )  " & _
                                           " OR ( fLASTREM = -513.55 AND fPENULTREM = -8.78 AND fTYPE = 'R¾' )  " & _
                                           " OR ( fLASTREM = 2497.29 AND fPENULTREM = 2597.29 AND fTYPE = 'RÄ' )) "
                  sqlValue = 7
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
      
                  'HIF
                 queryString = " SELECT SUM(fSUM) FROM HIF WHERE fBASE = " & fISN  
                  sqlValue = 10078.7513 
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If   
                 
      ' խմբային տոկոսների հաշվարկ  61
      calcDate = "150614 "
      regDate = "150614 "
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      Log.Message(insGrISN)
      BuiltIn.Delay(1500)
      
                'HI
                queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE =  " & insGrISN  
                sqlValue = 3079104.00
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
                'HIR
                queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & insGrISN  & _
                                         " and fDBCR = 'D' and fADB = '0' " & _
                                         " AND (( fCURSUM = 1665.18 AND fTYPE = 'R2' ) " & _
                												 " OR ( fCURSUM = 21.35 AND fTYPE = 'RF' ) " & _
                												 " OR ( fCURSUM = 2049.46 AND fTYPE = 'R¸' ) " & _
                												 " OR ( fCURSUM = 497.17 AND fTYPE = 'R¾' ) " & _
                												 " OR ( fCURSUM = 2103.15 AND fTYPE = 'RÄ' )) "
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If

                'HIRREST
                queryString = " SELECT COUNT(*) FROM HIRREST WHERE fOBJECT = " &  fISN & _
                                         " AND (( fLASTREM = 99900 AND fPENULTREM = 100000 AND fTYPE = 'R1' ) " & _
                          							 " OR ( fLASTREM = 2049.46 AND fPENULTREM = 384.28 AND fTYPE = 'R2' ) " & _
                                         " OR ( fLASTREM = 21.35 AND fPENULTREM = 0 AND fTYPE = 'RF' ) " & _
                            						 " OR ( fLASTREM = 4000 AND fPENULTREM = 0 AND fTYPE = 'R^' ) " & _
                            						 " OR ( fLASTREM = 2049.46 AND fPENULTREM = 0 AND fTYPE = 'R¸' ) " & _
                            						 " OR ( fLASTREM = -16.38 AND fPENULTREM = -513.55 AND fTYPE = 'R¾' ) " & _
                            						 " OR ( fLASTREM = 4600.44 AND fPENULTREM = 2497.29 AND fTYPE = 'RÄ' )) "
                sqlValue = 7
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
           
                'HIT
                queryString = " SELECT COUNT(*) FROM HIT WHERE fBASE = " & insGrISN  & _
                                          " AND (( fCURSUM = 1665.18 AND fTYPE = 'N2' ) "& _
                  												" OR ( fCURSUM = 21.35 AND fTYPE = 'NF' ) "& _
                  												" OR ( fCURSUM = 497.17 AND fTYPE = 'N¾' ))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
                'HIF
               queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                        " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' "
                sqlValue = 2 
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
      ' խմբային տոկոսների հաշվարկ 62
      calcDate = "160614"
      regDate = "160614 "
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
      
                  'HI
                  queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE =  " & insGrISN  
                  sqlValue = 101008.00
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & insGrISN  & _  
                                           " AND (( fCURSUM = 62.66 AND fTYPE = 'R2' ) "& _
                      										 " OR ( fCURSUM = 1.51 AND fTYPE = 'RF' )  "& _
                      										 " OR ( fCURSUM = -0.57 AND fTYPE = 'R¾' )) "
                  sqlValue = 3
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIRREST
                  queryString = " SELECT SUM(fLASTREM) FROM HIRREST WHERE fOBJECT = " &  fISN 
                  sqlValue = 112667.93 
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIT
                  queryString = " SELECT COUNT(*) FROM HIT WHERE fBASE =  " & insGrISN & _
                                           " AND (( fCURSUM = 62.66 AND fTYPE = 'N2' ) "& _
                    											 " OR ( fCURSUM = 1.51 AND fTYPE = 'NF' ) "& _
                    											 " OR ( fCURSUM = -0.57 AND fTYPE = 'N¾' )) " 
                  sqlValue = 3
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                  'HIF
                 queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                          " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' "
                  sqlValue = 4
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

      ' խմբային տոկոսների հաշվարկ 63
      calcDate = "140714"
      regDate = "140714 "
      Call InterestGroupCalculation (calcDate, regDate, checkCount) 
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում 
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)           
      BuiltIn.Delay(1500)
      
                'HI
                  queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE =  " & insGrISN  
                  sqlValue = 2841568.00
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & insGrISN   & _
                                           " AND fCUR = '001' and fDBCR = 'D' " & _
                                           "AND ((fCURSUM = 1754.56 AND fTYPE = 'R2') " & _
                    											 " OR (fCURSUM = 42.35 AND fTYPE = 'RF') " & _
                    											 " OR (fCURSUM = 1817.22 AND fTYPE = 'R¸') " & _
                    											 " OR (fCURSUM = 0.49 AND fTYPE = 'R¾') " & _
                    											 " OR (fCURSUM = 2335.39 AND fTYPE = 'RÄ')) "
                  sqlValue = 5
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIRREST
                  queryString = "  SELECT SUM(fLASTREM) FROM HIRREST WHERE fOBJECT =  " &  fISN 
                  sqlValue = 118617.94
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIT
                  queryString = " SELECT COUNT(*) FROM HIT WHERE fBASE = " & insGrISN & _  
                                           " AND (( fCURSUM = 1754.56 AND fTYPE = 'N2' ) "& _
                    											 " OR ( fCURSUM = 42.35 AND fTYPE = 'NF' ) "& _
                    											 " OR ( fCURSUM = 0.49 AND fTYPE = 'N¾' )) "
                  sqlValue = 3
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                  'HIF
                  queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                           " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' "
                  sqlValue = 1
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
      ' Վարկի պարտքի մարում փաստաթղթի ստեղծում 64
      debtDate = "150714"
      debtSum = "500"
      debtSumPer = "200"
      Call LoanDebtRepaymentDocCreate(loanReptISN, debtDate, debtSum, debtSumPer)
      BuiltIn.Delay(1500)
      
                  'HI
                  queryString =  " SELECT SUM(fSUM)  FROM HI WHERE fBASE =  " & loanReptISN  
                  sqlValue = 612433.21
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & loanReptISN  & _
                                           " AND (( fCURSUM = 500 AND fTYPE = 'R1' ) " & _
                    											 " OR ( fCURSUM = 200 AND fTYPE = 'R2' ) " & _
                                           " OR ( fCURSUM = 65.21  AND fTYPE = 'RF' ) " & _
                                           " OR ( fCURSUM = 200 AND fTYPE = 'R¸' ) " & _
                                           " OR ( fCURSUM = 500 AND fTYPE = 'RÄ' )) " 
                  sqlValue = 5
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIRREST
                  queryString = " SELECT SUM(fLASTREM) FROM HIRREST WHERE fOBJECT = " &  fISN 
                  sqlValue = 117152.73
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIF
                  queryString = " SELECT SUM(fSUM) FROM HIF WHERE fBASE = " &  fISN 
                  sqlValue = 10078.7513
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'AGRSCHEDULEVALUES
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN = " & fISN  
                  sqlValue = 990
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                 'AGRSCHEDULE
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULE WHERE fAGRISN = " & fISN  & _
                                           " AND (fKIND = 9 OR fKIND = 2 OR fKIND = 7 OR fKIND = 13) "
                  sqlValue = 13
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
      ' խմբային տոկոսների հաշվարկ 65
      calcDate = "140814 "
      regDate = "140814 "
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
       
                'HI
                  queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE = " & insGrISN  
                  sqlValue = 3085296.00
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIR
                  queryString = " SELECT SUM(fCURSUM) FROM HIR WHERE fBASE = " & insGrISN  
                  sqlValue = 6114.29 
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIRREST
                  queryString = " SELECT SUM(fLASTREM)  FROM HIRREST WHERE fOBJECT =  " &  fISN 
                  sqlValue = 123267.02 
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIT
                  queryString = "SELECT SUM(fCURSUM) FROM HIT WHERE fBASE = " & insGrISN  
                  sqlValue = 1961.68
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                  'HIF
                 queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                          " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' "
                  sqlValue = 4
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

      ' խմբային պարտքերի մարում
      calcDate = "150814"
      regDate = "150814"
      Call GroupDebt (calcDate, regDate, checkCount)
      
      dateType = "53"
      ' Խմբային պարտքերի մարում փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, debtGrISN)
      BuiltIn.Delay(1500)
       
                'AGRSCHEDULE
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULE  WHERE fAGRISN =  " & fISN  & _
                                           " AND ( fKIND = 9 OR fKIND = 2 OR fKIND = 7 OR fKIND = 13 ) " 
                  sqlValue = 14
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
                  'AGRSCHEDULEVALUES
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN =  " & fISN 
                  sqlValue = 1048
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                'HI
                  queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE = " & debtGrISN  
                  sqlValue = 11462203.22
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIR
                  queryString = " SELECT SUM(fCURSUM) FROM HIR WHERE fBASE = " & debtGrISN  
                  sqlValue = 28575.84
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIRREST
                  queryString = " SELECT SUM(fLASTREM)  FROM HIRREST WHERE fOBJECT =  " &  fISN 
                  sqlValue = 94691.18
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIF
                 queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & fISN  
                  sqlValue = 19
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                      Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       
      ' խմբային տոկոսների հաշվարկ 67
      calcDate = "150914 "
      regDate = "150914 "
      dateType = "511"
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
      
                  'HI
                  queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE = " & insGrISN  
                  sqlValue = 3052376.00
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
 
                  'HIR
                  queryString = " SELECT SUM(fCURSUM) FROM HIR WHERE fBASE = " & insGrISN  
                  sqlValue = 6061.03
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIRREST
                  queryString = " SELECT SUM(fLASTREM)  FROM HIRREST WHERE fOBJECT =  " &  fISN 
                  sqlValue = 100752.21
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIT
                  queryString = " SELECT  SUM(fCURSUM) FROM HIT WHERE fBASE = " &  insGrISN 
                  sqlValue = 1908.42
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIF
                  queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                           "  AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' "
                  sqlValue = 8
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
      ' խմբային տոկոսների հաշվարկ 68
      calcDate = "180914 "
      regDate = "180914 "
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
        
                  'HI
                  queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE = " & insGrISN  
                  sqlValue = 279728.00
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIR
                  queryString = " SELECT SUM(fCURSUM) FROM HIR WHERE fBASE = " & insGrISN  
                  sqlValue = 175.28
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIRREST
                  queryString = " SELECT SUM(fLASTREM)  FROM HIRREST WHERE fOBJECT =  " &  fISN 
                  sqlValue = 100927.49
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIT
                  queryString = " SELECT  SUM(fCURSUM) FROM HIT WHERE fBASE = " &  insGrISN 
                  sqlValue = 175.28
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
 
                  'HIF
                 queryString = " SELECT COUNT(*)  FROM HIF WHERE fBASE = " & insGrISN  & _
                                          " AND fSUM = '0.00' AND fCURSUM = 0 AND fTYPE = 'N0' "
                  sqlValue = 1
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
 
      ' խմբային պարտքերի մարում 69  (70)
      calcDate = "190914"
      regDate = "190914"
      Call GroupDebt (calcDate, regDate, checkCount)
      dateType = ""
      
      ' Խմբային պարտքերի մարում փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, debtGrISN)
      BuiltIn.Delay(1500)
      
                 'AGRSCHEDULE
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULE  WHERE fAGRISN =  " & fISN  & _
                                           " AND  (fKIND = 9 OR fKIND = 2 OR fKIND = 7 OR fKIND = 13) " 
                  sqlValue = 15
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
       

                  'AGRSCHEDULEVALUES
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN= " & fISN 
                  sqlValue = 1104
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                  'HI
                  queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE = " & debtGrISN  
                  sqlValue = 3326363.95 
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'HIR
                  queryString = " SELECT SUM(fCURSUM) FROM HIR WHERE fBASE = " & debtGrISN  
                  sqlValue = 8308.25
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIRREST
                  queryString = " SELECT SUM(fLASTREM)  FROM HIRREST WHERE fOBJECT =  " &  fISN 
                  sqlValue = 92619.24 
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIF
                 queryString = " SELECT Sum(fSUM) FROM HIF WHERE fBASE = " & fISN  
                  sqlValue = 10078.7513
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

      ' խմբային տոկոսների հաշվարկ 70
      calcDate = "141014 "
      regDate = "141014 "
      dateType = "511"
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
       
                 'HI
                 queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE = " & insGrISN  
                 sqlValue = 2420056.00
                 colNum = 0
                 sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                 If Not sql_isEqual Then
                   Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                 End If
           
                 'HIR
                 queryString = " SELECT SUM(fCURSUM) FROM HIR WHERE fBASE = " & insGrISN  
                 sqlValue = 5666.35 
                 colNum = 0
                 sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                 If Not sql_isEqual Then
                   Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                 End If
        
                 'HIRREST
                 queryString = " SELECT SUM(fLASTREM)  FROM HIRREST WHERE fOBJECT =  " &  fISN 
                 sqlValue = 98285.59 
                 colNum = 0
                 sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                 If Not sql_isEqual Then
                   Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                 End If
        
                  'HIT
                  queryString = " SELECT  SUM(fCURSUM) FROM HIT WHERE fBASE = " &  insGrISN 
                  sqlValue = 1513.74
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
 
                  'HIF
                  queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                           " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' "
                  sqlValue = 3
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
      ' Վարկի պարտքի մարում փաստաթղթի ստեղծում 71
      debtDate = "151014"
      debtSum = ""
      debtSumPer = "500"
      Call LoanDebtRepaymentDocCreate(loanReptISN, debtDate, debtSum, debtSumPer)
      Log.Message(loanReptISN)
      BuiltIn.Delay(1500)
       
                  'HI
                  queryString =  " SELECT SUM(fSUM)  FROM HI WHERE fBASE =  " & loanReptISN  
                  sqlValue = 2327516.00
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIR
                  queryString = " SELECT COUNT(*) FROM HIR WHERE fBASE = " & loanReptISN  & _
                                           " AND (( fCURSUM = 2408.77 AND fTYPE = 'R1' ) " & _
                    											 " OR ( fCURSUM = 500 AND fTYPE = 'R2' ) " & _
                                           " OR ( fCURSUM = 500 AND fTYPE = 'R¸' ) " & _
                                           " OR ( fCURSUM = 2408.77 AND fTYPE = 'RÄ' )) " 
                  sqlValue = 4
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIRREST
                  queryString = " SELECT SUM(fLASTREM) FROM HIRREST WHERE fOBJECT = " &  fISN 
                  sqlValue = 92468.05
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIF
                  queryString = " SELECT SUM(fSUM) FROM HIF WHERE fBASE = " &  fISN 
                  sqlValue = 10078.7513
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'AGRSCHEDULEVALUES
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN = " & fISN  
                  sqlValue = 1160
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                  'AGRSCHEDULE
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULE WHERE fAGRISN = " & fISN  & _
                                           " AND (fKIND = 9 OR fKIND = 2 OR fKIND = 7 OR fKIND = 13) "
                  sqlValue = 16
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

      ' խմբային տոկոսների հաշվարկ 72
      calcDate = "061114 "
      regDate = "061114 "
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
      
                'HI
                queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE = " & insGrISN  
                sqlValue = 2078752.00
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
           
                'HIR
                queryString = " SELECT SUM(fCURSUM) FROM HIR WHERE fBASE = " & insGrISN  
                sqlValue = 1297.93 
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
           
                'HIRREST
                queryString = " SELECT SUM(fLASTREM)  FROM HIRREST WHERE fOBJECT =  " &  fISN 
                sqlValue = 93765.98
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
        
                'HIT
                queryString = " SELECT  SUM(fCURSUM) FROM HIT WHERE fBASE = " &  insGrISN 
                sqlValue = 1297.93
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
 
                'HIF
                queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If

      ' Վարկի պարտքի մարում փաստաթղթի ստեղծում 73
      debtDate = "071114"
      debtSum = "100"
      debtSumPer = "170"
      Call LoanDebtRepaymentDocCreate(loanReptISN, debtDate, debtSum, debtSumPer)
      Log.Message(loanReptISN)
      BuiltIn.Delay(1500)
      
                  'HI
                  queryString =  " SELECT SUM(fSUM)  FROM HI WHERE fBASE =  " & loanReptISN  
                  sqlValue = 216170.00
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIR
                  queryString = " SELECT SUM(fCURSUM) FROM HIR WHERE fBASE = " & loanReptISN  
                  sqlValue = 440.00
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIRREST
                  queryString = " SELECT SUM(fLASTREM) FROM HIRREST WHERE fOBJECT = " &  fISN 
                  sqlValue = 93325.98
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIF
                  queryString = " SELECT SUM(fSUM) FROM HIF WHERE fBASE = " &  fISN 
                  sqlValue = 10078.7513
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
           
                  'AGRSCHEDULEVALUES
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN = " & fISN  
                  sqlValue = 1216
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                 'AGRSCHEDULE
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULE WHERE fAGRISN = " & fISN  & _
                                           " AND ( fKIND = 9 OR fKIND = 2 OR fKIND = 7 OR fKIND = 13 ) "
                  sqlValue = 17
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
 
      ' խմբային տոկոսների հաշվարկ 74
      calcDate = "141214 "
      regDate = "141214 "
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
       
                  'HI
                  queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE = " & insGrISN  
                  sqlValue = 3389096.00
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIR
                  queryString = " SELECT SUM(fCURSUM) FROM HIR WHERE fBASE = " & insGrISN  
                  sqlValue = 10335.02 
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

                  'HIRREST
                  queryString = " SELECT SUM(fLASTREM)  FROM HIRREST WHERE fOBJECT =  " &  fISN 
                  sqlValue = 103661.00 
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIT
                  queryString = " SELECT  SUM(fCURSUM) FROM HIT WHERE fBASE = " &  insGrISN 
                  sqlValue = 2130.46
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
 
                  ''HIF
                  queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                           " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' "
                  sqlValue = 6
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
      ' խմբային տոկոսների հաշվարկ 75
      calcDate = "151214 "
      regDate = "151214 "
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
        
                 'HI
                queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE = " & insGrISN  
                sqlValue = 86184.00
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
        
                'HIR
                queryString = " SELECT SUM(fCURSUM) FROM HIR WHERE fBASE = " & insGrISN  
                sqlValue = 54.41 
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If

                'HIRREST
                queryString = " SELECT SUM(fLASTREM)  FROM HIRREST WHERE fOBJECT =  " &  fISN 
                sqlValue = 103715.41
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
        
                'HIT
                queryString = " SELECT  SUM(fCURSUM) FROM HIT WHERE fBASE = " &  insGrISN 
                sqlValue = 54.41
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
 
                ''HIF
               queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                        " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' "
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
      
      ' խմբային տոկոսների հաշվարկ 76
      calcDate = "251214 "
      regDate = "251214 "
      Call InterestGroupCalculation (calcDate, regDate, checkCount)
      
      ' Խմբային տոկոսների հաշվարկ փաստաթղթի ISN - ի ստացում
      Call GetDocISN(paramN, calcDate, status, dateType, insGrISN)
      BuiltIn.Delay(1500)
        
                'HI
                queryString =  " SELECT SUM(fSUM) FROM HI WHERE fBASE = " & insGrISN  
                sqlValue = 863424.00 
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                   Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
                       
                'HIR
                queryString = " SELECT SUM(fCURSUM) FROM HIR WHERE fBASE = " & insGrISN  
                sqlValue = 546.05 
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If

                'HIRREST
                queryString = " SELECT SUM(fLASTREM)  FROM HIRREST WHERE fOBJECT =  " &  fISN 
                sqlValue = 104261.46
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
        
                'HIT
                queryString = " SELECT  SUM(fCURSUM) FROM HIT WHERE fBASE = " &  insGrISN 
                sqlValue = 546.05
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
 
                'HIF
                queryString = " SELECT COUNT(*) FROM HIF WHERE fBASE = " & insGrISN  & _
                                         " AND fSUM = 0 AND fCURSUM = 0 AND fTYPE = 'N0' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If
           
      ' խմբային պարտքերի մարում 77
      calcDate = "261214"
      regDate = "261214"
      Call GroupDebt (calcDate, regDate, checkCount)
      
      ' Խմբային պարտքերի մարում փաստաթղթի ISN - ի ստացում
      dateType = ""
      Call GetDocISN(paramN, calcDate, status, dateType, debtGrISN)
      BuiltIn.Delay(1500)
        
                  'HI
                  queryString =  " SELECT SUM(fSUM)  FROM HI WHERE fBASE =  " & debtGrISN  
                  sqlValue = 7457221.74
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIR
                  queryString = " SELECT SUM(fCURSUM) FROM HIR WHERE fBASE = " & debtGrISN    
                  sqlValue = 18594.28
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIRREST
                  queryString = " SELECT SUM(fLASTREM) FROM HIRREST WHERE fOBJECT = " &  fISN 
                  sqlValue = 85667.18
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'HIF
                  queryString = "SELECT SUM(fSUM) FROM HIF WHERE fBASE = " &  fISN 
                  sqlValue = 10078.7513
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
        
                  'AGRSCHEDULEVALUES
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULEVALUES WHERE fAGRISN = " & fISN  
                  sqlValue = 1266
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If
      
                 'AGRSCHEDULE
                  queryString = " SELECT COUNT(*) FROM AGRSCHEDULE WHERE fAGRISN = " & fISN  & _
                                           " AND ( fKIND = 9 OR fKIND = 2 OR fKIND = 7 OR fKIND = 13 ) "
                  sqlValue = 18
                  colNum = 0
                  sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                  If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                  End If

      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "261214"
      eStart = "261214"
      param = c_OpersView
      status = True
      dateType = ""
      Call DeleteActionOverdraft(param, sStart, eStart, status, dateType) 
       
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "251214"
      eStart = "251214"
      Call DeleteActionOverdraft(param, sStart, eStart, status, dateType) 
         
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "151214"
      eStart = "151214"
      dateType = "511"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
      dateType = ""
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
          
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "141214"
      eStart = "141214"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
        
      ' Վարկի պարտքի մարում փաստաթղթի ջնջում
      sStart = "071114"
      eStart = "071114"
      Call DeleteActionOverdraft(param, sStart, eStart, status, dateType) 
      BuiltIn.Delay(1500)
       
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "061114"
      eStart = "061114"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType)  
        
      ' Վարկի պարտքի մարում փաստաթղթի ջնջում
      sStart = "151014"
      eStart = "151014"
      dateType = "53"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
      dateType = ""
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
        
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "190914"
      eStart = "190914"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
        
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "180914"
      eStart = "180914"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
           
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "150914"
      eStart = "150914"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
        
      BuiltIn.Delay(1500)
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "150814"
      eStart = "150814"
      dateType = "53"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
      dateType = ""
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
     
      ' Վարկի պարտքի մարում փաստաթղթի ջնջում
      sStart = "150714"
      eStart = "150714"
      dateType = "53"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
      dateType = ""
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
      
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "160614"
      eStart = "160614"
      dateType = "511"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
      dateType = ""
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
      
      ' Վարկի պարտքի մարում փաստաթղթի ջնջում
      sStart = "210514"
      eStart = "210514"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
          
      BuiltIn.Delay(1500)
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "200514"
      eStart = "200514"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType)   
       
      ' Մարումներ գրաֆիկի ջնջում
      Call DelRepSched()
            
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "220414"
      eStart = "220414"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
       
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "210414"
      eStart = "210414"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType)  
       
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "150414"
      eStart = "150414"
      dateType = "511"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
      dateType = ""
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
       
      ' Մարումներ գրաֆիկի ջնջում
      Call DelRepSched()
         
      ' Վարկի պարտքի մարում փաստաթղթի ստեղծում 
      sStart = "170314"
      eStart = "170314"
      dateType = "53"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
      dateType = ""
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
       
      ' Վարկի պարտքի մարում փաստաթղթի ջնջում
      sStart = "070314"
      eStart = "070314"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
       
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "060314"
      eStart = "060314"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
         
      BuiltIn.Delay(1500)
      ' Մարումներ գրաֆիկի ջնջում
      Call DelRepSched()
           
      ' Վարկի պարտքի մարում փաստաթղթի ջնջում
      sStart = "210214"
      eStart = "210214"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
        
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "200214"
      eStart = "200214"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
          
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "170214"
      eStart = "170214"
      dateType = "511"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
      dateType = ""
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
           
      ' Վարկի պարտքի մարում փաստաթղթի ջնջում
      sStart = "150114"
      eStart = "150114"
      dateType = "53"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
      dateType = ""
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
          
      ' խմբային տոկոսների հաշվարկի ջնջում
      sStart = "140114"
      eStart = "140114"
      Call DeleteActionOverdraft(param, sStart, eStart,  status, dateType) 
           
      ' Մուտք համակարգ ARMSOFT օգտագործողով
      Login("ARMSOFT")
      ' Մուտք Հաճախորդի սպասարկում և դրամարկղ  ԱՇՏ
      Call ChangeWorkspace(c_CustomerService) 
      BuiltIn.Delay(5000)
      
      ' Կանխիկ ելք փաստաթղթերի ջնջում
      docType = "KasRsOrd"
      Call DelPaymentdoc(mDate,docType, docNumOut)
      
      ' Կանխիկ մուտք փաստաթղթերի ջնջում
      docType = "KasPrOrd"
      Call DelPaymentdoc(mDate, docType, docNumIn)
         
      ' Մուտք համակարգ CREDITOPERATOR օգտագործողով
      Login("CREDITOPERATOR")    
        
      ' Մուտք գործել վարկեր տեղաբաշխված/ պայմանագրեր թղթապանակ
      Call ChangeWorkspace(c_Loans)
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ") 
       
      ' Ստուգում որ Պայմանագրեր/ Վարկեր տեղաբաշխված թղթապանակը բացվել է
      If  Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
             Log.Error("Պայմանագրեր/ Վարկեր տեղաբաշխված թղթապանակը չի բացվել")
             Exit Sub
      End If
       
      ' Փաստաթղթի համարի ներմուծում
      Call Rekvizit_Fill("Dialog", 1, "General", "NUM", docNum )
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
          
      Set wMainForm = Sys.Process("Asbank").VBObject("MainForm")
      
      ' Ստուգում որ Պայմանագրեր/ Վարկեր տեղաբաշխված պատուհանը բացվել է
      If  Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Exists Then
             Log.Error("Պայմանագրեր/ Վարկեր տեղաբաշխված պատուհանը չի բացվել")
             Exit Sub
      End If    
        
      pladgeNumber = "¶ñ³íÇ å³ÛÙ³Ý³·Çñ (Ý³Ë³·ÇÍ)- "& pladgeDocNum & "         " & docNum
             
      ' Ջնջել գրավ փաստաթուղթը
      Call  DelTermsDoc(pladgeNumber)
      BuiltIn.Delay(1500)

'      mDate = "16/12/13"
'      pladgeNumber  = "Ø³ñáõÙÝ»ñÇ ·ñ³ýÇÏ`  " & mDate 
'      ' Ջնջել Մարումների գրաֆիկը
'      Call  DelTermsDoc(pladgeNumber)
'      
'      pladgeNumber = "²ÛÉ í×³ñáõÙÝ»ñÇ ·ñ³ýÇÏ`  " & mDate 
'      ' Ջնջել Պայամանգրեր թղթապանակից
'      Call  DelTermsDoc(pladgeNumber)

      ' Ջնջել վարկի տրամադրում փաստաթուղթը
      pladgeNumber = "ì³ñÏÇ ïñ³Ù³¹ñáõÙ, ¶áõÙ³ñÁª " & summ & " -²ØÜ ¹áÉ³ñ"
      Call  DelTermsDoc(pladgeNumber)

      ' Ջնջել գանձում տրամադրումից փաստաթուղթը            
      pladgeNumber = "¶³ÝÓáõÙ ïñ³Ù³¹ñáõÙÇó, ¶áõÙ³ñÁª 4000 -Ð³ÛÏ³Ï³Ý ¹ñ³Ù"
      Call  DelTermsDoc(pladgeNumber)
      
      ' Ջնջել պայմանագիրը                
      Call DelDoc()
      frmPttel.Close
      
      ' Փակել ծրագիրը
      Call Close_AsBank()
     
End Sub