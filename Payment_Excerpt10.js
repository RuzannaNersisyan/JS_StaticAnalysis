'USEUNIT Library_Common
'USEUNIT Payment_Except_Library

'Test Case ID 165671

Sub Factoring_Statment_Test2()
    
    Dim fDATE, startDATE , cpath, docType, docNum , sDate, eDate, savePath, fName
    Dim docExist, fIdent , fileName1 , fileName2,template
    
    fDATE = "20250101"
    startDATE = "20030101"
    cpath = "|ü³ÏïáñÇÝ·|ä³ÛÙ³Ý³·ñ»ñ"
    docType = "1"
    docNum = "ST-010"
    sDate = "17/03/11"
    eDate = "17/04/11"
    savePath = Project.Path & "Stores\Statement_Check_140414\Statement_Actual\"
    fName = "10.txt"
    fileName1 = Project.Path & "Stores\Statement_Check_140414\Statement_Actual\10.txt"
    fileName2 = Project.Path & "Stores\Statement_Check_140414\Statement_Expected\ST-010_Expected.txt"
    template = ""
    
    'Test StartUp 
    Call Initialize_AsBank("bank", startDATE, fDATE)
    Call Login("MMJPOPERATOR")
  
    docExist = Contracts_Filter_Fill(docType, docNum, cpath)
    If Not docExist Then
        Log.Error("Document with number" & docNum & "doesn't exist")
        Exit Sub
    End If
    
    docExist = View_Statment (sDate, eDate, True,template )
    If Not docExist Then
        Log.Error("Document statement doesn't exist")
        Exit Sub
    End If
    
    Call SaveDoc(savePath, fName)
    fIdent = Compare_Files(fileName1, fileName2, "")
    If Not fIdent Then
        Log.Error(fileName1 & "and" & fileName2 &" :Files are not identical" )
    End If
    
    'Test CleanUp 
    Call Close_AsBank()
End Sub