'USEUNIT Library_Common
'USEUNIT Library_Contracts
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library

'--------------------------------------------------------------------------------------
'Միանգամյա վարկ պայմանագրի լրացում
'--------------------------------------------------------------------------------------
'clientCode - Հաճախորդի կոդ դաշտի արժեքը
'tmpl_type - Ձևանմուշի տեսակ դաշտի արժեքը
'curr - Արժույթ դաշտի արժեքը
'accacc - Հաշվարկային հաշիվ դաշտի արժեքը
'summ - Գումար դաշտի լրացում
'dateconcl - Կնքման ամսաթիվ դաշտի արժեքը
'agrIntRate - Վարկի տոկոսադրույք դաշտի արժեքը
'agrIntRatePart - Բաժ. դաշտի արժեքը
'part - Բաժին դաշտի արժեքը (Տույժեր էջի)
'dateGive - Հատկացման ամսաթիվ դաշտի արժեքը
'finishFadeDate - Մարման ժամկետ դաշտի արժեքը
'constPer - true արժեքի դեպքում սեղմվում է հաստատագրված տոկոսագումարներ կոճակը
'perMonth - "Ամսավերի լրացում" ֆիլտրի պարբերություն դաշտի արժեքը
'passDirection - "Ամսաթվերի լրացում" ֆիլտրի շրջանցման ուղղություն դաշտի արժեքը
'branch - Ճյուղայնություն դաշտի  արժեքը
'sector -  Ճուղայնություն Նոր դաշտի արժեքը
'schedule - Շրագիր դաշտի արժեքը
'guarante - Երաշխավորություն դաշտի արժեքը
'district - Մարզ դաշտի արժեքը
'paperCode - Պայմ. թղթային համար դաշտի արժեքը
'fBASE - Փաստաթղթի ISM
'docNumber - Փաստաթղթի համր
Sub One_Time_Credit_Doc_Fill (clientCode, tmpl_type, curr, accacc, summ, dateconcl, agrIntRate, agrIntRatePart, pcPenAgr, _
                              part, dateGive , finishFadeDate , constPer, perMonth , passDirection, _
                              branch, sector, Aim, schedule, guarante, district, note, paperCode, fBASE, docNumber)
    
    'ISN-ի վերագրում փոփոխականին
    fBASE = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Պայմանագրի համարի վերագրում փոփոխականին
    Str = GetVBObject ("CODE", wMDIClient.vbObject("frmASDocForm"))
    docNumber = wMDIClient.vbObject("frmASDocForm").vbObject("TabFrame").vbObject(Str).Text
    ' Հաճախորդի կոդ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "CLICOD", clientCode)
    ' Արժույթ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "CURRENCY", curr)
    'Հաշվարկային հաշիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "ACCACC", accacc)
    'Գումար դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", summ)
    'Կնքման ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATE", dateconcl)
    
    'Անցում 3.Տոկոսներ էջին
    Call GoTo_ChoosedTab(3)
    
    'Վարկի տոկոսադրույք դաշտի լրացում
    Call Rekvizit_Fill("Document", 3, "General", "PCAGR", agrIntRate & "[Tab]" & agrIntRatePart)
'    'Բաժ. դաշտի լրացում
'    wMDIClient.vbObject("frmASDocForm").vbObject("TabFrame_3").vbObject("AsCourse").vbObject("TDBNumber2").Keys(agrIntRatePart & "[Tab]")
   
    'Անցում 4.Տույժեր էջին
    Call GoTo_ChoosedTab(4)
    
    'Ժամկետանց գումարի տույժ դաշտի լրացում
    Call Rekvizit_Fill("Document", 4, "General", "PCPENAGR", pcPenAgr & "[Tab]" & part)
'    'բաժ. դաշտի լրացում
'    wMDIClient.vbObject("frmASDocForm").vbObject("TabFrame_4").vbObject("AsCourse_3").vbObject("TDBNumber2").Keys(part & "[Tab]")
    
    'Անցում 5.Ժամկետներ էջին
    Call GoTo_ChoosedTab(5)
    
    'Հատկացման ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 5, "General", "DATEGIVE", dateGive)
    'Մարման ժամկետ դաշտի լրացում
    Call Rekvizit_Fill("Document", 5, "General", "DATEAGR", finishFadeDate)
    'Հաստատագրված տոկոսագումարների նշում
    If constPer Then
        Call Rekvizit_Fill("Document", 5, "CheckBox", "CONSTPER", 1)
    End If
    'Ամսաթվերի լրացում դաշտի նշում
    Str = GetVBObject ("AUTODATE", wMDIClient.vbObject("frmASDocForm"))
    wMDIClient.vbObject("frmASDocForm").vbObject("TabFrame_5").vbObject(Str).Click()
    'Ամսաթվերի լրացում նշիչը դնելուց բացված "Ամսաթվերի լրացում" դիալոգի լրացում
    'Պարբերություն (ամիս) դաշտի լրացում
    Call Rekvizit_Fill("Dialog", 1, "General", "PERIODICITY", perMonth & "[Tab]")
    'Շրջանցման ուղղություն դաշտի լրացում
    Call Rekvizit_Fill("Dialog", 1, "General", "PASSOVDIRECTION", passDirection)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    'Անցում 6.Լրացուցիչ
    Call GoTo_ChoosedTab(6)
    
    ' Ճուղայնություն Նոր դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "SECTOR", sector)
    'Նպատակ դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "AIM", Aim)
    'Ծրագիր դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "SCHEDULE", schedule)
    'Երաշխավորություն դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "GUARANTEE", guarante)
    'Երկիր դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "COUNTRY", "AM")
    'Մարզ դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "LRDISTR", district)
    'Մարզ(Նոր ՎՌ) դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "REGION", "010000008")
    'Նշում 2 (վարձավճարի համար) դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "NOTE2", note)
    'Պայմ. թղթային համար դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "PPRCODE", paperCode)
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub