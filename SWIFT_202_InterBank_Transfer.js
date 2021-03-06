'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Common
'USEUNIT Library_Colour
'USEUNIT Library_CheckDB
'USEUNIT Constants
'USEUNIT Library_Contracts
'USEUNIT Main_Accountant_Filter_Library
Option Explicit
'Test Case ID 185487 sysType = 1 -SWIFT
'Test Case ID 185531 sysType = 2 -SPFS
Dim intBankTrans, sDATE, fDATE, settingsPath, fileFrom, fileTo,what, fWith, importPath, recieved
Dim isn, folderDirect, fBODY, transPayIsn, dbSW_MESSAGES, stDate, enDate, wUser, docType, dbFOLDERS
Dim SortArr(1), regex, Path1, Path2

Sub SWIFT_202_Interbank_Import_Test(sysType) 
    Call Test_Initialize_SWIFT_202()
    Call Initialize_AsBank("bank", sDATE, fDATE)
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    Login("ARMSOFT")

'----------------------------------------------------
'--------------- Կարգավորումների ներմուծում --------------
'----------------------------------------------------
    Log.Message "Կարգավորումների ներմուծում ",,,DivideColor
    settingsPath = Project.Path & "Stores\SWIFT\HT202\Settings\Setting_1.txt"'SWSMG - Պարամետրում ՛202՛ հաղորդագրությունը առկա չէ
    folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|Ð³Ù³Ï³ñ·³ÛÇÝ ³ßË³ï³ÝùÝ»ñ|îíÛ³ÉÝ»ñÇ Ý»ñÙáõÍáõÙ|ö³ëï³ÃÕÃ»ñÇ Ý»ñÙáõÍáõÙ"
    Call ChangeWorkspace(c_Admin40)
    BuiltIn.Delay(3000)
    Call Settings_Import(settingsPath,folderDirect)
    Login("ARMSOFT")
    Call CheckQueryRowCount("PARAMS","fVALUE","101,110,200,201,203,102,N99,103,N98,410,N96",1)

'-----------------------------------------------------------------------------
'------ "S.W.I.F.T. ԱՇՏ/Պարամետրեր"-ում կատարել համապատասխան փոփոխությունները-------
'-----------------------------------------------------------------------------
    Log.Message "-- S.W.I.F.T. ԱՇՏ/Պարամետրեր-ում կատարել համապատասխան փոփոխությունները --",,,DivideColor  
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |ä³ñ³Ù»ïñ»ñ")
    BuiltIn.Delay(3000)
    'Նոր փաստաթղթի համարի գեներացում
    fileFrom = Project.Path &"Stores\SWIFT\HT202\ImportFile\IA000392.RJE"
    fileTo = Project.Path &"Stores\SWIFT\HT202\ImportFile\Import\IA000393.RJE"
    what = "PRCB2109079860"
    fWith = what
    'Ջնջում է Import թղթապանակի պարունակությունը
    aqFileSystem.DeleteFile(Project.Path &"Stores\SWIFT\HT202\ImportFile\Import\*")
    Log.Message(fWith)
    
    'Վերարտագրում է նախօրոք տրված ֆայլը մեկ այլ ֆայլի մեջ` կատարելով փոփոխություն
    Call Read_Write_File_With_replace(fileFrom,fileTo,what,fWith)    
    'SWGPI Պարամետրի փոփոխում SQL հարցման միջոցով
    Call SetParameter("SWGPI", "1")
    importPath = Project.Path & "Stores\SWIFT\HT202\ImportFile\Import\"
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
    'Փակել Պարամետրեր թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
    Login("ARMSOFT")

'-----------------------------------------------------------------------------
'----------------- Կատարել Ընդունել SWIFT համակարգից գործողությունը ------------------
'-----------------------------------------------------------------------------
    Log.Message "Կատարել Ընդունել SWIFT համակարգից գործողությունը",,,DivideColor
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    Call Recieve_From_SWIFT (1)
    
