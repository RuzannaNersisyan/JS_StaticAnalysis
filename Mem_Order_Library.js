'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Library_Colour
'USEUNIT Library_Contracts
'USEUNIT Payment_Except_Library
'USEUNIT SWIFT_International_Payorder_Library
Option Explicit
Dim aCount 'Մեկից ավելի հաշիվներով աշխատող փաստաթղթերի համար aCount-ին տրվում է հաշիվների քանակի արժեքը 
Dim files_count, links_count, delete_count

'---------------------------------
'--- Հիշարար օրդեր Class ---------
'---------------------------------

Class Memorder
    Public Isn
    Public Div
    Public Dep
    Public DocN
    Public MDate
    Public AccD
    Public AccC
    Public Curr
    Public Sum
    Public Aim
    Public Paysys
    
    Private Sub Class_Initialize
        Isn = ""
        Div = ""
        Dep = ""
        DocN = ""
        MDate = "/  /"
        AccD = ""
        AccC = ""
        Curr = ""
        Sum = ""
        Aim = ""
        Paysys = ""
    End Sub

    End Class

Function New_Memorder ()
    Set New_Memorder = NEW Memorder
End Function

'Հիշարար օրդեր պատուհանի դաշտերի լրացում
Sub Fill_Memorder (Memorder) 
      
    If  wMDIClient.WaitVBObject("frmASDocForm",1000).Exists Then
        Memorder.Isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn  
        'Գրասենյակ դաշտի լրացում
        Call Rekvizit_Fill ("Document",1,"General","ACSBRANCH",Memorder.Div)
        'Բաժին դաշտի լրացում
        Call Rekvizit_Fill ("Document",1,"General","ACSDEPART",Memorder.Dep)
        'Փաստաթղթի N դաշտի ստացում
        Memorder.DocN = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
        'Ամսաթիվ դաշտի լրացում
        Call Rekvizit_Fill ("Document",1,"General","DATE",Memorder.MDate)
        'Հաշիվ Դեբետ դաշտի լրացում
        Call Rekvizit_Fill ("Document",1,"General","ACCDB",Memorder.AccD)
        'Հաշիվ Կրեդիտ դաշտի լրացում
        Call Rekvizit_Fill ("Document",1,"General","ACCCR",Memorder.AccC)  
        'Ստուգում է "Արժույթ" դաշտի արժեքը և չխմբագրվող լինելը 
        Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",1,"Mask","CUR"),Memorder.Curr)
        Call Check_ReadOnly("Document",1,"Mask","CUR",True)
        'Գումար դաշտի լրացում
        Call Rekvizit_Fill ("Document",1,"General","SUMMA",Memorder.Sum)
        'Նպատակ դաշտի լրացում
        Call Rekvizit_Fill ("Document",1,"General","AIM","[Home]![End][Del]"&Memorder.Aim) 
        'Ընդ. վճ. համակարգ դաշտի լրացում
        Call Rekvizit_Fill ("Document",1,"General","PAYSYSIN",Memorder.Paysys) 
    Else 
        Log.Error "Memorial Order widnow doesn't exists",,,ErrorColor
    End If  
End Sub


Sub Create_Memorder (Memorder)
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click (c_Allactions)
    Call wMainForm.PopupMenu.Click (c_InnerOpers & "|" & c_MemOrd)
    If  wMDIClient.WaitVBObject("frmASDocForm",1000).Exists Then
        Call Fill_Memorder(Memorder)
        Call ClickCmdButton(1,"Î³ï³ñ»É")     
    Else 
        Log.Error "Memorial Order widnow doesn't exists",,,ErrorColor
    End If 
          
           
    If (Not  wMDIClient.WaitVBObject("FrmSpr",1000).Exists) Then
        Log.Error "Order print Sample doesn't exists",,,ErrorColor
    End If

End Sub
 
'----------------Հիշարար օրդերի Խմբագրելու ֆունկցիա -------------------------------------------------------------
'Memorder-Պատուհանում լրացված լինելու ստուգվող տվյալներ
'MemorderEdit - Խմբագրվող տվյալներ
'registered-Հաշվառված լինելը
'           0-Ոչ
'           1-Այո
'pttelName- համապատասխան Pttel-ի անունը (օր.՝"frmPttel", "frmPttel_2")

Sub Edit_Memorder(Memorder,MemorderEdit,regsitered,pttelName)
  
    If SearchInPttel(pttelName,2, Memorder.DocN) Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_ToEdit)
        BuiltIn.Delay(delay_middle)
        'Պատուհանում լրացված տվյալների ստուգում
        Call Memorder_Window_Check (Memorder)
    
        'Դաշտերի փոփոխում
        Select Case regsitered
        Case 0
            Call Fill_Memorder(MemorderEdit)
        Case 1
            'Ստուգել Գրասենյակ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","ACSBRANCH",True)
            'Ստուգել Բաժին դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","ACSDEPART",True) 
            'Ստուգել Ամսաթիվ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"General","DATE",True)
            'Փաստաթղթի N դաշտի ստացում
            Memorder.DocN = Get_Rekvizit_Value("Document",1,"General","DOCNUM") 
            'Ստուգել Հաշիվ Դեբետ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","ACCDB",True) 
            'Ստուգել Հաշիվ Կրեդիտ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","ACCCR",True) 
            'Ստուգել Արժույթ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","CUR",True) 
            'Ստուգել Գումար դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"General","SUMMA",True) 
            'Նպատակ դաշտի լրացում
            Call Rekvizit_Fill ("Document",1,"General","AIM","[Home]![End][Del]" & MemorderEdit.Aim) 
            'Ստուգել Ընդհ վճ համակարգ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","PAYSYSIN",True)
        End Select
        Call ClickCmdButton(1,"Î³ï³ñ»É") 
       
    Else 
        Log.Error "Can't Find the " & Memorder.DocN & "document",,,ErrorColor
    End If    
End Sub



Sub  Memorder_Window_Check (Memorder)
    If wMDIClient.WaitVBObject("frmASDocForm",2000).Exists Then 
        'Գրասենյակ դաշտի ստուգում
        Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",1,"Mask","ACSBRANCH"),Memorder.Div)
        'Բաժին դաշտի ստուգում
        Call Compare_Two_Values("Բաժին",Get_Rekvizit_Value("Document",1,"Mask","ACSDEPART"),Memorder.Dep)
        'Փաստաթղթի N դաշտի ստուգում    
        Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",1,"General","DOCNUM"),Memorder.DocN) 
        'Ամսաթիվ դաշտի ստուգում
        Call Compare_Two_Values("Ամսաթիվ",Get_Rekvizit_Value("Document",1,"General","DATE"),Memorder.MDate) 
        'Հաշիվ Դեբետ դաշտի ստուգում
        Call Compare_Two_Values("Հաշիվ Դեբետ",Get_Rekvizit_Value("Document",1,"Mask","ACCDB"),Memorder.AccD) 
        'Հաշիվ Կրեդիտ դաշտի ստուգում
        Call Compare_Two_Values("Հաշիվ Կրեդիտ",Get_Rekvizit_Value("Document",1,"Mask","ACCCR"),Memorder.AccC)   
        'Արժույթ դաշտի ստուգում
        Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",1,"Mask","CUR"),Memorder.Curr) 
        'Գումար դաշտի ստուգում
        Call Compare_Two_Values("Գումար",Get_Rekvizit_Value("Document",1,"General","SUMMA"),Memorder.Sum) 
        'Նպատակ դաշտի ստուգում
        Call Compare_Two_Values("Նպատակ",Get_Rekvizit_Value("Document",1,"Comment","AIM"),Memorder.Aim) 
        'Ընդհ վճ համակարգ դաշտի ստուգում
        Call Compare_Two_Values("Ընդհ վճ համակարգ",Get_Rekvizit_Value("Document",1,"Mask","PAYSYSIN"),Memorder.Paysys) 
    Else
        Log.Error "Doument window not found",,,ErrorColor
    End If    
End Sub

