Option Explicit
'USEUNIT International_PayOrder_Receive_Confirmphases_Library
'USEUNIT International_PayOrder_ConfirmPhases_Library
'USEUNIT PayOrder_Receive_ConfirmPhases_Library
'USEUNIT SWIFT_International_Payorder_Library
'USEUNIT Payment_Order_ConfirmPhases_Library
'USEUNIT Payment_Except_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT Constants

'Test case Id 166765

Sub SWIFT_Internatioanal_Payorder_Import_Test()

    Dim max,min,rand, startDATE, fDATE,DocNum,cashOutN
    Dim fileFrom,fileTo,what,fWith,isExists,fBASE,is_Exists
    Dim queryString,sql_Value, colNum,sql_isEqual,result,fOBJECT
    
    max=10000
    min=99999
    Randomize
    rand = Int((max-min+1)*Rnd+min)
    DocNum = "88" & rand & "60"
    fileFrom = Project.Path & "Stores\SWIFTtest\FileAct\MT940_410_2610181717.RJE"
    fileTo   = Project.Path & "Stores\SWIFTtest\Import\FileAct\MT940_410.RJE"
    
    what =  "{2:I9501234567891UBSWCHZHXXXXN123456789123456789}{4:" & vbCrLf &_
            ":20:880020260"& vbCrLf &_
            ":25:7770000100770100"& vbCrLf &_
            ":28C:20260"
    fWith = "{2:I950123" & rand & "91UBSWCHZHXXXXN123456" & rand & "3456789}{4:" & vbCrLf &_
            ":20:" & Trim(DocNum)  & vbCrLf &_
            ":25:7770000100770100"& vbCrLf &_
            ":28C:" & rand & ""
    
    startDATE = "20010101"
    fDATE     = "20250101"
    Log.Message(fWith)
    
    'Վերարտագրում է նախօրոք տրված ֆայլը մեկ այլ ֆայլի մեջ` կատարելով փոփոխություն
    Call Read_Write_File_With_replace(fileFrom,fileTo,what,fWith)
    
   'Test StartUp start
    Call Initialize_AsBank("bank", startDATE, fDATE)
    BuiltIn.Delay(1000)
    Call ChangeWorkspace(c_Admin)
    Call Create_Connection()

    Call SetParameter("SWIN", Project.Path& "Stores\SWIFTtest\Actual\")
    Call SetParameter("SWFAIN", Project.Path& "Stores\SWIFTtest\Actual\FileAct\")
    Call SetParameter("SWFAOUT", Project.Path& "Stores\SWIFTtest\Import\FileAct\")
    Call SetParameter("SWOUT", Project.Path& "Stores\SWIFTtest\Import\")
    Call SetParameter("SWTMPDIR", "\\host2\Sys\Testing\SWIFT\tmp\")
    Call SetParameter("SWSPFSIN", "")
    Call SetParameter("SWSPFSCLIENTS", "")

    'Դնում է Ուղարկել SWIFT նշիչը
    Call Change_User_Permission_SWIFT()
    Call Login("ARMSOFT")
    
    Call ChangeWorkspace(c_SWIFT)
    'SWIFT-ից ընդունում  է հաղորդագրություններ
    Call wTreeView.DblClickItem("|S.W.I.F.T. ²Þî                  |Ð³Õáñ¹³·ñáõÃÛáõÝÝ»ñÇ ÁÝ¹áõÝáõÙ|ÀÝ¹áõÝ»É S.W.I.F.T. Ñ³Ù³Ï³ñ·Çó")
    Sys.Process("Asbank").VBObject("frmAsMsgBox").VBObject("cmdButton").Click()
 
    'Ստուգում է ,որ հաղորդագորությունը ընդունված լինի
    is_Exists = PaySys_Check_Doc_In_SWIFT_Mixed_Mess_Folder(DocNum)
    If Not is_Exists Then 
        Log.Error("Document did not input")
    End If            
    
    Call Close_AsBank()
    
End Sub