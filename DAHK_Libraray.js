'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Mortgage_Library
'USEUNIT Library_Contracts
Dim aCount
'---------------------------------------------------------------------------------------------
'Փոխել հաճախորդի կոդը՛
'---------------------------------------------------------------------------------------------
'clientCode - Հաճախորդ դաշտը արժեք 
Sub Change_Client(clientCode)

    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_ChangeClient)
    
    'Լրացնել Հաճախորդ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","CLICODE","![End]" & "[Del]" & clientCode)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
End Sub

'------------------------------------------------------------------------------------------------------------
'Գումարների արգելադրում
'------------------------------------------------------------------------------------------------------------
'blockSum - Արգելադրվող գումար
'debt - Պարտք
Sub Blocking_Money(blockSum,debt)

    BuiltIn.Delay(2000)
    Dim debtVal
    
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_BlockMoney)
    
    'Լրացնել Արգելադրվող գումար դաշտը
    Call Rekvizit_Fill("Document",1,"General","BLOCKSUM",blockSum)
    
    'Ստուգել Պարտք դաշտը  
    debtVal = Get_Rekvizit_Value("Document",1,"General","DEBT")
    
     If Not debtVal= debt Then 
            Log.Error("Debt is not " & debt)
    End If
    
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(1, "Î³ï³ñ»É")    
    
End Sub


'-------------------------------------------------------------------------------------------------------------------------
'Ստուգել Հաճախորդի թղթապանակում համապատասխան հաշվի Ստորին սահման դաշտի փոփխությունը
'-------------------------------------------------------------------------------------------------------------------------
'acc - հաշիվ
'summ - Ստորին սահման
Sub Check_Account_Low_Border(acc,summ)
    
    BuiltIn.Delay(2000)
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_ClFolder)
    
    If wMDIClient.WaitVBObject("frmPttel_2", 10000).Exists Then
        Do Until wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").EOF
            If Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(1).Text) = Trim(acc) Then
                wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Keys"[Enter]"
                Exit Do
            Else
                Call wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").MoveNext
            End If
        Loop
    Else
        Log.Message("The account doesn't exists in frmPttel")
    End If
    
    BuiltIn.Delay(3000)
    'Ստուգել որ Ստորին սահմանը դաշտը փոխված լինի
    If Not Trim(wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame_2").VBObject("TDBNumber_2").Value) = summ Then
            Log.Error("The low border is not right")
    End If
    
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(1, "Î³ï³ñ»É") 
    'Փակել Հաճախորդի թղթապանակ թղթպանակը
    Call Close_Pttel("frmPttel_2")
    
End Sub


'---------------------------------------------------------------------------------------------------------------------------
'Ստեղծել Պատասխան հաղորդագորություն
'--------------------------------------------------------------------------------------------------------------------------- 
'respSum - Արգելադրվող ընդհանուր գումար
'respSum1 - Արգելադրվող գումար -1
'respSumCurr - Արգելադրվող գումար -1, արժույթ
'respSumFew - Գումարը չի բավարարում
'respActive - Արգելադրվել են այլ ակտիվներ
'respFalse - Գումարը չի արգելադրվել
Sub Create_Message(respSum,respSum1,respSumCurr,respSumFew,respActive,respFalse)
  
    BuiltIn.Delay(1000)
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_CreateAnswer)
    
    'Լրացնել "Արգելադրվող ընդհանուր գումար" դաշտը
    Call Rekvizit_Fill("Document",1,"General","RESPSUM1",respSum)
    'Լրացնել "Արգելադրվող գումար -1" դաշտը 
    Call Rekvizit_Fill("Document",1,"General","RESPSUM2",respSum1 & "[Tab]")
    'Լրացնել "Արգելադրվող գումար -1" արժույթ դաշտը 
    Call Rekvizit_Fill("Document",1,"General","RESPSUM2",respSumCurr)
    'Լրացնել "Գումարը չի բավարարում" նշիչը
    Call Rekvizit_Fill("Document",1,"CheckBox","RESPSUMFEW",respSumFew)
    'Լրացնել "Արգելադրվել են այլ ակտիվներ" նշիչը
    Call Rekvizit_Fill("Document",1,"CheckBox","RESPACTIVE",respActive)
    'Լրացնել "Գումարը չի արգելադրվել" դաշտը
    Call Rekvizit_Fill("Document",1,"General","RESPONSEFALSE",respFalse)    
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(1, "Î³ï³ñ»É") 

End Sub


'------------------------------------------------------------------------------------------------------------------
'Մասնակի/Ամբողջական Բռնագանձում
'------------------------------------------------------------------------------------------------------------------
'action - գործողություն
'branch - Գրասենյակ/Բաժին
'date - Ամսաթիվ
'docN - փաստաթղթի համար
'acc - հաշիվ
'summ - գումար
'inAccRex - Եկամուտներ արտ, փոխանակումից
'exAccRex - Վնասներ արտ. փոխանակումից
'paySys - Ընդ.Վճ. համակարգ"
Sub Confiscation (action,branch,date,docN,acc,summ,inAccRex,exAccRex,paySys)
  
    BuiltIn.Delay(1000)

    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(action)
    
    docN = Get_Rekvizit_Value("Document",1,"General","DOCNUM")

    'Լրացնում է "Գրասենյակ/Բաժին" դաշտը
    Call Rekvizit_Fill("Document",1,"General","ACSBRANCH",branch)
    'Լրացնում է "Ամսաթիվ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","DATE",date)
    
    With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
       'Լրացնում է հաշիվ դաշտը
      .Row = 0
      .Col = 0
      .Keys(acc & "[Enter]")
       'Լրացնում է Գումար դաշտը
      .Row = 0
      .Col = 2
      .Keys(summ & "[Enter]" )
    End With 
    'Լրացնում է "Եկամուտներ արտ, փոխանակումից" դաշտը
    Call Rekvizit_Fill("Document",1,"General","INCACCCUREX",inAccRex)
    'Լրացնում է "Վնասներ արտ. փոխանակումից" դաշտը
    Call Rekvizit_Fill("Document",1,"General","EXPACCCUREX",exAccRex)
    'Լրացնում է "Ընդ.Վճ. համակարգ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","PAYSYSIN",paySys)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(1, "Î³ï³ñ»É") 
        
