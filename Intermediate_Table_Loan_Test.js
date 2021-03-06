Option Explicit
'USEUNIT Subsystems_SQL_Library
'USEUNIT Library_Common
'USEUNIT Library_CheckDB 
'USEUNIT Constants
'USEUNIT Payment_Except_Library
'USEUNIT Intermediate_Table_Library
'USEUNIT SWIFT_International_Payorder_Library

' Test case ID 166593
 
 Sub Intermediate_Table_Loan_Test()
                                
      Dim loanCode, crdtCode, outerCode, templateN, loanCurrency , redCurr, setAccount, insPayCalc,_
              loanMoney, dateSealing, dateGive, dateRepay, wComment, wOffice, wSection, acType, autoDebt, debtPart,_
              dateFillType, repBegin, repEnd, minDays, parMonth, parDay, passOvDirect, passOvType, sumDateFillType, marBeg,_
              wRepayment, pauseCount, sumFillType, dbtMinPer, summInDbt, fillRound, kindScale, pCarg, pCargSect,_
              unusePartRate, unusePartRateSect , pcGrant, pcGrantSect, redPeriod, fillRoundPr, deviation, agrMin, agrMax,_
              payPerGive, giveCount, periodically, effRate, actualRate, autoLoanCount, penMoney, penMoneySect, penLoan,_
              penLoanSect, countPenMoney, penMoneyRate, penMoneyRateSect, countBTHD, countBTHDSect,_
              richness, purpose, wProgram, wGuarantee, wCountry, wState, wStateNew, wNote, wNote2, wNote3,_
              contPaperN, transTime, subjecClass, excerptForm, stDate, extParagraph, extParDay, timeDev, avoidDays
                                 
      Dim savePath, fName, fileName1, fileName2, wMainForm
      
      Dim  startDate, fDate     
      
      Dim queryString, sqlValue, colNum, sql_isEqual 
      
      startDate = "20100101"
      fDate = "20250101"
      Call Initialize_AsBank("bank", startDate, fDate)
               
      fileName1 = Project.Path & "Stores\Intermediate table\ActualLoanError.txt"
      aqFile.Delete(fileName1)
       
      Call Create_Connection()
      Login("ARMSOFT")
      
            'CONTRACTS
            queryString = " SELECT COUNT(*) FROM CONTRACTS "
            sqlValue = 3355
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If 
            
