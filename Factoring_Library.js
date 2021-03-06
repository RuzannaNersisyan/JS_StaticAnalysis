Option Explicit

'USEUNIT Library_Common  
'USEUNIT Constants

Class FactoringDoc
  Public DocNum, Payer, Lender, Curr, PayerAcc, LenderAcc, Amount, Date, GiveDate,_
          Term, AutoDebt, DateFillType, CheckPayDates, PayDates, Paragraph, Direction,_
          SumsDateFillType, SumsFillType, Percent, Baj, Sector, UsageField, Aim,_ 
          Schedule, Guarantee, Country, District, RegionLR, fBASE, DocLevel,_
          DocType, DocTypeNum, PaperCode, CloseDate
  Public PaidAmount, PerSum
  
  Private Sub Class_Initialize()
    AutoDebt = 1
    DateFillType = 2
    CheckPayDates = 0
    Paragraph = 1
    Direction = 2
    SumsDateFillType = 1
    SumsFillType = "01"
    Percent = 12
    Baj = 365
    Sector = "U2"
    UsageField = "17.001"
    Country = "AM"
    District = "001"
    RegionLR = "010000008"
    Aim = "00"
  End Sub
  
  Public Sub CreateFactoring(FolderName)
    Dim frmModalBrowser, TabN
    
    If Not IsNull(FolderName) Then
      Call wTreeView.DblClickItem(FolderName)
    End If  
    
    Set frmModalBrowser  = Asbank.WaitVBObject("frmModalBrowser", 500)	
		Do Until p1.frmModalBrowser.VBObject("tdbgView").EOF
			If RTrim(p1.frmModalBrowser.VBObject("tdbgView").Columns.Item(1).Text) = DocType  Then
  			Call p1.frmModalBrowser.VBObject("tdbgView").Keys("[Enter]")
  			Exit do
			Else
  			Call p1.frmModalBrowser.VBObject("tdbgView").MoveNext
			End If
		Loop 

    'Վերցնել "Պայմանագրի համար" դաշտի արշժեքը
    DocNum = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TextC").Text 
    'Վերցմել պայմանագրի ISN-ը
    fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    If DocTypeNum = "Y" Then
      'Լրացնել "Հաշվարկային հաշիվ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "ACCACC", LenderAcc)
      'Լրացնել "Գումար" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "SUMMA", Amount)
    Else  
      'Լրացնել "Վճարողի հաշիվ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "ACCACC", PayerAcc)
      'Լրացնել "Պարտատիրոջ հաշիվ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "ACCACC1", LenderAcc)
      'Լրացնել "Գումար" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "ALLSUMMA", Amount)
    End If  
    'Լրացնել "Կնքման ամսաթիվ" դաշտը       
    Call Rekvizit_Fill("Document", 1, "General", "DATE", Date)
    
    
    Select Case DocTypeNum
        Case "Y"
          'Լրացնել "Մարման ժամկետ" դաշտը  
          Call Rekvizit_Fill("Document", 1, "General", "DATEAGR", Term)
          TabN = 2
        Case "8"
          'Լրացնել "Հատկացման ամսաթիվ" դաշտը
          Call Rekvizit_Fill("Document", 2, "General", "DATEGIVE", GiveDate)
          'Լրացնել "Մարման ժամկետ" դաշտը  
          Call Rekvizit_Fill("Document", 2, "General", "DATEAGR", Term) 
          'Լրացնել "Վճարված գումար" դաշտը  
          Call Rekvizit_Fill("Document", 2, "General", "SUMMA", PaidAmount)
          'Լրացնել "Սկզբն.տոկոսագումար" դաշտը 
          Call Rekvizit_Fill("Document", 2, "General", "PERSUM", PerSum)
          TabN = 3
        Case "5", "2"
          TabN = 2
    End Select
      
    'Լրացնել "Պարտքերի ավտոմատ մարում" նշիչը
    Call Rekvizit_Fill("Document", TabN, "CheckBox", "AUTODEBT", AutoDebt)
    TabN = TabN + 1 
     
    If DocTypeNum = "8" Then
      'Լրացնել "Ամսաթվերի լրացման ձև" դաշտը 
      Call Rekvizit_Fill("Document", 4, "General", "DATESFILLTYPE", DateFillType)
        
      Select Case DateFillType
          Case 1
            'Լրացնել "Մարման օրեր" դաշտը
            Call Rekvizit_Fill("Document", 4, "General", "FIXEDDAYS", PayDates)
          Case 2
            'Լրացնել "Պարբերություն" դաշտը
            Call Rekvizit_Fill("Document", 4, "General", "AGRPERIOD", Paragraph & "[Tab]")
      End Select
      'Լրացնել "Շրջանցման ուղղություն" դաշտը
      Call Rekvizit_Fill("Document", 4, "General", "PASSOVDIRECTION", Direction)
      'Լրացնել "Գումարների ամսաթվերի ընտրություն" դաշտը
      Call Rekvizit_Fill("Document", 4, "General", "SUMSDATESFILLTYPE", SumsDateFillType)
      'Լրացնել "Գումարների բաշխման ձև" դաշտը
      Call Rekvizit_Fill("Document", 4, "General", "SUMSFILLTYPE", SumsFillType)
      
      TabN = 5
    End If
    
    If DocTypeNum <> "5" Then
      'Լրացնել "Ֆակտորինգի տոկոսադրույք" դաշտը 
      Call Rekvizit_Fill("Document", TabN, "General", "PCAGR", Percent & "[Tab]" & Baj)
      TabN = TabN + 2
    Else  
      TabN = 5
    End If  
    
    If DocTypeNum = "2" or DocTypeNum = "5" Then
      'Լրացնել "Հատկացման ամսաթիվ" դաշտը
      Call Rekvizit_Fill("Document", TabN, "General", "DATEGIVE", GiveDate)
      'Լրացնել "Մարման ժամկետ" դաշտը  
      Call Rekvizit_Fill("Document", TabN, "General", "DATEAGR", Term) 
      If DocTypeNum = "2" Then
        'Դնել "Ամսաթվերի լրացում" նշիչը
        wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_5").VBObject("CheckBox_8").Click
        If CheckPayDates = 1 Then
          'Լրացնել "Նշ." նշիչը
          Call Rekvizit_Fill("Dialog", 1, "CheckBox", "INCLFIXD", 1) 
          'Լրացնել "Մարման օրեր" դաշտը
          Call Rekvizit_Fill("Dialog", 1, "General", "FIXEDDAYS", PayDates) 
        Else    
          'Լրացնել "Պարբերություն" դաշտը
          Call Rekvizit_Fill("Dialog", 1, "General", "PERIODICITY", Paragraph & "[Tab]") 
        End If
        'Լրացնել "Շրջանցման ուղղություն" դաշտը
        Call Rekvizit_Fill("Dialog", 1, "General", "PASSOVDIRECTION", Direction)
        'Սեղմել "Կատարել"
        Call ClickCmdButton(2, "Î³ï³ñ»É") 
        TabN = 6
      End If   
      'Լրացնել "Վճարված գումար" դաշտը
      Call Rekvizit_Fill("Document", TabN, "General", "SUMMA", PaidAmount)
      
      If DocTypeNum = "2" Then
        TabN = 7 
      Else
        TabN = 6
      End If  
    End If
    
    'Լրացնել "Ճյուղայնություն" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "SECTOR", Sector)
    If DocTypeNum <> "Y" Then
      'Լրացնել "Օգտագործման ոլորտ(նոր ՎՌ)" դաշտը
      Call Rekvizit_Fill("Document", TabN, "General", "USAGEFIELD", UsageField)
      'Լրացնել "Նպատակ" դաշտը
      Call Rekvizit_Fill("Document", TabN, "General", "AIM", Aim)
      'Լրացնել "Երկիր" դաշտը
      Call Rekvizit_Fill("Document", TabN, "General", "COUNTRY", Country)
      'Լրացնել "Մարզ" դաշտը
      Call Rekvizit_Fill("Document", TabN, "General", "LRDISTR", District)
      'Լրացնել "Մարզ(նոր ՎՌ)" դաշտը
      Call Rekvizit_Fill("Document", TabN, "General", "REGION", RegionLR)
      'Լրացնել "Պայմանագրի թղթային համար" դաշտը
      Call Rekvizit_Fill("Document", TabN, "General", "PPRCODE", PaperCode)
    End If
    Call ClickCmdButton(1, "Î³ï³ñ»É") 
    
  End Sub
  
  Public Sub CloseAgr()
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrClose)
    
    Call Rekvizit_Fill("Dialog", 1, "General", "DATECLOSE", CloseDate)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  End Sub   
  
  Public Sub OpenAgr()
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen)
    
    Call ClickCmdButton(5, "²Ûá")
  End Sub
