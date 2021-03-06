Option Explicit

'USEUNIT Library_Common  
'USEUNIT Akreditiv_Library 
'USEUNIT Constants

'Test Case Id - 160369

Sub Factoring_Clicks_Test()
  Dim fDATE, sDATE, AsUstPar, Count, i, DocNum, DocType, DocLevel, FolderName
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
  
  ReDim arrayWaitForDoc(21)          'պետք է բացվի Doc
  arrayWaitForDoc = Array(c_ToEdit, c_View, c_Safety & "|" & c_AgrOpen & "|" & c_Guarantee,_
                           c_Safety & "|" & c_AgrBindNew & "|" & c_AgrBind,_
                           c_InputPrimaryContract,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_PayOffDebt,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_Recalculate,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_ReturnPrepaidInt,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_FadeFactFromPercent,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_WriteOffRepay,_
                           c_Opers & "|" & c_Store & "|" & c_Store,_
                           c_Opers & "|" & c_Interests & "|" & c_PrcAccruing,_
                           c_Opers & "|" & c_WriteOff & "|" & c_WriteOff,_
                           c_Opers & "|" & c_WriteOff & "|" & c_WriteOffBack,_
                           c_Opers & "|" & c_DebtLet,_
                           c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms,_
                           c_TermsStates & "|" & c_Dates & "|" & c_OtherPaySchedule,_
                           c_TermsStates & "|" & c_Risking & "|" & c_RiskCatPerRes,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_Percentages,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_EffRate,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_BankEffRate)
  ReDim arrayWaitForView(16)          'պետք է բացվի View
  arrayWaitForView = Array(c_DocumentLog, c_Folders & "|" & c_LendFolder,_
                            c_Folders & "|" & c_ClFolder,_
                            c_Folders & "|" & c_AgrFolder,_
                            c_References & "|" & c_CheckPastdueSums,_
                            c_Safety & "|" & c_AgrBindNew & "|" & c_LinksOfAgreement,_
                            c_OpersView,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_PerDates,_
                            c_ViewEdit & "|" &  c_Risking & "|" &  c_RisksPersRes,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_Percentages,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_EffRate,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_BankEffRate,_
                            c_ViewEdit & "|" & c_Other & "|" & c_CalcDates,_
                            c_AccEntries & "|" & c_ForBal,_
                            c_AccEntries & "|" & c_ForOffBal)                            
  ReDim arrayWaitForModalBrowser(2)   'պետք է բացվի ModalBrowser
  arrayWaitForModalBrowser = Array(c_Safety & "|" & c_AgrOpen & "|" & c_Mortgage, c_Safety & "|" & c_AgrBind & "|" & c_Mortgage,_
                                    c_Safety & "|" & c_AgrBind & "|" & c_Guarantee)
  ReDim arrayFrmSpr(2)        
  arrayFrmSpr = Array(c_References & "|" & c_CommView, c_References & "|" & c_CliRepaySchedule, c_References & "|" &  c_Statement)

  FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|ØØÄä ü³ÏïáñÇÝ·|ä³ÛÙ³Ý³·ñ»ñ|"
  Call ChangeWorkspace(c_Subsystems)
  
  ''1.Տոկոս.եկ.բերող ֆակտորինգ
  Call Log.Message("Տոկոս.եկ.բերող ֆակտորինգ",,,attr)
  DocLevel = 1
  DocNum = "ST-010"
	Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)     
  
  Count = 21
  For i = 0 To Count-1
    Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
  Next
  
  
  Count = 16
  For i = 0 To Count-1
    BuiltIn.Delay(100)
    Call OnClick(arrayWaitForView(i), "AsView")
  Next 
  Call OnClick(c_ViewEdit & "|" & c_Other & "|" & c_AccAdjust, "AsView")
  
  Count = 3
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
                           
  ''2.Ֆակտորինգ
  Call Log.Message("Ֆակտորինգ",,,attr)
  DocLevel = 1
  DocNum = "F00070_001"                               
	Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)                          
                      
  Count = 21
  For i = 0 To Count-1
    If arrayWaitForDoc(i) <> c_Opers & "|" & c_GiveAndBack & "|" & c_ReturnPrepaidInt and arrayWaitForDoc(i) <> c_Opers & "|" & c_GiveAndBack & "|" & c_FadeFactFromPercent Then
      Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
    End If  
  Next
  Call OnClick(c_Opers & "|" & c_Interests & "|" & c_AccAdjust,"frmASDocForm")
  
  Count = 16
  For i = 0 To Count-1
    Call OnClick(arrayWaitForView(i), "AsView")
  Next 
  Call OnClick(c_ViewEdit & "|" & c_Other & "|" & c_AccAdjust, "AsView")
  
  Count = 3
  For i = 0 To Count-1
    Call OnClick(arrayWaitForModalBrowser(i), "frmModalBrowser")
  Next 
  
  Count = 2
  For i = 0 To Count-1
    If arrayFrmSpr(i) <> c_References & "|" & c_CliRepaySchedule Then
      Call OnClick(arrayFrmSpr(i), "FrmSpr")
    End If   
  Next 
  
  'Ջնջել   
  Call OnClick(c_Delete, "frmDeleteDoc")
  
  'Պայմանագրի փակում
  Call OnClick(c_AgrClose, "frmAsUstPar")

  wMDIClient.VBObject("frmPttel").Close  
  
  ''3.Գրաֆիկով ֆակտորինգ պայմանագիր
  Call Log.Message("Գրաֆիկով ֆակտորինգ պայմանագիր",,,attr)
  DocLevel = 1
  DocNum = "F00239"
	Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)  
  
  Count = 21
  For i = 0 To Count-1
    If arrayWaitForDoc(i) <> c_Opers & "|" & c_GiveAndBack & "|" & c_Recalculate and arrayWaitForDoc(i) <> c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms Then
      Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
    End If  
  Next
  Call OnClick(c_Folders & "|" & c_CurrentSchedules, "frmASDocForm")
  Call OnClick(c_TermsStates & "|" & c_Dates & "|" & c_ReviewSchedule, "frmASDocForm")
  Call OnClick(c_Opers & "|" & c_Interests & "|" & c_AccAdjust,"frmASDocForm")
  
  Count = 16
  For i = 0 To Count-1
    If arrayWaitForView(i) <> c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates and arrayWaitForView(i) <> c_ViewEdit & "|" & c_Dates & "|" & c_PerDates Then
      Call OnClick(arrayWaitForView(i), "AsView")
    End If  
  Next 
  Call OnClick(c_Folders & "|" & c_SchFolder, "AsView")
  Call OnClick(c_References & "|" & c_CheckInterest, "AsView")  
  Call OnClick(c_ViewEdit & "|" & c_Other & "|" & c_AccAdjust, "AsView")

  Count = 3
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
  
  ''4.Ֆակտորինգ գլխավոր պայմանագիր  
  Call Log.Message("Ֆակտորինգ գլխավոր պայմանագիր",,,attr)
  DocLevel = 2
  DocNum = "F00073"
	Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)
  
  ReDim arrayWaitForDoc(6)          'պետք է բացվի Doc
  arrayWaitForDoc = Array(c_ToEdit, c_View, c_Opers & "|" & c_Store & "|" & c_UnusedPartStore, c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms, c_TermsStates & "|" & c_Risking & "|" & c_RiskCatPerRes, c_TermsStates & "|" & c_Other & "|" & c_Limit)
                           
  ReDim arrayWaitForView(9)          'պետք է բացվի View
  arrayWaitForView = Array(c_DocumentLog, c_Folders & "|" & c_AgrFolder, c_Folders & "|" & c_ClFolder, c_OpersView,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates, c_ViewEdit & "|" &  c_Risking & "|" &  c_RisksPersRes, c_ViewEdit & "|" & c_Other & "|" & c_Limits, c_AccEntries & "|" & c_ForBal,_
                            c_AccEntries & "|" & c_ForOffBal)                            

  Count = 6
  For i = 0 To Count-1
    Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
  Next
  
  Count = 9
  For i = 0 To Count-1
    Call OnClick(arrayWaitForView(i), "AsView")
    Delay(1000)
  Next 
  
  Count = 3
  For i = 0 To Count-1
    If arrayFrmSpr(i) <> c_References & "|" & c_CliRepaySchedule Then
     Call OnClick(arrayFrmSpr(i), "FrmSpr")
    End If 
  Next 
  
  'Ջնջել   
  Call OnClick(c_Delete, "frmDeleteDoc")
  
  'Պայմանագրի փակում
  Call OnClick(c_AgrClose, "frmAsUstPar")

  wMDIClient.VBObject("frmPttel").Close

  Call Close_AsBank()
End Sub