'       Մուտք Միջ. Աղյուսակներից ներմուծման ԱՇՏ
      Call ChangeWorkspace(c_ImpTable)
      ' Մուտք վարկային պայմանագրերի բացում
      Call wTreeView.DblClickItem("|ØÇç. ²ÕÛáõë³ÏÝ»ñÇó Ý»ñÙáõÍÙ³Ý ²Þî|ì³ñÏ³ÛÇÝ å³ÛÙ³Ý³·ñ»ñÇ µ³óáõÙ")
            
      Delay(5000) 
      ' Այո կոճակի սեղմում
      Call ClickCmdButton(5, "²Ûá")
      
      savePath = Project.Path & "Stores\Intermediate table\"
      fName = "ActualLoanError.txt"
      fileName2 = Project.Path & "Stores\Intermediate table\ExpectedLoanError.txt"

      ' Ստուգում որ սխալի հաղորդագրություն պատուհանը  բացվել է
      If  wMDIClient.WaitVBObject("FrmSpr",600000).Exists Then
            ' Հիշել քաղվածքը
            Call SaveDoc(savePath, fName)

            Call Compare_Files(fileName1, fileName2, "")
            
            BuiltIn.Delay(10000)
            Call Close_Window(wMDIClient, "FrmSpr" )  
            BuiltIn.Delay(2000)
      Else
            Log.Error("Սխալի հաղորդագրության պատուհանը չի բացվել")
      End If      
          
      BuiltIn.Delay(10000)
      ' Մուտք գործել վարկեր տեղաբաշխված/ Պայմանագրեր
      Call ChangeWorkspace(c_Loans)
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
      
      ' Ստուգում որ Պայմանագրեր / Վարկեր (տեղաբաշխված) դիալոգը  բացվել է 
      If Not p1.WaitVBObject("frmAsUstPar",10000).Exists Then
            Log.Error("Պայմանագրեր / Վարկեր (տեղաբաշխված) դիալոգը չի բացվել ")
            Exit Sub
      End If
      
           'CONTRACTS
            queryString = " SELECT COUNT(*) FROM CONTRACTS "
            sqlValue = 3434
            colNum = 0
            sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
            If Not sql_isEqual Then
              Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
            End If
      
      outerCode = "645003002658L001"
      ' Արտաքին N դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "OUTERCODE", outerCode)   
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")      
      
      BuiltIn.Delay(1300)
      ' Ստուգում որ Պայմանագրեր / Վարկեր (տեղաբաշխված) թղթապանակը  բացվել է 
      If Not wMDIClient.VBObject("frmPttel").Exists Then
            Log.Error("Պայմանագրեր / Վարկեր (տեղաբաշխված) թղթապանակը  չի բացվել")
            Exit Sub
      End If    
 
      ' Գրաֆիկով վարկային պայմանագրի ստուգում
      loanCode = "A000003"
      crdtCode = "777003002658L001"
      TemplateN = "22"
      loanCurrency = "000"
      redCurr = ""
      setAccount = ""
      insPayCalc = ""
      loanMoney = "180,990.00"
      dateSealing = "22/07/19"
      dateGive = "22/07/19"
      dateRepay = "22/07/20"
      wComment = ""
      wOffice = "00"
      wSection = "1"
      acType = "C10"
      autoDebt = 0
      debtPart = "1"
      dateFillType = ""
      repBegin = "22/08/19"
      repEnd = "22/07/20"
      minDays = "0"
      parMonth = "0"
      parDay = "0"
      passOvDirect = "2"
      passOvType = "0"
      sumDateFillType = ""
      marBeg = "0"
      wRepayment = "0"
      pauseCount = "0"
      sumFillType = ""
      dbtMinPer = "0.0000"
      summInDbt = "0.00"
      fillRound = "2"
      kindScale = "1"
      pCarg = "0.0000"
      pCargSect = "1"
      unusePartRate = "0.0000"
      unusePartRateSect = "1"
      pcGrant = "0.0000"
      pcGrantSect = "1"
      redPeriod = "0"
      fillRoundPr = "2"
      deviation = "0.0000"
      agrMin= "0.0000"
      agrMax = "0.0000"
      payPerGive = 0
      giveCount = "0"
      periodically = 0
      effRate = "0.0000"
      actualRate = "0.1825"
      autoLoanCount = 1
      penMoney = "0.1300"
      penMoneySect = "1"
      penLoan = "0.1300"
      penLoanSect = "1"
      countPenMoney = "4"
      penMoneyRate = "0.1300"
      penMoneyRateSect = "1"
      CountBTHD = 1
      countBTHDSect = 1
      richness= "U3"
      purpose = "12"
      wProgram = "9"
      wGuarantee = "9"
      wCountry = "AM"
      wState = "001"
      wStateNew = "010010130"
      wNote = "1"
      wNote2 = "500"
      wNote3 = "4"
      contPaperN = "A000266"
      transTime = "00:00:00"
      subjecClass = 0
      excerptForm = "2"
      stDate = "01/08/19"
      extParagraph = "1"
      extParDay = "0"
      timeDev = "2"
      avoidDays = "2"

      Call CheckLoanContract(loanCode, crdtCode, outerCode, templateN, loanCurrency , redCurr, setAccount, insPayCalc,_
                                                   loanMoney, dateSealing, dateGive, dateRepay, wComment, wOffice, wSection, acType, autoDebt, debtPart,_
                                                   dateFillType, repBegin, repEnd, minDays, parMonth, parDay, passOvDirect, passOvType, marBeg, sumDateFillType,_
                                                   wRepayment, pauseCount, sumFillType, dbtMinPer, summInDbt, fillRound, kindScale, pCarg, pCargSect, unusePartRate,_
                                                   unusePartRateSect , pcGrant, pcGrantSect, redPeriod, fillRoundPr, deviation, agrMin, agrMax, payPerGive,_
                                                   giveCount, periodically, effRate, actualRate, autoLoanCount, penMoney, penMoneySect, penLoan,_
                                                   penLoanSect, countPenMoney, penMoneyRate, penMoneyRateSect, countBTHD, countBTHDSect,_
                                                   richness, purpose, wProgram, wGuarantee, wCountry, wState, wStateNew, wNote, wNote2, wNote3,_
                                                   contPaperN, transTime, subjecClass, excerptForm, stDate, extParagraph, extParDay, timeDev,_
                                                   avoidDays )
                                                                       
                                             
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
      
      ' Ստուգում որ Պայմանագրեր / Վարկեր (տեղաբաշխված) դիալոգը  բացվել է 
      If Not p1.WaitVBObject("frmAsUstPar",2000).Exists Then
            Log.Error("Պայմանագրեր / Վարկեր (տեղաբաշխված) դիալոգը չի բացվել ")
            Exit Sub
      End If
      
      outerCode = "157"
      ' Արտաքին N դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "OUTERCODE", outerCode)   
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")      
      
      ' Ստուգում որ Պայմանագրեր / Վարկեր (տեղաբաշխված) թղթապանակը  բացվել է 
      If Not wMDIClient.WaitVBObject("frmPttel",10000).Exists Then
            Log.Error("Պայմանագրեր / Վարկեր (տեղաբաշխված) թղթապանակը  չի բացվել")
            Exit Sub
      End If   
 
      ' Գրաֆիկով վարկային պայմանագրի ստուգում - 04
      loanCode = "A000079"
      crdtCode = "777000349178L001"
      TemplateN = ""
      loanCurrency = "000"
      redCurr = ""
      setAccount = ""
      insPayCalc = ""
      loanMoney = "150,000.00"
      dateSealing = "18/04/19"
      dateGive = "18/04/19"
      dateRepay = "19/04/21"
      wComment = ""
      wOffice = "00"
      wSection = "1"
      acType = "C10"
      autoDebt = 0
      debtPart = "1"
      dateFillType = ""
      repBegin = "18/04/19"
      repEnd = "19/04/21"
      minDays = "0"
      parMonth = "0"
      parDay = "0"
      passOvDirect = "2"
      passOvType = "0"
      sumDateFillType = ""
      marBeg = "0"
      wRepayment = "0"
      pauseCount = "0"
      sumFillType = ""
      dbtMinPer = "0.0000"
      summInDbt = "0.00"
      fillRound = "2"
      kindScale = "1"
      pCarg = "0.0000"
      pCargSect = "1"
      unusePartRate = "0.0000"
      unusePartRateSect = "1"
      pcGrant = "0.0000"
      pcGrantSect = "1"
      redPeriod = "0"
      fillRoundPr = "2"
      deviation = "0.0000"
      agrMin= "0.0000"
      agrMax = "0.0000"
      payPerGive = 0
      giveCount = "0"
      periodically = 0
      effRate = "0.0000"
      actualRate = "0.0585"
      autoLoanCount = 1
      penMoney = "0.0000"
      penMoneySect = "1"
      penLoan = "0.0000"
      penLoanSect = "1"
      countPenMoney = ""
      penMoneyRate = "0.0000"
      penMoneyRateSect = "1"
      CountBTHD = 1
      countBTHDSect = 0
      richness= "T1.1"
      purpose = "12"
      wProgram = "9"
      wGuarantee = "9"
      wCountry = "AM"
      wState = "001"
      wStateNew = "010010130"
      wNote = ""
      wNote2 = ""
      wNote3 = ""
      contPaperN = "123"
      transTime = "00:00:00"
      subjecClass = 0
      excerptForm = ""
      stDate = "  /  /  "
      extParagraph = "0"
      extParDay = "0"
      timeDev = "0"
      avoidDays = ""

      Call CheckLoanContract(loanCode, crdtCode, outerCode,  templateN, loanCurrency , redCurr, setAccount, insPayCalc,_
                                                   loanMoney, dateSealing, dateGive, dateRepay, wComment, wOffice, wSection, acType, autoDebt, debtPart,_
                                                   dateFillType, repBegin, repEnd, minDays, parMonth, parDay, passOvDirect, passOvType, marBeg, sumDateFillType,_
                                                   wRepayment, pauseCount, sumFillType, dbtMinPer, summInDbt, fillRound, kindScale, pCarg, pCargSect, unusePartRate,_
                                                   unusePartRateSect , pcGrant, pcGrantSect, redPeriod, fillRoundPr, deviation, agrMin, agrMax, payPerGive,_
                                                   giveCount, periodically, effRate, actualRate, autoLoanCount, penMoney, penMoneySect, penLoan,_
                                                   penLoanSect, countPenMoney, penMoneyRate, penMoneyRateSect, countBTHD, countBTHDSect,_
                                                   richness, purpose, wProgram, wGuarantee, wCountry, wState, wStateNew, wNote, wNote2, wNote3,_
                                                   contPaperN, transTime, subjecClass, excerptForm, stDate, extParagraph, extParDay, timeDev,_
                                                   avoidDays )   
                                             
      Call wTreeView.DblClickItem("|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
      
      ' Ստուգում որ Պայմանագրեր / Վարկեր (տեղաբաշխված) դիալոգը  բացվել է 
      If Not p1.WaitVBObject("frmAsUstPar",2000).Exists Then
            Log.Error("Պայմանագրեր / Վարկեր (տեղաբաշխված) դիալոգը չի բացվել ")
            Exit Sub
      End If
      
      outerCode = "700"
      ' Արտաքին N դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "OUTERCODE", outerCode)   
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")      
      
      ' Ստուգում որ Պայմանագրեր / Վարկեր (տեղաբաշխված) թղթապանակը  բացվել է 
      If Not wMDIClient.WaitVBObject("frmPttel",10000).Exists Then
            Log.Error("Պայմանագրեր / Վարկեր (տեղաբաշխված) թղթապանակը  չի բացվել")
            Exit Sub
      End If 
 
      ' Գրաֆիկով վարկային պայմանագրի ստուգում - 05
      loanCode = "A000084"
      crdtCode = "777000349046L001"
      TemplateN = ""
      loanCurrency = "000"
      redCurr = ""
      setAccount = ""
      insPayCalc = ""
      loanMoney = "150,000.00"
      dateSealing = "18/04/19"
      dateGive = "18/04/19"
      dateRepay = "19/04/21"
      wComment = ""
      wOffice = "00"
      wSection = "1"
      acType = "C10"
      autoDebt = 0
      debtPart = "1"
      dateFillType = "2"
      repBegin = "08/05/19"
      repEnd = "19/04/21"
      minDays = "0"
      parMonth = "1"
      parDay = "0"
      passOvDirect = "2"
      passOvType = "0"
      sumDateFillType = "1"
      marBeg = "0"
      wRepayment = "0"
      pauseCount = "0"
      sumFillType = "05"
      dbtMinPer = "0.0000"
      summInDbt = "0.00"
      fillRound = "2"
      kindScale = "1"
      pCarg = "1.0000"
      pCargSect = "365"
      unusePartRate = "0.0000"
      unusePartRateSect = "1"
      pcGrant = "0.0000"
      pcGrantSect = "1"
      redPeriod = "0"
      fillRoundPr = "2"
      deviation = "0.0000"
      agrMin= "0.0000"
      agrMax = "0.0000"
      payPerGive = 0
      giveCount = "0"
      periodically = 0
      effRate = "1.0043"
      actualRate = "1.0955"
      autoLoanCount = 1
      penMoney = "0.0000"
      penMoneySect = "1"
      penLoan = "0.0000"
      penLoanSect = "1"
      countPenMoney = ""
      penMoneyRate = "0.0000"
      penMoneyRateSect = "1"
      CountBTHD = 1
      countBTHDSect = 0
      richness= "T1.1"
      purpose = "12"
      wProgram = "9"
      wGuarantee = "9"
      wCountry = "AM"
      wState = "001"
      wStateNew = "010010130"
      wNote = ""
      wNote2 = ""
      wNote3 = ""
      contPaperN = "123"
      transTime = "00:00:00"
      subjecClass = 0
      excerptForm = ""
      stDate = "  /  /  "
      extParagraph = "0"
      extParDay = "0"
      timeDev = "0"
      avoidDays = ""

      Call CheckLoanContract(loanCode, crdtCode, outerCode, templateN, loanCurrency , redCurr, setAccount, insPayCalc,_
                                                   loanMoney, dateSealing, dateGive, dateRepay, wComment, wOffice, wSection, acType, autoDebt, debtPart,_
                                                   dateFillType, repBegin, repEnd, minDays, parMonth, parDay, passOvDirect, passOvType, marBeg, sumDateFillType,_
                                                   wRepayment, pauseCount, sumFillType, dbtMinPer, summInDbt, fillRound, kindScale, pCarg, pCargSect, unusePartRate,_
                                                   unusePartRateSect , pcGrant, pcGrantSect, redPeriod, fillRoundPr, deviation, agrMin, agrMax, payPerGive,_
                                                   giveCount, periodically, effRate, actualRate, autoLoanCount, penMoney, penMoneySect, penLoan,_
                                                   penLoanSect, countPenMoney, penMoneyRate, penMoneyRateSect, countBTHD, countBTHDSect,_
                                                   richness, purpose, wProgram, wGuarantee, wCountry, wState, wStateNew, wNote, wNote2, wNote3,_
                                                   contPaperN, transTime, subjecClass, excerptForm, stDate, extParagraph, extParDay, timeDev,_
                                                   avoidDays)                                   
                                             
                                             
      ' Փակել ծրագիրը
      Call Close_AsBank()

End Sub