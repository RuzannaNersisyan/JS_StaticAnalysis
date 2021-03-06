Option Explicit
'USEUNIT Library_Common
'USEUNIT Online_PaySys_Library
'USEUNIT Online_PaySys_Send_Library

Sub Online_PaySys_Send_Reject_Coffer_Test()
    
    Dim startDATE, fDATE , fDOCNUM , fBASE
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20101016"
    fDATE = "20111221"
    'Test StartUp start
    Call Initialize_AsBank("bank", startDATE, fDATE)
    Login("OPERATOR")
    'Test StartUp end
    
    'ä³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ
'    Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
'    Sys.Process("Asbank").vbObject("frmAsUstPar").vbObject("CmdOK").Click()
'    Call wMainForm.MainMenu.Click("¶áñÍáÕáõÃÛáõÝÝ»ñ|´áÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñÁ . . .")  
'    Call wMainForm.PopupMenu.Click("ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (Online ¾ìÐ áõÕ.)")
    Call Online_PaySys_Go_To_Agr_WorkPapers("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ",Null,Null)
    Call Online_PaySys_Prepare_To_Create(2)
    Call Online_PaySys_Send_Fill("T", Null, Null, "Poxos Dramarkxyan", "AH123456", Null, Null, Null, _
             "Petros Dramarkxyan", "AM", "200000", Null , Null , Null , "030211", _
             "001" , Null, Null, Null , Null , Null, Null, Null , 0 , fDOCNUM, fBASE)
   
    
    'ä³ÛÙ³Ý³·ñÇ áõÕ³ñÏáõÙ ¹ñ³Ù³ñÏÕ
    Call Online_PaySys_Go_To_Agr_WorkPapers("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ",Null,Null)
    Call Online_PaySys_Send_To_Verify(1,fDOCNUM)
    
    '¸ñ³Ù³ñÏÕÇó å³ÛÙ³Ý³·ñÇ Ñ»ï áõÕ³ñÏáõÙ
    Login("CASHIER")
    Call Online_PaySys_Go_To_Agr_WorkPapers("|¸ñ³Ù³ñÏÕ|ö³ëï³ÃÕÃ»ñ ¹ñ³Ù³ñÏÕáõÙ",Null,Null)
    Call Online_PaySys_Send_Back_From_Cash(fDOCNUM,False,False)
    
    
    'ä³ÛÙ³Ý³·ñÇ áõÕ³ñÏáõÙ ¹ñ³Ù³ñÏÕ
    Login("OPERATOR")
    Call Online_PaySys_Go_To_Agr_WorkPapers("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ",Null,Null) 
    Call Online_PaySys_Send_To_Verify(1,fDOCNUM)
    
    'ä³ÛÙ³Ý³·ñÇ í³í»ñ³óáõÙ ¹ñ³Ù³ñÏÕÇó
    Login("CASHIER")
    Call Online_PaySys_Go_To_Agr_WorkPapers("|¸ñ³Ù³ñÏÕ|ö³ëï³ÃÕÃ»ñ ¹ñ³Ù³ñÏÕáõÙ",Null,Null)
    Call Online_PaySys_Send_Back_From_Cash(fDOCNUM,True,True)
     
    'ä³ÛÙ³Ý³·ñÇ í³í»ñ³óáõÙ 1 Ñ³ëï³ïáÕÇ ÏáÕÙÇó
    Login("VERIFIER")
    Call Online_PaySys_Verify(fDOCNUM , True)  
    
    'Test CleanUp start
    Login("OPERATOR")
    'ö³ëï³ÃÕÃÇ Ñ»é³óáõÙ
    Call Online_PaySys_Go_To_Agr_WorkPapers("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ",Null,Null)
    Online_PaySys_Delete_Agr(fDOCNUM)
    Call Close_AsBank()
    'Test CleanUp end
    
End Sub