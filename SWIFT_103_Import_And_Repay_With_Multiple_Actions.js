Option Explicit
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Common
'USEUNIT Library_Colour
'USEUNIT Library_CheckDB
'USEUNIT Constants
'USEUNIT CashOutput_Confirmpases_Library
'USEUNIT Library_Contracts

'Test case Id 183845
Dim VerificationDoc,dbFOLDERS(2)
    
Sub SWIFT_103_Import_And_Repay_With_Multiple_Actions_Test()

    Dim sDATE,fDATE
    Dim docNum,isn,fBODY
    Dim max,min,rand,fileFrom,fileTo,what,fWith
    
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20020101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Login("ARMSOFT")

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''--- "S.W.I.F.T. ԱՇՏ/Պարամետրեր"-ում կատարել համապատասխան փոփոխությունները---''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- S.W.I.F.T. ԱՇՏ/Պարամետրեր-ում կատարել համապատասխան փոփոխությունները --",,,DivideColor
        
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |ä³ñ³Ù»ïñ»ñ")
    BuiltIn.Delay(3000)
    
    max=100
    min=999
    Randomize
    rand = Int((max-min+1)*Rnd+min)
    fileFrom = Project.Path &"Stores\SWIFT\HT103\ImportFile\IA000385.RJE"
    fileTo = Project.Path &"Stores\SWIFT\HT103\ImportFile\Import\IA000387.RJE"
    aqFileSystem.DeleteFile(Project.Path &"Stores\SWIFT\HT103\ImportFile\Import\*")
    what = "UBSWCHZHXXXX901"
    fWith = "UBSWCHZHXXXX" & rand
    
    Log.Message(fWith)
    
    'Վերարտագրում է նախօրոք տրված ֆայլը մեկ այլ ֆայլի մեջ` կատարելով փոփոխություն
    Call Read_Write_File_With_replace(fileFrom,fileTo,what,fWith)
    
    Call SetParameter_InPttel("SWOUT",Project.Path & "Stores\SWIFT\HT103\ImportFile\Import\")
    
    Login("ARMSOFT")
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''--- Կատարել Ընդունել SWIFT համակարգից գործողությունը ---''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարել Ընդունել SWIFT համակարգից գործողությունը --",,,DivideColor
    
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |Ð³Õáñ¹³·ñáõÃÛáõÝÝ»ñÇ ÁÝ¹áõÝáõÙ|ÀÝ¹áõÝ»É S.W.I.F.T. Ñ³Ù³Ï³ñ·Çó")
    Call ClickCmdButton(5, "OK")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''--- Ստուգում է փաստաթղթի առկայությունը ---''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Ստուգում է փաստաթղթի առկայությունը --",,,DivideColor       
    
    'Մուտք գործել "Արտաքին փոխանցումների ԱՇՏ"
    Call ChangeWorkspace(c_ExternalTransfers)
    Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|êï³óí³Í Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|Ð³ßí³éÙ³Ý »ÝÃ³Ï³")
    Call Rekvizit_Fill("Dialog",1,"General", "PERN",aqDateTime.Today)
    Call Rekvizit_Fill("Dialog",1,"General", "PERK",aqDateTime.Today)
    Call ClickCmdButton(2, "Î³ï³ñ»É") 
    BuiltIn.Delay(4000) 
    
    'Ստուգում է փաստաթղթի առկայությունը
    docNum = "951394"
    Call SearchInPttel("frmPttel",2, DocNum)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''-- Հանձնարարգրում լրացնում է "Տարանցիկ հաշիվ" դաշտը --''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Հանձնարարգրում լրացնում է Տարանցիկ հաշիվ դաշտը --",,,DivideColor    
    
    'Խմբագրում է հանձնարարգիրը
    Call wMainForm.MainMenu.Click(c_AllActions)    
    Call wMainForm.PopupMenu.Click(c_ToEdit)
    'Լրացնում է "Տարանցիկ հաշիվ" դաշտը
    Call Rekvizit_Fill("Document",2,"General","TCORRACC","000548101")
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''-- Կատարում է "Հաշվառել" գործողությունը --''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարում է Հաշվառել գործողությունը--",,,DivideColor        
    
    'Կատարում է "Հաշվառել" գործողությունը
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)    
    Call wMainForm.PopupMenu.Click(c_DoTrans)
    
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    Call Close_Window(wMDIClient, "frmPttel")
    Call Close_Window(wMDIClient, "FrmSpr")
    
    Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|êï³óí³Í Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|î³ñ³ÝóÇÏ")
    Call Rekvizit_Fill("Dialog",1,"General", "PERN",aqDateTime.Today)
    Call Rekvizit_Fill("Dialog",1,"General", "PERK",aqDateTime.Today)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''-- Կատարում է "Մարել (Բազմակի փոխանցման հանձնարարականով)" գործողությունը --''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարում է Մարել (Բազմակի փոխանցման հանձնարարականով) գործողությունը--",,,DivideColor
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_RepayWithMultiple)
    
    With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
        .Row = 0
        .Col = 0
        .Keys("7770003485010101" & "[Enter]")
      
        .Row = 0
        .Col = 2
        .Keys("6,000.00" & "[Enter]")
            
        .Row = 1
        .Col = 0
        .Keys("7770000068360101" & "[Enter]")
       
        .Row = 1
        .Col = 2
        .Keys("560.00" & "[Enter]")
    End With

    'Փաստաթղթի N դաշտի արժեքի և isn-ի վերագրում փոփոխականին
    docNum = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
    Isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
    Call ClickCmdButton(1, "Î³ï³ñ»É")  
    BuiltIn.Delay(2000)
    
    Call SQL_Initialize_For_Repay_With_Multiple_Actions(Isn,docNum)
    Log.Message "SQL Check After Մարել (Բազմակի փոխանցման հանձնարարականով)",,,SqlDivideColor
    Log.Message "fISN = "& Isn,,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  USERID:  77  ACSBRANCH:00  ACSDEPART:1  BLREP:0  ACCDB:77700000548101  PAYER:1/ABCD                             2/HASCE,POXOC       "&_
            "               3/  SUMMA:6560  CUR:001  AIM:/ACC TO THE INVOICE                //N88/20 DD 13.09.2009  REPAY:0  IMPORT:0  TAXPAY:0  "&_
            "PAYSYSIN:Ð  PAYSYSOUT:1  FORTRADE:0  ACCTYPE:B  SYSCASE:REPAY  CASHAC:0  CANCELREQ:0  TYPECODE1:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"&_
            "  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  CHRGINC:000926900  NONREZ:0  SBQENABLED:0  NOTSENDABLEDB:0  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",Isn,1)
    Call CheckDB_DOCS(Isn,"Pay1toMY","101",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում
    Call CheckQueryRowCount("DOCLOG","fISN",Isn,3)
    Call CheckDB_DOCLOG(Isn,"77","N","1","",1)
    Call CheckDB_DOCLOG(Isn,"77","M","99","àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý",1)
    Call CheckDB_DOCLOG(Isn,"77","C","101","",1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",isn,8)
    Call CheckDB_DOCSG(isn,"TRACTS","0","ACCCR","7770003485010101",1)
    Call CheckDB_DOCSG(isn,"TRACTS","1","ACCCR","7770000068360101",1)
    Call CheckDB_DOCSG(isn,"TRACTS","0","NOTSENDABLECR","0",1)
    Call CheckDB_DOCSG(isn,"TRACTS","1","NOTSENDABLECR","0",1)
    Call CheckDB_DOCSG(isn,"TRACTS","0","RECEIVER","êäÀ111                                                                                                                                      ",1)
    Call CheckDB_DOCSG(isn,"TRACTS","1","RECEIVER","Olimp                                                                                                                                       ",1)
    Call CheckDB_DOCSG(isn,"TRACTS","0","SUMMA","6000",1)
    Call CheckDB_DOCSG(isn,"TRACTS","1","SUMMA","560",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում
    Call CheckQueryRowCount("FOLDERS","fISN",Isn,2)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    
    Call Close_Window(wMDIClient, "frmPttel") 
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''-- Գլխավոր հաշվապահ/Հաստատվող փաստաթղթեր(|) թղթապանակից կատարել "Վավերացնել" գործողությունը --''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարել Վավերացնել գործողությունը --",,,DivideColor   

    Set VerificationDoc = New_VerificationDocument()
        VerificationDoc.DocType = "Pay1toMY"
    
    'Մուտք Գլխավոր հաշվապահի ԱՇՏ
    Call ChangeWorkspace(c_ChiefAcc)
    Call GoToVerificationDocument("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ (I)",VerificationDoc) 
    
    If WaitForPttel("frmPttel") Then

        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_ToConfirm)
        BuiltIn.Delay(3000)
        Call ClickCmdButton(1, "Ð³ëï³ï»É")

        Call Close_Window(wMDIClient, "frmPttel")
     Else
        Log.Error "Can Not Open Հաստատվող փաստաթղթեր(|) Window",,,ErrorColor      
     End If 
     
     Log.Message "SQL Check After To Confirm",,,SqlDivideColor

    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  USERID:  77  ACSBRANCH:00  ACSDEPART:1  BLREP:0  ACCDB:77700000548101  PAYER:1/ABCD                             2/HASCE,POXOC       "&_
            "               3/  SUMMA:6560  CUR:001  AIM:/ACC TO THE INVOICE                //N88/20 DD 13.09.2009  REPAY:0  IMPORT:0  TAXPAY:0  "&_
            "PAYSYSIN:Ð  PAYSYSOUT:1  FORTRADE:0  ACCTYPE:B  SYSCASE:REPAY  CASHAC:0  CANCELREQ:0  TYPECODE1:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28"&_
            "  TYPECODE2:-10 20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28  CHRGINC:000926900  NONREZ:0  SBQENABLED:0  NOTSENDABLEDB:0  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",Isn,1)
    Call CheckDB_DOCS(Isn,"Pay1toMY","8",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում
    Call CheckQueryRowCount("DOCLOG","fISN",Isn,5)
    Call CheckDB_DOCLOG(Isn,"77","N","1","",1)
    Call CheckDB_DOCLOG(Isn,"77","M","99","àõÕ³ñÏí»É ¿ Ñ³ëï³ïÙ³Ý",1)
    Call CheckDB_DOCLOG(Isn,"77","W","102","",1)
    Call CheckDB_DOCLOG(Isn,"77","M","8","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    
    Call Close_AsBank()   
End Sub

Sub SQL_Initialize_For_Repay_With_Multiple_Actions(fISN,docNum)
    
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1)
        .fFOLDERID = "Oper."&aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")
        .fNAME = "Pay1toMY"
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "0"
        .fCOM = "´³½Ù³ÏÇ ÷áË³ÝóÙ³Ý Ñ³ÝÓÝ³ñ³ñ³Ï³Ý"
        .fSPEC = docNum&"77700000548101  77700                    6560.00001àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý                                 771/ABCD         "&_
                        "                                                                        Ð1       /ACC TO THE INVOICE                //N88/20 DD 13.09.2009                                                                                   "
        .fECOM = "Multiple Payment Order"
        .fDCBRANCH = "00"
        .fDCDEPART = "1"
    End With  
    
    Set dbFOLDERS(2) = New_DB_FOLDERS()
    With dbFOLDERS(2)
        .fFOLDERID = "Ver."&aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")&"001"
        .fNAME = "Pay1toMY"
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "5"
        .fCOM = "´³½Ù³ÏÇ ÷áË³ÝóÙ³Ý Ñ³ÝÓÝ³ñ³ñ³Ï³Ý"
        .fSPEC = docNum&"77700000548101  77700                    6560.00001  77/ACC TO THE INVOICE             1/ABCD                                                                 Ð1"
        .fECOM = "Multiple Payment Order"
        .fDCBRANCH = "00"
        .fDCDEPART = "1"
    End With  
End Sub