Option Explicit
'USEUNIT Contract_Summary_Report_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Library_Common
'USEUNIT Constants

'Test Case Id 166003

Sub Contract_Summary_Report_Cashed_Arjetxteri_Sale_Check_Rows_Test()

    Dim expectedsumma, expectedPercent, expectedarjetxter, expectedContractSum, expectedGivenDayCount, expectedRepaymentDayCount, expectedRepDayCount, expectedExtStateDayCount, expectedCostCorrection, expectedBuyCost, expectedNominalCost,_
        expectedTotalExtDayCount, expectedConstExtDayCount, expectedSaleBuyCost, expectedSaleCost, expectedReserveRepo, expectedSale, expectedSalePer
    Dim actualSaleCost, actualNominalCost, actualsumma, actualPercent, actualBuyCost, actualSaleBuyCost, actualContractSum,actualReserveRepo, actualGivenDayCount,actualRepaymentDayCount,_
        actualRepDayCount, actualExtStateDayCount, actualTotalExtDayCount, actualConstExtDayCount, actualSale, actualCostCorrection, actualSalePer
    Dim queryString, sql_Value, colNum, sql_isEqual
    Dim startDATE, fDATE, Date, fBASE, frmPttelProgress       
                                                   
    Utilities.ShortDateFormat = "yyyymmdd"
    startDATE = "20011016"
    fDATE = "20240101"
    Date = "120314"
    queryString = "Delete from CAgrProfile where fRepDate = '2014-03-12' and fTypeName = 'CBDisp'"
    'Test StartUp start
    Call Initialize_AsBankQA(startDATE, fDATE)
    'Test StartUp end
 
    Call Create_Connection()
    Call Execute_SLQ_Query(queryString)
    
    expectedBuyCost = "8,470,780,189.00"
    expectedSaleBuyCost = "4,703,093,470.50"
    expectedsumma = "8,845,085,461.10"
    expectedSaleCost = "4,937,981,877.10"
    expectedNominalCost = "8,571,000,000.00"
    expectedReserveRepo = "4,800,000,000.00"
    expectedSale = "277,804,087.70"
    expectedCostCorrection = "360,312,361.90"
    expectedPercent = "191,577,186.90"
    expectedSalePer = "134,006,754.30"
    expectedContractSum = "9,457,894,314.70"
    expectedGivenDayCount = "132486"
    expectedRepaymentDayCount = "122043"
    expectedRepDayCount = "122043"
    expectedExtStateDayCount = "6210"
    expectedTotalExtDayCount = "5"
    expectedConstExtDayCount = "2"

    
    Call ChangeWorkspace(c_Subsystems)
    Call wTreeView.DblClickItem("Ð³ßí»ïíáõÃÛáõÝÝ»ñ,  Ù³ïÛ³ÝÝ»ñ")
    Call wTreeView.DblClickItem("î»Õ³µ³ßËí³Í ÙÇçáóÝ»ñ|²ñÅ»ÃÕÃ»ñ í³×³éùÇ|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ (ø»ß³íáñí³Í)")
    
    'Պայմանագրի ամփոփում(Քեշավերված) փաստաթղթի լրացում 
    Call  Contract_Sammary_Report_Fill_Cashed(Date,False,False,False,False,False,False,False)                                  
    'Waiting for frmPttel
    Set frmPttelProgress = AsBank.WaitVBObject("frmPttelProgress", 3000)
    While frmPttelProgress.Exists
      BuiltIn.Delay(delay_small) 
    Wend 
   
        'Կատարում ենք SQL ստուգում
        queryString = "select COUNT(*) from CAgrProfile where fRepDate = '2014-03-12' and fTypeName = 'CBDisp' "
        sql_Value = 70
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select SUM(fSumma) from CAgrProfile where fTypeName = 'CBDisp'  and  fRepDate = '2014-03-12'"
        sql_Value = 9457894314.70
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
       
        queryString = "select SUM(fCliSecNominal) from CAgrProfile where fTypeName = 'CBDisp'  and  fRepDate = '2014-03-12'"
        sql_Value = 0.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
       
        queryString = "select SUM(fN0LIM) from CAgrProfile where fTypeName = 'CBDisp'  and  fRepDate = '2014-03-12'"
        sql_Value = 9587000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
      
        queryString = "select SUM(fN0PIN) from CAgrProfile where fTypeName = 'CBDisp'  and  fRepDate = '2014-03-12'"
        sql_Value = 844.5566
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
       
        queryString = "select SUM(fBefLastDebtDays) from CAgrProfile where fTypeName = 'CBDisp'  and  fRepDate = '2014-03-12'"
        sql_Value = 122043
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
        Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
       
        
    'Ֆիլտրել օրերի քանակը
    Call wMainForm.MainMenu.Click("Դիտում |arjetxterivachDayCount")
    
    With wMDIClient.VBObject("frmPttel").VBObject("tdbgView")
      actualBuyCost = Trim(.Columns.Item(2).FooterText)
      actualSaleBuyCost = Trim(.Columns.Item(4).FooterText)
      actualsumma = Trim(.Columns.Item(5).FooterText)
      actualSaleCost = Trim(.Columns.Item(7).FooterText)
      actualNominalCost = Trim(.Columns.Item(8).FooterText)
      actualReserveRepo = Trim(.Columns.Item(10).FooterText)
      actualSale = Trim(.Columns.Item(11).FooterText)
      actualCostCorrection = Trim(.Columns.Item(12).FooterText)
      actualPercent = Trim(.Columns.Item(13).FooterText)
      actualSalePer = Trim(.Columns.Item(15).FooterText)
      actualContractSum = Trim(.Columns.Item(26).FooterText)
      actualGivenDayCount = Trim(.Columns.Item(38).FooterText)
      actualRepaymentDayCount = Trim(.Columns.Item(39).FooterText)
      actualRepDayCount = Trim(.Columns.Item(40).FooterText)
      actualExtStateDayCount = Trim(.Columns.Item(41).FooterText)
      actualTotalExtDayCount = Trim(.Columns.Item(42).FooterText)
      actualConstExtDayCount = Trim(.Columns.Item(43).FooterText)
    End With
    
     'Գնման գին սյան ստուգում
     If expectedBuyCost <> actualBuyCost Then
        Log.Error("Dont match")
     End If
     
     'Հակ.ռեպ.վաճ.մասի գնման գին սյան ստուգում
     If expectedSaleBuyCost<> actualSaleBuyCost Then
        Log.Error("Dont match")
     End If
     
     'Գումար սյան ստուգում
     If expectedsumma <> actualsumma Then
        Log.Error("Dont match")
     End If     

     'Հակ.ռեպ.վաճ.մասի գին սյան ստուգում
     If expectedSaleCost <> actualSaleCost Then
        Log.Error("Dont match")
     End If     
    
     'Անվանական արժեք սյան ստուգում
     If expectedNominalCost <> actualNominalCost Then
         Log.Error("Dont match")
     End If
     
     'Հակադարձ ռեպո սյան ստուգում
     If expectedReserveRepo <> actualReserveRepo Then
         Log.Error("Dont match")
     End If
     
     'Զեղչ./Հավ. սյան ստուգում
     If expectedSale <> actualSale Then
         Log.Error("Dont match")
     End If     
     
     'Գնի ճնշում սյան ստուգում
     If expectedCostCorrection <> actualCostCorrection Then
         Log.Error("Dont match")
     End If     
     
     'Տոկոս սյան ստուգում
     If expectedPercent <> actualPercent Then
         Log.Error("Dont match")
     End If
     
     'Հակ.ռեպ.վաճ.մասի տոկոս արժեթ. սյան ստուգում
     If expectedSalePer <> actualSalePer Then
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
     
     'Տկ.մ.մ.օ.ք. սյան ստուգում
     If expectedExtStateDayCount <> actualExtStateDayCount Then
         Log.Error("Dont match")
     End If
     
     'Ընդ.ժամկ.օ.ք. սյան ստուգում
     If expectedTotalExtDayCount <> actualTotalExtDayCount Then
         Log.Error("Dont match")
     End If
     
     'Անընդ. ժամկ.լ.ք. սյան ստուգումÙ
     If expectedConstExtDayCount <> actualConstExtDayCount Then
         Log.Error("Dont match")
     End If
     
    wMDIClient.VBObject("frmPttel").Close()
    Call Close_AsBank()  
     
End Sub 