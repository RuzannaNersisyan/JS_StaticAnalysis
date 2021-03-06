option Explicit
 
'USEUNIT Library_Common  
'USEUNIT Library_CheckDB
'USEUNIT Constants
'USEUNIT Mortgage_Library

'--------------------------------------------------------------
'Date - Հաշվարկման ամսաթիվ
'Date - Ձևակերպման ամսաթիվ
'ArrCheckbox - Նշիչների զանգված
'--------------------------------------------------------------
Sub Group_Calculation(Date, ArrCheckbox())
  Dim mesBox, ifExist, errMes, i
  ifExist = 0
  'Նշել բոլոր պայմանագրերը:
  BuiltIn.delay(3000)
  Call wMainForm.MainMenu.Click(c_Editor & "|" & c_MarkAll)
  'Կատարել "Գործողություններ/Բոլոր գործողությունները.../Խմբային հաշվարկ" գործողությունը:
  BuiltIn.delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)  
  Call wMainForm.PopupMenu.Click(c_GroupCalc)
  BuiltIn.delay(2000)
  'Լրանել "Հաշվարկման ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Dialog", 1, "General", "CLOSEDATE", Date)
  'Լրանել "Ձևակերպման ամսաթիվ" դաշտը
  Call Rekvizit_Fill("Dialog", 1, "General", "SETDATE", Date)
  'Դնել համապատասխան նշիչը նշիչները
  For i = 0 To UBound(ArrCheckbox)
    Call Rekvizit_Fill("Dialog", 1, "CheckBox", ArrCheckbox(i), 1) 
  Next   
  'Սեղմել "Կատարել" կոճակը:
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  
  While(ifExist = 0)
    Set mesBox = AsBank.WaitVBObject("frmAsMsgBox", 5000)
    If mesBox.Exists Then   
      p1.VBObject("frmAsMsgBox").VBObject("cmdButton").ClickButton
      ifExist = 1      
    End if  
  Wend
End Sub

'--------------------------------------------------------------
'calcDate - Հաշվարկման ամսաթիվ
'Date - Ձևակերպման ամսաթիվ
'--------------------------------------------------------------
Sub Group_Payment(calcDate, Date)
  Dim mesBox, ifExist
  ifExist = 0
  'Նշել բոլոր պայմանագրերը:
		BuiltIn.delay(3000)
  Call wMainForm.MainMenu.Click(c_Editor & "|" & c_MarkAll)
  'Կատարել "Գործողություններ/Բոլոր գործողությունները.../Խմբային մարում" գործողությունը:
  BuiltIn.delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)  
  Call wMainForm.PopupMenu.Click(c_GroupDebt)
  BuiltIn.delay(2000)
  'Լրացնել "Հաշվարկման ամսաթիվ" դաշտը calcDate արժեքով
  p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("TDBDate").Keys(calcDate & "[Tab]")
  'Լրացնել "Ձևակերպման ամսաթիվ" դաշտը Date արժեքով
  p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("TDBDate_2").Keys(Date & "[Tab]")
  'Սեղմել "Կատարել" կոճակը: 
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  
  While(ifExist = 0)
   Set mesBox = AsBank.WaitVBObject("frmAsMsgBox", 5000)
   If mesBox.Exists Then
      p1.VBObject("frmAsMsgBox").VBObject("cmdButton").ClickButton
      ifExist = 1
   end if  
  Wend  

End Sub

