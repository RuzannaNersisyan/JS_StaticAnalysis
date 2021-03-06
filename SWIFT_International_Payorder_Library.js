'USEUNIT International_PayOrder_Receive_Confirmphases_Library
'USEUNIT International_PayOrder_ConfirmPhases_Library
'USEUNIT PayOrder_Receive_ConfirmPhases_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Online_PaySys_Library
'USEUNIT BankMail_Library
'USEUNIT Library_Contracts
'USEUNIT Library_Common
'USEUNIT Constants

'--------------------------------------------------------------------------------------------
'Ուղարկել SWIFT կամ հաստատման գործողության կատարում
'--------------------------------------------------------------------------------------------
Sub Send_SWIFT_or_Confirm(category,receipt)
    wMainForm.Refresh 
    BuiltIn.Delay(3000)
    wMainForm.Refresh    
    '    Սեղմել "+"
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").Keys("[NumPlus]")
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SWSentConf)
    'Լրացնել "Կարգ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PRIOR",category)
    'Լրացնել "Պահանջել ստացման անդորագիր" նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DELIV",receipt)
    'Սեղմել "Կատարել" կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    If Sys.Process("Asbank").WaitVBObject("frmAsMsgBox",20000).Exists Then
        'If MessageExists(2,"Ð³Õáñ¹³·ñáõÃÛáõÝÝ»ñÇ áõÕ³ñÏáõÙÝ ³í³ñïí»ó") Then
            Call ClickCmdButton(5, "OK")
        'Else  
        '    Log.Error"Message is not correct" ,,,ErrorColor
'        End If 
        If Sys.Process("Asbank").WaitVBObject("frmAsMsgBox",10000).Exists Then
           Call ClickCmdButton(5, "OK")
        End If 
    Else
        Log.Error"Message window doesn't open" ,,,ErrorColor
    End If
End Sub

'---------------------------------------------------------------------------------------------------------------------------------------------------
'Կատարում է "Միավորել MT102" գործողությունը
'___________________________________________________________________________________________________________________________________________________
Sub Combine_MT102(fISN,fOBJECT)
    Dim docExist,is_exists,my_vbObj,my_Obj
    Set my_vbObj = wMDIClient.WaitVBObject("frmPttel", delay_middle)
    If my_vbObj.Exists Then
        Do Until Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").EOF
            If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(2).Text) = Trim(fISN) Then
               Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Keys("[Ins]")
               Exit Do
            Else
                  Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
            End If
        Loop
    End If
    BuiltIn.Delay(3000)
    Set my_Obj = wMDIClient.WaitVBObject("frmPttel", delay_middle)
    If my_Obj.Exists Then
        Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveFirst
        Do Until Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").EOF
            If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(2).Text) = Trim(fOBJECT) Then
               Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Keys("[Ins]")
                Exit Do
            Else
                Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
            End If
        Loop
    End If
        
    BuiltIn.Delay(4000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Unite102)
End Sub

'-----------------------------------------------------------------------
'Կարդում գրում է մի ֆայլից մյուսի մեջ
'------------------------------------------------------------------------
'fileFrom - այլ ֆայլի ճանապարհը որից պետք է կարդալ
'fileTo - այն ֆայլի ճանապարհը որի մեջ պետք է գրել
'what - այն կտորը որը պետք է փոխվի
'fWith - այբ ինչով պետէ է փոխվի 
Sub Read_Write_File_With_replace(fileFrom,fileTo,what,fWith)
    Const ForReading = 1
    Const ForWriting = 2

    Set objFSO = CreateObject("Scripting.FileSystemObject")
    Set objFile = objFSO.OpenTextFile(fileFrom, ForReading)
    strText = objFile.ReadAll

    objFile.Close
    strNewText = Replace(strText, what, fWith)

    Set objFile = objFSO.CreateTextFile(fileTo, ForWriting)
    objFile.WriteLine strNewText
    objFile.Close
End Sub

'--------------------------------------------------------------------------------------------------------
'Քաղվածքի տրամադրում SWIFT  գործողության կատարում
'------------------------------------------------------------------------------------------------
'startDate - սկզբի ամսաթիվ
'endDate  - վերջի ամսաթիվ
'stype  - հաղ. տիպ
'bank - բանկ
'comm - Մեկնաբանություն
'showAcc -  Ցույց տալ առանց շրջանառության հաշիվները
'countPeriod - հաշվարկելու ժամանակաշրջան
Sub Acc_State_SWIFT(startDate , endDate , stype , bank , comm , showAcc , countPeriod)
    BuiltIn.Delay(4000)
    Call wMainForm.MainMenu.Click(c_AllActions)    
    Call wMainForm.PopupMenu.Click(c_SWAState)
    'Լրացնում է սկզբի ամսաթիվ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE" ,startDate)
    'Լրացնում է վերջի ամսաթիվ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE" ,endDate)
    'Լրացնում է հաղ. տիպ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","MT" ,stype)
    'Լրացնում է բանկ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","BANK" ,bank)
    'Լրացնում է Մեկնաբանություն նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","COMM" ,comm)
    'Լրացնում է Ցույց տալ առանց շրջանառության հաշիվները  նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","WFLOW" ,showAcc)
    'Լրացնում է հաշվարկելու ժամանակաշրջան նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","CALCPERIOD" ,countPeriod)
    'Սեղմում է "Կատարել" կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Սեղմում է "OK" կոճակը
    Call ClickCmdButton(5, "OK")
End Sub

'--------------------------------------------------------------------------------------------
'Խմբագրել քաղվածքը
'--------------------------------------------------------------------------------------------
'bank - բանկի անվանում
'stype - քաղվածքի տեսակ
Sub Edit_Acc_State(bank,stype)
 Dim endDate  
 endDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today(), "%d/%m/%y")    
    'Անցում է կատարում վերջին տողին
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").MoveFirst

   'Անցնում է ցուցակի միջով և խմբագրում է փաստաթուղթը
    Do Until Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").EOF
    BuiltIn.Delay(2000)
       If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 0  then 
             BuiltIn.Delay(2500)
             Sys.Process("Asbank").Refresh
             'Կատարում է խմբագրել գործողությունը
             Call wMainForm.MainMenu.Click(c_AllActions)
             Call wMainForm.PopupMenu.Click(c_ToEdit)
             Set wTabStrip = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").VBObject("TabStrip")
             wTabStrip.SelectedItem = wTabStrip.Tabs(2)
             Set wTabFrame_2 = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").VBObject("TabFrame_2")
             Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("CmdButton").Click()   
             'Մաքրել մեկնաբանությունների դաշտը
             Call Rekvizit_Fill("Dialog", 1, "CheckBox" , "FIELD61" ,1) 
             Call Rekvizit_Fill("Dialog", 1, "CheckBox" , "CLEAR" ,1) 
             Call ClickCmdButton(2, "Î³ï³ñ»É")
             'Լրացնում է "Բանկ" դաշտը
             If Not bank = NULL Then
                'Լրացնել Ուղարկող/Ստացող դաշտը
                Call Rekvizit_Fill("Documnet",3,"General","SNDREC",bank)
             End If
             If stype = "942" or stype = "950" Then
                'Լրացնել Ամսաթիվ(13D) դաշտը
                Call Rekvizit_Fill("Document",3,"General","FLOORDATE",endDate)
                'Լրացնել Ժամանակ(13D) դաշտը
                Call Rekvizit_Fill("Document",3,"General","FLOORTIME","0311")
                'Լրացնում է Շողում (13D) դաշտը
                Call Rekvizit_Fill("Document",3,"General","FLOOROFFS","+0011")
                'Լրացնում է 1 սահմանաչափի գումար(34F) դաշտը
                Call Rekvizit_Fill("Document",3,"General","FLOORLIM1","100")
                'Լրացնում է 2 սահմանաչափի գումարր(34F) դաշտը
                Call Rekvizit_Fill("Document",3,"General","FLOORLIM2","200")                
             End If
             
             Call ClickCmdButton(1, "Î³ï³ñ»É")
             Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").MoveNext
        Else
          Exit Do
       End If
    Loop
 End Sub

'-----------------------------------------------------------------------------------------------------------------------------------------
'Դնում է ուղարկել SWIFT նշիչը
'-----------------------------------------------------------------------------------------------------------------------------------------
Sub Change_User_Permission_SWIFT()
    Dim startDATE , fDATE, isExists, rolName , rowName,wMainForm
    
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20100101"
    fDATE = "20190101"
    isExists = False
    rolName = "All-Allowed"
    rowName = "|¾ìÐ"
 
    ChangeWorkspace("Ադմինիստրատորի ԱՇՏ 4.0")
    
    'Test StartUp End
    Call wTreeView.DblClickItem("|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ú·ï³·áñÍáÕÝ»ñ ¨ ²Þî|ú·ï³·áñÍáÕÝ»ñÇ ¹»ñ»ñ")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    Set wMainForm = Sys.Process("Asbank").VBObject("MainForm") 
    Set wMDIClient = wMainForm.Window("MDIClient", "", 1)
    Do Until Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").EOF
        If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(0).Text) = rolName Then
            isExists = True
            Exit Do
        Else
            Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
        End If
    Loop
    
    If isExists Then
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_ToEdit)
        Sys.Process("Asbank").vbObject("frmRolePropN").vbObject("TabStrip1").ClickTab("¶áñÍ³éÝ³Ï³Ý")
        
            Sys.Process("Asbank").VBObject("frmRolePropN").VBObject("RolePropDistrRes").VBObject("TabFrame").VBObject("tvwTreeView").ClickItem(rowName)
            Sys.Process("Asbank").VBObject("frmRolePropN").VBObject("RolePropDistrRes").VBObject("TabFrame").VBObject("OperGrid").Row = 3
            Sys.Process("Asbank").VBObject("frmRolePropN").VBObject("RolePropDistrRes").VBObject("TabFrame").VBObject("OperGrid").Columns.Item(1).Value = -1
        
    Else
        Log.Error("Roll with name " & rolName & " does't exist")
    End If
    Sys.Process("Asbank").VBObject("frmRolePropN").VBObject("cmdOK").Click()
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
End Sub

'----------------------------------------------------------------------------------------------------------------------------------------
'Ստուգում է փաստաթղթի առկայությունը "Ստացված խառը հաղորդագորւթյուններ" թղթապանակում
'----------------------------------------------------------------------------------------------------------------------------------------
Function PaySys_Check_Doc_In_SWIFT_Mixed_Mess_Folder(docN)
    Dim is_exists : is_exists = False
    
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |Ê³éÁ Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ|êï³óí³Í Ë³éÁ Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    If wMDIClient.WaitVBObject("frmPttel", 3000).Exists Then
        Do Until wMDIClient.vbObject("frmPttel").vbObject("tdbgView").EOF
            If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(3).Text) = Trim(docN) Then
                is_exists = True
                Exit Do
            Else
                Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
            End If
        Loop
    End If
    
    PaySys_Check_Doc_In_SWIFT_Mixed_Mess_Folder = is_exists
End Function

'-----------------------------------------------------------------
' Միջազգ. վճարման հանձնարարագիր(ստ.)(Foreign_Payment_Order)-ի Class
'-----------------------------------------------------------------
Class Foreign_Payment_Order
    Public Isn
    Public Division
    Public Department
    Public NumberOfDocument
    Public Date
    Public AccountOfBeneficiaryClient
    Public Receiver
    Public ReceiverAddress
    Public AccountOfOrderingClient
    Public Payer
    Public PayerAddress
    Public Amount
    Public Curr
    Public RemittanceInformation
    Public ClientTransfer
    Public RepaymentDate
    Public RecPaySystem
    Public SentPaySystem
    Public NumberOfDocument20
    Public Reference
    Public PacketNumber
    Public IDNumber
    Public SocialCard
    Public SenderToReceiverInformation
    Public TransitAccount
    Public CorrespondentAccount
    Public DetailsOfCharges
    Public TransferAim
    Public SanctionsScreeningInformation
    Public TypeOfAccountWithInstitution
    Public AccountWithInstitution
    Public PIDofAccountWithInstitution
    Public ReceiverBankCorrespondent
    Public AccountOfReceiverBanksCorrespondent
    Public TypeOfIntermediaryInstitution
    Public IntermediaryInstitution
    Public PIDofIntermediaryInstitution
    Public TypeOfOrderingInstitution
    Public OrderingInstitution
    Public PIDofOrderingInstitution
    Public Country
    Public Commission
    Public IncludeCharge
    Public AccountType
    Public Type1
    Public SenderReceiver
    Public MsgType
    Public Phone
    Public Refusal
    Public Residance
    Public ValueDate
    Public DateSend
    Public TimeSend

    Private Sub Class_Initialize
        Isn = ""
        Division = ""
        Department = ""
        NumberOfDocument = ""
        Date = ""
        AccountOfBeneficiaryClient = ""
        Receiver = ""
        ReceiverAddress = ""
        AccountOfOrderingClient = ""
        Payer = ""
        PayerAddress = ""
        Amount = ""
        Curr = ""
        RemittanceInformation = ""
        ClientTransfer = ""
        RepaymentDate = ""
        RecPaySystem = ""
        SentPaySystem = ""
        NumberOfDocument20 = ""
        Reference = ""
        PacketNumber = ""
        IDNumber = ""
        SocialCard = ""
        SenderToReceiverInformation = ""
        TransitAccount = "" 
        CorrespondentAccount = ""
        DetailsOfCharges = ""
        TransferAim = ""
        SanctionsScreeningInformation = ""
        TypeOfAccountWithInstitution = ""
        AccountWithInstitution = ""
        PIDofAccountWithInstitution = ""
        ReceiverBankCorrespondent = ""
        AccountOfReceiverBanksCorrespondent = ""
        TypeOfIntermediaryInstitution = ""
        IntermediaryInstitution = ""
        PIDofIntermediaryInstitution = ""
        TypeOfOrderingInstitution = ""
        OrderingInstitution = ""
        PIDofOrderingInstitution = ""
        Country = ""
        Commission = ""
        IncludeCharge = ""
        AccountType = ""
        Type1 = ""
        SenderReceiver = ""
        MsgType = ""
        Phone = ""
        Refusal = ""
        Residance = ""
        ValueDate = ""
        DateSend = ""
        TimeSend = ""
    End Sub  
End Class

Function New_Foreign_Payment_Order()
    Set New_Foreign_Payment_Order = NEW Foreign_Payment_Order      
End Function

