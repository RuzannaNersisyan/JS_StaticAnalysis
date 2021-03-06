 Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT DAHK_Libraray
'USEUNIT Library_Contracts
'USEUNIT Mem_Order_Library
'USEUNIT Library_Colour
'USEUNIT Main_Accountant_Filter_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Payment_Except_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_CheckDB

'Test case ID 187584

Dim sDATE, fDATE, recieved, filter, workingDocs, grMemOrd(1), payOrd(1), verifDoc, amBlocking(4)
Dim editableFilter, answer(1), sentFilter, blockFilter, savePath, pathAct, pathExp, query
Dim dbACCOUNTS(1), dbFOLDERS(5), dbHI(3), dateSQL, i , j, dbPAYMENTS, Path2, Path1, regex, sortArray (1)

Sub DAHK_Group_Confiscation_Test()
    
    Dim folderDirect, stDate, enDate, wUser, docType,wName, passNum, cliCode,paySysIn, paySysOut, acsBranch,acsDepart, docISN, selectedView, expExcel                                         
    Dim blockIsn(2),fBODY, sumSQL
    
    Call Test_Initialize_DAHK_Group_Conf()
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Login ("ARMSOFT")
    
    'Հաղորդագրությունների ընդունում SQL Հարցման միջոցով
    'Call SQL_Import_DAHK()
    
    'Հաղորդագրությունների առկայության ստուգում DAHKATTACH և DAHKCATCH SQL աղյուսակներում
    Call CheckQueryRowCount("DAHKATTACH","fMESSAGEID","º01000008034",1)
    Call CheckQueryRowCount("DAHKATTACH","fMESSAGEID","º01000239589",1)
    Call CheckQueryRowCount("DAHKATTACH","fMESSAGEID","º01000239600",1)
    
    Call CheckQueryRowCount("DAHKCATCH","fMESSAGEID","º02000008034",1)
    Call CheckQueryRowCount("DAHKCATCH","fMESSAGEID","º02000239589",1)
    Call CheckQueryRowCount("DAHKCATCH","fMESSAGEID","º02000239600",1)
    'Անցնել ԴԱՀԿ հաղ. մշակման ԱՇՏ
    Call ChangeWorkspace(c_DAHK)
    Call Go_To_Recieved_Messages_DAHK(recieved, "|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|ÀÝ¹áõÝí³Í Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ")

'------------------------------------------------------------------------------
'--------------------Գումարների արգելադրում----------------------------------------
'------------------------------------------------------------------------------
    Log.Message "Գումարների արգելադրում",,,DivideColor     
    
    'Արգելանքների խմբավորում Insert կոճակի միջոցով
    If SearchInPttel("frmPttel", 2 , "º01000008034" ) Then
        wMDIClient.VBObject("frmPttel").VBObject("TDBGView").Keys("[Ins]")
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If 
    If SearchInPttel("frmPttel", 2 , "º01000239589" ) Then
        wMDIClient.VBObject("frmPttel").VBObject("TDBGView").Keys("[Ins]")
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If 
    If SearchInPttel("frmPttel", 2 , "º01000239600" ) Then
        wMDIClient.VBObject("frmPttel").VBObject("TDBGView").Keys("[Ins]")
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    'Գումարների Արգելադրում
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_BlockMoney) 
    If MessageExists(2 , "Î³ï³ñ»±É ·áõÙ³ñÝ»ñÇ ³ñ·»É³¹ñáõÙ") Then 
        Call ClickCmdButton(5, "²Ûá")
        If MessageExists(2 , "¶áñÍáÕáõÃÛ³Ý µ³ñ»Ñ³çáÕ ³í³ñï") Then
            Call ClickCmdButton(5, "OK")
        End If
    End If 
    wMDIClient.VBObject("frmPttel").VBObject("TDBGView").Keys("[NumMinus]")
    
    'SQL
    Log.Message "SQL Ստուգումներ Գումարների Արգելադրում գործողությունը կատարելուց հետո",,,SqlDivideColor
    'Գումարների Արգելադրումների isn-ների ստացում
    'º01000008034
    blockIsn(0) = GetSQL_ColumnValue("FOLDERS", "fKEY", "º01000008034", "fISN")
    Log.Message "º01000008034 Block fISN = " & blockIsn(0),,,SqlDivideColor
    'º01000239589
    blockIsn(1) = GetSQL_ColumnValue("FOLDERS", "fKEY", "º01000239589", "fISN")
    Log.Message "º01000239589 Block fISN = " & blockIsn(1),,,SqlDivideColor
    'º01000239600
    blockIsn(2) = GetSQL_ColumnValue("FOLDERS", "fKEY", "º01000239600", "fISN")
    Log.Message "º01000239600 Block fISN = " & blockIsn(2),,,SqlDivideColor
    Call SQL_Initialize_DAHK_Group_Conf_1(blockIsn(0),"")
    'ACCOUNTS
    Call Check_DB_ACCOUNTS(dbACCOUNTS(0),1)
    Call Check_DB_ACCOUNTS(dbACCOUNTS(1),1)
    
    'DOCLOG
    'º01000008034
    Call CheckQueryRowCount("DOCLOG","fISN",blockIsn(0),1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","N","1"," ",1)
    'º01000239589
    Call CheckQueryRowCount("DOCLOG","fISN",blockIsn(1),1)
    Call CheckDB_DOCLOG(blockIsn(1),"77","N","1"," ",1) 
    'º01000239600
    Call CheckQueryRowCount("DOCLOG","fISN",blockIsn(2),1)
    Call CheckDB_DOCLOG(blockIsn(2),"77","N","1"," ",1)
    
    'DOCSG
    'º01000008034
    Call CheckQueryRowCount("DOCSG","fISN",blockIsn(0),8)
    Call CheckDB_DOCSG(blockIsn(0),"BLOCKEDACCOUNTS", "0" , "ACC", "00066610100", 1)
    Call CheckDB_DOCSG(blockIsn(0),"BLOCKEDACCOUNTS", "1" , "ACC", "00066610401", 1) 
    Call CheckDB_DOCSG(blockIsn(0),"BLOCKEDACCOUNTS", "0" , "AMOUNTBLCUR", "15989.7", 1) 
    Call CheckDB_DOCSG(blockIsn(0),"BLOCKEDACCOUNTS", "1" , "AMOUNTBLCUR", "17090.3", 1)
    Call CheckDB_DOCSG(blockIsn(0),"BLOCKEDACCOUNTS", "0" , "AMOUNTCUR", "15989.7", 1) 
    Call CheckDB_DOCSG(blockIsn(0),"BLOCKEDACCOUNTS", "1" , "AMOUNTCUR", "42.73", 1) 
    Call CheckDB_DOCSG(blockIsn(0),"BLOCKEDACCOUNTS", "0" , "CUR", "000", 1)    
    Call CheckDB_DOCSG(blockIsn(0),"BLOCKEDACCOUNTS", "1" , "CUR", "001", 1)  
    'º01000239589
    Call CheckQueryRowCount("DOCSG","fISN",blockIsn(0),8)
    Call CheckDB_DOCSG(blockIsn(1),"BLOCKEDACCOUNTS", "0" , "ACC", "00066610401", 1)
    Call CheckDB_DOCSG(blockIsn(1),"BLOCKEDACCOUNTS", "0" , "AMOUNTBLCUR", "1187210", 1) 
    Call CheckDB_DOCSG(blockIsn(1),"BLOCKEDACCOUNTS", "0" , "AMOUNTCUR", "2968.03", 1) 
    Call CheckDB_DOCSG(blockIsn(1),"BLOCKEDACCOUNTS", "0" , "CUR", "001", 1)    
    
    'FOLDERS
    'º01000008034
    Call CheckQueryRowCount("FOLDERS","fISN",blockIsn(0),3) 
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    With dbFOLDERS(0)
        .fFOLDERID = "BLOCK.00000666"
        .fSPEC ="000006661        33080.00        33080.00000            0.00"&dateSQL&"00000000000000023630000007790000000000            0.00        1"  
    End With 
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    'º01000239589
    Call CheckQueryRowCount("FOLDERS","fISN",blockIsn(1),3) 
    With dbFOLDERS(0)
        .fFOLDERID = "BLOCK"
        .fISN = blockIsn(1)
        .fKEY = "º01000239589"
        .fSPEC ="000006661      1187210.00      1187210.00000            0.00"&dateSQL&"00000000000000231981111111112000000000            0.00        "  
    End With 
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    With dbFOLDERS(0)
        .fFOLDERID = "BLOCK.00000666"
        .fSPEC ="000006661      1187210.00      1187210.00000            0.00"&dateSQL&"00000000000000231981111111112000000000            0.00        1"  
    End With
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    With dbFOLDERS(1)
        .fFOLDERID = "C.1759218"
        .fISN = blockIsn(1)
        .fKEY = blockIsn(1)
        .fSPEC ="²ÕµÛáõñ` ¸²ÐÎ  ì³ñáõÛÃÇ ID - 00023198  Ü»ñÙáõÍÙ³Ý ³Ùë³ÃÇí - 22/01/18"  
    End With
    'º01000239600
    Call CheckQueryRowCount("FOLDERS","fISN",blockIsn(2),3) 
    With dbFOLDERS(0)
        .fFOLDERID = "BLOCK"
        .fISN = blockIsn(2)
        .fKEY = "º01000239600"
        .fSPEC ="000348551      6667210.00      6667210.00000      6667210.00"&dateSQL&"00000000000000232004859111112000000000            0.00        "  
    End With 
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    With dbFOLDERS(0)
        .fFOLDERID = "BLOCK.00034855"
        .fSPEC ="000348551      6667210.00      6667210.00000      6667210.00"&dateSQL&"00000000000000232004859111112000000000            0.00        1"  
    End With
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    With dbFOLDERS(1)
        .fFOLDERID = "C.125866122"
        .fISN = blockIsn(2)
        .fKEY = blockIsn(2)
        .fSPEC ="²ÕµÛáõñ` ¸²ÐÎ  ì³ñáõÛÃÇ ID - 00023200  Ü»ñÙáõÍÙ³Ý ³Ùë³ÃÇí - 22/01/20"  
    End With
    'HI
    'º01000008034
    Call CheckQueryRowCount("HI","fBASE",blockIsn(0),2) 
    Call Check_DB_HI(dbHI(0),1)
    With dbHI(0)
        .fCUR = "000"
        .fCURSUM = "15989.70"
        .fSPEC = "00066610100ê³é»óáõÙ(¸²ÐÎ ²ñ·»É³¹ñáõÙ)                                                                                                                  "
    End With 
    Call Check_DB_HI(dbHI(0),1)
    'º01000239589 
    Call CheckQueryRowCount("HI","fBASE",blockIsn(1),1)
    With dbHI(0)
        .fBASE = blockIsn(1)
        .fCUR = "001"
        .fCURSUM = "2968.03"
        .fSPEC = "00066610401ê³é»óáõÙ(¸²ÐÎ ²ñ·»É³¹ñáõÙ)                                                                                                                  "
    End With 
    Call Check_DB_HI(dbHI(0),1) 
    
    'HIREST
    Call CheckDB_HIREST("LL", "153039633" , "0.00" ,"001", "-3010.76", 1)
    Call CheckDB_HIREST("LL", "899982624" , "0.00" ,"000", "-15989.70", 1)
    
    
    
'------------------------------------------------------------------------------
'----------------------Խմբային Բռնագանձում----------------------------------------
'------------------------------------------------------------------------------ 
    Log.Message "Խմբային Բռնագանձում",,,DivideColor   
    
    'Բռնագանձումների խմբավորում Insert կոճակի միջոցով
    If SearchInPttel ("frmPttel", 2 ,"º02000008034") Then
        wMDIClient.VBObject("frmPttel").VBObject("TDBGView").Keys("[Ins]")
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If       
    If SearchInPttel ("frmPttel", 2 ,"º02000239589") Then
        wMDIClient.VBObject("frmPttel").VBObject("TDBGView").Keys("[Ins]")
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    If SearchInPttel ("frmPttel", 2 ,"º02000239600") Then
        wMDIClient.VBObject("frmPttel").VBObject("TDBGView").Keys("[Ins]")
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    'Կատարել Խմբային Բռնագանձում գործողությունը

    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_GroupCatch)       
    BuiltIn.Delay(1500)
    'Փակել Ընդունված հաղորդագրություններ Հաշվետվությունը
    If wMDIClient.WaitVBObject("FrmSpr", 3000).Exists Then 
        Call SaveDoc(savePath,"Conf_Error_Act" )
        Call Compare_Files(pathAct, pathExp,"")
        Call Close_Window(wMDIClient, "FrmSpr")
    Else 
        Log.Error "Error not found"
    End If    

    'Փակել Ընդունված հաղորդագրություններ Հաշվետվությունը
    Call Close_Window(wMDIClient, "frmPttel")
    
    Log.Message "Անցում Գլխավոր Հաշվապահի ԱՇՏ",,,DivideColor       
    'Անցում Գլխավոր Հաշվապահի ԱՇՏ
    Call ChangeWorkspace(c_ChiefAcc)
    'Մուտք գործել Աշխատանքային փաստաթղթեր թղթապանակ
    Call GoTo_MainAccWorkingDocuments("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|", workingDocs)
    With filter
        .val(0) = "ÊÙµ³ÛÇÝ ÑÇß³ñ³ñ ûñ¹»ñ"
    End With
    Call Pttel_Filtering(filter, "frmPttel")

