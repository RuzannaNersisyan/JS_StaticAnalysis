'USEUNIT  Library_Common
'USEUNIT Constants
'USEUNIT Subsystems_SQL_Library

' Նոր սանդղակ փաստաթղթի ստեղծում
' direction - Թղթապանակի ուղղություն
' fISN - Սանդղակ փաստաթղթի ISN
' cliCode - Սանդղակ փաստաթղթի համարը
' wName - Սանդղակ փաստաթղթի անունը
' wPrice - Գումար
' wPercent - Տոկոս
' wDay - Տոկոսի բաժանման օրեր
' wPrice2 - Գումար 2
' wPercent2 - Տոկոս 2
' wDay2 - Տոկոսի բաժանման օրեր 2
' wPrice3 - Գումար 3
' wPercent3 - Տոկոս 3
' wDay3 - Տոկոսի բաժանման օրեր 3
' wAPR - Տարեկան անվանական տոկոսադրույք
' dayClcType - Օրերի հաշվարկման ձև
' scaleType - Սանդղակի տեսակ
' prcCalcType - Տոկոսի հաշվարկման սկզբունք
' permBalCheck - Անընդմեջ մնացորդի ստուգում
' permBalDays - Օրերի քանակ
' permBalSum - Գումար
' permSumInAMD - Գումարը հաշվ. ՀՀ դրամով
' modSumCalc - Հաշվարկել կլոր գումարի վրա
' modSumm - Պատիկ գումար
' modRemPerc - Մնացորդի վրա հաշվարկվող տոկոս
' modRemPercSect - Մնացորդի վրա հաշվարկվող տոկոս բաժին
Sub CreateScale(direction, fISN, cliCode, wName, wPrice, wPercent, wDay, wPrice2, wPercent2, wDay2, wPrice3, wPercent3, wDay3, _
            wAPR, dayClcType, scaleType, prcCalcType, permBalCheck, permBalDays, permBalSum, permSumInAMD, _ 
            modSumCalc, modSumm, modRemPerc, modRemPercSect )

      Dim  frmASDocForm
      Call wTreeView.DblClickItem(direction)
      
      ' Հաճախորդի փաստաթղթի ISN - ի ստացում
      Set frmASDocForm = wMDIClient.VBObject("frmASDocForm")
      fISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN        
            
      ' Հաճախորդի կոդի արժեքի ստացում
'      param = GetVBObject("CODE", frmASDocForm)
'      cliCode = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
      cliCode = Get_Rekvizit_Value("Document",1,"General","CODE")
      
      ' Անվանում դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "NAME", wName)
     
      With  frmASDocForm.VBObject("TabFrame").VBObject("DocGrid")
            ' Գումար դաշտի լրացում
            .Row = 0
            .Col = 0
            .Keys(wPrice & "[Enter]")
            ' %  դաշտի լրացում
            .Row = 0
            .Col = 1
            .Keys(wPercent & "[Enter]" )
            ' Բաժ.  դաշտի լրացում
            .Row = 0
            .Col = 2
            .Keys(wDay & "[Enter]" )
            ' Գումար դաշտի լրացում
            .Row = 1
            .Col = 0
            .Keys(wPrice2 & "[Enter]" )
            ' % դաշտի լրացում
            .Row = 1
            .Col = 1
            .Keys(wPercent2 & "[Enter]" )
            ' Բաժ. դաշտի լրացում
            .Row = 1
            .Col = 2
            .Keys(wDay2 & "[Enter]" )
            ' Գումար դաշտի լրացում
            .Row = 2
            .Col = 0
            .Keys(wPrice3 & "[Enter]")
            ' % դաշտի լրացում
            .Row = 2
            .Col = 1
            .Keys(wPercent3 & "[Enter]" )
            ' Բաժ. դաշտի լրացում
            .Row = 2
            .Col = 2
            .Keys(wDay3 & "[Tab]")
      End With  
      
      ' Տարեկան անվանական տոկոսադրույք դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "APR", wAPR)
      ' Օրերի հաշվարկման ձև դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "DAYCLCTP", dayClcType)
      ' Սանդղակի տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SCALETP", scaleType)
      ' Տոկոսի հաշվարկման սկզբունք դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "PRCCLCTP", prcCalcType)
      ' Անընդմեջ մնացորդի ստուգում դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "CheckBox", "PERMBALCHCK", permBalCheck)
      ' Օրերի քանակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "PERMBALDAYS", permBalDays)
      ' Գումար դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "PERMBALSUM", permBalSum)
      ' Գումարը հաշվ. ՀՀ դրամով դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "CheckBox", "PERMSUMINAMD", permSumInAMD)
      ' Հաշվարկել կլոր գումարի վրա դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "CheckBox", "MODSUMCALC", modSumCalc)
      ' Պատիկ գումար դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "MODSUMM", modSumm)
      ' Մնացորդի վրա հաշվարկվող տոկոս դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "MODREMPERC", modRemPerc & "[Tab]" & modRemPercSect & "[Tab]")

      Call ClickCmdButton(1, "Î³ï³ñ»É")

