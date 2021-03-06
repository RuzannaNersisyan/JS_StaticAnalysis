Option Explicit
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Common
'USEUNIT Library_Colour
'USEUNIT Library_CheckDB
'USEUNIT Constants
'USEUNIT Payment_Except_Library
'USEUNIT PayOrder_Receive_ConfirmPhases_Library

'Test case Id 181979 - Case 1(with SWIFT)
'Test case Id 185641 - Case 2(with SPFS)

Dim ForeignPaymentOrder
Dim dbFOLDERS(5),dbPAYMENTS,dbSW_MESSAGES
    
Sub SWIFT_103_Internatioanal_Payorder_Import_Test(SysType)

    Dim sDATE,fDATE
    Dim docNum,isn,fBODY
    Dim max,min,rand,fileFrom,fileTo,what,fWith
    Dim Path1,Path2
    Dim query,fPARENTISN,IgnoreParams
    Dim savePath,fName,fileName1,fileName2,Ignore
    Dim settingsPath,folderDirect
     
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20020101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Login("ARMSOFT")

''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''-- Կարգավորումների ներմուծում --''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կարգավորումների ներմուծում --",,,DivideColor
    
    settingsPath = Project.Path & "Stores\SWIFT\HT103\Settings\Setting_1.txt"
    folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|Ð³Ù³Ï³ñ·³ÛÇÝ ³ßË³ï³ÝùÝ»ñ|îíÛ³ÉÝ»ñÇ Ý»ñÙáõÍáõÙ|ö³ëï³ÃÕÃ»ñÇ Ý»ñÙáõÍáõÙ"
    Call ChangeWorkspace(c_Admin40)
    BuiltIn.Delay(3000)
    Call Settings_Import(settingsPath,folderDirect)
    Login("ARMSOFT")

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''--- "S.W.I.F.T. ԱՇՏ/Պարամետրեր"-ում կատարել համապատասխան փոփոխությունները---''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- S.W.I.F.T. ԱՇՏ/Պարամետրեր-ում կատարել համապատասխան փոփոխությունները --",,,DivideColor
        
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |ä³ñ³Ù»ïñ»ñ")
    BuiltIn.Delay(3000)
    
    max=100
    min=999
    Randomize
    rand = Int((max-min+1)*Rnd+min)
    fileFrom = Project.Path &"Stores\SWIFT\HT103\ImportFile\IA000385.RJE"
    fileTo = Project.Path &"Stores\SWIFT\HT103\ImportFile\Import\IA000387.RJE"
    aqFileSystem.DeleteFile(Project.Path &"Stores\SWIFT\HT103\ImportFile\Import\*")
    what = "UBSWCHZHXXXX901"
    fWith = "UBSWCHZHXXXX" & rand
    DocNum = "951394"
    
    Log.Message(fWith)
    
    'Վերարտագրում է նախօրոք տրված ֆայլը մեկ այլ ֆայլի մեջ` կատարելով փոփոխություն
    Call Read_Write_File_With_replace(fileFrom,fileTo,what,fWith)
    
    Select Case SysType
        Case 1
            Call SetParameter_InPttel("SWOUT",Project.Path & "Stores\SWIFT\HT103\ImportFile\Import\")
            
            Call SetParameter("SWSPFSACKDIR", "")
            Call SetParameter("SWSPFSNAKDIR", "")
            Call SetParameter("SWSPFSOUT", "")
        Case 2

            Call SetParameter_InPttel("SWSPFSACKDIR",Project.Path & "Stores\SWIFT\HT103\ImportFile\Import\")
            Call SetParameter_InPttel("SWSPFSNAKDIR",Project.Path & "Stores\SWIFT\HT103\ImportFile\Import\")
            Call SetParameter_InPttel("SWSPFSOUT",Project.Path & "Stores\SWIFT\HT103\ImportFile\Import\")
            
            Call SetParameter("SWOUT", "")
    End Select
    
    Call Close_Window(wMDIClient, "frmPttel")

    Login("ARMSOFT")
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''--- Կատարել Ընդունել SWIFT համակարգից գործողությունը ---''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարել Ընդունել SWIFT համակարգից գործողությունը --",,,DivideColor
    
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |Ð³Õáñ¹³·ñáõÃÛáõÝÝ»ñÇ ÁÝ¹áõÝáõÙ|ÀÝ¹áõÝ»É S.W.I.F.T. Ñ³Ù³Ï³ñ·Çó")
    
    Call MessageExists(2,"Ð³Õáñ¹³·ñáõÃÛ³Ý ÁÝ¹áõÝáõÙÝ ³í³ñïí»ó")
    Call ClickCmdButton(5, "OK")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''--- Ստուգում է փաստաթղթի առկայությունը ---''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Ստուգում է փաստաթղթի առկայությունը --",,,DivideColor       
    
    'Մուտք գործել "Արտաքին փոխանցումների ԱՇՏ"
    Call ChangeWorkspace(c_ExternalTransfers)
    Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|êï³óí³Í Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|Ð³ßí³éÙ³Ý »ÝÃ³Ï³")
    Call Rekvizit_Fill("Dialog",1,"General", "PERN",aqDateTime.Today)
    Call Rekvizit_Fill("Dialog",1,"General", "PERK",aqDateTime.Today)
    Call ClickCmdButton(2, "Î³ï³ñ»É") 
    BuiltIn.Delay(4000) 
    
    'Ստուգում է փաստաթղթի առկայությունը

    Call SearchInPttel("frmPttel",2, DocNum)
    
    'Վերցնում է հանձնարարգրի isn-ը
    isn = GetIsn()
    
    Log.Message "SQL ստուգում (Ընդունել SWIFT համակարգից գործողություն)ից հետո",,,SqlDivideColor
    Log.Message "fISN = "& isn,,,SqlDivideColor
    
    Call SQL_Initialize_For_SWIFT_103(isn) 
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  USERID:  77  ACSBRANCH:00  ACSDEPART:1  BLREP:0  DOCNUM:ART046  DATE:"&aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")&_
    "  ACCCR:7770003485010101  RECEIVER:1/asdfasdf  RECADDR:2/sdfgsdfg                         3/BE                               3/asdf  "&_
    "REALACC:7770003485010101  ACCDB:223041172402  PAYER:1/ABCD  PAYADDR:2/HASCE,POXOC                      3/AM/QAXAQ  SUMMA:6560  CUR:001"&_
    "  AIM:/ACC TO THE INVOICE                //N88/20 DD 13.09.2009  CLITRANS:1  PAYSYSIN:5  TOTAL:6560  XTOTAL:6560  OCUR:001  BMDOCNUM:600091016ART046"&_
    "  CORRACC:01080463012  EXPTYPE:BEN  FORTRADE:0  ACC2ACC:0  EPSSTATE:Received  INITDATE:20220131  CLICODE:00034850  COVER:1  DUPLICATE:0  "&_
    "RCORBANK:UBSWCHZHXXX  PINSTOP:A  PAYINST:CITIUS33  COUNTRY:US  INCHARGE:0  ACCTYPE:C  CORTYPE:3  SNDREC:UBSWCHZHXXX  MT:103  GRPBMDOCNUM:600091016ART046"&_
    "  GRPSUMMA:6560  BMIODATE:"&aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")&"  NOTSENDABLE:0  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",isn,1)
    Call CheckDB_DOCS(isn,"DbPayFor","10",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",isn,2)
    Call CheckDB_DOCLOG(isn,"77","N","10","",1)
    Call CheckDB_DOCLOG(isn,"77","T","10","",1)
    
    'SQL Ստուգում DOCP աղուսյակում  
    query = "Select fPARENTISN from DOCP WHERE fISN = " & isn
    fPARENTISN = my_Row_Count(query) 
    Call CheckQueryRowCount("DOCP","fISN",isn,1)
    Call CheckDB_DOCP(isn,"DbPayFor",fPARENTISN,1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",fPARENTISN,1)
    Call CheckDB_DOCSG(fPARENTISN,"PCHARGES","0","CUR","001",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում
    Call CheckQueryRowCount("FOLDERS","fISN",isn,3)
    Call CheckDB_FOLDERS_With_Like(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS_With_Like(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS_With_Like(dbFOLDERS(3),1)
    
    'SQL Ստուգում HI աղուսյակում
    Call CheckQueryRowCount("HI","fBASE",Isn,2)
    Call Check_HI_CE_accounting (aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d"),Isn, "11",  "1716909", "2624000.00", "001", "6560.00", "TRF", "D")
    Call Check_HI_CE_accounting (aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d"),Isn, "11",  "494591021", "2624000.00", "001", "6560.00", "TRF", "C")
    
    'SQL Ստուգում HIREST  աղուսյակում  
    Call CheckDB_HIREST("11", "1716909","2624000.00","001","6560.00",1)
    Call CheckDB_HIREST("11", "494591021","-2624000.00","001","-6560.00",1)

    'SQL Ստուգում SW_MESSAGES աղուսյակում
    dbSW_MESSAGES.fISN = fPARENTISN
    dbSW_MESSAGES.fUNIQUEID = "123456"&fWith&"2345678"

    Call CheckQueryRowCount("SW_MESSAGES","fISN",fPARENTISN,1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES,1)
    
    Path1 = Project.Path & "Stores\SWIFT\HT103\Actual.txt"
    Path2 = Project.Path & "Stores\SWIFT\HT103\Expected.txt"
    IgnoreParams = "(..[/]..[/]..)|(.([0-9]):([0-9]).)"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ xml ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    
    Call Compare_Files(Path2, Path1, IgnoreParams)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''-- Կատարում է "Հաշվառել" գործողությունը --''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարում է Հաշվառել գործողությունը--",,,DivideColor    
    
    'Կատարում է "Հաշվառել" գործողությունը
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)    
    Call wMainForm.PopupMenu.Click(c_DoTrans)
    
    Call Initialize_For_SWIFT_103()
    Call Check_Foreign_Payment_Order(ForeignPaymentOrder)
    
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    Call Close_Window(wMDIClient, "frmPttel")
    
    'ø³Õí³ÍùÇ å³ÑáõÙ
    savePath = Project.Path & "Stores\SWIFT\HT103\"
    fName = "Actual_Statement_1.txt"
    Call SaveDoc(savePath, fName)
    
    'êå³ëíáÕ ¨ ³éÏ³ ù³Õí³ÍùÝ»ñÇ Ñ³Ù»Ù³ïáõÙ   
    fileName1 = Project.Path & "Stores\SWIFT\HT103\Actual_Statement_1.txt"
    fileName2 = Project.Path & "Stores\SWIFT\HT103\Expected_Statement_1.txt"
    Ignore = "([0-9][0-9][/][0-9][0-9][/][0-9][0-9])|(.([0-9]):([0-9]).)|([[]...........)"
    Call Compare_Files(fileName2, fileName1, Ignore)
    Call Close_Window(wMDIClient, "FrmSpr")
    
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckQueryRowCount("DOCS","fISN",isn,1)
    Call CheckDB_DOCS(isn,"DbPayFor","7",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",isn,4)
    Call CheckDB_DOCLOG(isn,"77","T","2","",1)
    Call CheckDB_DOCLOG(isn,"77","E","7","",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում
    Call CheckQueryRowCount("FOLDERS","fISN",isn,1)
    Call CheckDB_FOLDERS_With_Like(dbFOLDERS(4),1)
    
    'SQL Ստուգում HI աղուսյակում
    Call CheckQueryRowCount("HI","fBASE",Isn,2)
    Call Check_HI_CE_accounting (aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d"),Isn, "01",  "1716909", "2624000.00", "001", "6560.00", "TRF", "D")
    Call Check_HI_CE_accounting (aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d"),Isn, "01",  "494591021", "2624000.00", "001", "6560.00", "TRF", "C")
        
    'SQL Ստուգում HIREST  աղուսյակում  
    Call CheckDB_HIREST("11", "1716909","0.00","001","0.00",2)
    Call CheckDB_HIREST("11", "494591021","0.00","001","0.00",2)
    
    'SQL Ստուգում PAYMENTS աղուսյակում 
    Call CheckQueryRowCount("PAYMENTS","fISN",Isn,1)
    Call CheckDB_PAYMENTS(dbPAYMENTS,1)
    
    'SQL Ստուգում SW_MESSAGES աղուսյակում
    Call CheckQueryRowCount("SW_MESSAGES","fISN",fPARENTISN,1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES,1)
    
    'Ստուգումէ պայմանագրի առկայությունը
    Call Check_Doc_In_Registered_Folder(docNum, aqDateTime.Today, aqDateTime.Today)     
    Call Close_Window(wMDIClient, "frmPttel")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''-- Կարգավորումների ներմուծում - 2 --'''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կարգավորումների ներմուծում - 2--",,,DivideColor
    
    'Մուտք գործել "Ադմին ԱՇՏ"
    settingsPath = Project.Path & "Stores\SWIFT\HT103\Settings\Setting_2.txt"
    Call ChangeWorkspace(c_Admin40)
    BuiltIn.Delay(3000)
    Call Settings_Import(settingsPath,folderDirect)

    Login("ARMSOFT")
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''--- "S.W.I.F.T. ԱՇՏ/Պարամետրեր"-ում կատարել համապատասխան փոփոխությունները---''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- S.W.I.F.T. ԱՇՏ/Պարամետրեր-ում կատարել համապատասխան փոփոխությունները --",,,DivideColor
    
    max=100
    min=999
    Randomize
    rand = Int((max-min+1)*Rnd+min)
    fileFrom = Project.Path &"Stores\SWIFT\HT103\ImportFile\IA000385.RJE"
    fileTo = Project.Path &"Stores\SWIFT\HT103\ImportFile\Import\IA000387.RJE"
    what = "UBSWCHZHXXXX901"
    fWith = "UBSWCHZHXXXX" & rand
    DocNum = "951394"
    
    Log.Message(fWith)
    
    'Վերարտագրում է նախօրոք տրված ֆայլը մեկ այլ ֆայլի մեջ` կատարելով փոփոխություն
    Call Read_Write_File_With_replace(fileFrom,fileTo,what,fWith)

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''--- Կատարել Ընդունել SWIFT համակարգից գործողությունը ---''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարել Ընդունել SWIFT համակարգից գործողությունը --",,,DivideColor
    
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |Ð³Õáñ¹³·ñáõÃÛáõÝÝ»ñÇ ÁÝ¹áõÝáõÙ|ÀÝ¹áõÝ»É S.W.I.F.T. Ñ³Ù³Ï³ñ·Çó")
    
    Call MessageExists(2,"Ð³Õáñ¹³·ñáõÃÛ³Ý ÁÝ¹áõÝáõÙÝ ³í³ñïí»ó")
    Call ClickCmdButton(5, "OK")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''--- Ստուգում է փաստաթղթի առկայությունը ---''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Ստուգում է փաստաթղթի առկայությունը --",,,DivideColor       
    
    'Մուտք գործել "Արտաքին փոխանցումների ԱՇՏ"
    Call ChangeWorkspace(c_ExternalTransfers)
    Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|êï³óí³Í Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|Ð³ßí³éÙ³Ý »ÝÃ³Ï³")
    Call Rekvizit_Fill("Dialog",1,"General", "PERN",aqDateTime.Today)
    Call Rekvizit_Fill("Dialog",1,"General", "PERK",aqDateTime.Today)
    Call ClickCmdButton(2, "Î³ï³ñ»É") 
    BuiltIn.Delay(4000) 
    
    'Ստուգում է փաստաթղթի առկայությունը
    Call SearchInPttel("frmPttel",2, DocNum)
    
    'Վերցնում է հանձնարարգրի isn-ը
    isn = GetIsn()
    
    Log.Message "SQL ստուգում (Ընդունել SWIFT համակարգից գործողություն)ից հետո",,,SqlDivideColor
    Log.Message "fISN = "& isn,,,SqlDivideColor
    
    Call SQL_Initialize_For_SWIFT_103(isn) 
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  USERID:  77  ACSBRANCH:00  ACSDEPART:1  BLREP:0  DOCNUM:ART046  DATE:"&aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")&_
    "  ACCCR:7770003485010101  RECEIVER:1/asdfasdf  RECADDR:2/sdfgsdfg                         3/BE                               3/asdf  "&_
    "REALACC:7770003485010101  ACCDB:223041172402  PAYER:1/ABCD  PAYADDR:2/HASCE,POXOC                      3/AM/QAXAQ  SUMMA:6560  CUR:001"&_
    "  AIM:/ACC TO THE INVOICE                //N88/20 DD 13.09.2009  CLITRANS:1  PAYSYSIN:5  TOTAL:6560  XTOTAL:6560  OCUR:001  BMDOCNUM:600091016ART046"&_
    "  CORRACC:01080463012  EXPTYPE:BEN  FORTRADE:0  ACC2ACC:0  EPSSTATE:Received  INITDATE:20220131  CLICODE:00034850  COVER:1  DUPLICATE:0  "&_
    "RCORBANK:UBSWCHZHXXX  PINSTOP:A  PAYINST:CITIUS33  COUNTRY:US  INCHARGE:0  ACCTYPE:C  CORTYPE:3  SNDREC:UBSWCHZHXXX  MT:103  GRPBMDOCNUM:600091016ART046"&_
    "  GRPSUMMA:6560  BMIODATE:"&aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")&"  NOTSENDABLE:0  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",isn,1)
    Call CheckDB_DOCS(isn,"DbPayFor","10",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",isn,2)
    Call CheckDB_DOCLOG(isn,"77","N","10","",1)
    Call CheckDB_DOCLOG(isn,"77","T","10","",1)
    
    'SQL Ստուգում DOCP աղուսյակում  
    query = "Select fPARENTISN from DOCP WHERE fISN = " & isn
    fPARENTISN = my_Row_Count(query) 
    Call CheckQueryRowCount("DOCP","fISN",isn,1)
    Call CheckDB_DOCP(isn,"DbPayFor",fPARENTISN,1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",fPARENTISN,1)
    Call CheckDB_DOCSG(fPARENTISN,"PCHARGES","0","CUR","001",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում
    Call CheckQueryRowCount("FOLDERS","fISN",isn,3)
    Call CheckDB_FOLDERS_With_Like(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS_With_Like(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS_With_Like(dbFOLDERS(3),1)
    
    'SQL Ստուգում HI աղուսյակում
    Call CheckQueryRowCount("HI","fBASE",Isn,2)
    Call Check_HI_CE_accounting (aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d"),Isn, "11",  "1716909", "2624000.00", "001", "6560.00", "TRF", "D")
    Call Check_HI_CE_accounting (aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d"),Isn, "11",  "494591021", "2624000.00", "001", "6560.00", "TRF", "C")
    
    'SQL Ստուգում HIREST  աղուսյակում  
    Call CheckDB_HIREST("11", "1716909","2624000.00","001","6560.00",1)
    Call CheckDB_HIREST("11", "494591021","-2624000.00","001","-6560.00",1)

    'SQL Ստուգում SW_MESSAGES աղուսյակում
    dbSW_MESSAGES.fISN = fPARENTISN
    dbSW_MESSAGES.fUNIQUEID = "123456"&fWith&"2345678"

    Call CheckQueryRowCount("SW_MESSAGES","fISN",fPARENTISN,1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES,1)
    
    Path1 = Project.Path & "Stores\SWIFT\HT103\Actual.txt"
    Path2 = Project.Path & "Stores\SWIFT\HT103\Expected.txt"
    IgnoreParams = "(..[/]..[/]..)|(.([0-9]):([0-9]).)"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ xml ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    
    Call Compare_Files(Path2, Path1, IgnoreParams)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''-- Կատարում է "Հաշվառել" գործողությունը --''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարում է Հաշվառել գործողությունը--",,,DivideColor    
    
    'Կատարում է "Հաշվառել" գործողությունը
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)    
    Call wMainForm.PopupMenu.Click(c_DoTrans)
    
    Call Initialize_For_SWIFT_103()
    Call Check_Foreign_Payment_Order(ForeignPaymentOrder)
    
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    Call Close_Window(wMDIClient, "frmPttel")
    
    'ø³Õí³ÍùÇ å³ÑáõÙ
    savePath = Project.Path & "Stores\SWIFT\HT103\"
    fName = "Actual_Statement_2.txt"
    Call SaveDoc(savePath, fName)
    
    'êå³ëíáÕ ¨ ³éÏ³ ù³Õí³ÍùÝ»ñÇ Ñ³Ù»Ù³ïáõÙ   
    fileName1 = Project.Path & "Stores\SWIFT\HT103\Actual_Statement_2.txt"
    fileName2 = Project.Path & "Stores\SWIFT\HT103\Expected_Statement_1.txt"
        Ignore = "([0-9][0-9][/][0-9][0-9][/][0-9][0-9])|(.([0-9]):([0-9]).)|([[]...........)"
    Call Compare_Files(fileName2, fileName1, Ignore)
    Call Close_Window(wMDIClient, "FrmSpr")
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckQueryRowCount("DOCS","fISN",isn,1)
    Call CheckDB_DOCS(isn,"DbPayFor","7",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",isn,4)
    Call CheckDB_DOCLOG(isn,"77","T","2","",1)
    Call CheckDB_DOCLOG(isn,"77","E","7","",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում
    Call CheckQueryRowCount("FOLDERS","fISN",isn,1)
    Call CheckDB_FOLDERS_With_Like(dbFOLDERS(4),1)
    
    'SQL Ստուգում HI աղուսյակում
    Call CheckQueryRowCount("HI","fBASE",Isn,2)
    Call Check_HI_CE_accounting (aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d"),Isn, "01",  "1716909", "2624000.00", "001", "6560.00", "TRF", "D")
    Call Check_HI_CE_accounting (aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d"),Isn, "01",  "494591021", "2624000.00", "001", "6560.00", "TRF", "C")
        
    'SQL Ստուգում HIREST  աղուսյակում  
    Call CheckDB_HIREST("11", "1716909","0.00","001","0.00",2)
    Call CheckDB_HIREST("11", "494591021","0.00","001","0.00",2)
    
    'SQL Ստուգում PAYMENTS աղուսյակում 
    Call CheckQueryRowCount("PAYMENTS","fISN",Isn,1)
    Call CheckDB_PAYMENTS(dbPAYMENTS,1)
    
    'SQL Ստուգում SW_MESSAGES աղուսյակում
    Call CheckQueryRowCount("SW_MESSAGES","fISN",fPARENTISN,1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES,1)
    
    'Ստուգումէ պայմանագրի առկայությունը
    Call Check_Doc_In_Registered_Folder(docNum, aqDateTime.Today, aqDateTime.Today)     
    Call Close_Window(wMDIClient, "frmPttel")
    
    Call Close_AsBank()
End Sub


Sub SQL_Initialize_For_SWIFT_103(fisn)
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1)
      .fFOLDERID = "C.977053288"
      .fNAME = "DbPayFor"
      .fKEY = fisn
      .fISN = fisn
      .fSTATUS = "1"
      .fCOM = "ØÇç³½·. í×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (ëï.)"
      .fSPEC = "%N- ART046 ¶áõÙ³ñ-             6,560.00 ²ñÅ.- 001%"
      .fECOM = "Foreign Payment Order (received)"
      .fDCBRANCH = ""
      .fDCDEPART = ""
    End With
    
    Set dbFOLDERS(2) = New_DB_FOLDERS()
    With dbFOLDERS(2)
      .fFOLDERID = "EPS."&fisn
      .fNAME = "DbPayFor"
      .fKEY = "600091016ART046 "
      .fISN = fisn
      .fSTATUS = "0"
      .fCOM = "ØÇç³½·. í×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (ëï.)"
      .fSPEC = "%00034850101011/asdfasdf                         01080463012CITIUS33XXX                                       US            0.00ÀÝ¹áõÝí³Í            BEN   77700            0.00 /ACC TO THE INVOICE                             600091016ART046          6560.00      77                                              5%"
      .fECOM = "Foreign Payment Order (received)"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(3) = New_DB_FOLDERS()
    With dbFOLDERS(3)
      .fFOLDERID = "PayI."&aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")
      .fNAME = "DbPayFor"
      .fKEY = fisn
      .fISN = fisn
      .fSTATUS = "1"
      .fCOM = "ØÇç³½·. í×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (ëï.)"
      .fSPEC = "%ART04677700010804630127770003485010101         6560.00001ÀÝ¹áõÝí³Í             77/ACC TO THE INVOICE             1/ABCD                          1/asdfasdf                         Received                        %"
      .fECOM = ""
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(4) = New_DB_FOLDERS()
    With dbFOLDERS(4)
      .fFOLDERID = "EPS."&fisn
      .fNAME = "DbPayFor"
      .fKEY = "600091016ART046 "
      .fISN = fisn
      .fSTATUS = "0"
      .fCOM = "ØÇç³½·. í×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (ëï.)"
      .fSPEC = "%UBSWCHZHXXX77700034850101011/asdfasdf                         01080463012CITIUS33XXX                                       US            0.00Ø³ñí³Í               BEN   77700            0.00 /ACC TO THE INVOICE                             600091016ART046          6560.00      77                                              5%"
      .fECOM = "Foreign Payment Order (received)"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With

    Set dbPAYMENTS = New_DB_PAYMENTS()
    With dbPAYMENTS
        .fISN = fISN
        .fDOCTYPE = "DbPayFor"
        .fDATE = ""&aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y"&"-"&"%m"&"-"&"%d")
        .fSTATE = "7"
        .fDOCNUM = "ART046"
        .fCLIENT = "00034850"
        .fACCDB = "223041172402    "
        .fPAYER = "1/ABCD                             "
        .fCUR = "001"
        .fSUMMA = "6560.00"
        .fSUMMAAMD = "2624000.00"
        .fSUMMAUSD = "6560.00"
        .fCOM = "/ACC TO THE INVOICE                //N88/20 DD 13.09.2009"
        .fPASSPORT = ""
        .fCOUNTRY = "US"
        .fACSBRANCH = "00 "
        .fACSDEPART = "1  "
    End With
    
    Set dbSW_MESSAGES = New_SW_MESSAGES()
    With dbSW_MESSAGES
       .fISN = "794416510"
       .fUNIQUEID = "123456UBSWCHZHXXXX9022345678"
       .fDATE = "2022-01-31"
       .fMT = "103"
       .fCATEGORY = "1"
       .fDOCNUM = "600091016ART046 "
       .fSR = "2"
       .fSRBANK = "UBSWCHZHXXX"
       .fSYS = "1"
       .fSTATE = "10"
       .fUSER = "77"
       .fACCDB = "223041172402                      "
       .fACCCR = "7770003485010101                  "
       .fAMOUNT = "6560.00"
       .fCURR = "001"
       .fPAYER = "1/ABCD                          "
       .fRECEIVER = "1/asdfasdf                      "
       .fAIM = "/ACC TO THE INVOICE             "
       .fBRANCH = ""
       .fDEPART = ""
    End With
End Sub
Sub Initialize_For_SWIFT_103()
    
    Set ForeignPaymentOrder = New_Foreign_Payment_Order()
    With ForeignPaymentOrder
        .Division = "00"
        .Department = "1"
        .NumberOfDocument = "ART046"
        .Date = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .AccountOfBeneficiaryClient = "77700/03485010101"
        .Receiver = "1/asdfasdf"
        .ReceiverAddress = "2/sdfgsdfg                         3/BE                               3/asdf"
        .AccountOfOrderingClient = "223041172402"
        .Payer = "1/ABCD"
        .PayerAddress = "2/HASCE,POXOC                      3/AM/QAXAQ"
        .Amount = "6,560.00"
        .Curr = "001"
        .RemittanceInformation = "/ACC TO THE INVOICE                //N88/20 DD 13.09.2009"
        .ClientTransfer = "1"
        .RepaymentDate = "/  /"
        .RecPaySystem = "5"
        .SentPaySystem = ""
        .NumberOfDocument20 = "600091016ART046"
        .Reference = ""
        .PacketNumber = ""
        .IDNumber = ""
        .SocialCard = ""
        .SenderToReceiverInformation = ""
        .TransitAccount = "" 
        .CorrespondentAccount = "01080463012"
        .DetailsOfCharges = "BEN"
        .TransferAim = ""
        .SanctionsScreeningInformation = ""
        .TypeOfAccountWithInstitution = ""
        .AccountWithInstitution = ""
        .PIDofAccountWithInstitution = ""
        .ReceiverBankCorrespondent = "UBSWCHZHXXX"
        .AccountOfReceiverBanksCorrespondent = ""
        .TypeOfIntermediaryInstitution = ""
        .IntermediaryInstitution = ""
        .PIDofIntermediaryInstitution = ""
        .TypeOfOrderingInstitution = "A"
        .OrderingInstitution = "CITIUS33"
        .PIDofOrderingInstitution = ""
        .Country = "US"
        .Commission = "0.00"
        .IncludeCharge = "0"
        .AccountType = "C"
        .Type1 = "3"
        .SenderReceiver = "UBSWCHZHXXX"
        .MsgType = "103"
        .Phone = ""
        .Refusal = ""
        .Residance = ""
        .ValueDate = "/  /"
        .DateSend = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .TimeSend = ""
    End With
End Sub