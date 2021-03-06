'USEUNIT Subsystems_SQL_Library
'USEUNIT Library_Common
'USEUNIT Library_CheckDB 
'USEUNIT Constants
'USEUNIT Payment_Except_Library
'USEUNIT Intermediate_Table_Library

' Test Case ID 166587

Sub Intermediate_Table_Test()

      Dim clCode, outerId, jurStat, taxCod, regNumN, regCert,  fullName, EfullName, actSphere, actSphereKB, stateStatus,_
              customSize, organizStatus,regNum, dateRegN, regNType, pasCode, pasType, pasBy, datePass, dateExpire,_
              pasCode2, pasCode2Type, pasBy2, pasBy2Date, validUntill, firstName, lastName, partName, rezident, rezCountry,_
              checkVal, checkValEmp, dateOpen, acsBranch, custServ, acsType, clNote, parole, otherReg, elContact, income,_
              actingBody, forignCountBody, gender, birtDate, citizenship, birthplace, locCountry, regCountry, regState,_
              regResidence, regCity, regStreet, regBuild, regApartament, regAddress, regPost, regECity, regEStreet,_
              regEBuilding, regEApartament, regEAddress, actCountry, actState, actResidence, actCity, actStreet,  actBuild,_
              actApartament, actAddress, actPost, actECity, actEStreet, actEBuilding, actEApartament, actEAddress, tell,_
              regMobile, regCertSect, regEmail, regTel, regFax, ofcMail
              
      Dim queryString, sqlValue, colNum, sql_isEqual
      Dim savePath, fName, fileName1, fileName2
      Dim  startDate, fDate      
      
      startDate = "20100101"
      fDate = "20250101"
      Call Initialize_AsBank("bank", startDate, fDate)
               
      fileName1 = Project.Path & "Stores\Intermediate table\ActualClientError.txt"
      ' Ջնջել ActualClientError.txt ֆայլը
      aqFile.Delete(fileName1)
            
      Call Create_Connection()
      Login("ARMSOFT")

             'CLIENTS
              queryString = " SELECT COUNT(*) FROM CLIENTS "
              sqlValue = 270
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If 
              
              
      ' Մուտք Միջ. Աղյուսակներից ներմուծման ԱՇՏ
      Call ChangeWorkspace(c_ImpTable)
      ' Հաճախորդների ներմուծում
      Call wTreeView.DblClickItem("|ØÇç. ²ÕÛáõë³ÏÝ»ñÇó Ý»ñÙáõÍÙ³Ý ²Þî|Ð³×³Ëáñ¹Ý»ñÇ Ý»ñÙáõÍáõÙ")
          
      ' Այո կոճակի սեղմում
      Call ClickCmdButton(5, "²Ûá")

      savePath = Project.Path & "Stores\Intermediate table\"
      fName = "ActualClientError.txt"
      fileName2 = Project.Path & "Stores\Intermediate table\ExpectedClientError.txt"
      
      ' Դատարկել ActualClientError.txt  ֆայլը
'        Const FOR_WRITING = 2
'        Set fso = CreateObject("Scripting.FileSystemObject")
'        Set file = fso.OpenTextFile(fileName1, FOR_WRITING)
'        file.Close

      ' Ստուգում որ սխալի հաղորդագրություն պատուհանը  բացվել է
      If  wMDIClient.WaitVBObject("FrmSpr",30000).Exists Then
        
            ' Հիշել քաղվածքը
            Call SaveDoc(savePath, fName)

            If NOT Files.Compare(fileName1, fileName2)  Then
                  Log.Warning("Ֆայլերը նույնական չեն")
                  Exit Sub
            End If
            
            BuiltIn.Delay(1000)
            wMDIClient.VBObject("FrmSpr").Close
            
      Else
             Log.Error("Սխալի հաղորդագրություն պատուհանը չի բացվել")
             Exit Sub
      End If      
      
             'CLIENTS
              queryString = " SELECT COUNT(*) FROM CLIENTS "
              sqlValue = 353
              colNum = 0
              sql_isEqual = CheckDB_Value(queryString, sqlValue, colNum)
              If Not sql_isEqual Then
                Log.Error("Querystring = " & queryString & ":  Expected result = " & sqlValue)
              End If 

      ' Մուտք հաճախորդներ
      Call wTreeView.DblClickItem("|ØÇç. ²ÕÛáõë³ÏÝ»ñÇó Ý»ñÙáõÍÙ³Ý ²Þî|Ð³×³Ëáñ¹Ý»ñ")
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error("Հաճախորդներ դիալոգը չի բացվել")
            Exit Sub 
      End If
        
      outerId = "300305"
      '  Արտաքին N դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "OUTERID", outerId)    
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
        
      status =  WaitForExecutionProgress() 
      
      If Not status Then
            Log.Error("Հաճախորդներ թղթապանակը չի բացվել")
            Exit Sub 
      ElseIf wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 1 Then
              Log.Error("Նման համարով հաճախորդ գոյություն չունի")
              Exit Sub
      End If  
           
      ' Հաճախորդ փաստաթղթի տվյալների ստուգում 21 արժեքով
