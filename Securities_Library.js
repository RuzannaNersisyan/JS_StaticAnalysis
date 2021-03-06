Option Explicit

'USEUNIT Library_Common  
'USEUNIT Constants

Class SecurityDoc
  Public SecKind, SecType, DocNum, Name, Nominal, Percent, PublishDate, PrevRepDate,_
          Term, DateFill, FirstDate, LastDate, Paragraph, PayDates, CheckPayDates,_ 
          MarketType, BuyDate, BuyPercent, Baj, fBASE, DocType, CloseDate
  'Ոչ պետական արժեթղթեր
  Public IsClient, SecClass, CalcAcc, Count, RepayType, Period, Direction,_
          SumsDateFillType, SumsFillType, Client, DiscMethod, unitPrice, unitPriceFill
          
  Private Sub Class_Initialize()
    SecKind = 1
    SecType = 3
    Name = "Test"
    Percent = 12
    Baj = 360
    DateFill = 1
    Paragraph = 1
    CheckPayDates = 0
    MarketType = 1
    BuyPercent = 15
    
    IsClient = 1
    SecClass = 7
    Count = 0
    Period = 1
    Direction = 1
    SumsDateFillType = 1
	SumsFillType = "01"
				unitPrice = ""
				unitPriceFill = false
  End Sub          
  
'-------------------------------------------------------------------------------------    
'"Արժեթղթեր ՄՄԺՊ" / "Վաճառքի արժեթղթեր" / "Վերավաճառքի արժեթղթեր"  տեսակի պայմանագրի ստեղծում
'FolderName - Այն թղթապանակի անունն է որտեղից պետք է ստեղծվի պայամանագիրը
'-------------------------------------------------------------------------------------
  Public Sub CreateSecurity(FolderName)
    Dim frmModalBrowser, TabN, wTabStrip
    
    BuiltIn.delay(2000)
    Call wTreeView.DblClickItem(FolderName)
    Call Rekvizit_Fill("Dialog", 1, "CheckBox", "OLDTYPE", 1) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")

    Set frmModalBrowser = p1.WaitVBObject("frmModalBrowser", 500)	
	  If frmModalBrowser.Exists	Then
			Do Until p1.frmModalBrowser.VBObject("tdbgView").EOF
  			If RTrim(p1.frmModalBrowser.VBObject("tdbgView").Columns.Item(col_item).Text) = DocType  Then
    			Call p1.frmModalBrowser.VBObject("tdbgView").Keys("[Enter]")
    			Exit do
  			Else
    			Call p1.frmModalBrowser.VBObject("tdbgView").MoveNext
  			End If
  		Loop 
	  Else
		  Log.Error("frmModalBrowser does not exists.")
		  Exit Sub
	  End If
    
    'Վերցնել "Պայմանագրի համար" դաշտի արշժեքը
    DocNum = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TextC").Text 
    'Վերցնել պայմանագրի ISN-ը
    fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    
    If DocType = "îáÏáë³ÛÇÝ »Ï.µ»ñáÕ ³ñÅ»ÃáõÕÃ" Then
      'Լրացնել "Արժ.տիպ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "SECKIND", SecKind) 
      'Լրացնել "Արժեթղթի տոկոսադրույք" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "PCAGR", Percent & "[Tab]") 
      'Լրացնել "Թողարկման ամսաթիվ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "DATEPUBLISH", PublishDate) 
      'Լրացնել "Նախորդ մարմանխ ժամկետ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "DATE", PrevRepDate) 
      'Լրացնել "Մարման ժամկետ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "DATEAGR", Term) 
      If DateFill = 1 Then
        'Դնել "Ամսաթվերի լրացում" նշիչը
        wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("CheckBox").Click
        'Լրացնել "Սկզբի ամսաթիվ" դաշտը
        Call Rekvizit_Fill("Dialog", 1, "General", "FIRSTDAY", FirstDate)
        If CheckPayDates = 1 Then
          'Լրացնել "Նշ." նշիչը
          Call Rekvizit_Fill("Dialog", 1, "CheckBox", "INCLFIXD", 1) 
          'Լրացնել "Մարման օրեր" դաշտը
          Call Rekvizit_Fill("Dialog", 1, "General", "FIXEDDAYS", PayDates) 
        Else    
          'Լրացնել "Պարբերություն" դաշտը
          Call Rekvizit_Fill("Dialog", 1, "General", "PERIODICITY", Paragraph & "[Tab]") 
        End If
        'Սեղմել "Կատարել"
        Call ClickCmdButton(2, "Î³ï³ñ»É")
      End If  
    End If  
    
    'Լրացնել "Արժ.տեսակ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "SECTYPE", SecType) 
    'Լրացնել "Անվանում" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "NAME", Name) 
    'Լրացնել "Անվանական արժեք" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "ALLSUMMA", Nominal) 
    If DocType = "îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ" or DocType = "îáÏáë³ÛÇÝ »Ï. ãµ»ñáÕ ³ñÅ»ÃáõÕÃ" Then
      'Լրացնել "Թողարկման ամսաթիվ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "DATE", PublishDate) 
      'Լրացնել "Գնման ամսաթիվ" դաշտը
      Call Rekvizit_Fill("Document", 2, "General", "DATEGIVE", BuyDate)
      Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
      wTabStrip.SelectedItem = wTabStrip.Tabs(1)
      'Լրացնել "Մարման ժամկետ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "DATEAGR", Term) 
    End If  
    'Լրացնել "Շուկայի տեսակ" դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "MARKETTYPE", MarketType)
    'Լրացնել "Գնման ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "DATEGIVE", BuyDate)
    'Լրացնել "Գնի որոշման եկամտաբերության տոկոսադրույք" դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "PCAGRINC", BuyPercent & "[Tab]")
    'Սեղմել "Կատարել"
    Call ClickCmdButton(1, "Î³ï³ñ»É")
  End Sub
    
  
  
