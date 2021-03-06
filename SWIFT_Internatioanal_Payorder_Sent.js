Option Explicit
'USEUNIT Library_Common
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Online_PaySys_Library
'USEUNIT PayOrder_Receive_ConfirmPhases_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT International_PayOrder_ConfirmPhases_Library
'USEUNIT International_PayOrder_Receive_Confirmphases_Library
'USEUNIT Payment_Except_Library
'USEUNIT Constants

'Test case ID 166757

Sub SWIFT_Internatioanal_Payorder_Sent_Test(SysType)

      Dim fDATE, startDATE , date,confPath,confInput,docExist,param
      Dim office, department, docNumber, clTrans, res, payerInfo, payerAcc, payer, payerAddr
      Dim recdateType, IBAN,country, acc,my_vbobj, recAcc, receiver, recCountry, recAddr, summa, curr, paycorrBank , paycorrAcc, medBankdateType
      Dim medBank,medBankAcc, recOrgdateType, recOrg, recOrgAcc, fISN
      Dim category,receipt,path,fromFile, toFile,fileName,isExists,aim
      Dim tabN,Num,chargeType,chargePercent,chargeSum,confPath2,confPath1,confPath3, confPath4
      
      date = "260418"
      Utilities.ShortDateFormat = "yyyymmdd"
      startDATE = "20010101"
      fDATE = "20250101"
      confPath = "\\host2\Sys\Testing\International_PayOrder_Confirmphases\IntPayOrderPhases_All_Verify.txt"
      confPath1 = "\\host2\Sys\Testing\PaymentOrder\Charge_from_bank.txt"
      confPath2 = "\\host2\Sys\Testing\PaymentOrder\Charge_from_bank2.txt"
      confPath3 = "\\host2\Sys\Testing\PaymentOrder\Charge_from_Tranfer.txt"
      confPath4 = "\\host2\Sys\Testing\SWIFT confirm phases\SWIFTempty.txt"
    
      path = "\\host2\Sys\Testing\SWIFT\IN\SWIFT_test"
      office = Null
      department = Null
      clTrans = Null
      res = Null
      payerInfo = Null
      payerAcc = "77700/000001101"
      payer = Null
      payerAddr = Null
      recdateType = Null                        
      IBAN = False
      country = Null
      acc = Null
      recAcc = Null
      receiver = "ABAGATWWXXX"
      recCountry = Null
      recAddr = Null
      summa = "10"
      curr = "001"
      paycorrBank = Null
      paycorrAcc = Null
      medBankdateType = Null
      medBank = Null
      medBankAcc = Null
      recOrgdateType = "A"
      recOrg = "LUMIUS3NXXX"
      recOrgAcc = Null
      aim = "test"
      
      'Կատարում է ստուգում,եթե նման անունով ֆայլ կա տրված թղթապանակում ,ջնջում է
      aqFileSystem.DeleteFile(Project.Path & "Stores\SWIFTtest\Actual\*.RJE")      
    
      'Test StartUp start
      Call Initialize_AsBank("bank", startDATE, fDATE)
      
      Call ChangeWorkspace(c_Admin)
      
      Select Case SysType
              Case 1
                  Call SetParameter("SWIN", Project.Path& "Stores\SWIFTtest\Actual\")
                  Call SetParameter("SWFAIN", Project.Path& "Stores\SWIFTtest\Actual\FileAct\")
                  Call SetParameter("SWFAOUT", Project.Path& "Stores\SWIFTtest\Import\FileAct\")
                  Call SetParameter("SWOUT", Project.Path& "Stores\SWIFTtest\Import\")
                  Call SetParameter("SWTMPDIR", "\\host2\Sys\Testing\SWIFT\tmp\")
                  Call SetParameter("SWSPFSIN", "")
                  Call SetParameter("SWSPFSCLIENTS", "")
                  
              Case 2
                  Call SetParameter("SWIN", "")
                  Call SetParameter("SWFAIN", "")
                  Call SetParameter("SWFAOUT", "")
                  Call SetParameter("SWOUT", "")
                  Call SetParameter("SWTMPDIR", "\\host2\Sys\Testing\SWIFT\tmp\")
                  Call SetParameter("SWSPFSIN", Project.Path& "Stores\SWIFTtest\Actual\")
                  Call SetParameter("SWSPFSCLIENTS", "LUMIUS3NXXX")
      End Select
      
'      Call Insert_MyDocs()
      Login("ARMSOFT")
      
      Call ChangeWorkspace(c_Admin)
      
      'Կարգավորումների ներմուծում
      confInput = Input_Config(confPath)
      If Not confInput Then
          Log.Error("The configuration doesn't input")
          Exit Sub
      End If
      
      Call ChangeWorkspace(c_Admin)
      confInput = Input_Config(confPath1)
      If Not confInput Then
          Log.Error("The configuration doesn't input")
          Exit Sub
      End If
      
      Call ChangeWorkspace(c_Admin)
      confInput = Input_Config(confPath2)
      If Not confInput Then
          Log.Error("The configuration doesn't input")
          Exit Sub
      End If

      Call ChangeWorkspace(c_Admin)
      confInput = Input_Config(confPath3)
      If Not confInput Then
          Log.Error("The configuration doesn't input")
          Exit Sub
      End If   
      
      Call ChangeWorkspace(c_Admin)
      confInput = Input_Config(confPath4)
      If Not confInput Then
          Log.Error("The configuration doesn't input")
          Exit Sub
      End If 
              
      'Դնում է ուղարկել SWIFT նշիչը
      Call Change_User_Permission_SWIFT()
      Call Login("ARMSOFT")
      
       'Test StartUp end

      
      Call Login("ARMSOFT")
      Call ChangeWorkspace(c_CustomerService)
      Call Online_PaySys_Go_To_Agr_WorkPapers("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |²ßË³ï³Ýù³ÛÇÝ ÷³ëï³ÃÕÃ»ñ", date, date)
      'Միաջազգային վճարման հանձնարարգրի (ուղ.) ստեղծում
      Call International_PayOrder_Send_Fill(office, department, docNumber, date, clTrans, res, payerInfo, payerAcc, payer, payerAddr, _
                                            recdateType, IBAN, country, acc, recAcc, receiver, recCountry, recAddr, summa, curr, paycorrBank , paycorrAcc, medBankdateType, _
                                            medBank, medBankAcc, recOrgdateType, recOrg, recOrgAcc, aim, fISN)
    
      Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("FrmSpr").Close()
      
      'Ստուգում է որ, գանձման տեսակը ճիշտ լրացված լինի
      tabN = "4"
      Num = "18"
      chargeType = "08"
      chargePercent = "0.0000"
      chargeSum = "0.00"
      Call Check_Charges(docNumber,tabN,Num,chargeType,chargePercent,chargeSum)
      
      'Փաստաթղթի վավերացում
      'Call PaySys_Verify(True)
      Call wMainForm.MainMenu.Click(c_AllActions)
      Call wMainForm.PopupMenu.Click(c_SendToVer)
      BuiltIn.Delay(delay_middle)
      Sys.Process("Asbank").vbObject("frmAsMsgBox").vbObject("cmdButton").Click()
      Sys.Process("Asbank").vbObject("MainForm").Window("MDIClient", "", 1).vbObject("frmPttel").Close()
      Call ChangeWorkspace(c_Verifier1)
    
      'Փաստաթղթի առկայության ստուգում 1-ին հաստատողի մոտ
      docExist = Online_PaySys_Check_Doc_In_Verifier(docNumber, date, date)
      If Not docExist Then
          Log.Error("The document with number " & docNumber & " doesn't exist in 1st verify documents")
          Exit Sub
      End If
   
'      Փաստաթղթի վավերացում 1-ին հաստաոտղի կողմից
      Call PaySys_Verify(True)
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()

      'Արտաքին փոխանցումներում հանձնարարգրի առկայության ստուգում
      Call ChangeWorkspace(c_ExternalTransfers)
      docExist = PaySys_Check_Doc_In_ExternalTransfer_Folder(date, date , docNumber)
      If Not docExist Then
          Log.Error("The document with number " & docNumber & " must exist in external transfers folder")
          Exit Sub
      End If
    
      'Հանձնարարգրի ուղարկում SWIFT բաժին
      Call PaySys_Sento_SWIFT()
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
      Call ChangeWorkspace(c_SWIFT)
      'Փաստատթղթի առկայության ստուգում BankMail-ի ուղարկվեղ փոխանցումներ թղթապանակում
      docExist = PaySys_Check_Doc_In_SWIFT_Folder(date, date , fISN)
      If Not docExist Then
          Log.Error("The document with ISN " & fISN & " must exsits in sending SWIFT folder")
          Exit Sub
      End If
      BuiltIn.Delay(1000)
      
      'Ուղարկել SWIFT կամ հաստատման 
      category = "N"
      receipt = 0
      Call Send_SWIFT_or_Confirm(category,receipt)
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close()
    
      BuiltIn.Delay(1000)
      fileName = ListFiles(Project.Path & "Stores\SWIFTtest\Actual")
      toFile = Project.Path & "Stores\SWIFTtest\Actual\" & Trim(fileName)
      fromFile = Project.Path &"Stores\SWIFTtest\Expected\IA000369.RJE"
      'Համեմատում է ֆայլերը
      param = "(((:[3][2][A-Z])|([1][3][D])|([2][0]:)|[2][1])([0-9:]+)|(:[2][8]:[0-9:]+))|([[6][2][F]:[C]......)|[$]................................"
      Call Compare_Files(fromFile, toFile,param)
      
      Call Close_AsBank()

End Sub