End Sub

' Տոկոսի հաշվարկման պայմանագրի ստեղծում
' direction - թղթապանակի ուղղությունը
' wAcc - Հաշիվ
' balance - Հ/Պ հաշվեկշռային հաշիվ
' wCur - Արժույթ
' standContract - Ստանդարտ պայմանագի
' autoFill - Գեներացնել պայմանագիրը
' wScale - Սանդղակ
' wSumma - Գումար
' accAccount - Կուտակման հաշիվ
' accSource - Թղթակից հաշիվ
' stDate - Սկզբի ամսաթիվ
' endDate - Վերջի ամսաթիվ
' calcDays - Հաշվարկաման ամսաթիվ
' eCalcDate - Վերջ. գործ-ն ամսաթիվ
' dateClose - Փակման ամսաթիվ
' intDate -  Կապիտալացման ամսաթիվ
' capitMonth -  Կապիտալացման պարբերություն ՝ ամիս
' capitDay -  Կապիտալացման պարբերություն ՝ օր
' capitLastDate - Կապիտալացման վերջին ամսաթիվ
' intComm - Կապիտալացման գործ. մեկնաբանություն
' intAcc - Կապիտալացման հաշիվ
' intAccCur - Կապիտ. հաշվի արժույթ
' reFillAcc - Կապիտ. տեղափոխել հաշվին
' taxAcc - Հարկային հաշիվ
' taxValue - Հարկի տոկոս
' groupCode - Խմբի կոդ
' repCode - Կոդ դաշտ
' comment - Մեկնաբանություն
' intRateType - Փոփոխական տոկոսադրույքի տեսակ
' changMonth - % փոփոխման պարբերթ ամիս
' changDay - % փոփոխման պարբերթ օր
' n16AccType - N16 Պահանջի/պարտավորության տեսակ
Sub CreateInterestCalcAgreement(direction, fISN, wAcc, balance, wCur, standContract, autoFill, wScale, wSumma, accAccount, accSource, stDate, endDate, _
                                                              calcDays, eCalcDate, dateClose, intDate, capitMonth, capitDay, capitLastDate, intComm, intAcc, intAccCur, _
                                                              reFillAcc, taxAcc, taxValue, groupCode, repCode, comment, intRateType, changMonth, changDay, n16AccType)
      
      Call wTreeView.DblClickItem(direction)
      BuiltIn.Delay(1000)
       
      ' Տոկոսի հաշվարկման պայմանագրի ISN - ի ստացում
      fISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN    
      
      ' Հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACC", wAcc)
      ' Հ/Պ հաշվեկշռային հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "BALACC", balance)
      ' Արժույթ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "CUR", wCur)
      ' Ստանդարտ պայմանագիր դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "FILLALG", standContract)
      ' Գեներացնել պայմանագիրը դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "CheckBox", "AUTOFILL", autoFill)
      ' Սանդղակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SCALE", wScale)
      ' Գումար դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SUMMA", wSumma)
      ' Կուտակման հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACCUMACC", accAccount)
      ' Թղթակից հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACCSOURCE", accSource)
      ' Սկզբի ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SDATE", stDate)
      ' Վերջի ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "EDATE", endDate)      
      ' Հաշվարկման օրեր դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "CALCDAYS", calcDays)
      ' Վերջ. գործ-ն ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ECLCDATE", eCalcDate)
      ' Փակման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "DATECLOSE", dateClose)
      ' Կապիտալացման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "INTDATE", intDate)
      ' Կապիտալացման պարբերություն դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "PERIODICITY", capitMonth & "[Tab]" & capitDay)
      ' Կապիտալացնել վերջին ամսաթիվն դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "CheckBox", "INTONEND", capitLastDate)
      ' Կապիտալացման գործ. մեկնաբանություն դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "INTCOMM", intComm)
      ' Կապիտալացման հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "INTACC", intAcc)
      ' Կապիտ. հաշվի արժույթ դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "INTACCCUR", intAccCur)
      ' Կապիտ. տեղափոխել հաշվին դաշտի լրացում
      'Call Rekvizit_Fill("Document", 2, "CheckBox", "REFILLACC", reFillAcc)
      ' Հարկային հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "TAXACC", taxAcc)
      ' Հարկի տոկոս դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "TAXVALUE", taxValue)
      ' Խմբի կոդ դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "GROUP", groupCode)
      ' Կոդ դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "REPCODE", repCode)
      ' Մեկնաբանություն դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "COMMENT", comment)
      ' Փոփոխական տոկոսադրույքի տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "PCBASETYPE", intRateType)
      ' % փոփոխման պարբերթ. դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "CHNGPER", changMonth & "[Tab]" & changDay)
      ' N16 Պահանջի/պարտավորության տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "N16ACCTYPE", n16AccType)

      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      
