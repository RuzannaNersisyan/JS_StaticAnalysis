Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT CashInput_Confirmphases_Library
'USEUNIT CashOutput_Confirmpases_Library
'USEUNIT DAHK_Library_Filter
'USEUNIT Payment_Except_Library
'USEUNIT Library_CheckDB
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT BankMail_Library
'USEUNIT Library_Contracts
'USEUNIT Library_Colour
'USEUNIT Main_Accountant_Filter_Library
      
'Test Case ID 188649

 ' Խմբային Կանխիկ ելք փաստաթղթի ստուգում (Անհատ ձեռներեց)
Sub Group_Out_Entry_Private_Entrepreneur_Test()

      Dim newAcc, fDATE, sDATE, groupCashOutput, workingDocuments, addIntoCassa
      Dim folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
              oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
              acsBranch, acsDepart, acsType, selectView, exportExcel 
      Dim fileName1, fileName2, param, savePath, fName, colN, workingDocs, editGrCashInp, fBODY, action, doNum, doActio
      Dim dbFOLDERS(2) ,  todayDateSQL, dbPAYMENTS(1), dbHI(7), todayDateSQL2, verifyDocuments, editGrCashOutput
      Dim todayDate, wUser, docType, wName, passNum, cliCode, paySysIn, paySysOut, docISN, ExpMess1, ExpMess2     

      fDATE = "20250101"
      sDATE = "20030101"
      Call Initialize_AsBank("bank", sDATE, fDATE)
      Call Create_Connection()
      Call SetParameter("CHECKCHRGINCACC ", "1")
      todayDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
      todayDateSQL = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d")
      todayDateSQL2 = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y-%m-%d")

      ' Մուտք գործել համակարգ ARMSOFT  օգտագործողով 
      Login("ARMSOFT")
      
      ' Մուտք Գլխավոր հաշվապահի ԱՇՏ
      Call ChangeWorkspace(c_ChiefAcc)
      
      ' Մուտք հաշիվներ թղթապանակ, հաշիվներ դիալոգի լրացում
      folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|Ð³ßÇíÝ»ñ"
      accType = "10"
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
      
      Set groupCashOutput = New_GroupCashOutput(2, 2, 1, 0)
      With groupCashOutput
                .commonTab.wOffice = "00"
                .commonTab.wDepartment = "1"
                .commonTab.wDate =  todayDate 
                .commonTab.cashRegister = "001"
                .commonTab.cashRegisterAcc =  "73030201000" 
                .commonTab.wCurr = "000"
                .commonTab.cashierChar = "051"
                .commonTab.wBase = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
                .commonTab.wAcc(0)  = "73030461000" 
                .commonTab.wSum(0) = "200,000.00"
                .commonTab.wAim(0) = "öáË³ÝóáõÙ å»ïµÛáõç»"
                .commonTab.nonChargPart(0) = "0.00"
                .commonTab.wAcc(1) = "000001100" 
                .commonTab.wSum(1) = "5,000,000.00"
                .commonTab.wAim(1) = "ì³ñÏÇ ïáÏáëÇ Ù³ñáõÙ"
                .commonTab.nonChargPart(1) = "0.00"
                .commonTab.wPayer = "00034855"
                .commonTab.payerLegalStatus = "ԱնհՁեռ"
                .commonTab.wName = "ì³ñ¹³Ý"
                .commonTab.wSurName = "²ñ³ÙÛ³Ý"
                .commonTab.wId = "AN123598745"
                .commonTab.wIdCheck = "AN123598745"
                .commonTab.idType = "01"
                .commonTab.idGivenBy = "012"
                .commonTab.idGivenByCheck = "012"
                .commonTab.idTypeCheck = "01"
                .commonTab.wCitizenship = "1"
                .commonTab.wCountry = "AM"
                .commonTab.wResidence = "010010338"
                .commonTab.wCity = "ºñ¨³Ý"
                .commonTab.wApartment = "Ñ³Ù³ñ 54"
                .commonTab.wStreet = "Ü³Éµ³Ý¹Û³Ý"
                .commonTab.wHouse = "îáõÝ"
                .commonTab.wEmail = "vardanaramyan@gmail.com"
                .commonTab.emailForCheck = "vardanaramyan@gmail.com"
                .commonTab.birthDateForCheck = "01/01/1995"
                .commonTab.idGiveDateForCheck = "01/01/2020"
                .commonTab.idValidUntilForCheck = "01/01/2030"
                .commonTab.birthDate = "01/01/1995"
                .commonTab.idGiveDate = "01/01/2020"
                .commonTab.idValidUntil = "01/01/2030"
                .commonTab.reCalc = 0
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
                .chargeTab.chargePercent = "0.0096"
                .chargeTab.chargePerForCheck = "0.0096"
                .chargeTab.incomeAcc = "000920200"
                .chargeTab.incomeAccCurr = "000"
                .chargeTab.buyAndSell = "1"
                .chargeTab.buyAndSellForCheck = "1"
                .chargeTab.operType = "1"
                .chargeTab.operPlace = "3"
                .chargeTab.operArea = "7"
                .chargeTab.operAreaForCheck = "7"
                .chargeTab.nonResident = 1
                .chargeTab.nonResidentForCheck = 0
                .chargeTab.legalStatus = "22"
                .chargeTab.legalStatusForCheck = "22"
                .chargeTab.comment = "²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ"
                .chargeTab.commentForCheck = "²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ"
                .chargeTab.notGrCash = False
                .coinTab.coin = "0.00"
                .coinTab.coinForCheck = "0.00"
                .coinTab.roundedAmount = "0.00"
                .coinTab.roundedAmountForCheck = "0.00"
                .coinTab.amountCurrForCheck = "0.00"
                .coinTab.coinPayAmount = "0.00"
                .coinTab.coinPayAmountForCheck = "0.00"
                .attachedTab.addFiles(0) = Project.Path & "Stores\Attach file\excel.xlsx"
                .attachedTab.fileName(0) = "excel.xlsx"
                .attachedTab.addFiles(1) =  Project.Path & "Stores\Attach file\txtFile.txt"
                .attachedTab.fileName(1) = "txtFile.txt"
                .attachedTab.addLinks(0) =  Project.Path & "Stores\Attach file\Photo.jpg"
                .attachedTab.linkName(0) = "Attach Photo"
      End With
 
      Call Create_Group_Cash_Output(groupCashOutput, "ê¨³·Çñ")
      Log.Message("Փաստաթղթի համարը " & groupCashOutput.commonTab.docNum)
      Log.Message("Փաստաթղթի ISN`  " & groupCashOutput.fIsn)
      
      ' Փակել Հաշիվներ թղթապանակը
      Call Close_Window(wMDIClient, "frmPttel")

     	 'DOCS
       fBODY = ""& vbCRLF _
                    & "ACSBRANCH:00"& vbCRLF _
                    & "ACSDEPART:1"& vbCRLF _
                    & "USERID:  77"& vbCRLF _
                    & "DOCNUM:"& groupCashOutput.commonTab.docNum & vbCRLF _
                    & "DATE:"& todayDateSQL & vbCRLF _
                    & "KASSA:001"& vbCRLF _
                    & "ACCCR:73030201000"& vbCRLF _
                    & "CUR:000"& vbCRLF _
                    & "KASSIMV:051"& vbCRLF _
                    & "BASE:ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"& vbCRLF _
                    & "FRSHNOCRG:0"& vbCRLF _
                    & "CLICODE:00034855"& vbCRLF _
                    & "RECEIVER:ì³ñ¹³Ý"& vbCRLF _
                    & "RECEIVERLASTNAME:²ñ³ÙÛ³Ý"& vbCRLF _
                    & "PASSNUM:AN123598745"& vbCRLF _
                    & "PASTYPE:01"& vbCRLF _
                    & "PASBY:012"& vbCRLF _
                    & "DATEPASS:20200101"& vbCRLF _
                    & "DATEEXPIRE:20300101"& vbCRLF _
                    & "DATEBIRTH:19950101"& vbCRLF _
                    & "CITIZENSHIP:1"& vbCRLF _
                    & "COUNTRY:AM"& vbCRLF _
                    & "COMMUNITY:010010338"& vbCRLF _
                    & "CITY:ºñ¨³Ý"& vbCRLF _
                    & "APARTMENT:Ñ³Ù³ñ 54"& vbCRLF _
                    & "ADDRESS:Ü³Éµ³Ý¹Û³Ý"& vbCRLF _
                    & "BUILDNUM:îáõÝ"& vbCRLF _
                    & "EMAIL:vardanaramyan@gmail.com"& vbCRLF _
                    & "TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
                    & "ACSBRANCHINC:00"& vbCRLF _
                    & "ACSDEPARTINC:1"& vbCRLF _
                    & "CHRGACC:000001101"& vbCRLF _
                    & "TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
                    & "CHRGCUR:001"& vbCRLF _
                    & "CHRGCBCRS:400.0000/1"& vbCRLF _
                    & "PAYSCALE:05"& vbCRLF _
                    & "CHRGSUM:1.25"& vbCRLF _
                    & "PRSNT:0.0096"& vbCRLF _
                    & "CHRGINC:000920200"& vbCRLF _
                    & "CUPUSA:1"& vbCRLF _
                    & "CURTES:1"& vbCRLF _
                    & "CURVAIR:3"& vbCRLF _
                    & "TIME:"& groupCashOutput.chargeTab.timeForCheck & vbCRLF _
                    & "VOLORT:7"& vbCRLF _
                    & "NONREZ:1"& vbCRLF _
                    & "JURSTAT:22"& vbCRLF _
                    & "COMM:²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ"& vbCRLF _
                    & ""

      fBODY = Replace(fBODY, "  ", "%")
      Call CheckDB_DOCS(groupCashOutput.fIsn,"KsRsOrPk","0",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",groupCashOutput.fIsn,1)
         
	     ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",groupCashOutput.fIsn,2)
      Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","N","0"," ",1)
      Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","F","0"," ",1)
          
    	 ' FOLDERS
      Set dbFOLDERS(0) = New_DB_FOLDERS()
      With dbFOLDERS(0)
          .fFOLDERID = ".D.GlavBux "
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "1"
          .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
          .fDCBRANCH = "00"
    		    .fDCDEPART = "1"
      End With

     	Call CheckQueryRowCount("FOLDERS","fISN",groupCashOutput.fIsn,1)
      Call CheckDB_FOLDERS(dbFOLDERS(0),1)

    	  ' DOCSG
   	   Call CheckQueryRowCount("DOCSG","fISN",groupCashOutput.fIsn,6)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "0", "ACCDB", "73030461000", 1)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "1", "ACCDB", "000001100", 1)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "0", "AIM", "öáË³ÝóáõÙ å»ïµÛáõç»", 1)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "1", "AIM", "ì³ñÏÇ ïáÏáëÇ Ù³ñáõÙ", 1)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "0", "SUMMA", "200000", 1)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "1", "SUMMA", "5000000", 1)

      ' DOCSATTACH
   	  Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, Project.Path & "Stores\Attach file\Photo.jpg", 1, "Attach Photo", 1)
   	  Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, "excel.xlsx", 0,"" , 1)
   	  Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, "txtFile.txt", 0, "", 1)
   	  Call CheckQueryRowCount("DOCSATTACH","fISN",groupCashOutput.fIsn,3)

       ' Մուտք գործել Օգտագործողի Սևագրեր թղթապանակ
      Log.Message ("Մուտք գործել Օգտագործողի Սևագրեր թղթապանակ")
      Call wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|ú·ï³·áñÍáÕÇ ë¨³·ñ»ñ")
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
    
      ' Ստեղծել Խմբային Կանխիկ ելք փաստաթուղթը սևագրերից
      Log.Message( "Ստեղծել Խմբային Կանխիկ ելք փաստաթուղթը սևագրերից")
      If SearchInPttel("frmPttel", 2, groupCashOutput.fIsn) Then
              BuiltIn.Delay(3000)
              Call wMainForm.MainMenu.Click(c_AllActions)
              Call wMainForm.PopupMenu.Click(c_ToEdit)
              If wMDIClient.WaitvbObject("frmASDocForm", 3000).Exists Then
                  Call Check_Group_Cash_Output(groupCashOutput)
                  Call ClickCmdButton(1, "Î³ï³ñ»É")
              Else 
                  Log.Error ("Խմբային Կանխիկ ելք փաստաթուղթը առկա չէ Սևագրեր թղթապանակում")
              End If
      Else
              Log.Error("Օգտագործողի Սևագրեր թղթապանակը չի բացվել")
      End If
      
      savePath = Project.Path & "Stores\Cash_Input_Output\Actual\"
      fName = "GroupCashOutPrivateEntAct.txt"
      fileName1 = Project.Path & "Stores\Cash_Input_Output\Actual\GroupCashOutPrivateEntAct.txt"
      fileName2 = Project.Path & "Stores\Cash_Input_Output\Expected\GroupCashOutPrivateEntExp.txt"
      
      If wMDIClient.WaitVBObject("FrmSpr",3000).Exists Then
            ' Հիշել քաղվածքը
            Call SaveDoc(savePath, fName)

            param = "(\d{2}[/]\d{2}[/]\d{2}.\d{2}[:]\d{2})|(N\s\d.*)"
            Call Compare_Files(fileName1, fileName2,param)
            
            BuiltIn.Delay(1000)
            Call Close_Window(wMDIClient, "FrmSpr")
      Else 
            Log.Error "Խմբային կանխիկ ելքի քաղվածքը չի բացվել"  
      End If
      
      ' Փակել Օգտագործողսի Սևագրեր թղթապանակը
      Call Close_Window(wMDIClient, "frmPttel")
      
       'DOCS
       fBODY = ""& vbCRLF _
                    & "ACSBRANCH:00"& vbCRLF _
                    & "ACSDEPART:1"& vbCRLF _
                    & "BLREP:0"& vbCRLF _
                    & "USERID:  77"& vbCRLF _
                    & "DOCNUM:"& groupCashOutput.commonTab.docNum & vbCRLF _
                    & "DATE:"& todayDateSQL & vbCRLF _
                    & "KASSA:001"& vbCRLF _
                    & "ACCCR:73030201000"& vbCRLF _
                    & "CUR:000"& vbCRLF _
                    & "KASSIMV:051"& vbCRLF _
                    & "BASE:ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"& vbCRLF _
                    & "FRSHNOCRG:0"& vbCRLF _
                    & "CLICODE:00034855"& vbCRLF _
                    & "RECEIVER:ì³ñ¹³Ý"& vbCRLF _
                    & "RECEIVERLASTNAME:²ñ³ÙÛ³Ý"& vbCRLF _
                    & "PASSNUM:AN123598745"& vbCRLF _
                    & "PASTYPE:01"& vbCRLF _
                    & "PASBY:012"& vbCRLF _
                    & "DATEPASS:20200101"& vbCRLF _
                    & "DATEEXPIRE:20300101"& vbCRLF _
                    & "DATEBIRTH:19950101"& vbCRLF _
                    & "CITIZENSHIP:1"& vbCRLF _
                    & "COUNTRY:AM"& vbCRLF _
                    & "COMMUNITY:010010338"& vbCRLF _
                    & "CITY:ºñ¨³Ý"& vbCRLF _
                    & "APARTMENT:Ñ³Ù³ñ 54"& vbCRLF _
                    & "ADDRESS:Ü³Éµ³Ý¹Û³Ý"& vbCRLF _
                    & "BUILDNUM:îáõÝ"& vbCRLF _
                    & "EMAIL:vardanaramyan@gmail.com"& vbCRLF _
                    & "TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
                    & "ACSBRANCHINC:00"& vbCRLF _
                    & "ACSDEPARTINC:1"& vbCRLF _
                    & "CHRGACC:000001101"& vbCRLF _
                    & "TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"& vbCRLF _
                    & "CHRGCUR:001"& vbCRLF _
                    & "CHRGCBCRS:400.0000/1"& vbCRLF _
                    & "PAYSCALE:05"& vbCRLF _
                    & "CHRGSUM:1.25"& vbCRLF _
                    & "PRSNT:0.0096"& vbCRLF _
                    & "CHRGINC:000920200"& vbCRLF _
                    & "CUPUSA:1"& vbCRLF _
                    & "CURTES:1"& vbCRLF _
                    & "CURVAIR:3"& vbCRLF _
                    & "TIME:"& groupCashOutput.chargeTab.timeForCheck & vbCRLF _
                    & "VOLORT:7"& vbCRLF _
                    & "NONREZ:1"& vbCRLF _
                    & "JURSTAT:22"& vbCRLF _
                    & "COMM:²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ"& vbCRLF _
                    & ""
      fBODY = Replace(fBODY, "  ", "%")
      Call CheckDB_DOCS(groupCashOutput.fIsn,"KsRsOrPk","2",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",groupCashOutput.fIsn,1)
      
      ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",groupCashOutput.fIsn,3)
      Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","E","2"," ",1)
      
      ' FOLDERS
      With dbFOLDERS(0)
          .fFOLDERID = "C.1052440579"
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "5"
          .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
          .fSPEC = "²Ùë³ÃÇí- "& todayDate &" N- "& groupCashOutput.commonTab.docNum &" ¶áõÙ³ñ-         5,200,000.00 ²ñÅ.- 000 [Üáñ]"
          .fECOM = "Group Cash Withdrawal Advice"
          .fDCDEPART = ""
          .fDCBRANCH = ""
      End With

	  Set dbFOLDERS(1) = New_DB_FOLDERS()
      With dbFOLDERS(1)
          .fFOLDERID = "Oper."&todayDateSQL
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "5"
          .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
          .fSPEC = groupCashOutput.commonTab.docNum &"                7770073030201000      5200000.00000Üáñ                                                   77ì³ñ¹³Ý ²ñ³ÙÛ³Ý                 "&_
           " AN123598745 012 01/01/2020                                      ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù                                                                                                                          "
          .fECOM = "Group Cash Withdrawal Advice"
          .fDCDEPART = "1"
          .fDCBRANCH = "00"
      End With

      Call CheckQueryRowCount("FOLDERS","fISN",groupCashOutput.fIsn,2)
      Call CheckDB_FOLDERS(dbFOLDERS(0),1)
	     Call CheckDB_FOLDERS(dbFOLDERS(1),1)
      
      ' DOCSG
   	  Call CheckQueryRowCount("DOCSG","fISN",groupCashOutput.fIsn,8)
      Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "0", "OPERTYPE", "MSC", 1)
    	 Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "1", "OPERTYPE", "MSC", 1)
      
      ' HI
      Set dbHI(0) = New_DB_HI()
      With dbHI(0)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "200000.00"
            .fCUR = "000"
            .fCURSUM = "200000.00"
            .fOP = "MSC"
            .fDBCR = "D"
            .fADB = "1406851809"
            .fACR = "1969111254"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   öáË³ÝóáõÙ å»ïµÛáõç»               1     1.0000    1"
      End With

	     Set dbHI(1) = New_DB_HI()
      With dbHI(1)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "200000.00"
            .fCUR = "000"
            .fCURSUM = "200000.00"
            .fOP = "MSC"
            .fDBCR = "C"
            .fADB = "1406851809"
            .fACR = "1969111254"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   öáË³ÝóáõÙ å»ïµÛáõç»               0     1.0000    1"
      End With

	     Set dbHI(2) = New_DB_HI()
      With dbHI(2)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "5000000.00"
            .fCUR = "000"
            .fCURSUM = "5000000.00"
            .fOP = "MSC"
            .fDBCR = "D"
            .fADB = "1630170"
            .fACR = "1969111254"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ì³ñÏÇ ïáÏáëÇ Ù³ñáõÙ               1     1.0000    1"
      End With

	     Set dbHI(3) = New_DB_HI()
      With dbHI(3)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "5000000.00"
            .fCUR = "000"
            .fCURSUM = "5000000.00"
            .fOP = "MSC"
            .fDBCR = "C"
            .fADB = "1630170"
            .fACR = "1969111254"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ì³ñÏÇ ïáÏáëÇ Ù³ñáõÙ               0     1.0000    1"
      End With

	     Set dbHI(4) = New_DB_HI()
      With dbHI(4)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "500.00"
            .fCUR = "001"
            .fCURSUM = "1.25"
            .fOP = "FEX"
            .fDBCR = "D"
            .fADB = "1630171"
            .fACR = "1630421"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ             1   400.0000    1"
      End With


	     Set dbHI(5) = New_DB_HI()
      With dbHI(5)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "500.00"
            .fCUR = "000"
            .fCURSUM = "500.00"
            .fOP = "FEX"
            .fDBCR = "C"
            .fADB = "1630171"
            .fACR = "1630421"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ             0     1.0000    1"
      End With

     
      Call Check_DB_HI(dbHI(0),1)
  	   Call Check_DB_HI(dbHI(1),1)
  	   Call Check_DB_HI(dbHI(2),1)
  	   Call Check_DB_HI(dbHI(3),1)
  	   Call Check_DB_HI(dbHI(4),1)
  	   Call Check_DB_HI(dbHI(5),1)
     	Call CheckQueryRowCount("HI","fBASE",groupCashOutput.fIsn,6)

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
      Set editGrCashOutput = New_GroupCashOutput(2,1, 1, 1)
      With editGrCashOutput
                .commonTab.wOffice = "00"
                .commonTab.wDepartment = "1"
                .commonTab.wDate =  todayDate 
                .commonTab.cashRegister = "001"
                .commonTab.cashRegisterAcc =  "73030201000" 
                .commonTab.wCurr = "000"
                .commonTab.cashierChar = "051"
                .commonTab.wBase = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
                .commonTab.wAcc(0)  = "73030461000" 
                .commonTab.wSum(0) = "200,000.00"
                .commonTab.wAim(0) = "öáË³ÝóáõÙ å»ïµÛáõç»"
                .commonTab.nonChargPart(0) = "0.00"
                .commonTab.wAcc(1) = "000001100" 
                .commonTab.wSum(1) = "5,000,000.00"
                .commonTab.wAim(1) = "ì³ñÏÇ ïáÏáëÇ Ù³ñáõÙ"
                .commonTab.nonChargPart(1) = "0.00"
                .commonTab.wPayer = "00034857"
                .commonTab.payerLegalStatus = "ԱնհՁեռ"
                .commonTab.wName = "È¨áÝ"
                .commonTab.wSurName = "Ø»ÉùáÝÛ³Ý"
                .commonTab.wId = "AT95815486"
                .commonTab.wIdCheck = "AM95848546"
                .commonTab.idType = "02"
                .commonTab.idGivenBy = "120"
                .commonTab.idGivenByCheck = "125"
                .commonTab.idTypeCheck = "02"
                .commonTab.wCitizenship = "1"
                .commonTab.wCountry = "AM"
                .commonTab.wResidence = "020030110"
                .commonTab.wCity = "Â³ÉÇÝ"
                .commonTab.wApartment = "µÝ. 9 "
                .commonTab.wStreet = "Â³ÉÇÝÛ³Ý"
                .commonTab.wHouse = "Þ»Ýù"
                .commonTab.wEmail = "levonmelqonyan@gmail.com"
                .commonTab.emailForCheck = "levon@gmail.com"
                .commonTab.birthDateForCheck = "01/01/1985"
                .commonTab.idGiveDateForCheck = "01/01/2020"
                .commonTab.idValidUntilForCheck = "01/01/2030"
                .commonTab.birthDate = "01/01/1985"
                .commonTab.idGiveDate = "01/07/2022"
                .commonTab.idValidUntil = "01/08/2032"
                .commonTab.reCalc = 0
                .chargeTab.office = "00"
                .chargeTab.department = "1"
                .chargeTab.chargeAcc = "000001101"
                .chargeTab.chargeAccForCheck = "000001101"
                .chargeTab.chargeCurr = "001"
                .chargeTab.chargeCurrForCheck = "001"   
                .chargeTab.cbExchangeRate = "400.0000/1"
                .chargeTab.chargeType = "55"
                .chargeTab.chargeAmount = "25.00"
                .chargeTab.chargeAmoForCheck = "25.00"
                .chargeTab.chargePercent = "0.1923"
                .chargeTab.chargePerForCheck = "0.1923"
                .chargeTab.incomeAcc = "000440100"
                .chargeTab.incomeAccCurr = "000"
                .chargeTab.buyAndSell = "1"
                .chargeTab.buyAndSellForCheck = "1"
                .chargeTab.operType = "1"
                .chargeTab.operPlace = "3"
                .chargeTab.operArea = "7"
                .chargeTab.operAreaForCheck = "7"
                .chargeTab.nonResident = 1
                .chargeTab.nonResidentForCheck = 0
                .chargeTab.legalStatus = "22"
                .chargeTab.legalStatusForCheck = "22"
                .chargeTab.comment = "²ñï.ÙÇçí×. ·³ÝÓáõÙ Î³ÝËÇÏ »ÉùÇó"
                .chargeTab.commentForCheck = "²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ"
                .chargeTab.notGrCash = False
                .coinTab.coin = "0.00"
                .coinTab.coinForCheck = "0.00"
                .coinTab.roundedAmount = "0.00"
                .coinTab.roundedAmountForCheck = "0.00"
                .coinTab.amountCurrForCheck = "0.00"
                .coinTab.coinPayAmount = "0.00"
                .coinTab.coinPayAmountForCheck = "0.00"
                .attachedTab.addFiles(0) = Project.Path & "Stores\Attach file\Photo.jpg"
                .attachedTab.fileName(0) = "Photo.jpg"
                .attachedTab.addLinks(0) =  Project.Path & "Stores\Attach file\txtFile.txt"
                .attachedTab.linkName(0) = "Attach txt File"
                .attachedTab.delFiles(0) = "txtFile.txt"
      End With
      
      Call Edit_Group_Cash_Output(groupCashOutput, editGrCashOutput, "Î³ï³ñ»É")
      
      fBODY = "" & vbCRLF _
                    & "ACSBRANCH:00" & vbCRLF _
                    & "ACSDEPART:1" & vbCRLF _
                    & "BLREP:0" & vbCRLF _
                    & "USERID:  77" & vbCRLF _
                    & "DOCNUM:"& groupCashOutput.commonTab.docNum & vbCRLF _
                    & "DATE:"& todayDateSQL & vbCRLF _
                    & "KASSA:001" & vbCRLF _
                    & "ACCCR:73030201000" & vbCRLF _
                    & "CUR:000" & vbCRLF _
                    & "KASSIMV:051" & vbCRLF _
                    & "BASE:ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù" & vbCRLF _
                    & "FRSHNOCRG:0" & vbCRLF _
                    & "CLICODE:00034857" & vbCRLF _
                    & "RECEIVER:È¨áÝ" & vbCRLF _
                    & "RECEIVERLASTNAME:Ø»ÉùáÝÛ³Ý" & vbCRLF _
                    & "PASSNUM:AT95815486" & vbCRLF _
                    & "PASTYPE:02" & vbCRLF _
                    & "PASBY:120" & vbCRLF _
                    & "DATEPASS:20220701" & vbCRLF _
                    & "DATEEXPIRE:20320801" & vbCRLF _
                    & "DATEBIRTH:19850101" & vbCRLF _
                    & "CITIZENSHIP:1" & vbCRLF _
                    & "COUNTRY:AM" & vbCRLF _
                    & "COMMUNITY:020030110" & vbCRLF _
                    & "CITY:Â³ÉÇÝ" & vbCRLF _
                    & "APARTMENT:µÝ. 9" & vbCRLF _
                    & "ADDRESS:Â³ÉÇÝÛ³Ý" & vbCRLF _
                    & "BUILDNUM:Þ»Ýù" & vbCRLF _
                    & "EMAIL:levonmelqonyan@gmail.com" & vbCRLF _
                    & "TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28" & vbCRLF _
                    & "ACSBRANCHINC:00" & vbCRLF _
                    & "ACSDEPARTINC:1" & vbCRLF _
                    & "CHRGACC:000001101" & vbCRLF _
                    & "TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28" & vbCRLF _
                    & "CHRGCUR:001" & vbCRLF _
                    & "CHRGCBCRS:400.0000/1" & vbCRLF _
                    & "PAYSCALE:55" & vbCRLF _
                    & "CHRGSUM:25" & vbCRLF _
                    & "PRSNT:0.1923" & vbCRLF _
                    & "CHRGINC:000440100" & vbCRLF _
                    & "CUPUSA:1" & vbCRLF _
                    & "CURTES:1" & vbCRLF _
                    & "CURVAIR:3" & vbCRLF _
                    & "TIME:"& groupCashOutput.chargeTab.timeForCheck & vbCRLF _
                    & "VOLORT:7" & vbCRLF _
                    & "NONREZ:1" & vbCRLF _
                    & "JURSTAT:22" & vbCRLF _
                    & "COMM:²ñï.ÙÇçí×. ·³ÝÓáõÙ Î³ÝËÇÏ »ÉùÇó" & vbCRLF _
                    & ""

      fBODY = Replace(fBODY, "  ", "%")
      Call CheckDB_DOCS(groupCashOutput.fIsn,"KsRsOrPk","2",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",groupCashOutput.fIsn,1)

	     ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",groupCashOutput.fIsn,4)
      Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","E","2"," ",2)


	     ' FOLDERS
      With dbFOLDERS(0)
          .fFOLDERID = "C.753710355"
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "5"
          .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
          .fSPEC = "²Ùë³ÃÇí- "& todayDate &" N- "& groupCashOutput.commonTab.docNum &" ¶áõÙ³ñ-         5,200,000.00 ²ñÅ.- 000 [ÊÙµ³·ñíáÕ]"
          .fECOM = "Group Cash Withdrawal Advice"
          .fDCDEPART = ""
          .fDCBRANCH = ""
      End With

	     With dbFOLDERS(1)
          .fFOLDERID = "Oper."&todayDateSQL
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "5"
          .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
          .fSPEC = groupCashOutput.commonTab.docNum &"                7770073030201000      5200000.00000ÊÙµ³·ñíáÕ                                             77È¨áÝ Ø»ÉùáÝÛ³Ý                  AT95815486 120 01/07/2022                                       ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù                                                                                                                          "
          .fECOM = "Group Cash Withdrawal Advice"
          .fDCDEPART = "1"
          .fDCBRANCH = "00"
      End With

	     Call CheckQueryRowCount("FOLDERS","fISN",groupCashOutput.fIsn,2)
      Call CheckDB_FOLDERS(dbFOLDERS(0),1)
      Call CheckDB_FOLDERS(dbFOLDERS(1),1)

    	 ' DOCSATTACH 
      Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, Project.Path & "Stores\Attach file\Photo.jpg", 1, "Attach Photo                                      ", 1)
	     Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, Project.Path & "Stores\Attach file\txtFile.txt", 1, "Attach txt File                                   ", 1)
    	 Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, "Photo.jpg", 0, "", 1)
    	 Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, "excel.xlsx", 0, "", 1)
    	 Call CheckQueryRowCount("DOCSATTACH","fISN",groupCashOutput.fIsn,4)

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
                    & "ACSBRANCH:00" & vbCRLF _
                    & "ACSDEPART:1" & vbCRLF _
                    & "BLREP:0" & vbCRLF _
                    & "USERID:  77" & vbCRLF _
                    & "DOCNUM:"& groupCashOutput.commonTab.docNum & vbCRLF _
                    & "DATE:"& todayDateSQL & vbCRLF _
                    & "KASSA:001" & vbCRLF _
                    & "ACCCR:73030201000" & vbCRLF _
                    & "CUR:000" & vbCRLF _
                    & "KASSIMV:051" & vbCRLF _
                    & "BASE:ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù" & vbCRLF _
                    & "FRSHNOCRG:0" & vbCRLF _
                    & "CLICODE:00034857" & vbCRLF _
                    & "RECEIVER:È¨áÝ" & vbCRLF _
                    & "RECEIVERLASTNAME:Ø»ÉùáÝÛ³Ý" & vbCRLF _
                    & "PASSNUM:AT95815486" & vbCRLF _
                    & "PASTYPE:02" & vbCRLF _
                    & "PASBY:120" & vbCRLF _
                    & "DATEPASS:20220701" & vbCRLF _
                    & "DATEEXPIRE:20320801" & vbCRLF _
                    & "DATEBIRTH:19850101" & vbCRLF _
                    & "CITIZENSHIP:1" & vbCRLF _
                    & "COUNTRY:AM" & vbCRLF _
                    & "COMMUNITY:020030110" & vbCRLF _
                    & "CITY:Â³ÉÇÝ" & vbCRLF _
                    & "APARTMENT:µÝ. 9" & vbCRLF _
                    & "ADDRESS:Â³ÉÇÝÛ³Ý" & vbCRLF _
                    & "BUILDNUM:Þ»Ýù" & vbCRLF _
                    & "EMAIL:levonmelqonyan@gmail.com" & vbCRLF _
                    & "TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28" & vbCRLF _
                    & "ACSBRANCHINC:00" & vbCRLF _
                    & "ACSDEPARTINC:1" & vbCRLF _
                    & "CHRGACC:000001101" & vbCRLF _
                    & "TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28" & vbCRLF _
                    & "CHRGCUR:001" & vbCRLF _
                    & "CHRGCBCRS:400.0000/1" & vbCRLF _
                    & "PAYSCALE:55" & vbCRLF _
                    & "CHRGSUM:25" & vbCRLF _
                    & "PRSNT:0.1923" & vbCRLF _
                    & "CHRGINC:000440100" & vbCRLF _
                    & "CUPUSA:1" & vbCRLF _
                    & "CURTES:1" & vbCRLF _
                    & "CURVAIR:3" & vbCRLF _
                    & "TIME:"& groupCashOutput.chargeTab.timeForCheck & vbCRLF _
                    & "VOLORT:7" & vbCRLF _
                    & "NONREZ:1" & vbCRLF _
                    & "JURSTAT:22" & vbCRLF _
                    & "COMM:²ñï.ÙÇçí×. ·³ÝÓáõÙ Î³ÝËÇÏ »ÉùÇó" & vbCRLF _
                    & ""
      fBODY = Replace(fBODY, "  ", "%")
      Call CheckDB_DOCS(groupCashOutput.fIsn,"KsRsOrPk","14",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",groupCashOutput.fIsn,1)
	  
	     ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",groupCashOutput.fIsn,6)
      Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","W","3"," ",1)
	     Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","M","14","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)

	     ' FOLDERS
      Call CheckQueryRowCount("FOLDERS","fISN",groupCashOutput.fIsn,0)

	     ' HI
      With dbHI(0)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "200000.00"
            .fCUR = "000"
            .fCURSUM = "200000.00"
            .fOP = "MSC"
            .fDBCR = "D"
            .fADB = "1406851809"
            .fACR = "1969111254"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   öáË³ÝóáõÙ å»ïµÛáõç»               1     1.0000    1                                                                        È¨áÝ Ø»ÉùáÝÛ³Ý                  "
			         .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
	     End With

      With dbHI(1)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "200000.00"
            .fCUR = "000"
            .fCURSUM = "200000.00"
            .fOP = "MSC"
            .fDBCR = "C"
            .fADB = "1406851809"
            .fACR = "1969111254"
            .fSPEC = groupCashOutput.commonTab.docNum & "051                öáË³ÝóáõÙ å»ïµÛáõç»               0     1.0000    1"
			         .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(2)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "5000000.00"
            .fCUR = "000"
            .fCURSUM = "5000000.00"
            .fOP = "MSC"
            .fDBCR = "D"
            .fADB = "1630170"
            .fACR = "1969111254"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ì³ñÏÇ ïáÏáëÇ Ù³ñáõÙ               1     1.0000    1                                                                        È¨áÝ Ø»ÉùáÝÛ³Ý                  "
			         .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(3)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "5000000.00"
            .fCUR = "000"
            .fCURSUM = "5000000.00"
            .fOP = "MSC"
            .fDBCR = "C"
            .fADB = "1630170"
            .fACR = "1969111254"
            .fSPEC = groupCashOutput.commonTab.docNum & "051                ì³ñÏÇ ïáÏáëÇ Ù³ñáõÙ               0     1.0000    1"
	           .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(4)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "10000.00"
            .fCUR = "000"
            .fCURSUM = "10000.00"
            .fOP = "FEX"
            .fDBCR = "C"
            .fADB = "1630171"
            .fACR = "1629204"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²ñï.ÙÇçí×. ·³ÝÓáõÙ Î³ÝËÇÏ »ÉùÇó   0     1.0000    1"
		          	.fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(5)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "10000.00"
            .fCUR = "001"
            .fCURSUM = "25.00"
            .fOP = "FEX"
            .fDBCR = "D"
            .fADB = "1630171"
            .fACR = "1629204"
            .fSPEC = groupCashOutput.commonTab.docNum & "021                ²ñï.ÙÇçí×. ·³ÝÓáõÙ Î³ÝËÇÏ »ÉùÇó   1   400.0000    1"
			         .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      Set dbHI(6) = New_DB_HI()
      With dbHI(6)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "CE"
            .fSUM = "10000.00"
            .fCUR = "001"
            .fCURSUM = "25.00"
            .fOP = "PUR"
            .fDBCR = "D"
            .fADB = "-1"
            .fACR = "-1"
            .fSPEC = "%"& groupCashOutput.commonTab.docNum &"7 "
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
     	Set dbPAYMENTS(0) = New_DB_PAYMENTS()
      With dbPAYMENTS(0)
            .fISN = groupCashOutput.fIsn
            .fDOCTYPE = "KsRsOrPk"
            .fDATE = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y-%m-%d")
            .fSTATE = "14"
            .fDOCNUM = groupCashOutput.commonTab.docNum
            .fCLIENT = "00034857"
            .fACCDB = ""
            .fPAYER = "È¨áÝ Ø»ÉùáÝÛ³Ý"
            .fCUR = "000"
            .fSUMMA = "5200000.00"
            .fSUMMAAMD = "5200000.00"
            .fSUMMAUSD = "13000.00"
            .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù                                                                                                                        "
            .fPASSPORT = "AT95815486 120 01/07/2022"
            .fCOUNTRY = "AM"
            .fACSBRANCH = "00"
            .fACSDEPART = "1"
      End With
      Call CheckDB_PAYMENTS(dbPAYMENTS(0),1)
      Call CheckQueryRowCount("PAYMENTS","fISN",groupCashOutput.fIsn,1)
      
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

      Call Close_Window(wMDIClient, "frmPttel")
      
      ' FOLDERS
       With dbFOLDERS(0)
          .fFOLDERID = ".R."&todayDateSQL
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
      Call CheckQueryRowCount("DOCLOG","fISN",groupCashOutput.fIsn,7)
      
      ' Փակել ծրագիրը
      Call Close_AsBank()
      
End Sub