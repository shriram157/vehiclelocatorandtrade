 sap.ui.define([
 	/*"sap/ui/core/mvc/Controller"*/
 	"vehicleLocator/controller/BaseController",
 	"sap/ui/model/Sorter",
 	"sap/ui/model/Filter",
 	"vehicleLocator/Formatter/Formatter"
 ], function (BaseController, Sorter, Filter, Formatter) {
 	"use strict";

 	return BaseController.extend("vehicleLocator.controller.VehicleTrade_VehicleSelection", {

 		onInit: function () {
 			//
 			var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
 			var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
 			this.getView().byId("oDealerCode4").setText(LoggedInDealerCode2);
 			this.getView().byId("oDealerOwnVehiSele").setText(LoggedInDealer);
 			if (!this._oResponsivePopover) {
 				this._oResponsivePopover = sap.ui.xmlfragment("vehicleLocator.fragment.VehicleSearchResult", this);
 				this._oResponsivePopover.setModel(this.getView().getModel());
 			}
 			var oTable = this.getView().byId("vehicleSelectTable");
 			var that = this;

 			var oViewModel = new sap.ui.model.json.JSONModel({
 				busy: false,
 				delay: 0,
 				// tableCount: 40

 			});

 			this.getView().setModel(oViewModel, "detailView");

 			/// set the logo and Language. 

 			this._setTheLanguage();

 			this._setTheLogo();

 			this.getRouter().getRoute("VehicleTrade_VehicleSelection").attachPatternMatched(this.onRouteMatched, this);

 		},

 		onRouteMatched: function (oEvent) {
 			//
 			var oDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;

 			// var Series = this.getOwnerComponent().SelectedMSMData[0].SeriesCmbo;
 			sap.ui.core.BusyIndicator.show(0);

 			var sLocation = window.location.host;
 			var sLocation_conf = sLocation.search("webide");

 			if (sLocation_conf == 0) {
 				this.sPrefix = "/vehicleLocatorNode";
 			} else {
 				this.sPrefix = "";

 			}

 			this.nodeJsUrl = this.sPrefix + "/node";
 			this.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_MASTER_SRV";

 			// that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

 			// var userAttributesModellen =  sap.ui.getCore().getModel("LoginuserAttributesModel").getData();
 			// var oDealer1 = userAttributesModellen[0].DealerCode;
 			// if (oDealer1 == undefined){
 			// 	oDealer1 = "";
 			// }
 			var oReceivedData = sap.ui.getCore().SelectedTrade;
 			// this.RequestingDealerToSendToSAP= oReceivedData.kunnr;
 			if (oReceivedData !== undefined) {
 				var requestDealerToSAP = oReceivedData.kunnr;
 				var oDealer1 = requestDealerToSAP;

 			} else {
 				// may be from block summary. 
 				// var oDropDownSelectedDealer = sap.ui.getCore().dropDownSelectionData;
 				if (sap.ui.getCore().getModel("dropDownSelectionData") !== undefined) {
 					var oDropDownSelectedDealer = sap.ui.getCore().getModel("dropDownSelectionData").getData();
 					if (oDropDownSelectedDealer !== undefined) {
 						var requestDealerToSAP = oDropDownSelectedDealer.dropDownSelectedBP;
 						var oDealer1 = requestDealerToSAP;
 					}
 				} else {
 					var oDealer1 = oEvent.getParameter("arguments").Req_Dealer;
 				}

 			}
 			// var oDealer1 = this.RequestingDealerToSendToSAP;
 			// var oDealer1 = this.requestedDealerToSAP;
 			if (oDealer1.length == 10) {
 				oDealer1 = oDealer1.slice(-5);
 			}
 			var SeriesUrl = this.oDataUrl + "/ZVMS_CDS_ETA_consolidate('" + oDealer1 + "')/Set?$filter=kunnr eq '" + oDealer +
 				"'&$format=json";
 			var that = this;
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
 						"F5",
 						"DM"
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
 						return (x.zzordertype == "SO");
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

 					// for dnc ind lets put that as DNC

 					//  put the DNC indicator to the screen. 
 					// var oModelVehicleSelectTable = this.getView().getModel("vehicleSelectTableModel");
 					// var oModelVehicleSelectTableData = this.getView().getModel("vehicleSelectTableModel").getData();

 					// for (var i = 0; i < oJsonModel.length; i++) {
 					// 	if (oJsonModel[i].dnc_ind == "Y") {
 					// 		oJsonModel[i].zzordertype = "DNC";
 					// 	}
 					// }
 					for (var i = 0; i < oJsonModel.oData.length; i++) {
 						if (oJsonModel.oData[i].dnc_ind == "Y") {
 							oJsonModel.oData[i].zzordertype = "DNC";
 						}
 					}

 					oJsonModel.setSizeLimit(15000);
 					sap.ui.getCore().setModel(oJsonModel, "oVehicleSelectionResults");
 					var oModeltemp = that.getView().setModel(oJsonModel, "vehicleSelectTableModel");
 					oModeltemp.updateBindings(true);

 					sap.ui.core.BusyIndicator.hide();

 				},
 				error: function () {

 					sap.ui.core.BusyIndicator.hide();
 				}
 			});
 			if (sap.ui.getCore().getModel("oVehicleSelectionResults") != undefined) {
 				var oVehicleModel = sap.ui.getCore().getModel("oVehicleSelectionResults").getData();

 				// set the model	
 				var model = new sap.ui.model.json.JSONModel(oVehicleModel);
 				//    var model = oVehicleModel.getData();
 				model.setSizeLimit(10000);

 				// based on the language set the descriptions. 
 				//     if (this.sCurrentLocaleD == "French") {
 				// for (var i=0; i<model.oData.length; i++ ){
 				// 	model.oData[i].mktg_desc_en = model.oData[i].mktg_desc_fr;
 				// 	model.oData[i].model_desc_en = model.oData[i].model_desc_fr;
 				// 	model.oData[i].zzseries_desc_en = model.oData[i].zzseries_desc_fr;
 				// 	model.oData[i].suffix_desc_en  = model.oData[i].suffix_desc_fr;
 				// 		model.oData[i].mrktg_int_desc_en  = model.oData[i].mrktg_int_desc_fr;
 				// }

 				//    }

 				// this.getView().setModel(model, "vehicleSelectTableModel");

 				var oModeltemp = this.getView().setModel(model, "vehicleSelectTableModel");
 				oModeltemp.updateBindings(true);
 			}
 			var oDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;
 			var d = new Date();
 			var yeararray = [];
 			var n = (d.getFullYear()) + 1;
 			for (var i = 0; i < 3; i++) {
 				var obj = {};
 				obj.year = n - i;
 				yeararray.push(obj);
 			}
 			var yearmodel = new sap.ui.model.json.JSONModel();
 			yearmodel.setData(yeararray);
 			this.getView().byId("oVt_MoyrCmbo").setModel(yearmodel);
 			this.getView().byId("oVt_MoyrCmbo").setSelectedKey("");
 			this.getView().byId("oVt_MoyrCmbo").setSelectedItem("");

 			var sLocation = window.location.host;
 			var sLocation_conf = sLocation.search("webide");

 			if (sLocation_conf == 0) {
 				this.sPrefix = "/vehicleLocatorNode";
 			} else {
 				this.sPrefix = "";

 			}

 			this.SelectedVehicleFrom = oEvent.getParameter("arguments").SelectedVehicleFrom;
 			var that = this;

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

 			this.getView().setModel(oViewModel, "languageModel");
 			// var Status = sap.ui.getCore().getModel("SearchedData").getData();

 			if (this.getView().byId("VLRColor1").getItems().filter(function (x) {
 					return x.mProperties.key == "all"
 				}).length == 0) {

 				if (this.sCurrentLocale == "EN") {
 					var newItem = new sap.ui.core.Item({
 						key: "all",
 						text: "ALL"
 					});
 					this.getView().byId("VLRColor1").insertItem(newItem);
 					// this.getView().byId("VLRColor1").setSelectedKey("all");
 					// this.getView().byId("VLRColor1").setSelectedItem("ALL");
 					// this.getView().byId("VLRSuffix1").insertItem(newItem);
 					// this.getView().byId("VLRSuffix1").setSelectedKey("all");

 				} else {

 					var newItem = new sap.ui.core.Item({
 						key: "all",
 						text: "TOUS"
 					});
 					this.getView().byId("VLRColor1").insertItem(newItem);
 					// this.getView().byId("VLRColor1").setSelectedKey("all");
 					// this.getView().byId("VLRColor1").setSelectedItem("TOUS");
 					// this.getView().byId("VLRSuffix1").insertItem(newItem);
 					// this.getView().byId("VLRSuffix1").setSelectedKey("all");

 				}

 			}

 			// var obj = {};
 			// for (var i = 0, len = Status.length; i < len; i++)
 			// 	obj[Status[i]['zz_trading_ind']] = Status[i];
 			// Status = new Array();
 			// for (var key in obj)
 			// 	Status.push(obj[key]);
 			// var StatusDataFilter = [];
 			// for (var i = 0; i < Status.length; i++) {
 			// 	if (Status[i].zz_trading_ind == "1" || Status[i].zz_trading_ind == "2") {
 			// 		StatusDataFilter.push(Status[i]);
 			// 	}
 			// }
 			// if (StatusDataFilter.length == 0) {
 			var StatusDataFilter = [{
 				"zz_trading_ind": "1"

 			}, {
 				"zz_trading_ind": "2"
 			}];
 			// }
 			var Model = new sap.ui.model.json.JSONModel(StatusDataFilter);
 			// var StatusFilter = StatusDataFilter.filter(function (x) {
 			// 	return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3");
 			// });
 			// var Statusind1 = StatusDataFilter.filter(function (x) {
 			// 	return (x.zz_trading_ind == "1");
 			// });

 			/*Added changes for accesories installed dropdown start*/
 			var accessoryModel = new sap.ui.model.json.JSONModel();
 			var accesoriesInstalledFilter = [{
 				"zaccesories": "All"

 			}, {
 				"zaccesories": "Yes"
 			}, {
 				"zaccesories": "No"
 			}];
 			accessoryModel.setData(accesoriesInstalledFilter);
 			this.getView().byId("AcceInstalledCobmo1").setModel(accessoryModel);
 			this.getView().byId("AcceInstalledCobmo1").setSelectedKey("All");

 			/*Added changes for accesories installed dropdown end*/
 			this.getView().byId("VLRStatus1").setEnabled(false);
 			this.getView().byId("AcceInstalledCobmo1").setEnabled(false);
 			this.getView().byId("VLRSuffix1").setEnabled(false);
 			this.getView().byId("VLRColor1").setEnabled(false);
 			this.getView().byId("McCmbo").setEnabled(false);
 			that.getView().byId("oVt_SeriesCmbo").setEnabled(false);
 			that.getView().byId("chknew1").setEnabled(false);
 			that.getView().byId("chkexi").setEnabled(false);

 			this.getView().byId("VLRStatus1").setModel(Model);
 			this.getView().byId("VLRStatus1").setSelectedKey("");
 			// if (StatusFilter.length != 0) {

 			// 	if (this.sCurrentLocale == 'EN') {
 			// 		this.getView().byId("VLRStatus1").setSelectedItem("Pipeline - Routable");
 			// 	} else {
 			// 		this.getView().byId("VLRStatus1").setSelectedItem("Chaîne d'approvisionnement – acheminable");
 			// 	}

 			// 	this.getView().byId("VLRStatus1").setSelectedKey("2");

 			// } else if (StatusDataFilter.length != 0) {

 			// 	if (this.sCurrentLocale == 'EN') {

 			// 		var newItem = new sap.ui.core.Item({
 			// 			key: "2",
 			// 			text: "Pipeline - Routable"
 			// 		});

 			// 		this.getView().byId("VLRStatus1").insertItem(newItem);
 			// 		this.getView().byId("VLRStatus1").setSelectedItem("Pipeline - Routable");
 			// 		this.getView().byId("VLRStatus1").setSelectedKey("2");

 			// 	} else {
 			// 		var newItem = new sap.ui.core.Item({
 			// 			key: "2",
 			// 			text: "Chaîne d'approvisionnement – acheminable"
 			// 		});

 			// 		this.getView().byId("VLRStatus1").insertItem(newItem);
 			// 		this.getView().byId("VLRStatus1").setSelectedItem("Chaîne d'approvisionnement – acheminable");
 			// 		this.getView().byId("VLRStatus1").setSelectedKey("2");

 			// 	}

 			// }
 			// if (Statusind1.length == 0) {
 			// 	if (this.sCurrentLocale == 'EN') {

 			// 		var newItem = new sap.ui.core.Item({
 			// 			key: "1",
 			// 			text: "Stock-Non-Routable"
 			// 		});
 			// 		this.getView().byId("VLRStatus1").insertItem(newItem);

 			// 	} else {

 			// 		var newItem = new sap.ui.core.Item({
 			// 			key: "1",
 			// 			text: "Stock-non-acheminable"
 			// 		});
 			// 		this.getView().byId("VLRStatus1").insertItem(newItem);

 			// 	}
 			// }

 		},
 		handleoVt_MoyrChange: function () {
 			var that = this;
 			that.getView().byId("oVt_SeriesCmbo").setSelectedKey("");
 			if (this.getView().byId("VLRColor1").getItems().filter(function (x) {
 					return x.mProperties.key == "all";
 				}).length == 0) {

 				if (this.sCurrentLocale == "EN") {
 					var newItem = new sap.ui.core.Item({
 						key: "all",
 						text: "ALL"
 					});
 					this.getView().byId("VLRColor1").insertItem(newItem);

 				} else {

 					var newItem = new sap.ui.core.Item({
 						key: "all",
 						text: "TOUS"
 					});
 					this.getView().byId("VLRColor1").insertItem(newItem);

 				}

 			}
 			this.getView().byId("VLRColor1").setSelectedKey("all");

 			if (this.getView().byId("VLRSuffix1").getItems().filter(function (x) {
 					return x.mProperties.key == "all";
 				}).length == 0) {

 				if (this.sCurrentLocale == "EN") {
 					var newItem = new sap.ui.core.Item({
 						key: "all",
 						text: "ALL"
 					});
 					this.getView().byId("VLRSuffix1").insertItem(newItem);

 				} else {

 					var newItem = new sap.ui.core.Item({
 						key: "all",
 						text: "TOUS"
 					});
 					this.getView().byId("VLRSuffix1").insertItem(newItem);

 				}

 			}
 			this.getView().byId("VLRSuffix1").setSelectedKey("all");

 			if (this.getView().byId("McCmbo").getItems().filter(function (x) {
 					return x.mProperties.key == "all";
 				}).length == 0) {

 				if (this.sCurrentLocale == "EN") {
 					var newItem = new sap.ui.core.Item({
 						key: "all",
 						text: "ALL"
 					});
 					this.getView().byId("McCmbo").insertItem(newItem);

 				} else {

 					var newItem = new sap.ui.core.Item({
 						key: "all",
 						text: "TOUS"
 					});
 					this.getView().byId("McCmbo").insertItem(newItem);

 				}

 			}
 			this.getView().byId("McCmbo").setSelectedKey("all");
 			// this.getView().byId("AcceInstalledCobmo1").setSelectedKey("all");
 			// this.getView().byId("chknew1").setSelected(false);

 			// that.oJsonModelVLS = new sap.ui.model.json.JSONModel([]);
 			// that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS);
 			// that.getView().byId("oVt_SeriesCmbo").getModel().refresh(true);

 			// that.getView().setModel(null, "Suffix");

 			// that.getView().setModel(null, "SeriesData");
 			// that.getView().setModel(null, "ModelCode");
 			// that.getView().setModel(null, "ModelCode");

 			// that.getView().byId("McCmbo").setValue(null);
 			// that.getView().byId("VLRSuffix1").setValue(null);
 			this.getView().byId("McCmbo").setEnabled(false);
 			that.getView().byId("oVt_SeriesCmbo").setEnabled(true);
 			this.getView().byId("VLRStatus1").setEnabled(true);
 			this.getView().byId("AcceInstalledCobmo1").setEnabled(true);
 			that.getView().byId("chknew1").setEnabled(true);
 			that.getView().byId("chkexi").setEnabled(true);

 			this.getView().byId("VLRSuffix1").setEnabled(false);
 			this.getView().byId("VLRColor1").setEnabled(false);
 			// that.getView().byId("McCmbo").setSelectedKey("");
 			var table = this.getView().byId("vehicleSelectTable");

 			// var oModel1 = new sap.ui.model.json.JSONModel();

 			// var data =[];

 			// oModel1.setData(data);

 			// table.setModel(oModel1, "oVehicleSelectionResults");
 			// sap.ui.getCore().setModel(null, "oVehicleSelectionResults");
 			// if (that.getView().byId("oVt_SeriesCmbo").getModel() == undefined) {
 			var that = this;
 			/*var Array = [];*/
 			sap.ui.core.BusyIndicator.show();
 			that.oSelectedYear = that.getView().byId("oVt_MoyrCmbo").getSelectedKey();
 			that.getView().byId("VLRStatus1").setSelectedKey("2");

 			// if (this.sCurrentLocale == 'EN') {

 			// 	var newItem = new sap.ui.core.Item({
 			// 		key: "2",
 			// 		text: "Pipeline - Routable"
 			// 	});

 			// 	this.getView().byId("VLRStatus1").insertItem(newItem);
 			// 	this.getView().byId("VLRStatus1").setSelectedItem("Pipeline - Routable");
 			// 	this.getView().byId("VLRStatus1").setSelectedKey("2");

 			// } else {
 			// 	var newItem = new sap.ui.core.Item({
 			// 		key: "2",
 			// 		text: "Chaîne d'approvisionnement – acheminable"
 			// 	});

 			// 	this.getView().byId("VLRStatus1").insertItem(newItem);
 			// 	this.getView().byId("VLRStatus1").setSelectedItem("Chaîne d'approvisionnement – acheminable");
 			// 	this.getView().byId("VLRStatus1").setSelectedKey("2");

 			// }

 			// 
 			// that.oSelectedYear = new Date().getFullYear();

 			//for temporary year 2018-data available for 2018 
 			// that.oSelectedYear = "2018"; 
 			// that.oSelectedYear = new Date().getFullYear();
 			/*	that.getView().byId("Pacific").setSelected(false);
 				that.getView().byId("Prairie").setSelected(false);
 				that.getView().byId("Central").setSelected(false);
 				that.getView().byId("Atlantic").setSelected(false);
 				that.getView().byId("Quebec").setSelected(false);*/
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

 			// var i = 0;
 			// var modelData = [];
 			// that.oSelectedYearTemp = that.oSelectedYear - 2;
 			// do {

 			// 	that.oSelectedYear = that.oSelectedYearTemp + i;

 			// that.receivedCounter = 0;
 			var SeriesUrl = that.oDataUrl + "/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + that.oSelectedYear + "'and visibility eq 'X'";
 			// var SeriesUrl = that.oDataUrl + "/ZC_MODEL_DETAILS";

 			var ajax1 = $.ajax({
 				dataType: "json",
 				xhrFields: //
 				{
 					withCredentials: true
 				},

 				// beforeSend: function (request) {
 				// 	request.setRequestHeader('Authorization', 'Basic ' + btoa('anisetc:anisetc'));
 				// },
 				url: SeriesUrl,
 				async: true,
 				success: function (result) {
 					var modelData = result.d.results;
 					// 			 modelData = modelData.filter(function (x) {
 					// 	return (x.Modelyear==that.oSelectedYear||x.Modelyear==that.oSelectedYear-2||x.Modelyear==that.oSelectedYear-1||x.Modelyear==that.oSelectedYear+1);

 					// });
 					// that.receivedCounter = that.receivedCounter + 1;
 					// $.each(result.d.results, function (i, receivedData) {

 					// modelData.push({

 					// 	ENModelDesc: receivedData.ENModelDesc,
 					// 	FRModelDesc: receivedData.FRModelDesc,
 					// 	Model: receivedData.Model,
 					// 	Modelyear: receivedData.Modelyear,
 					// 	TCISeries: receivedData.TCISeries,
 					// 	suffix: receivedData.suffix

 					// });
 					// });

 					// if (that.receivedCounter == 4) { // all the data received. 

 					//console.log([...new Set(modelData)]) 
 					// var modelDataNoDuplicates = uniq(modelData);

 					var modelDataNoDuplicates = that.removeDuplicates(modelData, "ENModelDesc");

 					// modelDataNoDuplicates = Array.from(new Set(modelData.map(JSON.stringify))).map(JSON.parse);

 					var SeriesModel = new sap.ui.model.json.JSONModel(modelDataNoDuplicates);
 					sap.ui.getCore().setModel(SeriesModel, "SeriesModel");
 					that.SuffixDescrioptionBinding();
 					that.onStatusChange();
 					// }
 				}
 			});

 			// 	i++;

 			// }
 			// while (i < 4);

 			// function uniqBy(a, key) {
 			//     var seen = {};
 			//     return a.filter(function(item) {
 			//         var k = key(item);
 			//         return seen.hasOwnProperty(k) ? false : (seen[k] = true);
 			//     });
 			// },

 			// function uniq(a) {
 			//   //return Array.from(new Set(a));

 			//   return ([...new Set(a)]) ;

 			// },

 			// var SeriesUrl = that.oDataUrl + "/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + that.oSelectedYear + "'";
 			// var ajax1 = $.ajax({
 			// 	dataType: "json",
 			// 	xhrFields: //
 			// 	{
 			// 		withCredentials: true
 			// 	},

 			// 	// beforeSend: function (request) {
 			// 	// 	request.setRequestHeader('Authorization', 'Basic ' + btoa('anisetc:anisetc'));
 			// 	// },
 			// 	url: SeriesUrl,
 			// 	async: true,
 			// 	success: function (result) {
 			// 		var SeriesUrl = result.d.results;
 			// 		var SeriesModel = new sap.ui.model.json.JSONModel(SeriesUrl);
 			// 		sap.ui.getCore().setModel(SeriesModel, "SeriesModel");
 			// 		that.SuffixDescrioptionBinding();
 			// 	}
 			// });

 			//	that.SeriesBinding(that.oSelectedYear);

 			// }
 		},
 		onStatusChange: function () {

 			//  when the control is reached here, we need to clear the filterbox
 			this.getView().byId("searchMyVehicleList").setValue("");

 			var filterArray = [];
 			/*	this.getView().byId("table1VSR").getBinding("items").filter([]);*/
 			// this.getView().byId("table1VSR").getBinding("rows").filter([]); guna

 			// onVlrCommonChange
 			var SelectedYear = this.getView().byId("oVt_MoyrCmbo").getSelectedKey();
 			var SelectedSeries = this.getView().byId("oVt_SeriesCmbo").getSelectedKey();
 			var SelectedModel = this.getView().byId("McCmbo").getSelectedKey();
 			this.SelectedDealer = this.getView().byId("VLRDealer1").getSelectedKey();
 			this.SelectedColor = this.getView().byId("VLRColor1").getSelectedKey();
 			var SelectedSuffix = this.getView().byId("VLRSuffix1").getSelectedKey();
 			var Status = this.getView().byId("VLRStatus1").getSelectedKey();
 			if (Status != "") {

 				if (Status == "1") {
 					filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status));
 				} else {
 					filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.NE, "1"));
 					// filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, "2"));
 					//filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, "3"));

 					//filterArray.push(new sap.ui.model.Filter({
 					//       and: false,
 					//       filters: [
 					//          new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.EQ, "2"),
 					//          new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.EQ, "3")
 					//       ]})
 					//  );			

 				}
 			}
 			if (SelectedYear != "" && SelectedYear != "all") {

 				filterArray.push(new sap.ui.model.Filter("zzmoyr", sap.ui.model.FilterOperator.Contains, SelectedYear));

 			}

 			// var Dealer = this.getView().byId("VLRDealer1").getSelectedKey();

 			// if (Dealer != "" && Dealer != "all") {

 			// 	filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, Dealer));
 			// } else if (Dealer == "all") {

 			// 	// var SelDealers = this.getView().byId("table1VSR").getBinding("rows").getModel().getData();    //guna
 			// 	var SelDealers = this.getView().getModel("vehicleSelectTableModel").getData();

 			// 	for (var i = 0; i < SelDealers.length; i++) {
 			// 		filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, SelDealers[i].kunnr));
 			// 	}
 			// var Color = this.getView().byId("VLRColor1").getSelectedKey();
 			if (SelectedSeries != "" && SelectedSeries != "all") {

 				filterArray.push(new sap.ui.model.Filter("zzseries", sap.ui.model.FilterOperator.Contains, SelectedSeries));

 			}
 			if (SelectedModel != "" && SelectedModel != "all") {

 				filterArray.push(new sap.ui.model.Filter("matnr", sap.ui.model.FilterOperator.Contains, SelectedModel));

 			}
 			// }
 			// var Suffix = this.suffixSelectedKey;
 			// if (Suffix != this.getView().byId("VLRSuffix1").getSelectedKey()) {
 			// 	Suffix = this.getView().byId("VLRSuffix1").getSelectedKey();
 			// }
 			if (SelectedSuffix != "" && SelectedSuffix != "all") {
 				// var suffixisNotequaltoAll = true;
 				filterArray.push(new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, SelectedSuffix));
 			}
 			// else if (Suffix == "all") {
 			// 	var suffixisNotequaltoAll = false;
 			// 	var SelSuffix = this.getView().byId("VLRSuffix1").getModel().getData();
 			// 	// for (var i = 0; i < SelSuffix.length; i++) {
 			// 	// 	filterArray.push(new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, SelSuffix[i].zzsuffix));
 			// 	// }
 			// }
 			var Color = this.getView().byId("VLRColor1").getSelectedKey();
 			if (Color != "" && Color != "all") {

 				filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, Color));

 			}
 			// else if (Color == "all") {

 			// 	// var SelColor = this.getView().byId("table1VSR").getBinding("rows").getModel().getData(); //guna
 			// 	var SelColor = this.getView().getModel("vehicleSelectTableModel").getData();
 			// 	// for (var i = 0; i < SelColor.length; i++) {
 			// 	// 	// if (Status == "1") {
 			// 	// 	// 	if ( SelColor[i].zz_trading_ind == "1") {
 			// 	// 	// 		 if (suffixisNotequaltoAll == true && SelColor[i].zzsuffix == Suffix ) {
 			// 	// 	// 		filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, SelColor[i].zzextcol));
 			// 	// 	// 		 } else if (suffixisNotequaltoAll == false ){
 			// 	// 	// 		 	filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, SelColor[i].zzextcol));	
 			// 	// 	// 		 }
 			// 	// 	// 	}
 			// 	// 	// } else {
 			// 	// 	// 	if (SelColor[i].zz_trading_ind == "2" || SelColor[i].zz_trading_ind == "3") {
 			// 	// 	// 								 if (suffixisNotequaltoAll == true && SelColor[i].zzsuffix == Suffix ) {
 			// 	// 	// 		filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, SelColor[i].zzextcol));
 			// 	// 	// 		 } else if (suffixisNotequaltoAll == false){
 			// 	// 	filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, SelColor[i].zzextcol));
 			// 	// 	// 		 }
 			// 	// 	// 	}
 			// 	// 	// }

 			// 	// }

 			// }

 			var ShowDoNotCallVehicles = this.getView().byId("chknew1").getSelected();
 			if (ShowDoNotCallVehicles == true) {

 				/*	filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, "Y"));*/
 				filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, "Y"));
 			} else if (ShowDoNotCallVehicles == false) {

 				/*	filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, "Y"));*/
 				filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, "N"));
 				filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, ""));
 			}
 			var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
 			if (ShowHoldVehicles == true) {

 				/*	filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, "Y"));*/
 				filterArray.push(new sap.ui.model.Filter("Hold_stat", sap.ui.model.FilterOperator.EQ, "Y"));
 			} else if (ShowHoldVehicles == false) {

 				/*	filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, "Y"));*/
 				filterArray.push(new sap.ui.model.Filter("Hold_stat", sap.ui.model.FilterOperator.EQ, "N"));
 				filterArray.push(new sap.ui.model.Filter("Hold_stat", sap.ui.model.FilterOperator.EQ, ""));
 			}
 			var selectedAccessInstalled = this.getView().byId("AcceInstalledCobmo1").getSelectedKey();
 			if (selectedAccessInstalled == "Yes") {
 				//filterArray.push(new sap.ui.model.Filter("non_D_flag", sap.ui.model.FilterOperator.Contains,"X" ));
 				filterArray.push(new sap.ui.model.Filter("pd_flag", sap.ui.model.FilterOperator.Contains, "D"));
 				//filterArray.push(new sap.ui.model.Filter("non_D_flag", sap.ui.model.FilterOperator.Contains," " ));
 			} else if ((selectedAccessInstalled == "No")) {
 				filterArray.push(new sap.ui.model.Filter("pd_flag", sap.ui.model.FilterOperator.EQ, ""));
 				//filterArray.push(new sap.ui.model.Filter("non_D_flag", sap.ui.model.FilterOperator.Contains, "X"));
 				//filterArray.push(new sap.ui.model.Filter("non_D_flag", sap.ui.model.FilterOperator.Contains," " ));
 			}
 			// 	var selectedModel = this.getView().byId("McCmbo").getSelectedKey();
 			// 	if (selectedModel != "" && selectedModel != "all") {

 			// filterArray.push(new sap.ui.model.Filter("matnr", sap.ui.model.FilterOperator.Contains, selectedModel));

 			// } else if (selectedModel == "all") {

 			// 	// var SelColor = this.getView().byId("table1VSR").getBinding("rows").getModel().getData(); //guna
 			// 	var SelModel = this.getView().getModel("vehicleSelectTableModel").getData();
 			// 	// for (var i = 0; i < SelModel.length; i++) {

 			// 	// 	filterArray.push(new sap.ui.model.Filter("matnr", sap.ui.model.FilterOperator.Contains, SelModel[i].matnr));

 			// 	// }

 			// }
 			// if (selectedAccessInstalled == "Yes") {
 			//filterArray.push(new sap.ui.model.Filter("non_D_flag", sap.ui.model.FilterOperator.Contains,"X" ));

 			//filterArray.push(new sap.ui.model.Filter("non_D_flag", sap.ui.model.FilterOperator.Contains," " ));
 			// var Status = this.getView().byId("VLRStatus1").getSelectedKey();

 			this.byId("vehicleSelectTable")
 				.getBinding("items")
 				.filter(filterArray);

 		},
 		onStatusChangeMultiple: function () {
 			var Status = this.getView().byId("VLRStatus1").getSelectedKey();
 			if (Status == "1") {

 				// var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"}) guna
 				var Dealer = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 					return x.zz_trading_ind == "1"
 				});

 			} else {
 				var Dealer = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 					return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3");
 				});
 				//	var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")}) guna
 			}
 			var obj = {};
 			// for (var i = 0, len = Dealer.length; i < len; i++)
 			// 	obj[Dealer[i]['kunnr']] = Dealer[i];
 			// Dealer = new Array();
 			// for (var key in obj)
 			// 	Dealer.push(obj[key]);
 			// var selctedDealer = this.getView().byId("VLRDealer1").getSelectedKey();
 			// var Model1 = new sap.ui.model.json.JSONModel(Dealer);
 			// Model1.setSizeLimit(1000);
 			// this.getView().byId("VLRDealer1").setModel(Model1);
 			// // if (Dealer.length != 0) {
 			// if (this.getView().byId("VLRDealer1").getItems().filter(function (x) {
 			// 		return x.mProperties.key == "all"
 			// 	}).length == 0) {

 			// 	if (this.sCurrentLocale == "EN") {
 			// 		var newItem = new sap.ui.core.Item({
 			// 			key: "all",
 			// 			text: "ALL"
 			// 		});
 			// 	} else {
 			// 		var newItem = new sap.ui.core.Item({
 			// 			key: "all",
 			// 			text: "TOUS"
 			// 		});

 			// 	}

 			// 	this.getView().byId("VLRDealer1").insertItem(newItem);
 			// 	var SelctKey = Dealer.filter(function (x) {
 			// 		return x.kunnr == selctedDealer
 			// 	});
 			// 	if (selctedDealer == "" || SelctKey.length == 0) {
 			// 		if (this.sCurrentLocale == "EN") {
 			// 			this.getView().byId("VLRDealer1").setSelectedItem("ALL");
 			// 		} else {
 			// 			this.getView().byId("VLRDealer1").setSelectedItem("TOUS");
 			// 		}

 			// 		this.getView().byId("VLRDealer1").setSelectedKey("all");
 			// 	} else {
 			// 		this.getView().byId("VLRDealer1").setSelectedKey(selctedDealer);
 			// 	}
 			// }

 			var Status = this.getView().byId("VLRStatus1").getSelectedKey();
 			if (Status == "1") {
 				// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"})

 				var Color = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 					return x.zz_trading_ind == "1";
 				});
 			} else {
 				// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")})
 				var Color = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 					return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3");
 				});
 			}
 			//	var Color = sap.ui.getCore().getModel("SearchedData").getData();
 			var obj = {};
 			for (var i = 0, len = Color.length; i < len; i++)
 				obj[Color[i]['zzextcol']] = Color[i];
 			Color = new Array();
 			for (var key in obj)
 				Color.push(obj[key]);
 			var Model = new sap.ui.model.json.JSONModel(Color);
 			// Model.setSizeLimit(1000);
 			var selctedColor = this.getView().byId("VLRColor1").getSelectedKey();
 			this.getView().byId("VLRColor1").setModel(Model);
 			// if (Color.length != 0) {
 			if (this.getView().byId("VLRColor1").getItems().filter(function (x) {
 					return x.mProperties.key == "all"
 				}).length == 0) {

 				if (this.sCurrentLocale == 'EN') {
 					var newItem = new sap.ui.core.Item({
 						key: "all",
 						text: "ALL"
 					});

 				} else {
 					var newItem = new sap.ui.core.Item({
 						key: "all",
 						text: "TOUS"
 					});

 				}

 				var SelctKey = Color.filter(function (x) {
 					return x.zzextcol == selctedColor;
 				});
 				this.getView().byId("VLRColor1").insertItem(newItem);

 				/*this.getView().byId("VLRColor").setSelectedKey("all");
 				this.getView().byId("VLRColor").setSelectedItem("ALL");*/
 				if (selctedColor == "" || SelctKey.length == 0) {

 					if (this.sCurrentLocale == "EN") {
 						this.getView().byId("VLRDealer1").setSelectedItem("ALL");
 					} else {
 						this.getView().byId("VLRDealer1").setSelectedItem("TOUS");
 					}

 					this.getView().byId("VLRColor1").setSelectedKey("all");
 				} else {
 					this.getView().byId("VLRColor1").setSelectedKey(selctedColor);
 				}
 			}

 			this.onStatusChange();

 		},
 		removeDuplicates: function (originalArray, prop) {
 			var newArray = [];
 			var lookupObject = {};

 			for (var i in originalArray) {
 				lookupObject[originalArray[i][prop]] = originalArray[i];
 			}

 			for (i in lookupObject) {
 				newArray.push(lookupObject[i]);
 			}
 			return newArray;
 		},
 		onDescending: function () {

 		},

 		handleoVt_SeriesChange: function () {
 			//

 			var that = this;
 			sap.ui.core.BusyIndicator.show();
 			var oDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;
 			var Series = this.getView().byId("oVt_SeriesCmbo").getSelectedKey();
 			var status = this.getView().byId("VLRStatus1").getSelectedKey();
 			// var dnc = this.getView().byId("VLRStatus1").getSelectedKey();

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

 			// var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=zzseries eq'" + Series + "'and kunnr eq '" + oDealer +
 			// 	"'&$format=json"

 			//1704 requesting dealer is introduced. 		 
 			// var userAttributesModellen =  sap.ui.getCore().getModel("LoginuserAttributesModel").getData();
 			// var oDealer1 = userAttributesModellen[0].DealerCode;
 			// if (oDealer1 == undefined){
 			// 	oDealer1 = "";
 			// }
			var oDealer1, oDropDownSelectedDealer,requestDealerToSAP;
 			var oReceivedData = sap.ui.getCore().SelectedTrade;
 			if (oReceivedData !== undefined) {
 				requestDealerToSAP = oReceivedData.kunnr;
 				oDealer1 = requestDealerToSAP;

 			} else {
 				// may be from block summary. 
 				// var oDropDownSelectedDealer = sap.ui.getCore().dropDownSelectionData;
 			
 				if(sap.ui.getCore().getModel("dropDownSelectionData"))
 				{
 				 oDropDownSelectedDealer = sap.ui.getCore().getModel("dropDownSelectionData").getData();
 				
 				}
 				if (oDropDownSelectedDealer !== undefined) {
 					requestDealerToSAP = oDropDownSelectedDealer.dropDownSelectedBP;
 					oDealer1 = requestDealerToSAP;
 				}
 			}
 			if (oDealer1 !== undefined) {
 				if (oDealer1.length == 10) {

 					oDealer1 = oDealer1.slice(-5);

 				} else {
 					oDealer1 = "";
 				}
 			} else {
 				oDealer1 = "";
 			}

 			// var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate('" + oDealer1 + "')/Set?$filter=zzseries eq'" + Series +
 			// 	"'and kunnr eq '" + oDealer +
 			// 	"'and zzmoyr eq '" + that.oSelectedYear +
 			// 	"'&$format=json";
 			// "'and zz_trading_ind eq '"+status+"'and dnc_ind eq 'N"+
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
 			// var a = a.filter(function (x) {
 			// 						return (x.zz_trading_ind == status);

 			// 					});
 			// 					/*var filtered_ODealer = a.filter(function (x) {
 			// 							return (x.kunnr==oDealer);
 			// 						});*/
 			// 					//	var Dealer = sap.ui.getCore().LoginDetails.DealerCode;
 			// 					var userAttributesModellen = sap.ui.getCore().getModel("LoginuserAttributesModel").getData();
 			// 					/*	var Dealer=userAttributesModellen[0].DealerCode[0];***/
 			// 					var Dealer = userAttributesModellen[0].DealerCode;
 			// 					var FilterDelearNotnull = a.filter(function (x) {
 			// 						return x.kunnr != null;
 			// 					});

 			// 					/*	var FilterDeleade_OrderTypefiltered_zone=FilterDeleade_OrderTypefilteNotnull.filter(function(x){return x.kunnr.slice(-5)==Dealer &&(x.zzordertype=="DM" ||x.zzordertype=="SO")});*/

 			// 					//	var FilterDeleade_OrderTypefiltered_zone
 			// 					var filtered_ODealer = FilterDelearNotnull.filter(function (x) {
 			// 						//return x.kunnr.slice(-5) == Dealer;  
 			// 						return x.kunnr.slice(-5) == Dealer;

 			// 					});

 			// 					var ExcludeOrdType = [
 			// 						"RS",
 			// 						"F1",
 			// 						"F2",
 			// 						"F3",
 			// 						"F4",
 			// 						"F5"
 			// 					];

 			// 					var oExcludeOrdrtype = [];
 			// 					for (var i = filtered_ODealer.length - 1; i >= 0; --i) {
 			// 						if (ExcludeOrdType.indexOf((filtered_ODealer[i].zzordertype)) == -1) {
 			// 							oExcludeOrdrtype.push(filtered_ODealer[i]);
 			// 						}
 			// 					}

 			// 					//        var oJsonModel = new sap.ui.model.json.JSONModel(oExcludeOrdrtype);
 			// 					var IncludeOrdertype = oExcludeOrdrtype.filter(function (x) {
 			// 						return (x.zzordertype == "SO" || x.zzordertype == "DM");
 			// 					});
 			// 					var oJsonModel = new sap.ui.model.json.JSONModel(IncludeOrdertype);

 			// 					oJsonModel.setSizeLimit(1500);
 			// 					sap.ui.getCore().setModel(oJsonModel, "oVehicleSelectionResults");
 			// 					that.SeriesFilteredBinding();
 			// 					/*  sap.ui.core.BusyIndicator.hide();*/
 			// 					sap.ui.core.BusyIndicator.hide();
 			// 				},
 			// 				error: function () {
 			// 					that.SeriesFilteredBindingNodata();
 			// 					sap.ui.core.BusyIndicator.hide();
 			// 					/*	 sap.ui.core.BusyIndicator.hide();*/
 			// 				}
 			// 			});
 			this.getView().byId("VLRStatus1").setEnabled(true);
 			this.getView().byId("AcceInstalledCobmo1").setEnabled(true);
 			this.getView().byId("chknew1").setEnabled(true);
 			that.getView().byId("chkexi").setEnabled(true);
 			this.getView().byId("VLRSuffix1").setSelectedKey("all");
 			this.getView().byId("VLRSuffix1").setEnabled(false);
 			this.getView().byId("VLRColor1").setEnabled(false);
 			this.getView().byId("McCmbo").setEnabled(true);

 			that.oCatUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
 			var ModelCode = that.oCatUrl + "/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + that.oSelectedYear +
 				"' and TCISeries eq '" + Series + "'and visibility eq 'X'";
 			var ajax1 = $.ajax({
 				dataType: "json",
 				xhrFields: //
 				{
 					withCredentials: true
 				},

 				// beforeSend: function (request) {
 				// 	request.setRequestHeader('Authorization', 'Basic ' + btoa('anisetc:anisetc'));
 				// },
 				url: ModelCode,
 				async: true,
 				success: function (result) {
 					var oResults = result.d.results;
 					// var oResults = oResults.filter(function (x) {
 					// 	return (x.TCISeries == Series&&(x.Modelyear==that.oSelectedYear||x.Modelyear==that.oSelectedYear-2||x.Modelyear==that.oSelectedYear-1||x.Modelyear==that.oSelectedYear+1));

 					// });
 					var obj = {};
 					for (var i = 0, len = oResults.length; i < len; i++)
 						obj[oResults[i]['Model']] = oResults[i];
 					oResults = new Array();
 					for (var key in obj)
 						oResults.push(obj[key]);

 					// var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language;  //2603
 					var SPRAS = that.sCurrentLocaleD;

 					for (var i = 0; i < oResults.length; i++) {
 						oResults[i].SPRAS = SPRAS;
 					}
 					var ModelCode = new sap.ui.model.json.JSONModel(oResults);
 					that.getView().byId("McCmbo").setModel(ModelCode);
 					if (that.getView().byId("McCmbo").getItems().filter(function (x) {
 							return x.mProperties.key == "all"
 						}).length == 0) {

 						if (that.sCurrentLocale == 'EN') {
 							var newItem = new sap.ui.core.Item({
 								key: "all",
 								text: "ALL"
 							});
 							that.getView().byId("McCmbo").insertItem(newItem);
 						} else {

 							var newItem = new sap.ui.core.Item({
 								key: "all",
 								text: "TOUS"
 							});
 							that.getView().byId("McCmbo").insertItem(newItem);

 						}

 					}
 					// that.MCClickedVLS11();
 					sap.ui.core.BusyIndicator.hide();
 				},
 				error: function () {
 					sap.ui.core.BusyIndicator.hide();
 				}
 			});
 			that.onStatusChange();
 		},

 		MCClickedVLS11: function () {
 			var that = this;
 			that.oJsonModelVLS = new sap.ui.model.json.JSONModel([]);
 			that.getView().setModel(that.oJsonModelVLS, "Suffix");
 			sap.ui.core.BusyIndicator.show();
 			var sLocation = window.location.host;
 			var sLocation_conf = sLocation.search("webide");

 			if (sLocation_conf == 0) {
 				this.sPrefix = "/vehicleLocatorNode";
 			} else {
 				this.sPrefix = "";

 			}
 			var Model = that.getView().byId("McCmbo").getSelectedKey();
 			var Model_Year = that.oSelectedYear;
 			this.nodeJsUrl = this.sPrefix + "/node";

 			// that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
 			// var Suffix = that.oDataUrl + "/zc_configuration?$filter=Model eq '" + Model +
 			// 	"'and ModelYear eq '" + Model_Year + "'";

 			// new suffixes. 23rd May 

 			that.oDataUrl = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";
 			that.oVehicleURL = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
 			// var Status = this.getView().byId("VLRStatus1").getSelectedKey();
 			// if (Status == "1") {
 			// 	// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"})

 			// 	var suffix = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 			// 		return x.zz_trading_ind == "1"
 			// 	});
 			// } else {
 			// 	// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")})
 			// 	var suffix = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 			// 		return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3")
 			// 	});
 			// }
 			//	var Color = sap.ui.getCore().getModel("SearchedData").getData();
 			// var obj = {};
 			// for (var i = 0, len = suffix.length; i < len; i++)
 			// 	obj[suffix[i]['zzsuffix']] = suffix[i];
 			// suffix = new Array();
 			// for (var key in obj)
 			// 	suffix.push(obj[key]);
 			// var suffixModel = new sap.ui.model.json.JSONModel(suffix);
 			// Model.setSizeLimit(1000);
 			// var selctedsuffix = this.getView().byId("VLRSuffix1").getSelectedKey();
 			// this.getView().byId("VLRSuffix1").setModel(suffixModel);
 			// if (Color.length != 0) {
 			// if (this.getView().byId("VLRSuffix1").getItems().filter(function (x) {
 			// 		return x.mProperties.key == "all"
 			// 	}).length == 0) {

 			// 	if (this.sCurrentLocale == 'EN') {
 			// 		var newItem = new sap.ui.core.Item({
 			// 			key: "all",
 			// 			text: "ALL"
 			// 		});

 			// 	} else {
 			// 		var newItem = new sap.ui.core.Item({
 			// 			key: "all",
 			// 			text: "TOUS"
 			// 		});

 			// 	}

 			// 	var SelctKey = suffix.filter(function (x) {
 			// 		return x.zzsuffix == selctedsuffix;
 			// 	});
 			// 	this.getView().byId("VLRSuffix1").insertItem(newItem);

 			// 	/*this.getView().byId("VLRColor").setSelectedKey("all");
 			// 	this.getView().byId("VLRColor").setSelectedItem("ALL");*/
 			// 	if (selctedsuffix == "" || SelctKey.length == 0) {

 			// 		this.getView().byId("VLRSuffix1").setSelectedKey("all");
 			// 	} else {
 			// 		this.getView().byId("VLRSuffix1").setSelectedKey(selctedsuffix);
 			// 	}
 			// }

 			var SuffixURL = that.oDataUrl + "/ZC_suffix_VL?$filter=ModelYear eq '" + that.oSelectedYear +
 				"' and Model eq '" + Model + "'and visibility eq 'X'";

 			var ajax3 = $.ajax({
 				dataType: "json",
 				xhrFields: //
 				{
 					withCredentials: true
 				},
 				url: SuffixURL,
 				async: true,
 				success: function (result) {
 					var Suffix = result.d.results;
 					var SuffixData = [];
 					if (Suffix.length != 0) {
 						for (var i = 0; i < Suffix.length; i++) {
 							var obj = {};
 							obj.zzsuffix = Suffix[i].Suffix;
 							obj.suffix_desc_en = Suffix[i].SuffixDescriptionEN;
 							obj.suffix_desc_fr = Suffix[i].SuffixDescriptionFR;
 							// obj.mrktg_int_desc_en = Suffix[i].mrktg_int_desc_en;
 							// obj.mrktg_int_desc_fr = Suffix[i].mrktg_int_desc_fr;
 							// obj.int_c = Suffix[i].int_c;
 							// obj.SPRAS = Suffix[i].SPRAS;
 							SuffixData.push(obj);
 						}
 						// var suffixDataNoDuplicates = that.removeDuplicates(SuffixData, "zzsuffix");

 						// modelDataNoDuplicates = Array.from(new Set(modelData.map(JSON.stringify))).map(JSON.parse);

 						var suffixModel = new sap.ui.model.json.JSONModel(SuffixData);
 						// var Model = new sap.ui.model.json.JSONModel(suffixModel);
 						// that.getView().byId("VLRSuffix1").setModel(suffixModel);
 						if (that.getView().byId("VLRSuffix1").getItems().filter(function (x) {
 								return x.mProperties.key == "all"
 							}).length == 0) {

 							if (that.sCurrentLocale == 'EN') {
 								var newItem = new sap.ui.core.Item({
 									key: "all",
 									text: "ALL"
 								});
 								that.getView().byId("VLRSuffix1").insertItem(newItem);
 							} else {

 								var newItem = new sap.ui.core.Item({
 									key: "all",
 									text: "TOUS"
 								});
 								that.getView().byId("VLRSuffix1").insertItem(newItem);

 							}

 						}
 						var SuffixModel = new sap.ui.model.json.JSONModel(Suffix);
 						sap.ui.getCore().setModel(SuffixModel, "suffixModel");
 						that.getView().byId("VLRStatus1").setEnabled(true);
 						that.getView().byId("AcceInstalledCobmo1").setEnabled(true);
 						that.getView().byId("VLRSuffix1").setEnabled(true);
 						that.getView().byId("VLRColor1").setEnabled(false);
 						that.SuffixDescription();
 					} else {
 						if (that.getView().byId("VLRSuffix1").getItems().filter(function (x) {
 								return x.mProperties.key == "all"
 							}).length == 0) {

 							if (that.sCurrentLocale == 'EN') {
 								var newItem = new sap.ui.core.Item({
 									key: "all",
 									text: "ALL"
 								});
 								that.getView().byId("VLRSuffix1").insertItem(newItem);
 							} else {

 								var newItem = new sap.ui.core.Item({
 									key: "all",
 									text: "TOUS"
 								});
 								that.getView().byId("VLRSuffix1").insertItem(newItem);

 							}

 						}
 						that.getView().byId("VLRStatus1").setEnabled(true);
 						that.getView().byId("AcceInstalledCobmo1").setEnabled(true);
 						that.getView().byId("VLRSuffix1").setEnabled(false);
 						that.getView().byId("VLRColor1").setEnabled(false);
 						that.getView().byId("VLRSuffix1").setSelectedKey("all");
 					}
 					sap.ui.core.BusyIndicator.hide();

 				},
 				error: function () {
 					sap.ui.core.BusyIndicator.hide();
 					that.getView().byId("VLRStatus1").setEnabled(true);
 					that.getView().byId("AcceInstalledCobmo1").setEnabled(true);
 					that.getView().byId("VLRSuffix1").setEnabled(false);
 					that.getView().byId("VLRColor1").setEnabled(false);
 					that.getView().byId("VLRSuffix1").setSelectedKey("all");
 				}
 			});
 			that.onStatusChange();
 			// var Series = this.getView().byId("oVt_SeriesCmbo").getSelectedKey();
 			// var SeriesUrl = that.oVehicleURL + "/ZVMS_INT_Color?$filter=tci_series  eq '" + Series + "'";
 			// var ajax1 = $.ajax({
 			// 	dataType: "json",
 			// 	xhrFields: //
 			// 	{
 			// 		withCredentials: true
 			// 	},
 			// 	url: SeriesUrl,
 			// 	async: true,
 			// 	success: function (result) {
 			// 			var Color = result.d.results;
 			// 		var ColorData=[];
 			// 	for (var i = 0; i < Color.length; i++) {
 			// 		var obj = {};
 			// 		obj.zzextcol = Color[i].int_desc_en;

 			// 		obj.mktg_desc_en = Color[i].mrktg_int_desc_en;
 			// 		obj.mktg_desc_fr = Color[i].mrktg_int_desc_fr;

 			// 		ColorData.push(obj);
 			// 	}
 			// // var colorModel = new sap.ui.model.json.JSONModel(Color);
 			// // Model.setSizeLimit(1000);
 			// var colorModel = new sap.ui.model.json.JSONModel(ColorData);
 			// that.getView().byId("VLRColor1").setModel(colorModel);
 			// // if (Color.length != 0) {
 			// if (that.getView().byId("VLRColor1").getItems().filter(function (x) {
 			// 		return x.mProperties.key == "all"
 			// 	}).length == 0) {

 			// 	if (that.sCurrentLocale == 'EN') {
 			// 		var newItem = new sap.ui.core.Item({
 			// 			key: "all",
 			// 			text: "ALL"
 			// 		});

 			// 	} else {
 			// 		var newItem = new sap.ui.core.Item({
 			// 			key: "all",
 			// 			text: "TOUS"
 			// 		});

 			// 	}

 			// 	that.getView().byId("VLRColor1").insertItem(newItem);
 			// 	}

 			// sap.ui.core.BusyIndicator.hide();
 			// 					// var SuffixModel = new sap.ui.model.json.JSONModel(Suffix);
 			// 					// sap.ui.getCore().setModel(SuffixModel, "VehicleLocatorSuffix");
 			// 					// that.SuffixDescription();
 			// 				},
 			// 				error: function () {
 			// 					sap.ui.core.BusyIndicator.hide();
 			// 				}
 			// 			});

 		},
 		SuffixDescription: function () {
 			var that = this;

 			/*if (sap.ui.getCore().getModel("SuffixInteriorDesc") != undefined) {
 				that.SuffixDesc = sap.ui.getCore().getModel("SuffixInteriorDesc").getData();

 			} else {
 				that.SuffixDesc = [];
 			}*/
 			var sLocation = window.location.host;
 			var sLocation_conf = sLocation.search("webide");

 			if (sLocation_conf == 0) {
 				this.sPrefix = "/vehicleLocatorNode";
 			} else {
 				this.sPrefix = "";

 			}

 			var Model_Year = that.oSelectedYear;
 			var Series = this.getView().byId("oVt_SeriesCmbo").getSelectedKey();
 			var McCmbo = this.getView().byId("McCmbo").getSelectedKey();
 			this.nodeJsUrl = this.sPrefix + "/node";
 			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";

 			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
 			/*	var SeriesUrl = that.oDataUrl + "/zc_exterior_trim?$filter=ModelYear eq'"+Model_Year+"' and Model eq'"+McCmbo+"' and TCISeries eq '"+Series+"' &$format=json";*/

 			var SeriesUrl = that.oDataUrl + "/ZVMS_INT_Color?$filter=model_year eq '" + that.oSelectedYear +
 				"' and tci_series  eq '" + Series + "'";
 			var ajax1 = $.ajax({
 				dataType: "json",
 				xhrFields: //
 				{
 					withCredentials: true
 				},
 				url: SeriesUrl,
 				async: true,
 				success: function (result) {
 					var SuffixDescription = result.d.results;
 					that.SeriesFilterdData(SuffixDescription);
 				},
 				error: function () {
 					sap.ui.core.BusyIndicator.hide();
 				}
 			});
 			/*if(that.SuffixDesc==undefined){
 				that.SuffixDesc=[];
 			}*/

 		},
 		SeriesFilterdData: function (SuffixDescription) {
 			var that = this;

 			that.FilteredSuffixDesc = SuffixDescription;

 			that.oSelectedYear = that.oSelectedYear;

 			that.oSelectedModel = that.getView().byId("McCmbo").getSelectedKey();

 			if (that.oSelectedModel != "" && sap.ui.getCore().getModel("suffixModel") != undefined) {

 				var oResults = sap.ui.getCore().getModel("suffixModel").getData();
 				var oResults = oResults.filter(function (x) {
 					return (x.Model == (that.oSelectedModel.split("-")[0]).trim());

 				});
 				that.Fullurls = oResults;

 				var SufixDescription = SuffixDescription;
 				// var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language;  //2603
 				var SPRAS = that.sCurrentLocaleD;
 				var oCombine = [];

 				for (var a = 0; a < that.Fullurls.length; a++) {
 					for (var b = 0; b < SufixDescription.length; b++) {

 						if (that.Fullurls[a].int_trim.substr(2) == SuffixDescription[b].int_c) {
 							oCombine.push({

 								"zzsuffix": that.Fullurls[a].Suffix,
 								"suffix_desc_en": that.Fullurls[a].SuffixDescriptionEN,
 								"suffix_desc_fr": that.Fullurls[a].SuffixDescriptionFR,
 								/* "MarktgIntDescEN": SufixDescription[b].int_desc_en,*/
 								"mrktg_int_desc_en": SufixDescription[b].mrktg_int_desc_en,
 								"mrktg_int_desc_fr": SufixDescription[b].mrktg_int_desc_fr,

 								"SPRAS": SPRAS,
 								"int_c": SufixDescription[b].int_c
 									/*"compareField":_that.temp[n].Suffix+_that.temp1[m].int_desc_en*/
 							});
 						}
 						/*	if (that.Fullurls[a].Suffix == SufixDescription[b].Suffix) {
							SufixDescription[b].SuffixDescriptionEN = that.Fullurls[a].SuffixDescriptionEN;
							SufixDescription[b].SuffixDescriptionFR = that.Fullurls[a].SuffixDescriptionFR;
                            SufixDescription[b].SPRAS =SPRAS;
						}*/
 					}

 				}

 				// need to add ALL
 				// var allText = that._oResourceBundle.getText("ALL");

 				//      oCombine.push({
 				// 	Suffix: allText,
 				// 		"SuffixDescriptionEN": allText,
 				// 	"SuffixDescriptionFR": allText,
 				// 	// SuffixDescriptionEN: "",
 				// 	// SuffixDescriptionFR:""
 				// 	//	sEtaToData: item.zzprod_month
 				// });
 				var modelDataNoDuplicates = that.removeDuplicates(oCombine, "zzsuffix");
 				var Suffix = new sap.ui.model.json.JSONModel(modelDataNoDuplicates);
 				// that.getView().setModel(Suffix, "Suffix");
 				// sap.ui.getCore().setModel(Suffix, "VehicleLocatorSuffix");
 				this.getView().byId("VLRSuffix1").setModel(Suffix);
 				sap.ui.core.BusyIndicator.hide();
 				/*	var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
 					that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);*/

 				if (oCombine.length != 0) {
 					if (this.sCurrentLocale == 'EN') {
 						var allText = 'ALL';

 					} else {
 						var allText = 'TOUS';

 					}

 					// var allText = that._oResourceBundle.getText("ALL");
 					// if (this.getView().byId("VLRSuffix").getItems().filter(function (x) {
 					// 		return x.mProperties.key == "all"
 					// 	}).length == 0) {
 					var newItem = new sap.ui.core.Item({
 						key: "all",
 						text: allText
 					});

 					this.getView().byId("VLRSuffix1").insertItem(newItem);
 					this.getView().byId("VLRSuffix1").setSelectedKey("all");

 				}

 			} else {
 				sap.ui.core.BusyIndicator.hide();
 			}

 		},

 		SeriesFilteredBinding: function () {
 			if (sap.ui.getCore().getModel("oVehicleSelectionResults") != undefined) {
 				var oVehicleModel = sap.ui.getCore().getModel("oVehicleSelectionResults");

 				// set the model	
 				var model = new sap.ui.model.json.JSONModel(oVehicleModel).getData();
 				//    var model = oVehicleModel.getData();
 				model.setSizeLimit(10000);

 				// based on the language set the descriptions. 
 				//     if (this.sCurrentLocaleD == "French") {
 				// for (var i=0; i<model.oData.length; i++ ){
 				// 	model.oData[i].mktg_desc_en = model.oData[i].mktg_desc_fr;
 				// 	model.oData[i].model_desc_en = model.oData[i].model_desc_fr;
 				// 	model.oData[i].zzseries_desc_en = model.oData[i].zzseries_desc_fr;
 				// 	model.oData[i].suffix_desc_en  = model.oData[i].suffix_desc_fr;
 				// 		model.oData[i].mrktg_int_desc_en  = model.oData[i].mrktg_int_desc_fr;
 				// }

 				//    }

 				this.getView().setModel(model, "vehicleSelectTableModel");

 				var oModeltemp = this.getView().setModel(model, "vehicleSelectTableModel");
 				oModeltemp.updateBindings(true);

 				var tableLength = this.getView().getModel("vehicleSelectTableModel").getData().length;
 				var oModelDetail = this.getView().getModel("detailView");

 				var sExpectedText = this.getView().getModel("i18n").getResourceBundle().getText("tableCount", [tableLength]);
 				oModelDetail.setProperty("/tableCount", sExpectedText);

 				// this.getView().byId("table").setModel(oVehicleModel);

 				// 	var oProductNameColumn = this.getView().byId("oETAFromId");
 				// this.getView().byId("table").sort(oProductNameColumn, SortOrder.Ascending);

 				//GUNA
 				//  put the DNC indicator to the screen. 
 				var oModelVehicleSelectTable = this.getView().getModel("vehicleSelectTableModel");
 				var oModelVehicleSelectTableData = this.getView().getModel("vehicleSelectTableModel").getData();

 				for (var i = 0; i < oModelVehicleSelectTableData.length; i++) {
 					if (oModelVehicleSelectTableData[i].dnc_ind == "Y") {
 						oModelVehicleSelectTableData[i].zzordertype = "DNC";
 					}
 				}
 				var Status = this.getView().byId("VLRStatus1").getSelectedKey();
 				if (Status == "1") {

 					this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 						return x.zz_trading_ind == "1";
 					});
 					//		var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"})
 				} else {
 					this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 						return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3");
 					});
 					// var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")})
 				}
 				oModelVehicleSelectTable.updateBindings(true);

 			}
 		},
 		SeriesFilteredBindingNodata: function () {
 			var oVehicleModel = new sap.ui.model.json.JSONModel([]);
 			this.getView().byId("vehicleSelectTable").setModel(oVehicleModel);

 			// var oProductNameColumn = this.getView().byId("oETAFromId");
 			// this.getView().byId("vehicleSelectTable").sort(oProductNameColumn, SortOrder.Ascending);
 		},

 		oTradeLinkPress: function (oEvt) {
 			var that = this;
 			// that.oSelectedItem = oEvt.getSource().getBindingContext().getObject();

 			that.oSelectedItem = oEvt.getSource().getBindingContext("vehicleSelectTableModel").getObject();
 			that.oSelectedItem.FromFourth = "FromFourth";
 			var VTN = that.oSelectedItem.zzvtn;

 			//  the offered vehicle should send the dealer code of login dealer. 	 23rd MAy. 
 			// var dealercode = that.oSelectedItem.kunnr.slice(-5);
 			var oReceivedData = sap.ui.getCore().SelectedTrade;

 			if (oReceivedData != undefined) {
 				var dealercode = oReceivedData.kunnr.slice(-5);
 			} else { // when navigating from model block screen, pick a different one. 
 				var dealercode = this.oSelectedItem.kunnr.slice(-5);

 			}

 			var sLocation = window.location.host;
 			var sLocation_conf = sLocation.search("webide");

 			if (sLocation_conf == 0) {
 				this.sPrefix = "/vehicleLocatorNode";
 			} else {
 				this.sPrefix = "";

 			}

 			this.nodeJsUrl = this.sPrefix + "/node";
 			that.oDataUrl = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";
 			var SeriesUrl = that.oDataUrl + "/CalculateETASet?$filter=VTN eq '" + VTN + "' and DelearCode eq '" + dealercode +
 				"'&$format=json";
 			var ajax = $.ajax({
 				dataType: "json",
 				xhrFields: //
 				{
 					withCredentials: true
 				},
 				url: SeriesUrl,
 				async: true,
 				success: function (result) {
 					//
 					var Data = result.d.results[0];
 					/*	Data.MessageType="";
 						Data.Calculate="20181126";*/
 					if (Data.MessageType != "E") {
 						var CurrentETAFrom = that.oSelectedItem.zzadddata4;
 						if (CurrentETAFrom != null && CurrentETAFrom != "") {

 							CurrentETAFrom = CurrentETAFrom.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1');
 						}
 						var CurrentETATo = that.oSelectedItem.pstsp;

 						if (CurrentETATo != null && CurrentETATo != "") {
 							var dateTo = CurrentETATo.split("(")[1];
 							if (CurrentETATo.indexOf("+") != -1) {
 								/*dateTo = dateTo.split("+")[0];*/
 								CurrentETATo = new Date(CurrentETATo.split("(")[1].substring(0, 10) * 1000).toDateString().substring(4, 15);
 								var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
 									pattern: "MM/dd/yyyy"
 								});
 								CurrentETATo = oDateFormat.format(new Date(CurrentETATo));

 							} else {
 								dateTo = dateTo;
 								var dataTo1 = dateTo.substring(0, dateTo.length - 5);
 								var ValidTo = new Date(dataTo1 * 1000);
 								ValidTo = ValidTo.toGMTString().substring(4, 16);
 								var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
 									pattern: "MM/dd/yyyy"
 								});
 								CurrentETATo = oDateFormat.format(new Date(ValidTo));
 							}

 						}

 						if ((CurrentETAFrom == "" || CurrentETAFrom == null) && (CurrentETATo != "" && CurrentETATo != null)) {
 							CurrentETAFrom = CurrentETATo;
 						} else if ((CurrentETAFrom != "" && CurrentETAFrom != null) && (CurrentETATo == "" || CurrentETATo == null)) {
 							CurrentETATo = CurrentETAFrom;
 						} else if ((CurrentETAFrom == "" || CurrentETAFrom == null) && (CurrentETATo == "" || CurrentETATo == null)) {
 							/*CurrentETATo=Data.Calculate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1')
 							CurrentETAFrom=Data.Calculate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1')*/
 						}

 						var date1 = new Date(CurrentETAFrom);
 						var date2 = new Date(CurrentETATo);
 						var timeDiff = Math.abs(date2.getTime() - date1.getTime());
 						var CurrentEtadiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

 						function addDays(date, days) {
 							var result = new Date(date);
 							result.setDate(result.getDate() + days);
 							return result;
 						}
 						var Eta = Data.Calculate;
 						var Calculate = Eta.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1');

 						var Proposed_ETA_To = addDays(Calculate, CurrentEtadiff);
 						if (Proposed_ETA_To != "Invalid Date") {
 							that.oSelectedItem.Proposed_ETA_To = Proposed_ETA_To;
 						} else {
 							that.oSelectedItem.Proposed_ETA_To = "";
 						}
 						that.oSelectedItem.Proposed_ETA_From = Data.Calculate;
 						that.oSelectedItem.FromFourth = "FromFourth";
 						//that.selectedTrade=escape(JSON.stringify(that.selectedTrade));
 						if (that.SelectedVehicleFrom == "VehileTrade_CreateSingle") {
 							sap.ui.getCore().getModel("TradeModel").setProperty("/VehicleTradeVehicle", that.oSelectedItem);
 							//	var oSelectedStrItems = JSON.stringify(oSelectedItem);
 							that.getRouter().navTo("VehicleTrade_CreateSingle", {
 								SelectedTrade: "VehicleTradeVehicle"
 							});
 						} else if (that.SelectedVehicleFrom == "VehileTrade_UpdtTradReq") {
 							//.getProperty("/OffredVehicle")
 							that.oSelectedItem.Offered_Vtn = that.oSelectedItem.zzvtn;
 							that.oSelectedItem.Model_Year = that.oSelectedItem.zzmoyr;
 							that.oSelectedItem.Series_Desc = that.oSelectedItem.zzseries_desc_en;
 							that.oSelectedItem.zzseries_desc_fr = that.oSelectedItem.zzseries_desc_fr;
 							that.oSelectedItem.zzseries_desc_en = that.oSelectedItem.zzseries_desc_en;
 							that.oSelectedItem.Series = that.oSelectedItem.zzseries;
 							that.oSelectedItem.Model = that.oSelectedItem.matnr;
 							that.oSelectedItem.Model_Desc = that.oSelectedItem.model_desc_en;
 							that.oSelectedItem.Suffix = that.oSelectedItem.zzsuffix;
 							that.oSelectedItem.Suffix_Desc = that.oSelectedItem.suffix_desc_en;
 							that.oSelectedItem.Int_Colour_Desc = that.oSelectedItem.mrktg_int_desc_en;
 							that.oSelectedItem.APX = that.oSelectedItem.zzapx;
 							that.oSelectedItem.Ext_Colour = that.oSelectedItem.zzextcol;
 							that.oSelectedItem.Ext_Colour_Desc = that.oSelectedItem.mktg_desc_en;
 							that.oSelectedItem.Status = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Status;
 							that.oSelectedItem.Order_Type = that.oSelectedItem.zzordertype;
 							//	var Req_Current_ETA_From=Number(that.oSelectedItem.pstsp);
 							/*	that.oSelectedItem.Req_Current_ETA_From = that.oSelectedItem.pstsp;*/
 							that.oSelectedItem.Off_Current_ETA_To = that.oSelectedItem.pstsp;

 							var dateString = that.oSelectedItem.zzadddata4;
 							if (dateString != "" && dateString != undefined && dateString != null) {

 								var year = dateString.substring(0, 4);
 								var month = dateString.substring(4, 6);
 								var day = dateString.substring(6, 8);

 								var Off_Current_ETA_From = new Date(year, month - 1, day);
 								Off_Current_ETA_From = new Date(Off_Current_ETA_From);
 								Off_Current_ETA_From = Date.parse(Off_Current_ETA_From);

 								that.oSelectedItem.Off_Current_ETA_From = "/Date(" + Off_Current_ETA_From + ")/";
 							} else {
 								that.oSelectedItem.Off_Current_ETA_From = "/Date(0)/";
 							}

 							//	var Proposed_ETA_From=Number(that.oSelectedItem.Proposed_ETA_From);
 							var dateString = that.oSelectedItem.Proposed_ETA_From;
 							if (dateString != "" && dateString != undefined && dateString != null) {
 								var year = dateString.substring(0, 4);
 								var month = dateString.substring(4, 6);
 								var day = dateString.substring(6, 8);

 								var Proposed_ETA_From = new Date(year, month - 1, day);
 								Proposed_ETA_From = new Date(Proposed_ETA_From);
 								Proposed_ETA_From = Date.parse(Proposed_ETA_From);

 								that.oSelectedItem.Off_Proposed_ETA_From = "/Date(" + Proposed_ETA_From + ")/";

 							} else {
 								that.oSelectedItem.Off_Proposed_ETA_From = "/Date(0)/";
 							}

 							var Req_Proposed_ETA_To = Number(that.oSelectedItem.Proposed_ETA_To);
 							Req_Proposed_ETA_To = new Date(Req_Proposed_ETA_To);
 							Req_Proposed_ETA_To = Date.parse(Req_Proposed_ETA_To);

 							that.oSelectedItem.Off_Proposed_ETA_To = "/Date(" + Req_Proposed_ETA_To + ")/";

 							sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").setProperty("/OffredVehicle", that.oSelectedItem);
 							that.getRouter().navTo("VehicleTrade_UpdtTradReq", {
 								SelectedTrade: "VehicleTrade_updateTradeVehicle"
 							});

 						} else if (that.SelectedVehicleFrom == "VehicleTrade_ModelBlock_Summary") {
 							//	var Selobj=escape(JSON.stringify(oSelectedItem));
 							var model = new sap.ui.model.json.JSONModel(that.oSelectedItem);
 							sap.ui.getCore().setModel(model, "VehicleTrade_ModelBlock_SummaryTrade");
 							that.getRouter().navTo("VehicleTrade_ModelBlock_Summary", {
 								SelectedTrade: "VehicleTradeVehicle"
 							});

 						}

 					} else {
 						if (that.SelectedVehicleFrom == "VehileTrade_CreateSingle") {
 							sap.ui.getCore().getModel("TradeModel").setProperty("/VehicleTradeVehicle", that.oSelectedItem);
 							//	var oSelectedStrItems = JSON.stringify(oSelectedItem);
 							that.getRouter().navTo("VehicleTrade_CreateSingle", {
 								SelectedTrade: "VehicleTradeVehicle"
 							});
 						} else if (that.SelectedVehicleFrom == "VehileTrade_UpdtTradReq") {
 							that.oSelectedItem.Offered_Vtn = that.oSelectedItem.zzvtn;
 							that.oSelectedItem.Model_Year = that.oSelectedItem.zzmoyr;
 							that.oSelectedItem.Series_Desc = that.oSelectedItem.zzseries_desc_en;
 							that.oSelectedItem.zzseries_desc_fr = that.oSelectedItem.zzseries_desc_fr;
 							that.oSelectedItem.zzseries_desc_en = that.oSelectedItem.zzseries_desc_en;
 							that.oSelectedItem.Series = that.oSelectedItem.zzseries;
 							that.oSelectedItem.Model = that.oSelectedItem.matnr;
 							that.oSelectedItem.Model_Desc = that.oSelectedItem.model_desc_en;
 							that.oSelectedItem.Suffix = that.oSelectedItem.zzsuffix;
 							that.oSelectedItem.Suffix_Desc = that.oSelectedItem.suffix_desc_en;
 							that.oSelectedItem.Int_Colour_Desc = that.oSelectedItem.mrktg_int_desc_en;
 							that.oSelectedItem.APX = that.oSelectedItem.zzapx;
 							that.oSelectedItem.Ext_Colour = that.oSelectedItem.zzextcol;
 							that.oSelectedItem.Ext_Colour_Desc = that.oSelectedItem.mktg_desc_en;
 							that.oSelectedItem.Status = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Status;
 							that.oSelectedItem.Order_Type = that.oSelectedItem.zzordertype;
 							//	var Req_Current_ETA_From=Number(that.oSelectedItem.pstsp);

 							/*	that.oSelectedItem.Req_Current_ETA_From = that.oSelectedItem.pstsp;*/
 							that.oSelectedItem.Off_Current_ETA_To = that.oSelectedItem.pstsp;

 							var dateString = that.oSelectedItem.zzadddata4;
 							if (dateString != "" && dateString != undefined && dateString != null) {

 								var year = dateString.substring(0, 4);
 								var month = dateString.substring(4, 6);
 								var day = dateString.substring(6, 8);

 								var Off_Current_ETA_From = new Date(year, month - 1, day);
 								Off_Current_ETA_From = new Date(Off_Current_ETA_From);
 								Off_Current_ETA_From = Date.parse(Off_Current_ETA_From);

 								that.oSelectedItem.Off_Current_ETA_From = "/Date(" + Off_Current_ETA_From + ")/";
 							} else {
 								that.oSelectedItem.Off_Current_ETA_From = "/Date(0)/";
 							}
 							//	var Proposed_ETA_From=Number(that.oSelectedItem.Proposed_ETA_From);
 							var dateString = "";
 							if (dateString != "" && dateString != undefined && dateString != null) {
 								var year = dateString.substring(0, 4);
 								var month = dateString.substring(4, 6);
 								var day = dateString.substring(6, 8);

 								var Proposed_ETA_From = new Date(year, month - 1, day);
 								Proposed_ETA_From = new Date(Proposed_ETA_From);
 								Proposed_ETA_From = Date.parse(Proposed_ETA_From);

 								that.oSelectedItem.Off_Proposed_ETA_From = "/Date(" + Proposed_ETA_From + ")/";
 							} else {
 								that.oSelectedItem.Off_Proposed_ETA_From = "/Date(0)/";
 							}
 							/*	var Req_Proposed_ETA_To = Number(that.oSelectedItem.Proposed_ETA_To);
 								Req_Proposed_ETA_To = new Date(Req_Proposed_ETA_To);
 								Req_Proposed_ETA_To = Date.parse(Req_Proposed_ETA_To);*/

 							that.oSelectedItem.Off_Proposed_ETA_To = "/Date(0)/";

 							sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").setProperty("/OffredVehicle", that.oSelectedItem);
 							that.getRouter().navTo("VehicleTrade_UpdtTradReq", {
 								SelectedTrade: "VehicleTrade_updateTradeVehicle"
 							});

 						} else if (that.SelectedVehicleFrom == "VehicleTrade_ModelBlock_Summary") {
 							//	var Selobj=escape(JSON.stringify(oSelectedItem));
 							var model = new sap.ui.model.json.JSONModel(that.oSelectedItem);
 							sap.ui.getCore().setModel(model, "VehicleTrade_ModelBlock_SummaryTrade");
 							that.getRouter().navTo("VehicleTrade_ModelBlock_Summary", {
 								SelectedTrade: "VehicleTradeVehicle"
 							});

 						}
 					}

 				},
 				error: function () {
 					var that = this;
 					if (that.SelectedVehicleFrom == "VehileTrade_CreateSingle") {
 						sap.ui.getCore().getModel("TradeModel").setProperty("/VehicleTradeVehicle", that.oSelectedItem);
 						//	var oSelectedStrItems = JSON.stringify(oSelectedItem);
 						that.getRouter().navTo("VehicleTrade_CreateSingle", {
 							SelectedTrade: "VehicleTradeVehicle"
 						});
 					} else if (that.SelectedVehicleFrom == "VehileTrade_UpdtTradReq") {
 						that.oSelectedItem.Offered_Vtn = that.oSelectedItem.zzvtn;
 						that.oSelectedItem.Model_Year = that.oSelectedItem.zzmoyr;
 						that.oSelectedItem.Series_Desc = that.oSelectedItem.zzseries_desc_en;
 						that.oSelectedItem.zzseries_desc_fr = that.oSelectedItem.zzseries_desc_fr;
 						that.oSelectedItem.zzseries_desc_en = that.oSelectedItem.zzseries_desc_en;
 						that.oSelectedItem.Series = that.oSelectedItem.zzseries;
 						that.oSelectedItem.Model = that.oSelectedItem.matnr;
 						that.oSelectedItem.Model_Desc = that.oSelectedItem.model_desc_en;
 						that.oSelectedItem.Suffix = that.oSelectedItem.zzsuffix;
 						that.oSelectedItem.Suffix_Desc = that.oSelectedItem.suffix_desc_en;
 						that.oSelectedItem.Int_Colour_Desc = that.oSelectedItem.mrktg_int_desc_en;
 						that.oSelectedItem.APX = that.oSelectedItem.zzapx;
 						that.oSelectedItem.Ext_Colour = that.oSelectedItem.zzextcol;
 						that.oSelectedItem.Ext_Colour_Desc = that.oSelectedItem.mktg_desc_en;
 						that.oSelectedItem.Status = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Status;
 						that.oSelectedItem.Order_Type = that.oSelectedItem.zzordertype;
 						//	var Req_Current_ETA_From=Number(that.oSelectedItem.pstsp);

 						/*	that.oSelectedItem.Req_Current_ETA_From = that.oSelectedItem.pstsp;*/
 						that.oSelectedItem.Off_Current_ETA_To = that.oSelectedItem.pstsp;

 						var dateString = that.oSelectedItem.zzadddata4;
 						if (dateString != "" && dateString != undefined && dateString != null) {

 							var year = dateString.substring(0, 4);
 							var month = dateString.substring(4, 6);
 							var day = dateString.substring(6, 8);

 							var Off_Current_ETA_From = new Date(year, month - 1, day);
 							Off_Current_ETA_From = new Date(Off_Current_ETA_From);
 							Off_Current_ETA_From = Date.parse(Off_Current_ETA_From);

 							that.oSelectedItem.Off_Current_ETA_From = "/Date(" + Off_Current_ETA_From + ")/";
 						} else {
 							that.oSelectedItem.Off_Current_ETA_From = "/Date(0)/";
 						}
 						//	var Proposed_ETA_From=Number(that.oSelectedItem.Proposed_ETA_From);
 						var dateString = "";
 						if (dateString != "" && dateString != undefined && dateString != null) {
 							var year = dateString.substring(0, 4);
 							var month = dateString.substring(4, 6);
 							var day = dateString.substring(6, 8);

 							var Proposed_ETA_From = new Date(year, month - 1, day);
 							Proposed_ETA_From = new Date(Proposed_ETA_From);
 							Proposed_ETA_From = Date.parse(Proposed_ETA_From);

 							that.oSelectedItem.Off_Proposed_ETA_From = "/Date(" + Proposed_ETA_From + ")/";
 						} else {
 							that.oSelectedItem.Off_Proposed_ETA_From = "/Date(0)/";
 						}
 						/*	var Req_Proposed_ETA_To = Number(that.oSelectedItem.Proposed_ETA_To);
 							Req_Proposed_ETA_To = new Date(Req_Proposed_ETA_To);
 							Req_Proposed_ETA_To = Date.parse(Req_Proposed_ETA_To);*/

 						that.oSelectedItem.Off_Proposed_ETA_To = "/Date(0)/";

 						sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").setProperty("/OffredVehicle", that.oSelectedItem);
 						that.getRouter().navTo("VehicleTrade_UpdtTradReq", {
 							SelectedTrade: "VehicleTrade_updateTradeVehicle"
 						});

 					} else if (that.SelectedVehicleFrom == "VehicleTrade_ModelBlock_Summary") {
 						//	var Selobj=escape(JSON.stringify(oSelectedItem));
 						var model = new sap.ui.model.json.JSONModel(that.oSelectedItem);
 						sap.ui.getCore().setModel(model, "VehicleTrade_ModelBlock_SummaryTrade");
 						that.getRouter().navTo("VehicleTrade_ModelBlock_Summary", {
 							SelectedTrade: "VehicleTradeVehicle"
 						});

 					}
 				}

 			});

 		},
 		onChange: function (oEvent) {
 			var oValue = oEvent.getParameter("value");
 			var oMultipleValues = oValue.split(",");
 			var oTable = this.getView().byId("idProductsTable");
 			var oBindingPath = this.getView().getModel().getProperty("/bindingValue"); //Get Hold of Model Key value that was saved
 			var aFilters = [];
 			for (var i = 0; i < oMultipleValues.length; i++) {
 				var oFilter = new Filter(oBindingPath, "Contains", oMultipleValues[i]);
 				aFilters.push(oFilter);
 			}
 			var oItems = oTable.getBinding("items");
 			oItems.filter(aFilters, "Application");
 			//	this._oResponsivePopover.close();
 		},

 		// onAscending: function () {
 		// 	var that = this;
 		// 	//	that.getView().byId("table").destroyItems();
 		// 	var oTable = this.getView().byId("table");
 		// 	var oItems = oTable.getBinding("items");
 		// 	oTable.getBinding("items").aSorters = null;
 		// 	var oBindingPath = oTable.getModel().getProperty("/bindingValue");
 		// 	var oSorter = new Sorter(oBindingPath, false);
 		// 	oItems.sort(oSorter);
 		// 	if (this.selooLabelText == "Model") {
 		// 		this.getView().byId("moAsIcon").setVisible(true);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);

 		// 	} else if (this.selooLabelText == "Color") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(true);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);

 		// 	} else if (this.selooLabelText == "Series") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(true);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);

 		// 	} else if (this.selooLabelText == "Suffix") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(true);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);
 		// 	} else if (this.selooLabelText == "APX") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(true);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);
 		// 	} else if (this.selooLabelText == "Order Type") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(true);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);
 		// 	} else if (this.selooLabelText == "ETA From") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(true);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);
 		// 	} else if (this.selooLabelText == "ETA To") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(true);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);
 		// 	} else if (this.selooLabelText == "Vehicle Tracking Number") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(true);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);
 		// 	}
 		// 	//
 		// 	/*this._oResponsivePopover.close();*/
 		// },

 		// onDescending: function () {
 		// 	var that = this;
 		// 	//	that.getView().byId("table1VSR").destroyItems();
 		// 	var oTable = this.getView().byId("table");
 		// 	var oItems = oTable.getBinding("items");
 		// 	oTable.getBinding("items").aSorters = null;
 		// 	var oBindingPath = oItems.getModel().getProperty("/bindingValue");
 		// 	var oSorter = new Sorter(oBindingPath, true);
 		// 	oItems.sort(oSorter);

 		// 	if (this.selooLabelText == "Model") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(true);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);

 		// 	} else if (this.selooLabelText == "Color") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(true);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);

 		// 	} else if (this.selooLabelText == "Series") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(true);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);

 		// 	} else if (this.selooLabelText == "Suffix") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(true);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);
 		// 	} else if (this.selooLabelText == "APX") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(true);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);
 		// 	} else if (this.selooLabelText == "Order Type") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(true);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);
 		// 	} else if (this.selooLabelText == "ETA From") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(true);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);
 		// 	} else if (this.selooLabelText == "ETA To") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(true);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(false);
 		// 	} else if (this.selooLabelText == "Vehicle Tracking Number") {
 		// 		this.getView().byId("moAsIcon").setVisible(false);
 		// 		this.getView().byId("moDsIcon").setVisible(false);
 		// 		this.getView().byId("senAsIcon").setVisible(false);
 		// 		this.getView().byId("senDsIcon").setVisible(false);
 		// 		this.getView().byId("coAsIcon").setVisible(false);
 		// 		this.getView().byId("coDsIcon").setVisible(false);
 		// 		this.getView().byId("suAsIcon").setVisible(false);
 		// 		this.getView().byId("suDsIcon").setVisible(false);
 		// 		this.getView().byId("apAsIcon").setVisible(false);
 		// 		this.getView().byId("apDsIcon").setVisible(false);
 		// 		this.getView().byId("otAsIcon").setVisible(false);
 		// 		this.getView().byId("otDsIcon").setVisible(false);
 		// 		this.getView().byId("etfAsIcon").setVisible(false);
 		// 		this.getView().byId("etfDsIcon").setVisible(false);
 		// 		this.getView().byId("ettAsIcon").setVisible(false);
 		// 		this.getView().byId("ettDsIcon").setVisible(false);
 		// 		this.getView().byId("vtnAsIcon").setVisible(false);
 		// 		this.getView().byId("vtnDsIcon").setVisible(true);
 		// 	}
 		// 	/*	this._oResponsivePopover.close();*/
 		// },

 		onOpen: function (oEvent) {
 			//On Popover open focus on Input control
 			var oPopover = sap.ui.getCore().byId(oEvent.getParameter("id"));
 			var oPopoverContent = oPopover.getContent()[0];
 			var oCustomListItem = oPopoverContent.getItems()[2];
 			var oCustomContent = oCustomListItem.getContent()[0];
 			var oInput = oCustomContent.getItems()[1];
 			oInput.focus();
 			//	oInput.$().find('.sapMInputBaseInner')[0].select();
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

 		onLiveChange: function (oEvent) {
 			this.sSearchQuery = oEvent.getSource()
 				.getValue();
 			this.fnApplyFiltersAndOrdering();
 		},
 		fnApplyFiltersAndOrdering: function (oEvent) {
 			var aFilters = [],
 				aSorters = [];

 			aSorters.push(new Sorter("dealerId1", this.bDescending));

 			if (this.sSearchQuery) {
 				var oFilter = new Filter([
 					new Filter("zzvtn", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
 					new Filter("vhvin", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),// DMND0003618 by Swetha
 					// new Filter("VHVIN", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
 					new Filter("matnr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
 					new Filter("model_desc_en", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
 					new Filter("model_desc_fr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),

 					new Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
 					new Filter("suffix_desc_en", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
 					new Filter("suffix_desc_fr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),

 					new Filter("zzextcol", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),

 					new Filter("mktg_desc_en", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
 					new Filter("mktg_desc_fr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery)

 				], false);
 				// this.sSearchQuery);
 				// filterArray.push(oFilter);
 			}
 			var Status = this.getView().byId("VLRStatus1").getSelectedKey();
 			var oFilter1;
 			if (Status == "1") {

 				oFilter1 = new Filter([
 					new Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status)
 				]);

 			} else {

 				oFilter1 = new Filter([
 					new Filter("zz_trading_ind", sap.ui.model.FilterOperator.NE, "1")
 				]);

 			}
 			var aFilters = new sap.ui.model.Filter([oFilter1, oFilter], true);

 			this.byId("vehicleSelectTable")
 				.getBinding("items")
 				.filter(aFilters)
 				.sort(aSorters);
 			// filterArray=[];
 		},

 		handleViewSettingsDialogButtonPressed: function (oEvt) {

 			if (!this._sortDialog) {
 				this._sortDialog = sap.ui.xmlfragment("vehicleSelectionSortDialog", "vehicleLocator.fragment.VehicleSelectionSortDialog", this);
 			}
 			this.getView().addDependent(this._sortDialog);

 			this._sortDialog.open();

 		},

 		//     handleViewSettingsDialogButtonPressed: function (oEvent) {
 		//     if (!this._oDialog) {
 		//          this._oDialog = sap.ui.xmlfragment("vehicleSortDialog", "vehicleLocator.fragment",
 		//             this);
 		//     }
 		//     // toggle compact style
 		//     jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(),
 		//         this._oDialog);
 		//     this._oDialog.open();
 		// },    

 		handleConfirm: function (oEvent) {
 			// This event is triggered when user
 			// clicks on Ok button on
 			// fragment popup
 			var aSorters = [];
 			var oView = this.getView();
 			var oTable = oView
 				.byId("vehicleSelectTable");
 			// Get the parameters for sorting
 			var mParams = oEvent
 				.getParameters();
 			var oBinding = oTable
 				.getBinding("items");
 			var sPath = mParams.sortItem
 				.getKey();
 			var bDescending = mParams.sortDescending;
 			aSorters.push(new Sorter(sPath,
 				bDescending));
 			oBinding.sort(aSorters);

 		},
 		handleCancel: function (oEvent) {
 			// this._sortDialog.destroy(true);
 		},
 		SuffixDescrioptionBinding: function () {
 			var sLocation = window.location.host;
 			var sLocation_conf = sLocation.search("webide");

 			if (sLocation_conf == 0) {
 				this.sPrefix = "/vehicleLocatorNode";
 			} else {
 				this.sPrefix = "";

 			}

 			this.nodeJsUrl = this.sPrefix + "/node";
 			var that = this;
 			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
 			//	var SelYear = new Date().getFullYear().toString();
 			//	that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
 			var SeriesDes = that.oDataUrl + "/zc_mmfields";

 			var ajax2 = $.ajax({
 				dataType: "json",
 				xhrFields: //
 				{
 					withCredentials: true
 				},
 				url: SeriesDes,
 				async: true,
 				success: function (result) {
 					//INC0190093 changes done by Minakshi for Filtering zzaddata4 0 values. start
 					var seriesList = result.d.results.filter(item => item.zzzadddata4 != "0");
 					var SeriesDesModel = new sap.ui.model.json.JSONModel(seriesList);
 					sap.ui.getCore().setModel(SeriesDesModel, "SeriesDesModel");
 					//INC0190093 end
 					//	var SelYear = new Date().getFullYear().toString();
 					var SelYear = new Date().getFullYear();
 					//temporary-2018, data avaialable for 2018, before deploying remove this
 					//	SelYear = "2018"
 					that.SeriesBinding(SelYear);

 				},

 			});
 		},
 		SeriesBinding: function (SelectedYear) {
 			var that = this;
 			if (sap.ui.getCore().getModel("SeriesModel") != undefined) {

 				var oResults = sap.ui.getCore().getModel("SeriesModel").getData();
 				// the series should show all the 4 years included in here. 
 				// that.oSelectedYear = SelectedYear;   //GSR  Defect 11177
 				// var oResults = oResults.filter(function (x) {
 				// 	return x.Modelyear == that.oSelectedYear;

 				// });
 				var obj = {};
 				for (var i = 0, len = oResults.length; i < len; i++)
 					obj[oResults[i]['TCISeries']] = oResults[i];
 				oResults = new Array();
 				for (var key in obj)
 					oResults.push(obj[key]);
 				that.Fullurls = oResults;
 				var SeriesDescription = that.SeriesDescription(oResults);
 				// var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language;  //2603
 				var SPRAS = that.sCurrentLocaleD;
 				if (SeriesDescription.length != 0) {
 					for (var a = 0; a < that.Fullurls.length; a++) {
 						for (var b = 0; b < SeriesDescription.length; b++) {

 							if (that.Fullurls[a].TCISeries == SeriesDescription[b].ModelSeriesNo) {
 								// exclude landcruiser 26th May
 								if (that.Fullurls[a].TCISeries != "L/C") {
 									that.Fullurls[a].TCISeriesDescriptionEN = SeriesDescription[b].TCISeriesDescriptionEN;
 									that.Fullurls[a].TCISeriesDescriptionFR = SeriesDescription[b].TCISeriesDescriptionFR;
 									that.Fullurls[a].Division = SeriesDescription[b].Division;
 									that.Fullurls[a].SPRAS = SPRAS;
 									that.Fullurls[a].zzzadddata4 = Number(SeriesDescription[b].zzzadddata4);
 								}

 							}
 						}

 					}
 				} else {
 					for (var i = 0; i < that.Fullurls.length; i++) {
 						that.Fullurls.TCISeriesDescriptionEN = "";
 						that.Fullurls.TCISeriesDescriptionFR = "";
 						that.Fullurls.Division = "";
 						that.Fullurls.SPRAS = SPRAS;

 					}
 				}
 				for (var i = 0; i < that.Fullurls.length; i++) {
 					if ("TCISeriesDescriptionEN" in that.Fullurls[i]) {
 						that.Fullurls[i].TCISeriesDescriptionEN = that.Fullurls[i].TCISeriesDescriptionEN;
 					} else {
 						that.Fullurls[i].TCISeriesDescriptionEN = "";
 					}
 					if ("TCISeriesDescriptionFR" in that.Fullurls[i]) {
 						that.Fullurls[i].TCISeriesDescriptionFR = that.Fullurls[i].TCISeriesDescriptionFR;
 					} else {
 						that.Fullurls[i].TCISeriesDescriptionFR = "";
 					}
 					if ("Division" in that.Fullurls[i]) {
 						that.Fullurls[i].Division = that.Fullurls[i].Division;
 					} else {
 						that.Fullurls[i].Division = "";
 					}
 					if ("SPRAS" in that.Fullurls[i]) {
 						that.Fullurls[i].SPRAS = that.Fullurls[i].SPRAS;
 					} else {
 						that.Fullurls[i].SPRAS = SPRAS;
 					}
 					that.Fullurls[i].zzzadddata4 = Number(that.Fullurls[i].zzzadddata4); //GSR2405
 				}

 				// if (sap.ui.getCore().getModel("LoginBpDealerModel") != undefined) {
 				// if (sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].Division == "10") {
 				if (that.sDivision == "10") {
 					that.Division = "TOY";
 					// } else if (sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].Division == "20") {
 				} else if (that.sDivision == "20") {
 					that.Division = "LEX";
 				}
 				// }

 				that.Fullurls = that.Fullurls.filter(function (x) {
 					return x.Division == that.Division;
 				});

 				/*global  _:true*/
 				// this is the sort
 				that.Fullurls = _.sortBy(that.Fullurls, "zzzadddata4");

 				// remove the duplicates also from here. 				
 				var SeriesModelData = new sap.ui.model.json.JSONModel(that.Fullurls).getData(); //TCISeriesDescriptionEN
 				// var modelDataNoDuplicates = that.removeDuplicates(SeriesModelData, "TCISeriesDescriptionEN");

 				var SeriesModel = new sap.ui.model.json.JSONModel(SeriesModelData);
 				// that.getView().setModel(SeriesModel, "SeriesData");
 				that.getView().byId("oVt_SeriesCmbo").setModel(SeriesModel);
 				if (this.getView().byId("oVt_SeriesCmbo").getItems().filter(function (x) {
 						return x.mProperties.key == "all"
 					}).length == 0) {

 					if (this.sCurrentLocale == "EN") {
 						var newItem = new sap.ui.core.Item({
 							key: "all",
 							text: "ALL"
 						});
 						this.getView().byId("oVt_SeriesCmbo").insertItem(newItem);

 					} else {

 						var newItem = new sap.ui.core.Item({
 							key: "all",
 							text: "TOUS"
 						});
 						this.getView().byId("oVt_SeriesCmbo").insertItem(newItem);

 					}

 				}
 				this.getView().byId("oVt_SeriesCmbo").setSelectedKey("all");
 				// var SeriesModel = new sap.ui.model.json.JSONModel(that.Fullurls);
 				// that.getView().setModel(SeriesModel, "SeriesData");
 				// that.getView().byId("oVt_SeriesCmbo").setModel(SeriesModel);

 			}
 			sap.ui.core.BusyIndicator.hide();
 		},
 		SeriesDescription: function (Data) {
 			var that = this;

 			if (sap.ui.getCore().getModel("SeriesDesModel") != undefined) {
 				var oResults = sap.ui.getCore().getModel("SeriesDesModel").getData();

 				that.SeriesDesc = oResults;
 			} else {
 				that.SeriesDesc = [];
 			}

 			//	}

 			/*var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
 					that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);*/
 			/*	this.oSufModelYear = oResults[0].ModelYear;
 				this.oSufTCISeries = oResults[0].TCISeries;
 				this.oSufModel = oResults[0].Model;*/
 			/*	that.SuffixDescription(oResults);
 				
 				var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
 				that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);*/

 			return that.SeriesDesc;
 		},

 		TradeSummaryoDate: function (Created_On) {
 			if (Created_On != null && Created_On != "" && Created_On != "/Date(0)/") {
 				var dateTo = Created_On.split("(")[1];
 				if (Created_On.indexOf("+") != -1) {
 					/*dateTo = dateTo.split("+")[0];*/
 					Created_On = new Date(Created_On.split("(")[1].substring(0, 10) * 1000).toDateString().substring(4, 15);
 					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
 						pattern: "yyyyMMdd"
 					});
 					return oDateFormat.format(new Date(Created_On));

 				} else {
 					dateTo = dateTo;
 					var dataTo1 = dateTo.substring(0, dateTo.length - 5);
 					var ValidTo = new Date(dataTo1 * 1000);
 					ValidTo = ValidTo.toGMTString().substring(4, 16);
 					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
 						pattern: "yyyyMMdd"
 					});
 					return oDateFormat.format(new Date(ValidTo));
 				}

 			} else {
 				return "";
 			}
 		},
 		onUpdateFinished: function (oEvent) {

 			var oTable = this.getView().byId("vehicleSelectTable");

 			if (oTable.getBinding("items").isLengthFinal()) {
 				var iCount = oEvent.getParameter("total");
 				// iItems = oTable.getItems().length;
 				// sTitle += "(" + iItems + "/" + iCount + ")";
 			}
 			// this.getView().byId("title").setText(sTitle);

 			var tableLength = iCount; //tableData.length;
 			var oModelDetail = this.getView().getModel("detailView");

 			var sExpectedText = this.getView().getModel("i18n").getResourceBundle().getText("tableCount", [tableLength]);
 			oModelDetail.setProperty("/tableCount", sExpectedText);

 		},
 		onDealerChange: function () {
 			this.comingFromSuffixChange = false;
 			var Status = this.getView().byId("VLRStatus1").getSelectedKey();
 			var DealerSel = this.getView().byId("VLRDealer1").getSelectedKey();
 			if (DealerSel == "all") {
 				if (Status == "1") {
 					// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"})
 					var Color = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 						return x.zz_trading_ind == "1";
 					});

 				} else {
 					// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")})
 					var Color = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 						return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3");
 					});
 				}
 			} else {
 				if (Status == "1") {
 					// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"&&x.kunnr==DealerSel})
 					var Color = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 						return x.zz_trading_ind == "1" && x.kunnr == DealerSel;
 					});
 				} else {
 					var Color = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 						return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3") && x.kunnr == DealerSel;
 					});
 					// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")&&x.kunnr==DealerSel})
 				}

 			}
 			//	var Color = sap.ui.getCore().getModel("SearchedData").getData();
 			var obj = {};
 			for (var i = 0, len = Color.length; i < len; i++)
 				obj[Color[i]['zzextcol']] = Color[i];
 			Color = new Array();
 			for (var key in obj)
 				Color.push(obj[key]);
 			var Model = new sap.ui.model.json.JSONModel(Color);
 			// Model.setSizeLimit(1000);
 			var selctedColor = this.getView().byId("VLRColor1").getSelectedKey();
 			this.getView().byId("VLRColor1").setModel(Model);
 			if (Color.length != 0) {
 				if (this.getView().byId("VLRColor1").getItems().filter(function (x) {
 						return x.mProperties.key == "all";
 					}).length == 0) {

 					if (this.sCurrentLocale == 'EN') {

 						var newItem = new sap.ui.core.Item({
 							key: "all",
 							text: "ALL"
 						});

 					} else {

 						var newItem = new sap.ui.core.Item({
 							key: "all",
 							text: "TOUS"
 						});

 					}

 					var SelctKey = Color.filter(function (x) {
 						return x.zzextcol == selctedColor;
 					});
 					this.getView().byId("VLRColor1").insertItem(newItem);

 					/*this.getView().byId("VLRColor").setSelectedKey("all");
 					this.getView().byId("VLRColor").setSelectedItem("ALL");*/
 					if (selctedColor == "" || SelctKey.length == 0) {
 						if (this.sCurrentLocale == 'EN') {

 							this.getView().byId("VLRColor1").setSelectedItem("ALL");
 						} else {

 							this.getView().byId("VLRColor1").setSelectedItem("TOUS");
 						}

 						this.getView().byId("VLRColor1").setSelectedKey("all");
 					} else {
 						this.getView().byId("VLRColor1").setSelectedKey(selctedColor);
 					}
 				}
 			} else {
 				if (this.getView().byId("VLRColor1").getItems().filter(function (x) {
 						return x.mProperties.key == "all";
 					}).length == 0) {
 					if (this.sCurrentLocale == 'EN') {

 						var newItem = new sap.ui.core.Item({
 							key: "all",
 							text: "ALL"
 						});

 					} else {

 						var newItem = new sap.ui.core.Item({
 							key: "all",
 							text: "TOUS"
 						});

 					}
 					this.getView().byId("VLRColor1").insertItem(newItem);
 					this.getView().byId("VLRColor1").setSelectedKey("all");
 					if (this.sCurrentLocale == 'EN') {

 						this.getView().byId("VLRColor1").setSelectedItem("ALL");
 					} else {

 						this.getView().byId("VLRColor1").setSelectedItem("TOUS");
 					}
 				}
 			}

 			this.onStatusChange();
 		},
 		SuffixFilter: function () {

 			if (sap.ui.getCore().getModel("SearchedData") && sap.ui.getCore().getModel("oSuffieldmodel") != undefined) {
 				// this.getView().setModel(sap.ui.getCore().getModel("SearchedData"), "VehicleLocatorScdScr");

 				// var Status = sap.ui.getCore().getModel("SearchedData").getData();
 				// var model = new sap.ui.model.json.JSONModel(Status);

 				// this.getView().setModel(model, "vehicleSelectTableModel");

 				var tableLength = this.getView().getModel("vehicleSelectTableModel").getData().length;
 				var oModelDetail = this.getView().getModel("detailView");

 				var sExpectedText = this.getView().getModel("i18n").getResourceBundle().getText("tableCount", [tableLength]);
 				oModelDetail.setProperty("/tableCount", sExpectedText);

 				var Dealer = sap.ui.getCore().getModel("SearchedData").getData();

 				var Suffix = sap.ui.getCore().getModel("VehicleLocatorSuffix").getData();

 				var SPRAS = this.sCurrentLocaleD;

 				var SuffixData = [];
 				for (var i = 0; i < Suffix.length; i++) {
 					var obj = {};
 					obj.zzsuffix = Suffix[i].Suffix;
 					obj.suffix_desc_en = Suffix[i].SuffixDescriptionEN;
 					obj.suffix_desc_fr = Suffix[i].SuffixDescriptionFR;
 					obj.mrktg_int_desc_en = Suffix[i].mrktg_int_desc_en;
 					obj.mrktg_int_desc_fr = Suffix[i].mrktg_int_desc_fr;
 					obj.int_c = Suffix[i].int_c;
 					obj.SPRAS = Suffix[i].SPRAS;
 					SuffixData.push(obj);
 				}
 				var Color = sap.ui.getCore().getModel("SearchedData").getData();
 				var obj = {};

 				var Status = this.getView().byId("VLRStatus1").getSelectedKey();
 				if (Status == "1") {
 					for (var i = 0, len = Color.length; i < len; i++) {
 						if (Color[i].zz_trading_ind == "1") {
 							obj[Color[i]['zzextcol']] = Color[i];
 						}

 					}
 				} else {

 					for (var i = 0, len = Color.length; i < len; i++) {
 						if ((Color[i].zz_trading_ind == "2") || (Color[i].zz_trading_ind == "3")) {
 							obj[Color[i]['zzextcol']] = Color[i];
 						}

 					}

 				}

 				Color = new Array();
 				for (var key in obj)
 					Color.push(obj[key]);
 				var Model = new sap.ui.model.json.JSONModel(Color);
 				// Model.setSizeLimit(1000);
 				this.getView().byId("VLRColor1").setModel(Model);
 				// if (Color.length != 0) {
 				if (this.getView().byId("VLRColor1").getItems().filter(function (x) {
 						return x.mProperties.key == "all"
 					}).length == 0) {

 					if (this.sCurrentLocale == "EN") {

 						var newItem = new sap.ui.core.Item({
 							key: "all",
 							text: "ALL"
 						});
 						this.getView().byId("VLRColor1").insertItem(newItem);
 						this.getView().byId("VLRColor1").setSelectedKey("all");
 						this.getView().byId("VLRColor1").setSelectedItem("ALL");
 					} else {
 						// for french
 						var newItem = new sap.ui.core.Item({
 							key: "all",
 							text: "TOUS"
 						});
 						this.getView().byId("VLRColor1").insertItem(newItem);
 						this.getView().byId("VLRColor1").setSelectedKey("all");
 						this.getView().byId("VLRColor1").setSelectedItem("TOUS");

 					}
 				}
 			}

 			var obj = {};
 			for (var i = 0, len = Dealer.length; i < len; i++)
 				obj[Dealer[i]['kunnr']] = Dealer[i];
 			Dealer = new Array();
 			for (var key in obj)
 				Dealer.push(obj[key]);
 			var Model1 = new sap.ui.model.json.JSONModel(Dealer);
 			Model1.setSizeLimit(1000);
 			this.getView().byId("VLRDealer1").setModel(Model1);
 			if (Dealer.length != 0) {
 				if (this.getView().byId("VLRDealer1").getItems().filter(function (x) {
 						return x.mProperties.key == "all"
 					}).length == 0) {

 					if (this.sCurrentLocale == 'EN') {

 						var newItem = new sap.ui.core.Item({
 							key: "all",
 							text: "ALL"
 						});
 						this.getView().byId("VLRDealer1").insertItem(newItem);
 						this.getView().byId("VLRDealer1").setSelectedKey("all");
 						this.getView().byId("VLRDealer1").setSelectedItem("ALL");
 					} else {
 						// for french
 						var newItem = new sap.ui.core.Item({
 							key: "all",
 							text: "TOUS"
 						});
 						this.getView().byId("VLRDealer1").insertItem(newItem);
 						this.getView().byId("VLRDealer1").setSelectedKey("all");
 						this.getView().byId("VLRDealer1").setSelectedItem("TOUS");

 					}

 				}
 			} else {
 				if (this.getView().byId("VLRDealer1").getItems().filter(function (x) {
 						return x.mProperties.key == "all"
 					}).length == 0) {

 					if (this.sCurrentLocale == 'EN') {
 						var newItem = new sap.ui.core.Item({
 							key: "all",
 							text: "ALL"
 						});
 						this.getView().byId("VLRDealer1").insertItem(newItem);
 						this.getView().byId("VLRDealer1").setSelectedItem("ALL");
 						this.getView().byId("VLRDealer1").setSelectedKey("all");

 					} else {
 						var newItem = new sap.ui.core.Item({
 							key: "all",
 							text: "TOUS"
 						});

 						this.getView().byId("VLRDealer1").insertItem(newItem);
 						this.getView().byId("VLRDealer1").setSelectedItem("TOUS");
 						this.getView().byId("VLRDealer1").setSelectedKey("all");

 					}

 				}

 			}

 			this.onStatusChange();
 			sap.ui.core.BusyIndicator.hide();

 		},
 		onColourChange: function () {
 			var Status = this.getView().byId("VLRStatus1").getSelectedKey();
 			var ColorSel = this.getView().byId("VLRColor1").getSelectedKey();
 			this.comingFromSuffixChange = false;
 			if (ColorSel == "all") {
 				if (Status == "1") {

 					var Dealer = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 						return x.zz_trading_ind == "1";
 					});
 					//		var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"})
 				} else {
 					var Dealer = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 						return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3");
 					});
 					// var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")})
 				}
 			} else {
 				if (Status == "1") {
 					var Dealer = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 						return x.zz_trading_ind == "1" && x.zzextcol == ColorSel;
 					});
 					// var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1" &&x.zzextcol==ColorSel})
 				} else {
 					var Dealer = this.getView().getModel("vehicleSelectTableModel").getData().filter(function (x) {
 						return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3") && x.zzextcol == ColorSel;
 					});
 					// var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3") &&x.zzextcol==ColorSel})
 				}

 			}
 			// var obj = {};
 			// for (var i = 0, len = Dealer.length; i < len; i++)
 			// 	obj[Dealer[i]['kunnr']] = Dealer[i];
 			// Dealer = new Array();
 			// for (var key in obj)
 			// 	Dealer.push(obj[key]);
 			// var selctedDealer = this.getView().byId("VLRDealer1").getSelectedKey();
 			// var Model1 = new sap.ui.model.json.JSONModel(Dealer);
 			// Model1.setSizeLimit(1000);
 			// this.getView().byId("VLRDealer1").setModel(Model1);
 			// if (Dealer.length != 0) {
 			// 	if (this.getView().byId("VLRDealer1").getItems().filter(function (x) {
 			// 			return x.mProperties.key == "all";
 			// 		}).length == 0) {

 			// 		if (this.sCurrentLocale == 'EN') {
 			// 			var newItem = new sap.ui.core.Item({
 			// 				key: "all",
 			// 				text: "ALL"
 			// 			});
 			// 		} else {
 			// 			var newItem = new sap.ui.core.Item({
 			// 				key: "all",
 			// 				text: "TOUS"
 			// 			});

 			// 		}

 			// 		this.getView().byId("VLRDealer1").insertItem(newItem);
 			// 		// var SelctKey = Dealer.filter(function (x) {
 			// 		// 	return x.kunnr == selctedDealer;
 			// 		// });
 			// 		// if (selctedDealer == "" || SelctKey.length == 0) {
 			// 		// 	if (this.sCurrentLocale == 'EN') {

 			// 		// 		this.getView().byId("VLRDealer1").setSelectedItem("ALL");
 			// 		// 	} else {
 			// 		// 		this.getView().byId("VLRDealer1").setSelectedItem("TOUS");
 			// 		// 	}
 			// 		// 	this.getView().byId("VLRDealer1").setSelectedKey("all");
 			// 		// } else {
 			// 		// 	this.getView().byId("VLRDealer1").setSelectedKey(selctedDealer);
 			// 		// }
 			// 	}
 			// } else {
 			// 	if (this.getView().byId("VLRDealer1").getItems().filter(function (x) {
 			// 			return x.mProperties.key == "all";
 			// 		}).length == 0) {
 			// 		if (this.sCurrentLocale == 'EN') {

 			// 			this.getView().byId("VLRColor1").setSelectedItem("ALL");
 			// 		} else {

 			// 			this.getView().byId("VLRColor1").setSelectedItem("TOUS");
 			// 		}
 			// 		this.getView().byId("VLRDealer1").insertItem(newItem);
 			// 		if (selctedDealer == "") {

 			// 			if (this.sCurrentLocale == 'EN') {

 			// 				this.getView().byId("VLRColor1").setSelectedItem("ALL");
 			// 			} else {

 			// 				this.getView().byId("VLRColor1").setSelectedItem("TOUS");
 			// 			}

 			// 			this.getView().byId("VLRDealer1").setSelectedKey("all");
 			// 		} else {
 			// 			this.getView().byId("VLRDealer1").setSelectedKey(selctedDealer);
 			// 		}
 			// 	}

 			// }
 			this.onStatusChange();

 		},
 		onSuffixChange: function () {
 			var that = this;
 			// that.oJsonModelVLS = new sap.ui.model.json.JSONModel([]);
 			// that.getView().setModel(that.oJsonModelVLS, "Suffix");
 			sap.ui.core.BusyIndicator.show();
 			var sLocation = window.location.host;
 			var sLocation_conf = sLocation.search("webide");

 			if (sLocation_conf == 0) {
 				this.sPrefix = "/vehicleLocatorNode";
 			} else {
 				this.sPrefix = "";

 			}
 			var Model = that.getView().byId("McCmbo").getSelectedKey();
 			var Model_Year = that.oSelectedYear;
 			var suffix = that.getView().byId("VLRSuffix1").getSelectedKey();
 			this.nodeJsUrl = this.sPrefix + "/node";

 			var SuffixURL = that.oDataUrl + "/ZVMS_CDS_Colour?$filter=model_year eq '" + Model_Year +
 				"' and model eq '" + Model + "'and suffix eq '" + suffix + "'";

 			var ajax3 = $.ajax({
 				dataType: "json",
 				xhrFields: //
 				{
 					withCredentials: true
 				},
 				url: SuffixURL,
 				async: true,
 				success: function (result) {
 					var Suffix = result.d.results;
 					var SuffixData = [];
 					if (Suffix.length != 0) {
 						for (var i = 0; i < Suffix.length; i++) {
 							var obj = {};
 							obj.zzextcol = Suffix[i].zzextcol;
 							obj.mktg_desc_en = Suffix[i].mktg_desc_en;
 							obj.mktg_desc_fr = Suffix[i].mktg_desc_fr;
 							// obj.mrktg_int_desc_en = Suffix[i].mrktg_int_desc_en;
 							// obj.mrktg_int_desc_fr = Suffix[i].mrktg_int_desc_fr;
 							// obj.int_c = Suffix[i].int_c;
 							// obj.SPRAS = Suffix[i].SPRAS;
 							SuffixData.push(obj);
 						}
 						// var suffixDataNoDuplicates = that.removeDuplicates(SuffixData, "zzsuffix");

 						// modelDataNoDuplicates = Array.from(new Set(modelData.map(JSON.stringify))).map(JSON.parse);

 						var suffixModel = new sap.ui.model.json.JSONModel(SuffixData);
 						// var Model = new sap.ui.model.json.JSONModel(suffixModel);
 						// that.getView().byId("VLRSuffix1").setModel(suffixModel);

 						var SuffixModel = new sap.ui.model.json.JSONModel(Suffix);
 						that.getView().byId("VLRColor1").setModel(SuffixModel);
 						if (that.getView().byId("VLRColor1").getItems().filter(function (x) {
 								return x.mProperties.key == "all"
 							}).length == 0) {

 							if (that.sCurrentLocale == 'EN') {
 								var newItem = new sap.ui.core.Item({
 									key: "all",
 									text: "ALL"
 								});
 								that.getView().byId("VLRColor1").insertItem(newItem);
 							} else {

 								var newItem = new sap.ui.core.Item({
 									key: "all",
 									text: "TOUS"
 								});
 								that.getView().byId("VLRColor1").insertItem(newItem);

 							}

 						}
 						that.getView().byId("VLRStatus1").setEnabled(true);
 						that.getView().byId("AcceInstalledCobmo1").setEnabled(true);
 						that.getView().byId("VLRSuffix1").setEnabled(true);
 						that.getView().byId("VLRColor1").setEnabled(true);
 						that.getView().byId("VLRColor1").setSelectedKey("all");
 						// that.SuffixDescription();
 					} else {
 						if (that.getView().byId("VLRColor1").getItems().filter(function (x) {
 								return x.mProperties.key == "all"
 							}).length == 0) {

 							if (that.sCurrentLocale == 'EN') {
 								var newItem = new sap.ui.core.Item({
 									key: "all",
 									text: "ALL"
 								});
 								that.getView().byId("VLRColor1").insertItem(newItem);
 							} else {

 								var newItem = new sap.ui.core.Item({
 									key: "all",
 									text: "TOUS"
 								});
 								that.getView().byId("VLRColor1").insertItem(newItem);

 							}

 						}
 						that.getView().byId("VLRStatus1").setEnabled(true);
 						that.getView().byId("AcceInstalledCobmo1").setEnabled(true);
 						that.getView().byId("VLRSuffix1").setEnabled(true);
 						that.getView().byId("VLRColor1").setEnabled(false);
 						that.getView().byId("VLRColor1").setSelectedKey("all");
 					}
 					sap.ui.core.BusyIndicator.hide();

 				},
 				error: function () {
 					sap.ui.core.BusyIndicator.hide();
 					that.getView().byId("VLRStatus1").setEnabled(true);
 					that.getView().byId("AcceInstalledCobmo1").setEnabled(true);
 					that.getView().byId("VLRSuffix1").setEnabled(true);
 					that.getView().byId("VLRColor1").setEnabled(false);
 					that.getView().byId("VLRColor1").setSelectedKey("all");
 				}
 			});
 			that.onStatusChange();

 		},
 		onAccesoriesInstalledsChange: function () {
 				this.onStatusChange();
 			}
 			/*onSelectLink:function(oEvt)
 			   
 			{
 				
 				var data=oEvt;
 				
 			}*/

 	});
 });