Option Explicit
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Common
'USEUNIT Library_Colour
'USEUNIT Library_CheckDB
'USEUNIT Constants
'USEUNIT CashOutput_Confirmpases_Library
'USEUNIT Library_Contracts
'USEUNIT Payment_Except_Library
'USEUNIT PayOrder_Receive_ConfirmPhases_Library
'USEUNIT Currency_Exchange_Confirmphases_Library
'USEUNIT BankMail_Library

'Test case Id 183743

Dim dbFOLDERS(2),dbCUREXCHANGES,currexchange
    
Sub SWIFT_103_Import_And_Repay_Exchange_Actions_Test()

    Dim sDATE,fDATE
    Dim docNum,fBODY, todayDate, wTime
    Dim max,min,rand,fileFrom,fileTo,what,fWith
    Dim VerificationDoc,SwiftIsn,Isn
    Dim savePath,fName,fileName1,fileName2,Ignore
    
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20020101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Login("ARMSOFT")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''--- "S.W.I.F.T. ԱՇՏ/Պարամետրեր"-ում կատարել համապատասխան փոփոխությունները---''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- S.W.I.F.T. ԱՇՏ/Պարամետրեր-ում կատարել համապատասխան փոփոխությունները --",,,DivideColor
        
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |ä³ñ³Ù»ïñ»ñ")
    BuiltIn.Delay(3000)
    
    If aqDateTime.Compare(aqConvert.DateTimeToFormatStr(aqDateTime.Time, "%H:%M"), "16:00") < 0 Then
         wTime = "1"
    Else
         wTime = "2"
    End If
    
    max=100
    min=999
    Randomize
    rand = Int((max-min+1)*Rnd+min)
    fileFrom = Project.Path &"Stores\SWIFT\HT103\ImportFile\IA000386.RJE"
    fileTo = Project.Path &"Stores\SWIFT\HT103\ImportFile\Import\IA000387.RJE"
    aqFileSystem.DeleteFile(Project.Path &"Stores\SWIFT\HT103\ImportFile\Import\*")
    todayDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d")
    what = "UBSWCHZHXXXX901"
    fWith = "UBSWCHZHXXXX" & rand
    
    Log.Message(fWith)
    
    'Վերարտագրում է նախօրոք տրված ֆայլը մեկ այլ ֆայլի մեջ` կատարելով փոփոխություն
    Call Read_Write_File_With_replace(fileFrom,fileTo,what,fWith)
    
    Call SetParameter_InPttel("SWOUT",Project.Path & "Stores\SWIFT\HT103\ImportFile\Import\")
    
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
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''--- Ստուգում է փաստաթղթի առկայությունը ---''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Ստուգում է փաստաթղթի առկայությունը --",,,DivideColor       
    
    'Մուտք գործել "Արտաքին փոխանցումների ԱՇՏ"
    Call ChangeWorkspace(c_ExternalTransfers)
    Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|êï³óí³Í Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|Ð³ßí³éÙ³Ý »ÝÃ³Ï³")
    Call Rekvizit_Fill("Dialog",1,"General", "PERN",aqDateTime.Today)
    Call Rekvizit_Fill("Dialog",1,"General", "PERK",aqDateTime.Today)
    Call ClickCmdButton(2, "Î³ï³ñ»É") 
    BuiltIn.Delay(4000) 
    
    'Ստուգում է փաստաթղթի առկայությունը
    docNum = "951394"
    Call SearchInPttel("frmPttel",2, DocNum)
    
    'Վերցնում է հանձնարարգրի isn-ը
    SwiftIsn = GetIsn()
    Log.Message "SWIFT fISN = "& SwiftIsn,,,SqlDivideColor
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''-- Հանձնարարգրում լրացնում է "Տարանցիկ հաշիվ" դաշտը --''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Հանձնարարգրում լրացնում է Տարանցիկ հաշիվ դաշտը --",,,DivideColor    
    
    'Խմբագրում է հանձնարարգիրը
    Call wMainForm.MainMenu.Click(c_AllActions)    
    Call wMainForm.PopupMenu.Click(c_ToEdit)
    'Լրացնում է "Տարանցիկ հաշիվ" դաշտը
    Call Rekvizit_Fill("Document",2,"General","TCORRACC","000548101")
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''-- Կատարում է "Հաշվառել" գործողությունը --''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարում է Հաշվառել գործողությունը--",,,DivideColor        
    
    'Կատարում է "Հաշվառել" գործողությունը
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_DoTrans)
    
    BuiltIn.Delay(2000)
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    Call Close_Window(wMDIClient, "frmPttel")
    Call Close_Window(wMDIClient, "FrmSpr")
    
    Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|êï³óí³Í Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|î³ñ³ÝóÇÏ")
    Call Rekvizit_Fill("Dialog",1,"General", "PERN",aqDateTime.Today)
    Call Rekvizit_Fill("Dialog",1,"General", "PERK",aqDateTime.Today)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''-- Կատարում է "Արտարժույթի փոխանակում" գործողությունը --'''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարում է Արտարժույթի փոխանակում գործողությունը--",,,DivideColor        
    
    Call wMainForm.MainMenu.Click(c_AllActions)    
    Call wMainForm.PopupMenu.Click(c_CurExch)
    
    Call Rekvizit_Fill("Document",1,"General", "CURCR","000")
    Call Rekvizit_Fill("Document",3,"General", "PASSNUM","AP001011")

    'Փաստաթղթի N դաշտի արժեքի և isn-ի վերագրում փոփոխականին
    docNum = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
    Isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn

    BuiltIn.Delay(2000)
    Call ClickCmdButton(1, "Î³ï³ñ»É")    
    BuiltIn.Delay(2000)
    
    Log.Message "SQL ստուգում Արտարժույթի փոխանակում-ից հետո",,,SqlDivideColor
    Log.Message "fISN = "& isn,,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում    
    fBODY = "  TYPECODE1:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  USERID:  77  ACSBRANCH:00"&_
    "  ACSDEPART:1  BLREP:0  DOCNUM:"&docNum&"  DATE:"&todayDate&"  ACCDB:000548101  ACCCR:000001100  CURDB:001  CURCR:000  CASH:1  COURSE:   340.0000/    1"&_
    "  CRSNAME:000 / 001  SUMDB:6560  SUMCR:2230400  CUPUSA:1  CURTES:1  CURVAIR:3  VOLORT:7  NONREZ:0  JURSTAT:21  AIMINCLUDESPLACE:0"&_
    "  CBCRS1:400.0000/1  CBCRS2:1/1  TIME:"&wTime&"  TYPECODE3:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  ACCCOMIS:000001100  CURCOMIS:000  COMCBCRS:1/1"&_
    "  INCACCCOM:001453300  PAYSYSIN:5  INCACCCUREX:000931900  EXPACCCUREX:001434300  SENT2SW:0  RECFROMSW:0  FRSHCASHAC:0  CANCELREQ:0"&_
    "  CBCONFIRMD:0  KASSA:001  CURIN:000  TOTALOUT:2230400  CUROUT:000  KASSIMOUT:052  PAYREC:1/asdfasdf  PASSNUM:AP001011  USEOVERLIMIT:0"&_
    "  SYSCASE:FromPay  NOTSENDABLECR:0  NOTSENDABLEDB:0  "
    
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",Isn,1)
    Call CheckDB_DOCS(Isn,"CurChng ","2",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում
    Call CheckQueryRowCount("DOCLOG","fISN",Isn,2)
    Call CheckDB_DOCLOG(Isn,"77","N","1","",1)
    Call CheckDB_DOCLOG(Isn,"77","C","2","",1)
    
    'SQL Ստուգում DOCP աղուսյակում  
    Call CheckQueryRowCount("DOCP","fISN",isn,1)
    Call CheckDB_DOCP(isn,"CurChng ",SwiftIsn,1)

    'SQL Ստուգում FOLDERS աղուսյակում
    Call SQL_Initialize_For_Actions(Isn,docNum)
    Call CheckQueryRowCount("FOLDERS","fISN",Isn,1)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    
    'SQL Ստուգում HI աղուսյակում
    Call CheckQueryRowCount("HI","fBASE",Isn,4)
    Call Check_HI_CE_accounting (aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d"),Isn, "11",  "1630510", "2230400.00", "001", "6560.00", "CEX", "D")
    Call Check_HI_CE_accounting (aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d"),Isn, "11",  "1630170", "2230400.00", "000", "2230400.00", "CEX", "C")
    Call Check_HI_CE_accounting (aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d"),Isn, "11",  "1629177", "393600.00", "000", "393600.00", "MSC", "C")
    Call Check_HI_CE_accounting (aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d"),Isn, "11",  "1630510", "393600.00", "001", "0.00", "MSC", "D")

    'SQL Ստուգում HIREST  աղուսյակում  
    Call CheckDB_HIREST("11", "1630170","-8765757.40","000","-8765757.40",1)
    Call CheckDB_HIREST("11", "1629177","-802878.50","000","-802878.50",1)
    
    Call Close_Window(wMDIClient, "frmPttel")
    
    'ø³Õí³ÍùÇ å³ÑáõÙ
    savePath = Project.Path & "Stores\SWIFT\HT103\"
    fName = "Actual_Statement_CurExch.txt"
    Call SaveDoc(savePath, fName)
    
    'êå³ëíáÕ ¨ ³éÏ³ ù³Õí³ÍùÝ»ñÇ Ñ³Ù»Ù³ïáõÙ   
    fileName1 = Project.Path & "Stores\SWIFT\HT103\Actual_Statement_CurExch.txt"
    fileName2 = Project.Path & "Stores\SWIFT\HT103\Expected_Statement_CurExch.txt"
    Ignore = "([0-9][0-9][/][0-9][0-9][/][0-9][0-9])|(.([0-9]):([0-9]).)|([[]...........)|([N].[0-9].[0-9]....)"
    
    Call Compare_Files(fileName2, fileName1, Ignore)
    Call Close_Window(wMDIClient, "FrmSpr")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''-- "Աշխատանքային փաստաթղթեր" թղթապանակից կատարել "Վավերացնել" գործողությունը --'''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարել Վավերացնել գործողությունը --",,,DivideColor   
        
    Call Initialize_For_Actions(docNum)
    'Մուտք Գլխավոր հաշվապահի ԱՇՏ
    Call ChangeWorkspace(c_ChiefAcc)
    
    wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ") 
    'Լրացնել "Ամսաթիվ" դաշտերը
    Call Rekvizit_Fill("Dialog",1,"General","PERN", aqDateTime.Today)
    Call Rekvizit_Fill("Dialog",1,"General","PERK", aqDateTime.Today)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    If WaitForPttel("frmPttel") Then
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_ToConfirm)
        BuiltIn.Delay(2000)
        'Ստուգել պատուհանում լրացված տվյալների ճշտությունը
        Call Currency_Exchange_Check(currexchange)
        Call ClickCmdButton(1, "Ð³ëï³ï»É")
        BuiltIn.Delay(2000)
        Call Close_Window(wMDIClient, "frmPttel")
    Else
        Log.Error "Can Not Open Աշխատանքային փաստաթղթեր pttel",,,ErrorColor      
    End If  
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckDB_DOCS(Isn,"CurChng ","101",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում
    Call CheckQueryRowCount("DOCLOG","fISN",Isn,4)
    Call CheckDB_DOCLOG(Isn,"77","N","1","",1)
    Call CheckDB_DOCLOG(Isn,"77","C","2","",1)
    Call CheckDB_DOCLOG(Isn,"77","W","3","",1)
    Call CheckDB_DOCLOG(Isn,"77","C","101","",1)

    'SQL Ստուգում FOLDERS աղուսյակում
    Call SQL_Initialize_For_Actions(Isn,docNum)
    dbFOLDERS(1).fSTATUS = "0"
    dbFOLDERS(1).fSPEC = docNum&"77700000548101  77700000001100           6560.00001àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý                                 771/asdfasdf"&_
    "                      AP001011                                               5                                                                                                                                                    "
    Call CheckQueryRowCount("FOLDERS","fISN",Isn,2)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''-- Գլխավոր հաշվապահ/Հաստատվող փաստաթղթեր(|) թղթապանակից կատարել "Վավերացնել" գործողությունը --''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարել Վավերացնել գործողությունը --",,,DivideColor   

    Set VerificationDoc = New_VerificationDocument()
        VerificationDoc.DocType = "CurChng"
    
    'Մուտք Գլխավոր հաշվապահի ԱՇՏ
    Call ChangeWorkspace(c_ChiefAcc)
    Call GoToVerificationDocument("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ (I)",VerificationDoc) 
    
    If WaitForPttel("frmPttel") Then
       Call ConfirmContractDoc(1, Isn, c_ToConfirm, 1, "Ð³ëï³ï»É")
    Else
        Log.Error "Can Not Open Հաստատվող փաստաթղթեր(|) Window",,,ErrorColor      
    End If
    
    Call Close_Window(wMDIClient, "frmPttel")
     
    Log.Message "SQL Check After To Confirm",,,SqlDivideColor
     
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  OPERTYPE:CEX  TYPECODE1:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  USERID:  77"&_
    "  ACSBRANCH:00  ACSDEPART:1  BLREP:0  DOCNUM:"&docNum&"  DATE:"&todayDate&"  ACCDB:000548101  ACCCR:000001100  CURDB:001  CURCR:000  CASH:1"&_
    "  COURSE:   340.0000/    1  CRSNAME:000 / 001  SUMDB:6560  SUMCR:2230400  CUPUSA:1  CURTES:1  CURVAIR:3  VOLORT:7  NONREZ:0  JURSTAT:21"&_
    "  AIMINCLUDESPLACE:0  CBCRS1:400.0000/1  CBCRS2:1/1  TIME:"&wTime&"  TYPECODE3:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  ACCCOMIS:000001100"&_
    "  CURCOMIS:000  COMCBCRS:1/1  INCACCCOM:001453300  PAYSYSIN:5  INCACCCUREX:000931900  EXPACCCUREX:001434300  SENT2SW:0  RECFROMSW:0"&_
    "  FRSHCASHAC:0  CANCELREQ:0  CBCONFIRMD:0  KASSA:001  CURIN:000  TOTALOUT:2230400  CUROUT:000  KASSIMOUT:052  PAYREC:1/asdfasdf"&_
    "  PASSNUM:AP001011  USEOVERLIMIT:0  SYSCASE:FromPay  NOTSENDABLECR:0  NOTSENDABLEDB:0  "
    
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckDB_DOCS(Isn,"CurChng ","11",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում
    Call CheckQueryRowCount("DOCLOG","fISN",Isn,6)
    Call CheckDB_DOCLOG(Isn,"77","W","102","",1)
    Call CheckDB_DOCLOG(Isn,"77","M","11","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում
    Call CheckQueryRowCount("FOLDERS","fISN",Isn,0)
    
    'SQL Ստուգում CUREXCHANGES աղուսյակում
    Call CheckQueryRowCount("CUREXCHANGES","fISN",Isn,1)
    Call CheckDB_CUREXCHANGES(dbCUREXCHANGES,1)

    Call Close_AsBank()         
End Sub

Sub Initialize_For_Actions(docNum)

    Set currexchange = New_CurrExchange(0, 0, 0)
    With currexchange
'        1 Ընդհանուր
         .commonTab.docN = docNum
        .commonTab.div = "00"
        .commonTab.dep = "1"
        .commonTab.fDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .commonTab.dAcc = "000548101"
        .commonTab.cAcc = "000001100"
        .commonTab.cur1 = "001"
        .commonTab.cur2 = "000"
        .commonTab.way = "1"
        .commonTab.course = "340.0000/1"
        .commonTab.sum1 = "6,560.00"
        .commonTab.sum2 = "2,230,400.00"
        .commonTab.buySell = "1"
        .commonTab.opType = "1"
        .commonTab.opPlace = "3"
        .commonTab.busField = "7"
        .commonTab.legalPos = "21"
'        2 Լրացուցիչ
        .addTab.CBCourse1 = "400.0000/1"
        .addTab.CBCourse2 = "1.0000/1"
        .addTab.comAcc = "000001100"
        If aqDateTime.Compare(aqConvert.DateTimeToFormatStr(aqDateTime.Time, "%H:%M"), "16:00") < 0 Then
            .addTab.fTime = "1"
        Else
            .addTab.fTime = "2"
        End If
        .addTab.comAccCur = "000"
        .addTab.incAccCom = "001453300  "
        .addTab.recPaySys = "5"
        .addTab.incCurrExch = "000931900"
        .addTab.expenseCurrExch = "001434300"
'        3 Դրամարկղ
         .cashDeskTab.cashDesk = "001"
         .cashDeskTab.totOutput = "2,230,400.00"
         .cashDeskTab.totOutputCur = "000"
        .cashDeskTab.totInputCur = "000"
        .cashDeskTab.totOutputSB = "052"
        .cashDeskTab.clientCode = ""
        .cashDeskTab.fName = "1/asdfasdf"
        .cashDeskTab.lName = ""
        .cashDeskTab.idNum = "AP001011"
        .cashDeskTab.issuedBy = ""
        .cashDeskTab.issueDate = "/  /"
        .cashDeskTab.socCard = ""
        .cashDeskTab.birthDate = "/  /"
    End With
End Sub    

Sub SQL_Initialize_For_Actions(fISN,docNum)
    
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1)
        .fFOLDERID = "Oper."&aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")
        .fNAME = "CurChng "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "5"
        .fCOM = "²ñï³ñÅáõÛÃÇ ÷áË³Ý³ÏáõÙ"
        .fSPEC = docNum&"77700000548101  77700000001100           6560.00001Üáñ                                                   771/asdfasdf    "&_
        "                  AP001011                                               5                                                                                                                                                    "
        .fECOM = "Currency Exchange"
        .fDCBRANCH = "00"
        .fDCDEPART = "1"
    End With 
    
    Set dbFOLDERS(2) = New_DB_FOLDERS()
    With dbFOLDERS(2)
        .fFOLDERID = "Ver."&aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")&"001"
        .fNAME = "CurChng "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "4"
        .fCOM = "²ñï³ñÅáõÛÃÇ ÷áË³Ý³ÏáõÙ"
        .fSPEC = docNum&"77700000548101  77700000001100           6560.00001  77                                1/asdfasdf"&_
        "                                                             5 "
        .fECOM = "Currency Exchange"
        .fDCBRANCH = "00"
        .fDCDEPART = "1"
    End With 
    
    Set dbCUREXCHANGES = New_DB_CUREXCHANGES()
    With dbCUREXCHANGES
        .fISN = fISN
        .fDOCTYPE = "CurChng "
        .fCOMPLETED = "1"
        .fEXPORTED = "0"
        .fDATE = aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")
        .fSTATE = "11"
        .fDOCNUM = docNum
        .fCLIENT = ""
        .fNAME = "1/asdfasdf                                                            "
        .fACCDB = "77700000548101  "
        .fCURDB = "001"
        .fSUMDB = "6560.00"
        .fACCCR = "77700000001100  "
        .fCURCR = "000"
        .fSUMCR = "2230400.00"
        .fCOM = ""
        .fPASSPORT = "AP001011                        "
        .fKASCODE = "001"
        .fCURCOMIS = "000"
        .fSUMCOMIS = "0.00"
        .fSUMCOMISAMD = "0.00"
        .fACSBRANCH = "00"
        .fACSDEPART = "1"
    End With
End Sub