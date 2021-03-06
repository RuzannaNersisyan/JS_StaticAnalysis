Option Explicit

'USEUNIT Library_Common
'USEUNIT Securities_Library
'USEUNIT Akreditiv_Library
'USEUNIT Loan_Agreements_Library 
'USEUNIT Group_Operations_Library
'USEUNIT Constants

'Test Case Id 165768
'Test Case Id 165770
'Test Case Id 165771
'Test Case Id 165772
'Test Case Id 165773
'Test Case Id 165774
'Test Case Id 165775
'Test Case Id 165778

Sub Securities_Actions_Test(DocumentType)
  Dim fDATE, sDATE, FolderName, my_vbObj, attr
  Dim opDate, exTerm, MainSum, PerSum, Prc, NonUsedPrc, EffRete, ActRete, Security,_
      Sum, SecType, Acc
      
  ''Համակարգ մուտք գործել ARMSOFT օգտագործողով
  fDATE = "20260101"
  sDATE = "20140101"
  Call Initialize_AsBank("bank", sDATE, fDATE)
  Login("ARMSOFT")
  
'--------------------------------------
  Set attr = Log.CreateNewAttributes
  attr.BackColor = RGB(0, 255, 255)
  attr.Bold = True
  attr.Italic = True
'--------------------------------------  
  Call ChangeWorkspace(c_Subsystems)
  
  'Արժեթղթի ստեղծում
  Set Security = New_SecurityDoc()
  With Security
    .Nominal = 100000
    .PublishDate = "221018" 
    .PrevRepDate = "221018"
    .BuyDate = "221018"
    .Term = "221019"
    
    Select Case DocumentType
        Case 1
          .DocType = "îáÏáë³ÛÇÝ »Ï.µ»ñáÕ ³ñÅ»ÃáõÕÃ"
          FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ ØØÄä|"
        Case 2
          .DocType = "îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ"
          FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ ØØÄä|"
        Case 3
          .DocType = "îáÏáë³ÛÇÝ »Ï.µ»ñáÕ ³ñÅ»ÃáõÕÃ"
          FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ í»ñ³í³×³éùÇ|"
        Case 4
          .DocType = "îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ ³ñÅ»ÃáõÕÃ"
          FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ í»ñ³í³×³éùÇ|" 
        Case 5
          .DocType = "îáÏáë³ÛÇÝ »Ï.µ»ñáÕ ³ñÅ»ÃáõÕÃ"
          FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ í³×³éùÇ|" 
        Case 6
          .DocType = "îáÏáë³ÛÇÝ »Ï. ãµ»ñáÕ ³ñÅ»ÃáõÕÃ"
          FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ í³×³éùÇ|" 
        Case 7
          .IsClient = 0
          .SecType = 4
          .CalcAcc = "00000113032"
          .RepayType = 1
          .FirstDate = "221018"
          .DiscMethod = 2
          .Name = "EkBerox"
          .DocType = "îáÏáë³ÛÇÝ »Ï.µ»ñáÕ áã å»ï.³ñÅ»ÃáõÕÃ"
          FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|àã å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñ|"  
        Case 8
          .IsClient = 0
          .SecType = 4
          .CalcAcc = "00000113032"
          .RepayType = 1
          .FirstDate = "221018"
          .DiscMethod = 2
          .Name = "EkChberox" 
          .DocType = "îáÏáë³ÛÇÝ »Ï.ãµ»ñáÕ áã å»ï.³ñÅ»ÃáõÕÃ"
          FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|àã å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñ|"  
    End Select
  
    If DocumentType < 7 Then
      Call .CreateSecurity(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
    Else 
      Call .CreateNonGovSecurity(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")  
    End If  
  
    Log.Message(.DocNum)
    
    If .DocType = "îáÏáë³ÛÇÝ »Ï.µ»ñáÕ áã å»ï.³ñÅ»ÃáõÕÃ" Then
      'Մարման գրաֆիկի նշանակում
      BuiltIn.Delay(3000)
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_RepaySchedule)
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      wMDIClient.VBObject("frmPttel").VBObject("tdbgView").MovePrevious
    End If
    
    'Ուղարկել հաստատման
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_SendToVer)
    Call ClickCmdButton(5, "²Ûá")
    
    BuiltIn.Delay(3000)
    wMDIClient.VBObject("frmPttel").Close
    
    'Հաստատել պայմանագիրը
    .Verify(FolderName & "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I") 
    
    Call LetterOfCredit_Filter_Fill(FolderName, 1, .DocNum)
    
    Select Case DocumentType
        Case 1, 2
          Call Log.Message("Արժեթղթի առք",,,attr)
          SecType = "î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ ØØÄä"
          Call SecBuy(.PublishDate, SecType)
        Case 3, 4
          Call Log.Message("Վերավաճառքի համար արժեթղթի առք",,,attr)
          SecType = "î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ í»ñ³í³×³éùÇ"
          Call SecBuy(.PublishDate, SecType)
        Case 5, 6
          Call Log.Message("Վաճառքի համար արժեթղթի առք",,,attr)
          SecType = "î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ í³×³éùÇ"
          Call SecBuy(.PublishDate, SecType)
        Case 7, 8   
          Call Log.Message("Ոչ պետական արժեթղթի առք",,,attr)
          SecType = "î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|àã å»ï³Ï³Ý ³ñÅ»ÃÕÃ»ñ"
          Call SecBuy(.PublishDate, SecType)
    End Select
    
    opDate = "211118"
    If DocumentType <> 4 Then
      Call Log.Message("Տոկոսների հաշվարկ",,,attr)
      Call Calculate_Percents(opDate, opDate, False)
    End If
        
    Call Log.Message("Հաճախորդների արժեթղթերի առուծախ",,,attr)
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Opers & "|" & c_GiveAndBack & "|" & c_CliSecTrade)
    Call Rekvizit_Fill("Document", 1, "General", "DATE", opDate) 
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmPttel_2").Close
    
    If .DocType = "îáÏáë³ÛÇÝ »Ï.µ»ñáÕ áã å»ï.³ñÅ»ÃáõÕÃ" Then
      'Հաշվապահական հավելվածից վերցնել Տոկոսների վճարման հաշիվը և փոխել ստորին սահմանը
      BuiltIn.Delay(2000)
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
     
     Set my_vbObj = wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView")
     With my_vbObj  
       .MoveFirst
       Do While (Not .EOF)
        If Right(Left(.Columns.Item(0).Text, 41), 21) = "Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³Í" then 
          .Keys("[Enter]")
          Exit Do   
        Else
          Call .MoveNext
        End If
       Loop 
      End With

     BuiltIn.Delay(2000)
     Acc = Get_Rekvizit_Value("Document",1,"Mask","ACCACCPR")