'Memorder-Պատուհանում լրացված լինելու ստուգվող տվյալներ
'PttelName- համապատասխան Pttel-ի անունը (օր.՝"frmPttel", "frmPttel_2")

Sub View_Memorder (Memorder,PttelName)

    If SearchInPttel(PttelName,2, Memorder.DocN) Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        BuiltIn.Delay(delay_middle)
        Call Memorder_Window_Check (Memorder)
        Call ClickCmdButton(1,"OK") 
    Else
        Log.Error "Can't Find the " & Memorder.DocN & "document",,,ErrorColor    
    End If
End Sub


Sub Memorder_Doc_Check (pathExp, N)

    Dim savePath, path1, regex
    
    savePath = Project.Path &  "Stores\MemorialOrder\"
    Call SaveDoc(savePath, "Memorder_Actual_" & N)
  
    path1 = savePath & "Memorder_Actual_" & N & ".txt"
    regex=".*\s*.*\sN\s\d{1,6}\s*.\d{1,10}\s{0,}.*\s.*\s.*\s.*Date\s\d{1,2}.\d{1,2}.\d{1,2}\s\d{1,2}:\d{1,2}"
    Call Compare_Files(path1, pathExp, regex)

End Sub



'--------------------------------------------------------
'Խմբային կրեդիտի օրդեր փաստաթղթի ընդհանուր էջի լրացման կլաս
'--------------------------------------------------------

Class Group_Credit_Order_Common
    Public isn
    Public branch
    Public dep
    Public docN
    Public mDate
    Public accD
    Public accC
    Public curr
    Public sum
    Public fullSum
    Public aim
    Public cAccsCount  
    Public cAccName
    Public cAccRowN
    Public tabN
    Private Sub Class_Initialize()
        isn = ""
        branch = ""
        dep = ""
        docN = ""
        mDate = ""
        accD = ""
        ReDim accC (aCount)
        ReDim sum (aCount)
        ReDim cAccName (aCount)
        ReDim cAccRowN (aCount)
        For cAccsCount = 0 to aCount
            accC(cAccsCount) = ""
            sum(cAccsCount) = "0.00"
            cAccName(cAccsCount) = ""
            cAccRowN(cAccsCount) = 0
        Next
        curr = ""
        fullSum = "0.00"
        aim = ""
        cAccsCount = aCount
        tabN = 1
    End Sub
End Class

Function New_Group_Credit_Order_Common()
         Set New_Group_Credit_Order_Common = New Group_Credit_Order_Common
End Function

Class Group_Credit_Order
    Public commonTab
    Public attachTab
    Private Sub Class_Initialize()
      Set commonTab = New_Group_Credit_Order_Common()
      Set attachTab = New_Attached_Tab(files_count, links_count, delete_count)
    End Sub
End Class

Function New_Group_Credit_Order(fCount, lCount, dCount)
    files_count = fCount
    links_count = lCount
    delete_count = dCount
    Set New_Group_Credit_Order = New Group_Credit_Order
End Function  

'Խմբային կրեդիտի օրդեր պատուհանի ընդհանուր բաժնի դաշտերի լրացում
Sub Fill_Group_Cred_Order_Common (grCredOrd)
    Dim docGrid, i, j, sTab, wTabStrip, expMessage, actualMessage, messageWin
    Call GoTo_ChoosedTab(1)  
    grCredOrd.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Գրասենյակ դաշտի լրացում
    Call Rekvizit_Fill ("Document",1,"General","ACSBRANCH",grCredOrd.branch)
    'Բաժին դաշտի լրացում
    Call Rekvizit_Fill ("Document",1,"General","ACSDEPART",grCredOrd.dep)
    'Փաստաթղթի N դաշտի ստացում
    grCredOrd.docN = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill ("Document",1,"General","DATE",grCredOrd.mDate)
    'Հաշիվ Դեբետ դաշտի լրացում
    Call Rekvizit_Fill ("Document",1,"General","ACCDB",grCredOrd.accD) 
    'Հաշիվ կրեդիտ դաշտերի լրացում եթե դրանք խմբագրվող են 
    Set docGrid = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
    docGrid.MoveFirst
    If not docGrid.Columns.Item(0).Locked Then
        For i = 0 to docGrid.ApproxCount
          With docGrid
              .row = 0
              .Keys ("^d")
          End With     
        Next 
        For i = 0 to grCredOrd.cAccsCount - 1
            With docGrid
                .Col = 0
                .row = i
                .Keys(grCredOrd.accC(i) & "[Enter]")  
                BuiltIn.Delay(1000)
                grCredOrd.cAccName(i) = .Columns.Item(1).Text
            End With  
        Next    
    End If 
    'Ստուգում է "Արժույթ" դաշտի արժեքը և չխմբագրվող լինելը 
    Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",1,"Mask","CUR"),grCredOrd.curr)
    Call Check_ReadOnly("Document",1,"Mask","CUR",True)
    'Ստանում է, թե հաշիվներից որը, որ տողում է գտնվում 
    For i = 0 to grCredOrd.cAccsCount - 1
        grCredOrd.cAccRowN(i) = Get_Cell_Row_Grid (0, "Document", 1, grCredOrd.accC(i))        
    Next     
    'Գումար դաշտերի լրացում
    docGrid.MoveFirst
    For i = 0 to grCredOrd.cAccsCount - 1
         For j = 0 to grCredOrd.cAccsCount - 1
             If docGrid.Columns.Item(0)= grCredOrd.accC(i) Then
                Exit For
             Else    
                 docGrid.keys("[Down]")
             End If    
         Next
         grCredOrd.cAccName(i) = docGrid.Columns.Item(1).Value 
         With docGrid
              .Col = 2
              .row = grCredOrd.cAccRowN(i)
              .Keys(grCredOrd.sum(i) & "[Enter]")
         End With 
         docGrid.MoveFirst  
    Next   
    'Ստուգում է "Ընդհամենը" դաշտի արժեքը և չխմբագրվող լինելը
    Call Check_ReadOnly("Document",1,"General","SUMMA",True)
    Call Compare_Two_Values("Ընդհամենը",Get_Rekvizit_Value("Document",1,"General","SUMMA"),grCredOrd.fullSum)
    'Նպատակ դաշտի լրացում
    Call Rekvizit_Fill ("Document",1,"General","AIM","[Home]![End][Del]" & grCredOrd.aim)
End Sub

'Հաշիվներ թղթապանակից Խմբային Կրեդիտի օրդեր ստեղծելու ֆունկցիա
'groupCreditOrder- խմբային կրեդիտի օրդերի կլասս
'caption - Կատարվող գործողույունը
'pttelName - Աղյուսակի անվանումը, (օր.՝"frmPttel", "frmPttel_2")
Sub Create_Group_Cred_Order(groupCreditOrder, caption, pttelName)
    Dim i, colLockedArray
    For i = 0 to groupCreditOrder.commonTab.cAccsCount - 1
        If SearchInPttel(pttelName, 1, groupCreditOrder.commonTab.accC(i)) Then
           wMDIClient.VBObject(pttelName). Keys("[Ins]")
        Else 
            Log.Error "Cannot find " & groupCreditOrder.commonTab.accC(i) & " account",,,ErrorColor
            Exit Sub   
        End If 
    Next
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click (c_Allactions)
    Call wMainForm.PopupMenu.Click (c_InnerOpers & "|" & c_CrPkOrd)
    BuiltIn.Delay(2000)
    colLockedArray = Array(True, True, False)
    
    If  wMDIClient.WaitVBObject("frmASDocForm",1000).exists Then
        Call Check_ReadOnly_Grid (3 , 1, colLockedArray)
        Call Fill_Group_Cred_Order_Common(groupCreditOrder.commonTab)
        BuiltIn.Delay(1000)
        Call Fill_Attached_Tab(groupCreditOrder.attachTab)
    Else
        Log.Error "Խմբային կրեդիտի օրդեր պատուհանը չի բացվել",,,ErrorColor 
    End If
    
    Call ClickCmdButton(1, caption)
    
End Sub

