'USEUNIT Library_Common
'USEUNIT Library_CheckDB
'USEUNIT Mortgage_Library
'USEUNIT Credit_Mortgage_Connection_Check_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Payment_Except_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Loan_Agreements_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Constants

'Test Case  165066

Sub Credit_Mortgage_Connection_Check_Test1()
    
    Dim startDATE, fDATE
    Dim pType, pNumber, cliCode, mortName, fillGrid, sDate, fBASE, docNumber
    Dim mortCurr , mortSumma, mortCount , mortComment , queryString,mortageItemNew, MortSubject
    
    Utilities.ShortDateFormat = "yyyymmdd"
    agrType = "¶ñ³í(³ÛÉ)"
    cliCode = "00034851"
    fillGrid = False
    mortCurr = "000"
    MortSubject = 0
    CurrentDate = aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d%m%y")
    startDATE = "20030101"
    fDATE = "20250101"
    
    'Test StartUp 
    Call Initialize_AsBank("bank", startDATE, fDATE)
    Login ("MORTGAGEOPERATOR")
    Call Create_Connection()
    
    Call Initialize_Arrays(6, 6, 4, 6)
    loanAgrNum(1) = "V-002520"
    loanAgrNum(2) = "V-002521"
    loanAgrNum(3) = "V-002522"
    loanAgrNum(4) = "V-002523"
    loanAgrNum(5) = "V-002524"
    loanAgrNum(6) = "V-002525"
    
    partnerCode(1) = "00000008"
    partnerCode(2) = "00000009"
    partnerCode(3) = "00000010"
    partnerCode(4) = "00034853"
    mortageItemNew = "0"
    
    'êï»ÕÍ»É Ýáñ å³ÛÙ³Ý³·Çñ
    Call Mortgage_Doc_Fill(agrType , pType, pNumber, cliCode, mortName, fillGrid, _
                            loanAgrType , loanAgrClient , loanAgrNum, mortCurr , mortSumma, mortCount , mortComment, _
                            sDate, fBASE, docNumber,mortageItemNew, MortSubject)
    
    queryString = "SELECT COUNT(*) FROM DOCS WHERE fBODY LIKE '%" & docNumber & "%' and fSTATE='1' and fNAME='N1Mort' "
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Call Log_Error_My()
        Log.Error "Querystring = " & queryString & ":  Expected result = " & sql_Value , "", pmNormal, attr
    End If
    BuiltIn.Delay(delay_small)
    
    queryString = "SELECT COUNT(*) FROM FOLDERS WHERE fISN= '" & fBASE & "'"
    sql_Value = 8
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Call Log_Error_My()
        Log.Error "Querystring = " & queryString & ":  Expected result = " & sql_Value , "", pmNormal, attr
    End If
    
    '²é³ñÏ³ÛÇ µ³óáõÙ
    Call Create_New_Object_Other(5 , 100)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    Login ("ARMSOFT")
    Call ChangeWorkspace(c_Loans)
    
    '"´³ñ¹ í³ñÏ "  í³ñÏÇ Ï³å³ÏóáõÙ "ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)" ²Þî-Ç "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏÇó
    docExist = Contracts_Filter_Fill("2", loanAgrNum(1), "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Call Log_Error_My()
        Log.Error "Querystring = " & queryString & ":  Expected result = " & sql_Value , "", pmNormal, attr
    End If
    
    Call Add_Relation_From_Loan(docNumber)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    '"´³ñ¹ í³ñÏ (·Í³ÛÇÝ)" í³ñÏÇ Ï³å³ÏóáõÙ "ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)" ²Þî-Ç "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏÇó
    docExist = Contracts_Filter_Fill("2", loanAgrNum(2), "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Call Log_Error_My()
        Log.Error "The document doesn't exist in payments folder " , "", pmNormal, attr
        Exit Sub
    End If
    
    Call Add_Relation_From_Loan(docNumber)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    '"¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ" í³ñÏÇ Ï³å³ÏóáõÙ "ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)" ²Þî-Ç "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏÇó
    docExist = Contracts_Filter_Fill("2", loanAgrNum(3), "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Call Log_Error_My()
        Log.Error "The document doesn't exist in payments folder " , "", pmNormal, attr
        Exit Sub
    End If
    
    Call Add_Relation_From_Loan(docNumber)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    '"¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ(·Í³ÛÇÝ)" í³ñÏÇ Ï³å³ÏóáõÙ "ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)" ²Þî-Ç "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏÇó
    docExist = Contracts_Filter_Fill("2", loanAgrNum(4), "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Call Log_Error_My()
        Log.Error "The document doesn't exist in payments folder " , "", pmNormal, attr
        Exit Sub
    End If
    
    Call Add_Relation_From_Loan(docNumber)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
     
    '"ØÇ³Ý·³ÙÛ³ í³ñÏ" í³ñÏÇ Ï³å³ÏóáõÙ "ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)" ²Þî-Ç "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏÇó
    docExist = Contracts_Filter_Fill("2", loanAgrNum(5), "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Call Log_Error_My()
        Log.Error "The document doesn't exist in payments folder " , "", pmNormal, attr
        Exit Sub
    End If
    
    Call Add_Relation_From_Loan(docNumber)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    '"ì³ñÏ³ÛÇÝ ·ÇÍ" í³ñÏÇ Ï³å³ÏóáõÙ "ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)" ²Þî-Ç "ä³ÛÙ³Ý³·ñ»ñ" ÃÕÃ³å³Ý³ÏÇó
    docExist = Contracts_Filter_Fill("2", loanAgrNum(6), "|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    If Not docExist Then
        Call Log_Error_My()
        Log.Error "The document doesn't exist in payments folder ", "", pmNormal, attr
        Exit Sub
    End If
    
    Call Add_Relation_From_Loan(docNumber)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    '²ÝóáõÙ ¹»åÇ  "êï³óí³Í ·ñ³í" ²Þî -Ç "ä³ÛÙ³Ý³·ñ»ñÇ"-Ç ÃÕÃ³å³Ý³Ï
    Call ChangeWorkspace(c_RecPledge)
    Call wTreeView.DblClickItem("|êï³óí³Í ·ñ³í|²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", docNumber)
    Call Rekvizit_Fill("Dialog", 1, "General", "USER", "!" & "[End]" & "[Del]")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    'ä³ÛÙ³Ý³·ÇñÁ áõÕ³ñÏ»É Ñ³ëï³ïÙ³Ý
    Call PaySys_Send_To_Verify()
    
    queryString = "SELECT COUNT(fISN) FROM FOLDERS WHERE fISN= '" & fBASE & "' and fFOLDERID='SSConf.CRN1001'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Call Log_Error_My()
        Log.Error "Querystring = " & queryString & ":  Expected result = " & sql_Value , "", pmNormal, attr
    End If
    BuiltIn.Delay(delay_small)
    
    queryString = "SELECT COUNT(fISN) FROM DOCS WHERE fBODY like '%" & docNumber & "%' AND fSTATE='101'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Call Log_Error_My()
        Log.Error "Querystring = " & queryString & ":  Expected result = " & sql_Value , "", pmNormal, attr
    End If
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    '²ÝóáõÙ ¹»åÇ  "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I"-Ç ÃÕÃ³å³Ý³Ï
    FolderName = "|êï³óí³Í ·ñ³í|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I"
    Call GoTo_Folders(FolderName, docNumber)
    
    'ä³ÛÙ³Ý³·ñÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ  "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I"-Ç ÃÕÃ³å³Ý³ÏáõÙ
    ColNum = 2
    Is_Exist = False
    Is_Exist = Is_Agr_Exist(docNumber, ColNum)
    If Is_Exist Then
        TextMSG = "Agreement  is Exist in the Verifier's Folder " & docNumber
        Call Log_Print_My()
        Log.Message TextMSG , "", pmNormal, attr
    Else
        TextMSG = "Agreement  is'n Exist in the Verifier's Folder "
        Call Log_Error_My()
        Log.Error TextMSG , "", pmNormal, attr
    End If
    
    'ä³ÛÙ³Ý³·ñÇ Ñ³ëï³ïáõÙ
    Call PaySys_Verify(True)
    
    queryString = "SELECT COUNT(fBASE) FROM LINKEDAGRS WHERE fMORTISN= '" & fBASE & "'"
    sql_Value = 6
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Call Log_Error_My()
        Log.Error "Querystring = " & queryString & ":  Expected result = " & sql_Value , "", pmNormal, attr
    End If
    
    queryString = "SELECT COUNT(fISN) from FOLDERS WHERE fISN='" & fBASE & "' and fFOLDERID='NADDITINFO'"
    sql_Value = 1
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Call Log_Error_My()
        Log.Error "Querystring = " & queryString & ":  Expected result = " & sql_Value , "", pmNormal, attr
    End If
    
    BuiltIn.Delay(delay_small)
    queryString = "SELECT COUNT(fISN) FROM DOCS WHERE fBODY LIKE '%" & docNumber & "%' and fSTATE='7'"
    sql_Value = 2
    colNum = 0
    sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
    If Not sql_isEqual Then
        Call Log_Error_My()
        Log.Error "Querystring = " & queryString & ":  Expected result = " & sql_Value , "", pmNormal, attr
    End If
    
    Call Close_AsBank()  
End Sub