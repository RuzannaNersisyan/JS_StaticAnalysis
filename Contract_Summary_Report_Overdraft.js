Option Explicit
'USEUNIT Library_Common
'USEUNIT Contract_Summary_Report_Library
'USEUNIT Constants 

'Test Case N 165045

Sub Contract_Summary_Report_Overdraft_Check_Rows_Test()
 
  Dim startDATE, fDATE, Date, cont_date

  Date = "201211"
  cont_date = "111111"            
  Utilities.ShortDateFormat = "yyyymmdd"
  startDATE = "20030101"
  fDATE = "20250101"
    
  'Test StartUp 
  Call Initialize_AsBank("bank", startDATE, fDATE)
  Call ChangeWorkspace(c_Overdraft)
  Call wTreeView.DblClickItem("|úí»ñ¹ñ³ýï (ï»Õ³µ³ßËí³Í)|ä³ÛÙ³Ý³·ñ»ñÇ ³Ù÷á÷áõÙ")
    
  Call Contract_Sammary_Report_Fill(Date, Null, Null, Null, Null, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, _
                                      Null, Null, Null, Null, Null, Null, Null, False, False, _
                                      Null, False, False, False, _
                                      True, True, True, True, True, _
                                      True, True, True, True, True, True, _
                                      True, True, True, True, True, True, False,4)
    
  BuiltIn.Delay(30000)
    
  '¶áõÙ³ñ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FAGRSUM", "112,317,020.20")
  'Ä³ÙÏ»ï³Ýó ·áõÙ³ñ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FAGRSUMJ", "4,600.00")
  '¸áõñë ·ñí³Í ·áõÙ³ñ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FAGROUTSUM", "50,000.00")
  'îáÏáë ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPERSUM", "55,438.97")
  'âû·ï. Ù³ëÇ ïáÏáë ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPERSUMNOCH", "175.60")
  'Ä³ÙÏ»ï³Ýó ãû·ï. Ù³ëÇ ïáÏáë
  Call Compare_ColumnFooterVlaue("frmPttel", "FPERSUMNOCHJ", "95.50")
  'âí³ëï³Ï³Í ïáÏáë ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPERSUMFUTUR", "542.17")
  'Ä³Ï»ï³Ýó ïáÏáë ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPERSUMJ", "274.00")
  '¸áõñë ·ñí³Í ïáÏáë ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPEROUTSUM", "27.40")
  '´îÐ¸ ïáÏ. ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FREFINSUM", "0.86")
  '¸.·. ´îÐ¸  ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FREFINOUTSUM", "0.00")
  'Ä³ÙÏ»ï³Ýó ·áõÙ³ñÇ ïáõÛÅ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPENSUM", "3.80")
  'Ä³ÙÏ»ï³Ýó ïáÏáëÇ ïáõÛÅ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPENSUM2", "0.83")
  '¸áõñë ·ñí³Í ïáõÛÅ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPENOUTSUM", "0.00")
  '¸áõñë ·ñí³Í ïáÏáëÇ ïáõÛÅ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPENOUTSUM2", "0.00")
  'Ä³ÙÏ»ï³Ýó ·áõÙ³ñÇ ïáÏáë ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FLOSSSUM", "0.55")
  '¸.·. Å³ÙÏ. ·. ïÏ. ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FLOSSOUTSUM", "0.00")
  '¶ñ³íÇ ³ñÅ»ùÁ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FMORTGAGESUM", "0.00")
  'ºñ³ßË³íáñáõÃÛ³Ý ³ñÅ»ùÁ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FGUARSUM", "0.00")
  'ê³ÑÙ³Ý³ã³÷ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FAGRLIMIT", "126,863,000.00")    
  'âû·ï. Ù³ë ëÛ³Ý
  Call Compare_ColumnFooterVlaue("frmPttel", "FAGRUNUSE", "14,547,979.80")
  'ä³ÛÙ³Ý³·ñÇ ·áõÙ³ñ ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FSUMMA", "122,863,150.00")
  '    'îñÙ³Ý ûñ»ñÇ ù³Ý³Ï ëÛ³Ý ëïáõ·áõÙ
  '    Call Compare_ColumnFooterVlaue("frmPttel", "FDAYQUAN", "11315")
  '     'Ø³ñÙ³ÝÁ ÙÝ³ó³Í ûñ»ñÇ ù³Ý³Ï ëÛ³Ý ëïáõ·áõÙ
  '     Call Compare_ColumnFooterVlaue("frmPttel", "FDAYBEFMAR", "-3061")
  '    'Ø³ñÙ³ÝÁ ÙÝ³ó³Í ûñ»ñÇ ù.³.Ù.Å. ëÛ³Ý ëïáõ·áõÙ
  '    Call Compare_ColumnFooterVlaue("frmPttel", "FDAYBEFFRMAR", "-3061")
  '    'ºñÏ³ñ³Ó·í³Í íÇ×³ÏáõÙ ·ïÝíáÕ ûñ»ñÇ ù³Ý³ÏÁ ëÛ³Ý ëïáõ·áõÙ
  '    Call Compare_ColumnFooterVlaue("frmPttel", "FDAYPROL", "0")
  '    'ºñÏ³ñ³Ó·í³Í ûñ»ñÇ ù³Ý³Ï ëÛ³Ý ëïáõ·áõÙ
  '    Call Compare_ColumnFooterVlaue("frmPttel", "FDAYPROLALL", "0")
  '    'îáÏáëÝ»ñÇ Ù³ñÙ³ÝÁ ÙÝ³ó³Í ûñ»ñÇ ù³Ý³Ï ëÛ³Ý ëïáõ·áõÙ
  '    Call Compare_ColumnFooterVlaue("frmPttel", "FDAYBEFPRMAR", "-2458")
  '     'Ä³ÙÏ»ï³Ýó ûñ»ñÇ ù³Ý³Ï ëÛ³Ý ëïáõ·áõÙ
  '     Call Compare_ColumnFooterVlaue("frmPttel", "FDAYAGRJ", "1098")
  '    'îáÏáëÝ»ñÇ Å³ÙÏ»ï³Ýó ûñ»ñÇ ù³Ý³Ï ëÛ³Ý ëïáõ·áõÙ
  '    Call Compare_ColumnFooterVlaue("frmPttel", "FDAYPERJ", "1345")
  'Ü»ñÏ³ ³ñÅ»ù ëÛ³Ý ëïáõ·áõÙ
  Call Compare_ColumnFooterVlaue("frmPttel", "FPRESVALUE", "112,372,640.81")

  Call wMainForm.MainMenu.Click("Դիտում |ov21")
  BuiltIn.Delay(1000) 
    
  'Test CleanUp 
  Call Close_AsBank()
End Sub
