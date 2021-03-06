'USEUNIT Library_Common
'USEUNIT Library_Contracts
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Constants
'USEUNIT Mortgage_Library

'--------------------------------------------------------------------------------------
'Գրաֆիկով վարկային պայմանագրի լրացում
'--------------------------------------------------------------------------------------
'clientCode - Հաճախորդի կոդ դաշտի արժեքը
'tmpl_type - Ձևանմուշի տեսակ դաշտի արժեքը
'curr - Արժույթ դաշտի արժեքը
'accacc - Հաշվարկային հաշիվ դաշտի արժեքը
'summ - Գումար դաշտի լրացում
'date_arg - Մարման ժամկետ դաշտի արժեքը
'dateFillType -Ամսաթվերի լրացման ձև դաշտի արժեքը
'fadeDate - Մարումների ամսաթվեր դաշտի արժեքը
'finishFadeDate -  Մարումների վերջ դաշտի արժեքը
'passDirection - Շրջանցման ուղղություն դաշտի արժեքը
'sumDates - Գումարների ամսաթվերի ընտրություն դաշտի արժեքը
'sumFill -  Գումարների բաշխման ձև դաշտի արժեքը
'agrIntRate - Վարկի տոկոսադրույք դաշտի արժեքը
'agrIntRatePart - Բաժ. դաշտի արժեքը
'branch - Ճյուղայնություն դաշտի  արժեքը
'sector -  Ճուղայնություն Նոր դաշտի արժեքը
'aim - Նպատակ դաշտի արժեք
'schedule - Շրագիր դաշտի արժեքը
'guarante - Երաշխավորություն դաշտի արժեքը
'district - Մարզ դաշտի արժեքը
'paperCode - Պայմ. թղթային համար դաշտի արժեքը
'fBASE - Փաստաթղթի ISM
'docNumber - Փաստաթղթի համր
Sub Credit_With_Schedule_Doc_Fill (clientCode, tmpl_type, curr, accacc, summ, dateconcl, dategive, date_arg, dateFillType, fadeDate, _
                                   finishFadeDate, startFadeDate, passDirection, sumDates, sumFill, round, agrIntRate, _
                                   agrIntRatePart, pcnotchoose , pcGrant , pcPenAgr, pcPenPer , part, _
                                   branch, sector, aim, schedule, guarante, district, note, paperCode, fBASE, docNumber)
    
  If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
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

    'Անցում 7.Տույժեր էջին
    Call GoTo_ChoosedTab(7)
    'Ժամկետանց գումարի տույժ դաշտի լրացում
    Call Rekvizit_Fill("Document", 7, "General", "PCPENAGR", pcPenAgr & "[Tab]" & part)
    'Ժամկետանց տոկոսի տույժ դաշտի լրացում
    Call Rekvizit_Fill("Document", 7, "General", "PCPENPER", pcPenPer & "[Tab]" & part)
    
    'Անցում 8.Լրացուցիչ
    Call GoTo_ChoosedTab(8)
    ' Ճուղայնություն Նոր դաշտի լրացում
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
    'Մարզ(Նոր ՎՌ) դաշտի լրացում
    Call Rekvizit_Fill("Document", 8, "General", "REGION", "010000008")
    'Նշում 2 (վարձավճարի համար) դաշտի լրացում
    Call Rekvizit_Fill("Document", 8, "General", "NOTE2", note)
    'Պայմ. թղթային համար դաշտի լրացում
    Call Rekvizit_Fill("Document", 8, "General", "PPRCODE", paperCode)
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É")
  Else 
    Log.Error "Can't open frmASDocForm window", "", pmNormal, ErrorColor
  End If
End Sub

