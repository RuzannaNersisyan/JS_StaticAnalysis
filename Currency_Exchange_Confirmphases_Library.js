Option Explicit
'USEUNIT Library_Common
'USEUNIT Online_PaySys_Library
'USEUNIT Constants 
'USEUNIT Library_Contracts

Dim fCount, lCount, dCount

'----------------------------------------------
'Արտարժույթի փոխանակում փաստաթղթի լրացում
'----------------------------------------------
'department - Բաժին դաշտի արժեք
'docNumber - Փաստաթղթի համարը
'accDeb - Հաշիվ դեբետ դաշտի արժեք
'accCred - Հաշիվ կրեդիտ դաշտի արժեք
'cur1 - Արժույթ 1 դաշտի արժեք
'cur2 - Արժույթ 2 դաշտի արժեք
'summa1 - Գումար 1 արժույթով դաշտի արժեք
'aim - Նպատակ դաշտի արժեք
'type -  Գանձման տեսակ դաշտի արժեք
'clientCode - Հաճախորդի կոդ դաշտի արժեք
'clientName - Վճարող/Ստացող դաշտի արժեք
'fISN - Փաստատթղթի ISN-ը
Sub Currency_Exchange_Doc_Fill(department, docNumber, accDeb, accCred, cur1, cur2, summa1, _
                               aim , ptype, clientCode, clientName, fISN, draft)
    Dim expectedMessage
    
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_CurExch & "|" & c_CurExch)
    BuiltIn.Delay(1000)
    
    'Ստեղծվող ISN - ի փաստատթղթի  վերագրում փոփոխականին
    fISN = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Բաժին դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "ACSDEPART", department)
    'Փաստաթղթի N դաշտի արժեքի վերագրում փոփոխականին
    docNumber = Get_Rekvizit_Value("Document", 1, "General", "DOCNUM")    
    'Հաշիվ դեբետ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "ACCDB", accDeb)
    'Հաշիվ կրեդիտ դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "ACCCR", accCred)
    'Արժույթ 1 դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "CURDB", cur1)
    'Արժույթ 2 դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "CURCR", cur2)
    'Գումար 1 արժույթով դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "SUMDB", summa1)
    'Գումար 1 արժույթով դաշտի լրացում
    Call Rekvizit_Fill("Document", 1, "General", "AIM", aim)
    
    'Անցում 2.Լրացուցիչ էջին
    Call GoTo_ChoosedTab(2)
    'Գանձման տեսակ դաշտի լրացում
    Call Rekvizit_Fill("Document", 2, "General", "PAYSCALE", ptype)

    'Անցում 3.Դրամարկղ էջին
    Call GoTo_ChoosedTab(3)
    'Հաճախորդի կոդ դաշտի լրացում
    Call Rekvizit_Fill("Document", 3, "General", "CliCode", clientCode)
    expectedMessage = "öáË»±É ÷áË³ñÅ»ùÁ Áëï Ýáñ Ñ³×³Ëáñ¹Ç" & vbNewLine & "öáË³ñÅ»ùÇ ÷á÷áËÙ³Ý ¹»åùáõÙ Ï³é³ç³Ý³ ·áõÙ³ñÝ»ñÇ í»ñ³Ñ³ßí³ñÏÇ " & vbNewLine & "Ï³ñÇù"
    If  MessageExists(2, expectedMessage) Then
      Call ClickCmdButton(5, "²Ûá") 
    End If 
    'Վճարող/Ստացող դաշտի լրացում
    Call Rekvizit_Fill("Document", 3, "General", "PAYREC", "^A[Del]" & clientName)
    ' Կատարել կամ Սևագիր կոճակի սեղմում
    If draft Then
        Call ClickCmdButton(1, "ê¨³·Çñ") 
	Else
         Call ClickCmdButton(1, "Î³ï³ñ»É") 
	End If
End Sub

'---------------------------------------------------------------------------------
'¶ÉË³íáñ Ñ³ßí³å³ÑÇ ÁÝ¹Ñ³Ýáõñ ¹ÇïáõÙ ÃÕÃ³å³Ý³ÏáõÙ ÷³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
'---------------------------------------------------------------------------------
'fISN - ö³ëï³ÃÕÃÇ ISN
Function Check_Doc_In_GeneralView_Folder(fISN)
  Dim is_exists : is_exists = False
  Dim colN
    
  BuiltIn.Delay(3000)
  Call wTreeView.DblClickItem("|¶ÉË³íáñ Ñ³ßí³å³ÑÇ ²Þî|ÀÝ¹Ñ³Ýáõñ ¹ÇïáõÙ")
  If p1.WaitVBObject("frmAsUstPar", 6000).Exists Then
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  Else
    Log.Error "The double input frmAsUstPar does't exist", "", pmNormal, ErrorColor
  End If
     
  If wMDIClient.WaitVBObject("frmPttel", 6000).Exists Then
    colN = wMDIClient.vbObject("frmPttel").GetColumnIndex("FISN")
    BuiltIn.Delay(3000)
    If SearchInPttel("frmPttel", colN, fISN) Then
      BuiltIn.Delay(2000)
      is_exists = true
    End If
  Else
    Log.Message "The sending documnet frmPttel doesn't exist", "", pmNormal, ErrorColor
  End If
  
  Check_Doc_In_GeneralView_Folder = is_exists
End Function

'---------------------------------------
'ÎñÝ³ÏÇ Ùáõïù ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ
'---------------------------------------
Function Currency_Exchange_DoubleInput(sum1)
    Dim isverify, rekvName, curr, sum2
    isverify = False
    
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    wMainForm.PopupMenu.click(c_DoubleInput)
    If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
        'Գումար 1 արժույթով դաշտի լրացում
        Call Rekvizit_Fill("Document", 1, "General", "SUMDB", sum1)
        'Գումար 2 արժույթվ դաշտի հաշվարկ
        rekvName = GetVBObject("COURSE", wMDIClient.vbObject("frmASDocForm"))
        curr = aqConvert.StrToFloat(wMDIClient.vbObject("frmASDocForm").vbObject("TabFrame").vbObject(rekvName).vbObject("TDBNumber1").Text)
        sum2 = aqConvert.FloatToStr(aqConvert.StrToFloat(sum1) / curr)
        'Գումար 2 արժույթվ դաշտի լրացում
        Call Rekvizit_Fill("Document", 1, "General", "SUMCR", sum2)
        Call ClickCmdButton(1, "Î³ï³ñ»É")
    Else
        Log.Message("Can't open the document for double input")
    End If
    
    If p1.WaitVBObject("frmAsMsgBox", 1000).Exists Then
        Call ClickCmdButton(5, "²Ûá")
    Else
        isverify = True
    End If
    
    Currency_Exchange_DoubleInput = isverify
End Function

'-----------------------------------------------------------
'Սևագրեր թղթապանակից արտարժույթի փոխանակման հաստատում
'-----------------------------------------------------------
'sum1 - Գումար 1 արժույթով դաշտի արժեք
Sub Currency_Exchange_Verify_From_Draft(sum1)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    wMainForm.PopupMenu.Click(c_ToEdit)
    If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
        'Գումար 1 արժույթով դաշտի լրացում
        Call Rekvizit_Fill("Document", 1, "General", "SUMDB", sum1)
       Call ClickCmdButton(1, "Î³ï³ñ»É")
    Else
        Log.Message("Can't open the document for verify")
    End If
End Sub

'Արտարժույթի փոխանակման կլասս
Class CurrExchangeCom
    Public isn
    Public div
    Public dep
    Public docN
    Public fDate
    Public dAcc
    Public cAcc
    Public cur1
    Public cur2
    Public way
    Public course
    Public sum1
    Public sum2
    Public buySell
    Public opType
    Public opPlace
    Public busField
    Public nonRes
    Public legalPos
    Public aim
    Public tabN
    Public check
    
    Private Sub Class_Initialize
        isn = ""
        div = ""
        dep = ""
        docN = ""
        fDate = "  /  /    "
        dAcc = ""
        cAcc = ""
        cur1 = ""
        cur2 = ""
        way = ""
        course = "1.0000/1"
        sum1 = "0.00"
        sum2 = "0.00"
        buySell = ""
        opType = ""
        opPlace = ""
        busField = ""
        nonRes = 0
        legalPos = ""
        aim = ""
        tabN = 1
        check = True
    End Sub  
End Class

Function New_CurrExchangeCom()
    Set New_CurrExchangeCom = new CurrExchangeCom
End Function

Class CurrExchangeAdd
    Public CBCourse1
    Public CBCourse2
    Public fTime
    Public comAcc
    Public comAccCur
    Public CBRateCom
    Public chargeType
    Public comInterest
    Public comAmmount
    Public incAccCom
    Public comment
    Public purSale
    Public recPaySys
    Public sentPaySys
    Public incCurrExch
    Public expenseCurrExch
    Public cashAccSum
    Public cashCur
    Public reCount
    Public cliAgrDetails    
    Public tabN
    Public check
    
        
    Private Sub Class_Initialize
        CBCourse1 = "1.0000/1"
        CBCourse2 = "1.0000/1"
        comAcc = ""
        comAccCur = ""
        CBRateCom = "1.0000/1"
        chargeType = ""
        comInterest = "0.0000"
        comAmmount = "0.00"
        incAccCom = ""
        comment = ""
        purSale = ""
        recPaySys = ""
        sentPaySys = ""
        incCurrExch = ""
        expenseCurrExch = ""
        cashAccSum = "0.00"
        cashCur = ""
        reCount = 0
        cliAgrDetails = ""
        tabN = 2
        check = True
    End Sub      
End Class

Function New_CurrExchangeAdd()
    Set New_CurrExchangeAdd = new CurrExchangeAdd
End Function

Class CurrExchangeCD
    Public cashDesk
    Public base
    Public totInput
    Public totInputCur
    Public totInputSB
    Public totOutput
    Public totOutputCur
    Public totOutputSB
    Public clientCode
    Public payerReciever
    Public fName
    Public lName
    Public idNum
    Public idType
    Public issuedBy
    Public issueDate
    Public expireDate
    Public socCard
    Public birthDate
    Public citizen
    Public country
    Public community
    Public city
    Public street
    Public eMail
    Public flat
    Public house
    Public bithPlace
    Public stateRegCertN
    Public taxCodeP
    Public tabN
    Public check
       
    Private Sub Class_Initialize
        cashDesk = ""
        base = ""
        totInput = "0.00"
        totInputCur = ""
        totInputSB = ""
        totOutput = "0.00"
        totOutputCur = ""
        totOutputSB = ""
        clientCode = ""
        payerReciever = ""
        fName = ""
        lName = ""
        idNum = ""
        idType = ""
        issuedBy = ""
        issueDate = "  /  /    "
        expireDate = "  /  /    "
        socCard = ""
        birthDate = ""
        citizen = ""
        country = ""
        community = ""
        city = ""
        street = ""
        eMail = ""
        flat = ""
        house = ""
        bithPlace = ""
        stateRegCertN = ""
        taxCodeP = ""
        tabN = 3
        check = True        
    End Sub      

End Class

Function New_CurrExchangeCD()
    Set New_CurrExchangeCD = new CurrExchangeCD
End Function


Class CurrExchange 
    Public commonTab
    Public addTab
    Public cashDeskTab
    Public attachTab
    
    Private Sub Class_Initialize
        Set commonTab = New_CurrExchangeCom()
        Set addTab = New_CurrExchangeAdd()
        Set cashDeskTab = New_CurrExchangeCD()
        Set attachTab = New_Attached_Tab(fCount, lCount, dCount)
        attachTab.tabN = 4
    End Sub  
End Class

Function New_CurrExchange(fileC ,linkC , deleteC)
    fCount = fileC
    lCount = linkC
    dCount = deleteC
    Set New_CurrExchange = new CurrExchange
End Function

