Option Explicit
'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Online_PaySys_Library
'USEUNIT BankMail_Library
'USEUNIT BankMail_Library
'USEUNIT Library_CheckDB
'USEUNIT Constants

' Test Case ID 165386

Sub Payment_Intra_Bank_Test_New()

      Dim paramName, paramValue, confPath, confInput
      Dim ordType, fISN, wAcsBranch, wAcsDepart, wDate, docNum, cliCode, accDB, payer, ePayer, taxCods,_
              jurState, dbDropDown, coaNum, balAcc, accMask, accCur, accType, cliName, cCode, accNote, accNote2,_
              accNote3, acsBranch, acsDepart, acsType, pCardNum, socCard, accCR, receiver, eReceiver, summa, wCur,_
              wAim, jurStatR, bankCr, authorPerson, addInfo, wAddress, authPerson, rInfo
      Dim queryString, sqlValue, colNum, sql_isEqual
      Dim workEnvName, workEnv, stRekName, endRekName, wStatus, isnRekName
      Dim wKassa, colN, status, sendTo, action, doNum, doActio
      Dim startDate, fDate
     
      startDate = "20030101"
      fDate = "20250101"
      Call Initialize_AsBank("bank", startDate, fDate)
               
      ' Մուտք համակարգ ARMSOFT օգտագործողով
      Call Create_Connection()
      Login("ARMSOFT")
      
      ' Պարամետրերի արժեքների ճշգրտում   
      paramName = "BMUSEDB"
      paramValue = "1"
      Call  SetParameter(paramName, paramValue)
      
      ' Կարգավորումների ներմուծում
      confPath = "X:\Testing\Order confirm phases\NoVerify.txt"
      confInput = Input_Config(confPath)
      If Not confInput Then
          Log.Error("Կարգավորումները չեն ներմուծվել")
         Exit Sub
      End If
      
      ' Մուտք Հաճախորդի սպասարկում և դրամարկղ(Ընդլայնված)
      Call ChangeWorkspace(c_CustomerService)
      
      ' Մուտք աշխատանքային փաստաթղթեր թղթապանակ
      workEnvName = "|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      workEnv = "Աշխատանքային փաստաթղթեր "
      wStatus = False
      stRekName = "PERN"
      endRekName = "PERK"
      wDate = "300717"
      status = AccessFolder(workEnvName, workEnv, stRekName, wDate, endRekName, wDate, wStatus, isnRekName, fISN)
      If Not status Then
             Log.Error("Աշխատանքային փաստաթղթեր թղթապանակը չի բացվել")
             Exit Sub
      End If

      ' Վճարման հանձնարարագրի լրացում
      ordType = "INB"
      dbDropDown = False
      accDB = "77700/000002900"
      payer = "Ø»¹áõ½³ ¶áñ·áÝ³"      
      receiver = "ä»ñë¨ë"
      eReceiver = "Perseus"
      summa = "4896.00"
      wAim = "ì³ñë³íÇñ³Ï³Ý Í³é³ÛáõÃÛáõÝÝ»ñ"
      wCur = "000"
      Call PaymOrdToBeSentFill(ordType, fISN, wAcsBranch, wAcsDepart, wDate, docNum, cliCode, accDB, payer, ePayer, taxCods,_
                                                          jurState, dbDropDown, coaNum, balAcc, accMask, accCur, accType, cliName, cCode, accNote, accNote2,_
                                                          accNote3, acsBranch, acsDepart, acsType, pCardNum, socCard, accCR, receiver, eReceiver, summa, wCur,_
                                                          wAim, jurStatR, bankCr, authorPerson, addInfo, wAddress, authPerson, rInfo)
      Log.Message("Փաստաթղթի ISN` " & fISN)
      Log.Message("Փաստաթղթի համար՝  " & docNum)
    
      BuiltIn.Delay(3000)
      ' Կատարել բոլոր գործողությունները
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Խմբագրել Վճարման հանձնարարագրի պայմանագիրն
      Call wMainForm.PopupMenu.Click(c_ToEdit)
      If Not wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
            Log.Error("Վճարման հանձնարարագրի պայմանագիրը չի բացվել")
            Exit Sub
      End If
      
      wKassa = "012"
      ' Դրամարկղ դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "KASSA", wKassa)
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")  
      
     ' SQL ստուգում HI աղյուսակում
     queryString = " SELECT fSUM FROM HI WHERE fBASE= " & fISN & _
                              " AND fTYPE = '11' AND fCUR = '000'   AND fCURSUM = '4896.00' AND fOP = 'TRF' " & _
                              " AND fDBCR = 'C' AND fSUID = '77' "
      sqlValue = 4896.00
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 

      queryString = " SELECT fSUM FROM HI WHERE fBASE= " & fISN & _
                               " AND fTYPE = '11' AND fCUR = '000'   AND fCURSUM = '4896.00' AND fOP = 'TRF' " & _
                               " AND fDBCR = 'D' AND fSUID = '77' "
      sqlValue = 4896.00
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 
              
      ' Վճարման հանձնարարագիրն ուղարկել դրամակրկղ 
      sendTo = "1"
      Call Online_PaySys_Send_To_Verify(sendTo)
      
      ' Մուտք գործել TELLER2 օգտագործողով 
      Login("TELLER2")
      Call ChangeWorkspace(c_Cassa)
      
      ' Մուտք Փաստաթղթեր դրամարկղում թղթապանակ
      workEnvName = "|¸ñ³Ù³ñÏÕ|ö³ëï³ÃÕÃ»ñ ¹ñ³Ù³ñÏÕáõÙ"
      workEnv = "Փաստաթղթեր դրամարկղում "
      status = AccessFolder(workEnvName, workEnv, stRekName, wDate, endRekName, wDate, wStatus, isnRekName, fISN)
      If Not status Then
             Log.Error("Փաստաթղթեր դրամարկղում թղթապանակը չի բացվել")
             Exit Sub
      End If
      
      ' Ներբանկային վճարման հանձնարարագրի վավերացում
      colN = 3
      action = c_ToConfirm
      doNum = 1
      doActio = "Ð³ëï³ï»É"
      status = ConfirmContractDoc(colN, docNum, action, doNum, doActio)
      If Not status Then
          Log.Error = "Ներբանկային վճարման հանձնարարագիրն առկա չէ Տարանցիկ թղթապանակում "
          Exit Sub
      End If
         
      ' Փակել փաստաթղթեր դրամարկղում թղթապանակը
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel").Close
      
      ' Մուտք գործել ARMSOFT օգտագործողով 
      Login("ARMSOFT")
      
      ' Մուտք արտաքին փոխանցումների ԱՇՏ
      Call ChangeWorkspace(c_ExternalTransfers)
      
      ' Մուտք Տարանցիկ թղթապանակ
      workEnvName = "|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|êï³óí³Í Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|î³ñ³ÝóÇÏ"
      workEnv = "Տարանցիկ "
      status = AccessFolder(workEnvName, workEnv, stRekName, wDate, endRekName, wDate, wStatus, isnRekName, fISN)
      If Not status Then
             Log.Error("Տարանցիկ թղթապանակը չի բացվել")
             Exit Sub
      End If
      
      ' Ներբանկային վճարման հանձնարարագրի առկայության ստուգում
      colN = 1
      status = CheckContractDoc(colN, docNum)
      If Not status Then
          Log.Error = "Ներբանկային վճարման հանձնարարագիրն առկա չէ Տարանցիկ թղթապանակում "
          Exit Sub
      End If
      
     ' SQL ստուգում HI աղյուսակում
     queryString = " SELECT fSUM FROM HI WHERE fBASE= " & fISN & _
                              " AND fTYPE = '01' AND fCUR = '000'   AND fCURSUM = '4896.00' AND fOP = 'TRF' " & _
                              " AND fDBCR = 'C' AND fSUID = '77' AND fBASEBRANCH = '00' AND fBASEDEPART = '1' "
      sqlValue = 4896.00
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 

      queryString = " SELECT fSUM FROM HI WHERE fBASE= " & fISN & _
                               " AND fTYPE = '01' AND fCUR = '000'   AND fCURSUM = '4896.00' AND fOP = 'TRF' " & _
                               " AND fDBCR = 'D' AND fSUID = '77' AND fBASEBRANCH = '00' AND fBASEDEPART = '1' "
      sqlValue = 4896.00
      colNum = 0
      sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
      If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
      End If 
              
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel").Close
      
      ' Փակել ՀԾ-Բանկ ծրագիրը
      Call Close_AsBank()
End Sub