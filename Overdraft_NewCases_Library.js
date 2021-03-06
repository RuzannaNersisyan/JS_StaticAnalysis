Option Explicit
'USEUNIT Library_Common  
'USEUNIT Library_CheckDB  
'USEUNIT Constants
'USEUNIT Akreditiv_Library
'USEUNIT Mortgage_Library

'------------------------------------------------------------------------
' îáÏáëÝ»ñÇ Ñ³ßí³ñÏÙ³Ý ·áñÍáÕáõÃÛáõÝ
'------------------------------------------------------------------------
Function Overdraft_Percent_Accounting(DocN, opDate)
  BuiltIn.Delay(delay_middle)
  Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
  Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("AsTpComment").VBObject("TDBComment").Keys(DocN)
  Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("CmdOK").Click()
  
  If Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").VisibleRows = 0 Then
    Log.Message("There are no document with specified ID")
    Exit Function
  End If
  
 'îáÏáëÝ»ñÇ Ñ³ßí³ñÏáõÙ   
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Interests & "|" & c_PrcAccruing)
      
  BuiltIn.Delay(delay_middle) 
  
' ïáÏáë³·áõÙ³ñÇ Éñ³óáõÙ

  fBASE = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").DocFormCommon.Doc.isn
  str = GetVBObject ("DATECHARGE", wMDIClient.VBObject("frmASDocForm"))
  wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject(str).Keys(opDate & "[Tab]")
  
  str = GetVBObject ("DATE", wMDIClient.VBObject("frmASDocForm"))
  wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject(str).Keys(opDate & "[Tab]")
   
  Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").VBObject("CmdOk_2").Click()
'  Sys.Process("Asbank").VBObject("frmTrans").VBObject("cmdOk").Click()
  Overdraft_Percent_Accounting = fBASE
 ' Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close
End Function

'-------------------------------------------------------
' Պարտքի մարման Գործողություն  
'DocN - Պայմանագրի համար
'opDate - Ամսաթիվ
'opSum - Հիմնական գումար
'opPerSum - Տոկոսագումար
'opUnUsePerSum - Չօգտ.մասի տոկոս
'-------------------------------------------------------
Function  Overdraft_Repayment_Operation(DocN,opDate,opSum,opPerSum,opUnUsePerSum)
  Dim wTabStrip
  BuiltIn.Delay(delay_middle)
  Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
  Call Rekvizit_Fill("Dialog", 1, "General", "NUM", DocN) 
  Asbank.VBObject("frmAsUstPar").VBObject("CmdOK").Click()
  
  If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").VisibleRows = 0 Then
    Log.Message("There are no document with specified ID")
    Exit Function
  End If
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_PayOffDebt)
  BuiltIn.Delay(delay_middle)
  
  fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  
 'Մարման գործողության ամսաթվի լրացում 
  Call Rekvizit_Fill("Document", 1, "General", "DATE", opDate) 
 'Մարվող գումարի լրացում 
  Call Rekvizit_Fill("Document", 1, "General", "SUMAGR", opSum) 
 'Տոկոսագումարի լրացում 
  Call Rekvizit_Fill("Document", 1, "General", "SUMPER", opPerSum) 
 'Չօգտ. մասի տոկոսագումարի լրացում 
  Call Rekvizit_Fill("Document", 1, "General", "SUMPERNCH", opUnUsePerSum)
  
  'Անցնել 2.Այլ
  Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
  wTabStrip.SelectedItem = wTabStrip.Tabs(2)
  'Մարման աղբյուր դաշտի լրացում
  Call Rekvizit_Fill("Document", 2, "General", "REPSOURCE", 1)
  
  wMDIClient.VBObject("frmASDocForm").VBObject("CmdOk_2").Click()
  Asbank.VBObject("frmAsMsgBox").VBObject("cmdButton").Click()
 ' Sys.Process("Asbank").VBObject("frmTrans").VBObject("cmdOk").Click()
  Overdraft_Repayment_Operation = fBASE  
End Function

'------------------------------------------------------------------------
'  èÇëÏÇ ¹³ëÇãÇ ÝßáõÙ
'------------------------------------------------------------------------  
Function Overdraft_Risk_Index(DocN, risk_indx, percent, op_date)
  Dim wMainForm
  Set wMainForm = Sys.Process("Asbank").VBObject("MainForm") 
  Set wMDIClient = wMainForm.Window("MDIClient", "", 1) 
  Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
  Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("AsTpComment").VBObject("TDBComment").Keys(DocN & "[Tab]")
  Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("CmdOK").Click()
  
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_TermsStates & "|" & c_Risking & "|" & c_RiskCatPerRes)
  
  Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TDBDate").Keys(op_date & "[Tab]")
  Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").VBObject("TabFrame").VBObject("ASTypeTree").VBObject("TDBMask").Keys(risk_indx & "[Tab]")
  Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TDBNumber").Keys(percent & "[Tab]")

  fBASE = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").DocFormCommon.Doc.isn 
  Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").VBObject("CmdOk_2").Click()
  Overdraft_Risk_Index = fBASE    
End Function

' AllocateWithLim - Սահմանաչափերով բաշխվող
' RepayBy - Գումարի մարում ըստ հաշվարկային հաշվի
Class OverdraftDocument
  Public DocNum, CreditCard, Client, RepayCurr, Template, Curr, CalcAcc, PermAsAcc, Limit, Renewable,_
          AllocateWithLim, AutoCap, Date, GiveDate, Term, AutoDebt, RepayBy,_
          DateFillType, SumsDateFillType, Percent, NonUsedPercent, Baj, SumsFillType,_
          DateFill, Paragraph, PayDates, CheckPayDates, Direction, Sector, UsageField, Aim,_
          Schedule, Guarantee, Country, District, RegionLR, PaperCode, PledgeCode,_
          PledgeCur, PledgeValue, PledgeCount
  Public GraceDays, GraceDatesDir        
  Public DocType, DocLevel, fBASE, CloseDate        
  
  Private Sub Class_Initialize()
    CreditCard = 1
    Renewable = 1
    AllocateWithLim = 0
    AutoCap = 0
    AutoDebt = 1
    Percent = 12
    NonUsedPercent = 8
    Baj = 365
    DateFill = 1
    Paragraph = 1
    PayDates = Null
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
    SumsDateFillType = 1
    SumsFillType = "01"
  End Sub

'-------------------------------------------------------------------------------------
  'Տեղաբշծխված օվերդրաֆտի ստեղծում
