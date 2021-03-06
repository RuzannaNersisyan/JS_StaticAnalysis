'USEUNIT Subsystems_SQL_Library
'USEUNIT  Library_Common
'USEUNIT Constants

' Փոխանցում իր հաշիվներով/Միջթղթակցային փոխանցումներ փաստաթղթի ստեղծում
Class TransfersForItsAcc

      Public folderDirect
      Public acsBranch
      Public acsDepart
      Public fISN
      Public cliCode
      Public wDate
      Public accDB
      Public accCR
      Public wSumma
      Public wCur
      Public addInfo
      Public qDate
      Public wPack
      Public tcorrAcc
      Public paySysIn
      Public paySysOut
      Public wMedop
      Public medBank
      Public medID
      Public wRefuse
      
      Private Sub Class_Initialize
            folderDirect = ""
            acsBranch = ""
            acsDepart = ""
            fISN = ""
            cliCode = ""
            wDate = ""
            accDB = ""
            accCR = ""
            wSumma = ""
            wCur = ""
            addInfo = ""
            qDate = ""
            wPack = ""
            tcorrAcc = ""
            paySysIn = ""
            paySysOut = ""
            wMedop = ""
            medBank = ""
            medID = ""
            wRefuse = ""
      End Sub
      
End Class

Function New_TransfersForItsAcc()
          Set New_TransfersForItsAcc = New TransfersForItsAcc
End Function

' Լրացնել Միջթղթակցային փոխանցումներ փաստաթղթի դաշտերը
Sub Fill_TransfersForItsAcc(TransfersForItsAcc)
  
      ' Բացել "Միջթղթակցային փոխանցումներ" փաստաթուղթը 
      Call wTreeView.DblClickItem(TransfersForItsAcc.folderDirect)
      
      ' "Գրասենյակ" դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACSBRANCH", TransfersForItsAcc.acsBranch)  
      ' "Բաժին" դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACSDEPART", TransfersForItsAcc.acsDepart)    
      
      ' Փաստաթղթի ISN արժեքի ստացում
      TransfersForItsAcc.fISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN        
      
      ' Միջթղթակցային փոխանցումներ փաստաթղթի Փաստաթղթի N արժեքի ստացում
      TransfersForItsAcc.cliCode = Get_Rekvizit_Value("Document", 1, "General", "DOCNUM")
      
      ' "Ամսաթիվ" դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "DATE", "^A[Del]" & TransfersForItsAcc.wDate)  
      ' "Հաշիվ Դեբետ" դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACCDB", TransfersForItsAcc.accDB)  
      ' "Հաշիվ կրեդիտ" դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ACCCR", TransfersForItsAcc.accCR)  
      ' "Գումար" դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "SUMMA", TransfersForItsAcc.wSumma)  
      ' "Արժույթ" դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "CUR", TransfersForItsAcc.wCur)  
      ' "Լրացուցիչ ինֆորմացիա" դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "ADDINFO", TransfersForItsAcc.addInfo)  
      ' "Մարման ամսաթիվ" դաշտի լրացում
      Call Rekvizit_Fill("Document", 1, "General", "QDATE", TransfersForItsAcc.qDate)  
      ' "Փաթեթի համարը" դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "PACK", TransfersForItsAcc.wPack)  
      ' "Տարանցիկ հաշիվ" դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "TCORRACC", TransfersForItsAcc.tcorrAcc)  
      ' "Ընդ. վճար. համակարգ" դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "PAYSYSIN", TransfersForItsAcc.paySysIn)  
      ' "Ուղ. վճ. համակարգ" դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "PAYSYSOUT", TransfersForItsAcc.paySysOut) 
      ' "Միջնորդ բանկի տվ. տիպ" դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "MEDOP", TransfersForItsAcc.wMedop) 
      ' "Միջնորդ բանկ" դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "MEDBANK", TransfersForItsAcc.medBank)
      ' "Միջնորդ բանկի հաշիվ" դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "MEDID", TransfersForItsAcc.medID) 
      ' "Մերժում" դաշտի լրացում
      Call Rekvizit_Fill("Document", 2, "General", "REFUSE", TransfersForItsAcc.wRefuse)  
      
      Call ClickCmdButton(1, "Î³ï³ñ»É")
            
End Sub


' Ուղարկվող միջթղթակցային փոխանցումներ ֆիլտր
Class SendingTransfersForIts

      Public folderDirect
      Public stDate
      Public eDate
      Public wUser
      Public wCur
      Public packNum
      Public paySysin
      Public paySysOut
      Public selectView
      Public exportExcel
      
      Private Sub Class_Initialize
              folderDirect = ""
              stDate = ""
              eDate = ""
              wUser = ""
              wCur = ""
              packNum = ""
              paySysin = ""
              paySysOut = ""
              selectView = ""
              exportExcel = ""
      End Sub

