'USEUNIT Library_Templates
'USEUNIT Template_Checker
'USEUNIT Template_NecessaryDocuments
'USEUNIT Library_Common

'Test Case N 159923

Private fCode1, fCode2, fCode3, fCode4, fCode5, fCode6

Public Sub TemplateDocumentConnectivityTest
    
    fCode1 = "GrCash1"
    'fName1 = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ Ùáõïù 1"
    fName1= "GrCash1"
    fEName1 = "Group Cash In 1"
    fType1 = 0
    fConnectivity1 = True
    fUpdateable1 = True
    
    fCode2 = "GrCash2"
    'fName2 = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ Ùáõïù 2"
    fName2="GrCash2"
    fEName2 = "Group Cash In 2"
    fType2 = 0
    fConnectivity2 = True
    fUpdateable2 = True
    
    fCode3 = "GrCash3"
    'fName3 = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ Ùáõïù 3"
    fName3= "GrCash3"
    fEName3 = "Group Cash In 3"
    fType3 = 0
    fConnectivity3 = True
    fUpdateable3 = True
    
    fCode4 = "Loan1"
    'fName4 = "ì³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ 1"
    fName4 = "Loan1" 
    fEName4 = "Loan agreement 1"
    fType4 = 1
    fConnectivity4 = True
    fUpdateable4 = False
    
    fCode5 = "Loan2"
   ' fName5 = "ì³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ 2"
    fName5= "Loan2"  
    fEName5 = "Loan agreement 2"
    fType5 = 1
    fConnectivity5 = True
    fUpdateable5 = False
    
    fCode6 = "Loan3"
    'fName6 = "ì³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ 3"
     fName6 = "Loan3"
    fEName6 = "Loan agreement 3"
    fType6 = 1
    fConnectivity6 = True
    fUpdateable6 = False
    
    Call TestStartUp()
    
    Call PrintDocument(CreditContractISN, "excel", "Default", _
                       docspath & "\Expected Documents\Loan_Distributed_scheduled_1_Expected.xlsx", _
                       Array(), False)
    
    Utilities.ShortDateFormat = "dd/mm/yy"
    Call TemplateFilter ("", "", " ")
    
    
    '------------Template1----------------
    Call CreateTemplate(fCode1, fName1, fEName1, fType1, fConnectivity1, fUpdateable1)
    rowid1 = CheckTemplate(fCode1, fName1, fEName1, fType1, fConnectivity1, fUpdateable1, "", Utilities.DateToStr(Utilities.Date()))
    
    
    '------------Template2----------------
    Call CreateTemplate(fCode2, fName2, fEName2, fType2, fConnectivity2, fUpdateable2)
    rowid2 = CheckTemplate(fCode2, fName2, fEName2, fType2, fConnectivity2, fUpdateable2, "", Utilities.DateToStr(Utilities.Date()))
    
    
    '------------Template3----------------
    Call CreateTemplate(fCode3, fName3, fEName3, fType3, fConnectivity3, fUpdateable3)
    rowid3 = CheckTemplate(fCode3, fName3, fEName3, fType3, fConnectivity3, fUpdateable3, "", Utilities.DateToStr(Utilities.Date()))
    
    
    '------------Template4----------------
    Call CreateTemplate(fCode4, fName4, fEName4, fType4, fConnectivity4, fUpdateable4)
    rowid4 = CheckTemplate(fCode4, fName4, fEName4, fType4, fConnectivity4, fUpdateable4, "", Utilities.DateToStr(Utilities.Date()))
    
    
    '------------Template5----------------
    Call CreateTemplate(fCode5, fName5, fEName5, fType5, fConnectivity5, fUpdateable5)
    rowid5 = CheckTemplate(fCode5, fName5, fEName5, fType5, fConnectivity5, fUpdateable5, "", Utilities.DateToStr(Utilities.Date()))
    
    
    '------------Template6----------------
    Call CreateTemplate(fCode6, fName6, fEName6, fType6, fConnectivity6, fUpdateable6)
    rowid6 = CheckTemplate(fCode6, fName6, fEName6, fType6, fConnectivity6, fUpdateable6, "", Utilities.DateToStr(Utilities.Date()))
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    
    '------------for Template1 ------------
    '------------Import, add document------
    docType = "PkCash"
    
    Call TemplateFilter(fCode1, "", " ")
    Call ImportFile("ImportWithNoClick", templatepath & "\Group_Cash_In_1.doc")
    Call CheckImportFile(fCode1, fType1, templatepath & "\Group_Cash_In_1.doc")
    
    Call SeeDocList_AddDoc(docType, "")
    Call CheckTemplateMapping(fCode1, fType1, docType, "")
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    
    '------------for Template2 ------------
    '------------Import, add document------
    Call TemplateFilter(fCode2, "", " ")
    Call ImportFile("ImportWithNoClick", templatepath & "\Group_Cash_In_1.doc")
    Call CheckImportFile(fCode2, fType2, templatepath & "\Group_Cash_In_1.doc")
    
    formula = "Doc.Grid(""SubSums"").Value(0, ""SUMMA"") +Doc.Grid(""SubSums"")"& _
              ".Value(1, ""SUMMA"") + Doc.Grid(""SubSums"").Value(2, ""SUMMA"")>= 4000"
    Call SeeDocList_AddDoc(docType, formula)
    Call CheckTemplateMapping(fCode2, fType2, docType, formula)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    
    '------------for Template3 ------------
    '------------Import, add document------
    Call TemplateFilter(fCode3, "", " ")
    Call ImportFile("ImportWithNoClick", templatepath & "\Group_Cash_In_1.doc")
    Call CheckImportFile(fCode3, fType3, templatepath & "\Group_Cash_In_1.doc")
    
    formula = "Doc.Grid(""SubSums"").Value(0, ""SUMMA"") +Doc.Grid(""SubSums"")"& _
              ".Value(1, ""SUMMA"") + Doc.Grid(""SubSums"").Value(2, ""SUMMA"")< 4000"
    Call SeeDocList_AddDoc(docType, formula)
    Call CheckTemplateMapping(fCode3, fType3, docType, formula)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
  	
    '------------for Template4------------
    '------------Import, add document------
    docType = "C1Univer"
    
    Call TemplateFilter(fCode4, "", " ")
    Call ImportFile("ImportWithNoClick", templatepath & "\Loan_Distributed_scheduled_1.xlsx")
    Call CheckImportFile(fCode4, fType4, templatepath & "\Loan_Distributed_scheduled_1.xlsx")
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    Call DocTemplateFilter (DocType)
    Call AddTemplateToDoc(fCode4, "")
    Call CheckTemplateMapping(fCode4, fType4, docType, "")
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    
    '------------for Template5 ------------
    '------------Import, add document------
    Call TemplateFilter(fCode5, "", " ")
    Call ImportFile("ImportWithNoClick", templatepath & "\Loan_Distributed_scheduled_1.xlsx")
    Call CheckImportFile(fCode5, fType5, templatepath & "\Loan_Distributed_scheduled_1.xlsx")
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    Call DocTemplateFilter (DocType)
    
    formula = "doc(""AGRTYPE"")=""0004"""
    Call AddTemplateToDoc(fCode5, formula)
    Call CheckTemplateMapping(fCode5, fType5, docType, formula)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    
    '------------for Template6 ------------
    '------------Import, add document------
    Call TemplateFilter(fCode6, "", " ")
    Call ImportFile("ImportWithNoClick", templatepath & "\Loan_Distributed_scheduled_1.xlsx")
    Call CheckImportFile(fCode6, fType6, templatepath & "\Loan_Distributed_scheduled_1.xlsx")
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    Call DocTemplateFilter (DocType)
    
    formula = "doc(""AGRTYPE"")=""0005"""
    Call AddTemplateToDoc(fCode6, formula)
    Call CheckTemplateMapping(fCode6, fType6, docType, formula)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    
    '---------------Print-------------------
    Call PrintDocument(GroupCashInputISN, "word", fName1, _
                       docspath & "\Expected Documents\Group_Cash_In_1_Expected.doc", _
                       Array(fName3), False)
    Call PrintDocument(GroupCashInputISN, "word", fName2, _
                       docspath & "\Expected Documents\Group_Cash_In_1_Expected.doc", _
                       Array(fName3), False)
    
    Call PrintDocument(CreditContractISN, "excel", fName4, _
                       docspath & "\Expected Documents\Loan_Distributed_scheduled_1_Expected.xlsx", _
                       Array(fName6), False)
    Call PrintDocument(CreditContractISN, "excel", fName5, _
                       docspath & "\Expected Documents\Loan_Distributed_scheduled_1_Expected.xlsx", _
                       Array(fName6), False)
    Call TestCleanUp()
    
End Sub

'-------------------------------------------------------------------------------------------------------

Private Sub TestStartUp()
    
    Utilities.ShortDateFormat = "yyyymmdd"
    endDATE = Utilities.DateToStr(Utilities.Date())
    startDATE = "20100101"'Utilities.DateToStr(Utilities.IncMonth(Utilities.Now, -120))
    
    Call Initialize_AsBank("bank", startDATE, endDATE)
    
    Call CreateNecessaryDocuments()
    
    Call login("Armsoft")
    
    Call TemplateFilter("", "", " ")
    Call DeleteTemplate(Array(fCode1, fCode2, fCode3, fCode4, fCode5, fCode6))
    
    wMDIClient.vbObject("frmPttel").Close()
    
End Sub

'-------------------------------------------------------------------------------------------------------

Private Sub TestCleanUp()
    
    Call TemplateFilter("", "", " ")
    Call DeleteTemplate(Array(fCode1, fCode2, fCode3, fCode4, fCode5, fCode6))
    
    wMDIClient.vbObject("frmPttel").Close()
    
    Call DeleteNecessaryDocuments()
    Call TemplateCleanUp()
End Sub