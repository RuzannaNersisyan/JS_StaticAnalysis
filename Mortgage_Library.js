Option Explicit
'USEUNIT Library_Common
'USEUNIT Library_CheckDB
'USEUNIT Library_Colour
'USEUNIT Constants

'---------------------------------------------------------------------------------------------
'êïáõ·»É, áñ Ñ³ÛïÝíáõÙ ¿ messagebox, ¨ ëïáõ·»É message box-Ç Ñ³Õáñ¹³·ñáõÃÛáõÝÁ, »Ã» å»ïù ¿
'---------------------------------------------------------------------------------------------
Sub Check_MsgBox(byval message, timeout)
    Dim frmAsMsgBox
    
    Set frmAsMsgBox = Asbank.WaitVBObject("frmAsMsgBox", timeout)
    If frmAsMsgBox.Exists Then
        
        If Not IsNull(message) And message <> "" Then
            strText = Trim(frmAsMsgBox.vbObject("lblMessage").Caption)
            strText = Replace(strText, vbNewLine, "")
            strText = Replace(strText, " ", "")
            
            message = Replace(message, " ", "")
            If strText <> message Then
                Log.Error("Message was unexpected and  = " & strText)
            End If
            
            frmAsMsgBox.vbObject("cmdButton").ClickButton()
        End If
        
    Else
        Log.Error("frmAsMsgBox was expected.")
    End If
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'----------Գրավ(ոսկի) պայմանագրի համար առարկայի ստեղծում------------'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'NameObject  - Գրավի առարկայի անվանում
'CountObject - Գրավի առարկայի քանակ
'AmountObject - Գրավի առարկայի գումար
Sub Create_Object_Gold(NameObject, CountObject, AmountObject)
    Dim  NumName , NumCount ,NumAmount, CountGold, Is_Found
    
    BuiltIn.Delay(3000)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_NewPledge)   
    BuiltIn.Delay(2000)
    ''''''Գրիդի Լրացում
    ''''''START GRID''''''
  
     '''''''Անվանում
     NumName = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.Grid("OBJECTS").NumFromName("NAME") 
     With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
       .Col= NumName 
       .Keys("^[Down]")
     End With  
 
          '''''''Առարկայի անվանման փնտրում
          CountGold=Sys.Process("Asbank").VBObject("frmModalBrowser").VBObject("tdbgView").ApproxCount
          Is_Found= Search_Row(CountGold, NameObject)
          If  Is_Found Then
             Log.Message NameObject & " is FOUND", "", pmNormal, MessageColor 
          Else
             Log.Error NameObject & " is'n FOUND", "", pmNormal, ErrorColor 
          End  If
      
     NumAmount = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.Grid("OBJECTS").NumFromName("NETWEIGHT") 
     With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
       .Col= NumAmount 
       .Keys("10" & "[Enter]")
     End With                  
     '''''''Քանակ
     NumCount = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.Grid("OBJECTS").NumFromName("COUNT") 
     With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
        .Col= NumCount 
        .Keys(CountObject & "[Enter]")
     End With    
     ''''''Գումար
     NumAmount = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.Grid("OBJECTS").NumFromName("SUMMA") 
     With wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid")
        .Col= NumAmount 
        .Keys(AmountObject & "[Enter]")
     End With

   ''''''END GRID''''''
   ''''Կատարել Կոճակ
  Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''' 
'--------------Øáõïù ·áñÍ»É Ñ³ëï³ïáÕÇ ÃÕÃ³å³Ý³Ï------'
'''''''''''''''''''''''''''''''''''''''''''''''''''''' 
' FolderName - ÃÕÃ³å³Ý³ÏÇ ³Ýí³ÝáõÙ
' NAgr - å³ÛÙ³Ý³·ñÇ Ñ³Ù³ñ
Sub GoTo_Folders(FolderName,NAgr) 
  BuiltIn.Delay(2000)
  Call wTreeView.DblClickItem(FolderName) 
  If p1.WaitVBObject("frmAsUstPar", 3000).Exists Then
    Call Rekvizit_Fill("Dialog", 1, "General", "NUM", "^[ReleaseLast]^a^h" & NAgr)
    Call ClickCmdButton(2, "Î³ï³ñ»É")
  Else 
    Log.Error "Can't open frmAsUstPar window", "", pmNormal, ErrorColor
  End If
End Sub
        