End Sub

' Կատարել տկոսների հաշվարկում և կապիտալացում / հաշվարկում
' wAction - գործողության անուն
' fISN - փաստաթղթի ISN
' docNum - փաստաթղթի համարը
' wOffice - Գրասենյակ
' wSecton - Բաժին 
' calcDate - Հաշվարկման ամսաթիվ
' formulDate - Ձևակերպման ամսաթիվ
' wComment - Մեկնաբանություն
Sub  CalcPercentAndCapitalization(wAction, fISN, docNum, wOffice, wSecton, calcDate, formulDate, wComment)
      
      BuiltIn.Delay(1500)
      Call wMainForm.MainMenu.Click(c_AllActions) 
      Call wMainForm.PopupMenu.Click(c_Opers & "|" & wAction)
      
      ' Հաճախորդի փաստաթղթի ISN - ի ստացում
      fISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN        
            
      ' Հաճախորդի կոդի արժեքի ստացում
'      param = GetVBObject("DOCNUM", frmASDocForm)
'      docNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
      docNum = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
      
      ' Գրասենյակ/Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACSBRANCH", wOffice & "Tab" & wSecton)
      ' Հաշվարկման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "P1DATE", calcDate)
      ' Ձևակերպման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SETDATE", formulDate)
      ' Մեկնաբանություն դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "COMM", wComment)
      
      Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

' Կատարել տկոսների կապիտալացում / տոկոսների վերահաշվարկ
' wAction - Գործողության տեսակ
' fISN - Փաստաթղթի ISN
' docNum - Փաստաթղթի համարը
' wOffice - Գրասենյակ
' wSecton - Բաժին
' acsType - Հասան-ն տիպ
' actionType - Գործողություն
' intDate - Կապիտալացման ամսաթիվ
' setDate - Ձևակերպման  ամսաթիվ
' wAcc - Պայմանագրի հաշիվ 
' wSumma - Պայմանագրի հաշիվ
' wComment - Մեկնաբանություն
Sub  CalcCapitalizationAndRecalc(wAction, fISN, docNum, wOffice, wSecton, acsType, actionType, intDate, setDate, wAcc, wSumma, wComment)
      
      BuiltIn.Delay(1500)
      Call wMainForm.MainMenu.Click(c_AllActions) 
      Call wMainForm.PopupMenu.Click(c_Opers & "|" & wAction)
      BuiltIn.Delay(1000)
      
      ' Հաճախորդի փաստաթղթի ISN - ի ստացում
      fISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN        
            
      ' Հաճախորդի կոդի արժեքի ստացում
'      param = GetVBObject("DOCNUM", frmASDocForm)
'      docNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
      docNum = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
      
      ' Գրասենյակ/Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACSBRANCH", wOffice & "Tab" & wSecton)
      ' Հասա-ն տիպ ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACSTYPE", acsType)
      ' Գործողություն դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "OPTYPE", actionType)
      ' Կապիտալացման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "INTDATE", intDate)
      ' Ձևակերպման  ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SETDATE", setDate)
      ' Պայմանագրի հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACC", wAcc)
      ' Գումար դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SUMMA", wSumma)
      ' Մեկնաբանություն դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "COMM", wComment)
     
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

' Սանդղակի/Գումարի խմբային խմբագրում
' fISN - Փաստաթղթի ISN
' chngDate - Փոփոխման ամսաթիվ
' setDate - Ձևակերպման ամսաթիվ
' newScale - Նոր սանդղակ
' notCalcIntRep - Մինչև նախորդ կապիտ./փոփոխ կուտակվածի վերանայումով ռեժիմ դաշտի լրացում
' newSum - Գումար
' newStDate - Սկզբի ամսաթիվ
' NewEDate - Վերջի ամսաթիվ
' acsBranch - Գրասենյակ
' acsSection - Բաժին
' acsType - Հասան-ն տիպ
Sub ScaleOrAmountGroupEditing(fISN, chngDate, setDate, newScale, notCalcIntRep, newSum, newStDate, newEDate, acsBranch, acsSection, acsType)
      
      ' insert կոճակի սեղմում
      wMDIClient.VBObject("frmPttel").VBObject("TDBGView").Keys("[Ins]")
      
      Call wMainForm.MainMenu.Click(c_AllActions) 
      Call wMainForm.PopupMenu.Click(c_SclAmountGrEdit)
      BuiltIn.Delay(1000)
      
      ' Հաճախորդի փաստաթղթի ISN - ի ստացում
      fISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN        
      
      ' Փոփոխման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "CHNGDATE", chngDate)
      ' Ձևակերպման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SETDATE", setDate)
      ' Նոր սանդղակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "NEWSCALE", newScale)
      ' Մինչև նախորդ կապիտ./փոփոխ կուտակվածի վերանայումով ռեժիմ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "CheckBox", "NOTCALCINTRFP", notCalcIntRep)
      ' Գումար դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "NEWSUM", newSum)
      ' Սկզբի ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "NEWSDATE", newStDate)
      ' Վերջի ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "NEWEDATE", newEDate)
      ' Գրասենյակ/Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "ACSBRANCH", acsBranch & "[Tab]" & acsSection)
      ' Հասան-ն տիպ դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "ACSTYPE", acsType)
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      
      If  Sys.Process("Asbank").WaitVBObject("frmAsMsgBox", 1000).Exists Then
               Call ClickCmdButton(5, "Î³ï³ñ»É")
               Exit Sub
      End If   
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      
End Sub

