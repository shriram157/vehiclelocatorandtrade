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
	var Offered_V = '',
		tradeId_no;
	return BaseController.extend("vehicleLocator.controller.VehicleTrade_UpdtTradReq", {

		onInit: function () {
			var _that = this;

			var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
			var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
			this.getView().byId("oDealerCode6").setText(LoggedInDealerCode2);
			this.getView().byId("oDealerUpdatescr").setText(LoggedInDealer);

			/// set the logo and Language. 

			this._setTheLanguage();

			this._setTheLogo();

			this.getRouter().attachRouteMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function (oEvent) {
			this.i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
			var SelectedTrade = oEvent.getParameter("arguments").SelectedTrade;
			/*	var pardia_title = i18n.getText("ctrl_success_dialog");
				var succdia_text = i18n.getText("ctrl_successdialog_text");*/
			if (sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq") != undefined && SelectedTrade != "VehicleTrade_updateTradeVehicle" &&
				SelectedTrade != undefined) {
				this.getView().byId("SimpleFormUpdateTrReq").setModel(sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq"));
				this.getView().byId("SimpleForrmDisa220").setModel(sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq"));
				this.getView().byId("SimpleForrmDisa220").bindElement("/");
				var UpdateTrStatus = [];
				this.getView().byId("SimpleFormUpdateTrReq").bindElement("/");
				this.getView().byId("SimpleFormUpdateTrReq").getModel().refresh(true);
				UpdateTrStatus.push(sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData());
				var oStatusModel = new sap.ui.model.json.JSONModel(UpdateTrStatus);
				this.getView().byId("oTradeinRet").setModel(oStatusModel);
				var tradeStatus = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Return;
				var tradeId = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Id.slice(2, 8);
				//----Offered Vehicle---------------------------------
				if (this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Offered_Vtn) {
					Offered_V = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Offered_Vtn;
				}
				//=================================================
				//======Filter Trade Request Comments=================
				//=================================================
				tradeId_no = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Id;
				this.getView().byId("tableVrade").getBinding('items').filter([new sap.ui.model.Filter("Trade_Id.Trade_Id", sap.ui.model.FilterOperator
					.EQ, sap.ui
					.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Id)]);
				//===============================================	
				var UpdateTradeRequestChange = this.i18n.getText("UpdateTradeRequestChange");
				this.getView().byId("oUpdateTRId").setText(UpdateTradeRequestChange + tradeId);
				var Add_CommentStatus = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Status;
				/*	var that=this;*/
				if (Add_CommentStatus == "C" || Add_CommentStatus == "S") {
					this.getView().byId("oAddbutton").setEnabled(true);
				} else {
					this.getView().byId("oAddbutton").setEnabled(false);

				}

				if (tradeStatus == "Y") {
					var newItem = new sap.ui.core.Item({
						key: "N",
						text: "No"
					});
					this.getView().byId("oTradeinRet").insertItem(newItem);
					this.getView().byId("oTradeinRet").setSelectedKey("Y");
					this.getView().byId("oSelectBtn").setEnabled(true);
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
					this.getView().byId("txtlab").setVisible(true);
					this.getView().byId("tolbid").setVisible(true);
					this.getView().byId("prlabid").setVisible(true);

					this.getView().byId("prpetid").setVisible(true);
					this.getView().byId("fmlabid").setVisible(true);
					this.getView().byId("otxtlabel").setVisible(true);
					this.getView().byId("idlbltxt").setVisible(true);

					/*	this.getView().byId("vehtnum").setVisible(false); */

				} else if (tradeStatus == "N") {
					var newItem = new sap.ui.core.Item({
						key: "Y",
						text: "Yes-Single Vehicle"
					});
					this.getView().byId("oTradeinRet").insertItem(newItem);
					this.getView().byId("oTradeinRet").setSelectedKey("N");

					this.getView().byId("oSelectBtn").setEnabled(false);
					/*	test*/
					this.getView().byId("offfveh").setText("");
					this.getView().byId("vehtnum").setVisible(false);
					this.getView().byId("vehtnum").setVisible(false);

					this.getView().byId("ovtnId").setVisible(false);

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

					this.getView().byId("txtlab").setVisible(false);

					this.getView().byId("tolbid").setVisible(false);

					this.getView().byId("prlabid").setVisible(false);

					this.getView().byId("tolbid").setVisible(false);

					this.getView().byId("prpetid").setVisible(false);

					this.getView().byId("fmlabid").setVisible(false);

					this.getView().byId("otxtlabel").setVisible(false);

					this.getView().byId("idlbltxt").setVisible(false);

				}

				var AcceptVisible = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().FromRequesting;

				if (AcceptVisible == true && (Add_CommentStatus == "S" || Add_CommentStatus == "C")) {

					this.getView().byId("oUpdateSubmitbtn").setVisible(AcceptVisible);
					this.getView().byId("oUpdatePagebtn").setVisible(AcceptVisible);
				} else {
					this.getView().byId("oUpdateSubmitbtn").setVisible(!AcceptVisible);
					this.getView().byId("oUpdatePagebtn").setVisible(!AcceptVisible);
					/*	test*/
					this.getView().byId("vehtnum").setVisible(true);

				}

				var SelectedTradeComment = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getProperty("/SelectedTradeComment");

				// this.getView().byId("tableVrade").setModel(SelectedTradeComment);

				/*	this.getView().byId("VT_ARCTtrdinRet").setModel(oStatusModel);*/
			} else if (sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq") != undefined && SelectedTrade ==
				"VehicleTrade_updateTradeVehicle") {
				this.getView().byId("SimpleFormUpdateTrReq").setModel(sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq"));
				var UpdateTrStatus = [];
				this.getView().byId("SimpleFormUpdateTrReq").bindElement("/");
				this.getView().byId("SimpleFormUpdateTrReq").getModel().refresh(true);
				UpdateTrStatus.push(sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData());
				var oStatusModel = new sap.ui.model.json.JSONModel(UpdateTrStatus);
				//============================================================
				//the below row hashed as there is impact the drop down
				//==============================================================
				//this.getView().byId("oTradeinRet").setModel(oStatusModel);
				/*	var tradeStatus = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Return;*/
				var tradeStatus = this.SelectedTradeKey;
				var tradeId = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Id.slice(2, 8);
				var UpdateTradeRequestChange = this.i18n.getText("UpdateTradeRequestChange");
				this.getView().byId("oUpdateTRId").setText(UpdateTradeRequestChange + tradeId);
				var Add_CommentStatus = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Status;
				/*	var that=this;*/
				if (Add_CommentStatus == "C" || Add_CommentStatus == "S") {
					this.getView().byId("oAddbutton").setEnabled(true);
				} else {
					this.getView().byId("oAddbutton").setEnabled(false);
					/*	test*/
					/*	this.getView().byId("vehtnum").setVisible(false);*/

				}

				if (tradeStatus == "Y") {
					if (this.getView().byId("oTradeinRet").getItems().filter(function (x) {
							return x.mProperties.key == "Y"
						}).length == 0) {
						var newItem = new sap.ui.core.Item({
							key: "Y",
							text: "Yes-Select Vehicle"
						});
						this.getView().byId("oTradeinRet").insertItem(newItem);
					}
					if (this.getView().byId("oTradeinRet").getItems().filter(function (x) {
							return x.mProperties.key == "N"
						}).length == 0) {
						var newItem = new sap.ui.core.Item({
							key: "N",
							text: "No"
						});
						this.getView().byId("oTradeinRet").insertItem(newItem);
					}

					this.getView().byId("oTradeinRet").setSelectedKey("Y");
					this.getView().byId("oSelectBtn").setEnabled(true);

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
					this.getView().byId("txtlab").setVisible(true);
					this.getView().byId("tolbid").setVisible(true);
					this.getView().byId("prlabid").setVisible(true);

					this.getView().byId("prpetid").setVisible(true);
					this.getView().byId("fmlabid").setVisible(true);
					this.getView().byId("otxtlabel").setVisible(true);
					this.getView().byId("idlbltxt").setVisible(true);

					/*	this.getView().byId("vehtnum").setVisible(false); */

				} else if (tradeStatus == "N") {
					if (this.getView().byId("oTradeinRet").getItems().filter(function (x) {
							return x.mProperties.key == "Y"
						}).length == 0) {
						var newItem = new sap.ui.core.Item({
							key: "Y",
							text: "Yes-Select Vehicle"
						});
						this.getView().byId("oTradeinRet").insertItem(newItem);
					}
					if (this.getView().byId("oTradeinRet").getItems().filter(function (x) {
							return x.mProperties.key == "N"
						}).length == 0) {
						var newItem = new sap.ui.core.Item({
							key: "N",
							text: "No"
						});
						this.getView().byId("oTradeinRet").insertItem(newItem);
					}
					this.getView().byId("oTradeinRet").setSelectedKey("N");

					this.getView().byId("oSelectBtn").setEnabled(false);
					/*	test*/

					this.getView().byId("vehtnum").setVisible(false);
					this.getView().byId("vehtnum").setVisible(false);

					this.getView().byId("ovtnId").setVisible(false);

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

					this.getView().byId("txtlab").setVisible(false);

					this.getView().byId("tolbid").setVisible(false);

					this.getView().byId("prlabid").setVisible(false);

					this.getView().byId("tolbid").setVisible(false);

					this.getView().byId("prpetid").setVisible(false);

					this.getView().byId("fmlabid").setVisible(false);

					this.getView().byId("otxtlabel").setVisible(false);

					this.getView().byId("idlbltxt").setVisible(false);

				}

				var AcceptVisible = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().FromRequesting;

				if (AcceptVisible == true && (Add_CommentStatus == "S" || Add_CommentStatus == "C")) {

					this.getView().byId("oUpdateSubmitbtn").setVisible(AcceptVisible);
					this.getView().byId("oUpdatePagebtn").setVisible(AcceptVisible);
				} else {
					this.getView().byId("oUpdateSubmitbtn").setVisible(!AcceptVisible);
					this.getView().byId("oUpdatePagebtn").setVisible(!AcceptVisible);
					/*	test*/
					this.getView().byId("vehtnum").setVisible(true);

				}

				var SelectedTradeComment = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getProperty("/SelectedTradeComment");
				/*	var Status = [];
					Status.push(StatusData);*/
				/*	var oStatusModel = new sap.ui.model.json.JSONModel(Status);*/
				// this.getView().byId("tableVrade").setModel(SelectedTradeComment);
				/*	this.getView().byId("VT_ARCTtrdinRet").setModel(oStatusModel);*/
			}
		},

		onTradeReqStat: function () {
			var SelTrdReturn = this.getView().byId("oTradeinRet").getSelectedKey();
			this.SelectedTradeKey = this.getView().byId("oTradeinRet").getSelectedKey();
			var tradeStatus = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Return;
			if (SelTrdReturn == "Y") {
				/*this.getView().byId("oSelectBtn").setEnabled(false);*/
				this.getView().byId("oSelectBtn").setEnabled(true);
				this.getView().byId("otextId").setText("YesOffered");
			} else {
				this.getView().byId("oSelectBtn").setEnabled(false);
				this.getView().byId("otextId").setText("RemoveOffered");
			}

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

			this.getView().byId("txtlab").setVisible(false);

			this.getView().byId("tolbid").setVisible(false);

			this.getView().byId("prlabid").setVisible(false);
			this.getView().byId("prpetid").setVisible(false);
			//	this.getView().byId("prpetid").setText("");
			this.getView().byId("idlbltxt").setVisible(false);
			this.getView().byId("fmlabid").setVisible(false);
			/*	this.getView().byId("fromlabid").setVisible(false);*/
			this.getView().byId("otxtlabel").setVisible(false);

		},

		UpdatePress: function () {
			var that = this;
			var oOfferedVehicle = this.getView().byId("otextId").getText();
			var SelectedTeade = this.getView().byId("oTradeinRet").getSelectedKey();
			//================================================================================
			//=====Yes for offered without select Vehicle======================
			//=================================================================
			if (oOfferedVehicle == "YesOffered" && SelectedTeade == "Y") {
				sap.m.MessageBox.warning("Please select Vechicle");
				//================================================================================
				//=====No for offered ======================
				//=================================================================	
			} else if (oOfferedVehicle == "RemoveOffered") {

				var Trade_Id = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Id;

				// var sLocation = window.location.host;
				// var sLocation_conf = sLocation.search("webide");

				// if (sLocation_conf == 0) {
				// 	that.sPrefix = "/VehicleLocator_Xsodata";
				// } else {
				// 	that.sPrefix = "";

				// }
				// //	that.nodeJsUrl = that.sPrefix + "/vehicleTrade";
				// that.nodeJsUrl = that.sPrefix;
				// that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

				// that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
				// that.oDataModel.setHeaders({
				// 	"Content-Type": "application/json",
				// 	"X-Requested-With": "XMLHttpRequest",
				// 	"DataServiceVersion": "2.0",
				// 	"Accept": "application/json",
				// 	"Method": "DELETE"
				// });
				// var UpdatedTreadeEntity = "/TradeRequest('" + Trade_Id + "')";
				// that.getView().getModel('TradeRequestModel').remove(UpdatedTreadeEntity, null, null, function (s) {

				// 	},
				// 	function () {

				// 	});
				that.VehicleDelete(Offered_V);
				that.VehicleDesc_delete(Offered_V);
				that.TradeRequestCreate('O', 'U', that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle);

				//  
				//write two functions for trade request and vehicle
				//here left side data only send to backend by taking from simpleform for 'this.getView().byId("").getModel()'
				//================================================================================
				//=====No changes======================
				//=================================================================	
			} else if (oOfferedVehicle == "") {
				var dealer = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requesting_Dealer;
				this.updatewioutchanges(Offered_V, dealer, 'U');
				//================================================================================
				//=====select Vehicle ======================
				//=================================================================
			} else if (oOfferedVehicle == "FromFourth") {
				//delete from both tables and insert new data with updated data (from screen 4)

				// for both req and offered vehicle needs to remove from HDB like before Delete operation

				var Trade_Id = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Id;

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

				// that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
				// that.oDataModel.setHeaders({
				// 	"Content-Type": "application/json",
				// 	"X-Requested-With": "XMLHttpRequest",
				// 	"DataServiceVersion": "2.0",
				// 	"Accept": "application/json",
				// 	"Method": "DELETE"
				// });
				// var UpdatedTreadeEntity = "/TradeRequest('" + Trade_Id + "')";
				// if (!that.getView().getModel('TradeRequestModel').getSecurityToken()) {
				// 	that.getView().getModel('TradeRequestModel').refreshSecurityToken();
				// }
				// that.getView().getModel('TradeRequestModel').remove(UpdatedTreadeEntity, null, null, function (s) {

				// 	},
				// 	function () {

				// 	});
				//===<< if there is old offered vehicle >>==========
				if (Offered_V != '') {
					that.VehicleDelete(Offered_V);
					that.VehicleDesc_delete(Offered_V);
				}
				//================<< Update the Trade Req with the new Offered Vehicle >>========
				that.TradeRequestCreate('X', 'U', that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle); //Update Trade Req
				//========================<< Create new Vehicle >>=====================
				that.TradeVehicleCreateFromVehicle_Selection(that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle);

				//  
				//write two functions for trade request and vehicle
				//here left side data only send to backend by taking from simpleform for 'this.getView().byId("").getModel()'

			}
		},
		VehicleDelete: function (vin) {
			var that = this;
			var Trade_Id = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Id;
			//	var RequesetdVtn = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requested_Vtn;
			var OfferedVTn = vin; //that.getView().byId("ovtnId").getText();
			//	var oVehicleVTN = [RequesetdVtn, OfferedVTn];
			// var sLocation = window.location.host;
			// var sLocation_conf = sLocation.search("webide");

			// if (sLocation_conf == 0) {
			// 	that.sPrefix = "/VehicleLocator_Xsodata";
			// } else {
			// 	that.sPrefix = "";

			// }
			// that.nodeJsUrl = that.sPrefix;
			// that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

			// that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			// that.oDataModel.setHeaders({
			// 	"Content-Type": "application/json",
			// 	"X-Requested-With": "XMLHttpRequest",
			// 	"DataServiceVersion": "2.0",
			// 	"Accept": "application/json",
			// 	"Method": "DELETE"
			// });

			/*	that.oDataModel.create("/TradeVehicles", oEntry1, null, function (s) {*/
			// for (var i = 0; i < oVehicleVTN.length; i++) {
			// 	//	var VehicleUrl=	"/TradeVehicles(Trade_Id.Trade_Id eq'"+Trade_Id+"' and VTN eq'"+oVehicleVTN[i]+ "')";
			var VehicleUrl = "/TradeVehicles(Trade_Id.Trade_Id='" + Trade_Id + "',VTN='" + OfferedVTn + "')";
			that.getView().getModel('TradeRequestModel').remove(VehicleUrl, null, null, function (s) {

			}, function () {

			});
			// }

			/*/TradeVehicles(Trade_Id.Trade_Id='TR000001',VTN='002359')*/

		},
		oUpdateSubmitbtn_old: function () {

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

			var Created_By = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');

			Created_By = truncateString(Created_By, 12); //=== === =
			function truncateString(str, num) {
				if (num > str.length) {
					return str;
				} else {
					str = str.substring(0, num);
					return str;
				}

			}

			Created_By = truncateString(Created_By, 9);

			var Created_On = this.getView().byId("SimpleFormUpdateTrReq").getModel().oData.Created_On;

			if (Created_On != null && Created_On != "") {
				var dateTo = Created_On.split("(")[1];
				if (dateTo.indexOf("+") != -1) {
					dateTo = dateTo.split("+")[0];
				} else {
					dateTo = dateTo;
				}
				var dataTo1 = dateTo.substring(0, dateTo.length - 5);
				var ValidTo = new Date(dataTo1 * 1000);
				ValidTo = ValidTo.toGMTString().substring(4, 16);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
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
			var UpdatedTreadeEntity = "/TradeRequest('" + Trade_Id + "')";
			that.getView().getModel('TradeRequestModel').update(UpdatedTreadeEntity, oEntry, null, function (s) {

				that.TradeVehcles(oEntry);
				that.TradeStatus(oEntry);
				/*	that.TradeComment(oEntry);
					that.TradeVehcles(oEntry);
					that.TradeStatus(oEntry);
					that.VehicleTrade_Summary();
				*/

				//	that.getRouter().navTo("VehicleTrade_Summary");
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
			var UpdatedTreadeEntity = "/TradeVehicles(Trade_Id.Trade_Id ='" + oEntry.Trade_Id + "',VTN ='" + oEntry1.VTN + "')";
			that.oDataModel.update(UpdatedTreadeEntity, oEntry1, null, function (s) {
				/*	alert("ok");*/
			}, function () {

			});

		},
		TradeStatus: function (oEntry) {
			//===============================================
			//====<< Save The Desc >>=======================
			//===========================================
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
				Suffix_Desc = Suffix_Desc.substring(0, Suffix_Desc.indexOf('/'));
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
			if (Spars != "E") {
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
			var UpdatedTreadeEntity = "/TradeVehicleDesc(Trade_Id.Trade_Id ='" + oEntry.Trade_Id + "',VTN.VTN ='" + oEntry2["VTN.VTN"] +
				"',SPRAS='" + oEntry2.SPRAS + "')";
			that.oDataModel.update(UpdatedTreadeEntity, oEntry2, null, function (s) {

			}, function () {

			});

		},

		oAddCommentsArea: function () {
			var Comment = this.getView().byId("oComments").getValue();
			if (Comment == "") {
				sap.m.MessageBox.error("Please enter comment");
			} else {

				if (this.getView().byId("tableVrade").getModel('TradeRequestModel') != undefined) {
					var oComment_Id = this.getView().byId("tableVrade").getBinding('items').getLength().toString();
					var TradeId = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Id;

					var that = this;

					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd'T'HH:mm:ss"
					});
					var oCommentdate = new Date(oDateFormat.format(new Date()));
					oCommentdate.setDate(oCommentdate.getDate());

					var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
					var LoggedinUserLname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
					var Created_By = LoggedinUserFname + LoggedinUserLname;
					Created_By = Created_By.substr(0, 12);
					var oTradeComment = {

						"Trade_Id.Trade_Id": TradeId,
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
						that.getView().byId("oComments").setValue("");
						that.getView().byId('tableVrade').getBinding('items').refresh();
					}, function () {

					});

					/*	this.getView().byId("Comment_Txt").setValue("");	
					 */
				}
			}
		},
		onBackpage: function () {
			// this.getRouter().navTo("VehcTrad_Apprv_Rej_CounTrad");
			this.getRouter().navTo("VehicleTrade_Summary", {
				DataClicked: "FromUpdateScreen"

			});
		},
		onSelectvehcicle: function () {

			var that = this;
			sap.ui.core.BusyIndicator.show();

			/*	var McCmbo = this.getOwnerComponent().SelectedMSMData[0].McCmbo;
				this.SelectedExteriorColorCode = "";
				this.SelectedTrimInteriorColor = "";
				var SuffCmbo = this.getOwnerComponent().SelectedMSMData[0].SuffCmbo;
				var MoyearCombo = this.getOwnerComponent().SelectedMSMData[0].MoyearCombo;*/

			var oDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;
			/*	var Series = this.getOwnerComponent().SelectedMSMData[0].SeriesCmbo;*/

			if (this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().FromRequesting == true) {
				var oDealer = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requesting_Dealer;

			} else if (this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().FromRequesting == false) {
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

			var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=kunnr eq '" + oDealer +
				"'&$format=json";

			/*	var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'" + McCmbo + "' and zzsuffix eq '" + SuffCmbo + "' and zzmoyr eq '" + MoyearCombo + "' and kunnr eq '" + oDealer +
					"'";*/

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
							ExcludeOrdType.push(filtered_ODealer[i]);
						}
					}
					//		var oJsonModel = new sap.ui.model.json.JSONModel(oExcludeOrdrtype);
					var IncludeOrdertype = oExcludeOrdrtype.filter(function (x) {
						return (x.zzordertype == "SO" || x.zzordertype == "DM");
					});
					/*var includeDnc = oExcludeOrdrtype.filter(function (x) {
						return x.dnc_ind == "Y";
					});
					var includeHoldStatus = includeDnc.filter(function (x) {
						return x.Hold_stat == "Y";
					});
					var oJsonModel = new sap.ui.model.json.JSONModel(includeHoldStatus);*/
					//comment this line
					var oJsonModel = new sap.ui.model.json.JSONModel(IncludeOrdertype);
					///////

					oJsonModel.setSizeLimit(1500);
					sap.ui.getCore().setModel(oJsonModel, "oVehicleSelectionResults");
					that.getRouter().navTo("VehicleTrade_VehicleSelection", {
						SelectedVehicleFrom: "VehileTrade_UpdtTradReq"
					});
					sap.ui.core.BusyIndicator.hide();

				},
				error: function () {
					that.getRouter().navTo("VehicleTrade_VehicleSelection", {
						SelectedVehicleFrom: "VehileTrade_UpdtTradReq"
					});
					sap.ui.core.BusyIndicator.hide();
				}
			});

			this.getRouter().navTo("VehicleTrade_VehicleSelection");

		},
		RequestedVehicleCreate: function () {
			var oRequestedData = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData();

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
							"Created_On": new Date(Created_On),
							"Changed_on": new Date(Changed_on),
							"Requested_Dealer": Requested_Dealer,
							"Requested_Dealer_Name": Requested_Dealer_Name

						};*/

		},

		TradeRequestCreate: function (I, Type, offeredv) {
			//============================================================
			//===Update The Trade Request==================
			//=============================================================
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
					/*	pattern: "yyyy-MM-dd"*/

			});

			//------ requested dealer info//

			var that = this;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				this.sPrefix = "";

			}
			var Trade_Id = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Id;
			var RequestData = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData();

			if (that.getView().byId("oTradeinRet").getSelectedKey() == "Y") {
				var Trade_Return = "Y";
			} else if (that.getView().byId("oTradeinRet").getSelectedKey() == "N") {
				var Trade_Return = "N";
			}
			//================================
			//====if type submit change the status to S===============
			//=============================
			if (Type == 'S') {
				var Trade_Status = 'S';
			} else {
				Trade_Status = RequestData.Trade_Status;
			}
			/*	var Requesting_Dealer = that.getView().byId("dealrid").getText().substr(0, that.getView().byId("dealrid").getText().indexOf(
					"-"));*/
			/*	var Requesting_Dealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;*/

			var Requesting_Dealer = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requesting_Dealer;

			/*	var Requesting_Dealer_Name = that.getView().byId("dealrid").getText().substr(that.getView().byId("dealrid").getText().indexOf(
					"-") + 1);*/
			/*	var Requesting_Dealer_Name = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName;*/

			var Requesting_Dealer_Name = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requesting_Dealer_Name;
			//var Requested_Vtn = that.getView().byId("vtnid").getText();
			var Requested_Vtn = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requested_Vtn;
			if (I == 'X') {
				var Offered_Vtn = offeredv.Offered_Vtn;
			} else {
				var Offered_Vtn = '';
			}
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
			var Req_Current_ETA_From = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Req_Current_ETA_From;
			Req_Current_ETA_From = this.DatesFormatting(Req_Current_ETA_From);
			/*	if (Req_Current_ETA_FromData != "") {
					var Req_Current_ETA_From = new Date(oDateFormat.format(new Date(Req_Current_ETA_FromData)));
				} else {
					var Req_Current_ETA_From = "0000-00-00T00:00:00";
				}*/
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
			var Req_Current_ETA_To = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Req_Current_ETA_To;
			Req_Current_ETA_To = this.DatesFormatting(Req_Current_ETA_To);
			/*	if (Req_Current_ETA_ToDate != "") {
					var Req_Current_ETA_To = new Date(oDateFormat.format(new Date(Req_Current_ETA_ToDate)));
				} else {
					var Req_Current_ETA_To = "0000-00-00T00:00:00";
				}*/
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
			var Req_Proposed_ETA_From = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Req_Proposed_ETA_From;
			Req_Proposed_ETA_From = this.DatesFormatting(Req_Proposed_ETA_From);

			/*	if (Req_Proposed_ETA_FromDate != "") {
					var Req_Proposed_ETA_From = new Date(oDateFormat.format(new Date(Req_Proposed_ETA_FromDate)));
				} else {
					var Req_Proposed_ETA_From = "0000-00-00T00:00:00";
				}*/
			var Req_Proposed_ETA_To = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Req_Proposed_ETA_To;
			Req_Proposed_ETA_To = this.DatesFormatting(Req_Proposed_ETA_To);
			/*	if (Req_Proposed_ETA_ToDate != "") {
					var Req_Proposed_ETA_To = new Date(oDateFormat.format(new Date(Req_Proposed_ETA_ToDate)));
				} else {
					var Req_Proposed_ETA_To = "0000-00-00T00:00:00";
				}*/
			var Off_Current_ETA_From = "0000-00-00T00:00:00",
				Off_Current_ETA_To = "0000-00-00T00:00:00",
				Off_Proposed_ETA_From = "0000-00-00T00:00:00",
				Off_Proposed_ETA_To = "0000-00-00T00:00:00";
			if (I == 'X') {
				Off_Current_ETA_From = offeredv.Off_Current_ETA_From;
				Off_Current_ETA_From = this.DatesFormatting(Off_Current_ETA_From);
				/*	if (Off_Current_ETA_FromDate != "") {
						var Off_Current_ETA_From = new Date(oDateFormat.format(new Date(Off_Current_ETA_FromDate)));
					} else {
						var Off_Current_ETA_From = "0000-00-00T00:00:00";
					}*/
				Off_Current_ETA_To = offeredv.Off_Current_ETA_To;
				Off_Current_ETA_To = this.DatesFormatting(Off_Current_ETA_To);
				/*	if (Off_Current_ETA_ToDate != "") {
						var Off_Current_ETA_To = new Date(oDateFormat.format(new Date(Off_Current_ETA_ToDate)));
					} else {
						var Off_Current_ETA_To = "0000-00-00T00:00:00";
					}*/

				Off_Proposed_ETA_From = offeredv.Off_Proposed_ETA_From;
				Off_Proposed_ETA_From = this.DatesFormatting(Off_Proposed_ETA_From);
				/*	if (Off_Proposed_ETA_FromDate != "") {
						var Off_Proposed_ETA_From = new Date(oDateFormat.format(new Date(Off_Proposed_ETA_FromDate)));
					} else {
						var Off_Proposed_ETA_From = "0000-00-00T00:00:00";
					}*/

				Off_Proposed_ETA_To = offeredv.Off_Proposed_ETA_To;
				Off_Proposed_ETA_To = this.DatesFormatting(Off_Proposed_ETA_To);
			}
			/*	if (Off_Proposed_ETA_ToDate != "") {
					var Off_Proposed_ETA_To = new Date(oDateFormat.format(new Date(Off_Proposed_ETA_ToDate)));
				} else {
					var Off_Proposed_ETA_To = "0000-00-00T00:00:00";
				}*/
			var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
			var LoggedinUserLname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
			var Created_By = LoggedinUserFname + LoggedinUserLname;

			// function truncateString(str, num) {
			// 	if (num > str.length) {
			// 		return str;
			// 	} else {
			// 		str = str.substring(0, num);
			// 		return str;
			// 	}

			// }

			Created_By = Created_By.substr(0, 12);
			var Created_On = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Created_On;
			Created_On = this.DatesFormattingCreatedOnDate(Created_On);

			var Changed_on = new Date();
			Changed_on = oDateFormat.format(new Date(Changed_on));
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
			var Requested_Dealer = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requested_Dealer;
			var Requested_Dealer_Name = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requested_Dealer_Name.substr(that.getView()
				.byId("SimpleFormUpdateTrReq").getModel().getData().Requested_Dealer_Name.indexOf(
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
			var UpdatedTreadeEntity = "/TradeRequest('" + Trade_Id + "')";
			// that.getView().getModel('TradeRequestModel')
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, null, function (s) {
				//	that.getView().byId("oTrdareqstat").setText("Request Sent");

			}, function () {

			});

		},
		TradeVehicleCreate: function () {

			var that = this;
			/*	var Trade_Id = oEntry.Trade_Id;*/
			var VehicleTrade_Id = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Id;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
					/*	pattern: "yyyy-MM-dd"*/
			});
			var oCommentdate = new Date(oDateFormat.format(new Date()));
			oCommentdate.setDate(oCommentdate.getDate() + 1);

			var oSuffixReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Suffix.split("-")[0];
			var omodelReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Model.split("-")[0];
			var omodelYearReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Model_Year;
			var oApxReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().APX;
			var oSeriesReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Series;
			var oexteriorReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Ext_Colour.split("-")[0];
			var ointeriorReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Int_Colour;
			var ovtnReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().VTN;
			var ostatusReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Status;
			var oOrdertypeReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Order_Type;
			var oDNCreq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().DNC;

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
				VTN: ovtnReq,
			};
			oEntry2["Trade_Id.Trade_Id"] = VehicleTrade_Id;
			var oVehicleDetails = [];
			oVehicleDetails.push(oEntry2);
			if (that.getView().byId("otextId").getText() != "RemoveOffered") {
				//	changehere also
				var Suffix = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Suffix;

				var intColor = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Int_Colour;

				var model = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Model;
				var modelYear = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Model_Year;
				var Apx = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.APX;
				var Series = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Series;
				var exterior = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.zzextcol; //Ext_Colour;
				var vtn = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.VTN;
				var ostatus = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Status;
				var oOrdertype = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Order_Type;
				var DNC = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.DNC;
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
				oEntry1["Trade_Id.Trade_Id"] = VehicleTrade_Id;
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
				that.getView().getModel('TradeRequestModel').create("/TradeVehicles", oVehicleDetails[i], null, function (s) {
					/*	alert("ok");*/
				}, function () {

				});
			}
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
					
					
					var dataTo1 = dateTo.substring(0, dateTo.length -2 );
					
					var  currentTime = new Date(Number(dataTo1));
					
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
		TradeVehicleCreateForWithOutChange: function () {
			var that = this;
			/*	var Trade_Id = oEntry.Trade_Id;*/
			var VehicleTrade_Id = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Id;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
					/*	pattern: "yyyy-MM-dd"*/
			});
			var oCommentdate = new Date(oDateFormat.format(new Date()));
			oCommentdate.setDate(oCommentdate.getDate() + 1);

			var oSuffixReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Suffix.split("-")[0];
			var omodelReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Model.split("-")[0];
			var omodelYearReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Model_Year;
			var oApxReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().APX;
			var oSeriesReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Series;
			var oexteriorReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Ext_Colour.split("-")[0];
			var ointeriorReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Int_Colour;
			var ovtnReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().VTN;
			var ostatusReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Status;
			var oOrdertypeReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Order_Type;
			var oDNCreq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().DNC;

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
				VTN: ovtnReq,
			};
			oEntry2["Trade_Id.Trade_Id"] = VehicleTrade_Id;
			var oVehicleDetails = [];
			oVehicleDetails.push(oEntry2);
			if (that.getView().byId("otextId").getText() == "" && that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().VehicleTradeVehicle != {}) {
				var Suffix = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Suffix;

				var intColor = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Int_Colour;

				var model = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Model;
				var modelYear = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Model_Year;
				var Apx = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.APX;
				var Series = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Series;
				var exterior = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Ext_Colour;
				var vtn = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.VTN;
				var ostatus = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Status;
				var oOrdertype = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.Order_Type;
				var DNC = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle.DNC;
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
				oEntry1["Trade_Id.Trade_Id"] = VehicleTrade_Id;
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
		TradeVehicleCreateFromVehicle_Selection: function (offeredv) {
			//============================================================
			//=== Create the Selected New Offered Vehicle==================
			//=============================================================
			var that = this;
			/*	var Trade_Id = oEntry.Trade_Id;*/
			var VehicleTrade_Id = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Id;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
					/*	pattern: "yyyy-MM-dd"*/
			});
			var oCommentdate = new Date(oDateFormat.format(new Date()));
			oCommentdate.setDate(oCommentdate.getDate() + 1);

			var oSuffixReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Suffix.split("-")[0];
			var omodelReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Model.split("-")[0];
			var omodelYearReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Model_Year;
			var oApxReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().APX;
			var oSeriesReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Series;
			var oexteriorReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Ext_Colour.split("-")[0];
			var ointeriorReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Int_Colour;
			var ovtnReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().VTN;
			var ostatusReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Status;
			var oOrdertypeReq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Order_Type;
			var oDNCreq = that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().DNC;

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
				VTN: ovtnReq,
			};
			oEntry2["Trade_Id.Trade_Id"] = VehicleTrade_Id;
			var oVehicleDetails = [];
			oVehicleDetails.push(oEntry2);
			//==========================================================
			// if (that.getView().byId("otextId").getText() == "FromFourth" && that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().VehicleTradeVehicle != {}) {
			var Suffix = offeredv.Suffix;

			var intColor = offeredv.Int_Colour || offeredv.zzintcol;

			var model = offeredv.Model;
			var modelYear = offeredv.Model_Year;
			var Apx = offeredv.APX;
			var Series = offeredv.Series;
			var exterior = offeredv.zzextcol || offeredv.Ext_Colour; //Ext_Colour;
			var vtn = offeredv.Offered_Vtn;
			var ostatus = offeredv.Status;
			var oOrdertype = offeredv.Order_Type;
			var DNC = offeredv.DNC || offeredv.dnc_ind;
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
			oEntry1["Trade_Id.Trade_Id"] = VehicleTrade_Id;
			oVehicleDetails.push(oEntry1);
			// }

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
			if (!that.getView().getModel('TradeRequestModel').getSecurityToken()) {
				that.getView().getModel('TradeRequestModel').refreshSecurityToken();
			}

			/*	that.oDataModel.create("/TradeVehicles", oEntry1, null, function (s) {*/
			// for (var i = 0; i < oVehicleDetails.length; i++) {
			that.getView().getModel('TradeRequestModel').create("/TradeVehicles", oEntry1, null, function (s) {
				/*	alert("ok");*/

			}, function () {

			});
			that.VehicleDesc_create(vtn, offeredv);
			// }

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
		VehicleDesc_create: function (vin, offeredv) {
			//===============================================
			//====<< Save The Desc >>=======================
			//===========================================
			var that = this;
			var Trade_Id = tradeId_no;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var oCommentdate = oDateFormat.format(new Date());
			var Suffix = that.getView().byId("suffxidt").getText();
			if (Suffix) {
				var intColor = Suffix.substr(Suffix.indexOf("/") + 1);
			}
			var Model_Description = offeredv.Model_Desc; //that.getView().byId("mdlde").getText().split("-")[1];
			var Series_Desc = offeredv.Series_Desc; //.split("-")[0];
			var Suffix_Desc = offeredv.Suffix_Desc; //that.getView().byId("suffxidt").getText().split("-")[1];
			var Ext_Colour_Desc = offeredv.Ext_Colour_Desc; //that.getView().byId("extclod").getText().split("-")[1];

			/*	var Spars = sap.ui.getCore().getConfiguration().getLanguage();*/

			var oVTN = that.getView().byId("ovtnId").getText();
			var Spars = this.getView().byId("SimpleFormUpdateTrReq").getModel().oData.SPRAS;
			if (Spars != "E") {
				Spars = "F";
			} else {
				Spars = "E";
			}

			var oEntry1 = {

				SPRAS: 'E',
				Model_Desc: offeredv.model_desc_en,
				Series_Desc: offeredv.zzseries_desc_en,
				Suffix_Desc: offeredv.suffix_desc_en,
				Int_Colour_Desc: offeredv.mrktg_int_desc_en,
				Ext_Colour_Desc: offeredv.mktg_desc_en

			};
			oEntry1["Trade_Id.Trade_Id"] = tradeId_no;
			oEntry1["VTN.VTN"] = oVTN;

			var oEntry2 = {

				SPRAS: 'F',
				Model_Desc: offeredv.model_desc_fr,
				Series_Desc: offeredv.zzseries_desc_fr,
				Suffix_Desc: offeredv.suffix_desc_fr,
				Int_Colour_Desc: offeredv.mrktg_int_desc_fr,
				Ext_Colour_Desc: offeredv.mktg_desc_fr

			};
			oEntry2["Trade_Id.Trade_Id"] = tradeId_no;
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
				"Method": "POST"
			});
			// var UpdatedTreadeEntity = "/TradeVehicleDesc(Trade_Id.Trade_Id ='" + oEntry.Trade_Id + "',VTN.VTN ='" + oEntry2["VTN.VTN"] +
			// 	"',SPRAS='" + oEntry2.SPRAS + "')";
			that.oDataModel.create("/TradeVehicleDesc", oEntry2, null, function (s) {

			}, function () {

			});
			that.oDataModel.create("/TradeVehicleDesc", oEntry1, null, function (s) {

			}, function () {

			});

		},
		VehicleDesc_delete: function (vin) {
			//===============================================
			//====<< remove The Desc >>=======================
			//===========================================
			var that = this;
			var Trade_Id = tradeId_no;
			var Spars = this.getView().byId("SimpleFormUpdateTrReq").getModel().oData.SPRAS;
			if (Spars != "E") {
				Spars = "F";
			} else {
				Spars = "E";
			}

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
				"Method": "DELETE"
			});
			var UpdatedTreadeEntity = "/TradeVehicleDesc(Trade_Id.Trade_Id ='" + Trade_Id + "',VTN.VTN ='" + vin +
				"',SPRAS='" + "F" + "')";
			that.oDataModel.remove(UpdatedTreadeEntity, null, function (s) {

			}, function () {

			});
			var UpdatedTreadeEntity1 = "/TradeVehicleDesc(Trade_Id.Trade_Id ='" + Trade_Id + "',VTN.VTN ='" + vin +
				"',SPRAS='" + "E" + "')";
			that.oDataModel.remove(UpdatedTreadeEntity1, null, function (s) {

			}, function () {

			});

		},
		oUpdateSubmitbtn: function (oEvent) {
			var that = this;
			var oOfferedVehicle = this.getView().byId("otextId").getText();
			var SelectedTeade = this.getView().byId("oTradeinRet").getSelectedKey();
			//================================================================================
			//=====Yes for offered without select Vehicle======================
			//=================================================================
			if (oOfferedVehicle == "YesOffered" && SelectedTeade == "Y") {
				sap.m.MessageBox.warning("Please select Vechicle");
				//================================================================================
				//=====No for offered ======================
				//=================================================================	
			} else if (oOfferedVehicle == "RemoveOffered") {

				var Trade_Id = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Id;

				// var sLocation = window.location.host;
				// var sLocation_conf = sLocation.search("webide");

				// if (sLocation_conf == 0) {
				// 	that.sPrefix = "/VehicleLocator_Xsodata";
				// } else {
				// 	that.sPrefix = "";

				// }
				// //	that.nodeJsUrl = that.sPrefix + "/vehicleTrade";
				// that.nodeJsUrl = that.sPrefix;
				// that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata";

				// that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
				// that.oDataModel.setHeaders({
				// 	"Content-Type": "application/json",
				// 	"X-Requested-With": "XMLHttpRequest",
				// 	"DataServiceVersion": "2.0",
				// 	"Accept": "application/json",
				// 	"Method": "DELETE"
				// });
				// var UpdatedTreadeEntity = "/TradeRequest('" + Trade_Id + "')";
				// that.getView().getModel('TradeRequestModel').remove(UpdatedTreadeEntity, null, null, function (s) {

				// 	},
				// 	function () {

				// 	});
				that.VehicleDelete(Offered_V);

				that.TradeRequestCreate('O', 'S', that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle);

				//  
				//write two functions for trade request and vehicle
				//here left side data only send to backend by taking from simpleform for 'this.getView().byId("").getModel()'
				//================================================================================
				//=====No changes======================
				//=================================================================	
			} else if (oOfferedVehicle == "") {
				var dealer = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Requesting_Dealer;
				this.updatewioutchanges(Offered_V, dealer, 'S');
				//================================================================================
				//=====select Vehicle ======================
				//=================================================================
			} else if (oOfferedVehicle == "FromFourth") {

				var Trade_Id = this.getView().byId("SimpleFormUpdateTrReq").getModel().getData().Trade_Id;

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

				//===<< if there is old offered vehicle >>==========
				if (Offered_V != '') {
					that.VehicleDelete(Offered_V);
					that.VehicleDesc_delete(Offered_V);
				}
				//================<< Update the Trade Req with the new Offered Vehicle >>========
				that.TradeRequestCreate('X', 'S', that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle); //Update Trade Req
				//========================<< Create new Vehicle >>=====================
				that.TradeVehicleCreateFromVehicle_Selection(that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle);

				//  
				//write two functions for trade request and vehicle
				//here left side data only send to backend by taking from simpleform for 'this.getView().byId("").getModel()'

			}
		},
		//===============================================================
		//====Update Witout Changes=====================================
		//==================================================================
		updatewioutchanges: function (vin, dealer, type) {
			var that = this;
			var VTN = vin;
			var dealercode = dealer;
			var vehicle_data;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}
			// ?$filter=kunnr eq '2400042120' and zzvtn eq '002292' and zzseries eq 'SIE'
			var ordertype = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Order_Type;
			if (ordertype == "SO" || ordertype == "DM") {
				this.nodeJsUrl = this.sPrefix + "/node";
				that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_MASTER_SRV";
				var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=zzvtn eq '" + VTN + "' and kunnr eq '" + dealercode +
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
						if (result.d.results.length > 0) {
							var Data = result.d.results[0];

							/*	Data.MessageType="";
								Data.Calculate="20181126";*/
							if (Data.MessageType != "E") {
								vehicle_data = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().OffredVehicle;
								// var CurrentETAFrom = vehicle_data.zzadddata4;
								// if (CurrentETAFrom != null && CurrentETAFrom != "") {

								// 	CurrentETAFrom = CurrentETAFrom.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1');
								// }
								// var CurrentETATo = vehicle_data.pstsp;

								// if (CurrentETATo != null && CurrentETATo != "") {
								// 	var dateTo = CurrentETATo.split("(")[1];
								// 	if (CurrentETATo.indexOf("+") != -1) {
								// 		/*dateTo = dateTo.split("+")[0];*/
								// 		CurrentETATo = new Date(CurrentETATo.split("(")[1].substring(0, 10) * 1000).toDateString().substring(4, 15);
								// 		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
								// 			pattern: "MM/dd/yyyy"
								// 		});
								// 		CurrentETATo = oDateFormat.format(new Date(CurrentETATo));

								// 	} else {
								// 		dateTo = dateTo;
								// 		var dataTo1 = dateTo.substring(0, dateTo.length - 5);
								// 		var ValidTo = new Date(dataTo1 * 1000);
								// 		ValidTo = ValidTo.toGMTString().substring(4, 16);
								// 		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
								// 			pattern: "MM/dd/yyyy"
								// 		});
								// 		CurrentETATo = oDateFormat.format(new Date(ValidTo));
								// 	}

								// }

								// var date1 = new Date(CurrentETAFrom);
								// var date2 = new Date(CurrentETATo);
								// var timeDiff = Math.abs(date2.getTime() - date1.getTime());
								// var CurrentEtadiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

								// function addDays(date, days) {
								// 	var result = new Date(date);
								// 	result.setDate(result.getDate() + days);
								// 	return result;
								// }
								// var Eta = Data.Calculate;
								// var Calculate = Eta.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1');
								// var Proposed_ETA_To = addDays(Calculate, CurrentEtadiff);
								// vehicle_data.Proposed_ETA_To = Proposed_ETA_To;
								// vehicle_data.Proposed_ETA_From = Data.Calculate;
								// vehicle_data.Off_Current_ETA_From
								vehicle_data.Offered_Vtn = Data.zzvtn;
								vehicle_data.Model_Year = Data.zzmoyr;
								vehicle_data.zzintcol = Data.zzintcol;
								vehicle_data.zzextcol = Data.zzextcol;
								vehicle_data.dnc_ind = Data.dnc_ind;
								vehicle_data.Series_Desc = Data.zzseries_desc_en;
								vehicle_data.zzseries_desc_fr = Data.zzseries_desc_fr;
								vehicle_data.zzseries_desc_en = Data.zzseries_desc_en;
								vehicle_data.Series = Data.zzseries;
								vehicle_data.Model = Data.matnr;
								vehicle_data.Model_Desc = Data.model_desc_en;
								vehicle_data.Suffix = Data.zzsuffix;
								vehicle_data.Suffix_Desc = Data.suffix_desc_en;
								vehicle_data.Int_Colour_Desc = Data.mrktg_int_desc_en;
								vehicle_data.APX = Data.zzapx;
								vehicle_data.Ext_Colour_Desc = Data.mktg_desc_en;
								vehicle_data.mktg_desc_en = Data.mktg_desc_en;
								vehicle_data.mktg_desc_fr = Data.mktg_desc_fr;
								vehicle_data.model_desc_en = Data.model_desc_en;
								vehicle_data.model_desc_fr = Data.model_desc_fr;
								vehicle_data.mrktg_int_desc_en = Data.mrktg_int_desc_en;
								vehicle_data.mrktg_int_desc_fr = Data.mrktg_int_desc_fr;
								vehicle_data.suffix_desc_en = Data.suffix_desc_en;
								vehicle_data.suffix_desc_fr = Data.suffix_desc_fr;

								vehicle_data.Status = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Status;
								vehicle_data.Order_Type = Data.zzordertype;
								//	var Req_Current_ETA_From=Number(vehicle_data.pstsp);

								// vehicle_data.Off_Current_ETA_From = Data.pstsp;

								// var dateString = Data.zzadddata4;
								// var year = dateString.substring(0, 4);
								// var month = dateString.substring(4, 6);
								// var day = dateString.substring(6, 8);

								// var Req_Current_ETA_To = new Date(year, month - 1, day);
								// Req_Current_ETA_To = new Date(Req_Current_ETA_To);
								// Req_Current_ETA_To = Date.parse(Req_Current_ETA_To);

								// vehicle_data.Off_Current_ETA_To = "/Date(" + Req_Current_ETA_To + ")/";
								// //	var Proposed_ETA_From=Number(vehicle_data.Proposed_ETA_From);
								// var dateString = vehicle_data.Proposed_ETA_From;
								// var year = dateString.substring(0, 4);
								// var month = dateString.substring(4, 6);
								// var day = dateString.substring(6, 8);

								// var Proposed_ETA_From = new Date(year, month - 1, day);
								// Proposed_ETA_From = new Date(Proposed_ETA_From);
								// Proposed_ETA_From = Date.parse(Proposed_ETA_From);

								// vehicle_data.Off_Proposed_ETA_From = "/Date(" + Proposed_ETA_From + ")/";
								// var Req_Proposed_ETA_To = Number(vehicle_data.Proposed_ETA_To);
								// Req_Proposed_ETA_To = new Date(Req_Proposed_ETA_To);
								// Req_Proposed_ETA_To = Date.parse(Req_Proposed_ETA_To);

								// vehicle_data.Off_Proposed_ETA_To = "/Date(" + Req_Proposed_ETA_To + ")/";

								//====================================<< Delete the old data for Vehicle >>=======================================
								that.VehicleDelete(VTN);
								that.VehicleDesc_delete(VTN);
								//================<< Update the Trade Req with the new Offered Vehicle >>========
								that.TradeRequestCreate('X', type, vehicle_data); //Update Trade Req
								//========================<< Create new Vehicle with the new data after refresh >>=====================
								that.TradeVehicleCreateFromVehicle_Selection(vehicle_data);

							}
						} else {
							that.TradeRequestCreate('X', 'S', that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle);
						}
					},
					error: function () {}

				});
			} else {
				that.TradeRequestCreate('X', 'S', that.getView().byId("SimpleFormUpdateTrReq").getModel().getData().OffredVehicle);
			}

		}

	});
});