Option Explicit
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Common
'USEUNIT Library_Colour
'USEUNIT Library_CheckDB
'USEUNIT Constants
'USEUNIT Payment_Except_Library
'USEUNIT PayOrder_Receive_ConfirmPhases_Library
'USEUNIT Main_Accountant_Filter_Library

'Test case Id 184345 - case1(with SWIFT)
'Test case Id 185645 - case2(with SPFS)
'Test case Id 185647 - case3(with SWIFT and SPFS)

Dim checkConfirmation(3),Isn(3)
Dim dbSW_MESSAGES(3),recieved
    
Sub SWIFT_900_Import_Test(SysType)

    Dim sDATE,fDATE,fBODY
    Dim fileFrom,fileTo
    Dim Path1,Path2,i,IgnoreParams
    Dim settingsPath,folderDirect,stDate,enDate,wUser,docType
    Dim SortArr(1)
    SortArr(0) = "BMNAME"
    SortArr(1) = "DOCNUM"
     
    'Համակարգ մուտք գործել ARMSOFT օգտագործողով
    sDATE = "20020101"
    fDATE = "20260101"
    Call Initialize_AsBank("bank", sDATE, fDATE)
    Login("ARMSOFT")

''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''-- Կարգավորումների ներմուծում --''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կարգավորումների ներմուծում --",,,DivideColor
    
    settingsPath = Project.Path & "Stores\SWIFT\HT900\Settings\Setting_1.txt"
    folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|Ð³Ù³Ï³ñ·³ÛÇÝ ³ßË³ï³ÝùÝ»ñ|îíÛ³ÉÝ»ñÇ Ý»ñÙáõÍáõÙ|ö³ëï³ÃÕÃ»ñÇ Ý»ñÙáõÍáõÙ"
    Call ChangeWorkspace(c_Admin40)
    BuiltIn.Delay(3000)
    Call Settings_Import(settingsPath,folderDirect)
    
    'SQL Ստուգում PARAMS աղուսյակում 
    Call CheckQueryRowCount("PARAMS","fVALUE","110,200,201,203,102",1)

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''--- "S.W.I.F.T. ԱՇՏ/Պարամետրեր"-ում կատարել համապատասխան փոփոխությունները---''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- S.W.I.F.T. ԱՇՏ/Պարամետրեր-ում կատարել համապատասխան փոփոխությունները --",,,DivideColor
        
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |ä³ñ³Ù»ïñ»ñ")
    BuiltIn.Delay(3000)
    
    'SWGPI Պարամետրի փոփոխում SQL հարցման միջոցով
    Call SetParameter("SWGPI", "1")
    
    aqFileSystem.DeleteFile(Project.Path &"Stores\SWIFT\HT900\ImportFile\Import\*")
    
    For i = 1 To 3 
        fileFrom = Project.Path &"Stores\SWIFT\HT900\ImportFile\HT000900_"&i&".RJE"
        fileTo = Project.Path &"Stores\SWIFT\HT900\ImportFile\Import\HT000900_"&i&".RJE"
        
        'Վերարտագրում է նախօրոք տրված ֆայլը մեկ այլ ֆայլի մեջ` կատարելով փոփոխություն
        Call Read_Write_File_With_replace(fileFrom,fileTo,"","")
    Next
    
    Select Case SysType
        Case 1
            Call SetParameter_InPttel("SWOUT",Project.Path & "Stores\SWIFT\HT900\ImportFile\Import\")
            
            Call SetParameter("SWSPFSACKDIR", "")
            Call SetParameter("SWSPFSNAKDIR", "")
            Call SetParameter("SWSPFSOUT", "")
        Case 2

            Call SetParameter_InPttel("SWSPFSACKDIR",Project.Path & "Stores\SWIFT\HT900\ImportFile\Import\")
            Call SetParameter_InPttel("SWSPFSNAKDIR",Project.Path & "Stores\SWIFT\HT900\ImportFile\Import\")
            Call SetParameter_InPttel("SWSPFSOUT",Project.Path & "Stores\SWIFT\HT900\ImportFile\Import\")
            
            Call SetParameter("SWOUT", "")
            
        Case 3
            aqFileSystem.DeleteFile(fileTo)
            BuiltIn.Delay(2000)
            fileTo = Project.Path &"Stores\SWIFT\HT900\ImportFile\Import\ForSPFS\HT000900_3.RJE"
            Call Read_Write_File_With_replace(fileFrom,fileTo,"","")
             
            Call SetParameter_InPttel("SWOUT",Project.Path & "Stores\SWIFT\HT900\ImportFile\Import\ForSPFS")
            Call SetParameter_InPttel("SWSPFSACKDIR",Project.Path & "Stores\SWIFT\HT900\ImportFile\Import\")
            Call SetParameter_InPttel("SWSPFSNAKDIR",Project.Path & "Stores\SWIFT\HT900\ImportFile\Import\")
            Call SetParameter_InPttel("SWSPFSOUT",Project.Path & "Stores\SWIFT\HT900\ImportFile\Import\")
            
    End Select
    'Փակել Պարամետրեր թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")

    Login("ARMSOFT")
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''--- Կատարել Ընդունել SWIFT համակարգից գործողությունը ---''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարել Ընդունել SWIFT համակարգից գործողությունը --",,,DivideColor
    
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |Ð³Õáñ¹³·ñáõÃÛáõÝÝ»ñÇ ÁÝ¹áõÝáõÙ|ÀÝ¹áõÝ»É S.W.I.F.T. Ñ³Ù³Ï³ñ·Çó")
    
    Call MessageExists(2,"3 Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñÇ ÁÝ¹áõÝáõÙÝ ³í³ñïí»ó")
    Call ClickCmdButton(5, "OK")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''--- Ստուգում է փաստաթղթերի առկայությունը և արժեքները ---'''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Ստուգում է փաստաթղթերի առկայությունը և արժեքները --",,,DivideColor

    Call Initialize_For_SWIFT_900()
    Call GoTo_Recieved_Messages (recieved, "|S.W.I.F.T. ²Þî                  |Ê³éÁ Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ|êï³óí³Í Ë³éÁ Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ")
    BuiltIn.Delay(4000)
    
    Call ColumnSorting(SortArr, 2, "frmPttel")
    
    Path1 = Project.Path & "Stores\SWIFT\HT900\Actual_1.txt"
    Path2 = Project.Path & "Stores\SWIFT\HT900\Expected.txt"
    IgnoreParams = "(.[0-9][/][0-9].[/]..)|(.([0-9]):([0-9]).)|(GB[0-9]..)"
    
    If SysType = 3 Then
          Path2 = Project.Path & "Stores\SWIFT\HT900\Expected_1.txt"
    End If
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ xml ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    Call Compare_Files(Path2, Path1, IgnoreParams)
    
    'Ստուգում է փաստաթղթերի առկայությունը և արժեքները
    If SearchInPttel("frmPttel",3, "FGVM0012047905") Then
       Call wMainForm.MainMenu.Click(c_AllActions)
       Call wMainForm.PopupMenu.Click(c_View)
       BuiltIn.Delay(2000)
       
       If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
           Call Check_Confirmation(checkConfirmation(1))
           'isn-ի վերագրում փոփոխականին
           isn(1) = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
           Call ClickCmdButton(1, "OK")
       Else 
           Log.Error "Can't find frmASDocForm window", "", pmNormal, ErrorColor
       End if
    End If
    If SearchInPttel("frmPttel",3, "S000017010923637") Then
       Call wMainForm.MainMenu.Click(c_AllActions)
       Call wMainForm.PopupMenu.Click(c_View)
       BuiltIn.Delay(2000)
       
       If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
           Call Check_Confirmation(checkConfirmation(2))
           'isn-ի վերագրում փոփոխականին
           isn(2) = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
           Call ClickCmdButton(1, "OK")
       Else 
           Log.Error "Can't find frmASDocForm window", "", pmNormal, ErrorColor
       End if
    End If
    If SearchInPttel("frmPttel",3, "AK514612/080121") Then
       Call wMainForm.MainMenu.Click(c_AllActions)
       Call wMainForm.PopupMenu.Click(c_View)
       BuiltIn.Delay(2000)
       
       If SysType = 3 Then
          checkConfirmation(3).FileName = "HT000900#001"
       End If
       
       If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
           Call Check_Confirmation(checkConfirmation(3))
           'isn-ի վերագրում փոփոխականին
           isn(3) = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
           Call ClickCmdButton(1, "OK")
       Else 
           Log.Error "Can't find frmASDocForm window", "", pmNormal, ErrorColor
       End if
    End If

    'Փակել Ստացված խառը հաղորդագրություններ թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
   
    Log.Message "SQL ստուգում (Ընդունել SWIFT համակարգից գործողություն)ից հետո",,,SqlDivideColor
    Log.Message "1. fISN = "& isn(1),,,SqlDivideColor
    Log.Message "2. fISN = "& isn(2),,,SqlDivideColor
    Log.Message "3. fISN = "& isn(3),,,SqlDivideColor
        
    Call SQL_Initialize_For_SWIFT_MT900(isn(1),isn(2),isn(3)) 
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  MT:900  BMDOCNUM:FGVM0012047905  REFERENCE:SWIFT CHARGES  ACC:400886573500USD  DATE:20220322  CUR:001  SUMMA:516  PINSTOP:D  "&_
    "PAYINST:SWIFT LA HULPE BELGIUM             INV0013368088 INV3009097822  ADDINFO:Additional info  VERIFIED:0  USERID:  77  SNDREC:CITIATWXXXX"&_
    "  BMNAME:HT000900#001  UNIQUEID:220322CITIATWXXXXX0001123456  RSBKMAIL:1  PRIOR:N  DELIV:0  "

    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", isn(1), 1)
    Call CheckDB_DOCS(isn(1), "MT900   ", "10", fBODY, 1)
    
    fBODY = "  MT:900  BMDOCNUM:S000017010923637  REFERENCE:CBC170109DD82SA  ACCOP:P  ACC:30111840700000000428  ACCID:COVBAM22  DATE:20220322  CUR:001"&_
    "  SUMMA:1  ADDINFO:Additional info  VERIFIED:0  USERID:  77  SNDREC:CITIATWXXXX  BMNAME:HT000900#002  "&_
    "UNIQUEID:220322CITIATWXXXXX0001123457  RSBKMAIL:1  PRIOR:N  DELIV:0  "
    
    
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", isn(2), 1)
    Call CheckDB_DOCS(isn(2), "MT900   ", "10", fBODY, 1)
    
    fBODY = "  MT:900  BMDOCNUM:AK514612/080121  REFERENCE:RZBA21010810343  ACC:000-55.069.231/USD  DATE:20220322  CUR:001  SUMMA:30  PINSTOP:A"&_
    "  PAYINST:ARSJAM22  ADDINFO:Additional information  VERIFIED:0  USERID:  77  SNDREC:CITIATWXXXX  BMNAME:HT000900#003"&_
    "  UNIQUEID:220322CITIATWXXXXX0001123458  RSBKMAIL:1  PRIOR:N  DELIV:0  "

    If SysType = 3 Then
       fBODY = "  MT:900  BMDOCNUM:AK514612/080121  REFERENCE:RZBA21010810343  ACC:000-55.069.231/USD  DATE:20220322  CUR:001  SUMMA:30  PINSTOP:A"&_
       "  PAYINST:ARSJAM22  ADDINFO:Additional information  VERIFIED:0  USERID:  77  SNDREC:CITIATWXXXX  BMNAME:HT000900#001"&_
       "  UNIQUEID:220322CITIATWXXXXX0001123458  RSBKMAIL:1  PRIOR:N  DELIV:0  "
    End If
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", isn(3), 1)
    Call CheckDB_DOCS(isn(3), "MT900   ", "10", fBODY, 1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",isn(1),2)
    Call CheckDB_DOCLOG(isn(1),"77","N","10","",1)
    Call CheckDB_DOCLOG(isn(1),"77","M","10","Received",1)
    
    Call CheckQueryRowCount("DOCLOG","fISN",isn(2),2)
    Call CheckDB_DOCLOG(isn(2),"77","N","10","",1)
    Call CheckDB_DOCLOG(isn(2),"77","M","10","Received",1)
    
    Call CheckQueryRowCount("DOCLOG","fISN",isn(3),2)
    Call CheckDB_DOCLOG(isn(3),"77","N","10","",1)
    Call CheckDB_DOCLOG(isn(3),"77","M","10","Received",1)
    
    'SQL Ստուգում SW_MESSAGES աղուսյակում
    Call CheckQueryRowCount("SW_MESSAGES","fISN",isn(1),1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES(1),1)
    
    Call CheckQueryRowCount("SW_MESSAGES","fISN",isn(2),1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES(2),1)
    
    Call CheckQueryRowCount("SW_MESSAGES","fISN",isn(3),1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES(3),1)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''--- Ադմինի ԱՇՏ/Ստեղծված փաստաթղթերից հեռացնել ներմուծված փաստաթղթերը ---''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Ադմինի ԱՇՏ/Ստեղծված փաստաթղթերից հեռացնել ներմուծված փաստաթղթերը --",,,DivideColor
        
    'Մուտք Ադմինիստրարտոր ԱՇՏ 4.0
    Call ChangeWorkspace(c_Admin40)
    
    folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|êï»ÕÍí³Í ÷³ëï³ÃÕÃ»ñ"
    stDate = aqDateTime.Today
    enDate = aqDateTime.Today
    wUser = 77
    docType = ""
    Call OpenCreatedDocFolder(folderDirect, stDate, enDate, wUser, docType)
    
    Call SearchAndDelete("frmPttel", 2, isn(1) , "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
    Call SearchAndDelete("frmPttel", 2, isn(2) , "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
    Call SearchAndDelete("frmPttel", 2, isn(3) , "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
    
    'Փակել "Ստեղծված փաստաթղթեր" թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''-- Կարգավորումների ներմուծում 2--''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կարգավորումների ներմուծում 2--",,,DivideColor
    
    settingsPath = Project.Path & "Stores\SWIFT\HT900\Settings\Setting_2.txt"
    folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|Ð³Ù³Ï³ñ·³ÛÇÝ ³ßË³ï³ÝùÝ»ñ|îíÛ³ÉÝ»ñÇ Ý»ñÙáõÍáõÙ|ö³ëï³ÃÕÃ»ñÇ Ý»ñÙáõÍáõÙ"
    Call ChangeWorkspace(c_Admin40)
    BuiltIn.Delay(3000)
    Call Settings_Import(settingsPath,folderDirect)
    
    'SQL Ստուգում PARAMS աղուսյակում
    Call CheckQueryRowCount("PARAMS","fVALUE","110,200,900",1)

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''--- "S.W.I.F.T. ԱՇՏ/Պարամետրեր"-ում կատարել համապատասխան փոփոխությունները---''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- S.W.I.F.T. ԱՇՏ/Պարամետրեր-ում կատարել համապատասխան փոփոխությունները --",,,DivideColor
        
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |ä³ñ³Ù»ïñ»ñ")
    BuiltIn.Delay(3000)
    
    For i = 1 To 3
        fileFrom = Project.Path &"Stores\SWIFT\HT900\ImportFile\HT000900_"&i&".RJE"
        fileTo = Project.Path &"Stores\SWIFT\HT900\ImportFile\Import\HT000900_"&i&".RJE"

        'Վերարտագրում է նախօրոք տրված ֆայլը մեկ այլ ֆայլի մեջ` կատարելով փոփոխություն
        Call Read_Write_File_With_replace(fileFrom,fileTo,"","")
    Next
    
    If SysType = 3 Then
        aqFileSystem.DeleteFile(fileTo)
        BuiltIn.Delay(2000)
        fileTo = Project.Path &"Stores\SWIFT\HT900\ImportFile\Import\ForSPFS\HT000900_3.RJE"
        Call Read_Write_File_With_replace(fileFrom,fileTo,"","")
    End If
    'Փակել Պարամետրեր թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")

    Login("ARMSOFT")
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''--- Կատարել Ընդունել SWIFT համակարգից գործողությունը ---''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Կատարել Ընդունել SWIFT համակարգից գործողությունը --",,,DivideColor
    
    'Մուտք գործել "S.W.I.F.T. ԱՇՏ"
    Call ChangeWorkspace(c_SWIFT)
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |Ð³Õáñ¹³·ñáõÃÛáõÝÝ»ñÇ ÁÝ¹áõÝáõÙ|ÀÝ¹áõÝ»É S.W.I.F.T. Ñ³Ù³Ï³ñ·Çó")
    
    Call MessageExists(2,"3 Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñÇ ÁÝ¹áõÝáõÙÝ ³í³ñïí»ó")
    Call ClickCmdButton(5, "OK")
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''--- Ստուգում է փաստաթղթերի առկայությունը և արժեքները ---'''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Ստուգում է փաստաթղթերի առկայությունը և արժեքները --",,,DivideColor

    Call GoTo_Recieved_Messages (recieved, "|S.W.I.F.T. ²Þî                  |Ê³éÁ Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ|êï³óí³Í Ë³éÁ Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ")
    BuiltIn.Delay(4000)
    
    Call ColumnSorting(SortArr, 2, "frmPttel")
    
    Path1 = Project.Path & "Stores\SWIFT\HT900\Actual_1.txt"
    Path2 = Project.Path & "Stores\SWIFT\HT900\Expected.txt"
    IgnoreParams = "(.[0-9][/][0-9].[/]..)|(.([0-9]):([0-9]).)|(GB[0-9]..)"
    
    If SysType = 3 Then
          Path2 = Project.Path & "Stores\SWIFT\HT900\Expected_1.txt"
    End If
    
    'Արտահանել և Ð³Ù»Ù³ï»É »ñÏáõ xml ý³ÛÉ»ñ
    Call ExportToTXTFromPttel("frmPttel",Path1)
    Call Compare_Files(Path2, Path1, IgnoreParams)
    
    'Ստուգում է փաստաթղթերի առկայությունը և արժեքները
    If SearchInPttel("frmPttel",3, "FGVM0012047905") Then
       Call wMainForm.MainMenu.Click(c_AllActions)
       Call wMainForm.PopupMenu.Click(c_View)
       
       BuiltIn.Delay(2000)
       If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
           Call Check_Confirmation(checkConfirmation(1))
           'isn-ի վերագրում փոփոխականին
           isn(1) = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
           Call ClickCmdButton(1, "OK")
       Else 
           Log.Error "Can't find frmASDocForm window", "", pmNormal, ErrorColor
       End if
    End If
    If SearchInPttel("frmPttel",3, "S000017010923637") Then
       Call wMainForm.MainMenu.Click(c_AllActions)
       Call wMainForm.PopupMenu.Click(c_View)
       BuiltIn.Delay(2000)
       
       If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
           Call Check_Confirmation(checkConfirmation(2))
           'isn-ի վերագրում փոփոխականին
           isn(2) = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
           Call ClickCmdButton(1, "OK")
       Else 
           Log.Error "Can't find frmASDocForm window", "", pmNormal, ErrorColor
       End if
    End If
    If SearchInPttel("frmPttel",3, "AK514612/080121") Then
       Call wMainForm.MainMenu.Click(c_AllActions)
       Call wMainForm.PopupMenu.Click(c_View)
       BuiltIn.Delay(2000)
       
       If SysType = 3 Then
          checkConfirmation(3).FileName = "HT000900#001"
       End If
       
       If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
           Call Check_Confirmation(checkConfirmation(3))
           'isn-ի վերագրում փոփոխականին
           isn(3) = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
           Call ClickCmdButton(1, "OK")
       Else 
           Log.Error "Can't find frmASDocForm window", "", pmNormal, ErrorColor
       End if
    End If

    'Փակել Ստացված խառը հաղորդագրություններ թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
   
    Log.Message "SQL ստուգում (Ընդունել SWIFT համակարգից գործողություն)ից հետո",,,SqlDivideColor
    Log.Message "1. fISN = "& isn(1),,,SqlDivideColor
    Log.Message "2. fISN = "& isn(2),,,SqlDivideColor
    Log.Message "3. fISN = "& isn(3),,,SqlDivideColor
        
    Call SQL_Initialize_For_SWIFT_MT900(isn(1),isn(2),isn(3)) 
    
    'SQL Ստուգում DOCS աղուսյակում
    fBODY = "  MT:900  BMDOCNUM:FGVM0012047905  REFERENCE:SWIFT CHARGES  ACC:400886573500USD  DATE:20220322  CUR:001  SUMMA:516  PINSTOP:D  "&_
    "PAYINST:SWIFT LA HULPE BELGIUM             INV0013368088 INV3009097822  ADDINFO:Additional info  VERIFIED:0  USERID:  77  SNDREC:CITIATWXXXX"&_
    "  BMNAME:HT000900#001  UNIQUEID:220322CITIATWXXXXX0001123456  RSBKMAIL:1  PRIOR:N  DELIV:0  "

    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", isn(1), 1)
    Call CheckDB_DOCS(isn(1), "MT900   ", "10", fBODY, 1)
    
    fBODY = "  MT:900  BMDOCNUM:S000017010923637  REFERENCE:CBC170109DD82SA  ACCOP:P  ACC:30111840700000000428  ACCID:COVBAM22  DATE:20220322  CUR:001"&_
    "  SUMMA:1  ADDINFO:Additional info  VERIFIED:0  USERID:  77  SNDREC:CITIATWXXXX  BMNAME:HT000900#002  "&_
    "UNIQUEID:220322CITIATWXXXXX0001123457  RSBKMAIL:1  PRIOR:N  DELIV:0  "
    
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", isn(2), 1)
    Call CheckDB_DOCS(isn(2), "MT900   ", "10", fBODY, 1)
    
    fBODY = "  MT:900  BMDOCNUM:AK514612/080121  REFERENCE:RZBA21010810343  ACC:000-55.069.231/USD  DATE:20220322  CUR:001  SUMMA:30  PINSTOP:A"&_
    "  PAYINST:ARSJAM22  ADDINFO:Additional information  VERIFIED:0  USERID:  77  SNDREC:CITIATWXXXX  BMNAME:HT000900#003"&_
    "  UNIQUEID:220322CITIATWXXXXX0001123458  RSBKMAIL:1  PRIOR:N  DELIV:0  "

    If SysType = 3 Then
       fBODY = "  MT:900  BMDOCNUM:AK514612/080121  REFERENCE:RZBA21010810343  ACC:000-55.069.231/USD  DATE:20220322  CUR:001  SUMMA:30  PINSTOP:A"&_
       "  PAYINST:ARSJAM22  ADDINFO:Additional information  VERIFIED:0  USERID:  77  SNDREC:CITIATWXXXX  BMNAME:HT000900#001"&_
       "  UNIQUEID:220322CITIATWXXXXX0001123458  RSBKMAIL:1  PRIOR:N  DELIV:0  "
    End If
    fBODY = Replace(fBODY, "  ", "%")
    Call CheckQueryRowCount("DOCS", "fISN", isn(3), 1)
    Call CheckDB_DOCS(isn(3), "MT900   ", "10", fBODY, 1)
    
    'SQL Ստուգում DOCLOG աղուսյակում 
    Call CheckQueryRowCount("DOCLOG","fISN",isn(1),2)
    Call CheckDB_DOCLOG(isn(1),"77","N","10","",1)
    Call CheckDB_DOCLOG(isn(1),"77","M","10","Received",1)
    
    Call CheckQueryRowCount("DOCLOG","fISN",isn(2),2)
    Call CheckDB_DOCLOG(isn(2),"77","N","10","",1)
    Call CheckDB_DOCLOG(isn(2),"77","M","10","Received",1)
    
    Call CheckQueryRowCount("DOCLOG","fISN",isn(3),2)
    Call CheckDB_DOCLOG(isn(3),"77","N","10","",1)
    Call CheckDB_DOCLOG(isn(3),"77","M","10","Received",1)
    
    'SQL Ստուգում SW_MESSAGES աղուսյակում
    Call CheckQueryRowCount("SW_MESSAGES","fISN",isn(1),1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES(1),1)
    
    Call CheckQueryRowCount("SW_MESSAGES","fISN",isn(2),1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES(2),1)
    
    Call CheckQueryRowCount("SW_MESSAGES","fISN",isn(3),1)
    Call CheckDB_SW_MESSAGES(dbSW_MESSAGES(3),1)
    
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''--- Ադմինի ԱՇՏ/Ստեղծված փաստաթղթերից հեռացնել ներմուծված փաստաթղթերը ---''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    Log.Message "-- Ադմինի ԱՇՏ/Ստեղծված փաստաթղթերից հեռացնել ներմուծված փաստաթղթերը --",,,DivideColor
        
    'Մուտք Ադմինիստրարտոր ԱՇՏ 4.0
    Call ChangeWorkspace(c_Admin40)
    
    folderDirect = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|ÂÕÃ³å³Ý³ÏÝ»ñ|êï»ÕÍí³Í ÷³ëï³ÃÕÃ»ñ"
    stDate = aqDateTime.Today
    enDate = aqDateTime.Today
    wUser = 77
    docType = ""
    Call OpenCreatedDocFolder(folderDirect, stDate, enDate, wUser, docType)
    
    Call SearchAndDelete("frmPttel", 2, isn(1) , "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
    Call SearchAndDelete("frmPttel", 2, isn(2) , "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
    Call SearchAndDelete("frmPttel", 2, isn(3) , "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ") 
    
    'Փակել "Ստեղծված փաստաթղթեր" թղթապանակը
    Call Close_Window(wMDIClient, "frmPttel")
    
    Call Close_AsBank()
End Sub

Sub SQL_Initialize_For_SWIFT_MT900(isn1,isn2,isn3) 

    Set dbSW_MESSAGES(1) = New_SW_MESSAGES()
    With dbSW_MESSAGES(1)
       .fISN = isn1
       .fUNIQUEID = "220322CITIATWXXXXX0001123456"
       .fDATE = "2022-03-22"
       .fMT = "900"
       .fCATEGORY = "2"
       .fDOCNUM = "FGVM0012047905  "
       .fSR = "2"
       .fSRBANK = "CITIATWXXXX"
       .fSYS = "1"
       .fSTATE = "10"
       .fUSER = "77"
       .fACCDB = ""
       .fACCCR = ""
       .fAMOUNT = "516.00"
       .fCURR = "001"
       .fPAYER = ""
       .fRECEIVER = ""
       .fAIM = "Additional info                 "
    End With
    
    Set dbSW_MESSAGES(2) = New_SW_MESSAGES()
    With dbSW_MESSAGES(2)
       .fISN = isn2
       .fUNIQUEID = "220322CITIATWXXXXX0001123457"
       .fDATE = "2022-03-22"
       .fMT = "900"
       .fCATEGORY = "2"
       .fDOCNUM = "S000017010923637"
       .fSR = "2"
       .fSRBANK = "CITIATWXXXX"
       .fSYS = "1"
       .fSTATE = "10"
       .fUSER = "77"
       .fACCDB = ""
       .fACCCR = ""
       .fAMOUNT = "1.00"
       .fCURR = "001"
       .fPAYER = ""
       .fRECEIVER = ""
       .fAIM = "Additional info                 "
    End With
    
    Set dbSW_MESSAGES(3) = New_SW_MESSAGES()
    With dbSW_MESSAGES(3)
       .fISN = isn3
       .fUNIQUEID = "220322CITIATWXXXXX0001123458"
       .fDATE = "2022-03-22"
       .fMT = "900"
       .fCATEGORY = "2"
       .fDOCNUM = "AK514612/080121 "
       .fSR = "2"
       .fSRBANK = "CITIATWXXXX"
       .fSYS = "1"
       .fSTATE = "10"
       .fUSER = "77"
       .fACCDB = ""
       .fACCCR = ""
       .fAMOUNT = "30.00"
       .fCURR = "001"
       .fPAYER = ""
       .fRECEIVER = ""
       .fAIM = "Additional information          "
    End With
End Sub

Sub Initialize_For_SWIFT_900()
    
    Set recieved = New_Recieved()
    With recieved
        .sDate = aqDateTime.Today
        .eDate = aqDateTime.Today
    End With

    Set checkConfirmation(1) = New_ConfirmationAgreement()
    With checkConfirmation(1)
        .MsgType = "900"
        .NumberOfDocument = "FGVM0012047905"
        .Reference = "SWIFT CHARGES"
        .TypeOfAccountId = ""
        .Account = "400886573500USD"
        .AccountIdentifier = ""
        .Date = "22/03/22"
        .Curr = "001"
        .Amount = "516.00"
        .TypeOfOrderingClient = ""
        .AccountOfOrderingClient = ""
        .OrderingClient = ""
        .TypeOfOrderingInstitution = "D"
        .PIDofOrderingInstitution = ""
        .OrderingInstitution = "SWIFT LA HULPE BELGIUM             INV0013368088 INV3009097822"
        .TypeOfIntermediaryInstitution = ""
        .PIDofIntermediaryInstitution = ""
        .IntermediaryInstitution = ""
        .SenderToReceiverInformation = "Additional info"
        .Key = ""
        .SenderReceiver = "CITIATWXXXX"
        .PacketNumber = ""
        .FileName = "HT000900#001"
        .DirectoryName = ""
        .DateSend = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .Trailer = ""
        .Priority = "N"
        .BankPriority = ""
    End with
    
    Set checkConfirmation(2) = New_ConfirmationAgreement()
    With checkConfirmation(2)
        .MsgType = "900"
        .NumberOfDocument = "S000017010923637"
        .Reference = "CBC170109DD82SA"
        .TypeOfAccountId = "P"
        .Account = "30111840700000000428"
        .AccountIdentifier = "COVBAM22"
        .Date = "22/03/22"
        .Curr = "001"
        .Amount = "1.00"
        .TypeOfOrderingClient = ""
        .AccountOfOrderingClient = ""
        .OrderingClient = ""
        .TypeOfOrderingInstitution = ""
        .PIDofOrderingInstitution = ""
        .OrderingInstitution = ""
        .TypeOfIntermediaryInstitution = ""
        .PIDofIntermediaryInstitution = ""
        .IntermediaryInstitution = ""
        .SenderToReceiverInformation = "Additional info"
        .Key = ""
        .SenderReceiver = "CITIATWXXXX"
        .PacketNumber = ""
        .FileName = "HT000900#002"
        .DirectoryName = ""
        .DateSend = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .Trailer = ""
        .Priority = "N"
        .BankPriority = ""
    End with
    
    Set checkConfirmation(3) = New_ConfirmationAgreement()
    With checkConfirmation(3)
        .MsgType = "900"
        .NumberOfDocument = "AK514612/080121"
        .Reference = "RZBA21010810343"
        .TypeOfAccountId = ""
        .Account = "000-55.069.231/USD"
        .AccountIdentifier = ""
        .Date = "22/03/22"
        .Curr = "001"
        .Amount = "30.00"
        .TypeOfOrderingClient = ""
        .AccountOfOrderingClient = ""
        .OrderingClient = ""
        .TypeOfOrderingInstitution = "A"
        .PIDofOrderingInstitution = ""
        .OrderingInstitution = "ARSJAM22"
        .TypeOfIntermediaryInstitution = ""
        .PIDofIntermediaryInstitution = ""
        .IntermediaryInstitution = ""
        .SenderToReceiverInformation = "Additional information"
        .Key = ""
        .SenderReceiver = "CITIATWXXXX"
        .PacketNumber = ""
        .FileName = "HT000900#003"
        .DirectoryName = ""
        .DateSend = aqConvert.DateTimeToFormatStr(aqDateTime.Today,"%d/%m/%y")
        .Trailer = ""
        .Priority = "N"
        .BankPriority = ""
    End with
End Sub