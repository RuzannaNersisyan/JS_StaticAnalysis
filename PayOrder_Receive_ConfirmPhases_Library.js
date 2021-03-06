Option Explicit
'USEUNIT Library_Common
'USEUNIT Library_Colour
'USEUNIT Online_PaySys_Library
'USEUNIT Constants
'USEUNIT Library_Contracts
Dim fCount, lCount, dCount

'----------------------------------------------------------------------
'Վճարման հանձնարարագիր (ստ.) տեսակի վճարային փաստաթղթի լրացում
'----------------------------------------------------------------------

'office - Գրասենյակ/Բաժին դաշտի արժեքը
'department - Հաշվապահություն դաշտի արժեքը
'docNumber - Փաստաթղթի համարը
'data - Ամսաթիվ դաշտի արժեքը
'accDeb - Հաշիվ դեբետ դաշտի արժեքը
'payer - Վճարող դաշտի արժեքը
'accCredit - Հաշիվ կրեդիտ դաշտի արժեքը
'receiver - Ստացող դաշտի արժեքը
'summa - Գումար դաշտի արժեքը
'aim - Նպատակ դաշտի արժեքը
'trAcc - Տարանցիկ հաշիվ դաշտի արժեք
'fISN - Փաստաթղթի ISN
Sub PayOrder_Receive_Fill(office, department, docNumber, data, accDeb, payer, accCredit, receiver, summa, aim , trAcc, fISN)
  BuiltIn.Delay(3000)
  'Ստեղծվող ISN - ի փաստատթղթի  վերագրում փոփոխականին
  fISN = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
  'Գրասենյակ դաշտի լրացում
  Call Rekvizit_Fill("Document", 1, "General", "ACSBRANCH", office)
  'Բաժին դաշտի լրացում
  Call Rekvizit_Fill("Document", 1, "General", "ACSDEPART", department)
  'Փաստաթղթի N դադաշտիշտի արժեքի վերագրում փոփոխականին
  docNumber = Get_Rekvizit_Value("Document", 1, "General", "DOCNUM")
  'Ամսաթիվ դաշտի լրացում
  Call Rekvizit_Fill("Document", 1, "General", "DATE", data)
  'Հաշիվ կրեդիտ դաշտի լրացում
  Call Rekvizit_Fill("Document", 1, "General", "ACCCR", "^A[Del]" & accCredit)
  'Ստացող դաշտի լրացում
  Call Rekvizit_Fill("Document", 1, "General", "RECEIVER", receiver)
  'Հաշիվ դեբետ դաշտի լրացում
  Call Rekvizit_Fill("Document", 1, "General", "ACCDB", "^A[Del]" & accDeb)
  'Վճարող դաշտի լրացում
  Call Rekvizit_Fill("Document", 1, "General", "PAYER", "^A[Del]" & payer)
  'Գումար դաշտի լրացում
  Call Rekvizit_Fill("Document", 1, "General", "SUMMA", summa)    
  'Նպատակ դաշտի լրացում
  Call Rekvizit_Fill("Document", 1, "General", "AIM", aim)
    
  'Անցում  2.Լրացուցիչ էջին
  Call GoTo_ChoosedTab(2)
  'Տարանցիկ հաշիվ դաշտի լրացում
  Call Rekvizit_Fill("Document", 2, "General", "TCORRACC", trAcc)
  'Կատարել կոճակի սեղմում
  Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'------------------------------------------------------------------------------
' ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "Ð³ßí³éÙ³Ý »ÝÃ³Ï³" ÃÕÃ³å³Ý³ÏáõÙ :üáõÝÏóÇ³Ý
' í»ñ³¹³ñÓÝáõÙ ¿ true ,»Ã» ÷³ëï³ÃáõÕÃÁ ³éÏ³ ¿ ¨ false , »Ã» ³ÛÝ µ³ó³Ï³ÛáõÙ ¿:
'------------------------------------------------------------------------------
'docNum - ö³ëï³ÃÕÃÇ Ñ³Ù³ñ
'startDate - Ä³Ù³Ý³Ï³Ñ³ïí³ÍÇ ëÏ½µÇ ³Ùë³ÃÇí
'endDate - Ä³Ù³Ý³Ï³Ñ³ïí³ÍÇ í»ñçÇÝ ³Ùë³ÃÇí
Function Check_Doc_In_UnderRegistration_Folder (docNum, startDate, endDate)
  Dim is_exists : is_exists = false
  Dim colN
    
  Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|êï³óí³Í Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|Ð³ßí³éÙ³Ý »ÝÃ³Ï³")
    
  If p1.WaitVBObject("frmAsUstPar", 3000).Exists Then
    'Ä³Ù³Ý³Ï³Ñ³ïí³ÍÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Dialog", 1, "General", "PERN", startDate)
    Call Rekvizit_Fill("Dialog", 1, "General", "PERK", endDate)
    'Î³ï³ñáÕ ¹³ßïÇ Ù³ùñáõÙ
    Call Rekvizit_Fill("Dialog", 1, "General", "USER", "^A" & "[Del]")
    'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  Else 
    Log.Error "Can't open frmAsUstPar window", "", pmNormal, ErrorColor
  End If
  If wMDIClient.WaitVBObject("frmPttel", 3000).Exists Then
    colN = wMDIClient.vbObject("frmPttel").GetColumnIndex("DOCNUM")
    If SearchInPttel("frmPttel", colN, docNum) Then
      is_exists = true
    End If
  Else 
    Log.Error "Can't open frmPttel window", "", pmNormal, ErrorColor
  End If
      
  Check_Doc_In_UnderRegistration_Folder = is_exists
End Function

'--------------------------------------------------------------------------------------
' ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ "Ð³ßí³éÙ³Í ëï³óí³Í ÷áË³ÝóáõÙÝ»ñ" ÃÕÃ³å³Ý³ÏáõÙ :üáõÝÏóÇ³Ý
' í»ñ³¹³ñÓÝáõÙ ¿ true ,»Ã» ÷³ëï³ÃáõÕÃÁ ³éÏ³ ¿ ¨ false , »Ã» ³ÛÝ µ³ó³Ï³ÛáõÙ ¿:
'---------------------------------------------------------------------------------------
Function Check_Doc_In_Registered_Folder (docNum, startDate, endDate)
  Dim is_exists : is_exists = false
  Dim colN
    
  Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|Ð³ßí³éí³Í ëï³óí³Í ÷áË³ÝóáõÙÝ»ñ")
  If p1.WaitVBObject("frmAsUstPar", 3000).Exists Then
    'Ä³Ù³Ý³Ï³Ñ³ïí³ÍÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Dialog", 1, "General", "PERN", startDate)
    Call Rekvizit_Fill("Dialog", 1, "General", "PERK", endDate)
    'Î³ï³ñáÕ ¹³ßïÇ Ù³ùñáõÙ
    Call Rekvizit_Fill("Dialog", 1, "General", "USER", "^A" & "[Del]")
    'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  Else 
    Log.Error "Can't open frmAsUstPar window", "", pmNormal, ErrorColor
  End If
    
  If wMDIClient.WaitVBObject("frmPttel", 3000).Exists Then
    colN = wMDIClient.vbObject("frmPttel").GetColumnIndex("DOCNUM")
    If SearchInPttel("frmPttel", colN, docNum) Then
      is_exists = true
    End If
  Else 
    Log.Error "Can't open frmPttel window", "", pmNormal, ErrorColor
  End If
  
  Check_Doc_In_Registered_Folder = is_exists  
End Function