'------------------------------------------------------------------------------------- 
  Public Sub CreatePlOverdraft(FolderName)
    Dim frmModalBrowser, wTabStrip, TabN, Rekv
    
    Call wTreeView.DblClickItem(FolderName)
    
    Set frmModalBrowser  = Asbank.WaitVBObject("frmModalBrowser", 500)	
		Do Until p1.frmModalBrowser.VBObject("tdbgView").EOF
			If RTrim(p1.frmModalBrowser.VBObject("tdbgView").Columns.Item(col_item).Text) = DocType  Then
  			Call p1.frmModalBrowser.VBObject("tdbgView").Keys("[Enter]")
  			Exit do
			Else
  			Call p1.frmModalBrowser.VBObject("tdbgView").MoveNext
			End If
		Loop 
   
    'Պայմանագրի մակարդակի վերագրում DocLevel օբյեկտին
    If Left(DocType, 4) <> "´³ñ¹" Then
      DocLevel = 1
    Else 
      DocLevel = 2  
    End If
    
    'Վերցմել պայմանագրի ISN-ը
    fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    'Դնել/Հանել "Վարկային քարտ" նշիչը
    Call Rekvizit_Fill("Document", 1, "CheckBox", "ISCART", CreditCard) 
  
    'Վերցնել "Պայմանագրի համար" դաշտի արշժեքը
    DocNum = Get_Rekvizit_Value("Document",1,"General","CODE")
    
    Set Rekv = wMDIClient.VBObject("frmASDocForm").WaitVBObject("AS_LABELAGRTYPE", delay_small)
    If Rekv.Exists Then 
      'Լրացնել "Ձևանմուշի N" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "AGRTYPE", Template)
    End If  
    'Լրացնել "Մարման արժույթ" դաշտը 
    Call Rekvizit_Fill("Document", 1, "General", "REPAYCURR", RepayCurr)
    'Լրացնել "Հաշվարկային հաշիվ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "ACCACC", CalcAcc)   
    'Լրացնել "Տոկոսների վճարման հաշիվ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "ACCACCPR", PermAsAcc)
    'Լրացնել "Սահմանաչափ"("Գումար") դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", Limit)
    'Դնել/Հանել "Վերականգնվող" նշիչը 
    Call Rekvizit_Fill("Document", 1, "CheckBox", "ISREGENERATIVE", Renewable)
    If Left(DocType, 8) = "¶ñ³ýÇÏáí" Then
      'Դնել/Հանել "Սահամանաչափով բաշխվող" նշիչը 
      Call Rekvizit_Fill("Document", 1, "CheckBox", "ALLOCATEWITHLIM", AllocateWithLim)
    End If
    'Դնել/Հանել "Կապիտալացվող" նշիչը 
    Call Rekvizit_Fill("Document", 1, "CheckBox", "AUTOCAP", AutoCap)
      
    'Լրացնել "Կնքման ամսաթիվ" դաշտը       
    Call Rekvizit_Fill("Document", 1, "General", "DATE", Date)
    
    If Left(DocType, 30) = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ" or Left(DocType,4) = "´³ñ¹" Then
      If Left(DocType, 30) = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ" Then
        'Լրացնել "Հատկացման ամսաթիվ" դաշտը
        Call Rekvizit_Fill("Document", 1, "General", "DATEGIVE", GiveDate)
      End If
      'Լրացնել "Մարման Ժամկետ" դաշտը 
      Call Rekvizit_Fill("Document", 1, "General", "DATEAGR", Term)
    End If
    
    'Անցնել 2(3, 5).Պարտքերի մարման ձև
    Select Case DocType
        Case "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ", "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ (³ñïáÝÛ³É Å³ÙÏ»ïáí)"
          TabN = 3
        Case "´³ñ¹ ûí»ñ¹ñ³ýï (·Í³ÛÇÝ)"  
          TabN = 5
        Case Else
          TabN = 2
    End Select
    
    Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
    wTabStrip.SelectedItem = wTabStrip.Tabs(TabN)
    
    Call Rekvizit_Fill("Document", TabN, "CheckBox", "AUTODEBT", AutoDebt)
  
    'Անցնել 4.Գրաֆիկի լրացման ձև
    If Left(DocType, 30) = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ" Then
      Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
      wTabStrip.SelectedItem = wTabStrip.Tabs(4)
      
      'Լրացնել "Ամսաթվերի լրացման ձև" դաշտը
      Call Rekvizit_Fill("Document", 4, "General", "DATESFILLTYPE", DateFill) 
      'Լրացնել "Մարման օրեր" դաշտը
      Call Rekvizit_Fill("Document", 4, "General", "FIXEDDAYS", PayDates)
      If Right(DocType, 19) = "(³ñïáÝÛ³É Å³ÙÏ»ïáí)" Then
        'Լրացնել "Հավելյալ օրերի քանակ" դաշտը
        Call Rekvizit_Fill("Document", 4, "General", "MARDAYS", GraceDays)
        'Լրացնել "Հավելյալ ամսաթվերի շրջանցման ուղղություն" դաշտը
        Call Rekvizit_Fill("Document", 4, "General", "PASSOVDIRGRDATE", GraceDatesDir)
      End If 
       
      'Լրացնել "Գումարների ամսաթվերի ընտրություն" դաշտը 
      Call Rekvizit_Fill("Document", 4, "General", "SUMSDATESFILLTYPE", SumsDateFillType) 
      'Լրացնել "Գումարների բաշխման ձև" դաշտը
	    Call Rekvizit_Fill("Document", 4, "General", "SUMSFILLTYPE", SumsFillType) 
    End If 
    
    'Անցնել 5.Ժամկետներ
    If Left(DocType, 8) <> "¶ñ³ýÇÏáí" Then
      If Left(DocType, 4) = "´³ñ¹" Then
        TabN = 4
        Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
        wTabStrip.SelectedItem = wTabStrip.Tabs(4)
      Else 
        TabN = 5
        Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
        wTabStrip.SelectedItem = wTabStrip.Tabs(5)
        Call Rekvizit_Fill("Document", 5, "General", "DATEGIVE", GiveDate)
        Call Rekvizit_Fill("Document", 5, "General", "DATEAGR", Term)
      End If
      
      With wMDIClient.VBObject("frmASDocForm")
        Select Case DocType
            Case "úí»ñ¹ñ³ýï"
              .VBObject("TabFrame_5").VBObject("CheckBox_11").Click
            Case "´³ñ¹ oí»ñ¹ñ³ýï (·Í³ÛÇÝ)"
              .VBObject("TabFrame_4").VBObject("CheckBox_7").Click
            Case Else
              .VBObject("TabFrame_5").VBObject("CheckBox_12").Click
        End Select
      End With 

      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "INCLFIXD", CheckPayDates)
      If CheckPayDates = 1 Then
        'Լրացնել "Մարման օրեր" դաշտը
        Call Rekvizit_Fill("Dialog", 1, "General", "FIXEDDAYS", PayDates)
      Else
        'Լրացնել "Պարպերություն" դաշտը
        Call Rekvizit_Fill("Dialog", 1, "General", "PERIODICITY", Paragraph & "[Tab]")
      End If
      'Լրացնել "Շրջանցման ուղղություն" դաշտը
      Call Rekvizit_Fill("Dialog", 1, "General", "PASSOVDIRECTION", Direction)
      'Սեղմել "Կատարել"
      Asbank.VBObject("frmAsUstPar").VBObject("CmdOK").ClickButton  
    End If
    If DocType = "²ñïáÝÛ³É.Å³ÙÏ.ûí»ñ¹ñ³ýï" Then  
      'Լրացնել "Հավելյալ օրերի քանակ" դաշտը
      Call Rekvizit_Fill("Document", 5, "General", "MARDAYS", GraceDays)
    End If  

    'Անցնել 6.Տոկոսներ    
    Select Case DocType
        Case "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
          TabN = 6
        Case "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ (³ñïáÝÛ³É Å³ÙÏ»ïáí)"  
          TabN = 5
        Case "´³ñ¹ ûí»ñ¹ñ³ýï (·Í³ÛÇÝ)"  
          TabN = 2
        Case Else
          TabN = 3
    End Select
      
    Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")
    wTabStrip.SelectedItem = wTabStrip.Tabs(TabN)
        
    'Լրացնել Օվերդրաֆտի տոկոսադրույք դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "PCAGR", Percent & "[Tab]" & Baj)     
    If DocType <> "²ñïáÝÛ³É.Å³ÙÏ.ûí»ñ¹ñ³ýï" Then  
      'Լրացնել "Չօգտագործված մասի տոկոսադրույք" դաշտը
      Call Rekvizit_Fill("Document", TabN, "General", "PCNOCHOOSE", NonUsedPercent & "[Tab]" & Baj)
    End If    
   'Անցնել 8.Լրացուցիչ   
    Select Case DocType
      Case "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ"
        TabN = 8
      Case "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ (³ñïáÝÛ³É Å³ÙÏ»ïáí)", "´³ñ¹ ûí»ñ¹ñ³ýï (·Í³ÛÇÝ)"    
        TabN = 7
      Case Else
        TabN = 6
    End Select                                                                   

    Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
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
    'Լրացնել "Պայմանագրի թղթային համար" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "PPRCODE", PaperCode)
    
    'Սեղմել "Կատարել"
    Call ClickCmdButton(1, "Î³ï³ñ»É")
  End Sub  

   'Պայմանագիրը ուղարկում է հաստատման
  Public Function SendToVerify(FolderPath)
    Call wTreeView.DblClickItem(FolderPath)
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", DocNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    With wMainForm
      If Left(DocType, 8) = "¶ñ³ýÇÏáí" Then
        'Կատարել Մարման գրաֆիկի նշանակում
        Builtin.Delay(2000)
        Call .MainMenu.Click(c_AllActions)
        Call .PopupMenu.Click(c_RepaySchedule)
        IF Right(DocType, 19) = "(³ñïáÝÛ³É Å³ÙÏ»ïáí)" Then
          Call ClickCmdButton(1, "Î³ï³ñ»É")
        End If 
      End If
      BuiltIn.Delay(2000)
      Call .MainMenu.Click(c_AllActions)
      Call .PopupMenu.Click(c_SendToVer)
    End With  
    Call ClickCmdButton(5, "²Ûá")
    Builtin.Delay(2000)
    Call Close_Pttel("frmPttel")
  End Function
  
  'Հաստատում է պայմանագիրը
  Public Function Verify(FolderPath) 
    Call wTreeView.DblClickItem(FolderPath)
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", DocNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    Builtin.Delay(3000)
    With wMDIClient
      If .VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 0 Then
        Builtin.Delay(2000)
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_ToConfirm)
    
        Call ClickCmdButton(1, "Ð³ëï³ï»É")
      Else 
        Log.Error(DocNum & " համարի պայմանագիրը չի գտնվել Հաստատվող փաստաթղթեր 1-ում")  
      End If
    End With
    Call Close_Pttel("frmPttel")
  End Function 
  
  Public Sub OpenInFolder(FolderName)
    Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)
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
    
    Builtin.Delay(1000)
    Call ClickCmdButton(5, "²Ûá")
  End Sub

End Class

Public Function New_Overdraft()
  Set New_Overdraft = New OverdraftDocument
End Function

