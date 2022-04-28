Option Explicit
'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Currency_Exchange_Confirmphases_Library
'USEUNIT CashInput_Confirmphases_Library
'USEUNIT BackBallance_Input_Confirmphases_Library
'USEUNIT Constants  

'Test case number - 165055

Sub BackBallance_Input_DifferConditions_Test()    
  Dim fDATE, startDATE , docNumber, summa, fISN, draft,nbAcc, aim, data
  Dim confInput, confPath, docExist, isDel, rCount , inspDocVerify, accTemp1 , nbAcc1
    
  data = Null
  Utilities.ShortDateFormat = "yyyymmdd"
  startDATE = "20030101"
  fDATE = "20250101"
  confPath = "X:\Testing\BackBallance_Input confirm phases\BackBallance_Input_DifferConditions.txt"                            
  nbAcc = "999998/900002"
  nbAcc1 = "999998/123458"
  summa = "250000"
  draft = False
  aim = "Different conditions"
    
  'Test StartUp 
  Call Initialize_AsBank("bank", startDATE, fDATE)
    
  'Î³ñ·³íáñáõÙÝ»ñÇ Ý»ñÙáõÍáõÙ
  confInput = Input_Config(confPath)
  If Not confInput Then
    Log.Error("The configuration doesn't input")
  End If
    
  'ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ·ñÇ ëï»ÕÍáõÙ
  Call ChangeWorkspace(c_CustomerService)
  Call Online_PaySys_Go_To_Agr_WorkPapers("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ", data, data)
  Call BackBallance_Input_Doc_Fill(docNumber, nbAcc, summa, aim, fISN, draft)
    
  'îå»Éáõ Ó¨ å³ïáõÑ³ÝÇ ÷³ÏáõÙ
  BuiltIn.Delay(1000)
  wMDIClient.vbObject("FrmSpr").Close
    
  BuiltIn.Delay(1000)
  wMDIClient.vbObject("frmPttel").Close
    
  'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ ³ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ ÃÕÃ³å³Ý³ÏáõÙ
  Call ChangeWorkspace(c_CustomerService)
  docExist = Online_PaySys_Check_Doc_In_Workpapers(docNumber, data, data)
  If Not docExist Then
    Log.Error("The document with number " & docNumber & " doesn't exist in workpapers folder")
    Exit Sub
  End If
    
  'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ñ³ëï³ïÙ³Ý
  Call PaySys_Send_To_Verify()
    
  '1-ÇÝ ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
  Login("VERIFIER")
  docExist = Online_PaySys_Check_Doc_In_Verifier(docNumber, data, data)
  If Not docExist Then
    Log.Error("The document with number " & docNumber & " doesn't exist in 1st verify documents")
    Exit Sub
  End If
    
  '1-ÇÝ ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ ÏáÕÙÇó
  Call PaySys_Verify(True)
    
  '¶ÉË³íáñ Ñ³ßí³å³ÑÇ ÁÝ¹Ñ³Ýáõñ ¹ÇïáõÙ ÃÕÃ³å³Ý³ÏáõÙ ÷³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
  Login("ARMSOFT")
  Call ChangeWorkspace(c_ChiefAcc)
  docExist = Check_Doc_In_RegBackBallance_Workpaper(docNumber)
  If Not docExist Then
    Log.Error("The document with number " & fISN & " must exist in general view folder")
    Exit Sub
  End If
    
  '1-ÇÝ ö³ëï³ÃÕÃÇ Ñ»é³óáõÙ
  Call Online_PaySys_Delete_Agr()
    
  BuiltIn.Delay(1000)
  wMDIClient.vbObject("frmPttel").Close()
    
  'ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ·ñÇ ëï»ÕÍáõÙ
  Call ChangeWorkspace(c_CustomerService)
  Call Online_PaySys_Go_To_Agr_WorkPapers("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ", data, data)
  Call BackBallance_Input_Doc_Fill(docNumber, nbAcc1, summa, aim, fISN, draft)
    
  'îå»Éáõ Ó¨ å³ïáõÑ³ÝÇ ÷³ÏáõÙ
  BuiltIn.Delay(1000)
  wMDIClient.vbObject("FrmSpr").Close
    
  BuiltIn.Delay(1000)
  wMDIClient.vbObject("frmPttel").Close
    
  'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ ³ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ ÃÕÃ³å³Ý³ÏáõÙ
  Call ChangeWorkspace(c_CustomerService)
  docExist = Online_PaySys_Check_Doc_In_Workpapers(docNumber, data, data)
  If Not docExist Then
    Log.Error("The document with number " & docNumber & " doesn't exist in workpapers folder")
    Exit Sub
  End If
    
  'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ñ³ëï³ïÙ³Ý
  Call PaySys_Send_To_Verify()
    
  '2-ñ¹ ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
  Login("VERIFIER")
  docExist = Online_PaySys_Check_Doc_In_Verifier(docNumber, data, data)
  If Not docExist Then
    Log.Error("The document with number " & docNumber & " doesn't exist in 1st verify documents")
    Exit Sub
  End If
    
  '2-ñ¹  ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ ÏáÕÙÇó
  Call PaySys_Verify(True)

  '¶ÉË³íáñ Ñ³ßí³å³ÑÇ ÁÝ¹Ñ³Ýáõñ ¹ÇïáõÙ ÃÕÃ³å³Ý³ÏáõÙ ÷³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
  Login("ARMSOFT")
  Call ChangeWorkspace(c_ChiefAcc)
  docExist = Check_Doc_In_RegBackBallance_Workpaper(docNumber)
  If Not docExist Then
    Log.Error("The document with number " & fISN & " must exist in general view folder")
    Exit Sub
  End If
    
  '2-ñ¹ ÷³ëï³ÃÕÃÇ Ñ»é³óáõÙ
  Call Online_PaySys_Delete_Agr()
    
  'Test CleanUp
  Call Close_AsBank()
End Sub