'Արտարժույթի փոխանակման փաստաթուղթը ստուգող ֆունկցիա
Sub Currency_Exchange_Check(curEx)
    Dim count, expCount, i
    'Անցում Ընդհանուր էջ
    If curEx.commonTab.check Then
        Call GoTo_ChoosedTab(curEx.commonTab.tabN)  
        'Գրասենյակ դաշտի ստուգում
        Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Mask","ACSBRANCH"),curEx.commonTab.div)
        'Գրասենյակ դաշտի ստուգում
        Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Mask","ACSDEPART"),curEx.commonTab.dep)
        'Փաստաթղթի N դաշտի ստուգում
        Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"General","DOCNUM"),curEx.commonTab.docN)
        'Ամսաթիվ դաշտի ստուգում
        Call Compare_Two_Values("Ամսաթիվ",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"General","DATE"),curEx.commonTab.fDate) 
        'Հաշիվ Դեբետ դաշտի ստուգում
        Call Compare_Two_Values("Հաշիվ Դեբետ",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Mask","ACCDB"),curEx.commonTab.dAcc)
        'Հաշիվ Կրեդիտ դաշտի ստուգում
        Call Compare_Two_Values("Հաշիվ Կրեդիտ",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Mask","ACCCR"),curEx.commonTab.cAcc)       
        'Արժույթ 1 դաշտի ստուգում
        Call Compare_Two_Values("Արժույթ 1",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Mask","CURDB"),curEx.commonTab.cur1)
        'Արժույթ 2 դաշտի ստուգում
        Call Compare_Two_Values("Արժույթ 2",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Mask","CURCR"),curEx.commonTab.cur2)  
        'Փոխարժեք դաշտի ստուգում
        Call Compare_Two_Values("Փոխարժեք",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Mask","CASH"),curEx.commonTab.way)
        'Փոխարժեք 2 դաշտի ստուգում
        Call Compare_Two_Values("Փոխարժեք 2",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Course","COURSE"),curEx.commonTab.course)
        'Գումար 1 արժույթով դաշտի ստուգում
        Call Compare_Two_Values("Գումար 1 արժույթով",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"General","SUMDB"),curEx.commonTab.sum1)                
        'Գումար 2 արժույթով դաշտի ստուգում
        Call Compare_Two_Values("Գումար 2 արժույթով",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"General","SUMCR"),curEx.commonTab.sum2)                
        'Առք/Վաճառք դաշտի ստուգում
        Call Compare_Two_Values("Առք/Վաճառք",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Mask","CUPUSA"),curEx.commonTab.buySell)                
        'Գործողության տեսակ դաշտի ստուգում
        Call Compare_Two_Values("Գործողության տեսակ",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Mask","CURTES"),curEx.commonTab.opType)
        'Գործողության վայր դաշտի ստուգում
        Call Compare_Two_Values("Գործողության վայր",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Mask","CURVAIR"),curEx.commonTab.opPlace)
        'Գործունեության ոլորտ դաշտի ստուգում
        Call Compare_Two_Values("Գործունեության ոլորտ",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Mask","VOLORT"),curEx.commonTab.busField)
        'Ոչ ռեզիդենտ դաշտի ստուգում
        Call Compare_Two_Values("Ոչ ռեզիդենտ",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"CheckBox","NONREZ"),curEx.commonTab.nonRes)
        'Իրավաբանական կարգավիճակ դաշտի ստուգում
        Call Compare_Two_Values("Իրավաբանական կարգավիճակ",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Mask","JURSTAT"),curEx.commonTab.legalPos)
        'Նպատակ դաշտի ստուգում
        Call Compare_Two_Values("Նպատակ",Get_Rekvizit_Value("Document",curEx.commonTab.tabN,"Comment","AIM"),curEx.commonTab.aim)
    End If
    
    'Անցում Լրացուցիչ էջ
    If curEx.addTab.check Then
        Call GoTo_ChoosedTab(curEx.addTab.tabN)  
        'ԿԲ փոխարժեք 1 դաշտի ստուգում
        Call Compare_Two_Values("ԿԲ փոխարժեք 1",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Course","CBCRS1"),curEx.addTab.CBCourse1)
        'ԿԲ փոխարժեք 2 դաշտի ստուգում
        Call Compare_Two_Values("ԿԲ փոխարժեք 2",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Course","CBCRS2"),curEx.addTab.CBCourse2)
        'Ժամանակ դաշտի ստուգում
        Call Compare_Two_Values("Ժամանակ",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Mask","TIME"),curEx.addTab.fTime)
        'Կոմիսիոն պահման հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Կոմիսիոն պահման հաշիվ",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Mask","ACCCOMIS"),curEx.addTab.comAcc)       
        'Կոմիսիոն հաշվի արժույթ դաշտի ստուգում
        Call Compare_Two_Values("Կոմիսիոն հաշվի արժույթ",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Mask","CURCOMIS"),curEx.addTab.comAccCur)       
        'ԿԲ փոխարժեք դաշտի ստուգում
        Call Compare_Two_Values("ԿԲ փոխարժեք",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Course","COMCBCRS"),curEx.addTab.CBRateCom)                                        
        'Գանձման տեսակ դաշտի ստուգում
        Call Compare_Two_Values("Գանձման տեսակ",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Mask","PAYSCALE"),curEx.addTab.chargeType)                                        
        'Կոմիսիոն տոկոս դաշտի ստուգում
        Call Compare_Two_Values("Կոմիսիոն տոկոս",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"General","PRSNT"),curEx.addTab.comInterest)                                        
        'Կոմիսիոն գումար դաշտի ստուգում
        Call Compare_Two_Values("Կոմիսիոն գումար",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"General","SUMCOMIS"),curEx.addTab.comAmmount)                                        
        'Կոմիս. պահումներից եկամ. հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Կոմիս. պահումներից եկամ. հաշիվ",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Mask","INCACCCOM"),curEx.addTab.incAccCom)                                        
        'Մեկնաբանություն դաշտի ստուգում
        Call Compare_Two_Values("Մեկնաբանություն",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"General","COMM"),curEx.addTab.comment)                                        
        'Առք/Վաճառք դաշտի ստուգում
        Call Compare_Two_Values("Առք/Վաճառք",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Mask","CUPUSACOM"),curEx.addTab.purSale)                                        
        'Ընդ. վճ. համակարգ դաշտի ստուգում
        Call Compare_Two_Values("Ընդ. վճ. համակարգ",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Mask","PAYSYSIN"),curEx.addTab.recPaySys)                                        
        'Ուղ. վճ. համակարգ դաշտի ստուգում
        Call Compare_Two_Values("Ուղ. վճ. համակարգ",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Mask","PAYSYSOUT"),curEx.addTab.sentPaySys)                                        
        'Եկամուտներ արտ փոխանակումից դաշտի ստուգում
        Call Compare_Two_Values("Եկամուտներ արտ փոխանակումից",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Mask","INCACCCUREX"),curEx.addTab.incCurrExch)                                        
        'Վնասներ արտ փոխանակումից դաշտի ստուգում
        Call Compare_Two_Values("Վնասներ արտ փոխանակումից",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Mask","EXPACCCUREX"),curEx.addTab.expenseCurrExch)                                        
        'Կանխիկի հաշվառ. դաշտի ստուգում
        Call Compare_Two_Values("Կանխիկի հաշվառ.",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"General","CASHACSUM"),curEx.addTab.cashAccSum)
        'Կանխիկի հաշվառ. արժույթ դաշտի ստուգում
        Call Compare_Two_Values("Կանխիկի հաշվառ. արժույթ ",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"Mask","CASHCUR"),curEx.addTab.cashCur)
        'Վերահաշվարկել դաշտի ստուգում
        Call Compare_Two_Values("Վերահաշվարկել",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"CheckBox","FRSHCASHAC"),curEx.addTab.reCount)                 
        'Հաճ. պայմանագ. տվյալներ դաշտի ստուգում
        Call Compare_Two_Values("Հաճ. պայմանագ. տվյալներ",Get_Rekvizit_Value("Document",curEx.addTab.tabN,"General","AGRDETAILS"),curEx.addTab.cliAgrDetails)       
    End If    
    
    'Անցում Դրամարկղ էջ
    If curEx.cashDeskTab.check Then
        Call GoTo_ChoosedTab(curEx.cashDeskTab.tabN)  
        'Դրամարկղ դաշտի ստուգում
        Call Compare_Two_Values("Դրամարկղ",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Mask","KASSA"),curEx.cashDeskTab.cashDesk)  
        'Հիմք դաշտի ստուգում
        Call Compare_Two_Values("Հիմք",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Comment","BASE"),curEx.cashDeskTab.base)  
        'Ընդամենը մուտք դաշտի ստուգում
        Call Compare_Two_Values("Ընդամենը մուտք",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","TOTALIN"),curEx.cashDeskTab.totInput)
        'Ընդամենը մուտք արժույթ դաշտի ստուգում
        Call Compare_Two_Values("Ընդամենը մուտք արժույթ",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Mask","CURIN"),curEx.cashDeskTab.totInputCur)  
        'Դրամարկղի նիշ 1 դաշտի ստուգում
        Call Compare_Two_Values("Դրամարկղի նիշ 1",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Mask","KASSIMV"),curEx.cashDeskTab.totInputSB)           
        'Ընդամենը ելք դաշտի ստուգում
        Call Compare_Two_Values("Ընդամենը ելք",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","TOTALOUT"),curEx.cashDeskTab.totOutput)
        'Ընդամենը ելք արժույթ դաշտի ստուգում
        Call Compare_Two_Values("Ընդամենը ելք արժույթ",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Mask","CUROUT"),curEx.cashDeskTab.totOutputCur)  
        'Դրամարկղի նիշ 2 դաշտի ստուգում
        Call Compare_Two_Values("Դրամարկղի նիշ 2",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Mask","KASSIMOUT"),curEx.cashDeskTab.totOutputSB)  
        'Հաճախորդի կոդ դաշտի ստուգում
        Call Compare_Two_Values("Հաճախորդի կոդ",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Mask","CLICODE"),curEx.cashDeskTab.clientCode)  
        'Անուն դաշտի ստուգում
        Call Compare_Two_Values("Անուն",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Comment","PAYREC"),curEx.cashDeskTab.fName)
        'Ազգանուն դաշտի ստուգում
        Call Compare_Two_Values("Ազգանուն",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","PAYRECLASTNAME"),curEx.cashDeskTab.lName)
        'Անձը հաստ. փաստ. կոդ դաշտի ստուգում
        Call Compare_Two_Values("Անձը հաստ. փաստ. կոդ",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Comment","PASSNUM"),curEx.cashDeskTab.idNum)
        'Տիպ դաշտի ստուգում
        Call Compare_Two_Values("Տիպ",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Mask","PASTYPE"),curEx.cashDeskTab.idType)
        'Տրված 1 դաշտի ստուգում
        Call Compare_Two_Values("Տրված 1",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","PASBY"),curEx.cashDeskTab.issuedBy)
        'Տրված 2 դաշտի ստուգում
        Call Compare_Two_Values("Տրված 2",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","DATEPASS"),curEx.cashDeskTab.issueDate)
        'Վավեր է մինչև դաշտի ստուգում
        Call Compare_Two_Values("Վավեր է մինչև",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","DATEEXPIRE"),curEx.cashDeskTab.expireDate)
        'Սոցիալական քարտ դաշտի ստուգում
        Call Compare_Two_Values("Սոցիալական քարտ",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","REGNUM"),curEx.cashDeskTab.socCard)
        'Ծննդյան ամսաթիվ դաշտի ստուգում
        Call Compare_Two_Values("Ծննդյան ամսաթիվ",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","DATEBIRTH"),curEx.cashDeskTab.birthDate)
        'Քաղաքացիություն դաշտի ստուգում
        Call Compare_Two_Values("Քաղաքացիություն",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Mask","CITIZENSHIP"),curEx.cashDeskTab.citizen)
        'Երկիր դաշտի ստուգում
        Call Compare_Two_Values("Երկիր",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Mask","COUNTRY"),curEx.cashDeskTab.country)
        'Բնակավայր դաշտի ստուգում
        Call Compare_Two_Values("Բնակավայր",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Mask","COMMUNITY"),curEx.cashDeskTab.community)
        'Քաղաք դաշտի ստուգում
        Call Compare_Two_Values("Քաղաք",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","CITY"),curEx.cashDeskTab.city)
        'Բնակարան դաշտի ստուգում
        Call Compare_Two_Values("Բնակարան",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","APARTMENT"),curEx.cashDeskTab.flat)     
        'Փողոց դաշտի ստուգում
        Call Compare_Two_Values("Փողոց",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","ADDRESS"),curEx.cashDeskTab.street)     
        'Տուն/Շենք դաշտի ստուգում
        Call Compare_Two_Values("Տուն/Շենք",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","BUILDNUM"),curEx.cashDeskTab.house)     
        'Էլ. հասցե դաշտի ստուգում
        Call Compare_Two_Values("Էլ. հասցե",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","EMAIL"),curEx.cashDeskTab.eMail)     
        'Ծննդավայր դաշտի ստուգում
        Call Compare_Two_Values("Ծննդավայր",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Comment","BIRTHPLACE"),curEx.cashDeskTab.bithPlace)     
        'Պետ. գրանցման վկայականի համար դաշտի ստուգում
        Call Compare_Two_Values("Պետ. գրանցման վկայականի համար",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"General","REGCERT"),curEx.cashDeskTab.stateRegCertN)     
        'ՀՎՀՀ (Վճարող) դաշտի ստուգում
        Call Compare_Two_Values("ՀՎՀՀ (Վճարող)",Get_Rekvizit_Value("Document",curEx.cashDeskTab.tabN,"Comment","TAXCODSD"),curEx.cashDeskTab.taxCodeP)
    End If               
    Call Attach_Tab_Check(curEx.attachTab)
End Sub