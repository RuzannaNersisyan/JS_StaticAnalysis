Option Explicit
'USEUNIT Library_Common  
'USEUNIT Akreditiv_Library
'USEUNIT Loan_Agreements_Library 
'USEUNIT Credit_Line_Library
'USEUNIT Deposit_Contract_Library
'USEUNIT Loan_Agreements_With_Schedule_Linear_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Group_Operations_Library
'USEUNIT Constants
'USEUNIT Mortgage_Library

'Test Case Id 165735
'Test Case Id 165737
'Test Case Id 165739

Sub Placed_Overdraft_Actions_Test(DocumentType)
  Dim fDATE, sDATE, attr
  Dim Store_ISN,WriteOut_ISN
  Dim Overdraft, FolderName, opDate, Sum, opPerSum, calcDate, exTerm
  Dim MainSum, PerSum, Prc,NonUsedPrc, EffRete, ActRete
  
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
  
   ''3.Օվերդրաֆտ պայմանագրի ստեղծում
  FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|"
  Set Overdraft = New_Overdraft()
  With Overdraft
    .CalcAcc = "00000113032"                                    
    .Limit = 100000
    .Date = "221018" 
    .GiveDate = "221018"
    .Term = "221019"
    .PaperCode = 555
    
    Select Case DocumentType
        Case 1
          .DocType = "úí»ñ¹ñ³ýï"
        Case 2
          .DocType = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ" 
        Case 3
          .DocType = "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ (³ñïáÝÛ³É Å³ÙÏ»ïáí)"  
          .PayDates = 15 
          .GraceDays = 5 
          .GraceDatesDir = 2
        Case 4
          .DocType = "²ñïáÝÛ³É.Å³ÙÏ.ûí»ñ¹ñ³ýï" 
          .GraceDays = 5 
    End Select
    
    Call .CreatePlOverdraft(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")
  
    Log.Message(.DocNum)

    BuiltIn.delay(2000)
    Call Close_Pttel("frmPttel")
    
    'Պայմանագրին ուղղարկել հաստատման
    .SendToVerify(FolderName & "²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ")
    'Հաստատել
    .Verify(FolderName & "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
  
    .OpenInFolder(FolderName)
    
    Call Log.Message("Օվերդրաֆտի տրամադրում",,,attr)
    Call Give_Overdradt(.GiveDate, 80000, 2, Null, .CalcAcc, Null)
    
    BuiltIn.delay(2000)
    Call Close_Pttel("frmPttel")
    
    Call ChangeWorkspace(c_Overdraft) 
    
    Select Case .DocType  
        Case "úí»ñ¹ñ³ýï"
          opDate = "211118"
          Call Log.Message("Տոկոսների հաշվարկ ",,,attr) 
          Call Overdraft_Percent_Calculation(Null, .DocNum, opDate, Null)
        Case "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ (³ñïáÝÛ³É Å³ÙÏ»ïáí)"
          opDate = "141118"
          While opDate <> "201118"
            Call Log.Message("Տոկոսների հաշվարկ " & opDate & " ամսաթվով",,,attr) 
            Call Overdraft_Percent_Calculation(Null, .DocNum, opDate, Null)
            BuiltIn.delay(2000)
            Call Close_Pttel("frmPttel")
            opDate = CStr(CInt(Left(opDate, 2)) + 1) & Right(opDate, 4)
          Wend  
          .OpenInFolder("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|")
         Case "²ñïáÝÛ³É.Å³ÙÏ.ûí»ñ¹ñ³ýï" 
           .OpenInFolder("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|")  
           
           opDate = "211118"
           Call Log.Message("Հիմնական գործողության կատարում",,,attr) 
           Call MainOperation(opDate, 1000)
    End Select
    
    If .DocType <> "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ (³ñïáÝÛ³É Å³ÙÏ»ïáí)" Then
      opDate = CStr(CInt(Left(opDate, 2)) + 1) & Right(opDate, 4)
    End If  
    Call Log.Message("Սահմանաչափի փոփոխում",,,attr)
    Call Change_Limit(opDate , 200000)
    
    Call Log.Message("Տոկոսների կապիտալացում",,,attr)
    Call Percent_Capitalization(Null , opDate, "")
    
    exTerm = "221020"
    If Left(.DocType, 8) = "¶ñ³ýÇÏáí" Then
      Call Log.Message("Գրաֆիկի վերանայում",,,attr)
      Call Fading_Schedule_Fill(opDate, exTerm, 80245.60)
    ElseIf .DocType = "úí»ñ¹ñ³ýï" Then  
      Call Log.Message("Ժամկետների վերանայում",,,attr)
      Call Deposit_Extension(opDate, exTerm, "", .Paragraph, .Direction, c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms)
    End If
    
    
    Prc = 15
    If .DocType <> "²ñïáÝÛ³É.Å³ÙÏ.ûí»ñ¹ñ³ýï" Then
      NonUsedPrc = 10
    End If  
    Call Log.Message("Տոկոսադրույքներ",,,attr)
    Call ChangeRete(opDate, Prc, NonUsedPrc)
    
    Call Log.Message("Արդյունավետ տոկոսադրույք",,,attr)
    Call ChangeEffRete(opDate, EffRete, ActRete)

    Call Log.Message("Գծայնության դադարեցում",,,attr)
    Call Credit_Line_Stop_Recovery_DocFill(opDate, 1)
    
    calcDate = "221118" 
    If .DocType <> "²ñïáÝÛ³É.Å³ÙÏ.ûí»ñ¹ñ³ýï" Then
      Call Log.Message("Տոկոսների հաշվարկ",,,attr)
      Call Calculate_Percents(opDate, opDate, False)
    Else 
      Call Log.Message("Հիմնական գործողության կատարում",,,attr) 
      Call MainOperation(opDate, 1000)
    End IF   
    
    Call Log.Message("Օբյեկտիվ ռիսկի դասիչ",,,attr)
    Call ObjectiveRisk(opDate, "04")
    
    Call Log.Message("Ռիսկի դասիչ և պահուստավորման տոկոս",,,attr)
    Call FillDoc_Risk_Classifier(opDate, "05", 100)
    
    Call Log.Message("Պահուստավորում",,,attr)
    Call FillDoc_Store(opDate, Store_ISN)

    Call Log.Message("Դուրս գրում",,,attr)
    Call FillDoc_WriteOut(opDate, WriteOut_ISN)
    
    Select Case .DocType  
        Case "úí»ñ¹ñ³ýï", "²ñïáÝÛ³É.Å³ÙÏ.ûí»ñ¹ñ³ýï"
          opDate = "231118"
        Case "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ (³ñïáÝÛ³É Å³ÙÏ»ïáí)"
          opDate = "211118"
    End Select  
    Call Log.Message("Դուրս գրածի վերականգնում",,,attr)
    Call WriteOffReconstruction(opDate, "", "")
    BuiltIn.delay(2000)
    Call Close_Pttel("frmPttel")
    
    Call Log.Message("Պարտքերի մարում",,,attr)
    Select Case .DocType  
        Case "úí»ñ¹ñ³ýï"
          Call Overdraft_Repayment_Operation(.DocNum, opDate, 80951.20, 33.30, Null)
        Case "¶ñ³ýÇÏáí ûí»ñ¹ñ³ýïÇ å³ÛÙ³Ý³·Çñ (³ñïáÝÛ³É Å³ÙÏ»ïáí)"
          Call Overdraft_Repayment_Operation(.DocNum, opDate,  80245.60, 795.70, 8.80)
        Case "²ñïáÝÛ³É.Å³ÙÏ.ûí»ñ¹ñ³ýï"
          Call Overdraft_Repayment_Operation(.DocNum, opDate, 81000, 1000, Null)
    End Select 
    
    Call Log.Message("Պայմանագրի փակում",,,attr)
    .CloseDate = opDate
    .CloseAgr()
  End With   
  
    Call Log.Message("Պայմանագրի բացում",,,attr)
    Overdraft.OpenAgr()
    BuiltIn.Delay(1000) 
    Call Close_Pttel("frmPttel") 

    Call Log.Message("Բոլոր փաստաթղթերի ջնջում",,,attr)
    
    Call DeleteAllActions("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|Üáñ ÷³ëï³Ã., ÃÕÃ³å³Ý³ÏÝ»ñ, Ñ³ßí»ïíáõÃÛáõÝÝ»ñ",Overdraft.DocNum,"010118","010121")
  
    Call Close_AsBank()  
End Sub