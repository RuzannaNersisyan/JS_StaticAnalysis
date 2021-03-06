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

'Test Case ID 166612

Sub DAHK_Not_Existing_Client_Test()
  
    Dim startDATE, fDATE, date, SqlQuery, SqlQuery2, BLcliCode, blockID, messType, colNum
    
'-------------------------- Արգելանք -----------------------------------------------------------------------------------------------------------------   
    SqlQuery = "SET IDENTITY_INSERT DAHKATTACH ON" 
    SqlQuery2 = "insert into DAHKATTACH (fID,	fIMPDATE,	fMESSAGEID,	fDECISIONNUM,	fDECISIONDATE,	fDECISIONPLACE," _
                & "fDECISIONOWNER,	fINQUESTNUMBER,	fINQUESTID,	fINQUESTDATE,	fBRANCH,	fBRANCHSUB,	fDEBTORID" _
		            & ",fDEBTORNAME,	fDEBTORPASSPORT,	fDEBTORADDRESS,	fDEBTORTYPE,	fISSUM,	fBBLOCKOTHER,	fBBLOCKSUM1,	" _
                & "fBBLOCKCUR1,	fBBLOCKSUM2,	fBBLOCKCUR2,	fBBLOCKSUM3,	fBBLOCKCUR3,	fBBLOCKSUM4,	fBBLOCKCUR4,	" _
                & "fBBLOCKSUM5,	fBBLOCKCUR5,	fBBLOCKSUM6,	fBBLOCKCUR6,	fBBLOCKSUM7,	fBBLOCKCUR7,	fORDERTEXT, fCOURT,	fCLICODE,	fBLCODE,"_
                & "fRESPONSEISN,	fEMPLOYERACC1,	fEMPLOYERACC2,	fEMPLOYERACC3,	fEMPLOYERACC4,	fEMPLOYERACC5,	fDUPLICATE,	fSSN,	" _
                & "fPROCESSED,	fBBLOCKPERCENT,	fRESPONSENUMBER,	fBBLOCKEDACCOUNTPERCENT,	fBBLOCKEDACCOUNT,	fBLCODEUNVER)" _
                & "Values ('1',	'2018-03-25 00:00:00',	'º01000142262',	'à00118-00002/10',	'2018-09-03 00:00:00',	" _
                & "'ù. ºñ¨³Ý',	'²í³· Ñ³ñÏ³¹Çñ Ï³ï³ñáÕ ³ñ¹³ñ³¹³ïáõÃÛ³Ý Ï³åÇï³Ý ²ñÙ³Ý äáÕáëÛ³Ý',	'01/06-00522/10'," _
		            & "'00015456',	'2010-09-02 00:00:00',	'²ç³÷ÝÛ³Ï ¨ ¸³íÃ³ß»Ý µ³ÅÇÝ',	NULL,	'0000025001',	'¶³·ÇÏ ¶ñÇ·áñÛ³Ý ÐáíÑ³ÝÝ»ëÇ'," _
                & "	'AE0271384',	'ù.ºñ¨³Ý, ²ç³÷ÝÛ³Ï, ¾ëïáÝ³Ï³Ý 10ß.13µÝ.',	1,	1,	NULL,	'65000.00',	'AMD',	'0.00',	NULL,	" _
                & " '0.00',	NULL,	'60000.00',	'AMD',	'0.00',	NULL,	'0.00',	NULL,	'5000.00',	'AMD',	'µéÝ³·³ÝÓ»É 60000 ¹ñ³Ù',	'ì³ñã³Ï³Ý'," _
		            & "'  ' ,'  ','  ',NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	NULL,	NULL)" 

    startDATE = "20100101"
    fDATE = "20250101"
    date = "250318"   
    messType = "01" 
    blockID = "º01000142262" 
    
    'Test StartUp start
    Call Initialize_AsBank("bank", startDATE, fDATE)
    
    Call Create_Connection()
    'Ներմուծել "Արգելանք" տեսակի հաղորդագորւթյունը
    Call Execute_SLQ_Query(SqlQuery)
    Call Execute_SLQ_Query(SqlQuery2)   
   
    'Անցում կատարել "ԴԱՀԿ հաղ. մշակման ԱՇՏ"
    Call ChangeWorkspace(c_DAHK)
    
    'Մուտք գործել "Ընդունված հաղորդագրություններ" թղթապանակ
    If Not Enter_Recieved_Messages(date,date,messType,blockID) Then
            Log.Error("Փաստաթուղթը չի գտնվել")
            Exit Sub
    End If
    
    'Կատարել "Գրանցել Սր ցուցակում" գործողությունը 
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_RegToBlackList)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(5, "²Ûá")
    'Սև ցուցակի N դաշտի արժեքի ստացում
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fBLCODE")
    BLCliCode = wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(colNum).Value
    Call Close_Pttel("frmPttel")
    
    'Անցում կատարել "Սև ցուցակ վարողի ԱՇՏ"
    Call ChangeWorkspace(c_BLKeeper) 
    
    'Ստուգել հաճախորդի առկայությունը "Սև ցուցակ" թղթապանակում
    If Not Check_In_Black_List_Folder(BLCliCode) Then 
          Log.Error("Հաճախորդը առկա չէ 'Սև ցուցակ' թղթապանակում")
    End If

