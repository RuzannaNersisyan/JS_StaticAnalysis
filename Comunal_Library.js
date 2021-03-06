Option Explicit
'USEUNIT Library_Common
'USEUNIT Library_CheckDB
'USEUNIT Constants

Class CommunalPaymentDoc
  Public arrayServicesToBePaid
  Public PhoneCode, ElCode, WaterCode, GasCode, GarbageCode, MobilePhoneCode, KarabakhTelecomCode, GNCCode, BeelineIPTVCode,_
          UcomServiceCode, OtherComCode
  Public Date, Tel, MobileTel, FirstName, LastName, Street, Building, Home, fBASE, Amount, DocNum      
  
  Private Sub Class_Initialize()
    ReDim arrayServicesToBePaid(11)
    Amount = Null
  End Sub
    
  '----------------------------------------------------------------------------------------------------------------------------------------------
  ' Կոմունալ վճարման հանձնարարագրի ստեղծում
  ' FolderName - Այն թղթապանակը, որտեղ փաստաթուղթը պետք է ստեղծվի
  ' Date - Ամսաթիվ
  ' arrCom - Այն ծառայությունների զանգվածը` որոնք պետք է վճարվեն
  '----------------------------------------------------------------------------------------------------------------------------------------------
  Public Sub CreateComPay(FolderName)
    Dim i, frmModalBrowser
    wTreeView.DblClickItem(FolderName)
    Call Rekvizit_Fill("Dialog", 1, "General", "PERN", Date) 
    Call Rekvizit_Fill("Dialog", 1, "General", "PERK", Date) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ComPayments)
    
    'Լրացնել ծառայությունների նշիչները
    i = 1
    With wMDIClient.VBObject("frmCommunal").VBObject("frmServices")
      While i < 7
        If arrayServicesToBePaid(i-1) = 1 Then
          If i <> 5 And i <> 6 Then
            .VBObject("Check" & i).Value = arrayServicesToBePaid(i-1)
            'Լրացնել Հեռախոս և Կոդ դաշտերը
            Select Case i
                Case 1 
                  .VBObject("txtTel1").Keys(PhoneCode & "[Tab]")
                  .VBObject("txtTel3").Keys(Tel & "[Tab]")
                Case 2
                  .VBObject("txtEl1").Keys(ElCode & "[Tab]")
                  .VBObject("txtEl3").Keys("^A[Del]" & Tel & "[Tab]")
                Case 3
                  .VBObject("txtWt1").Keys(WaterCode & "[Tab]")
                  .VBObject("txtWt3").Keys("^A[Del]" & Tel & "[Tab]")
                Case 4
                  .VBObject("txtGs1").Keys(GasCode & "[Tab]")  
                  .VBObject("txtGs3").Keys("^A[Del]" & Tel & "[Tab]")
            End Select
          ElseIf i = 5 Then
            .VBObject("Check8").Value = arrayServicesToBePaid(i-1)  
            'Լրացնել Կոդ դաշտը
            .VBObject("txtGarb1").Keys(GarbageCode & "[Tab]")
            'Լրացնել Հեռախոս դաշտը
            .VBObject("txtGarb3").Keys(Tel & "[Tab]")
          Else   
            .VBObject("Check5").Value = arrayServicesToBePaid(i-1)
            'Լրացնել Կոդ դաշտը
            .VBObject("txtAt1").Keys(MobilePhoneCode & "[Tab]")
            'Լրացնել Հեռախոսահամարը 
            .VBObject("txtAt2").Keys(MobileTel & "[Tab]")
          End If
        End If  
        i = i + 1
      Wend
        
      'Սեղմել "Փնտրել"
      .VBObject("cmdSearch").ClickButton
      
      Set frmModalBrowser = AsBank.WaitVBObject("frmModalBrowser", delay_middle)  
      If frmModalBrowser.Exists Then
        frmModalBrowser.Keys("[NumPlus]")
        frmModalBrowser.VBObject("tdbgView").Keys("[Enter]")
        
        If Not IsNull(Amount) Then
          wMDIClient.VBObject("frmCommunal").VBObject("grdTrans").Row = 0
          wMDIClient.VBObject("frmCommunal").VBObject("grdTrans").Col = 1
          wMDIClient.VBObject("frmCommunal").VBObject("grdTrans").Keys(Amount & "[Enter]")
        End If
      End If  
    End With
    
    For i = 6 To 10
      If arrayServicesToBePaid(i) = 1 Then
        Select Case i
            Case 6
              wMDIClient.VBObject("frmCommunal").VBObject("frmServices").VBObject("frmX").VBObject("cmdX").ClickButton
              Call Rekvizit_Fill("Dialog", 1, "General", "CODE", KarabakhTelecomCode) 
              Call Rekvizit_Fill("Dialog", 1, "General", "SUMMA", Amount)
              Call ClickCmdButton(2, "Î³ï³ñ»É")
            Case 7
              wMDIClient.VBObject("frmCommunal").VBObject("frmServices").VBObject("frmX").VBObject("cmdX_2").ClickButton
              Call Rekvizit_Fill("Dialog", 1, "General", "CODE", GNCCode) 
              Call Rekvizit_Fill("Dialog", 1, "General", "SUMMA", Amount)
              Call ClickCmdButton(2, "Î³ï³ñ»É")
            Case 8
              wMDIClient.VBObject("frmCommunal").VBObject("frmServices").VBObject("frmX").VBObject("cmdX_3").ClickButton
              Call Rekvizit_Fill("Dialog", 1, "General", "CODE", BeelineIPTVCode) 
              Call Rekvizit_Fill("Dialog", 1, "General", "SUMMA", Amount)
              Call ClickCmdButton(2, "Î³ï³ñ»É")
            Case 9
              wMDIClient.VBObject("frmCommunal").VBObject("frmServices").VBObject("frmX").VBObject("cmdX_4").ClickButton
              Call Rekvizit_Fill("Dialog", 1, "General", "CODE", UcomServiceCode) 
              Call Rekvizit_Fill("Dialog", 1, "General", "SUMMA", Amount)
              Call ClickCmdButton(2, "Î³ï³ñ»É")
            Case 10
              Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmCommunal").VBObject("frmServices").VBObject("frmX").VBObject("cmdX_5").ClickButton
              Call Rekvizit_Fill("Dialog", 1, "General", "CODE", OtherComCode) 
              Call Rekvizit_Fill("Dialog", 1, "General", "SUMMA", Amount)
              Call ClickCmdButton(2, "Î³ï³ñ»É")
        End Select
      End If
    Next
    
   'Սեղմել "Կատարել"
    wMDIClient.VBObject("frmCommunal").VBObject("cmdOK").ClickButton
    BuiltIn.Delay(3000)
    wMDIClient.VBObject("FrmSpr").Close
    
    'Վերցնել ֆաստաթղթի ISN-ը
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_View)
    fBASE = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    DocNum = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("TextC").Text
    wMDIClient.vbObject("frmASDocForm").Close
  End Sub
  
