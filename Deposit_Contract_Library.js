'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Library_Contracts

'______________________________________________________________________________________________________________________________________________________________
'Ավանդ տեսակի պայմանագրի ստեղծում
'______________________________________________________________________________________________________________________________________________________________
'fBASE - պայմանագրի ISN
'contractNum - պայմանագրի համար
'depositContractType - պաըմանագրի տիպ
'colItem - պայմանագրի տողի համար
'clientCode - հաճախորդի համար
'curr - արժույթ
'money - գումար
'signDate - կնքման ամսաթիվ
'kindScale - օրացույցի հաշվարկման ձև
'depositPer - ավանդի տոկոսադրույք 
'part - բաժ.
'per - վերահաշվարկի տոկոս
'dateGive - հատկացման ամսաթիվ
'dateAgr - մարման ժամկետ
Sub Deposit_Contract_Fill(fBASE,contractNum,template,depositContractType,colItem, _
                          ClientCode,thirdPerson,curr,accAc,thirdAcc,perAcc,money,chbKap,_
                          chbAuto,chbEx,signDate,kindScale,scale,withScale,depositPer,part,per,dateGive,_
                          dateAgr,startDate,period,direction)
      Dim Rekv, wTabStrip                      

      'Ավանդային պայմանագրերից ընտրում է որև մեկը կախված colItem պարամետրից
      Do Until p1.frmModalBrowser.VBObject("tdbgView").EOF    
        If DepositContractType = p1.frmModalBrowser.VBObject("tdbgView").Columns.Item(col_item).Text Then
          Call p1.frmModalBrowser.VBObject("tdbgView").Keys("[Enter]")      
          Exit Do        
        Else
          Call p1.frmModalBrowser.VBObject("tdbgView").MoveNext
        End If    
      Loop  
    
      'Ստանում է պայմանագրի ISN 
      fBASE = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
      'Ստանում է պայմանագրի համարը
      contractNum = Get_Rekvizit_Value("Document",1,"General","CODE")
      Set Rekv = wMDIClient.VBObject("frmASDocForm").WaitVBObject("AS_LABELAGRTYPE", delay_small)
      
	    'Ջնջում է Հատկացման ամսաթիվ դաշտը
      Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
          wTabStrip.SelectedItem = wTabStrip.Tabs(4)
      Call Rekvizit_Fill("Document",4,"General","DATEGIVE","^A[Del]")

      Set wTabStrip = wMDIClient.VBObject("frmASDocForm").VBObject("TabStrip")    
      wTabStrip.SelectedItem = wTabStrip.Tabs(1)
      'Լրացնում է Կնքման ամսաթիվ դաշտը
      Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" & signDate)
     
      If Rekv.Exists Then
        'Լրացնում է Ձևանմուշի N դաշտը
        Call Rekvizit_Fill("Document",1,"General","AGRTYPE",template)
      End If 
      
      'Լրացնում է Հաճախորդի համար դաշտը
      Call Rekvizit_Fill("Document",1,"General","CLICOD",clientCode)
      Set Rekv = wMDIClient.VBObject("frmASDocForm").WaitVBObject("AS_LABELCLICOD3", delay_small)
     
      If Rekv.Exists Then
        'Լրացնում է Երրորդ անձ դաշտը
        Call Rekvizit_Fill("Document",1,"General","CLICOD3",thirdPerson)
      End If  
      
      'Լրացնում է Արժույթ դաշտը
      Call Rekvizit_Fill("Document",1,"General","CURRENCY",curr)
      'Լրացնում է Հաշվարկային հաշիվ դաշտը
      Call Rekvizit_Fill("Document",1,"General","ACCACC",accAc)
      Set Rekv = wMDIClient.VBObject("frmASDocForm").WaitVBObject("AS_LABELACCACC3", delay_small)
     
      If Rekv.Exists Then
        'Լրացնում է Երրորդ անձի հաշիվ դաշտը
        Call Rekvizit_Fill("Document",1,"General","ACCACC3",thirdAcc)
      End If  
      
      'Լրացնում է Տոկոսների վճարման հաշիվ դաշտը
      Call Rekvizit_Fill("Document",1,"General","ACCACCPR",perAcc)
      'Լրացնում է Գումար դաշտը
      Call Rekvizit_Fill("Document",1,"General","SUMMA",money)
      'Լրացնում է Կապիտալացվող դաշտը
      Call Rekvizit_Fill("Document",1,"CheckBox","AUTOCAP",chbKap)
      'Լրացնում է Պարտքերի ավտոմատ մարում դաշտը
      Call Rekvizit_Fill("Document",1,"CheckBox","AUTODEBT",chbAuto)
      Set Rekv = wMDIClient.VBObject("frmASDocForm").WaitVBObject("AS_LABELAUTOPROLONG", delay_small)
    
      If Rekv.Exists Then
        'Լրացնում է Երկարաձգում դաշտը
        Call Rekvizit_Fill("Document",1,"CheckBox","AUTOPROLONG",chbEx)
      End If
      
      'Լրացնում է Օրացույցի հաշվարկման ձև դաշտը
      Call Rekvizit_Fill("Document",2,"General","KINDSCALE",kindScale)
      
      If scale Then
          'Լրացնում է Նշանակել տոկոսադրույքի սանդղակ նշիչը
          Call Rekvizit_Fill("Document",2,"CheckBox","WITHSCALE",1)
          'Լրացնում է Նշանակել տոկոսադրույքի սանդղակ դաշտը
          wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("AsTypeFolder_6").VBObject("TDBMask").Keys(withScale & "[Tab]")
      Else
          'Լրացնում է Ավանդի տոկոսադրույք դաշտը
          Call Rekvizit_Fill("Document",2,"General","PCAGR",depositPer)
          'Լրացնում է բաժ. դաշտը
          Call Rekvizit_Fill("Document",2,"General","PCAGR",part)
      End If
      
      'Լրացնում է Վերահաշվարկի տոկոս դաշտը
      Call Rekvizit_Fill("Document",2,"General","PCBREAK",per)
      'Լրացնում է բաժ. դաշտը
      Call Rekvizit_Fill("Document",2,"General","PCBREAK",part)
      BuiltIn.Delay(500)
      'Լրացնում է Հատկացման ամսաթիվ դաշտը
      Call Rekvizit_Fill("Document",4,"General","DATEGIVE","![End]" & "[Del]" & dateGive)
      'Լրացնում է Մարման ժամկետ դաշտը
      Call Rekvizit_Fill("Document",4,"General","DATEAGR","![End]" & "[Del]" & dateAgr)

      'Լրացնում է Ամսաթվերի լրացում նշիչը
      Select Case depositContractType
          Case "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"
            wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_4").VBObject("CheckBox_9").Click() 
          Case Else
            wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_4").VBObject("CheckBox_8").Click()
      End Select
      
      'Ամսաթվերի լրացում նշիչը դնելուց բացված "Ամսաթվերի լրացում" դիալոգի լրացում
      Call p1.Refresh
      
      If p1.VBObject("frmAsUstPar").VBObject("TabFrame").Exists Then
         'Լրացնում է Սկզբի ամսաթիվ դաշտը
         Call Rekvizit_Fill("Dialog", 1, "General", "FIRSTDAY", startDate)
         'Պարբերություն (ամիս) դաշտի լրացում
         BuiltIn.Delay(500)
         Call Rekvizit_Fill("Dialog", 1, "General", "PERIODICITY", period & "[Tab]")
         'Շրջանցման ուղղություն դաշտի լրացում
         Call Rekvizit_Fill("Dialog", 1, "General", "PASSOVDIRECTION", direction)
         'Սեղմում է Կատարել կոճակը
         Call ClickCmdButton(2, "Î³ï³ñ»É")
      End If
      
      'Լրացնում է Ճյուղայնություն դաշտը
      Call Rekvizit_Fill("Document",5,"General","SECTOR", "U2")
      'Լրացնում է Նպատակ դաշտը
      Set Rekv = wMDIClient.VBObject("frmASDocForm").WaitVBObject("AS_LABELAIM", delay_small)
    
      If Rekv.Exists Then
        Call Rekvizit_Fill("Document",5,"General","AIM", "00")
      End If
      
      'Լրացնում է Օգտագործման ոլորտ(նոր ՎՌ) դաշտը
      Set Rekv = wMDIClient.VBObject("frmASDocForm").WaitVBObject("AS_LABELUSAGEFIELD", delay_small)
     
      If Rekv.Exists Then
        Call Rekvizit_Fill("Document",5,"General","USAGEFIELD", "01.001")
      End If  
      
      'Լրացնում է Երկիր դաշտը
      Set Rekv = wMDIClient.VBObject("frmASDocForm").WaitVBObject("AS_LABELUSAGEFIELD", delay_small)
      
      If Rekv.Exists Then
        Call Rekvizit_Fill("Document",5,"General","COUNTRY", "AM")
      End If  
      
      'Լրացնում է Մարզ դաշտը
      Call Rekvizit_Fill("Document",5,"General","LRDISTR", "001")
      'Լրացնում է Մարզ(նոր ՎՌ) դաշտը 
      Set Rekv = wMDIClient.VBObject("frmASDocForm").WaitVBObject("AS_LABELREGION", delay_small)
    
      If Rekv.Exists Then
        Call Rekvizit_Fill("Document",5,"General","REGION", "010000008")
      End If  
      
      'Լրացնում է Պայմ.թղթային N դաշտը
      Call Rekvizit_Fill("Document",5,"General","PPRCODE", Left(fBASE, 3))
      
      'Սեղմել Կատարել կոճակը
      Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'______________________________________________________________________________________________________________________________________
'Կատարում է Ավանդի ներգրավում
'______________________________________________________________________________________________________________________________________
'contractNum - պայամանգրի համար
'level - պայմանագրի մակարդակ
'invDate - ամսաթիվ
'money - գումար
'cashORno - կանխիկ/անկանխիկ
'Acc - հաշիվ
Sub Deposit_Involvment(fBASE, docNum, invDate, money, cashORno, Acc)
     BuiltIn.Delay(2000)
     Call wMainForm.MainMenu.Click(c_AllActions)
     Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_DepositAttr)
   
     'Ստանում է պայմանագրի ISN 
      fBASE = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
     'Լրացնում է Ամսաթիվ դաշտը
     Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" & invDate)
     'Լրացնում է Գումար դաշտը
     Call Rekvizit_Fill("Document",1,"General","SUMMA",money)
     'Լրացնում է Կանխիկ/Անկանխիկ դաշտը
     Call Rekvizit_Fill("Document",1,"General","CASHORNO",cashORno)
     'Լրացնում է Հաշիվ դաշտը
     Call Rekvizit_Fill("Document",1,"General","ACCCORR",Acc)
     'Սեղմում է Կատարել կոճակը
     Call ClickCmdButton(1, "Î³ï³ñ»É")
      If cashOrno = 1 Then
        'Ստանում է պայմանագրի համարը
        docNum = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
        Call ClickCmdButton(1, "Î³ï³ñ»É")
        BuiltIn.Delay(1500)
        Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("FrmSpr").Close()
      Else
        Call ClickCmdButton(5, "²Ûá")
      End If
