'USEUNIT Library_Common 
'USEUNIT Library_Colour
'USEUNIT Constants
'USEUNIT Library_Contracts
Option Explicit

'----------------------------------------
'"Պահատեղի լրացման կլասս" DepositBox - Class
'----------------------------------------
Class Deposit_Box
    Public Isn
    Public Number
    Public Type1
    Public OpeningDate
    Public ClosingDate
    Public Division
    Public AdditionalInformation
    
    Private Sub Class_Initialize
        Isn = ""
        Number = ""
        Type1 = ""
        OpeningDate = ""
        ClosingDate = ""
        Division = ""
        AdditionalInformation = ""
    End Sub  
End Class

Function New_Deposit_Box()
    Set New_Deposit_Box = NEW Deposit_Box    
End Function

'----------------------------------------
'Լրացնել "Պահատեղերի" DepositBoxes  արժեքները
'----------------------------------------
Sub Fill_DepositBox_Window(DepositBox)

    'Լրացնում է "Համար" դաշտը
    Call Rekvizit_Fill("Document",1,"General","NUMBER",DepositBox.Number)
    'Լրացնում է "Տիպ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","TYPE",DepositBox.Type1)
    
    'Լրացնում է "Բացման ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","OPENDATE",DepositBox.OpeningDate)
    'Լրացնում է "Փակման ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","CLOSEDATE",DepositBox.ClosingDate)
    
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","ACSBRANCH",DepositBox.Division)
    'Լրացնում է "Լրացուցիչ ինֆորմացիա" դաշտը
    Call Rekvizit_Fill("Document",1,"General","ADDINFO",DepositBox.AdditionalInformation)

    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'----------------------------------------------
'Ստեղծել Պահատեղ
'----------------------------------------------
Sub Create_DepositBox(Deposit_Box)
    Dim DocForm
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Add)

    Set DocForm = wMDIClient.WaitVBObject("frmASDocForm", 2000)
    
    If DocForm.Exists Then
        'ISN-ի վերագրում փոփոխականին
        Deposit_Box.Isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
        'Լրացնել "Պահատեղ(նոր)" պատուհանիի արժեքները
        Call Fill_DepositBox_Window(Deposit_Box)
    Else
        Log.Error "Can Not Open Deposit Box Window",,,ErrorColor        
    End If
    BuiltIn.Delay(2000)
    If DocForm.Exists Then
        Log.Error "Can Not Close Deposit Box Window",,,ErrorColor
    End If
End Sub

'--------------------------------------------------
'"Պահատեղերի ֆիլտրի լրացման կլասս" DepositBoxes - Class
'--------------------------------------------------
Class Deposit_Boxes_Filter
    Public Type1
    Public Number
    Public Division
    Public OccupState
    Public AgrInfo
    Public ShowClosed
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        Type1 = ""
        Number = ""
        Division = ""
        OccupState = ""
        AgrInfo = 0
        ShowClosed = 0
        View = "DBoxes"
        FillInto = "0"
    End Sub  
End Class

Function New_Deposit_Boxes_Filter()
    Set New_Deposit_Boxes_Filter = NEW Deposit_Boxes_Filter      
End Function

'----------------------------------------------
'Լրացնել "Պահատեղերի" DepositBoxes  Ֆիլտրի արժեքները
'----------------------------------------------
Sub Fill_DepositBoxes_Filter(DepositBoxes)

    'Լրացնում է "Տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","TYPES",DepositBoxes.Type1)
    'Լրացնում է "Համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DBOXNUMBER",DepositBoxes.Number)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",DepositBoxes.Division)
    'Լրացնում է "Զբաղվ.վիճակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","OCCUPIED",DepositBoxes.OccupState)
    
    If DepositBoxes.OccupState = "2" Then
        'Լրացնում է "Պայմ.տվյալներ" դաշտը
        Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWAGRINFO",DepositBoxes.AgrInfo)
        'Ստուգում է "Ցույց տալ փակվածները" դաշտի խմբագրելիությունը
        Call Check_ReadOnly("Dialog",1,"CheckBox","SHOWCLOSED",True)
    ElseIf  DepositBoxes.OccupState = "1" Then
        'Ստուգում է "Պայմ.տվյալներ" դաշտի խմբագրելիությունը
        Call Check_ReadOnly("Dialog",1,"CheckBox","SHOWAGRINFO",True)
        'Լրացնում է "Ցույց տալ փակվածները" դաշտը
        Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCLOSED",DepositBoxes.ShowClosed)
    Else
        'Լրացնում է "Պայմ.տվյալներ" դաշտը
        Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWAGRINFO",DepositBoxes.AgrInfo)
        'Լրացնում է "Ցույց տալ փակվածները" դաշտը
        Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCLOSED",DepositBoxes.ShowClosed)
    End If
    
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",DepositBoxes.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",DepositBoxes.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'----------------------------------------------
'Մուտք է գործում Պահատեղերի ԱՇՏ/Պահատեղեր թղթապանակ
'----------------------------------------------
'DepositBoxes  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_DepositBoxes(DepositBoxes) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|ä³Ñ³ï»Õ»ñÇ ²Þî|ä³Ñ³ï»Õ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_DepositBoxes_Filter(DepositBoxes)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Deposit Boxes Filter",,,ErrorColor      
    End If 
End Sub 

'-----------------------------------------------------------------------------------
'"Պահատեղի աշխատանքային փաստաթղթեր ֆիլտրի լրացման կլասս" Deposit_Boxes_WorkingAgr - Class
'-----------------------------------------------------------------------------------
Class Deposit_Boxes_WorkingAgr
    Public DataPeriod_Start
    Public DataPeriod_End
    Public Executors
    Public DocumentType
    Public Client
    Public Agreement
    Public DepositBoxNumber
    Public Division
    Public Department
    Public AccessType
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        DataPeriod_Start = ""
        DataPeriod_End = ""
        Executors = ""
        DocumentType = ""
        Client = ""
        Agreement = ""
        DepositBoxNumber = ""
        Division = ""
        Department = ""
        AccessType = ""
        View = "DBWorks"
        FillInto = "0"
    End Sub  
End Class

Function New_Deposit_Boxes_WorkingAgr()
    Set New_Deposit_Boxes_WorkingAgr = NEW Deposit_Boxes_WorkingAgr      
End Function

'-------------------------------------------------------------------------------
'Լրացնել "Պահատեղի աշխատանքային փաստաթղթեր" DepositBoxes_WorkingAgr  Ֆիլտրի արժեքները
'-------------------------------------------------------------------------------
Sub Fill_DepositBoxes_WorkingAgr(DepositBoxes_WorkingAgr)
    
    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","STARTDATE",DepositBoxes_WorkingAgr.DataPeriod_Start)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ENDDATE",DepositBoxes_WorkingAgr.DataPeriod_End)
    'Լրացնում է "Կարատողներ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","USER",DepositBoxes_WorkingAgr.Executors)
    'Լրացնում է "Փաստաթղթի տեսակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DOCTYPE",DepositBoxes_WorkingAgr.DocumentType)
    'Լրացնում է "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLICODE",DepositBoxes_WorkingAgr.Client)
    'Լրացնում է "Պայմանագրի N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","AGRNUM",DepositBoxes_WorkingAgr.Agreement)
    'Լրացնում է "Պահատեղի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DBOXNUMBER",DepositBoxes_WorkingAgr.DepositBoxNumber)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",DepositBoxes_WorkingAgr.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",DepositBoxes_WorkingAgr.Department)
    'Լրացնում է "Հասան Ն-տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSTYPE",DepositBoxes_WorkingAgr.AccessType)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",DepositBoxes_WorkingAgr.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",DepositBoxes_WorkingAgr.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub


'-----------------------------------------------------------------------------------------------
'Մուտք է գործում "Պահատեղերի ԱՇՏ/Թղթապանակներ/Հաշվետվություններ/Պահատեղի աշխատանքային փաստաթղթեր" թղթապանակ
'-----------------------------------------------------------------------------------------------
'Deposit_Box_WorkingAgr_Filter  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|ä³Ñ³ï»Õ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ / Ð³ßí»ïíáõÃÛáõÝÝ»ñ|ä³Ñ³ï»ÕÇ ³ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr)
        Call WaitForExecutionProgress()
        
        If FilterWin.Exists Then 
            Log.Error "Can Not Open Deposit Working Agreement Pttel",,,ErrorColor   
        End If
    Else
        Log.Error "Can Not Open Deposit Working Agreement Filter",,,ErrorColor      
    End If 
End Sub 

'-----------------------------------------------------------------------------------
'"Պահատեղի աշխատանքային փաստաթղթեր ֆիլտրի լրացման կլասս" Deposit_Boxes_WorkingAgr - Class
'-----------------------------------------------------------------------------------
Class WorkingAgreement_ForDeposit
    Public DataPeriod_Start
    Public DataPeriod_End
    Public Curr
    Public Executors
    Public DocumentType
    Public RecPaySystem
    Public SentPaySystem
    Public Note
    Public Division
    Public Department
    Public View
    Public FillInto 
    
    Private Sub Class_Initialize
        DataPeriod_Start = ""
        DataPeriod_End = ""
        Curr = ""
        Executors = ""
        DocumentType = ""
        RecPaySystem = ""
        SentPaySystem = ""
        Note = ""
        Division = ""
        Department = ""
        View = "Oper"
        FillInto = "0"
    End Sub  
End Class

Function New_WorkingAgreementForDeposit()
    Set New_WorkingAgreementForDeposit = NEW WorkingAgreement_ForDeposit      
End Function

'-------------------------------------------------------------------------------
'Լրացնել "Աշխատանքային փաստաթղթեր" DepositBoxes_WorkingAgr  Ֆիլտրի արժեքները
'-------------------------------------------------------------------------------
Sub Fill_WorkingAgreement(WorkingAgreement)
    
    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERN",WorkingAgreement.DataPeriod_Start)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERK",WorkingAgreement.DataPeriod_End)
    'Լրացնում է "Արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CUR",WorkingAgreement.Curr)
    'Լրացնում է "Կարատողներ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","USER",WorkingAgreement.Executors)
    'Լրացնում է "Փաստաթղթի տեսակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DOCTYPE",WorkingAgreement.DocumentType)
    'Լրացնում է "Ընդ Վճ.համակարգ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PAYSYSIN",WorkingAgreement.RecPaySystem)
    'Լրացնում է "Ուղ Վճ.համակարգ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PAYSYSOUT",WorkingAgreement.SentPaySystem)
    'Լրացնում է "նշում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PAYNOTES",WorkingAgreement.Note)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",WorkingAgreement.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",WorkingAgreement.Department)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",WorkingAgreement.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",WorkingAgreement.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
'Մուտք է գործում "Պահատեղերի ԱՇՏ/Թղթապանակներ/Հաշվետվություններ/Աշխատանքային փաստաթղթեր" թղթապանակ
'-----------------------------------------------------------------------------------------------
'WorkingAgr_Filter  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_WorkingAgreement(WorkingAgreement) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|ä³Ñ³ï»Õ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ / Ð³ßí»ïíáõÃÛáõÝÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_WorkingAgreement(WorkingAgreement)
        Call WaitForExecutionProgress()
        
        If FilterWin.Exists Then 
            Log.Error "Can Not Close Working Agreement Pttel",,,ErrorColor   
        End If
    Else
        Log.Error "Can Not Open Working Agreement Filter",,,ErrorColor      
    End If 
End Sub 


'------------------------------------------------------------------
'"Նոր պայմանագրի պայմաններ" լրացման կլասս NewAgreementCondition - Class
'-----------------------------------------------------------------
Class DepositCondition
    Public SigningDate
    Public Standard
    Public Duration
    Public EndDate
    Public FillEndDate
    Public DepositBoxType
    Public DepositBoxNumber
    Public Client
    Public PaymentType
    Public ServiceFee
    Public DepositionAmount
    Public Division
    Public Department
    Public AccessType
    
    Private Sub Class_Initialize
       SigningDate = ""
       Standard = ""
       Duration = ""
       EndDate = ""
       FillEndDate = ""
       DepositBoxType = ""
       DepositBoxNumber = ""
       Client = ""
       PaymentType = ""
       ServiceFee = "0.00"
       DepositionAmount = ""
       Division = ""
       Department = ""
       AccessType = ""
    End Sub  
End Class

Function New_DepositCondition()
    Set New_DepositCondition = NEW DepositCondition      
End Function

'-----------------------------------------------------------------------
'Լրացնել "Նոր պայմանագրի պայմաններ" New Agreement condition պատուհանի արժեքները
'-----------------------------------------------------------------------
Sub NewAgreementCondition(Deposit_Agr)

    'Լրացնում է "Կնքման ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","STARTDATE",Deposit_Agr.SigningDate)
    'Լրացնում է "Ստանդարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","STANDARD",Deposit_Agr.Standard)
    'Լրացնում է "Տևողություն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DURATION",Deposit_Agr.Duration)
    'Ստուգում է "Վերջի ամսաթիվ" դաշտը
    Call Compare_Two_Values("Վերջի ամսաթիվ",Get_Rekvizit_Value("Dialog",1,"General","ENDDATE"),Deposit_Agr.EndDate)
    If Deposit_Agr.Duration = "00" Then
        'Լրացնում է "Վերջի ամսաթիվ" դաշտը
        Call Rekvizit_Fill("Dialog",1,"General","ENDDATE",Deposit_Agr.FillEndDate)
    End If
    'Լրացնում է "Պահատեղի տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DBOXTYPE",Deposit_Agr.DepositBoxType)
    'Լրացնում է "Պահատեղի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DBOXNUMBER",Deposit_Agr.DepositBoxNumber)
    'Լրացնում է "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLICODE",Deposit_Agr.Client)
    'Լրացնում է "Վճարման եղանակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PAYTYPE",Deposit_Agr.PaymentType)
    'Ստուգում է "Վարձավճար" դաշտը
    Call Compare_Two_Values("Վարձավճար",Get_Rekvizit_Value("Dialog",1,"General","SUMMA"),Deposit_Agr.ServiceFee)
    'Լրացնում է "Դեպոնացվող գումար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DEPSUMMA",Deposit_Agr.DepositionAmount)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",Deposit_Agr.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",Deposit_Agr.Department)
    'Լրացնում է "Հասան-ն տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSTYPE",Deposit_Agr.AccessType)
    
    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'------------------------------------------------------------------------------------
' Աջ կլիկ(Ստեղծել Պահատեղ վարձ.պայմանագիր) գործողության կատարում
'------------------------------------------------------------------------------------
Sub Create_DepositRental(Action,DepositCondition,DepositRentalAgr_ForCheck,DepositRentalAgr)
    Dim DocForm
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(Action)
    wMDIClient.Refresh
    
    Set DocForm = p1.WaitVBObject("frmAsUstPar",delay_middle)
    
    If DocForm.Exists Then
        Call NewAgreementCondition(DepositCondition)
        BuiltIn.Delay(2000)
        
        Set DocForm = wMDIClient.WaitVBObject("frmASDocForm", 2000)
        
        If DocForm.Exists Then
            Log.Message "--- Check Deposit Rental Window params ---",,,DivideColor2
            Call Check_DepositRentalAgreement(DepositRentalAgr_ForCheck)
            
            Log.Message "--- Fill Deposit Rental Window ---",,,DivideColor2
            
            'ISN-ի վերագրում փոփոխականին
            DepositRentalAgr.Isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
            Call Fill_DepositRentalAgreement(DepositRentalAgr)
        Else
            Log.Error "Can Not Open Deposit Rental Window",,,ErrorColor
        End If
        BuiltIn.Delay(2000)
        If DocForm.Exists Then
            Log.Error "Can Not Close Deposit Rental Window",,,ErrorColor
        End If  
    Else
        Log.Error "Can Not Open Rc(Create Deposit Rental) Window",,,ErrorColor
    End If
End Sub

'------------------------------------------------------------------
'"Նոր պայմանագրի պայմաններ" լրացման կլասս NewAgreementCondition - Class
'-----------------------------------------------------------------
Class DepositRentalAgreement
    Public Isn
    Public Agreement
    Public Client
    Public Name
    Public EnglishName
    Public Account
    Public OtherAccs
    Public UseClientSchema
    Public Standard
    Public Duration
    Public StartDate
    Public EndDate
    Public ServiceFee
    Public VatTaxable
    Public PaymentType
    Public NonperformingDaysAvoiding
    Public AutoProlong
    Public RemindBySMS
    Public EmailAddress
    Public IntBank
    Public DepositionAmount
    Public AllowDelayedPayment
    Public StandardPay
    Public ServContrStandForPenalCalc
    Public DepositBoxType
    Public Number
    Public ClosingDate
    Public Division
    Public Department
    Public AccessType
    Public OnlyJointEntrance
    Public AdditionalaInfo
    Public GridClient
    Public OtherPerson(6)
    
    Private Sub Class_Initialize
        Isn = ""
        Agreement = ""
        Client = ""
        Name = ""
        EnglishName = ""
        Account = ""
        OtherAccs = ""
        UseClientSchema = 0
        Standard = ""
        Duration = ""
        StartDate = ""
        EndDate = ""
        ServiceFee = "0.00"
        VatTaxable = ""
        PaymentType = ""
        NonperformingDaysAvoiding = ""
        AutoProlong = 0
        RemindBySMS = 0
        EmailAddress = 0
        IntBank = 0
        DepositionAmount = "0.00"
        AllowDelayedPayment = 0
        StandardPay = ""
        ServContrStandForPenalCalc = ""
        DepositBoxType = ""
        Number = ""
        ClosingDate = ""
        Division = ""
        Department = ""
        AccessType = ""
        OnlyJointEntrance = 0
        AdditionalaInfo = ""
        GridClient = ""
        OtherPerson(0) = False
    End Sub  
End Class

Function New_DepositRentalAgreement()
    Set New_DepositRentalAgreement = NEW DepositRentalAgreement      
End Function

