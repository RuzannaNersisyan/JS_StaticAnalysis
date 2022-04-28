Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Library_Contracts
'USEUNIT Library_Colour

'-----------------------------------------------------------------------------------------
'Øáõïù ¿ ·áñÍáõÙ ²ß³ï³İù³ÛÇİ ÷³ëï³ÃÕÃ»ñ ÃÕÃ³å³İ³Ï Ğ³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ ²Şî-Çó
'-----------------------------------------------------------------------------------------
'startDate - ²ßË³ï³İù³ÛÇİ ÷³ëï³ÃÕÃ»ñ ıÇÉñïñÇ ëÏ½µ³İ³Ï³İ ³Ùë³ÃÇí
'endDate - ²ßË³ï³İù³ÛÇİ ÷³ëï³ÃÕÃ»ñ ıÇÉñïñÇ í»ñçµ³Ï³İ ³Ùë³ÃÇí
Sub Online_PaySys_Go_To_Agr_WorkPapers(workSpace, startDate, endDate)
  BuiltIn.Delay(3000)
  Call wTreeView.DblClickItem(workSpace)
  if p1.WaitVBObject("frmAsUstPar", 1000).Exists then
    Call Rekvizit_Fill("Dialog", 1, "General", "PERN", startDate)
    Call Rekvizit_Fill("Dialog", 1, "General", "PERK", endDate)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  else 
    Log.Error "Can't open frmAsUstPar window", "", pmNormal, ErrorColor
  end if
End Sub

'-----------------------------------------------------------------------------------------
'Ğ³ßí³éí³Í í×³ñ³ÛÇİ ÷³ëï³ÃÕÃ»ñÃõÙ ÷³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³İ ëïáõ·áõÙ
'-----------------------------------------------------------------------------------------
'docNum - ö³ëï³ÃÕÃÇ N
'startDate - üÇÉïñáõÙ Éñ³óíáÕ ³Ùë³ÃÇí(êÏÇ½µ)
'endDate - üÇÉïñáõÙ Éñ³óíáÕ ³Ùë³ÃÇí(ì»ñç)
Function Online_PaySys_Check_Doc_In_Registered_Payment_Documents(docNum, startDate, endDate)
    Dim exists, my_vbobj,Count
    Dim wMainForm,wTreeView
    
    Set wMainForm = Sys.Process("Asbank").VBObject("MainForm") 
    Set wMDIClient = wMainForm.Window("MDIClient", "", 1) 
    Set wTreeView = wMDIClient.VBObject("frmExplorer").VBObject("tvTreeView")
    Call wTreeView.DblClickItem("|Ğ³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Ğ³ßí³éí³Í í×³ñ³ÛÇİ ÷³ëï³ÃÕÃ»ñ")
    Sys.Process("Asbank").vbObject("frmAsUstPar").vbObject("TabFrame").vbObject("TDBDate").Keys(startDate & "[Tab]")
    Sys.Process("Asbank").vbObject("frmAsUstPar").vbObject("TabFrame").vbObject("TDBDate_2").Keys(endDate & "[Tab]")
    Sys.Process("Asbank").vbObject("frmAsUstPar").vbObject("TabFrame").vbObject("ASTypeTree").vbObject("TDBMask").Keys("[End]" & "[BS]" & "[BS]" & "[Tab]")
    Sys.Process("Asbank").vbObject("frmAsUstPar").vbObject("CmdOK").Click()
    Count = 0
    exists = False 
    BuiltIn.Delay(5000)
    Set my_vbobj = wMDIClient.WaitVBObject("frmPttel", delay_middle)
    If my_vbobj.Exists Then
        Do Until Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").vbObject("tdbgView").ApproxCount < Count  Or exists = True
            If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(2).text) = docNum Then
                exists = True
            Else
            Count = Count + 1 
                Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
            End If
        Loop
    Else
        Log.Error("Rgistered payment view doesn't exists")
    End If
    
    Online_PaySys_Check_Doc_In_Registered_Payment_Documents = exists
End Function

'-----------------------------------------------------------------------------------------
'ö³ëï³ÃÕÃÇ áõ³ñÏáõÙ Ñ³ëï³ïÙ³İ(¸ñ³Ù³ñÏÕ Ï³Ù Ğ³ëï³ïáÕ 1 ²Şî Ï³Ù ê¨ óáõó³Ï)
'-----------------------------------------------------------------------------------------
'sendTo - 1³ñÅ»ùÇ ¹»åùáõÙ ÷³ëï³ÃáõÕÃÁ áõÕ³ñÏíáõÙ ¿ Ñ³ëï³ïÙ³İ ¸ñ³Ù³ñÏÕ(ì×³ñÙ³İ Ñ³İÓİ³ñ³ñ³·Çñ (Online ¾ìĞ áõÕ.)), 2 - Ç ¹»åùáõÙ` Ğ³ëï³ïíáÕ 1²Şî(ì×³ñÙ³İ Ñ³İÓİ³ñ³ñ³·Çñ (Online ¾ìĞ ëï.)),3 -Ç ¹»åùáõÙ ê¨ óáõó³Ï
Sub Online_PaySys_Send_To_Verify(sendTo)
  BuiltIn.Delay(3000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Select Case sendTo
    Case 1
      Call wMainForm.PopupMenu.Click(c_SendToCash)
      Call ClickCmdButton(2, "Î³ï³ñ»É")
    Case 2
      Call wMainForm.PopupMenu.Click(c_SendToVer)
      Call ClickCmdButton(2, "Î³ï³ñ»É")
    Case 3
      Call wMainForm.PopupMenu.Click(c_SendtoVerBL)
      Call ClickCmdButton(5, "²Ûá")
  End Select
  if p1.WaitVBObject("frmAsMsgBox", 8000).Exists Then
    Call ClickCmdButton(5, "OK")
  End if
  BuiltIn.Delay(1000)
  wMDIClient.vbObject("frmPttel").Close()
End Sub

'------------------------------------------------------------------------------
'ö³ëï³ÃÕÃÇ Ñ»é³óáõÙ Ğ³í³éí³Í í×³ñ³ÛÇİ ÷³ëï³ÃÕÃ»ñ ÃÕÃ³å³İ³ÏÇó
'-------------------------------------------------------------------------------
Sub Online_PaySys_Delete_Agr()
  BuiltIn.Delay(3000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Delete)
  If p1.WaitVBObject("frmDeleteDoc", 3000).Exists Then 
    Call ClickCmdButton(3, "²Ûá")
  Else 
    Log.Error "Can't find frmDeleteDoc window", "", pmNormal, ErrorColor
  End If
End Sub

'------------------------------------------------------------------------------
'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³İ ëïáõ·áõÙ ê¨ óáõó³ÏáõÙ
'-------------------------------------------------------------------------------
Function Online_PaySys_Check_Doc_In_Black_List(docNum)
    Dim exists : exists = False

    Call wTreeView.DblClickItem("|§ê¨ óáõó³Ï¦ Ñ³ëï³ïáÕÇ ²Şî|Ğ³ëï³ïíáÕ í×³ñ³ÛÇİ ÷³ëï³ÃÕÃ»ñ")
    If wMDIClient.WaitVBObject("frmPttel", 2000).Exists Then
        Do Until wMDIClient.vbObject("frmPttel").vbObject("tdbgView").EOF Or exists = True
            If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(1).text) = docNum Then
                exists = True
                Online_PaySys_Check_Doc_In_Black_List = exists
            Else
                Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
            End If
        Loop
    Else
        Online_PaySys_Check_Doc_In_Black_List = exists
        Log.Error("Workpapers folder view doesn't exists")
    End If
End Function

'------------------------------------------------------------------------------------------------------
'ê¨ óáõó³ÏáõÙ ·ïİíáÕ ÷³ëï³ÃÕÃÇ Ñ³Ù³ñ ¸Çï»É §ê¨ óáõó³ÏáõÙ¦ Ñ³ÙÁİÏáõÙİ»ñÁ Ù³İñ³Ù³ëİ ïáÕ»ñÇ ù³İ³ÏÇ ëïáõ·áõÙ
'----------------------------------------------------------------------------------------------------
Function Online_PaySys_Check_Assertion_In_Black_List()
    Dim rcount : rcount = False  
    
    BuiltIn.Delay(3000)             
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click("????? «?? ?????????» ?????????????? ?????????")
    BuiltIn.Delay(1000)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    rcount = wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").VisibleRows
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel_2").Close()
    
    Online_PaySys_Check_Assertion_In_Black_List = rcount
End Function

'---------------------------------------------------------------------
' ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³İ ëïáõ·áõÙ ²ßË³ï³İù³ÛÇİ ÷³ëï³ÃÕÃ»ñáõÙ
'----------------------------------------------------------------------
'docNum - ö³ëï³ÃÕÃÇ
'startDate - üÇÉïñáõÙ Éñ³óíáÕ ³Ùë³ÃÇí(êÏÇ½µ)
'endDate - üÇÉïñáõÙ Éñ³óíáÕ ³Ùë³ÃÇí(ì»ñç)
Function Online_PaySys_Check_Doc_In_Workpapers(docNum, startDate, endDate)
  Dim is_exists : is_exists = false
  Dim colN
  
  BuiltIn.Delay(3000)
  Call wTreeView.DblClickItem("|Ğ³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³İù³ÛÇİ ÷³ëï³ÃÕÃ»ñ")
  If p1.WaitVBObject("frmAsUstPar", 6000).Exists Then
    Call Rekvizit_Fill("Dialog", 1, "General", "PERN", startDate)
    Call Rekvizit_Fill("Dialog", 1, "General", "PERK", endDate)
    Call Rekvizit_Fill("Dialog", 1, "General", "USER", "^A" & "[Del]")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  Else 
    Log.Error "Can't find frmAsUstPar window", "", pmNormal, ErrorColor
  End If

  If wMDIClient.WaitVBObject("frmPttel", 6000).Exists Then
    colN = wMDIClient.vbObject("frmPttel").GetColumnIndex("DOCNUM")
    BuiltIn.Delay(3000)
    If SearchInPttel("frmPttel", colN, docNum) Then
      is_exists = true
    End If
  Else
    Log.Message "The sending documnet frmPttel doesn't exist", "", pmNormal, ErrorColor
  End If
  
  Online_PaySys_Check_Doc_In_Workpapers = is_exists
End Function

'----------------------------------------------------------------------
' ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³İ ëïáõ·áõÙ 1-Çİ Ğ³ëï³ïáÕÇ Ùáï
'----------------------------------------------------------------------
'docNum - ö³ëï³ÃÕÃÇ
'startDate - üÇÉïñáõÙ Éñ³óíáÕ ³Ùë³ÃÇí(êÏÇ½µ)
'endDate - üÇÉïñáõÙ Éñ³óíáÕ ³Ùë³ÃÇí(ì»ñç)
Function Online_PaySys_Check_Doc_In_Verifier(docNum, startDate, endDate)  
  Dim exists, verifyDocuments, colN
  exists = False
  
  BuiltIn.Delay(1000)
  Set verifyDocuments = New_VerificationDocument()
  verifyDocuments.User = "^A[Del]"
  Call GoToVerificationDocument("|Ğ³ëï³ïáÕ I ²Şî|Ğ³ëï³ïíáÕ í×³ñ³ÛÇİ ÷³ëï³ÃÕÃ»ñ",verifyDocuments)
  BuiltIn.Delay(3000)
  If wMDIClient.WaitVBObject("frmPttel", delay_middle).Exists Then
    colN = wMDIClient.vbObject("frmPttel").GetColumnIndex("DOCNUM")
    BuiltIn.Delay(2000)
    If SearchInPttel("frmPttel", colN, docNum) Then
      exists = True
    End If
  Else
    Log.Error "Verifiers folder view doesn't exists", "", pmNormal, ErrorColor
  End If
  
  Online_PaySys_Check_Doc_In_Verifier = exists
End Function

'---------------------------------------------------------------------------------------------------------
' ì×³ñÙ³İ Ñ³İÓİ³ñ³ñ³·Çñ (Online ¾íÑ. ëï.) ÷³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³İ ëïáõ·áõÙ  ú·ï³·áñÍáÕÇ ë¨³·ñ»ñ ÃÕÃ³å³İ³ÏáõÙ
'---------------------------------------------------------------------------------------------------------
Function Online_PaySys_Check_Doc_In_Drafts(doc_isn)
  Dim exists : exists = False
  Dim colN
 
  'ê¨³·ñ»ñ ÃÕÃ³å³İ³ÏÇó ÷³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ ³ßË³ï³İù³ÛÇİ ÷³ëï³ÃÕÃ»ñ ÃÕÃ³å³İ³Ï
  Call wTreeView.DblClickItem("|Ğ³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |ÂÕÃ³å³İ³Ïİ»ñ|ú·ï³·áñÍáÕÇ ë¨³·ñ»ñ")
  If p1.WaitVBObject("frmAsUstPar", 2000).Exists Then 
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  Else 
    Log.Error "Can't find frmAsUstPar window", "", pmNormal, ErrorColor
  End If
    
  If wMDIClient.WaitVBObject("frmPttel", 3000).Exists Then
    colN = wMDIClient.vbObject("frmPttel").GetColumnIndex("FISN")
    If SearchInPttel("frmPttel", colN, doc_isn) Then
        exists = true
    End If
  Else
    Log.Message "The sending documnet frmPttel doesn't exist", "", pmNormal, ErrorColor
  End If
    
  Online_PaySys_Check_Doc_In_Drafts = exists
End Function