'     wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("AsTypeFolder_4").VBObject("TDBMask").Text
     BuiltIn.Delay(2000)
     wMDIClient.VBObject("frmASDocForm").Close
     wMDIClient.VBObject("frmPttel_2").Close
     Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|²ÛÉ|î»Õ»Ï³ïáõÝ»ñ|Ð³ßÇíÝ»ñ")
     Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", Acc)
     Call ClickCmdButton(2, "Î³ï³ñ»É") 
     'Փոխել սոտորին սահմանը
     BuiltIn.Delay(2000)
     Call wMainForm.MainMenu.Click(c_AllActions)
     Call wMainForm.PopupMenu.Click(c_ChangeLowerBound)
     Call Rekvizit_Fill("Document", 1, "General", "CHGDATE", "221118")
     Call Rekvizit_Fill("Document", 1, "General", "LLIMIT", "-999999999")
     Call ClickCmdButton(1, "Î³ï³ñ»É") 
     BuiltIn.Delay(2000)
     wMDIClient.VBObject("frmPttel_2").Close
     wMDIClient.VBObject("frmPttel").SetFocus
    End If
    
    opDate = "221118"
    If DocumentType = 1 or DocumentType = 3 or DocumentType = 5 or DocumentType = 7 Then
      Call Log.Message("Պարտքերի մարում",,,attr)
      Call SecRepay(opDate)
    End If
    
    Call Log.Message("Արժեթղթի վաճառք",,,attr)
    Call SecSell(opDate, "", 2, 1)
    
    'Ջնջել "Հաճախորդների արժեթղթերի առուծախ" փաստաթուղթը
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").MoveNext
    Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
    BuiltIn.Delay(1000)
    Call ClickCmdButton(3, "²Ûá")
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmPttel_2").Close
    
    Call Log.Message("Պայմանագրի փակում",,,attr)
    .CloseDate = opDate
    .CloseAgr()
    
    .OpenAgr()
    BuiltIn.Delay(2000)
    wMDIClient.VBObject("frmPttel").Close
  
    Call Log.Message("Բոլոր փաստաթղթերի ջնջում",,,attr)
    'Ջնջել բոլոր գործողությունները
    Call GroupDelete(FolderName, 1, .DocNum, "^A[Del]", "^A[Del]", "^A[Del]")
    
    'Ջնջել գլխավոր պայմանագիրը
    Call LetterOfCredit_Filter_Fill(FolderName, 1, .DocNum)
    
    Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
    BuiltIn.Delay(1000)
    If p1.WaitVBObject("frmAsMsgBox",1000).Exists Then 
        Call ClickCmdButton(5, "Î³ï³ñ»É")
        BuiltIn.Delay(1000)
    End If
    Call ClickCmdButton(3, "²Ûá")

  End With
  Call Close_AsBank() 
End Sub
