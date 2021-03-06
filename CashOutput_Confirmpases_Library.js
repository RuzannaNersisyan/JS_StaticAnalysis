Option Explicit
'USEUNIT Library_Common
'USEUNIT Library_Contracts
'USEUNIT Online_PaySys_Library
'USEUNIT Constants
'USEUNIT Library_Colour

Dim grRowCount, f_Count, l_Count, d_Count

'----------------------------------------------
'Կանխիկ ելք փաստաթղթի լրացում
'----------------------------------------------
'docNumber - Փաստաթղթի համարը
'summa - Գումար դաշտի արժեք
'accTemp - Հաշիվներ ֆիլտրի հաշվի շաբլոն դաշտի լրացում
'fISN - Փաստատթղթի ISN-ը
'draft - true արժեքի դեպքում սեղմվում է Սրագիր կոճակը, false-ի դեպքում` Կատարել
Sub CashOutput_Doc_Fill(docNumber, accTemp, summa, fISN, draft)
    BuiltIn.Delay(1000)
    Call wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|Ð³ßÇíÝ»ñ")
    'Հաշվի շաբլոն դաշտի լրացում
    Call Rekvizit_Fill("Dialog", 1, "General", "AccMask", accTemp)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.Delay(6000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_InnerOpers & "|" & c_CashOut)
    BuiltIn.Delay(2000)
    
    'Ստեղծվող ISN - ի փաստատթղթի  վերագրում փոփոխականին
    fISN = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Փաստաթղթի N դաշտի արժեքի վերագրում փոփոխականին
    docNumber = Get_Rekvizit_Value("Document", 1, "General", "DOCNUM")
    
    'Գումար դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", summa)
    'Նպատակ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "AIM", "²ÝÝå³ï³Ï") 

    ' Կատարել կամ Սևագիր կոճակի սեղմում
    If draft Then
        Call ClickCmdButton(1, "ê¨³·Çñ")
    Else
        Call ClickCmdButton(1, "Î³ï³ñ»É")
    End If
End Sub

'------------------------------------------------------------------------------
'Վերստուգվող փաստաթղթեր թղթապանակում վճարման հանձնարարգրի Հաստատում :Եթե նոր
'ներմուծված արժեքները սխալ են, ապա ֆունկցիան վերադարձնում է fasle, եթե հաստատվում է ` true :
'Ֆունկցիան ենթադրում է փաստաթղթի առկայությունը :
'------------------------------------------------------------------------------
'accDeb- Հաշիվ դեբետ դաշտի արժեքը
'summa - Գումար դաշտի արժեքը

Function CashOutput_Verify_Doc_In_InspecdetDoc_Folder(accDeb, summa)
    Dim my_vbobj , rekvName , isverify
    isverify = False
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    wMainForm.PopupMenu.click(c_DoubleInput)
    Set my_vbobj = wMDIClient.WaitVBObject("frmASDocForm", delay_middle)
    If my_vbobj.Exists Then
        'Հաշիվ դեբետ դաշտի լրացում
        Call Rekvizit_Fill("Document", 1, "General", "ACCDB", "^A[Del]" & accDeb)
        'Գումար դաշտի լրացում
        Call Rekvizit_Fill("Document", 1, "General", "Summa", summa)
        wMDIClient.vbObject("frmASDocForm").vbObject("CmdOk").Click()
    Else
        Log.Message("Can't open the document for double input")
    End If
    
    Set my_vbobj = Sys.Process("Asbank").WaitVBObject("frmAsMsgBox", delay_middle)
    If my_vbobj.Exists Then
        Sys.Process("Asbank").vbObject("frmAsMsgBox").vbObject("cmdButton").Click()
    Else
        isverify = True
    End If
    
    CashOutput_Verify_Doc_In_InspecdetDoc_Folder = isverify
    
End Function


'-----------------------------
'"Կանխիկ ելք"  CashOut - Class
'-----------------------------
Class CashOut
				Public fIsn
				Public Office
				Public Department
    Public DocNum
    Public Date
				Public CashDesk
				Public CashDeskAccount
				Public CreditAccount
    Public Amount
    Public CashLabel
    Public Base
    Public Aim
    Public Depositor
    Public FirstName
    Public LastName
    Public IdNumber
	Public IdType
    Public Issued
    Public IssuedDate
    Public DateOfExpire
    Public DateOfBirth
    Public Citizenship
    Public Country
    Public Community
    Public City  
    Public Flat 
    Public Street
    Public House
    Public Email
    Public ChargesAccount
    Public Curr
    Public ChargeType
    Public ChargesAmount
    Public Interest
    Public IncomeAccount
    Public NonChargeableAmount
    Public NonResident
    Public Comment
    Public CliAgrDetails
    Public SubAmount
    Public SubAmountToBePaid
    Public AmountInPrimaryCurr
				Public CBExchangeRate
				Public CheckDateOfBirth
				Public BuySell
				Public ExchangeRate
				Public LegalStatus
				Public OperArea
				Public CBExchangeRate_Sub
				Public CheckAmount
				Public OperType
    Public OperPlace
				Public Time
				Public CoinPayCurr
				Public CoinPayAcc
				Public EarnExternalExchg
				Public DamageExternalExchg 
				Public RoundedAmount
    
    Private Sub Class_Initialize
								fIsn = ""
								Office = ""
								Department = ""
        DocNum = ""
        Date = ""
								CashDesk = ""
				    CashDeskAccount = ""
				    CreditAccount = ""
        Amount = ""
        CashLabel = ""
        Base = ""
        Aim = ""
        Depositor = ""
        FirstName = ""
        LastName = ""
        IdNumber = ""
		IdType = ""
        Issued = ""
        IssuedDate = ""
        DateOfExpire = ""
        DateOfBirth = ""
        Citizenship = ""
        Country = ""
        Community = ""
        City   = ""
        Flat  = ""
        Street = ""
        House = ""
        Email = ""
        ChargesAccount = ""
        Curr = ""
        ChargeType = ""
        ChargesAmount = "0.00"
        Interest = "0.0000"
        IncomeAccount = ""
        NonChargeableAmount = "0.00"
        NonResident = 0
        Comment = ""
        CliAgrDetails = ""
        SubAmount = "0.00"
        SubAmountToBePaid = "0.00"
        AmountInPrimaryCurr = "0.00"
								CBExchangeRate = "0.0000/0"
								CheckDateOfBirth = ""
								BuySell = ""
								ExchangeRate = "0/0"
								CBExchangeRate_Sub = "0/0"
								LegalStatus = ""
								OperArea = ""
								CheckAmount = ""
								OperType = ""
								OperPlace = ""
								Time = ""
								CoinPayCurr = ""
								CoinPayAcc = ""
								EarnExternalExchg = ""
								DamageExternalExchg = ""
								RoundedAmount = "0.00"
    End Sub  
End Class

Function New_CashOut()
    Set New_CashOut = NEW CashOut     
End Function
  

Function Fill_CashOut(CashOut)
    
    'ISN-ի վերագրում փոփոխականին
    Fill_CashOut = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Փաստաթղթի N դաշտի արժեքի վերագրում փոփոխականին
    CashOut.DocNum = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
    
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATE", "^A[Del]" & CashOut.Date)
    'Գումար դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", CashOut.Amount)
				'Դրամարկղ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "KASSA", CashOut.CashDesk)
    'Դրամարկղի հաշիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "ACCDB", CashOut.CashDeskAccount)
    'Հաշիվ կրեդիտ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "ACCCR", CashOut.CreditAccount)
    'Դրամարկղի նիշ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "KASSIMV", CashOut.CashLabel)
    'Հիմք դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "BASE", CashOut.Base)
    'Նպատակ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "AIM", CashOut.Aim)
    'Ստացող դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "CLICODE", CashOut.Depositor)
    'Անուն դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "RECEIVER", CashOut.FirstName)
    'Ազգանուն դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "RECEIVERLASTNAME", CashOut.LastName)
    'Անձը հաստ. փաստ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "PASSNUM", CashOut.IdNumber)
    'Տիպ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "PASTYPE", CashOut.IdType) 
    'Տրված դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "PASBY", CashOut.Issued)
    'Տրված ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATEPASS", CashOut.IssuedDate)
    'Վավեր է մինչև դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATEEXPIRE", CashOut.DateOfExpire)
    'Ծննդյան ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATEBIRTH", CashOut.DateOfBirth)
    'Քաղաքացիություն դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "CITIZENSHIP", CashOut.Citizenship)
    'Երկիր դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "COUNTRY", CashOut.Country)
    'Բնակավայր դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "COMMUNITY", CashOut.Community)
    'Քաղաք դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "CITY", CashOut.City)   
    'Բնակարան դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "APARTMENT", CashOut.Flat) 
    'Փողոց դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "ADDRESS", CashOut.Street)
    'Տուն/Շենք դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "BUILDNUM", CashOut.House)
    'Էլ հասցե դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "EMAIL", CashOut.Email)
    
    'Գանձման հաշիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 2, "General", "CHRGACC", CashOut.ChargesAccount)
    'Արժույթ դաշտի լրացում
    Call Rekvizit_Fill("Document", 2, "General", "CHRGCUR", CashOut.Curr)
    'Գանձման տեսակ դաշտի լրացում
    Call Rekvizit_Fill("Document", 2, "General", "PAYSCALE", CashOut.ChargeType)
    'Ստուգում է "Գումար" դաշտի արժեքը
    Call Compare_Two_Values("Գումար",Get_Rekvizit_Value("Document",2,"General","CHRGSUM"),CashOut.ChargesAmount) 
    'Ստուգում է "Տոկոս" դաշտի արժեքը
    Call Compare_Two_Values("Տոկոս",Get_Rekvizit_Value("Document",2,"General","PRSNT"),CashOut.Interest) 
    'Ստուգում է "Եկամտի հաշիվ" դաշտի արժեքը
    Call Compare_Two_Values("Եկամտի հաշիվ",Get_Rekvizit_Value("Document",2,"Mask","CHRGINC"),CashOut.IncomeAccount) 
    'Ստուգում է "Կանխիկ գում. չգանձվող մաս" դաշտի արժեքը
    Call Compare_Two_Values("Կանխիկ գում. չգանձվող մաս",Get_Rekvizit_Value("Document",2,"General","NOCRGSUM"),CashOut.NonChargeableAmount) 
    
    'Ոչ ռեզիդենտ դաշտի լրացում
    Call Rekvizit_Fill("Document", 2, "CheckBox", "NONREZ", CashOut.NonResident)
    'Մեկնաբանություն դաշտի լրացում
    Call Rekvizit_Fill("Document", 2, "General", "COMM", CashOut.Comment)
    'Հաճ.պայմանագ.տվյալներ դաշտի լրացում
    Call Rekvizit_Fill("Document", 2, "General", "AGRDETAILS", CashOut.CliAgrDetails)

    'Մանրադրամ դաշտի լրացում
    Call Rekvizit_Fill("Document", 3, "General", "XSUM", CashOut.SubAmount)
    'Ստուգում է "Մանրադրամի վճարման գումար" դաշտի արժեքը
    Call Compare_Two_Values("Մանրադրամի վճարման գումար",Get_Rekvizit_Value("Document",3,"General","XCURSUM"),CashOut.SubAmountToBePaid) 
    'Ստուգում է "Գումար հիմնական արժույթով" դաշտի արժեքը
    Call Compare_Two_Values("Գումար հիմնական արժույթով",Get_Rekvizit_Value("Document",3,"General","XSUMMAIN"),CashOut.AmountInPrimaryCurr) 

    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Function

'-----------------------------------------------------------------
'ԱջԿլիկ(Կանխիկ մնացորդի ճշտում) գործողությունը "Կանխիկ հաշվառում" թղթապանակից
'-----------------------------------------------------------------
Function CashRemainderRefining(Division,Department,Client,Curr,Date,OperType,Amount,Comment)
    
    Dim DocForm
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_CashRemainderRefining)
    wMDIClient.Refresh

    Set DocForm = wMDIClient.WaitVBObject("frmASDocForm", delay_middle)
    
    If DocForm.Exists Then
     
        'Ստուգում է "Գրասենյակ" դաշտի արժեքը
        Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",1,"Mask","ACSBRANCH"),Division) 
        'Ստուգում է "Բաժին" դաշտի արժեքը
        Call Compare_Two_Values("Բաժին",Get_Rekvizit_Value("Document",1,"Mask","ACSDEPART"),Department) 
        'Ստուգում է "Հաճախորդ" դաշտի արժեքը
        Call Compare_Two_Values("Հաճախորդ",Get_Rekvizit_Value("Document",1,"Mask","CLICODE"),Client)
        'Ստուգում է "Արժույթ" դաշտի արժեքը
        Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",1,"Mask","CUR"),Curr)
        
        'Լրացնել "Ամսաթիվ" դաշտը
        Call Rekvizit_Fill("Document", 1, "General", "DATE", "^A[Del]" & Date)
        'Լրացնել "Գործողության տեսակ" դաշտը
        Call Rekvizit_Fill("Document", 1, "General", "OPTP", OperType)
        'Լրացնել "Գումար" դաշտը
        Call Rekvizit_Fill("Document", 1, "General", "SUMMA", Amount)
        'Լրացնել "Մեկանաբանություն" դաշտը
        Call Rekvizit_Fill("Document",1,"General","COMM","^A[Del]" & Comment)
        'ISN-ի վերագրում
        CashRemainderRefining = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
        Call ClickCmdButton(1, "Î³ï³ñ»É")
    Else
        Log.Error "Can Not Open Rc(Կանխիկ մնացորդի ճշտում) Window",,,ErrorColor      
    End If
    BuiltIn.Delay(1500)
    If DocForm.Exists Then
        Log.Error "Can Not Close Rc(Կանխիկ մնացորդի ճշտում) Window",,,ErrorColor
    End If