End Class

Public Function New_CommunalPaymentDoc()
  Set New_CommunalPaymentDoc = New CommunalPaymentDoc
End Function


'--------------------------------------------------------
' Մարել(առանձին) գործողության կատարում
' PayDate - Մարման ամսաթիվ
'--------------------------------------------------------
Sub ComunalRepaySingle(PayDate)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_RepaySingle)  
  
  'Լրացնել "Ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", PayDate) 
  
  Call ClickCmdButton(1, "Î³ï³ñ»É")
  BuiltIn.Delay(3000)
  wMDIClient.VBObject("FrmSpr").Close        
End Sub

'--------------------------------------------------------
' Մարել(Հավաքական)  գործողության կատարում
' PayDate - Մարման ամսաթիվ
'--------------------------------------------------------
Sub ComunalGroupRepay(PayDate)
  Call wMainForm.MainMenu.Click(c_Editor)
  Call wMainForm.PopupMenu.Click(c_MarkAll)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_RepayMultiple)  
  
  Call Rekvizit_Fill("Document", 1, "General", "DATE", PayDate) 
  Call ClickCmdButton(1, "Î³ï³ñ»É")

  BuiltIn.Delay(2000)
  wMDIClient.VBObject("FrmSpr").Close    
End Sub

'--------------------------------------------------------
' Մարել(Հավաքական) գործողության կատարում "Կոմունալ վճարումների ԱՇՏ" ծառից
' PayDate - Մարման ամսաթիվ
'--------------------------------------------------------
Sub ComunalGroupRepay_Workspace(PayDate, Service)
  wTreeView.DblClickItem("|ÎáÙáõÝ³É í×³ñáõÙÝ»ñÇ ²Þî|Ø³ñ»É (Ñ³í³ù³Ï³Ý)")
  Call Rekvizit_Fill("Dialog", 1, "CheckBox", Service, 1) 
  Call ClickCmdButton(2, "Î³ï³ñ»É")

  'Լրացնել "Ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", PayDate) 
  
  Call ClickCmdButton(1, "Î³ï³ñ»É")
  wMDIClient.VBObject("FrmSpr").Close        
End Sub