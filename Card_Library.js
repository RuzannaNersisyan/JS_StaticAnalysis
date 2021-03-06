'USEUNIT Library_Common    
'USEUNIT Constants
 
'_______________________________________________________________________________________
'Հաշվառել փաստաթղթերը "Ստացված հանրագումարներ" թղթապանակից
'---------------------------------------------------------------------------------------
Sub Registr_Cards_Total(registrDate)
    'Ֆիլտրել ըստ Քարտի համարի 
    Call wMainForm.MainMenu.Click("Դիտում |cardFiltr")
    'Սեղմել "+"
    wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Keys("[NumPlus]")

    BuiltIn.Delay(1000)
    Call wMainForm.MainMenu.Click(c_AllActions)    
    Call wMainForm.PopupMenu.Click(c_DoTrans)
    'Լրացնել Հաշվառման ամսաթիվ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DATE","![End]" & "[Del]" & registrDate)
    'Սեղմել "Կատարել" կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(5000)
    Call ClickCmdButton(5, "OK")
    BuiltIn.Delay(1000)
End Sub

'__________________________________________________________________________________________
'PCTrans տեսակի փաստաթղթի ջնջում
'------------------------------------------------------------------------------------------
'user - Կատարող
'docType - Փաստաթղթի տեսակ
Sub Delete_PCTrans(startDate,user,docType)
    Dim curr_date
    curr_date = aqConvert.DateTimeToFormatStr(aqDateTime.Today(), "%d/%m/%y")    

    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|ÂÕÃ³å³Ý³ÏÝ»ñ|êï»ÕÍí³Í ÷³ëï³ÃÕÃ»ñ")
    'Լրացնել Ժամանակահատված (սկիզբ) դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE","![End]" & "[Del]" & startDate)
    'Լրացնել Ժամանակահատված (վերջ) դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE","![End]" & "[Del]" & curr_date)
    'Լրացնել Կատարող դաշտը 
    Call Rekvizit_Fill("Dialog",1,"General","USER",user)
    'Լրացնել Փաստաթղթի տեսակ
    Call Rekvizit_Fill("Dialog",1,"General","DOCTP",docType)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
  
    'Անցնում է ցուցակի մեջով `վեջից սկսած , և ջնջում է ամբողջը
      Do Until Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").EOF
         If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 0  then 
                'Անցում է կատարում վերջին տողին
               Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").MoveFirst
               BuiltIn.Delay(2000)
               Sys.Process("Asbank").Refresh
                'Կատարում է ջնջել գործողությունը  
               Call wMainForm.MainMenu.Click(c_AllActions)
               Call wMainForm.PopupMenu.Click(c_Delete)
               If Sys.Process("Asbank").WaitVBObject("frmAsMsgBox", 1500).Exists Then
                  Sys.Process("Asbank").VBObject("frmAsMsgBox").VBObject("cmdButton").Click()
                  Sys.Process("Asbank").VBObject("frmDeleteDoc").VBObject("YesButton").Click()
               Else
                  Sys.Process("Asbank").VBObject("frmDeleteDoc").VBObject("YesButton").Click()
               End If       
          Else
            Exit Do
         End If
      Loop
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
End Sub

'_________________________________________________________________________________________
'Ջնջում է բոլոր ներմուծած ֆայլերը թղթապանակից
'-----------------------------------------------------------------------------------------
Sub Delete_All_Contracts_Total()
    'Սեղմել "+"
    wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Keys("[NumPlus]")

    BuiltIn.Delay(delay_small)
    Call wMainForm.MainMenu.Click(c_AllActions)    
    Call wMainForm.PopupMenu.Click(c_Remove)
    'Լրացնում է "Հեռացնել նաև գործարքները" նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DELTRANS",1)
    'Սեղմել "Կատարել" կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(12000)
    If wMDIClient.WaitVBObject("FrmSpr",2000).Exists Then
      wMDIClient.VBObject("FrmSpr").Close()
    End If
    BuiltIn.Delay(2000)
End Sub

'-----------------------------
'"Հաճախորդներ" Clients - Class
'-----------------------------
Class Clients
    Public ClientsCode
    Public IdentifierBankID
    Public AccountMask
    Public ClientName
    Public ClientsEnglishName
    Public DeepSearchByClientName
    Public IDNumberCode
    Public RegistryN
    Public TaxID
    Public IdentificationWord
    Public MobileN
    Public OpeningDate_1
    Public OpeningDate_2
    Public Division
    Public Department
    Public AccessType
    Public LegalPosition
    Public BusinessField
    Public StateStatus
    Public Residence
    Public Note
    Public Note2
    Public Note3
    Public ClosedClients
    Public Reminders
    Public SocialInfo
    Public OtherInfo
    Public Contracts
    Public IncludeClosed
    Public BankIdDate
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
         ClientsCode = ""
         IdentifierBankID = ""
         AccountMask = ""
         ClientName = ""
         ClientsEnglishName = ""
         DeepSearchByClientName = 0
         IDNumberCode = ""
         RegistryN = ""
         TaxID = ""
         IdentificationWord = ""
         MobileN = ""
         OpeningDate_1 = ""
         OpeningDate_2 = ""
         Division = ""
         Department = ""
         AccessType = ""
         LegalPosition = ""
         BusinessField = ""
         StateStatus = ""
         Residence = ""
         Note = ""
         Note2 = ""
         Note3 = ""
         ClosedClients = 0
         Reminders = 0
         SocialInfo = 0
         OtherInfo = 0
         Contracts = ""
         IncludeClosed = 0
         BankIdDate = 0
         View = ""
         FillInto = ""
    End Sub  
End Class

Function New_Clients()
    Set New_Clients = NEW Clients      
End Function

'------------------------------------------
'Լրացնել "Հաճախորդներ" Clients  Ֆիլտրի արժեքները
'------------------------------------------
Sub Fill_Clients(Client)

    'Լրացնում է "Հաճախորդի կոդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLIMASK",Client.ClientsCode)
    'Լրացնում է "Նույնականացուցիչ(BankID)" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","BANKID",Client.IdentifierBankID)
    'Լրացնում է "Հաշվի շաբլոն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCMASK",Client.AccountMask)
    'Լրացնում է "Հաճախորդի անվանում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLNAME",Client.ClientName)
    'Լրացնում է "Հաճախորդի անգլերեն անվանում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLENAME",Client.ClientsEnglishName)
    'Լրացնում է "Խորացված ստուգում հաճ.անվանումով" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DEEPSEARCHBYNAME",Client.DeepSearchByClientName)
    'Լրացնում է "Անձը հաստատող փաստաթուղթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PASSPORT",Client.IDNumberCode)
    'Լրացնում է "Գրանցման N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","REGNUM",Client.RegistryN)
    'Լրացնում է "ՀՎՀՀ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","TAXCOD",Client.TaxID)
    'Լրացնում է "Գաղտնաբառ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","MASKPAROLE",Client.IdentificationWord)
    'Լրացնում է "Բջջային" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","MOBILE",Client.MobileN)
    'Լրացնում է "Բացման ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DATOTKN",Client.OpeningDate_1)
    'Լրացնում է "Բացման ամսաթիվ ավարտ" դաշտը     
    Call Rekvizit_Fill("Dialog",1,"General","DATOTKK",Client.OpeningDate_2)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",Client.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",Client.Department)
    'Լրացնում է "Հասան-ն տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSTYPE",Client.AccessType)

    'Լրացնում է "Իրավաբանական կարգավիճակ" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","CLJURSTAT",Client.LegalPosition)
    'Լրացնում է "Գործունեության ոլորտ" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","CLVOLORT",Client.BusinessField)
    'Լրացնում է "Պետական կարգավիճակ" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","CLPETBUJ",Client.StateStatus)
    'Լրացնում է "Ռեզիդենտություն" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","CLREZ",Client.Residence)
    'Լրացնում է "Նշում" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","CLINOTE",Client.Note)
    'Լրացնում է "Նշում2" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","CLINOTE2",Client.Note2)
    'Լրացնում է "Նշում3" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","CLINOTE3",Client.Note3)

    'Լրացնում է "Փակված հաճախորդներին" դաշտը
    Call Rekvizit_Fill("Dialog",3,"CheckBox","CLCLOSE",Client.ClosedClients)
    'Լրացնում է "Հիշեցումները" դաշտը
    Call Rekvizit_Fill("Dialog",3,"CheckBox","REMINDER",Client.Reminders)
    'Լրացնում է "Սոցիալական տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",3,"CheckBox","SHOWSOCIALINFO",Client.SocialInfo)
    'Լրացնում է "Լրացուցիչ տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",3,"CheckBox","SHOWOTHINFO",Client.OtherInfo)
    'Լրացնում է "Պայմանագրերը" դաշտը
    Call Rekvizit_Fill("Dialog",3,"General","SHOWEXTENDED",Client.Contracts)
    'Լրացնում է "Ներառել փակվածները" դաշտը
    Call Rekvizit_Fill("Dialog",3,"CheckBox","SHOWEXTCLOSED",Client.IncludeClosed)
    'Լրացնում է "BankID տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",3,"CheckBox","SHOWBANKIDDATA",Client.BankIdDate)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",3,"General","SELECTED_VIEW",Client.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",3,"General","EXPORT_EXCEL",Client.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub


'------------------------------------
'"Պլաստիկ քարտեր" PlasticCarts - Class
'------------------------------------
Class PlasticCarts
    Public CardNumber
    Public AgreementN
    Public CardName
    Public AccountMask
    Public Client
    Public IdentificationWord
    Public User
    Public Division
    Public Department
    Public DatePeriod_1
    Public DatePeriod_2
    Public ValidFrom_1
    Public ValidFrom_2
    Public CardType
    Public CardStandard
    Public Curr
    Public Note
    Public Note2
    Public Note3
    Public Company
    Public BTRTFileState
    Public CardStateInProcessing
    Public MobileServices
    Public Closed
    Public Limits
    Public OverLimits
    Public ClientInfo
    Public ExistsChanges
    Public OtherInfo
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        CardNumber = ""
        AgreementN = ""
        CardName = ""
        AccountMask = ""
        Client = ""
        IdentificationWord = ""
        User = ""
        Division = ""
        Department = ""
        DatePeriod_1 = ""
        DatePeriod_2 = ""
        ValidFrom_1 = ""
        ValidFrom_2 = ""
        CardType = ""
        CardStandard = ""
        Curr = ""
        Note = ""
        Note2 = ""
        Note3 = ""
        Company = ""
        BTRTFileState = ""
        CardStateInProcessing = ""
        MobileServices = 0
        Closed = 1
        Limits = 0
        OverLimits = 0
        ClientInfo = 0
        ExistsChanges = 0
        OtherInfo = 0
        View = "VCards"
        FillInto = "0"
    End Sub  
End Class

Function New_PlasticCarts()
    Set New_PlasticCarts = NEW PlasticCarts      
End Function

'------------------------------------------------
'Լրացնել "Պլաստիկ քարտեր" PlasticCarts  Ֆիլտրի արժեքները
'------------------------------------------------
Sub Fill_PlasticCarts(PlasticCart)

    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",PlasticCart.CardNumber)
    'Լրացնում է "ä³ÛÙ³Ý³·ñÇ N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CONTCODE",PlasticCart.AgreementN)
    'Լրացնում է "Քարտի անվանում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLINAME",PlasticCart.CardName)
    'Լրացնում է "Հաշվի շաբլոն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCMASK",PlasticCart.AccountMask)
    'Լրացնում է "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLICOD",PlasticCart.Client)
    'Լրացնում է "Գաղտնաբառ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PAROLE",PlasticCart.IdentificationWord)
    'Լրացնում է "Կատարող" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","USER",PlasticCart.User)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",PlasticCart.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",PlasticCart.Department)

    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","SDATE",PlasticCart.DatePeriod_1)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","EDATE",PlasticCart.DatePeriod_2)
    'Լրացնում է "Գործադրման ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","VSDATE",PlasticCart.ValidFrom_1)
    'Լրացնում է "Գործադրման ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","VEDATE",PlasticCart.ValidFrom_2)
    'Լրացնում է "Քարտի տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","CARDTYPE",PlasticCart.CardType)
    'Լրացնում է "Քարտի ստանդարտ" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","CARDSTD",PlasticCart.CardStandard)
    'Լրացնում է "Արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","CUR",PlasticCart.Curr)
    'Լրացնում է "Նշում" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","CARDNOTE",PlasticCart.Note)
    'Լրացնում է "Նշում2" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","CARDNOTE2",PlasticCart.Note2)
    'Լրացնում է "Նշում3" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","CARDNOTE3",PlasticCart.Note3)
    'Լրացնում է "Հիմնարկ" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","COMPANY",PlasticCart.Company)
    'Լրացնում է "BTRT Ֆայլերի կարգավիճակ" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","BTRTFILESTATE",PlasticCart.BTRTFileState)
    'Լրացնում է "Քարտի կարգավիճակ պրոցեսինգում" դաշտը
    Call Rekvizit_Fill("Dialog",2,"General","SVPCARDACSTATUS",PlasticCart.CardStateInProcessing)
    
    'Լրացնում է "Բջջային ծառայությունները" դաշտը
    Call Rekvizit_Fill("Dialog",3,"CheckBox","SHOWMOBSERV",PlasticCart.MobileServices)
    'Լրացնում է "Փակված պայմանագրերը" դաշտը
    Call Rekvizit_Fill("Dialog",3,"CheckBox","SHOWCLOSED",PlasticCart.Closed)
    'Լրացնում է "Սահմանաչափերը" դաշտը
    Call Rekvizit_Fill("Dialog",3,"CheckBox","SHOWLIMIT",PlasticCart.Limits)
    'Լրացնում է "Գերածախսերը" դաշտը
    Call Rekvizit_Fill("Dialog",3,"CheckBox","SHOWOVERLIMIT",PlasticCart.OverLimits)
    'Լրացնում է "Հաճ. տվյավները" դաշտը
    Call Rekvizit_Fill("Dialog",3,"CheckBox","SHOWCLIINF",PlasticCart.ClientInfo)
    'Լրացնում է "Փոփ.հայտ.առկ." դաշտը
    Call Rekvizit_Fill("Dialog",3,"CheckBox","SHOWCHANGEEXIST",PlasticCart.ExistsChanges)
    'Լրացնում է "Լրացուցիչ տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",3,"CheckBox","SHOWOTHINFO",PlasticCart.OtherInfo)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",3,"General","SELECTED_VIEW",PlasticCart.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",3,"General","EXPORT_EXCEL",PlasticCart.FillInto)
    
    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub
'---------------------------------------------------------------
'"Քարտային հաշիվների գործողություններ"  CardAccountsTrans - Class
'---------------------------------------------------------------
Class CardAccountsTrans
    Public DatePeriod_1
    Public DatePeriod_2
    Public CardType
    Public CardNumber
    Public AccountMask
    Public Note
    Public Note2
    Public Note3
    Public CardStateInProcessing
    Public ShowAllTransactions
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        DatePeriod_1 = ""
        DatePeriod_2 = ""
        CardType = ""
        CardNumber = ""
        AccountMask = ""
        Note = ""
        Note2 = ""
        Note3 = ""
        CardStateInProcessing = ""
        ShowAllTransactions = 0
        View = "CdAcTrns"
        FillInto = "0"
    End Sub  
End Class

Function New_CardAccountsTrans()
    Set New_CardAccountsTrans = NEW CardAccountsTrans     
End Function

'----------------------------------------------------------------------------
'Լրացնել "Քարտային հաշիվների գործողություններ"  CardAccountsTranss  Ֆիլտրի արժեքները
'----------------------------------------------------------------------------
Sub Fill_CardAccountsTrans(CardAccountsTrans)

    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",CardAccountsTrans.DatePeriod_1)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",CardAccountsTrans.DatePeriod_2)
    'Լրացնում է "Քարտի տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDTYPE",CardAccountsTrans.CardType)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNUM",CardAccountsTrans.CardNumber)
    'Լրացնում է "Հաշվի շաբլոն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCMASK",CardAccountsTrans.AccountMask)
    'Լրացնում է "Նշում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE",CardAccountsTrans.Note)
    'Լրացնում է "Նշում2" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE2",CardAccountsTrans.Note2)
    'Լրացնում է "Նշում3" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE3",CardAccountsTrans.Note3)
    'Լրացնում է "Քարտի կարգավիճակ պրոցեսինգում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SVPCARDACSTATUS",CardAccountsTrans.CardStateInProcessing)
    'Լրացնում է "Ցույց տալ մշակված գործողությունները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWALL",CardAccountsTrans.ShowAllTransactions)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",CardAccountsTrans.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",CardAccountsTrans.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'---------------------------------------------------------------
'"Ստացված գործողություններ"  Received transactions - Class
'---------------------------------------------------------------
Class ReceivedTransactions
    Public FileDate_1
    Public FileDate_2
    Public OperationDate_1
    Public OperationDate_2
    Public CardNumber
    Public AccountMask
    Public MerchantPoint
    Public CardsTransactions
    Public MerchantPointTransactions
    Public ShowMadeTransactions
    Public ShowAllRows
    Public ShowArchivedOpers
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        FileDate_1 = ""
        FileDate_2 = ""
        OperationDate_1 = ""
        OperationDate_2 = ""
        CardNumber = ""
        AccountMask = ""
        MerchantPoint = ""
        CardsTransactions = 1
        MerchantPointTransactions = 1
        ShowMadeTransactions = 0
        ShowAllRows = 0
        ShowArchivedOpers = 0
        View = "VRecTrns"
        FillInto = "0"
    End Sub  
End Class

Function New_ReceivedTransactions()
    Set New_ReceivedTransactions = NEW ReceivedTransactions      
End Function

'----------------------------------------------------------------------------
'Լրացնել "Ստացված գործողություններ"  Received transactions  Ֆիլտրի արժեքները
'----------------------------------------------------------------------------
Sub Fill_ReceivedTransactions(ReceivedTransaction)

    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FSDATE",ReceivedTransaction.FileDate_1)
    'Լրացնում է "Ֆայլի ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FEDATE",ReceivedTransaction.FileDate_2)
    'Լրացնում է "Գործողության ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",ReceivedTransaction.OperationDate_1)
    'Լրացնում է "Գործողության ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",ReceivedTransaction.OperationDate_2)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",ReceivedTransaction.CardNumber)
    'Լրացնում է "Հաշվի շաբլոն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCMASK",ReceivedTransaction.AccountMask)
    'Լրացնում է "Սպասարկման կետ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","MERCHCODE",ReceivedTransaction.MerchantPoint)
    'Լրացնում է "Քարտերի գործողությունները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","CARDTRNS",ReceivedTransaction.CardsTransactions)
    'Լրացնում է "Սպասարկման կետերի գործողությունները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","MERCHTRNS",ReceivedTransaction.MerchantPointTransactions)
    'Լրացնում է "Ցույց տալ հաշվառված գործողություւները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWALL",ReceivedTransaction.ShowMadeTransactions)
    'Լրացնում է "Ցույց տալ բոլոր տիպի տողերը" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWALLROWS",ReceivedTransaction.ShowAllRows)
    'Լրացնում է "Ցույց տալ արխիվացված գործարքները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWARCHIVED",ReceivedTransaction.ShowArchivedOpers)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",ReceivedTransaction.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",ReceivedTransaction.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'---------------------------------------------------------------
'" Hold/Unhold գործողություններ"  Hold/Unhold transactions - Class
'---------------------------------------------------------------
Class HoldUnholdTransactions
    Public FileDate_1
    Public FileDate_2
    Public OperationDate_1
    Public OperationDate_2
    Public Status
    Public CardNumber
    Public AccountMask
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        FileDate_1 = ""
        FileDate_2 = ""
        OperationDate_1 = ""
        OperationDate_2 = ""
        Status = ""
        CardNumber = ""
        AccountMask = ""
        View = "vHoldTrs"
        FillInto = "0"
    End Sub  
End Class

Function New_HoldUnholdTransactions()
    Set New_HoldUnholdTransactions = NEW HoldUnholdTransactions      
End Function

'----------------------------------------------------------------------------
'Լրացնել "Ստացված գործողությունները"  Hold/Unhold transactions  Ֆիլտրի արժեքները
'----------------------------------------------------------------------------
Sub Fill_HoldUnholdTransactions(HoldUnholdTrans)

    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FSDATE",HoldUnholdTrans.FileDate_1)
    'Լրացնում է "Ֆայլի ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FEDATE",HoldUnholdTrans.FileDate_2)
    'Լրացնում է "Գործողության ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",HoldUnholdTrans.OperationDate_1)
    'Լրացնում է "Գործողության ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",HoldUnholdTrans.OperationDate_2)
    'Լրացնում է "Կարգավիճակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","TRANSSTATUS",HoldUnholdTrans.Status)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNUM",HoldUnholdTrans.CardNumber)
    'Լրացնում է "Հաշվի շաբլոն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCMASK",HoldUnholdTrans.AccountMask)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",HoldUnholdTrans.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",HoldUnholdTrans.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'---------------------------------------------------------------
'"Ստացված հանրագումարներ"  Received Clearing transactions - Class
'---------------------------------------------------------------
Class ReceivedClearingTransactions
    Public FileDate_1
    Public FileDate_2
    Public OperationDate_1
    Public OperationDate_2
    Public CardBank
    Public CardNumber
    Public ShowMadeTransactions
    Public ShowArchivedOpers
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        FileDate_1 = ""
        FileDate_2 = ""
        OperationDate_1 = ""
        OperationDate_2 = ""
        CardBank = ""
        CardNumber = ""
        ShowMadeTransactions = 0
        ShowArchivedOpers = 0
        View = "VRcClear"
        FillInto = "0"
    End Sub  
