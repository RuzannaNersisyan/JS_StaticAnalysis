Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT CashInput_Confirmphases_Library
'USEUNIT CashOutput_Confirmpases_Library
'USEUNIT DAHK_Library_Filter
'USEUNIT Library_Contracts
'USEUNIT BankMail_Library
'USEUNIT Clients_Library
'USEUNIT Library_Colour
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Payment_Except_Library
'USEUNIT Library_CheckDB
'USEUNIT Main_Accountant_Filter_Library
      
'Test Case ID 188844

 ' Խմբային Կանխիկ ելք փաստաթղթի ստուգում (Առևտրային կազմակերպություն)
Sub Group_Cash_Out_Commercial_Organization_Test()

      Dim newAcc, fDATE, sDATE, groupCashOutput, workingDocuments, addIntoCassa
      Dim folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
              oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
              acsBranch, acsDepart, acsType, selectView, exportExcel 
      Dim inOrOut, inISN, docNumIn, wDate, wKassa, wSumma, wAim, accCr, accDb, jurStat, cliCode, wPayer, payerLName
      Dim todayDate, colN, action, doNum, doActio, wAcc1, wAcc2, wAcc3, workingDocs
      Dim editGrCashOutput, wAcc1Isn, wAcc2Isn, wAcc3Isn, todayDateSQL, todayDateSQL2, verifyDocuments
      Dim savePath, fName, fileName1, fileName2, param, fOBJECT, queryString, windName
      Dim wUser, docType, wName, passNum, paySysIn, paySysOut, docISN, i, docGrid, ExpMess1, ExpMess2
      Dim db_ACCOUNTS, fBODY, dbFOLDERS(3), dbPAYMENTS(1), arr(4), dbHI(9)
      
      fDATE = "20250101"
      sDATE = "20030101"
      Call Initialize_AsBank("bank", sDATE, fDATE)
      Call Create_Connection()
      Call SetParameter("CHECKCHRGINCACC ", "1")
      todayDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")

      ' Մուտք գործել համակարգ ARMSOFT  օգտագործողով 
      Login("ARMSOFT")
      
      ' Մուտք Գլխավոր հաշվապահի ԱՇՏ
      Call ChangeWorkspace(c_ChiefAcc)
      
      ' Մուտք հաշիվներ թղթապանակ, հաշիվներ դիալոգի լրացում
      folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|Ð³ßÇíÝ»ñ"
      accType = "10"
      accCur = "000"
      accChartNum = "1"
      selectView = "ACCS"
      exportExcel = "0"
      Call OpenAccauntsFolder(folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
                                                     oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
                                                     acsBranch, acsDepart, acsType, selectView, exportExcel )
                                                     
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Հաշիվներ թղթապանակը բացվել է թե ոչ
      If Not WaitForPttel("frmPttel")  Then
             Log.Error("Հաշիվներ թղթապանակը չի բացվել")
      End If
      
      Log.Message("Ստեղծել հաշիվ(1)")
      Set newAcc = New_Account()
      With newAcc         
        .BalanceAccount = "1000000"
        .AccountHolder = "00034850"
        .EnglishName = "SPY111"
        .RemainderType = "1"
        .Curr = "000"
        .AccountType = "10"
        .OpenDate = todayDate
        .AccessType = "10"
        .CashAccounting = 0
      End With
      
      Call Create_Account(newAcc)
      wAcc1 = newAcc.Account
      wAcc1Isn= newAcc.Isn
      Log.Message("Առաջին հաշիվը՝ " & wAcc1 )
      Log.Message("Առաջին հաշվի ISN՝ " & wAcc1Isn )
      todayDateSQL = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y-%m-%d")
      todayDateSQL2 = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d")
      Log.Message("Տվյալների ստուգում բազայում առաջին հաշիվը ստեղծելուց հետո")
      'ACCOUNTS
      Set db_ACCOUNTS = New_DB_ACCOUNTS()
      With db_ACCOUNTS
            .fISN = wAcc1Isn
            .fCODE = wAcc1
            .fCAPTION = "êäÀ111"
            .fECAPTION = "SPY111"
            .fCUR = "000"
            .fDC = "1"
            .fBALACC = "1000000 "
            .fACCTYPE = "10"
            .fDATEOPEN = todayDateSQL
            .fDATECLOSE = NULL
            .fLLIMIT = "0.00"
            .fULIMIT = "999999999999.99"
            .fACCBRANCH = "00"
            .fACCDEPART = "1"
            .fACCACSTYPE = "10"
      End With
      Call CheckQueryRowCount("ACCOUNTS", "fISN", wAcc1Isn, 1)
      Call Check_DB_ACCOUNTS(db_ACCOUNTS,1)
      
      'DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",wAcc1Isn,2)
      Call CheckDB_DOCLOG(wAcc1Isn,"77","N","1"," ",1)
      Call CheckDB_DOCLOG(wAcc1Isn,"77","C","2"," ",1)
      
      'DOCS
        	fBODY = "" & vbCRLF _
        & "CLIMAINACC:0"& vbCRLF _
        & "BALACC:1000000"& vbCRLF _
        & "CLICOD:00034850"& vbCRLF _
        & "NAME:êäÀ111"& vbCRLF _
        & "ENAME:SPY111"& vbCRLF _
        & "DK:1"& vbCRLF _
        & "CODVAL:000"& vbCRLF _
        & "ACCTYPE:10"& vbCRLF _
        & "DATOTK:"& todayDateSQL2 & vbCRLF _
        & "CODE:"& wAcc1 & vbCRLF _
        & "ACSBRANCH:00"& vbCRLF _
        & "ACSDEPART:1"& vbCRLF _
        & "ACSTYPE:10"& vbCRLF _
        & "ULIMIT:999999999999.99"& vbCRLF _
        & "CASHAC:0"& vbCRLF _
        & "BALACC2:999999"& vbCRLF _
        & "BALACC3:999999"& vbCRLF _
        & "FROZEN:0"& vbCRLF _
        & ""
        fBODY = Replace(fBODY, "  ", "%")
      Call CheckDB_DOCS(wAcc1Isn,"Acc","2",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",wAcc1Isn,1)
      
      'FOLDERS
      Set dbFOLDERS(0) = New_DB_FOLDERS()
      With dbFOLDERS(0)
          .fFOLDERID = "C.977053288"
          .fNAME = "Acc"
          .fKEY = wAcc1Isn
          .fISN = wAcc1Isn
          .fSTATUS = "1"
          .fCOM = "  Ð³ßÇí"
          .fSPEC = ""& wAcc1 &"  ²ñÅ.- 000  îÇå- 10  Ð/Ð³ßÇí- 1000000   ²Ýí³ÝáõÙ-êäÀ111"
          .fECOM = "  Account"
      End With

      Set dbFOLDERS(1) = New_DB_FOLDERS()
      With dbFOLDERS(1)
          .fFOLDERID = "KASACC"
          .fNAME = "Acc"
          .fKEY = wAcc1 
          .fISN = wAcc1Isn
          .fSTATUS = "0"
          .fCOM = "êäÀ111 (000)"
          .fSPEC = "000110  "
          .fECOM = "SPY111 (000)"
          .fDCBRANCH = "00"
          .fDCDEPART = "1"
      End With

	     Call CheckQueryRowCount("FOLDERS","fISN",wAcc1Isn,2)
      Call CheckDB_FOLDERS(dbFOLDERS(0),1)
      Call CheckDB_FOLDERS(dbFOLDERS(1),1)

      ' Ստուգում որ հաշիվը ստեղծվել է
      colN = 1
      If Not CheckContractDoc(colN, wAcc1) Then
            Log.Error("Հաշիվը փաստաթուղթը չի ստեղծվել")
      End If
      
      ' Փակել Հաշիվներ թղթապանակը 
       Call Close_Window(wMDIClient, "frmPttel")
      
      ' Մուտք ադմինիստրատորի ԱՇՏ4.0
      Call ChangeWorkspace(c_Admin40)
      Log.Message("Ավելացնել հաշիվը 1-ը դրամարկղում")
      Set addIntoCassa = New_Add_Acc_Into_Cassa(4, 1)
      With addIntoCassa
              .folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|î»Õ»Ï³ïáõÝ»ñ|¸ñ³Ù³ñÏÕ»ñ"
              .wCur(0) = "000"
              .accDbt(0) = wAcc1
              .wPreferred(0) = 0
              .arr(0) = "¸ñ³Ù³ñÏÕ»ñ"
              .arr(1) = "00  00"
              .arr(2) = "000 ´áÉáñ ¹ñ³Ù³ñÏÕ»ñ"
              .arr(3) = "001 ÀÝÑ³Ýáõñ ¹ñ³Ù³ñÏÕ"
      End With
      
      Call Fill_Add_Acc_Into_Cassa(addIntoCassa)
      ' Փակել Դրամարկղեր թղթապանակը 
      Call Close_Window(wMDIClient, "frmEditTree")

      ' Մուտք Գլխավոր հաշվապահի ԱՇՏ
      Call ChangeWorkspace(c_ChiefAcc)
      
      ' Մուտք հաշիվներ թղթապանակ, հաշիվներ դիալոգի լրացում
      accChartNum = "1"
      Call OpenAccauntsFolder(folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
                                                     oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
                                                     acsBranch, acsDepart, acsType, selectView, exportExcel )
                                                     
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Հաշիվներ թղթապանակը բացվել է թե ոչ
      If Not WaitForPttel("frmPttel")  Then
             Log.Error("Հաշիվներ թղթապանակը չի բացվել")
      End If
      
      ' Ստուգում որ հաշվի առկայությունը
      colN = 1
      If Not CheckContractDoc(colN, wAcc1) Then
            Log.Error( wAcc1 & " Հաշիվն առկա չէ Հաշիվներ թղթապանակում")
      End If

      Log.Message("Կանխիկ մուտք փաստաթղթի ստեղծում")
      inOrOut = c_CashIn
      wSumma = "1000000.00"
      wAim = "test"
      wPayer = "êäÀ"
      payerLName = "¶ñáõå"
      cliCode = "00034850"
      accCr = "000001100"
      jurStat = "11"
      Call CashInOut(inOrOut, inISN, docNumIn, wDate, wKassa, wSumma, wAim, accCr, accDb, jurStat, cliCode, wPayer, payerLName)
      Log.Message("Կանխիկ մուտք փաստաթղթի ISN` " & inISN)
      Log.Message("Կանխիկ մուտք փաստաթղթի համար " & docNumIn)
      ' Փակել Հաշիվներ թղթապանակը 
      Call Close_Window(wMDIClient, "frmPttel")
      
      ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",inISN,2)
      Call CheckDB_DOCLOG(inISN,"77","N","1"," ",1)
      Call CheckDB_DOCLOG(inISN,"77","C","2"," ",1)
      
      ' DOCS
     	fBODY = "" & vbCRLF _
        			& "ACSBRANCH:00"& vbCRLF _
        			& "ACSDEPART:1"& vbCRLF _
        			& "BLREP:0"& vbCRLF _
        			& "OPERTYPE:MSC"& vbCRLF _
        			& "TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
        			& "USERID:  77"& vbCRLF _
        			& "DOCNUM:"& docNumIn & vbCRLF _
        			& "DATE:"&todayDateSQL2& vbCRLF _
        			& "KASSA:001"& vbCRLF _
        			& "ACCDB:"&wAcc1& vbCRLF _
        			& "CUR:000"& vbCRLF _
        			& "ACCCR:000001100"& vbCRLF _
        			& "SUMMA:1000000"& vbCRLF _
        			& "KASSIMV:022"& vbCRLF _
        			& "AIM:test"& vbCRLF _
        			& "CLICODE:00034850"& vbCRLF _
        			& "PAYER:êäÀ"& vbCRLF _
        			& "PAYERLASTNAME:¶ñáõå"& vbCRLF _
        			& "ACSBRANCHINC:00"& vbCRLF _
        			& "ACSDEPARTINC:1"& vbCRLF _
        			& "CHRGACC:000001100"& vbCRLF _
        			& "TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
        			& "CHRGCUR:000"& vbCRLF _
        			& "CHRGCBCRS:1/1"& vbCRLF _
        			& "VOLORT:9X"& vbCRLF _
        			& "NONREZ:1"& vbCRLF _
        			& "JURSTAT:11"& vbCRLF _
        			& "USEOVERLIMIT:0"& vbCRLF _
        			& "NOTSENDABLE:0"& vbCRLF _
        			& "" 
      fBODY = Replace(fBODY, "  ", "%")
      Call CheckDB_DOCS(inISN,"KasPrOrd","2",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",inISN,1)
       
      ' FOLDERS
      With dbFOLDERS(0)
          .fFOLDERID = "C.977053288"
          .fNAME = "KasPrOrd"
          .fKEY = inISN
          .fISN = inISN
          .fSTATUS = "5"
          .fCOM = "Î³ÝËÇÏ Ùáõïù"
          .fSPEC = "²Ùë³ÃÇí- "&todayDate&" N- "&docNumIn&" ¶áõÙ³ñ-         1,000,000.00 ²ñÅ.- 000 [Üáñ]"
          .fECOM = "Cash Deposit Advice"
      End With
       
      With dbFOLDERS(1)
          .fFOLDERID = "Oper."&todayDateSQL2
          .fNAME = "KasPrOrd"
          .fKEY = inISN
          .fISN = inISN
          .fSTATUS = "5"
          .fCOM = "Î³ÝËÇÏ Ùáõïù"
          .fSPEC = docNumIn&"77700"&wAcc1&"77700000001100        1000000.00000Üáñ                                                   77êäÀ ¶ñáõå                                                                                       test"
          .fECOM = "Cash Deposit Advice"
          .fDCDEPART = "1"
          .fDCBRANCH = "00"
      End With
      
  	   Call CheckQueryRowCount("FOLDERS","fISN",inISN,2)
      Call CheckDB_FOLDERS(dbFOLDERS(0),1)
      Call CheckDB_FOLDERS(dbFOLDERS(1),1)
         
      queryString = "select fOBJECT from HI where fBASE = '"&inISN&"' and fDBCR = 'D'"
      fOBJECT = Get_Query_Result(queryString)
      
      'HI
      Call CheckQueryRowCount("HI","fBASE",inISN,2)
      Call Check_HI_CE_accounting (todayDateSQL,inISN, "11", "1630170", "1000000.00", "000", "1000000.00", "MSC", "C")   
      Call Check_HI_CE_accounting (todayDateSQL,inISN, "11", fOBJECT, "1000000.00", "000", "1000000.00", "MSC", "D") 

      Log.Message "--- Մուտք Աշխատանքային փաստաթղթեր թղթապանակ ---" ,,, DivideColor 
      Set workingDocuments = New_MainAccWorkingDocuments()
      
      With workingDocuments
            .startDate = todayDate
        				.endDate = todayDate
        				.viewType = "Oper"
        				.fill = "0"
      End With
      
      ' Աշխատանքային փաստաթղթեր ֆիլտրի բացում և տվյալների լրացում
      Call GoTo_MainAccWorkingDocuments("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|", workingDocuments)
      
      Log.Message("Կանխիկ մուտք փաստաթուղթն ուղարկել հաստատման ")
      colN = 2
      action = c_SendToVer
      doNum = 2
      doActio = "Î³ï³ñ»É"
      If Not ConfirmContractDoc(colN, docNumIn, action, doNum, doActio) Then
            Log.Error("Կանխիկ մուտք փաստաթուղթը չի ուղարկվել հաստատման")
            Exit Sub
      End If
      
      ' Փակել Աշխատանքային փաստաթղթեր թղթապանակը 
      Call Close_Window(wMDIClient, "frmPttel")
      
      'DOCS
      fBODY = "" & vbCRLF _
        			& "ACSBRANCH:00"& vbCRLF _
        			& "ACSDEPART:1"& vbCRLF _
        			& "BLREP:0"& vbCRLF _
        			& "OPERTYPE:MSC"& vbCRLF _
        			& "TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
        			& "USERID:  77"& vbCRLF _
        			& "DOCNUM:"& docNumIn & vbCRLF _
        			& "DATE:"&todayDateSQL2& vbCRLF _
        			& "KASSA:001"& vbCRLF _
        			& "ACCDB:"&wAcc1& vbCRLF _
        			& "CUR:000"& vbCRLF _
        			& "ACCCR:000001100"& vbCRLF _
        			& "SUMMA:1000000"& vbCRLF _
        			& "KASSIMV:022"& vbCRLF _
        			& "AIM:test"& vbCRLF _
        			& "CLICODE:00034850"& vbCRLF _
        			& "PAYER:êäÀ"& vbCRLF _
        			& "PAYERLASTNAME:¶ñáõå"& vbCRLF _
           & "ISTLLCREATED:1"& vbCRLF _
        			& "ACSBRANCHINC:00"& vbCRLF _
        			& "ACSDEPARTINC:1"& vbCRLF _
        			& "CHRGACC:000001100"& vbCRLF _
        			& "TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
        			& "CHRGCUR:000"& vbCRLF _
        			& "CHRGCBCRS:1/1"& vbCRLF _
        			& "VOLORT:9X"& vbCRLF _
        			& "NONREZ:1"& vbCRLF _
        			& "JURSTAT:11"& vbCRLF _
        			& "USEOVERLIMIT:0"& vbCRLF _
        			& "NOTSENDABLE:0"& vbCRLF _
        			& "" 
      Call CheckDB_DOCS(inISN,"KasPrOrd","101",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",inISN,1)

	     ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",inISN,3)
	  Call CheckDB_DOCLOG(inISN,"77","M","101","àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý",1)
          
    	 ' FOLDERS
      With dbFOLDERS(0)
          .fFOLDERID = "C.977053288"
          .fNAME = "KasPrOrd"
          .fKEY = inISN
          .fISN = inISN
          .fSTATUS = "0"
          .fCOM = "Î³ÝËÇÏ Ùáõïù"
          .fSPEC = "²Ùë³ÃÇí- "&todayDate&" N- "&docNumIn&" ¶áõÙ³ñ-         1,000,000.00 ²ñÅ.- 000 [àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý]"
          .fECOM = "Cash Deposit Advice"
      End With

      With dbFOLDERS(1)
          .fFOLDERID = "Oper."&todayDateSQL2
          .fNAME = "KasPrOrd"
          .fKEY = inISN
          .fISN = inISN
          .fSTATUS = "0"
          .fCOM = "Î³ÝËÇÏ Ùáõïù"
          .fSPEC = docNumIn&"77700"&wAcc1&"77700000001100        1000000.00000àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý                                 77êäÀ ¶ñáõå                                                       001                             test"
          .fECOM = "Cash Deposit Advice"
          .fDCDEPART = "1"
          .fDCBRANCH = "00"
      End With
          
    	 Set dbFOLDERS(2) = New_DB_FOLDERS()
      With dbFOLDERS(2)
          .fFOLDERID = "Ver."&todayDateSQL2&"001"
          .fNAME = "KasPrOrd"
          .fKEY = inISN
          .fISN = inISN
          .fSTATUS = "4"
          .fCOM = "Î³ÝËÇÏ Ùáõïù"
          .fSPEC = docNumIn&"77700"&wAcc1&"77700000001100        1000000.00000  77test                                                            êäÀ ¶ñáõå"
          .fECOM = "Cash Deposit Advice"
          .fDCDEPART = "1"
          .fDCBRANCH = "00"
      End With
          
     	Call CheckQueryRowCount("FOLDERS","fISN",inISN,3)
      Call CheckDB_FOLDERS(dbFOLDERS(0),1)
      Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    	 Call CheckDB_FOLDERS(dbFOLDERS(2),1)
      
      ' Մուտք համակարգ VERIFIER օգտագործողով
      Login("VERIFIER")
      ' Մուտք հաստատվող վճարային փաստաթղթեր թղթապանակ
      Set verifyDocuments = New_VerificationDocument()
      verifyDocuments.User = "^A[Del]"
      Call GoToVerificationDocument("|Ð³ëï³ïáÕ I ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ", verifyDocuments)

      If Not wMDIClient.VBObject("frmPttel").Exists Then
            Log.Error("Հաստատվող փաստաթղթեր թղթապանակը չի բացվել")
            Exit Sub
      End If
      
      Log.Message("Վավերացնել Կանխիկ մուտքի փաստաթուղթը")
      colN = 3
      action = c_ToConfirm
      doNum = 1
      doActio = "Ð³ëï³ï»É"
      If Not ConfirmContractDoc(colN, docNumIn, action, doNum, doActio) Then
            Log.Error("Կանխիկ մուտքի փաստաթուղթը չի վավերացվել")
            Exit Sub
      End If
        
	     ' DOCS
      fBODY = Replace(fBODY, "  ", "%")
      Call CheckDB_DOCS(inISN,"KasPrOrd","15",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",inISN,1)

   	  ' FOLDERS
      With dbFOLDERS(0)
          .fFOLDERID = "C.977053288"
          .fNAME = "KasPrOrd"
          .fKEY = inISN
          .fISN = inISN
          .fSTATUS = "4"
          .fCOM = "Î³ÝËÇÏ Ùáõïù"
          .fSPEC = "²Ùë³ÃÇí- "&todayDate&" N- "&docNumIn&" ¶áõÙ³ñ-         1,000,000.00 ²ñÅ.- 000 [Ð³ëï³ïí³Í]"
          .fECOM = "Cash Deposit Advice"
      End With

      With dbFOLDERS(1)
          .fFOLDERID = "Oper."&todayDateSQL2
          .fNAME = "KasPrOrd"
          .fKEY = inISN
          .fISN = inISN
          .fSTATUS = "4"
          .fCOM = "Î³ÝËÇÏ Ùáõïù"
          .fSPEC = docNumIn&"77700"&wAcc1&"77700000001100        1000000.00000Ð³ëï³ïí³Í                                             77êäÀ ¶ñáõå                                                                                       test"
          .fECOM = "Cash Deposit Advice"
          .fDCDEPART = "1"
          .fDCBRANCH = "00"
      End With
        
    	 Call CheckQueryRowCount("FOLDERS","fISN",inISN,2)
      Call CheckDB_FOLDERS(dbFOLDERS(0),1)
      Call CheckDB_FOLDERS(dbFOLDERS(1),1)
       
      ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",inISN,5)
      Call CheckDB_DOCLOG(inISN,"81","W","102"," ",1)
      Call CheckDB_DOCLOG(inISN,"81","C","15"," ",1)
      
      ' Փակել  հաստատվող վճարային փաստաթղթեր թղթապանակը 
      Call Close_Window(wMDIClient, "frmPttel")

      Login("ARMSOFT")
      ' Մուտք Գլխավոր հաշվապահի ԱՇՏ
      Call ChangeWorkspace(c_ChiefAcc)
      
      Set workingDocs = New_MainAccWorkingDocuments()
      With workingDocs
            .startDate = todayDate
    			     .endDate = todayDate
      End With
   
      Call GoTo_MainAccWorkingDocuments("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|", workingDocs)
      
      Log.Message("Վավերացնել Կանխիկ մուտքի փաստաթուղթը աշխատանքային փաստաթղթեր թղթապանակից")
      colN = 2
      action = c_ToConfirm
      doNum = 1
      doActio = "Ð³ëï³ï»É"
      If Not ConfirmContractDoc(colN, docNumIn, action, doNum, doActio) Then
            Log.Error("Կանխիկ մուտքի փաստաթուղթը չի վավերացվել")
            Exit Sub
      End If
      
      ' Փակել Աշխատանքային փաստաթղթեր թղթապանակը 
      Call Close_Window(wMDIClient, "frmPttel")
      
      ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",inISN,7)
      Call CheckDB_DOCLOG(inISN,"77","W","16"," ",1)
      Call CheckDB_DOCLOG(inISN,"77","M","11","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
       
	     ' DOCS
      fBODY = Replace(fBODY, "  ", "%")
      Call CheckDB_DOCS(inISN,"KasPrOrd","11",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",inISN,1)
          
  		  ' FOLDERS
	     Call CheckQueryRowCount("FOLDERS","fISN",inISN,0)

      ' HI
      Call Check_HI_CE_accounting (todayDateSQL,inISN, "01", "1630170", "1000000.00", "000", "1000000.00", "MSC", "C")   
      Call Check_HI_CE_accounting (todayDateSQL,inISN, "01", fOBJECT, "1000000.00", "000", "1000000.00", "MSC", "D")  
      Call CheckQueryRowCount("HI","fBASE",inISN,2)

      Set dbPAYMENTS(0) = New_DB_PAYMENTS()
      With dbPAYMENTS(0)
            .fISN = inISN
            .fDOCTYPE = "KasPrOrd"
            .fDATE = todayDateSQL
            .fSTATE = "11"
            .fDOCNUM = docNumIn
            .fCLIENT = "00034850"
            .fACCDB = "77700"&wAcc1
            .fPAYER = "êäÀ ¶ñáõå"
            .fCUR = "000"
            .fSUMMA = "1000000.00"
            .fSUMMAAMD = "1000000.00"
            .fSUMMAUSD = "2500.00"
            .fCOM = "test"
            .fPASSPORT = ""
            .fCOUNTRY = "AM"
            .fACSBRANCH = "00 "
            .fACSDEPART = "1  "
      End With
      Call CheckDB_PAYMENTS(dbPAYMENTS(0),1)
      
      ' Մուտք հաշիվներ թղթապանակ, հաշիվներ դիալոգի լրացում
      Call OpenAccauntsFolder(folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
                                                     oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
                                                     acsBranch, acsDepart, acsType, selectView, exportExcel )
                                                     
      ' Սպասում է այնքան մինչև "կատարման ընթացքը" վերջանա 
      Call  WaitForExecutionProgress()
                                  
      ' Ստուգում է Հաշիվներ թղթապանակը բացվել է թե ոչ
      If Not WaitForPttel("frmPttel")  Then
             Log.Error("Հաշիվներ թղթապանակը չի բացվել")
      End If
      
      Log.Message("Ստեղծել հաշիվ(2)")
      Set newAcc = New_Account()
      With newAcc         
        .BalanceAccount = "1000000"
        .AccountHolder = "00001001"
        .EnglishName = "Overdraft"
        .RemainderType = "2"
        .Curr = "000"
        .AccountType = "10"
        .OpenDate = todayDate
        .AccessType = "10"
        .CashAccounting = 0
      End With
      
      Call Create_Account(newAcc)
      wAcc2 = newAcc.Account
      Log.Message("Երկրորդ հաշիվը՝ " & wAcc2)
      wAcc2Isn= newAcc.Isn
      Log.Message("Երկրորդ հաշվի ISN՝ " & wAcc2Isn )
      
      ' Ստուգում որ հաշիվը  ստեղծվել է
      colN = 1
      If Not CheckContractDoc(colN, wAcc2) Then
            Log.Error("Հաշիվը փաստաթուղթը չի ստեղծվել")
      End If
      ' Փակել Հաշիվներ թղթապանակը 
      Call Close_Window(wMDIClient, "frmPttel")
      
      'ACCOUNTS
      Set db_ACCOUNTS = New_DB_ACCOUNTS()
      With db_ACCOUNTS
            .fISN = wAcc2Isn
            .fCODE = wAcc2
            .fCAPTION = """Overdraft"" ûå»ñ³ïáñ 2"
            .fECAPTION = "Overdraft"
            .fCUR = "000"
            .fDC = "2"
            .fBALACC = "1000000"
            .fACCTYPE = "10"
            .fDATEOPEN = todayDateSQL
            .fDATECLOSE = NULL
            .fLLIMIT = "0.00"
            .fULIMIT = "999999999999.99"
            .fACCBRANCH = "00"
            .fACCDEPART = "1"
            .fACCACSTYPE = "10"
      End With
      Call CheckQueryRowCount("ACCOUNTS", "fISN", wAcc2Isn, 1)
      Call Check_DB_ACCOUNTS(db_ACCOUNTS,1)

      'DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",wAcc2Isn,2)
      Call CheckDB_DOCLOG(wAcc2Isn,"77","N","1"," ",1)
      Call CheckDB_DOCLOG(wAcc2Isn,"77","C","2"," ",1)
      
      'DOCS
     	fBODY = "" & vbCRLF _
            & "CLIMAINACC:0"& vbCRLF _
            & "BALACC:1000000"& vbCRLF _
            & "CLICOD:00001001"& vbCRLF _
            & "NAME:""Overdraft"" ûå»ñ³ïáñ 2"& vbCRLF _
            & "ENAME:Overdraft"& vbCRLF _
            & "DK:2"& vbCRLF _
            & "CODVAL:000"& vbCRLF _
            & "ACCTYPE:10"& vbCRLF _
            & "DATOTK:"& todayDateSQL2 & vbCRLF _
            & "CODE:"& wAcc2 & vbCRLF _
            & "ACSBRANCH:00"& vbCRLF _
            & "ACSDEPART:1"& vbCRLF _
            & "ACSTYPE:10"& vbCRLF _
            & "ULIMIT:999999999999.99"& vbCRLF _
            & "CASHAC:0"& vbCRLF _
            & "BALACC2:999999"& vbCRLF _
            & "BALACC3:999999"& vbCRLF _
            & "FROZEN:0"& vbCRLF _
            & ""
      Call CheckDB_DOCS(wAcc2Isn,"Acc","2",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",wAcc2Isn,1)
      
      'FOLDERS
    With dbFOLDERS(0)
      .fFOLDERID = "C.910355456"
      .fNAME = "Acc"
      .fKEY = wAcc2Isn
      .fISN = wAcc2Isn
      .fSTATUS = "1"
      .fCOM = "  Ð³ßÇí"
      .fSPEC = wAcc2&"  ²ñÅ.- 000  îÇå- 10  Ð/Ð³ßÇí- 1000000   ²Ýí³ÝáõÙ-""Overdraft"" ûå»ñ³ïáñ 2"
      .fECOM = "  Account"
    End With

    With dbFOLDERS(1)
      .fFOLDERID = "KASACC"
      .fNAME = "Acc"
      .fKEY = wAcc2
      .fISN = wAcc2Isn
      .fSTATUS = "0"
      .fCOM = """Overdraft"" ûå»ñ³ïáñ 2 (000)"
      .fSPEC = "000210  "
      .fECOM = "Overdraft (000)"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With

	   Call CheckQueryRowCount("FOLDERS","fISN",wAcc2Isn,2)
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
      
      ' Մուտք ադմինիստրատորի ԱՇՏ4.0
      Call ChangeWorkspace(c_Admin40)
      Log.Message("Ավելացնել հաշիվը 2-ը դրամարկղում")
      Set addIntoCassa = New_Add_Acc_Into_Cassa(4, 1)
      With addIntoCassa
              .folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|î»Õ»Ï³ïáõÝ»ñ|¸ñ³Ù³ñÏÕ»ñ"
              .wCur(0) = "000"
              .accDbt(0) = wAcc2
              .wPreferred(0) = 0
              .arr(0) = "¸ñ³Ù³ñÏÕ»ñ"
              .arr(1) = "00  00"
              .arr(2) = "000 ´áÉáñ ¹ñ³Ù³ñÏÕ»ñ"
              .arr(3) = "001 ÀÝÑ³Ýáõñ ¹ñ³Ù³ñÏÕ"
      End With
      
      Call Fill_Add_Acc_Into_Cassa(addIntoCassa)
      ' Փակել Դրամարկղեր թղթապանակը 
      Call Close_Window(wMDIClient, "frmEditTree")

      ' Մուտք Հաճախորդի սպասարկում և դրամարկղ (ընդլայնված) ԱՇՏ
      Call ChangeWorkspace(c_CustomerService)
      Log.Message("Խմբային կանխիկ ելք փաստաթղթի ստեղծում")
      Set groupCashOutput = New_GroupCashOutput(2, 2, 1, 0)
      With groupCashOutput
                .commonTab.wOffice = "00"
                .commonTab.wDepartment = "1"
                .commonTab.wDate =  todayDate 
                .commonTab.cashRegister = "001"
                .commonTab.cashRegisterAcc =  wAcc2
                .commonTab.wCurr = "000"
                .commonTab.cashierChar = "051"
                .commonTab.wBase = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
                .commonTab.wAcc(0)  = wAcc1 
                .commonTab.wSum(0) = "100,000.00"
                .commonTab.wAim(0) = "Ð³ñÏ»ñÇ Ù³ñáõÙ"
                .commonTab.nonChargPart(0) = "0.00"
                .commonTab.wAcc(1) = "000001100" 
                .commonTab.wSum(1) = "50,000.00"
                .commonTab.wAim(1) = "ì³ñÏÇ Ù³ñáõÙ"
                .commonTab.nonChargPart(1) = "0.00"
                .commonTab.reCalc = 0
                .commonTab.wPayer = "00001001"
                .commonTab.wName = "Overdraft"
                .commonTab.wSurname = "úå»ñ³ïáñ"
                .commonTab.wId = "44444333"
                .commonTab.idType = "01"
                .commonTab.idGivenBy = "55"
                .commonTab.wCitizenship = "1"
                .commonTab.wCountry = "AM"
                .commonTab.wResidence = "010010635"
                .commonTab.wCity = "ºñ¨³Ý"
                .commonTab.wApartment = "ÏÏÏÏÏÏ 54"
                .commonTab.wStreet = " µÝ. 8"
                .commonTab.wHouse = "Þ»Ýù"
                .commonTab.wEmail = "kanxikelq@xmbayin"
                .commonTab.birthDate = "01/01/1995"
                .commonTab.idGiveDate = "05/05/2005"
                .commonTab.idValidUntil = "12/12/2019"
                .chargeTab.office = "00"
                .chargeTab.department = "1"
                .chargeTab.chargeAcc = "000001101"
                .chargeTab.chargeAccForCheck = ""
                .chargeTab.chargeCurr = "001"
                .chargeTab.chargeCurrForCheck = "001"   
                .chargeTab.cbExchangeRate = "400.0000/1"
                .chargeTab.chargeType = "05"
                .chargeTab.chargeAmount = "1.25"
                .chargeTab.chargeAmoForCheck = "1.25"
                .chargeTab.chargePercent = "0.3333"
                .chargeTab.chargePerForCheck = "0.3333"
                .chargeTab.incomeAcc = "000435100"
                .chargeTab.incomeAccCurr = "000"
                .chargeTab.buyAndSell = "1"
                .chargeTab.buyAndSellForCheck = "1"
                .chargeTab.operType = "1"
                .chargeTab.operPlace = "3"
                .chargeTab.operArea = ""
                .chargeTab.operAreaForCheck = "9X"
                .chargeTab.nonResident = 1
                .chargeTab.nonResidentForCheck = 1
                .chargeTab.legalStatus = "11"
                .chargeTab.legalStatusForCheck = "11"
                .chargeTab.comment = "²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ"
                .chargeTab.commentForCheck = "²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ"
                .chargeTab.clientAgreeData = ""
                .chargeTab.notGrCash = False
                .coinTab.coin = "0.00"
                .coinTab.coinForCheck = "0.00"
                .coinTab.coinPayCurr = ""
                .coinTab.coinPayAcc = ""
                .coinTab.coinExchangeRate = "0/0"
                .coinTab.coinCBExchangeRate = "0/0"
                .coinTab.coinBuyAndSell = ""
                .coinTab.coinPayAmount = "0.00"
                .coinTab.coinPayAmountForCheck = "0.00"
                .coinTab.amountWithMainCurr = "0.00"
                .coinTab.amountCurrForCheck = "0.00"
                .coinTab.incomeOutChange = ""
                .coinTab.damagesOutChange = ""
                .coinTab.roundedAmount = "0.00"
                .coinTab.roundedAmountForCheck = "0.00"
                .attachedTab.addFiles(0) = Project.Path & "Stores\Attach file\excel.xlsx"
                .attachedTab.fileName(0) = "excel.xlsx"
                .attachedTab.addFiles(1) =  Project.Path & "Stores\Attach file\txtFile.txt"
                .attachedTab.fileName(1) = "txtFile.txt"
                .attachedTab.addLinks(0) =  Project.Path & "Stores\Attach file\Photo.jpg"
                .attachedTab.linkName(0) = "attachedLink_1"
      End With

      folderDirect = "|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Üáñ ÷³ëï³ÃÕÃ»ñ|ì×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ|ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
      Call Create_Group_Cash_Output_Next(folderDirect, groupCashOutput, "Ð³çáñ¹Á")
      Log.Message("Փաստաթղթի համարը " & groupCashOutput.commonTab.docNum)
      Log.Message("Փաստաթղթի ISN` " & groupCashOutput.fIsn)
      
      ' Փակել խմբային կանխիկ ելք փաստաթուղթի պատուհանը
      Call Close_Window(wMDIClient, "frmASDocForm")
      
      savePath = Project.Path & "Stores\Cash_Input_Output\Actual\"
      fName = "GroupCashOutCommOrgAct.txt"
      fileName1 = Project.Path & "Stores\Cash_Input_Output\Actual\GroupCashOutCommOrgAct.txt"
      fileName2 = Project.Path & "Stores\Cash_Input_Output\Expected\GroupCashOutCommOrgExp.txt"
      
      If wMDIClient.WaitVBObject("FrmSpr",3000).Exists Then
         ' Հիշել քաղվածքը
            Call SaveDoc(savePath, fName)

            param = "([0-9]{2}[/][0-9]{2}[/][0-9]{2})|([0-9]{2}[:][0-9]{2})|([0-9]{8}.........)|(N 0.....)"
            Call Compare_Files(fileName1, fileName2,param)
            
            BuiltIn.Delay(1000)
            ' Փակել քաղվածքի պատուհանը 
            Call Close_Window(wMDIClient, "FrmSpr")
      Else 
            Log.Error "Խմբային կանխիկ ելքի քաղվածքը չի բացվել"  
      End If
      
      ' DOCS
      fBODY = "" & vbCRLF _
            & "ACSBRANCH:00"& vbCRLF _
            & "ACSDEPART:1"& vbCRLF _
            & "BLREP:0"& vbCRLF _
            & "USERID:  77"& vbCRLF _
            & "DOCNUM:"& groupCashOutput.commonTab.docNum & vbCRLF _
            & "DATE:"& todayDateSQL2 & vbCRLF _
            & "KASSA:001"& vbCRLF _
            & "ACCCR:"& wAcc2 & vbCRLF _
            & "CUR:000"& vbCRLF _
            & "KASSIMV:051"& vbCRLF _
            & "BASE:ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"& vbCRLF _
            & "FRSHNOCRG:0"& vbCRLF _
            & "CLICODE:00001001"& vbCRLF _
            & "RECEIVER:Overdraft"& vbCRLF _
            & "RECEIVERLASTNAME:úå»ñ³ïáñ"& vbCRLF _
            & "PASSNUM:44444333"& vbCRLF _
            & "PASTYPE:01"& vbCRLF _
            & "PASBY:55"& vbCRLF _
            & "DATEPASS:20050505"& vbCRLF _
            & "DATEEXPIRE:20191212"& vbCRLF _
            & "DATEBIRTH:19950101"& vbCRLF _
            & "CITIZENSHIP:1"& vbCRLF _
            & "COUNTRY:AM"& vbCRLF _
            & "COMMUNITY:010010635"& vbCRLF _
            & "CITY:ºñ¨³Ý"& vbCRLF _
            & "APARTMENT:ÏÏÏÏÏÏ 54"& vbCRLF _
            & "ADDRESS: µÝ. 8"& vbCRLF _
            & "BUILDNUM:Þ»Ýù"& vbCRLF _
            & "EMAIL:kanxikelq@xmbayin"& vbCRLF _
            & "TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
            & "ACSBRANCHINC:00"& vbCRLF _
            & "ACSDEPARTINC:1"& vbCRLF _
            & "CHRGACC:000001101"& vbCRLF _
            & "TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
            & "CHRGCUR:001"& vbCRLF _
            & "CHRGCBCRS:400.0000/1"& vbCRLF _
            & "PAYSCALE:05"& vbCRLF _
            & "CHRGSUM:1.25"& vbCRLF _
            & "PRSNT:0.3333"& vbCRLF _
            & "CHRGINC:000435100"& vbCRLF _
            & "CUPUSA:1"& vbCRLF _
            & "CURTES:1"& vbCRLF _
            & "CURVAIR:3"& vbCRLF _
            & "TIME:"& groupCashOutput.chargeTab.timeForCheck & vbCRLF _
            & "VOLORT:9X"& vbCRLF _
            & "NONREZ:1"& vbCRLF _
            & "JURSTAT:11"& vbCRLF _
            & "COMM:²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ"& vbCRLF _
            & ""
      Call CheckDB_DOCS(groupCashOutput.fIsn,"KsRsOrPk","2",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",groupCashOutput.fIsn,1)

	     ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",groupCashOutput.fIsn,2)
      Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","N","1"," ",1)
      Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","C","2"," ",1)
          
    	 ' FOLDERS
      Set dbFOLDERS(0) = New_DB_FOLDERS()
      With dbFOLDERS(0)
          .fFOLDERID = "C.910355456"
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "5"
          .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
          .fSPEC = "²Ùë³ÃÇí- "& todayDate &" N- "& groupCashOutput.commonTab.docNum &" ¶áõÙ³ñ-           150,000.00 ²ñÅ.- 000 [Üáñ]"
          .fECOM = "Group Cash Withdrawal Advice"
      End With

      Set dbFOLDERS(1) = New_DB_FOLDERS()
      With dbFOLDERS(1)
          .fFOLDERID = "Oper."&todayDateSQL2
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "5"
          .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
          .fSPEC = groupCashOutput.commonTab.docNum & "                77700"&wAcc2&"       150000.00000Üáñ                                                   77Overdraft úå»ñ³ïáñ              44444333 55 05/05/2005                                          ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù                                                                                                                        "
          .fECOM = "Group Cash Withdrawal Advice"
          .fDCDEPART = "1"
          .fDCBRANCH = "00"
      End With
          
     	Call CheckQueryRowCount("FOLDERS","fISN",groupCashOutput.fIsn,2)
      Call CheckDB_FOLDERS(dbFOLDERS(0),1)
      Call CheckDB_FOLDERS(dbFOLDERS(1),1)

    	  ' DOCSATTACH
    	  Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, Project.Path & "Stores\Attach file\Photo.jpg", 1, "attachedLink_1", 1)
    	  Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, "excel.xlsx", 0,"" , 1)
    	  Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, "txtFile.txt", 0, "", 1)
    	  Call CheckQueryRowCount("DOCSATTACH","fISN",groupCashOutput.fIsn,3)

    	  ' DOCSG
    	  Call CheckQueryRowCount("DOCSG","fISN",groupCashOutput.fIsn,8)
       Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "0", "ACCDB", wAcc1 , 1)
       Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "1", "ACCDB", "000001100", 1)
       Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "0", "AIM", "Ð³ñÏ»ñÇ Ù³ñáõÙ", 1)
       Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "1", "AIM", "ì³ñÏÇ Ù³ñáõÙ", 1)
       Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "0", "OPERTYPE", "MSC", 1)
       Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "1", "OPERTYPE", "MSC", 1)
       Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "0", "SUMMA", "100000", 1)
       Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "1", "SUMMA", "50000", 1)
       
    	  ' HI
       Set dbHI(0) = New_DB_HI()
       With dbHI(0)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL
            .fTYPE = "11"
            .fSUM = "100000.00"
            .fCUR = "000"
            .fCURSUM = "100000.00"
            .fOP = "MSC"
            .fDBCR = "D"
			         .fADB = wAcc1Isn
            .fACR = wAcc2Isn
            .fSPEC = groupCashOutput.commonTab.docNum & "                   Ð³ñÏ»ñÇ Ù³ñáõÙ                    1     1.0000    1"
      End With

      Set dbHI(1) = New_DB_HI()
      With dbHI(1)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL
            .fTYPE = "11"
            .fSUM = "100000.00"
            .fCUR = "000"
            .fCURSUM = "100000.00"
            .fOP = "MSC"
            .fDBCR = "C"
			         .fADB = wAcc1Isn
            .fACR = wAcc2Isn
            .fSPEC = groupCashOutput.commonTab.docNum & "                   Ð³ñÏ»ñÇ Ù³ñáõÙ                    0     1.0000    1"
      End With

      Set dbHI(2) = New_DB_HI()
      With dbHI(2)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL
            .fTYPE = "11"
            .fSUM = "50000.00"
            .fCUR = "000"
            .fCURSUM = "50000.00"
            .fOP = "MSC"
            .fDBCR = "D"
			         .fADB = "1630170" 
            .fACR = wAcc2Isn
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ì³ñÏÇ Ù³ñáõÙ                      1     1.0000    1"
      End With

      Set dbHI(3) = New_DB_HI()
      With dbHI(3)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL
            .fTYPE = "11"
            .fSUM = "50000.00"
            .fCUR = "000"
            .fCURSUM = "50000.00"
            .fOP = "MSC"
            .fDBCR = "D"
			         .fADB = "1630170"
            .fACR = wAcc2Isn
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ì³ñÏÇ Ù³ñáõÙ                      1     1.0000    1"
      End With

      Set dbHI(4) = New_DB_HI()
      With dbHI(4)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL
            .fTYPE = "11"
            .fSUM = "500.00"
            .fCUR = "000"
            .fCURSUM = "500.00"
            .fOP = "FEX"
            .fDBCR = "C"
			         .fADB = "1630171"
            .fACR = "1629199"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ             0     1.0000    1"
      End With

      Set dbHI(5) = New_DB_HI()
      With dbHI(5)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL
            .fTYPE = "11"
            .fSUM = "500.00"
            .fCUR = "001"
            .fCURSUM = "1.25"
            .fOP = "FEX"
            .fDBCR = "D"
			         .fADB = "1630171"
            .fACR = "1629199"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ             1   400.0000    1"
      End With

       Call Check_DB_HI(dbHI(0),1)
  	    Call Check_DB_HI(dbHI(1),1)
  	    Call Check_DB_HI(dbHI(2),1)
  	    Call Check_DB_HI(dbHI(3),1)
  	    Call Check_DB_HI(dbHI(4),1)
  	    Call Check_DB_HI(dbHI(5),1)
    	  Call CheckQueryRowCount("HI","fBASE",groupCashOutput.fIsn,6)

       ' Մուտք Գլխավոր հաշվապահի ԱՇՏ
      Call ChangeWorkspace(c_ChiefAcc)
      
      ' Մուտք Աշխատանքային փաստաթղթեր
      Set workingDocs = New_MainAccWorkingDocuments()
      With workingDocs
            .startDate = todayDate
    			     .endDate = todayDate
      End With
   
      Call GoTo_MainAccWorkingDocuments("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|", workingDocs)
      
      ' Գտնել խմբային կանխիկ ելք փաստաթուղթը
      colN = 2
      If Not CheckContractDoc(colN, groupCashOutput.commonTab.docNum) Then
            Log.Error("խմբային կանխիկ ելք փաստաթուղթն առկա չէ")
      End If
      
      Log.Message("Խմբային կանխիկ ելք փաստաթղթի արժեքների ստուգում և խմբագրում")
      Set editGrCashOutput = New_GroupCashOutput(2, 1, 0, 1)
      With editGrCashOutput
                .commonTab.wOffice = "00"
                .commonTab.wDepartment = "1"
                .commonTab.wDate = todayDate 
                .commonTab.cashRegister = "001"
                .commonTab.cashRegisterAcc = wAcc2
                .commonTab.wCurr = "000"
                .commonTab.cashierChar = "051"
                .commonTab.wBase = "Î³ÝËÇÏ »Éù ËÙµ³ÛÇÝ "
                .commonTab.wAcc(0)  = wAcc1 
                .commonTab.wSum(0) = "100,000.00"
                .commonTab.wAim(0) = "Ð³ñÏ»ñÇ Ù³ñáõÙ"
                .commonTab.nonChargPart(0) = "0.00"
                .commonTab.wAcc(1) = "000001100" 
                .commonTab.wSum(1) = "50,000.00"
                .commonTab.wAim(1) = "ì³ñÏÇ Ù³ñáõÙ"
                .commonTab.nonChargPart(1) = "0.00"
                .commonTab.reCalc = 0
                .commonTab.wPayer = "00001001"
                .commonTab.wName = "Overdraft 1"
                .commonTab.wSurname = "úå»ñ³ïáñ 1"
                .commonTab.wId = "44444333"
                .commonTab.idType = "01"
                .commonTab.idGivenBy = "012"
                .commonTab.wCitizenship = "1"
                .commonTab.wCountry = "AM"
                .commonTab.wResidence = "010010536"
                .commonTab.wCity = "¾ñ»µáõÝÇ"
                .commonTab.wApartment = "µÝ 10"
                .commonTab.wStreet = "ö³÷³½Û³Ý"
                .commonTab.wHouse = "îáõÝ"                
                .commonTab.wEmail = "xmbayinKanxik@mutq"
                .commonTab.birthDate = "01/01/1995"
                .commonTab.idGiveDate = "13/12/2019"
                .commonTab.idValidUntil = "13/12/2029"
                .chargeTab.office = "00"
                .chargeTab.department = "1"
                .chargeTab.chargeAcc = "000001101"   
                .chargeTab.chargeAccForCheck = "000001101"
                .chargeTab.chargeCurr = "001"
                .chargeTab.chargeCurrForCheck = "001"   
                .chargeTab.cbExchangeRate = "400.0000/1"
                .chargeTab.chargeType = "03"
                .chargeTab.chargeAmount = "3.00"
                .chargeTab.chargeAmoForCheck = "3.00"
                .chargeTab.chargePercent = "0.8000"
                .chargeTab.chargePerForCheck = "0.8000"
                .chargeTab.incomeAcc = "000436900"    
                .chargeTab.incomeAccCurr = "000"
                .chargeTab.buyAndSell = "1"
                .chargeTab.buyAndSellForCheck = "1"
                .chargeTab.operType = "1"
                .chargeTab.operPlace = "3"
                .chargeTab.operArea = "9X"
                .chargeTab.operAreaForCheck = "9X"
                .chargeTab.nonResident = 1
                .chargeTab.nonResidentForCheck = 1
                .chargeTab.legalStatus = "11"
                .chargeTab.legalStatusForCheck = "11"
                .chargeTab.comment = "²ñï³ñÅ.ÙÇçí×³ñ³ÛÇÝ ·³ÝÓáõÙ"
                .chargeTab.commentForCheck = "²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ"
                .chargeTab.clientAgreeData = ""
                .chargeTab.notGrCash = False
                .coinTab.coin = "0.00"
                .coinTab.coinForCheck = "0.00"
                .coinTab.coinPayCurr = ""
                .coinTab.coinPayAcc = ""
                .coinTab.coinExchangeRate = "0/0"
                .coinTab.coinCBExchangeRate = "0/0"
                .coinTab.coinBuyAndSell = ""
                .coinTab.coinPayAmount = "0.00"
                .coinTab.coinPayAmountForCheck = "0.00"
                .coinTab.amountWithMainCurr = "0.00"
                .coinTab.amountCurrForCheck = "0.00"
                .coinTab.incomeOutChange = ""
                .coinTab.damagesOutChange = ""
                .coinTab.roundedAmount = "0.00"
                .coinTab.roundedAmountForCheck = "0.00"
                .attachedTab.addFiles(0) = Project.Path & "Stores\Attach file\Photo.jpg"
                .attachedTab.fileName(0) = "Photo.jpg"
                .attachedTab.delFiles(0) = "txtFile.txt"
      End With
      Call Edit_Group_Cash_Output(groupCashOutput, editGrCashOutput, "Î³ï³ñ»É")
      BuiltIn.Delay(5000)
      
      'DOCS
      fBODY = "" & vbCRLF _
                & "ACSBRANCH:00"& vbCRLF _
                & "ACSDEPART:1"& vbCRLF _
                & "BLREP:0"& vbCRLF _
                & "USERID:  77"& vbCRLF _
                & "DOCNUM:"& groupCashOutput.commonTab.docNum & vbCRLF _
                & "DATE:"& todayDateSQL2 & vbCRLF _
                & "KASSA:001"& vbCRLF _
                & "ACCCR:"& wAcc2 & vbCRLF _
                & "CUR:000"& vbCRLF _
                & "KASSIMV:051"& vbCRLF _
                & "BASE:Î³ÝËÇÏ »Éù ËÙµ³ÛÇÝ"& vbCRLF _
                & "FRSHNOCRG:0"& vbCRLF _
                & "CLICODE:00001001"& vbCRLF _
                & "RECEIVER:Overdraft 1"& vbCRLF _
                & "RECEIVERLASTNAME:úå»ñ³ïáñ 1"& vbCRLF _
                & "PASSNUM:44444333"& vbCRLF _
                & "PASTYPE:01"& vbCRLF _
                & "PASBY:012"& vbCRLF _
                & "DATEPASS:20191213"& vbCRLF _
                & "DATEEXPIRE:20291213"& vbCRLF _
                & "DATEBIRTH:19950101"& vbCRLF _
                & "CITIZENSHIP:1"& vbCRLF _
                & "COUNTRY:AM"& vbCRLF _
                & "COMMUNITY:010010536"& vbCRLF _
                & "CITY:¾ñ»µáõÝÇ"& vbCRLF _
                & "APARTMENT:µÝ 10"& vbCRLF _
                & "ADDRESS:ö³÷³½Û³Ý"& vbCRLF _
                & "BUILDNUM:îáõÝ"& vbCRLF _
                & "EMAIL:xmbayinKanxik@mutq"& vbCRLF _
                & "TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
                & "ACSBRANCHINC:00"& vbCRLF _
                & "ACSDEPARTINC:1"& vbCRLF _
                & "CHRGACC:000001101"& vbCRLF _
                & "TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
                & "CHRGCUR:001"& vbCRLF _
                & "CHRGCBCRS:400.0000/1"& vbCRLF _
                & "PAYSCALE:03"& vbCRLF _
                & "CHRGSUM:3"& vbCRLF _
                & "PRSNT:0.8"& vbCRLF _
                & "CHRGINC:000436900"& vbCRLF _
                & "CUPUSA:1"& vbCRLF _
                & "CURTES:1"& vbCRLF _
                & "CURVAIR:3"& vbCRLF _
                & "TIME:"& groupCashOutput.chargeTab.timeForCheck & vbCRLF _
                & "VOLORT:9X"& vbCRLF _
                & "NONREZ:1"& vbCRLF _
                & "JURSTAT:11"& vbCRLF _
                & "COMM:²ñï³ñÅ.ÙÇçí×³ñ³ÛÇÝ ·³ÝÓáõÙ"& vbCRLF _
                & ""
      Call CheckDB_DOCS(groupCashOutput.fIsn,"KsRsOrPk","2",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",groupCashOutput.fIsn,1)

	     ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",groupCashOutput.fIsn,3)
      Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","E","2"," ",1)
          
    	 ' FOLDERS
      With dbFOLDERS(0)
          .fFOLDERID = "C.910355456"
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "5"
          .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
          .fSPEC = "²Ùë³ÃÇí- "&todayDate&" N- "& groupCashOutput.commonTab.docNum &" ¶áõÙ³ñ-           150,000.00 ²ñÅ.- 000 [ÊÙµ³·ñíáÕ]"
          .fECOM = "Group Cash Withdrawal Advice"
      End With

      With dbFOLDERS(1)
          .fFOLDERID = "Oper."&todayDateSQL2
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "5"
          .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
          .fSPEC = groupCashOutput.commonTab.docNum &"                77700"&wAcc2&"       150000.00000ÊÙµ³·ñíáÕ                                             77Overdraft 1 úå»ñ³ïáñ 1          44444333 012 13/12/2019                                         Î³ÝËÇÏ »Éù ËÙµ³ÛÇÝ                                                                                                                        "
          .fECOM = "Group Cash Withdrawal Advice"
          .fDCDEPART = "1"
          .fDCBRANCH = "00"
      End With
          
     	Call CheckQueryRowCount("FOLDERS","fISN",groupCashOutput.fIsn,2)
      Call CheckDB_FOLDERS(dbFOLDERS(0),1)
      Call CheckDB_FOLDERS(dbFOLDERS(1),1)

    	  'DOCSATTACH
    	  Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, Project.Path & "Stores\Attach file\Photo.jpg", 1, "attachedLink_1", 1)
    	  Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, "Photo.jpg", 0, "", 1)
    	  Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, "excel.xlsx", 0, "", 1)
    	  Call CheckQueryRowCount("DOCSATTACH","fISN",groupCashOutput.fIsn,3)
      
      BuiltIn.Delay(5000)
      Log.Message("Վավերացնել Խմբային Կանխիկ ելքի փաստաթուղթը")
      colN = 2
      action = c_ToConfirm
      doNum = 1
      doActio = "Ð³ëï³ï»É"
      
      If Not ConfirmContractDoc(colN, groupCashOutput.commonTab.docNum, action, doNum, doActio) Then
            Log.Error("Խմբային Կանխիկ ելքի փաստաթուղթը չի վավերացվել")
            Exit Sub
      End If
      
      Call Close_Window(wMDIClient, "frmPttel")
      
	     ' DOCS
      fBODY = "" & vbCRLF _              
                & "ACSBRANCH:00"& vbCRLF _
                & "ACSDEPART:1"& vbCRLF _
                & "BLREP:0"& vbCRLF _
                & "USERID:  77"& vbCRLF _
                & "DOCNUM:"& groupCashOutput.commonTab.docNum & vbCRLF _
                & "DATE:"& todayDateSQL2 & vbCRLF _
                & "KASSA:001"& vbCRLF _
                & "ACCCR:" & wAcc2 & vbCRLF _
                & "CUR:000"& vbCRLF _
                & "KASSIMV:051"& vbCRLF _
                & "BASE:Î³ÝËÇÏ »Éù ËÙµ³ÛÇÝ"& vbCRLF _
                & "FRSHNOCRG:0"& vbCRLF _
                & "CLICODE:00001001"& vbCRLF _
                & "RECEIVER:Overdraft 1"& vbCRLF _
                & "RECEIVERLASTNAME:úå»ñ³ïáñ 1"& vbCRLF _
                & "PASSNUM:44444333"& vbCRLF _
                & "PASTYPE:01"& vbCRLF _
                & "PASBY:012"& vbCRLF _
                & "DATEPASS:20191213"& vbCRLF _
                & "DATEEXPIRE:20291213"& vbCRLF _
                & "DATEBIRTH:19950101"& vbCRLF _
                & "CITIZENSHIP:1"& vbCRLF _
                & "COUNTRY:AM"& vbCRLF _
                & "COMMUNITY:010010536"& vbCRLF _
                & "CITY:¾ñ»µáõÝÇ"& vbCRLF _
                & "APARTMENT:µÝ 10"& vbCRLF _
                & "ADDRESS:ö³÷³½Û³Ý"& vbCRLF _
                & "BUILDNUM:îáõÝ"& vbCRLF _
                & "EMAIL:xmbayinKanxik@mutq"& vbCRLF _
                & "TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
                & "ACSBRANCHINC:00"& vbCRLF _
                & "ACSDEPARTINC:1"& vbCRLF _
                & "CHRGACC:000001101"& vbCRLF _
                & "TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
                & "CHRGCUR:001"& vbCRLF _
                & "CHRGCBCRS:400.0000/1"& vbCRLF _
                & "PAYSCALE:03"& vbCRLF _
                & "CHRGSUM:3"& vbCRLF _
                & "PRSNT:0.8"& vbCRLF _
                & "CHRGINC:000436900"& vbCRLF _
                & "CUPUSA:1"& vbCRLF _
                & "CURTES:1"& vbCRLF _
                & "CURVAIR:3"& vbCRLF _
                & "TIME:"& groupCashOutput.chargeTab.timeForCheck & vbCRLF _
                & "VOLORT:9X"& vbCRLF _
                & "NONREZ:1"& vbCRLF _
                & "JURSTAT:11"& vbCRLF _
                & "COMM:²ñï³ñÅ.ÙÇçí×³ñ³ÛÇÝ ·³ÝÓáõÙ"& vbCRLF _
                & ""

      Call CheckDB_DOCS(groupCashOutput.fIsn,"KsRsOrPk","14",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",groupCashOutput.fIsn,1)

	     ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",groupCashOutput.fIsn,5)
	     Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","M","14","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)

      ' FOLDERS
      Call CheckQueryRowCount("FOLDERS","fISN",groupCashOutput.fIsn,0)
      
      With dbHI(0)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL
            .fTYPE = "01"
            .fSUM = "100000.00"
            .fCUR = "000"
            .fCURSUM = "100000.00"
            .fOP = "MSC"
            .fDBCR = "C"
			         .fADB = wAcc1Isn 
            .fACR = wAcc2Isn
            .fSPEC = groupCashOutput.commonTab.docNum & "051                Ð³ñÏ»ñÇ Ù³ñáõÙ                    0     1.0000    1"
			         .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(1)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL
            .fTYPE = "01"
            .fSUM = "100000.00"
            .fCUR = "000"
            .fCURSUM = "100000.00"
            .fOP = "MSC"
            .fDBCR = "D"
			         .fADB = wAcc1Isn 
            .fACR = wAcc2Isn
            .fSPEC = groupCashOutput.commonTab.docNum & "                   Ð³ñÏ»ñÇ Ù³ñáõÙ                    1     1.0000    1                                                                        Overdraft 1 úå»ñ³ïáñ 1          "
			         .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
	  End With

      With dbHI(2)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL
            .fTYPE = "01"
            .fSUM = "50000.00"
            .fCUR = "000"
            .fCURSUM = "50000.00"
            .fOP = "MSC"
            .fDBCR = "D"
			         .fADB = "1630170" 
            .fACR = wAcc2Isn 
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ì³ñÏÇ Ù³ñáõÙ                      1     1.0000    1                                                                        Overdraft 1 úå»ñ³ïáñ 1          "
			         .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
	  End With

      With dbHI(3)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL
            .fTYPE = "01"
            .fSUM = "50000.00"
            .fCUR = "000"
            .fCURSUM = "50000.00"
            .fOP = "MSC"
            .fDBCR = "C"
			         .fADB = "1630170"
            .fACR = wAcc2Isn 
            .fSPEC = groupCashOutput.commonTab.docNum & "051                ì³ñÏÇ Ù³ñáõÙ                      0     1.0000    1"
			         .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(4)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL
            .fTYPE = "01"
            .fSUM = "1200.00"
            .fCUR = "000"
            .fCURSUM = "1200.00"
            .fOP = "FEX"
            .fDBCR = "C"
			         .fADB = "1630171"
            .fACR = "1629200"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²ñï³ñÅ.ÙÇçí×³ñ³ÛÇÝ ·³ÝÓáõÙ        0     1.0000    1"
			         .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(5)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL
            .fTYPE = "01"
            .fSUM = "1200.00"
            .fCUR = "001"
            .fCURSUM = "3.00"
            .fOP = "FEX"
            .fDBCR = "D"
			         .fADB = "1630171"
            .fACR = "1629200"
            .fSPEC = groupCashOutput.commonTab.docNum & "021                ²ñï³ñÅ.ÙÇçí×³ñ³ÛÇÝ ·³ÝÓáõÙ        1   400.0000    1"
			         .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

	     Set dbHI(6) = New_DB_HI()
      With dbHI(6)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL
            .fTYPE = "CE"
            .fSUM = "1200.00"
            .fCUR = "001"
            .fCURSUM = "3.00"
            .fOP = "PUR"
            .fDBCR = "D"
			         .fADB = "-1"
            .fACR = "-1"
            .fSPEC =  "%%"
			         .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
       End With
       
       Call Check_DB_HI(dbHI(0),1)
  	    Call Check_DB_HI(dbHI(1),1)
  	    Call Check_DB_HI(dbHI(2),1)
  	    Call Check_DB_HI(dbHI(3),1)
  	    Call Check_DB_HI(dbHI(4),1)
  	    Call Check_DB_HI(dbHI(5),1)
		     Call Check_DB_HI(dbHI(6),1)
    	  Call CheckQueryRowCount("HI","fBASE",groupCashOutput.fIsn,7)
       
      ' PAYMENTS
      With dbPAYMENTS(0)
                .fISN = groupCashOutput.fIsn
                .fDOCTYPE = "KsRsOrPk"
                .fDATE = todayDateSQL
                .fSTATE = "14"
                .fDOCNUM = groupCashOutput.commonTab.docNum
                .fCLIENT = "00001001"
                .fACCDB = ""
                .fPAYER = "Overdraft 1 úå»ñ³ïáñ 1"
                .fCUR = "000"
                .fSUMMA = "150000.00"
                .fSUMMAAMD = "150000.00"
                .fSUMMAUSD = "375.00"
                .fCOM = "Î³ÝËÇÏ »Éù ËÙµ³ÛÇÝ                                                                                                                        "
                .fPASSPORT = "44444333 012 13/12/2019"
                .fCOUNTRY = "AM"
                .fACSBRANCH = "00 "
                .fACSDEPART = "1  "
          End With
      Call CheckDB_PAYMENTS(dbPAYMENTS(0),1)
      
      Log.Message("Մուտք Հաշվառված վճարային փաստաթղթեր թղթապանակ")
      folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      selectView = "Payments"
      cliCode = ""
      Call OpenAccPaymentDocFolder(folderDirect, todayDate, todayDate, wUser, docType, wName, passNum, cliCode,_
                                                                      paySysIn, paySysOut, acsBranch, acsDepart, docISN, selectView, exportExcel)
      
      ' Գտնել խմբային կանխիկ ելք փաստաթուղթը
      colN = 2

      If CheckContractDoc(colN, groupCashOutput.commonTab.docNum) Then
          ' Կատարել բոլոր գործողությունները
          Call wMainForm.MainMenu.Click(c_AllActions)
          ' Խմբագրել
          Call wMainForm.PopupMenu.Click(c_View)
          
          If wMDIClient.WaitVBObject("frmASDocForm", 15000).Exists Then
                  Log.Message("Ստուգել Խմբային կանխիկ ելք փաստաթղթի տվյալները")
                  editGrCashOutput.commonTab.gridRowCount = 2
                  Call Check_Group_Cash_Output(editGrCashOutput)
                  ' Կատարել կոճակի սեղմում
                  Call ClickCmdButton(1, "OK")
          
                  BuiltIn.Delay(3000)
                  Log.Message("Ջնջել Խմբային կանխիկ ելք փաստաթուղթը")
                  ExpMess1 = "ö³ëï³ÃáõÕÃÁ çÝç»ÉÇë` ÏÑ»é³óí»Ý Ýñ³ Ñ»ï Ï³åí³Í ËÙµ³ÛÇÝ " & vbCrLf & "Ó¨³Ï»ñåáõÙÝ»ñÁ"
                  ExpMess2 = "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ"
          
                  If Not DeleteGroupAction(ExpMess1, ExpMess2) Then
                      Log.Error "Խմբային կանխիկ ելք փաստաթուղթը չի ջնջվել",,, ErrorColor
                  End If
          Else
                  Log.Error("Խմբային կանխիկ ելքի փաստաթուղթը չի բացվել")
          End If
      Else
            Log.Error("խմբային կանխիկ ելք փաստաթուղթն առկա չէ Հաշվառված վճարային փաստաթղթեր թղթապանակում")
      End If

      BuiltIn.Delay(3000)
      Log.Message("Ջնջել Կանխիկ Մուտք փաստաթուղթը")
      Call SearchAndDelete("frmPttel", 2, docNumIn, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 

      ' Փակել Հաշվառված վճարային փաստաթղթեր թղթապանակը 
      Call Close_Window(wMDIClient, "frmPttel")
      
      Log.Message("Ջնջել դրամարկղեր թղթապանակից")
      arr(0) = "¸ñ³Ù³ñÏÕ»ñ"
      arr(1) = "00  00"
      arr(2) = "000 ´áÉáñ ¹ñ³Ù³ñÏÕ»ñ"
      arr(3) = "001 ÀÝÑ³Ýáõñ ¹ñ³Ù³ñÏÕ"
      Call wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|î»Õ»Ï³ïáõÝ»ñ|¸ñ³Ù³ñÏÕ»ñ")   
      
      If wMDIClient.WaitVBObject("frmEditTree", 6000).Exists Then
           If  Find_Tree_Element(4, arr) Then
           
                    With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
                    Call Delete_Grid_Row(1, "Document", 1, wAcc1)

                    Call Delete_Grid_Row(1, "Document", 1, wAcc2)
                    
                    Call ClickCmdButton(1, "Î³ï³ñ»É")
           
                    End  With
          Else
             Log.Error "Դրամարկղեր|00 00| 000 Բոլոր դրամարկղեր| 001 Ընդհանուր դրամարկղ էլեմենտը չի գտնվել ",,,ErrorColor
          End If
      Else
          Log.Error "Հանգույց/էլեմենտը չի գտնվել",,,,,,ErrorColor
      End If
      
      ' Փակել Դրամարկղեր թղթապանակը 
      Call Close_Window(wMDIClient, "frmEditTree")
      
      Log.Message("Ջնջել Հաշիվները հաշիվներ թղթապանակից")
      ' Մուտք հաշիվներ թղթապանակ, հաշիվներ դիալոգի լրացում
      folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|Ð³ßÇíÝ»ñ"
      selectView = "ACCS"
      Call OpenAccauntsFolder(folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
                                                     oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
                                                     acsBranch, acsDepart, acsType, selectView, exportExcel )
      
      If wMDIClient.WaitVBObject("frmPttel",5000).Exists Then
           
          Call SearchAndDelete("frmPttel", 1, wAcc1, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
      
          Call SearchAndDelete("frmPttel", 1, wAcc2, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
          ' Փակել Հաշիվներ թղթապանակը 
          Call Close_Window(wMDIClient, "frmPttel")
      Else    
           Log.Error "Հաշիվներ թղթապանակը չի բացվել",,,,,,ErrorColor
      End If

      Call CheckQueryRowCount("ACCOUNTS", "fISN", wAcc1Isn, 0) 
      Call CheckQueryRowCount("ACCOUNTS", "fISN", wAcc2Isn, 0)
      
      ' FOLDERS
       With dbFOLDERS(0)
          .fFOLDERID = ".R."&todayDateSQL2
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "0"
          .fCOM = ""
          .fSPEC = Left_Align(Get_Compname_DOCLOG(groupCashOutput.fIsn), 16) & "GlavBux ARMSOFT                       1114 "
          .fECOM = ""
          .fDCDEPART = "1"
          .fDCBRANCH = "00"
      End With

      Call CheckQueryRowCount("FOLDERS","fISN",groupCashOutput.fIsn,1)
      Call CheckDB_FOLDERS(dbFOLDERS(0),1)
      
	     ' DOCS
      Call CheckDB_DOCS(groupCashOutput.fIsn,"KsRsOrPk","999",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",groupCashOutput.fIsn,1)
      
	     ' DOCLOG
      Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","D","999"," ",1)
      Call CheckQueryRowCount("DOCLOG","fISN",groupCashOutput.fIsn,6)

      ' Փակել ծրագիրը
      Call Close_AsBank()
     
End Sub