' Հաշիվների խմբային խմբագրում գործողության կատարում
' fISN - փաստաթղթի ISN
' coaNum - Հաշվային պլանի համար
' balAcc - Հ/Պ հաշվեկշռային հաշիվ 
' wType - Հաշվի տիպ
' wNote - Նշում
' wNote2 - Նշում 2
' wNote3 - Նշում 3
' accAcbBranch - Գրասենյակ
' inhOfficefromAcc - Գրասենյակը ժառանգել հիմնական հաշվից
' wSection - Բաժին
' inhSectfromAcc - Բաժինը ժառանգել հիմնական հաշվից
' accAcsType - Հասան-ն տիպ
' basetype - Հասանելիութ. տիպը ժառանգել հիմնական հաշվից
' fromOptType - Լրացնել կարգավորումից
' acsBranch - Գրասենյակ
' acsSection - Բաժին
' acsType - Հասան-ն տիպ
Sub GroupEditingOfAccounts(fISN, coaNum, balAcc, wType, wNote, wNote2, wNote3, accAcbBranch, inhOfficefromAcc, wSection, inhSectfromAcc, accAcsType, _
                                                      baseType, fromOptType, acsBranch, acsSection, acsType) 

      ' insert կոճակի սեղմում
      wMDIClient.VBObject("frmPttel").VBObject("TDBGView").Keys("[Ins]") 
     
      Call wMainForm.MainMenu.Click(c_AllActions) 
      Call wMainForm.PopupMenu.Click(c_GrpEdAcc)
      BuiltIn.Delay(1000)
     
      fISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN        
      
      ' Հաշվային պլանի համար դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "COANUM", coaNum)
      ' Հ/Պ հաշվեկշռային հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "BALACC", balAcc)
      ' Հաշվի տիպ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "TYPE", wType)
      ' Նշում դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "NOTE", wNote)
      ' Նշում 2 դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "NOTE2", wNote2)
      ' Նշում 3 դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "NOTE3", wNote3)
      ' Գրասենյակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "ACCACSBRANCH", accAcbBranch)
      ' Գրասենյակը ժառանգել հիմնական հաշվից դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "CheckBox", "BASEBRANCH", inhOfficefromAcc)
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "ACCACSDEPART", wSection)
      ' Բաժինը ժառանգել հիմնական հաշվից դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "CheckBox", "BASEDEPART", inhSectfromAcc)
      ' Հասան-ն տիպ դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "ACCACSTYPE", accAcsType)
      ' Հասանելիութ. տիպը ժառանգել հիմնական հաշվից դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "CheckBox", "BASETYPE", baseType)
      ' Լրացնել կարգավորումից դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "CheckBox", "FROMOPTTYPE", fromOptType)
      ' Գրասենյակ/Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "ACSBRANCH", acsBranch & "[Tab]" & acsSection)
      ' Հասան-ն տիպ դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "ACSTYPE", acsType)
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      
End Sub