End Class

Function New_ReceivedClearingTransactions()
    Set New_ReceivedClearingTransactions = NEW ReceivedClearingTransactions      
End Function

'----------------------------------------------------------------------------
'Լրացնել "Ստացված հանրագումարներ"  Received Clearing transactions  Ֆիլտրի արժեքները
'----------------------------------------------------------------------------
Sub Fill_ReceivedClearingTransactions(RecClearingTrans)

    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FSDATE",RecClearingTrans.FileDate_1)
    'Լրացնում է "Ֆայլի ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FEDATE",RecClearingTrans.FileDate_2)
    'Լրացնում է "Գործողության ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",RecClearingTrans.OperationDate_1)
    'Լրացնում է "Գործողության ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",RecClearingTrans.OperationDate_2)
    'Լրացնում է "Բանկի Arca կոդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","BINCODE",RecClearingTrans.CardBank)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",RecClearingTrans.CardNumber)
    'Լրացնում է "Ցույց տալ հաշվառված գործողություւները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWALL",RecClearingTrans.ShowMadeTransactions)
    'Լրացնում է "Ցույց տալ արխիվացված գործարքները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWARCHIVED",RecClearingTrans.ShowArchivedOpers)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",RecClearingTrans.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",RecClearingTrans.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'---------------------------------------------------------------
'"MC ëտացված գործողություւները"  MC Received transactions - Class
'---------------------------------------------------------------
Class MCReceivedTrans
    Public FileDate_1
    Public FileDate_2
    Public OperationDate_1
    Public OperationDate_2
    Public CardNumber
    Public MerchantPoint
    Public InnerOuterTx
    Public ShowAllTransactions
    Public ShowArchivedOpers
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        FileDate_1 = ""
        FileDate_2 = ""
        OperationDate_1 = ""
        OperationDate_2 = ""
        CardNumber = ""
        MerchantPoint = ""
        InnerOuterTx  = ""
        ShowAllTransactions = 0
        ShowArchivedOpers = 0
        View = "MCRcTrns"
        FillInto = "0"
    End Sub  
End Class

Function New_MCReceivedTrans()
    Set New_MCReceivedTrans = NEW MCReceivedTrans    
End Function

'----------------------------------------------------------------------------
'Լրացնել "MC ëտացված գործողություւները"  MC Received transactions  Ֆիլտրի արժեքները
'----------------------------------------------------------------------------
Sub Fill_MCReceivedTrans(MCReceivedTrans)

    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FSDATE",MCReceivedTrans.FileDate_1)
    'Լրացնում է "Ֆայլի ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FEDATE",MCReceivedTrans.FileDate_2)
    'Լրացնում է "Գործողության ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",MCReceivedTrans.OperationDate_1)
    'Լրացնում է "Գործողության ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",MCReceivedTrans.OperationDate_2)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",MCReceivedTrans.CardNumber)
    'Լրացնում է "Սպասարկման կետ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","MERCHCODE",MCReceivedTrans.MerchantPoint)
    'Լրացնում է "Ներքին/Արտաքին գործարքները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","IO",MCReceivedTrans.InnerOuterTx)
    'Լրացնում է "Ցույց տալ հաշվառված գործողություւները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWALL",MCReceivedTrans.ShowAllTransactions)
    'Լրացնում է "Ցույց տալ արխիվացված գործարքները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWARCHIVED",MCReceivedTrans.ShowArchivedOpers)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",MCReceivedTrans.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",MCReceivedTrans.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'-----------------------------------------------------------------
'"Համատեղ տերմանալ.գործողություւներ"  Shared Terminal Operations - Class
'-----------------------------------------------------------------
Class SharedTerminalOperations
    Public FileDate_1
    Public FileDate_2
    Public OperationDate_1
    Public OperationDate_2
    Public VirtMainTx
    Public CardNumber
    Public TeamID
    Public ShowMadeTransactions
    Public ShowArchivedOpers
    Public ShowInsideBankingCommission
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        FileDate_1 = ""
        FileDate_2 = ""
        OperationDate_1 = ""
        OperationDate_2 = ""
        VirtMainTx = ""
        CardNumber = ""
        TeamID = ""
        ShowMadeTransactions = 0
        ShowArchivedOpers = 0
        ShowInsideBankingCommission = 0
        View = "VrtTrns"
        FillInto = "0"
    End Sub  
End Class

Function New_SharedTerminalOperations()
    Set New_SharedTerminalOperations = NEW SharedTerminalOperations      
End Function

'-------------------------------------------------------------------------------
'Լրացնել "Համատեղ տերմանալ.գործողություւներ"  Shared Terminal Operations  Ֆիլտրի արժեքները
'-------------------------------------------------------------------------------
Sub Fill_SharedTerminalOperations(SharedTerminalOperation)

    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FSDATE",SharedTerminalOperation.FileDate_1)
    'Լրացնում է "Ֆայլի ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FEDATE",SharedTerminalOperation.FileDate_2)
    'Լրացնում է "Գործողության ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",SharedTerminalOperation.OperationDate_1)
    'Լրացնում է "Գործողության ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",SharedTerminalOperation.OperationDate_2)
    'Լրացնում է "Վիրտուալ/Հիմն.գործ." դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","V",SharedTerminalOperation.VirtMainTx)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",SharedTerminalOperation.CardNumber)
    'Լրացնում է "Տերմ N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","TERMINAL",SharedTerminalOperation.TeamID)
    'Լրացնում է "Ցույց տալ հաշվառված գործողություւները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWALL",SharedTerminalOperation.ShowMadeTransactions)
    'Լրացնում է "Ցույց տալ արխիվացված գործարքները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWARCHIVED",SharedTerminalOperation.ShowArchivedOpers)
    'Լրացնում է "Ցույց տալ միջբանկային միջնորդավճարները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWINSBANKCOMMIS",SharedTerminalOperation.ShowInsideBankingCommission)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",SharedTerminalOperation.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",SharedTerminalOperation.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'-----------------------------------------
'"SMS Հաղորդագրություն"  SMS Messages - Class
'-----------------------------------------
Class SMS_Messages
    Public FileDate_1
    Public FileDate_2
    Public CardNumber
    Public ShowProcessed
    Public Archive
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        FileDate_1 = ""
        FileDate_2 = ""
        CardNumber = ""
        ShowProcessed = 0
        Archive = 0
        View = "vACSMS"
        FillInto = "0"
    End Sub  
End Class

Function New_SMS_Messages()
    Set New_SMS_Messages = NEW SMS_Messages      
End Function

'-------------------------------------------------------
'Լրացնել "SMS Հաղորդագրություն"  SMS Messages  Ֆիլտրի արժեքները
'-------------------------------------------------------
Sub Fill_SMS_Messages(SMSMessage)

    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ և ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",SMSMessage.FileDate_1)
    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ և ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE", SMSMessage.FileDate_2)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",SMSMessage.CardNumber)
    'Լրացնում է "Ցույց տալ Հաշվառվածները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWPROCESSED",SMSMessage.ShowProcessed)
    'Լրացնում է "Արխիվ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWARCHIVE",SMSMessage.Archive)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",SMSMessage.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",SMSMessage.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'-----------------------------------------
'"USSD Հաշվետվություն"  USSD_Reports - Class
'-----------------------------------------
Class USSD_Reports
    Public FileDate_1
    Public FileDate_2
    Public OperationDate_1
    Public OperationDate_2
    Public CardNumber
    Public Phone
    Public ShowProcessed
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        FileDate_1 = ""
        FileDate_2 = ""
        OperationDate_1 = ""
        OperationDate_2 = ""
        CardNumber = ""
        Phone = ""
        ShowProcessed = 0
        View = "vACUSSD"
        FillInto = "0"
    End Sub  
End Class

Function New_USSD_Reports()
    Set New_USSD_Reports = NEW USSD_Reports      
End Function

'-------------------------------------------------------
'Լրացնել "USSD Հաշվետվություն"  USSD_Reports  Ֆիլտրի արժեքները
'-------------------------------------------------------
Sub Fill_USSD_Reports(USSDReports)

    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SRTFILEDATE",USSDReports.FileDate_1)
    'Լրացնում է "Ֆայլի ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ENDFILEDATE",USSDReports.FileDate_2)
    'Լրացնում է "Գործողության ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SRTTRANSDATE",USSDReports.OperationDate_1)
    'Լրացնում է "Գործողության ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ENDTRANSDATE",USSDReports.OperationDate_2)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNUM",USSDReports.CardNumber)
    'Լրացնում է Հեռախոսահամար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","MOBILENUMBER",USSDReports.Phone)
    'Լրացնում է "Ցույց տալ հաշվառվածները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWPROCESSED",USSDReports.ShowProcessed)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",USSDReports.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",USSDReports.FillInto)
    
    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'----------------------------------------------------------------------
'"Ուղարկված/Ստացված Ֆայլերի պատմություն"  SentReceived_FilesHistory - Class
'----------------------------------------------------------------------
Class SentReceived_FilesHistory
    Public FileDate_1
    Public FileDate_2
    Public CardNumber
    Public ShowOnlyErrors
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        FileDate_1 = ""
        FileDate_2 = ""
        CardNumber = ""
        ShowOnlyErrors = 0
        View = "SVLOGV"
        FillInto = "0"
    End Sub  
End Class

Function New_SentReceived_FilesHistory()
    Set New_SentReceived_FilesHistory = NEW SentReceived_FilesHistory      
End Function

'----------------------------------------------------------------------------------
'Լրացնել "Ուղարկված/Ստացված Ֆայլերի պատմություն" SentReceived_FilesHistory  Ֆիլտրի արժեքները
'----------------------------------------------------------------------------------
Sub Fill_SentReceived_FilesHistory(SentRecFilesHistory)

    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ և ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DSTART",SentRecFilesHistory.FileDate_1)
    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ և ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DEND", SentRecFilesHistory.FileDate_2)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",SentRecFilesHistory.CardNumber)
    'Լրացնում է "Ցույց տալ միայն սխալները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWOERRORS",SentRecFilesHistory.ShowOnlyErrors)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",SentRecFilesHistory.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",SentRecFilesHistory.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'----------------------------------------------------------------------------
'"Ուղարկված/Ստացված վճարային Ֆայլերի պատմություն"  SentReceived_FilesHistory - Class
'----------------------------------------------------------------------------
Class SentRecPayment_FilesHistory
    Public FileDate_1
    Public FileDate_2
    Public CardNumber
    Public PaymentFileState
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        FileDate_1 = ""
        FileDate_2 = ""
        CardNumber = ""
        PaymentFileState = ""
        View = "PAYMVIEW"
        FillInto = "0"
    End Sub  
End Class

Function New_SentRecPayment_FilesHistory()
    Set New_SentRecPayment_FilesHistory = NEW SentRecPayment_FilesHistory      