'------------------------------------------Բռնագանձում------------------------------------------------------------------------------------------------
    SqlQuery2 = "Insert into DAHKCATCH (fIMPDATE,	fMESSAGEID,	fDECISIONNUM,	fDECISIONDATE,	fDECISIONPLACE,	fDECISIONOWNER," _
                & "fINQUESTNUMBER,	fINQUESTDATE,	fBRANCH,	fBRANCHSUB,	fTREASURYNAME,	fTREASURYCODE,	fBRECOVERSUM1,"_
			          & "fBRECOVERCUR1,	fBRECOVERSUM2,	fBRECOVERCUR2,	fBRECOVERSUM3,	fBRECOVERCUR3,	fBRECOVERSUM4,	fBRECOVERCUR4,"_
                & "fBBLOCKCANCEL,	fRESPONSEISN,	fEMPLOYERACC1,	fEMPLOYERACC2,	fEMPLOYERACC3,	fEMPLOYERACC4,	fEMPLOYERACC5,"_
                & "fPROCESSED,	fINQUESTID,	fBRECOVERPERCENT,	fBRECOVEREDACCOUNT,	fBRECOVEREDACCOUNTPERCENT)"_
                & "Values ('2018-09-14 14:53:00',	'º02000142262',	'à00118-00005/10',	'2010-09-14 00:00:00',	'ù. ºñ¨³Ý',"_
                & "'²í³· Ñ³ñÏ³¹Çñ Ï³ï³ñáÕ ³ñ¹³ñ³¹³ïáõÃÛ³Ý Ï³åÇï³Ý ²ñÙ³Ý äáÕáëÛ³Ý',	'01/06-00522/10',	'2018-09-02 00:00:00',"_
		            & "'²ç³÷ÝÛ³Ï ¨ ¸³íÃ³ß»Ý µ³ÅÇÝ',	NULL,	'ºñ¨³ÝÇ ÃÇí 1 ·³ÝÓ³å»ï³Ï³Ý µ³ÅÇÝ',	'900013288015',	'16154.00',	'AMD','16154.00',"_
                & "'AMD',	'0.00',	'AMD',	'65000.00',	'AMD',	0,	Null ,	NULL,	NULL,	NULL,	NULL,	NULL,	1,	NULL,	NULL,	NULL,	NULL)" 

    Call Execute_SLQ_Query(SqlQuery2) 
    
    'Անցում կատարել"ԴԱՀԿ հաղ. մշակման ԱՇՏ"
    Call ChangeWorkspace(c_DAHK)
    
    'Մուտք գործել "Ընդունված հաղորդագրություններ" թղթապանակ
    date = "140918"
    messType = "02"
    blockID = "º02000142262"
    If Not Enter_Recieved_Messages(date,date,messType,blockID) Then
            Log.Error("Փաստաթուղթը չի գտնվել")
            Exit Sub
    End If
    
    'Ստուգել որ Բռնագանձում տեսակի հաղորդագրության համար լրացված լինի Սև ցուցակի N  դաշտը
    colNum =	wMDIClient.VBObject("frmPttel").GetColumnIndex("fBLCODE")
    If Not wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(colNum).Value = BLCliCode Then
            Log.Error("Հաղորդագրության համար լրացված չէ Սև ցուցակի N  դաշտը")
    End If
    
    'Կատարել "Խմբագրել "Սև ցուցակի" հաղորդագրությունը գործողությունը 
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_EditBlackList)
    'Սեղմել Կատարել կոճակը
    Call ClickCmdButton(2, "Î³ï³ñ»É")
    Call ClickCmdButton(5, "Î³ï³ñ»É")
    Call Close_Pttel("frmPttel")
    