'-------------------------------------------------------------------------------------    
'"Ոչ պետական արժեթղթեր" տեսակի պայմանագրի ստեղծում
'FolderName - Այն թղթապանակի անունն է որտեղից պետք է ստեղծվի պայամանագիրը
'-------------------------------------------------------------------------------------
  Sub CreateNonGovSecurity(FolderName)
    Dim frmModalBrowser, TabN, wTabStrip
    
    BuiltIn.delay(2000)
    Call wTreeView.DblClickItem(FolderName)
    Call Rekvizit_Fill("Dialog", 1, "CheckBox", "OLDTYPE", 1) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")

    Set frmModalBrowser = p1.WaitVBObject("frmModalBrowser", 500)	
	  If frmModalBrowser.Exists	Then
			Do Until p1.frmModalBrowser.VBObject("tdbgView").EOF
  			If RTrim(p1.frmModalBrowser.VBObject("tdbgView").Columns.Item(col_item).Text) = DocType  Then
    			Call p1.frmModalBrowser.VBObject("tdbgView").Keys("[Enter]")
    			Exit do
  			Else
    			Call p1.frmModalBrowser.VBObject("tdbgView").MoveNext
  			End If
  		Loop 
	  Else
		  Log.Error("frmModalBrowser does not exists.")
		  Exit Sub
	  End If
    
    'Վերցնել "Պայմանագրի համար" դաշտի արշժեքը
    DocNum = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TextC").Text 
    'Վերցնել պայմանագրի ISN-ը
    fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Լրացնել "Հաճախորդային" նշիչը
    Call Rekvizit_Fill("Document", 1, "CheckBox", "ISCLISEC", IsClient) 
    'Լրացնել "Արժ.դաս" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "SECFUNC", SecClass) 
    'Լրացնել "Արժ.տեսակ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "SECTYPE", SecType) 
    'Լրացնել "Թղթակցային հաշիվ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "ACCACC", CalcAcc) 
    'Լրացնել "Թողարկում" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "SECNAME", Name) 
    'Լրացնել "Քանակ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "COUNT", Count) 
				'Լրացնել "Միավորի գին" դաշտը
				if unitPriceFill then
						Call Rekvizit_Fill("Document", 1, "General", "CHILDPRICE", unitPrice)
				end if
    'Լրացնել "Անվանական արժեք" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "ALLSUMMA", Nominal) 
    
    If DocType = "îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ áã å»ï.³ñÅ»ÃáõÕÃ" Then
      'Լրացնել "Թողարկման ամսաթիվ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "DATE",  "^A[Del]" & PublishDate)
    Else  
      'Լրացնել "Արժեթղթի տոկոսադրույք" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "PCAGR", Percent & "[Tab]")
      'Լրացնել "Թողարկման ամսաթիվ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "DATEPUBLISH",  "^A[Del]" & PublishDate)
    End If  
    'Լրացնել "Գնման ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "DATEGIVE",  "^A[Del]" & BuyDate)
    Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
    wTabStrip.SelectedItem = wTabStrip.Tabs(1)
    'Լրացնել "Մարման ժամկետ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "DATEAGR", Term) 
    'Լրացնել "Շուկայի տեսակ" դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "MARKETTYPE", MarketType)
    'Լրացնել "Գնի որոշման եկամտաբերության տոկոսադրույք" դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "PCAGRINC", BuyPercent & "[Tab]")
    'Լրացնել "Զեղչ./Հավ.մաշեցման եղանակ" դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "STRAIGHTCH", DiscMethod & "[Tab]")

    If DocType = "îáÏáë³ÛÇÝ »Ï.µ»ñáÕ áã å»ï.³ñÅ»ÃáõÕÃ" Then
      'Լրացնել "Նախորդ մարման ժամկետ" դաշտը
      Call Rekvizit_Fill("Document", 2, "General", "DATE",  "^A[Del]" & BuyDate)
      'Լրացնել "Մարման տեսակ" դաշտը
      Call Rekvizit_Fill("Document", 2, "General", "ISAGRMAR",  "^A[Del]" & RepayType)
      'Լրացնել "Մարումենրի սկիզբ" դաշտը
      Call Rekvizit_Fill("Document", 3, "General", "AGRMARBEG", FirstDate)
      'Լրացնել "Պարբերություն" դաշտը
      Call Rekvizit_Fill("Document", 3, "General", "AGRPERIOD", Period & "[Tab]")
      'Լրացնել "Շրջանցման ուղղություն" դաշտը
      Call Rekvizit_Fill("Document", 3, "General", "PASSOVDIRECTION", Direction)
      'Լրացնել "Գումարների ամսաթվերի ընտրություն" դաշտը
      Call Rekvizit_Fill("Document", 3, "General", "SUMSDATESFILLTYPE", SumsDateFillType)
	  'Լրացնել "Գումարների բաշխման ձև" դաշտը
      Call Rekvizit_Fill("Document", 3, "General", "SUMSFILLTYPE", "^A[Del]"&SumsFillType)
      
      If IsClient = 1 Then
        wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip").SelectedItem = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip").Tabs(4)
        With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_4").VBObject("DocGrid")
          .Row = 0
          .Col = 0 
          .Keys(Client)  
        
          .Col = 1 
          .Keys(Nominal)
        
          .Col = 2 
          .Keys(Percent)
        End With 
      End If
      
    else  
		    If IsClient = 1 Then
		        wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip").SelectedItem = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip").Tabs(3)
		        With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_3").VBObject("DocGrid")
		          .Row = 0
		          .Col = 0 
		          .Keys(Client)  
        
		          .Col = 1 
		          .Keys(Nominal)
        
		          .Col = 2 
		          .Keys(Percent)
												.Keys("[Tab]")
		        End With 
		      End If
				end if
				
    'Սեղմել "Կատարել"
    Call ClickCmdButton(1, "Î³ï³ñ»É")

  End Sub
  
  
  'Հաստատում է պայմանագիրը
  Public Function Verify(FolderPath) 
    BuiltIn.delay(2000)
    Call wTreeView.DblClickItem(FolderPath)
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", DocNum) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToConfirm)
    BuiltIn.delay(2000)
    Call ClickCmdButton(1, "Ð³ëï³ï»É")

    BuiltIn.delay(2000)
    wMDIClient.VBObject("frmPttel").Close
  End Function 

  Public Sub CloseAgr()
    BuiltIn.delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrClose)
    BuiltIn.delay(2000)
    Call Rekvizit_Fill("Dialog", 1, "General", "DATECLOSE", CloseDate) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  End Sub
  
  Public Sub OpenAgr()
    BuiltIn.delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen)
    BuiltIn.delay(2000)
    Call ClickCmdButton(5, "²Ûá")  
  End Sub

End Class

Public Function New_SecurityDoc()
  Set New_SecurityDoc = New SecurityDoc
End Function

'-------------------------------------------------------------------------------------    
'Արժեթղթի առք գորողության կատարում
'Date - Ամսաթիվ
'-------------------------------------------------------------------------------------    
Function SecBuy(Date, SecType)
  BuiltIn.delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Select Case SecType
      Case "î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ ØØÄä"
        Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_SecBuy)
      Case "î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ í»ñ³í³×³éùÇ"
        Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_SecForResaleSecBuy)
      Case "î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ í³×³éùÇ"
        Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_SecForSaleSecBuy)
      Case "î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|àã å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñ"  
        Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_NonGovSecBuy)
  End Select
      
  SecBuy = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  'Լրացնել "Ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", Date) 
  Call ClickCmdButton(1, "Î³ï³ñ»É")
  BuiltIn.delay(2000)
  Call ClickCmdButton(5, "²Ûá")
End Function

'-------------------------------------------------------------------------------------    
'Արժեթղթի վաճառք գորողության կատարում
'Date - Ամսաթիվ
'Sum - Գումար
'Residence - Ռեզիդենտություն 
'Bank - Բանկ
'-------------------------------------------------------------------------------------    
Function SecSell(Date, Sum, Residence, Bank)
  BuiltIn.delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_SecSell)
  SecSell = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  
  'Լրացնել "Ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", Date) 
  'Լրացնել "Գումար" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "NOMINAL", Sum) 
  'Լրացնել "Ռեզիդենտություն" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "REZ", Residence) 
  'Լրացնել "Բանկ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "BANK", Bank) 
  
  Call ClickCmdButton(1, "Î³ï³ñ»É")
  BuiltIn.delay(2000)
  Call ClickCmdButton(5, "²Ûá")
End Function

'-------------------------------------------------------------------------------------    
'Պարտքերի մարում գործողթության կատարում
'Date - Ամսաթիվ
'-------------------------------------------------------------------------------------    
Function SecRepay(Date)
  BuiltIn.delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_PayOffDebt)
  SecRepay = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  
  'Լրացնել "Ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", Date) 
  Call ClickCmdButton(1, "Î³ï³ñ»É")
  BuiltIn.delay(2000)
  Call ClickCmdButton(5, "²Ûá")
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''SecBuy_NonGov'''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'àã å»ï³Ï³Ý ³ñÅ»ÃÕÃÇ ³éù
'Date - ³Ùë³ÃÇí
'IsClient - ·ñÇ¹Ç Éñ³óÙ³Ý ÷³áË³Ï³Ý, »Ã» 1` Éñ³óÝ»É
'Client - Ñ³×³Ëáñ¹
'Nominal - ¶áõÙ³ñ
Function SecBuy_NonGov(Date, IsClient, Client, Nominal)
  BuiltIn.delay(3000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_NonGovSecBuy)
      
  SecBuy_NonGov = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  'Լրացնել "Ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", Date) 
		
		If IsClient = 1 Then
    wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip").SelectedItem = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip").Tabs(2)
    With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("DocGrid")
      .Row = 0
      .Col = 0 
      .Keys(Client)  
        
      .Col = 2 
      .Keys(Nominal)
        
'      .Col = 2 
'      .Keys(Percent)
						.Keys("[Tab]")
    End With 
  End If
		
  Call ClickCmdButton(1, "Î³ï³ñ»É")
  BuiltIn.delay(2000)
  Call ClickCmdButton(5, "²Ûá")
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''ClientSec_Input'''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Ð³×³Ëáñ¹Ç ³ñÅ»ÃÕÃÇ Ùáõïù
'date - ³Ùë³ÃÇí
'client - Ñ³×³Ëáñ¹
'paidPrice - ¶áõÙ³ñ
Function ClientSec_Input(date, client, paidPrice)
		BuiltIn.delay(3000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_CliSecInput)
      
  ClientSec_Input = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  'Լրացնել "Ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", date) 
		
  With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
    .Row = 0
    .Col = 0 
    .Keys(client & "[Right]")  
        
    .Col = 3 
    .Keys(paidPrice)
        
