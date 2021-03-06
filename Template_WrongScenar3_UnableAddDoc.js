'USEUNIT Library_Templates
'USEUNIT Template_Checker
'USEUNIT Library_Common

'Test Case N 159990

Private fCode

Sub WrongScenar3_UnableAddDoc
    
    Call TemplateStartUp()
    
    fCode = "WrongTemplate3"
    
    Call TemplateFilter (" ", " ", " ")
    fName = "WrongTestTemplate3"
    fEname = "WrongTest3Template3"
    fType = "0"
    Connectivity = False
    Updateable = True
    Utilities.ShortDateFormat = "dd/mm/yy"
    Call CreateTemplate(fCode, fName, fEname, fType, Connectivity, Updateable)
    Call CheckTemplate(fCode, fName, fEname, fType, Connectivity, Updateable, "", Utilities.DateToStr(Utilities.Date()))
    Call Check_UnableAddDoc()
    Call CloseTemplateGridWindow
    
    Call TestCleanUp()
End Sub

'-------------------------------------------------------------------------------------------------------

Private Sub TestCleanUp()
    Call TemplateFilter (" ", " ", " ")
    
    bAnswer = DeleteTemplate(Array(fCode))
    If bAnswer Then
        Log.Message("Deletion of Template ended successfully!!")
    Else
        Log.Error("In deletion something wrong!")
    End If
    Call CheckDeleteTemplate(fCode, "0")
    
    Call CloseTemplateGridWindow
    
    TemplateCleanUp()
End Sub