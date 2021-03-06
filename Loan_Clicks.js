Option Explicit

'USEUNIT Library_Common  
'USEUNIT Akreditiv_Library 
'USEUNIT Constants
'USEUNIT Loan_Agreements_Library
'USEUNIT Credit_Line_Library
'USEUNIT Loan_Agreements_With_Schedule_Linear_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Overdraft_NewCases_Library

'Test Case Id - 160454

Sub Loan_Clicks_Test()
  Dim CollectFromProvision_ISN, GiveCredit_ISN, PercentCapISN, Repay_ISN,_
      WriteOut_ISN, RestoreWriteOut_ISN
  Dim CreditLine, OneTimeCredit
  Dim Typ, Date, calcDate, opDate, MainSum, PerSum
  Dim fDATE, sDATE, AsUstPar, Count, i, DocNum, DocLevel, DocType, FolderName
  Dim arrayWaitForDoc, arrayWaitForView, arrayWaitForModalBrowser, arrayFrmSpr
  Dim frmModalBrowser, frmAsUstPar, MDIClient, my_vbObj, attr, attr1
  
  ''1.Համակարգ մուտք գործել ARMSOFT օգտագործողով
  fDATE = "20220101"
  sDATE = "20140101"
  Call Initialize_AsBank("bank", sDATE, fDATE)
  Login("ARMSOFT")
  
'--------------------------------------
  Set attr = Log.CreateNewAttributes
  attr.BackColor = RGB(255, 255, 0)
  attr.Bold = True
  attr.Italic = True
  Set attr1 = Log.CreateNewAttributes
  attr1.BackColor = RGB(0, 255, 255	)
'--------------------------------------  

  FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ|"
  Call ChangeWorkspace(c_Subsystems)
  
  ReDim arrayWaitForDoc(22)          'պետք է բացվի Doc
  arrayWaitForDoc = Array(c_ToEdit, c_View,_
                           c_Safety & "|" & c_AgrOpen & "|" & c_Guarantee,_
                           c_Safety & "|" & c_AgrBindNew & "|" & c_AgrBind,_
                           c_InputPrimaryContract,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_PayOffDebt,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_ReturnPrepaidInt,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_FadeLoanFromPercent,_
                           c_Opers & "|" & c_GiveAndBack & "|" & c_WriteOffRepay,_ 
                           c_Opers & "|" & c_Store & "|" & c_Store,_
                           c_Opers & "|" & c_Interests & "|" & c_PrcAccruing,_
                           c_Opers & "|" & c_Interests & "|" & c_AccAdjust,_
                           c_Opers & "|" & c_WriteOff & "|" & c_WriteOff,_
                           c_Opers & "|" & c_WriteOff & "|" & c_WriteOffBack,_
                           c_Opers & "|" & c_WriteOff & "|" & c_TransferRates,_
                           c_Opers & "|" & c_DebtLet,_
                           c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms,_
                           c_TermsStates & "|" & c_Dates & "|" & c_OtherPaySchedule,_
                           c_TermsStates & "|" & c_Risking & "|" & c_RiskCatPerRes,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_Percentages,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_EffRate,_
                           c_TermsStates & "|" & c_RecLine)
  ReDim arrayWaitForView(17)          'պետք է բացվի View
  arrayWaitForView = Array(c_DocumentLog, c_Folders & "|" & c_ClFolder, c_Folders & "|" & c_AgrFolder,_
                            c_References & "|" & c_CheckPastdueSums,_
                            c_Safety & "|" & c_AgrBindNew & "|" & c_LinksOfAgreement, c_OpersView,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_PerDates,_
                            c_ViewEdit & "|" &  c_Risking & "|" &  c_RisksPersRes,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_Percentages,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_EffRate,_
                            c_ViewEdit & "|" & c_Other & "|" & c_AccAdjust,_
                            c_ViewEdit & "|" & c_Other & "|" & c_Limits,_
                            c_ViewEdit & "|" & c_Other & "|" & c_CalcDates,_
                            c_ViewEdit & "|" & c_LineBrRec,_
                            c_AccEntries & "|" & c_ForBal, c_AccEntries & "|" & c_ForOffBal)     
  ReDim arrayWaitForModalBrowser(2)   'պետք է բացվի ModalBrowser
  arrayWaitForModalBrowser = Array(c_Safety & "|" & c_AgrOpen & "|" & c_Mortgage, c_Safety & "|" & c_AgrBind & "|" & c_Mortgage,_
                                    c_Safety & "|" & c_AgrBind & "|" & c_Guarantee)
  ReDim arrayFrmSpr(2)        
  arrayFrmSpr = Array(c_References & "|" & c_CommView, c_References & "|" & c_CliRepaySchedule, c_References & "|" &  c_Statement)                            
  