'------------------------------------------------------------------------------------
'OverdraftType - Օվերդրաֆտի տեսակը
'CreditCard - Վարկային քարտ նշիչը
'payerCode - Հաճախորդի համար
'temlateType - Ձևանմուշ
'curCode - Արժույթ
'calcAcc - Հաշվարկային հաշիվ
'sum - գումար
'renewable - վերականգնվող/չվերականգնվող
'limit - սահամանաչափով բաշխվող/չբաշխվող
'aDate - կնքման ամսաթիվ
'pDate - հատկացման ամսաթիվ
'tDate - մարման ժամկետ
'dateType - Ամսաթվերի լրացման ձև
'sumsDateType - Գումարների ամսաթվերի ընտրություն
'Percent - Օվերդրաֆտի տոկոսադրույք
'Baj - Բաժ.
'sumsFillType - Գումարների բաշխման ձև
'paymentDate - Մարման օրեր
'branchCode - Ճյուղայնություն
'schedule - Ծրագիր
'guarant - Երաշխավորություն
'district - Մարզ
'number - Պայմանագրի թղթային համար
'fBASE - Պայմանագրի ISN
'sDOCNUM - Պայմանագրի համար
'AutoDebt - 
'PledgeCode - Կոդ
'PledgeCur - Արժույթ
'PledgeValue - Գրավի արժեք
'PledgeCount - Քանակ
'------------------------------------------------------------------------------------
Sub Letter_Of_Overdraft_Doc_Fill(OverdraftType, CreditCard, payerCode,temlateType,curCode, _
                                    calcAcc,sum,renewable, limit,aDate,pDate,tdate, RepayBy,_
                                    dateType, sumsDateType, Percent,Baj, sumsFillType, _
                                    paymentDate,branchCode, UsageField, Aim, schedule,_
                                    guarant, Country, District, RegionLR, number,_
                                    fBASE,sDOCNUM, AutoDebt, PledgeCode, PledgeCur, PledgeValue, PledgeCount)

  Dim var, frmModalBrowser, str, wTabStrip, wTabFrame_3, wTabFrame_4, wTabFrame_5, wTabFrame_6, wTabFrame_7, wTabFrame_8, wTabFrame_9, wTabFrame_10
  'Նոր պայամանագրի ստեղծում

  Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")                                                                                
	set frmModalBrowser  = Sys.Process("Asbank").WaitVBObject("frmModalBrowser", 500)	
	If frmModalBrowser.Exists	Then
			Do Until p1.frmModalBrowser.VBObject("tdbgView").EOF
 		 ' Օվերդրաֆտի տեսակի ընտրություն
  			If RTrim(p1.frmModalBrowser.VBObject("tdbgView").Columns.Item(col_item).Text) = RTrim(OverdraftType) Then
    			Call p1.frmModalBrowser.VBObject("tdbgView").Keys("[Enter]")
    			exit do
  			Else
    			Call p1.frmModalBrowser.VBObject("tdbgView").MoveNext
  			End If
  		Loop 
	Else
		Log.Error("frmModalBrowser does not exists.")
		Exit Sub
	End If

    fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  
    'Դնել/Հանել "Վարկային քարտ" նշիչը
    Call Rekvizit_Fill("Document", 1, "CheckBox", "ISCART", CreditCard) 
  
    'վերցնում ենք Պայմանագրի համարը
    sDOCNUM = Get_Rekvizit_Value("Document",1,"General","CODE")
  
    Call Rekvizit_Fill("Document", 1, "General", "CLICOD", payerCode)
    Call Rekvizit_Fill("Document", 1, "General", "AGRTYPE", temlateType)
    Call Rekvizit_Fill("Document", 1, "General", "CURRENCY", curCode)
    Call Rekvizit_Fill("Document", 1, "General", "ACCACC", calcAcc)
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", sum)
  
    'Դնել/Հանել "Վերականգնվող" նշիչը 
    Call Rekvizit_Fill("Document", 1, "CheckBox", "ISREGENERATIVE", renewable)
    'Դնել/Հանել "Սահամանաչափով բաշխվող" նշիչը 
    Call Rekvizit_Fill("Document", 1, "CheckBox", "ALLOCATEWITHLIM", limit)
 
    'Լրացնել "Կնքման ամսաթիվ" դաշտը aDate արժեքով
    Call Rekvizit_Fill("Document", 1, "General", "DATE", aDate)
    'Լրացնել "Հատկացման ամսաթիվ" դաշտը pDate արժեքով
    Call Rekvizit_Fill("Document", 1, "General", "DATEGIVE", pdate)
    'Լրացնել "Մարման Ժամկետ" դաշտը tDate արժեքով
    Call Rekvizit_Fill("Document", 1, "General", "DATEAGR", tDate)
  
  
    'Անցնել 4.Գրաֆիկի լրացման ձև
    'Լրացնել "Ամսաթվերի լրացման ձև" դաշտը dateType արժեքով
    Call Rekvizit_Fill("Document", 4, "General", "DATESFILLTYPE", dateType)
    'Լրացնել "Մարման օրեր" դաշտը paymentDate արժեքով
    Call Rekvizit_Fill("Document", 4, "General", "FIXEDDAYS", paymentDate)
    'Լրացնել "Գումարների ամսաթվերի ընտրություն" դաշտը sumsDateType  արժեքով
    Call Rekvizit_Fill("Document", 4, "General", "SUMSDATESFILLTYPE", sumsDateType)
    'Լրացնել "Գումարների բաշխման ձև" դաշտը sumsFillType  արժեքով
    Call Rekvizit_Fill("Document", 4, "General", "SUMSFILLTYPE", sumsFillType)
  
	  
  Select Case OverdraftType
      Case "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ" 
        'Անցնել 3.Պարտքերի մարման ձև
        'Դնել/Հանել "Պարտքերի ավտոմատ մարում" նշիչը
        Call Rekvizit_Fill("Document", 3, "CheckBox", "AUTODEBT", AutoDebt) 
        
        
        'Լրացնել "Գումարի մարում ըստ հաշվարկային հաշվի" դաշտը RepayBy արժեքով
        Call Rekvizit_Fill("Document", 3, "General", "CARDDEBTTYPE", RepayBy)
        
        'Անցնել 6.Տոկոսներ
        'Լրացնել Օվերդրաֆտի տոկոսադրույք և Բաժ. դաշտերը
        Call Rekvizit_Fill("Document", 6, "General", "PCAGR", Percent & "[Tab]" & Baj)
        
        'Անցնել 8.Լրացուցիչ                                                                      
  
        'Լրացնել "Ճյուղայնություն" դաշտը branchCode արժեքով
        Call Rekvizit_Fill("Document", 8, "General", "SECTOR", branchCode)
 
        'Լրացնել "Օգտագերծման ոլորտ(ՎՌ)" դաշտը UsageField արժեքով
        Call Rekvizit_Fill("Document", 8, "General", "USAGEFIELD", UsageField)

        'Լրացնել "Նպատակ" դաշտը AIM արժեքով
        Call Rekvizit_Fill("Document", 8, "General", "AIM", Aim)
        
        'Լրացնել "Ծրագիր" դաշտը schedule արժեքով
        Call Rekvizit_Fill("Document", 8, "General", "SCHEDULE", schedule)
        
        'Լրացնել "Երաշխավորություն" դաշտը guarant արժեքով
        Call Rekvizit_Fill("Document", 8, "General", "GUARANTEE", guarant)

        'Լրացնել "Երկիր" դաշտը Country արժեքով
        Call Rekvizit_Fill("Document", 8, "General", "COUNTRY", Country)

        'Լրացնել "Մարզ" դաշտը district արժեքով
        Call Rekvizit_Fill("Document", 8, "General", "LRDISTR", district)

        'Լրացնել "Մարզ(նոր ՎՌ)" դաշտը RegionLR արժեքով
        Call Rekvizit_Fill("Document", 8, "General", "REGION", RegionLR)
        
        'Լրացնել "Պայմանագրի թղթային համար" դաշտը number արժեքով
        Call Rekvizit_Fill("Document", 8, "General", "PPRCODE", number)
          
      Case "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ (³ñïáÝÛ³É Å³ÙÏ»ïáí)"
        'Լրացնել "Հավելյալ օրերի քանակ" դաշտը 
        Call Rekvizit_Fill("Document", 4, "General", "MARDAYS", 5)

        'Անցնել 3.Պարտքերի մարման ձև
        'Դնել/Հանել "Պարտքերի ավտոմատ մարում" նշիչը
        Call Rekvizit_Fill("Document", 3, "CheckBox", "AUTODEBT", AutoDebt) 
        'Լրացնել "Գումարի մարում ըստ հաշվարկային հաշվի" դաշտը RepayBy արժեքով
        Call Rekvizit_Fill("Document", 3, "General", "CARDDEBTTYPE", RepayBy)
        
        'Անցնել 5.Տոկոսներ
        'Լրացնել Օվերդրաֆտի տոկոսադրույք և Բաժ. դաշտերը
        Call Rekvizit_Fill("Document", 5, "General", "PCAGR", Percent & "[Tab]" & Baj)
        
        'Անցնել 7.Լրացուցիչ      
        'Լրացնել "Ճյուղայնություն" դաշտը branchCode արժեքով                                                                
        Call Rekvizit_Fill("Document", 7, "General", "SECTOR", branchCode)
        'Լրացնել "Նպատակ" դաշտը AIM արժեքով
        Call Rekvizit_Fill("Document", 7, "General", "AIM", Aim)
        'Լրացնել "Ծրագիր" դաշտը schedule արժեքով
        Call Rekvizit_Fill("Document", 7, "General", "SCHEDULE", schedule)
        
        
        'Լրացնել "Երաշխավորություն" դաշտը guarant արժեքով
        Call Rekvizit_Fill("Document", 7, "General", "GUARANTEE", guarant)

        'Լրացնել "Երկիր" դաշտը Country արժեքով
        Call Rekvizit_Fill("Document", 7, "General", "COUNTRY", Country)

        'Լրացնել "Մարզ" դաշտը district արժեքով
        Call Rekvizit_Fill("Document", 7, "General", "LRDISTR", district)
        
        'Լրացնել "Մարզ(նոր ՎՌ)" դաշտը RegionLR արժեքով
        Call Rekvizit_Fill("Document", 7, "General", "REGION", RegionLR)
        
        'Լրացնել "Պայմանագրի թղթային համար" դաշտը number արժեքով
        Call Rekvizit_Fill("Document", 7, "General", "PPRCODE", number)
               
        'Անցնել 10.Գրավ  
        'Լրացնել "Կոդ" դաշտը PledgeCode արժեքով
        Call Rekvizit_Fill("Document", 10, "General", "CODESTND", PledgeCode)
        

        'Լրացնել "Արժույթ" դաշտը PledgeCur արժեքով
        Call Rekvizit_Fill("Document", 10, "General", "MORTCURR", PledgeCur)

        'Լրացնել "Գրավի արժեք" դաշտը PledgeValue արժեքով
        Call Rekvizit_Fill("Document", 10, "General", "MSUMMA", PledgeValue)

        'Լրացնել "Քանակ" դաշտը PledgeCount արժեքով
        Call Rekvizit_Fill("Document", 10, "General", "MCOUNT", PledgeCount)

  End Select    
      
  fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.Isn
  
  Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'-------------------------------------------------------------------------------------
