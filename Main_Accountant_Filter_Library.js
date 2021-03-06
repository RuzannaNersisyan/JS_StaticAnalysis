'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library
'USEUNIT Library_Colour

' Մուտք հաշվառված վճարային փաստաթղթեր թղթապանակ
' folderDirect - թղթապանակի ուղղություն
' stDate - Ժամանակահատվածի սկիզբ
' eDate - Ժամանակահատվածի ավարտ
' wUser - Կատարող
' docType - Փաստաթղթի տեսակ
' wName - Անվանում
' passNum - Անձը հաստատող փաստաթուղթ
' cliCode - Հաճախորդ
' paySysIn - Ընդ. վճարման համակարգ
' paySysOut - Ուղ վճ. համակարգ 
' acsBranch - Գրասնեյակ
' acsDepart - Բաժին
' docISN - Փաստաթղթի ISN
' selectedView - Դիտել ձև
' expExcel - Լրացնել
Sub OpenAccPaymentDocFolder(folderDirect, stDate, eDate, wUser, docType, wName, passNum, cliCode,_
                                                            paySysIn, paySysOut, acsBranch, acsDepart, docISN, selectedView, expExcel)

      Call wTreeView.DblClickItem(folderDirect)
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error(" Դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", "^A[Del]" & stDate )
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", "^A[Del]" & eDate)
      ' Կատարող դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "USER", "^A[Del]" & wUser )
      ' Փաստաթղթի տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", docType )
      ' Անվանում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NAME", wName)
      ' Անձը հաստատող փաստաթուղթ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PASSNUM", passNum )
      'Հաճախորդ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CLICODE", cliCode )
      ' Ընդ. վճարման համակարգ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PAYSYSIN",  paySysIn)
      ' Ուղ վճ. համակարգ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PAYSYSOUT", paySysOut )
      ' Գրասենյակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSBRANCH", acsBranch )
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSDEPART", acsDepart )
      ' Փաստաթղթի ISN դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DOCISN", docISN )
      ' Դիտել ձև դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SELECTED_VIEW", "^A[Del]" & selectedView )
      ' Լրացնել դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EXPORT_EXCEL", "^A[Del]" & expExcel )
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)
End Sub

