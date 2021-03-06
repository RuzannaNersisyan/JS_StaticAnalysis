'USEUNIT Library_Common 
'USEUNIT Library_Colour

Function GetAccountISN(AccCode)
  ' Creates ADO connection
  Set aCon = ADO.CreateConnection
  ' Sets up the connection parameters
  'aCon.ConnectionString = "Provider=SQLOLEDB.1;Password=sa;Persist Security Info=True;User ID=sa;Initial Catalog=bankShowTesting;Data Source=BANK-SERVER"
  aCon.ConnectionString = cConnectionString
  ' Opens the connection
  aCon.Open
  ' Creates a command and specifies its parameters
  Set aCmd = ADO.CreateCommand
  aCmd.ActiveConnection = aCon ' Connection
  aCmd.CommandType = adCmdStoredProc ' Command type
  aCmd.CommandText = "asfb_GetAccountISN"
  aCmd.Parameters.Append aCmd.CreateParameter("@Return", 3, 4)
  aCmd.Parameters.Append aCmd.CreateParameter("@ACC", 200, 1, 11, AccCode)
  aCmd.Execute
  GetAccountISN = aCmd.Parameters("@Return").Value
  aCon.Close  
End Function

'---------------------------------------------------------------------------------------------
Sub Check_HI_CE_accounting (fDATE,fBASE, fTYPE, fOBJECT, fSUM, fCUR, fCURSUM, fOP, fDBCR)
  
  Set aCon = ADO.CreateConnection
  'aCon.ConnectionString = "Provider=SQLOLEDB.1;Password=sa;Persist Security Info=True;User ID=sa;Initial Catalog=bankShowTesting;Data Source=BANK-SERVER"
  aCon.ConnectionString = cConnectionString
  aCon.Open

  Set aCmd1 = ADO.CreateCommand
  aCmd1.ActiveConnection = aCon ' Connection
  aCmd1.CommandType = adCmdText ' Command type

  aCmd1.CommandText = "select count (*) from HI where fDATE = '" & fDATE & "' and fTYPE = '" & fTYPE & "' and fOBJECT = " & fOBJECT & " and fOP = '" & fOP & "'"
  aCmd1.CommandText = aCmd1.CommandText & " and fSUM = " & fSUM
  aCmd1.CommandText = aCmd1.CommandText & " and fCUR = " & fCUR
  aCmd1.CommandText = aCmd1.CommandText & " and fCURSUM = " & fCURSUM
  aCmd1.CommandText = aCmd1.CommandText & " and fDBCR = '" & fDBCR & "'"
  aCmd1.CommandText = aCmd1.CommandText & " and fBASE = " & fBASE
   
  BuiltIn.Delay(1000)
  Set aRecSet1 = aCmd1.Execute
  BuiltIn.Delay(5000)
   
  If aRecSet1.Fields.Item(0).Value = 1 Then
      Log.Message("CE accounting is correct in HI")    
  Else
      Log.Error("CE accounting is incorrect in HI")
      Log.Error "Incorrect Query = " & aCmd1.CommandText
  End If
  
  aRecSet1.Close
  aCon.Close
End Sub

'---------------------------------------------------------------------------------------------
Sub Check_HIF (fDATE, fTYPE, fOBJECT, fSUM, fCURSUM, fOP, fSPEC)

  Set aCon = ADO.CreateConnection
  'aCon.ConnectionString = "Provider=SQLOLEDB.1;Password=sa;Persist Security Info=True;User ID=sa;Initial Catalog=bankShowTesting;Data Source=BANK-SERVER"
  aCon.ConnectionString = cConnectionString
  aCon.Open

  Set aCmd1 = ADO.CreateCommand
  aCmd1.ActiveConnection = aCon ' Connection
  aCmd1.CommandType = adCmdText ' Command type

  aCmd1.CommandText = "select count (*) from HIF where fDATE = '" & fDATE & "' and fTYPE = '" & fTYPE & "' and fOBJECT = " & fOBJECT & " and fOP = '" & fOP & "'"
  
  If not IsNull(fSUM) Then
    aCmd1.CommandText = aCmd1.CommandText & " and fSUM = '" & fSUM & "'"
  End If
  
  If not IsNull(fCURSUM) Then
    aCmd1.CommandText = aCmd1.CommandText & " and fCURSUM = '" & fCURSUM & "'"
  End If
   
  If not IsNull(fSPEC) Then
    aCmd1.CommandText = aCmd1.CommandText & " and fSPEC = '" & fSPEC & "'"
  End If

  BuiltIn.Delay(1000)
  Set aRecSet1 = aCmd1.Execute

  If aRecSet1.Fields.Item(0).Value = 1 Then
      Log.Message("HIF record is Correct")    
  Else
      Log.Error("HIF record is Incorrect")
      Log.Error "Incorrect Query = " & aCmd1.CommandText
  End If
  
  aRecSet1.Close
  aCon.Close
End Sub

'---------------------------------------------------------------------------------------------
Sub Check_HIR (fDATE, fTYPE, fOBJECT, fCUR, fCURSUM, fOP, fDBCR)

  Set aCon = ADO.CreateConnection
  'aCon.ConnectionString = "Provider=SQLOLEDB.1;Password=sa;Persist Security Info=True;User ID=sa;Initial Catalog=bankShowTesting;Data Source=BANK-SERVER"
  aCon.ConnectionString = cConnectionString
  aCon.Open

  Set aCmd1 = ADO.CreateCommand
  aCmd1.ActiveConnection = aCon ' Connection
  aCmd1.CommandType = adCmdText ' Command type

  aCmd1.CommandText = "select count (*) from HIR where fDATE = '" & fDATE & "' and fTYPE = '" & fTYPE & "' and fOBJECT = " & fOBJECT & " and fOP = '" & fOP & "'"
  aCmd1.CommandText = aCmd1.CommandText & " and fCUR = " & fCUR
  aCmd1.CommandText = aCmd1.CommandText & " and fCURSUM = " & fCURSUM
  aCmd1.CommandText = aCmd1.CommandText & " and fDBCR = '" & fDBCR & "'"
   
  BuiltIn.Delay(1000)
  Set aRecSet1 = aCmd1.Execute

  If aRecSet1.Fields.Item(0).Value = 1 Then
      Log.Message("HIR record is Correct")    
  Else
      Log.Error("HIR record is Incorrect")
      Log.Error "Incorrect Query = " & aCmd1.CommandText
  End If
  
  aRecSet1.Close
  aCon.Close
  
End Sub

'---------------------------------------------------------------------------------------------
Sub Check_HIT (fDATE, fTYPE, fOBJECT, fCUR, fCURSUM, fOP, fDBCR)

  Set aCon = ADO.CreateConnection
  'aCon.ConnectionString = "Provider=SQLOLEDB.1;Password=sa;Persist Security Info=True;User ID=sa;Initial Catalog=bankShowTesting;Data Source=BANK-SERVER"
  aCon.ConnectionString = cConnectionString
  aCon.Open

  Set aCmd1 = ADO.CreateCommand
  aCmd1.ActiveConnection = aCon ' Connection
  aCmd1.CommandType = adCmdText ' Command type

  aCmd1.CommandText = "select count (*) from HIT where fDATE = '" & fDATE & "' and fTYPE = '" & fTYPE & "' and fOBJECT = " & fOBJECT & " and fOP = '" & fOP & "'"
  aCmd1.CommandText = aCmd1.CommandText & " and fCUR = " & fCUR
  aCmd1.CommandText = aCmd1.CommandText & " and fCURSUM = " & fCURSUM
  aCmd1.CommandText = aCmd1.CommandText & " and fDBCR = '" & fDBCR & "'"
   
  BuiltIn.Delay(1000)
  Set aRecSet1 = aCmd1.Execute

  If aRecSet1.Fields.Item(0).Value = 1 Then
      Log.Message("HIT record is Correct")    
  Else
      Log.Error("HIT record is Incorrect")
      Log.Error "Incorrect Query = " & aCmd1.CommandText
  End If
  
  aRecSet1.Close
  aCon.Close
  
End Sub

'---------------------------------------------------------------------------------------------
Sub Check_AGRSCHEDULE (fAGRISN, fDATE, fDATEP, fINC, fTYPE, fKIND)

  Set aCon = ADO.CreateConnection
  'aCon.ConnectionString = "Provider=SQLOLEDB.1;Password=sa;Persist Security Info=True;User ID=sa;Initial Catalog=bankShowTesting;Data Source=BANK-SERVER"
  aCon.ConnectionString = cConnectionString
  aCon.Open

  Set aCmd1 = ADO.CreateCommand
  aCmd1.ActiveConnection = aCon ' Connection
  aCmd1.CommandType = adCmdText ' Command type

  aCmd1.CommandText = "select count (*) from AGRSCHEDULE where fDATE = '" & fDATE & "' and fDATEP = '" & fDATEP & "' and fAGRISN = '" & fAGRISN & "' and fINC = " & fINC & " and fTYPE = '" & fTYPE & "'"
  aCmd1.CommandText = aCmd1.CommandText & " and fKIND = " & fKIND   
  
  BuiltIn.Delay(1000)
  Set aRecSet1 = aCmd1.Execute

  If aRecSet1.Fields.Item(0).Value = 1 Then
      Log.Message("AGRSCHEDULE record is Correct")    
  Else
      Log.Error("AGRSCHEDULE record is Incorrect")
  End If
  
  aRecSet1.Close
  aCon.Close
  
End Sub

'---------------------------------------------------------------------------------------------
Sub Check_AGRSCHEDULEVALUES (fAGRISN, fINC, fDATE, fSUM, fVALUETYPE, fREDPERIOD)

  Set aCon = ADO.CreateConnection
  'aCon.ConnectionString = "Provider=SQLOLEDB.1;Password=sa;Persist Security Info=True;User ID=sa;Initial Catalog=bankShowTesting;Data Source=BANK-SERVER"
  aCon.ConnectionString = cConnectionString
  aCon.Open

  Set aCmd1 = ADO.CreateCommand
  aCmd1.ActiveConnection = aCon ' Connection
  aCmd1.CommandType = adCmdText ' Command type

  aCmd1.CommandText = "select count (*) from AGRSCHEDULEVALUES where fDATE = '" & fDATE & "' and fAGRISN = '" & fAGRISN & "' and fINC = " & fINC & " and fSUM = '" & fSUM & "'"
  aCmd1.CommandText = aCmd1.CommandText & " and fVALUETYPE = " & fVALUETYPE
  aCmd1.CommandText = aCmd1.CommandText & " and fREDPERIOD = " & fREDPERIOD
   
  BuiltIn.Delay(1000)
  Set aRecSet1 = aCmd1.Execute

  If aRecSet1.Fields.Item(0).Value = 1 Then
      Log.Message("AGRSCHEDULEVALUES record is Correct")    
  Else
      Log.Error("AGRSCHEDULEVALUES record is Incorrect")
      Log.Error "Incorrect Query = " & aCmd1.CommandText
  End If
  
  aRecSet1.Close
  aCon.Close
  