'-------------------------------------------------------------------
'---------------- Ստուգում է փաստաթղթի առկայությունը --------------------
'-------------------------------------------------------------------
    Log.Message " Ստուգում է փաստաթղթի առկայությունը ",,,DivideColor       
    
    'Մուտք գործել Փոխանցումներ/Ստացված փոխանցումներ թղթապանակ
    Call GoTo_Recieved_Messages (recieved, "|S.W.I.F.T. ²Þî                  |öáË³ÝóáõÙÝ»ñ|êï³óí³Í ÷áË³ÝóáõÙÝ»ñ")
    intBankTrans.common.docN = fWith
    'Աղյուսակի տեսքի համեմատում
    Call ColumnSorting(SortArr, 2, "frmPttel")
    
    Path1 = Project.Path & "Stores\SWIFT\HT202\Actual_Pttel.txt"
    Path2 = Project.Path & "Stores\SWIFT\HT202\Expected_Pttel.txt"
    regex = "(\d{2}[/]\d{2}[/]\d{2})|(\d{2}:\d{2})|(PRCB\d{10})"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ txt ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    Call Compare_Files(Path2, Path1, regex)
    
    'Ստուգում է փաստաթղթի առկայությունը
    If SearchInPttel("frmPttel",3, intBankTrans.common.docN) Then
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_View)
        If wMDIClient.WaitVBObject("frmASDocForm",1000).Exists Then
            'Ստուգում է հաղորդագրության պատուհանի բովանդակությունը
            intBankTrans.common.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
            Call InterBank_Transfer_Check(intBankTrans)   
            Call ClickCmdButton(1, "OK")
        Else 
            Log.Error "Document window not found",,,ErrorColor
        End If 
    Else 
        Log.Error "Document row not found"        
    End If
    
    Log.Message "SQL ստուգում (Ընդունել SWIFT համակարգից գործողություն)ից հետո",,,SqlDivideColor
    Log.Message "fISN = "& intBankTrans.common.isn,,,SqlDivideColor
    'SQL
    Call DB_Initialize_202(intBankTrans.common.isn, intBankTrans.common.docN)
    'Ստանում է դուստր փաստաթղթի isn-ը 
    transPayIsn = Get_SQL_ColumnValue("DOCP", "fISN", "fPARENTISN = " & intBankTrans.common.isn)
    Log.Message "TransPay fISN = "& transPayIsn,,,SqlDivideColor
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",intBankTrans.common.isn,2)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","M","10","Received",1)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","N","33"," ",1)
    'Տարանցիկ վճարային փոխանցման ստուգում
    Call CheckQueryRowCount("DOCLOG","fISN",transPayIsn,1)
    Call CheckDB_DOCLOG(transPayIsn,"77","N","11","",1)
    'DOCS
    fBODY = "  MT:202  BMDOCNUM:"&intBankTrans.common.docN&"  REF:VTBR2109079860  DATE:20210907  RINSTOP:B  RINSTID:30231810500000578901  "_
            &"RECINST:vdssd  RECOP:A  RECEIVER:VTBRRUMM  SUMMA:300  CUR:001  VERIFIED:0  BMNAME:IA000393#001  "_
            &"BMIODATE:"& aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d") &"  UNIQUEID:AM22X#13N}{3:{119:COV}}{4:  RSBKMAIL:1  DELIV:0  "_
            &"USERID:  77  SNDREC:13N}{3:{19:  PINSTOP:A  PINSTID:30231810500000578901  PAYINST:POALILITXXX  ORGPAYOP:K  ORGPAYID:1660000234640101  "_
            &"ORGPAYER:Client 00002346                    Street 00002346  ORGPINSTOP:A  ORGPINSTID:30231810500000578901  ORGPAYINST:POALILITXXX  "_
            &"ORGMEDOP:C  ORGMEDID:30231810500000578901|MIDLAM22#05  ORGRINSTOP:A  ORGRINSTID:30231810500000578901  ORGRECINST:VTBRRUMM  ORGRECOP:D  "_
            &"ORGRECID:30231810500000578901  ORGRECEIVER:dsfdsf                             vdvd  ORGAIM:bfdgdfgdf  ORGADDINFO:/ACC/  ISCOVER:1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",intBankTrans.common.isn,1)
    Call CheckDB_DOCS(intBankTrans.common.isn,"MT202   ","10",fBODY,1)
    'Տարանցիկ վճարային փոխանցման ստուգում
    fBODY = "  USERID:  77  ACSBRANCH:00  ACSDEPART:1  DOCNUM:PRCB21  DATE:"& aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d") &"  "_
    &"ACC:0000003  RINSTOP:B  RECINST:vdssd  RINSTID:30231810500000578901  CORRACC:0000003  SUMMA:300  TOTAL:300  CUR:001  REPAY:0  "_
    &"PAYDATE:20210907  REF:VTBR2109079860  RECEIVER:VTBRRUMM  COVER:1  DUPLICATE:0  NONREZ:0  EPSSTATE:Received  "_
    &"BMDOCNUM1:"&intBankTrans.common.docN&"  SNDREC1:13N}{3:{19:  MT1:202  BMIODATE1:"& aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d") &"  "_
    &"PAYSYSIN:5  ACCTYPE:I  OPINSTOP:A  OPAYINST:POALILITXXX  OPINSTID:30231810500000578901  GRPBMDOCNUM1:"&intBankTrans.common.docN&"  GRPSUMMA1:300  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",transPayIsn,1)
    Call CheckDB_DOCS(transPayIsn,"TransPay","11",fBODY,1)    
    'DOCP
    Call CheckQueryRowCount("DOCP","fISN",transPayIsn,1)
    Call CheckDB_DOCP(transPayIsn,"TransPay",intBankTrans.common.isn,1)
    'SW_MESSAGES    
    Call CheckQueryRowCount("SW_MESSAGES","fISN",intBankTrans.common.isn,1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES,1)
    'FOLDERS
    Call CheckQueryRowCount("FOLDERS","fISN",intBankTrans.common.isn,1)
    Call CheckDB_FOLDERS(dbFOLDERS,1) 
    'Փակել Ստացված փոխանցումներ թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")