'Օվերդրաֆտի տրամադրում
'GiveDate - Ամսաթիվ
'Money - Գումար
'oType - Կանխիկ/Անկանխիկ
'Num - "Կանխիկ  ելք " փաստաթուղթի համարը վերցնելու համար
'accNum - Հաշիվ
'accCredit - Հաշիվ կրեդիտ
'-------------------------------------------------------------------------------------
Function Give_Overdradt(GiveDate, Money, oType, Num, accNum, accCredit) 
  Dim fBASE
  'Կատարել "Գործողություններ\Բոլոր գործողություններ\Գործողություններ\Տրամադրում/Մարում|Օվերդրաֆտի տրամադրում" գործողությունը
  BuiltIn.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_GiveOverdraft)
  
    'Լրացնել Ամսաթիվ դաշտը GiveDate արժեքով
    Call Rekvizit_Fill("Document", 1, "General", "DATE", GiveDate)
    'Լրացնել Գումար դաշտը Money արժեքով
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", Money)
    'Լրացնել Կանխիկ/Անկանխիկ դաշտը oType արժեքով
    Call Rekvizit_Fill("Document", 1, "General", "CASHORNO", oType)
  
    fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    
    Select Case oType
    Case "1"
      'Սեղմել "Կատարել" կոճակը 
      Call ClickCmdButton(1, "Î³ï³ñ»É")
  
      'Պետք է հայտնվի "Կանխիկ  ելք " փաստաթուղթը :
      'Փաստաթղթի N դաշտի արժեքի վերագրում փոփոխականին
      Num = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
      'Սեղմել "Կատարել" կոճակը 
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      'Փակել "Կանխիկ ելք փաստաթղթի տպելու ձևը" պատուհանը
      WMDIClient.VBObject("FrmSpr").Close
    Case "2"
      'Սեղմել "Կատարել" կոճակը 
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      Call ClickCmdButton(5, "²Ûá")
    Case "3"
      'Սեղմել "Կատարել" կոճակը 
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      'Լրացնել "Հաշիվ կրեդիտ" դաշտը accCredit արժեքով:
      Call Rekvizit_Fill("Document",1,"General","ACCCORR",accCredit)
      Call ClickCmdButton(5, "²Ûá")
      'Փակել "Վճարման հանձնարարագիր փաստաթղթի տպելու ձևը" պատուհանը
      wMDIClient.VBObject("FrmSpr").Close
    End Select
    
    Give_Overdradt = fBASE
End Function  

'-------------------------------------------------------
'' Փնտրում է փաստաթուղթ ըստ անունի և անվան երկարության
'name - Անվանում
'name_len - անվան երկարություն
'ColNum - սյան համար
'-------------------------------------------------------
Function Find_Doc_By(name, name_len,ColNum, Pttel)
  Dim IfExists, my_vbObj
  IfExists = false
  wMDIClient.Refresh
  Set my_vbObj = wMDIClient.WaitVBObject("frmPttel" & Pttel, 5000)
  wMDIClient.Refresh
  BuiltIn.delay(3000)
  If my_vbObj.Exists Then 
    my_vbObj.vbObject("tdbgView").MoveFirst
    Do While (Not my_vbObj.vbObject("tdbgView").EOF)  
      If Left(Trim(my_vbObj.vbObject("tdbgView").Columns.Item(ColNum).Text), name_len) = Trim(name)  then 
        IfExists = True 
        Exit Do   
      Else
        Call my_vbObj.vbObject("tdbgView").MoveNext
      End If
    Loop 
  Else
    Log.Error("Թղթապանակը հնարավոր չեղավ բացել")
  End If

  Find_Doc_By = IfExists
End Function

'-------------------------------------------------------
' Պարտքերի մարում և վճարվող գումարի չափի ստուգում
'DocN - փաստաթղթի համար
'opDate - ամսաթիվ
'exp_Money - սպասված գումար
'-------------------------------------------------------
Function  Overdraft_Repayment_Check(DocN, opDate, exp_Money)
  Dim Money, Str, fBASE
  BuiltIn.Delay(delay_middle)
  Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
  With Asbank.VBObject("frmAsUstPar")
    .VBObject("TabFrame").VBObject("AsTpComment").VBObject("TDBComment").Keys(DocN)
    .VBObject("CmdOK").Click()
  End With  
  
  With wMDIClient
    If .VBObject("frmPttel").VBObject("tdbgView").VisibleRows = 0 Then
      Log.Message("There are no document with specified ID")
      Exit Function
    End If
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_PayOffDebt)
    BuiltIn.Delay(delay_middle)
  
    fBASE = .VBObject("frmASDocForm").DocFormCommon.Doc.isn
  
   'Մարման գործողության ամսաթվի լրացում 
    str = GetVBObject ("DATE", .VBObject("frmASDocForm"))
    .VBObject("frmASDocForm").VBObject("TabFrame").VBObject(str).Keys(opDate & "[Tab]")
 
    Money = Trim(wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TDBNumber_2").Text)
    If exp_Money<>Money Then
      call Log.Error("Առաջարկվող գումարը չի համապատսխանում սպասվող գումարին:")
      exit Function
    End if
    .VBObject("frmASDocForm").VBObject("CmdOk_2").Click()
  End With  
  Asbank.VBObject("frmAsMsgBox").VBObject("cmdButton").Click()
  
  Overdraft_Repayment_Check = fBASE
End Function

'-------------------------------------------------------------------------------------
'Ջնջել "Գործողությունների դիտում"-ից
'-------------------------------------------------------------------------------------
Sub DeleteD(date, typ, Key)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_OpersView)
  
  Call Rekvizit_Fill("Dialog", 1, "General", "START", date)
  Call Rekvizit_Fill("Dialog", 1, "General", "END", date)
  Call Rekvizit_Fill("Dialog", 1, "General", "DEALTYPE", typ)
  Call ClickCmdButton(2, "Î³ï³ñ»É")
    
  If wMDIClient.VBObject("frmPttel_3").VBObject("tdbgView").ApproxCount <> 0 Then
    Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
    Asbank.VBObject("frmDeleteDoc").VBObject("YesButton").ClickButton
    Select Case Key
      Case "1"
          ''Բացվել է հարցման պատուհանը
          Asbank.VBObject("frmAsMsgBox").VBObject("cmdButton").Click
    End Select
  End If
  wMDIClient.VBObject("frmPttel_3").Close
End Sub

'-------------------------------------------------------------------------------------
'Գրաֆիկի վերանայում գործողություն

'Date - Ամսաթիվ դաշտի արժեքը
'EndDate - Մարման ժամկետ դաշտի արժեքը
'ReNew - Երկարաձգում դաշտի արժեքը
'dateFill - Ամսաթվերի լրացում նշիչի արժեքը
'Money - "Գումար" դաշտի արժեքը
'PrMoney - Տոկոսագումար դաշտի արժեքը
'-------------------------------------------------------------------------------------
Function PaymentScheduleReview(Date, EndDate, ReNew, dateFill, Money, PrMoney) 
		Dim fBASE

		BuiltIn.Delay(3000)
  'Կատարել "Գործողություններ / Բոլոր գործողություններ / Պայմաններ և վիճակներ/Ժամկետներ/Գրաֆիկի վերանայում" գործողությունը 
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_TermsStates & "|" & c_Dates & "|" & c_ReviewSchedule)
  
  'Ստանալ փաստաթղթի ISN-ը
  fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
		
  'Լրացնել "Ամսաթիվ " դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", Date)
  'Լրացնել "Մարման ժամկետ" դաշտը  
  Call Rekvizit_Fill("Document", 1, "General", "DATEAGR", EndDate) 
  'Լրացնել "Երկարաձգում" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "ISPROLONG", ReNew)
		If dateFill <> 1 Then 
				'Լրացնել "Գործարքի ժամ" դաշտը
		  Call Rekvizit_Fill("Document", 1, "General", "TIMEOP", dateFill)
		End If
  With wMDIClient.VBObject("frmASDocForm")
    'Լրացնել "Ամսաթվերի լրացում" նշիչը
    .VBObject("TabFrame").VBObject("CheckBox").Click()
  
    'Վերցնել "Գումար" դաշտի արժեքը
    Money = .VBObject("TabFrame").VBObject("DocGrid").Columns.Item(4).FooterText
  
    'Վերցնել "Տոկոսագումար" դաշտի արժեքը
    PrMoney = .VBObject("TabFrame").VBObject("DocGrid").Columns.Item(5).FooterText
  End With
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  Call ClickCmdButton(1, "Î³ï³ñ»É")
		
		PaymentScheduleReview = fBASE
End Function

'------------------------------------------------------------------------
' Տոկոսների հաշվարկում
'fBASE - "Տոկոսների հաշվարկում" փաստաթղթի ISN
'DocNum - Պայմանագրի համար
'opDate - Ամսաթիվ
'PerSum - Տոկոսագումար
'------------------------------------------------------------------------
Sub Overdraft_Percent_Calculation(fBASE, DocNum, opDate, PerSum)
  Dim str
  
  Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
  Asbank.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("AsTpComment").VBObject("TDBComment").Keys("^A[Del]" & DocNum & "[Tab]")
  Asbank.VBObject("frmAsUstPar").VBObject("CmdOK").Click()
  
  If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").VisibleRows = 0 Then
    Log.Message(DocNum & " համարով պայմանագիրը առկա չէ")
    Exit Sub 
  End If
  
 'Տոկոսների հաշվարկում
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Interests & "|" & c_PrcAccruing)
  
  With wMDIClient.VBObject("frmASDocForm")
    '"Տոկոսների հաշվարկում" փաստաթղթի ISN-ը
    fBASE = .DocFormCommon.Doc.isn
  
    'Լրացնել "Հաշվարկման ամսաթիվ" դաշտը
    str = GetVBObject ("DATECHARGE", wMDIClient.VBObject("frmASDocForm"))
    .VBObject("TabFrame").VBObject(str).Keys(opDate & "[Tab]")
  
    'Լրացնել "Գործողության ամսաթիվ" դաշտը
    str = GetVBObject ("DATE", wMDIClient.VBObject("frmASDocForm"))
    .VBObject("TabFrame").VBObject(str).Keys(opDate & "[Tab]")

    'Տոկոսագումարի արժեքը`   
    PerSum = .VBObject("TabFrame").VBObject("AsCourse").VBObject("TDBNumber1").Text
    
    .VBObject("CmdOk_2").Click()
  End With
End Sub

