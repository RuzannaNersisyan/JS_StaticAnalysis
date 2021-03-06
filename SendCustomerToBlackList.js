Option Explicit
'USEUNIT Clients_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT BankMail_Library
'USEUNIT Subsystems_Special_Library
'USEUNIT Mortgage_Library
'Test Case 156924

' Ֆիզիկական անձ Հաճախորդի ստեղծում և ուղարկում "Սև ցուցակ"
Sub Send_Physical_Person_To_BlackList_Test()

      Dim buttonName, fISN, cliCode, jurStat, socialCard, pasCode, passType, passBy, datePass, dateExpire, firstName, _
              lastName, patrName, rezident, cliNote, todayDMY, wName, wVolort, petBuj, gender, citizenship, bidthPlace,wCountry,_
              wDistrict, wCommunity, wCity, wStreet, buildNum, wApartment, wCountry2, wDistrict2, wCommunity2, _
              wCity2, wStreet2, buildNum2, wApartment2, wCheckBox, accStatForm, cardStatForm, sencAddress, _
              wMonth, wDay, fileName, fileName2, fileName3
      Dim ABlackListArrangement
      Dim colN, action, doNum, doActio, state, frmPttel, dacsType
      Dim folderDirect, rekvName, folderName, frmPttel2
      Dim  accType, curSum, fillOffSect, accISN, BalanceAcc, clName
      Dim dbtOrKrd, codVal, wAcc, wAccType, openDate, acsType, balAcc
      Dim docTypeName, commentName, todayTime
       Dim queryString, sqlValue, colNum, sql_isEqual

      Dim fDATE, sDATE
      
      fDATE = "20250101"
      sDATE = "20120101"
      Call Initialize_AsBank("bank", sDATE, fDATE)
      
      ' Մուտք գործել համակարգ ARMSOFT օգտագործողով 
      Call Create_Connection()
      Login("ARMSOFT")
      
      ' Մուտք ադմինիստրատորի ԱՇՏ4.0
      Call ChangeWorkspace(c_Admin40)
      
      Set ABlackListArrangement = New_BlackListArrangement(0)
      With ABlackListArrangement
      .thingsGrid(0, 0) = "9"
      .thingsGrid(0, 1) = "1"
      .thingsGrid(0, 2) = "0"
      .thingsGrid(0, 3) = "0"
      .thingsGrid(0, 4) = "0"
      .folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|Î³ñ·³íáñáõÙÝ»ñ ¨ ¹ñáõÛÃÝ»ñ|§ê¨ óáõó³ÏÇ¦ Ñ³ëï³ïíáÕ ·áñÍáÕáõÃÛáõÝÝ»ñ"
      End With
      
      Call Create_BlackListArrangement(ABlackListArrangement)

      ' Մուտք Հաճախորդի սպասարկում և դրամարկղ (Ընդլայնված) ԱՇՏ
      Call ChangeWorkspace(c_CustomerService)
      
      ' Մուտք Հաճախորդներ թղթապանակ 
      folderDirect = "|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Ð³×³Ëáñ¹Ý»ñ"
      folderName = "Հաճախորդներ"
      state = OpenFolderClickDo(folderDirect, folderName)
      
      If Not state Then
            Log.Error("Սխալ՝ Հաճախորդներ թղթապանակ մուտք գործելիս")
            Exit Sub
      End If
      
      buttonName = "RadioButton"
      jurStat = "21"
      socialCard = "2222222222"
      pasCode = "AN015362520"
      passType = "13"
      passBy = "021"
      datePass = "28092018"
      dateExpire = "28092028"
      firstName = "ê³Ý³ë³ñ"
      lastName = "ê³Ý³ë³ñÛ³Ý"
      patrName = "ê³Ý³ë³ñÇ"
      rezident = "1"
      cliNote = "2"
      todayDMY = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
      sencAddress = "1"
      gender = "M"
      citizenship = "1"
      bidthPlace = "AM"
      wCountry = "AM"
      wDistrict = "001"
      wCommunity = "010010635"
      wStreet = "²ñß³ÏáõÝÛ³ó"
      buildNum = "Þ»Ýù"
      wApartment = "11"
      wCountry2 = "AM"
      wDistrict2 = "001"
      wCommunity2 = "010010635"
      wStreet2 = "²ñß³ÏáõÝÛ³ó"
      buildNum2 = "Þ»Ýù"
      wApartment2 = "11"
      wCheckBox = 1
      wMonth = "1"
      wDay = "10"
      fileName = "\\host2\Sys\Testing\ClientsTest\AsDE4C.doc"
      fileName2 = "\\host2\Sys\Testing\ClientsTest\Capture.PNG"
      fileName3 = "\\host2\Sys\Testing\ClientsTest\ForTest.txt"
           
      ' Հաճախորդի ստեղծում
      Call CheckClient(buttonName, fISN, cliCode, jurStat, socialCard, pasCode, passType, passBy, datePass, dateExpire, firstName, _
                                        lastName, patrName, rezident, cliNote, todayDMY, wName, wVolort, petBuj, gender, citizenship, bidthPlace,wCountry,_
                                        wCommunity, wCity, wStreet, buildNum, wApartment, wCountry2, wCommunity2, _
                                        wCity2, wStreet2, buildNum2, wApartment2, wCheckBox, accStatForm, cardStatForm, sencAddress, _
                                        todayDMY, wMonth, wDay, fileName, fileName2, fileName3)
      
      Log.Message(cliCode)
      Log.Message(fISN)
      BuiltIn.Delay(5000)
      
      ' Ստուգում որ հաճախորդը ստեղծվել է
      colN = 0
      state = CheckContractDoc(colN, cliCode)
      
      If Not state Then
            Log.Error("Հաճախորդի փաստաթուղթը չի ստեղծվել")
            Exit Sub
      End If
      todayTime = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"20%y%m%d")
      ' SQL ստուգում պայամանգիրը ստեղծելուց հետո: 
                ' DOCS
                queryString = " select COUNT(*) from DOCS where fISN = " & fISN & _
                                          " and fNAME = 'Cli' and fSTATE = '2' and fNEXTTRANS = '1' and fBODY = '"  & vbCRLF _
                                         & "RESETCASHREM:0" & vbCRLF _
                                         & "CODE:"& cliCode  & vbCRLF _
                                         & "GENCODE:0"  & vbCRLF _
                                         & "JURSTAT:21"  & vbCRLF _
                                         & "REGNUM:2222222222"  & vbCRLF _
                                         & "REGNTYPE:2"  & vbCRLF _
                                         & "PASCODE:AN015362520"  & vbCRLF _
                                         & "PASTYPE:13"  & vbCRLF _
                                         & "PASBY:021"  & vbCRLF _
                                         & "DATEPASS:20180928"  & vbCRLF _
                                         & "DATEEXPIRE:20280928"  & vbCRLF _
                                         & "BLREP:0"  & vbCRLF _
                                         & "FIRSTNAME:ê³Ý³ë³ñ"  & vbCRLF _
                                         & "LASTNAME:ê³Ý³ë³ñÛ³Ý"  & vbCRLF _
                                         & "PATRNAME:ê³Ý³ë³ñÇ"  & vbCRLF _
                                         & "NAME:ê³Ý³ë³ñ ê³Ý³ë³ñÛ³Ý ê³Ý³ë³ñÇ"  & vbCRLF _
                                         & "COINCIDENCE:0"  & vbCRLF _
                                         & "VOLORT:7"  & vbCRLF _
                                         & "PETBUJ:2"  & vbCRLF _
                                         & "REZ:1"  & vbCRLF _
                                         & "REZCOUNTRY:AM"  & vbCRLF _
                                         & "RELBANK:0"  & vbCRLF _
                                         & "RABBANK:0"  & vbCRLF _
                                         & "DATOTK:" & todayTime  & vbCRLF _
                                         & "ACSBRANCH:00"  & vbCRLF _
                                         & "ACSDEPART:1"  & vbCRLF _
                                         & "ACSTYPE:00"  & vbCRLF _
                                         & "CLINOTE:2"  & vbCRLF _
                                         & "OWNTYPE:4"  & vbCRLF _
                                         & "ELCONN:0"  & vbCRLF _
                                         & "GENDER:M"  & vbCRLF _
                                         & "CITIZENSHIP:1"  & vbCRLF _
                                         & "CITIZEN:AM"  & vbCRLF _
                                         & "BIRTHPLACE:AM"  & vbCRLF _
                                         & "COUNTRY:AM"  & vbCRLF _
                                         & "DISTRICT:001"  & vbCRLF _
                                         & "COMMUNITY:010010635"  & vbCRLF _
                                         & "CITY:ºñ¨³Ý"  & vbCRLF _
                                         & "ECITY:Yerevan"  & vbCRLF _
                                         & "STREET:²ñß³ÏáõÝÛ³ó"  & vbCRLF _
                                         & "BUILDNUM:Þ»Ýù"  & vbCRLF _
                                         & "APARTMENT:11"  & vbCRLF _
                                         & "ADDRESS:²ñß³ÏáõÝÛ³ó Þ»Ýù,11"  & vbCRLF _
                                         & "COUNTRY2:AM"  & vbCRLF _
                                         & "DISTRICT2:001"  & vbCRLF _
                                         & "COMMUNITY2:010010635"  & vbCRLF _
                                         & "CITY2:ºñ¨³Ý"  & vbCRLF _
                                         & "ECITY2:Yerevan"  & vbCRLF _
                                         & "STREET2:²ñß³ÏáõÝÛ³ó"  & vbCRLF _
                                         & "BUILDNUM2:Þ»Ýù"  & vbCRLF _
                                         & "APARTMENT2:11"  & vbCRLF _
                                         & "ADDRESS2:²ñß³ÏáõÝÛ³ó Þ»Ýù,11"  & vbCRLF _
                                         & "PERIODICDLV:1"  & vbCRLF _
                                         & "DLVSTM:1"  & vbCRLF _
                                         & "DLVCRDSTM:1"  & vbCRLF _
                                         & "DLVDEPSTM:1"  & vbCRLF _
                                         & "SENDSTMADRS:1"  & vbCRLF _
                                         & "SDATE:"& todayTime  & vbCRLF _
                                         & "PERIODICITY:1/10"  & vbCRLF _
                                         & "CLISECSTATGIVE:0" & vbCRLF _
                                         & "SMSSENDER:0"  & vbCRLF _
                                         & "SMSRATESCB:0"  & vbCRLF _
                                         & "SMSRATESDL:0"  & vbCRLF _
                                         & "SMSRATESCS:0"  & vbCRLF _
                                         & "SMSREM:0"  & vbCRLF _
                                         & "SMSPCARDDATE:0"  & vbCRLF _
                                         & "SMSLOANREPAY:0"  & vbCRLF _
                                         & "SMSSTATE:0"  & vbCRLF _
                                         & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                     Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'CLIENTS
                queryString = " SELECT COUNT(*) FROM CLIENTS WHERE fISN  = " & fISN & _
                                          " and fCODE = '"& cliCode &"' and fCAPTIONLONG = 'ê³Ý³ë³ñ ê³Ý³ë³ñÛ³Ý ê³Ý³ë³ñÇ' " & _
                                          " and fADDRESS = '²ñß³ÏáõÝÛ³ó Þ»Ýù,11' and fJURSTAT = '21' and fVOLORT = '7'" & _
                                          "and fPETBUJ = '2' and fREZ = '1' and fPASCODE = 'AN015362520' and fCAPTION = 'ê³Ý³ë³ñ ê³Ý³ë³ñÛ³Ý ê³Ý³ë³ñÇ'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If     
     
               'DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN  = " & fISN & _
                                          " and fSUIDCOR = '-1' and fDCRID = '0'  " & _
                                          " and ((fOP = 'N' and fSTATE = '1')" & _
                                          " or (fOP = 'C' and fSTATE = '2'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If     
                
                'DOCP
                queryString = " SELECT COUNT(*) FROM DOCP WHERE fPARENTISN  = " & fISN & _
                                          " and fNAME = 'REMINDER'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If     
                
                'FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN  = " & fISN & _
                                          " and fSTATUS = '1' and fNAME = 'Cli' " & _
                                          "and ((fCOM = '        Ð³×³Ëáñ¹Ç ù³ñï- "& cliCode &"' and fSPEC = 'ê³Ý³ë³ñ ê³Ý³ë³ñÛ³Ý ê³Ý³ë³ñÇ                                                          ')" & _
                                          "or (fCOM = 'Ð³×³Ëáñ¹' and fSPEC = '"& todayTime &" 1/ 10 0                                                                       1111²ñß³ÏáõÝÛ³ó Þ»Ýù,11                                                   000000000000000000000000ºñ¨³Ý                         ºñ¨³Ý'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If  
      
                'DOCSATTACH
                queryString = " SELECT COUNT(*) FROM DOCSATTACH WHERE fISN  = " & fISN & _
                                          " and (fFILE = 'AsDE4C.doc' or fFILE = 'Capture.PNG' or fFILE = 'ForTest.txt')"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If   
                
      ' Ստեղծել հաշիվ
      accType = "01"
      curSum = "000"
      fillOffSect = "1"
      balAcc = "3022000"
      dbtOrKrd = "2"
      wAccType = "01"
      acsType = "99"
      Call CreateAccount(accType, curSum, dacsType, fillOffSect, accISN, balAcc, clName, dbtOrKrd, codVal, wAccType, openDate, wAcc, acsType)
      Log.Message(accISN)
      BuiltIn.Delay(1500)
      
              
                ' ACCOUNTS
                queryString = " SELECT COUNT(*) FROM ACCOUNTS WHERE fISN  = " & accISN & _
                                          " and fCAPTION = 'ê³Ý³ë³ñ ê³Ý³ë³ñÛ³Ý ê³Ý³ë³ñÇ' " &_
                                          " and fCUR = '000' and fDC = '2' and fCLICODE = '"& cliCode &"' and fBALACC = '3022000 '"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If  
                
                'DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN  = " & accISN & _
                                          " and fSUIDCOR = '-1' and fDCRID = '0' " & _
                                          "and ((fOP = 'N' and fSTATE = '1') " & _
                                          "or (fOP = 'C' and fSTATE = '2'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If   
                
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN  = " & accISN & _
                                          " and fNAME = 'Acc' and fSTATE = '2' and fNEXTTRANS = '1' and fBODY = '"  & vbCRLF _
                                          & "CLIMAINACC:0"  & vbCRLF _
                                          & "BALACC:3022000"  & vbCRLF _
                                          & "CLICOD:"& cliCode  & vbCRLF _
                                          & "NAME:ê³Ý³ë³ñ ê³Ý³ë³ñÛ³Ý ê³Ý³ë³ñÇ"  & vbCRLF _
                                          & "DK:2"  & vbCRLF _
                                          & "CODVAL:000"  & vbCRLF _
                                          & "ACCTYPE:01"  & vbCRLF _
                                          & "DATOTK:" & todayTime  & vbCRLF _
                                          & "CODE:"& wAcc  & vbCRLF _
                                          & "BLREP:0"  & vbCRLF _
                                          & "ACSBRANCH:00"  & vbCRLF _
                                          & "ACSDEPART:1"  & vbCRLF _
                                          & "ACSTYPE:99"  & vbCRLF _
                                          & "ULIMIT:999999999999.99"  & vbCRLF _
                                          & "CASHAC:0"  & vbCRLF _
                                          & "BALACC2:999999"  & vbCRLF _
                                          & "BALACC3:999999"  & vbCRLF _
                                          & "FROZEN:0"  & vbCRLF _
                                          & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If   
                
                'FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN  = " & accISN & _
                                          " and fSTATUS = '1' and fNAME = 'Acc     ' " & _
                                          " and (fCOM = '  Ð³ßÇí' and fSPEC = '"& wAcc &"  ²ñÅ.- 000  îÇå- 01  Ð/Ð³ßÇí- 3022000   ²Ýí³ÝáõÙ-ê³Ý³ë³ñ ê³Ý³ë³ñÛ³Ý ê³Ý³ë³ñÇ')"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If   
                
                'HIREST
                queryString = " SELECT COUNT(*) FROM HIREST WHERE fOBJECT  = " & accISN & _
                                          " and fTYPE = '01' and fREM = '0.00'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If   

      ' Հաճախորդին գրանցել սև ցուցակում
      colN = 0
      action = c_FreBlackLock & "|" & c_RegToBlackList
      doNum = 2
      doActio = "Î³ï³ñ»É"
      state = ConfirmContractDoc(colN, cliCode, action, doNum, doActio)
      
      If Not state Then
            Log.Error("Հաճախորդը չի գրանցվել սև ցուցակում")
            Exit Sub
      End If
      
      Set frmPttel = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel")
      Call Close_Pttel("frmPttel")
      BuiltIn.Delay(2000)
      
                'BLACKLIST
                queryString = " SELECT COUNT(*) FROM BLACKLIST WHERE fPASSPORT  = '" & pasCode &"'"& _
                                          " and fNAME = 'ê²Ü²ê²ð' and fNAME2 = 'ê²Ü²ê²ðÚ²Ü' and fNAME3 = 'ê²Ü²ê²ðÆ' "& _
                                          "and fADDRESS = 'ºð¨²Ü ²ðÞ²ÎàôÜÚ²ò ÞºÜø,11' and fCLICODE = '"& cliCode &"' and fUNCHANGEDNAME = 'ê³Ý³ë³ñ ê³Ý³ë³ñÛ³Ý ê³Ý³ë³ñÇ'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If   
      
      ' Մուտք Սև ցուցակ հաստատողի ԱՇՏ
      Call ChangeWorkspace(c_BLVerifyer)
      ' Մուտք Սև ցուցակի" հաստատվող գործողություններ
      Call wTreeView.DblClickItem("|§ê¨ óáõó³Ï¦ Ñ³ëï³ïáÕÇ ²Þî|§ê¨ óáõó³ÏÇ¦ Ñ³ëï³ïíáÕ ·áñÍáÕáõÃÛáõÝÝ»ñ")
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
      ' Մերժել փաստաթուղթը
      Call ActionWithDocument("frmPttel", 7, pasCode, "Մերժել ", 2, "Î³ï³ñ»É")
      BuiltIn.Delay(1500)
      
       Call Close_Pttel("frmPttel")
      
                'BLACKLIST
                queryString = " SELECT COUNT(*) FROM BLACKLIST WHERE fPASSPORT  = '" & pasCode &"'"
                sqlValue = 0
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If   
                
       ' Մուտք ադմինիստրատորի Հաճախորդի սպասարկում և դրամարկղ (Ընդլայնված) ԱՇՏ
      Call ChangeWorkspace(c_CustomerService)
      
      ' Մուտք Հաճախորդներ թղթապանակ
      folderDirect = "|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Ð³×³Ëáñ¹Ý»ñ"
      rekvName = "CLIMASK"
      folderName = "Հաճախորդներ"
      state = OpenFolder(folderDirect, folderName, rekvName, cliCode)
      
      If Not state Then
            Log.Error("Սխալ՝ հաճախորդներ թղթապանակ մուտք գործելիս")
            Exit Sub
      End If
      
      ' Հաճախորդին գրանցել սև ցուցակում
      colN = 0
      action = c_FreBlackLock & "|" & c_RegToBlackList
      doNum = 2
      doActio = "Î³ï³ñ»É"
      state = ConfirmContractDoc(colN, cliCode, action, doNum, doActio)
      
                'BLACKLIST
                queryString = " SELECT COUNT(*) FROM BLACKLIST WHERE fPASSPORT  = '" & pasCode &"'" & _
                                          " and fNAME = 'ê²Ü²ê²ð' and fNAME2 = 'ê²Ü²ê²ðÚ²Ü' and fNAME3 = 'ê²Ü²ê²ðÆ' "& _
                                          "and fADDRESS = 'ºð¨²Ü ²ðÞ²ÎàôÜÚ²ò ÞºÜø,11' and fCLICODE = '"& cliCode &"' and fUNCHANGEDNAME = 'ê³Ý³ë³ñ ê³Ý³ë³ñÛ³Ý ê³Ý³ë³ñÇ'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If  
      
      If Not state Then
            Log.Error("Հաճախորդը չի գրանցվել սև ցուցակում")
            Exit Sub
      End If
      
      Call Close_Pttel("frmPttel")
      BuiltIn.Delay(2000) 
      
      ' Մուտք Սև ցուցակ հաստատողի ԱՇՏ
      Call ChangeWorkspace(c_BLVerifyer)
      ' Մուտք Հաճախորդներ թղթապանակ 
      Call wTreeView.DblClickItem("|§ê¨ óáõó³Ï¦ Ñ³ëï³ïáÕÇ ²Þî|§ê¨ óáõó³ÏÇ¦ Ñ³ëï³ïíáÕ ·áñÍáÕáõÃÛáõÝÝ»ñ")
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
      ' Հաստատել փաստաթուղթը
      Call ActionWithDocument("frmPttel", 7, pasCode, "Հաստատել ", 5, "²Ûá")
      Call Close_Pttel("frmPttel")

                'BLACKLIST
                queryString = " SELECT COUNT(*) FROM BLACKLIST WHERE fPASSPORT  = '" & pasCode &"'"& _
                                          " and fNAME = 'ê²Ü²ê²ð' and fNAME2 = 'ê²Ü²ê²ðÚ²Ü' and fNAME3 = 'ê²Ü²ê²ðÆ' and fSTATE = '1' "& _
                                          "and fADDRESS = 'ºð¨²Ü ²ðÞ²ÎàôÜÚ²ò ÞºÜø,11' and fCLICODE = '"& cliCode &"' and fUNCHANGEDNAME = 'ê³Ý³ë³ñ ê³Ý³ë³ñÛ³Ý ê³Ý³ë³ñÇ'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If  
                
      ' Մուտք Սև ցուցակ վարողի ԱՇՏ
      Call ChangeWorkspace(c_BLKeeper)
      BuiltIn.Delay(2000)
      
      ' Մուտք Սև ցուցակ թղթապանակ    
      folderDirect = "|§ê¨ óáõó³Ï¦ í³ñáÕÇ ²Þî|§ê¨ óáõó³Ï¦"
      rekvName = "CLICODE1"
      folderName = "Սև ցուցակ"
      state =  OpenFolder(folderDirect, folderName, rekvName, cliCode)
      
      If Not state Then
            Log.Error("Սխալ՝ Սև ցուցակ թղթապանակ մուտք գործելիս")
            Exit Sub
      End If
      BuiltIn.Delay(2000)
      
      ' Ջնջել հաճախորդին սև ցուցակից
      colN = 12
      action = c_Delete
      state = ConfirmContractDoc(colN, cliCode, action, doNum, doActio)
      
      If Not state Then
            Log.Error("Հաճախորդը չի գտնվել և չի ջնջվել")
            Exit Sub
      End If
      
      BuiltIn.Delay(4000) 
      Call Close_Pttel("frmPttel")
      BuiltIn.Delay(2000) 
      
                'BLACKLIST
                queryString = " SELECT COUNT(*) FROM BLACKLIST WHERE fPASSPORT  = '" & pasCode &"'"
                sqlValue = 0
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                    Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If  
      
      ' Մուտք ադմինիստրատորի Հաճախորդի սպասարկում և դրամարկղ (Ընդլայնված) ԱՇՏ
      Call ChangeWorkspace(c_CustomerService)
      
      ' Մուտք Հաճախորդներ թղթապանակ
      folderDirect = "|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Ð³×³Ëáñ¹Ý»ñ"
      rekvName = "CLIMASK"
      folderName = "Հաճախորդներ"
      state = OpenFolder(folderDirect, folderName, rekvName, cliCode)
      
      If Not state Then
            Log.Error("Սխալ՝ հաճախորդներ թղթապանակ մուտք գործելիս")
            Exit Sub
      End If
      
      ' Փնտրել Հաշիվ փաստաթուղթը
      docTypeName = "  Ð³ßÇí"
      commentName = wAcc & "  ²ñÅ.- 000  îÇå- 01  Ð/Ð³ßÇí- "& balAcc &"   ²Ýí³ÝáõÙ-ê³Ý³ë³ñ ê³Ý³ë³ñÛ³Ý ê³Ý³ë³ñÇ"
      state = CheckPayOrderAvailableOrNot(docTypeName, commentName)
      
      If Not state Then
            Log.Error("Հաշիվ փաստաթուղթը չի գտնվել և չի ջնջվել")
            Exit Sub
      End If
      
      ' Ջնջել Հաշիվ փասատթուղթը 
      Call DelDoc()
      
      BuiltIn.Delay(1000)
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").Close
      
      ' Հաճախորդ փաստաթղթի ջնջում
      Call DelDoc()

      Call Close_Pttel("frmPttel")
      
      ' Փակել ՀԾ-Բանկ ծրագիրը
      Call Close_AsBank
      
End Sub