'--------------------------------------------------------------------------------------
'üáõÝÏóÇ³Ý Ñ³Ù»Ù³ïáõÙ ¿ Ø³ñÙ³Ý ·ñ³ýÇÏÇ "ÁÝ¹Ñ³Ýáõñ ·áõÙ³ñ" ¨ "ÁÝ¹Ñ³Ýáõñ ïáÏáë" ³ñÅ»ùÝ»ñÁ
'÷áË³Ýóí³Í ³ñÅ»ùÝ»ñÇ Ñ»ï: ì»ñ³¹³ñÓÝáõÙ ¿ true  Ñ³ÙÁÝÏÝÙ³Ý ¹»åùáõÙ ¨ false ` Ñ³Ï³é³Ï ¹»åùáõÙ :
'--------------------------------------------------------------------------------------
'summa - ¶áõÙ³ñÇ ³ñÅ»ùÁ
'percent - îáÏë³·áõÙ³ñÇ ³ñÅ»ù
Function Compare_FadeSchedule_Values (summa, percent, newSchedule)
  Dim isEqual : isEqual = False
    
  If newSchedule Then
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_View)
  End If
    
  With wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.Grid("DATES")
    Log.Message .FooterText(3)     
    If percent = Trim(.FooterText(3)) Then
      If summa = Trim(.FooterText(2)) Then
        isEqual = True
      End If
    End If        
  End With
    
  wMDIClient.vbObject("frmASDocForm").vbObject("CmdCancel").Click()
  Compare_FadeSchedule_Values = isEqual
End Function


'--------------------------------------------------------------------------------------
'¶ñ³íÇ å³ÛÙ³Ý³·ñÇñ` ³ÛÉ ·ñ³í ÷³ëï³ÃÕÃÇ  Éñ³óáõÙ :
'--------------------------------------------------------------------------------------
'agrType - 'ä³ÛÙ³Ý³·ñÇ ïÇå ¹³ßïÇ ³ñÅ»ùÁ
'curr - ²ñÅáõÛÃ ¹³ßïÇ ³ñÅ»ùÁ
'summ -  ¶ñ³íÇ ³ñÅ»ùÁ ¹³ßïÇ ³ñÅ»ùÁ
'count - ø³Ý³Ï ¹³ßïÇ ³ñÅ»ùÁ
'dateGive  - Ð³ïÏ³óÙ³Ý ³Ùë³ÃÇí ¹³ßïÇ ³ñÅ»ùÁ
'place - ¶ñ³íÇ ·ïÝí»Éáõ í³Ûñ ¹³ßïÇ ³ñÅ»ùÁ
'safety - ²å³Ñáíí³ÍáõÃÛáõÝ ¹³ßïÇ ³ñÅ»ùÁ
'paperCode - ä³ÛÙ. ÃÕÃ³ÛÇÝ N ¹³ßïÇ ³ñÅ»ùÁ
Sub Other_Mortgage_Fill (agrType, curr, summ, Count, dateconcl, dateGive, place, safety, paperCode, docN)

    fBASE = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'ä³ÛÙ³Ý³·ñÇ Ñ³Ù³ñÇ í»ñ³·ñáõÙ ÷á÷áË³Ï³ÝÇÝ
    docN = Get_Rekvizit_Value("Document", 1, "General", "CODE")
    'ä³ÛÙ³Ý³·ñÇ ïÇå ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 1, "General", "SECTYPE", agrType)
    ' ²ñÅáõÛÃ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 1, "General", "CURRENCY", curr)
    '¶ñ³íÇ ³ñÅ»ùÁ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", summ)
    'ø³Ý³Ï ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 1, "General", "COUNT", Count)
    'ÎÝùÙ³Ý ³Ùë³ÃÇí ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 1, "General", "DATE", dateconcl)
    'Ð³ïÏ³óÙ³Ý ³Ùë³ÃÇí ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 1, "General", "DATEGIVE", dateGive)

    '¶ñ³íÇ ·ïÝí»Éáõ í³Ûñ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 2, "General", "PLACE", place)
    
    '¶ñ³íÇ ³é³ñÏ³ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 3, "General", "MORTSUBJECT", "0")
    'ä³ÛÙ. ÃÕÃ³ÛÇÝ Ñ³Ù³ñ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 3, "General", "PPRCODE", paperCode)
    'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
