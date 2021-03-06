Option Explicit

'USEUNIT Library_Common
'USEUNIT Subsystems_SQL_Library
'USEUNIT OLAP_Library
'USEUNIT Constants

'Test Case N 122157

Sub LR_ACRA_Data()
  Dim fDATE, sDATE, attr, Date, Expected, Actual, arrIgnore
  Dim resultWorksheet, exists

  'Համակարգ մուտք գործել ADMIN օգտագործողով
  fDATE = "20240101"
  sDATE = "20140101"
  Call Initialize_AsBankQA(sDATE, fDATE)
  Login("ADMIN")
  Call Create_Connection()
  
'--------------------------------------
  Set attr = Log.CreateNewAttributes 
  attr.BackColor = RGB(0, 255, 255)
  attr.Bold = True
  attr.Italic = True
'--------------------------------------  
  Expected = Project.Path & "Stores\Loan Register\Expected_LRACRA.xlsx"
  Actual = Project.Path & "Stores\Loan Register\Actual_LRACRA.xlsx"
  resultWorksheet = Project.Path & "Stores\Loan Register\Result_LRACRA.xlsx"
  
      exists = aqFile.Exists(Actual)
    If exists Then
        aqFileSystem.DeleteFile(Actual)
    End If

  
  Call ChangeWorkspace(c_LoanRegACRA)
  wTreeView.DblClickItem("|ì³ñÏ³ÛÇÝ é»·Çëïñ ¨ ACRA|OLAP|ìè ¨ ACRA-Ç ïíÛ³Ý»ñ")
  Date = "110314"
  Call Rekvizit_Fill("Dialog", 1, "General", "STARTDATE", Date) 
  Call Rekvizit_Fill("Dialog", 1, "General", "ENDDATE", Date) 
  Call ClickCmdButton(2, "Î³ï³ñ»É")
  
  Call wMainForm.MainMenu.Click(c_Editor)
  Call wMainForm.PopupMenu.Click(c_MarkAll)
  
  Call wMainForm.MainMenu.Click(c_Opers)
  Call wMainForm.PopupMenu.Click(c_Folder & "|" & c_ExportToExcel)
  
  Sys.Process("EXCEL").Window("XLMAIN", "* - Excel", 1).Window("XLDESK", "", 1).Window("EXCEL7", "*", 1).Keys("[F12]")

  Builtin.Delay(2000)
  Sys.Process("EXCEL").Window("#32770", "Save As", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(Actual)
  Sys.Process("EXCEL").Window("#32770", "Save As", 1).Window("Button", "&Save", 1).Click()
  
'  Sys.Process("EXCEL").Window("XLMAIN", "Actual_LRACRA - Excel").Activate
'  Sys.Process("EXCEL").Window("XLMAIN", "Actual_LRACRA - Excel").Close
  
  'xls ֆայլերի համեմատում
'  ReDim arrIgnore(0)        
'  Call ComparisonTwoExcelFiles(Expected, Actual)
  'ü³ÛÉ»ñÇ Ñ³Ù»Ù³ïáõÙ 
  Call  CompareTwoExcelFiles(Expected, Actual, resultWorksheet)
  
  Call aqFileSystem.DeleteFile(Actual)
  Call Close_AsBank()
End Sub