End Sub

'----------------------------------------------------------------------------------
'  áñå»ë å³ñ³Ù»ïñ ÷áË³Ýóí³Í SQL Ñ³ñóÙ³Ý å³ï³ëË³ÝÇ ïáÕ»ñÇ ù³Ý³ÏÁ, Ýßí³Í ³ÕÛáõë³ÏáõÙ  
'----------------------------------------------------------------------------------
Function my_Row_Count(sqlQuery)
  Set aCon = ADO.CreateConnection
  aCon.ConnectionString = cConnectionString
  aCon.Open
  
  Set aCmd1 = ADO.CreateCommand
  aCmd1.ActiveConnection = aCon 
  aCmd1.CommandType = adCmdText
  aCmd1.CommandText = sqlQuery   
  Set aRecSet1 = aCmd1.Execute     
  my_Row_Count = aRecSet1.Fields.Item(0).Value 
  
  aRecSet1.Close
  aCon.Close 
End Function

 'Ստուգում է DOCS աղյուսակում fISN,fNAME,fSTATE,fBODY սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_DOCS(fISN,fNAME,fSTATE,fBODY,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from DOCS WHERE fISN = "& fISN &" and fNAME = '"& fNAME &"'"&_
                              " and fSTATE = "& fSTATE &" and fBODY LIKE '" & fBODY & "'"
     
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 

    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "DOCS record is correct.",,,MessageColor
    Else
       Log.Error "DOCS record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
       Log.Error "Actual fBODY = "& Return_COLUMN_In_TABLE("fISN = " & fISN, "DOCS", "fBODY"),,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'Վերադարձնում է տրված աղյուսակի տրված սյան արժեքը
Function Return_COLUMN_In_TABLE(Condition,TableName,ColumnName)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select Count("&ColumnName&") from "&TableName&" WHERE " & Condition
        
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(2000)   
    
    If dbRecSet.Fields.Item(0).Value  <> 0 Then
        dbCmd.CommandText = "Select "&ColumnName&" from "&TableName&" WHERE " & Condition
        BuiltIn.Delay(2000)   
        Set dbRecSet = dbCmd.Execute
        Return_COLUMN_In_TABLE = dbRecSet.Fields.Item(0).Value
    Else
        Return_COLUMN_In_TABLE = "Empty value"
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Function

'Ստուգում է DOCLOG աղյուսակում fISN,fSUID,fOP,fSTATE,fCOM սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_DOCLOG(fISN,fSUID,fOP,fSTATE,fCOM,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from DOCLOG WHERE fISN = "& fISN &" and fSUID = '"& fSUID &"'"&_
                            "and fOP = '" & fOP & "' and fSTATE = '" & fSTATE & "' and fCOM = '" & fCOM & "'"
     
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 

    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "DOCLOG record is correct.",,,MessageColor
    Else
       Log.Error "DOCLOG record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'Ստուգում է DOCSG աղյուսակում fISN,fNAME,fSTATE,fBODY սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_DOCSG(fISN,fGRID,fROW,fCOL,fVALUE,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from DOCSG WHERE fISN = "& fISN &" and fGRID = '"& fGRID &"'"&_
                            " and fROW = '"& fROW &"' and fCOL = '" & fCOL & "' and fVALUE = '" & fVALUE &"'"
     
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
        
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "DOCSG record is correct.",,,MessageColor
    Else
       Log.Error "DOCSG record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'Ստուգում է DOCP աղյուսակում fISN,fNAME,fPARENTISN սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_DOCP(fISN,fNAME,fPARENTISN,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from DOCP WHERE fISN = "& fISN &" and fNAME = '"& fNAME &"'"&_
                              " and fPARENTISN = "& fPARENTISN
     
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 

    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "DOCP record is correct.",,,MessageColor
    Else
       Log.Error "DOCP record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub
'''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''[FOLDERS]'''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''
Class DB_FOLDERS

    Public fFOLDERID
    Public fNAME
    Public fKEY
    Public fISN
    Public fSTATUS
    Public fCOM
    Public fSPEC
    Public fECOM
    Public fDCBRANCH
    Public fDCDEPART
    Private Sub Class_Initialize()  
        fFOLDERID = ""
        fNAME = ""
        fKEY = ""
        fISN = ""
        fSTATUS = ""
        fCOM = ""
        fSPEC = ""
        fECOM = ""
        fDCBRANCH = ""
        fDCDEPART = ""
    End Sub
End Class

Function New_DB_FOLDERS()
    Set New_DB_FOLDERS = NEW DB_FOLDERS
End Function