'------------------------------------------------------------------
'Ստուգում է "Միջազգ. վճարման հանձնարարագիր(ստ.)" բացված պատուհանի արժեքները
'------------------------------------------------------------------
Sub Check_Foreign_Payment_Order(ForeignPaymentOrder)
    ForeignPaymentOrder.Isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Ստուգում է "Գրասենյակ" դաշտի արժեքը
    Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",1,"Mask","ACSBRANCH"),ForeignPaymentOrder.Division) 
    'Ստուգում է "Բաժին" դաշտի արժեքը
    Call Compare_Two_Values("Բաժին",Get_Rekvizit_Value("Document",1,"Mask","ACSDEPART"),ForeignPaymentOrder.Department) 
    'Ստուգում է "Փաստաթղթի N" դաշտի արժեքը
    Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",1,"General","DOCNUM"),ForeignPaymentOrder.NumberOfDocument)
    'Ստուգում է "Ամսաթիվ" դաշտի արժեքը
    Call Compare_Two_Values("Ամսաթիվ",Get_Rekvizit_Value("Document",1,"General","DATE"),ForeignPaymentOrder.Date)
    'Ստուգում է "Ստացողի հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Ստացողի հաշիվ",Get_Rekvizit_Value("Document",1,"Bank","ACCCR"),ForeignPaymentOrder.AccountOfBeneficiaryClient)
    'Ստուգում է "Ստացող" դաշտի արժեքը
    Call Compare_Two_Values("Ստացող",Get_Rekvizit_Value("Document",1,"Comment","RECEIVER"),ForeignPaymentOrder.Receiver)
    'Ստուգում է "Ստացողի հասցե" դաշտի արժեքը
    Call Compare_Two_Values("Ստացողի հասցե",Get_Rekvizit_Value("Document",1,"Comment","RECADDR"),ForeignPaymentOrder.ReceiverAddress)
    'Ստուգում է "Վճարողի հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Վճարողի հաշիվ",Get_Rekvizit_Value("Document",1,"Comment","ACCDB"),ForeignPaymentOrder.AccountOfOrderingClient)
    'Ստուգում է "Վճարող" դաշտի արժեքը
    Call Compare_Two_Values("Վճարող",Get_Rekvizit_Value("Document",1,"Comment","PAYER"),ForeignPaymentOrder.Payer)
    'Ստուգում է "Վճարողի հասցե" դաշտի արժեքը
    Call Compare_Two_Values("Վճարողի հասցե",Get_Rekvizit_Value("Document",1,"Comment","PAYADDR"),ForeignPaymentOrder.PayerAddress)
    'Ստուգում է "Գումար" դաշտի արժեքը
    Call Compare_Two_Values("Գումար",Get_Rekvizit_Value("Document",1,"General","SUMMA"),ForeignPaymentOrder.Amount)
    'Ստուգում է "Արժույթ" դաշտի արժեքը
    Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",1,"Mask","CUR"),ForeignPaymentOrder.Curr)
    'Ստուգում է "Նպատակ" դաշտի արժեքը
    Call Compare_Two_Values("Նպատակ",Get_Rekvizit_Value("Document",1,"Comment","AIM"),ForeignPaymentOrder.RemittanceInformation)
    'Ստուգում է "Հաճախորդի փոխանցում" դաշտի արժեքը
    Call Compare_Two_Values("Հաճախորդի փոխանցում",Get_Rekvizit_Value("Document",1,"Mask","CLITRANS"),ForeignPaymentOrder.ClientTransfer)
    'Ստուգում է "Մարման ամսաթիվ" դաշտի արժեքը
    Call Compare_Two_Values("Մարման ամսաթիվ",Get_Rekvizit_Value("Document",1,"General","QDATE"),ForeignPaymentOrder.RepaymentDate)
    'Ստուգում է "Ընդ.վճ.համակարգ" դաշտի արժեքը
    Call Compare_Two_Values("Ընդ.վճ.համակարգ",Get_Rekvizit_Value("Document",1,"Mask","PAYSYSIN"),ForeignPaymentOrder.RecPaySystem)    
    'Ստուգում է "Ուղ.վճ.համակարգ" դաշտի արժեքը
    Call Compare_Two_Values("",Get_Rekvizit_Value("Document",1,"Mask","PAYSYSOUT"),ForeignPaymentOrder.SentPaySystem)   

    'Tab 2
    'Ստուգում է "Փաստաթղթի N" դաշտի արժեքը
    Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",2,"General","BMDOCNUM"),ForeignPaymentOrder.NumberOfDocument20)  
    'Ստուգում է "Հղում" դաշտի արժեքը
    Call Compare_Two_Values("Հղում",Get_Rekvizit_Value("Document",2,"General","REF"),ForeignPaymentOrder.Reference)      
    'Ստուգում է "Փաթեթի համարը" դաշտի արժեքը
    Call Compare_Two_Values("Փաթեթի համարը",Get_Rekvizit_Value("Document",2,"General","PACK"),ForeignPaymentOrder.PacketNumber) 
    'Ստուգում է "Անձը հաստատող փաստ." դաշտի արժեքը
    Call Compare_Two_Values("Անձը հաստատող փաստ.",Get_Rekvizit_Value("Document",2,"General","PASSNUM"),ForeignPaymentOrder.IDNumber) 
    'Ստուգում է "Սոցիալական քարտ(վճարող)" դաշտի արժեքը
    Call Compare_Two_Values("Սոցիալական քարտ(վճարող)",Get_Rekvizit_Value("Document",2,"General","REGNUM"),ForeignPaymentOrder.SocialCard)     
    'Ստուգում է "Լրացուցիչ ինֆորմացիա" դաշտի արժեքը
    Call Compare_Two_Values("Լրացուցիչ ինֆորմացիա",Get_Rekvizit_Value("Document",2,"Comment","ADDINFO"),ForeignPaymentOrder.SenderToReceiverInformation)   
    'Ստուգում է "Տարանցիկ հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Տարանցիկ հաշիվ",Get_Rekvizit_Value("Document",2,"Mask","TCORRACC"),ForeignPaymentOrder.TransitAccount)  
    'Ստուգում է "Թղթակցային հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Թղթակցային հաշիվ",Get_Rekvizit_Value("Document",2,"Mask","CORRACC"),ForeignPaymentOrder.CorrespondentAccount)  
    'Ստուգում է "Ծախսերի մանրամասնություն" դաշտի արժեքը
    Call Compare_Two_Values("Ծախսերի մանրամասնություն",Get_Rekvizit_Value("Document",2,"Mask","EXPTYPE"),ForeignPaymentOrder.DetailsOfCharges)  
    'Ստուգում է "Փոխանցման նպատակ" դաշտի արժեքը
    Call Compare_Two_Values("Փոխանցման նպատակ",Get_Rekvizit_Value("Document",2,"Mask","PAYAIM"),ForeignPaymentOrder.TransferAim) 
    'Ստուգում է "Sanctions Screening համակ.ինֆորմացիա" դաշտի արժեքը
    Call Compare_Two_Values("Sanctions Screening համակ.ինֆորմացիա",Get_Rekvizit_Value("Document",2,"General","SSINFO"),ForeignPaymentOrder.SanctionsScreeningInformation) 

    'Tab 3
    'Ստուգում է "Ստացող կազմակերպ.տվ.տիպ" դաշտի արժեքը
    Call Compare_Two_Values("Ստացող կազմակերպ.տվ.տիպ",Get_Rekvizit_Value("Document",3,"Mask","RINSTOP"),ForeignPaymentOrder.TypeOfAccountWithInstitution) 
    'Ստուգում է "Ստացող կազմակերպ." դաշտի արժեքը
    Call Compare_Two_Values("Ստացող կազմակերպ.",Get_Rekvizit_Value("Document",3,"Comment","RECINST"),ForeignPaymentOrder.AccountWithInstitution) 
    'Ստուգում է "Ստացող կազմակերպ.հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Ստացող կազմակերպ.հաշիվ",Get_Rekvizit_Value("Document",3,"Comment","RINSTID"),ForeignPaymentOrder.PIDofAccountWithInstitution) 
    'Ստուգում է "Ստացող բանկի թղթակից" դաշտի արժեքը
    Call Compare_Two_Values("Ստացող բանկի թղթակից",Get_Rekvizit_Value("Document",3,"Comment","RCORBANK"),ForeignPaymentOrder.ReceiverBankCorrespondent) 
    'Ստուգում է "Ստացող բանկի թղթակցի հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Ստացող բանկի թղթակցի հաշիվ",Get_Rekvizit_Value("Document",3,"Comment","RCORID"),ForeignPaymentOrder.AccountOfReceiverBanksCorrespondent) 
    'Ստուգում է "Միջնորդ բանկի տվ.տիպ" դաշտի արժեքը
    Call Compare_Two_Values("Միջնորդ բանկի տվ.տիպ",Get_Rekvizit_Value("Document",3,"Mask","MEDOP"),ForeignPaymentOrder.TypeOfIntermediaryInstitution) 
    'Ստուգում է "Միջնորդ բանկ" դաշտի արժեքը
    Call Compare_Two_Values("Միջնորդ բանկ",Get_Rekvizit_Value("Document",3,"Comment","MEDBANK"),ForeignPaymentOrder.IntermediaryInstitution) 
    'Ստուգում է "Միջնորդ բանկի հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Միջնորդ բանկի հաշիվ",Get_Rekvizit_Value("Document",3,"Comment","MEDID"),ForeignPaymentOrder.PIDofIntermediaryInstitution) 
    'Ստուգում է "Վճարող կազմակերպ.տվ.տիպ" դաշտի արժեքը
    Call Compare_Two_Values("Վճարող կազմակերպ.տվ.տիպ",Get_Rekvizit_Value("Document",3,"Mask","PINSTOP"),ForeignPaymentOrder.TypeOfOrderingInstitution) 
    'Ստուգում է "Վճարող կազմակերպ." դաշտի արժեքը
    Call Compare_Two_Values("Վճարող կազմակերպ.",Get_Rekvizit_Value("Document",3,"Comment","PAYINST"),ForeignPaymentOrder.OrderingInstitution) 
    'Ստուգում է "Վճարող կազմակերպ.հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Վճարող կազմակերպ.հաշիվ",Get_Rekvizit_Value("Document",3,"Comment","PINSTID"),ForeignPaymentOrder.PIDofOrderingInstitution) 
    
    'Tab 4
    'Ստուգում է "Երկիր" դաշտի արժեքը
    Call Compare_Two_Values("Երկիր",Get_Rekvizit_Value("Document",4,"Mask","COUNTRY"),ForeignPaymentOrder.Country) 
    'Ստուգում է "Միջնորդավճար" դաշտի արժեքը
    Call Compare_Two_Values("Միջնորդավճար",Get_Rekvizit_Value("Document",4,"General","COMMISSION"),ForeignPaymentOrder.Commission) 
    'Ստուգում է "Ներառել գանձումը" դաշտի արժեքը
    Call Compare_Two_Values("Ներառել գանձումը",Get_Rekvizit_Value("Document",4,"CheckBox","INCHARGE"),ForeignPaymentOrder.IncludeCharge) 
    'Ստուգում է "Հաշվի տիպ" դաշտի արժեքը
    Call Compare_Two_Values("Հաշվի տիպ",Get_Rekvizit_Value("Document",4,"Mask","ACCTYPE"),ForeignPaymentOrder.AccountType) 
    'Ստուգում է "Տիպ" դաշտի արժեքը
    Call Compare_Two_Values("Տիպ",Get_Rekvizit_Value("Document",4,"Mask","CORTYPE"),ForeignPaymentOrder.Type1) 
    'Ստուգում է "Ուղարկող/Ստացող" դաշտի արժեքը
    Call Compare_Two_Values("Ուղարկող/Ստացող",Get_Rekvizit_Value("Document",4,"Comment","SNDREC"),ForeignPaymentOrder.SenderReceiver) 
    'Ստուգում է "Հաղ.տիպ" դաշտի արժեքը
    Call Compare_Two_Values("Հաղ.տիպ",Get_Rekvizit_Value("Document",4,"General","MT"),ForeignPaymentOrder.MsgType) 
    'Ստուգում է "Հեռախոս" դաշտի արժեքը
    Call Compare_Two_Values("Հեռախոս",Get_Rekvizit_Value("Document",4,"General","PHONE"),ForeignPaymentOrder.Phone) 
    'Ստուգում է "Մերժում" դաշտի արժեքը
    Call Compare_Two_Values("Մերժում",Get_Rekvizit_Value("Document",4,"General","REFUSE"),ForeignPaymentOrder.Refusal) 
    'Ստուգում է "Ռեզիդենտություն" դաշտի արժեքը
    Call Compare_Two_Values("Ռեզիդենտություն",Get_Rekvizit_Value("Document",4,"Mask","RES"),ForeignPaymentOrder.Residance)  
    'Ստուգում է "Վճարման օր" դաշտի արժեքը
    Call Compare_Two_Values("Վճարման օր",Get_Rekvizit_Value("Document",4,"General","PAYDATE"),ForeignPaymentOrder.ValueDate)
    'Ստուգում է "Ամսաթիվ(Ուղարկման/Ստացման)" դաշտի արժեքը
    Call Compare_Two_Values("Ամսաթիվ(Ուղարկման/Ստացման)",Get_Rekvizit_Value("Document",4,"General","BMIODATE"),ForeignPaymentOrder.DateSend)
    'Ստուգում է "Ժամանակ(Ուղարկման/Ստացման)" դաշտի արժեքը
'    Call Compare_Two_Values("Ժամանակ(Ուղարկման/Ստացման)",Get_Rekvizit_Value("Document",4,"General","BMIOTIME"),ForeignPaymentOrder.TimeSend)
End Sub

'------------------------------------------------------------------------------
'Արտարժույթի փոխանամկման հաստատում (SWIFT300) (Foreign Exchange Confirmation) փաստաթղթի Class
'------------------------------------------------------------------------------
Class foreign_Exch_Confirm
    '1
    Public isn
    Public div
    Public dep
    Public docN
    Public reference
    Public opType
    Public comReference
    Public opScope
    Public blockTrade
    Public splitSettlemnt
    Public dataTypePartyA
    Public PIDPartyA
    Public partyA
    Public dataTypePartyB
    Public PIDPartyB
    Public partyB
    Public dataTypeFund
    Public PIDFund
    Public fund
    Public key
    '2
    Public date
    Public valDate
    Public curB
    Public curS
    Public sumB
    Public sumS
    Public exCourse
    Public exRate
    Public senderReciever
    '3
    Public bDataTypeDelAgent 
    Public bPIDDelAgent
    Public bDelAgent
    Public bDataTypeIntInst
    Public bPIDIntInst
    Public bIntInst
    Public bDataTypeRecieveAgent
    Public bPIDRecieveAgent
    Public bRecieveAgent
    '4
    Public sDataTypeDelAgent 
    Public sPIDDelAgent
    Public sDelAgent
    Public sTypeIntInst
    Public sPIDIntInst
    Public sIntInst
    Public sDataTypeRecieveAgent
    Public sPIDRecieveAgent
    Public sRecieveAgent
    Public sDataTypeBenefInst
    Public sPIDBenefInst
    Public sBenefInst
    '5
    Public packN
    Public counterpartyRef
    Public brokRef
    Public terms
    Public senderToRecInfo
    Public fileName
    Public dirName
    Public sendRecDate
    Public trailer
    Public priority
    Public bankPriority
    Public repaymentDate 
    '6
    Public contInfo
    Public dealMethod
    Public dealMethodAdd
    Public dataTypeDealingPartyA
    Public PIDDealingPartyA
    Public dealingPartyA
    Public dataTypeDealingPartyB
    Public PIDDealingPartyB
    Public dealingPartyB
    Public dataTypeBrok
    Public PIDBrok
    Public broker 
    Public brokerComissionCur
    Public brokerComission
    '7
    Public splitCount
    Public splitPurSale(2)
    Public splitCurB (2)
    Public splitSumB (2)
    Public splitDataTypeDelAgent(2)
    Public splitPIDDelAgent(2)
    Public splitDelAgent(2)
    Public splitTypeOfInterm (2)
    Public splitPIDIntermInst (2)
    Public splitIntermInst (2)
    Public splitDataTypeRecAgent (2)
    Public splitPIDRecAgent (2)
    Public splitRecAgent (2)
    Public splitDataTypeBenInst (2)
    Public splitPIDBenInst (2)
    Public splitBenInst (2)

    '8
    Public eventType
    Public eventReference
    Public eventReference21F
    Public profLossSettDate
    Public currToBeSettled
    Public sumToBeSetelled
    Public reportCur
    Public taxSum
      
    Private Sub Class_Initialize
        '1
        isn = ""
        div = ""
        dep = ""
        docN = ""
        reference = ""
        opType = ""
        comReference = ""
        opScope = ""
        blockTrade = ""
        splitSettlemnt = ""
        dataTypePartyA = ""
        PIDPartyA = ""
        partyA = ""
        dataTypePartyB = ""
        PIDPartyB = ""
        partyB = ""
        dataTypeFund = ""
        PIDFund = ""
        fund = ""
        key = ""
        '2
        date = "  /  /  "
        valDate = "  /  /  "
        curB = ""
        curS = ""
        sumB = "0.00"
        sumS = "0.00"
        exCourse = ""
        exRate = ""
        senderReciever = ""
        '3
        bDataTypeDelAgent  = ""
        bPIDDelAgent = ""
        bDelAgent = ""
        bDataTypeIntInst = ""
        bPIDIntInst = ""
        bIntInst = ""
        bDataTypeRecieveAgent = ""
        bPIDRecieveAgent = ""
        bRecieveAgent = ""
        '4
        sDataTypeDelAgent  = ""
        sPIDDelAgent = ""
        sDelAgent = ""
        sTypeIntInst = ""
        sPIDIntInst = ""
        sIntInst = ""
        sDataTypeRecieveAgent = ""
        sPIDRecieveAgent = ""
        sRecieveAgent = ""
        sDataTypeBenefInst = ""
        sPIDBenefInst = ""
        sBenefInst = ""
        '5
        packN = ""
        counterpartyRef = ""
        brokRef = ""
        terms = ""
        senderToRecInfo = ""
        fileName = ""
        dirName = ""
        sendRecDate = "  /  /  "
        trailer = ""
        priority = ""
        bankPriority = ""
        repaymentDate  = "  /  /  "
        '6
        contInfo = ""
        dealMethod = ""
        dealMethodAdd = ""
        dataTypeDealingPartyA = ""
        PIDDealingPartyA = ""
        dealingPartyA = ""
        dataTypeDealingPartyB = ""
        PIDDealingPartyB = ""
        dealingPartyB = ""
        dataTypeBrok = ""
        PIDBrok = ""
        broker  = ""
        brokerComissionCur = ""
        brokerComission = "0.00"
        '7
        For splitCount = 0 to 2   
            splitPurSale(splitCount) = ""
            splitCurB (splitCount) = ""
            splitSumB (splitCount) = ""
            splitDataTypeDelAgent(splitCount) = ""
            splitPIDDelAgent(splitCount) = ""
            splitDelAgent(splitCount) = ""
            splitTypeOfInterm (splitCount) = ""
            splitPIDIntermInst (splitCount) = ""
            splitDataTypeRecAgent (splitCount) = ""
            splitPIDRecAgent (splitCount) = ""
            splitRecAgent (splitCount) = ""
            splitDataTypeBenInst  (splitCount) = ""
            splitPIDBenInst  (splitCount) = ""
            splitBenInst  (splitCount) = ""
        Next    
        splitCount = 0
        '8
        eventType = ""
        eventReference = ""
        eventReference21F = ""
        profLossSettDate = "  /  /  "
        currToBeSettled = ""
        sumToBeSetelled = "0.00"
        reportCur = ""
        taxSum = "0.00"
    End Sub   
End Class


Function New_Foreign_Exch_Confirm ()
    Set New_Foreign_Exch_Confirm = New foreign_Exch_Confirm
End Function

'SWIFT 300 տեսակի փաստաթղթի պատուհանի դաշտերը ստուգող ֆունկցիա
Sub Check_Foreign_Exchange_Confirm_Window(foreignExchange)
    Dim i,j
    '1 Tab Ընդհանուր
    Call GoTo_ChoosedTab(1)
    foreignExchange.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Գրասենյակ դաշտի ստուգում 
    Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",1,"Mask","ACSBRANCH"),foreignExchange.div) 
    'Բաժին դաշտի ստուգում 
    Call Compare_Two_Values("Բաժին",Get_Rekvizit_Value("Document",1,"Mask","ACSDEPART"),foreignExchange.dep)
    'Փաստաթղթի N դաշտի ստուգում
    Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",1,"General","BMDOCNUM"),foreignExchange.docN)
    'Հղում դաշտի ստուգում
    Call Compare_Two_Values("Հղում",Get_Rekvizit_Value("Document",1,"General","REF"),foreignExchange.reference)
    'Գործողության տեսակ դաշտի ստուգում
    Call Compare_Two_Values("Գործողության տեսակ",Get_Rekvizit_Value("Document",1,"Mask","OPERTYPE"),foreignExchange.opType)
    'Ընդհանուր հղում դաշտի ստուգում
    Call Compare_Two_Values("Ընդհանուր հղում",Get_Rekvizit_Value("Document",1,"General","COMREF"),foreignExchange.comReference)    
    'Գործողության տեսակ դաշտի ստուգում
    Call Compare_Two_Values("Գործողության Ֆորմատ",Get_Rekvizit_Value("Document",1,"Mask","OPERSCOPE"),foreignExchange.opScope)
    'Փաթեթային գործարք դաշտի ստուգում
    Call Compare_Two_Values("Փաթեթային գործարք",Get_Rekvizit_Value("Document",1,"Mask","BLOCKIND"),foreignExchange.blockTrade)
    'Ամբողջական Գումար դաշտի ստուգում
    Call Compare_Two_Values("Ամբողջական Գումար",Get_Rekvizit_Value("Document",1,"Mask","SPLITIND"),foreignExchange.splitSettlemnt)
    'Առաջին կազմակերպ. տվ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Առաջին կազմակերպ. տվ. տիպ",Get_Rekvizit_Value("Document",1,"Mask","PARTYAOP"),foreignExchange.dataTypePartyA)
    'Առաջին կազմակերպ. Հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Առաջին կազմակերպ. Հաշիվ",Get_Rekvizit_Value("Document",1,"Comment","PARTYAID"),foreignExchange.PIDPartyA)
    'Առաջին կազմակերպություն դաշտի ստուգում
    Call Compare_Two_Values("Առաջին կազմակերպություն",Get_Rekvizit_Value("Document",1,"Comment","PARTYA"),foreignExchange.partyA)
    'Երկրորդ կազմակերպ. տվ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Երկրորդ կազմակերպ. տվ. տիպ",Get_Rekvizit_Value("Document",1,"Mask","PARTYBOP"),foreignExchange.dataTypePartyB)
    'Երկրորդ կազմակերպ. Հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Երկրորդ կազմակերպ. Հաշիվ",Get_Rekvizit_Value("Document",1,"Comment","PARTYBID"),foreignExchange.PIDPartyB)
    'Երկրորդ կազմակերպություն դաշտի ստուգում
    Call Compare_Two_Values("Երկրորդ կազմակերպություն",Get_Rekvizit_Value("Document",1,"Comment","PARTYB"),foreignExchange.partyB)
    'Հիմնադրամի/Հաճախորդի տվ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Հիմնադրամի/Հաճախորդի տվ. տիպ",Get_Rekvizit_Value("Document",1,"Mask","FUNDOP"),foreignExchange.dataTypeFund)
    'Հիմնադրամի/Հաճախորդի Հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Հիմնադրամի/Հաճախորդի Հաշիվ",Get_Rekvizit_Value("Document",1,"Comment","FUNDID"),foreignExchange.PIDFund)
    'Հիմնադրամ/Հաճախորդ դաշտի ստուգում
    Call Compare_Two_Values("Հիմնադրամ/Հաճախորդ",Get_Rekvizit_Value("Document",1,"Comment","FUND"),foreignExchange.fund)
    'Բանալի դաշտի ստուգում
    Call Compare_Two_Values("Բանալի",Get_Rekvizit_Value("Document",1,"General","TXKEY"),foreignExchange.key)
    
    '2 Tab Գործառնության տվյալներ
    Call GoTo_ChoosedTab(2)    
    'Ամսաթիվ դաշտի ստուգում
    Call Compare_Two_Values("Ամսաթիվ",Get_Rekvizit_Value("Document",2,"General","DATE"),foreignExchange.date)    
    'Վճարման օր դաշտի ստուգում
    Call Compare_Two_Values("Վճարման օր",Get_Rekvizit_Value("Document",2,"General","PAYDATE"),foreignExchange.valDate)
    'Արժույթ(առք) դաշտի ստուգում
    Call Compare_Two_Values("Արժույթ(առք)",Get_Rekvizit_Value("Document",2,"Mask","CURB"),foreignExchange.curB)    
    'Արժույթ(վաճառք) դաշտի ստուգում
    Call Compare_Two_Values("Արժույթ(վաճառք)",Get_Rekvizit_Value("Document",2,"Mask","CURS"),foreignExchange.curS)
    'Գումար (առք) դաշտի ստուգում
    Call Compare_Two_Values("Գումար(առք)",Get_Rekvizit_Value("Document",2,"General","SUMMAB"),foreignExchange.sumB)    
    'Գումար(վաճառք) դաշտի ստուգում
    Call Compare_Two_Values("Գումար(վաճառք)",Get_Rekvizit_Value("Document",2,"General","SUMMAS"),foreignExchange.sumS)          
    'Փոխարժեք դաշտի ստուգում
    Call Compare_Two_Values("Փոխարժեք",Get_Rekvizit_Value("Document",2,"Course","COURSE"),foreignExchange.exCourse)
    'Փոխարժեք36 դաշտի ստուգում
    Call Compare_Two_Values("Փոխարժեք36",Get_Rekvizit_Value("Document",2,"General","RATE"),foreignExchange.exRate)       
    'Ուղարկող/Ստացող դաշտի ստուգում
    Call Compare_Two_Values("Ուղարկող/Ստացող",Get_Rekvizit_Value("Document",2,"Comment","SNDREC"),foreignExchange.senderReciever)       
    
    '3 Tab Տվյալներ (Առք)
    Call GoTo_ChoosedTab(3)
    'Առաքման գործակալի տվ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Առաքման գործակալի տվ. տիպ",Get_Rekvizit_Value("Document",3,"Mask","DAGENTBOP"),foreignExchange.bDataTypeDelAgent)
    'Առաքման գործակալի հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Առաքման գործակալի հաշիվ",Get_Rekvizit_Value("Document",3,"General","DAGENTBID"),foreignExchange.bPIDDelAgent)    
    'Առաքման գործակալ դաշտի ստուգում
    Call Compare_Two_Values("Առաքման գործակալ",Get_Rekvizit_Value("Document",3,"Comment","DAGENTB"),foreignExchange.bDelAgent)
    'Միջնորդ բանկի տվ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Միջնորդ բանկի տվ. տիպ",Get_Rekvizit_Value("Document",3,"Mask","MEDBOP"),foreignExchange.bDataTypeIntInst)   
    'Միջնորդ բանկի հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Միջնորդ բանկի հաշիվ",Get_Rekvizit_Value("Document",3,"Comment","MEDBID"),foreignExchange.bPIDIntInst) 
    'Միջնորդ բանկ դաշտի ստուգում
    Call Compare_Two_Values("Միջնորդ բանկ",Get_Rekvizit_Value("Document",3,"Comment","MEDBBANK"),foreignExchange.bIntInst) 
    'Ստացող գործակալի տվ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Ստացող գործակալի տվ. տիպ",Get_Rekvizit_Value("Document",3,"Mask","RAGENTBOP"),foreignExchange.bDataTypeRecieveAgent)   
    'Ստացող գործակալի հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Ստացող գործակալի հաշիվ",Get_Rekvizit_Value("Document",3,"Comment","RAGENTBID"),foreignExchange.bPIDRecieveAgent) 
    'Ստացող գործակալ դաշտի ստուգում
    Call Compare_Two_Values("Ստացող գործակալ",Get_Rekvizit_Value("Document",3,"Comment","RAGENTB"),foreignExchange.bRecieveAgent)
    
    '4 Tab Տվյալներ (Վաճառք)
    Call GoTo_ChoosedTab(4)
    'Առաքման գործակալի տվ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Առաքման գործակալի տվ. տիպ",Get_Rekvizit_Value("Document",4,"Mask","DAGENTSOP"),foreignExchange.sDataTypeDelAgent)
    'Առաքման գործակալի հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Առաքման գործակալի հաշիվ",Get_Rekvizit_Value("Document",4,"General","DAGENTSID"),foreignExchange.sPIDDelAgent)    
    'Առաքման գործակալ դաշտի ստուգում
    Call Compare_Two_Values("Առաքման գործակալ",Get_Rekvizit_Value("Document",4,"Comment","DAGENTS"),foreignExchange.sDelAgent)
    'Միջնորդ բանկի տվ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Միջնորդ բանկի տվ. տիպ",Get_Rekvizit_Value("Document",4,"Mask","MEDSOP"),foreignExchange.sTypeIntInst)   
    'Միջնորդ բանկի հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Միջնորդ բանկի հաշիվ",Get_Rekvizit_Value("Document",4,"Comment","MEDSID"),foreignExchange.sPIDIntInst) 
    'Միջնորդ բանկ դաշտի ստուգում
    Call Compare_Two_Values("Միջնորդ բանկ",Get_Rekvizit_Value("Document",4,"Comment","MEDSBANK"),foreignExchange.sIntInst) 
    'Ստացող գործակալի տվ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Ստացող գործակալի տվ. տիպ",Get_Rekvizit_Value("Document",4,"Mask","RAGENTSOP"),foreignExchange.sDataTypeRecieveAgent)   
    'Ստացող գործակալի հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Ստացող գործակալի հաշիվ",Get_Rekvizit_Value("Document",4,"Comment","RAGENTSID"),foreignExchange.sPIDRecieveAgent) 
    'Ստացող գործակալ դաշտի ստուգում
    Call Compare_Two_Values("Ստացող գործակալ",Get_Rekvizit_Value("Document",4,"Comment","RAGENTS"),foreignExchange.sRecieveAgent)    
    'Շահառու կազմակերպության տվ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Շահառու կազմակերպության տվ. տիպ",Get_Rekvizit_Value("Document",4,"Mask","BENINSTSOP"),foreignExchange.sDataTypeBenefInst)   
    'Ստացող գործակալի հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Շահառու կազմակերպության հաշիվ",Get_Rekvizit_Value("Document",4,"Comment","BENINSTSID"),foreignExchange.sPIDBenefInst) 
    'Ստացող գործակալ դաշտի ստուգում
    Call Compare_Two_Values("Շահառու կազմակերպություն",Get_Rekvizit_Value("Document",4,"Comment","BENINSTS"),foreignExchange.sBenefInst)    

    '5 Tab Լրացուցիչ
    Call GoTo_ChoosedTab(5)
    'Փաթեթի համարը դաշտի ստուգում
    Call Compare_Two_Values("Փաթեթի համարը",Get_Rekvizit_Value("Document",5,"Comment","PACK"),foreignExchange.packN)
    'Հանդիպակաց հղում դաշտի ստուգում
    Call Compare_Two_Values("Հանդիպակաց հղում",Get_Rekvizit_Value("Document",5,"General","CNTREF"),foreignExchange.counterpartyRef)    
    'Բրոքերի հղում դաշտի ստուգում
    Call Compare_Two_Values("Բրոքերի հղում",Get_Rekvizit_Value("Document",5,"General","BRKREF"),foreignExchange.brokRef)    
    'Պայմաններ դաշտի ստուգում
    Call Compare_Two_Values("Պայմաններ",Get_Rekvizit_Value("Document",5,"Comment","TERMS"),foreignExchange.terms)   
    'Լրացուցիչ ինֆորմացիա դաշտի ստուգում
    Call Compare_Two_Values("Լրացուցիչ ինֆորմացիա",Get_Rekvizit_Value("Document",5,"Comment","ADDINFO"),foreignExchange.senderToRecInfo)   
    'Ֆայլի անուն դաշտի ստուգում
    Call Compare_Two_Values("Ֆայլի անուն",Get_Rekvizit_Value("Document",5,"General","BMNAME"),foreignExchange.fileName)
    'Դիրեկտորիայի անուն դաշտի ստուգում
    Call Compare_Two_Values("Դիրեկտորիայի անուն",Get_Rekvizit_Value("Document",5,"General","BMDIRECT"),foreignExchange.dirName)    
    'Ամսաթիվ (Ողարկման/Ստացման) դաշտի ստուգում
    Call Compare_Two_Values("Ամսաթիվ (Ողարկման/Ստացման)",Get_Rekvizit_Value("Document",5,"General","BMIODATE"),foreignExchange.sendRecDate)           
    'Վերջնահատված դաշտի ստուգում
    Call Compare_Two_Values("Վերջնահատված",Get_Rekvizit_Value("Document",5,"General","TRAILER"),foreignExchange.trailer) 
    'Կարգ դաշտի ստուգում
    Call Compare_Two_Values("Կարգ",Get_Rekvizit_Value("Document",5,"General","PRIOR"),foreignExchange.priority)
    'Բանկային առաջնություն դաշտի ստուգում
    Call Compare_Two_Values("Բանկային առաջնություն",Get_Rekvizit_Value("Document",5,"General","BANKPRIOR"),foreignExchange.bankPriority)     
    'Մարման Ամսաթիվ դաշտի ստուգում
    Call Compare_Two_Values("Մարման Ամսաթիվ",Get_Rekvizit_Value("Document",5,"General","QDATE"),foreignExchange.repaymentDate)    
    
    '6 Tab Լրացուցիչ ինֆորմացիա
    Call GoTo_ChoosedTab(6) 
    'Կապի տվյալներ դաշտի ստուգում
    Call Compare_Two_Values("Կապի տվյալներ",Get_Rekvizit_Value("Document",6,"Comment","CONTACT"),foreignExchange.contInfo)   
    'Դիլինգի եղանակ դաշտի ստուգում
    Call Compare_Two_Values("Դիլինգի եղանակ",Get_Rekvizit_Value("Document",6,"Mask","DEALMETH"),foreignExchange.dealMethod)
    'Դիլինգի եղանակ(լրացուցիչ) դաշտի ստուգում
    Call Compare_Two_Values("Դիլինգի եղանակ(լրացուցիչ)",Get_Rekvizit_Value("Document",6,"General","DEALADD"),foreignExchange.dealMethodAdd)
    'Առաջին դիլինգային կազմ. տվ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Առաջին դիլինգային կազմ. տվ. տիպ",Get_Rekvizit_Value("Document",6,"Mask","DEALAOP"),foreignExchange.dataTypeDealingPartyA)
    'Առաջին դիլինգային կազմ. հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Առաջին դիլինգային կազմ. հաշիվ",Get_Rekvizit_Value("Document",6,"Comment","DEALAID"),foreignExchange.PIDDealingPartyA)    
    'Առաջին դիլինգային կազմ. դաշտի ստուգում
    Call Compare_Two_Values("Առաջին դիլինգային կազմ.",Get_Rekvizit_Value("Document",6,"Comment","DEALA"),foreignExchange.dealingPartyA)
    'Երկրորդ դիլինգային կազմ. տվ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Երկրորդ դիլինգային կազմ. տվ. տիպ",Get_Rekvizit_Value("Document",6,"Mask","DEALBOP"),foreignExchange.dataTypeDealingPartyB)
    'Երկրորդ դիլինգային կազմ. հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Երկրորդ դիլինգային կազմ. հաշիվ",Get_Rekvizit_Value("Document",6,"Comment","DEALBID"),foreignExchange.PIDDealingPartyB)    
    'Երկրորդ դիլինգային կազմ. դաշտի ստուգում
    Call Compare_Two_Values("Երկրորդ դիլինգային կազմ.",Get_Rekvizit_Value("Document",6,"Comment","DEALB"),foreignExchange.dealingPartyB)    
    'Բրոքերի տվ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Բրոքերի տվ. տիպ",Get_Rekvizit_Value("Document",6,"Mask","BROKEROP"),foreignExchange.dataTypeBrok)
    'Բրոքերի հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Բրոքերի հաշիվ",Get_Rekvizit_Value("Document",6,"Comment","BROKERID"),foreignExchange.PIDBrok)    
    'Բրոքեր դաշտի ստուգում
    Call Compare_Two_Values("Բրոքեր",Get_Rekvizit_Value("Document",6,"Comment","BROKER"),foreignExchange.broker) 
    'Բրոքերի միջնորդավճարի արժույթ դաշտի ստուգում
    Call Compare_Two_Values("Բրոքերի միջնորդավճարի արժույթ",Get_Rekvizit_Value("Document",6,"Mask","BRCHGCUR"),foreignExchange.brokerComissionCur)
    'Բրոքերի միջնորդավճար դաշտի ստուգում
    Call Compare_Two_Values("Բրոքերի միջնորդավճար",Get_Rekvizit_Value("Document",6,"General","BRCHGSUM"),foreignExchange.brokerComission)
    
    '7 Tab Տարրալուծում
    Call GoTo_ChoosedTab(7)
    'Քանակ դաշտի ստուգում
    Call Compare_Two_Values("Քանակ",Get_Rekvizit_Value("Document",7,"General","COUNT"),foreignExchange.splitCount)        
    For i = 0 to foreignExchange.splitCount -1
        'Առք/Վաճառք սյան ստուգում
        Call Check_Value_Grid (0 ,i, "Document", 7, foreignExchange.splitPurSale(i))
        'Արժույթ (Առք) սյան ստուգում
        Call Check_Value_Grid (1 ,i, "Document", 7, foreignExchange.splitCurB(i))
        'Գումար (Առք) սյան ստուգում
        Call Check_Value_Grid (2 ,i, "Document", 7, foreignExchange.splitSumB(i))
        'Առաքման գործակալի տվ. սյան ստուգում
        Call Check_Value_Grid (3 ,i, "Document", 7, foreignExchange.splitDataTypeDelAgent(i))
        'Առաքման գործակալի Հաշիվ սյան ստուգում
        Call Check_Value_Grid (4 ,i, "Document", 7, foreignExchange.splitPIDDelAgent(i))
        'Առաքման գործակալ սյան ստուգում
        Call Check_Value_Grid (5 ,i, "Document", 7, foreignExchange.splitDelAgent(i)) 
        'Միջնորդ բանկի տվ.տիպ սյան ստուգում
        Call Check_Value_Grid (6 ,i, "Document", 7, foreignExchange.splitTypeOfInterm(i)) 
        'Միջնորդ բանկի Հաշիվ սյան ստուգում
        Call Check_Value_Grid (7 ,i, "Document", 7, foreignExchange.splitPIDIntermInst(i))         
        'Միջնորդ բանկ սյան ստուգում
        Call Check_Value_Grid (8 ,i, "Document", 7, foreignExchange.splitIntermInst(i))           
        'Ստացող գործակալի տվ. տիպ սյան ստուգում
        Call Check_Value_Grid (9 ,i, "Document", 7, foreignExchange.splitDataTypeRecAgent(i))        
        'Ստացող գործակալի Հաշիվ սյան ստուգում
        Call Check_Value_Grid (10 ,i, "Document", 7, foreignExchange.splitPIDRecAgent(i))          
        'Ստացող գործակալ սյան ստուգում
        Call Check_Value_Grid (11 ,i, "Document", 7, foreignExchange.splitRecAgent(i))
        'Շահառու կազմակերպության տվ. տիպ սյան ստուգում
        Call Check_Value_Grid (12 ,i, "Document", 7, foreignExchange.splitDataTypeBenInst(i))                  
        'Շահառու կազմակերպության հաշիվ սյան ստուգում
        Call Check_Value_Grid (13 ,i, "Document", 7, foreignExchange.splitPIDBenInst(i))              
        'Շահառու կազմակերպություն սյան ստուգում
        Call Check_Value_Grid (14 ,i, "Document", 7, foreignExchange.splitBenInst(i))                       
    Next
    
    '8 Tab Հետառևտրային իրադարձություններ
    Call GoTo_ChoosedTab(8)
    'Իրադարձության տեսակ դաշտի ստուգում
    Call Compare_Two_Values("Իրադարձության տեսակ",Get_Rekvizit_Value("Document",8,"Mask","EVNTTYPE"),foreignExchange.eventType)       
    'Իրադարձության հղում դաշտի ստուգում
    Call Compare_Two_Values("Իրադարձության հղում",Get_Rekvizit_Value("Document",8,"General","EVNTREF"),foreignExchange.eventReference)    
    'Հղում(21F) դաշտի ստուգում
    Call Compare_Two_Values("Հղում(21F)",Get_Rekvizit_Value("Document",8,"General","ULREF"),foreignExchange.eventReference21F) 
    'Շահույթի և վնասի հաշվարկի ամսաթիվ դաշտի ստուգում
    Call Compare_Two_Values("Շահույթի և վնասի հաշվարկի ամսաթիվ",Get_Rekvizit_Value("Document",8,"General","SETTDATE"),foreignExchange.profLossSettDate)     
    'Վճարվելիք արժույթ դաշտի ստուգում
    Call Compare_Two_Values("Վճարվելիք արժույթ",Get_Rekvizit_Value("Document",8,"Mask","SETCUR"),foreignExchange.currToBeSettled)    
    'Վճարվելիք գումար դաշտի ստուգում
    Call Compare_Two_Values("Վճարվելիք գումար",Get_Rekvizit_Value("Document",8,"General","SETSUMMA"),foreignExchange.sumToBeSetelled)      
    'Հարկի արժույթ դաշտի ստուգում
    Call Compare_Two_Values("Հարկի արժույթ",Get_Rekvizit_Value("Document",8,"Mask","TAXCUR"),foreignExchange.reportCur)    
    'Հարկի գումար դաշտի ստուգում
    Call Compare_Two_Values("Հարկի գումար",Get_Rekvizit_Value("Document",8,"General","TAXSUMMA"),foreignExchange.taxSum)       
End Sub

'Անհատական հաղրոդագրություն (SWIFT) կլասս
Class proprietaryMessage
    Public isn
    Public category
    Public docN
    Public messageType
    Public descript
    Public subMessage
    Public key
    '2
    Public sendRec
    Public pack
    Public fileName
    Public dirName
    Public sendRecDate
    Public trailer
    Public prior
    Public bankPrior
    
    Private Sub Class_Initialize
        '1
        category = ""
        docN = ""
        messageType = ""
        descript = ""
        subMessage = ""
        key = ""
        '2
        sendRec = ""
        pack = ""
        fileName = ""
        dirName = ""
        sendRecDate = "  /  /  "
        trailer = ""        
        prior = ""
        bankPrior = ""
    End Sub 
End Class

Function New_Proprietary_Message()
    Set New_Proprietary_Message = New proprietaryMessage
End Function

'Անհատական հաղորդագրություն (SWIFT) փաստաթղթի դաշտերը ստուգող ֆունկցիա
Sub Personal_Message_Window_Check (proprietaryMessage)
    '1 Tab Ընդհանուր
    Call GoTo_ChoosedTab(1)
    proprietaryMessage.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Կատեգորիա դաշտի ստուգում
    Call Compare_Two_Values("Կատեգորիա",Get_Rekvizit_Value("Document",1,"Mask","CATEGORY"),proprietaryMessage.category)       
    'Փաստաթղթի N (Էլեկտր.) դաշտի ստուգում
    Call Compare_Two_Values("Փաստաթղթի N (Էլեկտր.)",Get_Rekvizit_Value("Document",1,"General","BMDOCNUM"),proprietaryMessage.docN)
    'Հաղորդագրության տեսակը դաշտի ստուգում
    Call Compare_Two_Values("Հաղորդագրության տեսակը",Get_Rekvizit_Value("Document",1,"Mask","TYPE"),proprietaryMessage.messageType)
    'Նկարագրություն դաշտի ստուգում
    Call Compare_Two_Values("Նկարագրություն",Get_Rekvizit_Value("Document",1,"General","AIM"),proprietaryMessage.descript)
    'Ենթահաղորդագրություն դաշտի ստուգում
    Call Compare_Two_Values("Ենթահաղորդագրություն",Get_Rekvizit_Value("Document",1,"General","ORGMSG"),proprietaryMessage.subMessage)
    'Բանալի(TELEX) դաշտի ստուգում
    Call Compare_Two_Values("Բանալի(TELEX)",Get_Rekvizit_Value("Document",1,"General","TXKEY"),proprietaryMessage.key) 
    
    '2 Tab Լրացուցիչ
    Call GoTo_ChoosedTab(2)
    'Ուղարկող/Ստացող դաշտի ստուգում
    Call Compare_Two_Values("Ուղարկող/Ստացող",Get_Rekvizit_Value("Document",2,"Comment","SNDREC"),proprietaryMessage.sendRec)
    'Փաթեթի համարը դաշտի ստուգում
    Call Compare_Two_Values("Փաթեթի համարը",Get_Rekvizit_Value("Document",2,"Comment","PACK"),proprietaryMessage.pack)
    'Ֆայլի անուն դաշտի ստուգում
    Call Compare_Two_Values("Ֆայլի անունը",Get_Rekvizit_Value("Document",2,"General","BMNAME"),proprietaryMessage.fileName)
    'Դիրեկտորիայի անունը դաշտի ստուգում
    Call Compare_Two_Values("Դիրեկտորիայի անունը",Get_Rekvizit_Value("Document",2,"General","BMDIRECT"),proprietaryMessage.dirName)
    'Ամսաթիվ(Ուղարկաման/Ստացման) դաշտի ստուգում
    Call Compare_Two_Values("Ամսաթիվ(Ուղարկաման/Ստացման)",Get_Rekvizit_Value("Document",2,"General","BMIODATE"),proprietaryMessage.sendRecDate)
    'Վերջնահատված դաշտի ստուգում
    Call Compare_Two_Values("Վերջնահատված",Get_Rekvizit_Value("Document",2,"General","TRAILER"),proprietaryMessage.trailer)
    'Կարգ դաշտի ստուգում
    Call Compare_Two_Values("Կարգ",Get_Rekvizit_Value("Document",2,"General","PRIOR"),proprietaryMessage.prior)    
    'Բանկային առաջնություն դաշտի ստուգում
    Call Compare_Two_Values("Բանկային առաջնություն",Get_Rekvizit_Value("Document",2,"General","BANKPRIOR"),proprietaryMessage.bankPrior)                        
End Sub

'------------------------------------------------------------------------------
'Միջբանկային փոխանցում (SWIFT202) (Interbank Transfer) փաստաթղթի Class
'------------------------------------------------------------------------------
Class interbankTransfer_import_common
    Public isn
    Public div
    Public dep
    Public uniqueETETransRef
    Public serviceTypeID
    Public msgType
    Public docN
    Public reference
    Public date
    Public accWithInstType
    Public accWithInstPID
    Public accWithInst
    Public benClientType
    Public benClientAcc
    Public benClient
    Public sum
    Public cur
    Public key
    Public tabN
    Public check
    
     Private Sub Class_Initialize
        isn = ""
        div = ""
        dep = ""
        uniqueETETransRef = ""
        serviceTypeID = ""
        msgType = ""
        docN = ""
        reference = ""
        date = "  /  /  "
        accWithInstType = ""
        accWithInstPID = ""
        accWithInst = ""
        benClientType = ""
        benClientAcc = ""
        benClient = ""
        sum = "0.00"
        cur = ""
        key = ""
        tabN = 1
        check = True
    End Sub    
End Class

Function New_interbankTransfer_import_common()
    Set New_interbankTransfer_import_common = new interbankTransfer_import_common
End Function

Class interbankTransfer_import_add
    Public packNum
    Public addInfo
    Public fileName
    Public dirName
    Public sendRecDate
    Public repaymentDate
    Public sanctScreenInfo
    Public trailer
    Public prior
    Public accServBankRef
    Public bankPrior
    Public tabN
    Public check
    
    Private Sub Class_Initialize
        packNum = ""
        addInfo = ""
        fileName = ""
        dirName = ""
        sendRecDate = "  /  /  "
        repaymentDate = "  /  /  "
        sanctScreenInfo = ""
        trailer = ""
        prior = ""
        accServBankRef = ""
        bankPrior = ""
        tabN = 2
        check = True
    End Sub    
End Class

Function New_interbankTransfer_import_add()
    Set New_interbankTransfer_import_add = new interbankTransfer_import_add
End Function

Class interbankTransfer_import_finOrg
    Public sendRec
    Public ordInstType
    Public ordInstPID
    Public ordInst
    Public sendCorrType
    Public sendCorrPID
    Public sendCorr
    Public recCorrType
    Public recCorrPID
    Public recCorr
    Public intInstType
    Public intInstPID
    Public intInst
    Public tabN
    Public check  
      
    Private Sub Class_Initialize
        sendRec = ""
        ordInstType = ""
        ordInstPID = ""
        ordInst = ""
        sendCorrType = ""
        sendCorrPID = ""
        sendCorr = ""
        recCorrType = ""
        recCorrPID = ""
        recCorr = ""
        intInstType = ""
        intInstPID = ""
        intInst = ""
        tabN = 3
        check = True
    End Sub    
End Class

Function New_interbankTransfer_import_finOrg()
    Set New_interbankTransfer_import_finOrg = new interbankTransfer_import_finOrg
End Function

Class interbankTransfer_import_preTransfer
    Public ordClientType
    Public ordClientAcc
    Public ordClient
    Public ordInstType
    Public ordInstPID
    Public ordInst
    Public intInstType
    Public intInstPID
    Public intInst
    Public accWithInstType
    Public accWithInstPID
    Public accWithInst
    Public benClientType
    Public benClientAcc
    Public benClient
    Public remitInfo
    Public sendToRecInfo
    Public instructedCur
    Public instructedSum
    Public tabN
    Public check
        
    Private Sub Class_Initialize
        ordClientType = ""
        ordClientAcc = ""
        ordClient = ""
        ordInstType = ""
        ordInstPID = ""
        ordInst = ""
        intInstType = ""
        intInstPID = ""
        intInst = ""
        accWithInstType = ""
        accWithInstPID = ""
        accWithInst = ""
        benClientType = ""
        benClientAcc = ""
        benClient = ""
        remitInfo = ""
        sendToRecInfo = ""
        instructedCur = ""
        instructedSum = "0.00"
        tabN = 4
        check = True
    End Sub    
End Class

Function New_interbankTransfer_import_preTransfer()
    Set New_interbankTransfer_import_preTransfer = new interbankTransfer_import_preTransfer
End Function

Class interbankTransfer_import
    Public common
    Public add
    Public finOrg
    Public preTransfer
        
    Private Sub Class_Initialize
        Set common = New_interbankTransfer_import_common()
        Set add = New_interbankTransfer_import_add()
        Set finOrg = New_interbankTransfer_import_finOrg()
        Set preTransfer = New_interbankTransfer_import_preTransfer()
        Set attach = New_Attached_Tab(fCount, lCount, dCount)
        attach.tabN = 5
    End Sub
End Class

Function New_InterBank_Transfer()
    Set New_InterBank_Transfer = New interbankTransfer_import
End Function

'Միջբանկային փոխանցում փաստաթղթի պատուհանի դաշտերը ստուգող ֆունկցիա
Sub InterBank_Transfer_Check (interBankTrans)
    
    'Վերցնում է փաստաթղթի isn-ը
    interBankTrans.common.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
    '1 Tab Ընդհանուր
    If interBankTrans.common.check Then
        Call GoTo_ChoosedTab(interBankTrans.common.tabN)
        'Գրասենյակ դաշտի ստուգում 
        Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"Mask","ACSBRANCH"),interBankTrans.common.div) 
        'Բաժին դաշտի ստուգում 
        Call Compare_Two_Values("Բաժին",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"Mask","ACSDEPART"),interBankTrans.common.dep)
        'Հաղորդագրության միարժեք համար դաշտի ստուգում
        Call Compare_Two_Values("Հաղորդագրության միարժեք համար",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"General","UETR"),interBankTrans.common.uniqueETETransRef)    
        'Ծառայության տեսակ դաշտի ստուգում
        Call Compare_Two_Values("Ծառայության տեսակ",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"Mask","STID"),interBankTrans.common.serviceTypeID)
        'Հաղ.տիպ դաշտի ստուգում
        Call Compare_Two_Values("Հաղ.տիպ",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"Mask","MT"),interBankTrans.common.msgType)        
        'Փաստաթղթի N դաշտի ստուգում
        Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"General","BMDOCNUM"),interBankTrans.common.docN)
        'Հղում դաշտի ստուգում
        Call Compare_Two_Values("Հղում",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"General","REF"),interBankTrans.common.reference)
        'Ամսաթիվ դաշտի ստուգում
        Call Compare_Two_Values("Ամսաթիվ",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"General","DATE"),interBankTrans.common.date)
        'Ստացող կազմակերպ. տվ. տիպ դաշտի ստուգում
        Call Compare_Two_Values("Ստացող կազմակերպ. տվ. տիպ",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"Mask","RINSTOP"),interBankTrans.common.accWithInstType)
        'Ստացող կազմակերպ. հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Ստացող կազմակերպ. հաշիվ",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"Comment","RINSTID"),interBankTrans.common.accWithInstPID)
        'Ստացող կազմակերպ. դաշտի ստուգում
        Call Compare_Two_Values("Ստացող կազմակերպ.",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"Comment","RECINST"),interBankTrans.common.accWithInst)
        'Ստացողի տվ. տիպ դաշտի ստուգում
        Call Compare_Two_Values("Ստացողի տվ. տիպ",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"Mask","RECOP"),interBankTrans.common.benClientType)
        'Ստացողի հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Ստացողի հաշիվ",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"Comment","ACCCR"),interBankTrans.common.benClientAcc)
        'Ստացող դաշտի ստուգում
        Call Compare_Two_Values("Ստացող",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"Comment","RECEIVER"),interBankTrans.common.benClient)
        'Գումար դաշտի ստուգում
        Call Compare_Two_Values("Գումար",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"General","SUMMA"),interBankTrans.common.sum)
        'Արժույթ դաշտի ստուգում
        Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"Mask","CUR"),interBankTrans.common.cur)    
        'Բանալի(TELEX) դաշտի ստուգում
        Call Compare_Two_Values("Բանալի(TELEX)",Get_Rekvizit_Value("Document",interBankTrans.common.tabN,"General","TXKEY"),interBankTrans.common.key)    
    End If
    '2 Tab Լրացուցիչ
    If interBankTrans.add.check Then
        Call GoTo_ChoosedTab(interBankTrans.add.tabN)
        'Փաթեթի համար դաշտի ստուգում 
        Call Compare_Two_Values("Փաթեթի համար",Get_Rekvizit_Value("Document",interBankTrans.add.tabN,"Comment","PACK"),interBankTrans.add.packNum)
        'Լրացուցիչ ինֆորմացիա դաշտի ստուգում 
        Call Compare_Two_Values("Լրացուցիչ ինֆորմացիա",Get_Rekvizit_Value("Document",interBankTrans.add.tabN,"Comment","ADDINFO"),interBankTrans.add.addInfo)         
        'Ֆայլի անուն դաշտի ստուգում 
        Call Compare_Two_Values("Ֆայլի անուն",Get_Rekvizit_Value("Document",interBankTrans.add.tabN,"General","BMNAME"),interBankTrans.add.fileName) 
        'Դիրեկտորիայի անուն դաշտի ստուգում 
        Call Compare_Two_Values("Դիրեկտորիայի անուն",Get_Rekvizit_Value("Document",interBankTrans.add.tabN,"General","BMDIRECT"),interBankTrans.add.dirName)       
        'Ամսաթիվ (Ուղարկման/ստացման) դաշտի ստուգում 
        Call Compare_Two_Values("Ամսաթիվ (Ուղարկման/ստացման)",Get_Rekvizit_Value("Document",interBankTrans.add.tabN,"General","BMIODATE"),interBankTrans.add.sendRecDate)           
        'Մարման ամսաթիվ դաշտի ստուգում 
        Call Compare_Two_Values("Մարման ամսաթիվ",Get_Rekvizit_Value("Document",interBankTrans.add.tabN,"General","QDATE"),interBankTrans.add.repaymentDate)
        'Sanctions Screening համակ. ինֆորմացիա դաշտի ստուգում
        Call Compare_Two_Values("Sanctions Screening համակ. ինֆորմացիա դաշտի ստուգում",Get_Rekvizit_Value("Document",interBankTrans.add.tabN,"General","SSINFO"),interBankTrans.add.sanctScreenInfo)
        'Վերջնահատված դաշտի ստուգում 
        Call Compare_Two_Values("Վերջնահատված",Get_Rekvizit_Value("Document",interBankTrans.add.tabN,"General","TRAILER"),interBankTrans.add.trailer)            
        'Կարգ դաշտի ստուգում 
        Call Compare_Two_Values("Կարգ",Get_Rekvizit_Value("Document",interBankTrans.add.tabN,"General","PRIOR"),interBankTrans.add.prior)    
        'Հաշիվը սպասարկող բանկի հղում դաշտի ստուգում 
        Call Compare_Two_Values("Հաշիվը սպասարկող բանկի հղում",Get_Rekvizit_Value("Document",interBankTrans.add.tabN,"General","ABANKREF"),interBankTrans.add.accServBankRef)
        'Բանկային առաջնություն դաշտի ստուգում 
        Call Compare_Two_Values("Բանկային առաջնություն",Get_Rekvizit_Value("Document",interBankTrans.add.tabN,"General","BANKPRIOR"),interBankTrans.add.bankPrior )          
    End If
    '3 Tab Ֆին. կազմակերպ.
    If interBankTrans.finOrg.check Then
        Call GoTo_ChoosedTab(interBankTrans.finOrg.tabN)
        'Ուղարկող/ստացող դաշտի ստուգում 
        Call Compare_Two_Values("Ուղարկող/ստացող",Get_Rekvizit_Value("Document",interBankTrans.finOrg.tabN,"Comment","SNDREC"),interBankTrans.finOrg.sendRec)
        'Վճարող կազմակերպ. տվ. տիպ դաշտի ստուգում
        Call Compare_Two_Values("Վճարող կազմակերպ. տվ. տիպ",Get_Rekvizit_Value("Document",interBankTrans.finOrg.tabN,"Mask","PINSTOP"),interBankTrans.finOrg.ordInstType)
        'Վճարող կազմակերպ. հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Վճարող կազմակերպ. հաշիվ",Get_Rekvizit_Value("Document",interBankTrans.finOrg.tabN,"Comment","PINSTID"),interBankTrans.finOrg.ordInstPID)
        'Վճարող կազմակերպ. դաշտի ստուգում
        Call Compare_Two_Values("Վճարող կազմակերպ.",Get_Rekvizit_Value("Document",interBankTrans.finOrg.tabN,"Comment","PAYINST"),interBankTrans.finOrg.ordInst)
        'Վճարող բանկի թղթակցի տվ. տիպ դաշտի ստուգում
        Call Compare_Two_Values("Վճարող բանկի թղթակցի տվ. տիպ",Get_Rekvizit_Value("Document",interBankTrans.finOrg.tabN,"Mask","PCOROP"),interBankTrans.finOrg.sendCorrType)
        'Վճարող բանկի թղթակցի հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Վճարող բանկի թղթակցի հաշիվ",Get_Rekvizit_Value("Document",interBankTrans.finOrg.tabN,"Comment","PCORID"),interBankTrans.finOrg.sendCorrPID)
        'Վճարող բանկի թղթակից դաշտի ստուգում
        Call Compare_Two_Values("Վճարող բանկի թղթակից",Get_Rekvizit_Value("Document",interBankTrans.finOrg.tabN,"Comment","PCORBANK"),interBankTrans.finOrg.sendCorr)
        'Ստացող բանկի թղթակցի տվ. տիպ դաշտի ստուգում
        Call Compare_Two_Values("Ստացող բանկի թղթակցի տվ. տիպ",Get_Rekvizit_Value("Document",interBankTrans.finOrg.tabN,"Mask","RCOROP"),interBankTrans.finOrg.recCorrType)
        'Ստացող բանկի թղթակցի հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Ստացող բանկի թղթակցի հաշիվ",Get_Rekvizit_Value("Document",interBankTrans.finOrg.tabN,"Comment","RCORID"),interBankTrans.finOrg.recCorrPID)
        'Ստացող բանկի թղթակից դաշտի ստուգում
        Call Compare_Two_Values("Ստացող բանկի թղթակից",Get_Rekvizit_Value("Document",interBankTrans.finOrg.tabN,"Comment","RCORBANK"),interBankTrans.finOrg.recCorr)
        'Միջնորդ բանկի տվ. տիպ դաշտի ստուգում
        Call Compare_Two_Values("Միջնորդ բանկի տվ. տիպ",Get_Rekvizit_Value("Document",interBankTrans.finOrg.tabN,"Mask","PCOROP"),interBankTrans.finOrg.intInstType)
        'Միջնորդ բանկի հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Միջնորդ բանկի հաշիվ",Get_Rekvizit_Value("Document",interBankTrans.finOrg.tabN,"Comment","PCORID"),interBankTrans.finOrg.intInstPID)
        'Միջնորդ բանկ դաշտի ստուգում
        Call Compare_Two_Values("Միջնորդ բանկ",Get_Rekvizit_Value("Document",interBankTrans.finOrg.tabN,"Comment","PCORBANK"),interBankTrans.finOrg.intInst)
    End If        
    '4 Tab Նախնական փոխանցման տվյալներ
    If interBankTrans.preTransfer.check Then
        Call GoTo_ChoosedTab(interBankTrans.preTransfer.tabN)
        'Վճարողի տվ. տիպ դաշտի ստուգում
        Call Compare_Two_Values("Վճարողի տվ. տիպ",Get_Rekvizit_Value("Document",4,"Mask","ORGPAYOP"),interBankTrans.preTransfer.ordClientType)
        'Վճարողի հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Վճարողի հաշիվ",Get_Rekvizit_Value("Document",4,"Comment","ORGPAYID"),interBankTrans.preTransfer.ordClientAcc)
        'Վճարող դաշտի ստուգում
        Call Compare_Two_Values("Վճարող",Get_Rekvizit_Value("Document",4,"Comment","ORGPAYER"),interBankTrans.preTransfer.ordClient) 
        'Վճարող կազմակերպ. տվ. տիպ դաշտի ստուգում
        Call Compare_Two_Values("Վճարող կազմակերպ. տվ. տիպ",Get_Rekvizit_Value("Document",4,"Mask","ORGPINSTOP"),interBankTrans.preTransfer.ordInstType)
        'Վճարող կազմակերպ. հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Վճարող կազմակերպ. հաշիվ",Get_Rekvizit_Value("Document",4,"Comment","ORGPINSTID"),interBankTrans.preTransfer.ordInstPID)
        'Վճարող կազմակերպ. դաշտի ստուգում
        Call Compare_Two_Values("Վճարող կազմակերպ.",Get_Rekvizit_Value("Document",4,"Comment","ORGPAYINST"),interBankTrans.preTransfer.ordInst)       
        'Միջնորդ բանկի տվ. տիպ դաշտի ստուգում
        Call Compare_Two_Values("Միջնորդ բանկի տվ. տիպ",Get_Rekvizit_Value("Document",4,"Mask","ORGMEDOP"),interBankTrans.preTransfer.intInstType)
        'Միջնորդ բանկի հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Միջնորդ բանկի հաշիվ",Get_Rekvizit_Value("Document",4,"Comment","ORGMEDID"),interBankTrans.preTransfer.intInstPID)
        'Միջնորդ բանկ դաշտի ստուգում
        Call Compare_Two_Values("Միջնորդ բանկ",Get_Rekvizit_Value("Document",4,"Comment","ORGMEDBANK"),interBankTrans.preTransfer.intInst)
        'Ստացող կազմակերպ. տվ. տիպ դաշտի ստուգում
        Call Compare_Two_Values("Ստացող կազմակերպ. տվ. տիպ",Get_Rekvizit_Value("Document",4,"Mask","ORGRINSTOP"),interBankTrans.preTransfer.accWithInstType)
        'Ստացող կազմակերպ. հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Ստացող կազմակերպ. հաշիվ",Get_Rekvizit_Value("Document",4,"Comment","ORGRINSTID"),interBankTrans.preTransfer.accWithInstPID)
        'Ստացող կազմակերպ. դաշտի ստուգում
        Call Compare_Two_Values("Ստացող կազմակերպ.",Get_Rekvizit_Value("Document",4,"Comment","ORGRECINST"),interBankTrans.preTransfer.accWithInst)
        'Ստացողի տվ. տիպ դաշտի ստուգում
        Call Compare_Two_Values("Ստացողի տվ. տիպ",Get_Rekvizit_Value("Document",4,"Mask","ORGRECOP"),interBankTrans.preTransfer.benClientType)
        'Ստացողի հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Ստացողի հաշիվ",Get_Rekvizit_Value("Document",4,"Comment","ORGRECID"),interBankTrans.preTransfer.benClientAcc)
        'Ստացող դաշտի ստուգում
        Call Compare_Two_Values("Ստացող",Get_Rekvizit_Value("Document",4,"Comment","ORGRECEIVER"),interBankTrans.preTransfer.benClient)
        'Նպատակ դաշտի ստուգում
        Call Compare_Two_Values("Նպատակ",Get_Rekvizit_Value("Document",4,"Comment","ORGAIM"),interBankTrans.preTransfer.remitInfo)
        'Լրացուցիչ ինֆորմացիա դաշտի ստուգում
        Call Compare_Two_Values("Լրացուցիչ ինֆորմացիա",Get_Rekvizit_Value("Document",4,"Comment","ORGADDINFO"),interBankTrans.preTransfer.sendToRecInfo)       
        'Հանձնարարված արժույթ դաշտի ստուգում
        Call Compare_Two_Values("Հանձնարարված արժույթ",Get_Rekvizit_Value("Document",4,"Comment","ORGREALCUR"),interBankTrans.preTransfer.instructedCur)         
        'Հանձնարարված գումար դաշտի ստուգում
        Call Compare_Two_Values("Հանձնարարված գումար",Get_Rekvizit_Value("Document",4,"General","ORGREALSUM"),interBankTrans.preTransfer.instructedSum)
    End If      
End Sub

'-------------------------------------------------
'Ստուգում է "Հաստատում" բացված պատուհանի արժեքները
'-------------------------------------------------
Sub Check_Confirmation(Confirmation)
    Dim TabN:TabN = 1
    'Վերցնում է փաստաթղթի isn-ը
    Confirmation.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Ստուգում է "Հաղ.տիպ" դաշտի արժեքը
    Call Compare_Two_Values("Հաղ.տիպ",Get_Rekvizit_Value("Document",TabN,"Mask","MT"),Confirmation.MsgType) 
    'Ստուգում է "Փաստաթղթի N" դաշտի արժեքը
    Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",TabN,"General","BMDOCNUM"),Confirmation.NumberOfDocument)
    'Ստուգում է "Հղում" դաշտի արժեքը
    Call Compare_Two_Values("Հղում",Get_Rekvizit_Value("Document",TabN,"General","REFERENCE"),Confirmation.Reference)   
    'Ստուգում է "Հաշվի նույնակ.տվ.տիպ" դաշտի արժեքը
    Call Compare_Two_Values("Հաշվի նույնակ.տվ.տիպ",Get_Rekvizit_Value("Document",TabN,"Comment","ACCOP"),Confirmation.TypeOfAccountId) 
    'Ստուգում է "Հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Հաշիվ",Get_Rekvizit_Value("Document",TabN,"General","ACC"),Confirmation.Account)
    'Ստուգում է "Հաշվի նույնականացուցիչ" դաշտի արժեքը
    Call Compare_Two_Values("Հաշվի նույնականացուցիչ",Get_Rekvizit_Value("Document",TabN,"Comment","ACCID"),Confirmation.AccountIdentifier)
    'Ստուգում է "Ամսաթիվ" դաշտի արժեքը
    Call Compare_Two_Values("Ամսաթիվ",Get_Rekvizit_Value("Document",TabN,"General","DATE"),Confirmation.Date)
    'Ստուգում է "Արժույթ" դաշտի արժեքը
    Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",TabN,"Mask","CUR"),Confirmation.Curr)
    'Ստուգում է "Գումար" դաշտի արժեքը
    Call Compare_Two_Values("Գումար",Get_Rekvizit_Value("Document",TabN,"General","SUMMA"),Confirmation.Amount)
    'Ստուգում է "Վճարողի տվ. տիպ" դաշտի արժեքը
    Call Compare_Two_Values("Վճարողի տվ. տիպ",Get_Rekvizit_Value("Document",TabN,"Mask","PAYOP"),Confirmation.TypeOfOrderingClient)
    'Ստուգում է "Վճարողի հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Վճարողի հաշիվ",Get_Rekvizit_Value("Document",TabN,"Comment","ACCDB"),Confirmation.AccountOfOrderingClient)
    'Ստուգում է "Վճարող" դաշտի արժեքը
    Call Compare_Two_Values("Վճարող",Get_Rekvizit_Value("Document",TabN,"Comment","PAYER"),Confirmation.OrderingClient)
    'Ստուգում է "Վճարող կազմակերպ.տվ.տիպ" դաշտի արժեքը
    Call Compare_Two_Values("Վճարող կազմակերպ.տվ.տիպ",Get_Rekvizit_Value("Document",TabN,"Mask","PINSTOP"),Confirmation.TypeOfOrderingInstitution) 
    'Ստուգում է "Վճարող կազմակերպ.հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Վճարող կազմակերպ.հաշիվ",Get_Rekvizit_Value("Document",TabN,"Comment","PINSTID"),Confirmation.PIDofOrderingInstitution) 
    'Ստուգում է "Վճարող կազմակերպ." դաշտի արժեքը
    Call Compare_Two_Values("Վճարող կազմակերպ.",Get_Rekvizit_Value("Document",TabN,"Comment","PAYINST"),Confirmation.OrderingInstitution) 
    'Ստուգում է "Միջնորդ բանկի տվ.տիպ" դաշտի արժեքը
    Call Compare_Two_Values("Միջնորդ բանկի տվ.տիպ",Get_Rekvizit_Value("Document",TabN,"Mask","MEDOP"),Confirmation.TypeOfIntermediaryInstitution) 
    'Ստուգում է "Միջնորդ բանկի հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Միջնորդ բանկի հաշիվ",Get_Rekvizit_Value("Document",TabN,"General","MEDID"),Confirmation.PIDofIntermediaryInstitution) 
    'Ստուգում է "Միջնորդ բանկ" դաշտի արժեքը
    Call Compare_Two_Values("Միջնորդ բանկ",Get_Rekvizit_Value("Document",TabN,"Comment","MEDBANK"),Confirmation.IntermediaryInstitution) 
    'Ստուգում է "Լրացուցիչ ինֆորմացիա" դաշտի արժեքը
    Call Compare_Two_Values("Լրացուցիչ ինֆորմացիա",Get_Rekvizit_Value("Document",TabN,"Comment","ADDINFO"),Confirmation.SenderToReceiverInformation)   
    'Ստուգում է "Բանալի" դաշտի արժեքը
    Call Compare_Two_Values("Բանալի",Get_Rekvizit_Value("Document",TabN,"General","TXKEY"),Confirmation.Key)   
    
    TabN = 2
    'Ստուգում է "Ուղարկող/Ստացող" դաշտի արժեքը
    Call Compare_Two_Values("Ուղարկող/Ստացող",Get_Rekvizit_Value("Document",TabN,"Comment","SNDREC"),Confirmation.SenderReceiver) 
    'Ստուգում է "Փաթեթի համարը" դաշտի արժեքը
    Call Compare_Two_Values("Փաթեթի համարը",Get_Rekvizit_Value("Document",TabN,"Comment","PACK"),Confirmation.PacketNumber)   
    'Ստուգում է "Ֆայլի անուն" դաշտի արժեքը
    Call Compare_Two_Values("Ֆայլի անուն",Get_Rekvizit_Value("Document",TabN,"General","BMNAME"),Confirmation.FileName)   
    'Ստուգում է "Դիրեկտորիայի անուն" դաշտի արժեքը
    Call Compare_Two_Values("Դիրեկտորիայի անուն",Get_Rekvizit_Value("Document",TabN,"General","BMDIRECT"),Confirmation.DirectoryName)   
    'Ստուգում է "Ամսաթիվ(Ուղարկման/Ստացման)" դաշտի արժեքը
    Call Compare_Two_Values("Ամսաթիվ(Ուղարկման/Ստացման)",Get_Rekvizit_Value("Document",TabN,"General","BMIODATE"),Confirmation.DateSend)
    'Ստուգում է "Վերջնահատված" դաշտի արժեքը
    Call Compare_Two_Values("Վերջնահատված",Get_Rekvizit_Value("Document",TabN,"General","TRAILER"),Confirmation.Trailer) 
    'Ստուգում է "Կարգ" դաշտի արժեքը
    Call Compare_Two_Values("Կարգ",Get_Rekvizit_Value("Document",TabN,"General","PRIOR"),Confirmation.Priority)  
    'Ստուգում է "Բանկային առաջնություն" դաշտի արժեքը
    Call Compare_Two_Values("Բանկային առաջնություն",Get_Rekvizit_Value("Document",TabN,"General","BANKPRIOR"),Confirmation.BankPriority)
    
End Sub

'----------------------------------------------------
' Հաստատում - (ConfirmationAgreement)-ի Class
'----------------------------------------------------
Class ConfirmationAgreement
    Public Isn
    Public MsgType
    Public NumberOfDocument
    Public Reference
    Public TypeOfAccountId
    Public Account
    Public AccountIdentifier
    Public Date
    Public Curr
    Public Amount
    Public TypeOfOrderingClient
    Public AccountOfOrderingClient
    Public OrderingClient
    Public TypeOfOrderingInstitution
    Public PIDofOrderingInstitution
    Public OrderingInstitution 
    Public TypeOfIntermediaryInstitution 
    Public PIDofIntermediaryInstitution
    Public IntermediaryInstitution
    Public SenderToReceiverInformation 
    Public Key  
    Public SenderReceiver
    Public PacketNumber
    Public FileName   
    Public DirectoryName
    Public DateSend
    Public Trailer
    Public Priority 
    Public BankPriority

    Private Sub Class_Initialize
        Isn = ""
        MsgType = ""
        NumberOfDocument = ""
        Reference = ""
        TypeOfAccountId = ""
        Account = ""
        AccountIdentifier = ""
        Date = ""
        Curr = ""
        Amount = ""
        TypeOfOrderingClient = ""
        AccountOfOrderingClient = ""
        OrderingClient = ""
        TypeOfOrderingInstitution = ""
        PIDofOrderingInstitution = ""
        OrderingInstitution = ""
        TypeOfIntermediaryInstitution = ""
        PIDofIntermediaryInstitution = ""
        IntermediaryInstitution = ""
        SenderToReceiverInformation = ""
        Key = ""
        SenderReceiver = ""
        PacketNumber = ""
        FileName = ""
        DirectoryName = ""
        DateSend = ""
        Trailer = ""
        Priority = ""
        BankPriority = ""
    End Sub  
