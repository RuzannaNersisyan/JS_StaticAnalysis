Option Explicit
'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Constants

'Test Case ID 165623

Sub Payment_Order_DifferConditions_Test()
    Dim fDATE, startDATE , data , office, department, department1, docNumber, accDeb, acDBValue, chart, balAcc, accMask, accCur, accType, clientName, client
    Dim note1, note2, note3, branch, depart, acsType, cardNum, payer, epayer, taxCod , socCard, accCredit
    Dim receiver, eReceiver, summa, curr, aim , fISN, confInput, confPath, docExist, isDel
    
    data = "211217"
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20030101"
    fDATE = "20250101"
    confPath = "X:\Testing\Order confirm phases\differentconditions_New.txt"
    data = "220617"                   
    office = "00"
    department = "1"
    accDeb = False
    acDBValue = "77700/000001101"
    chart = Null
    balAcc = "10"
    accMask = Null
    accCur = Null
    accType = Null
    clientName = Null
    client = Null
    note1 = Null
    note2 = Null
    note3 = Null
    branch = Null
    depart = Null
    acsType = Null
    cardNum = Null
    payer = "Petrosyan Petr"
    epayer = Null
    taxCod = Null
    socCard = Null
    accCredit = "10300/4200012    "
    receiver = "Petrosyan Petr"
    eReceiver = Null
    summa = "1000"
    curr = "000"
    aim = "Nuyn hastatox tarber payman"
    department1 = "2"
    
    'Test StartUp 
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
    'Î³ñ·³íáñáõÙÝ»ñÇ Ý»ñÙáõÍáõÙ
    confInput = Input_Config(confPath)
    If Not confInput Then
        Log.Error("The configuration doesn't input")
    End If
    
    Call ChangeWorkspace(c_CustomerService)
    Call Online_PaySys_Go_To_Agr_WorkPapers("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ", data, data)
    '1-ÇÝ ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ·ñÇ ëï»ÕÍáõÙ
    Call PayOrder_Send_Fill(office, department, docNumber, data, accDeb, acDBValue, chart, balAcc, accMask, accCur, accType, clientName, client, _
                            note1, note2, note3, branch, depart, acsType, cardNum, payer, epayer, taxCod , socCard, accCredit, _
                            receiver, eReceiver, summa, curr, aim , fISN)
                            
    'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendToVer)
    BuiltIn.Delay(1000)
    Call ClickCmdButton(5, "²Ûá")
    wMDIClient.vbObject("frmPttel").Close()
    
    Login("VERIFIER")
    '1-ÇÝ ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
    docExist = Online_PaySys_Check_Doc_In_Verifier(docNumber, data, data)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & " doesn't exist in 1st verify documents")
        Exit Sub
    End If
    
    '1-ÇÝ ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ ÏáÕÙÇó
    Call PaySys_Verify(True)
    