'Ստուգում է FOLDERS աղյուսակում dbFOLDERS-ի բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_FOLDERS(dbFOLDERS,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from FOLDERS WHERE fFOLDERID = ? and fNAME = ? and fKEY = ? and fISN = ? "&_
                            " and fSTATUS = ? and fCOM = ? and fSPEC = ? and fECOM = ? and fDCBRANCH = ? and fDCDEPART = ?"
     
    dbCmd.Parameters.Append dbCmd.CreateParameter("fFOLDERID", DB.adVarWChar, DB.adParamInput, 20,dbFOLDERS.fFOLDERID)                          
    dbCmd.Parameters.Append dbCmd.CreateParameter("fNAME", DB.adChar, DB.adParamInput, 8,dbFOLDERS.fNAME)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fKEY", DB.adVarWChar, DB.adParamInput, 64, dbFOLDERS.fKEY)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fISN", DB.adInteger, DB.adParamInput, , dbFOLDERS.fISN)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSTATUS", DB.adUnsignedTinyInt, DB.adParamInput, , dbFOLDERS.fSTATUS)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCOM", DB.adVarWChar, DB.adParamInput, 150, dbFOLDERS.fCOM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSPEC", DB.adVarWChar, DB.adParamInput, 500, dbFOLDERS.fSPEC)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fECOM", DB.adVarWChar, DB.adParamInput, 150, dbFOLDERS.fECOM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDCBRANCH", DB.adChar, DB.adParamInput, 3, dbFOLDERS.fDCBRANCH)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDCDEPART", DB.adChar, DB.adParamInput, 3, dbFOLDERS.fDCDEPART)
                                    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "FOLDERS record is correct.",,,MessageColor
    Else
       Log.Error "FOLDERS record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = Select COUNT(*) from FOLDERS WHERE fFOLDERID = '"& dbFOLDERS.fFOLDERID &"' and fNAME = '"&dbFOLDERS.fNAME &_
       "' and fKEY = '"&dbFOLDERS.fKEY &"' and fISN = '"&dbFOLDERS.fISN &"' and fSTATUS = '"&dbFOLDERS.fSTATUS &"' and fCOM = '"&dbFOLDERS.fCOM &_
       "' and fSPEC = '"&dbFOLDERS.fSPEC &"' and fECOM = '"&dbFOLDERS.fECOM &"' and fDCBRANCH = '"&dbFOLDERS.fDCBRANCH &"' and fDCDEPART = '"&dbFOLDERS.fDCDEPART &"'",,,ErrorColor
       
       Log.Error "Actual fSPEC = "& Return_COLUMN_In_TABLE("fISN = "&dbFOLDERS.fISN & " and fFOLDERID = '" & dbFOLDERS.fFOLDERID & "'", "FOLDERS", "fSPEC"),,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'Ստուգում է FOLDERS աղյուսակում dbFOLDERS-ի բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_FOLDERS_With_Like(dbFOLDERS,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from FOLDERS WHERE fFOLDERID = ? and fNAME = ? and fKEY = ? and fISN = ? "&_
                            " and fSTATUS = ? and fCOM = ? and fSPEC Like ? and fECOM = ? and fDCBRANCH = ? and fDCDEPART = ?"
     
    dbCmd.Parameters.Append dbCmd.CreateParameter("fFOLDERID", DB.adVarWChar, DB.adParamInput, 20,dbFOLDERS.fFOLDERID)                          
    dbCmd.Parameters.Append dbCmd.CreateParameter("fNAME", DB.adChar, DB.adParamInput, 8,dbFOLDERS.fNAME)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fKEY", DB.adVarWChar, DB.adParamInput, 64, dbFOLDERS.fKEY)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fISN", DB.adInteger, DB.adParamInput, , dbFOLDERS.fISN)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSTATUS", DB.adUnsignedTinyInt, DB.adParamInput, , dbFOLDERS.fSTATUS)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCOM", DB.adVarWChar, DB.adParamInput, 150, dbFOLDERS.fCOM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSPEC", DB.adVarWChar, DB.adParamInput, 500, dbFOLDERS.fSPEC)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fECOM", DB.adVarWChar, DB.adParamInput, 150, dbFOLDERS.fECOM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDCBRANCH", DB.adChar, DB.adParamInput, 3, dbFOLDERS.fDCBRANCH)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDCDEPART", DB.adChar, DB.adParamInput, 3, dbFOLDERS.fDCDEPART)
                                    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "FOLDERS record is correct.",,,MessageColor
    Else
       Log.Error "FOLDERS record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = Select COUNT(*) from FOLDERS WHERE fFOLDERID = '"& dbFOLDERS.fFOLDERID &"' and fNAME = '"&dbFOLDERS.fNAME &_
       "' and fKEY = '"&dbFOLDERS.fKEY &"' and fISN = '"&dbFOLDERS.fISN &"' and fSTATUS = '"&dbFOLDERS.fSTATUS &"' and fCOM = '"&dbFOLDERS.fCOM &_
       "' and fSPEC Like '"&dbFOLDERS.fSPEC &"' and fECOM = '"&dbFOLDERS.fECOM &"' and fDCBRANCH = '"&dbFOLDERS.fDCBRANCH &"' and fDCDEPART = '"&dbFOLDERS.fDCDEPART &"'",,,ErrorColor
       
       Log.Error "Actual fSPEC = "& Return_COLUMN_In_TABLE("fISN = "&dbFOLDERS.fISN & " and fFOLDERID = '" & dbFOLDERS.fFOLDERID & "'", "FOLDERS", "fSPEC"),,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'Ստուգում է TableName աղյուսակում IsnType սյունով
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
'TableName - աղուսյակի անունը
'ColumnName - սյունի անունը
'Value - արժեքը
'ExpectedRowCount - սպասվող տողերի քանակը
Sub CheckQueryRowCount(TableName,ColumnName,Value,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from "& TableName &" WHERE "& ColumnName & " = '"& Value  &"'"
     
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(500) 
        
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message TableName & " Count Value is correct.",,,MessageColor
    Else
       Log.Error TableName & " Count Value is Incorrect = "& ExpectedRowCount &",It Was = " & dbRecSet.Fields.Item(0).Value ,,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    dbRecSet.Close
    dbCon.Close 
End Sub

'Ստուգում է AGRNOTES աղյուսակում բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_AGRNOTES(fAGRISN,fVALUES,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from AGRNOTES WHERE fAGRISN = " & fAGRISN & " and fVALUES = '" & fVALUES &"'"
                                    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "AGRNOTES record is correct.",,,MessageColor
    Else
       Log.Error "AGRNOTES record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'Ստուգում է HIREST աղյուսակում բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_HIREST(fTYPE, fOBJECT , fREM ,fCUR, fCURREM, ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from HIREST WHERE fTYPE = '" & fTYPE & "' and fOBJECT = '" & fOBJECT &"'"&_
                            " and fREM = '" & fREM & "' and fCUR = '" & fCUR & "' and fCURREM = '" & fCURREM &"'"
                                    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "HIREST record is correct.",,,MessageColor
    Else
       Log.Error "HIREST record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub
'Ստուգում է HIRREST աղյուսակում բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_HIRREST(fTYPE,fOBJECT,fLASTREM,fLASTDATE,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from HIRREST WHERE fTYPE = '" & fTYPE & "' and fOBJECT = '" & fOBJECT &"'"&_
                            " and fLASTREM = '" & fLASTREM & "' and fLASTDATE = '" & fLASTDATE &"'"
                                    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "HIRREST record is correct.",,,MessageColor
    Else
       Log.Error "HIRREST record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'Վերադարձնում է մեր տրված արժեքով սյան արժեէը
'SearchTableName - աղուսյակի անունը(որով փնտրելու ենք)
'NameSearchColumnName - սյան անունը(որով փնտրելու ենք)
'SearchValue - արժեքը(որով փնտրելու ենք)
'ColumnName - սյան անունը որի արժեքը պետք է վերցնենք
Function GetSQL_ColumnValue(SearchTableName, NameSearchColumnName, SearchValue, ColumnName)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select " & ColumnName & " from " & SearchTableName & " WHERE " & NameSearchColumnName & " = '" & SearchValue & "'" ' ORDER BY " & ColumnName
                                    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    
    If dbRecSet.Fields(0).Value Then
       GetSQL_ColumnValue = dbRecSet.Fields(0).Value
    Else
       Log.Error SearchTableName & " Value Not Found!!!" & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Function

'''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''[CONTRACTS]''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''
Class DB_CONTRACTS

    Public fDGISN
    Public fDGPARENTISN
    Public fDGISN1
    Public fDGISN3
    Public fDGAGRKIND
    Public fDGSTATE
    Public fDGTYPENAME
    Public fDGCODE
    Public fDGPPRCODE
    Public fDGCAPTION
    Public fDGCLICODE
    Public fDGCUR
    Public fDGSUMMA
    Public fDGALLSUMMA
    Public fDGRISKDEGREE
    Public fDGRISKDEGNB
    Public fDGSCHEDULE
    Public fDGNOTE
    Public fDGNOTE2
    Public fDGNOTE3
    Public fDGDISTRICT
    Public fDGACSBRANCH
    Public fDGACSDEPART
    Public fDGACSTYPE
    Public fDGACRANOTE
    Public fDGCRDTCODE
    Public fDGAIM
    Public fDGUSAGEFIELD
    Public fDGCOUNTRY
    Public fDGREGION
    Public fDGREVISIONREASON
    Public fDGREPSOURCE
    Public fDGMORTSUBJECT
    
    Private Sub Class_Initialize()  
        fDGISN = ""
        fDGPARENTISN = ""
        fDGISN1 = ""
        fDGISN3 = ""
        fDGAGRKIND = ""
        fDGSTATE = ""
        fDGTYPENAME = ""
        fDGCODE = ""
        fDGPPRCODE = ""
        fDGCAPTION = ""
        fDGCLICODE = ""
        fDGCUR = ""
        fDGSUMMA = ""
        fDGALLSUMMA = ""
        fDGRISKDEGREE = ""
        fDGRISKDEGNB = ""
        fDGSCHEDULE = ""
        fDGNOTE = ""
        fDGNOTE2 = ""
        fDGNOTE3 = ""
        fDGDISTRICT = ""
        fDGACSBRANCH = ""
        fDGACSDEPART = ""
        fDGACSTYPE = ""
        fDGACRANOTE = ""
        fDGCRDTCODE = ""
        fDGAIM = ""
        fDGUSAGEFIELD = ""
        fDGCOUNTRY = ""
        fDGREGION = ""
        fDGREVISIONREASON = ""
        fDGREPSOURCE = ""
        fDGMORTSUBJECT = ""
    End Sub
End Class

Function New_DB_CONTRACTS()
    Set New_DB_CONTRACTS = NEW DB_CONTRACTS
End Function

'Ստուգում է CONTRACTS աղյուսակում dbCONTRACTS-ի սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_CONTRACTS(dbCONTRACTS,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from CONTRACTS WHERE fDGISN = ? and fDGPARENTISN = ? and fDGISN1 = ? and fDGISN3 = ? "&_
                            " and fDGAGRKIND = ? and fDGSTATE = ? and fDGTYPENAME = ? and fDGCODE = ? and fDGPPRCODE = ?"&_
                            " and fDGCAPTION = ? and fDGCLICODE = ? and fDGCUR = ? and fDGSUMMA = ? and fDGALLSUMMA = ?"&_
                            " and fDGRISKDEGREE = ? and fDGRISKDEGNB = ? and fDGSCHEDULE = ? and fDGNOTE = ? and fDGNOTE2 = ?"&_
                            " and fDGNOTE3 = ? and fDGDISTRICT = ? and fDGACSBRANCH = ? and fDGACSDEPART = ? and fDGACSTYPE = ?"&_
                            " and fDGACRANOTE = ? and fDGCRDTCODE = ? and fDGAIM = ? and fDGUSAGEFIELD = ? and fDGCOUNTRY = ?"&_
                            " and fDGREGION = ? and fDGREVISIONREASON = ? and fDGREPSOURCE = ? and fDGMORTSUBJECT = ? "                           
             
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGISN", DB.adInteger, DB.adParamInput, ,dbCONTRACTS.fDGISN)                          
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGPARENTISN", DB.adInteger, DB.adParamInput, ,dbCONTRACTS.fDGPARENTISN)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGISN1", DB.adInteger, DB.adParamInput, , dbCONTRACTS.fDGISN1)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGISN3", DB.adInteger, DB.adParamInput, , dbCONTRACTS.fDGISN3)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGAGRKIND", DB.adChar, DB.adParamInput,2, dbCONTRACTS.fDGAGRKIND)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGSTATE", DB.adUnsignedTinyInt, DB.adParamInput, 150, dbCONTRACTS.fDGSTATE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGTYPENAME", DB.adChar, DB.adParamInput, 8, dbCONTRACTS.fDGTYPENAME)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGCODE", DB.adVarWChar, DB.adParamInput, 20, dbCONTRACTS.fDGCODE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGPPRCODE", DB.adVarWChar, DB.adParamInput, 20, dbCONTRACTS.fDGPPRCODE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGCAPTION", DB.adVarWChar, DB.adParamInput,50 , dbCONTRACTS.fDGCAPTION)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGCLICODE", DB.adChar, DB.adParamInput, 8, dbCONTRACTS.fDGCLICODE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGCUR", DB.adChar, DB.adParamInput, 3, dbCONTRACTS.fDGCUR)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGSUMMA", DB.adCurrency, DB.adParamInput, , aqConvert.StrToCurrency(dbCONTRACTS.fDGSUMMA))
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGALLSUMMA", DB.adCurrency, DB.adParamInput, , aqConvert.StrToCurrency(dbCONTRACTS.fDGALLSUMMA))
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGRISKDEGREE", DB.adCurrency, DB.adParamInput, , aqConvert.StrToCurrency(dbCONTRACTS.fDGRISKDEGREE))
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGRISKDEGNB", DB.adCurrency, DB.adParamInput, , aqConvert.StrToCurrency(dbCONTRACTS.fDGRISKDEGNB))
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGSCHEDULE", DB.adVarWChar, DB.adParamInput, 20, dbCONTRACTS.fDGSCHEDULE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGNOTE", DB.adChar, DB.adParamInput, 3, dbCONTRACTS.fDGNOTE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGNOTE2", DB.adChar, DB.adParamInput, 3, dbCONTRACTS.fDGNOTE2)  
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGNOTE3", DB.adChar, DB.adParamInput, 3, dbCONTRACTS.fDGNOTE3)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGDISTRICT", DB.adChar, DB.adParamInput, 3, dbCONTRACTS.fDGDISTRICT)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGACSBRANCH", DB.adChar, DB.adParamInput, 3, dbCONTRACTS.fDGACSBRANCH)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGACSDEPART", DB.adChar, DB.adParamInput, 3, dbCONTRACTS.fDGACSDEPART)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGACSTYPE", DB.adChar, DB.adParamInput, 4, dbCONTRACTS.fDGACSTYPE) 
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGACRANOTE", DB.adChar, DB.adParamInput, 2,dbCONTRACTS.fDGACRANOTE)                          
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGCRDTCODE", DB.adVarWChar, DB.adParamInput, 20,dbCONTRACTS.fDGCRDTCODE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGAIM", DB.adChar, DB.adParamInput, 2, dbCONTRACTS.fDGAIM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGUSAGEFIELD", DB.adChar, DB.adParamInput, 6, dbCONTRACTS.fDGUSAGEFIELD)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGCOUNTRY", DB.adChar, DB.adParamInput, 3, dbCONTRACTS.fDGCOUNTRY)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGREGION", DB.adChar, DB.adParamInput, 9, dbCONTRACTS.fDGREGION)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGREVISIONREASON", DB.adChar, DB.adParamInput, 1, dbCONTRACTS.fDGREVISIONREASON)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGREPSOURCE", DB.adChar, DB.adParamInput, 1, dbCONTRACTS.fDGREPSOURCE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDGMORTSUBJECT", DB.adChar, DB.adParamInput, 2, dbCONTRACTS.fDGMORTSUBJECT) 
     
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "CONTRACTS record is correct.",,,MessageColor
    Else
       Log.Error "CONTRACTS record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
    
End Sub


Function Get_Compname_DOCLOG(fISN)

    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
    dbCon.ConnectionString = cConnectionString
    dbCon.Open
    
    Set dbCmd = ADO.CreateCommand
    dbCmd.ActiveConnection = dbCon
    dbCmd.CommandType = adCmdText
    dbCmd.CommandText = "select fCOMPNAME from DOCLOG where fISN = '" & fISN & "'"
    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000)
    
    If dbRecSet.RecordCount = 0 Then
      Log.Error "Recording is not found","", pmNormal, ErrorColor
      Get_Compname_DOCLOG = ""
    Else
      Get_Compname_DOCLOG = dbRecSet.Fields.Item(0).Value
    End If
    dbRecSet.Close
    dbCon.Close

End Function

'Ստուգում է RESNUMBERS աղյուսակում fISN,fTYPE,fNUMBER, սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_RESNUMBERS(fISN,fTYPE,fNUMBER,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from RESNUMBERS WHERE fISN = "& fISN &" and fTYPE = '"& fTYPE &"'"&_
                              " and fNUMBER = '"& fNUMBER & "'"
     
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 

    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "RESNUMBERS record is correct.",,,MessageColor
    Else
       Log.Error "RESNUMBERS record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'Ստուգում է MEMORDERS աղյուսակում fISN,fDOCTYPE,fCOMPLATED,fDATE,fSTATE,fDOCNUM,fSUMMA,fCUR սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_MEMORDERS(fISN,fDOCTYPE,fCOMPLETED,fDATE,fSTATE,fSUMMA,fCUR,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from MEMORDERS WHERE fISN = "& fISN &" and fDOCTYPE = '"& fDOCTYPE &"'"&_
                              " and fCOMPLETED = '"& fCOMPLETED & "' and fDATE = '"& fDATE &"' and fSTATE = '"& fSTATE &"'"&_
                              " and fSUMMA = '"& fSUMMA &"' and fCUR = '"& fCUR &"'"
    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 

    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "MEMORDERS record is correct.",,,MessageColor
    Else
       Log.Error "MEMORDERS record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''Get_ColumnValueSQL'''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''
'Ֆունկցիան վերադարձնում է փնտրվող սյան արժեքը
'SearchTableName - ²ÕÛáõë³ÏÇ ³ÝáõÝÁ, áñï»Õ å»ïù ¿ ÷Ýïñ»É
'ColumnName - öÝïñíáÕ ëÛ³Ý ³ÝáõÝÁ
'condition - å³ÛÙ³Ý ÁÝëï áñÇ å»ïù ¿ ÷Ýïñ»É ³ñÅ»ùÁ
Function Get_ColumnValueSQL(SearchTableName, ColumnName, condition)
		Dim dbCon, dbCmd, dbRecSet
		Set dbCon = ADO.CreateConnection
		dbCon.ConnectionString = cConnectionString
		dbCon.Open
		Set dbCmd = ADO.CreateCommand
		dbCmd.ActiveConnection = dbCon
		dbCmd.CommandType = adCmdText
		dbCmd.CommandText = "Select " & ColumnName & " from " & SearchTableName & " where " & condition
		Set dbRecSet = dbCmd.Execute
		BuiltIn.Delay(1000)    
		If dbRecSet.Fields(0).Value Then
				Get_ColumnValueSQL = dbRecSet.Fields(0).Value
		Else
				Log.Error SearchTableName & " Value Not Found!!!" & dbCmd.CommandText, "", pmNormal, ErrorColor
		End If   
		dbRecSet.Close
		dbCon.Close 
End Function

'''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''Get_SQL_ColumnValue'''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''
'Ֆունկցիան վերադարձնում է փնտրվող սյան ցանկացած արժեք, բացի դատարկից կամ null-ից 
'Ֆունկցիան աշխատում է նաև սթրինգային տվյալների դեպքում
'SearchTableName - ²ÕÛáõë³ÏÇ ³ÝáõÝÁ, áñï»Õ å»ïù ¿ ÷Ýïñ»É
'ColumnName - öÝïñíáÕ ëÛ³Ý ³ÝáõÝÁ
'condition - å³ÛÙ³Ý ÁÝëï áñÇ å»ïù ¿ ÷Ýïñ»É ³ñÅ»ùÁ
Function Get_SQL_ColumnValue(SearchTableName, ColumnName, condition)
		Dim dbCon, dbCmd, dbRecSet
		Set dbCon = ADO.CreateConnection
		dbCon.ConnectionString = cConnectionString
		dbCon.Open
		Set dbCmd = ADO.CreateCommand
		dbCmd.ActiveConnection = dbCon
		dbCmd.CommandType = adCmdText
		dbCmd.CommandText = "Select " & ColumnName & " from " & SearchTableName & " where " & condition
		Set dbRecSet = dbCmd.Execute
		BuiltIn.Delay(1000)    
		If dbRecSet.Fields(0).Value <> "" or dbRecSet.Fields(0).Value <> null Then
				Get_SQL_ColumnValue = dbRecSet.Fields(0).Value
		Else
				Log.Error SearchTableName & " Value Not Found!!!" & dbCmd.CommandText, "", pmNormal, ErrorColor
		End If   
		dbRecSet.Close
		dbCon.Close 
End Function

Class dbo_LEASES 
		public fISN
		public fAGRKIND
		public fCODE
		public fPPRCODE
		public fCLICODE
		public fCUR
		public fSUMMA
		public fPCMARKET
		public fVATMETH
		public fDATEGIVE
		public fDATEAGR
		public fDATECLOSE
		public fSTATE
		public fNOTE
		public fNOTE2
		public fNOTE3
		public fACSBRANCH
		public fACSDEPART
		public fACSTYPE
		public fLCNAME
		private sub Class_Initialize()
				fISN = ""
				fAGRKIND = ""
				fCODE = ""
				fPPRCODE = ""
				fCLICODE = ""
				fCUR = ""
				fSUMMA = ""
				fPCMARKET = ""
				fVATMETH = ""
				fDATEGIVE = ""
				fDATEAGR = ""
				fDATECLOSE = ""
				fSTATE = ""
				fNOTE = ""
				fNOTE2 = ""
				fNOTE3 = ""
				fACSBRANCH = ""
				fACSDEPART = ""
				fACSTYPE = ""
				fLCNAME = ""
		end sub
End Class

Function New_dbo_LEASES()
		Set New_dbo_LEASES = new dbo_LEASES
End	Function

Function Check_dbo_LEASES(LEASES, expectedRowCount)
		Dim dbCon, dbCmd, dbRecSet
		Set dbCon = ADO.CreateConnection
		dbCon.ConnectionString = cConnectionString
		dbCon.Open
		Set dbCmd = ADO.CreateCommand
		dbCmd.ActiveConnection = dbCon
		dbCmd.CommandType = adCmdText
		dbCmd.CommandText = "Select COUNT(*) from LEASES WHERE fISN = ? and fAGRKIND = ? and fCODE = ? and fPPRCODE = ? "&_
												          "and fCLICODE = ? and fCUR = ? and fSUMMA = ? and fPCMARKET = ? and fVATMETH = ? " &_
												          "and fDATEGIVE = ? and fDATEAGR = ? and fSTATE = ? and fNOTE = ? and fNOTE2 = ? and fNOTE3 = ? " &_
												          "and fACSBRANCH = ? and fACSDEPART = ? and fACSTYPE = ? and fLCNAME = ? "
		if not IsNull(LEASES.fDATECLOSE) Then
				dbCmd.CommandText = dbCmd.CommandText & " and fDATECLOSE = ?"
		else
				dbCmd.CommandText = dbCmd.CommandText & " and fDATECLOSE is Null"
		end if																	   
		dbCmd.Parameters.Append dbCmd.CreateParameter("fISN", DB.adInteger, DB.adParamInput, , LEASES.fISN)                          
		dbCmd.Parameters.Append dbCmd.CreateParameter("fAGRKIND", DB.adChar, DB.adParamInput, 2, LEASES.fAGRKIND)
		dbCmd.Parameters.Append dbCmd.CreateParameter("fCODE", DB.adVarWChar, DB.adParamInput, 20, LEASES.fCODE)
		dbCmd.Parameters.Append dbCmd.CreateParameter("fPPRCODE", DB.adVarWChar, DB.adParamInput, 20, LEASES.fPPRCODE)
		dbCmd.Parameters.Append dbCmd.CreateParameter("fCLICODE", DB.adChar, DB.adParamInput, 8, LEASES.fCLICODE)
		dbCmd.Parameters.Append dbCmd.CreateParameter("fCUR", DB.adChar, DB.adParamInput, 3, LEASES.fCUR)
		dbCmd.Parameters.Append dbCmd.CreateParameter("fSUMMA", DB.adCurrency, DB.adParamInput, , aqConvert.StrToCurrency(LEASES.fSUMMA))
		dbCmd.Parameters.Append dbCmd.CreateParameter("fPCMARKET", DB.adDecimal, DB.adParamInput, , LEASES.fPCMARKET)
		dbCmd.Parameters("fPCMARKET").Precision = 9
		dbCmd.Parameters("fPCMARKET").NumericScale = 4
		dbCmd.Parameters.Append dbCmd.CreateParameter("fVATMETH", DB.adChar, DB.adParamInput, 1, LEASES.fVATMETH)
		dbCmd.Parameters.Append dbCmd.CreateParameter("fDATEGIVE", DB.adDBDate, DB.adParamInput, , LEASES.fDATEGIVE)
		dbCmd.Parameters.Append dbCmd.CreateParameter("fDATEAGR", DB.adDBDate, DB.adParamInput, , LEASES.fDATEAGR)
		dbCmd.Parameters.Append dbCmd.CreateParameter("fSTATE", DB.adTinyInt, DB.adParamInput, , LEASES.fSTATE)
		dbCmd.Parameters.Append dbCmd.CreateParameter("fNOTE", DB.adChar, DB.adParamInput, 3, LEASES.fNOTE)
		dbCmd.Parameters.Append dbCmd.CreateParameter("fNOTE2", DB.adChar, DB.adParamInput, 3, LEASES.fNOTE2)  
		dbCmd.Parameters.Append dbCmd.CreateParameter("fNOTE3", DB.adChar, DB.adParamInput, 3, LEASES.fNOTE3)
		dbCmd.Parameters.Append dbCmd.CreateParameter("fDGACSBRANCH", DB.adChar, DB.adParamInput, 3, LEASES.fACSBRANCH)
		dbCmd.Parameters.Append dbCmd.CreateParameter("fDGACSDEPART", DB.adChar, DB.adParamInput, 3, LEASES.fACSDEPART)
		dbCmd.Parameters.Append dbCmd.CreateParameter("fDGACSTYPE", DB.adChar, DB.adParamInput, 4, LEASES.fACSTYPE) 
		dbCmd.Parameters.Append dbCmd.CreateParameter("fLCNAME", DB.adChar, DB.adParamInput, 32, LEASES.fLCNAME)                          
		if not IsNull(LEASES.fDATECLOSE) Then
				dbCmd.Parameters.Append dbCmd.CreateParameter("fDATECLOSE", DB.adDBDate, DB.adParamInput, , aqConvert.StrToInt(LEASES.fDATECLOSE))
		end if 
		Set dbRecSet = dbCmd.Execute
		BuiltIn.Delay(2000)
		If dbRecSet.Fields.Item(0).Value = expectedRowCount Then
				Log.Message "LEASES record is correct.", "", pmNormal , MessageColor
				Check_dbo_LEASES = true
		Else
				Log.Error "LEASES record is incorrect.", "", pmNormal, ErrorColor
				Log.Error "Incorrect Query = " & dbCmd.CommandText, "", pmNormal, ErrorColor
				Check_dbo_LEASES = false
		End If
		dbRecSet.Close
		dbCon.Close 
End	Function

'''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''[HI2]'''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''
Class DB_HI2

    Public fDATE
    Public fTYPE
    Public fOBJECT
    Public fGLACC
    Public fSUM
    Public fCUR
    Public fCURSUM
    Public fOP
    Public fBASE
    Public fDBCR
    Public fBASEBRANCH
    Public fBASEDEPART
    Private Sub Class_Initialize()  
        fDATE = ""
        fTYPE = ""
        fOBJECT = ""
        fGLACC = ""
        fSUM = ""
        fCUR = ""
        fCURSUM = ""
        fOP = ""
        fBASE = ""
        fDBCR = ""
        fBASEBRANCH = ""
        fBASEDEPART = ""
    End Sub
End Class

Function New_DB_HI2()
    Set New_DB_HI2 = NEW DB_HI2
End Function

'Ստուգում է HI2 աղյուսակում dbHI2-ի բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_HI2(dbHI2,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from HI2 WHERE fDATE = ? and fTYPE = ? and fOBJECT = ? and fGLACC = ? "&_
                            " and fSUM = ? and fCUR = ? and fCURSUM = ? and fOP = ? and fBASE = ? and fDBCR = ? and fBASEBRANCH = ? and fBASEDEPART = ?"
     
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDATE", DB.adDBDate, DB.adParamInput, ,dbHI2.fDATE)                          
    dbCmd.Parameters.Append dbCmd.CreateParameter("fTYPE", DB.adChar, DB.adParamInput, 2,dbHI2.fTYPE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fOBJECT", DB.adInteger, DB.adParamInput, , dbHI2.fOBJECT)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fGLACC", DB.adInteger, DB.adParamInput, , dbHI2.fGLACC)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSUM", DB.adCurrency, DB.adParamInput, , dbHI2.fSUM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCUR", DB.adChar, DB.adParamInput,3 , dbHI2.fCUR)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCURSUM", DB.adCurrency, DB.adParamInput, , dbHI2.fCURSUM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fOP", DB.adChar, DB.adParamInput, 3, dbHI2.fOP)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fBASE", DB.adInteger, DB.adParamInput, , dbHI2.fBASE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDBCR", DB.adChar, DB.adParamInput, 1, dbHI2.fDBCR)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDCBRANCH", DB.adChar, DB.adParamInput, 3, dbHI2.fBASEBRANCH)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDCDEPART", DB.adChar, DB.adParamInput, 3, dbHI2.fBASEDEPART)
                                    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(4000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "HI2 record is correct.",,,MessageColor
    Else
       Log.Error "HI2 record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub



'Ստուգում է HIREST2 աղյուսակում բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_HIREST2(fTYPE, fOBJECT ,fGLACC, fREM ,fCUR, fCURREM, ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from HIREST2 WHERE fTYPE = '" & fTYPE & "' and fOBJECT = '" & fOBJECT &"'"&_
                            " and fGLACC = '" & fGLACC & "' and fREM = '" & fREM & "' and fCUR = '" & fCUR & "' and fCURREM = '" & fCURREM &"'"
                                    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(4000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "HIREST2 record is correct.",,,MessageColor
    Else
       Log.Error "HIREST2 record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''[PAYMENTS]''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''
Class DB_PAYMENTS

    Public fISN
    Public fDOCTYPE
    Public fDATE
    Public fSTATE
    Public fDOCNUM
    Public fCLIENT
    Public fACCDB
    Public fPAYER
    Public fCUR
    Public fSUMMA
    Public fSUMMAAMD
    Public fSUMMAUSD
    Public fCOM
    Public fPASSPORT
    Public fCOUNTRY
    Public fACSBRANCH
    Public fACSDEPART
    Private Sub Class_Initialize()  
       fISN = ""
       fDOCTYPE = ""
       fDATE = ""
       fSTATE = ""
       fDOCNUM = ""
       fCLIENT = ""
       fACCDB = ""
       fPAYER = ""
       fCUR = ""
       fSUMMA = ""
       fSUMMAAMD = ""
       fSUMMAUSD = ""
       fCOM = ""
       fPASSPORT = ""
       fCOUNTRY = ""
       fACSBRANCH = ""
       fACSDEPART = ""
    End Sub
End Class

Function New_DB_PAYMENTS()
    Set New_DB_PAYMENTS = NEW DB_PAYMENTS
End Function

'Ստուգում է PAYMENTS աղյուսակում dbPAYMENTS-ի բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_PAYMENTS(dbPAYMENTS,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from PAYMENTS WHERE fISN = ? and fDOCTYPE = ? and fDATE = ? and fSTATE = ? "&_
                            "and fDOCNUM = ? and fCLIENT = ? and fACCDB = ? and fPAYER = ? and fCUR = ? and fSUMMA = ? and fSUMMAAMD = ? "&_
                            "and fSUMMAUSD = ? and fCOM = ? and fPASSPORT = ? and fCOUNTRY = ? and fACSBRANCH = ? and fACSDEPART = ? "                    
     
    dbCmd.Parameters.Append dbCmd.CreateParameter("fISN", DB.adInteger, DB.adParamInput, ,dbPAYMENTS.fISN)                          
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDOCTYPE", DB.adChar, DB.adParamInput, 8,dbPAYMENTS.fDOCTYPE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDATE", DB.adDBDate, DB.adParamInput, , dbPAYMENTS.fDATE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSTATE", DB.adUnsignedTinyInt, DB.adParamInput, , dbPAYMENTS.fSTATE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDOCNUM", DB.adChar, DB.adParamInput, 6, dbPAYMENTS.fDOCNUM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCLIENT", DB.adChar, DB.adParamInput, 8, dbPAYMENTS.fCLIENT)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACCDB", DB.adVarWChar, DB.adParamInput, 16, dbPAYMENTS.fACCDB)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fPAYER", DB.adVarWChar, DB.adParamInput, 140, dbPAYMENTS.fPAYER)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCUR", DB.adChar, DB.adParamInput, 3, dbPAYMENTS.fCUR)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSUMMA", DB.adCurrency, DB.adParamInput, ,dbPAYMENTS.fSUMMA)                          
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSUMMAAMD", DB.adCurrency, DB.adParamInput, ,dbPAYMENTS.fSUMMAAMD)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSUMMAUSD", DB.adCurrency, DB.adParamInput, , dbPAYMENTS.fSUMMAUSD)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCOM", DB.adVarWChar, DB.adParamInput,140 , dbPAYMENTS.fCOM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fPASSPORT", DB.adVarWChar, DB.adParamInput,32 , dbPAYMENTS.fPASSPORT)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCOUNTRY", DB.adChar, DB.adParamInput, 2, dbPAYMENTS.fCOUNTRY)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACSBRANCH", DB.adChar, DB.adParamInput, 3, dbPAYMENTS.fACSBRANCH)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACSDEPART", DB.adChar, DB.adParamInput, 3, dbPAYMENTS.fACSDEPART)
                                    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(4000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "PAYMENTS record is correct.",,,MessageColor
    Else
       Log.Error "PAYMENTS record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = Select COUNT(*) from PAYMENTS WHERE fISN = '"& dbPAYMENTS.fISN &"' and fDOCTYPE = '"&dbPAYMENTS.fDOCTYPE &_
       "' and fDATE = '"&dbPAYMENTS.fDATE &"' and fSTATE = '"&dbPAYMENTS.fSTATE &"' and fDOCNUM = '"&dbPAYMENTS.fDOCNUM &"' and fCLIENT = '"&dbPAYMENTS.fCLIENT &_
       "' and fACCDB = '"&dbPAYMENTS.fACCDB &"' and fPAYER = '"&dbPAYMENTS.fPAYER &"' and fCUR = '"&dbPAYMENTS.fCUR &"' and fSUMMA = '"&dbPAYMENTS.fSUMMA &_
       "' and fSUMMAAMD = '"&dbPAYMENTS.fSUMMAAMD &"' and fCOM = '"&dbPAYMENTS.fCOM &"' and fPASSPORT = '"&dbPAYMENTS.fPASSPORT &"' and fCOUNTRY = '"&dbPAYMENTS.fCOUNTRY &_
       "' and fACSBRANCH = '"&dbPAYMENTS.fACSBRANCH &"' and fACSDEPART = '"&dbPAYMENTS.fACSDEPART &"'",,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''[FOLDERS]'''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''
Class dbo_PERIODIC_COMMUNAL
		Public fISN
		Public fROWID
		Public fSYS
		Public fLOCATION
		Public fCODE
		Public fABONENT
		Public fADDRESS
		Public fMIN
		Public fMAX
		Public fPAID
		Private Sub Class_Initialize()  
				fISN = ""
				fROWID = ""
				fSYS = ""
				fLOCATION = ""
				fCODE = ""
				fABONENT = ""
				fADDRESS = ""
				fMIN = ""
				fMAX = ""
				fPAID = ""
		End Sub
End Class

Function New_dbo_PERIODIC_COMMUNAL()
    Set New_dbo_PERIODIC_COMMUNAL = NEW dbo_PERIODIC_COMMUNAL
End Function

'Ստուգում է PERIODIC_COMMUNAL աղյուսակում dbPERCOMMUNAL-ի բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_PERIODIC_COMMUNAL(dbo_PERCOMMUNAL, ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from PERIODIC_COMMUNAL WHERE fISN = ? and fROWID = ? and fSYS = ? and fLOCATION = ? "&_
                            " and fCODE = ? and fABONENT = ? and fADDRESS = ? and fMIN = ? and fMAX = ? and fPAID = ?"
     
    dbCmd.Parameters.Append dbCmd.CreateParameter("fISN", DB.adInteger, DB.adParamInput, , dbo_PERCOMMUNAL.fISN)
				dbCmd.Parameters.Append dbCmd.CreateParameter("fROWID", DB.adInteger, DB.adParamInput, , dbo_PERCOMMUNAL.fROWID)                          
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSYS", DB.adChar, DB.adParamInput, 4, dbo_PERCOMMUNAL.fSYS)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fLOCATION", DB.adChar, DB.adParamInput, 3, dbo_PERCOMMUNAL.fLOCATION)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCODE", DB.adVarWChar, DB.adParamInput, 21, dbo_PERCOMMUNAL.fCODE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fABONENT", DB.adVarWChar, DB.adParamInput, 100, dbo_PERCOMMUNAL.fABONENT)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fADDRESS", DB.adVarWChar, DB.adParamInput, 70, dbo_PERCOMMUNAL.fADDRESS)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fMIN", DB.adCurrency, DB.adParamInput, , dbo_PERCOMMUNAL.fMIN)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fMAX", DB.adCurrency, DB.adParamInput, , dbo_PERCOMMUNAL.fMAX)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fPAID", DB.adCurrency, DB.adParamInput, , dbo_PERCOMMUNAL.fPAID)
                                    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "PERIODIC_COMMUNAL record is correct.", "", pmNormal, MessageColor
    Else 
       Log.Error "PERIODIC_COMMUNAL record is incorrect.", "", pmNormal, ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText, "", pmNormal, ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''[SW_MESSAGES]''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''
Class SW_MESSAGES

    Public fISN
    Public fUNIQUEID
    Public fIODATE
    Public fDATE 
    Public fMT
    Public fCATEGORY 
    Public fDOCNUM
    Public fSR
    Public fSRBANK
    Public fSYS
    Public fSTATE
    Public fUSER
    Public fACCDB
    Public fACCCR 
    Public fAMOUNT
    Public fCURR
    Public fPAYER
    Public fRECEIVER
    Public fAIM
    Public fBRANCH
    Public fDEPART
    Private Sub Class_Initialize()  
       fISN = ""
       fUNIQUEID = ""
       fIODATE = ""
       fDATE = ""
       fMT = ""
       fCATEGORY = ""
       fDOCNUM = ""
       fSR = ""
       fSRBANK = ""
       fSYS = ""
       fSTATE = ""
       fUSER = ""
       fACCDB = ""
       fACCCR = ""
       fAMOUNT = ""
       fCURR = ""
       fPAYER = ""
       fRECEIVER = ""
       fAIM = ""
       fBRANCH = Null
       fDEPART = Null
    End Sub
End Class

Function New_SW_MESSAGES()
    Set New_SW_MESSAGES = NEW SW_MESSAGES
End Function

'Ստուգում է SW_MESSAGES աղյուսակում dbSW_MESSAGES-ի բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_SW_MESSAGES(db_SW_MESSAGES,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from SW_MESSAGES WHERE fISN = ? and fUNIQUEID = ? and CAST(fDATE as DATE) = ? and fMT = ? "&_
                            "and fCATEGORY = ? and fDOCNUM = ? and fSR = ? and fSRBANK = ? and fSYS = ? and fSTATE = ? and fUSER = ? "&_
                            "and fACCDB = ? and fACCCR = ? and fAMOUNT = ? and fCUR = ? and fPAYER = ? "&_     
                            "and fRECEIVER = ? and fAIM = ?"             
    If Not IsNull(db_SW_MESSAGES.fBRANCH) Then
         dbCmd.CommandText = dbCmd.CommandText & " and fBRANCH = ?"
    Else
       dbCmd.CommandText = dbCmd.CommandText & " and fBRANCH is Null"
    End If
    If Not IsNull(db_SW_MESSAGES.fDEPART) Then
        dbCmd.CommandText = dbCmd.CommandText & " and fDEPART = ?"
    Else
        dbCmd.CommandText = dbCmd.CommandText & " and fDEPART is Null"
    End If		 
    dbCmd.Parameters.Append dbCmd.CreateParameter("fISN", DB.adInteger, DB.adParamInput, , db_SW_MESSAGES.fISN)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fUNIQUEID", DB.adChar, DB.adParamInput,28,db_SW_MESSAGES.fUNIQUEID)                          
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDATE", DB.adVarWChar, DB.adParamInput,12 , db_SW_MESSAGES.fDATE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fMT", DB.adChar, DB.adParamInput, 3, db_SW_MESSAGES.fMT)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCATEGORY", DB.adChar, DB.adParamInput, 1, db_SW_MESSAGES.fCATEGORY)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDOCNUM", DB.adChar, DB.adParamInput, 16, db_SW_MESSAGES.fDOCNUM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSR", DB.adChar, DB.adParamInput, 1, db_SW_MESSAGES.fSR)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSRBANK", DB.adChar, DB.adParamInput, 11, db_SW_MESSAGES.fSRBANK)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSYS", DB.adChar, DB.adParamInput, 1, db_SW_MESSAGES.fSYS) 
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSTATE", DB.adChar, DB.adParamInput, 2, db_SW_MESSAGES.fSTATE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fUSER", DB.adVarWChar, DB.adParamInput, 2, db_SW_MESSAGES.fUSER)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACCDB", DB.adChar, DB.adParamInput, 34, db_SW_MESSAGES.fACCDB)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACCCR", DB.adChar, DB.adParamInput, 34, db_SW_MESSAGES.fACCCR)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fAMOUNT", DB.adChar, DB.adParamInput, 8, db_SW_MESSAGES.fAMOUNT)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCURR", DB.adChar, DB.adParamInput, 3, db_SW_MESSAGES.fCURR)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fPAYER", DB.adChar, DB.adParamInput, 32,db_SW_MESSAGES.fPAYER)                          
    dbCmd.Parameters.Append dbCmd.CreateParameter("fRECEIVER", DB.adChar, DB.adParamInput, 32,db_SW_MESSAGES.fRECEIVER)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fAIM", DB.adChar, DB.adParamInput, 32, db_SW_MESSAGES.fAIM)
    If not IsNull(db_SW_MESSAGES.fBRANCH) Then
        dbCmd.Parameters.Append dbCmd.CreateParameter("fBRANCH", DB.adChar, DB.adParamInput, 3, db_SW_MESSAGES.fBRANCH)
	End If 
    If not IsNull(db_SW_MESSAGES.fDEPART) Then
        dbCmd.Parameters.Append dbCmd.CreateParameter("fDEPART", DB.adChar, DB.adParamInput, 3, db_SW_MESSAGES.fDEPART)
	End If                                 
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(4000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "SW_MESSAGES record is correct.",,,MessageColor
    Else
       Log.Error "SW_MESSAGES record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = Select COUNT(*) from SW_MESSAGES WHERE fISN = '"&db_SW_MESSAGES.fISN&"' and fUNIQUEID = '"&db_SW_MESSAGES.fUNIQUEID&_
       "' and CAST(fDATE as DATE) = '"&db_SW_MESSAGES.fDATE&"' and fMT = '"&db_SW_MESSAGES.fMT&"' and fCATEGORY = '"&db_SW_MESSAGES.fCATEGORY&"' and fDOCNUM = '"&db_SW_MESSAGES.fDOCNUM&_
       "' and fSR = '"&db_SW_MESSAGES.fSR&"' and fSRBANK = '"&db_SW_MESSAGES.fSRBANK&_
       "' and fSYS = '"&db_SW_MESSAGES.fSYS&"' and fSTATE = '"&db_SW_MESSAGES.fSTATE&"' and fUSER = '"&db_SW_MESSAGES.fUSER&_
       "' and fACCDB = '"&db_SW_MESSAGES.fACCDB&"' and fACCCR = '"&db_SW_MESSAGES.fACCCR&"' and fAMOUNT = '"&db_SW_MESSAGES.fAMOUNT&_
       "' and fCUR = '"&db_SW_MESSAGES.fCURR&"' and fPAYER = '"&db_SW_MESSAGES.fPAYER&"' and fRECEIVER = '"&db_SW_MESSAGES.fRECEIVER&"' and fAIM = '"&db_SW_MESSAGES.fAIM&_
       "' and fBRANCH = '"&db_SW_MESSAGES.fBRANCH&"' and fDEPART = '"&db_SW_MESSAGES.fDEPART&"'",,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'Ստուգում է DOCSATTACH աղյուսակում fISN, fTYPE, fFILE և fCOMMENT սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_DOCSATTACH(fIsn, fFile, fType, fComment, ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from DOCSATTACH WHERE fISN = '" & fIsn & "' and fFILE = '" & fFile & "' and fTYPE = '" & fType _
                            & "' and fCOMMENT = '" & fComment & "'"
                                    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "DOCSATTACH record is correct.",,,MessageColor
    Else
       Log.Error "DOCSATTACH record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''[CUREXCHANGES]''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''
Class DB_CUREXCHANGES
    Public fISN
    Public fDOCTYPE
    Public fCOMPLETED
    Public fEXPORTED
    Public fDATE
    Public fSTATE
    Public fDOCNUM
    Public fCLIENT
    Public fNAME
    Public fACCDB
    Public fCURDB
    Public fSUMDB
    Public fACCCR
    Public fCURCR
    Public fSUMCR
    Public fCOM
    Public fPASSPORT
    Public fKASCODE
    Public fCURCOMIS
    Public fSUMCOMIS
    Public fSUMCOMISAMD
    Public fACSBRANCH
    Public fACSDEPART
    Private Sub Class_Initialize()  
        fISN = ""
        fDOCTYPE = ""
        fCOMPLETED = ""
        fEXPORTED = ""
        fDATE = ""
        fSTATE = ""
        fDOCNUM = ""
        fCLIENT = ""
        fNAME = ""
        fACCDB = ""
        fCURDB = ""
        fSUMDB = ""
        fACCCR = ""
        fCURCR = ""
        fSUMCR = ""
        fCOM = ""
        fPASSPORT = ""
        fKASCODE = ""
        fCURCOMIS = ""
        fSUMCOMIS = ""
        fSUMCOMISAMD = ""
        fACSBRANCH = ""
        fACSDEPART = ""
    End Sub
End Class

Function New_DB_CUREXCHANGES()
    Set New_DB_CUREXCHANGES = NEW DB_CUREXCHANGES
End Function

'Ստուգում է CUREXCHANGES աղյուսակում dbCUREXCHANGES-ի բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_CUREXCHANGES(dbCUREXCHANGES,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from CUREXCHANGES WHERE fISN = ? and fDOCTYPE = ? and fCOMPLETED = ? and fEXPORTED = ? "&_
                            " and fDATE = ? and fSTATE = ? and fDOCNUM = ? and fCLIENT = ? and fNAME = ? and fACCDB = ? "&_
                            " and fCURDB = ? and fSUMDB = ? and fACCCR = ? and fCURCR = ? and fSUMCR = ? and fCOM = ? "&_
                            " and fPASSPORT = ? and fKASCODE = ? and fCURCOMIS = ? and fSUMCOMIS = ? and fSUMCOMISAMD = ? "&_
                            " and fACSBRANCH = ? and fACSDEPART = ? "
        
    dbCmd.Parameters.Append dbCmd.CreateParameter("fISN", DB.adInteger, DB.adParamInput, , dbCUREXCHANGES.fISN)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDOCTYPE", DB.adChar, DB.adParamInput, 8, dbCUREXCHANGES.fDOCTYPE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCOMPLETED", DB.adChar, DB.adParamInput, 1, dbCUREXCHANGES.fCOMPLETED)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fEXPORTED", DB.adChar, DB.adParamInput, 1, dbCUREXCHANGES.fEXPORTED)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDATE", DB.adVarWChar, DB.adParamInput, 12, dbCUREXCHANGES.fDATE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSTATE", DB.adChar, DB.adParamInput, 3, dbCUREXCHANGES.fSTATE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDOCNUM", DB.adChar, DB.adParamInput, 6, dbCUREXCHANGES.fDOCNUM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCLIENT", DB.adChar, DB.adParamInput, 8, dbCUREXCHANGES.fCLIENT)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fNAME", DB.adChar, DB.adParamInput, 70, dbCUREXCHANGES.fNAME)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACCDB", DB.adVarWChar, DB.adParamInput, 16, dbCUREXCHANGES.fACCDB)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCURDB", DB.adChar, DB.adParamInput, 3, dbCUREXCHANGES.fCURDB)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSUMDB", DB.adCurrency, DB.adParamInput, , dbCUREXCHANGES.fSUMDB)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACCCR", DB.adVarWChar, DB.adParamInput, 16, dbCUREXCHANGES.fACCCR)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCURCR", DB.adChar, DB.adParamInput, 3, dbCUREXCHANGES.fCURCR)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSUMCR", DB.adCurrency, DB.adParamInput, , dbCUREXCHANGES.fSUMCR)                         
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCOM", DB.adVarWChar, DB.adParamInput, 140, dbCUREXCHANGES.fCOM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fPASSPORT", DB.adVarWChar, DB.adParamInput, 32, dbCUREXCHANGES.fPASSPORT)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fKASCODE", DB.adChar, DB.adParamInput, 3, dbCUREXCHANGES.fKASCODE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCURCOMIS", DB.adChar, DB.adParamInput, 3, dbCUREXCHANGES.fCURCOMIS)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSUMCOMIS", DB.adCurrency, DB.adParamInput, , dbCUREXCHANGES.fSUMCOMIS)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSUMCOMISAMD", DB.adCurrency, DB.adParamInput, , dbCUREXCHANGES.fSUMCOMISAMD)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACSBRANCH", DB.adChar, DB.adParamInput, 3, dbCUREXCHANGES.fACSBRANCH)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACSDEPART", DB.adChar, DB.adParamInput, 3, dbCUREXCHANGES.fACSDEPART)
                                    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "CUREXCHANGES record is correct.",,,MessageColor
    Else
       Log.Error "CUREXCHANGES record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = Select COUNT(*) from CUREXCHANGES WHERE fISN = '"& dbCUREXCHANGES.fISN &"' and fDOCTYPE = '"&dbCUREXCHANGES.fDOCTYPE &_
       "' and fCOMPLETED = '"&dbCUREXCHANGES.fCOMPLETED &"' and fEXPORTED = '"&dbCUREXCHANGES.fEXPORTED &"' and fDATE = '"&dbCUREXCHANGES.fDATE &_
       "' and fSTATE = '"&dbCUREXCHANGES.fSTATE &"' and fDOCNUM = '"&dbCUREXCHANGES.fDOCNUM &"' and fCLIENT = '"&dbCUREXCHANGES.fCLIENT &_
       "' and fNAME = '"&dbCUREXCHANGES.fNAME &"' and fACCDB = '"&dbCUREXCHANGES.fACCDB &"' and fCURDB = '"&dbCUREXCHANGES.fCURDB &_
       "' and fSUMDB = '"&dbCUREXCHANGES.fSUMDB &"' and fACCCR = '"&dbCUREXCHANGES.fACCCR &"' and fCURCR = '"&dbCUREXCHANGES.fCURCR &_
       "' and fSUMCR = '"&dbCUREXCHANGES.fSUMCR &"' and fCOM = '"&dbCUREXCHANGES.fCOM &"' and fPASSPORT = '"&dbCUREXCHANGES.fPASSPORT &_
       "' and fKASCODE = '"&dbCUREXCHANGES.fKASCODE &"' and fCURCOMIS = '"&dbCUREXCHANGES.fCURCOMIS &"' and fSUMCOMIS = '"&dbCUREXCHANGES.fSUMCOMIS &_
       "' and fSUMCOMISAMD = '"&dbCUREXCHANGES.fSUMCOMISAMD &"' and fACSBRANCH = '"&dbCUREXCHANGES.fACSBRANCH &"' and fACSDEPART = '"&dbCUREXCHANGES.fACSDEPART &"'",,,ErrorColor
    
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub


Class DB_ACCOUNTS

    Public fISN
    Public fCODE
    Public fCAPTION
    Public fECAPTION
    Public fCUR
    Public fDC
    Public fBALACC
    Public fACCTYPE
    Public fDATEOPEN
    Public fDATECLOSE
    Public fLLIMIT
    Public fULIMIT
    Public fACCBRANCH
    Public fACCDEPART
    Public fACCACSTYPE
    Private Sub Class_Initialize()  
            fISN = ""
            fCODE = ""
            fCAPTION = ""
            fECAPTION = ""
            fCUR = ""
            fDC = ""
            fBALACC = ""
            fACCTYPE = ""
            fDATEOPEN = ""
            fDATECLOSE = Null
            fLLIMIT = ""
            fULIMIT = ""
            fACCBRANCH = ""
            fACCDEPART = ""
            fACCACSTYPE = ""
    End Sub
End Class

Function New_DB_ACCOUNTS()
    Set New_DB_ACCOUNTS = NEW DB_ACCOUNTS
End Function


'Ստուգում է ACCOUNTS աղյուսակում DB_ACCOUNTS-ի բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub Check_DB_ACCOUNTS(db_DB_ACCOUNTS,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from ACCOUNTS WHERE fISN = ? and fCODE = ? and fCAPTION = ? and fECAPTION = ? "&_
                            " and fCUR = ? and fDC = ? and fBALACC Like ? and fACCTYPE = ? and fDATEOPEN = ? and fLLIMIT = ?"&_
                            " and fULIMIT Like ? and fACCBRANCH = ? and fACCDEPART = ? and fACCACSTYPE = ?"
     
    If Not IsNull(db_DB_ACCOUNTS.fDATECLOSE) Then
         dbCmd.CommandText = dbCmd.CommandText & " and fDATECLOSE = ?"
    Else
       dbCmd.CommandText = dbCmd.CommandText & " and fDATECLOSE is Null"
    End If					
    dbCmd.Parameters.Append dbCmd.CreateParameter("fISN", DB.adInteger, DB.adParamInput, , db_DB_ACCOUNTS.fISN) 
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCODE", DB.adVarWChar, DB.adParamInput, 11,db_DB_ACCOUNTS.fCODE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCAPTION", DB.adVarWChar, DB.adParamInput, 50, db_DB_ACCOUNTS.fCAPTION)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fECAPTION", DB.adVarWChar, DB.adParamInput,50 , db_DB_ACCOUNTS.fECAPTION)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCUR", DB.adChar, DB.adParamInput, 3, db_DB_ACCOUNTS.fCUR)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDC", DB.adChar, DB.adParamInput, 1, db_DB_ACCOUNTS.fDC)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fBALACC", DB.adChar, DB.adParamInput, 8, db_DB_ACCOUNTS.fBALACC)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACCTYPE", DB.adChar, DB.adParamInput, 2, db_DB_ACCOUNTS.fACCTYPE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDATEOPEN", DB.adDBDate, DB.adParamInput, , db_DB_ACCOUNTS.fDATEOPEN)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fLLIMIT", DB.adCurrency, DB.adParamInput, , db_DB_ACCOUNTS.fLLIMIT) 
    dbCmd.Parameters.Append dbCmd.CreateParameter("fULIMIT", DB.adCurrency, DB.adParamInput, , db_DB_ACCOUNTS.fULIMIT)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACCBRANCH", DB.adChar, DB.adParamInput, 3, db_DB_ACCOUNTS.fACCBRANCH) 
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACCDEPART", DB.adChar, DB.adParamInput, 3, db_DB_ACCOUNTS.fACCDEPART)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACCACSTYPE", DB.adChar, DB.adParamInput, 4, db_DB_ACCOUNTS.fACCACSTYPE)   
    If not IsNull(db_DB_ACCOUNTS.fDATECLOSE) Then
				   dbCmd.Parameters.Append dbCmd.CreateParameter("fDATECLOSE", DB.adDBDate, DB.adParamInput, , aqConvert.StrToInt(db_DB_ACCOUNTS.fDATECLOSE))
		  End If 
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "ACCOUNTS record is correct.",,,MessageColor
    Else
       Log.Error "ACCOUNTS record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = Select COUNT(*) from ACCOUNTS WHERE fISN = '"& db_DB_ACCOUNTS.fISN &"' and fCODE = '"&db_DB_ACCOUNTS.fCODE &_
       "' and fCAPTION = '"&db_DB_ACCOUNTS.fCAPTION &"' and fECAPTION = '"&db_DB_ACCOUNTS.fECAPTION &"' and fCUR = '"&db_DB_ACCOUNTS.fCUR &"' and fDC = '"&db_DB_ACCOUNTS.fDC &_
       "' and fBALACC = '"&db_DB_ACCOUNTS.fBALACC &"' and fACCTYPE = '"&db_DB_ACCOUNTS.fACCTYPE & "' and fDATEOPEN = '"&db_DB_ACCOUNTS.fDATEOPEN &_
       "' and fDATECLOSE = '"&db_DB_ACCOUNTS.fDATECLOSE &"' and fLLIMIT = '"&db_DB_ACCOUNTS.fLLIMIT &"' and fULIMIT = '"&db_DB_ACCOUNTS.fULIMIT &_
       "' and fACCBRANCH = '"&db_DB_ACCOUNTS.fACCBRANCH &"' and fACCDEPART = '"&db_DB_ACCOUNTS.fACCDEPART &"' and fACCACSTYPE = '"&db_DB_ACCOUNTS.fACCACSTYPE &"'",,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub


'''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''[HI]''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''
Class DB_HI

    Public fBASE
    Public fDATE    
    Public fTYPE
    Public fSUM
    Public fCUR
    Public fCURSUM
    Public fOP
    Public fDBCR
    Public fADB
    Public fACR
    Public fSPEC
    Public fBASEBRANCH
    Public fBASEDEPART
    Private Sub Class_Initialize()  
            fBASE = ""
            fDATE = ""
            fTYPE = ""
            fSUM = ""
            fCUR = ""
            fCURSUM = ""
            fOP = ""
            fDBCR = ""
            fADB = ""
            fACR = ""
            fSPEC = ""
            fBASEBRANCH = ""
            fBASEDEPART = ""
    End Sub
End Class

Function New_DB_HI()
    Set New_DB_HI = NEW DB_HI
End Function


'Ստուգում է HI աղյուսակում HI-ի բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub Check_DB_HI(db_DB_HI,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet  
    
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from HI WHERE fBASE = ? and fDATE = ? and fTYPE = ? and fSUM = ? and fCUR = ? "&_
                            " and fCURSUM = ? and fOP = ? and fDBCR = ? and fADB = ? and fACR = ? and fSPEC LIKE ? and fBASEBRANCH = ? and fBASEDEPART = ?"
     
    dbCmd.Parameters.Append dbCmd.CreateParameter("fBASE", DB.adInteger, DB.adParamInput, , db_DB_HI.fBASE) 
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDATE", DB.adDBDate, DB.adParamInput, , db_DB_HI.fDATE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fTYPE", DB.adChar, DB.adParamInput, 2,db_DB_HI.fTYPE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSUM", DB.adCurrency, DB.adParamInput, , db_DB_HI.fSUM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCUR", DB.adChar, DB.adParamInput, 3 , db_DB_HI.fCUR)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fCURSUM", DB.adCurrency, DB.adParamInput, , db_DB_HI.fCURSUM)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fOP", DB.adChar, DB.adParamInput, 3, db_DB_HI.fOP)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDBCR", DB.adChar, DB.adParamInput, 1, db_DB_HI.fDBCR)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fADB", DB.adInteger, DB.adParamInput, , db_DB_HI.fADB) 
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACR", DB.adInteger, DB.adParamInput, , db_DB_HI.fACR) 
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSPEC", DB.adVarWChar, DB.adParamInput, 500, db_DB_HI.fSPEC)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fBASEBRANCH", DB.adChar, DB.adParamInput, 3, db_DB_HI.fBASEBRANCH)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fBASEDEPART", DB.adChar, DB.adParamInput, 3, db_DB_HI.fBASEDEPART) 
     
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(5000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "HI record is correct.",,,MessageColor
    Else
       Log.Error "HI record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = Select COUNT(*) from HI WHERE fBASE = '"& db_DB_HI.fBASE & "' and fDATE = '"&db_DB_HI.fDATE &"' and fTYPE = '"&db_DB_HI.fTYPE &_
       "' and fSUM = '"&db_DB_HI.fSUM &"' and fCUR = '"&db_DB_HI.fCUR &"' and fCURSUM = '"&db_DB_HI.fCURSUM &"' and fOP = '"&db_DB_HI.fOP &_
       "' and fDBCR = '"&db_DB_HI.fDBCR &"' and fADB = '"&db_DB_HI.fADB &"' and fACR = '"&db_DB_HI.fACR &"' and fSPEC LIKE '"&db_DB_HI.fSPEC &_
       "' and fBASEBRANCH = '"&db_DB_HI.fBASEBRANCH &"' and fBASEDEPART = '"&db_DB_HI.fBASEDEPART  &"'",,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub

'testArea միջավայրում query SQL հարցում կատարող ֆունկցիա
Sub Execute_SQL_Query(testArea, query)
    Dim fConnectionString
    Call GetConfigInformation(testArea, serverName, databaseName)
    fConnectionString = "Provider=SQLOLEDB.1;Password=sasa111;Persist Security Info=True;User ID=sa;Initial Catalog="& databaseName &";Data Source=" & serverName
    
    Set aCon = ADO.CreateConnection
    aCon.ConnectionString = fConnectionString
    ' Opens the connection
    aCon.Open
    ' Creates a command and specifies its parameters
    Set aCmd = ADO.CreateCommand
    aCmd.ActiveConnection = aCon ' Connection
    aCmd.CommandType = adCmdText ' Command type
    aCmd.CommandText = query
    
    aCmd.Execute
    aCon.Close   
    
End Sub

'Ստուգում է POLICIES աղյուսակում բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
'''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''--- [POLICIES] ---'''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''
Class DB_POLICIES

    Public fIPISN
    Public fIPCODE
    Public fSURETY
    Public fINSCOMP
    Public fDATEBEGIN
    Public fDATEEND
    Public fDATECLOSE
    Public fIPTYPE
    Public fIPSTATE
    Public fNOTE
    Public fNOTE2
    Public fNOTE3
    Public fACSBRANCH
    Public fACSDEPART
    Public fACSTYPE
    
    Private Sub Class_Initialize()  
       fIPISN = ""
       fIPCODE = ""
       fSURETY = ""
       fINSCOMP = ""
       fDATEBEGIN = ""
       fDATEEND = ""
       fDATECLOSE = ""
       fIPTYPE = ""
       fIPSTATE = ""
       fNOTE = ""
       fNOTE2 = ""
       fNOTE3 = ""
       fACSBRANCH = ""
       fACSDEPART = ""
       fACSTYPE = ""
    End Sub
End Class

Function New_DB_POLICIES()
    Set New_DB_POLICIES = NEW DB_POLICIES
End Function

'Ստուգում է POLICIES աղյուսակում dbPOLICIES-ի բոլոր սյուներով 
'գտնված տողերի քանակը համապատասխանում է արդյոք ExpectedRowCount-ին
Sub CheckDB_POLICIES(dbPOLICIES,ExpectedRowCount)
    
    Dim dbCon,dbCmd,dbRecSet
    Set dbCon = ADO.CreateConnection
        dbCon.ConnectionString = cConnectionString
        dbCon.Open
    Set dbCmd = ADO.CreateCommand
        dbCmd.ActiveConnection = dbCon
        dbCmd.CommandType = adCmdText
        dbCmd.CommandText = "Select COUNT(*) from POLICIES WHERE fIPISN = ? and fIPCODE = ? and fSURETY = ? and fINSCOMP = ? "&_
                            " and fDATEBEGIN = ? and fDATEEND = ? and fIPTYPE = ? and fIPSTATE = ? and fNOTE = ?"&_
                            " and fNOTE2 = ? and fNOTE3 = ? and fACSBRANCH = ? and fACSDEPART = ? and fACSTYPE = ?"
                
    If not IsNull(dbPOLICIES.fDATECLOSE) Then
        dbCmd.CommandText = dbCmd.CommandText & " and fDATECLOSE = ?"
    Else
        dbCmd.CommandText = dbCmd.CommandText & " and fDATECLOSE Is Null"
    End If
    
    dbCmd.Parameters.Append dbCmd.CreateParameter("fIPISN", DB.adInteger, DB.adParamInput, ,dbPOLICIES.fIPISN)                          
    dbCmd.Parameters.Append dbCmd.CreateParameter("fIPCODE", DB.adVarWChar, DB.adParamInput, 20,dbPOLICIES.fIPCODE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fSURETY", DB.adChar, DB.adParamInput, 8, dbPOLICIES.fSURETY)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fINSCOMP", DB.adChar, DB.adParamInput, 8, dbPOLICIES.fINSCOMP)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDATEBEGIN", DB.adDBTimeStamp, DB.adParamInput, , dbPOLICIES.fDATEBEGIN)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fDATEEND", DB.adDBTimeStamp, DB.adParamInput, , dbPOLICIES.fDATEEND)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fIPTYPE", DB.adChar, DB.adParamInput, 1, dbPOLICIES.fIPTYPE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fIPSTATE", DB.adTinyInt, DB.adParamInput, , dbPOLICIES.fIPSTATE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fNOTE", DB.adChar, DB.adParamInput, 3, dbPOLICIES.fNOTE)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fNOTE2", DB.adChar, DB.adParamInput, 3, dbPOLICIES.fNOTE2)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fNOTE3", DB.adChar, DB.adParamInput, 3, dbPOLICIES.fNOTE3)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACSBRANCH", DB.adChar, DB.adParamInput, 3, dbPOLICIES.fACSBRANCH)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACSDEPART", DB.adChar, DB.adParamInput, 3, dbPOLICIES.fACSDEPART)
    dbCmd.Parameters.Append dbCmd.CreateParameter("fACSTYPE", DB.adChar, DB.adParamInput, 4, dbPOLICIES.fACSTYPE)
    
    If not IsNull(dbPOLICIES.fDATECLOSE) Then
        dbCmd.Parameters.Append dbCmd.CreateParameter("fDATECLOSE", DB.adDBTimeStamp, DB.adParamInput, , dbPOLICIES.fDATECLOSE)
    End If
                                    
    Set dbRecSet = dbCmd.Execute
    BuiltIn.Delay(1000) 
    If dbRecSet.Fields.Item(0).Value <> ExpectedRowCount Then
        Set dbRecSet = dbCmd.Execute
        BuiltIn.Delay(4000) 
    End If
    If dbRecSet.Fields.Item(0).Value = ExpectedRowCount Then
       Log.Message "POLICIES record is correct.",,,MessageColor
    Else
       Log.Error "POLICIES record is incorrect.",,,ErrorColor
       Log.Error "Incorrect Query = " & dbCmd.CommandText,,,ErrorColor
    End If
    
    dbRecSet.Close
    dbCon.Close 
End Sub