'------------------------------------------------
'"Ößï»É Ù³ñáõÙÁ" ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ 
'-------------------------------------------------
Sub Clarify_Fading ()
  BuiltIn.Delay(3000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click("Ճշտել մարումը")
  If p1.WaitVBObject("frmAsMsgBox", 3000).Exists Then
    Call ClickCmdButton(5, "²Ûá")
  Else 
    Log.Error "Can't open frmPttel window", "", pmNormal, ErrorColor
  End If
  BuiltIn.Delay(1000)
  wMDIClient.VBObject("frmPttel").Close()
End Sub

'------------------------------------------------
'"Ø³ñ»É" ·áñÍáÕáõÃÛ³Ý Ï³ï³ñáõÙ 
'-------------------------------------------------
Sub Fade_Doc ()
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_ToFade)
    BuiltIn.Delay(1000)
    Call ClickCmdButton(5, "²Ûá")
End Sub

'-------------------------------------------------------------------------------
'"î³ñ³ÝóÇÏ" ÃÕÃ³å³Ý³ÏáõÙ ÷³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ : üáõÝÏóÇ³Ý í»ñ³¹³ñÓÝáõÙ ¿
'true , »Ã» ÷³ëï³ÃáõÕÃÁ ³éÏ³ ¿ , ¨ false `  »Ã» ³ÛÝ µ³ó³Ï³ÛáõÙ ¿ :
'-------------------------------------------------------------------------------
Function Check_Doc_In_Transit_Folder (docNum, startDate, endDate)
  Dim is_exists : is_exists = false
  Dim colN
  
  Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|êï³óí³Í Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|î³ñ³ÝóÇÏ")
  If p1.WaitVBObject("frmAsUstPar", 3000).Exists Then
    'Ä³Ù³Ý³Ï³Ñ³ïí³ÍÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Dialog", 1, "General", "PERN", startDate)
    Call Rekvizit_Fill("Dialog", 1, "General", "PERK", endDate)
    'Î³ï³ñáÕ ¹³ßïÇ Ù³ùñáõÙ
    Call Rekvizit_Fill("Dialog", 1, "General", "USER", "^A" & "[Del]")
    'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  Else 
    Log.Error "Can't find frmAsUstPar window", "", pmNormal, ErrorColor
  End If
    
  If wMDIClient.WaitVBObject("frmPttel", 3000).Exists Then
    colN = wMDIClient.vbObject("frmPttel").GetColumnIndex("DOCNUM")
    If SearchInPttel("frmPttel", colN, docNum) Then
    is_exists = true
    End If
  Else
    Log.Message "The sending documnet frmPttel doesn't exist", "", pmNormal, ErrorColor
  End If
  
  Check_Doc_In_Transit_Folder = is_exists  
End Function

'-------------------------------------------------------------------------------
'ö³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ Ø³ëÝ³ÏÇ ËÙµ³·ñíáÕ Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ ÃÕÃ³å³Ý³ÏáõÙ :
'-------------------------------------------------------------------------------
Function Check_Doc_In_Partial_Edit_Folder (docNum, startDate, endDate)
  Dim is_exists : is_exists = False
  Dim colN
    
  Call wTreeView.DblClickItem("|²ñï³ùÇÝ ÷áË³ÝóáõÙÝ»ñÇ ²Þî|ÂÕÃ³å³Ý³ÏÝ»ñ|àõÕ³ñÏíáÕ Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ|Ø³ëÝ³ÏÇ ËÙµ³·ñíáÕ Ñ³ÝÓÝ³ñ³ñ³·ñ»ñ")
  If p1.WaitVBObject("frmAsUstPar", 3000).Exists Then
    'Ä³Ù³Ý³Ï³Ñ³ïí³ÍÇ Éñ³óáõÙ
    Call Rekvizit_Fill("Dialog", 1, "General", "PERN", startDate)
    Call Rekvizit_Fill("Dialog", 1, "General", "PERK", endDate)
    'Î³ï³ñ»É Ïá×³ÏÇ ë»ÕÙáõÙ
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  Else
    Log.Error "Can't open frmAsUstPar window", "", pmNormal, ErrorColor
  End If
  If wMDIClient.WaitVBObject("frmPttel", 3000).Exists Then
    colN = wMDIClient.vbObject("frmPttel").GetColumnIndex("DOCNUM")
    If SearchInPttel("frmPttel", colN, docNum) Then
      is_exists = true
    End If
  Else
      Log.Error "Can't open frmPttel window", "", pmNormal, ErrorColor
  End If
  
  Check_Doc_In_Partial_Edit_Folder = is_exists
End Function

'Վճարման հանձնարարագիր (ստ.) փաստաթղթի Ընդհանուր էջի կլասս
Class PaymentOrderRecievedCommon
    Public isn
    Public div
    Public dep
    Public docN
    Public fDate
    Public accC
    Public reciever    
    Public accD
    Public payer
    Public sum
    Public cur
    Public aim
    Public repayDate
    Public tabN
    Public check
    
    Sub Class_Initialize
        isn = ""
        div = ""
        dep = ""
        docN = ""
        fDate = "  /  /    "
        accC = ""
        reciever = ""
        accD = ""
        payer = ""
        sum = "0.00"
        cur = ""
        aim = ""
        repayDate = "  /  /    "
        tabN = 1
        check = False   
    End Sub
End Class

Function New_PaymentOrderRecCommon()
    Set New_PaymentOrderRecCommon = new PaymentOrderRecievedCommon
End Function

'Վճարման հանձնարարագիր (ուղ.) փաստաթղթի Ընդհանուր էջի ստուգում
Sub Payment_Order_Rec_CommonTab_Check(PayOrdRecCom)
    Call GoTo_ChoosedTab(PayOrdRecCom.tabN)
    'Գրասենյակ դաշտի ստուգում
    Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",PayOrdRecCom.tabN,"Mask","ACSBRANCH"),PayOrdRecCom.div)
    'Բաժին դաշտի ստուգում
    Call Compare_Two_Values("Բաժին",Get_Rekvizit_Value("Document",PayOrdRecCom.tabN,"Mask","ACSDEPART"),PayOrdRecCom.dep)
    'Փաստաթղթի N դաշտի ստուգում
    Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",PayOrdRecCom.tabN,"General","DOCNUM"),PayOrdRecCom.docN)
    'Ամսաթիվ դաշտի ստուգում
    Call Compare_Two_Values("Ամսաթիվ",Get_Rekvizit_Value("Document",PayOrdRecCom.tabN,"General","DATE"),PayOrdRecCom.fDate)
    'Հաշիվ Կրեդիտ դաշտի ստուգում
    Call Compare_Two_Values("Հաշիվ կրեդիտ",Get_Rekvizit_Value("Document",PayOrdRecCom.tabN,"Bank","ACCCR"),PayOrdRecCom.accC)  
    'Ստացող դաշտի ստուգում
    Call Compare_Two_Values("Ստացող",Get_Rekvizit_Value("Document",PayOrdRecCom.tabN,"Comment","RECEIVER"),PayOrdRecCom.reciever)
    'Հաշիվ Դեբետ դաշտի ստուգում
    Call Compare_Two_Values("Հաշիվ Դեբետ",Get_Rekvizit_Value("Document",PayOrdRecCom.tabN,"Bank","ACCDB"),PayOrdRecCom.accD)
    'Վճարող դաշտի ստուգում
    Call Compare_Two_Values("Վճարող",Get_Rekvizit_Value("Document",PayOrdRecCom.tabN,"Comment","PAYER"),PayOrdRecCom.payer)
    'Գումար դաշտի ստուգում
    Call Compare_Two_Values("Գումար",Get_Rekvizit_Value("Document",PayOrdRecCom.tabN,"General","SUMMA"),PayOrdRecCom.sum)
    'Արժույթ դաշտի ստուգում
    Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",PayOrdRecCom.tabN,"Mask","CUR"),PayOrdRecCom.cur)
    'Նպատակ դաշտի ստուգում
    Call Compare_Two_Values("Նպատակ",Get_Rekvizit_Value("Document",PayOrdRecCom.tabN,"Comment","AIM"),PayOrdRecCom.aim)
    'Մարման ամսաթիվ դաշտի ստուգում
    Call Compare_Two_Values("Մարման ամսաթիվ",Get_Rekvizit_Value("Document",PayOrdRecCom.tabN,"General","QDATE"),PayOrdRecCom.repayDate)    
