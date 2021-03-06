'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Credit_Line_Library
'USEUNIT Akreditiv_Library
'USEUNIT Contact_Lybrary
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Library

'---------------------------------------------------------------------------------------------------------------------------------------------------
'Այլ գրաֆիկի նշանակում
'---------------------------------------------------------------------------------------------------------------------------------------------------
'param - փաստաթղթի անում
'griddate - ամսաթիվ
'summ - գումար
Function Other_Payment_Schedule_AllTypes(param,date,fDate,eDate,period,direction)

    Dim is_Exists, colNum
    is_Exists = False
    wMDIClient.VBObject("frmPttel").VBObject("tdbgView").MoveFirst
    Do Until wMDIClient.VBObject("frmPttel").VBObject("tdbgView").EOF
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fSPEC")
    	If Trim(wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(colNum).Text) = param  Then
      	is_Exists = True

        Call wMainForm.MainMenu.Click(c_AllActions )
        Call wMainForm.PopupMenu.Click(c_OtherPaySchedule)
        'Լրացնում է "Ամսաթիվ" դաշտը
        Call Rekvizit_Fill("Document",1,"General","DATE",date)
        wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("CheckBox").Click()
        'Լրացնում է "Սկզբի Ամսաթիվ" դաշտը
        Call Rekvizit_Fill("Dialog",1,"General","FIRSTDAY",fDate)
        'Լրացնում է "Վերջի ամսաթիվ դաշտը
        Call Rekvizit_Fill("Dialog",1,"General","LASTDAY",eDate)
        'Լրացնում է "Պարբերություն" դաշտը
        Call Rekvizit_Fill("Dialog",1,"General","PERIODICITY",period & "[Tab]")
        'Լրացնում է "Շրջանցման ուղղություն" դաշտը
        Call Rekvizit_Fill("Dialog",1,"General","PASSOVDIRECTION",direction)
        'Սեղմել "Կատարել" կոճակը
        Call ClickCmdButton(2,"Î³ï³ñ»É")
        'Սեղմել "Կատարել" կոճակը
        Call ClickCmdButton(1,"Î³ï³ñ»É")
        Other_Payment_Schedule_AllTypes = is_Exists
        Exit Function
    	Else
    		wMDIClient.VBObject("frmPttel").VBObject("tdbgView").MoveNext
    	End If
    Loop
    Other_Payment_Schedule_AllTypes = is_Exists

End Function

'------------------------------------------------------
'Փնտրում է պայմանագիրը համարով
'----------------------------------------------------------
'DocNum պայմանագրի համար
'param - սյան համար
Function Find_Doc_ByNum(DocNum,param)
    Dim isexists
    isexists = false
    
    'Լրացնում է պայմանագրի համարը դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","NUM","![End]" & "[Del]" & DocNum)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    Set wMainForm = Sys.Process("Asbank").vbObject("MainForm")
    'Փնտրում է պայմանագիրը ցուցակում, չգտնելու դեպքում դուրս է բերում սխալ
    If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(param).Text) = Trim(DocNum) Then
        isexists = True     
    Else
        Log.Error("The  document  does't exist")
    End If          
    Find_Doc_ByNum = isexists
  
End Function

'-------------------------------------------------------------------------------------------
'Լիզինգի տրամադրում գործողություն
'-------------------------------------------------------------------------------------------
'date -ամսաթիվ
Sub Give_Leasing(date)
    Dim MsgBox
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions )
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_GiveLeasing)
    BuiltIn.Delay(2000)
    
    'Անսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","DATE", "![End]" & "[Del]" & date)
    'Սեղմում է "Կատարել" կոճակը
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    
    Set MsgBox = AsBank.WaitVBObject("frmAsMsgBox",2000)
    If MsgBox.Exists Then 
      Call ClickCmdButton(5, "²Ûá") 
    End If   
End Sub

'---------------------------------------------------------------------------------------------------------
'Պարտքերի մարում գործողություն
'----------------------------------------------------------------------------------
'Date - ամսաթիվ
'debtDate - պարտքի մարման ամսաթիվ
'perSum - տոկոսագումար
'CashOrNo - Կանխիկ/Անկանխիկ
'acc - հաշիվ
Sub Leasing_Fade_Debt(fBase,Date,debtDate,perSum,CashOrNo, acc,DocNum)
  
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_PayOffDebt)
    BuiltIn.Delay(2000)
    wMDIClient.Refresh
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","Date","![End]" & "[Del]" & Date)
    'Պարտքի ամսաթիվ դաշտի լրացուն
    Call Rekvizit_Fill("Document",1,"General","DATEFOROFF","![End]" & "[Del]" &  debtDate)
    'Տոկոսագումար դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","SUMPER","![End]" & "[Del]" & perSum)
    'Կանխիկ/Անկանխիկ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","CASHORNO","![End]" & "[Del]" & CashOrNo)
    'Հաշիվ դաշտի լրացում
    If Not CashOrNo = "2" Then
       Call ClickCmdButton(1, "Î³ï³ñ»É")
       DocNum = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
       Call ClickCmdButton(1, "Î³ï³ñ»É")
       wMDIClient.VBObject("FrmSpr").Close()
    Else
      Call Rekvizit_Fill("Document",1,"General","ACCCORR","![End]" & "[Del]" & acc)
      'Սեղմել Կատարել կոճակը
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      Call ClickCmdButton(5, "²Ûá")
    End If
End Sub

'--------------------------------------------------------------------
'Գումարի մարում տոկոսի հաշվին
'--------------------------------------------------------------------
'dateStart - Ամսաթիվ
'summ - Գումար
Sub Fadeing_LeasingSumma_From_PayedPercents(param, dateStart, rekvName, summ)
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & param)
    BuiltIn.Delay(2000)
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" &  dateStart)
    'Գումար դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General",rekvName,"![End]" & "[Del]" & summ)
  
    'Կատարել կոճակի սեղմում    
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    If p1.WaitVbObject("frmAsMsgBox", 1000).Exists Then
        Call ClickCmdButton(5, "Î³ï³ñ»É")
    Else 
      Exit Sub
    End If
    
End Sub

'----------------------------------------------------------------------------------------
'Դուրս գրում
'---------------------------------------------------------------------------------------- 
'dateStart - Ամսաթիվ
'mainSum - հիմանակն գումար
'perSum - Տոկոսագումար
Sub FillDoc_Write_Out(dateStart, fBase, mainSum,perSum)

    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_WriteOff & "|" & c_WriteOff)
    BuiltIn.Delay(2000)
    fBase = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" &  dateStart)
    'Հիմնական գումար դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","SUMAGR","![End]" & "[Del]" &  mainSum)
    'Տոկոսագումար դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","SUMPER","![End]" & "[Del]" & perSum)
    
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub


'----------------------------------------------------------------------------
'Հաշվարկների ճշգրտում
'------------------------------------------------------------------------------------------
'dateStart - Ամսաթիվ
'summperc - Գումար
Sub Correction_Calculation(dateStart, summperc, fBase)
    
    BuiltIn.Delay(1500)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Interests & "|" & c_AccAdjust)
    BuiltIn.Delay(2000)
    fBase = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","DATE", "![End]" & "[Del]" & dateStart)
    'Տոկոսադրույք դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","SUMPER","![End]" & "[Del]" & summperc)
  
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'----------------------------------------------------------------------------------------------
'Կանխավ վճարված տոկոսների վերադարձ
'-----------------------------------------------------------------------------------------------
'dateStart - Ամսաթիվ
'summ - Գումար
'cashORno - Կանխիկ/Անկանխիկ
'acc - Հաշիվ
Sub Return_Payed_Percent(dateStart, summ,cashORno,acc,fBase, state)
    
    BuiltIn.Delay(1500)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_ReturnPrepaidInt)
    wMDIClient.Refresh
    BuiltIn.Delay(2000)
    fBase = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" &  dateStart)
    'Գումար դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","SUMMA","![End]" & "[Del]" & summ)
    'Կանխիկ/Անկանխիկ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","CASHORNO","![End]" & "[Del]" & cashORno)
    'Հաշիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","ACCCORR","![End]" & "[Del]" & acc)   
    
    'Կատարել կոճակի սեղմում
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    If state Then
        Call ClickCmdButton(5, "Î³ï³ñ»É")
    End If
    Call ClickCmdButton(5, "²Ûá")
End Sub

'---------------------------------------------------------
'Լիզինգի Վերագնահատում գործողության կաատարում
'---------------------------------------------------------
'Date - Ամսաթիվ
'SumRevl - գումար
Sub Leasing_ReEvaluation(Date,SumRevl)
   
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_Revaluation)
    BuiltIn.Delay(2000)
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","DATE", "![End]" & "[Del]" & Date)
    'Վերագնահատում դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","SUMREVL","![End]" & "[Del]" & SumRevl)
    
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'--------------------------------------------------------------------
'Լիզինգի վաճառք
'-----------------------------------------------------------------------
'Date - Ամսաթիվ
'SumSell - Գումար
'cashORno - Կանխիկ/Անկանխիկ
'acc - Հաշիվ
Sub Leasing_Sale(Date,SumSell,cashORno,acc)

    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_LeasingSale)
    BuiltIn.Delay(2000)
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","DATE", "![End]" & "[Del]" & Date)
    'Վերագնահատում դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","SUMSELL","![End]" & "[Del]" & SumSell)
    'Կանխիկ/Անկանխիկ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","CASHORNO","![End]" & "[Del]" & cashORno)  
    'Հաշիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","ACCCORR","![End]" & "[Del]" & acc)   
    
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    BuiltIn.Delay(1000)
    Call ClickCmdButton(5, "²Ûá") 
End Sub

