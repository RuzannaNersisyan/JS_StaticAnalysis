Option Explicit
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Library_Colour

'__________________________________________________________________________
 '²ßË³ï»óÝ»É EXCEL -Á
'__________________________________________________________________________
Sub Initialize_Excel () 
    Dim IsOpen
    
    '÷³ÏáõÙ ¿ Íñ³·ÇñÁ ,»Ã» ³ÛÝ ³ñ¹»Ý µ³óí³Í ¿
    Call CloseAllExcelFiles()
    BuiltIn.Delay(3000)
 
    Set IsOpen = TestedApps.Items("EXCEL").Run
    If (Not IsOpen.Exists) Then
        Call Log.Error("EXCEL application not found")
        Exit Sub
    End If
    'IsOpen.Maximize()
End Sub

Sub Terminate_Excel()
    Dim ExcelWin
    Set ExcelWin = Sys.WaitProcess("EXCEL", 1000)
    Do While ExcelWin.Exists
        Call ExcelWin.Terminate()
        Set ExcelWin = Sys.WaitProcess("EXCEL", 1000)
    Loop
End Sub

Sub CloseAllExcelFiles()
    Dim exist,Count,i
    
    Count = 0
    exist = Sys.WaitProcess("EXCEL", 1000).Exists
    '÷³ÏáõÙ ¿ Íñ³·ÇñÁ ,»Ã» ³ÛÝ ³ñ¹»Ý µ³óí³Í ¿
    For i = 0 To 7
        If exist Then
            Count = Count + 1
            If Count = 4 Then
                Terminate_Excel()
            End If
            Sys.WaitProcess("EXCEL").Close
            BuiltIn.Delay(2000)
            exist = Sys.WaitProcess("EXCEL", 1000).Exists
        Else
            exist = False
        End IF
    Next
End Sub

'_______________________________________________________________________________________________________________________________________________________________________________________________________________________ 
' Î³ï³ñ»É ²ßË³ï³ÝùÇ ëÏÇ½µ
'_______________________________________________________________________________________________________________________________________________________________________________________________________________________
'userName - û·ï³·áñÍáÕ
'Passord - ·³ÕïÝ³µ³é
'DB1 - ïíÛ³ÉÝ»ñÇ Ñ»Ýù
Sub Start_Work(userName ,Passord,DB1)
      '²ÝóÝáõÙ Ï³ï³ñáõÙ ADD-INS ¿ç
    Sys.Process("EXCEL").Window("XLMAIN", "Book1 - Excel", 1).Window("EXCEL2", "", 2).ToolBar("Ribbon").Window("MsoWorkPane", "Ribbon", 1).Window("NUIPane", "", 1).Window("NetUIHWND", "", 1).Keys("~X" & "y6")
      'ê»ÕÙáõÙ ¿ ²ßË³ï³ÝùÇ ëÏÇ½µ
'	Builtin.Delay(2000)
'    Sys.Process("EXCEL").Window("XLMAIN", "Book1 - Excel", 1).Window("EXCEL2", "", 2).ToolBar("Ribbon").Window("MsoWorkPane", "Ribbon", 1).Window("NUIPane", "", 1).Window("NetUIHWND", "", 1).Keys("y4")
      'Èñ³óÝáõÙ ¿ ú·ï³·áñÍáÕ ¹³ßïÁ
    Sys.Process("EXCEL").WinFormsObject("LoginForm").WinFormsObject("TBLogin").Keys(username )
      'Èñ³óÝáõÙ ¿ ¶³ÕïÝ³µ³é ¹³ßïÁ
    Sys.Process("EXCEL").WinFormsObject("LoginForm").WinFormsObject("TBPassword").Keys(Passord  )
      'ÀÝïñáõÙ ¿ ïíÛ³ÉÝ»ñÇ µ³½³
    Sys.Process("EXCEL").WinFormsObject("LoginForm").WinFormsObject("DBList").ClickItem(DB1)
      'ê»ÕÙáõÙ ¿ Ï³ï³ñ»É Ïá×³ÏÁ
    Sys.Process("EXCEL").WinFormsObject("LoginForm").WinFormsObject("ButtonOk").Click()

'    Sys.Process("EXCEL").WinFormsObject("frmCheckVersion").WinFormsObject("ButtonOk").Click()
End Sub
 
