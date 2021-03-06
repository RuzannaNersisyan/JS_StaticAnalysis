Option Explicit
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Common
'USEUNIT Library_Colour
'USEUNIT Library_CheckDB
'USEUNIT Constants
'USEUNIT CashOutput_Confirmpases_Library

'Test case Id 182872

Dim ForeignPaymentOrder,CashOutObject
Dim dbSW_MESSAGES,CheckCashOut
Dim CashOutIsn,wTabStrip,SwiftIsn
Dim dbFOLDERS(2)
    
Sub SWIFT_103_Import_And_CashOut_Actions_Test()

    Dim sDATE,fDATE
    Dim docNum,isn,fBODY
    Dim max,min,rand,fileFrom,fileTo,what,fWith
    
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
    
    max=100
    min=999
    Randomize
    rand = Int((max-min+1)*Rnd+min)
    fileFrom = Project.Path &"Stores\SWIFT\HT103\ImportFile\IA000385.RJE"
    fileTo = Project.Path &"Stores\SWIFT\HT103\ImportFile\Import\IA000387.RJE"
    aqFileSystem.DeleteFile(Project.Path &"Stores\SWIFT\HT103\ImportFile\Import\*")
    what = "UBSWCHZHXXXX901"
    fWith = "UBSWCHZHXXXX" & rand
    
    Log.Message(fWith)
    
    'Վերարտագրում է նախօրոք տրված ֆայլը մեկ այլ ֆայլի մեջ` կատարելով փոփոխություն
    Call Read_Write_File_With_replace(fileFrom,fileTo,what,fWith)
    
    Call SetParameter_InPttel("SWOUT",Project.Path & "Stores\SWIFT\HT103\ImportFile\Import\")
    Call SetParameter_InPttel("SWGPI", "1")
    
    Login("ARMSOFT")
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''--- Կատարել Ընդունել SWIFT համակարգից գործողությունը ---''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարել Ընդունել SWIFT համակարգից գործողությունը --",,,DivideColor
    
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |Ð³Õáñ¹³·ñáõÃÛáõÝÝ»ñÇ ÁÝ¹áõÝáõÙ|ÀÝ¹áõÝ»É S.W.I.F.T. Ñ³Ù³Ï³ñ·Çó")
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
    
    Call Initialize_For_Check_SWIFT()
    Call Check_Foreign_Payment_Order(ForeignPaymentOrder)
    
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    Call Close_Window(wMDIClient, "frmPttel")
    Call Close_Window(wMDIClient, "FrmSpr")
    
    Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|êï³óí³Í Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|î³ñ³ÝóÇÏ")
    Call Rekvizit_Fill("Dialog",1,"General", "PERN",aqDateTime.Today)
    Call Rekvizit_Fill("Dialog",1,"General", "PERK",aqDateTime.Today)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''-- Կատարում է "Դիտել փաստաթուղթը մասերով" գործողությունը --''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարում է Դիտել փաստաթուղթը մասերով գործողությունը--",,,DivideColor        
    
    Call wMainForm.MainMenu.Click(c_AllActions)    
    Call wMainForm.PopupMenu.Click(c_PrintDocParts)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    Call Close_Window(wMDIClient, "FrmSpr")

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''-- Կատարում է "Հաճախորդի թղթապանակ" գործողությունը --'''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարում է Հաճախորդի թղթապանակ գործողությունը--",,,DivideColor        
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ClFolder)
    
    Call Close_Window(wMDIClient, "frmPttel_2")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''-- Կատարում է "Դիտել ձևակերպումները" գործողությունը --''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարում է Դիտել ձևակերպումները գործողությունը--",,,DivideColor        
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ViewTrasaction)
    
    Call Close_Window(wMDIClient, "frmPttel_2")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''-- Կատարում է "Կապակցված հաղորդագրություններ" գործողությունը --''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարում է Կապակցված հաղորդագրություններ գործողությունը--",,,DivideColor        
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_RelatedMessages)

    Call Close_Window(wMDIClient, "frmPttel_2")
        
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''-- Կատարում է "Պատասխանել (Gpi)" գործողությունը --'''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարում է Պատասխանել (Gpi) գործողությունը--",,,DivideColor        
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AnswerGpi)
    
    Call Rekvizit_Fill("Dialog",1,"General", "RESPONSE","ACSP")
    
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    Isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    
    Log.Message "SQL ստուգում Պատասխանել (Gpi)-ից հետո",,,SqlDivideColor
    Log.Message "fISN = "& isn,,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  CATEGORY:1  REFERENCE:600091016ART046  //BESTAM22XXX    //USD6560,   //:71F:USD0,   //:71F:USD0,  VERIFIED:0  USERID:  77  RSBKMAIL:0  DELIV:0  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",isn,1)
    Call CheckDB_DOCS(isn,"MTN99   ","9",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",isn,2)
    Call CheckDB_DOCLOG(isn,"77","N","1","",1)
    Call CheckDB_DOCLOG(isn,"77","C","9","",1)
    
    'SQL Ստուգում DOCP աղուսյակում  
    Call CheckQueryRowCount("DOCP","fISN",isn,1)
    
    'SQL Ստուգում SW_MESSAGES աղուսյակում
    Dim query,fPARENTISN
    query = "Select fPARENTISN from DOCP WHERE fISN = " & isn
    fPARENTISN = my_Row_Count(query) 
    dbSW_MESSAGES.fISN = fPARENTISN
    dbSW_MESSAGES.fUNIQUEID = "123456"&fWith&"2345678"

    Call CheckQueryRowCount("SW_MESSAGES","fISN",fPARENTISN,1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES,1)

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''-- Կատարում է "Կանխիկ ելք" գործողությունը --''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարում է Կանխիկ ելք գործողությունը--",,,DivideColor  
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_CashOut)
    
    BuiltIn.Delay(2000)
    'Փաստաթղթի N դաշտի արժեքի վերագրում
    CheckCashOut.commonTab.DocNum = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
    BuiltIn.Delay(2000)
    
    Call Check_Cash_Output(CheckCashOut) 
    Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")
        wTabStrip.SelectedItem = wTabStrip.Tabs(1)

    CashOutIsn = Fill_CashOut(CashOutObject)
    BuiltIn.Delay(2000)
    Call Close_Window(wMDIClient, "FrmSpr")
    
    Log.Message "DocNum = " & CashOutObject.DocNum,,,DivideColor2    
    Log.Message "fISN = " & CashOutIsn ,,,SqlDivideColor
    
    Call SQL_Initialize_For_Actions(CashOutIsn,CashOutObject.DocNum)
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  ACSBRANCH:00  ACSDEPART:1  BLREP:0  OPERTYPE:MSC  TYPECODE:-20 21 22 23 24 30 31 32 25 26 93 11 27 33 28  USERID:  77  DOCNUM:"&CashOutObject.DocNum&"  "&_
            "DATE:20230202  ACCDB:000548101  CUR:001  KASSA:001  ACCCR:000001101  SUMMA:6560  TOTAL:6560  KASSIMV:052  BASE:Ð³Ù³Ó³ÛÝ å³ÛÙ³Ý³·ñÇ  "&_
            "AIM:Ð³Ù³Ó³ÛÝ Ã. Ñ³ßíÇ  CLICODE:00000678  RECEIVER:master  RECEIVERLASTNAME:1_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²Ý"&_
            "áõÝ_²ÝáõÝ_22  PASSNUM:AP125485124  PASTYPE:01  PASBY:005  DATEPASS:20030101  DATEEXPIRE:20260101  DATEBIRTH:19970726  CITIZENSHIP:1  "&_
            "COUNTRY:AM  COMMUNITY:010010130  CITY:Yerevan  APARTMENT:1212112111  ADDRESS:Mikoyan  BUILDNUM:1222222222  EMAIL:aaa@mail.ru  FROMPAYOR"&_
            "D:1  ACSBRANCHINC:00  ACSDEPARTINC:1  CHRGACC:000548101  TYPECODE2:-20 21 22 23 24 30 31 32 25 26 93 11 27 33 28  CHRGCUR:001  CHRGCBCRS"&_
            ":400.0000/1  FRSHNOCRG:0  VOLORT:9X  NONREZ:0  JURSTAT:11  PAYSYSIN:5  XCUR:000  XACC:000001100  XDLCRS:   340.0000/    1  XDLCRSNAME:000"&_
            " / 001  XCBCRS:400.0000/1  XCBCRSNAME:000 / 001  XCUPUSA:1  XSUMMAIN:6560  XINC:000931900  XEXP:001434300  NOTSENDABLE:0  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",CashOutIsn,1)
    Call CheckDB_DOCS(CashOutIsn,"KasRsOrd","2",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում
    Call CheckQueryRowCount("DOCLOG","fISN",CashOutIsn,2)
    Call CheckDB_DOCLOG(CashOutIsn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(CashOutIsn,"77","C","2"," ",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում
    Call CheckQueryRowCount("FOLDERS","fISN",CashOutIsn,2)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    
    'SQL Ստուգում HI աղուսյակում
    Call CheckQueryRowCount("HI","fBASE",CashOutIsn,2)
    Call Check_HI_CE_accounting ("20230202",CashOutIsn, "11", "1630171","2624000.00", "001", "6560.00", "MSC", "C")
    Call Check_HI_CE_accounting ("20230202",CashOutIsn, "11", "1630510","2624000.00", "001", "6560.00", "MSC", "D")
    Call Close_Window(wMDIClient, "frmPttel")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''-- "Աշխատանքային փաստաթղթեր" թղթապանակից կատարել "Վավերացնել" գործողությունը --'''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարել Վավերացնել գործողությունը --",,,DivideColor   
        
    'Մուտք Գլխավոր հաշվապահի ԱՇՏ
    Call ChangeWorkspace(c_ChiefAcc)
    
    wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ") 
    'Լրացնել "Ամսաթիվ" դաշտերը
    Call Rekvizit_Fill("Dialog",1,"General","PERN", "010123")
    Call Rekvizit_Fill("Dialog",1,"General","PERK", "010124")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    If WaitForPttel("frmPttel") Then
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_ToConfirm)
        BuiltIn.Delay(2000)
        Call ClickCmdButton(1, "Ð³ëï³ï»É")
        BuiltIn.Delay(2000)
        Call Close_Window(wMDIClient, "frmPttel")
    Else
        Log.Error "Can Not Open Աշխատանքային փաստաթղթեր pttel",,,ErrorColor      
    End If  
    
    Call Close_AsBank()   
End Sub

Sub Initialize_For_Check_SWIFT()
    
    Set CheckCashOut = New_CashOutput()
				With CheckCashOut
								.commonTab.office = "00"
        .commonTab.department = "1"
        .commonTab.date = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .commonTab.dateForCheck = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .commonTab.cashRegister = "001"
        .commonTab.cashRegisterAcc = "000001101"
        .commonTab.curr = "001"
        .commonTab.accDebet = "000548101"
        .commonTab.amount = "6,560.00"
        .commonTab.amountForCheck = "6,560.00"
        .commonTab.cashierChar = "052"
        .commonTab.name = "1/asdfasdf                         2/sdfgsdfg"

        .chargeTab.office = .commonTab.office
        .chargeTab.department = .commonTab.department
        .chargeTab.chargeAcc = "000548101"
        .chargeTab.chargeAccForCheck = "000548101"
        .chargeTab.chargeCurr = "001"
        .chargeTab.chargeCurrForCheck = "001"
        .chargeTab.cbExchangeRate = "400.0000/1"
        .chargeTab.commonPaySys = "5"
        
        .chargeTab.chargePercent = "0.0000"
        .chargeTab.incomeAccCurr = "001"
        .chargeTab.nonResident = 0
        .chargeTab.nonResidentForCheck = 0
    
				End With

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
        .TransitAccount = "000548101" 
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
    
    Set CashOutObject = New_CashOut()
    With CashOutObject
        .Date = "020223"
        .Base = "Ð³Ù³Ó³ÛÝ å³ÛÙ³Ý³·ñÇ"
        .Aim = "Ð³Ù³Ó³ÛÝ Ã. Ñ³ßíÇ"
        .Depositor = "00000678"
        .FirstName = "master"
        .LastName = "1_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_²ÝáõÝ_22"
        .IdNumber = "AP125485124"
        .IdType = "01"
        .Issued = "005"
        .IssuedDate = "010103"
        .DateOfExpire = "010126"
        .DateOfBirth = "260797"
        .Citizenship = "1"
        .Country = "AM"
        .Community = "010010130"
        .City   = "Yerevan"
        .Flat  = "1212112111"
        .Street = "Mikoyan"
        .House = "1222222222"
        .Email = "aaa@mail.ru"
        .AmountInPrimaryCurr = "6,560.00"
    End With 
    
    Set dbSW_MESSAGES = New_SW_MESSAGES()
    With dbSW_MESSAGES
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

Sub SQL_Initialize_For_Actions(fISN,docNum)
    
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1)
        .fFOLDERID = "C.737994605"
        .fNAME = "KasRsOrd"
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "5"
        .fCOM = "Î³ÝËÇÏ »Éù"
        .fSPEC = "²Ùë³ÃÇí- 02/02/23 N- "&docNum&" ¶áõÙ³ñ-             6,560.00 ²ñÅ.- 001 [Üáñ]"
        .fECOM = "Cash Withdrawal Advice"
    End With  
    
    Set dbFOLDERS(2) = New_DB_FOLDERS()
    With dbFOLDERS(2)
        .fFOLDERID = "Oper.20230202"
        .fNAME = "KasRsOrd"
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "5"
        .fCOM = "Î³ÝËÇÏ »Éù"
        .fSPEC = docNum&"77700000548101  77700000001101           6560.00001Üáñ                                                   77master 1_²ÝáõÝ_²Ýá"&_
                 "õÝ_²ÝáõÝ_²ÝáõÝAP125485124 005 01/01/2003                             5        Ð³Ù³Ó³ÛÝ Ã. Ñ³ßíÇ Ð³Ù³Ó³ÛÝ å³ÛÙ³Ý³·ñÇ                                                                                                       "
        .fECOM = "Cash Withdrawal Advice"
        .fDCBRANCH = "00"
        .fDCDEPART = "1"
    End With  

End Sub