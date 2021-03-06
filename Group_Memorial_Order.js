'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Mem_Order_Library
'USEUNIT Library_Colour
'USEUNIT Library_CheckDB
'USEUNIT Library_Contracts
'USEUNIT DAHK_Library_Filter
'USEUNIT Main_Accountant_Filter_Library
Option Explicit

'TestCase ID 182909

Dim sDate, eDate, grMemOrd(2), pathExp, dAccIsn(3), cAccIsn(3), dAccEditIsn(3), cAccEditIsn(3)
Dim folderDirect, stDate, enDate, wUser, docType,wName, passNum, cliCode,paySysIn, paySysOut, acsBranch,acsDepart, docISN, selectedView, expExcel                                 
Dim workingDocs, i, dbFOLDERS(3), fBODY, sumSQL, sumSQLcur (3), dSumHirest(3), dSumHirestCur(3), cSumHirest(3), cSumHirestCur(3), sumHirest(3)

Sub Group_Mem_Order_Test()
    aCount = 3
    Call Test_Initialize_Group_Mem_Ord()
    'Մուտք ծրագիր ARMSOFT Օգտագործողով
    Call Initialize_AsBank("bank", sDATE, eDATE)
    Call Login ("ARMSOFT")
    'Հաշիվների ISN-ների ստացում SQL աղյուսակներից
    For i = 0 to grMemOrd(0).commonTab.accCount 
        dAccIsn(i) = GetAccountISN(grMemOrd(0).commonTab.accD(i))
        cAccIsn(i) = GetAccountISN(grMemOrd(0).commonTab.accC(i))
    Next    
    For i = 0 to grMemOrd(1).commonTab.accCount 
        dAccEditIsn(i) = GetAccountISN(grMemOrd(1).commonTab.accD(i))
        cAccEditIsn(i) = GetAccountISN(grMemOrd(1).commonTab.accC(i))
    Next 
    'Մուտք Գլխավոր հաշվապահի ԱՇՏ
    Log.Message  "Մուտք Գլխավոր հաշվապահի ԱՇՏ",,,DivideColor
    Call ChangeWorkspace(c_ChiefAcc)
