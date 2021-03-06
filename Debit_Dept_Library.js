'USEUNIT  Library_Common
'USEUNIT Constants
 
Sub SelectContracType(direction, colNum, contType, fISN, cliCode, accAcc, comment, wDate, acsBranch, branchSect, acsType,_
                                            autoDebt, useAccBalanc, accConnect, headNum, autoDateChild, typeAutoDate, fixedDays, agrPeriod,_
                                            agrPeryodDay, passDirrect, passType, dateAgr, clsDays, state, brType, notClass, subjRisk,_
                                            sector, wAim, riksDegree, repCode, wNote, wNote2, wNote3, pprCode, dateClose, cenceled, n16AccType, _
                                            fillAccs, complRef, status, storageAcc, cost, income, accOutAgr)
    
      Dim wtdbgView, frmASDocForm, control, asbank
      Call wTreeView.DblClickItem(direction)
      
      Set wtdbgView = p1.VBObject("frmModalBrowser").VBObject("tdbgView")
      Do until  wtdbgView.EOF
             If Trim(wtdbgView.Columns.Item(colNum).value) = Trim(contType) then
                    wtdbgView.Keys("[Enter]")
                    Exit Do
             Else
                    wtdbgView.MoveNext
             End If 
       Loop  

       ' Փաստաթղթի ISN - ի ստացում
       Set frmASDocForm = wMDIClient.VBObject("frmASDocForm")
       fISN = frmASDocForm.DocFormCommon.Doc.ISN
       BuiltIn.Delay(1000)   
       
       ' Հաշիվ դաշտի լրացում
       Call Rekvizit_Fill("Document", 1, "General", "CODE", cliCode)
       
       If state Then
            ' Հաշվարկային հաշիվ դաշտի լրացում
              Call Rekvizit_Fill("Document", 1, "General", "ACCACC", accAcc)
       End If
       
       ' Մեկնաբանություն դաշտի լրացում
       Call Rekvizit_Fill("Document", 1, "General", "COMMENT", comment) 
       ' Կնքման ամսաթիվ դաշտի լրացում
       Call Rekvizit_Fill("Document", 1, "General", "DATE", wDate)
       ' Գրասենյակ/Բաժին դաշտի լրացում
       Call Rekvizit_Fill("Document", 1, "General", "ACSBRANCH", acsBranch & "[Tab]" & branchSect ) 
       ' Հասան-ն տիպ դաշտի լրացում
       Call Rekvizit_Fill("Document", 1, "General", "ACSTYPE", acsType) 
        
       If state Then   
          '  Պարտքերի ավտոմատ մարում դաշտի լրացում
          Call Rekvizit_Fill("Document", 3, "CheckBox", "AUTODEBT", autoDebt) 
          ' Այլ հաշիվների մնացորդների օգտագործում դաշտի լրացում
          Call Rekvizit_Fill("Document", 3, "General", "ACCCONNMODE", useAccBalanc) 
          ' Հաշիվների փոխկապակցման սխեմա դաշտի լրացում
          Call Rekvizit_Fill("Document", 3, "General", "ACCCONNSCH", accConnect) 
          headNum = 4
       Else
          headNum = 3
       End If
       
       ' Ավտոմատ մշակել մարման ժամկետը դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "CheckBox", "AUTODATECHILD", autoDateChild)
       ' Մարման նշանակման ձև դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "TYPEAUTODATE", typeAutoDate) 
       ' Մարման օրեր դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "FIXEDDAYS", fixedDays)
       ' Տևողություն դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "AGRPERIOD", agrPeriod & "[Tab]" & agrPeryodDay ) 
       ' Շրջանցման ուղղություն դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "PASSOVDIRECTION", passDirrect) 
       ' Ողղ. օր տիպ դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "PASSOVTYPE", passType) 
       ' Մաման ժամկետ դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "DATEAGR", dateAgr) 
       ' Չաշխ. դառնալու օրերի քանակ դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "CLSDAYSCNT", clsDays) 
       
       If state Then
            ' Պայմանագրի տեսակ դաշտի լրացում
            Call Rekvizit_Fill("Document", 5, "General", "BRTYPE", brType) 
            ' Բլանկային դաշտի լրացում
            Call Rekvizit_Fill("Document", 5, "CheckBox", "NOTCLASS", notClass) 
            ' Սյուբեկտիվ դասակարգված դաշտի լրացում
            Call Rekvizit_Fill("Document", 5, "CheckBox", "SUBJRISK", subjRisk) 
            headNum = 5
       Else
            headNum = 4
       End If
       
       ' Ճուղայնություն դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "SECTOR", sector) 
       ' Նպատակ դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "AIM", wAim) 
       ' Ռիսկի կշիռ դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "RISKDEGREE", riksDegree) 
       ' N09 հատուկ լրացման կոդ դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "REPCODE", repCode) 
       ' Նշում դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "NOTE", wNote) 
       ' Նշում 2 դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "NOTE2", wNote2) 
       ' Նշում 3 դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "NOTE3", wNote3) 
       ' Պյմ. թղթային N  դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "PPRCODE", pprCode) 
       ' Փակման ամսաթիվ դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "DATECLOSE", dateClose) 
       ' Լրիվ փակված դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "CANCELED", cenceled) 
       ' N16 Պահանջի/Պարտավորության տեսակ դաշտի լրացում
       Call Rekvizit_Fill("Document", headNum, "General", "N16ACCTYPE", n16AccType) 
       
       If state Then
              headNum = 7
       Else
              headNum = 6
       End If
        
       ' Անցում Հաշիվներ էջին
       frmASDocForm.vbObject("TabStrip").SelectedItem = frmASDocForm.vbObject("TabStrip").Tabs(headNum) 
        
       If status Then

           Set asbank = Sys.Process("Asbank")
        
           ' Հաշիվների լրացում դաշտի լրացում
           If headNum = 7 Then
                 Call asbank.VBObject("MainForm").Window("MDIClient").VBObject("frmASDocForm").VBObject("TabFrame_7").VBObject("CheckBox_8").ClickButton(cbChecked)
           Else 
                 Call asbank.VBObject("MainForm").Window("MDIClient").VBObject("frmASDocForm").VBObject("TabFrame_6").VBObject("CheckBox_4").ClickButton(cbChecked)
           End If
            
           Set control = asbank.VBObject("frmAsUstPar")
           Call control.VBObject("TabFrame").VBObject("Checkbox").ClickButton(cbChecked)
           control.VBObject("CmdOK").ClickButton

       Else       
            
             With  frmASDocForm.VBObject("TabFrame_6").VBObject("DocGrid_4")
                      ' Պահ. հաշիվ դաշտի լրացում
                      .Row = 0
                      .Col = 1
                      .Keys(storageAcc & "[Enter]")
                      ' Ծախս դաշտի լրացում
                      .Row = 0
                      .Col = 2
                      .Keys(cost & "[Enter]" )
                      ' Եկամուտ դաշտի լրացում
                      .Row = 0
                      .Col = 3
                      .Keys(income & "[Enter]" )
             End With 
       End If
       
       If state Then
             ' Հաշիվների լրացում դաշտի լրացում
             Call Rekvizit_Fill("Document", 7, "General", "ACCOUTAGR", accOutAgr)
       End If
       
       Call ClickCmdButton(1, "Î³ï³ñ»É")
              
