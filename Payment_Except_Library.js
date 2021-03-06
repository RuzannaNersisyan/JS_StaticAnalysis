Option Explicit
'USEUNIT Library_Common
'USEUNIT Online_PaySys_Library
'USEUNIT Constants

'------------------------------------------------------------------------------
' ä³ÛÙ³Ý³·ñÇ ù³Õí³ÍùÇ ¹ÇïáõÙ : üáõÝÏóÇ³Ý Éñ³óÝáõÙ ¿ å³ÛÙ³Ý·ñÇ ù³Õí³Íù ýÇÉïñÁ :
'ì»ñ³¹ñÓÝáõÙ ¿ True , »Ã» ù³Õí³ÍùÁ ³éÏ³ ¿ , ¨ False` Ñ³Ï³é³Ï ¹»åùáõÙ :
'------------------------------------------------------------------------------
'startDate - Ä³Ù³Ý³Ï³Ñ³ïí³ÍÇ ëÏÇ½µ ¹³ßïÇ ³ñÅ»ù
'endDate - Ä³Ù³Ý³Ï³Ñ³ïí³ÍÇ í»ñç ¹³ßïÇ ³ñÅ»ù
Function View_Statment(startDate, endDate, msgExists, template)
    Dim isExist : isExist = False
    
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click("Տեղեկանքներ|Քաղվածք")
    BuiltIn.Delay(1000)
    
    'Ä³Ù³Ý³Ï³Ñ³ïí³ÍÇ ëÏÇ½µ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Dialog", 1, "General", "FRSTDATE", startDate)
    'Ä³Ù³Ý³Ï³Ñ³ïí³ÍÇ í»ñç ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Dialog", 1, "General", "LASTDATE", endDate)
    'òáõÛó ï³É ·áñÍáÕáõÃÛáõÝÝ»ñÁ ËÙµ³íáñí³Í ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWGROUPOPER", 1)
    'òáõÛó ï³É å³ÛÙ³ÝÝ»ñÇ ÷á÷áËáõÃÛáõÝÝ»ñÁ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWINNERRATINGS", 1)
    'Èñ³óÝáõÙ ¿ ø³Õí³ÍùÇ Ó¨³ÝÙáõß ¹³ßïÁ
    Call Rekvizit_Fill("Dialog", 1, "General", "AGRTMP", template)
    'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    'ø³Õí³ÍùÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
    If msgExists Then
        If wMDIClient.WaitVBObject("FrmSpr", 2000).Exists Then
            isExist = True
        End If
        View_Statment = isExist
    Else   
        View_Statment = True
    End If   
End Function

'--------------------------------------------------------------------------------------
'ä³ÛÙ³Ý³·ñ»ñ ÃÕÃ³å³Ý³ÏáõÙ ÷³ëï³ïÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ : üáõÝÏóÇ³Ý í»ñ³¹³ñÓÝáõÙ ¿
'True , »Ã» å³ÛÙ³Ý³·ÇñÁ ³éÏ³ ¿ ¨ false, »Ã» ³ÛÝ µ³ó³Ï³ÛáõÙ ¿ :
'--------------------------------------------------------------------------------------
'docType - ä³ÛÙ³Ý³·ñÇ Ù³Ï³ñ¹³Ï ¹³ßïÇ ³ñÅ»ù
'docNum - ä³ÛÙ³Ý³·ñÇ N ¹³ßïÇ ³ñÅ»ù
'cpath - ÂÕÃ³å³Ý³ÏÇ ×³Ý³åáñÑ
Function Contracts_Filter_Fill(docType, docNum, cpath)
  Dim isExists : isExists = True
    
  Call wTreeView.DblClickItem(cpath)
  If p1.WaitVBObject("frmAsUstPar", 3000).Exists Then
    Call Rekvizit_Fill("Dialog", 1, "General", "LEVEL", docType)
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", "!" & "[End][Del]" & docNum)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  Else 
    Log.Error "Can't open frmAsUstPar window", "", pmNormal, ErrorColor
  End If
  If wMDIClient.vbObject("frmPttel").vbObject("tdbgView").VisibleRows = 0 Then
    Log.Message("There are no document with specified ID")
    isExists = False
  End If
    
  Contracts_Filter_Fill = isExists
End Function

'êï³ÝáõÙ ¿ ÃÕÃ³å³Ý³ÏáõÙ ý³ÛÉ»ñÇ ³ÝáõÝ»ñÁ
Function ListFiles(path)
  Dim fso, folder, f

  Set fso = CreateObject("Scripting.FileSystemObject")
  BuiltIn.Delay(1000)
  Set folder = fso.GetFolder(path)
  BuiltIn.Delay(3000)
  For Each f In folder.Files
  BuiltIn.Delay(3000)
    Log.Message(f.Name)
    ListFiles = f.Name
  Next
End Function

'------------------------------------------------------------------------------
'Պլաստիկ քարտի առկայության ստուգում "Պլաստիկ քարտեր"  թղթապանակում: ֆունկցիան վերադարձնում է
'true, եթե տվյալ համարով քարտը առկա է , և false` եթե բացակայում է :
'-------------------------------------------------------------------------------------------
'cardNumber - Այն պլաստիկ քարտի համարը, որի նկատմամբ կատարվում է գործողությունը
Function Check_CardExist_In_Carsds_Folder(cardNumber)
    Dim exists : exists = False
    
    BuiltIn.Delay(3000)
    Call wTreeView.DblClickItem("|äÉ³ëïÇÏ ù³ñï»ñÇ ²Þî (SV)|äÉ³ëïÇÏ ù³ñï»ñ")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    If wMDIClient.VBObject("frmPttel").Exists Then
         Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveFirst
         BuiltIn.Delay(2000)
        Do Until wMDIClient.vbObject("frmPttel").vbObject("tdbgView").EOF 
            If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(3).Text) = Trim(cardNumber) Then
                BuiltIn.Delay(1000)
                exists = True
                Exit Do 
             Else
                Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
            End If
        Loop  
     Else
        Log.Error("Cards workpaper doesn't exist")
    End If
    
    Check_CardExist_In_Carsds_Folder = exists
End Function