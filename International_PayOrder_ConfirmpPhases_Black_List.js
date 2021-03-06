Option Explicit
'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT International_PayOrder_ConfirmPhases_Library
'USEUNIT Constants 

'Test Case ID 165475

Sub International_Payment_Order_Black_List_Test()
    BuiltIn.Delay(20000)
    
    Dim fDATE, startDATE , data , office, department, docNumber, clTrans, res, payerInfo, payerAcc, payer, payerAddr
    Dim recdataType, IBAN, country, acc, recAcc, receiver, recCountry, recAddr, summa, curr, paycorrBank , paycorrAcc, medBankDataType
    Dim medBank, medBankAcc, recOrgDataType, recOrg, recOrgAcc, fISN, confInput, confPath, docExist, isDel, rCount,aim
    
    data = "211217"
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20030101"
    fDATE = "20250101"
    confPath = "X:\Testing\International_PayOrder_Confirmphases\IntPayOrder_Phases_All_Conditions.txt"
    data = "220617"
    office = Null
    department = Null
    clTrans = Null
    res = Null
    payerInfo = Null
    payerAcc = "77700/03485190101"
    payer = Null                        
    payerAddr = Null
    recdataType = Null
    IBAN = True
    country = "CZ"
    acc = "11111111111111111111"
    recAcc = Null
    receiver = "MOUSTAFA ABBES"
    recCountry = "CZ"
    recAddr = ""
    summa = "100000"
    curr = Null
    paycorrBank = "CITIATWXXXX"
    paycorrAcc = "AT291111111111111111"
    medBankDataType = "A"
    medBank = "ABNAPLPWEQT"
    medBankAcc = Null
    recOrgDataType = "A"
    recOrg = "CZEECZPPXXX"
    recOrgAcc = "CZ5711111111111111111111"
    aim = "Poxancum"
    
    'Test StartUp 
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
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
                                          medBank, medBankAcc, recOrgDataType, recOrg, recOrgAcc,aim, fISN)
    
    Call ClickCmdButton(5, "Î³ï³ñ»É")
    
    'îå»Éáõ Ó¨ å³ïáõÑ³ÝÇ ÷³ÏáõÙ
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("FrmSpr").Close
    
    'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ñ³ëï³ïÙ³Ý ë¨ óáõó³Ï
    Call Online_PaySys_Send_To_Verify(3)
    
    'ê¨ óáõó³ÏÇó ÷³ëï³ÃÕÃÇ Ñ³ëï³ïáõÙ Ñ³ÙÁÝÏÝáõÙÝ»ñÇ Ù³ëÇÝ ÇÝýáñÙ³óÇ³Ý ëïáõ·»Éáõó Ñ»ïá
    Call ChangeWorkspace(c_BLVerifyer)
    docExist = Online_PaySys_Check_Doc_In_Black_List(docNumber)
    If docExist = False Then
        Log.Error("Document with specified ID " & docNumber & "doesn't exists in Black list folder")
        Exit Sub
    End If
    
    rCount = Online_PaySys_Check_Assertion_In_Black_List()
    If rCount <> 1 Then
        Log.Error("There must be 1 row")
        Exit Sub
    End If
    
    Call PaySys_Verify( True)
    
    'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ
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
    
    'Ð³ÝÓÝ³ñ³ñ·ñÇ áõÕ³ñÏáõÙ SWIFT µ³ÅÇÝ
    Call PaySys_Sento_Swift()
    If p1.WaitVBObject("frmAsMsgBox", 2000).Exists Then
        Call ClickCmdButton(5, "OK")
    End If
    
    Login("SWIFT")
    'ö³ëï³ïÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ SWIFT-Ç áõÕ³ñÏí»Õ ÷áË³ÝóáõÙÝ»ñ ÃÕÃ³å³Ý³ÏáõÙ
    docExist = PaySys_Check_Doc_In_SWIFT_Folder(data, data , fISN)
    If Not docExist Then
        Log.Error("The document with ISN " & fISN & " must exsits in sending BankMail folder")
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
        Call Paysys_Delete_Doc(False)
    End If
    
    'Test CleanUp
    Call Close_AsBank()
End Sub