''''''''''''''''''''''''''''''''''''''''''''''''''''''' 
'-------------------ö³Ï»É ÃÕÃ³å³Ý³ÏÁ------------------'
''''''''''''''''''''''''''''''''''''''''''''''''''''''' 
'PttelName - åïï»ÉÇ ³Ýí³ÝáõÙÁ
Sub Close_Pttel(PttelName)
    Dim PttelWin
    Set PttelWin = wMDIClient.WaitVBObject(PttelName,10000)
    If PttelWin.Exists Then
        PttelWin.Close
    Else
        Log.Error "Can Not Close Pttel Window",,,ErrorColor    
    End If 
End Sub

''''''''''''''''''''''''''''''''''''''' 
'---------öÝïñ»É óáõó³ÏáõÙ------------'
''''''''''''''''''''''''''''''''''''''' 
'Count - îáÕ»ñÇ ù³Ý³Ï
'Search_Row_Name - ÷ÝïñíáÕ ïíÛ³É
'üáõÝÏóÇ³Ý Ñ³Ù»Ù³ïáõÙ ¿  Search_Row_Name  µ³óí³Í ³ÕáõëÛ³ÏÇ ³é³çÇ ëÛ³Ý ³ñÅ»ùÇ Ñ»ï. 
'ì»ñ³¹³ñÓÝáõÙ ¿ true/false Ñ³Ù³Ó³ÛÝ ÷ÝïñÙ³Ý ³ñ¹ÛáõÝùÇ
Function Search_Row(Count, Search_Row_Name)
  Dim CurrentName, Check
  Check = false
  Do While Count>0
              CurrentName=Trim(Sys.Process("Asbank").VBObject("frmModalBrowser").VBObject("tdbgView").NativeVBObject)
              If CurrentName=Search_Row_Name Then
                 Sys.Process("Asbank").VBObject("frmModalBrowser").VBObject("tdbgView").Keys("[Enter]")
                 Count=0
                 Check = true
              End If
                 Count=Count-1
              If Count>0 Then
                 ''Ð³çáñ¹ ïáÕÇ ³ÝóáõÙ 
                 Sys.Process("Asbank").VBObject("frmModalBrowser").VBObject("tdbgView").MoveNext
              End If
  Loop 
  Search_Row=Check
End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''' 
'-------ä³ÛÙ³Ý³·ñÇ ³éÏ³ÛáõÃÛ³Ý ëïáõ·áõÙ frmPttel-áõÙ--------'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
' NAgr - å³ÛÙ³Ý³·ñÇ Ñ³Ù³ñ
' ColNum - ëÛ³Ý Ñ³Ù³ñÁ , Ã» áñÇ Ñ»ï å»ïù ¿ Ñ³Ù»Ù³ï»É NAgr-Á
' ì»ñ³¹³ñÓÝáõÙ ¿ true/false Ñ³Ù³Ó³ÛÝ ÷ÝïñÙ³Ý ³ñ¹ÛáõÝùÇ 
Function Is_Agr_Exist(NAgr, ColNum)
   Dim AgrNum , CountRow , Check
   Check=false
   Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).Refresh
   CountRow=Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").ApproxCount
   If CountRow = 1 Then
      AgrNum=Trim(Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").VBObject("tdbgView").Columns.Item(ColNum))
      If AgrNum=NAgr Then
          Check=True
      End If      
   End If
   Is_Agr_Exist= Check        
End Function

'''''''''-'''''''''''''''''''''''''''''''''''''' 
'----------------ö³Ï»É å³ÛÙ³Ý³·ñÇÁ-------------'
''''''''''''''''''''''''''''''''''''''''''''''''
'CloseDate - å³ÛÙ³Ý³·ñÏ ÷³ÏÙ³Ý ³Ùë³ÃÇí
Sub Close_Agr(CloseDate)
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrClose)
    ''''²Ùë³ÃÇí
    Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("TabFrame").VBObject("TDBDate").Keys(CloseDate  & "[Tab]")
    ''''Î³ï³ñ»É Îá×³Ï 
    Sys.Process("Asbank").VBObject("frmAsUstPar").VBObject("CmdOK").ClickButton
End Sub

'''''''''''''''''''''''''''''''''''''''''''' 
'--------------´³ó»É å³ÛÙ³Ý³·ÇñÁ-----------'
''''''''''''''''''''''''''''''''''''''''''''
Sub Open_Agr()
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click(c_AgrOpen) 
				wMDIClient.Refresh
End Sub