End Class

Function New_SendingTransfersForIts()
      Set New_SendingTransfersForIts = New SendingTransfersForIts
End Function


' Ուղարկվող միջթղթակցային փոխանցումներ ֆիլտրի արժեքների լրացում
Sub Fill_SendingTransfersForIts(SendingTransfersForIts)

      Call wTreeView.DblClickItem(SendingTransfersForIts.folderDirect)
      
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").WaitVBObject("frmAsUstPar", 2000).Exists Then
            Log.Error(folderName & " դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", SendingTransfersForIts.stDate )
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", SendingTransfersForIts.eDate )
      ' Կատարող դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "USER",   "^A[Del]"  & SendingTransfersForIts.wUser)
      ' Արժույթ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "CUR",  SendingTransfersForIts.wCur)
      ' Փաթեթի համարը դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PACKNUM", SendingTransfersForIts.packNum )
      ' Ընդ. վճ. համակարգ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PAYSYSIN", SendingTransfersForIts.paySysin )
      ' Ուղ. վճ. համակարգ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PAYSYSOUT", SendingTransfersForIts.paySysOut )
      ' Դիտելու ձև դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SELECTED_VIEW", "^A[Del]" & SendingTransfersForIts.selectView )
      ' Լրացնել դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EXPORT_EXCEL",  "^A[Del]" & SendingTransfersForIts.exportExcel )

      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)

End Sub


' Մասնակի խմբագրվող հանձնարարագրեր ֆիլտր
Class PartiallyEditableAssign

      Public folderDirect
      Public stDate
      Public eDate
      Public paySysin
      Public paySysOut
      Public payNotes
      Public acsBranch
      Public acsDepart
      Public selectView
      Public exportExcel
      
      Private Sub Class_Initialize
              folderDirect = ""
              stDate = ""
              eDate = ""
              paySysin = ""
              paySysOut = ""
              payNotes = ""
              acsBranch = ""
              acsDepart = ""
              selectView = ""
              exportExcel = ""
      End Sub

End Class

Function New_PartiallyEditableAssign()
      Set New_PartiallyEditableAssign = New PartiallyEditableAssign
End Function


' Մասնակի խմբագրվող հանձնարարագրեր ֆիլտրի արժեքների լրացում
Sub Fill_PartiallyEditableAssign(PartiallyEditableAssign)

      Call wTreeView.DblClickItem(PartiallyEditableAssign.folderDirect)
      
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").WaitVBObject("frmAsUstPar", 2000).Exists Then
            Log.Error(folderName & " դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", PartiallyEditableAssign.stDate )
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", PartiallyEditableAssign.eDate )
      ' Ընդ. վճ. համակարգ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PAYSYSIN", PartiallyEditableAssign.paySysin )
      ' Ուղ. վճ. համակարգ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PAYSYSOUT", PartiallyEditableAssign.paySysOut )
      ' Նշում դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PAYNOTES", PartiallyEditableAssign.payNotes )
      ' Գրասենյակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSBRANCH", PartiallyEditableAssign.acsBranch )
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSDEPART", PartiallyEditableAssign.acsDepart )
      ' Դիտելու ձև դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SELECTED_VIEW", "^A[Del]" & PartiallyEditableAssign.selectView )
      ' Լրացնել դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EXPORT_EXCEL",  "^A[Del]" & PartiallyEditableAssign.exportExcel )

      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)

End Sub


' Մուտք "Հաշվառված ուղարկված/ստացված փոխանցումներ" թղթապանակ
Class AccForTransfers
      
      Public folderDirect
      Public stDate
      Public eDate
      Public wUser
      Public docType
      Public acsBranch
      Public acsDepart
      Public selectedView
      Public exportExcel
      
      Private Sub Class_Initialize
      
            folderDirect = ""
            stDate = ""
            eDate = ""
            wUser = ""
            docType = ""
            acsBranch = ""
            acsDepart = ""
            selectedView = "RcvdPay"
            exportExcel = "0"
      End Sub
      
End Class

Function New_AccForTransfers()

      Set New_AccForTransfers = New AccForTransfers

End Function


