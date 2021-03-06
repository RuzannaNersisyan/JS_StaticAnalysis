'USEUNIT Subsystems_SQL_Library
'USEUNIT  Library_Common
'USEUNIT Constants
'USEUNIT SWIFT_International_Payorder_Library
 Dim securitiesRow
 
' Ստեղծել հաճախորդ
' buttonName - Նշել Ֆիզ. անձ դաշտի արժեք
' fISN - Փասատթղթի ISN
' cliCode - Հաճախորդի կոդ
' jurStat - Իրավաբանական դաշտ
' socialCard - ՀԾՀ/Սոց քարտ
' pasCode - Անձը հաստ. փաստաթ.
' passType - Անձը հաստ. փաստտթ. կոդ տիպ
' passBy - Տրված
' datePass - Տրված ժամանակ
' dateExpire - Վավեր է մինչև
' firstName - Անուն
' lastName - Ազգանուն
' patrName - Հայրանուն
' rezident - Ռեզիդենտություն
' cliNote - Նշում
' todayDMY - Բացման ամսաթիվ
' wName - Անվանում
' wVolort - Գործունեության ոլորտ
' petBuj - Պետական կարգավիճակ
' gender - Սեռ
' citizenship - Քաղաքացիություն
' bidthPlace - Ծննդավայր
' wCountry - Երկիր (գրանցման հասցե)
' wDistrict - Մարզ (գրանցման հասցե)
' wCommunity - Բնակավայր (գրանցման հասցե)
' wCity - Քաղաք (գրանցման հասցե)
' wStreet - Փողոց (գրանցման հասցե)
' buildNum - Տուն/Շենք (գրանցման հասցե)
' wApartment - Բնակարան (գրանցման հասցե)
' wCountry2 - Երկիր (փաստացի հասցե)
' wDistrict2 - Մարզ (փաստացի հասցե)
' wCommunity2 - Բնակավայր (փաստացի հասցե)
' wCity2 - Քաղաք (փաստացի հասցե)
' wStreet2 - Փողոց (փաստացի հասցե)
' buildNum2 - Տուն/Շենք (փաստացի հասցե)
' wApartment2 - Բնակարան (փաստացի հասցե)
' wCheckBox - Քաղվածքի պարբերական տրամադրում
' accStatForm - Հաշվի քաղվածքի տրամադրման ձև
' cardStatForm - Քարտի քաղվածքի տրամադրման ձև
' sencAddress - Քաղվածք/Ծանուցում ուղարկամն հասցե
' stDate - Սկզբի ամասթիվ
' wMonth - Պարբերություն ամիս
' wDay Պարբերություն օր
' fileName, fileName2, fileName3 - բեռնվող ֆայլերի անվանումներ
Sub CheckClient(buttonName, fISN, cliCode, jurStat, socialCard, pasCode, passType, passBy, datePass, dateExpire, firstName, _
                                lastName, patrName, rezident, cliNote, todayDMY, wName, wVolort, petBuj, gender, citizenship, bidthPlace,wCountry,_
                                wCommunity, wCity, wStreet, buildNum, wApartment, wCountry2, wCommunity2, _
                                wCity2, wStreet2, buildNum2, wApartment2, wCheckBox, accStatForm, cardStatForm, sencAddress, _
                                stDate, wMonth, wDay, fileName, fileName2, fileName3)
                
      Dim frmASDocForm, wTabStrip, tabFrame
      Dim rekvNum, param
      
      ' Կատարել բոլոր գործողությունները
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Վավերացնել գործողության կատարում
      Call wMainForm.PopupMenu.Click(c_Add)
      
      If Not Sys.Process("Asbank").WaitVBObject("frmAsUstPar",2000).Exists Then
            Log.Error("Հաճախորդի տիպեր դիալոգը չի բացվել")
            Exit Sub
      End If

      ' Նշել Ֆիզ. անձ ռադիոկոճակը      
      Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("AsRadioButtons").VBObject("Tabframe").VBObject(buttonName).Click
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
      If Not wMDIClient.WaitVBObject("frmASDocForm",15000).Exists  Then
            Log.Error("Հաճախորդ(Նոր) թղթապանակը չի բացվել")
            Exit Sub
      End If
      
      ' Հաճախորդի փաստաթղթի ISN - ի ստացում
      Set frmASDocForm = wMDIClient.VBObject("frmASDocForm")
      fISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN        
      
      Set wTabStrip = frmASDocForm.vbObject("TabStrip")
      
      ' Հաճախորդի կոդի արժեքի ստացում
      cliCode = Get_Rekvizit_Value("Document", 1, "General", "CODE")
          
      ' Իրավաբանական կարգավիճակ դաշտի արժեքի ստացում
      Set tabFrame = frmASDocForm.VBObject("TabFrame")
      rekvNum =  tabFrame.VBObject("ASTypeTree").VBObject("TDBMask").text
        
      ' Իրավաբանական դաշտի արժեքի համեմատում
      If Not rekvNum = jurStat Then
              Log.Error("Իրավաբանական կարգավիճակ դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' ՀԾՀ/Սոց քարտ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "REGNUM", socialCard)
      
      If jurStat = "22" Or jurStat = "21" Then
            ' Անուն դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "FIRSTNAME", firstName)
            ' Ազգանուն դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "LASTNAME", lastName)
            ' Հայրանուն դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "PATRNAME", patrName)
            ' Անձը հաստ. փաստաթ. կոդ դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "PASCODE", pasCode)
            ' Անձը հաստ. փաստտթ. կոդ տիպ դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "PASTYPE", passType)        
            
            ' Տրված դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "PASBY", passBy)
            ' Տրված ժամանակ դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "DATEPASS", datePass)
            ' Վավեր է մինչև դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "DATEEXPIRE", dateExpire)   
      End If
      
      ' Ռեզիդենտություն դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "REZ", rezident)
      ' Բացման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "DATOTK", todayDMY)
      
      If  jurStat = "22" Then
            ' Անվանում դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "NAME", wName)
      End If
      
      If  jurStat = "11" Then
            ' Անվանում դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "NAME", wName)
            ' Գործունեության ոլորտ դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "VOLORT", wVolort)
            ' Պետական կարգավիճակ դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "PETBUJ", petBuj)
      End If
      
      If jurStat = "22" Or jurStat = "21" Then
            ' Սեռ դաշտի լրացում
            Call Rekvizit_Fill("Document", 2, "General", "GENDER", gender)
            ' Քաղաքացիություն դաշտի լրացում
            Call Rekvizit_Fill("Document", 2, "General", "CITIZENSHIP", citizenship)
            ' Ծննդավայր դաշտի լրացում
            Call Rekvizit_Fill("Document", 2, "General", "BIRTHPLACE", bidthPlace)
      End If
      
      ' Նշում դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "CLINOTE", cliNote)
      BuiltIn.Delay(1000) 
      ' Երկիր (գրանցման հասցե) դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "COUNTRY", wCountry)
      ' Բնակավայր (գրանցման հասցե) դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "COMMUNITY", wCommunity)
      ' Քաղաք (գրանցման հասցե) դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "CITY", wCity)
      ' Փողոց (գրանցման հասցե) դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "STREET", wStreet)
      ' Տուն/Շենք (գրանցման հասցե) դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "BUILDNUM", buildNum)
      ' Բանակարան (գրանցման հասցե) դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "APARTMENT", wApartment)
      
      ' Երկիր (փաստացի հասցե) դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "COUNTRY2", wCountry2)
      ' Բնակավայր (փաստացի հասցե) դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "COMMUNITY2", wCommunity2)
      ' Քաղաք (փաստացի հասցե) դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "CITY2", wCity2)
      ' Փողոց (փաստացի հասցե) դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "STREET2", wStreet2)
      ' Տուն/Շենք (փաստացի հասցե) դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "BUILDNUM2", buildNum2)
      ' Բանակարան (փաստացի հասցե) դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "APARTMENT2", wApartment2)
      
      BuiltIn.Delay(1000) 
      ' Քաղվածքի պարբերական տրամադրում դաշտի լրացում
      Call Rekvizit_Fill("Document", 8, "CheckBox", "PERIODICDLV", wCheckBox)
      ' Հաշվի քաղվածքի տրամադրման ձև դաշտի լրացում
      Call Rekvizit_Fill("Document", 8, "General", "DLVSTM", accStatForm)
      ' Քարտի քաղվածքի տրամադրման ձև դաշտի լրացում
      Call Rekvizit_Fill("Document", 8, "General", "DLVCRDSTM", cardStatForm )
      ' Քաղվածք/Ծանուցում ուղարկամն հասցե դաշտի լրացում
      Call Rekvizit_Fill("Document", 8, "General", "SENDSTMADRS", sencAddress)
      BuiltIn.Delay(1000)
      ' Սկզբի ամասթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 8, "General", "SDATE", stDate)
      ' Պարբերություն դաշտի լրացում
      Call Rekvizit_Fill("Document", 8, "General", "PERIODICITY", wMonth & "[Tab]" & wDay)
      
      ' Անցնել Կցված բաժին
      wTabStrip.SelectedItem = wTabStrip.Tabs(10)
   
      ' Կցել ֆայլ կոճակի սեղմում
      frmASDocForm.VBObject("TabFrame_10").VBObject("AsAttachments1").VBObject("CmdAdd").Click
      
      If Not Sys.Process("Asbank").Window("#32770", "Open", 1).Exists Then
            Log.Error("Թղթապանակը չի բացվել ֆայլը կցելու համար")
            Exit Sub
      End If
      
      ' Ընտրել ֆայլը
      Sys.Process("Asbank").Window("#32770", "Open", 1).Window("ComboBoxEx32", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(fileName)
      ' Բեռնել ֆայլը
      Sys.Process("Asbank").Window("#32770", "Open", 1).Window("Button", "&Open", 1).Click
      BuiltIn.Delay(2000) 
      
      ' Կցել ֆայլ կոճակի սեղմում
      frmASDocForm.VBObject("TabFrame_10").VBObject("AsAttachments1").VBObject("CmdAdd").Click
      BuiltIn.Delay(2000)
      
      If Not Sys.Process("Asbank").Window("#32770", "Open", 1).Exists Then
            Log.Error("Թղթապանակը չի բացվել ֆայլը կցելու համար")
            Exit Sub
      End If
      
      ' Ընտրել ֆայլը
      Sys.Process("Asbank").Window("#32770", "Open", 1).Window("ComboBoxEx32", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(fileName2)
      ' Բեռնել ֆայլը
      Sys.Process("Asbank").Window("#32770", "Open", 1).Window("Button", "&Open", 1).Click
      BuiltIn.Delay(2000) 
      
      ' Կցել ֆայլ կոճակի սեղմում
      frmASDocForm.VBObject("TabFrame_10").VBObject("AsAttachments1").VBObject("CmdAdd").Click
      BuiltIn.Delay(2000)
      
      If Not Sys.Process("Asbank").Window("#32770", "Open", 1).Exists Then
            Log.Error("Թղթապանակը չի բացվել ֆայլը կցելու համար")
            Exit Sub
      End If
      
      ' Ընտրել ֆայլը
      Sys.Process("Asbank").Window("#32770", "Open", 1).Window("ComboBoxEx32", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(fileName3)
      ' Բեռնել ֆայլը
      Sys.Process("Asbank").Window("#32770", "Open", 1).Window("Button", "&Open", 1).Click
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      
End Sub


' Ստեղծել հաշիվ
' accType - Հաշվի տիպ
' curSum - Արժույթ
' dacsType - Հասան-ն տիպ
' fillOffSect - Լրացնել Գրասենյակ/Բաժին դաշտ 
' accISN - Հաճախորդի փաստաթղթի ISN
' balAcc - Հ/Պ հաշվեկշռային հաշիվ
' clName - Անվանում
' dbtOrKrd - Հաշվի մնացորդ
' codVal - Արժույթ
' wAccType - Հաշվի տիպ
' openDate - Բացման ամսաթիվ
' wAcc - Հաշիվ
' acsType - Հասան-ն տիպ
Sub CreateAccount(accType, curSum, dacsType, fillOffSect, accISN, balAcc, clName, dbtOrKrd, codVal, wAccType, openDate, wAcc, acsType)

      Dim param
      ' Կատարել բոլոր գործողությունները
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Ստեղծել հաշիվ գործողության կատարում
      Call wMainForm.PopupMenu.Click(c_CreateCard & "|" & c_Account)
      
      If Not p1.WaitVBObject("frmAsUstPar",2000).Exists Then
            Log.Error("Հաշվի բացում դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Հաշվի տիպ դաշտի լրացում
      Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("ASTypeTree").VBObject("TDBMask").Keys(accType & "[Tab]")
      ' Արժույթ դաշտի լրացում
      Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("ASTypeTree_2").VBObject("TDBMask").Keys(curSum & "[Tab]")
      ' Հասան-ն տիպ
      Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("ASTypeTree_3").VBObject("TDBMask").Keys(dacsType & "[Tab]")
      ' Լրացնել Գրասենյակ/Բաժին դաշտի լրացում
      Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("ASTypeTree_4").VBObject("TDBMask").Keys(fillOffSect & "[Tab]")
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000) 
      
      If Not wMDIClient.WaitVBObject("frmASDocForm",2000).Exists Then
            Log.Error("Հաշվ թղթապանակը չի բացվել")
            Exit Sub
      End If
      
      ' Հաճախորդի փաստաթղթի ISN - ի ստացում
      accISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN  
      
      ' Հ/Պ հաշվեկշռային հաշվի տիպ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "BALACC", balAcc & "[Tab]")
      ' Անվանում դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "NAME", clName & "[Tab]")
      ' Հաշվի մնացորդի տիպ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "DK", dbtOrKrd)
      ' Արժույթ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "CODVAL", codVal)
      ' Հաշվի տիպ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACCTYPE", wAccType)
      ' Բացման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "DATOTK", openDate)
      ' Հաշիվ դաշտի արժեքի ստացում
      param = GetVBObject("CODE", wMDIClient.VBObject("frmASDocForm"))
      wAcc = wMDIClient.VBObject("frmASDocForm").vbObject("TabFrame").VBObject(param).Text
       
      ' Հասան-ն տիպ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACSTYPE", acsType)

      'Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      BuiltIn.Delay(1800) 
      
      If p1.WaitVBObject("frmAsMsgBox",1000).Exists Then
            Call ClickCmdButton(5, "àã")
      End If

End Sub


' Հաշվի համար կանխիկ մուտք/ ելք փաստաթղթի ստեղծում
' inOrOut - Կանխիկ մուտք/ ելք
' fISN - Փասատթղթի ISN
' docNum - Փասատթղթի համար
' wDate - Ամասթիվ
' wKassa - Դրամարկղ
' wSumma - Գումար
' wAim - Նպատակ
' accCr - Հաշիվ կրեդիտ
' wPayer - Մուծող
' accDb - Հաշիվ դեբետ
Sub  CashInOut(inOrOut, fISN, docNum, wDate, wKassa, wSumma, wAim, accCr, accDb, jurStat, cliCode, wPayer, payerLName)

      BuiltIn.Delay(1000) 
      ' Կատարել բոլոր գործողությունները
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Կանխիկ մուտք/ ելք գործողության կատարում
      Call wMainForm.PopupMenu.Click(c_InnerOpers & "|" & inOrOut)
      
      BuiltIn.Delay(1000) 
      If Not wMDIClient.WaitVBObject("frmASDocForm",2000).Exists Then
            Log.Error("Կանխիկ մուտք/ելք փասատթուղթը չի բացվել")
            Exit Sub
      End If
      
      fISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN    
      
      ' Փաստաթղթի համարի ստացում
      docNum = Get_Rekvizit_Value("Document", 1, "General", "DOCNUM")
      
      ' Ամասթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "DATE", wDate)
      ' Դրամարկղ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "KASSA", wKassa)
      ' Գումար դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SUMMA", wSumma)
      ' Նպատակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "AIM", wAim)
      
      
      If inOrOut = "Կանխիկ մուտք" Then
            ' Հաշիվ կրեդիտ դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "ACCCR", accCr)
      Else
            ' Հաշիվ դեբետ դաշտի լրացում
            Call Rekvizit_Fill("Document", 1, "General", "ACCDB", accDb)
      End If

      If jurStat = "11" Then
           ' Մուծող դաշտի լրացում
           Call Rekvizit_Fill("Document", 1, "General", "CLICODE", cliCode)
           
           If inOrOut = "Կանխիկ մուտք" Then
              ' Անուն դաշտի լրացում
               Call Rekvizit_Fill("Document", 1, "General", "PAYER", wPayer)
               ' Ազգանուն դաշտի լրացում
               Call Rekvizit_Fill("Document", 1, "General", "PAYERLASTNAME", payerLName)
           Else
              ' Անուն դաշտի լրացում
               Call Rekvizit_Fill("Document", 1, "General", "RECEIVER", wPayer)
               ' Ազգանուն դաշտի լրացում
               Call Rekvizit_Fill("Document", 1, "General", "RECEIVERLASTNAME", payerLName)
           End If
           
      End If
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      BuiltIn.Delay(1000) 
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("FrmSpr").Close
 
End Sub


' Թղթապանակի բացում և պայմանագրի առկայության ստուգում
' folderDirect - Թղթապանակի ուղղություն
' folderName - Թղթապանակի անվանում
Function OpenFolderClickDo(folderDirect, folderName)

      Dim state
      state = False
      ' Մուտք Հաճախորդներ թղթապանակ 
      Call wTreeView.DblClickItem(folderDirect)
      
      If Not p1.WaitVBObject("frmAsUstPar",2000).Exists Then
            Log.Error(folderName & " դիալոգը չի բացվել")
            Exit Function
      End If
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
      ' Ստուգում որ հաճախորդի կոդով միայն մեկ հաճախորդ կա
      If Not wMDIClient.WaitVBObject("frmPttel",30000).Exists Then
            Log.Error(folderName & " թղթապանակը չի բացվել")
            Exit Function
      End If
      state = True
      
      OpenFolderClickDo = state
       
End Function


' Թղթապանակի բացում և պայմանագրի առկայության ստուգում
' folderDirect - Թղթապանակի ուղղություն
' rekvName - Հաճախորդ դաշտի ռեկվիզիտի անվանում
' folderName - Թղթապանակի անվանում
' cliCode - Հաճախորդի կոդ
Function OpenFolder(folderDirect, folderName, rekvName, cliCode)
      Dim state : state = False
      
      BuiltIn.Delay(1000)
      ' Մուտք Հաճախորդներ թղթապանակ 
      Call wTreeView.DblClickItem(folderDirect)      
      If Not p1.WaitVBObject("frmAsUstPar", 200).Exists Then
            Log.Error(folderName & " դիալոգը չի բացվել")
            Exit Function
      End If
      
      ' Հաճախորդ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", rekvName, cliCode)
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
      ' Ստուգում որ հաճախորդի կոդով միայն մեկ հաճախորդ կա
      If Not wMDIClient.WaitVBObject("frmPttel", 30000).Exists Then
            Log.Error(folderName & " թղթապանակը չի բացվել")
            Exit Function
      ElseIf wMDIClient.VBObject("frmPttel").VBObject("TDBGView").ApproxCount <> 1 Then
             Log.Error("Պայմանագրիը չի ստեղծվել")
             Exit Function
      End If
      state = True
      
      OpenFolder = state
End Function

'  Ետհաշվեկշռային հաշվի ստեղծում
' codBal - Ետհաշվեկշռային հաշիվ
' wName - Անվանում
' codVal - Արժույթ
' accType - Հաշվի տիպ 
' openDate - Բացման ամսաթիվ
' wAcc - Հաշվի համար
Sub CreateBalanceSheetAccount(codBal, wName, codVal, accType, openDate, wAcc)

      BuiltIn.Delay(1000)   
      ' Կատարել բոլոր գործողությունները
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Ստեղծել Ետհաշվեկշռային հաշիվ գործողության կատարում
      Call wMainForm.PopupMenu.Click(c_CreateCard & "|" & c_OffBalAcc)
      BuiltIn.Delay(1000) 
      
      If Not wMDIClient.WaitVBObject("frmASDocForm",2000).Exists Then
            Log.Error("Ետհաշվեկշռային հաշիվ փաստաթուղթը չի բացվել")
            Exit Sub
      End If
      
      ' Ետհաշվեկշռային հաշվի դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "CODBAL", codBal )
      ' Անվանում դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "NAME", wName)
      ' Արժույթ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "CODVAL", codVal)
      ' Հաշվի տիպ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACCTYPE", accType)
      ' Բացման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "DATOTK", openDate)
      
      ' Հաշվի համարի ստացում
      wAcc = Get_Rekvizit_Value("Document", 1, "General", "CODE")
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      
End Sub


' Պարբերական կոմունալ վճարումների պայամանագրի ստեղծում
' docN - Հաշվի համար
' cliCode - Հաճախորդ
' wName - Անվանում
' feeAcc - Հաշիվ դաշտ
' wService - Ծառայություն
' wPlace - Վայր դաշտ
' minSum - Նվազագույն գումար
' maxSum - Առավելագույն գումար
Sub RegularUtilityPayments(docN, cliCode, wName, feeAcc, wService, wPlace, minSum, maxSum)

      Dim frmASDocForm
      ' Կատարել բոլոր գործողությունները
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Պարբերական կոմունալ վճարումների պայամանագրի ընտրում
      Call wMainForm.PopupMenu.Click(c_CreateCard & "|" & c_RegUtilPay)
      
      Set frmASDocForm = wMDIClient.VBObject("frmASDocForm")
      If Not wMDIClient.WaitVBObject("frmASDocForm",2000).Exists Then
            Log.Error("Պարբերական կոմունալ վճարումների պայամանագրի փաստաթուղթը չի բացվել")
            Exit Sub
      End If
      
      ' Հաշվի համարի ստացում
      docN = Get_Rekvizit_Value("Document", 1, "General", "CODE")
      
      If docN = " " Then
            ' Գեներացնել կոդ
            frmASDocForm.VBObject("TabFrame").VBObject("CmdButton").Click
      End If
      
      ' Հաճախորդ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "CLICODE", cliCode)
      ' Անվանում դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "NAME", wName)
      ' Հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "FEEACC", feeAcc)
      
      With  frmASDocForm.VBObject("TabFrame").VBObject("DocGrid")
            ' Ծառայություն դաշտի լրացում
            .Row = 0
            .Col = 1
            .Keys(wService & "[Enter]")
            ' Վայր դաշտի լրացում
            .Row = 0
            .Col = 2
            .Keys(wPlace & "[Enter]" )
            ' Բաժանորդի համար դաշտի լրացում
            .Row = 0
            .Col = 3
            .Keys(docN & "[Enter]" )
            ' Նվազագույն գումար դաշտի լրացում
            .Row = 0
            .Col = 4
            .Keys(minSum & "[Enter]" )
            ' Առավելագույն գումար դաշտի լրացում
            .Row = 0
            .Col = 5
            .Keys(maxSum & "[Enter]" )
      End With 
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")

End Sub


'Քաղվածքի ստեղծում
' sDate - Ժամանակահատվածի սկիզբ
' eDate - Ժամանակահատվածի ավարտ
' stateType - Ցույց տալ Օվերդրաֆտի տրամադրում / մարումները
' showOverdrOpers - Ցույց տալ սպասվող գործողություններ
' shDraft - Ցույց տալ սպասվող գործողություններ
' shCorName - Ցույց տալ թղթակցողի անվանումը
' accTmp - Հաշվի ձևանմուշ
' stateimOut - Հաշվի քաղվածքի հաշվարկաման ժամանակ
Function ViewAccExcerption(sDate, eDate, stateType, showOverdrOpers, shDraft, shCorName, accTmp, stateimOut)
 
      Dim isExist
      isExist = False
      
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_Statement)
      
      If Not p1.WaitVBObject("frmAsUstPar",2000).Exists Then
            Log.Error("Քաղվածք դիալոգը չի բացվել")
            Exit Function
      End If
      
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SDATE", sDate)
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EDATE", eDate)
      ' Գործունեություն դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "STATETYPE", stateType)
      ' Ցույց տալ Օվերդրաֆտի տրամադրում / մարումները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHOWOVERDRAFTOPERS", showOverdrOpers)
      ' Ցույց տալ սպասվող գործողություններ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHDRAFT", shDraft)
      ' Ցույց տալ թղթակցողի անվանումը դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "SHCORNAME", shCorName)
      ' Հաշվի ձևանմուշ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACCTMP", accTmp)
      ' Հաշվի քաղվածքի հաշվարկաման ժամանակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "STATETIMEOUT", stateimOut)
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
      ' Քաղվածքի առկայության ստուգում
      If accTmp = "" then
          If wMDIClient.vbObject("FrmSpr").Exists Then
              isExist = True
          End If
          ViewAccExcerption = isExist
      Else    
          ViewAccExcerption = True
      End If

End Function




' Պարբերական գործողությունների պայմանագրի ստեղծում
'Sub CreatePeriodicContract(docN, cliCode, wName, stDate, etDate, calcAlways, pidiodiclyM, pidiodiclyD, sDay, lDay, nonWorkDays)
'
'      Dim wMainForm, frmASDocForm, param, wSubscriber
'      Set wMainForm = Sys.Process("Asbank").VBObject("MainForm")
'      ' Կատարել բոլոր գործողությունները
'      Call wMainForm.MainMenu.Click(c_AllActions)
'      ' Ստեղծել հաշիվ գործողության կատարում
'      Call wMainForm.PopupMenu.Click(c_CreateCard & "|" & c_PeriodicContract)
'      BuiltIn.Delay(1000) 
'      
'      Set frmASDocForm = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm")
'      If Not frmASDocForm.Exists Then
'            Log.Error("Պարբերական գործողությունների պայամանագիր փաստաթուղթը չի բացվել")
'            Exit Sub
'      End If
'      
'      ' Հաշվի համարի ստացում
'      param = GetVBObject("CODE", frmASDocForm)
'      docN = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
'      
'      If docN = " " Then
'            ' Գեներացնել կոդ
'            Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").VBObject("TabFrame").VBObject("CmdButton").Click
'      End If
'      
'      ' Հաճախորդ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "CLICODE", cliCode)
'      ' Անվանում դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "NAME", wName)
'      ' Սկզբի ամսաթիվ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "SDATE", stDate)
'      ' Վերջի ամսաթիվ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "EDATE", etDate)
'      
'      ' Կատարել ամեն կանչի ժամանակ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "CALCALWAYS", calcAlways)
'      ' Պարբերություն - ամիս, օր դաշտերի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "PERIODICITY", pidiodiclyM & "[Tab]" & pidiodiclyD)
'
'      ' Կատարման օրեր դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "SDAY", sDay)
'      ' Կատարման օրեր մինչև դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "LDAY", lDay)
'      ' Վերջի ամսաթիվ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "NONWORKDAYS", nonWorkDays)
'
'End Sub

' Ստեղծել Պլաստիկ քարտ
' pcStand - Ստանդարտ
' quantity - Քանակ
' acsBranch - Գրասենյակ
' acsDepart - Բաժին
' docNum - Պայամանագրի համար
' wAcc - Հաշիվ
' wPcStand - Ստանդարտ
' wName - Անվանում
' cardType - Քարտի տիպ
' cardNum - Քարտի համար
' motherCard - Մայր քարտի համար
' wPass - Գաղտնաբառ
' validFrom - Գործադրման ամսաթիվ
' valDate - Ժամկետ
' payDate - Վճարման ամսաթիվ
' cardSort - Քարտի տեսակ
' smartCard - Սմարտ/Մագնիս. քարտ
'Sub CreatePlasticCard(pcStand, quantity, acsBranch, acsDepart, fISN, docNum, wAcc, wPcStand, wName, cardType, cardNum, _
'                                          motherCard, wPass, validFrom, valDate, payDate, cardSort, smartCard)
'
'      Dim wMainForm, frmASDocForm, param, wTabStrip
'      Set wMainForm = Sys.Process("Asbank").VBObject("MainForm")
'      ' Կատարել բոլոր գործողությունները
'      Call wMainForm.MainMenu.Click(c_AllActions)
'      ' Ստեղծել հաշիվ գործողության կատարում
'      Call wMainForm.PopupMenu.Click(c_CreateCard & "|" & c_PCard)
'      BuiltIn.Delay(1000) 
'      
'      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
'            Log.Error("Պլաստիկ քարտ դիալոգը չի բացվել")
'            Exit Sub
'      End If
'      
'      ' Ստանդարտ դաշտի լրացում
'      Call Rekvizit_Fill("Dialog", 1, "General", "PCSTAND", pcStand)
'      ' Քանակ դաշտի լրացում
'      Call Rekvizit_Fill("Dialog", 1, "General", "QUANTITY", quantity)
'      ' Գրասենյակ դաշտի լրացում
'      Call Rekvizit_Fill("Dialog", 1, "General", "ACSBRANCH", acsBranch)
'      ' Բաժին դաշտի լրացում
'      Call Rekvizit_Fill("Dialog", 1, "General", "ACSDEPART", acsDepart)
'      
'      ' Կատարել կոճակի սեղմում
'      Call ClickCmdButton(2, "Î³ï³ñ»É")
'      BuiltIn.Delay(2000) 
'      
'      ' OK կոճակի սեղմում
'      Call ClickCmdButton(5, "OK")
'      BuiltIn.Delay(2000) 
'      
'      Set frmASDocForm = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm")
'      If Not frmASDocForm.Exists Then
'            Log.Error("Պլաստիկ քարտ (նոր) փաստաթուղթը չի բացվել")
'            Exit Sub
'      End If
'      
'      fISN = frmASDocForm.DocFormCommon.Doc.ISN    
'      
'      ' Պայամանագրի համարի ստացում
'      param = GetVBObject("CONTCODE", frmASDocForm)
'      docNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
'      
'      Set wTabStrip = frmASDocForm.vbObject("TabStrip")
'      
'      ' Հաշիվ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "ACC", wAcc & "[Tab]")
'      ' Ստանդարտ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "PCSTAND", wPcStand & "[Tab]")
'      ' Անվանում դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "NAME", wName & "[Tab]")
'      
'      ' Քարտի տիպ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "TYPE", cardType & "[Tab]")
'      ' Քարտի համար դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "CARDNUM", cardNum & "[Tab]")
'      ' Մայր քարտի համար դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "MOTHERCARD", motherCard & "[Tab]")
'      
'      ' Գաղտնաբառ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 1, "General", "PAROLE", wPass & "[Tab]")
'      
'      wTabStrip.SelectedItem = wTabStrip.Tabs(2)
'      BuiltIn.Delay(800) 
'      
'      ' Գործադրման ամսաթիվ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 2, "General", "VALIDFROM", validFrom & "[Tab]")
'      BuiltIn.Delay(800) 
'      ' Ժամկետ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 2, "General", "VALDATE", valDate & "[Tab]")
'      BuiltIn.Delay(800) 
'      ' Վճարման ամսաթիվ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 2, "General", "PAYDATE", payDate & "[Tab]")
'      BuiltIn.Delay(800) 
'      wTabStrip.SelectedItem = wTabStrip.Tabs(5)
'      BuiltIn.Delay(800) 
'      
'      ' Քարտի տեսակ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 5, "General", "CARDSORT", cardSort)
'      ' Սմարտ/Մագնիս. քարտ դաշտի լրացում
'      Call Rekvizit_Fill("Document", 5, "General", "SMARTCARD", smartCard)
'      
'      ' Կատարել կոճակի սեղմում
'      Call ClickCmdButton(1, "Î³ï³ñ»É")
'      
'End Sub


