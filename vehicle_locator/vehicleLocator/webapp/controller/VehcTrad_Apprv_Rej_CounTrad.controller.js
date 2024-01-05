var local;
sap.ui.define([
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageBox',
	"sap/ui/core/routing/History",
	"vehicleLocator/Formatter/Formatter",
	'sap/m/MessageToast',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Text'
], function (BaseController, JSONModel, ResourceModel, MessageBox, History, Formatter, MessageToast, Button, Dialog, Text) {
	"use strict";
	var oController, sCurrentLocaleD;
	return BaseController.extend("vehicleLocator.controller.VehcTrad_Apprv_Rej_CounTrad", {
		onInit: function () {
			var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
			var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
			// this.LoggedInDealer=LoggedInDealer;
			this.getView().byId("oDealerCode5").setText(LoggedInDealerCode2);
			this.getView().byId("oDealerAprvRejCntoffr").setText(LoggedInDealer);
			var _that = this;
			oController = this;

			this._oViewModel = new sap.ui.model.json.JSONModel({
				visibleForZoneUser: false,
				showOrderType: true,
				// showVinDiplayOff:true
			});

			this.getView().setModel(this._oViewModel, "detailView");
			/// set the logo and Language. 
			//  set the model on DNC days combobox Model

			this.idCb = this.byId("VT_ARCDnc"); ///VT_ARCDnc
			this.bindCombo();

			this._setTheLanguage();

			this._setTheLogo();

			this.getRouter().getRoute("VehcTrad_Apprv_Rej_CounTrad").attachPatternMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function (oEvent) {
			//trial comment for push
			// var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
			// this.LoggedInDealer=LoggedInDealer;
			this.getView().byId("oComments").setValue(""); //1803

			if (oEvent.getParameter("arguments").selectedmyTr != undefined) {
				this.oSelectedItems = oEvent.getParameter("arguments").selectedmyTr;
			}
			// on screen refresh disable the buttons. 
			if (sap.ui.getCore().getModel("MyTradeRequestSelected") == undefined &&
				sap.ui.getCore().getModel("MyTradeRequested") == undefined) {
				this.getView().byId("oAddbutton").setEnabled(false);
				this.getView().byId("oacceptbtn").setVisible(false);
				this.getView().byId("oRejectbtn").setVisible(false);
				this.getView().byId("oCounterofrbtn").setVisible(false);
				this.getView().byId("oCancelbtn").setVisible(false);
				this.getView().byId("oUpdatebtn").setVisible(false);
				this.getView().byId("oBackbtnid").setEnabled(true);
				this.getView().byId("oBackbtnid").setVisible(true);
				this.getView().byId("oComments").setEnabled(false);
			}

			var that = this;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			var sPrefix = "";
			if (sLocation_conf == 0) {
				sPrefix = "/vehicleLocatorNode"; // the destination

			}

			var nodeJsUrl = sPrefix + "/node";

			var oDataUrl = nodeJsUrl + "/Z_VEHICLE_MASTER_SRV";
			var oDataModel = new sap.ui.model.odata.ODataModel(oDataUrl, true);

			// local =this;

			// local.oViewModel = new sap.ui.model.json.JSONModel({
			//             busy: false,
			//             delay: 0,
			//             additionalComments: ""
			//         });
			//         local.getView().setModel(local.oViewModel, "LocalTradeModel");

			/* SelectedPath	*/
			this.getView().byId("ctetid1").setVisible(false);
			this.getView().byId("txtlab1").setVisible(false);
			this.getView().byId("prpetid1").setVisible(false);
			this.getView().byId("otxtlabel1").setVisible(false);
			this.getView().byId("ctqtid1").setVisible(false);
			this.getView().byId("txlab1").setVisible(false);
			this.getView().byId("prptid1").setVisible(false);
			this.getView().byId("otxlabel1").setVisible(false);
			this.getView().byId("ctetid2").setVisible(false);
			this.getView().byId("txtlab2").setVisible(false);
			this.getView().byId("prpetid2").setVisible(false);
			this.getView().byId("otxtlabel2").setVisible(false);
			this.getView().byId("ctqtid2").setVisible(false);
			this.getView().byId("txlab2").setVisible(false);
			this.getView().byId("prptid2").setVisible(false);
			this.getView().byId("otxlabel2").setVisible(false);

			if (that.oSelectedItems != undefined && that.oSelectedItems != "SelectedFromTradeHistory") {
				if (sap.ui.getCore().getModel("MyTradeRequestSelected") != undefined) {
					// this._oViewModel.setProperty("/showVinDiplayOff", true);
					//		this.getView().byId("SimpleFormAproveTrReq").setModel(sap.ui.getCore().getModel("MyTradeRequestSelected"));
					var StatusData = sap.ui.getCore().getModel("MyTradeRequestSelected").getData();

					this._oViewModel.setProperty("/tradeId", StatusData.Trade_Id);
					var AcceptVisible = StatusData.FromRequesting;
					var Status = StatusData.Trade_Status;
					this.dnsStatus = StatusData.Trade_Status;
					var TradeId = StatusData.Trade_Id;
					this.VehicleTrade_SummaryData(StatusData);
					this._oViewModel.setProperty("/showVinDiplayOff", false);
					this._oViewModel.setProperty("/showVinDisplayOffInbound", false);
					this.getView().setModel(this._oViewModel, "detailView");
					this.getView().getModel("detailView").refresh(true);
					var bool = false,
						bool1 = false;
					if (StatusData.Requested_Vtn == null || StatusData.Requested_Vtn == "") {
						bool = true;
					}
					if (StatusData.Offered_Vtn == "" || StatusData.Offered_Vtn == null) {
						bool1 = true;
					}
					if (bool && StatusData.Trade_Return == "N") {
						this.getView().byId("ctetid1").setVisible(true);
						this.getView().byId("txtlab1").setVisible(true);
						this.getView().byId("prpetid1").setVisible(true);
						this.getView().byId("otxtlabel1").setVisible(true);
						this.getView().byId("ctetid").setVisible(false);
						this.getView().byId("txtlab").setVisible(false);
						this.getView().byId("prpetid").setVisible(false);
						this.getView().byId("otxtlabel").setVisible(false);
					} else if (!bool && StatusData.Trade_Return == "Y") {
						this.getView().byId("ctetid1").setVisible(false);
						this.getView().byId("txtlab1").setVisible(false);
						this.getView().byId("prpetid1").setVisible(false);
						this.getView().byId("otxtlabel1").setVisible(false);
						this.getView().byId("ctetid").setVisible(true);
						this.getView().byId("txtlab").setVisible(true);
						this.getView().byId("prpetid").setVisible(true);
						this.getView().byId("otxtlabel").setVisible(true);

					}
					//  for the DNC = Y do not show order type. 
					if (this.dnsStatus == "Y") {

						this._oViewModel.setProperty("/showOrderType", false);

					} else {

						this._oViewModel.setProperty("/showOrderType", true);

					}

					//
					//  for a rejected trade request do not show the VTN on the screen. 
					if (Status == "R") {
						that.getView().byId("ovtnId").setVisible(false);
						that.getView().byId("ovtnIdText").setVisible(false);

					} else {

						that.getView().byId("ovtnId").setVisible(true);
						that.getView().byId("ovtnIdText").setVisible(true);
					}

					if (AcceptVisible == false && (Status == "S")) {
						this.getView().byId("oacceptbtn").setVisible(!AcceptVisible);
						this.getView().byId("oRejectbtn").setVisible(!AcceptVisible);
						// this.getView().byId("oCounterofrbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCancelbtn").setVisible(AcceptVisible);
						this.getView().byId("oUpdatebtn").setVisible(AcceptVisible);
						if (StatusData.Requested_Vtn == null) {
							this.getView().byId("oCounterofrbtn").setVisible(AcceptVisible);
						} else {
							this.getView().byId("oCounterofrbtn").setVisible(!AcceptVisible);

						}
						/*	this.getView().byId("oacceptbtn").setVisible(!AcceptVisible);
							this.getView().byId("oRejectbtn").setVisible(!AcceptVisible);
							this.getView().byId("oCounterofrbtn").setVisible(!AcceptVisible);
							this.getView().byId("oCancelbtn").setVisible(AcceptVisible);
							this.getView().byId("oUpdatebtn").setVisible(AcceptVisible);*/
					} else {

						this.getView().byId("oacceptbtn").setVisible(AcceptVisible);
						this.getView().byId("oRejectbtn").setVisible(AcceptVisible);
						this.getView().byId("oCounterofrbtn").setVisible(AcceptVisible);
						this.getView().byId("oCancelbtn").setVisible(AcceptVisible);

						this.getView().byId("oUpdatebtn").setVisible(AcceptVisible);

						/*	this.getView().byId("oacceptbtn").setVisible(AcceptVisible);
							this.getView().byId("oRejectbtn").setVisible(AcceptVisible);
							this.getView().byId("oCounterofrbtn").setVisible(AcceptVisible);
							this.getView().byId("oCancelbtn").setVisible(!AcceptVisible);
							this.getView().byId("oUpdatebtn").setVisible(!AcceptVisible);*/

						this.getView().byId("oComments").setEnabled(AcceptVisible); //GSR  
						this.getView().byId("oAddbutton").setEnabled(AcceptVisible); //GSR
					}

					var Status = [];
					Status.push(StatusData);
					var oStatusModel = new sap.ui.model.json.JSONModel(Status);
					/*	this.getView().byId("VT_ARCTtrdinStatus").setModel(oStatusModel);*/
					this.getView().byId("VT_ARCTtrdinRet").setModel(oStatusModel);
					/*	this.getView().byId("VT_ARCTDnc").setModel(oStatusModel);*/
					// this.getView().byId("VT_ARCDnc").setModel(oStatusModel);
					var Dnc = StatusData.DNC;
					if ((Dnc == "Y" || Dnc == "X") && (this.dnsStatus != "R")) {
						this.getView().byId("VT_ARCDnc").setVisible(true);
						// var newItem = new sap.ui.core.Item({
						// 	key: "0",
						// 	text: "0"
						// });
						// this.getView().byId("VT_ARCDnc").insertItem(newItem);
						// var newItem = new sap.ui.core.Item({
						// 	key: "10",
						// 	text: "10"
						// });
						// this.getView().byId("VT_ARCDnc").insertItem(newItem);
						// var newItem = new sap.ui.core.Item({
						// 	key: "20",
						// 	text: "20"
						// });
						// this.getView().byId("VT_ARCDnc").insertItem(newItem);						
						// var newItem = new sap.ui.core.Item({
						// 	key: "40",
						// 	text: "40"
						// });
						// this.getView().byId("VT_ARCDnc").insertItem(newItem);						

						this.getView().byId("VT_ARCDnc").setSelectedKey("0");
						this.getView().byId("VT_ARCDnc").setSelectedItem("0");

					} else if (Dnc == "N" || Dnc == "" || Dnc == null) {
						this.getView().byId("VT_ARCDnc").setVisible(false);
						// var newItem = new sap.ui.core.Item({
						// 	key: "",
						// 	text: ""
						// });
						// this.getView().byId("VT_ARCDnc").insertItem(newItem);
						this.getView().byId("VT_ARCDnc").setSelectedKey("");
						this.getView().byId("VT_ARCDnc").setSelectedItem("");
					} else {
						this.getView().byId("VT_ARCDnc").setVisible(false);
						this.getView().byId("VT_ARCDnc").setSelectedKey("");
						this.getView().byId("VT_ARCDnc").setSelectedItem("");
					}

					//	this.getView().byId("SimpleFormAproveTrReq").bindElement("/");

					this.getView().byId("SimpleForrmDisa220").setModel(sap.ui.getCore().getModel("MyTradeRequestSelected"));
					this.getView().byId("SimpleForrmDisa220").bindElement("/");

					var Tradeid = sap.ui.getCore().getModel("MyTradeRequestSelected").getData().Trade_Id;
					this.Tradeid = Tradeid;
					var Add_CommentStatus = sap.ui.getCore().getModel("MyTradeRequestSelected").getData().Trade_Status;
					if (Add_CommentStatus == "C" || Add_CommentStatus == "S") {
						this.getView().byId("oAddbutton").setEnabled(true);
						this.getView().byId("oComments").setEnabled(true);
					} else {
						this.getView().byId("oAddbutton").setEnabled(false);
						this.getView().byId("oComments").setEnabled(false);
					}

					var that = this;
					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");

					if (sLocation_conf == 0) {
						this.sPrefix = "/VehicleLocator_Xsodata";
					} else {
						this.sPrefix = "";

					}

					// do not fetch the entire database and changing this to use a filter. 
					// https://tci-dev-vehiclelocatorandtrade-xsjs.cfapps.us10.hana.ondemand.com/odata/v2/vehicleTrade/Trade_Comment?$filter=Trade_Id%20eq%20%27TR000245%27
					// ttps://tci-dev-vehiclelocatorandtrade-xsjs.cfapps.us10.hana.ondemand.com/odata/v2/vehicleTrade/Trade_Comment?$filter=Trade_Id eq 'TR000245'

					this.nodeJsUrl = this.sPrefix;
					that.oDataUrl = "/odata/v2/vehicleTrade/Trade_Comment?$filter=Trade_Id eq '" + this.Tradeid + "'";

					$.ajax({
						url: that.oDataUrl,
						method: "GET",
						async: false,
						dataType: "json",

						success: function (oData) {

							
							var Data = oData.d.results;
							var Trade_Comment = Data.filter(function (x) {
								return x["Trade_Id"] == Tradeid;
							});
							var oModel = new sap.ui.model.json.JSONModel(Trade_Comment);

							//		that.getView().byId("tableVrade").setModel(oModel);

							that.getView().setModel(oModel, "commentsModel");

						}
					});
				} else if (sap.ui.getCore().getModel("MyTradeRequested") != undefined) {

					//	this.getView().byId("SimpleFormAproveTrReq").setModel(sap.ui.getCore().getModel("MyTradeRequested"));
					var StatusData = sap.ui.getCore().getModel("MyTradeRequested").getData();
					this._oViewModel.setProperty("/tradeId", StatusData.Trade_Id);
					var AcceptVisible = StatusData.FromRequesting;
					var Status = StatusData.Trade_Status;

					if (StatusData.DNC == "Y") {

						this._oViewModel.setProperty("/showOrderType", false);
					} else {

						this._oViewModel.setProperty("/showOrderType", true);
					}

					if (AcceptVisible && StatusData.Offered_Vtn == "" && StatusData.Trade_Return == "N") {
						StatusData.RequestingDealerVisible = true;
					}

					this.VehicleTrade_SummaryData(StatusData);

					//  for a rejected trade request do not show the VTN on the screen. 
					if (Status == "R") {
						that.getView().byId("ovtnId").setVisible(false);
						that.getView().byId("ovtnIdText").setVisible(false);
					} else {

						that.getView().byId("ovtnId").setVisible(true);
						that.getView().byId("ovtnIdText").setVisible(true);
					}

					if (StatusData.Trade_Return == "N") {
						that._oViewModel.setProperty("/showVinDisplayOffInbound", false);
						var bool = false;
						if (StatusData.Offered_Vtn == "" || StatusData.Offered_Vtn == null) {
							bool = true;
						}

						if (AcceptVisible && bool) {
							this.getView().byId("ctetid1").setVisible(true);
							this.getView().byId("txtlab1").setVisible(true);
							this.getView().byId("prpetid1").setVisible(true);
							this.getView().byId("otxtlabel1").setVisible(true);
							this.getView().byId("ctetid").setVisible(false);
							this.getView().byId("txtlab").setVisible(false);
							this.getView().byId("prpetid").setVisible(false);
							this.getView().byId("otxtlabel").setVisible(false);
							sap.ui.getCore().getModel("MyTradeRequested").getData().RequestingDealerVisible = true;
						}

					} else if (StatusData.Trade_Return == "Y") {
						that._oViewModel.setProperty("/showVinDisplayOffInbound", false);
						that._oViewModel.setProperty("/showVinDiplayOff", false);

					}
					this.getView().setModel(this._oViewModel, "detailView");
					this.getView().getModel("detailView").refresh(true);
					if (AcceptVisible == true && (Status == "S" || Status == "C")) {
						this.getView().byId("oacceptbtn").setVisible(!AcceptVisible);
						this.getView().byId("oRejectbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCounterofrbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCancelbtn").setVisible(AcceptVisible);
						if (StatusData.Requested_Vtn == null) {
							this.getView().byId("oUpdatebtn").setVisible(!AcceptVisible);
						} else {
							this.getView().byId("oUpdatebtn").setVisible(AcceptVisible);

						}
					} else {

						/*	this.getView().byId("oacceptbtn").setVisible(!AcceptVisible);
							this.getView().byId("oRejectbtn").setVisible(!AcceptVisible);
							this.getView().byId("oCounterofrbtn").setVisible(!AcceptVisible);
							this.getView().byId("oCancelbtn").setVisible(AcceptVisible);
							this.getView().byId("oUpdatebtn").setVisible(AcceptVisible);*/
						this.getView().byId("oacceptbtn").setVisible(!AcceptVisible);
						this.getView().byId("oRejectbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCounterofrbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCancelbtn").setVisible(!AcceptVisible);
						this.getView().byId("oUpdatebtn").setVisible(!AcceptVisible);

					}

					var Status = [];
					Status.push(StatusData);
					var oStatusModel = new sap.ui.model.json.JSONModel(Status);
					/*	this.getView().byId("VT_ARCTtrdinStatus").setModel(oStatusModel);*/
					this.getView().byId("VT_ARCTtrdinRet").setModel(oStatusModel);
					/*this.getView().byId("VT_ARCTDnc").setModel(oStatusModel);*/

					//this.getView().byId("VT_ARCDnc").setModel(oStatusModel);  GSR0605

					//	this.getView().byId("oAddbutton").setModel(oStatusModel);	
					//	this.getView().byId("SimpleFormAproveTrReq").bindElement("/");

					var Dnc = StatusData.DNC;
					if (Dnc == "Y" || Dnc == "X") {
						this.getView().byId("VT_ARCDnc").setVisible(false);
						// var newItem = new sap.ui.core.Item({
						// 	key: "0",
						// 	text: "0"
						// });
						// 		this.getView().byId("VT_ARCDnc").insertItem(newItem);
						// 							var newItem = new sap.ui.core.Item({
						// 	key: "10",
						// 	text: "10"
						// });
						// 		this.getView().byId("VT_ARCDnc").insertItem(newItem);

						// 							var newItem = new sap.ui.core.Item({
						// 	key: "20",
						// 	text: "20"
						// });
						// 		this.getView().byId("VT_ARCDnc").insertItem(newItem);
						// 							var newItem = new sap.ui.core.Item({
						// 	key: "40",
						// 	text: "40"
						// });
						// 		this.getView().byId("VT_ARCDnc").insertItem(newItem);									

						// this.getView().byId("VT_ARCDnc").insertItem(newItem);
						this.getView().byId("VT_ARCDnc").setSelectedKey("0");
						this.getView().byId("VT_ARCDnc").setSelectedItem("0");

					} else if (Dnc == "N" || Dnc == "" || Dnc == null) {
						this.getView().byId("VT_ARCDnc").setVisible(false);
						// var newItem = new sap.ui.core.Item({
						// 	key: "",
						// 	text: ""
						// });
						// this.getView().byId("VT_ARCDnc").insertItem(newItem);
						this.getView().byId("VT_ARCDnc").setSelectedKey("");
						this.getView().byId("VT_ARCDnc").setSelectedItem("");
					} else {
						this.getView().byId("VT_ARCDnc").setVisible(false);
						this.getView().byId("VT_ARCDnc").setSelectedKey("");
						this.getView().byId("VT_ARCDnc").setSelectedItem("");
					}

					this.getView().byId("SimpleForrmDisa220").setModel(sap.ui.getCore().getModel("MyTradeRequested"));
					this.getView().byId("SimpleForrmDisa220").bindElement("/");

					var Tradeid = sap.ui.getCore().getModel("MyTradeRequested").getData().Trade_Id;
					this.Tradeid = Tradeid;
					var Add_CommentStatus = sap.ui.getCore().getModel("MyTradeRequested").getData().Trade_Status;
					if (Add_CommentStatus == "C" || Add_CommentStatus == "S") {
						this.getView().byId("oAddbutton").setEnabled(true);
						this.getView().byId("oComments").setEnabled(true);
					} else {
						this.getView().byId("oAddbutton").setEnabled(false);
						this.getView().byId("oComments").setEnabled(false);
					}
					var that = this;
					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");

					if (sLocation_conf == 0) {
						this.sPrefix = "/VehicleLocator_Xsodata";
					} else {
						this.sPrefix = "";

					}
					this.nodeJsUrl = this.sPrefix;

					that.oDataUrl = "/odata/v2/vehicleTrade/Trade_Comment?$filter=Trade_Id eq '" + this.Tradeid + "'";

					// that.oDataUrl = "/odata/v2/vehicleTrade/Trade_Comment";
					$.ajax({
						url: that.oDataUrl,
						method: "GET",
						async: false,
						dataType: "json",

						success: function (oData) {

							
							var Data = oData.d.results;
							var Trade_Comment = Data.filter(function (x) {
								return x["Trade_Id"] == Tradeid;
							});
							var oModel = new sap.ui.model.json.JSONModel(Trade_Comment);
							// that.getView().byId("tableVrade").setModel(oModel);
							that.getView().setModel(oModel, "commentsModel");
						}
					});

				}
			} else if (that.oSelectedItems != undefined && that.oSelectedItems == "SelectedFromTradeHistory") {
				this.getView().byId("ovinIdText").setVisible(false);
					this.getView().byId("ovinId").setVisible(false);
				this._oViewModel.setProperty("/showVinDisplayOffInbound", false);
				var StatusData = sap.ui.getCore().getModel("TradeRequestedHistory").getData();

				if (StatusData.RequestingDealerVisible) {
					this.getView().byId("ctetid").setVisible(false);
					this.getView().byId("txtlab").setVisible(false);
					this.getView().byId("prpetid").setVisible(false);
					this.getView().byId("otxtlabel").setVisible(false);
					this.getView().byId("ctqtid").setVisible(false);
					this.getView().byId("txlab").setVisible(false);
					this.getView().byId("prptid").setVisible(false);
					this.getView().byId("otxlabel").setVisible(false);
					this.getView().byId("ctetid1").setVisible(true);
					this.getView().byId("txtlab1").setVisible(true);
					this.getView().byId("prpetid1").setVisible(true);
					this.getView().byId("otxtlabel1").setVisible(true);
					this.getView().byId("ctqtid1").setVisible(true);
					this.getView().byId("txlab1").setVisible(true);
					this.getView().byId("prptid1").setVisible(true);
					this.getView().byId("otxlabel1").setVisible(true);
				}

				this.getView().byId("SimpleFormAproveTrReq").setModel(sap.ui.getCore().getModel("TradeRequestedHistory"));

				this._oViewModel.setProperty("/tradeId", StatusData.Trade_Id);
				var Status = [];
				Status.push(StatusData);
				this.getView().byId("SimpleFormAproveTrReq").bindElement("/");
				this.getView().byId("SimpleFormAproveTrReq").getModel().refresh(true);
				if (this.getView().byId("ovtnId").getText() == "") {
					// this.getView().byId("requForm").setVisible(false);

					this._oViewModel.setProperty("/showVinDiplayOff", false);
					// this.getView().byId("offervehidContent").setVisible(true);
					// Offered = {};
					// this.getView().byId("Offerevehid").setText("");
					// this.getView().byId("offeredDealer").setVisible(true);
					// this.getView().byId("oRequesteddealer").setText("");
					// this.getView().byId("oRequesteddealer").setVisible(true);
					// this.getView().byId("oAccesIn").setText("");
					// this.getView().byId("ovinIdText").setVisible(true);
					// this.getView().byId("ovinId").setVisible(true);

					this.getView().byId("oMdlyearLbl").setVisible(false);
					// this.getView().byId("ofrmodelyeartext").setText("");
					this.getView().byId("oMdlyear").setVisible(false);

					this.getView().byId("oSeriesLbl").setVisible(false);
					// this.getView().byId("ofrseriestxt").setText("");
					this.getView().byId("oSeries").setVisible(false);

					this.getView().byId("oModelLbl").setVisible(false);
					// this.getView().byId("ofrmodltxt").setText("");
					this.getView().byId("oModel").setVisible(false);

					this.getView().byId("oSuffixLbl").setVisible(false);
					// this.getView().byId("ofrsuffixstxt").setText("");
					this.getView().byId("intdesr").setVisible(false);

					this.getView().byId("extcoLbl").setVisible(false);
					// this.getView().byId("ofrapxtxt").setText("");
					this.getView().byId("extco").setVisible(false);

					this.getView().byId("oapxLbl").setVisible(false);
					// this.getView().byId("ofrexttxt").setText("");
					this.getView().byId("oapx").setVisible(false);

					this.getView().byId("ostatusLbl").setVisible(false);
					// this.getView().byId("ofrstatustxt").setText("");
					this.getView().byId("ostatus").setVisible(false);

					this.getView().byId("ordTypLbl").setVisible(false);
					// this.getView().byId("ofrordtypetxt").setText("");
					this.getView().byId("oOdrtype").setVisible(false);

					this.getView().byId("cetalabid").setVisible(false);
					// this.getView().byId("ctqtid").setText("");
					this.getView().byId("ctetid").setVisible(false);
					this.getView().byId("ctetid1").setVisible(false);
					this.getView().byId("txtlab1").setVisible(false);
					this.getView().byId("prpetid1").setVisible(false);
					this.getView().byId("otxtlabel1").setVisible(false);

					// // this.getView().byId("fromqid").setVisible(false);
					// this.getView().byId("txlab").setText("");
					this.getView().byId("txtlab").setVisible(false);

					this.getView().byId("prlabid").setVisible(false);
					this.getView().byId("prpetid").setVisible(false);
					this.getView().byId("VT_ARCTDnc").setVisible(false);
					this.getView().byId("VT_ARCTDncLbl").setVisible(false);
					this.getView().byId("ovtnIdText").setVisible(false);
					this.getView().byId("ovtnId").setVisible(false);
					this.getView().byId("ovinIdText").setVisible(false);
					this.getView().byId("ovinId").setVisible(false);

					// // this.getView().byId("tobid").setVisible(false);
					// this.getView().byId("prptid").setText("");
					this.getView().byId("accInstLbl").setVisible(false);

					// // this.getView().byId("fmlbid").setVisible(false);
					// /*	this.getView().byId("fromlbid").setVisible(false);*/
					// this.getView().byId("otxlabel").setText("");
					this.getView().byId("otxtlabel").setVisible(false);

					this.getView().byId("accInst").setVisible(false);

				} else {
					this._oViewModel.setProperty("/showVinDiplayOff", true);
					this.getView().byId("oMdlyearLbl").setVisible(true);
					// this.getView().byId("ofrmodelyeartext").setText("");
					this.getView().byId("oMdlyear").setVisible(true);

					this.getView().byId("oSeriesLbl").setVisible(true);
					// this.getView().byId("ofrseriestxt").setText("");
					this.getView().byId("oSeries").setVisible(true);

					this.getView().byId("oModelLbl").setVisible(true);
					// this.getView().byId("ofrmodltxt").setText("");
					this.getView().byId("oModel").setVisible(true);

					this.getView().byId("oSuffixLbl").setVisible(true);
					// this.getView().byId("ofrsuffixstxt").setText("");
					this.getView().byId("intdesr").setVisible(true);

					this.getView().byId("extcoLbl").setVisible(true);
					// this.getView().byId("ofrapxtxt").setText("");
					this.getView().byId("extco").setVisible(true);

					this.getView().byId("oapxLbl").setVisible(true);
					// this.getView().byId("ofrexttxt").setText("");
					this.getView().byId("oapx").setVisible(true);

					this.getView().byId("ostatusLbl").setVisible(true);
					// this.getView().byId("ofrstatustxt").setText("");
					this.getView().byId("ostatus").setVisible(true);

					this.getView().byId("ordTypLbl").setVisible(true);
					// this.getView().byId("ofrordtypetxt").setText("");
					this.getView().byId("oOdrtype").setVisible(true);

					this.getView().byId("cetalabid").setVisible(true);
					// this.getView().byId("ctqtid").setText("");
					if (!StatusData.RequestingDealerVisible) {
						this.getView().byId("ctetid").setVisible(true);
						this.getView().byId("txtlab").setVisible(true);
						this.getView().byId("prpetid").setVisible(true);
						this.getView().byId("otxtlabel").setVisible(true);
					} else {
						this.getView().byId("ctetid1").setVisible(true);
						this.getView().byId("txtlab1").setVisible(true);
						this.getView().byId("prpetid1").setVisible(true);
						this.getView().byId("otxtlabel1").setVisible(true);
					}

					// // this.getView().byId("fromqid").setVisible(false);
					// this.getView().byId("txlab").setText("");

					this.getView().byId("prlabid").setVisible(true);

					this.getView().byId("VT_ARCTDnc").setVisible(true);
					this.getView().byId("VT_ARCTDncLbl").setVisible(true);
					this.getView().byId("ovtnIdText").setVisible(true);
					this.getView().byId("ovtnId").setVisible(true);
					//	this.getView().byId("ovinIdText").setVisible(true);
					//	this.getView().byId("ovinId").setVisible(true);
					// // this.getView().byId("tobid").setVisible(false);
					// this.getView().byId("prptid").setText("");
					this.getView().byId("accInstLbl").setVisible(true);

					// // this.getView().byId("fmlbid").setVisible(false);
					// /*	this.getView().byId("fromlbid").setVisible(false);*/
					// this.getView().byId("otxlabel").setText("");

					this.getView().byId("accInst").setVisible(true);
					// this.getView().byId("requForm").setVisible(true);

				}
				if (this.getView().byId("vtnid").getText() == "")

				{
					// this.getView().byId("offervehidContent").setVisible(false);

					this._oViewModel.setProperty("/showVinDiplayOff", false);
					// this.getView().byId("offervehidContent").setVisible(true);
					// Offered = {};
					this.getView().byId("Offerevehid").setText("");
					this.getView().byId("offeredDealer").setVisible(false);
					this.getView().byId("oRequesteddealer").setText("");
					this.getView().byId("oRequesteddealer").setVisible(false);
					this.getView().byId("oAccesIn").setText("");
					this.getView().byId("oAccesIn").setVisible(false);
					this.getView().byId("accid").setVisible(false);

					this.getView().byId("ofrModellabl").setVisible(false);
					this.getView().byId("ofrmodelyeartext").setText("");
					this.getView().byId("ofrmodelyeartext").setVisible(false);

					this.getView().byId("ofrserieslabl").setVisible(false);
					this.getView().byId("ofrseriestxt").setText("");
					this.getView().byId("ofrseriestxt").setVisible(false);

					this.getView().byId("ofrmodllabl").setVisible(false);
					this.getView().byId("ofrmodltxt").setText("");
					this.getView().byId("ofrmodltxt").setVisible(false);

					this.getView().byId("ofrsuffixlabl").setVisible(false);
					// this.getView().byId("ofrsuffixstxt").setText("");
					this.getView().byId("ofrsuffixstxt").setVisible(false);

					this.getView().byId("ofrapxlabl").setVisible(false);
					// this.getView().byId("ofrapxtxt").setText("");
					this.getView().byId("ofrapxtxt").setVisible(false);

					this.getView().byId("ofrextcolorlabl").setVisible(false);
					// this.getView().byId("ofrexttxt").setText("");
					this.getView().byId("ofrexttxt").setVisible(false);

					this.getView().byId("ofrstatuslabl").setVisible(false);
					// this.getView().byId("ofrstatustxt").setText("");
					this.getView().byId("ofrstatustxt").setVisible(false);

					this.getView().byId("ofrordrtypelabl").setVisible(false);
					// this.getView().byId("ofrordtypetxt").setText("");
					this.getView().byId("ofrordtypetxt").setVisible(false);

					this.getView().byId("cetalaid").setVisible(false);
					// this.getView().byId("ctqtid").setText("");
					this.getView().byId("ctqtid").setVisible(false);
					this.getView().byId("ctqtid1").setVisible(false);
					// // this.getView().byId("fromqid").setVisible(false);
					// this.getView().byId("txlab").setText("");
					this.getView().byId("txlab").setVisible(false);
					this.getView().byId("txlab1").setVisible(false);
					this.getView().byId("prolabid").setVisible(false);

					// // this.getView().byId("tobid").setVisible(false);
					// this.getView().byId("prptid").setText("");
					this.getView().byId("prptid").setVisible(false);
					this.getView().byId("prptid1").setVisible(false);
					// // this.getView().byId("fmlbid").setVisible(false);
					// /*	this.getView().byId("fromlbid").setVisible(false);*/
					// this.getView().byId("otxlabel").setText("");
					this.getView().byId("otxlabel").setVisible(false);
					this.getView().byId("otxlabel1").setVisible(false);
					// this.getView().byId("idlto").setVisible(false);

				} else {
					// this.getView().byId("offervehidContent").setVisible(true);

					this._oViewModel.setProperty("/showVinDiplayOff", true);
					// this.getView().byId("offervehidContent").setVisible(true);
					// Offered = {};
					// this.getView().byId("Offerevehid").setText("");
					this.getView().byId("offeredDealer").setVisible(true);
					// this.getView().byId("oRequesteddealer").setText("");
					this.getView().byId("oRequesteddealer").setVisible(true);
					// this.getView().byId("oAccesIn").setText("");
					this.getView().byId("oAccesIn").setVisible(true);
					this.getView().byId("accid").setVisible(true);

					this.getView().byId("ofrModellabl").setVisible(true);
					// this.getView().byId("ofrmodelyeartext").setText("");
					this.getView().byId("ofrmodelyeartext").setVisible(true);

					this.getView().byId("ofrserieslabl").setVisible(true);
					// this.getView().byId("ofrseriestxt").setText("");
					this.getView().byId("ofrseriestxt").setVisible(true);

					this.getView().byId("ofrmodllabl").setVisible(true);
					// this.getView().byId("ofrmodltxt").setText("");
					this.getView().byId("ofrmodltxt").setVisible(true);

					this.getView().byId("ofrsuffixlabl").setVisible(true);
					// this.getView().byId("ofrsuffixstxt").setText("");
					this.getView().byId("ofrsuffixstxt").setVisible(true);

					this.getView().byId("ofrapxlabl").setVisible(true);
					// this.getView().byId("ofrapxtxt").setText("");
					this.getView().byId("ofrapxtxt").setVisible(true);

					this.getView().byId("ofrextcolorlabl").setVisible(true);
					// this.getView().byId("ofrexttxt").setText("");
					this.getView().byId("ofrexttxt").setVisible(true);

					this.getView().byId("ofrstatuslabl").setVisible(true);
					// this.getView().byId("ofrstatustxt").setText("");
					this.getView().byId("ofrstatustxt").setVisible(true);

					this.getView().byId("ofrordrtypelabl").setVisible(true);
					// this.getView().byId("ofrordtypetxt").setText("");
					this.getView().byId("ofrordtypetxt").setVisible(true);

					this.getView().byId("cetalaid").setVisible(true);
					// this.getView().byId("ctqtid").setText("");
					if (!StatusData.RequestingDealerVisible) {
						this.getView().byId("ctqtid").setVisible(true);
						this.getView().byId("txlab").setVisible(true);
						this.getView().byId("prptid").setVisible(true);
						this.getView().byId("otxlabel").setVisible(true);
					} else {
						this.getView().byId("ctqtid1").setVisible(true);
						this.getView().byId("txlab1").setVisible(true);
						this.getView().byId("prptid1").setVisible(true);
						this.getView().byId("otxlabel1").setVisible(true);
					}

					// // this.getView().byId("fromqid").setVisible(false);
					// this.getView().byId("txlab").setText("");

					this.getView().byId("prolabid").setVisible(true);

					// // this.getView().byId("tobid").setVisible(false);
					// this.getView().byId("prptid").setText("");

					// // this.getView().byId("fmlbid").setVisible(false);
					// /*	this.getView().byId("fromlbid").setVisible(false);*/
					// this.getView().byId("otxlabel").setText("");

					// that.getView().byId("idlto").setVisible(true);

				}
				if (StatusData.Trade_Return == "N") {
					if (StatusData.trade_type == "outbound") {
						this._oViewModel.setProperty("/showVinDiplayOff", false);
						// this.getView().byId("offervehidContent").setVisible(true);
						// Offered = {};
						// this.getView().byId("Offerevehid").setText("");
						// this.getView().byId("offeredDealer").setVisible(true);
						// this.getView().byId("oRequesteddealer").setText("");
						// this.getView().byId("oRequesteddealer").setVisible(true);
						// this.getView().byId("oAccesIn").setText("");
						// this.getView().byId("ovinIdText").setVisible(true);
						// this.getView().byId("ovinId").setVisible(true);

						this.getView().byId("oMdlyearLbl").setVisible(false);
						// this.getView().byId("ofrmodelyeartext").setText("");
						this.getView().byId("oMdlyear").setVisible(false);

						this.getView().byId("oSeriesLbl").setVisible(false);
						// this.getView().byId("ofrseriestxt").setText("");
						this.getView().byId("oSeries").setVisible(false);

						this.getView().byId("oModelLbl").setVisible(false);
						// this.getView().byId("ofrmodltxt").setText("");
						this.getView().byId("oModel").setVisible(false);

						this.getView().byId("oSuffixLbl").setVisible(false);
						// this.getView().byId("ofrsuffixstxt").setText("");
						this.getView().byId("intdesr").setVisible(false);

						this.getView().byId("extcoLbl").setVisible(false);
						// this.getView().byId("ofrapxtxt").setText("");
						this.getView().byId("extco").setVisible(false);

						this.getView().byId("oapxLbl").setVisible(false);
						// this.getView().byId("ofrexttxt").setText("");
						this.getView().byId("oapx").setVisible(false);

						this.getView().byId("ostatusLbl").setVisible(false);
						// this.getView().byId("ofrstatustxt").setText("");
						this.getView().byId("ostatus").setVisible(false);

						this.getView().byId("ordTypLbl").setVisible(false);
						// this.getView().byId("ofrordtypetxt").setText("");
						this.getView().byId("oOdrtype").setVisible(false);

						this.getView().byId("cetalabid").setVisible(false);
						// this.getView().byId("ctqtid").setText("");
						this.getView().byId("ctetid").setVisible(false);
						this.getView().byId("ctetid1").setVisible(false);
						this.getView().byId("ctetid2").setVisible(false);
						// // this.getView().byId("fromqid").setVisible(false);
						// this.getView().byId("txlab").setText("");
						this.getView().byId("txtlab").setVisible(false);
						this.getView().byId("txtlab1").setVisible(false);
						this.getView().byId("txtlab2").setVisible(false);
						this.getView().byId("prlabid").setVisible(false);
						this.getView().byId("ctqtid").setVisible(false);
						this.getView().byId("ctqtid1").setVisible(false);
						this.getView().byId("ctqtid2").setVisible(true);
						this.getView().byId("txlab").setVisible(false);
						this.getView().byId("txlab1").setVisible(false);
						this.getView().byId("txlab2").setVisible(true);
						this.getView().byId("prptid").setVisible(false);
						this.getView().byId("prptid1").setVisible(false);
						this.getView().byId("prptid2").setVisible(true);
						this.getView().byId("otxlabel").setVisible(false);
						this.getView().byId("otxlabel1").setVisible(false);
						this.getView().byId("otxlabel2").setVisible(true);
						this.getView().byId("prpetid").setVisible(false);
						this.getView().byId("prpetid2").setVisible(false);
						this.getView().byId("prpetid1").setVisible(false);

						this.getView().byId("VT_ARCTDnc").setVisible(false);
						this.getView().byId("VT_ARCTDncLbl").setVisible(false);
						this.getView().byId("ovtnIdText").setVisible(false);
						this.getView().byId("ovtnId").setVisible(false);
						this.getView().byId("ovinIdText").setVisible(false);
						this.getView().byId("ovinId").setVisible(false);
						// // this.getView().byId("tobid").setVisible(false);
						// this.getView().byId("prptid").setText("");
						this.getView().byId("accInstLbl").setVisible(false);

						// // this.getView().byId("fmlbid").setVisible(false);
						// /*	this.getView().byId("fromlbid").setVisible(false);*/
						// this.getView().byId("otxlabel").setText("");
						this.getView().byId("otxtlabel").setVisible(false);
						this.getView().byId("otxtlabel1").setVisible(false);
						this.getView().byId("otxtlabel2").setVisible(false);

						this.getView().byId("accInst").setVisible(false);
					} else {
						this._oViewModel.setProperty("/showVinDiplayOff", false);
						// this.getView().byId("offervehidContent").setVisible(true);
						// Offered = {};

						this.getView().byId("vtnlabeid").setVisible(false);
						this.getView().byId("vtnid").setVisible(false);
						this.getView().byId("vinlabeid").setVisible(false);//changes by swetha for DMND0003618
						this.getView().byId("vinid").setVisible(false);//changes by swetha for DMND0003618
						this.getView().byId("Offerevehid").setText("");
						this.getView().byId("offeredDealer").setVisible(false);
						this.getView().byId("oRequesteddealer").setText("");
						this.getView().byId("oRequesteddealer").setVisible(false);
						this.getView().byId("oAccesIn").setText("");
						this.getView().byId("oAccesIn").setVisible(false);
						this.getView().byId("accid").setVisible(false);

						this.getView().byId("ofrModellabl").setVisible(false);
						this.getView().byId("ofrmodelyeartext").setText("");
						this.getView().byId("ofrmodelyeartext").setVisible(false);

						this.getView().byId("ofrserieslabl").setVisible(false);
						this.getView().byId("ofrseriestxt").setText("");
						this.getView().byId("ofrseriestxt").setVisible(false);

						this.getView().byId("ofrmodllabl").setVisible(false);
						this.getView().byId("ofrmodltxt").setText("");
						this.getView().byId("ofrmodltxt").setVisible(false);

						this.getView().byId("ofrsuffixlabl").setVisible(false);
						// this.getView().byId("ofrsuffixstxt").setText("");
						this.getView().byId("ofrsuffixstxt").setVisible(false);

						this.getView().byId("ofrapxlabl").setVisible(false);
						// this.getView().byId("ofrapxtxt").setText("");
						this.getView().byId("ofrapxtxt").setVisible(false);

						this.getView().byId("ofrextcolorlabl").setVisible(false);
						// this.getView().byId("ofrexttxt").setText("");
						this.getView().byId("ofrexttxt").setVisible(false);

						this.getView().byId("ofrstatuslabl").setVisible(false);
						// this.getView().byId("ofrstatustxt").setText("");
						this.getView().byId("ofrstatustxt").setVisible(false);

						this.getView().byId("ofrordrtypelabl").setVisible(false);
						// this.getView().byId("ofrordtypetxt").setText("");
						this.getView().byId("ofrordtypetxt").setVisible(false);

						this.getView().byId("cetalaid").setVisible(false);
						// this.getView().byId("ctqtid").setText("");
						this.getView().byId("ctqtid").setVisible(false);
						this.getView().byId("ctqtid1").setVisible(false);
						// // this.getView().byId("fromqid").setVisible(false);
						// this.getView().byId("txlab").setText("");
						this.getView().byId("txlab").setVisible(false);
						this.getView().byId("txlab1").setVisible(false);
						this.getView().byId("prolabid").setVisible(false);

						// // this.getView().byId("tobid").setVisible(false);
						// this.getView().byId("prptid").setText("");
						this.getView().byId("prptid").setVisible(false);
						this.getView().byId("prptid1").setVisible(false);
						// // this.getView().byId("fmlbid").setVisible(false);
						// /*	this.getView().byId("fromlbid").setVisible(false);*/
						// this.getView().byId("otxlabel").setText("");
						this.getView().byId("otxlabel").setVisible(false);
						this.getView().byId("otxlabel1").setVisible(false);
						this.getView().byId("ctetid").setVisible(false);
						this.getView().byId("ctetid1").setVisible(false);
						this.getView().byId("ctetid2").setVisible(true);
						// // this.getView().byId("fromqid").setVisible(false);
						// this.getView().byId("txlab").setText("");
						this.getView().byId("txtlab").setVisible(false);
						this.getView().byId("txtlab1").setVisible(false);
						this.getView().byId("txtlab2").setVisible(true);

						this.getView().byId("ctqtid").setVisible(false);
						this.getView().byId("ctqtid1").setVisible(false);
						this.getView().byId("ctqtid2").setVisible(false);
						this.getView().byId("txlab").setVisible(false);
						this.getView().byId("txlab1").setVisible(false);
						this.getView().byId("txlab2").setVisible(false);
						this.getView().byId("prptid").setVisible(false);
						this.getView().byId("prptid1").setVisible(false);
						this.getView().byId("prptid2").setVisible(false);
						this.getView().byId("otxlabel").setVisible(false);
						this.getView().byId("otxlabel1").setVisible(false);
						this.getView().byId("otxlabel2").setVisible(false);
						this.getView().byId("prpetid").setVisible(false);
						this.getView().byId("prpetid2").setVisible(true);
						this.getView().byId("prpetid1").setVisible(false);
						this.getView().byId("otxtlabel2").setVisible(true);
						this.getView().byId("otxtlabel1").setVisible(false);
						this.getView().byId("otxtlabel").setVisible(false);

						// this.getView().byId("idlto").setVisible(false);

					}

					/*			var oDealer = StatusData.Requested_Dealer;
								if (oDealer.length == 10) {
									oDealer = oDealer.slice(-5);
								}
								sap.ui.core.BusyIndicator.show(0);
								var that = this;
								var SeriesUrl = oDataUrl + "/ZVMS_CDS_ETA_consolidate('" + oDealer + "')/Set?$filter=zzvtn eq '" + StatusData.VTN +
									"' and kunnr eq '" + StatusData.Requested_Dealer + "'&$format=json";
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
											if (StatusData.VTN == a[k].zzvtn) {
												
													if (a[k].mmsta < "M275" || patt1.test(a[k].mmsta) || a[k].vhvin == "") {
													//	that.getView().byId("ovinId").setVisible(false);
														that._oViewModel.setProperty("/showVinDisplayOffInbound", false);
													} else {
													//	that.getView().byId("ovinId").setVisible(true);
															that._oViewModel.setProperty("/showVinDisplayOffInbound", true);
													}
												
											}
										}
										that.getView().setModel(that._oViewModel, "detailView");
										that._oViewModel.refresh(true);
										sap.ui.core.BusyIndicator.hide();

									},
									error: function (s, result) {
										
										var a = s;
										sap.ui.core.BusyIndicator.hide();
									}
								});
								*/
					// this.getView().byId("offervehidContent").setVisible(false);
					// Offered = {};

					// this._oViewModel.setProperty("/showVinDiplayOff", true);
					// // that.getView().byId("Offerevehid").setText("");
					// that.getView().byId("offeredDealer").setVisible(true);
					// // that.getView().byId("oRequesteddealer").setText("");
					// that.getView().byId("oRequesteddealer").setVisible(true);

					// that.getView().byId("ofrModellabl").setVisible(true);
					// // that.getView().byId("ofrmodelyeartext").setText("");
					// that.getView().byId("ofrmodelyeartext").setVisible(true);
					// // that.getView().byId("oAccesIn").setText("");
					// 	that.getView().byId("oAccesIn").setVisible(true);
					// 	that.getView().byId("accid").setVisible(true);

					// that.getView().byId("ofrserieslabl").setVisible(true);
					// // that.getView().byId("ofrseriestxt").setText("");
					// that.getView().byId("ofrseriestxt").setVisible(true);

					// that.getView().byId("ofrmodllabl").setVisible(true);
					// // that.getView().byId("ofrmodltxt").setText("");
					// that.getView().byId("ofrmodltxt").setVisible(true);

					// that.getView().byId("ofrsuffixlabl").setVisible(true);
					// // that.getView().byId("ofrsuffixstxt").setText("");
					// that.getView().byId("ofrsuffixstxt").setVisible(true);

					// that.getView().byId("ofrapxlabl").setVisible(true);
					// // that.getView().byId("ofrapxtxt").setText("");
					// that.getView().byId("ofrapxtxt").setVisible(true);

					// that.getView().byId("ofrextcolorlabl").setVisible(true);
					// // that.getView().byId("ofrexttxt").setText("");
					// that.getView().byId("ofrexttxt").setVisible(true);

					// that.getView().byId("ofrstatuslabl").setVisible(true);
					// // that.getView().byId("ofrstatustxt").setText("");
					// that.getView().byId("ofrstatustxt").setVisible(true);

					// that.getView().byId("ofrordrtypelabl").setVisible(true);
					// // that.getView().byId("ofrordtypetxt").setText("");
					// that.getView().byId("ofrordtypetxt").setVisible(true);

					// that.getView().byId("cetalaid").setVisible(true);
					// // that.getView().byId("ctqtid").setText("");
					// that.getView().byId("ctqtid").setVisible(true);

					// // that.getView().byId("fromqid").setVisible(false);
					// // that.getView().byId("txlab").setText("");
					// that.getView().byId("txlab").setVisible(true);

					// that.getView().byId("prolabid").setVisible(true);

					// // that.getView().byId("tobid").setVisible(false);
					// // that.getView().byId("prptid").setText("");
					// that.getView().byId("prptid").setVisible(true);

					// // that.getView().byId("fmlbid").setVisible(false);
					// /*	that.getView().byId("fromlbid").setVisible(false);*/
					// // that.getView().byId("otxlabel").setText("");
					// that.getView().byId("otxlabel").setVisible(true);

					// that.getView().byId("idlto").setVisible(false);

				} else if (StatusData.Trade_Return == "Y") {
					this.getView().byId("vtnlabeid").setVisible(true);
					this.getView().byId("vtnid").setVisible(true);
					/*
										var oDealer = StatusData.Requested_Dealer;
										if (oDealer.length == 10) {
											oDealer = oDealer.slice(-5);
										}
										sap.ui.core.BusyIndicator.show(0);
										var that = this;
										var SeriesUrl = oDataUrl + "/ZVMS_CDS_ETA_consolidate('" + oDealer + "')/Set?$filter=zzvtn eq '" + StatusData.VTN +
											"' and kunnr eq '" + StatusData.Requesting_Dealer + "'&$format=json";
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
													if (StatusData.VTN == a[k].zzvtn) {
														
															if (a[k].mmsta < "M275" || patt1.test(a[k].mmsta) || a[k].vhvin == "") {
																that._oViewModel.setProperty("/showVinDiplayOff", false);
															} else {
																that._oViewModel.setProperty("/showVinDiplayOff", true);
															}
														
													}
												}
												that.getView().setModel(that._oViewModel, "detailView");
												that._oViewModel.refresh(true);
												sap.ui.core.BusyIndicator.hide();

											},
											error: function (s, result) {
												
												var a = s;
												sap.ui.core.BusyIndicator.hide();
										
											}
										});
										var oDealer = StatusData.Requesting_Dealer;
										if (oDealer.length == 10) {
											oDealer = oDealer.slice(-5);
										}
										var vtnR=StatusData.Requested_Vtn;
										if(StatusData.VTN == StatusData.Requested_Vtn)
										{
											vtnR=StatusData.Offered_Vtn;
										}
										sap.ui.core.BusyIndicator.show(0);
										var that = this;
										var SeriesUrl = oDataUrl + "/ZVMS_CDS_ETA_consolidate('" + oDealer + "')/Set?$filter=zzvtn eq '" + vtnR +
											"' and kunnr eq '" + StatusData.Requested_Dealer + "'&$format=json";
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
													if (StatusData.Requested_Vtn == a[k].zzvtn) {
														
															if (a[k].mmsta < "M275" || patt1.test(a[k].mmsta) || a[k].vhvin == "") {
																that._oViewModel.setProperty("/showVinDisplayOffInbound", false);
															} else {
																that._oViewModel.setProperty("/showVinDisplayOffInbound", true);
															}
														
													}
												}
												that.getView().setModel(that._oViewModel, "detailView");
												that._oViewModel.refresh(true);
												sap.ui.core.BusyIndicator.hide();

											},
											error: function (s, result) {
												
												var a = s;
												sap.ui.core.BusyIndicator.hide();
											}
										});
										*/
					// 					this._oViewModel.setProperty("/showVinDiplayOff", true);

					// 					that.getView().byId("offeredDealer").setVisible(true);

					// 					that.getView().byId("oRequesteddealer").setVisible(true);

					// 					that.getView().byId("ofrModellabl").setVisible(true);

					// 					that.getView().byId("ofrmodelyeartext").setVisible(true);
					// // that.getView().byId("oAccesIn").setText("");
					// 						that.getView().byId("oAccesIn").setVisible(true);
					// 						that.getView().byId("accid").setVisible(true);
					// 					that.getView().byId("ofrserieslabl").setVisible(true);

					// 					that.getView().byId("ofrseriestxt").setVisible(true);

					// 					that.getView().byId("ofrmodllabl").setVisible(true);

					// 					that.getView().byId("ofrmodltxt").setVisible(true);

					// 					that.getView().byId("ofrsuffixlabl").setVisible(true);

					// 					that.getView().byId("ofrsuffixstxt").setVisible(true);

					// 					that.getView().byId("ofrapxlabl").setVisible(true);

					// 					that.getView().byId("ofrapxtxt").setVisible(true);

					// 					that.getView().byId("ofrextcolorlabl").setVisible(true);

					// 					that.getView().byId("ofrexttxt").setVisible(true);

					// 					that.getView().byId("ofrstatuslabl").setVisible(true);

					// 					that.getView().byId("ofrstatustxt").setVisible(true);

					// 					that.getView().byId("ofrordrtypelabl").setVisible(true);

					// 					that.getView().byId("ofrordtypetxt").setVisible(true);

					// 					that.getView().byId("cetalaid").setVisible(true);

					// 					that.getView().byId("ctqtid").setVisible(true);

					// 					// that.getView().byId("fromqid").setVisible(true);

					// 					that.getView().byId("txlab").setVisible(true);

					// 					that.getView().byId("prolabid").setVisible(true);

					// 					// that.getView().byId("tobid").setVisible(true);

					// 					that.getView().byId("prptid").setVisible(true);

					// 					// that.getView().byId("fmlbid").setVisible(true);

					// 					that.getView().byId("otxlabel").setVisible(true);

					// that.getView().byId("idlto").setVisible(true);

				}

				var VIN = [],
					dealerO = [],
					trade_type = StatusData.trade_type;
				if (StatusData.RequestingDealerVisible && StatusData.trade_type == "outbound") {
					VIN.push(StatusData.OffredVehicle.VIN);
					dealerO.push(StatusData.Requesting_Dealer);
					VIN.push(StatusData.OffredVehicle.VIN);
					dealerO.push(StatusData.Requested_Dealer);
				} else if (StatusData.trade_type == "outbound") {
					VIN.push(StatusData.VIN);
					dealerO.push(StatusData.Requested_Dealer);
					VIN.push(StatusData.VIN);
					dealerO.push(StatusData.Requesting_Dealer);
				}
				if (StatusData.RequestingDealerVisible && StatusData.trade_type == "inbound") {
					VIN.push(StatusData.VIN);
					dealerO.push(StatusData.Requested_Dealer);
					VIN.push(StatusData.VIN);
					dealerO.push(StatusData.Requesting_Dealer);

				} else if (StatusData.trade_type == "inbound") {
					VIN.push(StatusData.OffredVehicle.VIN);
					dealerO.push(StatusData.Requesting_Dealer);
					VIN.push(StatusData.OffredVehicle.VIN);
					dealerO.push(StatusData.Requested_Dealer);
				}
				if (VIN.length !== 0) {

					/*	if(trade_type == "inbound")
										{
											this._oViewModel.setProperty("/showVinDisplayOffInbound", true);
										
											this._oViewModel.setProperty("/showVinDiplayOff", false);
										}
										else
										{
										this._oViewModel.setProperty("/showVinDiplayOff", true);
											this._oViewModel.setProperty("/showVinDisplayOffInbound", false);
										}*/
					for (var j = 0; j < VIN.length; j++) {
						var oDealer = dealerO[j];
						if (oDealer.length == 10) {
							oDealer = oDealer.slice(-5);
						}
						sap.ui.core.BusyIndicator.show(0);
						var that = this;
						var SeriesUrl = oDataUrl + "/ZVMS_CDS_ETA_consolidate('" + oDealer + "')/Set?$filter=vhvin eq '" + VIN[j] +
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

								if (a.length > 0) {
									for (var k = 0; k < a.length; k++) {
										
										//changes by swetha for DMND0003618 on 9/1/2023
										if (a[k].mmsta < "M110"  || patt1.test(a[k].mmsta) || a[k].vhvin == "") {

										// if (a[k].mmsta < "M275" || patt1.test(a[k].mmsta) || a[k].vhvin == "") {
											//	that.getView().byId("ovinId").setVisible(false);

											if (trade_type == "inbound") {
												that._oViewModel.setProperty("/showVinDisplayOffInbound", false);
											} else {
												that._oViewModel.setProperty("/showVinDiplayOff", false);
											}
										} else {
											//	that.getView().byId("ovinId").setVisible(true);
											if (trade_type == "inbound") {
												that._oViewModel.setProperty("/showVinDisplayOffInbound", false);

												//that._oViewModel.setProperty("/showVinDiplayOff", false);
											} else {
												that._oViewModel.setProperty("/showVinDiplayOff", true);
												//that._oViewModel.setProperty("/showVinDisplayOffInbound", false);
											}

										}

									}
								}
								that.getView().setModel(that._oViewModel, "detailView");
								that.getView().getModel("detailView").refresh(true);
								sap.ui.core.BusyIndicator.hide();

							},
							error: function (s, result) {

								sap.ui.core.BusyIndicator.hide();
							}
						});
					}
				} else {
					this._oViewModel.setProperty("/showVinDiplayOff", false);
					this._oViewModel.setProperty("/showVinDisplayOffInbound", false);

				}
				this.getView().setModel(this._oViewModel, "detailView");
				this.getView().getModel("detailView").refresh(true);
				var oStatusModel = new sap.ui.model.json.JSONModel(Status);
				var Dnc = StatusData.DNC;
				// if (Dnc == "Y" || Dnc == "X") {
				if ((Dnc == "Y" || Dnc == "X") && (this.dnsStatus != "R")) {
					this.getView().byId("VT_ARCDnc").setVisible(true);
					this.getView().byId("VT_ARCDnc").setEnabled(false);

					// var newItem = new sap.ui.core.Item({
					// 			key: "0",
					// 			text: "0"
					// 		});
					// 				this.getView().byId("VT_ARCDnc").insertItem(newItem);
					// 									var newItem = new sap.ui.core.Item({
					// 			key: "10",
					// 			text: "10"
					// 		});
					// 				this.getView().byId("VT_ARCDnc").insertItem(newItem);

					// 									var newItem = new sap.ui.core.Item({
					// 			key: "20",
					// 			text: "20"
					// 		});
					// 				this.getView().byId("VT_ARCDnc").insertItem(newItem);
					// 									var newItem = new sap.ui.core.Item({
					// 			key: "40",
					// 			text: "40"
					// 		});
					// 				this.getView().byId("VT_ARCDnc").insertItem(newItem);	

					this.getView().byId("VT_ARCDnc").setSelectedKey("0");
					this.getView().byId("VT_ARCDnc").setSelectedItem("0");

				} else if (Dnc == "N" || Dnc == "" || Dnc == null) {
					this.getView().byId("VT_ARCDnc").setVisible(false);
					this.getView().byId("VT_ARCDnc").setEnabled(false);
					// var newItem = new sap.ui.core.Item({
					// 	key: "",
					// 	text: ""
					// });
					// this.getView().byId("VT_ARCDnc").insertItem(newItem);
					this.getView().byId("VT_ARCDnc").setSelectedKey("");
					this.getView().byId("VT_ARCDnc").setSelectedItem("");
				} else {
					this.getView().byId("VT_ARCDnc").setVisible(false);
					this.getView().byId("VT_ARCDnc").setEnabled(false);
					this.getView().byId("VT_ARCDnc").setSelectedKey("");
					this.getView().byId("VT_ARCDnc").setSelectedItem("");
				}
				/*	this.getView().byId("VT_ARCTtrdinStatus").setModel(oStatusModel);*/
				this.getView().byId("VT_ARCTtrdinRet").setModel(oStatusModel);
				/*this.getView().byId("VT_ARCTDnc").setModel(oStatusModel);*/

				// this.getView().byId("VT_ARCDnc").setModel(oStatusModel);  GSR0605

				this.getView().byId("SimpleFormAproveTrReq").bindElement("/");
				this.getView().byId("SimpleForrmDisa220").setModel(sap.ui.getCore().getModel("TradeRequestedHistory"));
				this.getView().byId("SimpleForrmDisa220").bindElement("/");
				//	var StatusData = sap.ui.getCore().getModel("MyTradeRequested").getData();

				var Tradeid = sap.ui.getCore().getModel("TradeRequestedHistory").getData().Trade_Id;
				this.Tradeid = Tradeid;
				var Add_CommentStatus = sap.ui.getCore().getModel("TradeRequestedHistory").getData().Trade_Status;
				this.getView().byId("oAddbutton").setEnabled(false);
				this.getView().byId("oComments").setEnabled(false);
				this.getView().byId("oacceptbtn").setVisible(false);
				this.getView().byId("oRejectbtn").setVisible(false);
				this.getView().byId("oCounterofrbtn").setVisible(false);
				this.getView().byId("oCancelbtn").setVisible(false);
				this.getView().byId("oUpdatebtn").setVisible(false);
				this.getView().byId("oBackbtnid").setEnabled(true);
				this.getView().byId("oBackbtnid").setVisible(true);
				/* lates changes
				this.getView().byId("oAddbutton").setEnabled(true);
				this.getView().byId("oacceptbtn").setVisible(true);
				this.getView().byId("oRejectbtn").setVisible(true);
				this.getView().byId("oCounterofrbtn").setVisible(true);
				this.getView().byId("oCancelbtn").setVisible(true);
				this.getView().byId("oUpdatebtn").setVisible(true);
				this.getView().byId("oBackbtnid").setEnabled(false);
				this.getView().byId("oBackbtnid").setVisible(false);*/
				/*	this.getView().byId("VT_ARCTtrdinRet").setEnabled(true);*/

				/*	if (Add_CommentStatus == "C" || Add_CommentStatus == "S") {
						this.getView().byId("oAddbutton").setEnabled(true);
					} else {
						this.getView().byId("oAddbutton").setEnabled(false);
					}*/
				var that = this;
				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");

				if (sLocation_conf == 0) {
					this.sPrefix = "/VehicleLocator_Xsodata";
				} else {
					this.sPrefix = "";

				}
				this.nodeJsUrl = this.sPrefix;
				that.oDataUrl = "/odata/v2/vehicleTrade/Trade_Comment?$filter=Trade_Id eq '" + this.Tradeid + "'";
				// that.oDataUrl = "/odata/v2/vehicleTrade/Trade_Comment";
				$.ajax({
					url: that.oDataUrl,
					method: "GET",
					async: false,
					dataType: "json",

					success: function (oData) {

						
						var Data = oData.d.results;
						var Trade_Comment = Data.filter(function (x) {
							return x["Trade_Id"] == Tradeid;
						});
						var oModel = new sap.ui.model.json.JSONModel(Trade_Comment);
						// that.getView().byId("tableVrade").setModel(oModel);
						that.getView().setModel(oModel, "commentsModel");
					},

					error: function (jqXHR, textStatus, errorThrown) {
						var Trade_Comment = [];
						var oModel = new sap.ui.model.json.JSONModel(Trade_Comment);

						that.getView().setModel(oModel, "commentsModel");

					}

					// when there is an error on this xsodata call just reset the data. GSR

					// var oModel = new sap.ui.model.json.JSONModel(Trade_Comment);
					// // that.getView().byId("tableVrade").setModel(oModel);
					// that.getView().setModel(oModel, "commentsModel");	

				});

			}

			// for zone user. 
			var confirmZoneUser = sap.ui.getCore().getModel("LoginBpDealerModel").oData["0"].BusinessPartnerName;
			if (confirmZoneUser.includes("Zone User") || confirmZoneUser.includes("National")) {
				// just disable all the buttons
				this.getView().byId("oAddbutton").setEnabled(false);
				//this.getView().byId("oUpdatePagebtn").setEnabled(false);
			}

			// for zone user. 

			var confirmZoneUser = sap.ui.getCore().getModel("LoginBpDealerModel").oData["0"].BusinessPartnerName;
			if (confirmZoneUser.includes("Zone User") || confirmZoneUser.includes("National")) {
				// just disable all the buttons
				this.getView().byId("oAddbutton").setEnabled(false);
				this.getView().byId("oacceptbtn").setVisible(false);
				this.getView().byId("oRejectbtn").setVisible(false);
				this.getView().byId("oCounterofrbtn").setVisible(false);
				this.getView().byId("oCancelbtn").setVisible(false);
				this.getView().byId("oUpdatebtn").setVisible(false);
				this.getView().byId("oBackbtnid").setEnabled(true);
				this.getView().byId("oComments").setEnabled(false);

			}

		},

		oAddCommentsArea: function () {
			var Comment = this.getView().byId("oComments").getValue();
			if (Comment == "") {

				var sTextFromi18n = this.getView().getModel("i18n").getResourceBundle().getText("pleaseEnterComment");
				sap.m.MessageBox.error(sTextFromi18n); //"Please enter comment"
			} else {

				// if (this.getView().byId("tableVrade").getModel() != undefined) {
				// var CommentData = this.getView().byId("tableVrade").getModel().getData();
				if (this.getView().byId("tableVrade").getModel("commentsModel") != undefined) {
					var CommentData = this.getView().byId("tableVrade").getModel("commentsModel").getData();

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
						var oComment_Id = incrementvalue = ("00" + incrementvalue).slice(-2);
					} else {
						var oComment_Id = "01";
					}
					var TradeId = this.Tradeid;
					console.log("TradeId", TradeId);
					var that = this;

					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd'T'HH:mm:ss"
					});
					var oCommentdate = new Date(oDateFormat.format(new Date()));
					oCommentdate.setDate(oCommentdate.getDate());
					/*	var oCreatedby = this.getView().byId("SimpleFormAproveTrReq").getModel().getData().Created_By;*/
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

					var oTradeComment = {

						"Trade_Id": TradeId,
						"Comment_Id": oComment_Id,
						"Comment_Txt": Comment,
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
					that.oDataUrl = "/odata/v2/vehicleTrade";

					that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
					that.oDataModel.setHeaders({
						"Content-Type": "application/json",
						"X-Requested-With": "XMLHttpRequest",
						"DataServiceVersion": "2.0",
						"Accept": "application/json",
						"Method": "POST"
					});

					that.oDataModel.create("/Trade_Comment", oTradeComment, null, function (s) {
						/*	var that = this;*/
						var sLocation = window.location.host;
						var sLocation_conf = sLocation.search("webide");

						if (sLocation_conf == 0) {
							that.sPrefix = "/VehicleLocator_Xsodata";
						} else {
							that.sPrefix = "";

						}
						that.nodeJsUrl = that.sPrefix;
						that.oDataUrl = "/odata/v2/vehicleTrade/Trade_Comment?$filter=Trade_Id eq '" + that.Tradeid + "'";

						$.ajax({
							url: that.oDataUrl,
							method: "GET",
							async: false,
							dataType: "json",

							success: function (oData) {

								
								var Data = oData.d.results;

								// console.log("additional Comment", 	this.oViewModel);
								console.log("trade id", TradeId);

								var oComTrade_Comment = Data.filter(function (x) {
									return x["Trade_Id"] == TradeId;
								});

								var oModel = new sap.ui.model.json.JSONModel(oComTrade_Comment);
								/*	oModel.updateBindings(true);*/
								// that.getView().byId("tableVrade").setModel(oModel);
								that.getView().setModel(oModel, "commentsModel");
							}
						});

						//we need the comments to be cleared after database save. 		
						that.getView().byId("oComments").setValue(""); //1804	

						// that.getView().byId("oComments").setValue("");
						/*	var oComModel = new sap.ui.model.json.JSON();*/

					}, function () {

					});

					/*	this.getView().byId("Comment_Txt").setValue("");	
					 */
				}
				//update the bindings. 

				var oModelData = this.getView().getModel("commentsModel");

				oModelData.refresh(true);
				oModelData.updateBindings(true);
			}
		},

		onTradeReqStat: function () {
			var selVT_CStradinRet = this.getView().byId("VT_CStradinRet").getSelectedKey();
			if (selVT_CStradinRet == "Yes") {
				this.getView().byId("oSeleBtn").setEnabled(true);

			} else if (selVT_CStradinRet == "No") {
				this.getView().byId("oSeleBtn").setEnabled(false);
			}

		},
		oUpdateTradeRequest: function () {
			var SimpleFormAproveTrReq = this.getView().byId("SimpleFormAproveTrReq").getModel();
			var CommentTableData = this.getView().byId("tableVrade").getModel("commentsModel");
			sap.ui.getCore().setModel(SimpleFormAproveTrReq, "SelectedSimpleFormAproveTrReq");
			sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").setProperty("/SelectedTradeComment", CommentTableData);
			this.getRouter().navTo("VehicleTrade_UpdtTradReq", {
				SelectedTrade: "VehicleTrade_ApprvTradeVehicle"
			});

		},
		oAccept: function () {
			
			//  dated June 4th.  
			sap.ui.core.BusyIndicator.show();
			// also disable the accept button, preventing the user not to double click. 
			this.getView().byId("oacceptbtn").setVisible(false);
			this.getView().byId("oRejectbtn").setVisible(false);
			this.getView().byId("oCounterofrbtn").setVisible(false);
			// 05-05 if an Update has been pressed just take the comments to HDB
			var Comment = this.getView().byId("oComments").getValue();
			if (Comment !== "") {
				this.oAddCommentsArea();
			}

			var that = this;

			//2204 - 
			var RequstingDealer_Actual = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer; // new changes
			var RequstedDealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;

			/*	var OwningDealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;*/

			// var RequstedDealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
			/*var oVehTrano = this.getView().byId("ovtnId").getText();*/
			if (this.getView().byId("SimpleFormAproveTrReq").getModel().oData.VTN == undefined) {
				var oVehTrano = "";
				RequstedDealer = "";
				/*var oModelyear = this.getView().byId("oMdlyear").getText();*/
				var oModelyear = "";

				var oSuffixcode = "";

				var oModelcode = "";

				/*	var oIntcolorcode = this.getView().byId("intdesr").gettext();*/
				var oExtcolorcode = "";

				/*	var oApx = this.getView().byId("oapx").getText();*/
				var oApx = "";
				var oInstall = "";
				var oIntcolorcode = "";
			} else {
				var oVehTrano = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.VTN;

				/*var oModelyear = this.getView().byId("oMdlyear").getText();*/
				var oModelyear = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Model_Year;

				var oSuffixcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Suffix;

				var oModelcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Model;

				/*	var oIntcolorcode = this.getView().byId("intdesr").gettext();*/
				var oExtcolorcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Ext_Colour;

				/*	var oApx = this.getView().byId("oapx").getText();*/
				var oApx = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.APX;
				var oInstall = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.AccessoryInstalled;
				var oIntcolorcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Int_Colour;
			}
			if (sap.ui.getCore().getModel("ApprovRej").getProperty("/OffredVehicle") != {} && Object.keys(sap.ui.getCore().getModel("ApprovRej")
					.getProperty("/OffredVehicle")).length !== 0) {
				var RequestingDealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Requesting_Dealer;
				var oWningVTN = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Offered_Vtn;
				var oWnModelyear = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Model_Year;
				var oWnSuffixcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Suffix;
				var oWnModelcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Model;
				var oWnoExtcolorcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Ext_Colour;
				var oWnoApx = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.APX;
				var oAccInstall = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.AccessoryInstalled;
				var oWnoIntcolorcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Int_Colour;
				RequstingDealer_Actual = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Requested_Dealer;
				// RequstedDealer="";
				// 	var oVehTrano = "";

				// /*var oModelyear = this.getView().byId("oMdlyear").getText();*/
				// var oModelyear = "";

				// var oSuffixcode = "";

				// var oModelcode = "";

				// /*	var oIntcolorcode = this.getView().byId("intdesr").gettext();*/
				// var oExtcolorcode = "";

				// /*	var oApx = this.getView().byId("oapx").getText();*/
				// var oApx = "";
				// var oInstall = "";
				// var oIntcolorcode = "";
			} else {
				var RequestingDealer = "";
				var oWningVTN = "";
				var oWnModelyear = "";
				var oWnSuffixcode = "";
				var oWnModelcode = "";
				var oWnoExtcolorcode = "";
				var oWnoApx = "";
				var oAccInstall = "";
				var oWnoIntcolorcode = "";

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

			//that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

			//lets get the 

			var loggedUserId = sap.ui.getCore().getModel("userIDDetails").oData["0"].userId;

			// and UpdatedBy eq 'ARSULP'&$format=json      

			var AcceptUrl = that.oDataUrl + "/ApproveTradeReqSet?$filter=RequestingDel eq '" + RequstingDealer_Actual +
				"' and (VehiclesOwningDelear eq '" + RequstedDealer + "'or VehiclesOwningDelear eq '" + RequestingDealer +
				"' ) and (Suffixcode eq '" + oSuffixcode + "' or Suffixcode eq '" + oWnSuffixcode + "' )and (Modelyear eq '" + oModelyear +
				"' or Modelyear eq '" + oWnModelyear + "')  and (Modelcode eq '" + oModelcode + "' or Modelcode eq '" + oWnModelcode +
				"' )and ( Interiorcolorcode eq '" + oIntcolorcode + "' or Interiorcolorcode eq '" + oWnoIntcolorcode +
				"') and ( Exteriorcolorcode eq '" + oExtcolorcode + "' or Exteriorcolorcode eq '" + oWnoExtcolorcode + "' ) and ( APX eq '" + oApx +
				"' or APX eq '" + oWnoApx + "' )  and ( VTN eq '" + oVehTrano + "' or VTN eq '" + oWningVTN + "') and ( UpdatedBy eq '" +
				loggedUserId + "') &$format=json";

			$.ajax({
				url: AcceptUrl,
				type: "GET",
				dataType: 'json',
				xhrFields: //
				{
					withCredentials: true
				},

				success: function (odata, oresponse) {

					var a = odata.d.results[0].MessageType;

					if (a == "E") {
						var Message = odata.d.results[0].Message.trim();

						// ======================== code to translate into french ===========================			
						if (that.sCurrentLocale == 'FR') {
							if (Message.includes("vehicle(s) has been marked sold") == true) {
								Message = "Échange non complété - le(s) véhicule(s) a été (ont été) marqué(s) comme étant vendu(s).";

							} else if (Message.includes("VTN Not in Allocation table") == true) {
								Message = "Le VTN ne figure pas dans la table d'attribution";

							} else if (Message.includes("status has changed to non-routable") == true) {
								Message = "Échange non complété - le statut du (des) véhicule(s) a changé et ne peut plus être acheminé";

								// } else if (Message.includes("Trade completed from VTN") == true) {
								// 	// Message = "Tirez le véhicule terminé du concessionnaire à la zone d'inventaire";   //  
								// 		Message = "Le dossier a été extrait dans la zone du code.";

							} else if (Message.includes("vehicle(s) configuration (model, suffix, colour, apx) has changed") == true) {
								Message = "Échange non complété - la configuration du (des) véhicule(s) (modèle, suffixe, couleur, APX) a changé";

							} else if (Message.includes("vehicle(s) no longer in Dealers pipeline / inventory") == true) {
								Message =
									"Échange non complété - le(s) véhicule(s) n'est (ne sont) plus dans la chaîne d'approvisionnement/les stocks du concessionnaire";

							} else {

								Message = Message; // what ever comes
							}
						}

						//  cod eto translate into french.================================= end=====================
						function fnCallbackMessageBox(oAction) {
							that.getRouter().navTo("VehicleTrade_Summary", {
								DataClicked: "Yes"
							});

						}
						sap.m.MessageBox.information(Message, {

							actions: [sap.m.MessageBox.Action.OK],
							onClose: fnCallbackMessageBox
						});
						that.AcceptFailedComment(Message);
						that.AcceptFailed();

						//	sap.m.MessageBox.error(Message);
					} else if (a == "S") {

						if (that.sCurrentLocale == 'FR') {
							var sMessageText = that.getView().getModel("i18n").getResourceBundle().getText("messageTradeAccepted", [that.Tradeid]);
							sMessageText = sMessageText.replace("({0})", that.Tradeid); // for french the control is not doing the right thing ui bug
						} else {
							var sMessageText = that.getView().getModel("i18n").getResourceBundle().getText("messageTradeAccepted", [that.Tradeid]);
						}

						var Message = sMessageText;
						// var Message =  "Trade " + that.Tradeid + " has been Accepted Succesfully";
						that.AcceptSuccess();

						function fnCallbackMessageBox1(oAction) {

							that.getRouter().navTo("VehicleTrade_Summary", {
								DataClicked: "Yes"
							});

						}
						sap.m.MessageBox.success(Message, {
							actions: [sap.m.MessageBox.Action.OK],
							onClose: fnCallbackMessageBox1
						});
						

					}
				},
				error: function (err) {
					if (err.status === 504 || err.statusCode === 504) {
						var Message = that.getView().getModel("i18n").getResourceBundle().getText("messageTradeTimeOut", [that.Tradeid]);
						sap.m.MessageBox.error(Message, {
							actions: [sap.m.MessageBox.Action.OK],
							onClose: function () {

								that.getRouter().navTo("VehicleLocSearch");
							}
						});
					}
				}

			});

		},
		AcceptFailedComment: function (Message) {

			var Comment = Message;
			if (this.getView().byId("tableVrade").getModel("commentsModel") != undefined) {
				var CommentData = this.getView().byId("tableVrade").getModel("commentsModel").getData();

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
					var oComment_Id = incrementvalue = ("00" + incrementvalue).slice(-2);
				} else {
					var oComment_Id = "01";
				}
				var TradeId = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Id;

				var that = this;

				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd'T'HH:mm:ss"
				});
				var oCommentdate = oDateFormat.format(new Date());
				/*	var oCreatedby = this.getView().byId("SimpleFormAproveTrReq").getModel().getData().Created_By;*/
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

				var oTradeComment = {

					"Trade_Id": TradeId,
					"Comment_Id": oComment_Id,
					"Comment_Txt": Comment,
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
				that.oDataUrl = "/odata/v2/vehicleTrade";

				that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
				that.oDataModel.setHeaders({
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest",
					"DataServiceVersion": "2.0",
					"Accept": "application/json",
					"Method": "POST"
				});

				that.oDataModel.create("/Trade_Comment", oTradeComment, null, function (s) {
					/*	that.TradeComment(oEntry);
					this.getView().byId("Comment_Txt").setValue("");
							that.VehicleTrade_Summary();*/
					//	that.getRouter().navTo("VehicleTrade_Summary");
					that.getView().byId("oComments").setValue("");
				}, function () {

				});

				/*	this.getView().byId("Comment_Txt").setValue("");	
				 */
			}
			//	}
			// at this point hide the busyh indictor and relaod the page. 	
			sap.ui.core.BusyIndicator.hide();
			that.getRouter().navTo("VehcTrad_Apprv_Rej_CounTrad", {
				DataClicked: "Yes"
			});

		},
		AcceptSuccess: function () {

			//  put the accept button to gre mode.  -- GSR
			// this.getView().byId("oacceptbtn").setEnable(false);
			// this.getView().byId("oRejectbtn").setEnable(false);
			// this.getView().byId("oCounterofrbtn").setEnable(false);

			var that = this;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});

			var Trade_Id = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Id;
			var Trade_Status = "A";

			if (this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn == undefined) {
				var Requesting_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer;
				var Requesting_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer_Name;

				var Requested_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn;
				var Requested_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Requested_Vtn;
				var Offered_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Offered_Vtn;
				var Trade_Return = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Trade_Return;
				var Req_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Current_ETA_From;
				Req_Current_ETA_From = this.DatesFormatting(Req_Current_ETA_From);
				var Req_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Current_ETA_To;
				Req_Current_ETA_To = this.DatesFormatting(Req_Current_ETA_To);
				var Req_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Proposed_ETA_From;
				Req_Proposed_ETA_From = this.DatesFormatting(Req_Proposed_ETA_From);
				var Req_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Proposed_ETA_To;
				Req_Proposed_ETA_To = this.DatesFormatting(Req_Proposed_ETA_To);
				var Off_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Current_ETA_From;
				Off_Current_ETA_From = this.DatesFormatting(Off_Current_ETA_From);
				var Off_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Current_ETA_To;
				Off_Current_ETA_To = this.DatesFormatting(Off_Current_ETA_To);
				var Off_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Proposed_ETA_From;
				Off_Proposed_ETA_From = this.DatesFormatting(Off_Proposed_ETA_From);
				var Off_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Proposed_ETA_To;
				Off_Proposed_ETA_To = this.DatesFormatting(Off_Proposed_ETA_To);
				// when updating a record do not update the created by and created on - GSR				
				var Created_By = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Created_By;

				/*	var Created_By = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');*/

				// 	 var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
				// 		var LoggedinUserLname =  sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
				// 		var Created_By  = LoggedinUserFname+LoggedinUserLname;

				// 		function truncateString(str, num) {
				// 			if (num > str.length) {
				// 				return str;
				// 			} else {
				// 				str = str.substring(0, num);
				// 				return str;
				// 			}

				// 		}

				// Created_By = truncateString(Created_By, 12);

				var Created_On = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Created_On;
				/*	Created_On = this.DatesFormatting(Created_On);*/
				//	Created_On.setDate(Created_On.getDate() + 1);
				//	var Changed_on = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;
				var Requested_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Requested_Dealer;
				var Requested_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Requested_Dealer_Name;

				var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
				//	 var Created_On = oDateFormat.format(new Date(ValidTo));
				/*	var Trade_Status = "R";*/
				//	}
				var Changed_on = new Date(oDateFormat.format(new Date()));
				Changed_on = oDateFormat.format(new Date(Changed_on));

			} else {
				var Requesting_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer;
				var Requesting_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer_Name;

				var Requested_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn;
				var Offered_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Offered_Vtn;
				var Trade_Return = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Return;
				var Req_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_From;
				Req_Current_ETA_From = this.DatesFormatting(Req_Current_ETA_From);
				var Req_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_To;
				Req_Current_ETA_To = this.DatesFormatting(Req_Current_ETA_To);
				var Req_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_From;
				Req_Proposed_ETA_From = this.DatesFormatting(Req_Proposed_ETA_From);
				var Req_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_To;
				Req_Proposed_ETA_To = this.DatesFormatting(Req_Proposed_ETA_To);
				var Off_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_From;

				Off_Current_ETA_From = this.DatesFormatting(Off_Current_ETA_From);
				var Off_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_To;
				Off_Current_ETA_To = this.DatesFormatting(Off_Current_ETA_To);
				var Off_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_From;
				Off_Proposed_ETA_From = this.DatesFormatting(Off_Proposed_ETA_From);
				var Off_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_To;
				Off_Proposed_ETA_To = this.DatesFormatting(Off_Proposed_ETA_To);
				// when updating a record do not update the created by and created on - GSR					
				var Created_By = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_By;
				if (Created_By == undefined) {
					Created_By = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Created_By;

				}
				//  var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
				// var LoggedinUserLname =  sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
				// var Created_By  = LoggedinUserFname+LoggedinUserLname;

				// function truncateString(str, num) {
				// 	if (num > str.length) {
				// 		return str;
				// 	} else {
				// 		str = str.substring(0, num);
				// 		return str;
				// 	}

				// }

				// Created_By = truncateString(Created_By, 12);

				var Created_On = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_On;

				Created_On = this.DatesFormattingCreatedOnDate(Created_On);

				/*	Created_On = this.DatesFormatting(Created_On);*/
				//	var Changed_on = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;
				var Requested_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
				var Requested_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer_Name;

				var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
				//	 var Created_On = oDateFormat.format(new Date(ValidTo));
				/*	var Trade_Status = "R";*/
				//	}
				var Changed_on = new Date(oDateFormat.format(new Date()));
				Changed_on = oDateFormat.format(new Date(Changed_on));
			}
			var oEntry = {};
			/*
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
				"Created_On": Created_On,

				"Changed_on": new Date(Changed_on),
				"Requested_Dealer": Requested_Dealer,
				"Requested_Dealer_Name": Requested_Dealer_Name

			};*/

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				that.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				that.sPrefix = "";

			}
			//	that.nodeJsUrl = that.sPrefix + "/vehicleTrade";
			that.nodeJsUrl = that.sPrefix;
			that.oDataUrl = "/odata/v2/vehicleTrade";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

			var UpdatedTreadeEntity = "/Trade_Request('" + Trade_Id + "')";

			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "GET"
			});
			that.oDataModel.read(UpdatedTreadeEntity, {
				success: function (odata) {
					//	odata=odata.results[0];
					that.oDataModel.setHeaders({
						"Content-Type": "application/json",
						"X-Requested-With": "XMLHttpRequest",
						"DataServiceVersion": "2.0",
						"Accept": "application/json",
						"Method": "PUT"
					});
					var oEntry = {

						"Trade_Id": odata.Trade_Id,
						"Trade_Status": Trade_Status,
						"Requesting_Dealer": odata.Requesting_Dealer,
						"Requesting_Dealer_Name": odata.Requesting_Dealer_Name,
						"Requested_Vtn": odata.Requested_Vtn,
						"Offered_Vtn": odata.Offered_Vtn,
						"Trade_Return": odata.Trade_Return,
						"Req_Current_ETA_From": odata.Req_Current_ETA_From,
						"Req_Current_ETA_To": odata.Req_Current_ETA_To,
						"Req_Proposed_ETA_From": odata.Req_Proposed_ETA_From,
						"Req_Proposed_ETA_To": odata.Req_Proposed_ETA_To,
						"Off_Current_ETA_From": odata.Off_Current_ETA_From,
						"Off_Current_ETA_To": odata.Off_Current_ETA_To,
						"Off_Proposed_ETA_From": odata.Off_Proposed_ETA_From,
						"Off_Proposed_ETA_To": odata.Off_Proposed_ETA_To,

						"Created_By": odata.Created_By,
						"Created_On": odata.Created_On,

						"Changed_on": new Date(Changed_on),
						"Requested_Dealer": odata.Requested_Dealer,
						"Requested_Dealer_Name": odata.Requested_Dealer_Name

					};
					that.oDataModel.update(UpdatedTreadeEntity, oEntry, {
						merge: true
					}, function (s) {
						//	that.VehicleTrade_SummaryData();

						that.getView().byId("SimpleFormAproveTrReq").getModel().getData().Trade_Status = "A";
						that.getView().byId("SimpleFormAproveTrReq").getModel().refresh(true);

						/*	that.TradeComment(oEntry);
							that.TradeVehcles(oEntry);
							that.TradeStatus(oEntry);
							that.VehicleTrade_Summary();
						*/
						/*	that.getRouter().navTo("VehicleTrade_Summary", {
								DataClicked: "Yes"
							});*/

						//	that.getRouter().navTo("VehicleTrade_Summary");
					}, function (err) {
						console.log(err);
					});
				},
				error: function (err) {
					console.log(err);
				}
			});

			// at this point hide the busyh indictor and relaod the page. 	
			sap.ui.core.BusyIndicator.hide();
			//		  that.getRouter().navTo("VehcTrad_Apprv_Rej_CounTrad", {
			// 	DataClicked: "Yes"
			// });

		},
		AcceptFailed: function () {

			var that = this;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var Trade_Id = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Id;
			var Trade_Status = "F";
			var Requesting_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer;
			var Requesting_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer_Name;
			if (this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn == undefined) {

				var Requested_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Requested_Vtn;
				var Offered_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Offered_Vtn;
				var Trade_Return = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Trade_Return;
				var Req_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Current_ETA_From;
				Req_Current_ETA_From = this.DatesFormatting(Req_Current_ETA_From);
				var Req_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Current_ETA_To;
				Req_Current_ETA_To = this.DatesFormatting(Req_Current_ETA_To);
				var Req_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Proposed_ETA_From;
				Req_Proposed_ETA_From = this.DatesFormatting(Req_Proposed_ETA_From);
				var Req_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Proposed_ETA_To;
				Req_Proposed_ETA_To = this.DatesFormatting(Req_Proposed_ETA_To);
				var Off_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Current_ETA_From;
				Off_Current_ETA_From = this.DatesFormatting(Off_Current_ETA_From);
				var Off_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Current_ETA_To;
				Off_Current_ETA_To = this.DatesFormatting(Off_Current_ETA_To);
				var Off_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Proposed_ETA_From;
				Off_Proposed_ETA_From = this.DatesFormatting(Off_Proposed_ETA_From);
				var Off_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Proposed_ETA_To;
				Off_Proposed_ETA_To = this.DatesFormatting(Off_Proposed_ETA_To);
				// when updating a record do not update the created by and created on - GSR				
				var Created_By = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Created_By;

				/*	var Created_By = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');*/

				// 	 var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
				// 		var LoggedinUserLname =  sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
				// 		var Created_By  = LoggedinUserFname+LoggedinUserLname;

				// 		function truncateString(str, num) {
				// 			if (num > str.length) {
				// 				return str;
				// 			} else {
				// 				str = str.substring(0, num);
				// 				return str;
				// 			}

				// 		}

				// Created_By = truncateString(Created_By, 12);

				var Created_On = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Created_On;
				/*	Created_On = this.DatesFormatting(Created_On);*/
				//	Created_On.setDate(Created_On.getDate() + 1);
				//	var Changed_on = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;
				var Requested_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Requested_Dealer;
				var Requested_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Requested_Dealer_Name;

				var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
				//	 var Created_On = oDateFormat.format(new Date(ValidTo));
				/*	var Trade_Status = "R";*/
				//	}
				var Changed_on = new Date(oDateFormat.format(new Date()));
				Changed_on = oDateFormat.format(new Date(Changed_on));

			} else {
				var Requested_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn;
				var Offered_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Offered_Vtn;
				var Trade_Return = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Return;
				var Req_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_From;
				Req_Current_ETA_From = this.DatesFormatting(Req_Current_ETA_From);
				var Req_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_To;
				Req_Current_ETA_To = this.DatesFormatting(Req_Current_ETA_To);
				var Req_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_From;
				Req_Proposed_ETA_From = this.DatesFormatting(Req_Proposed_ETA_From);
				var Req_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_To;
				Req_Proposed_ETA_To = this.DatesFormatting(Req_Proposed_ETA_To);
				var Off_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_From;
				Off_Current_ETA_From = this.DatesFormatting(Off_Current_ETA_From);
				var Off_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_To;
				Off_Current_ETA_To = this.DatesFormatting(Off_Current_ETA_To);
				var Off_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_From;
				Off_Proposed_ETA_From = this.DatesFormatting(Off_Proposed_ETA_From);
				var Off_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_To;
				Off_Proposed_ETA_To = this.DatesFormatting(Off_Proposed_ETA_To);
				// when updating a record do not update the created by and created on - GSR				
				var Created_By = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_By;

				/*	var Created_By = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');*/

				// 	 var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
				// 		var LoggedinUserLname =  sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
				// 		var Created_By  = LoggedinUserFname+LoggedinUserLname;

				// 		function truncateString(str, num) {
				// 			if (num > str.length) {
				// 				return str;
				// 			} else {
				// 				str = str.substring(0, num);
				// 				return str;
				// 			}

				// 		}

				// Created_By = truncateString(Created_By, 12);

				var Created_On = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_On;
				/*	Created_On = this.DatesFormatting(Created_On);*/
				//	Created_On.setDate(Created_On.getDate() + 1);
				//	var Changed_on = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;
				var Requested_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
				var Requested_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer_Name;

				var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
				//	 var Created_On = oDateFormat.format(new Date(ValidTo));
				/*	var Trade_Status = "R";*/
				//	}
				var Changed_on = new Date(oDateFormat.format(new Date()));
				Changed_on = oDateFormat.format(new Date(Changed_on));
			}
			//	Changed_on.setDate(Changed_on.getDate() + 1);
			/*	var oEntry = {

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
				"Created_On": Created_On,
				"Changed_on": new Date(Changed_on),
				"Requested_Dealer": Requested_Dealer,
				"Requested_Dealer_Name": Requested_Dealer_Name

			};
*/
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				that.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				that.sPrefix = "";

			}
			//	that.nodeJsUrl = that.sPrefix + "/vehicleTrade";
			that.nodeJsUrl = that.sPrefix;
			that.oDataUrl = "/odata/v2/vehicleTrade";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

			var UpdatedTreadeEntity = "/Trade_Request('" + Trade_Id + "')";

			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "GET"
			});
			that.oDataModel.read(UpdatedTreadeEntity, {
				success: function (odata) {
					that.oDataModel.setHeaders({
						"Content-Type": "application/json",
						"X-Requested-With": "XMLHttpRequest",
						"DataServiceVersion": "2.0",
						"Accept": "application/json",
						"Method": "PUT"
					});
					var oEntry = {

						"Trade_Id": odata.Trade_Id,
						"Trade_Status": Trade_Status,
						"Requesting_Dealer": odata.Requesting_Dealer,
						"Requesting_Dealer_Name": odata.Requesting_Dealer_Name,
						"Requested_Vtn": odata.Requested_Vtn,
						"Offered_Vtn": odata.Offered_Vtn,
						"Trade_Return": odata.Trade_Return,
						"Req_Current_ETA_From": odata.Req_Current_ETA_From,
						"Req_Current_ETA_To": odata.Req_Current_ETA_To,
						"Req_Proposed_ETA_From": odata.Req_Proposed_ETA_From,
						"Req_Proposed_ETA_To": odata.Req_Proposed_ETA_To,
						"Off_Current_ETA_From": odata.Off_Current_ETA_From,
						"Off_Current_ETA_To": odata.Off_Current_ETA_To,
						"Off_Proposed_ETA_From": odata.Off_Proposed_ETA_From,
						"Off_Proposed_ETA_To": odata.Off_Proposed_ETA_To,

						"Created_By": odata.Created_By,
						"Created_On": odata.Created_On,

						"Changed_on": new Date(Changed_on),
						"Requested_Dealer": odata.Requested_Dealer,
						"Requested_Dealer_Name": odata.Requested_Dealer_Name

					};
					that.oDataModel.update(UpdatedTreadeEntity, oEntry, {
						merge: true
					}, function (s) {

						/*	that.TradeComment(oEntry);
							that.TradeVehcles(oEntry);
							that.TradeStatus(oEntry);
							that.VehicleTrade_Summary();
						*/
						/*	that.getRouter().navTo("VehicleTrade_Summary", {
					DataClicked: "Yes"
				});
*/
						//	that.getRouter().navTo("VehicleTrade_Summary");
					}, function () {

					});
				},
				error: function (err) {
					console.log(err);
				}
			});

			// at this point hide the busyh indictor and relaod the page. 	
			sap.ui.core.BusyIndicator.hide();
			that.getRouter().navTo("VehcTrad_Apprv_Rej_CounTrad", {
				DataClicked: "Yes"
			});

		},
		onReject: function () {

			var that = this;

			// also disable the accept button, preventing the user not to double click. 
			this.getView().byId("oacceptbtn").setVisible(false);
			this.getView().byId("oRejectbtn").setVisible(false);
			this.getView().byId("oCounterofrbtn").setVisible(false);

			/*	if (this.getView().byId("VT_CStradinRet").getSelectedKey() == "Yes" && this.getView().byId("FromFourth").getText() == "") {
				sap.m.MessageBox.warning("Please select a vehicle");
				return;
           }*/
			var textForDialog = this.getView().getModel("i18n").getResourceBundle().getText("rejectTradeRequest");
			var titleForDialog = this.getView().getModel("i18n").getResourceBundle().getText("confirmTitleReject");
			var yesmsg = this.getView().getModel("i18n").getResourceBundle().getText("Yes");
			var nomsg = this.getView().getModel("i18n").getResourceBundle().getText("No");
			var dialog = new Dialog({
				title: titleForDialog,
				type: 'Message',
				content: new Text({
					text: textForDialog
				}),
				beginButton: new Button({
					text: yesmsg,
					icon: 'sap-icon://message-warning',
					type: 'Accept',
					id: 'oYes',
					press: function () {

						// 05-05 if an reject has been pressed just take the comments to HDB
						var Comment = that.getView().byId("oComments").getValue();
						if (Comment !== "") {
							that.oAddCommentsArea();
						}

						/*sap.m.MessageBox.warning('Yes');*/
						var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "yyyy-MM-dd'T'HH:mm:ss"
						});
						var Trade_Id = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Id;
						var Trade_Status = "R";
						var Requesting_Dealer = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer;
						var Requesting_Dealer_Name = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer_Name;
						var Requested_Vtn = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn;
						if (that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn == undefined) {
							var Offered_Vtn = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Offered_Vtn;
							var Trade_Return = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Trade_Return;
							var Req_Current_ETA_From = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Current_ETA_From;
							Req_Current_ETA_From = that.DatesFormatting(Req_Current_ETA_From);
							var Req_Current_ETA_To = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Current_ETA_To;
							Req_Current_ETA_To = that.DatesFormatting(Req_Current_ETA_To);
							var Req_Proposed_ETA_From = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Proposed_ETA_From;
							Req_Proposed_ETA_From = that.DatesFormatting(Req_Proposed_ETA_From);
							var Req_Proposed_ETA_To = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Proposed_ETA_To;
							Req_Proposed_ETA_To = that.DatesFormatting(Req_Proposed_ETA_To);
							var Off_Current_ETA_From = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Current_ETA_From;
							Off_Current_ETA_From = that.DatesFormatting(Off_Current_ETA_From);
							var Off_Current_ETA_To = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Current_ETA_To;
							Off_Current_ETA_To = that.DatesFormatting(Off_Current_ETA_To);
							var Off_Proposed_ETA_From = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Proposed_ETA_From;
							Off_Proposed_ETA_From = that.DatesFormatting(Off_Proposed_ETA_From);
							var Off_Proposed_ETA_To = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Proposed_ETA_To;
							Off_Proposed_ETA_To = that.DatesFormatting(Off_Proposed_ETA_To);
							// when updating a record do not update the created by and created on - GSR		
							var Created_By = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Created_By;
							//var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
							// var LoggedinUserLname =  sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
							// 		var Created_By  = LoggedinUserFname+LoggedinUserLname;

							// 		function truncateString(str, num) {
							// 			if (num > str.length) {
							// 				return str;
							// 			} else {
							// 				str = str.substring(0, num);
							// 				return str;
							// 			}

							// 		}

							// Created_By = truncateString(Created_By, 12);

							var Created_On = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Created_On;
							var Changed_on = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Changed_on;
							var Requested_Dealer = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Requested_Dealer;
							var Requested_Dealer_Name = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Requested_Dealer_Name;

						} else {
							var Offered_Vtn = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Offered_Vtn;
							var Trade_Return = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Return;
							var Req_Current_ETA_From = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_From;
							Req_Current_ETA_From = that.DatesFormatting(Req_Current_ETA_From);
							var Req_Current_ETA_To = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_To;
							Req_Current_ETA_To = that.DatesFormatting(Req_Current_ETA_To);
							var Req_Proposed_ETA_From = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_From;
							Req_Proposed_ETA_From = that.DatesFormatting(Req_Proposed_ETA_From);
							var Req_Proposed_ETA_To = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_To;
							Req_Proposed_ETA_To = that.DatesFormatting(Req_Proposed_ETA_To);
							var Off_Current_ETA_From = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_From;
							Off_Current_ETA_From = that.DatesFormatting(Off_Current_ETA_From);
							var Off_Current_ETA_To = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_To;
							Off_Current_ETA_To = that.DatesFormatting(Off_Current_ETA_To);
							var Off_Proposed_ETA_From = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_From;
							Off_Proposed_ETA_From = that.DatesFormatting(Off_Proposed_ETA_From);
							var Off_Proposed_ETA_To = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_To;
							Off_Proposed_ETA_To = that.DatesFormatting(Off_Proposed_ETA_To);
							// when updating a record do not update the created by and created on - GSR		
							var Created_By = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_By;
							//var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
							// var LoggedinUserLname =  sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
							// 		var Created_By  = LoggedinUserFname+LoggedinUserLname;

							// 		function truncateString(str, num) {
							// 			if (num > str.length) {
							// 				return str;
							// 			} else {
							// 				str = str.substring(0, num);
							// 				return str;
							// 			}

							// 		}

							// Created_By = truncateString(Created_By, 12);

							var Created_On = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_On;
							var Changed_on = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;
							var Requested_Dealer = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
							var Requested_Dealer_Name = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer_Name;
						}
						var dncBlockedDays = that.getView().byId("VT_ARCDnc").getValue();
						//	 var Created_On = oDateFormat.format(new Date(ValidTo));
						/*	var Trade_Status = "R";*/
						//	}
						var Changed_on = new Date();
						Changed_on = oDateFormat.format(new Date(Changed_on));
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
							"Created_On": Created_On,
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
						//	that.nodeJsUrl = that.sPrefix + "/vehicleTrade";
						that.nodeJsUrl = that.sPrefix;
						that.oDataUrl = "/odata/v2/vehicleTrade";

						that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
						var UpdatedTreadeEntity = "/Trade_Request('" + Trade_Id + "')";

						that.oDataModel.setHeaders({
							"Content-Type": "application/json",
							"X-Requested-With": "XMLHttpRequest",
							"DataServiceVersion": "2.0",
							"Accept": "application/json",
							"Method": "GET"
						});
						that.oDataModel.read(UpdatedTreadeEntity, {
							success: function (odata) {
								//	odata=odata.results[0];
								that.oDataModel.setHeaders({
									"Content-Type": "application/json",
									"X-Requested-With": "XMLHttpRequest",
									"DataServiceVersion": "2.0",
									"Accept": "application/json",
									"Method": "PUT"
								});
								var oEntry = {

									"Trade_Id": odata.Trade_Id,
									"Trade_Status": Trade_Status,
									"Requesting_Dealer": odata.Requesting_Dealer,
									"Requesting_Dealer_Name": odata.Requesting_Dealer_Name,
									"Requested_Vtn": odata.Requested_Vtn,
									"Offered_Vtn": odata.Offered_Vtn,
									"Trade_Return": odata.Trade_Return,
									"Req_Current_ETA_From": odata.Req_Current_ETA_From,
									"Req_Current_ETA_To": odata.Req_Current_ETA_To,
									"Req_Proposed_ETA_From": odata.Req_Proposed_ETA_From,
									"Req_Proposed_ETA_To": odata.Req_Proposed_ETA_To,
									"Off_Current_ETA_From": odata.Off_Current_ETA_From,
									"Off_Current_ETA_To": odata.Off_Current_ETA_To,
									"Off_Proposed_ETA_From": odata.Off_Proposed_ETA_From,
									"Off_Proposed_ETA_To": odata.Off_Proposed_ETA_To,

									"Created_By": odata.Created_By,
									"Created_On": odata.Created_On,

									"Changed_on": new Date(Changed_on),
									"Requested_Dealer": odata.Requested_Dealer,
									"Requested_Dealer_Name": odata.Requested_Dealer_Name

								};
								that.oDataModel.update(UpdatedTreadeEntity, oEntry, {
									merge: true
								}, function (s) {
									

									if (dncBlockedDays != 0 && dncBlockedDays != "") {
										that.DNCBlockoutDays();
									}

									that.getRouter().navTo("VehicleTrade_Summary", {
										DataClicked: "Yes"
									});

									//	that.getRouter().navTo("VehicleTrade_Summary");
								}, function () {
									// alert("fail");
								});
							},
							error: function (err) {
								console.log(err);
							}
						});

						dialog.close();
					}
				}),
				endButton: new Button({
					text: nomsg,

					type: 'Reject',
					id: 'oNo',
					press: function () {
						/*	sap.m.MessageBox.warning('No');*/
						dialog.close();
						that.getView().byId("oacceptbtn").setVisible(true);
						that.getView().byId("oRejectbtn").setVisible(true);
					}
				}),
				afterClose: function () {
					dialog.destroy();
				}
			});

			dialog.open();

		},

		DNCBlockoutDays: function () {

			var that = this;
			/*	var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
		
				pattern: "yyyyMMddTHHmmss"
				});*/
			/*	pattern: "yyyyMMdd'T'HHmmss"*/

			/*	var oDateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "ddMMyyyy"
				});*/
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});

			var that = this;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";

			that.oDataUrl1 = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";
			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl1, true);
			var ModelBlockSeturl = that.oDataUrl1 + "/ModelBlockSet?$format=json";

			var ajax2 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},
				url: ModelBlockSeturl,
				async: true,
				success: function (ModelBlockSeturl) {

					var ModelBlockSeturl = ModelBlockSeturl.d.results;

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
					}

					ModelBlockSeturl.sort(dynamicSort("ZzblockId"));
					if (ModelBlockSeturl.length != 0) {
						var ZzblockId = ModelBlockSeturl[ModelBlockSeturl.length - 1].ZzblockId;

						var incrementvalue = (+ZzblockId) + 1;

						// insert leading zeroes with a negative slice
						that.ZzblockId = incrementvalue = ("0000000" + incrementvalue).slice(-8);

					} else {
						that.ZzblockId = "00000001";
					}
					that.BlocIdSuccess(that.ZzblockId);
				},
				error: function () {

				}
			});
		},
		BlocIdSuccess: function (ZzblockId) {
			var that = this;
			var oBlockId = ZzblockId;
			var BlockingDealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer;
			var BlockedDealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
			var oModelRequested = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Model;
			var oSeries = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Series;

			var oCommentData = this.getView().byId("tableVrade").getModel("commentsModel").oData;

			var oComment = "Via Trade Request";
			var BlockStartdateval = new Date();
			Date.parse(BlockStartdateval);
			var BlockStartdate = "/Date(" + Date.parse(BlockStartdateval) + ")/";

			var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
			Date.prototype.addDays = function (days) {
				this.setDate(this.getDate() + parseInt(days));
				return this;
			};
			var BlockenddateVal2 = new Date();
			BlockenddateVal2.addDays(dncBlockedDays);
			Date.parse(BlockenddateVal2);
			var Blockenddate = "/Date(" + Date.parse(BlockenddateVal2) + ")/";

			var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
			var LoggedinUserLname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
			var Createdby = LoggedinUserFname + LoggedinUserLname;

			function truncateString(str, num) {
				if (num > str.length) {
					return str;
				} else {
					str = str.substring(0, num);
					return str;
				}

			}

			Createdby = truncateString(Createdby, 12);

			/*	var Createdon = oDateFormat.format(new Date());*/
			var Createdon = "";
			var oDNSBlock = {
				"ZzblockId": oBlockId,
				"ZzblockedDlr": BlockingDealer,
				"ZzblockingDlr": BlockedDealer,
				"Zzmodel": oModelRequested,
				"Zzseries": oSeries,
				"Zzduration": dncBlockedDays,
				"Zzcomment": oComment,
				"ZzblkstartDate": BlockStartdate,
				"ZzblkendDate": Blockenddate,
				"ZcreatedBy": Createdby,
				"ZcreatedOn": Createdon

			};

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				that.sPrefix = "/vehicleLocatorNode";
			} else {
				that.sPrefix = "";

			}
			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";

			//	var AcceptUrl = that.oDataUrl + "/ModelBlockSet?$filter=ZzblockId eq'" + oBlockId + "&$format=json";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "POST"
			});
			//var oBlockId="/ModelBlockSet";
			that.oDataModel.create("/ModelBlockSet", oDNSBlock, null, function (s) {
				// alert("ok");
			}, function () {

			});

		},

		onCounterTrade: function () {

			var that = this;

			var Comment = this.getView().byId("oComments").getValue();
			if (Comment !== "") {
				this.oAddCommentsArea();
			} else {
				var sTextFromi18n = this.getView().getModel("i18n").getResourceBundle().getText("pleaseEnterComment");
				sap.m.MessageBox.error(sTextFromi18n); //"P
				return;
			}

			// also disable the accept button, preventing the user not to double click. 
			this.getView().byId("oacceptbtn").setVisible(false);
			this.getView().byId("oRejectbtn").setVisible(false);
			this.getView().byId("oCounterofrbtn").setVisible(false);

			// 05-05 if an oncountertrade has been pressed just take the comments to HDB

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var Trade_Id = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Id;
			var Trade_Status = "C";
			var Requesting_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer;
			var Requesting_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer_Name;
			var Requested_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn;
			var Offered_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Offered_Vtn;
			var Trade_Return = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Return;
			var Req_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_From;
			Req_Current_ETA_From = this.DatesFormatting(Req_Current_ETA_From);
			var Req_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_To;
			Req_Current_ETA_To = this.DatesFormatting(Req_Current_ETA_To);
			var Req_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_From;
			Req_Proposed_ETA_From = this.DatesFormatting(Req_Proposed_ETA_From);
			var Req_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_To;
			Req_Proposed_ETA_To = this.DatesFormatting(Req_Proposed_ETA_To);
			var Off_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_From;
			Off_Current_ETA_From = this.DatesFormatting(Off_Current_ETA_From);
			var Off_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_To;
			Off_Current_ETA_To = this.DatesFormatting(Off_Current_ETA_To);
			var Off_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_From;
			Off_Proposed_ETA_From = this.DatesFormatting(Off_Proposed_ETA_From);
			var Off_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_To;
			Off_Proposed_ETA_To = this.DatesFormatting(Off_Proposed_ETA_To);
			var Created_By = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_By;

			// Created_By = truncateString(Created_By, 12);
			var Created_On = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_On;
			/*	Created_On = this.DatesFormatting(Created_On);*/
			//	var Changed_on = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;
			var Requested_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
			var Requested_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer_Name;

			var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
			//	 var Created_On = oDateFormat.format(new Date(ValidTo));

			//	}
			var Changed_on = oDateFormat.format(new Date());
			/*	var Changed_on = new Date();
			Changed_on = oDateFormat.format(new Date(Changed_on));*/

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
				"Created_On": Created_On,
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
			//	that.nodeJsUrl = that.sPrefix + "/vehicleTrade";
			that.nodeJsUrl = that.sPrefix;
			that.oDataUrl = "/odata/v2/vehicleTrade";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var UpdatedTreadeEntity = "/Trade_Request('" + Trade_Id + "')";

			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "GET"
			});
			that.oDataModel.read(UpdatedTreadeEntity, {
				success: function (odata) {
					//	odata=odata.results[0];
					that.oDataModel.setHeaders({
						"Content-Type": "application/json",
						"X-Requested-With": "XMLHttpRequest",
						"DataServiceVersion": "2.0",
						"Accept": "application/json",
						"Method": "PUT"
					});
					var oEntry = {

						"Trade_Id": odata.Trade_Id,
						"Trade_Status": Trade_Status,
						"Requesting_Dealer": odata.Requesting_Dealer,
						"Requesting_Dealer_Name": odata.Requesting_Dealer_Name,
						"Requested_Vtn": odata.Requested_Vtn,
						"Offered_Vtn": odata.Offered_Vtn,
						"Trade_Return": odata.Trade_Return,
						"Req_Current_ETA_From": odata.Req_Current_ETA_From,
						"Req_Current_ETA_To": odata.Req_Current_ETA_To,
						"Req_Proposed_ETA_From": odata.Req_Proposed_ETA_From,
						"Req_Proposed_ETA_To": odata.Req_Proposed_ETA_To,
						"Off_Current_ETA_From": odata.Off_Current_ETA_From,
						"Off_Current_ETA_To": odata.Off_Current_ETA_To,
						"Off_Proposed_ETA_From": odata.Off_Proposed_ETA_From,
						"Off_Proposed_ETA_To": odata.Off_Proposed_ETA_To,

						"Created_By": odata.Created_By,
						"Created_On": odata.Created_On,

						"Changed_on": new Date(Changed_on),
						"Requested_Dealer": odata.Requested_Dealer,
						"Requested_Dealer_Name": odata.Requested_Dealer_Name

					};
					that.oDataModel.update(UpdatedTreadeEntity, oEntry, {
						merge: true
					}, function (s) {

						that.getRouter().navTo("VehicleTrade_Summary", {
							DataClicked: "Yes"
						});

					}, function () {
						alert("fail");
					});
				},
				error: function (err) {
					console.log(err);
				}
			});

		},
		onCancel: function () {

			var that = this;

			// 05-05 if an Update has been pressed just take the comments to HDB
			var Comment = this.getView().byId("oComments").getValue();
			if (Comment !== "") {
				this.oAddCommentsArea();
			}

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var Trade_Id = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Id;
			var Trade_Status = "X";
			var Requesting_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer;
			var Requesting_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer_Name;
			var Requested_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn;
			if (Requested_Vtn == undefined || Requested_Vtn == null) {
				var Offered_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Offered_Vtn;
				var Trade_Return = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Trade_Return;
				var Req_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Current_ETA_From;
				Req_Current_ETA_From = this.DatesFormatting(Req_Current_ETA_From);
				var Req_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Current_ETA_To;
				Req_Current_ETA_To = this.DatesFormatting(Req_Current_ETA_To);
				var Req_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Proposed_ETA_From;
				Req_Proposed_ETA_From = this.DatesFormatting(Req_Proposed_ETA_From);
				var Req_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Req_Proposed_ETA_To;
				Req_Proposed_ETA_To = this.DatesFormatting(Req_Proposed_ETA_To);
				var Off_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Current_ETA_From;
				Off_Current_ETA_From = this.DatesFormatting(Off_Current_ETA_From);
				var Off_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Current_ETA_To;
				Off_Current_ETA_To = this.DatesFormatting(Off_Current_ETA_To);
				var Off_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Proposed_ETA_From;
				Off_Proposed_ETA_From = this.DatesFormatting(Off_Proposed_ETA_From);
				var Off_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Off_Proposed_ETA_To;
				Off_Proposed_ETA_To = this.DatesFormatting(Off_Proposed_ETA_To);
				// when updating a record do not update the created by and created on - GSR	
				var Created_By = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Created_By;

				// Created_By = truncateString(Created_By, 12);
				var Created_On = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Created_On;
				/*	Created_On = this.DatesFormatting(Created_On);*/
				/*	var Changed_on = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;*/
				var Requested_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Requested_Dealer;
				var Requested_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Requested_Dealer_Name;

				var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
				//	 var Created_On = oDateFormat.format(new Date(ValidTo));

				//	}
				var Changed_on = oDateFormat.format(new Date());

			} else {
				var Offered_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Offered_Vtn;
				var Trade_Return = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Return;
				var Req_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_From;
				Req_Current_ETA_From = this.DatesFormatting(Req_Current_ETA_From);
				var Req_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_To;
				Req_Current_ETA_To = this.DatesFormatting(Req_Current_ETA_To);
				var Req_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_From;
				Req_Proposed_ETA_From = this.DatesFormatting(Req_Proposed_ETA_From);
				var Req_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_To;
				Req_Proposed_ETA_To = this.DatesFormatting(Req_Proposed_ETA_To);
				var Off_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_From;
				Off_Current_ETA_From = this.DatesFormatting(Off_Current_ETA_From);
				var Off_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_To;
				Off_Current_ETA_To = this.DatesFormatting(Off_Current_ETA_To);
				var Off_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_From;
				Off_Proposed_ETA_From = this.DatesFormatting(Off_Proposed_ETA_From);
				var Off_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_To;
				Off_Proposed_ETA_To = this.DatesFormatting(Off_Proposed_ETA_To);
				// when updating a record do not update the created by and created on - GSR	
				var Created_By = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_By;

				// Created_By = truncateString(Created_By, 12);
				var Created_On = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_On;
				/*	Created_On = this.DatesFormatting(Created_On);*/
				/*	var Changed_on = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;*/
				var Requested_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
				var Requested_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer_Name;

				var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
				//	 var Created_On = oDateFormat.format(new Date(ValidTo));

				//	}
				var Changed_on = oDateFormat.format(new Date());
			}
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
				"Created_On": Created_On,
				"Changed_on": new Date(Changed_on),
				"Requested_Dealer": Requested_Dealer,
				"Requested_Dealer_Name": Requested_Dealer_Name
					/*"Trade_Id": Trade_Id,
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
					"Requested_Dealer_Name": Requested_Dealer_Name*/
			};

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				that.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				that.sPrefix = "";

			}
			//	that.nodeJsUrl = that.sPrefix + "/vehicleTrade";
			that.nodeJsUrl = that.sPrefix;
			that.oDataUrl = "/odata/v2/vehicleTrade";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "PUT"
			});
			var UpdatedTreadeEntity = "/Trade_Request('" + Trade_Id + "')";
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, {
				merge: true
			}, function (s) {
				

				/*	that.TradeComment(oEntry);
					that.TradeVehcles(oEntry);
					that.TradeStatus(oEntry);
					that.VehicleTrade_Summary();
				*/
				that.getRouter().navTo("VehicleTrade_Summary", {
					DataClicked: "Yes"
				});

				//	that.getRouter().navTo("VehicleTrade_Summary");
			}, function () {
				/*	alert("fail");*/
			});

		},

		oBack: function () {
			var oPage = this.getView().byId("App_Apprvpage"); //Get Hold of page
			oPage.scrollTo(0, 0);
			//for screen 8
			if (this.oSelectedItems == "SelectedFromTradeHistory") {
				this.getRouter().navTo("VehicleTrade_History");
			} else {
				this.getRouter().navTo("VehicleTrade_Summary", {
					DataClicked: "Yes"
				});
			}
		},

		VehicleTrade_SummaryData: function (StatusData) {
			var that = this;
			local = this;
			this.StatusData = StatusData;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				this.sPrefix = "";

			}
			//Trade_Request('TR047813')
			this.nodeJsUrl = this.sPrefix;
			that.TradeRequestoDataUrl = "/odata/v2/vehicleTrade/Trade_Request('" + that.StatusData.Trade_Id + "')";
			var ajax1 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},

				/*	beforeSend: function (request) {
						request.setRequestHeader('Authorization', 'Basic ' + btoa('anisetc:anisetc'));
					},*/
				url: that.TradeRequestoDataUrl,
				async: true,
				success: function (result) {
					that.TradeRequest = result.d;
					that.TradeRequest.StatusData = that.StatusData;
					that.TradeRequest.nodeJsUrl = that.nodeJsUrl;
					console.log("TradeRequest", that.TradeRequest);
				}
			});
			$.when(ajax1).done(function (TradeRequest) {

				// local = this;
				TradeRequest = TradeRequest.d;
				var that = this;
				that.StatusData = TradeRequest.StatusData;
				if (TradeRequest.StatusData) {
					that.StatusData = TradeRequest.StatusData;
				}
				var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
				if (isLocaleSent) {
					var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
				} else {
					var sSelectedLocale = "EN"; // default is english 
				}
				if (sSelectedLocale == "fr") {

					this.sCurrentLocale = 'FR';

				} else {
					this.sCurrentLocale = 'EN';

				}

				if (!that.StatusData.SPRAS) {
					if (that.sCurrentLocale == 'EN') {
						that.StatusData.SPRAS = "E";
					} else {
						that.StatusData.SPRAS = "F";

					}
				}
				that.nodeJsUrl = TradeRequest.nodeJsUrl;
				var vtn;
				if (TradeRequest.Requested_Vtn != null) {
					vtn = TradeRequest.Requested_Vtn;
				} else {
					vtn = TradeRequest.Offered_Vtn;
				}
				if (TradeRequest.Trade_Return == "Y") {
					that.TradeVehiclesDataUrl = "/odata/v2/vehicleTrade/Vehicle(Trade_Id='" + TradeRequest.Trade_Id +
						"',VTN='" + vtn + "')";
					/*var /zc_mmfields*/
					var ajaxRequested_Vtn = $.ajax({
						dataType: "json",
						xhrFields: //
						{
							withCredentials: true
						},
						url: that.TradeVehiclesDataUrl,
						async: true,
						success: function (result) {}
					});

					//adding filters against fix for 
					if (TradeRequest.Requested_Vtn != null) {
						var query = "(Trade_Id='" + TradeRequest.Trade_Id + "',VTN='" + TradeRequest.Requested_Vtn + "',SPRAS='" + that.StatusData.SPRAS +
							"')";
						that.oTradeVehicleDescDataUrl = "/odata/v2/vehicleTrade/Vehicle_Desc" + query;
						/*	var oTradeVehicleDesc = that.oDataUrl + "/Vehicle_Desc";*/
						var ajaxRequested_Vtn3 = $.ajax({
							dataType: "json",
							xhrFields: //
							{
								withCredentials: true
							},
							url: that.oTradeVehicleDescDataUrl,
							async: true,
							success: function (result) {},
							error: function (err) {}
						});
					}
					that.TradeVehiclesDataUrl = "/odata/v2/vehicleTrade/Vehicle(Trade_Id='" + TradeRequest.Trade_Id +
						"',VTN='" + TradeRequest.Offered_Vtn + "')";
					/*var /zc_mmfields*/
					var ajaxOffered_Vtn = $.ajax({
						dataType: "json",
						xhrFields: //
						{
							withCredentials: true
						},
						url: that.TradeVehiclesDataUrl,
						async: true,
						success: function (result) {}
					});

					//adding filters against fix for 
					var query = "(Trade_Id='" + TradeRequest.Trade_Id + "',VTN='" + TradeRequest.Offered_Vtn + "',SPRAS='" + that.StatusData.SPRAS +
						"')";
					that.oTradeVehicleDescDataUrl = "/odata/v2/vehicleTrade/Vehicle_Desc" + query;
					/*	var oTradeVehicleDesc = that.oDataUrl + "/Vehicle_Desc";*/
					var ajaxOffered_Vtn3 = $.ajax({
						dataType: "json",
						xhrFields: //
						{
							withCredentials: true
						},
						url: that.oTradeVehicleDescDataUrl,
						async: true,
						success: function (result) {},
						error: function (err) {}
					});
				} else {
					//(Trade_Id='TR047813',VTN='52800')
					that.TradeVehiclesDataUrl = "/odata/v2/vehicleTrade/Vehicle(Trade_Id='" + TradeRequest.Trade_Id +
						"',VTN='" + vtn + "')";
					/*var /zc_mmfields*/
					var ajaxRequested_Vtn = $.ajax({
						dataType: "json",
						xhrFields: //
						{
							withCredentials: true
						},
						url: that.TradeVehiclesDataUrl,
						async: true,
						success: function (result) {}
					});

					//adding filters against fix for 
					var query = "(Trade_Id='" + TradeRequest.Trade_Id + "',VTN='" + vtn + "',SPRAS='" + that.StatusData.SPRAS +
						"')";
					that.oTradeVehicleDescDataUrl = "/odata/v2/vehicleTrade/Vehicle_Desc" + query;
					/*	var oTradeVehicleDesc = that.oDataUrl + "/Vehicle_Desc";*/
					var ajaxRequested_Vtn3 = $.ajax({
						dataType: "json",
						xhrFields: //
						{
							withCredentials: true
						},
						url: that.oTradeVehicleDescDataUrl,
						async: true,
						success: function (result) {},
						error: function (err) {}

					});
				}

				sap.ui.core.BusyIndicator.show();
				var that = this;
				if (!ajaxOffered_Vtn) ajaxOffered_Vtn = {};
				if (!ajaxOffered_Vtn3) ajaxOffered_Vtn3 = {};
				if (!ajaxRequested_Vtn3) ajaxRequested_Vtn3 = {};

				// if (ajaxOffered_Vtn && ajaxRequested_Vtn) {
				$.when(ajaxOffered_Vtn, ajaxRequested_Vtn, ajaxRequested_Vtn3, ajaxOffered_Vtn3).then(function (TradeVehiclesO, TradeVehiclesR,
						TradeVehicleDescR, TradeVehicleDescO) {
						// local = this;
						var Trade_Id = that.StatusData.Trade_Id;

						// var TradeRequest = TradeRequest; //Trade_Request[0].d;
						// .results;
						// if (!!TradeRequest) {
						// 	TradeRequest = TradeRequest.filter(function (x) {
						// 		return x.Trade_Id == Trade_Id
						// 	});
						// }
						if (TradeVehiclesO[0]) {
							var Vehicles = [TradeVehiclesO[0].d, TradeVehiclesR[0].d];
							var TradeVehicles = Vehicles.filter(function (x) {
								return x["Trade_Id"] == Trade_Id;
							});
						} else {
							var Vehicles = [TradeVehiclesR[0].d];
							var TradeVehicles = Vehicles.filter(function (x) {
								return x["Trade_Id"] == Trade_Id;
							});
						}

						if (TradeVehicleDescO[0] && TradeVehicleDescR[0]) {
							var VehicleDesc = [TradeVehicleDescO[0].d, TradeVehicleDescR[0].d];
							var oTradeVehicleDesc = VehicleDesc.filter(function (x) {
								return x["Trade_Id"] == Trade_Id;
							});
						} else if (TradeVehicleDescR[0]) {
							var VehicleDesc = [TradeVehicleDescR[0].d];
							var oTradeVehicleDesc = VehicleDesc.filter(function (x) {
								return x["Trade_Id"] == Trade_Id;
							});
						} else {
							var VehicleDesc = [TradeVehicleDescO[0].d];
							var oTradeVehicleDesc = VehicleDesc.filter(function (x) {
								return x["Trade_Id"] == Trade_Id;
							});
						}
						// var OfferedVehicleDesc = TradeVehicleDescO[0].d;
						// var RequestedVehicleDesc=TradeVehicleDescR[0].d;

						console.log("Vehicles", Vehicles);
						console.log("VehicleDesc", VehicleDesc);
						console.log("oTradeVehicleDesc", oTradeVehicleDesc);
						console.log("TradeVehicles", TradeVehicles);

						// if (!!TradeRequest && !!TradeVehicles) {
						// for (var i = 0; i < TradeRequest.length; i++) {
						for (var j = 0; j < TradeVehicles.length; j++) {
							if (TradeRequest.Trade_Id == TradeVehicles[j].Trade_Id) {
								/*TradeRequest[i].push(TradeVehicles[j]);*/
								TradeVehicles[j].Requesting_Dealer = TradeRequest.Requesting_Dealer;
								TradeVehicles[j].Requesting_Dealer_Name = TradeRequest.Requesting_Dealer_Name;
								TradeVehicles[j].Requested_Dealer = TradeRequest.Requested_Dealer;
								TradeVehicles[j].Requested_Dealer_Name = TradeRequest.Requested_Dealer_Name;
								TradeVehicles[j].Requested_Vtn = TradeRequest.Requested_Vtn;
								TradeVehicles[j].Offered_Vtn = TradeRequest.Offered_Vtn;
								TradeVehicles[j].Req_Current_ETA_From = TradeRequest.Req_Current_ETA_From;
								TradeVehicles[j].Req_Current_ETA_To = TradeRequest.Req_Current_ETA_To;
								TradeVehicles[j].Req_Proposed_ETA_From = TradeRequest.Req_Proposed_ETA_From;
								TradeVehicles[j].Req_Proposed_ETA_To = TradeRequest.Req_Proposed_ETA_To;
								TradeVehicles[j].Off_Current_ETA_From = TradeRequest.Off_Current_ETA_From;
								TradeVehicles[j].Off_Current_ETA_To = TradeRequest.Off_Current_ETA_To;
								TradeVehicles[j].Off_Proposed_ETA_From = TradeRequest.Off_Proposed_ETA_From;
								TradeVehicles[j].Off_Proposed_ETA_To = TradeRequest.Off_Proposed_ETA_To;
							//	TradeVehicles[j].VIN = TradeRequest.VIN;                       //changes by swetha for DMND0003618
								TradeVehicles[j].Created_By = TradeRequest.Created_By;
								TradeVehicles[j].Created_On = TradeRequest.Created_On;
								TradeVehicles[j].Changed_on = TradeRequest.Changed_on;
								TradeVehicles[j].Trade_Id = TradeRequest.Trade_Id;
								TradeVehicles[j].Trade_Return = TradeRequest.Trade_Return;
								TradeVehicles[j].Trade_Status = TradeRequest.Trade_Status;
							}
						}
						// }
						var filtered = TradeVehicles;
						// }
						var Spars;
						if (sCurrentLocaleD == "French") {
							Spars = "F";
						} else {
							Spars = "E";
						}

						var finalArray = [];
						// if (!!filtered) {
						for (var k = 0; k < filtered.length; k++) {
							// if (!!oTradeVehicleDesc) {
							for (var l = 0; l < oTradeVehicleDesc.length; l++) {
								if (filtered[k].Trade_Id == oTradeVehicleDesc[l]["Trade_Id"] && filtered[k].VTN == oTradeVehicleDesc[l]["VTN"] &&
									oTradeVehicleDesc[l].SPRAS == Spars) {
									filtered[k].Ext_Colour_Desc = oTradeVehicleDesc[l].Ext_Colour_Desc;
									filtered[k].Int_Colour_Desc = oTradeVehicleDesc[l].Int_Colour_Desc;
									filtered[k].Model_Desc = oTradeVehicleDesc[l].Model_Desc;
									filtered[k].SPRAS = oTradeVehicleDesc[l].SPRAS;
									filtered[k].Series_Desc = oTradeVehicleDesc[l].Series_Desc;
									filtered[k].Suffix_Desc = oTradeVehicleDesc[l].Suffix_Desc;
								}
							}
						}
						// }
						for (var n = 0; n < filtered.length; n++) {
							if ("Requesting_Dealer" in filtered[n]) {
								filtered[n].Requesting_Dealer = filtered[n].Requesting_Dealer;
							} else {
								filtered[n].Requesting_Dealer = "";
							}

							if ("Requesting_Dealer_Name" in filtered[n]) {
								filtered[n].Requesting_Dealer_Name = filtered[n].Requesting_Dealer_Name;
							} else {
								filtered[n].Requesting_Dealer_Name = "";
							}

							if ("Requested_Dealer" in filtered[n]) {
								filtered[n].Requested_Dealer = filtered[n].Requested_Dealer;
							} else {
								filtered[n].Requested_Dealer = "";
							}

							if ("Requested_Dealer_Name" in filtered[n]) {
								filtered[n].Requested_Dealer_Name = filtered[n].Requested_Dealer_Name;
							} else {
								filtered[n].Requested_Dealer_Name = "";
							}

							if ("Requested_Vtn" in filtered[n]) {
								filtered[n].Requested_Vtn = filtered[n].Requested_Vtn;
							} else {
								filtered[n].Requested_Vtn = "";
							}

							if ("Offered_Vtn" in filtered[n]) {
								filtered[n].Offered_Vtn = filtered[n].Offered_Vtn;
							} else {
								filtered[n].Offered_Vtn = "";
							}

							if ("Req_Current_ETA_From" in filtered[n]) {
								filtered[n].Req_Current_ETA_From = filtered[n].Req_Current_ETA_From;
							} else {
								filtered[n].Req_Current_ETA_From = "";
							}

							if ("Req_Current_ETA_To" in filtered[n]) {
								filtered[n].Req_Current_ETA_To = filtered[n].Req_Current_ETA_To;
							} else {
								filtered[n].Req_Current_ETA_To = "";
							}

							if ("Req_Proposed_ETA_From" in filtered[n]) {
								filtered[n].Req_Proposed_ETA_From = filtered[n].Req_Proposed_ETA_From;
							} else {
								filtered[n].Req_Proposed_ETA_From = "";
							}

							if ("Req_Proposed_ETA_To" in filtered[n]) {
								filtered[n].Req_Proposed_ETA_To = filtered[n].Req_Proposed_ETA_To;
							} else {
								filtered[n].Req_Proposed_ETA_To = "";
							}
							if ("Off_Current_ETA_From" in filtered[n]) {
								filtered[n].Off_Current_ETA_From = filtered[n].Off_Current_ETA_From;
							} else {
								filtered[n].Off_Current_ETA_From = "";
							}

							if ("Off_Current_ETA_To" in filtered[n]) {
								filtered[n].Off_Current_ETA_To = filtered[n].Off_Current_ETA_To;
							} else {
								filtered[n].Off_Current_ETA_To = "";
							}
							if ("Off_Proposed_ETA_From" in filtered[n]) {
								filtered[n].Off_Proposed_ETA_From = filtered[n].Off_Proposed_ETA_From;
							} else {
								filtered[n].Off_Proposed_ETA_From = "";
							}
							if ("Off_Proposed_ETA_To" in filtered[n]) {
								filtered[n].Off_Proposed_ETA_To = filtered[n].Off_Proposed_ETA_To;
							} else {
								filtered[n].Off_Proposed_ETA_To = "";
							}

							if ("Created_By" in filtered[n]) {
								filtered[n].Created_By = filtered[n].Created_By;
							} else {
								filtered[n].Created_By = "";
							}
							if ("Created_On" in filtered[n]) {
								filtered[n].Created_On = filtered[n].Created_On;
							} else {
								filtered[n].Created_On = "";
							}
							if ("Changed_on" in filtered[n]) {
								filtered[n].Changed_on = filtered[n].Changed_on;
							} else {
								filtered[n].Changed_on = "";
							}

							if ("Trade_Id" in filtered[n]) {
								filtered[n].Trade_Id = filtered[n].Trade_Id;
							} else {
								filtered[n].Trade_Id = "";
							}

							if ("Ext_Colour_Desc" in filtered[n]) {
								filtered[n].Ext_Colour_Desc = filtered[n].Ext_Colour_Desc;
							} else {
								filtered[n].Ext_Colour_Desc = "";
							}

							if ("Int_Colour_Desc" in filtered[n]) {
								filtered[n].Int_Colour_Desc = filtered[n].Int_Colour_Desc;
							} else {
								filtered[n].Int_Colour_Desc = "";
							}

							if ("Model_Desc" in filtered[n]) {
								filtered[n].Model_Desc = filtered[n].Model_Desc;
							} else {
								filtered[n].Model_Desc = "";
							}

							if ("SPRAS" in filtered[n]) {
								filtered[n].SPRAS = filtered[n].SPRAS;
							} else {
								filtered[n].SPRAS = Spars;
							}

							if ("Series_Desc" in filtered[n]) {
								filtered[n].Series_Desc = filtered[n].Series_Desc;
							} else {
								filtered[n].Series_Desc = "";
							}

							if ("Suffix_Desc" in filtered[n]) {
								filtered[n].Suffix_Desc = filtered[n].Suffix_Desc;
							} else {
								filtered[n].Suffix_Desc = "";
							}

							if ("Trade_Return" in filtered[n]) {
								filtered[n].Trade_Return = filtered[n].Trade_Return;
							} else {
								filtered[n].Trade_Return = "";
							}

							if ("Trade_Status" in filtered[n]) {
								filtered[n].Trade_Status = filtered[n].Trade_Status;
							} else {
								filtered[n].Trade_Status = "";
							}

						}

						var vtn = that.StatusData.Requested_Vtn;
						var vtn2;
						var Requested = {};
						if (vtn == null) {
							vtn2 = that.StatusData.Offered_Vtn;

							var Offered = filtered.filter(function (x) {
								return x.VTN == vtn2;
							});
							Requested.Requesting_Dealer = that.StatusData.Requesting_Dealer;
							Requested.Requested_Dealer = that.StatusData.Requested_Dealer;
							Requested.Requesting_Dealer_Name = that.StatusData.Requesting_Dealer_Name;
							Requested.Requested_Dealer_Name = that.StatusData.Requested_Dealer_Name;
							Requested.Trade_Status = that.StatusData.Trade_Status;
							Requested.Trade_Id = that.StatusData.Trade_Id;
						} else {
							var Requested = filtered.filter(function (x) {
								return x.VTN == vtn;
							});
							var Requested = Requested[0];

							var Offered = filtered.filter(function (x) {
								return x.VTN != vtn;
							});
						}
						if (Offered.length != 0) {
							Offered = Offered[0];
							var i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
							var OtherVehicleInformation_text = i18n.getText("OutboundVehicleInformation");
							local.getView().byId("Offerevehid").setText(OtherVehicleInformation_text);

							// local.getView().byId("oRequesteddealer").setVisible(true);
							// local.getView().byId("offeredDealer").setVisible(true);
							// local.getView().byId("ofrModellabl").setVisible(true);
							// local.getView().byId("ofrserieslabl").setVisible(true);
							// local.getView().byId("ofrmodllabl").setVisible(true);
							// local.getView().byId("ofrsuffixlabl").setVisible(true);
							// local.getView().byId("ofrapxlabl").setVisible(true);
							// // that.getView().byId("oAccesIn").setText("");
							// local.getView().byId("oAccesIn").setVisible(true);
							// local.getView().byId("accid").setVisible(true);
							// local.getView().byId("ofrextcolorlabl").setVisible(true);
							// local.getView().byId("ofrstatuslabl").setVisible(true);
							// local.getView().byId("ofrordrtypelabl").setVisible(true);
							// local.getView().byId("cetalaid").setVisible(true);
							// that.getView().byId("fromqid").setVisible(true);
							/*	that.getView().byId("fromlbid").setVisible(true);*/
							// that.getView().byId("idlto").setVisible(true);
							// that.getView().byId("tobid").setVisible(true);
							// that.getView().byId("fmlbid").setVisible(true);

							// local.getView().byId("oRequesteddealer").setVisible(true);
							// local.getView().byId("ofrmodelyeartext").setVisible(true);
							// local.getView().byId("ofrseriestxt").setVisible(true);
							// local.getView().byId("ofrmodltxt").setVisible(true);
							// local.getView().byId("ofrsuffixstxt").setVisible(true);
							// local.getView().byId("ofrapxtxt").setVisible(true);
							// local.getView().byId("ofrexttxt").setVisible(true);
							// local.getView().byId("ofrstatustxt").setVisible(true);
							// local.getView().byId("ofrordtypetxt").setVisible(true);
							// local.getView().byId("ctqtid").setVisible(true);
							// local.getView().byId("txlab").setVisible(true);
							// local.getView().byId("prolabid").setVisible(true);
							// local.getView().byId("prptid").setVisible(true);
							// local.getView().byId("otxlabel").setVisible(true);
							var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;

							// var Dealer_No= this.LoggedInDealer;
							if (Offered.Requesting_Dealer.slice(-5) == LoggedInDealerCode2) {
								Requested.RequestingDealerVisible = true;
							} else {
								Requested.RequestingDealerVisible = false;
							}

							if (Requested.RequestingDealerVisible == false && local.TradeRequest.StatusData.FromRequesting == true) {
								Requested.RequestingDealerVisible = true;
							}
							var oModel = new sap.ui.model.json.JSONModel(Requested);

						} else {
							Offered = {};
							var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;

							// var Dealer_No= this.LoggedInDealer;
							if (Requested.Requesting_Dealer.slice(-5) == LoggedInDealerCode2) {
								Requested.RequestingDealerVisible = true;
							} else {
								Requested.RequestingDealerVisible = false;
							}
							var oModel = new sap.ui.model.json.JSONModel(Requested);
							// local.getView().byId("Offerevehid").setText("");
							// 						local.getView().byId("offeredDealer").setVisible(true);
							// 						// local.getView().byId("oRequesteddealer").setText("");
							// 						local.getView().byId("oRequesteddealer").setVisible(true);

							// 						local.getView().byId("ofrModellabl").setVisible(true);
							// 						// local.getView().byId("ofrmodelyeartext").setText("");
							// 						local.getView().byId("ofrmodelyeartext").setVisible(true);
							// // local.getView().byId("oAccesIn").setText("");
							// 						local.getView().byId("oAccesIn").setVisible(true);
							// 						local.getView().byId("accid").setVisible(true);
							// 						local.getView().byId("ofrserieslabl").setVisible(true);
							// 						// local.getView().byId("ofrseriestxt").setText("");
							// 						local.getView().byId("ofrseriestxt").setVisible(true);

							// 						local.getView().byId("ofrmodllabl").setVisible(true);
							// 						// local.getView().byId("ofrmodltxt").setText("");
							// 						local.getView().byId("ofrmodltxt").setVisible(true);

							// 						local.getView().byId("ofrsuffixlabl").setVisible(true);
							// 						// local.getView().byId("ofrsuffixstxt").setText("");
							// 						local.getView().byId("ofrsuffixstxt").setVisible(true);

							// 						local.getView().byId("ofrapxlabl").setVisible(true);
							// 						// local.getView().byId("ofrapxtxt").setText("");
							// 						local.getView().byId("ofrapxtxt").setVisible(true);

							// 						local.getView().byId("ofrextcolorlabl").setVisible(true);
							// 						// local.getView().byId("ofrexttxt").setText("");
							// 						local.getView().byId("ofrexttxt").setVisible(true);

							// 						local.getView().byId("ofrstatuslabl").setVisible(true);
							// 						// local.getView().byId("ofrstatustxt").setText("");
							// 						local.getView().byId("ofrstatustxt").setVisible(true);

							// 						local.getView().byId("ofrordrtypelabl").setVisible(true);
							// 						// local.getView().byId("ofrordtypetxt").setText("");
							// 						local.getView().byId("ofrordtypetxt").setVisible(true);

							// 						local.getView().byId("cetalaid").setVisible(true);
							// 						// local.getView().byId("ctqtid").setText("");
							// 						local.getView().byId("ctqtid").setVisible(true);

							// local.getView().byId("fromqid").setVisible(false);
							// local.getView().byId("txlab").setText("");
							// local.getView().byId("txlab").setVisible(true);

							// local.getView().byId("prolabid").setVisible(true);

							// // local.getView().byId("tobid").setVisible(false);
							// // local.getView().byId("prptid").setText("");
							// local.getView().byId("prptid").setVisible(true);

							// // local.getView().byId("fmlbid").setVisible(false);
							// /*	local.getView().byId("fromlbid").setVisible(false);*/
							// // local.getView().byId("otxlabel").setText("");
							// local.getView().byId("otxlabel").setVisible(true);

							// local.getView().byId("idlto").setVisible(false);

						}
						// }

						sap.ui.getCore().setModel(oModel, "ApprovRej");
						sap.ui.getCore().getModel("ApprovRej").setProperty("/OffredVehicle", Offered);
						local.getView().byId("SimpleFormAproveTrReq").setModel(sap.ui.getCore().getModel("ApprovRej"));
						//	local.getView().byId("SimpleFormAproveTrReq").getModel("ApprovRej").setProperty("/OffredVehicle", Offered);
						local.getView().byId("SimpleFormAproveTrReq").bindElement("/");
						local.getView().byId("SimpleFormAproveTrReq").getModel().refresh(true);
						//	sap.ui.getCore().setModel(oModel, "oVehicleTrade_Summary");();
						if (local.getView().byId("ovtnId").getText() == "") {
							// local.getView().byId("requForm").setVisible(false);

							// local._oViewModel.setProperty("/showVinDiplayOff", false);
							// this.getView().byId("offervehidContent").setVisible(true);
							// Offered = {};
							// local.getView().byId("Offerevehid").setText("");
							// local.getView().byId("offeredDealer").setVisible(true);
							// local.getView().byId("oRequesteddealer").setText("");
							// local.getView().byId("oRequesteddealer").setVisible(true);
							// local.getView().byId("oAccesIn").setText("");
							// local.getView().byId("ovinIdText").setVisible(true);
							// local.getView().byId("ovinId").setVisible(true);

							local.getView().byId("oMdlyearLbl").setVisible(false);
							// local.getView().byId("ofrmodelyeartext").setText("");
							local.getView().byId("oMdlyear").setVisible(false);

							local.getView().byId("oSeriesLbl").setVisible(false);
							// local.getView().byId("ofrseriestxt").setText("");
							local.getView().byId("oSeries").setVisible(false);

							local.getView().byId("oModelLbl").setVisible(false);
							// local.getView().byId("ofrmodltxt").setText("");
							local.getView().byId("oModel").setVisible(false);

							local.getView().byId("oSuffixLbl").setVisible(false);
							// local.getView().byId("ofrsuffixstxt").setText("");
							local.getView().byId("intdesr").setVisible(false);

							local.getView().byId("extcoLbl").setVisible(false);
							// local.getView().byId("ofrapxtxt").setText("");
							local.getView().byId("extco").setVisible(false);

							local.getView().byId("oapxLbl").setVisible(false);
							// local.getView().byId("ofrexttxt").setText("");
							local.getView().byId("oapx").setVisible(false);

							local.getView().byId("ostatusLbl").setVisible(false);
							// local.getView().byId("ofrstatustxt").setText("");
							local.getView().byId("ostatus").setVisible(false);

							local.getView().byId("ordTypLbl").setVisible(false);
							// local.getView().byId("ofrordtypetxt").setText("");
							local.getView().byId("oOdrtype").setVisible(false);

							local.getView().byId("cetalabid").setVisible(false);
							// local.getView().byId("ctqtid").setText("");
							local.getView().byId("ctetid").setVisible(false);

							// // local.getView().byId("fromqid").setVisible(false);
							// local.getView().byId("txlab").setText("");
							local.getView().byId("txtlab").setVisible(false);

							local.getView().byId("prlabid").setVisible(false);
							local.getView().byId("prpetid").setVisible(false);
							local.getView().byId("VT_ARCTDnc").setVisible(false);
							local.getView().byId("VT_ARCTDncLbl").setVisible(false);
							local.getView().byId("ovtnIdText").setVisible(false);
							local.getView().byId("ovtnId").setVisible(false);
							local.getView().byId("ovinIdText").setVisible(false);
							local.getView().byId("ovinId").setVisible(false);

							// // local.getView().byId("tobid").setVisible(false);
							// local.getView().byId("prptid").setText("");
							local.getView().byId("accInstLbl").setVisible(false);

							// // local.getView().byId("fmlbid").setVisible(false);
							// /*	local.getView().byId("fromlbid").setVisible(false);*/
							// local.getView().byId("otxlabel").setText("");
							local.getView().byId("otxtlabel").setVisible(false);

							local.getView().byId("accInst").setVisible(false);
							// if (this.getView().byId("VT_ARCTtrdinStatus").getText() == "Rejected") {
							local.getView().byId("ovtnId").setVisible(false);
							local.getView().byId("ovtnIdText").setVisible(false);
							// this.getView().byId("vtnlabeid").setVisible(false);
							// this.getView().byId("vtnid").setVisible(false);

						} else {
							// local._oViewModel.setProperty("/showVinDiplayOff", true);
							local.getView().byId("oMdlyearLbl").setVisible(true);
							// local.getView().byId("ofrmodelyeartext").setText("");
							local.getView().byId("oMdlyear").setVisible(true);

							local.getView().byId("oSeriesLbl").setVisible(true);
							// local.getView().byId("ofrseriestxt").setText("");
							local.getView().byId("oSeries").setVisible(true);

							local.getView().byId("oModelLbl").setVisible(true);
							// local.getView().byId("ofrmodltxt").setText("");
							local.getView().byId("oModel").setVisible(true);

							local.getView().byId("oSuffixLbl").setVisible(true);
							// local.getView().byId("ofrsuffixstxt").setText("");
							local.getView().byId("intdesr").setVisible(true);

							local.getView().byId("extcoLbl").setVisible(true);
							// local.getView().byId("ofrapxtxt").setText("");
							local.getView().byId("extco").setVisible(true);

							local.getView().byId("oapxLbl").setVisible(true);
							// local.getView().byId("ofrexttxt").setText("");
							local.getView().byId("oapx").setVisible(true);

							local.getView().byId("ostatusLbl").setVisible(true);
							// local.getView().byId("ofrstatustxt").setText("");
							local.getView().byId("ostatus").setVisible(true);

							local.getView().byId("ordTypLbl").setVisible(true);
							// local.getView().byId("ofrordtypetxt").setText("");
							local.getView().byId("oOdrtype").setVisible(true);

							local.getView().byId("cetalabid").setVisible(true);
							// local.getView().byId("ctqtid").setText("");
							local.getView().byId("ctetid").setVisible(true);

							// // local.getView().byId("fromqid").setVisible(false);
							// local.getView().byId("txlab").setText("");
							local.getView().byId("txtlab").setVisible(true);
							local.getView().byId("prlabid").setVisible(true);
							local.getView().byId("prpetid").setVisible(true);
							local.getView().byId("VT_ARCTDnc").setVisible(true);
							local.getView().byId("VT_ARCTDncLbl").setVisible(true);
							// local.getView().byId("ovtnIdText").setVisible(true);
							// local.getView().byId("ovtnId").setVisible(true);
							// local.getView().byId("ovinIdText").setVisible(true);
							// local.getView().byId("ovinId").setVisible(true);
							// // local.getView().byId("tobid").setVisible(false);
							// local.getView().byId("prptid").setText("");
							local.getView().byId("accInstLbl").setVisible(true);

							// // local.getView().byId("fmlbid").setVisible(false);
							// /*	local.getView().byId("fromlbid").setVisible(false);*/
							// local.getView().byId("otxlabel").setText("");
							local.getView().byId("otxtlabel").setVisible(true);

							local.getView().byId("accInst").setVisible(true);
							// local.getView().byId("requForm").setVisible(true);
							local._oViewModel.setProperty("/showVinDiplayOff", false);
							local._oViewModel.setProperty("/showVinDisplayOffInbound", false);

							if (local.getView().byId("VT_ARCTtrdinStatus").getText() == "Rejected") {
								local.getView().byId("ovtnId").setVisible(false);
								local.getView().byId("ovtnIdText").setVisible(false);
								//local.getView().byId("ovinIdText").setVisible(false);
								//local.getView().byId("ovinId").setVisible(false);
								// this.getView().byId("vtnlabeid").setVisible(false);
								// this.getView().byId("vtnid").setVisible(false);

							} else {

								local.getView().byId("ovtnId").setVisible(true);
								local.getView().byId("ovtnIdText").setVisible(true);
								//	local.getView().byId("ovinIdText").setVisible(true);
								//	local.getView().byId("ovinId").setVisible(true);
								// this.getView().byId("vtnlabeid").setVisible(true);
								// this.getView().byId("vtnid").setVisible(true);
							}
						}
						if (local.getView().byId("vtnid").getText() == "")

						{
							// local.getView().byId("offervehidContent").setVisible(false);

							// local._oViewModel.setProperty("/showVinDiplayOff", false);
							// this.getView().byId("offervehidContent").setVisible(true);
							// Offered = {};
							local.getView().byId("Offerevehid").setText("");
							local.getView().byId("offeredDealer").setVisible(true);
							// local.getView().byId("oRequesteddealer").setText("");
							local.getView().byId("oRequesteddealer").setVisible(false);
							local.getView().byId("oAccesIn").setText("");
							local.getView().byId("oAccesIn").setVisible(false);
							local.getView().byId("accid").setVisible(false);

							local.getView().byId("ofrModellabl").setVisible(false);
							local.getView().byId("ofrmodelyeartext").setText("");
							local.getView().byId("ofrmodelyeartext").setVisible(false);

							local.getView().byId("ofrserieslabl").setVisible(false);
							local.getView().byId("ofrseriestxt").setText("");
							local.getView().byId("ofrseriestxt").setVisible(false);

							local.getView().byId("ofrmodllabl").setVisible(false);
							local.getView().byId("ofrmodltxt").setText("");
							local.getView().byId("ofrmodltxt").setVisible(false);

							local.getView().byId("ofrsuffixlabl").setVisible(false);
							// local.getView().byId("ofrsuffixstxt").setText("");
							local.getView().byId("ofrsuffixstxt").setVisible(false);

							local.getView().byId("ofrapxlabl").setVisible(false);
							// local.getView().byId("ofrapxtxt").setText("");
							local.getView().byId("ofrapxtxt").setVisible(false);

							local.getView().byId("ofrextcolorlabl").setVisible(false);
							// local.getView().byId("ofrexttxt").setText("");
							local.getView().byId("ofrexttxt").setVisible(false);

							local.getView().byId("ofrstatuslabl").setVisible(false);
							// local.getView().byId("ofrstatustxt").setText("");
							local.getView().byId("ofrstatustxt").setVisible(false);

							local.getView().byId("ofrordrtypelabl").setVisible(false);
							// local.getView().byId("ofrordtypetxt").setText("");
							local.getView().byId("ofrordtypetxt").setVisible(false);

							local.getView().byId("cetalaid").setVisible(false);
							// local.getView().byId("ctqtid").setText("");
							local.getView().byId("ctqtid").setVisible(false);

							// // local.getView().byId("fromqid").setVisible(false);
							// local.getView().byId("txlab").setText("");
							local.getView().byId("txlab").setVisible(false);

							local.getView().byId("prolabid").setVisible(false);

							// // local.getView().byId("tobid").setVisible(false);
							// local.getView().byId("prptid").setText("");
							local.getView().byId("prptid").setVisible(false);

							// // local.getView().byId("fmlbid").setVisible(false);
							// /*	local.getView().byId("fromlbid").setVisible(false);*/
							// local.getView().byId("otxlabel").setText("");
							local.getView().byId("otxlabel").setVisible(false);

							// local.getView().byId("idlto").setVisible(false);

							// if (this.getView().byId("VT_ARCTtrdinStatus").getText() == "Rejected") {
							local.getView().byId("vtnid").setVisible(false);
							local.getView().byId("vtnlabeid").setVisible(false);
							local.getView().byId("vinid").setVisible(false);//changes by swetha for DMND0003618
							local.getView().byId("vinlabeid").setVisible(false);//changes by swetha for DMND0003618
							local._oViewModel.setProperty("/showVinDiplayOff", false);
							// this.getView().byId("vtnlabeid").setVisible(false);
							// this.getView().byId("vtnid").setVisible(false);

							// } else {

							// 	local.getView().byId("ovtnId").setVisible(true);
							// 	local.getView().byId("ovtnIdText").setVisible(true);
							// 	// this.getView().byId("vtnlabeid").setVisible(true);
							// 	// this.getView().byId("vtnid").setVisible(true);
							// }

						} 
						else {
							// local.getView().byId("offervehidContent").setVisible(true);

							//	local._oViewModel.setProperty("/showVinDiplayOff", true);
							// this.getView().byId("offervehidContent").setVisible(true);
							// Offered = {};
							// local.getView().byId("Offerevehid").setText("");
							local.getView().byId("offeredDealer").setVisible(true);
							// local.getView().byId("oRequesteddealer").setText("");
							local.getView().byId("oRequesteddealer").setVisible(true);
							// local.getView().byId("oAccesIn").setText("");
							local.getView().byId("oAccesIn").setVisible(true);
							local.getView().byId("accid").setVisible(true);

							local.getView().byId("ofrModellabl").setVisible(true);
							// local.getView().byId("ofrmodelyeartext").setText("");
							local.getView().byId("ofrmodelyeartext").setVisible(true);

							local.getView().byId("ofrserieslabl").setVisible(true);
							// local.getView().byId("ofrseriestxt").setText("");
							local.getView().byId("ofrseriestxt").setVisible(true);

							local.getView().byId("ofrmodllabl").setVisible(true);
							// local.getView().byId("ofrmodltxt").setText("");
							local.getView().byId("ofrmodltxt").setVisible(true);

							local.getView().byId("ofrsuffixlabl").setVisible(true);
							// local.getView().byId("ofrsuffixstxt").setText("");
							local.getView().byId("ofrsuffixstxt").setVisible(true);

							local.getView().byId("ofrapxlabl").setVisible(true);
							// local.getView().byId("ofrapxtxt").setText("");
							local.getView().byId("ofrapxtxt").setVisible(true);

							local.getView().byId("ofrextcolorlabl").setVisible(true);
							// local.getView().byId("ofrexttxt").setText("");
							local.getView().byId("ofrexttxt").setVisible(true);

							local.getView().byId("ofrstatuslabl").setVisible(true);
							// local.getView().byId("ofrstatustxt").setText("");
							local.getView().byId("ofrstatustxt").setVisible(true);

							local.getView().byId("ofrordrtypelabl").setVisible(true);
							// local.getView().byId("ofrordtypetxt").setText("");
							local.getView().byId("ofrordtypetxt").setVisible(true);

							local.getView().byId("cetalaid").setVisible(true);
							// local.getView().byId("ctqtid").setText("");
							local.getView().byId("ctqtid").setVisible(true);

							// // local.getView().byId("fromqid").setVisible(false);
							// local.getView().byId("txlab").setText("");
							local.getView().byId("txlab").setVisible(true);

							local.getView().byId("prolabid").setVisible(true);

							// // local.getView().byId("tobid").setVisible(false);
							// local.getView().byId("prptid").setText("");
							local.getView().byId("prptid").setVisible(true);

							// // local.getView().byId("fmlbid").setVisible(false);
							// /*	local.getView().byId("fromlbid").setVisible(false);*/
							// local.getView().byId("otxlabel").setText("");
							local.getView().byId("otxlabel").setVisible(true);

							// that.getView().byId("idlto").setVisible(true);
							local._oViewModel.setProperty("/showVinDiplayOff", false);

							local._oViewModel.setProperty("/showVinDisplayOffInbound", false);
							if (local.getView().byId("VT_ARCTtrdinStatus").getText() == "Rejected") {
								// local.getView().byId("ovtnId").setVisible(false);
								// local.getView().byId("ovtnIdText").setVisible(false);
								local.getView().byId("vtnlabeid").setVisible(false);
								local.getView().byId("vtnid").setVisible(false);
								

							} else {

								// local.getView().byId("ovtnId").setVisible(true);
								// local.getView().byId("ovtnIdText").setVisible(true);
								local.getView().byId("vtnlabeid").setVisible(true);
								local.getView().byId("vtnid").setVisible(true);
								local.getView().byId("vinlabeid").setVisible(true);//changes by swetha for DMND0003618
								local.getView().byId("vinid").setVisible(true);//changes by swetha for  DMND0003618
								//	local._oViewModel.setProperty("/showVinDiplayOff", true);
							}

						}
						sap.ui.core.BusyIndicator.hide();

					},
					function (a1, a2, a3, a4) {

						sap.ui.core.BusyIndicator.hide();
						var Message = 'System is unable to create Trade Request with complete information, please contact the administrator';

						if (local.sCurrentLocale == 'FR') {

							Message = "Le système est incapable de créer une demande d'échange avec des informations complètes, veuillez contacter l'administrateur";
						}

						function fnCallbackMessageBox1(oAction) {
							local.getRouter().navTo("VehicleTrade_Summary", {
								DataClicked: "Yes"
							});

						}
						sap.m.MessageBox.information(Message, {

							actions: [sap.m.MessageBox.Action.OK],
							onClose: fnCallbackMessageBox1
						});

					});
				// }
			});

		},
		DatesFormatting: function (Created_On) {
			if (Created_On != null && Created_On != "" && Created_On != "/Date(0)/") {
				var dateTo = Created_On.split("(")[1];
				if (Created_On.indexOf("+") != -1) {
					/*dateTo = dateTo.split("+")[0];*/
					Created_On = new Date(Created_On.split("(")[1].substring(0, 10) * 1000).toDateString().substring(4, 15);
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd'T'HH:mm:ss"
					});
					return new Date(oDateFormat.format(new Date(Created_On)));

				} else {
					dateTo = dateTo;
					var dataTo1 = dateTo.substring(0, dateTo.length - 5);
					var ValidTo = new Date(dataTo1 * 1000);
					ValidTo = ValidTo.toGMTString().substring(4, 16);
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd'T'HH:mm:ss"
					});
					return new Date(oDateFormat.format(new Date(ValidTo)));
				}

			} else {
				return "0000-00-00T00:00:00";
			}
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
				sCurrentLocaleD = 'French';

			} else {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")

				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';
				sCurrentLocaleD = 'English';

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
		handleLiveChangeText: function (oEvent) {
			var oTextArea = oEvent.getSource(),
				iValueLength = oTextArea.getValue().length;
			if (iValueLength >= 150) {
				sap.m.MessageBox.warning("Comments not exceed more than 150 characters");
				return;
			}

			/*	iMaxLength = oTextArea.getMaxLength(),
							sState = iValueLength > iMaxLength ? "Warning" : "None";

					oTextArea.setValueState(sState);*/
		},

		DatesFormattingCreatedOnDate: function (Created_On) {
			if (Created_On != null && Created_On != "" && Created_On != "/Date(0)/") {
				var dateTo = Created_On.split("(")[1];
				if (Created_On.indexOf("+") != -1) {
					/*dateTo = dateTo.split("+")[0];*/
					Created_On = new Date(Created_On.split("(")[1].substring(0, 10) * 1000).toDateString().substring(4, 15);
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd'T'HH:mm:ss"
					});
					return new Date(oDateFormat.format(new Date(Created_On)));

				} else {
					dateTo = dateTo;
					// var dataTo1 = dateTo.substring(0, dateTo.length - 5);
					// var ValidTo = new Date(dataTo1 * 1000);

					// ValidTo = ValidTo.toGMTString().substring(4, 16);

					// var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					// 	pattern: "yyyy-MM-dd'T'HH:mm:ss"
					// });

					var dataTo1 = dateTo.substring(0, dateTo.length - 2);

					var currentTime = new Date(Number(dataTo1));

					// var  currentTime = new Date(dataTo1);    

					// var convertTime = moment(currentTime).tz(timezone).format("YYYY-MM-DD HH:mm:ss");
					// var convertTime = moment(currentTime).tz("GMT").format("YYYY-MM-DD HH:mm:ss");

					var convertTime = moment(currentTime).format("YYYY-MM-DD HH:mm:ss");

					var returnThisDate = new Date(convertTime);

					return new Date(returnThisDate);

					// return new Date(oDateFormat.format(new Date(returnThisDate)));

					// return new Date(oDateFormat.format(new Date(ValidTo)));
				}

			} else {
				return "0000-00-00T00:00:00";
			}
		},
		// ----------------------------

		bindCombo: function () {
			var data = [{
				"key": "0",
				"text": "0"
			}, {
				"key": "10",
				"text": "10"
			}, {
				"key": "20",
				"text": "20"
			}, {
				"key": "40",
				"text": "40"
			}];

			var oModel = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(oModel, "dncDays");

			this.idCb.attachBrowserEvent("keyup", function (event) {
				var len = this.getItems().length;
				var enteredText = this.getValue()

				var bExists = false;
				for (var i = 0; i < len; i++) {
					var itemText = this.getItems()[i].getProperty("text");
					if (itemText == enteredText || itemText.startsWith(enteredText)) {
						bExists = true;
						break;
					}
				}
				if (bExists) {
					this.setValueState(sap.ui.core.ValueState.None);
				} else {
					this.setValueState(sap.ui.core.ValueState.Error);
					this.setValue("");
				}

			});
		}

		/*	onBack :function()
			{
			this.getRouter().navTo("VehicleSearcResults");	
				
			}*/

	});
});