End Sub 

'______________________________________________________________________________________________________________________________________
'Ավանդի տրամադրում
'______________________________________________________________________________________________________________________________________
'DocNum - Պայմանագրի համար
'DocLevel - Պայմանագրի մակարդակի
'Date - ամսաթիվ
'Sum - գումար
'cash - կանխիկ/անկանխիկդ
'CalcAcc - հաշիվ
Sub Give_Deposit(Date, Sum, Cash, CalcAcc)
   
     BuiltIn.Delay(1500)
     wMainForm.MainMenu.Click(c_AllActions)
     wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_GiveDeposit)
     BuiltIn.Delay(1500)
   
     'Լրացնում է Ամսաթիվ դաշտը
     Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" & Date)
     'Լրացնում է Գումար դաշտը
     Call Rekvizit_Fill("Document",1,"General","SUMMA",Sum)
     'Լրացնում է Կանխիկ/Անկանխիկ դաշտը
     Call Rekvizit_Fill("Document",1,"General","CASHORNO",Cash)
     'Լրացնում է Հաշիվ դաշտը
     Call Rekvizit_Fill("Document",1,"General","ACCCORR",CalcAcc)
     'Սեղմում է Կատարել կոճակը
     Call ClickCmdButton(1, "Î³ï³ñ»É")
     If cashOrno = 1 Then
        'Ստանում է պայմանագրի համարը
        docNum = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
        Call ClickCmdButton(1, "Î³ï³ñ»É")
        BuiltIn.Delay(1000)
        wMDIClient.VBObject("FrmSpr").Close()
      Else
         Call ClickCmdButton(5, "²Ûá")
      End If
End Sub 

'____________________________________________________________________________________________________________________________________________________________________________
'Կատարում է Ժամկետների վերանայում
'____________________________________________________________________________________________________________________________________________________________________________
'exDate - ամսաթիվ
'exTerm - մարման ժամկետ
'fillDate - ամսաթվերի լրացում
'startDate - սկզբի ամսաթիվ
'period - պարբերություն
'direction - շրջանցման ուղղություն
Sub Deposit_Extension(exDate,exTerm,startDate,period,direction,Param)
     Dim DateFill 
     BuiltIn.Delay(1500)
     wMainForm.MainMenu.Click(c_AllActions)
     wMainForm.PopupMenu.Click(Param)
     BuiltIn.Delay(1500)
    
     'Լրացնում է Ամսաթիվ դաշտը
     Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" & exDate)
     'Լրացնում է Մարման ժամկետ դաշտը
     Call Rekvizit_Fill("Document",1,"General","DATEAGR","![End]" & "[Del]" & exTerm)
     'Լրացնում է Ամսաթվերի լրացում նշիչը
     Set DateFill = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").WaitVBObject("CheckBox", delay_small)
     If DateFill.Exists Then
       wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("CheckBox").Click()
       Call p1.Refresh
       If p1.VBObject("frmAsUstPar").VBObject("TabFrame").Exists Then
          'Լրացնում է Սկզբի ամսաթիվ դաշտը
          p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("TDBDate").Keys(startDate & "[Tab]")
          'Լրացնում է Պարբերություն դաշտը 
          Call Rekvizit_Fill("Dialog", 1, "General", "PERIODICITY", period & "[Tab]")
          'Լրացնել "Շրջանցման ուղղություն" դաշտը
          Call Rekvizit_Fill("Dialog", 1, "General", "PASSOVDIRECTION", Direction)
          'Սեղմում է Կատարել կոճակը 
          Call ClickCmdButton(2, "Î³ï³ñ»É")
       End If
     End If  
     'Սեղմում է Կատարել կոճակը  
     Call ClickCmdButton(1, "Î³ï³ñ»É")
  
End Sub 

'_____________________________________________________________________________________________________________________________________
'Կատարում է Պարտքերի մարում
'_____________________________________________________________________________________________________________________________________
'repDate - ամսաթիվ
'mainSum - հիմնական գումար
'perSum - Տոկոսագումար
'cashORno - կանխիկ/անկանխիկ
'Acc - հաշիվ
Sub Debt_Repayment(fBASE,repDate, mainSum,perSum,cashORno,Acc,docNum,tabN)
    Dim Rekv 
    BuiltIn.Delay(3000)
    wMainForm.MainMenu.Click(c_AllActions)
    wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_PayOffDebt)
    BuiltIn.Delay(1000)

    'Ստանում է պայմանագրի ISN 
    fBASE = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
    'Լրացնում է Ամսաթիվ դաշտը
    Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" & repDate)
    'Լրացնում է Հիմնական գումար դաշտը
    Call Rekvizit_Fill("Document",1,"General","SUMAGR",mainSum)
    'Տոկոսագումար դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","SUMPER",perSum)
    'Լրացնում է Կանխիկ/Անկանխիկ դաշտը
    Call Rekvizit_Fill("Document",1,"General","CASHORNO",cashORno)
    'Լրացնում է Հաշիվ դաշտը
    Call Rekvizit_Fill("Document",1,"General","ACCCORR",Acc)
    'Լրացնում է Մարման աղբյուր դաշտը
    Set Rekv = wMDIClient.VBObject("frmASDocForm").WaitVBObject("AS_LABELREPSOURCE", delay_small)
     If Rekv.Exists Then
       Call Rekvizit_Fill("Document",tabN,"General","REPSOURCE", 1)
     End If  
 
     If p1.WaitVBObject("frmAsMsgBox",1000).Exists Then
        'Սեղմում է Կատարել կոճակը 
        Call ClickCmdButton(5, "Î³ï³ñ»É")
     End If
     
     wMDIClient.VBObject("frmASDocForm").Keys("^[Enter]")
     
     If cashOrno = 1 Then
        'Ստանում է պայմանագրի համարը
        docNum = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
        Call ClickCmdButton(1, "Î³ï³ñ»É")
        wMDIClient.VBObject("FrmSpr").Close()
     Else
        Call ClickCmdButton(5, "²Ûá")
     End If
      
     BuiltIn.Delay(2000)
End Sub 

'__________________________________________________________________________________________________________________________________________
'Գրաֆիկով ավանդային պայմանագրի ստեղծում
'------------------------------------------------------------------------------------------------------------------------------------------
'fBASE - Պայմանագրի ISN 
'contractNum  -Պայամանագրի համար
'depositContractType - պայմանագրի տիպ
'colItem - պայմանագրի տողի համար
'template - Ձևանմուշ
'ClientCode - Հաճախորդի համար 
'thirdPerson - Երրորդ անձ
'curr - Արժույթ 
'accAc - Հաշվարկային հաշիվ 
'thirdAcc - Երրորդ անձի հաշիվ
'perAcc - Տոկոսների վճարման հաշիվ 
'money - Գումար 
'chbKap - Կապիտալացվող
'chbAuto - Պարտքերի ավտոմատ մարում
'signDate - Կնքման ամսաթիվ 
'dateGive - Հատկացման ամսաթիվ 
'dateAgr - Մարման ժամկետ 
'fillType - Ամսաթվերի լրացման ձև 
'agrStart - Մարումների սկիզբ ժամկետ
'agrEnd - Մարումների վերջ լրացում
'payDates - Մարման օրեր
'sumsDateFillType - Գումարների ամսաթվերի ընտրություն
'sumsFillType - Գումարների բաշխման ձև
'dirrection - Շրջանցման ուղղություն
'kindScale - Օրացույցի հաշվարկման ձև
'depositPer - Ավանդի տոկոսադրույք
'part - բաժ.
'per - Վերահաշվարկի տոկոս 
Sub Deposit_Contract_With_Schedule_Fill(fBASE,contractNum,depositContractType,colItem,template, _
                              ClientCode,thirdPerson,curr,accAc,thirdAcc,perAcc,money,chbKap,_
                              chbAuto,signDate,dateGive,dateAgr,fillType,agrStart,agrEnd,_
                              payDates,sumsDateFillType,sumsFillType,dirrection,kindScale,depositPer,part,per)

      'Ավանդային պայմանագրերից ընտրում է որև մեկը կախված colItem պարամեշտրից
      Do Until p1.frmModalBrowser.VBObject("tdbgView").EOF    
        If depositContractType = p1.frmModalBrowser.VBObject("tdbgView").Columns.Item(col_item).Text Then
          Call p1.frmModalBrowser.VBObject("tdbgView").Keys("[Enter]")      
          Exit Do        
        Else
          Call p1.frmModalBrowser.VBObject("tdbgView").MoveNext
        End If    
      Loop  
    
      'Ստանում է պայմանագրի ISN 
      fBASE = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
      'Ստանում է պայմանագրի համարը
      contractNum = Get_Rekvizit_Value("Document",1,"General","CODE")
      'Լրացնում է Ձևանմուշ դաշտը
      Call Rekvizit_Fill("Document",1,"General","AGRTYPE",template)
      'Լրացնում է Հաճախորդի համար դաշտը
      Call Rekvizit_Fill("Document",1,"General","CLICOD",clientCode)
      'Լրացնում է Երրորդ անձ դաշտը
      Call Rekvizit_Fill("Document",1,"General","CLICOD3",thirdPerson)
      'Լրացնում է Արժույթ դաշտը
      Call Rekvizit_Fill("Document",1,"General","CURRENCY",curr)
      'Լրացնում է Հաշվարկային հաշիվ դաշտը
      Call Rekvizit_Fill("Document",1,"General","ACCACC",accAc)
      'Լրացնում է Երրորդ անձի հաշիվ դաշտը
      Call Rekvizit_Fill("Document",1,"General","ACCACC3",thirdAcc)
      'Լրացնում է Տոկոսների վճարման հաշիվ դաշտը
      Call Rekvizit_Fill("Document",1,"General","ACCACCPR",perAcc)
      'Լրացնում է Գումար դաշտը
      Call Rekvizit_Fill("Document",1,"General","SUMMA",money)
      'Լրացնում է Կապիտալացվող դաշտը
      Call Rekvizit_Fill("Document",1,"CheckBox","AUTOCAP",chbKap)
      'Լրացնում է Պարտքերի ավտոմատ մարում դաշտը
      Call Rekvizit_Fill("Document",1,"CheckBox","AUTODEBT",chbAuto)
      'Լրացնում է Կնքման ամսաթիվ դաշտը
      Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" & signDate)
      'Լրացնում է Հատկացման ամսաթիվ դաշտը
      Call Rekvizit_Fill("Document",1,"General","DATEGIVE","![End]" & "[Del]" & dateGive)
      'Լրացնում է Մարման ժամկետ դաշտը
      Call Rekvizit_Fill("Document",1,"General","DATEAGR","![End]" & "[Del]" & dateAgr)
      'Լրացնում է Ամսաթվերի լրացման ձև դաշտը
      Call Rekvizit_Fill("Document",2,"General","DATESFILLTYPE",fillType)
      'Լրացնում է Մարումների սկիզբ ժամկետ դաշտը
      Call Rekvizit_Fill("Document",2,"General","AGRMARBEG",agrStart)
      'Լրացնում է Մարումների վերջ լրացում նշիչը
      Call Rekvizit_Fill("Document",2,"General","AGRMARFIN",agrEnd)
      'Լրացնում է Մարման օրեր դաշտը
      Call Rekvizit_Fill("Document",2,"General","FIXEDDAYS",payDates)
      'Լրացնում է Գումարների ամսաթվերի ընտրություն
      Call Rekvizit_Fill("Document",2,"General","SUMSDATESFILLTYPE",sumsDateFillType)
      'Լրացնում է Գումարների բաշխման ձև
      Call Rekvizit_Fill("Document",2,"General","SUMSFILLTYPE",sumsFillType)
      'Լրացնում է Շրջանցման ուղղություն դաշտը
      Call Rekvizit_Fill("Document",2,"General","PASSOVDIRECTION",dirrection)
      'Լրացնում է Օրացույցի հաշվարկման ձև դաշտը
      Call Rekvizit_Fill("Document",4,"General","KINDSCALE",kindScale)
      'Լրացնում է Ավանդի տոկոսադրույք դաշտը
      Call Rekvizit_Fill("Document",4,"General","PCAGR",depositPer)
      'Լրացնում է բաժ. դաշտը
      Call Rekvizit_Fill("Document",4,"General","PCAGR",part)
      'Լրացնում է Վերահաշվարկի տոկոս դաշտը
      Call Rekvizit_Fill("Document",4,"General","PCBREAK",per)
      'Լրացնում է բաժ. դաշտը
      Call Rekvizit_Fill("Document",4,"General","PCBREAK",part)
      BuiltIn.Delay(500)
    
      'Սեղմել Կատարել կոճակը
      Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'______________________________________________________________________________________________________________________________