'-------------------------------------------------------------------------------
' Խմբային ջնջում "Գործողությունների դիտումից"
'Workspace - ԱՇՏ
'DocType - Պայմանագրի մակարդակ
'DocNum - Պայմանագրի համար
'Date - Ամսաթիվ
'Action - Գործողության տեսակ
'-------------------------------------------------------------------------------
Sub GroupDelete(Workspace, DocType, DocNum, FirstDate, LastDate, Action)
  Dim frmAsMsgBox, FrmSpr
  Call wTreeView.DblClickItem(Workspace & "ä³ÛÙ³Ý³·ñ»ñ")
  Call Rekvizit_Fill("Dialog", 1, "General", "LEVEL", DocType) 
  Call Rekvizit_Fill("Dialog", 1, "General", "NUM", "^A[Del]" & DocNum) 
	Call ClickCmdButton(2, "Î³ï³ñ»É")
  BuiltIn.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_OpersView)
  
  Call Rekvizit_Fill("Dialog", 1, "General", "START", FirstDate & "[Tab]")
  Call Rekvizit_Fill("Dialog", 1, "General", "END", LastDate & "[Tab]")
  Call Rekvizit_Fill("Dialog", 1, "General", "DEALTYPE", "^A[Del]" & Action &"[Tab]")
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  
  If wMDIClient.WaitVBObject("frmPttel_2",4000).Exists Then
    
      wMDIClient.VBObject("frmPttel_2").Refresh
      BuiltIn.Delay(delay_small)
      If wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").ApproxCount <> 0 Then
        wMainForm.SetFocus()
        Call wMainForm.MainMenu.Click(c_Editor & "|" & c_MarkAll)
         BuiltIn.delay(2000)
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_GroupDel)
        Call ClickCmdButton(5, "²Ûá")  
        Call ClickCmdButton(3, "²Ûá")
    
        Set frmAsMsgBox = Asbank.WaitVbObject("frmAsMsgBox", 2000)
        While frmAsMsgBox.Exists  
          Call ClickCmdButton(5, "Î³ï³ñ»É") 
          Set frmAsMsgBox = Asbank.WaitVbObject("frmAsMsgBox", 2000)
        Wend
        BuiltIn.Delay(delay_big)
        Set FrmSpr = wMDIClient.WaitVbObject("FrmSpr", 2000)
        If FrmSpr.Exists Then 
          FrmSpr.Close
        End If
      Else
        Log.Message("Գործողությունների դիտում թղթապանակը դատարկ է:")  
      End If
  End If
  BuiltIn.Delay(4000)  
  Call Close_Pttel("frmPttel_2")
  BuiltIn.Delay(2000)  
  Call Close_Pttel("frmPttel")
End Sub

Sub docDelete(Workspace, DocType, DocNum)
  Call wTreeView.DblClickItem("|" & Workspace & "|ä³ÛÙ³Ý³·ñ»ñ")
	p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("ASTypeTree").VBObject("TDBMask").Keys(DocType & "[Tab]")
  p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("AsTpComment").VBObject("TDBComment").Keys(DocNum & "[Tab]")
	Call ClickCmdButton(2, "Î³ï³ñ»É")
  
  If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 0 Then
    Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
    p1.VBObject("frmDeleteDoc").VBObject("YesButton").ClickButton
  End If  
  Call Close_Pttel("frmPttel")
End Sub

'_______________________________________________________________________________
' Օվերդրաֆտի խմբային գործողություն "Օվերդրաֆտ ունեցող հաշիվներից":
' Կատարվում է փոխանցված հաշիվներով օվերդրաֆտների համար 
' arrayCalcAcc() - Հաշիվների զանգված
' Count -  Հաշիվների քանակ
' opDate - Տրամադրման ամսաթիվ
' Operation - Գործողություն
'_______________________________________________________________________________
Function OverdraftGroupOperation(arrayCalcAcc(), Count, opDate, Operation)
	Dim i, OrAnd
  Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|úí»ñ¹ñ³ýï áõÝ»óáÕ Ñ³ßÇíÝ»ñ")
	Call ClickCmdButton(2, "Î³ï³ñ»É")
  
  BuiltIn.delay(3000)
  Call wMainForm.MainMenu.Click(c_Editor & "|" & c_Mark)
  With p1.VBObject("frmPttelFindNew")
    .VBObject("FilterControl").VBObject("TDBGridFilter").Col = 1
    .VBObject("FilterControl").VBObject("TDBGridFilter").Row = 0
    .VBObject("FilterControl").VBObject("TDBGridFilter").Keys("" & "[Tab]")
    .VBObject("CommandOk").ClickButton    
    For i = 0 To Count- 1
      BuiltIn.delay(2000)
      Call wMainForm.MainMenu.Click(c_Editor & "|" & c_Mark)
      .VBObject("FilterControl").VBObject("TDBGridFilter").Col = 4
      .VBObject("FilterControl").VBObject("TDBGridFilter").Row = 0
      .VBObject("FilterControl").VBObject("TDBGridFilter").Keys(arrayCalcAcc(i) & "[Tab]")
      .VBObject("CommandOk").ClickButton
    Next
  End With
   BuiltIn.delay(2000)
  Select Case Operation
  Case "Give"
  	Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_GroupGive)
  Case "Repayment"
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_GroupDebt)
  End Select 
  
  Call Rekvizit_Fill("Dialog", 1, "General", "START", opDate)
  Call Rekvizit_Fill("Dialog", 1, "General", "END", opDate)
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  Call ClickCmdButton(5, "²Ûá")
  
  BuiltIn.Delay(3000)
  Call Close_Pttel("frmPttel")
  
  ''Վերցնել Խմբային գործողության ISN-ը
  Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|úí»ñ¹ñ³ýï áõÝ»óáÕ Ñ³ßÇíÝ»ñ")
  Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", arrayCalcAcc(0))
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  
   BuiltIn.delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_OpersView)
  
  Call Rekvizit_Fill("Dialog", 1, "General", "START", opDate)
  Call Rekvizit_Fill("Dialog", 1, "General", "END", opDate)
  Call ClickCmdButton(2, "Î³ï³ñ»É")
    
  Call SearchInPttel("frmPttel_2",5, "úí»ñ¹ñ³ýïÇ Ù³ñáõÙ")
  
  wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").ClickR
  Call wMainForm.PopupMenu.Click(c_View)
  OverdraftGroupOperation = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  BuiltIn.Delay(3000)
  wMDIClient.VBObject("frmASDocForm").Close
  Call Close_Pttel("frmPttel_2")
  Call Close_Pttel("frmPttel")  