'Խմբային Կրեդիտի օրդեր պատուհանի ստուգում
'grCredOrd - խմբային կրեդիտի օրդերի կլասս
'colReadOnlyArray- Գումարներ աղյուսակի սյուների չխմբագրվող լինելու զանգված օր.՝ Array(True, False, True)
Sub Group_Cred_Order_Window_Check (grCredOrd, colReadOnlyArray)
    Dim docGrid, i, j, count, expCount
    Call GoTo_ChoosedTab(1)
    'Գրասենյակ դաշտի ստուգում
    Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",1,"Mask","ACSBRANCH"),grCredOrd.commonTab.branch)
    'Բաժին դաշտի ստուգում
    Call Compare_Two_Values("Բաժին",Get_Rekvizit_Value("Document",1,"Mask","ACSDEPART"),grCredOrd.commonTab.dep)
    'Փաստաթղթի N դաշտի ստուգում
    Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",1,"General","DOCNUM"),grCredOrd.commonTab.docN)
    'Ամսաթիվ դաշտի ստուգում
    Call Compare_Two_Values("Ամսաթիվ",Get_Rekvizit_Value("Document",1,"General","DATE"),grCredOrd.commonTab.mDate)
    'Հաշիվ Դեբետ դաշտի ստուգում
    Call Compare_Two_Values("Հաշիվ Դեբետ",Get_Rekvizit_Value("Document",1,"Mask","ACCDB"),grCredOrd.commonTab.accD)
    'Արժույթ դաշտի ստուգում
    Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",1,"Mask","CUR"),grCredOrd.commonTab.curr)  
    'Ընդհամենը դաշտի ստուգում
    Call Compare_Two_Values("Ընդհամենը",Get_Rekvizit_Value("Document",1,"General","SUMMA"),grCredOrd.commonTab.fullSum)
    'Նպատակ դաշտի ստուգում
    Call Compare_Two_Values("Նպատակ",Get_Rekvizit_Value("Document",1,"Comment","AIM"),grCredOrd.commonTab.aim)
    'Գումարներ աղյուսակի ստուգում
    Set docGrid = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
    docGrid.MoveFirst
    'Սյուների խմբագրվող լինելու ստուգում
    Call Check_ReadOnly_Grid (3 , 1, colReadOnlyArray)   
    For i = 0 to grCredOrd.commonTab.cAccsCount - 1
        'Հաշիվ կրեդիտ դաշտերի ստուգում
        Call Check_Value_Grid (0 ,grCredOrd.commonTab.cAccRowN(i), "Document", 1, grCredOrd.commonTab.accC(i))
        'Անվանում դաշտի ստուգում
        Call Check_Value_Grid (1 ,grCredOrd.commonTab.cAccRowN(i), "Document", 1, grCredOrd.commonTab.cAccName(i))
        'Գումար դաշտի ստուգում
        Call Check_Value_Grid (2 ,grCredOrd.commonTab.cAccRowN(i), "Document", 1, grCredOrd.commonTab.sum(i))      
    Next       
    'Անցում կցված Էջ
    Call GoTo_ChoosedTab(grCredOrd.attachTab.tabN)   
    ' Ստուգել, որ ֆայլերը առկա են 
    For i = 0 To grCredOrd.attachTab.filesCount - 1
        Call SearchInAttachList (grCredOrd.attachTab.fileName(i), grCredOrd.attachTab.tabN) 
    Next
    ' Ստուգել, որ հղումները առկա են
    For i = 0 To grCredOrd.attachTab.linksCount - 1
        Call SearchInAttachList (grCredOrd.attachTab.addLinks(i), grCredOrd.attachTab.tabN)
    Next
    'Համեմատում է Աղյուսակում առկա և ակնկալվող ֆայլերի և հղումների քանակը,առկա տողերի ավել քանակի դեպքում լոգավորում է Error
    count = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("AsAttachments1").VBObject("ListViewAttachments").wItemCount
    expCount = grCredOrd.attachTab.filesCount + grCredOrd.attachTab.linksCount
    If expCount < count Then
       Log.Error "Attached files and links count is " & count & ". Expected value is " & expCount ,,, ErrorColor
    End If  
End Sub

'Խմբային Կրեդիտի օրդերի խմբագրման ֆունկցիա
'groupCredOrder -հին արժեքներով կլասս
'groupCredOrderEdit- նոր արժեքներով կլասս
'registered-Հաշվառված լինելը
'           0-Ոչ
'           1-Այո
'pttelName- համապատասխան Pttel-ի անունը (օր.՝"frmPttel", "frmPttel_2")
Sub Edit_Group_Cred_Order (groupCredOrder, groupCredOrderEdit, registered, pttelName)
     Dim colReadOnlyArray, sTab, wTabStrip, docGrid, i
 
     If SearchInPttel(pttelName,2, groupCredOrder.commonTab.docN) Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_ToEdit)
        BuiltIn.Delay(delay_middle)
        Set docGrid = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
        'Դաշտերի փոփոխում
        Select Case registered
        Case 0
            If  wMDIClient.WaitVBObject("frmASDocForm",1000).exists Then
                'Պատուհանում լրացված տվյալների ստուգում
                colReadOnlyArray = Array(False, True, False)
                Call Group_Cred_Order_Window_Check (groupCredOrder, colReadOnlyArray)
                Call GoTo_ChoosedTab(1)
                Call Fill_Group_Cred_Order_Common(groupCredOrderEdit.commonTab)
                BuiltIn.Delay(1000)
                Call Fill_Attached_Tab(groupCredOrderEdit.attachTab)
            Else
                Log.Error "Խմբային կրեդիտի օրդեր պատուհանը չի բացվել",,,ErrorColor 
            End If
        Case 1
            'Ստանում է, թե հաշիվներից որը, որ տողում է գտնվում և Հաշիվների անվանումները 
            For i = 0 to groupCredOrderEdit.commonTab.cAccsCount - 1
                groupCredOrderEdit.commonTab.cAccRowN(i) = Get_Cell_Row_Grid (0, "Document", 1, groupCredOrderEdit.commonTab.accC(i))                                                          
                groupCredOrderEdit.commonTab.cAccName(i) = docGrid.Columns.Item(1).Value        
            Next
            colReadOnlyArray = Array(True, True, True)
            Call Group_Cred_Order_Window_Check (groupCredOrder, colReadOnlyArray)
            'Անցում Ընդհանուր էջ
            Call GoTo_ChoosedTab(1)
            groupCredOrderEdit.commonTab.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
            'Ստուգել Գրասենյակ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","ACSBRANCH",True)
            'Ստուգել Բաժին դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","ACSDEPART",True) 
            'Ստուգել Ամսաթիվ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"General","DATE",True) 
            'Ստուգել Փաստաթղթի N դաշտի խմբագրելիությունը
            groupCredOrderEdit.commonTab.docN = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
            Call Check_ReadOnly("Document",1,"General","DOCNUM",True)
            'Ստուգել Հաշիվ Դեբետ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","ACCDB",True) 
            'Ստուգել Արժույթ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","CUR",True) 
            'Ստուգել Ընդհամենը դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"General","SUMMA",True) 
            'Նպատակ դաշտի լրացում
            Call Rekvizit_Fill ("Document",1,"General","AIM","[Home]![End][Del]" & groupCredOrderEdit.commonTab.aim)
            '"Կցված" էջի լրացում
            Call Fill_Attached_Tab(groupCredOrderEdit.attachTab)
        End Select
        Call ClickCmdButton(1,"Î³ï³ñ»É")  
    Else 
        Log.Error "Can't Find the " & groupCredOrder.commonTab.docN & " document",,,ErrorColor
    End If 
End Sub