' "Հաշվառված ուղարկված/ստացված փոխանցումներ" ֆիլտրի լրացում
' folderDirect - թղթապանակի ուղղություն
' stDate - Ժամանակահատվածի սկիզբ
' eDate - Ժամանակահատվածի ավարտ
' wUser - Կատարող
' docType - Փաստաթղթի տեսակ
' acsBranch - Գրասենյակ
' acsDepart - Բաժին
' selectedView - Դիտելու ձև
' exportExcel - Լրացնել
Sub Fill_AccForTransfers(AccForTransfers)

      Call wTreeView.DblClickItem(AccForTransfers.folderDirect)
      BuiltIn.Delay(1000)
      
      If Not Sys.Process("Asbank").VBObject("frmAsUstPar").Exists Then
            Log.Error(" Դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Ժամանակահատվածի սկիզբ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", "^A[Del]" & AccForTransfers.stDate )
      ' Ժամանակահատվածի ավարտ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", "^A[Del]" & AccForTransfers.eDate)
      ' Կատարող դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "USER", "^A[Del]" & AccForTransfers.wUser)
      ' Փաստաթղթի տեսակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "DOCTYPE", AccForTransfers.docType )
      ' Գրասենյակ դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSBRANCH", AccForTransfers.acsBranch )
      ' Բաժին դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSDEPART", AccForTransfers.acsDepart )
      ' Դիտելու ձև դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "SELECTED_VIEW", AccForTransfers.selectedView)
      ' Լրացնել դաշտի լրացում
      Call Rekvizit_Fill("Dialog", 1, "General", "EXPORT_EXCEL", AccForTransfers.exportExcel)
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
      BuiltIn.Delay(1000)
      
End Sub


' Ստեղծել "Վճարման պահանջագիր" փաստաթուղթ
Class PaymentRequestDoc

      Public folderDirect
      Public acsBranch
      Public acsDepart
      Public fISN
      Public cliCode
      Public wDate
      Public accDb
      Public wPayer
      Public accCr
      Public wReceiver
      Public wSumma
      Public wCur
      Public wAim
      Public wPack
      Public corrAcc
      Public corrAccCB
      Public paysysIn
      Public paysysOut
      Public wRefuse
      
      Private Sub Class_Initialize
            folderDirect = ""
            acsBranch = ""
            acsDepart = ""
            fISN = ""
            cliCode = ""
            wDate = ""
            accDb = ""
            wPayer = ""
            accCr = ""
            wReceiver = ""
            wSumma = ""
            wCur = ""
            wAim = ""
            wPack = ""
            corrAcc = ""
            corrAccCB = ""
            paysysIn = ""
            paysysOut = ""
            wRefuse = ""
      End Sub
      
End Class

Function New_PaymentRequestDoc()
      Set New_PaymentRequestDoc = New PaymentRequestDoc
End Function

' "Վճարման պահանջագիր" փաստաթղթի արժեքների լրացում
Sub Fill_PaymentRequestDoc(PaymentRequestDoc)
  
      ' "Վճարման պահանջագիր" փաստաթուղթը ուղղություն
      Call wTreeView.DblClickItem(PaymentRequestDoc.folderDirect)
      
      ' Լրացնել "Գրասենյակ" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "ACSBRANCH", "^A[Del]" & PaymentRequestDoc.acsBranch)  
      ' Լրացնել "Բաժին" դաշտը
      Call Rekvizit_Fill("Document", 1, "General", "ACSDEPART", "^A[Del]" & PaymentRequestDoc.acsDepart)    
      
      ' Փաստաթղթի ISN արժեքի ստացում
      PaymentRequestDoc.fISN = wMDIClient.VBObject("frmASDocForm").DocFormCommon.Doc.ISN        
      
      ' Միջթղթակցային փոխանցումներ փաստաթղթի Փաստաթղթի N արժեքի ստացում
      PaymentRequestDoc.cliCode = Get_Rekvizit_Value("Document", 1, "General", "DOCNUM")
      ' Լրացնել "Ամսաթիվ" դաշտը 
      Call Rekvizit_Fill("Document", 1, "General", "DATE", "^A[Del]" & PaymentRequestDoc.wDate)  
      ' Լրացնել "Վճարողի հաշիվ" դաշտը 
      Call Rekvizit_Fill("Document", 1, "General", "ACCDB", "^A[Del]" & PaymentRequestDoc.accDb)  
      ' Լրացնել "Վճարող" դաշտը 
      Call Rekvizit_Fill("Document", 1, "General", "PAYER", "^A[Del]" & PaymentRequestDoc.wPayer)  
      ' Լրացնել "Ստացողի հաշիվ" դաշտը 
      Call Rekvizit_Fill("Document", 1, "General", "ACCCR", "^A[Del]" & PaymentRequestDoc.accCr)  
      ' Լրացնել "Ստացող" դաշտը 
      Call Rekvizit_Fill("Document", 1, "General", "RECEIVER","^A[Del]" &  PaymentRequestDoc.wReceiver)  
      ' Լրացնել "Գումար" դաշտը 
      Call Rekvizit_Fill("Document", 1, "General", "SUMMA", PaymentRequestDoc.wSumma)  
      ' Լրացնել "Արժույթ" դաշտը 
      Call Rekvizit_Fill("Document", 1, "General", "CUR", PaymentRequestDoc.wCur)  
      ' Լրացնել "Նպատակ" դաշտը 
      Call Rekvizit_Fill("Document", 1, "General", "AIM", PaymentRequestDoc.wAim)  
      ' Լրացնել "Փաթեթի համարը" դաշտը 
      Call Rekvizit_Fill("Document", 2, "General", "PACK", PaymentRequestDoc.wPack)  
      ' Լրացնել "Թղթակցային հաշիվ" դաշտը 
      Call Rekvizit_Fill("Document", 2, "General", "CORRACC", PaymentRequestDoc.corrAcc)  
      ' Լրացնել "Թղթակցային հաշիվ ԿԲ-ում" դաշտը 
      Call Rekvizit_Fill("Document", 2, "General", "CORRACCCB", PaymentRequestDoc.corrAccCB)  
      ' Լրացնել "Ընֆ վճ. համակարգ" դաշտը 
      Call Rekvizit_Fill("Document", 2, "General", "PAYSYSIN", PaymentRequestDoc.paysysIn)  
      ' Լրացնել "Ուղ. վճ. համակարգ" դաշտը 
      Call Rekvizit_Fill("Document", 2, "General", "PAYSYSOUT", PaymentRequestDoc.paysysOut)  
      ' Լրացնել "Մերժում" դաշտը 
      Call Rekvizit_Fill("Document", 2, "General", "REFUSE", PaymentRequestDoc.wRefuse)  
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(1, "Î³ï³ñ»É")
      
