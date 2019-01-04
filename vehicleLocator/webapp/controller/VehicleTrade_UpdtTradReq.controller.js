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

	return BaseController.extend("vehicleLocator.controller.VehicleTrade_UpdtTradReq", {

		onInit: function () {
			var _that = this;
			this.getRouter().attachRouteMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function (oEvent) {
			this.i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();

			/*	var pardia_title = i18n.getText("ctrl_success_dialog");
				var succdia_text = i18n.getText("ctrl_successdialog_text");*/
			if (sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq") != undefined) {
				this.getView().byId("SimpleFormUpdateTrReq").setModel(sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq"));
				var UpdateTrStatus = [];
				this.getView().byId("SimpleFormUpdateTrReq").bindElement("/");
				this.getView().byId("SimpleFormUpdateTrReq").getModel().refresh(true);
				UpdateTrStatus.push(sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData());
				var oStatusModel = new sap.ui.model.json.JSONModel(UpdateTrStatus);
				this.getView().byId("oTradeinRet").setModel(oStatusModel);
				var tradeStatus = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Return;
				var tradeId = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Id.slice(2, 8);
				var UpdateTradeRequestChange = this.i18n.getText("UpdateTradeRequestChange");
				this.getView().byId("oUpdateTRId").setText(UpdateTradeRequestChange + tradeId);
				var Add_CommentStatus = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Status;
				if (Add_CommentStatus == "C" || Add_CommentStatus == "S") {
					this.getView().byId("oAddbutton").setEnabled(true);
				} else {
					this.getView().byId("oAddbutton").setEnabled(false);
				}

				if (tradeStatus == "Y") {
					var newItem = new sap.ui.core.Item({
						key: "N",
						text: "No-Single Vehicle"
					});
					this.getView().byId("oTradeinRet").insertItem(newItem);
					this.getView().byId("oTradeinRet").setSelectedKey("Y");
					this.getView().byId("oSelectBtn").setEnabled(true);
				} else if (tradeStatus == "N") {
					var newItem = new sap.ui.core.Item({
						key: "Y",
						text: "Yes-Single Vehicle"
					});
					this.getView().byId("oTradeinRet").insertItem(newItem);
					this.getView().byId("oTradeinRet").setSelectedKey("N");

					this.getView().byId("oSelectBtn").setEnabled(false);
				}

				var AcceptVisible = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().FromRequesting;
				/*	var Status = StatusData.Trade_Status;*/
				/*	oacceptbtn
					oBackbtnid*/
				/*	oUpdateSubmitbtn
oUpdatePagebtn*/

				if (AcceptVisible == true && (Add_CommentStatus == "S" || Add_CommentStatus == "C")) {
					/*	this.getView().byId("oacceptbtn").setVisible(!AcceptVisible);
						this.getView().byId("oRejectbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCounterofrbtn").setVisible(!AcceptVisible);*/
					this.getView().byId("oUpdateSubmitbtn").setVisible(AcceptVisible);
					this.getView().byId("oUpdatePagebtn").setVisible(AcceptVisible);
				} else {
					this.getView().byId("oUpdateSubmitbtn").setVisible(!AcceptVisible);
					this.getView().byId("oUpdatePagebtn").setVisible(!AcceptVisible);
					/*this.getView().byId("oCounterofrbtn").setVisible(!AcceptVisible);
					this.getView().byId("oCancelbtn").setVisible(AcceptVisible);
					this.getView().byId("oUpdatebtn").setVisible(AcceptVisible);*/
				}

				var SelectedTradeComment = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getProperty("/SelectedTradeComment");
				/*	var Status = [];
					Status.push(StatusData);*/
				/*	var oStatusModel = new sap.ui.model.json.JSONModel(Status);*/
				this.getView().byId("tableVrade").setModel(SelectedTradeComment);
				/*	this.getView().byId("VT_ARCTtrdinRet").setModel(oStatusModel);*/
			}
		},
		
		
		
		onTradeReqStat: function () {
			var SelTrdReturn = this.getView().byId("oTradeinRet").getSelectedKey();
			var tradeStatus = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Return;
			if (SelTrdReturn == "Y" && tradeStatus == "Y") {
			//	this.onRouteMatched();
				this.getView().byId("oSelectBtn").setEnabled(false);
				var OfferVehicleInformation = this.i18n.getText("OfferVehicleInformation");
				this.getView().byId("offfveh").setText(OfferVehicleInformation);
				this.getView().byId("vehtnum").setVisible(true);
				this.getView().byId("ovtnId").setVisible(true);
				this.getView().byId("mdlyr").setVisible(true);
				this.getView().byId("mdlyrtext").setVisible(true);
				this.getView().byId("seris").setVisible(true);
				this.getView().byId("serisTex").setVisible(true);
				this.getView().byId("modl").setVisible(true);
				this.getView().byId("mdlde").setVisible(true);
				this.getView().byId("suffx").setVisible(true);
				this.getView().byId("suffxidt").setVisible(true);
				this.getView().byId("apxid").setVisible(true);
				this.getView().byId("apxTid").setVisible(true);
				this.getView().byId("extco").setVisible(true);
				this.getView().byId("extclod").setVisible(true);
				this.getView().byId("sttid").setVisible(true);
				this.getView().byId("stdId").setVisible(true);
				this.getView().byId("ordtyp").setVisible(true);
				this.getView().byId("ortype").setVisible(true);
				this.getView().byId("cetalabid").setVisible(true);
				this.getView().byId("ctetid").setVisible(true);
				this.getView().byId("frmid").setVisible(true);
				this.getView().byId("emptyids").setVisible(true);
				this.getView().byId("txtlab").setVisible(true);
				this.getView().byId("tolbid").setVisible(true);
				this.getView().byId("totid").setVisible(true);
				this.getView().byId("prlabid").setVisible(true);
				this.getView().byId("prpetid").setVisible(true);
				this.getView().byId("idlbltxt").setVisible(true);
				this.getView().byId("fmlabid").setVisible(true);
				this.getView().byId("fromlabid").setVisible(true);
				this.getView().byId("otxtlabel").setVisible(true);

			} else if (SelTrdReturn == "N" && tradeStatus == "Y") {
				this.getView().byId("oSelectBtn").setEnabled(false);
				this.getView().byId("offfveh").setText("");
				this.getView().byId("vehtnum").setVisible(false);
				this.getView().byId("ovtnId").setVisible(false);
		//		this.getView().byId("ovtnId").setText("");
				this.getView().byId("mdlyr").setVisible(false);
				this.getView().byId("mdlyrtext").setVisible(false);
				this.getView().byId("seris").setVisible(false);
				this.getView().byId("serisTex").setVisible(false);
		//		this.getView().byId("serisTex").setText("");
				this.getView().byId("modl").setVisible(false);
				this.getView().byId("mdlde").setVisible(false);
		//		this.getView().byId("mdlde").setText("");
				this.getView().byId("suffx").setVisible(false);
				this.getView().byId("suffxidt").setVisible(false);
		//		this.getView().byId("suffxidt").setText("");
				this.getView().byId("apxid").setVisible(false);
				this.getView().byId("apxTid").setVisible(false);
				this.getView().byId("extco").setVisible(false);
				this.getView().byId("extclod").setVisible(false);
			//	this.getView().byId("extclod").setText("");
				this.getView().byId("sttid").setVisible(false);
				this.getView().byId("stdId").setVisible(false);
			//	this.getView().byId("stdId").setText("");
				this.getView().byId("ordtyp").setVisible(false);
				this.getView().byId("ortype").setVisible(false);
			//	this.getView().byId("ortype").setText("");
				this.getView().byId("cetalabid").setVisible(false);
				this.getView().byId("ctetid").setVisible(false);
			//	this.getView().byId("ctetid").setText("");
				this.getView().byId("frmid").setVisible(false);
				this.getView().byId("emptyids").setVisible(false);
				this.getView().byId("txtlab").setVisible(false);
				this.getView().byId("txtlab").setText("");
			//	this.getView().byId("tolbid").setVisible(false);
				this.getView().byId("totid").setVisible(false);
				this.getView().byId("prlabid").setVisible(false);
				this.getView().byId("prpetid").setVisible(false);
			//	this.getView().byId("prpetid").setText("");
				this.getView().byId("idlbltxt").setVisible(false);
				this.getView().byId("fmlabid").setVisible(false);
				this.getView().byId("fromlabid").setVisible(false);
				this.getView().byId("otxtlabel").setVisible(false);
		//		this.getView().byId("otxtlabel").setText("");
			} else if (SelTrdReturn == "N" && tradeStatus == "N") {
				this.getView().byId("oSelectBtn").setEnabled(false);
				this.getView().byId("offfveh").setText("");
				this.getView().byId("vehtnum").setVisible(false);
				this.getView().byId("ovtnId").setVisible(false);
				this.getView().byId("mdlyr").setVisible(false);
				this.getView().byId("mdlyrtext").setVisible(false);
				this.getView().byId("seris").setVisible(false);
				this.getView().byId("serisTex").setVisible(false);
				this.getView().byId("modl").setVisible(false);
				this.getView().byId("mdlde").setVisible(false);
				this.getView().byId("suffx").setVisible(false);
				this.getView().byId("suffxidt").setVisible(false);
				this.getView().byId("apxid").setVisible(false);
				this.getView().byId("apxTid").setVisible(false);
				this.getView().byId("extco").setVisible(false);
				this.getView().byId("extclod").setVisible(false);
				this.getView().byId("sttid").setVisible(false);
				this.getView().byId("stdId").setVisible(false);
				this.getView().byId("ordtyp").setVisible(false);
				this.getView().byId("ortype").setVisible(false);
				////
				this.getView().byId("cetalaid").setVisible(false);
				this.getView().byId("ctqtid").setVisible(false);
				this.getView().byId("fromqid").setVisible(false);
				this.getView().byId("txlab").setVisible(false);
				this.getView().byId("tobid").setVisible(false);
				
				this.getView().byId("toid").setVisible(false);
				this.getView().byId("prolabid").setVisible(false);
				this.getView().byId("prptid").setVisible(false);
				this.getView().byId("fmlbid").setVisible(false);
				this.getView().byId("otxlabel").setVisible(false);
				this.getView().byId("idlto").setVisible(false);
			/*	this.getView().byId("fromlabid").setVisible(false);
				this.getView().byId("otxtlabel").setVisible(false);*/

			} else if (SelTrdReturn == "Y" && tradeStatus == "N") {
			
				this.getView().byId("oSelectBtn").setEnabled(true);
			/*

				this.getView().byId("oSelectBtn").setEnabled(true);
				this.getView().byId("offfveh").setText("");
				this.getView().byId("vehtnum").setVisible(false);
				this.getView().byId("ovtnId").setVisible(false);
				this.getView().byId("mdlyr").setVisible(false);
				this.getView().byId("mdlyrtext").setVisible(false);
				this.getView().byId("seris").setVisible(false);
				this.getView().byId("serisTex").setVisible(false);
				this.getView().byId("modl").setVisible(false);
				this.getView().byId("mdlde").setVisible(false);
				this.getView().byId("suffx").setVisible(false);
				this.getView().byId("suffxidt").setVisible(false);
				this.getView().byId("apxid").setVisible(false);
				this.getView().byId("apxTid").setVisible(false);
				this.getView().byId("extco").setVisible(false);
				this.getView().byId("extclod").setVisible(false);
				this.getView().byId("sttid").setVisible(false);
				this.getView().byId("stdId").setVisible(false);
				this.getView().byId("ordtyp").setVisible(false);
				this.getView().byId("ortype").setVisible(false);
				this.getView().byId("cetalabid").setVisible(false);
				this.getView().byId("ctetid").setVisible(false);
				this.getView().byId("frmid").setVisible(false);
				this.getView().byId("emptyids").setVisible(false);
				this.getView().byId("txtlab").setVisible(false);
				this.getView().byId("tolbid").setVisible(false);
				this.getView().byId("totid").setVisible(false);
				this.getView().byId("prlabid").setVisible(false);
				this.getView().byId("prpetid").setVisible(false);
				this.getView().byId("idlbltxt").setVisible(false);
				this.getView().byId("fmlabid").setVisible(false);
				this.getView().byId("fromlabid").setVisible(false);
				this.getView().byId("otxtlabel").setVisible(false);

			*/}
		},

		Update: function () {
			var that = this;

			var oVtn = this.getView().byId("ovtnId").getText();

			var oModleyear = this.getView().byId("mdlyrtext").getText();

			var oSeries = this.getView().byId("serisTex").getText();

			var omodelcode = this.getView().byId("mdlde").getText();

			var oSuffix = this.getView().byId("suffxidt").getText();

			var oApx = this.getView().byId("apxTid").getText();

			var oExtcolr = this.getView().byId("extclod").getText();

			var ostatus = this.getView().byId("stdId").getText();

			var oOrdertype = this.getView().byId("ortype").getText();

			var oCurrentEtaTo = this.getView().byId("ctetid").getText();

			var oCurrentEtaFrom = this.getView().byId("txtlab").getText();

			var oProposedETAFrom = this.getView().byId("prpetid").getText();

			var oPorposedETSto = this.getView().byId("otxtlabel").getText();

			var Trade_Id = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Id;
			var Trade_Status = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Status;
			var Requesting_Dealer = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requesting_Dealer;
			var Requesting_Dealer_Name = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requesting_Dealer_Name;
			var Requested_Vtn = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requested_Vtn;
			var Offered_Vtn = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Offered_Vtn;
			var Trade_Return = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Return;
			var Requested_Dealer = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requested_Dealer;
			var Requested_Dealer_Name = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requested_Dealer_Name;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var Req_Current_ETA_FromData = that.getView().byId("ctetid").getText();
			if (Req_Current_ETA_FromData != "") {
				var Req_Current_ETA_From = oDateFormat.format(new Date(Req_Current_ETA_FromData));
			} else {
				var Req_Current_ETA_From = oDateFormat.format(new Date());
			}
			var Req_Current_ETA_To = that.getView().byId("txtlab").getText();

			if (Req_Current_ETA_To != "") {
				var Req_Current_ETA_To = oDateFormat.format(new Date(Req_Current_ETA_To));
			} else {
				var Req_Current_ETA_To = oDateFormat.format(new Date());
			}

			var Req_Proposed_ETA_From = that.getView().byId("prpetid").getText();

			if (Req_Proposed_ETA_From != "") {
				var Req_Proposed_ETA_From = oDateFormat.format(new Date(Req_Proposed_ETA_From));
			} else {
				var Req_Proposed_ETA_From = oDateFormat.format(new Date());
			}
			var Req_Proposed_ETA_To = that.getView().byId("otxtlabel").getText();
			if (Req_Proposed_ETA_To != "") {
				var Req_Proposed_ETA_To = oDateFormat.format(new Date(Req_Proposed_ETA_To));
			} else {
				var Req_Proposed_ETA_To = oDateFormat.format(new Date());
			}

			var Off_Current_ETA_From = that.getView().byId("ctqtid").getText();
			if (Off_Current_ETA_From != "") {
				var Off_Current_ETA_From = oDateFormat.format(new Date(Off_Current_ETA_From));
			} else {
				var Off_Current_ETA_From = oDateFormat.format(new Date());
			}
			var Off_Current_ETA_To = that.getView().byId("txlab").getText();
			if (Off_Current_ETA_To != "") {
				var Off_Current_ETA_To = oDateFormat.format(new Date(Off_Current_ETA_To));
			} else {
				var Off_Current_ETA_To = oDateFormat.format(new Date());
			}

			var Off_Proposed_ETA_From = that.getView().byId("prptid").getText();
			if (Off_Proposed_ETA_From != "") {
				var Off_Proposed_ETA_From = oDateFormat.format(new Date(Off_Proposed_ETA_From));
			} else {
				var Off_Proposed_ETA_From = oDateFormat.format(new Date());
			}

			var Off_Proposed_ETA_To = that.getView().byId("otxlabel").getText();
			if (Off_Proposed_ETA_To != "") {
				var Off_Proposed_ETA_To = oDateFormat.format(new Date(Off_Proposed_ETA_To));
			} else {
				var Off_Proposed_ETA_To = oDateFormat.format(new Date());
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

			var Created_By = this.getView().byId("SimpleFormUpdateTrReq").getModel().oData.Created_By;
			var Created_On = this.getView().byId("SimpleFormUpdateTrReq").getModel().oData.Created_On;

			if (Created_On != null && Created_On != "") {
				var dateTo = Created_On.split("(")[1];
				if (dateTo.includes("+") == true) {
					dateTo = dateTo.split("+")[0];
				} else {
					dateTo = dateTo;
				}
				var dataTo1 = dateTo.substring(0, dateTo.length - 5);
				var ValidTo = new Date(dataTo1 * 1000);
				ValidTo = ValidTo.toGMTString().substring(4, 16);
		var	oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
				Created_On = oDateFormat.format(new Date(ValidTo));

			}
			var Changed_on = oDateFormat.format(new Date());

	
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
				"Changed_on": Changed_on,
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
			that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "PUT"
			});
var UpdatedTreadeEntity="/TradeRequest('"+Trade_Id+"')";
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, null, function (s) {
				debugger
			
				that.TradeVehcles(oEntry);
					that.TradeStatus(oEntry);
				/*	that.TradeComment(oEntry);
					that.TradeVehcles(oEntry);
					that.TradeStatus(oEntry);
					that.VehicleTrade_Summary();
				*/

				//	that.getRouter().navTo("VehicleTrade_Summary");
			}, function () {
	alert("fail");
			});

		},
		
		oUpdateSubmitbtn: function()
		{
			
				var that = this;

			var oVtn = this.getView().byId("ovtnId").getText();

			var oModleyear = this.getView().byId("mdlyrtext").getText();

			var oSeries = this.getView().byId("serisTex").getText();

			var omodelcode = this.getView().byId("mdlde").getText();

			var oSuffix = this.getView().byId("suffxidt").getText();

			var oApx = this.getView().byId("apxTid").getText();

			var oExtcolr = this.getView().byId("extclod").getText();

			var ostatus = this.getView().byId("stdId").getText();

			var oOrdertype = this.getView().byId("ortype").getText();

			var oCurrentEtaTo = this.getView().byId("ctetid").getText();

			var oCurrentEtaFrom = this.getView().byId("txtlab").getText();

			var oProposedETAFrom = this.getView().byId("prpetid").getText();

			var oPorposedETSto = this.getView().byId("otxtlabel").getText();

			var Trade_Id = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Id;
			var Trade_Status = "S";
			var Requesting_Dealer = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requesting_Dealer;
			var Requesting_Dealer_Name = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requesting_Dealer_Name;
			var Requested_Vtn = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requested_Vtn;
			var Offered_Vtn = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Offered_Vtn;
			var Trade_Return = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Return;
			var Requested_Dealer = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requested_Dealer;
			var Requested_Dealer_Name = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requested_Dealer_Name;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var Req_Current_ETA_FromData = that.getView().byId("ctetid").getText();
			if (Req_Current_ETA_FromData != "") {
				var Req_Current_ETA_From = oDateFormat.format(new Date(Req_Current_ETA_FromData));
			} else {
				var Req_Current_ETA_From = oDateFormat.format(new Date());
			}
			var Req_Current_ETA_To = that.getView().byId("txtlab").getText();

			if (Req_Current_ETA_To != "") {
				var Req_Current_ETA_To = oDateFormat.format(new Date(Req_Current_ETA_To));
			} else {
				var Req_Current_ETA_To = oDateFormat.format(new Date());
			}

			var Req_Proposed_ETA_From = that.getView().byId("prpetid").getText();

			if (Req_Proposed_ETA_From != "") {
				var Req_Proposed_ETA_From = oDateFormat.format(new Date(Req_Proposed_ETA_From));
			} else {
				var Req_Proposed_ETA_From = oDateFormat.format(new Date());
			}
			var Req_Proposed_ETA_To = that.getView().byId("otxtlabel").getText();
			if (Req_Proposed_ETA_To != "") {
				var Req_Proposed_ETA_To = oDateFormat.format(new Date(Req_Proposed_ETA_To));
			} else {
				var Req_Proposed_ETA_To = oDateFormat.format(new Date());
			}

			var Off_Current_ETA_From = that.getView().byId("ctqtid").getText();
			if (Off_Current_ETA_From != "") {
				var Off_Current_ETA_From = oDateFormat.format(new Date(Off_Current_ETA_From));
			} else {
				var Off_Current_ETA_From = oDateFormat.format(new Date());
			}
			var Off_Current_ETA_To = that.getView().byId("txlab").getText();
			if (Off_Current_ETA_To != "") {
				var Off_Current_ETA_To = oDateFormat.format(new Date(Off_Current_ETA_To));
			} else {
				var Off_Current_ETA_To = oDateFormat.format(new Date());
			}

			var Off_Proposed_ETA_From = that.getView().byId("prptid").getText();
			if (Off_Proposed_ETA_From != "") {
				var Off_Proposed_ETA_From = oDateFormat.format(new Date(Off_Proposed_ETA_From));
			} else {
				var Off_Proposed_ETA_From = oDateFormat.format(new Date());
			}

			var Off_Proposed_ETA_To = that.getView().byId("otxlabel").getText();
			if (Off_Proposed_ETA_To != "") {
				var Off_Proposed_ETA_To = oDateFormat.format(new Date(Off_Proposed_ETA_To));
			} else {
				var Off_Proposed_ETA_To = oDateFormat.format(new Date());
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

			var Created_By = this.getView().byId("SimpleFormUpdateTrReq").getModel().oData.Created_By;
			var Created_On = this.getView().byId("SimpleFormUpdateTrReq").getModel().oData.Created_On;

			if (Created_On != null && Created_On != "") {
				var dateTo = Created_On.split("(")[1];
				if (dateTo.includes("+") == true) {
					dateTo = dateTo.split("+")[0];
				} else {
					dateTo = dateTo;
				}
				var dataTo1 = dateTo.substring(0, dateTo.length - 5);
				var ValidTo = new Date(dataTo1 * 1000);
				ValidTo = ValidTo.toGMTString().substring(4, 16);
		var	oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
				Created_On = oDateFormat.format(new Date(ValidTo));

			}
			var Changed_on = oDateFormat.format(new Date());

	
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
				"Changed_on": Changed_on,
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
			that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "PUT"
			});
var UpdatedTreadeEntity="/TradeRequest('"+Trade_Id+"')";
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, null, function (s) {
				debugger
			
				that.TradeVehcles(oEntry);
					that.TradeStatus(oEntry);
				/*	that.TradeComment(oEntry);
					that.TradeVehcles(oEntry);
					that.TradeStatus(oEntry);
					that.VehicleTrade_Summary();
				*/

				//	that.getRouter().navTo("VehicleTrade_Summary");
			}, function () {
	alert("fail");
			});

			
			
			
			
			
		},
		
		TradeVehcles: function (oEntry) {

			var that = this;
			var Trade_Id = oEntry.Trade_Id;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var oCommentdate = oDateFormat.format(new Date());
			var Suffix = that.getView().byId("suffxidt").getText().split("-")[0];
			if (Suffix != "") {
				var intColor = that.getView().byId("suffxidt").getText().split("/")[1];
			} else {
				var intColor = "";
			}
			var model = that.getView().byId("mdlde").getText().split("-")[0];
			var modelYear = that.getView().byId("mdlyrtext").getText();
			var Apx = that.getView().byId("apxTid").getText();
			var Series = that.getView().byId("serisTex").getText().split("-")[0];
			var exterior = that.getView().byId("extclod").getText().split("-")[0];
			var vtn = that.getView().byId("ovtnId").getText();
			var ostatus = this.getView().byId("SimpleFormUpdateTrReq").getModel().oData.Status;
	
			var oOrdertype = this.getView().byId("SimpleFormUpdateTrReq").getModel().oData.Order_Type;
			var DNC = this.getView().byId("SimpleFormUpdateTrReq").getModel().oData.DNC;
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
		//	that.nodeJsUrl = that.sPrefix + "/vehicleTrade";
		that.nodeJsUrl = that.sPrefix;
			that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "PUT"
			});
            var UpdatedTreadeEntity="/TradeVehicles(Trade_Id.Trade_Id ='"+oEntry.Trade_Id+"',VTN ='"+oEntry1.VTN+"')";
			that.oDataModel.update(UpdatedTreadeEntity, oEntry1, null, function (s) {
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
			var Suffix = that.getView().byId("suffxidt").getText().split("-")[0];
			if (Suffix != "") {
				var Suffix = that.getView().byId("suffxidt").getText();
				var intColor = Suffix.substr(Suffix.indexOf("/") + 1);
				//	var intColor = that.getView().byId("oZsuffix").getText().split("/")[1];
			} else {
				var intColor = "";
			}
			var Model_Description = that.getView().byId("mdlde").getText().split("-")[1];
			var Series_Desc = that.getView().byId("serisTex").getText().split("-")[0];
			if (Series_Desc != "") {
				var Series_Desc = that.getView().byId("serisTex").getText();
				Series_Desc = Series_Desc.substr(Series_Desc.indexOf("-") + 1);
			} else {
				Series_Desc = "";
			}
			var Suffix_Desc = that.getView().byId("suffxidt").getText().split("-")[0];
			if (Suffix_Desc != "") {
				var Suffix_Desc = that.getView().byId("suffxidt").getText();
				//	Suffix_Desc =that.getView().byId("oZsuffix").getText().split("-")[1];
				Suffix_Desc = Suffix_Desc.substr(Suffix_Desc.indexOf("-") + 1);
			Suffix_Desc=Suffix_Desc.substring(0,Suffix_Desc.indexOf('/'));
			} else {
				Suffix_Desc = "";
			}
			/*	var Int_Colour_Desc = that.getView().byId("oZsuffix").getText().split("-")[0];*/
			var Ext_Colour_Desc = that.getView().byId("extclod").getText().split("-")[0];
			if (Ext_Colour_Desc != "") {
				var Ext_Colour_Desc = that.getView().byId("extclod").getText();
				Ext_Colour_Desc = Ext_Colour_Desc.substr(Ext_Colour_Desc.indexOf("-") + 1);
				//	Ext_Colour_Desc =that.getView().byId("Zextcolo").getText().split("-")[1];
			} else {
				Ext_Colour_Desc = "";
			}
                                         
		/*	var Spars = sap.ui.getCore().getConfiguration().getLanguage();*/
		
			var oVTN = that.getView().byId("ovtnId").getText();
			var Spars = this.getView().byId("SimpleFormUpdateTrReq").getModel().oData.SPRAS;
				if (Spars == "fr") {
				Spars = "F";
			} else {
				Spars = "E";
			}

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
		//	that.nodeJsUrl = that.sPrefix + "/vehicleTrade";
		that.nodeJsUrl = that.sPrefix;
			that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			that.oDataModel.setHeaders({
				"Content-Type": "application/json",
				"X-Requested-With": "XMLHttpRequest",
				"DataServiceVersion": "2.0",
				"Accept": "application/json",
				"Method": "PUT"
			});
             var UpdatedTreadeEntity="/TradeVehicleDesc(Trade_Id.Trade_Id ='"+oEntry.Trade_Id+"',VTN.VTN ='"+oEntry2["VTN.VTN"]+"',SPRAS='"+oEntry2.SPRAS+"')";
			that.oDataModel.update(UpdatedTreadeEntity, oEntry2, null, function (s) {
				alert("ok");
			}, function () {

			});

		},

		oAddCommentsArea: function () 
		{
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
					var TradeId = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Id;

					var that = this;

					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd'T'HH:mm:ss"
					});
					var oCommentdate = oDateFormat.format(new Date());
					var oCreatedby = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Created_By;

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
	onBackpage: function()
	{
		this.getRouter().navTo("VehcTrad_Apprv_Rej_CounTrad");
		
	},
	onSelectvehcicle: function()
	{
		debugger
		
            var that=this;
			sap.ui.core.BusyIndicator.show();
			
			var McCmbo = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Model;
			 this.SelectedExteriorColorCode = "";
			  this.SelectedTrimInteriorColor = "";
			 var SuffCmbo = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Suffix;
			 var MoyearCombo = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Model_Year;
	
			 if(this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().FromRequesting==true)
			 {
			 	 var oDealer = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requesting_Dealer;
			 	
			 }else if(this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().FromRequesting==false)
			 {
			 	var oDealer = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requested_Dealer;
			 }
		
			
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
				
	//	var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter= kunnr eq '" + oDealer + "'";
						
		
			$.ajax({
				url: SeriesUrl,
				type: "GET",
				dataType: 'json',
				xhrFields: //
				{
					withCredentials: true
				},
				beforeSend: function (request) {
					request.setRequestHeader('Authorization', 'Basic ' + btoa('anisetc:anisetc'));
				},

				success: function (odata, oresponse) {
				
					var a = odata.d.results;
				
				/*var filtered_ODealer = a.filter(function (x) {
						return (x.kunnr==oDealer);
					});*/
					var Dealer = sap.ui.getCore().LoginDetails.DealerCode;

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
					 	SelectedVehicleFrom:"VehileTrade_UpdtTradReq"
					 });
				     sap.ui.core.BusyIndicator.hide();
					
			
				},
				error:function(){
					  that.getRouter().navTo("VehicleTrade_VehicleSelection",{
					 	SelectedVehicleFrom:"VehileTrade_UpdtTradReq"
					 });
					 sap.ui.core.BusyIndicator.hide();
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
		
		
		
			this.getRouter().navTo("VehicleTrade_VehicleSelection");
		
	}

	});
});