End Function

'------------------------------------------------------------------------------------------
'Լրացնել "Ուղարկված/Ստացված վճարային Ֆայլերի պատմություն" SentRecPaymentFilesHistory  Ֆիլտրի արժեքները
'------------------------------------------------------------------------------------------
Sub Fill_SentRecPayment_FilesHistory(SentRecPaymentFilesHistory)

    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ և ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DSTART",SentRecPaymentFilesHistory.FileDate_1)
    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ և ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DEND", SentRecPaymentFilesHistory.FileDate_2)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNUM",SentRecPaymentFilesHistory.CardNumber)
    'Լրացնում է "Վճարային փաստաթղթի կարգավիճակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PAYMSTAT",SentRecPaymentFilesHistory.PaymentFileState)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",SentRecPaymentFilesHistory.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",SentRecPaymentFilesHistory.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'-------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Թղթապանակներ/Ուղարկող քարտեր" SendableCards - Class
'-------------------------------------------------------------------
Class SendableCards
    Public CardNumber
    Public CardType
    Public CardName
    Public AccountMask
    Public ShowCilInfo
    Public User
    Public ChangeType
    Public ChangeMakerCode
    Public ChangeDate_Start
    Public ChangeDate_End
    Public ShowChangeMakerAndDate
    Public ShowChangedFields
    Public Division
    Public Department
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        CardNumber = ""
        CardType = ""
        CardName = ""
        AccountMask = ""
        ShowCilInfo = 0
        User = ""
        ChangeType = ""
        ChangeMakerCode = ""
        ChangeDate_Start = ""
        ChangeDate_End = ""
        ShowChangeMakerAndDate = 0
        ShowChangedFields = 0
        Division = ""
        Department = ""
        View = "VCrdsNew"
        FillInto = "0"
    End Sub  
End Class

Function New_SendableCards()
    Set New_SendableCards = NEW SendableCards      
End Function

'----------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Թղթապանակներ/Ուղարկող քարտեր" Sendable Cards  Ֆիլտրի արժեքները
'----------------------------------------------------------------------------------
Sub Fill_SendableCards(SendableCard)

    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",SendableCard.CardNumber)
    'Լրացնում է "Քարտի տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDTYPE",SendableCard.CardType)
    'Լրացնում է "Քարտի անվանում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLINAME",SendableCard.CardName)
    'Լրացնում է "Հաշվի շաբլոն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCMASK",SendableCard.AccountMask)
    'Լրացնում է "Ցույց տալ հաճ. տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCLIINF",SendableCard.ShowCilInfo)
    'Լրացնում է "Կատարող" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","USER",SendableCard.User)
    'Լրացնում է "Փոփոխության տեսակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CHANGETYPE",SendableCard.ChangeType)
    'Լրացնում է "Փոփոխության կատարողի կոդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CHANGER",SendableCard.ChangeMakerCode)
    'Լրացնում է "Փոփ. ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CHANGESTDATE",SendableCard.ChangeDate_Start)
    'Լրացնում է "Փոփ. ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CHANGEENDDATE",SendableCard.ChangeDate_End)
    'Լրացնում է "Ցույց տալ փոփոխողին և ամսաթիվը" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWUSERANDDATE",SendableCard.ShowChangeMakerAndDate)
    'Լրացնում է "Ցույց տալ փոփոխված դաշտերը" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCHANGEDREKV",SendableCard.ShowChangedFields)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",SendableCard.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",SendableCard.Department)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",SendableCard.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",SendableCard.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Թղթապանակներ/Պլաստիկ քարտերի փոփոխման պատմություն" PlasticCardsChangeHistory - Class
'--------------------------------------------------------------------------------------------------
Class PlasticCardsChangeHistory
    Public State
    Public DatePeriod_Start
    Public DatePeriod_End
    Public User
    
    Private Sub Class_Initialize
         State = ""
         DatePeriod_Start = ""
         DatePeriod_End = ""
         User = ""
    End Sub  
End Class

Function New_PlasticCardsChangeHistory()
    Set New_PlasticCardsChangeHistory = NEW PlasticCardsChangeHistory      
End Function

'----------------------------------------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Թղթապանակներ/Պլաստիկ քարտերի փոփոխման պատմություն" PlasticCardsChangeHistory  Ֆիլտրի արժեքները
'----------------------------------------------------------------------------------------------------------------
Sub Fill_PlasticCardsChangeHistory(PlasticCardsChangeHist)

    'Լրացնում է "Վիճակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","STATE",PlasticCardsChangeHist.State)
    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE", PlasticCardsChangeHist.DatePeriod_Start)
    'Լրացնում է "Ժամանակահատված Ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE", PlasticCardsChangeHist.DatePeriod_End)
    'Լրացնում է "Օգտագործող" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","USER",PlasticCardsChangeHist.User)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'---------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Թղթապանակներ/Սպասարկման կետեր" MerchantPoints - Class
'---------------------------------------------------------------------
Class MerchantPoints
    Public PointsType
    Public MerchantID
    Public TerminalID
    Public AccountMask
    Public ShowClosed
    Public ShowTerminals
    Public ShowFees
    Public BTRTFileState
    Public Division
    Public Department
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        PointsType = ""
        MerchantID = ""
        TerminalID = ""
        AccountMask = ""
        ShowClosed = 0
        ShowTerminals = 0
        ShowFees = 0
        BTRTFileState = ""
        Division = ""
        Department = ""
        View = "VMerch"
        FillInto = "0"
    End Sub  
End Class

Function New_MerchantPoints()
    Set New_MerchantPoints = NEW MerchantPoints      
End Function

'----------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Թղթապանակներ/Սպասարկման կետեր"   Ֆիլտրի արժեքները
'----------------------------------------------------------------------
Sub Fill_MerchantPoints(MerchantPoints)

    'Լրացնում է "Տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","TYPE",MerchantPoints.PointsType)
    'Լրացնում է "Սպասարկման կետ N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","MRCHID",MerchantPoints.MerchantID)
    'Լրացնում է "Հաշվի շաբլոն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCMASK",MerchantPoints.AccountMask)
    'Լրացնում է "Ցույց տալ փակվածները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","CLOSED",MerchantPoints.ShowClosed)
    'Լրացնում է "Ցույց տալ տերմինալները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SHOWTERMS",MerchantPoints.ShowTerminals)
    
    If MerchantPoints.ShowTerminals = 1 Then
      'Լրացնում է "Տերմինալի N" դաշտը
      Call Rekvizit_Fill("Dialog",1,"General","TERMID",MerchantPoints.TerminalID)
    Else
      'Ստուգում "Տերմինալի N" դաշտի խմբագրելիությունը
      Call Check_ReadOnly("Dialog",1,"Mask","TERMID",True)
    End If
    
    'Լրացնում է "Ցույց տալ գանձումները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SHOWFEES",MerchantPoints.ShowFees)
    'Լրացնում է "BTRT ֆայլերի կարգավիճակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","BTRTFILESTATE",MerchantPoints.BTRTFileState)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",MerchantPoints.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",MerchantPoints.Department)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",MerchantPoints.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",MerchantPoints.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Գործողություններ" TransactionsPlasticCards - Class
'------------------------------------------------------------------------------------------
Class TransactionsPlasticCards
    Public FileDate_1
    Public FileDate_2
    Public OperationDate_1
    Public OperationDate_2
    Public InnerOuterTx
    Public CardNumber
    Public Terminal
    Public CardsTransactions
    Public MerchantPointTransactions
    Public ShowCardDetails
    Public ShowMerchDetails
    Public ShowArchivedOpers
    Public CalcDate
    Public Calc
    Public MaxAmount
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
         FileDate_1 = ""
         FileDate_2 = ""
         OperationDate_1 = ""
         OperationDate_2 = ""
         InnerOuterTx = ""
         CardNumber = ""
         Terminal = ""
         CardsTransactions = 1
         MerchantPointTransactions = 1
         ShowCardDetails = 0
         ShowMerchDetails = 0
         ShowArchivedOpers = 0
         CalcDate = ""
         Calc = "0.0000"
         MaxAmount = "0.00"
         View = "CrdMchTX"
         FillInto = "0"
    End Sub  
End Class

Function New_TransactionsPlasticCards()
    Set New_TransactionsPlasticCards = NEW TransactionsPlasticCards      
End Function

'------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Գործողություններ"  Ֆիլտրի արժեքները
'------------------------------------------------------------------------------
Sub Fill_TransactionsPlasticCards(Transactions)

    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FSDATE",Transactions.FileDate_1)
    'Լրացնում է "Ֆայլի ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FEDATE",Transactions.FileDate_2)
    'Լրացնում է "Գործողության ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",Transactions.OperationDate_1)
    'Լրացնում է "Գործողության ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",Transactions.OperationDate_2)
    'Լրացնում է "Ներքին/Արտաքին գործ." դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","IO",Transactions.InnerOuterTx)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",Transactions.CardNumber)
    'Լրացնում է "Տերմինալ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","TERMINAL",Transactions.Terminal)
    'Լրացնում է "Քարտերի գործողություւները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","CARDTRNS",Transactions.CardsTransactions)
    'Լրացնում է "Սպաս.կետերի գործողություւները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","MERCHTRNS",Transactions.MerchantPointTransactions)
    'Լրացնում է "Ցույց տալ քարտի տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCARDDETAILS",Transactions.ShowCardDetails)
    'Լրացնում է "Ցույց տալ տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWMRCHDETAILS",Transactions.ShowMerchDetails)
    'Լրացնում է "Ցույց տալ արխիվացված գործարքները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWARCHIVED",Transactions.ShowArchivedOpers)
    'Լրացնում է "Հաշվարկման ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CALCDATE",Transactions.CalcDate)
    'Լրացնում է "Տոկոս" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PRC",Transactions.Calc)
    'Լրացնում է "Մաքս.գումար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","MAXFEE",Transactions.MaxAmount)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",Transactions.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",Transactions.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'----------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտերի մնացորդներ" BalanceOfCardsPlasticCards - Class
'----------------------------------------------------------------------------------------------
Class BalanceOfCardsPlasticCards
    Public Date
    Public CardType
    Public CardStandard
    Public CardNumber
    Public Curr
    Public CardName
    Public AccountMask
    Public Client
    Public Note
    Public Note2
    Public Note3
    Public Company
    Public ShowLinkedAccRem
    Public ShowClosed
    Public ShowLimits
    Public ShowOverLimits
    Public ShowCliInf
    Public ShowOtherInfo
    Public User
    Public IdentificationWord
    Public Division
    Public Department
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
         Date = ""
         CardType = ""
         CardStandard = ""
         CardNumber = ""
         Curr = ""
         CardName = ""
         AccountMask = ""
         Client = ""
         Note = ""
         Note2 = ""
         Note3 = ""
         Company = ""
         ShowLinkedAccRem = 0
         ShowClosed = 1
         ShowLimits = 0
         ShowOverLimits = 0
         ShowCliInf = 0
         ShowOtherInfo = 0
         User = ""
         IdentificationWord = ""
         Division = ""
         Department = ""
         View = "VCrdsRem"
         FillInto = "0"
    End Sub  