'------------------------------------------------------Արգելանքից ազատում-----------------------------------------------------------------------------------
   
    SqlQuery2 = "Insert Into DAHKFREEATTACH (fIMPDATE,	fMESSAGEID,	fDECISIONNUM,	fDECISIONDATE,	fDECISIONPLACE,	fDECISIONOWNER,"_
                & "fINQUESTNUMBER, fINQUESTDATE,	fBRANCH,	fBRANCHSUB,	fBDISMISSPAR,	fBDISMISSTYPE,	fBDISMISSSUM1	,	fBDISMISSCUR1,"_
                & "fBDISMISSSUM2,	fBDISMISSCUR2,	fBDISMISSSUM3,	fBDISMISSCUR3,	fBDISMISSSUM4,	fBDISMISSCUR4,	fBDISMISSOTHER,	"_
                & "fBDISMISSNEXT,	fRESPONSEISN,	fPROCESSED,	fINQUESTID)"_
                & "Values ('2018-12-30 08:56:00',	'º03000142262',	'à00446-00007/10',	'2018-12-29 00:00:00',	'ù. ºñ¨³Ý',	"_
                & "'ñ³Ù ²í³·Û³Ý ². ²í³·Û³Ý                    1',	'01/06-00522/10',	'2010-09-02 00:00:00',	NULL,	"_
                & "'Ð³ñÏ³¹Çñ Ï³ï³ñáÕ ³ñ¹³ñ³¹³ïáõÃÛ³Ý É»Ûï»Ý³Ýï ²',	'44.1',	1,	'0.00',	NULL,	'0.00',	NULL,	'0.00',	NULL,	'0.00',"_
                & "NULL,1,	1,	Null ,	1,	NULL)" 

    Call Execute_SLQ_Query(SqlQuery2) 
    
    'Մուտք գործել "Ընդունված հաղորդագրություններ" թղթապանակ
    date = "301218"
    messType = "03"
    blockID = "º03000142262"
    If Not Enter_Recieved_Messages(date,date,messType,blockID) Then
            Log.Error("Փաստաթուղթը չի գտնվել")
            Exit Sub
    End If
    
    'Ստուգել որ Բռնագանձում տեսակի հաղորդագրության համար լրացված լինի Սև ցուցակի N  դաշտը
    If Not wMDIClient.VBObject("frmPttel").VBObject("tdbgView").Columns.Item(colNum).Value = BLCliCode Then
            Log.Error("Հաղորդագրության համար լրացված չէ Սև ցուցակի N  դաշտը")
    End If
    
    'հեռացնել "Սև ցուցակից"
    Call wMainForm.MainMenu.Click(c_AllActions) 
    Call wMainForm.PopupMenu.Click(c_RemoveFromBlackList)
    Call ClickCmdButton(5, "²Ûá")
    Call ClickCmdButton(5, "²Ûá")
    Call Close_Pttel("frmPttel")
    
    'Անցում կատարել "Սև ցուցակ վարողի ԱՇՏ"
    Call ChangeWorkspace(c_BLKeeper)
    
    'Ստուգել "Սև ցուցակ" թղթաքպանակում
    If Check_In_Black_List_Folder(BLCliCode) Then
        Log.Error("Հաղորդագրությունը 'Սև ցուցակ' թղթապանակում է")
    End If    
        
    'Ջնջել բելեր ներմուծած հաղորդագորությունները
    SqlQuery2 = "Delete from DAHKFREEATTACH  "_
              & "Delete from DAHKCATCH    "_
              & "Delete from DAHKATTACH   " 
              
    Call Execute_SLQ_Query(SqlQuery2) 
    
    Call Close_AsBank() 
    
End Sub