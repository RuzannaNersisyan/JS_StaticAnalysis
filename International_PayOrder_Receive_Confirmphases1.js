Option Explicit
'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT PayOrder_Receive_ConfirmPhases_Library
'USEUNIT International_PayOrder_Receive_Confirmphases_Library
'USEUNIT Constants

'Test Case ID 165629

Sub International_PayOrder_Receive_Reject_Test()
    
    Dim fDATE, startDATE , data, payer, office, department, docNumber
    Dim receiver, summa, fISN, confInput, confPath, docExist , inspDocVerify
    Dim payerAcc, IBAN, country, acc, transAcc, recAcc, curr, recCorrBank
    Dim recInfo, payerAddr, aim
    
    data = "211217"
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20030101"
    fDATE = "20250101"
    confPath = "X:\Testing\International (Receive) ConfPhases\International_PayOrder_Receive_Reject.txt"
    data = Null     
    office = Null
    department = Null
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
    aim = "npatak"
    
    'Test StartUp 
    Call Initialize_AsBank("bank", startDATE, fDATE)
    Call ChangeWorkspace(c_Admin)
    
    'Î³ñ·³íáñáõÙÝ»ñÇ Ý»ñÙáõÍáõÙ
    confInput = Input_Config(confPath)
    If Not confInput Then
        Log.Error("The configuration doesn't input")
    End If
    
    Call ChangeWorkspace(c_ExternalTransfers)
    'ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ·Çñ (ëï.)-Ç ëï»ÕÍáõÙ
    Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|Üáñ ÷³ëï³ÃÕÃ»ñ|ØÇç. í×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (ëï.)")
     Call International_PayOrder_Recipient_Fill( fISN, office, department, docNumber, data, recAcc, receiver, recInfo, payerAcc, payer, payerAddr, country, acc,_
                                                                                         summa, curr, aim, recCorrBank, transAcc, IBAN )
    'îå»Éáõ Ó¨ å³ïáõÑ³ÝÇ ÷³ÏáõÙ
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("FrmSpr").Close
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ Ñ³ßí³éÙ³Ý »ÝÃ³Ï³ ëï³óí³Í Ñ³ÝÓÝ³ñ³ñ·ñ»ñÇ ÃÕÃ³å³Ý³ÏáõÙ
    docExist = Check_Doc_In_UnderRegistration_Folder (docNumber, data, data)
    If docExist = False Then
        Log.Error("Document with specified ID " & docNumber & "doesn't exists in under registration folder")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ í»ñëïáõ·Ù³Ý
    Call PaySys_Send_To_CheckUp()
    Call ClickCmdButton(5, "²Ûá")
    
    Login("DOUBLEINPUTOPERATOR")
    docExist = PaySys_Check_Doc_In_InspecdetDoc_Folder(docNumber)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & "doesn't exist in inspected documents folder")
        Exit Sub
    End If
    
    'ö³ëï³ïÃÕÃÇ ÏñÏÝ³ÏÇ Ùáõïù³·ñáõÙ
    inspDocVerify = PaySys_Verify_Doc_In_InspecdetDoc_Folder(recAcc, Null)
    If Not inspDocVerify Then
        Log.Error("Wrong double input values ")
    End If
    
    'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ
    Login("VERIFIER")
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
    docExist = Online_PaySys_Check_Doc_In_Verifier(docNumber, data, data)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & " doesn't exist in 1st verify documents")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ 1-ÇÝ  Ñ³ëï³ïáÕÇ ÏáÕÙÇó
    Call PaySys_Verify(True)
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 2-ñ¹ Ñ³ëï³ïáÕÇ Ùáï
    Login("VERIFIER2")
    docExist = PaySys_Check_Doc_In_Verifier(docNumber, data, data, "|Ð³ëï³ïáÕ II ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    If Not docExist Then
        Log.Error("The document with number " & docNumber & "doesn't exist in 2nd verify documents")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ Ù»ñÅáõÙ 2-ñ¹ Ñ³ëï³ïáÕÇ ÏáÕÙÇó
    Call PaySys_Verify(False)
    
    Login("ARMSOFT")
    Call ChangeWorkspace(c_ExternalTransfers)
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ Ñ³ßí³éÙ³Ý »ÝÃ³Ï³ ëï³óí³Í Ñ³ÝÓÝ³ñ³ñ·ñ»ñÇ ÃÕÃ³å³Ý³ÏáõÙ
    docExist = Check_Doc_In_UnderRegistration_Folder (docNumber, data, data)
    If docExist = False Then
        Log.Error("Document with specified ID " & docNumber & "doesn't exists in under registration folder")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ í»ñëïáõ·Ù³Ý
    Call PaySys_Send_To_CheckUp()
    Call ClickCmdButton(5, "²Ûá")
    
    Login("DOUBLEINPUTOPERATOR")
    docExist = PaySys_Check_Doc_In_InspecdetDoc_Folder(docNumber)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & "doesn't exist in inspected documents folder")
        Exit Sub
    End If
    
    'ö³ëï³ïÃÕÃÇ ÏñÏÝ³ÏÇ Ùáõïù³·ñáõÙ
    inspDocVerify = PaySys_Verify_Doc_In_InspecdetDoc_Folder(recAcc, Null)
    If Not inspDocVerify Then
        Log.Error("Wrong double input values ")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
    Login("VERIFIER")
    docExist = Online_PaySys_Check_Doc_In_Verifier(docNumber, data, data)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & " must exist in 1st verify documents")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ 1-ÇÝ  Ñ³ëï³ïáÕÇ ÏáÕÙÇó
    Call PaySys_Verify(True)
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 2-ñ¹ Ñ³ëï³ïáÕÇ Ùáï
    Login("VERIFIER2")
    docExist = PaySys_Check_Doc_In_Verifier(docNumber, data, data, "|Ð³ëï³ïáÕ II ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    If Not docExist Then
        Log.Error("The document with number " & docNumber & "doesn't exist in 2nd verify documents")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ Ù»ñÅáõÙ 2-ñ¹ Ñ³ëï³áïÕÇ ÏáÕÙÇó
    Call PaySys_Verify(True)
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 3-ñ¹ Ñ³ëï³ïáÕÇ Ùáï
    Login("VERIFIER3")
    docExist = PaySys_Check_Doc_In_Verifier(docNumber, data, data, "|Ð³ëï³ïáÕ III ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    If Not docExist Then
        Log.Error("The document with number " & docNumber & "doesn't exist in 2nd verify documents")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ Ñ³ëï³ïáõÙ 3-ñ¹ Ñ³ëï³áïÕÇ ÏáÕÙÇó
    Call PaySys_Verify(True)
    
    Login("ARMSOFT")
    '²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ Ñ³ßí³éí³Í ëï³óí³Í ÷áË³ÝóáõÙÝ»ñ ÃÕÃ³å³Ý³ÏáõÙ Ñ³ÝÓÝ³ñ³ñ³·ñÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
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
        Log.Error("After fadeing documnent from registered payment orders folder  " & docNumber & " must exist in transit folder " )
    Else
        'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ù³ëÝ³ÏÇ ËÙµ³·ñÙ³Ý
        Call PaySys_SendTo_Partial_Edit()
    End If
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ Ø³ëÝ³ÏÇ ËÙµ³·ñíáÕ Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ ÃÕÃ³å³Ý³ÏáõÙ
    docExist = Check_Doc_In_Partial_Edit_Folder(docNumber, data, data)
    If Not docExist Then
        Log.Error("After sending to partial edit from transit folder the documnent with number " & docNumber & " must exist in partial editing folder " )
    Else
        'ö³ëï³ÃÕÃÇ Ñ»é³óáõÙ
        Call Paysys_Delete_Doc(False)
    End If
    
    'Test CleanUp 
    Call Close_AsBank()
End Sub