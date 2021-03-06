'USEUNIT Library_Templates
'USEUNIT Template_Checker
'USEUNIT Library_Common

'Test Case N 159853

Sub CheckFilterTest
    
    Call TemplateStartUp()
    
    Call TemplateFilter (" ", "0", " ")
    Dim TemplateCode1(1)
    TemplateCode1(0) = "X"
    TemplateCode1(1) = "Template3"
    Call CheckFilterResult (TemplateCode1)
    Call CloseTemplateGridWindow()
    
    Call TemplateFilter (" ", " ", "0")
    Dim TemplateCode2(1)
    TemplateCode2(0) = "Template3"
    TemplateCode2(1) = "Template4Template4TM"
    Call CheckFilterResult (TemplateCode2)
    Call CloseTemplateGridWindow()
    
    Call TemplateFilter (" ", " ", "1")
    Dim TemplateCode3(2)
    TemplateCode3(0) = "X"
    TemplateCode3(1) = "T2"
    TemplateCode3(2) = "Template5"
    Call CheckFilterResult (TemplateCode3)
    Call CloseTemplateGridWindow
    
    Call TemplateFilter ("T2", " ", " ")
    Dim TemplateCode4(0)
    TemplateCode4(0) = "T2"
    Call CheckFilterResult (TemplateCode4)
    Call CloseTemplateGridWindow
    
    Call TemplateFilter ("T2", "1", "1")
    Dim TemplateCode5(0)
    TemplateCode5(0) = "T2"
    Call CheckFilterResult (TemplateCode5)
    Call CloseTemplateGridWindow
    
    Call TemplateFilter ("X", " ", " ")
    fCode = "XEdit"
   ' fName = "TestTemplate1ÊÙµ³·ñ"
    fName = "TestTemplate1_Change"
    fEname = "Edit"
    fType = "1"
    Connectivity = False
    Updateable = False
    Utilities.ShortDateFormat = "dd/mm/yy"
    Call EditTemplate(fCode, fName, fEname, fType, Connectivity, Updateable)
    Call CloseTemplateGridWindow
    Call CheckTemplate(fCode, fName, fEname, fType, Connectivity, Updateable, "", Utilities.DateToStr(Utilities.Date()))
    
    Call TemplateFilter ("Template4Template4TM ", " ", " ")
    fCode = "Template4Template"
'    fName = "TestTemplate4ÊÙµ"
    fName = "TestTemplate4_change" 
    fEname = "Edit1"
    fType = "0"
    Connectivity = True
    Updateable = True
    Utilities.ShortDateFormat = "dd/mm/yy"
    Call EditTemplate(fCode, fName, fEname, fType, Connectivity, Updateable)
    Call CloseTemplateGridWindow
    Call CheckTemplate(fCode, fName, fEname, fType, Connectivity, Updateable, "", Utilities.DateToStr(Utilities.Date()))
    
    Call TemplateFilter ("XEdit", " ", " ")
    Dim TemplateCode6(0)
    TemplateCode6(0) = "XEdit"
    Call CheckFilterResult (TemplateCode6)
    Call CloseTemplateGridWindow
    
    Call TemplateFilter ("Template4Template", "0", "1")
    Dim TemplateCode7(0)
    TemplateCode7(0) = "Template4Template"
    Call CheckFilterResult (TemplateCode7)
    Call CloseTemplateGridWindow
    
    Call TemplateCleanUp()


End Sub