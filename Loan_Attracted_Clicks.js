Option Explicit

'USEUNIT Library_Common  
'USEUNIT Akreditiv_Library
'USEUNIT Loan_Agreements_Library 
'USEUNIT Constants

'Test Case Id - 160450

Sub Loan_Attracted_Clicks_Test
  Dim fDATE, sDATE, Count, i, DocNum, DocLevel, FolderName
  Dim arrayWaitForDoc, arrayWaitForView, arrayFrmSpr, arrayWaitForModalBrowser
  Dim CreditLine, CmplxLoan, LoanWScheldule
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
  
  ReDim arrayWaitForDoc(16)          'պետք է բացվի Doc
  arrayWaitForDoc = Array(c_View, c_ToEdit,_
                           c_Safety & "|" & c_AgrBindNew & "|" & c_AgrBind,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_LoanAttraction,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_GetCharge,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_PayOffDebt,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_ReturnPrepaidInt,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_FadeLoanFromPercent,_
                           c_Opers & "|" & c_Interests & "|" & c_PrcAccruing,_
                           c_Opers & "|" & c_Interests & "|" & c_AccAdjust,_
                           c_TermsStates & "|" & c_Dates & "|" & c_OtherPaySchedule,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_Percentages,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_EffRate,_
                           c_TermsStates & "|" & c_Other & "|" & c_TaxRate)
                           
  ReDim arrayWaitForView(14)          'պետք է բացվի View
  arrayWaitForView = Array(c_DocumentLog, c_Folders & "|" & c_ClFolder,_
                            c_Folders & "|" & c_AgrFolder,_
                            c_Safety & "|" & c_AgrBindNew & "|" & c_LinksOfAgreement, c_OpersView,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_PerDates,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_Percentages,_ 
                            c_ViewEdit & "|" & c_Percentages & "|" & c_EffRate,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_BankEffRate,_
                            c_ViewEdit & "|" & c_Other & "|" & c_AccAdjust,_
                            c_ViewEdit & "|" & c_Other & "|" & c_TaxRates,_
                            c_ViewEdit & "|" & c_Other & "|" & c_CalcDates,_
                            c_AccEntries & "|" & c_ForBal)     
  ReDim arrayWaitForModalBrowser(2)   'պետք է բացվի ModalBrowser
  arrayWaitForModalBrowser = Array(c_Safety & "|" & c_AgrOpen & "|" & c_Mortgage,_
                                    c_Safety & "|" & c_AgrBind & "|" & c_Mortgage)
  ReDim arrayFrmSpr(3)        
  arrayFrmSpr = Array(c_References & "|" & c_CommView, c_References & "|" & c_CliRepaySchedule, c_References & "|" &  c_Statement)

  FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|Ü»ñ·ñ³íí³Í í³ñÏ»ñ|"
  
  'Ներգրավված վարկեր/Միանգամյա վարկ
  Call Log.Message("Ներգրավված վարկեր/Միանգամյա վարկ",,,attr)
  DocLevel = 1
  DocNum = "2000000022"
  Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)
  
  Count = 14
  For i = 0 To Count-1
    Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
  Next
  Call OnClick(c_Opers & "|" & c_Interests & "|" & c_PercCapital, "frmASDocForm")  
  Call OnClick(c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms, "frmASDocForm")  
  
  
  Count = 14
  For i = 0 To Count-1
    Call OnClick(arrayWaitForView(i), "AsView")
  Next 
  
  Count = 2
  For i = 0 To Count-1
    Call OnClick(arrayWaitForModalBrowser(i), "frmModalBrowser")
  Next 
  
  Count = 3
  For i = 0 To Count-1
    Call OnClick(arrayFrmSpr(i), "FrmSpr")
  Next 
  
  'Ջնջել   
  Call OnClick(c_Delete, "frmDeleteDoc")
  
  'Պայմանագրի փակում
  Call OnClick(c_AgrClose, "frmAsUstPar")

  wMDIClient.VBObject("frmPttel").Close
  
  
  ''2.Ներգրավված վարկեր/Վարկային գիծ
  Call Log.Message("Ներգրավված վարկեր/Վարկային գիծ",,,attr)
  Set CreditLine = New_LoanDocument()
  With CreditLine
    .CalcAcc = "00000113032"                                    
    .Limit = 100000
    .Date = "090718" 
    .GiveDate = "090718"
    .Term = "090719"
    .FirstDate = "090818"
    .PaperCode = 555
    
    .DocType = "ì³ñÏ³ÛÇÝ ·ÇÍ"
    Call .CreateAttrLoan(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
  
    Log.Message(.DocNum)

    wMDIClient.VBObject("frmPttel").Close
  
    'Պայմանագրին ուղղարկել հաստատման
    .SendToVerify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|Ü»ñ·ñ³íí³Í í³ñÏ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Հաստատել
    .Verify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|Ü»ñ·ñ³íí³Í í³ñÏ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
  
    Call LetterOfCredit_Filter_Fill(FolderName, .DocLevel, .DocNum)
  End With
  
  Count = 14
  For i = 0 To Count-1
    If i <> 16 Then
      Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
    End If  
  Next
  Call OnClick(c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms, "frmASDocForm")  
  
  Count = 14
  For i = 0 To Count-1
    If i <> 9 Then
      Call OnClick(arrayWaitForView(i), "AsView")
    End If  
  Next 
  
  Count = 2
  For i = 0 To Count-1
    Call OnClick(arrayWaitForModalBrowser(i), "frmModalBrowser")
  Next 
  
  Count = 3
  For i = 0 To Count-1
    Call OnClick(arrayFrmSpr(i), "FrmSpr")
  Next 
  
  'Պայմանագրի փակում
  Call OnClick(c_AgrClose, "frmAsUstPar")
  
  'Ջնջել "Վարկային գիծ" պայմանագիրը  
  wMainForm.MainMenu.Click(c_AllActions)
  wMainForm.PopupMenu.Click(c_Delete)
  Asbank.VBObject("frmDeleteDoc").VBObject("YesButton").ClickButton

  wMDIClient.VBObject("frmPttel").Close
  
  ''4.Գրաֆիկով վարկային պայմանագիր
  Call Log.Message("Ներգրավված վարկեր/Գրաֆիկով վարկային պայմանագիր",,,attr)
  Set LoanWScheldule = New_LoanDocument()
  With LoanWScheldule
    .CalcAcc = "00000113032"                                    
    .Limit = 100000
    .Date = "090718" 
    .GiveDate = "090718"
    .Term = "090719"
    .PaperCode = 555
    .DocLevel = 1
  
    .DocType = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ"
    Call .CreateAttrLoan(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
  
    Log.Message(.DocNum)

    wMDIClient.VBObject("frmPttel").Close
  
    'Պայմանագրին ուղղարկել հաստատման
    .SendToVerify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|Ü»ñ·ñ³íí³Í í³ñÏ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Հաստատել
    .Verify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|Ü»ñ·ñ³íí³Í í³ñÏ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
  
    Call LetterOfCredit_Filter_Fill(FolderName, .DocLevel, .DocNum)
  End With
  
  Count = 14
  For i = 0 To Count-1
    If i <> 11 and i <> 12 Then
      Call OnClick(arrayWaitForDoc(i), "frmASDocForm")            
    End If  
  Next
  Call OnClick(c_Folders & "|" & c_CurrentSchedule, "frmASDocForm")
  Call OnClick(c_TermsStates & "|" & c_Dates & "|" & c_ReviewSchedule, "frmASDocForm")
  
  Count = 14
  For i = 0 To Count-1
    If i <> 5 and i <> 6 Then
      Call OnClick(arrayWaitForView(i), "AsView")
    End If
  Next 
  Call OnClick(c_Folders & "|" & c_SchFolder, "AsView")
   
  Count = 2
  For i = 0 To Count-1
    Call OnClick(arrayWaitForModalBrowser(i), "frmModalBrowser")
  Next 
  
  Count = 3
  For i = 0 To Count-1
    Call OnClick(arrayFrmSpr(i), "FrmSpr")
  Next 
  
  'Պայմանագրի փակում
  Call OnClick(c_AgrClose, "frmAsUstPar")
  
  'Ջնջել "Վարկային գիծ" պայմանագիրը  
  wMainForm.MainMenu.Click(c_AllActions)
  wMainForm.PopupMenu.Click(c_Delete)
  Asbank.VBObject("frmDeleteDoc").VBObject("YesButton").ClickButton

  wMDIClient.VBObject("frmPttel").Close
  
  Call Close_AsBank()
End Sub