'      clCode = "00034856"
      jurStat = "21"
      regNum = "1234567912"
      dateRegN = "  /  /    "
      regNType = "4"
      pasCode = "AR12345692"
      pasType = "01"
      pasBy = "9"
      datePass = "13/03/2019"
      dateExpire = "26/07/2029"
      pasCode2 = ""
      pasBy2 = ""
      pasBy2Date = "  /  /    "
      validUntill = "  /  /    "
      firstName = "Ð³×³Ëáñ¹¨300305"
      lastName = ""
      partName = ""
      rezident = "1"
      rezCountry = "AM"
      checkVal = False
      checkValEmp = False
      dateOpen = "08/08/19"
      acsBranch = "00"
      custServ = "2"
      acsType = "00"
      clNote = ""
      parole = ""
      gender = "F"
      birtDate = "04/06/1980"
      citizenship = "1"
      birthplace = "AM"
      locCountry = "AM"
      elContact = "0"
      regCountry = "AM"
'      regState = "001"
      regResidence = "010010130"
      regCity = "ºðºì²Ü"
      regStreet = "ºñ¨³Ý öáÕáó ïáõÝ 22"
      regBuild = ""
      regApartament = ""
      regAddress = "ºñ¨³Ý öáÕáó ïáõÝ 22"
      regPost = ""
      regECity = ""
      regEStreet = ""
      regEBuilding = ""
      regEApartament = ""
      regEAddress = ""
      actCountry = ""
      actState = ""
      actResidence = ""
      actCity = ""
      actStreet = ""
      actBuild = ""
      actApartament = ""
      actAddress = ""
      actPost = ""
      actECity = ""
      actEStreet = ""
      actEBuilding = ""
      actEApartament = ""
      actEAddress = ""
      tell = ""
      regMobile = "374 77"
      regCertSect = "111132"
      regEmail = "TESTBANKAS@mail.ru"
      regTel = "111132"
      regFax = ""
      ofcMail = ""
      
      Call Check_Client_Data(clCode, outerId, jurStat, taxCod, regNumN, regCert,  fullName, EfullName, actSphere, actSphereKB, stateStatus,_
                                customSize, organizStatus,regNum, dateRegN, regNType, pasCode, pasType, pasBy, datePass, dateExpire,_
                                pasCode2, pasCode2Type, pasBy2, pasBy2Date, validUntill, firstName, lastName, partName, rezident, rezCountry,_
                                checkVal, checkValEmp, dateOpen, acsBranch, custServ, acsType, clNote, otherReg, elContact, income,_
                                actingBody, forignCountBody, gender, birtDate, citizenship, birthplace, locCountry, regCountry,_
                                regResidence, regCity, regStreet, regBuild, regApartament, regAddress, regPost, regECity, regEStreet,_
                                regEBuilding, regEApartament, regEAddress, actCountry, actState, actResidence, actCity, actStreet,  actBuild,_
                                actApartament, actAddress, actPost, actECity, actEStreet, actEBuilding, actEApartament, actEAddress, tell,_
                                regMobile, regCertSect, regEmail, regTel, regFax, ofcMail )
                                
      ' Մուտք հաճախորդներ
      Call wTreeView.DblClickItem("|ØÇç. ²ÕÛáõë³ÏÝ»ñÇó Ý»ñÙáõÍÙ³Ý ²Þî|Ð³×³Ëáñ¹Ý»ñ")
      
      If Not p1.WaitVBObject("frmAsUstPar",10000).Exists Then
            Log.Error("Հաճախորդներ դիալոգը չի բացվել")
            Exit Sub 
      End If

      taxCod = "3203203"
      '  ՀՎՀՀ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "TAXCOD", taxCod)   
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      status =  WaitForExecutionProgress() 
      
      If Not status Then
            Log.Error("Հաճախորդներ թղթապանակը չի բացվել")
            Exit Sub 
      ElseIf wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 1 Then
              Log.Error("Նման համարով հաճախորդ գոյություն չունի")
              Exit Sub
      End If  
      
      ' Հաճախորդ փաստաթղթի տվյալների ստուգում 22 արժեքով
