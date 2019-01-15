var _that;
sap.ui.define([
	/*"sap/ui/core/mvc/Controller"*/
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageBox',
	"sap/ui/core/routing/History",
	"vehicleLocator/Formatter/Formatter",
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
			
	this.getRouter().getRoute("VehicleTrade_CreateSingle").attachPatternMatched(this.onRouteMatched, this);		
			/*this.getRouter().attachRouteMatched(this.onRouteMatched, this);*/
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

					this.getView().byId("ofvestats").setVisible(false);
					this.getView().byId("offeredStatus").setVisible(false);
					this.getView().byId("offordetype").setVisible(false);
					this.getView().byId("oofferedOrdertype").setVisible(false);

					/*	this.getView().byId("crtslabeid").setVisible(false);*/
					this.getView().byId("ctrtaid").setVisible(false);
					this.getView().byId("oCtraid").setVisible(false);
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

					var oReceivedData = sap.ui.getCore().VehicheSearcResults[oReceivedDataString];
					var oModel = new sap.ui.model.json.JSONModel(oReceivedData);

					this.getView().setModel(oModel, "TradeModel");
					sap.ui.getCore().setModel(oModel, "TradeModel");
					this.getView().byId("SimpleFormDispla20").bindElement("TradeModel>/");
				} else if (oReceivedDataString == "VehicleTradeVehicle") {
				
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

					this.getView().byId("ofvestats").setVisible(true);
					this.getView().byId("offeredStatus").setVisible(true);
					this.getView().byId("offordetype").setVisible(true);
					this.getView().byId("oofferedOrdertype").setVisible(true);

					var i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
					var OtherVehicleInformation_text = i18n.getText("OfferVehicleInformation");
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
			/*	this.getView().byId("VT_CStradinRet").setSelectedKey("Yes");
				var selVT_CStradinRet = this.getView().byId("VT_CStradinRet").getSelectedKey();
				if (selVT_CStradinRet == "Yes") {
					this.getView().byId("oSeleBtn").setEnabled(true);

				} else if (selVT_CStradinRet == "No") {
					this.getView().byId("oSeleBtn").setEnabled(false);
				}*/

		},
		/*************************onSelectYes/No********************************/
		onVTCStir: function () {
			var selVT_CStradinRet = this.getView().byId("VT_CStradinRet").getSelectedKey();
			if (selVT_CStradinRet == "Yes") {
					this.getView().byId("oSeleBtn").setVisible(true);
			} else if (selVT_CStradinRet == "No") {
					this.getView().byId("oSeleBtn").setVisible(false);
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

					this.getView().byId("ofvestats").setVisible(false);
					this.getView().byId("offeredStatus").setVisible(false);
					this.getView().byId("offordetype").setVisible(false);
					this.getView().byId("oofferedOrdertype").setVisible(false);

				
					this.getView().byId("ctrtaid").setVisible(false);
					this.getView().byId("oCtraid").setVisible(false);
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
			debugger

            var that=this;
		/*	sap.ui.core.BusyIndicator.show();*/
			
			var McCmbo = this.getView().getModel("TradeModel").getData().matnr;
			 this.SelectedExteriorColorCode = "";
			  this.SelectedTrimInteriorColor = "";
			 var SuffCmbo = this.getView().getModel("TradeModel").getData().zzsuffix;
			 var MoyearCombo = this.getView().getModel("TradeModel").getData().zzmoyr;
			 var oDealer = this.getView().getModel("TradeModel").getData().kunnr;
		
			
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_MASTER_SRV";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

			/*	var SeriesUrl= that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq 'YZ3DCT' and zzextcol eq '01D6' and zzintcol eq 'LC14' and zzsuffix eq 'AB' and zzmoyr eq '2018'";*/

			var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'" + McCmbo + "' and zzsuffix eq '" + SuffCmbo + "' and zzmoyr eq '" + MoyearCombo + "' and kunnr eq '" + oDealer +
				"'";
		
			$.ajax({
				url: SeriesUrl,
				type: "GET",
				dataType: 'json',
				xhrFields: //
				{
					withCredentials: true
				},
			

				success: function (odata, oresponse) {
				
					var a = odata.d.results;
				
				/*var filtered_ODealer = a.filter(function (x) {
						return (x.kunnr==oDealer);
					});*/
				//	var Dealer = sap.ui.getCore().LoginDetails.DealerCode;
 var userAttributesModellen=sap.ui.getCore().getModel("LoginuserAttributesModel").getData();
 /*var Dealer=userAttributesModellen[0].DealerCode[0];*/
 var Dealer=userAttributesModellen[0].DealerCode;
					var FilterDelearNotnull = a.filter(function (x) {
						return x.kunnr != null;
					});
					/*	var FilterDeleade_OrderTypefiltered_zone=FilterDeleade_OrderTypefilteNotnull.filter(function(x){return x.kunnr.slice(-5)==Dealer &&(x.zzordertype=="DM" ||x.zzordertype=="SO")});*/

					//	var FilterDeleade_OrderTypefiltered_zone
					var filtered_ODealer = FilterDelearNotnull.filter(function (x) {
						return x.kunnr.slice(-5) != Dealer;
					});
					var ExcludeOrdType=[
						"RS",
						"F1",
						"F2",
						"F3",
						"F4",
						"F5"];
						var oExcludeOrdrtype = filtered_ODealer.filter(function (objFromA) {
						return !ExcludeOrdType.find(function (objFromB) {
							return objFromA.zzordertype === objFromB;
						});
					});
					

					
					var oJsonModel = new sap.ui.model.json.JSONModel(oExcludeOrdrtype);
						oJsonModel.setSizeLimit(1500);	
					sap.ui.getCore().setModel(oJsonModel,"oVehicleSelectionResults");
					 that.getRouter().navTo("VehicleTrade_VehicleSelection",{
					 	SelectedVehicleFrom:"VehileTrade_CreateSingle"
					 });
				   /*  sap.ui.core.BusyIndicator.hide();*/
					
			
				},
				error:function(){
					 that.getRouter().navTo("VehicleTrade_VehicleSelection",{
					 	SelectedVehicleFrom:"VehileTrade_CreateSingle"
					 });
				/*	 sap.ui.core.BusyIndicator.hide();*/
				}
			});
		

		/*	var that = this;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var SeriesUrl = that.oDataUrl + "/zc_mmfields";

			var ajax1 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},

				url: SeriesUrl,
				async: true,
				success: function (result) {}
			});
			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_MASTER_SRV";
			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var ModelUrl = that.oDataUrl + "/zc_c_vehicle?$top=5";

		
			var ajax2 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},

				url: ModelUrl,
				async: true,
				success: function (result) {}
			});

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_MASTER_SRV";
			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var ModelDescUrl = that.oDataUrl + "/zc_model";

			var ajax3 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				}
				
				,
				url: ModelDescUrl,
				async: true,
				success: function (result) {}
			});

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var specificationurl = that.oDataUrl + "/zc_specification";

			var ajax4 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},

				url: specificationurl,
				async: true,
				success: function (result) {}

			});
			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

			var SuffixMarktingDesc = that.oDataUrl + "/zc_exterior_trim";
			var ajax5 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},
				url: SuffixMarktingDesc,
				async: true,
				success: function (result) {}
			});

	
			var that = this;
			$.when(ajax1, ajax2, ajax3, ajax4, ajax5).done(function (SeriesUrl, ModelUrl, ModelDescUrl, specificationurl, SuffixMarktingDesc) {
				debugger
				var SeriesUrl = SeriesUrl[0].d.results;
				var SeriesUrlModel = new sap.ui.model.json.JSONModel(SeriesUrl);
				sap.ui.getCore().setModel(SeriesUrlModel, "VehicleSeleSeries");

				var ModelUrl = ModelUrl[0].d.results;
				var ModelUrlModel = new sap.ui.model.json.JSONModel(ModelUrl);
				sap.ui.getCore().setModel(ModelUrlModel, "VehicleSeleModel");

				var ModelDescUrl = ModelDescUrl[0].d.results;
				var ModelDescUrlModel = new sap.ui.model.json.JSONModel(ModelDescUrl);
				sap.ui.getCore().setModel(ModelDescUrlModel, "VehicleSeleModelDesModel");

				var specificationurl = specificationurl[0].d.results;
				var specificationurlModel = new sap.ui.model.json.JSONModel(specificationurl);
				sap.ui.getCore().setModel(specificationurl, "VehicleSelespecificationurl");

				var SuffixMarktingDesc = SuffixMarktingDesc[0].d.results;
				var SuffixMarktingDescModel = new sap.ui.model.json.JSONModel(SuffixMarktingDesc);
				sap.ui.getCore().setModel(SuffixMarktingDescModel, "VehicleSeleSuffixMarktingDesc");

				that.getRouter().navTo("VehicleTrade_VehicleSelection");

		
			});
*/
		},
		onRequestVT: function () {
			debugger;

			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});

			//------ requested dealer info//
			var TradeRequest = this.getView().byId("VT_CStradinRet").getSelectedKey();
			if (TradeRequest == "") {
				sap.m.MessageBox.warning("Please select trade in return");
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
				this.nodeJsUrl = this.sPrefix ;
				that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeRequest";
				$.ajax({
					url: that.oDataUrl,
					method: "GET",
					async: false,
					dataType: "json",

					success: function (oData) {

						debugger;
						var Data = oData.d.results;
			/*	var that = this;
				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");

				if (sLocation_conf == 0) {
					this.sPrefix = "/VehicleLocator_Xsodata";
				} else {
					this.sPrefix = "";

				}
				this.nodeJsUrl = this.sPrefix ;
				that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeRequest";
				$.ajax({
					url: that.oDataUrl,
					method: "GET",
					async: false,
					dataType: "json",

					success: function (oData) {

						debugger;
						var Data = oData.d.results;*/

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

						var Trade_Status = "";
					/*	var Requesting_Dealer = that.getView().byId("dealrid").getText().substr(0, that.getView().byId("dealrid").getText().indexOf(
							"-"));*/
						var Requesting_Dealer =	sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;		
							
							
					/*	var Requesting_Dealer_Name = that.getView().byId("dealrid").getText().substr(that.getView().byId("dealrid").getText().indexOf(
							"-") + 1);*/
						var Requesting_Dealer_Name = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName;
							
						var Requested_Vtn = that.getView().byId("vtnid").getText();
						var Offered_Vtn = that.getView().byId("vtnid").getText();
						var DateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "yyyy-MM-dd"
						});
						var Req_Current_ETA_FromData = that.getView().byId("ctaid").getText();
						if (Req_Current_ETA_FromData != "") {
							var Req_Current_ETA_From = oDateFormat.format(new Date(Req_Current_ETA_FromData));
						} else {
							var Req_Current_ETA_From = oDateFormat.format(new Date());
						}
						var Req_Current_ETA_To = that.getView().byId("totxtid").getText();

						if (Req_Current_ETA_To != "") {
							var Req_Current_ETA_To = oDateFormat.format(new Date(Req_Current_ETA_To));
						} else {
							var Req_Current_ETA_To = oDateFormat.format(new Date());
						}

						var Req_Proposed_ETA_From = that.getView().byId("prpid").getText();

						if (Req_Proposed_ETA_From != "") {
							var Req_Proposed_ETA_From = oDateFormat.format(new Date(Req_Proposed_ETA_From));
						} else {
							var Req_Proposed_ETA_From = oDateFormat.format(new Date());
						}
						var Req_Proposed_ETA_To = that.getView().byId("otextlabel").getText();
						if (Req_Proposed_ETA_To != "") {
							var Req_Proposed_ETA_To = oDateFormat.format(new Date(Req_Proposed_ETA_To));
						} else {
							var Req_Proposed_ETA_To = oDateFormat.format(new Date());
						}

						var Off_Current_ETA_From = that.getView().byId("oCtraid").getText();
						if (Off_Current_ETA_From != "") {
							var Off_Current_ETA_From = oDateFormat.format(new Date(Off_Current_ETA_From));
						} else {
							var Off_Current_ETA_From = oDateFormat.format(new Date());
						}
						var Off_Current_ETA_To = that.getView().byId("labetxteid").getText();
						if (Off_Current_ETA_To != "") {
							var Off_Current_ETA_To = oDateFormat.format(new Date(Off_Current_ETA_To));
						} else {
							var Off_Current_ETA_To = oDateFormat.format(new Date());
						}

						var Off_Proposed_ETA_From = that.getView().byId("perpid").getText();
						if (Off_Proposed_ETA_From != "") {
							var Off_Proposed_ETA_From = oDateFormat.format(new Date(Off_Proposed_ETA_From));
						} else {
							var Off_Proposed_ETA_From = oDateFormat.format(new Date());
						}

						var Off_Proposed_ETA_To = that.getView().byId("idlabeal").getText();
						if (Off_Proposed_ETA_To != "") {
							var Off_Proposed_ETA_To = oDateFormat.format(new Date(Off_Proposed_ETA_To));
						} else {
							var Off_Proposed_ETA_To = oDateFormat.format(new Date());
						}

					

	var Created_By=sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
			


				
						var Created_On = that.getView().byId("idlabeal").getText();
						if (Created_On != "") {
							var Created_On = oDateFormat.format(new Date(Created_On));
						} else {
							var Created_On = oDateFormat.format(new Date());
						}
						var Changed_on = that.getView().byId("idlabeal").getText();;
						if (Changed_on != "") {
							var Changed_on = oDateFormat.format(new Date(Changed_on));
						} else {
							var Changed_on = oDateFormat.format(new Date());
						}
						var Requested_Dealer = that.getView().getModel("TradeModel").oData.kunnr;
						var Requested_Dealer_Name = that.getView().byId("dealrid").getText().substr(that.getView().byId("dealrid").getText().indexOf(
							"-") + 1);

				

						var oEntry = {

							"Trade_Id": Trade_Id,
							"Trade_Status": Trade_Status,
							"Requesting_Dealer": Requesting_Dealer,
							"Requesting_Dealer_Name": Requesting_Dealer_Name,
							"Requested_Vtn": Requested_Vtn,
							"Offered_Vtn": Offered_Vtn,
							"Trade_Return": Trade_Return,
							"Req_Current_ETA_From": Req_Current_ETA_From,
							"Req_Current_ETA_To": Req_Current_ETA_To,
							"Req_Proposed_ETA_From": Req_Proposed_ETA_From,
							"Req_Proposed_ETA_To": Req_Proposed_ETA_To,
							"Off_Current_ETA_From": Off_Current_ETA_From,

							"Off_Current_ETA_To": Off_Current_ETA_To,
							"Off_Proposed_ETA_From": Off_Proposed_ETA_From,
							"Off_Proposed_ETA_To": Off_Proposed_ETA_To,
							"Created_By": "ANIKETC",
							"Created_On": Created_On,
							"Changed_on": Changed_on,
							"Requested_Dealer": Requested_Dealer,
							"Requested_Dealer_Name": Requested_Dealer_Name
							
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
							that.TradeComment(oEntry);
							that.TradeVehcles(oEntry);
							that.TradeStatus(oEntry);
						/*	that.VehicleTrade_Summary();*/
						
							
							
			
							//	that.getRouter().navTo("VehicleTrade_Summary");
						}, function () {

						});

					},
					error: function (response) {

					}
				});
				/*	var obj = {};*/

				/*	obj.Trade_Id="TR000013";
					obj.Trade_Status="";
					obj.Requesting_Dealer=this.getView().byId("dealrid").getText().substr(0,this.getView().byId("dealrid").getText().indexOf("-"));
					obj.Requesting_Dealer_Name= this.getView().byId("dealrid").getText().substr(this.getView().byId("dealrid").getText().indexOf("-") + 1);
					obj.Requested_Vtn="000002";
					obj.Offered_Vtn="000065";*/

				/*	obj.Req_Current_ETA_From="20181123";
					obj.Req_Current_ETA_To="20180122";
					obj.Req_Proposed_ETA_From="20181122";
					obj.Req_Proposed_ETA_To="20181130";
					obj.Off_Current_ETA_From="20181201";
					obj.Off_Current_ETA_To="20181228";
					obj.Off_Proposed_ETA_From="20181128";
					obj.Off_Proposed_ETA_To="20181221";
					obj.Created_By="ANIKETC";
					obj.Created_On="20181210";
					obj.Changed_on="";
					obj.Requested_Dealer="2400053088";
					obj.Requested_Dealer_Name="Levis Toyota";*/

				/*	this.getView().byId("zzMoyr").getText();
					this.getView().byId("oSeries").getText();
					this.getView().byId("oZmodel").getText();
					this.getView().byId("oZsuffix").getText();
					this.getView().byId("oApx").getText();
					this.getView().byId("Zextcolo").getText();*/
				/*	this.getView().byId("VT_CStradinRet").getSelectedKey();*/
				//---Current Eta--- requested dealer//
				/*this.getView().byId("ctaid").getText();
				this.getView().byId("textlab").getText();
				this.getView().byId("totxtid").getText();
				this.getView().byId("prpid").getText();
				this.getView().byId("otextlabel").getText();*/
				//comment id
				/*	this.getView().byId("oTypeHere").getValue();*/
				//------ offered dealer info//

				/*	this.getView().byId("vtnid").getText();
					this.getView().byId("yearid").getText();
					this.getView().byId("seiresid").getText();
					this.getView().byId("modlid").getText();
					this.getView().byId("suffid").getText();
					this.getView().byId("apxid").getText();
					this.getView().byId("extcolod").getText();*/
				//---Current Eta--- offereded dealer//
				/*	this.getView().byId("oCtraid").getText();
					this.getView().byId("labetxteid").getText();
					this.getView().byId("otitxt").getText();
					this.getView().byId("perpid").getText();
					this.getView().byId("idlabeal").getText();*/

				/*	var that=this;	
					var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");

				if (sLocation_conf == 0) {
					this.sPrefix = "/vehicleTrade";
				} else {
					this.sPrefix = "";

				}
					this.nodeJsUrl = this.sPrefix + "/xsodata/vehicleTrade_SRV.xsodata/$metadata";
				that.oDataUrl = this.nodeJsUrl + "/vehicleTrade_SRV.xsodata";

				that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
				that.oDataModel.create("/TradeRequest",obj,null,function(s){
					alert(s);
						that.getRouter().navTo("VehcTrad_Apprv_Rej_CounTrad");
				},function(){
					alert("error");
				});*/

				/*	var oEntry = {
						"Trade_Id": "TR000022",
						"Trade_Status": "",
						"Requesting_Dealer": "2400053144",
						"Requesting_Dealer_Name": "Vimont Toyota Laval",
						"Requested_Vtn": "000010",
						"Offered_Vtn": "000069",
						"Trade_Return": "Y",
						"Req_Current_ETA_From": "2018-12-10T00:00:00",
						"Req_Current_ETA_To": "2018-12-10T00:00:00",
						"Req_Proposed_ETA_From": "2018-12-12T00:00:00",
						"Req_Proposed_ETA_To": "2018-12-24T00:00:00",
						"Off_Current_ETA_From": "2018-12-10T00:00:00",
						"Off_Current_ETA_To": "2018-12-21T00:00:00",
						"Off_Proposed_ETA_From": "2018-12-12T00:00:00",
						"Off_Proposed_ETA_To": "2018-12-24T00:00:00",
						"Created_By": "ANIKETC",
						"Created_On": "2018-11-10T00:00:00",
						"Changed_on": "2018-12-10T00:00:00",
						"Requested_Dealer": "2400053160",
						"Requested_Dealer_Name": "Park Avenue Toyota\r"
					};

					var that = this;
					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");

					if (sLocation_conf == 0) {
						this.sPrefix = "/VehicleLocator_Xsodata";
					} else {
						this.sPrefix = "";

					}
					this.nodeJsUrl = this.sPrefix ;
					that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

					that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
					that.oDataModel.setHeaders({
						"Content-Type": "application/json",
						"X-Requested-With": "XMLHttpRequest",
						"DataServiceVersion": "2.0",
						"Accept": "application/json",
						"Method": "POST"
					});

					that.oDataModel.create("/TradeRequest", oEntry, null, function (s) {

						that.getRouter().navTo("VehicleTrade_Summary");
					}, function () {

					});*/
			}
			//	var SeriesUrl = that.oDataUrl + "/TradeRequestType";
			//	https://vehiclexsjs.cfapps.us10.hana.ondemand.com//xsodata/vehicleTrade_SRV.xsodata/TradeRequest
			//	https://vehiclexsjs.cfapps.us10.hana.ondemand.com//xsodata/vehicleTrade_SRV.xsodata/TradeRequest

			/*	$.ajax({
                                url: SeriesUrl,
                                type: "POST", 
                                data: obj,
                                contentType: "application/json",
                                crossDomain: true,
                                beforeSend: function (request) {
					request.setRequestHeader('Authorization', 'Basic ' + btoa('anisetc:anisetc'));
				},
                                headers: {
                                    "X-Requested-With": "JSONHttpRequest"
                                },

                                success: function (s, textStatus, jqXHR) {
                                	
                                },
                                error:function(s){
                                }
                                });*/

			/*	Math.max.apply(Math, array.map(function(o) { return o.y; }))*/

		},

		TradeComment: function (oEntry) {
		
			
	var that = this;
	that.Trade_Id=oEntry.Trade_Id;
				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");

				if (sLocation_conf == 0) {
					this.sPrefix = "/VehicleLocator_Xsodata";
				} else {
					this.sPrefix = "";

				}
				this.nodeJsUrl = this.sPrefix ;
				that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeRequest";
				$.ajax({
					url: that.oDataUrl,
					method: "GET",
					async: false,
					dataType: "json",

					success: function (oData) {

						debugger;
						var Data = oData.d.results;
				if (oData.d.results.length !=0) {
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
			},
			error:function(){}});		
					
		},
		TradeComment_id:function(){
			var that=this;
		var Trade_Id = that.Trade_Id;
			var oCommentText = that.getView().byId("oTypeHere").getValue();

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var oCommentdate = oDateFormat.format(new Date());
		
		
			var Created_By=sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
					/*this.getView().byId("oDealersearchresults").setText(LoggedInDealer);*/

			var oTradeComment = {
				

				"Trade_Id.Trade_Id": Trade_Id,
				"Comment_Id": that.oComment_Id,
				"Comment_Txt": oCommentText,
				"Comment_Date": oCommentdate,
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
			}, function () {

			});

		},
		TradeVehcles: function (oEntry) {

			var that = this;
			var Trade_Id = oEntry.Trade_Id;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var oCommentdate = oDateFormat.format(new Date());
			var Suffix = that.getView().byId("oZsuffix").getText().split("-")[0];
			if (Suffix != "") {
				var intColor = that.getView().byId("oZsuffix").getText().split("/")[1];
			} else {
				var intColor = "";
			}
			var model = that.getView().byId("oZmodel").getText().split("-")[0];
			var modelYear = that.getView().byId("zzMoyr").getText();
			var Apx = that.getView().byId("oApx").getText();
			var Series = that.getView().byId("oSeries").getText().split("-")[0];
			var exterior = that.getView().byId("Zextcolo").getText().split("-")[0];
			var vtn = that.getView().byId("vtnid").getText();
			var ostatus = that.getView().getModel("TradeModel").getData().zz_trading_ind;
		/*	if(ostatus=="Pipeline – non-Routable"){
				ostatus="2";
			}
			else if(ostatus=="Pipeline - Routable"){
				ostatus="1";
			}*/
			var oOrdertype = that.getView().getModel("TradeModel").getData().zzordertype;
			var DNC = that.getView().getModel("TradeModel").getData().dnc_ind;
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
			};
			oEntry1["Trade_Id.Trade_Id"] = oEntry.Trade_Id;

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

			that.oDataModel.create("/TradeVehicles", oEntry1, null, function (s) {
				/*	alert("ok");*/
			}, function () {

			});

		},

		TradeStatus: function (oEntry) {

			var that = this;
			var Trade_Id = oEntry.Trade_Id;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var oCommentdate = oDateFormat.format(new Date());
			var Suffix = that.getView().byId("oZsuffix").getText().split("-")[0];
			if (Suffix != "") {
				var Suffix = that.getView().byId("oZsuffix").getText();
				var intColor = Suffix.substr(Suffix.indexOf("/") + 1);
				//	var intColor = that.getView().byId("oZsuffix").getText().split("/")[1];
			} else {
				var intColor = "";
			}
			var Model_Description = that.getView().byId("oZmodel").getText().split("-")[1];
			var Series_Desc = that.getView().byId("oSeries").getText().split("-")[0];
			if (Series_Desc != "") {
				var Series_Desc = that.getView().byId("oSeries").getText();
				Series_Desc = Series_Desc.substr(Series_Desc.indexOf("-") + 1);
			} else {
				Series_Desc = "";
			}
			var Suffix_Desc = that.getView().byId("oZsuffix").getText().split("-")[0];
			if (Suffix_Desc != "") {
				var Suffix_Desc = that.getView().byId("oZsuffix").getText();
				//	Suffix_Desc =that.getView().byId("oZsuffix").getText().split("-")[1];
				Suffix_Desc = Suffix_Desc.substr(Suffix_Desc.indexOf("-") + 1);
			Suffix_Desc=Suffix_Desc.substring(0,Suffix_Desc.indexOf('/'));
			} else {
				Suffix_Desc = "";
			}
			/*	var Int_Colour_Desc = that.getView().byId("oZsuffix").getText().split("-")[0];*/
			var Ext_Colour_Desc = that.getView().byId("Zextcolo").getText().split("-")[0];
			if (Ext_Colour_Desc != "") {
				var Ext_Colour_Desc = that.getView().byId("Zextcolo").getText();
				Ext_Colour_Desc = Ext_Colour_Desc.substr(Ext_Colour_Desc.indexOf("-") + 1);
				//	Ext_Colour_Desc =that.getView().byId("Zextcolo").getText().split("-")[1];
			} else {
				Ext_Colour_Desc = "";
			}

			var Spars = sap.ui.getCore().getConfiguration().getLanguage();
			if (Spars == "fr") {
				Spars = "F";
			} else {
				Spars = "E";
			}
			var oVTN = that.getView().byId("vtnid").getText();

			var oEntry2 = {

				SPRAS: Spars,
				Model_Desc: Model_Description,
				Series_Desc: Series_Desc,
				Suffix_Desc: Suffix_Desc,
				Int_Colour_Desc: intColor,
				Ext_Colour_Desc: Ext_Colour_Desc

			};
			oEntry2["Trade_Id.Trade_Id"] = oEntry.Trade_Id;
			oEntry2["VTN.VTN"] = oVTN;

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

			that.oDataModel.create("/TradeVehicleDesc", oEntry2, null, function (s) {
				that.getRouter().navTo("VehicleTrade_Summary",{
					DataClicked:"Yes"
				});
			}, function () {

			});

		},
		onDummySummary:function()
		{
			debugger
			this.getRouter().navTo("VehicleTrade_Summary");
			
		}

	});
});