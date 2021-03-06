Option Explicit

'USEUNIT Library_Common 
'USEUNIT Constants
'USEUNIT Mortgage_Library

'------------------------------------------------------------------------------------
' Գրավի պայմանագրերի դաս
'------------------------------------------------------------------------------------
Class PledgeDocument
  Public fBASE, DocType, PledgeKind, PledgeType,ContractType, DocNum, Client, Curr, Value, Count,_
          Date, GiveDate, PledgeLocation, PledgeObjectLR, CloseDate, Percent
  Public DocNum1        
          
  Private Sub Class_Initialize()
    DocType = "²ÛÉ ·ñ³í"
    PledgeType = 9
	ContractType = 1
    Curr = "000"
    PledgeLocation = 1
    PledgeObjectLR = 0
  End Sub 
  
'-------------------------------------------------------------------------------------
' Գրավի պայմանագրի ստեղծում
'-------------------------------------------------------------------------------------
  Public Sub CreatePledge(FolderName)        
    Dim frmModalBrowser, TabN

    Call wTreeView.DblClickItem(FolderName)
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
		  Log.Message("frmModalBrowser does not exists.")
	  End If
    
    'Վերցնել "Պայմանագրի համար" դաշտի արշժեքը
    DocNum = Get_Rekvizit_Value("Document",1,"General","CODE")
    'Վերցնել պայմանագրի ISN-ը
    fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Լրացնել "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "CLICOD", Client) 
    If Right(PledgeKind, 15) <> "³í³Ý¹³ÛÇÝ ·ñ³í|" Then
      'Լրացնել "Պայմանագրի տիպ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "SECTYPE", PledgeType) 
      'Լրացնել "Արժույթ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "CURRENCY", Curr)
      'Լրացնել "Գրավի արժեք" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "SUMMA", Value)
      'Լրացնել "Քանակ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "COUNT", Count)
    End If  
    'Լրացնել "Կնքման ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "DATE", Date)
    'Լրացնել "Հատկացման ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "DATEGIVE", GiveDate)
    
    If Right(PledgeKind, 15) <> "³í³Ý¹³ÛÇÝ ·ñ³í|" Then
      'Լրացնել "Գրավի գտնվելու վայր" դաշտը
      Call Rekvizit_Fill("Document", 2, "General", "PLACE", PledgeLocation)
    Else
      wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip").SelectedItem = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip").Tabs(2)
     If PledgeKind = "|êï³óí³Í ³í³Ý¹³ÛÇÝ ·ñ³í|"  Then 
        With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("DocGrid_3")
          .Col= 0 
          .Row = 0
          .Keys(Curr)
        
          .Col= 1 
          .Row = 0
          .Keys(DocNum1)
        
          .Col= 3 
          .Row = 0
          .Keys(Value)
        End With  
      Else
        With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("DocGrid_2")
          .Col= 0 
          .Row = 0
          .Keys(Curr)
        
          .Col= 1 
          .Row = 0
          .Keys(DocNum1)
        
          .Col= 3 
          .Row = 0
          .Keys(Value)
        End With  
      End If
    End If
    'Լրացնել "Գրավի առարկա(նոր ՎՌ)" դաշտը
    Call Rekvizit_Fill("Document", 3, "General", "MORTSUBJECT", PledgeObjectLR)

    Call ClickCmdButton(1, "Î³ï³ñ»É")
  End Sub
  