'      clCode = "00034855"
      outerId = ""
      jurStat = "22"
      taxCod = "3203203"
      fullName = "²ÝáõÝ ³½·³ÝáõÝ Ð³Ûñ³ÝáõÝ"
      regNum = "3232132"
      regNType = "4"
      pasCode = "AP2101280"
      pasType = "01"
      pasBy = "057"
      dateRegN = "  /  /    "
      datePass = "03/10/2016"
      dateExpire = "03/10/2026"
      pasCode2 = ""
      pasBy2 = ""
      pasBy2Date = "  /  /    "
      validUntill = "  /  /    "
      firstName = "²ÝáõÝ"
      lastName = "³½·³ÝáõÝ"
      partName = "Ð³Ûñ³ÝáõÝ"
      rezident = "1"
      rezCountry = "AM"
      checkVal = 1
      checkValEmp = 1
      dateOpen = "01/11/18"
      acsBranch = "00"
      custServ = "2"
      acsType = "00"
      clNote = "2"
      parole = "023321"
      gender = "F"
      birtDate = "03/10/1996"
      citizenship = "1"
      birthplace = ""
      locCountry = "AM"
      elContact = "0"
      regCountry = "AM"
'      regState = "001"
      regResidence = "010010130"
      regCity = "ºñ¨³Ý"
      regStreet = "1223"
      regBuild = ""
      regApartament = ""
      regAddress = "1223"
      regPost = ""
      regECity = ""
      regEStreet = ""
      regEBuilding = ""
      regEApartament = ""
      regEAddress = ""
      actCountry = ""
      actState = ""
      actResidence = ""
      actCity = ""
      actStreet = ""
      actBuild = ""
      actApartament = ""
      actAddress = ""
      actPost = ""
      actECity = ""
      actEStreet = ""
      actEBuilding = ""
      actEApartament = ""
      actEAddress = ""
      tell = "121212"
      regMobile = ""
      regCertSect = ""
      regEmail = "12331@mail.com"
      regTel = ""
      regFax = ""
      ofcMail = ""
      
      Call Check_Client_Data(clCode, outerId, jurStat, taxCod, regNumN, regCert,  fullName, EfullName, actSphere, actSphereKB, stateStatus,_
                                customSize, organizStatus,regNum, dateRegN, regNType, pasCode, pasType, pasBy, datePass, dateExpire,_
                                pasCode2, pasCode2Type, pasBy2, pasBy2Date, validUntill, firstName, lastName, partName, rezident, rezCountry,_
                                checkVal, checkValEmp, dateOpen, acsBranch, custServ, acsType, clNote, otherReg, elContact, income,_
                                actingBody, forignCountBody, gender, birtDate, citizenship, birthplace, locCountry, regCountry,_
                                regResidence, regCity, regStreet, regBuild, regApartament, regAddress, regPost, regECity, regEStreet,_
                                regEBuilding, regEApartament, regEAddress, actCountry, actState, actResidence, actCity, actStreet,  actBuild,_
                                actApartament, actAddress, actPost, actECity, actEStreet, actEBuilding, actEApartament, actEAddress, tell,_
                                regMobile, regCertSect, regEmail, regTel, regFax, ofcMail )
                                
      ' Մուտք հաճախորդներ
      Call wTreeView.DblClickItem("|ØÇç. ²ÕÛáõë³ÏÝ»ñÇó Ý»ñÙáõÍÙ³Ý ²Þî|Ð³×³Ëáñ¹Ý»ñ")
      BuiltIn.Delay(1000)
      
      If Not p1.WaitVBObject("frmAsUstPar",2000).Exists Then
            Log.Error("Հաճախորդներ դիալոգը չի բացվել")
            Exit Sub 
      End If
        
      outerId = "155115"
      taxCod = "00000110001"
      '  Արտաքին N դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "OUTERID", outerId)   
      '  ՀՎՀՀ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "TAXCOD", taxCod)   
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
        
      status =  WaitForExecutionProgress() 
      
      If Not status Then
            Log.Error("Հաճախորդներ թղթապանակը չի բացվել")
            Exit Sub 
      ElseIf wMDIClient.VBObject("frmPttel").VBObject("tdbgView").ApproxCount <> 1 Then
              Log.Error("Նման համարով հաճախորդ գոյություն չունի")
              Exit Sub
      End If  
      
      ' Հաճախորդ փաստաթղթի տվյալների ստուգում 11 արժեքով
