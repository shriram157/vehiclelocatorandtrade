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
			var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
			var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
		    this.getView().byId("oDealerCode3").setText(LoggedInDealerCode2);                                
			this.getView().byId("oDealerCreat_singl").setText(LoggedInDealer);
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

			this.getRouter().getRoute("VehicleTrade_CreateSingle").attachPatternMatched(this.onRouteMatched, this);
			/*this.getRouter().attachRouteMatched(this.onRouteMatched, this);*/
		},
		onRouteMatched: function (oEvent) {
			
			   this.getView().byId("oTypeHere").setValue(""); //1803

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
					/*	this.getView().byId("labidtxt").setVisible(false);  ===del===*/
					this.getView().byId("labetxteid").setVisible(false);
					this.getView().byId("ototid").setVisible(false);
					/*	this.getView().byId("otitxt").setVisible(false);  ===del===*/
					this.getView().byId("propetid").setVisible(false);
					this.getView().byId("perpid").setVisible(false);
					this.getView().byId("frlabid").setVisible(false);
					this.getView().byId("fmlabid").setVisible(false);
					this.getView().byId("idlabeal").setVisible(false);
					this.getView().byId("textide").setVisible(false);

					var oReceivedData = sap.ui.getCore().SelectedTrade;
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

					this.getView().byId("oCtraid").setVisible(true);
					this.getView().byId("ctrtaid").setVisible(true);
					this.getView().byId("fromLabeeid").setVisible(true);
					/*	this.getView().byId("labidtxt").setVisible(true);*/
					this.getView().byId("labetxteid").setVisible(true);
					this.getView().byId("ototid").setVisible(true);
					/*	this.getView().byId("otitxt").setVisible(true);*/
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

					// var i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
					// var OtherVehicleInformation_text = i18n.getText("OfferVehicleInformation");
					
					var oModeli18n = this.getView().getModel("i18n");
		     		// this._oResourceBundle = oModeli18n.getResourceBundle();			
					 var OtherVehicleInformation_text = oModeli18n.getResourceBundle().getText("OfferVehicleInformation");
					
					this.getView().byId("oOtherVehInfoid").setText(OtherVehicleInformation_text);
					this.getView().setModel(sap.ui.getCore().getModel("TradeModel"), "TradeModel");

					this.getView().byId("SimpleFormDispla20").bindElement("TradeModel>/");

				}
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
			//	this.getView().byId("VT_CStradinRet").setSeletedKey("Yes");
			/*	this.getView().byId("VT_CStradinRet").setSelectedKey("Yes");
				var selVT_CStradinRet = this.getView().byId("VT_CStradinRet").getSelectedKey();
				if (selVT_CStradinRet == "Yes") {
					this.getView().byId("oSeleBtn").setEnabled(true);

				} else if (selVT_CStradinRet == "No") {
					this.getView().byId("oSeleBtn").setEnabled(false);
				}*/

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
			} else if (selVT_CStradinRet == "No") {

				this.getView().byId("FromFourth").setText("");
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
				/*	this.getView().byId("labidtxt").setVisible(false);*/
				this.getView().byId("labetxteid").setVisible(false);
				this.getView().byId("ototid").setVisible(false);
				/*	this.getView().byId("otitxt").setVisible(false);*/
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

			var that = this;
			/*	sap.ui.core.BusyIndicator.show();     "MoyearCombo": MoyearCombo,
				"SeriesCmbo": SeriesCmbo,
				"McCmbo": McCmbo*/

			var McCmbo = this.getOwnerComponent().SelectedMSMData[0].McCmbo;
			this.SelectedExteriorColorCode = "";
			this.SelectedTrimInteriorColor = "";
			var SuffCmbo = this.getOwnerComponent().SelectedMSMData[0].SuffCmbo;
			var MoyearCombo = this.getOwnerComponent().SelectedMSMData[0].MoyearCombo;
			/*	var oDealer=sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].DealerCode;*/
			var oDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;
			
			
			
			
			var Series = this.getOwnerComponent().SelectedMSMData[0].SeriesCmbo;



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

			/*
			 working#######
			var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'" + McCmbo + "' and zzsuffix eq '" + SuffCmbo +
				"' and zzmoyr eq '" + MoyearCombo + "' and kunnr eq '" + oDealer +
				"'";*/
			/*	var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq '"+McCmbo+"' and endswith (zzintcol,'"+this.intercolor+"') and zzsuffix eq '"+SuffCmbo+"' and zzmoyr eq '"+MoyearCombo+"'&$format=json";	*/
			var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=zzseries eq'" + Series + "'and kunnr eq '" + oDealer +
				"'&$format=json";

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
					var userAttributesModellen = sap.ui.getCore().getModel("LoginuserAttributesModel").getData();
					/*var Dealer=userAttributesModellen[0].DealerCode[0];*/
					var Dealer = userAttributesModellen[0].DealerCode;
					var FilterDelearNotnull = a.filter(function (x) {
						return x.kunnr != null;
					});
					/*	var FilterDeleade_OrderTypefiltered_zone=FilterDeleade_OrderTypefilteNotnull.filter(function(x){return x.kunnr.slice(-5)==Dealer &&(x.zzordertype=="DM" ||x.zzordertype=="SO")});*/

					//	var FilterDeleade_OrderTypefiltered_zone
					var filtered_ODealer = FilterDelearNotnull.filter(function (x) {
						return x.kunnr.slice(-5) == Dealer;
					});
					var ExcludeOrdType = [
						"RS",
						"F1",
						"F2",
						"F3",
						"F4",
						"F5"
					];
				/*	var oExcludeOrdrtype = filtered_ODealer.filter(function (objFromA) {
						return !ExcludeOrdType.find(function (objFromB) {
							return objFromA.zzordertype === objFromB;
						});
					});*/
 
                    var oExcludeOrdrtype = [];
                    for (var i = filtered_ODealer.length - 1; i >= 0; --i) {
                        if (ExcludeOrdType.indexOf((filtered_ODealer[i].zzordertype)) == -1) {
                            oExcludeOrdrtype.push(filtered_ODealer[i]);
                        }
                    }

                    //        var oJsonModel = new sap.ui.model.json.JSONModel(oExcludeOrdrtype);
                    var IncludeOrdertype = oExcludeOrdrtype.filter(function (x) {
                        return (x.zzordertype == "SO" || x.zzordertype == "DM");
                    });
                    var oJsonModel = new sap.ui.model.json.JSONModel(IncludeOrdertype);		
	// need to change language - 2603				 
					 //for (var i =0; i< oJsonModel.oData.length; i++) {
					 //	oJsonModel.oData[i].mktg_desc_en = oJsonModel.oData[i].mktg_desc_fr;  //
					 //	oJsonModel.oData[i].model_desc_en = oJsonModel.oData[i].model_desc_fr;  //
					 //	oJsonModel.oData[i].mrktg_int_desc_en = oJsonModel.oData[i].mrktg_int_desc_fr; 
					 //	oJsonModel.oData[i].suffix_desc_en = oJsonModel.oData[i].suffix_desc_fr; 
					 //	oJsonModel.oData[i].zzseries_desc_en = oJsonModel.oData[i].zzseries_desc_fr; 
					 //}
  
					
					
				//	var oJsonModel = new sap.ui.model.json.JSONModel(IncludeOrdertype);
					/*var includeDnc = oExcludeOrdrtype.filter(function (x) {
										return x.dnc_ind == "Y";
									});
									var includeHoldStatus = includeDnc.filter(function (x) {
										return x.Hold_stat == "Y";
									});
									var oJsonModel = new sap.ui.model.json.JSONModel(includeHoldStatus);*/
					//comment this line

					///////
					oJsonModel.setSizeLimit(1500);
					sap.ui.getCore().setModel(oJsonModel, "oVehicleSelectionResults");
					that.getRouter().navTo("VehicleTrade_VehicleSelection", {
						SelectedVehicleFrom: "VehileTrade_CreateSingle"
					});
					/*  sap.ui.core.BusyIndicator.hide();*/

				},
				error: function () {
					that.getRouter().navTo("VehicleTrade_VehicleSelection", {
						SelectedVehicleFrom: "VehileTrade_CreateSingle"
					});
					/*	 sap.ui.core.BusyIndicator.hide();*/
				}
			});

		
		},
		onRequestVT: function () {
			debugger;
			/*	var that = this;*/
			/*	if (this.getView().byId("VT_CStradinRet").getSelectedKey() == "Yes" && this.getView().byId("FromFourth").getText() == "") 
				{
					sap.m.MessageBox.warning("Please select VehicleList");
					return;
				}*/
			if (this.getView().byId("VT_CStradinRet").getSelectedKey() == "Yes" && this.getView().byId("FromFourth").getText() == "") {
				sap.m.MessageBox.warning("Please select a vehicle");

				return;

			}

			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
					/*	pattern: "yyyy-MM-dd"*/

			});

			//------ requested dealer info//
			var TradeRequest = this.getView().byId("VT_CStradinRet").getSelectedKey();
			if (TradeRequest == "") {
				sap.m.MessageBox.warning("Please select Trade in Return");
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

						var Trade_Status = "S";
						/*	var Requesting_Dealer = that.getView().byId("dealrid").getText().substr(0, that.getView().byId("dealrid").getText().indexOf(
								"-"));*/
						var Requesting_Dealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;

						/*	var Requesting_Dealer_Name = that.getView().byId("dealrid").getText().substr(that.getView().byId("dealrid").getText().indexOf(
								"-") + 1);*/
						var Requesting_Dealer_Name = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName;

						//var Requested_Vtn = that.getView().byId("vtnid").getText();
						var Requested_Vtn = that.getView().getModel("TradeModel").getData().zzvtn;
						var Offered_Vtn = that.getView().byId("vtnid").getText();
						var DateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "yyyy-MM-dd"
						});
						/*	var Req_Current_ETA_FromData =  that.getView().byId("ctaid").getText();
								if (Req_Current_ETA_FromData != "") {
								var Req_Current_ETA_From = DateFormat.format(new Date(Req_Current_ETA_FromData));
							} else {
								var Req_Current_ETA_From = "0000-00-00T00:00:00";
							}*/
						/*	/  sssssssss  /*/
						var Req_Current_ETA_FromData = that.getView().byId("ctaid").getText();
						if (Req_Current_ETA_FromData != "") {
							var Req_Current_ETA_From = new Date(oDateFormat.format(new Date(Req_Current_ETA_FromData)));
						} else {
							var Req_Current_ETA_From = "0000-00-00T00:00:00";
						}
						/*	/  sssssssss  /*/

						/*	that.getView().byId("ctaid").getText();*/
						/*	if (Req_Current_ETA_FromData != "") {
								var Req_Current_ETA_From = oDateFormat.format(new Date(Req_Current_ETA_FromData));
							} else {
								var Req_Current_ETA_From = oDateFormat.format(new Date());
							}*/
						/*old working				
						var Req_Current_ETA_To =  that.getView().byId("totxtid").getText();
								if (Req_Current_ETA_To != "") {
								var Req_Current_ETA_To = DateFormat.format(new Date(Req_Current_ETA_To));
							} else {
								var Req_Current_ETA_To = "0000-00-00T00:00:00";
							}*/
						var Req_Current_ETA_ToDate = that.getView().byId("totxtid").getText();
						if (Req_Current_ETA_ToDate != "") {
							var Req_Current_ETA_To = new Date(oDateFormat.format(new Date(Req_Current_ETA_ToDate)));
						} else {
							var Req_Current_ETA_To = "0000-00-00T00:00:00";
						}
						/*	var Req_Current_ETA_To =  that.getView().byId("totxtid").getText();
								if (Req_Current_ETA_To != "") {
								var Req_Current_ETA_To = DateFormat.format(new Date(Req_Current_ETA_To));
							} else {
								var Req_Current_ETA_To = "0000-00-00T00:00:00";
							}*/
						/*	that.getView().byId("totxtid").getText();*/

						/*	if (Req_Current_ETA_To != "") {
							var Req_Current_ETA_To = oDateFormat.format(new Date(Req_Current_ETA_To));
						} else {
							var Req_Current_ETA_To = oDateFormat.format(new Date());
						}
*/
						var Req_Proposed_ETA_FromDate = that.getView().byId("prpid").getText();

						if (Req_Proposed_ETA_FromDate != "") {
							var Req_Proposed_ETA_From = new Date(oDateFormat.format(new Date(Req_Proposed_ETA_FromDate)));
						} else {
							var Req_Proposed_ETA_From = "0000-00-00T00:00:00";
						}
						var Req_Proposed_ETA_ToDate = that.getView().byId("otextlabel").getText();
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
						if (Off_Proposed_ETA_ToDate != "") {
							var Off_Proposed_ETA_To = new Date(oDateFormat.format(new Date(Off_Proposed_ETA_ToDate)));
						} else {
							var Off_Proposed_ETA_To = "0000-00-00T00:00:00";
						}
             var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
			var LoggedinUserLname =  sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
			var Created_By  = LoggedinUserFname+LoggedinUserLname;

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
						
						var estTimeZone    = moment.tz(Created_On, "America/New_York");
							Created_On =   moment(estTimeZone).format( 'YYYY-MM-DD');
						
						
						// Created_On = oDateFormat.format(new Date(Created_On));

						
						var Changed_on = new Date();
						Changed_on =   moment(estTimeZone).format( 'YYYY-MM-DD');
					
					//	Changed_on = oDateFormat.format(new Date(Changed_on));
						
					/*	var Created_On = new Date();
						Created_On = new Date(oDateFormat.format(new Date(Created_On)));
						  Created_On.setDate(Created_On.getDate() + 1);
						var Changed_on = new Date();
						Changed_on = new Date(oDateFormat.format(new Date(Changed_on)));
                       Changed_on.setDate(Changed_on.getDate() + 1);*/
						/*	var Created_On = that.getView().byId("idlabeal").getText();
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
							}*/
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
							"Created_By": Created_By,
							"Created_On": new Date(Created_On),
							"Changed_on": new Date(Changed_on),
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
							//	that.getView().byId("oTrdareqstat").setText("Request Sent");
							if (that.getView().byId("oTypeHere").getValue() != "" && that.getView().byId("oTypeHere").getValue() != " ") {
								that.TradeComment(oEntry);
							}
							//	if(that.getView().byId("FromFourth").getText()=="FromFourth"){
							that.TradeVehcles(oEntry);
							//	}
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
			that.Trade_Id = oEntry.Trade_Id;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				this.sPrefix = "";

			}
			this.nodeJsUrl = this.sPrefix;
			that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeComment";
			$.ajax({
				url: that.oDataUrl,
				method: "GET",
				async: false,
				dataType: "json",

				success: function (oData) {

					debugger;
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
				error: function () {}
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
			var LoggedinUserLname =  sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
			var Created_By  = LoggedinUserFname+LoggedinUserLname;

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

			var oTradeComment = {

				"Trade_Id.Trade_Id": Trade_Id,
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
			}, function () {

			});

		},
		TradeVehcles: function (oEntry) {

			var that = this;
			var Trade_Id = oEntry.Trade_Id;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
					/*	pattern: "yyyy-MM-dd"*/
			});
			var oCommentdate = new Date(oDateFormat.format(new Date()));
			 oCommentdate.setDate(oCommentdate.getDate() + 1);
			
			/*	var Suffix = that.getView().byId("oZsuffix").getText().split("-")[0];*/

			/*	var modelYear = that.getView().byId("zzMoyr").getText();
				var Apx = that.getView().byId("oApx").getText();
				var Series =that.getView().getModel("TradeModel").getData().zzseries;
				var exterior = that.getView().byId("Zextcolo").getText().split("-")[0];
				var vtn = that.getView().byId("vtnid").getText();
				var ostatus = that.getView().getModel("TradeModel").getData().zz_trading_ind;*/
			/*	if(ostatus=="Pipeline – non-Routable"){
					ostatus="2";
				}
				else if(ostatus=="Pipeline - Routable"){
					ostatus="1";
				}*/

			/*	var oOrdertype = that.getView().getModel("TradeModel").getData().zzordertype;
				var DNC = that.getView().getModel("TradeModel").getData().dnc_ind;*/
			var oSuffixReq = that.getView().byId("oZsuffix").getText().split("-")[0];
			var omodelReq = that.getView().byId("oZmodel").getText().split("-")[0];
			var omodelYearReq = that.getView().byId("zzMoyr").getText();
			var oApxReq = that.getView().byId("oApx").getText();
			var oSeriesReq = that.getView().getModel("TradeModel").getData().zzseries;
			var oexteriorReq = that.getView().byId("Zextcolo").getText().split("-")[0];
			var ointeriorReq = that.getView().getModel("TradeModel").oData.zzintcol;
			var ovtnReq = that.getView().getModel("TradeModel").oData.zzvtn;
			var ostatusReq = that.getView().getModel("TradeModel").getData().zz_trading_ind;
			var oOrdertypeReq = that.getView().getModel("TradeModel").getData().zzordertype;
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
				VTN: ovtnReq
			};
			oEntry2["Trade_Id.Trade_Id"] = oEntry.Trade_Id;
			var oVehicleDetails = [];
			oVehicleDetails.push(oEntry2);
			if (that.getView().byId("FromFourth").getText() == "FromFourth") {
				var Suffix = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzsuffix;

				var intColor = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzintcol;

				var model = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.matnr;
				var modelYear = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzmoyr;
				var Apx = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzapx;
				var Series = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzseries;
				var exterior = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzextcol;
				var vtn = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzvtn;
				var ostatus = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zz_trading_ind;
				var oOrdertype = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzordertype;
				var DNC = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.dnc_ind;
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
					VTN: vtn
				};
				oEntry1["Trade_Id.Trade_Id"] = oEntry.Trade_Id;
				oVehicleDetails.push(oEntry1);
			}

			/*	oEntry1["Trade_Id.Trade_Id"] = oEntry.Trade_Id;*/
			/*	oVehicleDetails["Trade_Id.Trade_Id"] = oEntry.Trade_Id;
			 */
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

			/*	that.oDataModel.create("/TradeVehicles", oEntry1, null, function (s) {*/
			for (var i = 0; i < oVehicleDetails.length; i++) {
				that.oDataModel.create("/TradeVehicles", oVehicleDetails[i], null, function (s) {
					/*	alert("ok");*/
				}, function () {

				});
			}
		},

		TradeStatus: function (oEntry) {

			var that = this;
			var Trade_Id = oEntry.Trade_Id;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
					/*pattern: "yyyy-MM-dd"*/
			});
				var oCommentdate = oDateFormat.format(new Date());
		/*	var oCommentdate = new Date(oDateFormat.format(new Date()));
			 oCommentdate.setDate(oCommentdate.getDate() + 1);*/
			/*		var Suffix = that.getView().byId("oZsuffix").getText().split("-")[0];
					if (Suffix != "") {
						var Suffix = that.getView().byId("oZsuffix").getText();
						var intColor = Suffix.substr(Suffix.indexOf("/") + 1);
					
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
					
						Suffix_Desc = Suffix_Desc.substr(Suffix_Desc.indexOf("-") + 1);
						Suffix_Desc = Suffix_Desc.substring(0, Suffix_Desc.indexOf('/'));
					} else {
						Suffix_Desc = "";
					}
				
					var Ext_Colour_Desc = that.getView().byId("Zextcolo").getText().split("-")[0];
					if (Ext_Colour_Desc != "") {
						var Ext_Colour_Desc = that.getView().byId("Zextcolo").getText();
						Ext_Colour_Desc = Ext_Colour_Desc.substr(Ext_Colour_Desc.indexOf("-") + 1);
					
					} else {
						Ext_Colour_Desc = "";
					}*/

			//	var Spars = sap.ui.getCore().getConfiguration().getLanguage();
		//	var Spars = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language.slice(0, 1); //GSR
		     var Spars;
		    if (this.sCurrentLocaleD == "French") {
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

			var oVTN = that.getView().getModel("TradeModel").getData().zzvtn;
			var oModel_DescReq = that.getView().getModel("TradeModel").getData().model_desc_en;
			var oSeries_DescReq = that.getView().getModel("TradeModel").getData().zzseries_desc_en;
			var oSuffix_DescReq = that.getView().getModel("TradeModel").getData().suffix_desc_en;
			var oInt_Colour_DescReq = that.getView().getModel("TradeModel").getData().mrktg_int_desc_en;
			var oExt_Colour_DescReq = that.getView().getModel("TradeModel").getData().mktg_desc_en;

			var Entry1 = {

				SPRAS: "E",
				Model_Desc: oModel_DescReq,
				Series_Desc: oSeries_DescReq,
				Suffix_Desc: oSuffix_DescReq,
				Int_Colour_Desc: oInt_Colour_DescReq,
				Ext_Colour_Desc: oExt_Colour_DescReq

			};
			Entry1["Trade_Id.Trade_Id"] = oEntry.Trade_Id;
			Entry1["VTN.VTN"] = oVTN;
			Tradestatus.push(Entry1);
			var oVTN = that.getView().getModel("TradeModel").oData.zzvtn;
			var oModel_DescReqF = that.getView().getModel("TradeModel").getData().model_desc_en;
			var oSeries_Desc1ReqF = that.getView().getModel("TradeModel").getData().zzseries_desc_fr;
			var oSuffix_Desc1ReqF = that.getView().getModel("TradeModel").getData().suffix_desc_fr;
			var oInt_Colour_Desc1ReqF = that.getView().getModel("TradeModel").getData().mrktg_int_desc_fr;
			var oExt_Colour_Desc1ReqF = that.getView().getModel("TradeModel").getData().mktg_desc_fr;

			var Entry2 = {

				SPRAS: "F",
				Model_Desc: oModel_DescReqF,
				Series_Desc: oSeries_Desc1ReqF,
				Suffix_Desc: oSuffix_Desc1ReqF,
				Int_Colour_Desc: oInt_Colour_Desc1ReqF,
				Ext_Colour_Desc: oExt_Colour_Desc1ReqF

			};
			Entry2["Trade_Id.Trade_Id"] = oEntry.Trade_Id;
			Entry2["VTN.VTN"] = oVTN;
			Tradestatus.push(Entry2);

			if (that.getView().byId("FromFourth").getText() == "FromFourth") {
				var oVTN = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzvtn;
				var oModel_Desc = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.model_desc_en;
				var oSeries_Desc = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzseries_desc_en;
				var oSuffix_Desc = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.suffix_desc_en;
				var oInt_Colour_Desc = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.mrktg_int_desc_en;
				var oExt_Colour_Desc = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.mktg_desc_en;

				var Entry3 = {

					SPRAS: "E",
					Model_Desc: oModel_Desc,
					Series_Desc: oSeries_Desc,
					Suffix_Desc: oSuffix_Desc,
					Int_Colour_Desc: oInt_Colour_Desc,
					Ext_Colour_Desc: oExt_Colour_Desc

				};
				Entry3["Trade_Id.Trade_Id"] = oEntry.Trade_Id;
				Entry3["VTN.VTN"] = oVTN;
				Tradestatus.push(Entry3);
				var oModel_Desc1 = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.model_desc_fr;
				var oSeries_Desc1 = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.zzseries_desc_fr;
				var oSuffix_Desc1 = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.suffix_desc_fr;
				var oInt_Colour_Desc1 = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.mrktg_int_desc_fr;
				var oExt_Colour_Desc1 = that.getView().getModel("TradeModel").getData().VehicleTradeVehicle.mktg_desc_fr;

				var Entry4 = {

					SPRAS: "F",
					Model_Desc: oModel_Desc1,
					Series_Desc: oSeries_Desc1,
					Suffix_Desc: oSuffix_Desc1,
					Int_Colour_Desc: oInt_Colour_Desc1,
					Ext_Colour_Desc: oExt_Colour_Desc1

				};
				Entry4["Trade_Id.Trade_Id"] = oEntry.Trade_Id;
				Entry4["VTN.VTN"] = oVTN;
				Tradestatus.push(Entry4);

			}

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
			for (var i = 0; i < Tradestatus.length; i++) {
				that.oDataModel.create("/TradeVehicleDesc", Tradestatus[i], null, function (s) {
					that.getRouter().navTo("VehicleTrade_Summary", {
						DataClicked: "Yes"
					});
				}, function () {

				});
			}
		},
		onDummySummary: function () {
			debugger
			this.getRouter().navTo("VehicleTrade_Summary");

		},
	_setTheLanguage: function (oEvent) {

				var oI18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties"
				});
				this.getView().setModel(oI18nModel, "i18n");

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

					// if (this.sDivision == aDataBP[0].Division) {

					// 	this.getView().byId("messageStripError").setProperty("visible", false);

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
						handleLiveChangeText: function(oEvent) {
					var oTextArea = oEvent.getSource(),
							iValueLength = oTextArea.getValue().length,
							iMaxLength = oTextArea.getMaxLength(),
							sState = iValueLength > iMaxLength ? "Warning" : "None";

					oTextArea.setValueState(sState);
				}

	});
});