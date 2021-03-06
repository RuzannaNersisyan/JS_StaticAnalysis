'USEUNIT Library_Common 
'USEUNIT Library_Colour
'USEUNIT Constants
'USEUNIT Subsystems_Special_Library
'USEUNIT Mortgage_Library
'USEUNIT Library_Contracts
'USEUNIT Library_CheckDB
'USEUNIT Deposit_Library
'USEUNIT Overlimit_Library

Option Explicit
'Test Case Id - 154794

Dim Deposit_Box_Filter,Deposit_Box,NewDepositCondition
Dim DepositRental,DepositRentalAgr_ForCheck,DepositBoxRentalFilter,VisitAgreement
Dim Deposit_Box_WorkingAgr_Filter,WorkingAgreement,VisitISN
Dim DocForm,dbFOLDERS(14),ISN,fBODY,dbHI2,dbPAYMENTS(2),ProlongIsn
Dim VerificationDoc,RegisterForDepositBox

'Պահատեղերի ԱՇՏ
Sub Check_DepositRentalCash_Agreement()
    
    Dim sDATE,fDATE
     
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20020101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Login("ARMSOFT")

    'Մուտք գործել "Պահատեղերի ԱՇՏ"
    Call ChangeWorkspace(c_Deposit_Boxes)

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''--- Մուտք գործել Պահատեղեր թղթապանակ ---'''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Call Test_InitializeFor_DepositRentalCash()

    Call GoTo_DepositBoxes(Deposit_Box_Filter)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''--- Ստեղծել Պահատեղ ---''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Create New Deposit Boxes ---",,,DivideColor
           
    Call Create_DepositBox(Deposit_Box)

    Log.Message "fISN = "& Deposit_Box.Isn,,,SqlDivideColor
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''--- Աջ կլիկ(Ստեղծել Պահատեղ վարձ.պայմանագիր) ---'''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Right Click(Create Deposit box rental Agreement) ---",,,DivideColor
    
    Call Create_DepositRental(c_Deposit_Rental,NewDepositCondition,DepositRentalAgr_ForCheck,DepositRental)
    Call Close_Pttel("frmPttel") 
    
    Log.Message "SQL Check After Right Click(Create Deposit box rental Agreement)",,,SqlDivideColor
    Log.Message "fISN = "& DepositRental.Isn,,,SqlDivideColor
    
    Call SQL_Initialize_ForDepositRentalCash(DepositRental.Isn) 
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  AGRNUM:222222222  DATE:20210101  CLICODE:00000001  NAME:§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦  ENAME:§Big¦ Bank  FORCEACCCON:0  FORCECLISCH:0  ACCCONNECT:001  USECLISCH:1  STANDARD:999  DURATION:05  STARTDATE:20210101  ENDDATE:20210701  SUMMA:20000  VATMETH:0  PAYTYPE:1  NONWD:0  FORCEAPVAL:0  AUTOPROL:0  REMSMS:0  REMEMAIL:1  REMIB:0  DBOXTYPE:011  DBOXNUMBER:999999999999  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:01  AUTOPROLONGED:0  DOCDATE:20210101  JOINT:1  ADDINFO:__Additional_Information__  USERID:77  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","1",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",DepositRental.Isn,2)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","T","1"," ",1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",DepositRental.Isn,6)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","ADDRESS","²ñß³ÏáõÝÛ³ó                                                                                         ",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","CLICODE","00000018",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","ISSUEAUTHORITY","001",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","ISSUEDATE","19900101",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","NAME","ä»ïñáëÛ³Ý ä»ïñáë                ",1)
    Call CheckDB_DOCSG(DepositRental.Isn,"AUTHORITIES","0","PASSPORT","AB3333332           ",1)

    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",DepositRental.Isn,6)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
    Call CheckDB_FOLDERS(dbFOLDERS(4),1)
    Call CheckDB_FOLDERS(dbFOLDERS(5),1)
    Call CheckDB_FOLDERS(dbFOLDERS(14),1)
    
    'SQL Ստուգում HI2 աղուսյակում 
    Set dbHI2 = New_DB_HI2()
    With dbHI2
        .fDATE = "2021-01-01"
        .fTYPE = "BB"
        .fOBJECT = Deposit_Box.Isn
        .fGLACC = DepositRental.Isn
        .fSUM = "1.00"
        .fCURSUM = "1.00"
        .fOP = "OCP"
        .fBASE = DepositRental.Isn
        .fDBCR = "D"
        .fBASEBRANCH = "00"
        .fBASEDEPART = "1"
    End With
        
    Call CheckQueryRowCount("HI2","fBASE",DepositRental.Isn,1)
    Call CheckDB_HI2(dbHI2,1)
    
    'SQL Ստուգում HIREST2 աղուսյակում 
    Call CheckQueryRowCount("HIREST2","fOBJECT",DepositRental.Isn,1)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,DepositRental.Isn,"1.00","XXX","0.00", 1)
    
    'SQL Ստուգում PARAMS աղուսյակում 
    Call CheckQueryRowCount("PARAMS","fVALUE","222222223",1)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''--- Ուղարկել հաստատման ---''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Send To Verify ---",,,DivideColor
    
    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
    
    If WaitForPttel("frmPttel") Then
      If SearchInPttel("frmPttel",3, "222222222") Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_SendToVer)
          BuiltIn.Delay(2000)
          Call MessageExists(2,"àõÕ³ñÏ»±É Ñ³ëï³ïÙ³Ý:")
          Call ClickCmdButton(5, "²Ûá")
      End If
      Call Close_Pttel("frmPttel")
    Else
        Log.Error "Can Not Open Deposit Working Agreement pttel",,,ErrorColor      
    End If 
    
    Log.Message "SQL Check After Send To Verify",,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","101",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",DepositRental.Isn,3)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","E","101"," ",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    dbFOLDERS(1).fSTATUS = "0"
    dbFOLDERS(1).fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21) [àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý]"
    dbFOLDERS(14).fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21), ÉÇ³½áñí³Í ³ÝÓ  [àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý]"
    dbFOLDERS(2).fSPEC = "101 77  00000001           20210101202101012021070199905        20000.00100010            0.00      0119999999999991202101010         0         00000000000000000011001  "
    dbFOLDERS(4).fSTATUS = "0"
    dbFOLDERS(4).fSPEC = "222222222       101 77  222222222     00000001011999999999999àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý                                                                           "
    dbFOLDERS(5).fSPEC = "101 77  00000001           20210101202101012021070199905        20000.00100010            0.00      0119999999999991202101010         0         00000000000000000011001  "
    
    Call CheckQueryRowCount("FOLDERS","fISN",DepositRental.Isn,7)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
    Call CheckDB_FOLDERS(dbFOLDERS(4),1)
    Call CheckDB_FOLDERS(dbFOLDERS(5),1)
    Call CheckDB_FOLDERS(dbFOLDERS(6),1)
    Call CheckDB_FOLDERS(dbFOLDERS(14),1)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''--- Հաստատել պայմանագիրը (Հաստատող | ԱՇՏ)-ից ---'''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Verify Agreement---",,,DivideColor
    
    'Մուտք գործել "Հաստատող | ԱՇՏ"
    Call ChangeWorkspace(c_Verifier1)
    
    Call wTreeView.DblClickItem("|Ð³ëï³ïáÕ I ²Þî|ä³Ñ³ï»ÕÇ Ñ³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ")
    If WaitForPttel("frmPttel") Then
        If SearchInPttel("frmPttel",3, "222222222") Then
            Call wMainForm.MainMenu.Click(c_AllActions)
            Call wMainForm.PopupMenu.Click(c_ToConfirm)
            BuiltIn.Delay(2000)
            Call ClickCmdButton(1, "Ð³ëï³ï»É")
        End If    
        Call Close_Pttel("frmPttel")  
    Else
        Log.Error "Can Not Open Verify Deposit Agreement pttel",,,ErrorColor      
    End If
    
    Log.Message "SQL Check After Verify Agreement",,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckQueryRowCount("DOCS","fISN",DepositRental.Isn,1)
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","2",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",DepositRental.Isn,5)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","W","102"," ",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","M","2","Ð³ëï³ïí»É ¿",1)

    'SQL Ստուգում FOLDERS աղուսյակում
    dbFOLDERS(1).fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21) [ºÝÃ³Ï³ ¿ ïñ³Ù³¹ñÙ³Ý]"
    dbFOLDERS(14).fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21), ÉÇ³½áñí³Í ³ÝÓ  [ºÝÃ³Ï³ ¿ ïñ³Ù³¹ñÙ³Ý]"
    dbFOLDERS(2).fSPEC = "2   77  00000001           20210101202101012021070199905        20000.00100010            0.00      0119999999999991202101010         0         00000000000000000011001  "
    dbFOLDERS(4).fSTATUS = "1"
    dbFOLDERS(4).fSPEC = "222222222       2   77  222222222     00000001011999999999999ºÝÃ³Ï³ ¿ ïñ³Ù³¹ñÙ³Ý                                                                             "
    dbFOLDERS(5).fSPEC = "2   77  00000001           20210101202101012021070199905        20000.00100010            0.00      0119999999999991202101010         0         00000000000000000011001  "

    Call CheckQueryRowCount("FOLDERS","fISN",DepositRental.Isn,6)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
    Call CheckDB_FOLDERS(dbFOLDERS(4),1)
    Call CheckDB_FOLDERS(dbFOLDERS(5),1)
    Call CheckDB_FOLDERS(dbFOLDERS(14),1)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Պահատեղի աշխատանքային փաստաթղթեր-ից կատարել Գանձում/տրամադրում գործողություն ---'''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Check RC - Charge/Provide Action ---",,,DivideColor
    
    'Մուտք գործել "Պահատեղերի ԱՇՏ"
    Call ChangeWorkspace(c_Deposit_Boxes)
    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
    
    If WaitForPttel("frmPttel") Then
      If SearchInPttel("frmPttel",3, "222222222") Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_ChargeAndProvide)
          BuiltIn.Delay(2000)
          'ISN-ի վերագրում փոփոխականին
          Isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
          'Լրացնում է "Փաստաթղթի N" դաշտը
          Call Rekvizit_Fill("Document",1,"General","DOCNUM","000870")
          'Լրացնում է "Անուն" դաշտը
          Call Rekvizit_Fill("Document", 1, "General", "PAYER", "Charge And Provide")

          Call ClickCmdButton(1, "Î³ï³ñ»É")
          BuiltIn.Delay(4000)
          If wMDIClient.WaitVBObject("FrmSpr",1000).Exists Then
              wMDIClient.VBObject("FrmSpr").Close
          End If
      Else
         Log.Error "Can Not Find Deposit Agreement Line",,,ErrorColor      
      End If
    Else
        Log.Error "Can Not Open Deposit Working Agreement pttel",,,ErrorColor      
    End If
    Call Close_Pttel("frmPttel")  
    
    Log.Message "SQL Check After RC - Charge/Provide Action",,,SqlDivideColor
    Log.Message "fISN = "& ISN,,,SqlDivideColor
    
    Call SQL_Initialize_ForDepositRentalCash(ISN)
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  ACSBRANCH:00  ACSDEPART:1  BLREP:0  USERID:  77  DOCNUM:000870  DATE:20210101  KASSA:001  ACCDB:000001100  CUR:000  KASSIMV:03  PAYER:Charge And Provide  SYSCASE:DEPBOX  ACSBRANCHINC:00  ACSDEPARTINC:1  NONREZ:0  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS","fISN",ISN,1)
    Call CheckDB_DOCS(ISN,"PkCash  ","2",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",ISN,2)
    Call CheckDB_DOCLOG(ISN,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(ISN,"77","C","2"," ",1)
    
    'SQL Ստուգում DOCP աղուսյակում  
    Call CheckQueryRowCount("DOCP","fISN",ISN,1)
    Call CheckDB_DOCP(ISN,"PkCash  ",DepositRental.Isn,1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",ISN,5)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","ACCCR","00000110700",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","AIM","ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 222222222                                                                                              ",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","NOTSENDABLE","0",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","OPERTYPE","FEE",1)
    Call CheckDB_DOCSG(ISN,"SUBSUMS","0","SUMMA","20000",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",ISN,1)
'    Call CheckDB_FOLDERS(dbFOLDERS(7),1)
    Call CheckDB_FOLDERS(dbFOLDERS(8),1)
    
    'SQL Ստուգում HI աղուսյակում  
    Call CheckQueryRowCount("HI","fBASE",ISN,2)
    Call Check_HI_CE_accounting ("20210101",ISN, "11",  "1630170", "20000.00", "000", "20000.00", "FEE", "D")
    Call Check_HI_CE_accounting ("20210101",ISN, "11",  "645244712", "20000.00", "000", "20000.00", "FEE", "C")
    
    'SQL Ստուգում HIREST  աղուսյակում  
    Call CheckDB_HIREST("11", "1630170","83484642.60","000","83484642.60",1)

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''-"Գլխավոր հաշվապահ/Աշխատանքային փաստաթղթեր" թղթապանակից կատարել Ուղարկել հաստատման գործողությունը-''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "Send To Ver and Confirm Agreement",,,DivideColor       
    
    'Մուտք "Գլխավոր հաշվապահի ԱՇՏ"   
    Call ChangeWorkspace(c_ChiefAcc)
    Call ToCountPayment(c_SendToVer,"010121")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''-"Գլխավոր հաշվապահ/Հաստատվող փաստաթղթեր |" թղթապանակից կատարել  Վավերացնել գործողությունը-''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    
    Set VerificationDoc = New_VerificationDocument()
    Call GoToVerificationDocument("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ (I)",VerificationDoc)
    
    If WaitForPttel("frmPttel") Then
        If SearchInPttel("frmPttel",0, "01/01/21") Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_ToConfirm)
          BuiltIn.Delay(2000)
          
          Call ClickCmdButton(1, "Ð³ëï³ï»É")
        End If
    Else
        Log.Error "Can Not Open Confirm pttel",,,ErrorColor      
    End If
    Call Close_Pttel("frmPttel")
    
    Log.Message "SQL Check After ToCount Charge/Provide Action",,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckDB_DOCS(ISN,"PkCash  ","15",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",ISN,5)
    Call CheckDB_DOCLOG(ISN,"77","W","102","",1)
    Call CheckDB_DOCLOG(ISN,"77","C","15","",1)
    
    
    dbFOLDERS(7).fSTATUS = "4"
    dbFOLDERS(7).fSPEC = "²Ùë³ÃÇí- 01/01/21 N- 000870 ¶áõÙ³ñ-            20,000.00 ²ñÅ.- 000 [Ð³ëï³ïí³Í]"
    dbFOLDERS(8).fSTATUS = "4"
    dbFOLDERS(8).fSPEC = "00087077700000001100                          20000.00000Ð³ëï³ïí³Í                                             77Charge And Provide                                                                                                                                                                                                                          "

    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",ISN,1)
'    Call CheckDB_FOLDERS(dbFOLDERS(7),1)
    Call CheckDB_FOLDERS(dbFOLDERS(8),1)
    Call CheckQueryRowCount("FOLDERS","fISN",DepositRental.Isn,6)
    
    'SQL Ստուգում HI2 աղուսյակում 
    Set dbHI2 = New_DB_HI2()
    With dbHI2
        .fDATE = "2021-01-01"
        .fTYPE = "BB"
        .fOBJECT = Deposit_Box.Isn
        .fGLACC = DepositRental.Isn
        .fSUM = "1.00"
        .fCURSUM = "1.00"
        .fOP = "OCP"
        .fBASE = DepositRental.Isn
        .fDBCR = "D"
        .fBASEBRANCH = "00"
        .fBASEDEPART = "1"
    End With
        
    Call CheckQueryRowCount("HI2","fBASE",DepositRental.Isn,1)
    Call CheckDB_HI2(dbHI2,1)
    
    'SQL Ստուգում HIREST2 աղուսյակում 
    Call CheckQueryRowCount("HIREST2","fOBJECT",DepositRental.Isn,1)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,DepositRental.Isn,"1.00","XXX","0.00", 1)
    Call CheckQueryRowCount("HIREST2","fGLACC",DepositRental.Isn,4)
    Call CheckDB_HIREST2("BB",Deposit_Box.Isn,DepositRental.Isn,"0.00","","0.00", 1)
    Call CheckDB_HIREST2("BB",Deposit_Box.Isn,DepositRental.Isn,"1.00","","1.00", 1)
    Call CheckDB_HIREST2("BB",Deposit_Box.Isn,DepositRental.Isn,"1.00","XXX","0.00", 1)
    
    'SQL Ստուգում HI աղուսյակում 
    Call CheckQueryRowCount("HI","fBASE",Isn,2)
    Call Check_HI_CE_accounting ("20210101",Isn, "11",  "1630170", "20000.00", "000", "20000.00", "FEE", "D")
    Call Check_HI_CE_accounting ("20210101",Isn, "11",  "645244712", "20000.00", "000", "20000.00", "FEE", "C")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Պահատեղերի ԱՇՏ/Աշխատանքային փաստաթղթեր-ից կատարել Վավերացնել գործողություն ---'''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- To Confirm Deposot Box Agreement ---",,,DivideColor
    
    'Մուտք գործել "Պահատեղերի ԱՇՏ"
    Call ChangeWorkspace(c_Deposit_Boxes)
    Call GoTo_WorkingAgreement(WorkingAgreement) 
    
    If WaitForPttel("frmPttel") Then
        If SearchInPttel("frmPttel",0, "01/01/21") Then
            BuiltIn.Delay(2000)
            Call wMainForm.MainMenu.Click(c_AllActions)
            Call wMainForm.PopupMenu.Click(c_ToConfirm)   
            Call ClickCmdButton(1, "Ð³ëï³ï»É")
        End If
    Else
        Log.Error "Can Not Open Deposot Box Agreement pttel",,,ErrorColor      
    End If
    Call Close_Pttel("frmPttel") 
    
    Log.Message "SQL Check After To Confirm Action",,,SqlDivideColor
    
    Call SQL_Initialize_ForDepositRentalCash(DepositRental.Isn)
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckQueryRowCount("DOCS","fISN",ISN,1)
    Call CheckDB_DOCS(ISN,"PkCash  ","11",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",DepositRental.Isn,9)
    Call CheckQueryRowCount("DOCLOG","fISN",Isn,7)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","M","3","PROCESSED",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","T","7","",1)
    Call CheckDB_DOCLOG(Isn,"77","W","16","",1)
    Call CheckDB_DOCLOG(Isn,"77","M","11","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    
     dbFOLDERS(1).fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21)"
     dbFOLDERS(14).fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21), ÉÇ³½áñí³Í ³ÝÓ "
     dbFOLDERS(2).fSTATUS = "1"
     dbFOLDERS(2).fSPEC = "7   77  00000001           20210101202101012021070199905        20000.00100010            0.00      0119999999999991202101010         0         00000000000000000011001  "
     dbFOLDERS(3).fSTATUS = "1"
     dbFOLDERS(5).fSPEC = "7   77  00000001           20210101202101012021070199905        20000.00100010            0.00      0119999999999991202101010         0         00000000000000000011001  "

    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",DepositRental.Isn,5)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
    Call CheckDB_FOLDERS(dbFOLDERS(5),1)
    Call CheckDB_FOLDERS(dbFOLDERS(14),1)
    
    'SQL Ստուգում HI աղուսյակում 
    Call CheckQueryRowCount("HI","fBASE",Isn,2)
    Call Check_HI_CE_accounting ("20210101",Isn, "01",  "1630170", "20000.00", "000", "20000.00", "FEE", "D")
    Call Check_HI_CE_accounting ("20210101",Isn, "01",  "645244712", "20000.00", "000", "20000.00", "FEE", "C")
    
    'SQL Ստուգում HI2 աղուսյակում 
    dbHI2.fOBJECT = DepositRental.Isn
    dbHI2.fTYPE = "BA"
    dbHI2.fOP = "PVD"
        
    Call CheckQueryRowCount("HI2","fBASE",DepositRental.Isn,2)
    Call CheckDB_HI2(dbHI2,1)
    
    'SQL Ստուգում HIREST  աղուսյակում  
    Call CheckDB_HIREST("11", "1630170","83464642.60","000","83464642.60",1)
    
    'SQL Ստուգում HIREST2 աղուսյակում 
    Call CheckQueryRowCount("HIREST2","fOBJECT",DepositRental.Isn,3)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,DepositRental.Isn,"0.00","","0.00", 1)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,DepositRental.Isn,"1.00","","1.00", 1)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,DepositRental.Isn,"1.00","XXX","0.00", 1)
    
    Call SQL_Initialize_ForDepositRentalCash(ISN)
    'SQL Ստուգում PAYMENTS աղուսյակում 
    Call CheckQueryRowCount("PAYMENTS","fISN",Isn,1)
    Call CheckDB_PAYMENTS(dbPAYMENTS(1),1)

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''-- Պայմանագիրը ուղարկել Ռեեստր --'''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''      
    Log.Message "-- Send to Register --",,,DivideColor        
    
    Call GoTo_AccRegisterForDepositBox(RegisterForDepositBox)
    
    Call EditRegisterStatus("1","àõÕ³ñÏí³Í")
    Call Close_Pttel("frmPttel")

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''-"Պայմանագրի փակում" գործողության կատարում-'''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''      
    Log.Message "Check RC (Close Contract) Action",,,DivideColor    
    
    Call GoTo_DepositBoxRental(DepositBoxRentalFilter) 
    Call CloseDepositContract("010121")
    
    Log.Message "SQL Check After (Close Contract) Action",,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  AGRNUM:222222222  DATE:20210101  CLICODE:00000001  NAME:§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦  ENAME:§Big¦ Bank  FORCEACCCON:0  FORCECLISCH:0  ACCCONNECT:001  USECLISCH:1  STANDARD:999  DURATION:05  STARTDATE:20210101  ENDDATE:20210701  SUMMA:20000  VATMETH:0  PAYTYPE:1  NONWD:0  FORCEAPVAL:0  AUTOPROL:0  REMSMS:0  REMEMAIL:1  REMIB:0  DBOXTYPE:011  DBOXNUMBER:999999999999  CLOSEDATE:20210101  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:01  AUTOPROLONGED:0  DOCDATE:20210101  JOINT:1  ADDINFO:__Additional_Information__  USERID:77  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","77",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",DepositRental.Isn,11)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","M","77","ö³Ïí»É ¿",1)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","T","77","",1)
    
    Call SQL_Initialize_ForDepositRentalCash(DepositRental.Isn)
    
     dbFOLDERS(1).fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21)[ö³Ïí³Í]"
     dbFOLDERS(14).fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21), ÉÇ³½áñí³Í ³ÝÓ [ö³Ïí³Í]"
     dbFOLDERS(1).fSTATUS = "0"
     dbFOLDERS(2).fSPEC = "77  77  00000001           20210101202101012021070199905        20000.00100010            0.00      0119999999999991202101010         0         20210101202101010011001  "
     dbFOLDERS(5).fSPEC = "77  77  00000001           20210101202101012021070199905        20000.00100010            0.00      0119999999999991202101010         0         20210101202101010011001  "

    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",DepositRental.Isn,5)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
    Call CheckDB_FOLDERS(dbFOLDERS(5),1)
    Call CheckDB_FOLDERS(dbFOLDERS(14),1)
    
    'SQL Ստուգում HI2 աղուսյակում 
    Call CheckQueryRowCount("HI2","fBASE",DepositRental.Isn,4)
    
    dbHI2.fOP = "CLS"
    dbHI2.fDBCR = "C"
    Call CheckDB_HI2(dbHI2,1)
    
    dbHI2.fTYPE = "BB"
    dbHI2.fOP = "RLS"
    dbHI2.fOBJECT = Deposit_Box.Isn
    Call CheckDB_HI2(dbHI2,1)
    Call Close_Pttel("frmPttel") 
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''-- Պայմանագիրը ուղարկել Ռեեստր --'''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''      
    Log.Message "-- Send to Register --",,,DivideColor        
    
    Call GoTo_AccRegisterForDepositBox(RegisterForDepositBox)
    Call EditRegisterStatus("2","àõÕ³ñÏí³Í Ó»éùáí")
    Call Close_Pttel("frmPttel")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''-"Պայմանագրի Բացում" գործողության կատարում-'''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''      
    Log.Message "Check RC (Open Contract) Action",,,DivideColor    
    
    Call GoTo_DepositBoxRental(DepositBoxRentalFilter) 
    Call OpenDepositContract("222222222")
    
    Log.Message "SQL Check After (Open Contract) Action",,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  AGRNUM:222222222  DATE:20210101  CLICODE:00000001  NAME:§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦  ENAME:§Big¦ Bank  FORCEACCCON:0  FORCECLISCH:0  ACCCONNECT:001  USECLISCH:1  STANDARD:999  DURATION:05  STARTDATE:20210101  ENDDATE:20210701  SUMMA:20000  VATMETH:0  PAYTYPE:1  NONWD:0  FORCEAPVAL:0  AUTOPROL:0  REMSMS:0  REMEMAIL:1  REMIB:0  DBOXTYPE:011  DBOXNUMBER:999999999999  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:01  AUTOPROLONGED:0  DOCDATE:20210101  JOINT:1  ADDINFO:__Additional_Information__  USERID:77  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckDB_DOCS(DepositRental.Isn,"DBoxAgr ","7",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",DepositRental.Isn,12)
    Call CheckDB_DOCLOG(DepositRental.Isn,"77","M","7","´³óí»É ¿",1)
    
    dbFOLDERS(1).fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21)"
    dbFOLDERS(14).fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21), ÉÇ³½áñí³Í ³ÝÓ "
    dbFOLDERS(1).fSTATUS = "1"
    dbFOLDERS(2).fSTATUS = "1"
    dbFOLDERS(3).fSTATUS = "1"
    dbFOLDERS(5).fSTATUS = "0"
    dbFOLDERS(2).fSPEC = "7   77  00000001           20210101202101012021070199905        20000.00100010            0.00      0119999999999991202101010         0         00000000000000000011001  "
    dbFOLDERS(5).fSPEC = "7   77  00000001           20210101202101012021070199905        20000.00100010            0.00      0119999999999991202101010         0         00000000000000000011001  "

    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",DepositRental.Isn,5)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1)
    Call CheckDB_FOLDERS(dbFOLDERS(2),1)
    Call CheckDB_FOLDERS(dbFOLDERS(3),1)
    Call CheckDB_FOLDERS(dbFOLDERS(5),1)
    Call CheckDB_FOLDERS(dbFOLDERS(14),1)
    
    'SQL Ստուգում HI2 աղուսյակում 
    Call CheckQueryRowCount("HI2","fBASE",DepositRental.Isn,2)

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Պահատեղի վարձակալության պայմանագրեր-ից կատարել Երկարաձգում գործողություն ---'''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Check RC - Prolong Action ---",,,DivideColor 
    
    Call RC_ProlongAction("222222222","999","06","010721","010721") 
    Call Close_Pttel("frmPttel")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Պահատեղի աշխատանքային փաստաթղթեր-ից կատարել Ուղարկել հաստատման գործողություն Երկարաձգված պայմանագրի համար ---''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Send To Verify For Prolong ---",,,DivideColor
    
    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
    
    If WaitForPttel("frmPttel") Then
      If SearchInPttel("frmPttel",3, "222222222") Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_SendToVer)
          BuiltIn.Delay(2000)
          Call MessageExists(2,"àõÕ³ñÏ»±É Ñ³ëï³ïÙ³Ý:")
          Call ClickCmdButton(5, "²Ûá")
      End If
      Call Close_Pttel("frmPttel")
    Else
        Log.Error "Can Not Open Deposit Working Agreement pttel",,,ErrorColor      
    End If    
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''--- Հաստատել Երկարաձգված պայմանագիրը պայմանագիրը (Հաստատող | ԱՇՏ)-ից ---''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Verify Prolong Agreement---",,,DivideColor
    
    'Մուտք գործել "Հաստատող | ԱՇՏ"
    Call ChangeWorkspace(c_Verifier1)
    
    Call wTreeView.DblClickItem("|Ð³ëï³ïáÕ I ²Þî|ä³Ñ³ï»ÕÇ Ñ³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ")
    If WaitForPttel("frmPttel") Then
        If SearchInPttel("frmPttel",3, "222222222") Then
            Call wMainForm.MainMenu.Click(c_AllActions)
            Call wMainForm.PopupMenu.Click(c_ToConfirm)
            
            'ISN-ի վերագրում փոփոխականին
            ProlongIsn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
            
            BuiltIn.Delay(2000)
            Call ClickCmdButton(1, "Ð³ëï³ï»É")
        End If    
        Call Close_Pttel("frmPttel")  
    Else
        Log.Error "Can Not Open Verify Deposit Agreement pttel",,,ErrorColor      
    End If
    
    Log.Message "SQL Check After Prolong Action",,,SqlDivideColor
    Log.Message "fISN = " & ProlongIsn,,,SqlDivideColor
    
    Call SQL_Initialize_ForDepositRentalCash(ProlongIsn)
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  AGRNUM:222222222  DATE:20210101  CLICODE:00000001  NAME:§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦  ENAME:§Big¦ Bank  FORCEACCCON:0  FORCECLISCH:0  ACCCONNECT:001  USECLISCH:1  STANDARD:999  DURATION:06  STARTDATE:20210701  ENDDATE:20220701  SUMMA:25000  VATMETH:0  PAYTYPE:1  NONWD:0  FORCEAPVAL:0  AUTOPROL:0  REMSMS:0  REMEMAIL:1  REMIB:0  DBOXTYPE:011  DBOXNUMBER:999999999999  ACSBRANCH:00  ACSDEPART:1  ACSTYPE:01  PROLNUM:1  AUTOPROLONGED:0  DOCDATE:20210701  JOINT:1  ADDINFO:__Additional_Information__  USERID:77  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckDB_DOCS(ProlongIsn,"DBoxAgr ","2",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",ProlongIsn,6)
    Call CheckDB_DOCLOG(ProlongIsn,"77","N","1","",1)
    Call CheckDB_DOCLOG(ProlongIsn,"77","B","1",DepositRental.Isn,1)
    Call CheckDB_DOCLOG(ProlongIsn,"77","T","1","",1)
    Call CheckDB_DOCLOG(ProlongIsn,"77","E","101","",1)
    Call CheckDB_DOCLOG(ProlongIsn,"77","W","102","",1)
    Call CheckDB_DOCLOG(ProlongIsn,"77","M","2","Ð³ëï³ïí»É ¿",1)
    
    'SQL Ստուգում DOCP աղուսյակում  
    Call CheckQueryRowCount("DOCP","fISN",ProlongIsn,1)
    Call CheckDB_DOCP(ProlongIsn,"DBoxAgr ",DepositRental.Isn,1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",ProlongIsn,6)
    Call CheckDB_DOCSG(ProlongIsn,"AUTHORITIES","0","ADDRESS","²ñß³ÏáõÝÛ³ó                                                                                         ",1)
    Call CheckDB_DOCSG(ProlongIsn,"AUTHORITIES","0","CLICODE","00000018",1)
    Call CheckDB_DOCSG(ProlongIsn,"AUTHORITIES","0","ISSUEAUTHORITY","001",1)
    Call CheckDB_DOCSG(ProlongIsn,"AUTHORITIES","0","ISSUEDATE","19900101",1)
    Call CheckDB_DOCSG(ProlongIsn,"AUTHORITIES","0","NAME","ä»ïñáëÛ³Ý ä»ïñáë                ",1)
    Call CheckDB_DOCSG(ProlongIsn,"AUTHORITIES","0","PASSPORT","AB3333332           ",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",ProlongIsn,5)
    
    dbFOLDERS(11).fFOLDERID = "DBAgr." & DepositRental.Isn
    dbFOLDERS(14).fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21, »ñÏ. N 01), ÉÇ³½áñí³Í ³ÝÓ  [ºÝÃ³Ï³ ¿ ïñ³Ù³¹ñÙ³Ý]"
    
    Call CheckDB_FOLDERS(dbFOLDERS(9),1)
    Call CheckDB_FOLDERS(dbFOLDERS(10),1)
    Call CheckDB_FOLDERS(dbFOLDERS(11),1)
    Call CheckDB_FOLDERS(dbFOLDERS(12),1)
    Call CheckDB_FOLDERS(dbFOLDERS(14),1)
    
    'SQL Ստուգում HI2 աղուսյակում 
    Set dbHI2 = New_DB_HI2()
    With dbHI2
        .fDATE = "2021-07-01"
        .fTYPE = "BB"
        .fOBJECT = Deposit_Box.Isn
        .fGLACC = DepositRental.Isn
        .fSUM = "0.00"
        .fCURSUM = "0.00"
        .fOP = "PLG"
        .fBASE = ProlongIsn
        .fDBCR = "D"
        .fBASEBRANCH = "00"
        .fBASEDEPART = "1"
    End With
        
    Call CheckQueryRowCount("HI2","fBASE",ProlongIsn,1)
    Call CheckDB_HI2(dbHI2,1)
    
    'SQL Ստուգում HIREST2 աղուսյակում 
    Call CheckQueryRowCount("HIREST2","fGLACC",ProlongIsn,1)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,ProlongIsn,"1.00","XXX","0.00", 1)
        
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Երկարաձգված պայմանագրի համար Պահատեղի աշխատանքային փաստաթղթեր-ից կատարել Գանձում/տրամադրում գործողություն ---'''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Check RC - Charge/Provide Action For Prolong Agreement ---",,,DivideColor
    
    'Մուտք գործել "Պահատեղերի ԱՇՏ"
    Call ChangeWorkspace(c_Deposit_Boxes)
    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
    
    If WaitForPttel("frmPttel") Then
      If SearchInPttel("frmPttel",3, "222222222") Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_ChargeAndProvide)
          BuiltIn.Delay(2000)
          'ISN-ի վերագրում փոփոխականին
          Isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
          
          'Լրացնում է "Փաստաթղթի N" դաշտը
          Call Rekvizit_Fill("Document",1,"General","DOCNUM","000871")
          'Լրացնում է "Անուն" դաշտը
          Call Rekvizit_Fill("Document", 1, "General", "PAYER", "Charge And Provide")
          
          Call ClickCmdButton(1, "Î³ï³ñ»É")
          BuiltIn.Delay(4000)
          If wMDIClient.WaitVBObject("FrmSpr",1000).Exists Then
              wMDIClient.VBObject("FrmSpr").Close
          End If
      Else
         Log.Error "Can Not Find Deposit Agreement Line",,,ErrorColor      
      End If
    Else
        Log.Error "Can Not Open Deposit Working Agreement pttel",,,ErrorColor      
    End If
    Call Close_Pttel("frmPttel")
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''-"Գլխավոր հաշվապահ/Աշխատանքային փաստաթղթեր" թղթապանակից կատարել ուղարկել հաստատման գործողությունը-'''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "To Count and Confirm For Prolong Agreement",,,DivideColor       
    
    'Մուտք "Գլխավոր հաշվապահի ԱՇՏ"   
    Call ChangeWorkspace(c_ChiefAcc)
    Call ToCountPayment(c_SendToVer,"010721") 
    BuiltIn.Delay(2000)
     
    Set VerificationDoc = New_VerificationDocument()
    Call GoToVerificationDocument("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ (I)",VerificationDoc)
    
    If WaitForPttel("frmPttel") Then
        If SearchInPttel("frmPttel",0, "01/07/21") Then
          Call wMainForm.MainMenu.Click(c_AllActions)
          Call wMainForm.PopupMenu.Click(c_ToConfirm)
          BuiltIn.Delay(2000)
          
          Call ClickCmdButton(1, "Ð³ëï³ï»É")  
        End If
    Else
        Log.Error "Can Not Open Confirm pttel",,,ErrorColor      
    End If
    Call Close_Pttel("frmPttel")   
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Աշխատանքային փաստաթղթեր-ից կատարել Վավերացնել գործողություն ---''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- To Confirm Prolong Agreement ---",,,DivideColor
    
    'Մուտք գործել "Պահատեղերի ԱՇՏ"
    Call ChangeWorkspace(c_Deposit_Boxes)
    WorkingAgreement.DataPeriod_End = "^A[Del]"&"010123"
    Call GoTo_WorkingAgreement(WorkingAgreement) 
    
    If WaitForPttel("frmPttel") Then
        If SearchInPttel("frmPttel",0, "01/07/21") Then
            BuiltIn.Delay(2000)
            Call wMainForm.MainMenu.Click(c_AllActions)
            Call wMainForm.PopupMenu.Click(c_ToConfirm)   
            BuiltIn.Delay(2000)
            Call ClickCmdButton(1, "Ð³ëï³ï»É")
        End If
    Else
        Log.Error "Can Not Open Deposot Box Agreement pttel",,,ErrorColor      
    End If
    Call Close_Pttel("frmPttel")
    
    Log.Message "SQL Check After Charge/Provide Action For Prolong Agreement",,,SqlDivideColor
    Log.Message "fISN = "&Isn ,,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  ACSBRANCH:00  ACSDEPART:1  BLREP:0  USERID:  77  DOCNUM:000871  DATE:20210701  KASSA:001  ACCDB:000001100  CUR:000  ISTLLCREATED:1  KASSIMV:03  PAYER:Charge And Provide  SYSCASE:DEPBOX  ACSBRANCHINC:00  ACSDEPARTINC:1  NONREZ:0  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckDB_DOCS(Isn,"PkCash  ","11",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",Isn,7)
    Call CheckDB_DOCLOG(Isn,"77","N","1","",1)
    Call CheckDB_DOCLOG(Isn,"77","C","2","",1)
    Call CheckDB_DOCLOG(Isn,"77","W","102","",1)
    Call CheckDB_DOCLOG(Isn,"77","C","15","",1)
    Call CheckDB_DOCLOG(Isn,"77","W","16","",1)
    Call CheckDB_DOCLOG(Isn,"77","M","11","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    
    'SQL Ստուգում DOCP աղուսյակում  
    Call CheckQueryRowCount("DOCP","fISN",Isn,1)
    Call CheckDB_DOCP(Isn,"PkCash  ",ProlongIsn,1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",Isn,5)
    Call CheckDB_DOCSG(Isn,"SUBSUMS","0","ACCCR","00000110700",1)
    Call CheckDB_DOCSG(Isn,"SUBSUMS","0","AIM","ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 222222222                                                                                              ",1)
    Call CheckDB_DOCSG(Isn,"SUBSUMS","0","NOTSENDABLE","0",1)
    Call CheckDB_DOCSG(Isn,"SUBSUMS","0","OPERTYPE","FEE",1)
    Call CheckDB_DOCSG(Isn,"SUBSUMS","0","SUMMA","25000",1)
    
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",ProlongIsn,4)
    
    dbFOLDERS(9).fSTATUS = "1"
    dbFOLDERS(9).fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21, »ñÏ. N 01)"
    dbFOLDERS(14).fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21, »ñÏ. N 01), ÉÇ³½áñí³Í ³ÝÓ "
    dbFOLDERS(10).fSTATUS = "1"
    dbFOLDERS(10).fSPEC = "7   77  00000001           20210101202107012022070199906        25000.00100010            0.00      0119999999999991202107010         0         00000000000000000011001  "
    dbFOLDERS(11).fSTATUS = "1"
    dbFOLDERS(11).fSPEC = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 222222222      »ñÏ. N 01 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦)"

    Call CheckDB_FOLDERS(dbFOLDERS(9),1)
    Call CheckDB_FOLDERS(dbFOLDERS(10),1)
    Call CheckDB_FOLDERS(dbFOLDERS(11),1)
    Call CheckDB_FOLDERS(dbFOLDERS(14),1)
    
    'SQL Ստուգում HI աղուսյակում 
    Call CheckQueryRowCount("HI","fBASE",Isn,2)
    Call Check_HI_CE_accounting ("20210701",Isn, "01",  "1630170", "25000.00", "000", "25000.00", "FEE", "D")
    Call Check_HI_CE_accounting ("20210701",Isn, "01",  "645244712", "25000.00", "000", "25000.00", "FEE", "C")
    
    'SQL Ստուգում HI2 աղուսյակում
    dbHI2.fTYPE = "BA"
    dbHI2.fOBJECT = DepositRental.Isn
    dbHI2.fGLACC = ProlongIsn
    dbHI2.fSUM = "1.00"
    dbHI2.fCURSUM = "1.00"
    dbHI2.fOP = "PRL"
        
    Call CheckQueryRowCount("HI2","fBASE",ProlongIsn,2)
    Call CheckDB_HI2(dbHI2,1)
    
    'SQL Ստուգում HIREST  աղուսյակում  
    Call CheckDB_HIREST("11", "1630170","83464642.60","000","83464642.60",1)
    
    Call SQL_Initialize_ForDepositRentalCash(Isn)
    
    'SQL Ստուգում PAYMENTS աղուսյակում 
    Call CheckQueryRowCount("PAYMENTS","fISN",Isn,1)
    Call CheckDB_PAYMENTS(dbPAYMENTS(2),1)
    
    'SQL Ստուգում HIREST  աղուսյակում  
    Call CheckDB_HIREST("01", "1630170","1099357652.90","000","1099357652.90",1)
    
    'SQL Ստուգում HIREST2 աղուսյակում 
    Call CheckQueryRowCount("HIREST2","fGLACC",ProlongIsn,3)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,ProlongIsn,"0.00","","0.00", 1)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,ProlongIsn,"1.00","","1.00", 1)
    Call CheckDB_HIREST2("BA",DepositRental.Isn,ProlongIsn,"1.00","XXX","0.00", 1)
    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Պահատեղի վարձակալության պայմանագրեր-ից կատարել Այցելություն գործողություն ---'''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Check RC - Visit Action ---",,,DivideColor 
    
    Call GoTo_DepositBoxRental(DepositBoxRentalFilter) 
    VisitISN = RC_VisitAction("222222222","000007","010121","12:39","15:59","222222222","AddInfo_AddInfo",False,"","") 
    Call Close_Pttel("frmPttel")
    
    Log.Message "SQL Check After RC - Visit Action",,,SqlDivideColor
    Log.Message "fISN = " & VisitISN ,,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  ACSBRANCH:00  ACSDEPART:1  USERID:77  DOCNUM:000007  DATE:20210101  IN:12:39  OUT:15:59  AGRNUM:222222222  DBOXNUMBER:999999999999  ADDINFO:AddInfo_AddInfo  "
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckDB_DOCS(VisitISN,"DBVisit ","2",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",VisitISN,4)
    Call CheckDB_DOCLOG(VisitISN,"77","N","1","",1)
    Call CheckDB_DOCLOG(VisitISN,"77","M","2","²Ûó»ÉáõÃÛ³Ý ëÏÇ½µ",1)
    Call CheckDB_DOCLOG(VisitISN,"77","M","2","²Ûó»ÉáõÃÛ³Ý ³í³ñï",1)
    Call CheckDB_DOCLOG(VisitISN,"77","T","2","",1)
    
    'SQL Ստուգում DOCSG աղուսյակում 
    Call CheckQueryRowCount("DOCSG","fISN",VisitISN,3)
	   Call CheckDB_DOCSG(VisitISN,"VISITORS","0","CLICODE","00000018",1)
    Call CheckDB_DOCSG(VisitISN,"VISITORS","0","NAME","ä»ïñáëÛ³Ý ä»ïñáë                ",1)
    Call CheckDB_DOCSG(VisitISN,"VISITORS","0","PASSPORT","AB3333332           ",1)

    Call SQL_Initialize_ForDepositRentalCash(VisitISN)
    'SQL Ստուգում FOLDERS աղուսյակում 
    Call CheckQueryRowCount("FOLDERS","fISN",VisitISN,1)
    Call CheckDB_FOLDERS(dbFOLDERS(13),1)
    
    'SQL Ստուգում HI2 աղուսյակում 
    Set dbHI2 = New_DB_HI2()
    With dbHI2
        .fDATE = "2021-01-01"
        .fTYPE = "BA"
        .fOBJECT = DepositRental.Isn
        .fGLACC = DepositRental.Isn
        .fSUM = "0.00"
        .fCURSUM = "0.00"
        .fOP = "VIS"
        .fBASE = VisitISN
        .fDBCR = "D"
        .fBASEBRANCH = "00"
        .fBASEDEPART = "1"
    End With
        
    Call CheckQueryRowCount("HI2","fBASE",VisitISN,2)
    Call CheckDB_HI2(dbHI2,1)
    dbHI2.fTYPE = "BB"
    dbHI2.fOBJECT = Deposit_Box.Isn
    dbHI2.fOP = "VST"
    Call CheckDB_HI2(dbHI2,1)

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Այցելություններ թղթապանակ-ից  հեռացնել այցելություն գործողությունը ---'''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Delete Visit Action ---",,,DivideColor

    Call GoTo_VisitAgreement(VisitAgreement)
    
    If WaitForPttel("frmPttel") Then
        Call SearchAndDelete("frmPttel", 0, "000007", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
    Else
        Log.Error "Can Not Open Deposit Working Agreement pttel",,,ErrorColor      
    End If
    Call Close_Pttel("frmPttel")
    
    Log.Message "SQL Check After Delete Visit Action",,,SqlDivideColor
    
    'SQL Ստուգում DOCS աղուսյակում
    Call CheckDB_DOCS(VisitISN,"DBVisit ","999",fBODY,1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckDB_DOCLOG(VisitISN,"77","D","999","",1)

    'SQL Ստուգում FOLDERS աղուսյակում 
    dbFOLDERS(13).fFOLDERID = ".R." & aqConvert.DateTimeToFormatStr(aqDateTime.Now(),"%Y%m%d")
    dbFOLDERS(13).fKEY = VisitISN
    dbFOLDERS(13).fSTATUS = "0"
    dbFOLDERS(13).fCOM = ""
    dbFOLDERS(13).fSPEC = Left_Align(Get_Compname_DOCLOG(VisitISN), 16)&"DEPBOX  ARMSOFT                       002  "
    dbFOLDERS(13).fECOM = ""
    
    Call CheckQueryRowCount("FOLDERS","fISN",VisitISN,1)
    Call CheckDB_FOLDERS(dbFOLDERS(13),1)
       
    'SQL Ստուգում HI2 աղուսյակում 
    Call CheckQueryRowCount("HI2","fBASE",VisitISN,0)
   
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Գլխավոր հաշվապահի ԱՇՏ/Վճարային փաստաթղթեր-ից հեռացնել Վճարային փաստաթղթեր-ը ---''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- Delete In Cheif Acountant ---",,,DivideColor
    
    'Մուտք Գլխավոր հաշվապահի ԱՇՏ   
    Call ChangeWorkspace(c_ChiefAcc)
    
    wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Լրացնել "Ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERN", "^A[Del]" & "010121")
    Call Rekvizit_Fill("Dialog",1,"General","PERK", "^A[Del]" & "010122")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    
    Set DocForm = wMDIClient.VBObject("frmPttel")
    If WaitForPttel("frmPttel") Then
        Call SearchAndDelete("frmPttel", 5, "25000", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
        BuiltIn.Delay(2000)
        Call Close_Pttel("frmPttel")
     Else
        Log.Error "Can Not Open Հաշվառված վճարային փաստաթղթեր Window",,,ErrorColor      
     End If     
     If DocForm.Exists Then
        Log.Error "Can Not Close Հաշվառված վճարային փաստաթղթեր Window",,,ErrorColor
     End If
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''--- Պահատեղի աշխատանքային փաստաթղթեր-ից հեռացնել փաստաթուղթը ---'''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "--- DELETE - Deposit Box Working Agreement  ---",,,DivideColor
    
    'Մուտք գործել "Պահատեղերի ԱՇՏ"
    Call ChangeWorkspace(c_Deposit_Boxes)
    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
     
    Set DocForm = wMDIClient.VBObject("frmPttel")
    If WaitForPttel("frmPttel") Then
        Call SearchAndDelete("frmPttel", 2, "222222222", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
        BuiltIn.Delay(2000)
        Call Close_Pttel("frmPttel")
    Else
        Log.Error "Can Not Open Deposit Boxes Working Agr Window",,,ErrorColor      
    End If     
    If DocForm.Exists Then
        Log.Error "Can Not Close Deposit Boxes Working Agr Window",,,ErrorColor
    End If

'Քանի որ Ռեեստր ուղարկված պայմանագիրը հնարավոր չի հեռացնել, այդ պատճառով տվյալ տողերը փակված են

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''--- Գլխավոր հաշվապահի ԱՇՏ/Վճարային փաստաթղթեր-ից հեռացնել Վճարային փաստաթղթեր-ը ---''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'    Log.Message "--- Delete In Cheif Acountant ---",,,DivideColor
'    
'    'Մուտք Գլխավոր հաշվապահի ԱՇՏ   
'    Call ChangeWorkspace(c_ChiefAcc)
'    
'    wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ßí³éí³Í í×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
'    'Լրացնել "Ամսաթիվ" դաշտը
'    Call Rekvizit_Fill("Dialog",1,"General","PERN", "^A[Del]" & "010121")
'    Call Rekvizit_Fill("Dialog",1,"General","PERK", "^A[Del]" & "010122")
'    Call ClickCmdButton(2, "Î³ï³ñ»É")
'    BuiltIn.Delay(2000)
'    
'    Set DocForm = wMDIClient.VBObject("frmPttel")
'    If WaitForPttel("frmPttel") Then
'        Call SearchAndDelete("frmPttel", 5, "20000", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
'        BuiltIn.Delay(2000)
'        Call Close_Pttel("frmPttel")
'     Else
'        Log.Error "Can Not Open Հաշվառված վճարային փաստաթղթեր Window",,,ErrorColor      
'     End If     
'     If DocForm.Exists Then
'        Log.Error "Can Not Close Հաշվառված վճարային փաստաթղթեր Window",,,ErrorColor
'     End If        
'    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''--- Պահատեղի աշխատանքային փաստաթղթեր-ից հեռացնել փաստաթուղթը ---'''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'    Log.Message "--- DELETE - Deposit Box Working Agreement  ---",,,DivideColor
'    
'    'Մուտք գործել "Պահատեղերի ԱՇՏ"
'    Call ChangeWorkspace(c_Deposit_Boxes)
'    Call GoTo_DepositBoxes_WorkingAgr(Deposit_Box_WorkingAgr_Filter) 
'     
'    Set DocForm = wMDIClient.VBObject("frmPttel")
'    If WaitForPttel("frmPttel") Then
'        Call SearchAndDelete("frmPttel", 2, "222222222", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
'        BuiltIn.Delay(2000)
'        Call Close_Pttel("frmPttel")
'    Else
'        Log.Error "Can Not Open Պահատեղի աշխատանքային փաստաթղթե Window",,,ErrorColor      
'    End If     
'    If DocForm.Exists Then
'        Log.Error "Can Not Close Պահատեղի աշխատանքային փաստաթղթե Window",,,ErrorColor
'    End If   
'
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''--- Պահատեղեր-ից հեռացնել ստեղծված փաստաթուղթը ---'''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'    Log.Message "--- DELETE - Deposit Box Agreement ---",,,DivideColor     
'    
'    Call GoTo_DepositBoxes(Deposit_Box_Filter) 
'     
'    Set DocForm = wMDIClient.VBObject("frmPttel")
'    If WaitForPttel("frmPttel") Then
'        Call SearchAndDelete("frmPttel", 0, "999999999999", "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
'        BuiltIn.Delay(2000)
'        Call Close_Pttel("frmPttel")
'    Else
'        Log.Error "Can Not Open Պահատեղեր Window",,,ErrorColor      
'    End If     
'    If DocForm.Exists Then
'        Log.Error "Can Not Close Պահատեղեր Window",,,ErrorColor
'    End If     
     
    Call Close_AsBank()
End Sub

Sub Test_InitializeFor_DepositRentalCash()
  
    Set Deposit_Box_Filter = New_Deposit_Boxes_Filter()
    
    Set Deposit_Box = New_Deposit_Box()
    With Deposit_Box
        .Number = "999999999999"
        .Type1 = "011"
        .OpeningDate = "^A[Del]" &"010121"
        .Division = "00"
        .AdditionalInformation = "Deposit_Box_Deposit"
    End With   
     
    Set NewDepositCondition = New_DepositCondition()
    With NewDepositCondition
        .SigningDate = "^A[Del]" & "010121"
        .Standard = "999"
        .Duration = "05"
        .EndDate = "01/07/21"
        .DepositBoxType = "011"
        .DepositBoxNumber = "999999999999"
        .ServiceFee = "20,000.00"
        .Client = "00000001"
        .PaymentType = "1"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With    

    Set DepositRentalAgr_ForCheck = New_DepositRentalAgreement()
    With DepositRentalAgr_ForCheck
        .Client = "00000001"
        .Name = "§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦"
        .EnglishName = "§Big¦ Bank"
        .OtherAccs = "001"
        .UseClientSchema = 1
        .Standard = "999"
        .Duration = "05"
        .StartDate = "01/01/21"
        .EndDate = "01/07/21"
        .ServiceFee = "20,000.00"
        .VatTaxable = "0"
        .PaymentType = "1"
        .NonperformingDaysAvoiding = "0"
        .AutoProlong = 0
        .RemindBySMS = 0
        .EmailAddress = 0
        .IntBank = 0
        .DepositionAmount = "0.00"
        .AllowDelayedPayment = 0
        .StandardPay = ""
        .ServContrStandForPenalCalc = ""
        .DepositBoxType = "011"
        .Number = "999999999999"
        .ClosingDate = "/  /"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With
    
    Set DepositRental = New_DepositRentalAgreement()
    With DepositRental          
        .Agreement = "^A[Del]"&"222222222"
        .UseClientSchema = 1
        .AutoProlong = 0
        .EmailAddress = 1
        .OnlyJointEntrance = 1
        .GridClient = "00000018"
        .AdditionalaInfo = "__Additional_Information__"
    End With
    
    Set DepositBoxRentalFilter = New_DepositBoxRental()
    With DepositBoxRentalFilter          
        .Data = "^A[Del]"&"010121"
        .Client = "00000001"
        .AgreementName = "§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦"
        .DepositBoxNumber = "999999999999"
        .AgreementN = "222222222"
        .Standard = "999"
        .DepositBoxType = "011"
        .ShowDebt = 1
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
        .View = "DBAgrs"
        .FillInto = "0"
    End With

    Set Deposit_Box_WorkingAgr_Filter = New_Deposit_Boxes_WorkingAgr()
    With Deposit_Box_WorkingAgr_Filter
        .DataPeriod_Start = "^A[Del]"&"010121"
        .DataPeriod_End = "^A[Del]"&"010821"
        .Executors = "77"
        .DocumentType = "DBoxAgr"
        .Client = "00000001"
        .Agreement = "222222222"
        .DepositBoxNumber = "999999999999"
        .Division = "00"
        .Department = "1"
        .AccessType = "01"
    End With
     
    Set WorkingAgreement = New_WorkingAgreementForDeposit()
    With WorkingAgreement
        .DataPeriod_Start = "^A[Del]"&"010121"
        .DataPeriod_End = "^A[Del]"&"010121"
        .Curr = "000"
        .Executors = "77"
        .DocumentType = "PkCash"
        .RecPaySystem = ""
        .SentPaySystem = ""
        .Note = ""
        .Division = "00"
        .Department = "1"
    End With
    
    Set VisitAgreement = New_VisitAgreement_ForDeposit()
    With VisitAgreement
        .DataPeriod_Start = "010121"
        .DataPeriod_End = "010121"
        .NumberOfDoc = "000007"
        .AgreementN = "222222222"
        .Client = "00000001"
        .DepositBoxNumber = "999999999999"
        .Division = "00"
        .ShowAlsoNotFinished = 1
    End With
     
    Set RegisterForDepositBox = New_AccountsRegisterForDepositBox()
    With RegisterForDepositBox
      .RegisterState = ""
      .DepositBoxNumber = "999999999999"
      .DepositBoxDivision = "00"
      .ClientCode = "00000001"
      .Division = "00"
      .Department = "1"
      .AccessType = "01"
      .LegPos = "1"
      .TaxID = ""
      .Note1 = ""
      .Note2 = ""
      .Note3 = ""
      .ShowClientsData = 1
      .ShowChanges = 1
      .ShowReadyToSends = 0
      .View = "RegBoxes"
      .FillInto = "0"
    End With
    
End Sub 

Sub SQL_Initialize_ForDepositRentalCash(fISN)
        
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1)
      .fFOLDERID = "C.1628316"
      .fNAME = "DBoxAgr "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "1"
      .fCOM = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
      .fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21) [Üáñ]"
      .fECOM = "Deposit Box rental agreement"
    End With

    Set dbFOLDERS(2) = New_DB_FOLDERS()
    With dbFOLDERS(2)
      .fFOLDERID = "DBAGR"
      .fNAME = "DBoxAgr "
      .fKEY = "222222222"
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦"
      .fSPEC = "1   77  00000001           20210101202101012021070199905        20000.00100010            0.00      0119999999999991202101010         0         00000000000000000011001  "
      .fECOM = "§Big¦ Bank"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(3) = New_DB_FOLDERS()
    With dbFOLDERS(3)
      .fFOLDERID = "DBAgr."&fISN
      .fNAME = "DBoxAgr "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
      .fSPEC = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 222222222      (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦)"
      .fECOM = "Deposit Box rental agreement"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(4) = New_DB_FOLDERS()
    With dbFOLDERS(4)
      .fFOLDERID = "DBAgrWork.20210101"
      .fNAME = "DBoxAgr "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "1"
      .fCOM = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
      .fSPEC = "222222222       1   77  222222222     00000001011999999999999Üáñ                                                                                             "
      .fECOM = "Deposit Box rental agreement"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(5) = New_DB_FOLDERS()
    With dbFOLDERS(5)
      .fFOLDERID = "DBBaseAgrs"
      .fNAME = "DBoxAgr "
      .fKEY = "222222222"
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦"
      .fSPEC = "1   77  00000001           20210101202101012021070199905        20000.00100010            0.00      0119999999999991202101010         0         00000000000000000011001  "
      .fECOM = "§Big¦ Bank"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(6) = New_DB_FOLDERS()
    With dbFOLDERS(6)
      .fFOLDERID = "DBVer.20210101001"
      .fNAME = "DBoxAgr "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "4"
      .fCOM = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
      .fSPEC = "222222222       101 77  222222222     00000001011999999999999àõÕ³ñÏí³Í I Ñ³ëï³ïÙ³Ý                                                                           1"
      .fECOM = "Deposit Box rental agreement"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(7) = New_DB_FOLDERS()
    With dbFOLDERS(7)
      .fFOLDERID = "C.1628316"
      .fNAME = "PkCash  "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "5"
      .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ Ùáõïù"
      .fSPEC = "²Ùë³ÃÇí- 01/01/21 N- 000870 ¶áõÙ³ñ-            20,000.00 ²ñÅ.- 000 [Üáñ]"
      .fECOM = "Grouped Cash Deposit Advice"
    End With
    
    Set dbFOLDERS(8) = New_DB_FOLDERS()
    With dbFOLDERS(8)
      .fFOLDERID = "Oper.20210101"
      .fNAME = "PkCash  "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "5"
      .fCOM = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ Ùáõïù"
      .fSPEC = "00087077700000001100                          20000.00000Üáñ                                                   77Charge And Provide                                                                                                                                                                                                                          "
      .fECOM = "Grouped Cash Deposit Advice"
      .fDCBRANCH = "00"
      .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(9) = New_DB_FOLDERS()
    With dbFOLDERS(9)
        .fFOLDERID = "C.1628316" 
        .fNAME = "DBoxAgr "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "0"
        .fCOM = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
        .fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21, »ñÏ. N 01) [ºÝÃ³Ï³ ¿ ïñ³Ù³¹ñÙ³Ý]"
        .fECOM = "Deposit Box rental agreement"
    End With
    
    Set dbFOLDERS(10) = New_DB_FOLDERS()
    With dbFOLDERS(10)
        .fFOLDERID = "DBAGR"
        .fNAME = "DBoxAgr "
        .fKEY = "222222222     01"
        .fISN = fISN
        .fSTATUS = "0"
        .fCOM = "§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦"
        .fSPEC = "2   77  00000001           20210101202107012022070199906        25000.00100010            0.00      0119999999999991202107010         0         00000000000000000011001  "
        .fECOM = "§Big¦ Bank"
        .fDCBRANCH = "00"
        .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(11) = New_DB_FOLDERS()
    With dbFOLDERS(11)
        .fFOLDERID = "DBAgr.640074081" 
        .fNAME = "DBoxAgr "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "0"
        .fCOM = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
        .fSPEC = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ N 222222222      »ñÏ. N 01 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦)"
        .fECOM = "Deposit Box rental agreement"
        .fDCBRANCH = "00"
        .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(12) = New_DB_FOLDERS()
    With dbFOLDERS(12)
        .fFOLDERID = "DBAgrWork.20210701" 
        .fNAME = "DBoxAgr "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
        .fSPEC = "222222222     012   77  222222222     00000001011999999999999ºÝÃ³Ï³ ¿ ïñ³Ù³¹ñÙ³Ý                                                                             "
        .fECOM = "Deposit Box rental agreement"
        .fDCBRANCH = "00"
        .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(13) = New_DB_FOLDERS()
    With dbFOLDERS(13)
        .fFOLDERID = "DBoxVisits" 
        .fNAME = "DBVisit "
        .fKEY = "2021000007"
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "²Ûó»ÉáõÃÛáõÝ"
        .fSPEC = "77  00000001§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦           999999999999222222222       2021010112:3915:59ä»ïñáëÛ³Ý ä»ïñáë"
        .fECOM = "Visit"
        .fDCBRANCH = "00"
        .fDCDEPART = "1"
    End With
    
    Set dbFOLDERS(14) = New_DB_FOLDERS()
    With dbFOLDERS(14)
      .fFOLDERID = "C.317432892"
      .fNAME = "DBoxAgr "
      .fKEY = fISN
      .fISN = fISN
      .fSTATUS = "0"
      .fCOM = "ä³Ñ³ï»ÕÇ í³ñÓ³Ï³ÉáõÃÛ³Ý å³ÛÙ³Ý³·Çñ"
      .fSPEC = "222222222 (§26 ÎáÙÇë³ñÝ»ñÇ ´³ÝÏ¦, ²Ùë³ÃÇí- 01/01/21), ÉÇ³½áñí³Í ³ÝÓ  [Üáñ]"
      .fECOM = "Deposit Box rental agreement"
    End With
    
    Set dbPAYMENTS(1) = New_DB_PAYMENTS()
    With dbPAYMENTS(1)
        .fISN = fISN
        .fDOCTYPE = "PkCash  "
        .fDATE = "2021-01-01"
        .fSTATE = "11"
        .fDOCNUM = "000870"
'        .fCLIENT = "00000001"
        .fACCDB = "77700000001100  "
        .fPAYER = "Charge And Provide"
        .fCUR = "000"
        .fSUMMA = "20000.00"
        .fSUMMAAMD = "20000.00"
        .fSUMMAUSD = "50.00"
        .fCOM = ""
'        .fPASSPORT = "4444444444                      "
        .fCOUNTRY = "AM"
        .fACSBRANCH = "00 "
        .fACSDEPART = "1  "
    End With
    
    Set dbPAYMENTS(2) = New_DB_PAYMENTS()
    With dbPAYMENTS(2)
        .fISN = fISN
        .fDOCTYPE = "PkCash  "
        .fDATE = "2021-07-01"
        .fSTATE = "11"
        .fDOCNUM = "000871"
'        .fCLIENT = "00000001"
        .fACCDB = "77700000001100  "
        .fPAYER = "Charge And Provide"
        .fCUR = "000"
        .fSUMMA = "25000.00"
        .fSUMMAAMD = "25000.00"
        .fSUMMAUSD = "62.50"
        .fCOM = ""
'        .fPASSPORT = "4444444444                      "
        .fCOUNTRY = "AM"
        .fACSBRANCH = "00 "
        .fACSDEPART = "1  "
    End With

End Sub