'¶ñ³íÇ å³ÛÙ³Ý³·ñÇñ` ³ÛÉ ·ñ³í ÷³ëï³ÃÕÃÇ  ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ ³å³Ñáíí³ÍáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñÇ
' Ñ³ëï³ïí³Õ ÷³ëï³ÃÕÃ»ñ ÃÕÃ³å³Ý³ÏáõÙ :
'--------------------------------------------------------------------------------------
'docNumber - ö³ëï³ÃÕÃÇ Ñ³Ù³ñ
Function Check_Doc_In_SafetyDocs_Verify_Folder(docNumber)
    Dim is_exists : is_exists = False
    
    Call wTreeView.DblClickItem("|²å³Ñáíí³ÍáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñ|ä³ÛÙ³Ý³·ñ»ñ|êï³óí³Í ·ñ³í|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    If wMDIClient.WaitVBObject("frmPttel", 3000).Exists Then
        Do Until wMDIClient.vbObject("frmPttel").vbObject("tdbgView").EOF
            If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(2).Text) = Trim(docNumber) Then
                is_exists = True
                Exit Do
            Else
                Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
            End If
        Loop
    Else
        Log.Error "The double input frmPttel does't exist"
    End If
    
    Check_Doc_In_SafetyDocs_Verify_Folder = is_exists
End Function

'--------------------------------------------------------------------------------------
'¶ñ³íÇ å³ÛÙ³Ý³·ñÇñ` ³ÛÉ ·ñ³í ÷³ëï³ÃÕÃÇ ÷³ÏáõÙ ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ:
'--------------------------------------------------------------------------------------
'docNumber - ö³ëï³ÃÕÃÇ Ñ³Ù³ñ
Sub Close_Mortage(docNumber)
    Dim is_exists : is_exists = False
    
    Call wTreeView.DblClickItem("|²å³Ñáíí³ÍáõÃÛ³Ý å³ÛÙ³Ý³·ñ»ñ|ä³ÛÙ³Ý³·ñ»ñ|êï³óí³Í ·ñ³í|ä³ÛÙ³Ý³·ñ»ñ")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    If  wMDIClient.WaitVBObject("frmPttel", 3000).Exists Then
        Do Until wMDIClient.vbObject("frmPttel").vbObject("tdbgView").EOF
            If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(0).Text) = Trim(docNumber) Then
                is_exists = True
                Exit Do
            Else
                Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
            End If
        Loop
    Else
        Log.Message("Documents frmPttel does't exist")
    End If
    
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrClose)
    BuiltIn.Delay(1000)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
'Գրաֆիկի վերանայում փաստաթղթի լրացում :
'--------------------------------------------------------------------------------------
'dateStart - Գրաֆիկի վերանայում փաստաթղթի ամսաթիվ դաշտի արժեք
'dateEnd - Մարման ժամկետ դաշտի արժեք
Sub Fading_Schedule_Fill(dateStart, dateEnd, mainSumma)   
  Dim Str
    
  BuiltIn.Delay(3000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_TermsStates & "|" & c_Dates & "|" & c_ReviewSchedule)
    
  If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
    ' Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATE", dateStart) 
    If wMDIClient.VBObject("frmASDocForm").WaitVBObject("AS_LABELDATEAGR", 1000).Exists Then
      'Մարման ժամկետ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "DATEAGR", dateEnd) 
    End If  
    'Ընթացիկ գրաֆիկի պատճ.
    Str = GetVBObject ("AUTODATEUN", wMDIClient.vbObject("frmASDocForm"))
    wMDIClient.vbObject("frmASDocForm").vbObject("TabFrame").vbObject(Str).click()
    If p1.WaitVBObject("frmAsUstPar", 2000).Exists Then
      Call Rekvizit_Fill("Dialog", 1, "General", "SUMTOT", mainSumma)
      Call ClickCmdButton(2, "Î³ï³ñ»É")
    Else
      Log.Error "Can't open frmAsUstPar window", "", pmNormal, ErrorColor
    End If
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É")
  Else
    Log.Error "Can't open frmASDocForm window", "", pmNormal, ErrorColor
  End If
End Sub

