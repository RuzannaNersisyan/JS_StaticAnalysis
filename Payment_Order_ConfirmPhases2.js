Option Explicit
'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Constants

'Test Case ID 165621

Sub Payment_Order_Pass_Test()
    BuiltIn.Delay(20000)
    
    Dim fDATE, startDATE , data , office, department, docNumber, accDeb, acDBValue, chart, balAcc, accMask, accCur, accType, clientName, client
    Dim note1, note2, note3, branch, depart, acsType, cardNum, payer, epayer, taxCod , socCard, accCredit
    Dim receiver, eReceiver, summa, curr, aim , fISN, confInput, confPath, docExist, isDel, inspDocVerify
    Dim chargeType,chargePercent,chargeSum,tabN,Num,confPath1,confPath2,confPath3
    
    data = "211217"
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20030101"
    fDATE = "20250101"
    confPath = "X:\Testing\Order confirm phases\pass_New.txt"
    confPath1 = "X:\Testing\PaymentOrder\Charge_from_bank.txt"
    confPath2 = "X:\Testing\PaymentOrder\Charge_from_bank2.txt"
    confPath3 = "X:\Testing\PaymentOrder\Charge_from_Tranfer.txt"
    data = "220617"
    office = "00"
    department = 1
    accDeb = False
    acDBValue = "77700/000001100"
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
    receiver = "Petrosyan Petros"
    eReceiver = Null
    summa = "250000"
    curr = "000"
    aim = "Shrajcelu npatakov"
    chargeType = "09"
    chargePercent = "3.2000"
    chargeSum = "8,000.00"
    tabN = "3"
    Num = "12"
    
    'Test StartUp 
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
    'Î³ñ·³íáñáõÙÝ»ñÇ Ý»ñÙáõÍáõÙ
    confInput = Input_Config(confPath)
    If Not confInput Then
        Log.Error("The configuration doesn't input")
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
    Call PayOrder_Send_Fill(office, department, docNumber, data, accDeb, acDBValue, chart, balAcc, accMask, accCur, accType, clientName, client, _
                            note1, note2, note3, branch, depart, acsType, cardNum, payer, epayer, taxCod , socCard, accCredit, _
                            receiver, eReceiver, summa, curr, aim , fISN)
    
    'êïáõ·áõÙ ¿ áñ, ·³ÝÓÙ³Ý ï»ë³ÏÁ ×Çßï Éñ³óí³Í ÉÇÝÇ
    Call Check_Charges(docNumber,tabN,Num,chargeType,chargePercent,chargeSum)
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
'        Exit Sub
    End If
    
    'ö³ëï³ïÃÕÃÇ ÏñÏÝ³ÏÇ Ùáõïù³·ñáõÙ
    inspDocVerify = PaySys_Verify_Doc_In_InspecdetDoc_Folder(accCredit, summa)
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
    'ö³ëï³ïÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ BankMail-Ç áõÕ³ñÏí»Õ ÷áË³ÝóáõÙÝ»ñ ÃÕÃ³å³Ý³ÏáõÙ
    docExist = PaySys_Check_Doc_In_BankMail_Folder(data, data , fISN)
    If Not docExist Then
        Log.Error("The document with ISN " & fISN & " must exsits in sending BankMail folder")
        Exit Sub
    End If
    '
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