End Sub


' Պահուստավորում/Պարտքերի զիջում գործողության կատարում
' wDate - Ամսաթիվ
' sumRes - Պահուստավորում
' sumUnres - Ապապահուստավորում
' wComment - Մեկնաբանություն
' acsBranch - Գրասենյակ
' acsSect - Բաժին
Sub ProvisionAction(action, fISN, wDate, state, wSumma, sumAgr, sumRes, sumUnres, wComment, acsBranch, acsSect)

      BuiltIn.Delay(2000)
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_Opers & "|" & action)
      BuiltIn.Delay(1000)
      
      ' Փաստաթղթի ISN - ի ստացում
       fISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN
       BuiltIn.Delay(1000) 
             
      ' Լրացնել Ամսաթիվ դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "DATE", wDate)
      
      If state Then
            ' Լրացնել Ընդհանուր գումար դաշտը
            Call Rekvizit_Fill("Document", 1, "General", "SUMMA", wSumma)
            ' Լրացնել Հիմնական գումար դաշտը
            Call Rekvizit_Fill("Document", 1, "General", "SUMAGR", sumAgr)
      Else 
            ' Լրացնել Պահուստավորում դաշտը
            Call Rekvizit_Fill("Document", 1, "General", "SUMRES", sumRes)
            ' Լրացնել Ապապահուստավորում դաշտը
            Call Rekvizit_Fill("Document", 1, "General", "SUMUNRES", sumUnres)
      End If
      
      ' Լրացնել Մեկնաբանություն դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "COMMENT", "^A[Del]" & wComment)
      ' Լրացնել Գրասենյակ/Բաժին դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "ACSBRANCH", acsBranch &  "[Tab]" & acsSect)
    
      ' Սեղմել Կատարե կոճակը
      Call ClickCmdButton (1, "Î³ï³ñ»É")

