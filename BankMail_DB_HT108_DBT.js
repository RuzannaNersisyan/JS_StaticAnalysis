Option Explicit
'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Online_PaySys_Library
'USEUNIT BankMail_Library
'USEUNIT BankMail_Library
'USEUNIT Library_CheckDB
'USEUNIT Constants
'USEUNIT Library_Contracts

' Test Case ID 165072

Sub BankMail_DB_HT108_DBT()

      Dim ordType, fISN, wAcsBranch, wAcsDepart, payDate, docNum, cliCode, accDB, payer, ePayer, taxCods,_
              jurState, dbDropDown, coaNum, balAcc, accMask, accCur, accType, cliName, cCode, accNote, accNote2,_
              accNote3, acsBranch, acsDepart, acsType, pCardNum, socCard, accCR, receiver, eReceiver, summa, wCur,_
              wAim, jurStatR, bankCr, authorPerson, addInfo, wAddress, authPerson, rInfo
      Dim dbRes, dbJurState, dbArea, dbTaxCod, debtOr, dbAddress, dbMng, dbInfo
      Dim workEnvName, workEnv, stRekName, endRekName, wStatus, isnRekName
      Dim colN, action, doNum, doActio, status, state
      Dim docTypeName, commentName, confPath, confInput
      Dim queryString, sqlValue, colNum, sql_isEqual
      Dim childISN, wChildISN, grRemOrdNum, grRemOrdISN, ordChildISN
      Dim paramName, paramValue, sBody, bodyValue, wDateTime
      Dim pattern, checkVal, wDate, lacsBranch, tdDate
      Dim startDate, fDate, verifyDocuments
     
      startDate = "20030101"
      fDate = "20250101"
      Call Initialize_AsBank("bank", startDate, fDate)
               
      ' Մուտք համակարգ ARMSOFT օգտագործողով
      Call Create_Connection()
      Login("ARMSOFT")
      
      ' BMUSEDB պարամետրի արժեքը դնել 1
      paramName = "BMUSEDB"
      paramValue = "1"
      Call  SetParameter(paramName, paramValue)
      
      ' BMDBSERVER պարամետրի արժեքը դնել qasql2017
      paramName = "BMDBSERVER"
      paramValue = "qasql2017"
      Call  SetParameter(paramName, paramValue)
      
      ' BMDBNAME պարամետրի արժեքը դնել BankMail_Testing
      paramName = "BMDBNAME"
      paramValue = "BankMail_Testing"
      Call  SetParameter(paramName, paramValue)
      
      ' Կարգավորումների ներմուծում
      confPath = "X:\Testing\Order confirm phases\AllVerify_New.txt"
      confInput = Input_Config(confPath)
      If Not confInput Then
          Log.Error("Կարգավորումները չեն ներմուծվել")
         Exit Sub
      End If
      
      ' Մուտք Հաճախորդների սպասարկում և դրամարկղ(Ընդլայնված)
      Call ChangeWorkspace(c_CustomerService)
      
      ' Մուտք աշխատանքային փաստաթղթեր թղթապանակ
      workEnvName = "|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      workEnv = "Աշխատանքային փաստաթղթեր"
      wDate = "290517"
      stRekName = "PERN"
      endRekName = "PERK"
      wStatus = False
      state =  AccessFolder(workEnvName, workEnv, stRekName, wDate, endRekName, wDate, wStatus, isnRekName, fISN)
      If Not state Then
            Log.Error("Մուտք Աշխատանքային փաստաթղթեր թղթապանակ ձախողվել է")
            Exit Sub
      End If
      
      payDate = "290517"
      ordType = "BDG"
      accDB = "77700/000001101"
      wCur = "001"
      payer = "ê³ëáõÝóÇ ¸³íÇÃ"
      accCR = "90000/5001020"
      receiver = "Ð»ÕÝ³ñ ²ÕµÛáõñ"
      summa = "600"
      wAim = "æñÇ í³ñÓ"
      dbDropDown = False
      accCur = "001"
      cliCode = "00000002"
      taxCods = "02502151"
      
      ' Վճարման հանձնարարագրի լրացում
      Call PaymOrdToBeSentFill(ordType, fISN, wAcsBranch, wAcsDepart, payDate, docNum, cliCode, accDB, payer, ePayer, taxCods,_
                                                          jurState, dbDropDown, coaNum, balAcc, accMask, accCur, accType, cliName, cCode, accNote, accNote2,_
                                                          accNote3, acsBranch, acsDepart, acsType, pCardNum, socCard, accCR, receiver, eReceiver, summa, wCur,_
                                                          wAim, jurStatR, bankCr, authorPerson, addInfo, wAddress, authPerson, rInfo)
      Log.Message(fISN)
      Log.Message(docNum)
      
      BuiltIn.Delay(3000)
      ' Կատարել բոլոր գործողությունները
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Խմբագրել Վճարման հանձնարարագրի պայմանագիրը
      Call wMainForm.PopupMenu.Click(c_ToEdit)
      If Not wMDIClient.VBObject("frmASDocForm").Exists Then
            Log.Error("Վճարման հանձնարարագրի պայմանագիրը չի բացվել")
            Exit Sub
      End If
      
      dbRes = "1"
      dbJurState = "12"
      dbArea = "24"
      dbTaxCod = "12345678"
      debtOr = "Ø»Í ØÑ»ñ êäÀ"
      dbAddress = "ù. ê³ëáõÝ 3ñ¹ ÷áÕáó 5 ï."
      dbMng = "²ÕµÛáõñ ê»ñáµ"
      dbInfo= "ÌáíÇÝ³ñ ï³ïÇÏÇó"
      
      ' Ռեզիդենտություն դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "DBRES", dbRes)
      ' Իրավաբանական կարգավիճակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "DBJURSTAT", dbJurState)
      ' Տարած. կոդ դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "DBAREA", dbArea)
      ' ՀՎՀՀ դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "DBTAXCOD", dbTaxCod)
      ' Անվանում դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "DEBTOR", debtOr)
      ' Հասցե դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "DBADDRESS", dbAddress)
      ' Լիազորված անձ դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "DBMNG", dbMng)
      ' Լրացուցիչ ինֆորմացիա դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "DBINFO", dbInfo)
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É") 
      
      Log.Message("SQL Check 1") 
    ' SQL ստուգում HI աղյուսակում
     queryString = " SELECT COUNT(*)  FROM HI WHERE fBASE= " & fISN & _
                              " AND fTYPE = '11' AND fCUR = '001'   AND fCURSUM = '600.00' AND fOP = 'TRF' " & _ 
                              " AND fDBCR = 'C' AND fSUID = '77' AND fSUM = '240000.00' "
      sqlValue = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 

      queryString = " SELECT COUNT(*)  FROM HI WHERE fBASE= " & fISN & _
                              " AND fTYPE = '11' AND fCUR = '001'   AND fCURSUM = '600.00' AND fOP = 'TRF' " & _ 
                              " AND fDBCR = 'D' AND fSUID = '77' AND fSUM = '240000.00' "
      sqlValue = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 
              
      queryString = " SELECT COUNT(*)  FROM HI WHERE fBASE= " & fISN & _
                               " AND fTYPE = '11' AND fCUR = '000'   AND fCURSUM = '24000.00' AND fOP = 'FEE' " & _
                               " AND fDBCR = 'C' AND fSUID = '77' AND fSUM = '24000.00' "
      sqlValue = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 
              
      queryString = " SELECT COUNT(*) FROM HI WHERE fBASE= " & fISN & _
                              " AND fTYPE = '11' AND fCUR = '000'   AND fCURSUM = '24000.00' AND fOP = 'FEE' " & _
                              " AND fDBCR = 'D' AND fSUID = '77' AND fSUM = '24000.00' "
      sqlValue = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 

      docTypeName = "ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (áõÕ.)"
      commentName = "²Ùë³ÃÇí- 29/05/17 N- "& docNum &" ¶áõÙ³ñ-               600.00 ²ñÅ.- 001 [ÊÙµ³·ñíáÕ           ]"
      
      ' Ստուգել որ Վճարման հանձնարարագիրն առկա է Հաճախորդի թղթապանակում
      status = CheckPayOrderAvailableOrNot(docTypeName, commentName)
      If Not status Then
           Log.Error("Վճարման հանձնարարագիրն առկա չէ Հաճախորդի թղթապանակում")
           Exit Sub  
      End If
      
      ' Փակել հաճախորդի թղթապանակը
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel_2").Close
            
      ' Վճարման հանձնարարագիրը ուղարկել հաստատման
      Call PaySys_Send_To_Verify()
      
      ' Կատարել կոճակի սեղմում
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel").Close
      
      ' Մուտք VERIFIER  օգտագործողով
      Login("VERIFIER")
      Call ChangeWorkspace(c_Verifier1)
