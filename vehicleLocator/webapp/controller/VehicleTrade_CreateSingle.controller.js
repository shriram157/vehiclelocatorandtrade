var _that;
sap.ui.define([
	/*"sap/ui/core/mvc/Controller"*/
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageBox',
	"sap/ui/core/routing/History",
	"vehicleLocator/Formatter/Formatter"
], function (BaseController, JSONModel, ResourceModel, MessageBox, History, Formatter) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleTrade_CreateSingle", {        

		onInit: function () {
			var _that = this;

			//Global date format
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			_that.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			//***********Language translator functionality**********//
			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				var sSelectedLocale = "EN"; // default is english 
			}
			//selected language. 
			// if (window.location.search == "?language=fr") {
			if (sSelectedLocale == "fr") {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'FR';

			} else {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';

			}

			/// set the logo and Language. 

			this._setTheLanguage();

			this._setTheLogo();

			var oViewModel = new sap.ui.model.json.JSONModel({

				showVinDiplayOff: false,
				showVinDiplayReq: true                

			});

			this.getView().setModel(oViewModel, "detailView");

			this.getRouter().getRoute("VehicleTrade_CreateSingle").attachPatternMatched(this.onRouteMatched, this);
			/*this.getRouter().attachRouteMatched(this.onRouteMatched, this);*/
		},
		onRouteMatched: function (oEvent) {

			var oModelDetail = this.getView().getModel("detailView");
			this.getView().byId("oTypeHere").setValue(""); //1803

			// language setting for screen is getting complicated, so making use of the below model.  2903
			if (this.sCurrentLocaleD == "French") {

				var oViewModel = new sap.ui.model.json.JSONModel({
					SPRAS: "French"

				});
			} else {
				var oViewModel = new sap.ui.model.json.JSONModel({

					SPRAS: "English"

				});

			}
			var oArray = [{
					"Trade_return": "Yes",
					"State": "Yes"
				}, {
					"Trade_return": "No",
					"State": "No"
				}

			];

			var oModel = new sap.ui.model.json.JSONModel(oArray);
			this.getView().byId("VT_CStradinRet").setModel(oModel);

			this.getView().setModel(oViewModel, "languageModel");

			var oReceivedDataString = oEvent.getParameter("arguments").SelectedTrade;
			if (oReceivedDataString != undefined) {
				if (oReceivedDataString == "VehicleSearchResults") {
					var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
					var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
					this.getView().byId("oDealerCode3").setText(LoggedInDealerCode2);
					this.getView().byId("oDealerCreat_singl").setText(LoggedInDealer);
					this.getView().byId("outlabedealrid").setVisible(false);
					this.getView().byId("outdealrid").setVisible(false);
					this.getView().byId("oOtherVehInfoid").setText("");
					this.getView().byId("vtnlabeid").setVisible(false);
					// this.getView().byId("vtnid").setVisible(false);
					this.getView().byId("moylablid").setVisible(false);
					this.getView().byId("yearid").setVisible(false);
					this.getView().byId("serielabelid").setVisible(false);
					this.getView().byId("seiresid").setVisible(false);
					this.getView().byId("modlabelid").setVisible(false);
					this.getView().byId("modlid").setVisible(false);
					this.getView().byId("sufflabeid").setVisible(false);
					this.getView().byId("suffid").setVisible(false);
					this.getView().byId("apxlabelid").setVisible(false);
					this.getView().byId("apxid").setVisible(false);
					this.getView().byId("acclabelid").setVisible(false);

					this.getView().byId("accid").setVisible(false);
					this.getView().byId("extcollabelid").setVisible(false);
					this.getView().byId("extcolod").setVisible(false);

					this.getView().byId("ofvestats").setVisible(false);
					this.getView().byId("offeredStatus").setVisible(false);
					this.getView().byId("offordetype").setVisible(false);
					this.getView().byId("oofferedOrdertype").setVisible(false);

					/*	this.getView().byId("crtslabeid").setVisible(false);*/
					this.getView().byId("ctrtaid").setVisible(false);
					this.getView().byId("oCtraid").setVisible(false);
					// this.getView().byId("fromLabeeid").setVisible(false);
					/*	this.getView().byId("labidtxt").setVisible(false);  ===del===*/
					this.getView().byId("labetxteid").setVisible(false);
					// this.getView().byId("ototid").setVisible(false);
					/*	this.getView().byId("otitxt").setVisible(false);  ===del===*/
					this.getView().byId("propetid").setVisible(false);
					this.getView().byId("perpid").setVisible(false);
					// this.getView().byId("frlabid").setVisible(false);
					this.getView().byId("fmlabid").setVisible(false);
					this.getView().byId("idlabeal").setVisible(false);
					// this.getView().byId("textide").setVisible(false);

					// this.getView().byId("FromFourth").setText("");
					this.getView().byId("oSeleBtn").setVisible(true);
					//	this.getView().byId("OtherVehInfoid").setText("");
					this.getView().byId("vtnlabeidReq").setVisible(true);
					this.getView().byId("vinLabelId").setVisible(true); 
					this.getView().byId("moyrLabelReq").setVisible(true);
					this.getView().byId("zzMoyr").setVisible(true);
					this.getView().byId("seriesLabelReq").setVisible(true);
					this.getView().byId("oSeries").setVisible(true);
					this.getView().byId("modLabelReq").setVisible(true);
					this.getView().byId("oZmodel").setVisible(true);
					this.getView().byId("sufLabelReq").setVisible(true);
					this.getView().byId("oZsuffix").setVisible(true);
					this.getView().byId("apxLabelReq").setVisible(true);
					this.getView().byId("oApx").setVisible(true);
					this.getView().byId("accLabelReq").setVisible(true);

					this.getView().byId("oAccesIn").setVisible(true);
					this.getView().byId("extLabelReq").setVisible(true);
					this.getView().byId("Zextcolo").setVisible(true);

					this.getView().byId("statusLabelReq").setVisible(true);
					this.getView().byId("oStatus").setVisible(true);
					this.getView().byId("ordLabelReq").setVisible(true);
					this.getView().byId("oOrdertype").setVisible(true);

					this.getView().byId("cetalabelid").setVisible(true);
					this.getView().byId("ctaid").setVisible(true);
					// this.getView().byId("fromLabeeid").setVisible(false);
					/*	this.getView().byId("labidtxt").setVisible(false);*/
					this.getView().byId("totxtid").setVisible(true);
					// this.getView().byId("ototid").setVisible(false);
					/*	this.getView().byId("otitxt").setVisible(false);*/
					this.getView().byId("prpdlabid").setVisible(true);
					this.getView().byId("prpid").setVisible(true);
					// this.getView().byId("frlabid").setVisible(false);
					this.getView().byId("otextlabel").setVisible(true);
					this.getView().byId("vtnidReq").setVisible(true);
					// this.getView().byId("textide").setVisible(false);
					this.getView().byId("VT_CStradinRet").setEnabled(true);

					var oReceivedData = sap.ui.getCore().SelectedTrade;
					oModelDetail.setProperty("/showVinDiplayReq", oReceivedData.dispalyVin);
					oModelDetail.setProperty("/showVinDiplayOff", false);
					this.getView().byId("vtnlabeid").setVisible(false);
					this.getView().byId("vtnid").setVisible(false);

					var oModel = new sap.ui.model.json.JSONModel(oReceivedData);

					this.getView().setModel(oModel, "TradeModel");
					sap.ui.getCore().setModel(oModel, "TradeModel");
					this.getView().byId("SimpleFormDispla20").bindElement("TradeModel>/");

					this.RequestingDealerToSendToSAP = oReceivedData.kunnr; // New Changes

				} else if (oReceivedDataString == "VehicleTradeVehicle") {

					var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
					var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
					this.getView().byId("oDealerCode3").setText(LoggedInDealerCode2);
					this.getView().byId("oDealerCreat_singl").setText(LoggedInDealer);

					this.getView().byId("vtnlabeid").setVisible(true);
					this.getView().byId("vtnid").setVisible(true);
					this.getView().byId("moylablid").setVisible(true);
					this.getView().byId("yearid").setVisible(true);
					this.getView().byId("serielabelid").setVisible(true);
					this.getView().byId("seiresid").setVisible(true);
					this.getView().byId("modlabelid").setVisible(true);
					this.getView().byId("modlid").setVisible(true);
					this.getView().byId("sufflabeid").setVisible(true);
					this.getView().byId("suffid").setVisible(true);
					this.getView().byId("apxlabelid").setVisible(true);
					this.getView().byId("apxid").setVisible(true);
					this.getView().byId("acclabelid").setVisible(true);

					this.getView().byId("accid").setVisible(true);
					this.getView().byId("extcollabelid").setVisible(true);
					this.getView().byId("extcolod").setVisible(true);

					this.getView().byId("oCtraid").setVisible(true);
					this.getView().byId("ctrtaid").setVisible(true);
					// this.getView().byId("fromLabeeid").setVisible(true);
					/*	this.getView().byId("labidtxt").setVisible(true);*/
					this.getView().byId("labetxteid").setVisible(true);
					// this.getView().byId("ototid").setVisible(true);
					/*	this.getView().byId("otitxt").setVisible(true);*/
					this.getView().byId("propetid").setVisible(true);
					this.getView().byId("perpid").setVisible(true);
					// this.getView().byId("frlabid").setVisible(true);
					this.getView().byId("fmlabid").setVisible(true);
					this.getView().byId("idlabeal").setVisible(true);
					// this.getView().byId("textide").setVisible(true);

					this.getView().byId("ofvestats").setVisible(true);
					this.getView().byId("offeredStatus").setVisible(true);
					this.getView().byId("offordetype").setVisible(true);
					this.getView().byId("oofferedOrdertype").setVisible(true);

					// this.getView().byId("vinLableIdOff").setVisible(true);
					// this.getView().byId("vinVinIdOff").setVisible(true);	
					oModelDetail.setProperty("/showVinDiplayOff", true);

					// var i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
					// var OtherVehicleInformation_text = i18n.getText("OfferVehicleInformation");

					var oModeli18n = this.getView().getModel("i18n");
					// this._oResourceBundle = oModeli18n.getResourceBundle();			
					var OtherVehicleInformation_text = oModeli18n.getResourceBundle().getText("OutboundVehicleInformation");

					this.getView().byId("oOtherVehInfoid").setText(OtherVehicleInformation_text);
					this.getView().setModel(sap.ui.getCore().getModel("TradeModel"), "TradeModel");

					this.getView().byId("SimpleFormDispla20").bindElement("TradeModel>/");

				} else {
					var Data;
					oReceivedDataString = oReceivedDataString.replace("%2F", "/");
					Data = JSON.parse(oReceivedDataString);

					// var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
					// 			var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
					// 			this.getView().byId("oDealerCode3").setText(LoggedInDealerCode2);
					// 			this.getView().byId("oDealerCreat_singl").setText(LoggedInDealer);

					this.getView().byId("vtnlabeid").setVisible(true);
					this.getView().byId("vtnid").setVisible(true);
					this.getView().byId("moylablid").setVisible(true);
					this.getView().byId("yearid").setVisible(true);
					this.getView().byId("serielabelid").setVisible(true);
					this.getView().byId("seiresid").setVisible(true);
					this.getView().byId("modlabelid").setVisible(true);
					this.getView().byId("modlid").setVisible(true);
					this.getView().byId("sufflabeid").setVisible(true);
					this.getView().byId("suffid").setVisible(true);
					this.getView().byId("apxlabelid").setVisible(true);
					this.getView().byId("apxid").setVisible(true);
					this.getView().byId("acclabelid").setVisible(true);

					this.getView().byId("accid").setVisible(true);
					this.getView().byId("extcollabelid").setVisible(true);
					this.getView().byId("extcolod").setVisible(true);

					this.getView().byId("oCtraid").setVisible(true);
					this.getView().byId("ctrtaid").setVisible(true);
					// this.getView().byId("fromLabeeid").setVisible(true);
					/*	this.getView().byId("labidtxt").setVisible(true);*/
					this.getView().byId("labetxteid").setVisible(true);
					// this.getView().byId("ototid").setVisible(true);
					/*	this.getView().byId("otitxt").setVisible(true);*/
					this.getView().byId("propetid").setVisible(true);
					this.getView().byId("perpid").setVisible(true);
					// this.getView().byId("frlabid").setVisible(true);
					this.getView().byId("fmlabid").setVisible(true);
					this.getView().byId("idlabeal").setVisible(true);
					// this.getView().byId("textide").setVisible(true);

					this.getView().byId("ofvestats").setVisible(true);
					this.getView().byId("offeredStatus").setVisible(true);
					this.getView().byId("offordetype").setVisible(true);
					this.getView().byId("oofferedOrdertype").setVisible(true);

					// this.getView().byId("vinLableIdOff").setVisible(true);
					// this.getView().byId("vinVinIdOff").setVisible(true);	
					oModelDetail.setProperty("/showVinDiplayOff", true);

					// var i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
					// var OtherVehicleInformation_text = i18n.getText("OfferVehicleInformation");

					var oModeli18n = this.getView().getModel("i18n");
					// this._oResourceBundle = oModeli18n.getResourceBundle();			
					var OtherVehicleInformation_text = oModeli18n.getResourceBundle().getText("OutboundVehicleInformation");

					this.getView().byId("oOtherVehInfoid").setText(OtherVehicleInformation_text);
					// this.getView().setModel(sap.ui.getCore().getModel("TradeModel"), "TradeModel");
					var oModel = new sap.ui.model.json.JSONModel();
					this.getView().setModel(oModel, "TradeModel");
					// sap.ui.getCore().getModel("TradeModel").setProperty("/VehicleTradeVehicle", Data);
					this.getView().getModel("TradeModel").setProperty("/VehicleTradeVehicle", Data);

					this.getView().byId("SimpleFormDispla20").bindElement("TradeModel>/");

				}
			}
			// defect 11177 -  do not show 	dnc indicator based on order type		
			// var oModelData = this.getView().getModel("TradeModel").getData();
			// if (oModelData.dnc_ind == "Y") {
			//  	this.getView().byId("oOrdertype").setVisible(false);
			// } else {
			// 		this.getView().byId("oOrdertype").setVisible(true);
			// }

			//	this.getView().byId("VT_CStradinRet").setSeletedKey("Yes");
			/*	this.getView().byId("VT_CStradinRet").setSelectedKey("Yes");
				var selVT_CStradinRet = this.getView().byId("VT_CStradinRet").getSelectedKey();
				if (selVT_CStradinRet == "Yes") {
					this.getView().byId("oSeleBtn").setEnabled(true);

				} else if (selVT_CStradinRet == "No") {
					this.getView().byId("oSeleBtn").setEnabled(false);
				}*/
			if (this.getView().byId("FromFourth").getText() == "FromPush") {
				sap.ui.getCore().SelectedTradeStatus = "No";
				this.getView().byId("VT_CStradinRet").setSelectedKey("No");

				this.getView().byId("dealridreq").setVisible(false);
				this.getView().byId("dealrid").setVisible(false);

				// this.getView().byId("FromFourth").setText("");
				this.getView().byId("oSeleBtn").setVisible(false);
				this.getView().byId("OtherVehInfoid").setText("");
				this.getView().byId("vtnlabeidReq").setVisible(false);
				this.getView().byId("vinLabelId").setVisible(false);
				this.getView().byId("moyrLabelReq").setVisible(false);
				this.getView().byId("zzMoyr").setVisible(false);
				this.getView().byId("seriesLabelReq").setVisible(false);
				this.getView().byId("oSeries").setVisible(false);
				this.getView().byId("modLabelReq").setVisible(false);
				this.getView().byId("oZmodel").setVisible(false);
				this.getView().byId("sufLabelReq").setVisible(false);
				this.getView().byId("oZsuffix").setVisible(false);
				this.getView().byId("apxLabelReq").setVisible(false);
				this.getView().byId("oApx").setVisible(false);
				this.getView().byId("accLabelReq").setVisible(false);

				this.getView().byId("oAccesIn").setVisible(false);
				this.getView().byId("extLabelReq").setVisible(false);
				this.getView().byId("Zextcolo").setVisible(false);

				this.getView().byId("statusLabelReq").setVisible(false);
				this.getView().byId("oStatus").setVisible(false);
				this.getView().byId("ordLabelReq").setVisible(false);
				this.getView().byId("oOrdertype").setVisible(false);

				this.getView().byId("cetalabelid").setVisible(false);
				this.getView().byId("ctaid").setVisible(false);
				// this.getView().byId("fromLabeeid").setVisible(false);
				/*	this.getView().byId("labidtxt").setVisible(false);*/
				this.getView().byId("totxtid").setVisible(false);
				// this.getView().byId("ototid").setVisible(false);
				/*	this.getView().byId("otitxt").setVisible(false);*/
				this.getView().byId("prpdlabid").setVisible(false);
				this.getView().byId("prpid").setVisible(false);
				// this.getView().byId("frlabid").setVisible(false);
				this.getView().byId("otextlabel").setVisible(false);
				this.getView().byId("vtnidReq").setVisible(false);
				// this.getView().byId("textide").setVisible(false);
				this.getView().byId("VT_CStradinRet").setEnabled(false);

				// var Requested_Dealer = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.Requested_Dealer;
				// 		var Requested_Dealer_Name = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.Requested_Dealer_Name.substr(that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.Requested_Dealer_Name.indexOf(
				// 			"-") + 1);

				/*var oReceivedData = sap.ui.getCore().VehicheSearcResults[this.oReceivedDataString];
				var oModel = new sap.ui.model.json.JSONModel(oReceivedData);

				this.getView().setModel(oModel, "TradeModel");
				sap.ui.getCore().setModel(oModel, "TradeModel");
				this.getView().byId("SimpleFormDispla20").bindElement("TradeModel>/");*/

			}
			if (sap.ui.getCore().SelectedTradeStatus != undefined) {
				this.getView().byId("VT_CStradinRet").setSelectedKey(sap.ui.getCore().SelectedTradeStatus);
				if (sap.ui.getCore().SelectedTradeStatus == "Yes") {
					this.getView().byId("oSeleBtn").setVisible(true);
				} else {
					this.getView().byId("oSeleBtn").setVisible(false);
				}
			}
		},
		/*************************onSelectYes/No********************************/
		onVTCStir: function () {
			var selVT_CStradinRet = this.getView().byId("VT_CStradinRet").getSelectedKey();
			sap.ui.getCore().SelectedTradeStatus = this.getView().byId("VT_CStradinRet").getSelectedKey();
			if (selVT_CStradinRet == "Yes") {
				this.getView().byId("oSeleBtn").setVisible(true);
			} else if (selVT_CStradinRet == "No" && this.getView().byId("FromFourth").getText() != "FromPush") {

				this.getView().byId("FromFourth").setText("");
				this.getView().byId("oSeleBtn").setVisible(false);
				this.getView().byId("oOtherVehInfoid").setText("");
				this.getView().byId("vtnlabeid").setVisible(false);
				this.getView().byId("vtnid").setVisible(false);
				this.getView().byId("vtnid").setText("");
				this.getView().byId("moylablid").setVisible(false);
				this.getView().byId("yearid").setVisible(false);
				this.getView().byId("yearid").setText("");
				this.getView().byId("serielabelid").setVisible(false);
				this.getView().byId("seiresid").setVisible(false);
				this.getView().byId("seiresid").setText("");
				this.getView().byId("modlabelid").setVisible(false);
				this.getView().byId("modlid").setText("");
				this.getView().byId("modlid").setVisible(false);
				this.getView().byId("sufflabeid").setVisible(false);
				this.getView().byId("suffid").setText("");
				this.getView().byId("suffid").setVisible(false);
				this.getView().byId("apxlabelid").setVisible(false);
				this.getView().byId("apxid").setVisible(false);
				this.getView().byId("apxid").setText("");
				this.getView().byId("acclabelid").setVisible(false);
				this.getView().byId("accid").setText("");
				this.getView().byId("accid").setVisible(false);
				this.getView().byId("extcollabelid").setVisible(false);
				this.getView().byId("extcolod").setVisible(false);
				this.getView().byId("extcolod").setText("");
				this.getView().byId("ofvestats").setVisible(false);
				this.getView().byId("offeredStatus").setVisible(false);
				this.getView().byId("offeredStatus").setText("");
				this.getView().byId("offordetype").setVisible(false);
				this.getView().byId("oofferedOrdertype").setVisible(false);
				this.getView().byId("oofferedOrdertype").setText("");
				this.getView().byId("ctrtaid").setVisible(false);
				this.getView().byId("oCtraid").setVisible(false);
				//this.getView().byId("oCtraid").setText("");
				// this.getView().byId("fromLabeeid").setVisible(false);
				/*	this.getView().byId("labidtxt").setVisible(false);*/
				this.getView().byId("labetxteid").setVisible(false);
				// this.getView().byId("ototid").setVisible(false);
				/*	this.getView().byId("otitxt").setVisible(false);*/
				this.getView().byId("propetid").setVisible(false);
				this.getView().byId("perpid").setVisible(false);
				// this.getView().byId("frlabid").setVisible(false);
				this.getView().byId("fmlabid").setVisible(false);
				this.getView().byId("idlabeal").setVisible(false);
				// this.getView().byId("textide").setVisible(false);

				/*var oReceivedData = sap.ui.getCore().VehicheSearcResults[this.oReceivedDataString];
				var oModel = new sap.ui.model.json.JSONModel(oReceivedData);

				this.getView().setModel(oModel, "TradeModel");
				sap.ui.getCore().setModel(oModel, "TradeModel");
				this.getView().byId("SimpleFormDispla20").bindElement("TradeModel>/");*/
			} else if (this.getView().byId("FromFourth").getText() == "FromPush") {

				// this.getView().byId("FromFourth").setText("");
				this.getView().byId("oSeleBtn").setVisible(false);
				this.getView().byId("OtherVehInfoid").setText("");
				this.getView().byId("dealridreq").setVisible(false);
				this.getView().byId("dealrid").setVisible(false);
				this.getView().byId("vtnlabeidReq").setVisible(false);
				this.getView().byId("vinLabelId").setVisible(false);
				this.getView().byId("moyrLabelReq").setVisible(false);
				this.getView().byId("zzMoyr").setVisible(false);
				this.getView().byId("seriesLabelReq").setVisible(false);
				this.getView().byId("oSeries").setVisible(false);
				this.getView().byId("modLabelReq").setVisible(false);
				this.getView().byId("oZmodel").setVisible(false);
				this.getView().byId("sufLabelReq").setVisible(false);
				this.getView().byId("oZsuffix").setVisible(false);
				this.getView().byId("apxLabelReq").setVisible(false);
				this.getView().byId("oApx").setVisible(false);
				this.getView().byId("accLabelReq").setVisible(false);

				this.getView().byId("oAccesIn").setVisible(false);
				this.getView().byId("extLabelReq").setVisible(false);
				this.getView().byId("Zextcolo").setVisible(false);

				this.getView().byId("statusLabelReq").setVisible(false);
				this.getView().byId("oStatus").setVisible(false);
				this.getView().byId("ordLabelReq").setVisible(false);
				this.getView().byId("oOrdertype").setVisible(false);

				this.getView().byId("cetalabelid").setVisible(false);
				this.getView().byId("ctaid").setVisible(false);
				// this.getView().byId("fromLabeeid").setVisible(false);
				/*	this.getView().byId("labidtxt").setVisible(false);*/
				this.getView().byId("totxtid").setVisible(false);
				// this.getView().byId("ototid").setVisible(false);
				/*	this.getView().byId("otitxt").setVisible(false);*/
				this.getView().byId("prpdlabid").setVisible(false);
				this.getView().byId("prpid").setVisible(false);
				// this.getView().byId("frlabid").setVisible(false);
				this.getView().byId("otextlabel").setVisible(false);
				this.getView().byId("vtnidReq").setVisible(false);
				// this.getView().byId("textide").setVisible(false);

				/*var oReceivedData = sap.ui.getCore().VehicheSearcResults[this.oReceivedDataString];
				var oModel = new sap.ui.model.json.JSONModel(oReceivedData);

				this.getView().setModel(oModel, "TradeModel");
				sap.ui.getCore().setModel(oModel, "TradeModel");
				this.getView().byId("SimpleFormDispla20").bindElement("TradeModel>/");*/

			}

			/*	var selVT_CStradinRet = this.getView().byId("VT_CStradinRet").getSelectedKey();
				if (selVT_CStradinRet == "Yes") {
					this.getView().byId("oSeleBtn").setVisible(true);

				} else if (selVT_CStradinRet == "No") {
					this.getView().byId("oSeleBtn").setVisible(false);
				}*/

		},

		onAfterRendering: function () {
			var that = this;

		},

		onSelecveh: function () {
			
			this.getRouter().navTo("VehicleTrade_VehicleSelection", {
				SelectedVehicleFrom: "VehileTrade_CreateSingle"
			});
			// 			var that = this;
			// 			/*	sap.ui.core.BusyIndicator.show();     "MoyearCombo": MoyearCombo,
			// 				"SeriesCmbo": SeriesCmbo,
			// 				"McCmbo": McCmbo*/

			// 			var McCmbo = this.getOwnerComponent().SelectedMSMData[0].McCmbo;
			// 			this.SelectedExteriorColorCode = "";
			// 			this.SelectedTrimInteriorColor = "";
			// 			var SuffCmbo = this.getOwnerComponent().SelectedMSMData[0].SuffCmbo;
			// 			var MoyearCombo = this.getOwnerComponent().SelectedMSMData[0].MoyearCombo;
			// 			/*	var oDealer=sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].DealerCode;*/
			// 			var oDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;

			// 			var Series = this.getOwnerComponent().SelectedMSMData[0].SeriesCmbo;

			// 			var sLocation = window.location.host;
			// 			var sLocation_conf = sLocation.search("webide");

			// 			if (sLocation_conf == 0) {
			// 				this.sPrefix = "/vehicleLocatorNode";
			// 			} else {
			// 				this.sPrefix = "";

			// 			}

			// 			this.nodeJsUrl = this.sPrefix + "/node";
			// 			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_MASTER_SRV";

			// 			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

			// 			/*
			// 			 working#######
			// 			var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'" + McCmbo + "' and zzsuffix eq '" + SuffCmbo +
			// 				"' and zzmoyr eq '" + MoyearCombo + "' and kunnr eq '" + oDealer +
			// 				"'";*/
			// 			/*	var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq '"+McCmbo+"' and endswith (zzintcol,'"+this.intercolor+"') and zzsuffix eq '"+SuffCmbo+"' and zzmoyr eq '"+MoyearCombo+"'&$format=json";	*/

			// //on 1704 oData introduced the requesting dealer. 
			// 		var userAttributesModellen =  sap.ui.getCore().getModel("LoginuserAttributesModel").getData();
			// 			// var oDealer1 = userAttributesModellen[0].DealerCode;
			// 			// if (oDealer1 == undefined){
			// 			// 	oDealer1 = "";
			// 			// }
			//             var oDealer1 = this.RequestingDealerToSendToSAP;
			//                       // var oDealer1 = this.requestedDealerToSAP;
			//         		 	if(oDealer1.length == 10){
			// 		 	oDealer1=oDealer1.slice(-5);
			// 					 }	
			// 			var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate(Req_dealer='" + oDealer1 + "')/Set?$filter=kunnr eq '" + oDealer +
			// 				"'&$format=json";

			// 			$.ajax({
			// 				url: SeriesUrl,
			// 				type: "GET",
			// 				dataType: 'json',
			// 				xhrFields: //
			// 				{
			// 					withCredentials: true
			// 				},

			// 				success: function (odata, oresponse) {

			// 					var a = odata.d.results;

			// 					/*var filtered_ODealer = a.filter(function (x) {
			// 							return (x.kunnr==oDealer);
			// 						});*/
			// 					//	var Dealer = sap.ui.getCore().LoginDetails.DealerCode;
			// 					var userAttributesModellen = sap.ui.getCore().getModel("LoginuserAttributesModel").getData();
			// 					/*var Dealer=userAttributesModellen[0].DealerCode[0];*/
			// 					var Dealer = userAttributesModellen[0].DealerCode;
			// 					var FilterDelearNotnull = a.filter(function (x) {
			// 						return x.kunnr != null;
			// 					});
			// 					/*	var FilterDeleade_OrderTypefiltered_zone=FilterDeleade_OrderTypefilteNotnull.filter(function(x){return x.kunnr.slice(-5)==Dealer &&(x.zzordertype=="DM" ||x.zzordertype=="SO")});*/

			// 					//	var FilterDeleade_OrderTypefiltered_zone
			// 					var filtered_ODealer = FilterDelearNotnull.filter(function (x) {
			// 						return x.kunnr.slice(-5) == Dealer;
			// 					});
			// 					var ExcludeOrdType = [
			// 						"RS",
			// 						"F1",
			// 						"F2",
			// 						"F3",
			// 						"F4",
			// 						"F5",
			// 						"DM"
			// 					];
			// 					/*	var oExcludeOrdrtype = filtered_ODealer.filter(function (objFromA) {
			// 							return !ExcludeOrdType.find(function (objFromB) {
			// 								return objFromA.zzordertype === objFromB;
			// 							});
			// 						});*/

			// 					var oExcludeOrdrtype = [];
			// 					for (var i = filtered_ODealer.length - 1; i >= 0; --i) {
			// 						if (ExcludeOrdType.indexOf((filtered_ODealer[i].zzordertype)) == -1) {
			// 							oExcludeOrdrtype.push(filtered_ODealer[i]);
			// 						}
			// 					}

			// 					//        var oJsonModel = new sap.ui.model.json.JSONModel(oExcludeOrdrtype);
			// 					var IncludeOrdertype = oExcludeOrdrtype.filter(function (x) {
			// 						return (x.zzordertype == "SO" );
			// 					});
			// 					var oJsonModel = new sap.ui.model.json.JSONModel(IncludeOrdertype);
			// 					// need to change language - 2603				 
			// 					//for (var i =0; i< oJsonModel.oData.length; i++) {
			// 					//	oJsonModel.oData[i].mktg_desc_en = oJsonModel.oData[i].mktg_desc_fr;  //
			// 					//	oJsonModel.oData[i].model_desc_en = oJsonModel.oData[i].model_desc_fr;  //
			// 					//	oJsonModel.oData[i].mrktg_int_desc_en = oJsonModel.oData[i].mrktg_int_desc_fr; 
			// 					//	oJsonModel.oData[i].suffix_desc_en = oJsonModel.oData[i].suffix_desc_fr; 
			// 					//	oJsonModel.oData[i].zzseries_desc_en = oJsonModel.oData[i].zzseries_desc_fr; 
			// 					//}

			// 					//	var oJsonModel = new sap.ui.model.json.JSONModel(IncludeOrdertype);
			// 					/*var includeDnc = oExcludeOrdrtype.filter(function (x) {
			// 										return x.dnc_ind == "Y";
			// 									});
			// 									var includeHoldStatus = includeDnc.filter(function (x) {
			// 										return x.Hold_stat == "Y";
			// 									});
			// 									var oJsonModel = new sap.ui.model.json.JSONModel(includeHoldStatus);*/
			// 					//comment this line

			// 					///////

			// 				// for dnc ind lets put that as DNC

			// 								//  put the DNC indicator to the screen. 
			// 				// var oModelVehicleSelectTable = this.getView().getModel("vehicleSelectTableModel");
			// 				// var oModelVehicleSelectTableData = this.getView().getModel("vehicleSelectTableModel").getData();

			// 				// for (var i = 0; i < oJsonModel.length; i++) {
			// 				// 	if (oJsonModel[i].dnc_ind == "Y") {
			// 				// 		oJsonModel[i].zzordertype = "DNC";
			// 				// 	}
			// 				// }
			// 				for (var i = 0; i < oJsonModel.oData.length; i++) {
			// 					if (oJsonModel.oData[i].dnc_ind == "Y") {
			// 						oJsonModel.oData[i].zzordertype = "DNC";
			// 					}
			// 				}

			// 					oJsonModel.setSizeLimit(15000);
			// 					sap.ui.getCore().setModel(oJsonModel, "oVehicleSelectionResults");
			// 					that.getRouter().navTo("VehicleTrade_VehicleSelection", {
			// 						SelectedVehicleFrom: "VehileTrade_CreateSingle"
			// 					});
			// 					/*  sap.ui.core.BusyIndicator.hide();*/

			// 				},
			// 				error: function () {
			// 					that.getRouter().navTo("VehicleTrade_VehicleSelection", {
			// 						SelectedVehicleFrom: "VehileTrade_CreateSingle"
			// 					});
			// 					/*	 sap.ui.core.BusyIndicator.hide();*/
			// 				}
			// 			});

		},
		simulateServerRequest: function () {
			// simulate a longer running operation
			this._oBusyDialog.close();

		},
		onOpenDialog: function () {
			// load BusyDialog fragment asynchronously

			if (!this._oBusyDialog) {

				this._oBusyDialog = sap.ui.xmlfragment("vehicleLocator.fragment.BusyDialog", this);

				this.getView().addDependent(this._oBusyDialog);

			}
			this._oBusyDialog.open();

		},

		onRequestVT: function () {
			

			if (this.getView().byId("VT_CStradinRet").getSelectedKey() == "Yes" && this.getView().byId("FromFourth").getText() == "") {
				var sTextFromi18n = this.getView().getModel("i18n").getResourceBundle().getText("pleaseSelectVehicle");

				sap.m.MessageBox.error(sTextFromi18n);

				return;

			}

			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
					/*	pattern: "yyyy-MM-dd"*/

			});

			//------ requested dealer info//
			var TradeRequest = this.getView().byId("VT_CStradinRet").getSelectedKey();
			//pleaseSelectTradeInReturn
			var sTextFromi18nError = this.getView().getModel("i18n").getResourceBundle().getText("pleaseSelectTradeInReturn");
			if (TradeRequest == "") {
				sap.m.MessageBox.error(sTextFromi18nError); //"Please select Trade in Return"
				return;
			} else {
				var that = this;
				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");

				if (sLocation_conf == 0) {
					this.sPrefix = "/VehicleLocator_Xsodata";
				} else {
					this.sPrefix = "";

				}
				this.nodeJsUrl = this.sPrefix;
				//sap.ui.core.BusyIndicator.show(0);
				// that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeRequest";
				//  date 14th June.  The above odata call eventually going to cause performance bottle neck the objective here is to get the highest trade id and this can be done with the 
				// below syntax. 
				//https://uat-vehiclelocatorandtrade.scp.toyota.ca/xsodata/vehicleTrade_SRV.xsodata/TradeRequest?&$orderby=Trade_Id%20desc&$top=1
				that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeRequest?&$orderby=Trade_Id%20desc&$top=1";

				$.ajax({
					url: that.oDataUrl,
					method: "GET",
					async: false,
					dataType: "json",

					success: function (oData) {

						
						var Data = oData.d.results;

						function dynamicSort(property) {
							var sortOrder = 1;
							if (property[0] === "-") {
								sortOrder = -1;
								property = property.substr(1);
							}
							return function (a, b) {
								var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
								return result * sortOrder;
							};
						};
						that.onOpenDialog();

						Data.sort(dynamicSort("Trade_Id"));
						if (Data.length != 0) {
							var databasevalue = Data[Data.length - 1].Trade_Id.substr(2, 8);
							var incrementvalue = (+databasevalue) + 1;

							// insert leading zeroes with a negative slice
							incrementvalue = ("00000" + incrementvalue).slice(-6);
							var Trade_Id = "TR" + incrementvalue;
						} else {
							var Trade_Id = "TR000001";
						}

						if (that.getView().byId("VT_CStradinRet").getSelectedKey() == "Yes") {
							var Trade_Return = "Y";
						} else if (that.getView().byId("VT_CStradinRet").getSelectedKey() == "No") {
							var Trade_Return = "N";
						}

						var Trade_Status = "S";

						var Requesting_Dealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;

						var Requesting_Dealer_Name = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName;

						//var Requested_Vtn = that.getView().byId("vtnid").getText();
						var Requested_Vtn = that.getView().getModel("TradeModel").getData().zzvtn;
						var Offered_Vtn = that.getView().byId("vtnid").getText();
						var VIN = that.getView().byId("vinVinIdOff").getText(); 
						var mmsta = that.getView().getModel("TradeModel").VehicleTradeVehicle.getData().mmsta;          //that.getView().getModel("TradeModel").getData().vhvin;      //changes by swetha for DMND0003618
						if ( mmsta >= "M110" && mmsta.slice(0,1) != "P")  {                        //changes by swetha for mmsta value for DMND0003618
							VIN = VIN;	
						} else {
							VIN = "";
						}
						var DateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "yyyy-MM-dd"
						});

						var Req_Current_ETA_FromData = that.getView().byId("ctaid").getText();
						if (Req_Current_ETA_FromData != "") {
							var Req_Current_ETA_From = new Date(oDateFormat.format(new Date(Req_Current_ETA_FromData)));
						} else {
							var Req_Current_ETA_From = "0000-00-00T00:00:00";
						}

						var Req_Current_ETA_ToDate = that.getView().byId("totxtid").getText();
						var Req_Current_ETA_ToDate = Req_Current_ETA_ToDate.replace("To", "").replace(":", "").replace(" ", "");
						while(Req_Current_ETA_ToDate.includes(" ")){
							Req_Current_ETA_ToDate = Req_Current_ETA_ToDate.replace(" ", "");
						}

						var Req_Current_ETA_ToDate = Req_Current_ETA_ToDate.replace("À", "").replace(":", "").replace(" ", "");
						if (Req_Current_ETA_ToDate != "" && Req_Current_ETA_ToDate != " ") {
							var Req_Current_ETA_To = new Date(oDateFormat.format(new Date(Req_Current_ETA_ToDate)));
						} else {
							var Req_Current_ETA_To = "0000-00-00T00:00:00";
						}

						var Req_Proposed_ETA_FromDate = that.getView().byId("prpid").getText();

						if (Req_Proposed_ETA_FromDate != "") {
							var Req_Proposed_ETA_From = new Date(oDateFormat.format(new Date(Req_Proposed_ETA_FromDate)));
						} else {
							var Req_Proposed_ETA_From = "0000-00-00T00:00:00";
						}
						var Req_Proposed_ETA_ToDate = that.getView().byId("otextlabel").getText();
						var Req_Proposed_ETA_ToDate = Req_Proposed_ETA_ToDate.replace("To", "").replace(":", "").replace(" ", "");
						var Req_Proposed_ETA_ToDate = Req_Proposed_ETA_ToDate.replace("À", "").replace(":", "").replace(" ", "");
						while(Req_Proposed_ETA_ToDate.includes(" ")){
							Req_Proposed_ETA_ToDate = Req_Proposed_ETA_ToDate.replace(" ", "");
						}
						if (Req_Proposed_ETA_ToDate != "") {
							var Req_Proposed_ETA_To = new Date(oDateFormat.format(new Date(Req_Proposed_ETA_ToDate)));
						} else {
							var Req_Proposed_ETA_To = "0000-00-00T00:00:00";
						}

						var Off_Current_ETA_FromDate = that.getView().byId("oCtraid").getText();
						if (Off_Current_ETA_FromDate != "") {
							var Off_Current_ETA_From = new Date(oDateFormat.format(new Date(Off_Current_ETA_FromDate)));
						} else {
							var Off_Current_ETA_From = "0000-00-00T00:00:00";
						}
						var Off_Current_ETA_ToDate = that.getView().byId("labetxteid").getText();
						var Off_Current_ETA_ToDate = Off_Current_ETA_ToDate.replace("To", "").replace(":", "").replace(" ", "");
						var Off_Current_ETA_ToDate = Off_Current_ETA_ToDate.replace("À", "").replace(":", "").replace(" ", "");
						while(Off_Current_ETA_ToDate.includes(" ")){
							Off_Current_ETA_ToDate = Off_Current_ETA_ToDate.replace(" ", "");
						}

						if (Off_Current_ETA_ToDate != "") {
							var Off_Current_ETA_To = new Date(oDateFormat.format(new Date(Off_Current_ETA_ToDate)));
						} else {
							var Off_Current_ETA_To = "0000-00-00T00:00:00";
						}

						var Off_Proposed_ETA_FromDate = that.getView().byId("perpid").getText();
						if (Off_Proposed_ETA_FromDate != "") {
							var Off_Proposed_ETA_From = new Date(oDateFormat.format(new Date(Off_Proposed_ETA_FromDate)));
						} else {
							var Off_Proposed_ETA_From = "0000-00-00T00:00:00";
						}

						var Off_Proposed_ETA_ToDate = that.getView().byId("idlabeal").getText();
						var Off_Proposed_ETA_ToDate = Off_Proposed_ETA_ToDate.replace("To", "").replace(":", "").replace(" ", "");
						var Off_Proposed_ETA_ToDate = Off_Proposed_ETA_ToDate.replace("À", "").replace(":", "").replace(" ", "");
						while(Off_Proposed_ETA_ToDate.includes(" ")){
							Off_Proposed_ETA_ToDate = Off_Proposed_ETA_ToDate.replace(" ", "");
						}
			
						if (Off_Proposed_ETA_ToDate != "") {
							var Off_Proposed_ETA_To = new Date(oDateFormat.format(new Date(Off_Proposed_ETA_ToDate)));
						} else {
							var Off_Proposed_ETA_To = "0000-00-00T00:00:00";
						}
						var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
						var LoggedinUserLname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
						var Created_By = LoggedinUserFname + LoggedinUserLname;

						function truncateString(str, num) {
							if (num > str.length) {
								return str;
							} else {
								str = str.substring(0, num);
								return str;
							}

						}

						Created_By = truncateString(Created_By, 12);
						var Created_On = new Date();

						var estTimeZone = moment.tz(Created_On, "America/New_York");
						Created_On = moment(estTimeZone).format('YYYY-MM-DD');

						// Created_On = oDateFormat.format(new Date(Created_On));

						var Changed_on = new Date();
						Changed_on = moment(estTimeZone).format('YYYY-MM-DD');

						var Requested_Dealer = that.getView().getModel("TradeModel").oData.kunnr;
						var Requested_Dealer_Name = that.getView().byId("dealrid").getText().substr(that.getView().byId("dealrid").getText().indexOf(
							"-") + 1).trim();
						if (that.getView().byId("FromFourth").getText() == "FromPush") {
							var Requested_Dealer = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.kunnr;
							var Requested_Dealer_Name = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.name1;

							Created_By = truncateString(Requested_Dealer_Name, 12);
						}

						// this.getView().byId("FromFourth").setText("");
						that.getView().byId("oSeleBtn").setVisible(false);
						that.getView().byId("OtherVehInfoid").setText("");
						that.getView().byId("vtnlabeidReq").setVisible(false);
						that.getView().byId("vinLabelId").setVisible(false);
						that.getView().byId("moyrLabelReq").setVisible(false);
						that.getView().byId("zzMoyr").setVisible(false);
						that.getView().byId("seriesLabelReq").setVisible(false);
						that.getView().byId("oSeries").setVisible(false);
						that.getView().byId("modLabelReq").setVisible(false);
						that.getView().byId("oZmodel").setVisible(false);
						that.getView().byId("sufLabelReq").setVisible(false);
						that.getView().byId("oZsuffix").setVisible(false);
						that.getView().byId("apxLabelReq").setVisible(false);
						that.getView().byId("oApx").setVisible(false);
						that.getView().byId("accLabelReq").setVisible(false);

						that.getView().byId("oAccesIn").setVisible(false);
						that.getView().byId("extLabelReq").setVisible(false);
						that.getView().byId("Zextcolo").setVisible(false);

						that.getView().byId("statusLabelReq").setVisible(false);
						that.getView().byId("oStatus").setVisible(false);
						that.getView().byId("ordLabelReq").setVisible(false);
						that.getView().byId("oOrdertype").setVisible(false);

						that.getView().byId("cetalabelid").setVisible(false);
						that.getView().byId("ctaid").setVisible(false);
						// this.getView().byId("fromLabeeid").setVisible(false);
						/*	this.getView().byId("labidtxt").setVisible(false);*/
						that.getView().byId("totxtid").setVisible(false);
						// this.getView().byId("ototid").setVisible(false);
						/*	this.getView().byId("otitxt").setVisible(false);*/
						that.getView().byId("prpdlabid").setVisible(false);
						that.getView().byId("prpid").setVisible(false);
						// this.getView().byId("frlabid").setVisible(false);
						that.getView().byId("otextlabel").setVisible(false);
						that.getView().byId("vtnidReq").setVisible(false);
						// this.getView().byId("textide").setVisible(false);

						/*var oReceivedData = sap.ui.getCore().VehicheSearcResults[this.oReceivedDataString];
						var oModel = new sap.ui.model.json.JSONModel(oReceivedData);

						this.getView().setModel(oModel, "TradeModel");
						sap.ui.getCore().setModel(oModel, "TradeModel");
						this.getView().byId("SimpleFormDispla20").bindElement("TradeModel>/");*/

						var oEntry = {

							"Trade_Id": Trade_Id,
							"Trade_Status": Trade_Status,
							"Requesting_Dealer": Requesting_Dealer,
							"Requesting_Dealer_Name": Requesting_Dealer_Name.substring(0, 35), //str.substring(0, 10);
							"Requested_Vtn": Requested_Vtn,
							"Offered_Vtn": Offered_Vtn,
							"Trade_Return": Trade_Return,
							"Req_Current_ETA_From": Req_Current_ETA_From,
							"Req_Current_ETA_To": Req_Current_ETA_To,
							"Req_Proposed_ETA_From": Req_Proposed_ETA_From,
							"Req_Proposed_ETA_To": Req_Proposed_ETA_To,
							"Off_Current_ETA_From": Off_Current_ETA_From,
							//"VIN": VIN,                     //changes by swetha for DMND0003618 test
							"Off_Current_ETA_To": Off_Current_ETA_To,
							"Off_Proposed_ETA_From": Off_Proposed_ETA_From,
							"Off_Proposed_ETA_To": Off_Proposed_ETA_To,
							"Created_By": Created_By,
							"Created_On": new Date(Created_On),
							"Changed_on": new Date(Changed_on),
							"Requested_Dealer": Requested_Dealer,
							"Requested_Dealer_Name": Requested_Dealer_Name.substring(0, 35)

						};

						var sLocation = window.location.host;
						var sLocation_conf = sLocation.search("webide");

						if (sLocation_conf == 0) {
							that.sPrefix = "/VehicleLocator_Xsodata";
						} else {
							that.sPrefix = "";

						}
						that.nodeJsUrl = that.sPrefix;
						that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

						that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
						that.oDataModel.setHeaders({
							"Content-Type": "application/json",
							"X-Requested-With": "XMLHttpRequest",
							"DataServiceVersion": "2.0",
							"Accept": "application/json",
							"Method": "POST"
						});
							
						that.oDataModel.create("/TradeRequest", oEntry, null, function (s) {
							
							// Refreshing XsOdata model after create call
							//that.getOwnerComponent().getModel("xsodata").refresh();
							that.simulateServerRequest();
							//	that.getView().byId("oTrdareqstat").setText("Request Sent");
						

							//	sap.ui.core.BusyIndicator.hide();
							//	that.getRouter().navTo("VehicleTrade_Summary");
						}, function (err) {
							MessageBox.error(JSON.parse(err.response.body).error.message.value);
							that.simulateServerRequest();
							//sap.ui.core.BusyIndicator.hide();
						});
						if (that.getView().byId("oTypeHere").getValue() != "" && that.getView().byId("oTypeHere").getValue() != " ") {
								that.TradeComment(oEntry);
							}
							//	if(that.getView().byId("FromFourth").getText()=="FromFourth"){
							that.TradeVehcles(oEntry);
							//	}
							that.TradeStatus(oEntry);
							/*	that.VehicleTrade_Summary();*/

					},
					error: function (err) {
						//	that.simulateServerRequest();
						MessageBox.error(JSON.parse(err.response.body).error.message.value);

					}
				});

			}

		},

		TradeComment: function (oEntry) {

			var that = this;
			that.Trade_Id = oEntry.Trade_Id;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				this.sPrefix = "";

			}
			this.nodeJsUrl = this.sPrefix;
			// that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeComment";

			// https://uat-vehiclelocatorandtrade.scp.toyota.ca/xsodata/vehicleTrade_SRV.xsodata/TradeComment(Trade_Id='TR000086',Comment_Id='01')

			that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeComment?$filter=Trade_Id eq '" + that.Trade_Id + "'";

			$.ajax({
				url: that.oDataUrl,
				method: "GET",
				async: false,
				dataType: "json",

				success: function (oData) {

					
					var Data = oData.d.results;
					if (oData.d.results.length != 0) {
						var CommentData = oData.d.results;

						function dynamicSort(property) {
							var sortOrder = 1;
							if (property[0] === "-") {
								sortOrder = -1;
								property = property.substr(1);
							}
							return function (a, b) {
								var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
								return result * sortOrder;
							};
						};

						CommentData.sort(dynamicSort("Comment_Id"));
						if (CommentData.length != 0) {
							var databasevalue = CommentData[CommentData.length - 1].Comment_Id;
							var incrementvalue = (+databasevalue) + 1;

							// insert leading zeroes with a negative slice
							that.oComment_Id = incrementvalue = ("00" + incrementvalue).slice(-2);
						} else {
							that.oComment_Id = "01";
						}
					}
					that.TradeComment_id();
				},
				error: function () {
					// if resource is not found just add the comment Id here
					that.oComment_Id = "01";
					that.TradeComment_id();

				}
			});

		},
		TradeComment_id: function () {
			var that = this;
			var Trade_Id = that.Trade_Id;
			var oCommentText = that.getView().byId("oTypeHere").getValue();

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
					/*	pattern: "yyyy-MM-dd"*/
			});
			/*	var oCommentdate = new Date(oDateFormat.format(new Date()));
				  oCommentdate.setDate(oCommentdate.getDate() + 1);*/
			var oCommentdate = oDateFormat.format(new Date());

			/*	var Created_By = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');*/

			/*	var Created_By = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');*/
			var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
			var LoggedinUserLname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
			var Created_By = LoggedinUserFname + LoggedinUserLname;

			function truncateString(str, num) {
				if (num > str.length) {
					return str;
				} else {
					str = str.substring(0, num);
					return str;
				}

			}

			Created_By = truncateString(Created_By, 12);

			/*this.getView().byId("oDealersearchresults").setText(LoggedInDealer);*/

			if (that.oComment_Id == undefined) {
				that.oComment_Id = "01"; // mandatory field
			}

			var oTradeComment = {

				"Trade_Id": Trade_Id,
				"Comment_Id": that.oComment_Id,
				"Comment_Txt": oCommentText,
				/*"Comment_Date": oCommentdate,*/
				"Comment_Date": new Date(oCommentdate),
				"Created_By": Created_By

			};

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				that.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				that.sPrefix = "";

			}
			that.nodeJsUrl = that.sPrefix;
			that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "POST"
			});

			that.oDataModel.create("/TradeComment", oTradeComment, null, function (s) {
				that.getView().byId("oTypeHere").setValue("");

			}, function (err) {
				that.simulateServerRequest();
				MessageBox.error(JSON.parse(err.response.body).error.message.value);

			});

		},
		TradeVehcles: function (oEntry) {

			var that = this;
			var Trade_Id = oEntry.Trade_Id;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"

			});
			var oCommentdate = new Date(oDateFormat.format(new Date()));
			oCommentdate.setDate(oCommentdate.getDate() + 1);
			var oVehicleDetails = [];
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				that.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				that.sPrefix = "";

			}
			that.nodeJsUrl = that.sPrefix;
			that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "POST"
			});

			if (that.getView().byId("FromFourth").getText() != "FromPush") {

				var oSuffixReq = that.getView().byId("oZsuffix").getText().split("-")[0].trim();
				var omodelReq = that.getView().byId("oZmodel").getText().split("-")[0].trim();
				var omodelYearReq = that.getView().byId("zzMoyr").getText();
				var oApxReq = that.getView().byId("oApx").getText();
				var oSeriesReq = that.getView().getModel("TradeModel").getData().zzseries;
				var oexteriorReq = that.getView().byId("Zextcolo").getText().split("-")[0].trim();
				var ointeriorReq = that.getView().getModel("TradeModel").oData.zzintcol;
				var ovtnReq = that.getView().getModel("TradeModel").oData.zzvtn;
				var ovinReq = that.getView().getModel("TradeModel").oData.vhvin;       //changes by swetha for DMND0003618 on 4/1/23
				
			/*	if (!that.getView().getModel("TradeModel").oData.dispalyVin1) {
					ovinReq = ""
				} else {
					ovinReq = that.getView().getModel("TradeModel").oData.vhvin;
				}*/

				var accIns = that.getView().byId("oAccesIn").getText();
				if (accIns == 'Yes') {
					accIns = 'Y';
				} else {
					accIns = 'N';
				}
				var ostatusReq = that.getView().getModel("TradeModel").getData().zz_trading_ind;

				var oOrdertypeReq = that.getView().getModel("TradeModel").getData().zzordertype;
				oOrdertypeReq = oOrdertypeReq.substring(0, 2);

				var oDNCreq = that.getView().getModel("TradeModel").getData().dnc_ind;

				var oEntry2 = {
					APX: oApxReq,
					DNC: oDNCreq,
					Ext_Colour: oexteriorReq,
					Int_Colour: ointeriorReq,
					Model: omodelReq,
					Model_Year: omodelYearReq,
					Order_Type: oOrdertypeReq,
					Series: oSeriesReq,
					Status: ostatusReq,
					Suffix: oSuffixReq,
					VTN: ovtnReq,
					VIN: ovinReq,
					AccessoryInstalled: accIns
				};
				oEntry2["Trade_Id"] = oEntry.Trade_Id;
				oVehicleDetails.push(oEntry2);
				for (var i = 0; i < oVehicleDetails.length; i++) {
					that.oDataModel.create("/TradeVehicles", oVehicleDetails[i], null, function (s) {
						/*	alert("ok");*/
						//	MessageBox.error(JSON.parse(err.response.body).error.message.value);
						//sap.ui.core.BusyIndicator.hide();
					}, function (err) {
						that.simulateServerRequest();
						MessageBox.error(JSON.parse(err.response.body).error.message.value);

					});
				}
			}
			if ((that.getView().byId("FromFourth").getText() == "FromFourth") || (that.getView().byId("FromFourth").getText() == "FromPush")) {
				oVehicleDetails = [];
				var Suffix = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzsuffix;

				var intColor = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzintcol;

				var model = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.matnr;
				var modelYear = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzmoyr;
				var Apx = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzapx;
				var Series = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzseries;
				var exterior = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzextcol;
				var vtn = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzvtn;
				that.vin = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.vhvin;          
				var accInstalled = that.getView().byId("accid").getText();
				if (accInstalled == "Yes") {
					accInstalled = 'Y';
				} else {
					accInstalled = 'N';
				}
				var ostatus = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zz_trading_ind;
				var oOrdertype = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzordertype;
				oOrdertype = oOrdertype.substring(0, 2);
				var DNC = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.dnc_ind;
				var sPrefix = "";
				if (sLocation_conf == 0) {
					sPrefix = "/vehicleLocatorNode";
				} else {
					sPrefix = "";

				}
				var nodeJsUrl = sPrefix + "/node"; //local run comment before deployment

				var oDataUrl = nodeJsUrl + "/Z_VEHICLE_MASTER_SRV";

				var oDealer = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.kunnr;
				if (oDealer.length == 10) {
					oDealer = oDealer.slice(-5);
				}
				sap.ui.core.BusyIndicator.show(0);
				var that = this;
				var SeriesUrl = oDataUrl + "/ZVMS_CDS_ETA_consolidate('" + oDealer + "')/Set?$filter=vhvin eq '" + that.vin +
					"'&$format=json";

				$.ajax({
					url: SeriesUrl,
					type: "GET",
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},

					success: function (odata, oresponse) {
						var a = odata.d.results;
						var patt1 = /^P/;

						for (var k = 0; k < a.length; k++) {
							if (vtn == a[k].zzvtn) {

								if (a[k].mmsta < "M110" || patt1.test(a[k].mmsta) || a[k].vhvin == "") {     //removed (a[k].mmsta < "M275" ||)  changes by swetha for DMND0003618 on 3/1/2023
									that.vin = "";
								}

							}
						}
						var oEntry1 = {
							APX: Apx,
							DNC: DNC,
							Ext_Colour: exterior,
							Int_Colour: intColor,
							Model: model,
							Model_Year: modelYear,
							Order_Type: oOrdertype,
							Series: Series,
							Status: ostatus,
							Suffix: Suffix,
							VTN: vtn,
							VIN: that.vin,
							AccessoryInstalled: accInstalled
						};
						oEntry1["Trade_Id"] = oEntry.Trade_Id;
						oVehicleDetails.push(oEntry1);

						for (var i = 0; i < oVehicleDetails.length; i++) {
							that.oDataModel.create("/TradeVehicles", oVehicleDetails[i], null, function (s) {
								/*	alert("ok");*/
								//	MessageBox.error(JSON.parse(err.response.body).error.message.value);
								//sap.ui.core.BusyIndicator.hide();
							}, function (err) {
								that.simulateServerRequest();
								MessageBox.error(JSON.parse(err.response.body).error.message.value);

							});
						}

						sap.ui.core.BusyIndicator.hide();

					},
					error: function (s, result) {
						
						var a = s;
						sap.ui.core.BusyIndicator.hide();

					}
				});

			}

			/*	that.oDataModel.create("/TradeVehicles", oEntry1, null, function (s) {*/

		},

		TradeStatus: function (oEntry) {

			var that = this;
			var Trade_Id = oEntry.Trade_Id;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
					/*pattern: "yyyy-MM-dd"*/
			});
			var oCommentdate = oDateFormat.format(new Date());
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				that.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				that.sPrefix = "";

			}
			that.nodeJsUrl = that.sPrefix;
			that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "POST"
			});

			//	var Spars = sap.ui.getCore().getConfiguration().getLanguage();
			//	var Spars = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language.slice(0, 1); //GSR
			var Spars;
			if (that.sCurrentLocaleD == "French") {
				Spars = "F";
			} else {
				Spars = "E";
			}

			// if (Spars != "E") {
			// 	Spars = "F";
			// } else {
			// 	Spars = "E";
			// }
			//	var oVTN = that.getView().byId("vtnid").getText();

			// ENTRY1 VALUES DESCRIPTION;
			var Tradestatus = [];
			if (that.getView().byId("FromFourth").getText() != "FromPush") {
				var oVTN = that.getView().getModel("TradeModel").getData().zzvtn;
				var oModel_DescReq = that.getView().getModel("TradeModel").getData().model_desc_en;
				var oSeries_DescReq = that.getView().getModel("TradeModel").getData().zzseries_desc_en;
				var oSuffix_DescReq = that.getView().getModel("TradeModel").getData().suffix_desc_en;
				var oInt_Colour_DescReq = that.getView().getModel("TradeModel").getData().mrktg_int_desc_en;
				var oExt_Colour_DescReq = that.getView().getModel("TradeModel").getData().mktg_desc_en;

				var Entry1 = {

					SPRAS: "E",
					Model_Desc: oModel_DescReq.substring(0, 40),
					Series_Desc: oSeries_DescReq.substring(0, 50),
					Suffix_Desc: oSuffix_DescReq.substring(0, 30),
					Int_Colour_Desc: oInt_Colour_DescReq.substring(0, 30),
					Ext_Colour_Desc: oExt_Colour_DescReq.substring(0, 50),

				};
				Entry1["Trade_Id"] = oEntry.Trade_Id;
				Entry1["VTN"] = oVTN;
				Tradestatus.push(Entry1);
				var oVTN = that.getView().getModel("TradeModel").oData.zzvtn;
				// var oModel_DescReqF = that.getView().getModel("TradeModel").getData().model_desc_en;
				var oModel_DescReqF = that.getView().getModel("TradeModel").getData().model_desc_fr;
				var oSeries_Desc1ReqF = that.getView().getModel("TradeModel").getData().zzseries_desc_fr;
				var oSuffix_Desc1ReqF = that.getView().getModel("TradeModel").getData().suffix_desc_fr;
				var oInt_Colour_Desc1ReqF = that.getView().getModel("TradeModel").getData().mrktg_int_desc_fr;
				var oExt_Colour_Desc1ReqF = that.getView().getModel("TradeModel").getData().mktg_desc_fr;

				var Entry2 = {

					SPRAS: "F",
					Model_Desc: oModel_DescReqF.substring(0, 40),
					Series_Desc: oSeries_Desc1ReqF.substring(0, 50),
					Suffix_Desc: oSuffix_Desc1ReqF.substring(0, 30),
					Int_Colour_Desc: oInt_Colour_Desc1ReqF.substring(0, 30),
					Ext_Colour_Desc: oExt_Colour_Desc1ReqF.substring(0, 50)

				};
				Entry2["Trade_Id"] = oEntry.Trade_Id;
				Entry2["VTN"] = oVTN;
				Tradestatus.push(Entry2);
				for (var i = 0; i < Tradestatus.length; i++) {
					that.oDataModel.create("/TradeVehicleDesc", Tradestatus[i], null, function (s) {
						//	MessageBox.error(JSON.parse(err.response.body).error.message.value);

						that.getRouter().navTo("VehicleTrade_Summary", {
							DataClicked: "Yes"
						});
						that.simulateServerRequest();
					}, function (err) {
						that.simulateServerRequest();
						MessageBox.error(JSON.parse(err.response.body).error.message.value);

					});
				}
			}
			if ((that.getView().byId("FromFourth").getText() == "FromFourth") || (that.getView().byId("FromFourth").getText() == "FromPush")) {
				Tradestatus = [];

				var oVTN = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzvtn;
				var oModel_Desc = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.model_desc_en;
				var oSeries_Desc = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzseries_desc_en;
				var oSuffix_Desc = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.suffix_desc_en;
				var oInt_Colour_Desc = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.mrktg_int_desc_en;
				var oExt_Colour_Desc = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.mktg_desc_en;

				var Entry3 = {

					SPRAS: "E",
					Model_Desc: oModel_Desc.substring(0, 40),
					Series_Desc: oSeries_Desc.substring(0, 50),
					Suffix_Desc: oSuffix_Desc.substring(0, 30),
					Int_Colour_Desc: oInt_Colour_Desc.substring(0, 30),
					Ext_Colour_Desc: oExt_Colour_Desc.substring(0, 50)

				};
				Entry3["Trade_Id"] = oEntry.Trade_Id;
				Entry3["VTN"] = oVTN;
				Tradestatus.push(Entry3);
				var oModel_Desc1 = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.model_desc_fr;
				var oSeries_Desc1 = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzseries_desc_fr;
				var oSuffix_Desc1 = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.suffix_desc_fr;
				var oInt_Colour_Desc1 = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.mrktg_int_desc_fr;
				var oExt_Colour_Desc1 = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.mktg_desc_fr;

				var Entry4 = {

					SPRAS: "F",
					Model_Desc: oModel_Desc1.substring(0, 40),
					Series_Desc: oSeries_Desc1.substring(0, 50),
					Suffix_Desc: oSuffix_Desc1.substring(0, 30),
					Int_Colour_Desc: oInt_Colour_Desc1.substring(0, 30),
					Ext_Colour_Desc: oExt_Colour_Desc1.substring(0, 50)

				};
				Entry4["Trade_Id"] = oEntry.Trade_Id;
				Entry4["VTN"] = oVTN;
				Tradestatus.push(Entry4);

				for (var i = 0; i < Tradestatus.length; i++) {
					that.oDataModel.create("/TradeVehicleDesc", Tradestatus[i], null, function (s) {
						//	MessageBox.error(JSON.parse(err.response.body).error.message.value);

						that.getRouter().navTo("VehicleTrade_Summary", {
							DataClicked: "Yes"
						});
						that.simulateServerRequest();
					}, function (err) {
						that.simulateServerRequest();
						MessageBox.error(JSON.parse(err.response.body).error.message.value);

					});
				}

			}

		},
		onDummySummary: function () {
			
			this.getRouter().navTo("VehicleTrade_Summary");

		},
		_setTheLanguage: function (oEvent) {

			// var oI18nModel = new sap.ui.model.resource.ResourceModel({
			// 	bundleUrl: "i18n/i18n.properties"
			// });
			// this.getView().setModel(oI18nModel, "i18n");

			//  get the locale to determine the language. 
			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				var sSelectedLocale = "EN"; // default is english 
			}

			//selected language.	
			// if (window.location.search == "?language=fr") {
			if (sSelectedLocale == "fr") {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")

				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'FR';
				this.sCurrentLocaleD = 'French';

			} else {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")

				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';
				this.sCurrentLocaleD = 'English';

			}

			var oModeli18n = this.getView().getModel("i18n");
			this._oResourceBundle = oModeli18n.getResourceBundle();
		},

		_setTheLogo: function (oEvent) {

			// if (userDetails[0].UserType == 'Dealer') {

			var isDivisionSent = window.location.search.match(/Division=([^&]*)/i);
			if (isDivisionSent) {
				this.sDivision = window.location.search.match(/Division=([^&]*)/i)[1];

				if (this.sDivision == '10') // set the toyoto logo
				{
					var currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "Images/toyota_logo_colour.png");

				} else { // set the lexus logo
					var currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "Images/i_lexus_black_full.png");

					// }
				}
			}

		},
		handleLiveChangeText: function (oEvent) {
			var oTextArea = oEvent.getSource(),
				iValueLength = oTextArea.getValue().length,
				iMaxLength = oTextArea.getMaxLength(),
				sState = iValueLength > iMaxLength ? "Warning" : "None";

			oTextArea.setValueState(sState);
		},
		onNavBackToSearchResult: function (oEvent) {

			var Obj = {};
			Obj.selectedSuffix = "";
			Obj.LoginUser = "";
			sap.ui.core.BusyIndicator.hide();
			this.getRouter().navTo("VehicleSearcResults", {

				LoginUser: JSON.stringify(Obj)

			});

		}

	});
});