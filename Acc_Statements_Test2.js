'USEUNIT Library_Common
'USEUNIT Acc_Statements_Library
'USEUNIT Payment_Except_Library    

'Test case ID 165656

Sub AccUSD_Statement_Test()

    Dim fDATE, startDATE , cpath,  accNumber , sDate, eDate, savePath, fName
    Dim docExist, fIdent , fileName1 , fileName2,template
    
    fDATE = "20250101"
    startDATE = "20030101"
    accNumber = "00100690101 "
    sDate = "06/06/11"
    eDate = "06/08/11"
    savePath = "\\host2\Sys\Testing\Statement_Check_140414\Acc_Statement_Actual\"
    fName = "2.txt"
    fileName1 = "\\host2\Sys\Testing\Statement_Check_140414\Acc_Statement_Actual\2.txt"
    fileName2 = "\\host2\Sys\Testing\Statement_Check_140414\Acc_Statement_Expected\ExpectedUSD.txt"
    template = ""
    
    'Test StartUp 
    Call Initialize_AsBank("bank", startDATE, fDATE)
    Login("ARMSOFT")
    
    Call Go_To_Acc(accNumber)       
    
    'ø³Õí³ÍùÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ 
    docExist = View_ACC_Statment (sDate, eDate,template)
    If Not docExist Then
        Log.Error("Document statement doesn't exist")
        Exit Sub
    End If
    
    'ø³Õí³ÍùÇ å³ÑáõÙ
    Call SaveDoc(savePath, fName)
    
    'êå³ëíáÕ ¨ ³éÏ³ ù³Õí³ÍùÝ»ñÇ Ñ³Ù»Ù³ïáõÙ 
    fIdent = Compare_Files(fileName1, fileName2, "")
    If Not fIdent Then
        Log.Error(fileName1 & "and" & fileName2 &" :Files are not identical" )
    End If
    
    'Test CleanUp 
    Call Close_AsBank()
End Sub