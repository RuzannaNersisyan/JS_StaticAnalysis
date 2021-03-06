'USEUNIT Subsystems_SQL_Library
'USEUNIT Library_Common
'USEUNIT Library_CheckDB 
'USEUNIT Constants
'USEUNIT Payment_Except_Library

' clCode - Հաճախորդի կոդի
' outerId - Արտաքին N
' jurStat - Իրավաբանական կարգավիճակ
' taxCod - ՀՎՀՀ
' fullName - Անվանում
' regNum - ՀԾՀ/Սոց. քարտ
' regNType - Սոց. քարտ չունենալու տեղեկանք
' pasCode - Անձը հաստ. փաստթ.  կոդ
' pasType - ՀՀ ոչ բիոմետրիկ անձնագրի դաշտ
' pasBy - Տրված դաշտ
' datePass - Տրված ամսաթիվ դաշտ
' dateExpire - Վավեր է մինչև դաշտ
' pasCode2 - Անփը հաստ. փաստթ. 2 կոդ դաշտ
' firstName - Անուն դաշտ
' lastName - Ազգանուն դաշտ
' partName - Հայրանուն դաշտ
' rezident - Ռեզիդենտություն
' rezCountry - Ռեզ. երկիր դաշտ
' checkVal - Բանկի հետ կապվածություն դաշտ
' checkValEmp - Բանկի աշխատակից
' dateOpen - Բացման ամսաթիվ
' acsBranch - Գրասենյակ / Բաժին դաշտ
' custServ - Հաճախորդի սպասարկում դաշտ
' acsType - Հասան-ն տիպ դաշտ
' clNote - Նշում դաշտ
' parole - Գաղտնաբառ դաշտ
' gender - Սեռը  դաշտ
' birtDate - Ծննդյան ամսաթիվ 
' citizenship - Քաղաքացիություն
' birthplace - Ծննդյավայր (երկիր) դաշտ
' locCountry - Քաղաքացիություն(երկիր) դաշտ
' regCountry - Երկիր (գրանցման հասցե)
' regState - Մարզ (գրանցման հասցե)
' regResidence  - Բնակավայր (գրանցման հասցե)
' regCity - Քաղաք (գրանցման հասցե)
' regStreet - Փողոց (գրանցման հասցե)
' regBuild - Տուն/Շենք (գրանցման հասցե)
' regApartament - Բնակարան (գրանցման հասցե)
' regAddress - Հասցե (գրանցման հասցե)
' regPost - Ինդեքս (գրանցման հասցե)
' regECity - Քաղաք  (անգլ.) (գրանցման հասցե)
' regEStreet - Փողոց  (անգլ.) (գրանցման հասցե)
' regEBuilding - Տուն/Շենք  (անգլ.) (գրանցման հասցե)
' regEApartament - Բնակարան  (անգլ.) (գրանցման հասցե)
' regEAddress - Հասցե  (անգլ.) (գրանցման հասցե)
' actCountry - Երկիր (Փաստացի հասցե)
' actState - Մարզ (Փաստացի հասցե)
' actResidence - Բնակավայր (Փաստացի հասցե)
' actCity - Քաղաք (Փաստացի հասցե)
' actStreet - Փողոց (Փաստացի հասցե)
' actBuild - Տուն / Շենք (Փաստացի հասցե)
' actApartament - Բնակարան (Փաստացի հասցե)
' actAddress - Հասցե (Փաստացի հասցե)
' actPost - Ինդեքս (Փաստացի հասցե)
' actECity - Քաղաք  (անգլ.) (Փաստացի հասցե)
' actEStreet - Փողոց  (անգլ.) (Փաստացի հասցե)
' actEBuilding - Տուն/Շենք  (անգլ.) (Փաստացի հասցե)
' actEApartament - Բնակարան  (անգլ.) (Փաստացի հասցե)
' actEAddress - Հասցե  (անգլ.) (Փաստացի հասցե)
' tell - Հեռախոս
' regMobile - Բջջային
' regCertSect - Բջջային բաժին
' regEmail - Էլ. հասցե
' regTel - Լրացուցիչ հեռախոս
' regFax - Ֆաքս
' ofcMail - Պաշտոնական Է.լ հասցե
' Հաճախորդ փաստաթղթի տվյալների ստուգում
Sub Check_Client_Data(clCode, outerId, jurStat, taxCod, regNumN, regCert,  fullName, EfullName, actSphere, actSphereKB, stateStatus,_
                                customSize, organizStatus,regNum, dateRegN, regNType, pasCode, pasType, pasBy, datePass, dateExpire,_
                                pasCode2, pasCode2Type, pasBy2, pasBy2Date, validUntill, firstName, lastName, partName, rezident, rezCountry,_
                                checkVal, checkValEmp, dateOpen, acsBranch, custServ, acsType, clNote, otherReg, elContact, income,_
                                actingBody, forignCountBody, gender, birtDate, citizenship, birthplace, locCountry, regCountry,_
                                regResidence, regCity, regStreet, regBuild, regApartament, regAddress, regPost, regECity, regEStreet,_
                                regEBuilding, regEApartament, regEAddress, actCountry, actState, actResidence, actCity, actStreet,  actBuild,_
                                actApartament, actAddress, actPost, actECity, actEStreet, actEBuilding, actEApartament, actEAddress, tell,_
                                regMobile, regCertSect, regEmail, regTel, regFax, ofcMail )
        
      Dim param, tabFrame, wMainForm, rekvNum, wTabStrip, wtabFrame, wMDIClient        
      Dim datePassPar, dateExpirePar, rezidentPar, rezCountryPar, dateOpenPar, acsBranchPar, cliNotePar, acsTypePar,_
              genderPar, birtDatePar, citizenshipPar, birthplacePar, locCountryPar, clNotePar, pasBy2DatePar, validUntillPar,_
              elContactPar
      Dim  regCountryPar, regStatePar, regResidencePar, actCountryPar, actStatePar, actResidencePar, regCertSectPar
                
      Set wMainForm = Sys.Process("Asbank").VBObject("MainForm")
        
      ' Գործողություններ /  Բոլոր գործողություններ 
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Գործողություններ /  Խմբագրել
      Call wMainForm.PopupMenu.Click(c_ToEdit)
        
      If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").Exists Then
              Log.Error("Հաճախորդի փաստաթուղթը չի բացվել")
              Exit Sub
      End If
        
      Set frmASDocForm = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm")
      Set tabFrame = frmASDocForm.VBObject("TabFrame")
          