' Պահատեղի վարձակալության պայամանագրի ստեղծում
' startDate - Կնքման ամսաթիվ
' standart - Ստանդարտ
' duration - Տևողություն
' endDate - Վերջի ամսաթիվ
' dBoxType - Պահատեղի տիպ
' dBoxNumber - Պահատեղի համար
' wCliCode - Հաճախորդ
' payType - Վճարման եղանակ
' wSumma - Վարձավճար
' depSumma - Դեպոնացվող գումար
' acsBranch - Գրասենյակ
' acsDepart - Բաժին
Sub ParcelLeaseAgreement(startDate, standart, duration, endDate, dBoxType, dBoxNumber, wCliCode, payType, wSumma, depSumma, acsBranch, acsDepart)

      ' Կատարել բոլոր գործողությունները
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Ստեղծել հաշիվ գործողության կատարում
      Call wMainForm.PopupMenu.Click(c_CreateCard & "|" & c_ParcelLeaseAgr)
      BuiltIn.Delay(1000) 
      
      If Not p1.WaitVBObject("frmAsUstPar",2000).Exists Then
            Log.Error("Նոր պայամանագրի պայմաններ դիալոգը չի բացվել")
            Exit Sub
      End If

      ' Կնքման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "STARTDATE", startDate)
      ' Ստանդարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "STANDARD", standart)
      ' Տևողություն դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DURATION", duration)
      ' Վերջի ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ENDDATE", endDate)
      ' Պահատեղի տիպ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DBOXTYPE", dBoxType)
      ' Պահատեղի համար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DBOXNUMBER", dBoxNumber)
      ' Հաճախորդ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CLICODE", wCliCode)
      ' Վճարման եղանակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PAYTYPE", payType)
      ' Վարձավճար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SUMMA", wSumma)
      ' Դեպոնացվող գումար դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DEPSUMMA", depSumma)
      ' Գրասենյակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSBRANCH", acsBranch)
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSDEPART", acsDepart)
      
