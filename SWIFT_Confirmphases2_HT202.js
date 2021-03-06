Option Explicit
'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Currency_Exchange_Confirmphases_Library
'USEUNIT CashInput_Confirmphases_Library
'USEUNIT SWIFT_Confirmphases_Library
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT Insurance_Agreement_Library
'USEUNIT BankMail_Library
' Test Case ID 153152

' "Փոխանցում իր հաշիվներով(ՀՏ 200)" փաստաթղթի ստեղծում, վավերացում բոլոր հաստատողներով, մերժում հաստատող2-ով
Sub SWIFT_Confirmphases2_HT202_Test()
  
      Dim fDATE, sDATE
      Dim confPath, confInput, folderName, frmPttel
      Dim InterbankTransfer, OpenSentTransfersFolder, docExist, agreementN, state, todayTime
      Dim queryString, sqlValue, colNum, sql_isEqual, isExists
      fDATE = "20250101"
      sDATE = "20130101"
      
      Call Initialize_AsBank("bank", sDATE, fDATE)
      
      Call Create_Connection()
      
      ' Մուտք գործել համակարգ ARMSOFT օգտագործողով 
      Login("ARMSOFT")
      
      ' Մուտք ադմինիստրատորի ԱՇՏ
      Call ChangeWorkspace(c_Admin)
      
      ' Պարամետրերին տալ արժեքներ
      Call SetParameter("SWIN", Project.Path & "Stores\SWIFT\HT202\ImportRJEfile\")
      Call SetParameter("IBANCHECKSOURCE", "2")
      Call SetParameter("IBANUPDATETYPE", "1")
      
      confPath = Project.Path & "Stores\SWIFT\Settings\SWIFT_Reject_HT200.txt"
      confInput = Input_Config(confPath)
      If Not confInput Then
          Log.Error("Կարգավորումները չեն ներմուծվել")
         Exit Sub
      End If
      
      todayTime = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
      ' Մուտք գործել համակարգ SWIFT օգտագործողով 
      Login("SWIFT")
      
      ' Մուտք S.W.I.F.T. ԱՇՏ
      Call ChangeWorkspace(c_SWIFT)
      
      Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |Üáñ Ñ³Õáñ¹³·ñáõÃÛáõÝ|ØÇçµ³ÝÏ³ÛÇÝ ÷áË³ÝóáõÙ (Ðî 202)")
      BuiltIn.Delay(2000)
      
      If Not wMDIClient.VBObject("frmASDocForm").Exists Then
            Log.Error( "Միջբանկային փոխանցում ՀՏ202 փաստաթուղթը չի բացվել")
            Exit Sub
      End If

      Set InterbankTransfer = New_InterbankTransfer()
      With InterbankTransfer
               ' Tab 1
              .InterbankTransferGeneral.FillTab = True
              .InterbankTransferGeneral.acsBranch = ""
              .InterbankTransferGeneral. acsDepart = ""
              .InterbankTransferGeneral.messSingleVal = ""
              .InterbankTransferGeneral.serviceType = "001"
              .InterbankTransferGeneral.MessType = "202"
              .InterbankTransferGeneral.wReference = "123456789"
              .InterbankTransferGeneral.wDate = todayTime
              .InterbankTransferGeneral.recOrgDataType = "A"
              .InterbankTransferGeneral.recOrgAcc = "BE71096123456769"
              .InterbankTransferGeneral.expectedMessage =  "BIC - GKCCBEBBXXX" & vbCRLF _
                                                                                                    &"ROUTING BIC - GKCCBEBBXXX"& vbCRLF _
                                                                                                    &"INSTITUTION NAME - BELFIUS BANQUE"
              .FinOrganization(0).wCode = "AAALSARIALK"
              .FinOrganization(0).wName= "SAUDI HOLLANDI BANK"
              .FinOrganization(0).wAddress = ""
              .FinOrganization(0).wCountry = ""
              .FinOrganization(0).wCity = "ALKHOBAR"
              .FinOrganization(1).wCode = "ABAUUAUXSIM"
              .FinOrganization(1).wName= "BANK"
              .FinOrganization(1).wAddress = "ST. R. LUXEMBURG 17"
              .FinOrganization(1).wCountry = "UKRAINE"
              .FinOrganization(1).wCity = "SIMFEROPOL"
              .InterbankTransferGeneral.wRecOrg = "AAALSARIALK"
              .InterbankTransferGeneral.recDataType = "D"
              .InterbankTransferGeneral.recAcc = "BE71096123456769"
              .InterbankTransferGeneral.wReceiver = "ABAUUAUXSIM"
              .InterbankTransferGeneral.expectedMessage2 =  "BIC - GKCCBEBBXXX" & vbCRLF _
                                                                                                    &"ROUTING BIC - GKCCBEBBXXX"& vbCRLF _
                                                                                                    &"INSTITUTION NAME - BELFIUS BANQUE"
              .InterbankTransferGeneral.wSumma = "5,000.00"
              .InterbankTransferGeneral.wCur = "001"
              .InterbankTransferGeneral.wTxKey = "1111"
              .InterbankTransferAdditional.FillTab = False
              ' Tab 3
              .InterbankTransferFinancialOrg.FillTab = True
              .InterbankTransferFinancialOrg.sendRec = "CITIATWXXXX"
              .InterbankTransferFinancialOrg.payOrgDataType = "A"
              .InterbankTransferFinancialOrg.payOrgAcc = "DK9520000123456789"
              .InterbankTransferFinancialOrg.expectedMessage3 =  "BIC - NDEADKKKXXX" & vbCRLF _
                                                                                                    &"ROUTING BIC - NDEADKKKXXX"& vbCRLF _
                                                                                                    &"INSTITUTION NAME - NORDEA"
              .InterbankTransferFinancialOrg.payingOrg = "CITIATWXXXX"
              .InterbankTransferFinancialOrg.payBankDataType = "B"
              .InterbankTransferFinancialOrg.payCorrAcc = "BA393385804800211234"
              .InterbankTransferFinancialOrg.expectedMessage4 =  "BIC - UNCRBA22XXX" & vbCRLF _
                                                                                                    &"ROUTING BIC - UNCRBA22XXX"& vbCRLF _
                                                                                                    &"INSTITUTION NAME - UniCredit Bank d.d. Mostar"
              .InterbankTransferFinancialOrg.payBankCorr = "XASXAU2SXXX"
              .InterbankTransferFinancialOrg.recBankDataType = "B"
              .InterbankTransferFinancialOrg.recCorrAcc = "BG18RZBB91550123456789"
              .InterbankTransferFinancialOrg.expectedMessage5 =  "BIC - RZBBBGSFXXX" & vbCRLF _
                                                                                                    &"ROUTING BIC - RZBBBGSFXXX"& vbCRLF _
                                                                                                    &"INSTITUTION NAME - RAIFFEISENBANK (BULGARIA) AD"
              .InterbankTransferFinancialOrg.recCorr = "AASIUS33XXX"
              .InterbankTransferFinancialOrg.medBankDataType = "A"
              .InterbankTransferFinancialOrg.medBankAcc = "GL8964710123456789"
              .InterbankTransferFinancialOrg.expectedMessage6 =  "BIC - GRENGLGXXXX" & vbCRLF _
                                                                                                    &"ROUTING BIC - GRENGLGXXXX"& vbCRLF _
                                                                                                    &"INSTITUTION NAME - GRONLANDSBANKEN A/S"
              .InterbankTransferFinancialOrg.medBank = "ANTBIT2P179"
              .FinOrganization(2).wCode = "CITIATWXXXX"
              .FinOrganization(2).wName= "CITIBANK INTERNATIONAL PLC - AUSTRIA BRANCH"
              .FinOrganization(2).wAddress = "LOTHRINGERSTRASSE 7"
              .FinOrganization(2).wCountry = "AUSTRIA"
              .FinOrganization(2).wCity = "VIENNA"
              .FinOrganization(3).wCode = "CITIATWXXXX"
              .FinOrganization(3).wName= "CITIBANK INTERNATIONAL PLC - AUSTRIA BRANCH"
              .FinOrganization(3).wAddress = "LOTHRINGERSTRASSE 7"
              .FinOrganization(3).wCountry = "AUSTRIA"
              .FinOrganization(3).wCity = "VIENNA"
              .FinOrganization(4).wCode = "XASXAU2SXXX"
              .FinOrganization(4).wName= "ASX OPERATIONS PTY LIMITED"
              .FinOrganization(4).wAddress = "20 BOND STREET"
              .FinOrganization(4).wCountry = "AUSTRALIA"
              .FinOrganization(4).wCity = "SYDNEY"
              .FinOrganization(5).wCode = "AASIUS33XXX"
              .FinOrganization(5).wName= "ABN AMRO SECURITIES (USA) INC."
              .FinOrganization(5).wAddress = "1325 AVENUE OF THE AMERICAS"
              .FinOrganization(5).wCountry = "UNITED STATES"
              .FinOrganization(5).wCity = "NEW YORK,NY"
              .FinOrganization(6).wCode = "ANTBIT2P179"
              .FinOrganization(6).wName= "BANCA ANTONIANA POPOLARE VENETA S.C.A.R.L."
              .FinOrganization(6).wAddress = "PZZA GIOVANNI XXIII, 24"
              .FinOrganization(6).wCountry = "ITALY"
              .FinOrganization(6).wCity = "CORNUDA"
              .clcikBOrNo = True
              .clcikBOrNo2 = True
              .clcikBOrNo3 = True
              .clcikBOrNo4 = True
              .clcikBOrNo5 = True
              .clcikBOrNo6 = True
              .clcikBOrNo7 = True

      End With
      
      Call CreateInterbankTransfer(InterbankTransfer)
      
      Log.Message("fISN = " & InterbankTransfer.fISN)
      Log.Message("docNumber = " & InterbankTransfer.docNum)
      
      todayTime = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"20%y%m%d")
      
       ' SQL ստուգում պայամանգիրը ստեղծելուց հետո: 
                ' DOCS
                queryString = " select COUNT(*) from DOCS where fISN = " & InterbankTransfer.fISN & _
                                          " and fNAME = 'MT202' and fSTATE = '9' and fCREATORSUID = '87' and fBODY  like '"  & vbCRLF _
                                      & "STID:001"  & vbCRLF _
                                      & "MT:202"  & vbCRLF _
                                      & "BMDOCNUM:"& InterbankTransfer.docNum  & vbCRLF _
                                      & "REF:123456789"  & vbCRLF _
                                      & "DATE:"& todayTime & vbCRLF _
                                      & "RINSTOP:A"  & vbCRLF _
                                      & "RINSTID:BE71096123456769"  & vbCRLF _
                                      & "RECINST:AAALSARIALK"  & vbCRLF _
                                      & "RECOP:D"  & vbCRLF _
                                      & "ACCCR:BE71096123456769"  & vbCRLF _
                                      & "RECEIVER:ABAUUAUXSIM"  & vbCRLF _
                                      & "SUMMA:5000"  & vbCRLF _
                                      & "CUR:001"  & vbCRLF _
                                      & "VERIFIED:0"  & vbCRLF _
                                      & "TXKEY:1111"  & vbCRLF _
                                      & "BMIODATE:"& todayTime  & vbCRLF _
                                      & "BMIOTIME:%%:%%"  & vbCRLF _
                                      & "RSBKMAIL:0"  & vbCRLF _
                                      & "DELIV:0"  & vbCRLF _
                                      & "USERID:  87"  & vbCRLF _
                                      & "SNDREC:CITIATWXXXX"  & vbCRLF _
                                      & "PINSTOP:A"  & vbCRLF _
                                      & "PINSTID:DK9520000123456789"  & vbCRLF _
                                      & "PAYINST:CITIATWXXXX"  & vbCRLF _
                                      & "PCOROP:B"  & vbCRLF _
                                      & "PCORID:BA393385804800211234"  & vbCRLF _
                                      & "PCORBANK:XASXAU2SXXX"  & vbCRLF _
                                      & "RCOROP:B"  & vbCRLF _
                                      & "RCORID:BG18RZBB91550123456789"  & vbCRLF _
                                      & "RCORBANK:AASIUS33XXX"  & vbCRLF _
                                      & "MEDOP:A"  & vbCRLF _
                                      & "MEDID:GL8964710123456789"  & vbCRLF _
                                      & "MEDBANK:ANTBIT2P179"  & vbCRLF _
                                      & "ISCOVER:0"  & vbCRLF _
                                      & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'SW_MESSAGES
                queryString = " SELECT COUNT(*) FROM SW_MESSAGES WHERE fISN  = " & InterbankTransfer.fISN & _
                                          " and fMT = '202'  and fUSER = '87' and fAMOUNT = '5000.00' " & _
                                          " and fCUR = '001' and fVERIFIED = '0' and fDOCNUM = " & InterbankTransfer.docNum
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If        

      ' Մուտք գործել համակարգ ARMSOFT օգտագործողով 
      Login("ARMSOFT")
           
      ' Մուտք S.W.I.F.T. ԱՇՏ
      Call ChangeWorkspace(c_SWIFT)
      ' Մուտք ուղարկվող փոխանցումներ թղթապանակ
      docExist = SWIFT_Check_Doc_In_Sending_SecrOrd_Folder(InterbankTransfer.fISN)
      If Not docExist Then
            Log.Error("Փաստաթուղթը չի գտնվել ուղարկվող փոխանցումներ թղթապանակում")
            Exit Sub
      End If
      ' Փաստաթուղթն ուղարկել հաստատման
      Call Online_PaySys_Send_To_Verify(2)
      
      ' SQL ստուգում պայամանգիրը հաստատման ուղարկելուց հետո: 
                ' DOCS
                queryString = " select COUNT(*) from DOCS where fISN = " & InterbankTransfer.fISN & _
                                          " and fNAME = 'MT202' and fSTATE = '201' and fCREATORSUID = '87' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'SW_MESSAGES
                queryString = " SELECT COUNT(*) FROM SW_MESSAGES WHERE fISN  = " & InterbankTransfer.fISN & _
                                          " and fMT = '202'  and fUSER = '87' and fAMOUNT = '5000.00' " & _
                                          " and fCUR = '001' and fVERIFIED = '2' and fDOCNUM = " & InterbankTransfer.docNum
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If        
                
                'FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN  = " & InterbankTransfer.fISN & _
                                          " and fNAME = 'MT202' and fKEY = " & InterbankTransfer.docNum & _
                                          " and fSTATUS = '4' and fCOM = 'ØÇçµ³ÝÏ³ÛÇÝ ÷áË³ÝóáõÙ' " 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If     
      
      Login("VERIFIER")
      
      FolderName = "|Ð³ëï³ïáÕ I ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      Call GoToFolder_ByDocNum(folderName, "USER", "^A[Del]")
      
      ' Վավերացնել ՀՏ200 փաստաթուղթը
      state = ConfirmContractDoc(1, InterbankTransfer.fISN, c_ToConfirm, 1, "Ð³ëï³ï»É")
      
      If Not state Then
            Log.Error("ՀՏ200  փաստաթուղթը չի գտնվել և չի վավերացվել")
            Exit Sub
      End If
      Set  frmPttel = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel")
      frmPttel.Close   
      
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN  = " & InterbankTransfer.fISN & _
                                          " and fNAME = 'MT202' and fSTATE = '204' and fCREATORSUID = '87' " 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If   
      
       Login("VERIFIER2")
      
      FolderName = "|Ð³ëï³ïáÕ II ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      Call GoToFolder_ByDocNum(folderName, "USER", "^A[Del]")
      
     ' Ստուգել ՀՏ200 փաստաթողի առկայությունը Հաստատվող վճարային փաստաթղթեր թղթապանակում
      state = CheckContractDoc(1, InterbankTransfer.fISN)
      
      If Not state Then
            Log.Error("Փաստաթուղթն առկա չէ Հաստատվող վճարային փաստաթղթեր թղթապանակում")
            Exit Sub 
      End If
      
      ' Մերժել ՀՏ200 փաստաթուղթը
      Call PaySys_Verify(False)
      frmPttel.Close  
    
                ' SW_MESSAGES
                queryString = " SELECT COUNT(*) FROM SW_MESSAGES WHERE fISN  = " & InterbankTransfer.fISN & _
                                          " and fMT = '202'  and fUSER = '87' and fAMOUNT = '5000.00' " & _
                                          " and fCUR = '001' and fVERIFIED = '0' and fDOCNUM = " & InterbankTransfer.docNum
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If          
      
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN  = " & InterbankTransfer.fISN & _
                                          " and fNAME = 'MT202' and fSTATE = '9' and fCREATORSUID = '87' " 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If   
                
      ' Մուտք գործել համակարգ ARMSOFT օգտագործողով 
      Login("ARMSOFT")
    
      ' Մուտք S.W.I.F.T. ԱՇՏ
      Call ChangeWorkspace(c_SWIFT)
        
      ' Մուտք ուղարկվող փոխանցումներ թղթապանակ
      docExist = SWIFT_Check_Doc_In_Sending_SecrOrd_Folder(InterbankTransfer.fISN)
      If Not docExist Then
              Log.Error("Փաստաթուղթը չի գտնվել ուղարկվող փոխանցումներ թղթապանակում")
              Exit Sub
      End If
      ' Փաստաթուղթն ուղարկել հաստատման
      Call Online_PaySys_Send_To_Verify(2)
      
                ' SQL ստուգում պայամանգիրը հաստատման ուղարկելուց հետո: 
                ' DOCS
                queryString = " select COUNT(*) from DOCS where fISN = " & InterbankTransfer.fISN & _
                                          " and fNAME = 'MT202' and fSTATE = '201' and fCREATORSUID = '87' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'SW_MESSAGES
                queryString = " SELECT COUNT(*) FROM SW_MESSAGES WHERE fISN  = " & InterbankTransfer.fISN & _
                                          " and fMT = '202'  and fUSER = '87' and fAMOUNT = '5000.00' " & _
                                          " and fCUR = '001' and fVERIFIED = '2' and fDOCNUM = " & InterbankTransfer.docNum
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If        
      
      Login("VERIFIER")
      
      FolderName = "|Ð³ëï³ïáÕ I ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      Call GoToFolder_ByDocNum(folderName, "USER", "^A[Del]")
      
      ' Վավերացնել ՀՏ200 փաստաթուղթը  Հաստատող1-ի կողմից
      state = ConfirmContractDoc(1, InterbankTransfer.fISN, c_ToConfirm, 1, "Ð³ëï³ï»É")
      
      If Not state Then
            Log.Error("ՀՏ200  փաստաթուղթը չի գտնվել և չի վավերացվել")
            Exit Sub
      End If
      frmPttel.Close  
      
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN  = " & InterbankTransfer.fISN & _
                                          " and fNAME = 'MT202' and fSTATE = '204' and fCREATORSUID = '87' " 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If  
      
      Login("VERIFIER2")
      
      FolderName = "|Ð³ëï³ïáÕ II ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      Call GoToFolder_ByDocNum(folderName, "USER", "^A[Del]")
      
      ' Վավերացնել ՀՏ200 փաստաթուղթը  Հաստատող2-ի կողմից
      state = ConfirmContractDoc(1, InterbankTransfer.fISN, c_ToConfirm, 1, "Ð³ëï³ï»É")
      
      If Not state Then
            Log.Error("ՀՏ200  փաստաթուղթը չի գտնվել և չի վավերացվել")
            Exit Sub
      End If
      frmPttel.Close  
      
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN  = " & InterbankTransfer.fISN & _
                                          " and fNAME = 'MT202' and fSTATE = '207' and fCREATORSUID = '87'  " 
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If  
      
      Login("VERIFIER3")
      
      FolderName = "|Ð³ëï³ïáÕ III ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
      Call GoToFolder_ByDocNum(folderName, "USER", "^A[Del]")
      
      ' Վավերացնել ՀՏ200 փաստաթուղթը Հաստատող3-ի կողմից
      state = ConfirmContractDoc(1, InterbankTransfer.fISN, c_ToConfirm, 1, "Ð³ëï³ï»É")
      
      If Not state Then
            Log.Error("ՀՏ200  փաստաթուղթը չի գտնվել և չի վավերացվել")
            Exit Sub
      End If
      frmPttel.Close  
      
                ' DOCS
                queryString = " select COUNT(*) from DOCS where fISN = " & InterbankTransfer.fISN & _
                                          " and fNAME = 'MT202' and fSTATE = '9' and fCREATORSUID = '87' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'SW_MESSAGES
                queryString = " SELECT COUNT(*) FROM SW_MESSAGES WHERE fISN  = " & InterbankTransfer.fISN & _
                                          " and fMT = '202'  and fUSER = '87' and fAMOUNT = '5000.00' " & _
                                          " and fCUR = '001' and fVERIFIED = '1' and fDOCNUM = " & InterbankTransfer.docNum
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If        
      
       Login("ARMSOFT")
      Call ChangeWorkspace(c_SWIFT)
      ' Փաստաթղթի առկայության ստուգում Ուղարկվող փոխանցումներ թղթապանակում
      docExist = SWIFT_Check_Doc_In_Sending_SecrOrd_Folder(InterbankTransfer.fISN)
      If Not docExist Then
          Log.Error("Փաստաթուղթն առկա չէ Ուղարկվող փոխանցումներ թղթապանակում")
          Exit Sub
      End If
    
      'Test CleanUp start
      ' Ջնջել փաստաթուղթը
      Call Online_PaySys_Delete_Agr()
      
      frmPttel.Close
    
      Call Close_AsBank()    
      
End Sub