End Sub


'---------------------------------------------------------------------------------------------------------------
'Մուտք գործել "Ընդունված հաղորդագրություններ" թղթապանակ 
'---------------------------------------------------------------------------------------------------------------
'sDate - Ժամանակահատվածի Սկիզբ 
'eDate - Ժամանակահատվածի Վերջ
'messType - Հաղորդագորւթյան տիպ
'numb - հաղորդագորության համար
Function Enter_Recieved_Messages(sDate,eDate,messType,numb)

    Dim is_exists

    'Անցում կատարել Ընդունված հաղորդագորւթյուններ թղթապանակ
    Call wTreeView.DblClickItem("|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|ÀÝ¹áõÝí³Í Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ")
    'Լրացնել Ժամանակահատվածի Սկիզբ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERN","![End]" & "[Del]" & sdate)
    'Լրացնել Ժամանակահատվածի Վերջ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERK","![End]" & "[Del]" & edate)
    'Լրացնել Հաղորդագորւթյան տիպ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","TYPE", messType)
    'Լրացնել Ցույց տալ նաև պատասխան ունեցողները նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","PROCESS", 1)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    'Փնտրում է հաղորդագրությունը 
    is_exists = False
    BuiltIn.Delay(5000)
    Set my_vbObj = wMDIClient.WaitVBObject("frmPttel", delay_middle)
    If my_vbObj.Exists Then
        Do Until wMDIClient.vbObject("frmPttel").vbObject("tdbgView").EOF
            If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(1).Text) = Trim(numb) Then
                is_exists = True
                Exit Do
            Else
                Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
            End If
        Loop
    Else
        Log.Message("The message doesn't exists in frmPttel")
        is_exists = False
    End If
    
    Enter_Recieved_Messages= is_exists
  
End Function

'-------------------------------------------------------------------------------------------------------------------------
'Մուտք գործել"Գումարների արգելադրում" թղթապանակ
'---------------------------------------------------------------------------------------------------------------------------
'sDate - Ժամանակահատվածի Սկիզբ 
'eDate - Ժամանակահատվածի Վերջ 
'blockID - հաղորդագորւթյան համար
Function Enter_Money_Blockings(sDate,eDate,blockID)
    Dim is_exists
    'Անցում կատարել Ընդունված հաղորդագորւթյուններ թղթապանակ
    Call wTreeView.DblClickItem("|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|¶áõÙ³ñÝ»ñÇ ³ñ·»É³¹ñáõÙÝ»ñ")
    'Լրացնել Ժամանակահատվածի Սկիզբ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE","![End]" & "[Del]" & sdate)
    'Լրացնել Ժամանակահատվածի Վերջ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE","![End]" & "[Del]" & edate)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    'Փնտրում է հաղորդագրությունը 
    is_exists = False
    Do Until wMDIClient.vbObject("frmPttel").vbObject("tdbgView").EOF
        If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(0).Text) = blockID Then
            is_exists = True
            Exit Do
        Else
            Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
        End If
    Loop
    
    Enter_Money_Blockings = is_exists   
End Function 


'------------------------------------------------------------------------------------------------------------------------------------
'Ստեղծել Պատասխան հաղորդագորություն բռնագանձման համար 
'------------------------------------------------------------------------------------------------------------------------------------
'response - Գումարը բռնագանձվել է
'respSum - Բռնագանձնվող արժույթ
'respCur - Բռնագանձնվող արժույթ
'respSumm - Պակաս գանձված գումար
'respCurr - Արժույթ
'respFalse - Գումարը չի բռնագանձվել
'respOther - Այլ պատճառ
Sub Create_Answer_Conf(response,respSum,respCur,respSumm,respCurr,respFalse,respOther)
  
    BuiltIn.Delay(1000)
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_CreateAnswer)
    
    'Լրացնում է "Գումարը բռնագանձվել է" նշիչը
    Call Rekvizit_Fill("Document",1,"CheckBox","RESPONSETRUE",response)
    'Լրացնում է "Բռնագանձվող գումար" դաշտը
    Call Rekvizit_Fill("Document",1,"General","RESPSUM1",respSum)
    'Լրացնում է "Բռնագանձնվող արժույթ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","RESPCUR1",respCur)
    'Լրացնում է "Պակաս գանձված գումար" դաշտը
    Call Rekvizit_Fill("Document",1,"General","RESPSUM2",respSumm)
    'Լրացնում է "Արժույթ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","RESPCUR2",respCurr)
    'Լրացնում է "Գումարը չի բռնագանձվել" դաշտը
    Call Rekvizit_Fill("Document",1,"General","RESPONSEFALSE",respFalse)
    'Լրացնում է "Այլ պատճառ" դաշտը
    Call Rekvizit_Fill("Document",1,"General","RESPONSEOTHER",respOther)
     'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(1, "Î³ï³ñ»É")
    
End Sub

'----------------------------------------------------------------------------------------------------------------------------------
'Դիտել Պատասխանները
'-----------------------------------------------------------------------------------------------------------------------------------
'blockID - Հաղորդագրությոան համար
Sub View_Answers(blockID)
    BuiltIn.Delay(1500)
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_ViewAnswers)
    
    'Ստուգել որ Հղում դաշտը ճիշտ լրացված լինի
    If Not Left(Trim(wMDIClient.VBObject("frmPttel_2").VBObject("tdbgView").Columns.Item(1).Value), Len(blockID)) = blockID Then
            Log.Error("Message is not correct")
    End If
    
    Call Close_Pttel("frmPttel_2")
End Sub

