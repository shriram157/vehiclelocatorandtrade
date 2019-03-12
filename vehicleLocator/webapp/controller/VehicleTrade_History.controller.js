sap.ui.define([
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageBox',
	"sap/ui/core/routing/History",
	"vehicleLocator/Formatter/Formatter",

], function (BaseController, JSONModel, ResourceModel, MessageBox, History, Formatter) {
	"use strict";
	var TableData;
	return BaseController.extend("vehicleLocator.controller.VehicleTrade_History", {

		onInit: function () {
			var _that = this;
			//Global date format
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			_that.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});

			/// set the logo and Language. 

			this._setTheLanguage();

			this._setTheLogo();

			//this.getRouter().attachRouteMatched(this.onRouteMatched, this);
			this.getRouter().getRoute("VehicleTrade_History").attachPatternMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function (oEvent) {
			var dataFrom = oEvent.getParameter("arguments").DataClicked;
			if (dataFrom != undefined) {
				this.VehicleHistory_Summary();

			}
		},

		VehicleHistory_Summary: function () {

			debugger;

			var that = this;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				this.sPrefix = "";

			}
			this.nodeJsUrl = this.sPrefix;
			var Dealer_No = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].DealerCode;
			var lang = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language.slice(0, 1);
			var oModel = new sap.ui.model.odata.ODataModel(this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata", true);

			var Filter0 = new sap.ui.model.Filter('Requesting_Dealer', 'EndsWith', Dealer_No);
			var Filter1 = new sap.ui.model.Filter('Requested_Dealer', 'EndsWith', Dealer_No);
			var Filter2 = new sap.ui.model.Filter('Trade_Status', 'EQ', 'A');
			var Filter = new sap.ui.model.Filter([Filter0, Filter1], false);
			var Filterall = new sap.ui.model.Filter([Filter, Filter2], true);
			oModel.read("/TradeRequest", {
				filters: [Filterall],
				success: function (oData, oResponse) {
					//=====Filter on Vehicles=====================	
					TableData = oData.results;
					for (var i = 0; i < oData.results.length; i++) {
						if (oData.results[i].Requesting_Dealer.slice(-5) == Dealer_No) {
							TableData[i].RequestingDealerVisible = true;
						} else {
							TableData[i].RequestingDealerVisible = false;
						}
						oModel.read("/TradeVehicles", {
							filters: [new sap.ui.model.Filter('Trade_Id.Trade_Id', 'EQ', oData.results[i].Trade_Id)],
							async: false,
							success: function (oData1, oResponse1) {
								for (var x = 0; x < oData1.results.length; x++) {
									if (oData.results[i].Requested_Vtn == oData1.results[x].VTN) {
										TableData[i].Model_Year = oData1.results[x].Model_Year;
										TableData[i].Model = oData1.results[x].Model;
										TableData[i].Series = oData1.results[x].Series;
										TableData[i].Suffix = oData1.results[x].Suffix;
										TableData[i].Colour = oData1.results[x].Int_Colour;
										TableData[i].Ext_Colour = oData1.results[x].Ext_Colour;
										TableData[i].APX = oData1.results[x].APX;
										oModel.read("/TradeVehicleDesc", {
											filters: [new sap.ui.model.Filter([new sap.ui.model.Filter('Trade_Id.Trade_Id', 'EQ', oData.results[i].Trade_Id),
												new sap.ui.model.Filter('VTN.VTN', 'EQ', oData1.results[x].VTN),
												new sap.ui.model.Filter('SPRAS', 'EQ', lang)
											], true)],
											async: false,
											success: function (oData2, oResponse1) {
												TableData[i].Model_Desc = oData2.results[0].Model_Desc;
												TableData[i].Series_Desc = oData2.results[0].Series_Desc;
												TableData[i].Suffix_Desc = oData2.results[0].Suffix_Desc;
												TableData[i].Colour = oData2.results[0].Int_Colour;
												TableData[i].Ext_Colour_Desc = oData2.results[0].Ext_Colour_Desc;
											},
											error: function (e) {

											}
										});
									} else if (oData.results[i].Offered_Vtn == oData1.results[x].VTN) {
										TableData[i].OffredVehicle = {};
										TableData[i].OffredVehicle.Model_Year = oData1.results[x].Model_Year;
										TableData[i].OffredVehicle.Model = oData1.results[x].Model;
										TableData[i].OffredVehicle.Series = oData1.results[x].Series;
										TableData[i].OffredVehicle.Suffix = oData1.results[x].Suffix;
										TableData[i].OffredVehicle.Colour = oData1.results[x].Int_Colour;
										TableData[i].OffredVehicle.Ext_Colour = oData1.results[x].Ext_Colour;
										TableData[i].OffredVehicle.APX = oData1.results[x].APX;
										oModel.read("/TradeVehicleDesc", {
											filters: [new sap.ui.model.Filter([new sap.ui.model.Filter('Trade_Id.Trade_Id', 'EQ', oData.results[i].Trade_Id),
												new sap.ui.model.Filter('VTN.VTN', 'EQ', oData1.results[x].VTN),
												new sap.ui.model.Filter('SPRAS', 'EQ', lang)
											], true)],
											async: false,
											success: function (oData2, oResponse1) {
												TableData[i].OffredVehicle.Model_Desc = oData2.results[0].Model_Desc;
												TableData[i].OffredVehicle.Series_Desc = oData2.results[0].Series_Desc;
												TableData[i].OffredVehicle.Suffix_Desc = oData2.results[0].Suffix_Desc;
												TableData[i].OffredVehicle.Colour = oData2.results[0].Int_Colour;
												TableData[i].OffredVehicle.Ext_Colour_Desc = oData2.results[0].Ext_Colour_Desc;
											},
											error: function (e) {

											}
										});
									}
								}
							},
							error: function (e1) {}
						});
					}
					var model = new sap.ui.model.json.JSONModel(TableData);
					model.setSizeLimit(1000);
					that.getView().byId("tableVTH").setModel(model);
				},
				error: function (e) {

				}
			});
			//==============================================================================================================
			// that.TradeRequestoDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeRequest";
			// var ajax1 = $.ajax({
			// 	dataType: "json",
			// 	xhrFields: //
			// 	{
			// 		withCredentials: true
			// 	},

			// 	url: that.TradeRequestoDataUrl,
			// 	async: true,
			// 	success: function (result) {}
			// });
			// that.TradeVehiclesDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeVehicles";

			// var ajax2 = $.ajax({
			// 	dataType: "json",
			// 	xhrFields: //
			// 	{
			// 		withCredentials: true
			// 	},
			// 	url: that.TradeVehiclesDataUrl,
			// 	async: true,
			// 	success: function (result) {}
			// });
			// that.oTradeVehicleDescDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeVehicleDesc";
			// /*	var oTradeVehicleDesc = that.oDataUrl + "/TradeVehicleDesc";*/
			// var ajax3 = $.ajax({
			// 	dataType: "json",
			// 	xhrFields: //
			// 	{
			// 		withCredentials: true
			// 	},
			// 	url: that.oTradeVehicleDescDataUrl,
			// 	async: true,
			// 	success: function (result) {}
			// });

			// /*	sap.ui.core.BusyIndicator.show();*/
			// var that = this;
			// $.when(ajax1, ajax2, ajax3).done(function (TradeRequest, TradeVehicles, oTradeVehicleDesc) {

			// 	var TradeRequest = TradeRequest[0].d.results;
			// 	//	var TradeRequestModel = new sap.ui.model.json.JSONModel(TradeRequest);
			// 	//	sap.ui.getCore().setModel(TradeRequestModel, "TradeRequestModel");

			// 	var TradeVehicles = TradeVehicles[0].d.results;
			// 	//	var TradeVehiclesModel = new sap.ui.model.json.JSONModel(TradeVehicles);
			// 	//	sap.ui.getCore().setModel(TradeVehiclesModel, "TradeVehiclesModel");

			// 	var oTradeVehicleDesc = oTradeVehicleDesc[0].d.results;
			// 	//	var oTradeVehicleDescModel = new sap.ui.model.json.JSONModel(oTradeVehicleDesc);
			// 	//	sap.ui.getCore().setModel(oTradeVehicleDescModel, "oTradeVehicleDescModel");
			// 	//	var filtered = [];
			// 	for (var i = 0; i < TradeRequest.length; i++) {
			// 		for (var j = 0; j < TradeVehicles.length; j++) {
			// 			if (TradeRequest[i].Trade_Id == TradeVehicles[j]["Trade_Id.Trade_Id"]) {

			// 				TradeRequest[i].APX = TradeVehicles[j].APX;
			// 				TradeRequest[i].DNC = TradeVehicles[j].DNC;
			// 				TradeRequest[i].Ext_Colour = TradeVehicles[j].Ext_Colour;
			// 				TradeRequest[i].Int_Colour = TradeVehicles[j].Int_Colour;
			// 				TradeRequest[i].Model = TradeVehicles[j].Model;
			// 				TradeRequest[i].Model_Year = TradeVehicles[j].Model_Year;
			// 				TradeRequest[i].Order_Type = TradeVehicles[j].Order_Type;
			// 				TradeRequest[i].Series = TradeVehicles[j].Series;
			// 				TradeRequest[i].Status = TradeVehicles[j].Status;
			// 				TradeRequest[i].Suffix = TradeVehicles[j].Suffix;
			// 				TradeRequest[i]["Trade_Id.Trade_Id"] = TradeVehicles[j]["Trade_Id.Trade_Id"];
			// 				TradeRequest[i].VTN = TradeVehicles[j].VTN;

			// 			}

			// 		}

			// 	}
			// 	var filtered = TradeRequest;
			// 	/*	var Spars = "E";*/
			// 	var Spars = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language.slice(0, 1);
			// 	var finalArray = [];
			// 	for (var k = 0; k < filtered.length; k++) {
			// 		for (var l = 0; l < oTradeVehicleDesc.length; l++) {
			// 			if (filtered[k].Trade_Id == oTradeVehicleDesc[l]["Trade_Id.Trade_Id"] && filtered[k].VTN == oTradeVehicleDesc[l]["VTN.VTN"] &&
			// 				oTradeVehicleDesc[l].SPRAS == Spars) {
			// 				filtered[k].Ext_Colour_Desc = oTradeVehicleDesc[l].Ext_Colour_Desc;
			// 				filtered[k].Int_Colour_Desc = oTradeVehicleDesc[l].Int_Colour_Desc;
			// 				filtered[k].Model_Desc = oTradeVehicleDesc[l].Model_Desc;
			// 				filtered[k].SPRAS = oTradeVehicleDesc[l].SPRAS;
			// 				filtered[k].Series_Desc = oTradeVehicleDesc[l].Series_Desc;
			// 				filtered[k].Suffix_Desc = oTradeVehicleDesc[l].Suffix_Desc;

			// 			}

			// 		}
			// 	}

			// 	/*	var AllFilterderData=[];*/
			// 	for (var n = 0; n < filtered.length; n++) {
			// 		if ("APX" in filtered[n]) {
			// 			filtered[n].APX = filtered[n].APX;
			// 		} else {
			// 			filtered[n].APX = "";
			// 		}

			// 		if ("DNC" in filtered[n]) {
			// 			filtered[n].DNC = filtered[n].DNC;
			// 		} else {
			// 			filtered[n].DNC = "";
			// 		}

			// 		if ("Ext_Colour" in filtered[n]) {
			// 			filtered[n].Ext_Colour = filtered[n].Ext_Colour;
			// 		} else {
			// 			filtered[n].Ext_Colour = "";
			// 		}

			// 		if ("Int_Colour" in filtered[n]) {
			// 			filtered[n].Int_Colour = filtered[n].Int_Colour;
			// 		} else {
			// 			filtered[n].Int_Colour = "";
			// 		}

			// 		if ("Model" in filtered[n]) {
			// 			filtered[n].Model = filtered[n].Model;
			// 		} else {
			// 			filtered[n].Model = "";
			// 		}

			// 		if ("Model_Year" in filtered[n]) {
			// 			filtered[n].Model_Year = filtered[n].Model_Year;
			// 		} else {
			// 			filtered[n].Model_Year = "";
			// 		}

			// 		if ("Order_Type" in filtered[n]) {
			// 			filtered[n].Order_Type = filtered[n].Order_Type;
			// 		} else {
			// 			filtered[n].Order_Type = "";
			// 		}

			// 		if ("Series" in filtered[n]) {
			// 			filtered[n].Series = filtered[n].Series;
			// 		} else {
			// 			filtered[n].Series = "";
			// 		}

			// 		if ("Status" in filtered[n]) {
			// 			filtered[n].Status = filtered[n].Status;
			// 		} else {
			// 			filtered[n].Status = "";
			// 		}

			// 		if ("Suffix" in filtered[n]) {
			// 			filtered[n].Suffix = filtered[n].Suffix;
			// 		} else {
			// 			filtered[n].Suffix = "";
			// 		}

			// 		if ("Trade_Id.Trade_Id" in filtered[n]) {
			// 			filtered[n]["Trade_Id.Trade_Id"] = filtered[n]["Trade_Id.Trade_Id"];
			// 		} else {
			// 			filtered[n]["Trade_Id.Trade_Id"] = "";
			// 		}

			// 		if ("VTN" in filtered[n]) {
			// 			filtered[n].VTN = filtered[n].VTN;
			// 		} else {
			// 			filtered[n].VTN = "";
			// 		}

			// 		if ("Ext_Colour_Desc" in filtered[n]) {
			// 			filtered[n].Ext_Colour_Desc = filtered[n].Ext_Colour_Desc;
			// 		} else {
			// 			filtered[n].Ext_Colour_Desc = "";
			// 		}

			// 		if ("Int_Colour_Desc" in filtered[n]) {
			// 			filtered[n].Int_Colour_Desc = filtered[n].Int_Colour_Desc;
			// 		} else {
			// 			filtered[n].Int_Colour_Desc = "";
			// 		}

			// 		if ("Model_Desc" in filtered[n]) {
			// 			filtered[n].Model_Desc = filtered[n].Model_Desc;
			// 		} else {
			// 			filtered[n].Model_Desc = "";
			// 		}

			// 		if ("SPRAS" in filtered[n]) {
			// 			filtered[n].SPRAS = filtered[n].SPRAS;
			// 		} else {
			// 			filtered[n].SPRAS = "";
			// 		}

			// 		if ("Series_Desc" in filtered[n]) {
			// 			filtered[n].Series_Desc = filtered[n].Series_Desc;
			// 		} else {
			// 			filtered[n].Series_Desc = "";
			// 		}

			// 		if ("Suffix_Desc" in filtered[n]) {
			// 			filtered[n].Suffix_Desc = filtered[n].Suffix_Desc;
			// 		} else {
			// 			filtered[n].Suffix_Desc = "";
			// 		}

			// 	}

			// 	//	var oModel = new sap.ui.model.json.JSONModel(filtered);
			// 	//	sap.ui.getCore().setModel(oModel, "oVehicleTrade_Summary");
			// 	//	console(finalArray);
			// 	//	if (sap.ui.getCore().getModel("oVehicleTrade_Summary") != undefined) {
			// 	/*	var Dealer = sap.ui.getCore().LoginDetails.DealerCode;*/
			// 	var userAttributesModellen = sap.ui.getCore().getModel("LoginuserAttributesModel").getData();
			// 	/*var Dealer=userAttributesModellen[0].DealerCode[0];*/
			// 	var Dealer = userAttributesModellen[0].DealerCode; // Security login dealer

			// 	if (Dealer.length == 10) {
			// 		Dealer = Dealer.slice(-5);
			// 	}
			// 	/*var RequesttingDealer1 = filtered.filter(function (x) {
			// 		return (x.Requesting_Dealer != null ||x.Requested_Dealer != null) ;
			// 	});*/
			// 	var RequesttingDealer1 = filtered.filter(function (x) {
			// 		return (x.Requesting_Dealer != null && x.Requested_Dealer != null);
			// 	});
			// 	var RequDealerAccept = RequesttingDealer1.filter(function (x) {
			// 		return ((x.Requesting_Dealer.slice(-5) == Dealer || x.Requested_Dealer.slice(-5) == Dealer) && x.Trade_Status == "A");
			// 	});
			// 	for (var i = 0; i < RequDealerAccept.length; i++) {
			// 		if (RequDealerAccept[i].Requesting_Dealer.slice(-5) == Dealer) {
			// 			RequDealerAccept[i].RequestingDealerVisible = true;
			// 		} else {
			// 			RequDealerAccept[i].RequestingDealerVisible = false;
			// 		}

			// 	}
			// 	//testing
			// 	var model = new sap.ui.model.json.JSONModel(RequDealerAccept);
			// 	model.setSizeLimit(1000);
			// 	that.getView().byId("tableVTH").setModel(model);

			// });

		},
		ExporttoExcellsheet: function () {

			var Context = this.getView().byId("tableVTH").getBinding("rows").getContexts();
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
			var zthat = this;
			var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			var CSV = "";
			if (ShowLabel) {
				var row = "";
				row = row.slice(0, -1);
			}

			var i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
			var RequestNo = i18n.getText("RequestNo");
			var Status = i18n.getText("Status");
			var From_To = i18n.getText("From_To");
			var Dealer = i18n.getText("Dealer");
			var VehicleTrackingNumber = i18n.getText("VehicleTrackingNumber");
			var Model = i18n.getText("Model");
			var Suffix = i18n.getText("Suffix");
			var APX = i18n.getText("APX");
			var ExteriorColor = i18n.getText("ExteriorColor");
			var Accepted = i18n.getText("Accepted");

			row += RequestNo + ",";
			row += Status + ",";
			row += From_To + ",";
			row += Dealer + ",";
			row += VehicleTrackingNumber + ",";
			row += Model + ",";
			row += Suffix + ",";
			row += APX + ",";
			row += ExteriorColor + ",";
			row += Accepted + ",";

			CSV += row + '\r\n';

			//loop is to extract each row
			for (var i = 0; i < arrData.length; i++) {
				var row = "";
				// if(arrData[i].DoctypeText == "Credit Note" ) {
				// 	arrData[i].Amount = "-"+arrData[i].Amount;
				// }
				// else if(arrData[i].DoctypeText == "Invoice" ) {
				// 	arrData[i].Amount;
				// }
				/*	arrData[i].Amount = arrData[i].Amount + " " + arrData[i].Currency;
					if (arrData[i].PaymentDate != null) arrData[i].PaymentDate = arrData[i].PaymentDate.split("T")[0];
					else arrData[i].PaymentDate;
					if (arrData[i].DueDate != null) arrData[i].DueDate = arrData[i].DueDate.split("T")[0];
					else arrData[i].DueDate;
					if (arrData[i].DocumentDate != null) arrData[i].DocumentDate = arrData[i].DocumentDate.split("T")[0];
					else arrData[i].DocumentDate;
					if (arrData[i].WhtCertDate != null) arrData[i].WhtCertDate = arrData[i].WhtCertDate.split("T")[0];
					else arrData[i].PaymentDate;*/
				if (arrData[i].RequestingDealerVisible == true) {
						var RequestingDealerVisible = "To";
					var SelectedDealer = arrData[i].Requested_Dealer;
					var SelectedDealerName = arrData[i].Requested_Dealer_Name;
					var DelearData = SelectedDealer + "-" + SelectedDealerName;
				
				} else {
					var RequestingDealerVisible = "From";

					var SelectedDealer = arrData[i].Requesting_Dealer;
					var SelectedDealerName = arrData[i].Requesting_Dealer_Name;
					var DelearData = SelectedDealer + "-" + SelectedDealerName;
				}

				arrData[i].Model = arrData[i].Model + "-" + arrData[i].Model_Desc;
				arrData[i].Suffix = arrData[i].Suffix + "-" + arrData[i].Suffix_Desc + "/" + arrData[i].Int_Colour_Desc;
				arrData[i].Ext_Colour = arrData[i].Ext_Colour + "-" + arrData[i].Ext_Colour_Desc;
				/*	arrData[i].zzsuffix = arrData[i].zzsuffix + "-" + arrData[i].suffix_desc_en;*/
				var tstatus;
				switch (arrData[i].Trade_Status) {
				case "A":
					tstatus = "Accepted";
					break;
				case "C":
					tstatus = "Countered";
					break;
				case "X": //Update this
					tstatus = "Canceled";
					break;
				case "R": //Update this
					tstatus = "Rejected";
					break;
				case "S": //Update this
					tstatus = "Sent";
					break;
				case "F": //Update this
					tstatus = "Failed";
					break;

				}
				var dateformated = this.formatoDate(arrData[i].Changed_on);
				row += '="' + arrData[i].Trade_Id + '","' + tstatus + '","' + RequestingDealerVisible +
					'",="' + DelearData + '",="' + arrData[i].Requested_Vtn + '",="' + arrData[i].Model + '","' + arrData[i].Suffix +
					'","' + arrData[i].APX +
					'","' + arrData[i].Ext_Colour + '","' + dateformated + '",';
				//}
				row.slice(1, row.length);
				CSV += row + '\r\n';
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
			/*	that.oRecTable = that.getView().byId("table1Rts");*/
			that.oRecTableSelectObj = oEvent.getSource().getBindingContext().getObject();

			if (that.oRecTableSelectObj != undefined) {

				//	var SelectedPath = oEvent.getSource().getParent().oBindingContexts.getPath().split("/")[1];
				// that.oRecTableSelectObj.FromRequesting=false;
				var model = new sap.ui.model.json.JSONModel(that.oRecTableSelectObj);
				model.setSizeLimit(1000);
				sap.ui.getCore().setModel(model, "TradeRequestedHistory");
				//	if(sap.ui.getCore().getModel("MyTradeRequestSelected")!=undefined){
				//	sap.ui.getCore().setModel(null,"MyTradeRequestSelected");
				//	}
				this.getRouter().navTo("VehcTrad_Apprv_Rej_CounTrad", {
					selectedmyTr: "SelectedFromTradeHistory"
				});
				that.oRecTableSelectObj = undefined;
			} else {
				sap.m.MessageBox.warning("Please select the trade");
				that.oRecTableSelectObj = undefined;
			}

			/*if(that.oRecTableSelectObj!=){
				
			}else{
				
			}*/

		},

		VehicleLocSearchPressVH: function () {
			var that = this;
			that.getRouter().navTo("VehicleLocSearch");
		},
		TradeSummaryLinkPressTH: function () {
			var that = this;
			that.getRouter().navTo("VehicleTrade_Summary");

		},
		BlockSummarypressTH: function () {
			var that = this;
			that.getRouter().navTo("VehicleTrade_ModelBlock_Summary");

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
				// set the right image for logo	 - french		
				/*				var currentImageSource = this.getView().byId("idLexusLogo");
								currentImageSource.setProperty("src", "images/Lexus_FR.png");*/

			} else {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")

				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';
				// set the right image for logo			
				/*				var currentImageSource = this.getView().byId("idLexusLogo");
								currentImageSource.setProperty("src", "images/Lexus_EN.png");*/

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
			return zdateFormat.format(Created_On)

			} else {
				return "";
			}
		},

	});
});