'Խմբային Կրեդիտի օրդերի Դիտելու ֆունկցիա
'grCredOrd -Խմբային Կրեդիտի օրդերի կլասս
'pttelName- համապատասխան Pttel-ի անունը (օր.՝"frmPttel", "frmPttel_2")
Sub View_Group_Cred_Order (grCredOrd, pttelName)
   Dim colReadOnlyArray
   BuiltIn.Delay (2000)
   If SearchInPttel(pttelName, 2, grCredOrd.commonTab.docN) Then
      BuiltIn.Delay(2000)
      Call wMainForm.MainMenu.Click (c_Allactions)
      Call wMainForm.PopupMenu.Click (c_View)
      BuiltIn.Delay(delay_middle)
      colReadOnlyArray = Array (True, True, True)
      Call Group_Cred_Order_Window_Check (grCredOrd, colReadOnlyArray)
      Call ClickCmdButton(1,"OK")
   Else 
       Log.Error "Can't Find the " & grCredOrd.commonTab.docN & "document",,,ErrorColor
   End If
End Sub

'Խմբային Կրեդիտի օրդեր փաստաթղթի տպելու ձևի համեմատում օրինակի հետ
Sub Group_Cred_Order_DocCheck (pathExp, N)

    Dim savePath, path1, regex
    
    savePath = Project.Path &  "Stores\MemorialOrder\"
    Call SaveDoc(savePath, "Group_Cred_Ord_Actual_" & N)
  
    path1 = savePath & "Group_Cred_Ord_Actual_" & N & ".txt"
    regex=".*\s*.*\sN\s\d{1,6}\s*.\d{1,10}\s{0,}.*\s.*\s.*\s.*Date\s\d{1,2}.\d{1,2}.\d{1,2}\s\d{1,2}:\d{1,2}"
    Call Compare_Files(path1, pathExp, regex)

End Sub

'--------------------------------------------------------
'Խմբային դեբետի օրդեր փաստաթղթի ընդհանուր էջի լրացման կլաս
'--------------------------------------------------------

Class Group_Debet_Order_Common
    Public isn
    Public branch
    Public dep
    Public docN
    Public mDate
    Public accC
    Public accD
    Public curr
    Public sum
    Public fullSum
    Public aim
    Public dAccsCount
    Public dAccName
    Public dAccRowN 
    Public tabN
    Private Sub Class_Initialize()
        isn = ""
        branch = "88"
        dep = ""
        docN = ""
        mDate = ""
        accC = ""
        ReDim accD (aCount)
        ReDim sum (aCount)
        ReDim dAccName (aCount)
        ReDim dAccRowN (aCount)
        For dAccsCount = 0 to aCount
            accD(dAccsCount) = ""
            sum(dAccsCount) = "0.00"
            dAccName(dAccsCount) = ""
            dAccRowN(dAccsCount) = 0
        Next
        curr = ""
        fullSum = "0.00"
        aim = ""
        dAccsCount = aCount
        tabN = 1
    End Sub
End Class

Function New_Group_Debet_Order_Common()
         Set New_Group_Debet_Order_Common = New Group_Debet_Order_Common
End Function

Class Group_Debet_Order
    Public commonTab
    Public attachTab
    Private Sub Class_Initialize()
      Set commonTab = New_Group_Debet_Order_Common()
      Set attachTab = New_Attached_Tab(files_count, links_count, delete_count)
    End Sub
End Class

Function New_Group_Debet_Order(fCount, lCount, dCount)
    files_count = fCount
    links_count = lCount
    delete_count = dCount
    Set New_Group_Debet_Order = New Group_Debet_Order
End Function  

'Խմբային դեբետի օրդեր պատուհանի ընդհանուր բաժնի դաշտերի լրացում
Sub Fill_Group_Deb_Order_Common (grDebOrd)
    Dim docGrid, i, j, sTab, wTabStrip, expMessage, actualMessage, messageWin
    Call GoTo_ChoosedTab(1)  
    grDebOrd.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Գրասենյակ դաշտի լրացում
    Call Rekvizit_Fill ("Document",1,"General","ACSBRANCH",grDebOrd.branch)
    'Բաժին դաշտի լրացում
    Call Rekvizit_Fill ("Document",1,"General","ACSDEPART",grDebOrd.dep)
    'Փաստաթղթի N դաշտի ստացում
    grDebOrd.docN = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
    'Ամսաթիվ դաշտի լրացում
    Call Rekvizit_Fill ("Document",1,"General","DATE",grDebOrd.mDate)
    'Հաշիվ Կրեդիտ դաշտի լրացում
    Call Rekvizit_Fill ("Document",1,"General","ACCCR",grDebOrd.accC)
    expMessage = grDebOrd.accC & "  Ñ³ßíÇ ³ñÅáõÛÃÇ ³ÝÑ³Ù³å³ï³ëË³ÝáõÃÛáõÝ"
    Set messageWin = p1.WaitVBObject("frmAsMsgBox",2000) 
    If messageWin.Exists Then
       actualMessage = p1.VBObject("frmAsMsgBox").VBObject("lblMessage").NativeVBObject
       If Trim(expMessage) = Trim (actualMessage) Then
          Call ClickCmdButton(5, "OK" )
       Else
           Log. Error "Actual message is " & actualMessage 
       End If        
    End If 
    'Հաշիվ դեբետ դաշտերի լրացում եթե դրանք խմբագրվող են 
    Set docGrid = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
    docGrid.MoveFirst
    If not docGrid.Columns.Item(0).Locked Then
        If grDebOrd.dAccsCount <> docGrid.ApproxCount + 1 Then
            For i = 0 to docGrid.ApproxCount
              With docGrid
                  .row = 0
                  .Keys ("^d")
              End With     
            Next
        End If       
        For i = 0 to grDebOrd.dAccsCount - 1
            With docGrid
                .Col = 0
                .row = i
                .Keys(grDebOrd.accD(i) & "[Enter]")  
                BuiltIn.Delay(1000)
                grDebOrd.dAccName(i) = .Columns.Item(1).Text
            End With  
        Next    
    End If 
    'Ստանում է, թե հաշիվներից որը, որ տողում է գտնվում 
    For i = 0 to grDebOrd.dAccsCount - 1
        grDebOrd.dAccRowN(i) = Get_Cell_Row_Grid (0, "Document", 1, grDebOrd.accD(i))        
    Next     
    'Գումար դաշտերի լրացում
    docGrid.MoveFirst
    For i = 0 to grDebOrd.dAccsCount - 1
         For j = 0 to grDebOrd.dAccsCount - 1
             If docGrid.Columns.Item(0)= grDebOrd.accD(i) Then
                Exit For
             Else    
                 docGrid.keys("[Down]")
             End If    
         Next
         grDebOrd.dAccName(i) = docGrid.Columns.Item(1).Value 
         With docGrid
              .Col = 2
              .row = grDebOrd.dAccRowN(i) 
              .Keys(grDebOrd.sum(i) & "[Enter]")
         End With 
         docGrid.MoveFirst  
    Next   
    'Ստուգում է "Արժույթ" դաշտի արժեքը և չխմբագրվող լինելը 
    Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",1,"Mask","CUR"),grDebOrd.curr)
    Call Check_ReadOnly("Document",1,"Mask","CUR",True)
    'Ստուգում է "Ընդհամենը" դաշտի արժեքը և չխմբագրվող լինելը
    Call Check_ReadOnly("Document",1,"General","SUMMA",True)
    Call Compare_Two_Values("Ընդհամենը",Get_Rekvizit_Value("Document",1,"General","SUMMA"),grDebOrd.fullSum)
    'Նպատակ դաշտի լրացում
    Call Rekvizit_Fill ("Document",1,"General","AIM","[Home]![End][Del]" & grDebOrd.aim)
End Sub

