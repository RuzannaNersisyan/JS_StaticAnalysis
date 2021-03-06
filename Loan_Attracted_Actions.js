Option Explicit

'USEUNIT Library_Common  
'USEUNIT Loan_Agreements_Library 
'USEUNIT Akreditiv_Library
'USEUNIT Credit_Line_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Loan_Agreements_With_Schedule_Linear_Library
'USEUNIT Group_Operations_Library
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Constants
'USEUNIT Mortgage_Library

'Test Case ID 165728
'Test Case ID 165729
'Test Case ID 165731
'Test Case ID 165732

Sub Loan_Attracted_Actions(DocumentType)
  Dim fDATE, sDATE, attr
  Dim Loan, FolderName, opDate, calcDate, exTerm, MainSum, PerSum, Prc, NonUsedPrc,_
      EffRete, ActRete
  Dim my_vbObj, wTabStrip, Acc
'--------------------------------------
  Set attr = Log.CreateNewAttributes
  attr.BackColor = RGB(0, 255, 255)
  attr.Bold = True
  attr.Italic = True
'--------------------------------------  

  ''1.Համակարգ մուտք գործել ARMSOFT օգտագործողով
  fDATE = "20260101"
  sDATE = "20140101"
  Call Initialize_AsBank("bank", sDATE, fDATE)
  Login("ARMSOFT")
  
  ''2.Մուտք գործել "Ենթահամակրգեր(ՀԾ)"
  Call ChangeWorkspace(c_Subsystems)  

