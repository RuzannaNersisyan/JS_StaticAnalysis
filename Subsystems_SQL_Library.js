Option Explicit
'USEUNIT Library_Common

Dim aCon
Dim aCmd1

'--------------------------------------------------------------------------------------
'üáõÝÏóÇ³Ý Ñ³ëï³ïáõÙ ¿ Ï³å µ³½³ÛÇ Ñ»ï: ºÃ» Ï³åÁ ãÇ Ñ³ëï³ïí»É, í»ñ³¹³ñÓÝáõÙ ¿ False :
'--------------------------------------------------------------------------------------
Sub Create_Connection ()  
    Set aCon = ADO.CreateConnection
    aCon.ConnectionString = cConnectionString
    aCon.Open
    Set aCmd1 = ADO.CreateCommand
    aCmd1.ActiveConnection = aCon
    aCmd1.CommandType = adCmdText
End Sub

'--------------------------------------------------------------------------------------
'üáõÝÏóÇ³Ý Ñ³Ù»Ù³ïáõÙ ¿ Ñ³ñóáõÙÇó ëï³óíáÕ Ù»Ï ³ñÅ»ùÁ ëå³ëíáÕ ³ñÅ»ùÇ Ñ»ï:
'ºÃ» ã»Ý Ñ³ÙÁÝÏÝáõÙ í»ñ³¹³ñÓÝáõÙ ¿ False : üáõÝÏóÇ³Ý »ÝÃ³¹ñáõÙ µ³½³ÛÇ Ñ»ï Ñ³ëï³ïí³Í Ï³åÁ :
'--------------------------------------------------------------------------------------
Function CheckDB_Value(queryString, expValue, colNum)
    Dim isEqual, RecSet
    isEqual = True
    
    aCmd1.CommandText = queryString
    Set RecSet = aCmd1.Execute
    BuiltIn.Delay(500)
    If (RecSet.BOF And RecSet.EOF) Then
        Log.Error("No records found when executeing query " & queryString)
        isEqual = False
    End If
    
    If RecSet.Fields(colNum).Value <> expValue Or IsNull(RecSet.Fields(colNum).Value) Then
        BuiltIn.Delay(5000)
        Set RecSet = aCmd1.Execute
    End If    
    If RecSet.Fields(colNum).Value <> expValue Or IsNull(RecSet.Fields(colNum).Value) Then
        isEqual = False
        Log.Error("Querystring = " & queryString & ":  Expected result = " & expValue & "  Query result = " & RecSet.Fields(colNum).Value ) 
    End If
  '  Log.Message(":  Expected result = " & expValue & "  Query result = " & RecSet.Fields(colNum).Value )
    CheckDB_Value = isEqual
End Function

'--------------------------------------------------------------------------------------
'üáõÝÏóÇ³Ý Ñ³Ù»Ù³ïáõÙ ¿ Ñ³ñóáõÙÇó ëï³óíáÕ ëÛ³Ý ³ñÅ»ùÝ»ñÁ ëå³ëíáÕ ³ñÅ»ùÝ»ñÇ Ñ»ï:
'ºÃ» ã»Ý Ñ³ÙÁÝÏÝáõÙ í»ñ³¹³ñÓÝáõÙ ¿ False : üáõÝÏóÇ³Ý »ÝÃ³¹ñáõÙ µ³½³ÛÇ Ñ»ï Ñ³ëï³ïí³Í Ï³åÁ :
'--------------------------------------------------------------------------------------
Function CheckDB_Column_Values_With_String(queryString, expValues, colNum)
    Dim isEqual, RecSet, i
    isEqual = True
    i = 0
    
    aCmd1.CommandText = queryString
    Set RecSet = aCmd1.Execute
    
    If (RecSet.BOF And RecSet.EOF) Then
        Log.Error("No records found when executeing query " & queryString)
        isEqual = False
    End If

    Do While Not RecSet.EOF
        If Trim(RecSet.Fields(colNum).Value) <> expValues(i) Then
            isEqual = False
        End If
        i = i + 1
        RecSet.MoveNext
    Loop
    
    CheckDB_Column_Values_With_String = isEqual 
End Function

'__________________________________________________________
' Î³ï³ñáõÙ ¿ SQL Ñ³ñóáõÙ 
'----------------------------------------------------------
Sub Execute_SLQ_Query(queryString)
    Dim RecSet  
    aCmd1.CommandText = queryString
    BuiltIn.Delay(2000)
    Set RecSet = aCmd1.Execute
End Sub

'__________________________________________________________________________
'êï³ÝáõÙ ¿ SQL Ñ³ñóÙ³Ý ³ñ¹ÛáõÝùÁ
'--------------------------------------------------------------------------
Function Get_Query_Result(queryString)
    Dim RecSet
    aCmd1.CommandText = queryString
    Set RecSet = aCmd1.Execute
    Get_Query_Result = Trim(RecSet.Fields(0).Value)
End Function