End Sub


' Մուտք "Ուղարկված թղթային" թղթապանակ
Class SentToClearingDoc

      Public folderDirect
      Public stDate
      Public eDate
      Public bankCtl
      Public pysysIn
      Public wCur
      Public logoPer
      Public acsBranch
      Public acsDepart
      Public selectedView
      Public exportExcel
      
      Private Sub Class_Initialize
            folderDirect = ""
            stDate = ""
            eDate = ""
            bankCtl = ""
            pysysIn = ""
            wCur = ""
            logoPer = False
            acsBranch = ""
            acsDepart = ""
            selectedView = "PayoarhC"
            exportExcel = "0"
      End Sub
End Class


Function New_SentToClearingDoc()
      Set New_SentToClearingDoc = New SentToClearingDoc
End Function

'  "Ուղարկված թղթային" ֆիլտրի լրացում
Sub Fill_SentToClearingDoc(SentToClearingDoc)

      Call wTreeView.DblClickItem(SentToClearingDoc.folderDirect)
      
      If Not Sys.Process("Asbank").WaitVBObject("frmAsUstPar", 3000).Exists Then
            Log.Error(" Դիալոգը չի բացվել")
            Exit Sub
      End If
      
      ' Լրացնել "Ժամանակահատվածի սկիզբ" դաշտը
      Call Rekvizit_Fill("Dialog", 1, "General", "PERN", "^A[Del]" & SentToClearingDoc.stDate) 
      ' Լրացնել "Ժամանակահատվածի ավարտ" դաշտը
      Call Rekvizit_Fill("Dialog", 1, "General", "PERK", "^A[Del]" & SentToClearingDoc.eDate) 
      ' Լրացնել "Բանկի կոդ" դաշտը
      Call Rekvizit_Fill("Dialog", 1, "General", "BANKCTL", SentToClearingDoc.bankCtl) 
      ' Լրացնել "Ընդ. վճ. համակարգ" դաշտը
      Call Rekvizit_Fill("Dialog", 1, "General", "PAYSYSIN", SentToClearingDoc.pysysIn) 
      ' Լրացնել "Արժույթ" դաշտը
      Call Rekvizit_Fill("Dialog", 1, "General", "CUR", SentToClearingDoc.wCur) 
      ' Լրացնել "Արժույթի ժխտում" դաշտը
      Call Rekvizit_Fill("Dialog", 1, "CheckBox", "LOGOPER", SentToClearingDoc.logoPer) 
      ' Լրացնել "Գրասենյակ" դաշտը
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSBRANCH", SentToClearingDoc.acsBranch)  
      ' Լրացնել "Բաժին" դաշտը
      Call Rekvizit_Fill("Dialog", 1, "General", "ACSDEPART", SentToClearingDoc.acsDepart) 
      ' Լրացնել "Դիտելու ձև" դաշտը
      Call Rekvizit_Fill("Dialog", 1, "General", "SELECTED_VIEW", "^A[Del]" & SentToClearingDoc.selectedView) 
      ' Լրացնել "Լրացնել" դաշտը
      Call Rekvizit_Fill("Dialog", 1, "General", "EXPORT_EXCEL", "^A[Del]" & SentToClearingDoc.exportExcel) 
      
      ' Կատարել կոճակի սեղմում
      Call ClickCmdButton(2, "Î³ï³ñ»É")
End Sub