'------------------------------------------------------------------------
' Գրավի վերադարձ
'opDate - Ամսաթիվ
'Sum - Ըդհանուր գումար
'------------------------------------------------------------------------
Sub ReturnPledge(opDate, Sum)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click( c_Opers & "|" & c_Return)
  
  With wMDIClient.VBObject("frmASDocForm")
  'Լրացնել "Ամսաթիվ" դաշտը
    .VBObject("TabFrame").VBObject("TDBDate").Keys(opDate & "[Tab]")
    'Սեղմել "Կատարել" կոճակը 
    .VBObject("CmdOk_2").ClickButton
  End With   
End Sub

'------------------------------------------------------------------------
'Գրավի պայմանագրի ստեղծում
'PledgeType - Գրավի տեսակ
'ContractType - Պայմանագրի տիպ
'ContractNumber - Պայմանագրի համար
'Cur - Արժույթ
'Sum - Սկզբնական արժեք
'Count - Սկզբնական քանակ
'Date - Կնքման ամսաթիվ
'Pledge -  Գրավի առարկա
'------------------------------------------------------------------------
Function CreatePledge(PledgeType, ContractType, PledgeDocNum, Cur, Sum, Count, Date, Pledge)
  Dim frmModalBrowser, wTabStrip, wTabFrame_3
  
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Safety & "|" & c_AgrOpen & "|" & c_Mortgage)
  
  Set frmModalBrowser = Sys.Process("Asbank").VBObject("frmModalBrowser").VBObject("tdbgView")
  If frmModalBrowser.Exists	Then
			Do Until frmModalBrowser.EOF
  			If Trim(frmModalBrowser.Text) = Trim(PledgeType) Then
    			Call frmModalBrowser.Keys("[Enter]")
    			Exit do
  			Else
    			frmModalBrowser.MoveNext
  			End If
  		Loop 
	Else
		Log.Error("Նոր պայմանագրի ստեղծում պատուհանը չի բացվել")
		Exit Function
	End If
  
  With wMDIClient.VBObject("frmASDocForm")
    'Լրացնել "Պայմանագրի տիպ" դաշտը
    .VBObject("TabFrame").VBObject("ASTypeTree").VBObject("TDBMask").Keys(ContractType & "[Tab]")
    'Վերցնել "Պայմանագրի համար" դաշտի արժեքը
    PledgeDocNum = .VBObject("TabFrame").VBObject("TextC").Text
    'Լրացնել "Արժույթ" դաշտը
    .VBObject("TabFrame").VBObject("ASTypeTree_2").VBObject("TDBMask").Keys(Cur & "[Tab]")
    'Լրացնել "Սկզբնական արժեք" դաշտը
    .VBObject("TabFrame").VBObject("TDBNumber").Keys(Sum & "[Tab]")
    'Լրացնել "Սկզբնական քանակ" դաշտը
    .VBObject("TabFrame").VBObject("TDBNumber_2").Keys(Count & "[Tab]")
    'Լրացնել "Կնքման ամսաթիվ" դաշտը
    .VBObject("TabFrame").VBObject("TDBDate").Keys(Date & "[Tab]")
    'Լրացնել "Գրավի առարակԱ(նոր ՎՌ)"
    Set wTabStrip = .VBObject("TabStrip")    
    wTabStrip.SelectedItem = wTabStrip.Tabs(3)
    Set wTabFrame_3 = .VBObject("TabFrame_3")

    .VBObject("TabFrame_3").VBObject("ASTypeTree_10").VBObject("TDBMask").Keys(Pledge & "[Tab]")
  
    CreatePledge = .DocFormCommon.Doc.isn
  
    .VBObject("CmdOk_2").ClickButton
  End With
End Function

'-------------------------------------------------------------------------------------
' Արդյունավետ տոկոսադրույք փաստաթղթի ստեղծում
'--------------------------------------------------------------------------------------
' Date - Արդյունավետ տոկոսադրույքի նշանակման ամսաթիվ
' IntRate - Արդյունավետ տոկոսադրույք
' RealRate -Փաստացի տոկոսադրուք
' fBASE - Արդյունավետ տոկոսադրույք փաստաթղթի ISN
Function InterestRate(Date, IntRate, RealRate)   
    Dim rekvName
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_TermsStates & "|" & c_Percentages & "|" & c_EffRate)
    With wMDIClient.vbObject("frmASDocForm")
      rekvName = GetVBObject ("DATE", wMDIClient.vbObject("frmASDocForm"))
      .vbObject("TabFrame").vbObject(rekvName).Keys(Date & "[Tab]")
    
      rekvName = GetVBObject ("PCNDER", wMDIClient.vbObject("frmASDocForm"))
      .vbObject("TabFrame").vbObject(rekvName).Keys(IntRate & "[Tab]")
    
      rekvName = GetVBObject ("PCNDERALL", wMDIClient.vbObject("frmASDocForm"))
      .vbObject("TabFrame").vbObject(rekvName).Keys(RealRate & "[Tab]")
    
      InterestRate = .DocFormCommon.Doc.isn
    
      .vbObject("CmdOk_2").Click()
    End With  
End Function

'-------------------------------------------------------------------------------------
' Պահուստավորում" գործողութուն
' Date - Ամսաթիվ
' Prov - Պահուստավորում
' Removal - Ապապահուստավորում
'-------------------------------------------------------------------------------------
Function Provision(Date, Prov, Removal)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Store & "|" & c_Store)
  
  With wMDIClient.VBObject("frmASDocForm")
    'Լրացնել "Ամսաթիվ" դաշտը
    .VBObject("TabFrame").VBObject("TDBDate").Keys(Date & "[Tab]")
    'Լրացնել "Պահուստավորում" դաշտը
    .VBObject("TabFrame").VBObject("TDBNumber").Keys(Prov & "[Tab]")
    'Լրացնել "Ապապահուստավորում" դաշտը
    .VBObject("TabFrame").VBObject("TDBNumber_2").Keys(Removal & "[Tab]")
  
    Provision = .DocFormCommon.Doc.isn
  
    'Սեղմել "Կատարել"
    .VBObject("CmdOk_2").ClickButton
  End With  
End Function

'-------------------------------------------------------------------------------------
' "Դուրս գրում" գործողութուն
' Date - Ամսաթիվ
' Sum - Գումար
' PerSum - Տոկոսագումար
'-------------------------------------------------------------------------------------
Function WriteOff(Date, Sum, PerSum)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_WriteOff & "|" & c_WriteOff)  
  
  With wMDIClient.VBObject("frmASDocForm")
    .VBObject("TabFrame").VBObject("TDBDate").Keys(Date & "[Tab]")
    .VBObject("TabFrame").VBObject("TDBNumber_2").Keys(Sum & "[Tab]")
    .VBObject("TabFrame").VBObject("TDBNumber_3").Keys(PerSum & "[Tab]")

    WriteOff = .DocFormCommon.Doc.isn
    
    .VBObject("CmdOk_2").ClickButton
  End With
End Function

'-------------------------------------------------------------------------------------
'Դուրս գրվածի վերականգնում փաստաթղթի լրացում
'Date - Ամսաթիվ
'Sum - Հիմանական գումար
'PerSum - Տոկոսագումար
'-------------------------------------------------------------------------------------
Function WriteOffReconstruction(Date, Sum, PerSum)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_WriteOff & "|" & c_WriteOffBack)  
  
  With wMDIClient.VBObject("frmASDocForm")
    .VBObject("TabFrame").VBObject("TDBDate").Keys(Date & "[Tab]")
    .VBObject("TabFrame").VBObject("TDBNumber_2").Keys(Sum & "[Tab]")
    .VBObject("TabFrame").VBObject("TDBNumber_3").Keys(PerSum & "[Tab]")
  
    WriteOffReconstruction = .DocFormCommon.Doc.isn
    'Սեղմել "Կատարել"
    .VBObject("CmdOk_2").ClickButton  
  End With
End Function

'-------------------------------------------------------------------------------------
'Պարտքերի զիջում փաստաթղթի լրացում
'Date - Ամսաթիվ
'Sum - Հիմանական գումար
'PerSum - Տոկոսագումար
'-------------------------------------------------------------------------------------
Function Neglecting_Of_Debts(Date, Sum, PerSum)
  'Կատարել "Գործողություններ/Բոլոր գործողություններ/Գործողություններ/Պարտքերի զիջում" գորժողությունը 
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_WriteOff & "|" & c_WriteOffBack)  
  
  With wMDIClient.VBObject("frmASDocForm")
    'Լրացնել "Ամսաթիվ" դաշտը 
    .VBObject("TabFrame").VBObject("TDBDate").Keys(Date & "[Tab]")
    'Լրացնել "Հիմանական գումար" դաշտը 
    .VBObject("TabFrame").VBObject("TDBNumber_2").Keys(Sum & "[Tab]")
    'Լրացնել "Տոկոսագումար" դաշտը  
    .VBObject("TabFrame").VBObject("TDBNumber_3").Keys(PerSum & "[Tab]")
  
    Neglecting_Of_Debts = .DocFormCommon.Doc.isn  
    'Սեղմել "Կատարել"
    .VBObject("CmdOk_2").ClickButton
  End With  
End Function

