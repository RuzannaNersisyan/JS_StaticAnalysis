'USEUNIT Library_Common 
'USEUNIT RemoteService_Library 
'USEUNIT Library_CheckDB 
'USEUNIT BankMail_Library 
'USEUNIT Payment_Order_ConfirmPhases_Library 
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Clients_Library
'USEUNIT Subsystems_Special_Library

'Test Case 165078

Sub RemProc_AgrPay_New()
      BuiltIn.Delay(20000)

      Dim paramName, paramValue, queryString
      Dim yesterday, docNum, rowID
      Dim todayD, todayDMY, cliCode, agrISN, amount, curISO, aim, partnerId, transId, acc, SQL
      Dim clCount, wState, direction, dirName, wStatus
      Dim system, cliMask, msgType, intCalc, rowCount, delayTime
      Dim cap, ext, rep, per, close
      Dim startDate, fDate
     
      startDate = "20030101"
      fDate = "20250101"
      Call Initialize_AsBank("bank", startDate, fDate)
               
      ' Մուտք համակարգ ARMSOFT օգտագործողով
      Call Create_Connection()
      Login("ARMSOFT")
      
      ' Պարամետրերի արժեքների ճշգրտում   
      paramName = "CBDATEMAXDIFF "
      paramValue = "0"
      Call  SetParameter(paramName, paramValue)
      
      paramName = "IBCBPROCINTERVAL  "
      paramValue = "20"
      Call  SetParameter(paramName, paramValue)
      
      ' Մուտք Վարկեր տեղաբաշխված ԱՇՏ
      Call ChangeWorkspace(c_Loans)

      ' Բացել Պայմանագրեր/ Վարկեր տեղաբաշխված թղթապանակը      
      docNum = "V-002537"
      folderDirect = "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ"
      folderName = "Պայմանագրեր/ Վարկեր տեղաբաշխված"
      rekvName ="NUM"
      Call OpenFolder(folderDirect, folderName, rekvName, docNum)
      
      ' Տոկոսների հաշվարկ գործողության կատարում
      intCalc = 1
      yesterday = aqConvert.DateTimeToFormatStr(aqDateTime.Now()-1, "%d%m%y")
      Log.Message(yesterday)
      Call InterestGroupCalculation (yesterday, yesterday, intCalc)
 
      todayD = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d")
      todayDMY = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
      cliCode =  "00000004"
      agrISN = 645888478         
      amount = "100.00"
      curISO = "AMD"
      aim = "Varki marum"
      partnerId = "16600"
      transId = "2055207886"
      acc = "000007800"
      
      ' Այսօրվա տվյալների ջնջում
       queryString = "Delete from  IB_AGREEMENT_PAYMENT where FORMAT (fDATE, 'dd/MM/yy') = '" & todayDMY & "' "  
       Call Execute_SLQ_Query(queryString)
         
      queryString = " Insert into IB_AGREEMENT_PAYMENT ( " _
                                & "fSYSTEM, fDATE, fSTATE, fCLIENT, " _
                                & "fPASSPORT, fAGRISN, fTYPE, fPAYDATE, " _
                                & "fCURISO, fAMOUNT, fPARTNERID, " _
                                & "fTRANSACTIONID, fACCOUNT,fISN, " _
                                & "fOP,fCOMMENT) " _
                                & " values (3               " _
                                & "  , '" & Trim(todayD) & "'      " _     
                                & "  , 8                    " _
                                & "  , '" & cliCode & "'    " _
                                & "  , ''                   " _
                                & "  , " & agrISN             _
                                & "  , 0                    " _  
                                & "  , '" & Trim(todayD) & "'      " _ 
                                & "  , '" & curISO & "'     " _   
                                & "  , '" & amount & "'     " _ 
                                & "  , '" & partnerId & "'  " _
                                & "  , '" & transId & "'    " _
                                & "  , '" & acc & "'        " _ 
                                & "  , -1                   " _
                                & "  , 1                    " _ 
                                & "  , '" & aim & "'        )" 
                                
      ' Հաղորդագրության ներմուծում IB_AGREEMENT_PAYMENT աղյուսակում
      Call Execute_SLQ_Query(queryString)
      
      queryString = " Select fROWID  from IB_AGREEMENT_PAYMENT  where fDATE > =  ' " & Trim(todayD) & " ' "
      rowID = Get_Query_Result(queryString)
      Log.Message(rowID)
      
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel").Close
      
      ' Մուտք հեռահար համակարգեր ԱՇՏ
      Call ChangeWorkspace(c_RemoteSyss)
      
      ' Պայմանագրի առկայության ստուգումը մշակման ենթակա մուտքային հաղորդագրություններ (Ընդհանուր) թղթապանակում
      system = "3"
      cliMask = "00000004"
      msgType = "AgrPay"
      wState = "êïáñ³·ñáõÃÛáõÝÝ»ñÁ ×Çßï »Ý"
      direction = "|Ð»é³Ñ³ñ Ñ³Ù³Ï³ñ·»ñ|Øß³ÏÙ³Ý »ÝÃ³Ï³ Ùáõïù³ÛÇÝ Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ(ÀÝ¹Ñ³Ýáõñ)"
      dirName = "Մշակման ենթակա մուտքային հաղորդագրություններ"
      wStatus = CheckContractRemoteSystems(direction, todayDMY, system, cliMask, msgType, amount, dirName, wState)
      If Not wStatus Then
            Log.Error("Սխալ՝ Մշակման ենթակա մուտքային հաղորդագրություններ թղթապանակ մուտք գործելիս")
            Exit Sub
      End If
      
      ' Փակել թղթապանակը
      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel").Close
      
      ' Հաղորդագրությունների ավտոմատ մշակում
      delayTime = 8000
      Call AutoMessageProcessing(clCount, delayTime)
      
      ' Տվյալների ստուգում IB_AGREEMENT_PAYMENT աղյուսակում
      queryString = " Select COUNT(*)  from IB_AGREEMENT_PAYMENT  where fDATE > =  '" & Trim(todayD) & "' and fSTATE = 9 and fROWID = " & rowID
      rowCount = Get_Query_Result(queryString)
      Log.Message(rowCount)
      If rowCount <> 1 Then
          Log.Error("IB_AGREEMENT_PAYMENT աղյուսակում միայն մեկ տող պետք է գտնվի")
          Exit Sub
      End If
      
      Call Close_AsBank
End Sub