' Մուտք "ՖՆ-ում հաշիվների կարգավիճակներ" թղթապանակ
' folderDirect - թղթապանակի ուղղություն
' stDate - Ժամանակահատվածի սկիզբ
' eDate - Ժամանակահատվածի ավարտ
' accMask - Հաշվի շաբլոն
' accBranch - Հաշվի գրասենյակ
' accDepart - Հաշվի բաժին
' accAcsType - Հասան-ն տիպ
' balAcc -Հ/Պ հաշիվ
' accType - Հաշվի տիպ
' accNote - Նշում (Հաշիվ)
' accNote2 - Նշում 2 (Հաշիվ)
' accNote3 - Նշում 3 (Հաշիվ)
' showOp - Ցույց տալ բացվածները
' showCl - Ցույց տալ փակվածները
' fnState -  ՖՆ կարգավիճակ
' showFnState - Ցույց տալ ՖՆ կարգավիճ. մանրամասները
' selectedView - Դիտելու ձև
' exportExcel - Լրացնել
' cliCode - Հաճախորդ
' cliBranch - Գրասենյակ (հաճ.)
' cliDepart - Բաժին (հաճ.)
' cliAccType - Հասան-ն տիպ (հաճ.)
' jurState - Իրավաբանական կարգավիճակ
' wVolort - Գրծունեության ոլորտ
' petBuj -  Պետական կարգավիճակ 
' wRez - Ռեզիդենտություն
' cliNote - Նշում (Հաճ.)
' cliNote2 - Նշում 2 (Հաճ.)
' cliNote3 - Նշում 3 (Հաճ.)
' distRict - Մարզ
' taxCode - Ցույց տալ ՀՎՀՀ ունեցողներին
Sub OpenFnAccStatusesFolder(folderDirect, stDate, eDate, accMask, accBranch, accDepart, accAcsType, balAcc, accType, accNote, accNote2, accNote3, _
       showOp, showCl, fnState, showFnState, selectedView, exportExcel, cliCode, cliBranch, cliDepart, cliAccType, _
      jurState, wVolort, petBuj, wRez, cliNote, cliNote2, cliNote3, distRict, taxCode)

      Call wTreeView.DblClickItem(folderDirect)
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error(" Դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "STARTDATE", "^A[Del]" & stDate )
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ENDDATE", "^A[Del]" & eDate)
      ' Հաշվի շաբլոն դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", accMask)
      ' Հաշվի գրասենյակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCACBRANCH", accBranch)
      ' Հաշվի բաժին դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCDEPART", accDepart)
      ' Հասան-ն տիպ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCACSTYPE", accAcsType)
      ' Հ/Պ հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "BALACC", balAcc)
      ' Հաշվի տիպ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCTYPE", accType)
      ' Նշում (Հաշիվ) դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCNOTE", accNote)
      ' Նշում2 (Հաշիվ) դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCNOTE2", accNote2)
      ' Նշում3 (Հաշիվ) դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCNOTE3", accNote3)
      ' Ցույց տալ բացվածները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWOP", showOp)
      ' Ցույց տալ փակվածները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWCL", showCl)
      ' ՖՆ կարգավիճակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "FNSTATE", fnState)
      ' Ցույց տալ ՖՆ կարգավիճ. մանրամասները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWFNSTDET", showFnState)
      ' Դիտելու ձև դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SELECTED_VIEW", "^A[Del]" & selectedView)
      ' Լրացնել դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EXPORT_EXCEL", "^A[Del]" & exportExcel)
      ' Հաճախորդ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 2, "General", "CLICODE", cliCode)
      ' Գրասենյակ (հաճ.) դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 2, "General", "CLIBRANCH", cliBranch)
      ' Բաժին (հաճ.) դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 2, "General", "CLIDEPART", cliDepart)
      ' Հասան-ն տիպ (հաճ.) դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 2, "General", "CLIACSTYPE", cliAccType)
      ' Իրավաբանական կարգավիճակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 2, "General", "JURSTAT", jurState)
      ' Գործունեության ոլորտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 2, "General", "VOLORT", wVolort)
      ' Պետական կարգավիճակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 2, "General", "PETBUJ", petBuj)
      ' Ռեզիդենտություն դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 2, "General", "REZ", wRez)
      ' Նշում (Հաճ.) դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 2, "General", "CLINOTE", cliNote)
      ' Նշում2 (Հաճ.) դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 2, "General", "CLINOTE2", cliNote2)
      ' Նշում3 (Հաճ.) դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 2, "General", "CLINOTE3", cliNote3)
      ' Մարզ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 2, "General", "DISTRICT", distRict)
      ' Ցույց տալ ՀՎՀՀ ունեցողներին դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 2, "CheckBox", "HASTAXCODE", taxCode)      
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)      
End Sub

' Մուտք Ընդհանուր դիտում թղթապանակ
' folderDirect - թղթապանակի ուղղություն
' stDate - Ժամանակահատվածի սկիզբ
' eDate - Ժամանակահատվածի ավարտ
' coaNum - Հաշվային պլանի համար
' balAcc - Հ/Պ հաշվեկշռային հաշիվ
' accMask - Հաշվի շաբլոն
' wCur - Արժույթ
' operType - Գործողության տեսակ
' wUser - Օգտագործող
' showPrc - Ցույց տալ կուտակումները
' showRel - Ցույց տալ վերագնահատումները
' showRst - Ցույց տալ (ապա)պահուստվ.
' showAccNames - Ցույց տալ հաշիվների անվանումը
' showPayres - Ցույց տալ վճարող|ստացողներին, մեկնաբ., վճ. համ.
' showCrDate - Ցույց տալ ստեղծման ժամանակը
' acsBranch - Գրասենյակ
' acsDepart - Բաժին
' selectView - Դիտելու ձև
' exportExcel - Լրացնել
Sub OpenOverallviewFolder(folderDirect, stDate, eDate, coaNum, balAcc, accMask, wCur, operType, wUser, showPrc, showRel, showRst, _
                                                    showAccNames, showPayres, showCrDate, acsBranch, acsDepart, selectView, exportExcel)

      Call wTreeView.DblClickItem(folderDirect)
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error(" Դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", "^A[Del]" & stDate )
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", "^A[Del]" & eDate)
      ' Հաշվային պլանի համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "COANUM", coaNum )
      ' Հ|Պ հաշվեկշռային հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "BALACC", balAcc)
      ' Հաշվի շաբլոն դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", accMask)
      ' Արժույթ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CUR", wCur )
      ' Գործողության տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "OPERTYPE", operType)
      ' Կատարողներ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "USER", "^A[Del]" & wUser)
      ' Ցույց տալ կուտակումները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWPRC", showPrc)
      ' Ցույց տալ վերագնահատումները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWRVL", showRel)
      ' Ցույց տալ (ապա)պահուստվ. դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWRST", showRst)
      ' Ցույց տալ հաշիվների անվանումը դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWACCNAMES", showAccNames)
      ' Ցույց տալ վճարող|ստացողներին, մեկնաբ., վճ. համ. դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWPAYRES", showPayres)
      ' Ցույց տալ ստեղծման ժամանակը դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWCRDATE", showCrDate)
      ' Գրասենյակ  դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSBRANCH", acsBranch)
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSDEPART", acsDepart)
      ' Դիտելու ձև դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SELECTED_VIEW", selectView)
      ' Լրացնել դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EXPORT_EXCEL", exportExcel)
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)      
End Sub