'------------------------------------------------------------------------------------------------------------------------------------
'Միջոցների ազատում 
'-------------------------------------------------------------------------------------------------------------------------------------
'block - Գումարների արգելադրման փաստաթուղթ փակված 
Sub Funds_Release(block)
    
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_FundRelease)
    
     'Սեղմել Այո կոճակը
    Call ClickCmdButton(5, "²Ûá")
     'Սեղմել OK կոճակը
    Call ClickCmdButton(5, "OK")
    
    'Մուտք գործել Հաճախորդի թղթապանակ
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_ClFolder)
    
    'Ստուգել որ Գումարների արգելադրումը փակված է 
    BuiltIn.Delay(4000)
    Set my_vbObj = wMDIClient.WaitVBObject("frmPttel_2", delay_middle)
    If my_vbObj.Exists Then
        Do Until wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").EOF
            If Trim(wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").Columns.Item(1).Text) = Trim(acc) Then
                Exit Do
            Else
                Call wMDIClient.vbObject("frmPttel_2").vbObject("tdbgView").MoveNext
            End If
        Loop
    Else
        Log.Message("The document doesn't created")
    End If
    Call Close_Pttel("frmPttel_2")
    
End Sub

Sub Send_To_Sent(currDate,blockID)
    
    'Անցում կատարել Ընդունված հաղորդագորւթյուններ թղթապանակ
    Call wTreeView.DblClickItem("|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|ÊÙµ³·ñíáÕ")
    'Լրացնել Ժամանակահատվածի Սկիզբ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERN","![End]" & "[Del]" & currDate)
    'Լրացնել Ժամանակահատվածի Վերջ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERK","![End]" & "[Del]" & currDate)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(5000)
    'Ստուգել որ Հղում դաշտը ճիշտ լրացված լինի
    Do Until wMDIClient.VBObject("frmPttel").VBObject("tdbgView").EOF
      If Left(Trim(wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(2).Value), Len(blockID)) = blockID Then
         'Տեղափոխել "Ուղարկված" թղթապանակ
          Call wMainForm.MainMenu.Click(c_AllActions) 
          Call wMainForm.PopupMenu.Click("Համարել արտահանված")
          If Sys.Process("Asbank").WaitVBObject("frmAsMsgBox",10000).Exists Then
              If MessageExists(2,"àôÞ²¸ðàôÂÚàôÜ: §Ð³Ù³ñ»É ³ñï³Ñ³Ýí³Í¦ ·áñÍáÕáõÃÛáõÝÁ Ï³ñ»ÉÇ ¿ " & vbCrLf &_
               "Ï³ï³ñ»É ÙÇ³ÛÝ ³ÛÝ ¹»åùáõÙ, »Ã» Ñ³Ùá½í³Í »ù, áñ ³ñï³Ñ³ÝáõÙÁ Çñ³Ï³ÝáõÙ " & vbCrLf & "Ï³ï³ñí³Í ¿: Þ³ñáõÝ³Ï»±É") Then
                  Call ClickCmdButton(5, "²Ûá")
                  Exit Do
              Else
                  Log.Error"Message is not correct" ,,,ErrorColor
              End If
          Else
              Log.Error"Message window doesn't open" ,,,ErrorColor
          End If
      Else
          wMDIClient.VBObject("frmPttel").VBObject("tdbgView").MoveNext
      End If
    Loop
    BuiltIn.Delay(1000)
    Call Close_Pttel("frmPttel")
    BuiltIn.Delay(2000)
End Sub

'----------------------------------------------------------------------------------------------------------------------------
'Ստուգել հաղորդագորության առկայությունը "Ուղարկված" թղթապանակում
'____________________________________________________________________________________________________________________________
'currDate - Ամսաթիվ
'blockID -  հաղորդագորության համար
Function Check_In_Sent(currDate,blockID)

    Dim is_Exists,my_vbObj
    
      'Անցում կատարել Ընդունված հաղորդագորւթյուններ թղթապանակ
    Call wTreeView.DblClickItem("|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|àõÕ³ñÏí³Í")
    'Լրացնել Ժամանակահատվածի Սկիզբ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERN","![End]" & "[Del]" & currDate)
    'Լրացնել Ժամանակահատվածի Վերջ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERK","![End]" & "[Del]" & currDate)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(3000) 
    is_Exists = False
    
    'Ստուգում է տվյալ հաղորդագորության համարով հաղորդագրության առկայությունը
    Set my_vbObj = wMDIClient.WaitVBObject("frmPttel", delay_middle)
    If my_vbObj.Exists Then
        Do Until wMDIClient.vbObject("frmPttel").vbObject("tdbgView").EOF
            If Left(Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(2).Text), Len(blockID)) = blockID Then
                is_Exists = True
                Exit Do
            Else
                Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
            End If
        Loop
    Else
        is_Exists = False
    End If
    
    Check_In_Sent = is_Exists
    Call Close_Pttel("frmPttel")
    
End Function

'-------------------------------------------------------------------------------------------------------------
'Ջնջել ուղարկված հաղորդագորությունները
'-------------------------------------------------------------------------------------------------------------
'sDate - ժամանակահատվածի սկիզբ
'eDate - Ժամանակահատվածի վերջ
'messType - հաղորդագրության տեսակ
Sub Detele_Sent_Message(sDate,eDate,messType)
  
    'Անցում կատարել Ընդունված հաղորդագորւթյուններ թղթապանակ
    Call wTreeView.DblClickItem("|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|ÀÝ¹áõÝí³Í Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñ")
    'Լրացնել Ժամանակահատվածի Սկիզբ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERN","![End]" & "[Del]" & sdate)
    'Լրացնել Ժամանակահատվածի Վերջ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","PERK","![End]" & "[Del]" & edate)
    'Լրացնել Հաղորդագորւթյան տիպ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","TYPE", messType)
    'Լրացնել Ցույց տալ նաև պատասխան ունեցողները նշիչը
    Call Rekvizit_Fill("Dialog",1,"CheckBox","PROCESS", 1)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_ViewAnswers)
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
    Sys.Process("Asbank").VBObject("frmDeleteDoc").VBObject("YesButton").ClickButton
    BuiltIn.Delay(2000)
    ' Փակել ընթացիկ պատուհանը
    Call wMainForm.MainMenu.Click(c_Windows)
    Call wMainForm.PopupMenu.Click(c_ClAllWindows)   
   