'--------------------------------------------------------------------------------------
'Արդյունավետ տոկոսադրույք փաստաթղթի լրացում :
'--------------------------------------------------------------------------------------
'dateStart - Արդյունավետ տոկոսադրույք փաստաթղթի ամսաթիվ դաշտի արժեք
'effIntRate - Արդյունավետ տոկոսադրույք դաշտի արժեք
'actIntRate - Փաստացի տոսադրույք դաշտի արժեք
Sub Effective_InterestRate_DocFill (dateStart, effIntRate, actIntRate)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_TermsStates & "|" & c_Percentages & "|" & c_EffRate)
    BuiltIn.Delay(1000)
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","DATE",dateStart)
    'Արդյունավետ տոկոսադրույք դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","PCNDER",effIntRate)
    'Փաստացի տոկոսադրույք դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","PCNDERALL",actIntRate)
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
' Բանկի արդյունավետ տոկոսադրույք փաստաթղթի լրացում :
'--------------------------------------------------------------------------------------
'dateStart - Բանկի արդյունավետ տոկոսադրույք փաստաթղթի ամսաթիվ դաշտի արժեք
'effIntRate - Արդյունավետ տոկոսադրույք դաշտի արժեք
Sub BankEffective_InterestRate_DocFill (dateStart, effIntRate)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_TermsStates & "|" & c_Percentages & "|" & c_BankEffRate)
    BuiltIn.Delay(1000)
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATE", dateStart)
    'Արդյունավետ տոկոսադրույք դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "PCEFF", effIntRate)
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
' Սուբսիդավորման տոկոսադրույք փաստաթղթի լրացում :
'--------------------------------------------------------------------------------------
'Date - Ամսաթիվ դաշտի արժեք
'SubsidyRate - Սուբսիդավորման տոկոսադրույք դաշտի արժեք
Function SubsidyRate_DocFill (Date, SubsidyRate)
    Dim wMainForm, calcPRBase
				
    Set wMainForm = Sys.Process("Asbank").VBObject("MainForm") 
    Set wMDIClient = wMainForm.Window("MDIClient", "", 1) 
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_TermsStates & "|" & c_Percentages & "|" & c_SubsidyRate)
				'ISN-ի վերագրում փոփոխականին
		  calcPRBase = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATE", Date)
    'Սուբսիդավորման  տոկոսադրույք/բաժ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "PCGRANT", SubsidyRate & "[Tab]" & 365)
    'Կատարել կոճակի սեղմում
    wMDIClient.vbObject("frmASDocForm").vbObject("CmdOk_2").Click()
				
    SubsidyRate_DocFill = calcPRBase
End Function

'--------------------------------------------------------------------------------------
' Î³ÝË³í í×³ñí³Í ïáÏáëÝ»ñÇ í»ñ³¹³ñÓ ÷³ëïÃÕÃÇ Éñ³óáõÙ :
'--------------------------------------------------------------------------------------
'dateStart - Î³ÝË³í í×³ñí³Í ïáÏáëÝ»ñÇ í»ñ³¹³ñÓ ÷³ëï³ÃÕÃÇ ³Ùë³ÃÇí ¹³ßïÇ ³ñÅ»ù
'summ - ¶áõÙ³ñ ¹³ßïÇ ³ñÅ»ù
'rpBase - ö³ëï³ÃÕÃÇ ISN
'moneyAcc - »Ã» ³ñÅ»ùÁ false ¿, ³å³ Éñ³óíáõÙ ¿ Ð³ßÇí ¹³ßïÁ »Ã» true ¸ñ³Ù³ÛÇÝ Ð³ßÇíÁ
Sub Return_Payed_Percents(dateStart, summ, cashORno,acc, rpBase, moneyAcc)
    
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_ReturnPrepaidInt)
    
    rpBase = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    '²Ùë³ÃÇí ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 1, "General", "DATE", "!" & "[End]" & "[Del]" & dateStart)
    '¶áõÙ³ñ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 1, "General", "SUMMA", summ)
    'Î³ÝËÇÏ/²ÝÏ³ÝËÇÏ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 1, "General", "CASHORNO", cashORno)   
    if moneyAcc then 
      '¸ñ³Ù³ÛÇÝ Ð³ßÇí ¹³ßïÇ Éñ³óáõÙ
      Call Rekvizit_Fill("Document", 1, "General", "AMDACCCORR", acc)
    else 
      'Ð³ßÇí ¹³ßïÇ Éñ³óáõÙ
      Call Rekvizit_Fill("Document", 1, "General", "ACCCORR", acc)
    end if
    
    If p1.WaitVBObject("frmAsMsgBox",1000).Exists Then
        Call ClickCmdButton(5, "Î³ï³ñ»É")
    End If
    
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    Call ClickCmdButton(5, "Î³ï³ñ»É")
    Call ClickCmdButton(5, "²Ûá")
    BuiltIn.Delay(3000)
    