' Մուտք "Ուղարկված փոխանցումներ" թղթապանակ
' folderDirect - թղթապանակի ուղղություն
' stDate - Ժամանակահատվածի սկիզբ
' eDate - Ժամանակահատվածի ավարտ
' wUser - Կատարող
' docType - Փաստաթղթի տեսակ
' acsBranch - Գրասենյակ
' acsDepart - Բաժին
' selectedView - Դիտելու ձև
' exportExcel - Լրացնել
Sub OpenSentTransfersFolder(folderDirect, stDate, eDate, wUser, docType, acsBranch, acsDepart, selectedView, exportExcel)

      Call wTreeView.DblClickItem(folderDirect)
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error(" Դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", "^A[Del]" & stDate )
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", "^A[Del]" & eDate)
      ' Կատարող դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "USER", "^A[Del]" & wUser)
      ' Փաստաթղթի տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", docType )
      ' Գրասենյակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSBRANCH", acsBranch )
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSDEPART", acsDepart )
      ' Դիտելու ձև դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SELECTED_VIEW", selectedView)
      ' Լրացնել դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EXPORT_EXCEL", exportExcel)
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)
      
End Sub

' Մուտք Ստեղծված փաստաթղթեր թղթապանակ
' folderDirect - թղթապանակի ուղղություն
' stDate - Ժամանակահատվածի սկիզբ
' eDate - Ժամանակահատվածի ավարտ
' wUser - Կատարող
' docType - Փաստաթղթի տեսակ
Sub OpenCreatedDocFolder(folderDirect, stDate, eDate, wUser, docType)

      Call wTreeView.DblClickItem(folderDirect)

      If p1.WaitVBObject("frmAsUstPar", 3000).Exists Then
          ' Ժամանակահատվածի սկիզբ դաշտի լրացում
          Call Rekvizit_Fill("Dialog", 1, "General", "SDATE", "^A[Del]" & stDate )
          ' Ժամանակահատվածի ավարտ դաշտի լրացում
          Call Rekvizit_Fill("Dialog", 1, "General", "EDATE", "^A[Del]" & eDate)
          ' Կատարող դաշտի լրացում
          Call Rekvizit_Fill("Dialog", 1, "General", "USER", "^A[Del]" & wUser)
          ' Փաստաթղթի տեսակ դաշտի լրացում
          Call Rekvizit_Fill("Dialog", 1, "General", "DOCTP", docType )
          ' Կատարել կոճակի սեղմում
          Call ClickCmdButton(2, "Î³ï³ñ»É")
      Else
            Log.Error(" Դիալոգը չի բացվել")
      End If
End Sub

