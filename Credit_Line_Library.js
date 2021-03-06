'USEUNIT Library_Common
'USEUNIT Library_Contracts
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Constants
'--------------------------------------------------------------------------------------
' Միանգամյա վարկ փաստաթղթի լրացում
'--------------------------------------------------------------------------------------
'clientCode - Հաճախորդի կոդ դաշտի արժեքը
'tmpl_type - Ձևանմուշի տեսակ դաշտի արժեքը
'curr - Արժույթ դաշտի արժեքը
'accacc - Հաշվարկային հաշիվ դաշտի արժեքը
'summ - Գումար դաշտի լրացում
'AutoCap - Կպիտալացվող նշիչի լրացում
'date_arg - Մարման ժամկետ դաշտի արժեքը
'dateFillType -Ամսաթվերի լրացման ձև դաշտի արժեքը
'fadeDate - Մարումների ամսաթվեր դաշտի արժեքը
'fadePeriod - Պարբերություն դաշտի արժեքը
'finishFadeDate -  Մարումների վերջ դաշտի արժեքը
'passDirection - Շրջանցման ուղղություն դաշտի արժեքը
'sumDates - Գումարների ամսաթվերի ընտրություն դաշտի արժեքը
'sumFill -  Գումարների բաշխման ձև դաշտի արժեքը
'agrIntRate - Վարկի տոկոսադրույք դաշտի արժեքը
'agrIntRatePart - Բաժ. դաշտի արժեքը
'pcnotchoose -  Չօգտ. մասի տոկոսադրույք դաշտի արժեքը
'pcGrant - Սուբսիդավորման տոկոսադրույք դաշտի արժեքը
'pcPenAgr - Ժամկետանց գումարի տույժ դաշտի արժեքը .
'pcPenPer  Ժամկետանց տոկոսի տույժ դաշտի արժեքը
'part - Բաժին դաշտի արժեքը
'sector -  Ճուղայնություն Նոր դաշտի արժեքը
'UsageField - Օգտագործման ոլորտ(նոր ՎՌ)
'schedule - Շրագիր դաշտի արժեքը
'guarante - Երաշխավորություն դաշտի արժեքը
'district - Մարզ դաշտի արժեքը
'note - Նշում 2 դաշտի արժեքը
'paperCode - Պայմ. թղթային համար դաշտի արժեքը
'Time - Գործարքի ժամանակ
'fBASE - Փաստաթղթի ISM
'docNumber - Փաստաթղթի համար                  
Sub Credit_Line_Doc_Fill (clientCode, curr, accacc, summ,restore, AutoCap, dateconcl, agrIntRate, agrIntRatePart, pcPenAgr, _
                          part, dateGive , finishFadeDate ,  perMonth , passDirection, _
                          sector, UsageField, Aim, schedule, guarante, district,_
                          note, paperCode, Time, fBASE, docNumber)
    Dim Str
    
    'ISN-ի վերագրում փոփոխականի
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
    'Վերականգնվող դաշտի լրացում
    If restore Then
        Call Rekvizit_Fill("Document", 1, "CheckBox", "ISREGENERATIVE", 1)
    End If  
    'Կապիտալացվող նշիչի լրացում
    If AutoCap Then
        Call Rekvizit_Fill("Document", 1, "CheckBox", "AUTOCAP", 1)
    End If
    'Կնքման ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATE", dateconcl)
    
    'Անցում 3.Տոկոսներ էջին
    Call GoTo_ChoosedTab(3)
    
    'Վարկի տոկոսադրույք դաշտի լրացում
    Call Rekvizit_Fill("Document", 3, "General", "PCAGR", agrIntRate & "[Tab]" & agrIntRatePart)

    'Անցում 4.Տույժեր էջին
    Call GoTo_ChoosedTab(4)
    
    'Ժամկետանց գումարի տույժ դաշտի լրացում
    Call Rekvizit_Fill("Document", 4, "General", "PCPENAGR", pcPenAgr & "[Tab]" & part)
    
    'Անցում 5.Ժամկետներ էջին
    Call GoTo_ChoosedTab(5)
    
    'Հատկացման ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 5, "General", "DATEGIVE", dateGive)
    'Մարման ժամկետ դաշտի լրացում
    Call Rekvizit_Fill("Document", 5, "General", "DATEAGR", finishFadeDate)
    'Ամսաթվերի լրացում դաշտի նշում
    Str = GetVBObject ("AUTODATE", wMDIClient.vbObject("frmASDocForm"))
    wMDIClient.vbObject("frmASDocForm").vbObject("TabFrame_5").vbObject(Str).Click()
    'Ամսաթվերի լրացում նշիչը դնելուց բացված "Ամսաթվերի լրացում" դիալոգի լրացում
    'Պարբերություն (ամիս) դաշտի լրացում
    Call Rekvizit_Fill("Dialog", 1, "General", "PERIODICITY", perMonth & "[Tab]")
    BuiltIn.Delay(1000)
    'Շրջանցման ուղղություն դաշտի լրացում
    Call Rekvizit_Fill("Dialog", 1, "General", "PASSOVDIRECTION", passDirection)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
     
    'Անցում 6.Լրացուցիչ
    Call GoTo_ChoosedTab(6)

  ' Ճուղայնություն  դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "SECTOR", sector)
    'Օգտագործման ոլորտ(նոր ՎՌ)
    Call Rekvizit_Fill("Document", 6, "General", "USAGEFIELD", UsageField)
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
    'Մարզ(նոր ՎՌ) դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "REGION", "010000008")
    'Նշում 2 (վարձավճարի համար) դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "NOTE2", note)
    'Պայմ. թղթային համար դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "PPRCODE", paperCode)
    'Գործարքի ժամանակ դաշտի լրացում 
    Call Rekvizit_Fill("Document", 6, "General", "TIMEOP", Time)
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
' îáÏáëÝ»ñÇ Ï³åÇï³É³óáõÙ ÷³ëï³ÃÕÃÇ Éñ³óáõÙ
'--------------------------------------------------------------------------------------
Sub Percent_Capitalization(fCaptISN , data , summ)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Interests & "|" & c_PercCapital)
    'ö³ëï³ÃÕÃÇ ISN-Ç í»ñ³·ñáõÙ ÷á÷áË³Ï³ÝÇÝ 
    fCaptISN = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    '²Ùë³ÃÇí ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 1, "General", "DATE", data)
    '¶áõÙ³ñ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", summ)
    'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ 
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
' Սահմանաչափ  փաստաթղթի լրացում
'--------------------------------------------------------------------------------------
Function Change_Limit(data , summ)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_TermsStates & "|" & c_Other & "|" & c_Limit)
    BuiltIn.Delay(1000)
    Change_Limit = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATE", data) 
    'Սահմանաչափ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", summ) 
    'Կատարել կոճակի սեղմում 
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Function
