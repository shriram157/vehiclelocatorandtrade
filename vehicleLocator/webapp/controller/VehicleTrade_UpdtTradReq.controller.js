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
					} 
					else {
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
			if (SelTrdReturn == "Y" &&tradeStatus=="Y") {
					this.onRouteMatched();
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
			
			} else if (SelTrdReturn == "N" &&tradeStatus=="Y") {	
				this.getView().byId("oSelectBtn").setEnabled(false);
				this.getView().byId("offfveh").setText("");
				this.getView().byId("vehtnum").setVisible(false);
				this.getView().byId("ovtnId").setVisible(false);
				 this.getView().byId("ovtnId").setText("");
				this.getView().byId("mdlyr").setVisible(false);
				this.getView().byId("mdlyrtext").setVisible(false);
			    /*	this.getView().byId("mdlyrtext").setText("");*/
				this.getView().byId("seris").setVisible(false);
				this.getView().byId("serisTex").setVisible(false);
				this.getView().byId("serisTex").setText("");
				this.getView().byId("modl").setVisible(false);
				this.getView().byId("mdlde").setVisible(false);
				 	this.getView().byId("mdlde").setText("");
				this.getView().byId("suffx").setVisible(false);
				this.getView().byId("suffxidt").setVisible(false);
				 	this.getView().byId("suffxidt").setText("");
				this.getView().byId("apxid").setVisible(false);
				this.getView().byId("apxTid").setVisible(false);
				  /* this.getView().byId("apxTid").setText("");*/
				this.getView().byId("extco").setVisible(false);
				this.getView().byId("extclod").setVisible(false);
				    this.getView().byId("extclod").setText("");
				this.getView().byId("sttid").setVisible(false);
				this.getView().byId("stdId").setVisible(false);
				   	this.getView().byId("stdId").setText("");
				this.getView().byId("ordtyp").setVisible(false);
				this.getView().byId("ortype").setVisible(false);
				   	this.getView().byId("ortype").setText("");
				this.getView().byId("cetalabid").setVisible(false);
				this.getView().byId("ctetid").setVisible(false);
				   	this.getView().byId("ctetid").setText("");
				this.getView().byId("frmid").setVisible(false);
				this.getView().byId("emptyids").setVisible(false);
				this.getView().byId("txtlab").setVisible(false);
				     	this.getView().byId("txtlab").setText("");
				this.getView().byId("tolbid").setVisible(false);
				this.getView().byId("totid").setVisible(false);
				this.getView().byId("prlabid").setVisible(false);
				this.getView().byId("prpetid").setVisible(false);
				 	this.getView().byId("prpetid").setText("");
				this.getView().byId("idlbltxt").setVisible(false);
				this.getView().byId("fmlabid").setVisible(false);
				this.getView().byId("fromlabid").setVisible(false);
				this.getView().byId("otxtlabel").setVisible(false);
				 	this.getView().byId("otxtlabel").setText("");}
else if (SelTrdReturn == "N" &&tradeStatus=="N") {
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

			
}
else if (SelTrdReturn == "Y" &&tradeStatus=="N") {
	
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
					var TradeId =sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Trade_Id;

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
		}

	});
});