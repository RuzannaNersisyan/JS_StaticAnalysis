Option Explicit

'USEUNIT Library_Common  
'USEUNIT Repo_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Akreditiv_Library
'USEUNIT Loan_Agreements_Library 
'USEUNIT Deposit_Contract_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Group_Operations_Library
'USEUNIT Constants
'USEUNIT Mortgage_Library

'Test Case ID 165779

Sub Repo_Actions_Test()    
  Dim fDATE, sDATE, attr, opDate, exTerm, Prc, NonUsedPrc, EffRete, ActRete
  Dim Client, Curr, CalcAcc, Summa, Date, SecState, SecName, Nominal, Price, Kindscale,_
      Percent, GiveDate, Term, DateFill, CheckPayDates, PayDates, Paragraph, Direction,_
      Sector, Aim, Country,District, Region, PaperCode, fBASE, DocNum, Workspace
      
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

  ''2.Մուտք գործել "Ռեպո համաձայնագրեր"
  Call ChangeWorkspace(c_RepoAgrs) 

  ''Ռեպոի ստեղծում
  CalcAcc = "00000113032"
  Summa = 100000
  Date = "221018"
  SecState = 1
  SecName = "AMGB10172218"
  Nominal = "80000" 
  Price = "100000"
  Percent = "12"
  GiveDate = "221018"
  Term = "221019"
  DateFill = 1
  CheckPayDates = 0
  Direction = 2
  Paragraph = 1
  Sector = "U2"
  Aim = "00"
  District = "001"
  Region = "010000008"
  Country = "AM"
  PaperCode = 111
  Call Repo_Create(Client, Curr, CalcAcc, Summa, Date, SecState, SecName, Nominal, Price,_
                   "", Percent, GiveDate, Term, DateFill, CheckPayDates, PayDates, Paragraph,_
                   Direction, Sector, Aim, Country, District, Region, PaperCode, fBASE, DocNum)
  
  ''4.Պայմանագրը ուղարկել հաստատման                               
  Call PaySys_Send_To_Verify()
                                 
  ''5.Հաստատել պայմանագիրը
  BuiltIn.Delay(2000)
  Call Close_Pttel("frmPttel")
  Call wTreeView.DblClickItem("|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
  'Լրացնել "Պայմանագարի համար"   
  Call Rekvizit_Fill("Dialog",1,"General","NUM",DocNum)
  'Սեղմել "Կատարել" կոճակը
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  'Հաստատել Հաստատող փաստաթղթեր 1- ում
  Call PaySys_Verify(True)
  BuiltIn.Delay(2000)
  Call Close_Pttel("frmPttel")
  
  Call LetterOfCredit_Filter_Fill("|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)
  
  Call Log.Message("Ռեպոի տրամադրում",,,attr)
  Call Repo_Provide(Date)
  
  Call LetterOfCredit_Filter_Fill("|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)
  
  opDate = "211118"
  Call Log.Message("Տոկոսների հաշվարկ",,,attr)
  Call Calculate_Percents(opDate, opDate, False)
  
  opDate = "221118"
  exTerm = "221020"
  Call Log.Message("Ժամկետների վերանայում",,,attr)
  Call Deposit_Extension(opDate, exTerm, "", Paragraph, Direction, c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms)
  
  Call Log.Message("Արժեթղթի վաճառք",,,attr)
  Call Repo_Sell_Security(opDate, "", 2, CalcAcc)
  
  Call LetterOfCredit_Filter_Fill("|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)
  
  Call Log.Message("Արժեթղթի առք",,,attr)
  Call Repo_Buy_Security(opDate, "", 2, CalcAcc)
  
  Call LetterOfCredit_Filter_Fill("|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)
  
  Call Log.Message("Պարտքերի մարում",,,attr)
  Call Repo_Repayment(opDate, "", "")
  
  Call LetterOfCredit_Filter_Fill("|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)
  
  Call Log.Message("Տոկոսադրույքներ",,,attr)
  Prc = 15
  NonUsedPrc = 10
  Call ChangeRete(opDate, Prc, NonUsedPrc)
    
  Call Log.Message("Արդյունավետ տոկոսադրույք",,,attr)
  Call ChangeEffRete(opDate, EffRete, ActRete)
    
  Call Log.Message("Բանկի արդյունավետ տոկոսադրույք",,,attr)
  Call BankEffective_InterestRate_DocFill(opDate, "")
  
  Call Log.Message("Տոկոսների հաշվարկ",,,attr)
  Call Calculate_Percents(opDate, opDate, False)
      
  Call Log.Message("Օբյեկտիվ ռիսկի դասիչ",,,attr)
  Call ObjectiveRisk(opDate, "04")
    
  Call Log.Message("Ռիսկի դասիչ և պահուստավորման տոկոս",,,attr)
  Call FillDoc_Risk_Classifier(opDate, "05", 100)
    
  Call Log.Message("Պահուստավորում",,,attr)
  Call FillDoc_Store(opDate, Null)
    
  opDate = "231118"
  Call Log.Message("Պարտքերի մարում",,,attr)
  Call Repo_Repayment(opDate, 100000, 41.1)
  
  Call LetterOfCredit_Filter_Fill("|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|", 1, DocNum)

  Call Log.Message("Պայմանագրի փակում",,,attr)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_AgrClose)
  BuiltIn.Delay(2000)
  Call Rekvizit_Fill("Dialog", 1, "General", "DATECLOSE", opDate)
  Call ClickCmdButton(2, "Î³ï³ñ»É")

  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_AgrOpen)
  BuiltIn.Delay(2000)
  Call ClickCmdButton(5, "²Ûá")
  
  'Ջնջել բոլոր պայմանագրերը
  Call Log.Message("Բոլոր փաստաթղթերի ջնջում",,,attr)
  
 'Ջնջել բոլոր գործողությունները
  BuiltIn.Delay(2000)
  Call Close_Pttel("frmPttel")
  Workspace = "|è»åá Ñ³Ù³Ó³ÛÝ³·ñ»ñ|"
  Call GroupDelete(Workspace, 1, DocNum, "^A[Del]", "^A[Del]", "^A[Del]")
    
  Call LetterOfCredit_Filter_Fill(Workspace, 1, DocNum)

  'Ջնջել տոկոսների նշանակումները
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Percentages & "|" & c_Percentages)
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Percentages & "|" & c_EffRate)
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Percentages & "|" & c_BankEffRate)
  
  'Ռիսկի դասիչների ջնջում
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Risking & "|" & c_RisksPersRes)
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Risking & "|" & c_ObjRiskCat)
  
  'Ջնջել Ռեպոյի պայմանագիրը
  BuiltIn.Delay(2000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Delete)
  BuiltIn.Delay(2000)
  Call ClickCmdButton(3, "²Ûá")
  
  Call Close_AsBank()
End Sub