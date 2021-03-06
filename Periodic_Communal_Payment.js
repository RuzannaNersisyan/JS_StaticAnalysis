Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT Library_Colour
'USEUNIT Library_Contracts
'USEUNIT Library_Periodic_Actions
'USEUNIT Subsystems_Special_Library
'USEUNIT Clients_Library
'USEUNIT BankMail_Library
'USEUNIT Payment_Except_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Comunal_Library

' Test Case ID 171251

' Գործողությունների կատարում Պարբերական կոմունալ վճարումների պայմանագրի հետ
Sub Periodic_Communal_Payment_Test()
           
      Dim DateStart, DateEnd, isExists
      Dim folderName, communalPay, workingDocs, communalPayDoc, changeRequests
      Dim commPaymentFolder, commISN, acsBranch, acsDepart, maxSum, addJob, wStatus
      Dim queryString, sqlValue, colNum, sql_isEqual, commDocNum, garbagePath, waterPath
      Dim frmPttel, status, dateTimeNow, fileName1, fileName2, savePath, viewPayment, param
      
      DateStart = "20120101"
      DateEnd = "20240101"
      Call Initialize_AsBankQA(DateStart, DateEnd) 
      Call Create_Connection()
      
      ' Մուտք գործել համակարգ ARMSOFT օգտագործողով 
      Login("ARMSOFT")
      dateTimeNow = aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d%m%y")
      
      Call  SetParameter("PCPLASTDAY", "31")
      Call  SetParameter("PCPSTARTDAY", "1")
      
      ' Մուտք գործել համակարգ ARMSOFT օգտագործողով 
      Login("ARMSOFT")
            
      ' Կատարում է ստուգում,եթե նման անունով ֆայլ կա տրված թղթապանակում ,ջնջում է
      isExists = aqFile.Exists(Project.Path & "Stores\Communal\Actual\Water\PBWT0923.dbf")
      If isExists Then
        aqFileSystem.DeleteFile(Project.Path & "Stores\Communal\Actual\Water\PBWT0923.dbf")
      End If
      
      ' Կատարում է ստուգում,եթե նման անունով ֆայլ կա տրված թղթապանակում ,ջնջում է
      isExists = aqFile.Exists(Project.Path & "Stores\Communal\Actual\Garbage\PRM230921.dbf")
      If isExists Then
        aqFileSystem.DeleteFile(Project.Path & "Stores\Communal\Actual\Garbage\PRM230921.dbf")
      End If
      
      
      waterPath = Project.Path & "Stores\Communal\Actual\Water\"
      garbagePath = Project.Path & "Stores\Communal\Actual\Garbage\"
      Call ChangeWorkspace(c_ComPay)
      
      'Արտահնման ճանապարհի կարգավորում
      wTreeView.DblClickItem("|ÎáÙáõÝ³É í×³ñáõÙÝ»ñÇ ²Þî|æñÇ í×³ñáõÙÝ»ñ|æñÇ í×³ñáõÙÝ»ñÇ Ï³ñ·³íáñáõÙÝ»ñ")
      With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
          .Row = 0
          .Col = 5
          .Keys(waterPath)
          Call ClickCmdButton(1, "Î³ï³ñ»É")
      End With
  
      wTreeView.DblClickItem("|ÎáÙáõÝ³É í×³ñáõÙÝ»ñÇ ²Þî|²Õµ³Ñ³ÝÙ³Ý í×³ñáõÙÝ»ñ|²Õµ³Ñ³ÝÙ³Ý í×³ñáõÙÝ»ñÇ Ï³ñ·³íáñáõÙÝ»ñ")
      With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
          .Row = 0
          .Col = 4
          .Keys(garbagePath)
          Call ClickCmdButton(1, "Î³ï³ñ»É")
      End With 
       
      folderName = "|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ ²Þî|"
      Call ChangeWorkspace(c_PeriodicActions)
      
      Set communalPay = New_CommunalPayment(2)
      With communalPay
      .general.office = "P00"
			.general.department = "08"
			.general.client = "00002248"
			.general.maxPrice = "50000"
      .general.services(0).Num = "1"
			.general.services(0).service = "WN"
			.general.services(0).place = "01"
			.general.services(0).clientN = "9-1-1"
			.general.services(0).minPrice = ""
			.general.services(0).maxPrice = "2000" 
      .general.services(1).Num = "2"
			.general.services(1).service = "R"
			.general.services(1).place = "9"
			.general.services(1).clientN = "10007"
			.general.services(1).minPrice = ""
			.general.services(1).maxPrice = "7000" 
      .other.openDate = "010821"
			.other.lastDate = "010124"
      .other.payDays = "12"
      .other.payDays_to = "28"
			.other.informClient = 1
			.other.useClientEmail = 1
			.other.accsConnentScheme = "001"
			.other.useClientScheme = 1
			.other.useCardAccs = 0
			.other.addInfo = "For Test"
			.other.lastOpersDate = ""
			.other.lastCompletedDate = ""
			.other.closeDate = ""
      End With
      
      Call Create_CommunalPayment(folderName, communalPay)
      
      Log.Message(communalPay.fisn)
      Log.Message(communalPay.docNum)
      
               'DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & communalPay.fisn & _
                                         " and fSUID = '10' and fOP = 'N' and fSTATE = '1' and fSUIDCOR = '-1'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & communalPay.fisn & _
                                          " and fNAME = 'PCPAGR' " &_
                                          " and ((fCOM = 'ä³ñµ»ñ³Ï³Ý ÏáÙáõÝ³É í×³ñáõÙÝ»ñÇ å³ÛÙ³Ý³·Çñ' and fECOM = 'Periodic communal payments agreement' and fSPEC = '²Ùë³ÃÇí- 01/08/21 N- "&communalPay.docNum&" [Üáñ]')" &_
                                          " or (fCOM = 'ä³ñµ»ñ³Ï³Ý ÏáÙáõÝ³É í×³ñáõÙÝ»ñÇ å³ÛÙ³Ý³·Çñ' and fECOM = 'Periodic communal payments agreement' and fSPEC = '"&communalPay.docNum&"1660000224820100                            0.00000Üáñ                                                   10Ð³×³Ëáñ¹ 00002248                                                                               ä³ñµ»ñ³Ï³Ý ÏáÙáõÝ³É í×³ñáõÙÝ»ñÇ å³ÛÙ³Ý³·Çñ')" &_
                                          " or (fCOM = 'Ð³×³Ëáñ¹ 00002248' and fECOM = 'Client 00002248' and fSPEC = '1   000022482021080120240101122810          50000.00110022482010000000011000000000000000000000000'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'DOCSG
                queryString = " SELECT COUNT(*) FROM DOCSG WHERE fISN = " & communalPay.fisn
                sqlValue = 18
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & communalPay.fisn & _
                                         " and fNAME = 'PCPAGR' and fSTATE = '1' and fNEXTTRANS = '1' and fBODY = '"& vbCRLF _ 
                                        & "ACSBRANCH:P00" & vbCRLF _
                                        & "ACSDEPART:08" & vbCRLF _
                                        & "USERID:10" & vbCRLF _
                                        & "CODE:" & communalPay.docNum & vbCRLF _
                                        & "CLICODE:00002248" & vbCRLF _
                                        & "NAME:Ð³×³Ëáñ¹ 00002248" & vbCRLF _
                                        & "ENAME:Client 00002248" & vbCRLF _
                                        & "FEEACC:00224820100" & vbCRLF _
                                        & "FEECUR:000" & vbCRLF _
                                        & "MAXSUM:50000" & vbCRLF _
                                        & "SDATE:20210801" & vbCRLF _
                                        & "EDATE:20240101" & vbCRLF _
                                        & "SDAY:12" & vbCRLF _
                                        & "LDAY:28" & vbCRLF _
                                        & "CLINOT:1" & vbCRLF _
                                        & "USECLIEMAIL:1" & vbCRLF _
                                        & "ACCCONNECT:001" & vbCRLF _
                                        & "USECLISCH:1" & vbCRLF _
                                        & "FEEFROMCARD:0" & vbCRLF _
                                        & "COMM:For Test" & vbCRLF _ 
                                        & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
      ' Մուտք 'Աշխատանքային փաստաթղթեր' թղթապանակ
      Set workingDocs = New_PeriodicWorkingDocuments()
      With workingDocs
          .startDate = "010721"
  				.endDate = "010124"
  				.curr = "000"
  				.office = "P00"
  				.section = "08"
      End With
      
		  Call GoTo_PeriodicWorkingDocuments(folderName, workingDocs)

      ' Վավերացնել փաստաթուղթը
      Call DocValidate(communalPay.docNum)
      
      BuiltIn.Delay(2000)
      Set frmPttel = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel")
      frmPttel.Close
      
                'DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & communalPay.fisn & _
                                          " and fSUID = '10' and fSUIDCOR = '-1'" & _ 
                                          " and ((fOP = 'N' and fSTATE = '1')" & _ 
                                          " or (fOP = 'W' and fSTATE = '2')" & _ 
                                          " or (fOP = 'C' and fSTATE = '7'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & communalPay.fisn & _
                                          " and fNAME = 'PCPAGR  ' and fSTATUS = '1'" &_
                                          " and ((fCOM = 'ä³ñµ»ñ³Ï³Ý ÏáÙáõÝ³É í×³ñáõÙÝ»ñÇ å³ÛÙ³Ý³·Çñ' and fSPEC = '²Ùë³ÃÇí- 01/08/21 N- "& communalPay.docNum &" [Ð³ëï³ïí³Í]' and fECOM = 'Periodic communal payments agreement')" &_
                                          " or (fCOM = 'Ð³×³Ëáñ¹ 00002248' and fSPEC = '7   000022482021080120240101122810          50000.00110022482010000000011000000000000000000000000' and fECOM = 'Client 00002248') )"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & communalPay.fisn & _
                                         " and fNAME = 'PCPAGR' and fSTATE = '7' and fNEXTTRANS = '1'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'PERIODIC_COMMUNAL
                queryString = " SELECT COUNT(*) FROM PERIODIC_COMMUNAL WHERE fISN = " & communalPay.fisn & _
                                         " and ((fROWID = '2' and fSYS = 'R' and fLOCATION = '9' and fCODE = '10007' and fABONENT = 'Ø³ÝáõÏÛ³Ý ì³É»ñÇÏ' and fADDRESS = 'î³íñ. 21 ÷. 1' and fMIN = '0.00' and fMAX = '7000.00' and fPAID = '0.00' and fCOMPLETED = '0' and fJUR = '0')" &_
                                         " or (fROWID = '1' and fSYS = 'WN' and fLOCATION = '01' and fCODE = '9-1-1' and fABONENT = 'ºðºì²ÜÆ ÎàÜÚ²ÎÆ ¶àðÌ²ð²Ü ö´À' and fADDRESS = 'Æê²ÎàìÆ 2 2' and fMIN = '0.00' and fMAX = '2000.00' and fPAID = '0.00' and fCOMPLETED = '0' and fJUR = '1'))" 
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
      ' Մուտք"Պարբերական գործողությունների պայմանագրեր/Կոմունալ վճ. պայմանագրեր" թղթապանակ
      Set communalPayDoc = New_CommunalPayDoc()
      With communalPayDoc
          .folderName = "|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ ²Þî|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ|ÎáÙáõÝ³É í×. å³ÛÙ³Ý³·ñ»ñ"
          .wClient = "00002248"
          .wBranch = "P00"
          .wDepart = "08"
      End With
      
      Call Fill_CommunalPayDoc(communalPayDoc)
      
      ' Պայմանագրի առկայության ստուգում 
      status = CheckContractDoc(0, communalPay.docNum)
      
      If Not status Then
            Log.Error"Պայմանագիրն առկա չէ 'Պարբերական կոմունալ վճարումների պայմանագրեր' թղթապանակում " ,,,ErrorColor
            Exit Sub  
      End If 
      
      Log.Message("Ստուգել վճարման օրերը")
      fileName1 = Project.Path &  "Stores\Periodic Communal Payment\PaymentErrAct.txt"
      fileName2 = Project.Path &  "Stores\Periodic Communal Payment\PaymentErrExp.txt"
      savePath = Project.Path &  "Stores\Periodic Communal Payment\"
      folderName = "PaymentErrAct"
      param = "(ISN: .............)|(N.......)"
       ' Վճարման կատարում սխալի հաղորդագրությամբ
      Call PaymentWithError("090921", 1, 1, savePath, folderName, fileName2, fileName1, param)

      BuiltIn.Delay(2000)
      ' Խմբագրել Պարբերական կոմունալ վճարումների պայմանագիրը
      Call wMainForm.MainMenu.Click(c_AllActions)    
      Call wMainForm.PopupMenu.Click(c_ToEdit)
      
      If wMDIClient.WaitVBObject("frmASDocForm", 2000).Exists Then
          ' Գրասենյակ դաշտի լրացում
    		  Call Rekvizit_Fill("Document", 1, "General", "ACSBRANCH", "P02")
    		  ' Բաժին դաշտի լրացում
    		  Call Rekvizit_Fill("Document", 1, "General", "ACSDEPART", "02")
    		  ' Առավելագույն գումար դաշտի լրացում
    		  Call Rekvizit_Fill("Document", 1, "General", "MAXSUM", "100000")
          ' Վերջին ամսաթիվ դաշտի լրացում
    		  Call Rekvizit_Fill("Document", 2, "General", "EDATE", "310721")
          ' Սեղմել "Կատարել" կոճակը
          Call ClickCmdButton(1, "Î³ï³ñ»É")
          
          If  MessageExists(2, "´³óÙ³Ý ³Ùë³ÃÇíÁ Ù»Í ¿ ì»ñçÇ ³Ùë³ÃíÇó:"& vbCrLf & "ä³ÛÙ³Ý³·Çñ N:"& communalPay.docNum &" (ISN: "& communalPay.fisn &")") Then
              ' Սեղմել "OK" կոճակը
              Call ClickCmdButton(5, "OK")  
          Else
              Log.Error"Սխալի հաղորդագրության պատուհանը չի բացվել" ,,,ErrorColor
          End If
          
          ' Վերջին ամսաթիվ դաշտի լրացում
    		  Call Rekvizit_Fill("Document", 2, "General", "EDATE", "010122")
          ' Վճարման օրեր սկիզբ դաշտի լրացում
      		Call Rekvizit_Fill("Document", 2, "General", "SDAY", "1")
      		' Վճարման օրեր վերջ դաշտի լրացում
      		Call Rekvizit_Fill("Document", 2, "General", "LDAY", "31")
          
          ' Սեղմել "Կատարել" կոճակը
          Call ClickCmdButton(1, "Î³ï³ñ»É")
          
          If  MessageExists(2, "ö³ëï³ÃÕÃÇ ÷á÷áËÙ³Ý Ñ³ÛïÁ áõÕ³ñÏí³Í ¿ Ñ³ëï³ïÙ³Ý") Then
              ' Սեղմել "OK" կոճակը
              Call ClickCmdButton(5, "OK")  
          Else
              Log.Error"Հաղորդագրության պատուհանը չի բացվել" ,,,ErrorColor
          End If
          
      Else  
            Log.Error"Պայմանագիրը չի բացվել խմբագրվելու համար " ,,,ErrorColor
      End If
      
      BuiltIn.Delay(1000)
      frmPttel.Close
      
                'DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & communalPay.fisn & _
                                          " and fSUID = '10' and fSUIDCOR = '-1'" & _ 
                                          " and ((fOP = 'N' and fSTATE = '1')" & _ 
                                          " or (fOP = 'W' and fSTATE = '2')" & _ 
                                          " or (fOP = 'C' and fSTATE = '7')" & _ 
                                          " or (fOP = 'M' and fSTATE = '7'))"
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'DCR
                queryString = " SELECT COUNT(*) FROM DCR WHERE fISN = " & communalPay.fisn & _
                                          " and fSUID = '10' and fSTATE = '0'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & communalPay.fisn & _
                                         " and fNAME = 'PCPAGR' and fSTATE = '7' and fNEXTTRANS = '1'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 

      ' Մուտք Փոփոխման հայտեր թղթապանակ
      Set changeRequests = New_ChangeRequests()
      With changeRequests
          .state = "0"
  				.startDate = "010120"
  				.endDate = "010124"
      End With
      
      folderName = "|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ ²Þî|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ|"
      Call GoTo_ChangeRequests(folderName, changeRequests)
      
      ' Վավերացնել փաստաթուղթը փոփոխման հայտեր թղթապանակից
      status = ActionWithDocument("frmPttel", 8, communalPay.docNum, c_ToVerify, 2, "Î³ï³ñ»É")
      
      If Not status Then
            Log.Error"Պայմանագիրն առկա չէ 'Պարբերական պայմանագրերի Փոփոխման հայտեր' թղթապանակում " ,,,ErrorColor
      End If
      
      BuiltIn.Delay(1500)
      frmPttel.Close
      
                'DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & communalPay.fisn & _
                                          " and fSUID = '10' and fSUIDCOR = '-1' " & _
                                          " and ((fOP = 'N' and fSTATE = '1')" & _
                                          " or (fOP = 'W' and fSTATE = '2')" & _
                                          " or (fOP = 'C' and fSTATE = '7')" & _
                                          " or (fOP = 'M' and fSTATE = '7') " & _
                                          " or (fOP = 'M' and fSTATE = '7'))"
                sqlValue = 5
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'DCR
                queryString = " SELECT COUNT(*) FROM DCR WHERE fISN = " & communalPay.fisn & _
                                          " and fSUID = '10' and fSTATE = '1'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & communalPay.fisn & _
                                         " and fNAME = 'PCPAGR' and fSTATE = '7' and fNEXTTRANS = '1' and fBODY = '" & vbCRLF _
                                      & "ACSBRANCH:P02" & vbCRLF _
                                      & "ACSDEPART:02" & vbCRLF _
                                      & "USERID:10" & vbCRLF _
                                      & "CODE:" & communalPay.docNum & vbCRLF _
                                      & "CLICODE:00002248" & vbCRLF _
                                      & "NAME:Ð³×³Ëáñ¹ 00002248" & vbCRLF _
                                      & "ENAME:Client 00002248" & vbCRLF _
                                      & "FEEACC:00224820100" & vbCRLF _
                                      & "FEECUR:000" & vbCRLF _
                                      & "MAXSUM:100000" & vbCRLF _
                                      & "SDATE:20210801" & vbCRLF _
                                      & "EDATE:20220101" & vbCRLF _
                                      & "SDAY:1" & vbCRLF _
                                      & "LDAY:31" & vbCRLF _
                                      & "CLINOT:1" & vbCRLF _
                                      & "USECLIEMAIL:1" & vbCRLF _
                                      & "ACCCONNECT:001" & vbCRLF _
                                      & "USECLISCH:1" & vbCRLF _
                                      & "FEEFROMCARD:0" & vbCRLF _
                                      & "COMM:For Test" & vbCRLF _
                                      & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & communalPay.fisn & _
                                          " and fNAME = 'PCPAGR' "& _
                                          " and ((fCOM = 'ä³ñµ»ñ³Ï³Ý ÏáÙáõÝ³É í×³ñáõÙÝ»ñÇ å³ÛÙ³Ý³·Çñ' and fECOM = 'Periodic communal payments agreement' and fSPEC = '²Ùë³ÃÇí- 01/08/21 N- " & communalPay.docNum &" [Ð³ëï³ïí³Í]') "& _
                                          " or (fCOM = 'Ð³×³Ëáñ¹ 00002248' and fECOM = 'Client 00002248' and fSPEC = '7   000022482021080120220101 13110         100000.00110022482010000000011000000000000000000000000'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
      ' Մուտք"Պարբերական գործողությունների պայմանագրեր/Կոմունալ վճ. պայմանագրեր" թղթապանակ
      Set communalPayDoc = New_CommunalPayDoc()
      With communalPayDoc
          .folderName = "|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ ²Þî|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ|ÎáÙáõÝ³É í×. å³ÛÙ³Ý³·ñ»ñ"
          .wClient = "00002248"
          .wBranch = "P02"
          .wDepart = "02"
      End With
      
      Call Fill_CommunalPayDoc(communalPayDoc)
      
      ' Պայմանագրի առկայության ստուգում 
      status = CheckContractDoc(0, communalPay.docNum)
      
      If Not status Then
            Log.Error"Պայմանագիրն առկա չէ 'Պարբերական կոմունալ վճարումների պայմանագրեր' թղթապանակում " ,,,ErrorColor
      End If 
      
      ' Ստուգել որ պայմանագրի դաշտերը խմբագրվել են
      acsBranch = wMDIClient.VBObject("frmPttel").GetColumnIndex("fACSBRANCH")
      acsDepart = wMDIClient.VBObject("frmPttel").GetColumnIndex("fACSDEPART")
      maxSum = wMDIClient.VBObject("frmPttel").GetColumnIndex("fMAXSUM")
      If Not (Trim(frmPttel.VBObject("TDBGView").Columns.Item(acsBranch)) = "P02" and Trim(frmPttel.VBObject("TDBGView").Columns.Item(acsDepart)) = "02" and Trim(frmPttel.VBObject("TDBGView").Columns.Item(maxSum)) = "100,000.00") Then
            Log.Error"Պայմանագրի դաշտերը չեն խմբագրվել " ,,,ErrorColor
      End If
      
      Log.Message("Վճարման կատարում սխալի հաղորդագրությամբ, երբ վճարումը դուրս է պայմանագրի ժամկետի սահմաններից")
      fileName1 = Project.Path &  "Stores\Periodic Communal Payment\PayWithIncorrectDateAct.txt"
      fileName2 = Project.Path &  "Stores\Periodic Communal Payment\PayWithIncorrectDateExp.txt"
      savePath = Project.Path &  "Stores\Periodic Communal Payment\"
      folderName = "PayWithIncorrectDateAct"
      Call PaymentWithError("020122", 1, 1, savePath, folderName, fileName2, fileName1, param)
      
      ' Կատարել վճարում 
      Call MakePayment("230921", 1, 0)
      
      ' Պարբերական կոմունալ վճարումների դիտում
      Set viewPayment = New_ViewPayment()
      With viewPayment
              .stDate = "010821"
              .eDate = "010124"
              .wBranch = "P02"
              .wDepart = "02"
      End With
      
      Call Fill_ViewPayment(viewPayment)
      
      If Not Trim(wMDIClient.VBObject("frmPttel_2").VBObject("TDBGView").Columns.Item(3)) = "9,000.00" Then
             Log.Error("Վճարված գումարը պետք է կազմի 9000 դրամ"),,,ErrorColor
      End If
      
      ' Ստանալ վճարման փաստաթղթի ISN-ը
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_View)
      BuiltIn.Delay(1500)
      commISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN
      commDocNum = wMDIClient.VBObject("frmASDocForm").vbObject("TabFrame").VBObject(GetVBObject("DOCNUM", wMDIClient.VBObject("frmASDocForm"))).Text
      Call ClickCmdButton(1, "OK")      
      Log.Message("Կոմունալ վճարման փաստաթղթի ISN` " & commISN)
      Log.Message("Կոմունալ վճարման փաստաթղթի համարը ՝ " & commDocNum)

      BuiltIn.Delay(1000)
      wMDIClient.VBObject("frmPttel_2").Close
      frmPttel.Close
      
                'COM_PAYMENTS
                queryString = " SELECT COUNT(*) FROM COM_PAYMENTS WHERE fISN = " & commISN & _
                                          " and ((fNUMBER = '0' and fTYPE = 'WN' and fLOCATION = '01' and fCODE = '9-1-1' and fAMOUNT = '2000.00' and fNAME = 'ºðºì²ÜÆ ÎàÜÚ²ÎÆ ¶àðÌ²ð²Ü ö´À' and fADDRESS = 'Æê²ÎàìÆ 2 2' and fBRANCH = 'P02' and fDEPART = '02') "&_
                                          " or (fNUMBER = '1' and fTYPE = 'R ' and fLOCATION = '9' and fCODE = '10007' and fAMOUNT = '7000.00' and fNAME = 'Ø³ÝáõÏÛ³Ý ì³É»ñÇÏ' and fADDRESS = 'î³íñ. 21 ÷. 1' and fBRANCH = 'P02' and fDEPART = '02'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
                'DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & communalPay.fisn & _
                                          " and fSUID = '10' and fSUIDCOR = '-1'" & _ 
                                          " and ((fOP = 'N' and fSTATE = '1')" & _ 
                                          " or (fOP = 'W' and fSTATE = '2')" & _ 
                                          " or (fOP = 'C' and fSTATE = '7')" & _ 
                                          " or (fOP = 'M' and fSTATE = '7')" & _ 
                                          " or (fOP = 'M' and fSTATE = '7')" & _ 
                                          " or (fOP = 'E' and fSTATE = '7' ))"
                sqlValue = 6
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & communalPay.fisn & _
                                         " and fNAME = 'PCPAGR' and fSTATE = '7' and fNEXTTRANS = '1' and fBODY = '" & vbCRLF _
                                        & "ACSBRANCH:P02" & vbCRLF _
                                        & "ACSDEPART:02" & vbCRLF _
                                        & "USERID:10" & vbCRLF _
                                        & "CODE:" & communalPay.docNum & vbCRLF _
                                        & "CLICODE:00002248" & vbCRLF _
                                        & "NAME:Ð³×³Ëáñ¹ 00002248" & vbCRLF _
                                        & "ENAME:Client 00002248" & vbCRLF _
                                        & "FEEACC:00224820100" & vbCRLF _
                                        & "FEECUR:000" & vbCRLF _
                                        & "MAXSUM:100000" & vbCRLF _
                                        & "SDATE:20210801" & vbCRLF _
                                        & "EDATE:20220101" & vbCRLF _
                                        & "SDAY:1" & vbCRLF _
                                        & "LDAY:31" & vbCRLF _
                                        & "CLINOT:1" & vbCRLF _
                                        & "USECLIEMAIL:1" & vbCRLF _
                                        & "ACCCONNECT:001" & vbCRLF _
                                        & "USECLISCH:1" & vbCRLF _
                                        & "FEEFROMCARD:0" & vbCRLF _
                                        & "COMM:For Test" & vbCRLF _
                                        & "LASTOPDATE:20210923" & vbCRLF _
                                        & "LASTCOMPLETE:20210923" & vbCRLF _
                                        & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & communalPay.fisn & _
                                          " and fNAME = 'PCPAGR' " & _
                                          " and ((fCOM = 'ä³ñµ»ñ³Ï³Ý ÏáÙáõÝ³É í×³ñáõÙÝ»ñÇ å³ÛÙ³Ý³·Çñ' and fECOM = 'Periodic communal payments agreement' and fSPEC = '²Ùë³ÃÇí- 01/08/21 N- 000001 [Ð³ëï³ïí³Í]') "&_
                                          " or (fCOM = 'Ð³×³Ëáñ¹ 00002248' and fECOM = 'Client 00002248' and fSPEC = '7   000022482021080120220101 13110         100000.00110022482010000000011202109232021092300000000'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'FOLDERS
                queryString = " SELECT COUNT(*) FROM FOLDERS WHERE fISN = " & commISN & _
                                          " and fCOM = 'ÎáÙáõÝ³É í×³ñáõÙÝ»ñÇ Ñ³ÝÓÝ³ñ³ñ³·Çñ' and fECOM = ''  and fNAME = 'ComGrPay'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'DOCLOG
                queryString = " SELECT COUNT(*) FROM DOCLOG WHERE fISN = " & commISN & _
                                          " and fSUID = '10' and fSUIDCOR = '-1'"& _
                                         " and ((fOP = 'N' and fSTATE = '3')"& _
                                         " or (fOP = 'M' and fSTATE = '3' and fCOM = '¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ')"& _
                                         " or (fOP = 'C' and fSTATE = '11'))"
                sqlValue = 3
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'HI
                queryString = " SELECT COUNT(*) FROM HI WHERE fBASE = " & commISN & _
                                          " and fTYPE = '01' and fCUR = '000' and fOP = 'MSC' and fBASEBRANCH = 'P02' and fBASEDEPART = '02' "& _
                                          " and ((fSUM = '7000.00' and fCURSUM = '7000.00' and (fDBCR = 'D' or fDBCR = 'C')) "& _
                                          " or (fSUM = '2000.00' and fCURSUM = '2000.00' and (fDBCR = 'D' or fDBCR = 'C')))"
                sqlValue = 4
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'PAYMENTS
                queryString = " SELECT COUNT(*) FROM PAYMENTS WHERE fISN = " & commISN & _
                                          " and fDOCTYPE = 'ComGrPay' and fCUR = '000'and fCOM = 'ÎáÙáõÝ³É í×³ñáõÙ/Utility Payment' "& _
                                          " and ((fSUMMA = '2000.00' and fSUMMAAMD = '2000.00' and fSUMMAUSD = '4.82') "& _
                                          " or (fSUMMA = '7000.00' and fSUMMAAMD = '7000.00' and fSUMMAUSD = '16.8699'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'PERIODIC_COMMUNAL
                queryString = " SELECT COUNT(*) FROM PERIODIC_COMMUNAL WHERE fISN = " & communalPay.fisn & _
                                          " and fMIN = '0.00' and fCOMPLETED = '1'"& _
                                          " and ((fROWID = '2' and fSYS = 'R' and fLOCATION = '9' and fCODE = '10007' and fABONENT = 'Ø³ÝáõÏÛ³Ý ì³É»ñÇÏ' and fADDRESS = 'î³íñ. 21 ÷. 1'  and fMAX = '7000.00' and fPAID = '7000.00'  and fJUR = '0')"& _
                                          " or (fROWID = '1' and fSYS = 'WN' and fLOCATION = '01' and fCODE = '9-1-1' and fABONENT = 'ºðºì²ÜÆ ÎàÜÚ²ÎÆ ¶àðÌ²ð²Ü ö´À' and fADDRESS = 'Æê²ÎàìÆ 2 2'  and fMAX = '2000.00' and fPAID = '2000.00'  and fJUR = '1'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
      ' Մուտք կոմունալ վճարումներ ԱՇՏ
      Call ChangeWorkspace(c_ComPay)
      
      ' Մուտք կոմունալ վճարումներ թղթապանակ
      Set commPaymentFolder = New_CommPaymentFolder()
      With commPaymentFolder
          .folderName = "|ÎáÙáõÝ³É í×³ñáõÙÝ»ñÇ ²Þî|ÎáÙáõÝ³É í×³ñáõÙÝ»ñ"
          .stDate = "010121"
          .eDate = "010124"
          .wType = "R"
          .wLocation = "9"
          .wCode = "10007"
          .wAddress = "î³íñ. 21 ÷. 1"
          .wName = "Ø³ÝáõÏÛ³Ý ì³É»ñÇÏ"
          .wISN = commISN
          .wBranch = "P02"
          .wDepart = "02"
      End With
      
      Call Fill_CommPaymentFolder(commPaymentFolder)
      
      status = CheckContractDoc(23, commISN)
      
       If  status Then
             ' Արտահանել տվյալները գործողության կատարում
            Call wMainForm.MainMenu.Click(c_AllActions)
            Call wMainForm.PopupMenu.Click(c_ExportData)
      
            fileName1 = Project.Path &  "Stores\Periodic Communal Payment\CommPaymentAct_1.txt"
            fileName2 = Project.Path &  "Stores\Periodic Communal Payment\CommPaymentExp.txt"
            savePath = Project.Path &  "Stores\Periodic Communal Payment\"

            BuiltIn.Delay(2000)
            Call wMainForm.MainMenu.Click("Պատուհաններ|2  Տվյալների արտահանման սխալներ")
            
            If wMDIClient.WaitVBObject("FrmSpr", 3000).Exists Then
                  ' Հիշել քաղվածքը
                  Call SaveDoc(savePath, "CommPaymentAct_1")

                  ' Համեմատել ֆայլերը
                  Call Compare_Files(fileName2, fileName1, "")
            
                  BuiltIn.Delay(1000)
                  wMDIClient.VBObject("FrmSpr").Close
            Else    
                  Log.Error"Տվյալների արտահանման սխալներ հաղորդագրությունը չի բացվել " ,,,ErrorColor
            End If
            
           ' Մարել (առանձին) գործողության կատարում
           BuiltIn.Delay(1000)
           Call ComunalRepaySingle("240921")
           BuiltIn.Delay(2000)
           frmPttel.Close
       
      Else
             Log.Error("Կոմունալ վճարման պայմանագիրն առկա չէ 'Կոմունալ վճարումներ' թղթապանակում "),,,ErrorColor
      End If
      
               'COM_PAYMENTS
                queryString = " SELECT COUNT(*) FROM COM_PAYMENTS WHERE fISN = " & commISN & _
                                          " and ((fNUMBER = '0' and fTYPE = 'WN' and fLOCATION = '01' and fCODE = '9-1-1' and fAMOUNT = '2000.00' and fNAME = 'ºðºì²ÜÆ ÎàÜÚ²ÎÆ ¶àðÌ²ð²Ü ö´À' and fADDRESS = 'Æê²ÎàìÆ 2 2' and fBRANCH = 'P02' and fDEPART = '02' and fDEBT = '6840.01') "&_
                                          " or (fNUMBER = '1' and fTYPE = 'R ' and fLOCATION = '9' and fCODE = '10007' and fAMOUNT = '7000.00' and fNAME = 'Ø³ÝáõÏÛ³Ý ì³É»ñÇÏ' and fADDRESS = 'î³íñ. 21 ÷. 1' and fBRANCH = 'P02' and fDEPART = '02' and fDEBT = '13350.00'))"
                sqlValue = 2
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
      
                
                'DOCS
                queryString = " SELECT COUNT(*) FROM DOCS WHERE fISN = " & commISN & _
                                         " and fSTATE = '11' and fNEXTTRANS = '1' and fBODY = '" & vbCRLF _
                                        & "ACSBRANCH:P02" & vbCRLF _
                                        & "ACSDEPART:02" & vbCRLF _
                                        & "TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28" & vbCRLF _
                                        & "USERID:  10" & vbCRLF _
                                        & "DOCNUM:"& commDocNum & vbCRLF _
                                        & "DATE:20210923" & vbCRLF _
                                        & "ACCDB:00224820100" & vbCRLF _
                                        & "CUR:000" & vbCRLF _
                                        & "CLICODE:00002248" & vbCRLF _
                                        & "FORM:0" & vbCRLF _
                                        & "PAYSYSIN:ä" & vbCRLF _
                                        & "SYSCASE:PCP" & vbCRLF _
                                        & "PARENTPC:"& communalPay.fisn & vbCRLF _
                                        & "PCPCOMPLETE:1" & vbCRLF _
                                        & "PAYER:Ð³×³Ëáñ¹ 00002248" & vbCRLF _
                                        & "TOTAL:9000" & vbCRLF _
                                        & "AIM:ÎáÙáõÝ³É í×³ñáõÙ/Utility Payment" & vbCRLF _
                                        & "NOTSENDABLE:0" & vbCRLF _
                                        & "CANCELREQ:0" & vbCRLF _
                                        & "'"
                sqlValue = 1
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 
                
                'FOLDERS
                queryString = " SELECT COUNT(*) FROM DOCSG WHERE fISN = " & commISN 
                sqlValue = 125
                colNum = 0
                sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
                If Not sql_isEqual Then
                  Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
                End If 

      ' Մուտք կոմունալ վճարումներ թղթապանակ
      Set commPaymentFolder = New_CommPaymentFolder()
      With commPaymentFolder
          .folderName = "|ÎáÙáõÝ³É í×³ñáõÙÝ»ñÇ ²Þî|ÎáÙáõÝ³É í×³ñáõÙÝ»ñ"
          .stDate = "010121"
          .eDate = "010124"
          .wType = "WN"
          .wCode = "9-1-1"
          .wAddress = "Æê²ÎàìÆ 2 2"
          .wName = "ºðºì²ÜÆ ÎàÜÚ²ÎÆ ¶àðÌ²ð²Ü ö´À"
          .wISN = commISN
          .wBranch = "P02"
          .wDepart = "02"
      End With
      
      Call Fill_CommPaymentFolder(commPaymentFolder)
      
      status = CheckContractDoc(23, commISN)
      
       If  status Then
      
            ' Արտահանել տվյալները գործողության կատարում
            Call wMainForm.MainMenu.Click(c_AllActions)
            Call wMainForm.PopupMenu.Click(c_ExportData)
       
            fileName1 = Project.Path &  "Stores\Periodic Communal Payment\CommPaymentAct_2.txt"
            fileName2 = Project.Path &  "Stores\Periodic Communal Payment\CommPaymentExp.txt"
            savePath = Project.Path &  "Stores\Periodic Communal Payment\"
            
            BuiltIn.Delay(2000)
            Call wMainForm.MainMenu.Click("Պատուհաններ|2  Տվյալների արտահանման սխալներ")
      
            If wMDIClient.WaitVBObject("FrmSpr", 3000).Exists Then
                  ' Հիշել քաղվածքը
                  Call SaveDoc(savePath, "CommPaymentAct_2")

                  ' Համեմատել ֆայլերը
                  Call Compare_Files(fileName2, fileName1, "")
            
                  BuiltIn.Delay(1000)
                  wMDIClient.VBObject("FrmSpr").Close
            Else    
                  Log.Error"Տվյալների արտահանման սխալներ հաղորդագրությունը չի բացվել " ,,,ErrorColor
            End If
            
            ' Մարել (առանձին) գործողության կատարում
            BuiltIn.Delay(1000)
             Call ComunalRepaySingle("240921")
             BuiltIn.Delay(2000)
             frmPttel.Close
             
      Else
             Log.Error("Կոմունալ վճարման պայմանագիրն առկա չէ 'Կոմունալ վճարումներ' թղթապանակում "),,,ErrorColor
      End If
      
      ' Մուտք պարբերական գործողությունների ԱՇՏ
      Call ChangeWorkspace(c_PeriodicActions)

       ' Մուտք"Պարբերական գործողությունների պայմանագրեր/Կոմունալ վճ. պայմանագրեր" թղթապանակ
      Set communalPayDoc = New_CommunalPayDoc()
      With communalPayDoc
          .folderName = "|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ ²Þî|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ|ÎáÙáõÝ³É í×. å³ÛÙ³Ý³·ñ»ñ"
          .wClient = "00002248"
          .wBranch = "P02"
          .wDepart = "02"
      End With
      
      Call Fill_CommunalPayDoc(communalPayDoc)
      
      ' Պայմանագրի առկայության ստուգում 
      status = CheckContractDoc(0, communalPay.docNum)
      
      If Not status Then
            Log.Error"Պայմանագիրն առկա չէ 'Պարբերական կոմունալ վճարումների պայմանագրեր' թղթապանակում " ,,,ErrorColor
      End If 
    
      ' Փակել պայմանագիրը
      Call CloseContract("250921")
      BuiltIn.Delay(1000)
      frmPttel.Close
      
       ' Մուտք Փոփոխման հայտեր թղթապանակ
      Set changeRequests = New_ChangeRequests()
      With changeRequests
          .state = "0"
  				.startDate = "010120"
  				.endDate = "010124"
      End With
      
      folderName = "|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ ²Þî|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ|"
      Call GoTo_ChangeRequests(folderName, changeRequests)
      
      ' Հաստատել պայմանագիրը Փոփոխման հայտեր թղթապանակից, փակել գործողությունից հետո
      status = ActionWithDocument("frmPttel", 8, communalPay.docNum, c_ToVerify, 2, "Î³ï³ñ»É")
      
      If Not status Then
            Log.Error"Պայմանագիրն առկա չէ 'Պարբերական պայմանագրերի Փոփոխման հայտեր' թղթապանակում " ,,,ErrorColor
      End If
      
      BuiltIn.Delay(1500)
      frmPttel.Close
      
      ' Մուտք"Պարբերական գործողությունների պայմանագրեր/Կոմունալ վճ. պայմանագրեր" թղթապանակ
      Set communalPayDoc = New_CommunalPayDoc()
      With communalPayDoc
          .folderName = "|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ ²Þî|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ|ÎáÙáõÝ³É í×. å³ÛÙ³Ý³·ñ»ñ"
          .wClient = "00002248"
          .showClose = 1
          .wBranch = "P02"
          .wDepart = "02"
      End With
      
      Call Fill_CommunalPayDoc(communalPayDoc)
      
      ' Պայմանագրի առկայության ստուգում 
      status = CheckContractDoc(0, communalPay.docNum)
      
      If Not status Then
            Log.Error"Պայմանագիրն առկա չէ 'Պարբերական կոմունալ վճարումների պայմանագրեր' թղթապանակում " ,,,ErrorColor
      End If 

      ' Պայմանագրի բացում
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_Open)
      BuiltIn.Delay(1000)
       If  MessageExists(2, "ä³ñµ»ñ³Ï³Ý ÏáÙáõÝ³É í×³ñáõÙÝ»ñÇ å³ÛÙ³Ý³·Çñ") Then
              ' Սեղմել "OK" կոճակը
              Call ClickCmdButton(5, "Î³ï³ñ»É")  
          Else
              Log.Error"Հաղորդագրության պատուհանը չի բացվել" ,,,ErrorColor
          End If
      BuiltIn.Delay(2000)
      frmPttel.Close
      
      ' Մուտք Փոփոխման հայտեր թղթապանակ
      Set changeRequests = New_ChangeRequests()
      With changeRequests
          .state = "1"
  				.startDate = "010120"
  				.endDate = "010124"
      End With
      
      folderName = "|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ ²Þî|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ|"
      Call GoTo_ChangeRequests(folderName, changeRequests)
      
      wStatus = CheckContractDoc(8, communalPay.docNum)
      BuiltIn.Delay(3000)
      
      If Not wStatus Then
            Log.Error("Կոմունալ վճարումների պայմանագիրն առկա չէ Փոփոխման հայտեր թղթապանակում")
            Exit Sub
      End If

      frmPttel.Close
      
      ' Փակել ծրագիրը
      Call Close_AsBank()   
End Sub