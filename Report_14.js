'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Common
'USEUNIT OLAP_Library
'USEUNIT Constants

Option Explicit
'Test Case ID 123141

Sub Report_14_Test()
  
      Dim coaNum, dateS, dateE, trans, DateStart, DateEnd, branch
      Dim file1, file2, param
    
      DateStart = "20120101"
      DateEnd = "20240101" 

      'Մուտք գործել ՀԾ- Բանկ համակարգ ARMSOFT օգտագործողով
      Call Initialize_AsBankQA(DateStart, DateEnd) 
 
      'Անցում կատարել "Ենթահամակարգեր" ԱՇՏ
      Call ChangeWorkspace(c_Subsystems)
      Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î´ Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|14 §Êáßáñ¦ ÷áË³éáõÝ»ñ")
    
      dateS = "010214"
      dateE = "280214"  
      trans = 1
    
      'Լրացնում է  "Ամսաթիվ" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"DATEBEG" ,dateS)
      'Լրացնում է  "Ամսաթիվ" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"DATEEND" ,dateE)
      'Լրացնում է "
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"BRANCH" ,coaNum)
      'Լրացնում է դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"CheckBox" ,"CALCCAPITAL" ,trans)
      'Լրացնում է "Գրասենյակ" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"DCAPITAL" ,branch)
 
      'Սեղմել "Կատարել" կոճակը
      Call ClickCmdButton(2 ,"Î³ï³ñ»É")
    
      BuiltIn.Delay(30000)
    
      Call wMainForm.MainMenu.Click(c_SaveAs)
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(Project.Path & "Stores\CB\Actual\14.txt")
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("Button", "&Save", 1).Click()
    
      file1 = Project.Path & "Stores\CB\Actual\14.txt"
      file2 = Project.Path & "Stores\CB\Expected\Expected 14 checked.txt"
      Call Compare_Files(file1, file2,param)
    
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("FrmSpr").Close()
    
     
      'Փակել ՀԾ - Բանկ համակարգգը
      Call Close_AsBank()
    
End Sub