End Sub

'---------------------------------------------------------------------------------------------------------------
'Ստուգել Սև ցուցակի թղթապանակում
'---------------------------------------------------------------------------------------------------------------
'ID - հաժախորդի ID
Function Check_In_Black_List_Folder(ID)

    Dim is_exists
    
    Call wTreeView.DblClickItem("|§ê¨ óáõó³Ï¦ í³ñáÕÇ ²Þî|§ê¨ óáõó³Ï¦")
    'Լրացնել Ժամանակահատվածի Սկիզբ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","IDSTART",ID)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    
    BuiltIn.Delay(3000) 
    'Ստուգել Հախորդի առկայությունը թղթապանակում
    If wMDIClient.WaitVBObject("frmPttel", delay_middle).Exists Then
        Do Until wMDIClient.vbObject("frmPttel").vbObject("tdbgView").EOF
            If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(0).Text) = Trim(ID) Then
                is_exists = True
                Exit Do
            Else
                Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
            End If
        Loop
    Else
        Log.Message("The message doesn't exists in frmPttel")
        is_exists = False
    End If
    
    Check_In_Black_List_Folder = is_exists
    Call Close_Pttel("frmPttel")
    
End Function

'ԴԱՀԿ ընդունված հաղորդագրությունների ֆիլտր
Class recievedMsgDAHKFilter
    Public sDate
    Public eDate
    Public mt
    Public inqNum
    Public inqID
    Public msgID
    Public clientCode
    Public passTaxCode
    Public ssn
    Public debName
    Public debAddress
    Public showResponded
    Public showDuplicated
    Public showPresOfRelMsg
    Public showOnlyAttachWithBlocking
    Private Sub Class_Initialize()
        sDate = "  /  /  "
        eDate = "  /  /  "
        mt = ""
        inqNum= ""
        inqID = ""
        msgID = ""
        clientCode = ""
        passTaxCode = ""
        ssn = ""
        debName = ""
        debAddress = ""
        showResponded = 0
        showDuplicated = 0
        showPresOfRelMsg = 0
        showOnlyAttachWithBlocking = 0
    End Sub    
End Class

Function New_DAHK_Recieved_Filter()
    Set New_DAHK_Recieved_Filter = New recievedMsgDAHKFilter
End Function
'Մուտք ԴԱՀԿ ընդունված հաղորդագրություններ 
Sub Go_To_Recieved_Messages_DAHK(recieved, folderDirect)
    Dim rekvObj
    Call wTreeView.DblClickItem(folderDirect)
    BuiltIn.Delay(2000)
    If p1.WaitVBObject("frmAsUstPar",1000).Exists Then
        'Ժամանակահատվածի սկիզբ
        Call Rekvizit_Fill("Dialog",1,"General", "PERN","[Home]![End][Del]" & recieved.sDate)
        'Ժամանակահատվածի վերջ
        Call Rekvizit_Fill("Dialog",1,"General", "PERK","[Home]![End][Del]" & recieved.eDate)
        'Հաղորդագրության տեսակ
        Call Rekvizit_Fill("Dialog",1,"General", "TYPE","[Home]![End][Del]" & recieved.mt)
        'Վարույթի համար
        Call Rekvizit_Fill("Dialog",1,"General", "INQUESTNUMBER","[Home]![End][Del]" & recieved.inqNum) 
        'Վարույթի կոդ
        Call Rekvizit_Fill("Dialog",1,"General", "INQUESTID","[Home]![End][Del]" & recieved.inqID) 
        'Հաղորդագրության համար
        Call Rekvizit_Fill("Dialog",1,"General", "MESSAGEID","[Home]![End][Del]" & recieved.msgID)
        'Հաճախորդի կոդ
        Call Rekvizit_Fill("Dialog",1,"General", "CLICODE","[Home]![End][Del]" & recieved.clientCode)
        'Անձնագիր/ՀՎՀՀ
        Call Rekvizit_Fill("Dialog",1,"General", "PASSTAX","[Home]![End][Del]" & recieved.passTaxCode) 
        'ՀԾՀ
        Call Rekvizit_Fill("Dialog",1,"General", "SSN","[Home]![End][Del]" & recieved.ssn)
        'Պարտապանի անվանում
        Call Rekvizit_Fill("Dialog",1,"General", "NAME","[Home]![End][Del]" & recieved.debName)  
        'Պարտապանի հասցե
        Call Rekvizit_Fill("Dialog",1,"General", "ADDRESS","[Home]![End][Del]" & recieved.debAddress)
        'Ցույց տալ նաև պատասխան ունեցողները
        Call Rekvizit_Fill("Dialog",1,"CheckBox", "PROCESS",recieved.showResponded)
        'Ցույց կրկնությունները
        Call Rekvizit_Fill("Dialog",1,"CheckBox", "DUPLICATE",recieved.showDuplicated)
        'Ցույց տալ Կապակցված հաղ. առկ.
        Call Rekvizit_Fill("Dialog",1,"CheckBox", "RELMESSAGES",recieved.showPresOfRelMsg)
        'Ցույց տալ միայն արգելում չունեցողները
        rekvObj = GetVBObject_Dialog("ONLYNOTBLOCKED", p1.WaitVBObject("frmAsUstPar", 1000))
        If p1.VBObject("frmAsUstPar").VBObject("TabFrame").VBObject(rekvObj).Enabled Then 
            Call Rekvizit_Fill("Dialog",1,"CheckBox", "ONLYNOTBLOCKED",recieved.showOnlyAttachWithBlocking)   
        End If 
        Call ClickCmdButton(2, "Î³ï³ñ»É")
        Call WaitForExecutionProgress() 
    Else 
        Log.Error "Filter Window not Found"    
    End If         
End Sub

Class Editable_Filter_DAHK
    Public sDate
    Public eDate
    Public mt
    Public inqNum
    Public inqID 
    Private Sub Class_Initialize()
        sDate = "  /  /  "
        eDate = "  /  /  "
        mt = ""
        inqNum= ""
        inqID = ""
    End Sub    
