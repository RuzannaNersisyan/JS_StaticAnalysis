'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Common
'USEUNIT OLAP_Library
'USEUNIT Constants

Option Explicit
'Test Case ID 123838

Sub Report_20_Test()
  
      Dim dateS,dateE,DateStart,DateEnd
      Dim file1, file2, param
    
      DateStart = "20120101"
      DateEnd = "20240101" 

       'TestedApps.killproc.Run() 
      'Մուտք գործել ՀԾ- Բանկ համակարգ ARMSOFT օգտագործողով
      Call Initialize_AsBankQA(DateStart, DateEnd) 
 
      'Անցում կատարել "Ենթահամակարգեր" ԱՇՏ
      Call ChangeWorkspace(c_Subsystems)
      Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î´ Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|20 Ð³×³Ëáñ¹Ý»ñÇ, Ýñ³Ýó Ñ³ßÇí., ÷áË³Ýó., Ù³ïáõó.Í³é³ÛáõÃ.")
    
      dateS = "010214" 
      dateE = "280214" 
    
      'Լրացնում է  "Ժամանակահատված(սկիզբ)" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"PERN" ,dateS)
      'Լրացնում է "ժամանակահատված(վերջ)" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"PERK" ,dateE)
      'Լրացնում է "Հաշվարկել բոլոր աղյուսակները" դաշտը
      Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("AsRadioButtons").VBObject("Tabframe").VBObject("RadioButton").Click()
      'Սեղմել "Կատարել" կոճակը
      Call ClickCmdButton(2 ,"Î³ï³ñ»É")
    
      BuiltIn.Delay(50000)
    
      'Սեղմել "Հիշել որպես"
      Call wMainForm.MainMenu.Click(c_SaveAs)
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(Project.Path & "Stores\CB\Actual\20_1.txt")
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("Button", "&Save", 1).Click()
    
      'Համեմատել ֆայլերը
      file1 = Project.Path & "Stores\CB\Actual\20_1.txt"
      file2 = Project.Path & "Stores\CB\Expected\Expected 20_1.txt"
      Call Compare_Files(file1, file2,param)
    
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("FrmSpr").Close()
    
      Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î´ Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|20 Ð³×³Ëáñ¹Ý»ñÇ, Ýñ³Ýó Ñ³ßÇí., ÷áË³Ýó., Ù³ïáõó.Í³é³ÛáõÃ.")

      'Լրացնում է  "Ժամանակահատված(սկիզբ)" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"PERN" ,dateS)
      'Լրացնում է "ժամանակահատված(վերջ)" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"PERK" ,dateE)
      'Լրացնում է "Հաշվարկել "Հաճախորդներ և նրանց հաշիվներ" աղյուսակը" դաշտը
      Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("AsRadioButtons").VBObject("Tabframe").VBObject("RadioButton_2").Click()
      'Սեղմել "Կատարել" կոճակը
      Call ClickCmdButton(2 ,"Î³ï³ñ»É")
    
      BuiltIn.Delay(20000)
    
      'Սեղմել "Հիշել արպես"
      Call wMainForm.MainMenu.Click(c_SaveAs)
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(Project.Path & "Stores\CB\Actual\20_2.txt")
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("Button", "&Save", 1).Click()
    
      'Համեմատել ֆայլերը
      file1 = Project.Path & "Stores\CB\Actual\20_2.txt"
      file2 = Project.Path & "Stores\CB\Expected\Expected 20_2.txt"
      Call Compare_Files(file1, file2,param)
    
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("FrmSpr").Close()
    
      Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î´ Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|20 Ð³×³Ëáñ¹Ý»ñÇ, Ýñ³Ýó Ñ³ßÇí., ÷áË³Ýó., Ù³ïáõó.Í³é³ÛáõÃ.")

      'Լրացնում է  "Ժամանակահատված" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"PERN" ,dateS)
      'Լրացնում է "ժամանակահատված" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"PERK" ,dateE)
      'Լրացնում է "Հաշվարկել վճարային գործարքներ ներառող աղյուսակները" դաշտը
      Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("AsRadioButtons").VBObject("Tabframe").VBObject("RadioButton_3").Click()
      'Սեղմել "Կատարել" կոճակը
      Call ClickCmdButton(2 ,"Î³ï³ñ»É")
    
      BuiltIn.Delay(20000)
    
      'Սեղմել "հիշել որպես"
      Call wMainForm.MainMenu.Click(c_SaveAs)
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(Project.Path & "Stores\CB\Actual\20_3.txt")
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("Button", "&Save", 1).Click()
    
      'Համեմատել ֆայլերը
      file1 = Project.Path & "Stores\CB\Actual\20_3.txt"
      file2 = Project.Path & "Stores\CB\Expected\Expected 20_3.txt"
      Call Compare_Files(file1, file2,param)
    
      'Փակել ՀԾ - Բանկ համակարգը
      Call Close_AsBank()
    
End Sub