'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Common
'USEUNIT OLAP_Library
'USEUNIT Constants

Option Explicit
'Test Case ID 123494

Sub Report_18_Test()
  
      Dim coaNum,dateE,dateS,DateStart,DateEnd,branch,nbTurn
      Dim file1, file2, param
    
      DateStart = "20120101"
      DateEnd = "20240101" 

      'Մուտք գործել ՀԾ- Բանկ համակարգ ARMSOFT օգտագործողով
      Call Initialize_AsBankQA(DateStart, DateEnd) 
 
      'Անցում կատարել "Ենթահամակարգեր" ԱՇՏ
      Call ChangeWorkspace(c_Subsystems)
      Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î´ Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|18 ´³ÝÏÇ ¨ áã é»½Ç¹.ÙÇç¨ Çñ³Ï³Ý.·áñÍ³éÝ.í»ñ³µ»ñÛ³É,1¿ç")
    
      dateE = "310314"
      coaNum = 0 
      nbTurn = 1
    
      'Լրացնում է  "Ամսաթիվ" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"SDATE" ,"![End]" & "[Del]" &  dateE)
      'Լրացնում է "Ենթահամակարգ" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"SYSTYPE" ,branch)
      'Լրացնում է "Բերել ցպահանջ հաշիվները" նշիչը
      Call Rekvizit_Fill("Dialog",1 ,"CheckBox" ,"CALCACC" ,nbTurn)
      'Լրացնում է " Հաշվել ատոմար ցուցանիշները" նշիչը
      Call Rekvizit_Fill("Dialog",1 ,"CheckBox" ,"CALCATM" ,nbTurn)
      'Լրացնում է "Միայն ուղղակի ներդրումների գծով" նշիչը
      Call Rekvizit_Fill("Dialog",1 ,"CheckBox" ,"ONLYUXXN" ,coaNum)    
      'Լրացնում է "Բերել բաղադրիչ գումարները" նշիչը
      Call Rekvizit_Fill("Dialog",1 ,"CheckBox" ,"ONLYUXXN" ,coaNum)
      'Սեղմել "Կատարել" կոճակը
      Call ClickCmdButton(2 ,"Î³ï³ñ»É")
    
      BuiltIn.Delay(15000)
    
      'Սեղմել "Հիշել որպես"
      Call wMainForm.MainMenu.Click(c_SaveAs)
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(Project.Path & "Stores\CB\Actual\18.txt")
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("Button", "&Save", 1).Click()
    
      'Համեմատել ֆայլերը
      file1 = Project.Path & "Stores\CB\Actual\18.txt"
      file2 = Project.Path & "Stores\CB\Expected\Expected 18_1.txt"
      Call Compare_Files(file1, file2,param)
    
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("FrmSpr").Close()
    
      Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î´ Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|18 ´³ÝÏÇ ¨ áã é»½Ç¹.ÙÇç¨ Çñ³Ï³Ý.·áñÍ³éÝ.í»ñ³µ»ñÛ³É,2¿ç")
    
      dateS = "010314"
      dateE = "310314"  

    
      'Լրացնում է  "Ժամանակահատված(սկիզբ)" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"FDATE" ,"![End]" & "[Del]" &  dateS)
      'Լրացնում է "Ժամանակահատված(վերջ)" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"LDATE" ,"![End]" & "[Del]" &  dateE)
      'Լրացնում է "Գրասենյակ" դաշտը
      Call Rekvizit_Fill("Dialog",1 ,"General" ,"BRANCH" ,branch)
      'Սեղմել "Կատարել" կոճակը
      Call ClickCmdButton(2 ,"Î³ï³ñ»É")
    
      BuiltIn.Delay(8000)
    
      'Սեղմել "Հիշել որպես"
      Call wMainForm.MainMenu.Click(c_SaveAs)
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(Project.Path & "Stores\CB\Actual\18.txt")
      Sys.Process("Asbank").Window("#32770", "ÐÇß»É áñå»ë", 1).Window("Button", "&Save", 1).Click()
    
      'Համեմատել ֆայլերը
      file1 = Project.Path & "Stores\CB\Actual\18.txt"
      file2 = Project.Path & "Stores\CB\Expected\Expected 18_2.txt"
      Call Compare_Files(file1, file2,param)
    
      'Փակել ՀԾ - Բանկ համակարգը
      Call Close_AsBank()
    
End Sub