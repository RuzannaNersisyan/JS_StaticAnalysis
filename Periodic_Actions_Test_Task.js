'USEUNIT Library_Common
'USEUNIT Library_Colour
'USEUNIT Library_Contracts 
'USEUNIT Constants
'USEUNIT Library_CheckDB
'USEUNIT Library_Periodic_Actions
Option Explicit

'Test Case N 169993
 
Dim sDATE, fDATE, folderName, periodActions1, periodActions2, agreeTask1, agreeTask2
Dim Working_Docs, periodicAct, arrContractNums(2), groupEdit, chgReqs
Dim dbo_FOLDERS(5), fBODY, i, dbo_FOLDERS2(5)

Sub Periodic_Actions_Test_Task()
		Call Test_Initialize()

		' Ð³Ù³Ï³ñ· Ùáõïù ·áñÍ»É ARMSOFT û·ï³·áñÍáÕáí
		Log.Message "Համակարգ մուտք գործել ARMSOFT օգտագործողով", "", pmNormal, DivideColor
  Call Test_StartUp()
		
		' êï»ÕÍ»É ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·Çñ
		Log.Message "Ստեղծել Պարբերական գործողությունների պայմանագիր", "", pmNormal, DivideColor
  Call Create_PeriodicActions(folderName, periodActions1, "create")
		
		' ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պարբերական գործողությունների պայմանագրի ստաղծումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call DB_Initialize()
		Call Check_DB_PeriodicActionsCreation()
		
		' ì³í»ñ³óÝ»É å³ÛÙ³Ý³·ÇñÁ
		Log.Message "Վավերացնել պայմանագիրը", "", pmNormal, DivideColor
		Call GoTo_PeriodicWorkingDocuments(folderName, Working_Docs)
		Call SearchInPttel("frmPttel", 2, periodActions1.general.agreeN)
		Call Verify_Periodic_Actions()
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' ä³ÛÙ³Ý³·ñÇ í³í»ñ³óáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պայմանագրի վավերացումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_Confirm()
		
		' ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ
		Log.Message "Պարբերական գործողությունների պայմանագրեր", "", pmNormal, DivideColor
		Call	Check_PeriodicExisting(folderName & "ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ|", periodicAct, periodActions1.general.agreeN)
		
		' ²í»É³óÝ»É ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ
		Log.Message "Ավելացնել Պարբերական գործողությունների պայմանագրեր", "", pmNormal, DivideColor
		Call Create_PeriodicActions(folderName, periodActions2, "add")
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñÇ ³í»É³óáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պարբերական գործողությունների պայմանագրի ավելացումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_PeriodicActionsAdd()
		
		' ì³í»ñ³óÝ»É å³ÛÙ³Ý³·ÇñÁ
		Log.Message "Վավերացնել պայմանագիրը", "", pmNormal, DivideColor
		Call GoTo_PeriodicWorkingDocuments(folderName, Working_Docs)
		Call SearchInPttel("frmPttel", 2, periodActions2.general.agreeN)
		Call Verify_Periodic_Actions()
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' ä³ÛÙ³Ý³·ñÇ í³í»ñ³óáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Պայմանագրի վավերացումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_Confirm2()
		
		' ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ
		Log.Message "Պարբերական գործողությունների պայմանագրեր", "", pmNormal, DivideColor
		Call Check_PeriodicExisting(folderName & "ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ|", periodicAct, periodActions2.general.agreeN)
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' ²í»É³óÝ»É ²é³ç³¹ñ³ÝùÇ Ó¨³ÝÙáõß
		Log.Message "Ավելացնել Առաջադրանքի ձևանմուշ", "", pmNormal, DivideColor
		Call Add_TaskTemplate("PerActs", "ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñ", "Periodic Actions")
		
		' êïáõ·»É ³í»É³óñ³Í Ó¨³ÝÙáõßÇ ³éÏ³ÛáõÃÛáõÝÁ
		Log.Message "Ստուգել ավելացրած ձևանմուշի առկայությունը", "", pmNormal, DivideColor
		Call Search_In_EditTree("frmEditTree", "PerActs  ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñ")
		
		' ²í»É³óÝ»É Ò¨³ÝÙáõßÇ ï³ññ
		Log.Message "Ավելացնել Ձևանմուշի տարր", "", pmNormal, DivideColor
		Call Add_TemplateElement(2, "PerAgrOp", "ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñ", "frmEditTree", "PerActs  ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñ")
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmEditTree").Close
		
		' ²í»É³óÝ»É ²é³ç³¹ñ³Ýù
		Log.Message "Ավելացնել Առաջադրանք", "", pmNormal, DivideColor
		Call Add_Task(agreeTask1, "frmPttel")
