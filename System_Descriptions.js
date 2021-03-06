'USEUNIT Library_Common
'USEUNIT Constants
'USEUNIT Library_Colour
Option Explicit

'Test Case ID 164017

Dim sDATE, fDATE, folderName, frmPttel
Dim ActualMessage, obj

Sub System_Description_Test()
  Call Test_Initialize()

  ' Ð³Ù³Ï³ñ· Ùáõïù ·áñÍ»É ARMSOFT û·ï³·áñÍáÕáí
	Log.Message "Համակարգ մուտք գործել ARMSOFT օգտագործողով", "", pmNormal, DivideColor
  Call Test_StartUp()
    
  wTreeView.DblClickItem(folderName)
  if p1.WaitVBObject("frmAsUstPar", 3000).Exists then
  	Call ClickCmdButton(2, "Î³ï³ñ»É")
	else 
			Log.Error "Can't open System Description(frmAsUstPar) window.", "", pmNormal, ErrorColor
	end if
  
  Set frmPttel = wMDIClient.WaitVBObject("frmPttel", 1000)
  if frmPttel.Exists then
    frmPttel.Keys("^h")
    Call Filter_Pttel()
  else 
    Log.Error "Can't open frmPttel window.", "", pmNormal, ErrorColor
  end if
  
  frmPttel.Keys("[NumPlus]")
  
  Call wMainForm.MainMenu.Click(c_AllActions)
	Call wMainForm.PopupMenu.Click(c_Check)
  
  while not wMDIClient.WaitVBObject("FrmSpr", 2000).Exists 
    BuiltIn.Delay(1000)
  wend
  
  if wMDIClient.WaitVBObject("FrmSpr", 2000).Exists then
    wMDIClient.VBObject("FrmSpr").Keys("^c")
    Set obj = CreateObject("htmlfile")
    ActualMessage = obj.ParentWindow.ClipboardData.GetData("text")
    Set obj = Nothing
    if ActualMessage = "êïáõ·áõÙÁ ³Ýó³í µ³ñ»Ñ³çáÕ:" then
      Log.Message "Expected text is match with actual.", "", pmNormal, MessageColor
    else
      Log.Error "Expected text don't match with actual.", "", pmNormal, ErrorColor
    end if
  else 
    Log.Error "Can't open FrmSpr window.", "", pmNormal, ErrorColor
  end if
  
  BuiltIn.Delay(3000)
  wMDIClient.VBObject("FrmSpr").Close
  
  BuiltIn.Delay(3000)
	wMDIClient.VBObject("frmPttel").Close
  
  Call Close_AsBank() 
End Sub

Sub Test_Initialize()
		folderName = "|²¹ÙÇÝÇëïñ³ïáñÇ ²Þî 4.0|Ð³Ù³Ï³ñ·³ÛÇÝ ³ßË³ï³ÝùÝ»ñ|Ð³Ù³Ï³ñ·³ÛÇÝ ÝÏ³ñ³·ñáõÃÛáõÝÝ»ñ|Ð³Ù³Ï³ñ·³ÛÇÝ ÝÏ³ñ³·ñáõÃÛáõÝÝ»ñ"
	
		sDATE = "20030101"
		fDATE = "20250101"  
End Sub

Sub Test_StartUp()
  Call Initialize_AsBank("bank", sDATE, fDATE)
  Login("ARMSOFT")
	Call ChangeWorkspace(c_Admin40)
End Sub

Sub Filter_Pttel() 
  Dim frmPttelFilter, i
  
  Set frmPttelFilter = p1.VBObject("frmPttelFilter")
  if frmPttelFilter.Exists then 
    frmPttelFilter.Keys("[Tab]")
    frmPttelFilter.Keys("[Down]")
    frmPttelFilter.Keys("[Right]")
    frmPttelFilter.Keys("[Right]")
    frmPttelFilter.Keys("a")
    for i = 0 to 3
      frmPttelFilter.Keys("[Down]")
    next
    frmPttelFilter.Keys("[Enter]")
    frmPttelFilter.Keys("[Right]")
    frmPttelFilter.Keys("[Right]")
    frmPttelFilter.Keys(aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%d/%m/%y"))
    Call ClickCmdButton(7, "Î³ï³ñ»É")
  else 
    Log.Error "Can't open frmPttelFilter window.", "", pmNormal, ErrorColor
  end if
End Sub