'Հաշիվներ թղթապանակից Խմբային Դեբետի օրդեր ստեղծելու ֆունկցիա
'groupDebetOrder- խմբային դեբետի օրդերի կլասս
'caption - Կատարվող գործողույունը
'pttelName - Աղյուսակի անվանումը, (օր.՝"frmPttel", "frmPttel_2")
Sub Create_Group_Deb_Order(groupDebetOrder, caption, pttelName)
    Dim i, colLockedArray
    For i = 0 to groupDebetOrder.commonTab.dAccsCount - 1
        If SearchInPttel(pttelName, 1, groupDebetOrder.commonTab.accD(i)) Then
           wMDIClient.VBObject(pttelName). Keys("[Ins]")
        Else 
            Log.Error "Cannot find " & groupCreditOrder.commonTab.accD(i) & " account",,,ErrorColor
            Exit Sub   
        End If 
    Next
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click (c_Allactions)
    Call wMainForm.PopupMenu.Click (c_InnerOpers & "|" & c_DbPkOrd)
    BuiltIn.Delay(2000)
    colLockedArray = Array(True, True, False)
    
    If  wMDIClient.WaitVBObject("frmASDocForm",1000).exists Then
        Call Check_ReadOnly_Grid (3 ,1, colLockedArray)
        Call Fill_Group_Deb_Order_Common(groupDebetOrder.commonTab)
        BuiltIn.Delay(1000)
        Call Fill_Attached_Tab(groupDebetOrder.attachTab)
    Else
        Log.Error "Խմբային Դեբետի օրդեր պատուհանը չի բացվել",,,ErrorColor 
    End If
    
    Call ClickCmdButton(1, caption)
    
End Sub

'Խմբային Դեբետի օրդեր պատուհանի ստուգում
'grDebOrd - խմբային Դեբետի օրդերի կլասս
'colReadOnlyArray- Գումարներ աղյուսակի սյուների չխմբագրվող լինելու զանգված օր.՝ Array(True, False, True)
Sub Group_Deb_Order_Window_Check (grDebOrd, colReadOnlyArray)
    Dim docGrid, i, j, count, expCount
    Call GoTo_ChoosedTab(1)
    'Գրասենյակ դաշտի ստուգում
    Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",1,"Mask","ACSBRANCH"),grDebOrd.commonTab.branch)
    'Բաժին դաշտի ստուգում
    Call Compare_Two_Values("Բաժին",Get_Rekvizit_Value("Document",1,"Mask","ACSDEPART"),grDebOrd.commonTab.dep)
    'Փաստաթղթի N դաշտի ստուգում
    Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",1,"General","DOCNUM"),grDebOrd.commonTab.docN)
    'Ամսաթիվ դաշտի ստուգում
    Call Compare_Two_Values("Ամսաթիվ",Get_Rekvizit_Value("Document",1,"General","DATE"),grDebOrd.commonTab.mDate)
    'Հաշիվ Կրեդիտ դաշտի ստուգում
    Call Compare_Two_Values("Հաշիվ Կրեդիտ",Get_Rekvizit_Value("Document",1,"Mask","ACCCR"),grDebOrd.commonTab.accC)
    'Արժույթ դաշտի ստուգում
    Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",1,"Mask","CUR"),grDebOrd.commonTab.curr)  
    'Ընդհամենը դաշտի ստուգում
    Call Compare_Two_Values("Ընդհամենը",Get_Rekvizit_Value("Document",1,"General","SUMMA"),grDebOrd.commonTab.fullSum)
    'Նպատակ դաշտի ստուգում
    Call Compare_Two_Values("Նպատակ",Get_Rekvizit_Value("Document",1,"Comment","AIM"),grDebOrd.commonTab.aim)
    'Գումարներ աղյուսակի ստուգում
    Set docGrid = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
    docGrid.MoveFirst
    'Սյուների խմբագրվող լինելու ստուգում
    Call Check_ReadOnly_Grid (3 , 1, colReadOnlyArray)   
    For i = 0 to grDebOrd.commonTab.dAccsCount - 1
        'Հաշիվ Դեբետ դաշտերի ստուգում
        Call Check_Value_Grid (0 ,grDebOrd.commonTab.dAccRowN(i), "Document", 1, grDebOrd.commonTab.accD(i))
        'Անվանում դաշտի ստուգում
        Call Check_Value_Grid (1 ,grDebOrd.commonTab.dAccRowN(i), "Document", 1, grDebOrd.commonTab.dAccName(i))
        'Գումար դաշտի ստուգում
        Call Check_Value_Grid (2 ,grDebOrd.commonTab.dAccRowN(i), "Document", 1, grDebOrd.commonTab.sum(i))      
    Next       
    'Անցում կցված Էջ
    Call GoTo_ChoosedTab(grDebOrd.attachTab.tabN)   
    ' Ստուգել, որ ֆայլերը առկա են 
    For i = 0 To grDebOrd.attachTab.filesCount - 1
        Call SearchInAttachList (grDebOrd.attachTab.fileName(i), grDebOrd.attachTab.tabN) 
    Next
    ' Ստուգել, որ հղումները առկա են
    For i = 0 To grDebOrd.attachTab.linksCount - 1
        Call SearchInAttachList (grDebOrd.attachTab.addLinks(i), grDebOrd.attachTab.tabN)
    Next
    'Համեմատում է Աղյուսակում առկա և ակնկալվող ֆայլերի և հղումների քանակը,առկա տողերի ավել քանակի դեպքում լոգավորում է Error
    count = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("AsAttachments1").VBObject("ListViewAttachments").wItemCount
    expCount = grDebOrd.attachTab.filesCount + grDebOrd.attachTab.linksCount
    If expCount < count Then
       Log.Error "Attached files and links count is " & count & ". Expected value is " & expCount ,,, ErrorColor
    End If    
    
End Sub

'Խմբային Դեբետի օրդերի խմբագրման ֆունկցիա
'groupDebOrder -հին արժեքներով կլասս
'groupDebOrderEdit- նոր արժեքներով կլասս
'registered-Հաշվառված լինելը
'           0-Ոչ
'           1-Այո
'pttelName- համապատասխան Pttel-ի անունը (օր.՝"frmPttel", "frmPttel_2")
Sub Edit_Group_Deb_Order (groupDebOrder, groupDebOrderEdit, registered, pttelName)
     Dim colReadOnlyArray, sTab, wTabStrip, docGrid, i
 
     If SearchInPttel(pttelName,2, groupDebOrder.commonTab.docN) Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_ToEdit)
        BuiltIn.Delay(delay_middle)
        Set docGrid = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
        'Դաշտերի փոփոխում
        Select Case registered
        Case 0
            If  wMDIClient.WaitVBObject("frmASDocForm",1000).exists Then
                'Պատուհանում լրացված տվյալների ստուգում
                colReadOnlyArray = Array(False, True, False)
                Call Group_Deb_Order_Window_Check (groupDebOrder, colReadOnlyArray)
                Call GoTo_ChoosedTab(1)
                Call Fill_Group_Deb_Order_Common(groupDebOrderEdit.commonTab)
                BuiltIn.Delay(1000)
                Call Fill_Attached_Tab(groupDebOrderEdit.attachTab)
            Else
                Log.Error "Խմբային կրեդիտի օրդեր պատուհանը չի բացվել",,,ErrorColor 
            End If
        Case 1
            'Ստանում է, թե հաշիվներից որը, որ տողում է գտնվում և Հաշիվների անվանումները 
            For i = 0 to groupDebOrderEdit.commonTab.dAccsCount - 1
                groupDebOrderEdit.commonTab.dAccRowN(i) = Get_Cell_Row_Grid (0, "Document", 1, groupDebOrderEdit.commonTab.accD(i))                                             
                groupDebOrderEdit.commonTab.dAccName(i) = docGrid.Columns.Item(1).Value        
            Next
            colReadOnlyArray = Array(True, True, True)
            Call Group_Deb_Order_Window_Check (groupDebOrder, colReadOnlyArray)
            'Անցում Ընդհանուր էջ
            Call GoTo_ChoosedTab(1)
            groupDebOrderEdit.commonTab.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
            'Ստուգել Գրասենյակ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","ACSBRANCH",True)
            'Ստուգել Բաժին դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","ACSDEPART",True) 
            'Ստուգել Ամսաթիվ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"General","DATE",True) 
            'Ստուգել Փաստաթղթի N դաշտի խմբագրելիությունը
            groupDebOrderEdit.commonTab.docN = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
            Call Check_ReadOnly("Document",1,"General","DOCNUM",True)
            'Ստուգել Հաշիվ Կրեդիտ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","ACCCR",True) 
            'Ստուգել Արժույթ դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"Mask","CUR",True) 
            'Ստուգել Ընդհամենը դաշտի խմբագրելիությունը
            Call Check_ReadOnly("Document",1,"General","SUMMA",True) 
            'Նպատակ դաշտի լրացում
            Call Rekvizit_Fill ("Document",1,"General","AIM","[Home]![End][Del]" & groupDebOrderEdit.commonTab.aim)
            '"Կցված" էջի լրացում
            Call Fill_Attached_Tab (groupDebOrderEdit.attachTab)
        End Select
        Call ClickCmdButton(1,"Î³ï³ñ»É")  
    Else 
        Log.Error "Can't Find the " & groupDebOrder.commonTab.docN & " document",,,ErrorColor
    End If 