'_________________________________________________________________________________________________________________________________________________________________________________________________________________
'´³ó»É Ñ³ßí»ïíáõÃÛ³Ý Ó¨³ÝÙáõß ïíÛ³ÉÝ»ñÇ å³ÑáóÇó
'_________________________________________________________________________________________________________________________________________________________________________________________________________________
'i - ïáÕ
'j - »ÝÃ³ïáÕ
Sub Open_Accountanty(i,j)
      
      '²ÝóÝáõÙ Ï³ï³ñáõÙ ADD-INS ¿ç
    Sys.Process("EXCEL").Window("XLMAIN", "Book1 - Excel", 1).Window("EXCEL2", "", 2).ToolBar("Ribbon").Window("MsoWorkPane", "Ribbon", 1).Window("NUIPane", "", 1).Window("NetUIHWND", "", 1).Keys("~X" & "y4")
      'ê»ÕÙáõÙ ¿ ´³ó»É Ïá×³ÏÁ
'    Sys.Process("EXCEL").Window("XLMAIN", "Book1 - Excel", 1).Window("EXCEL2", "", 2).ToolBar("Ribbon").Window("MsoWorkPane", "Ribbon", 1).Window("NUIPane", "", 1).Window("NetUIHWND", "", 1).Keys("y2")
      'ÀÝïñáõÙ ¿ Ñ³ßí»ïíáõÃÛ³Ý ß³µÉáÝÁ 
    Sys.Process("EXCEL").WinFormsObject("FrmTemplates").WinFormsObject("TreeView1").wItems.Item(i).Items.Item(j).DblClick
End Sub

'___________________________________________________________________________________________________
'Ð³ßí³ñÏ»É Ñ³ßí»ïíáõÃÛáõÝÁ LCR ¨ NSFR Ñ³ßí»ïíáõÃÛáõÝÝ»ñÇ Ñ³Ù³ñ
'____________________________________________________________________________________________________
'windExists - ëï³ÝáõÙ ¿ True,»Ã» å³ïáõÑ³ÝÁ µ³óí»É ¿ ¨  False  Ñ³Ï³é³Ï ¹»åùáõÙ
'CurrDAte - ÀÝÃ³óÇÏ ³Ùë³ÃÇí
'Startdate - Ð³ßí»ïáõ Å³Ù³Ý³Ï³ßñç³ÝÇ ëÏÇ½µ
'EndDate - Ð³ßí»ïáõ Å³Ù³Ý³Ï³ßñç³ÝÇ ³í³ñï
'AccNumber - Ñ³ßí³ñÏ³ÛÇÝ åÉ³ÝÇ N
'TreeLevel - Í³éÇ Ù³Ï³ñ¹³Ï
'CBranch - Ù³ëÝ³×áõÕ
'Language - ³ßË³ï³Ýù³ÛÇÝ É»½áõ
'Thousand- Ñ³½³ñ ¹ñ³Ùáí
'RequesQuery-Ñ³ñóÙ³Ý ï¨áÕáõÃÛáõÝ
'param - Excel ý³ÛÉÇ ³ÝáõÝÁ
Sub Calculate_Report_Range_LCR_NSFR(windExists,CurrDate,StartDate,EndDate,AccNumber ,TreeLevel,CBranch,Language ,Thousand,RequesQuery,param)
  
        '²ÝóÝáõÙ Ï³ï³ñáõÙ ADD-INS ¿ç
       Sys.Process("EXCEL").Window("XLMAIN", "" & param &" - Excel", 1).Window("EXCEL2", "", 2).ToolBar("Ribbon").Window("MsoWorkPane", "Ribbon", 1).Window("NUIPane", "", 1).Window("NetUIHWND", "", 1).Keys("~X" & "Y5")
        'ê»ÕÙáõÙ ¿ Ð³ßí³ñÏ»É Ïá×³ÏÁ
      ' Sys.Process("EXCEL").Window("XLMAIN", "" & param &" - Excel", 1).Window("EXCEL2", "", 2).ToolBar("Ribbon").Window("MsoWorkPane", "Ribbon", 1).Window("NUIPane", "", 1).Window("NetUIHWND", "", 1).Keys("Y5")
      
       If windExists Then 
        'ÀÝïñ»É Ð³ßí³ñÏ»É µáÉáñ ¿ç»ñÁ
       Sys.Process("EXCEL").WinFormsObject("CalculationOptionsForm").WinFormsObject("CalculateAll").Click()
        'ê»ÕÙ»É Î³ï³ñ»É Ïá×³ÏÁ
       Sys.Process("EXCEL").WinFormsObject("CalculationOptionsForm").WinFormsObject("ButtonOk").Click()
    
       End if
        'Èñ³óÝ»É ÁÝÃ³óÇÏ ³Ùë³ÃÇí ¹³ßïÁ
    If Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("DTPCurrentDate").WinFormsObject("MTextBox").Enabled Then
       Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("DTPCurrentDate").WinFormsObject("MTextBox").Keys(CurrDate)
    End If
   
        'Èñ³óÝ»É Ð³ßí»ïáõ Å³Ù³Ï³Ý³ßñç³Ý (ëÏÇ½µ) ¹³ßïÁ
    If  Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("DTPPeriodBegin").WinFormsObject("MTextBox").Enabled Then
        Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("DTPPeriodBegin").WinFormsObject("MTextBox").Keys(StartDate)
    End If
    
        'Èñ³óÝ»É Ð³ßí»ïáõ Å³Ù³Ï³Ý³ßñç³Ý (³í³ñï) ¹³ßïÁ
    If  Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("DTPPeriodEnd").WinFormsObject("MTextBox").Enabled Then
        Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("DTPPeriodEnd").WinFormsObject("MTextBox").Keys(EndDate)   
    End If
    
        'Èñ³óÝ»É Ð³ßí³ñÏ³ÛÇÝ åÉ³ÝÇ N ¹³ßïÁ
        Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("spinBalNum").WinFormsObject("UpDownEdit", "").SetText(AccNumber)
      
        'Èñ³óÝ»É Ì³éÇ Ù³Ï³ñ¹³Ï¹³ßïÁ
    If Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("spLevel").WinFormsObject("UpDownEdit", "").Enabled Then
       Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("spLevel").WinFormsObject("UpDownEdit", "").SetText(Treelevel)
    End If 
     
        'Èñ³óÝ»É Ø³ëÝ³×áõÕ Ù³Ï³ñ¹³Ï¹³ßïÁ
       Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("cmbBranches").Keys(CBranch )
        'Èñ³óÝ»É ²ßË³ï³Ýù³ÛÇÝ É»½áõ Ù³Ï³ñ¹³Ï¹³ßïÁ
       Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("cmbLang").ClickItem(Language)
        'Èñ³óÝ»É Ð³½³ñ ¹ñ³Ùáí Ù³Ï³ñ¹³Ï¹³ßïÁ
       Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("chkPrecision").wState = Thousand
        'Èñ³óÝ»É Ð³ñóÙ³Ý ï¨áÕáõÃÛáõÝ Ù³Ï³ñ¹³Ï¹³ßïÁ
       Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("spQueryTimeout").WinFormsObject("UpDownEdit", "").SetText(RequesQuery)
        'ê»ÕÙ»É Ï³ï³ñ»É Ïá×³ÏÁ
       Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("ButtonOk").Click()
