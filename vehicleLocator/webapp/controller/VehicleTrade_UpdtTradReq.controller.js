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
				"Accept": "applicat