'--------------------------------------------------------
'Լրացնել "Պահատեղի վարձակալության պայմանագիր" պատուհանի արժեքները
'--------------------------------------------------------
Sub Fill_DepositRentalAgreement(DepositRental)

    Dim i
    'Լրացնում է "Պայմանագրի N" դաշտը
    Call Rekvizit_Fill("Document",1,"General","AGRNUM",DepositRental.Agreement)
    'Լրացնում է "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","CLICODE",DepositRental.Client)
    'Լրացնում է "Անվանում" դաշտը
    Call Rekvizit_Fill("Document",1,"General","NAME",DepositRental.Name)
    'Ստուգում է "Անգլերեն անվանում" դաշտը
    Call Rekvizit_Fill("Document",1,"General","ENAME",DepositRental.EnglishName)
    'Լրացնում է "Հաշիվ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","ACC",DepositRental.Account)
    'Լրացնում է "Այլ հաշիվներ(փոխկապ. սխեմա)" դաշտը
    Call Rekvizit_Fill("Document",1,"General","ACCCONNECT",DepositRental.OtherAccs)
    'Լրացնում է "Օգտագործել հաճախորդի սխեմա" դաշտը   
    Call Rekvizit_Fill("Document",1,"CheckBox","USECLISCH",DepositRental.UseClientSchema)
    'Լրացնում է "Ստանդարտ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","STANDARD",DepositRental.Standard)
    'Լրացնում է "Տևողություն" դաշտը
    Call Rekvizit_Fill("Document",1,"General","DURATION",DepositRental.Duration)
    'Լրացնում է "Սկզբի ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","STARTDATE",DepositRental.StartDate)
    If DepositRental.Duration = "00" Then
        'Լրացնում է "Վարձավճար" դաշտը
        Call Rekvizit_Fill("Document",1,"General","SUMMA",DepositRental.ServiceFee)
    End If
    'Լրացնում է "ԱԱՀ-ում հարկվող" դաշտը
    Call Rekvizit_Fill("Document",1,"General","VATMETH",DepositRental.VatTaxable)
    'Լրացնում է "Վճարման եղանակ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","PAYTYPE",DepositRental.PaymentType)
    'Լրացնում է "Ոչ աշխատանքային օրերի շրջանցում" դաշտը
    Call Rekvizit_Fill("Document",1,"General","NONWD",DepositRental.NonperformingDaysAvoiding)
    'Լրացնում է "Ավտոմատ երկարաձգվող" դաշտը
    Call Rekvizit_Fill("Document",1,"CheckBox","AUTOPROL",DepositRental.AutoProlong)
    'Լրացնում է "Հիշեցում SMS" դաշտը
    Call Rekvizit_Fill("Document",1,"CheckBox","REMSMS",DepositRental.RemindBySMS)
    'Լրացնում է "Email հասցե" դաշտը
    Call Rekvizit_Fill("Document",1,"CheckBox","REMEMAIL",DepositRental.EmailAddress)
    'Լրացնում է "ինտերնետ բանկ" դաշտը
    Call Rekvizit_Fill("Document",1,"CheckBox","REMIB",DepositRental.IntBank)
    'Լրացնում է "Դեպոնացվող գումար" դաշտը
    Call Rekvizit_Fill("Document",1,"General","DEPSUMMA",DepositRental.DepositionAmount)
    'Լրացնում է "Թույլատրել հետաձգված վճարում" դաշտը
    Call Rekvizit_Fill("Document",1,"CheckBox","ALLOWDELAY",DepositRental.AllowDelayedPayment)
    If DepositRental.AllowDelayedPayment = "1" Then
        'Լրացնում է "Ստանդարտ" դաշտը
        Call Rekvizit_Fill("Document",1,"General","DELAYST",DepositRental.StandardPay)
    End If
    'Լրացնում է "Տույժ.հաշվ.սպաս.պայմ.ստանդարտ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","PENALTYST",DepositRental.ServContrStandForPenalCalc)

    'Լրացնում է "Համար" դաշտը
    Call Rekvizit_Fill("Document",1,"General","DBOXNUMBER",DepositRental.Number)
    'Լրացնում է "Փակման ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","CLOSEDATE",DepositRental.ClosingDate)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","ACSBRANCH",DepositRental.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Document",1,"General","ACSDEPART",DepositRental.Department)
    'Լրացնում է "Հասան-ն տիպ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","ACSTYPE",DepositRental.AccessType)
    
    'Tab 2
    'Լրացնում է "Մուրքը միայն համատեղ" դաշտը
    Call Rekvizit_Fill("Document",2,"CheckBox","JOINT",DepositRental.OnlyJointEntrance)
    
    With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("DocGrid")
       'Լրացնում է հաճախորդ դաշտը
      .Row = 0
      .Col = 0
      .Keys(DepositRental.GridClient & "[Enter]")
    End With 
    
    If DepositRental.OtherPerson(0) Then
        For i = 1 To 6
            With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("DocGrid")
              .Row = 1
              .Col = i
              .Keys(DepositRental.OtherPerson(i) & "[Enter]")
            End With 
        Next
        With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("DocGrid")
        .Row = 1
        .Col = 1
        .Keys("[Enter]")
        End With 
    End If
    
    'Լրացնում է "Լրացուցիչ ինֆորմացիա" դաշտը
    Call Rekvizit_Fill("Document",2,"General","ADDINFO",DepositRental.AdditionalaInfo)
    
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'------------------------------------------------------------------
'Ստուգում է "Պահատեղի վարձակալության պայմանագիր" բացված պատուհանի արժեքները
'------------------------------------------------------------------
Sub Check_DepositRentalAgreement(DepositRental)

    'Ստուգում է "Հաճախորդ" դաշտի արժեքը
    Call Compare_Two_Values("Հաճախորդ",Get_Rekvizit_Value("Document",1,"Mask","CLICODE"),DepositRental.Client)
    'Ստուգում է "Անվանում" դաշտի արժեքը
    Call Compare_Two_Values("Անվանում",Get_Rekvizit_Value("Document",1,"General","NAME"),DepositRental.Name)
    'Ստուգում է "Անգլերեն Անվանում" դաշտի արժեքը
    Call Compare_Two_Values("Անգլերեն Անվանում",Get_Rekvizit_Value("Document",1,"General","ENAME"),DepositRental.EnglishName)
    'Ստուգում է "Հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Հաշիվ",Get_Rekvizit_Value("Document",1,"Mask","ACC"),DepositRental.Account)
    'Ստուգում է "Այլ հաշիվներ(փոխկապ. սխեմա)" դաշտի արժեքը
    Call Compare_Two_Values("Այլ հաշիվներ(փոխկապ. սխեմա)",Get_Rekvizit_Value("Document",1,"Mask","ACCCONNECT"),DepositRental.OtherAccs)
    'Ստուգում է "Օգտագործել հաճախորդի սխեմա" դաշտի արժեքը
    Call Compare_Two_Values("Օգտագործել հաճախորդի սխեմա",Get_Rekvizit_Value("Document",1,"CheckBox","USECLISCH"),DepositRental.UseClientSchema)
    'Ստուգում է "Ստանդարտ" դաշտի արժեքը
    Call Compare_Two_Values("Ստանդարտ",Get_Rekvizit_Value("Document",1,"Mask","STANDARD"),DepositRental.Standard)
    'Ստուգում է "Տևողություն" դաշտի արժեքը
    Call Compare_Two_Values("Տևողություն",Get_Rekvizit_Value("Document",1,"Mask","DURATION"),DepositRental.Duration)
    'Ստուգում է "Սկզբի ամսաթիվ" դաշտի արժեքը
    Call Compare_Two_Values("Սկզբի ամսաթիվ",Get_Rekvizit_Value("Document",1,"General","STARTDATE"),DepositRental.StartDate)
    'Ստուգում է "Վերջի ամսաթիվ" դաշտի արժեքը
    Call Compare_Two_Values("Վերջի ամսաթիվ",Get_Rekvizit_Value("Document",1,"General","ENDDATE"),DepositRental.EndDate)
    'Ստուգում է "Վարձավճար" դաշտի արժեքը
    Call Compare_Two_Values("Վարձավճար",Get_Rekvizit_Value("Document",1,"General","SUMMA"),DepositRental.ServiceFee)
    'Ստուգում է "ԱԱՀ-ում հարկվող" դաշտի արժեքը
    Call Compare_Two_Values("ԱԱՀ-ում հարկվող",Get_Rekvizit_Value("Document",1,"Mask","VATMETH"),DepositRental.VatTaxable)
    'Ստուգում է "Վճարման եղանակ" դաշտի արժեքը
    Call Compare_Two_Values("Վճարման եղանակ",Get_Rekvizit_Value("Document",1,"Mask","PAYTYPE"),DepositRental.PaymentType)
    'Ստուգում է "Ոչ աշխատանքային օրերի շրջանցում" դաշտի արժեքը
    Call Compare_Two_Values("Ոչ աշխատանքային օրերի շրջանցում",Get_Rekvizit_Value("Document",1,"Mask","NONWD"),DepositRental.NonperformingDaysAvoiding)    
    'Ստուգում է "Ավտոմատ երկարաձգվող" դաշտի արժեքը
    Call Compare_Two_Values("Ավտոմատ երկարաձգվող",Get_Rekvizit_Value("Document",1,"CheckBox","AUTOPROL"),DepositRental.AutoProlong)   
    'Ստուգում է "Հիշեցում SMS" դաշտի արժեքը
    Call Compare_Two_Values("Հիշեցում SMS",Get_Rekvizit_Value("Document",1,"CheckBox","REMSMS"),DepositRental.RemindBySMS)  
    'Ստուգում է "Էլ. հասցե" դաշտի արժեքը
    Call Compare_Two_Values("Էլ. հասցե",Get_Rekvizit_Value("Document",1,"CheckBox","REMEMAIL"),DepositRental.EmailAddress)      
    'Ստուգում է "ինտերնետ բանկ" դաշտի արժեքը
    Call Compare_Two_Values("ինտերնետ բանկ",Get_Rekvizit_Value("Document",1,"CheckBox","REMIB"),DepositRental.IntBank) 
    'Ստուգում է "Դեպոնացվող գումար" դաշտի արժեքը
    Call Compare_Two_Values("Դեպոնացվող գումար",Get_Rekvizit_Value("Document",1,"General","DEPSUMMA"),DepositRental.DepositionAmount) 
    'Ստուգում է "Թույլատրել հետաձգված վճարում" դաշտի արժեքը
    Call Compare_Two_Values("Թույլատրել հետաձգված վճարում",Get_Rekvizit_Value("Document",1,"CheckBox","ALLOWDELAY"),DepositRental.AllowDelayedPayment)     
    'Ստուգում է "Ստանդարտ" դաշտի արժեքը
    Call Compare_Two_Values("Ստանդարտ",Get_Rekvizit_Value("Document",1,"Mask","DELAYST"),DepositRental.StandardPay)   
    'Ստուգում է "Տույժ.հաշվ.սպաս.պայմ.ստանդարտ" դաշտի արժեքը
    Call Compare_Two_Values("Տույժ.հաշվ.սպաս.պայմ.ստանդարտ",Get_Rekvizit_Value("Document",1,"Mask","PENALTYST"),DepositRental.ServContrStandForPenalCalc)  
    'Ստուգում է "Պահատեղի տիպ" դաշտի արժեքը
    Call Compare_Two_Values("Պահատեղի տիպ",Get_Rekvizit_Value("Document",1,"Mask","DBOXTYPE"),DepositRental.DepositBoxType)  
    'Ստուգում է "Համար" դաշտի արժեքը
    Call Compare_Two_Values("Համար",Get_Rekvizit_Value("Document",1,"Comment","DBOXNUMBER"),DepositRental.Number)  
    'Ստուգում է "Փակման ամսաթիվ" դաշտի արժեքը
    Call Compare_Two_Values("Փակման ամսաթիվ",Get_Rekvizit_Value("Document",1,"General","CLOSEDATE"),DepositRental.ClosingDate) 
    'Ստուգում է "Գրասենյակ" դաշտի արժեքը
    Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",1,"Mask","ACSBRANCH"),DepositRental.Division) 
    'Ստուգում է "Բաժին" դաշտի արժեքը
    Call Compare_Two_Values("Բաժին",Get_Rekvizit_Value("Document",1,"Mask","ACSDEPART"),DepositRental.Department) 
    'Ստուգում է "Հասան-ն տիպ" դաշտի արժեքը
    Call Compare_Two_Values("Հասան-ն տիպ",Get_Rekvizit_Value("Document",1,"Mask","ACSTYPE"),DepositRental.AccessType) 
    
End Sub

'------------------------------------------------------------------
'Պահատեղի աշխատանքային փաստաթղթեր-ից կատարել Գանձում/տրամադրում գործողություն
'------------------------------------------------------------------
Function RC_ChargeAndProvideAction(SearchDocNum,DocNum)
    Dim DocForm

    If WaitForPttel("frmPttel") Then
      If SearchInPttel("frmPttel",3, SearchDocNum) Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_ChargeAndProvide)
          BuiltIn.Delay(2000)
          
          Set DocForm = wMDIClient.WaitVBObject("frmASDocForm", 2000)
          If DocForm.Exists Then
              'ISN-ի վերագրում փոփոխականին
              RC_ChargeAndProvideAction = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
              'Լրացնում է "Փաստաթղթի N" դաշտը
              Call Rekvizit_Fill("Document",1,"General","DOCNUM",DocNum)
              
              Call ClickCmdButton(1, "Î³ï³ñ»É")
              BuiltIn.Delay(2000)
          Else
              Log.Error "Can Not Open Group Memoral Order Window",,,ErrorColor        
          End If
      End If
      
    Else
        Log.Error "Can Not Open Deposit Working Agreement pttel",,,ErrorColor      
    End If
End Function  

'-----------------------------------------------------------------------------------
'"Պահատեղի վարձակալության պայմանագրեր ֆիլտրի լրացման կլասս" Deposit_Boxes_WorkingAgr - Class
'-----------------------------------------------------------------------------------
Class DepositBoxRental
    Public Data
    Public Client
    Public AgreementName
    Public DepositBoxNumber
    Public AgreementN
    Public Standard
    Public DepositBoxType
    Public ShowDebt
    Public ShowClosed
    Public Division
    Public Department
    Public AccessType
    Public View
    Public FillInto 
    
    Private Sub Class_Initialize
        Data = ""
        Client = ""
        AgreementName = ""
        DepositBoxNumber = ""
        AgreementN = ""
        Standard = ""
        DepositBoxType = ""
        ShowDebt = 0
        ShowClosed = 1
        Division = ""
        Department = ""
        AccessType = ""
        View = "DBAgrs"
        FillInto = "0"
    End Sub  
End Class

Function New_DepositBoxRental()
    Set New_DepositBoxRental = NEW DepositBoxRental      
End Function

'------------------------------------------------------------------------
'Լրացնել "Պահատեղի վարձակալության պայմանագրեր" DepositBoxRental  Ֆիլտրի արժեքները
'------------------------------------------------------------------------
Sub Fill_DepositBoxRental(DepositBoxRental)
    
    'Լրացնում է "Ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DATE",DepositBoxRental.Data)
    'Լրացնում է "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLICODE",DepositBoxRental.Client)
    'Լրացնում է "Պայմանագրի անվանում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NAME",DepositBoxRental.AgreementName)
    'Լրացնում է "Պահատեղի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DBOXNUMBER",DepositBoxRental.DepositBoxNumber)
    'Լրացնում է "Պայմանագրի N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","AGRNUM",DepositBoxRental.AgreementN)
    'Լրացնում է "Ստանդարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","STANDARD",DepositBoxRental.Standard)
    'Լրացնում է "Պահատեղի տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DBOXTYPE",DepositBoxRental.DepositBoxType)
    'Լրացնում է "Ցույց տալ պարտքը" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWDEBT",DepositBoxRental.ShowDebt)
    'Ստուգում է "Ցույց տալ փակվածները" դաշտի արժեքը և խմբագրելիությունը
    Call Compare_Two_Values("Ցույց տալ փակվածները",Get_Rekvizit_Value("Dialog",1,"CheckBox","SHOWCLOSED"),DepositBoxRental.ShowClosed)  
    Call Check_ReadOnly("Dialog",1,"CheckBox","SHOWCLOSED",True)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",DepositBoxRental.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",DepositBoxRental.Department)
    'Լրացնում է "Հասան-ն տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSTYPE",DepositBoxRental.AccessType)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",DepositBoxRental.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",DepositBoxRental.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'---------------------------------------------------------------------
'Մուտք է գործում "Պահատեղերի ԱՇՏ/Պահատեղի վարձակալության պայմանագրեր" թղթապանակ
'---------------------------------------------------------------------
'DepositBoxRental  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_DepositBoxRental(DepositBoxRental) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|ä³Ñ³ï»Õ»ñÇ ²Þî|ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_DepositBoxRental(DepositBoxRental)
        Call WaitForExecutionProgress()
        
        If FilterWin.Exists Then 
            Log.Error "Can Not Close Deposit Box Rental Pttel",,,ErrorColor   
        End If
    Else
        Log.Error "Can Not Open Deposit Box Rental Filter",,,ErrorColor      
    End If 
End Sub 

'-----------------------------------------------------------------------------------
'"Այցելությունների թղթապանակ ֆիլտրի լրացման կլասս" VisitAgreement_ForDeposit - Class
'-----------------------------------------------------------------------------------
Class VisitAgreement_ForDeposit
    Public DataPeriod_Start
    Public DataPeriod_End
    Public NumberOfDoc
    Public AgreementN
    Public Client
    Public DepositBoxNumber
    Public Division
    Public ShowAlsoNotFinished
    Public View
    Public FillInto 
    
    Private Sub Class_Initialize
       DataPeriod_Start = ""
       DataPeriod_End = ""
       NumberOfDoc = ""
       AgreementN = ""
       Client = ""
       DepositBoxNumber = ""
       Division = ""
       ShowAlsoNotFinished = 0
       View = "DBVisits"
       FillInto = "0"
    End Sub  
End Class

Function New_VisitAgreement_ForDeposit()
    Set New_VisitAgreement_ForDeposit = NEW VisitAgreement_ForDeposit      
End Function

'------------------------------------------------------------
'Լրացնել "Այցելությունների թղթապանակ" VisitAgreement  Ֆիլտրի արժեքները
'------------------------------------------------------------
Sub Fill_VisitAgreement(VisitAgreement)
    
    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","STARTDATE",VisitAgreement.DataPeriod_Start)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ENDDATE",VisitAgreement.DataPeriod_End)
    'Լրացնում է "Փաստաթղթի N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DOCNUM",VisitAgreement.NumberOfDoc)
    'Լրացնում է "Պայմանագրի N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","AGRNUM",VisitAgreement.AgreementN)
    'Լրացնում է "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLICODE",VisitAgreement.Client)
    'Լրացնում է "Պահատեղի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DBOXNUMBER",VisitAgreement.DepositBoxNumber)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DBOXBRANCH",VisitAgreement.Division)
    'Լրացնում է "Ցույց տալ նաև անավարտներտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWNOTFINISHED",VisitAgreement.ShowAlsoNotFinished)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",VisitAgreement.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",VisitAgreement.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
'Մուտք է գործում "Պահատեղերի ԱՇՏ/Թղթապանակներ/Հաշվետվություններ/Այցելությունների թղթապանակ" թղթապանակ
'--------------------------------------------------------------------------------------
'VisitAgreement  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_VisitAgreement(VisitAgreement) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|ä³Ñ³ï»Õ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ / Ð³ßí»ïíáõÃÛáõÝÝ»ñ|²Ûó»ÉáõÃÛáõÝÝ»ñÇ ÃÕÃ³å³Ý³Ï")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_VisitAgreement(VisitAgreement)
        Call WaitForExecutionProgress()
        
        If FilterWin.Exists Then 
            Log.Error "Can Not Close Visit Agreement Filter!",,,ErrorColor   
        End If
    Else
        Log.Error "Can Not Open Visit Agreement Filter!",,,ErrorColor      
    End If 
