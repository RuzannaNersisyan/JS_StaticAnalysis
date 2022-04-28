'USEUNIT Library_Common 
'USEUNIT Library_CheckDB 
'USEUNIT Payment_Library 

Sub CommunalPayments_Test (CorrectSums, Rep)
' ÎáÙáõÝ³É í×³ñáõÙÝ»ñÇ ï»ëï


const PhoneNumber1 = "523360"
const PhoneNumber2 = "623078"
const Mobile_ArmenTel = "218614"
const Mobile_VivaCell = "432129"
const CashCode = "001"
const CashAccount = "000001100"
const TransAccount_PA_PI_E_W = "001466500"
const TransAccount_GA_GS = "001456600" 
const TransAccount_V = "000428600" 
Dim DocNum

Utilities.ShortDateFormat = "yyyymmdd" 
fDATE = Utilities.DateToStr(Utilities.Date())
startDATE = Utilities.DateToStr(Utilities.IncMonth(Utilities.Now, -12)) 

Sum = CreateVariantArray(1, 8)
If CorrectSums = true Then
  Sum(1) = 1110
  Sum(2) = 15630
  Sum(3) = 21140'17670
  Sum(4) = 700
  Sum(5) = 0
  Sum(6) = 0
  Sum(7) = 19510
  Sum(8) = 216480
Else
  Sum(1) = 9000
  Sum(2) = 2000
  Sum(3) = 3000
  Sum(4) = 4000
  Sum(5) = 5000
  Sum(6) = 6000
  Sum(7) = 7000
  Sum(8) = 8000
End If

Log.Message("CommunalPayments_Test Started")
  

  Call Initialize_AsBank("bank", startDATE, fDATE) 
  
  Call Delete_COM_PAYMENTS
  
  Login ("operator")
  
  Call CreateCommunalPayments (CorrectSums, PhoneNumber1, PhoneNumber2, Mobile_ArmenTel, Mobile_VivaCell, CashCode, Sum, fBASE, DocNum)
  
  Login ("operator")
  Call SendToCash (DocNum)
  
  Login ("cashier")
  Call VerifyInCash (DocNum)
  
'-------------------------------------------------------------------------------------------------  
  Call CheckStatement (fBASE, fDATE, CashAccount, TransAccount_PA_PI_E_W, Sum(1))
  Call CheckStatement (fBASE, fDATE, CashAccount, TransAccount_PA_PI_E_W, Sum(2))
  Call CheckStatement (fBASE, fDATE, CashAccount, TransAccount_PA_PI_E_W, Sum(3))
  Call CheckStatement (fBASE, fDATE, CashAccount, TransAccount_PA_PI_E_W, Sum(4))
  If CorrectSums = false Then
    Call CheckStatement (fBASE, fDATE, CashAccount, TransAccount_GA_GS, Sum(5))
    Call CheckStatement (fBASE, fDATE, CashAccount, TransAccount_GA_GS, Sum(6))
  End If  
  Call CheckStatement (fBASE, fDATE, CashAccount, TransAccount_PA_PI_E_W, Sum(7))
  Call CheckStatement (fBASE, fDATE, CashAccount, TransAccount_V, Sum(8))

