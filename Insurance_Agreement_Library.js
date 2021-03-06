'USEUNIT Library_Common 
'USEUNIT Library_Colour
'USEUNIT Constants

Option Explicit

Dim DocForm

'--------------------------------------------------------------
'InsuranceAgreement - "Ապահովագրության պայմանագրեր" պատուհանի Class
'---------------------------------------------------------------
Class InsuranceAgreement
    Public FillTab
    Public Isn
    'Tab - 1
    Public AgreementN
    Public InsuranceCompany
    Public Surety
    Public InsuranceType
    Public InsuranceSubject
    Public MarketValue
    Public InsuranceAmount
    Public InsurancePremium
    Public Comment
    Public PeriodOfValid_Start
    Public PeriodOfValid_End
    Public Division
    Public Department
    Public AccessType
    'Tab - 2
    Public ReceivedCollateral
    Public MortgageN
    Public CollateralArgN
    Public Placement
    Public PlacementN
    'Tab - 3
    Public Note
    Public Note2
    Public Note3
    Public ClosingDate
    
    Private Sub Class_Initialize
        FillTab = True
        Isn = ""
        'Tab - 1
        AgreementN = ""
        InsuranceCompany = ""
        Surety = ""
        InsuranceType = ""
        InsuranceSubject = ""
        MarketValue = "0.00"
        InsuranceAmount = "0.00"
        InsurancePremium = "0.00"
        Comment = ""
        PeriodOfValid_Start = ""
        PeriodOfValid_End = ""
        Division = "00"
        Department = ""
        AccessType = ""
        'Tab - 2
        ReceivedCollateral = 0
        MortgageN = ""
        CollateralArgN = ""
        Placement = 0
        PlacementN = ""
        'Tab - 3
        Note = ""
        Note2 = ""
        Note3 = ""
        ClosingDate = ""
    End Sub  
End Class

Function New_InsuranceAgreement()
    Set New_InsuranceAgreement = NEW InsuranceAgreement      
End Function

'------------------------------------------------------------------------------------
' InsuranceAgreement - Ապահովագրության պայմանագրի ստեղծում
'------------------------------------------------------------------------------------
Function Create_Insurance_Agreement(InsuranceAgreement)
    
    Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²å³Ñáí³·ñáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñ|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
    Set DocForm = wMDIClient.WaitVBObject("frmASDocForm", 3000)
    
    If DocForm.Exists Then
        'ISN-ի վերագրում փոփոխականին
        InsuranceAgreement.Isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
        'Լրացնել "Ապահովագրության պայմանագրի" պատուհանիի արժեքները
        Call Fill_Insurance_Agreement(InsuranceAgreement)
    Else
        Log.Error "Can Not Open Insurance Agreement Window",,,ErrorColor        
    End If
    BuiltIn.Delay(2000)
    If DocForm.Exists Then
        Log.Error "Can Not Close Insurance Agreement Window",,,ErrorColor
    End If
End Function  