''3.Վարկային գիծ պայմանագրի ստեղծում
  FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|Ü»ñ·ñ³íí³Í í³ñÏ»ñ|"
  Set Loan = New_LoanDocument()
  With Loan
    .CalcAcc = "00000113032"                                    
    .Limit = 100000
    .Date = "221018" 
    .GiveDate = "221018"
    .Term = "221019"
    .FirstDate = "221018"
    .PaperCode = 555
    
    Select Case DocumentType
        Case 1
          .DocType = "ì³ñÏ³ÛÇÝ ·ÇÍ"
        Case 2
          .DocType = "ØÇ³Ý·³ÙÛ³ í³ñÏ"
        Case 3
          .DocType = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ" 
        Case 4
          .DocType = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ (·Í³ÛÇÝ)"  
          .SumsDateFillType = 2 & "[Tab]"
    End Select
    
    Call .CreateAttrLoan(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
  
    Log.Message(.DocNum)

    Call Close_Pttel("frmPttel")
  
    'Պայմանագրին ուղղարկել հաստատման
    .SendToVerify(FolderName & "²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Հաստատել
    .Verify(FolderName & "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
  
    Call LetterOfCredit_Filter_Fill(FolderName, .DocLevel, .DocNum)
  
    Call Log.Message("Գանձում ներգրավումից",,,attr)
    Call ChargeForAttraction("", .Date, 100, "", "")
  
    Call Log.Message("Վարկի ներգրավում",,,attr)
    If Left(.DocType, 8) = "¶ñ³ýÇÏáí" or .DocType = "ì³ñÏ³ÛÇÝ ·ÇÍ" Then
      Call Attraction(c_LoanAttraction, .Date, .Limit, "", "")
    Else
      Call Attraction(c_LoanAttraction, .Date, 80000, "", "")
    End If
    
    Call Log.Message("Տոկոսների հաշվարկ",,,attr)
    calcDate = "211118"
    Call Calculate_Percents(calcDate, calcDate, False)
    
    opDate = "221118"
    If .DocType = "ì³ñÏ³ÛÇÝ ·ÇÍ" Then
      Call Log.Message("Սահմանաչափի փոփոխում",,,attr)
      Call Change_Limit(calcDate , 200000)
    
      Call Log.Message("Տոկոսների կապիտալացում",,,attr)
      Call Percent_Capitalization(Null , opDate, "")
    End If
    
    exTerm = "221020"
    If .DocType = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ" Then
      Call Log.Message("Գրաֆիկի վերանայում",,,attr)
      Call Fading_Schedule_Fill(opDate, exTerm, .Limit)
    ElseIf .DocType <> "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ (·Í³ÛÇÝ)" Then
      Call Log.Message("Ժամկետների վերանայում",,,attr)
      Call Deposit_Extension(opDate, exTerm, "", .Paragraph, .Direction, c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms)
    End If
        
    Call Log.Message("Պարտքերի մարում",,,attr)
    MainSum = 10000
    Call Fade_Debt(opDate, Null, "", MainSum, PerSum, False)
    
    Call Log.Message("Տոկոսադրույքներ",,,attr)
    Prc = 15
    NonUsedPrc = 10
    Call ChangeRete(opDate, Prc, NonUsedPrc)
    
    Call Log.Message("Արդյունավետ տոկոսադրույք",,,attr)
    Call ChangeEffRete(opDate, EffRete, ActRete)
    
    If .DocType = "ØÇ³Ý·³ÙÛ³ í³ñÏ" or .DocType = "¶ñ³ýÇÏáí í³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ" Then
      Call Log.Message("Բանկի արդյունավետ տոկոսադրույք",,,attr)
      Call BankEffective_InterestRate_DocFill(opDate, "")
    ElseIf .DocType = "ì³ñÏ³ÛÇÝ ·ÇÍ" Then
      Call Log.Message("Գծայնության դադարեցում",,,attr)
      Call Credit_Line_Stop_Recovery_DocFill(opDate, 1)
    End If  
    
    calcDate = "221118" 
    Call Log.Message("Տոկոսների հաշվարկ",,,attr)
    Call Calculate_Percents(calcDate, calcDate, False)

    If .DocType = "ì³ñÏ³ÛÇÝ ·ÇÍ" Then
     Call wMainForm.MainMenu.Click(c_AllActions)
     Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder)
     
     Set my_vbObj = wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView")
     With my_vbObj  
       .MoveFirst
       Do While (Not .EOF)
        If Left(.Columns.Item(0).Text, 38) = "Ü»ñ·ñ³íí³Í í³ñÏÇ Ñ³ßí³å³Ñ³Ï³Ý Ñ³í»Éí³Í" then 
          .Keys("[Enter]")
          Exit Do   
        Else
          Call .MoveNext
        End If
       Loop 
      End With

     'Վերցնում է Հաշիվ դաշտի արժեքը
     Acc = Get_Rekvizit_Value("Document",2,"Mask","ACCPERCNT")
     
     BuiltIn.Delay(1000)
     Call Close_Pttel("frmASDocForm")
     BuiltIn.Delay(1000)
     Call Close_Pttel("frmPttel_2")
     Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|²ÛÉ|î»Õ»Ï³ïáõÝ»ñ|Ð³ßÇíÝ»ñ")
     BuiltIn.Delay(1000)
     Call Rekvizit_Fill("Dialog", 1, "General", "ACCMASK", Acc)
     Call ClickCmdButton(2, "Î³ï³ñ»É") 
     BuiltIn.Delay(2000)
     'Փոխել սոտորին սահմանը
     Call wMainForm.MainMenu.Click(c_AllActions)
     Call wMainForm.PopupMenu.Click(c_ChangeLowerBound)
     Call Rekvizit_Fill("Document", 1, "General", "CHGDATE", "221118")
     Call Rekvizit_Fill("Document", 1, "General", "LLIMIT", "-999999999")
     Call ClickCmdButton(1, "Î³ï³ñ»É") 
     BuiltIn.Delay(2000)
     Call Close_Pttel("frmPttel_2")
     wMDIClient.VBObject("frmPttel").SetFocus
    End If
    
    opDate = "231118"
    Call Log.Message("Պարտքերի մարում",,,attr)
    Call Fade_Debt(opDate, Null, "221020", "", "", False)
  
'    If .DocType = "ì³ñÏ³ÛÇÝ ·ÇÍ" Then
'      Call Log.Message("Կանխավ վճարված տոկոսների վերադարձ",,,attr)
'      Call ReturnPrepaidRates(opDate, 0.4)
'    End If
    
    Call Log.Message("Պայմանագրի փակում",,,attr)
    BuiltIn.Delay(2000)
    .CloseDate = opDate
    .CloseAgr()
  
    Call Log.Message("Պայմանագրի բացում",,,attr)

    .OpenAgr()
    BuiltIn.Delay(1000) 
    Call Close_Pttel("frmPttel") 

    Call Log.Message("Բոլոր փաստաթղթերի ջնջում",,,attr)
    
    Call DeleteAllActions("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|Ü»ñ·ñ³íí³Í ÙÇçáóÝ»ñ|Ü»ñ·ñ³íí³Í í³ñÏ»ñ",.DocNum,"010118","010121")
  
  End With 
  
  Call Close_AsBank()     
End Sub