End Sub

'Խմբային Դեբետի օրդերի Դիտելու ֆունկցիա
'grDebOrd -Խմբային Դեբետի օրդերի կլասս
'pttelName- համապատասխան Pttel-ի անունը (օր.՝"frmPttel", "frmPttel_2")
Sub View_Group_Deb_Order (grDebOrd, pttelName)
    Dim colReadOnlyArray
    BuiltIn.Delay (2000)
    If SearchInPttel(pttelName, 2, grDebOrd.commonTab.docN) Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        BuiltIn.Delay(delay_middle)
        colReadOnlyArray = Array (True, True, True)
        Call Group_Deb_Order_Window_Check (grDebOrd, colReadOnlyArray)
        Call ClickCmdButton(1,"OK")
    ElseIf SearchInPttel(pttelName, 2, grDebOrd.commonTab.isn) Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        BuiltIn.Delay(delay_middle)
        colReadOnlyArray = Array (True, True, True)
        Call Group_Deb_Order_Window_Check (grDebOrd, colReadOnlyArray)
        Call ClickCmdButton(1,"OK")

   Else 
       Log.Error "Can't Find the " & grDebOrd.commonTab.docN & "document",,,ErrorColor
   End If
End Sub

'Խմբային Դեբետի օրդեր փաստաթղթի տպելու ձևի համեմատում օրինակի հետ
Sub Group_Deb_Order_DocCheck (pathExp, N)

    Dim savePath, path1, regex
    
    savePath = Project.Path &  "Stores\MemorialOrder\"
    Call SaveDoc(savePath, "Group_Deb_Ord_Actual_" & N)
  
    path1 = savePath & "Group_Deb_Ord_Actual_" & N & ".txt"
    regex=".*\s*.*\sN\s\d{1,6}\s*.\d{1,10}\s{0,}.*\s.*\s.*\s.*Date\s\d{1,2}.\d{1,2}.\d{1,2}\s\d{1,2}:\d{1,2}"
    Call Compare_Files(path1, pathExp, regex)

End Sub

'--------------------------------------------------------
'Խմբային Հիշարար օրդեր փաստաթղթի ընդհանուր էջի լրացման կլաս
'--------------------------------------------------------
Class Group_Mem_Order_Common
    Public isn
    Public branch
    Public dep
    Public docN
    Public mDate
    Public accC 
    Public accD
    Public curr
    Public sum
    Public fullSum
    Public aim 
    Public accCount
    Public tabN
    Public paysys
    Private Sub Class_Initialize()
        isn = ""
        branch = ""
        dep = ""
        docN = ""
        mDate = ""
        ReDim accC (aCount)
        ReDim accD (aCount)
        ReDim sum (aCount)
        ReDim aim (aCount)
        For accCount = 0 to aCount
            accD(accCount) = ""
            accC(accCount) = ""
            sum(accCount) = "0.00"
            aim(accCount) = ""
        Next
        curr = ""
        fullSum = "0.00"
        paysys = ""
        accCount = 0
        tabN = 1
    End Sub
End Class

Function New_Group_Mem_Order_Common()
         Set New_Group_Mem_Order_Common = New Group_Mem_Order_Common
End Function

Class Group_Mem_Order
    Public commonTab
    Public attachTab
    Private Sub Class_Initialize()
      Set commonTab = New_Group_Mem_Order_Common()
      Set attachTab = New_Attached_Tab(files_count, links_count, delete_count)
    End Sub
End Class

Function New_Group_Mem_Order(fCount, lCount, dCount)
    files_count = fCount
    links_count = lCount
    delete_count = dCount
    Set New_Group_Mem_Order = New Group_Mem_Order
End Function

'Խմբային Հիշարար օրդեր պատուհանի ընդհանուր բաժնի դաշտերի լրացում
Sub Fill_Group_Mem_Order_Common (grMemOrd)
    Dim docGrid, i, j, sTab, wTabStrip, expMessage, actualMessage, messageWin
    Call GoTo_ChoosedTab(1)  
    'Փաստաթղթի Isn-ի ստացում
    grMemOrd.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Փաստաթղթի N դաշտի ստացում
    grMemOrd.docN = Get_Rekvizit_Value("Document",1,"General","DOCNUM")
    'Գումարներ աղյուսակի լրացում
    Set docGrid = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
    docGrid.MoveFirst
    'Ըստ սյուների խմբագրվող լինելու ստուգվում է փատաթղթի հաշվառված լինելը և որոշվում լրացվող տողերը
    If Not docGrid.Columns.Item(0).Locked Then
        For i = 0 to docGrid.ApproxCount
          With docGrid
              .row = 0
              .Keys ("^d")
          End With     
        Next   
        For i = 0 to grMemOrd.accCount - 1
            With docGrid
                'Հաշիվ դեբետ սյան լրացում
                .Col = 0
                .row = i
                .Keys(grMemOrd.accD(i) & "[Enter]")  
                BuiltIn.Delay(1000)
                'Հաշիվ դեբետ սյան լրացում
                .Col = 1
                .row = i
                .Keys(grMemOrd.accC(i) & "[Enter]")  
                BuiltIn.Delay(1000)
                'Գումար սյան լրացում
                .Col = 2
                .row = i
                .Keys(grMemOrd.sum(i) & "[Enter]")  
                BuiltIn.Delay(1000)
                'Նպատակ սյան լրացում
                .Col = 3
                .row = i
                .Keys(grMemOrd.aim(i) & "[Enter]")  
                BuiltIn.Delay(1000)
            End With  
        Next
        With docGrid
             .row = .ApproxCount
             If Trim(.Columns.Item(0).Value) = "" Then
                .Keys("^d")
             End If   
        End With
        'Գրասենյակ դաշտի լրացում
        Call Rekvizit_Fill ("Document",1,"General","ACSBRANCH",grMemOrd.branch)
        'Բաժին դաշտի լրացում
        Call Rekvizit_Fill ("Document",1,"General","ACSDEPART",grMemOrd.dep)
        'Ամսաթիվ դաշտի լրացում
        Call Rekvizit_Fill ("Document",1,"General","DATE",grMemOrd.mDate) 
        'Ընդ. վճ. համակարգ դաշտի լրացում
        Call Rekvizit_Fill ("Document",1,"General","PAYSYSIN",grMemOrd.paysys)   
    
    ElseIf Not docGrid.Columns.Item(3).Locked Then
        For i = 0 to grMemOrd.accCount - 1
            With docGrid
                'Նպատակ սյան լրացում
                .Col = 3
                .row = i
                .Keys(grMemOrd.aim(i) & "[Enter]")  
                BuiltIn.Delay(1000)
            End With
         Next 
         'Ստուգել Գրասենյակ դաշտի խմբագրելիությունը
         Call Check_ReadOnly("Document",1,"Mask","ACSBRANCH",True)
         'Ստուգել Բաժին դաշտի խմբագրելիությունը
         Call Check_ReadOnly("Document",1,"Mask","ACSDEPART",True) 
         'Ստուգել Ամսաթիվ դաշտի խմբագրելիությունը
         Call Check_ReadOnly("Document",1,"General","DATE",True)
         'Ստուգել Ընդհ վճ համակարգ դաշտի խմբագրելիությունը
         Call Check_ReadOnly("Document",1,"Mask","PAYSYSIN",True)           
    End If 
    'Ստուգում է "Արժույթ" դաշտի արժեքը և չխմբագրվող լինելը 
    Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",1,"Mask","CUR"),grMemOrd.curr)
    Call Check_ReadOnly("Document",1,"Mask","CUR",True)
    'Ստուգում է "Ընդհամենը" դաշտի արժեքը և չխմբագրվող լինելը
    Call Check_ReadOnly("Document",1,"General","SUMMA",True)
    Call Compare_Two_Values("Ընդհամենը",Get_Rekvizit_Value("Document",1,"General","SUMMA"),grMemOrd.fullSum)
End Sub


'Խմբային Հիշարար օրդեր ստեղծելու ֆունկցիա
'groupMemOrder- խմբային Հիշարար օրդերի կլասս
'buttonCaption - Կատարվող գործողույունը
'pttelName - Աղյուսակի անվանումը, (օր.՝"frmPttel", "frmPttel_2")
'workspace - ԱՇՏ-ն որտեղից կատարվում է գործողությունը
Sub Create_Group_Mem_Order(groupMemOrder, buttonCaption, pttelName, workspace)
    Dim colLockedArray
    Call wTreeView.DblClickItem("|" & workspace & "|Üáñ ÷³ëï³ÃÕÃ»ñ|ì×³ñ³ÛÇÝ ÷³ëï³ÃÕÃ»ñ|Ü»ñùÇÝ ·áñÍ³ñùÝ»ñ|ÊÙµ³ÛÇÝ ÑÇß³ñ³ñ ûñ¹»ñ")    
    colLockedArray = Array(False, False, False, False)
    
    If  wMDIClient.WaitVBObject("frmASDocForm",3000).exists Then
        Call Check_ReadOnly_Grid (4, 1, colLockedArray)
        Call Fill_Group_Mem_Order_Common(groupMemOrder.commonTab)
        BuiltIn.Delay(1000)
        Call Fill_Attached_Tab(groupMemOrder.attachTab)
        Call ClickCmdButton(1, buttonCaption)
    Else
        Log.Error "Խմբային Հիշարար օրդեր պատուհանը չի բացվել",,,ErrorColor 
    End If
End Sub    

'Խմբային Հիշարար օրդեր պատուհանի ստուգում
'grMemOrd - խմբային Հիշարար օրդերի կլասս
'colReadOnlyArray- Գումարներ աղյուսակի սյուների չխմբագրվող լինելու զանգված օր.՝ Array(True, False, True, False)
Sub Group_Mem_Order_Window_Check (grMemOrd, colReadOnlyArray)
    Dim docGrid, i, j, count, expCount
    Call GoTo_ChoosedTab(1)
    'Գրասենյակ դաշտի ստուգում
    Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",1,"Mask","ACSBRANCH"),grMemOrd.commonTab.branch)
    'Բաժին դաշտի ստուգում
    Call Compare_Two_Values("Բաժին",Get_Rekvizit_Value("Document",1,"Mask","ACSDEPART"),grMemOrd.commonTab.dep)
    'Փաստաթղթի N դաշտի ստուգում
    Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",1,"General","DOCNUM"),grMemOrd.commonTab.docN)
    'Ամսաթիվ դաշտի ստուգում
    Call Compare_Two_Values("Ամսաթիվ",Get_Rekvizit_Value("Document",1,"General","DATE"),grMemOrd.commonTab.mDate)
    'Արժույթ դաշտի ստուգում
    Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",1,"Mask","CUR"),grMemOrd.commonTab.curr)  
    'Ընդհամենը դաշտի ստուգում
    Call Compare_Two_Values("Ընդհամենը",Get_Rekvizit_Value("Document",1,"General","SUMMA"),grMemOrd.commonTab.fullSum)
    'Ընդհ վճ համակարգ դաշտի ստուգում
    Call Compare_Two_Values("Ընդհ վճ համակարգ",Get_Rekvizit_Value("Document",1,"Mask","PAYSYSIN"),grMemOrd.commonTab.paysys) 
    'Գումարներ աղյուսակի ստուգում
    Set docGrid = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
    docGrid.MoveFirst
    'Սյուների խմբագրվող լինելու ստուգում
    Call Check_ReadOnly_Grid (4, 1, colReadOnlyArray)   
    For i = 0 to grMemOrd.commonTab.accCount - 1
        'Հաշիվ Դեբետ դաշտերի ստուգում
        Call Check_Value_Grid (0 , i, "Document", 1, grMemOrd.commonTab.accD(i))
        'Հաշիվ կրեդիտ դաշտի ստուգում
        Call Check_Value_Grid (1 , i, "Document", 1, grMemOrd.commonTab.accC(i))
        'Գումար դաշտի ստուգում
        Call Check_Value_Grid (2 , i, "Document", 1, grMemOrd.commonTab.sum(i))
        'Նպատակ դաշտի ստուգում
        Call Check_Value_Grid (3 , i, "Document", 1, grMemOrd.commonTab.aim(i))            
    Next       
    'Անցում կցված Էջ
    Call GoTo_ChoosedTab(grMemOrd.attachTab.tabN)   
    ' Ստուգել, որ ֆայլերը առկա են 
    For i = 0 To grMemOrd.attachTab.filesCount - 1
        Call SearchInAttachList (grMemOrd.attachTab.fileName(i), grMemOrd.attachTab.tabN) 
    Next
    ' Ստուգել, որ հղումները առկա են
    For i = 0 To grMemOrd.attachTab.linksCount - 1
        Call SearchInAttachList (grMemOrd.attachTab.addLinks(i), grMemOrd.attachTab.tabN)
    Next
    'Համեմատում է Աղյուսակում առկա և ակնկալվող ֆայլերի և հղումների քանակը,առկա տողերի ավել քանակի դեպքում լոգավորում է Error
    count = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("AsAttachments1").VBObject("ListViewAttachments").wItemCount
    expCount = grMemOrd.attachTab.filesCount + grMemOrd.attachTab.linksCount
    If expCount < count Then
       Log.Error "Attached files and links count is " & count & ". Expected value is " & expCount ,,, ErrorColor
    End If     
End Sub

'Խմբային Հիշարար օրդերի Դիտելու ֆունկցիա
'grMemOrd -Խմբային Հիշարար օրդերի կլասս
'pttelName- համապատասխան Pttel-ի անունը (օր.՝"frmPttel", "frmPttel_2")
Sub View_Group_Mem_Order (grMemOrd, pttelName)
    Dim colReadOnlyArray
    BuiltIn.Delay (2000)
    If SearchInPttel(pttelName, 2, grMemOrd.commonTab.docN) Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        BuiltIn.Delay(delay_middle)
        colReadOnlyArray = Array (True, True, True, True)
        Call Group_Mem_Order_Window_Check (grMemOrd, colReadOnlyArray)
        Call ClickCmdButton(1,"OK")
    ElseIf SearchInPttel(pttelName, 2, grMemOrd.commonTab.isn) Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_View)
        BuiltIn.Delay(delay_middle)
        colReadOnlyArray = Array (True, True, True, True)
        Call Group_Mem_Order_Window_Check (grMemOrd, colReadOnlyArray)
        Call ClickCmdButton(1,"OK")
   Else 
       Log.Error "Can't Find the " & grMemOrd.commonTab.docN & "document",,,ErrorColor
   End If
End Sub