End Sub

'-------------------
'"Բացում" Գործողություն
'-------------------
Sub OpenDepositContract(DocNum)
    Dim DocForm
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Open)
    wMDIClient.Refresh
    
    Set DocForm = AsBank.WaitVBObject("frmAsMsgBox", delay_middle)
    If DocForm.Exists Then
        Call MessageExists(2,"´³ó»±É å³ÛÙ. N "&DocNum&":")
        Call ClickCmdButton(5, "²Ûá")
    Else
        Log.Error "Can Not Open Rc(OpenContract) Window",,,ErrorColor         
    End If    
    BuiltIn.Delay(1500)
    If DocForm.Exists Then
        Log.Error "Can Not Close Rc(OpenContract) Window",,,ErrorColor
    End If

End Sub

'-------------------
'"Փակել" Գործողություն
'-------------------
Sub CloseDepositContract(Date)
    Dim DocForm
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Close)
    wMDIClient.Refresh
    
    Set DocForm = AsBank.WaitVBObject("frmAsUstPar", delay_middle)
    
    If DocForm.Exists Then
        'Լրացնել "Ամսաթիվ" դաշտը
        Call Rekvizit_Fill("Dialog", 1, "General", "CLOSEDATE", Date)
        Call ClickCmdButton(2, "Î³ï³ñ»É")
    Else
        Log.Error "Can Not Open Rc(CloseContract) Window",,,ErrorColor         
    End If    
    BuiltIn.Delay(1500)
    If DocForm.Exists Then
        Log.Error "Can Not Close Rc(CloseContract) Window",,,ErrorColor
    End If
End Sub


Function RC_VisitAction(SearchDocNum,DocNum,Date,Inn,Out,AgrNum,AddInfo,Visitor,Name,Passport) 
    If SearchInPttel("frmPttel",0, SearchDocNum) Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_Visit)
          BuiltIn.Delay(2000)
          
          'Լրացնում է "Փաստաթղթի N" դաշտը
          Call Rekvizit_Fill("Document",1,"General","DOCNUM",DocNum)
          'Լրացնում է "Պայմանագրի N" դաշտը
          Call Rekvizit_Fill("Document",1,"General","AGRNUM",AgrNum)
          'Լրացնում է "Ամսաթիվ" դաշտը
          Call Rekvizit_Fill("Document",1,"General","DATE",Date)
          'Լրացնում է "Մուտք" դաշտը
          Call Rekvizit_Fill("Document",1,"General","IN",Inn)
          'Լրացնում է "Ելք" դաշտը
          Call Rekvizit_Fill("Document",1,"General","OUT",Out)
          'Լրացնում է "Լրացուցիչ ինֆորմացիա" դաշտը
          Call Rekvizit_Fill("Document",1,"General","ADDINFO",AddInfo)
          
          If Visitor Then
            'Լրացնում է գրիդի "Անվանում" դաշտը
            With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
              .Row = 0
              .Col = 0
              .Keys(Name & "[Enter]")
            End With 
            'Լրացնում է գրիդի "Անձը հաստատող փաստաթուղթ" դաշտը
            With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
              .Row = 0
              .Col = 1
              .Keys(Passport)
            End With 
          End If   
          RC_VisitAction = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
   
          Call ClickCmdButton(1, "Î³ï³ñ»É")
          BuiltIn.Delay(2000)
    Else
         Log.Error "Can Not Find Deposit Agreement Line",,,ErrorColor      
    End If
End Function   

Sub StartOfVisit(Hour) 

    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_VisitStart)
    BuiltIn.Delay(2000)

    'Լրացնում է "Մուտք" դաշտը
    Call Rekvizit_Fill("Document",1,"General","IN","^A[Del]" & Hour)

    Call ClickCmdButton(1, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
End Sub  

Sub EndOfVisit(Hour) 

    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_VisitEnd)
    BuiltIn.Delay(2000)

    'Լրացնում է "Ելք" դաշտը
    Call Rekvizit_Fill("Document",1,"General","OUT","^A[Del]" & Hour)

    Call ClickCmdButton(1, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
End Sub  

Sub RC_ProlongAction(DocNum,Standard,Duration,StartDate,Date) 
    If SearchInPttel("frmPttel",0, DocNum) Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_Prolong2)
          BuiltIn.Delay(2000)
          
          'Լրացնում է "Ստանդարտ" դաշտը
          Call Rekvizit_Fill("Dialog",1,"General","STANDARD",Standard)
          'Լրացնում է "Տևողություն" դաշտը
          Call Rekvizit_Fill("Dialog",1,"General","DURATION",Duration)
          'Լրացնում է "Սկզբի ամսաթիվ" դաշտը
          Call Rekvizit_Fill("Dialog",1,"General","STARTDATE",StartDate)
          'Լրացնում է "Ամսաթիվ" դաշտը
          Call Rekvizit_Fill("Dialog",1,"General","DATE",Date)
          
          Call ClickCmdButton(2, "Î³ï³ñ»É")
          BuiltIn.Delay(2000)
          Call MessageExists(2,"êï»ÕÍí»É ¿ "&DocNum&" å³ÛÙ³Ý³·ñÇ N 1 »ñÏ³ñ³Ó·áõÙÁ:")
          Call ClickCmdButton(5, "OK")   
    Else
         Log.Error "Can Not Find Deposit Agreement Line",,,ErrorColor      
    End If
End Sub

Sub Delete_DepositBoxAgr(DocNum)
    If WaitForPttel("frmPttel") Then
        Call SearchInPttel("frmPttel",0, DocNum)
        Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
        BuiltIn.Delay(delay_small) 
        Call MessageExists(3,"¶áñÍáÕáõÃÛ³Ý ³ñ¹ÛáõÝùáõÙ Ïëï»ÕÍíÇ çÝçÙ³Ý Ñ³Ûï: Þ³ñáõÝ³Ï»±É:")
        Call ClickCmdButton(2, "Î³ï³ñ»É") 
        BuiltIn.Delay(2000)
        Call MessageExists(2,"æÝçÙ³Ý Ñ³ÛïÝ áõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý:")
        Call ClickCmdButton(5, "OK") 
        BuiltIn.Delay(2000)
    Else
        Log.Error "Can Not Open Deposit Box Agreement",,,ErrorColor      
    End If  
End Sub

'--------------------------------------------------------------------
'"Պահատեղերի խմբային ստեղծում դիալոգի լրացման կլասս" GroupCreation - Class
'--------------------------------------------------------------------
Class GroupCreationOfDepositBoxes
    Public OpeningDate
    Public Type1
    Public Prefix
    Public Begin
    Public Endd
    Public FillWithZeros
    Public UptoDigits
    Public Division
    Public AdditionalInformation
    
    Private Sub Class_Initialize
       OpeningDate = ""
       Type1 = ""
       Prefix = ""
       Begin = ""
       Endd = ""
       FillWithZeros = 0
       UptoDigits = ""
       Division = ""
       AdditionalInformation = ""
    End Sub  
End Class

Function New_GroupCreationOfDepositBoxes()
    Set New_GroupCreationOfDepositBoxes = NEW GroupCreationOfDepositBoxes      
End Function