End Class

Function New_Editable_Filter_DAHK ()
    Set New_Editable_Filter_DAHK = New Editable_Filter_DAHK  
End Function


'Մուտք Խմբագրվող թղթապանակ
Sub Go_To_DAHK_Editable(editable, folderDirect)
    Call wTreeView.DblClickItem(folderDirect)
    BuiltIn.Delay(2000)
    If p1.WaitVBObject("frmAsUstPar",1000).Exists Then
        'Ժամանակահատվածի սկիզբ
        Call Rekvizit_Fill("Dialog",1,"General", "PERN","[Home]![End][Del]" & editable.sDate)
        'Ժամանակահատվածի վերջ
        Call Rekvizit_Fill("Dialog",1,"General", "PERK","[Home]![End][Del]" & editable.eDate)
        'Հաղորդագրության տեսակ
        Call Rekvizit_Fill("Dialog",1,"General", "TYPE","[Home]![End][Del]" & editable.mt)
        'Վարույթի համար
        Call Rekvizit_Fill("Dialog",1,"General", "INQUESTNUMBER","[Home]![End][Del]" & editable.inqNum) 
        'Վարույթի կոդ
        Call Rekvizit_Fill("Dialog",1,"General", "INQUESTID","[Home]![End][Del]" & editable.inqID) 
        Call ClickCmdButton(2, "Î³ï³ñ»É")
        Call WaitForExecutionProgress() 
    Else 
        Log.Error "Filter Window not Found"    
    End If    
End Sub

Class Sent_Filter_DAHK
    Public sDate
    Public eDate
    Public mt
    Public inqNum
    Public inqID
    Public passTax
    Private Sub Class_Initialize()
        sDate = "  /  /  "
        eDate = "  /  /  "
        mt = ""
        inqNum= ""
        inqID = ""
        passTax = ""
    End Sub    
End Class

Function New_Sent_Filter_DAHK ()
    Set New_Sent_Filter_DAHK = New Sent_Filter_DAHK  
End Function


'Մուտք Ուղարկված թղթապանակ
Sub Go_To_DAHK_Sent (sent, folderDirect)
    Call wTreeView.DblClickItem(folderDirect)
    BuiltIn.Delay(2000)
    If p1.WaitVBObject("frmAsUstPar",1000).Exists Then
        'Ժամանակահատվածի սկիզբ
        Call Rekvizit_Fill("Dialog",1,"General", "PERN","[Home]![End][Del]" & sent.sDate)
        'Ժամանակահատվածի վերջ
        Call Rekvizit_Fill("Dialog",1,"General", "PERK","[Home]![End][Del]" & sent.eDate)
        'Հաղորդագրության տեսակ
        Call Rekvizit_Fill("Dialog",1,"General", "TYPE","[Home]![End][Del]" & sent.mt)
        'Վարույթի համար
        Call Rekvizit_Fill("Dialog",1,"General", "INQUESTNUMBER","[Home]![End][Del]" & sent.inqNum) 
        'Վարույթի կոդ
        Call Rekvizit_Fill("Dialog",1,"General", "INQUESTID","[Home]![End][Del]" & sent.inqID)
        'Անձնագիր/ՀՎՀՀ
        Call Rekvizit_Fill("Dialog",1,"General", "PASSTAX","[Home]![End][Del]" & sent.passTax)  
        Call ClickCmdButton(2, "Î³ï³ñ»É")
        Call WaitForExecutionProgress() 
    Else 
        Log.Error "Filter Window not Found"    
    End If    
End Sub


Class Blocks_Filter_DAHK
    Public sDate
    Public eDate
    Public client
    Public clientName
    Public inqID
    Public source
    Public showClosed
    Private Sub Class_Initialize()
        sDate = "  /  /  "
        eDate = "  /  /  "
        client = ""
        clientName= ""
        inqID = ""
        source = ""
        showClosed = 0
    End Sub    
End Class

Function New_Blocks_Filter_DAHK ()
    Set New_Blocks_Filter_DAHK = New Blocks_Filter_DAHK  
End Function


'Մուտք Գումարների արգելադրումներ թղթապանակ
Sub Go_To_DAHK_Blocks (block, folderDirect)
    Call wTreeView.DblClickItem(folderDirect)
    BuiltIn.Delay(2000)
    If p1.WaitVBObject("frmAsUstPar",1000).Exists Then
        'Ժամանակահատվածի սկիզբ
        Call Rekvizit_Fill("Dialog",1,"General", "SDATE","[Home]![End][Del]" & block.sDate)
        'Ժամանակահատվածի վերջ
        Call Rekvizit_Fill("Dialog",1,"General", "EDATE","[Home]![End][Del]" & block.eDate)
        'Հաճախորդ
        Call Rekvizit_Fill("Dialog",1,"General", "CLICODE","[Home]![End][Del]" & block.client)
        'Հաճախորդի անվանում
        Call Rekvizit_Fill("Dialog",1,"General", "CLINAME","[Home]![End][Del]" & block.clientName) 
        'Արգելանքի ID
        Call Rekvizit_Fill("Dialog",1,"General", "BLOCKID","[Home]![End][Del]" & block.inqID)
        'Աղբյուր
        Call Rekvizit_Fill("Dialog",1,"General", "SOURCE","[Home]![End][Del]" & block.source)  
        'Ցույց տալ փակվածները
        Call Rekvizit_Fill("Dialog",1,"CheckBox", "SHOWCLOSED",block.showClosed)
        Call ClickCmdButton(2, "Î³ï³ñ»É")
        Call WaitForExecutionProgress() 
    Else 
        Log.Error "Filter Window not Found"    
    End If    
End Sub




