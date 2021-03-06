Option Explicit
'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT International_PayOrder_ConfirmPhases_Library
'USEUNIT Constants

'Test Case ID 165479

Sub International_Payment_Order_Pass_Test()
    
    Dim fDATE, startDATE , data , office, department, department1, docNumber, clTrans, res, payerInfo, payerAcc, payer, payerAddr
    Dim recdataType, IBAN, country, acc, recAcc, receiver, recCountry, recAddr, summa, curr, paycorrBank , paycorrAcc, medBankDataType
    Dim medBank, medBankAcc, recOrgDataType, recOrg, recOrgAcc, fISN, confInput, confPath, docExist, isDel, rCount, inspDocVerify, aim
    
    data = "211217"
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20030101"
    fDATE = "20250101"
    confPath = "X:\Testing\International_PayOrder_Confirmphases\IntPayOrder_Phases_Pass_Conditions.txt"
    data = "220617"
    office = Null
    department = "1"
    clTrans = Null
    res = Null
    payerInfo = Null
    payerAcc = "77700/000001100"
    payer = Null
    payerAddr = Null
    recdataType = Null
    IBAN = False                                            
    country = Null
    acc = Null
    recAcc = "10300/4200012    "
    receiver = "Mijazgayinyan Stacox"
    recCountry = Null
    recAddr = Null
    summa = "250000"
    curr = Null
    paycorrBank = Null
    paycorrAcc = Null
    medBankDataType = Null
    medBank = Null
    medBankAcc = Null
    recOrgDataType = Null
    recOrg = Null
    recOrgAcc = Null
     aim = "Poxancum"
    
    'Test StartUp 
    Call Initialize_AsBank("bank", startDATE, fDATE)
    Call ChangeWorkspace(c_Admin)
    
    'Î³ñ·³íáñáõÙÝ»ñÇ Ý»ñÙáõÍáõÙ
    confInput = Input_Config(confPath)
    If Not confInput Then
        Log.Error("The configuration doesn't input")
    End If
    
    Call ChangeWorkspace(c_CustomerService)
    'ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ·ñÇ ëï»ÕÍáõÙ
    Call Online_PaySys_Go_To_Agr_WorkPapers("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ", data, data)
    
    Call International_PayOrder_Send_Fill(office, department, docNumber, data, clTrans, res, payerInfo, payerAcc, payer, payerAddr, _
                                          recdataType, IBAN, country, acc, recAcc, receiver, recCountry, recAddr, summa, curr, paycorrBank , paycorrAcc, medBankDataType, _
                                          medBank, medBankAcc, recOrgDataType, recOrg, recOrgAcc,aim,fISN)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("FrmSpr").Close
    Log.Message(docNumber)
    
    'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendToDoubleInput)
    BuiltIn.Delay(1000)
    Call ClickCmdButton(5, "²Ûá")
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
        
    Login("DOUBLEINPUTOPERATOR")
    docExist = PaySys_Check_Doc_In_InspecdetDoc_Folder(docNumber)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & "doesn't exist in inspected documents folder")
        Exit Sub
    End If
    
    'ö³ëï³ïÃÕÃÇ ÏñÏÝ³ÏÇ Ùáõïù³·ñáõÙ
    inspDocVerify = PaySys_Verify_Doc_In_InspecdetDoc_Folder(Null, summa)
    If Not inspDocVerify Then
        Log.Error("Wrong double input values ")
    End If
    
    Login("VERIFIER")
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
    docExist = Online_PaySys_Check_Doc_In_Verifier(docNumber, data, data)
    If docExist Then
        Log.Error("The document with number " & docNumber & " mustn't exist in 1st verify documents")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 2-ñ¹ Ñ³ëï³ïáÕÇ Ùáï
    Login("VERIFIER2")
    docExist = PaySys_Check_Doc_In_Verifier(docNumber, data, data, "|Ð³ëï³ïáÕ II ²Þî|Ð³ëï³ïíáÕ í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    If Not docExist Then
        Log.Error("The document with number " & docNumber & "doesn't exist in 2nd verify documents")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ 2-ñ¹ Ñ³ëï³ïáÕÇ ÏáÕÙÇó
    Call PaySys_Verify(True)
    
    Login("ARMSOFT")

    '²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñáõÙ Ñ³ÝÓÝ³ñ³ñ·ñÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
    Call ChangeWorkspace(c_ExternalTransfers)
    docExist = PaySys_Check_Doc_In_ExternalTransfer_Folder(data, data , docNumber)
    If docExist Then
        Log.Error("The document with number " & docNumber & " mustn't exist in external transfers folder")
        Exit Sub
    End If
    
    Login("SWIFT")
    'ö³ëï³ïÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ BankMail-Ç áõÕ³ñÏí»Õ ÷áË³ÝóáõÙÝ»ñ ÃÕÃ³å³Ý³ÏáõÙ
    docExist = PaySys_Check_Doc_In_SWIFT_Folder(data, data , fISN)
    If Not docExist Then
        Log.Error("The document with ISN " & fISN & " must exsits in sending SWIFT folder")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ Ñ»é³óáõÙ
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