Option Explicit
'USEUNIT CashInput_Confirmphases_Library
'USEUNIT Subsystems_SQL_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Online_PaySys_Library
'USEUNIT Akreditiv_Library
'USEUNIT Library_Common
'USEUNIT DAHK_Libraray
'USEUNIT Repo_Library
'USEUNIT Constants
'USEUNIT Mortgage_Library

'Test Case ID 166607

Sub DAHK_Develop_Test()

    Dim startDATE,fDATE,date,SqlQuery,SqlQuery2,clientCode,blockSum,debt,acc,summ
    Dim blockID,currDate,docType,messType,numb,docNum, sqlCount
    Dim respSum,respSum1,respSumCurr,respSumFew,respActive,respFalse,docN
    Dim action,branch,confDate,confAcc,confSumm,inAccRex,exAccRex,paySys
    Dim response,respCur,respSumm,respCurr,respOther,opType, Doc_ISN,sDate,eDate
    Dim queryString, sql_Value, sql_isEqual, colNum
    
    sqlCount = "select * from DAHKATTACH where "
    SqlQuery = "SET IDENTITY_INSERT DAHKATTACH ON" 
    SqlQuery2 = "Insert into DAHKATTACH (fID,	fIMPDATE,	fMESSAGEID,	fDECISIONNUM,	fDECISIONDATE,	fDECISIONPLACE,	fDECISIONOWNER,	fINQUESTNUMBER,	fINQUESTID,	fINQUESTDATE,	fBRANCH,	fBRANCHSUB,	fDEBTORID" _
    			  &  "	, fDEBTORNAME,	fDEBTORPASSPORT, fDEBTORADDRESS,	fDEBTORTYPE,	fISSUM,	fBBLOCKOTHER,	fBBLOCKSUM1,	fBBLOCKCUR1,	fBBLOCKSUM2,	fBBLOCKCUR2,	fBBLOCKSUM3" _
    			  &  "	, fBBLOCKCUR3,	fBBLOCKSUM4,	fBBLOCKCUR4,	fBBLOCKSUM5,	fBBLOCKCUR5,	fBBLOCKSUM6,	fBBLOCKCUR6,	fBBLOCKSUM7,	fBBLOCKCUR7,	fORDERTEXT,	fCOURT,	fCLICODE" _
    			  &  "	,	fBLCODE,	fRESPONSEISN,	fEMPLOYERACC1,	fEMPLOYERACC2,	fEMPLOYERACC3,	fEMPLOYERACC4,	fEMPLOYERACC5,	fDUPLICATE,	fSSN,	fPROCESSED,	fBBLOCKPERCENT,	fRESPONSENUMBER" _
    			  &  "	,	fBBLOCKEDACCOUNTPERCENT,	fBBLOCKEDACCOUNT,	fBLCODEUNVER)" _
            &  "    Values ('1',	'2019-08-19 15:25:00',	'º01000008034',	'à00406-07727/18',	'2018-08-03 00:00:00',	'ù. ºñ¨³Ý'" _
            &  " , '²í³· Ñ³ñÏ³¹Çñ Ï³ï³ñáÕ ³ñ¹³ñ³¹³ïáõÃÛ³Ý Ï³åÇï³Ý ²ñÙ³Ý äáÕáëÛ³Ý',	'',	'00002363',	'2018-05-08 00:00:00'" _
            &  " , 'ì³ñã³Ï³Ý ³Ïï»ñáí µéÝ³·³ÝÓáõÙÝ»ñÇ µ³ÅÇÝ',	NULL,	'0000007790',	'ÎÏÏ ØÏáÛ³Ý',	'AK0123456',	'ù.ºñ¨³Ý, Î»ÝïñáÝ, Ø³ßïáó 21'"_	
            &  " , 1	,	1,	NULL,	'15000.00',	'AMD',	'0.00',	NULL,	'0.00',	NULL,	'10000.00',	'AMD',	'0.00',	NULL,	'0.00',	NULL"_
            &  " , '5000.00',	'AMD',	'Ø³ñÏ òáõÏÇ¨ ìÉ³¹Ç-Çó Ñû·áõï ´ÆÂÂ² ö´À-Ç µéÝ³·³ÝÓ»É 5000 ÐÐ ¹ñ³Ù','ì³ñã³Ï³Ý'	,'00000008' ,'  '"_
            &  " , ' ','900011474245',	'900011004521',	'900011556579',	'900011556611',	'900011556538',	NULL,	'0123456789',	0"_
            &  " , '0.00',	NULL,	NULL,	'0.00',	NULL)" 

    startDATE = "20010101"
    fDATE = "20250101"
    date = "190819"   
    messType = "01" 
    blockID = "º01000008034" 
    
    'Test StartUp start
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
    Call Create_Connection()
    'Ներմուծել "Արգելանք" տեսակի հաղորդագորւթյունը
    Call Execute_SLQ_Query(SqlQuery)
    Call Execute_SLQ_Query(SqlQuery2)    
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','443871031','2020-01-01 00:00:00' ) as Acc"
        sql_Value = -10000000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If           

    Call ChangeWorkspace(c_DAHK)
    
     'Մշակել ներմուշված հաղորդագորությունները 
    Call wTreeView.DblClickItem("|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|Øß³Ï»É Ý»ñÙáõÍí³Í Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñÁ")
    Call Rekvizit_Fill("Dialog",1,"General","TYPE", messType)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Սեղմել OK կոճակը
    Call ClickCmdButton(5, "OK")
    
    'Մուտք գործել "Ընդունված հաղորդագրություններ" թղթապանակ
    If Not Enter_Recieved_Messages(date,date,messType,blockID) Then
            Log.Error("Փաստաթուղթը չի գտնվել")
            Exit Sub
    End If
    
    'Ստուգել որ հաճախորդը ճիշտ ներմուծված լինի
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fCLICODE")
    If Not Trim(wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(colNum).Value) = Trim("00000008") Then
            Log.Error("Հաճախորդի կոդը սխալ է")
            Exit Sub
    End If
    
    'Փոխել Հաճախորդի կոդը
    clientCode = "00034852"
    Call Change_Client(clientCode)
    BuiltIn.Delay(2000)
    'Ստուգել որ հաճախորդի կոդը փոխվել է
    If Not Trim(wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(colNum).Value) = clientCode Then
            Log.Error("Հաճախորդի կոդը չի փոխվել")
            Exit Sub
    End If
    
    'Կատարել Գումարների արգելադրում
    blockSum = "15,000.00"
    debt = "0.00"
    Call Blocking_Money(blockSum,debt)    
    
    'Ստուգել Հաշվի ստորին սահմանը
    acc = "00000113032  ²ñÅ.- 000  îÇå- 01  Ð/Ð³ßÇí- 3032000   ²Ýí³ÝáõÙ-ý²àôêî"
    summ = "15000"
    Call Check_Account_Low_Border(acc,summ)
    
    'Փակել պտըտելը
    Call Close_Pttel("frmPttel")
    
    currDate  = aqConvert.DateTimeToFormatStr(aqDateTime.Today(), "%d%m%y")
    Log.Message(currDate)
    
    'Մուտք գործել "Գումաների արգելադրումներ" թղթապանակ
    If Not Enter_Money_Blockings(currDate,currDate,blockID) Then
       Log.Error("Փաստաթուղթը չի գտնվել 'Գումարների արգելադրումներ' թղթապանակում")
       Exit Sub
    End If

    'Պարտքի ապաակտիվացում
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_DebtDeactivation)
    Call ClickCmdButton(5, "²Ûá")
  
    'Ստուգել որ "Ապաակտիվացված է" սյան արժեքը լինի -1(Նշիչը լինի դրված)
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fDEBTDEACT")
    If Not Trim(wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(colNum).Value) = "-1" Then
            Log.Error("Ապաակտիվացումը չի կատարվել")
            Exit Sub
    End If
    
    'Պարտքի ակտիվացում
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_DebtActivation)
    Call ClickCmdButton(5, "²Ûá")
    
    'Ստուգել որ "Ապաակտիվացված է" սյան արժեքը լինի 0(Նշիչը չլինի դրված)
    If Not Trim(wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(colNum).Value) = "0" Then
            Log.Error("Ակտիվացումը չի կատարվել")
            Exit Sub
    End If
    
    Call Close_Pttel("frmPttel")
    
    'Մուտք գործել "Ընդունված հաղորդագրություններ" թղթապանակ
    If Not Enter_Recieved_Messages(date,date,messType,blockID) Then
            Log.Error("Փաստաթուղթը չի գտնվել")
            Exit Sub
    End If
    
    'Ստեղծել պատասխան հաղորդագորւթյուն
    respSumFew = 0
    respActive = 0
    Call Create_Message(summ,respSum1,respSumCurr,respSumFew,respActive,respFalse)
    BuiltIn.Delay(3000)
    
    'Դիտել պատասխանները
    Call View_Answers(blockID)     
    Call Close_Pttel("frmPttel")
    
    'Ուղարկել ստեղծված հաղորդագրությունը "Ուղարկված" թղթապանակ
    Call Send_To_Sent(currDate,blockID) 
      
    BuiltIn.Delay(3000) 
    'Ստուգել հաղորդագրության առկայությունը "Ուղարկված" թղթապանակում
    If Not Check_In_Sent(currDate,blockID) Then
           Log.Error("Հաղորդագրության չի գտնվել 'Ուղարկված' թղթապանակում")
    End If
           
             
'----------------------------------------Բռնագանձում---------------------------------------------------------------------

    SqlQuery2 = "insert into DAHKCATCH (fIMPDATE,	fMESSAGEID,	fDECISIONNUM,	fDECISIONDATE,	fDECISIONPLACE,	fDECISIONOWNER," _
                & "fINQUESTNUMBER,	fINQUESTDATE,	fBRANCH,	fBRANCHSUB,	fTREASURYNAME,	fTREASURYCODE,	fBRECOVERSUM1,	fBRECOVERCUR1," _
                &	"fBRECOVERSUM2,	fBRECOVERCUR2,	fBRECOVERSUM3,	fBRECOVERCUR3,	fBRECOVERSUM4,	fBRECOVERCUR4,	fBBLOCKCANCEL,	fRESPONSEISN,"_
                &	"fEMPLOYERACC1,	fEMPLOYERACC2,	fEMPLOYERACC3,	fEMPLOYERACC4,	fEMPLOYERACC5,	fPROCESSED,	fINQUESTID,	fBRECOVERPERCENT,"_
                & "fBRECOVEREDACCOUNT,	fBRECOVEREDACCOUNTPERCENT)"_
                & "Values ('2019-03-30 11:36:00',	'º02000008034',	'à00166-00002/11',	'2019-03-30 00:00:00',	'ù. ºñ¨³Ý'," _
                &	"'²í³· Ñ³ñÏ³¹Çñ Ï³ï³ñáÕ ³ñ¹³ñ³¹³ïáõÃÛ³Ý ³í. É»Ûï»Ý³Ýï Î³ñ»Ý Ê³Ý½³¹Û³Ý',	'01/03-02753/10',	'2019-11-16 00:00:00'"_
		            & ",	'Ø³É³ÃÇ³-ê»µ³ëïÇ³ µ³ÅÇÝ',	NULL,	'ºñ¨³ÝÇ ÃÇí 1 ·³ÝÓ³å»ï³Ï³Ý µ³ÅÇÝ',	'900013288015',	'33080.00',	'AMD',	'33080.00',	"_
                & "'AMD',	'0.00',	'AMD',	'33080.00',	'AMD',	0,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	0,	NULL,	NULL,	NULL,	NULL)"

    'Ներմուծել "Բռնագանձում" տեսակի հաղորդագրությունը
    Call Execute_SLQ_Query(SqlQuery2)     
        
     'Մշակել ներմուծված հաղորդագրությունները
    messType = "02"
    Call wTreeView.DblClickItem("|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|Øß³Ï»É Ý»ñÙáõÍí³Í Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñÁ")
    Call Rekvizit_Fill("Dialog",1,"General","TYPE", messType)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Սեղմել OK կոճակը
    Call ClickCmdButton(5, "OK")
    
    date = "300319"
    messType = "02"
    blockID = "º02000008034"
    'Մուտք գործել "Ընդունված հաղորդագրություններ" թղթապանակ
    Call Enter_Recieved_Messages(date,date,messType,blockID)
    
    'Ստուգել Հաճախորդի կոդ դաշտը
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fCLICODE")
    If Not Trim(wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(colNum).Value) = clientCode Then
            Log.Error("Հաճախորդի կոդը չի փոխվել DAHKCATCH-ում")
            Exit Sub
    End If
    
    'Մասնակի բռնագանձում
    action = c_PartConfiscation
    confAcc = "00000113032"
    confSumm = "10000"
    Call Confiscation (action,branch,currDate,docNum,confAcc,confSumm,inAccRex,exAccRex,paySys)
  
    Call Close_Pttel("frmPttel")
    
    'Անցում կատարել "Հաճախորդի սպասարկում և դրամարկղ" ԱՇՏ
    Call ChangeWorkspace(c_CustomerService)
    Log.Message(docNum)
    'Ստուոգել "Խմբային հիշարարա օրդեր" տեսակի փաստաթղթի առկայությունը "Աշխատանքային փաստաթղթեր" թղթապանակում
    If Not Online_PaySys_Check_Doc_In_Workpapers(docNum, currDate, currDate) Then
            Log.Error("Խմբային հիշարարա օրդեր փաստաթուղթը չի գտնվել 'Աշխատանքային փաստաթղթեր'-ում")
            Exit Sub
    End If
    'Հաշվառել փաստաթուղթը
    Call Register_Payment()
    Call Close_Pttel("frmPttel")
    
    'Ստուգել "Խմբային հիշարարա օրդեր" տեսակի փաստաթղթի առկայությունը "Հաշվառված վճարային փաստաթղթեր" թղթապանակում 
    Call Online_PaySys_Check_Doc_In_Registered_Payment_Documents(docNum, currDate, currDate)
    Call Close_Pttel("frmPttel")
    
    'Ստոգել "Վճարման հանձնարարգիր" տեսակի փաստաթղթի առկայությունը "Աշխատանքային փաստաթղթեր" թղթապանակում
    docN = aqConvert.StrToInt(docNum) + 1
    If Not Online_PaySys_Check_Doc_In_Workpapers("000" & docN, currDate, currDate) Then
            Log.Error("Վճարման հանձնարարգիրը չի գտնվել 'Աշխատանքային փաստաթղթեր'-ում")
            Exit Sub
    End If 
       
    'Ուղարկել հաստատման փաստաթուղթը
    Call Repo_Send_To_Verify()
    'Մուտք գործել "Հաստատող I" ԱՇՏ
    Call ChangeWorkspace(c_Verifier1)
    'Ստոգել "Վճարման հանձնարարգիր" տեսակի փաստաթղթի առկայությունը "Հաստատվող վճարային փաստաթղթեր" թղթապանակում
    Call Online_PaySys_Check_Doc_In_Verifier("000" & docN, currDate, currDate)
    'Վավերացնել փաստաթուղթը
    Call Validate_Doc()
    Call Close_Pttel("frmPttel")
    'Անցում կատարել "Հաճախորդի սպասարկում և դրամարկղ" ԱՇՏ
    Call ChangeWorkspace(c_CustomerService)
    'Ստուգել "Վճարման հանձնարարգիր" տեսակի փաստաթղթի առկայությունը "Հաշվառված վճարային փաստաթղթեր" թղթապանակում 
    Call Online_PaySys_Check_Doc_In_Registered_Payment_Documents("000" & docN, currDate, currDate)
    Call Close_Pttel("frmPttel")
    
        'Կատարում ենք SQL ստուգում
        queryString = "SELECT fCURREM FROM HIREST WHERE fTYPE='01' and fOBJECT='443871031' and fDATE = dbo.asf_GetEndDate()"
        sql_Value = -9999990000.00 
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
        
    'Անցում կատարել "ԴԱՀԿ հաղ. մշակման ԱՇՏ" 
    Call ChangeWorkspace(c_DAHK)
    
    'Մուտք գործել "Ընդունված հաղորդագրություններ" թղթապանակ
    Call Enter_Recieved_Messages(date,date,messType,blockID)

   'Դիտել պատասխանները
    Call View_Answers(blockID)
    Call Close_Pttel("frmPttel")
    
    'Ուղարկել ստեղծված հաղորդագրությունը "Ուղարկված" թղթապանակ
    Call Send_To_Sent(currDate,blockID) 
    
    BuiltIn.Delay(1000)
    'Ստուգել հաղորդագրության առկայությունը"Ուղարկված" թղթապանակում  
    If Not Check_In_Sent(currDate,blockID) Then
          Log.Error("Հաղորդագրությանը չի գտնվել 'Ուղարկված' թղթապանակում")
    End If
      
    'Մուտք գործել "Ընդունված հաղորդագրություններ" թղթապանակ
    Call Enter_Recieved_Messages(date,date,messType,blockID)
    
   'Ամբողջական բռնագանձում
    action = c_CompConfiscation
    confSumm = "4000"
    Call Confiscation (action,branch,currDate,docNum,confAcc,confSumm,inAccRex,exAccRex,paySys)    
    Call Close_Pttel("frmPttel")
    
    'Անցում կատարել "Հաճախորդի սպասարկում և դրամարկղ" ԱՇՏ
    Call ChangeWorkspace(c_CustomerService)
    Log.Message(docNum)
    
    'Ստուոգել "Խմբային հիշարար օրդեր" տեսակի փաստաթղթի առկայությունը "Աշխատանքային փաստաթղթեր" թղթապանակում
    If Not Online_PaySys_Check_Doc_In_Workpapers(docNum, currDate, currDate) Then
            Log.Error("Խմբային հիշարար օրդեր փաստաթղթը չի գտնվել 'Աշխատանքային փաստաթղթեր' թղթապանակում")
            Exit Sub
    End If
    
    'Հաշվառել փաստաթուղթը
    Call Register_Payment()
    Call Close_Pttel("frmPttel")
    
    'Ստուգել "Խմբային հիշարար օրդեր" տեսակի փաստաթղթի առկայությունը "Հաշվառված վճարային փաստաթղթեր" թղթապանակում 
    Call Online_PaySys_Check_Doc_In_Registered_Payment_Documents("000" & docN, currDate, currDate)
    Call Close_Pttel("frmPttel")
    
    docN = aqConvert.StrToInt(docNum) + 1
    'Ստոգել "Վճարման հանձնարարգիր" տեսակի փաստաթղթի առկայությունը "Աշխատանքային փաստաթղթեր" թղթապանակում
    If Not Online_PaySys_Check_Doc_In_Workpapers("000" & docN, currDate, currDate) Then
            Log.Error("Վճարման հանձնարարգիրը չի գտնվել 'Աշխատանքային փաստաթղթեր' թղթապանակում")
            Exit Sub
    End If
    
    'Ուղարկել հաստատման 
    Call Repo_Send_To_Verify()
    'Մուտք գործել "Հաստատող I" ԱՇՏ
    Call ChangeWorkspace(c_Verifier1)
    'Ստոգել "Վճարման հանձնարարգիր" տեսակի փաստաթղթի առկայությունը "Հաստատվող վճարային փաստաթղթեր" թղթապանակում
    Call Online_PaySys_Check_Doc_In_Verifier("000" & docN, currDate, currDate)
    'Վավերացնել փաստաթուղթը
    Call Validate_Doc()
    Call Close_Pttel("frmPttel")
    'Անցում կատարել "Հաճախորդի սպասարկում և դրամարկղ" ԱՇՏ
    Call ChangeWorkspace(c_CustomerService)
    'Վավերացնել փաստաթուղթը
    Call Online_PaySys_Check_Doc_In_Registered_Payment_Documents("000" & docN, currDate, currDate)
    Call Close_Pttel("frmPttel")
    
        'Կատարում ենք SQL ստուգում
        queryString = "SELECT fCURREM FROM HIREST WHERE fTYPE='01' and fOBJECT='443871031' and fDATE = dbo.asf_GetEndDate()"
        sql_Value = -9999966920.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
   