'Բռնագանձման պատասխան փաստաթղթի Ընդհանուր էջ
Class ConfiscationAnswerCommon
    Public isn
    Public reference
    Public fDate
    Public confiscated
    Public sumToConf
    Public curToConf
    Public restSum
    Public cur
    Public notConfiscated
    Public otherReason
    Public activeBlocks
    Public activeInqID
    Public sumBlocked 
    Public tabN
    Public check 
    Private Sub Class_Initialize()
        isn = ""
        reference = ""
        fDate = "  /  /  "
        confiscated = 0
        sumToConf = "0.00"
        curToConf= ""
        restSum = "0.00"
        cur = ""
        notConfiscated = ""
        otherReason = ""
        activeBlocks = ""
        activeInqID = ""
        sumBlocked = "0.00"
        tabN = 1
        check = False
    End Sub
End Class
Function New_ConfiscationAnswerCommon()
    Set New_ConfiscationAnswerCommon = New ConfiscationAnswerCommon
End Function

'Բռնագանձման պատասխան փաստաթղթի Այլ էջ
Class ConfiscationAnswerOther
    Public manager
    Public chiefAcc
    Public transactionID
    Public status
    Public errorMsg
    Public inquestID
    Public tabN
    Public check     
    Private Sub Class_Initialize()
        manager = ""
        chiefAcc = ""
        transactionID = ""
        status= ""
        errorMsg = ""
        inquestID = ""
        tabN = 2
        check = False    
    End Sub
End Class

Function New_ConfiscationAnswerOther()
    Set New_ConfiscationAnswerOther = New ConfiscationAnswerOther
End Function

'Բռնագանձման պատասխան փաստաթղթի Կլասս
Class ConfiscationAnswer
    Public commonTab
    Public otherTab
    Public attachTab
    Private Sub Class_Initialize()
        Set commonTab = New_ConfiscationAnswerCommon()
        Set otherTab =  New_ConfiscationAnswerOther()
        Set attachTab = New_Attached_Tab(fCount, lCount, dCount)
        attachTab.tabN = 3
    End Sub
End Class


Function New_ConfiscationAnswer(fileC ,linkC , deleteC)
    fCount = fileC
    lCount = linkC
    dCount = deleteC
    Set New_ConfiscationAnswer = new ConfiscationAnswer
End Function

Sub ConfiscationAnswer_Check (confAnswer)
    confAnswer.commonTab.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Ընդհանուր էջի ստուգում
    If confAnswer.commonTab.check Then
        Call GoTo_ChoosedTab(confAnswer.commonTab.tabN)  
        'Հղում դաշտի ստուգում
        Call Compare_Two_Values("Հղում",Get_Rekvizit_Value("Document",confAnswer.commonTab.tabN,"General","REFERENCE"),confAnswer.commonTab.reference)    
        'Լրացման Ամսաթիվ դաշտի ստուգում
        Call Compare_Two_Values("Լրացման Ամսաթիվ",Get_Rekvizit_Value("Document",confAnswer.commonTab.tabN,"General","RESPONSEDATE"),confAnswer.commonTab.fDate) 
        'Գումարը Բռնագանձվել է դաշտի ստուգում
        Call Compare_Two_Values("Գումարը Բռնագանձվել է",Get_Rekvizit_Value("Document",confAnswer.commonTab.tabN,"CheckBox","RESPONSETRUE"),confAnswer.commonTab.confiscated)  
        'Բռնագանձվող գումար դաշտի ստուգում
        Call Compare_Two_Values("Բռնագանձվող գումար",Get_Rekvizit_Value("Document",confAnswer.commonTab.tabN,"General","RESPSUM1"),confAnswer.commonTab.sumToConf)  
        'Բռնագանձվող արժույթ դաշտի ստուգում
        Call Compare_Two_Values("Բռնագանձվող արժույթ",Get_Rekvizit_Value("Document",confAnswer.commonTab.tabN,"Mask","RESPCUR1"),confAnswer.commonTab.curToConf)
        'Պակաս գանձված գումար դաշտի ստուգում
        Call Compare_Two_Values("Պակաս գանձված գումար",Get_Rekvizit_Value("Document",confAnswer.commonTab.tabN,"General","RESPSUM2"),confAnswer.commonTab.restSum)
        'Արժույթ դաշտի ստուգում
        Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",confAnswer.commonTab.tabN,"Mask","RESPCUR2"),confAnswer.commonTab.cur)
        'Գումարը չի բռնագանձվել դաշտի ստուգում
        Call Compare_Two_Values("Գումարը չի բռնագանձվել",Get_Rekvizit_Value("Document",confAnswer.commonTab.tabN,"Mask","RESPONSEFALSE"),confAnswer.commonTab.notConfiscated)
        'Այլ պատճառ դաշտի ստուգում
        Call Compare_Two_Values("Այլ պատճառ",Get_Rekvizit_Value("Document",confAnswer.commonTab.tabN,"Comment","RESPONSEOTHER"),confAnswer.commonTab.otherReason)
        'Գործող արգելանքներ դաշտի ստուգում
        Call Compare_Two_Values("Գործող արգելանքներ",Get_Rekvizit_Value("Document",confAnswer.commonTab.tabN,"General","BLOCKMESSAGES"),confAnswer.commonTab.activeBlocks)
        'Գործող վարույթի կոդեր դաշտի ստուգում
        Call Compare_Two_Values("Գործող վարույթի կոդեր",Get_Rekvizit_Value("Document",confAnswer.commonTab.tabN,"General","OTHERRECOVEREDINQUESTIDS"),confAnswer.commonTab.activeInqID)
        'Արգելադրված գումար դաշտի ստուգում
        Call Compare_Two_Values("Արգելադրված",Get_Rekvizit_Value("Document",confAnswer.commonTab.tabN,"General","BLOCKEDSUM"),confAnswer.commonTab.sumBlocked)  
    End If
    'Այլ էջի ստուգում
    If confAnswer.otherTab.check Then
        Call GoTo_ChoosedTab(confAnswer.otherTab.tabN)  
        'Տնօրեն ստուգում
        Call Compare_Two_Values("Տնօրեն",Get_Rekvizit_Value("Document",confAnswer.otherTab.tabN,"General","BANKHEAD"),confAnswer.otherTab.manager)  
        'Գլխավոր Հաշվապահ դաշտի ստուգում
        Call Compare_Two_Values("Գլխավոր Հաշվապահ",Get_Rekvizit_Value("Document",confAnswer.otherTab.tabN,"General","BANKACCOUNTER"),confAnswer.otherTab.chiefAcc)  
        'Գործատնության նույնականացուցիչ դաշտի ստուգում
        Call Compare_Two_Values("Գործատնության նույնականացուցիչ",Get_Rekvizit_Value("Document",confAnswer.otherTab.tabN,"General","TRANSID"),confAnswer.otherTab.transactionID)  
        'Կարգավիճակ դաշտի ստուգում
        Call Compare_Two_Values("Կարգավիճակ",Get_Rekvizit_Value("Document",confAnswer.otherTab.tabN,"Mask","STATUS"),confAnswer.otherTab.status)  
        'Սխալի հաղորդագորություն դաշտի ստուգում
        Call Compare_Two_Values("Սխալի հաղորդագորություն",Get_Rekvizit_Value("Document",confAnswer.otherTab.tabN,"General","ERRORMESSAGE"),confAnswer.otherTab.errorMsg)  
        'Վարույթի կոդ դաշտի ստուգում
        Call Compare_Two_Values("Վարույթի կոդ",Get_Rekvizit_Value("Document",confAnswer.otherTab.tabN,"General","INQID"),confAnswer.otherTab.inquestID)    
    End If
    Call Attach_Tab_Check (confAnswer.attachTab)              
