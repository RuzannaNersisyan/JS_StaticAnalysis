'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Mem_Order_Library
'USEUNIT Library_Colour
'USEUNIT Library_CheckDB
'USEUNIT Mortgage_Library
'USEUNIT Library_Contracts
'USEUNIT DAHK_Library_Filter
'USEUNIT Payment_Except_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Main_Accountant_Filter_Library

Option Explicit
'Test Case ID- 179455
Dim dbFOLDERS(3)

Sub Memorial_Order1_Test ()
    Dim sDate, eDate,Memorder(2),savePath,Path1,Path2,regex
    Dim fBODY, daccisn, caccisn, workingDocs
    Dim folderDirect, stDate, enDate, wUser, docType, wName, passNum, cliCode, paySysIn, paySysOut, acsBranch
    Dim acsDepart, docISN, selectedView, expExcel
    'Մուտք գործել ծրագիր ARMSOFT օգտագործողով
    sDate = "20050101"
    eDate = "20250101"
    Call Initialize_AsBank("bank", sDATE, eDATE)
    Call Login ("ARMSOFT")
  
' ---------------------------------------------------------
' ---------------Ստեղծել հիշարար օրդեր-------------------------
' ---------------------------------------------------------
 
    Log.Message  "Հիշարար օրդերի ստեղծում",,,DivideColor

    Set Memorder(1) = New_Memorder () 
  
    With Memorder(1)
        .Div = "00"
        .Dep = "1"
        .MDate = "010122"
        .AccD = "73030121000"
        .AccC = "000048200  "
        .Curr = "000"
        .Sum = "1,000.00"
        .Aim = "Ð³Ù³Ó³ÛÝ å³ÛÙ³Ý³·ñÇ"
        .Paysys = "8"
    End With 

    Set Memorder(2) = New_Memorder()

    'Խմբագրվող տվյալներ
    With Memorder(2)
        .Div = "00"
        .Dep = "1"
        .AccD = "73030121000"
        .AccC = "000048200  "
        .Curr = "000"
        .Aim = "Ð³Ù³Ó³ÛÝ å³ÛÙ³Ý³·ñÇ" 
        .MDate = "020122" 
        .Sum = "1,500.00"
        .Paysys = "Ð"
    End With 
  

    caccisn = GetAccountISN(Memorder(1).AccC)
    daccisn = GetAccountISN(Memorder(1).AccD)
    
    'Մուտք գլխավոր հաշվապահի ԱՇՏ| Հաշիվներ
    Call ChangeWorkspace(c_ChiefAcc)
    
    Call OpenAccauntsFolder ("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|Ð³ßÇíÝ»ñ","1","","","","","","","","",0,"","","","","",0,0,0,"","","","","","ACCS","0")
'   Հիշարար օրդեր փաստաթղթի ստեղծում
    Call Create_Memorder (Memorder(1)) 

