'USEUNIT Library_Templates
'USEUNIT Template_Checker
'USEUNIT Template_NecessaryDocuments
'USEUNIT Library_Common

'Test Case N 160000

Private fCode

Public Sub Template_WrongScenario5_ReadOnly_Doc
    
    fCode = "GrCash1"
  '  fName = "ÊÙµ³ÛÇÝ Ï³ÝËÇÏ Ùáõïù 1"
    fName = "GrCash1"
    fEName = "Group Cash In 1"
    fType = 0
    fConnectivity = True
    fUpdateable = False
    
    Call TestStartUp()
    
    Utilities.ShortDateFormat = "dd/mm/yy"
    
    Call TemplateFilter ("", "", " ")
    
    Call CreateTemplate(fCode, fName, fEName, fType, fConnectivity, fUpdateable)
    rowid1 = CheckTemplate(fCode, fName, fEName, fType, fConnectivity, fUpdateable, "", Utilities.DateToStr(Utilities.Date()))
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    docType = "PkCash"
    
    Call TemplateFilter(fCode, "", " ")
    Call ImportFile("ImportWithNoClick", templatepath & "\Group_Cash_In_1.doc")
    Call CheckImportFile(fCode, fType, templatepath & "\Group_Cash_In_1.doc")
    
    Call SeeDocList_AddDoc(docType, "")
    Call CheckTemplateMapping(fCode, fType, docType, "")
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
    docPath = PrintDocument(GroupCashInputISN, "word", fName, _
              "", Array(), True)
    ReadOnly = CheckDocReadOnly(docPath)
    
    If not ReadOnly Then
        Log.Error("doc is not read only")
    End If
    
    ' delete template mapping
    Call DocTemplateFilter (docType)
    Call DeleteTemplateForDoc(fCode)
    Call CheckDeleteTemplateMapping(fCode, fType, docType)
    
    BuiltIn.Delay(1000)
    wMDIClient.vbObject("frmPttel").Close()
    
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