'		BuiltIn.Delay(3000)
'		Call CheckPttel_RowCount("frmPttel", 1)
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ
		Log.Message "Պարբերական գործողությունների պայմանագրեր", "", pmNormal, DivideColor
		Call ChangeWorkspace(c_PeriodicActions)
		Call	Check_PeriodicExisting(folderName & "ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ|", periodicAct, periodActions1.general.agreeN)
		
		' ì×³ñáõÙÝ»ñÇ ¹ÇïáõÙ
		Log.Message "Վճարումների դիտում", "", pmNormal, DivideColor
		Call PaymentView(periodActions1.general.startDate, periodActions1.general.startDate, 1)
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel_2").Close
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' Î³ï³ñ»É í×³ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Կատարել վճարումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_MakePayment()
		
		' ²í»É³óÝ»É ²é³ç³¹ñ³Ýù
		Log.Message "Ավելացնել Առաջադրանք", "", pmNormal, DivideColor
		Call Add_Task(agreeTask2, "frmPttel")
'		BuiltIn.Delay(3000)
'		Call CheckPttel_RowCount("frmPttel", 2)
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ
		Log.Message "Պարբերական գործողությունների պայմանագրեր", "", pmNormal, DivideColor
		Call ChangeWorkspace(c_PeriodicActions)
		Call	Check_PeriodicExisting(folderName & "ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ|", periodicAct, periodActions2.general.agreeN)
		
		' ì×³ñáõÙÝ»ñÇ ¹ÇïáõÙ
		Log.Message "Վճարումների դիտում", "", pmNormal, DivideColor
		Call PaymentView(periodActions2.general.startDate, periodActions2.general.startDate, 1)
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel_2").Close
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		' Î³ï³ñ»É í×³ñáõÙÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Կատարել վճարումից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_MakePayment2()
		
		' æÝç»É ëï»ÕÍí³Í ²é³ç³¹ñ³ÝùÝ»ñÁ ¨ ²é³ç³¹ñ³ÝùÇ Ó¨³ÝÙáõßÁ
		Log.Message "Ջնջել ստեղծված Առաջադրանքները և Առաջադրանքի ձևանմուշը", "", pmNormal, DivideColor
		Call Delete_Task(agreeTask1.task_Num)
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		Call Delete_Task(agreeTask2.task_Num)
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
		Call Delete_TemplateElement("frmEditTree", "PerActs  ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñ")
		
  ' æÝç»É ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñÁ
		Log.Message "Ջնջել Պարբերական գործողությունների պայմանագրերը", "", pmNormal, DivideColor
		Call ChangeWorkspace(c_PeriodicActions)
		Call	GoTo_PeriodicActionsAgree(folderName & "ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñ|", periodicAct)
		
		Log.Message "Վճարումների դիտում", "", pmNormal, DivideColor
		Call SearchInPttel("frmPttel", 0, periodActions1.general.agreeN)
		BuiltIn.Delay(3000)
		Call PaymentView(periodActions1.general.startDate, periodActions1.general.startDate, 1)
		Call SearchAndDelete("frmPttel_2", 1, periodActions1.general.agreeN, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel_2").Close
		
		Call SearchAndDelete("frmPttel", 0, periodActions1.general.agreeN, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
		
		Log.Message "Վճարումների դիտում", "", pmNormal, DivideColor
		Call SearchInPttel("frmPttel", 0, periodActions2.general.agreeN)
		Call PaymentView(periodActions2.general.startDate, periodActions2.general.startDate, 1)
		Call SearchAndDelete("frmPttel_2", 1, periodActions2.general.agreeN, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel_2").Close
		
		Call SearchAndDelete("frmPttel", 0, periodActions2.general.agreeN, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
		
		BuiltIn.Delay(3000)
		wMDIClient.VBObject("frmPttel").Close
		
'		' æÝç»É ëï»ÕÍí³Í í×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·ÇñÁ
'		Log.Message "Ջնջել ստեղծված վճարման հանձնարարագիրը", "", pmNormal, DivideColor
'		Call GoTo_PeriodicWorkingDocuments(folderName, Working_Docs)
'		Call SearchAndDelete("frmPttel", 1, "ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (áõÕ.)", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
'		
'		BuiltIn.Delay(3000)
'		wMDIClient.VBObject("frmPttel").Close
'		
		' æÝç»É ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·ñ»ñÇó Ñ»ïá SQL ëïáõ·áõÙ
		Log.Message "Ջնջել Պարբերական գործողությունների պայմանագրերից հետո SQL ստուգում", "", pmNormal, SqlDivideColor
		Call Check_DB_DeleteDocs()
		
		Call Close_AsBank()    
End Sub

Sub Test_StartUp()
		Call Initialize_AsBankQA(sDATE, fDATE)
  Login("ARMSOFT")
		Call ChangeWorkspace(c_PeriodicActions)
End	Sub

Sub Test_Initialize()
		folderName = "|ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ ²Þî|"
		
		sDATE = "20030101"
		fDATE = "20240101"
		
		Set periodActions1 = New_PeriodicActions(1)
		with periodActions1
		  .general.office = "P04"
				.general.department = "06"
				.general.performer = "10"
				.general.client = "00015865"
				.general.doInEveryCall = 1
				.general.bypassNonWorkDays = "1"
				.general.opersGridRowCount = 1 
				.general.operations(0).N_Edit = "1"
				.general.operations(0).operType = "07"
				.general.operations(0).calcMethod = "10"
				.general.operations(0).opersAddDoc = true
				.general.operations(0).debitAccount = "5646516514648"
				.general.operations(0).depositAccount  = "2080040000002"
				.general.operations(0).percent = "0"
				.general.operations(0).price = "258"
				.general.operations(0).curr = "001"
				.general.operations(0).secID = "GB20072283"
				.general.operations(0).debitAccountName = "´³µ³Û³Ý  ²ÝÝ³ ÜáñùÇ 7Ù/ß,11ß,µ.6"
				.general.operations(0).depositAccountName = "11111"
				.general.operations(0).aim = "µ³ÝÏÇ ë³ñù³íáñáõÙÝ»ñÇ ëå³ë³ñÏÙ³Ý ¨ å³Ñå³ÝÙ³Ý ·Íáí"
				.other.informToClient = 0
				.other.note = "015"
				.other.note2 = "101"
				.other.note3 = "05"
				.other.addInfo = "ÇÝýáñÙ³óÇ³"
		end with
		
		Set Working_Docs = New_PeriodicWorkingDocuments()
		Working_Docs.performers = "10"
		
		Set periodicAct = New_PeriodicActionsAgree()
		periodicAct.performer = "10"
		
		Set chgReqs = New_ChangeRequests()
		
		Set periodActions2 = New_PeriodicActions(2)
		with periodActions2
		  .general.office = "P00"
				.general.department = "08"
				.general.performer = "10"
				.general.client = "00011105"
				.general.doInEveryCall = 0
				.general.periodMounth = "1"
				.general.periodDay = "0"
				.general.bypassNonWorkDays = "2"
				.general.opersGridRowCount = 1 
				.general.operations(0).opersAddDoc = true
				.general.operations(0).N_Edit = "1"
				.general.operations(0).operType = "08"
				.general.operations(0).calcMethod = "01"
				.general.operations(0).debitAccount = "01110530100"
				.general.operations(0).depositAccount  = "33184089300"
				.general.operations(0).depositCurr = ""
				.general.operations(0).percent = ""
				.general.operations(0).price = ""
				.general.operations(0).curr = ""
				.general.operations(0).transactionRate = ""
				.general.operations(0).rateChange = ""
				.general.operations(0).daysCount = ""
				.general.operations(0).maxPrice = "" 
				.general.operations(0).recipLegalStatus = "21"
				.general.operations(0).aim = "Ï³ÝËÇÏ³óáõÙ Migom Íñ³·ñÇó"
				.other.informToClient = 0
				.other.clientEmail = true
				.other.useClientEmail = 1
				.other.note = "001"
				.other.note2 = "100"
				.other.note3 = "01"
				.other.addInfo = "yo ho ho ho"
		end with
		
		Set agreeTask1 = New_Task()
		agreeTask1.executeStart = aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d/%m/%y")
		agreeTask1.executeHour = "1500"
		agreeTask1.taskDate = aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d%m%y")
		agreeTask1.taskGroup = "PerActs"
		agreeTask1.operDate = aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d%m%y")
		agreeTask1.note = "015"
		agreeTask1.note2 = "101"
		agreeTask1.note3 = "05"
		agreeTask1.sendEmail = ""
		
		Set agreeTask2 = New_Task()
		agreeTask2.executeStart = aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d/%m/%y")
		agreeTask2.executeHour = "1500"
		agreeTask2.taskDate = aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d%m%y")
		agreeTask2.taskGroup = "PerActs"
		agreeTask2.operDate = aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d%m%y")
		agreeTask2.note = "001"
		agreeTask2.note2 = "100"
		agreeTask2.note3 = "01"
		agreeTask2.sendEmail = "³Ûá"
End Sub

Sub DB_Initialize()
		for i = 0 to 4
    Set dbo_FOLDERS(i) = New_DB_FOLDERS()
    dbo_FOLDERS(i).fISN = periodActions1.fISN
    dbo_FOLDERS(i).fNAME = "PPAGR   "
  next
		dbo_FOLDERS(0).fKEY = periodActions1.fISN
		dbo_FOLDERS(0).fSTATUS = "5"
  dbo_FOLDERS(0).fFOLDERID = "C.988526524"
  dbo_FOLDERS(0).fCOM = "ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS(0).fSPEC = "²Ùë³ÃÇí- " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d/%m/%y") & " N- " & periodActions1.general.agreeN & " [ÊÙµ³·ñíáÕ]"
		dbo_FOLDERS(0).fECOM = "Periodic payments agreement"
		dbo_FOLDERS(1).fKEY = periodActions1.fISN
		dbo_FOLDERS(1).fSTATUS = "5"
  dbo_FOLDERS(1).fFOLDERID = "Oper." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")
  dbo_FOLDERS(1).fCOM = "ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS(1).fSPEC = periodActions1.general.agreeN & "16600                                       0.00   ÊÙµ³·ñíáÕ                                             10Ð³×³Ëáñ¹ 00015865                                                                               ä³ñµ. ·áñÍ. å³ÛÙ³Ý³·Çñ                                                                                                                      "
		dbo_FOLDERS(1).fECOM = "Periodic payments agreement"
		dbo_FOLDERS(1).fDCBRANCH = "P04"
  dbo_FOLDERS(1).fDCDEPART = "06 "
		dbo_FOLDERS(2).fKEY = periodActions1.general.agreeN
		dbo_FOLDERS(2).fSTATUS = "1"
  dbo_FOLDERS(2).fFOLDERID = "PPAYMS"
  dbo_FOLDERS(2).fCOM = "Ð³×³Ëáñ¹ " & periodActions1.general.client
  dbo_FOLDERS(2).fSPEC = "1   0001586510  " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000001 0/  0 0 0100                                   0001510105 ÇÝýáñÙ³óÇ³                        0000000000000000                                                                                                                                                                                                                            0     "
		dbo_FOLDERS(2).fECOM = "Client " & periodActions1.general.client
		dbo_FOLDERS(2).fDCBRANCH = "P04"
  dbo_FOLDERS(2).fDCDEPART = "06 "
		dbo_FOLDERS(3).fKEY = periodActions1.general.agreeN & "_1"
		dbo_FOLDERS(3).fSTATUS = "1"
  dbo_FOLDERS(3).fFOLDERID = "PPAYMSEXT" 
  dbo_FOLDERS(3).fCOM = "Ð³×³Ëáñ¹ " & periodActions1.general.client
  dbo_FOLDERS(3).fECOM = "Client " & periodActions1.general.client
  dbo_FOLDERS(3).fDCBRANCH = "P04"
  dbo_FOLDERS(3).fDCDEPART = "06 "
End	Sub

Sub Check_DB_PeriodicActionsCreation()
		Dim i, agrISN
	 'SQL Ստուգում DOCLOG աղյուսակում համար
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", periodActions1.fISN, 2)
  Call CheckDB_DOCLOG(periodActions1.fISN, "10", "N", "1", "", 1)
		Call CheckDB_DOCLOG(periodActions1.fISN, "10", "E", "1", "", 1)
  
  'SQL Ստուգում DOCP աղյուսակում  
  Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
		agrISN = Get_ColumnValueSQL("DOCP", "fISN", "fPARENTISN = " & periodActions1.fISN & " and fNAME = 'HT522'")
  Call CheckQueryRowCount("DOCP", "fPARENTISN", periodActions1.fISN, 1)
  Call CheckDB_DOCP(agrISN, "HT522   ", periodActions1.fISN, 1)
  
  'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
 	fBODY = " ACSBRANCH:P04 ACSDEPART:06 USERID:10 CODE:" & periodActions1.general.agreeN & " CLICODE:00015865 NAME:Ð³×³Ëáñ¹ 00015865 ENAME:Client 00015865 CALCALWAYS:1 NONWORKDAYS:1 CLINOT:0 USECLIEMAIL:0 USECLISCH:0 FEEFROMCARD:0 NOTE1:015 NOTE2:101 NOTE3:05 COMM:ÇÝýáñÙ³óÇ³ " 
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", periodActions1.fISN, 1)
  Call CheckDB_DOCS(periodActions1.fISN, "PPAGR   ", "1", fBODY, 1)
  
  'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", periodActions1.fISN, 11)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		dbo_FOLDERS(3).fSPEC = "1   0001586510  " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000001 0/  0 0 0100                                   0001510105 ÇÝýáñÙ³óÇ³                        00000000000000001 0710           0002080040000002                     000258                             0010                                           0 0               0               µ³ÝÏÇ ë³ñù³íáñáõÙÝ»ñÇ ëå³ë³ñÏÙ³Ý" & Left_Align(agrISN, 10) & "000000000                                                  "
  Call CheckQueryRowCount("FOLDERS", "fISN", periodActions1.fISN, 4)
  for i = 0 to 3
    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
  next
End	Sub

Sub Check_DB_Confirm()
		Dim i, agrISN
	 'SQL Ստուգում DOCLOG աղյուսակում համար
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", periodActions1.fISN, 4)
  Call CheckDB_DOCLOG(periodActions1.fISN, "10", "W", "2", "", 1)
		Call CheckDB_DOCLOG(periodActions1.fISN, "10", "C", "7", "", 1)
  
  'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", periodActions1.fISN, 1)
  Call CheckDB_DOCS(periodActions1.fISN, "PPAGR   ", "7", fBODY, 1)
  
  'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", periodActions1.fISN, 11)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("FOLDERS", "fISN", periodActions1.fISN, 3)
		agrISN = Get_ColumnValueSQL("DOCP", "fISN", "fPARENTISN = " & periodActions1.fISN & " and fNAME = 'HT522   '")
		dbo_FOLDERS(0).fSTATUS = "1"
		dbo_FOLDERS(0).fSPEC = "²Ùë³ÃÇí- " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d/%m/%y") & " N- " & periodActions1.general.agreeN & " [Ð³ëï³ïí³Í]"
		dbo_FOLDERS(2).fSPEC = "7   0001586510  " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000001 0/  0 0 0100                                   0001510105 ÇÝýáñÙ³óÇ³                        0000000000000000                                                                                                                                                                                                                            0     "
		dbo_FOLDERS(3).fSPEC = "7   0001586510  " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000001 0/  0 0 0100                                   0001510105 ÇÝýáñÙ³óÇ³                        00000000000000001 0710           0002080040000002                     000258                             0010                                           0 0               0               µ³ÝÏÇ ë³ñù³íáñáõÙÝ»ñÇ ëå³ë³ñÏÙ³Ý" & Left_Align(agrISN, 10) & "000000000                                                  "
  for i = 0 to 3
				if i <> 1 then 
		    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
				end if
  next
End	Sub

Sub Check_DB_PeriodicActionsAdd()
		Dim i, agrISN
	 'SQL Ստուգում DOCLOG աղյուսակում համար
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", periodActions2.fISN, 2)
  Call CheckDB_DOCLOG(periodActions2.fISN, "10", "N", "1", "", 1)
		Call CheckDB_DOCLOG(periodActions2.fISN, "10", "E", "1", "", 1)
  
  'SQL Ստուգում DOCP աղյուսակում  
  Log.Message "SQL Ստուգում DOCP աղյուսակում", "", pmNormal, SqlDivideColor
		agrISN = Get_ColumnValueSQL("DOCP", "fISN", "fPARENTISN = " & periodActions2.fISN & " and fNAME = 'CrPayOrd'")
  Call CheckQueryRowCount("DOCP", "fPARENTISN", periodActions2.fISN, 2)
  Call CheckDB_DOCP("102299530", "Acc     ", periodActions2.fISN, 1)
		Call CheckDB_DOCP(agrISN, "CrPayOrd", periodActions2.fISN, 1)
  
  'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
 	fBODY = " ACSBRANCH:P00 ACSDEPART:08 USERID:10 CODE:" & periodActions2.general.agreeN & " CLICODE:00011105 NAME:Ð³×³Ëáñ¹ 00011105 ENAME:Client 00011105 CALCALWAYS:0 PERIODICITY:1/0 NONWORKDAYS:2 CLINOT:0 USECLIEMAIL:0 USECLISCH:0 FEEFROMCARD:0 NOTE1:001 NOTE2:100 NOTE3:01 COMM:yo ho ho ho " 
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", periodActions2.fISN, 1)
  Call CheckDB_DOCS(periodActions2.fISN, "PPAGR   ", "1", fBODY, 1)
  
  'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", periodActions2.fISN, 10)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
		agrISN = Get_ColumnValueSQL("DOCP", "fISN", "fPARENTISN = " & periodActions2.fISN & " and fNAME = 'CrPayOrd'")
		for i = 0 to 3
    Set dbo_FOLDERS2(i) = New_DB_FOLDERS()
    dbo_FOLDERS2(i).fISN = periodActions2.fISN
    dbo_FOLDERS2(i).fNAME = "PPAGR   "
				dbo_FOLDERS2(i).fDCBRANCH = "P00"
		  dbo_FOLDERS2(i).fDCDEPART = "08"
  next
		dbo_FOLDERS2(0).fKEY = periodActions2.fISN
		dbo_FOLDERS2(0).fSTATUS = "5"
  dbo_FOLDERS2(0).fFOLDERID = "C.672668097"
  dbo_FOLDERS2(0).fCOM = "ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS2(0).fSPEC = "²Ùë³ÃÇí- " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d/%m/%y") & " N- " & periodActions2.general.agreeN & " [ÊÙµ³·ñíáÕ]"
		dbo_FOLDERS2(0).fECOM = "Periodic payments agreement"
		dbo_FOLDERS2(0).fDCBRANCH = ""
		dbo_FOLDERS2(0).fDCDEPART = ""
		dbo_FOLDERS2(1).fKEY = periodActions2.fISN
		dbo_FOLDERS2(1).fSTATUS = "5"
  dbo_FOLDERS2(1).fFOLDERID = "Oper." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")
  dbo_FOLDERS2(1).fCOM = "ä³ñµ»ñ³Ï³Ý ·áñÍáÕáõÃÛáõÝÝ»ñÇ å³ÛÙ³Ý³·Çñ"
  dbo_FOLDERS2(1).fSPEC = periodActions2.general.agreeN & "16600                                       0.00   ÊÙµ³·ñíáÕ                                             10Ð³×³Ëáñ¹ 00011105                                                                               ä³ñµ. ·áñÍ. å³ÛÙ³Ý³·Çñ                                                                                                                      "
		dbo_FOLDERS2(1).fECOM = "Periodic payments agreement"
		dbo_FOLDERS2(2).fKEY = periodActions2.general.agreeN
		dbo_FOLDERS2(2).fSTATUS = "1"
  dbo_FOLDERS2(2).fFOLDERID = "PPAYMS"
  dbo_FOLDERS2(2).fCOM = "Ð³×³Ëáñ¹ " & periodActions2.general.client
  dbo_FOLDERS2(2).fSPEC = "1   " & periodActions2.general.client & "10  " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000000 1/  0 0 0200                                   0000110001 yo ho ho ho                       0000000000000000                                                                                                                                                                                                                            0     "
		dbo_FOLDERS2(2).fECOM = "Client " & periodActions2.general.client
		dbo_FOLDERS2(3).fKEY = periodActions2.general.agreeN & "_1"
		dbo_FOLDERS2(3).fSTATUS = "1"
  dbo_FOLDERS2(3).fFOLDERID = "PPAYMSEXT" 
  dbo_FOLDERS2(3).fCOM = "Ð³×³Ëáñ¹ " & periodActions2.general.client
  dbo_FOLDERS2(3).fSPEC = "1   " & periodActions2.general.client & "10  " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000000 1/  0 0 0200                                   0000110001 yo ho ho ho                       00000000000000001 0801011105301000001660033184089300                  000                                   0                                           0 0               0               Ï³ÝËÇÏ³óáõÙ Migom Íñ³·ñÇó       " & Left_Align(agrISN, 10) & "000000000                                                  "
  dbo_FOLDERS2(3).fECOM = "Client " & periodActions2.general.client
  Call CheckQueryRowCount("FOLDERS", "fISN", periodActions2.fISN, 4)
  for i = 0 to 3
    Call CheckDB_FOLDERS(dbo_FOLDERS2(i), 1)
  next
End	Sub

Sub Check_DB_Confirm2()
		Dim i, agrISN	
	 'SQL Ստուգում DOCLOG աղյուսակում համար
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", periodActions2.fISN, 4)
  Call CheckDB_DOCLOG(periodActions2.fISN, "10", "W", "2", "", 1)
		Call CheckDB_DOCLOG(periodActions2.fISN, "10", "C", "7", "", 1)
  
  'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCS", "fISN", periodActions2.fISN, 1)
  Call CheckDB_DOCS(periodActions2.fISN, "PPAGR   ", "7", fBODY, 1)
  
  'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", periodActions2.fISN, 10)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("FOLDERS", "fISN", periodActions2.fISN, 3)
		dbo_FOLDERS2(0).fSTATUS = "1"
		agrISN = Get_ColumnValueSQL("DOCP", "fISN", "fPARENTISN = " & periodActions2.fISN & " and fNAME = 'CrPayOrd'")
		dbo_FOLDERS2(0).fSPEC = "²Ùë³ÃÇí- " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d/%m/%y") & " N- " & periodActions2.general.agreeN & " [Ð³ëï³ïí³Í]"
		dbo_FOLDERS2(2).fSPEC = "7   " & periodActions2.general.client & "10  " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000000 1/  0 0 0200                                   0000110001 yo ho ho ho                       0000000000000000                                                                                                                                                                                                                            0     "
		dbo_FOLDERS2(3).fSPEC = "7   " & periodActions2.general.client & "10  " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000000 1/  0 0 0200                                   0000110001 yo ho ho ho                       00000000000000001 0801011105301000001660033184089300                  000                                   0                                           0 0               0               Ï³ÝËÇÏ³óáõÙ Migom Íñ³·ñÇó       " & Left_Align(agrISN, 10) & "000000000                                                  "
		for i = 0 to 3
				if i <> 1 then 
		    Call CheckDB_FOLDERS(dbo_FOLDERS2(i), 1)
				end if
  next
End	Sub

Sub Check_DB_MakePayment()
		Dim i, agrISN
	 'SQL Ստուգում DOCLOG աղյուսակում համար
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", periodActions1.fISN, 5)
  Call CheckDB_DOCLOG(periodActions1.fISN, "10", "W", "2", "", 1)
		Call CheckDB_DOCLOG(periodActions1.fISN, "10", "C", "7", "", 1)
		
		'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
		fBODY = " ACSBRANCH:P04 ACSDEPART:06 USERID:10 CODE:" & periodActions1.general.agreeN & " CLICODE:00015865 NAME:Ð³×³Ëáñ¹ 00015865 ENAME:Client 00015865 CALCALWAYS:1 NONWORKDAYS:1 CLINOT:0 USECLIEMAIL:0 USECLISCH:0 FEEFROMCARD:0 NOTE1:015 NOTE2:101 NOTE3:05 COMM:ÇÝýáñÙ³óÇ³ "  
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", periodActions1.fISN, 1)
  Call CheckDB_DOCS(periodActions1.fISN, "PPAGR   ", "7", fBODY, 1)
  
  'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", periodActions1.fISN, 12)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("FOLDERS", "fISN", periodActions1.fISN, 3)
		agrISN = Get_ColumnValueSQL("DOCP", "fISN", "fPARENTISN = " & periodActions1.fISN & " and fNAME = 'HT522   '")
		dbo_FOLDERS(0).fSTATUS = "1"
		dbo_FOLDERS(0).fSPEC = "²Ùë³ÃÇí- " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d/%m/%y") & " N- " & periodActions1.general.agreeN & " [Ð³ëï³ïí³Í]"
		dbo_FOLDERS(2).fSPEC = "7   0001586510  " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000001 0/  0 0 0100                                   0001510105 ÇÝýáñÙ³óÇ³                        " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "00000000                                                                                                                                                                                                                            0     "
		dbo_FOLDERS(3).fSPEC = "7   0001586510  " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000001 0/  0 0 0100                                   0001510105 ÇÝýáñÙ³óÇ³                        " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000001 0710           0002080040000002                     000258                             0010                                           0 0               0               µ³ÝÏÇ ë³ñù³íáñáõÙÝ»ñÇ ëå³ë³ñÏÙ³Ý" & Left_Align(agrISN, 10) & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "0                                                  " 
  for i = 0 to 3
				if i <> 1 then 
		    Call CheckDB_FOLDERS(dbo_FOLDERS(i), 1)
				end if
  next
End	Sub

Sub Check_DB_MakePayment2()
		Dim i, agrISN	
	 'SQL Ստուգում DOCLOG աղյուսակում համար
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", periodActions2.fISN, 5)
  Call CheckDB_DOCLOG(periodActions2.fISN, "10", "W", "2", "", 1)
		Call CheckDB_DOCLOG(periodActions2.fISN, "10", "C", "7", "", 1)
  
  'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
		fBODY = " ACSBRANCH:P00 ACSDEPART:08 USERID:10 CODE:" & periodActions2.general.agreeN & " CLICODE:00011105 NAME:Ð³×³Ëáñ¹ 00011105 ENAME:Client 00011105 CALCALWAYS:0 PERIODICITY:1/0 NONWORKDAYS:2 CLINOT:0 USECLIEMAIL:0 USECLISCH:0 FEEFROMCARD:0 NOTE1:001 NOTE2:100 NOTE3:01 COMM:yo ho ho ho "  
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", periodActions2.fISN, 1)
  Call CheckDB_DOCS(periodActions2.fISN, "PPAGR   ", "7", fBODY, 1)
  
  'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", periodActions2.fISN, 11)
  
  'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("FOLDERS", "fISN", periodActions2.fISN, 3)
		agrISN = Get_ColumnValueSQL("DOCP", "fISN", "fPARENTISN = " & periodActions2.fISN & " and fNAME = 'CrPayOrd'")
		dbo_FOLDERS2(2).fSPEC = "7   " & periodActions2.general.client & "10  " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000000 1/  0 0 0200                                   0000110001 yo ho ho ho                       " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "00000000                                                                                                                                                                                                                            0     "
		dbo_FOLDERS2(3).fSPEC = "7   " & periodActions2.general.client & "10  " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000000 1/  0 0 0200                                   0000110001 yo ho ho ho                       " & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "000000001 0801011105301000001660033184089300                  000                                   0                                           0 0               0               Ï³ÝËÇÏ³óáõÙ Migom Íñ³·ñÇó       " & Left_Align(agrISN, 10) & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d") & "0                                                  " 
		for i = 0 to 3
				if i <> 1 then 
		    Call CheckDB_FOLDERS(dbo_FOLDERS2(i), 1)
				end if
  next
End	Sub

Sub Check_DB_DeleteDocs()
		'SQL Ստուգում DOCLOG աղյուսակում համար
  Log.Message "SQL Ստուգում DOCLOG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCLOG", "fISN", periodActions1.fISN, 7)
  Call CheckDB_DOCLOG(periodActions1.fISN, "10", "D", "999", "", 1)
		Call CheckQueryRowCount("DOCLOG", "fISN", periodActions2.fISN, 7)
		Call CheckDB_DOCLOG(periodActions2.fISN, "10", "D", "999", "", 1)
		
		'SQL Ստուգում DOCS աղյուսակում 
  Log.Message "SQL Ստուգում DOCS աղյուսակում", "", pmNormal, SqlDivideColor
 	fBODY = " ACSBRANCH:P04 ACSDEPART:06 USERID:10 CODE:" & periodActions1.general.agreeN & " CLICODE:00015865 NAME:Ð³×³Ëáñ¹ 00015865 ENAME:Client 00015865 CALCALWAYS:1 NONWORKDAYS:1 CLINOT:0 USECLIEMAIL:0 USECLISCH:0 FEEFROMCARD:0 NOTE1:015 NOTE2:101 NOTE3:05 COMM:ÇÝýáñÙ³óÇ³ "  
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", periodActions1.fISN, 1)
  Call CheckDB_DOCS(periodActions1.fISN, "PPAGR   ", "999", fBODY, 1)
		fBODY = " ACSBRANCH:P00 ACSDEPART:08 USERID:10 CODE:" & periodActions2.general.agreeN & " CLICODE:00011105 NAME:Ð³×³Ëáñ¹ 00011105 ENAME:Client 00011105 CALCALWAYS:0 PERIODICITY:1/0 NONWORKDAYS:2 CLINOT:0 USECLIEMAIL:0 USECLISCH:0 FEEFROMCARD:0 NOTE1:001 NOTE2:100 NOTE3:01 COMM:yo ho ho ho "
  fBODY = Replace(fBODY, " ", "%")
  Call CheckQueryRowCount("DOCS", "fISN", periodActions2.fISN, 1)
  Call CheckDB_DOCS(periodActions2.fISN, "PPAGR   ", "999", fBODY, 1)
		
		'SQL Ստուգում DOCSG աղյուսակում 
  Log.Message "SQL Ստուգում DOCSG աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("DOCSG", "fISN", periodActions1.fISN, 12)
		Call CheckQueryRowCount("DOCSG", "fISN", periodActions2.fISN, 10)
		
		'SQL Ստուգում FOLDERS աղյուսակում 
  Log.Message "SQL Ստուգում FOLDERS աղյուսակում", "", pmNormal, SqlDivideColor
  Call CheckQueryRowCount("FOLDERS", "fISN", periodActions1.fISN, 1)
		Call CheckQueryRowCount("FOLDERS", "fISN", periodActions2.fISN, 1)
  dbo_FOLDERS(0).fKEY = periodActions1.fISN
  dbo_FOLDERS(0).fISN = periodActions1.fISN
  dbo_FOLDERS(0).fNAME = "PPAGR   "
  dbo_FOLDERS(0).fSTATUS = "0"
		dbo_FOLDERS(0).fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")
		dbo_FOLDERS(0).fCOM = ""
		dbo_FOLDERS(0).fSPEC = Left_Align(Get_Compname_DOCLOG(periodActions1.fISN), 16) &  "PERPAYS ARMSOFT                       007  "
		dbo_FOLDERS(0).fECOM = ""
		dbo_FOLDERS(0).fDCBRANCH = "P04"
		dbo_FOLDERS(0).fDCDEPART = "06 "
  Call CheckDB_FOLDERS(dbo_FOLDERS(0), 1)
		dbo_FOLDERS(0).fKEY = periodActions2.fISN
  dbo_FOLDERS(0).fISN = periodActions2.fISN
		dbo_FOLDERS(0).fDCBRANCH = "P00"
		dbo_FOLDERS(0).fDCDEPART = "08 "
		Call CheckDB_FOLDERS(dbo_FOLDERS(0), 1)
End	Sub