'      Call wTreeView.DblClickItem("|Ð³ëï³ïáÕ I ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
      BuiltIn.Delay(1000)
      
      Set verifyDocuments = New_VerificationDocument()
      verifyDocuments.User = "^A[Del]"
      Call GoToVerificationDocument("|Ð³ëï³ïáÕ I ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ",verifyDocuments)
      If Not wMDIClient.VBObject("frmPttel").Exists Then
            Log.Error("Հաստատվող փաստաթղթեր թղթապանակը չի բացվել")
            Exit Sub
      End If
      
      ' Պայամանագրի վավերացում
      colN = 3
      action = c_ToConfirm
      doActio = "Ð³ëï³ï»É"
      doNum = 1
      status =  ConfirmContractDoc(colN, docNum, action, doNum, doActio)
      
      If Not status Then
            Log.Error("Վճարման հանձնարարագիրն առկա չէ")
            Exit Sub  
      End If
        
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel").Close
        
      ' Մուտք ARMSOFT  օգտագործողով
      Login("ARMSOFT")
      
       ' Մուտք Գլխավոր հաշվապահի ԱՇՏ   
      Call ChangeWorkspace(c_ChiefAcc)
      
      ' Մուտք Հաշվառված Վճարային փաստաթղթեր թղթապանակ
      workEnvName = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      workEnv = "Հաշվառված վճարային փաստաթղթեր"
      state = AccessFolder(workEnvName, workEnv, stRekName, wDate, endRekName, wDate, wStatus, isnRekName, fISN)
      If Not state Then
            Log.Error("Մուտք Հաշվառված վճարային փաստաթղթեր թղթապանակ ձախողվել է")
            Exit Sub
      End If
      
      ' Պայմանագրի առկայության ստուգում Հաշվառված վճարային փաստաթղթեր թղթապանակում
      colN = 2
      status = CheckContractDoc(colN, docNum)
       If Not status Then
            Log.Error("Վճարման հանձնարարագիրն առկա է Վճարային փաստաթղթեր թղթապանակում")
            Exit Sub  
      End If 
      
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel").Close
        
      ' Մուտք Արտքաին փոխանցումների ԱՇՏ  
      Call ChangeWorkspace(c_ExternalTransfers)
      
      ' Մուտք Ուղարկվող հաձնարարագրեր թղթապանակ
      workEnvName = "|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|àõÕ³ñÏíáÕ Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|àõÕ³ñÏíáÕ Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ"
      workEnv = "Ուղարկվող հաձնարարագրեր "
      state = AccessFolder(workEnvName, workEnv, stRekName, wDate, endRekName, wDate, wStatus, isnRekName, fISN)
      If Not state Then
            Log.Error("Մուտք Ուղարկվող հաձնարարագրեր թղթապանակ ձախողվել է")
            Exit Sub
      End If
      
      Log.Message("SQL Check 2") 
     ' SQL ստուգում HI աղյուսակում
     queryString = " SELECT COUNT(*) FROM HI WHERE fBASE= " & fISN & _
                              " AND fTYPE = '01' AND fCUR = '001'   AND fCURSUM = '600.00' AND fOP = 'TRF' " & _ 
                              " AND fDBCR = 'C' AND fSUID = '77' AND fSUM = '240000.00' AND fBASEBRANCH = '00' AND fBASEDEPART = '1' "
      sqlValue = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 

      queryString = " SELECT COUNT(*) FROM HI WHERE fBASE= " & fISN & _
                              " AND fTYPE = '01' AND fCUR = '001'   AND fCURSUM = '600.00' AND fOP = 'TRF' " & _ 
                              " AND fDBCR = 'D' AND fSUID = '77' AND fSUM = '240000.00' AND fBASEBRANCH = '00' AND fBASEDEPART = '1' "
      sqlValue = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 
              
      queryString = " SELECT COUNT(*) FROM HI WHERE fBASE= " & fISN & _
                               " AND fTYPE = '01' AND fCUR = '000'   AND fCURSUM = '24000.00' AND fOP = 'FEE' " & _
                               " AND fDBCR = 'C' AND fSUID = '77' AND fSUM = '24000.00' AND fBASEBRANCH = '00' AND fBASEDEPART = '1' "
      sqlValue = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 
              
      queryString = " SELECT COUNT(*) FROM HI WHERE fBASE= " & fISN & _
                              " AND fTYPE = '01' AND fCUR = '000'   AND fCURSUM = '24000.00' AND fOP = 'FEE' " & _
                              " AND fDBCR = 'D' AND fSUID = '77' AND fSUM = '24000.00' AND fBASEBRANCH = '00' AND fBASEDEPART = '1' "
      sqlValue = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 
      
      ' Վճարման հանձնարարագիրն ուղարկել BankMail 
      colN = 2
      action = c_SendToBM
      doNum = 5
      doActio = "²Ûá"
      status = ConfirmContractDoc(colN, docNum, action, doNum, doActio)
      If Not status Then
            Log.Error("Վճարման հանձնարարագիրն առկա չէ Ուղարկվող հաձնարարագրեր թղթապանակում")
            Exit Sub  
      End If 
      
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel").Close
      
      ' Մուտք Ուղարկված BankMail թղթապանակ
      workEnvName = "|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|àõÕ³ñÏí³Í  Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|àõÕ³ñÏí³Í BankMail"
      workEnv = "Ուղարկված BankMail"
      state = AccessFolder(workEnvName, workEnv, stRekName, wDate, endRekName, wDate, wStatus, isnRekName, fISN)
      If Not state Then
            Log.Error("Մուտք Ուղարկված BankMail թղթապանակ ձախողվել է")
            Exit Sub
      End If
      
      ' Պայմանագրի առկայության ստուգում
      colN = 1
      status = CheckContractDoc(colN, docNum)
      If Not status Then
            Log.Error("Վճարման հանձնարարագիրն առկա չէ ուղարկված BankMail թղթապանակում")
            Exit Sub  
      End If 
      
      Log.Message("SQL Check 3")  
    ' SQL ստուգում HI աղյուսակում
     queryString = " SELECT COUNT(*) FROM HI WHERE fBASE= " & fISN & _
                              " AND fTYPE = '01' AND fCUR = '001'   AND fCURSUM = '600.00' AND fOP = 'TRF' " & _ 
                              " AND fDBCR = 'C' AND fSUID = '77' AND fSUM = '240000.00' AND fBASEBRANCH = '00' AND fBASEDEPART = '1' "
      sqlValue = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 

      queryString = " SELECT COUNT(*) FROM HI WHERE fBASE= " & fISN & _
                              " AND fTYPE = '01' AND fCUR = '001'   AND fCURSUM = '600.00' AND fOP = 'TRF' " & _ 
                              " AND fDBCR = 'D' AND fSUID = '77' AND fSUM = '240000.00' AND fBASEBRANCH = '00' AND fBASEDEPART = '1' "
      sqlValue = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 
              
      queryString = " SELECT COUNT(*) FROM HI WHERE fBASE= " & fISN & _
                               " AND fTYPE = '01' AND fCUR = '000'   AND fCURSUM = '24000.00' AND fOP = 'FEE' " & _
                               " AND fDBCR = 'C' AND fSUID = '77' AND fSUM = '24000.00' AND fBASEBRANCH = '00' AND fBASEDEPART = '1' "
      sqlValue = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 
              
      queryString = " SELECT COUNT(*) FROM HI WHERE fBASE= " & fISN & _
                              " AND fTYPE = '01' AND fCUR = '000'   AND fCURSUM = '24000.00' AND fOP = 'FEE' " & _
                              " AND fDBCR = 'D' AND fSUID = '77' AND fSUM = '24000.00'AND fBASEBRANCH = '00' AND fBASEDEPART = '1' "
      sqlValue = 1
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 
              
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel").Close
      
      ' Մուտք BANKMAIL օգտագործողով
      Login("BANKMAIL")
       
      ' Մուտք ուղարկված փոխանցումներ  
      Call ChangeWorkspace(c_BM)

      ' Դիտել Վճարման հանձնարարագիրը
      status = True
      Call WiewPayOrderFromTransferSent(wDate, fISN, childISN, status, wDateTime)
      If childISN =  "" Then
            Log.Error("Վճարման հանձնարարագիրն առկա չէ Ուղարկվող փոխանցումներ թղթապանակում")
            Exit Sub  
      End If 
      
      ' Ծնող-զավակ կապի ստուգում  
      queryString = "SELECT fISN FROM DOCP WHERE fISN = " & childISN & " AND fPARENTISN = " & fISN
      wChildISN = Get_Query_Result(queryString)
      Log.Message(childISN)
      If  Trim(wChildISN) <> Trim(childISN) Then
            Log.Error("Ծնող-զավակ կապի բացակայություն")
      End If

      ' Պայմանագրին ուղարկել BankMail
      colN = 2
      status = Contract_To_Bank_Mail(colN, fISN)
      BuiltIn.Delay(3000)
      If Not status Then
            Log.Error("Պայմանագիրը չի գտնվել Bank Mail ուղարկելու համար")
            Exit Sub
      End If
      
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel").Close
      
      ' Այսօրվա ամսաթվի ստացում
      tdDate = aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d%m%y")
      
      ' Մուտք ուղարկված փոխանցումներ թղթապանակ
      workEnvName = "|BankMail ²Þî|öáË³ÝóáõÙÝ»ñ|àõÕ³ñÏí³Í ÷áË³ÝóáõÙÝ»ñ"
      workEnv = "Ուղարկված փոխանցումներ"
      state = AccessFolder(workEnvName, workEnv, stRekName, tdDate, endRekName, tdDate, wStatus, isnRekName, fISN)
      If Not state Then
            Log.Error("Մուտք Ուղարկված փոխանցումներ ձախողվել է")
            Exit Sub
      End If
      
      ' Պայմանագրի առկայության ստուգում
      colN = 3
      status = CheckContractDoc(colN, fISN)
      If Not status Then
          Log.Error("BankMail ուղարկված հաղորդագրությունը բացակայում է ուղարկված հաղորդագրություններ թղթապանակից")
      End If
      
      sBody = ":20:" & fISN & vbCRLF _
                  & ":23E:TUBG" & vbCRLF _ 
                  & ":30A:" & tdDate & Replace(wDateTime,":","") & vbCRLF & ":32A:" & wDate & "USD600," & vbCRLF _
                  & ":23P:LP" & vbCRLF _
                  & ":50F:" & Replace(accDB, "/", "") & vbCRLF _
                  & "77700" & vbCRLF _ 
                  & "1/" & payer & vbCRLF _
                  & "2/02502151" & vbCRLF _
                  & "8/ÊÝÓáñÇ Óáñ³Ï 1" & vbCRLF _ 
                  & ":23Q:LP" & vbCRLF _          
                  & ":59E:" & Replace(accCR, "/", "") & vbCRLF _
                  & "1/" & receiver & vbCRLF _
                  & ":70A:" & wAim & vbCRLF _
                  & ":23S:LP" & vbCRLF _  
                  & ":72A:1/Ø»Í ØÑ»ñ êäÀ" & vbCRLF _       
                  & "2/12345678"  & vbCRLF _       
                  & "8/" & dbAddress & vbCRLF _ 
                  & "0/²ÕµÛáõñ ê»ñáµ" & vbCRLF _         
                  & ":77B:PTD/OTM000000E000000OT/24/0"
          
      ' Տվյալների ստուգում [qasql2017].BankMail_Testing.dbo.bmInterface աղյուսակում
      queryString = " SELECT Body FROM [qasql2017].BankMail_Testing.dbo.bmInterface WHERE AS_ISN = " & wChildISN
      bodyValue = Get_Query_Result(queryString)
      If  Trim(sBody) <> Trim(bodyValue) Then
            Log.Error("Փաստաթղթի տվյալները BankMail-ում չեն համապատասխանում dictionary-ով փոխանցվող տվյալների հետ")
      End If
         
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel").Close
      
      ' Փակել ծրագիրը
      Call Close_AsBank()
End Sub