'------------------------------------------------------------------
'----------------- Ջնջում է ներմուծված փաստաթուղթը ---------------------
'------------------------------------------------------------------     
    Call ChangeWorkspace(c_Admin40)
    folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|êï»ÕÍí³Í ÷³ëï³ÃÕÃ»ñ"
    stDate = aqDateTime.Today
    enDate = aqDateTime.Today
    wUser = 77
    docType = ""
    'Մուտք Ստեղծված փաստաթղթեր թղթապանակ
    Call OpenCreatedDocFolder(folderDirect, stDate, enDate, wUser, docType)
    'Ջնջում է փաստաթղթի հետ կապակցված Տարանցիկ վճարային փոխանցման փաստաթուղթը
    Call SearchAndDelete( "frmPttel", 2, transPayIsn , "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ" ) 
    Call SearchAndDelete( "frmPttel", 2, intBankTrans.common.isn , "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ" ) 
    'Փակել Ստեղծված փաստաթղթեր թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
    
    
    'SQL
    Log.Message "SQL Ստուգումներ Ներմուծված հաղորդագրությունը ջնջելուց հետո հետո",,,SqlDivideColor
    'DOCLOG    
    Call CheckQueryRowCount("DOCLOG","fISN",intBankTrans.common.isn,4)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","M","10","Received",1)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","N","33"," ",1)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","M","10","DELETED",1)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","D","999"," ",1)
    'Տարանցիկ վճարային փոխանցման ստուգում
    Call CheckQueryRowCount("DOCLOG","fISN",transPayIsn,2)
    Call CheckDB_DOCLOG(transPayIsn,"77","N","11","",1)
    Call CheckDB_DOCLOG(transPayIsn,"77","D","999","",1)
    'DOCS                                       
    'Տարանցիկ վճարային փոխանցման ստուգում
    Call CheckQueryRowCount("DOCS","fISN",transPayIsn,1)
    Call CheckDB_DOCS(transPayIsn,"TransPay","999",fBODY,1)    
    
    fBODY = "  MT:202  BMDOCNUM:"&intBankTrans.common.docN&"  REF:VTBR2109079860  DATE:20210907  RINSTOP:B  RINSTID:30231810500000578901  "_
            &"RECINST:vdssd  RECOP:A  RECEIVER:VTBRRUMM  SUMMA:300  CUR:001  VERIFIED:0  BMNAME:IA000393#001  "_
            &"BMIODATE:"& aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d") &"  UNIQUEID:AM22X#13N}{3:{119:COV}}{4:  RSBKMAIL:1  DELIV:0  "_
            &"USERID:  77  SNDREC:13N}{3:{19:  PINSTOP:A  PINSTID:30231810500000578901  PAYINST:POALILITXXX  ORGPAYOP:K  ORGPAYID:1660000234640101  "_
            &"ORGPAYER:Client 00002346                    Street 00002346  ORGPINSTOP:A  ORGPINSTID:30231810500000578901  ORGPAYINST:POALILITXXX  "_
            &"ORGMEDOP:C  ORGMEDID:30231810500000578901|MIDLAM22#05  ORGRINSTOP:A  ORGRINSTID:30231810500000578901  ORGRECINST:VTBRRUMM  ORGRECOP:D  "_
            &"ORGRECID:30231810500000578901  ORGRECEIVER:dsfdsf                             vdvd  ORGAIM:bfdgdfgdf  ORGADDINFO:/ACC/  ISCOVER:1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",intBankTrans.common.isn,1)
    Call CheckDB_DOCS(intBankTrans.common.isn,"MT202   ","999",fBODY,1)