End Sub

'--------------------------------------------------------------------------------------
' ì³ñÏÇ ·áõÙ³ñÇ Ù³ñáõÙ ïáÏáëÝ»ñÇ Ñ³ßíÇÝ ÷³ëïÃÕÃÇ Éñ³óáõÙ :
'--------------------------------------------------------------------------------------
'dateStart - ì³ñÏÇ ·áõÙ³ñÇ Ù³ñáõÙ ïáÏáëÝ»ñÇ Ñ³ßíÇÝ ÷³ëï³ÃÕÃÇ ³Ùë³ÃÇí ¹³ßïÇ ³ñÅ»ù
'summ - ¶áõÙ³ñ ¹³ßïÇ ³ñÅ»ù
Sub Fadeing_CreditSumma_From_PayedPercents(dateStart, summ)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_FadeLoanFromPercent)
    
    '²Ùë³ÃÇí ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 1, "General", "DATE", "!" & "[End]" & "[Del]" & dateStart)
    
    '¶áõÙ³ñ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document", 1, "General", "SUMPAY", "!" & "[End]" & "[Del]" & summ)
    
    'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    Call ClickCmdButton(5, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
'èÇëÏÇ ¹³ëÇã ¨ å³Ñáõëï³íáñÙ³Ý ïáÏáë ÷³ëïÃÕÃÇ Éñ³óáõÙ :
'--------------------------------------------------------------------------------------
'dateStart - èÇëÏÇ ¹³ëÇã ¨ å³Ñáõëï³íáñáõÙ ÷³ëï³ÃÕÃÇ ³Ùë³ÃÇí ¹³ßïÇ ³ñÅ»ù
'risk - èÇëÏÇ ¹³ßÇã ¹³ßïÇ ³ñ»Åù
'perc - ä³Ñáõëïá³íáñáõÙ ¹³ßïÇ ³ñÅ»ù

Function FillDoc_Risk_Classifier(dateStart, risk, perc)
				
    Builtin.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_TermsStates & "|" & c_Risking & "|" & c_RiskCatPerRes)
    Builtin.Delay(2000)
		
    'ISN-ի վերագրում փոփոխականին
		FillDoc_Risk_Classifier = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
    '²Ùë³ÃÇí ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" & dateStart)
    'èÇëÏÇ ¹³ëÇã ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document",1,"General","RISK", risk)
    'ä³Ñáõëï³íáñÙ³Ý ïáÏáë ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document",1,"General","PERRES", perc)
    
    'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Function

'--------------------------------------------------------------------------------------
'Պահուստավորում փաստաթղթի լրացում :
'--------------------------------------------------------------------------------------
'dateStart - Պահուստավորում փաստաթղթի ամսաթիվ դաշտի արժեք

Sub FillDoc_Store(dateStart,fBASE)
    
    BuiltIn.Delay(1500)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Store & "|" & c_Store)
    BuiltIn.Delay(1500)
    
    'ISN-ի վերագրում փոփոխականին
    fBASE = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "DATE", "^A[Del]" & dateStart)
    
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É") 
End Sub