'-------------------------------Արգելանքից ազատում--------------------------------------------------------------

    
    SqlQuery2 = "Insert into DAHKFREEATTACH (fIMPDATE,	fMESSAGEID,	fDECISIONNUM,	fDECISIONDATE,	fDECISIONPLACE," _
                 & "fDECISIONOWNER,	fINQUESTNUMBER,	fINQUESTDATE,	fBRANCH,	fBRANCHSUB,	fBDISMISSPAR,	fBDISMISSTYPE," _
						     & "fBDISMISSSUM1,	fBDISMISSCUR1,	fBDISMISSSUM2,	fBDISMISSCUR2,	fBDISMISSSUM3,	fBDISMISSCUR3,"_
                 & "fBDISMISSSUM4,	fBDISMISSCUR4,	fBDISMISSOTHER,	fBDISMISSNEXT,	fRESPONSEISN,	fPROCESSED,	fINQUESTID)"_
                 & "Values  ('2019-07-01 09:59:00',	'º03000008034',	'à00166-00011/11',	'2019-06-30 00:00:00',"_
                 & "'ù. ºñ¨³Ý',	'Ý Î³ñ»Ý Ê³Ý½³¹Û³Ý                                       Î. Ê³Ý½³¹Û³Ý                  1',"_
		             & "'01/03-02753/10',	'2019-11-16 00:00:00', NULL,	'²í³· Ñ³ñÏ³¹Çñ Ï³ï³ñáÕ ³ñ¹³ñ³¹³ïáõÃÛ³Ý Ï³åÇï³',	3,"_
                 & "1,	'0.00',	NULL,	'0.00',	NULL,'0.00',	NULL,	'0.00',	NULL,	1,	1,	Null,	0,	NULL)"_
   
    'Ներմուծել "Բռնագանձում" տեսակի հաղորդագրությունը
    Call Execute_SLQ_Query(SqlQuery2) 

    'Անցում կատարել "ԴԱՀԿ հաղ. մշակման ԱՇՏ" 
    Call ChangeWorkspace(c_DAHK)    
        
     'Մշակել ներմուշված հաղորդագրությունը
    messType = "03"
    Call wTreeView.DblClickItem("|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|Øß³Ï»É Ý»ñÙáõÍí³Í Ñ³Õáñ¹³·ñáõÃÛáõÝÝ»ñÁ")
    Call Rekvizit_Fill("Dialog",1,"General","TYPE", messType)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    'Սեղմել OK կոճակը
    Call ClickCmdButton(5, "OK")
    
    date = "01/07/19"
    messType = "03"
    blockID  = "º03000008034"
    'Մուտք գործել "Ընդունված հաղորդագրություններ" թղթապանակ
    If Not Enter_Recieved_Messages(date,date,messType,blockID) Then
            Log.Error("Փաստաթուղթը չի գտնվել")
            Exit Sub
    End If
    'Ստուգել Հաճախորդի կոդ դաշտը
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fCLICODE")
    If Not Trim(wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(colNum).Value) = clientCode Then
            Log.Error("Հաճախորդի կոդը սխալ է")
            Exit Sub
    End If

    'Արգելանքից ազատում
    acc = "²ÕµÛáõñ` ¸²ÐÎ  ì³ñáõÛÃÇ ID - 00023198  Ü»ñÙáõÍÙ³Ý ³Ùë³ÃÇí - 22/01/18  [ö³Ïí³Í]"
    Call Funds_Release(acc)
    
    'Մշակել հաղորդագրություն Արգելանքից ազատում տեսակի'
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_Develop)    
     'Սեղմել OK կոճակը
    Call ClickCmdButton(5, "OK") 
    BuiltIn.Delay(3000)
    
    'Դիտել պատասխան հաղորդագորւթյունները
    Call View_Answers(blockID) 
    Call Close_Pttel("frmPttel")
    'Ուղարկել ստեղծված հաղորդագրությունը "Ուղարկված" թղթապանակ
    Call Send_To_Sent(currDate,blockID)
     
    'Ստուգել հաղորդագրության առկայությունը "Ուղարկված" 
    If Not Check_In_Sent(currDate,blockID) Then
          Log.Error("Հաղորդագրությունը չի գտնվել 'Ուղարկված' թղթապանակում")
    End If
    
    Call ChangeWorkspace(c_CustomerService)
    'Ջնջել Հաշվառված վճարային փաստաթղթեր թղթապանակի փաստաթղթերը
    Call DeletePayingDoc(currDate, opType, Doc_ISN)
    
    'Անցում կատարել "ԴԱՀԿ հաղ. մշակման ԱՇՏ" 
    Call ChangeWorkspace(c_DAHK)

    'Անցում կատարել Ընդունված հաղորդագորւթյուններ թղթապանակ
    Call wTreeView.DblClickItem("|¸²ÐÎ Ñ³Õ. Ùß³ÏÙ³Ý ²Þî|¶áõÙ³ñÝ»ñÇ ³ñ·»É³¹ñáõÙÝ»ñ")
    'Լրացնել Ժամանակահատվածի Սկիզբ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","SDATE","![End]" & "[Del]" & currDate)
    'Լրացնել Ժամանակահատվածի Վերջ դաշտը
    Call Rekvizit_Fill("Dialog",1,"General","EDATE","![End]" & "[Del]" & currDate)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    BuiltIn.Delay(1000)
    
    'Ջնջել գումարների արգելադրում փաստաթուղթը
    Call wMainForm.MainMenu.Click(c_Opers & "|" & c_Delete)
    Sys.Process("Asbank").VBObject("frmDeleteDoc").VBObject("YesButton").ClickButton
    Call Close_Pttel("frmPttel")
    
    'Ջնջել Արգելանքից ազատման տեսակի փաստաթղթի համար ստեղծված հաղղորդագորությունը
    Call Detele_Sent_Message(date,date,messType)
    
    'Ջնջել Բռնագանձում տեսակի փաստաթղթի համար ստեղծված հաղղորդագորությունը
    sdate = "300319"
    messType = "02"
    Call Detele_Sent_Message(sdate,sdate,messType)
    
    'Ջնջել Բռնագանձում տեսակի փաստաթղթի համար ստեղծված հաղղորդագորությունը
    sdate = "19/08/19"
    messType = "01"
    Call Detele_Sent_Message(sdate,sdate,messType)
    
        'Կատարում ենք SQL ստուգում
        queryString = "select dbo.asfb_GetRemHI('01','443871031','2020-01-01 00:00:00' ) as Acc"
        sql_Value = -10000000000.00
        colNum = 0
        sql_isEqual = CheckDB_Value(queryString, sql_Value, colNum)
        If Not sql_isEqual Then
          Log.Error("Querystring = " & queryString & ":  Expected result = " & sql_Value)
        End If
   
        
    'Ջնջել ներմուծված հաղորդագորությունները
    SqlQuery2 = " Delete from DAHKFREEATTACH "_
              & " Delete from DAHKCATCH "_
              & " Delete from DAHKATTACH " 
              
    Call Execute_SLQ_Query(SqlQuery2) 
    
    Call Close_AsBank()   
    
End Sub