End Sub

'Գումարների Արգելադրում փաստաթղթի ընդհնաուր էջի կլասս
Class amountBlockingCommon
    Public isn
    Public clientCode
    Public blockID
    Public source
    Public initSum
    Public blockedSum
    Public blockCur
    Public acc()
    Public accCur()
    Public accCurSum()
    Public blockCurSum()
    Public blockAccsCount
    Public debt
    Public debtDeactivated
    Public confiscatedSum
    Public comment
    Public tabN
    Public check
    Private Sub Class_Initialize()
        isn = ""
        clientCode = ""
        blockID = ""
        source = ""
        initSum = "0.00"
        blockedSum = "0.00"
        blockCur = ""
        ReDim acc (aCount)
        ReDim accCur (aCount)
        ReDim accCurSum (aCount)
        ReDim blockCurSum (aCount)
        For blockAccsCount = 0 to aCount
            acc(blockAccsCount) = ""
            accCur(blockAccsCount) = ""
            accCurSum(blockAccsCount) = "0.00"
            blockCurSum(blockAccsCount) = "0.00"
        Next
        blockAccsCount = aCount
        debt = "0.00"
        debtDeactivated = 0
        confiscatedSum = "0.00"
        comment = ""
        tabN = 1
        check = False
        
        Set attachTab = New_Attached_Tab(files_count, links_count, delete_count)
        attachTab.tabN = 3
    End Sub
End Class

Function New_Amount_Blocking_Common(accCount)
    aCount = accCount
    Set New_Amount_Blocking_Common = New amountBlockingCommon
End Function

'Գումարների Արգելադրում փաստաթղթի Այլ էջի կլասս
Class amountBlockingOther
    Public confAcc
    Public lastRecalcDate
    Public opDate
    Public clDate
    Public mailSent
    Public intBankLetSent
    Public smsSent
    Public dahkInqID
    Public dahkDebtorID
    Public clientCode2
    Public tabN
    Public check
    Private Sub Class_Initialize()
        confAcc = ""
        lastRecalcDate = "  /  /  "
        opDate = "  /  /  "
        clDate = "  /  /  "
        mailSent = 0
        intBankLetSent = 0
        smsSent = 0
        clientCode2dahkInqID = ""
        dahkDebtorID = ""
        dahkInqID = "" 
        tabN = 2
        check = False    
    End Sub
End Class

Function New_Amount_Blocking_Other()
    Set New_Amount_Blocking_Other = New amountBlockingOther
End Function

'Գումարների Արգելադրում փաստաթղթի կլասս
Class ammountBlocking
    Public commonTab
    Public otherTab
    Public attachTab
    Private Sub Class_Initialize()
        Set commonTab = New_Amount_Blocking_Common(aCount)
        Set otherTab =  New_Amount_Blocking_Other()
        Set attachTab = New_Attached_Tab(fCount, lCount, dCount)
        attachTab.tabN = 3
    End Sub
End Class

Function New_AmmountBlocking(accC, fileC ,linkC , deleteC)
    aCount = accC
    fCount = fileC
    lCount = linkC
    dCount = deleteC
    Set New_AmmountBlocking = new ammountBlocking
End Function