' Մուտք Ստեղծված փաստաթղթեր/Տարանցիկ թղթապանակ
' folderDirect - թղթապանակի ուղղություն
' stDate - Ժամանակահատվածի սկիզբ
' eDate - Ժամանակահատվածի ավարտ
' wUser - Կատարող
' wCue - Արժույթ
' notCur - Արժույթի ժխտում
' docType - Փաստաթղթի տեսակ
' paySysIn - Ընդ.վճ. համակարգ
' paySysOut - Ուղ վճ. համակարգ
' showLongNames - Ցույց տալ երկար անունները
' acsBranch - Գրասենյակ
' acsDepart - Բաժին
' selectedView - Դիտելու ձև
' exportExcel - Լրացնել
' status - bool փոփոխական
Sub OpenSubjectToRegistrationFolder(folderDirect, stDate, eDate, wUser, wCue, notCur, docType, paySysIn, paySysOut, _
                                                                       showLongNames, acsBranch, acsDepart, selectedView, exportExcel, status)

      Call wTreeView.DblClickItem(folderDirect)
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error(" Դիալոգը չի բացվել")
            Exit Sub
      End If
      
     ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", "^A[Del]" & stDate )
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", "^A[Del]" & eDate)
      ' Կատարող դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "USER", "^A[Del]" & wUser)
      ' Արժույթ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CUR", wCue)
      
      If status Then
            ' Արժույթի ժխտում դաշտի լրացում
            Call Rekvizit_Fill("Dialog", 1, "CheckBox", "NOTCUR", notCur)
            ' Փաստաթղթի տեսակ դաշտի լրացում
            Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", docType )
            ' Ցույց տալ երկար անունները դաշտի լրացում
            Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWLONGNAMES", showLongNames)
      Else 
            ' Տիպ դաշտի լրացում
            Call Rekvizit_Fill("Dialog", 1, "General", "TYPE", docType & "[Tab]" )
            BuiltIn.Delay(2000)
      End If

      ' Ընդ.վճ. համակարգ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PAYSYSIN", paySysIn )
      ' Ուղ վճ. համակարգ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PAYSYSOUT", paySysOut )
      ' Գրասենյակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSBRANCH", acsBranch )
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSDEPART", acsDepart )
      ' Դիտելու ձև դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SELECTED_VIEW", selectedView )
      ' Լրացնել դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EXPORT_EXCEL", exportExcel )
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)
      
End Sub

'-------------------------------------------------
'"Կանխիկ միջոցների հաշվառում"  CashAccounting - Class
'-------------------------------------------------
Class CashAccounting
    Public ClientCode
    Public Curr
    Public LegalPosition
    Public BusinessField
    Public StateStatus
    Public Residence
    Public ClientName
    Public IdNumber
    Public Note
    Public ShowClosedClients
    Public Date
    Public Division
    Public Department
    Public AccessType
    
    Private Sub Class_Initialize
       ClientCode = ""
       Curr = ""
       LegalPosition = ""
       BusinessField = ""
       StateStatus = ""
       Residence = ""
       ClientName = ""
       IdNumber = ""
       Note = ""
       ShowClosedClients = 0
       Date = ""
       Division = ""
       Department = ""
       AccessType = ""
    End Sub  
End Class

Function New_CashAccounting()
    Set New_CashAccounting = NEW CashAccounting     
End Function

'---------------------------------------------------------------
'Լրացնել "Կանխիկ միջոցների հաշվառում"  CashAccounting  Ֆիլտրի արժեքները
'---------------------------------------------------------------
Sub Fill_CashAccounting(CashAccounting)

    'Լրացնում է "Հաճախորդի կոդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLIMASK",CashAccounting.ClientCode)
    'Լրացնում է "Արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CUR",CashAccounting.Curr)
    'Լրացնում է "Իրավաբանական կարգավիճակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLJURSTAT",CashAccounting.LegalPosition)
    'Լրացնում է "Գործողության ոլորտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLVOLORT",CashAccounting.BusinessField)
    'Լրացնում է "Պետական կարգավիճակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLPETBUJ",CashAccounting.StateStatus)
    'Լրացնում է "Ռեզիդենտություն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLREZ",CashAccounting.Residence)
    'Լրացնում է "Հաճախորդի անվանում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLNAME",CashAccounting.ClientName)
    'Լրացնում է "Անձը հաստատող փաստ." դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PASSPORT",CashAccounting.IdNumber)
    'Լրացնում է "Նշում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLINOTE",CashAccounting.Note)
    'Լրացնում է "Ցույց տալ փակված հաճախորդներին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","CLCLOSE",CashAccounting.ShowClosedClients)
    'Լրացնում է "Ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","DATE",CashAccounting.Date)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",CashAccounting.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",CashAccounting.Department)
    'Լրացնում է "Հասան-ն տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSTYPE",CashAccounting.AccessType)

    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------
'Մուտք է գործում Գլխավոր հաշվապահի ԱՇՏ/Հաշվ, մատյաններ/Կանխիկ միջոցների հաշվառում թղթապանակ
'--------------------------------------------------------------------------------
'CashAccountingObject  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoTo_CashAccounting(CashAccountingObject) 
    
    Dim FilterWin
    Call wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î³ÝËÇÏ ÙÇçáóÝ»ñÇ Ñ³ßí³éáõÙ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",delay_middle)
    BuiltIn.Delay(delay_middle) 
    
    If FilterWin.Exists Then
        Call Fill_CashAccounting(CashAccountingObject)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Cash Accounting Filter",,,ErrorColor      
    End If 
