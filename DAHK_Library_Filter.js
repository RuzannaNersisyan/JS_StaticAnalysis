'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library

' Մուտք հաշիվներ թղթապանակ, հաշիվներ դիալոգի լրացում
Sub OpenAccauntsFolder(folderDirect, accChartNum, balAcc, accMAsk, accCur, accType, accName, clName, clCode, incExp, showLimits, _
                                               oldAccMask, newAccMask, accNote, accNote2, accNote3, cashAcc, showCli, showOthInfo, opDate, endOpDAte,_
                                               acsBranch, acsDepart, acsType, selectView, exportExcel )

      Call wTreeView.DblClickItem(folderDirect)
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error(" Դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Հաշվային պլանի համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "COANUM", "^A[Del]" & accChartNum )
      ' Հ/Պ հաշվեկշռային հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "BALACC", balAcc )
      ' Հաշվի շաբլոն դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", accMAsk )
      ' Արժույթ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCCUR", accCur )
      ' Հաշվի տիպ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCTYPE", accType )
      ' Հաշվի անվանում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCNAME", accName )
      ' Հաճախորդի անվանում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CLNAME", clName )
      ' Հաճախորդ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CLICOD", clCode )
      ' Եկամուտ/Ծախս դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "INCEXP", incExp )
      ' Ցույց տալ մնացորդի սահմանները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWLIMITS",  showLimits)
'      ' Հին հաշիվ դաշտի լրացում
'      Call Rekvizit_Fill("Dialog", 1, "General", "OLDACCMASK", oldAccMask )
      ' Նոր հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NEWACCMASK", newAccMask )
      ' Նշում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCNOTE", accNote )
      ' Նշում 2  դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCNOTE2", accNote2 )
      ' Նշում 3  դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCNOTE3", accNote3 )
      ' Կանխիկի հաշվառում  դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "CASHAC", cashAcc )
      ' Ցույց տալ հաճախորդների հատկանիշները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWCLI", showCli )
      ' Ցույց տալ լրացուցիչ տվյալները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWOTHINFO", showOthInfo )
      ' Բացման ամսաթիվ սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DATOTKN",opDate  )
      ' Փակման ամսաթիվ ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DATOTKK", endOpDAte )
      ' Գրասնեյակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSBRANCH", acsBranch )
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSDEPART", acsDepart )
      ' Հասան-ն տիպ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSTYPE", acsType )
      ' Դիտելու ձև դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SELECTED_VIEW", "^A[Del]" & selectView )
      ' Լրացնել դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EXPORT_EXCEL", "^A[Del]" & exportExcel )
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)
      
End Sub



' Մուտք Ընդունված հաղորդագրություններ թղթապանակ
' folderDirect - թղթապանակի ուղղությունը
' folderName - դիալոգի անվանումը
' stDate - Ժամանակահատվածի սկիզբ 
' eDate - Ժամանակահատվածի ավարտ
' messType - Հաղորդագրության տեսակ 
' inqNumber - Վարույթի համար
' inquestId - Վարույթի կոդ 
' messId - Հաղորդագրության համար
' cliCode - Հաճախորդի կոդ
' passTax - Անձնագիր/ՀՎՀՀ
' wSSN - ՀԾՀ
' wName - Պարտապանի անվանում
' wAddress - Պարտապանի հասցե
' wProcess - Ցույց տալ պատասխան ունեցողները
' wDuplicate - Ցույց տալ կրկնություները
' relMess - Ցույց տալ կապակցված հաղ. առկ.
' onlyNotBlock - Ցույց տալ միայն արգելադրում չունեցողները
Sub OpenReceivedMessagesFolder(folderDirect, folderName, stDate, eDate, messType, inqNumber, inquestId, messId, cliCode, _
                                             passTax, wSSN, wName, wAddress, wProcess, wDuplicate, relMess, onlyNotBlock)

      Call wTreeView.DblClickItem(folderDirect)
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error(folderName & " դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", "^A[Del]" & stDate )
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", "^A[Del]" & eDate )
      ' Հաղորդագրության տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "TYPE", messType )
      ' Վարույթի համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "INQUESTNUMBER", inqNumber)
      ' Վարույթի կոդ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "INQUESTID", inquestId)
      ' Հաղորդագրության համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "MESSAGEID", messId)
      ' Հաճախորդի կոդ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CLICODE", cliCode)
      ' Անձնագիր/ՀՎՀՀ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PASSTAX", passTax)
      ' ՀԾՀ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SSN", wSSN)
      ' Պարտապանի անվանում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NAME", wName )
      ' Պարտապանի հասցե դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ADDRESS", wAddress)
      ' Ցույց տալ պատասխան ունեցողները չեքբոքսի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "PROCESS", wProcess)
      ' Ցույց տալ կրկնություները չեքբոքսի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "DUPLICATE", wDuplicate)
      ' Ցույց տալ կապակցված հաղ. առկ. չեքբոքսի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "RELMESSAGES", relMess)
      ' Ցույց տալ միայն արգելադրում չունեցողները չեքբոքսի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "ONLYNOTBLOCKED", onlyNotBlock)
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)