End Function


'----------------------------------------
'"Կանխիկացման հայտ"  CashRequest - Class
'----------------------------------------
Class CashRequest
    Public System
    Public CashDivision
    Public Department
    Public RequestNumber
    Public CallDate
    Public CashDate
    Public Account
    Public Curr
    Public Client
    Public Receiver
	Public Name
	Public SurName
    Public IDNumber
    Public Amount
    Public Comment
    Public Status
    Public RecPaySystem

    Private Sub Class_Initialize
       System = ""
       CashDivision = ""
       Department = ""
       RequestNumber = ""
       CallDate = ""
       CashDate = ""
       Account = ""
       Curr = ""
       Client = ""
       Receiver = ""
	   Name = ""
	   SurName = ""
       IDNumber = ""
       Amount = ""
       Comment = ""
       Status = ""
       RecPaySystem = ""
    End Sub  
End Class

Function New_CashRequest()
    Set New_CashRequest = NEW CashRequest     
End Function
  
Function Fill_CashRequest(CashRequest)
    
    'ISN-ի վերագրում փոփոխականին
    Fill_CashRequest = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Համակարգ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "REMSYSTEM", "^A[Del]" & CashRequest.System)
    'Կանխ. գրասենյակ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "ACSBRANCH", CashRequest.CashDivision)
    'Բաժին դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "ACSDEPART", CashRequest.Department)

    'Ներկայացման ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATE", CashRequest.CallDate)
    'Կանխիկացման ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "REQUESTDATE", CashRequest.CashDate)
    'Հաշիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "ACCDB", CashRequest.Account)
    
    'Հայտի համար դաշտի վերագրում փոփոխականին
    CashRequest.RequestNumber = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
    
    'Ստուգում է Արժույթ դաշտի արժեքը
    'Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",1,"General","CURR"),CashRequest.Curr)
    'Ստուգում է Հաճախորդ դաշտի արժեքը
    'Call Compare_Two_Values("Հաճախորդ",Get_Rekvizit_Value("Document",1,"Mask","CLIENT"),CashRequest.Client)
    
    'Ստացող դաշտի լրացում    
	Call Rekvizit_Fill("Document", 1, "General", "RECCLIENT", CashRequest.Receiver)        
	'Անուն դաշտի լրացում    
	Call Rekvizit_Fill("Document", 1, "General", "RECEIVER", CashRequest.Name)    
	'Ազգանուն դաշտի լրացում    
	Call Rekvizit_Fill("Document", 1, "General", "RECEIVERLASTNAME", CashRequest.SurName)
    'Անձը հաստ. փաստ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "PASSNUM", CashRequest.IdNumber)
    'Գումար դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", CashRequest.Amount)
    'Մեկնաբանություն դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DESCR", CashRequest.Comment)
    'Կարգավիճակ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "REFUSE", CashRequest.Status)
    
    'Ստուգում է Ընդ.վճ.համակարգ դաշտի արժեքը
    Call Compare_Two_Values("Ընդ.վճ.համակարգ",Get_Rekvizit_Value("Document",1,"Mask","PAYSYSIN"),CashRequest.RecPaySystem)

    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Function

'-----------------------------------------------------
'"Նոր ստեղծված կանխիկացման հայտեր" NewCashRequest - Class
'-----------------------------------------------------
Class NewCashRequest
    Public StartDate
    Public EndDate
    Public Division
    Public Department
    Public ClientsCode
    Public Account
    Public Curr
    Public View
    Public FillInto
    
    Private Sub Class_Initialize
        StartDate = ""
        EndDate = ""
        Division = ""
        Department = ""
        ClientsCode = ""
        Account = ""
        Curr = ""
        View = ""
        FillInto = ""
    End Sub  
End Class

Function New_NewCashRequest()
    Set New_NewCashRequest = NEW NewCashRequest      
End Function

'-------------------------------------------------------------------
'Լրացնել "Նոր ստեղծված կանխիկացման հայտեր" NewCashRequest  Ֆիլտրի արժեքները
'-------------------------------------------------------------------
Sub Fill_NewCashRequest(NewCashRequest)

    'Լրացնում է "Ժամանակահատված սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",NewCashRequest.StartDate)
    'Լրացնում է "Ժամանակահատված ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",NewCashRequest.EndDate)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",NewCashRequest.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",NewCashRequest.Department)
    'Լրացնում է "Հաճախորդի կոդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLICODE",NewCashRequest.ClientsCode)
    'Լրացնում է "հաշիվ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACCCODE",NewCashRequest.Account)
    'Լրացնում է "Արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CUR",NewCashRequest.Curr)
    'Լրացնում է "Դիտելու ձև" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SELECTED_VIEW",NewCashRequest.View)
    'Լրացնում է "Լրացնել" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EXPORT_EXCEL",NewCashRequest.FillInto)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'----------------------------------------------------------------------------------------------------------
'Մուտք է գործում Հաճախորդի սպասարկում և դրամարկղ (ընդլայնված) ԱՇՏ/Թղթապանակներ/Նոր ստեղծված կանխիկացման հայտեր թղթապանակ
'----------------------------------------------------------------------------------------------------------
'CashRequest  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_CustomerService_CashRequest(CashRequest)
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |ÂÕÃ³å³Ý³ÏÝ»ñ|Üáñ ëï»ÕÍí³Í Ï³ÝËÇÏ³óÙ³Ý Ñ³Ûï»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_NewCashRequest(CashRequest)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Նոր ստեղծված կանխիկացման հայտեր Filter Window",,,ErrorColor      
    End If 
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''CashOut_Common''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Կնախիկ մուտք փաստաթղթի Ընդհանուր բաժնի կլաս
Class CashOut_Common 
    Public tabN
    Public office
    Public department
    Public docNum 
    Public date
    Public dateForCheck
    Public cashRegister
    Public cashRegisterAcc 
    Public curr
    Public accDebet
    Public amount
    Public amountForCheck
    Public cashierChar
    Public base
    Public aim 
    Public payer
    Public payerLegalStatus
    Public name
    Public surname
    Public id
    Public idForCheck
    Public idType
    Public idTypeForCheck
    Public idGivenBy
    Public idGivenByForCheck
    Public idGiveDate
    Public idGiveDateForCheck
    Public idValidUntil
    Public idValidUntilForCheck
    Public birthDate
    Public birthDateForCheck
    Public citizenship
    Public country
    Public residence
    Public city 
    Public street
    Public apartment
    Public house
    Public email
    Public emailForCheck
    Private Sub Class_Initialize()
        tabN = 1
        office = ""
        department = ""
        docNum = ""
        date = ""
        dateForCheck = "/ /"
        cashRegister = ""
        cashRegisterAcc = ""
        curr = ""
        accDebet = ""
        amount = "0.00"
        amountForCheck = "0.00"
        cashierChar = ""
        base = ""
        aim = ""
        payer = ""
        payerLegalStatus = ""
        name = ""
        surname = ""
        id = ""
        idForCheck = ""
        idType = ""
        idTypeForCheck = ""
        idGivenBy = ""
        idGivenByForCheck = ""
        idGiveDate = ""
        idGiveDateForCheck = "/  /"
        idValidUntil = ""
        idValidUntilForCheck = "/  /"
        birthDate = ""
        birthDateForCheck = "/  /"
        citizenship = ""
        country = ""
        residence = ""
        city = ""
        street = ""
        apartment = ""
        house = ""
        email = ""
        emailForCheck = ""
    End Sub
End Class

Function New_CashOut_Common()
    Set New_CashOut_Common = New CashOut_Common
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''Fill_CashOut_Common'''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Կանխիկ մուտք փաստաթղթի Ընդհանուր բաժնի լրացման ֆունկցիա
' Common - Կնախիկ մուտք փաստաթղթի Ընդհանուր բաժնի կլաս
Sub Fill_CashOut_Common(Common)
    'Գրասենյակ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "KASSA", Common.office)
    'Բաժին դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "ACCDB", Common.department)
    'Փաստաթղթի N դաշտի արժեքի վերագրում փոփոխականին
    Common.docNum = Get_Rekvizit_Value("Document", Common.tabN, "General", "DOCNUM")
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "DATE", "^A[Del]" & Common.date)
    'Հաշիվ դեբետ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "ACCDB","[Home]" & Common.accDebet)
    ' Ստուգել, որ Արժույթ դաշտը չխմբագրվող է
    Call Check_ReadOnly("Document", Common.tabN, "Mask", "CUR", True)
    ' Ստուգել Արժույթ դաշտի արժեքը
    Call Compare_Two_Values("Արժույթ", Get_Rekvizit_Value("Document", Common.tabN, "Mask", "CUR"), Common.curr)
    'Դրամարկղ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "KASSA", "^A[Del]" & Common.cashRegister)
    'Դրամարկղի հաշիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "ACCCR", "[Home]" & Common.cashRegisterAcc)
    'Գումար դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "SUMMA", Common.amount)
    'Դրամարկղի նիշ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "KASSIMV", Common.cashierChar)
    'Հիմք դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "BASE", "[Home]!" & "[End]" & "[Del]" & Common.base)
    'Նպատակ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "AIM", "[Home]!" & "[End]" & "[Del]" & Common.aim)
    'Մուծող դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "CLICODE", Common.payer)
    If Common.payerLegalStatus = "ֆիզԱնձ" Then
        ' Ստուգել, որ Անուն դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "Comment", "RECEIVER", True)
        ' Ստուգել Անուն դաշտի արժեքը
        Call Compare_Two_Values("Անուն", Get_Rekvizit_Value("Document", Common.tabN, "Comment", "RECEIVER"), Common.name)
        ' Ստուգել, որ Ազգանուն դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "General", "RECEIVERLASTNAME", True)
        ' Ստուգել Ազգանուն դաշտի արժեքը
        Call Compare_Two_Values("Ազգանուն", Get_Rekvizit_Value("Document", Common.tabN, "General", "RECEIVERLASTNAME"), Common.surname)
        ' Ստուգել Անձը հաստ. փաստթ. կոդ դաշտի արժեքը
        Call Compare_Two_Values("Անձը հաստ. փաստթ. կոդ", Get_Rekvizit_Value("Document", Common.tabN, "Comment", "PASSNUM"), Common.idForCheck)
        ' Ստուգել Տիպ դաշտի արժեքը
        Call Compare_Two_Values("Տիպ", Get_Rekvizit_Value("Document", Common.tabN, "Mask", "PASTYPE"), Common.idTypeForCheck)
        ' Ստուգել Տրված դաշտի արժեքը
        Call Compare_Two_Values("Տրված", Get_Rekvizit_Value("Document", Common.tabN, "General", "PASBY"), Common.idGivenByForCheck)
        ' Ստուգել Տրված ամսաթիվ դաշտի արժեքը
        Call Compare_Two_Values("Տրված ամսաթիվ", Get_Rekvizit_Value("Document", Common.tabN, "General", "DATEPASS"), Common.idGiveDateForCheck)
        ' Ստուգել Վավեր է մինչև դաշտի արժեքը
        Call Compare_Two_Values("Վավեր է մինչև", Get_Rekvizit_Value("Document", Common.tabN, "General", "DATEEXPIRE"), Common.idValidUntilForCheck)
        ' Ստուգել, որ Ծննդյան ամսաթիվ դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "General", "DATEBIRTH", True)
        ' Ստուգել Ծննդյան ամսաթիվ դաշտի արժեքը
        Call Compare_Two_Values("Ծննդյան ամսաթիվ", Get_Rekvizit_Value("Document", Common.tabN, "General", "DATEBIRTH"), Common.birthDateForCheck)
        ' Ստուգել, որ Քաղաքացիություն դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "Mask", "CITIZENSHIP", True)
        ' Ստուգել Քաղաքացիություն դաշտի արժեքը
        Call Compare_Two_Values("Քաղաքացիություն", Get_Rekvizit_Value("Document", Common.tabN, "Mask", "CITIZENSHIP"), Common.citizenship)
        ' Ստուգել, որ Երկիր դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "Mask", "COUNTRY", True)
        ' Ստուգել Երկիր դաշտի արժեքը
        Call Compare_Two_Values("Երկիր", Get_Rekvizit_Value("Document", Common.tabN, "Mask", "COUNTRY"), Common.country)
        ' Ստուգել, որ Բնակավայր դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "Mask", "COMMUNITY", True)
        ' Ստուգել Բնակավայր դաշտի արժեքը
        Call Compare_Two_Values("Բնակավայր", Get_Rekvizit_Value("Document", Common.tabN, "Mask", "COMMUNITY"), Common.residence)
        ' Ստուգել, որ Քաղաք դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "General", "CITY", True)
        ' Ստուգել Քաղաք դաշտի արժեքը
        Call Compare_Two_Values("Քաղաք", Get_Rekvizit_Value("Document", Common.tabN, "General", "CITY"), Common.city)
        ' Ստուգել, որ Բնակարան դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "General", "APARTMENT", True)
        ' Ստուգել Բնակարան դաշտի արժեքը
        Call Compare_Two_Values("Բնակարան", Get_Rekvizit_Value("Document", Common.tabN, "General", "APARTMENT"), Common.apartment)
        ' Ստուգել, որ Փողոց դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "General", "ADDRESS", True)
        ' Ստուգել Փողոց դաշտի արժեքը
        Call Compare_Two_Values("Փողոց", Get_Rekvizit_Value("Document", Common.tabN, "General", "ADDRESS"), Common.street)
        ' Ստուգել, որ Տուն/Շենք դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "General", "BUILDNUM", True)
        ' Ստուգել Տուն/Շենք դաշտի արժեքը
        Call Compare_Two_Values("Տուն/Շենք", Get_Rekvizit_Value("Document", Common.tabN, "General", "BUILDNUM"), Common.house)
        ' Ստուգել Էլ հասցե դաշտի արժեքը
        Call Compare_Two_Values("Էլ հասցե", Get_Rekvizit_Value("Document", Common.tabN, "General", "EMAIL"), Common.emailForCheck)
    Else
        'Անուն դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "RECEIVER", "![End][Del]" & Common.name)
        'Ազգանուն դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "RECEIVERLASTNAME", "![End][Del]" & Common.surname)
        'Ծննդյան ամսաթիվ դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "DATEBIRTH", Common.birthDate)
        'Քաղաքացիություն դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "CITIZENSHIP", Common.citizenship)
        'Երկիր դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "COUNTRY", Common.country)
        'Բնակավայր դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "COMMUNITY", Common.residence)
        'Քաղաք դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "CITY", Common.city)   
        'Բնակարան դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "APARTMENT", Common.apartment) 
        'Փողոց դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "ADDRESS", Common.street)
        'Տուն/Շենք դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "BUILDNUM", Common.house)
    End If
    
    'Անձը հաստ. փաստ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "PASSNUM", "[Home]!" & "[End]" & "[Del]" & Common.id)
    'Տիպ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "PASTYPE", Common.idType)
    'Տրված դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "PASBY", Common.idGivenBy)
    'Տրված ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "DATEPASS", Common.idGiveDate)
    'Վավեր է մինչև դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "DATEEXPIRE", Common.idValidUntil) 
    'Էլ հասցե դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "EMAIL", "[Home]!" & "[End]" & "[Del]" & Common.email)
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''CashOut_Charge''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Կնախիկ մուտք փաստաթղթի Գանձում բաժնի կլաս
Class CashOut_Charge
    Public tabN
    Public office
    Public department
    Public chargeAcc
    Public chargeAccForCheck
    Public chargeCurr
    Public chargeCurrForCheck
    Public cbExchangeRate
    Public chargeType
    Public chargeAmount
    Public chargeAmoForCheck
    Public chargePercent
    Public chargePerForCheck
    Public incomeAcc
    Public incomeAccCurr
    Public buyAndSell
    Public buyAndSellForCheck
    Public operType
    Public operPlace
    Public time
    Public timeForCheck
    Public operArea
    Public operAreaForCheck
    Public nonResident
    Public nonResidentForCheck
    Public legalStatus
    Public legalStatusForCheck
    Public comment
    Public commentForCheck
    Public clientAgreeData
    Public fillFields
    Public commonPaySys
    Public cashAmountOutChrg
    Public recalcOutChrg
    Public notGrCash
    Private Sub Class_Initialize()
        tabN = 2
        office = ""
        department = ""
        chargeAcc = ""
        chargeAccForCheck = ""
        chargeCurr = ""
        chargeCurrForCheck = ""
        cbExchangeRate = ""
        chargeType = ""
        chargeAmount = "0.00"
        chargeAmoForCheck = "0.00"
        chargePercent = "0.0000"
        chargePerForCheck = "0.0000"
        incomeAcc = ""
        incomeAccCurr = ""
        buyAndSell = ""
        buyAndSellForCheck = ""
        operType = ""
        operPlace = ""
        time = ""
        timeForCheck = ""
        operArea = ""
        operAreaForCheck = ""
        nonResident = 0
        nonResidentForCheck = 0
        legalStatus = ""
        legalStatusForCheck = ""
        comment = ""
        commentForCheck = ""
        clientAgreeData = ""
        fillFields = False
        commonPaySys = "Ð"
        cashAmountOutChrg = "0.00"
        recalcOutChrg = 0
        notGrCash = True
    End Sub
End Class

Function New_CashOut_Charge()
    Set New_CashOut_Charge = New CashOut_Charge
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''Fill_CashOut_Charge'''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Կանխիկ մուտք փաստաթղթի Գանձում բաժնի լրացման ֆունկցիա
' Charge - Կնախիկ մուտք փաստաթղթի Ընդհանուր բաժնի կլաս
Sub Fill_CashOut_Charge(Charge, payerLegalStatus)
    ' Ստուգել, որ Գրասենյակ դաշտը չխմբագրվող է
    Call Check_ReadOnly("Document", Charge.tabN, "Mask", "ACSBRANCHINC", True)
    ' Ստուգել Գրասենյակ դաշտի արժեքը
    Call Compare_Two_Values("Գրասենյակ", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "ACSBRANCHINC"), Charge.office)
    ' Ստուգել, որ Բաժին դաշտը չխմբագրվող է
    Call Check_ReadOnly("Document", Charge.tabN, "Mask", "ACSDEPARTINC", True)
    ' Ստուգել Բաժին դաշտի արժեքը
    Call Compare_Two_Values("Բաժին", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "ACSDEPARTINC"), Charge.department)
    ' Ստուգել, որ Գանձման հաշիվ դաշտը խմբագրվող է
    Call Check_ReadOnly("Document", Charge.tabN, "Mask", "CHRGACC", False)
    ' Ստուգել Գանձման հաշիվ դաշտի արժեքը
    Call Compare_Two_Values("Գանձման հաշիվ", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "CHRGACC"), Charge.chargeAccForCheck)
    ' Գանձման հաշիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", Charge.tabN, "General", "CHRGACC", Charge.ChargeAcc)
    If p1.WaitVBObject("frmAsMsgBox", 1000).Exists Then
        Call MessageExists(2, "¶³ÝÓÙ³Ý Ñ³ßÇíÁ ¹ñ³Ù³ÛÇÝ ã¿")
        Call ClickCmdButton(5, "OK")
    End If
    ' Ստուգել, որ Արժույթ դաշտը խմբագրվող է
    Call Check_ReadOnly("Document", Charge.tabN, "Mask", "CHRGCUR", False)
    ' Ստուգել Արժույթ դաշտի արժեքը
    Call Compare_Two_Values("Արժույթ", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "CHRGCUR"), Charge.chargeCurrForCheck)
    ' Արժույթ դաշտի լրացում
    Call Rekvizit_Fill("Document", Charge.tabN, "General", "CHRGCUR", Charge.chargeCurr)
    ' Ստուգել, որ ԿԲ փոխարժեք դաշտը չխմբագրվող է
    Call Check_ReadOnly("Document", Charge.tabN, "Course1", "CHRGCBCRS", True)
    ' Ստուգել ԿԲ փոխարժեք դաշտի արժեքը
    Call Compare_Two_Values("ԿԲ փոխարժեք", Get_Rekvizit_Value("Document", Charge.tabN, "Course", "CHRGCBCRS"), Charge.cbExchangeRate)
    ' Գանձման տեսակ դաշտի լրացում
    Call Rekvizit_Fill("Document", Charge.tabN, "General", "PAYSCALE", Charge.chargeType)
    ' Գումար դաշտի լրացում
    Call Rekvizit_Fill("Document", Charge.tabN, "General", "CHRGSUM", Charge.chargeAmount)
    ' Տոկոս դաշտի լրացում
    Call Rekvizit_Fill("Document", Charge.tabN, "General", "PRSNT", Charge.chargePercent)
    ' Եկամտի հաշիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", Charge.tabN, "General", "CHRGINC", Charge.incomeAcc)
    ' Ստուգել, որ Գործողության տեսակ դաշտը չխմբագրվող է
    Call Check_ReadOnly("Document", Charge.tabN, "Mask", "CURTES", True)
    ' Ստուգել, որ Գործողության վայր դաշտը չխմբագրվող է
    Call Check_ReadOnly("Document", Charge.tabN, "Mask", "CURVAIR", True)
    
    If Charge.incomeAccCurr <> Charge.chargeCurr and Charge.chargeAmount <> "0.00" Then
        ' Ստուգել, որ Առք/Վաճառք դաշտը խմբագրվող է
        Call Check_ReadOnly("Document", Charge.tabN, "Mask", "CUPUSA", False)
        ' Ստուգել Առք/Վաճառք դաշտի արժեքը
        Call Compare_Two_Values("Առք/Վաճառք", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "CUPUSA"), Charge.buyAndSellForCheck) 
        ' Առք/Վաճառք դաշտի լրացում
        Call Rekvizit_Fill("Document", Charge.tabN, "General", "CUPUSA", Charge.buyAndSell)
        ' Ստուգել Գործողության տեսակ դաշտի արժեքը
        Call Compare_Two_Values("Գործողության տեսակ", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "CURTES"), Charge.operType)
        ' Ստուգել Գործողության վայր դաշտի արժեքը
        Call Compare_Two_Values("Գործողության վայր", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "CURVAIR"), Charge.operPlace)
        ' Ստուգել, որ Ժամանակ դաշտը խմբագրվող է
        Call Check_ReadOnly("Document", Charge.tabN, "Mask", "TIME", False)
        If aqDateTime.Compare(aqConvert.DateTimeToFormatStr(aqDateTime.Time, "%H:%M"), "16:00") < 0 Then
            Charge.timeForCheck = "1"
        Else
            Charge.timeForCheck = "2"
        End If
        ' Ստուգել Ժամանակ դաշտի արժեքը
        Call Compare_Two_Values("Ժամանակ", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "TIME"), Charge.timeForCheck)
        ' Ժամանակ դաշտի լրացում
        Call Rekvizit_Fill("Document", Charge.tabN, "General", "TIME", Charge.time)
    Else 
        ' Ստուգել, որ Առք/Վաճառք դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Charge.tabN, "Mask", "CUPUSA", True)
        ' Ստուգել Առք/Վաճառք դաշտի արժեքը
        Call Compare_Two_Values("Առք/Վաճառք", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "CUPUSA"), "") 
        ' Ստուգել Գործողության տեսակ դաշտի արժեքը
        Call Compare_Two_Values("Գործողության տեսակ", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "CURTES"), "")
        ' Ստուգել Գործողության վայր դաշտի արժեքը
        Call Compare_Two_Values("Գործողության վայր", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "CURVAIR"), "")
        ' Ստուգել, որ Ժամանակ դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Charge.tabN, "Mask", "TIME", True)
        ' Ստուգել Ժամանակ դաշտի արժեքը
        Call Compare_Two_Values("Ժամանակ", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "TIME"), "")
    End If
    
    If Charge.incomeAcc = "" or Charge.chargeAmount = "0.00" or Charge.ChargeAcc = "" Then
        ' Ստուգել, որ Մեկնաբանություն դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Charge.tabN, "General", "COMM", True)
        ' Ստուգել Մեկնաբանություն դաշտի արժեքը
        Call Compare_Two_Values("Մեկնաբանություն", Get_Rekvizit_Value("Document", Charge.tabN, "General", "COMM"), "")
    Else 
        ' Ստուգել, որ Մեկնաբանություն դաշտը խմբագրվող է
        Call Check_ReadOnly("Document", Charge.tabN, "General", "COMM", False)
        ' Ստուգել Մեկնաբանություն դաշտի արժեքը
        Call Compare_Two_Values("Մեկնաբանություն", Get_Rekvizit_Value("Document", Charge.tabN, "General", "COMM"), Charge.commentForCheck)
        ' Մեկնաբանություն դաշտի լրացում
        Call Rekvizit_Fill("Document", Charge.tabN, "General", "COMM", "[Home]!" & "[End]" & "[Del]" & Charge.comment)
    End If
    
    If Charge.notGrCash Then
        If payerLegalStatus = "ֆիզԱնձ" Then
            ' Ստուգել, որ  Հաճ.պայմանագ.տվյալներ դաշտը չխմբագրվող է
            Call Check_ReadOnly("Document", Charge.tabN, "General", "AGRDETAILS", True)
            ' Ստուգել Հաճ.պայմանագ.տվյալներ դաշտի արժեքը
            Call Compare_Two_Values("Հաճ.պայմանագ.տվյալներ", Get_Rekvizit_Value("Document", Charge.tabN, "General", "AGRDETAILS"), Charge.clientAgreeData)
        Else
            ' Ստուգել, որ  Հաճ.պայմանագ.տվյալներ դաշտը խմբագրվող է
            Call Check_ReadOnly("Document", Charge.tabN, "General", "AGRDETAILS", False)
            ' Հաճ.պայմանագ.տվյալներ դաշտի լրացում
            Call Rekvizit_Fill("Document", Charge.tabN, "General", "AGRDETAILS", Charge.clientAgreeData)
        End If
    End If
    
    ' Ստուգել Գործողության ոլորտ դաշտի արժեքը
    Call Compare_Two_Values("Գործողության ոլորտ", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "VOLORT"), Charge.operAreaForCheck)
    ' Գործողության ոլորտ դաշտի լրացում
    Call Rekvizit_Fill("Document", Charge.tabN, "General", "VOLORT", Charge.operArea)
    ' Ստուգել Ոչ ռեզիդենտ նշիչի արժեքը
    Call Compare_Two_Values("Ոչ ռեզիդենտ", Get_Rekvizit_Value("Document", Charge.tabN, "CheckBox", "NONREZ"), Charge.nonResidentForCheck)
    ' Ոչ ռեզիդենտ նշիչի լրացում
    Call Rekvizit_Fill("Document", Charge.tabN, "CheckBox", "NONREZ", Charge.nonResident)
    ' Ստուգել Իրավաբանական կարգավիճակ դաշտի արժեքը
    Call Compare_Two_Values("Իրավաբանական կարգավիճակ", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "JURSTAT"), Charge.legalStatusForCheck)
    ' Իրավաբանական կարգավիճակ դաշտի լրացում
    Call Rekvizit_Fill("Document", Charge.tabN, "General", "JURSTAT", Charge.legalStatus)
    
    If Charge.notGrCash Then
        If Not Charge.fillFields Then
            ' Ստուգել, որ  Կանխիկ գում. չգանձվող մաս դաշտը չխմբագրվող է
            Call Check_ReadOnly("Document", Charge.tabN, "General", "NOCRGSUM", True)
            ' Ստուգել Կանխիկ գում. չգանձվող մաս դաշտի արժեքը
            Call Compare_Two_Values("Կանխիկ գում. չգանձվող մաս", Get_Rekvizit_Value("Document", Charge.tabN, "General", "NOCRGSUM"), Charge.cashAmountOutChrg)
            ' Ստուգել, որ  Վերահաշվ. չգանձվող մասը նշիչը չխմբագրվող է
            Call Check_ReadOnly("Document", Charge.tabN, "CheckBox", "FRSHNOCRG", True)
            ' Ստուգել Վերահաշվ. չգանձվող մասը նշիչի արժեքը
            Call Compare_Two_Values("Վերահաշվ. չգանձվող մասը", Get_Rekvizit_Value("Document", Charge.tabN, "CheckBox", "FRSHNOCRG"), Charge.recalcOutChrg)
            ' Ստուգել, որ  Ընդ. վճ. համակարգ դաշտը չխմբագրվող է
            Call Check_ReadOnly("Document", Charge.tabN, "Mask", "PAYSYSIN", True)
            ' Ստուգել Ընդ. վճ. համակարգ դաշտի արժեքը
            Call Compare_Two_Values("Ընդ. վճ. համակարգ", Get_Rekvizit_Value("Document", Charge.tabN, "Mask", "PAYSYSIN"), Charge.commonPaySys)
        Else
            ' Ստուգել, որ  Կանխիկ գում. չգանձվող մաս դաշտը չխմբագրվող է
            Call Check_ReadOnly("Document", Charge.tabN, "General", "NOCRGSUM", False)
            ' Կանխիկ գում. չգանձվող մաս դաշտի լրացում
            Call Rekvizit_Fill("Document", Charge.tabN, "General", "NOCRGSUM", Charge.cashAmountOutChrg)
            ' Ստուգել, որ  Վերահաշվ. չգանձվող մասը նշիչը չխմբագրվող է
            Call Check_ReadOnly("Document", Charge.tabN, "CheckBox", "FRSHNOCRG", False)
            ' Վերահաշվ. չգանձվող մասը նշիչի լրացում
            Call Rekvizit_Fill("Document", Charge.tabN, "CheckBox", "FRSHNOCRG", Charge.recalcOutChrg)
            ' Ստուգել, որ  Ընդ. վճ. համակարգ դաշտը չխմբագրվող է
            Call Check_ReadOnly("Document", Charge.tabN, "Mask", "PAYSYSIN", False)
            ' Ընդ. վճ. համակարգ դաշտի լրացում
            Call Rekvizit_Fill("Document", Charge.tabN, "General", "PAYSYSIN", Charge.commonPaySys)
        End If
    End If
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''CashOut_Coin''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Կնախիկ մուտք փաստաթղթի Մանրադրամ բաժնի կլաս
Class CashOut_Coin
    Public tabN
    Public coin
    Public coinForCheck
    Public coinPayCurr
    Public coinPayAcc
    Public coinExchangeRate
    Public coinCBExchangeRate
    Public coinBuyAndSell
    Public coinPayAmount
    Public coinPayAmountForCheck
    Public amountWithMainCurr
    Public amountCurrForCheck
    Public incomeOutChange
    Public damagesOutChange
    Public roundedAmount
    Public roundedAmountForCheck
    Private Sub Class_Initialize()
        tabN = 3
        coin = "0.00"
        coinForCheck = "0.00"
        coinPayCurr = ""
        coinPayAcc = ""
        coinExchangeRate = "0/0"
        coinCBExchangeRate = "0/0"
        coinBuyAndSell = ""
        coinPayAmount = "0.00"
        coinPayAmountForCheck = "0.00"
        amountWithMainCurr = "0.00"
        amountCurrForCheck = "0.00"
        incomeOutChange = ""
        damagesOutChange = ""
        roundedAmount = "0.00"
        roundedAmountForCheck = "0.00"
    End Sub