End Class

Function New_BalanceOfCardsPlasticCards()
    Set New_BalanceOfCardsPlasticCards = NEW BalanceOfCardsPlasticCards      
End Function

'---------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտերի մնացորդներ"  Ֆիլտրի արժեքները
'---------------------------------------------------------------------------------
Sub Fill_BalanceOfCardsPlasticCards(BalanceOfCards)

    'Լրացնում է "ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DATE",BalanceOfCards.Date)
    'Լրացնում է "Քարտի տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDTYPE",BalanceOfCards.CardType)
    'Լրացնում է "Քարտի ստանդարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDSTD",BalanceOfCards.CardStandard)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",BalanceOfCards.CardNumber)
    'Լրացնում է "Արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CUR",BalanceOfCards.Curr)
    'Լրացնում է "Քարտի Անվանում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLINAME",BalanceOfCards.CardName)
    'Լրացնում է "Հաշվի շաբլոն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCMASK",BalanceOfCards.AccountMask)
    'Լրացնում է "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLICOD",BalanceOfCards.Client)
    'Լրացնում է "Նշում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE",BalanceOfCards.Note)
    'Լրացնում է "Նշում2" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE2",BalanceOfCards.Note2)
    'Լրացնում է "Նշում3" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE3",BalanceOfCards.Note3)
    'Լրացնում է "Հիմնարկ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","COMPANY",BalanceOfCards.Company)
    'Լրացնում է "Ցույց տալ կապակց.հաշվի մնացորդը" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWLNKACCREM",BalanceOfCards.ShowLinkedAccRem)
    'Լրացնում է "Ցույց տալ փակված պայմանագրերը" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCLOSED",BalanceOfCards.ShowClosed)
    'Լրացնում է "Ցույց տալ սահմանաչափերը" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWLIMIT",BalanceOfCards.ShowLimits)
    'Լրացնում է "Ցույց տալ գերածախսերը" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWOVERLIMIT",BalanceOfCards.ShowOverLimits)
    'Լրացնում է "Ցույց տալ հաճ. տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCLIINF",BalanceOfCards.ShowCliInf)
    'Լրացնում է "Ցույց տալ լրացուցիչ տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWOTHINFO",BalanceOfCards.ShowOtherInfo)
    'Լրացնում է "Կատարող" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","USER",BalanceOfCards.User)
    'Լրացնում է "Գաղտնաբառ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PAROLE",BalanceOfCards.IdentificationWord)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",BalanceOfCards.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",BalanceOfCards.Department)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",BalanceOfCards.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",BalanceOfCards.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'-------------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտերի շրջանառություն" TurnoverOfCardsPlasticCards - Class
'-------------------------------------------------------------------------------------------------
Class TurnoverOfCardsPlasticCards
    Public DatePeriod_Start
    Public DatePeriod_End
    Public CardType
    Public CardNumber
    Public Curr
    Public CardName
    Public AccountMask
    Public Client
    Public Note
    Public Note2
    Public Note3
    Public Company
    Public IdentificationWord
    Public ShowOverdraftDisRepayment
    Public ShowClosed
    Public InWhichCurrShowSums
    Public Division
    Public Department
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
         DatePeriod_Start = ""
         DatePeriod_End = ""
         CardType = ""
         CardNumber = ""
         Curr = ""
         CardName = ""
         AccountMask = ""
         Client = ""
         Note = ""
         Note2 = ""
         Note3 = ""
         Company = ""
         IdentificationWord = ""
         ShowOverdraftDisRepayment = 0
         ShowClosed = 1
         InWhichCurrShowSums = ""
         Division = ""
         Department = ""
         View = "PCrdTurn"
         FillInto = "0"
    End Sub  
End Class

Function New_TurnoverOfCardsPlasticCards()
    Set New_TurnoverOfCardsPlasticCards = NEW TurnoverOfCardsPlasticCards      
End Function

'-----------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտերի շրջանառություն"  Ֆիլտրի արժեքները
'-----------------------------------------------------------------------------------
Sub Fill_TurnoverOfCardsPlasticCards(TurnoverOfCards)

    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",TurnoverOfCards.DatePeriod_Start)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",TurnoverOfCards.DatePeriod_End)
    'Լրացնում է "Քարտի տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDTYPE",TurnoverOfCards.CardType)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",TurnoverOfCards.CardNumber)
    'Լրացնում է "Արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CUR",TurnoverOfCards.Curr)
    'Լրացնում է "Քարտի Անվանում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLINAME",TurnoverOfCards.CardName)
    'Լրացնում է "Հաշվի շաբլոն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCMASK",TurnoverOfCards.AccountMask)
    'Լրացնում է "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLICOD",TurnoverOfCards.Client)
    'Լրացնում է "Նշում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE",TurnoverOfCards.Note)
    'Լրացնում է "Նշում2" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE2",TurnoverOfCards.Note2)
    'Լրացնում է "Նշում3" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE3",TurnoverOfCards.Note3)
    'Լրացնում է "Հիմնարկ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","COMPANY",TurnoverOfCards.Company)
    'Լրացնում է "Գաղտնաբառ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PAROLE",TurnoverOfCards.IdentificationWord)
    'Լրացնում է "Ցույց տալ օվերդրաֆտի տրամադրում/մարումները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWOVERDRAFTOPERS",TurnoverOfCards.ShowOverdraftDisRepayment)
    'Լրացնում է "Ցույց տալ փակված պայմանագրերը" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCLOSED",TurnoverOfCards.ShowClosed)
    'Լրացնում է "Ո՞ր արժույթով ցույց տալ գումարները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","WHICHCUR",TurnoverOfCards.InWhichCurrShowSums)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",TurnoverOfCards.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",TurnoverOfCards.Department)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",TurnoverOfCards.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",TurnoverOfCards.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'----------------------------------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտերի միջին մնացորդ.շրջանառություն" AverageBalance_TurnoverPlasticCards - Class
'----------------------------------------------------------------------------------------------------------------------
Class AverageBalance_TurnoverPlasticCards
    Public DatePeriod_Start
    Public DatePeriod_End
    Public CardType
    Public CardNumber
    Public Curr
    Public CardName
    Public AccountMask
    Public Client
    Public Note
    Public Note2
    Public Note3
    Public Company
    Public IdentificationWord
    Public ShowClosed
    Public InWhichCurrShowSums
    Public Division
    Public Department
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
         DatePeriod_Start = ""
         DatePeriod_End = ""
         CardType = ""
         CardNumber = ""
         Curr = ""
         CardName = ""
         AccountMask = ""
         Client = ""
         Note = ""
         Note2 = ""
         Note3 = ""
         Company = ""
         IdentificationWord = ""
         ShowClosed = 1
         InWhichCurrShowSums = ""
         Division = ""
         Department = ""
         View = "PCrdTurn"
         FillInto = "0"
    End Sub  
End Class

Function New_AverageBalance_TurnoverPlasticCards()
    Set New_AverageBalance_TurnoverPlasticCards= NEW AverageBalance_TurnoverPlasticCards      
End Function

'------------------------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտերի  միջին մնացորդ.շրջանառություն"  Ֆիլտրի արժեքները
'------------------------------------------------------------------------------------------------
Sub Fill_AverageBalance_TurnoverPlasticCards(AverageBalance_Turnover)

    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",AverageBalance_Turnover.DatePeriod_Start)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",AverageBalance_Turnover.DatePeriod_End)
    'Լրացնում է "Քարտի տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDTYPE",AverageBalance_Turnover.CardType)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",AverageBalance_Turnover.CardNumber)
    'Լրացնում է "Արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CUR",AverageBalance_Turnover.Curr)
    'Լրացնում է "Քարտի Անվանում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLINAME",AverageBalance_Turnover.CardName)
    'Լրացնում է "Հաշվի շաբլոն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCMASK",AverageBalance_Turnover.AccountMask)
    'Լրացնում է "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLICOD",AverageBalance_Turnover.Client)
    'Լրացնում է "Նշում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE",AverageBalance_Turnover.Note)
    'Լրացնում է "Նշում2" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE2",AverageBalance_Turnover.Note2)
    'Լրացնում է "Նշում3" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE3",AverageBalance_Turnover.Note3)
    'Լրացնում է "Հիմնարկ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","COMPANY",AverageBalance_Turnover.Company)
    'Լրացնում է "Գաղտնաբառ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PAROLE",AverageBalance_Turnover.IdentificationWord)
    'Լրացնում է "Ցույց տալ փակված պայմանագրերը" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCLOSED",AverageBalance_Turnover.ShowClosed)
    'Լրացնում է "Ո՞ր արժույթով ցույց տալ գումարները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","WHICHCUR",AverageBalance_Turnover.InWhichCurrShowSums)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",AverageBalance_Turnover.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",AverageBalance_Turnover.Department)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",AverageBalance_Turnover.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",AverageBalance_Turnover.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'---------------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Սպասարկման վարձավճարներ" Service_Fees_PlasticCards - Class
'---------------------------------------------------------------------------------------------------
Class Service_Fees_PlasticCards
    Public Date
    Public CardType
    Public CardStandard
    Public CardNumber
    Public Curr
    Public CardName
    Public AccountMask
    Public Client
    Public Note
    Public Note2
    Public Note3
    Public Company
    Public OtherAccFeeSchema
    Public ShowLinkedAccRem
    Public ShowClosed
    Public ShowLimits
    Public ShowCliInf
    Public ShowOnlyDebts
    Public ShowOtherInfo
    Public User
    Public IdentificationWord
    Public Division
    Public Department
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
         Date = ""
         CardType = ""
         CardStandard = ""
         CardNumber = ""
         Curr = ""
         CardName = ""
         AccountMask = ""
         Client = ""
         Note = ""
         Note2 = ""
         Note3 = ""
         Company = ""
         OtherAccFeeSchema = ""
         ShowLinkedAccRem = 0
         ShowClosed = 1
         ShowLimits = 0
         ShowCliInf = 0
         ShowOnlyDebts = 1
         ShowOtherInfo = 0
         User = ""
         IdentificationWord = ""
         Division = ""
         Department = ""
         View = "SERVFEE"
         FillInto = "0"
    End Sub  
End Class

Function New_Service_Fees_PlasticCards()
    Set New_Service_Fees_PlasticCards = NEW Service_Fees_PlasticCards      
End Function