'---------------------------------------------------
'------------- Կարգավորումների ներմուծում-2 -------------
'---------------------------------------------------
    Log.Message "Կարգավորումների ներմուծում-2 (202 Հաղորդագրության ավելացում SWSM պարամետրում) ",,,DivideColor
    settingsPath = Project.Path & "Stores\SWIFT\HT202\Settings\Setting_2.txt"'SWSMG - Պարամետրում ՛202՛ հաղորդագրությունը առկա է
    folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|Ð³Ù³Ï³ñ·³ÛÇÝ ³ßË³ï³ÝùÝ»ñ|îíÛ³ÉÝ»ñÇ Ý»ñÙáõÍáõÙ|ö³ëï³ÃÕÃ»ñÇ Ý»ñÙáõÍáõÙ"
    BuiltIn.Delay(3000)
    Call Settings_Import(settingsPath,folderDirect)
    Login("ARMSOFT")
    Call CheckQueryRowCount("PARAMS","fVALUE","101,110,200,201,202,203,102,N99,103,N98,300,410,N96",1)

'-----------------------------------------------------------------------------
'------ "S.W.I.F.T. ԱՇՏ/Պարամետրեր"-ում կատարել համապատասխան փոփոխությունները-------
'-----------------------------------------------------------------------------
    Log.Message "-- S.W.I.F.T. ԱՇՏ/Պարամետրեր-ում կատարել համապատասխան փոփոխությունները --",,,DivideColor  
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    BuiltIn.Delay(3000)
    
    fileFrom = Project.Path &"Stores\SWIFT\HT202\ImportFile\IA000392.RJE"
    fileTo = Project.Path &"Stores\SWIFT\HT202\ImportFile\Import\IA000393.RJE"
    what = "PRCB2109079860"
    fWith = what
    Log.Message(fWith)
    
    'Վերարտագրում է նախօրոք տրված ֆայլը մեկ այլ ֆայլի մեջ` կատարելով փոփոխություն
    Call Read_Write_File_With_replace(fileFrom,fileTo,what,fWith)       
'-----------------------------------------------------------------------------
'----------------- Կատարել Ընդունել SWIFT համակարգից գործողությունը ------------------
'-----------------------------------------------------------------------------
    Log.Message "Կատարել Ընդունել SWIFT համակարգից գործողությունը",,,DivideColor
    Call Recieve_From_SWIFT (1)    
