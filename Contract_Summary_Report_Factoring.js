Option Explicit
'USEUNIT Library_Common
'USEUNIT Contract_Summary_Report_Library
'USEUNIT Constants

'Test Case N 165044

Sub Contract_Summary_Report_Factoring_Check_Rows_Test()
                                   
  Dim startDATE, fDATE, Date, cont_date
    
  Date = "201211"
  cont_date = "111111"              
  Utilities.ShortDateFormat = "yyyymmdd"
  startDATE = "20030101"
  fDATE = "20250101"
    
  'Test StartUp 
  Call Initialize_AsBank("bank", startDATE, fDATE)
  Call ChangeWorkspace("Ֆակտորինգ")
  Call wTreeView.DblClickItem("|ü³ÏïáñÇÝ·|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ")
    
  Call Contract_Sammary_Report_Fill(Date, Null, Null, Null, Null, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, False, False, _
                                      Null, False, False, False, _
                                      True, True, True, True, True, _
                                      True, True, True, True, True, True, _
                                      True, True, True, True, True, True, False,2)
    
  BuiltIn.Delay(10000)  

  'ì×³ñí³Í ·áõÙ³ñ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FBUYPRICE", "76,320,720.80")
  '¶áõÙ³ñ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FAGRSUM", "76,777,000.00")
  'Ä³ÙÏ»ï³Ýó ·áõÙ³ñ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FAGRSUMJ", "70,255,346.30")
  '¸áõñë ·ñí³Í ·áõÙ³ñ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FAGROUTSUM", "480,000.00")
  '¼»Õã/Ð³í. ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FDISSUM", "427,060.60")
  '¸áõñë ·ñí³Í ½»Õã³ïáÏáë ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FDISOUTSUM", "0.00")
  'ì»ñçÝ³Ñ³ßí³ñÏ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FLASTSUM", "28,718.60")
  'ÎáÙÇëÇáÝ ·áõÙ³ñ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FCOMISSUM", "500.00")
  'îáÏáë ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPERSUM", "13,486.20")
  '²ñ¹ÛáõÝ³í»ï ïáÏáë ëÛ³Ý ëïáõ·áõÙ 
  Call Compare_ColumnFooterVlaue("frmPttel", "FEFFINC", "-37,734.90")
  'Ä³Ï»ï³Ýó ïáÏáë ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPERSUMJ", "45,308.00")
  '¸áõñë ·ñí³Í ïáÏáë ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPEROUTSUM", "2,000.00")
  '´îÐ¸ ïáÏ. ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FREFINSUM", "232.90")
  '¸.·. ´îÐ¸  ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FREFINOUTSUM", "0.00")
  'Ä³ÙÏ»ï³Ýó ·áõÙ³ñÇ ïáõÛÅ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPENSUM", "0.00")
  'Ä³ÙÏ»ï³Ýó ïáÏáëÇ ïáõÛÅ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPENSUM2", "0.00")
  '¸áõñë ·ñí³Í ïáõÛÅ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPENOUTSUM", "0.00")
  '¸áõñë ·ñí³Í ïáÏáëÇ ïáõÛÅ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPENOUTSUM2", "0.00")
  'Ä³ÙÏ»ï³Ýó ·áõÙ³ñÇ ïáÏáë ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FLOSSSUM", "0.00")
  '¸.·. Å³ÙÏ. ·. ïÏ. ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FLOSSOUTSUM", "0.00")
  '¶ñ³íÇ ³ñÅ»ùÁ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FMORTGAGESUM", "0.00")
  'ºñ³ßË³íáñáõÃÛ³Ý ³ñÅ»ùÁ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FGUARSUM", "0.00")         
  'ä³ÛÙ³Ý³·ñÇ ·áõÙ³ñ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FSUMMA", "109,368,000.00")
  '    'îñÙ³Ý ûñ»ñÇ ù³Ý³Ï ëÛ³Ý ëïáõ·áõÙ
  '    Call Compare_ColumnFooterVlaue("frmPttel", "FDAYQUAN", "44503")
  '     'Ø³ñÙ³ÝÁ ÙÝ³ó³Í ûñ»ñÇ ù³Ý³Ï ëÛ³Ý ëïáõ·áõÙ
  '     Call Compare_ColumnFooterVlaue("frmPttel", "FDAYBEFMAR", "-3566")
  '    'Ø³ñÙ³ÝÁ ÙÝ³ó³Í ûñ»ñÇ ù.³.Ù.Å. ëÛ³Ý ëïáõ·áõÙ
  '    Call Compare_ColumnFooterVlaue("frmPttel", "FDAYBEFFRMAR", "-3566")
  '    'ºñÏ³ñ³Ó·í³Í íÇ×³ÏáõÙ ·ïÝíáÕ ûñ»ñÇ ù³Ý³ÏÁ ëÛ³Ý ëïáõ·áõÙ
  '    Call Compare_ColumnFooterVlaue("frmPttel", "FDAYPROL", "0")
  '    'ºñÏ³ñ³Ó·í³Í ûñ»ñÇ ù³Ý³Ï ëÛ³Ý ëïáõ·áõÙ
  '    Call Compare_ColumnFooterVlaue("frmPttel", "FDAYPROLALL", "0")
  '    'îáÏáëÝ»ñÇ Ù³ñÙ³ÝÁ ÙÝ³ó³Í ûñ»ñÇ ù³Ý³Ï ëÛ³Ý ëïáõ·áõÙ
  '    Call Compare_ColumnFooterVlaue("frmPttel", "FDAYBEFPRAMAR", "1323")
  '     'Ä³ÙÏ»ï³Ýó ûñ»ñÇ ù³Ý³Ï ëÛ³Ý ëïáõ·áõÙ
  '     Call Compare_ColumnFooterVlaue("frmPttel", "FDAYAGRJ", "6330")
  '    'ÀÝ¹Ñ³Ýáõñ Å³ÙÏ»ï³Ýó ûñ»ñÇ ù³Ý³Ï ëÛ³Ý ëïáõ·áõÙ
  '    Call Compare_ColumnFooterVlaue("frmPttel", "FALLDAYAGRJ", "24198")
  'Ü»ñÏ³ ³ñÅ»ù ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPRESVALUE", "76,752,984.20")

  Call wMainForm.MainMenu.Click("Դիտում |Factoring_New") 
  BuiltIn.Delay(1000) 
     
  'Test CleanUp 
  Call Close_AsBank()
End Sub