'------------------------------------------------------------------------------------------------- 
'  If CorrectSums = false Then
'    Call Check_COM_PAYMENTS (fBASE, Null, "PA", "10", "523360", Sum(5), "Ð²Îà´Ú²Ü ÚàôðÆÚ  è.", "" , TransAccount_PA_PI_E_W) 
'    Call Check_COM_PAYMENTS (fBASE, Null, "PI", "10", "523360", Sum(6), "Ð²Îà´Ú²Ü ÚàôðÆÚ  è.", "" , TransAccount_PA_PI_E_W)
'    Call Check_COM_PAYMENTS (fBASE, Null, "E", "010", "3250103", Sum(2), "Ð²Îà´Ú²Ü ÚàôðÆ", "ù©ºðºì²Ü, ÎàðÚàôÜÆ ÷áÕ© 1 3", TransAccount_PA_PI_E_W)
'    Call Check_COM_PAYMENTS (fBASE, Null, "W", "02", "7-96-94-0-38", Sum(8), "ØÆÜ²êÚ²Ü ¶àÐ²ð", "2 ¼²Ü¶ì²Ì  94 - 38 94 38", TransAccount_PA_PI_E_W)
'    Call Check_COM_PAYMENTS (fBASE, Null, "GA", "15", "555435", Sum(3), "Ð²Îà´Ú²Ü ÚàôðÆ", ". ÎàðÚàôÜÆ 1 Þ 3", TransAccount_GA_GS)
'    Call Check_COM_PAYMENTS (fBASE, Null, "GS", "15", "555435", Sum(4), "Ð²Îà´Ú²Ü ÚàôðÆ", ". ÎàðÚàôÜÆ 1 Þ 3", TransAccount_GA_GS)
'    Call Check_COM_PAYMENTS (fBASE, Null, "A", "91", "218614", Sum(1), "Ø³Ýí»É ê³ñ¹³ñÛ³Ý", "" , TransAccount_PA_PI_E_W)
'    Call Check_COM_PAYMENTS (fBASE, Null, "V", "93", "432129", Sum(7), "§êÆ ²Ú  ÂÆ¦ êäÀ", "" , TransAccount_V)
'  Else
    Call Check_COM_PAYMENTS (fBASE, Null, "PA", "10", "523360", Sum(1), "Ð²Îà´Ú²Ü ÚàôðÆÚ  è.", "" , TransAccount_PA_PI_E_W) 
    Call Check_COM_PAYMENTS (fBASE, Null, "PI", "10", "523360", Sum(2), "Ð²Îà´Ú²Ü ÚàôðÆÚ  è.", "" , TransAccount_PA_PI_E_W)
    Call Check_COM_PAYMENTS (fBASE, Null, "E", "010", "3250103", Sum(3), "Ð²Îà´Ú²Ü ÚàôðÆ", "ù.ºðºì²Ü, ÎàðÚàôÜÆ ÷áÕ. 1 3", TransAccount_PA_PI_E_W) '"ù©ºðºì²Ü, ÎàðÚàôÜÆ ÷áÕ© 1 3"
    Call Check_COM_PAYMENTS (fBASE, Null, "W", "02", "7-96-94-0-38", Sum(4), "ØÆÜ²êÚ²Ü ¶àÐ²ð", "2 ¼²Ü¶ì²Ì  94 - 38 94 38", TransAccount_PA_PI_E_W)
    If CorrectSums = false Then
      Call Check_COM_PAYMENTS (fBASE, Null, "GA", "15", "555435", Sum(5), "Ð²Îà´Ú²Ü ÚàôðÆ", ". ÎàðÚàôÜÆ 1 Þ 3", TransAccount_GA_GS) 
      Call Check_COM_PAYMENTS (fBASE, Null, "GS", "15", "555435", Sum(6), "Ð²Îà´Ú²Ü ÚàôðÆ", ". ÎàðÚàôÜÆ 1 Þ 3", TransAccount_GA_GS)
    End If
    Call Check_COM_PAYMENTS (fBASE, Null, "A", "91", "218614", Sum(7), "Ø³Ýí»É ê³ñ¹³ñÛ³Ý", "" , TransAccount_PA_PI_E_W)
    Call Check_COM_PAYMENTS (fBASE, Null, "V", "93", "432129", Sum(8), "§êÆ ²Ú  ÂÆ¦ êäÀ", "" , TransAccount_V)
'  End If
'-------------------------------------------------------------------------------------------------  
  
  If Rep = false Then
    Login ("BankMail")
    Call Delete_ComPayments
    Login ("armsoft")
    Call Delete_CreatedDoc (fBASE)
  End If  

  Call Close_AsBank
  
  Log.Message("CommunalPayments_Test Completed")
  BuiltIn.Delay(3000)      
  
End Sub