'-----Օրդերի տեքստային ֆայլի պահպանում և համեմատում Memorder_Exp ֆայլի հետ-----
    savePath = Project.Path &  "Stores\MemorialOrder\"
    Call SaveDoc(savePath, "Memorder_Actual")
  
    Path2 = Project.Path &  "Stores\MemorialOrder\Memorder_Actual.txt"
    Path1 = Project.Path &  "Stores\MemorialOrder\Memorder_Exp.txt"
    regex=".*\s*.*\sN\s\d{1,6}\s*.\d{1,10}\s{0,}.*\s.*\s.*\s.*Date\s\d{1,2}.\d{1,2}.\d{1,2}\s\d{1,2}:\d{1,2}"
    Call Compare_Files(Path2, Path1, regex)
   
    Call Intitialize_DB_Memorder (Memorder(1).Isn,Memorder(1).DocN)
    'SQL ստուգում DOCS աղյուսակում
    fBODY = "  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  USERID:  77  "_
               &"ACSBRANCH:00  ACSDEPART:1  DOCNUM:"&Memorder(1).DocN&"  DATE:20220101  ACCDB:73030121000  ACCCR:000048200  CUR:000  SUMMA:1000"_
               &"  AIM:Ð³Ù³Ó³ÛÝ å³ÛÙ³Ý³·ñÇ  PAYSYSIN:8  USEOVERLIMIT:0  NOTSENDABLECR:0  NOTSENDABLEDB:0  SBQENABLED:1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",Memorder(1).Isn,1)
    Call CheckDB_DOCS(Memorder(1).Isn,"MemOrd  ","10",fBODY,1)

    'SQL ստուգում DOCLOG աղյուսակում
    Call CheckQueryRowCount("DOCLOG","fISN",Memorder(1).Isn,2)
    Call CheckDB_DOCLOG(Memorder(1).Isn,"77","C","10"," ",1)
    Call CheckDB_DOCLOG(Memorder(1).Isn,"77","N","1"," ",1)

    'SQL ստուգում FOLDERS աղյուսակում
    Call CheckQueryRowCount("FOLDERS","fISN",Memorder(1).Isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)

    'SQL ստուգում HI աղյուսակում
    Call Check_HI_CE_accounting ("20220101",Memorder(1).Isn, "11", caccisn ,"1000.00", "000", "1000.00", "MSC", "C")
    Call Check_HI_CE_accounting ("20220101",Memorder(1).Isn, "11", daccisn ,"1000.00", "000", "1000.00", "MSC", "D")

    'SQL ստուգում HIREST աղյուսակում     
    Call CheckDB_HIREST("11", caccisn , "-1000.00" ,"000", "-1000.00", 1)
    Call CheckDB_HIREST("11", daccisn , "1000.00" ,"000", "1000.00", 1)
     
    'Օրդերի և Հաշիվներ pttel-ի փակում
    Call Close_Window(wMDIClient, "FrmSpr" )
    Call Close_Window(wMDIClient, "frmPttel")

