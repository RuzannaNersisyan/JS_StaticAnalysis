'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Mem_Order_Library
'USEUNIT Library_Colour
'USEUNIT Library_CheckDB
'USEUNIT Library_Contracts
'USEUNIT DAHK_Library_Filter
'USEUNIT Main_Accountant_Filter_Library
Option Explicit
'Test Case ID 182729
Dim sDATE, eDATE, i, j, grDebOrd, tabFrame, tdbgView, grid, actValue, pathExp, sumSQL, rekvObj
Dim folderDirect, stDate, enDate, wUser, docType, dAccIsn(5), cAccIsn, fBODY, dbFOLDERS (3) 


Sub Group_Deb_Order_DropDown_Test()
    aCount = 5
    Call Test_Initialize_Deb_Ord_DropDown()
    'Մուտք ծրագիր ARMSOFT Օգտագործողով
    Call Initialize_AsBank("bank", sDATE, eDATE)
    Call Login ("ARMSOFT")
    'Հաշիվների ISN-ների ստացում SQL աղյուսակներից
    For i = 0 to grDebOrd.commonTab.dAccsCount 
        dAccIsn(i) = GetAccountISN(grDebOrd.commonTab.accD(i))
    Next    
    cAccIsn = GetAccountISN(grDebOrd.commonTab.accC)
    
    'Մուտք Գլխավոր հաշվապահի ԱՇՏ
    Log.Message  "Մուտք Գլխավոր հաշվապահի ԱՇՏ",,,DivideColor
    Call ChangeWorkspace(c_ChiefAcc)
'----------------------------------------------------------------------------------   
'---------------------Ստեղծել Խմբային Դեբետի Օրդեր--------------------------------------
'------Նոր փաստաթղթեր/Վճարային փաստաթղթեր/Ներքին գործարքներ/Խմբային Դեբետի օրդեր ճանապարհից--- 

    Call wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|Üáñ ÷³ëï³ÃÕÃ»ñ|ì×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ|Ü»ñùÇÝ ·áñÍ³ñùÝ»ñ|ÊÙµ³ÛÇÝ ¹»µ»ïÇ ûñ¹»ñ")
    If wMDIClient.WaitVBObject("frmASDocForm", 2000).exists Then
        Set tabFrame = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame")
        'Փաստաթղթի ISN-ի ստացում
        grDebOrd.commonTab.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
        'Գրասենյակ դաշտի լրացում DropDown աղյուսակի միջոցով
        rekvObj = GetVBObject("ACSBRANCH", wMDIClient.vbObject("frmASDocForm"))
        tabFrame.VBObject(rekvObj).VBObject("TDBMask").Keys("[PageDown]")