''''''''''''''''''''''''''''''''''''''''''' 
'------ä³ÛÙ³Ý³·ñÇ/²é³ñÏ³ÛÇ Ñ»é³óáõÙ-------'
'''''''''''''''''''''''''''''''''''''''''''
Sub Delete()
    Set wMainForm = Sys.Process("Asbank").VBObject("MainForm") 
    Set wMDIClient = wMainForm.Window("MDIClient", "", 1) 
    Call wMainForm.MainMenu.Click(c_AllActions)
    Call wMainForm.PopupMenu.Click("Ջնջել")  
    '²Ûá Îá×³Ï 
    Sys.Process("Asbank").VBObject("frmDeleteDoc").VBObject("YesButton").ClickButton
End Sub

'''''''''''''''''''''''''''''''''''''''
'----------îñ³Ù³¹ñáõÙ-----------------'
'''''''''''''''''''''''''''''''''''''''
' ProvideDate - ïñ³Ù³¹ñÙ³Ý ³Ùë³ÃÇí
Function Provide_Mortgage(ProvideDate)
		Dim Str
		
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click("Գործողություններ|Տրամադրում")
		
			Provide_Mortgage = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
			
  '²Ùë³ÃÇí
  Str = GetVBObject ("DATE", wMDIClient.vbObject("frmASDocForm"))
  wMDIClient.vbObject("frmASDocForm").vbObject("TabFrame").vbObject(Str).Keys(ProvideDate & "[Tab]")
  'Î³ï³ñ»É
  Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").VBObject("CmdOk_2").ClickButton
  'Ð³ßí³é»É
'  Sys.Process("Asbank").VBObject("frmTrans").VBObject("cmdOk").ClickButton
End Function

'''''''''''''''''''''''''''''''''''''''
'------------ì»ñ³¹³ñÓ-----------------'
'''''''''''''''''''''''''''''''''''''''
' ReturnDate - í»ñ³¹³ñÓÇ ³Ùë³ÃÇí 
Function Mortgage_Return(ReturnDate)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click("Գործողություններ|Վերադարձ")
		
		Mortgage_Return = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.isn
  
  '²Ùë³ÃÇí
		Call Rekvizit_Fill("Document", 1, "General", "DATE", ReturnDate)
  'Î³ï³ñ»É
		Call ClickCmdButton(1, "Î³ï³ñ»É")
		if p1.VBObject("frmAsMsgBox").Exists then 
				Call Check_MsgBox("¶ñ³íáí ³å³Ñáíí³Í å³ÛÙ³Ý³·ñÇ ÙÝ³óáñ¹Á ½ñáÛ³Ï³Ý ã¿", delay_small)
		end if
End Function

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'-----¶ñ³í(÷áË³¹ñ³ÙÇçáó) å³ÛÙ³Ý³·ñÇ Ñ³Ù³ñ ³é³ñÏ³ÛÇ ëï»ÕÍáõÙ-------'
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''  
'AmountObject - ³é³ñÏ³ÛÇ ³ñÅ»ùÁ
Sub Create_Object_Car(AmountObject)
  BuiltIn.Delay(3000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click(c_NewPledge) 
  BuiltIn.Delay(2000)
  Call Rekvizit_Fill("Document", 1, "General", "SUMMA", AmountObject)
  'Î³ï³ñ»É
 Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''
'------²í»É³óÝ»É Ï³å³ÏóáõÙ í³ñÏÇ ²Þî-Çó---------'
'''''''''''''''''''''''''''''''''''''''''''''''''
' MortNum - ·ñ³íÇ å³ÛÙ³Ý³·ñÇ Ñ³Ù³ñ
Sub Add_Relation_From_Loan(MortNum)
  Dim Num

  BuiltIn.Delay(3000)
  Call wMainForm.MainMenu.Click(c_AllActions)
  Call wMainForm.PopupMenu.Click("Ապահովվածություն|Պայմանագրի կապակցում(Նոր)|Պայմանագրի կապակցում")
  BuiltIn.Delay(1000)
  
  '¶ñÇ¹Ç Èñ³óáõÙ
  Num = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.Grid("MORTGAGE").NumFromName("MORTCODE") 
  wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid").Col= Num 
  wMDIClient.VBObject("frmASDocForm").VBObject("TabFrame").VBObject("DocGrid").Keys(MortNum & "[Tab]")
 
  Call ClickCmdButton(1, "Î³ï³ñ»É")
End Sub