'-------------------------------------------------------------------
'---------------- Ստուգում է փաստաթղթի առկայությունը --------------------
'-------------------------------------------------------------------
    Log.Message " Ստուգում է փաստաթղթի առկայությունը ",,,DivideColor       
    
    'Մուտք գործել Փոխանցումներ/Ստացված փաստաթղթեր թղթապանակ
    Call GoTo_Recieved_Messages (recieved, "|S.W.I.F.T. ²Þî                  |öáË³ÝóáõÙÝ»ñ|êï³óí³Í ÷áË³ÝóáõÙÝ»ñ")
    intBankTrans.common.docN = fWith
    'Աղյուսակի տեսքի համեմատում
    Call ColumnSorting(SortArr, 2, "frmPttel")
    
    Path1 = Project.Path & "Stores\SWIFT\HT202\Actual_Pttel.txt"
    Path2 = Project.Path & "Stores\SWIFT\HT202\Expected_Pttel.txt"
    regex = "(\d{2}[/]\d{2}[/]\d{2})|(\d{2}:\d{2})|(PRCB\d{10})"
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ txt ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    Call Compare_Files(Path2, Path1, regex)
    
    'Ստուգում է փաստաթղթի առկայությունը
    If SearchInPttel("frmPttel",3, intBankTrans.common.docN) Then
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_View)
        'Ստուգում է հաղորդագրության պատուհանի բովանդակությունը
        If wMDIClient.WaitVBObject("frmASDocForm",1000).Exists Then
            'Փատաթղթի isn-ի ստացում
            intBankTrans.common.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
            Call InterBank_Transfer_Check(intBankTrans)   
            Call ClickCmdButton(1, "OK")
        Else 
            Log.Error "Document window not found",,,ErrorColor
        End If     
    Else 
        Log.Error "Document row not found"        
    End If
    
    Log.Message "SQL ստուգում (Ընդունել SWIFT համակարգից գործողություն)ից հետո",,,SqlDivideColor
    Log.Message "fISN = "& intBankTrans.common.isn,,,SqlDivideColor
    'SQL
    Call DB_Initialize_202(intBankTrans.common.isn, intBankTrans.common.docN)
    'Ստանում է դուստր փաստաթղթի isn-ը 
    transPayIsn = Get_SQL_ColumnValue("DOCP", "fISN", "fPARENTISN = " & intBankTrans.common.isn)
    Log.Message "TransPay fISN = "& transPayIsn,,,SqlDivideColor
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",intBankTrans.common.isn,2)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","M","10","Received",1)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","N","33"," ",1)
    'Տարանցիկ վճարային փոխանցման ստուգում
    Call CheckQueryRowCount("DOCLOG","fISN",transPayIsn,1)
    Call CheckDB_DOCLOG(transPayIsn,"77","N","11","",1)
    'DOCS
    fBODY = "  MT:202  BMDOCNUM:"&intBankTrans.common.docN&"  REF:VTBR2109079860  DATE:20210907  RINSTOP:B  RINSTID:30231810500000578901  "_
            &"RECINST:vdssd  RECOP:A  RECEIVER:VTBRRUMM  SUMMA:300  CUR:001  VERIFIED:0  BMNAME:IA000393#001  "_
            &"BMIODATE:"& aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d") &"  UNIQUEID:AM22X#13N}{3:{119:COV}}{4:  RSBKMAIL:1  DELIV:0  "_
            &"USERID:  77  SNDREC:13N}{3:{19:  PINSTOP:A  PINSTID:30231810500000578901  PAYINST:POALILITXXX  ORGPAYOP:K  ORGPAYID:1660000234640101  "_
            &"ORGPAYER:Client 00002346                    Street 00002346  ORGPINSTOP:A  ORGPINSTID:30231810500000578901  ORGPAYINST:POALILITXXX  "_
            &"ORGMEDOP:C  ORGMEDID:30231810500000578901|MIDLAM22#05  ORGRINSTOP:A  ORGRINSTID:30231810500000578901  ORGRECINST:VTBRRUMM  ORGRECOP:D  "_
            &"ORGRECID:30231810500000578901  ORGRECEIVER:dsfdsf                             vdvd  ORGAIM:bfdgdfgdf  ORGADDINFO:/ACC/  ISCOVER:1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",intBankTrans.common.isn,1)
    Call CheckDB_DOCS(intBankTrans.common.isn,"MT202   ","10",fBODY,1)
    'Տարանցիկ վճարային փոխանցման ստուգում
    fBODY = "  USERID:  77  ACSBRANCH:00  ACSDEPART:1  DOCNUM:PRCB21  DATE:"& aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d") &"  "_
    &"ACC:0000003  RINSTOP:B  RECINST:vdssd  RINSTID:30231810500000578901  CORRACC:0000003  SUMMA:300  TOTAL:300  CUR:001  REPAY:0  "_
    &"PAYDATE:20210907  REF:VTBR2109079860  RECEIVER:VTBRRUMM  COVER:1  DUPLICATE:0  NONREZ:0  EPSSTATE:Received  "_
    &"BMDOCNUM1:"&intBankTrans.common.docN&"  SNDREC1:13N}{3:{19:  MT1:202  BMIODATE1:"& aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d") &"  "_
    &"PAYSYSIN:5  ACCTYPE:I  OPINSTOP:A  OPAYINST:POALILITXXX  OPINSTID:30231810500000578901  GRPBMDOCNUM1:"&intBankTrans.common.docN&"  GRPSUMMA1:300  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",transPayIsn,1)
    Call CheckDB_DOCS(transPayIsn,"TransPay","11",fBODY,1)    
    'DOCP
    Call CheckQueryRowCount("DOCP","fISN",transPayIsn,1)
    Call CheckDB_DOCP(transPayIsn,"TransPay",intBankTrans.common.isn,1)
    'SW_MESSAGES    
    Call CheckQueryRowCount("SW_MESSAGES","fISN",intBankTrans.common.isn,1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES,1)
    'FOLDERS
    Call CheckQueryRowCount("FOLDERS","fISN",intBankTrans.common.isn,1)
    Call CheckDB_FOLDERS(dbFOLDERS,1) 
    'Փակել Ստացված փաստաթղթեր թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