End Class


Public Function New_FactoringDoc()
  Set New_FactoringDoc = New FactoringDoc
End Function


'-------------------------------------------------------------------------------------
' ՄՄԺՊ ֆակտորինգի տրամադրում
' Date - Ամսաթիվ
' CashOrNo - Կանխիկ/Անկանխիկ
' CashOutNum - Կանխիկ ելք փաստաթղթի համար
'-------------------------------------------------------------------------------------
Function GiveFactoring(Date, CashOrNo, CashOutNum)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_GiveFactoring)
  
  GiveFactoring = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
  
  'Ամսաթիվ դաշտի լրացում
  Call Rekvizit_Fill("Document", 1,"General", "DATE", Date)
  'Կանխիկ/Անկանխիկ դաշտի լրացում
  Call Rekvizit_Fill("Document", 1, "General", "CASHORNO", CashOrNo)

  Call ClickCmdButton(1, "Î³ï³ñ»É")
  
  BuiltIn.Delay(5000)
  If CashOrNo = 1 Then
    CashOutNum = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TextC").Text
    'Կանխիկ ելք փաստաթղթում սեղմել "Կատարել"
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    wMDIClient.VBObject("FrmSpr").Close
  Else 
    Call ClickCmdButton(5, "²Ûá")  
  End If
  
End Function