'Մարման գրաֆիկի նշանակում
'------------------------------------------------------------------------------------------------------------------------------
'date - Ամսաթիվ
'filType - Ամսաթվի լրացման ձև
'fixDate - Մարման օրեր
'sumType - Գումարների ամսաթվերի ընտրություն
'agrtype - Գումարների բաշխման ձև
Sub Deposit_Fade_Schedule_fill(fBASE,date,filType,fixDate,sumType,agrtype)
      BuiltIn.Delay(2000)
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_RepaySchedule)
    
      'Ստանում է պայմանագրի ISN 
      fBASE = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn

      'Լրացնում է Ամսաթիվ դաշտը
      Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" & date)
      'Լրացնում է "Ընթացիկ գրաֆիկի պատճ." նշիչը
      wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("CheckBox").Click()
      'Լրացնում է "Ամսաթվի լրացման ձև" դաշտը
      Call Rekvizit_Fill("Dialog",1,"General","DATESFILLTYPE",filType)
      'Լրացնում է "Մարման օրեր" դաշտը
      Call Rekvizit_Fill("Dialog",1,"General","FIXEDDAYS",fixDate)
      'Լրացնում է "Գումարների ամսաթվերի ընտրություն" դաշտը
      Call Rekvizit_Fill("Dialog",1,"General","SUMSDATESFILLTYPE",sumType)
      'Լրացնում է "Գումարների բաշխման ձև"  դաշտը
      Call Rekvizit_Fill("Dialog",1,"General","SUMSFILLTYPE",agrtype)
      'Սեղմել "Կատարել" կոճակը
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'_____________________________________________________________________________________________________________________
'Պայմանագրի դադարեցում 
'---------------------------------------------------------------------------------------------------------------------
'termDate - Ամսաթիվ
'partlyTerm - Մասնակի դադարեցում
'summa - գումար
Sub Contract_Termination(fBASE,termDate,partlyTerm,summa)
      BuiltIn.Delay(1000)
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_AgrBreak)
      BuiltIn.Delay(2000)
      fBase = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
      'Լրացնում է Ամսաթիվ դաշտը
      Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" & termDate)
      If partlyTerm Then
          'Լրացնում է Մասնակի դադարեցում նշիչը
          wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("CheckBox").Click()
          'Լրացնում է Գումար դաշտը
          Call Rekvizit_Fill("Document",1,"General","BRKSUM",summa)
      End If
      'Սեղմում է Կատարել կոճակը
      Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'-------------------------------------------------------------------------------------------------
'Ձևանմուշով ավանդային պայմանագրի ստեղծում
'-----------------------------------------------------------------------------------------------------------
'fBASE - Պայմանագրի ISN 
'contractNum - Պայամանագրի համար
'depositTemplate - Ձևանմուշի համար
'contractDate - Պայմանագրի ստեղշման ամսաթիվ
'ClientCode -  Հաճախորդի համար
'thirdPerson - Երրորդ անձ
'accAc - Հաշվարկային հաշիվ
'thirdAcc - Երրորդ անձի հաշիվ
'perAcc - Տոկոսների վճարման հաշիվ
'money - Գումար
'chbKap - Կապիտալացվող
'chbAuto - Պարտքերի ավտոմատ մարում
'chbEx - Երկարաձգում
'kindScale - Օրացույցի հաշվարկման ձև
'depositPer - Ավանդի տոկոսադրույք 
'part - բաժ.
'per - Վերահաշվարկի տոկոս
'dateAgr - Մարման ժամկետ 
Sub Deposit_Contract_Fill_with_Template(fBASE,contractNum,depositTemplate,contractDate, _
                          ClientCode,thirdPerson,accAc,thirdAcc,perAcc,money,chbKap,_
                          chbAuto,chbEx,kindScale,depositPer,part,per,dateAgr)

      p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("TDBDate").Keys(contractDate & "[Tab]")
      Call ClickCmdButton(2, "Î³ï³ñ»É")   
      Do Until wMDIClient.VBObject("frmPttel").VBObject("tdbgView").EOF
           BuiltIn.Delay(500)
           If wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(6) = depositTemplate Then
               Call wMainForm.MainMenu.Click(c_AllActions)
               Call wMainForm.PopupMenu.Click(c_CreateAgr) 
               BuiltIn.Delay(2000)
               Exit Do
           Else
                wMDIClient.VBObject("frmPttel").VBObject("tdbgView").MoveNext   
           End If
      Loop
      'Ստանում է պայմանագրի ISN 
      fBASE = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
      'Ստանում է պայմանագրի համարը
      contractNum = Get_Rekvizit_Value("Document",1,"General","CODE")
      'Լրացնում է Հաճախորդի համար դաշտը
      Call Rekvizit_Fill("Document",1,"General","CLICOD",clientCode)
      'Լրացնում է Երրորդ անձ դաշտը
      Call Rekvizit_Fill("Document",1,"General","CLICOD3",thirdPerson)
      'Լրացնում է Հաշվարկային հաշիվ դաշտը
      Call Rekvizit_Fill("Document",1,"General","ACCACC",accAc)
      'Լրացնում է Երրորդ անձի հաշիվ դաշտը
      Call Rekvizit_Fill("Document",1,"General","ACCACC3",thirdAcc)
      'Լրացնում է Տոկոսների վճարման հաշիվ դաշտը
      Call Rekvizit_Fill("Document",1,"General","ACCACCPR",perAcc)
      'Լրացնում է Գումար դաշտը
      Call Rekvizit_Fill("Document",1,"General","SUMMA",money)
      'Լրացնում է Կապիտալացվող դաշտը
      Call Rekvizit_Fill("Document",1,"CheckBox","AUTOCAP",chbKap)
      'Լրացնում է Պարտքերի ավտոմատ մարում դաշտը
      Call Rekvizit_Fill("Document",1,"CheckBox","AUTODEBT",chbAuto)
      'Լրացնում է Երկարաձգում դաշտը
      Call Rekvizit_Fill("Document",1,"CheckBox","AUTOPROLONG",chbEx)
      'Լրացնում է Օրացույցի հաշվարկման ձև դաշտը
      Call Rekvizit_Fill("Document",2,"General","KINDSCALE",kindScale)
      'Լրացնում է Ավանդի տոկոսադրույք դաշտը
      Call Rekvizit_Fill("Document",2,"General","PCAGR",depositPer)
      'Լրացնում է բաժ. դաշտը
      Call Rekvizit_Fill("Document",2,"General","PCAGR",part)
      'Լրացնում է Վերահաշվարկի տոկոս դաշտը
      Call Rekvizit_Fill("Document",2,"General","PCBREAK",per)
      'Լրացնում է բաժ. դաշտը
      Call Rekvizit_Fill("Document",2,"General","PCBREAK",part)
      'Լրացնում է Մարման ժամկետ դաշտը
      Call Rekvizit_Fill("Document",4,"General","DATEAGR","![End]" & "[Del]" & dateAgr)
      'Սեղմել Կատարել կոճակը
      Call ClickCmdButton(1, "Î³ï³ñ»É")

End Sub

'--------------------------------------------------------------------------------------------
'Խմբային հաշվարկ
'--------------------------------------------------------------------------------------------
'closeDate - Հաշվարկման ամսաթիվ
'setDate - Ձևակերպման ամսաթիվ 
'cap - Տոկոսների կապիտալացում
'ext - Երկարաձգում 
'rep -  Պարտքերի մարում
'per - Տոկոսների խմբային նշանակում 
'perCalc - Տոկոսների հաշվարկում
'close - Պայմանագրի փակում 

