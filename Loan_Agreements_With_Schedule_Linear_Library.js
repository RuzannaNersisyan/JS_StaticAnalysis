'USEUNIT Library_Common
'USEUNIT Library_Contracts
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Constants

'--------------------------------------------------------------------------------------
'Գրաֆիկով վարկային պայմանագրիր(Գծային) փաստաթղթի լրացում
'--------------------------------------------------------------------------------------
'clientCode - Հաճախորդի կոդ դաշտի արժեքը
'tmpl_type - Ձևանմուշի տեսակ դաշտի արժեքը
'curr - Արժույթ դաշտի արժեքը
'accacc - Հաշվարկային հաշիվ դաշտի արժեքը
'summ - Գումար դաշտի լրացում
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
'branch - Ճյուղայնություն դաշտի  արժեքը
'sector -  Ճուղայնություն Նոր դաշտի արժեքը              
'schedule - Շրագիր դաշտի արժեքը
'guarante - Երաշխավորություն դաշտի արժեքը
'district - Մարզ դաշտի արժեքը
'note - Նշում 2 դաշտի արժեքը
'paperCode - Պայմ. թղթային համար դաշտի արժեքը
'fBASE - Փաստաթղթի ISM
'docNumber - Փաստաթղթի համր

Sub Credit_With_Schedule_Linear_Doc_Fill (clientCode, tmpl_type, curr, accacc, summ, dateconcl, dategive, date_arg , _
                                          allWithLimit , date_perm , restore, dateFillType, fadeDate, fadePeriod , _
                                          finishFadeDate, startFadeDate, passDirection, sumDates, sumFill, round, agrIntRate, _
                                          agrIntRatePart, pcnotchoose , pcGrant , pcPenAgr, pcPenPer , part, _
                                          branch, sector,aim, schedule, guarante, district, note, paperCode, fBASE, docNumber)
    
    fBASE = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Պայմանագրի համարի վերագրում փոփոխականին
    Str = GetVBObject ("CODE", wMDIClient.vbObject("frmASDocForm"))
    docNumber = wMDIClient.vbObject("frmASDocForm").vbObject("TabFrame").vbObject(Str).Text
    ' Հաճախորդի կոդ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "CLICOD", clientCode)
    ''Ձևանմուշի տեսակ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "AGRTYPE", tmpl_type)
    ' Արժույթ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "CURRENCY", curr)
    'Հաշվարկային հաշիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "ACCACC", accacc)
    'Գումար դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", summ)
    'Կնքման ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATE", dateconcl)
    'Հատկացման ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATEGIVE", dategive)
    'Մարման ժամկետ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATEAGR", date_arg)
    'Սահմանաչափերով բաշխվող դաշտի լրացում
    If allWithLimit Then
        Call Rekvizit_Fill("Document", 1, "CheckBox", "ALLOCATEWITHLIM", 1)
    End If
    
    'Վարկային գծի գործելու ժամկետ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATELNGEND", date_perm)
    'Վերականգնվող դաշտի լրացում
    If restore Then
        Call Rekvizit_Fill("Document", 1, "CheckBox", "ISREGENERATIVE", 1)
    End If
    
    'Անցում 4.Գրաֆիկի լրացման ձև էջին
    Call GoTo_ChoosedTab(4)
    
    'Ամսաթվերի լրացման ձև դաշտի լրացում
    Call Rekvizit_Fill("Document", 4, "General", "DATESFILLTYPE", dateFillType)
    'Մարումների սկիզբ դաշտի լրացում
    Call Rekvizit_Fill("Document", 4, "General", "AGRMARBEG", startFadeDate)
    'Մարումների վերջ դաշտի լրացում
    Call Rekvizit_Fill("Document", 4, "General", "AGRMARFIN", finishFadeDate)
    'Մարման օրեր դաշտի լրացում
    Call Rekvizit_Fill("Document", 4, "General", "FIXEDDAYS", fadeDate)
    'Պարբերություն դաշտի լրացում
    Call Rekvizit_Fill("Document", 4, "General", "AGRPERIOD", fadePeriod & "[Tab]")
    'Շրջանցման ուղղություն դաշտի լրացում
    Call Rekvizit_Fill("Document", 4, "General", "PASSOVDIRECTION", passDirection)
    'Գումարների ամսաթվերի ընտրություն դաշտի լրացում
    Call Rekvizit_Fill("Document", 4, "General", "SUMSDATESFILLTYPE", sumDates)
    'Գումարների բաշխման ձև դաշտի լրացում
    Call Rekvizit_Fill("Document", 4, "General", "SUMSFILLTYPE", sumFill)
    'Կլորացման աստիճան դաշտի լրացում
    Call Rekvizit_Fill("Document", 4, "General", "FILLROUND", "^A[Del]" & round)
   
    'Անցում 6.Տոկոսներ էջին
    Call GoTo_ChoosedTab(6)
   
    'Վարկի տոկոսադրույք դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "PCAGR", agrIntRate & "[Tab]" & agrIntRatePart)
    'Չօգտ. մասի տոկոսադրույք դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "PCNOCHOOSE", pcnotchoose & "[Tab]" & agrIntRatePart)
    'Սուբսիդավորման տոկոսադրույք դաշտի լրացում
    Call Rekvizit_Fill("Document", 6, "General", "PCGRANT", pcGrant & "[Tab]" & agrIntRatePart)
    
    'Անցում 7.Տույժեր էջին
    Call GoTo_ChoosedTab(7)
    
    'Ժամկետանց գումարի տույժ դաշտի լրացում
    Call Rekvizit_Fill("Document", 7, "General", "PCPENAGR", pcPenAgr & "[Tab]" & part)
    'Ժամկետանց տոկոսի տույժ դաշտի լրացում
    Call Rekvizit_Fill("Document", 7, "General", "PCPENPER", pcPenPer & "[Tab]" & part)

    'Անցում 8.Լրացուցիչ
    Call GoTo_ChoosedTab(8)

    'Ճուղայնություն  դաշտի լրացում
    Call Rekvizit_Fill("Document", 8, "General", "SECTOR", sector)
    'Նպատակ դաշտի լրացում
    Call Rekvizit_Fill("Document", 8, "General", "AIM", aim)
    'Ծրագիր դաշտի լրացում
    Call Rekvizit_Fill("Document", 8, "General", "SCHEDULE", schedule)
    'Երաշխավորություն դաշտի լրացում
    Call Rekvizit_Fill("Document", 8, "General", "GUARANTEE", guarante)
    'Երկիր դաշտի լրացում
    Call Rekvizit_Fill("Document", 8, "General", "COUNTRY", "AM")
    'Մարզ դաշտի լրացում
    Call Rekvizit_Fill("Document", 8, "General", "LRDISTR", district)
    'Մարզ(նոր ՎՌ) դաշտի լրացում
    Call Rekvizit_Fill("Document", 8, "General", "REGION", "010000008")
    'Նշում 2 (վարձավճարի համար) դաշտի լրացում
    Call Rekvizit_Fill("Document", 8, "General", "NOTE2", note)
    'Պայմ. թղթային համար դաշտի լրացում
    Call Rekvizit_Fill("Document", 8, "General", "PPRCODE", paperCode)
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
'ê³ÑÙ³Ý³ã³÷Ç ·ñ³ýÇÏÇ Ýß³Ý³ÏáõÙ ä³ÛÙ³Ý³·ñÇ ÃÕÃ³å³Ý³ÏÇó : üáõÝÏóÇ³Ý  í»ñ³¹³ñÓÝáõÙ ¿ true,
'»Ã» Ù³ñáõÙÝ»ñÇ ·ñ³ýÇÏÁ Ýß³Ý³ÏíáõÙ ¿ , ¨ false ` Ñ³Ï³é³Ï ¹»åùáõÙ :
'--------------------------------------------------------------------------------------
'period - ê³ÑÙ³Ý³ã³÷Ç ·ñ³ýÇÏÇ ä³ñµ»ñáõÃÛáõÝ ¹³ßïÇ ³ñÅ»ù
'summ - ê³ÑÙ³Ý³ã³÷Ç ·ñ³ýÇÏÇ Üí³½»óÙ³Ý ·áõÙ³ñÇ ã³÷Á ¹³ßïÇ ³ñÅ»ùÁ
Function Limit_Schedule(period, summ)
    Dim isExists : isExists = False
    
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_LimitSchedule)
    BuiltIn.Delay(1000)
    
    '²Ùë³Ãí»ñÇ Éñ³óáõÙ ¹³ßïÇ Éñ³óáõÙ
    Str = GetVBObject ("AUTODATELM", wMDIClient.vbObject("frmASDocForm"))
    wMDIClient.vbObject("frmASDocForm").vbObject("TabFrame").vbObject(Str).Click()
    BuiltIn.Delay(1000)
    '²Ùë³Ãí»ñÇ Éñ³óáõÙ ýÇÉïñÇ ä³ñµ»ñáõÃÛáõÝ(³ÙÇë) ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Dialog", 1, "General", "PERIODICITY", period & "[Tab]")
    '²Ùë³Ãí»ñÇ Éñ³óáõÙ ýÇÉïñÇ Üí³½»óÙ³Ý ã³÷Á ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Dialog", 1, "General", "SUMMA", summ)
    '²Ùë³Ãí»ñÇ Éñ³óáõÙ ýÇÉïñÇ Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    
    BuiltIn.Delay(1000) 
    Do Until wMDIClient.vbObject("frmPttel").vbObject("tdbgView").EOF
        If Left(Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Text), 18) = "ê³ÑÙ³Ý³ã³÷Ç ·ñ³ýÇÏ" Then
            isExists = True
            Exit Do
        Else
            Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
        End If
    Loop
    
    Limit_Schedule = isExists