End Sub

'Վճարման հանձնարարագիր (ստ.) փաստաթղթի Լրացուցիչ էջի կլասս
Class PayOrderRecAdd
    Public docN
    Public pack
    Public transitAcc
    Public correspondentAcc
    Public recPaySys
    Public sentPaySys
    Public transferAim
    Public accType
    Public tabN
    Public check
    
    Private Sub Class_Initialize
        docN = ""
        pack = ""
        transitAcc = ""
        correspondentAcc = ""
        recPaySys = ""
        sentPaySys = ""
        transferAim = ""
        accType = ""
        tabN = 2
        check = False         
    End Sub
End Class

Function New_PayOrderRecAdd()
    Set New_PayOrderRecAdd = new PayOrderRecAdd
End Function

'Վճարման հանձնարարագիր (ստ.) փաստաթղթի Լրացուցիչ էջի ստուգում
Sub Payment_Order_Rec_AddTab_Check(PayOrderRecAdd)
    Call GoTo_ChoosedTab(PayOrderRecAdd.tabN)
    'Փաստաթղթի N(Էլեկտր.) դաշտի ստուգում
    Call Compare_Two_Values("Փաստաթղթի N(Էլեկտր.) ",Get_Rekvizit_Value("Document",PayOrderRecAdd.tabN,"General","BMDOCNUM"),PayOrderRecAdd.docN)
    'Փաթեթի համարը դաշտի ստուգում
    Call Compare_Two_Values("Փաթեթի համարը",Get_Rekvizit_Value("Document",PayOrderRecAdd.tabN,"General","PACK"),PayOrderRecAdd.pack)
    'Տարանցիկ հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Տարանցիկ հաշիվ",Get_Rekvizit_Value("Document",PayOrderRecAdd.tabN,"Mask","TCORRACC"),PayOrderRecAdd.transitAcc)
    'Թղթակցային հաշիվ դաշտի ստուգում
    Call Compare_Two_Values("Թղթակցային հաշիվ",Get_Rekvizit_Value("Document",PayOrderRecAdd.tabN,"Mask","CORRACC"),PayOrderRecAdd.correspondentAcc)
    'Ընդ. վճ. համակարգ դաշտի ստուգում
    Call Compare_Two_Values("Ընդ. վճ. համակարգ",Get_Rekvizit_Value("Document",PayOrderRecAdd.tabN,"Mask","PAYSYSIN"),PayOrderRecAdd.recPaySys)
    'Ուղ. վճ համակարգ դաշտի ստուգում
    Call Compare_Two_Values("Ուղ. վճ համակարգ",Get_Rekvizit_Value("Document",PayOrderRecAdd.tabN,"Mask","PAYSYSOUT"),PayOrderRecAdd.sentPaySys)
    'Փոխանցման նպատակ դաշտի ստուգում
    Call Compare_Two_Values("Փոխանցման նպատակ",Get_Rekvizit_Value("Document",PayOrderRecAdd.tabN,"Mask","PAYAIM"),PayOrderRecAdd.transferAim)
    'Հաշվի տիպ դաշտի ստուգում
    Call Compare_Two_Values("Հաշվի տիպ",Get_Rekvizit_Value("Document",PayOrderRecAdd.tabN,"Mask","ACCTYPE"),PayOrderRecAdd.accType)    
End Sub


'Վճարման հանձնարարագիր (ստ.) փաստաթղթի Այլ էջի կլասս
Class PayOrderRecOther
    Public comission
    Public includeCharge
    Public refuse
    Public rezidence
    Public payDate
    Public sendRecDate
    Public tabN
    Public check
    
    Private Sub Class_Initialize
        comission = "0.00"
        includeCharge = ""
        refuse = ""
        rezidence = ""
        payDate = "  /  /  "
        sendRecDate = "  /  /  "
        tabN = 3
        check = False         
    End Sub