End Sub


' Մուտք խմբագրվող հաղորդագրություններ թղթապանակ
' folderDirect - թղթապանակի ուղղությունը
' folderName - դիալոգի անվանումը
' stDate - Ժամանակահատվածի սկիզբ 
' eDate - Ժամանակահատվածի ավարտ
' messType - Հաղորդագրության տեսակ 
' inqNumber - Վարույթի համար
' inquestId - Վարույթի կոդ 
Sub OpenEditableMessFolder(folderDirect, folderName, stDate, eDate, messType, inqNumber, inquestId, sentMess, passTax )

      Call wTreeView.DblClickItem(folderDirect)
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error(folderName & " դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", "^A[Del]" & stDate )
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", "^A[Del]" & eDate )
      ' Հաղորդագրության տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "TYPE", messType )
      ' Վարույթի համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "INQUESTNUMBER", inqNumber)
      ' Վարույթի կոդ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "INQUESTID", inquestId)
      
      If sentMess Then
            ' Անձնագիր/ՀՎՀՀ դաշտի լրացում
            Call Rekvizit_Fill("Dialog", 1, "General", "PASSTAX", passTax)
      End If
            
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)
      
End Sub

' Մուտք Գումարների արգելադրումներ թղթապանակ
' folderDirect - թղթապանակի ուղղությունը
' folderName - դիալոգի անվանումը
' stDate - Ժամանակահատվածի սկիզբ 
' eDate - Ժամանակահատվածի ավարտ
' clCode - Հաճախորդ
' clName - Հաճախորդի անվանում
' blockId - Արգելանքի ID
' wSource - Աղբյուր
' showClosed - Ցույց տալ փակվածները
Sub OpenMoneyBarriersFolder(folderDirect, folderName, stDate, eDate, clCode, clName, blockId, wSource, showClosed)

      Call wTreeView.DblClickItem(folderDirect)
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error(folderName & " դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SDATE", "^A[Del]" & stDate )
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EDATE", "^A[Del]" & eDate )
      ' Հաճախորդ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CLICODE", clCode)
      ' Հաճախորդի անվանում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CLINAME", clName)
      ' Արգելանքի ID դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "BLOCKID", blockId)
      ' Աղբյուր դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SOURCE", wSource)
      ' Ցույց տալ փակվածները չեքբոքսի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SHOWCLOSED", showClosed)
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)
      
End Sub


' Մուտք Օգտագործողի սևագիր թղթապանակ
' folderDirect - թղթապանակի ուղղությունը
' folderName - դիալոգի անվանումը
' User - Օգտագործող
Sub OpenUserDraftFolder(folderDirect, folderName, wUser)

      Call wTreeView.DblClickItem(folderDirect)
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error(folderName & " դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "USER", "^A[Del]" & wUser )
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)
      
End Sub