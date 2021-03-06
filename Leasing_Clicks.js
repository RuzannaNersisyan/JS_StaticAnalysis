Option Explicit

'USEUNIT Library_Common  
'USEUNIT Akreditiv_Library 
'USEUNIT Financial_Leasing_Library
'USEUNIT Constants

'Test Case Id - 160423

Sub Leasing_Clicks_Test()
  Dim Leasing, LeasingSch
  Dim fDATE, sDATE, Count, i, FolderPath
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
  ReDim arrayWaitForDoc(22)          'պետք է բացվի Doc
  arrayWaitForDoc = Array(c_ToEdit, c_View,_
                           c_Safety & "|" & c_AgrOpen & "|" & c_Guarantee,_
                           c_Safety & "|" & c_AgrBindNew & "|" & c_AgrBind,_
                           c_InputPrimaryContract,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_GiveLeasing,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_PayOffDebt,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_ReturnPrepaidInt,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_FadeLeasingFromPercent,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_WriteOffRepay,_ 
                           c_Opers & "|" & c_Store & "|" & c_Store,_
                           c_Opers & "|" & c_Interests & "|" & c_PrcAccruing,_
                           c_Opers & "|" & c_Interests & "|" & c_AccAdjust,_
                           c_Opers & "|" & c_WriteOff & "|" & c_WriteOff,_
                           c_Opers & "|" & c_WriteOff & "|" & c_WriteOffBack,_
                           c_Opers & "|" & c_DebtLet,_
                           c_TermsStates & "|" & c_Dates & "|" & c_OtherPaySchedule,_
                           c_TermsStates & "|" & c_Risking & "|" & c_RiskCatPerRes,_
                           c_TermsStates & "|" & c_Risking & "|" & c_ObjRiskCat,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_Percentages,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_EffRate,_
                           c_TermsStates & "|" & c_WrOffFromNB)
  ReDim arrayWaitForView(15)          'պետք է բացվի View
  arrayWaitForView = Array(c_DocumentLog, c_Folders & "|" & c_ClFolder,_
                            c_Folders & "|" & c_AgrFolder,_
                            c_Folders & "|" & c_AgrChildren,_
                            c_Safety & "|" & c_AgrBindNew & "|" & c_LinksOfAgreement, c_OpersView,_
                            c_ViewEdit & "|" & c_Risking & "|" & c_RisksPersRes,_
                            c_ViewEdit & "|" & c_Risking & "|" & c_ObjRiskCat,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_Percentages,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_EffRate,_
                            c_ViewEdit & "|" & c_Other & "|" & c_AccAdjust,_
                            c_ViewEdit & "|" & c_Other & "|" & c_CalcDates,_
                            c_ViewEdit & "|" & c_WrOffFromNB,_
                            c_AccEntries & "|" & c_ForBal, c_AccEntries & "|" & c_ForOffBal)     
  ReDim arrayWaitForModalBrowser(4)   'պետք է բացվի ModalBrowser
  arrayWaitForModalBrowser = Array(c_Safety & "|" & c_AgrOpen & "|" & c_Mortgage, c_Safety & "|" & c_AgrBind & "|" & c_Mortgage,_
                                    c_Safety & "|" & c_AgrBind & "|" & c_Guarantee)
  ReDim arrayFrmSpr(3)        
  arrayFrmSpr = Array(c_References & "|" & c_CommView, c_References & "|" & c_CliRepaySchedule, c_References & "|" &  c_Statement)                            
  
  Call ChangeWorkspace(c_Subsystems)
  
  'Լիզինգի ստեղծում
  Set Leasing = New_LeasingDoc()
  With Leasing
    .CalcAcc = "00011830600"
    .Date = "140818"
    .GiveDate = "140818"
    .StartDate = "140818"
    .LastDate = "140820"
    .Summa = 1000000
    .PaperCode = 111
    .DocType = "ÈÇ½ÇÝ·"
    .office = "00"
    .department = "1"
    
    FolderPath = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ|"
    Call .CreateLeasing(FolderPath)
  
    wMDIClient.VBObject("frmPttel").Close
  
    'Պայմանագիրը ուղարկել հաստատման
    .SendToVerify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Վավերացնել պայմանագիրը
    .Verify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
  
    FolderPath = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|"
    Call Log.Message("Լիզինգ",,,attr)
    Call LetterOfCredit_Filter_Fill(FolderPath, .DocLevel, .DocNum)
  End With
  
  Count = 22
  For i = 0 To Count-1
    Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
    BuiltIn.Delay(1000)
  Next
  
  Count = 15
  For i = 0 To Count-1
    Call OnClick(arrayWaitForView(i), "AsView")
  Next 
  
  Count = 3
  For i = 0 To Count-1
    Call OnClick(arrayWaitForModalBrowser(i), "frmModalBrowser")
  Next 
  
  Count = 3
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
  
  'Գրաֆիկով լիզինգի պայմանագրի ստեղծում
  FolderPath = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ"
  
  Set LeasingSch = New_LeasingDoc()
  With LeasingSch
    .CalcAcc = "00011830600"
    .Date = "140818"
    .GiveDate = "140818"
    .StartDate = "140818"
    .Summa = 1000000
    .BuyPrice = 800000
    .PaperCode = 111
    .Term = "140820"
    .DatesFillType = 1
    .DocType = "¶ñ³ýÇÏáí ÉÇ½ÇÝ·Ç å³ÛÙ³Ý³·Çñ"
    .office = "00"
    .department = "1"
  
    Call .CreateLeasing(FolderPath)
  
    'Մարման գրաֆիկի նշանակում
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_RepaySchedule)   
  
    Asbank.VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close
  
    'Պայմանագիրը ուղարկել հաստատման
    .SendToVerify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Վավերացնել պայմանագիրը
    .Verify("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
  
    FolderPath = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|üÇÝ³Ýë³Ï³Ý ÉÇ½ÇÝ· (ï»Õ³µ³ßËí³Í)|"
    Call Log.Message("Գրաֆիկով լիզինգի պայմանագիր",,,attr)
    Call LetterOfCredit_Filter_Fill(FolderPath, .DocLevel, .DocNum)
  End With
  
  Count = 22
  For i = 0 To Count-1
    Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
  Next
  Call OnClick(c_Folders & "|" & c_CurrentSchedule, "frmASDocForm")
  Call OnClick(c_Opers & "|" & c_Revaluation, "frmASDocForm")
  Call OnClick(c_TermsStates & "|" & c_Percentages & "|" & c_SubsidyRate, "frmASDocForm")
  Call OnClick(c_TermsStates & "|" & c_CalcStart, "frmASDocForm")
  
  Count = 15
  For i = 0 To Count-1
    If i <> 3 Then
      Call OnClick(arrayWaitForView(i), "AsView")
    End If  
  Next 
  Call OnClick(c_Folders & "|" & c_SchFolder, "AsView")
  Call OnClick(c_ViewEdit & "|" & c_CalcStart, "AsView")
  
  Count = 3
  For i = 0 To Count-1
    Call OnClick(arrayWaitForModalBrowser(i), "frmModalBrowser")
  Next 
  
  Count = 3
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