''  ''Ջնջել բոլոր փաստաթղթերը
'''  090818-100818
  Call Log.Message("Վարկային գիծ",,,attr)
  DocLevel = 1
  DocNum = "^A[Del]" & "V-000293"
  Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)                                                 
  Count = 22
  For i = 0 To Count-1
    Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
  Next
  
  Count = 17
  For i = 0 To Count-1
    BuiltIn.Delay(100)
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
  
  'Ջնջել   
  Call OnClick(c_Delete, "frmDeleteDoc")
  
  'Պայմանագրի փակում
  Call OnClick(c_AgrClose, "frmAsUstPar")

  wMDIClient.VBObject("frmPttel").Close
  
  ''2.Միանգամյա վարկ
  Call Log.Message("Միանգամյա վարկ",,,attr)
  DocLevel = 1
  DocNum = "^A[Del]" & "V-002534"
  Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)
  
  Count = 22
  For i = 0 To Count-2
    Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
  Next
  Call OnClick(c_Opers & "|" & c_GiveAndBack & "|" & c_CredGrant, "frmASDocForm")
  Call OnClick(c_Opers & "|" & c_GiveAndBack & "|" & c_GiveCharge, "frmASDocForm")
  Call OnClick(c_TermsStates & "|" & c_Percentages & "|" & c_BankEffRate, "frmASDocForm")
  
  Count = 17
  For i = 0 To Count-1
    If arrayWaitForView(i) = c_ViewEdit & "|" & c_Other & "|" & c_Limits Then
      Call OnClick(c_ViewEdit & "|" & c_Percentages & "|" & c_BankEffRate, "AsView")
    ElseIf arrayWaitForView(i) = c_ViewEdit & "|" & c_LineBrRec Then
      
    Else        
      Call OnClick(arrayWaitForView(i), "AsView")
    End If
  Next 
  
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
  
  wMDIClient.VBObject("frmPttel").Close
  
  ''3.Գրաֆիկով վարկային պայմանագիր
  Call Log.Message("Գրաֆիկով վարկային պայմանագիր",,,attr)
  DocLevel = 1
  DocNum = "^A[Del]" & "V-000429"
  Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)
                              
  Count = 22
  For i = 0 To Count-1
    If arrayWaitForDoc(i) = c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms Then
      Call OnClick(c_TermsStates & "|" & c_Dates & "|" & c_ReviewSchedule, "frmASDocForm")
    ElseIf arrayWaitForDoc(i) = c_TermsStates & "|" & c_RecLine Then
      Call OnClick(c_Folders & "|" & c_CurrentSchedules, "frmASDocForm")
    Else  
      Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
    End IF  
  Next
  Call OnClick(c_TermsStates & "|" & c_Percentages & "|" & c_SubsidyRate, "frmASDocForm")
  Call OnClick(c_TermsStates & "|" & c_Percentages & "|" & c_BankEffRate, "frmASDocForm")
  
  Count = 17
  For i = 0 To Count-1
    If arrayWaitForView(i) <> c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates and arrayWaitForView(i) <> c_ViewEdit & "|" & c_Dates & "|" & c_PerDates and arrayWaitForView(i) <> c_ViewEdit & "|" & c_Other & "|" & c_Limits and arrayWaitForView(i) <> c_ViewEdit & "|" & c_LineBrRec Then 
      Call OnClick(arrayWaitForView(i), "AsView")
    End If  
  Next 
  Call OnClick(c_Folders & "|" & c_SchFolder,      "AsView")
  Call OnClick(c_References & "|" & c_CheckInterest,       "AsView")
  Call OnClick(c_ViewEdit & "|" & c_Percentages & "|" & c_BankEffRate,     "AsView")
  Call OnClick(c_ViewEdit & "|" & c_Percentages & "|" & c_SubsidyRate,   "AsView")
  Call OnClick(c_ViewEdit & "|" & c_CalcStart, "AsView")
  
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
  
  wMDIClient.VBObject("frmPttel").Close
  
  ''4.Գրաֆիկով վարկային պայմանագիր(Գծային)
  Call Log.Message("Գրաֆիկով վարկային պայմանագիր(Գծային)",,,attr)
  DocLevel = 1
  DocNum = "^A[Del]" & "V-000421"
  Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)                                         
  
  Count = 22
  For i = 0 To Count-1
    If arrayWaitForDoc(i) = c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms Then 
      arrayWaitForDoc(i) = c_TermsStates & "|" & c_Dates & "|" & c_ReviewSchedule
    ElseIf arrayWaitForDoc(i) = c_Opers & "|" & c_WriteOff & "|" & c_TransferRates Then
      arrayWaitForDoc(i) = c_TermsStates & "|" & c_Percentages & "|" & c_SubsidyRate  
    End If 
      Call OnClick(arrayWaitForDoc(i), "frmASDocForm")      
  Next
  
  Count = 17
  For i = 0 To Count-1
    If arrayWaitForView(i) = c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates Then
       arrayWaitForView(i) = c_Folders & "|" & c_SchFolder
    ElseIf arrayWaitForView(i) = c_ViewEdit & "|" & c_Dates & "|" & c_PerDates Then 
       arrayWaitForView(i) = c_References & "|" & c_CheckInterest
    End If
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
  
  'Ջնջել   
  Call OnClick(c_Delete, "frmDeleteDoc")
  
  wMDIClient.VBObject("frmPttel").Close
  
  ''5.Բարդ վարկ
  Call Log.Message("Բարդ վարկ",,,attr)
  DocLevel = 2
  DocNum = "^A[Del]" & "V-002452"
  Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)
  
  ReDim arrayWaitForDoc(11)           'պետք է բացվի Doc
  arrayWaitForDoc = Array(c_ToEdit, c_View,_
                           c_Safety & "|" & c_AgrOpen & "|" & c_Guarantee,_
                           c_Safety & "|" & c_AgrOpen & "|" & c_DepMort,_
                           c_Safety & "|" & c_AgrBindNew & "|" & c_AgrBind ,_
                           c_InputPrimaryContract,_
                           c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms,_
                           c_TermsStates & "|" & c_Risking & "|" & c_RiskCatPerRes,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_Percentages,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_SubsidyRate,_
                           c_TermsStates & "|" & c_Other & "|" & c_Limit)
  ReDim arrayWaitForView(13)          'պետք է բացվի View
  arrayWaitForView = Array(c_DocumentLog,_
                            c_Folders & "|" & c_ClFolder,_
                            c_Folders & "|" & c_AgrFolder,_
                            c_Folders & "|" & c_AgrChildren,_
                            c_Safety & "|" & c_AgrBindNew & "|" & c_LinksOfAgreement,_
                            c_OpersView,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates,_
                            c_ViewEdit & "|" &  c_Risking & "|" &  c_RisksPersRes,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_Percentages,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_SubsidyRate,_
                            c_ViewEdit & "|" & c_Other & "|" & c_AccAdjust,_
                            c_AccEntries & "|" & c_ForBal, c_AccEntries & "|" & c_ForOffBal)                            
                           
  Count = 11
  For i = 0 To Count-1
    Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
  Next
  
  Count = 13
  For i = 0 To Count-1
    Call OnClick(arrayWaitForView(i), "AsView")
  Next 
  
  Count = 3
  For i = 0 To Count-1
    Call OnClick(arrayWaitForModalBrowser(i), "frmModalBrowser")
  Next 
  Call OnClick(c_OpenSubAgr, "frmModalBrowser")
  
  Count = 3
  For i = 0 To Count-1
    Call OnClick(arrayFrmSpr(i), "FrmSpr")
  Next 
  
  'Ջնջել   
  Call OnClick(c_Delete, "frmDeleteDoc")
  
  'Պայմանագրի փակում
  Call OnClick(c_AgrClose, "frmAsUstPar")

  wMDIClient.VBObject("frmPttel").Close    
  
  ''6.Բարդ վարկ(Գծային)
  Call Log.Message("Բարդ վարկ(Գծային)",,,attr)
  DocLevel = 2
  DocNum = "^A[Del]" & "V-002521"
  Call LetterOfCredit_Filter_Fill(FolderName, DocLevel, DocNum)
  
  ReDim arrayWaitForDoc(22)          'պետք է բացվի Doc
  arrayWaitForDoc = Array(c_ToEdit, c_View,_
                           c_Safety & "|" & c_AgrOpen & "|" & c_Guarantee,_
                           c_Safety & "|" & c_AgrOpen & "|" & c_DepMort,_
                           c_Safety & "|" & c_AgrBindNew & "|" & c_AgrBind,_
                           c_InputPrimaryContract,_
                           c_Opers & "|" & c_IntRepayment,_
                           c_Opers & "|" & c_Store & "|" & c_Store,_
                           c_Opers & "|" & c_Store & "|" & c_UnusedPartStore,_
                           c_Opers & "|" & c_Interests & "|" & c_PrcAccruing,_
                           c_Opers & "|" & c_Interests & "|" & c_AccAdjust,_
                           c_Opers & "|" & c_WriteOff & "|" & c_WriteOff,_
                           c_Opers & "|" & c_WriteOff & "|" & c_WriteOffBack,_
                           c_Opers & "|" & c_WriteOff & "|" & c_DebtLet,_
                           c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms,_
                           c_TermsStates & "|" & c_Dates & "|" & c_OtherPaySchedule,_
                           c_TermsStates & "|" & c_Risking & "|" & c_RiskCatPerRes,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_Percentages,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_EffRate,_
                           c_TermsStates & "|" & c_Percentages & "|" & c_SubsidyRate,_
                           c_TermsStates & "|" & c_Other & "|" & c_Limit,_
                           c_TermsStates & "|" & c_StopLine)
  ReDim arrayWaitForView(18)          'պետք է բացվի View
  arrayWaitForView = Array(c_DocumentLog,_
                            c_Folders & "|" & c_ClFolder,_
                            c_Folders & "|" & c_AgrFolder,_
                            c_Folders & "|" & c_AgrChildren,_
                            c_Safety & "|" & c_AgrBindNew & "|" & c_LinksOfAgreement,_
                            c_OpersView,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_PerDates,_
                            c_ViewEdit & "|" &  c_Risking & "|" &  c_RisksPersRes,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_Percentages,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_EffRate,_
                            c_ViewEdit & "|" & c_Percentages & "|" & c_SubsidyRate,_
                            c_ViewEdit & "|" & c_Other & "|" & c_AccAdjust,_
                            c_ViewEdit & "|" & c_Other & "|" & c_Limits,_
                            c_ViewEdit & "|" & c_Other & "|" & c_CalcDates,_
                            c_ViewEdit & "|" & c_LineBrRec,_
                            c_AccEntries & "|" & c_ForBal, c_AccEntries & "|" & c_ForOffBal)
 
  Count = 22
  For i = 0 To Count-1
    Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
  Next
  
  Count = 18
  For i = 0 To Count-1
    Call OnClick(arrayWaitForView(i), "AsView")
  Next 
  
  Count = 3
  For i = 0 To Count-1
    Call OnClick(arrayWaitForModalBrowser(i), "frmModalBrowser")
  Next 
  Call OnClick(c_OpenSubAgr, "frmModalBrowser")
  
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