'-------------------------------------------------------------------------------------
' Երաշխավորության պայմանագրի ստեղծում
'-------------------------------------------------------------------------------------
  Public Sub CreateGuarantee(FolderName)        
    Dim frmModalBrowser, TabN, Rekv

    Call wTreeView.DblClickItem(FolderName)
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
		  Log.Message("frmModalBrowser does not exists.")
	  End If
    
    'Վերցնել "Պայմանագրի համար" դաշտի արշժեքը
    DocNum = Get_Rekvizit_Value("Document",1,"General","CODE")
    'Վերցնել պայմանագրի ISN-ը
    fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Լրացնել "Պայմանագրի տիպ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "SECTYPE", PledgeType) 
    If PledgeKind = "|êï³óí³Í »ñ³ßË³íáñáõÃÛáõÝ|"  Then
	      'Լրացնել "Պայմանագրի տեսակ" դաշտը
        Call Rekvizit_Fill("Document", 1, "General", "RESPTYPE", ContractType) 
    End If
    'Լրացնել "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "CLICOD", Client) 
    'Լրացնել "Արժույթ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "CURRENCY", Curr)
    'Լրացնել "Գումար" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", Value)
    Set Rekv = wMDIClient.VBObject("frmASDocForm").WaitVBObject("AS_LABELPCAGR", delay_small)
    If Rekv.Exists Then 
      'Լրացնել "Տոկոսադրույք" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "PCAGR", Percent)
    End If  
    'Լրացնել "Կնքման ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "DATE", Date)
    'Լրացնել "Հատկացման ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "DATEGIVE", GiveDate)

    Call ClickCmdButton(1, "Î³ï³ñ»É")
  End Sub
  
  'Պայմանագիրը ուղարկում է հաստատման
  Public Function SendToVerify(FolderPath)
    If Not IsNull(FolderPath) Then
      Call wTreeView.DblClickItem(FolderPath)
      Call Rekvizit_Fill("Dialog", 1, "General", "NUM", DocNum) 
      Call ClickCmdButton(2, "Î³ï³ñ»É")
    End If
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendToVer)
    BuiltIn.Delay(2000)
    
    Call ClickCmdButton(5, "²Ûá")
    BuiltIn.Delay(2000)
    Call Close_Pttel("frmPttel")
  End Function
  
  'Հաստատում է պայմանագիրը
  Public Function Verify(FolderPath) 
    Dim MsgBox
    Call wTreeView.DblClickItem(FolderPath)
    BuiltIn.Delay(2000)
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", DocNum) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToConfirm)
    BuiltIn.Delay(2000)
    Call ClickCmdButton(1, "Ð³ëï³ï»É")
    Set MsgBox = Asbank.WaitVBObject("frmAsMsgBox", delay_small)
    If MsgBox.Exists Then
      Call ClickCmdButton(5, "Î³ï³ñ»É")
    End If

    BuiltIn.Delay(2000)
    Call Close_Pttel("frmPttel")
  End Function 

  Public Sub CloseAgr()
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrClose)
    BuiltIn.Delay(2000)
    
    Call Rekvizit_Fill("Dialog", 1, "General", "DATECLOSE", CloseDate) 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  End Sub
  
  Public Sub OpenAgr()
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen)
'    Call ClickCmdButton(5, "²Ûá")  
  End Sub
  
  Public Sub OpenInFolder(FolderName)
    Call wTreeView.DblClickItem(FolderName & "ä³ÛÙ³Ý³·ñ»ñ")
    
    'Լրացնում է պայմանագրի համար դաշտը
    Call Rekvizit_Fill("Dialog", 1, "General","AGRNUM", "^A[Del]" & DocNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    wMDIClient.Refresh
    If wMDIClient.vbObject("frmPttel").vbObject("tdbgView").VisibleRows <> 1 Then
        Log.Message(DocNum & " համարի փաստաթուղթը բացակայում է 'Պայմանագրեր' թղտապանակում:")
    End If
  End Sub
  
End Class
 
Public Function New_PledgeDoc()
  Set New_PledgeDoc = New PledgeDocument
End Function


'-------------------------------------------------------------------------------------
' Գրավի տրամադրում / Գրավի վերադարձ 
'Date - Ամսաթիվ
'DocumentType - Պայմանագրի տեսակ
'   DocumentType = 1 - Գրավ/ Ստացված երաշխավորություն
'   DocumentType = 2 - Տրամադրված երաշխավորություն
'-------------------------------------------------------------------------------------
Function GiveReturnPledge(Date, Action, DocumentType)
  BuiltIn.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  If DocumentType = 1 Then 
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & Action)
  Else
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Outstanding & "|" & Action)
  End If  
  BuiltIn.Delay(2000)
  
  GiveReturnPledge = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    
  'Լրացնե "Ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", Date) 
  Call ClickCmdButton(1, "Î³ï³ñ»É")
End Function

'-------------------------------------------------------------------------------------
' Ճշգրտում/վերագնահատում 
'Date - Ամսաթիվ
'Sum - Գումար
'Count - Քանակ
'DocumentType - Պայմանագրի տեսակ
'   DocumentType = 1 - Գրավ
'   DocumentType = 2 - Երաշխավորություն
'-------------------------------------------------------------------------------------
Function Revaluation(Date, Sum, Count, DocumentType)
  Dim Rekv
  BuiltIn.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  If DocumentType = 1 Then 
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_AdjRev)
  Else
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Outstanding & "|" & c_AdjRev)
  End If
  
  Revaluation = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    
  'Լրացնե "Ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", Date)
  'Լրացնե "Գումար" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "SUMMA", Sum) 

  Set Rekv = wMDIClient.VBObject("frmASDocForm").WaitVBObject("AS_LABELCOUNT", delay_small)
  If Rekv.Exists Then 
    'Լրացնե "Քանակ" դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "COUNT", Count)
  End IF  
  Call ClickCmdButton(1, "Î³ï³ñ»É")
End Function


'-------------------------------------------------------------------------------------
' Ճշգրտում/վերագնահատում 
'Date - Ամսաթիվ
'Sum - Գումար
'-------------------------------------------------------------------------------------
Function RevaluationDepPledge(Date, Sum, DocGridCount)
		Dim DocGrid
		
  BuiltIn.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_AdjRev)
  
  RevaluationDepPledge = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  
  'Լրացնե "Ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", Date)  
		if DocGridCount = 1 then 
				Set DocGrid = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
		else 
				Set DocGrid = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid_" & DocGridCount)
		end if
  With DocGrid
    .Col= 2 
    .Row = 0
    .Keys(Sum)
  End With
  Call ClickCmdButton(1, "Î³ï³ñ»É")
End Function