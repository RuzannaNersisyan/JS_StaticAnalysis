'USEUNIT Library_Common 
'USEUNIT Library_CheckDB 
'USEUNIT Payment_Library 

'USEUNIT CommunalPayments

Sub CommunalPayments_Repayment_Test
' Œ·Ÿ·ı›≥… Ì◊≥Ò·ıŸ›ªÒ« Ÿ≥ÒŸ≥› ÔªÎÔ


Call CommunalPayments_Test (false, true)

const TransAccount_PA_PI_E_W = "001466500"
const TransAccount_GA_GS = "001456600" 
const TransAccount_V = "000428600" 
const CreditAccount1 = "000005200"        
const CreditAccount2 = "00067030100"    
const CreditAccount3 = "00000110700"  
const CreditAccount4 = "000927700"   
const CreditAccount5 = "000919400"   

Utilities.ShortDateFormat = "yyyymmdd" 
fDATE = Utilities.DateToStr(Utilities.Date())
startDATE = Utilities.DateToStr(Utilities.IncMonth(Utilities.Now, -12)) 

Log.Message("CommunalPayments_Repayment_Test Started")
  
  Call Initialize_AsBank("bank", startDATE, fDATE) 

  
  Login ("BankMail")
  Call SendToBankMail
  
  sOriginal = CreateVariantArray(1, 5)       

'  sOriginal(1) = Generate_BM_Communal_File_TrueContent_INP (9000, "001466500", 5)
'  sOriginal(2) = Generate_BM_Communal_File_TrueContent_INP (2000, "001466500", 2)
'  sOriginal(3) = Generate_BM_Communal_File_TrueContent_INP (4000, "001456600", 4)
'  sOriginal(4) = Generate_BM_Communal_File_TrueContent_INP (11000, "001466500", 1)
'  sOriginal(5) = Generate_BM_Communal_File_TrueContent_INP (8000, "001466500", 3)
 
  sOriginal(1) = Generate_BM_Communal_File_TrueContent_INP (11000, "001466500", 1)
  sOriginal(2) = Generate_BM_Communal_File_TrueContent_INP (3000, "001466500", 2)
  sOriginal(3) = Generate_BM_Communal_File_TrueContent_INP (4000, "001466500", 3)
  sOriginal(4) = Generate_BM_Communal_File_TrueContent_INP (6000, "001456600", 4)
  sOriginal(5) = Generate_BM_Communal_File_TrueContent_INP (7000, "001466500", 5)
 
  Call CheckGeneratedFiles_Communal (sOriginal)
  
  
  Login ("BankMail")
  Call ImportBMOutFile
  
  Login ("transferer")
  Call Repay_CommunalPayments (fBASE)
  
'
'----------------------------------------------------------------------------------------  
'  Call CheckStatement (fBASE, fDATE, TransAccount_PA_PI_E_W, CreditAccount1, 7500) 
'  Call CheckStatement (fBASE, fDATE, TransAccount_PA_PI_E_W, CreditAccount1, 10500)
'  Call CheckStatement (fBASE, fDATE, TransAccount_GA_GS, CreditAccount1, 4000)  
'  Call CheckStatement (fBASE, fDATE, TransAccount_PA_PI_E_W, CreditAccount1, 1500)  
'  Call CheckStatement (fBASE, fDATE, TransAccount_PA_PI_E_W, CreditAccount1, 8500) 
'  Call CheckStatement_Mult (fBASE, fDATE, TransAccount_PA_PI_E_W, CreditAccount4, 500,4)

  Call CheckStatement (fBASE, fDATE, TransAccount_PA_PI_E_W, CreditAccount1, 3500) 
  Call CheckStatement (fBASE, fDATE, TransAccount_PA_PI_E_W, CreditAccount1, 10500)
  Call CheckStatement (fBASE, fDATE, TransAccount_GA_GS, CreditAccount1, 6000)  
  Call CheckStatement (fBASE, fDATE, TransAccount_PA_PI_E_W, CreditAccount1, 2500)  
  Call CheckStatement (fBASE, fDATE, TransAccount_PA_PI_E_W, CreditAccount1, 6500) 
  Call CheckStatement_Mult (fBASE, fDATE, TransAccount_PA_PI_E_W, CreditAccount4, 500,4)

'----------------------------------------------------------------------------------------

  Call Close_AsBank
  
  Log.Message("CommunalPayments_Repayment_Test Completed")
  BuiltIn.Delay(3000)      
  
End Sub
