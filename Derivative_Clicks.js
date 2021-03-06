Option Explicit

'USEUNIT Library_Common  
'USEUNIT Derivatives_Library
'USEUNIT Constants

'Test Case Id - 160309

Sub Derivative_Clicks_Test()
  Dim CurrSwap, FXSwap, RateSwap, Futures, Forward
  Dim fDATE, sDATE, Count, i, DocType, FolderPath
  Dim arrayWaitForDoc, arrayWaitForView, arrayWaitForModalBrowser, arrayFrmSpr
  Dim attr
      
  ''Համակարգ մուտք գործել ARMSOFT օգտագործողով
  fDATE = "20220101"
  sDATE = "20140101"
  Call Initialize_AsBank("bank", sDATE, fDATE)
  Login("ARMSOFT")
  
'--------------------------------------
  Set attr = Log.CreateNewAttributes
  attr.BackColor = RGB(255, 255, 0)
  attr.Bold = True
  attr.Italic = True
'--------------------------------------  
  Call ChangeWorkspace(c_Subsystems)
  
  ReDim arrayWaitForDoc(9)          'պետք է բացվի Doc
  arrayWaitForDoc = Array(c_ToEdit, c_View,_
                           c_Opers & "|" & c_EntAndRep & "|" & c_Entry,_
                           c_Opers & "|" & c_EntAndRep & "|" & c_Repayment,_
                           c_Opers & "|" & c_Interests & "|" & c_PrcAccruing,_
                           c_Opers & "|" & c_Interests & "|" & c_AccAdjust,_
                           c_Opers & "|" & c_Revaluation,_
                           c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_Percentages)
  ReDim arrayWaitForView(9)          'պետք է բացվի View
  arrayWaitForView = Array(c_DocumentLog, c_Folders & "|" & c_ClFolder,_
                            c_Folders & "|" & c_AgrFolder, c_OpersView,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_Percentages,_
                            c_ViewEdit & "|" & c_Other & "|" & c_CalcDates,_
                            c_AccEntries & "|" & c_ForBal, c_AccEntries & "|" & c_ForOffBal)     
  ReDim arrayFrmSpr(2)        
  arrayFrmSpr = Array(c_References & "|" & c_CommView, c_References & "|" &  c_Statement)                            

  'Արժույթային սվոփի ստեղծում
  Set CurrSwap = New_DerivativeDoc()  
  With CurrSwap
    .Client = "00000006"
    .BuyAcc = "000006000"
    .RepayAcc = "000008601"
    .Date = "200818"
    .ForwardExchg = "400" & "[Tab]" & "1"
    .SaleAmount = 1000000
    .Term = "200819"
    .PurAmount = 1000000
    .PaperCode = 123
  
    Call .CreateDerivative("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ", "²ñÅáõÃ³ÛÇÝ ëíá÷") 
  
    WMDIClient.VBObject("frmPttel").Close
  
    'Պայմանագիրը ուղարկել հաստատման
    .SendToVerify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Վավերացնել պայմանագիրը
    .Verify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")

    FolderPath = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|ä³ÛÙ³Ý³·ñ»ñ"
    Call Log.Message("Արժութային սվոփ",,,attr)
    .OpenInFolder(FolderPath)
  End With
  
  Count = 9
  For i = 0 To Count-1
    Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
  Next
  
  Count = 9
  For i = 0 To Count-1
    Call OnClick(arrayWaitForView(i), "AsView")
  Next 
  
  Count = 2
  For i = 0 To Count-1
    Call OnClick(arrayFrmSpr(i), "FrmSpr")
  Next 
  
  'Պայմանագրի փակում
  Call OnClick(c_AgrClose, "frmAsUstPar")
  
  'Ջնջել պայմանագիրը
  wMainForm.MainMenu.Click(c_AllActions)
  wMainForm.PopupMenu.Click(c_Delete)
  
  Asbank.VBObject("frmDeleteDoc").VBObject("YesButton").ClickButton

  wMDIClient.VBObject("frmPttel").Close
  
  'Փոխարժեքային սվոփի ստեղծում
  Set FXSwap = New_DerivativeDoc()  
  With FXSwap 
    .Client = "00000006"
    .BuyAcc = "000006000"
    .RepayAcc = "000008601"
    .Date = "200818"
    .ForwardExchg = "400" & "[Tab]" & "1"
    .SaleAmount = 1000000
    .Term = "200819"
    .PurAmount = 1000000
    .PaperCode = 123
  
    Call .CreateDerivative("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ", "öáË³ñÅ»ù³ÛÇÝ ëíá÷") 
  
    Asbank.VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close
  
    'Պայմանագիրը ուղարկել հաստատման
    .SendToVerify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Վավերացնել պայմանագիրը
    .Verify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
  
    FolderPath = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|ä³ÛÙ³Ý³·ñ»ñ"
    Call Log.Message("Փոխարժեքային սվոփ",,,attr)
    .OpenInFolder(FolderPath)
  End With
  
  Count = 9
  For i = 0 To Count-2
    If i <> 4 and i <> 5 Then
      Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
    End If  
  Next
  
  Count = 9
  For i = 0 To Count-1
    If i <> 5 and i <> 6 Then
      Call OnClick(arrayWaitForView(i), "AsView")
    End If  
  Next 
  
  Count = 2
  For i = 0 To Count-1
    Call OnClick(arrayFrmSpr(i), "FrmSpr")
  Next 
  
  'Պայմանագրի փակում
  Call OnClick(c_AgrClose, "frmAsUstPar")
  
  'Ջնջել պայմանագիրը
  wMainForm.MainMenu.Click(c_AllActions)
  wMainForm.PopupMenu.Click(c_Delete)
  
  Asbank.VBObject("frmDeleteDoc").VBObject("YesButton").ClickButton

  wMDIClient.VBObject("frmPttel").Close
  
  'Տոկոսադրույքային սվոփի ստեղծում
  Set RateSwap = New_DerivativeDoc()  
  With RateSwap 
    .Client = "00000006"
    .BuyAcc = "000006000"
    .RepayAcc = "000006000"
    .Date = "200818"
    .BaseSum = 1000000
    .FirstDate = "200818"
    .Term = "200819"
    .PaperCode = 123
  
    Call .CreateDerivative("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ", "îáÏáë³¹ñáõÛù³ÛÇÝ ëíá÷") 
  
    WMDIClient.VBObject("frmPttel").Close
  
    'Պայմանագիրը ուղարկել հաստատման
    .SendToVerify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Վավերացնել պայմանագիրը
    .Verify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")

    FolderPath = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|ä³ÛÙ³Ý³·ñ»ñ"
    Call Log.Message("Տոկոսադրույքային սվոփ",,,attr)
    .OpenInFolder(FolderPath)
  End With
  
  Count = 9
  For i = 0 To Count-1
    If i <> 2 and i <> 3 and i <> 6 Then
      Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
    End If  
  Next
  Call OnClick(c_Opers & "|" & c_Repayment & "|" & c_Repayment, "frmASDocForm")
  
  Count = 9
  For i = 0 To Count-1
    Call OnClick(arrayWaitForView(i), "AsView")
  Next 
  Call OnClick(c_ViewEdit & "|" & c_Dates & "|" & c_PerDates, "AsView")
  
  Count = 2
  For i = 0 To Count-1
    Call OnClick(arrayFrmSpr(i), "FrmSpr")
  Next 
  
  'Պայմանագրի փակում
  Call OnClick(c_AgrClose, "frmAsUstPar")
  
  'Ջնջել պայմանագիրը
  wMainForm.MainMenu.Click(c_AllActions)
  wMainForm.PopupMenu.Click(c_Delete)
  
  Asbank.VBObject("frmDeleteDoc").VBObject("YesButton").ClickButton

  wMDIClient.VBObject("frmPttel").Close

 'Ֆյուչերսի ստեղծում
  Set Futures = New_DerivativeDoc()  
  With Futures 
    .Client = "00000006"
    .BuyAcc = "000006000"
    .RepayAcc = "000008601"
    .Date = "200818"
    .ForwardExchg = "400" & "[Tab]" & "1"
    .Term = "200819"
    .PurAmount = 1000000
    .PaperCode = 123
  
    Call .CreateDerivative("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ", "üÛáõã»ñë") 
  
    Asbank.VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close
  
    'Պայմանագիրը ուղարկել հաստատման
    .SendToVerify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Վավերացնել պայմանագիրը
    .Verify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")

    FolderPath = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|ä³ÛÙ³Ý³·ñ»ñ"
    Call Log.Message("Ֆյուչերս",,,attr)
    .OpenInFolder(FolderPath)
  End With
  
  Count = 9
  For i = 0 To Count-1
    If i <> 2 and i <> 4 and i <> 5 and i <> 8 Then
      Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
    End If  
  Next
  
  Count = 9
  For i = 0 To Count-1
    If i <> 5 and i <> 6 Then
      Call OnClick(arrayWaitForView(i), "AsView")
    End If  
  Next 
  
  Count = 2
  For i = 0 To Count-1
    Call OnClick(arrayFrmSpr(i), "FrmSpr")
  Next 
  
  'Պայմանագրի փակում
  Call OnClick(c_AgrClose, "frmAsUstPar")
  
  'Ջնջել պայմանագիրը
  wMainForm.MainMenu.Click(c_AllActions)
  wMainForm.PopupMenu.Click(c_Delete)
  
  Asbank.VBObject("frmDeleteDoc").VBObject("YesButton").ClickButton

  wMDIClient.VBObject("frmPttel").Close

  'Ֆորվարդի ստեղծում
  Set Forward = New_DerivativeDoc()  
  With Forward 
    .Client = "00000006"
    .BuyAcc = "000006000"
    .RepayAcc = "000008601"
    .Date = "200818"
    .ForwardExchg = "400" & "[Tab]" & "1"
    .Term = "200819"
    .PurAmount = 1000000
    .PaperCode = 123
  
    Call .CreateDerivative("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ", "üáñí³ñ¹") 
  
    Asbank.VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close
  
    'Պայմանագիրը ուղարկել հաստատման
    .SendToVerify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Վավերացնել պայմանագիրը
    .Verify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")

    FolderPath = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|²Í³ÝóÛ³É ·áñÍÇùÝ»ñ|ä³ÛÙ³Ý³·ñ»ñ"
    Call Log.Message("Ֆորվարդ",,,attr)
    .OpenInFolder(FolderPath)
  End With
  
  Count = 9
  For i = 0 To Count-1
    If i <> 2 and i <> 4 and i <> 5 and i <> 8 Then
      Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
    End If  
  Next
  
  Count = 9
  For i = 0 To Count-1
    If i <> 5 and i <> 6 Then
      Call OnClick(arrayWaitForView(i), "AsView")
    End If  
  Next 
  
  Count = 2
  For i = 0 To Count-1
    Call OnClick(arrayFrmSpr(i), "FrmSpr")
  Next 
  
  'Պայմանագրի փակում
  Call OnClick(c_AgrClose, "frmAsUstPar")
  
  'Ջնջել պայմանագիրը
  wMainForm.MainMenu.Click(c_AllActions)
  wMainForm.PopupMenu.Click(c_Delete)
  
  Asbank.VBObject("frmDeleteDoc").VBObject("YesButton").ClickButton

  wMDIClient.VBObject("frmPttel").Close

  Call Close_AsBank()
End Sub  