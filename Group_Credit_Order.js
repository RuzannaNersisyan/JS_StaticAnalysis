'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Mem_Order_Library
'USEUNIT Library_Colour
'USEUNIT Library_CheckDB
'USEUNIT Library_Contracts
'USEUNIT DAHK_Library_Filter
'USEUNIT Main_Accountant_Filter_Library
Option Explicit
'Test Case ID 181445

Dim sDATE, eDate, grCredOrd(2), workingDocs, filter_Pttel, pathExp, folderDirect, tday, sumSQL
Dim stDate, enDate, wUser, docType, wName, passNum, cliCode, paySysIn, paySysOut, acsBranch, i, fBODY
Dim  acsDepart, docISN, selectedView, expExcel, cAccIsn(3), dAccIsn, cAccEditIsn(3), dAccEditIsn, dbFOLDERS (3) 

Sub Group_Credit_Order_Test()
    aCount = 3
    Call Test_Initialize_Group_Cred_Order()
    
    'Մուտք ծրագիր ARMSOFT Օգտագործողով
    Call Initialize_AsBank("bank", sDATE, eDATE)
    Call Login ("ARMSOFT")
    'Հաշիվների ISN-ների ստացում SQL աղյուսակներից
    For i = 0 to grCredOrd(0).commonTab.cAccsCount 
        cAccIsn(i) = GetAccountISN(grCredOrd(0).commonTab.accC(i))
    Next    
    dAccIsn = GetAccountISN(grCredOrd(0).commonTab.accD)
    For i = 0 to grCredOrd(1).commonTab.cAccsCount 
        cAccEditIsn(i) = GetAccountISN(grCredOrd(1).commonTab.accC(i))
    Next 
    dAccEditIsn = GetAccountISN(grCredOrd(1).commonTab.accD)

    'Մուտք Գլխավոր հաշվապահի ԱՇՏ| Հաշիվներ
    Log.Message  "Մուտք Գլխավոր հաշվապահի ԱՇՏ| Հաշիվներ",,,DivideColor
    Call ChangeWorkspace(c_ChiefAcc)
    Call OpenAccauntsFolder ("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|Ð³ßÇíÝ»ñ","1","","","000","","","","","",0,"","","","","",0,0,0,"","","","","","ACCS","0")
    'Ֆիլտրել հաշիվներ թղթապանակը ըստ տիպ սյան
    Call Pttel_Filtering (filter_Pttel, "frmPttel")