'------------------------------------------------------------------------------
'--------------Խմբային Հիշարար օրդերների հաշվառում-----------------------------------
'------------------------------------------------------------------------------
    
    If SearchInPttel("frmPttel", 8 , "2968.03") Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        BuiltIn.Delay(2000)
        If wMDIClient.WaitVBObject("frmASDocForm",1000).exists Then 
            grMemOrd(0).docN = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
            Call Group_Mem_Order_Cur_Check(grMemOrd(0))
            Call ClickCmdButton(1, "OK")
            Log.Message "2,968.03 Memorder(0) fISN = "& grMemOrd(0).isn,,,SqlDivideColor
            Log.Message grMemOrd(0).docN
        Else 
            Log.Error "Document Window not found",,,ErrorColor 
        End If
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    If SearchInPttel("frmPttel", 8 , "33080") Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        BuiltIn.Delay(2000)
        If wMDIClient.WaitVBObject("frmASDocForm",1000).exists Then    
            grMemOrd(1).docN = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
            Call Group_Mem_Order_Cur_Check(grMemOrd(1))
            Call ClickCmdButton(1, "OK")
        Else 
            Log.Error "Document Window not found",,,ErrorColor 
        End If           
        Log.Message "33,080 Memorder(1) = "& grMemOrd(1).isn,,,SqlDivideColor
        Log.Message grMemOrd(1).docN
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If 
    
    'SQL
    Log.Message "SQL Ստուգումներ Խմբային Բռնագաձում գործողությունից հետո",,,SqlDivideColor
    Call SQL_Initialize_DAHK_Group_Conf_2(grMemOrd(0).isn,grMemOrd(0).docN)
    'DOCLOG
    'º01000008034
    Call CheckQueryRowCount("DOCLOG","fISN",blockIsn(0),3)
    Call CheckDB_DOCLOG(blockIsn(0),"77","N","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","E","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","M","1","CREATED",1)
    Call CheckQueryRowCount("DOCLOG","fISN",grMemOrd(0).isn,1)
    Call CheckDB_DOCLOG(grMemOrd(0).isn,"77","N","9"," ",1)
    'º01000239589
    Call CheckQueryRowCount("DOCLOG","fISN",blockIsn(1),3)
    Call CheckDB_DOCLOG(blockIsn(1),"77","N","1"," ",1) 
    Call CheckDB_DOCLOG(blockIsn(1),"77","E","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(1),"77","M","1","CREATED",1)
    Call CheckQueryRowCount("DOCLOG","fISN",grMemOrd(1).isn,1)
    Call CheckDB_DOCLOG(grMemOrd(1).isn,"77","N","9"," ",1) 
        
    'DOCS   
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  USERID:  77"_
    &"  ACSBRANCH:00  ACSDEPART:1  DOCNUM:"&grMemOrd(0).docN&"  DATE:"&dateSQL&"  INCACCCUREX:000931900  EXPACCCUREX:001434300  PAYSYSIN:Ð  "_
    &"AMOUNTTOCONF:1187210  USEOVERLIMIT:0  CURTES:1  CURVAIR:3  TIME:"&grMemOrd(0).time&"  SYSCASE:Block  SBQENABLED:1  CATCHMSGID:º02000239589  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grMemOrd(0).isn, 1)
    Call CheckDB_DOCS(grMemOrd(0).isn, "GenOrdPk", "9", fBODY,1)
    
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  USERID:  77"_
    &"  ACSBRANCH:00  ACSDEPART:1  DOCNUM:"&grMemOrd(1).docN&"  DATE:"&dateSQL&"  INCACCCUREX:000931900  EXPACCCUREX:001434300  PAYSYSIN:Ð  "_
    &"AMOUNTTOCONF:33080  USEOVERLIMIT:0  CURTES:1  CURVAIR:3  TIME:"&grMemOrd(1).time&"  SYSCASE:Block  SBQENABLED:1  CATCHMSGID:º02000008034  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grMemOrd(1).isn, 1)
    Call CheckDB_DOCS(grMemOrd(1).isn, "GenOrdPk", "9", fBODY,1)           
        
    'DOCSG
    Call CheckQueryRowCount("DOCSG","fISN",grMemOrd(0).isn,12)
    Call CheckQueryRowCount("DOCSG","fISN",grMemOrd(1).isn,24)
    For j = 0 to 1
        With grMemOrd(j)
            For i = 0 to .opCount - 1 
                Log.Message "i = " & i & "  j = " & j
                Call CheckDB_DOCSG(.isn,"SUBSUMS", i , "ACCCR", .accC(i), 1)
                Call CheckDB_DOCSG(.isn,"SUBSUMS", i , "ACCDB", .accD(i), 1)
                Call CheckDB_DOCSG(.isn,"SUBSUMS", i , "AIM", .aim(i), 1)
                Call CheckDB_DOCSG(.isn,"SUBSUMS", i , "CURCR", .curC(i), 1)
                Call CheckDB_DOCSG(.isn,"SUBSUMS", i , "CURDB", .curD(i), 1)
                sumSQL = Replace(.sumC(i), ",", "")
                sumSQL = Replace(sumSQL, ".00", "")
                If Left(Right(sumSQL,3),1)="." and Right(sumSQL,1) = "0" Then
                    sumSQL = Left(sumSQL,Len(sumSQL)-1)
                End If
                Call CheckDB_DOCSG(.isn,"SUBSUMS", i , "SUMCR", sumSQL , 1)
                sumSQL = Replace(.sumD(i), ",", "")
                sumSQL = Replace(sumSQL, ".00", "")
                If Left(Right(sumSQL,3),1)="." and Right(sumSQL,1) = "0" Then
                    sumSQL = Left(sumSQL,Len(sumSQL)-1)
                End If
                Call CheckDB_DOCSG(.isn,"SUBSUMS", i , "SUMDB", sumSQL , 1)
            Next
        End With
    Next
     
    'FOLDERS
    Call CheckQueryRowCount("FOLDERS","fISN",grMemOrd(0).isn,1)
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    With dbFOLDERS(0) 
        .fKEY = grMemOrd(1).isn
        .fISN = grMemOrd(1).isn
        .fSPEC = grMemOrd(1).docN&"                                        33080.00000Üáñ                                                   77             "_
            &"                                                                          Ð                                                           "_
            &"                                                                                         "
    End With
    Call CheckQueryRowCount("FOLDERS","fISN",grMemOrd(1).isn,1)
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    'HI
    Call CheckQueryRowCount("HI","fBASE",grMemOrd(0).isn,4)
    Call Check_DB_HI(dbHI(0),1) 
    With dbHI(0)
        .fDBCR = "D"
        .fCUR = "001"
        .fCURSUM = "2968.03"
        .fSPEC = grMemOrd(0).docN & "                   ì³ñáõÛÃ-00023198, ´éÝ³·³ÝÓáõÙ-º0201   399.9993    1"
    End With
    Call Check_DB_HI(dbHI(0),1)  
    Call Check_DB_HI(dbHI(1),1)
    With dbHI(1)
        .fCUR = "001"
        .fCURSUM = "0.00"
        .fOP = "MSC"
        .fDBCR = "D"
        .fSPEC = grMemOrd(0).docN&"                   ºÏ³ÙáõïÝ»ñ ³ñï. ÷áË³Ý³ÏáõÙÇó      0   400.0000    1"
    End With   
    Call Check_DB_HI(dbHI(1),1)
    
    
    Call SQL_Initialize_DAHK_Group_Conf_3(grMemOrd(1).isn,grMemOrd(1).docN)
    Call CheckQueryRowCount("HI","fBASE",grMemOrd(1).isn,6)
    
    Call Check_DB_HI(dbHI(0),1)
    
    With dbHI(0)
        .fDBCR = "D"
        .fSPEC = Replace(.fSPEC,"º0200","º0201" )
    End With
    Call Check_DB_HI(dbHI(0),1)
    
    Call Check_DB_HI(dbHI(1),1)
    
    With dbHI(1)
        .fCUR = "001"
        .fCURSUM = "42.73"
        .fDBCR = "D"
        .fSPEC = Replace(.fSPEC,"º0200     1.0000","º0201   399.9602" )
    End With
    Call Check_DB_HI(dbHI(1),1)
    
    Call Check_DB_HI(dbHI(2),1)
    
    With dbHI(2)
        .fCUR = "001"
        .fCURSUM = "0.00"
        .fDBCR = "D"
        .fSPEC = Replace(.fSPEC,"1     1","0   400" )
    End With  
    Call Check_DB_HI(dbHI(2),1)
    
    
    Log.Message "Խմբային Հիշարար օրդերների հաշվառում",,,DivideColor
    'Հաշվառել Հիշարար օրդերները
    For i = 0 to 1
        If SearchInPttel("frmPttel", 2 , grMemOrd(i).docN) Then
            Call Register_Payment()
        End If
        query = "fBODY like '%REFERENCE:"&answer(i).commonTab.reference&"%' and fSTATE <>999"
        answer(i).commonTab.isn = Get_SQL_ColumnValue("DOCS", "fISN", query)
        Log.Message answer(i).commonTab.reference&" Answer fISN = " & answer(i).commonTab.isn,,,SqlDivideColor
    Next
    
    'SQL
    Log.Message "SQL Ստուգումներ Խմբային Հիշարար օրդերների հաշվառումից հետո",,,SqlDivideColor
    Call SQL_Initialize_DAHK_Group_Conf_4(answer(1).commonTab.isn)
    'DAHKCATCH
    Call CheckQueryRowCount("DAHKCATCH","fRESPONSEISN",answer(0).commonTab.isn,1)
    Call CheckQueryRowCount("DAHKCATCH","fRESPONSEISN",answer(1).commonTab.isn,1)
    'DOCLOG
    'º01000008034
    Call CheckQueryRowCount("DOCLOG","fISN",blockIsn(0),4)
    Call CheckDB_DOCLOG(blockIsn(0),"77","N","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","E","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","M","1","CREATED",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","M","1","PROCESSED33080",1)
    'Խմբային Հիշարար օրդեր
    Call CheckQueryRowCount("DOCLOG","fISN",grMemOrd(0).isn,2)
    Call CheckDB_DOCLOG(grMemOrd(0).isn,"77","N","9"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(0).isn,"77","M","5","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    'Բռնագանձման պատասխան
    Call CheckQueryRowCount("DOCLOG","fISN",answer(0).commonTab.isn,1)
    Call CheckDB_DOCLOG(answer(0).commonTab.isn,"77","N","1"," ",1)
    'º01000239589
    Call CheckQueryRowCount("DOCLOG","fISN",blockIsn(1),4)
    Call CheckDB_DOCLOG(blockIsn(1),"77","N","1"," ",1) 
    Call CheckDB_DOCLOG(blockIsn(1),"77","E","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(1),"77","M","1","CREATED",1)
    Call CheckDB_DOCLOG(blockIsn(1),"77","M","1","PROCESSED1187210",1)
    'Խմբային Հիշարար օրդեր
    Call CheckQueryRowCount("DOCLOG","fISN",grMemOrd(1).isn,2)
    Call CheckDB_DOCLOG(grMemOrd(1).isn,"77","N","9"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(1).isn,"77","M","5","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    'Բռնագանձման պատասխան
    Call CheckQueryRowCount("DOCLOG","fISN",answer(1).commonTab.isn,1)
    Call CheckDB_DOCLOG(answer(1).commonTab.isn,"77","N","1"," ",1)
    
    'DOCS   
    'º01000008034 
    'Հիշարար օրդեր
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  USERID:  77"_
    &"  ACSBRANCH:00  ACSDEPART:1  DOCNUM:"&grMemOrd(0).docN&"  DATE:"&dateSQL&"  INCACCCUREX:000931900  EXPACCCUREX:001434300  PAYSYSIN:Ð  "_
    &"AMOUNTTOCONF:1187210  USEOVERLIMIT:0  CURTES:1  CURVAIR:3  TIME:"&grMemOrd(0).time&"  SYSCASE:Block  SBQENABLED:1  CATCHMSGID:º02000239589  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grMemOrd(0).isn, 1)
    Call CheckDB_DOCS(grMemOrd(0).isn, "GenOrdPk", "5", fBODY,1)
    'Բռնագանձման պատասխան
    fBODY = "  REFERENCE:º02000008034  RESPONSEDATE:"&dateSQL&"  RESPONSETRUE:1  RESPSUM1:33080  RESPCUR1:000  BANKHEAD:äáÕáëÛ³Ý äáÕáë  BANKACCOUNTER:"_
            &"ä»ïñáëÛ³Ý ä»ïñáë  TREASNAME:ºñ¨³ÝÇ ÃÇí 1 ·³ÝÓ³å»ï³Ï³Ý µ³ÅÇÝ  TREASACC:900013288015  DEBITORNAME:ÎÏÏ ØÏáÛ³Ý  DEBITORPASS:AK0123456  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", answer(1).commonTab.isn, 1)
    Call CheckDB_DOCS(answer(1).commonTab.isn, "DoCatch ", "1", fBODY,1)    
    
    'º01000239589
    'Հիշարար օրդեր
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  TYPECODE2:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  USERID:  77"_
    &"  ACSBRANCH:00  ACSDEPART:1  DOCNUM:"&grMemOrd(1).docN&"  DATE:"&dateSQL&"  INCACCCUREX:000931900  EXPACCCUREX:001434300  PAYSYSIN:Ð  "_
    &"AMOUNTTOCONF:33080  USEOVERLIMIT:0  CURTES:1  CURVAIR:3  TIME:"&grMemOrd(1).time&"  SYSCASE:Block  SBQENABLED:1  CATCHMSGID:º02000008034  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grMemOrd(1).isn, 1)
    Call CheckDB_DOCS(grMemOrd(1).isn, "GenOrdPk", "5", fBODY,1)  
    'Բռնագանձման պատասխան
    fBODY = "  REFERENCE:º02000239589  RESPONSEDATE:"&dateSQL&"  RESPONSETRUE:1  RESPSUM1:1187210  RESPCUR1:000  BANKHEAD:äáÕáëÛ³Ý äáÕáë  BANKACCOUNTER:"_
            &"ä»ïñáëÛ³Ý ä»ïñáë  TREASNAME:ºñ¨³ÝÇ ÃÇí 1 ·³ÝÓ³å»ï³Ï³Ý µ³ÅÇÝ  TREASACC:900013288015  DEBITORNAME:êáÏáÉ-¶ñáõå êäÀ  DEBITORPASS:01826746  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", answer(0).commonTab.isn, 1)
    Call CheckDB_DOCS(answer(0).commonTab.isn, "DoCatch ", "1", fBODY,1)
    
    'FOLDERS
    Call CheckQueryRowCount("FOLDERS","fISN",answer(1).commonTab.isn,1)
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    With dbFOLDERS(0) 
        .fKEY = answer(0).commonTab.isn
        .fISN = answer(0).commonTab.isn
        .fSPEC ="105º02000239589                                                                                                                   "_
                &"                                                                                                                                  "_
                &"                                                                                       êáÏáÉ-¶ñáõå êäÀ                            "_
                &"       01826746                                                                   "
    End With
    Call CheckQueryRowCount("FOLDERS","fISN",answer(0).commonTab.isn,1)
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    'HIREST
    Call CheckDB_HIREST("LL", "153039633" , "0.00" ,"001", "0.00", 2)
    Call CheckDB_HIREST("LL", "899982624" , "0.00" ,"000", "0.00", 2)
    
    'MEMORDERS
    Call CheckDB_MEMORDERS(grMemOrd(0).isn,"GenOrdPk","1",dateSQL,"5","0.00","   ",1)
    Call CheckDB_MEMORDERS(grMemOrd(1).isn,"GenOrdPk","1",dateSQL,"5","0.00","   ",1)    

'------------------------------------------------------------------------------
'--------------Վճարման հանձնարարագրերի վավերացում-----------------------------------
'------------------------------------------------------------------------------
    Log.Message "Վճարման հանձնարարագրերի վավերացում",,,DivideColor      
    
    With filter
        .val(0) = "ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (áõÕ.)"
    End With
    Call Pttel_Filtering(filter, "frmPttel")
    wMDIClient.VBObject("frmPttel").Keys("^r")
    BuiltIn.Delay(1500)
    If SearchInPttel("frmPttel", 8 , "1187210") Then
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_View)    
        If wMDIClient.WaitvbObject("frmASDocForm", 3000).Exists Then
            payOrd(0).commonTab.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
            payOrd(0).commonTab.docN =  Get_Rekvizit_Value("Document",1,"General","DOCNUM")
            Call Close_Window(wMDIClient, "frmASDocForm")
        Else
            Log.Error "Can Not Open Window to get ISN " ,,,ErrorColor    
        End If
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If 
    If SearchInPttel("frmPttel", 8 , "33080") Then
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_View)    
        If wMDIClient.WaitvbObject("frmASDocForm", 3000).Exists Then
            payOrd(1).commonTab.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
            payOrd(1).commonTab.docN =  Get_Rekvizit_Value("Document",1,"General","DOCNUM")
            Call Close_Window(wMDIClient, "frmASDocForm")
        Else
            Log.Error "Can Not Open Window to get ISN " ,,,ErrorColor    
        End If
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    Log.Message "1187210  Pay Order(0) fISN = " & payOrd(0).commonTab.isn,,,SqlDivideColor    
    Log.Message "33080  Pay Order(1) fISN = " & payOrd(1).commonTab.isn,,,SqlDivideColor  
    
    'SQL
    Log.Message "SQL Ստուգումներ Վճարման հանձնարարագրեր",,,SqlDivideColor
    Call SQL_Initialize_DAHK_Group_Conf_5 (payOrd(0).commonTab.isn, payOrd(0).commonTab.docN)
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",payOrd(0).commonTab.isn,1)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","N","1"," ",1)
    Call CheckQueryRowCount("DOCLOG","fISN",payOrd(1).commonTab.isn,1)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","N","1"," ",1)
    
    'DOCS
    fBODY = "  USERID:  77  ACSBRANCH:00  ACSDEPART:1  BLREP:0  DATE:"&dateSQL&"  DOCNUM:"&payOrd(0).commonTab.docN&"  RES:1  ACCDB:7770077786271031"_
            &"  PAYER:úðÆÜ²ÎºÈÆ ´³ÝÏ  JURSTAT:11  TAXCODSD:34567890  ACCCR:900013288015  AREACODE:13  RECEIVER:Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ  SUMMA:1187210  "_
            &"CUR:000  AIM:ì³ñáõÛÃ-00023198, ´éÝ³·³ÝÓáõÙ-º02000239589, ²ñ·»É³Ýù-º01000239589  USEOVERLIMIT:0  REPAY:0  ISBDGPAY:1  ISWITHDATA:0  "_
            &"ISWITHOUTACC:0  CBCONFIRMD:0  OUTERCARD:0  PAYDATE:"&dateSQL&"  TCORRACC:000412000  CORRACC:000005200  PAYSYSIN:Ð  PAYSYSOUT:1  ONORDER:0  "_
            &"FORTRADE:0  ACCTYPE:B  PROCESS:0  CANCELREQ:0  CHRGACC:77786271031  TYPECODE1:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
            &"TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  CHRGCUR:000  CHRGCBCRS:1/1  PAYSCALE:09  CHRGINC:000921000  VOLORT:12  "_
            &"PAYER1:úðÆÜ²ÎºÈÆ ´³ÝÏ  ADDRESS: ÷. ²ÙÇñË³ÝÛ³Ý  NOTSENDABLECR:0  NOTSENDABLEDB:0  REPORTCODE:PTD  REPORT:PTD/OTM000000E000000OT/99/0  "_
            &"DBRES:2  DBJURSTAT:21  DBAREA:99  DEBTOR:MK  DBPASS:123  DBPASSTYPE:2  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", payOrd(0).commonTab.isn, 1)
    Call CheckDB_DOCS(payOrd(0).commonTab.isn, "CrPayOrd", "1", fBODY,1)
    
    fBODY = "  USERID:  77  ACSBRANCH:00  ACSDEPART:1  BLREP:0  DATE:"&dateSQL&"  DOCNUM:"&payOrd(1).commonTab.docN&"  RES:1  ACCDB:7770077786271031"_
            &"  PAYER:úðÆÜ²ÎºÈÆ ´³ÝÏ  JURSTAT:11  TAXCODSD:34567890  ACCCR:900013288015  AREACODE:13  RECEIVER:Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ  SUMMA:33080  "_
            &"CUR:000  AIM:ì³ñáõÛÃ-00002363, ´éÝ³·³ÝÓáõÙ-º02000008034, ²ñ·»É³Ýù-º01000008034  USEOVERLIMIT:0  REPAY:0  ISBDGPAY:1  ISWITHDATA:0  "_
            &"ISWITHOUTACC:0  CBCONFIRMD:0  OUTERCARD:0  PAYDATE:"&dateSQL&"  TCORRACC:000412000  CORRACC:000005200  PAYSYSIN:Ð  PAYSYSOUT:1  ONORDER:0  "_
            &"FORTRADE:0  ACCTYPE:B  PROCESS:0  CANCELREQ:0  CHRGACC:77786271031  TYPECODE1:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
            &"TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  CHRGCUR:000  CHRGCBCRS:1/1  PAYSCALE:09  CHRGINC:000921000  VOLORT:12  "_
            &"PAYER1:úðÆÜ²ÎºÈÆ ´³ÝÏ  ADDRESS: ÷. ²ÙÇñË³ÝÛ³Ý  NOTSENDABLECR:0  NOTSENDABLEDB:0  REPORTCODE:PTD  REPORT:PTD/OTM000000E000000OT/99/0  "_
            &"DBRES:2  DBJURSTAT:21  DBAREA:99  DEBTOR:MK  DBPASS:123  DBPASSTYPE:2  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", payOrd(1).commonTab.isn, 1)
    Call CheckDB_DOCS(payOrd(1).commonTab.isn, "CrPayOrd", "1", fBODY,1)
    
    'FOLDERS
    Call CheckQueryRowCount("FOLDERS","fISN",payOrd(0).commonTab.isn,1)
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    With dbFOLDERS(0) 
        .fKEY = payOrd(1).commonTab.isn
        .fISN = payOrd(1).commonTab.isn       
        .fSPEC = payOrd(1).commonTab.docN&"7770077786271031900013288015            33080.00000Üáñ                                                   "_
                &"77úðÆÜ²ÎºÈÆ ´³ÝÏ                                                     9934567890          Ð1       ì³ñáõÛÃ-00002363, "_
                &"´éÝ³·³ÝÓáõÙ-º02000008034, ²ñ·»É³Ýù-º01000008034                                                                           "
    End With
    Call CheckQueryRowCount("FOLDERS","fISN",payOrd(1).commonTab.isn,1)
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    'HI
    Call CheckQueryRowCount("HI","fBASE",payOrd(0).commonTab.isn,2)
    Call Check_DB_HI(dbHI(0),1) 
    With dbHI(0)
        .fDBCR = "D"
        .fSPEC = Replace (.fSPEC, "º0200", "º0201" )
    End With
    Call Check_DB_HI(dbHI(0),1)
    
    With dbHI(0)
        .fBASE = payOrd(1).commonTab.isn 
        .fSUM = "33080.00"
        .fCURSUM = "33080.00"
        .fSPEC = payOrd(1).commonTab.docN&"                   ì³ñáõÛÃ-00002363, ´éÝ³·³ÝÓáõÙ-º0201     1.0000    1"
    End With
    Call Check_DB_HI(dbHI(0),1)
    
    With dbHI(0)
        .fDBCR = "C"
        .fSPEC = Replace (.fSPEC, "º0201", "º0200" )
    End With
    Call Check_DB_HI(dbHI(0),1)
    

