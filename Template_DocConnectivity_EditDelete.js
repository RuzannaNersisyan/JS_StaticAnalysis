'USEUNIT Library_Templates
'USEUNIT Template_Checker
'USEUNIT Template_NecessaryDocuments
'USEUNIT Library_Common

'Test Case N 160010

Private fCode

Public Sub TemplateDocConEditDeleteTest
    
    fCode = "ED Loan 1"
    'fName = "ÊÙµ³·ñ»É çÝç»É Ï³åÁ - ì³ñÏ³ÛÇÝ å³ÛÙ³Ý³·Çñ 1"
    fName = "Edit Delete Connectivity - Loan agreement 1" 
    fEName = "Edit Delete Connectivity - Loan agreement 1"
    fType = 1
    fConnectivity = True
    fUpdateable1 = False
    
    Call TestStartUp()
    
    Utilities.ShortDateFormat = "dd/mm/yy"
    
    '------------Create Template ----------------
    Call TemplateFilter ("", "", " ")
    
    Call CreateTemplate(fCode, fName, fEName, fType, fConnectivity, fUpdateable)
    rowid = CheckTemplate(fCode, fName, fEName, fType, fConnectivity, fUpdateable, "", Utilities.DateToStr(Utilities.Date()))
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    '------------Template Import ---------------
    '------------add and edit document------
    docType = "C1Univer"
    
    Call TemplateFilter(fCode, "", " ")
    Call ImportFile("ImportWithNoClick", templatepath & "\Loan_Distributed_scheduled_1.xlsx")
    Call CheckImportFile(fCode, fType, templatepath & "\Loan_Distributed_scheduled_1.xlsx")
    
    Call SeeDocList_AddDoc(docType, "")
    Call CheckTemplateMapping(fCode, fType, docType, "")
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    formula = "doc(""AGRTYPE"")=""0004"""
    Call DocTemplateFilter (docType)
    Call EditTemplateForDoc(fCode, formula)
    
    Call CheckTemplateMapping(fCode, fType, docType, formula)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    'print
    Call PrintDocument(CreditContractISN, "excel", fName, "", Array(), False)
    
    ' change to other doc type
    docType = "PkCash"
    formula = "Doc.Grid(""SubSums"").Value(0, ""SUMMA"")>0"
    Call TemplateFilter(fCode, "", " ")
    Call SeeDocList_EditDoc(docType, formula)
    Call CheckTemplateMapping(fCode, fType, docType, formula)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    Call TemplateFilter(fCode, "", " ")
    
    Call ImportFile("ImportWithNoClick", templatepath & "\Group_Cash_In_1.doc")
    Call CheckImportFile(fCode, fType, templatepath & "\Group_Cash_In_1.doc")
    
    fType = 0
    Call EditTemplate(fCode, fName, fEname, fType, fConnectivity, fUpdateable)
    rowidEdited = CheckTemplate(fCode, fName, fEName, fType, fConnectivity, _
                  fUpdateable, templatepath & "\Group_Cash_In_1.doc", _
                  Utilities.DateToStr(Utilities.Date()))
    
    If rowid<>rowidEdited Then
        Log.Error("After editing template rowid was changed.")
    End If
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    ' print
    Call PrintDocument(GroupCashInputISN, "word", fName, "", Array(), False)
    
    Call TestCleanUp()
End Sub

'-------------------------------------------------------------------------------------------------------

Private Sub TestStartUp()
    
    Utilities.ShortDateFormat = "yyyymmdd"
    endDATE = Utilities.DateToStr(Utilities.Date())
    startDATE = Utilities.DateToStr(Utilities.IncMonth(Utilities.Now, -24))
    
    Call Initialize_AsBank("bank", startDATE, endDATE)
    
    Call CreateNecessaryDocuments()
    
    Call login("Armsoft")
    
    Call TemplateFilter(fCode, "", " ")
    Call DeleteTemplate(Array(fCode))
    
    wMDIClient.vbObject("frmPttel").Close()
    
End Sub

'-------------------------------------------------------------------------------------------------------

Private Sub TestCleanUp()
    
    Call TemplateFilter(fCode, "", " ")
    Call DeleteTemplate(Array(fCode))
    
    wMDIClient.vbObject("frmPttel").Close()
    
    Call DeleteNecessaryDocuments()
    
    Call TemplateCleanUp()
End Sub