' Նոր պայմանագրի ստանդարտ փաստաթղթի ստեղծում
Sub NewContractStandard(direction, fISN, wCode, wName, wEName, onlySpecRep, wSrok, wSrokDay, wPeriod, wScale, wSumma, calcDays, _
                                                 hpAcc, hType, wNote, wNote2, wNote3, wOffice, wSection, accType, accumAcc, autoAcc, accNotes, inhertOffice, _
                                                 inhertDep, inhertType, hTypeAcc, hpAccAcc, resTypeAcc, incExpAcc, contWithCustom, wOfficeAcc, wSectionAcc, _
                                                 accTyeAcc, wNoteAcc, wNote2Acc, wNote3Acc, hpAccCorr, hTypeCorr, wNoteCorr, wNote2Corr, wNote3Corr, _
                                                 wOfficeCorr, wSectionCorr, accTypeCorr, accumAccCorr, autoSourc, srcNotes, srcInDiv, srcInDep, srcInType, _
                                                 hTypeCorr2, hpAccCorr2, resTypeCorr2, incExpCorr2, contWithCustCorr2, wOfficeCorr2, accTyeCorr2, wNoteCorr2, _
                                                 wNote2Corr2, wNote3Corr2, intDate, periodMonth, periodDay, intOnEnd, intOnSelf, cliAMDAcc, reFillAcc, intAcc, _
                                                 autoIntAcc, intNotes, intInhertDiv, intInhertDep, intInhertType, hTypeCapt, hpAccCapt, resTypeCapt, incExpCapt, _
                                                 contWithCustCapt, wOfficeCapt, wSectionCapt, accTyeCapt, wNoteCapt, wNote2Capt, wNote3Capt, calcTex, _
                                                 wGroup, repCode, wComment, pcBaseType, chngPer, n16AccType)

      Dim  frmASDocForm
      
      Call wTreeView.DblClickItem(direction)
      BuiltIn.Delay(1000)
       
      ' Տոկոսի հաշվարկման պայմանագրի ISN - ի ստացում
      Set frmASDocForm = wMDIClient.VBObject("frmASDocForm")
      fISN = frmASDocForm.DocFormCommon.Doc.ISN       
      
      ' Կոդ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "CODE", wCode)
      ' Անվանում դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "NAME", wName)
      ' Անգլերեն անվանում դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ENAME", wEName)
      ' Բացել միայն հաշվ. հատ. լրացում դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "CheckBox", "ONLYSPECREP", onlySpecRep)
      ' Ժամկետ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SROK", wSrok & "[Tab]" & wSrokDay)
      ' Ժամկետի վերջը հաշվարկել դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SPERIOD", wPeriod)
      ' Սանդղակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SCALE", wScale)
      ' Գումար դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SUMMA", wSumma)
      ' Հաշվարկման օրեր դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "CALCDAYS", calcDays)
      
       ' Անցում Կուտակման հաշիվ էջին
       frmASDocForm.vbObject("TabStrip").SelectedItem = frmASDocForm.vbObject("TabStrip").Tabs(2) 
       frmASDocForm.VBObject("TabFrame_2").VBObject("DocGrid").Click
            
       With  frmASDocForm.VBObject("TabFrame_2").VBObject("DocGrid")
                ' Հ/Պ Հաշիվ դաշտի լրացում
                .Row = 0
                .Col = 0
                .Keys(hpAcc & "[Enter]")
                '  Հ. տիպ  դաշտի լրացում
                .Col = 2
                .Keys(hType & "[Enter]" )
                ' Նշում դաշտի լրացում
                .Col = 3
                .Keys(wNote & "[Enter]" )
                ' Նշում 2 դաշտի լրացում
                .Col = 4
                .Keys(wNote2 & "[Enter]")
                '  Նշում 3 դաշտի լրացում
                .Col = 5
                .Keys(wNote3 & "[Enter]" )
                ' Գրասենյակ դաշտի լրացում
                .Col = 6
                .Keys(wOffice & "[Enter]" )
                ' Բաժին դաշտի լրացում
                .Col = 7
                .Keys(wSection & "[Enter]")
                ' հաս. տիպ դաշտի լրացում
                .Col = 8
                .Keys(accType & "[Enter]" )
                ' Կուտակման հաշիվ դաշտի լրացում
                .Col = 9
                .Keys(accumAcc & "[Tab]" )
       End With 
      
      ' Կուտ. հաշվի ավտոմատ լրացում դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "CheckBox", "AUTOACCUM", autoAcc)
      ' Ժառանգել հաշվի նշումներ դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "CheckBox", "ACCNOTES", accNotes)
      ' Ժառանգում՝ գրասենյակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "ACCINHERTDIV", inhertOffice)
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "ACCINHERTDEP", inhertDep)
      ' Հասան-ն տիպ դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "ACCINHERTTYP", inhertType)
      
      With  frmASDocForm.VBObject("TabFrame_2").VBObject("DocGrid_2")
                '  գրիդի   դաշտի լրացում
                .Col = 0
                .Keys(hTypeAcc & "[Enter]" )
                ' Հ/Պ Հաշիվ դաշտի լրացում
                .Col = 1
                .Keys(hpAccAcc & "[Enter]")
                ' Մնաց. տիպ դաշտի լրացում
                .Col = 2
                .Keys(resTypeAcc & "[Enter]")
                ' Եկամուտ/Ծախս դաշտի լրացում
                .Col = 3
                .Keys(incExpAcc & "[Enter]")
                ' Կապ հաճ. հետ. դաշտի լրացում
                .Col = 4
                .Keys(contWithCustom & "[Enter]")
                ' Գրասենյակ դաշտի լրացում
                .Col = 5
                .Keys(wOfficeAcc & "[Enter]" )
                ' Բաժին դաշտի լրացում
                .Col = 6
                .Keys(wSectionAcc & "[Enter]")
                ' հաս. տիպ դաշտի լրացում
                .Col = 7
                .Keys(accTyeAcc & "[Enter]" )
                 ' Նշում դաշտի լրացում
                .Col = 8
                .Keys(wNoteAcc & "[Enter]" )
                ' Նշում 2 դաշտի լրացում
                .Col = 9
                .Keys(wNote2Acc & "[Enter]")
                '  Նշում 3 դաշտի լրացում
                .Col = 10
                .Keys(wNote3Acc & "[Tab]" )
       End With 
             
       ' Անցում Թղթակից Հաշիվ էջին
       frmASDocForm.vbObject("TabStrip").SelectedItem = frmASDocForm.vbObject("TabStrip").Tabs(3) 
       frmASDocForm.VBObject("TabFrame_3").VBObject("DocGrid_3").Click
       
       With  frmASDocForm.VBObject("TabFrame_3").VBObject("DocGrid_3")
                ' Հ/Պ Հաշիվ դաշտի լրացում
                .Col = 0
                .Keys(hpAccCorr & "[Enter]")
                '  Հ. տիպ  դաշտի լրացում
                .Col = 2
                .Keys(hTypeCorr & "[Enter]" )
                ' Նշում դաշտի լրացում
                .Col = 3
                .Keys(wNoteCorr & "[Enter]" )
                ' Նշում 2 դաշտի լրացում
                .Col = 4
                .Keys(wNote2Corr & "[Enter]")
                '  Նշում 3 դաշտի լրացում
                .Col = 5
                .Keys(wNote3Corr & "[Enter]" )
                ' Գրասենյակ դաշտի լրացում
                .Col = 6
                .Keys(wOfficeCorr & "[Enter]" )
                ' Բաժին դաշտի լրացում
                .Col = 7
                .Keys(wSectionCorr & "[Enter]")
                ' հաս. տիպ դաշտի լրացում
                .Col = 8
                .Keys(accTypeCorr & "[Enter]" )
                ' Կուտակման հաշիվ դաշտի լրացում
                .Col = 9
                .Keys(accumAccCorr & "[Tab]" )
       End With 
       
       ' Թղթ. հաշվի ավտոմատ բացում դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "CheckBox", "AUTOSOURCE", autoSourc)
      ' Ժառանգել հաշվի նշումներ դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "CheckBox", "SRCNOTES", srcNotes)
      ' Ժառանգում՝ գրասենյակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "SRCINHERTDIV", srcInDiv)
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "SRCINHERTDEP", srcInDep)
      ' Հասան-ն տիպ դաշտի լրացում
      Call Rekvizit_Fill("Document", 3, "General", "SRCINHERTTYP", srcInType)
      
      With  frmASDocForm.VBObject("TabFrame_3").VBObject("DocGrid_4")
                '  Հ. տիպ  դաշտի լրացում
                .Col = 0
                .Keys(hTypeCorr2  & "[Enter]" )
                ' Հ/Պ Հաշիվ դաշտի լրացում
                .Col = 1
                .Keys(hpAccCorr2  & "[Enter]")
                ' Մնաց. տիպ դաշտի լրացում
                .Col = 2
                .Keys(resTypeCorr2 & "[Enter]")
                ' Եկամուտ/Ծախս դաշտի լրացում
                .Col = 3
                .Keys(incExpCorr2 & "[Enter]")
                ' Կապ հաճ. հետ. դաշտի լրացում
                .Col = 4
                .Keys(contWithCustCorr2 & "[Enter]")
                ' Գրասենյակ դաշտի լրացում
                .Col = 5
                .Keys(wOfficeCorr2 & "[Enter]" )
                ' Բաժին դաշտի լրացում
                .Col = 6
                .Keys(wSectionCorr2 & "[Enter]")
                ' հաս. տիպ դաշտի լրացում
                .Row = 0
                .Col = 7
                .Keys(accTyeCorr2 & "[Enter]" )
                 ' Նշում դաշտի լրացում
                .Col = 8
                .Keys(wNoteCorr2 & "[Enter]" )
                ' Նշում 2 դաշտի լրացում
                .Col = 9
                .Keys(wNote2Corr2 & "[Enter]")
                '  Նշում 3 դաշտի լրացում
                .Col = 10
                .Keys(wNote3Corr2 & "[Tab]" )
       End With 
      
       ' Կապիտալացման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 4, "General", "INTDATE", intDate)
      ' Կապիտալացման պարբերություն դաշտի լրացում
      Call Rekvizit_Fill("Document", 4, "General", "PERIODICITY", periodMonth & "[Tab]" & periodDay)
      ' Կապիտալացնել վերջին ամսաթիվը դաշտի լրացում
      Call Rekvizit_Fill("Document", 4, "CheckBox", "INTONEND",intOnEnd )
      ' Կապիտալացնել պայմանագրի հաշվի վրա դաշտի լրացում
      Call Rekvizit_Fill("Document", 4, "CheckBox", "INTONSELF", intOnSelf)
      ' Կապիտ. հաշ. լրացնել հաճախորդ. հիմն. դրամ. հաշվով դաշտի լրացում
      Call Rekvizit_Fill("Document", 4, "CheckBox", "CLIAMDACC", cliAMDAcc)
      ' Կապիտ. տեղափոխել հաշվին դաշտի լրացում
      Call Rekvizit_Fill("Document", 4, "CheckBox", "REFILLACC",reFillAcc )
      ' Կապիտալացման հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 4, "General", "INTACC",intAcc )
      ' Կապիտալացման հաշվի ավտոմատ բացում դաշտի լրացում
      Call Rekvizit_Fill("Document", 4, "CheckBox", "AUTOINTACC", autoIntAcc)
      ' Ժառանգել հաշվի նշումները դաշտի լրացում
      Call Rekvizit_Fill("Document", 4, "CheckBox", "INTNOTES", intNotes)
      ' Ժառանգում՝ Գրասենյակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 4, "General", "INTINHERTDIV", intInhertDiv)
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Document", 4, "General", "INTINHERTDEP", intInhertDep )
      ' Հասան-ն տիպ դաշտի լրացում
      Call Rekvizit_Fill("Document", 4, "General", "INTINHERTTYP", intInhertType)
      
      With  frmASDocForm.VBObject("TabFrame_4").VBObject("DocGrid_5")
                '  Հ. տիպ  դաշտի լրացում
                .Col = 0
                .Keys(hTypeCapt  & "[Enter]" )
                ' Հ/Պ Հաշիվ դաշտի լրացում
                .Col = 1
                .Keys(hpAccCapt  & "[Enter]")
                ' Մնաց. տիպ դաշտի լրացում
                .Col = 2
                .Keys(resTypeCapt & "[Enter]")
                ' Եկամուտ/Ծախս դաշտի լրացում
                .Col = 3
                .Keys(incExpCapt & "[Enter]")
                ' Կապ հաճ. հետ. դաշտի լրացում
                .Col = 4
                .Keys(contWithCustCapt & "[Enter]")
                ' Գրասենյակ դաշտի լրացում
                .Col = 5
                .Keys(wOfficeCapt & "[Enter]" )
                ' Բաժին դաշտի լրացում
                .Col = 6
                .Keys(wSectionCapt & "[Enter]")
                ' հաս. տիպ դաշտի լրացում
                .Col = 7
                .Keys(accTyeCapt & "[Enter]" )
                 ' Նշում դաշտի լրացում
                .Col = 8
                .Keys(wNoteCapt & "[Enter]" )
                ' Նշում 2 դաշտի լրացում
                .Col = 9
                .Keys(wNote2Capt & "[Enter]")
                '  Նշում 3 դաշտի լրացում
                .Col = 10
                .Keys(wNote3Capt & "[Enter]" )
                '  Դրամ. դաշտի լրացում
                .Col = 10
                .Keys(wNote3Capt & "[Tab]" )
       End With 
      
       ' Կապիտալացնելիս գանձել հարկը դաշտի լրացում
      Call Rekvizit_Fill("Document", 4, "CheckBox", "CALCTAX", calcTex)
      ' Խմբի կոդ դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "GROUP", wGroup)
      ' Կոդ դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "REPCODE",repCode )
      ' Մեկնաբանություն դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "COMMENT", wComment)
      ' Փոփոխական տոկոսադրույքի տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "PCBASETYPE", pcBaseType)
      ' % փոփոխման պարբեր. դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "CHNGPER", chngPer)
      ' N16 պահանջի/ պարտավորության տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Document", 5, "General", "N16ACCTYPE", n16AccType)
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

' Պայմանագրերի խմբային բացում
'doAction - գործողության անվանումը
'opMainAcc - Բացել հիմնական հաշիվը
'opOtherAcc - Բացել մյուս հաշիվները
'calcStDate - Հաշվարկների սկիզբ
Sub Contracts_Group_Close(doAction, opMainAcc, opOtherAcc, calcStDate)
  
      ' insert կոճակի սեղմում
      wMDIClient.VBObject("frmPttel").VBObject("TDBGView").Keys("[Ins]") 
     
      Call wMainForm.MainMenu.Click(c_AllActions) 
      Call wMainForm.PopupMenu.Click(doAction)
      BuiltIn.Delay(1000)
     
      ' Բացել հիմնական հաշիվը դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "OPENMAINACC", opMainAcc)
      ' Բացել մյուս հաշիվները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "OPENOTHERACCS", opOtherAcc)
      ' Հաշվարկների սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PRCCALCSTARTDATE", calcStDate)
      
      Call  ClickCmdButton(2, "Î³ï³ñ»É")      
End Sub

' Պայմանագրի փակում/ խմբային փակում
' doAction - Գործողության անվանումը
' dateClose - Ամսաթիվ
' state - true Կամ false արժեք կրող փոփոխական
' ignorDate - Անտեսել պայմանագրի վերջին ամսաթիվը
' ignorCalc - Անտեսել չհաշվարկված պայմանագիրը
' ignorAmount - Անտեսել չկապիտալացված գումարները
' closeAcc - Փակել պայմանագրի հաշիվը
' closeAccum - Փակել կուտակման հաշիվը
' doInt - Կապիտալացնել կուտակման %-ը
Sub Contracts_Group_Close_With_CheckBoxes(doAction, dateClose, state, ignorDate, ignorCalc,ignorAmount, closeAcc, closeAccum, doInt)

      ' insert կոճակի սեղմում
      wMDIClient.VBObject("frmPttel").VBObject("TDBGView").Keys("[Ins]") 
     
      Call wMainForm.MainMenu.Click(c_AllActions) 
      Call wMainForm.PopupMenu.Click(doAction)
      BuiltIn.Delay(1000)
     
      ' Ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DATECLOSE", dateClose)
      
      If state Then
             ' Անտեսել պայմանագրի վերջին ամսաթիվը դաշտի լրացում
             Call Rekvizit_Fill("Dialog", 1, "CheckBox", "IGNOREDATE", ignorDate)
             ' Անտեսել չհաշվարկված պայմանագիրը դաշտի լրացում
             Call Rekvizit_Fill("Dialog", 1, "CheckBox", "IGNORCALC", ignorCalc)
             ' Անտեսել չկապիտալացված գումարները դաշտի լրացում
             Call Rekvizit_Fill("Dialog", 1, "CheckBox", "IGNORAMOUNTS", ignorAmount)
      End If
      
      ' Փակել պայմանագրի հաշիվը դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "CLOSEACC", closeAcc)
      ' Փակել կուտակման հաշիվը դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "CLOSEACCUM", closeAccum)
       ' Կապիտալացնել կուտակման %-ը դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "DOINT", doInt)
      
      ' Կատարել կոճակի սեղմում
      Call  ClickCmdButton(2, "Î³ï³ñ»É")