'------------------------------------------------------------------
'----------------- Ջնջում է ներմուծված փաստաթուղթը ---------------------
'------------------------------------------------------------------     
    'Մուտք Ադմինիստրարտոր ԱՇՏ
    Call ChangeWorkspace(c_Admin40)
    folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|êï»ÕÍí³Í ÷³ëï³ÃÕÃ»ñ"
    stDate = aqDateTime.Today
    enDate = aqDateTime.Today
    wUser = 77
    docType = ""
    'Մուտք Ստեղծված փաստաթղթեր թղթապանակ
    Call OpenCreatedDocFolder(folderDirect, stDate, enDate, wUser, docType)
    
    'Ջնջում է փաստաթղթի հետ կապակցված Տարանցիկ վճարային փոխանցման փաստաթուղթը
    Call SearchAndDelete( "frmPttel", 2, transPayIsn , "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ" ) 
    'Ջնջում է ներմուծված փաստաթուղթը
    Call SearchAndDelete( "frmPttel", 2, intBankTrans.common.isn , "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ" ) 
    'Փակել Ստեղծված փաստաթղթեր թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
    
    'SQL
    Log.Message "SQL Ստուգումներ Ներմուծված հաղորդագրությունը ջնջելուց հետո հետո",,,SqlDivideColor
    'DOCLOG    
    Call CheckQueryRowCount("DOCLOG","fISN",intBankTrans.common.isn,4)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","M","10","Received",1)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","N","33"," ",1)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","M","10","DELETED",1)
    Call CheckDB_DOCLOG(intBankTrans.common.isn,"77","D","999"," ",1)
    'Տարանցիկ վճարային փոխանցման ստուգում
    Call CheckQueryRowCount("DOCLOG","fISN",transPayIsn,2)
    Call CheckDB_DOCLOG(transPayIsn,"77","N","11","",1)
    Call CheckDB_DOCLOG(transPayIsn,"77","D","999","",1)
    'DOCS                                       
    'Տարանցիկ վճարային փոխանցման ստուգում
    Call CheckQueryRowCount("DOCS","fISN",transPayIsn,1)
    Call CheckDB_DOCS(transPayIsn,"TransPay","999",fBODY,1)    
    
    fBODY = "  MT:202  BMDOCNUM:"&intBankTrans.common.docN&"  REF:VTBR2109079860  DATE:20210907  RINSTOP:B  RINSTID:30231810500000578901  "_
            &"RECINST:vdssd  RECOP:A  RECEIVER:VTBRRUMM  SUMMA:300  CUR:001  VERIFIED:0  BMNAME:IA000393#001  "_
            &"BMIODATE:"& aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d") &"  UNIQUEID:AM22X#13N}{3:{119:COV}}{4:  RSBKMAIL:1  DELIV:0  "_
            &"USERID:  77  SNDREC:13N}{3:{19:  PINSTOP:A  PINSTID:30231810500000578901  PAYINST:POALILITXXX  ORGPAYOP:K  ORGPAYID:1660000234640101  "_
            &"ORGPAYER:Client 00002346                    Street 00002346  ORGPINSTOP:A  ORGPINSTID:30231810500000578901  ORGPAYINST:POALILITXXX  "_
            &"ORGMEDOP:C  ORGMEDID:30231810500000578901|MIDLAM22#05  ORGRINSTOP:A  ORGRINSTID:30231810500000578901  ORGRECINST:VTBRRUMM  ORGRECOP:D  "_
            &"ORGRECID:30231810500000578901  ORGRECEIVER:dsfdsf                             vdvd  ORGAIM:bfdgdfgdf  ORGADDINFO:/ACC/  ISCOVER:1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",intBankTrans.common.isn,1)
    Call CheckDB_DOCS(intBankTrans.common.isn,"MT202   ","999",fBODY,1)

    Call Close_AsBank()