'--------------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Սպասարկման վարձավճարներ"  Ֆիլտրի արժեքները
'--------------------------------------------------------------------------------------
Sub Fill_ServiceFees_PlasticCards(Service_Fees)

    'Լրացնում է "ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DATE",Service_Fees.Date)
    'Լրացնում է "Քարտի տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDTYPE",Service_Fees.CardType)
    'Լրացնում է "Քարտի ստանդարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDSTD",Service_Fees.CardStandard)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",Service_Fees.CardNumber)
    'Լրացնում է "Արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CUR",Service_Fees.Curr)
    'Լրացնում է "Քարտի Անվանում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLINAME",Service_Fees.CardName)
    'Լրացնում է "Հաշվի շաբլոն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCMASK",Service_Fees.AccountMask)
    'Լրացնում է "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLICOD",Service_Fees.Client)
    'Լրացնում է "Նշում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE",Service_Fees.Note)
    'Լրացնում է "Նշում2" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE2",Service_Fees.Note2)
    'Լրացնում է "Նշում3" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE3",Service_Fees.Note3)
    'Լրացնում է "Հիմնարկ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","COMPANY",Service_Fees.Company)
    'Լրացնում է "Այլ հաշվ. գանձման սխեմա" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FEESCHEM",Service_Fees.OtherAccFeeSchema)
    'Լրացնում է "Ցույց տալ կապակց.հաշվի մնացորդը" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWLNKACCREM",Service_Fees.ShowLinkedAccRem)
    'Լրացնում է "Ցույց տալ փակված պայմանագրերը" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCLOSED",Service_Fees.ShowClosed)
    'Լրացնում է "Ցույց տալ սահմանաչափերը" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWLIMIT",Service_Fees.ShowLimits)
    'Լրացնում է "Ցույց տալ հաճ. տվյալները" դաշտը     
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCLIINF",Service_Fees.ShowCliInf)
    'Լրացնում է "Ցույց տալ միայն վճարման ենթակաները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWONLYDEBTS",Service_Fees.ShowOnlyDebts)
    'Լրացնում է "Ցույց տալ լրացուցիչ տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWOTHINFO",Service_Fees.ShowOtherInfo)
    'Լրացնում է "Կատարող" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","USER",Service_Fees.User)
    'Լրացնում է "Գաղտնաբառ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PAROLE",Service_Fees.IdentificationWord)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",Service_Fees.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",Service_Fees.Department)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",Service_Fees.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",Service_Fees.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'-----------------------------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտ. օվերդրաֆտների սահմանաչափերի փոփոխ." CardOverdraftLimitChange - Class
'-----------------------------------------------------------------------------------------------------------------
Class CardOverdraftLimitChange
    Public DatePeriod_Start
    Public DatePeriod_End
    Public PCardDivision
    Public ShowSentRows
    Public ShowContractDate

    Private Sub Class_Initialize
         DatePeriod_Start = ""
         DatePeriod_End = ""
         PCardDivision = ""
         ShowSentRows = 0
         ShowContractDate = 0
    End Sub  
End Class

Function New_CardOverdraftLimitChange()
    Set New_CardOverdraftLimitChange = NEW CardOverdraftLimitChange      
End Function

'--------------------------------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտ. օվերդրաֆտների սահմանաչափերի փոփոխ."  Ֆիլտրի արժեքները
'--------------------------------------------------------------------------------------------------------
Sub Fill_CardOverdraftLimitChange_PlasticCards(CardOverdraftLimitCh)

    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PBDATE",CardOverdraftLimitCh.DatePeriod_Start)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PEDate",CardOverdraftLimitCh.DatePeriod_End)
    'Լրացնում է "Քարտի գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CRDBRANCH",CardOverdraftLimitCh.PCardDivision)
    'Լրացնում է "Ցույց տալ ուղարկված տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWSENTROWS",CardOverdraftLimitCh.ShowSentRows)
    'Լրացնում է "Ցույց տալ պայմանագրի տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCONTRDETAILS",CardOverdraftLimitCh.ShowContractDate)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'----------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Վարձավճարների գանձման գործող." CardFeeOperation - Class
'----------------------------------------------------------------------------------------------
Class CardFeeOperation
    Public DatePeriod_Start
    Public DatePeriod_End
    Public CardNumber
    Public Curr
    Public AccountMask
    Public ShowCardFields
    Public Division
    Public Department
    
    Private Sub Class_Initialize
        DatePeriod_Start = ""
        DatePeriod_End = ""
        CardNumber = ""
        Curr = ""
        AccountMask = ""
        ShowCardFields = 0
        Division = ""
        Department = ""
    End Sub
End Class

Function New_CardFeeOperation()
    Set New_CardFeeOperation = NEW CardFeeOperation      
End Function

'-------------------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Վարձավճարների գանձման գործող."  Ֆիլտրի արժեքները
'-------------------------------------------------------------------------------------------
Sub Fill_CardFeeOperation_PlasticCards(CardFeeOper)

    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",CardFeeOper.DatePeriod_Start)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",CardFeeOper.DatePeriod_End)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",CardFeeOper.CardNumber)
    'Լրացնում է "Արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CUR",CardFeeOper.Curr)
    'Լրացնում է "Հաշվի շաբլոն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCMASK",CardFeeOper.AccountMask)
    'Լրացնում է "Ցույց տալ քարտի տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCARDINF",CardFeeOper.ShowCardFields)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",CardFeeOper.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",CardFeeOper.Department)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'----------------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Վարձավճ. ընդհանուր հաշվետվություն" CardServiceFeeGeneral - Class
'----------------------------------------------------------------------------------------------------
Class CardServiceFeeGeneral
    Public DatePeriod_Start
    Public DatePeriod_End
    Public Division
    Public CardType
    Public CardTypeLevel
    Public CardCurr
    Public CardCompany
    Public CardNote1
    Public CardNote2
    Public CardNote3
    
    Private Sub Class_Initialize
      DatePeriod_Start = ""
      DatePeriod_End = ""
      Division = 0
      CardType = 1
      CardTypeLevel = "1"
      CardCurr = 0
      CardCompany = 0
      CardNote1 = 0
      CardNote2 = 0
      CardNote3 = 0
    End Sub
End Class

Function New_CardServiceFeeGeneral()
    Set New_CardServiceFeeGeneral = NEW CardServiceFeeGeneral      
End Function

'---------------------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Վարձավճ. ընդհանուր հաշվետվություն"  Ֆիլտրի արժեքները
'---------------------------------------------------------------------------------------------
Sub Fill_CardServiceFeeGeneral_PlasticCards(CardServiceFeeGeneral)

    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",CardServiceFeeGeneral.DatePeriod_Start)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",CardServiceFeeGeneral.DatePeriod_End)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVACSBRANCH",CardServiceFeeGeneral.Division)
    'Լրացնում է "Քարտի տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVCARDTYPE",CardServiceFeeGeneral.CardType)
    'Լրացնում է "Քարտի տիպի մակարդակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDTYPELEVEL",CardServiceFeeGeneral.CardTypeLevel)
    'Լրացնում է "Քարտի արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVCARDCUR",CardServiceFeeGeneral.CardCurr)
    'Լրացնում է "Քարտի հիմնարկ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVCARDCOMPANY",CardServiceFeeGeneral.CardCompany)
    'Լրացնում է "Քարտի նշում 1" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVCARDNOTE1",CardServiceFeeGeneral.CardNote1)
    'Լրացնում է "Քարտի նշում 2" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVCARDNOTE2",CardServiceFeeGeneral.CardNote2)
    'Լրացնում է "Քարտի նշում 3" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVCARDNOTE3",CardServiceFeeGeneral.CardNote3)
    
    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Ստացված, հաշվառված գործողություններ" ReceivedDevelopedTransaction - Class
'--------------------------------------------------------------------------------------------------------------
Class ReceivedDevelopedTransaction
    Public FileDate_1
    Public FileDate_2
    Public OperationDate_1
    Public OperationDate_2
    Public CardNumber
    Public AccountMask
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
         FileDate_1 = ""
         FileDate_2 = ""
         OperationDate_1 = ""
         OperationDate_2 = ""
         CardNumber = ""
         AccountMask = ""
         View = "ArCaTrns"
         FillInto = "0"
    End Sub  
End Class

Function New_ReceivedDevelopedTransaction()
    Set New_ReceivedDevelopedTransaction = NEW ReceivedDevelopedTransaction      
End Function

'-----------------------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Ստացված, հաշվառված գործողություններ"  Ֆիլտրի արժեքները
'-----------------------------------------------------------------------------------------------
Sub Fill_ReceivedDevelopedTransaction(ReceivedDevelopedTrans)

    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FSDATE",ReceivedDevelopedTrans.FileDate_1)
    'Լրացնում է "Ֆայլի ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FEDATE",ReceivedDevelopedTrans.FileDate_2)
    'Լրացնում է "Գործողության ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",ReceivedDevelopedTrans.OperationDate_1)
    'Լրացնում է "Գործողության ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",ReceivedDevelopedTrans.OperationDate_2)
    'Լրացնում է "Քարտի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCODE",ReceivedDevelopedTrans.CardNumber)
    'Լրացնում է "Հաշվի շաբլոն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCMASK",ReceivedDevelopedTrans.AccountMask)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",ReceivedDevelopedTrans.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",ReceivedDevelopedTrans.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Ընդհանուր հաշվետվություն" Fill_General_Report - Class
'--------------------------------------------------------------------------------------------
Class General_Report
    Public FileDate_1
    Public FileDate_2
    Public OperationDate_1
    Public OperationDate_2
    Public OperType_checkbox
    Public CommunPayType_checkbox
    Public Division_checkbox
    Public CardType_checkbox
    Public CardCurr_checkbox
    Public CardCompany_checkbox
    Public CardNote1_checkbox
    Public CardNote2_checkbox
    Public CardNote3_checkbox
    Public MerchType_checkbox
    Public MerchCategory_checkbox
    Public MerchEquipType_checkbox
    Public MerchN_checkbox
    Public OperCurr_checkbox
    Public OperType
    Public CommunPayType
    Public Division
    Public CardType
    Public CardCurr
    Public CardCompany
    Public CardNote1
    Public CardNote2
    Public CardNote3
    Public MerchType
    Public MerchCategory
    Public MerchEquipType
    Public MerchN
    Public OperCurr
    Public ArchivedOpers
    
    Private Sub Class_Initialize
        FileDate_1 = ""
        FileDate_2 = ""
        OperationDate_1 = ""
        OperationDate_2 = ""
        OperType_checkbox = 1
        CommunPayType_checkbox = 0
        Division_checkbox = 0
        CardType_checkbox = 0
        CardCurr_checkbox = 0
        CardCompany_checkbox = 0
        CardNote1_checkbox = 0
        CardNote2_checkbox = 0
        CardNote3_checkbox = 0
        MerchType_checkbox = 0
        MerchCategory_checkbox = 0
        MerchEquipType_checkbox = 0
        MerchN_checkbox = 0
        OperCurr_checkbox = 0
        OperType = ""
        CommunPayType = ""
        Division = ""
        CardType = ""
        CardCurr = ""
        CardCompany = ""
        CardNote1 = ""
        CardNote2 = ""
        CardNote3 = ""
        MerchType = ""
        MerchCategory = ""
        MerchEquipType = ""
        MerchN = ""
        OperCurr = ""
        ArchivedOpers = 0
    End Sub  