'    Login("ARMSOFT")
'    Call ChangeWorkspace(c_CustomerService)
'    '²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñáõÙ Ñ³ÝÓÝ³ñ³ñ·ñÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
'    docExist = Online_PaySys_Check_Doc_In_Workpapers(docNumber, data, data)
'    If Not docExist Then
'        Log.Error("The document with number " & docNumber & " doesn't exist in workpapers folder")
'        Exit Sub
'    End If
'    'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ñ³ëï³ïÙ³Ý
'    Call PaySys_Verify(True)
    
    Login("BANKMAIL")
    '1-ÇÝ ö³ëï³ïÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ BankMail-Ç áõÕ³ñÏí»Õ ÷áË³ÝóáõÙÝ»ñ ÃÕÃ³å³Ý³ÏáõÙ
    docExist = PaySys_Check_Doc_In_BankMail_Folder(data, data , fISN)
    If Not docExist Then
        Log.Error("The document with ISN " & fISN & " mustn't exsits in sending BankMail folder")
        Exit Sub
    End If
    
    '1-ÇÝ ö³ëï³ÃÕÃÇ Ñ»é³óáõÙ
    Call Paysys_Delete_Doc(False)
    Login("ARMSOFT")
    Call ChangeWorkspace(c_ExternalTransfers)
    docExist = PaySys_Check_Doc_In_ExternalTransfer_Folder(data, data , docNumber)
    If Not docExist Then
        isDel = False
        Log.Error("After deleteing in BankMail the document with number " & docNumber & " must exist in external transfers folder " )
    Else
        Call PaySys_SendTo_Partial_Edit()
    End If
    Login("OPERATOR")
    
    docExist = Online_PaySys_Check_Doc_In_Workpapers(docNumber, data, data)
    If Not docExist Then
        isDel = False
        Log.Error("After deleteing in external transfers folder the document with number " & docNumber & " must exist in workpapers " )
    Else
        Call Paysys_Delete_Doc(True)
    End If
    
    Login("ARMSOFT")
    Call ChangeWorkspace(c_CustomerService)
    Call Online_PaySys_Go_To_Agr_WorkPapers("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ", data, data)
    '2-ñ¹ ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ·ñÇ ëï»ÕÍáõÙ
    Call PayOrder_Send_Fill(office, department1, docNumber, data, accDeb, acDBValue, chart, balAcc, accMask, accCur, accType, clientName, client, _
                            note1, note2, note3, branch, depart, acsType, cardNum, payer, epayer, taxCod , socCard, accCredit, _
                            receiver, eReceiver, summa, curr, aim , fISN)
                            
    'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendToVer)
    BuiltIn.Delay(1000)
    Call ClickCmdButton(5, "²Ûá")
    wMDIClient.vbObject("frmPttel").Close()    
    
    Login("VERIFIER")
    '2-ñ¹ ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
    docExist = Online_PaySys_Check_Doc_In_Verifier(docNumber, data, data)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & " doesn't exist in 1st verify documents")
        Exit Sub
    End If
    
    '2-ñ¹  ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ ÏáÕÙÇó
    Call PaySys_Verify(True)
'    
'    Login("ARMSOFT")
'    Call ChangeWorkspace(c_CustomerService)
'    '²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñáõÙ Ñ³ÝÓÝ³ñ³ñ·ñÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
'    docExist = Online_PaySys_Check_Doc_In_Workpapers(docNumber, data, data)
'    If Not docExist Then
'        Log.Error("The document with number " & docNumber & " doesn't exist in workpapers folder")
'        Exit Sub
'    End If
'    'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ñ³ëï³ïÙ³Ý
'    Call PaySys_Verify(True)
'    
    Login("BANKMAIL")
    '2-ñ¹ ö³ëï³ïÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ BankMail-Ç áõÕ³ñÏí»Õ ÷áË³ÝóáõÙÝ»ñ ÃÕÃ³å³Ý³ÏáõÙ
    docExist = PaySys_Check_Doc_In_BankMail_Folder(data, data , fISN)
    If Not docExist Then
        Log.Error("The document with ISN " & fISN & " mustn't exsits in sending BankMail folder")
        Exit Sub
    End If
    
    '2-ñ¹ ö³ëï³ÃÕÃÇ Ñ»é³óáõÙ
    Call Paysys_Delete_Doc(False)
    Login("ARMSOFT")
    Call ChangeWorkspace(c_ExternalTransfers)
    docExist = PaySys_Check_Doc_In_ExternalTransfer_Folder(data, data , docNumber)
    If Not docExist Then
        isDel = False
        Log.Error("After deleteing in BankMail the document with number " & docNumber & " must exist in external transfers folder " )
    Else
        Call PaySys_SendTo_Partial_Edit()
    End If
    
    Login("OPERATOR")
    docExist = Online_PaySys_Check_Doc_In_Workpapers(docNumber, data, data)
    If Not docExist Then
        isDel = False
        Log.Error("After deleteing in external transfers folder the document with number " & docNumber & " must exist in workpapers " )
    Else
        Call Paysys_Delete_Doc(True)
    End If
    
    'Test CleanUp
    Call Close_AsBank()
End Sub