'-------------------------------------------------------------------------------------
' "Հաշվարկների ճշգրտում" գործողություն
' Date - Ամսաթիվ
' Տոկոսագումար - PerSum
' Ոչ ժամկետնանց տոկոս - NonPastPer
' Չօգտ. մասի տոկոս- NonUsedPer
' Ոչ ժամկետնանց չօգտ. մասի տոկոս - NonPastNonUsedSum
' ԲՏՀԴ տոկոսագումար - BankRatePer
' Ժամկետնանց գումարի տույժ - PastSum
' Ժամկետնանց տոկոսի տույժ - PastPer
' Ժամկետնանց գումարի տոկոս(վնաս) - PastPerSum
'-------------------------------------------------------------------------------------
Function Accruing_Adjustment(Date, PerSum, NonPastPer, NonUsedPer, NonPastNonUsedSum, BankRatePer, PastSum, PastPer, PastPerSum)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Interests & "|" & c_AccAdjust)  
  
  'Լրացնել "Ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", Date) 
  'Լրացնել "Տոկոսագումար" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "SUMPER", PerSum & "[Tab]") 
  'Լրացնել "Ոչ ժամկետնանց տոկոս" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "SUMPERNOJ", NonPastPer) 
  'Լրացնել "Չօգտ. մասի տոկոս" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "SUMPERNCH", NonUsedPer & "[Tab]") 
  'Լրացնել "Ոչ ժամկետնանց չօգտ. մասի տոկոս" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "SUMNCHNOJ", NonPastNonUsedSum) 
  'Լրացնել "ԲՏՀԴ տոկոսագումար" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "SUMREFIN", BankRatePer & "[Tab]") 
  'Լրացնել "Ժամկետնանց գումարի տույժ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "SUMFINE", PastSum & "[Tab]") 
  'Լրացնել "Ժամկետնանց տոկոսի տույժ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "SUMFINE2", PastPer & "[Tab]") 
  'Լրացնել "Ժամկետնանց գումարի տոկոս(վնաս)" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "SUMLOSS", PastPerSum & "[Tab]") 
  
  Accruing_Adjustment = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
 
  'Սեղմել "Կատաել"
  Call ClickCmdButton(1, "Î³ï³ñ»É")

End Function

'-------------------------------------------------------------------------------
'Գործողությունների ջնջում
'Date - Ամսաթիվ 
'Pttel 
'Typ - Փաստաթղթի տեսակ
'MesBox - Եթե MesBox = 1 , ապա բացվել է ջնջումը հաստատելու պատուհան 
'-------------------------------------------------------------------------------
Sub DeleteActions(Date, Pttel, Typ, MesBox)
  Dim Exist, AsMsgBox
  BuiltIn.delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_OpersView)
  
  With Asbank.VBObject("frmAsUstPar").VBObject("TabFrame")
    .VBObject("TDBDate").keys(Date & "[Tab]")
    .VBObject("TDBDate_2").Keys(Date & "[Tab]")
    .VBObject("ASTypeTree").VBObject("TDBMask").Keys(Typ & "[Tab]")
    Asbank.VBObject("frmAsUstPar").VBObject("CmdOK").ClickButton
  End With
  
  If wMDIClient.VBObject("frmPttel" & Pttel).VBObject("tdbgView").ApproxCount <> 0 Then
    wMDIClient.VBObject("frmPttel" & Pttel).VBObject("tdbgView").MoveLast
    Do While wMDIClient.VBObject("frmPttel" & Pttel).VBObject("tdbgView").ApproxCount <> 0
      Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
      Select Case MesBox
      Case 1
        Asbank.VBObject("frmAsMsgBox").VBObject("cmdButton").ClickButton  
      End Select    
      Asbank.VBObject("frmDeleteDoc").VBObject("YesButton").ClickButton
      While Asbank.VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel" & Pttel).VBObject("tdbgView").ApproxCount <> 0
        BuiltIn.Delay(delay_small)   
      Wend  
    Loop
  End If 

  wMDIClient.VBObject("frmPttel" & Pttel).Close
End Sub

'-------------------------------------------------------------------------------
''Բարդ օվերդրաֆտ (գծային) փաստաթղթի ստեղծում
'DocNum - Պայմանագրի համար
'fBASE - Պայմանագրի ISN
'CreditCard - "Վարկային քարտ" նշիչը 
'ClientCode - Հաճախորդ
'Curr - Արժույթ 
'CalcAcc - Հաշվարկային հաշիվ
'Summa - Սահմանաչափ
'Renewable - Վերականգնվող
'opDate - Կնաքման ամսաթիվ
'Term - Մարման ժամկետ
'OverdraftPercent - Օվերդրաֆտի տեկեսադրույք
'NonUsedPercent - Չօգտ. մասի տեկեսադրույք
'Baj - Բաժ.
'PastSum - Ժամկետնանց գումարի տույժ
'PastPerSum - Ժամկետնանց տոկոսի տույժ
'NonUsedPerSum - Չօգտ. մասի ժամկ.տոկոսի տույժ
'DateFill - Ամսաթվերի լրացում
'Paragraph - Պարբերություն
'CheckPayDates - Մարման օրեր Նշ.
'PayDates - Մարման օրեր
'Direction - Շրջանցման ուղղություն
'AutoDebt - Պարտքերի ավտոմատ մարում նշիչը
'AutoDateChild - "Ավտոմատ նշանակել ենթապայմանագրի մարման ժամկետ" նշիչը
'TypeAutoDate - Մարման նշանակման ձև
'AgrPeriod - Տևողություն
'DefineSchedule - Տոկոսների մարման ամսաթվերի լրացման ձև
'PerSumPayDate - Տոկոսագումարի ամսաթվերի լրացման ձև
'StartDate - Առաջիկա մարման սկիզբ
'Sector - Ճյուղայնություն
'UsageField - Օգտագործման ոլորտ(նոր ՎՌ)
'Aim - Նպատակ
'Schedule - Ծրագիր
'Guarantee - Երաշխավորություն
'Country - Երկիր
'District - Մարզ
'PaperCode - Պայմ.թղթային համար
'-------------------------------------------------------------------------------
Sub Letter_Of_Complicicated_Overdraft_Doc_Fill(DocNum, fBASE, CreditCard, ClientCode, _
                           Curr, CalcAcc, Summa, Renewable, opDate, Term, _
                           OverdraftPercent, NonUsedPercent, Baj, PastSum, PastPerSum, _
                           NonUsedPerSum, DateFill, Paragraph, CheckPayDates, _
                           PayDates, Direction, AutoDebt, UseOtherAccounts, Scheme, AutoDateChild, _
                           TypeAutoDate, AgrPeriod, DefineSchedule, _
                           PerSumPayDate, StartDate, Sector, UsageField, Aim, Schedule, _
                           Guarantee, Country, District, RegionLR, PaperCode)

   Dim var, frmModalBrowser, str, wTabStrip, my_vbObject, TabN 
  'Նոր պայմանագրի ստեղծում

  Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")                                                                                
	set frmModalBrowser  = Sys.Process("Asbank").WaitVBObject("frmModalBrowser", 500)	
	If frmModalBrowser.Exists	Then
			Do Until p1.frmModalBrowser.VBObject("tdbgView").EOF
  			If RTrim(p1.frmModalBrowser.VBObject("tdbgView").Columns.Item(col_item).Text) = "´³ñ¹ ûí»ñ¹ñ³ýï (·Í³ÛÇÝ)"  Then
    			Call p1.frmModalBrowser.VBObject("tdbgView").Keys("[Enter]")
    			exit do
  			Else
    			Call p1.frmModalBrowser.VBObject("tdbgView").MoveNext
  			End If
  		Loop 
	Else
		Log.Error("frmModalBrowser does not exists.")
		Exit Sub
	End If
  
  ''Անցնել 1.Ընդհանուր
  Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
  wTabStrip.SelectedItem = wTabStrip.Tabs(1)
  'Վերցնել պայմանագրի համարը
  DocNum = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TextC").Text
  'Վերցնել պայմանագրի ISN-ը
  fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  'Լրացնել "Վարկային քարտ" նշիչը 
  If Not IsNull(CreditCard) Then
    Call Rekvizit_Fill("Document", 1, "CheckBox", "ISCART", CreditCard)
  End If  
  'Լրացնել "Հաճախորդ" դաշտը
  If Not IsNull(ClientCode) Then
    Call Rekvizit_Fill("Document", 1, "General", "CLICOD", ClientCode)
  End If    
  'Լրացնել "Արժույթ" դաշտը
  If Not IsNull(Curr) Then
    Call Rekvizit_Fill("Document", 1, "General", "CURRENCY", Curr)
  End If  
  'Լրացնել "Հաշվարկային հաշիվ" դաշտը
  If Not IsNull(CalcAcc) Then
    Call Rekvizit_Fill("Document", 1, "General", "ACCACC", CalcAcc)
  End If                        
  'Լրացնել "Սահմանաչափ" դաշտը
  If Not IsNull(Summa) Then 
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", Summa)     
  End If  
  'Լրացնել "Վերականգնվող" նշիչը
  If Not IsNull(Renewable) Then
    Call Rekvizit_Fill("Document", 1, "CheckBox", "ISREGENERATIVE", Renewable)
  End If  
  'Լրացնել "Կնաքման ամսաթիվ" դաշտը
  If Not IsNull(opDate) Then
    Call Rekvizit_Fill("Document", 1, "General", "DATE", opDate)
  End If  
  'Լրացնել "Մարման ժամկետ" դաշտը   
  If Not IsNull(Term) Then 
    Call Rekvizit_Fill("Document", 1, "General", "DATEAGR", Term)
  End If  
   
  ''Անցնել 3.Տոկոսներ   
  TabN = 3
  Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
  wTabStrip.SelectedItem = wTabStrip.Tabs(TabN)
  'Լրացնել "Օվերդրաֆտի տոկոսադրույք" դաշտը
  If Not IsNull(OverdraftPercent) Then
    Call Rekvizit_Fill("Document", TabN, "General", "PCAGR", OverdraftPercent)
  End If  
  'Լրացնել Բաժ.` դաշտը
   wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_"&TabN&"").VBObject("AsCourse").VBObject("TDBNumber2").Keys(Baj & "[Tab]")
 
  'Լրացնել "Չօգտ. մասի տոկոսադրույք" դաշտը
  If Not IsNull(NonUsedPercent) Then
    Call Rekvizit_Fill("Document", TabN, "General", "PCNOCHOOSE", NonUsedPercent)
  End If
  'Լրացնել Բաժ.` դաշտը
   wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_"&TabN&"").VBObject("AsCourse_2").VBObject("TDBNumber2").Keys(Baj & "[Tab]")
 
  ''Անցնել 4.Տույժեր
  TabN = TabN + 1
  Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
  wTabStrip.SelectedItem = wTabStrip.Tabs(TabN)
  'Լրացնել "Ժամկետնանց գումարի տույժ" դաշտը
  If PastSum <> "" Then
    Call Rekvizit_Fill("Document", TabN, "General", "PCPENAGR", PastSum)
    'Լրացնել Բաժ.` դաշտը
    wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_"&TabN&"").VBObject("AsCourse_3").VBObject("TDBNumber2").Keys(Baj & "[Tab]")
  End If
   
  'Լրացնել "Ժամկետնանց տոկոսի տույժ" դաշտը
  If PastPerSum <> "" Then
    Call Rekvizit_Fill("Document", TabN, "General", "PCPENPER", PastPerSum)
    'Լրացնել Բաժ.` դաշտը
    wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_"&TabN&"").VBObject("AsCourse_4").VBObject("TDBNumber2").Keys(Baj & "[Tab]")
  End If
   
  'Լրացնել "Չօգտ. մասի ժամկ.տոկոսի տույժ" դաշտը
  If NonUsedPerSum <> "" Then
    Call Rekvizit_Fill("Document", TabN, "General", "PCPENNOCHOOSE", NonUsedPerSum)
    'Լրացնել Բաժ.` դաշտը
    wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_"&TabN&"").VBObject("AsCourse_5").VBObject("TDBNumber2").Keys(Baj & "[Tab]")
  End If
    
  ''Անցնել 5.Ժամկետներ
   TabN = TabN + 1
  Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
  wTabStrip.SelectedItem = wTabStrip.Tabs(TabN)
  'Լրացնել "Ամսաթվերի լրացում" նշիչը
  If DateFill = 1 Then
    wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_"&TabN&"").VBObject("CheckBox_7").Click()
    Asbank.VBObject("frmAsUstPar").SetFocus
    With Asbank.VBObject("frmAsUstPar").VBObject("TabFrame")
      If Not CheckPayDates Then
      'Լրացնել "Պարբերություն" դաշտը
       .VBObject("AsCourse").VBObject("TDBNumber1").Keys(Paragraph & "[Tab]" & "[Tab]")
      Else   
      'Լրացնել "Նշ." նշիչը
       .VBObject("Checkbox_2").Value = CheckPayDates
      'Լրացնել "Մարման օրեր" դաշտը
       .VBObject("TextC").Keys(PayDates & "[Tab]") 
      End If
      'Լրացնել "Շրջանցման ուղղություն" դաշտը
      .VBObject("ASTypeTree").VBObject("TDBMask").Keys(Direction & "[Tab]")
    End With  
    'Սեղմել "Կատարել"
    Asbank.VBObject("frmAsUstPar").VBObject("CmdOK").ClickButton
  End If 
  
  ''Անցնել 6.Պարտքերի մարման ձև
  TabN = TabN + 1
  Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
  wTabStrip.SelectedItem = wTabStrip.Tabs(TabN)
  'Լրացնել "Պարտքերի ավտոմատ մարում" նշիչը
  If Not IsNull(AutoDebt) Then
    Call Rekvizit_Fill("Document", TabN, "CheckBox", "AUTODEBT", AutoDebt)
  End If
  'Լրացնել "Այլ հաշիվների օգտագործում" դաշտը
  Call Rekvizit_Fill("Document", TabN, "General", "ACCCONNMODE", UseOtherAccounts & "[Tab]")
  'Լրացնել "Հաշիվների փոխկապակցման սխեմա" դաշտը
  Call Rekvizit_Fill("Document", TabN, "General", "ACCCONNSCH", Scheme & "[Tab]") 
  
  ''Անցնել 7.Ենթապայմ.ժամկետ
  TabN = TabN + 1
  Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
  wTabStrip.SelectedItem = wTabStrip.Tabs(TabN)  
  'Լրացնել "Ավտոմատ նշանակել ենթապայմանագրի մարման ժամկետ" նշիչը
  Call Rekvizit_Fill("Document", TabN, "CheckBox", "AUTODATECHILD", AutoDateChild)
  If AutoDateChild = 1 Then
    'Լրացնել "Մարման նշանակման ձև" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "TYPEAUTODATE", TypeAutoDate)
    Select Case TypeAutoDate 
    Case 1
      'Լրացնել "Մարման օրեր" դաշտը
      Call Rekvizit_Fill("Document", TabN, "General", "FIXEDDAYS", PayDates)
    Case 2  
      'Լրացնել "Տևողություն" դաշտը
      Call Rekvizit_Fill("Document", TabN, "General", "AGRPERIOD", AgrPeriod & "[Tab]")        
    End Select
   End If   
   
  'Լրացնել "Տոկոսների մարման ամսաթվերի սահմանում" նշիչը
  Call Rekvizit_Fill("Document", TabN, "CheckBox", "DEFINTSCHEDULE", DefineSchedule)
  If DefineSchedule = 1 Then
    'Լրացնել "Տոկոսագումարի ամսաթվերի լրացման ձև" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "SCHEDULEDATEORGMOD", PerSumPayDate)
    Select Case PerSumPayDate 
    Case 1 
      'Լրացնել "Մարման օրեր" դաշտը
      Call Rekvizit_Fill("Document", TabN, "General", "FIXEDDAYSPER", PayDates)
    Case 2
     'Լրացնել "Առաջիկա մարման սկիզբ" դաշտը
     Call Rekvizit_Fill("Document", TabN, "General", "UPINTERREPSTARTDATE", StartDate)
    End Select  
      
    'Լրացնել "Շրջանցման ուղղություն" դաշտը
    Call Rekvizit_Fill("Document", TabN, "General", "PASSOVDIRECTIONPER", Direction)
  End If 
  
   ''Անցնել 8.Լրացուցիչ    
   TabN = TabN + 1
  Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
  wTabStrip.SelectedItem = wTabStrip.Tabs(TabN)
  'Լրացնել "Ճյուղայնություն" դաշտը   
   Call Rekvizit_Fill("Document", TabN, "General", "SECTOR", Sector)
  'Լրացնել Օգտագործման ոլորտ(նոր ՎՌ) դաշտը
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
  'Լրացնել "Պայմ.թղթային համար" դաշտը
  Call Rekvizit_Fill("Document", TabN, "General", "PPRCODE", PaperCode) 
                      
  'Սեղմել "Կատարել"  
   wMDIClient.VBObject("frmASDocForm").VBObject("CmdOk_2").ClickButton       
