Option Explicit
'USEUNIT Library_Common
'USEUNIT Library_Colour
'USEUNIT Online_PaySys_Library
'USEUNIT Constants

'----------------------------------------------
'Կանխիկացման հայտ փաստաթղթի լրացում
'----------------------------------------------
'docNumber - Փաստաթղթի համարը
'dateAcc - Կանխիկացման ամսաթից դաշտի արժեքը
'accCash- Հաշիվ դաշտի արժեքը
'summa - Գումար դաշտի արժեք
'fISN - Փաստատթղթի ISN-ը
Sub CashApplication_Doc_Fill(docNumber, dateAcc, accCash , summa, fISN )
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_CashOpers & "|" & c_CashReq)
    If wMDIClient.WaitVBObject("frmASDocForm", 3000).Exists Then
      'Ստեղծվող ISN - ի փաստատթղթի  վերագրում փոփոխականին
      fISN = wMDIClient.vbObject("frmASDocForm").DocFormCommon.Doc.isn
      'Փաստաթղթի N դաշտի արժեքի վերագրում փոփոխականին
      docNumber = Get_Rekvizit_Value("Document", 1, "General", "DOCNUM")    
      'Կանխիկացման ամսաթիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "REQUESTDATE", dateAcc)
      'Հաշիվ դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACCDB", accCash)
      'Գումար դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SUMMA", summa)
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
    Else 
      Log.Error "Can't open frmASDocForm window", "", pmNormal, ErrorColor
    End If
End Sub

'----------------------------------------------
'¸ÇÉÇÝ·áõÙ ÷³ëï³ÃÕÃÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ
'----------------------------------------------
'data - ö³ëï³ÃÕÃÇ ëï»ÕÍÙ³Ý ³Ùë³ÃÇí
Function Check_Doc_In_NewCashApp_Workpaper (accClient)    
    Dim is_exists : is_exists = False
    
    BuiltIn.Delay(2000)
    Call wTreeView.DblClickItem("|Ð³×³Ëáñ¹Ç ëå³ë³ñÏáõÙ ¨ ¹ñ³Ù³ñÏÕ |ÂÕÃ³å³Ý³ÏÝ»ñ|Üáñ ëï»ÕÍí³Í Ï³ÝËÇÏ³óÙ³Ý Ñ³Ûï»ñ")
    If p1.WaitvbObject("frmAsUstPar", 2000).Exists Then 
      Call ClickCmdButton(2, "Î³ï³ñ»É")
    Else 
      Log.Error "Can't open frmAsUstPar window", "", pmNormal, ErrorColor
    End If
    If wMDIClient.WaitVBObject("frmPttel", 3000).Exists Then
        Do Until wMDIClient.vbObject("frmPttel").vbObject("tdbgView").EOF Or is_exists = True
            If Trim(wMDIClient.vbObject("frmPttel").vbObject("tdbgView").Columns.Item(6).text) = accClient Then
                is_exists = True
            Else
                Call wMDIClient.vbObject("frmPttel").vbObject("tdbgView").MoveNext
            End If
        Loop
    Else
       Log.Error "Can't open frmPttel window", "", pmNormal, ErrorColor
    End If
    
    Check_Doc_In_NewCashApp_Workpaper = is_exists
End Function