End Class

Function New_General_Report()
    Set New_General_Report = NEW General_Report      
End Function

'-------------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Ընդհանուր հաշվետվություն"  Ֆիլտրի արժեքները
'-------------------------------------------------------------------------------------
Sub Fill_General_Report(GeneralReport)

    'Լրացնում է "Ֆայլի ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FSDATE",GeneralReport.FileDate_1)
    'Լրացնում է "Ֆայլի ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FEDATE",GeneralReport.FileDate_2)
    'Լրացնում է "Գործողության ամսաթիվ սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","OPSDATE",GeneralReport.OperationDate_1)
    'Լրացնում է "Գործողության ամսաթիվ ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","OPEDATE",GeneralReport.OperationDate_2)

    'Լրացնում է "Գործողության տիպ - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVOPTYPE",GeneralReport.OperType_checkbox)
    'Լրացնում է "Գործողության տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","OPTYPE",GeneralReport.OperType)
    
    'Լրացնում է "Կոմունալ վճարման տիպ - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVCOMMUNTYPE",GeneralReport.CommunPayType_checkbox)
    'Լրացնում է "Կոմունալ վճարման տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","COMMUNTYPE",GeneralReport.CommunPayType)
    
    'Լրացնում է "Գրասենյակ - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVACSBRANCH",GeneralReport.Division_checkbox)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",GeneralReport.Division)
    
    'Լրացնում է "Քարտի տիպ - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVCARDTYPE",GeneralReport.CardType_checkbox)
    'Լրացնում է "Քարտի տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDTYPE",GeneralReport.CardType)
    
    'Լրացնում է "Քարտի արժույթ - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVCARDCUR",GeneralReport.CardCurr_checkbox)
    'Լրացնում է "Քարտի արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCUR",GeneralReport.CardCurr)
    
    'Լրացնում է "Քարտի հիմնարկ - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVCARDCOMPANY",GeneralReport.CardCompany_checkbox)
    'Լրացնում է "Քարտի հիմնարկ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDCOMPANY",GeneralReport.CardCompany)
    
    'Լրացնում է "Քարտի նշում 1 - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVCARDNOTE1",GeneralReport.CardNote1_checkbox)
    'Լրացնում է "Քարտի նշում 1" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE1",GeneralReport.CardNote1)
    
    'Լրացնում է "Քարտի նշում 2 - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVCARDNOTE2",GeneralReport.CardNote2_checkbox)
    'Լրացնում է "Քարտի նշում 2" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE2",GeneralReport.CardNote2)
    
    'Լրացնում է "Քարտի նշում 3 - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVCARDNOTE3",GeneralReport.CardNote3_checkbox)
    'Լրացնում է "Քարտի նշում 3" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CARDNOTE3",GeneralReport.CardNote3)
    
    'Լրացնում է "Սպասարկման կետի տիպ - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVMERCHTYPE",GeneralReport.MerchType_checkbox)
    'Լրացնում է "Սպասարկման կետի տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","MERCHTYPE",GeneralReport.MerchType)
    
    'Լրացնում է "Սպասարկման կետի տեսակ - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVMERCHSORT",GeneralReport.MerchCategory_checkbox)
    'Լրացնում է "Սպասարկման կետի տեսակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","MERCHSORT",GeneralReport.MerchCategory)
    
    'Լրացնում է "Սպասարկման կետի սարքի տեսակ - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVMERCHEQPMNT",GeneralReport.MerchEquipType_checkbox)
    'Լրացնում է "Սպասարկման կետի սարքի տեսակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","MERCHEQPMNT",GeneralReport.MerchEquipType)
    
    'Լրացնում է "Սպասարկման կետի N - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVMERCHID",GeneralReport.MerchN_checkbox)
    'Լրացնում է "Սպասարկման կետի N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","MERCHID",GeneralReport.MerchN)
    
    'Լրացնում է "Գործողության արժույթ - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DIVOPCUR",GeneralReport.OperCurr_checkbox)
    'Լրացնում է "Գործողության արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","OPCUR",GeneralReport.OperCurr)
    
    'Լրացնում է "Արխիվացված գործարքներ - CheckBox" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWARCHIVED",GeneralReport.ArchivedOpers)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Արտարժույթների փոխարժեքներ/Քարտային համակարգերի փոխարժ." CardSystemsExchangeRates - Class
'--------------------------------------------------------------------------------------------------------------------------------
Class CardSystemsExchangeRates
    Public DatePeriod_Start
    Public DatePeriod_End
    Public Curr
    
    Private Sub Class_Initialize
        DatePeriod_Start = ""
        DatePeriod_End = ""
        Curr = ""
    End Sub
End Class

Function New_CardSystemsExchangeRates()
    Set New_CardSystemsExchangeRates = NEW CardSystemsExchangeRates      
End Function

'------------------------------------------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Արտարժույթների փոխարժեքներ/Քարտային համակարգերի փոխարժ."  Ֆիլտրի արժեքները
'------------------------------------------------------------------------------------------------------------------
Sub Fill_CardSystemsExchangeRates_PlasticCards(CardSystemsExchangeRates)

    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","STARTDATE",CardSystemsExchangeRates.DatePeriod_Start)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ENDDATE",CardSystemsExchangeRates.DatePeriod_End)
    'Լրացնում է "Արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CUR",CardSystemsExchangeRates.Curr)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'----------------------------------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Արտարժույթների փոխարժեքներ/Դիլինգային փոխարժեքներ" CardSystemsExchangeRates - Class
'----------------------------------------------------------------------------------------------------------------------
Class DealingExchangeRates
    Public DatePeriod_Start
    Public DatePeriod_End
    Public Curr1
    Public Curr2
    Public RateType
    Public ShowTheLastRates
    Public Division
    
    Private Sub Class_Initialize
        DatePeriod_Start = ""
        DatePeriod_End = ""
        Curr1 = ""
        Curr2 = ""
        RateType = ""
        ShowTheLastRates = 1
        Division = ""
    End Sub
End Class

Function New_DealingExchangeRates()
    Set New_DealingExchangeRates = NEW DealingExchangeRates      
End Function

'----------------------------------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Արտարժույթների փոխարժեքներ/Դիլինգային փոխարժեքներ"  Ֆիլտրի արժեքները
'----------------------------------------------------------------------------------------------------------
Sub Fill_DealingExchangeRates_PlasticCards(DealingExchangeRates)

    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERN",DealingExchangeRates.DatePeriod_Start)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERK",DealingExchangeRates.DatePeriod_End)
    'Լրացնում է "Արժույթ 1" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CUR1",DealingExchangeRates.Curr1)
    'Լրացնում է "Արժույթ 2" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CUR2",DealingExchangeRates.Curr2)
    'Լրացնում է "Փոխարժեքի տեսակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","RATETYPE",DealingExchangeRates.RateType)
    'Լրացնում է "Ցույց տալ վերջնական փոխարժեքները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","LASTRATE",DealingExchangeRates.ShowTheLastRates)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",DealingExchangeRates.Division)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'-------------------------------------------------------------------------------------------------------------------
'"Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Արտարժույթների փոխարժեքներ/ՀՀ ԿԲ փոխարժեքներ" CardSystemsExchangeRates - Class
'-------------------------------------------------------------------------------------------------------------------
Class CBExchangeRates
    Public DatePeriod_Start
    Public DatePeriod_End
    Public Curr
    
    Private Sub Class_Initialize
        DatePeriod_Start = ""
        DatePeriod_End = ""
        Curr = ""
    End Sub
End Class

Function New_CBExchangeRates()
    Set New_CBExchangeRates = NEW CBExchangeRates      
End Function

'-------------------------------------------------------------------------------------------------------
'Լրացնել "Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Արտարժույթների փոխարժեքներ/ՀՀ ԿԲ փոխարժեքներ"  Ֆիլտրի արժեքները
'-------------------------------------------------------------------------------------------------------
Sub Fill_CBExchangeRates_PlasticCards(CBExchangeRates)

    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERN",CBExchangeRates.DatePeriod_Start)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERK",CBExchangeRates.DatePeriod_End)
    'Լրացնում է "Արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CUR",CBExchangeRates.Curr)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'---------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաճախորդներ թղթապանակ
'---------------------------------------------------
'Client  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoToClients_PlasticCarts(Client) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³×³Ëáñ¹Ý»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_Clients(Client)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Clients Filter",,,ErrorColor      
    End If 
End Sub 

'-----------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Պլաստիկ քարտեր թղթապանակ
'-----------------------------------------------------
'PlasticCart  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoToPlasticCarts_PlasticCarts(PlasticCart) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|äÉ³ëïÇÏ ù³ñï»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_PlasticCarts(PlasticCart)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open PlasticCart Filter",,,ErrorColor      
    End If 
End Sub 

'---------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Քարտային հաշիվների գործողություններ թղթապանակ
'---------------------------------------------------------------------
'CardAccTrans  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoToCardAccTrans_PlasticCarts(CardAccTrans) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|ø³ñï³ÛÇÝ Ñ³ßÇíÝ»ñÇ ·áñÍáÕáõÃÛáõÝÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_CardAccountsTrans(CardAccTrans)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Card Accounts Transactions Filter",,,ErrorColor      
    End If 
End Sub 

'-------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Ստացված գործողություններ թղթապանակ
'-------------------------------------------------------------
'ReceivedTrans  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoToReceivedTrans_PlasticCarts(ReceivedTrans) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|êï³óí³Í ·áñÍáÕáõÃÛáõÝÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_ReceivedTransactions(ReceivedTrans)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Received Transactions Filter",,,ErrorColor      
    End If 
End Sub 

'-----------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Hold/Unhold գործողություններ թղթապանակ
'-----------------------------------------------------------------
'HoldUnholdTrans  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoToHoldUnholdTrans_PlasticCarts(HoldUnholdTrans) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Hold/Unhold ·áñÍáÕáõÃÛáõÝÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_HoldUnholdTransactions(HoldUnholdTrans)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Hold/Unhold Transactions Filter",,,ErrorColor      
    End If 
End Sub 

'------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Ստացված հանրագումարներ թղթապանակ
'------------------------------------------------------------
'RecClearingTrans  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoToRecClearingTrans_PlasticCarts(RecClearingTrans) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|êï³óí³Í Ñ³Ýñ³·áõÙ³ñÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_ReceivedClearingTransactions(RecClearingTrans)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Received Clearing Transactions Filter",,,ErrorColor      
    End If 
End Sub 

'---------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/MC Ստացված գործողություններ թղթապանակ
'---------------------------------------------------------------
'MCReceivedTrans  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoToMCReceivedTrans_PlasticCarts(MCReceivedTrans) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|MC ëï³óí³Í ·áñÍáÕáõÃÛáõÝÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_MCReceivedTrans(MCReceivedTrans)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open MC Received Transactions Filter",,,ErrorColor      
    End If 