'--------------------------------------------------------------------    
'----------------Ստեղծել Խմբային Հիշարար Օրդեր----------------------------
'--------------------------------------------------------------------   
    Log.Message  "Ստեղծել Խմբային Հիշարար Օրդեր",,,DivideColor
    Call Create_Group_Mem_Order(grMemOrd(0), "Î³ï³ñ»É", "frmPttel", "¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî")
    Call Group_Mem_Order_DocCheck(pathExp, 1)
    'Փաստաթղթի համարի և ISN-ի լոգավորում
    Log.Message "Document ISN = " & grMemOrd(0).commonTab.isn,,, SqlDivideColor
    Log.Message "Document Number = " & grMemOrd(0).commonTab.DocN,,, DivideColor
    
    'SQL
    Log.Message "'SQL Ստուգումներ Խմբային Հիշարար օրդեր ստեղծելուց հետո",,,SqlDivideColor
    Call Intitialize_DB_Group_Mem_Order (grMemOrd(0).commonTab.isn , grMemOrd(0).commonTab.docN)
    
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",grMemOrd(0).commonTab.isn, 2)
    Call CheckDB_DOCLOG(grMemOrd(0).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(0).commonTab.isn,"77","C","10"," ",1)
    
    'DOCS    
    fBODY = "  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
               & "USERID:  77  ACSBRANCH:01  ACSDEPART:1  DOCNUM:" & grMemOrd(0).commonTab.docN & "  DATE:20210926  CUR:000  "_
               & "SUMMA:143500  PAYSYSIN:3  SBQENABLED:1  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grMemOrd(0).commonTab.isn, 1)
    Call CheckDB_DOCS(grMemOrd(0).commonTab.isn, "MemOrdPk", "10", fBODY,1)
    
    'DOCSG
     Call CheckQueryRowCount("DOCSG", "fISN", grMemOrd(0).commonTab.isn, 21)
     For i = 0 to grMemOrd(0).commonTab.accCount - 1
         Call CheckDB_DOCSG(grMemOrd(0).commonTab.isn,"SUBSUMS",i ,"ACCDB",grMemOrd(0).commonTab.accD(i),1)
         Call CheckDB_DOCSG(grMemOrd(0).commonTab.isn,"SUBSUMS",i ,"ACCCR",grMemOrd(0).commonTab.accC(i),1)
         Call CheckDB_DOCSG(grMemOrd(0).commonTab.isn,"SUBSUMS",i ,"AIM",grMemOrd(0).commonTab.aim(i),1)
         Call CheckDB_DOCSG(grMemOrd(0).commonTab.isn,"SUBSUMS",i ,"CASHAC",0 ,1)
         Call CheckDB_DOCSG(grMemOrd(0).commonTab.isn,"SUBSUMS",i ,"NOTSENDABLECR",0 ,1)
         Call CheckDB_DOCSG(grMemOrd(0).commonTab.isn,"SUBSUMS",i ,"NOTSENDABLEDB",0 ,1)
     Next
     For i = 0 to grMemOrd(0).commonTab.accCount - 1
         sumSQL = Replace (grMemOrd(0).commonTab.sum(i),"," , "")
         sumSQL = Replace (sumSQL, ".00", "")
         Call CheckDB_DOCSG(grMemOrd(0).commonTab.isn,"SUBSUMS", i, "SUMMA", sumSQL, 1)
     Next
    
    'FODLERS
    Call CheckQueryRowCount("FOLDERS","fISN",grMemOrd(0).commonTab.isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    'HI
    Call CheckQueryRowCount("HI", "fBASE", grMemOrd(0).commonTab.isn, 6)
    For i = 0 to grMemOrd(0).commonTab.accCount - 1
        sumSQL = Replace (grMemOrd(0).commonTab.sum(i),"," , "")
        Call Check_HI_CE_accounting ("20210926",grMemOrd(0).commonTab.isn , "11", cAccIsn(i) ,sumSQL, "000", sumSQL, "MSC", "C")
        Call Check_HI_CE_accounting ("20210926",grMemOrd(0).commonTab.isn , "11", dAccIsn(i) ,sumSQL, "000", sumSQL, "MSC", "D")
    Next
     
    'HIREST
    For i = 0 to grMemOrd(0).commonTab.accCount - 1
        sumSQL = Replace (grMemOrd(0).commonTab.sum(i),"," , "")
        Call CheckDB_HIREST("11", dAccIsn(i) , sumSQL ,"000", sumSQL, 1)
        Call CheckDB_HIREST("11", cAccIsn(i) , "-" & sumSQL ,"000", "-" & sumSQL, 1)
    Next

    Call Close_Window(wMDIClient, "FrmSpr" )
    'Բացել Աշխատանքային փաստաթղթեր թղթապանակը
    Log.Message  "Բացել Աշխատանքային փաստաթղթեր թղթապանակը",,,DivideColor
    Call GoTo_MainAccWorkingDocuments("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|", workingDocs)
    grMemOrd(0).commonTab.mDate = "26/09/21"
    'Կատարել Դիտել գործողությունը
    Call View_Group_Mem_Order (grMemOrd(0), "frmPttel")
'--------------------------------------------------------------------    
'----------------Խմբագրել Խմբային Հիշարար Օրդերը--------------------------
'--------------------------------------------------------------------   
    Log.Message  "Խմբագրել Խմբային Հիշարար Օրդերը",,,DivideColor
    Call Edit_Group_Mem_Order(grMemOrd(0), grMemOrd(1), 0, "frmPttel" )
    
    'SQL
    Log.Message "'SQL Ստուգումներ Խմբային Հիշարար օրդերը խմբագրելուց հետո",,,SqlDivideColor
    Call Intitialize_DB_Group_Mem_Order (grMemOrd(1).commonTab.isn , grMemOrd(1).commonTab.docN)
    
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",grMemOrd(1).commonTab.isn, 3)
    Call CheckDB_DOCLOG(grMemOrd(1).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(1).commonTab.isn,"77","C","10"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(1).commonTab.isn,"77","E","10"," ",1)
    
    'DOCS    
      
    fBODY = "  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
               & "USERID:  77  ACSBRANCH:01  ACSDEPART:1  DOCNUM:" & grMemOrd(0).commonTab.docN & "  DATE:20241017  CUR:001  "_
               & "SUMMA:2170  PAYSYSIN:1  SBQENABLED:1  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grMemOrd(1).commonTab.isn, 1)
    Call CheckDB_DOCS(grMemOrd(1).commonTab.isn, "MemOrdPk", "10", fBODY,1)
    
    'DOCSG
     Call CheckQueryRowCount("DOCSG", "fISN", grMemOrd(1).commonTab.isn, 18)
     For i = 0 to grMemOrd(1).commonTab.accCount - 1
         sumSQL = Replace (grMemOrd(1).commonTab.sum(i),"," , "")
         sumSQL = Replace (sumSQL, ".00", "")
         Call CheckDB_DOCSG(grMemOrd(1).commonTab.isn,"SUBSUMS", i, "SUMMA", sumSQL, 1)
         Call CheckDB_DOCSG(grMemOrd(1).commonTab.isn,"SUBSUMS",i ,"ACCDB",grMemOrd(1).commonTab.accD(i),1)
         Call CheckDB_DOCSG(grMemOrd(1).commonTab.isn,"SUBSUMS",i ,"ACCCR",grMemOrd(1).commonTab.accC(i),1)
         Call CheckDB_DOCSG(grMemOrd(1).commonTab.isn,"SUBSUMS",i ,"CASHAC",0 ,1)
         Call CheckDB_DOCSG(grMemOrd(1).commonTab.isn,"SUBSUMS",i ,"NOTSENDABLECR",0 ,1)
         Call CheckDB_DOCSG(grMemOrd(1).commonTab.isn,"SUBSUMS",i ,"NOTSENDABLEDB",0 ,1)
     Next
    
    'FODLERS
    Call CheckQueryRowCount("FOLDERS","fISN",grMemOrd(1).commonTab.isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    
    'HI
    Call CheckQueryRowCount("HI", "fBASE", grMemOrd(1).commonTab.isn, 6)
    For i = 0 to grMemOrd(1).commonTab.accCount - 1
        sumSQL = Replace (grMemOrd(1).commonTab.sum(i),"," , "")
        Call Check_HI_CE_accounting ("20241017",grMemOrd(1).commonTab.isn , "11", cAccEditIsn(i) ,sumSQLcur(i), "001", sumSQL, "MSC", "C")
        Call Check_HI_CE_accounting ("20241017",grMemOrd(1).commonTab.isn , "11", dAccEditIsn(i) ,sumSQLcur(i), "001", sumSQL, "MSC", "D")
    Next
     
    'HIREST
    For i = 0 to grMemOrd(1).commonTab.accCount - 1
        sumSQL = Replace (grMemOrd(1).commonTab.sum(i),"," , "")
        Call CheckDB_HIREST("11", dAccEditIsn(i) , sumHirest(i) ,"001", sumSQL, 1)
        Call CheckDB_HIREST("11", cAccEditIsn(i) , "-" & sumHirest(i) ,"001", "-" & sumSQL, 1)
    Next
   
    grMemOrd(1).commonTab.mDate = "17/10/24"
    Call View_Group_Mem_Order (grMemOrd(1), "frmPttel")
'--------------------------------------------------------------------    
'----------------Հաշվառել Խմբային Հիշարար Օրդերը--------------------------
'--------------------------------------------------------------------     
   
    Log.Message  "Փաստաթղթի հաշվառում",,,DivideColor
    If SearchInPttel("frmPttel", 2, grMemOrd(1).commonTab.docN) Then
       Call Register_Payment()
    End If
    'SQL
    Log.Message "'SQL Ստուգումներ Խմբային Հիշարար օրդերը հաշվառելուց հետո",,,SqlDivideColor
    
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",grMemOrd(1).commonTab.isn, 4)
    Call CheckDB_DOCLOG(grMemOrd(1).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(1).commonTab.isn,"77","C","10"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(1).commonTab.isn,"77","E","10"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(1).commonTab.isn,"77","M","5","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    'DOCS    
      
    fBODY = "  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
               & "USERID:  77  ACSBRANCH:01  ACSDEPART:1  DOCNUM:" & grMemOrd(0).commonTab.docN & "  DATE:20241017  CUR:001  "_
               & "SUMMA:2170  PAYSYSIN:1  SBQENABLED:1  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grMemOrd(1).commonTab.isn, 1)
    Call CheckDB_DOCS(grMemOrd(1).commonTab.isn, "MemOrdPk", "5", fBODY,1)
    
    'DOCSG
     Call CheckQueryRowCount("DOCSG", "fISN", grMemOrd(1).commonTab.isn, 21)
     For i = 0 to grMemOrd(1).commonTab.accCount - 1
         sumSQL = Replace (grMemOrd(1).commonTab.sum(i),"," , "")
         sumSQL = Replace (sumSQL, ".00", "")
         Call CheckDB_DOCSG(grMemOrd(1).commonTab.isn,"SUBSUMS", i, "SUMMA", sumSQL, 1)
         Call CheckDB_DOCSG(grMemOrd(1).commonTab.isn,"SUBSUMS",i ,"ACCDB",grMemOrd(1).commonTab.accD(i),1)
         Call CheckDB_DOCSG(grMemOrd(1).commonTab.isn,"SUBSUMS",i ,"ACCCR",grMemOrd(1).commonTab.accC(i),1)
         Call CheckDB_DOCSG(grMemOrd(1).commonTab.isn,"SUBSUMS",i ,"CASHAC",0 ,1)
         Call CheckDB_DOCSG(grMemOrd(1).commonTab.isn,"SUBSUMS",i ,"NOTSENDABLECR",0 ,1)
         Call CheckDB_DOCSG(grMemOrd(1).commonTab.isn,"SUBSUMS",i ,"NOTSENDABLEDB",0 ,1)
         Call CheckDB_DOCSG(grMemOrd(1).commonTab.isn,"SUBSUMS",i ,"OPERTYPE","MSC" ,1)
     Next
    
    'FODLERS
    Call CheckQueryRowCount("FOLDERS","fISN",grMemOrd(1).commonTab.isn,0)     
    
    'HIREST
    For i = 0 to grMemOrd(1).commonTab.accCount - 1
        sumSQL = Replace (grMemOrd(1).commonTab.sum(i),"," , "")
        Call CheckDB_HIREST("01", dAccEditIsn(i) , dSumHirest(i) ,"001", dSumHirestCur(i), 1)
        Call CheckDB_HIREST("01", cAccEditIsn(i) , cSumHirest(i) ,"001", cSumHirestCur(i), 1)
    Next
    'MEMORDERS
    Call CheckDB_MEMORDERS(grMemOrd(1).commonTab.isn,"MemOrdPk","1","20241017","5","2170.00","001",1)
    Call Close_Window(wMDIClient, "frmPttel" )
    
    'Մուտք Հաշվառված վճարային փաստաթղթեր
    Log.Message  "Մուտք Հաշվառված վճարային փաստաթղթեր",,,DivideColor
    folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
    stDate = "010120"
    enDate = "010125"
    wUser = ""
    docType = "MemOrdPk"
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
'--------------------------------------------------------------------    
'------------Խմբագրել հաշվառված Խմբային Հիշարար Օրդերը---------------------
'--------------------------------------------------------------------   
    Log.Message  "Խմբագրել հաշվառված Խմբային Հիշարար Օրդերը",,,DivideColor 
    'Կատարել Դիտել գործողությունը
    BuiltIn.Delay (2000)
    Call View_Group_Mem_Order (grMemOrd(1),"frmPttel" )
    Call Edit_Group_Mem_Order(grMemOrd(1), grMemOrd(2), 1, "frmPttel" )
    
    'SQL
    Log.Message "'SQL Ստուգումներ Խմբային Դեբետի օրդեր ստեղծելուց հետո",,,SqlDivideColor
    Call Intitialize_DB_Group_Mem_Order (grMemOrd(2).commonTab.isn , grMemOrd(2).commonTab.docN)
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",grMemOrd(2).commonTab.isn, 5)
    Call CheckDB_DOCLOG(grMemOrd(2).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(2).commonTab.isn,"77","C","10"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(2).commonTab.isn,"77","E","10"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(2).commonTab.isn,"77","M","5","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",2)'1
'    Call CheckDB_DOCLOG(grMemOrd(2).commonTab.isn,"77","E","5"," ",1)
    
    'DOCS  
    fBODY = "  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
               & "USERID:  77  ACSBRANCH:01  ACSDEPART:1  DOCNUM:" & grMemOrd(2).commonTab.docN & "  DATE:20241017  CUR:001  "_
               & "SUMMA:2170  PAYSYSIN:1  SBQENABLED:1  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grMemOrd(2).commonTab.isn, 1)
    Call CheckDB_DOCS(grMemOrd(2).commonTab.isn, "MemOrdPk", "5", fBODY,1)
    
    'DOCSG
     Call CheckQueryRowCount("DOCSG", "fISN", grMemOrd(2).commonTab.isn, 24)
     For i = 0 to grMemOrd(2).commonTab.accCount - 1
         sumSQL = Replace (grMemOrd(2).commonTab.sum(i),"," , "")
         sumSQL = Replace (sumSQL, ".00", "")
         Call CheckDB_DOCSG(grMemOrd(2).commonTab.isn,"SUBSUMS", i, "SUMMA", sumSQL, 1)
         Call CheckDB_DOCSG(grMemOrd(2).commonTab.isn,"SUBSUMS",i ,"ACCDB",grMemOrd(2).commonTab.accD(i),1)
         Call CheckDB_DOCSG(grMemOrd(2).commonTab.isn,"SUBSUMS",i ,"ACCCR",grMemOrd(2).commonTab.accC(i),1)
         Call CheckDB_DOCSG(grMemOrd(2).commonTab.isn,"SUBSUMS",i ,"CASHAC",0 ,1)
         Call CheckDB_DOCSG(grMemOrd(2).commonTab.isn,"SUBSUMS",i ,"NOTSENDABLECR",0 ,1)
         Call CheckDB_DOCSG(grMemOrd(2).commonTab.isn,"SUBSUMS",i ,"NOTSENDABLEDB",0 ,1)
         Call CheckDB_DOCSG(grMemOrd(2).commonTab.isn,"SUBSUMS",i ,"OPERTYPE","MSC" ,1)
         Call CheckDB_DOCSG(grMemOrd(2).commonTab.isn,"SUBSUMS",i ,"AIM",grMemOrd(2).commonTab.aim(i) ,1)
     Next

    'Կատարել Դիտել գործողությունը
    Call View_Group_Mem_Order (grMemOrd(2),"frmPttel" )
    
'--------------------------------------------------------------------    
'------------------Ջնջել Խմբային Հիշարար Օրդերը----------------------------
'--------------------------------------------------------------------  
    Log.Message  "Ջնջել հաշվառված խմբային Հիշարար օրդերը",,,DivideColor
    If SearchInPttel("frmPttel", 2, grMemOrd(2).commonTab.docN) Then
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
         Log.Error "Document with N " & grMemOrd(2).commonTab.docN & " not found"
    End If 
    'SQL
    Log.Message "'SQL Ստուգումներ Խմբային Դեբետի օրդեր ստեղծելուց հետո",,,SqlDivideColor
    Call Intitialize_DB_Group_Mem_Order (grMemOrd(2).commonTab.isn , grMemOrd(2).commonTab.docN)
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",grMemOrd(2).commonTab.isn, 6)
    Call CheckDB_DOCLOG(grMemOrd(2).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(2).commonTab.isn,"77","C","10"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(2).commonTab.isn,"77","E","10"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(2).commonTab.isn,"77","M","5","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",2)'1
'    Call CheckDB_DOCLOG(grMemOrd(2).commonTab.isn,"77","E","5"," ",1) 
    Call CheckDB_DOCLOG(grMemOrd(2).commonTab.isn,"77","D","999"," ",1)
    'DOCS
    fBODY = "  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
           & "USERID:  77  ACSBRANCH:01  ACSDEPART:1  DOCNUM:" & grMemOrd(2).commonTab.docN & "  DATE:20241017  CUR:001  "_
           & "SUMMA:2170  PAYSYSIN:1  SBQENABLED:1  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grMemOrd(2).commonTab.isn, 1)
    Call CheckDB_DOCS(grMemOrd(2).commonTab.isn, "MemOrdPk", "999", fBODY,1)
     
    'FODLERS
    Call CheckQueryRowCount("FOLDERS","fISN",grMemOrd(2).commonTab.isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    
    Call Close_Window(wMDIClient, "frmPttel" )
    Call Close_AsBank() 
     
End Sub



Sub Test_Initialize_Group_Mem_Ord ()

    sDate = "20050101"
    eDate = "20260101"
    
    Set grMemOrd(0) = New_Group_Mem_Order(0, 0, 0)
    With grMemOrd(0)
         .commonTab.branch = "01"
         .commonTab.dep = "1"
         .commonTab.mDate = "260921"
         .commonTab.accC (0) = "01079643313"
         .commonTab.accC (1) = "76170803313" 
         .commonTab.accC (2) = "76182293313"
         .commonTab.accD (0) = "01079563313" 
         .commonTab.accD (1) = "01082933313" 
         .commonTab.accD (2) = "76170983313"
         .commonTab.curr = "000"
         .commonTab.sum(0) = "50,000.00"
         .commonTab.sum(1) = "92,000.00"
         .commonTab.sum(2) = "1,500.00"
         .commonTab.fullSum = "143,500.00"
         .commonTab.aim (0) = "a"
         .commonTab.aim (1) = "b"
         .commonTab.aim (2) = "c"
         .commonTab.accCount = 3
         .commonTab.paysys = "3"
         .attachTab.TabN = 2
    End With
    
    Set grMemOrd(1) = New_Group_Mem_Order(0, 0, 0)
    With grMemOrd(1)
         .commonTab.branch = "01"
         .commonTab.dep = "1"
         .commonTab.mDate = "171024"
         .commonTab.accC (0) = "01066023321"
         .commonTab.accC (1) = "77002823313" 
         .commonTab.accC (2) = "77005483321"         
         .commonTab.accD (0) = "01062063321" 
         .commonTab.accD (1) = "01067923321" 
         .commonTab.accD (2) = "01058933313"
         .commonTab.curr = "001"
         .commonTab.sum(0) = "1,150.00"
         .commonTab.sum(1) = "20.00"
         .commonTab.sum(2) = "1,000.00"
         .commonTab.fullSum = "2,170.00"
         .commonTab.aim (0) = ""
         .commonTab.aim (1) = ""
         .commonTab.aim (2) = ""
         .commonTab.accCount = 3
         .commonTab.paysys = "1"
         .attachTab.TabN = 2
    End With
    
    Set grMemOrd(2) = New_Group_Mem_Order(0, 0, 0)
    With grMemOrd(2)
         .commonTab.branch = "01"
         .commonTab.dep = "1"
         .commonTab.mDate = "17/10/24"
         .commonTab.accC (0) = "01066023321"
         .commonTab.accC (1) = "77002823313" 
         .commonTab.accC (2) = "77005483321"
         .commonTab.accD (0) = "01062063321" 
         .commonTab.accD (1) = "01067923321" 
         .commonTab.accD (2) = "01058933313"
         .commonTab.curr = "001"
         .commonTab.sum(0) = "1,150.00"
         .commonTab.sum(1) = "20.00"
         .commonTab.sum(2) = "1,000.00"
         .commonTab.fullSum = "2,170.00"
         .commonTab.aim (0) = "1"
         .commonTab.aim (1) = "2"
         .commonTab.aim (2) = "3"
         .commonTab.accCount = 3
         .commonTab.paysys = "1"
         .attachTab.TabN = 2
    End With
    
    pathExp = Project.Path & "Stores\MemorialOrder\Group_Mem_Ord_Exp.txt" 
    
    Set workingDocs = New_MainAccWorkingDocuments()
    With workingDocs
         .startDate = "260921"
				     .endDate = "171024"
    End With

End Sub

Sub Intitialize_DB_Group_Mem_Order (fISN,fDOCN)
    Dim tday
    
    tday = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"20%y%m%d")
    Set dbFOLDERS(0) = New_DB_FOLDERS()
    With dbFOLDERS(0) 
        .fFOLDERID = "Oper.20210926"
        .fNAME = "MemOrdPk"
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "ÊÙµ³ÛÇÝ ÑÇß³ñ³ñ ûñ¹»ñ"
        .fSPEC = fDOCN & "                                       143500.00000Üáñ                                                   "_
                 &"77                                                                                       3                                   "_
                 &"                                                                                                                 "
        .fECOM = "Group Memorial Order"
        .fDCBRANCH = "01 "
        .fDCDEPART = "1  "
    End With
    
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1) 
        .fFOLDERID = "Oper.20241017"
        .fNAME = "MemOrdPk"
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "ÊÙµ³ÛÇÝ ÑÇß³ñ³ñ ûñ¹»ñ"
        .fSPEC = fDOCN & "                                         2170.00001ÊÙµ³·ñíáÕ                                             "_
                 &"77                                                                                       1                   "_
                 &"                                                                                                                                 "
        .fECOM = "Group Memorial Order"
        .fDCBRANCH = "01 "
        .fDCDEPART = "1  "
    End With
    
    Set dbFOLDERS(2) = New_DB_FOLDERS()
    With dbFOLDERS(2) 
        .fFOLDERID = ".R."&tday
        .fNAME = "MemOrdPk"
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "0"
        .fCOM = ""
        .fSPEC = Left_Align(Get_Compname_DOCLOG(fISN), 16) & "GlavBux ARMSOFT                       115  "
        .fECOM = ""
        .fDCBRANCH = "01 "
        .fDCDEPART = "1  "
    End With
    
    sumSQLcur(0) = "460000.00"
    sumSQLcur(1) = "8000.00"
    sumSQLcur(2) = "400000.00"
    
    sumHirest(0) = "460000.00"
    sumHirest(1) = "8000.00"
    sumHirest(2) = "400000.00"
    
    dSumHirest(0) = "5342.80"
    dSumHirest(1) = "22853.40"
    dSumHirest(2) = "-1635899.60"
    cSumHirest(0) = "-460000.00"
    cSumHirest(1) = "-8000.00"
    cSumHirest(2) = "-610600.60"
    dSumHirestCur(0) = "-14.70"
    dSumHirestCur(1) = "-1.51"
    dSumHirestCur(2) = "-3847.38"
    cSumHirestCur(0) = "-1150.00"
    cSumHirestCur(1) = "-20.00"
    cSumHirestCur(2) = "-1501.43"    
    
End Sub