'        tabFrame.VBObject("ASTypeTree").VBObject("TDBMask").Keys("[PageDown]")
        If asbank.VBObject("frmModalBrowser").WaitVBObject("tdbgView", 3000).exists Then
            Set tdbgView = asbank.VBObject("frmModalBrowser").VBObject("tdbgView")
            tdbgView.MoveFirst
            For i = 0 to tdbgView.ApproxCount
              If tdbgView.Columns.Item(2).Text = grDebOrd.commonTab.branch Then
                 tdbgView.Keys ("[Enter]")
                 Exit For
              ElseIf i = tdbgView.ApproxCount Then
                    Log.Error "Value Not Found",,,ErrorColor
                    asbank.VBObject("frmModalBrowser").Close   
              Else 
                  tdbgView.MoveNext
              End If
            Next 
        Else 
            Log.Error "Գրասենյակ դաշտի արժեքների աղյուսակը չի բացվել",,,ErrorColor        
        End If
       
        'Բաժին դաշտի լրացում DropDown աղյուսակի միջոցով
        rekvObj = GetVBObject("ACSDEPART", wMDIClient.vbObject("frmASDocForm"))
        tabFrame.VBObject(rekvObj).VBObject("CmdViewTree").Click
        If asbank.VBObject("frmModalBrowser").WaitVBObject("tdbgView", 3000).exists Then
            Set tdbgView = asbank.VBObject("frmModalBrowser").VBObject("tdbgView")
            tdbgView.MoveFirst
            For i = 0 to tdbgView.ApproxCount
                If Trim (tdbgView.Columns.Item(1).Text) = grDebOrd.commonTab.dep Then
                    tdbgView.Keys ("[Enter]")
                    Exit For
                ElseIf i = tdbgView.ApproxCount Then
                    Log.Error "Value Not Found",,,ErrorColor
                    asbank.VBObject("frmModalBrowser").Close   
                Else 
                    tdbgView.MoveNext
                End If
            Next 
        Else 
            Log.Error "Բաժին դաշտի արժեքների աղյուսակը չի բացվել",,,ErrorColor        
        End If
        'Փաստաթղթի N դաշտի ստացում
        grDebOrd.commonTab.docN = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
        'Ամսաթիվ դաշտի լրացում
        Call Rekvizit_Fill ("Document",1,"General","DATE",grDebOrd.commonTab.mDate)
        'Հաշիվ Կրեդիտ դաշտի լրացում Հաշիվներ աղյուսակի միջոցով
        rekvObj = GetVBObject("ACCCR", wMDIClient.vbObject("frmASDocForm"))
        tabFrame.VBObject(rekvObj).VBObject("CmdViewFolder").Click
        If asbank.WaitVBObject("frmAsUstPar", 5000).exists Then
            'Հաշվի Շաբլոն դաշտի լրացում
            Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", grDebOrd.commonTab.accC)
            Call ClickCmdButton(2 , "Î³ï³ñ»É") 
            If asbank.VBObject("frmModalBrowser").WaitVBObject("tdbgView", 5000).exists  Then         
                For i = 0 to tdbgView.ApproxCount
                    If tdbgView.Columns.Item(2).Text = grDebOrd.commonTab.accC Then 
                        tdbgView.Keys ("[Enter]")
                        Exit For
                    ElseIf i = tdbgView.ApproxCount Then
                        Log.Error "Value Not Found",,,ErrorColor
                        asbank.VBObject("frmModalBrowser").Close   
                    Else 
                      tdbgView.MoveNext
                    End If
                Next 
            End If
        End If
        tabFrame.VBObject(rekvObj).Keys("[Tab]")
        'Արժույթ դաշտի ստուգում
        BuiltIn.Delay (2000)
        Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",1,"Mask","CUR"),grDebOrd.commonTab.curr)
        'Գումարներ աղյուսակի լրացում Հաշիվներ ֆիլտրի միջոցով
        Set grid = tabFrame.VBObject("DocGrid")
        grid.MoveFirst
        For i = 0 to grDebOrd.commonTab.dAccsCount -1
            With grid
                .row = i
                .col = 0
                .Keys ("^[Down]")
            End With
            If asbank.WaitVBObject("frmAsUstPar", 15000).exists Then
               'Հաշվի Շաբլոն դաշտի լրացում
               Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", grDebOrd.commonTab.accD(i))
               Call ClickCmdButton(2 , "Î³ï³ñ»É") 
            End If    
            If asbank.VBObject("frmModalBrowser").WaitVBObject("tdbgView", 5000).exists  Then         
              'Բացված ցուցակում փնտրում է հաշիվը
              For j = 0 to tdbgView.ApproxCount
                  If tdbgView.Columns.Item(2).Text = grDebOrd.commonTab.accD(i) Then
                      tdbgView.Keys ("[Enter]")
                      BuiltIn.Delay (2000)
                      grDebOrd.commonTab.dAccRowN(i) = i
                      grDebOrd.commonTab.dAccName(i) = grid.Columns.Item(1).Text
                      With grid
                           .row = i
                           .col = 2
                           .Keys (grDebOrd.commonTab.sum(i) & "[Enter]")
                      End With
                      Exit For
                  ElseIf j <> tdbgView.ApproxCount Then
                      tdbgView.MoveNext
                  Else
                      Log.Error "Value not found",,,ErrorColor 
                      asbank.VBObject("frmModalBrowser").Close   
                  End If
              Next
           End If           
        Next
        With grid
             .row = .ApproxCount
             If Trim(.Columns.Item(0).Value) = "" Then
                .Keys("^d")
             End If   
        End With
        'Գումարներ աղյուսակի Ընդհամենը դաշտի ստուգում
        actValue = Trim(grid.Columns.Item(2).FooterText)
        Call Compare_Two_Values ("Ընդհամենը (Գումարներ)", actValue, grDebOrd.commonTab.fullSum )
        
        'Ընդհամենը դաշտի ստուգում (Grid-ից դուրս)
        Call Compare_Two_Values("Ընդհամենը",Get_Rekvizit_Value("Document",1,"General","SUMMA"),grDebOrd.commonTab.fullSum)
        'Նպատակ դաշտի լրացում DropDown Աղյուսակի միջոցով,  "Համաձայն թ. հաշվի" արժեքով
        Call Rekvizit_Fill ("Document",1,"General","AIM","[Home]![End][Del]^[Down][Down][Enter]" )       
       
        Call ClickCmdButton(1, "Î³ï³ñ»É")
        'Փաստաթղթի համարի և isn-ի լոգավորում
        Log.Message "Document ISN = " & grDebOrd.commonTab.isn,,, SqlDivideColor
        Log.Message "Document Number = " & grDebOrd.commonTab.DocN,,, DivideColor
    Else                                       
        Log.Error "Document form hasn't been opened",,,ErrorColor
    End If
    
    'Ստուգել փաստաթղթի տպելու ձևը
    Call Group_Deb_Order_DocCheck (pathExp, "DD")
    
    'SQL
    Log.Message "'SQL Ստուգումներ Խմբային Դեբետի օրդեր ստեղծելուց հետո",,,SqlDivideColor
    Call Intitialize_DB_Group_Deb_Order_DD (grDebOrd.commonTab.isn , grDebOrd.commonTab.docN)
    
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",grDebOrd.commonTab.isn, 1)
    Call CheckDB_DOCLOG(grDebOrd.commonTab.isn,"77","N","1"," ",1)
    
    'DOCS    
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28 10  USERID:  77  ACSBRANCH:00  ACSDEPART:3  "_
               &"DOCNUM:" & grDebOrd.commonTab.docN & "  DATE:20240625  ACCCR:77014473311  CUR:000  SUMMA:21000  AIM:Ð³Ù³Ó³ÛÝ Ã. Ñ³ßíÇ  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grDebOrd.commonTab.isn, 1)
    Call CheckDB_DOCS(grDebOrd.commonTab.isn, "DbPkOrd ", "1", fBODY,1)
    
    'DOCSG
     Call CheckQueryRowCount("DOCSG", "fISN", grDebOrd.commonTab.isn, 9)
     For i = 0 to grDebOrd.commonTab.dAccsCount - 1
         Call CheckDB_DOCSG(grDebOrd.commonTab.isn,"SUBSUMS",grDebOrd.commonTab.dAccRowN(i) ,"ACCDB",grDebOrd.commonTab.accD(i),1)
     Next
     For i = 0 to grDebOrd.commonTab.dAccsCount - 1
         Call CheckDB_DOCSG(grDebOrd.commonTab.isn,"SUBSUMS",grDebOrd.commonTab.dAccRowN(i) ,"ACCDBNAME",grDebOrd.commonTab.dAccName(i),1)
     Next
     For i = 0 to grDebOrd.commonTab.dAccsCount - 1
         sumSQL = Replace (grDebOrd.commonTab.sum(i),"," , "")
         sumSQL = Replace (sumSQL, ".00", "")
         Call CheckDB_DOCSG(grDebOrd.commonTab.isn,"SUBSUMS", grDebOrd.commonTab.dAccRowN(i) , "SUMMA", sumSQL, 1)
     Next
    
    'FODLERS
    Call CheckQueryRowCount("FOLDERS","fISN",grDebOrd.commonTab.isn,1) 
    Call CheckDB_FOLDERS(dbFOLDERS(0),1)
    
    'HI
    Call CheckQueryRowCount("HI", "fBASE", grDebOrd.commonTab.isn, 6)
    For i = 0 to grDebOrd.commonTab.dAccsCount - 1
        sumSQL = Replace (grDebOrd.commonTab.sum(i),"," , "")
        Call Check_HI_CE_accounting ("20240625",grDebOrd.commonTab.isn , "11", cAccIsn ,sumSQL, "000", sumSQL, "MSC", "C")
        Call Check_HI_CE_accounting ("20240625",grDebOrd.commonTab.isn , "11", dAccIsn(i) ,sumSQL, "000", sumSQL, "MSC", "D")
    Next
     
    'HIREST
    For i = 0 to grDebOrd.commonTab.dAccsCount - 1
        sumSQL = Replace (grDebOrd.commonTab.sum(i),"," , "")
        Call CheckDB_HIREST("11", dAccIsn(i) , sumSQL ,"000", sumSQL, 1)
    Next
    Call CheckDB_HIREST("11", cAccIsn , "-21000.00" ,"000", "-21000.00", 1)
    
    Call Close_Window(wMDIClient, "FrmSpr" )

'------------------------------------------------------------------
'------------Բացել Ստեղծված փաստաթղթեր թղթապանակը---------------------
'------------------------------------------------------------------    
    folderDirect = "|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|êï»ÕÍí³Í ÷³ëï³ÃÕÃ»ñ"
    stDate = "010122"
    enDate = "010125"
    wUser = 77
    docType = "DbPkOrd "
    Call OpenCreatedDocFolder(folderDirect, stDate, enDate, wUser, docType)   
    'Կատարել Դիտել գործողությունը
    grDebOrd.commonTab.mDate = "25/06/24"
    Call View_Group_Deb_Order (grDebOrd, "frmPttel")
    'Հաշվառել փաստաթուղթը
    If SearchInPttel("frmPttel", 2, grDebOrd.commonTab.isn ) Then
       Call Register_Payment()
    Else 
        Log.Error "Can't Find Document in Pttel",,,ErrorColor
    End If

    'SQL
    Log.Message "'SQL Ստուգումներ Խմբային Դեբետի օրդերը հաշվառելուց հետո",,,SqlDivideColor
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",grDebOrd.commonTab.isn, 2)
    Call CheckDB_DOCLOG(grDebOrd.commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(grDebOrd.commonTab.isn,"77","M","3","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    
    'DOCS        
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28 10  USERID:  77  ACSBRANCH:00  ACSDEPART:3  "_
               &"DOCNUM:" & grDebOrd.commonTab.docN & "  DATE:20240625  ACCCR:77014473311  CUR:000  SUMMA:21000  AIM:Ð³Ù³Ó³ÛÝ Ã. Ñ³ßíÇ  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grDebOrd.commonTab.isn, 1)
    Call CheckDB_DOCS(grDebOrd.commonTab.isn, "DbPkOrd ", "3", fBODY,1)
    
    'DOCSG
    Call CheckQueryRowCount("DOCSG", "fISN", grDebOrd.commonTab.isn, 0)
    
    'FODLERS
    Call CheckQueryRowCount("FOLDERS","fISN",grDebOrd.commonTab.isn,0) 
    
    'HIREST
    Call CheckDB_HIREST("01", cAccIsn , "-39000.00" ,"000", "-39000.00", 1)
    Call CheckDB_HIREST("01", dAccIsn (0) , "-3031.90" ,"000", "-3031.90", 1)
    Call CheckDB_HIREST("01", dAccIsn (1) , "-15619.10" ,"000", "-15619.10", 1)
    Call CheckDB_HIREST("01", dAccIsn (2) , "-1036.10" ,"000", "-1036.10", 1)
    
    'MEMORDERS
    Call CheckDB_MEMORDERS(grDebOrd.commonTab.isn,"DbPkOrd  ","1","20240625","3","21000.00","000",1)
    
    'Ջնել փաստաթուղթը
    If SearchInPttel("frmPttel", 2, grDebOrd.commonTab.isn ) Then
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
        Log.Error "Can't Find Document in Pttel",,,ErrorColor
    End If
    
    
    'SQL
    Log.Message "SQL Ստուգումներ հաշվառված Խմբային Դեբետի օրդերը ջնջելուց հետո",,,SqlDivideColor
    'DOCLOG
    Call CheckQueryRowCount("DOCLOG","fISN",grDebOrd.commonTab.isn, 3)
    Call CheckDB_DOCLOG(grDebOrd.commonTab.isn,"77","N","1"," ",1)
    Call CheckDB_DOCLOG(grDebOrd.commonTab.isn,"77","M","3","¶ñ³Ýóí»É »Ý Ó¨³Ï»ñåáõÙÝ»ñÁ",1)
    Call CheckDB_DOCLOG(grDebOrd.commonTab.isn,"77","D","999"," ",1)
  
    'DOCS 
    fBODY = "  TYPECODE:-20 21 22 23 24 30 31 32 25 26 92 93 11 27 33 28 10  USERID:  77  ACSBRANCH:00  ACSDEPART:3  "_
               &"DOCNUM:" & grDebOrd.commonTab.docN & "  DATE:20240625  ACCCR:77014473311  CUR:000  SUMMA:21000  AIM:Ð³Ù³Ó³ÛÝ Ã. Ñ³ßíÇ  "   
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", grDebOrd.commonTab.isn, 1)
    Call CheckDB_DOCS(grDebOrd.commonTab.isn, "DbPkOrd ", "999", fBODY,1)

    'FODLERS
    Call CheckQueryRowCount("FOLDERS","fISN",grDebOrd.commonTab.isn,1)
    Call CheckDB_FOLDERS(dbFOLDERS(1),1) 
    
    'MEMORDERS
    Call CheckDB_MEMORDERS(grDebOrd.commonTab.isn,"DbPkOrd  ","1","20240625","3","21000.00","000",0)
    
    Call Close_Window(wMDIClient, "frmPttel" )
    Call Close_AsBank()

End Sub


Sub Test_Initialize_Deb_Ord_DropDown()

    sDate = "20050101"
    eDate = "20250101" 
    'Ստեղծվող օրդեր
    Set grDebOrd = New_Group_Debet_Order(0, 0, 0)
    With grDebOrd
        .commonTab.branch = "00"
        .commonTab.dep = "3"
        .commonTab.mDate = "250624"
        .commonTab.accC = "77014473311"              
        .commonTab.dAccsCount = 3
        .commonTab.accD(0) = "76172393311"
        .commonTab.accD(1) = "76171553311"        
        .commonTab.accD(2) = "77004723313"
        .commonTab.curr = "000"
        .commonTab.sum(0) = "15,000.00"
        .commonTab.sum(1) = "5,000.00"
        .commonTab.sum(2) = "1,000.00"
        .commonTab.fullSum = "21,000.00"
        .commonTab.aim = "Ð³Ù³Ó³ÛÝ Ã. Ñ³ßíÇ"
        .attachTab.tabN = 2
    End With 
    
    'Փաստաթղթի տպելու ձևի օրինակի ճանապարհ
    pathExp = Project.path & "Stores\MemorialOrder\Group_Deb_Order_DropDown_Exp.txt"
End Sub


Sub Intitialize_DB_Group_Deb_Order_DD (fISN,fDOCN)
    Dim tday
    
    tday = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"20%y%m%d")
    Set dbFOLDERS(0) = New_DB_FOLDERS()
    With dbFOLDERS(0) 
        .fFOLDERID = "Oper.20240625"
        .fNAME = "DbPkOrd "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "1"
        .fCOM = "ÊÙµ³ÛÇÝ ¹»µ»ïÇ ûñ¹»ñ"                                                                                                                        
        .fSPEC = fDOCN & "                7770077014473311        21000.00000Üáñ                                                   "_
                 &"77                                                                                                Ð³Ù³Ó³ÛÝ Ã. Ñ³ßíÇ"_
                 &"                                                                                                                           "
        .fECOM = "Group Debit Order"
        .fDCBRANCH = "00 "
        .fDCDEPART = "3  "
    End With
    
    Set dbFOLDERS(1) = New_DB_FOLDERS()
    With dbFOLDERS(1) 
        .fFOLDERID = ".R."&tday
        .fNAME = "DbPkOrd "
        .fKEY = fISN
        .fISN = fISN
        .fSTATUS = "0"
        .fCOM = ""
        .fSPEC = Left_Align(Get_Compname_DOCLOG(fISN), 16) & "GlavBux ARMSOFT                       113  "
        .fECOM = ""
        .fDCBRANCH = "00 "
        .fDCDEPART = "3  "
    End With
    
End Sub






