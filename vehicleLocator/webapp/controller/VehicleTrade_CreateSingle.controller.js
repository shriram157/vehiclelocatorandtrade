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
			var _that =this;
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
			var that = this;
			var logginDealer = 42176;
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
			var SeriesUrl = that.oDataUrl + "/ZVMS_ALLOCATION";
			var VTN = that.oDataUrl + "/ZVMS_ALLOCATION";
			/*var /zc_mmfields*/
			var ajax1 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},
				/*,
				      beforeSend: function (request)
				           {
				               request.setRequestHeader('Authorization', 'Basic ' + btoa(''));
				           }*/

				url: VTN,
				async: true,
				success: function (result) {}
			});

			$.when(ajax1).done(function (VTN) {

				var SeriesUrl = SeriesUrl[0].d.results;
				var SeriesModel = new sap.ui.model.json.JSONModel(SeriesUrl);
				sap.ui.getCore().setModel(SeriesModel, "SeriesModel");
				var oVTN = SeriesDes[0].d.results;

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

			});
		},

		onSelecveh: function () {

			this.getRouter().navTo("VehicleTrade_VehicleSelection");

		},
		onRequestVT: function () {
			debugger;
			//------ requested dealer info//
			var that = this;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				this.sPrefix = "";

			}
			this.nodeJsUrl = this.sPrefix + "/vehicleTrade";
			that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeRequest";
			$.ajax({
				url: that.oDataUrl,
				method: "GET",
				async: false,
				dataType: "json",

				success: function (oData) {

					debugger;
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
					var Requesting_Dealer = that.getView().byId("dealrid").getText().substr(0, that.getView().byId("dealrid").getText().indexOf(
						"-"));
					var Requesting_Dealer_Name = that.getView().byId("dealrid").getText().substr(that.getView().byId("dealrid").getText().indexOf(
						"-") + 1);
					var Requested_Vtn = that.getView().byId("vtnid").getText();
					var Offered_Vtn = that.getView().byId("vtnid").getText();
					var DateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd"
					});
					var Req_Current_ETA_FromData = that.getView().byId("ctaid").getText();
					if (Req_Current_ETA_FromData != "") {
						var Req_Current_ETA_From = _that.oDateFormat.format(new Date(Req_Current_ETA_FromData));
					} else {
						var Req_Current_ETA_From = "";
					}
					var Req_Current_ETA_To = that.getView().byId("totxtid").getText();

					if (Req_Current_ETA_To != "") {
						var Req_Current_ETA_To = _that.oDateFormat.format(new Date(Req_Current_ETA_To));
					} else {
						var Req_Current_ETA_To = "";
					}

					var Req_Proposed_ETA_From = that.getView().byId("prpid").getText();

					if (Req_Proposed_ETA_From != "") {
						var Req_Proposed_ETA_From = _that.oDateFormat.format(new Date(Req_Proposed_ETA_From));
					} else {
						var Req_Proposed_ETA_From = "";
					}
					var Req_Proposed_ETA_To = that.getView().byId("otextlabel").getText();
					if (Req_Proposed_ETA_To != "") {
						var Req_Proposed_ETA_To = _that.oDateFormat.format(new Date(Req_Proposed_ETA_To));
					} else {
						var Req_Proposed_ETA_To = "";
					}

					var Off_Current_ETA_From = that.getView().byId("oCtraid").getText();
					if (Off_Current_ETA_From != "") {
						var Off_Current_ETA_From = _that.oDateFormat.format(new Date(Off_Current_ETA_From));
					} else {
						var Off_Current_ETA_From = "";
					}
					var Off_Current_ETA_To = that.getView().byId("labetxteid").getText();
					if (Off_Current_ETA_To != "") {
						var Off_Current_ETA_To = _that.oDateFormat.format(new Date(Off_Current_ETA_To));
					} else {
						var Off_Current_ETA_From = "";
					}
					
				/*	var Off_Proposed_ETA_From = that.getView().byId("perpid").getText();
					if(Off_Proposed_ETA_From !=undefined){
					var Off_Proposed_ETA_From = _that.oDateFormat.format(new Date(Off_Proposed_ETA_From));
					}
					else {
						var Off_Current_ETA_From = "";
					}
					
					var Off_Proposed_ETA_To = that.getView().byId("idlabeal").getText();
					if(Off_Proposed_ETA_To !=undefined){
					var Off_Proposed_ETA_To = _that.oDateFormat.format(new Date(Off_Proposed_ETA_To));
					}
					else {
						var Off_Current_ETA_From = "";
					}*/
					
					
					var Off_Proposed_ETA_From = that.getView().byId("perpid").getText();
					if(Off_Proposed_ETA_From !=""){
					var Off_Proposed_ETA_From = _that.oDateFormat.format(new Date(Off_Proposed_ETA_From));
					}
					else {
						var Off_Current_ETA_From = "";
					}
					
					var Off_Proposed_ETA_To = that.getView().byId("idlabeal").getText();
					if(Off_Proposed_ETA_To !=""){
					var Off_Proposed_ETA_To = _that.oDateFormat.format(new Date(Off_Proposed_ETA_To));
					}
					else {
						var Off_Current_ETA_From = "";
					}
					
				/*	var Created_By = "ANIKETC";
					if(Created_On !="undefined"){
					var Created_On = _that.oDateFormat.format(new Date(Created_On));
					}else
					{
						var Created_On="";
					}
					if(Changed_on !=undefined){
					var Changed_on = _that.oDateFormat.format(new Date(Changed_on));
					}else
					{
						var Created_On="";
					}*/
					
					var Created_By = "ANIKETC";
					var Created_On = that.getView().byId("idlabeal").getText();
					if(Created_On !="")
					{
					var Created_On = _that.oDateFormat.format(new Date(Created_On));
					}else
					{
						var Created_On="";
					}
					var Changed_on  = that.getView().byId("idlabeal").getText();;
					if(Changed_on !=""){
					var Changed_on = _that.oDateFormat.format(new Date(Changed_on));
					}else
					{
						var Changed_on="";
					}
					
					
					var Requested_Dealer = that.getView().byId("dealrid").getText().substr(0, that.getView().byId("dealrid").getText().indexOf(
						"-"));
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
				"Req_Current_ETA_From": Req_Current_ETA_FromData,
				"Req_Current_ETA_To": Req_Current_ETA_To,
				"Req_Proposed_ETA_From": Req_Proposed_ETA_From,
				"Req_Proposed_ETA_To": Req_Proposed_ETA_To,
				"Off_Current_ETA_From": Off_Current_ETA_From,
				"Off_Current_ETA_To": Off_Current_ETA_To,
				"Off_Proposed_ETA_From": Off_Proposed_ETA_From,
				"Off_Proposed_ETA_To": Off_Proposed_ETA_To,
				"Created_By": Created_By,
				"Created_On": Created_On,
				"Changed_on": Changed_on,
				"Requested_Dealer": Requested_Dealer,
				"Requested_Dealer_Name": Requested_Dealer_Name
			};

			/*var that = this;*/
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				that.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				that.sPrefix = "";

			}
			that.nodeJsUrl = that.sPrefix + "/vehicleTrade";
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
				alert(s);
				that.getRouter().navTo("VehicleTrade_Summary");
			}, function () {
				alert("error");
			});


				},
				error: function (response) {
					alert("Error");
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

			var oEntry = {
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
			this.nodeJsUrl = this.sPrefix + "/vehicleTrade";
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
				alert(s);
				that.getRouter().navTo("VehicleTrade_Summary");
			}, function () {
				alert("error");
			});

			//	var SeriesUrl = that.oDataUrl + "/TradeRequestType";
			//	https://vehiclexsjs.cfapps.us10.hana.ondemand.com/vehicleTrade/xsodata/vehicleTrade_SRV.xsodata/TradeRequest
			//	https://vehiclexsjs.cfapps.us10.hana.ondemand.com/vehicleTrade/xsodata/vehicleTrade_SRV.xsodata/TradeRequest

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

		}

	});
});