'-----------------------------------------------------------------
'Լրացնել "Պահատեղերի խմբային ստեղծում" GroupCreation  դիալոգի արժեքները
'-----------------------------------------------------------------
Sub Fill_GroupCreationDialog(GroupCreation)

    'Լրացնում է "Բացման ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","OPENDATE","^A[Del]" & GroupCreation.OpeningDate)
    'Լրացնում է "Տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","TYPE","^A[Del]" & GroupCreation.Type1)
    'Լրացնում է "Նախդիր" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PREFIX","^A[Del]" & GroupCreation.Prefix)
    'Լրացնում է "Սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","BEGIN","^A[Del]" & GroupCreation.Begin)
    'Լրացնում է "Վերջ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","END","^A[Del]" & GroupCreation.Endd)
    'Լրացնում է "Լրացնել 0-ներով" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","FILL", GroupCreation.FillWithZeros)
    
    If GroupCreation.FillWithZeros = 1 Then
        'Լրացնում է "Մինչև քանի նիշ(առանց նախդիր)" դաշտը
        Call Rekvizit_Fill("Dialog",1,"General","DIGCOUNT","^A[Del]" & GroupCreation.UptoDigits)
    Else
        'Ստուգում է "Մինչև քանի նիշ(առանց նախդիր)" դաշտի խմբագրելիությունը
        Call Check_ReadOnly("Dialog",1,"General","DIGCOUNT",True)
    End If
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH", "^A[Del]" & GroupCreation.Division)
    'Լրացնում է "Լրացուցիչ ինֆորմացիա" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ADDINFO","^A[Del]" & GroupCreation.AdditionalInformation)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
'Մուտք է գործում "Պահատեղերի ԱՇՏ/Կարգավորումներ/Պահատեղերի խմբային ստեղծում" թղթապանակ
'--------------------------------------------------------------------------------------
'GroupCreation  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GroupCreationDialog(GroupCreation,Count) 
    
    Dim DialogWin
    Call wTreeView.DblClickItem("|ä³Ñ³ï»Õ»ñÇ ²Þî|Î³ñ·³íáñáõÙÝ»ñ|ä³Ñ³ï»Õ»ñÇ ËÙµ³ÛÇÝ ëï»ÕÍáõÙ")
    Set DialogWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If DialogWin.Exists Then
        Call Fill_GroupCreationDialog(GroupCreation)
        BuiltIn.Delay(2000) 
        Call MessageExists(2,"¶áñÍáÕáõÃÛ³Ý µ³ñ»Ñ³çáÕ ³í³ñï"&vbCRLF&"êï»ÕÍí»É »Ý "&Count&" å³Ñ³ï»Õ»ñ:")
        Call ClickCmdButton(5, "OK") 

    Else
        Log.Error "Can Not Open Visit Agreement Filter!",,,ErrorColor      
    End If 
End Sub


'-----------------------------------------------------------------------------------
'"Պահատեղի պայմանագրի ստանդարտներ ֆիլտրի լրացման կլասս" DepositContractsStandards - Class
'-----------------------------------------------------------------------------------
Class DepositContractsStandards
    Public Code
    Public DepositBoxType
    Public ShowClosed
    Public View
    Public FillInto 
    
    Private Sub Class_Initialize
        Code = ""
        DepositBoxType = ""
        ShowClosed = 0
        View = "DBAgrSts"
        FillInto = "0"
    End Sub  
End Class

Function New_DepositContractsStandards()
    Set New_DepositContractsStandards = NEW DepositContractsStandards      
End Function

'-------------------------------------------------------------------------------
'Լրացնել "Պահատեղի պայմանագրի ստանդարտներ" DepositContractsStandards  Ֆիլտրի արժեքները
'-------------------------------------------------------------------------------
Sub Fill_DepositContractsStandards(DepositContractsStandard)
    
    'Լրացնում է "Կոդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CODE",DepositContractsStandard.Code)
    'Լրացնում է "Պահատեղի տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DBOXTYPE",DepositContractsStandard.DepositBoxType)
    'Լրացնում է "Ցույց տալ փակվածները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCLOSED",DepositContractsStandard.ShowClosed)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",DepositContractsStandard.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",DepositContractsStandard.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'---------------------------------------------------------------------------------------------------
'Մուտք է գործում "Պահատեղերի ԱՇՏ/Տեղեկատուներ/Պահատեղերի տեղեկատուներ/Պահատեղի պայմանագրի ստանդարտներ" թղթապանակ
'---------------------------------------------------------------------------------------------------
'DepositContractsStandards  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_DepositContractsStandards(DepositContractsStandard) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|ä³Ñ³ï»Õ»ñÇ ²Þî|î»Õ»Ï³ïáõÝ»ñ|ä³Ñ³ï»Õ»ñÇ ï»Õ»Ï³ïáõÝ»ñ|ä³Ñ³ï»ÕÇ å³ÛÙ³Ý³·ñÇ ëï³Ý¹³ñïÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_DepositContractsStandards(DepositContractsStandard)
        Call WaitForExecutionProgress()
        
        If FilterWin.Exists Then 
            Log.Error "Can Not Close Deposit Contracts Standards Filter!",,,ErrorColor   
        End If
    Else
        Log.Error "Can Not Open Deposit Contracts Standards Filter!",,,ErrorColor      
    End If 
End Sub 

'----------------------------------
'"Փոխել պահատեղը" գործողության կատարում
'----------------------------------
Sub RC_ChangeDepositBox(DocNum,Date,NewDepositBox) 
    If SearchInPttel("frmPttel",0, DocNum) Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_ChangeDepositBox)
          BuiltIn.Delay(2000)
          
          'Լրացնում է "Ամսաթիվ" դաշտը
          Call Rekvizit_Fill("Document",1,"General","DATE",Date)
          'Լրացնում է "Նոր պահատեղի N" դաշտը
          Call Rekvizit_Fill("Document",1,"General","NEWDBNUM",NewDepositBox)
          
          Call ClickCmdButton(1, "Î³ï³ñ»É")
          BuiltIn.Delay(2000)
    Else
         Log.Error "Can Not Find Deposit Agreement Line",,,ErrorColor      
    End If
End Sub

'-------------------------------------------
'"Փոխկապ. սխեմայի խմբագրում" գործողության կատարում
'-------------------------------------------
Sub RC_EditConnSchema(DocNum,NewSchemCode,wEmpty) 
    If SearchInPttel("frmPttel",0, DocNum) Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_EditConnSchema)
          BuiltIn.Delay(2000)
          
          'Լրացնում է "Այլ հաշիվներ(Փոխկապ.սխեմա)" դաշտը
          Call Rekvizit_Fill("Dialog",1,"General","ACCCONNECT",NewSchemCode)
          'Լրացնում է "Դատարկել" դաշտը
          Call Rekvizit_Fill("Dialog",1,"CheckBox","TOEMPTY",wEmpty)
          
          Call ClickCmdButton(2, "Î³ï³ñ»É")
          BuiltIn.Delay(2000)
          Call MessageExists(2,"¶áñÍáÕáõÃÛ³Ý µ³ñ»Ñ³çáÕ ³í³ñï")
          Call ClickCmdButton(5, "OK") 
    Else
         Log.Error "Can Not Find Deposit Agreement Line",,,ErrorColor      
    End If
End Sub

'-----------------------------------
'"Տույժի հաշվարկում" գործողության կատարում
'-----------------------------------
Sub RC_PenaltyCount(DocNum,Date) 
    If SearchInPttel("frmPttel",0, DocNum) Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_PenaltyCount)
          BuiltIn.Delay(2000)

          'Լրացնում է "Տույժի սպաս. պայմ. բացման ամսաթիվ" դաշտը
          Call Rekvizit_Fill("Dialog",1,"General","OPENDATE",Date)
          
          Call ClickCmdButton(2, "Î³ï³ñ»É")
          BuiltIn.Delay(2000)
          Call ClickCmdButton(5, "OK")
    Else
         Log.Error "Can Not Find Deposit Agreement Line",,,ErrorColor      
    End If