'--------------------------------------------------------------------------------------
'¹áõñë ·ñáõÙ ÷³ëï³ÃÕÃÇ Éñ³óáõÙ :
'--------------------------------------------------------------------------------------
'dateStart - ¸áõñë ·ñáõÙ ÷³ëï³ÃÕÃÇ ³Ùë³ÃÇí ¹³ßïÇ ³ñÅ»ù
'wrBase - ö³ëï³ÃÕÃÇ ISN
Sub FillDoc_WriteOut(dateStart, wrBase)
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_WriteOff & "|" & c_WriteOff)
    BuiltIn.Delay(2000)
    
    'ISN-ի վերագրում փոփոխականին
    wrBase = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    '²Ùë³ÃÇí ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document",1, "General","DATE", dateStart)
    
    'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
		Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
'¸áõñë ·ñí³ÍÇ í»ñ³Ï³Ý·ÝáõÙ ¨ Ù³ñáõÙ ÷³ëï³ÃÕÃÇ Éñ³óáõÙ :
'--------------------------------------------------------------------------------------
'dateStart - ¸áõñë ·ñí³ÍÇ í»ñ³Ï³Ý·ÝáõÙ ¨ Ù³ñáõÙ ÷³ëï³ÃÕÃÇ ³Ùë³ÃÇí ¹³ßïÇ ³ñÅ»ù
'fBase1 - ö³ëï³ÃÕÃÇ ISN
Sub FillDoc_RestoreFade(dateStart, mainSum, perSum, fBase1)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_WriteOffRepay)
    BuiltIn.Delay(2000)
    
    fBase1 = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    '²Ùë³ÃÇí ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document",1, "General","DATE", dateStart)
    'ÐÇÙÝ³Ï³Ý ·áõÙ³ñ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document",1, "General","SUMAGR", mainSum)
    'îáÏáë³·áõÙ³ñ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document",1, "General","SUMPER", perSum)
    
    'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    BuiltIn.Delay(1000)
    Call ClickCmdButton(5, "²Ûá")
End Sub

'--------------------------------------------------------------------------------------
'ä³ñïù»ñÇ ½ÇçáõÙ ÷³ëï³ÃÕÃÇ Éñ³óáõÙ :
'--------------------------------------------------------------------------------------
'dateStart - ä³ñïù»ñÇ ½ÇçáõÙ ÷³ëï³ÃÕÃÇ ³Ùë³ÃÇí ¹³ßïÇ ³ñÅ»ù
'summ - ÐÇÙÝ³Ï³Ý ·áõÙ³ñ ¹³ßïÇ ³ñÅ»ù
'yldBase - ö³ëï³ÃÕÃÇ ISN
Sub FillDoc_YieldDebt(dateStart, summ, yldBase)
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_DebtLet)
    BuiltIn.Delay(2000)
    
    yldBase = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    '²Ùë³ÃÇí ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document",1, "General","DATE", dateStart)
    'ÐÇÙÝ³Ï³Ý ·áõÙ³ñ ¹³ßïÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Document",1, "General","SUMAGR", summ)
    
    'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------------------------
