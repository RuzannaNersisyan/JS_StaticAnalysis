Option Explicit

'USEUNIT Library_Common  
'USEUNIT Akreditiv_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Loan_Agreements_Library 
'USEUNIT Deposit_Contract_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Overdraft_NewCases_Library
'USEUNIT Constants
'USEUNIT Group_Operations_Library
'USEUNIT Mortgage_Library

'Test Case ID 165763

Sub Akreditiv_Actions_Test()
  Dim fDATE, sDATE, attr, frmAsMsgBox, FrmSpr
  Dim fBASE, DocNum, clientCode, curr, accacc, summ, restore, dategive,_
      date_arg, agrIntRate, agrIntRatePart, sector,aim, schedule, country,_
      guarante, district,region, paperCode  
  Dim FolderName, docType, calcDate
  Dim opDate, Sum, ReqFDate, OblFDate, OblPer, Baj, Bank, Acc, exTerm, Paragraph, Direction
  Dim Prc, NonUsedPrc, EffRete, ActRete, NonUsedSum
  
'--------------------------------------
  Set attr = Log.CreateNewAttributes
  attr.BackColor = RGB(0, 255, 255)
  attr.Bold = True
  attr.Italic = True
'-------------------------------------- 

  ''1, Համակարգ մուտք գործել ARMSOFT օգտագործողով
  fDATE = "20260101"
  sDATE = "20140101"
  Call Initialize_AsBank("bank", sDATE, fDATE)
  Login("ARMSOFT")

  FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²Ïñ»¹ÇïÇí|"
  
  ''2.Մուտք գործել "Ենթահամակրգեր(ՀԾ)"
  Call ChangeWorkspace(c_Subsystems) 
  ''3, Ակրեդիտիվի գլխավոր պայմանագրի ստեղծում
  Call wTreeView.DblClickItem(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")

  clientCode = "00034851"
  curr = "000"
  accacc = "30220042300"
  summ = "1000000"
  restore = True
  dategive = "110515"
  date_arg = "110516"
  agrIntRate = "18"
  agrIntRatePart = "365"
  sector = "U2"
  aim = "00"
  schedule = "9"
  guarante = "9"
  district = "001"
  paperCode = "123"
  country = "AM"
  region = "010000008"
  
  Call Letter_Of_Credit_Doc_Fill(fBASE, DocNum, clientCode, curr, accacc, summ,_
                                   restore, dategive, date_arg, agrIntRate, agrIntRatePart, _
                                   sector,aim, schedule,country, guarante, district,region, paperCode) 
 
   ''4.Պայմանագրը ուղարկել հաստատման                             
  Call PaySys_Send_To_Verify()
  BuiltIn.Delay(3000)  
  Call Close_Pttel("frmPttel")
  
  ''5.Մուտք գործել հաստատվող փաստաթղթեր 1 թղթապանակ - Պայմանագիրը առկա լինի
  Call wTreeView.DblClickItem(FolderName & "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
  'Լրացնել "Պայմանագարի համար"   
  Call Rekvizit_Fill("Dialog",1,"General","NUM",DocNum)
  'Սեղմել "Կատարել" կոճակը
  Call ClickCmdButton(2, "Î³ï³ñ»É") 
  'Հաստատել Հաստատող փաստաթղթեր 1- ում
  Call PaySys_Verify(True)
  BuiltIn.Delay(3000)  
  Call Close_Pttel("frmPttel")
  
  
  docType = 2
  Call LetterOfCredit_Filter_Fill(FolderName, docType, DocNum)
  
   ''6. Վարկային գծի դադարեցում/ վերականգնում փաստաթղթի լրացում
  'Կանգնենք մեր պայմանագրի վրա
  opDate = "110515"
  Call Credit_Termination_Restoration("|" & c_LineRestoration, opDate, 2)

  ''7. Ակցեպտավորում փաստաթղթի ստեղծում
  opDate = "110515"
  Sum = "500000"
  ReqFDate = "110516"
  OblFDate = "110516"
  OblPer = "18"
  Baj = "365"
  Bank = "00000001"
  Call Create_Acceptance(opDate, Sum, ReqFDate, OblFDate, OblPer, Baj, Bank, Acc)
  BuiltIn.Delay(3000)  
  Call Close_Pttel("frmPttel")
  
  'Բացել Ակցեպտավորման պայմանագիրը "Պայմանագրեր" թղթապանակում
  docType = 1
  Call LetterOfCredit_Filter_Fill(FolderName, docType, DocNum)

  Call Log.Message("Տոկոսների հաշվարկ",,,attr)
  opDate = "100516"
  Call Calculate_Percents(opDate, opDate, False)
  
  Call Log.Message("Ժամկետների վերանայում",,,attr)
  opDate = "110516"
  exTerm = "110517"
  Paragraph = 1
  Direction = 2
  Call Deposit_Extension(opDate, exTerm, "", Paragraph, Direction, c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms)

  'Կատարել տոկոսների հաշվարկ մայր պայմանգրի վրա` "100516" ամսաթվով  
  BuiltIn.Delay(3000)  
  Call Close_Pttel("frmPttel")
  docType = 2
  Call LetterOfCredit_Filter_Fill(FolderName, docType, DocNum)

  Call Log.Message("Տոկոսների հաշվարկ",,,attr)
  calcDate = "100516"
  Call Calculate_Percents(calcDate, calcDate, False)
  
  'Բացել Ակցեպտավորման պայմանագրը "Պայմանագրեր" թղթապանակում
  BuiltIn.Delay(3000)  
  Call Close_Pttel("frmPttel")
  docType = 1
  Call LetterOfCredit_Filter_Fill(FolderName, docType, DocNum)

  Call Log.Message("Պարտքերի մարում",,,attr)
  Call Debt_Repayment(Null, opDate, "", "", 2, accacc, DocNum, 2)
  
  Call Log.Message("Տոկոսադրույքներ",,,attr)
  Prc = 15
  NonUsedPrc = 10
  Call ChangeRete(opDate, Prc, NonUsedPrc)
  
  Call Log.Message("Բանկի արդյունավետ տոկոսադրույք",,,attr)
  Call BankEffective_InterestRate_DocFill(opDate, "")
  
  Call Log.Message("Ռիսկի դասիչ և պահուստավորման տոկոս",,,attr)
  Call FillDoc_Risk_Classifier(opDate, "05", 100)
  
  Call Log.Message("Օբյեկտիվ ռիսկի դասիչ",,,attr)
  Call ObjectiveRisk(opDate, "04")

  Call Log.Message("Պահուստավորում",,,attr)
  Call FillDoc_Store(opDate, Null)
    
  Call Log.Message("Դուրս գրում",,,attr)
  Call FillDoc_WriteOut(opDate, Null)
    
  Call Log.Message("Դուրս գրածի վերականգնում",,,attr)
  Call WriteOffReconstruction(opDate, "", "")
 
  Call Log.Message("Պարտքերի մարում",,,attr)
  Call Debt_Repayment(Null, opDate, 500000, "", 2, accacc, DocNum, 2)  
  
  Call Log.Message("Պայմանագրի փակում",,,attr)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_AgrClose)
    
  Call Rekvizit_Fill("Dialog", 1, "General", "DATECLOSE", opDate)
  Call ClickCmdButton(2, "Î³ï³ñ»É")

  Call Log.Message("Պայմանագրի բացում",,,attr)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_AgrOpen)
  Call ClickCmdButton(5, "²Ûá")
  
  Call Log.Message("Բոլոր փաստաթղթերի ջնջում",,,attr)
  'Ջնջել բոլոր գործողությունները
  BuiltIn.Delay(3000)
  Call Close_Pttel("frmPttel")
  Call GroupDelete(FolderName, 1, DocNum, "^A[Del]", "^A[Del]", "")
  Call LetterOfCredit_Filter_Fill(FolderName, 1, DocNum)
  
  'Ռիսկի դասիչների ջնջում
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Risking & "|" & c_RisksPersRes)
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Risking & "|" & c_ObjRiskCat)

  'Ջնջել տոկոսների նշանակումները
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Percentages & "|" & c_Percentages)
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Percentages & "|" & c_BankEffRate)

  BuiltIn.Delay(3000)
  Call Close_Pttel("frmPttel")
  docType = 2
  Call LetterOfCredit_Filter_Fill(FolderName, docType, DocNum)

  'Ջնջել հաշվարկման ամսաթվերից
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Other & "|" & c_CalcDates)
  
  'Ջնջել Գծայնության կարգավիճակը
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_LineBrRec)
  
  'Ջնջել մայր պայմանագիրը
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Delete)
  Call ClickCmdButton(3, "²Ûá")
  
  Call Close_AsBank()
End Sub