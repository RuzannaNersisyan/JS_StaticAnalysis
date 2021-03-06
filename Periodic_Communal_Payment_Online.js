'USEUNIT Library_Common
'USEUNIT Library_Colour
'USEUNIT Library_Contracts 
'USEUNIT Constants
'USEUNIT Library_CheckDB
'USEUNIT Library_Periodic_Actions
Option Explicit

'Test Case N 172073

Dim sDATE, fDATE, folderName, communalPay, commPayDoc, Working_Docs
Dim dbo_FOLDERS(5), fBODY, i, dbo_PERCOMMUNAL(2)

Sub Periodic_Communal_Payment_Online_Test()
		Call Test_Initialize()

		' Ð³Ù³Ï³ñ· Ùáõïù ·áñÍ»É ARMSOFT û·ï³·áñÍáÕáí
		Log.Message "Համակարգ մուտք գործել ARMSOFT օգտագործողով", "", pmNormal, DivideColor
  Call Test_StartUp()
		
		' êï»ÕÍ»É ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·Çñ
		Log.Message "Ստեղծել Պարբերական գործողությունների պայմանագիր", "", pmNormal, DivideColor
  Call Create_CommunalPayment(folderName, communalPay)
		
		' ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պարբերական գործողությունների պայմանագրի ստաղծումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call DB_Initialize()
		Call Check_DB_CommunalPaymentCreation()
		
		' ì³í»ñ³óÝ»É å³ÛÙ³Ý³·ÇñÁ
		Log.Message "Վավերացնել պայմանագիրը", "", pmNormal, DivideColor
		Call GoTo_PeriodicWorkingDocuments(folderName, Working_Docs)
		Call SearchInPttel("frmPttel", 1, communalPay.docNum)
		Call Verify_Periodic_Actions()
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' ä³ÛÙ³Ý³·ñÇ í³í»ñ³óáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պայմանագրի վավերացումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_Confirm()
		
		' ÎáÙáõÝ³É í×. å³ÛÙ³Ý³·ñ»ñ
		Log.Message "Կոմունալ վճ. պայմանագրեր", "", pmNormal, DivideColor
		commPayDoc.dagrN = communalPay.docNum
		Call	Fill_CommunalPayDoc(commPayDoc)
		if not SearchInPttel("frmPttel", 0, communalPay.docNum) then 
				Log.Error "Can't find searched row!", "", pmNormal, ErrorColor
		end if
		
		' Î³ï³ñ»É í×³ñáõÙ
		Log.Message "Կատարել վճարում", "", pmNormal, DivideColor
		Call MakePayment(communalPay.other.openDate, 0, 1)
		
		' Î³ï³ñ»É í×³ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Կատարել վճարումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_MakePayment()
		
		' ì×³ñáõÙÝ»ñÇ ¹ÇïáõÙ
		Log.Message "Վճարումների դիտում", "", pmNormal, DivideColor
		Call PaymentView(communalPay.other.openDate, communalPay.other.openDate, 1)
		
		'êïáõ·áõÙ "ØÝ³óáñ¹" ëÛ³Ý ³ñÅ»ùÁ
  Call CompareFieldValue("frmPttel_2", "FSUMDB", "700.00")
		
		' æÝç»É ÎáÙáõÝ³É í×³ñáõÙÝ»ñÇ å³ÛÙ³Ý³·ÇñÁ
		Log.Message "Ջնջել Կոմունալ վճարումների պայմանագիրը", "", pmNormal, DivideColor
		if SearchInPttel("frmPttel_2", 1, communalPay.docNum) then 
				Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
				if p1.VBObject("frmAsMsgBox").Exists then
				  Call MessageExists(2, "Ð³×³Ëáñ¹ÇÝ Ï³ñáÕ ¿ áõÕ³ñÏí³Í ÉÇÝ»É ïíÛ³É í×³ñÙ³Ý Ù³ëÇÝ " & vbCrLf & "Ñ³Õáñ¹³·ñáõÃÛáõÝ:" & vbCrLf & "Þ³ñáõÝ³Ï»±É:")
				  Call ClickCmdButton(5, "²Ûá")
						if p1.VBObject("frmAsMsgBox").Exists then
								Call MessageExists(2, "ö³ëï³ÃáõÕÃÁ çÝç»ÉÇë` ÏÑ»é³óí»Ý Ýñ³ Ñ»ï Ï³åí³Í ËÙµ³ÛÇÝ " & vbCrLf & "Ó¨³Ï»ñåáõÙÝ»ñÁ")
						  Call ClickCmdButton(5, "Î³ï³ñ»É")
								if p1.VBObject("frmDeleteDoc").Exists then
										Call MessageExists(1, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
		        Call ClickCmdButton(3, "²Ûá")
								end if
						end if
				end if 
		else
				Log.Error "Can't find searched row!", "", pmNormal, ErrorColor
		end if
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel_2").Close
		
		Call SearchAndDelete("frmPttel", 0, communalPay.docNum, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' æÝç»É ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Ջնջել Պարբերական գործողությունների պայմանագրերից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_DeleteDocs()
		
		Call Close_AsBank()    
End Sub

Sub Test_StartUp()
		Call Initialize_AsBankQA(sDATE, fDATE)
  Login("ARMSOFT")
		Call  SetParameter("PCPLASTDAY", "31")
  Call  SetParameter("PCPSTARTDAY", "1")
		Login("ARMSOFT")
		Call ChangeWorkspace(c_PeriodicActions)
End	Sub

Sub Test_Initialize()
		folderName = "|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ ²Þî|"
		sDATE = "20030101"
		fDATE = "20240101"  
		
		Set communalPay = New_CommunalPayment(2)
		with communalPay
		  .general.client = "00000392"
				.general.maxPrice = "700" 
				.general.services(0).service = "V"
				.general.services(0).place = "98"
				.general.services(0).clientN = "065748"
				.general.services(0).minPrice = "500" 
				.general.services(0).maxPrice = "600"
				.general.services(1).service = "A"
				.general.services(1).place = "91"
				.general.services(1).clientN = "000007"
				.general.services(1).minPrice = "300" 
		end with
		
		Set Working_Docs = New_PeriodicWorkingDocuments()
		Working_Docs.performers = "10"
		
		Set commPayDoc = New_CommunalPayDoc()
		with commPayDoc
				.folderName = "|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ ²Þî|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ|ÎáÙáõÝ³É í×. å³ÛÙ³Ý³·ñ»ñ"
		end with
		
End Sub

Sub DB_Initialize()
		for i = 0 to 4
    Set dbo_FOLDERS(i) = New_DB_FOLDERS()
    dbo_FOLDERS(i).fISN = communalPay.fISN
    dbo_FOLDERS(i).fNAME = "PCPAGR  "
  next
		dbo_FOLDERS(0).fKEY = communalPay.fISN
		dbo_FOLDERS(0).fSTATUS = "5"
  dbo_FOLDERS(0).fFOLDERID = "C.103280"
  dbo_FOLDERS(0).fCOM = "ä³ñµ»ñ³Ï³Ý ÏáÙáõÝ³É í×³ñáõÙÝ»ñÇ å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS(0).fSPEC = "²Ùë³ÃÇí- " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d/%m/%y") & " N- " & communalPay.docNum & " [Üáñ]"
		dbo_FOLDERS(0).fECOM = "Periodic communal payments agreement"
		dbo_FOLDERS(1).fKEY = communalPay.fISN
		dbo_FOLDERS(1).fSTATUS = "5"
  dbo_FOLDERS(1).fFOLDERID = "Oper." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")
  dbo_FOLDERS(1).fCOM = "ä³ñµ»ñ³Ï³Ý ÏáÙáõÝ³É í×³ñáõÙÝ»ñÇ å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS(1).fSPEC = communalPay.docNum & "166004670294                                0.00000Üáñ                                                   10Ð³×³Ëáñ¹ 00000392                                                                               ä³ñµ»ñ³Ï³Ý ÏáÙáõÝ³É í×³ñáõÙÝ»ñÇ å³ÛÙ³Ý³·Çñ                                                                                                  "
		dbo_FOLDERS(1).fECOM = "Periodic communal payments agreement"
		dbo_FOLDERS(1).fDCBRANCH = "P00"
  dbo_FOLDERS(1).fDCDEPART = "08 "
		dbo_FOLDERS(2).fKEY = communalPay.docNum
		dbo_FOLDERS(2).fSTATUS = "1"
  dbo_FOLDERS(2).fFOLDERID = "PCP"
  dbo_FOLDERS(2).fCOM = "Ð³×³Ëáñ¹ " & communalPay.general.client
  dbo_FOLDERS(2).fSPEC = "1   00000392" & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "00000000 13110            700.00014670294    0000   0000000000000000000000000                                                                      "
		dbo_FOLDERS(2).fECOM = "Client " & communalPay.general.client
		dbo_FOLDERS(2).fDCBRANCH = "P00"
  dbo_FOLDERS(2).fDCDEPART = "08 "
		
		for i = 0 to 1
    Set dbo_PERCOMMUNAL(i) = New_dbo_PERIODIC_COMMUNAL()
    dbo_PERCOMMUNAL(i).fISN = communalPay.fISN
  next
		dbo_PERCOMMUNAL(0).fROWID = "1"
		dbo_PERCOMMUNAL(0).fSYS = "V  "
		dbo_PERCOMMUNAL(0).fLOCATION = "98"
		dbo_PERCOMMUNAL(0).fCODE = "065748"
		dbo_PERCOMMUNAL(0).fABONENT = "VivaCell-Ç µ³Å. 098065748"
		dbo_PERCOMMUNAL(0).fADDRESS = ""
		dbo_PERCOMMUNAL(0).fMIN = "500.00"
		dbo_PERCOMMUNAL(0).fMAX = "600.00"
		dbo_PERCOMMUNAL(0).fPAID = "600.00"
		dbo_PERCOMMUNAL(1).fROWID = "2"
		dbo_PERCOMMUNAL(1).fSYS = "A  "
		dbo_PERCOMMUNAL(1).fLOCATION = "91"
		dbo_PERCOMMUNAL(1).fCODE = "000007"
		dbo_PERCOMMUNAL(1).fABONENT = ""
		dbo_PERCOMMUNAL(1).fADDRESS = ""
		dbo_PERCOMMUNAL(1).fMIN = "300.00"
		dbo_PERCOMMUNAL(1).fMAX = "0.00"
		dbo_PERCOMMUNAL(1).fPAID = "100.00"
End	Sub

Sub Check_DB_CommunalPaymentCreation()	
	 'SQL Ստուգում DOCLOG աղյուսակում համար
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", communalPay.fISN, 1)
  Call CheckDB_DOCLOG(communalPay.fISN, "10", "N", "1", "", 1)

  'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
 	fBODY = " ACSBRANCH:P00 ACSDEPART:08 USERID:10 CODE:" & communalPay.docNum & " CLICODE:00000392 NAME:Ð³×³Ëáñ¹ 00000392 ENAME:Client 00000392 FEEACC:4670294 FEECUR:000 MAXSUM:700 SDAY:1 LDAY:31 CLINOT:0 USECLIEMAIL:1 USECLISCH:0 FEEFROMCARD:0 "
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", communalPay.fISN, 1)
  Call CheckDB_DOCS(communalPay.fISN, "PCPAGR  ", "1", fBODY, 1)
  
  'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", communalPay.fISN, 16)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("FOLDERS", "fISN", communalPay.fISN, 3)
  for i = 0 to 2
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
  next
End	Sub

Sub Check_DB_Confirm()
		Dim base 
		
	 'SQL Ստուգում DOCLOG աղյուսակում համար
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", communalPay.fISN, 3)
  Call CheckDB_DOCLOG(communalPay.fISN, "10", "W", "2", "", 1)
		Call CheckDB_DOCLOG(communalPay.fISN, "10", "C", "7", "", 1)
  
  'SQL Ստուգում DOCP աղյուսակում  
  Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCP", "fPARENTISN", communalPay.fISN, 1)
		base = GetSQL_ColumnValue("DOCP", "fPARENTISN", communalPay.fISN, "fISN")
  Call CheckDB_DOCP(base, "Acc     ", communalPay.fISN, 1)
  
  'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", communalPay.fISN, 1)
  Call CheckDB_DOCS(communalPay.fISN, "PCPAGR  ", "7", fBODY, 1)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("FOLDERS", "fISN", communalPay.fISN, 2)
		dbo_FOLDERS(0).fSTATUS = "1"
		dbo_FOLDERS(0).fSPEC = "²Ùë³ÃÇí- " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d/%m/%y") & " N- " & communalPay.docNum & " [Ð³ëï³ïí³Í]"
		dbo_FOLDERS(2).fSPEC = "7   00000392" & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "00000000 13110            700.00014670294    0000   0000000000000000000000000                                                                      "
  Call CheckDB_FOLDERS(dbo_FOLDERS(0), 1)
		Call CheckDB_FOLDERS(dbo_FOLDERS(2), 1)
End	Sub

Sub Check_DB_MakePayment()
		'SQL Ստուգում DOCLOG աղյուսակում համար
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", communalPay.fISN, 4)
		Call CheckDB_DOCLOG(communalPay.fISN, "10", "E", "7", "", 1)
		
		'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", communalPay.fISN, 1)
  Call CheckDB_DOCS(communalPay.fISN, "PCPAGR  ", "7", fBODY, 1)
		
		'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		dbo_FOLDERS(2).fSPEC = "7   00000392" & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "00000000 13110            700.00014670294    0000   0" & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "0000000000000000                                                                      "
  Call CheckQueryRowCount("FOLDERS", "fISN", communalPay.fISN, 2)
  Call CheckDB_FOLDERS(dbo_FOLDERS(0), 1)
		Call CheckDB_FOLDERS(dbo_FOLDERS(2), 1)
		
		'SQL Ստուգում PERIODIC_COMMUNAL աղյուսակում համար
  Log.Message "SQL Ստուգում PERIODIC_COMMUNAL աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("PERIODIC_COMMUNAL", "fISN", communalPay.fISN, 2)
		Call CheckDB_PERIODIC_COMMUNAL(dbo_PERCOMMUNAL(0), 1)
		Call CheckDB_PERIODIC_COMMUNAL(dbo_PERCOMMUNAL(1), 1)
End	Sub

Sub Check_DB_DeleteDocs()
		'SQL Ստուգում DOCLOG աղյուսակում համար
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", communalPay.fISN, 6)
  Call CheckDB_DOCLOG(communalPay.fISN, "10", "D", "999", "", 1)
		
		'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", communalPay.fISN, 1)
  Call CheckDB_DOCS(communalPay.fISN, "PCPAGR  ", "999", fBODY, 1)
		
		'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("FOLDERS", "fISN", communalPay.fISN, 1)
  dbo_FOLDERS(0).fKEY = communalPay.fISN
  dbo_FOLDERS(0).fISN = communalPay.fISN
  dbo_FOLDERS(0).fNAME = "PCPAGR  "
  dbo_FOLDERS(0).fSTATUS = "0"
		dbo_FOLDERS(0).fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")
		dbo_FOLDERS(0).fCOM = ""
		dbo_FOLDERS(0).fSPEC = Left_Align(Get_Compname_DOCLOG(communalPay.fISN), 16) &  "PERPAYS ARMSOFT                       007  "
		dbo_FOLDERS(0).fECOM = ""
		dbo_FOLDERS(0).fDCBRANCH = "P00"
		dbo_FOLDERS(0).fDCDEPART = "08 "
  Call CheckDB_FOLDERS(dbo_FOLDERS(0), 1)
End	Sub