'--------------------------------------------------------------------    
'----------------Ստեղծել Խմբային Կրեդիտի Օրդեր----------------------------
'--------------------------------------------------------------------    
    
    Log.Message  "Ստեղծել Խմբային Կրեդիտի Օրդեր",,,DivideColor
    Call Create_Group_Cred_Order(grCredOrd(0), "Î³ï³ñ»É", "frmPttel")
    'Ստուգել փաստաթղթի տպելու ձևը
    Call Group_Cred_Order_DocCheck (pathExp, 0)

    'SQL Ստուգումներ
    Log.Message "SQL Ստուգումներ Խմբային կրեդիտի օրդեր ստեղծելուց հետո",,,SqlDivideColor
    Call Intitialize_DB_Group_Cred_Order (grCredOrd(0).commonTab.isn , grCredOrd(0).commonTab.docN)
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",grCredOrd(0).commonTab.isn, 1)
    Call CheckDB_DOCLOG(grCredOrd(0).commonTab.isn,"77","N","1"," ",1)
    
    'DOCS   
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28 10  USERID:  77  ACSBRANCH:01  ACSDEPART:2  "_
               &"DOCNUM:" & grCredOrd(0).commonTab.docN & "  DATE:20211202  ACCDB:01046493311  CUR:000  SUMMA:45000  AIM:a  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grCredOrd(0).commonTab.isn, 1)
    Call CheckDB_DOCS(grCredOrd(0).commonTab.isn, "CrPkOrd ", "1", fBODY,1)
    
    'DOCSATTACH
    Call CheckQueryRowCount("DOCSATTACH", "fISN", grCredOrd(0).commonTab.isn, 1)
    Call CheckDB_DOCSATTACH(grCredOrd(0).commonTab.isn, grCredOrd(0).attachTab.fileName(0), 0, "", 1)
    
    'DOCSG
     Call CheckQueryRowCount("DOCSG", "fISN", grCredOrd(0).commonTab.isn, 9)
     For i = 0 to grCredOrd(0).commonTab.cAccsCount - 1
         Call CheckDB_DOCSG(grCredOrd(0).commonTab.isn,"SUBSUMS",grCredOrd(0).commonTab.cAccRowN(i) ,"ACCCR",grCredOrd(0).commonTab.accC(i),1)
     Next
     For i = 0 to grCredOrd(0).commonTab.cAccsCount - 1
         Call CheckDB_DOCSG(grCredOrd(0).commonTab.isn,"SUBSUMS",grCredOrd(0).commonTab.cAccRowN(i) ,"ACCCRNAME",grCredOrd(0).commonTab.cAccName(i),1)
     Next
     For i = 0 to grCredOrd(0).commonTab.cAccsCount - 1
         sumSQL = Replace (grCredOrd(0).commonTab.sum(i),"," , "")
         sumSQL = Replace (sumSQL, ".00", "")
         Call CheckDB_DOCSG(grCredOrd(0).commonTab.isn,"SUBSUMS", grCredOrd(0).commonTab.cAccRowN(i) , "SUMMA", sumSQL, 1)
    Next
    
    'FODLERS
    Call CheckQueryRowCount("FOLDERS","fISN",grCredOrd(0).commonTab.isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    'HI
    Call CheckQueryRowCount("HI", "fBASE", grCredOrd(0).commonTab.isn, 6)
    For i = 0 to grCredOrd(0).commonTab.cAccsCount - 1
        sumSQL = Replace (grCredOrd(0).commonTab.sum(i),"," , "")
        Call Check_HI_CE_accounting ("20211202",grCredOrd(0).commonTab.isn , "11", dAccIsn ,sumSQL, "000", sumSQL, "MSC", "D")
        Call Check_HI_CE_accounting ("20211202",grCredOrd(0).commonTab.isn , "11", cAccIsn(i) ,sumSQL, "000", sumSQL, "MSC", "C")
    Next
     
    'HIREST
    For i = 0 to grCredOrd(0).commonTab.cAccsCount - 1
        sumSQL = Replace (grCredOrd(0).commonTab.sum(i),"," , "")
        Call CheckDB_HIREST("11", cAccIsn(i) , "-" & sumSQL ,"000", "-" & sumSQL, 1)
    Next
    Call CheckDB_HIREST("11", dAccIsn , "45000.00" ,"000", "45000.00", 1)
    
    Log.Message "Document ISN = " & grCredOrd(0).commonTab.isn,,, SqlDivideColor
    Log.Message "Document Number = " & grCredOrd(0).commonTab.DocN,,, DivideColor
    Call Close_Window(wMDIClient, "FrmSpr" )
    Call Close_Window(wMDIClient, "frmPttel" )

'----------------------------------------------------------    
'----Բացել Աշխատանքային փաստաթղթեր թղթապանակը-----------------
'----------------------------------------------------------    
    Log.Message  "Բացել Աշխատանքային փաստաթղթեր թղթապանակը",,,DivideColor
    Call GoTo_MainAccWorkingDocuments("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|", workingDocs)
    grCredOrd(0).commonTab.mDate = "02/12/21"
    
    'Կատարել Դիտել գործողությունը
    Call View_Group_Cred_Order (grCredOrd(0), "frmPttel")
    
'---------Խմբագրել Խմբային կրեդիտի օրդերը-------------------------------------------------------------------------------
    Call Edit_Group_Cred_Order (grCredOrd(0), grCredOrd(1), 0, "frmPttel")
    
    'SQL Ստուգումներ
    Log.Message "SQL Ստուգումներ Խմբային կրեդիտի օրդերը խմբագրելուց հետո",,,SqlDivideColor
    Call Intitialize_DB_Group_Cred_Order (grCredOrd(1).commonTab.isn , grCredOrd(1).commonTab.docN)
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",grCredOrd(1).commonTab.isn, 2)
    Call CheckDB_DOCLOG(grCredOrd(1).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(grCredOrd(1).commonTab.isn,"77","E","1"," ",1)
    
    'DOCS   
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28 10  USERID:  77  ACSBRANCH:01  ACSDEPART:2  "_
               &"DOCNUM:" & grCredOrd(1).commonTab.docN & "  DATE:20230621  ACCDB:000080500  CUR:000  SUMMA:4700000  AIM:b  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grCredOrd(1).commonTab.isn, 1)
    Call CheckDB_DOCS(grCredOrd(0).commonTab.isn, "CrPkOrd ", "1", fBODY,1)
    
    'DOCSATTACH
    Call CheckQueryRowCount("DOCSATTACH", "fISN", grCredOrd(1).commonTab.isn, 1)
    Call CheckDB_DOCSATTACH(grCredOrd(1).commonTab.isn, grCredOrd(1).attachTab.fileName(0), 0, "", 1)
    
    'DOCSG
    Call CheckQueryRowCount("DOCSG", "fISN", grCredOrd(1).commonTab.isn, 9)
    For i = 0 to grCredOrd(1).commonTab.cAccsCount - 1
        Call CheckDB_DOCSG(grCredOrd(1).commonTab.isn,"SUBSUMS",grCredOrd(1).commonTab.cAccRowN(i) ,"ACCCR",grCredOrd(1).commonTab.accC(i),1)
    Next
    For i = 0 to grCredOrd(1).commonTab.cAccsCount - 1
        Call CheckDB_DOCSG(grCredOrd(1).commonTab.isn,"SUBSUMS",grCredOrd(1).commonTab.cAccRowN(i) ,"ACCCRNAME",grCredOrd(1).commonTab.cAccName(i),1)
    Next
    For i = 0 to grCredOrd(1).commonTab.cAccsCount - 1
        sumSQL = Replace (grCredOrd(1).commonTab.sum(i),"," , "")
        sumSQL = Replace (sumSQL, ".00", "")
        Call CheckDB_DOCSG(grCredOrd(1).commonTab.isn,"SUBSUMS", grCredOrd(1).commonTab.cAccRowN(i) , "SUMMA", sumSQL, 1)
    Next
    
    'FODLERS
    Call CheckQueryRowCount("FOLDERS","fISN",grCredOrd(1).commonTab.isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)

    'HI
    Call CheckQueryRowCount("HI", "fBASE", grCredOrd(1).commonTab.isn, 6)
    For i = 0 to grCredOrd(1).commonTab.cAccsCount - 1
         sumSQL = Replace (grCredOrd(1).commonTab.sum(i),"," , "")
         Call Check_HI_CE_accounting ("20230621",grCredOrd(1).commonTab.isn , "11", dAccEditIsn ,sumSQL, "000", sumSQL, "MSC", "D")
         Call Check_HI_CE_accounting ("20230621",grCredOrd(1).commonTab.isn , "11", cAccEditIsn(i) ,sumSQL, "000", sumSQL, "MSC", "C")
    Next
     
    'HIREST
    For i = 0 to grCredOrd(1).commonTab.cAccsCount - 1
        sumSQL = Replace (grCredOrd(1).commonTab.sum(i),"," , "")
        Call CheckDB_HIREST("11", cAccEditIsn(i) , "-" & sumSQL ,"000", "-" & sumSQL, 1)
    Next
    Call CheckDB_HIREST("11", dAccEditIsn , "4700000.00" ,"000", "4700000.00", 1)
    
    'Կատարել Դիտել գործողությունը
    grCredOrd(1).commonTab.mDate = "21/06/23"
    Call View_Group_Cred_Order (grCredOrd(1), "frmPttel")


'-----------------------------------------------------------------------    
'------------------Հաշվառել փասթտաթուղթը----------------------------------
'-----------------------------------------------------------------------    
    Log.Message  "Փաստաթղթի հաշվառում",,,DivideColor
    If SearchInPttel("frmPttel", 2, grCredOrd(1).commonTab.docN) Then
       Call Register_Payment()
    End If
    
    'SQL Ստուգումներ
    Log.Message "SQL Ստուգումներ Խմբային կրեդիտի օրդերը հաշվառելուց հետո",,,SqlDivideColor
    Call Intitialize_DB_Group_Cred_Order (grCredOrd(1).commonTab.isn , grCredOrd(1).commonTab.docN)
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",grCredOrd(1).commonTab.isn, 3)
    Call CheckDB_DOCLOG(grCredOrd(1).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(grCredOrd(1).commonTab.isn,"77","E","1"," ",1)
    Call CheckDB_DOCLOG(grCredOrd(1).commonTab.isn,"77","M","3","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    
    'DOCS   
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28 10  USERID:  77  ACSBRANCH:01  ACSDEPART:2  "_
               &"DOCNUM:" & grCredOrd(1).commonTab.docN & "  DATE:20230621  ACCDB:000080500  CUR:000  SUMMA:4700000  AIM:b  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grCredOrd(1).commonTab.isn, 1)
    Call CheckDB_DOCS(grCredOrd(0).commonTab.isn, "CrPkOrd ", "3", fBODY,1)
    
    'DOCSG
    Call CheckQueryRowCount("DOCSG", "fISN", grCredOrd(1).commonTab.isn, 0)
    
    'FODLERS
    Call CheckQueryRowCount("FOLDERS","fISN",grCredOrd(1).commonTab.isn,0) 
    
    'HIREST
    Call CheckDB_HIREST("01", dAccEditIsn , "4700000.00" ,"000", "4700000.00", 1)
    Call CheckDB_HIREST("01", cAccEditIsn (0) , "-548891.00" ,"000", "-548891.00", 1)
    Call CheckDB_HIREST("01", cAccEditIsn (1) , "-11661917.90" ,"000", "-11661917.90", 1)
    Call CheckDB_HIREST("01", cAccEditIsn (2) , "-2400000.00" ,"000", "-2400000.00", 1)
    
    'MEMORDERS
    Call CheckDB_MEMORDERS(grCredOrd(1).commonTab.isn,"CrPkOrd ","1","20230621","3","4700000.00","000",1)
    
    Call Close_Window(wMDIClient, "frmPttel" )

'------------------------------------------------------------------    
'------------Մուտք Հաշվառված վճարային փաստաթղթեր-----------------------
'------------------------------------------------------------------    
    Log.Message  "Մուտք Հաշվառված վճարային փաստաթղթեր",,,DivideColor
    folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
    stDate = "010120"
    enDate = "010125"
    wUser = ""
    docType = "CrPkOrd "
    wName = "" 
    passNum = ""
    cliCode = ""
    paySysIn = ""
    paySysOut = ""
    acsBranch = ""
    acsDepart = ""
    docISN = ""
    selectedView = "Payments"
    expExcel = "0"
    Call OpenAccPaymentDocFolder(folderDirect, stDate, enDate, wUser, docType,wName, passNum, cliCode,paySysIn, paySysOut, acsBranch,_
                                               acsDepart, docISN, selectedView, expExcel)
    'Խմբագրել հաշվառված փաստաթուղթը 
    Log.Message  "Խմբագրել հաշվառված խմբային կրդեիտի օրդերը",,,DivideColor                                                                                      
    Call Edit_Group_Cred_Order (grCredOrd(1), grCredOrd(2), 1, "frmPttel")
    
    'SQL
    Log.Message "SQL Ստուգումներ հաշվառված Խմբային կրեդիտի օրդերը խմբագրելուց հետո",,,SqlDivideColor
    Call Intitialize_DB_Group_Cred_Order (grCredOrd(2).commonTab.isn , grCredOrd(2).commonTab.docN)
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",grCredOrd(2).commonTab.isn, 4)
    Call CheckDB_DOCLOG(grCredOrd(2).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(grCredOrd(2).commonTab.isn,"77","E","1"," ",1)
    Call CheckDB_DOCLOG(grCredOrd(2).commonTab.isn,"77","M","3","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    Call CheckDB_DOCLOG(grCredOrd(2).commonTab.isn,"77","E","3"," ",1)
    'DOCS   
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28 10  USERID:  77  ACSBRANCH:01  ACSDEPART:2  "_
               &"DOCNUM:" & grCredOrd(2).commonTab.docN & "  DATE:20230621  ACCDB:000080500  CUR:000  SUMMA:4700000  AIM:c  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grCredOrd(2).commonTab.isn, 1)
    Call CheckDB_DOCS(grCredOrd(0).commonTab.isn, "CrPkOrd ", "3", fBODY,1)
       
    'Կատարել Դիտել գործողությունը
    Call View_Group_Cred_Order (grCredOrd(2), "frmPttel")

'--------------------------------------------------------------------------    
'--------------------Ջնջել փաստաթուղթը---------------------------------------
'--------------------------------------------------------------------------    
    Log.Message  "Ջնջել հաշվառված խմբային կրդեիտի օրդերը",,,DivideColor
    If SearchInPttel("frmPttel", 2, grCredOrd(1).commonTab.docN) Then
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_Delete )
        If  MessageExists(2, "ö³ëï³ÃáõÕÃÁ çÝç»ÉÇë` ÏÑ»é³óí»Ý Ýñ³ Ñ»ï Ï³åí³Í ËÙµ³ÛÇÝ " & vbCrLf &"Ó¨³Ï»ñåáõÙÝ»ñÁ") Then
            ' Սեղմել "Կատարել" կոճակը
            Call ClickCmdButton(5, "Î³ï³ñ»É")  
            If  MessageExists(1, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") Then
                ' Սեղմել "Այո" կոճակը
                Call ClickCmdButton(3, "²Ûá")  
            Else
                Log.Error"Հաղորդագրության պատուհանը չի բացվել" ,,,ErrorColor
            End If
        Else
            Log.Error"Հաղորդագրության պատուհանը չի բացվել" ,,,ErrorColor
        End If
     Else
         Log.Error "Document with N " & grCredOrd(1).commonTab.docN & " not found"
     End If  

    'SQL
    Log.Message "SQL Ստուգումներ հաշվառված Խմբային կրեդիտի օրդերը ջնջելուց հետո",,,SqlDivideColor
    Call Intitialize_DB_Group_Cred_Order (grCredOrd(2).commonTab.isn , grCredOrd(2).commonTab.docN)
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",grCredOrd(2).commonTab.isn, 5)
    Call CheckDB_DOCLOG(grCredOrd(2).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(grCredOrd(2).commonTab.isn,"77","E","1"," ",1)
    Call CheckDB_DOCLOG(grCredOrd(2).commonTab.isn,"77","M","3","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    Call CheckDB_DOCLOG(grCredOrd(2).commonTab.isn,"77","E","3"," ",1)
    Call CheckDB_DOCLOG(grCredOrd(2).commonTab.isn,"77","D","999"," ",1)
  
    'DOCS   
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28 10  USERID:  77  ACSBRANCH:01  ACSDEPART:2  "_
               &"DOCNUM:" & grCredOrd(2).commonTab.docN & "  DATE:20230621  ACCDB:000080500  CUR:000  SUMMA:4700000  AIM:c  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grCredOrd(2).commonTab.isn, 1)
    Call CheckDB_DOCS(grCredOrd(2).commonTab.isn, "CrPkOrd ", "999", fBODY,1)

    'FODLERS
    Call CheckQueryRowCount("FOLDERS","fISN",grCredOrd(1).commonTab.isn,1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1) 
    
    'MEMORDERS
    Call CheckDB_MEMORDERS(grCredOrd(1).commonTab.isn,"CrPkOrd ","1","20230621","3","4700000.00","000",0)
     
    Call Close_Window(wMDIClient, "frmPttel" )
    Call Close_AsBank() 
End Sub



Sub Test_Initialize_Group_Cred_Order()

 'Ստեղծվող օրդեր
    Set grCredOrd(0) = New_Group_Credit_Order(1, 0, 0)
    With grCredOrd(0)
        .commonTab.branch = "01"
        .commonTab.dep = "2"
        .commonTab.mDate = "021221"
        .commonTab.accD = "01046493311"              
        .commonTab.cAccsCount = 3
        .commonTab.accC(0) = "33170165400"
        .commonTab.accC(1) = "00068100100"
        .commonTab.accC(2) = "00001850300"
        .commonTab.curr = "000"
        .commonTab.sum(0) = "15,000.00"
        .commonTab.sum(1) = "20,000.00"
        .commonTab.sum(2) = "10,000.00"
        .commonTab.fullSum = "45,000.00"
        .commonTab.aim = "a"
        .attachTab.tabN = 2
        .attachTab.fileName(0) = "Group_Cred_Order_Exp.txt"
        .attachTab.addFiles(0) =  Project.Path & "Stores\MemorialOrder\" & .attachTab.fileName(0)
        .attachTab.tabN = 2
    End With
 'Առաջին խմբագրվող տվյալներ
    Set grCredOrd(1) = New_Group_Credit_Order(1, 0, 0)
    With grCredOrd(1)
        .commonTab.branch = "01"
        .commonTab.dep = "2"
        .commonTab.mDate = "210623"
        .commonTab.accD = "000080500  "
        .commonTab.cAccsCount = 3
        .commonTab.accC(0) = "77008603311"
        .commonTab.accC(1) = "00068100100"
        .commonTab.accC(2) = "00001850300"
        .commonTab.curr = "000"
        .commonTab.sum(0) = "500,000.00"
        .commonTab.sum(1) = "1,800,000.00"
        .commonTab.sum(2) = "2,400,000.00"
        .commonTab.fullSum = "4,700,000.00"
        .commonTab.aim = "b"
        .attachTab.tabN = 2
        .attachTab.fileName(0) = "Group_Cred_Order_Exp.txt"
        .attachTab.addFiles(0) = Project.Path & "Stores\MemorialOrder\" & .attachTab.fileName(0)
        .attachTab.tabN = 2
    End With
 'Հաշվառումից հետո խմբագրվող տվյալներ
    Set grCredOrd(2) = New_Group_Credit_Order(1, 0, 0)
    With grCredOrd(2)
        .commonTab.branch = "01"
        .commonTab.dep = "2"
        .commonTab.mDate = "21/06/23"
        .commonTab.accD = "000080500  "
        .commonTab.cAccsCount = 3
        .commonTab.accC(0) = "77008603311"
        .commonTab.accC(1) = "00068100100"
        .commonTab.accC(2) = "00001850300"
        .commonTab.curr = "000"
        .commonTab.sum(0) = "500,000.00"
        .commonTab.sum(1) = "1,800,000.00"
        .commonTab.sum(2) = "2,400,000.00"
        .commonTab.fullSum = "4,700,000.00"
        .commonTab.aim = "c"
        .attachTab.tabN = 2
        .attachTab.fileName(0) = "Group_Cred_Order_Exp.txt"
        .attachTab.addFiles(0) = Project.Path & "Stores\MemorialOrder\" & .attachTab.fileName(0)
        .attachTab.tabN = 2
    End With
 'Հաշիվներ թղթապանակի ֆիլտր թղթապանակ մուտք գործելուց հետո ֆիլտրը բացելու դեպքում
    Set filter_Pttel = New_Filter_Pttel (2) 
    With filter_Pttel
        .andOr (1) = 1 'Եվ/կամ դաշտը լրացնել "և" արժեքով
        .colName (0) = 5 'Առաջին տողում "Սյան անվանում" դաշտը լրացնել "Տիպ" արժեքով
        .colName (1) = 5 'Երկորդ տողում "Սյան անվանում" դաշտը լրացնել "Տիպ" արժեքով
        .cond (0) = 0  'Առաջին տողում "Պայման" դաշտը լրացնել "=" արժեքով
        .cond (1) = 0  'Երկորդ տողում "Պայման" դաշտը լրացնել "=" արժեքով
        .val (0) = "01" 'Առաջին տողում "Արժեք" դաշտը լրացնել "01" արժեքով
        .val (1) = "03" 'Երկորդ տողում "Արժեք" դաշտը լրացնել "02" արժեքով
        .condCount = 2
    End With
 'Աշխատանքային փաստաթղթեր թղթապանակի ֆիլտր
    Set workingDocs = New_MainAccWorkingDocuments()
    With workingDocs
         .startDate = "021221"
         .endDate = "210623"
    End With
 'Տպելու ձևը ստուգելու օրինակի ճանապարհ
    pathExp = Project.Path & "Stores\MemorialOrder\Group_Cred_Order_Exp.txt"
    tday = aqConvert.DateTimeToStr(aqDateTime.Today)
    sDate = "20050101"
    eDate = "20250101"

End Sub


Sub Intitialize_DB_Group_Cred_Order (fISN,fDOCN)
    Dim tday
    
    tday = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"20%y%m%d")
    Set dbFOLDERS(0) = New_DB_FOLDERS()
    With dbFOLDERS(0) 
        .fFOLDERID = "Oper.20211202"
        .fNAME = "CrPkOrd "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "ÊÙµ³ÛÇÝ Ïñ»¹ÇïÇ ûñ¹»ñ"
        .fSPEC = fDOCN & "7770001046493311                        45000.00000Üáñ                                                   "_
                 &"77                                                                                                a            "_
                 &"                                                                                                                               "
        .fECOM = "Group Credit Order"
        .fDCBRANCH = "01 "
        .fDCDEPART = "2  "
    End With
    
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1) 
        .fFOLDERID = "Oper.20230621"
        .fNAME = "CrPkOrd "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "ÊÙµ³ÛÇÝ Ïñ»¹ÇïÇ ûñ¹»ñ"
        .fSPEC = fDOCN & "77700000080500                        4700000.00000ÊÙµ³·ñíáÕ                                             "_
                 &"77                                                                                                b            "_
                 &"                                                                                                                               "
        .fECOM = "Group Credit Order"
        .fDCBRANCH = "01 "
        .fDCDEPART = "2  "
    End With
    
    Set dbFOLDERS(2) = New_DB_FOLDERS()
    With dbFOLDERS(2) 
        .fFOLDERID = ".R."&tday
        .fNAME = "CrPkOrd "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "0"
        .fCOM = ""
        .fSPEC = Left_Align(Get_Compname_DOCLOG(fISN), 16) & "GlavBux ARMSOFT                       113  "
        .fECOM = ""
        .fDCBRANCH = "01 "
        .fDCDEPART = "2  "
    End With
    
End Sub