End Sub

' Գործողություն Պայամանագրի հետ
' colN - Թղթապանակում սյան համարը
' docNum - Փասատթղթի համարը
' action - Գործողության տիպ
' doNum - բացված պատուհանի տեսակ
' doActio - Սեղմվող կոճակի անվանում
Function ActionWithDocument(windName, colN, docNum, action, doNum, doActio)

      Dim tdbgView, status
      status = False
      BuiltIn.Delay(2000)
      Set tdbgView = wMDIClient.VBObject(windName).VBObject("tdbgView")
      
      Do Until  tdbgView.EOF
                 If  Trim( tdbgView.Columns.Item(colN).Value) = Trim(docNum) Then
                        ' Կատարել բոլոր գործողությունները
                        Call wMainForm.MainMenu.Click(c_AllActions)
                        ' Գործողության տիպը պայամանագրի նկատմամբ
                        Call wMainForm.PopupMenu.Click(action)
                        '  կոճակի սեղմում
                        Call ClickCmdButton(doNum, doActio)
                        status = True
                        Exit Do                   
                 Else
                        tdbgView.MoveNext
                 End If
      Loop 
      
      ActionWithDocument = status
      
End Function 

' Ջնջել Հաճախորդի թղթապանակից
' windName - VBObject- ի անվանում
' colN - Թղթապանակում սյան համարը
' docNum - Փասատթղթի համարը
' action - Գործողության տիպ
Function DeleteFromCustomFolder(windName, colN, docNum, action)

      Dim tdbgView, status
      status = False
    
      Set tdbgView = wMDIClient.VBObject(windName).VBObject("tdbgView")

      Do Until  tdbgView.EOF
                 If  Trim( tdbgView.Columns.Item(colN).Value) = Trim(docNum) Then
                        ' Կատարել բոլոր գործողությունները
                        Call wMainForm.MainMenu.Click(c_AllActions)
                        ' Գործողության տիպը պայամանագրի նկատմամբ
                        Call wMainForm.PopupMenu.Click(action)
                        BuiltIn.Delay(1000) 
                        
                        If Sys.Process("Asbank").WaitVBObject("frmAsMsgBox", delay_small).Exists  Then
                              ' Ոչ կոճակի սեղմում
                              Call ClickCmdButton(5, "àã")
                              BuiltIn.Delay(1000) 
                              Call ClickCmdButton(3, "²Ûá")
                        ElseIf Sys.Process("Asbank").VBObject("frmDeleteDoc").Exists Then
                              ' Այո կոճակի սեղմում
                              Call ClickCmdButton(3, "²Ûá")
                              BuiltIn.Delay(1000) 
                              Call ClickCmdButton(5, "àã")
                        End If
                        
                        status = True
                        Exit Do                   
                 Else
                        tdbgView.MoveNext
                 End If
      Loop 
      
      DeleteFromCustomFolder = status
      
