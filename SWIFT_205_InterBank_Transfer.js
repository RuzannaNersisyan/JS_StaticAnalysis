'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Common
'USEUNIT Library_Colour
'USEUNIT Library_CheckDB
'USEUNIT Constants
'USEUNIT Library_Contracts
'USEUNIT Main_Accountant_Filter_Library
Option Explicit

'Test Case ID 187360 sysType - 1 (SWIFT)
'Test Case ID 187364 sysType - 2 (SPFS)

Dim intBankTrans,dbSW_MESSAGES,dbFOLDERS(1)
Dim recieved

Sub SWIFT_205_Interbank_Import_Test(sysType)
   
    Dim sDATE, fDATE
    Dim settingsPath, max, min, rand, fileFrom, fileTo,what, fWith, importPath
    Dim isn, folderDirect, fBODY, transPayIsn, stDate, enDate, wUser, docType
    Dim Path1,Path2,IgnoreParams
    
    sDATE = "20020101"
    fDATE = "20260101"
    
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Login("ARMSOFT")

    Call Test_Initialize_SWIFT_205()

'-----------------------------------------------------------------------------
'------ "S.W.I.F.T. ԱՇՏ/Պարամետրեր"-ում կատարել համապատասխան փոփոխությունները-------
'-----------------------------------------------------------------------------
    Log.Message "-- S.W.I.F.T. ԱՇՏ/Պարամետրեր-ում կատարել համապատասխան փոփոխությունները --",,,DivideColor
    
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |ä³ñ³Ù»ïñ»ñ")
    BuiltIn.Delay(3000)
    
    'SWGPI Պարամետրի փոփոխում SQL հարցման միջոցով
    Call SetParameter("SWGPI", "1")
    
    'SWMSG պարամետրի փոփոխում
    Call SetParameter_InPttel("SWMSG" ,"101,110,200,201,203,102,N99,103,N98")
    Call CheckQueryRowCount("PARAMS","fVALUE","101,110,200,201,203,102,N99,103,N98",1)
    
    'Ջնջում է Import թղթապանակի պարունակությունը
    aqFileSystem.DeleteFile(Project.Path &"Stores\SWIFT\HT205\ImportFile\Import\*")

    'Վերարտագրում է նախօրոք տրված ֆայլը մեկ այլ ֆայլի մեջ
    fileFrom = Project.Path &"Stores\SWIFT\HT205\ImportFile\MT000205.RJE"
    fileTo = Project.Path &"Stores\SWIFT\HT205\ImportFile\Import\MT000205.RJE"
    Call Read_Write_File_With_replace(fileFrom,fileTo,"","")
    
    importPath = Project.Path & "Stores\SWIFT\HT205\ImportFile\Import\"
    Select Case sysType
    Case 1
        'SWOUT պարամետրի փոփոխում
        Call SetParameter_InPttel("SWOUT" ,importPath)
        'SWSPFSACKDIR պարամետրի փոփոխում
        Call SetParameter("SWSPFSACKDIR", "")
        'SWSPFSNAKDIR պարամետրի փոփոխում
        Call SetParameter("SWSPFSNAKDIR", "")
        'SWSPFSOUT պարամետրի փոփոխում
        Call SetParameter("SWSPFSOUT", "")
    Case 2 
        'SWSPFSACKDIR պարամետրի փոփոխում
        Call SetParameter_InPttel("SWSPFSACKDIR" ,importPath)
        'SWSPFSNAKDIR պարամետրի փոփոխում
        Call SetParameter_InPttel("SWSPFSNAKDIR" ,importPath)
        'SWSPFSOUT պարամետրի փոփոխում
        Call SetParameter_InPttel("SWSPFSOUT" ,importPath)      
        'SWOUT պարամետրի փոփոխում
        Call SetParameter("SWOUT", "")  
    End Select        
    
    Call Close_Window(wMDIClient, "frmPttel")
    Login("ARMSOFT")

'-----------------------------------------------------------------------------
'----------------- Կատարել Ընդունել SWIFT համակարգից գործողությունը ------------------
'-----------------------------------------------------------------------------
    Log.Message "Կատարել Ընդունել SWIFT համակարգից գործողությունը",,,DivideColor
    
    Call ChangeWorkspace(c_SWIFT)
    Call Recieve_From_SWIFT(1)
    