'¶áñÍáÕáõÃÛáõÝÝ»ñÇ Ñ»é³óáõÙ Áëï ·áñÍáÕáõÃÛ³Ý ï»ë³ÏÇ :
'--------------------------------------------------------------------------------------
'optype - ¶áñÍáÕáõÃÛáõÝÝ»ñÇ Ñ»é³óáõÙ ýÇÉïñÇ ·áñÍáÕáõÃÛ³Ý ï»ë³Ï ¹³ßïÇ ³ñÅ»ù
'opdate - ¶áñÍáÕáõÃÛ³Ý  ³Ùë³ÃÇí»ñÇ ¹³ßïÇ ³ñÅ»ù
'group - true »Ã» Ñ»é³óíáõÙ ¿ ËÙµ³ÛÇÝ ·áñÍáÕáõÃÛáõÝ
'fdDoc - True »Ã» Ñ»é³óíáõÙ ¿ Å³ÙÏ»ïÇó ßáõï Ï³ï³ñí³Í ·áñÍáÕáõÃÛáõÝ
Sub DeleteOP(optype, opdate, group, fdDoc)
    Dim caption
    
    BuiltIn.Delay(6000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_OpersView)
    BuiltIn.Delay(1000)
    Call Rekvizit_Fill("Dialog", 1, "General","START", "^A[Del]" & opdate)
    Call Rekvizit_Fill("Dialog", 1, "General","END", "^A[Del]" & opdate)
    Call Rekvizit_Fill("Dialog", 1, "General","DEALTYPE", "^A[Del]" & optype)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.Delay(4000)
    Do Until wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").ApproxCount = 0
        BuiltIn.Delay(10000)
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(c_Delete)
        BuiltIn.Delay(2000)
        If group Then
            Call ClickCmdButton(5, "²Ûá")
        End If
        If fdDoc Then
            Call ClickCmdButton(5, "²Ûá")
            Call ClickCmdButton(5, "²Ûá")
        End If
        Call ClickCmdButton(3, "²Ûá")
        if Sys.Process("Asbank").WaitVBObject("frmAsMsgBox", 1000).Exists then 
          caption = Sys.Process("Asbank").VBObject("frmAsMsgBox").VBObject("cmdButton").WndCaption
          Select Case caption
          case "²Ûá"
            Call ClickCmdButton(5, "²Ûá")
          case "Î³ï³ñ»É"
            Call ClickCmdButton(5, "Î³ï³ñ»É")
          End Select 
        end if
        BuiltIn.Delay(2000)
    Loop
    
    BuiltIn.Delay(2000)
    Call Close_Pttel("frmPttel_2")
End Sub

'--------------------------------------------------------------------------------------
'´³ÝÏÇ ³ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛù ÷³ëï³ÃÕÃÇ Ñ»é³óáõÙ :
'----------------------------------------------------------------------------------
Sub Delete_Bank_Effective_IntRate()
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" & c_Percentages & "|" & c_BankEffRate)
    BuiltIn.Delay(2000)
    Call Rekvizit_Fill("Dialog", 1, "General","START", "![End][Del]")
    Call Rekvizit_Fill("Dialog", 1, "General","END", "![End][Del]")
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete)
    BuiltIn.Delay(2000)
    Call ClickCmdButton(3, "²Ûá")
    
    BuiltIn.Delay(2000)
    Call Close_Pttel("frmPttel_2")
End Sub

'--------------------------------------------------------------------------------------
''²ñ¹ÛáõÝ³í»ï ïáÏáë³¹ñáõÛù ÷³ëï³ÃÕÃÇ Ñ»é³óáõÙ
'----------------------------------------------------------------------------------
Sub Delete_Effective_IntRate()
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" & c_Percentages & "|" & c_EffRate)
    BuiltIn.Delay(2000)
    Call Rekvizit_Fill("Dialog", 1, "General","START", "![End][Del]")
    Call Rekvizit_Fill("Dialog", 1, "General","END", "![End][Del]")
    Call Rekvizit_Fill("Dialog", 1, "CheckBox","ONLYCH", 1)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete)
    BuiltIn.Delay(2000)
    Call ClickCmdButton(3, "²Ûá")
    
    BuiltIn.Delay(2000)
    Call Close_Pttel("frmPttel_2")
End Sub

'--------------------------------------------------------------------------------------
'èÇëÏ³ÛÝáõÃÛ³Ý Ýß³Ý³ÏáõÙ ·áñÍáÕáõÃÛ³Ý Ñ»é³óáõÙ
'----------------------------------------------------------------------------------
Sub Delete_Risk_Doc()  
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ViewEdit & "|" &  c_Risking & "|" &  c_RisksPersRes)
    BuiltIn.Delay(1000)
    Call Rekvizit_Fill("Dialog", 1, "General","START", "![End][Del]")
    Call Rekvizit_Fill("Dialog", 1, "General","END", "![End][Del]")
    
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Delete)
    BuiltIn.Delay(1000)

    Sys.Process("Asbank").vbObject("frmDeleteDoc").vbObject("YesButton").click()
    
    BuiltIn.Delay(1000)
    Call Close_Pttel("frmPttel_2")
End Sub