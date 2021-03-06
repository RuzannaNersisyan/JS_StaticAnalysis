'USEUNIT Library_Common 
'USEUNIT RemoteService_Library 
'USEUNIT Library_CheckDB
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT Payment_Order_ConfirmPhases_Library 
'USEUNIT BankMail_Library

'Test Case ID 165383

Sub RemProc_IBCashReq_New_Test()

      Dim payerAcc, amount, curISO, cur, aim, branch, reciver, recPassport, msgType
      Dim docNum, queryStr, queryStrin, queryString, fISN, frmPttel
      Dim paramName, paramValue, todayD, todayDMY
      Dim direction, system, cliCode, dirName, wState, delayTime
      Dim action, doNum, doActio, rowCount, status, clCount
      Dim directFolder, folderName, wUser, wDocType
      Dim startDate, fDate
      
      startDate = "20030101"
      fDate = "20250101"
      Call Initialize_AsBank("bank", startDate, fDate)
               
      ' Մուտք համակարգ ARMSOFT օգտագործողով
      Call Create_Connection()
      Login("ARMSOFT")
      
      ' Պարամետրերի արժեքների ճշգրտում   
      paramName = "CBDATEMAXDIFF"
      paramValue = "0"
      Call  SetParameter(paramName, paramValue)
      
      paramName = "IBCBPROCINTERVAL"
      paramValue = "20"
      Call  SetParameter(paramName, paramValue)
    
      todayD = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d")
      todayDMY = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
      cliCode =  "00000680"
      payerAcc = "7770000068020100"          
      amount = "300.00"
      curISO = "AMD"
      cur = "000"
      aim = "Ognutyun varchapetin"
  		branch = "00" 
  		reciver = "Karen Karapetyan" 
  		recPassport = "AA00008155"
      msgType = "IBAppCsh"
      
      ' Ձևավորում ենք docNum-ը պատահական գեներացված թվի դիմացից ավելացնելով 0-ներ, այնպես որ լինի 6 նիշ
      Call Randomize()
      docNum = right(String(6, "0") + RTrim(Int(1000 * Rnd)), 6) 
      Log.Message("Փաստաթղթի համար՝  " & docNum)
      
      ' Տվյալ օրով տվյալների ջնջում
      queryStr = "Delete from  CB_MESSAGES where FORMAT (fDATE, 'dd/MM/yy') = '" & Trim(todayDMY) & "' "  
      Call Execute_SLQ_Query(queryStr)
      BuiltIn.Delay(2000)  
        
      queryStrin =  " Insert into CB_MESSAGES (" _
                              & "fSYSTEM, fSTATE, fCLIENT, fMSGTYPE, " _
                              & "fBODY,fSIGN1,fSIGN2) " _
                              & " values (20            " _ 
                              & "  , 8                   " _
                              & "  , '" & cliCode & "'  " _
                              & "  , '" & msgType & "'  " _
                              & "  , char(13)+char(10)" _
                              & "      + 'DOCNUM:" & Trim(docNum) & "'              + char(13)+char(10) " _    
                              & "      + 'PAYDATE:" & Trim(todayD) & "'              + char(13)+char(10) " _
                              & "      + 'PAYERACC:" & payerAcc & "'          + char(13)+char(10) " _
                              & "      + 'AMOUNT:" & amount & "'              + char(13)+char(10) " _
                              & "      + 'CURR:" & curISO & "'                + char(13)+char(10) " _ 
                              & "      + 'AIM:" & aim & "'                    + char(13)+char(10) " _ 
                              & "      + 'CSHDATE:" & Trim(todayD) & "'              + char(13)+char(10) " _
                              & "      + 'ACSBRANCH:" & branch & "'           + char(13)+char(10) " _ 
                              & "      + 'RECEIVER:" & reciver & "'           + char(13)+char(10) " _ 
                              & "      + 'RECPASSPORT:" & recPassport & "'    + char(13)+char(10) " _                              
                              & " , Cast('' AS VARBINARY(MAX))" _
                              & " , Cast('' AS VARBINARY(MAX)))" 
                              
      Call  Execute_SLQ_Query(queryStrin)
      
      ' Մուտք հեռահար համակարգեր ԱՇՏ
      Call ChangeWorkspace(c_RemoteSyss)

      ' Պայմանագրի առկայության ստուգումը մշակման ենթակա մուտքային հաղորդագրություններ (Ընդհանուր) թղթապանակում
      msgType = ""
      wState = "êïáñ³·ñáõÃÛáõÝÝ»ñÁ ×Çßï »Ý"
      direction = "|Ð»é³Ñ³ñ Ñ³Ù³Ï³ñ·»ñ|Øß³ÏÙ³Ý »ÝÃ³Ï³ Ùáõïù³ÛÇÝ Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ(ÀÝ¹Ñ³Ýáõñ)"
      dirName = "Մշակման ենթակա մուտքային հաղորդագրություններ (Ընդհանուր)"
      status = CheckContractRemoteSystems(direction, todayDMY, system, cliCode, msgType, amount, dirName, wState)
      If Not status Then
            Log.Error("Սխալ` Մշակման ենթակա մուտքային հաղորդագրություններ թղթապանակ մուտք գործելիս")
            Exit Sub
      End If
      
      ' Փակել թղթապանակը
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel").Close
      
      ' Հաղորդագրությունների ավտոմատ մշակում
      Call AutoMessageProcessing(clCount, delayTime)
      
      ' ISN- ի ստացում
      queryString = " Select fISN  from CB_MESSAGES where fDATE > '" & Trim(todayD) & "' and substring(fBODY,10,6) = '" & docNum & "'" 
      fISN = Get_Query_Result(queryString)
      Log.Message("Փաստաթղթի ISN` " & fISN)
      
      Call ChangeWorkspace(c_Admin40)
      ' Մուտք Աշխատանքային փաստաթղթեր թղթապանակ
      wUser = "77"
      directFolder = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      folderName = "Աշխատանքային փաստաթղթեր"
      status =  EnterFolder(directFolder, folderName, todayDMY, todayDMY, cur, wUser, wDocType)
      If Not status Then
          Log.Error("Սխալ` աշխատանքային փաստաթղթեր թղթապանակ մուտք գործելիս")
          Exit Sub
      End If
      
      status = SearchCashWithdrawalReqByISN(fISN)
      If Not status Then
          Log.Error("Փաստաթուղթը չի գտնվել աշխատանքային փաստաթղթեր թղթապանակում ")
          Exit Sub
      End If
      
      ' Հաստատել Փաստաթուղթը
      action = c_ToVerify
      doNum = 5
      doActio = "²Ûá"
      Call ActionWithDoc(action, doNum, doActio)
      
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel").Close
      
      ' Տվյալների ստուգում CB_MESSAGES աղյուսակում
      queryString = "SELECT COUNT(*) FROM CB_MESSAGES where fSTATE = '9'  AND fISN = " & fISN
      BuiltIn.Delay(1000)
      rowCount = Get_Query_Result(queryString)
      Log.Message("CB_MESSAGES աղյուսակում տողերի քանակ՝  " & rowCount)
      
      If rowCount <> 1 Then
          Log.Error("CB_MESSAGES աղյուսակում SQL հարցումով միայն մեկ տող պետք է գտնվի")
          Exit Sub
      End If
      
      ' Մուտք Հաճախորդ-Բանկ համակարգ v2.0
      Call ChangeWorkspace(c_ClientBankSys)
      ' Մուտք նոր ստեղծման կանխիկացման հայտեր թղթապանակ
      Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹-´³ÝÏ Ñ³Ù³Ï³ñ· v2.0|Üáñ ëï»ÕÍí³Í Ï³ÝËÇÏ³óÙ³Ý Ñ³Ûï»ñ")
      If Not p1.WaitVBObject("frmAsUstPar", 3000).Exists Then
            Log.Error("Նոր ստեղծման կանխիկացման հայտեր դիալոգը չի բացվել")
            Exit Sub
      End If

      payerAcc = "00068020100"    
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SDATE", todayDMY)
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EDATE", todayDMY)
      ' Արժույթ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CLICODE", cliCode)
      ' Կատարողներ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCCODE", payerAcc)
      ' Փաստաթղթի տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CUR", cur)
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
      If  Not wMDIClient.WaitVBObject("frmPttel", 3000).Exists Then
            Log.Message("Նոր ստեղծման կանխիկացման հայտեր թղթապանակը բացվել է")
            Exit Sub
      End If
      
      status = SearchCashWithdrawalReqByISN(fISN)
      If Not status Then
          Log.Error("Փաստաթուղթը չի գտնվել աշխատանքային փաստաթղթեր թղթապանակում ")
          Exit Sub
      End If

      ' Փաստաթղթի համար կատարել Մշակել(Հաճ.-ը չի ներկայացել) գործողությունը
      action = c_DevCustomNotPresent
      doNum = 5
      doActio = "²Ûá"
      Call ActionWithDoc(action, doNum, doActio)
      
      ' Տվյալների ստուգում CB_MESSAGES աղյուսակում
      queryString = "SELECT COUNT(*) FROM CB_MESSAGES where fSTATE = '9'  AND fISN = " & fISN
      BuiltIn.Delay(1000)
      rowCount = Get_Query_Result(queryString)
      Log.Message("CB_MESSAGES աղյուսակում տողերի քանակ՝  " & rowCount)
      If rowCount <> 1 Then
          Log.Error("CB_MESSAGES աղյուսակում SQL հարցումով միայն մեկ տող պետք է գտնվի")
          Exit Sub
      End If
      
      ' Փակել ՀԾ-Բանկ ծրագիրը
      Call Close_AsBank()
End Sub 