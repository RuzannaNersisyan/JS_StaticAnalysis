'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Library_Common
'USEUNIT OLAP_Library
'USEUNIT Constants

Option Explicit
'Test Case ID 124326

Sub Report_soushi_liab_Test()
  
    Dim rep,trans,DateStart,DateEnd,branch,dateS
    Dim EPath1, EPath2, resultWorksheet,exists,isExists
    
    DateStart = "20120101"
    DateEnd = "20240101" 

    TestedApps.killproc.Run() 
    
    EPath1 = Project.Path & "Stores\CB\Actual\soushi_liab.xlsx"
    EPath2 = Project.Path & "Stores\CB\Expected\Expected soushi_liab.xlsx"
    resultWorksheet = Project.Path & "Stores\Result_Olap\Result_CB_soushi_liab.xlsx"
     'Î³ï³ñáõÙ ¿ ëïáõ·áõÙ,»Ã» ÝÙ³Ý ³ÝáõÝáí ý³ÛÉ Ï³ ïñí³Í ÃÕÃ³å³Ý³ÏáõÙ ,çÝçáõÙ ¿   
    exists = aqFile.Exists(EPath1)
    If exists Then
        aqFileSystem.DeleteFile(EPath1)
    End If

    'Ջնջել ֆայլը, եթե այդպիսին կա
    isExists = aqFile.Exists(Project.Path & "Stores\CB\Actual\soushi_liab.xlsx")
    If isExists Then
       aqFileSystem.DeleteFile(Project.Path & "Stores\CB\Actual\soushi_liab.xlsx")
    End If
    
    'Մուտք գործել ՀԾ- Բանկ համակարգ ARMSOFT օգտագործողով
    Call Initialize_AsBankQA(DateStart, DateEnd) 
 
    'Անցում կատարել "Ենթահամակարգեր" ԱՇՏ
    Call ChangeWorkspace(c_Subsystems)
    Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î´ Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|ÐáõÙ ïíÛ³ÉÝ»ñ")
    
    dateS = "280214"
    rep = "2"  
    trans = 0
    
    'Լրացնում է  "Փաստաթղթի ISN" դաշտը
    Call Rekvizit_Fill("Dialog",1 ,"General" ,"ISN" ,branch)
    'Լրացնում է  "Հաճախորդի կոդ" դաշտը
    Call Rekvizit_Fill("Dialog",1 ,"General" ,"CLICODE" ,branch)
    'Լրացնում է "Ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Dialog",1 ,"General" ,"DATE" ,dateS)
    'Լրացնում է "Հաշվետվություն" դաշտը
    Call Rekvizit_Fill("Dialog",1 ,"General" ,"SUBREP" ,rep)
    'Լրացնում է "Մոդուլի տեսակ" դաշտը
    Call Rekvizit_Fill("Dialog",1 ,"General" ,"SSSUBSYSS" ,branch)
    'Լրացնում է "Ցույց տալ LCR և NSFR տվյալները" նշիչը
    Call Rekvizit_Fill("Dialog",1 ,"CheckBox" ,"SHOWLCRNSFR" ,trans)
    'Սեղմել "Կատարել" կոճակը
    Call ClickCmdButton(2 ,"Î³ï³ñ»É")
    
    BuiltIn.Delay(150000)   
    
    'Դասավորել ըստ ISN - ի
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").Keys("^3")
    BuiltIn.Delay(2000)
    Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").MoveFirst
    If Not Trim(Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").Columns.Item(2).Text) = "14909801" Then 
            Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").Keys("^3")
    End If  
    
    'Արտահանել EXCEL ֆայլը  
    Call Sys.Process("Asbank").VBObject("MainForm").VBObject("tbToolBar").Window("ToolbarWindow32", "", 1).ClickItem(27)        
    BuiltIn.Delay(2000)
    Sys.Process("EXCEL").Window("XLMAIN", "* - Excel", 1).Window("XLDESK", "", 1).Window("EXCEL7", "*", 1).Keys("[F12]")

    Builtin.Delay(2000)
    Sys.Process("EXCEL").Window("#32770", "Save As", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(Project.Path & "Stores\CB\Actual\soushi_liab.xlsx")
    Sys.Process("EXCEL").Window("#32770", "Save As", 1).Window("Button", "&Save", 1).Click()
   
    'Ð³Ù»Ù³ï»É »ñÏáõ EXCEL ý³ÛÉ»ñ
    Call CompareTwoExcelFiles(EPath1, EPath2,resultWorksheet)
    
    'Փակել ՀԾ - Բանկ համակարգը
    Call Close_AsBank()
    Call CloseAllExcelFiles()
    
End Sub