End Class

Function New_PayOrderRecOther()
    Set New_PayOrderRecOther = new PayOrderRecOther
End Function

'Վճարման հանձնարարագիր (ստ.) փաստաթղթի Այլ էջի ստուգում
Sub Payment_Order_Rec_OtherTab_Check(PayOrderRecOther)
    Call GoTo_ChoosedTab(PayOrderRecOther.tabN)
    'Միջնորդավճար դաշտի ստուգում
    Call Compare_Two_Values("Միջնորդավճար",Get_Rekvizit_Value("Document",PayOrderRecOther.tabN,"General","COMISSION"),PayOrderRecOther.comission)
    'Ներառել գանձումը դաշտի ստուգում
    Call Compare_Two_Values("Ներառել գանձումը",Get_Rekvizit_Value("Document",PayOrderRecOther.tabN,"CheckBox","COMISSION"),PayOrderRecOther.includeCharge)
    'Մերժում դաշտի ստուգում
    Call Compare_Two_Values("Մերժում",Get_Rekvizit_Value("Document",PayOrderRecOther.tabN,"General","COMISSION"),PayOrderRecOther.refuse)
    'Ռեզիդենտություն դաշտի ստուգում
    Call Compare_Two_Values("Ռեզիդենտություն",Get_Rekvizit_Value("Document",PayOrderRecOther.tabN,"Mask","COMISSION"),PayOrderRecOther.rezidence)
    'Վճարման օր դաշտի ստուգում
    Call Compare_Two_Values("Վճարման օր",Get_Rekvizit_Value("Document",PayOrderRecOther.tabN,"General","COMISSION"),PayOrderRecOther.payDate)
    'Ամսաթիվ (Ուղարկման/Ստացման) դաշտի ստուգում
    Call Compare_Two_Values("Ամսաթիվ (Ուղարկման/Ստացման)",Get_Rekvizit_Value("Document",PayOrderRecOther.tabN,"General","COMISSION"),PayOrderRecOther.sendRecDate)
End Sub  

'Վճարման հանձնարարագիր (ստ.) փաստաթղթի Վճարողի/ստացողի լրացուցիչ տվյալներ էջի կլասս
Class PayOrderRecPRAddInfo
    Public pLegPos
    Public pPassNum
    Public pPasstype
    Public pTaxCode
    Public pRegNum
    Public pAddress
    Public pAuthPerson
    Public pAddInfo
    Public rLegPos
    Public rPassNum
    Public rPasstype
    Public rTaxCode
    Public rRegNum
    Public rAddress
    Public rAuthPerson
    Public rAddInfo
    Public tabN
    Public check  

    
    Private Sub Class_Initialize
        pLegPos = ""
        pPassNum = ""
        pPasstype = ""
        pTaxCode = ""
        pRegNum = ""
        pAddress = ""
        pAuthPerson = ""
        pAddInfo = ""
        rLegPos = ""
        rPassNum = ""
        rPasstype = ""
        rTaxCode = ""
        rRegNum = ""
        rAddress = ""
        rAuthPerson = ""
        rAddInfo = ""
        tabN = 4
        check = False         
    End Sub
End Class 

Function New_PayOrderRecPRAddInfo()
    Set New_PayOrderRecPRAddInfo = new PayOrderRecPRAddInfo
End Function

