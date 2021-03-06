Option Explicit
'USEUNIT Contract_Summary_Report_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT OLAP_Library

'Test Case Id 166004

Sub Contract_Summary_Report_Cashed_Credit_Check_Rows_Test()

    Dim expectedsumma,expectedexpSumma,expectedMoneyOut,expectedPercent,expectedexpPercent, expectedNotusePer,expectedunearnedPer,expectedexppenPercent,expectedPerOut,_
        expectedBTHD, expectedDgBthd,expectedpenSum,expectedpenPer,expectedCollateral,expectedOutPenPer, expectedGuarantee, expectedReservedSum,expectedNotUsedReserve,expectedLimit,expectedOutPen,_
        expectedNotUse, expectedContractSum,expectedGivenDayCount,expectedRepaymentDayCount, expectedRepDayCount,expectedExtStateDayCount,expectedExtendedDayCount,expectedPerRepDayCount,_
        expectedExtDayCount , expectedTotalExtDayCount,expectedConstExtDayCount,expectedExtPerDAyCount, expectedPresentSum
    Dim actualdsumma, actualexpSumma,actualMoneyOut,actualPercent,actualOutPen, actualexpPercent,actualNotusePer,actualunearnedPer,actualexppenPercent,actualPerOut,_
        actualBTHD,actualDgBthd,actualpenSum,actualpenPer,actualCollateral,actualGuarantee, actualReservedSum,actualNotUsedReserve ,actualLimit, actualNotUse,actualContractSum,_
        actualGivenDayCount,actualRepaymentDayCount,actualRepDayCount,actualExtStateDayCount, actualExtendedDayCount,actualPerRepDayCount,actualExtDayCount,actualTotalExtDayCount,_
        actualConstExtDayCount,actualExtPerDAyCount,actualPresentSum,actualOutPenPer
    Dim queryString, sql_Value, colNum, sql_isEqual, isExists, frmPttelProgress
    Dim startDATE, fDATE, Date, fBASE, EPath1, EPath2, arrIgnore
       
                           
    'Կատարում է ստուգում,եթե նման անունով ֆայլ կա տրված թղթապանակում ,ջնջում է
    isExists = aqFile.Exists(Project.Path & "Stores\Excel Files\vark1.xlsx")
    If isExists Then
       aqFileSystem.DeleteFile(Project.Path & "Stores\Excel Files\vark1.xlsx")
    End If
                        
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20111016"
    fDATE = "20240101"
    Date = "120314"
    queryString = "Delete from CAgrProfile where fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
    'Test StartUp start
    Call Initialize_AsBankQA(startDATE, fDATE)
    'Test StartUp end
 
    Call Create_Connection()
    Call Execute_SLQ_Query(queryString)
       
    expectedsumma = "15,477,774,658.59"
    expectedexpSumma = "53,625,550.57"
    expectedMoneyOut = "68,909,787.98"
    expectedPercent = "150,180,661.49"
    expectedexpPercent = "-14,467,965.53"
    expectedNotusePer = "39,394.51"
    expectedunearnedPer = "4,645,719,311.89"
    expectedexppenPercent = "52,876,341.91"
    expectedPerOut = "11,099,899.11"
    expectedBTHD = "2,092,915.85"
    expectedDgBthd = "1,887,327.07"
    expectedpenSum = "319,942.06"
    expectedpenPer = "11,249,004.98"
    expectedOutPen = "228,016.73"
    expectedOutPenPer = "6,288,796.93"
    expectedCollateral = "38,670,536,644.43"
    expectedGuarantee = "7,234,161,616.32"
    expectedReservedSum = "502,752,807.50"
    expectedNotUsedReserve = "2,013,535.42"
    expectedLimit = "20,583,328,505.00"
    expectedNotUse = "45,433,430.70"
    expectedContractSum = "20,683,863,505.00"
    expectedGivenDayCount = "3311677"
    expectedRepaymentDayCount = "2269908"
    expectedRepDayCount = "2224744"
    expectedExtStateDayCount = "38"
    expectedExtendedDayCount = "91"
    expectedPerRepDayCount = "69341"
    expectedExtDayCount = "9078"
    expectedTotalExtDayCount = "60347"
    expectedConstExtDayCount = "6684"
    expectedExtPerDAyCount = "8845"
    expectedPresentSum = "15,627,188,611.95"

    Call ChangeWorkspace(c_Subsystems)
    Call wTreeView.DblClickItem("Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ")
    Call wTreeView.DblClickItem("î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|ì³ñÏ»ñ (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ (ø»ß³íáñí³Í)")
    
    'Պայմանագրի ամփոփում(Քեշավերված) փաստաթղթի լրացում 
    Call  Contract_Sammary_Report_Fill_Cashed(Date,False,False,False,False,False,False,False)  
    'Waiting for frmPttel
    Set frmPttelProgress = AsBank.WaitVBObject("frmPttelProgress", 3000)
    While frmPttelProgress.Exists
      BuiltIn.Delay(delay_small) 
    Wend                                
   
         'Կատարում ենք SQL ստուգում    
         queryString = "select COUNT(*) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 3835
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
      
         queryString = "select SUM(fSumma) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 20683863505.00
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
       
         queryString = "select SUM(fR2) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 150180661.49
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
       
         queryString = "select SUM(fN0LIM) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 20583328505.00
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
      
         queryString = "select SUM(fR1) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 15477774658.59
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
        '       
         queryString = "select SUM(fBefLastDebtDays) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 2269908
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
       
         queryString = "select SUM(fN0PN1) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 78391.0997
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
       
         queryString = "select SUM(fN0PN2) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 83743.7395
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
       
         queryString = "select SUM(fR4) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 502752807.50
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
       
         queryString = "select SUM(fREff) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = -14467965.53
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
       
         queryString = "select SUM(fGuaranteeSum) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 7234161616.3246
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
       
         queryString = "select SUM(fPresentValue) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 15627188611.95
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
       
         queryString = "select SUM(fPresentValuePure) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 15613526749.06
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
       
         queryString = "select SUM(fPerSumFuture) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 4645719311.89
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
       
         queryString = "select SUM(fMortgageSum) from CAgrProfile where  fRepDate = '2014-03-12' and (fTypeName = 'C1Univer' or fTypeName = 'C1AS21'  or fTypeName = 'C1Disp')"
         sql_Value = 38670536644.4327
         colNum = 0
         sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
         If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
         End If
       
    'Ֆիլտրել օրերի քանակը
    Call wMainForm.MainMenu.Click("Դիտում |creditDayCount")   
       
    With wMDIClient.VBObject("frmPttel").VBObject("tdbgView")     
      actualdsumma = Trim(.Columns.Item(3).FooterText)
      actualexpSumma = Trim(.Columns.Item(4).FooterText)
      actualMoneyOut = Trim(.Columns.Item(5).FooterText)
      actualPercent = Trim(.Columns.Item(6).FooterText)
      actualexpPercent = Trim(.Columns.Item(7).FooterText)
      actualNotusePer = Trim(.Columns.Item(8).FooterText)
      actualunearnedPer = Trim(.Columns.Item(9).FooterText)
      actualexppenPercent = Trim(.Columns.Item(10).FooterText)
      actualPerOut = Trim(.Columns.Item(12).FooterText)
      actualBTHD = Trim(.Columns.Item(14).FooterText)
      actualDgBthd = Trim(.Columns.Item(15).FooterText)
      actualpenSum = Trim(.Columns.Item(16).FooterText)
      actualpenPer = Trim(.Columns.Item(17).FooterText)
      actualOutPen = Trim(.Columns.Item(18).FooterText)
      actualOutPenPer = Trim(.Columns.Item(19).FooterText)
      actualCollateral = Trim(.Columns.Item(27).FooterText)
      actualGuarantee = Trim(.Columns.Item(28).FooterText)
      actualReservedSum = Trim(.Columns.Item(38).FooterText)
      actualNotUsedReserve = Trim(.Columns.Item(39).FooterText)
      actualLimit = Trim(.Columns.Item(51).FooterText)
      actualNotUse = Trim(.Columns.Item(52).FooterText)
      actualContractSum = Trim(.Columns.Item(53).FooterText)
      actualGivenDayCount = Trim(.Columns.Item(69).FooterText)
      actualRepaymentDayCount = Trim(.Columns.Item(70).FooterText)
      actualRepDayCount = Trim(.Columns.Item(71).FooterText)
      actualExtStateDayCount = Trim(.Columns.Item(72).FooterText)
      actualExtendedDayCount = Trim(.Columns.Item(73).FooterText)
      actualPerRepDayCount = Trim(.Columns.Item(74).FooterText)
      actualExtDayCount = Trim(.Columns.Item(75).FooterText)
      actualTotalExtDayCount = Trim(.Columns.Item(76).FooterText)
      actualConstExtDayCount = Trim(.Columns.Item(77).FooterText)
      actualExtPerDAyCount = Trim(.Columns.Item(79).FooterText)
      actualPresentSum = Trim(.Columns.Item(113).FooterText)
    End With
    
    'Գումար սյան ստուգում
    If expectedsumma <> actualdsumma Then
      Log.Error("Dont match")
    End If
     
    'Ժանկետանց գումար սյան ստուգում
    If expectedexpSumma <> actualexpSumma Then
       Log.Error("Dont match")
    End If
     
    'Դուրս գրվաց գումար սյան ստուգում
    If expectedMoneyOut <> actualMoneyOut Then
       Log.Error("Dont match")
    End If
     
    'Տոկոս սյան ստուգում
    If expectedPercent <> actualPercent Then
       Log.Error("Dont match")
    End If
     
    'Արդյունավետ տոկոս սյան ստուգում
    If expectedexpPercent <> actualexpPercent Then
       Log.Error("Dont match")
    End If
     
    'Չօգտ. մաս տոկոս սյան ստուգում
    If expectedNotusePer <> actualNotusePer Then
       Log.Error("Dont match")
    End If
     
    'Ժամկետանց տոկոս սյան ստուգում
    If expectedunearnedPer <> actualunearnedPer Then
       Log.Error("Dont match")
    End If
     
    'ժամկետանց չօգտ. մասի տոկոս սյան ստուգում
    If expectedexppenPercent <> actualexppenPercent Then
       Log.Error("Dont match")
    End If
     
    'Դուրս գրված տոկոս սյան ստուգում
    If expectedPerOut <> actualPerOut Then
       Log.Error("Dont match")
    End If
     
    'ԲՏՀԴ տոկոս սյան ստուգում
    If expectedBTHD <> actualBTHD Then
       Log.Error("Dont match")
    End If
     
    'Դ.գ. ԲՏՀԴ  սյան ստուգում
    If expectedDgBthd <> actualDgBthd Then
       Log.Error("Dont match")
    End If
     
    'Ժամկետանց գումարի տույժ սյան ստուգում
    If expectedpenSum <> actualpenSum Then
       Log.Error("Dont match")
    End If
     
    'Ժամկետանց տոկոսի տույժ սյան ստուգում
    If expectedpenPer <> actualpenPer Then
       Log.Error("Dont match")
    End If
     
    'Դուրս գրված տույժ սյան ստուգում
    If expectedOutPen <> actualOutPen Then
       Log.Error("Dont match")
    End If
     
    'Դուրս գրված տոկ. տույժ սյան ստուգում
    If expectedOutPenPer <> actualOutPenPer Then
       Log.Error("Dont match")
    End If
     
    'Գրավի արժեք սյան ստուգում
    If expectedCollateral <> actualCollateral Then
       Log.Error("Dont match")
    End If
     
    'Երաշխավորության արժեք սյան ստուգում
    If expectedGuarantee <> actualGuarantee Then
       Log.Error("Dont match")
    End If
     
    'Պահուստավորված գումար սյան ստուգում
    If expectedReservedSum <> actualReservedSum Then
       Log.Error("Dont match")
    End If
     
    'Չօգտ. մասի պահ. սյան ստուգում
    If expectedNotUsedReserve <> actualNotUsedReserve Then
       Log.Error("Dont match")
    End If
     
    'Սահմանաչափ սյան ստուգում
    If expectedLimit <> actualLimit Then
       Log.Error("Dont match")
    End If
     
    'Չօգտ. մաս սյան ստուգում
    If expectedNotUse <> actualNotUse Then
       Log.Error("Dont match")
    End If
     
    'Պայմանագրի գումար սյան ստուգում
    If expectedContractSum  <> actualContractSum  Then
       Log.Error("Dont match")
    End If
     
    'Տ.օ.ք սյան ստուգում
    If expectedGivenDayCount <> actualGivenDayCount Then
       Log.Error("Dont match")
    End If
     
    'Մ.մ.օ.ք. սյան ստուգում
    If expectedRepaymentDayCount <> actualRepaymentDayCount Then
       Log.Error("Dont match")
    End If
     
    'Մ.մ.օ.ք.ա.մ.ժ. սյան ստուգում
    If expectedRepDayCount <> actualRepDayCount Then
       Log.Error("Dont match")
    End If
     
    'Երկ/վիճ. գ.օ.ք. սյան ստուգում
    If expectedExtStateDayCount <> actualExtStateDayCount Then
       Log.Error("Dont match")
    End If
     
    'Երկ. օ.ք. սյան ստուգում
    If expectedExtendedDayCount <> actualExtendedDayCount Then
       Log.Error("Dont match")
    End If
     
    'Տկ. մ.մ.օ.ք. սյան ստուգում
    If expectedPerRepDayCount <> actualPerRepDayCount Then
       Log.Error("Dont match")
    End If
     
    'Ժամկ.օ.ք. սյան ստուգում
    If expectedExtDayCount <> actualExtDayCount Then
       Log.Error("Dont match")
    End If
     
    'Ընդ.ժամկ.օ.ք. սյան ստուգում
    If expectedTotalExtDayCount <> actualTotalExtDayCount Then
       Log.Error("Dont match")
    End If
     
    'Անընդ. ժամկ.լ.ք. սյան ստուգում
    If expectedConstExtDayCount <> actualConstExtDayCount Then
       Log.Error("Dont match")
    End If
     
    'Տկ.ժ.օ.ք. սյան ստուգում
    If expectedExtPerDAyCount <> actualExtPerDAyCount Then
       Log.Error("Dont match")
    End If
     
    'Ներկա արժեք սյան ստուգում
    If expectedPresentSum <> actualPresentSum Then
       Log.Error("Dont match")
    End If
     
    'Ֆիլտրել սյուները 
    Call wMainForm.MainMenu.Click("Դիտում |RemoveColumn")
    BuiltIn.Delay(2000)
    Call Sys.Process("Asbank").VBObject("MainForm").VBObject("tbToolBar").Window("ToolbarWindow32", "", 1).ClickItem(27)
    'Save as EXCEL ֆայլը "Excel Files" թղթապանակում
    Dim strObjName,p,wnd
    strObjName = "Window(""XLMAIN"", ""* - Excel"")"
    Set p = Sys.Process("EXCEL")
    Sys.Process("EXCEL").Window("XLMAIN", "* - Excel", 1).Window("XLDESK", "", 1).Window("EXCEL7", "*", 1).Keys("[F12]")
    Sys.Process("EXCEL").Window("#32770", "Save As", 1).Window("DUIViewWndClassName", "", 1).Window("DirectUIHWND", "", 1).Window("FloatNotifySink", "", 1).Window("ComboBox", "", 1).Window("Edit", "", 1).Keys(Project.Path & "Stores\Excel Files\vark1.xlsx")
    Sys.Process("EXCEL").Window("#32770", "Save As", 1).Window("Button", "&Save", 1).Click()
     
    'Համեմատել EXCEL ֆայլերը
    EPath1 = Project.Path & "Stores\Excel Files\vark1.xlsx"
    EPath2 = Project.Path & "Stores\Excel Files\vark.xlsx"
    arrIgnore = Array("$A$1")
    Call ComparisonTwoExcelFilesWithCheck(EPath1, EPath2, arrIgnore)
    p.Close()
    wMDIClient.VBObject("frmPttel").Close()     
    Call Close_AsBank() 
    
End Sub 