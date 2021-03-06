Option Explicit
'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT PayOrder_Receive_ConfirmPhases_Library
'USEUNIT International_PayOrder_Receive_Confirmphases_Library
'USEUNIT Constants

'Test Case N 165051

Sub International_PayOrder_Receive_DifferConditions_Test()
  Dim fDATE, startDATE , data, payer, office, department, docNumber, recInfo
  Dim receiver, summa, fISN, confInput, confPath, docExist
  Dim payerAcc, IBAN, country, acc, transAcc, recAcc, curr, recCorrBank , department1
  Dim payerAddr, aim
    
  data = "211211"
  Utilities.ShortDateFormat = "yyyymmdd"
  startDATE = "20030101"
  fDATE = "20250101"
  confPath = "X:\Testing\International (Receive) ConfPhases\International_PayOrder_Receive_DifferConditions.txt"
    
  data = Null
  office = Null
  department = "1"
  department1 = "2"          
  payerAcc = Null
  payer = "Mijazgayin vcharox"
  IBAN = True
  country = "CZ"
  acc = "11111111111111111111"
  recAcc = "77700/03485190101"
  receiver = Null
  summa = "250000"
  curr = "001"
  recCorrBank = "CITIATWXXXX"
  transAcc = Null
  recInfo = Null
  payerAddr = Null
  aim =  "npatak"
    
  'Test StartUp 
  Call Initialize_AsBank("bank", startDATE, fDATE)
    
  'Î³ñ·³íáñáõÙÝ»ñÇ Ý»ñÙáõÍáõÙ
  confInput = Input_Config(confPath)
  If Not confInput Then
    Log.Error("The configuration doesn't input")
  End If

  'ØÇç. í×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (ëï.)-Ç ëï»ÕÍáõÙ
  Call ChangeWorkspace(c_ExternalTransfers)
  Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|Üáñ ÷³ëï³ÃÕÃ»ñ|ØÇç. í×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (ëï.)")
  Call International_PayOrder_Recipient_Fill( fISN, office, department, docNumber, data, recAcc, receiver, recInfo, payerAcc, payer,_
                                              payerAddr, country, acc, summa, curr, aim, recCorrBank, transAcc, IBAN)
    
  'îå»Éáõ Ó¨ å³ïáõÑ³ÝÇ ÷³ÏáõÙ
  BuiltIn.Delay(3000)
  wMDIClient.vbObject("FrmSpr").Close
    
  'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ Ñ³ßí³éÙ³Ý »ÝÃ³Ï³ ëï³óí³Í Ñ³ÝÓÝ³ñ³ñ·ñ»ñÇ ÃÕÃ³å³Ý³ÏáõÙ
  docExist = Check_Doc_In_UnderRegistration_Folder (docNumber, data, data)
  If docExist = False Then
    Log.Error("Document with specified ID " & docNumber & "doesn't exists in under registration folder")
    Exit Sub
  End If
    
  'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ñ³ëï³ïÙ³Ý 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
  Call PaySys_Send_To_Verify()
  Call ClickCmdButton(5, "²Ûá")

  'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
  Login("VERIFIER")
  docExist = Online_PaySys_Check_Doc_In_Verifier(docNumber, data, data)
  If Not docExist Then
    Log.Error("The document with number " & docNumber & " doesn't exist in 1st verify documents")
    Exit Sub
  End If
    
  'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ ÏáÕÙÇó
  Call PaySys_Verify(True)

  '²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ Ñ³ßí³éí³Í ëï³óí³Í ÷áË³ÝóáõÙÝ»ñ ÃÕÃ³å³Ý³ÏáõÙ Ñ³ÝÓÝ³ñ³ñ³·ñÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
  Login("ARMSOFT")
  Call ChangeWorkspace(c_ExternalTransfers)
  docExist = Check_Doc_In_Registered_Folder(docNumber , data, data)
  If Not docExist Then
    Log.Error("The document with number " & docNumber & " must exist in registered transfers folder")
    Exit Sub
  End If
    
  'Ößï»É Ù³ñáõÙÁ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
  Call Clarify_Fading()
    
  '²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ î³ñ³ÝóÇÏ ÃÕÃ³å³ÝÏáõÙ Ñ³ÝÓÝ³ñ³ñ·ñÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
  docExist = Check_Doc_In_Transit_Folder(docNumber, data, data)
  If Not docExist Then
    Log.Error("After fadeing order from registered payment orders folder with number " & docNumber & " must exist in under registration folder " )
  Else
    'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ù³ëÝ³ÏÇ ËÙµ³·ñÙ³Ý
    Call PaySys_SendTo_Partial_Edit()
  End If

  BuiltIn.Delay(3000)
  wMDIClient.vbObject("frmPttel").Close
    
  'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ Ø³ëÝ³ÏÇ ËÙµ³·ñíáÕ Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ ÃÕÃ³å³Ý³ÏáõÙ
  docExist = Check_Doc_In_Partial_Edit_Folder(docNumber, data, data)
  If Not docExist Then
    Log.Error("After sending to partial edit from transit folder the documnent with number " & docNumber & " must exist in partial editing folder " )
  Else
    'ö³ëï³ÃÕÃÇ Ñ»é³óáõÙ
    Call Paysys_Delete_Doc(False)
  End If
    
  BuiltIn.Delay(3000)
  wMDIClient.vbObject("frmPttel").Close
    
  'ØÇç. í×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (ëï.)-Ç ëï»ÕÍáõÙ
  Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|Üáñ ÷³ëï³ÃÕÃ»ñ|ØÇç. í×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (ëï.)")
  Call International_PayOrder_Recipient_Fill( fISN, office, department, docNumber, data, recAcc, receiver, recInfo, payerAcc, payer, payerAddr, country, acc,_
                                                            summa, curr, aim, recCorrBank, transAcc, IBAN)
    
  'îå»Éáõ Ó¨ å³ïáõÑ³ÝÇ ÷³ÏáõÙ
  BuiltIn.Delay(3000)
  wMDIClient.vbObject("FrmSpr").Close
    
  '2-ñ¹ ÷³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ Ñ³ßí³éÙ³Ý »ÝÃ³Ï³ ëï³óí³Í Ñ³ÝÓÝ³ñ³ñ·ñ»ñÇ ÃÕÃ³å³Ý³ÏáõÙ
  docExist = Check_Doc_In_UnderRegistration_Folder (docNumber, data, data)
  If docExist = False Then
    Log.Error("Document with specified ID " & docNumber & "doesn't exists in under registration folder")
    Exit Sub
  End If
    
  '2-ñ¹ ÷³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ñ³ëï³ïÙ³Ý 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
  Call PaySys_Send_To_Verify()
  Call ClickCmdButton(5, "²Ûá")
    
  '2-ñ¹ ÷³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
  Login("VERIFIER")
  docExist = Online_PaySys_Check_Doc_In_Verifier(docNumber, data, data)
  If Not docExist Then
    Log.Error("The document with number " & docNumber & " doesn't exist in 1st verify documents")
    Exit Sub
  End If
    
  '2-ñ¹ ÷³ëï³ÃÕÃÇ í³í»ñ³óáõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ ÏáÕÙÇó
  Call PaySys_Verify(True)
    
  '²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ Ñ³ßí³éí³Í ëï³óí³Í ÷áË³ÝóáõÙÝ»ñ ÃÕÃ³å³Ý³ÏáõÙ2-ñ¹ Ñ³ÝÓÝ³ñ³ñ³·ñÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
  Login("ARMSOFT")
  Call ChangeWorkspace(c_ExternalTransfers)
  docExist = Check_Doc_In_Registered_Folder(docNumber , data, data)
  If Not docExist Then
    Log.Error("The document with number " & docNumber & " must exist in registered transfers folder")
    Exit Sub
  End If
    
  'Ößï»É Ù³ñáõÙÁ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
  Call Clarify_Fading()
    
  '²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ î³ñ³ÝóÇÏ ÃÕÃ³å³ÝÏáõÙ 2-ñ¹ Ñ³ÝÓÝ³ñ³ñ·ñÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
  docExist = Check_Doc_In_Transit_Folder(docNumber, data, data)
  If Not docExist Then
    Log.Error("After fadeing order from registered payment orders folder with number " & docNumber & " must exist in under registration folder " )
  Else
    '2-ñ¹ ÷³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ù³ëÝ³ÏÇ ËÙµ³·ñÙ³Ý
    Call PaySys_SendTo_Partial_Edit()
  End If
    
  BuiltIn.Delay(3000)
  wMDIClient.vbObject("frmPttel").Close
    
  'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ Ø³ëÝ³ÏÇ ËÙµ³·ñíáÕ Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ ÃÕÃ³å³Ý³ÏáõÙ
  docExist = Check_Doc_In_Partial_Edit_Folder(docNumber, data, data)
  If Not docExist Then
    Log.Error("After sending to partial edit from transit folder the documnent with number " & docNumber & " must exist in partial editing folder " )
  Else
    'ö³ëï³ÃÕÃÇ Ñ»é³óáõÙ
    Call Paysys_Delete_Doc(False)
  End If
    
  ' Test CleanUp
  Call Close_AsBank()
End Sub