'Վճարման հանձնարարագիր (ստ.) փաստաթղթի Վճարողի/ստացողի լրացուցիչ տվյալներ էջի ստուգում
Sub Payment_Order_Rec_PRAddInfo_Check(PayOrderRecPRAddInfo)
    Call GoTo_ChoosedTab(PayOrderRecPRAddInfo.tabN)
    'Վճարող բլոկ
    'Իրավաբանական կարգավիճակ դաշտի ստուգում
    Call Compare_Two_Values("Իրավաբանական կարգավիճակ",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"Mask","PAYERJURSTAT"),PayOrderRecPRAddInfo.pLegPos)
    'Անձը հաստատող փաստ. դաշտի ստուգում
    Call Compare_Two_Values("Անձը հաստատող փաստ.",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"General","PASSNUM"),PayOrderRecPRAddInfo.pPassNum)
    'Անձը հաստատող փաստ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Անձը հաստատող փաստ. տիպ",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"Mask","PASSTYPE"),PayOrderRecPRAddInfo.pPasstype)
    'ՀՎՀՀ դաշտի ստուգում
    Call Compare_Two_Values("ՀՎՀՀ",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"Comment","TAXCOD"),PayOrderRecPRAddInfo.pTaxCode)
    'Սոց. քարտ դաշտի ստուգում
    Call Compare_Two_Values("Սոց. քարտ",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"General","REGNUM"),PayOrderRecPRAddInfo.pRegNum)
    'Հասցե դաշտի ստուգում
    Call Compare_Two_Values("Հասցե",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"General","ADDRESS"),PayOrderRecPRAddInfo.pAddress)
    'Լիազորված անձ դաշտի ստուգում
    Call Compare_Two_Values("Լիազորված անձ",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"General","PAYERMNG"),PayOrderRecPRAddInfo.pAuthPerson)
    'Լրացուցիչ ինֆորմացիա դաշտի ստուգում
    Call Compare_Two_Values("Լրացուցիչ ինֆորմացիա",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"General","PAYERINFO"),PayOrderRecPRAddInfo.pAddInfo)
    
    'Ստացող բլոկ
    'Իրավաբանական կարգավիճակ դաշտի ստուգում
    Call Compare_Two_Values("Իրավաբանական կարգավիճակ",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"Mask","JURSTATR"),PayOrderRecPRAddInfo.rLegPos)
    'ՀՎՀՀ դաշտի ստուգում
    Call Compare_Two_Values("ՀՎՀՀ",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"Comment","TAXCODER"),PayOrderRecPRAddInfo.rTaxCode)
    'Սոց. քարտ դաշտի ստուգում
    Call Compare_Two_Values("Սոց. քարտ",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"General","REGNUMR"),PayOrderRecPRAddInfo.rRegNum)
    'Անձը հաստատող փաստ. դաշտի ստուգում
    Call Compare_Two_Values("Անձը հաստատող փաստ.",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"General","PASSNUMR"),PayOrderRecPRAddInfo.rPassNum)
    'Անձը հաստատող փաստ. տիպ դաշտի ստուգում
    Call Compare_Two_Values("Անձը հաստատող փաստ. տիպ",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"Mask","PASSTYPER"),PayOrderRecPRAddInfo.rPasstype)
    'Հասցե դաշտի ստուգում
    Call Compare_Two_Values("Հասցե",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"General","RADDRESS"),PayOrderRecPRAddInfo.rAddress)
    'Լիազորված անձ դաշտի ստուգում
    Call Compare_Two_Values("Լիազորված անձ",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"General","RMNG"),PayOrderRecPRAddInfo.rAuthPerson)
    'Լրացուցիչ ինֆորմացիա դաշտի ստուգում
    Call Compare_Two_Values("Լրացուցիչ ինֆորմացիա",Get_Rekvizit_Value("Document",PayOrderRecPRAddInfo.tabN,"General","RINFO"),PayOrderRecPRAddInfo.rAddInfo)
End Sub

'Վճարման հանձնարարագիր (ստ.) փաստաթղթի Վճարման տվյալներ էջի կլասս
Class PaymentOrderRecPayData
    Public payCode
    Public reportCode
    Public report
    Public msgCode(6)
    Public msg(6)
    Public tabN
    Public check 
    Private Sub Class_Initialize
        Dim i
        payCode = ""
        reportCode = ""
        report = ""
        For i = 0 to 6
            msgCode(i) = ""
            msg(i) = ""
        Next    
        tabN = 5
        check = False
    End Sub
End Class

Function New_PaymentOrderRecPayData()
    Set New_PaymentOrderRecPayData = New PaymentOrderRecPayData
