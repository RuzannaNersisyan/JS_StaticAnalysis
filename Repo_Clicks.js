Option Explicit

'USEUNIT Library_Common  
'USEUNIT Akreditiv_Library 
'USEUNIT Constants

'Test Case Id - 160495

Sub Repo_Clicks_Test()
  Dim fDATE, sDATE, AsUstPar, Count, i, DocNum, DocType, DocLevel, FolderName
  Dim arrayWaitForDoc, arrayWaitForView, arrayFrmSpr
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
  
  FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|"
  Call ChangeWorkspace(c_Subsystems)

  ReDim arrayWaitForDoc(17)          'պետք է բացվի Doc
  arrayWaitForDoc = Array(c_ToEdit, c_View, c_InputPrimaryContract,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_PayOffDebt,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_GiveRepo,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_SecBuy,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_SecSell,_
                           c_Opers & "|" & c_Store & "|" & c_Store,_
                           c_Opers & "|" & c_Interests & "|" & c_PrcAccruing,_
                           c_Opers & "|" & c_Interests & "|" & c_AccAdjust,_
                           c_Opers & "|" & c_RepSecOvervalue,_
                           c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms,_
                           c_TermsStates & "|" & c_Dates & "|" & c_OtherPaySchedule,_
                           c_TermsStates & "|" & c_Risking & "|" & c_RiskCatPerRes,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_Percentages,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_EffRate,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_BankEffRate)
  ReDim arrayWaitForView(17)          'պետք է բացվի View
  arrayWaitForView = Array(c_DocumentLog, c_Folders & "|" & c_ClFolder,_
                            c_Folders & "|" & c_AgrFolder,_
                            c_Folders & "|" & c_SecsFromRepo, c_OpersView,_
                            c_References & "|" & c_CheckPastdueSums,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_PerDates,_
                            c_ViewEdit & "|" & c_Risking & "|" &  c_RisksPersRes,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_Percentages,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_EffRate,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_BankEffRate,_
                            c_ViewEdit & "|" & c_Other & "|" & c_AccAdjust,_
                            c_ViewEdit & "|" & c_Other & "|" & c_CalcDates,_
                            c_ViewEdit & "|" &  c_Other & "|" & c_PriceCorrDates,_
                            c_AccEntries & "|" & c_ForBal, c_AccEntries & "|" & c_ForOffBal)
                                                        
  ReDim arrayFrmSpr(3)        
  arrayFrmSpr = Array(c_References & "|" & c_CommView, c_References & "|" & c_CliRepaySchedule, c_References & "|" &  c_Statement)
  
  ''1.Ռեպո
  Call Log.Message("Ռեպո",,,attr)
  DocLevel = 1
  DocNum = "R-0007"
	Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)     
  
  Count = 17
  For i = 0 To Count-1
    Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
  Next
  
  Count = 17
  For i = 0 To Count-1
    Call OnClick(arrayWaitForView(i), "AsView")
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
  
  
  ReDim arrayWaitForDoc(12)          'պետք է բացվի Doc
  arrayWaitForDoc = Array(c_ToEdit, c_View,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_PayOffDebt,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_InvolveRepo,_
                           c_Opers & "|" & c_Interests & "|" & c_PrcAccruing,_
                           c_Opers & "|" & c_Interests & "|" & c_AccAdjust,_
                           c_Opers & "|" & c_SecChng, c_Opers & "|" & c_PassSums,_
                           c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms,_
                           c_TermsStates & "|" & c_Dates & "|" & c_OtherPaySchedule,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_Percentages,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_EffRate,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_BankEffRate)
   
  ''2.Հակադարձ ռեպո համաձայնագրեր
  FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|Ð³Ï³¹³ñÓ é»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|"
  Call Log.Message("Հակադարձ ռեպո համաձայնագրեր",,,attr)
  DocLevel = 1
  DocNum = "HR-00004"
	Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)
  
  Count = 12
  For i = 0 To Count-1
    Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
  Next
  
  Count = 17
  For i = 0 To Count-2
    If i <> 3 and i <> 8 and i <> 14 Then
      Call OnClick(arrayWaitForView(i), "AsView")
    End If  
  Next 
  Call OnClick(c_ViewEdit & "|" & c_Other & "|" & c_SecChng, "AsView")
  
  Count = 3
  For i = 0 To Count-1
    Call OnClick(arrayFrmSpr(i), "FrmSpr")
  Next 
  
  'Ջնջել   
  Call OnClick(c_Delete, "frmDeleteDoc")
  
  'Պայմանագրի փակում
  Call OnClick(c_AgrClose, "frmAsUstPar")

  wMDIClient.VBObject("frmPttel").Close

  Call Close_AsBank()
End Sub  