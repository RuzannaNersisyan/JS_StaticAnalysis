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
' Test Case ID 152298

' "Փոխանցում իր հաշիվներով(ՀՏ 200)" փաստաթղթի ստեղծում, վավերացում բոլոր հաստատողներով, մերժում հաստատող2-ով
Sub SWIFT_Confirmphases2_HT200_Test()

      Dim fDATE, sDATE
      Dim TransferToHisAccounts, OpenSentTransfersFolder
      Dim confPath, confInput, docExist, folderName, agreementN, state, frmPttel, todayTime
      Dim queryString, sqlValue, colNum, sql_isEqual
      fDATE = "20250101"
      sDATE = "20030101"
      Call Initialize_AsBank("bank", sDATE, fDATE)
      
      Call Create_Connection()
      
      ' Մուտք գործել համակարգ ARMSOFT օգտագործողով 
      Login("ARMSOFT")
      
      ' Մուտք ադմինիստրատորի ԱՇՏ
      Call ChangeWorkspace(c_Admin)
      
      confPath = Project.Path & "Stores\SWIFT\Settings\SWIFT_Reject_HT200.txt"
      
      confInput = Input_Config(confPath)
      If Not confInput Then
          Log.Error("Կարգավորումները չեն ներմուծվել")
         Exit Sub
      End If
    
      Call SetParameter("SWIN", Project.Path & "Stores\SWIFT\HT200\ImportRJEfile\")
      
      ' Մուտք գործել համակարգ SWIFT օգտագործողով 
      Login("SWIFT")
      
      ' Մուտք S.W.I.F.T. ԱՇՏ
      Call ChangeWorkspace(c_SWIFT)
      
      ' Ստեղծել Փոխանցում իր հաշիվներով(ՀՏ 200) փաստաթուղթ
      Set TransferToHisAccounts = New_TransferToHisAccounts
      With TransferToHisAccounts
            .fISN = ""
            .acsBranch = ""
            .acsDepart = ""
            .docNum = ""
            .wDate = "010120"
            .rinStop = "A"
            .recOrgAcc = "003"
            .recOrg = "XASXAU2SXXX"
            .wSumma = "250000"
            .wCur = "001"
            .txKey = "1111"
            .wPackN = ""
            .addInfo = "/ACC/                              /INS/"
            .sendRec = "CITIAU2XRTG"
            .CorBankAcc = ""
            .CorBank = "001"
            .IntBankDataType = "A"
            .IntBankAcc = "/AT"
            .IntBank = "CITIAEAXTRD"
            .clcikBOrNo = True  
            .clcikBOrNo2 = True  
            .clcikBOrNo3 = True  
            .finOrginization(0).wCode = "XASXAU2SXXX"
            .finOrginization(0).wName = "ASX OPERATIONS PTY LIMITED"
            .finOrginization(0).wAddress = "20 BOND STREET"
            .finOrginization(0).wCountry = "AUSTRALIA"
            .finOrginization(0).wCity = "SYDNEY"
            .finOrginization(1).wCode= "CITIAU2XRTG"
            .finOrginization(1).wName = "CITIBANK LIMITED, SYDNEY"
            .finOrginization(1).wAddress = "1 MARGARET STREET"
            .finOrginization(1).wCountry = "AUSTRALIA"
            .finOrginization(1).wCity= "SYDNEY"
            .finOrginization(2).wCode = "CITIAEAXTRD"
            .finOrginization(2).wName = "CITIBANK N.A."
            .finOrginization(2).wAddress = ""
            .finOrginization(2).wCountry= "UNITED ARAB EMIRATES"
            .finOrginization(2).wCity= ""

      End With
      
      Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |Üáñ Ñ³Õáñ¹³·ñáõÃÛáõÝ|öáË³ÝóáõÙ Çñ Ñ³ßÇíÝ»ñáí (Ðî 200)")
      BuiltIn.Delay(2000)
      
      If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").Exists Then
            Log.Error( "Փոխանցում իր հաշիվներով ՀՏ200 փաստաթուղթը չի բացվել")
            Exit Sub
      End If
       
      Call Fill_TransferToHisAccounts(TransferToHisAccounts)
      
      Log.Message(TransferToHisAccounts.docNum)
      Log.Message(TransferToHisAccounts.fISN)
      
      todayTime = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"20%y%m%d")
      BuiltIn.Delay(2000)
      
                ' SQL ստուգում պայամանգիրը ստեղծելուց հետո: 
                ' DOCS
                queryString = " select COUNT(*) from DOCS where fISN = " & TransferToHisAccounts.fISN & _
                                          " and fNAME = 'MT200' and fSTATE = '9' and fCREATORSUID = '87' and fBODY  like '"  & vbCRLF _
                                         & "BMDOCNUM:"& TransferToHisAccounts.docNum  & vbCRLF _
                                         & "DATE:20200101"  & vbCRLF _
                                         & "RINSTOP:A"  & vbCRLF _
                                         & "RINSTID:003"  & vbCRLF _
                                         & "RECINST:XASXAU2SXXX"  & vbCRLF _
                                         & "SUMMA:250000"  & vbCRLF _
                                         & "CUR:001"  & vbCRLF _
                                         & "VERIFIED:0"  & vbCRLF _
                                         & "TXKEY:1111"  & vbCRLF _
                                         & "ADDINFO:/ACC/                              /INS/"  & vbCRLF _
                                         & "BMIODATE:"& todayTime  & vbCRLF _
                                         & "BMIOTIME:%%:%%"  & vbCRLF _
                                         & "RSBKMAIL:0"  & vbCRLF _
                                         & "DELIV:0"  & vbCRLF _
                                         & "USERID:  87"  & vbCRLF _
                                         & "SNDREC:CITIAU2XRTG"  & vbCRLF _
                                         & "PCORBANK:001"  & vbCRLF _
                                         & "MEDOP:A"  & vbCRLF _
                                         & "MEDID:/AT"  & vbCRLF _
                                         & "MEDBANK:CITIAEAXTRD"  & vbCRLF _
                                         & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'SW_MESSAGES
                queryString = " SELECT COUNT(*) FROM SW_MESSAGES WHERE fISN  = " & TransferToHisAccounts.fISN & _
                                          " and fMT = '200'  and fUSER = '87' and fAMOUNT = '250000.00' " & _
                                          " and fCUR = '001' and fAIM ='/ACC/' and fDOCNUM = " & TransferToHisAccounts.docNum
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
      docExist = SWIFT_Check_Doc_In_Sending_SecrOrd_Folder(TransferToHisAccounts.fISN)
      If Not docExist Then
            Log.Error("Փաստաթուղթը չի գտնվել ուղարկվող փոխանցումներ թղթապանակում")
            Exit Sub
      End If
      ' Փաստաթուղթն ուղարկել հաստատման
      Call Online_PaySys_Send_To_Verify(2)
      
      ' SQL ստուգում պայամանգիրը հաստատման ուղարկելուց հետո: 
                ' DOCS
                queryString = " select COUNT(*) from DOCS where fISN = " & TransferToHisAccounts.fISN & _
                                          " and fNAME = 'MT200' and fSTATE = '201' and fCREATORSUID = '87' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'SW_MESSAGES
                queryString = " SELECT COUNT(*) FROM SW_MESSAGES WHERE fISN  = " & TransferToHisAccounts.fISN & _
                                          " and fMT = '200'  and fUSER = '87' and fAMOUNT = '250000.00'  " & _
                                          " and fCUR = '001' and fAIM ='/ACC/' and fVERIFIED = '2' and fDOCNUM = " & TransferToHisAccounts.docNum
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If        
                
                'FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN  = " & TransferToHisAccounts.fISN & _
                                          " and fNAME = 'MT200' and fKEY = " & TransferToHisAccounts.docNum & _
                                          " and fSTATUS = '4' and fCOM = 'öáË³ÝóáõÙ Çñ Ñ³ßÇíÝ»ñáí' " 
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
      state = ConfirmContractDoc(1, TransferToHisAccounts.fISN, c_ToConfirm, 1, "Ð³ëï³ï»É")
      
      If Not state Then
            Log.Error("ՀՏ200  փաստաթուղթը չի գտնվել և չի վավերացվել")
            Exit Sub
      End If
      Set  frmPttel = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel")
      frmPttel.Close   
      
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN  = " & TransferToHisAccounts.fISN & _
                                          " and fNAME = 'MT200' and fSTATE = '204' and fCREATORSUID = '87'  " 
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
      state = CheckContractDoc(1, TransferToHisAccounts.fISN)
      
      If Not state Then
            Log.Error("Փաստաթուղթն առկա չէ Հաստատվող վճարային փաստաթղթեր թղթապանակում")
            Exit Sub 
      End If
      
      ' Մերժել ՀՏ200 փաստաթուղթը
      Call PaySys_Verify(False)
      frmPttel.Close  
    
                ' SW_MESSAGES
                queryString = " SELECT COUNT(*) FROM SW_MESSAGES WHERE fISN  = " & TransferToHisAccounts.fISN & _
                                          " and fMT = '200'  and fUSER = '87' and fAMOUNT = '250000.00' " & _
                                          " and fCUR = '001' and fAIM ='/ACC/' and fVERIFIED = '0' and fDOCNUM = " & TransferToHisAccounts.docNum
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If          
      
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN  = " & TransferToHisAccounts.fISN & _
                                          " and fNAME = 'MT200' and fSTATE = '9' and fCREATORSUID = '87' " 
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
      docExist = SWIFT_Check_Doc_In_Sending_SecrOrd_Folder(TransferToHisAccounts.fISN)
      If Not docExist Then
              Log.Error("Փաստաթուղթը չի գտնվել ուղարկվող փոխանցումներ թղթապանակում")
              Exit Sub
      End If
      ' Փաստաթուղթն ուղարկել հաստատման
      Call Online_PaySys_Send_To_Verify(2)
      
                ' SQL ստուգում պայամանգիրը հաստատման ուղարկելուց հետո: 
                ' DOCS
                queryString = " select COUNT(*) from DOCS where fISN = " & TransferToHisAccounts.fISN & _
                                          " and fNAME = 'MT200' and fSTATE = '201' and fCREATORSUID = '87' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'SW_MESSAGES
                queryString = " SELECT COUNT(*) FROM SW_MESSAGES WHERE fISN  = " & TransferToHisAccounts.fISN & _
                                          " and fMT = '200'  and fUSER = '87' and fAMOUNT = '250000.00' " & _
                                          " and fCUR = '001' and fAIM ='/ACC/' and fVERIFIED = '2' and fDOCNUM = " & TransferToHisAccounts.docNum
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
      state = ConfirmContractDoc(1, TransferToHisAccounts.fISN, c_ToConfirm, 1, "Ð³ëï³ï»É")
      
      If Not state Then
            Log.Error("ՀՏ200  փաստաթուղթը չի գտնվել և չի վավերացվել")
            Exit Sub
      End If
      frmPttel.Close  
      
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN  = " & TransferToHisAccounts.fISN & _
                                          " and fNAME = 'MT200' and fSTATE = '204' and fCREATORSUID = '87' " 
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
      state = ConfirmContractDoc(1, TransferToHisAccounts.fISN, c_ToConfirm, 1, "Ð³ëï³ï»É")
      
      If Not state Then
            Log.Error("ՀՏ200  փաստաթուղթը չի գտնվել և չի վավերացվել")
            Exit Sub
      End If
      frmPttel.Close  
      
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN  = " & TransferToHisAccounts.fISN & _
                                          " and fNAME = 'MT200' and fSTATE = '207' and fCREATORSUID = '87' " 
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
      state = ConfirmContractDoc(1, TransferToHisAccounts.fISN, c_ToConfirm, 1, "Ð³ëï³ï»É")
      
      If Not state Then
            Log.Error("ՀՏ200  փաստաթուղթը չի գտնվել և չի վավերացվել")
            Exit Sub
      End If
      frmPttel.Close  
      
                ' DOCS
                queryString = " select COUNT(*) from DOCS where fISN = " & TransferToHisAccounts.fISN & _
                                          " and fNAME = 'MT200' and fSTATE = '9' and fCREATORSUID = '87' "
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'SW_MESSAGES
                queryString = " SELECT COUNT(*) FROM SW_MESSAGES WHERE fISN  = " & TransferToHisAccounts.fISN & _
                                          " and fMT = '200'  and fUSER = '87' and fAMOUNT = '250000.00' " & _
                                          " and fCUR = '001' and fAIM ='/ACC/' and fVERIFIED = '1' and fDOCNUM = " & TransferToHisAccounts.docNum
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If        
      
       Login("ARMSOFT")
      Call ChangeWorkspace(c_SWIFT)
      ' Փաստաթղթի առկայության ստուգում Ուղարկվող փոխանցումներ թղթապանակում
      docExist = SWIFT_Check_Doc_In_Sending_SecrOrd_Folder(TransferToHisAccounts.fISN)
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