Option Explicit

'USEUNIT Library_Common  
'USEUNIT Deposit_Contract_Library
'USEUNIT Akreditiv_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Credit_Line_Library
'USEUNIT Loan_Agreemnts_With_Schedule_Library
'USEUNIT Loan_Agreements_Library 
'USEUNIT Group_Operations_Library
'USEUNIT Constants
'USEUNIT Mortgage_Library

'Test case ID 165761
'Test case N 160299

Sub Placed_Deposit_Actions_Test(DocumentType)
  Dim fDATE, sDATE, attr
  Dim FolderName, opDate, Sum, exTerm, MainSum, Prc, NonUsedPrc, EffRete, ActRete
  Dim fBASE, DocNum, template, depositContractType, colItem, ClientCode,_ 
      thirdPerson, curr, CalcAcc, thirdAcc, perAcc, chbKap, chbAuto, chbEx, Date,_
      kindScale, scale, withScale, depositPer, part, per, GiveDate, startDate,_
      Term, period, direction, payDates, sumsDateFillType, sumsFillType, tabN
  Dim DocLevel  
    
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

  FolderName = "|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|ä³ÛÙ³Ý³·ñ»ñ|î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|î»Õ³µ³ßËí³Í ³í³Ý¹Ý»ñ|"
  wTreeView.DblClickItem(FolderName & "Üáñ å³ÛÙ³Ý³·ñÇ ëï»ÕÍáõÙ")

  ''3.Տեղաբաշխված ավանդի պայմանագրի ստեղծում
  Select Case  DocumentType
  Case 1 
    depositContractType = "²í³Ý¹³ÛÇÝ å³ÛÙ³Ý³·Çñ"
  Case 2
    depositContractType = "ØÇ³Ý·³ÙÛ³ ³í³Ý¹"  
  End Select 

  colItem = "0"
  CalcAcc = "03485010100"
  Sum = 100000
  chbKap = 0
  chbAuto = 1
  chbEx = 1
  Date = "121118"
  kindScale = "1"
  depositPer = 10
  part = 365
  per = 0.5
  GiveDate = "121118"
  Term = "121119"
  period = 1
  direction = 2
  scale = False
  startDate = Date

  Call Deposit_Contract_Fill(fBASE,DocNum,template,depositContractType,colItem, _
                               ClientCode,thirdPerson,curr,CalcAcc,thirdAcc,perAcc,Sum,chbKap,_
                               chbAuto,chbEx,Date,kindScale,scale,withScale,depositPer,part,per, GiveDate,_
                               Term,startDate,period,direction)
  Log.Message(DocNum) 
                            
  ''4.Պայմանագրը ուղարկել հաստատման                               
  Call PaySys_Send_To_Verify()
                                 
  ''5.Հաստատել պայմանագիրը
  BuiltIn.Delay(2000)
  Call Close_Pttel("frmPttel")
  Call wTreeView.DblClickItem(FolderName & "Ð³ëï³ïíáÕ ÷³ëï³ÃÕÃ»ñ I")
  'Լրացնել "Պայմանագարի համար"   
  Call Rekvizit_Fill("Dialog",1,"General","NUM",DocNum)
  'Սեղմել "Կատարել" կոճակը
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  'Հաստատել Հաստատող փաստաթղթեր 1- ում
  Call PaySys_Verify(True)
  BuiltIn.Delay(2000)
  Call Close_Pttel("frmPttel")
  
  wTreeView.DblClickItem(FolderName & "ä³ÛÙ³Ý³·ñ»ñ")   
  'Լրացնել "Պայմանագրի Մակարդակ" դաշտը
  Call Rekvizit_Fill("Dialog",1,"General","LEVEL",DocLevel)
  'Լրացնել "Պայմանագրի համար" դաշտը
  Call Rekvizit_Fill("Dialog",1,"General","NUM",DocNum)
  'Սեղմեձլ "Կատարել" կոճակը
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  
  Call Log.Message("Ավանդի տրամադրում",,,attr)
  DocLevel = 1
  Call Give_Deposit(Date, Sum, 2, Null)

  opDate = "111218"    
  Call Log.Message("Տոկոսների հաշվարկ",,,attr)
  Call Calculate_Percent(Null, opDate , opDate)
  
  opDate = "121218" 
  exTerm = "121120"   
  Call Log.Message("Ժամկետների վերանայում",,,attr)
  Call Deposit_Extension(opDate, exTerm, "", period, Direction, c_TermsStates & "|" & c_Dates & "|" & c_ReviewTerms)
  
  Call Log.Message("Պարտքերի մարում",,,attr)
  MainSum = 10000
  tabN = 2
  Call Debt_Repayment(Null, opDate, MainSum, "", 2, CalcAcc, DocNum, tabN)

  Call Log.Message("Տոկոսադրույքներ",,,attr)
  Prc = 15
  NonUsedPrc = 10
  Call ChangeRete(opDate, Prc, NonUsedPrc)
    
  Call Log.Message("Արդյունավետ տոկոսադրույք",,,attr)
  Call ChangeEffRete(opDate, EffRete, ActRete)
  
  Call Log.Message("Օբյեկտիվ ռիսկի դասիչ",,,attr)
  Call ObjectiveRisk(opDate, "04")
    
  Call Log.Message("Ռիսկի դասիչ և պահուստավորման տոկոս",,,attr)
  Call FillDoc_Risk_Classifier(opDate, "05", 100)

  Call Log.Message("Պարտքերի մարում",,,attr)
  MainSum =  90000
  Call Debt_Repayment(Null, opDate, MainSum, "", 2, CalcAcc, DocNum, tabN)
  
  Call Log.Message("Պայմանագրի փակում",,,attr)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_AgrClose)
    
  Call Rekvizit_Fill("Dialog", 1, "General", "DATECLOSE", opDate)
  Call ClickCmdButton(2, "Î³ï³ñ»É")

  Call Log.Message("Պայմանագրի բացում",,,attr)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_AgrOpen)
  Call ClickCmdButton(5, "²Ûá")
  
  ''Ջնջել բոլոր փաստաթղթերը
  Call Log.Message("Բոլոր փաստաթղթերի ջնջում",,,attr)
  'Ջնջում "Գործողությունների դիտումից"
  
  Call Close_Pttel("frmPttel")
  Call GroupDelete(FolderName, 1, DocNum, "^A[Del]", "^A[Del]", "^A[Del]")
  Call LetterOfCredit_Filter_Fill(FolderName, 1, DocNum)
  
  'Ռիսկի դասիչների ջնջում
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Risking & "|" & c_RisksPersRes)
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Risking & "|" & c_ObjRiskCat)
  
  'Ջնջել տոկոսների նշանակումները
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Percentages & "|" & c_Percentages)
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Percentages & "|" & c_EffRate)

  'Ջնջել ժամկետների վերանայումը
  Call Delete_ViewEdit("^A[Del]", "^A[Del]", c_Dates & "|" & c_AgrDates) 
   
  'Ջնջել ավանդի պայմանագիրը
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_Delete)
  Call ClickCmdButton(3, "²Ûá")
  
  Call Close_AsBank()  
End Sub