End Function

'Վճարման հանձնարարագիր (ստ.) փաստաթղթի Վճարման տվյալներ էջի ստուգում
Sub Payment_Order_Rec_PayData_Check(PayOrdRecPayData)
    Dim i
    Call GoTo_ChoosedTab(PayOrdRecPayData.tabN)
    'Հանձնարարագրի կոդ դաշտի ստուգում
    Call Compare_Two_Values("Հանձնարարագրի կոդ",Get_Rekvizit_Value("Document",PayOrdRecPayData.tabN,"Mask","PAYMENTCODE"),PayOrdRecPayData.payCode)
    'Հաշվետվողականության կոդ դաշտի ստուգում
    Call Compare_Two_Values("Հաշվետվողականության կոդ",Get_Rekvizit_Value("Document",PayOrdRecPayData.tabN,"Mask","REPORTCODE"),PayOrdRecPayData.reportCode)
    'Հաշվետվողականության կոդ 2 դաշտի ստուգում
    Call Compare_Two_Values("Հաշվետվողականության կոդ 2",Get_Rekvizit_Value("Document",PayOrdRecPayData.tabN,"Comment","REPORT"),PayOrdRecPayData.report)
    'Հաղորդագրություններ դաշտերի ստուգում
    For i = 1 to 6
        Call Compare_Two_Values("Հաղորդագրության կոդ "&i ,Get_Rekvizit_Value("Document",PayOrdRecPayData.tabN,"Mask","MSGCODE"&i),PayOrdRecPayData.msgCode(i))
        Call Compare_Two_Values("Հաղորդագրություն "&i ,Get_Rekvizit_Value("Document",PayOrdRecPayData.tabN,"Comment","MESSAGE"&i),PayOrdRecPayData.msg(i))
    Next
End Sub  

Class PaymentOrderRecieved 
    Public commonTab
    Public addTab
    Public otherTab
    Public PRAddInfoTab
    Public payDataTab
    Public attachTab
    Private Sub Class_Initialize
        Set commonTab = New_PaymentOrderRecCommon()
        Set addTab = New_PayOrderRecAdd()
        Set otherTab = New_PayOrderRecOther()
        Set PRAddInfoTab = New_PayOrderRecPRAddInfo()
        Set payDataTab = New_PaymentOrderRecPayData()
        Set attachTab = New_Attached_Tab(fCount, lCount, dCount)
        attachTab.tabN = 6
    End Sub
End Class

Function New_PaymentOrderRecieved(fCount ,lCount , dCount)
    Set New_PaymentOrderRecieved = New PaymentOrderRecieved
End Function

'Վճարման հանձնարարագիր (ստ.) փաստաթղթի ստուգում
Sub Payment_Order_Recieved_Check(PayOrdRec)
    'Փաստաթղթի isn-ի ստացում
    PayOrdRec.commonTab.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Ընդհանուր
    If PayOrdRec.commonTab.check Then
        Call Payment_Order_Rec_CommonTab_Check(PayOrdRec.commonTab)
    End If
    'Լրացուցիչ
    If PayOrdRec.addTab.check Then
        Call Payment_Order_Rec_AddTab_Check(PayOrdRec.addTab)
    End If
    'Այլ 
    If PayOrdRec.otherTab.check Then
        Call Payment_Order_Rec_OtherTab_Check(PayOrdRec.otherTab)
    End If    
    'Վճարողի/ստացողի լրացուցիչ տվյալներ
    If PayOrdRec.PRAddInfoTab.check Then
        Call Payment_Order_Rec_PRAddInfo_Check(PayOrdRec.PRAddInfoTab)
    End If 
    'Վճարման տվյալներ
    If PayOrdRec.payDataTab.check Then
        Call Payment_Order_Rec_PayData_Check(PayOrdRec.payDataTab)
    End If
    'Կցված
    Call Attach_Tab_Check(PayOrdRec.attachTab)     
End Sub 
 