End Class

Function New_ConfirmationAgreement()
    Set New_ConfirmationAgreement = NEW ConfirmationAgreement      
End Function

'Հարցում ճշտման մասին (Ճշտել n95) փաստաթղթի կլասս
Class swQueryCommon
    Public isn
    Public category
    Public docN
    Public origMessageDate
    Public origMessageMT
    Public sesN
    Public sesIsn
    Public reference
    Public queries
    Public spec
    Public sentRec
    Public desc
    Public origMessage
    Public key
    Public tabN
    Public check
    Private Sub Class_Initialize
        isn = ""
        category = ""
        docN = ""
        origMessageDate = "  /  /    "
        origMessageMT = ""
        sesN = ""
        sesIsn = ""
        reference = ""
        queries = ""
        spec = ""
        sentRec = ""
        desc = ""
        origMessage = ""
        key = ""
        tabN = 1
        check = True
    End Sub
End Class

Function New_swQueryCommon()
    Set New_swQueryCommon = New swQueryCommon
End Function

Class swQueryAdd
    Public sendRec
    Public packN
    Public fileName
    Public dirName
    Public sendRecDate
    Public trailer
    Public prior
    Public bankPrior
    Public tabN
    Public check
    Private Sub Class_Initialize
        sendRec = ""
        packN = ""
        fileName = ""
        dirName = ""
        sendRecDate = "  /  /    "
        trailer = ""
        prior = ""
        bankPrior = ""
        tabN = 2
        check = True
    End Sub
End Class

Function New_swQueryAdd()
    Set New_swQueryAdd = New swQueryAdd
End Function

Class swiftQuery
    Public commonTab
    Public addTab
    Private Sub Class_Initialize
        Set commonTab = New_swQueryCommon()
        Set addTab = New_swQueryAdd()
    End Sub
End Class

Function New_swQuery()
    Set New_swQuery = New swiftQuery
End Function
'Հարցում ճշտման մասին (Ճշտել n95) փաստաթուղթը ստուգող ֆունկցիա
Sub swQuery_Check(swQuery)
    'Ընդհանուր էջ 
    If swQuery.commonTab.check Then
        Call GoTo_ChoosedTab(swQuery.commonTab.tabN)  
        'Վերցնում է փաստաթղթի isn-ը
        swQuery.commonTab.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
        'Կատեգորիա դաշտի ստուգում
        Call Compare_Two_Values("Կատեգորիա",Get_Rekvizit_Value("Document",swQuery.commonTab.tabN,"Mask","CATEGORY"),swQuery.commonTab.category)
        'Փաստաթղթի N ստուգում
        Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",swQuery.commonTab.tabN,"General","BMDOCNUM"),swQuery.commonTab.docN)
        'Սկզբնական հաղորդագրության ամսաթիվ դաշտի ստուգում
        Call Compare_Two_Values("Սկզբնական հաղորդագրության ամսաթիվ",Get_Rekvizit_Value("Document",swQuery.commonTab.tabN,"General","DATE"),swQuery.commonTab.origMessageDate)
        'Սկզբնական հաղորդագրության տեսակը դաշտի ստուգում
        Call Compare_Two_Values("Սկզբնական հաղորդագրության տեսակը",Get_Rekvizit_Value("Document",swQuery.commonTab.tabN,"Mask","TYPE"),swQuery.commonTab.origMessageMT)
        'Հաղորդագրության սեանսի համարը դաշտի ստուգում
        Call Compare_Two_Values("Հաղորդագրության սեանսի համարը",Get_Rekvizit_Value("Document",swQuery.commonTab.tabN,"General","OSESNUM"),swQuery.commonTab.sesN)
        'Հաղորդագրության հերթական համարը դաշտի ստուգում
        Call Compare_Two_Values("Հաղորդագրության հերթական համարը",Get_Rekvizit_Value("Document",swQuery.commonTab.tabN,"General","OSESISN"),swQuery.commonTab.sesIsn)
        'Հղում դաշտի ստուգում
        Call Compare_Two_Values("Հղում",Get_Rekvizit_Value("Document",swQuery.commonTab.tabN,"General","REFERENCE"),swQuery.commonTab.reference)
        'Հարց դաշտի ստուգում
        Call Compare_Two_Values("Հարց",Get_Rekvizit_Value("Document",swQuery.commonTab.tabN,"Comment","QUESTION"),swQuery.commonTab.queries)
        'Մանրամասնություն դաշտի ստուգում
        Call Compare_Two_Values("Մանրամասնություն",Get_Rekvizit_Value("Document",swQuery.commonTab.tabN,"Comment","SPEC"),swQuery.commonTab.spec)
        'Ուղարկված/ստացված դաշտի ստուգում
        Call Compare_Two_Values("Ուղարկված/ստացված",Get_Rekvizit_Value("Document",swQuery.commonTab.tabN,"Mask","RS"),swQuery.commonTab.sentRec)
        'Նկարագրություն դաշտի ստուգում
        Call Compare_Two_Values("Նկարագրություն",Get_Rekvizit_Value("Document",swQuery.commonTab.tabN,"Comment","DESCRIPT"),swQuery.commonTab.desc)
        'Նախնական հաղորդագրություն դաշտի ստուգում
        Call Compare_Two_Values("Նախնական հաղորդագրություն",Get_Rekvizit_Value("Document",swQuery.commonTab.tabN,"General","ORGMSG"),swQuery.commonTab.origMessage)
        'Բանալի (TELEX) դաշտի ստուգում
        Call Compare_Two_Values("Բանալի (TELEX)",Get_Rekvizit_Value("Document",swQuery.commonTab.tabN,"General","TXKEY"),swQuery.commonTab.key)
    End If
    'Լրացուցիչ էջ
    If swQuery.addTab.check Then
        Call GoTo_ChoosedTab(swQuery.addTab.tabN)  
        'Ուղարկող/ստացող դաշտի ստուգում
        Call Compare_Two_Values("Ուղարկող/ստացող",Get_Rekvizit_Value("Document",swQuery.addTab.tabN,"Comment","SNDREC"),swQuery.addTab.sendRec)  
        'Փաթեթի համարը դաշտի ստուգում
        Call Compare_Two_Values("Փաթեթի համարը",Get_Rekvizit_Value("Document",swQuery.addTab.tabN,"Comment","PACK"),swQuery.addTab.packN)  
        'Ֆայլի անուն դաշտի ստուգում
        Call Compare_Two_Values("Ֆայլի անուն",Get_Rekvizit_Value("Document",swQuery.addTab.tabN,"General","BMNAME"),swQuery.addTab.fileName)  
        'Դիրեկտորիայի անուն դաշտի ստուգում
        Call Compare_Two_Values("Դիրեկտորիայի անուն",Get_Rekvizit_Value("Document",swQuery.addTab.tabN,"General","BMDIRECT"),swQuery.addTab.dirName)  
        'Ամսաթիվ (Ուղարկման/ստացման) դաշտի ստուգում
        Call Compare_Two_Values("Ամսաթիվ (Ուղարկման/ստացման)",Get_Rekvizit_Value("Document",swQuery.addTab.tabN,"General","BMIODATE"),swQuery.addTab.sendRecDate)  
        'Վերջնահատված դաշտի ստուգում
        Call Compare_Two_Values("Վերջնահատված",Get_Rekvizit_Value("Document",swQuery.addTab.tabN,"General","TRAILER"),swQuery.addTab.trailer)  
        'Կարգ դաշտի ստուգում
        Call Compare_Two_Values("Կարգ",Get_Rekvizit_Value("Document",swQuery.addTab.tabN,"General","PRIOR"),swQuery.addTab.prior)  
        'Բանկային առաջնություն դաշտի ստուգում
        Call Compare_Two_Values("Բանկային առաջնություն",Get_Rekvizit_Value("Document",swQuery.addTab.tabN,"General","BANKPRIOR"),swQuery.addTab.bankPrior)
    End If
End Sub

'Փոխանակման օրդեր փաստաթղթի կլասս
Class conversionOrderCom
    Public isn
    Public div
    Public dep
    Public docN
    Public fDate
    Public dAcc
    Public cAcc
    Public cur1
    Public cur2
    Public CBCourse
    Public sum1
    Public sum2
    Public paySys
    Public aim
    Public tabN
    Public check
    
    Private Sub Class_Initialize
        isn = ""
        div = ""
        dep = ""
        docN = ""
        fDate = "  /  /    "
        dAcc = ""
        cAcc = ""
        cur1 = ""
        cur2 = ""
        CBCourse = "1.0000/1"
        sum1 = "0.00"
        sum2 = "0.00"
        paySys = ""
        aim = ""
        tabN = 1
        check = True
    End Sub       
End Class

Function New_ConversionOrderCommon()
    Set New_ConversionOrderCommon = new conversionOrderCom
End Function

Class conversionOrderPurSale
    Public purSale
    Public fTime
    Public opType
    Public opPlace
    Public busField
    Public nonRes
    Public legalPos
    Public tabN
    Public check
    
    Private Sub Class_Initialize
        purSale = ""
        fTime = ""
        opType = ""
        opPlace = ""
        busField = ""
        nonRes = 0
        legalPos = ""
        tabN = 2
        check = True
    End Sub
End Class

Function New_ConversionOrderPS()
    Set New_ConversionOrderPS = new conversionOrderPurSale
End Function

Class conversionOrder
    Public commonTab
    Public psTab
    Public attachTab
    Private Sub Class_Initialize
        Set commonTab = New_ConversionOrderCommon()
        Set psTab = New_ConversionOrderPS()
        Set attachTab = New_Attached_Tab(fCount, lCount, dCount)
        attachTab.tabN = 3
    End Sub
End Class

Function New_ConversionOrder(fileC ,linkC , deleteC)
    fCount = fileC
    lCount = linkC
    dCount = deleteC
    Set New_ConversionOrder = new conversionOrder
End Function

'Փոխանակման օրդեր փաստաթուղթի ստուգում
Sub Conversion_Order_Check(convOrd)
    Dim count, expCount, i
    'Անցում Ընդհանուր էջ
    convOrd.commonTab.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    If convOrd.commonTab.check Then
        Call GoTo_ChoosedTab(convOrd.commonTab.tabN)  
        'Գրասենյակ դաշտի ստուգում
        Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",convOrd.commonTab.tabN,"Mask","ACSBRANCH"),convOrd.commonTab.div)
        'Բաժին դաշտի ստուգում
        Call Compare_Two_Values("Բաժին",Get_Rekvizit_Value("Document",convOrd.commonTab.tabN,"Mask","ACSDEPART"),convOrd.commonTab.dep)
        'Փաստաթղթի N դաշտի ստուգում
        Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",convOrd.commonTab.tabN,"General","DOCNUM"),convOrd.commonTab.docN)
        'Ամսաթիվ դաշտի ստուգում
        Call Compare_Two_Values("Ամսաթիվ",Get_Rekvizit_Value("Document",convOrd.commonTab.tabN,"General","DATE"),convOrd.commonTab.fDate) 
        'Հաշիվ Դեբետ դաշտի ստուգում
        Call Compare_Two_Values("Հաշիվ Դեբետ",Get_Rekvizit_Value("Document",convOrd.commonTab.tabN,"Mask","ACCDB"),convOrd.commonTab.dAcc)
        'Հաշիվ Կրեդիտ դաշտի ստուգում
        Call Compare_Two_Values("Հաշիվ Կրեդիտ",Get_Rekvizit_Value("Document",convOrd.commonTab.tabN,"Mask","ACCCR"),convOrd.commonTab.cAcc)       
        'Արժույթ 1 դաշտի ստուգում
        Call Compare_Two_Values("Արժույթ 1",Get_Rekvizit_Value("Document",convOrd.commonTab.tabN,"Mask","CURDB"),convOrd.commonTab.cur1)
        'Արժույթ 2 դաշտի ստուգում
        Call Compare_Two_Values("Արժույթ 2",Get_Rekvizit_Value("Document",convOrd.commonTab.tabN,"Mask","CURCR"),convOrd.commonTab.cur2)  
        'ԿԲ Փոխարժեք դաշտի ստուգում
        Call Compare_Two_Values("ԿԲ Փոխարժեք",Get_Rekvizit_Value("Document",convOrd.commonTab.tabN,"Course","CBCRS"),convOrd.commonTab.CBCourse)
        'Գումար 1 արժույթով դաշտի ստուգում
        Call Compare_Two_Values("Գումար 1 արժույթով",Get_Rekvizit_Value("Document",convOrd.commonTab.tabN,"General","SUMDB"),convOrd.commonTab.sum1)                
        'Գումար 2 արժույթով դաշտի ստուգում
        Call Compare_Two_Values("Գումար 2 արժույթով",Get_Rekvizit_Value("Document",convOrd.commonTab.tabN,"General","SUMCR"),convOrd.commonTab.sum2) 
        'Ընդ. վճ. համակարգ դաշտի ստուգում
        Call Compare_Two_Values("Ընդ. վճ. համակարգ",Get_Rekvizit_Value("Document",convOrd.commonTab.tabN,"Mask","PAYSYSIN"),convOrd.commonTab.paySys)
        'Նպատակ դաշտի ստուգում
        Call Compare_Two_Values("Նպատակ",Get_Rekvizit_Value("Document",convOrd.commonTab.tabN,"Comment","AIM"),convOrd.commonTab.aim)
    End If        
    'Անցում Առք/Վաճառք էջ 
    If convOrd.psTab.check Then    
        Call GoTo_ChoosedTab(convOrd.psTab.tabN)                       
        'Առք/Վաճառք դաշտի ստուգում
        Call Compare_Two_Values("Առք/Վաճառք",Get_Rekvizit_Value("Document",convOrd.psTab.tabN,"Mask","CUPUSA"),convOrd.psTab.purSale)                
        'Ժամանակ դաշտի ստուգում
        Call Compare_Two_Values("Ժամանակ",Get_Rekvizit_Value("Document",convOrd.psTab.tabN,"Mask","TIME"),convOrd.psTab.fTime)
        'Գործողության տեսակ դաշտի ստուգում
        Call Compare_Two_Values("Գործողության տեսակ",Get_Rekvizit_Value("Document",convOrd.psTab.tabN,"Mask","CURTES"),convOrd.psTab.opType)
        'Գործողության վայր դաշտի ստուգում
        Call Compare_Two_Values("Գործողության վայր",Get_Rekvizit_Value("Document",convOrd.psTab.tabN,"Mask","CURVAIR"),convOrd.psTab.opPlace)
        'Գործունեության ոլորտ դաշտի ստուգում
        Call Compare_Two_Values("Գործունեության ոլորտ",Get_Rekvizit_Value("Document",convOrd.psTab.tabN,"Mask","VOLORT"),convOrd.psTab.busField)
        'Ոչ ռեզիդենտ դաշտի ստուգում
        Call Compare_Two_Values("Ոչ ռեզիդենտ",Get_Rekvizit_Value("Document",convOrd.psTab.tabN,"CheckBox","NONREZ"),convOrd.psTab.nonRes)
        'Իրավաբանական կարգավիճակ դաշտի ստուգում
        Call Compare_Two_Values("Իրավաբանական կարգավիճակ",Get_Rekvizit_Value("Document",convOrd.psTab.tabN,"Mask","JURSTAT"),convOrd.psTab.legalPos)
    End If
    'Անցում Կցված Էջ
    Call GoTo_ChoosedTab(convOrd.attachTab.tabN)   
    ' Ստուգել, որ ֆայլերը առկա են 
    For i = 0 To convOrd.attachTab.filesCount - 1
        Call SearchInAttachList (convOrd.attachTab.fileName(i), convOrd.attachTab.tabN) 
    Next
    ' Ստուգել, որ հղումները առկա են
    For i = 0 To convOrd.attachTab.linksCount - 1
        Call SearchInAttachList (convOrd.attachTab.addLinks(i), convOrd.attachTab.tabN)
    Next
    'Համեմատում է Աղյուսակում առկա և ակնկալվող ֆայլերի և հղումների քանակը,առկա տողերի սխալ քանակի դեպքում լոգավորում է Error
    count = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_"&convOrd.attachTab.tabN).VBObject("AsAttachments1").VBObject("ListViewAttachments").wItemCount
    expCount = convOrd.attachTab.filesCount + convOrd.attachTab.linksCount
    If expCount <> count Then
       Log.Error "Attached files and links count is " & count & ". Expected value is " & expCount ,,, ErrorColor
    End If     
End Sub

'Ընդունել SWIFT Համակարգից գործողությունը կատարող ֆունկցիա
'messageCount- Ընդունվող հաղորդագրությունների քանակը
Sub Recieve_From_SWIFT (messageCount)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |Ð³Õáñ¹³·ñáõÃÛáõÝÝ»ñÇ ÁÝ¹áõÝáõÙ|ÀÝ¹áõÝ»É S.W.I.F.T. Ñ³Ù³Ï³ñ·Çó")
    BuiltIn.Delay(5000) 
    If messageCount = 1 Then
        Call MessageExists(2,"Ð³Õáñ¹³·ñáõÃÛ³Ý ÁÝ¹áõÝáõÙÝ ³í³ñïí»ó") 
        Call ClickCmdButton(5, "OK") 
    ElseIF messageCount > 1 Then
        Call MessageExists(2,messageCount & " Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñÇ ÁÝ¹áõÝáõÙÝ ³í³ñïí»ó")
        Call ClickCmdButton(5, "OK") 
    Else
        Call MessageExists(2,"ÀÝ¹áõÝÙ³Ý »ÝÃ³Ï³ Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ ãÏ³Ý")
        Call ClickCmdButton(5, "OK")
    End If     
End Sub

'Ուղարկվող Ֆիլտրի կլասս
Class Sending
    Public sDate 
    Public eDate
    Public mt
    Public package
    Public reciever
    Public uniqueRef
    Public showPaySys
    Public view
    Public fillInto
    Private Sub Class_Initialize
        sDate = ""
        eDate = ""
        mt = ""
        package = ""
        reciever = "1"
        uniqueRef = ""
        showPaySys = 0
        view = "SWEpays"
        fillInto = "0"
    End Sub
End Class

Function New_Sending()
    Set New_Sending = new Sending
End Function

'Ուղարկվող փոխանցումներ Ֆիլտրի լրացում
Sub Fill_Sending_Transfer_Filter (sending)
    'Սկզբի ամսաթիվ
    Call Rekvizit_Fill("Dialog",1,"General", "PERN","[Home]![End][Del]" & sending.sDate)
    'Վերջի ամսաթիվ
    Call Rekvizit_Fill("Dialog",1,"General", "PERK","[Home]![End][Del]" & sending.eDate)
    'Հաղ. Տիպ
    Call Rekvizit_Fill("Dialog",1,"General", "MT","[Home]![End][Del]" & sending.mt)
    'Փաթեթի համարը
    Call Rekvizit_Fill("Dialog",1,"General", "PACKNUM","[Home]![End][Del]" & sending.package)
    'Հասցեատեր
    Call Rekvizit_Fill("Dialog",1,"General", "TO","[Home]![End][Del]" & sending.reciever)
    'Հաղորդագրության միարժեք համար
    Call Rekvizit_Fill("Dialog",1,"General", "UETR","[Home]![End][Del]" & sending.uniqueRef)
    'Ցույց տալ ընդ. վճ. համակարգը
    Call Rekvizit_Fill("Dialog",1,"CheckBox", "SHOWPAYSYSIN",sending.showPaySys)
    'Դիտելու ձև
    Call Rekvizit_Fill("Dialog",1,"General", "SELECTED_VIEW","[Home]![End][Del]" & sending.view)
    'Լրացնել
    Call Rekvizit_Fill("Dialog",1,"General", "EXPORT_EXCEL","[Home]![End][Del]" & sending.fillInto)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'Մուտք Ուղարկվող փոխանցումներ թղթապանակ
Sub GoTo_Sending_Transfer(sending, folderDirect)
    Dim FilterWin
    Call wTreeView.DblClickItem(folderDirect)
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_Sending_Transfer_Filter (sending)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Sent Messages Filter",,,ErrorColor      
    End If 
End Sub

'Ուղարկվող Խառը հաղորդագրություններ Ֆիլտրի լրացում
Sub Fill_Sending_Messages_Filter (sending)
    'Սկզբի ամսաթիվ
    Call Rekvizit_Fill("Dialog",1,"General", "PERN","[Home]![End][Del]" & sending.sDate)
    'Վերջի ամսաթիվ
    Call Rekvizit_Fill("Dialog",1,"General", "PERK","[Home]![End][Del]" & sending.eDate)
    'Հաղ. Տիպ
    Call Rekvizit_Fill("Dialog",1,"General", "MT","[Home]![End][Del]" & sending.mt)
    'Փաթեթի համարը
    Call Rekvizit_Fill("Dialog",1,"General", "PACKNUM","[Home]![End][Del]" & sending.package)
    'Հասցեատեր
    Call Rekvizit_Fill("Dialog",1,"General", "TO","[Home]![End][Del]" & sending.reciever)
    'Հաղորդագրության միարժեք համար
    Call Rekvizit_Fill("Dialog",1,"General", "UETR","[Home]![End][Del]" & sending.uniqueRef)
    'Դիտելու ձև
    Call Rekvizit_Fill("Dialog",1,"General", "SELECTED_VIEW","[Home]![End][Del]" & sending.view)
    'Լրացնել
    Call Rekvizit_Fill("Dialog",1,"General", "EXPORT_EXCEL","[Home]![End][Del]" & sending.fillInto)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'Մուտք Ուղարկվող Խառը հաղորդագրություններ թղթապանակ
Sub GoTo_Sending_Messages(sending, folderDirect)
    Dim FilterWin
    Call wTreeView.DblClickItem(folderDirect)
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_Sending_Messages_Filter (sending)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Sending Messages Filter",,,ErrorColor      
    End If 
End Sub

'Ուղարկված Ֆիլտրի կլասս
Class SentMessages
    Public sDate 
    Public eDate
    Public mt
    Public state
    Public user
    Public uniqueRef
    Public addressedTo
    Public reciever
    Public showPaySys
    Private Sub Class_Initialize
        sDate = ""
        eDate = ""
        mt = ""
        state = ""
        user = ""
        addressedTo = "1"
        reciever = ""
        uniqueRef = ""
        showPaySys = 0
    End Sub
End Class

Function New_SentMessages()
    Set New_SentMessages = new SentMessages
End Function

'Ուղարկված Խառը հաղորդագրություններ Ֆիլտրի լրացում
Sub Fill_Sent_Messages_Filter (sentMsg)
    'Սկզբի ամսաթիվ
    Call Rekvizit_Fill("Dialog",1,"General", "PERN","[Home]![End][Del]" & sentMsg.sDate)
    'Վերջի ամսաթիվ
    Call Rekvizit_Fill("Dialog",1,"General", "PERK","[Home]![End][Del]" & sentMsg.eDate)
    'Հաղ. Տիպ
    Call Rekvizit_Fill("Dialog",1,"General", "MT","[Home]![End][Del]" & sentMsg.mt)
    'Կարգավիճակ
    Call Rekvizit_Fill("Dialog",1,"General", "STATCTL","[Home]![End][Del]" & sentMsg.state)
    'Կատարող
    Call Rekvizit_Fill("Dialog",1,"General", "USER","[Home]![End][Del]" & sentMsg.user)
    'Հասցեատեր
    Call Rekvizit_Fill("Dialog",1,"General", "TO","[Home]![End][Del]" & sentMsg.addressedTo)
    'Ստացող
    Call Rekvizit_Fill("Dialog",1,"General", "SNDREC","[Home]![End][Del]" & sentMsg.reciever)
    'Հաղորդագրության միարժեք համար
    Call Rekvizit_Fill("Dialog",1,"General", "UETR","[Home]![End][Del]" & sentMsg.uniqueRef)
    'Ցույց տալ ընդ. վճ. համակարգը
    Call Rekvizit_Fill("Dialog",1,"CheckBox", "SHOWPAYSYSIN","[Home]![End][Del]" & sentMsg.showPaySys)
    Call ClickCmdButton(2, "Î³ï³ñ»É") 
End Sub

'Մուտք Ուղարկված Խառը հաղորդագրություններ թղթապանակ
Sub GoTo_Sent_Messages(sentMsg, folderDirect)
    Dim FilterWin
    Call wTreeView.DblClickItem(folderDirect)
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_Sent_Messages_Filter (sentMsg)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Sent Messages Filter",,,ErrorColor      
    End If 
End Sub

'Ուղարկված Փոխանցումներ Ֆիլտրի լրացում
Sub Fill_Sent_Transfer_Filter (sentTansfer)
    'Սկզբի ամսաթիվ
    Call Rekvizit_Fill("Dialog",1,"General", "PERN","[Home]![End][Del]" & sentTansfer.sDate)
    'Վերջի ամսաթիվ
    Call Rekvizit_Fill("Dialog",1,"General", "PERK","[Home]![End][Del]" & sentTansfer.eDate)
    'Հաղ. Տիպ
    Call Rekvizit_Fill("Dialog",1,"General", "MT","[Home]![End][Del]" & sentTansfer.mt)
    'Կարգավիճակ
    Call Rekvizit_Fill("Dialog",1,"General", "STATCTL","[Home]![End][Del]" & sentTansfer.state)
    'Կատարող
    Call Rekvizit_Fill("Dialog",1,"General", "USER","[Home]![End][Del]" & sentTansfer.user)
    'Հասցեատեր
    Call Rekvizit_Fill("Dialog",1,"General", "TO","[Home]![End][Del]" & sentTansfer.addressedTo)
    'Ստացող
    Call Rekvizit_Fill("Dialog",1,"General", "SNDREC","[Home]![End][Del]" & sentTansfer.reciever)
    'Հաղորդագրության միարժեք համար
    Call Rekvizit_Fill("Dialog",1,"General", "UETR","[Home]![End][Del]" & sentTansfer.uniqueRef)
    Call ClickCmdButton(2, "Î³ï³ñ»É")     
End Sub

'Մուտք Ուղարկված փոխանցումներ թղթապանակ
Sub GoTo_Sent_Transfer(sentTansfer, folderDirect)
    Dim FilterWin
    Call wTreeView.DblClickItem(folderDirect)
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_Sent_Transfer_Filter (sentTansfer)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Sent Transfers Filter",,,ErrorColor      
    End If 
End Sub

'Ընդունված հաղորդագրություններ Ֆիլտրի կլասս
Class RecievedFilter
    Public sDate 
    Public eDate
    Public mt
    Public state
    Public reciever
    Public sender
    Public uniqueRef
    Public view
    Public fillInto
    Private Sub Class_Initialize
        sDate = ""
        eDate = ""
        mt = ""
        state = ""
        reciever = "1"     
        sender = ""
        uniqueRef = ""
        view = "SWinp"
        fillInto = "0"
    End Sub
End Class
    
Function New_Recieved()
    Set New_Recieved = new RecievedFilter
End Function    
    
    
'Ընդունված հաղորդագրություններ Ֆիլտրի լրացում
Sub Fill_Recieved_Messages_Filter (recMsg)     
        'Սկզբի ամսաթիվ
        Call Rekvizit_Fill("Dialog",1,"General", "PERN","[Home]![End][Del]" & recMsg.sDate)
        'Վերջի ամսաթիվ
        Call Rekvizit_Fill("Dialog",1,"General", "PERK","[Home]![End][Del]" & recMsg.eDate)
        'Հաղ. Տիպ
        Call Rekvizit_Fill("Dialog",1,"General", "MT","[Home]![End][Del]" & recMsg.mt)
        'Կարգավիճակ
        Call Rekvizit_Fill("Dialog",1,"General", "RCCTL","[Home]![End][Del]" & recMsg.state)
        'Հասցեատեր
        Call Rekvizit_Fill("Dialog",1,"General", "TO","[Home]![End][Del]" & recMsg.reciever)
        'Ուղարկող
        Call Rekvizit_Fill("Dialog",1,"General", "SNDREC","[Home]![End][Del]" & recMsg.sender)
        'Հաղորդագրության միարժեք համար
        Call Rekvizit_Fill("Dialog",1,"General", "UETR","[Home]![End][Del]" & recMsg.uniqueRef)
        'Դիտելու ձև
        Call Rekvizit_Fill("Dialog",1,"General", "SELECTED_VIEW","[Home]![End][Del]" & recMsg.view)
        'Լրացնել
        Call Rekvizit_Fill("Dialog",1,"General", "EXPORT_EXCEL","[Home]![End][Del]" & recMsg.fillInto)
        Call ClickCmdButton(2, "Î³ï³ñ»É")      
End Sub

'Մուտք Ընդունված հաղորդագրություններ/Ընդունված Փոխանցումներ թղթապանակ
Sub GoTo_Recieved_Messages (RecievedFilter, folderDirect)
    Call wTreeView.DblClickItem(folderDirect)
    If p1.WaitVBObject("frmAsUstPar",3000).Exists Then
        Call Fill_Recieved_Messages_Filter (RecievedFilter)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Recieved Filter",,,ErrorColor      
    End If 
End Sub



