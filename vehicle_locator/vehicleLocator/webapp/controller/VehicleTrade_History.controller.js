sap.ui.define([
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageBox',
	"sap/ui/core/routing/History",
	"vehicleLocator/Formatter/Formatter",
	"sap/ui/Device",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter"
], function (BaseController, JSONModel, ResourceModel, MessageBox, History, Formatter, Device, Sorter,Filter) {
	"use strict";
	var TableData;
	return BaseController.extend("vehicleLocator.controller.VehicleTrade_History", {
		formatter: Formatter,
		onInit: function () {
			var _that = this;
			this._mViewSettingsDialogs = {};
			var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
			var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
			this.getView().byId("oDealerCode8").setText(LoggedInDealerCode2);
			this.getView().byId("oDealerHistory").setText(LoggedInDealer);
			//Global date format
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			_that.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});

			this._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				visibleByDefault: false,
				editAllowed: true,
				onlyShownoEditForChange: true

			});

			this.getView().setModel(this._oViewModel, "detailView");

			/// set the logo and Language. 

			this._setTheLanguage();

			this._setTheLogo();

			//this.getRouter().attachRouteMatched(this.onRouteMatched, this);
			this.getRouter().getRoute("VehicleTrade_History").attachPatternMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function (oEvent) {
			// var dataFrom = oEvent.getParameter("arguments").DataClicked;
			// if (dataFrom != undefined) {

			this.VehicleHistory_Summary();

			// }
		},

		VehicleHistory_Summary: function () {
			var that = this;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				this.sPrefix = "";

			}
			this.nodeJsUrl = this.sPrefix;

			// for zone user functionality ---------------------			

			var confirmZoneUser = sap.ui.getCore().getModel("LoginBpDealerModel").oData["0"].BusinessPartnerName;
			if (confirmZoneUser.includes("Zone User") || confirmZoneUser.includes("National")) {
				this.userType = "Zone";

				this._oViewModel.setProperty("/visibleByDefault", true);
				// --------------------
				// if it is first only bind the model, otehrwise do not bind the model again

				if (this.theFirstDefaultDealerSelected == "" || this.theFirstDefaultDealerSelected == undefined) {

					var zoneDealersForLoggedinZone = sap.ui.getCore().getModel("LoginBpDealerModel").getData();
					var BpDealer = [];

					$.each(zoneDealersForLoggedinZone, function (i, item) {

						if (i > 0) {
							BpDealer.push({
								"BusinessPartnerKey": item.BusinessPartnerKey,
								"BusinessPartner": item.BusinessPartner,
								"BusinessPartnerName": item.BusinessPartnerName,
								"Division": item.Division,
								"BusinessPartnerType": item.BusinessPartnerType,
								"searchTermReceivedDealerName": item.SearchTerm2,
								"dummyFieldForSort": item.dummyFieldForSort
							});
						}
					});
					// set the model. 
					that.getView().setModel(new sap.ui.model.json.JSONModel(BpDealer), "BpDealerModelZone");

					// set the dealer model to the screen. 

					var theFirstDefaultDealer = this.getView().getModel("BpDealerModelZone").oData["0"].BusinessPartner;

					this.getView().byId("dealerID").setSelectedKey(theFirstDefaultDealer);
					this.theFirstDefaultDealerSelected = this.getView().getModel("BpDealerModelZone").oData["0"].BusinessPartnerKey;
					var dealerName = this.getView().getModel("BpDealerModelZone").oData["0"].BusinessPartnerName;
					this._oViewModel.setProperty("/DealerName", dealerName);
					var Dealer_No = this.theFirstDefaultDealerSelected;
				} else {
					var Dealer_No = this.theFirstDefaultDealerSelected;

				}
				if (Dealer_No.length == 10) {
					Dealer_No = Dealer_No.slice(-5);
				}

			} else { // this is a dealer login, the existing logic as is. 
				this._oViewModel.setProperty("/visibleByDefault", false); // no combobox to be displayed. 

				var Dealer_No = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].DealerCode;
			}

			// var Dealer_No = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].DealerCode;

			// var lang = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language.slice(0, 1);  //0104
			var lang;
			if (this.sCurrentLocaleD == "French") {

				lang = 'F';

			} else {

				lang = 'E';

			}
			// The idea is to replace the entire below xosdata calls with a more appropriate and optimized ones wihtout
			// looping the xsodata service for better performance. 30th June 2019

			var oModel = new sap.ui.model.odata.ODataModel("/odata/v2/vehicleTrade", true);

			var dateMinusThirty = new Date();
			dateMinusThirty.setDate(dateMinusThirty.getDate() - 60);
		
			var Filter0 = new sap.ui.model.Filter('Requesting_Dealer', 'EndsWith', Dealer_No);
			var Filter1 = new sap.ui.model.Filter('Requested_Dealer', 'EndsWith', Dealer_No);
			var Filter2 = new sap.ui.model.Filter('Trade_Status', 'EQ', 'A');
			var Filter3 = new sap.ui.model.Filter('Created_On', "GE", dateMinusThirty);
			var Filter = new sap.ui.model.Filter([Filter0, Filter1], false);
			var Filterall1 = new sap.ui.model.Filter([Filter, Filter2], true);
			var Filterall = new sap.ui.model.Filter([Filterall1, Filter3], true);
           

            TableData = []; 
			oModel.read("/Trade_Request", {
				filters: [Filterall], 
			    urlParameters:{
				
				"$expand": "Vehicle,Vehicle_Desc"
			},
				async: false,
				success: function (oData, oResponse) {
					//=====Filter on Vehicles=====================	
					TableData = oData.results;
				},
				error: function (e) {

				}
			});


			for (var i = 0; i < TableData.length; i++) {
				if(TableData[i].Requesting_Dealer!=null){
				TableData[i].Requesting_Dealer = TableData[i].Requesting_Dealer.slice(-5);
				}
				if(TableData[i].Requested_Dealer!=null){
				
				TableData[i].Requested_Dealer = TableData[i].Requested_Dealer.slice(-5);
				}
				if ((TableData[i].Requesting_Dealer == Dealer_No)&&(TableData[i].Requested_Vtn != null)) {
					TableData[i].RequestingDealerVisible = true;
				}
				else if ((TableData[i].Requesting_Dealer != Dealer_No)&&(TableData[i].Requested_Vtn == null)){
										TableData[i].RequestingDealerVisible = true;
					TableData[i].Requested_Dealer = TableData[i].Requesting_Dealer;
										TableData[i].Requesting_Dealer= Dealer_No;
										var dealerName = TableData[i].Requested_Dealer_Name;
										TableData[i].Requested_Dealer_Name = TableData[i].Requesting_Dealer_Name;
										TableData[i].Requesting_Dealer_Name= dealerName;
					
					}
					else {
					TableData[i].RequestingDealerVisible = false;
							if(TableData[i].Requested_Vtn == null){
					TableData[i].Requesting_Dealer = TableData[i].Requested_Dealer;
										TableData[i].Requested_Dealer= Dealer_No;
										var dealerName = TableData[i].Requesting_Dealer_Name;
										TableData[i].Requesting_Dealer_Name = TableData[i].Requested_Dealer_Name;
										TableData[i].Requested_Dealer_Name= dealerName;
					}
				}

				var results = TableData[i].Vehicle.results;

				for (var x = 0; x < results.length; x++) {
					if (TableData[i].Requested_Vtn == results[x].VTN) {
						TableData[i].Model_Year = results[x].Model_Year;
						TableData[i].Model = results[x].Model;
						TableData[i].Series = results[x].Series;
						TableData[i].Suffix = results[x].Suffix;
						TableData[i].Colour = results[x].Int_Colour;
						TableData[i].Ext_Colour = results[x].Ext_Colour;
						TableData[i].AccessoryInstalled = results[x].AccessoryInstalled;
						if(results[x].VIN!= null)
						{
							
						
						TableData[i].VIN = results[x].VIN;
						}
						else
						{
							TableData[i].VIN = "";
						}
						//TableData[i].Int_Colour_Desc = results[x].Int_Colour_Desc;// Interior Color Suffix issue
						TableData[i].APX = results[x].APX;
						TableData[i].Order_Type = results[x].Order_Type;
						TableData[i].Status = results[x].Status;
						if(TableData[i].Trade_Return=='N')
						{
								TableData[i].OffredVehicle = {};
						TableData[i].OffredVehicle.Offered_Vtn = TableData[i].Requested_Vtn;
						TableData[i].OffredVehicle.Requesting_Dealer = TableData[i].Requesting_Dealer;
						TableData[i].OffredVehicle.Requesting_Dealer_Name = TableData[i].Requesting_Dealer_Name;
						TableData[i].OffredVehicle.Model_Year = results[x].Model_Year;
						TableData[i].OffredVehicle.Model = results[x].Model;
						TableData[i].OffredVehicle.Series = results[x].Series;
						TableData[i].OffredVehicle.Suffix = results[x].Suffix;
						TableData[i].OffredVehicle.Colour = results[x].Int_Colour;
						//TableData[i].Int_Colour_Desc = results[x].Int_Colour_Desc;// interior Color Suffix issue
						TableData[i].OffredVehicle.Ext_Colour = results[x].Ext_Colour;
						TableData[i].OffredVehicle.AccessoryInstalled = results[x].AccessoryInstalled;
						if(results[x].VIN!= null)
						{
						TableData[i].OffredVehicle.VIN = results[x].VIN;
						}
						else
						{
								TableData[i].OffredVehicle.VIN ="";
						}
						TableData[i].OffredVehicle.APX = results[x].APX;
						TableData[i].OffredVehicle.Order_Type = results[x].Order_Type;
						TableData[i].OffredVehicle.Status = results[x].Status;
						}
// else{
// 								TableData[i].OffredVehicle = {};
// 						TableData[i].OffredVehicle.Offered_Vtn = TableData[i].Offered_Vtn;
// 						TableData[i].OffredVehicle.Requesting_Dealer = TableData[i].Requested_Dealer;
// 						TableData[i].OffredVehicle.Requesting_Dealer_Name = TableData[i].Requested_Dealer_Name;
// 						TableData[i].OffredVehicle.Model_Year = results[x].Model_Year;
// 						TableData[i].OffredVehicle.Model = results[x].Model;
// 						TableData[i].OffredVehicle.Series = results[x].Series;
// 						TableData[i].OffredVehicle.Suffix = results[x].Suffix;
// 						TableData[i].OffredVehicle.Colour = results[x].Int_Colour;
// 						TableData[i].Int_Colour_Desc = results[x].Int_Colour_Desc;// interior Color Suffix issue
// 						TableData[i].OffredVehicle.Ext_Colour = results[x].Ext_Colour;
// 						TableData[i].OffredVehicle.AccessoryInstalled = results[x].AccessoryInstalled;
// 						if(results[x].VIN!= null)
// 						{
// 						TableData[i].OffredVehicle.VIN = results[x].VIN;
// 						}
// 						else
// 						{
// 								TableData[i].OffredVehicle.VIN ="";
// 						}
// 						TableData[i].OffredVehicle.APX = results[x].APX;
// 						TableData[i].OffredVehicle.Order_Type = results[x].Order_Type;
// 						TableData[i].OffredVehicle.Status = results[x].Status;
						
	
// }
					} else if (TableData[i].Offered_Vtn == results[x].VTN) {
						TableData[i].OffredVehicle = {};
						// TableData[i].OffredVehicle.Requested_VTN = TableData[i].Offered_Vtn;
						TableData[i].OffredVehicle.Offered_Vtn = TableData[i].Offered_Vtn;
						
						TableData[i].OffredVehicle.Requesting_Dealer = TableData[i].Requesting_Dealer;
						TableData[i].OffredVehicle.Requesting_Dealer_Name = TableData[i].Requesting_Dealer_Name;
						TableData[i].OffredVehicle.Model_Year = results[x].Model_Year;
						TableData[i].OffredVehicle.Model = results[x].Model;
						TableData[i].OffredVehicle.Series = results[x].Series;
						TableData[i].OffredVehicle.Suffix = results[x].Suffix;
						TableData[i].OffredVehicle.Colour = results[x].Int_Colour;
						//TableData[i].Int_Colour_Desc = results[x].Int_Colour_Desc;// interior Color Suffix issue
						TableData[i].OffredVehicle.Ext_Colour = results[x].Ext_Colour;
						TableData[i].OffredVehicle.AccessoryInstalled = results[x].AccessoryInstalled;
							if(results[x].VIN!= null)
						{
						TableData[i].OffredVehicle.VIN = results[x].VIN;
						}
						else
						{
								TableData[i].OffredVehicle.VIN = "";
						}
						TableData[i].OffredVehicle.APX = results[x].APX;
						TableData[i].OffredVehicle.Order_Type = results[x].Order_Type;
						TableData[i].OffredVehicle.Status = results[x].Status;
							if(TableData[i].Trade_Return=='N')
						{
						TableData[i].Requested_Vtn=	TableData[i].Offered_Vtn;
						TableData[i].Model_Year = results[x].Model_Year;
						TableData[i].Model = results[x].Model;
						TableData[i].Series = results[x].Series;
						TableData[i].Suffix = results[x].Suffix;
						TableData[i].Colour = results[x].Int_Colour;
						TableData[i].Ext_Colour = results[x].Ext_Colour;
						TableData[i].AccessoryInstalled = results[x].AccessoryInstalled;
							if(results[x].VIN!= null)
						{
						TableData[i].VIN = results[x].VIN;
						}
						else
						{
							TableData[i].VIN = "";
						}
						//TableData[i].Int_Colour_Desc = results[x].Int_Colour_Desc;// Interior Color Suffix issue
						TableData[i].APX = results[x].APX;
						TableData[i].Order_Type = results[x].Order_Type;
						TableData[i].Status = results[x].Status;
							
						}
						// else
						// {
						// TableData[i].Requested_Vtn=	TableData[i].Requested_Vtn;
						// TableData[i].Model_Year = results[x].Model_Year;
						// TableData[i].Model = results[x].Model;
						// TableData[i].Series = results[x].Series;
						// TableData[i].Suffix = results[x].Suffix;
						// TableData[i].Colour = results[x].Int_Colour;
						// TableData[i].Ext_Colour = results[x].Ext_Colour;
						// TableData[i].AccessoryInstalled = results[x].AccessoryInstalled;
						// 	if(results[x].VIN!= null)
						// {
						// TableData[i].VIN = results[x].VIN;
						// }
						// else
						// {
						// 	TableData[i].VIN = "";
						// }
						// TableData[i].Int_Colour_Desc = results[x].Int_Colour_Desc;// Interior Color Suffix issue
						// TableData[i].APX = results[x].APX;
						// TableData[i].Order_Type = results[x].Order_Type;
						// TableData[i].Status = results[x].Status;
							
						// }
					}

				}
			}
			// 	error: function (e1) {}
			// });

			for (var i = 0; i < TableData.length; i++) {
				if (TableData[i].Requested_Vtn != "") {

					var results = TableData[i].Vehicle_Desc.results;
					for (var j = 0; j < results.length; j++) {

						if (results[j].VTN == TableData[i].Requested_Vtn && results[j].SPRAS == lang) {
							TableData[i].Model_Desc = results[j].Model_Desc;
							TableData[i].Series_Desc = results[j].Series_Desc;
							TableData[i].Suffix_Desc = results[j].Suffix_Desc;
							TableData[i].Int_Colour_Desc = results[j].Int_Colour_Desc;
							TableData[i].Colour = results[j].Int_Colour;
							TableData[i].Ext_Colour_Desc = results[j].Ext_Colour_Desc;
								if (TableData[i].OffredVehicle) { 
								TableData[i].OffredVehicle.Model_Desc = results[j].Model_Desc;
								TableData[i].OffredVehicle.Series_Desc = results[j].Series_Desc;
								TableData[i].OffredVehicle.Suffix_Desc = results[j].Suffix_Desc;
								TableData[i].OffredVehicle.Int_Colour_Desc = results[j].Int_Colour_Desc;
								TableData[i].OffredVehicle.Colour = results[j].Int_Colour;
								TableData[i].OffredVehicle.Ext_Colour_Desc = results[j].Ext_Colour_Desc;
							}
						}
					}

				}
				if (TableData[i].Offered_Vtn != "") {

					var results = TableData[i].Vehicle_Desc.results;

					for (var k = 0; k < results.length; k++) {
						if (results[k].VTN == TableData[i].Offered_Vtn && results[k].SPRAS == lang) {
							// if (results.length > 0) {
							if (TableData[i].OffredVehicle) { 
								TableData[i].OffredVehicle.Model_Desc = results[k].Model_Desc;
								TableData[i].OffredVehicle.Series_Desc = results[k].Series_Desc;
								TableData[i].OffredVehicle.Suffix_Desc = results[k].Suffix_Desc;
								TableData[i].OffredVehicle.Int_Colour_Desc = results[k].Int_Colour_Desc;
								TableData[i].OffredVehicle.Colour = results[k].Int_Colour;
								TableData[i].OffredVehicle.Ext_Colour_Desc = results[k].Ext_Colour_Desc;
							}
						}
					}
				}
			}
			this.tableData= TableData;
			var filtered = TableData.filter(function (item) {
				return ((item.Trade_Return == 'Y') || (item.RequestingDealerVisible == true));
			});
			var filtered1 = TableData.filter(function (item) {
				return ((item.Trade_Return == 'Y') || (item.RequestingDealerVisible == false));
			});
			var model = new sap.ui.model.json.JSONModel(filtered);
			var model1 = new sap.ui.model.json.JSONModel(filtered1);
			that.getView().byId("tableVTH").setModel(model);
			that.getView().byId("tableVTH1").setModel(model1);


		},
		ExporttoExcellsheet: function () {

			// var Context = this.getView().byId("tableVTH").getBinding("items").getContexts();
			// if (Context.length == 0) {
			// 	sap.m.MessageBox.warning("No data is available to export");
			// 	return;
			// } else {
			// 	var items = Context.map(function (oEvent) {
			// 		return oEvent.getObject();
			// 	});
				this.JSONToCSVConvertor(this.tableData, "ExportGreen", true);
			// }
		},
		ExporttoExcellsheet1: function () {

			var Context = this.getView().byId("tableVTH1").getBinding("items").getContexts();
			if (Context.length == 0) {
				sap.m.MessageBox.warning("No data is available to export");
				return;
			} else {
				var items = Context.map(function (oEvent) {
					return oEvent.getObject();
				});
				this.JSONToCSVConvertor(items, "ExportGreen", true);
			}
		},
		JSONToCSVConvertor: function (JSONData, ReportTitle, ShowLabel) {
			
			var that = this;
			var Context = this.getView().byId("tableVTH").getBinding("items").getContexts();
			var Context1 = this.getView().byId("tableVTH1").getBinding("items").getContexts();
				var i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
					var CSV = "";
			if (ShowLabel) {
				var row = "";
				row = row.slice(0, -1);
			}
			var RequestNo = i18n.getText("RequestNo");
			// var Status = i18n.getText("Status");
			var From_To = i18n.getText("From_To");
		
			var VehicleTrackingNumber = i18n.getText("VehicleTrackingNumber");
			var VIN = i18n.getText("VIN");
			var Dealer = i18n.getText("Dealer");
			var Model = i18n.getText("Model");
			var Suffix = i18n.getText("Suffix");
			
			var ExteriorColor = i18n.getText("ExteriorColor");
			var APX = i18n.getText("APX");
			var Accepted = i18n.getText("Accepted");

			row += RequestNo + ",";
			// row += Status + ",";
			row += From_To + ",";
			
			row += VehicleTrackingNumber + ",";
			row += VIN + ",";
			row += Dealer + ",";
			row += Model + ",";
			row += Suffix + ",";
			
			row += ExteriorColor + ",";
			row += APX + ",";
			row += Accepted + ",";

			CSV += row + '\r\n';
			if (Context.length == 0 && Context1.length == 0) {
				sap.m.MessageBox.warning("No data is available to export");
				return;
			} else {
				var items = Context.map(function (oEvent) {
					return oEvent.getObject();
				});
				// this.JSONToCSVConvertor(this.tableData, "ExportGreen", true);
			
			var arrData = typeof items != 'object' ? JSON.parse(items) : items;
		

		

			//loop is to extract each row
			for (var i = 0; i < arrData.length; i++) {
				var row = "";
				var RequestingDealerVisible = i18n.getText("TradeIn");
				if (arrData[i].RequestingDealerVisible == true) {
					
					var SelectedDealer = arrData[i].Requested_Dealer;
					var SelectedDealerName = arrData[i].Requested_Dealer_Name;
					var DelearData = SelectedDealer + "-" + SelectedDealerName;
						var ModelData = arrData[i].Model + "-" + arrData[i].Model_Desc;
				var SuffixData = arrData[i].Suffix + "-" + arrData[i].Suffix_Desc + "/" + arrData[i].Int_Colour_Desc;
				var Ext_Colour_Data = arrData[i].Ext_Colour + "-" + arrData[i].Ext_Colour_Desc;
				var VTNData = arrData[i].Requested_Vtn;
				var VINData = arrData[i].VIN;
				var APXData = arrData[i].APX;

				} else {
					// var RequestingDealerVisible = i18n.getText("TradeIn");

					var SelectedDealer = arrData[i].Requesting_Dealer;
					var SelectedDealerName = arrData[i].Requesting_Dealer_Name;
					var DelearData = SelectedDealer + "-" + SelectedDealerName;
						var ModelData = arrData[i].OffredVehicle.Model + "-" + arrData[i].OffredVehicle.Model_Desc;
				var SuffixData = arrData[i].OffredVehicle.Suffix + "-" + arrData[i].OffredVehicle.Suffix_Desc + "/" + arrData[i].OffredVehicle.Int_Colour_Desc;
				var Ext_Colour_Data = arrData[i].OffredVehicle.Ext_Colour + "-" + arrData[i].OffredVehicle.Ext_Colour_Desc;
				var VTNData = arrData[i].OffredVehicle.Offered_Vtn;
				var VINData = arrData[i].OffredVehicle.VIN;
				var APXData = arrData[i].OffredVehicle.APX;
				}

				// arrData[i].Model = arrData[i].Model + "-" + arrData[i].Model_Desc;
				// arrData[i].Suffix = arrData[i].Suffix + "-" + arrData[i].Suffix_Desc + "/" + arrData[i].Int_Colour_Desc;
				// arrData[i].Ext_Colour = arrData[i].Ext_Colour + "-" + arrData[i].Ext_Colour_Desc;
				/*	arrData[i].zzsuffix = arrData[i].zzsuffix + "-" + arrData[i].suffix_desc_en;*/
				// var tstatus;
				// switch (arrData[i].Trade_Status) {
				// case "A":
				// 	tstatus = "Accepted";
				// 	break;
				// case "C":
				// 	tstatus = "Countered";
				// 	break;
				// case "X": //Update this
				// 	tstatus = "Canceled";
				// 	break;
				// case "R": //Update this
				// 	tstatus = "Rejected";
				// 	break;
				// case "S": //Update this
				// 	tstatus = "Sent";
				// 	break;
				// case "F": //Update this
				// 	tstatus = "Failed";
				// 	break;

				// }
				// var dateformated = this.formatoDate(arrData[i].Changed_on);

				// var dateformated = this.TradeSummaryoDateTradeHistory(arrData[i].Changed_on);

				var dateAsReceived = moment.tz((arrData[i].Changed_on), "GMT");
				var dateformated = moment(dateAsReceived).format("YYYY-MM-DD");

				row += '="' + arrData[i].Trade_Id + '",="' + RequestingDealerVisible + '",="' + VTNData + '",="' + VINData + '",="' + DelearData + '",="' + ModelData + '","' + SuffixData +
				
					'","' + Ext_Colour_Data + 
					'",="' + APXData +
					'",="' + dateformated + '",';
				//}
				row.slice(1, row.length);
				CSV += row + '\r\n';
			}
			
			// if (Context1.length == 0) {
			// 	sap.m.MessageBox.warning("No data is available to export");
			// 	return;
			// } else {
				var items1 = Context1.map(function (oEvent) {
					return oEvent.getObject();
				});
				// this.JSONToCSVConvertor(this.tableData, "ExportGreen", true);
			
			var arrData = typeof items1 != 'object' ? JSON.parse(items1) : items1;
		

		

			//loop is to extract each row
			for (var i = 0; i < arrData.length; i++) {
				var row = "";
				var RequestingDealerVisible = i18n.getText("TradeOut");
				if (arrData[i].RequestingDealerVisible == true) {
					// var RequestingDealerVisible = i18n.getText("TradeOut");
					var SelectedDealer = arrData[i].Requested_Dealer;
					var SelectedDealerName = arrData[i].Requested_Dealer_Name;
					var DelearData = SelectedDealer + "-" + SelectedDealerName;
var ModelData = arrData[i].OffredVehicle.Model + "-" + arrData[i].OffredVehicle.Model_Desc;
				var SuffixData = arrData[i].OffredVehicle.Suffix + "-" + arrData[i].OffredVehicle.Suffix_Desc + "/" + arrData[i].OffredVehicle.Int_Colour_Desc;
				var Ext_Colour_Data = arrData[i].OffredVehicle.Ext_Colour + "-" + arrData[i].OffredVehicle.Ext_Colour_Desc;
				var VTNData = arrData[i].OffredVehicle.Offered_Vtn;
				var VINData = arrData[i].OffredVehicle.VIN;
				var APXData = arrData[i].OffredVehicle.APX;
				} else {
					

					var SelectedDealer = arrData[i].Requesting_Dealer;
					var SelectedDealerName = arrData[i].Requesting_Dealer_Name;
					var DelearData = SelectedDealer + "-" + SelectedDealerName;
						var ModelData = arrData[i].Model + "-" + arrData[i].Model_Desc;
				var SuffixData = arrData[i].Suffix + "-" + arrData[i].Suffix_Desc + "/" + arrData[i].Int_Colour_Desc;
				var Ext_Colour_Data = arrData[i].Ext_Colour + "-" + arrData[i].Ext_Colour_Desc;
				var VTNData = arrData[i].Requested_Vtn;
				var VINData = arrData[i].VIN;
				var APXData = arrData[i].APX;
				}

				// arrData[i].Model = arrData[i].Model + "-" + arrData[i].Model_Desc;
				// arrData[i].Suffix = arrData[i].Suffix + "-" + arrData[i].Suffix_Desc + "/" + arrData[i].Int_Colour_Desc;
				// arrData[i].Ext_Colour = arrData[i].Ext_Colour + "-" + arrData[i].Ext_Colour_Desc;
				/*	arrData[i].zzsuffix = arrData[i].zzsuffix + "-" + arrData[i].suffix_desc_en;*/
				// var tstatus;
				// switch (arrData[i].Trade_Status) {
				// case "A":
				// 	tstatus = "Accepted";
				// 	break;
				// case "C":
				// 	tstatus = "Countered";
				// 	break;
				// case "X": //Update this
				// 	tstatus = "Canceled";
				// 	break;
				// case "R": //Update this
				// 	tstatus = "Rejected";
				// 	break;
				// case "S": //Update this
				// 	tstatus = "Sent";
				// 	break;
				// case "F": //Update this
				// 	tstatus = "Failed";
				// 	break;

				// }
				// var dateformated = this.formatoDate(arrData[i].Changed_on);

				// var dateformated = this.TradeSummaryoDateTradeHistory(arrData[i].Changed_on);

				var dateAsReceived = moment.tz((arrData[i].Changed_on), "GMT");
				var dateformated = moment(dateAsReceived).format("YYYY-MM-DD");

					row += '="' + arrData[i].Trade_Id + '",="' + RequestingDealerVisible + '",="' + VTNData + '",="' + VINData + '",="' + DelearData + '",="' + ModelData + '","' + SuffixData +
				
					'","' + Ext_Colour_Data + 
					'",="' + APXData +
					'",="' + dateformated + '",';
				//}
				row.slice(1, row.length);
				CSV += row + '\r\n';
			}
			}
			if (CSV == "") {
				/*	alert("Invalid data");*/
				return;
			}
			var fileName = "VehicleTradeHistory";
			fileName += ReportTitle.replace(/ /g, "_");
			// Initialize file format you want csv or xls

			var blob = new Blob(["\ufeff" + CSV], {
				type: "text/csv;charset=utf-8,"
			});
			if (sap.ui.Device.browser.name === "ie" || sap.ui.Device.browser.name === "ed") { // IE 10+ , Edge (IE 12+)
				navigator.msSaveBlob(blob, "VehicleTradeReport.csv");
			} else {
				var uri = 'data:text/csv;charset=utf-8,' + "\ufeff" + encodeURIComponent(CSV); //'data:application/vnd.ms-excel,' + escape(CSV);
				var link = document.createElement("a");

				link.href = uri;
				link.style = "visibility:hidden";
				link.download = fileName + ".csv";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}

		},
		oTradeHistoryLinkPress: function (oEvent) {

			var that = this;

			that.oRecTableSelectObj = oEvent.getSource().getBindingContext().getObject();
		 var trade_type=oEvent.getSource().getParent().mAggregations.cells[9].mProperties.text;
		 that.oRecTableSelectObj.trade_type = trade_type;
			if (that.oRecTableSelectObj != undefined) {

				var model = new sap.ui.model.json.JSONModel(that.oRecTableSelectObj);
				model.setSizeLimit(1000);
				sap.ui.getCore().setModel(model, "TradeRequestedHistory");

				this.getRouter().navTo("VehcTrad_Apprv_Rej_CounTrad", {
					selectedmyTr: "SelectedFromTradeHistory"
				});
				that.oRecTableSelectObj = undefined;
			} else {
				sap.m.MessageBox.warning("Please select the trade");
				that.oRecTableSelectObj = undefined;
			}

		},

		VehicleLocSearchPressVH: function () {
			var that = this;
			that.getRouter().navTo("VehicleLocSearch");
		},
		TradeSummaryLinkPressTH: function () {
			// var that = this;
			// that.getRouter().navTo("VehicleTrade_Summary"){

			// };
			var that = this;
			that.getRouter().navTo("VehicleTrade_Summary", {
				DataClicked: "Yes"
			});

		},
		BlockSummarypressTH: function () {
			var that = this;
			that.getRouter().navTo("VehicleTrade_ModelBlock_Summary");

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
		formatoDate: function (Created_On) {
			if (Created_On != null && Created_On != "" && Created_On != "/Date(0)/") {
				var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd"
				});
				return zdateFormat.format(Created_On);

			} else {
				return "";
			}
		},
		handleSortButtonPressed: function () {
			this.createViewSettingsDialog("vehicleLocator.fragment.TradeHistorySortDialog").open();

		},
		handleSortButtonPressed1: function () {
			this.createViewSettingsDialog("vehicleLocator.fragment.TradeHistorySortDialog1").open();

		},
		createViewSettingsDialog: function (sDialogFragmentName) {
			var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;

				if (Device.system.desktop) {
					oDialog.addStyleClass("sapUiSizeCompact");
				}
			}

			this.getView().addDependent(oDialog); //GSR
			return oDialog;
		},
		handleSortDialogConfirm: function (oEvent) {
			var oTable = this.byId("tableVTH"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
			oBinding.refresh();
		},
	handleSortDialogConfirm1: function (oEvent) {
			var oTable = this.byId("tableVTH1"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
			oBinding.refresh();
		},
		onBusinessPartnerSelected: function (oEvent) {

			var sSelectedDealer = oEvent.getParameter("\selectedItem").getProperty("key");
			var sSelectedDealerText = oEvent.getParameter("\selectedItem").getProperty("additionalText");
			var sSelectedText = oEvent.getParameter("\selectedItem").getProperty("text");

			this.theFirstDefaultDealerSelected = sSelectedDealer;
			this._oViewModel.setProperty("/DealerName", sSelectedDealerText);
			// call the function to get the relevant data to screen again. 
			this.VehicleHistory_Summary();

		},
		onLiveChangeTradeHistory: function (oEvent) {
			this.sSearchQuery = oEvent.getSource().getValue();
			this.fnApplyFiltersAndOrderingForVehicleTrade();
		},
		fnApplyFiltersAndOrderingForVehicleTrade: function (oEvent) {
			var aFilters = [];
	
			// based on the status that is presnet in the screen apply one more filter. 
		

			if (this.sSearchQuery) {
				var oFilter = new Filter([
					new Filter("Trade_Id", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Requesting_Dealer", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Requested_Dealer", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Requested_Dealer_Name", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Requesting_Dealer_Name", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Requested_Vtn", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Model", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Model_Desc", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Suffix", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Suffix_Desc", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Int_Colour_Desc", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Ext_Colour", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Ext_Colour_Desc", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("APX", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
				], false);

				

				var aFilters = new sap.ui.model.Filter([oFilter], true);

				// aFilters.push(oFilter);
			}

			// based on the status field			

			this.byId("tableVTH")
				.getBinding("items")
				.filter(aFilters);
				
		},
			onLiveChangeTradeHistory1: function (oEvent) {
			this.sSearchQuery = oEvent.getSource().getValue();
			this.fnApplyFiltersAndOrderingForVehicleTrade1();
		},
			fnApplyFiltersAndOrderingForVehicleTrade1: function (oEvent) {
			var aFilters = [];
	
			// based on the status that is presnet in the screen apply one more filter. 
		

			if (this.sSearchQuery) {
				var oFilter = new Filter([
					new Filter("Trade_Id", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Requesting_Dealer", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Requested_Dealer", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Requested_Dealer_Name", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Requesting_Dealer_Name", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Requested_Vtn", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Model", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Model_Desc", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Suffix", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Suffix_Desc", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Int_Colour_Desc", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Ext_Colour", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("Ext_Colour_Desc", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("APX", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
				], false);

				

				aFilters = new sap.ui.model.Filter([oFilter], true);

				// aFilters.push(oFilter);
			}

			// based on the status field			

			this.byId("tableVTH1")
				.getBinding("items")
				.filter(aFilters);
				
		}

	});

});