End Function 

' "Սև ցուցակ"-ի կարգավորումներ
' folderDirect - փաստաթղթի ճանապարհը
' securitiesRow - Գրիդի տողերի քանակը
Class BlackListArrangement
        Public thingsGrid()
        Public folderDirect
    
        Private Sub Class_Initialize 
            ReDim thingsGrid(securitiesRow, 5) 
            folderDirect = ""
        End Sub
End Class

Function New_BlackListArrangement(rowCount)
        securitiesRow = rowCount
        Set New_BlackListArrangement = NEW  BlackListArrangement  
End Function 


Sub Create_BlackListArrangement(BlackListArr)

      ' Մուտք Հաճախորդներ թղթապանակ 
      Call wTreeView.DblClickItem(BlackListArr.folderDirect)
      BuiltIn.Delay(1000)
      
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm")
      
      Dim i, j, DocGrid
  		Set DocGrid = wMDIClient.vbObject("frmASDocForm").vbObject("TabFrame").vbObject("DocGrid")
      for i = 0 to securitiesRow
                for j = 0 to 4
                  with DocGrid
                    .Col = j
                    .Row = i
                    .Keys(BlackListArr.thingsGrid(i, j) & "[Right]")
                        end with
                next
                DocGrid.Keys("[Home][Up]")
                BuiltIn.Delay(1000)
      next
      
      ' Այո կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      
End Sub