'-------------------------------------------------------------------------
' 'Լրացնել "Insurance_Agreementl/Ապահովագրության պայմանագրի" պատուհանի արժեքները
'-------------------------------------------------------------------------
Sub Fill_Insurance_Agreement(InsuranceAgreement)

    If InsuranceAgreement.FillTab Then
    
        Log.Message "Fill Insurance_Agreement Window",,,MessageColor

        ''''''--Tab_1
        'Ստուգում "Պայմանագրի N" դաշտի համար
        Call Rekvizit_Fill("Document", 1, "General", "CODE", InsuranceAgreement.AgreementN) 
        'Ստուգում "Ապահովագրության ընկերություն" դաշտի համար
        Call Rekvizit_Fill("Document", 1, "General", "INSCOMP", InsuranceAgreement.InsuranceCompany) 
        'Ստուգում "Ապահովադիր" դաշտի համար  
        Call Rekvizit_Fill("Document", 1, "General", "SURETY", InsuranceAgreement.Surety) 
        
        'Ստուգում "Ապահովագրության տեակ" դաշտի համար  
        Call Rekvizit_Fill("Document", 1, "General", "INSTYPE", InsuranceAgreement.InsuranceType) 
        
        If InsuranceAgreement.InsuranceType = "1" Then
            'Ստուգում "Ապահովագրության առարկա" և "Շուկայական արժեք" դաշտերի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"General","INSSUBJ",True)
            Call Check_ReadOnly("Document",1,"General","MARKETVALUE",True)
        Else   
            'Ստուգում "Ապահովագրության առարկա" և "Շուկայական արժեք" դաշտերի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"General","INSSUBJ",False)
            Call Check_ReadOnly("Document",1,"General","MARKETVALUE",False)
            'Ստուգում "Ապահովագրության առարկա" դաշտի համար  
            Call Rekvizit_Fill("Document", 1, "General", "INSSUBJ", InsuranceAgreement.InsuranceSubject) 
        End If
          
        'Ստուգում "Շուկայական արժեք" դաշտի համար  
        Call Rekvizit_Fill("Document", 1, "General", "MARKETVALUE", InsuranceAgreement.MarketValue)      
        'Ստուգում "Ապահովագրական գումար" դաշտի համար  
        Call Rekvizit_Fill("Document", 1, "General", "INSVALUE", InsuranceAgreement.InsuranceAmount) 
        'Ստուգում "Ապահովագրավճար" դաշտի համար  
        Call Rekvizit_Fill("Document", 1, "General", "INSSUMMA", InsuranceAgreement.InsurancePremium) 
        'Ստուգում " Մեկնաբանություն" դաշտի համար  
        Call Rekvizit_Fill("Document", 1, "General", "COMMENT", InsuranceAgreement.Comment) 
        'Ստուգում "Գործողության ժամկետ սկիզբ" դաշտի համար  
        Call Rekvizit_Fill("Document", 1, "General", "DATEBEGIN", InsuranceAgreement.PeriodOfValid_Start) 
        'Ստուգում "Գործողության ժամկետ ավարտ" դաշտի համար  
        Call Rekvizit_Fill("Document", 1, "General", "DATEEND", InsuranceAgreement.PeriodOfValid_End) 
        'Լրացնել "Գրասենյակ" դաշտը
        Call Rekvizit_Fill("Document", 1, "General","ACSBRANCH",InsuranceAgreement.Division)
        'Լրացնել "Բաժին" դաշտը
        Call Rekvizit_Fill("Document", 1, "General","ACSDEPART",InsuranceAgreement.Department)
        'Լրացնել "Հասան-ն տիպ" դաշտը
        Call Rekvizit_Fill("Document", 1, "General","ACSTYPE",InsuranceAgreement.AccessType)
        
        ''''''--Tab_2
        'Ստուգում "Գրավի N" դաշտի խմբագրելիությունը
        Call Check_ReadOnly("Document",2,"Mask","MORTCODE",True)
        'Լրացնել "Ստացված գրավ" դաշտը
        Call Rekvizit_Fill("Document",2,"CheckBox","MORTGAGE",InsuranceAgreement.ReceivedCollateral)
        If InsuranceAgreement.ReceivedCollateral = 1 Then
            'Ստուգել "Գրավի N" դաշտի խմբագրելիությունը և լրացնել "Գրավի N" դաշտը
            Call Check_ReadOnly("Document",2,"Mask","MORTCODE",False)
            Call Rekvizit_Fill("Document",2,"General","MORTCODE",InsuranceAgreement.MortgageN)
        End If
        'Ստուգել "Ապահ.պայմ.N" դաշտի խմբագրելիությունը և արժեքը
        Call Check_ReadOnly("Document",2,"Comment","CODESSAGR",True)
        Call Compare_Two_Values("Ապահ.պայմ.N",Get_Rekvizit_Value("Document",2,"Comment","CODESSAGR"),InsuranceAgreement.CollateralArgN)
        'Լրացնել "Տեղաբաշխված միջոց" դաշտը
        Call Rekvizit_Fill("Document",2,"CheckBox","PLACEDFUND",InsuranceAgreement.Placement)
        'Ստուգել "Տեղաբաշխված միջոցի N" դաշտի խմբագրելիությունը և արժեքը
        Call Check_ReadOnly("Document",2,"Comment","PLACEDCODE",True)
        Call Compare_Two_Values("Ապահ.պայմ.N",Get_Rekvizit_Value("Document",2,"Comment","PLACEDCODE"),InsuranceAgreement.PlacementN)
        
        ''''''--Tab_3
        'Լրացնել "Նշում" դաշտը
        Call Rekvizit_Fill("Document",3,"General","NOTE",InsuranceAgreement.Note)
        'Լրացնել "Նշում 2" դաշտը
        Call Rekvizit_Fill("Document",3,"General","NOTE2",InsuranceAgreement.Note2)
        'Լրացնել "Նշում 3" դաշտը
        Call Rekvizit_Fill("Document",3,"General","NOTE3",InsuranceAgreement.Note3)
        'Լրացնել "Փակման ամսաթիվ" դաշտը
        Call Check_ReadOnly("Document",3,"General","DATECLOSE",True)
        Call Rekvizit_Fill("Document",3,"General","DATECLOSE",InsuranceAgreement.ClosingDate)
        
        'Սեղմել "Կատարել"
        Call ClickCmdButton(1, "Î³ï³ñ»É")
    End If
End Sub