'Խմբային Հիշարար օրդերի խմբագրման ֆունկցիա
'groupMemOrder -հին արժեքներով կլասս
'groupMemOrderEdit- նոր արժեքներով կլասս
'registered-Հաշվառված լինելը
'           0-Ոչ
'           1-Այո
'pttelName- համապատասխան Pttel-ի անունը (օր.՝"frmPttel", "frmPttel_2")
Sub Edit_Group_Mem_Order (groupMemOrder, groupMemOrderEdit, registered, pttelName)
     Dim colReadOnlyArray, sTab, wTabStrip, docGrid, i
 
     If SearchInPttel(pttelName,2, groupMemOrder.commonTab.docN) Then
        BuiltIn.Delay(2000)
        Call wMainForm.MainMenu.Click (c_Allactions)
        Call wMainForm.PopupMenu.Click (c_ToEdit)
        BuiltIn.Delay(delay_middle)
        Set docGrid = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
        Select Case registered
        Case 0
             colReadOnlyArray = Array(False, False, False, False)
        Case 1
             colReadOnlyArray = Array(True, True, True, False)
        End Select    
            If  wMDIClient.WaitVBObject("frmASDocForm",1000).exists Then
                'Պատուհանում լրացված տվյալների ստուգում
                Call Group_Mem_Order_Window_Check (groupMemOrder, colReadOnlyArray)
                'Դաշտերի փոփոխում
                Call Fill_Group_Mem_Order_Common(groupMemOrderEdit.commonTab)
                BuiltIn.Delay(1000)
                Call Fill_Attached_Tab(groupMemOrderEdit.attachTab)
            Else
                Log.Error "Խմբային Հիշարար օրդեր պատուհանը չի բացվել",,,ErrorColor 
            End If
        
        Call ClickCmdButton(1,"Î³ï³ñ»É")  
    Else 
        Log.Error "Can't Find the " & groupMemOrder.commonTab.docN & " document",,,ErrorColor
    End If 
End Sub


'Խմբային Հիշարար օրդեր փաստաթղթի տպելու ձևի համեմատում օրինակի հետ
Sub Group_Mem_Order_DocCheck (pathExp, N)

    Dim savePath, path1, regex
    
    savePath = Project.Path &  "Stores\MemorialOrder\"
    Call SaveDoc(savePath, "Group_Mem_Ord_Actual_" & N)
  
    path1 = savePath & "Group_Mem_Ord_Actual_" & N & ".txt"
    regex=".*\s*.*\sN\s\d{1,6}\s*.\d{1,10}\s{0,}.*\s.*\s.*\s.*Date\s\d{1,2}.\d{1,2}.\d{1,2}\s\d{1,2}:\d{1,2}"
    Call Compare_Files(path1, pathExp, regex)

End Sub


Class GroupMemOrderCurrency
    Public isn
    Public branch
    Public dep
    Public docN
    Public fDate
    Public accD()
    Public curD()
    Public sumD()
    Public accC()
    Public curC()
    Public sumC()
    Public aim()
    Public rowN ()
    Public opCount
    Public exchangeIncome
    Public exchangeExpanse
    Public paySys
    Public opType
    Public opPlace
    Public time
    Public attachTab
    
    Private Sub Class_Initialize()
        isn = ""
        branch = ""
        dep = ""
        docN = ""
        fDate = ""
        ReDim accD (aCount)
        ReDim sumD (aCount)
        ReDim curD (aCount)
        ReDim accC (aCount)
        ReDim sumC (aCount)
        ReDim curC (aCount)
        ReDim aim (aCount)
        ReDim rowN (aCount)
        For opCount = 0 to aCount
            accD(opCount) = ""
            curD(opCount) = ""
            sumD(opCount) = "0.00"
            accC(opCount) = ""
            curC(opCount) = ""
            sumC(opCount) = "0.00"
            aim(opCount) = ""
            rowN (opCount) = opCount 
        Next
        exchangeIncome = ""
        exchangeExpanse = ""
        paySys = ""
        opType = ""
        opPlace = ""
        If aqDateTime.Compare(aqConvert.DateTimeToFormatStr(aqDateTime.Time, "%H:%M"), "16:00") < 0 Then
            time = "1"
        Else
            time = "2"
        End If
        opCount = aCount
        Set attachTab = New_Attached_Tab(files_count, links_count, delete_count)
        attachTab.tabN = 3
    End Sub
    
End Class

Function New_Group_Mem_Order_Cur(operCount, fCount, lCount, dCount)
    files_count = fCount
    links_count = lCount
    delete_count = dCount
    aCount = operCount
    Set New_Group_Mem_Order_Cur = New GroupMemOrderCurrency
End Function

Sub Group_Mem_Order_Cur_Check(grMemOrdCur)
    dim docGrid, i
    dim tabN:tabN = 1
    Call GoTo_ChoosedTab(tabN)
    'Փաստաթղթի isn-ի ստացում
    grMemOrdCur.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Գրասենյակ դաշտի ստուգում
    Call Compare_Two_Values("Գրասենյակ",Get_Rekvizit_Value("Document",tabN,"Mask","ACSBRANCH"),grMemOrdCur.branch)
    'Բաժին դաշտի ստուգում
    Call Compare_Two_Values("Բաժին",Get_Rekvizit_Value("Document",tabN,"Mask","ACSDEPART"),grMemOrdCur.dep)
    'Փաստաթղթի N դաշտի ստուգում
    Call Compare_Two_Values("Փաստաթղթի N",Get_Rekvizit_Value("Document",tabN,"General","DOCNUM"),grMemOrdCur.docN)
    'Ամսաթիվ դաշտի ստուգում
    Call Compare_Two_Values("Ամսաթիվ",Get_Rekvizit_Value("Document",tabN,"General","DATE"),grMemOrdCur.fDate)
    'Գումարներ աղյուսակի ստուգում
    Set docGrid = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
    docGrid.MoveFirst 
    For i = 0 to grMemOrdCur.opCount - 1
        'Հաշիվ Դեբետ դաշտերի ստուգում
        Call Check_Value_Grid (0 , i, "Document", tabN, grMemOrdCur.accD(i))
        'Արժույթ Դեբետ դաշտի ստուգում
        Call Check_Value_Grid (1 , i, "Document", tabN, grMemOrdCur.curD(i))
        'Գումար Դեբետ դաշտի ստուգում
        Call Check_Value_Grid (2 , i, "Document", tabN, grMemOrdCur.sumD(i))
        'Հաշիվ Կրեդիտ դաշտերի ստուգում
        Call Check_Value_Grid (3 , i, "Document", tabN, grMemOrdCur.accC(i))
        'Արժույթ Կրեդիտ դաշտի ստուգում
        Call Check_Value_Grid (4 , i, "Document", tabN, grMemOrdCur.curC(i))
        'Գումար Կրեդիտ դաշտի ստուգում
        Call Check_Value_Grid (5 , i, "Document", tabN, grMemOrdCur.sumC(i))        
        'Նպատակ դաշտի ստուգում
        Call Check_Value_Grid (6 , i, "Document", tabN, grMemOrdCur.aim(i))            
    Next
    'Եկամուտներ արտ. փոխանցումից դաշտի ստուգում
    Call Compare_Two_Values("Եկամուտներ արտ. փոխանցումից",Get_Rekvizit_Value("Document",tabN,"Mask","INCACCCUREX"),grMemOrdCur.exchangeIncome)
    'Վնասներ արտ. փոխանցումից դաշտի ստուգում
    Call Compare_Two_Values("Վնասներ արտ. փոխանցումից",Get_Rekvizit_Value("Document",tabN,"Mask","EXPACCCUREX"),grMemOrdCur.exchangeExpanse)
    'Ընդհ վճ համակարգ դաշտի ստուգում
    Call Compare_Two_Values("Ընդհ վճ համակարգ",Get_Rekvizit_Value("Document",tabN,"Mask","PAYSYSIN"),grMemOrdCur.paysys) 
    
    tabN = 2
    Call GoTo_ChoosedTab(tabN)
    'Գործողության տեսակ դաշտի ստուգում
    Call Compare_Two_Values("Գործողության տեսակ",Get_Rekvizit_Value("Document",tabN,"Mask","CURTES"),grMemOrdCur.opType)
    'Գործողության վայր դաշտի ստուգում
    Call Compare_Two_Values("Գործողության վայր",Get_Rekvizit_Value("Document",tabN,"Mask","CURVAIR"),grMemOrdCur.opPlace)
    'Ժամանակ դաշտի ստուգում
    Call Compare_Two_Values("Ժամանակ",Get_Rekvizit_Value("Document",tabN,"Mask","TIME"),grMemOrdCur.time) 
    tabN = 3
    Call GoTo_ChoosedTab(tabN)
    Call Attach_Tab_Check (grMemOrdCur.attachTab)         
End Sub















