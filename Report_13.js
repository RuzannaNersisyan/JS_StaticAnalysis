'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Common
'USEUNIT OLAP_Library
'USEUNIT Constants

Option Explicit
'Test Case ID 122702

Sub Report_13_Test()
  
      Dim coaNum,dateS,dateE,repay,cbCode,DateStart,DateEnd,branch
      Dim file1, file2, param
    
      DateStart = "20120101"
      DateEnd = "20240101" 

      'Մուտք գործել ՀԾ- Բանկ համակարգ ARMSOFT օգտագործողով
      Call Initialize_AsBankQA(DateStart, DateEnd) 
 
      'Անցում կատարել "Ենթահամակարգեր" ԱՇՏ
      Call ChangeWorkspace(c_Subsystems)
      Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î´ Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|13 ¸ñ³Ù³ñÏÕÇ ßñç³Ý³éáõÃÛáõÝ")
    
      dateS = "010214"
      dateE = "280214"  
      cbCode = "99997"
      repay = 1
    
      'Լրացնում է  "Ժամանակահատված(սկիզբ)" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"SDATE" ,dateS)
      'Լրացնում է  "Ժամանակահատված(վերջ)" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"EDATE" ,dateE)
      'Լրացնում է "Դրամարկղ"
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"KASSA" ,coaNum)
      'Լրացնում է "դրամարկղի հաշիվ" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"KASACC" ,branch)
      'Լրացնում է "ՀՀ ԿԲ կոդ" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"CBCODE" ,cbCode)
      'Լրացնում է "Կլորացնել (հազ.) նշիչը
      Call Rekvizit_Fill("Dialog",1 ,"CheckBox" ,"ROUND" ,repay)

      'Սեղմել "Կատարել" կոճակը
      Call ClickCmdButton(2 ,"Î³ï³ñ»É")
    
      Call ClickCmdButton(5,"OK")
    
      BuiltIn.Delay(8000)
    
      'Սեղմել "Հիշել որպես"
      Call wMainForm.MainMenu.Click(c_SaveAs)
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(Project.Path & "Stores\CB\Actual\13.txt")
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("Button", "&Save", 1).Click()
    
      'Համեմատել ֆայլերը
      file1 = Project.Path & "Stores\CB\Actual\13.txt"
      file2 = Project.Path & "Stores\CB\Expected\Expected 13.txt"
      Call Compare_Files(file1, file2,param)
    
      'Փակել ՀԾ - Բանկ համակրգը
      Call Close_AsBank()
    
End Sub