' ----------------------------------------------------------
' ----Դիտել և Խմբագրել ստեղծված հիշարար օրդերը--------------------
' ----------------------------------------------------------
 
    Log.Message  "Հիշարար օրդերի դիտում և խմբագրում",,,DivideColor

    'Բացել աշխատանքային փաստաթղթեր  թղթապանակը-ը
    Set workingDocs = New_MainAccWorkingDocuments()
    With workingDocs
         .startDate = Memorder(1).MDate
				     .endDate = Memorder(2).MDate
    End With
    Call GoTo_MainAccWorkingDocuments("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|", workingDocs)
    Memorder(1).MDate = "01/01/22"
    Call View_Memorder(Memorder(1),"frmPttel") 
    
    Call Edit_Memorder(Memorder(1),Memorder(2),0,"frmPttel")
    Memorder(2).MDate = "02/01/22"
    Call View_Memorder(Memorder(2),"frmPttel")

    'SQL ստուգում DOCLOG աղյուսակում 
    Call CheckQueryRowCount("DOCLOG","fISN",Memorder(1).Isn,3)
    Call CheckDB_DOCLOG(Memorder(1).Isn,"77","E","10"," ",1)
    
    'SQL ստուգում DOCS աղյուսակում
    fBODY = "  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  USERID:  77  "_
            &"ACSBRANCH:00  ACSDEPART:1  DOCNUM:"&Memorder(1).DocN&"  DATE:20220102  ACCDB:73030121000  ACCCR:000048200  CUR:000  SUMMA:1500  "_
            &"AIM:Ð³Ù³Ó³ÛÝ å³ÛÙ³Ý³·ñÇ  PAYSYSIN:Ð  USEOVERLIMIT:0  NOTSENDABLECR:0  NOTSENDABLEDB:0  SBQENABLED:1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",Memorder(1).Isn,1)
    Call CheckDB_DOCS(Memorder(1).Isn,"MemOrd  ","10",fBODY,1)
    
    'SQL ստուգում FOLDERS աղյուսակում
    Call CheckQueryRowCount("FOLDERS","fISN",Memorder(1).Isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    
    'SQL ստուգում HIREST աղյուսակում     
    Call CheckDB_HIREST("11", caccisn , "-1500.00" ,"000", "-1500.00", 1)
    Call CheckDB_HIREST("11", daccisn , "1500.00" ,"000", "1500.00", 1)

' ----------------------------------------------------------
' ---------------Հաշվառել հիշարար օրդերը------------------------
' ---------------------------------------------------------- 
    Log.Message  "Հիշարար օրդերի հաշվառում",,,DivideColor
    Call SearchInPttel ("frmPttel", 2, Memorder(1).DocN)
    Call Register_Payment()

    'SQL ստուգում DOCLOG աղյուսակում 
    Call CheckQueryRowCount("DOCLOG","fISN",Memorder(1).Isn,4)
    Call CheckDB_DOCLOG(Memorder(1).Isn,"77","M","5","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)

    'SQL ստուգում DOCS աղյուսակում
    fBODY = "  OPERTYPE:MSC  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
            &"USERID:  77  ACSBRANCH:00  ACSDEPART:1  DOCNUM:"&Memorder(1).DocN&"  DATE:20220102  ACCDB:73030121000  ACCCR:000048200  CUR:000  SUMMA:1500  "_
            &"AIM:Ð³Ù³Ó³ÛÝ å³ÛÙ³Ý³·ñÇ  PAYSYSIN:Ð  USEOVERLIMIT:0  NOTSENDABLECR:0  NOTSENDABLEDB:0  SBQENABLED:1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",Memorder(1).Isn,1)
    Call CheckDB_DOCS(Memorder(1).Isn,"MemOrd  ","5",fBODY,1)
    
    'SQL ստուգում FOLDERS աղյուսակում
    Call CheckQueryRowCount("FOLDERS","fISN",Memorder(1).Isn,0)
    
    'SQL ստուգում HIREST աղյուսակում     
    Call CheckDB_HIREST("11", caccisn , "0" ,"000", "0", 2)
    Call CheckDB_HIREST("11", daccisn , "0" ,"000", "0", 2)
    Call CheckDB_HIREST("01", caccisn , "1995760.00" ,"000", "1995760.00", 1)
    Call CheckDB_HIREST("01", daccisn , "1500.00" ,"000", "1500.00", 1) 
    
    'SQL ստուգում MEMORDER աղյուսակում    
    Call CheckDB_MEMORDERS(Memorder(1).Isn,"MemOrd  ","1","20220102","5","1500.00","000",1)
    
    Call Close_Window(wMDIClient, "frmPttel")
    
    'Մուտք հաշվառված վճարային փաստաթղթեր թղթապանակ  
    folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
    stDate = "010122"
    enDate = "010123"
    wUser = ""
    docType = "MemOrd "
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
    
' ----------------------------------------------------------
' ----------Դիտել և խմբագրել հաշվառված հիշարար օրդերը------------
' ----------------------------------------------------------

    Log.Message  "Հաշվառված Հիշարար օրդերի Խմբագրում և Դիտում",,,DivideColor
  
    With Memorder(1)
        .MDate ="02/01/22"
        .Sum = "1,500.00"
        .Paysys = "Ð"
    End With 
  
    With Memorder(2)
         .MDate ="020122"
         .Aim =  "123456789011121314151617181920Üå³ï³Ï 123456789011121314151617181920Üå³ï³Ï 123456789011121314151617181920Üå³ï³Ï 12345678901112131415161718192" '140 նիշ
    End With
    Call View_Memorder(Memorder(1),"frmPttel")
    Call Edit_Memorder(Memorder(1),Memorder(2),1,"frmPttel")
     
    'SQL ստուգում DOCLOG աղյուսակում   
    Call CheckQueryRowCount("DOCLOG","fISN",Memorder(1).Isn,5)
    Call CheckDB_DOCLOG(Memorder(1).Isn,"77","E","5","",1)
    
    'SQL ստուգում DOCS աղյուսակում
    fBODY = "  OPERTYPE:MSC  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
            &"USERID:  77  ACSBRANCH:00  ACSDEPART:1  DOCNUM:"&Memorder(1).DocN&"  DATE:20220102  ACCDB:73030121000  ACCCR:000048200  CUR:000  SUMMA:1500  AIM:"_
            &Memorder(2).Aim&"  PAYSYSIN:Ð  USEOVERLIMIT:0  NOTSENDABLECR:0  NOTSENDABLEDB:0  SBQENABLED:1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",Memorder(1).Isn,1)
    Call CheckDB_DOCS(Memorder(1).Isn,"MemOrd  ","5",fBODY,1)

    'SQL ստուգում MEMORDERS աղյուսակում    
    Call CheckDB_MEMORDERS(Memorder(1).Isn,"MemOrd  ","1","20220102","5","1500.00","000",1)
    Memorder(2).MDate ="02/01/22"
    Call View_Memorder(Memorder(2),"frmPttel")
    