End Sub

Sub Test_Initialize_SWIFT_202()
    sDATE = "20020101"
    fDATE = "20260101"
    
    SortArr(0) = "BMNAME"
    SortArr(1) = "DOCNUM"
    
    Set recieved = New_Recieved()
    With recieved
        .sDate = aqDateTime.Today
        .eDate = aqDateTime.Today
        .mt = "202"
    End With
    
    Set intBankTrans = New_InterBank_Transfer
    With intBankTrans
        '1
        .common.msgType = "202"
        .common.reference = "VTBR2109079860"
        .common.date = "07/09/21"
        .common.accWithInstType = "B"
        .common.accWithInstPID = "30231810500000578901"
        .common.accWithInst = "vdssd"
        .common.benClientType = "A"
        .common.benClient = "VTBRRUMM"
        .common.sum = "300.00"
        .common.cur = "001"
        '2
        .add.fileName = "IA000393#001"
        .add.sendRecDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        '3
        .finOrg.ordInstType = "A"
        .finOrg.ordInstPID = "30231810500000578901"
        .finOrg.ordInst = "POALILITXXX"
        '4
        .preTransfer.ordClientType = "K"
        .preTransfer.ordClientAcc = "1660000234640101"
        .preTransfer.ordClient = "Client 00002346                    Street 00002346"
        .preTransfer.ordInstType = "A"
        .preTransfer.ordInstPID = "30231810500000578901"
        .preTransfer.ordInst = "POALILITXXX"
        .preTransfer.intInstType = "C"
        .preTransfer.intInstPID = "30231810500000578901|MIDLAM22#05"
        .preTransfer.accWithInstType = "A"
        .preTransfer.accWithInstPID = "30231810500000578901"
        .preTransfer.accWithInst = "VTBRRUMM"
        .preTransfer.benClientType = "D"
        .preTransfer.benClientAcc = "30231810500000578901"
        .preTransfer.benClient = "dsfdsf                             vdvd"
        .preTransfer.remitInfo = "bfdgdfgdf"
        .preTransfer.sendToRecInfo = "/ACC/"
    End With
 
End Sub

Sub DB_Initialize_202(fIsn, docN)
    Set dbSW_MESSAGES = New_SW_MESSAGES()
    With dbSW_MESSAGES
        .fDOCNUM = docN
        .fISN = fIsn
        .fUNIQUEID = "AM22X#13N}{3:{119:COV}}{4:  "
        .fDATE = "20210907"
        .fMT = "202"
        .fCATEGORY = "1"
        .fSR = "2"
        .fSRBANK = "13N}{3:{19:"
        .fSYS = "1"
        .fSTATE = "10"
        .fUSER = "77"
        .fACCDB = ""
        .fACCCR = ""
        .fAMOUNT = "300.00"
        .fCURR = "001"
        .fPAYER = ""
        .fRECEIVER = "VTBRRUMM"
        .fAIM = ""
        .fBRANCH = ""
        .fDEPART = ""
    End With
    
    Set dbFOLDERS = New_DB_FOLDERS()
    With dbFOLDERS
        .fFOLDERID = "EPSFITRANS.20210907"
        .fNAME = "MT202   "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "0"
        .fCOM = "ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ"
        .fSPEC = docN&"  001          300.002"
        .fECOM = ""
        .fDCBRANCH = "   "
        .fDCDEPART = "   "
    End With
End Sub