'      clCode = "00034935"  
      jurStat = "11"
      regNum = "00000110002"
      dateRegN = "13/03/2019"
      regNType = "1"
      regCert = "0000011000"      
      regNumN = "13265231"
      pasCode = "AR12345693"
      pasType = "04"
      pasBy = "001"
      datePass = "26/05/2014"
      dateExpire = "26/05/2019"
      pasCode2 = "3513"
      pasCode2Type = "01"
      pasBy2 = "022"
      pasBy2Date = "26/06/2014"
      validUntill = "26/05/2024"
      fullName = "OPEN LLC"
      EfullName = "saacas"
      actSphere = "9Q"
      actSphereKB = ""
      stateStatus = "2"
      customSize = "2"
      rezident = "1"
      rezCountry = "AM"
      checkVal = 1
      checkValEmp = 1
      dateOpen = "16/07/19"
      acsBranch = "00"
      custServ = "2"
      acsType = "00"
      clNote = "12"
      organizStatus = "01"
      otherReg = "dcsdcsdc"
      parole = "1234567"
      elContact = "0"
      income = "15,000.00"
      actingBody = "ARM_0003"
      forignCountBody = "1"
      gender = "F"
      birtDate = "03/10/1996"
      citizenship = "1"
      birthplace = ""
      locCountry = "AM"
      regCountry = "AM"
'      regState = "001"
      regResidence = "010010130"
      regCity = "ì²Ô²ðÞ²ä²î"
      regStreet = "sad3sa"
      regBuild = "5"
      regApartament = "15"
      regAddress = "sad3sa 5,15"
      regPost = "5645"
      regECity = "121sas"
      regEStreet = "32saa"
      regEBuilding = "52"
      regEApartament = "15"
      regEAddress = "32saa 52,15"
      actCountry = "AM"
      actState = "001"
      actResidence = "010010130"
      actCity = "ø³Õ³ù 00000110"
      actStreet = "sa2d123as"
      actBuild = "233"
      actApartament = "221"
      actAddress = "sa2d123as 233,221"
      actPost = "32132"
      actECity = "ds3sd"
      actEStreet = "3asd2sa1d"
      actEBuilding = "223"
      actEApartament = "322"
      actEAddress = "3asd2sa1d 223,322"
      tell = "121212"
      regMobile = "374 77"
      regCertSect = "111111"
      regEmail = "fdsfadsfsddfas@mail.ru"
      regTel = "111111"
      regFax = "121212"
      ofcMail = ""
      
      Call Check_Client_Data(clCode, outerId, jurStat, taxCod, regNumN, regCert,  fullName, EfullName, actSphere, actSphereKB, stateStatus,_
                                customSize, organizStatus,regNum, dateRegN, regNType, pasCode, pasType, pasBy, datePass, dateExpire,_
                                pasCode2, pasCode2Type, pasBy2, pasBy2Date, validUntill, firstName, lastName, partName, rezident, rezCountry,_
                                checkVal, checkValEmp, dateOpen, acsBranch, custServ, acsType, clNote, otherReg, elContact, income,_
                                actingBody, forignCountBody, gender, birtDate, citizenship, birthplace, locCountry, regCountry,_
                                regResidence, regCity, regStreet, regBuild, regApartament, regAddress, regPost, regECity, regEStreet,_
                                regEBuilding, regEApartament, regEAddress, actCountry, actState, actResidence, actCity, actStreet,  actBuild,_
                                actApartament, actAddress, actPost, actECity, actEStreet, actEBuilding, actEApartament, actEAddress, tell,_
                                regMobile, regCertSect, regEmail, regTel, regFax, ofcMail )
                         
                   
      ' Փակել ծրագիրը
      Call Close_AsBank()
      
End Sub