End Class

Function New_CashOut_Coin()
    Set New_CashOut_Coin = New CashOut_Coin
End Function

Sub Fill_CashOut_Coin(Coin, curr)
    If curr = "000" Then
        ' Ստուգել, որ Մանրադրամ դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "General", "XSUM", True)
        ' Ստուգել Մանրադրամ դաշտի արժեքը
        Call Compare_Two_Values("Մանրադրամ", Get_Rekvizit_Value("Document", Coin.tabN, "General", "XSUM"), "0.00")
        ' Ստուգել, որ Մանրադրամի վճարման արժույթ դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "Mask", "XCUR", True)
        ' Ստուգել Մանրադրամի վճարման արժույթ դաշտի արժեքը
        Call Compare_Two_Values("Մանրադրամի վճարման արժույթ", Get_Rekvizit_Value("Document", Coin.tabN, "Mask", "XCUR"), "") 
        ' Ստուգել, որ Մանրադրամի վճարման հաշիվ դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "Mask", "XACC", True)
        ' Ստուգել Մանրադրամի վճարման հաշիվ դաշտի արժեքը
        Call Compare_Two_Values("Մանրադրամի վճարման հաշիվ", Get_Rekvizit_Value("Document", Coin.tabN, "Mask", "XACC"), "") 
        ' Ստուգել, որ Փոխարժեք դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "Course1", "XDLCRS", True)
        ' Ստուգել Փոխարժեք դաշտի արժեքը
        Call Compare_Two_Values("Փոխարժեք", Get_Rekvizit_Value("Document", Coin.tabN, "Course", "XDLCRS"), "0/0")
        ' Ստուգել, որ ԿԲ փոխարժեք դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "Course1", "XCBCRS", True)
        ' Ստուգել ԿԲ փոխարժեք դաշտի արժեքը
        Call Compare_Two_Values("ԿԲ փոխարժեք", Get_Rekvizit_Value("Document", Coin.tabN, "Course", "XCBCRS"), "0/0")
        ' Ստուգել Առք/Վաճառք դաշտի արժեքը
        Call Compare_Two_Values("Առք/Վաճառք", Get_Rekvizit_Value("Document", Coin.tabN, "Mask", "XCUPUSA"), "") 
        ' Ստուգել, որ Մանրադրամի վճարման գումար դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "General", "XCURSUM", True)
        ' Ստուգել Մանրադրամի վճարման գումար դաշտի արժեքը
        Call Compare_Two_Values("Մանրադրամի վճարման գումար", Get_Rekvizit_Value("Document", Coin.tabN, "General", "XCURSUM"), "0.00") 
        ' Ստուգել, որ Գումար հիմնական արժույթով դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "General", "XSUMMAIN", True)
        ' Ստուգել Գումար հիմնական արժույթով դաշտի արժեքը
        Call Compare_Two_Values("Գումար հիմնական արժույթով", Get_Rekvizit_Value("Document", Coin.tabN, "General", "XSUMMAIN"), "0.00")
        ' Ստուգել, որ Եկամուտներ արտ. փոխանակումից դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "Mask", "XINC", True)
        ' Ստուգել Եկամուտներ արտ. փոխանակումից դաշտի արժեքը
        Call Compare_Two_Values("Եկամուտներ արտ. փոխանակումից", Get_Rekvizit_Value("Document", Coin.tabN, "Mask", "XINC"), "") 
        ' Ստուգել, որ Վնասներ արտ. փոխանակումից դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "Mask", "XEXP", True)
        ' Ստուգել Վնասներ արտ. փոխանակումից դաշտի արժեքը
        Call Compare_Two_Values("Վնասներ արտ. փոխանակումից", Get_Rekvizit_Value("Document", Coin.tabN, "Mask", "XEXP"), "")
        ' Ստուգել, որ  Կլորացված գումար դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "General", "ROUNDSUM", True)
        ' Ստուգել Կլորացված գումար դաշտի արժեքը
        Call Compare_Two_Values("Կլորացված գումար", Get_Rekvizit_Value("Document", Coin.tabN, "General", "ROUNDSUM"), "0.00")
    Else
        ' Մանրադրամ դաշտի լրացում
        Call Rekvizit_Fill("Document", Coin.tabN, "General", "XSUM", Coin.coin)
        If Coin.coin <> "0.00" Then
            ' Մանրադրամի վճարման արժույթ դաշտի լրացում
            Call Rekvizit_Fill("Document", Coin.tabN, "General", "XCUR", Coin.coinPayCurr)
            ' Մանրադրամի վճարման հաշիվ դաշտի լրացում
            Call Rekvizit_Fill("Document", Coin.tabN, "General", "XACC", Coin.coinPayAcc)
            ' Ստուգել Մանրադրամի վճարման գումար դաշտի արժեքը
            Call Compare_Two_Values("Մանրադրամի վճարման գումար", Get_Rekvizit_Value("Document", Coin.tabN, "General", "XCURSUM"), Coin.coinPayAmountForCheck) 
            ' Մանրադրամի վճարման գումար դաշտի լրացում
            Call Rekvizit_Fill("Document", Coin.tabN, "General", "XCURSUM", Coin.coinPayAmount)
        End If
        ' Ստուգել, որ Փոխարժեք դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "Course1", "XDLCRS", True)
        ' Ստուգել Փոխարժեք դաշտի արժեքը
        Call Compare_Two_Values("Փոխարժեք", Get_Rekvizit_Value("Document", Coin.tabN, "Course", "XDLCRS"), Coin.coinExchangeRate)
        ' Ստուգել, որ ԿԲ փոխարժեք դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "Course1", "XCBCRS", True)
        ' Ստուգել ԿԲ փոխարժեք դաշտի արժեքը
        Call Compare_Two_Values("ԿԲ փոխարժեք", Get_Rekvizit_Value("Document", Coin.tabN, "Course", "XCBCRS"), Coin.coinCBExchangeRate)
        ' Ստուգել, որ Գումար հիմնական արժույթով դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "General", "XSUMMAIN", True)
        ' Ստուգել Գումար հիմնական արժույթով դաշտի արժեքը
        Call Compare_Two_Values("Գումար հիմնական արժույթով", Get_Rekvizit_Value("Document", Coin.tabN, "General", "XSUMMAIN"), Coin.amountCurrForCheck)
        ' Ստուգել, որ Եկամուտներ արտ. փոխանակումից դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "Mask", "XINC", True)
        ' Ստուգել Եկամուտներ արտ. փոխանակումից դաշտի արժեքը
        Call Compare_Two_Values("Եկամուտներ արտ. փոխանակումից", Get_Rekvizit_Value("Document", Coin.tabN, "Mask", "XINC"), Coin.incomeOutChange) 
        ' Ստուգել, որ Վնասներ արտ. փոխանակումից դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "Mask", "XEXP", True)
        ' Ստուգել Վնասներ արտ. փոխանակումից դաշտի արժեքը
        Call Compare_Two_Values("Վնասներ արտ. փոխանակումից", Get_Rekvizit_Value("Document", Coin.tabN, "Mask", "XEXP"), Coin.damagesOutChange)
        ' Ստուգել, որ  Կլորացված գումար դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Coin.tabN, "General", "ROUNDSUM", True)
        ' Ստուգել Կլորացված գումար դաշտի արժեքը
        Call Compare_Two_Values("Կլորացված գումար", Get_Rekvizit_Value("Document", Coin.tabN, "General", "ROUNDSUM"), Coin.roundedAmount)
    End If
    ' Ստուգել, որ Առք/Վաճառք դաշտը չխմբագրվող է
    Call Check_ReadOnly("Document", Coin.tabN, "Mask", "XCUPUSA", True)
    ' Ստուգել Առք/Վաճառք դաշտի արժեքը
    Call Compare_Two_Values("Առք/Վաճառք", Get_Rekvizit_Value("Document", Coin.tabN, "Mask", "XCUPUSA"), Coin.coinBuyAndSell)
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''CashOutput''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Կանխիկ մուտք փաստաթղթի կլաս
Class CashOutput
    Public fIsn 
    Public commonTab 
    Public chargeTab
    Public coinTab
    Public attachedTab
    Private Sub Class_Initialize()
        fIsn = ""
        Set commonTab = New_CashOut_Common()
        Set chargeTab = New_CashOut_Charge()
        Set coinTab = New_CashOut_Coin()
        Set attachedTab = New_Attached_Tab(f_Count, l_Count, d_Count)
    End Sub
End Class

Function New_CashOutput(attachedFiles, attachedLinks, deleteFiles)
    f_Count = attachedFiles
    l_Count = attachedLinks
    d_Count = deleteFiles
    Set New_CashOutput = New CashOutput
End Function

Sub Fill_CashOutput(CashOutput, button)
    Call Fill_CashOut_Common(CashOutput.commonTab)
    Call Fill_CashOut_Charge(CashOutput.chargeTab, CashOutput.commonTab.payerLegalStatus)
    Call Fill_CashOut_Coin(CashOutput.coinTab, CashOutput.commonTab.curr)
    Call Fill_Attached_Tab(CashOutput.attachedTab)
    Call ClickCmdButton(1, button)
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''Create_Cash_Output'''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Կանխիկի մուտք փաստաթղթի ստեղծում
' CashOut - Կանխիկի մուտք փաստաթղթի լրացման կլաս
Sub Create_Cash_Output(CashOutput, button)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_InnerOpers &"|"& c_CashOut)
    If wMDIClient.WaitvbObject("frmASDocForm", 3000).Exists Then 
        'ISN-ի վերագրում փոփոխականին
        CashOutput.fIsn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
        Call Fill_CashOutput(CashOutput, button)
    Else 
        Log.Error "Can't open frmASDocForm window.", "", pmNormal, ErrorColor 
    End If
End Sub

' Կանխիկ մուտք փաստաթղթի արժեքների ստուգում
' CashOut - Կանխիկ մուտք փաստաթղթի լրացման կլաս
Sub Check_Cash_Output(CashOut)
    Dim i
    ' Ստուգել Գրասենյակ դաշտի արժեքը
    Call Compare_Two_Values("Գրասենյակ", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Mask", "ACSBRANCH"), CashOut.commonTab.office)
    ' Ստուգել Բաժին դաշտի արժեքը
    Call Compare_Two_Values("Բաժին", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Mask", "ACSDEPART"), CashOut.commonTab.department)
    ' Ստուգել Փաստաթղթի N դաշտի արժեքը
    Call Compare_Two_Values("Փաստաթղթի N", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "General", "DOCNUM"), CashOut.commonTab.docNum)
    ' Ստուգել Հաշիվ կրեդիտ դաշտի արժեքը
    Call Compare_Two_Values("Հաշիվ կրեդիտ", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Mask", "ACCDB"), CashOut.commonTab.accDebet)
    ' Ստուգել Արժույթ դաշտի արժեքը
    Call Compare_Two_Values("Արժույթ", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Mask", "CUR"), CashOut.commonTab.curr)
    ' Ստուգել Ամսաթիվ դաշտի արժեքը
    Call Compare_Two_Values("Ամսաթիվ", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "General", "DATE"), CashOut.commonTab.dateForCheck)
    ' Ստուգել Դրամարկղ դաշտի արժեքը
    Call Compare_Two_Values("Դրամարկղ", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Mask", "KASSA"), CashOut.commonTab.cashRegister)
    ' Ստուգել Դրամարկղի հաշիվ դաշտի արժեքը
    Call Compare_Two_Values("Դրամարկղի հաշիվ", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Mask", "ACCCR"), CashOut.commonTab.cashRegisterAcc)
    ' Ստուգել Գումար դաշտի արժեքը
    Call Compare_Two_Values("Գումար", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "General", "SUMMA"), CashOut.commonTab.amountForCheck)
    ' Ստուգել Դրամարկղի նիշ դաշտի արժեքը
    Call Compare_Two_Values("Դրամարկղի նիշ", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Mask", "KASSIMV"), CashOut.commonTab.cashierChar)
    ' Ստուգել Հիմք դաշտի արժեքը
    Call Compare_Two_Values("Հիմք", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Comment", "BASE"), CashOut.commonTab.base)
    ' Ստուգել Նպատակ դաշտի արժեքը
    Call Compare_Two_Values("Նպատակ", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Comment", "AIM"), CashOut.commonTab.aim)
    ' Ստուգել Մուծող դաշտի արժեքը
    Call Compare_Two_Values("Մուծող", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Mask", "CLICODE"), CashOut.commonTab.payer)
    ' Ստուգել Անուն դաշտի արժեքը
    Call Compare_Two_Values("Անուն", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Comment", "RECEIVER"), CashOut.commonTab.name)
    ' Ստուգել Ազգանուն դաշտի արժեքը
    Call Compare_Two_Values("Ազգանուն", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "General", "RECEIVERLASTNAME"), CashOut.commonTab.surname)
    ' Ստուգել Անձը հաստ. փաստթ. կոդ դաշտի արժեքը
    Call Compare_Two_Values("Անձը հաստ. փաստթ. կոդ", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Comment", "PASSNUM"), CashOut.commonTab.id)
    ' Ստուգել Տիպ դաշտի արժեքը
    Call Compare_Two_Values("Տիպ", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Mask", "PASTYPE"), CashOut.commonTab.idType)
    ' Ստուգել Տրված դաշտի արժեքը
    Call Compare_Two_Values("Տրված", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "General", "PASBY"), CashOut.commonTab.idGivenBy)
    ' Ստուգել Տրված ամսաթիվ դաշտի արժեքը
    Call Compare_Two_Values("Տրված ամսաթիվ", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "General", "DATEPASS"), CashOut.commonTab.idGiveDateForCheck)
    ' Ստուգել Վավեր է մինչև դաշտի արժեքը
    Call Compare_Two_Values("Վավեր է մինչև", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "General", "DATEEXPIRE"), CashOut.commonTab.idValidUntilForCheck)
    ' Ստուգել Ծննդյան ամսաթիվ դաշտի արժեքը
    Call Compare_Two_Values("Ծննդյան ամսաթիվ", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "General", "DATEBIRTH"), CashOut.commonTab.birthDateForCheck)
    ' Ստուգել Քաղաքացիություն դաշտի արժեքը
    Call Compare_Two_Values("Քաղաքացիություն", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Mask", "CITIZENSHIP"), CashOut.commonTab.citizenship)
    ' Ստուգել Երկիր դաշտի արժեքը
    Call Compare_Two_Values("Երկիր", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Mask", "COUNTRY"), CashOut.commonTab.country)
    ' Ստուգել Բնակավայր դաշտի արժեքը
    Call Compare_Two_Values("Բնակավայր", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "Mask", "COMMUNITY"), CashOut.commonTab.residence)
    ' Ստուգել Քաղաք դաշտի արժեքը
    Call Compare_Two_Values("Քաղաք", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "General", "CITY"), CashOut.commonTab.city)
    ' Ստուգել Բնակարան դաշտի արժեքը
    Call Compare_Two_Values("Բնակարան", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "General", "APARTMENT"), CashOut.commonTab.apartment)
    ' Ստուգել Փողոց դաշտի արժեքը
    Call Compare_Two_Values("Փողոց", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "General", "ADDRESS"), CashOut.commonTab.street)
    ' Ստուգել Տուն/Շենք դաշտի արժեքը
    Call Compare_Two_Values("Տուն/Շենք", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "General", "BUILDNUM"), CashOut.commonTab.house)
    ' Ստուգել Էլ հասցե դաշտի արժեքը
    Call Compare_Two_Values("Էլ հասցե", Get_Rekvizit_Value("Document", CashOut.commonTab.tabN, "General", "EMAIL"), CashOut.commonTab.email)
    
    ' Ստուգել Գրասենյակ դաշտի արժեքը
    Call Compare_Two_Values("Գրասենյակ", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Mask", "ACSBRANCHINC"), CashOut.chargeTab.office)
    ' Ստուգել Բաժին դաշտի արժեքը
    Call Compare_Two_Values("Բաժին", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Mask", "ACSDEPARTINC"), CashOut.chargeTab.department)
    ' Ստուգել Գանձման հաշիվ դաշտի արժեքը
    Call Compare_Two_Values("Գանձման հաշիվ", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Mask", "CHRGACC"), CashOut.chargeTab.chargeAcc)
    ' Ստուգել Արժույթ դաշտի արժեքը
    Call Compare_Two_Values("Արժույթ", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Mask", "CHRGCUR"), CashOut.chargeTab.chargeCurrForCheck)
    ' Ստուգել ԿԲ փոխարժեք դաշտի արժեքը
    Call Compare_Two_Values("ԿԲ փոխարժեք", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Course", "CHRGCBCRS"), CashOut.chargeTab.cbExchangeRate)
    ' Ստուգել Գանձման տեսակ դաշտի արժեքը
    Call Compare_Two_Values("Գանձման տեսակ", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Mask", "PAYSCALE"), CashOut.chargeTab.chargeType)
    ' Ստուգել Գումար դաշտի արժեքը
    Call Compare_Two_Values("Գումար_2", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "General", "CHRGSUM"), CashOut.chargeTab.chargeAmoForCheck) 
    ' Ստուգել Տոկոս դաշտի արժեքը
    Call Compare_Two_Values("Տոկոս", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "General", "PRSNT"), CashOut.chargeTab.chargePerForCheck) 
    ' Ստուգել Եկամտի հաշիվ դաշտի արժեքը
    Call Compare_Two_Values("Եկամտի հաշիվ", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Mask", "CHRGINC"), CashOut.chargeTab.incomeAcc) 
    ' Ստուգել Կանխիկ գում. չգանձվող մաս դաշտի արժեքը
    Call Compare_Two_Values("Կանխիկ գում. չգանձվող մաս", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "General", "NOCRGSUM"), CashOut.chargeTab.cashAmountOutChrg)
    ' Ստուգել Վերահաշվ. չգանձվող մասը նշիչի արժեքը
    Call Compare_Two_Values("Վերահաշվ. չգանձվող մասը", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "CheckBox", "FRSHNOCRG"), CashOut.chargeTab.recalcOutChrg)
    ' Ստուգել Առք/Վաճառք դաշտի արժեքը
    Call Compare_Two_Values("Առք/Վաճառք", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Mask", "CUPUSA"), CashOut.chargeTab.buyAndSellForCheck) 
    ' Ստուգել Գործողության տեսակ դաշտի արժեքը
    Call Compare_Two_Values("Գործողության տեսակ", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Mask", "CURTES"), CashOut.chargeTab.operType)
    ' Ստուգել Գործողության վայր դաշտի արժեքը
    Call Compare_Two_Values("Գործողության վայր", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Mask", "CURVAIR"), CashOut.chargeTab.operPlace)
    ' Ստուգել Ժամանակ դաշտի արժեքը
    Call Compare_Two_Values("Ժամանակ", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Mask", "TIME"), CashOut.chargeTab.timeForCheck)
    ' Ստուգել Գործողության ոլորտ դաշտի արժեքը
    Call Compare_Two_Values("Գործողության ոլորտ", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Mask", "VOLORT"), CashOut.chargeTab.operAreaForCheck)
    ' Ստուգել Ոչ ռեզիդենտ դաշտի արժեքը
    Call Compare_Two_Values("Ոչ ռեզիդենտ", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "CheckBox", "NONREZ"), CashOut.chargeTab.nonResidentForCheck)
    ' Ստուգել Իրավաբանական կարգավիճակ դաշտի արժեքը
    Call Compare_Two_Values("Իրավաբանական կարգավիճակ", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Mask", "JURSTAT"), CashOut.chargeTab.legalStatusForCheck)
    ' Ստուգել Մեկնաբանություն դաշտի արժեքը
    Call Compare_Two_Values("Մեկնաբանություն", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "General", "COMM"), CashOut.chargeTab.commentForCheck)
    ' Ստուգել Հաճ.պայմանագ.տվյալներ դաշտի արժեքը
    Call Compare_Two_Values("Հաճ.պայմանագ.տվյալներ", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "General", "AGRDETAILS"), CashOut.chargeTab.clientAgreeData)
    ' Ստուգել Ընդ. վճ. համակարգ դաշտի արժեքը
    Call Compare_Two_Values("Ընդ. վճ. համակարգ", Get_Rekvizit_Value("Document", CashOut.chargeTab.tabN, "Mask", "PAYSYSIN"), CashOut.chargeTab.commonPaySys)

    ' Ստուգել Մանրադրամ դաշտի արժեքը
    Call Compare_Two_Values("Մանրադրամ", Get_Rekvizit_Value("Document", CashOut.coinTab.tabN, "General", "XSUM"), CashOut.coinTab.coinForCheck)
    ' Ստուգել Մանրադրամի վճարման արժույթ դաշտի արժեքը
    Call Compare_Two_Values("Մանրադրամի վճարման արժույթ", Get_Rekvizit_Value("Document", CashOut.coinTab.tabN, "Mask", "XCUR"), CashOut.coinTab.coinPayCurr) 
    ' Ստուգել Մանրադրամի վճարման հաշիվ դաշտի արժեքը
    Call Compare_Two_Values("Մանրադրամի վճարման հաշիվ", Get_Rekvizit_Value("Document", CashOut.coinTab.tabN, "Mask", "XACC"), CashOut.coinTab.coinPayAcc) 
    ' Ստուգել Փոխարժեք դաշտի արժեքը
    Call Compare_Two_Values("Փոխարժեք", Get_Rekvizit_Value("Document", CashOut.coinTab.tabN, "Course", "XDLCRS"), CashOut.coinTab.coinExchangeRate)
    ' Ստուգել ԿԲ փոխարժեք դաշտի արժեքը
    Call Compare_Two_Values("ԿԲ փոխարժեք", Get_Rekvizit_Value("Document", CashOut.coinTab.tabN, "Course", "XCBCRS"), CashOut.coinTab.coinCBExchangeRate) 
    ' Ստուգել Առք/Վաճառք դաշտի արժեքը
    Call Compare_Two_Values("Առք/Վաճառք", Get_Rekvizit_Value("Document", CashOut.coinTab.tabN, "Mask", "XCUPUSA"), CashOut.coinTab.coinBuyAndSell) 
    ' Ստուգել Մանրադրամի վճարման գումար դաշտի արժեքը
    Call Compare_Two_Values("Մանրադրամի վճարման գումար", Get_Rekvizit_Value("Document", CashOut.coinTab.tabN, "General", "XCURSUM"), CashOut.coinTab.coinPayAmountForCheck) 
    ' Ստուգել Գումար հիմնական արժույթով դաշտի արժեքը
    Call Compare_Two_Values("Գումար հիմնական արժույթով", Get_Rekvizit_Value("Document", CashOut.coinTab.tabN, "General", "XSUMMAIN"), CashOut.coinTab.amountCurrForCheck)
    ' Ստուգել Եկամուտներ արտ. փոխանակումից դաշտի արժեքը
    Call Compare_Two_Values("Եկամուտներ արտ. փոխանակումից", Get_Rekvizit_Value("Document", CashOut.coinTab.tabN, "Mask", "XINC"), CashOut.coinTab.incomeOutChange) 
    ' Ստուգել Վնասներ արտ. փոխանակումից դաշտի արժեքը
    Call Compare_Two_Values("Վնասներ արտ. փոխանակումից", Get_Rekvizit_Value("Document", CashOut.coinTab.tabN, "Mask", "XEXP"), CashOut.coinTab.damagesOutChange)
    ' Ստուգել Կլորացված գումար դաշտի արժեքը
    Call Compare_Two_Values("Կլորացված գումար", Get_Rekvizit_Value("Document", CashOut.coinTab.tabN, "General", "ROUNDSUM"), CashOut.coinTab.roundedAmountForCheck) 
    
    Call GoTo_ChoosedTab(CashOut.attachedTab.tabN)
    ' Ստուգել, որ ֆայլերը առկա են
    For i = 0 To CashOut.attachedTab.filesCount - 1
        If Not SearchInAttachList (CashOut.attachedTab.fileName(i), CashOut.attachedTab.tabN) Then
           Log.Error "Can't find searched " & CashOut.attachedTab.addFiles(i) & " row.", "", pmNormal, ErrorColor
        End If
    Next
    For i = 0 To CashOut.attachedTab.linksCount - 1
        If Not SearchInAttachList (CashOut.attachedTab.addLinks(i), CashOut.attachedTab.tabN) Then
           Log.Error "Can't find searched " & CashOut.attachedTab.addLinks(i) & " row.", "", pmNormal, ErrorColor
        End If
    Next
End Sub

' Կանխիկ մուտք փաստաթղթի խմբագրում
' OldCashOut - հին Կանխիկ մուտք փաստաթղթի լրացման կլաս
' EditCashOut - նոր Կանխիկ մուտք փաստաթղթի լրացման կլաս
Sub Edit_Cash_Output(OldCashOut, EditCashOut, button)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToEdit)
    If wMDIClient.WaitvbObject("frmASDocForm", 3000).Exists Then 
        Call Check_Cash_Output(OldCashOut)
        EditCashOut.fIsn = OldCashOut.fIsn
        EditCashOut.commonTab.DocNum = OldCashOut.commonTab.DocNum
        Call GoTo_ChoosedTab(OldCashOut.commonTab.tabN)
        Call Fill_CashOutput(EditCashOut, button)
    Else 
        Log.Error "Can't open frmASDocForm window.", "", pmNormal, ErrorColor 
    End If
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''GroupCashOut_Common''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Խմբային Կանխիկ ելք  փաստաթղթի Ընդհանուր բաժնի կլաս
Class GroupCashOut_Common 
    Public tabN
    Public wOffice
    Public wDepartment
    Public docNum 
    Public wDate
    Public dateForCheck
    Public cashRegister
    Public cashRegisterAcc 
    Public wCurr
    Public amountForCheck
    Public cashierChar
    Public wBase
    Public gridRowCount
    Public wAcc()
    Public wSum()
    Public wAim()
    Public nonChargPart()
    Public reCalc 
    Public wPayer
    Public payerLegalStatus
    Public wName
    Public wSurname
    Public wId
    Public wIdCheck
    Public idType
    Public idTypeForCheck
    Public idGivenBy
    Public idGivenByCheck
    Public idGivenByForCheck
    Public idGiveDate
    Public idGiveDateForCheck
    Public idTypeCheck
    Public idValidUntil
    Public idValidUntilForCheck
    Public birthDate
    Public birthDateForCheck
    Public wCitizenship
    Public wCountry
    Public wResidence
    Public wCity 
    Public wStreet
    Public wApartment
    Public wHouse
    Public wEmail
    Public emailForCheck
    Private Sub Class_Initialize()
        tabN = 1
        wOffice = ""
        wDepartment = ""
        docNum = ""
        wDate = ""
        dateForCheck = "/ /"
        cashRegister = ""
        cashRegisterAcc = ""
        wCurr = ""
        amountForCheck = "0.00"
        cashierChar = ""
        wBase = ""
        gridRowCount = grRowCount
        ReDim wAcc(gridRowCount)
        ReDim wSum(gridRowCount)
        ReDim wAim(gridRowCount)
        ReDim nonChargPart(gridRowCount)
        reCalc = False
        wPayer = ""
        payerLegalStatus = ""
        wName = ""
        wSurname = ""
        wId = ""
        wIdCheck = ""
        idType = ""
        idTypeForCheck = ""
        idGivenBy = ""
        idGivenByForCheck = ""
        idTypeCheck = ""
        idGiveDate = ""
        idGivenByCheck = "/  /"
        idValidUntil = ""
        idValidUntilForCheck = "/  /"
        birthDate = ""
        birthDateForCheck = "/  /"
        wCitizenship = ""
        wCountry = ""
        wResidence = ""
        wCity = ""
        wStreet = ""
        wApartment = ""
        wHouse = ""
        wEmail = ""
        emailForCheck = ""
    End Sub
End Class

Function New_GroupCashOut_Common()
    Set New_GroupCashOut_Common = New GroupCashOut_Common
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''Fill_GroupCashOut_Common'''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Խմբային Կանխիկ ելք  փաստաթղթի Ընդհանուր բաժնի լրացման ֆունկցիա
' Common - Խմբային Կնախիկ ելք փաստաթղթի Ընդհանուր բաժնի կլաս
Sub Fill_GroupCashOut_Common(Common)
    Dim i 
    'Գրասենյակ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "ACSBRANCH", Common.wOffice)
    'Բաժին դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "ACSDEPART", Common.wDepartment)
    'Փաստաթղթի N դաշտի արժեքի վերագրում փոփոխականին
    Common.docNum = Get_Rekvizit_Value("Document", Common.tabN, "General", "DOCNUM")
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "DATE", "^A[Del]" & Common.wDate)
    'Դրամարկղ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "KASSA", "^A[Del]" & Common.cashRegister)
    'Դրամարկղի հաշիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "ACCCR", "[Home]" & Common.cashRegisterAcc)
    ' Ստուգել, որ Արժույթ դաշտը չխմբագրվող է
    Call Check_ReadOnly("Document", Common.tabN, "Mask", "CUR", True)
    ' Ստուգել Արժույթ դաշտի արժեքը
    Call Compare_Two_Values("Արժույթ", Get_Rekvizit_Value("Document", Common.tabN, "Mask", "CUR"), Common.wCurr)
    'Դրամարկղի նիշ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "KASSIMV", Common.cashierChar)
    'Հիմք դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "BASE", "[Home]!" & "[End]" & "[Del]" & Common.wBase)
    
     ' Լրացնել Գրիդը
    For  i = 0 To Common.gridRowCount - 1 
           With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
                   BuiltIn.Delay(2000)
                   ' Հաշիվ դաշտի լրացում
                  .Row = i
                  .Col = 0
                  .Keys(Common.wAcc(i) & "[Enter]")
                  ' Գումար դաշտի լրացում
                  .Col = 1
                  .Keys(Common.wSum(i) & "[Enter]")
                  ' Նպատակ դաշտի լրացում
                  .Col = 2
                  .Keys(Common.wAim(i) & "[Enter]" ) 
              
                  ' Չգանձվող մաս դաշտի արժեքի ստուգում
                  If Not Check_Value_Grid(3 , i, "Document", Common.tabN, Common.nonChargPart(i)) Then
                        Log.Error "Գրիդի " & i & " տողի Չգանձվող մաս դաշտի արժեքը սխալ է " ,,,ErrorColor
                  End If
              
                  If i = Common.gridRowCount - 1  Then
                      .MoveLast
                      If Trim(.Columns.Item(Common.gridRowCount - 1).Value) = "" Then
                          .Keys("^[D]")
                      End If  
                  End If
           End With 
    Next
    
    'Վերահաշվ. չգանձվող մասը
    Call Rekvizit_Fill("Document", Common.tabN, "CheckBox", "FRSHNOCRG", Common.reCalc)
    'Մուծող դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "CLICODE", Common.wPayer)
    If Common.payerLegalStatus = "ֆիզԱնձ" or  Common.payerLegalStatus = "ԱնհՁեռ" Then
        ' Ստուգել, որ Անուն դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "Comment", "RECEIVER", True)
        ' Ստուգել Անուն դաշտի արժեքը
        Call Compare_Two_Values("Անուն", Get_Rekvizit_Value("Document", Common.tabN, "Comment", "RECEIVER"), Common.wName)
        ' Ստուգել, որ Ազգանուն դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "General", "RECEIVERLASTNAME", True)
        ' Ստուգել Ազգանուն դաշտի արժեքը
        Call Compare_Two_Values("Ազգանուն", Get_Rekvizit_Value("Document", Common.tabN, "General", "RECEIVERLASTNAME"), Common.wSurname)
        ' Ստուգել Անձը հաստ. փաստթ. կոդ դաշտի արժեքը
        Call Compare_Two_Values("Անձը հաստ. փաստթ. կոդ", Get_Rekvizit_Value("Document", Common.tabN, "Comment", "PASSNUM"), Common.wIdCheck)
        ' Ստուգել Տիպ դաշտի արժեքը
        Call Compare_Two_Values("Տիպ", Get_Rekvizit_Value("Document", Common.tabN, "Mask", "PASTYPE"), Common.idTypeCheck)
        ' Ստուգել Տրված դաշտի արժեքը
        Call Compare_Two_Values("Տրված", Get_Rekvizit_Value("Document", Common.tabN, "General", "PASBY"), Common.idGivenByCheck)
        ' Ստուգել Տրված ամսաթիվ դաշտի արժեքը
        Call Compare_Two_Values("Տրված ամսաթիվ", Get_Rekvizit_Value("Document", Common.tabN, "General", "DATEPASS"), Common.idGiveDateForCheck)
        ' Ստուգել Վավեր է մինչև դաշտի արժեքը
        Call Compare_Two_Values("Վավեր է մինչև", Get_Rekvizit_Value("Document", Common.tabN, "General", "DATEEXPIRE"), Common.idValidUntilForCheck)
        ' Ստուգել, որ Ծննդյան ամսաթիվ դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "General", "DATEBIRTH", True)
        ' Ստուգել Ծննդյան ամսաթիվ դաշտի արժեքը
        Call Compare_Two_Values("Ծննդյան ամսաթիվ", Get_Rekvizit_Value("Document", Common.tabN, "General", "DATEBIRTH"), Common.birthDateForCheck)
        ' Ստուգել, որ Քաղաքացիություն դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "Mask", "CITIZENSHIP", True)
        ' Ստուգել Քաղաքացիություն դաշտի արժեքը
        Call Compare_Two_Values("Քաղաքացիություն", Get_Rekvizit_Value("Document", Common.tabN, "Mask", "CITIZENSHIP"), Common.wCitizenship)
        ' Ստուգել, որ Երկիր դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "Mask", "COUNTRY", True)
        ' Ստուգել Երկիր դաշտի արժեքը
        Call Compare_Two_Values("Երկիր", Get_Rekvizit_Value("Document", Common.tabN, "Mask", "COUNTRY"), Common.wCountry)
        ' Ստուգել, որ Բնակավայր դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "Mask", "COMMUNITY", True)
        ' Ստուգել Բնակավայր դաշտի արժեքը
        Call Compare_Two_Values("Բնակավայր", Get_Rekvizit_Value("Document", Common.tabN, "Mask", "COMMUNITY"), Common.wResidence)
        ' Ստուգել, որ Քաղաք դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "General", "CITY", True)
        ' Ստուգել Քաղաք դաշտի արժեքը
        Call Compare_Two_Values("Քաղաք", Get_Rekvizit_Value("Document", Common.tabN, "General", "CITY"), Common.wCity)
        ' Ստուգել, որ Բնակարան դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "General", "APARTMENT", True)
        ' Ստուգել Բնակարան դաշտի արժեքը
        Call Compare_Two_Values("Բնակարան", Get_Rekvizit_Value("Document", Common.tabN, "General", "APARTMENT"), Common.wApartment)
        ' Ստուգել, որ Փողոց դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "General", "ADDRESS", True)
        ' Ստուգել Փողոց դաշտի արժեքը
        Call Compare_Two_Values("Փողոց", Get_Rekvizit_Value("Document", Common.tabN, "General", "ADDRESS"), Common.wStreet)
        ' Ստուգել, որ Տուն/Շենք դաշտը չխմբագրվող է
        Call Check_ReadOnly("Document", Common.tabN, "General", "BUILDNUM", True)
        ' Ստուգել Տուն/Շենք դաշտի արժեքը
        Call Compare_Two_Values("Տուն/Շենք", Get_Rekvizit_Value("Document", Common.tabN, "General", "BUILDNUM"), Common.wHouse)
        ' Ստուգել Էլ հասցե դաշտի արժեքը
        Call Compare_Two_Values("Էլ հասցե", Get_Rekvizit_Value("Document", Common.tabN, "General", "EMAIL"), Common.emailForCheck)
    Else
        'Անուն դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "RECEIVER", "![End][Del]" & Common.wName)
        'Ազգանուն դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "RECEIVERLASTNAME", "![End][Del]" & Common.wSurname)
        'Ծննդյան ամսաթիվ դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "DATEBIRTH", Common.birthDate)
        'Քաղաքացիություն դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "CITIZENSHIP", Common.wCitizenship)
        'Երկիր դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "COUNTRY", Common.wCountry)
        'Բնակավայր դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "COMMUNITY", "[Home]!" & "[End]" & "[Del]" & Common.wResidence)
        'Քաղաք դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "CITY", "[Home]!" & "[End]" & "[Del]" & Common.wCity)   
        'Բնակարան դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "APARTMENT", "[Home]!" & "[End]" & "[Del]" & Common.wApartment) 
        'Փողոց դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "ADDRESS", "[Home]!" & "[End]" & "[Del]" & Common.wStreet)
        'Տուն/Շենք դաշտի լրացում
        Call Rekvizit_Fill("Document", Common.tabN, "General", "BUILDNUM", "[Home]!" & "[End]" & "[Del]" & Common.wHouse)
    End If
    
    'Անձը հաստ. փաստ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "PASSNUM", "[Home]!" & "[End]" & "[Del]" & Common.wId)
    'Տիպ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "PASTYPE", Common.idType)
    'Տրված դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "PASBY", Common.idGivenBy)
    'Տրված ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "DATEPASS", Common.idGiveDate)
    'Վավեր է մինչև դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "DATEEXPIRE", Common.idValidUntil) 
    'Էլ հասցե դաշտի լրացում
    Call Rekvizit_Fill("Document", Common.tabN, "General", "EMAIL", "[Home]!" & "[End]" & "[Del]" & Common.wEmail)
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''GroupCashOutput''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Խմբային Կանխիկ ելք փաստաթղթի կլաս
Class GroupCashOutput
    Public fIsn 
    Public commonTab 
    Public chargeTab
    Public coinTab
    Public attachedTab
    Private Sub Class_Initialize()
        fIsn = ""
        Set commonTab = New_GroupCashOut_Common()
        Set chargeTab = New_CashOut_Charge()
        Set coinTab = New_CashOut_Coin()
        Set attachedTab = New_Attached_Tab(f_Count, l_Count, d_Count)
    End Sub
End Class

Function New_GroupCashOutput(rowCountGrid, attachedFiles, attachedLinks, deleteFiles)
    grRowCount = rowCountGrid
    f_Count = attachedFiles
    l_Count = attachedLinks
    d_Count = deleteFiles
    Set New_GroupCashOutput = New GroupCashOutput
End Function

Sub Fill_GroupCashOutput(GroupCashOutput, button)
    Call Fill_GroupCashOut_Common(GroupCashOutput.commonTab)
    Call Fill_CashOut_Charge(GroupCashOutput.chargeTab, GroupCashOutput.commonTab.payerLegalStatus)
    Call Fill_CashOut_Coin(GroupCashOutput.coinTab, GroupCashOutput.commonTab.wCurr)
    Call Fill_Attached_Tab(GroupCashOutput.attachedTab) 
    Call ClickCmdButton(1, button)
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''Create_Group_Cash_Output'''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Խմբային Կանխիկ ելք փաստաթղթի ստեղծում
' GroupCashOut - Խմբային Կանխիկ ելք փաստաթղթի լրացման կլաս
Sub Create_Group_Cash_Output(GroupCashOutput, button)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_InnerOpers &"|"& c_KasRsOrdPk)
    If wMDIClient.WaitvbObject("frmASDocForm", 3000).Exists Then 
        'ISN-ի վերագրում փոփոխականին
        GroupCashOutput.fIsn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
        Call Fill_GroupCashOutput(GroupCashOutput, button)
    Else 
        Log.Error "Can't open frmASDocForm window.", "", pmNormal, ErrorColor 
    End If
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''Create_GroupCash_Input_Next'''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Խմբային Կանխիկի ելք փաստաթղթի ստեղծում (Հաջորդը)
' GrCashOut - Խմբային Կանխիկի ելք փաստաթղթի լրացման կլաս
Sub Create_Group_Cash_Output_Next(folderDirect, GroupCashOutput, button)
    BuiltIn.Delay(3000)
    Call wTreeView.DblClickItem(folderDirect)   
    If wMDIClient.WaitvbObject("frmASDocForm", 3000).Exists Then 
        'ISN-ի վերագրում փոփոխականին
        GroupCashOutput.fIsn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
        Call Fill_GroupCashOutput(GroupCashOutput, button)
    Else 
        Log.Error "Can't open frmASDocForm window.", "", pmNormal, ErrorColor 
    End If
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''Check_Group_Cash_Output'''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Խմբային Կանխիկ ելք փաստաթղթի արժեքների ստուգում
' grCashOut - Խմբային Կանխիկ ելք փաստաթղթի լրացման կլաս
Sub Check_Group_Cash_Output(GrCashOut)
    Dim i
    ' Ստուգել Գրասենյակ դաշտի արժեքը
    Call Compare_Two_Values("Գրասենյակ", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Mask", "ACSBRANCH"), GrCashOut.commonTab.wOffice)
    ' Ստուգել Բաժին դաշտի արժեքը
    Call Compare_Two_Values("Բաժին", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Mask", "ACSDEPART"), GrCashOut.commonTab.wDepartment)
    ' Ստուգել Փաստաթղթի N դաշտի արժեքը
    Call Compare_Two_Values("Փաստաթղթի N", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "General", "DOCNUM"), GrCashOut.commonTab.docNum)
    ' Ստուգել Ամսաթիվ դաշտի արժեքը
    Call Compare_Two_Values("Ամսաթիվ", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "General", "DATE"), GrCashOut.commonTab.wDate)
    ' Ստուգել Դրամարկղ դաշտի արժեքը
    Call Compare_Two_Values("Դրամարկղ", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Mask", "KASSA"), GrCashOut.commonTab.cashRegister)
    ' Ստուգել Դրամարկղի հաշիվ դաշտի արժեքը
    Call Compare_Two_Values("Դրամարկղի հաշիվ", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Mask", "ACCCR"), GrCashOut.commonTab.cashRegisterAcc)
    ' Ստուգել Արժույթ դաշտի արժեքը
    Call Compare_Two_Values("Արժույթ", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Mask", "CUR"), GrCashOut.commonTab.wCurr)
    
    ' Ստուգել Դրամարկղի նիշ դաշտի արժեքը
    Call Compare_Two_Values("Դրամարկղի նիշ", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Mask", "KASSIMV"), GrCashOut.commonTab.cashierChar)
    ' Ստուգել Հիմք դաշտի արժեքը
    Call Compare_Two_Values("Հիմք", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Comment", "BASE"), GrCashOut.commonTab.wBase)
    
    
    For i = 0 to GrCashOut.commonTab.gridRowCount - 1
        ' Հաշիվ  դաշտերի ստուգում
        If Not Check_Value_Grid(0 , i, "Document", GrCashOut.commonTab.tabN, GrCashOut.commonTab.wAcc(i)) Then
               Log.Error "Գրիդի " & i & " տողի հաշվ դաշտի արժեքը սխալ է " ,,,ErrorColor
        End If
        ' Գումար դաշտի ստուգում
        If Not Check_Value_Grid(1 , i, "Document", GrCashOut.commonTab.tabN, GrCashOut.commonTab.wSum(i)) Then 
               Log.Error "Գրիդի " & i & " տողի գումար դաշտի արժեքը սխալ է ",,,ErrorColor
        End If
        ' Նպատակ դաշտի ստուգում
        If Not Check_Value_Grid(2 , i, "Document", GrCashOut.commonTab.tabN, GrCashOut.commonTab.wAim(i)) Then 
               Log.Error "Գրիդի " & i & " տողի նպատակ դաշտի արժեքը սխալ է ",,,ErrorColor
        End If
        
        ' Չգանձվող մաս դաշտի արժեքի ստուգում
        If Not Check_Value_Grid(3 , i, "Document", GrCashOut.commonTab.tabN, GrCashOut.commonTab.nonChargPart(i)) Then
            Log.Error "Գրիդի " & i & " տողի Չգանձվող մաս դաշտի արժեքը սխալ է " ,,,ErrorColor
        End If
    Next      
    
    ' Ստուգել Վերահաշվ. չգանձվող մասը դաշտի արժեքը
    Call Compare_Two_Values("Ստուգել Վերահաշվ. չգանձվող մասը", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "CheckBox", "FRSHNOCRG"), GrCashOut.commonTab.reCalc)
    ' Ստուգել Ստացող դաշտի արժեքը
    Call Compare_Two_Values("Մուծող", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Mask", "CLICODE"), GrCashOut.commonTab.wPayer)
    ' Ստուգել Անուն դաշտի արժեքը
    Call Compare_Two_Values("Անուն", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Comment", "RECEIVER"), GrCashOut.commonTab.wName)
    ' Ստուգել Ազգանուն դաշտի արժեքը
    Call Compare_Two_Values("Ազգանուն", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "General", "RECEIVERLASTNAME"), GrCashOut.commonTab.wSurname)
    ' Ստուգել Անձը հաստ. փաստթ. կոդ դաշտի արժեքը
    Call Compare_Two_Values("Անձը հաստ. փաստթ. կոդ", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Comment", "PASSNUM"), GrCashOut.commonTab.wId)
    ' Ստուգել Տիպ դաշտի արժեքը
    Call Compare_Two_Values("Տիպ", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Mask", "PASTYPE"), GrCashOut.commonTab.idType)
    ' Ստուգել Տրված դաշտի արժեքը
    Call Compare_Two_Values("Տրված", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "General", "PASBY"), GrCashOut.commonTab.idGivenBy)
    ' Ստուգել Տրված ամսաթիվ դաշտի արժեքը
    Call Compare_Two_Values("Տրված ամսաթիվ", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "General", "DATEPASS"), GrCashOut.commonTab.idGiveDate)
    ' Ստուգել Վավեր է մինչև դաշտի արժեքը
    Call Compare_Two_Values("Վավեր է մինչև", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "General", "DATEEXPIRE"), GrCashOut.commonTab.idValidUntil)
    ' Ստուգել Ծննդյան ամսաթիվ դաշտի արժեքը
    Call Compare_Two_Values("Ծննդյան ամսաթիվ", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "General", "DATEBIRTH"), GrCashOut.commonTab.birthDate)
    ' Ստուգել Քաղաքացիություն դաշտի արժեքը
    Call Compare_Two_Values("Քաղաքացիություն", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Mask", "CITIZENSHIP"), GrCashOut.commonTab.wCitizenship)
    ' Ստուգել Երկիր դաշտի արժեքը
    Call Compare_Two_Values("Երկիր", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Mask", "COUNTRY"), GrCashOut.commonTab.wCountry)
    ' Ստուգել Բնակավայր դաշտի արժեքը
    Call Compare_Two_Values("Բնակավայր", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "Mask", "COMMUNITY"), GrCashOut.commonTab.wResidence)
    ' Ստուգել Քաղաք դաշտի արժեքը
    Call Compare_Two_Values("Քաղաք", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "General", "CITY"), GrCashOut.commonTab.wCity)
    ' Ստուգել Բնակարան դաշտի արժեքը
    Call Compare_Two_Values("Բնակարան", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "General", "APARTMENT"), GrCashOut.commonTab.wApartment)
    ' Ստուգել Փողոց դաշտի արժեքը
    Call Compare_Two_Values("Փողոց", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "General", "ADDRESS"), GrCashOut.commonTab.wStreet)
    ' Ստուգել Տուն/Շենք դաշտի արժեքը
    Call Compare_Two_Values("Տուն/Շենք", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "General", "BUILDNUM"), GrCashOut.commonTab.wHouse)
    ' Ստուգել Էլ հասցե դաշտի արժեքը
    Call Compare_Two_Values("Էլ հասցե", Get_Rekvizit_Value("Document", GrCashOut.commonTab.tabN, "General", "EMAIL"), GrCashOut.commonTab.wEmail)
    
    ' Ստուգել Գրասենյակ դաշտի արժեքը
    Call Compare_Two_Values("Գրասենյակ", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "Mask", "ACSBRANCHINC"), GrCashOut.chargeTab.office)
    ' Ստուգել Բաժին դաշտի արժեքը
    Call Compare_Two_Values("Բաժին", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "Mask", "ACSDEPARTINC"), GrCashOut.chargeTab.department)
    ' Ստուգել Գանձման հաշիվ դաշտի արժեքը
    Call Compare_Two_Values("Գանձման հաշիվ", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "Mask", "CHRGACC"), GrCashOut.chargeTab.chargeAcc)
    ' Ստուգել Արժույթ դաշտի արժեքը
    Call Compare_Two_Values("Արժույթ", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "Mask", "CHRGCUR"), GrCashOut.chargeTab.chargeCurrForCheck)
    ' Ստուգել ԿԲ փոխարժեք դաշտի արժեքը
    Call Compare_Two_Values("ԿԲ փոխարժեք", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "Course", "CHRGCBCRS"), GrCashOut.chargeTab.cbExchangeRate)
    ' Ստուգել Գանձման տեսակ դաշտի արժեքը
    Call Compare_Two_Values("Գանձման տեսակ", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "Mask", "PAYSCALE"), GrCashOut.chargeTab.chargeType)
    ' Ստուգել Գումար դաշտի արժեքը
    Call Compare_Two_Values("Գումար_2", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "General", "CHRGSUM"), GrCashOut.chargeTab.chargeAmoForCheck) 
    ' Ստուգել Տոկոս դաշտի արժեքը
    Call Compare_Two_Values("Տոկոս", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "General", "PRSNT"), GrCashOut.chargeTab.chargePerForCheck) 
    ' Ստուգել Եկամտի հաշիվ դաշտի արժեքը
    Call Compare_Two_Values("Եկամտի հաշիվ", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "Mask", "CHRGINC"), GrCashOut.chargeTab.incomeAcc) 
    ' Ստուգել Առք/Վաճառք դաշտի արժեքը
    Call Compare_Two_Values("Առք/Վաճառք", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "Mask", "CUPUSA"), GrCashOut.chargeTab.buyAndSellForCheck) 
    ' Ստուգել Գործողության տեսակ դաշտի արժեքը
    Call Compare_Two_Values("Գործողության տեսակ", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "Mask", "CURTES"), GrCashOut.chargeTab.operType)
    ' Ստուգել Գործողության վայր դաշտի արժեքը
    Call Compare_Two_Values("Գործողության վայր", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "Mask", "CURVAIR"), GrCashOut.chargeTab.operPlace)
    ' Ստուգել Ժամանակ դաշտի արժեքը
    Call Compare_Two_Values("Ժամանակ", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "Mask", "TIME"), GrCashOut.chargeTab.timeForCheck)
    ' Ստուգել Գործողության ոլորտ դաշտի արժեքը
    Call Compare_Two_Values("Գործողության ոլորտ", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "Mask", "VOLORT"), GrCashOut.chargeTab.operAreaForCheck)
    ' Ստուգել Ոչ ռեզիդենտ դաշտի արժեքը
    Call Compare_Two_Values("Ոչ ռեզիդենտ", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "CheckBox", "NONREZ"), GrCashOut.chargeTab.nonResident)
    ' Ստուգել Իրավաբանական կարգավիճակ դաշտի արժեքը
    Call Compare_Two_Values("Իրավաբանական կարգավիճակ", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "Mask", "JURSTAT"), GrCashOut.chargeTab.legalStatusForCheck)
    ' Ստուգել Մեկնաբանություն դաշտի արժեքը
    Call Compare_Two_Values("Մեկնաբանություն", Get_Rekvizit_Value("Document", GrCashOut.chargeTab.tabN, "General", "COMM"), GrCashOut.chargeTab.comment)
    
    ' Ստուգել Մանրադրամ դաշտի արժեքը
    Call Compare_Two_Values("Մանրադրամ", Get_Rekvizit_Value("Document", GrCashOut.coinTab.tabN, "General", "XSUM"), GrCashOut.coinTab.coinForCheck)
    ' Ստուգել Մանրադրամի վճարման արժույթ դաշտի արժեքը
    Call Compare_Two_Values("Մանրադրամի վճարման արժույթ", Get_Rekvizit_Value("Document", GrCashOut.coinTab.tabN, "Mask", "XCUR"), GrCashOut.coinTab.coinPayCurr) 
    ' Ստուգել Մանրադրամի վճարման հաշիվ դաշտի արժեքը
    Call Compare_Two_Values("Մանրադրամի վճարման հաշիվ", Get_Rekvizit_Value("Document", GrCashOut.coinTab.tabN, "Mask", "XACC"), GrCashOut.coinTab.coinPayAcc) 
    ' Ստուգել Փոխարժեք դաշտի արժեքը
    Call Compare_Two_Values("Փոխարժեք", Get_Rekvizit_Value("Document", GrCashOut.coinTab.tabN, "Course", "XDLCRS"), GrCashOut.coinTab.coinExchangeRate)
    ' Ստուգել ԿԲ փոխարժեք դաշտի արժեքը
    Call Compare_Two_Values("ԿԲ փոխարժեք", Get_Rekvizit_Value("Document", GrCashOut.coinTab.tabN, "Course", "XCBCRS"), GrCashOut.coinTab.coinCBExchangeRate) 
    ' Ստուգել Առք/Վաճառք դաշտի արժեքը
    Call Compare_Two_Values("Առք/Վաճառք", Get_Rekvizit_Value("Document", GrCashOut.coinTab.tabN, "Mask", "XCUPUSA"), GrCashOut.coinTab.coinBuyAndSell) 
    ' Ստուգել Մանրադրամի վճարման գումար դաշտի արժեքը
    Call Compare_Two_Values("Մանրադրամի վճարման գումար", Get_Rekvizit_Value("Document", GrCashOut.coinTab.tabN, "General", "XCURSUM"), GrCashOut.coinTab.coinPayAmountForCheck) 
    ' Ստուգել Գումար հիմնական արժույթով դաշտի արժեքը
    Call Compare_Two_Values("Գումար հիմնական արժույթով", Get_Rekvizit_Value("Document", GrCashOut.coinTab.tabN, "General", "XSUMMAIN"), GrCashOut.coinTab.amountCurrForCheck)
    ' Ստուգել Եկամուտներ արտ. փոխանակումից դաշտի արժեքը
    Call Compare_Two_Values("Եկամուտներ արտ. փոխանակումից", Get_Rekvizit_Value("Document", GrCashOut.coinTab.tabN, "Mask", "XINC"), GrCashOut.coinTab.incomeOutChange) 
    ' Ստուգել Վնասներ արտ. փոխանակումից դաշտի արժեքը
    Call Compare_Two_Values("Վնասներ արտ. փոխանակումից", Get_Rekvizit_Value("Document", GrCashOut.coinTab.tabN, "Mask", "XEXP"), GrCashOut.coinTab.damagesOutChange)
    ' Ստուգել Կլորացված գումար դաշտի արժեքը
    Call Compare_Two_Values("Կլորացված գումար", Get_Rekvizit_Value("Document", GrCashOut.coinTab.tabN, "General", "ROUNDSUM"), GrCashOut.coinTab.roundedAmountForCheck) 
    
    Call GoTo_ChoosedTab(GrCashOut.attachedTab.tabN) 
    ' Ստուգել, որ ֆայլերը առկա են
    For i = 0 To GrCashOut.attachedTab.filesCount - 1
        If Not SearchInAttachList (GrCashOut.attachedTab.fileName(i), GrCashOut.attachedTab.tabN) Then
           Log.Error "Can't find searched " & GrCashOut.attachedTab.fileName(i) & " row.", "", pmNormal, ErrorColor
        End If
    Next
    For i = 0 To GrCashOut.attachedTab.linksCount - 1
        If Not SearchInAttachList (GrCashOut.attachedTab.addLinks(i), GrCashOut.attachedTab.tabN) Then
           Log.Error "Can't find searched " & GrCashOut.attachedTab.addLinks(i) & " row.", "", pmNormal, ErrorColor
        End If
    Next
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''Edit_Group_Cash_Output'''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

' Խմբային Կանխիկ ելք փաստաթղթի խմբագրում
' OldCashOut - հին Խմբային Կանխիկ ելք փաստաթղթի լրացման կլաս
Sub Edit_Group_Cash_Output(GrCashOut, EditCashOutput, button)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToEdit)
    If wMDIClient.WaitvbObject("frmASDocForm", 3000).Exists Then 
        Call Check_Group_Cash_Output(GrCashOut)
        EditCashOutput.fIsn = GrCashOut.fIsn
        Call GoTo_ChoosedTab(GrCashOut.commonTab.tabN)
        Call Fill_GroupCashOutput(EditCashOutput, button)
    Else 
        Log.Error "Can't open frmASDocForm window.", "", pmNormal, ErrorColor 
    End If
End Sub