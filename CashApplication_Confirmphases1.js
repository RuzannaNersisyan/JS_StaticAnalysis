Option Explicit
'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Currency_Exchange_Confirmphases_Library
'USEUNIT CashApplication_Confirmphases_Library
'USEUNIT Constants

'Test case ID - 165443

Sub CashApplication_Allverify_Test()
    
    Dim fDATE, startDATE , docNumber, summa, fISN, dateAcc, accCash, dateAccdata
    Dim docExist, isDel
    
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20030101"
    fDATE = "20250101"
    dateAcc = aqConvert.DateTimeToStr(aqDateTime.Today)
    accCash = "03485190101"
    summa = "250000"
    
    'Test StartUp 
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
    'ä³ñ³Ù»ïñÇ ³ñÅ»ùÇ ÷á÷áËáõÙ
    Call SetParameter("CASHREQVER", "1")
    
    Login("ARMSOFT")
    Call Online_PaySys_Go_To_Agr_WorkPapers("|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ", dateAcc, dateAcc)
    
    'Î³ÝËÇÏ³óÙ³Ý Ñ³ÛïÇ ëï»ÕÍáõÙ
    Call CashApplication_Doc_Fill(docNumber, dateAcc, accCash , summa, fISN )
    Log.Message(docNumber)
    
    'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ñ³ëï³ïÙ³Ý
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendToVer)
    BuiltIn.Delay(1000)
    Call ClickCmdButton(5, "²Ûá")
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    Login("VERIFIER")
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
    docExist = Online_PaySys_Check_Doc_In_Verifier(docNumber, dateAcc, dateAcc)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & " doesn't exist in 1st verify documents")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ Ù»ñÅáõÙ 1-ÇÝ Ñ³ëï³áïÕÇ ÏáÕÙÇó
    Call PaySys_Verify(False)
    
    'ö³ëï³ÃÕÃÇ í³í»ñ³óáõÙ ²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ ÃÕÃ³å³Ý³ÏÇó
    Login("ARMSOFT")
    Call ChangeWorkspace(c_CustomerService)
    docExist = Online_PaySys_Check_Doc_In_Workpapers(docNumber, null, Null)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & " doesn't exist in workpaper documents")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ Ñ³ëï³ïÙ³Ý
    Call PaySys_Send_To_Verify()
    
    Login("VERIFIER")
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 1-ÇÝ Ñ³ëï³ïáÕÇ Ùáï
    docExist = Online_PaySys_Check_Doc_In_Verifier(docNumber, dateAcc, dateAcc)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & " doesn't exist in 1st verify documents")
        Exit Sub
    End If
    
    'ö³ëï³ÃÕÃÇ Ñ³ëï³ïáõÙ 1-ÇÝ Ñ³ëï³áïÕÇ ÏáÕÙÇó
    Call PaySys_Verify(True)
    
    Login("ARMSOFT")
    Call ChangeWorkspace(c_CustomerService)
    'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ Üáñ ëï»ÕÍí³Í Ï³ÝËÇÏ³óÙ³Ý Ñ³Ûï»ñ ÃÕÃ³å³Ý³ÏáõÙ
    docExist = Check_Doc_In_NewCashApp_Workpaper (accCash)
    If Not docExist Then
        Log.Error("The document with number " & docNumber & " doesn't exist in workpaper documents")
        Exit Sub
    End If

    'ö³ëï³ÃÕÃÇ Ñ»é³óáõÙ
    Call Online_PaySys_Delete_Agr()
    
    'Test CleanUp
    Call Close_AsBank()
End Sub