'--------------------------------------------------------------------------------------------
'Խմբային հաշվարկ
'--------------------------------------------------------------------------------------------
'closeDate - Հաշվարկման ամսաթիվ
'setDate - Ձևակերպման ամսաթիվ 
'cap - Պարտքերի մարում
'ext - Տոկոսների հաշվարկում
'rep -  Ռիսկի դասիչների փոփոխում 
'per - Պահուստավորում
'perCalc - Դուրս գրում 
'close - Դուրս գրվածի վերականգնում
'cls - Պայմանագրի փակում
Sub Leasing_Group_Calculate(closeDate,setDate,cap,ext,rep,per,perCalc,close,cls)
    
    BuiltIn.Delay(2000)
    'Նշել բոլոր պայմանագրերը
    Call wMainForm.MainMenu.Click(c_Editor & "|" & c_MarkAll)
    'Խմբային հածվարկ
    Call wMainForm.MainMenu.Click(c_AllActions)  
    Call wMainForm.PopupMenu.Click(c_GroupCalc)
    BuiltIn.Delay(2000)
    
    'Լրացնել Հաշվարկման ամսաթիվ դաշտը 
    Call Rekvizit_Fill("Dialog",1,"General","CLOSEDATE", "![End]" & "[Del]" & closeDate)
    'Լրացնել Ձևակերպման ամսաթիվ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SETDATE","![End]" & "[Del]" & setDate)
    'Դնել Պարտքերի մարում  նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","DBT", cap)
    'Դնել Տոկոսների հաշվարկում նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","CHG",ext)
    'Դնել Ռիսկի դասիչների փոփոխում նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","RSK",rep)
    'Դնել Պահուստավորում նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","RES",per)
    'Դնել Դուրս գրում  նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","OUT",perCalc)
    'Դնել Դուրս գրվածի վերականգնում նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","INC",close)
    'Դնել Պայմանագրի փակում նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","CLS",cls)  
    
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    Call ClickCmdButton(5, "²Ûá")
End Sub

'--------------------------------------------------------------------------------------------
'Գրավի փաստաթղթի ստեղծում
'--------------------------------------------------------------------------------------------
'MortgageType - Գրավի տիպ
'docType - Պայմանագրի տիպ
'curr - Արժույթ
'mortSum - Գրավի արժեք
'mortCount - Քանակ
'sealDate - Կնքման ամսաթիվ
'giveDate - Հատկացման ամսաթիվ
'mortPlace - Գրավի գտնվելու վայր
'mortSub - Գրավի առարկա (ՎՌ)

Sub Create_Mortgage(MortgageType,DocN,docType,curr,mortSum,mortCount,sealDate,giveDate,mortPlace,mortSub)
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)  
    Call wMainForm.PopupMenu.Click(c_Safety & "|" & c_AgrOpen & "|" & c_Mortgage)
    BuiltIn.Delay(2000)
    
    Set frmModalBrowser  =p1.WaitVBObject("frmModalBrowser", 500)	
	  If frmModalBrowser.Exists	Then
			Do Until p1.frmModalBrowser.VBObject("tdbgView").EOF
  			If RTrim(p1.frmModalBrowser.VBObject("tdbgView").Columns.Item(1).Text) = MortgageType  Then
    			Call p1.frmModalBrowser.VBObject("tdbgView").Keys("[Enter]")
    			Exit do
  			Else
    			Call p1.frmModalBrowser.VBObject("tdbgView").MoveNext
  			End If
  		Loop 
	  Else
		  Log.Error("frmModalBrowser does not exists.")
		  Exit Sub
	  End If
    
    DocN = Get_Rekvizit_Value("Document",1,"General","CODE")
    'Պայմանագրի տիպ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","SECTYPE","![End]" & "[Del]" & docType)
    'Արժույթ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","CURRENCY","![End]" & "[Del]" & curr)
    'Գրավի արժեք դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","SUMMA","![End]" & "[Del]" & mortSum)
    'Քանակ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","COUNT","![End]" & "[Del]" & mortCount)
    'Կնքման ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" &  sealDate)
    'Հատկացման ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","DATEGIVE","![End]" & "[Del]" &  giveDate)
    'Գրավի գտնվելու վայր
    Call Rekvizit_Fill("Document",2,"General","PLACE","![End]" & "[Del]" & mortPlace)
    'Գրավի առարկա (ՎՌ) դաշտի լրացում
    Call Rekvizit_Fill("Document",3,"General","MORTSUBJECT","![End]" & "[Del]" & mortSub)
    
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub


'-----------------------------------------------
'Դուրս գրվածի վերականգնում
'-----------------------------------------------
Sub FillDoc_Write_Back(dateStart, mainSum,sumPer, fBASE)
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_WriteOff & "|" & c_WriteOffBack)
    BuiltIn.Delay(2000)
    
    fBASE = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","DATE","![End]" & "[Del]" & dateStart)
    'Հիմնական գումար դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","SUMAGR","![End]" & "[Del]" & mainSum)
    'Տոկոսագումար դաշտի լրացում
    Call Rekvizit_Fill("Document",1,"General","SUMPER","![End]" & "[Del]" & mainPer)
    
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub