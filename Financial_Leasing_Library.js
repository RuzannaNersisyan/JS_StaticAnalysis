Option Explicit

'USEUNIT Library_Common  
'USEUNIT Constants
'USEUNIT Mortgage_Library

Class LeasingDoc
    Public DocNum, CreditCode, Client, Curr, RepayCurr, CalcAcc, PermAsAcc,_
           Summa, Date, AutoDebt, PayMode, UseOtherAcc, Percent, Baj, EffPercent,_
           ActualPercent, GiveDate, StartDate, DateFill, FirstDate,_ 
           LastDate, Paragraph, PayDates, CheckPayDates, Direction, Sector,_
           UsageField, Aim, Schedule, Guarantee, Country, District, RegionLR,_
           WeightAMDRisk, PaperCode, Note, fBASE, DocLevel, DocType
    Public BuyPrice, SalePrice, Term, DatesFillType, SubsidyRate, SumsDatesFillType,_
           SumsFillType           
    Public CloseDate, periodStart, periodEnd, pause, payCount, sumPayStart
  	Public office, department, accessType
  	Public ISN
         
    Private Sub Class_Initialize()
    	  ISN = ""
        CreditCode = Null
        Client = Null
        Curr = Null
        RepayCurr = 1
        PermAsAcc = Null
        AutoDebt = 1
        PayMode = 2
        UseOtherAcc = Null
        Percent = 12
        EffPercent = Null
        ActualPercent = Null
        Baj = 365
        DateFill = 1
        Paragraph = "1"
        PayDates = 15
        CheckPayDates = 0
        Direction = 2
        Sector = "U2"
        UsageField = "01.001"
        Aim = "00"
        Schedule = 9
        Guarantee = 9
        Country = "AM"
        District = "001"
        RegionLR = "010000008"
        WeightAMDRisk = 0
        Note = Null
        SumsDatesFillType = 1
        SumsFillType = "01"
    End Sub

'-------------------------------------------------------------------------------------    
' "Ֆինանսական լիզինգ(տեղաբաշխված)" տեսակի պայմանագրի ստեղծում
'FolderName - Այն թղթապանակի անունն է որտեղից պետք է ստեղծվի պայամանագիրը
'DocType - Պայմանագրի տեսակը
'-------------------------------------------------------------------------------------
  Public Sub CreateLeasing(FolderName)
    Dim frmModalBrowser, wTabStrip, TabN
    
    Call wTreeView.DblClickItem(FolderName)
    
    Set frmModalBrowser  = p1.WaitVBObject("frmModalBrowser", 500)	
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
			
    'Վերցնել "Պայմանագրի ISN-ը" դաշտի արժեքը
		ISN = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
		'Վերցնել "Պայմանագրի համար" դաշտի արժեքը
    DocNum = Get_Rekvizit_Value("Document",1,"General","CODE")
    'Լրացնել "Մարման արժույթ" դաշտը 
    Call Rekvizit_Fill("Document", 1, "General", "REPAYCURR", RepayCurr)
    'Լրացնել "Հաշվարկային հաշիվ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "ACCACC", CalcAcc)   
    'Լրացնել "Հիմանական միջոցի հաշիվ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "ACCPERMAS", PermAsAcc)
    'Լրացնել "Կնքման ամսաթիվ" դաշտը       
    Call Rekvizit_Fill("Document", 1, "General", "DATE", "![End]" & "[Del]" & Date)
				'Լրացնել "Գրասենյակ" դաշտը       
    Call Rekvizit_Fill("Document", 1, "General", "ACSBRANCH", "![End]" & "[Del]" & office)
				'Լրացնել "Բաժին" դաշտը       
    Call Rekvizit_Fill("Document", 1, "General", "ACSDEPART", "![End]" & "[Del]" & department)
				'Լրացնել "Հասան-ն տիպ" դաշտը       
    Call Rekvizit_Fill("Document", 1, "General", "ACSTYPE", accessType)
    
    If DocType = "¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ" Then
      'Լրացնել "Գնման գին" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "BUYPRICE", BuyPrice)
      'Լրացնել "Իրացման գին" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "SUMMA", Summa)
      'Լրացնել "Հատկացման ամսաթիվ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "DATEGIVE", "![End]" & "[Del]" & GiveDate)
      'Լրացնել "Մարման ժամկետ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "DATEAGR", "![End]" & "[Del]" & Term)
      TabN = 3
    Else
      TabN = 2  
    End If
    
    BuiltIn.Delay(500)
    Call ClickCmdButton(1, "¶»Ý»ñ³óÝ»É")
    BuiltIn.Delay(500)
    CreditCode = Trim(Get_Rekvizit_Value("Document",1,"General","CRDTCODE"))
    
    'Անցել 2(3).Պարտքերի մարման ձև
    Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
    wTabStrip.SelectedItem = wTabStrip.Tabs(TabN)
    
    'Լրացնել "Պարտքերի ավտոմատ մարում" նշիչը
    Call Rekvizit_Fill("Document", TabN, "CheckBox", "AUTODEBT", AutoDebt) 
    'Լրացնել "Մարման ձև" դաշտը 
    Call Rekvizit_Fill("Document", TabN, "General", "DEBTJPART1", PayMode)         
    
    'Անցել 3(5).Տոկոսներ
    If DocType = "¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ" Then
      TabN = 5
    Else
      TabN = 3
    End If
    
    wTabStrip.SelectedItem = wTabStrip.Tabs(TabN)
    'Լրացնել "Վարկի տոկոսադրույք" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "PCAGR", Percent)
    'Լրացնել "բաժ." դաշտը
    If DocType = "¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ" Then
      wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_5").VBObject("AsCourse_2").VBObject("TDBNumber2").Keys(Baj & "[Tab]")
    Else
      wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_3").VBObject("AsCourse").VBObject("TDBNumber2").Keys(Baj & "[Tab]")
    End If
    'Լրացնել "Արդյունավետ տոկոսադրույք" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "PCNDER", EffPercent)
    'Լրացնել "Փաստ. տոկոս." դաշտը  
    Call Rekvizit_Fill("Document", TabN, "General", "PCNDERALL", ActualPercent)
    
    Select Case DocType
        Case "¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ"
          'Անցել 4.Գրաֆիկի լրացման ձև դաշտը
          wTabStrip.SelectedItem = wTabStrip.Tabs(4)
          'Լրացնել "Ամսաթվերի լրացման ձև" դաշտը 
          Call Rekvizit_Fill("Document", 4, "General", "DATESFILLTYPE", DatesFillType)
					If DatesFillType = "1" then
		          'Լրացնել "Մարման օրեր" դաշտը
		          Call Rekvizit_Fill("Document", 4, "General", "FIXEDDAYS", PayDates)
					Else 
					    'Լրացնել "Պարբերություն" դաշտը
		          Call Rekvizit_Fill("Document", 4, "General", "AGRPERIOD", periodStart & "[Tab]" & periodEnd)
					End If
          'Լրացնել "Շրջանցման ուղղություն" դաշտը 
          Call Rekvizit_Fill("Document", 4, "General", "PASSOVDIRECTION", Direction)
          'Լրացնել "Գումարների ամսաթվերի ընտրություն" դաշտը
          Call Rekvizit_Fill("Document", 4, "General", "SUMSDATESFILLTYPE", SumsDatesFillType)
					'Լրացնել "Գումարի մարումների սկիզբ" դաշտը
          Call Rekvizit_Fill("Document", 4, "General", "MARBEG", sumPayStart)
					'Լրացնել "Մարումենրի քանակ" դաշտը
          Call Rekvizit_Fill("Document", 4, "General", "AGRMARCNT", payCount)
					'Լրացնել "Դադարի քանակ" դաշտը
          Call Rekvizit_Fill("Document", 4, "General", "AGRMARPER", pause)
          'Լրացնել "Գումարների բաշխման ձև" դաշտը
          Call Rekvizit_Fill("Document", 4, "General", "SUMSFILLTYPE", SumsFillType)

          TabN = 7
          
        Case "ÈÇ½ÇÝ·"
          'Անցել 5.Ժամկետներ
          wTabStrip.SelectedItem = wTabStrip.Tabs(5)
          'Լրացնել "Հատկացման ամսաթիվ" դաշտը
          Call Rekvizit_Fill("Document", 5, "General", "DATEGIVE", "![End]" & "[Del]" & GiveDate)
          'Լրացնել "Հաշվարկման սկիզբ" դաշտը
          Call Rekvizit_Fill("Document", 5, "General", "DATEBEGCHRG", "![End]" & "[Del]" & StartDate)
          'Լրացնել "Ամսաթվերի լրացում" նշիչը
          If DateFill <> 0 Then 
              wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_5").VBObject("CheckBox_8").Click

              'Լրացնել "Վերջի ամսաթիվ" դաշտը
              Call Rekvizit_Fill("Dialog", 1, "General", "LASTDAY", LastDate)
              'Լրացնել "Նշ." նշիչը
              Call Rekvizit_Fill("Dialog", 1, "CheckBox", "INCLFIXD", CheckPayDates)
              If CheckPayDates = 0 Then 
                  'Լրացնել "Պարբերություն" դաշտը
                  Call Rekvizit_Fill("Dialog", 1, "General", "PERIODICITY", Paragraph & "[Tab]")
              Else  
              'Լրացնել "Մարման օրեր" դաշտը
              Call Rekvizit_Fill("Dialog", 1, "General", "FIXEDDAYS", PayDates)
              End If   
              'Լրացնել "Ամբողջ գումար" դաշտը
              Call Rekvizit_Fill("Dialog", 1, "General", "SUMMAALL", Summa)
              'Լրացնել "Շրջանցման ուղղություն" դաշտը
              Call Rekvizit_Fill("Dialog", 1, "General", "PASSOVDIRECTION", Direction)
              
              'Սեղմել "Կատարել"
              Call ClickCmdButton(2, "Î³ï³ñ»É")
          End If  
          
          TabN = 6
    End Select
    
    'Անցել 6(7).Լրացուցիչ  
     wTabStrip.SelectedItem = wTabStrip.Tabs(TabN)
    'Լրացնել "Ճյուղայնություն" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "SECTOR", Sector)
    'Լրացնել "Օգտագործման ոլորտ(նոր ՎՌ)" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "USAGEFIELD", UsageField)
    'Լրացնել "Նպատակ" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "AIM", Aim)
    'Լրացնել "Ծրագիր" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "SCHEDULE", Schedule)
    'Լրացնել "Երաշխավորություն" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "GUARANTEE", Guarantee)
    'Լրացնել "Երկիր" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "COUNTRY", Country)
    'Լրացնել "Մարզ" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "LRDISTR", District)
    'Լրացնել "Մարզ(նոր ՎՌ)" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "REGION", RegionLR)
    'Լրացնել "Նշում" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "NOTE", Note)
    'Լրացնել "Պայմանագրի թղթային համար" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "PPRCODE", PaperCode)
    'Վերցնել պայմանագրի ISN-ը
    fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Սեղմել "Կատարել"
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    
    DocLevel = 1
  End Sub
  
  'Պայմանագիրը ուղարկում է հաստատման
  Public Function SendToVerify(FolderPath)
    Call wTreeView.DblClickItem(FolderPath)
    BuiltIn.Delay(2000)
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", DocNum) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendToVer)
    Call ClickCmdButton(5, "²Ûá")
    BuiltIn.Delay(3000)
    Call Close_Pttel("frmPttel")
  End Function
  
  'Հաստատում է պայմանագիրը
  Public Function Verify(FolderPath) 
    Call wTreeView.DblClickItem(FolderPath)
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", DocNum) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToConfirm)
    Builtin.Delay(1000)
    Call ClickCmdButton(1, "Ð³ëï³ï»É")
    Builtin.Delay(1000)
    Call Close_Pttel("frmPttel")
  End Function 

  Public Sub CloseAgr()
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrClose)
    Builtin.Delay(1000)
    
    Call Rekvizit_Fill("Dialog", 1, "General", "DATECLOSE", CloseDate)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  End Sub
  
  Public Sub OpenAgr()
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen)
    
    Call ClickCmdButton(5, "²Ûá")  
  End Sub
  
End Class 

Public Function New_LeasingDoc()
  Set New_LeasingDoc = New LeasingDoc
End Function