'-------------------------------------------------------------------
'---------------- Ստուգում է փաստաթղթի առկայությունը --------------------
'-------------------------------------------------------------------
    Log.Message " Ստուգում է փաստաթղթի առկայությունը ",,,DivideColor       

    Call GoTo_Recieved_Messages (recieved, "|S.W.I.F.T. ²Þî                  |öáË³ÝóáõÙÝ»ñ|êï³óí³Í ÷áË³ÝóáõÙÝ»ñ")
    BuiltIn.Delay(4000) 

    'Ստուգում է փաստաթղթի առկայությունը
    If SearchInPttel("frmPttel",3, intBankTrans.common.docN) Then
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_View)
        'Ստուգում է հաղորդագրության պատուհանի բովանդակությունը
        Call InterBank_Transfer_Check(intBankTrans)   
        Call ClickCmdButton(1, "OK")       
    Else 
        Log.Error intBankTrans.common.docN & "  փաստաթղթի N-ով տողը չի գտնվել!" ,,, ErrorColor
    End If
    
    Log.Message "SQL ստուգում (Ընդունել SWIFT համակարգից գործողություն)ից հետո",,,SqlDivideColor
    Log.Message "fISN = "& intBankTrans.common.isn,,,SqlDivideColor
    
    Call DB_Initialize_205(intBankTrans.common.isn)
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  UETR:555  STID:001  MT:205  BMDOCNUM:PRMS2109079  REF:589  DATE:20210907  RINSTOP:A  RINSTID:30231810500000578901  RECINST:CBRAAM22XXX  RECOP:D  ACCCR:/ES  RECEIVER:jfhgfh  SUMMA:100  CUR:001  VERIFIED:0  ADDINFO:/REC/  BMNAME:MT000205#001  UNIQUEID:RUMMXXXXN}{3:{111:001}{121:5  RSBKMAIL:1  DELIV:0  USERID:  77  SNDREC:XXN}{3:{11:  PINSTOP:D  PAYINST:KB PROMETEi  PCOROP:A  PCORID:30231810500000578901  PCORBANK:PRMSRUMM091  MEDOP:A  MEDID:30231810500000578901  MEDBANK:PRMSRUMM016  ISCOVER:0  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",intBankTrans.common.isn,1)
    Call CheckDB_DOCS(intBankTrans.common.isn,"MT202   ","10",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում
    Call CheckQueryRowCount("DOCLOG","fISN",intBankTrans.common.isn,1)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","N","10","",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում
    Call CheckQueryRowCount("FOLDERS","fISN",intBankTrans.common.isn,1)
    Call CheckDB_FOLDERS_With_Like(dbFOLDERS(1),1)

    'SQL Ստուգում SW_MESSAGES աղուսյակում
    Call CheckQueryRowCount("SW_MESSAGES","fISN",intBankTrans.common.isn,1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES,1)
    
    Path1 = Project.Path & "Stores\SWIFT\HT205\Actual.txt"
    Path2 = Project.Path & "Stores\SWIFT\HT205\Expected.txt"
    IgnoreParams = "(..[/]..[/]..)|(.([0-9]):([0-9]).)"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ xml ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    
    Call Compare_Files(Path2, Path1, IgnoreParams)
    Call Close_Window(wMDIClient, "frmPttel")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''--- Ադմինի ԱՇՏ/Ստեղծված փաստաթղթերից հեռացնել ներմուծված փաստաթղթերը ---''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Ադմինի ԱՇՏ/Ստեղծված փաստաթղթերից հեռացնել ներմուծված փաստաթղթերը --",,,DivideColor
        
    'Մուտք Ադմինիստրարտոր ԱՇՏ 4.0
    Call ChangeWorkspace(c_Admin40)
    
    folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|êï»ÕÍí³Í ÷³ëï³ÃÕÃ»ñ"
    stDate = aqDateTime.Today
    enDate = aqDateTime.Today
    wUser = 77
    docType = ""
    Call OpenCreatedDocFolder(folderDirect, stDate, enDate, wUser, docType)
    
    Call SearchAndDelete("frmPttel", 2, intBankTrans.common.isn, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
    
    Call Close_Window(wMDIClient, "frmPttel")

'-----------------------------------------------------------------------------
'------ "S.W.I.F.T. ԱՇՏ/Պարամետրեր"-ում կատարել համապատասխան փոփոխությունները 2------
'-----------------------------------------------------------------------------
    Log.Message "-- S.W.I.F.T. ԱՇՏ/Պարամետրեր-ում կատարել համապատասխան փոփոխությունները 2--",,,DivideColor  
    
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |ä³ñ³Ù»ïñ»ñ")
    BuiltIn.Delay(3000)
    
    'SWMSG պարամետրի փոփոխում
    Call SetParameter_InPttel("SWMSG" ,"101,110,200,201,202,203,205")
    Call CheckQueryRowCount("PARAMS","fVALUE","101,110,200,201,202,203,205",1)
    
    fileFrom = Project.Path &"Stores\SWIFT\HT205\ImportFile\MT000205.RJE"
    fileTo = Project.Path &"Stores\SWIFT\HT205\ImportFile\Import\MT000205.RJE"

    'Ջնջում է Import թղթապանակի պարունակությունը
    aqFileSystem.DeleteFile(Project.Path &"Stores\SWIFT\HT205\ImportFile\Import\*")

    'Վերարտագրում է նախօրոք տրված ֆայլը մեկ այլ ֆայլի մեջ
    Call Read_Write_File_With_replace(fileFrom,fileTo,"","")    
    Login("ARMSOFT")

'-----------------------------------------------------------------------------
'----------------- Կատարել Ընդունել SWIFT համակարգից գործողությունը ------------------
'-----------------------------------------------------------------------------
    Log.Message "Կատարել Ընդունել SWIFT համակարգից գործողությունը",,,DivideColor
    
    Call ChangeWorkspace(c_SWIFT)
    Call Recieve_From_SWIFT(1)
    
'-------------------------------------------------------------------
'---------------- Ստուգում է փաստաթղթի առկայությունը --------------------
'-------------------------------------------------------------------
    Log.Message " Ստուգում է փաստաթղթի առկայությունը ",,,DivideColor       

    Call GoTo_Recieved_Messages (recieved, "|S.W.I.F.T. ²Þî                  |öáË³ÝóáõÙÝ»ñ|êï³óí³Í ÷áË³ÝóáõÙÝ»ñ")
    BuiltIn.Delay(4000) 

    'Ստուգում է փաստաթղթի առկայությունը
    If SearchInPttel("frmPttel",3, intBankTrans.common.docN) Then
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_View)
        'Ստուգում է հաղորդագրության պատուհանի բովանդակությունը
        Call InterBank_Transfer_Check(intBankTrans)   
        Call ClickCmdButton(1, "OK")       
    Else 
        Log.Error intBankTrans.common.docN & "  փաստաթղթի N-ով տողը չի գտնվել!" ,,, ErrorColor
    End If
    
    Log.Message "SQL ստուգում (Ընդունել SWIFT համակարգից գործողություն)ից հետո",,,SqlDivideColor
    Log.Message "fISN = "& intBankTrans.common.isn,,,SqlDivideColor
    
    Call DB_Initialize_205(intBankTrans.common.isn)
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  UETR:555  STID:001  MT:205  BMDOCNUM:PRMS2109079  REF:589  DATE:20210907  RINSTOP:A  RINSTID:30231810500000578901  RECINST:CBRAAM22XXX  RECOP:D  ACCCR:/ES  RECEIVER:jfhgfh  SUMMA:100  CUR:001  VERIFIED:0  ADDINFO:/REC/  BMNAME:MT000205#001  UNIQUEID:RUMMXXXXN}{3:{111:001}{121:5  RSBKMAIL:1  DELIV:0  USERID:  77  SNDREC:XXN}{3:{11:  PINSTOP:D  PAYINST:KB PROMETEi  PCOROP:A  PCORID:30231810500000578901  PCORBANK:PRMSRUMM091  MEDOP:A  MEDID:30231810500000578901  MEDBANK:PRMSRUMM016  ISCOVER:0  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",intBankTrans.common.isn,1)
    Call CheckDB_DOCS(intBankTrans.common.isn,"MT202   ","10",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում
    Call CheckQueryRowCount("DOCLOG","fISN",intBankTrans.common.isn,1)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","N","10","",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում
    Call CheckQueryRowCount("FOLDERS","fISN",intBankTrans.common.isn,1)
    Call CheckDB_FOLDERS_With_Like(dbFOLDERS(1),1)

    'SQL Ստուգում SW_MESSAGES աղուսյակում
    Call CheckQueryRowCount("SW_MESSAGES","fISN",intBankTrans.common.isn,1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES,1)
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ xml ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    Call Compare_Files(Path2, Path1, IgnoreParams)
    
    Call Close_Window(wMDIClient, "frmPttel")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''--- Ադմինի ԱՇՏ/Ստեղծված փաստաթղթերից հեռացնել ներմուծված փաստաթղթերը ---''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Ադմինի ԱՇՏ/Ստեղծված փաստաթղթերից հեռացնել ներմուծված փաստաթղթերը --",,,DivideColor
        
    'Մուտք Ադմինիստրարտոր ԱՇՏ 4.0
    Call ChangeWorkspace(c_Admin40)
    
    folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|êï»ÕÍí³Í ÷³ëï³ÃÕÃ»ñ"
    stDate = aqDateTime.Today
    enDate = aqDateTime.Today
    wUser = 77
    docType = ""
    Call OpenCreatedDocFolder(folderDirect, stDate, enDate, wUser, docType)
    
    Call SearchAndDelete("frmPttel", 2, intBankTrans.common.isn, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
    
    Call Close_Window(wMDIClient, "frmPttel")
    
    Call Close_AsBank()
End Sub

Sub Test_Initialize_SWIFT_205()
    
    Set recieved = New_Recieved()
    With recieved
        .sDate = aqDateTime.Today
        .eDate = aqDateTime.Today
    End With
    
    Set intBankTrans = New_InterBank_Transfer()
    With intBankTrans
        '1
        .common.uniqueETETransRef = "555"
        .common.serviceTypeID = "001"
        .common.msgType = "205"
        .common.docN = "PRMS2109079855"
        .common.reference = "589"
        .common.date = "07/09/21"
        .common.accWithInstType = "A"
        .common.accWithInstPID = "30231810500000578901"
        .common.accWithInst = "CBRAAM22XXX"
        .common.benClientType = "D"
        .common.benClientAcc = "/ES"
        .common.benClient = "jfhgfh"
        .common.sum = "100.00"
        .common.cur = "001"
        '2
        .add.addInfo = "/REC/"
        .add.fileName = "MT000205#001"
        .add.sendRecDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        '3
        .finOrg.ordInstType = "D"
        .finOrg.ordInstPID = ""
        .finOrg.ordInst = "KB PROMETEi"
        .finOrg.sendCorrType = "A"
        .finOrg.sendCorrPID = "30231810500000578901"
        .finOrg.sendCorr = "PRMSRUMM091"
        .finOrg.intInstType = "A"
        .finOrg.intInstPID = "30231810500000578901"
        .finOrg.intInst = "PRMSRUMM091"
        '4
        .preTransfer.check = False
    End With
End Sub

Sub DB_Initialize_205(fIsn)
    Set dbSW_MESSAGES = New_SW_MESSAGES()
    With dbSW_MESSAGES
        .fDOCNUM = "PRMS2109079855"
        .fISN = fIsn
        .fUNIQUEID = "RUMMXXXXN}{3:{111:001}{121:5"
        .fDATE = "20210907"
        .fMT = "205"
        .fCATEGORY = "1"
        .fSR = "2"
        .fSRBANK = "XXN}{3:{11:"
        .fSYS = "1"
        .fSTATE = "10"
        .fUSER = "77"
        .fACCDB = ""
        .fACCCR = "/ES                               "
        .fAMOUNT = "100.00"
        .fCURR = "001"
        .fPAYER = ""
        .fRECEIVER = "jfhgfh                          "
        .fAIM = "/REC/                           "
        .fBRANCH = ""
        .fDEPART = ""
    End With
    
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1)
        .fFOLDERID = "EPSFITRANS.20210907"
        .fNAME = "MT202   "
        .fKEY = fIsn
        .fISN = fIsn
        .fSTATUS = "0"
        .fCOM = "ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ"
        .fSPEC = "PRMS2109079855  001          100.002"
    End With 
End Sub