End Sub


' Դուրս գրում/Դուրս գրվածի վերականգնում գործողության կատարում
' wDate - Ամսաթիվ
' sumAgr - Հիմնական գումար
' wComment - Մեկնաբանություն
' acsBranch - Գրասենյակ
' acsSect - Բաժին
Sub WriteOffOnAction(action, fISN, wDate, sumAgr, wComment, acsBranch, acsSect)

      BuiltIn.Delay(1000)
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_WriteOff & "|" & action)
      BuiltIn.Delay(1000)
      
      ' Փաստաթղթի ISN - ի ստացում
       Set frmASDocForm = wMDIClient.VBObject("frmASDocForm")
       fISN = frmASDocForm.DocFormCommon.Doc.ISN
       BuiltIn.Delay(1000) 
       
      ' Լրացնել Ամսաթիվ դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "DATE", wDate)
      ' Լրացնել Հիմնական գումար դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "SUMAGR", sumAgr)
      ' Լրացնել Մեկնաբանություն դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "COMMENT", wComment)
      ' Լրացնել Գրասենյակ/Բաժին դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "ACSBRANCH", acsBranch &  "[Tab]" & acsSect)
    
      ' Սեղմել Կատարե կոճակը
      Call ClickCmdButton (1, "Î³ï³ñ»É")

End Sub

' Գործողությունների ջնջում 
' param - Գործողության տեսակ
' dateGive - Ժամանակահատվածի սկիզբ
' dateAgr - Ժամանակահատվածի ավարտ
' colNum - Սյան համարը
' docName - Փաստաթղթի անունը
Sub DeleteFromAllActionDoc(param, sDatePar, dateGive, eDatePar, dateAgr, state, action)
      
      Dim wMainForm, tdbgView
      Set wMainForm = Sys.Process("Asbank").VBObject("MainForm")
         
      ' Գործողություններ / Բոլոր գործողություններ
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(param)
          
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog",1, "General", sDatePar, dateGive )
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog",1, "General", eDatePar, dateAgr)
      
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
      BuiltIn.Delay(1000) 
      Set  tdbgView = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").VBObject("tdbgView")
      
      ' Քանի դեռ թղթապանակում տողերի քանակը հավասար չէ զրոյի
        Do While tdbgView.VisibleRows <> 0  
         If state Then
                  tdbgView.MoveLast 
         End If
        tdbgView.MoveLast 
               ' Ջնջել գործողության կատարում
               Call wMainForm.MainMenu.Click(c_Opers & "|" & action)
               If  Sys.Process("Asbank").WaitVBObject("frmAsMsgBox", delay_small).Exists Then
                    ' Այո կոճակի սեղմում  
                    Call ClickCmdButton(5, "²Ûá") 
                    ' Այո կոճակի սեղմում  
                    Call ClickCmdButton(3, "²Ûá") 
                    BuiltIn.Delay(1000) 
               Else 
                    ' Այո կոճակի սեղմում  
                    Call ClickCmdButton(3, "²Ûá") 
                    BuiltIn.Delay(1000) 
               End If
        Loop
      
End Sub