End Sub

'--------------------------------------------------------------------------------
'Ենթապայամանգրի բացում
'SubAgrDocNum - Ենթապայմանագրի համար
'SubAgr_ISN - Ենթապայմանագրի ISN
'Summa - Գումար
'Date - Ամսաթիվ
'GiveDate - Հատկացման ամսաթիվ
'DateFill - "Ամսաթվերի լրացում" նշիչ
'FirstDate - Սկզբի ամսաթիվ
'Paragraph - Պարբերություն
'PayDatesCheck - Մարման օրեր Նշ.
'PayDates - Մարման օրեր
'Direction - Շրջանցման ուղություն
'--------------------------------------------------------------------------------
Sub OpenSubagreement(SubAgrDocNum, SubAgr_ISN, Summa, Date, GiveDate, DateFill, FirstDate, Paragraph, PayDatesCheck, PayDates, Direction)
  
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_OpenSubAgr)

  'Վերցնել ենթապայմանագրի համարը
  SubAgrDocNum = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TextC").Text
  'Վերցնել ենթապայմանագրի ISN-ը
  SubAgr_ISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  'Լրացնել "Գումար դաշտը"
  Call Rekvizit_Fill("Document", 1, "General", "SUMMA", Summa) 
  'Լրացնել "Ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", Date)
  
  'Լրացնել "Հատկացման ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 5, "General", "DATEGIVE", GiveDate)
  'Լրացնել "Ամսաթվերի լրացում" նշիչը  
  If DateFill = 1 Then
    wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_5").VBObject("CheckBox_8").Click
      
    'Լրացնում է Սկզբի ամսաթիվ դաշտը
    Call Rekvizit_Fill("Dialog", 1, "General", "FIRSTDAY", FirstDate)
    'Լրացնել "Նշ." նշիչը
    Call Rekvizit_Fill("Dialog", 1, "CheckBox", "INCLFIXD", PayDatesCheck)
    If PayDatesCheck = 0 Then
      'Լրացնել "Պարպերություն" դաշտը
      Call Rekvizit_Fill("Dialog", 1, "General", "PERIODICITY", Paragraph & "[Tab]")
    Else 
    'Լրացնել "Մարման օրեր" դաշտը
    Call Rekvizit_Fill("Dialog", 1, "General", "FIXEDDAYS", PayDates)
    End If     
    'Լրացնել "Շրջանցման ուղղություն" դաշտը
    Call Rekvizit_Fill("Dialog", 1, "General", "PASSOVDIRECTION", Direction)

    'Սեղմել "Կատարել"
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  End If
  
  'Սեղմել "Կատարել" 
  Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'-------------------------------------------------------------------------------
' Օվերդրաֆտ պայմանագրերի դաս 
'-------------------------------------------------------------------------------
Class OverdraftAttrDoc
  Public DocNum, Client, Curr, RepayCurr, CalcAcc, CalcAccPer, Limit, AutoDebt,_
         Date, Term, Percent, Baj, NonUsedPercent, GiveDate, DateFill, Paragraph,_
         PayDates, CheckPayDates, Direction, Sector, Schedule, PaperCode, District,_
         fBASE, DocLevel, DocType, CloseDate
  Public TaxRate         
  
  Private Sub Class_Initialize()
    Client = Null
    Curr = Null
    RepayCurr = 1
    AutoDebt = 1
    Percent = 12
    Baj = 365
    NonUsedPercent = 8
    DateFill = 1
    Paragraph = 1
    PayDates = Null
    CheckPayDates = 0
    Direction = 2
    Sector = "U2"
    Schedule = 9
    District = "001"
  End Sub
  
  'Ներգրավված օվերդրաֆտի ստեղծում
  Public Sub CreateAttrOverdraft(FolderName)
    Dim frmModalBrowser, wTabStrip, TabN
    
    Call wTreeView.DblClickItem(FolderName)
    
    Set frmModalBrowser  = Asbank.WaitVBObject("frmModalBrowser", 500)	
		Do Until p1.frmModalBrowser.VBObject("tdbgView").EOF
			If RTrim(p1.frmModalBrowser.VBObject("tdbgView").Columns.Item(col_item).Text) = DocType  Then
  			Call p1.frmModalBrowser.VBObject("tdbgView").Keys("[Enter]")
  			Exit do
			Else
  			Call p1.frmModalBrowser.VBObject("tdbgView").MoveNext
			End If
		Loop 
    
    'Վերցնել "Պայմանագրի համար" դաշտի արշժեքը
    DocNum = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TextC").Text 
    'Լրացնել "Մարման արժույթ" դաշտը 
    Call Rekvizit_Fill("Document", 1, "General", "REPAYCURR", RepayCurr)
    'Լրացնել "Հաշվարկային հաշիվ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "ACCACC", CalcAcc)   
    'Լրացնել "Տոկոսների վճարման հաշիվ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "ACCACCPR", CalcAccPer)
    'Լրացնել "Սահմանաչափ"("Գումար") դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", Limit)
    'Լրացնել "Պարտքերի ավտոմատ մարում" նշիչը
    Call Rekvizit_Fill("Document", 1, "CheckBox", "AUTODEBT", AutoDebt) 
    'Լրացնել "Կնքման ամսաթիվ" դաշտը       
    Call Rekvizit_Fill("Document", 1, "General", "DATE", Date)
    
    If DocType = "´³ñ¹ ûí»ñ¹ñ³ýï" Then
      'Լրացնել Մարման ժամկետ դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "DATEAGR", Term)
    End If
    
    'Անցնել 2.Տոկոսներ
    'Լրացնել "Վարկի տոկոսադրույք" դաշտը 
    Call Rekvizit_Fill("Document", 2, "General", "PCAGR", Percent & "[Tab]" & Baj)
    If DocType <> "ØÇ³Ý·³ÙÛ³ ûí»ñ¹ñ³ýï" Then
      'Լրացնել "Չօգտագործված մասի տոկոսադրույք" դաշտը
      Call Rekvizit_Fill("Document", 2, "General", "PCNOCHOOSE", NonUsedPercent & "[Tab]" & Baj)
    End If
    If DocType <> "´³ñ¹ ûí»ñ¹ñ³ýï" Then
      'Լրացնել "Հարկի տոկոս" դաշտը  
      Call Rekvizit_Fill("Document", 2, "General", "TAXVALUE", TaxRate)
    End If
      
    If DocType <> "´³ñ¹ ûí»ñ¹ñ³ýï" Then  
      'Անցնել 4.Ժամկետներ
      'Լրացնել "Հատկացման ամսաթիվ" դաշտը
      Call Rekvizit_Fill("Document", 4, "General", "DATEGIVE", GiveDate)
      'Լրացնել "Մարման ժամկետ" դաշտը
      Call Rekvizit_Fill("Document", 4, "General", "DATEAGR", Term)
      'Լրացնել "Ամսաթվերի լրացում" նշիչը
      If DateFill = 1 Then
        Select Case DocType
          Case "úí»ñ¹ñ³ýï"
            wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_4").VBObject("CheckBox_2").Click
          Case "ØÇ³Ý·³ÙÛ³ ûí»ñ¹ñ³ýï"
            wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_4").VBObject("CheckBox_3").Click
        End Select
        
        'Լրացնել "Նշ." նշիչը
        Call Rekvizit_Fill("Dialog", 1, "CheckBox", "INCLFIXD", CheckPayDates)
        If CheckPayDates = 1 Then
          'Լրացնել "Մարման օրեր" դաշտը
          Call Rekvizit_Fill("Dialog", 1, "General", "FIXEDDAYS", PayDates)
        Else
          'Լրացնել "Պարպերություն" դաշտը
          Call Rekvizit_Fill("Dialog", 1, "General", "PERIODICITY", Paragraph & "[Tab]")
        End If
        
        'Լրացնել "Շրջանցման ուղղություն" դաշտը
        Call Rekvizit_Fill("Dialog", 1, "General", "PASSOVDIRECTION", Direction)
        'Սեղմել "Կատարել"
        Call ClickCmdButton(2, "Î³ï³ñ»É")
        
      End If
        TabN = 5
     Else
        TabN = 4 
     End If
    
    'Վերցմել պայմանագրի ISN-ը
    fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Սեղմել "Կատարել"
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    
    If DocType = "´³ñ¹ ûí»ñ¹ñ³ýï" Then
      DocLevel = 2
    Else 
      DocLevel = 1
    End If
       
  End Sub
  
  'Պայմանագիրը ուղարկում է հաստատման
  Public Function SendToVerify(FolderPath)
    Call wTreeView.DblClickItem(FolderPath)
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", DocNum) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000) 
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendToVer)

    BuiltIn.Delay(2000) 
    Call ClickCmdButton(5, "²Ûá")
    Call Close_Pttel("frmPttel")
  End Function
  
  'Հաստատում է պայմանագիրը
  Public Function Verify(FolderPath) 
    Call wTreeView.DblClickItem(FolderPath)
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", DocNum) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.Delay(2000) 
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToConfirm)
    Builtin.Delay(1000)
    Call ClickCmdButton(1, "Ð³ëï³ï»É")
    Call Close_Pttel("frmPttel")
  End Function
   
  Public Sub CloseAgr()
    BuiltIn.Delay(2000) 
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrClose)
    BuiltIn.Delay(1000)
    
    Call Rekvizit_Fill("Dialog", 1, "General", "DATECLOSE", CloseDate)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  End Sub
  
  Public Sub OpenAgr()
    BuiltIn.Delay(2000) 
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen)
    Builtin.Delay(1000)
    
    Call ClickCmdButton(5, "²Ûá")
  End Sub
End Class

Public Function New_OverdraftAttrDoc()
    Set New_OverdraftAttrDoc = New OverdraftAttrDoc
End Function

'--------------------------------------------------------------------------------------
' Հիմանկան գործողության կատարում
' Date - Հաշվարկման ամսաթիվ, Գործողության ամսաթիվ
' PerSum - Տոկոսագումար
'--------------------------------------------------------------------------------------
Function MainOperation(Date, PerSum)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_MainOp)
  
  Call Rekvizit_Fill("Document", 1, "General", "DATECHARGE", Date)    'Հաշվարկման ամսաթիվ
  Call Rekvizit_Fill("Document", 1, "General", "DATE",       Date)    'Գործողության ամսաթիվ 
  Call Rekvizit_Fill("Document", 1, "General", "SUMPER",     PerSum)  'Տոկոսագումար
  
  MainOperation = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  
  Call ClickCmdButton(1, "Î³ï³ñ»É")
End Function

'------------------------------------------------------------------------
' Հիշարար օրդերի ստեղծում , վերադարձնում է նորաստեղծ փաստաթղթի ISN - ը
'------------------------------------------------------------------------
'order_date - Հիշարար օրդերի ստեղծման ամսաթիվ
'deb_acc - դեբետային հաշիվ
'cred_acc - կրեդիտային հաշիվ
'order_sum - օրդերի գումար              
Function Mem_Order_Create_Order(order_date, deb_acc, cred_acc, order_sum)
	Dim order_isn
  BuiltIn.Delay(delay_middle)  
  Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
  
	Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("TDBDate").Keys("[End]" & "[BS]" & "[BS]" & "[BS]" & "[BS]" & "[BS]" & "[BS]" & order_date &  "[Tab]")
	Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("TDBDate_2").Keys("[End]" & "[BS]" & "[BS]" & "[BS]" & "[BS]" & "[BS]" & "[BS]" & order_date &  "[Tab]")
	Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("AsTypeView").VBObject("TDBMask").Keys("[End]" & "[BS]" & "[BS]" & "[Tab]")
	
	Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("CmdOK").Click()
	
  BuiltIn.delay(2000)
	Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_MemOrds & "|" & c_MemOrd)
	
	'Ամսաթիվ դաշտի լրացում
	Call Rekvizit_Fill("Document", 1, "General", "DATE", order_date) 
  'Հաշիվ դեբետ դաշտի լրացում
	Call Rekvizit_Fill("Document", 1, "General", "ACCDB", deb_acc) 
  'Հաշիվ կրեդիտ դաշտի լրացում
	Call Rekvizit_Fill("Document", 1, "General", "ACCCR", cred_acc) 
	'Գումար դաշտի լրացում
	Call Rekvizit_Fill("Document", 1, "General", "SUMMA", order_sum) 
  'Նպատակ դաշտի լրացում
  Call Rekvizit_Fill("Document", 1, "General", "AIM", "111")
  
	order_isn = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
	Mem_Order_Create_Order = order_isn
	wMDIClient.VBObject("frmASDocForm").VBObject("CmdOk_2").Click()
	'Sys.Process("Asbank").VBObject("frmTrans").VBObject("cmdOk").Click()	
End Function

'------------------------------------------------------------------------
'"Հիշարար օրդեր" փաստաթղթի հեռացում
'Date - Ժամականակահատված
'ISN - Փաստաթղթի ISN
'------------------------------------------------------------------------
Sub DeletePayDoc(Date, ISN, DocType, Client)
  Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
  Call Rekvizit_Fill("Dialog", 1, "General", "PERN", Date) 
  Call Rekvizit_Fill("Dialog", 1, "General", "PERK", Date) 
  Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", DocType) 
  Call Rekvizit_Fill("Dialog", 1, "General", "CLICODE", Client) 
  Call Rekvizit_Fill("Dialog", 1, "General", "DOCISN", ISN) 
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  BuiltIn.delay(2000)
  
  If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount = 1 Then 
    Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
    Call ClickCmdButton(3, "²Ûá")
  End If
  BuiltIn.delay(2000)
  wMDIClient.VBObject("frmPttel").Close
End Sub