Sub Group_Calculate(closeDate,setDate,cap,ext,rep,per,perCalc,close)

    BuiltIn.Delay(2000)
    'Նշել բոլոր պայմանագրերը
    Call wMainForm.MainMenu.Click(c_Editor & "|" & c_MarkAll)
    'Խմբային հածվարկ
    Call wMainForm.MainMenu.Click(c_AllActions)  
    Call wMainForm.PopupMenu.Click(c_GroupCalc)
    BuiltIn.Delay(2000)
    
    'Լրացնել Հաշվարկման ամսաթիվ դաշտը 
    Call Rekvizit_Fill("Dialog",1,"General","CLOSEDATE","![End]" & "[Del]" & closeDate)
    'Լրացնել Ձևակերպման ամսաթիվ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SETDATE","![End]" & "[Del]" & setDate)
    'Դնել Տոկոսների կապիտալացում նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","CAP",cap)
    'Դնել Երկարաձգում նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","PROL",ext)
    'Դնել Պարտքերի մարում նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DBT",rep)
    'Դնել Տոկոսների խմբային նշանակում նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","PC",per)
    'Դնել Տոկոսների հաշվարկում նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","CHG",perCalc)
    'Դնել Պայմանագրի փակում նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","CLS",close)
  
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    Call ClickCmdButton(5, "²Ûá")
  
End Sub

'----------------------------------------------------------
'Խմբային տոկոսների հաշվարկ
'-------------------------------------------------------------
'closeDate - Հաշվարկման ամսաթիվ
'setDate - Ձևակերպման ամսաթիվ
Sub Group_Persent_Calculate(closeDate,setDate)

    BuiltIn.Delay(2000)
    'Նշել բոլոր պայմանագրերը
    Call wMainForm.MainMenu.Click(c_Editor & "|" & c_MarkAll)
    'Խմբային հածվարկ
    Call wMainForm.MainMenu.Click(c_AllActions)  
    Call wMainForm.PopupMenu.Click(c_GroupCalc)
    BuiltIn.Delay(2000)
    'Լրացնել Հաշվարկման ամսաթիվ դաշտը 
    Call Rekvizit_Fill("Dialog",1,"General","CLOSEDATE","![End]" & "[Del]" & closeDate)
    'Լրացնել Ձևակերպման ամսաթիվ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SETDATE","![End]" & "[Del]" & setDate)
    'Դնել Տոկոսների հաշվարկում նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","CHG",1)

    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    Call ClickCmdButton(5, "²Ûá")
  
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''SearchInModalBrowser''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Modal Browser-ում տողի փնտրման ֆունկցիա
'Ֆունկցիան վերադարձնում է true եթե տողը գտնվել է, և false եթե չի գտնվել 
'searchValue - փնտրվող արժեքը
'colItem - սյան համարը
Function SearchInModalBrowser(searchValue, colItem)
  Dim state : state = false 
  Do Until p1.frmModalBrowser.VBObject("tdbgView").EOF    
    If Trim(searchValue) = Trim(p1.frmModalBrowser.VBObject("tdbgView").Columns.Item(colItem).Text) Then
      Call p1.frmModalBrowser.VBObject("tdbgView").Keys("[Enter]")      
      state = true
      exit do
    Else
      Call p1.frmModalBrowser.VBObject("tdbgView").MoveNext
    End If    
  Loop  
  SearchInModalBrowser = state
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''Delete_AgreementAllOperations''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Պրոցեդուրան ջնջում է պայմանագրի բոլոր գործողությունները
'folderName - ջնջվող պայմանագրի գտնվելու ճանապարհն է
'AgreeAllOperations - բացվող դիալոգային պատուհանում լրացվող տվյալների կլասն է -  New_AgreementAllOperations()
'colNum - սյան համարը 
'colValue - սյան փնտրվող արժեքը
Sub Delete_AgreementAllOperations(folderName, AgreeAllOperations, frmPttel, colNum, colValue)
    Dim item
    wTreeView.DblClickItem(folderName & "¶áñÍáÕáõÃÛáõÝÝ»ñ, ÷á÷áËáõÃÛáõÝÝ»ñ|ä³ÛÙ³Ý³·ñÇ µáÉáñ ·áñÍáÕáõÃÛáõÝÝ»ñ")
    If p1.WaitVBObject("frmAsUstPar", 3000).Exists then
        Call Fill_AgreementAllOperations(AgreeAllOperations)
        Call ClickCmdButton(2, "Î³ï³ñ»É")
    Else 
        Log.Error "Can't open frmAsUstPar window.", "", pmNormal, ErrorColor
    End if
    If wMDIClient.WaitVBObject(frmPttel, 3000).Exists then
      For Each item In colValue
          wMDIClient.VBObject(frmPttel).Keys("^r")
          BuiltIn.Delay(2000)    
          Call SearchAndDelete_Desc(frmPttel, colNum, item, "Ð³ëï³ï»ù ÷³ëï³ÃÕÃÇ çÝç»ÉÁ")
      Next
  		BuiltIn.Delay(3000)
      wMDIClient.VBObject(frmPttel).Close()
    Else
      Log.Error "Can't open frmPttel window.", "", pmNormal, ErrorColor
    End If
End Sub

'---------------------------------------------------------------------------
' Փնտրում և հեռացնում է տողը pttel-ից
'---------------------------------------------------------------------------
' PttelName - համապատասխան Pttel-ի անունը (օր.՝"frmPttel", "frmPttel_2")
' ColumnN - Թղթապանակում սյան համարը
' SearchValue - փնտրվող արժեքը
' ExpectedMessage - սպասվող հաղորդագրություն
Sub SearchAndDelete_Desc( PttelName, ColumnN, SearchValue, ExpectedMessage)
    If SearchInPttel_Desc(PttelName,ColumnN, SearchValue) Then
        Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
        BuiltIn.Delay(delay_small) 
        Call MessageExists(1, ExpectedMessage)
        Call ClickCmdButton(3, "²Ûá") 
    Else
 		    Log.Error "Can Not find this row!", "", pmNormal, ErrorColor
    End If 
End Sub 

'---------------------------------------------------------------------------
' տողի առկա լինելը ստուգող ֆունկցիա
'---------------------------------------------------------------------------
' PttelName - համապատասխան Pttel-ի անունը (օր.՝"frmPttel", "frmPttel_2")
' colN - Թղթապանակում սյան համարը
' SearchValue - փնտրվող արժեքը
Function SearchInPttel_Desc(PttelName, colN, SearchValue)

      Dim i, tdbgView, status
      status = False
      Set tdbgView = wMDIClient.VBObject(PttelName).VBObject("tdbgView")

      tdbgView.Keys("[End]")
      For i = 0 to tdbgView.ApproxCount - 1
          If Trim(tdbgView.Columns.Item(colN).Value) = Trim(SearchValue)  Then
              status = True           
          Else
              If i < tdbgView.ApproxCount - 1 Then
                  tdbgView.Keys("[Up]")
              End If    
          End If
      Next 
     SearchInPttel_Desc =  status
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''OneTimeDeposit'''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'OneTimeDeposit - Միանգամյա ավանդ-ի լրացման կլասը
Class OneTimeDeposit
  public ISN
  public general
  public interests
  public fines
  public dates
  public additional
  public statement
  public notes
  public attachments
  private sub Class_Initialize()
    ISN = ""
    Set general = New_General_1TimeDeposit()
    Set interests = New_Interests_1TimeDeposit()
    Set fines = New_Fines_1TimeDeposit()
    Set dates = New_Dates_1TimeDeposit()
    Set additional = New_Additional_1TimeDeposit()
    Set statement = New_Statement_1TimeDeposit()
    Set notes = New_Notes_1TimeDeposit()
    Set attachments = New_Attachments_1TimeDeposit()
  end sub
End Class  

Function New_OneTimeDeposit()
  Set New_OneTimeDeposit = new OneTimeDeposit
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''Fill_DepositContract'''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Միանգամյա ավանդի լրացման պրոցեդուրան է
'OneTimeDeposit_data - 'Միանգամյա ավանդի լրացման կլասն է
Sub Fill_DepositContract(OneTimeDeposit_data)
  OneTimeDeposit_data.ISN = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
  If OneTimeDeposit_data.general.fillGeneral Then 
    Call Fill_General_1TimeDeposit(OneTimeDeposit_data.general)
  End If
  If OneTimeDeposit_data.interests.fillInterests Then 
    Call Fill_Interests_1TimeDeposit(OneTimeDeposit_data.interests)
  End If 
  If OneTimeDeposit_data.fines.fillFines Then 
    Call Fill_Fines_1TimeDeposit(OneTimeDeposit_data.fines)
  End If 
  If OneTimeDeposit_data.dates.fillDates Then 
    Call Fill_Dates_1TimeDeposit(OneTimeDeposit_data.dates)
  End If
  If OneTimeDeposit_data.additional.fillAdditional Then 
    Call Fill_Additional_1TimeDeposit(OneTimeDeposit_data.additional)
  End If 
  If OneTimeDeposit_data.statement.fillStatement Then 
    Call Fill_Statement_1TimeDeposit(OneTimeDeposit_data.statement)
  End If
  If OneTimeDeposit_data.notes.fillNotes Then 
    ' here must be fill function for Notes fill
  End If
  If OneTimeDeposit_data.attachments.fillAttachments Then 
    ' here must be fill function for Attachments fill
  End If 
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''CreateNewDepositContract'''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Պրոցեդուրան ստեղծում է նոր Միանգամյա ավանդ
'folderName - պայմանագրի գտնվելու ճանապարհը
'typeName - պայմանագրի ստեղծման տարբերակը(օր.՝ դատարկ պայմանագիր)
'depositContractType - պայմանագրի տարբերակը ՝ Միանգամյա ավանդ
'AgreementFill - Միանգամյա ավանդ-ի լրացման կլասը
Sub CreateNewDepositContract(folderName, typeName, depositContractType, AgreementFill)
  wTreeView.DblClickItem(folderName & typeName)
  BuiltIn.Delay(2000)
  If p1.WaitVBObject("frmModalBrowser", 3000).Exists Then 
    Call SearchInModalBrowser(depositContractType, 1)
  Else
    Log.Error "Can't open " & typeName, "", pmNormal, ErrorColor
  End If
  If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then 
    Call Fill_DepositContract(AgreementFill)
    Call ClickCmdButton(1, "Î³ï³ñ»É")
  Else
    Log.Error "Can't open " & depositContractType & "window.", "", pmNormal, ErrorColor
  End If
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''Notes_1TimeDeposit'''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Notes_1TimeDeposit - Միանգամյա ավանդ-ի Նշումեր բաժնի լրացման կլասը
Class Notes_1TimeDeposit
  public fillNotes  
  private sub Class_Initialize()
    fillNotes = 1    
  end sub
End Class

Function New_Notes_1TimeDeposit()
  Set New_Notes_1TimeDeposit = new Notes_1TimeDeposit
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''Attachments_1TimeDeposit''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Attachments_1TimeDeposit - Միանգամյա ավանդ-ի Կցված բաժնի լրացման կլասը
Class Attachments_1TimeDeposit
  public fillAttachments
  private sub Class_Initialize()
    fillAttachments = 1    
  end sub