End Sub 

'--------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Համատեղ տերմինալ գործողություններ թղթապանակ
'--------------------------------------------------------------------
'SharedTerminalOperation  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoToSharedTermOperation_PlasticCarts(SharedTerminalOperation) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³Ù³ï»Õ ï»ñÙÇÝ³É. ·áñÍáÕáõÃÛáõÝÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_SharedTerminalOperations(SharedTerminalOperation)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Shared Terminal Operation Filter",,,ErrorColor      
    End If 
End Sub 

'----------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/SMS Հաղորդագրություն թղթապանակ
'----------------------------------------------------------
'SMS_Messages  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoToSMS_Messages_PlasticCarts(SMS_Messages)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|SMS Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_SMS_Messages(SMS_Messages)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open SMS Messages Filter",,,ErrorColor      
    End If 
End Sub

'----------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/USSD Հաշվետվություն թղթապանակ
'----------------------------------------------------------
'USSD_Reports  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoToUSSD_Reports_PlasticCarts(USSD_Reports)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|USSD Ñ³ßí»ïíáõÃÛáõÝ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_USSD_Reports(USSD_Reports)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open USSD_Reports Filter",,,ErrorColor      
    End If 
End Sub

'------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Ուղարկված/Ստացված Ֆայլերի պատմություն թղթապանակ
'------------------------------------------------------------------------
'SentReceived_FilesHistory  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoToSentReceived_FilesHistory_PlasticCarts(SentReceived_FilesHistory)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|àõÕ³ñÏí³Í/êï³óí³Í ý³ÛÉ»ñÇ å³ïÙáõÃÛáõÝ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_SentReceived_FilesHistory(SentReceived_FilesHistory)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Sent Received Files History Filter",,,ErrorColor      
    End If 
End Sub


'-------------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Ուղարկված/Ստացված վճարային Ֆայլերի պատմություն թղթապանակ
'-------------------------------------------------------------------------------
'SentRecPayment_FilesHistory  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoToSentRecPayment_FilesHistory_PlasticCarts(SentRecPayment_FilesHistory)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|àõÕ³ñÏí³Í/êï³óí³Í í×³ñ³ÛÇÝ ý³ÛÉ»ñÇ å³ïÙáõÃÛáõÝ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_SentRecPayment_FilesHistory(SentRecPayment_FilesHistory)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Sent Received Payment Files History Filter",,,ErrorColor      
    End If 
End Sub

'-------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Թղթապանակներ/Ուղարկող քարտեր թղթապանակ
'-------------------------------------------------------------------
'SendableCard  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_SendableCard_PlasticCarts(SendableCard)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|ÂÕÃ³å³Ý³ÏÝ»ñ|àõÕ³ñÏíáÕ ù³ñï»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_SendableCards(SendableCard)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Sendable Cards Filter",,,ErrorColor      
    End If 
End Sub

'-------------------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Թղթապանակներ/Պլաստիկ քարտերի փոփոխման պատմություն թղթապանակ
'-------------------------------------------------------------------------------------
'PlasticCardsChangeHistory  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_PlasticCardsChangeHistory(PlasticCardsChangeHist)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|ÂÕÃ³å³Ý³ÏÝ»ñ|äÉ³ëïÇÏ ù³ñï»ñÇ ÷á÷áËÙ³Ý å³ïÙáõÃÛáõÝ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_PlasticCardsChangeHistory(PlasticCardsChangeHist)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards Change History Filter",,,ErrorColor      
    End If 
End Sub

'--------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Թղթապանակներ/Սպասարկման կետեր թղթապանակ
'--------------------------------------------------------------------
'MerchantPoints  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_PlasticCardsMerchantPoints(MerchantPoints)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|ÂÕÃ³å³Ý³ÏÝ»ñ|êå³ë³ñÏÙ³Ý Ï»ï»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_MerchantPoints(MerchantPoints)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Merchant Points Filter",,,ErrorColor      
    End If 
End Sub

'-----------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Գործողություններ թղթապանակ
'-----------------------------------------------------------------------------
'Transactions  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_TransactionsForPlasticCards(Transactions)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|¶áñÍáÕáõÃÛáõÝÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_TransactionsPlasticCards(Transactions)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards - Transactions Filter",,,ErrorColor      
    End If 
End Sub

'-----------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտերի մնացորդներ թղթապանակ
'-----------------------------------------------------------------------------
'BalanceOfCards  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_BalanceOfCardsForPlasticCards(BalanceOfCards)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|ø³ñï»ñÇ ÙÝ³óáñ¹Ý»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_BalanceOfCardsPlasticCards(BalanceOfCards)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards - Balance Of Cards Filter",,,ErrorColor      
    End If 
End Sub

'-----------------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտերի շրջանառություն թղթապանակ
'-----------------------------------------------------------------------------------
'TurnoverOfCards  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_TurnoverOfCardsForPlasticCards(TurnoverOfCards)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|ø³ñï»ñÇ ßñç³Ý³éáõÃÛáõÝ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_TurnoverOfCardsPlasticCards(TurnoverOfCards)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards - Turnover Of Cards Filter",,,ErrorColor      
    End If 
End Sub

'-----------------------------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտերի միջին մնացորդ.շրջանառություն թղթապանակ
'-----------------------------------------------------------------------------------------------
'AverageBalance_Turnover  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_AverageBalance_TurnoverForPlasticCards(AverageBalance_Turnover)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|ø³ñï»ñÇ ÙÇçÇÝ ÙÝ³óáñ¹,ßñç³Ý³éáõÃÛáõÝ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_AverageBalance_TurnoverPlasticCards(AverageBalance_Turnover)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards - Average Balance & Turnover Of Cards Filter",,,ErrorColor      
    End If 
End Sub

'-------------------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Սպասարկման վարձավճարներ թղթապանակ
'-------------------------------------------------------------------------------------
'Service_Fees  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_Service_FeesPlasticCards(Service_Fees)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|êå³ë³ñÏÙ³Ý í³ñÓ³í×³ñÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_ServiceFees_PlasticCards(Service_Fees)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards - Service Fees Filter",,,ErrorColor      
    End If 
End Sub

'-----------------------------------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Քարտ. օվերդրաֆտների սահմանաչափերի փոփոխ. թղթապանակ
'-----------------------------------------------------------------------------------------------------
'CardOverdraftLimitChange  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_CardOverdraftLimitChange_PlasticCards(CardOverdraftLimitChange)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|ø³ñï.ûí»ñ¹ñ³ýïÝ»ñÇ ë³ÑÙ³Ý³ã³÷»ñÇ ÷á÷áË.")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_CardOverdraftLimitChange_PlasticCards(CardOverdraftLimitChange)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards - Card Overdraft Limit Change Filter",,,ErrorColor      
    End If 
End Sub

'------------------------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Վարձավճարների գանձման գործող. թղթապանակ
'------------------------------------------------------------------------------------------
'CardFeeOperation  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_CardFeeOperation_PlasticCards(CardFeeOperation)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|ì³ñÓ³í×³ñÝ»ñÇ ·³ÝÓÙ³Ý ·áñÍáÕ.")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_CardFeeOperation_PlasticCards(CardFeeOperation)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards - Card Fee Operation Filter",,,ErrorColor      
    End If 
End Sub

'--------------------------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Վարձավճ. ընդհանուր հաշվետվություն թղթապանակ
'--------------------------------------------------------------------------------------------
'CardServiceFeeGeneral  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_CardServiceFeeGeneral_PlasticCards(CardServiceFeeGeneral)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|ì³ñÓ³í×. ÁÝ¹Ñ³Ýáõñ Ñ³ßí»ïíáõÃÛáõÝ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_CardServiceFeeGeneral_PlasticCards(CardServiceFeeGeneral)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards - Card Service Fee General Filter",,,ErrorColor      
    End If 
End Sub

'--------------------------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Ստացված, հաշվառված գործողություններ թղթապանակ
'--------------------------------------------------------------------------------------------
'ReceivedDevelopedTrans  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_ReceivedDevelopedTrans_PlasticCards(ReceivedDevelopedTrans)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|êï³óí³Í, Ñ³ßí³éí³Í ·áñÍáÕáõÃÛáõÝÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_ReceivedDevelopedTransaction(ReceivedDevelopedTrans)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards - Received Developed Transaction Filter",,,ErrorColor      
    End If 
End Sub

'------------------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Ընդհանուր հաշվետվություն թղթապանակ
'------------------------------------------------------------------------------------
'GeneralReport  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_General_Report_PlasticCards(GeneralReport)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|ÀÝ¹Ñ³Ýáõñ Ñ³ßí»ïíáõÃÛáõÝ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_General_Report(GeneralReport)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards - General Report Filter",,,ErrorColor      
    End If 
End Sub

'-------------------------------------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Արտարժույթների փոխարժեքներ/Քարտային համակարգերի փոխարժ.
'-------------------------------------------------------------------------------------------------------
'CardSystemsExchangeRates  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_CardSystemsExchangeRates_PlasticCards(CardSystemsExchangeRates)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|²ñï³ñÅáõÛÃÝ»ñÇ ÷áË³ñÅ»ùÝ»ñ|ø³ñï³ÛÇÝ Ñ³Ù³Ï³ñ·»ñÇ ÷áË³ñÅ.")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_CardSystemsExchangeRates_PlasticCards(CardSystemsExchangeRates)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards - Card Systems Exchange Rates Filter",,,ErrorColor      
    End If 
End Sub

'------------------------------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Արտարժույթների փոխարժեքներ/Դիլինգային փոխարժեքներ
'------------------------------------------------------------------------------------------------
'DealingExchangeRates  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_DealingExchangeRates_PlasticCards(DealingExchangeRates)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|²ñï³ñÅáõÛÃÝ»ñÇ ÷áË³ñÅ»ùÝ»ñ|¸ÇÉÇÝ·³ÛÇÝ ÷áË³ñÅ»ùÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_DealingExchangeRates_PlasticCards(DealingExchangeRates)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards - Dealing Exchange Rates Filter",,,ErrorColor      
    End If 
End Sub

'------------------------------------------------------------------------------------------------
'Մուտք է գործում Պլաստիկ Քարտեր ԱՇՏ/Հաշվետվություններ, մատյաններ/Արտարժույթների փոխարժեքներ/ՀՀ ԿԲ փոխարժեքներ
'------------------------------------------------------------------------------------------------
'CBExchangeRates  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_CBExchangeRates_PlasticCards(CBExchangeRates)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|²ñï³ñÅáõÛÃÝ»ñÇ ÷áË³ñÅ»ùÝ»ñ|ÐÐ Î´ ÷áË³ñÅ»ùÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_CBExchangeRates_PlasticCards(CBExchangeRates)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Plastic Cards - CB Exchange Rates Filter",,,ErrorColor      
    End If 
End Sub