End Sub 

' Մուտք Ետհաշվեկշռային հաշիվներ թղթապանակ
Class BackBalanceSheetAcc
      Public folderDirect
      Public accChartNum
      Public balAcc
      Public accMAsk
      Public accCur
      Public accType
      Public accName
      Public clName
      Public clCode
      Public showLimits
      Public showCli
      Public oldAccMask
      Public newAccMask
      Public accNote
      Public accNote2
      Public accNote3
      Public opDate
      Public endOpDAte
      Public acsBranch
      Public acsDepart
      Public acsType
      Public selectView
      Public exportExcel
      
      Private Sub Class_Initialize
        folderDirect = ""
        accChartNum = ""
        balAcc = ""
        accMAsk = ""
        accCur = ""
        accType = ""
        accName = ""
        clName = ""
        clCode = ""
        showLimits = False
        showCli = False
        oldAccMask = ""
        newAccMask = ""
        accNote = ""
        accNote2 = ""
        accNote3 = ""
        opDate = ""
        endOpDAte = ""
        acsBranch = ""
        acsDepart = ""
        acsType = ""
        selectView = "NBACCS"
        exportExcel = "0"
      End Sub
End Class

Function New_BackBalanceSheetAcc()
          Set New_BackBalanceSheetAcc = New BackBalanceSheetAcc
End Function

' Մուտք Ետհաշվեկշռային հաշիվներ թղթապանակ
Sub Fill_BackBalanceSheetAcc(BackBalanceSheetAcc)
  
  Call wTreeView.DblClickItem(BackBalanceSheetAcc.folderDirect)
      
  If p1.WaitVBObject("frmAsUstPar",3000).Exists Then
      
      ' Հաշվային պլանի համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "COANUM", "^A[Del]" & BackBalanceSheetAcc.accChartNum )
      ' Հ/Պ ետհաշվեկշռային հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NBALACC", BackBalanceSheetAcc.balAcc )
      ' Հաշվի շաբլոն դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NBACCMASK", BackBalanceSheetAcc.accMAsk )
      ' Արժույթ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NBACCCUR", BackBalanceSheetAcc.accCur )
      ' Հաշվի տիպ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NBACCTYPE", BackBalanceSheetAcc.accType )
      ' Հաշվի անվանում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCNAME", BackBalanceSheetAcc.accName )
      ' Հաճախորդի անվանում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CLNAME", BackBalanceSheetAcc.clName )
      ' Հաճախորդ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CLICOD", BackBalanceSheetAcc.clCode )
      ' Ցույց տալ մնացորդի սահմանները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWLIMITS",  BackBalanceSheetAcc.showLimits)
      ' Ցույց տալ հաճախորդների հատկանիշները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWCLI", BackBalanceSheetAcc.showCli )
      ' Հին հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "OLDACCMASK", BackBalanceSheetAcc.oldAccMask )
      ' Նոր հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NEWACCMASK", BackBalanceSheetAcc.newAccMask )
      ' Նշում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NBNOTE", BackBalanceSheetAcc.accNote )
      ' Նշում 2  դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NBNOTE2", BackBalanceSheetAcc.accNote2 )
      ' Նշում 3  դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "NBNOTE3", BackBalanceSheetAcc.accNote3 )
      ' Բացման ամսաթիվ սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DATOTKN",BackBalanceSheetAcc.opDate  )
      ' Փակման ամսաթիվ ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DATOTKK", BackBalanceSheetAcc.endOpDAte )
      ' Գրասնեյակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSBRANCH", BackBalanceSheetAcc.acsBranch )
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSDEPART", BackBalanceSheetAcc.acsDepart )
      ' Հասան-ն տիպ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSTYPE", BackBalanceSheetAcc.acsType )
      ' Դիտելու ձև դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SELECTED_VIEW", "^A[Del]" & BackBalanceSheetAcc.selectView )
      ' Լրացնել դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EXPORT_EXCEL", "^A[Del]" & BackBalanceSheetAcc.exportExcel )
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)
  Else
      Log.Error("Ետհաշվեկշռային հաշիվներ դիալոգը չի բացվել")
  End If
End Sub
