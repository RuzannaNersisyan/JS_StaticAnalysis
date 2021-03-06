Option Explicit
'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT International_PayOrder_ConfirmPhases_Library
'USEUNIT Constants

'Test Case ID 165477

Sub International_Payment_Order_AllFerify_Test()
    
    Dim fDATE, startDATE , data , office, department, docNumber, clTrans, res, payerInfo, payerAcc, payer, payerAddr
    Dim recdataType, IBAN, country, acc, recAcc, receiver, recCountry, recAddr, summa, curr, paycorrBank , paycorrAcc, medBankDataType
    Dim medBank, medBankAcc, recOrgDataType, recOrg, recOrgAcc, fISN, confInput, confPath, docExist, isDel, rCount
    Dim chargeType,chargePercent,chargeSum,tabN,Num,confPath1,confPath2,confPath3,  aim
    
    data = "211211"
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20030101"
    fDATE = "20250101"
    confPath = "X:\Testing\International_PayOrder_Confirmphases\IntPayOrderPhases_All_Verify.txt"
    confPath1 = "X:\Testing\PaymentOrder\Charge_from_bank.txt"
    confPath2 = "X:\Testing\PaymentOrder\Charge_from_bank2.txt"
    confPath3 = "X:\Testing\PaymentOrder\Charge_from_Tranfer.txt"
    data = "220612"
    office = "00"
    department = 1
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
    summa = "100000"
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
    tabN = "4"
    Num = "18"
    chargeType = "09"
    chargePercent= "8.0000"
    chargeSum ="8,000.00"
    
    'Test StartUp 
    Call Initialize_AsBank("bank", startDATE, fDATE)
    Call ChangeWorkspace(c_Admin)
    
    'Î³ñ·³íáñáõÙÝ»ñÇ Ý»ñÙáõÍáõÙ
    confInput = Input_Config(confPath)
    If Not confInput Then
        Log.Error("The configuration doesn't input")
        Exit Sub
    End If
    
    confInput = Input_Config(confPath1)
    If Not confInput Then
        Log.Error("The configuration doesn't input")
        Exit Sub
    End If
    
    confInput = Input_Config(confPath2)
    If Not confInput Then
        Log.Error("The configuration doesn't input")
        Exit Sub
    End If
    
    confInput = Input_Config(confPath3)
    If Not confInput Then
        Log.Error("The configuration doesn't input")
        Exit Sub
    End If
    
    Call ChangeWorkspace(c_CustomerService)
    'ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ·ñÇ ëï»ÕÍáõÙ
    Call Online_PaySys_Go_To_Agr_WorkPapers("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ", data, data)
    
    Call International_PayOrder_Send_Fill(office, department, docNumber, data, clTrans, res, payerInfo, payerAcc, payer, payerAddr, _
                                          recdataType, IBAN, country, acc, recAcc, receiver, recCountry, recAddr, summa, curr, paycorrBank , paycorrAcc, medBankDataType, _
                                          medBank, medBankAcc, recOrgDataType, recOrg, recOrgAcc, aim, fISN)
    
    Log.Message(fISN)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("FrmSpr").Close()
    
    'êïáõ·áõÙ ¿ áñ, ·³ÝÓÙ³Ý ï»ë³ÏÁ ×Çßï Éñ³óí³Í ÉÇÝÇ
    Call Check_Charges(docNumber,tabN,Num,chargeType,chargePercent,chargeSum)
   
     'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ
    Log.Message(docNumber)
    Log.Message(fISN)
    
    'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendToVer)
    BuiltIn.Delay(1000)
    Call ClickCmdButton(5, "²Ûá")
    
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
     
    Login("VERIFIER")
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
    docExist = Online_PaySys_Check_Doc_In_Verifier(docNumber, data, data)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & " doesn't exist in 1st verify documents")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ 1-ÇÝ Ñ³ëï³áïÕÇ ÏáÕÙÇó
    Call PaySys_Verify(True)
    
    Login("ARMSOFT")    
    '²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñáõÙ Ñ³ÝÓÝ³ñ³ñ·ñÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
    Call ChangeWorkspace(c_ExternalTransfers)
    docExist = PaySys_Check_Doc_In_ExternalTransfer_Folder(data, data , docNumber)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & " must exist in external transfers folder")
        Exit Sub
    End If
    
    'Ð³ÝÓÝ³ñ³ñ·ñÇ áõÕ³ñÏáõÙ BankMail µ³ÅÇÝ
    Call PaySys_Sento_SWIFT()
    If p1.WaitVBObject("frmAsMsgBox", 2000).Exists Then
        Call ClickCmdButton(5, "OK")
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
    
    'Test ClearUp
    Call Close_AsBank()
End Sub