End Sub

'________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
'ä³Ñ»É ëï»ÕÍí³Í Ñ³ßí»ïíáõÃÛáõÝÁ Actiual_OLAP ÃÕÃ³å³Ý³ÏáõÙ
'______________________________________________________________________________________________________________________________________________________________________________________________________________________________________
'SPath - ×³Ý³å³ñÑ
'param - Excel  ÷³ëï³ÃÕÃÇ Ñ³Ù³ñÁ
Sub Save_To_Folder(SPath,param,Cont)

    'ê»ÕÙ»É F12
  Sys.Process("EXCEL").Window("XLMAIN", "" & param & "  [Compatibility Mode] - Excel", 1).Keys("[F12]") 
    'Èñ³óÝ»Ù File name ¹³ßïÁ
  Sys.Process("EXCEL").Window("#32770", "Save As", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(SPath & "\" & param) 
    'ê»ÕÙ»É Save Ïá×³ÏÁ
  Sys.Process("EXCEL").Window("#32770", "Save As", 1).Window("Button", "&Save", 1).Click()
  If Cont Then
    Call Sys.Process("EXCEL").Window("NUIDialog").Window("NetUIHWND").Click(267, 270)
  End If

  BuiltIn.Delay(7000)
End Sub

'_________________________________________________________________________________________________________________________________________________________________________________________
'Համեմատել երկու EXCEL ֆայլերի բոլոր sheet-երը
'_________________________________________________________________________________________________________________________________________________________________________________________
'path1 - առաջին EXCEL ֆայլի հասցեն
'path2 - երկրորդ EXCEL ֆայլի հասցեն
'resultWorksheet(i) - սխալ լինելու դեպքում որտեղ է պահվելու տարբերությունների excel-ը 
Sub CompareTwoExcelFiles(path1, path2, resultWorksheet)

  Dim excelMacroPath, objExcel, compareWorkbook, differenceCount
  Dim workBook1, workBook2, i, postfix 
  
  excelMacroPath = Project.Path & "Stores\ExcelComparison\compareExcel.xlsm" 
  ' """C:\Users\release\Desktop\TestsAsBank\TestsAsBank_TC12\AsBank\Stores\ExcelComparison\compareExcel.xlsm""
  Set objExcel = CreateObject("Excel.application")
  objExcel.Visible = True
  Delay(8000)  
  Log.Message "First excel file is " & path1,,,DivideColor  
  Log.Message "Second excel file is " & path2,,,DivideColor
  Set workBook1 = objExcel.Workbooks.Open(path1)
  Delay(8000) 
  Set workBook2 = objExcel.Workbooks.Open(path2)
  Delay(8000) 
  Set compareWorkbook = objExcel.workbooks.open(excelMacroPath, 0 , True)
  If workBook1.sheets.Count <> workBook2.sheets.Count Then 
    Log.Error "Sheet counts are diferent. Count of sheets of " & path1 & " is " & workBook1.sheets.Count & " Count of sheets of " & path2 & " is " & workBook2.sheets.Count ,,,ErrorColor
  End If
  If workBook1.sheets.Count = 1 Then 
    differenceCount = objExcel.Run("CompareOpenedWorkSheets", workBook1.Worksheets(1), workBook2.Worksheets(1), resultWorkSheet)
    If differenceCount = 0 Then 
      Log.Message " Excel files are the same",,,MessageColor    
    Else 
      Log.Error "There are " & differenceCount & " different cells",,,ErrorColor
      Log.Error "Difference excel file is " & resultWorksheet,,,ErrorColor
    End If
  Else 
    For i = 1 To workBook1.sheets.Count
      differenceCount = objExcel.Run("CompareOpenedWorkSheets", workBook1.Worksheets(i), workBook2.Worksheets(i), resultWorkSheet(i))
      If differenceCount = 0 Then 
        Log.Message i & " sheets are the same",,,MessageColor    
      Else 
        Log.Error "There are " & differenceCount & " different cells in " & i & " sheet",,,ErrorColor
        Log.Error "Difference excel file is " & resultWorksheet(i),,,ErrorColor
      End If
    Next 
  End If  
  
  workBook1.Application.DisplayAlerts = False 
  workBook2.Application.DisplayAlerts = False 
'  workBook1.Save
'  workBook2.Save
  
  workBook1.Close
  workBook2.Close
  compareWorkbook.Close     
  objExcel.quit
  Set objExcel=nothing

End Sub

'_________________________________________________________________________________________________________________________________________________________________________________________
'Համեմատել երկու EXCEL ֆայլեր,որոնք ունեն մեկ sheet
'_________________________________________________________________________________________________________________________________________________________________________________________
'EPath1 - առաջին EXCEL ֆայլի հասցեն
'EPath2 - երկրորդ EXCEL ֆայլի հասցեն
'arrIgnore() - անտեսվող բջիջների զանգված
Sub ComparisonTwoExcelFilesWithCheck(EPath1, EPath2, arrIgnore())

    Dim objExcel,objWorkbook1,objWorkbook2,objWorksheet1,objWorksheet2, cell
    Dim i, IgnoreCell
    
    Set objExcel = CreateObject("Excel.application")
        objExcel.Visible = True
    Set objWorkbook1 = objExcel.workbooks.open(EPath1)
    Set objWorkbook2 = objExcel.workbooks.open(EPath2)

    Set objWorksheet1 = objWorkbook1.worksheets(1)
    Set objWorksheet2 = objWorkbook2.worksheets(1)
     
    IgnoreCell = False 
    For Each cell In objWorksheet1.UsedRange
     For i = 0 To UBound(arrIgnore)
      If cell.Address = arrIgnore(i)  Then
        IgnoreCell = True
       End If
     Next
   
     If cell.Value <> objWorksheet2.Range(cell.Address).Value And IgnoreCell = False Then
       Log.Error("Expected value  =   " & objWorksheet1.Range(cell.Address).Value & "  in  " &  cell.Address )
     End If
     IgnoreCell = False
    Next
 
    objWorkbook1.close
    objWorkbook2.close
    objExcel.quit
    set objExcel=nothing
    
End Sub

'___________________________________________________________________________________________________
'Ð³ßí³ñÏ»É Ñ³ßí»ïíáõÃÛáõÝÁ
'____________________________________________________________________________________________________
'windExists - ëï³ÝáõÙ ¿ True,»Ã» å³ïáõÑ³ÝÁ µ³óí»É ¿ ¨  False  Ñ³Ï³é³Ï ¹»åùáõÙ
'CurrDAte - ÀÝÃ³óÇÏ ³Ùë³ÃÇí
'Startdate - Ð³ßí»ïáõ Å³Ù³Ý³Ï³ßñç³ÝÇ ëÏÇ½µ
'EndDate - Ð³ßí»ïáõ Å³Ù³Ý³Ï³ßñç³ÝÇ ³í³ñï
'AccNumber - Ñ³ßí³ñÏ³ÛÇÝ åÉ³ÝÇ N
'TreeLevel - Í³éÇ Ù³Ï³ñ¹³Ï
'CBranch - Ù³ëÝ³×áõÕ
'Language - ³ßË³ï³Ýù³ÛÇÝ É»½áõ
'Thousand- Ñ³½³ñ ¹ñ³Ùáí
'RequesQuery-Ñ³ñóÙ³Ý ï¨áÕáõÃÛáõÝ
'param - Excel ý³ÛÉÇ ³ÝáõÝÁ
Sub Calculate_Report_Range(windExists,CurrDate,StartDate,EndDate,AccNumber ,TreeLevel,CBranch,Language ,Thousand,RequesQuery,param)
  
    '²ÝóÝáõÙ Ï³ï³ñáõÙ ADD-INS ¿ç
    Sys.Process("EXCEL").Window("XLMAIN", "" & param & "  [Compatibility Mode] - Excel", 1).Window("EXCEL2", "", 2).ToolBar("Ribbon").Window("MsoWorkPane", "Ribbon", 1).Window("NUIPane", "", 1).Window("NetUIHWND", "", 1).Keys("~X" & "Y5")
      'ê»ÕÙáõÙ ¿ Ð³ßí³ñÏ»É Ïá×³ÏÁ
 '   Sys.Process("EXCEL").Window("XLMAIN", "" & param & "  [Compatibility Mode] - Excel", 1).Window("EXCEL2", "", 2).ToolBar("Ribbon").Window("MsoWorkPane", "Ribbon", 1).Window("NUIPane", "", 1).Window("NetUIHWND", "", 1).Keys("Y5")
     
    If windExists  Then
        'ÀÝïñ»É Ð³ßí³ñÏ»É µáÉáñ ¿ç»ñÁ
        Sys.Process("EXCEL").WinFormsObject("CalculationOptionsForm").WinFormsObject("CalculateAll").Click()
        'ê»ÕÙ»É Î³ï³ñ»É Ïá×³ÏÁ
       Sys.Process("EXCEL").WinFormsObject("CalculationOptionsForm").WinFormsObject("ButtonOk").Click()
        
    End If
    
    Sys.Process("EXCEL").Refresh
    
     'Èñ³óÝ»É ÁÝÃ³óÇÏ ³Ùë³ÃÇí ¹³ßïÁ
    If Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("DTPCurrentDate").WinFormsObject("MTextBox").Enabled Then
         Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("DTPCurrentDate").WinFormsObject("MTextBox").Keys(CurrDate)
     End If
   
      'Èñ³óÝ»É Ð³ßí»ïáõ Å³Ù³Ï³Ý³ßñç³Ý (ëÏÇ½µ) ¹³ßïÁ
    If  Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("DTPPeriodBegin").WinFormsObject("MTextBox").Enabled Then
        Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("DTPPeriodBegin").WinFormsObject("MTextBox").Keys(StartDate)
    End If
    
      'Èñ³óÝ»É Ð³ßí»ïáõ Å³Ù³Ï³Ý³ßñç³Ý (³í³ñï) ¹³ßïÁ
    If  Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("DTPPeriodEnd").WinFormsObject("MTextBox").Enabled Then
      Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("DTPPeriodEnd").WinFormsObject("MTextBox").Keys(EndDate)   
    End If
    
      'Èñ³óÝ»É Ð³ßí³ñÏ³ÛÇÝ åÉ³ÝÇ N ¹³ßïÁ
    If  Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("spinBalNum").WinFormsObject("UpDownEdit", "").Enabled Then
      Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("spinBalNum").WinFormsObject("UpDownEdit", "").SetText(AccNumber)
    End If  
      'Èñ³óÝ»É Ì³éÇ Ù³Ï³ñ¹³Ï¹³ßïÁ
    If Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("spLevel").WinFormsObject("UpDownEdit", "").Enabled Then
       Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("spLevel").WinFormsObject("UpDownEdit", "").SetText(Treelevel)
     End If 
     
      'Èñ³óÝ»É Ø³ëÝ³×áõÕ Ù³Ï³ñ¹³Ï¹³ßïÁ
    Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("cmbBranches").Keys(CBranch )
      'Èñ³óÝ»É ²ßË³ï³Ýù³ÛÇÝ É»½áõ Ù³Ï³ñ¹³Ï¹³ßïÁ
    Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("cmbLang").ClickItem(Language)
      'Èñ³óÝ»É Ð³½³ñ ¹ñ³Ùáí Ù³Ï³ñ¹³Ï¹³ßïÁ
    Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("chkPrecision").wState = Thousand
      'Èñ³óÝ»É Ð³ñóÙ³Ý ï¨áÕáõÃÛáõÝ Ù³Ï³ñ¹³Ï¹³ßïÁ
    Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("spQueryTimeout").WinFormsObject("UpDownEdit", "").SetText(RequesQuery)
      'ê»ÕÙ»É Ï³ï³ñ»É Ïá×³ÏÁ
    Sys.Process("EXCEL").WinFormsObject("OptionsForm").WinFormsObject("ButtonOk").Click()

End Sub

'________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
'ä³Ñ»É ëï»ÕÍí³Í Ñ³ßí»ïíáõÃÛáõÝÁ Actiual_OLAP ÃÕÃ³å³Ý³ÏáõÙ
'______________________________________________________________________________________________________________________________________________________________________________________________________________________________________
'SPath - ×³Ý³å³ñÑ
'param - Excel  ÷³ëï³ÃÕÃÇ Ñ³Ù³ñÁ
Sub Save_To_Folder_LCR(SPath,param) 
    'ê»ÕÙ»É F12
 Sys.Process("EXCEL").Window("XLMAIN", "" & param & " - Excel", 1).Window("XLDESK", "", 1).Window("EXCEL7", "" & param & "", 1).Keys("[F12]") 
    'Èñ³óÝ»Ù File name ¹³ßïÁ
  Sys.Process("EXCEL").Window("#32770", "Save As", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(SPath & "\" & param) 
    'ê»ÕÙ»É Save Ïá×³ÏÁ
  Sys.Process("EXCEL").Window("#32770", "Save As", 1).Window("Button", "&Save", 1).Click()
End Sub

Sub Find_Group_and_Export(groupName,DateS,DateE,expOlap,expTXT)
    'Ավանդային պայմանագրերից ընտրում է որև մեկը կախված colItem պարամետրից
      Do Until Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").EOF    
        If Trim(Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").Columns.Item(0).Text) = groupName  Then
            Call Sys.Process("Asbank").VBObject("MainForm").MainMenu.Click(c_AllActions)
            Call Sys.Process("Asbank").VBObject("MainForm").PopupMenu.Click(c_Export) 
            Call Rekvizit_Fill("Dialog",1,"General","STARTDATE",DateS)  
            Call Rekvizit_Fill("Dialog",1,"General","ENDDATE",DateE) 
            Call Rekvizit_Fill("Dialog",1,"CheckBox","TOOLAP",expOlap) 
            Call Rekvizit_Fill("Dialog",1,"CheckBox","TOTEXT",expTXT)
            Call ClickCmdButton(2,"Î³ï³ñ»É")
            BuiltIn.Delay(70000)             
          Exit Do        
        Else
          Call Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").MoveNext
        End If    
      Loop  
End Sub

'_____________________________________________________________________________________________________________________________________________
'²í»É³óÝ»É OLAPAddIn -Á 
'_____________________________________________________________________________________________________________________________________________
Sub AddOLAPAddIn ()
      '²ÝóÝáõÙ Ï³ï³ñáõÙ ADD-INS ¿ç
    Sys.Process("EXCEL").Window("XLMAIN", "Book1 - Excel", 1).Window("EXCEL2", "", 2).ToolBar("Ribbon").Window("MsoWorkPane", "Ribbon", 1).Window("NUIPane", "", 1).Window("NetUIHWND", "", 1).Keys("~F")
      'ê»ÕÙáõÙ ¿ ²ßË³ï³ÝùÇ ëÏÇ½µ
    Sys.Process("EXCEL").Window("XLMAIN", "Book1 - Excel", 1).Window("FullpageUIHost", "", 1).Window("NetUIHWND", "", 1).Keys("~T")
          '²ÝóÝáõÙ Ï³ï³ñáõÙ ADD-INS ¿ç
    Sys.Process("EXCEL").Window("NUIDialog", "Excel Options", 1).Keys("^A")
      'ê»ÕÙáõÙ ¿ ²ßË³ï³ÝùÇ ëÏÇ½µ
    Sys.Process("EXCEL").Window("NUIDialog", "Excel Options", 1).Keys("^A")
    
    Sys.Process("EXCEL").Window("NUIDialog", "Excel Options", 1).Keys("[Tab][Tab][Tab]")
    
    Sys.Process("EXCEL").Window("NUIDialog", "Excel Options", 1).Keys("![Down]")
     
    Sys.Process("EXCEL").Window("NUIDialog", "Excel Options", 1).Keys("[Down][Enter]")
  
    Sys.Process("EXCEL").Window("NUIDialog", "Excel Options", 1).Keys("[Tab][Enter]")
    
    Sys.Process("EXCEL").Window("bosa_sdm_XL9", "COM Add-Ins", 1).Keys("[Up][Up][Up]")
    Sys.Process("EXCEL").Window("bosa_sdm_XL9", "COM Add-Ins", 1).Keys("[NumPlus]")
    Sys.Process("EXCEL").Window("bosa_sdm_XL9", "COM Add-Ins", 1).Keys("[Enter]")
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''GoTo_Report24_New''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Պրոցեդուրան բացում է 24 ԿԲ համվետվությունը
' Հաշվետվություն դրամական միջոցների փոխանցումների վերաբերյալ
' startDate - Ժամանակահատված սկզբնական
' endDate - Ժամանակահատված վերջնական
' foreignTransacts - Բանկերի միջոցով արտերկրից մուտք եղած և արտերկիր ուղարկված
'                    գումարների վերաբերյան նշիչ
' internalTransacts - Բանկերի միջոցով կատարված ներքին փոխանցումների
'                     վերաբերյալ նշիչ
Sub GoTo_Report24_New(startDate, endDate, foreignTransacts, internalTransacts)
    Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î´ Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|24 Ð³ßí»ïíáõÃÛáõÝ ¹ñ³Ù³Ï³Ý ÙÇçáóÝ»ñÇ ÷áË³ÝóáõÙÝ»ñÇ í»ñ³µ»ñÛ³É")
    If p1.WaitvbObject("frmAsUstPar", 3000).Exists Then
        ' Ժամանակահատված սկզբնական դաշտի լրացում
        Call Rekvizit_Fill("Dialog", 1, "General", "SDATE", startDate)
        ' Ժամանակահատված վերջնական դաշտի լրացում
        Call Rekvizit_Fill("Dialog", 1, "General", "EDATE", endDate)
        ' Բանկերի միջոցով արտերկրից մուտք եղած և արտերկիր ուղարկված գումարների վերաբերյան նշիչի լրացում
        Call Rekvizit_Fill("Dialog", 1, "CheckBox", "PAGE1", foreignTransacts)
        ' Բանկերի միջոցով կատարված ներքին փոխանցումների վերաբերյան նշիչի լրացում
        Call Rekvizit_Fill("Dialog", 1, "CheckBox", "PAGE2", internalTransacts)
        Call ClickCmdButton(2, "Î³ï³ñ»É")
    Else 
        Log.Error "Can't find frmAsUstPar window.", "", pmNormal, ErrorColor    
    End If
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''ExportToOlap'''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Հաշվետվությունների արտահանում պատուհանի լրացման կլաս
Class ExportToOlap
    Public expToOlap 
    Public expToTxt
    Public expRowCount
    Public export()
    Public groupCode()
    Public name()
    Public lastExport()
    Public startDate()
    Public endDate()
    Public daily()
    Private Sub Class_Initialize()
        expToOlap = 1
        expToTxt = 0
        expRowCount = export_count
        Redim export(expRowCount)
        Redim groupCode(expRowCount)
        Redim name(expRowCount)
        Redim lastExport(expRowCount)
        Redim startDate(expRowCount)
        Redim endDate(expRowCount)
        Redim daily(expRowCount)
    End Sub
End Class

Function New_ExportToOlap(rowCount)
    export_count = rowCount
    Set New_ExportToOlap = New ExportToOlap
End Function

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''Fill_Report_Export''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' Հաշվետվությունների արտահանում պատուհանի լրացման ֆունկցիա
' toOlap - ExportToOlap կլասի օբյեկտ
Sub Fill_Report_Export(toOlap)
    Dim i, rowNum
    
    ' Հաշվետվությունների արտահանում OLAP
    Call Rekvizit_Fill("OLAPExport", 1, "CheckBox", "Check1", toOlap.expToOlap)
    ' Հաշվետվությունների արտահանում TXT
    Call Rekvizit_Fill("OLAPExport", 1, "CheckBox", "Check2", toOlap.expToTxt)
    For i = 0 to toOlap.expRowCount - 1
        If Search_In_Grid(1, "OLAP", 1, toOlap.groupCode(i)) Then 
            ' Ստանալ գտնված խմբի տողի համարը 
            rowNum = Get_Cell_Row_Grid (1, "OLAP", 1, toOlap.groupCode(i))
            ' Ստուգել Անվանում սյան արժեքը
            Call Check_Value_Grid (2, rowNum, "OLAP", 1, toOlap.name(i))
            ' Ստուգել Վերջ. արտ. սյան արժեքը
            Call Check_Value_Grid (3, rowNum, "OLAP", 1, toOlap.lastExport(i))
            ' Լրացնել Սկիզբ սյան արժեքը
            Call Fill_Grid_Field(4, rowNum, "OLAP", "General", 1, toOlap.startDate(i))
            ' Լրացնել Վերջ սյան արժեքը
            Call Fill_Grid_Field(5, rowNum, "OLAP", "General", 1, toOlap.endDate(i))
            ' Նշել նշված օր. նշիչը
            Call Fill_Grid_Field(6, rowNum, "OLAP", "CheckBox", 1, toOlap.daily(i))
            ' Նշել արտահանման նշիչը
            Call Fill_Grid_Field(0, rowNum, "OLAP", "CheckBox", 1, toOlap.export(i))
        Else
            Log.Error "Can't find row with " & groupCode(i) & " group code.", "", pmNormal, ErrorColor
        End If
    Next 
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''Report14''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' 14 §խոշոր¦ փոխառուներ հաշվետվություն մուտք գործելու լրացման կլաս
Class Report14
    Public startDate
    Public endDate
    Public office
    Public calculateFund
    Public fund
    Public waitingTime
    Private Sub Class_Initialize()
        startDate = ""
        endDate = ""
        office = ""
        calculateFund = false
        fund = ""
        waitingTime = 15000
    End Sub
End Class

Function New_Report14()
    Set New_Report14 = New Report14 
End Function

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''Fill_Report14''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' 14 §խոշոր¦ փոխառուներ հաշվետվության ֆիլտրի լրացման պրոցեդուրա
' repo14 - հաշվետվություն մուտք գործելու պատուհանի լրացման կլաս
Sub Fill_Report14(repo14)
    ' Ժամանակահատված սկզբնական դաշտի լրացում
    Call Rekvizit_Fill("Dialog", 1, "General", "DATEBEG", repo14.startDate)
    ' Ժամանակահատված վերջնական դաշտի լրացում
    Call Rekvizit_Fill("Dialog", 1, "General", "DATEEND", repo14.endDate)
    ' Գրասենյակ դաշտի լրացում
    Call Rekvizit_Fill("Dialog", 1, "General", "BRANCH", repo14.office)
    ' Հաշվարկել §Կապիտալը¦ նշիչի լրացում
    Call Rekvizit_Fill("Dialog", 1, "CheckBox", "CALCCAPITAL", repo14.calculateFund)
    ' Կապիտալ (1000 դրամ) դաշտի լրացում
    Call Rekvizit_Fill("Dialog", 1, "General", "DCAPITAL", repo14.fund)
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''GoTo_Report14''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' 14 §խոշոր¦ փոխառուներ հաշվետվություն մուտք գործելու պրոցեդուրա
' repo14 - հաշվետվություն մուտք գործելու պատուհանի լրացման կլաս
Sub GoTo_Report14(repo14)
    Call wTreeView.DblClickItem("|ºÝÃ³Ñ³Ù³Ï³ñ·»ñ (§ÐÌ¦)|Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ|Î´ Ñ³ßí»ïíáõÃÛáõÝÝ»ñ|14 §Êáßáñ¦ ÷áË³éáõÝ»ñ")
    If p1.WaitVBObject("frmAsUstPar", 3000).Exists Then
        Call Fill_Report14(repo14)
        Call ClickCmdButton(2, "Î³ï³ñ»É")
        If Not wMDIClient.WaitVBObject("FrmSpr", repo14.waitingTime).Exists Then
            Log.Error "Can't open FrmSpr widow.", "", pmNormal, ErrorColor
        End If
    Else 
        Log.Error "Can't open frmAsUstPar widow.", "", pmNormal, ErrorColor
    End If   
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''OLAP_Export'''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' OLAP Խմբերի արտահանման կլաս
Class OLAP_Export
    Public dateStart
    Public dateEnd
    Public exportOLAP
    Public exportText
    Public waitingTime
    Private Sub Class_Initialize()
        dateStart = ""
        dateEnd = ""
        exportOLAP = 0
        exportText = 0
        waitingTime = 150000
    End Sub
End Class 

Function New_OLAP_Export()
    Set New_OLAP_Export = New OLAP_Export
End Function

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''Fill_OLAP_Group_Export'''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' OLAP Խմբերի արտահանում ֆիլտրի լրացում 
' export - Արտահանման պատուհանի լրացման կլաս
Sub Fill_OLAP_Group_Export(export)
    Call Rekvizit_Fill("Dialog", 1, "General", "STARTDATE", export.dateStart)
    Call Rekvizit_Fill("Dialog", 1, "General", "ENDDATE", export.dateEnd)
    Call Rekvizit_Fill("Dialog", 1, "CheckBox", "TOOLAP", export.exportOLAP)
    Call Rekvizit_Fill("Dialog", 1, "CheckBox", "TOTEXT", export.exportText)
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''OLAP_Group_Export''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' OLAP Խմբերի արտահանում գործողություն 
' exportWin - Արտահանման պատուհանի լրացման կլաս
Sub OLAP_Group_Export(exportWin)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_Export)
    If p1.WaitVBObject("frmAsUstPar", 3000).Exists Then
        Call Fill_OLAP_Group_Export(exportWin)
        Call ClickCmdButton(2, "Î³ï³ñ»É")
        If p1.WaitVBObject("frmAsMsgBox", exportWin.waitingTime).Exists Then
            Call MessageExists(2, "²ñï³Ñ³ÝáõÙÁ ³í³ñïí³Í ¿")
            Call ClickCmdButton(5, "OK")
        Else 
            Log.Error "Can't open frmAsMsgBox widow.", "", pmNormal, ErrorColor
        End If
    Else 
        Log.Error "Can't open frmAsUstPar widow.", "", pmNormal, ErrorColor
    End If
End Sub