End Sub

' խմբային տոկոսների հաշվարկի ջնջում
' param -  Գործողության անվանումը
' dateGive - ժամանակահատվածի սկիզբ
' dateAgr - Ժամանակահատվածի ավարտ
Sub Delete_Group_PercentCalc(param, sDate, dateGive, eDate, dateAgr, action ) 

        BuiltIn.Delay(2000) 
        ' Գործողություններ / Բոլոր գործողություններ
        Call wMainForm.MainMenu.Click(c_AllActions)
        Call wMainForm.PopupMenu.Click(param)
          
        ' Ժամանակահատվածի սկիզբ դաշտի լրացում
        Call Rekvizit_Fill("Dialog",1, "General", sDate, dateGive )
        ' Ժամանակահատվածի ավարտ դաշտի լրացում
        Call Rekvizit_Fill("Dialog",1, "General", eDate, dateAgr)
        
        ' Կատարել կոճակի սեղմում
        Call ClickCmdButton(2, "Î³ï³ñ»É")  
          
        BuiltIn.Delay(1000) 
        ' Քանի դեռ թղթապանակում տողերի քանակը հավասար չէ զրոյի
        Do While wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").VisibleRows <> 0  
               wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").MoveLast 
               BuiltIn.Delay(2000) 
               Call wMainForm.MainMenu.Click(c_AllActions) 
               ' Հեռացնել գործողության կատարում
               Call wMainForm.PopupMenu.Click(action)

               ' Կատարել կոճակի սեղմում  
               Call ClickCmdButton(2, "Î³ï³ñ»É") 
               BuiltIn.Delay(1000) 
               If  Sys.Process("Asbank").WaitVBObject("frmAsMsgBox", delay_small).Exists Then
                    ' Այո կոճակի սեղմում  
                    Call ClickCmdButton(5, "Î³ï³ñ»É") 
                    BuiltIn.Delay(1000) 
               End If
        Loop
        wMDIClient.VBObject("frmPttel_2").Close
        BuiltIn.Delay(1000)      
End Sub