' Ընդհանուր դիտում 
' rDate - Ամսաթիվ
' rChng - Ցույց տալ փոփոխությունները
' rDeal - Ցույց տալգործողությունները
Sub OverallView(datePar, rDate, rChng, rDeal)

      Dim wMainForm
      Set wMainForm = Sys.Process("Asbank").VBObject("MainForm")
      
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Ընդհանուր դիտում 
      Call wMainForm.PopupMenu.Click(c_References & "|" & c_CommView)
      BuiltIn.Delay(1000)
      
      ' Ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", datePar, rDate )
      ' Ցույց տալ փոփոխությունները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "RCHNG", rChng)
      ' Ցույց տալգործողությունները դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "RDEAL", rDeal)
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")

End Sub

' Պայմանագրի առկա լինելը ստուգող ֆունկցիա
' wFrmPttel - path full name
' colN - Թղթապանակում սյան համարը
' docTypeName - Փաստաթղթի տեսակ 
Function CheckContractDocument(wFrmPttel, colN, docTypeName)

      Dim  tdbgView, status
      status = False
      Set tdbgView = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject(wFrmPttel).VBObject("tdbgView")

      Do Until  tdbgView.EOF
            If  Trim( tdbgView.Columns.Item(colN).Value) = Trim(docTypeName)  Then
                   Log.Message("Փաստաթուղթն առկա է ")
                   status = True
                    Exit Do             
             Else
                     tdbgView.MoveNext
             End If
      Loop 
     CheckContractDocument =  status
     
End Function

' Խմբային հաշվարկ գործողության կատարում
' closeDate - Հաշվարկման ամսաթիվ
' setDate - Ձևակերպման ամսաթիվ
' wDbt - Պարտքերի մարում
' wRes - Պահուստավորում
' wOut - Դուրս գրում
' wInc - Դուրս գրածի վերականգնում
' wCls - Պայմանագրի փակում 
' wRsk - Ռիսկի դասիչների փոփոխում 
Sub GroupCalculation(closeDate, setDate, wDbt, wRes, wOut, wInc, wCls, wRsk)

      ' insert կոճակի սեղմում
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").Keys("[Ins]")
      ' Կատարել գործողությունների դիտում
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Խմբային հաշվարկ
      Call wMainForm.PopupMenu.Click(c_GroupCalc)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Message("Խմբային գործողություններ թղթապանակը չի բացվել")
            Exit Sub
      End If
      
      ' Հաշվարկման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CLOSEDATE", closeDate)
      ' Ձևակերպման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SETDATE", setDate)
      ' Պարտքերի մարում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "DBT", wDbt )
      ' Պահուստավորում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "RES", wRes)
      ' Դուրս գրում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "OUT", wOut)
      ' Դուրս գրածի վերականգնում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "INC", wInc)
      ' Պայմանագրի փակում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "CLS", wCls)
      ' Ռիսկի դասիչների փոփոխում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "RSK", wRsk)
      
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      
End Sub


' Փաստաթղթի ISN-ի ստացում 
' paramN - գործողության անվանում
' stDate - սկզբի ամասթիվ
' endDate - վորջի ամասթիվ
' colN սյան համարը
' docTypeName որոնվող սյան անվանումը
' fISN - փասատթղթի ISN
Sub GetfISNFromActionsView(paramN, stDate, endDate, wFrmPttel, colN, docTypeName, fISN )

Dim  tdbgView, status

       Dim wMainForm, mDIClient
       Set wMainForm = Sys.Process("Asbank").VBObject("MainForm")
         
       BuiltIn.Delay(2000) 
       Call wMainForm.MainMenu.Click(c_AllActions)
       Call wMainForm.PopupMenu.Click(paramN)
         
       ' Ժամանակահատվածի սկիզբ դաշտի լրացում
       Call Rekvizit_Fill("Dialog", 1, "General", "START", stDate )
       ' Ժամանակահատվածի ավարտ դաշտի լրացում
       Call Rekvizit_Fill("Dialog", 1, "General", "END", endDate)
        
       ' Կատարել կոճակի սեղմում
       Call ClickCmdButton(2, "Î³ï³ñ»É")  
       BuiltIn.Delay(2000) 
       
      Set tdbgView = wMainForm.Window("MDIClient", "", 1).VBObject(wFrmPttel).VBObject("TDBGView")
         
      Do Until  tdbgView.EOF
            If  Trim( tdbgView.Columns.Item(colN).Value) = Trim(docTypeName) Then
            
                   ' Գործողություններ / Բոլոր գործողություններ
                  Call wMainForm.MainMenu.Click(c_AllActions)
                  ' Խմբագրել գործողության կատարում
                  Call wMainForm.PopupMenu.Click(c_ToEdit)
                  BuiltIn.Delay(1000) 
        
                  Set mDIClient = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1)
                  ' Փաստաթղթի ISN - ի ստացում
                  fISN = mDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN
        
                  mDIClient.VBObject("frmASDocForm").Close
                  mDIClient.VBObject("frmPttel_2").Close
                  Exit Sub    
             Else
                     tdbgView.MoveNext
             End If
      Loop 
      
      Log.Message("Փաստաթուղթն առկա չէ ")
        
