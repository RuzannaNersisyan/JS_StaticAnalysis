'USEUNIT Library_Common 
'USEUNIT Library_Colour
'USEUNIT Constants
'USEUNIT Subsystems_Special_Library
'USEUNIT Mortgage_Library
'USEUNIT Library_Contracts
'USEUNIT Library_CheckDB
'USEUNIT Deposit_Library
'USEUNIT Card_Library

Option Explicit
'Test Case Id - 157165
Dim NewDepositCondition,DepositRentalAgr_ForCheck,DepositRental
Dim Isn,Deposit_Box_WorkingAgr_Filter,WorkingAgreement
Dim DepositBoxRentalFilter,RegisterForDepositBox
Dim dbFOLDERS(6),fBODY,Query
Dim Client

'Պահատեղերի ԱՇՏ
Sub Check_DepositOnClient()
    
    Dim sDATE,fDATE
    
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20020101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Login("ARMSOFT")
    
    Call Test_InitializeDepositOnClient()

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''--- Մուտք գործել "Հաճախորդներ" թղթապանակ ---'''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    
    'Մուտք գործել "Պլաստիկ քարտերի ԱՇՏ (SV)"
    Call ChangeWorkspace(c_CardsSV)  
    Call GoToClients_PlasticCarts(Client)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''--- Հաճախորդի վրայից ստեղծել Պահատեղ վարձ.պայմանագիր ---'''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Right Click(Create Deposit box rental Agreement/Ստեղծել Պահատեղ վարձ.պայմանագիր) ---",,,DivideColor
    
    Call Create_DepositRental(c_CreateCard &"|"& c_ParcelLeaseAgr,NewDepositCondition,DepositRentalAgr_ForCheck,DepositRental)
    Call Close_Pttel("frmPttel")
    Log.Message "DepositRental fISN = "& DepositRental.Isn,,,SqlDivideColor
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Պահատեղի աշխատանքային փաստաթղթեր-ից կատարել Գանձում/տրամադրում գործողությունը ---'''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Check RC - Charge/Provide Action ---",,,DivideColor
    
    'Մուտք գործել "Պահատեղերի ԱՇՏ"
    Call ChangeWorkspace(c_Deposit_Boxes)
    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
    
    If WaitForPttel("frmPttel") Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_ChargeAndProvide)
        BuiltIn.Delay(2000)
        'ISN-ի վերագրում փոփոխականին
        Isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
        'Լրացնում է "Փաստաթղթի N" դաշտը
        Call Rekvizit_Fill("Document",1,"General","DOCNUM","000866")
        Call ClickCmdButton(1, "Î³ï³ñ»É")
        BuiltIn.Delay(4000)
        If wMDIClient.WaitVBObject("FrmSpr",1000).Exists Then
          wMDIClient.VBObject("FrmSpr").Close
        End If  
        Call Close_Pttel("frmPttel")  
    Else
        Log.Error "Can Not Open Deposit Boxes Working Agreement pttel",,,ErrorColor      
    End If
    
    Log.Message "SQL Check After RC - Charge/Provide Action",,,SqlDivideColor
    Log.Message "fISN = "& ISN,,,SqlDivideColor
    
    Call SQL_Initialize_OnClient(ISN)
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  USERID:  77  ACSBRANCH:00  ACSDEPART:1  DOCNUM:000866  DATE:20200101  CLICODE:00000019  INCACCCUREX:000931900  EXPACCCUREX:001434300  PAYSYSIN:Ð  USEOVERLIMIT:0  CURTES:1  CURVAIR:3  SYSCASE:DEPBOX  SBQENABLED:0  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",ISN,1)
    Call CheckDB_DOCS(ISN,"GenOrdPk","9",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",ISN,1)
    Call CheckDB_DOCLOG(ISN,"77","N","9"," ",1)
    
    'SQL Ստուգում DOCP աղուսյակում  
    Call CheckQueryRowCount("DOCP","fISN",ISN,1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",ISN,39)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","ACCCR","000355101  ",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","1","ACCCR","00000110700",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","2","ACCCR","00000451000",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","AIM","öáËÏå. Ñ³ßíÇó í×/Linked Acc. Paym                                                                                                           ",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","1","AIM","ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 123456789                                                                                              ",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","2","AIM","²²Ð` 20%                                                                                                                                    ",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","1","SUMCR","30000",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","2","SUMCR","6000",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","SUMDB","39556.8",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",ISN,2)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    
    'SQL Ստուգում HI աղուսյակում 
    Call CheckQueryRowCount("HI","fBASE",Isn,8)
    Call Check_HI_CE_accounting ("20200101",Isn, "11",  "1654652", "39556.80", "001", "109.88", "CEX", "C")
    Call Check_HI_CE_accounting ("20200101",Isn, "11",  "1733571", "39556.80", "000", "39556.80", "CEX", "D")
    Call Check_HI_CE_accounting ("20200101",Isn, "11",  "1654652", "30000.00", "001", "75.00", "FEX", "D")
    Call Check_HI_CE_accounting ("20200101",Isn, "11",  "645244712", "30000.00", "000", "30000.00", "FEX", "C")
    Call Check_HI_CE_accounting ("20200101",Isn, "11",  "1654652", "6000.00", "001", "15.00", "FEX", "D")
    Call Check_HI_CE_accounting ("20200101",Isn, "11",  "354210522", "6000.00", "000", "6000.00", "FEX", "C")
    Call Check_HI_CE_accounting ("20200101",Isn, "11",  "1629708", "4395.20", "000", "4395.20", "MSC", "D")
    Call Check_HI_CE_accounting ("20200101",Isn, "11",  "1654652", "4395.20", "001", "0.00", "MSC", "C")
    
    'SQL Ստուգում HIREST  աղուսյակում  
    Call CheckDB_HIREST("11", "1654652","-7952.00","001","-19.88",1)
    Call CheckDB_HIREST("11", "1733571","39556.80","000","39556.80",1)
    Call CheckDB_HIREST("11", "645244712","-30000.00","000","-30000.00",1)
    Call CheckDB_HIREST("11", "354210522","-6000.00","000","-6000.00",1)
    Call CheckDB_HIREST("11", "1629708","12876.30","000","12876.30",1)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Պահատեղերի ԱՇՏ/Աշխատանքային փաստաթղթեր-ից կատարել Հաշվառել գործողություն ---'''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- To Confirm Deposot Box Agreement ---",,,DivideColor
    
    Call GoTo_WorkingAgreement(WorkingAgreement) 
    
    If WaitForPttel("frmPttel") Then
        If SearchInPttel("frmPttel",0, "01/01/20") Then
            BuiltIn.Delay(2000)
            Call wMainForm.MainMenu.Click(c_AllActions)
            Call wMainForm.PopupMenu.Click(c_ToCount)   
            BuiltIn.Delay(2000)
            Call MessageExists(2,"Ð³ßí³é»É")
            BuiltIn.Delay(2000)
            Call ClickCmdButton(5, "²Ûá")
        End If
        Call Close_Pttel("frmPttel")
    Else
        Log.Error "Can Not Open Working Agreement pttel",,,ErrorColor      
    End If
    
    Log.Message "SQL Check After To Confirm Action",,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckDB_DOCS(ISN,"GenOrdPk","5",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",ISN,2)
    Call CheckDB_DOCLOG(ISN,"77","M","5","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",ISN,0)
    
    'SQL Ստուգում HI աղուսյակում 
    Call CheckQueryRowCount("HI","fBASE",Isn,11)
    Call CheckQueryRowCount("HI","fBASE",DepositRental.Isn,1)
    Call Check_HI_CE_accounting ("20200101",DepositRental.Isn, "LL",  "1654652", "0.00", "001", "20.00", "DEP", "C")
    
    Call Check_HI_CE_accounting ("20200101",Isn, "01",  "1654652", "39556.80", "001", "109.88", "CEX", "C")
    Call Check_HI_CE_accounting ("20200101",Isn, "01",  "1733571", "39556.80", "000", "39556.80", "CEX", "D")
    Call Check_HI_CE_accounting ("20200101",Isn, "CE",  "1559631", "109.88", "000", "39556.80", "SAL", "D")
    Call Check_HI_CE_accounting ("20200101",Isn, "01",  "1654652", "30000.00", "001", "75.00", "FEX", "D")
    Call Check_HI_CE_accounting ("20200101",Isn, "01",  "645244712", "30000.00", "000", "30000.00", "FEX", "C")
    Call Check_HI_CE_accounting ("20200101",Isn, "CE",  "1578250", "30000.00", "001", "75.00", "PUR", "D")
    Call Check_HI_CE_accounting ("20200101",Isn, "01",  "1654652", "6000.00", "001", "15.00", "FEX", "D")
    Call Check_HI_CE_accounting ("20200101",Isn, "01",  "354210522", "6000.00", "000", "6000.00", "FEX", "C")
    Call Check_HI_CE_accounting ("20200101",Isn, "CE",  "1578250", "6000.00", "001", "15.00", "PUR", "D")
    Call Check_HI_CE_accounting ("20200101",Isn, "01",  "1629708", "4395.20", "000", "4395.20", "MSC", "D")
    Call Check_HI_CE_accounting ("20200101",Isn, "01",  "1654652", "4395.20", "001", "0.00", "MSC", "C")

    'SQL Ստուգում HIREST  աղուսյակում  
    Call CheckDB_HIREST("01", "1654652","-8002.60","001","-20.00",1)
    Call CheckDB_HIREST("01", "1733571","-959443.20","000","-959443.20",1)
'    Call CheckDB_HIREST("01", "645244712","183597.40","000","183597.40",1)
    Call CheckDB_HIREST("01", "354210522","394000.00","000","394000.00",1)
    Call CheckDB_HIREST("11", "1629708","8481.10","000","8481.10",1)
    
    'SQL Ստուգում MEMORDERS աղուսյակում  
    Call CheckDB_MEMORDERS(ISN,"GenOrdPk","1","2020-01-01","5","0.00","",1)
    
    'SQL Ստուգում ACCOUNTS աղուսյակում  
    Query = "Select COUNT(*) from ACCOUNTS where fISN = '1654652' and fLLIMIT = '20.00'"
    If my_Row_Count(Query) = 1 Then
        Log.Message "ACCOUNTS record is correct.",,,MessageColor
    Else
        Log.Error "ACCOUNTS record is incorrect. (Correct Row Count) = " & my_Row_Count(Query) ,,,ErrorColor
        Log.Error "Incorrect Query = " & Query,,,ErrorColor
    End If
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''-- Պայմանագիրը ուղարկել Ռեեստր --'''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''      
    Log.Message "-- Send to Register --",,,DivideColor        
    
    Call GoTo_AccRegisterForDepositBox(RegisterForDepositBox)
    Call EditRegisterStatus("1","àõÕ³ñÏí³Í")
    Call Close_Pttel("frmPttel")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''-"Պայմանագրի փակում" գործողության կատարում-'''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''      
    Log.Message "Check RC (Close Contract) Action",,,DivideColor    
    
    Call GoTo_DepositBoxRental(DepositBoxRentalFilter) 
    Call CloseDepositContract("010120")
    
    Log.Message "SQL Check After (Close Contract) Action",,,SqlDivideColor
    
    'SQL Ստուգում HI2 աղուսյակում 
    Call CheckQueryRowCount("HI2","fBASE",DepositRental.Isn,4)
    
    'SQL Ստուգում HI աղուսյակում 
    Call CheckQueryRowCount("HI","fBASE",DepositRental.Isn,2)
    Call Check_HI_CE_accounting ("20200101",DepositRental.Isn, "LL",  "1654652", "0.00", "001", "20.00", "DEP", "C")
    Call Check_HI_CE_accounting ("20200101",DepositRental.Isn, "LL",  "1654652", "0.00", "001", "20.00", "DEP", "D")

    'SQL Ստուգում HIREST  աղուսյակում  
    Call CheckDB_HIREST("01", "1654652","-8002.60","001","-20.00",1)
    Call CheckDB_HIREST("01", "1733571","-959443.20","000","-959443.20",1)
    Call CheckDB_HIREST("01", "354210522","394000.00","000","394000.00",1)
    Call CheckDB_HIREST("11", "1629708","8481.10","000","8481.10",1)
    
    'SQL Ստուգում ACCOUNTS աղուսյակում  
    Query = "Select COUNT(*) from ACCOUNTS where fISN = '1654652' and fLLIMIT = '0.00'"
    If my_Row_Count(Query) = 1 Then
        Log.Message "ACCOUNTS record is correct.",,,MessageColor
    Else
       Log.Error "ACCOUNTS record is incorrect.(Correct Row Count) = " & my_Row_Count(Query),,,ErrorColor
       Log.Error "Incorrect Query = " & Query,,,ErrorColor
    End If
    Call Close_Pttel("frmPttel")

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''-- Պայմանագիրը ուղարկել Ռեեստր --'''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''      
    Log.Message "-- Send to Register --",,,DivideColor        
    
    Call GoTo_AccRegisterForDepositBox(RegisterForDepositBox)
    Call EditRegisterStatus("2","àõÕ³ñÏí³Í Ó»éùáí")
    Call Close_Pttel("frmPttel")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''-"Պայմանագրի Բացում" գործողության կատարում-'''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''      
    Log.Message "Check RC (Open Contract) Action",,,DivideColor    
    
    Call GoTo_DepositBoxRental(DepositBoxRentalFilter) 
    Call OpenDepositContract("123456789")
    Call Close_Pttel("frmPttel")
    
    'SQL Ստուգում ACCOUNTS աղուսյակում  
    Query = "Select COUNT(*) from ACCOUNTS where fISN = '1654652' and fLLIMIT = '20.00'"
    If my_Row_Count(Query) = 1 Then
        Log.Message "ACCOUNTS record is correct.",,,MessageColor
    Else
       Log.Error "ACCOUNTS record is incorrect.(Correct Row Count) = " & my_Row_Count(Query),,,ErrorColor
       Log.Error "Incorrect Query = " & Query,,,ErrorColor
    End If
    
'Քանի որ Ռեեստր ուղարկված պայմանագիրը հնարավոր չի հեռացնել, այդ պատճառով տվյալ տողերը փակված են

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''--- Գլխավոր հաշվապահի ԱՇՏ/Վճարային փաստաթղթեր-ից հեռացնել Վճարային փաստաթղթեր-ը ---''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'    Log.Message "--- Delete In Cheif Acountant ---",,,DivideColor
'    
'    'Մուտք Գլխավոր հաշվապահի ԱՇՏ   
'    Call ChangeWorkspace(c_ChiefAcc)
'    
'    wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
'    'Լրացնել "Ամսաթիվ" դաշտը
'    Call Rekvizit_Fill("Dialog",1,"General","PERN", "^A[Del]" & "010120")
'    Call Rekvizit_Fill("Dialog",1,"General","PERK", "^A[Del]" & "010120")
'    Call ClickCmdButton(2, "Î³ï³ñ»É")
'    BuiltIn.Delay(2000)
'    
'    Set DocForm = wMDIClient.VBObject("frmPttel")
'    If WaitForPttel("frmPttel") Then
'        Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
'        BuiltIn.Delay(1000)
'        Call MessageExists(2,"ö³ëï³ÃáõÕÃÁ çÝç»ÉÇë` ÏÑ»é³óí»Ý Ýñ³ Ñ»ï Ï³åí³Í ËÙµ³ÛÇÝ "&vbCRLF&"Ó¨³Ï»ñåáõÙÝ»ñÁ")
'        Call ClickCmdButton(5, "Î³ï³ñ»É")
'        BuiltIn.Delay(2000)
'        Call ClickCmdButton(3, "²Ûá")
'        BuiltIn.Delay(2000)
'        Call Close_Pttel("frmPttel")
'     Else
'        Log.Error "Can Not Open Հաշվառված վճարային փաստաթղթեր Window",,,ErrorColor      
'     End If     
'     If DocForm.Exists Then
'        Log.Error "Can Not Close Հաշվառված վճարային փաստաթղթեր Window",,,ErrorColor
'     End If
'     
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''--- Պահատեղի աշխատանքային փաստաթղթեր-ից հեռացնել փաստաթուղթը ---'''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'    Log.Message "--- DELETE - Deposit Box Working Agreement  ---",,,DivideColor
'    
'    'Մուտք գործել "Պահատեղերի ԱՇՏ"
'    Call ChangeWorkspace(c_Deposit_Boxes)
'    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
'     
'    Set DocForm = wMDIClient.VBObject("frmPttel")
'    If WaitForPttel("frmPttel") Then
'        Call SearchAndDelete("frmPttel", 2, "123456789", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
'        BuiltIn.Delay(2000)
'        Call Close_Pttel("frmPttel")
'    Else
'        Log.Error "Can Not Open Պահատեղի աշխատանքային փաստաթղթեր Window",,,ErrorColor      
'    End If     
'    If DocForm.Exists Then
'        Log.Error "Can Not Close Պահատեղի աշխատանքային փաստաթղթեր Window",,,ErrorColor
'    End If   
    
    Call Close_AsBank()
End Sub

Sub Test_InitializeDepositOnClient()
    Set Client = New_Clients()
        Client.ClientsCode = "00000019"
        Client.ClientsEnglishName = "Client 00000019"
        Client.OpeningDate_1 = "120400"
        Client.OpeningDate_2 = "120400"
        Client.Division = "00"
        Client.Department = "2"
        Client.AccessType = "00"
        Client.LegalPosition = "21"
    
    Set NewDepositCondition = New_DepositCondition()
    With NewDepositCondition
        .SigningDate = "^A[Del]" & "010120"
        .Standard = "002"
        .Duration = "06"
        .EndDate = "01/01/21"
        .DepositBoxNumber = "0000004"
        .Client = "00000019"
        .PaymentType = "2"
        .ServiceFee = "30,000.00"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With    
        
    Set DepositRentalAgr_ForCheck = New_DepositRentalAgreement()
    With DepositRentalAgr_ForCheck
        .Client = "00000019"
        .Name = "¶»Õ³ÙÛ³Ý ²ñï³ß»ë"
        .EnglishName = "Client 00000019"
        .OtherAccs = ""
        .UseClientSchema = 0
        .Standard = "002"
        .Duration = "06"
        .StartDate = "01/01/20"
        .EndDate = "01/01/21"
        .ServiceFee = "30,000.00"
        .VatTaxable = "1"
        .PaymentType = "2"
        .NonperformingDaysAvoiding = "1"
        .AutoProlong = 0
        .RemindBySMS = 0
        .EmailAddress = 0
        .IntBank = 0
        .DepositionAmount = "5,000.00"
        .AllowDelayedPayment = 1
        .StandardPay = "001"
        .ServContrStandForPenalCalc = "002"
        .DepositBoxType = "011"
        .Number = "0000004"
        .ClosingDate = "/  /"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With
    
    Set DepositRental = New_DepositRentalAgreement()
    With DepositRental
        .Agreement = "^A[Del]"&"123456789"
        .Account = "000355101"
        .OtherAccs = "001"
        .UseClientSchema = 1
        .AutoProlong = 1
        .EmailAddress = 1
        .DepositionAmount = "8,000.00"
        .AllowDelayedPayment = 1
        .StandardPay = "001"
        .AdditionalaInfo = "Check_DepositRenaltyCount"
        .GridClient = "00000676"
    End With

    Set Deposit_Box_WorkingAgr_Filter = New_Deposit_Boxes_WorkingAgr()
    With Deposit_Box_WorkingAgr_Filter
        .DataPeriod_Start = "^A[Del]"&"010120"
        .DataPeriod_End = "^A[Del]"&"010121"
        .Executors = "77"
        .DocumentType = "DBoxAgr"
        .Client = "00000019"
        .Agreement = "123456789"
        .DepositBoxNumber = "0000004"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With

    Set WorkingAgreement = New_WorkingAgreementForDeposit()
    With WorkingAgreement
        .DataPeriod_Start = "^A[Del]"&"010120"
        .DataPeriod_End = "^A[Del]"&"010120"
        .Executors = "77"
        .DocumentType = "GenOrdPk"
        .RecPaySystem = ""
        .SentPaySystem = ""
        .Note = ""
        .Division = "00"
        .Department = "1"
    End With
    
    Set DepositBoxRentalFilter = New_DepositBoxRental()
    With DepositBoxRentalFilter          
        .Data = "^A[Del]"&"010120"
        .Client = "00000019"
        .AgreementName = "¶»Õ³ÙÛ³Ý ²ñï³ß»ë"
        .DepositBoxNumber = "0000004"
        .AgreementN = "123456789"
        .Standard = "002"
        .DepositBoxType = "011"
        .ShowDebt = 1
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With
    
    Set RegisterForDepositBox = New_AccountsRegisterForDepositBox()
    With RegisterForDepositBox
      .RegisterState = ""
      .DepositBoxNumber = "0000004"
      .DepositBoxDivision = "00"
      .ClientCode = "00000019"
      .Division = "00"
      .Department = "2"
      .AccessType = "00"
      .LegPos = "2"
      .TaxID = ""
      .Note1 = ""
      .Note2 = ""
      .Note3 = ""
      .ShowClientsData = 1
      .ShowChanges = 1
      .ShowReadyToSends = 0
      .View = "RegBoxes"
      .FillInto = "0"
    End With
End Sub

Sub SQL_Initialize_OnClient(fISN)
        
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1)
      .fFOLDERID = "C.1628333"
      .fNAME = "GenOrdPk"
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "1"
      .fCOM = "ÊÙµ³ÛÇÝ ÑÇß³ñ³ñ ûñ¹»ñ"
      .fSPEC = "²Ùë³ÃÇí- 01/01/20 N- 000866 ¶áõÙ³ñ-                 0.00 ²ñÅ.-     [Üáñ]"
      .fECOM = "Group Memorial Order"
    End With

    Set dbFOLDERS(2) = New_DB_FOLDERS()
    With dbFOLDERS(2)
      .fFOLDERID = "Oper.20200101"
      .fNAME = "GenOrdPk"
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "1"
      .fCOM = "ÊÙµ³ÛÇÝ ÑÇß³ñ³ñ ûñ¹»ñ"
      .fSPEC = "000866                                            0.00   Üáñ                                                   77                                                                                       Ð                                                                                                                                                    "
      .fECOM = "Group Memorial Order"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
End Sub