End Class

Function New_Attachments_1TimeDeposit()
  Set New_Attachments_1TimeDeposit = new Attachments_1TimeDeposit
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''General_1TimeDeposit'''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'General_1TimeDeposit - Միանգամյա ավանդ-ի Ընդհանուր բաժնի լրացման կլասը
Class General_1TimeDeposit
  public fillGeneral
  public agreementN
  public templateN
  public client
  public thirdPerson
  public expName
  public name
  public curr
  public repaymentCurrency
  public settlementAccount
  public thirdPersonsAccount
  public interestRepayAccount
  public amount
  public commnet
  public chargeFirstDay
  public capitalized
  public automaticallyPaym
  public prologation
  public signingDate
  public division
  public department 
  public accessType
  Private Sub Class_Initialize()
    fillGeneral = 1
    agreementN = ""
    templateN = ""
    client = ""
    thirdPerson = ""
    expName = ""
    name = ""
    curr = ""
    repaymentCurrency = ""
    settlementAccount = ""
    thirdPersonsAccount = ""
    interestRepayAccount = ""
    amount = ""
    commnet = ""
    chargeFirstDay = 0
    capitalized = 0
    automaticallyPaym = 0
    prologation = 0
    signingDate = ""
    division = ""
    department = ""
    accessType = ""
  End Sub
End Class

Function New_General_1TimeDeposit()
  Set New_General_1TimeDeposit = new General_1TimeDeposit
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''Fill_General_1TimeDeposit'''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Միանգամյա ավանդի ընդհանուր բաժնի լրացման պրոցեդուրան է
'general - Միանգամյա ավանդի Ընդհանուր բաժնի լրացման կլասն է
Sub Fill_General_1TimeDeposit(general)
  If OneTimeDeposit_data = "" Then
    'Լրացնում է պայմանագրի N դաշտը
    general.agreementN = Get_Rekvizit_Value("Document",1,"General","CODE")
  Else
    'Լրացնում է պայմանագրի N դաշտը
    Call Rekvizit_Fill("Document", 1, "General", "CODE", "![End]" & "[Del]" & general.agreementN)
  End If
  'Լրացնում է Ձևանմուշի N դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "AGRTYPE", general.templateN)
  'Լրացնում է Հաճախորդի դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "CLICOD", general.client)
  'Լրացնում է Երրորդ անձ դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "CLICOD3", general.thirdPerson)
  'Ստուգում է Անվանում դաշտի արժեքը և լրացնում է Անվանում դաշտի արժեքը
  Call Compare_Two_Values("Անվանում", Get_Rekvizit_Value("Document", 1, "General", "NAME"), general.expName)
  Call Rekvizit_Fill("Document", 1, "General", "NAME", "![End]" & "[Del]" & general.name)
  'Լրացնում է Արժույթ դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "CURRENCY", general.curr)
  'Լրացնում է Մարման արժույթ դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "REPAYCURR", general.repaymentCurrency)
  'Լրացնում է Հաշվարկային հաշիվ դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "ACCACC", general.settlementAccount)
  'Լրացնում է Երրորդ անձի հաշիվ դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "ACCACC3", general.thirdPersonsAccount)
  'Լրացնում է Տոկոսների վճարման հաշիվ դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "ACCACCPR", general.interestRepayAccount)
  'Լրացնում է Գումար դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "SUMMA", general.amount)
  'Լրացնում է Մեկնաբանություն դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "COMMENT", general.commnet)
  'Լրացնում է Առաջին օրը հաշվարկել տոկոս դաշտը
'  Call Rekvizit_Fill("Document", 1, "CheckBox", "CHRGFIRSTDAY", general.chargeFirstDay)
  Call Check_ReadOnly("Document", 1, "CheckBox", "CHRGFIRSTDAY", true)
  'Լրացնում է Կապիտալացվող դաշտը
  Call Rekvizit_Fill("Document", 1, "CheckBox", "AUTOCAP", general.capitalized)
  'Լրացնում է Պարտքերի ավտոմատ մարում դաշտը
  Call Rekvizit_Fill("Document", 1, "CheckBox", "AUTODEBT", general.automaticallyPaym)
  'Լրացնում է Երկարաձգում դաշտը
  Call Rekvizit_Fill("Document", 1, "CheckBox", "AUTOPROLONG", general.prologation)
  'Ստուգում է Կնքման ամսաթիվ դաշտի արժեքը և լրացնում է Կնքման ամսաթիվ դաշտը
  Call Compare_Two_Values("Կնքման ամսաթիվ", Get_Rekvizit_Value("Document", 1, "General", "DATE"), Date())
  Call Rekvizit_Fill("Document", 1, "General", "DATE", "![End]" & "[Del]" & general.signingDate)
  'Լրացնում է Գրասենյակ դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "ACSBRANCH", general.division)
  'Լրացնում է Բաժին դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "ACSDEPART", general.department)
  'Լրացնում է Հասան-ն տիպ դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "ACSTYPE", general.accessType)
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''Interests_1TimeDeposit'''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Interests_1TimeDeposit - Միանգամյա ավանդ-ի Տոկոսներ բաժնի լրացման կլասը
Class Interests_1TimeDeposit
  public fillInterests
  Public kindOfScale
  Public depositRate
  Public depositeRateDiv
  Public expDepositRate
  Public expDepositRateDiv
  Public setScaleOfInterestRatesCB
  Public setScaleOfInterestRates
  Public rateOffset
  Public typeOfFloatingRate
  Public offset
  Public beginningDate
  Public floatingRatePeriodicity
  Public floatingRatePeriodicity_months
  Public dayOverpassingMethode
  Public ovrDays
  Public scopeOfInterestsRate
  Public scopeOfInterestsRate_To
  Public recalculateRate
  Public recalculateRate_div
  Public taxRate
  Public perPaidAtPeriodBeginning
  Public effectiveRate
  Public actRate
  Public effectiveRateAutoCalc
  Private Sub Class_Initialize()
    fillInterests = 1
    kindOfScale = ""
    depositRate = ""
    depositeRateDiv = ""
    expDepositRate = ""
    expDepositRateDiv = ""
    setScaleOfInterestRatesCB = 0
    setScaleOfInterestRates = ""
    rateOffset = ""
    typeOfFloatingRate = ""
    offset = ""
    beginningDate = ""
    floatingRatePeriodicity = ""
    floatingRatePeriodicity_months = ""
    dayOverpassingMethode = ""
    ovrDays = ""
    scopeOfInterestsRate = ""
    scopeOfInterestsRate_To = ""
    recalculateRate = ""
    recalculateRate_div = ""
    taxRate = ""
    perPaidAtPeriodBeginning = 0
    effectiveRate = ""
    actRate = ""
    effectiveRateAutoCalc = 0
  End Sub
End Class

Function New_Interests_1TimeDeposit()
  Set New_Interests_1TimeDeposit = new Interests_1TimeDeposit
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''Fill_General_1TimeDeposit'''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Միանգամյա ավանդի Տոկոսներ բաժնի լրացման պրոցեդուրան է
'interests - Միանգամյա ավանդի Տոկոսներ բաժնի լրացման կլասն է
Sub Fill_Interests_1TimeDeposit(interests)
    'Լրացնում է Օրացույցի հաշվարկման ձև դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "KINDSCALE", interests.kindOfScale)
    'Լրացնում է Ավանդի տոկոսադրույք դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "PCAGR", interests.depositRate  & "[Tab]" & interests.depositeRateDiv)
    'Լրացնում է Նշանակել տոկոսադրույքի սանդղակ նշիչը
    Call Rekvizit_Fill("Document", 2, "CheckBox", "WITHSCALE", interests.setScaleOfInterestRatesCB)
    If interests.setScaleOfInterestRatesCB = 1 then 
        'Լրացնում է Նշանակել տոկոսադրույքի սանդղակ դաշտը
        Call Rekvizit_Fill("Document", 2, "General", "SCALE", interests.setScaleOfInterestRates)
        Call Check_ReadOnly("Document", 2, "General", "PCAGR", true)
        Call Compare_Two_Values("Ավանդի տոկոսադրույք", Get_Rekvizit_Value("Document", 2, "Course", "PCAGR"), interests.expDepositRate & "/" & interests.expDepositRateDiv)
    Else
        Call Check_ReadOnly("Document", 2, "General", "SCALE", true)
    End If
    'Լրացնում է Տոկոսադրույքի շեղում դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "PCDELTA", interests.rateOffset)
    'Լրացնում է Փոփոխական տոկոսադրույքի տեսակ դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "PCBASETYPE", interests.typeOfFloatingRate)
    'Լրացնում է Շեղում դաշտը
    Call Check_ReadOnly("Document", 2, "General", "PCBASEDELTA", true)
    Call Rekvizit_Fill("Document", 2, "General", "PCBASEDELTA", interests.offset)
    'Լրացնում է Փոփոխման սկիզբ դաշտը
    Call Check_ReadOnly("Document", 2, "General", "PCBASEDATE", true)
    Call Rekvizit_Fill("Document", 2, "General", "PCBASEDATE", interests.beginningDate)
    'Լրացնում է Փոփոխական տոկ. պարբերություն դաշտը
    Call Check_ReadOnly("Document", 2, "General", "PCBASEPERIOD", true)
    Call Rekvizit_Fill("Document", 2, "General", "PCBASEPERIOD", interests.floatingRatePeriodicity)
    'Լրացնում է Փոփոխական տոկ. պարբերություն ամիս դաշտը
    Call Check_ReadOnly("Document", 2, "General", "PCBASEPERIOD", true)
    Call Rekvizit_Fill("Document", 2, "General", "PCBASEPERIOD", interests.floatingRatePeriodicity_months)
    'Լրացնում է Շրջանցման ուղղություն դաշտը
    Call Check_ReadOnly("Document", 2, "General", "PCPASSOVDIRECTION", true)
    Call Rekvizit_Fill("Document", 2, "General", "PCPASSOVDIRECTION", interests.dayOverpassingMethode)
    'Լրացնում է Ուղղ. օր դաշտը
    Call Check_ReadOnly("Document", 2, "General", "PCPASSOVTYPE", true)
    Call Rekvizit_Fill("Document", 2, "General", "PCPASSOVTYPE", interests.ovrDays)
    'Լրացնում է Տոկոսադրույքի սահման դաշտը
    Call Check_ReadOnly("Document", 2, "General", "PCAGRMIN", true)
    Call Rekvizit_Fill("Document", 2, "General", "PCAGRMIN", interests.scopeOfInterestsRate)
    'Լրացնում է Տոկոսադրույքի սահման մինչև դաշտը
    Call Check_ReadOnly("Document", 2, "General", "PCAGRMAX", true)
    Call Rekvizit_Fill("Document", 2, "General", "PCAGRMAX", interests.scopeOfInterestsRate_To)
    'Լրացնում է Վերահաշվարկի տոկոս դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "PCBREAK", interests.recalculateRate  & "[Tab]" & interests.recalculateRate_div)
    'Լրացնում է Հարկի տոկոս դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "TAXVALUE", interests.taxRate)
    'Լրացնում է Տոկոսները վճարվում են ժամանակաշրջանի սկզբում դաշտը
    Call Rekvizit_Fill("Document", 2, "CheckBox", "PAYPERGIVE", interests.perPaidAtPeriodBeginning)
    'Լրացնում է Արդյունավետ տոկոսադրույք դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "PCNDER", interests.effectiveRate)
    'Լրացնում է Փաստ. տոկոս. դաշտը
    Call Rekvizit_Fill("Document", 2, "General", "PCNDERALL", interests.actRate)
    'Լրացնում է Արդյունավետ տոկոս. ավտոմատ հաշվարկում դաշտը
    Call Rekvizit_Fill("Document", 2, "CheckBox", "PCNDERAUTO", interests.effectiveRateAutoCalc)
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''Fines_1TimeDeposit''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Fines_1TimeDeposit - Միանգամյա ավանդ-ի Տույժեր բաժնի լրացման կլասը
Class Fines_1TimeDeposit
  public fillFines 
  Public fineOnPastDueSum      
  Public fineOnPastDueSum_div
  Public fineOnPastDuePercent
  Public fineOnPastDuePercent_div
  Private Sub Class_Initialize()
    fillFines = 1
    fineOnPastDueSum = ""
    fineOnPastDueSum_div = ""
    fineOnPastDuePercent = ""
    fineOnPastDuePercent_div = ""
  End Sub
