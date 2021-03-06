'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Common
'USEUNIT Acc_Statements_Library
'USEUNIT Payment_Except_Library
'USEUNIT Constants

'Test case Id 165861

Sub Payment_Excerpt_Acc_Test()

    Dim fDATE, startDATE , cpath,  accNumber , sDate, eDate, savePath, fName
    Dim docExist, fIdent , fileName1 , fileName2,template,isExists,param
    
    fDATE = "20260101"
    startDATE = "20110101"
    accNumber = "33120090101"
    sDate = "14/01/11"     
    eDate = "14/06/11"
    template = "AccStateCB_AS\7"
       
    'Կատարում է ստուգում,եթե նման անունով ֆայլ կա տրված թղթապանակում ,ջնջում է
    isExists = aqFile.Exists(Project.Path& "Stores\Payment_Excerpt_htm_Templates\acc.txt")
    If isExists Then
      aqFileSystem.DeleteFile(Project.Path& "Stores\Payment_Excerpt_htm_Templates\acc.txt")
    End If

    
    'Test StartUp start
    Call Initialize_AsBank("bank", startDATE, fDATE)
    Login("ARMSOFT")
    'Test StartUp end 
    Call ChangeWorkspace(c_Admin)
    Call Go_To_Acc(accNumber)      
    
    'Քաղվածքի առկայության ստուգում 
    docExist = View_ACC_Statment(sDate, eDate,template)
    If Not docExist Then
        Log.Error("Document statement doesn't exist")
        Exit Sub
    End If
    
    BuiltIn.Delay(18000)
    fileName = ListFiles("C:\Users\"& Sys.UserName & "\AppData\Local\Temp\AS-BANK")
    fileName1 = "C:\Users\"& Sys.UserName & "\AppData\Local\Temp\AS-BANK\" & Trim(fileName)
    fileName2 = Project.Path & "Stores\Payment_Excerpt_htm_Templates\accReal.txt"
    Log.Message(fileName1)
    toFile = Project.Path & "Stores\Payment_Excerpt_htm_Templates\acc.txt"
    Call Read_Write_File(fileName1, toFile)
    BuiltIn.Delay(2000)
    
    param =     "<[/]span><span>(0[1-9]|[1-2][0-9]|3[0-1]).(0[1-9]|1[0-2]).[0-9]{4}<[/]span>, <span>(2[0-3]|[01][0-9]):[0-5][0-9]<[/]span>"
    Call Compare_Files(fileName2, toFile,param)
    
    Call Close_AsBank()
    
End Sub