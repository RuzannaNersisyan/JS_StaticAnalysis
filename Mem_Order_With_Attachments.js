'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Mem_Order_Library
'USEUNIT Library_Colour
'USEUNIT Library_CheckDB
'USEUNIT Attach_File_Library
'USEUNIT DAHK_Library_Filter
'USEUNIT Library_Contracts
'USEUNIT Main_Accountant_Filter_Library
'USEUNIT Percentage_Calculation_Filter_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT OLAP_Library

Option Explicit
'Test Case ID- 181401

Dim dbFOLDERS(3)
Sub Mem_Order_Attachments_Test()      

    Dim sDATE, eDATE, memorder, tday, filepath, todaySlash, AsAtachments, fileName, resultWorksheet
    Dim docpath, cAccIsn, dAccIsn, tdaySql, fBODY, workingDocs, folderDirect, saveFilePath, saveWindow
    'Մուտք գործել ծրագիր ARMSOFT օգտագործողով
    sDate = "20050101"
    eDate = "20250101"

    tday = aqConvert.DateTimeToStr(aqDateTime.Today)
    tdaySql = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"20%y%m%d")
    Set memorder = New_Memorder()
    With memorder  
        .Div = "00"
        .Dep = "1"
        .MDate = tday
        .AccD = "000004502  "
        .AccC = "000006002  "
        .Curr = "002"
        .Sum = "12,772,533,943.00"
        .Aim = "^[Down][Down][Enter]"
        .paysys = "1"
    End With 
     
    todaySlash = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")    
    Call Initialize_AsBank("bank", sDATE, eDATE)
    cAccIsn = GetAccountISN(memorder.AccC)
    dAccIsn = GetAccountISN(memorder.AccD)
    
    Call Login ("ARMSOFT")
    'Անցնել Հաշվապահության ԱՇՏ
    Call ChangeWorkspace(c_Accountant)
   
    Log.Message "Ստեղծել հիշարար օրդեր",,,MessageColor
    'Ստեղծել Հիշարար օրդեր
    Call wTreeview.DblclickItem("|Ð³ßí³å³ÑáõÃÛ³Ý ²Þî|ÐÇß³ñ³ñ ûñ¹»ñ")
    BuiltIn.Delay(2000)
    Call Fill_Memorder(memorder)
    filePath = Project.Path & "Stores\MemorialOrder\ForTest50digit50characterscharacterscharacter.xlsx"
    fileName = "ForTest50digit50characterscharacterscharacter.xlsx"
    'Կցել ֆայլ հիշարար օրդերին
    Call Attach_File_ToDoc(filePath, 2, fileName)
    Call ClickCmdButton(1,"Î³ï³ñ»É")
    
    'SQL
    Log.Message "'SQL Ստուգումներ հիշարար օրդեր ստեղծելուց և ֆայլ կցելուց հետո",,,SqlDivideColor
    Call Intitialize_DB_Memorder (memorder.Isn, memorder.DocN)
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",memorder.Isn,2)
    Call CheckDB_DOCLOG(memorder.Isn,"77","C","10"," ",1)
    Call CheckDB_DOCLOG(memorder.Isn,"77","N","1"," ",1)
    'DOCS                                       
    fBODY = "  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
            & "USERID:  77  ACSBRANCH:00  ACSDEPART:1  DOCNUM:" & memorder.DocN & "  DATE:" & tdaySql & "  ACCDB:000004502  ACCCR:000006002  CUR:002  "_
            & "SUMMA:12772533943  AIM:Ð³Ù³Ó³ÛÝ Ã. Ñ³ßíÇ  PAYSYSIN:1  USEOVERLIMIT:0  NOTSENDABLECR:0  NOTSENDABLEDB:0  SBQENABLED:1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",memorder.Isn,1)
    Call CheckDB_DOCS(memorder.Isn,"MemOrd  ","10",fBODY,1)
    'FOLDERS
    Call CheckQueryRowCount("FOLDERS","fISN",memorder.Isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    'HI
    Call Check_HI_CE_accounting (tdaySql,memorder.Isn, "11", cAccIsn ,"9999999999993.00", "002", "12772533943.00", "MSC", "C")
    Call Check_HI_CE_accounting (tdaySql,memorder.Isn, "11", dAccIsn ,"9999999999993.00", "002", "12772533943.00", "MSC", "D")
    Call CheckQueryRowCount("HI","fBASE",memorder.Isn,2)
    'HIREST
    Call CheckDB_HIREST("11", cAccIsn , "-9999999999993.00" ,"002", "-12772533943.00", 1)
    Call CheckDB_HIREST("11", dAccIsn , "9999999999993.00" ,"002", "12772533943.00", 1)
    'DOCSATTACH
    Call CheckDB_DOCSATTACH(memorder.Isn, fileName, 0, "", 1)
    
    'Համեմատել փաստաթղթի տպելու ձևը օրինակի հետ
    docpath =  Project.Path & "Stores\MemorialOrder\Memorder_With_Attachments_Exp.txt"
    Call Memorder_Doc_Check(docpath,1)   
    Call Close_Window(wMDIClient, "FrmSpr" )
    'Բացել Աշխատանքային փաստաթղթեր թղթապանակը
    Log.Message "Բացել Աշխատանքային փաստաթղթեր թղթապանակը",,,MessageColor
    Set workingDocs = New_MainAccWorkingDocuments()
    With workingDocs
         .startDate = tday
				     .endDate = tday
    End With
   
    Call GoTo_MainAccWorkingDocuments("|Ð³ßí³å³ÑáõÃÛ³Ý ²Þî|", workingDocs)
    
    With memorder 
        .MDate = todaySlash
        .Aim = "Ð³Ù³Ó³ÛÝ Ã. Ñ³ßíÇ"
    End With
    'Ստուգել հիշարար օրդերի առկայությունը և ճշտությունը թղթապանակում
    If SearchInPttel("frmPttel",2, memorder.DocN) Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_ToEdit)
        BuiltIn.Delay(delay_middle)

        Call Memorder_Window_Check (memorder) 
        'Ստուգել ուր ֆայլը կցված է հիշարար օրդերին
        Call SearchInAttachList(fileName,2)
        'Ջնջել ֆայլը կցված ֆայլերի ցուցակից
        Call Delete_Attached_File_Doc (fileName,2)
        'DOCSATTACH
        Call CheckDB_DOCSATTACH(memorder.Isn, fileName, 0, "", 0)
        'Կցել հղում հիշարար օրդերին
        Call Attach_Link_ToDoc (filePath, 2, "")
        Call ClickCmdButton(1,"Î³ï³ñ»É")    
    End If
    Log.Message "'SQL Ստուգումներ հղում կցելուց և ֆայլ ջնջելուց հետո",,,SqlDivideColor
    'SQL Ստուգումներ
    Call Intitialize_DB_Memorder (memorder.Isn, memorder.DocN)
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",memorder.Isn,3)
    Call CheckDB_DOCLOG(memorder.Isn,"77","C","10"," ",1)
    Call CheckDB_DOCLOG(memorder.Isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(memorder.Isn,"77","E","10"," ",1)
    'DOCS             
    fBODY = "  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
            & "USERID:  77  ACSBRANCH:00  ACSDEPART:1  DOCNUM:" & memorder.DocN & "  DATE:" & tdaySql & "  ACCDB:000004502  ACCCR:000006002  CUR:002  "_
            & "SUMMA:12772533943  AIM:Ð³Ù³Ó³ÛÝ Ã. Ñ³ßíÇ  PAYSYSIN:1  USEOVERLIMIT:0  NOTSENDABLECR:0  NOTSENDABLEDB:0  SBQENABLED:1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",memorder.Isn,1)
    Call CheckDB_DOCS(memorder.Isn,"MemOrd  ","10",fBODY,1)
    'FOLDERS
    Call CheckQueryRowCount("FOLDERS","fISN",memorder.Isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    'DOCSATTACH
    Call CheckDB_DOCSATTACH(memorder.Isn, filePath, 1, "", 1)
    Call Close_Window(wMDIClient, "frmPttel" )
    
    
    'Անցնել Ադմինիստրատորի ԱՇՏ 4.0
    Log.Message "Անցնել Ադմինիստրատորի ԱՇՏ 4.0",,,MessageColor
    Call ChangeWorkspace(c_Admin40)
    'Բացել "Կցված ֆայլեր" թղթապանակը
    Call wTreeView.DblClickItem("|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|Îóí³Í ý³ÛÉ»ñ")
    Call Rekvizit_Fill("Dialog",1,"General","DOCTYPE","MemOrd")
    Call Rekvizit_Fill("Dialog",1,"General","SUID","77")
    Call Rekvizit_Fill("Dialog",1,"General","SDATE",tday)
    Call Rekvizit_Fill("Dialog",1,"General","EDATE",tday)
    Call ClickCmdButton(2,"Î³ï³ñ»É")    
    'Ստուգել փաստաթղթի և ֆայլի առկայությունը Կցված Ֆայլեր թղթապանակում
    Call SearchInPttel("frmPttel",2, filePath)
    Call SearchInPttel("frmPttel",1, memorder.Isn)
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click (c_Allactions)
    Call wMainForm.PopupMenu.Click (c_View)
    BuiltIn.Delay(delay_middle)  
    Call Memorder_Window_Check (memorder)
    Call SearchInAttachList(filePath,2)
    Call ClickCmdButton(1,"OK")
    Call Close_Window(wMDIClient, "frmPttel")   
    'Մուտք Աշխատանքային Փաստաթղթեր թղթապանակ  
    Log.Message "Մուտք Աշխատանքային Փաստաթղթեր թղթապանակ  ",,,MessageColor
    Call GoTo_MainAccWorkingDocuments("|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|", workingDocs)
    'Ստուգել փաստաթղթի առկայությունը և ճշտությունը թղթապանակում
    Log.Message "Կցել Նոր ֆայլ և ջնջել հղումը",,,MessageColor
    If SearchInPttel("frmPttel",2, memorder.DocN) Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_ToEdit)
        BuiltIn.Delay(delay_middle)
        Call Memorder_Window_Check (memorder)
        'Կցել նոր ֆայլ փաստաթղթին
        Call Attach_File_ToDoc(filePath, 2, fileName)
        'Ջնջել կցված հղումը
        Call Delete_Attached_File_Doc (filePath,2)
        Call ClickCmdButton(1,"Î³ï³ñ»É")        
    Else
        Log.Error "Can't find Memorder N " & memorder.DocN
    End If
    
    
    'SQL
    Log.Message "'SQL Ստուգումներ հղումը ջնջելուց և ֆայլ կցելուց հետո",,,SqlDivideColor
    'DOCSATTACH
     Call CheckDB_DOCSATTACH(memorder.Isn, filePath, 1, "", 0)
     Call CheckDB_DOCSATTACH(memorder.Isn, fileName, 0, "", 1)  
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",memorder.Isn,4)
    Call CheckDB_DOCLOG(memorder.Isn,"77","C","10"," ",1)
    Call CheckDB_DOCLOG(memorder.Isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(memorder.Isn,"77","E","10"," ",2)
    
    Call Close_Window(wMDIClient, "frmPttel" )
    
    'Մուտք Ստեղծված փաստաթղթեր թղթապանակ     
    Log.Message  "Բացել Ստեղծված փաստաթղթեր թղթապանակը",,,DivideColor
    folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|êï»ÕÍí³Í ÷³ëï³ÃÕÃ»ñ"
    Call OpenCreatedDocFolder(folderDirect, tday, tday, "", "MemOrd")
    If WaitForPttel("frmPttel") Then
       Log.Message  "Հիշարար օրդերի հաշվառում",,,DivideColor    
       Call SearchInPttel("frmPttel", 2, memorder.Isn)
       Call Register_Payment()
    Else 
        Log.Error  "Ստեղծված փաստաթղթեր թղթապանակը չի բացվել" ,,,ErrorColor  
    End If
    
    'SQL
    Log.Message "'SQL Ստուգումներ հիշարար օրդերը հաշվառելուց հետո",,,SqlDivideColor
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",memorder.Isn,5)
    Call CheckDB_DOCLOG(memorder.Isn,"77","C","10"," ",1)
    Call CheckDB_DOCLOG(memorder.Isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(memorder.Isn,"77","E","10"," ",2)
    Call CheckDB_DOCLOG(memorder.Isn,"77","M","5","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    'DOCS  
    fBODY = "  OPERTYPE:MSC  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
            & "USERID:  77  ACSBRANCH:00  ACSDEPART:1  DOCNUM:" & memorder.DocN & "  DATE:" & tdaySql & "  ACCDB:000004502  ACCCR:000006002  CUR:002  "_
            & "SUMMA:12772533943  AIM:Ð³Ù³Ó³ÛÝ Ã. Ñ³ßíÇ  PAYSYSIN:1  USEOVERLIMIT:0  NOTSENDABLECR:0  NOTSENDABLEDB:0  SBQENABLED:1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",memorder.Isn,1)
    Call CheckDB_DOCS(memorder.Isn,"MemOrd  ","5",fBODY,1)
    'FOLDERS
    Call CheckQueryRowCount("FOLDERS","fISN",memorder.Isn,0) 
    'MEMORDERS
    Call CheckDB_MEMORDERS(memorder.Isn,"MemOrd  ","1" , tdaySql ,"5","12772533943.00","002",1)
    'HIREST
    Call CheckDB_HIREST("01", cAccIsn , "-9999999999993.00" ,"002", "-12772533943.00", 1)
    Call CheckDB_HIREST("01", dAccIsn , "9999999999240.40" ,"002", "12772533943.00", 1)
    'DOCSATTACH
    Call CheckDB_DOCSATTACH(memorder.Isn, fileName, 0, "", 1)
    
    Call Close_Window(wMDIClient, "frmPttel")
    
    'Մուտք գործել Հաշվապահության ԱՇՏ
    Log.Message  "Մուտք Հաշվապահության ԱՇՏ",,,DivideColor
    Call ChangeWorkspace("Հաշվապահության ԱՇՏ")
    'Բացել Հաշվառված Վճարային Փաստաթղթեր թղթապանակը
    folderDirect = "|Ð³ßí³å³ÑáõÃÛ³Ý ²Þî|Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
    Call OpenAccPaymentDocFolder(folderDirect, tday, tday, "", "MemOrd","", "", "","", "", "", "", "", "Payments", "0")
    If WaitForPttel("frmPttel") Then
        'Կատարել խմբագրել գործողությունը
        Call SearchInPttel("frmPttel", 1, memorder.DocN)
        wMDIClient.VBObject("frmPttel").Keys ("^e")
        BuiltIn.Delay (3000)     
        If wMDIClient.waitVBObject("frmASDocForm",1000).exists Then
           'Ստուգել փաստաթղթի ճշտութունը
           BuiltIn.Delay (3000)
           Call Memorder_Window_Check (memorder)
           Call SearchInAttachList(fileName, 2)
           'Կցել նոր ֆայլ փաստաթղթին
           Call Attach_Link_ToDoc (filePath, 2, "")
           Call ClickCmdButton(1,"Î³ï³ñ»É")                
        End If     
        'Կատարել Դիտել գործողությունը
        Call SearchInPttel("frmPttel", 1, memorder.DocN)
        wMDIClient.VBObject("frmPttel").Keys ("^w") 
        BuiltIn.Delay (3000)    
        If wMDIClient.WaitVBObject("frmASDocForm",1000).exists Then
           'Ստուգել փաստաթղթի ճշտութունը
           Call Memorder_Window_Check (memorder)
           'Կատարել Դիտել գործողությունը
           If SearchInAttachList(fileName, 2) Then  
               wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("AsAttachments1").VBObject("CmdView").click
               BuiltIn.Delay(15000)
               If not Sys.Process("EXCEL").WaitWindow("XLMAIN", "ForTest50digit50characterscharacterscharacter.xlsx  [Read-Only] - Excel", 1, 10000).exists Then
                   Log.Error "Document hasn't been opened",,,ErrorColor
               End If
               Call CloseAllExcelFiles()
            End If 
            'Կատարել Բացել ֆայլի թղթապանակը գործողությունը
            If SearchInAttachList(fileName, 2) Then    
               wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("AsAttachments1").VBObject("CmdFolder").click
               BuiltIn.Delay(15000)
               If Sys.Process("explorer").WaitWindow("CabinetWClass", memorder.Isn , 1,15000).exists Then
                  Sys.Process("explorer").Window("CabinetWClass", memorder.Isn , 1).Close
               Else
                   Log.Error "Folder hasn't been opened",,,ErrorColor
               End If   
            End If   
            'Կատարել Հիշել ուպես գործողությունը
            If SearchInAttachList(fileName, 2) Then   
               wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("AsAttachments1").VBObject("CmdSaveAs").click
               
               If asbank.WaitWindow("#32770", "Save As", 1,5000).exists Then
                  Set saveWindow = asbank.Window("#32770", "Save As", 1).Window("DUIViewWndClassName", "", 1).UIAObject("Explorer_Pane")
                  saveFilePath = Project.Path & "Stores\MemorialOrder\ForTest_Actual.xlsx" 
                  aqFile.Delete(saveFilePath)
                  saveWindow.Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(saveFilePath)
                  asbank.Window("#32770", "Save As", 1).Window("Button", "&Save", 1).Click
                  resultWorksheet = Project.Path & "Stores\MemorialOrder\Result\Result.xlsx"
                  Call CompareTwoExcelFiles(saveFilePath, filePath, resultWorksheet)
               Else
                   Log.Error "Save As window hasn't been opened",,,ErrorColor
               End If
             End If
     
           If SearchInAttachList(filePath, 2) Then
               'Կատարել Դիտել գործողությունը հղման համար 
               wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("AsAttachments1").VBObject("CmdView").click
               BuiltIn.Delay(15000)
               If not Sys.Process("EXCEL").WaitWindow("XLMAIN", "ForTest50digit50characterscharacterscharacter.xlsx - Excel", 1, 15000).exists Then
                   Log.Error "Document hasn't been opened",,,ErrorColor
               End If
               Call CloseAllExcelFiles()
           End If    
           Call ClickCmdButton(1,"OK")                
        End If   
        Log.Message "'SQL Ստուգումներ հիշարար օրդերը խմբագրելուց հետո",,,SqlDivideColor
        'SQL
        'DOCSATTACH
        Call CheckDB_DOCSATTACH(memorder.Isn, filePath, 1, "", 1) 
        'DOCLOG
        Call CheckQueryRowCount("DOCLOG","fISN",memorder.Isn,6)
        Call CheckDB_DOCLOG(memorder.Isn,"77","C","10"," ",1)
        Call CheckDB_DOCLOG(memorder.Isn,"77","N","1"," ",1)
        Call CheckDB_DOCLOG(memorder.Isn,"77","E","10"," ",2)
        Call CheckDB_DOCLOG(memorder.Isn,"77","E","5"," ",1)
        Call CheckDB_DOCLOG(memorder.Isn,"77","M","5","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
        
        'Կատարել ջնջել գործողությունը
        Call SearchInPttel("frmPttel", 1, memorder.DocN)
        wMDIClient.VBObject("frmPttel").Keys ("^d") 
        If MessageExists(1,"Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") Then
           Call ClickCmdButton(3, "²Ûá")
        End If
        

        Log.Message "'SQL Ստուգումներ հիշարար օրդերը ջնջելուց հետո",,,SqlDivideColor
        'DOCLOG
        Call CheckQueryRowCount("DOCLOG","fISN",memorder.Isn,7)
        Call CheckDB_DOCLOG(memorder.Isn,"77","C","10"," ",1)
        Call CheckDB_DOCLOG(memorder.Isn,"77","N","1"," ",1)
        Call CheckDB_DOCLOG(memorder.Isn,"77","E","10"," ",2)
        Call CheckDB_DOCLOG(memorder.Isn,"77","E","5"," ",1)
        Call CheckDB_DOCLOG(memorder.Isn,"77","M","5","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
        Call CheckDB_DOCLOG(memorder.Isn,"77","D","999"," ",1)
        'DOCS                                           
        fBODY = "  OPERTYPE:MSC  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92"_
                & " 93 11 27 33 28  USERID:  77  ACSBRANCH:00  ACSDEPART:1  DOCNUM:" & memorder.DocN & "  DATE:" & tdaySql _
                & "  ACCDB:000004502  ACCCR:000006002  CUR:002  "_
                & "SUMMA:12772533943  AIM:Ð³Ù³Ó³ÛÝ Ã. Ñ³ßíÇ  PAYSYSIN:1  USEOVERLIMIT:0  NOTSENDABLECR:0  NOTSENDABLEDB:0  SBQENABLED:1  "
        fBODY = Replace(fBODY, "  ", "%")
        Call CheckQueryRowCount("DOCS","fISN",memorder.Isn,1)
        Call CheckDB_DOCS(memorder.Isn,"MemOrd  ","999",fBODY,1)
        'FOLDERS
        Call CheckQueryRowCount("FOLDERS","fISN",memorder.Isn,1) 
        Call CheckDB_FOLDERS(dbFOLDERS(3),1)
        'HIREST
        Call CheckDB_HIREST("01", cAccIsn , "0.00" ,"002", "0.00", 7)
        Call CheckDB_HIREST("11", cAccIsn , "0.00" ,"002", "0.00", 2)
        Call CheckDB_HIREST("01", dAccIsn , "0.00" ,"002", "0.00", 1)
        Call CheckDB_HIREST("01", dAccIsn , "-752.60" ,"002", "0.00", 6)
        Call CheckDB_HIREST("11", dAccIsn , "0.00" ,"002", "0.00", 2)

        Call Close_Window(wMDIClient, "frmPttel")    
    Else 
        Log.Error  "Վճարային Փաստաթղթեր թղթապանակը չի բացվել" ,,,ErrorColor     
    End If
    'Ստուգել փաստաթղթի առկայությունը Ջնջված փաստաթղթեր թղթապանակում
    folderDirect = "|Ð³ßí³å³ÑáõÃÛ³Ý ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|æÝçí³Í ÷³ëï³ÃÕÃ»ñ"
    Call DeletedDocFilter(folderDirect, tday, tday, "MemOrd", "", 0, "77", "", "")
    If WaitForPttel("frmPttel") Then
        Call SearchInPttel("frmPttel",2,memorder.Isn)
    Else
        Log.Error "Ջնջված փաստաթղթեր թղթապանակը չի բացվել",,,ErrorColor
    End If
    Call Close_Window(wMDIClient, "frmPttel")   
    Call Close_AsBank()
End Sub



Sub Intitialize_DB_Memorder (fISN,fDOCN)
    Dim tday
    
    tday = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"20%y%m%d")
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1) 
        .fFOLDERID = "Oper." & tday
        .fNAME = "MemOrd  "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "ÐÇß³ñ³ñ ûñ¹»ñ"
        .fSPEC = fDOCN & "77700000004502  77700000006002    12772533943.00002Üáñ                                                   "_
                 &"77                                                                                       1        Ð³Ù³Ó³ÛÝ "_
                 &"Ã. Ñ³ßíÇ                                                                                                                           "
        .fECOM = "Memorial Order"
        .fDCBRANCH = "00 "
        .fDCDEPART = "1  "
    End With
    Set dbFOLDERS(2) = New_DB_FOLDERS()
    
    
    With dbFOLDERS(2) 
        .fFOLDERID = "Oper." & tday
        .fNAME = "MemOrd  "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "ÐÇß³ñ³ñ ûñ¹»ñ"
        .fSPEC = fDOCN & "77700000004502  77700000006002    12772533943.00002ÊÙµ³·ñíáÕ                                             "_
                 &"77                                                                                       1        Ð³Ù³Ó³ÛÝ "_
                 &"Ã. Ñ³ßíÇ                                                                                                                           "
        .fECOM = "Memorial Order"
        .fDCBRANCH = "00 "
        .fDCDEPART = "1  "
    End With
    
    Set dbFOLDERS(3) = New_DB_FOLDERS()
    With dbFOLDERS(3) 
        .fFOLDERID = ".R."&tday
        .fNAME = "MemOrd  "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "0"
        .fCOM = ""
        .fSPEC = Left_Align(Get_Compname_DOCLOG(fISN), 16) & "Account ARMSOFT                       115  "
        .fECOM = ""
        .fDCBRANCH = "00 "
        .fDCDEPART = "1  "
    End With
    
End Sub