' ----------------------------------------------------------
' ---------------Ջնջել ստեղծված հիշարար օրդերը------------------------------
' ----------------------------------------------------------
 
    Log.Message  "Հիշարար օրդերի ջնջում",,,DivideColor

    If WaitForPttel("frmPttel") Then
        Call SearchAndDelete( "frmPttel", 2, Memorder(1).DocN , "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ" )
    Else
        Log.Error "Can't Open Աշխատանքային փաստաթղթեր Pttel",,,ErrorColor
    End If

    'SQL ստուգում DOCLOG աղյուսակում   
    Call CheckQueryRowCount("DOCLOG","fISN",Memorder(1).Isn,6)
    Call CheckDB_DOCLOG(Memorder(1).Isn,"77","D","999","",1)
    
    'SQL ստուգում DOCS աղյուսակում
    fBODY = "  OPERTYPE:MSC  TYPECODE1:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"_
            &"  USERID:  77  ACSBRANCH:00  ACSDEPART:1  DOCNUM:"&Memorder(1).DocN&"  DATE:20220102  ACCDB:73030121000  ACCCR:000048200  CUR:000  SUMMA:1500  AIM:"_
            &Memorder(2).Aim&"  PAYSYSIN:Ð  USEOVERLIMIT:0  NOTSENDABLECR:0  NOTSENDABLEDB:0  SBQENABLED:1  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",Memorder(1).Isn,1)
    Call CheckDB_DOCS(Memorder(1).Isn,"MemOrd  ","999",fBODY,1)
    
    'SQL ստուգում FOLDERS աղյուսակում
    Call CheckQueryRowCount("FOLDERS","fISN",Memorder(1).Isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(3),0)
  
    'SQL ստուգում MEMORDERS աղյուսակում
    Call CheckDB_MEMORDERS(Memorder(1).Isn,"MemOrd  ","1","20220102","5","1500.00","000",0)
    
    'SQL ստուգում HIREST աղյուսակում     
    Call CheckDB_HIREST("11", caccisn , "0" ,"000", "0", 2)
    Call CheckDB_HIREST("11", daccisn , "0" ,"000", "0", 2) 
    Call CheckDB_HIREST("01", caccisn , "1997260.00" ,"000", "1997260.00", 6)
    Call CheckDB_HIREST("01", daccisn , "0" ,"000", "0", 7)   
  
  
    Call Close_AsBank()
End Sub


Sub Intitialize_DB_Memorder (fISN,fDOCN)
    Dim tday
    
    tday = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"20%y%m%d")
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1) 
        .fFOLDERID = "Oper.20220101"
        .fNAME = "MemOrd  "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "ÐÇß³ñ³ñ ûñ¹»ñ"
        .fSPEC = fDOCN & "777007303012100077700000048200           1000.00000Üáñ                                                   "_
                 &"77                                                                                       8        "_
                 &"Ð³Ù³Ó³ÛÝ å³ÛÙ³Ý³·ñÇ                                                                                                                         "
        .fECOM = "Memorial Order"
        .fDCBRANCH = "00 "
        .fDCDEPART = "1  "
    End With
      
    Set dbFOLDERS(2) = New_DB_FOLDERS()
    With dbFOLDERS(2) 
        .fFOLDERID = "Oper.20220102"
        .fNAME = "MemOrd  "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "ÐÇß³ñ³ñ ûñ¹»ñ"
        .fSPEC = fDOCN & "777007303012100077700000048200           1500.00000ÊÙµ³·ñíáÕ                                             "_
                 &"77                                                                                       Ð        "_
                 &"Ð³Ù³Ó³ÛÝ å³ÛÙ³Ý³·ñÇ                                                                                                                         "
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
        .fSPEC = Left_Align(Get_Compname_DOCLOG(fISN), 16)&"GlavBux ARMSOFT                       115  "
        .fECOM = "Memorial Order"
        .fDCBRANCH = "00 "
        .fDCDEPART = "1  "
    End With
      
End Sub