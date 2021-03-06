Option Explicit

'USEUNIT Library_Common  
'USEUNIT Constants

'-------------------------------------------------------------------------------------
' Սահմանաչափի պայմանագրերի դաս
'-------------------------------------------------------------------------------------
Class LimitDocument
  Public fBASE, DocNum, LimitType, Client, Curr, Limit, Renewable, Date, GiveDate,_
         Term, Percent, Baj, Sector, UsageField, Aim, Schedule, Guarantee, Country,_
         District, RegionLR, PaperCode, CloseDate
            
  Private Sub Class_Initialize()
    LimitType = 1
    Curr = "000"
    Renewable = 1
    Percent = 12
    Baj = 365
    Sector = "U2"
    UsageField = "17.003"
    Aim = "00"
    Schedule = 9
    Guarantee = 9
    Country = "AM"
    District = "001"
    RegionLR = "010000008"
  End Sub
  
'-------------------------------------------------------------------------------------
  'Սահմանաչափի ստեղծում
'------------------------------------------------------------------------------------- 
  Public Sub CreateLimit(FolderName)
    Dim frmModalBrowser, wTabStrip
    
    If Not IsNull(FolderName) Then
      Call wTreeView.DblClickItem(FolderName)      
    End If
    
    'Վերցնել "Պայմանագրի համար" դաշտի արշժեքը
    DocNum = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TextC").Text 
    'Վերցմել պայմանագրի ISN-ը
    fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    'Լրացնել "Սահմանաչափի տեսակ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "LIMKIND",  LimitType)
    'Լրացնել "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "CLICOD",   Client)
    'Լրացնել "Արժույթ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "CURRENCY", Curr)
    'Լրացնել "Գումար" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA",    Limit)
    'Լրացնել "Կնքման ամսաթիվ" դաշտը       
    Call Rekvizit_Fill("Document", 1, "General", "DATE",     Date)
    'Լրացնել "Հատկացման ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "DATEGIVE", GiveDate)
        'Լրացնել "Մարման ժամկետ" դաշտը  
    Call Rekvizit_Fill("Document", 1, "General", "DATEAGR",  Term)
    
    'Անցնել 4.Տոկոսներ
    'Լրացնել "Սահմանաչափի տոկոսադրույք" դաշտը 
    Call Rekvizit_Fill("Document", 4, "General", "CGGLLIMPCAGR", Percent & "[Tab]" & Baj)
    
    'Անցնել 6.Լրացուցիչ
    'Լրացնել "Ճյուղայնություն" դաշտը
    Call Rekvizit_Fill("Document", 6, "General", "SECTOR",     Sector)
    'Լրացնել "Օգտագործման ոլորտ(նոր ՎՌ)" դաշտը
    Call Rekvizit_Fill("Document", 6, "General", "USAGEFIELD", UsageField)
    'Լրացնել "Նպատակ" դաշտը
    Call Rekvizit_Fill("Document", 6, "General", "AIM",        Aim)
    'Լրացնել "Ծրագիր" դաշտը
    Call Rekvizit_Fill("Document", 6, "General", "SCHEDULE",   Schedule)
    'Լրացնել "Երաշխավորություն" դաշտը
    Call Rekvizit_Fill("Document", 6, "General", "GUARANTEE",  Guarantee)
    'Լրացնել "Երկիր" դաշտը
    Call Rekvizit_Fill("Document", 6, "General", "COUNTRY",    Country)
    'Լրացնել "Մարզ" դաշտը
    Call Rekvizit_Fill("Document", 6, "General", "LRDISTR",    District)
    'Լրացնել "Մարզ(նոր ՎՌ)" դաշտը
    Call Rekvizit_Fill("Document", 6, "General", "REGION",     RegionLR)
    'Լրացնել "Պայմանագրի թղթային համար" դաշտը
    Call Rekvizit_Fill("Document", 6, "General", "PPRCODE",    PaperCode)
    
    'Սեղմել "Կատարել"
    Call ClickCmdButton(1, "Î³ï³ñ»É")
  End Sub
  
'----------------------------------------------------------------------------------------
  'Պայմանագիրը ուղարկում է հաստատման
'----------------------------------------------------------------------------------------  
  Public Function SendToVerify(FolderPath)
    Dim i
    If Not IsNull(FolderPath) Then
      Call wTreeView.DblClickItem(FolderPath)
      Call Rekvizit_Fill("Dialog", 1, "General", "NUM", DocNum) 
      Call ClickCmdButton(2, "Î³ï³ñ»É")
    End If
    
    Builtin.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendToVer)
    Call ClickCmdButton(5, "²Ûá")
    Builtin.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
  End Function

'-------------------------------------------------------------------------------------  
  'Հաստատում է պայմանագիրը
'-------------------------------------------------------------------------------------  
  Public Function Verify(FolderPath) 
    Call wTreeView.DblClickItem(FolderPath)
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", DocNum) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(3000)
    
    If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 0 Then
      Builtin.Delay(2000)
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_ToConfirm)
      Call ClickCmdButton(1, "Ð³ëï³ï»É")
    Else 
      Log.Error(DocNum & " համարի պայմանագիրը չի գտնվել Հաստատվող փաստաթղթեր 1-ում")  
    End If   
      
    Builtin.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
  End Function 

'-------------------------------------------------------------------------------------
' Բացում է պայմանագիրը` FolderName թղթապանակում
'-------------------------------------------------------------------------------------    
  Public Sub OpenInFolder(FolderName)
    Call wTreeView.DblClickItem(FolderName & "ä³ÛÙ³Ý³·ñ»ñ")
    'Լրացնում է պայմանագրի համար դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NUM", "^A[Del]" & DocNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  End Sub  
  
'-------------------------------------------------------------------------------------
  'Սահմանաչափի պայմանագրի փակում
'------------------------------------------------------------------------------------- 
  Public Sub CloseAgr()
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrClose)
    
    Call Rekvizit_Fill("Dialog", 1, "General", "DATECLOSE", CloseDate)
    Asbank.VBObject("frmAsUstPar").VBObject("CmdOK").ClickButton
  End Sub
  
'-------------------------------------------------------------------------------------
  'Սահմանաչափի պայմանագրի բացում
'------------------------------------------------------------------------------------- 
  Public Sub OpenAgr()
    Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen)
    
    Asbank.VBObject("frmAsMsgBox").VBObject("cmdButton").ClickButton
  End Sub
End Class


Public Function New_LimitDocument()
  Set New_LimitDocument = New LimitDocument
End Function