End Sub

'------------------------------------------------------------------------------
'"Պահատեղի փոփոխություններ" թղթապանակ ֆիլտրի լրացման կլասս" DepositBoxChanges - Class
'------------------------------------------------------------------------------
Class DepositBoxChanges
    Public DataPeriod_Start
    Public DataPeriod_End
    Public AgreementN
    Public OldDepositBoxN
    Public NewDepositBoxN
    Public Division
    Public View
    Public FillInto 
    
    Private Sub Class_Initialize
       DataPeriod_Start = ""
       DataPeriod_End = ""
       AgreementN = ""
       OldDepositBoxN = ""
       NewDepositBoxN = ""
       Division= ""
       View = "DBChngs"
       FillInto = "0"
    End Sub  
End Class

Function New_DepositBoxChanges()
    Set New_DepositBoxChanges = NEW DepositBoxChanges      
End Function

'--------------------------------------------------------------
'Լրացնել "Պահատեղի փոփոխություններ" DepositBoxChange  Ֆիլտրի արժեքները
'--------------------------------------------------------------
Sub Fill_DepositBoxChanges(DepositBoxChange)
    
    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","STARTDATE",DepositBoxChange.DataPeriod_Start)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ENDDATE",DepositBoxChange.DataPeriod_End)
    'Լրացնում է "Պայմանագրի N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","AGRNUM",DepositBoxChange.AgreementN)
    'Լրացնում է "Հին պահատեղի N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","OLDDBNUM",DepositBoxChange.OldDepositBoxN)
    'Լրացնում է "Նոր պահատեղի N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NEWDBNUM",DepositBoxChange.NewDepositBoxN)
    'Լրացնում է "Պահատեղի գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DBOXBRANCH",DepositBoxChange.Division)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",DepositBoxChange.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",DepositBoxChange.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
'Մուտք է գործում "Պահատեղերի ԱՇՏ/Թղթապանակներ, Հաշվետվություններ/Պահատեղի փոփոխություններ" թղթապանակ
'--------------------------------------------------------------------------------------
'DepositBoxChange  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_DepositBoxChanges(DepositBoxChange)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|ä³Ñ³ï»Õ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ / Ð³ßí»ïíáõÃÛáõÝÝ»ñ|ä³Ñ³ï»ÕÇ ÷á÷áËáõÃÛáõÝÝ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle)
    
    If FilterWin.Exists Then
        Call Fill_DepositBoxChanges(DepositBoxChange)
        Call WaitForExecutionProgress()
        
        If FilterWin.Exists Then 
            Log.Error "Can Not Close Deposit Box Changes Filter!",,,ErrorColor   
        End If
    Else
        Log.Error "Can Not Open Deposit Box Changes Filter!",,,ErrorColor      
    End If 
End Sub

'-----------------------------------------------------------------------------------------
'"Հաշիների ռեեստր ուղարկվող պահատեղեր ֆիլտրի լրացման կլասս" AccountsRegisterForDepositBox - Class
'-----------------------------------------------------------------------------------------
Class AccountsRegisterForDepositBox

    Public RegisterState
    Public DepositBoxNumber
    Public DepositBoxDivision
    Public ClientCode
    Public Division
    Public Department
    Public AccessType
    Public LegPos
    Public TaxID
    Public Note1
    Public Note2
    Public Note3
    Public ShowClientsData
    Public ShowChanges
    Public ShowReadyToSends
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        RegisterState = ""
        DepositBoxNumber = ""
        DepositBoxDivision = ""
        ClientCode = ""
        Division = ""
        Department = ""
        AccessType = ""
        LegPos = ""
        TaxID = ""
        Note1 = ""
        Note2 = ""
        Note3 = ""
        ShowClientsData = 0
        ShowChanges = 0
        ShowReadyToSends = 0
        View = "RegBoxes"
        FillInto = "0"
    End Sub  
End Class

Function New_AccountsRegisterForDepositBox()
    Set New_AccountsRegisterForDepositBox = NEW AccountsRegisterForDepositBox      
End Function

'-------------------------------------------------------------------------------
'Լրացնել "Հաշիների ռեեստր ուղարկվող պահատեղեր" DepositBoxes_WorkingAgr  Ֆիլտրի արժեքները
'-------------------------------------------------------------------------------
Sub Fill_AccountsRegisterForDepositBox(AccRegisterForDepositBox)
    
    'Լրացնում է "Ռեեստրի կարգավիճակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","REPSTATUS",AccRegisterForDepositBox.RegisterState)
    'Լրացնում է "Պահատեղի համար" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DBOXNUMBER",AccRegisterForDepositBox.DepositBoxNumber)
    'Լրացնում է "Պահատեղի գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DBOXBRANCH",AccRegisterForDepositBox.DepositBoxDivision)
    'Լրացնում է "Հաճախորդի կոդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLICODE",AccRegisterForDepositBox.ClientCode)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLIACSDIVISION",AccRegisterForDepositBox.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLIACSDEPARTMENT",AccRegisterForDepositBox.Department)
    'Լրացնում է "Հասան Ն-տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLIACSTYPE",AccRegisterForDepositBox.AccessType)
    'Լրացնում է "Իրավ.կ." դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","JURSTAT",AccRegisterForDepositBox.LegPos)
    'Լրացնում է "ՀՎՀՀ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","TAXCOD",AccRegisterForDepositBox.TaxID)
    'Լրացնում է "Նմուշ(հաճ)" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLINOTE",AccRegisterForDepositBox.Note1)
    'Լրացնում է "Նմուշ 2(հաճ)" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLINOTE2",AccRegisterForDepositBox.Note2)
    'Լրացնում է "Նմուշ 3(հաճ)" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLINOTE3",AccRegisterForDepositBox.Note3)
    'Լրացնում է "Ցույց տալ հաճախորդի տվյալները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCLIINFO",AccRegisterForDepositBox.ShowClientsData)
    'Լրացնում է "Ցույց տալ փոփոխությունները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCHANGES",AccRegisterForDepositBox.ShowChanges)
    'Լրացնում է "Ցույց տալ միայն ուղարկման ենթակաները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWREADYTOSEND",AccRegisterForDepositBox.ShowReadyToSends)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",AccRegisterForDepositBox.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",AccRegisterForDepositBox.FillInto)
    
    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'-----------------------------------------------------------------------------------------------
'Մուտք է գործում "Պահատեղերի ԱՇՏ/Թղթապանակներ/Հաշվետվություններ/Հաշիների ռեեստր ուղարկվող պահատեղեր" թղթապանակ
'-----------------------------------------------------------------------------------------------
'AccRegister_ForDepositBox  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_AccRegisterForDepositBox(AccRegister_ForDepositBox) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|ä³Ñ³ï»Õ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ / Ð³ßí»ïíáõÃÛáõÝÝ»ñ|Ð³ßÇíÝ»ñÇ é»»ëïñ áõÕ³ñÏíáÕ å³Ñ³ï»Õ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_AccountsRegisterForDepositBox(AccRegister_ForDepositBox)
        Call WaitForExecutionProgress()
        
        If FilterWin.Exists Then 
            Log.Error "Can Not Open Account Register For Deposit Box Pttel",,,ErrorColor   
        End If
    Else
        Log.Error "Can Not Open Account Register For Deposit Box Filter",,,ErrorColor      
    End If 
End Sub