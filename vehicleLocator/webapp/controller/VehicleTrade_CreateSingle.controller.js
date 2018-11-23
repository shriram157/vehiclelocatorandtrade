sap.ui.define([
	/*"sap/ui/core/mvc/Controller"*/
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageBox',
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, ResourceModel, MessageBox, History) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleTrade_CreateSingle", {

		onInit: function () {
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
			this.getRouter().attachRouteMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function (oEvent) {

			var oReceivedDataString = oEvent.getParameter("arguments").SelectedTrade;
			if (oReceivedDataString != undefined) {
				if (oReceivedDataString != "VehicleTradeVehicle") {
					this.getView().byId("oOtherVehInfoid").setText("");
						this.getView().byId("vtnlabeid").setVisible(false);
					this.getView().byId("vtnid").setVisible(false);
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
					this.getView().byId("extcollabelid").setVisible(false);
					this.getView().byId("extcolod").setVisible(false);
					this.getView().byId("crtslabeid").setVisible(false);
					this.getView().byId("ctrtaid").setVisible(false);
					this.getView().byId("fromLabeeid").setVisible(false);
					this.getView().byId("labidtxt").setVisible(false);
					this.getView().byId("labetxteid").setVisible(false);
					this.getView().byId("ototid").setVisible(false);
					this.getView().byId("otitxt").setVisible(false);
					this.getView().byId("propetid").setVisible(false);
					this.getView().byId("perpid").setVisible(false);
					this.getView().byId("frlabid").setVisible(false);
					this.getView().byId("fmlabid").setVisible(false);
					this.getView().byId("idlabeal").setVisible(false);
					this.getView().byId("textide").setVisible(false);
					
					var oReceivedData = JSON.parse(oReceivedDataString);
					var oModel = new sap.ui.model.json.JSONModel(oReceivedData);

					this.getView().setModel(oModel, "TradeModel");
					sap.ui.getCore().setModel(oModel, "TradeModel");
					this.getView().byId("SimpleFormDispla20").bindElement("TradeModel>/");
				} else if (oReceivedDataString == "VehicleTradeVehicle") {
					/*	this.getView().byId("oVboxOtherVehicleInformation").setVisible(true);*/
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
					this.getView().byId("extcollabelid").setVisible(true);
					this.getView().byId("extcolod").setVisible(true);
					this.getView().byId("crtslabeid").setVisible(true);
					this.getView().byId("ctrtaid").setVisible(true);
					this.getView().byId("fromLabeeid").setVisible(true);
					this.getView().byId("labidtxt").setVisible(true);
					this.getView().byId("labetxteid").setVisible(true);
					this.getView().byId("ototid").setVisible(true);
					this.getView().byId("otitxt").setVisible(true);
					this.getView().byId("propetid").setVisible(true);
					this.getView().byId("perpid").setVisible(true);
					this.getView().byId("frlabid").setVisible(true);
					this.getView().byId("fmlabid").setVisible(true);
					this.getView().byId("idlabeal").setVisible(true);
					this.getView().byId("textide").setVisible(true);

					var i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
					var OtherVehicleInformation_text = i18n.getText("OtherVehicleInformation");
					this.getView().byId("oOtherVehInfoid").setText(OtherVehicleInformation_text);
					this.getView().setModel(sap.ui.getCore().getModel("TradeModel"), "TradeModel");

					this.getView().byId("SimpleFormDispla20").bindElement("TradeModel>/");

				}
			}
			var oArray = [{
					"Trade_return": "Single Vehicle",
					"State": "Yes"
				}, {
					"Trade_return": "Single Vehicle",
					"State": "No"
				}

			];
			var oModel = new sap.ui.model.json.JSONModel(oArray);
			this.getView().byId("VT_CStradinRet").setModel(oModel);
			//	this.getView().byId("VT_CStradinRet").setSeletedKey("Yes");
			this.getView().byId("VT_CStradinRet").setSelectedKey("Yes");
			var selVT_CStradinRet = this.getView().byId("VT_CStradinRet").getSelectedKey();
			if (selVT_CStradinRet == "Yes") {
				this.getView().byId("oSeleBtn").setEnabled(true);

			} else if (selVT_CStradinRet == "No") {
				this.getView().byId("oSeleBtn").setEnabled(false);
			}

		},
		onVTCStir: function () {
			var selVT_CStradinRet = this.getView().byId("VT_CStradinRet").getSelectedKey();
			if (selVT_CStradinRet == "Yes") {
				this.getView().byId("oSeleBtn").setEnabled(true);

			} else if (selVT_CStradinRet == "No") {
				this.getView().byId("oSeleBtn").setEnabled(false);
			}

		},

		onAfterRendering: function () {
			/*
						debugger;
						var that = this;
						var sLocation = window.location.host;
						var sLocation_conf = sLocation.search("webide");
						if (sLocation_conf == 0) {
							this.sPrefix = "/vehicleLocatorNode";
						} else {
							this.sPrefix = "";
			            }
						this.nodeJsUrl = this.sPrefix + "/node";
			            that.oDataUrl =  this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
			            that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
					*/
		},
		onSelecveh: function () {

			this.getRouter().navTo("VehicleTrade_VehicleSelection");

		}

	});
});