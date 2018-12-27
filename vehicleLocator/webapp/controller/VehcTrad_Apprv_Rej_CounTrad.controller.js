sap.ui.define([
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageBox',
	"sap/ui/core/routing/History",
	"vehicleLocator/Formatter/Formatter",
], function (BaseController, JSONModel, ResourceModel, MessageBox, History, Formatter) {
	"use strict";
	var oController;
	return BaseController.extend("vehicleLocator.controller.VehcTrad_Apprv_Rej_CounTrad", {
		onInit: function () {
			var _that = this;
			oController = this;
			this.getRouter().attachRouteMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function (oEvent) {
			debugger
			var that = this;
			that.oSelectedItems = oEvent.getParameter("arguments").selectedmyTr;

			/* SelectedPath	*/
			if (that.oSelectedItems != undefined) {
				if (sap.ui.getCore().getModel("MyTradeRequestSelected") != undefined) {
					this.getView().byId("SimpleFormAproveTrReq").setModel(sap.ui.getCore().getModel("MyTradeRequestSelected"));
					var StatusData = sap.ui.getCore().getModel("MyTradeRequestSelected").getData();
					var AcceptVisible = StatusData.FromRequesting;
					var Status = StatusData.Trade_Status;
					/*	oacceptbtn
						oBackbtnid*/
					if (AcceptVisible == true && (Status == "S" || Status == "C")) {
						this.getView().byId("oacceptbtn").setVisible(!AcceptVisible);
						this.getView().byId("oRejectbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCounterofrbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCancelbtn").setVisible(AcceptVisible);
						this.getView().byId("oUpdatebtn").setVisible(AcceptVisible);
					} else {

						this.getView().byId("oacceptbtn").setVisible(AcceptVisible);
						this.getView().byId("oRejectbtn").setVisible(AcceptVisible);
						this.getView().byId("oCounterofrbtn").setVisible(AcceptVisible);
						this.getView().byId("oCancelbtn").setVisible(!AcceptVisible);
						this.getView().byId("oUpdatebtn").setVisible(!AcceptVisible);

					}

					var Status = [];
					Status.push(StatusData);
					var oStatusModel = new sap.ui.model.json.JSONModel(Status);
					/*	this.getView().byId("VT_ARCTtrdinStatus").setModel(oStatusModel);*/
					this.getView().byId("VT_ARCTtrdinRet").setModel(oStatusModel);
					/*	this.getView().byId("VT_ARCTDnc").setModel(oStatusModel);*/
					this.getView().byId("VT_ARCDnc").setModel(oStatusModel);
					var Dnc = StatusData.DNC;
					if (Dnc == "Y" || Dnc == "X") {
						this.getView().byId("VT_ARCDnc").setVisible(true);
						var newItem = new sap.ui.core.Item({
							key: "0",
							text: "0"
						});
						this.getView().byId("VT_ARCDnc").insertItem(newItem);
						this.getView().byId("VT_ARCDnc").setSelectedKey("0");
						this.getView().byId("VT_ARCDnc").setSelectedItem("0");

						/*this.getView().byId("VT_ARCDnc").setSelectedKey("0");
						this.getView().byId("VT_ARCDnc").setSelectedItem("0");*/
					} else if (Dnc == "N" || Dnc == "" || Dnc == null) {
						this.getView().byId("VT_ARCDnc").setVisible(false);
						var newItem = new sap.ui.core.Item({
							key: "",
							text: ""
						});
						this.getView().byId("VT_ARCDnc").insertItem(newItem);
						this.getView().byId("VT_ARCDnc").setSelectedKey("");
						this.getView().byId("VT_ARCDnc").setSelectedItem("");
					} else {
						this.getView().byId("VT_ARCDnc").setVisible(false);
						this.getView().byId("VT_ARCDnc").setSelectedKey("");
						this.getView().byId("VT_ARCDnc").setSelectedItem("");
					}
					//	this.getView().byId("oAddbutton").setModel(oStatusModel);	
					this.getView().byId("SimpleFormAproveTrReq").bindElement("/");

					this.getView().byId("SimpleForrmDisa220").setModel(sap.ui.getCore().getModel("MyTradeRequestSelected"));
					this.getView().byId(
						"SimpleForrmDisa220").bindElement("/");

					var Tradeid = sap.ui.getCore().getModel("MyTradeRequestSelected").getData().Trade_Id;
					this.Tradeid = Tradeid;
					var Add_CommentStatus = sap.ui.getCore().getModel("MyTradeRequestSelected").getData().Trade_Status;
					if (Add_CommentStatus == "C" || Add_CommentStatus == "S") {
						this.getView().byId("oAddbutton").setEnabled(true);
					} else {
						this.getView().byId("oAddbutton").setEnabled(false);
					}
					var that = this;
					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");

					if (sLocation_conf == 0) {
						this.sPrefix = "/VehicleLocator_Xsodata";
					} else {
						this.sPrefix = "";

					}
					this.nodeJsUrl = this.sPrefix ;
					that.oDataUrl = this.nodeJsUrl +
						"/xsodata/vehicleTrade_SRV.xsodata//TradeComment";
					$.ajax({
						url: that.oDataUrl,
						method: "GET",
						async: false,
						dataType: "json",

						success: function (oData) {

							debugger;
							var Data = oData.d.results;
							var Trade_Comment = Data.filter(function (x) {
								return x["Trade_Id.Trade_Id"] == Tradeid;
							});
							var oModel = new sap.ui.model.json.JSONModel(Trade_Comment);
							that.getView().byId("tableVrade").setModel(oModel);
						}
					});
				} else if (sap.ui.getCore().getModel("MyTradeRequested") != undefined) {

					this.getView().byId("SimpleFormAproveTrReq").setModel(sap.ui.getCore().getModel("MyTradeRequested"));
					var StatusData = sap.ui.getCore().getModel("MyTradeRequested").getData();

					var AcceptVisible = StatusData.FromRequesting;
					var Status = StatusData.Trade_Status;
					//	this.getView().byId("oacceptbtn").setVisible(AcceptVisible);
					if (AcceptVisible == false && (Status == "S")) {
						this.getView().byId("oacceptbtn").setVisible(!AcceptVisible);
						this.getView().byId("oRejectbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCounterofrbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCancelbtn").setVisible(AcceptVisible);
						this.getView().byId("oUpdatebtn").setVisible(AcceptVisible);
					} else {

						this.getView().byId("oacceptbtn").setVisible(AcceptVisible);
						this.getView().byId("oRejectbtn").setVisible(AcceptVisible);
						this.getView().byId("oCounterofrbtn").setVisible(AcceptVisible);
						this.getView().byId("oCancelbtn").setVisible(!AcceptVisible);
						this.getView().byId("oUpdatebtn").setVisible(!AcceptVisible);

					}

					var Status = [];
					Status.push(StatusData);
					var oStatusModel = new sap.ui.model.json.JSONModel(Status);
					/*	this.getView().byId("VT_ARCTtrdinStatus").setModel(oStatusModel);*/
					this.getView().byId("VT_ARCTtrdinRet").setModel(oStatusModel);
					/*this.getView().byId("VT_ARCTDnc").setModel(oStatusModel);*/
					this.getView().byId("VT_ARCDnc").setModel(oStatusModel);
					//	this.getView().byId("oAddbutton").setModel(oStatusModel);	
					this.getView().byId("SimpleFormAproveTrReq").bindElement("/");

					var Dnc = StatusData.DNC;
					if (Dnc == "Y" || Dnc == "X") {
						this.getView().byId("VT_ARCDnc").setVisible(true);
						var newItem = new sap.ui.core.Item({
							key: "0",
							text: "0"
						});
						this.getView().byId("VT_ARCDnc").insertItem(newItem);
						this.getView().byId("VT_ARCDnc").setSelectedKey("0");
						this.getView().byId("VT_ARCDnc").setSelectedItem("0");

						/*this.getView().byId("VT_ARCDnc").setSelectedKey("0");
						this.getView().byId("VT_ARCDnc").setSelectedItem("0");*/
					} else if (Dnc == "N" || Dnc == "" || Dnc == null) {
						this.getView().byId("VT_ARCDnc").setVisible(false);
						var newItem = new sap.ui.core.Item({
							key: "",
							text: ""
						});
						this.getView().byId("VT_ARCDnc").insertItem(newItem);
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
					} else {
						this.getView().byId("oAddbutton").setEnabled(false);
					}
					var that = this;
					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");

					if (sLocation_conf == 0) {
						this.sPrefix = "/VehicleLocator_Xsodata";
					} else {
						this.sPrefix = "";

					}
					this.nodeJsUrl = this.sPrefix ;
					that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeComment";
					$.ajax({
						url: that.oDataUrl,
						method: "GET",
						async: false,
						dataType: "json",

						success: function (oData) {

							debugger;
							var Data = oData.d.results;
							var Trade_Comment = Data.filter(function (x) {
								return x["Trade_Id.Trade_Id"] == Tradeid;
							});
							var oModel = new sap.ui.model.json.JSONModel(Trade_Comment);
							that.getView().byId("tableVrade").setModel(oModel);
						}
					});

				}
			}
		},
		oAddCommentsArea: function () {
			var Comment = this.getView().byId("oComments").getValue();
			if (Comment == "") {
				sap.m.MessageBox.error("Please enter comment");
			} else {

				if (this.getView().byId("tableVrade").getModel() != undefined) {
					var CommentData = this.getView().byId("tableVrade").getModel().getData();

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

					var that = this;

					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd'T'HH:mm:ss"
					});
					var oCommentdate = oDateFormat.format(new Date());
					var oCreatedby = this.getView().byId("SimpleFormAproveTrReq").getModel().getData().Created_By;

					var oTradeComment = {

						"Trade_Id.Trade_Id": TradeId,
						"Comment_Id": oComment_Id,
						"Comment_Txt": Comment,
						"Comment_Date": oCommentdate,
						"Created_By": oCreatedby

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
			var CommentTableData = this.getView().byId("tableVrade").getModel();
			sap.ui.getCore().setModel(SimpleFormAproveTrReq, "SelectedSimpleFormAproveTrReq");
			sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").setProperty("/SelectedTradeComment",CommentTableData);
			this.getRouter().navTo("VehicleTrade_UpdtTradReq");

		},
		oBack: function () {
			this.getRouter().navTo("VehicleTrade_Summary");

		}

	});
});