End Function

'_______________________________________________________________________________
' Օվերդրաֆտի խմբային հաշվարկ "Պայմանագրեր" թղթապանակից:
' Տրամադրումը կատարվում է փոխանցված հաշիվներով օվերդրաֆտների համար 
' arrayDocNum() - Հաշիվների զանգված
' Count -  Պայմանագրերի քանակ
' DocType - Պայմանագրի մակարդակ
' CalcDate - Հաշվարկման ամսաթիվ
' FormDate - Ձևակերպման ամսաթիվ
'_______________________________________________________________________________
Function OverdraftGroupCalculation(arrayDocNum(), Count, DocType, CalcDate, FormDate)
  Dim i
  Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
	p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("ASTypeTree").VBObject("TDBMask").Keys(DocType & "[Tab]")
	p1.VBObject("frmAsUstPar").VBObject("CmdOK").Click()
	BuiltIn.delay(2000)
  
  Call wMainForm.MainMenu.Click(c_Editor & "|" & c_Mark)
  With p1.VBObject("frmPttelFindNew")
    .VBObject("FilterControl").VBObject("TDBGridFilter").Col = 1
    .VBObject("FilterControl").VBObject("TDBGridFilter").Row = 0
    .VBObject("FilterControl").VBObject("TDBGridFilter").Keys("" & "[Tab]")
    .VBObject("CommandOk").ClickButton
    For i = 0 To Count - 1
      Call wMainForm.MainMenu.Click(c_Editor & "|" & c_Mark)
      .VBObject("FilterControl").VBObject("TDBGridFilter").Col = 4
      .VBObject("FilterControl").VBObject("TDBGridFilter").Row = 0
      .VBObject("FilterControl").VBObject("TDBGridFilter").Keys(arrayDocNum(i) & "[Tab]")
      .VBObject("CommandOk").ClickButton
    Next
  End With
  
   BuiltIn.delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_GroupCalc)
  
  p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("TDBDate").Keys(CalcDate & "[Tab]")
  p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("TDBDate_2").Keys(CalcDate & "[Tab]")
  p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("Checkbox").Value = 1
  
  p1.VBObject("frmAsUstPar").VBObject("CmdOK").ClickButton
  p1.VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Keys("^[F4]")

  ''Վերցնել Խմբային հաշվարկի ISN-ը
  Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
	p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("ASTypeTree").VBObject("TDBMask").Keys(DocType & "[Tab]")
  p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("AsTpComment").VBObject("TDBComment").Keys(arrayDocNum(0) & "[Tab]")
	p1.VBObject("frmAsUstPar").VBObject("CmdOK").Click()
  
  BuiltIn.delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_OpersView)
  
  p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("TDBDate").Keys(CalcDate & "[Tab]")
  p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("TDBDate_2").Keys(CalcDate & "[Tab]")
  p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("ASTypeTree").VBObject("TDBMask").Keys("^A[Del]" & "[Tab]")
  p1.VBObject("frmAsUstPar").VBObject("CmdOK").ClickButton
  
  BuiltIn.delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_View)
  OverdraftGroupCalculation = p1.VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").DocFormCommon.Doc.isn
  p1.VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").Close
  Call Close_Pttel("frmPttel_2")
  Call Close_Pttel("frmPttel")
End Function 
