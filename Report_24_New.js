'USEUNIT Library_Common
'USEUNIT Library_Contracts
'USEUNIT Library_Colour
'USEUNIT Constants
'USEUNIT Payment_Except_Library
'USEUNIT SWIFT_International_Payorder_Library
Option Explicit

'Test Case ID 187635

Dim sDate, eDate, exportToOlap
Dim actualFilePath, actualFile, expectedFile

Sub Report_24_New_Test()
    Call Test_Inintialize()

    ' Համակարգ մուտք գործել ARMSOFT օգտագործողով
    Log.Message "Համակարգ մուտք գործել ARMSOFT օգտագործողով", "", pmNormal, DivideColor
    Call Test_StartUp()
    
    ' Կանչել UpdateDataForRep24 ֆունկցիան
    Log.Message "Կանչել UpdateDataForRep24 ֆունկցիան", "", pmNormal, DivideColor
    Call Call_Function("Util", "UpdateDataForRep24", "010314")
    
    ' Արտահանել 24-րդ հաշվետվությունը  
    Log.Message "Արտահանել 24-րդ հաշվետվությունը", "", pmNormal, DivideColor
    Call ChangeWorkspace(c_OLAPClerk)
    Call Export_From_OLTP(exportToOlap, 6000)
    
    ' Ստուգել, որ արտահանումը կատարված է
    Log.Message "Ստուգել, որ արտահանումը կատարված է", "", pmNormal, DivideColor
    p1.Terminate()
    Call Initialize_AsBankQA(sDate, eDate) 
    Call ChangeWorkspace(c_OLAPClerk)
    If Check_Exported_Groups(exportToOlap.startDate(0), exportToOlap.endDate(0), exportToOlap.groupCode(0), 1) Then
        Log.Message "Group exporting correctly done.", "", pmNormal, MessageColor
    End If
    
    ' Փակել OLAP ուղղորդիչ պատուհանը
    Call Close_Window(wMDIClient, "frmOLAPNav")
 
    ' Անցում կատարել "Ենթահամակարգեր" ԱՇՏ
    Call ChangeWorkspace(c_Subsystems)
    
    ' Մուտք գործել 24 նոր հաշվետվություն
    Log.Message "Մուտք գործել 24 նոր հաշվետվություն", "", pmNormal, DivideColor
    Call GoTo_Report24_New(exportToOlap.startDate(0), exportToOlap.endDate(0), 1, 0)
    
    ' 24 հաշվետվության պահպանում
    Log.Message "24 հաշվետվության պահպանում", "", pmNormal, DivideColor
    Call SaveDoc(actualFilePath, actualFile) 
    
    ' Համեմատել ֆայլերը
    Log.Message "Համեմատել ֆայլերը", "", pmNormal, DivideColor
    Call Compare_Files(actualFilePath & actualFile, expectedFile, "")
    
    ' Փակել ՀԾ - Բանկ համակարգը
    Call Close_AsBank()
End Sub

Sub Test_StartUp()
				Call Initialize_AsBankQA(sDate, eDate) 
				Login("ARMSOFT")
				' Մուտք Ադմինիստրատորի ԱՇՏ 4.0
				Call ChangeWorkspace(c_Admin40)
End Sub

Sub Test_Inintialize()
				sDate = "20030101"
				eDate = "20250101"

    actualFilePath = Project.Path & "Stores\CB\Actual\"
    actualFile = "24_New.txt"
    expectedFile = Project.Path & "Stores\CB\Expected\Expected_24_New.txt"
    
    Set exportToOlap = New_ExportToOlap(1)
    With exportToOlap
        .export(0) = 1
        .groupCode(0) = "FORM24"
        .name(0) = "24 ´³ÝÏ»ñÇ ÙÇçáóáí ³ñï»ñÏñÇó Ùáõ"
        .lastExport(0) = "28/02/14"
        .startDate(0) = "010314"
        .endDate(0) = "300314"
        .daily(0) = 0
    End With
End Sub