Sub Amounts_Blocking_Check(ammBlock)
    Dim docGrid, i   
    ammBlock.commonTab.isn = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
    'Ընդհանուր էջի ստուգում
    If ammBlock.commonTab.check Then
        Call GoTo_ChoosedTab(ammBlock.commonTab.tabN)  
        'Հաճախորդի կոդ դաշտի ստուգում
        Call Compare_Two_Values("Հաճախորդի կոդ",Get_Rekvizit_Value("Document",ammBlock.commonTab.tabN,"Mask","CLICODE"),ammBlock.commonTab.clientCode)  
        'Արգելանքի ID դաշտի ստուգում
        Call Compare_Two_Values("Արգելանքի ID",Get_Rekvizit_Value("Document",ammBlock.commonTab.tabN,"General","ID"),ammBlock.commonTab.blockID)  
        'Աղբյուր դաշտի ստուգում
        Call Compare_Two_Values("Աղբյուր",Get_Rekvizit_Value("Document",ammBlock.commonTab.tabN,"Mask","SOURCE"),ammBlock.commonTab.source)  
        'Սկզբնական գումար դաշտի ստուգում
        Call Compare_Two_Values("Սկզբնական գումար",Get_Rekvizit_Value("Document",ammBlock.commonTab.tabN,"General","STARTSUM"),ammBlock.commonTab.initSum)  
        'Արգելադրվող գումար դաշտի ստուգում
        Call Compare_Two_Values("Արգելադրվող գումար",Get_Rekvizit_Value("Document",ammBlock.commonTab.tabN,"General","BLOCKSUM"),ammBlock.commonTab.blockedSum)  
        'Արժույթ դաշտի ստուգում
        Call Compare_Two_Values("Արժույթ",Get_Rekvizit_Value("Document",ammBlock.commonTab.tabN,"Mask","CUR"),ammBlock.commonTab.blockCur) 
        'Արգելադրվող հաշիվներ աղյուսակի ստուգում
        Set docGrid = wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
        docGrid.MoveFirst 
        For i = 0 to ammBlock.commonTab.blockAccsCount - 1
            'Հաշիվ դաշտերի ստուգում
            Call Check_Value_Grid (0 , i, "Document", ammBlock.commonTab.tabN, ammBlock.commonTab.acc(i))
            'Արժ. դաշտի ստուգում
            Call Check_Value_Grid (1 , i, "Document", ammBlock.commonTab.tabN, ammBlock.commonTab.accCur(i))
            'Գումարը հաշվի արժույթով դաշտի ստուգում
            Call Check_Value_Grid (2 , i, "Document", ammBlock.commonTab.tabN, ammBlock.commonTab.accCurSum(i))
            'Գումարը արգելանքի արժույթով դաշտի ստուգում
            Call Check_Value_Grid (3 , i, "Document", ammBlock.commonTab.tabN, ammBlock.commonTab.blockCurSum(i))
        Next  
        'Պարտք դաշտի ստուգում
        Call Compare_Two_Values("Պարտք",Get_Rekvizit_Value("Document",ammBlock.commonTab.tabN,"General","DEBT"),ammBlock.commonTab.debt)  
        'Պարտքն ապաակտիվացված է դաշտի ստուգում
        Call Compare_Two_Values("Պարտքն ապաակտիվացված է",Get_Rekvizit_Value("Document",ammBlock.commonTab.tabN,"CheckBox","DEBTDEACTIVATED"),ammBlock.commonTab.debtDeactivated)  
        'Բռնագանձված գումար դաշտի ստուգում
        Call Compare_Two_Values("Բռնագանձված գումար",Get_Rekvizit_Value("Document",ammBlock.commonTab.tabN,"General","WITHDRAWNAMOUNT"),ammBlock.commonTab.confiscatedSum)  
        'Մեկնաբանություն դաշտի ստուգում
        Call Compare_Two_Values("Մեկնաբանություն",Get_Rekvizit_Value("Document",ammBlock.commonTab.tabN,"General","COMMENT"),ammBlock.commonTab.comment)
    End If
    'Այլ էջի ստուգում
    If ammBlock.otherTab.check Then
        Call GoTo_ChoosedTab(ammBlock.otherTab.tabN)  
        'Բռնագանձման հաշիվ դաշտի ստուգում
        Call Compare_Two_Values("Բռնագանձման հաշիվ",Get_Rekvizit_Value("Document",ammBlock.otherTab.tabN,"Bank","WITHDRAWACC"),ammBlock.otherTab.confAcc)  
        'Վերջին վերահաշվարկի ամսաթիվ դաշտի ստուգում
        Call Compare_Two_Values("Վերջին վերահաշվարկի ամսաթիվ",Get_Rekvizit_Value("Document",ammBlock.otherTab.tabN,"General","LASTCALDATE"),ammBlock.otherTab.lastRecalcDate)  
        'Բացման ամսաթիվ դաշտի ստուգում
        Call Compare_Two_Values("Բացման ամսաթիվ",Get_Rekvizit_Value("Document",ammBlock.otherTab.tabN,"General","OPENDATE"),ammBlock.otherTab.opDate)  
        'Փակման ամսաթիվ դաշտի ստուգում
        Call Compare_Two_Values("Փակման ամսաթիվ",Get_Rekvizit_Value("Document",ammBlock.otherTab.tabN,"General","CLOSEDATE"),ammBlock.otherTab.clDate)  
        'Ուղարկվել է նամակ դաշտի ստուգում
        Call Compare_Two_Values("Ուղարկվել է նամակ",Get_Rekvizit_Value("Document",ammBlock.otherTab.tabN,"CheckBox","EMAILWASSENT"),ammBlock.otherTab.mailSent)  
        'Ուղարկվել է Ինտերնետ բանկի նամակ դաշտի ստուգում
        Call Compare_Two_Values("Ուղարկվել է Ինտերնետ բանկի նամակ",Get_Rekvizit_Value("Document",ammBlock.otherTab.tabN,"CheckBox","IBLETTERWASSENT"),ammBlock.otherTab.intBankLetSent)  
        'Ուղարկվել է SMS դաշտի ստուգում
        Call Compare_Two_Values("Ուղարկվել է SMS",Get_Rekvizit_Value("Document",ammBlock.otherTab.tabN,"CheckBox","SMSWASSENT"),ammBlock.otherTab.smsSent)  
        'ԴԱՀԿ վարույթի ID դաշտի ստուգում
        Call Compare_Two_Values("ԴԱՀԿ վարույթի ID",Get_Rekvizit_Value("Document",ammBlock.otherTab.tabN,"General","DAHKINQUESTID"),ammBlock.otherTab.dahkInqID)  
        'ԴԱՀԿ պարտապանի ID դաշտի ստուգում
        Call Compare_Two_Values("ԴԱՀԿ պարտապանի ID",Get_Rekvizit_Value("Document",ammBlock.otherTab.tabN,"General","DAHKDEBTORID"),ammBlock.otherTab.dahkDebtorID) 
        'Հաճախորդի կոդ II դաշտի ստուգում
        Call Compare_Two_Values("Հաճախորդի կոդ II",Get_Rekvizit_Value("Document",ammBlock.otherTab.tabN,"Mask","CLICODE2"),ammBlock.otherTab.clientCode2)        
    End If
    Call Attach_Tab_Check(ammBlock.attachTab)
End Sub





