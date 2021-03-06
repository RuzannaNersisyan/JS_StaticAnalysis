Option Explicit

'USEUNIT Library_Common  
'USEUNIT Constants

'Test Case Id - 160448

Sub Limit_Clicks_Test()
  Dim fDATE, sDATE, Count, i, DocNum, DocType, FolderName
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
  
  ReDim arrayWaitForDoc(5)          'պետք է բացվի Doc
  arrayWaitForDoc = Array(c_View,_
                           c_Safety & "|" & c_AgrOpen & "|" & c_Guarantee,_
                           c_Safety & "|" & c_AgrBindNew & "|" & c_AgrBind,_
                           c_TermsStates & "|" & c_Dates & "|" & c_OtherPaySchedule,_
                           c_TermsStates & "|" & c_RecLine)
  ReDim arrayWaitForView(9)          'պետք է բացվի View
  arrayWaitForView = Array(c_DocumentLog, c_Folders & "|" & c_ClFolder,_
                            c_Folders & "|" & c_AgrFolder,_
                            c_Folders & "|" & c_Agreements,_
                            c_Safety & "|" & c_AgrBindNew & "|" & c_LinksOfAgreement,_
                            c_ViewEdit & "|" & c_Dates & "|" & c_AgrDates,_
                            c_ViewEdit & "|" & c_LineBrRec,_
                            c_AccEntries & "|" & c_ForBal, c_AccEntries & "|" & c_ForOffBal)     
  ReDim arrayWaitForModalBrowser(3)   'պետք է բացվի ModalBrowser
  arrayWaitForModalBrowser = Array(c_Safety & "|" & c_AgrOpen & "|" & c_Mortgage, c_Safety & "|" & c_AgrBind & "|" & c_Mortgage,_
                                    c_Safety & "|" & c_AgrBind & "|" & c_Guarantee)
  ReDim arrayFrmSpr(2)        
  arrayFrmSpr = Array(c_References & "|" & c_CommView, c_References & "|" &  c_Statement)
  
  FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|ê³ÑÙ³Ý³ã³÷»ñ|"
  
  Call Log.Message("Սահմանաչափի պայմանագիր",,,attr)
  DocNum = "3759"
  Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|ê³ÑÙ³Ý³ã³÷»ñ|ä³ÛÙ³Ý³·ñ»ñ")
  With Asbank
    .VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("AsTpComment").VBObject("TDBComment").Keys(DocNum & "[Tab]")
    .VBObject("frmAsUstPar").VBObject("CmdOK").ClickButton
  End With  
  
  Count = 5
  For i = 0 To Count-1
    Call OnClick(arrayWaitForDoc(i), "frmASDocForm")
  Next
  
  Count = 9
  For i = 0 To Count-1
    Call OnClick(arrayWaitForView(i), "AsView")
  Next 
  
  Count = 3
  For i = 0 To Count-1
    Call OnClick(arrayWaitForModalBrowser(i), "frmModalBrowser")
  Next
  
  Count = 2
  For i = 0 To Count-1
    Call OnClick(arrayFrmSpr(i), "FrmSpr")
  Next

  'Ջնջել   
  Call OnClick(c_Delete, "frmDeleteDoc")
  
  wMDIClient.VBObject("frmPttel").Close
  
  Call Close_AsBank()
End Sub