'      ' Հաճախորդի կոդի արժեքի ստուգում
'      param = GetVBObject("CODE", frmASDocForm)
'      rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
'          
'      If Not rekvNum = clCode Then
'              Log.Error("Հաճախորդի կոդի անհամապատասխանություն ")
'      End If
           
      ' Արտաքին N դաշտի արժեքի ստուգում
      param = GetVBObject("OUTERID", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
        
      If Not rekvNum = outerId Then
              Log.Error("Արտաքին N դաշտի արժեքի անհամապատասխանություն ")
      End If
          
      ' Իրավաբանական կարգավիճակ դաշտի արժեքի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree").VBObject("TDBMask").text
        
      If Not rekvNum = jurStat Then
              Log.Error("Իրավաբանական կարգավիճակ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      Set wMDIClient = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1)
      Set wTabStrip = wMDIClient.vbObject("frmASDocForm").vbObject("TabStrip")
      Set wtabFrame = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").VBObject("TabFrame_2")
        
      datePassPar = "2"
      dateExpirePar = "3"
      rezidentPar = "5"
      rezCountryPar = "6"
      dateOpenPar = "6"
      acsBranchPar = "7"
      custServPar = "8"
      acsTypePar = "9"
      genderPar = "17"
      birtDatePar = "7"
      citizenshipPar = "18"
      birthplacePar = "20"
      locCountryPar = "19"
      clNotePar = "10"
      pasBy2DatePar = "4"
      validUntillPar = "5"
      elContactPar = "13"
      regCountryPar = "22"
      regStatePar = "23"
      regResidencePar = "23"
      actCountryPar = "24"
      actStatePar = "26"
      actResidencePar = "25"
      regCertSectPar = "46"
        
      If rekvNum = "22" Then
        
            datePassPar = "3"
            dateExpirePar = "4"
            rezidentPar = "7"
            rezCountryPar = "8"
            dateOpenPar = "7"
            acsBranchPar = "9"
            custServPar = "10"
            acsTypePar = "11"
            genderPar = "19"
            birtDatePar = "8"
            citizenshipPar = "20"
            locCountryPar = "21"
            birthplacePar = "22"
            clNotePar = "12"
            pasBy2DatePar = "5"
            validUntillPar = "6"
            elContactPar = "15"
            regCountryPar = "24"
            regStatePar = "25"
            regResidencePar = "25"
            actCountryPar = "26"
            actStatePar = "28"
            actResidencePar = "27"
            regCertSectPar = "44"

            ' ՀՎՀՀ դաշտի ստուգում
            param = GetVBObject("TAXCOD", frmASDocForm)
            rekvNum =  frmASDocForm.vbObject("TabFrame").VBObject(param).Text
            
            If Not rekvNum = taxCod Then
                Log.Error("ՀՎՀՀ  դաշտի արժեքի անհամապատասխանություն ")
            End If
            
            ' Անվանում դաշտի ստուգում
            param = GetVBObject("NAME", frmASDocForm)
            rekvNum =  frmASDocForm.vbObject("TabFrame").VBObject(param).Text
            
            If Not rekvNum = fullName Then
                Log.Error("Անվանում դաշտի արժեքի անհամապատասխանություն ")
            End If
            
      ElseIf rekvNum = "11" Then
                      
            elContactPar = "19"
            pasBy2DatePar = "4"
            validUntillPar = "5"
            rezidentPar = "9"
            rezCountryPar = "10"
            acsBranchPar = "11"
            custServPar = "12"
            acsTypePar = "13"
            clNotePar = "14"
            locCountryPar = "24"
            genderPar = "22"
            regCountryPar = "26"
            regStatePar = "27"
            regResidencePar = "27"
            actCountryPar = "28"
            actStatePar = "30"
            actResidencePar = "29"
            regCertSectPar = "41"

            ' ՀՎՀՀ դաշտի ստուգում
            param = GetVBObject("TAXCOD", frmASDocForm)
            rekvNum =  frmASDocForm.vbObject("TabFrame").VBObject(param).Text
            
            If Not rekvNum = taxCod Then
                Log.Error("ՀՎՀՀ  դաշտի արժեքի անհամապատասխանություն ")
            End If   
                                 
           ' ԱՁ. Գրանցման N դաշտի ստուգում
            param = GetVBObject("STREGNUM", frmASDocForm)
            rekvNum =  frmASDocForm.vbObject("TabFrame").VBObject(param).Text
            
            If Not rekvNum = regNumN Then
                Log.Error("Գրանցման N  դաշտի արժեքի անհամապատասխանություն ")
            End If
            
            ' Պետ գրանցման վկայականի համար դաշտի ստուգում
            param = GetVBObject("REGCERT", frmASDocForm)
            rekvNum =  frmASDocForm.vbObject("TabFrame").VBObject(param).Text
            
            If Not rekvNum = regCert Then
                Log.Error("Պետ գրանցման վկայականի համար դաշտի արժեքի անհամապատասխանություն ")
            End If
                      
            ' Անվանում դաշտի ստուգում
            param = GetVBObject("NAME", frmASDocForm)
            rekvNum =  frmASDocForm.vbObject("TabFrame").VBObject(param).Text
            
            If Not rekvNum = fullName Then
                Log.Error("Անվանում դաշտի արժեքի անհամապատասխանություն ")
            End If
            
            ' Անգլերեն անվանում դաշտի ստուգում
            param = GetVBObject("ENAME", frmASDocForm)
            rekvNum =  frmASDocForm.vbObject("TabFrame").VBObject(param).Text
            
            If Not rekvNum = EfullName Then
                Log.Error("Անգլերեն անվանում դաշտի արժեքի անհամապատասխանություն ")
            End If             
                      
            ' Գործունեության ոլորտ դաշտի արժեքի ստուգում
            rekvNum = tabFrame.VBObject("ASTypeTree_5").VBObject("TDBMask").Text  
             
            If Not rekvNum = actSphere Then
                   Log.Error("Գործունեության ոլորտ դաշտի արժեքի անհամապատասխանություն ")
            End If
                                     
            ' Գործունեության ոլորտ(ԿԲ) դաշտի արժեքի ստուգում
            rekvNum = tabFrame.VBObject("ASTypeTree_6").VBObject("TDBMask").Text  
            
            If Not rekvNum = actSphereKB Then
                     Log.Error("Գործունեության ոլորտ (ԿԲ) դաշտի արժեքի անհամապատասխանություն ")
            End If  
                     
            ' Պետական կարգավիճակ դաշտի արժեքի ստուգում
            rekvNum = tabFrame.VBObject("ASTypeTree_7").VBObject("TDBMask").Text  
             
            If Not rekvNum = stateStatus Then
                     Log.Error("Պետական կարգավիճակ դաշտի արժեքի անհամապատասխանություն ")
            End If  
                     
            ' Հաճախորդի չափ դաշտի արժեքի ստուգում
            rekvNum = tabFrame.VBObject("ASTypeTree_8").VBObject("TDBMask").Text  
              
            If Not rekvNum = customSize Then
                     Log.Error("Հաճախորդի չափ դաշտի արժեքի անհամապատասխանություն ")
            End If  
                     
            BuiltIn.Delay(1000)
            ' Անցում լրացուցիչ էջին
            wTabStrip.SelectedItem = wTabStrip.Tabs(2)
                     
            ' Կազմ-Իրավ կարգավիճակ դաշտի արժեքի ստուգում
            rekvNum = wtabFrame.VBObject("ASTypeTree_17").VBObject("TDBMask").Text  
              
            If Not rekvNum = organizStatus Then
                     Log.Error("Կազմ-Իրավ կարգավիճակ դաշտի արժեքի անհամապատասխանություն ")
            End If  
                     
            ' Իրավ անձի եկամուտներ դաշտի արժեքի ստուգում
            rekvNum = wtabFrame.VBObject("TDBNumber").Text  
              
            If Not rekvNum = income Then
                     Log.Error("Իրավ անձի եկամուտներ դաշտի արժեքի անհամապատասխանություն ")
            End If  
            
            ' ՀՀ/ԼՂՀ անունից հանդես եկող մարմին դաշտի արժեքի ստուգում
            rekvNum = wtabFrame.VBObject("ASTypeTree_20").VBObject("TDBMask").Text  
              
            If Not rekvNum = actingBody Then
                     Log.Error("ՀՀ/ԼՂՀ անունից հանդես եկող մարմին դաշտի արժեքի անհամապատասխանություն ")
            End If  

            ' Օտարերկր. պետ. մարմին դաշտի արժեքի ստուգում  
            rekvNum = wtabFrame.VBObject("ASTypeTree_21").VBObject("TDBMask").Text  
                
            If Not rekvNum = forignCountBody Then
                     Log.Error("Օտարերկր. պետ. մարմին դաշտի արժեքի անհամապատասխանություն ")
            End If  
                     
            ' Անցում ընդհանուր էջին
            wTabStrip.SelectedItem = wTabStrip.Tabs(1)
                      
      End If
        
      ' ՀԾՀ/Սոց. քարտ դաշտի արժեքի ստուգում
      param = GetVBObject("REGNUM", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame").VBObject(param).Text
        
      If Not rekvNum = regNum Then
              Log.Error("ՀԾՀ/Սոց. քարտ  դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Սոց. քարտր տրամադրման ամսաթիվ դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("TDBDate").Text  
        
      If Not rekvNum = dateRegN Then
              Log.Error("Սոց. քարտ չունենալու տեղեկանք  դաշտի արժեքի անհամապատասխանություն ")
      End If
         
      ' Սոց. քարտ չունենալու տեղեկանք  դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("ASTypeTree_2").VBObject("TDBMask").Text  
        
      If Not rekvNum = regNType Then
              Log.Error("Սոց. քարտ չունենալու տեղեկանք  դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Անձը հաստ. փաստթ.  կոդ -  դաշտի արժեքի ստուգում
      param = GetVBObject("PASCODE", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
        
      If Not rekvNum = pasCode Then
              Log.Error("Անձը հաստ. փաստթ.  կոդ -  դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Անձը հաստ. փաստթ. տիպ դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("ASTypeTree_3").VBObject("TDBMask").Text
        
      If Not rekvNum = pasType Then
              Log.Error("Անձը հաստ. փաստթ. տիպ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Տրված դաշտի արժեքի ստուգում
      param = GetVBObject("PASBY", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
        
      If Not Trim(rekvNum) = Trim(pasBy) Then
              Log.Error("Տրված դաշտի արժեքի անհամապատասխանություն ")
      End If        
        
      ' Տրված ամսաթիվ դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("TDBDate_"& datePassPar ).Text
        
      If Not rekvNum = datePass Then
              Log.Error("Տրված դաշտի արժեքի անհամապատասխանություն ")
      End If    
        
      ' Վավեր է մինչև դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("TDBDate_" & dateExpirePar).Text
        
      If Not rekvNum = dateExpire Then
              Log.Error("Վավեր է մինչև դաշտի արժեքի անհամապատասխանություն ")
      End If    

      ' Անձը հաստ. փաստթ. 2 կոդ դաշտի արժեքի ստուգում
      param = GetVBObject("PASCODE2", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
        
      If Not rekvNum = pasCode2 Then
              Log.Error("Անփը հաստ. փաստթ. 2 կոդ դաշտի արժեքի անհամապատասխանություն ")
      End If

      ' Անձը հաստ. փաստթ. 2 տիպ դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("ASTypeTree_4").VBObject("TDBMask").Text
        
      If Not rekvNum = pasCode2Type Then
              Log.Error("Անձը հաստ. փաստթ. 2 տիպ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Տրված դաշտի արժեքի ստուգում
      param = GetVBObject("PASBY2", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
        
      If Not Trim(rekvNum) = Trim(pasBy2) Then
              Log.Error("Տրված դաշտի դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Տրված ամսաթիվ դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("TDBDate_" & pasBy2DatePar).Text
        
      If Not rekvNum = pasBy2Date Then
              Log.Error("Տրված ամսաթիվ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Վավեր է մինչև դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("TDBDate_" & validUntillPar).Text
        
      If Not rekvNum = validUntill Then
              Log.Error("Վավեր է մինչև  դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      If rekvNum = "22" OR rekvNum = "21" Then
    
            ' Անուն դաշտի արժեքի ստուգում
            param = GetVBObject("FIRSTNAME", frmASDocForm)
            rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
        
            If Not rekvNum = firstName Then
                    Log.Error("Անուն դաշտի արժեքի անհամապատասխանություն ")
            End If
        
            ' Ազգանուն դաշտի արժեքի ստուգում
            param = GetVBObject("LASTNAME", frmASDocForm)
            rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text     
        
            If Not rekvNum = lastName Then
                    Log.Error("Ազգանուն դաշտի արժեքի անհամապատասխանություն ")
            End If
        
            ' Հայրանուն դաշտի արժեքի ստուգում
            param = GetVBObject("PATRNAME", frmASDocForm)
            rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
        
            If Not rekvNum = partName Then
                    Log.Error("Հայրանուն դաշտի արժեքի անհամապատասխանություն ")
            End If
                
            ' Անցում լրացուցիչ էջին
            wTabStrip.SelectedItem = wTabStrip.Tabs(2)
                
            ' Ծննդյավայր (երկիր) դաշտի արժեքի ստուգում
            rekvNum = wtabFrame.VBObject("ASTypeTree_" & birthplacePar).VBObject("TDBMask").Text
        
            If Not rekvNum = birthplace Then
                    Log.Error("Ծննդյավայր (երկիր) դաշտի արժեքի անհամապատասխանություն ")
            End If                

            Call ClickCmdButton(1, "Î³ï³ñ»É")
                
            ' Անցում ընդհանուր էջին
            wTabStrip.SelectedItem = wTabStrip.Tabs(1)
                
      End If
        
      ' Ռեզիդենտություն դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("ASTypeTree_" & rezidentPar).VBObject("TDBMask").Text
        
      If Not rekvNum = rezident Then
              Log.Error("Ռեզիդենտություն դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Ռեզ. երկիր դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("ASTypeTree_" & rezCountryPar).VBObject("TDBMask").Text
        
      If Not rekvNum = rezCountry Then
              Log.Error("Ռեզ. երկիր դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Բանկի հետ կապվածություն դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("CheckBox_3").Value

      If Not rekvNum = checkVal Then
              Log.Error("Բանկի հետ կապվածություն դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Բանկի աշխատակից դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("CheckBox_4").Value

      If Not rekvNum = checkValEmp Then
              Log.Error("Բանկի աշխատակից դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Բացման ամսաթիվ դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("TDBDate_" & dateOpenPar).Text
        
      If Not rekvNum = dateOpen Then
              Log.Error("Բացման ամսաթիվ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Գրասենյակ / Բաժին դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("ASTypeTree_" & acsBranchPar).VBObject("TDBMask").Text
        
      If Not rekvNum = acsBranch Then
              Log.Error("Գրասենյակ / Բաժին դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Հաճախորդի սպասարկում դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("ASTypeTree_" & custServPar).VBObject("TDBMask").Text
        
      If Not rekvNum = custServ Then
              Log.Error("Հաճախորդի սպասարկում դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Հասան-ն տիպ դաշտի արժեքի ստուգում
      rekvNum = tabFrame.VBObject("ASTypeTree_" & acsTypePar).VBObject("TDBMask").Text
        
      If Not rekvNum = acsType Then
              Log.Error("Հասան-ն տիպ դաշտի արժեքի անհամապատասխանություն ")
      End If
                
      ' Անցում լրացուցիչ էջին
      wTabStrip.SelectedItem = wTabStrip.Tabs(2)
        
      ' Նշում դաշտի արժեքի ստուգում
      rekvNum = wtabFrame.VBObject("ASTypeTree_" & clNotePar).VBObject("TDBMask").Text
        
      If Not rekvNum = clNote Then
              Log.Error("Նշում դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Այլ(վ. ռեգ.) դաշտի արժեքի ստուգում
      param = GetVBObject("COMM", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame_2").VBObject(param).Text
        
      If Not rekvNum = otherReg Then
              Log.Error("Այլ (վ. ռեգ.)  դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Էլ. կապ դաշտի արժեքի ստուգում
      rekvNum = wtabFrame.VBObject("ASTypeTree_" & elContactPar).VBObject("TDBMask").Text
        
      If Not rekvNum = elContact Then
              Log.Error("Էլ. կապ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
'      ' Գաղտնաբառ դաշտի արժեքի ստուգում
'      param = GetVBObject("PAROLE", frmASDocForm)
'      rekvNum = frmASDocForm.vbObject("TabFrame_2").VBObject(param).Text
'        
'      If Not rekvNum = parole Then
'              Log.Error("Նշում դաշտի արժեքի անհամապատասխանություն ")
'      End If

      ' Սեռը  դաշտի արժեքի ստուգում
      rekvNum = wtabFrame.VBObject("ASTypeTree_" & genderPar).VBObject("TDBMask").Text
        
      If Not rekvNum = gender Then
              Log.Error("Սեռը դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Ծննդյան ամսաթիվ դաշտի արժեքի ստուգում
      rekvNum = wtabFrame.VBObject("TDBDate_" & birtDatePar).Text
        
      If Not Trim(rekvNum) = Trim(birtDate) Then
              Log.Error("Ծննդյան ամսաթիվ դաշտի արժեքի անհամապատասխանություն ")
      End If        

      ' Քաղաքացիություն դաշտի արժեքի ստուգում
      rekvNum = wtabFrame.VBObject("ASTypeTree_" & citizenshipPar).VBObject("TDBMask").Text
        
      If Not rekvNum = citizenship Then
              Log.Error("Քաղաքացիություն սպասարկում դաշտի արժեքի անհամապատասխանություն ")
      End If     
        
      ' Քաղաքացիություն(երկիր) դաշտի արժեքի ստուգում
      rekvNum = wtabFrame.VBObject("ASTypeTree_" & locCountryPar).VBObject("TDBMask").Text   
        
      If Not rekvNum = locCountry Then
              Log.Error("Քաղաքացիություն (երկիր) սպասարկում դաշտի արժեքի անհամապատասխանություն ")
      End If     
        
      ' Անցում Հասցե էջին
      wTabStrip.SelectedItem = wTabStrip.Tabs(3)
      Set wtabFrame = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm").VBObject("TabFrame_3")
        
      ' Երկիր դաշտի ստուգում
      rekvNum = wtabFrame.VBObject("ASTypeTree_" & regCountryPar).VBObject("TDBMask").Text   
        
      If Not rekvNum = regCountry Then
              Log.Error("Երկիր դաշտի արժեքի անհամապատասխանություն ")
      End If     
        
      ' Մարզ դաշտի ստուգում
'      rekvNum = wtabFrame.VBObject("ASTypeTree_" & regStatePar).VBObject("TDBMask").Text   
'        
'      If Not rekvNum = regState Then
'              Log.Error("Մարզ դաշտի արժեքի անհամապատասխանություն ")
'      End If     
        
      ' Բնակավայր դաշտի ստուգում
      rekvNum = wtabFrame.VBObject("ASTypeTree_" & regResidencePar).VBObject("TDBMask").Text   
        
      If Not rekvNum = regResidence Then
              Log.Error("Բնակավայր դաշտի արժեքի անհամապատասխանություն ")
      End If     
        
      ' Քաղաք դաշտի ստուգում
      param = GetVBObject("CITY", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = regCity Then
          Log.Error("Քաղաք դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Փողոց  դաշտի ստուգում
      param = GetVBObject("STREET", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = regStreet Then
          Log.Error("Փողոց դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Տուն/ Շենք  դաշտի ստուգում
      param = GetVBObject("BUILDNUM", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = regBuild Then
          Log.Error("Տուն/ Շենք դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Բանակարան դաշտի ստուգում
      param = GetVBObject("APARTMENT", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = regApartament Then
          Log.Error("Բանակարան դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Հասցե դաշտի ստուգում
      param = GetVBObject("ADDRESS", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = regAddress Then
          Log.Error("Հասցե դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Ինդեքս դաշտի ստուգում
      param = GetVBObject("POSTIND", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not Trim(rekvNum) = Trim(regPost) Then
          Log.Error("Ինդեքս դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Քաղաք (անգլ.) դաշտի ստուգում
      param = GetVBObject("ECITY", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = regECity Then
          Log.Error("Քաղաք (անգլ.) դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Փողոց (անգլ.) դաշտի ստուգում
      param = GetVBObject("ESTREET", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = regEStreet Then
          Log.Error("Փողոց (անգլ.) դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Տուն/Շենք (անգլ.) դաշտի ստուգում
      param = GetVBObject("EBUILDNUM", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = regEBuilding Then
          Log.Error("Տուն/Շենք (անգլ.) դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Բնակարան (անգլ.) դաշտի ստուգում
      param = GetVBObject("EAPARTMENT", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = regEApartament Then
          Log.Error("Բնակարան (անգլ.) դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Հասցե (անգլ.) դաշտի ստուգում
      param = GetVBObject("EADDRESS", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = regEAddress Then
          Log.Error("Հասցե (անգլ.) դաշտի արժեքի անհամապատասխանություն ")
      End If

       ' Երկիր դաշտի ստուգում
      rekvNum = wtabFrame.VBObject("ASTypeTree_" & actCountryPar ).VBObject("TDBMask").Text   
        
      If Not rekvNum = actCountry Then
              Log.Error("Երկիր դաշտի արժեքի անհամապատասխանություն ")
      End If     
        
''       Մարզ դաշտի ստուգում
'      rekvNum = wtabFrame.VBObject("ASTypeTree_" & actStatePar).VBObject("TDBMask").Text   
'        
'      If Not rekvNum = actState Then
'              Log.Error("Մարզ դաշտի արժեքի անհամապատասխանություն ")
'      End If     
        
      ' Բնակավայր դաշտի ստուգում
      rekvNum = wtabFrame.VBObject("ASTypeTree_" & actResidencePar).VBObject("TDBMask").Text   
        
      If Not rekvNum = actResidence Then
              Log.Error("Բնակավայր դաշտի արժեքի անհամապատասխանություն ")
      End If     
        
      ' Քաղաք դաշտի ստուգում
      param = GetVBObject("CITY2", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = actCity Then
          Log.Error("Քաղաք դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Փողոց  դաշտի ստուգում
      param = GetVBObject("STREET2", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = actStreet Then
          Log.Error("Փողոց դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Տուն/ Շենք  դաշտի ստուգում
      param = GetVBObject("BUILDNUM2", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = actBuild Then
          Log.Error("Տուն/ Շենք դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Բանակարան դաշտի ստուգում
      param = GetVBObject("APARTMENT2", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = actApartament Then
          Log.Error("Բանակարան դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Հասցե դաշտի ստուգում
      param = GetVBObject("ADDRESS2", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = actAddress Then
          Log.Error("Հասցե դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Ինդեքս դաշտի ստուգում
      param = GetVBObject("POSTIND2", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not Trim(rekvNum) = Trim(actPost) Then
          Log.Error("Ինդեքս դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Քաղաք (անգլ.) դաշտի ստուգում
      param = GetVBObject("ECITY2", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = actECity Then
          Log.Error("Քաղաք (անգլ.) դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Փողոց (անգլ.) դաշտի ստուգում
      param = GetVBObject("ESTREET2", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = actEStreet Then
          Log.Error("Փողոց (անգլ.) դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Տուն/Շենք (անգլ.) դաշտի ստուգում
      param = GetVBObject("EBUILDNUM2", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = actEBuilding Then
          Log.Error("Տուն/Շենք (անգլ.) դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Բնակարան (անգլ.) դաշտի ստուգում
      param = GetVBObject("EAPARTMENT2", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = actEApartament Then
          Log.Error("Բնակարան (անգլ.) դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Հասցե (անգլ.) դաշտի ստուգում
      param = GetVBObject("EADDRESS2", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = actEAddress Then
          Log.Error("Հասցե (անգլ.) դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Հեռախոս դաշտի ստուգում
      param = GetVBObject("TEL1", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = tell Then
          Log.Error("Հեռախոս դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Բջջային դաշտի ստուգում
      rekvNum = wtabFrame.VBObject("AsTpComment").VBObject("TDBComment").Text
            
      If Not rekvNum = regMobile Then
          Log.Error("Բջջային դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      '  Բջջային բաժին դաշտի ստուգում
      rekvNum =  frmASDocForm.VBObject("TabFrame_3").VBObject("TextC_" & regCertSectPar).Text
            
      If Not Trim(rekvNum) = regCertSect Then
          Log.Error("Բջջային բաժին դաշտի արժեքի անհամապատասխանություն ")
      End If
 
      ' Էլ հասցե դաշտի ստուգում
      param = GetVBObject("EMAIL", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = regEmail Then
          Log.Error("Էլ հասցե դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Լրացուցիչ հեռախոս դաշտի ստուգում
      param = GetVBObject("TEL", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = regTel Then
          Log.Error("Լրացուցիչ հեռախոս դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Ֆաքս դաշտի ստուգում
      param = GetVBObject("FAX", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = regFax Then
          Log.Error("Ֆաքսդաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Պաշտոնական էլ հասցե դաշտի ստուգում
      param = GetVBObject("OFCEMAIL", frmASDocForm)
      rekvNum =  frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not rekvNum = ofcMail Then
          Log.Error("Պաշտոնական էլ հասցե դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close
        
End Sub

' Գրաֆիկով վարկային պայմանագրի ստուգում
' loanCode - Պայմանագրի N դաշտ
' crdtCode - Վարկային կոդ դաշտ
' outerCode - Արտաքին N դաշտ
' cliCod - Հաճախորդ դաշտ
' clName - Անվանում դաշտ
' templateN - Ձևանմուշի N դաշտ
' loanCurrency - Արժույթ
' redCurr - Մարման արժույթ դաշտ
' setAccount - Հաշվարկային հաշիվ դաշտ
' insPayCalc - Տոկոսների վճարման հաշվարկ դաշտ
' loanMoney - Վարկի գումար դաշտ
' dateSealing - Կնքման ամսաթիվ դաշտ
' dateGive - Հատկացման ամսաթիվ
' dateRepay - Մարման ժամկետ
' wComment - Մեկանաբանություն 
' wOffice - Գրասենյակ
' wSection - Բաժին
' acType - Հասան-ն տիպ
' autoDebt - Պարտքերի ավտոմատ մարում
' debtPart - Մարման ձև
' repBegin - Մարումների սկիզբ
' repEnd - Մարումների վերջ
' minDays - Առաջիկա մարման նվազագույն օ. ք.
' parMonth - Պարբերություն ամիս
' parDay - Պարբերություն օր
' passOvDirect - Շրջանցման ուղղություն
' passOvType - Ուղղ. օր
' marBeg - Գումարի մարումների սկիզբ
' wRepayment - Մարումների քանակ
' pauseCount - Դադարի քանակ
' dbtMinPer - Մարման նվազագույն տոկոս
' summInDbt - Ոչ պակաս քան
' fillRound - Կլորացման աստիճան
' kindScale - Օրացույցի հաշվարկման ձև
' pCarg - Վարկի տոկոսադրույք 
' pCargSect - Վարկի տոկոսադրույք բաժին
' unusePartRate - Չօգտագործված մասի տոկոսադրույք 
' unusePartRateSect - Չօգտագործված մասի տոկոսադրույք բաժին
' pcGrant - Սուբսիդավորման տողոսադրույք 
' pcGrantSect - Սուբսիդավորման տողոսադրույք բաժին
' redPeriod - Նվազեցման պարբերություն
' fillRoundPr - Տոկոսների կլորացման աստիճան
' deviation - Շեղում
' agrMin - Տոկոսադրույքի սահման 
' agrMax - Տոկոսադրույքի սահման մինչև
' payPerGive - Տոկոսները վճարվում են ժամանակաշրջանի սկզբում
' giveCount - Մարումների քանակ
' periodically - Պարբերաբար
' effRate - Արդյունավետ տոկոսադրույք 
' actualRate - Փաստացի տոկոսադրույք
' autoLoanCount - Արդյունավետ տոկոց. ավտոմատ հաշվարկում
' penMoney - Ժամկետանց գումարի տույժ 
' penMoneySect - Ժամկետանց գումարի տույժ բաժին
' penLoan - Ժամկետանց տոկոսի տույժ 
' penLoanSect - Ժամկետանց տոկոսի տույժ բաժին
' countPenMoney - Ժամկետանց գումարի տոկոսի հաշվարկաման ձև
' penMoneyRate - Ժամկետանց գումարի տոկոսադրույք (վնաս) 
' penMoneyRateSect - Ժամկետանց գումարի տոկոսադրույք (վնաս) բաժին
' countBTHD - Հաշվարկել ԲՏՀԴ տոկոսագումար
' countBTHDSect - Դուրս գրված Ժամկետանց հաշվարկ
' richness - Ճուղայնություն
' purpose - Նպատակ
' wProgram - Ճրագիր
' wGuarantee - Երաշխավորություն
' wCountry - Երկիր
' wState - Մարզ
' wStateNew - Մարզ (Նոր ՌՎ.)
' wNote - Նշում
' wNote2 - Նշում 2
' wNote3 - Նշում 3
' contPaperN - Պայմ. թղթային N 
' transTime - Գործարքի ժամ
' subjecClass - Սյուբեկտիվ դասակարգված
' excerptForm - Քաղվածքի տրամադրման ձև
' stDate - Սկզբի ամսաթիվ
' extParagraph - Պարբերություն ամիս
' extParDay - Պարբերություն օր
' timeDev - Ժամանակահատվածի շեղում
' avoidDays  - Ոչ աշխատանքային օրեր
Sub CheckLoanContract(loanCode, crdtCode, outerCode, templateN, loanCurrency , redCurr, setAccount, insPayCalc,_
                                             loanMoney, dateSealing, dateGive, dateRepay, wComment, wOffice, wSection, acType, autoDebt, debtPart,_
                                             dateFillType, repBegin, repEnd, minDays, parMonth, parDay, passOvDirect, passOvType, marBeg, sumDateFillType,_
                                             wRepayment, pauseCount, sumFillType, dbtMinPer, summInDbt, fillRound, kindScale, pCarg, pCargSect, unusePartRate,_
                                             unusePartRateSect , pcGrant, pcGrantSect, redPeriod, fillRoundPr, deviation, agrMin, agrMax, payPerGive,_
                                             giveCount, periodically, effRate, actualRate, autoLoanCount, penMoney, penMoneySect, penLoan,_
                                             penLoanSect, countPenMoney, penMoneyRate, penMoneyRateSect, countBTHD, countBTHDSect,_
                                             richness, purpose, wProgram, wGuarantee, wCountry, wState, wStateNew, wNote, wNote2, wNote3,_
                                             contPaperN, transTime, subjecClass, excerptForm, stDate, extParagraph, extParDay, timeDev,_
                                             avoidDays )
      
      Dim frmASDocForm, tabFrame, param, rekvNum, wTabStrip, wMDIClient
      
      ' Գործողություններ /  Բոլոր գործողություններ 
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Գործողություններ /  Խմբագրել
      Call wMainForm.PopupMenu.Click(c_ToEdit)
      BuiltIn.Delay(1000)
      
      ' Ստուգում որ Գրաֆիկով վարկային պայմանագիր փաստաթուղթը բացվել է 
      If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Exists Then
            Log.Error("Գրաֆիկով վարկային պայմանագիր փաստաթուղթը չի բացվել")
            Exit Sub
      End If    
      
      Set frmASDocForm = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm")
      Set tabFrame = frmASDocForm.VBObject("TabFrame")

      ' Պայմանագրի N դաշտի ստուգում
      param = GetVBObject("CODE", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
          
      If Not rekvNum = loanCode Then
              Log.Error("Պայմանագրի N դաշտի անհամապատասխանություն ")
      End If
      
      ' Վարկային կոդ դաշտի ստուգում
      param = GetVBObject("CRDTCODE", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
          
      If Not rekvNum = crdtCode Then
              Log.Error("Վարկային կոդ դաշտի անհամապատասխանություն ")
      End If
        
      ' Արտաքին N դաշտի ստուգում
      param = GetVBObject("OUTERCODE", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
          
      If Not rekvNum = outerCode Then
              Log.Error("Արտաքին N դաշտի անհամապատասխանություն ")
      End If
        
      '  Ձևանմուշի N դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = templateN Then
          Log.Error("Ձևանմուշի N դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      '  Արժույթ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_2").VBObject("TDBMask").Text
           
      If Not Trim(rekvNum) = loanCurrency Then
          Log.Error("Արժույթ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      '  Մարման արժույթ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_3").VBObject("TDBMask").Text
      
      If Not Trim(rekvNum) = redCurr Then
          Log.Error("Մարման արժույթ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      '  Հաշվարկային հաշիվ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsTypeFolder_2").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = setAccount Then
          Log.Error("Հաճախորդ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      '  Տոկոսների վճարման հաշվարկ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsTypeFolder_3").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = insPayCalc Then
          Log.Error("Տոկոսների վճարման հաշվարկ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      '  Վարկի գումար դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber").Text
            
      If Not Trim(rekvNum) = loanMoney Then
          Log.Error("Վարկի գումար դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      '  Կնքման ամսաթիվ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBDate").Text
            
      If Not Trim(rekvNum) = dateSealing Then
          Log.Error("Կնքման ամսաթիվ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Հատկացման ամսաթիվ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBDate_2").Text
            
      If Not Trim(rekvNum) = dateGive Then
          Log.Error("Հատկացման ամսաթիվ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Մարման ժամկետ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBDate_3").Text
            
      If Not Trim(rekvNum) = dateRepay Then
          Log.Error("Մարման ժամկետ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      '  Մեկանաբանություն դաշտի ստուգում
      param = GetVBObject("COMMENT", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
            
      If Not Trim(rekvNum) = wComment Then
          Log.Error("Մեկանաբանություն դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      '  Գրասենյակ / Բաժին  դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_5").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = wOffice Then
          Log.Error("Գրասենյակ / Բաժին դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      '  Գրասենյակ / Բաժին  դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_6").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = wSection Then
          Log.Error("Գրասենյակ / Բաժին դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      '  Հասան-ն տիպ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_7").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = acType Then
          Log.Error("Հասան-ն տիպ դաշտի արժեքի անհամապատասխանություն ")
      End If
      ' ----------------------------------------------------------------------------------------------------------------------------------
      
      Set wMDIClient = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1)
      Set wTabStrip = wMDIClient.vbObject("frmASDocForm").vbObject("TabStrip")
      Set tabFrame = frmASDocForm.VBObject("TabFrame_3") 
      
      ' Անցում պարտքերի մարման ձև էջին
      wTabStrip.SelectedItem = wTabStrip.Tabs(3)
      
     ' Պարտքերի ավտոմատ մարում դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("CheckBox").Value
            
      If Not rekvNum = autoDebt Then
          Log.Error("Պարտքերի ավտոմատ մարումդաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Մարման ձև դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_8").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = debtPart Then
          Log.Error("Մարման ձև դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      '-----------------------------------------------------------------------------------------------------------------------------------
      
      ' Անցում գրաֆիկի լրացման էջ
      wTabStrip.SelectedItem = wTabStrip.Tabs(4)
      Set tabFrame = frmASDocForm.VBObject("TabFrame_4") 
      
     '  Ամսաթվերի լրացման ձև դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_11").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = dateFillType Then
          Log.Error("Ամսաթվերի լրացման ձև արժեքի անհամապատասխանություն ")
      End If 
      
      '  Մարումների սկիզբ ստուգում
      rekvNum =  tabFrame.VBObject("TDBDate_4").Text
            
      If Not Trim(rekvNum) = repBegin Then
          Log.Error("Մարումների սկիզբ արժեքի անհամապատասխանություն ")
      End If
      
      '  Մարումների վերջ ստուգում
      rekvNum =  tabFrame.VBObject("TDBDate_5").Text
            
      If Not Trim(rekvNum) = repEnd Then
          Log.Error("Մարումների վերջ արժեքի անհամապատասխանություն ")
      End If
      
      ' Առաջիկա մարման նվազագույն օ. ք. դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_2").Text
            
      If Not Trim(rekvNum) = minDays Then
          Log.Error("Առաջիկա մարման նվազագույն օ. ք. արժեքի անհամապատասխանություն ")
      End If
      
      ' Պարբերություն ամիս դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse").VBObject("TDBNumber1").Text
            
      If Not Trim(rekvNum) = parMonth Then
          Log.Error("Պարբերություն արժեքի անհամապատասխանություն ")
      End If
      
      ' Պարբերություն օր դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse").VBObject("TDBNumber2").Text
            
      If Not Trim(rekvNum) = parDay Then
          Log.Error("Ամիս արժեքի անհամապատասխանություն ")
      End If
      
      ' Շրջանցման ուղղություն դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_12").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = passOvDirect Then
          Log.Error("Շրջանցման ուղղություն արժեքի անհամապատասխանություն ")
      End If
      
      ' Ուղղ. օր դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_13").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = passOvType Then
          Log.Error("արժեքի անհամապատասխանություն ")
      End If
      
      ' Գումարների ամսաթվերի ընտրություն դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_14").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = sumDateFillType Then
          Log.Error("Գումարների ամսաթվերի ընտրություն արժեքի անհամապատասխանություն ")
      End If
      
      ' Գումարի մարումների սկիզբ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_3").Text
            
      If Not Trim(rekvNum) = marBeg Then
          Log.Error("Գումարի մարումների սկիզբ արժեքի անհամապատասխանություն ")
      End If
      
      ' Մարումների քանակ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_4").Text
            
      If Not Trim(rekvNum) = wRepayment Then
          Log.Error("Մարումների քանակ արժեքի անհամապատասխանություն ")
      End If
      
      ' Դադարի քանակ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_5").Text
            
      If Not Trim(rekvNum) = pauseCount Then
          Log.Error("Դադարի քանակ արժեքի անհամապատասխանություն ")
      End If
      
      ' Գումարների բաշխման ձև դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_15").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = sumFillType Then
          Log.Error("Գումարների բաշխման ձև արժեքի անհամապատասխանություն ")
      End If
      
      ' Մարման նվազագույն տոկոս դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_6").Text
            
      If Not Trim(rekvNum) = dbtMinPer Then
          Log.Error("Մարման նվազագույն տոկոս արժեքի անհամապատասխանություն ")
      End If
      
      ' Ոչ պակաս քան դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_7").Text
            
      If Not Trim(rekvNum) = summInDbt Then
          Log.Error("Ոչ պակաս քան արժեքի անհամապատասխանություն ")
      End If
      
      ' Կլորացման աստիճան դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_16").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = fillRound Then
          Log.Error(" Կլորացման աստիճան արժեքի անհամապատասխանություն ")
      End If
      
      '-----------------------------------------------------------------------------------------------------------------------------------
      ' Անցում Տոկոսներ էջին
      wTabStrip.SelectedItem = wTabStrip.Tabs(6)
      Set tabFrame = frmASDocForm.VBObject("TabFrame_6") 
      
      ' Օրացույցի հաշվարկման ձև դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_21").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = kindScale Then
          Log.Error(" Օրացույցի հաշվարկման ձև արժեքի անհամապատասխանություն ")
      End If
      
      ' Վարկի տոկոսադրույք դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_3").VBObject("TDBNumber1").Text
                         
      If Not Trim(rekvNum) = pCarg Then
          Log.Error("Վարկի տոկոսադրույք արժեքի անհամապատասխանություն ")
      End If
      
      ' Վարկի տոկոսադրույք բաժին դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_3").VBObject("TDBNumber2").Text
            
      If Not Trim(rekvNum) = pCargSect Then
          Log.Error("Վարկի տոկոսադրույք բաժին արժեքի անհամապատասխանություն ")
      End If
      
      ' Չօգտագործված մասի տոկոսադրույք դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_4").VBObject("TDBNumber1").Text
            
      If Not Trim(rekvNum) = unusePartRate Then
          Log.Error("Չօգտագործված մասի տոկոսադրույք արժեքի անհամապատասխանություն ")
      End If
      
      ' Չօգտագործված մասի տոկոսադրույք բաժին դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_4").VBObject("TDBNumber2").Text
            
      If Not Trim(rekvNum) = unusePartRateSect  Then
          Log.Error("Չօգտագործված մասի տոկոսադրույք արժեքի անհամապատասխանություն ")
      End If
      
      ' Սուբսիդավորման տոկոսադրույք դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_5").VBObject("TDBNumber1").Text
            
      If Not Trim(rekvNum) = pcGrant Then
          Log.Error("Սուբսիդավորման տոկոսադրույք արժեքի անհամապատասխանություն ")
      End If
      
      ' Սուբսիդավորման տոկոսադրույք բաժին դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_5").VBObject("TDBNumber2").Text
            
      If Not Trim(rekvNum) = pcGrantSect  Then
          Log.Error("Սուբսիդավորման տոկոսադրույք բաժին արժեքի անհամապատասխանություն ")
      End If
      
      ' Նվազեցման պարբերություն դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_8").Text
            
      If Not Trim(rekvNum) = redPeriod  Then
          Log.Error("Նվազեցման պարբերություն արժեքի անհամապատասխանություն ")
      End If
      
      ' Տոկոսների կլորացման աստիճան դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_22").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = fillRoundPr Then
          Log.Error("Տոկոսների կլորացման աստիճան արժեքի անհամապատասխանություն ")
      End If
      
      ' Շեղում դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_9").Text
            
      If Not Trim(rekvNum) = deviation Then
          Log.Error("Շեղում արժեքի անհամապատասխանություն ")
      End If
      
      ' Տոկոսադրույքի սահման դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_10").Text
            
      If Not Trim(rekvNum) = agrMin Then
          Log.Error("Տոկոսադրույքի սահման արժեքի անհամապատասխանություն ")
      End If
      
      ' Տոկոսադրույքի սահման մինչև դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_11").Text
            
      If Not Trim(rekvNum) = agrMax Then
          Log.Error("Տոկոսադրույքի սահման մինչև արժեքի անհամապատասխանություն ")
      End If
      
      ' Տոկոսները վճարվում են ժամանակաշրջանի սկզբում դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("CheckBox_10").Value
            
      If Not rekvNum = payPerGive Then
          Log.Error(" Տոկոսները վճարվում են ժամանակաշրջանի սկզբում արժեքի անհամապատասխանություն ")
      End If
      
      ' Մարումների քանակ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_12").Text
            
      If Not rekvNum = giveCount Then
          Log.Error("Մարումների քանակ արժեքի անհամապատասխանություն ")
      End If
      
      ' Պարբերաբար դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("CheckBox_11").Value
            
      If Not rekvNum = periodically Then
          Log.Error("Պարբերաբար արժեքի անհամապատասխանություն ")
      End If
      
      ' Արդյունավետ տոկոսադրույք դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_13").Text
            
      If Not Trim(rekvNum) = effRate Then
          Log.Error("Արդյունավետ տոկոսադրույք արժեքի անհամապատասխանություն ")
      End If
      
      ' Փաստացի տոկոսադրույք դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_14").Text
            
      If Not Trim(rekvNum) = actualRate Then
          Log.Error("Փաստացի տոկոսադրույք արժեքի անհամապատասխանություն ")
      End If
      
      ' Արդյունավետ տոկոս. ավտոմատ հաշվարկում դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("CheckBox_12").Value
            
      If Not rekvNum = autoLoanCount Then
          Log.Error("Արդյունավետ տոկոս. ավտոմատ հաշվարկում արժեքի անհամապատասխանություն ")
      End If
      
      ' ----------------------------------------------------------------------------------------------------------------------------------
      ' Անցում Տույժեր էջին
      wTabStrip.SelectedItem = wTabStrip.Tabs(7)
      Set tabFrame = frmASDocForm.VBObject("TabFrame_7") 
      
      ' Ժամկետանց գումարի տույժ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_7").VBObject("TDBNumber1").Text
            
      If Not Trim(rekvNum) = penMoney Then
          Log.Error("Ժամկետանց գումարի տույժ արժեքի անհամապատասխանություն ")
      End If
      
      ' Ժամկետանց գումարի տույժ բաժին դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_7").VBObject("TDBNumber2").Text
            
      If Not Trim(rekvNum) = penMoneySect  Then
          Log.Error(" արժեքի անհամապատասխանություն ")
      End If
      
      ' Ժամկետանց տոկոսի տույժ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_8").VBObject("TDBNumber1").Text
            
      If Not Trim(rekvNum) = penLoan Then
          Log.Error(" Ժամկետանց տոկոսի տույժ արժեքի անհամապատասխանություն ")
      End If
      
      ' Ժամկետանց տոկոսի տույժ բաժին դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_8").VBObject("TDBNumber2").Text
            
      If Not Trim(rekvNum) = penLoanSect Then
          Log.Error("Ժամկետանց տոկոսի տույժ բաժին արժեքի անհամապատասխանություն ")
      End If
      
      ' Ժամկետանց գումարի տոկոսի հաշվարկաման ձև դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_26").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = countPenMoney Then
          Log.Error("Ժամկետանց գումարի տոկոսի հաշվարկաման ձև արժեքի անհամապատասխանություն ")
      End If
      
      ' Ժամկետանց գումարի տոկոսադրույք (վնաս) դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_9").VBObject("TDBNumber1").Text
            
      If Not Trim(rekvNum) = penMoneyRate Then
          Log.Error("Ժամկետանց գումարի տոկոսադրույք (վնաս) արժեքի անհամապատասխանություն ")
      End If
      
      ' Ժամկետանց գումարի տոկոսադրույք (վնաս) բաժին դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_9").VBObject("TDBNumber2").Text
            
      If Not Trim(rekvNum) = penMoneyRateSect Then
          Log.Error("Ժամկետանց գումարի տոկոսադրույք (վնաս) բաժին արժեքի անհամապատասխանություն ")
      End If
      
      ' Հաշվարկել ԲՏՀԴ տոկոսագումար դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("CheckBox_13").Value
            
      If Not rekvNum = countBTHD Then
          Log.Error("Հաշվարկել ԲՏՀԴ տոկոսագումար արժեքի անհամապատասխանություն ")
      End If
      
      ' Դուրս գրված Ժամկետանց հաշվարկ  դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("CheckBox_14").Value
            
      If Not rekvNum = countBTHDSect Then
          Log.Error("Դուրս գրված Ժամկետանց հաշվարկ բաժին արժեքի անհամապատասխանություն ")
      End If
      
      ' ----------------------------------------------------------------------------------------------------------------------------------
      
      ' Անցում Լրացուցիչ էջին
      wTabStrip.SelectedItem = wTabStrip.Tabs(8)
      Set tabFrame = frmASDocForm.VBObject("TabFrame_8") 
      
      ' Ճյուղայնություն դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_27").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = richness Then
          Log.Error(" Ճյուղայնություն արժեքի անհամապատասխանություն ")
      End If
      
      ' Նպատակ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_29").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = Trim(purpose) Then
          Log.Error("Նպատակ արժեքի անհամապատասխանություն ")
      End If
      
      ' Ծրագիր դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_31").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = wProgram Then
          Log.Error("Ծրագիր արժեքի անհամապատասխանություն ")
      End If
      
      ' Երաշխավորություն դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_32").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = wGuarantee Then
          Log.Error("Երաշխավորություն արժեքի անհամապատասխանություն ")
      End If
      
      ' Երկիր դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_33").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = Trim(wCountry) Then
          Log.Error("Երկիր արժեքի անհամապատասխանություն ")
      End If
      
      ' Մարզ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_34").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = wState Then
          Log.Error("Մարզ արժեքի անհամապատասխանություն ")
      End If
      
      ' Մարզ(Նոր ՌՎ) դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_35").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = wStateNew  Then
          Log.Error("Մարզ(Նոր ՌՎ) արժեքի անհամապատասխանություն ")
      End If
      
      ' Նշում դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_36").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = wNote Then
          Log.Error("Նշում արժեքի անհամապատասխանություն ")
      End If
      
      ' Նշում 2  դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_37").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = wNote2 Then
          Log.Error("Նշում 2 արժեքի անհամապատասխանություն ")
      End If
      
      ' Նշում 3 դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_38").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = wNote3 Then
          Log.Error("Նշում 3 արժեքի անհամապատասխանություն ")
      End If
      
      ' Պայմ. թղթային N դաշտի ստուգում
      param = GetVBObject("PPRCODE", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame_8").VBObject(param).Text
            
      If Not Trim(rekvNum) = contPaperN Then
          Log.Error("Պայմ. թղթային N արժեքի անհամապատասխանություն ")
      End If
      
      ' Գործարքի ժամ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBTime").Text
            
      If Not Trim(rekvNum) = transTime Then
          Log.Error("Գործարքի ժամ արժեքի անհամապատասխանություն ")
      End If
      
      ' Սուբյեկտիվ դասակարգված դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("CheckBox_16").Value
            
      If Not rekvNum = subjecClass Then
          Log.Error("Սուբյեկտիվ դասակարգված արժեքի անհամապատասխանություն ")
      End If
      
      '-----------------------------------------------------------------------------------------------------------------------------------
      
      ' Անցում քաղվածք էջին
      wTabStrip.SelectedItem = wTabStrip.Tabs(9)
      Set tabFrame = frmASDocForm.VBObject("TabFrame_9") 
      
      ' Քաղվածքի տրամադրման ձև դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_39").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = excerptForm Then
          Log.Error("Քաղվածքի տրամադրման ձև արժեքի անհամապատասխանություն ")
      End If
      
      ' Սկզբի ամսաթիվ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBDate_13").Text
            
      If Not Trim(rekvNum) = Trim(stDate) Then
          Log.Error("Սկզբի ամսաթիվ արժեքի անհամապատասխանություն ")
      End If
      
      ' Պարբերություն ամիս դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_10").VBObject("TDBNumber1").Text
            
      If Not Trim(rekvNum) = extParagraph  Then
          Log.Error(" Պարբերություն ամիս արժեքի անհամապատասխանություն ")
      End If
      
      ' Պարբերություն - օր դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("AsCourse_10").VBObject("TDBNumber2").Text
            
      If Not Trim(rekvNum) = extParDay Then
          Log.Error("Պարբերություն - օր արժեքի անհամապատասխանություն ")
      End If
      
      ' Ժամանակահատվածի շեղում դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_15").Text
            
      If Not rekvNum = timeDev Then
          Log.Error("Ժամանակահատվածի շեղում արժեքի անհամապատասխանություն ")
      End If
      
      ' Ոչ աշխատանքային օրերի շրջանցում դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_41").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = avoidDays Then
          Log.Error("Ոչ աշխատանքային օրերի շրջանցում արժեքի անհամապատասխանություն ")
      End If
      
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close
      
End Sub

' contractN - Պայմանագրի N
' outerCode - Արտաքին N
' pladgeNumber - գրավի պայմանագի համարը
'  secType - Պայմանագրի տիպ
' secN - Պայմանագրի N 
'''' pledger - Գրավատու
' custName - Անվանում դաշտ
' gridCustName - Գրիդի Անվանում
' gridCheckbox - Լրացնել դաշտ
' plCurrency - Արժույթ դաշտ
' inSumma - Սկզբնական արժեք
' inCount - Սկզբնական քանակ դաշտ
' plComment - Մեկնաբանություն դաշտ
' dateSealing - Կնքման ամսաթիվ 
' plOffice - Գրասենյակ դաշտ
' plSect  - Բաժին դաշտ
' acsType - Հասան-ն տիպ դաշտ
' gridCustomer - Ապահ. պայմ. N
' gridName - Գրիդի Անվանում
' plSubject - Գրավի առարկա(կրճատ)
' plOther - Լրացուցիչ ինֆորմացիա դաշտ
' accBalances - Հաշվառել ետհաշվեկշռում դաշտ
' withPer - Ընդգրկել տոկոսները
' correlation - Հարաբերակցություն
' mortgage - Հիփոթեքային դաշտ
' existenceRes - Սահմանափակումների առկայություն
' riskWeight - Ռիսկի կշիռ դաշտ
' wNote - Նշում
' wNote2 - Նշում 2
' wNote3 - Նշում 3
' plACRA - Գրավի առարկա ACRA
' plNewRV - Գրավի առարկա (Նոր ՌՎ)
' pprCode - Պայմ. թղթային N դաշտ
' closeDate - Փակման ամսաթիվ
' Գրավի պայմանագրի տվյալների ստուգում
Sub MortgageContract (contractN, pladgeNumber, secType, secN, custName, gridCustName, gridCheckbox,_
                                          plCurrency, inSumma, inCount, plComment, dateSealing, plOffice, plSect, acsType, gridCustomer,_
                                          gridName, plSubject, plOther, accBalances, withPer, correlation, mortgage, existenceRes, riskWeight,_
                                          wNote, wNote2, wNote3, plACRA, plNewRV, pprCode, closeDate)
        
      Dim tdbgView, frmASDocForm, tabFrame, param , wMainForm

      Set wMainForm = Sys.Process("Asbank").VBObject("MainForm")
        
      ' Գործողություններ /  Բոլոր գործողություններ 
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Գործողություններ /  Խմբագրել
      ' Մուտք Պայմանագրի թղթապանակ
      Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_AgrFolder )
      
      BuiltIn.Delay(1000)
      If Not Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").Exists Then
              Log.Error("Պայմանագրի թղթապանակը չի բացվել")
              Exit Sub
      End If
      
      Set tdbgView = wMainForm.Window("MDIClient", "", 1).VBObject("frmPttel_2").VBObject("tdbgView")
      
      ' Անցնել տողերի վրայով
      Do until  tdbgView.EOF
             ' Ստուգում որ պայմանագրեր թղթապանակում փաստաթուղթը գոյություն ունի
             If  Trim(tdbgView.Columns.Item(0).Value) = Trim(pladgeNumber)  Then
                    ' Կատարել բոլոր գործողությունները
                    Call wMainForm.MainMenu.Click(c_AllActions)
                    ' Ջնջել գործողության կատարում
                    Call wMainForm.PopupMenu.Click(c_ToEdit)
                    Exit Do
             Else
                    ' Անցնել հաջորդ տող
                    tdbgView.MoveNext
             End If      
      Loop
        
      Set frmASDocForm = Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmASDocForm")
      If Not frmASDocForm.Exists  Then
          Log.Message("Գրավի պայմանագիր փաստաթուղթը չի բացվել")
          Exit Sub
      End If
      
      Set wTabStrip = wMDIClient.vbObject("frmASDocForm").vbObject("TabStrip")
      
      wTabStrip.SelectedItem = wTabStrip.Tabs(1)
      Set tabFrame = frmASDocForm.VBObject("TabFrame") 
      
      ' Պայմանագրի տիպ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = secType Then
          Log.Error("Պայմանագրի տիպ դաշտի արժեքի անհամապատասխանություն ")
      End If
        
      ' Պայմանագրի N դաշտի ստուգում
      param = GetVBObject("CODE", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
          
      If Not rekvNum = secN Then
              Log.Error("Պայմանագրի N անհամապատասխանություն ")
      End If
      
'      ' Գրավատու դաշտի ստուգում
'      rekvNum =  tabFrame.VBObject("AsTypeFolder").VBObject("TDBMask").Text
'            
'      If Not Trim(rekvNum) = pledger Then
'          Log.Error("Գրավատու դաշտի արժեքի անհամապատասխանություն ")
'      End If
      
      ' Անվանում դաշտի ստուգում
      param = GetVBObject("NAME", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
          
      If Not rekvNum = custName Then
              Log.Error(" Անվանում դաշտի անհամապատասխանություն ")
      End If
      
      ' Ապահ. պայմ. N դաշտի ստուգում
      If Not Trim(tabFrame.VBObject("DocGrid").Columns.Item(0))= contractN  Then
                  Log.Error("Ապահ. պայմ. N դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Գրիդի Անվանում դաշտի ստուգում
      If Not Trim(tabFrame.VBObject("DocGrid").Columns.Item(2))= gridCustName  Then
                  Log.Error("Գրիդի Անվանում դաշտի արժեքի անհամապատասխանություն ")
      End If
       
      ' "Լրացնել" դաշտի ստուգում
      If Not Trim(tabFrame.VBObject("DocGrid").Columns.Item(3))= gridCheckbox  Then
                 Log.Error("Լրացնել դաշտի արժեքի անհամապատասխանություն ")
      End If
       
      ' Արժույթ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_2").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = plCurrency Then
          Log.Error("Արժույթ դաշտի արժեքի անհամապատասխանություն ")
      End If
       
      ' Սկզբնական արժեք դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber").Text
            
      If Not Trim(rekvNum) = inSumma  Then
          Log.Error("Սկզբնական արժեք դաշտի արժեքի անհամապատասխանություն ")
      End If
       
       ' Սկզբնական քանակ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_2").Text
            
      If Not Trim(rekvNum) = inCount Then
          Log.Error("Սկզբնական քանակ դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Մեկնաբանություն դաշտի ստուգում
      param = GetVBObject("COMMENT", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame").VBObject(param).Text
            
      If Not Trim(rekvNum) = plComment Then
          Log.Error("Մեկնաբանություն դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Կնքման ամսաթիվ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBDate").Text
            
      If Not Trim(rekvNum) = dateSealing  Then
          Log.Error("Կնքման ամսաթիվ դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Գրասենյակ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_3").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = plOffice Then
          Log.Error("Գրասենյակ դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Բաժին դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_4").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = plSect Then
          Log.Error(" Բաժին դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Հասան-ն տիպ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_5").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = acsType Then
          Log.Error(" Հասան-ն տիպ  դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      '--------------------------------------------------------------------------------------------------------------------------------------------
      wTabStrip.SelectedItem = wTabStrip.Tabs(2)
      Set tabFrame = frmASDocForm.VBObject("TabFrame_2") 
      
      ' Ապահ. պայմ. N դաշտի ստուգում
      If Not Trim(tabFrame.VBObject("DocGrid_2").Columns.Item(0))= gridCustomer  Then
                  Log.Error("Ապահ. պայմ. N դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Գրիդի Անվանում դաշտի ստուգում
      If Not Trim(tabFrame.VBObject("DocGrid_2").Columns.Item(1))= gridName  Then
                  Log.Error("Գրիդի Անվանում դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      '--------------------------------------------------------------------------------------------------------------------------------------------
      wTabStrip.SelectedItem = wTabStrip.Tabs(3)
      Set tabFrame = frmASDocForm.VBObject("TabFrame_3") 
      
      ' Գրավի առարկա(կրճատ) դաշտի ստուգում
      param = GetVBObject("SHRTNAME", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not Trim(rekvNum) = plSubject Then
          Log.Error("Գրավի առարկա(կրճատ) դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Լրացուցիչ ինֆորմացիա դաշտի ստուգում
      param = GetVBObject("OTHER", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not Trim(rekvNum) = plOther Then
          Log.Error("Լրացուցիչ ինֆորմացիա դաշտի արժեքի անհամապատասխանություն ")
      End If
  
      ' Հաշվառել ետհաշվեկշռում դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("CheckBox").Value
            
      If Not Trim(rekvNum) = accBalances   Then
          Log.Error("Հաշվառել ետհաշվեկշռում դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Ընդգրկել տոկոսները դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("CheckBox_2").Value
            
      If Not Trim(rekvNum) = withPer  Then
          Log.Error("Ընդգրկել տոկոսները դաշտի արժեքի անհամապատասխանություն ")
      End If
       
      ' Հարաբերակցություն դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_3").Text
            
      If Not Trim(rekvNum) = correlation  Then
          Log.Error("Հարաբերակցություն դաշտի արժեքի անհամապատասխանություն ")
      End If
       
      ' Հիփոթեքային դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("CheckBox_3").Value
            
      If Not Trim(rekvNum) = mortgage Then
          Log.Error("Հիփոթեքային դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Սահմանափակումների առկայություն դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("CheckBox_4").Value
            
      If Not Trim(rekvNum) = existenceRes Then
          Log.Error("Սահմանափակումների առկայություն դաշտի արժեքի անհամապատասխանություն ")
      End If
       
      ' Ռիսկի կշիռ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBNumber_4").Text
            
      If Not Trim(rekvNum) = riskWeight  Then
          Log.Error("Ռիսկի կշիռ դաշտի արժեքի անհամապատասխանություն ")
      End If
       
      ' Նշում դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_6").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = wNote  Then
          Log.Error("Նշում դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Նշում 2 դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_7").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = wNote2  Then
          Log.Error("Նշում 2 դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Նշում 3 դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_8").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = wNote3  Then
          Log.Error("Նշում 3 դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Գրավի առարկա ACRA դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("ASTypeTree_9").VBObject("TDBMask").Text
            
      If Not Trim(rekvNum) = plACRA  Then
          Log.Error("Գրավի առարկա ACRA դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Գրավի առարկա (Նոր ՌՎ)  դաշտի ստուգում
      Call Rekvizit_Fill("Document", 3, "General", "MORTSUBJECT", plNewRV)   
      
      ' Պայմ. թղթային N դաշտի ստուգում
      param = GetVBObject("PPRCODE", frmASDocForm)
      rekvNum = frmASDocForm.vbObject("TabFrame_3").VBObject(param).Text
            
      If Not Trim(rekvNum) = pprCode Then
          Log.Error("Գրավի առարկա(կրճատ) դաշտի արժեքի անհամապատասխանություն ")
      End If
      
      ' Փակման ամսաթիվ դաշտի ստուգում
      rekvNum =  tabFrame.VBObject("TDBDate_2").Text
            
      If Not Trim(rekvNum) = Trim(closeDate)  Then
          Log.Error("Փակման ամսաթիվ դաշտի արժեքի անհամապատասխանություն ")
      End If
       
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      ' Փակել Պայմանագրի թղթապանակը 
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel_2").Close
      ' Փակել Պայմանագրեր/Վարկեր(Տեղաբաշխված) թղթապանակներ
      Sys.Process("Asbank").VBObject("MainForm").Window("MDIClient", "", 1).VBObject("frmPttel").Close
      
End Sub

' Ստուգում որ 2 գրավի պայմանագիր կա
Function CheckPladgeCount(pladgeNumber)

      Dim wMainForm, tdbgView, status
      status = False

      Set wMainForm = Sys.Process("Asbank").VBObject("MainForm")
        
      ' Գործողություններ /  Բոլոր գործողություններ 
      Call wMainForm.MainMenu.Click(c_AllActions)
      ' Գործողություններ /  Խմբագրել
      ' Մուտք Պայմանագրի թղթապանակ
      Call wMainForm.PopupMenu.Click(c_Folders & "|" & c_ClFolder )
      
      BuiltIn.Delay(1000)
      If Not wMainForm.Window("MDIClient", "", 1).VBObject("frmPttel_2").Exists Then
              Log.Error("Հաճախորդի թղթապանակը չի բացվել")
              Exit Function
      End If
      
      Set tdbgView = wMainForm.Window("MDIClient", "", 1).VBObject("frmPttel_2").VBObject("tdbgView")
      
       Do until  tdbgView.EOF
             ' Ստուգում որ պայմանագրեր թղթապանակում փաստաթուղթը գոյություն ունի
             If  Trim(tdbgView.Columns.Item(1).Value) = Trim(pladgeNumber)  Then
                  Log.Message("Գրավի պայմանագիրը գտնվել է")
                  status = True
                  Exit Do
             Else
                    ' Անցնել հաջորդ տող
                    tdbgView.MoveNext
             End If      
      Loop
      
      wMainForm.Window("MDIClient", "", 1).VBObject("frmPttel_2").Close
      CheckPladgeCount = status
End Function