End Class 

Function New_Fines_1TimeDeposit()
  Set New_Fines_1TimeDeposit = new Fines_1TimeDeposit
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''Fill_Fines_1TimeDeposit''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Միանգամյա ավանդի Տույժեր բաժնի լրացման պրոցեդուրան է
'fines - Միանգամյա ավանդի Տույժեր բաժնի լրացման կլասն է
Sub Fill_Fines_1TimeDeposit(fines)
  'Լրացնում է Ժամկետանց գումարի տույժ դաշտը
  Call Rekvizit_Fill("Document", 3, "General", "PCPENAGR", fines.fineOnPastDueSum & "[Tab]" & fines.fineOnPastDueSum_div)
  'Լրացնում է Ժամկետանց տոկոսի տույժ դաշտը
  Call Rekvizit_Fill("Document", 3, "General", "PCPENPER", fines.fineOnPastDuePercent & "[Tab]" & fines.fineOnPastDuePercent_div)
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''dateFill''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'dateFill - Ամսաթվերի լրացում պատուհանի դաշտերի լրացման կլասը
Class dateFill
  public startDate
  public adding
  public paragraph_mounth
  public paragraph_day
  public repaymentDays
  public check
  public detourDirection
  public dirDay
  private Sub Class_Initialize()
    startDate = ""
    adding = 0 
    paragraph_mounth = ""
    paragraph_day = ""
    repaymentDays = ""
    check = 0
    detourDirection = "0"
    dirDay = "0"
  End Sub
End Class

Function New_DateFill()
  Set New_DateFill = new dateFill
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''Fill_dateFillWin''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Ամսաթվերի լրացում պատուհանի դաշտերի լրացման պրոցեդուրան է
'dateFill_win - Ամսաթվերի լրացում պատուհանի դաշտերի լրացման կլասը
Sub Fill_dateFillWin(dateFill_win)
    Call Rekvizit_Fill("Dialog", 1, "General", "FIRSTDAY", "![End]" & "[Del]" & dateFill_win.startDate)
    Call Rekvizit_Fill("Dialog", 1, "CheckBox", "INCLFD", dateFill_win.adding)
    Call Rekvizit_Fill("Dialog", 1, "General", "PERIODICITY", dateFill_win.paragraph_mounth & "[Tab]" & dateFill_win.paragraph_day)
    Call Rekvizit_Fill("Dialog", 1, "General", "FIXEDDAYS", dateFill_win.repaymentDays)
    Call Rekvizit_Fill("Dialog", 1, "CheckBox", "INCLFIXD", dateFill_win.check)
    Call Rekvizit_Fill("Dialog", 1, "General", "PASSOVDIRECTION", dateFill_win.detourDirection)
    Call Rekvizit_Fill("Dialog", 1, "General", "PASSOVTYPE", dateFill_win.dirDay)
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''Dates_1TimeDeposit'''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Dates_1TimeDeposit - Միանգամյա ավանդ-ի Ժամկետներ բաժնի լրացման կլասը
Class Dates_1TimeDeposit
  public fillDates
  Public disbursemenDate
  Public maturityDate
  Public fixedInterests
  Public dateFill
  Public dateFill_win
  Public inPayDate
  Public fillInterestSum
  Private Sub Class_Initialize()
    fillDates = 1 
    disbursemenDate = ""
    maturityDate = ""
    fixedInterests = 0
    dateFill = 0
    Set dateFill_win = New_DateFill()
    Set inPayDate = New_InPayDate_1TimeDeposit()
    fillInterestSum = 0
  End Sub
End Class

Function New_Dates_1TimeDeposit()
  Set New_Dates_1TimeDeposit = new Dates_1TimeDeposit
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''Fill_Dates_1TimeDeposit'''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Միանգամյա ավանդի Ժամկետներ բաժնի լրացման պրոցեդուրան է
'dates - Միանգամյա ավանդի Ժամկետներ բաժնի լրացման կլասն է
Sub Fill_Dates_1TimeDeposit(dates)

  Dim obj
  'Լրացնում է Հատկացման ամսաթիվ դաշտը
  Call Rekvizit_Fill("Document", 4, "General", "DATEGIVE", dates.disbursemenDate)
  'Լրացնում է Մարման ժամկետ դաշտը
  Call Rekvizit_Fill("Document", 4, "General", "DATEAGR", dates.maturityDate)
  'Լրացնում է Հաստատագրված տոկոսագումարներ դաշտը
  If dates.fixedInterests = 1 Then
      Call Rekvizit_Fill("Document", 4, "CheckBox", "CONSTPER", dates.fixedInterests)
  End If
  'Լրացնում է Ամսաթվերի լրացում դաշտը
  If dates.dateFill = 1 then 
    'Լրացնում է Ամսաթվերի լրացում դաշտը
    obj = GetVBObject("AUTODATE", wMDIClient.vbObject("frmASDocForm"))
    wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_4").VBObject(obj).Click()
    
    If p1.WaitVBObject("frmAsUstPar", 2000).Exists then
      'Լրացնում է Ամսաթվերի լրացում պատուհանը
      Call Fill_dateFillWin(dates.dateFill_win)
      Call ClickCmdButton(2, "Î³ï³ñ»É")
    Else
      Log.Error "Can't open frmAsUstPar window.", "", pmNormal, ErrorColor
    End if
  End if
  'Լրացնում է Տոկոսագումարների լրացում դաշտը 
  If dates.fixedInterests then
    Call Rekvizit_Fill("Document", 4, "CheckBox", "REFRPERSUM", dates.fillInterestSum)
  End If
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''Additional_1TimeDeposit''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Additional_1TimeDeposit - Միանգամյա ավանդ-ի Լրացուցիչ բաժնի լրացման կլասը
Class Additional_1TimeDeposit
  public fillAdditional
  Public sector
  Public project_
  Public region
  Public note
  Public note2
  Public note3
  Public thePerOfTheAToBeRBDD
  Public agreePaperN
  Public closingDate
  Private Sub Class_Initialize()
    fillAdditional = 1
    sector = ""
    project_ = ""
    region = ""
    note = ""
    note2 = ""
    note3 = ""
    thePerOfTheAToBeRBDD = ""
    agreePaperN = ""
    closingDate = ""
  End Sub  
End Class

Function New_Additional_1TimeDeposit()
  Set New_Additional_1TimeDeposit = new Additional_1TimeDeposit
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''Fill_Additional_1TimeDeposit''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Միանգամյա ավանդի Լրացուցիչ բաժնի լրացման պրոցեդուրան է
'additional - Միանգամյա ավանդի Լրացուցիչ բաժնի լրացման կլասն է
Sub Fill_Additional_1TimeDeposit(additional)
  'Լրացնում է Ճյուղայնություն դաշտը
  Call Rekvizit_Fill("Document", 5, "General", "SECTOR", additional.sector)
  'Լրացնում է Ծրագիր դաշտը
  Call Rekvizit_Fill("Document", 5, "General", "SCHEDULE", additional.project_)
  'Լրացնում է Մարզ դաշտը
  Call Rekvizit_Fill("Document", 5, "General", "LRDISTR", additional.region)
  'Լրացնում է Նշում դաշտը
  Call Rekvizit_Fill("Document", 5, "General", "NOTE", additional.note)
  'Լրացնում է Նշում 2 դաշտը
  Call Rekvizit_Fill("Document", 5, "General", "NOTE2", additional.note2)
  'Լրացնում է Նշում 3 դաշտը
  Call Rekvizit_Fill("Document", 5, "General", "NOTE3", additional.note3)
  'Լրացնում է ժամկետից շուտ մարման ենթակա գումարի չափ դաշտը
  Call Rekvizit_Fill("Document", 5, "General", "REPAYADVANCE", additional.thePerOfTheAToBeRBDD)
  'Լրացնում է Պայմ. թղթային N դաշտը
  Call Rekvizit_Fill("Document", 5, "General", "PPRCODE", additional.agreePaperN)
  'Լրացնում է Փակման ամսաթիվ դաշտը
'  Call Rekvizit_Fill("Document", 5, "General", "DATECLOSE", additional.closingDate)
  Call Check_ReadOnly("Document", 5, "General", "DATECLOSE", true)
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''Statement_1TimeDeposit''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Statement_1TimeDeposit - Միանգամյա ավանդ-ի Քաղվածք բաժնի լրացման կլասը
Class Statement_1TimeDeposit
  public fillStatement
  Public deliverStateMode
  Public sendStateAddress
  Public deliverStateModeToTPerson
  Public sendStmAdrToTPerson
  Public startDate
  Public periodicity_months
  Public periodicity_days
  Public datePeriodDifference
  Public nonDaysAvoiding
  Public LatestStateDate
  Public LatestStateNum
  Private Sub Class_Initialize()
    fillStatement = 1
    deliverStateMode = ""
    sendStateAddress = ""
    deliverStateModeToTPerson = ""
    sendStmAdrToTPerson = ""
    startDate = ""
    periodicity_months = ""
    periodicity_days = ""
    datePeriodDifference = ""
    nonDaysAvoiding = ""
    LatestStateDate = ""
    LatestStateNum = ""
  End Sub
End Class

Function New_Statement_1TimeDeposit()
  Set New_Statement_1TimeDeposit = new Statement_1TimeDeposit
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''Fill_Statement_1TimeDeposit''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Միանգամյա ավանդի Քաղվածք բաժնի լրացման պրոցեդուրան է
'statement - Միանգամյա ավանդի Քաղվածք բաժնի լրացման կլասն է
Sub Fill_Statement_1TimeDeposit(statement)
  'Լրացնում է Քաղվածքի տրամադրման ձև դաշտը
  Call Rekvizit_Fill("Document", 6, "General", "DLVSTMVIEW", statement.deliverStateMode)
  'Լրացնում է Քաղվածքի ուղարկման հասցե դաշտը
  Call Rekvizit_Fill("Document", 6, "General", "SENDSTMADRS", statement.sendStateAddress)
  'Լրացնում է Քաղվածքի տրամադրման ձև երրորդ անձին դաշտը
  Call Rekvizit_Fill("Document", 6, "General", "DLVSTMVIEW3", statement.deliverStateModeToTPerson)
  'Լրացնում է Քաղվածքի ուղարկման հասցե երրորդ անձին դաշտը
  Call Rekvizit_Fill("Document", 6, "General", "SENDSTMADRS3", statement.sendStmAdrToTPerson)
  'Լրացնում է Սկզբի ամսաթիվ դաշտը
  Call Rekvizit_Fill("Document", 6, "General", "SDATE", statement.startDate)
  'Լրացնում է Պարբերություն ամիս դաշտը
  Call Rekvizit_Fill("Document", 6, "General", "PERIODICITY", statement.periodicity_months & "[Tab]" & statement.periodicity_days)
  'Լրացնում է Ժամանակահատվածի շեղում դաշտը
  Call Rekvizit_Fill("Document", 6, "General", "DATEDIFF", statement.datePeriodDifference)
  'Լրացնում է Ոչ աշխատանքային օրերի շրջանցում դաշտը
  Call Rekvizit_Fill("Document", 6, "General", "NONWORKDAYS", statement.nonDaysAvoiding)
  'Լրացնում է Վերջին քաղվածքի ամսաթիվ դաշտը
  Call Rekvizit_Fill("Document", 6, "General", "STMDATE", statement.LatestStateDate)
  'Լրացնում է Վերջին քաղվածքի համար դաշտը
  Call Rekvizit_Fill("Document", 6, "General", "STMNUM", statement.LatestStateNum)
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''PercentCalculate_1TimeDeposit''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'PercentCalculate_1TimeDeposit - Միանգամյա ավանդի Տոկոսների հաշվարկի դիալոգային պատուհանի լրացման կլասը
Class PercentCalculate_1TimeDeposit
  public agreementN
  public calcDate
  public operDate
  public effInterests
  public interests
  public fineOnPastDueSum
  public fineOnPastDuePercent
  public totalInterest
  public totalPenalty
  public expComment
  public comment
  public division
  public department
  private Sub Class_Initialize()
    agreementN = ""
    calcDate = ""
    operDate = "" 
    effInterests = ""
    interests = ""
    fineOnPastDueSum = ""
    fineOnPastDuePercent = ""
    totalInterest = ""
    totalPenalty = ""
    expComment = "" 
    comment = ""
    division = ""
    department = ""
  End Sub
End Class

Function New_PercentCalculate_1TimeDeposit()
  Set New_PercentCalculate_1TimeDeposit = new PercentCalculate_1TimeDeposit
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''Fill_CalculatePercent_1TimeDeposit'''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Միանգամյա ավանդի Տոկոսների հաշվարկի դիալոգային պատուհանի լրացման պրոցեդուրան է
'percentCalculate - Միանգամյա ավանդի Տոկոսների հաշվարկի դիալոգային պատուհանի լրացման կլասը
Sub Fill_CalculatePercent_1TimeDeposit(percentCalculate)
  'Ստուգել Պայմանագրի N դաշտի արժեքը
  Call Compare_Two_Values("Պայմանագրի N", Get_Rekvizit_Value("Document", 1, "Mask", "CODE"), percentCalculate.agreementN)
  'Լրացնում է հաշվարկման ամսաթիվ դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATECHARGE", "![End]" & "[Del]" & percentCalculate.calcDate)
  'Լրացնում է գործողության ամսաթիվ դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "DATE", "![End]" & "[Del]" & percentCalculate.operDate)
  'Լրացնում է Արդյունավետ տոկոս դաշտը 
  Call Rekvizit_Fill("Document", 1, "General", "SUMEFFINC", percentCalculate.effInterests)
  'Լրացնում է Տոկոսագումար դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "SUMPER", percentCalculate.interests)
  'Լրացնում է Ժամկետանց գումարի տույժ դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "SUMAGRPEN", percentCalculate.fineOnPastDueSum)
  'Լրացնում է Ժամկետանց տոկոսի տույժ դաշտը 
  Call Rekvizit_Fill("Document", 1, "General", "SUMPERPEN", percentCalculate.fineOnPastDuePercent)
  'Լրացնում է Ընդամենը տոկոս դաշտը
  Call Check_ReadOnly("Document", 1, "General", "SUMALLPER", true)
  'Լրացնում է Ընդամենը տույժ դաշտը
  Call Check_ReadOnly("Document", 1, "General", "SUMALLPEN", true)
  'Ստուգում է և լրացնում Մեկնաբանություն դաշտը
  Call Compare_Two_Values("Մեկնաբանություն", Get_Rekvizit_Value("Document", 1, "General", "COMMENT"), percentCalculate.expComment)
  Call Rekvizit_Fill("Document", 1, "General", "COMMENT", "![End]" & "[Del]" & percentCalculate.comment)
  'Լրացնում է Գրասենյակ դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "ACSBRANCH", "![End]" & "[Del]" & percentCalculate.division)
  'Լրացնում է Բաժին դաշտը
  Call Rekvizit_Fill("Document", 1, "General", "ACSDEPART", "![End]" & "[Del]" & percentCalculate.department)  
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''calculatePercent_1TimeDeposit''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Միանգամյա ավանդի Տոկոսների հաշվարկի պրոցեդուրան է
'fBase - պատուհանի ISN-ի տվյալի պահպանման համար փոփոխական
'percentCalculate - Միանգամյա ավանդի Տոկոսների հաշվարկի դիալոգային պատուհանի լրացման կլասը
'state - լրացուցիչ դիալոգային պատուհանի հայտնվել
Sub calculatePercent_1TimeDeposit(fBase, percentCalculate, state)
  wMDIClient.Refresh
  BuiltIn.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Interests & "|" & c_PrcAccruing)
  BuiltIn.Delay(2000)
  
  fBase = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
  Call Fill_CalculatePercent_1TimeDeposit(percentCalculate)
  Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

' Ավանդի ներգրավում կատարելու համար նախատեսված կլաս
Class DepositInvolved
      Public wAction
      Public involveISN
      Public invDate
      Public wMoney
      Public cashORno
      Public wAcc
      Public wComment
      Public acsBranch
      Public acsDepart
      Public ExpectedMessage
      Public state
      Public wMoney2

      Private Sub Class_Initialize
              wAction = ""
              involveISN = ""
              invDate = ""
              wMoney = ""
              cashORno = ""
              wAcc = ""
              wComment = ""
              acsBranch = ""
              acsDepart = ""
              ExpectedMessage = ""
              state = False
              wMoney2 = ""
      End Sub
End Class

Function New_DepositInvolved()
      Set New_DepositInvolved= NEW DepositInvolved      
End Function

' Լրացնել "Ավանդի ներգրավում" փաստաթղթի դաշտերը
Sub Fill_DepositInvolved(DepositInvolved)
    Dim wStatus : wStatus = False
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(DepositInvolved.wAction)
    BuiltIn.Delay(2000)
    
    'Ստանում է պայմանագրի ISN 
    DepositInvolved.involveISN = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Լրացնում է Ամսաթիվ դաշտը
    Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" & DepositInvolved.invDate)
    'Լրացնում է Գումար դաշտը
    Call Rekvizit_Fill("Document",1,"General","SUMMA", DepositInvolved.wMoney)
    'Լրացնում է Կանխիկ/Անկանխիկ դաշտը
    Call Rekvizit_Fill("Document",1,"General","CASHORNO", DepositInvolved.cashORno)
    'Լրացնում է Հաշիվ դաշտը
    Call Rekvizit_Fill("Document",1,"General","ACCCORR", DepositInvolved.wAcc)
    'Լրացնում է Մեկնաբանություն դաշտը
    Call Rekvizit_Fill("Document",1,"General","COMMENT", DepositInvolved.wComment)
    'Լրացնում է Գրասենյակ դաշտը
    Call Rekvizit_Fill("Document",1,"General","ACSBRANCH", DepositInvolved.acsBranch)
    'Լրացնում է Բաժին դաշտը
    Call Rekvizit_Fill("Document",1,"General","ACSDEPART", DepositInvolved.acsDepart)
     
    'Սեղմում է Կատարել կոճակը
    Call ClickCmdButton(1, "Î³ï³ñ»É")

    If DepositInvolved.state Then
        If p1.WaitVBObject("frmAsMsgBox", 3000).Exists Then
        wStatus = MessageExists(2, DepositInvolved.ExpectedMessage)
        
        If wStatus Then
            Log.Message("Գումարային չափը մեծ է առավելագույն թույլատրելի սահմանաչափից")
            Call ClickCmdButton(5, "OK")
            BuiltIn.Delay(1000)
                
            'Լրացնում է Գումար դաշտը
            Call Rekvizit_Fill("Document",1,"General","SUMMA", DepositInvolved.wMoney2)
            'Սեղմում է Կատարել կոճակը
            Call ClickCmdButton(1, "Î³ï³ñ»É")
            End If
        End If
    End If
     
    If cashOrno = 1 Then
      
      BuiltIn.Delay(2000)
      'Ստանում է պայմանագրի համարը
      docNum = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      BuiltIn.Delay(1500)
      wMDIClient.VBObject("FrmSpr").Close()
        
    ElseIf  MessageExists(2,"²í³ñï»±É ·áñÍáÕáõÃÛáõÝÁ ³ÝÙÇç³å»ëª ÃÕÃ³ÏóáõÃÛáõÝÁ" & vbCrLf & "Ï³ï³ñ»Éáí Ñ³ßíÇ Ñ»ï." & vbCrLf & "" & vbCrLf & "      ² Ú à    -    ÃÕÃ³ÏóáõÃÛáõÝ Ñ³ßíÇ Ñ»ï" & vbCrLf & "      à â        -    ÷³ëï³ÃÕÃÇ áõÕ³ñÏáõÙ ÃÕÃ³å³Ý³ÏÝ»ñ") Then
      Call ClickCmdButton(5, "²Ûá")
    End If
      
End Sub

' Ավանդներ ներգրավված փաստաթղթի համար "Քաղվածք" գործողության կատարում
Class DepositContractStatement
      Public wAction
      Public frstDate
      Public lastDate
      Public giveState 
      Public showAMD
      Public showChrg
      Public showGrOper
      Public showTerms
      Public showInner
      Public agrTmp
      Public stateTimeOut

      Private Sub Class_Initialize
          wAction = ""
          frstDate = ""
          lastDate = ""
          giveState = ""
          showAMD = 0
          showChrg = 0
          showGrOper = 0
          showTerms = 0
          showInner = 0
          agrTmp = ""
          stateTimeOut = "90"
      End Sub
End Class

Function New_DepositContractStatement()
      Set New_DepositContractStatement = NEW DepositContractStatement      
End Function

' Լրացնել "Պայմանագրի քացվածք" փաստաթղթի դաշտերը
Sub Fill_DepositContractStatement(DepositContractStatement)
    Dim wStatus : wStatus = False
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(DepositContractStatement.wAction)
    BuiltIn.Delay(2000)
      
    ' Լրացնում է "Ժամանակահատվածի սկիզբ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","FRSTDATE","![End]" & "[Del]" & DepositContractStatement.frstDate)
    ' Լրացնում է "Ժամանակահատվածի ավարտ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","LASTDATE","![End]" & "[Del]" & DepositContractStatement.lastDate)
    ' Լրացնում է "Գործողություն" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","GIVESTATE", "![End]" & "[Del]" & DepositContractStatement.giveState)
    ' Լրացնում է "Ցույց տալ համարժեք ՀՀ դրամով" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWADM", DepositContractStatement.showAMD)
    ' Լրացնում է "Ցույց տալ տոկոսի հաշվարկեները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWCHRG", DepositContractStatement.showChrg)
    ' Լրացնում է "Ցույց տալ գործողությունները խմբավորված" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWGROUPOPER", DepositContractStatement.showGrOper)
    ' Լրացնում է "Ցույց տալ պայմանանների փոփոխությունները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWTERMS", DepositContractStatement.showTerms)
    ' Լրացնում է "Ցույց տալ ներքին վարկանիշները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWINNERRATINGS", DepositContractStatement.showInner)
    ' Լրացնում է "Քաղվածքի ձևանմուշ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","AGRTMP", DepositContractStatement.agrTmp)
    ' Լրացնում է "Քաղվածքի հաշվարկման ժամանակ(վրկ.)" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","STATETIMEOUT", "![End]" & "[Del]" &  DepositContractStatement.stateTimeOut)
     
    ' Սեղմում է Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''RepaymentSchedule_Assignment''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Մարման գրաֆիկի նշանակում գործողություն
'date - ամսաթիվ դաշտի լրացման արժեք
'dateFill_CB - ամսաթվերի լրացում նշիչի վիճակը
'dateFill_Win - Ամսաթվերի լրացում պատուհանի լրացման կլաս
'Base - Պատուհանի ISN
Sub RepaymentSchedule_Assignment(date, dateFill_CB, dateFill_Win, Base)
    Dim obj
    
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_RepaySchedule)
		  BuiltIn.Delay(2000)
    
    'Վերցնել պատուհանի ISN-ը
    Base = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Լրացնել Ամսաթիվ դաշտը 
    Call Rekvizit_Fill("Document", 1, "General", "DATE", "![End]" & "[Del]" & date)
		
    If dateFill_CB = 1 Then
        'Նշել Ամսաթվերի լրացում նշիչը
        obj = GetVBObject("AUTODATELC", wMDIClient.vbObject("frmASDocForm"))
        wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject(obj).Click()
    
        If p1.WaitVBObject("frmAsUstPar", 2000).Exists then
            'Լրացնել Ամսաթվերի լրացում պատուհանը
            Call Fill_dateFillWin(dateFill_win)
            Call ClickCmdButton(2, "Î³ï³ñ»É")
        End If
        Call ClickCmdButton(1, "Î³ï³ñ»É")
    End If
End	Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''Accrual_Of_Expenses'''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Ծախսերի հաշվեգրում գործողություն
'Base - Պատուհանի ISN
Sub Accrual_Of_Expenses(calcDate, operDate, interestExp, frazzle, Base)
		Call wMainForm.MainMenu.Click(c_AllActions)
		Call wMainForm.PopupMenu.Click(c_Opers)
		Call wMainForm.PopupMenu.Click(c_ExpAccum)
		BuiltIn.Delay(2000)
    
		If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
				' Վերցնել պատուհանի ISN-ը
				Base = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
				' Լրացնել Հաշվարկման ամսաթիվ դաշտը 
				Call Rekvizit_Fill("Document", 1, "General", "DATECHARGE", "![End]" & "[Del]" & calcDate)
				' Լրացնել Գործողության ամսաթիվ դաշտը 
				Call Rekvizit_Fill("Document", 1, "General", "DATE", "![End]" & "[Del]" & operDate)
				' Լրացնել Տոկոսային ծախս դաշտը 
				Call Rekvizit_Fill("Document", 1, "General", "SUMEFF", interestExp)
				' Լրացնել Մաշվածություն դաշտը 
				Call Rekvizit_Fill("Document", 1, "General", "SUMDIS", frazzle)
		
				Call ClickCmdButton(1, "Î³ï³ñ»É")
		Else
				Log.Error "Can't open frmASDocForm widow.", "", pmNormal, ErrorColor
		End If
