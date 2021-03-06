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
      
'Test Case ID 188322

 ' Խմբային Կանխիկ ելք փաստաթղթի ստուգում (Ֆիզիկական անձ)
Sub Group_Cash_Out_Physical_Person_Test()

      Dim newAcc, fDATE, sDATE, groupCashOutput, workingDocuments, addIntoCassa
      Dim folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
              oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
              acsBranch, acsDepart, acsType, selectView, exportExcel 
      Dim fileName1, fileName2, param, savePath, fName, colN, workingDocs, editGrCashInp, fBODY, action, doNum, doActio
      Dim dbFOLDERS(3) ,  todayDateSQL, dbPAYMENTS(1), dbHI(12), todayDateSQL2, verifyDocuments, editGrCashOutput
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
                .commonTab.cashRegisterAcc =  "73030381000" 
                .commonTab.wCurr = "001"
                .commonTab.cashierChar = "051"
                .commonTab.wBase = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
                .commonTab.wAcc(0)  = "73030121000" 
                .commonTab.wSum(0) = "2,000.00"
                .commonTab.wAim(0) = "²éÑ³ßÇí ·áõÙ³ñ"
                .commonTab.nonChargPart(0) = "0.00"
                .commonTab.wAcc(1) = "000001101" 
                .commonTab.wSum(1) = "10,000.00"
                .commonTab.wAim(1) = "ØÇçÝáñ¹³í×³ñ"
                .commonTab.nonChargPart(1) = "0.00"
                .commonTab.wPayer = "00034854"
                .commonTab.payerLegalStatus = "ֆիզԱնձ"
                .commonTab.wName = "²ñï³Ï"
                .commonTab.wSurName = "Ð³Ûñ³å»ïÛ³Ý"
                .commonTab.wId = "AN524685478"
                .commonTab.wIdCheck = "AN524685478"
                .commonTab.idType = "09"
                .commonTab.idGivenBy = "012"
                .commonTab.idGivenByCheck = "012"
                .commonTab.idTypeCheck = "09"
                .commonTab.wCitizenship = "1"
                .commonTab.wCountry = "AM"
                .commonTab.wResidence = "010010635"
                .commonTab.wCity = "ºñ¨³Ý"
                .commonTab.wApartment = "µÝ. 18"
                .commonTab.wStreet = "²µáíÛ³Ý"
                .commonTab.wHouse = "Þ»Ýù"
                .commonTab.wEmail = "artakhayrapetyan@gmail.com"
                .commonTab.emailForCheck = "artakhayrapetyan@gmail.com"
                .commonTab.birthDateForCheck = "01/01/1991"
                .commonTab.idGiveDateForCheck = "01/01/2020"
                .commonTab.idValidUntilForCheck = "01/01/2035"
                .commonTab.birthDate = "01/01/1991"
                .commonTab.idGiveDate = "01/01/2020"
                .commonTab.idValidUntil = "01/01/2035"
                .commonTab.reCalc = 0
                .chargeTab.office = "00"
                .chargeTab.department = "1"
                .chargeTab.chargeAcc = "000001101"
                .chargeTab.chargeAccForCheck = ""
                .chargeTab.chargeCurr = "001"
                .chargeTab.chargeCurrForCheck = "001"   
                .chargeTab.cbExchangeRate = "400.0000/1"
                .chargeTab.chargeType = "09"
                .chargeTab.chargeAmount = "20.00"
                .chargeTab.chargeAmoForCheck = "20.00"
                .chargeTab.chargePercent = "0.1667"
                .chargeTab.chargePerForCheck = "0.1667"
                .chargeTab.incomeAcc = "000454200"
                .chargeTab.incomeAccCurr = "000"
                .chargeTab.buyAndSell = "1"
                .chargeTab.buyAndSellForCheck = "1"
                .chargeTab.operType = "1"
                .chargeTab.operPlace = "3"
                .chargeTab.operArea = "7"
                .chargeTab.operAreaForCheck = "7"
                .chargeTab.nonResident = 1
                .chargeTab.nonResidentForCheck = 0
                .chargeTab.legalStatus = "21"
                .chargeTab.legalStatusForCheck = "21"
                .chargeTab.comment = "²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ"
                .chargeTab.commentForCheck = "²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ"
                .chargeTab.notGrCash = False
                .coinTab.coin = "50.00"
                .coinTab.coinForCheck = "50.00"
                .coinTab.coinPayCurr = "000"
                .coinTab.coinPayAcc = "000001100"
                .coinTab.coinExchangeRate = "340.0000/1"
                .coinTab.coinCBExchangeRate = "400.0000/1"
                .coinTab.coinBuyAndSell = "1"
                .coinTab.coinPayAmount = "17,000.00"
                .coinTab.coinPayAmountForCheck = "17,000.00"
                .coinTab.amountWithMainCurr = "11,950.00"
                .coinTab.amountCurrForCheck = "11,950.00"
                .coinTab.incomeOutChange = "000931900"
                .coinTab.damagesOutChange = "001434300"
                .coinTab.roundedAmount = "0.00"
                .coinTab.roundedAmountForCheck = "0.00"
                .attachedTab.addFiles(0) = Project.Path & "Stores\Attach file\excel.xlsx"
                .attachedTab.fileName(0) = "excel.xlsx"
                .attachedTab.addFiles(1) =  Project.Path & "Stores\Attach file\txtFile.txt"
                .attachedTab.fileName(1) = "txtFile.txt"
                .attachedTab.addLinks(0) =  Project.Path & "Stores\Attach file\Photo.jpg"
                .attachedTab.linkName(0) = "Attach Photo"
      End With
 
      Call Create_Group_Cash_Output(groupCashOutput, "Î³ï³ñ»É")
      Log.Message("Փաստաթղթի համարը " & groupCashOutput.commonTab.docNum)
      Log.Message("Փաստաթղթի ISN`  " & groupCashOutput.fIsn)
      
      savePath = Project.Path & "Stores\Cash_Input_Output\Actual\"
      fName = "GroupCashOutPhysicalPersonAct.txt"
      fileName1 = Project.Path & "Stores\Cash_Input_Output\Actual\GroupCashOutPhysicalPersonAct.txt"
      fileName2 = Project.Path & "Stores\Cash_Input_Output\Expected\GroupCashOutPhysicalPersonExp.txt"
      
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
      
      Call Close_Window(wMDIClient, "frmPttel")
      
      ' DOCS
       fBODY = ""& vbCRLF _
                    & "ACSBRANCH:00" & vbCRLF _
                    & "ACSDEPART:1" & vbCRLF _
                    & "BLREP:0" & vbCRLF _
                    & "USERID:  77" & vbCRLF _
                    & "DOCNUM:"& groupCashOutput.commonTab.docNum & vbCRLF _
                    & "DATE:"& todayDateSQL & vbCRLF _
                    & "KASSA:001" & vbCRLF _
                    & "ACCCR:73030381000" & vbCRLF _
                    & "CUR:001" & vbCRLF _
                    & "KASSIMV:051" & vbCRLF _
                    & "BASE:ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù" & vbCRLF _
                    & "FRSHNOCRG:0" & vbCRLF _
                    & "CLICODE:00034854" & vbCRLF _
                    & "RECEIVER:²ñï³Ï" & vbCRLF _
                    & "RECEIVERLASTNAME:Ð³Ûñ³å»ïÛ³Ý" & vbCRLF _
                    & "PASSNUM:AN524685478" & vbCRLF _
                    & "PASTYPE:09" & vbCRLF _
                    & "PASBY:012" & vbCRLF _
                    & "DATEPASS:20200101" & vbCRLF _
                    & "DATEEXPIRE:20350101" & vbCRLF _
                    & "DATEBIRTH:19910101" & vbCRLF _
                    & "CITIZENSHIP:1" & vbCRLF _
                    & "COUNTRY:AM" & vbCRLF _
                    & "COMMUNITY:010010635" & vbCRLF _
                    & "CITY:ºñ¨³Ý" & vbCRLF _
                    & "APARTMENT:µÝ. 18" & vbCRLF _
                    & "ADDRESS:²µáíÛ³Ý" & vbCRLF _
                    & "BUILDNUM:Þ»Ýù" & vbCRLF _
                    & "EMAIL:artakhayrapetyan@gmail.com" & vbCRLF _
                    & "TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28" & vbCRLF _
                    & "ACSBRANCHINC:00" & vbCRLF _
                    & "ACSDEPARTINC:1" & vbCRLF _
                    & "CHRGACC:000001101" & vbCRLF _
                    & "TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28" & vbCRLF _
                    & "CHRGCUR:001" & vbCRLF _
                    & "CHRGCBCRS:400.0000/1" & vbCRLF _
                    & "PAYSCALE:09" & vbCRLF _
                    & "CHRGSUM:20" & vbCRLF _
                    & "PRSNT:0.1667" & vbCRLF _
                    & "CHRGINC:000454200" & vbCRLF _
                    & "CUPUSA:1" & vbCRLF _
                    & "CURTES:1" & vbCRLF _
                    & "CURVAIR:3" & vbCRLF _
                    & "TIME:"& groupCashOutput.chargeTab.timeForCheck & vbCRLF _
                    & "VOLORT:7" & vbCRLF _
                    & "NONREZ:1" & vbCRLF _
                    & "JURSTAT:21" & vbCRLF _
                    & "COMM:²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ" & vbCRLF _
                    & "XSUM:50" & vbCRLF _
                    & "XCUR:000" & vbCRLF _
                    & "XACC:000001100" & vbCRLF _
                    & "XDLCRS:340/1" & vbCRLF _
                    & "XDLCRSNAME:000 / 001" & vbCRLF _
                    & "XCBCRS:400.0000/1" & vbCRLF _
                    & "XCBCRSNAME:000 / 001" & vbCRLF _
                    & "XCUPUSA:1" & vbCRLF _
                    & "XCURSUM:17000" & vbCRLF _
                    & "XSUMMAIN:11950" & vbCRLF _
                    & "XINC:000931900" & vbCRLF _
                    & "XEXP:001434300" & vbCRLF _
                    & ""
      fBODY = Replace(fBODY, "  ", "%")
      Call CheckDB_DOCS(groupCashOutput.fIsn,"KsRsOrPk","2",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",groupCashOutput.fIsn,1)
                
	     ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",groupCashOutput.fIsn,2)
      Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","N","1"," ",1)
      Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","C","2"," ",1)
          
    	 ' FOLDERS
      Set dbFOLDERS(0) = New_DB_FOLDERS()
      With dbFOLDERS(0)
          .fFOLDERID = "C.764513596"
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "5"
          .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
          .fSPEC = "²Ùë³ÃÇí- "& todayDate &" N- "& groupCashOutput.commonTab.docNum &" ¶áõÙ³ñ-            12,000.00 ²ñÅ.- 001 [Üáñ]"
          .fECOM = "Group Cash Withdrawal Advice"
      End With

     	Set dbFOLDERS(1) = New_DB_FOLDERS()
      With dbFOLDERS(1)
          .fFOLDERID = "Oper."&todayDateSQL
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "5"
          .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
          .fSPEC = groupCashOutput.commonTab.docNum &"                7770073030381000        12000.00001Üáñ                                                   77²ñï³Ï Ð³Ûñ³å»ïÛ³Ý"&_
           "               AN524685478 012 01/01/2020                                      ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù                                                                                                                        "
          .fECOM = "Group Cash Withdrawal Advice"
          .fDCDEPART = "1"
          .fDCBRANCH = "00"
      End With
          

     	Call CheckQueryRowCount("FOLDERS","fISN",groupCashOutput.fIsn,2)
      Call CheckDB_FOLDERS(dbFOLDERS(0),1)
      Call CheckDB_FOLDERS(dbFOLDERS(1),1)

      ' DOCSATTACH
   	  Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, Project.Path & "Stores\Attach file\Photo.jpg", 1, "Attach Photo", 1)
   	  Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, "excel.xlsx", 0,"" , 1)
   	  Call CheckDB_DOCSATTACH(groupCashOutput.fIsn, "txtFile.txt", 0, "", 1)
   	  Call CheckQueryRowCount("DOCSATTACH","fISN",groupCashOutput.fIsn,3)

    	  ' DOCSG
   	   Call CheckQueryRowCount("DOCSG","fISN",groupCashOutput.fIsn,8)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "0", "ACCDB", "73030121000", 1)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "1", "ACCDB", "000001101", 1)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "0", "AIM", "²éÑ³ßÇí ·áõÙ³ñ", 1)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "1", "AIM", "ØÇçÝáñ¹³í×³ñ", 1)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "0", "OPERTYPE", "MSC", 1)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "1", "OPERTYPE", "MSC", 1)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "0", "SUMMA", "2000", 1)
    	  Call CheckDB_DOCSG(groupCashOutput.fIsn, "SUBSUMS", "1", "SUMMA", "10000", 1)

   	  'HI
      Set dbHI(0) = New_DB_HI()
      With dbHI(0)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "780000.00"
            .fCUR = "001"
            .fCURSUM = "1950.00"
            .fOP = "MSC"
            .fDBCR = "D"
            .fADB = "1196072159"
            .fACR = "1426146440"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²éÑ³ßÇí ·áõÙ³ñ                    0   400.0000    1"
      End With

	     Set dbHI(1) = New_DB_HI()
      With dbHI(1)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "780000.00"
            .fCUR = "001"
            .fCURSUM = "1950.00"
            .fOP = "MSC"
            .fDBCR = "C"
            .fADB = "1196072159"
            .fACR = "1426146440"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²éÑ³ßÇí ·áõÙ³ñ                    1   400.0000    1"
      End With

	     Set dbHI(2) = New_DB_HI()
      With dbHI(2)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "4000000.00"
            .fCUR = "001"
            .fCURSUM = "10000.00"
            .fOP = "MSC"
            .fDBCR = "D"
            .fADB = "1630171"
            .fACR = "1426146440"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ØÇçÝáñ¹³í×³ñ                      0   400.0000    1"
      End With

	     Set dbHI(3) = New_DB_HI()
      With dbHI(3)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "4000000.00"
            .fCUR = "001"
            .fCURSUM = "10000.00"
            .fOP = "MSC"
            .fDBCR = "C"
            .fADB = "1630171"
            .fACR = "1426146440"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ØÇçÝáñ¹³í×³ñ                      1   400.0000    1"
      End With

	     Set dbHI(4) = New_DB_HI()
      With dbHI(4)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "3000.00"
            .fCUR = "000"
            .fCURSUM = "3000.00"
            .fOP = "MSC"
            .fDBCR = "C"
            .fADB = "1196072159"
            .fACR = "1629177"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ºÏ³ÙáõïÝ»ñ ³ñï. ÷áË³Ý³ÏáõÙÇó      1     1.0000    1"
      End With


	     Set dbHI(5) = New_DB_HI()
      With dbHI(5)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "3000.00"
            .fCUR = "001"
            .fCURSUM = "0.00"
            .fOP = "MSC"
            .fDBCR = "D"
            .fADB = "1196072159"
            .fACR = "1629177"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ºÏ³ÙáõïÝ»ñ ³ñï. ÷áË³Ý³ÏáõÙÇó      0   400.0000    1"
      End With

	     Set dbHI(6) = New_DB_HI()
      With dbHI(6)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "17000.00"
            .fCUR = "001"
            .fCURSUM = "50.00"
            .fOP = "CEX"
            .fDBCR = "D"
            .fADB = "1196072159"
            .fACR = "1630170"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²éÑ³ßÇí ·áõÙ³ñ                    1   340.0000    1"
      End With

	     Set dbHI(7) = New_DB_HI()
      With dbHI(7)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "17000.00"
            .fCUR = "000"
            .fCURSUM = "17000.00"
            .fOP = "CEX"
            .fDBCR = "C"
            .fADB = "1196072159"
            .fACR = "1630170"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²éÑ³ßÇí ·áõÙ³ñ                    0     1.0000    1"
      End With

	     Set dbHI(8) = New_DB_HI()
      With dbHI(8)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "8000.00"
            .fCUR = "001"
            .fCURSUM = "20.00"
            .fOP = "FEX"
            .fDBCR = "D"
            .fADB = "1630171"
            .fACR = "1629218"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ             1   400.0000    1"
      End With

	     Set dbHI(9) = New_DB_HI()
      With dbHI(9)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "11"
            .fSUM = "8000.00"
            .fCUR = "000"
            .fCURSUM = "8000.00"
            .fOP = "FEX"
            .fDBCR = "C"
            .fADB = "1630171"
            .fACR = "1629218"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ             0     1.0000    1"
      End With
     
      Call Check_DB_HI(dbHI(0),1)
  	   Call Check_DB_HI(dbHI(1),1)
  	   Call Check_DB_HI(dbHI(2),1)
  	   Call Check_DB_HI(dbHI(3),1)
  	   Call Check_DB_HI(dbHI(4),1)
  	   Call Check_DB_HI(dbHI(5),1)
  	   Call Check_DB_HI(dbHI(6),1)
  	   Call Check_DB_HI(dbHI(7),1)
  	   Call Check_DB_HI(dbHI(8),1)
  	   Call Check_DB_HI(dbHI(9),1)
     	Call CheckQueryRowCount("HI","fBASE",groupCashOutput.fIsn,10)
      
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
                .commonTab.cashRegisterAcc =  "73030381000" 
                .commonTab.wCurr = "001"
                .commonTab.cashierChar = "051"
                .commonTab.wBase = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
                .commonTab.wAcc(0)  = "73030121000" 
                .commonTab.wSum(0) = "3,000.00"
                .commonTab.wAim(0) = "²éÑ³ßÇí ·áõÙ³ñ"
                .commonTab.nonChargPart(0) = "0.00"
                .commonTab.wAcc(1) = "000001101" 
                .commonTab.wSum(1) = "12,000.00"
                .commonTab.wAim(1) = "ØÇçÝáñ¹³í×³ñ"
                .commonTab.nonChargPart(1) = "0.00"
                .commonTab.wPayer = "00034856"
                .commonTab.payerLegalStatus = "ֆիզԱնձ"
                .commonTab.wName = "ìÉ³¹ÇÙÇñ"
                .commonTab.wSurName = "úÑ³ÝÛ³Ý"
                .commonTab.wId = "OK514342110"
                .commonTab.wIdCheck = "OK654542151"
                .commonTab.idType = "10"
                .commonTab.idGivenBy = "210"
                .commonTab.idGivenByCheck = "128"
                .commonTab.idTypeCheck = "09"
                .commonTab.wCitizenship = "1"
                .commonTab.wCountry = "AM"
                .commonTab.wResidence = "020010112"
                .commonTab.wCity = "²ßï³ñ³Ï Ø³ñ½Ï»ÝïñáÝ"
                .commonTab.wApartment = "µÝ. 85"
                .commonTab.wStreet = "ì³ñ¹³Ý³Ýó"
                .commonTab.wHouse = "îáõÝ"
                .commonTab.wEmail = "artakhayrapetyan@gmail.com"
                .commonTab.emailForCheck = "vladimir@gmail.com"
                .commonTab.birthDateForCheck = "01/01/1990"
                .commonTab.idGiveDateForCheck = "01/01/2021"
                .commonTab.idValidUntilForCheck = "01/01/2031"
                .commonTab.birthDate = "01/01/1990"
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
                .chargeTab.chargeType = "05"
                .chargeTab.chargeAmount = "460.00"
                .chargeTab.chargeAmoForCheck = "460.00"
                .chargeTab.chargePercent = "3.0667"
                .chargeTab.chargePerForCheck = "3.0667"
                .chargeTab.incomeAcc = "000919400"
                .chargeTab.incomeAccCurr = "000"
                .chargeTab.buyAndSell = "1"
                .chargeTab.buyAndSellForCheck = "1"
                .chargeTab.operType = "1"
                .chargeTab.operPlace = "3"
                .chargeTab.operArea = "7"
                .chargeTab.operAreaForCheck = "7"
                .chargeTab.nonResident = 1
                .chargeTab.nonResidentForCheck = 0
                .chargeTab.legalStatus = "21"
                .chargeTab.legalStatusForCheck = "21"
                .chargeTab.comment = "ÊÙµ³ÛÇÝ Î³ÝËÇÏ »Éù"
                .chargeTab.commentForCheck = "²ñï³ñÅ.ÙÇçí×. ·³ÝÓáõÙ"
                .chargeTab.notGrCash = False
                .coinTab.coin = "100.00"
                .coinTab.coinForCheck = "100.00"
                .coinTab.coinPayCurr = "000"
                .coinTab.coinPayAcc = "000001100"
                .coinTab.coinExchangeRate = "340.0000/1"
                .coinTab.coinCBExchangeRate = "400.0000/1"
                .coinTab.coinBuyAndSell = "1"
                .coinTab.coinPayAmount = "34,000.00"
                .coinTab.coinPayAmountForCheck = "34,000.00"
                .coinTab.amountWithMainCurr = "14,900.00"
                .coinTab.amountCurrForCheck = "14,900.00"
                .coinTab.incomeOutChange = "000931900"
                .coinTab.damagesOutChange = "001434300"
                .coinTab.roundedAmount = "0.00"
                .coinTab.roundedAmountForCheck = "0.00"
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
                    & "ACCCR:73030381000" & vbCRLF _
                    & "CUR:001" & vbCRLF _
                    & "KASSIMV:051" & vbCRLF _
                    & "BASE:ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù" & vbCRLF _
                    & "FRSHNOCRG:0" & vbCRLF _
                    & "CLICODE:00034856" & vbCRLF _
                    & "RECEIVER:ìÉ³¹ÇÙÇñ" & vbCRLF _
                    & "RECEIVERLASTNAME:úÑ³ÝÛ³Ý" & vbCRLF _
                    & "PASSNUM:OK514342110" & vbCRLF _
                    & "PASTYPE:10" & vbCRLF _
                    & "PASBY:210" & vbCRLF _
                    & "DATEPASS:20220701" & vbCRLF _
                    & "DATEEXPIRE:20320801" & vbCRLF _
                    & "DATEBIRTH:19900101" & vbCRLF _
                    & "CITIZENSHIP:1" & vbCRLF _
                    & "COUNTRY:AM" & vbCRLF _
                    & "COMMUNITY:020010112" & vbCRLF _
                    & "CITY:²ßï³ñ³Ï Ø³ñ½Ï»ÝïñáÝ" & vbCRLF _
                    & "APARTMENT:µÝ. 85" & vbCRLF _
                    & "ADDRESS:ì³ñ¹³Ý³Ýó" & vbCRLF _
                    & "BUILDNUM:îáõÝ" & vbCRLF _
                    & "EMAIL:artakhayrapetyan@gmail.com" & vbCRLF _
                    & "TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28" & vbCRLF _
                    & "ACSBRANCHINC:00" & vbCRLF _
                    & "ACSDEPARTINC:1" & vbCRLF _
                    & "CHRGACC:000001101" & vbCRLF _
                    & "TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28" & vbCRLF _
                    & "CHRGCUR:001" & vbCRLF _
                    & "CHRGCBCRS:400.0000/1" & vbCRLF _
                    & "PAYSCALE:05" & vbCRLF _
                    & "CHRGSUM:460" & vbCRLF _
                    & "PRSNT:3.0667" & vbCRLF _
                    & "CHRGINC:000919400" & vbCRLF _
                    & "CUPUSA:1" & vbCRLF _
                    & "CURTES:1" & vbCRLF _
                    & "CURVAIR:3" & vbCRLF _
                    & "TIME:"& groupCashOutput.chargeTab.timeForCheck & vbCRLF _
                    & "VOLORT:7" & vbCRLF _
                    & "NONREZ:1" & vbCRLF _
                    & "JURSTAT:21" & vbCRLF _
                    & "COMM:ÊÙµ³ÛÇÝ Î³ÝËÇÏ »Éù" & vbCRLF _
                    & "XSUM:100" & vbCRLF _
                    & "XCUR:000" & vbCRLF _
                    & "XACC:000001100" & vbCRLF _
                    & "XDLCRS:340/1" & vbCRLF _
                    & "XDLCRSNAME:000 / 001" & vbCRLF _
                    & "XCBCRS:400.0000/1" & vbCRLF _
                    & "XCBCRSNAME:000 / 001" & vbCRLF _
                    & "XCUPUSA:1" & vbCRLF _
                    & "XCURSUM:34000" & vbCRLF _
                    & "XSUMMAIN:14900" & vbCRLF _
                    & "XINC:000931900" & vbCRLF _
                    & "XEXP:001434300" & vbCRLF _
                    & ""
      fBODY = Replace(fBODY, "  ", "%")
      Call CheckDB_DOCS(groupCashOutput.fIsn,"KsRsOrPk","2",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",groupCashOutput.fIsn,1)

	     ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",groupCashOutput.fIsn,3)
      Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","E","2"," ",1)
          

    	 ' FOLDERS
      With dbFOLDERS(0)
          .fFOLDERID = "C.826474004"
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "5"
          .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
          .fSPEC = "²Ùë³ÃÇí- "& todayDate &" N- "& groupCashOutput.commonTab.docNum &" ¶áõÙ³ñ-            15,000.00 ²ñÅ.- 001 [ÊÙµ³·ñíáÕ]"
          .fECOM = "Group Cash Withdrawal Advice"
      End With

     	
      With dbFOLDERS(1)
          .fFOLDERID = "Oper."&todayDateSQL
          .fNAME = "KsRsOrPk"
          .fKEY = groupCashOutput.fIsn
          .fISN = groupCashOutput.fIsn
          .fSTATUS = "5"
          .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù"
          .fSPEC = groupCashOutput.commonTab.docNum &"                7770073030381000        15000.00001ÊÙµ³·ñíáÕ                                             "&_
		        "77ìÉ³¹ÇÙÇñ úÑ³ÝÛ³Ý                OK514342110 210 01/07/2022                                      ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù                                                                                                                        "
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
                    & "ACCCR:73030381000" & vbCRLF _
                    & "CUR:001" & vbCRLF _
                    & "KASSIMV:051" & vbCRLF _
                    & "BASE:ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù" & vbCRLF _
                    & "FRSHNOCRG:0" & vbCRLF _
                    & "CLICODE:00034856" & vbCRLF _
                    & "RECEIVER:ìÉ³¹ÇÙÇñ" & vbCRLF _
                    & "RECEIVERLASTNAME:úÑ³ÝÛ³Ý" & vbCRLF _
                    & "PASSNUM:OK514342110" & vbCRLF _
                    & "PASTYPE:10" & vbCRLF _
                    & "PASBY:210" & vbCRLF _
                    & "DATEPASS:20220701" & vbCRLF _
                    & "DATEEXPIRE:20320801" & vbCRLF _
                    & "DATEBIRTH:19900101" & vbCRLF _
                    & "CITIZENSHIP:1" & vbCRLF _
                    & "COUNTRY:AM" & vbCRLF _
                    & "COMMUNITY:020010112" & vbCRLF _
                    & "CITY:²ßï³ñ³Ï Ø³ñ½Ï»ÝïñáÝ" & vbCRLF _
                    & "APARTMENT:µÝ. 85" & vbCRLF _
                    & "ADDRESS:ì³ñ¹³Ý³Ýó" & vbCRLF _
                    & "BUILDNUM:îáõÝ" & vbCRLF _
                    & "EMAIL:artakhayrapetyan@gmail.com" & vbCRLF _
                    & "TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28" & vbCRLF _
                    & "ACSBRANCHINC:00" & vbCRLF _
                    & "ACSDEPARTINC:1" & vbCRLF _
                    & "CHRGACC:000001101" & vbCRLF _
                    & "TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28" & vbCRLF _
                    & "CHRGCUR:001" & vbCRLF _
                    & "CHRGCBCRS:400.0000/1" & vbCRLF _
                    & "PAYSCALE:05" & vbCRLF _
                    & "CHRGSUM:460" & vbCRLF _
                    & "PRSNT:3.0667" & vbCRLF _
                    & "CHRGINC:000919400" & vbCRLF _
                    & "CUPUSA:1" & vbCRLF _
                    & "CURTES:1" & vbCRLF _
                    & "CURVAIR:3" & vbCRLF _
                    & "TIME:"& groupCashOutput.chargeTab.timeForCheck & vbCRLF _
                    & "VOLORT:7" & vbCRLF _
                    & "NONREZ:1" & vbCRLF _
                    & "JURSTAT:21" & vbCRLF _
                    & "COMM:ÊÙµ³ÛÇÝ Î³ÝËÇÏ »Éù" & vbCRLF _
                    & "XSUM:100" & vbCRLF _
                    & "XCUR:000" & vbCRLF _
                    & "XACC:000001100" & vbCRLF _
                    & "XDLCRS:340/1" & vbCRLF _
                    & "XDLCRSNAME:000 / 001" & vbCRLF _
                    & "XCBCRS:400.0000/1" & vbCRLF _
                    & "XCBCRSNAME:000 / 001" & vbCRLF _
                    & "XCUPUSA:1" & vbCRLF _
                    & "XCURSUM:34000" & vbCRLF _
                    & "XSUMMAIN:14900" & vbCRLF _
                    & "XINC:000931900" & vbCRLF _
                    & "XEXP:001434300" & vbCRLF _
                    & ""
      fBODY = Replace(fBODY, "  ", "%")
      Call CheckDB_DOCS(groupCashOutput.fIsn,"KsRsOrPk","14",fBODY,1)
      Call CheckQueryRowCount("DOCS","fISN",groupCashOutput.fIsn,1)
	  
	     ' DOCLOG
      Call CheckQueryRowCount("DOCLOG","fISN",groupCashOutput.fIsn,5)
      Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","W","3"," ",1)
	     Call CheckDB_DOCLOG(groupCashOutput.fIsn,"77","M","14","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
          
      ' FOLDERS
      Call CheckQueryRowCount("FOLDERS","fISN",groupCashOutput.fIsn,0)

      ' HI
      With dbHI(0)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "1160000.00"
            .fCUR = "001"
            .fCURSUM = "2900.00"
            .fOP = "MSC"
            .fDBCR = "D"
            .fADB = "1196072159"
            .fACR = "1426146440"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²éÑ³ßÇí ·áõÙ³ñ                    0   400.0000    1                                                                        ìÉ³¹ÇÙÇñ úÑ³ÝÛ³Ý                "
            .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(1)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "1160000.00"
            .fCUR = "001"
            .fCURSUM = "2900.00"
            .fOP = "MSC"
            .fDBCR = "C"
            .fADB = "1196072159"
            .fACR = "1426146440"
            .fSPEC = groupCashOutput.commonTab.docNum & "051                ²éÑ³ßÇí ·áõÙ³ñ                    1   400.0000    1"
            .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(2)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "4800000.00"
            .fCUR = "001"
            .fCURSUM = "12000.00"
            .fOP = "MSC"
            .fDBCR = "D"
            .fADB = "1630171"
            .fACR = "1426146440"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ØÇçÝáñ¹³í×³ñ                      0   400.0000    1                                                                        ìÉ³¹ÇÙÇñ úÑ³ÝÛ³Ý                "
            .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(3)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "4800000.00"
            .fCUR = "001"
            .fCURSUM = "12000.00"
            .fOP = "MSC"
            .fDBCR = "C"
            .fADB = "1630171"
            .fACR = "1426146440"
            .fSPEC = groupCashOutput.commonTab.docNum & "051                ØÇçÝáñ¹³í×³ñ                      1   400.0000    1"
            .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(4)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "6000.00"
            .fCUR = "000"
            .fCURSUM = "6000.00"
            .fOP = "MSC"
            .fDBCR = "C"
            .fADB = "1196072159"
            .fACR = "1629177"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ºÏ³ÙáõïÝ»ñ ³ñï. ÷áË³Ý³ÏáõÙÇó      1     1.0000    1"
            .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(5)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "6000.00"
            .fCUR = "001"
            .fCURSUM = "0.00"
            .fOP = "MSC"
            .fDBCR = "D"
            .fADB = "1196072159"
            .fACR = "1629177"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ºÏ³ÙáõïÝ»ñ ³ñï. ÷áË³Ý³ÏáõÙÇó      0   400.0000    1"
            .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(6)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "34000.00"
            .fCUR = "001"
            .fCURSUM = "100.00"
            .fOP = "CEX"
            .fDBCR = "D"
            .fADB = "1196072159"
            .fACR = "1630170"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ²éÑ³ßÇí ·áõÙ³ñ                    1   340.0000    1"
            .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(7)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "34000.00"
            .fCUR = "000"
            .fCURSUM = "34000.00"
            .fOP = "CEX"
            .fDBCR = "C"
            .fADB = "1196072159"
            .fACR = "1630170"
            .fSPEC = groupCashOutput.commonTab.docNum & "051                ²éÑ³ßÇí ·áõÙ³ñ                    0     1.0000    1"
            .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(8)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "CE"
            .fSUM = "34000.00"
            .fCUR = "001"
            .fCURSUM = "100.00"
            .fOP = "PUR"
            .fDBCR = "D"
            .fADB = "-1"
            .fACR = "-1"
            .fSPEC =  "%"& groupCashOutput.commonTab.docNum & "7 "
            .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

      With dbHI(9)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "184000.00"
            .fCUR = "001"
            .fCURSUM = "460.00"
            .fOP = "FEX"
            .fDBCR = "D"
            .fADB = "1630171"
            .fACR = "1630420"
            .fSPEC = groupCashOutput.commonTab.docNum & "021                ÊÙµ³ÛÇÝ Î³ÝËÇÏ »Éù                1   400.0000    1"
            .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

	     Set dbHI(10) = New_DB_HI()
      With dbHI(10)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "01"
            .fSUM = "184000.00"
            .fCUR = "000"
            .fCURSUM = "184000.00"
            .fOP = "FEX"
            .fDBCR = "C"
            .fADB = "1630171"
            .fACR = "1630420"
            .fSPEC = groupCashOutput.commonTab.docNum & "                   ÊÙµ³ÛÇÝ Î³ÝËÇÏ »Éù                0     1.0000    1"
            .fBASEBRANCH = "00"
            .fBASEDEPART = "1"
      End With

	     Set dbHI(11) = New_DB_HI()
      With dbHI(11)
            .fBASE = groupCashOutput.fIsn
            .fDATE = todayDateSQL2
            .fTYPE = "CE"
            .fSUM = "184000.00"
            .fCUR = "001"
            .fCURSUM = "460.00"
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
  	   Call Check_DB_HI(dbHI(7),1)
  	   Call Check_DB_HI(dbHI(8),1)
  	   Call Check_DB_HI(dbHI(9),1)
  	   Call Check_DB_HI(dbHI(10),1)
  	   Call Check_DB_HI(dbHI(11),1)
      Call CheckQueryRowCount("HI","fBASE",groupCashOutput.fIsn,12)

      ' PAYMENTS
     	Set dbPAYMENTS(0) = New_DB_PAYMENTS()
      With dbPAYMENTS(0)
            .fISN = groupCashOutput.fIsn
            .fDOCTYPE = "KsRsOrPk"
            .fDATE = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y-%m-%d")
            .fSTATE = "14"
            .fDOCNUM = groupCashOutput.commonTab.docNum
            .fCLIENT = "00034856"
            .fACCDB = ""
            .fPAYER = "ìÉ³¹ÇÙÇñ úÑ³ÝÛ³Ý"
            .fCUR = "001"
            .fSUMMA = "15000.00"
            .fSUMMAAMD = "6000000.00"
            .fSUMMAUSD = "15000.00"
            .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ »Éù                                                                                                                        "
            .fPASSPORT = "OK514342110 210 01/07/2022"
            .fCOUNTRY = "AM"
            .fACSBRANCH = "00"
            .fACSDEPART = "1"
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
      Call CheckQueryRowCount("DOCLOG","fISN",groupCashOutput.fIsn,6)
      
      ' Փակել ծրագիրը
      Call Close_AsBank()
      
End Sub