'-----------Ուղարկել հաստատման---------------------------------------
    If SearchInPttel("frmPttel", 8 , "1187210") Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_SendToVer)
        BuiltIn.Delay(2000)
        If MessageExists(2,"àõÕ³ñÏ»É Ñ³ëï³ïÙ³Ý") Then
            Call ClickCmdButton(5, "²Ûá")
        End If    
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If 
    
    If SearchInPttel("frmPttel", 8 , "33080") Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_SendToVer)
        BuiltIn.Delay(2000)
        If MessageExists(2,"àõÕ³ñÏ»É Ñ³ëï³ïÙ³Ý") Then
            Call ClickCmdButton(5, "²Ûá")
        End If    
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If 
    'Փակել Աշխատանքային փաստաթղթեր թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
    BuiltIn.Delay(2000)
    
    'SQL
    Log.Message "SQL Ստուգումներ Վճարման հանձնարարագրերի հաստատման ուղարկելուց հետո",,,SqlDivideColor
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",payOrd(0).commonTab.isn,3)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","M","99","àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý",1)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","C","101"," ",1)
    
    Call CheckQueryRowCount("DOCLOG","fISN",payOrd(1).commonTab.isn,3)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","M","99","àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý",1)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","C","101"," ",1)
    'DOCS
    Call CheckQueryRowCount("DOCS", "fISN", payOrd(1).commonTab.isn, 1)
    Call CheckDB_DOCS(payOrd(1).commonTab.isn, "CrPayOrd", "101", fBODY,1)
    
    fBODY = "  USERID:  77  ACSBRANCH:00  ACSDEPART:1  BLREP:0  DATE:"&dateSQL&"  DOCNUM:"&payOrd(0).commonTab.docN&"  RES:1  ACCDB:7770077786271031"_
            &"  PAYER:úðÆÜ²ÎºÈÆ ´³ÝÏ  JURSTAT:11  TAXCODSD:34567890  ACCCR:900013288015  AREACODE:13  RECEIVER:Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ  SUMMA:1187210  "_
            &"CUR:000  AIM:ì³ñáõÛÃ-00023198, ´éÝ³·³ÝÓáõÙ-º02000239589, ²ñ·»É³Ýù-º01000239589  USEOVERLIMIT:0  REPAY:0  ISBDGPAY:1  ISWITHDATA:0  "_
            &"ISWITHOUTACC:0  CBCONFIRMD:0  OUTERCARD:0  PAYDATE:"&dateSQL&"  TCORRACC:000412000  CORRACC:000005200  PAYSYSIN:Ð  PAYSYSOUT:1  ONORDER:0  "_
            &"FORTRADE:0  ACCTYPE:B  PROCESS:0  CANCELREQ:0  CHRGACC:77786271031  TYPECODE1:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
            &"TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  CHRGCUR:000  CHRGCBCRS:1/1  PAYSCALE:09  CHRGINC:000921000  VOLORT:12  "_
            &"PAYER1:úðÆÜ²ÎºÈÆ ´³ÝÏ  ADDRESS: ÷. ²ÙÇñË³ÝÛ³Ý  NOTSENDABLECR:0  NOTSENDABLEDB:0  REPORTCODE:PTD  REPORT:PTD/OTM000000E000000OT/99/0  "_
            &"DBRES:2  DBJURSTAT:21  DBAREA:99  DEBTOR:MK  DBPASS:123  DBPASSTYPE:2  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", payOrd(0).commonTab.isn, 1)
    Call CheckDB_DOCS(payOrd(0).commonTab.isn, "CrPayOrd", "101", fBODY,1)
    'FOLDERS
    With dbFOLDERS(0)
        .fSTATUS = "0"
        .fSPEC = Replace (.fSPEC, "Üáñ                  ", "àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý" )
    End With
    With dbFOLDERS(1)
        .fKEY = payOrd(1).commonTab.isn
        .fISN = payOrd(1).commonTab.isn
        .fSPEC = Replace (.fSPEC, payOrd(0).commonTab.docN, payOrd(1).commonTab.docN )
    End With    
    Call CheckQueryRowCount("FOLDERS","fISN",payOrd(1).commonTab.isn,2)
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)    
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
     
    With dbFOLDERS(0) 
        .fKEY = payOrd(0).commonTab.isn
        .fISN = payOrd(0).commonTab.isn
        .fSPEC = payOrd(0).commonTab.docN&"7770077786271031900013288015          1187210.00000àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý               "_
            &"                  77úðÆÜ²ÎºÈÆ ´³ÝÏ                                                     9934567890          Ð1       ì³ñáõÛÃ-"_
            &"00023198, ´éÝ³·³ÝÓáõÙ-º02000239589, ²ñ·»É³Ýù-º01000239589                                                                           "
    End With
    With dbFOLDERS(1)
        .fKEY = payOrd(0).commonTab.isn
        .fISN = payOrd(0).commonTab.isn
        .fSPEC = payOrd(0).commonTab.docN&"7770077786271031900013288015          1187210.00000  77ì³ñáõÛÃ-00023198, ´éÝ³·³ÝÓáõÙ-º0úðÆÜ²ÎºÈÆ ´³ÝÏ"_
                &"                  Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ                 Ð1   "
    End With
       
    Call CheckQueryRowCount("FOLDERS","fISN",payOrd(0).commonTab.isn,2)
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    
    'Մուտք Հաստատվող փաստաթղթեր թղթապանակ
    Log.Message "Մուտք Հաստատվող փաստաթղթեր թղթապանակ",,,DivideColor        
    Call GoToVerificationDocument("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ (I)",verifDoc)
    If SearchInPttel("frmPttel", 7 , "33080") Then    
        'Հաշվառել Վճարման հանձնարարագիրը
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_ToConfirm)
        BuiltIn.Delay(2000)
        If wMDIClient.WaitVBObject("frmASDocForm",2000).exists Then
            Call Payment_Order_Sent_Check(payOrd(1))
            Call ClickCmdButton(1, "Ð³ëï³ï»É")
        Else    
            Log.Error "Currency Exchange window not found",,,ErrorColor
        End If
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    
    
    If SearchInPttel("frmPttel", 7, "1187210") Then    
        'Հաշվառել Վճարման հանձնարարագիրը
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_ToConfirm)
        BuiltIn.Delay(2000)
        If wMDIClient.WaitVBObject("frmASDocForm",2000).exists Then 
            Call Payment_Order_Sent_Check(payOrd(0))
            Call ClickCmdButton(1, "Ð³ëï³ï»É")
        Else    
            Log.Error "Currency Exchange window not found",,,ErrorColor
        End If
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    
    'Փակել Հաստատվող փաստաթղթեր թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
    
    'SQL
    Log.Message "SQL Ստուգումներ Վճարման հանձնարարագրերի Վավերացումից հետո հետո",,,SqlDivideColor
    
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",payOrd(0).commonTab.isn,5)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","M","99","àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý",1)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","C","101"," ",1)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","W","102"," ",1)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","M","4","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    
    Call CheckQueryRowCount("DOCLOG","fISN",payOrd(1).commonTab.isn,5)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","M","99","àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý",1)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","C","101"," ",1)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","W","102"," ",1)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","M","4","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    
    'DOCS
    Call CheckQueryRowCount("DOCS", "fISN", payOrd(0).commonTab.isn, 1)
    Call CheckDB_DOCS(payOrd(0).commonTab.isn, "CrPayOrd", "4", fBODY,1)
    fBODY = "  USERID:  77  ACSBRANCH:00  ACSDEPART:1  BLREP:0  DATE:"&dateSQL&"  DOCNUM:"&payOrd(1).commonTab.docN&"  RES:1  ACCDB:7770077786271031"_
            &"  PAYER:úðÆÜ²ÎºÈÆ ´³ÝÏ  JURSTAT:11  TAXCODSD:34567890  ACCCR:900013288015  AREACODE:13  RECEIVER:Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ  SUMMA:33080  "_
            &"CUR:000  AIM:ì³ñáõÛÃ-00002363, ´éÝ³·³ÝÓáõÙ-º02000008034, ²ñ·»É³Ýù-º01000008034  USEOVERLIMIT:0  REPAY:0  ISBDGPAY:1  ISWITHDATA:0  "_
            &"ISWITHOUTACC:0  CBCONFIRMD:0  OUTERCARD:0  PAYDATE:"&dateSQL&"  TCORRACC:000412000  CORRACC:000005200  PAYSYSIN:Ð  PAYSYSOUT:1  ONORDER:0  "_
            &"FORTRADE:0  ACCTYPE:B  PROCESS:0  CANCELREQ:0  CHRGACC:77786271031  TYPECODE1:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  "_
            &"TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  CHRGCUR:000  CHRGCBCRS:1/1  PAYSCALE:09  CHRGINC:000921000  VOLORT:12  "_
            &"PAYER1:úðÆÜ²ÎºÈÆ ´³ÝÏ  ADDRESS: ÷. ²ÙÇñË³ÝÛ³Ý  NOTSENDABLECR:0  NOTSENDABLEDB:0  REPORTCODE:PTD  REPORT:PTD/OTM000000E000000OT/99/0  "_
            &"DBRES:2  DBJURSTAT:21  DBAREA:99  DEBTOR:MK  DBPASS:123  DBPASSTYPE:2  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", payOrd(1).commonTab.isn, 1)
    Call CheckDB_DOCS(payOrd(1).commonTab.isn, "CrPayOrd", "4", fBODY,1)
    
    'HIREST
    Call CheckDB_HIREST("01", "1733576" , "1000000.00" ,"000", "1000000.00", 6)
    Call CheckDB_HIREST("01", "1630509" , "-6499675.00" ,"000", "-6499675.00", 1)
    
    'PAYMENTS
    Call CheckQueryRowCount("PAYMENTS", "fISN", payOrd(0).commonTab.isn, 1)
    Call CheckDB_PAYMENTS(dbPAYMENTS,1)
    With dbPAYMENTS
        .fISN = payOrd(1).commonTab.isn
        .fDOCNUM = payOrd(1).commonTab.docN
        .fSUMMA = "33080.00"
        .fSUMMAAMD = "33080.00"
        .fSUMMAUSD = "82.70"
        .fCOM = "ì³ñáõÛÃ-00002363, ´éÝ³·³ÝÓáõÙ-º02000008034, ²ñ·»É³Ýù-º01000008034"
    End With
    Call CheckQueryRowCount("PAYMENTS", "fISN", payOrd(1).commonTab.isn, 1)
    
    'FOLDERS
    Call CheckQueryRowCount("FOLDERS","fISN",payOrd(0).commonTab.isn,1)
    With dbFOLDERS(0) 
        .fSTATUS = "1"
        .fFOLDERID = "PayO."&dateSQL
        .fSPEC = payOrd(0).commonTab.docN&"7770077786271031900013288015          1187210.00000Ð³ëï³ïí³Í             77ì³ñáõÛÃ-00023198, ´éÝ³·³ÝÓáõÙ-"_
                &"º0úðÆÜ²ÎºÈÆ ´³ÝÏ                  Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ             "&dateSQL&"                                               Ð1   "
    End With
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    Call CheckQueryRowCount("FOLDERS","fISN",payOrd(1).commonTab.isn,1) 
    With dbFOLDERS(0) 
        .fKEY = payOrd(1).commonTab.isn
        .fISN = payOrd(1).commonTab.isn
        .fSPEC = payOrd(1).commonTab.docN&"7770077786271031900013288015            33080.00000Ð³ëï³ïí³Í             77ì³ñáõÛÃ-00002363, ´éÝ³·³ÝÓáõÙ-"_
                &"º0úðÆÜ²ÎºÈÆ ´³ÝÏ                  Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ             "&dateSQL&"                                               Ð1   "
    End With
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    
    Log.Message "ԴԱՀԿ հաղ. մշակման ԱՇՏ",,,DivideColor       
    'Անցնել ԴԱՀԿ հաղ. մշակման ԱՇՏ
    Call ChangeWorkspace(c_DAHK)
    'Մուտք Գումարների Արգելադրում թղթապանակ
    Call Go_To_DAHK_Blocks (blockFilter, "|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|¶áõÙ³ñÝ»ñÇ ³ñ·»É³¹ñáõÙÝ»ñ") 
    If SearchInPttel ("frmPttel", 0 ,"º01000008034") Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        If wMDIClient.WaitVBObject("frmASDocForm",2000).exists Then 
            Call Amounts_Blocking_Check(amBlocking(0))
            Call ClickCmdButton (1, "OK")
        Else 
            Log.Error "Document Window not found",,,ErrorColor 
        End If  
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    
    If SearchInPttel ("frmPttel", 0 ,"º01000239589") Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        If wMDIClient.WaitVBObject("frmASDocForm",2000).exists Then 
            Call Amounts_Blocking_Check(amBlocking(1))
            Call ClickCmdButton (1, "OK")
        Else 
            Log.Error "Document Window not found",,,ErrorColor 
        End If  
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    'Փակել Գումարների Արգելադրում թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")    
    
    Log.Message "Գլխավոր Հաշվապահի ԱՇՏ",,,DivideColor       
    'Անցում Գլխավոր Հաշվապահի ԱՇՏ
    Call ChangeWorkspace(c_ChiefAcc)
    'Մուտք Հաշվառված վճարային փաստաթղթեր
    Log.Message  "Մուտք Հաշվառված վճարային փաստաթղթեր"
    folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ"
    stDate = aqDateTime.Today
    enDate = aqDateTime.Today
    wUser = "77"
    docType = ""
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
    BuiltIn.Delay(2000)
    
    Log.Message "Հիշարար օրդերների և վճարման հանձնարարագրերի ջնջում",,,DivideColor       
    Call SearchAndDelete ( "frmPttel", 2, grMemOrd(0).docN, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
    If SearchInPttel("frmPttel", 2, grMemOrd(1).docN) Then
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_Delete )
        If  MessageExists(2, "ö³ëï³ÃáõÕÃÁ çÝç»ÉÇë` ÏÑ»é³óí»Ý Ýñ³ Ñ»ï Ï³åí³Í ËÙµ³ÛÇÝ " & vbCrLf &"Ó¨³Ï»ñåáõÙÝ»ñÁ") Then
            ' Սեղմել "Կատարել" կոճակը
            Call ClickCmdButton(5, "Î³ï³ñ»É")  
            If  MessageExists(1, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") Then
                'Սեղմել "Այո" կոճակը
                Call ClickCmdButton(3, "²Ûá")  
            Else
                Log.Error"Հաղորդագրության պատուհանը չի բացվել" ,,,ErrorColor
            End If
        Else
            Log.Error"Հաղորդագրության պատուհանը չի բացվել" ,,,ErrorColor
        End If
        Else
         Log.Error "Document row not found"
    End If
    Call SearchAndDelete ( "frmPttel", 2, payOrd(1).commonTab.docN, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")                
    Call SearchAndDelete ( "frmPttel", 2, payOrd(0).commonTab.docN, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
    'Փակել Հաշվառված վճարային փաստաթղթեր թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")                
    
    'SQL
    Log.Message "SQL Ստուգումներ Վճարման հանձնարարագրերը և Խմբային Հիշարար օրեդերները ջնջելուց հետո",,,SqlDivideColor
    'DOCLOG
    'º01000008034
    Call CheckQueryRowCount("DOCLOG","fISN",blockIsn(0),5)
    Call CheckDB_DOCLOG(blockIsn(0),"77","N","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","E","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","M","1","CREATED",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","M","1","PROCESSED33080",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","M","1","DELETED",1)

    'º01000239589
    Call CheckQueryRowCount("DOCLOG","fISN",blockIsn(1),5)
    Call CheckDB_DOCLOG(blockIsn(1),"77","N","1"," ",1) 
    Call CheckDB_DOCLOG(blockIsn(1),"77","E","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(1),"77","M","1","CREATED",1)
    Call CheckDB_DOCLOG(blockIsn(1),"77","M","1","PROCESSED1187210",1)
    Call CheckDB_DOCLOG(blockIsn(1),"77","M","1","DELETED",1)
    
    Call CheckQueryRowCount("DOCLOG","fISN",grMemOrd(0).isn,3)
    Call CheckDB_DOCLOG(grMemOrd(0).isn,"77","N","9"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(0).isn,"77","M","5","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    Call CheckDB_DOCLOG(grMemOrd(0).isn,"77","D","999"," ",1)
    
    Call CheckQueryRowCount("DOCLOG","fISN",grMemOrd(1).isn,3)
    Call CheckDB_DOCLOG(grMemOrd(1).isn,"77","N","9"," ",1)
    Call CheckDB_DOCLOG(grMemOrd(1).isn,"77","M","5","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    Call CheckDB_DOCLOG(grMemOrd(1).isn,"77","D","999"," ",1)
    
    Call CheckQueryRowCount("DOCLOG","fISN",payOrd(0).commonTab.isn,6)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","M","99","àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý",1)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","C","101"," ",1)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","W","102"," ",1)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","M","4","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    Call CheckDB_DOCLOG(payOrd(0).commonTab.isn,"77","D","999"," ",1)
    
    Call CheckQueryRowCount("DOCLOG","fISN",payOrd(1).commonTab.isn,6)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","M","99","àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý",1)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","C","101"," ",1)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","W","102"," ",1)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","M","4","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    Call CheckDB_DOCLOG(payOrd(1).commonTab.isn,"77","D","999"," ",1)   
    
    'HIREST
    Call CheckDB_HIREST("LL", "153039633" , "0.00" ,"001", "-3010.76", 1)
    Call CheckDB_HIREST("LL", "899982624" , "0.00" ,"000", "-15989.70", 1)

'------------------------------------------------------------------------------
'------------------Պատասխանների արտահանում---------------------------------------
'------------------------------------------------------------------------------
    Log.Message "ԴԱՀԿ հաղ. մշակման ԱՇՏ",,,DivideColor       
    'Անցնել ԴԱՀԿ հաղ. մշակման ԱՇՏ
    Call ChangeWorkspace(c_DAHK)
    Log.Message "Պատասխանների արտահանում",,,DivideColor      
  
    'Մուտք գործել Խմբագրվող թղթապանակ
    Call Go_To_DAHK_Editable(editableFilter, "|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|ÊÙµ³·ñíáÕ")
    
    'Աղյուսակի տեսքի համեմատում
    Call ColumnSorting(sortArray, 2, "frmPttel")
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ txt ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    Call Compare_Files(Path2, Path1, regex)
    
    If SearchInPttel ("frmPttel", 2 ,"º02000008034") Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_asExported)
        If MessageExists(2,"àôÞ²¸ðàôÂÚàôÜ: §Ð³Ù³ñ»É ³ñï³Ñ³Ýí³Í¦ ·áñÍáÕáõÃÛáõÝÁ Ï³ñ»ÉÇ ¿ " & vbCrLf &_
                            "Ï³ï³ñ»É ÙÇ³ÛÝ ³ÛÝ ¹»åùáõÙ, »Ã» Ñ³Ùá½í³Í »ù, áñ ³ñï³Ñ³ÝáõÙÁ Çñ³Ï³ÝáõÙ " & vbCrLf & "Ï³ï³ñí³Í ¿: Þ³ñáõÝ³Ï»±É") Then
            Call ClickCmdButton(5, "²Ûá")
        End If
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    If SearchInPttel ("frmPttel", 2 ,"º02000239589") Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_asExported)
        If MessageExists(2,"àôÞ²¸ðàôÂÚàôÜ: §Ð³Ù³ñ»É ³ñï³Ñ³Ýí³Í¦ ·áñÍáÕáõÃÛáõÝÁ Ï³ñ»ÉÇ ¿ " & vbCrLf &_
                            "Ï³ï³ñ»É ÙÇ³ÛÝ ³ÛÝ ¹»åùáõÙ, »Ã» Ñ³Ùá½í³Í »ù, áñ ³ñï³Ñ³ÝáõÙÁ Çñ³Ï³ÝáõÙ " & vbCrLf & "Ï³ï³ñí³Í ¿: Þ³ñáõÝ³Ï»±É") Then
            Call ClickCmdButton(5, "²Ûá")
        End If
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    'Փակել Խմբագրվող հաղորդագրություններ թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
    
    'SQL
    Log.Message "SQL Ստուգումներ Պատասխանների արտահանված համարելուց հետո",,,SqlDivideColor
    Call SQL_Initialize_DAHK_Group_Conf_6 (answer(0).commonTab.isn) 
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",answer(0).commonTab.isn,2)
    Call CheckDB_DOCLOG(answer(0).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(answer(0).commonTab.isn,"77","M","2","Ð³Ù³ñí»É ¿ ³ñï³Ñ³Ýí³Í",1)
    
    Call CheckQueryRowCount("DOCLOG","fISN",answer(1).commonTab.isn,2)
    Call CheckDB_DOCLOG(answer(1).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(answer(1).commonTab.isn,"77","M","2","Ð³Ù³ñí»É ¿ ³ñï³Ñ³Ýí³Í",1)    
    
    'DOCS
    fBODY = "  REFERENCE:º02000239589  RESPONSEDATE:"&dateSQL&"  RESPONSETRUE:1  RESPSUM1:1187210  RESPCUR1:000  BANKHEAD:äáÕáëÛ³Ý äáÕáë  BANKACCOUNTER:"_
            &"ä»ïñáëÛ³Ý ä»ïñáë  TREASNAME:ºñ¨³ÝÇ ÃÇí 1 ·³ÝÓ³å»ï³Ï³Ý µ³ÅÇÝ  TREASACC:900013288015  DEBITORNAME:êáÏáÉ-¶ñáõå êäÀ  DEBITORPASS:01826746  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", answer(0).commonTab.isn, 1)
    Call CheckDB_DOCS(answer(0).commonTab.isn, "DoCatch ", "2", fBODY,1)
    fBODY = "  REFERENCE:º02000008034  RESPONSEDATE:"&dateSQL&"  RESPONSETRUE:1  RESPSUM1:33080  RESPCUR1:000  BANKHEAD:äáÕáëÛ³Ý äáÕáë  BANKACCOUNTER:"_
            &"ä»ïñáëÛ³Ý ä»ïñáë  TREASNAME:ºñ¨³ÝÇ ÃÇí 1 ·³ÝÓ³å»ï³Ï³Ý µ³ÅÇÝ  TREASACC:900013288015  DEBITORNAME:ÎÏÏ ØÏáÛ³Ý  DEBITORPASS:AK0123456  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", answer(1).commonTab.isn, 1)
    Call CheckDB_DOCS(answer(1).commonTab.isn, "DoCatch ", "2", fBODY,1)
    'FOLDERS
    Call CheckQueryRowCount("FOLDERS","fISN",answer(0).commonTab.isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    With dbFOLDERS(0) 
        .fKEY = answer(1).commonTab.isn
        .fISN = answer(1).commonTab.isn
        .fSPEC = "205º02000008034                                                                                                                    "_
                &"                                                                                                                                   "_
                &"                                                                                     ÎÏÏ ØÏáÛ³Ý                                    "_
                &"    AK0123456                                                                  "
    End With
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    
    'Մուտք Ուղարկաված հաղորդագրություններ թղթապանակ
    Log.Message "Մուտք Ուղարկաված հաղորդագրություններ թղթապանակ",,,DivideColor 
    Call Go_To_DAHK_Sent (sentFilter, "|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|àõÕ³ñÏí³Í") 
    If SearchInPttel ("frmPttel", 2 ,"º02000008034") Then
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        BuiltIn.Delay(2000)
        Call ConfiscationAnswer_Check (answer(1))
        Call ClickCmdButton(1, "OK")
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_SendToEdit)
        If MessageExists(2,"àõÕ³ñÏ»É ËÙµ³·ñÙ³Ý") Then
            Call ClickCmdButton(5, "²Ûá")
        End If
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    If SearchInPttel ("frmPttel", 2 ,"º02000239589") Then
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        BuiltIn.Delay(2000)
        Call ConfiscationAnswer_Check (answer(0))
        Call ClickCmdButton(1, "OK")
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_SendToEdit)
        If MessageExists(2,"àõÕ³ñÏ»É ËÙµ³·ñÙ³Ý") Then
            Call ClickCmdButton(5, "²Ûá")
        End If
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    'Փակել Ուղարկաված հաղորդագրություններ թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
    
    'SQL
    Log.Message "SQL Ստուգումներ Պատասխանները Խմբագրման ուղարկելուց հետո",,,SqlDivideColor
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",answer(0).commonTab.isn,3)
    Call CheckDB_DOCLOG(answer(0).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(answer(0).commonTab.isn,"77","M","2","Ð³Ù³ñí»É ¿ ³ñï³Ñ³Ýí³Í",1)
    Call CheckDB_DOCLOG(answer(0).commonTab.isn,"77","M","1","àõÕ³ñÏí»É ¿ ËÙµ³·ñÙ³Ý",1)
   
    Call CheckQueryRowCount("DOCLOG","fISN",answer(1).commonTab.isn,3)
    Call CheckDB_DOCLOG(answer(1).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(answer(1).commonTab.isn,"77","M","2","Ð³Ù³ñí»É ¿ ³ñï³Ñ³Ýí³Í",1) 
    Call CheckDB_DOCLOG(answer(1).commonTab.isn,"77","M","1","àõÕ³ñÏí»É ¿ ËÙµ³·ñÙ³Ý",1)
    'FOLDERS
    With dbFOLDERS(0) 
        .fSPEC = Replace (.fSPEC, "205º", "105º")
    End With
    Call CheckQueryRowCount("FOLDERS","fISN",answer(1).commonTab.isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    With dbFOLDERS(0) 
        .fKEY = answer(0).commonTab.isn
        .fISN = answer(0).commonTab.isn
        .fSPEC = "105º02000239589                                                                                                                     "_
                &"                                                                                                                                    "_
                &"                                                                                   êáÏáÉ-¶ñáõå êäÀ                                  "_
                &" 01826746                                                                   "
    End With
    Call CheckQueryRowCount("FOLDERS","fISN",answer(0).commonTab.isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    
    Log.Message "Մուտք Խմբագրվող հաղորդագրություններ թղթապանակ",,,DivideColor 
    'Մուտք գործել Խմբագրվող թղթապանակ
    Call Go_To_DAHK_Editable(editableFilter, "|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|ÊÙµ³·ñíáÕ")
    BuiltIn.Delay(2000)
    'Պատասխանների ջնջում
    Call SearchAndDelete ( "frmPttel", 2, "º02000008034", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
    Call SearchAndDelete ( "frmPttel", 2, "º02000239589", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
    'Փակել Խմբագրվող հաղորդագրություններ թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
    
    'SQL
    Log.Message "SQL Ստուգումներ Պատասխանները Ջնջելուց հետո",,,SqlDivideColor
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",answer(0).commonTab.isn,4)
    Call CheckDB_DOCLOG(answer(0).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(answer(0).commonTab.isn,"77","M","2","Ð³Ù³ñí»É ¿ ³ñï³Ñ³Ýí³Í",1)
    Call CheckDB_DOCLOG(answer(0).commonTab.isn,"77","M","1","àõÕ³ñÏí»É ¿ ËÙµ³·ñÙ³Ý",1)
    Call CheckDB_DOCLOG(answer(0).commonTab.isn,"77","D","999"," ",1)

    Call CheckQueryRowCount("DOCLOG","fISN",answer(1).commonTab.isn,4)
    Call CheckDB_DOCLOG(answer(1).commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(answer(1).commonTab.isn,"77","M","2","Ð³Ù³ñí»É ¿ ³ñï³Ñ³Ýí³Í",1) 
    Call CheckDB_DOCLOG(answer(1).commonTab.isn,"77","M","1","àõÕ³ñÏí»É ¿ ËÙµ³·ñÙ³Ý",1)
    Call CheckDB_DOCLOG(answer(1).commonTab.isn,"77","D","999"," ",1)
    
    'DAHKCATCH
    Call CheckQueryRowCount("DAHKCATCH","fRESPONSEISN",answer(0).commonTab.isn,0)
    Call CheckQueryRowCount("DAHKCATCH","fRESPONSEISN",answer(1).commonTab.isn,0)
    
    'Մուտք Գումարների Արգելադրում թղթապանակ
    Log.Message "Մուտք Գումարների Արգելադրում թղթապանակ",,,DivideColor 
    Call Go_To_DAHK_Blocks (blockFilter, "|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|¶áõÙ³ñÝ»ñÇ ³ñ·»É³¹ñáõÙÝ»ñ") 
    
    If SearchInPttel ("frmPttel", 0 ,"º01000008034") Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        If wMDIClient.WaitVBObject("frmASDocForm",2000).exists Then 
            Call Amounts_Blocking_Check(amBlocking(2))
            Call ClickCmdButton (1, "OK")
        Else 
            Log.Error "Document Window not found",,,ErrorColor 
        End If  
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If
    
    If SearchInPttel ("frmPttel", 0 ,"º01000239589") Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        If wMDIClient.WaitVBObject("frmASDocForm",2000).exists Then 
            Call Amounts_Blocking_Check(amBlocking(3))
            Call ClickCmdButton (1, "OK")
        Else 
            Log.Error "Document Window not found",,,ErrorColor 
        End If  
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If 
    
    If SearchInPttel ("frmPttel", 0 ,"º01000239600") Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        If wMDIClient.WaitVBObject("frmASDocForm",2000).exists Then 
            Call Amounts_Blocking_Check(amBlocking(4))
            Call ClickCmdButton (1, "OK")
        Else 
            Log.Error "Document Window not found",,,ErrorColor 
        End If  
    Else
        Log.Error "Document row not found",,,ErrorColor
    End If        
    'Գումարների արգելադրումների ջնջում
    Call SearchAndDelete ( "frmPttel", 0, "º01000008034", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
    Call SearchAndDelete ( "frmPttel", 0, "º01000239589", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
    Call SearchAndDelete ( "frmPttel", 0, "º01000239600", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
    
    'SQL
    Log.Message "SQL Ստուգումներ Գումարների արգելադրումները Ջնջելուց հետո",,,SqlDivideColor
        
    'HIREST
    Call CheckDB_HIREST("LL", "153039633" , "0.00" ,"001", "0.00", 2)
    Call CheckDB_HIREST("LL", "899982624" , "0.00" ,"000", "0.00", 2)
    
    'ACCOUNTS
    For i = 0 to 1
        With dbACCOUNTS(i)
            .fLLIMIT = "0.00"
        End With
    Next
    Call Check_DB_ACCOUNTS(dbACCOUNTS(0),1)
    Call Check_DB_ACCOUNTS(dbACCOUNTS(1),1)

    'DOCLOG
    'º01000008034
    Call CheckQueryRowCount("DOCLOG","fISN",blockIsn(0),6)
    Call CheckDB_DOCLOG(blockIsn(0),"77","N","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","E","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","M","1","CREATED",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","M","1","PROCESSED33080",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","M","1","DELETED",1)
    Call CheckDB_DOCLOG(blockIsn(0),"77","D","999"," ",1)

    'º01000239589
    Call CheckQueryRowCount("DOCLOG","fISN",blockIsn(1),6)
    Call CheckDB_DOCLOG(blockIsn(1),"77","N","1"," ",1) 
    Call CheckDB_DOCLOG(blockIsn(1),"77","E","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(1),"77","M","1","CREATED",1)
    Call CheckDB_DOCLOG(blockIsn(1),"77","M","1","PROCESSED1187210",1)
    Call CheckDB_DOCLOG(blockIsn(1),"77","M","1","DELETED",1)
    Call CheckDB_DOCLOG(blockIsn(1),"77","D","999"," ",1)

    'º01000239600
    Call CheckQueryRowCount("DOCLOG","fISN",blockIsn(2),3)
    Call CheckDB_DOCLOG(blockIsn(2),"77","N","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(2),"77","E","1"," ",1)
    Call CheckDB_DOCLOG(blockIsn(2),"77","D","999"," ",1)
    
    
    'Փակել Գումարների Արգելադրում թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
    Call Close_AsBank()
    
    'SQL հարցման միջոցով դատարկում է DAHKFREEATTACH, DAHKCATCH, DAHKATTACH աղյուսակները  "_
    'Call Clear_DAHK_SQL                
End Sub

Sub Test_Initialize_DAHK_Group_Conf()
    sDATE = "20020101"
    fDATE = "20260101"
    
    savePath = Project.Path & "Stores\DAHK\Actual\"
    pathAct = savePath & "\Conf_Error_Act.txt"
    pathExp = Project.Path & "Stores\DAHK\Expected\Conf_Error_Exp.txt"
    'Ընդունված հաղորդագրություններ
    Set recieved = New_DAHK_Recieved_Filter()
    With recieved
        .sDate = "20/01/18"
        .eDate = "30/03/20"
        .showResponded = 1
    End With
    
    Set filter = New_Filter_Pttel(1)
    With filter
        .colName(0) = 1 'Տիպ
        .cond(0) = 0 '=
        .val(0) = "´éÝ³·³ÝÓáõÙ"
    End With
    'Աշխատանքային փաստաթղթեր
    Set workingDocs = New_MainAccWorkingDocuments()
    With workingDocs
        .startDate = aqDateTime.Today
		.endDate = aqDateTime.Today
    End With
    'Հաստատվող փաստաթղթեր
    Set verifDoc = New_VerificationDocument() 
    With verifDoc
        .DocType = "CrPayOrd"
        .User = "77"
    End With
    'Խմբագրվող
    Set editableFilter = New_Editable_Filter_DAHK()
    With editableFilter
        .sDate = aqDateTime.Today
        .eDate = aqDateTime.Today
    End With
    'Ողարկված
    Set sentFilter = New_Sent_Filter_DAHK()
    With sentFilter
        .sDate = aqDateTime.Today
        .eDate = aqDateTime.Today
    End With
    'Գումարների արգելադրում
    Set blockFilter = New_Blocks_Filter_DAHK()
    With blockFilter
        .sDate = aqDateTime.Today
        .eDate = aqDateTime.Today
        .showClosed = 1
    End With
    Path1 = Project.Path & "Stores\DAHK\Actual\Answers_Pttel_Act.txt"
    Path2 = Project.Path & "Stores\DAHK\Expected\Answers_Pttel_Exp.txt"
    regex = "(\d{2}[/]\d{2}[/]\d{2})|(\d{2}:\d{2})"
    sortArray(0) = "DATE"
    sortArray(1) = "REFERENCE"
    'Հիշարար օրդեր
    Set grMemOrd(0) = New_Group_Mem_Order_Cur(1, 0, 0, 0)
    With grMemOrd(0)
        .branch = "00"
        .dep = "1"
        .fDate  = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .accD(0) = "00066610401"
        .curD(0) = "001"
        .sumD(0) = "2,968.03"
        .accC(0) = "77786271031"
        .curC(0) = "000"
        .sumC(0) = "1,187,210.00"
        .aim(0) = "ì³ñáõÛÃ-00023198, ´éÝ³·³ÝÓáõÙ-º02000239589, ²ñ·»É³Ýù-º01000239589"
        .paySys = "Ð"
        .exchangeIncome = "000931900"
        .exchangeExpanse = "001434300"
        .opType = "1"
        .opPlace = "3"
    End With
    Set grMemOrd(1) = New_Group_Mem_Order_Cur(2, 0, 0, 0)
    With grMemOrd(1)
        .branch = "00"
        .dep = "1"
        .fDate  = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .accD(0) = "00066610100"
        .curD(0) = "000"
        .sumD(0) = "15,989.70"
        .accC(0) = "77786271031"
        .curC(0) = "000"
        .sumC(0) = "15,989.70"
        .aim(0) = "ì³ñáõÛÃ-00002363, ´éÝ³·³ÝÓáõÙ-º02000008034, ²ñ·»É³Ýù-º01000008034"
        .accD(1) = "00066610401"
        .curD(1) = "001"
        .sumD(1) = "42.73"
        .accC(1) = "77786271031"
        .curC(1) = "000"
        .sumC(1) = "17,090.30"
        .aim(1) = "ì³ñáõÛÃ-00002363, ´éÝ³·³ÝÓáõÙ-º02000008034, ²ñ·»É³Ýù-º01000008034"
        .paySys = "Ð"
        .exchangeIncome = "000931900"
        .exchangeExpanse = "001434300"
        .opType = "1"
        .opPlace = "3"
    End With    
    'Պսատասխան հաղորդագրություն
    Set answer(1) = New_ConfiscationAnswer(0 ,0 , 0)
    With answer(1)
        .commonTab.reference = "º02000008034"
        .commonTab.fDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .commonTab.confiscated = 1
        .commonTab.sumToConf = "33,080.00"
        .commonTab.curToConf= "000"
        .commonTab.check = True
        .otherTab.manager = "äáÕáëÛ³Ý äáÕáë"
        .otherTab.chiefAcc = "ä»ïñáëÛ³Ý ä»ïñáë"
        .otherTab.check = True  
    End With
    Set answer(0) = New_ConfiscationAnswer(0 ,0 , 0)
    With answer(0)
        .commonTab.reference = "º02000239589"
        .commonTab.fDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .commonTab.confiscated = 1
        .commonTab.sumToConf = "1,187,210.00"
        .commonTab.curToConf= "000"
        .commonTab.check = True
        .otherTab.manager = "äáÕáëÛ³Ý äáÕáë"
        .otherTab.chiefAcc = "ä»ïñáëÛ³Ý ä»ïñáë"
        .otherTab.check = True  
    End With
    'Գումարների արգելադրում
    Set amBlocking(0) = New_AmmountBlocking(0, 0, 0, 0)
    With amBlocking(0)
        .commonTab.clientCode = "00000666"
        .commonTab.blockID = "º01000008034"
        .commonTab.source = "1"
        .commonTab.initSum = "33,080.00"
        .commonTab.blockCur = "000"
        .commonTab.confiscatedSum = "33,080.00"
        .commonTab.check = True
        .otherTab.confAcc = "90001/3288015"
        .otherTab.opDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .otherTab.clDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .otherTab.dahkInqID = "00002363"
        .otherTab.dahkDebtorID = "0000007790"
        .otherTab.check = True
    End With
    Set amBlocking(1) = New_AmmountBlocking(0, 0, 0, 0)
    With amBlocking(1)
        .commonTab.clientCode = "00000666"
        .commonTab.blockID = "º01000239589"
        .commonTab.source = "1"
        .commonTab.initSum = "1,187,210.00"
        .commonTab.blockCur = "000"
        .commonTab.confiscatedSum = "1,187,210.00"
        .commonTab.check = True
        .otherTab.confAcc = "90001/3288015"
        .otherTab.opDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .otherTab.clDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .otherTab.dahkInqID = "00023198"
        .otherTab.dahkDebtorID = "1111111112"
        .otherTab.check = True
    End With
    Set amBlocking(2) = New_AmmountBlocking(1, 0, 0, 0)
    With amBlocking(2)
        .commonTab.clientCode = "00000666"
        .commonTab.blockID = "º01000008034"
        .commonTab.source = "1"
        .commonTab.initSum = "33,080.00"
        .commonTab.blockedSum = "33,080.00"
        .commonTab.blockCur = "000"
        .commonTab.acc(0) = "00066610100"
        .commonTab.accCur(0) = "000"
        .commonTab.accCurSum(0) = "15,989.70"
        .commonTab.blockCurSum(0) = "15,989.70"
        .commonTab.check = True
        .otherTab.confAcc = "90001/3288015"
        .otherTab.opDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .otherTab.dahkInqID = "00002363"
        .otherTab.dahkDebtorID = "0000007790"
        .otherTab.check = True
    End With 
    Set amBlocking(3) = New_AmmountBlocking(1, 0, 0, 0)
    With amBlocking(3)
        .commonTab.clientCode = "00000666"
        .commonTab.blockID = "º01000239589"
        .commonTab.source = "1"
        .commonTab.initSum = "1,187,210.00"
        .commonTab.blockedSum = "1,187,210.00"
        .commonTab.blockCur = "000"
        .commonTab.acc(0) = "00066610401"
        .commonTab.accCur(0) = "001"
        .commonTab.accCurSum(0) = "2,968.03"
        .commonTab.blockCurSum(0) = "1,187,210.00"
        .commonTab.check = True
        .otherTab.confAcc = "90001/3288015"
        .otherTab.opDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .otherTab.dahkInqID = "00023198"
        .otherTab.dahkDebtorID = "1111111112"
        .otherTab.check = True
    End With 
    Set amBlocking(4) = New_AmmountBlocking(0, 0, 0, 0)
    With amBlocking(4)
        .commonTab.clientCode = "00034855"
        .commonTab.blockID = "º01000239600"
        .commonTab.source = "1"
        .commonTab.initSum = "6,667,210.00"
        .commonTab.blockedSum = "6,667,210.00"
        .commonTab.blockCur = "000"
        .commonTab.check = True
        .commonTab.debt = "6,667,210.00"
        .otherTab.confAcc = "90001/3288015"
        .otherTab.opDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .otherTab.dahkInqID = "00023200"
        .otherTab.dahkDebtorID = "4859111112"
        .otherTab.check = True
    End With
    
    'Վճարման հանձնարարագիր
    Set payOrd(1) = New_PaymentOrderSent(0,0,0)
    With payOrd(1)
        .commonTab.div = "00"
        .commonTab.dep = "1"
        .commonTab.fDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .commonTab.rezident = "1"
        .commonTab.accD = "77700/77786271031"
        .commonTab.payer = "úðÆÜ²ÎºÈÆ ´³ÝÏ"
        .commonTab.legalPos = "11"
        .commonTab.taxCode = "34567890"
        .commonTab.accC = "90001/3288015"
        .commonTab.areaCode = "13"
        .commonTab.reciever = "Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ"
        .commonTab.sum = "33,080.00"
        .commonTab.cur = "000"
        .commonTab.aim = "ì³ñáõÛÃ-00002363, ´éÝ³·³ÝÓáõÙ-º02000008034, ²ñ·»É³Ýù-º01000008034"
        .commonTab.check = True
        .addTab.payDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .addTab.transitAcc = "000412000"
        .addTab.correspondentAcc = "000005200"
        .addTab.correspondentAccCB = "77700/"
        .addTab.recPaySys = "Ð"
        .addTab.sentPaySys = "1"
        .addTab.accType = "B"
        .addTab.check = True
        .tChargeTab.chargesAcc = "77786271031"
        .tChargeTab.cur = "000"
        .tChargeTab.CBCourse = "1.0000/1"
        .tChargeTab.chargeType1 = "09"
        .tChargeTab.interest1 = "0.0000"
        .tChargeTab.interest2 = "0.0000"
        .tChargeTab.incomeAcc1 = "000921000"
        .tChargeTab.time = ""
        .tChargeTab.busField = "12"
        .tChargeTab.check = True
        .cDeskTab.depositor = "úðÆÜ²ÎºÈÆ ´³ÝÏ"
        .cDeskTab.address = "÷. ²ÙÇñË³ÝÛ³Ý"
        .cDeskTab.check = True
        .payDataTab.payCode = "TUBG"
        .payDataTab.reportCode = "PTD"
        .payDataTab.report = "PTD/OTM000000E000000OT/99/0"
        .payDataTab.rezident = "2"
        .payDataTab.legalPos = "21"
        .payDataTab.areaCode = "99"
        .payDataTab.name = "MK"
        .payDataTab.idNum = "123"
        .payDataTab.passType = "2"
        .payDataTab.check = True
    End With  
    Set payOrd(0) = New_PaymentOrderSent(0,0,0)
    With payOrd(0)
        .commonTab.div = "00"
        .commonTab.dep = "1"
        .commonTab.fDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .commonTab.rezident = "1"
        .commonTab.accD = "77700/77786271031"
        .commonTab.payer = "úðÆÜ²ÎºÈÆ ´³ÝÏ"
        .commonTab.legalPos = "11"
        .commonTab.taxCode = "34567890"
        .commonTab.accC = "90001/3288015"
        .commonTab.areaCode = "13"
        .commonTab.reciever = "Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ"
        .commonTab.sum = "1,187,210.00"
        .commonTab.cur = "000"
        .commonTab.aim = "ì³ñáõÛÃ-00023198, ´éÝ³·³ÝÓáõÙ-º02000239589, ²ñ·»É³Ýù-º01000239589"
        .commonTab.check = True
        .addTab.payDate = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .addTab.transitAcc = "000412000 "
        .addTab.correspondentAcc = "000005200"
        .addTab.correspondentAccCB = "77700/"
        .addTab.recPaySys = "Ð"
        .addTab.sentPaySys = "1"
        .addTab.accType = "B"
        .addTab.check = True
        .tChargeTab.chargesAcc = "77786271031"
        .tChargeTab.cur = "000"
        .tChargeTab.CBCourse = "1.0000/1"
        .tChargeTab.chargeType1 = "09"
        .tChargeTab.interest1 = "0.0000"
        .tChargeTab.interest2 = "0.0000"
        .tChargeTab.incomeAcc1 = "000921000"
        .tChargeTab.time = ""
        .tChargeTab.busField = "12"
        .tChargeTab.check = True
        .cDeskTab.depositor = "úðÆÜ²ÎºÈÆ ´³ÝÏ"
        .cDeskTab.address = "÷. ²ÙÇñË³ÝÛ³Ý"
        .cDeskTab.check = True
        .payDataTab.payCode = "TUBG"
        .payDataTab.reportCode = "PTD"
        .payDataTab.report = "PTD/OTM000000E000000OT/99/0"
        .payDataTab.rezident = "2"
        .payDataTab.legalPos = "21"
        .payDataTab.areaCode = "99"
        .payDataTab.name = "MK"
        .payDataTab.idNum = "123"
        .payDataTab.passType = "2"
        .payDataTab.check = True        
    End With
End Sub

Sub SQL_Initialize_DAHK_Group_Conf_1(fISN,fDOCN)
    dateSQL = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y%m%d")
    For i = 0 to 1
        dbACCOUNTS(i) = Empty
    Next
    For i = 0 to 2
        dbFOLDERS(i) = Empty
    Next
    For i = 0 to 1
        dbHI(i) = Empty
    Next
                
    Set dbACCOUNTS(0) = New_DB_ACCOUNTS()
    With dbACCOUNTS(0)
        .fISN = "153039633"
        .fCODE = "00066610401"
        .fCAPTION = "MK"
        .fCUR = "001"
        .fDC = "2"
        .fBALACC = "3032000 "
        .fACCTYPE = "01"
        .fDATEOPEN = "2005-01-12 00:00:00"
        .fDATECLOSE = Null
        .fLLIMIT = "3010.76"
        .fULIMIT = "999999999999.99"
        .fACCBRANCH = "00 "
        .fACCDEPART = "2  "
        .fACCACSTYPE = "01  "
    End With
    
    Set dbACCOUNTS(1) = New_DB_ACCOUNTS()
    With dbACCOUNTS(1)
        .fISN = "899982624"
        .fCODE = "00066610100"
        .fCAPTION = "MK"
        .fCUR = "000"
        .fDC = "2"
        .fBALACC = "3032000 "
        .fACCTYPE = "01"
        .fDATEOPEN = "2005-07-12 00:00:00"
        .fDATECLOSE = Null
        .fLLIMIT = "15989.70"
        .fULIMIT = "999999999999.99"
        .fACCBRANCH = "00 "
        .fACCDEPART = "2  "
        .fACCACSTYPE = "01  "
    End With
    
    Set dbFOLDERS(0) = New_DB_FOLDERS()
    With dbFOLDERS(0)
        .fFOLDERID = "BLOCK"
        .fNAME = "Block   "
        .fKEY = "º01000008034"
        .fISN = fISN 
        .fSTATUS = "1"
        .fCOM = "¶áõÙ³ñÝ»ñÇ ³ñ·»É³¹ñáõÙ"
        .fSPEC = "000006661        33080.00        33080.00000            0.00"&dateSQL&"00000000000000023630000007790000000000            0.00        "
        .fECOM = "Amounts Blocking"
    End With
    
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1)
        .fFOLDERID = "C.1759218"
        .fNAME = "Block   "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "  ¶áõÙ³ñÝ»ñÇ ³ñ·»É³¹ñáõÙ"
        .fSPEC = "²ÕµÛáõñ` ¸²ÐÎ  ì³ñáõÛÃÇ ID - 00002363  Ü»ñÙáõÍÙ³Ý ³Ùë³ÃÇí - 19/08/19"
        .fECOM = "  Amounts Blocking"
    End With  

    Set dbHI(0) = New_DB_HI()
    With dbHI(0)
        .fBASE = fISN
        .fDATE = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y-%m-%d")
        .fTYPE = "LL"
        .fSUM = "0.00"
        .fCUR = "001"
        .fCURSUM = "42.73"
        .fOP = "BLK"
        .fDBCR = "C"
        .fADB = "-1"
        .fACR = "-1"
        .fSPEC = "00066610401ê³é»óáõÙ(¸²ÐÎ ²ñ·»É³¹ñáõÙ)                                                                                                                  "
    End With   
    Set dbHI(1) = New_DB_HI()
    With dbHI(1)
        .fBASE = fISN
        .fDATE = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y-%m-%d")
        .fTYPE = "LL"
        .fSUM = "0.00"
        .fCUR = "001"
        .fCURSUM = "2968.03"
        .fOP = "BLK"
        .fDBCR = "C"
        .fADB = "-1"
        .fACR = "-1"
        .fSPEC = "00066610401ê³é»óáõÙ(¸²ÐÎ ²ñ·»É³¹ñáõÙ)                                                                                                                  "
    End With       
    
End Sub

Sub SQL_Initialize_DAHK_Group_Conf_2(fISN,fDOCN)
    With dbFOLDERS(0)
        .fFOLDERID = "Oper."&dateSQL
        .fNAME = "GenOrdPk"
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "ÊÙµ³ÛÇÝ ÑÇß³ñ³ñ ûñ¹»ñ"
        .fSPEC = fDOCN&"                                         2968.03001Üáñ                                                   77             "_
            &"                                                                          Ð                                                           "_
            &"                                                                                         "
        .fECOM = "Group Memorial Order"
        .fDCDEPART = "1"
        .fDCBRANCH = "00"
    End With 
    
    With dbHI(0)
        .fBASE = fISN
        .fDATE = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y-%m-%d")
        .fTYPE = "11"
        .fSUM = "1187210.00"
        .fCUR = "000"
        .fCURSUM = "1187210.00"
        .fOP = "CEX"
        .fDBCR = "C"
        .fADB = "153039633"
        .fACR = "1733576"
        .fSPEC = fDOCN&"                   ì³ñáõÛÃ-00023198, ´éÝ³·³ÝÓáõÙ-º0200     1.0000    1"
    End With
    
    With dbHI(1)
        .fBASE = fISN
        .fDATE = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y-%m-%d")
        .fTYPE = "11"
        .fSUM = "2.00"
        .fCUR = "000"
        .fCURSUM = "2.00"
        .fOP = "MSC"
        .fDBCR = "C"
        .fADB = "153039633"
        .fACR = "1629177"
        .fSPEC = fDOCN&"                   ºÏ³ÙáõïÝ»ñ ³ñï. ÷áË³Ý³ÏáõÙÇó      1     1.0000    1"
    End With 
       
End Sub


Sub SQL_Initialize_DAHK_Group_Conf_3(fISN,fDOCN) 
    
    With dbHI(0)
        .fBASE = fISN
        .fDATE = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y-%m-%d")
        .fTYPE = "11"
        .fSUM = "15989.70"
        .fCUR = "000"
        .fCURSUM = "15989.70"
        .fOP = "MSC"
        .fDBCR = "C"
        .fADB = "899982624"
        .fACR = "1733576"
        .fSPEC = fDOCN&"                   ì³ñáõÛÃ-00002363, ´éÝ³·³ÝÓáõÙ-º0200     1.0000    1"
    End With
    
    With dbHI(1)
        .fBASE = fISN
        .fDATE = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y-%m-%d")
        .fTYPE = "11"
        .fSUM = "17090.30"
        .fCUR = "000"
        .fCURSUM = "17090.30"
        .fOP = "CEX"
        .fDBCR = "C"
        .fADB = "153039633"
        .fACR = "1733576"
        .fSPEC = fDOCN&"                   ì³ñáõÛÃ-00002363, ´éÝ³·³ÝÓáõÙ-º0200     1.0000    1"
    End With 
    
    Set dbHI(2) = New_DB_HI()
    With dbHI(2)
        .fBASE = fISN
        .fDATE = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y-%m-%d")
        .fTYPE = "11"
        .fSUM = "1.70"
        .fCUR = "000"
        .fCURSUM = "1.70"
        .fOP = "MSC"
        .fDBCR = "C"
        .fADB = "153039633"
        .fACR = "1629177"
        .fSPEC = fDOCN&"                   ºÏ³ÙáõïÝ»ñ ³ñï. ÷áË³Ý³ÏáõÙÇó      1     1.0000    1"
    End With     
End Sub

Sub SQL_Initialize_DAHK_Group_Conf_4 (fISN)
    With dbFOLDERS(0)
        .fFOLDERID = "DAHK."&dateSQL
        .fNAME = "DoCatch "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "²ñ·»É³ÝùÇ å³ï³ëË³Ý"
        .fSPEC = "105º02000008034                                                                                                                   "_
                &"                                                                                                                                  "_
                &"                                                                                       ÎÏÏ ØÏáÛ³Ý                                 "_
                &"       AK0123456                                                                  "
        .fECOM = "Answer to Block"
        .fDCDEPART = ""
        .fDCBRANCH = ""
    End With 
End Sub

Sub SQL_Initialize_DAHK_Group_Conf_5 (fISN, fDOCN)
    With dbFOLDERS(0)
        .fFOLDERID = "Oper."&dateSQL
        .fNAME = "CrPayOrd"
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (áõÕ.)"
        .fSPEC = fDOCN&"7770077786271031900013288015          1187210.00000Üáñ                                                   77úðÆÜ²ÎºÈÆ ´³ÝÏ"_
                &"                                                     9934567890          Ð1       ì³ñáõÛÃ-00023198, ´éÝ³·³ÝÓáõÙ-º02000239589,"_
                &" ²ñ·»É³Ýù-º01000239589                                                                           "
        .fECOM = "Payment Order (to be sent)"
        .fDCDEPART = "1  "
        .fDCBRANCH = "00 "
    End With

    With dbFOLDERS(1)
        .fFOLDERID = "Ver."&dateSQL&"001"
        .fNAME = "CrPayOrd"
        .fSTATUS = "4"
        .fCOM = "ì×³ñÙ³Ý Ñ³ÝÓÝ³ñ³ñ³·Çñ (áõÕ.)"
        .fSPEC = fDOCN&"7770077786271031900013288015            33080.00000  77ì³ñáõÛÃ-00002363, ´éÝ³·³ÝÓáõÙ-º0úðÆÜ²ÎºÈÆ ´³ÝÏ"_
                &"                  Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ                 Ð1   "
        .fECOM = "Payment Order (to be sent)"
        .fDCBRANCH = "00 "
        .fDCDEPART = "1  "
    End With
        
    With dbHI(0)
        .fBASE = fISN
        .fDATE = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y-%m-%d")
        .fTYPE = "11"
        .fSUM = "1187210.00"
        .fCUR = "000"
        .fCURSUM = "1187210.00"
        .fOP = "TRF"
        .fDBCR = "C"
        .fADB = "1733576"
        .fACR = "1630509"
        .fSPEC = fDOCN&"                   ì³ñáõÛÃ-00023198, ´éÝ³·³ÝÓáõÙ-º0200     1.0000    1"
    End With
    
    Set dbPAYMENTS = New_DB_PAYMENTS()
    With dbPAYMENTS
        .fISN = fISN
        .fDOCTYPE = "CrPayOrd"
        .fDATE = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%Y-%m-%d")
        .fSTATE = "4"
        .fDOCNUM = fDOCN
        .fCLIENT = "        "
        .fACCDB = "7770077786271031"
        .fPAYER = "úðÆÜ²ÎºÈÆ ´³ÝÏ"
        .fCUR = "000"
        .fSUMMA = "1187210.00"
        .fSUMMAAMD = "1187210.00"
        .fSUMMAUSD = "2968.025"
        .fCOM = "ì³ñáõÛÃ-00023198, ´éÝ³·³ÝÓáõÙ-º02000239589, ²ñ·»É³Ýù-º01000239589"
        .fPASSPORT = ""
        .fCOUNTRY = "AM"
        .fACSBRANCH = "00 "
        .fACSDEPART = "1  "
    End With 
End Sub

Sub SQL_Initialize_DAHK_Group_Conf_6 (fISN) 
    With dbFOLDERS(0)
        .fFOLDERID = "DAHK."&dateSQL
        .fNAME = "DoCatch "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "²ñ·»É³ÝùÇ å³ï³ëË³Ý"
        .fSPEC = "205º02000239589                                                                                                                    "_
                &"                                                                                                                                   "_
                &"                                                                                     êáÏáÉ-¶ñáõå êäÀ                               "_
                &"    01826746                                                                   "
        .fECOM = "Answer to Block"
        .fDCDEPART = ""
        .fDCBRANCH = ""
    End With
End Sub
Sub Clear_DAHK_SQL()
    Dim SqlQuery
    Call Create_Connection()
    'Ջնջել ներմուծված հաղորդագորությունները
    SqlQuery = " Delete from DAHKFREEATTACH "_
              & " Delete from DAHKCATCH "_
              & " Delete from DAHKATTACH " 
    Call Execute_SLQ_Query(SqlQuery)          
End Sub

Sub SQL_Import_DAHK()
    Dim SqlQuery1,SqlQuery2, SqlQuery3, SqlQuery4, SqlQuery5, SqlQuery6, SqlQuery7
    Call Create_Connection()
    SqlQuery1 = "SET IDENTITY_INSERT DAHKATTACH ON" 
    'Արգելանք
    SqlQuery2 = "Insert into DAHKATTACH (fID,	fIMPDATE,	fMESSAGEID,	fDECISIONNUM,	fDECISIONDATE,	fDECISIONPLACE,	fDECISIONOWNER,	fINQUESTNUMBER,	fINQUESTID,	fINQUESTDATE,	fBRANCH,	fBRANCHSUB,	fDEBTORID" _
    			  &  "	, fDEBTORNAME,	fDEBTORPASSPORT, fDEBTORADDRESS,	fDEBTORTYPE,	fISSUM,	fBBLOCKOTHER,	fBBLOCKSUM1,	fBBLOCKCUR1,	fBBLOCKSUM2,	fBBLOCKCUR2,	fBBLOCKSUM3" _
    			  &  "	, fBBLOCKCUR3,	fBBLOCKSUM4,	fBBLOCKCUR4,	fBBLOCKSUM5,	fBBLOCKCUR5,	fBBLOCKSUM6,	fBBLOCKCUR6,	fBBLOCKSUM7,	fBBLOCKCUR7,	fORDERTEXT,	fCOURT,	fCLICODE" _
    			  &  "	,	fBLCODE,	fRESPONSEISN,	fEMPLOYERACC1,	fEMPLOYERACC2,	fEMPLOYERACC3,	fEMPLOYERACC4,	fEMPLOYERACC5,	fDUPLICATE,	fSSN,	fPROCESSED,	fBBLOCKPERCENT,	fRESPONSENUMBER" _
    			  &  "	,	fBBLOCKEDACCOUNTPERCENT,	fBBLOCKEDACCOUNT,	fBLCODEUNVER)" _
            &  "    Values ('1',	'2019-08-19 15:25:00',	'º01000008034',	'à00406-07727/18',	'2018-08-03 00:00:00',	'ù. ºñ¨³Ý'" _
            &  " , '²í³· Ñ³ñÏ³¹Çñ Ï³ï³ñáÕ ³ñ¹³ñ³¹³ïáõÃÛ³Ý Ï³åÇï³Ý ²ñÙ³Ý äáÕáëÛ³Ý',	'',	'00002363',	'2018-05-08 00:00:00'" _
            &  " , 'ì³ñã³Ï³Ý ³Ïï»ñáí µéÝ³·³ÝÓáõÙÝ»ñÇ µ³ÅÇÝ',	NULL,	'0000007790',	'ÎÏÏ ØÏáÛ³Ý',	'AK0123456',	'ù.ºñ¨³Ý, Î»ÝïñáÝ, Ø³ßïáó 21'"_	
            &  " , 1	,	1,	NULL,	'33080.00',	'AMD',	'0.00',	NULL,	'0.00',	NULL,	'10000.00',	'AMD',	'0.00',	NULL,	'0.00',	NULL"_
            &  " , '5000.00',	'AMD',	'Ø³ñÏ òáõÏÇ¨ ìÉ³¹Ç-Çó Ñû·áõï ´ÆÂÂ² ö´À-Ç µéÝ³·³ÝÓ»É 5000 ÐÐ ¹ñ³Ù','ì³ñã³Ï³Ý'	,'00000666' ,'  '"_
            &  " , ' ','900011474245',	'900011004521',	'900011556579',	'900011556611',	'900011556538',	NULL,	'0123456789',	0"_
            &  " , '0.00',	NULL,	NULL,	'0.00',	NULL)" 

    'Բռնագանձում
    SqlQuery3 = "insert into DAHKCATCH (fIMPDATE,	fMESSAGEID,	fDECISIONNUM,	fDECISIONDATE,	fDECISIONPLACE,	fDECISIONOWNER," _
                & "fINQUESTNUMBER,	fINQUESTDATE,	fBRANCH,	fBRANCHSUB,	fTREASURYNAME,	fTREASURYCODE,	fBRECOVERSUM1,	fBRECOVERCUR1," _
                &	"fBRECOVERSUM2,	fBRECOVERCUR2,	fBRECOVERSUM3,	fBRECOVERCUR3,	fBRECOVERSUM4,	fBRECOVERCUR4,	fBBLOCKCANCEL,	fRESPONSEISN,"_
                &	"fEMPLOYERACC1,	fEMPLOYERACC2,	fEMPLOYERACC3,	fEMPLOYERACC4,	fEMPLOYERACC5,	fPROCESSED,	fINQUESTID,	fBRECOVERPERCENT,"_
                & "fBRECOVEREDACCOUNT,	fBRECOVEREDACCOUNTPERCENT)"_
                & "Values ('2019-03-30 11:36:00',	'º02000008034',	'à00166-00002/11',	'2019-03-30 00:00:00',	'ù. ºñ¨³Ý'," _
                &	"'²í³· Ñ³ñÏ³¹Çñ Ï³ï³ñáÕ ³ñ¹³ñ³¹³ïáõÃÛ³Ý ³í. É»Ûï»Ý³Ýï Î³ñ»Ý Ê³Ý½³¹Û³Ý',	'01/03-02753/10',	'2019-11-16 00:00:00'"_
		            & ",	'Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ',	NULL,	'ºñ¨³ÝÇ ÃÇí 1 ·³ÝÓ³å»ï³Ï³Ý µ³ÅÇÝ',	'900013288015',	'33080.00',	'AMD',	'33080.00',	"_
                & "'AMD',	'0.00',	'AMD',	'33080.00',	'AMD',	0,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL,	NULL)"
    'Արգելանք
    SqlQuery4 = "Insert into DAHKATTACH (fID,	fIMPDATE,	fMESSAGEID,	fDECISIONNUM,	fDECISIONDATE,	fDECISIONPLACE,	fDECISIONOWNER,	fINQUESTNUMBER,	fINQUESTID,	fINQUESTDATE,	fBRANCH,	fBRANCHSUB,	fDEBTORID" _
    			  &  "	, fDEBTORNAME,	fDEBTORPASSPORT, fDEBTORADDRESS,	fDEBTORTYPE,	fISSUM,	fBBLOCKOTHER,	fBBLOCKSUM1,	fBBLOCKCUR1,	fBBLOCKSUM2,	fBBLOCKCUR2,	fBBLOCKSUM3" _
    			  &  "	, fBBLOCKCUR3,	fBBLOCKSUM4,	fBBLOCKCUR4,	fBBLOCKSUM5,	fBBLOCKCUR5,	fBBLOCKSUM6,	fBBLOCKCUR6,	fBBLOCKSUM7,	fBBLOCKCUR7,	fORDERTEXT,	fCOURT,	fCLICODE" _
    			  &  "	,	fBLCODE,	fRESPONSEISN,	fEMPLOYERACC1,	fEMPLOYERACC2,	fEMPLOYERACC3,	fEMPLOYERACC4,	fEMPLOYERACC5,	fDUPLICATE,	fSSN,	fPROCESSED,	fBBLOCKPERCENT,	fRESPONSENUMBER" _
    			  &  "	,	fBBLOCKEDACCOUNTPERCENT,	fBBLOCKEDACCOUNT,	fBLCODEUNVER)" _
            &  "   Values ('15','2018-01-22 00:00:00',	'º01000239589',	'à00166-00001/10',	'2018-11-16 00:00:00',	'ù. ºñ¨³Ý',	'²í³· Ñ³ñÏ³¹Çñ Ï³ï³ñáÕ ³ñ¹³ñ³¹³ïáõÃÛ³Ý ³í. É»Ûï»Ý³Ýï Î³ñ»Ý Ê³Ý½³¹Û³Ý',	'01/03-02753/10'" _
            &  "  ,'00023198',	'2018-11-16 00:00:00',	'Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ',	NULL,	'1111111112',	'êáÏáÉ-¶ñáõå êäÀ',	'01826746','ù.ºñ¨³Ý, Ø³É³ÃÇ³-ê»µ³ëïÇ³, Þñç³Ý³ÛÇÝ 2/4-23',	0,	1,	NULL" _
            &  "  ,	'1187210.00',	'AMD',	'0.00',	NULL,	'0.00',	NULL,	'97384000.00',	'AMD',	'0.00',	NULL,	'0.00',	NULL,	'4869200.00',	'AMD',	'§êáÏáÉ ¶ñáõå¦ êäÀ-Çó Ñû·áõï §Ð³ñ³íÏáíÏ³ëÛ³Ý »ñÏ³ÃáõÕÇ¦ ö´À-Ç µéÝ³·³ÝÓ»É 94.000.000 ÐÐ ¹ñ³Ù'" _
            &  "  ,	'Ø³É³ÃÇ³ - ê»µ³ëïÇ³ Ñ³Ù³ÛÝùÇ ÁÝ¹Ñ³Ýáõñ Çñ³í³ëáõÃÛ³Ý',	'00000666',' ', ' ',NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	NULL,	NULL)" 
    'Բռնագանձում
    SqlQuery5 = "insert into DAHKCATCH (fIMPDATE,	fMESSAGEID,	fDECISIONNUM,	fDECISIONDATE,	fDECISIONPLACE,	fDECISIONOWNER," _
                & "fINQUESTNUMBER,	fINQUESTDATE,	fBRANCH,	fBRANCHSUB,	fTREASURYNAME,	fTREASURYCODE,	fBRECOVERSUM1,	fBRECOVERCUR1," _
                &	"fBRECOVERSUM2,	fBRECOVERCUR2,	fBRECOVERSUM3,	fBRECOVERCUR3,	fBRECOVERSUM4,	fBRECOVERCUR4,	fBBLOCKCANCEL,	fRESPONSEISN,"_
                &	"fEMPLOYERACC1,	fEMPLOYERACC2,	fEMPLOYERACC3,	fEMPLOYERACC4,	fEMPLOYERACC5,	fPROCESSED,	fINQUESTID,	fBRECOVERPERCENT,"_
                & "fBRECOVEREDACCOUNT,	fBRECOVEREDACCOUNTPERCENT)"_
                & "Values ('2018-03-30 11:36:00',	'º02000239589',	'à00166-00002/11',	'2018-03-30 00:00:00',	'ù. ºñ¨³Ý'," _
                &	"'²í³· Ñ³ñÏ³¹Çñ Ï³ï³ñáÕ ³ñ¹³ñ³¹³ïáõÃÛ³Ý ³í. É»Ûï»Ý³Ýï Î³ñ»Ý Ê³Ý½³¹Û³Ý',	'01/03-02753/10',	'2018-11-16 00:00:00'"_
		            & ",	'Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ',	NULL,	'ºñ¨³ÝÇ ÃÇí 1 ·³ÝÓ³å»ï³Ï³Ý µ³ÅÇÝ',	'900013288015',	'1187210.00',	'AMD',	'1187210.00',	"_
                & "'AMD',	'0.00',	'AMD',	'1187210.00',	'AMD',	0,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	NULL)" 
    'Արգելանք
    SqlQuery6 = "Insert into DAHKATTACH (fID,	fIMPDATE,	fMESSAGEID,	fDECISIONNUM,	fDECISIONDATE,	fDECISIONPLACE,	fDECISIONOWNER,	fINQUESTNUMBER,	fINQUESTID,	fINQUESTDATE,	fBRANCH,	fBRANCHSUB,	fDEBTORID" _
    			  &  "	, fDEBTORNAME,	fDEBTORPASSPORT, fDEBTORADDRESS,	fDEBTORTYPE,	fISSUM,	fBBLOCKOTHER,	fBBLOCKSUM1,	fBBLOCKCUR1,	fBBLOCKSUM2,	fBBLOCKCUR2,	fBBLOCKSUM3" _
    			  &  "	, fBBLOCKCUR3,	fBBLOCKSUM4,	fBBLOCKCUR4,	fBBLOCKSUM5,	fBBLOCKCUR5,	fBBLOCKSUM6,	fBBLOCKCUR6,	fBBLOCKSUM7,	fBBLOCKCUR7,	fORDERTEXT,	fCOURT,	fCLICODE" _
    			  &  "	,	fBLCODE,	fRESPONSEISN,	fEMPLOYERACC1,	fEMPLOYERACC2,	fEMPLOYERACC3,	fEMPLOYERACC4,	fEMPLOYERACC5,	fDUPLICATE,	fSSN,	fPROCESSED,	fBBLOCKPERCENT,	fRESPONSENUMBER" _
    			  &  "	,	fBBLOCKEDACCOUNTPERCENT,	fBBLOCKEDACCOUNT,	fBLCODEUNVER)" _
            &  "   Values ('15','2020-01-22 00:00:00',	'º01000239600',	'à00166-00001/56',	'2020-11-16 00:00:00',	'ù. ºñ¨³Ý',	'²í³· Ñ³ñÏ³¹Çñ Ï³ï³ñáÕ ³ñ¹³ñ³¹³ïáõÃÛ³Ý ³í. É»Ûï»Ý³Ýï Î³ñ»Ý Ê³Ý½³¹Û³Ý',	'01/03-02753/10'" _
            &  "  ,'00023200',	'2020-11-16 00:00:00',	'Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ',	NULL,	'4859111112',	'¸ êáÉáõßÝ êäÀ',	'97418536','ù.ºñ¨³Ý, Ø³É³ÃÇ³-ê»µ³ëïÇ³, Þñç³Ý³ÛÇÝ 2/4-26',	0,	1,	NULL" _
            &  "  ,	'6667210.00',	'AMD',	'0.00',	NULL,	'0.00',	NULL,	'86984000.00',	'AMD',	'0.00',	NULL,	'0.00',	NULL,	'8979200.00',	'AMD',	'¸ êáÉáõßÝ êäÀ-Çó Ñû·áõï §Ð³ñ³íÏáíÏ³ëÛ³Ý »ñÏ³ÃáõÕÇ¦ ö´À-Ç µéÝ³·³ÝÓ»É 94.000.000 ÐÐ ¹ñ³Ù'" _
            &  "  ,	'Ø³É³ÃÇ³ - ê»µ³ëïÇ³ Ñ³Ù³ÛÝùÇ ÁÝ¹Ñ³Ýáõñ Çñ³í³ëáõÃÛ³Ý',	'00034855',' ', ' ',NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	NULL,	NULL)" 
    'Բռնագանձում
    SqlQuery7 = "insert into DAHKCATCH (fIMPDATE,	fMESSAGEID,	fDECISIONNUM,	fDECISIONDATE,	fDECISIONPLACE,	fDECISIONOWNER," _
                & "fINQUESTNUMBER,	fINQUESTDATE,	fBRANCH,	fBRANCHSUB,	fTREASURYNAME,	fTREASURYCODE,	fBRECOVERSUM1,	fBRECOVERCUR1," _
                &	"fBRECOVERSUM2,	fBRECOVERCUR2,	fBRECOVERSUM3,	fBRECOVERCUR3,	fBRECOVERSUM4,	fBRECOVERCUR4,	fBBLOCKCANCEL,	fRESPONSEISN,"_
                &	"fEMPLOYERACC1,	fEMPLOYERACC2,	fEMPLOYERACC3,	fEMPLOYERACC4,	fEMPLOYERACC5,	fPROCESSED,	fINQUESTID,	fBRECOVERPERCENT,"_
                & "fBRECOVEREDACCOUNT,	fBRECOVEREDACCOUNTPERCENT)"_
                & "Values ('2020-03-30 11:36:00',	'º02000239600',	'à00166-00002/57',	'2020-03-30 00:00:00',	'ù. ºñ¨³Ý'," _
                &	"'²í³· Ñ³ñÏ³¹Çñ Ï³ï³ñáÕ ³ñ¹³ñ³¹³ïáõÃÛ³Ý ³í. É»Ûï»Ý³Ýï Î³ñ»Ý Ê³Ý½³¹Û³Ý',	'01/03-02753/10',	'2020-11-16 00:00:00'"_
		            & ",	'Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ',	NULL,	'ºñ¨³ÝÇ ÃÇí 1 ·³ÝÓ³å»ï³Ï³Ý µ³ÅÇÝ',	'900013288015',	'6667210.00',	'AMD',	'6667210.00',	"_
                & "'AMD',	'0.00',	'AMD',	'6667210.00',	'AMD',	0,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	NULL)"                               
    'Ներմուծել հաղորդագորւթյուննները SQL հարցման միջոցով
    Call Execute_SLQ_Query(SqlQuery1)
    Call Execute_SLQ_Query(SqlQuery2)    
    Call Execute_SLQ_Query(SqlQuery3)
    Call Execute_SLQ_Query(SqlQuery4) 
    Call Execute_SLQ_Query(SqlQuery5)
    Call Execute_SLQ_Query(SqlQuery6) 
    Call Execute_SLQ_Query(SqlQuery7)
                
End Sub