End	Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''Reconclude''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Վերակնքում գործողություն
'LeaseAgree - Վարձակալության պայմանագրի լրացման կլաս
Sub Reconclude(LeaseAgree)
		Call wMainForm.MainMenu.Click(c_AllActions)
		Call wMainForm.PopupMenu.Click(c_Reconclude)		
		BuiltIn.Delay(2000)
    
		If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
				Call Fill_LeaseAgreements(LeaseAgree)
				Call ClickCmdButton(1, "Î³ï³ñ»É")
		Else 
				Log.Error "Can't open frmASDocForm widow.", "", pmNormal, ErrorColor
		End If
End	Sub

'--------------------------------------------------------
'"Ավանդներ (ներգրավված)|Պայմանագրեր" Deposit_Attracted - Class
'--------------------------------------------------------
Class Deposit_Attracted
    Public AgreementLevel
    Public AgreementSpecies
    Public AgreementN
    Public AgreementPaperN
    Public Curr
    Public Client
    Public ClientName
    Public Note
    Public Note2
    Public Note3
    Public ShowAccounts
    Public ShowClosed
    Public Division
    Public Department
    Public AccessType
    
    Private Sub Class_Initialize
       AgreementLevel = ""
       AgreementSpecies = ""
       AgreementN = ""
       AgreementPaperN = ""
       Curr = ""
       Client = ""
       ClientName = ""
       Note = ""
       Note2 = ""
       Note3 = ""
       ShowAccounts = 0
       ShowClosed = 1
       Division = ""
       Department = ""
       AccessType = ""
    End Sub  
End Class

Function New_Deposit_Attracted()
    Set New_Deposit_Attracted = NEW Deposit_Attracted      
End Function

'---------------------------------------------------
'Լրացնել Ավանդներ (ներգրավված)|Պայմանագրեր  Ֆիլտրի արժեքները
'---------------------------------------------------
Sub Fill_Deposit_Attracted(Deposit_Attracted)

    'Լրացնում է "Պայմանագրի մակարդակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","LEVEL",Deposit_Attracted.AgreementLevel)
    'Լրացնում է "Պայմանագրի տեսակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","AGRKIND",Deposit_Attracted.AgreementSpecies)
    'Լրացնում է "Պայմանագրի N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NUM",Deposit_Attracted.AgreementN)
    'Լրացնում է "Պայմ. թղթային N" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PPRCODE",Deposit_Attracted.AgreementPaperN)
    'Լրացնում է "Արժույթ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CUR",Deposit_Attracted.Curr)
    'Լրացնում է "Հաճախորդ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLIENT",Deposit_Attracted.Client)
    'Լրացնում է "Հաճախորդի անվանում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NAME",Deposit_Attracted.ClientName)
    'Լրացնում է "Նշում" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NOTE",Deposit_Attracted.Note)
    'Լրացնում է "Նշում2" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NOTE2",Deposit_Attracted.Note2)
    'Լրացնում է "Նշում3" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NOTE3",Deposit_Attracted.Note3)
    'Լրացնում է "Ցույց տալ հաշիվները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","SHOWACCS",Deposit_Attracted.ShowAccounts)
    'Լրացնում է "Ցույց տալ փակվածները" դաշտը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","CLOSE",Deposit_Attracted.ShowClosed)
    'Լրացնում է "Գրասենյակ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSBRANCH",Deposit_Attracted.Division)
    'Լրացնում է "Բաժին" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSDEPART",Deposit_Attracted.Department)
    'Լրացնում է "Հասան-ն տիպ" դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","ACSTYPE",Deposit_Attracted.AccessType)
    
    Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub

'-----------------------------------------------------
'Մուտք է գործում Ավանդներ(ներգրավված)|Պայմանագրեր թղթապանակ
'-----------------------------------------------------
'Deposit_Attract  - Լրացվող Ֆիլտրի տվյալների օբեկտ
Sub GoToDeposit_Attracted(Deposit_Attract) 
    Dim FilterWin
    
    Call wTreeView.DblClickItem("|²í³Ý¹Ý»ñ (Ý»ñ·ñ³íí³Í)|ä³ÛÙ³Ý³·ñ»ñ")
    Set FilterWin = p1.WaitVBObject("frmAsUstPar",1000)
    BuiltIn.Delay(1000) 
    
    If FilterWin.Exists Then
        Call Fill_Deposit_Attracted(Deposit_Attract)
        Call WaitForExecutionProgress()
    Else
        Log.Error "Can Not Open Deposit_Attracted Filter",,,ErrorColor      
    End If 
End Sub 