'      .Col = 2 
'      .Keys(Percent)
				.Keys("[Tab]")
  End With 
		
  Call ClickCmdButton(1, "Î³ï³ñ»É")
End	Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''ClientSec_Output'''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Ð³×³Ëáñ¹Ç ³ñÅ»ÃÕÃÇ »Éù
'date - ³Ùë³ÃÇí
Function ClientSec_Output(date)
		BuiltIn.delay(3000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_CliSecOutput)
      
  ClientSec_Output = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  'Լրացնել "Ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", date) 
		
		Call ClickCmdButton(1, "Î³ï³ñ»É")
End	Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''CustomerAccApp'''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Հաճախորդի արժեթղթի հաշվապահական հավելվածի լրացման կլաս
Class CustomerAccApp
		public client
		public settlAcc
		public freeSecAcc
		public pledgedSecAcc
		public curr
		public clientNo
		public clientFreeNo
		public clientPledgedNo
		public closed
		private sub Class_Initialize()
				client = ""
				settlAcc = ""
				freeSecAcc = ""
				pledgedSecAcc = ""
				curr = ""
				clientNo = ""
				clientFreeNo = ""
				clientPledgedNo = ""
				closed = 0
		end sub
End Class

Function New_CustomerAccApp()
		Set New_CustomerAccApp = new CustomerAccApp
End	Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''Fill_CustomerAccApp'''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Լրացնել Հաճախորդի արժեթղթի հաշվապահական հավելված պատուհանը
Sub Fill_CustomerAccApp(custAccApp)
		Call Rekvizit_Fill("Document", 1, "General", "CLICOD", custAccApp.client)
		Call Rekvizit_Fill("Document", 1, "General", "ACCACC", custAccApp.settlAcc)
		Call Rekvizit_Fill("Document", 1, "General", "ACCDEPO", custAccApp.freeSecAcc)
		Call Rekvizit_Fill("Document", 1, "General", "ACCDEPOGUAR", custAccApp.pledgedSecAcc)
		With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
    .Row = 0
    .Col = 0 
    .Keys(custAccApp.curr)  
        
    .Col = 5 
    .Keys(custAccApp.clientNo)
        
    .Col = 6
    .Keys(custAccApp.clientFreeNo)
				
		.Col = 7
    .Keys(custAccApp.clientPledgedNo)
  End With 
		Call Rekvizit_Fill("Document", 1, "CheckBox", "ACCDOCCLOSE", custAccApp.closed)
End	Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''Create_CustomerAccApp''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Ստեղծել Հաճախորդի արժեթղթի հաշվապահական հավելված
Sub Create_CustomerAccApp(folderName, custAccApp)
		Call wTreeView.DblClickItem(folderName & "Üáñ Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³Í")
		if wMDIClient.VBObject("frmASDocForm").Exists then
				Call Fill_CustomerAccApp(custAccApp)
				Call ClickCmdButton(1, "Î³ï³ñ»É")
		else
				Log.Error "Can't open frmASDocForm window.", "", pmNormal, ErrorColor 
		end if
End	Sub