End Sub

' Փոխել Գրասենյակը|Բաժինը|Տիպը գործողության կատարում
' status - Ստանում է True կամ False
' fillAcsBranch - Գրասենյակ չեքբոքս
' fillAcsDepart - Բաժին չեքբոքս
' fillAcsType - Հասան-ն տիպ չեքբոքս
' acsBranch - Գրասենյակ
' acsDepart - Բաժին
' acsType - Հասան-ն տիպ
' fillDefault - Լրացնել կարգավորումներից
Sub ChangeBranchDepartType(status, fillAcsBranch, fillAcsDepart, fillAcsType, acsBranch, acsDepart, acsType, fillDefault )
      
      ' insert կոճակի սեղմում
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").Keys("[Ins]")
      ' Գործողություններ / Բոլոր գործողություններ
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Խմբագրել գործողության կատարում
      Call wMainForm.PopupMenu.Click(c_ChangeSectorType)
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error("Տեղափոխել Գրասենյակը|Բաժինը|Տիպը դիալոգը չի բացվել")
            Exit Sub
      End If
      
      If status Then
        ' Գրասենյակ չեքբոքսի լրացում
        Call Rekvizit_Fill("Dialog", 1, "CheckBox", "FILLUPACSBRANCH", fillAcsBranch)
        ' Բաժին չեքբոքսի լրացում
        Call Rekvizit_Fill("Dialog", 1, "CheckBox", "FILLUPACSDEPART", fillAcsDepart)
        ' Հասան-ն տիպ չեքբոքսի լրացում
        Call Rekvizit_Fill("Dialog", 1, "CheckBox", "FILLUPACSTYPE", fillAcsType)
      End If
      
       ' Գրասենյակ դաշտի լրացում
       Call Rekvizit_Fill("Dialog", 1, "General", "ACSBRANCH", acsBranch)
       ' Բաժին դաշտի լրացում
       Call Rekvizit_Fill("Dialog", 1, "General", "ACSDEPART", acsDepart)
       ' Հասան-ն տիպ դաշտի լրացում
       Call Rekvizit_Fill("Dialog", 1, "General", "ACSTYPE", acsType)
       
       If status Then
            ' Լրացնել կարգավորումներից դաշտի լրացում
            Call Rekvizit_Fill("Dialog", 1, "CheckBox", "FILLDEFAULTACSTYPE", fillDefault)
            ' Կատարել կոճակի սեղմում
            Call ClickCmdButton(2, "Î³ï³ñ»É")
            BuiltIn.Delay(1500)
            Call wMainForm.MainMenu.Click(c_ToRefresh)
            Exit Sub
       End If
       
       ' Լրացնել կարգավորումներից դաշտի լրացում
       Call Rekvizit_Fill("Dialog", 1, "CheckBox", "FILLDEFAULT", fillDefault)
       ' Կատարել կոճակի սեղմում
       Call ClickCmdButton(2, "Î³ï³ñ»É")

       If Not Sys.Process("Asbank").VBObject("frmAsMsgBox").Exists Then
            Log.Error("Դեբիտորական պարտք հաղորդագրության պատուհանը չի բացվել")
            Exit Sub
       End If
       
       Call ClickCmdButton(5, "²Ûá")
       BuiltIn.Delay(1500)
       Call wMainForm.MainMenu.Click(c_ToRefresh)
                  
End Sub