End Function

'--------------------------------------------------------------------------------------
'Չօգտ. մասի պահուստավորում փաստաթղթի լրացում :
'--------------------------------------------------------------------------------------
'dateStart - Չօգտ. մասի պահուստավորում փաստաթղթի ամսաթիվ դաշտի արժեք
Sub FillDoc_Store_UnusedPart(dateStart)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Store & "|" & c_UnusedPartStore)
    
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATE", "!" & "[End]" & "[Del]" & dateStart) 
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------------------
'¸ÇïáõÙ ¨ ËÙµ³·ñáõÙ Ù»ÝÛáõÇó ë³ÑÙ³Ý³ã³÷»ñÇ ù³Ý³ÏÇ ¹ÇïáõÙ : üáõÏóÇ³Ý Ñ³Ù»Ù³ïáõÙ ¿ ëå³ëíáÕ
'ïáÕ»ñÇ ÃÇíÁ ³éÏ³ ïáÕ»ñÇ ù³Ý³ÏÇ Ñ»ï:Ð³ÙÁÝÏÝÙ³Ý ¹»åùáõÙ í»ñ³¹³ñÓÝáõÙ ¿ true, Ñ³Ï³é³Ï ¹»åùáõÙ` false:
'--------------------------------------------------------------------------------------------------
'count - ê³ÑÙ³Ý³ñ³÷»ñÇ ëå³ëíáÕ ù³Ý³Ï
Function Check_Limit_Count(Count)
    Dim isEqual : isEqual = True
     
    BuiltIn.Delay(3000)
 '   Call wMainForm.MainMenu.Click(c_AllActions)
    wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Keys("[X93]")
    Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" & c_Other & "|" & c_Limits)
    BuiltIn.Delay(1000)
    Call Rekvizit_Fill("Dialog", 1, "General", "START", "![End][Del]")
    Call Rekvizit_Fill("Dialog", 1, "General", "END", "![End][Del]")
    Call Rekvizit_Fill("Dialog", 1, "CheckBox", "ONLYCH", 0)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    If wMDIClient.WaitVBObject("frmPttel_2", delay_small).Exists Then
        If wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").VisibleRows <> Count Then
            isEqual = False
        End If
    End If
    
    Check_Limit_Count = isEqual   
End Function

'--------------------------------------------------------------------------------------------------
'Վարկային գծի դադարեցում/ վերականգնում փաստաթղթի լրացում :
'-------------------------------------------------------------------------------------------------
'data- Վարկային գծի դադարեցում/վերականգնման ամսաթիվ դաշտի արժեք
'status - Վարկային գծի կարգավիճակ դաշտի արժեք                                       
Sub Credit_Line_Stop_Recovery_DocFill(data, status)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    If status = "1" Then
        Call wMainForm.PopupMenu.Click(c_TermsStates & "|" & c_StopLine)
    Else
        Call wMainForm.PopupMenu.Click(c_TermsStates & "|" & c_RecLine)
    End If
    BuiltIn.Delay(1000)
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATE", "^A[Del]" & data)
    'Վարկային գծի կարգավիճակ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "LNBR", status)
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub