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
			
			this.getRouter().getRoute("VehcTrad_Apprv_Rej_CounTrad").attachPatternMatched(this.onRouteMatched, this);	
		/*	this.getRouter().attachRouteMatched(this.onRouteMatched, this);*/
		},
		onRouteMatched: function (oEvent) {
			debugger
			var that = this;
			that.oSelectedItems = oEvent.getParameter("arguments").selectedmyTr;

			/* SelectedPath	*/
			if (that.oSelectedItems != undefined &&that.oSelectedItems!="SelectedFromTradeHistory") {
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
					/*	if (Dnc == "Y" || Dnc == "X") {
							this.getView().byId("VT_ARCDnc").setVisible(true);
							var newItem = new sap.ui.core.Item({
								key: "0",
								text: "0"
							});
							this.getView().byId("VT_ARCDnc").insertItem(newItem);
							this.getView().byId("VT_ARCDnc").setSelectedKey("0");
							this.getView().byId("VT_ARCDnc").setSelectedItem("0");

						
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
						}*/

					this.getView().byId("SimpleFormAproveTrReq").bindElement("/");

					this.getView().byId("SimpleForrmDisa220").setModel(sap.ui.getCore().getModel("MyTradeRequestSelected"));
					this.getView().byId("SimpleForrmDisa220").bindElement("/");

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
					/*	if (Dnc == "Y" || Dnc == "X") {
							this.getView().byId("VT_ARCDnc").setVisible(true);
							var newItem = new sap.ui.core.Item({
								key: "0",
								text: "0"
							});
							this.getView().byId("VT_ARCDnc").insertItem(newItem);
							this.getView().byId("VT_ARCDnc").setSelectedKey("0");
							this.getView().byId("VT_ARCDnc").setSelectedItem("0");

						
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
						}*/

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
			else if (that.oSelectedItems != undefined &&that.oSelectedItems=="SelectedFromTradeHistory") {
					this.getView().byId("SimpleFormAproveTrReq").setModel(sap.ui.getCore().getModel("TradeRequestedHistory"));
				var 	StatusData=sap.ui.getCore().getModel("TradeRequestedHistory").getData();
						var Status = [];
					Status.push(StatusData);
					var oStatusModel = new sap.ui.model.json.JSONModel(Status);
						var Dnc = StatusData.DNC;
						if (Dnc == "Y" || Dnc == "X") {
							this.getView().byId("VT_ARCDnc").setVisible(true);
								this.getView().byId("VT_ARCDnc").setEnabled(false);
							var newItem = new sap.ui.core.Item({
								key: "0",
								text: "0"
							});
							this.getView().byId("VT_ARCDnc").insertItem(newItem);
							this.getView().byId("VT_ARCDnc").setSelectedKey("0");
							this.getView().byId("VT_ARCDnc").setSelectedItem("0");

						
						} else if (Dnc == "N" || Dnc == "" || Dnc == null) {
							this.getView().byId("VT_ARCDnc").setVisible(false);
								this.getView().byId("VT_ARCDnc").setEnabled(false);
							var newItem = new sap.ui.core.Item({
								key: "",
								text: ""
							});
							this.getView().byId("VT_ARCDnc").insertItem(newItem);
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
					this.getView().byId("VT_ARCDnc").setModel(oStatusModel);
					this.getView().byId("SimpleFormAproveTrReq").bindElement("/");
						this.getView().byId("SimpleForrmDisa220").setModel(sap.ui.getCore().getModel("TradeRequestedHistory"));
					this.getView().byId("SimpleForrmDisa220").bindElement("/");
				//	var StatusData = sap.ui.getCore().getModel("MyTradeRequested").getData();
				
				
				var Tradeid = sap.ui.getCore().getModel("TradeRequestedHistory").getData().Trade_Id;
					this.Tradeid = Tradeid;
					var Add_CommentStatus = sap.ui.getCore().getModel("TradeRequestedHistory").getData().Trade_Status;
						this.getView().byId("oAddbutton").setEnabled(false);
							this.getView().byId("oacceptbtn").setVisible(false);
								this.getView().byId("oRejectbtn").setVisible(false);
									this.getView().byId("oCounterofrbtn").setVisible(false);
										this.getView().byId("oCancelbtn").setVisible(false);
											this.getView().byId("oUpdatebtn").setVisible(false);
											 	this.getView().byId("oBackbtnid").setEnabled(true);
											 	this.getView().byId("oBackbtnid").setVisible(true);
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
					this.nodeJsUrl = this.sPrefix + "/vehicleTrade";
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
				/*	var oCreatedby = this.getView().byId("SimpleFormAproveTrReq").getModel().getData().Created_By;*/
					var Created_By = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');

						function truncateString(str, num) {
							if (num > str.length) {
								return str;
							} else {
								str = str.substring(0, num);
								return str + "...";
							}

						}

						Created_By = truncateString(Created_By, 9);
					
					
					
					
					
					
					

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
			sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").setProperty("/SelectedTradeComment", CommentTableData);
			this.getRouter().navTo("VehicleTrade_UpdtTradReq");

		},
		oAccept: function () {
			debugger;

			var that = this;
			var OwningDealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
			var RequestingDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
			var RequstedDealer= this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer
			/*var oVehTrano = this.getView().byId("ovtnId").getText();*/     
	    	var oVehTrano = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.VTN;
	    	var oWningVTN = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Offered_Vtn;
			/*var oModelyear = this.getView().byId("oMdlyear").getText();*/   
	    	var oModelyear =	this.getView().byId("SimpleFormAproveTrReq").getModel().Model_Year;
	    	var oWnModelyear =  this.getView().byId("SimpleFormAproveTrReq").getModel().Model_Year;
			var oSuffixcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Suffix;
			var oWnSuffixcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Suffix;
			var oModelcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Model;
			var oWnModelcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Model;
			/*	var oIntcolorcode = this.getView().byId("intdesr").gettext();*/
			var oExtcolorcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Ext_Colour;
			var oWnoExtcolorcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Ext_Colour;
		/*	var oApx = this.getView().byId("oapx").getText();*/
		    var oApx =  this.getView().byId("SimpleFormAproveTrReq").getModel().oData.APX;
		     var oWnoApx =  this.getView().byId("SimpleFormAproveTrReq").getModel().oData.APX;
			var oIntcolorcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Int_Colour;
			var oWnoIntcolorcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Int_Colour;
			

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

			/*var AcceptUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'" + McCmbo + "' and zzextcol eq '" + this.SelectedExteriorColorCode +
				"' and zzsuffix eq '" + SuffCmbo + "' and zzmoyr eq '" + MoyearCombo +
				"'";*/
			//https://TCID1GWAPP1.tci.internal.toyota.ca:44300/sap/opu/odata/sap/Z_DEALER_TRADE_REQUEST_SRV/ApproveTradeReqSet?$filter=VehiclesOwningDelear eq '2400042176' and Suffixcode eq 'ML' and Modelyear eq '2018' and Modelcode eq 'YZ3DCT' and Interiorcolorcode eq 'LC14' and Exteriorcolorcode eq '01D6' and APX eq '0' and VTN eq '7'&$format=json
		 oVehTrano="000828";
		oWningVTN="000826";
		/*	var AcceptUrl = that.oDataUrl + "/ApproveTradeReqSet?$filter=VehiclesOwningDelear eq'" + oRequestedDealer + "' and Suffixcode eq '" +
				oSuffixcode +
				"' and Modelyear eq '" + oModelyear + "' and Modelcode eq '" + oModelcode + "' and Interiorcolorcode eq '" + oIntcolorcode +
				"' and Exteriorcolorcode eq '" + oExtcolorcode + "' and APX eq '" + oApx + "' and VTN eq '" + oVehTrano + "'" + "&$format=json";

*/
   /* var AcceptUrl =  that.oDataUrl+"/ApproveTradeReqSet?$filter=RequestingDel eq '2400042193' and (VehiclesOwningDelear eq '2400042193'  or VehiclesOwningDelear eq '2400042176' ) and (Suffixcode eq 'ML' or Suffixcode eq 'ML' ) and (Modelyear eq '2018' or Modelyear eq '2018')  and (Modelcode eq 'YZ3DCT' or Modelcode eq 'YZ3DCT' ) and ( Interiorcolorcode eq 'LC14' or Interiorcolorcode eq 'LC14') and  ( Exteriorcolorcode eq '01D6' or Exteriorcolorcode eq '01D6' ) and ( APX eq '00' or APX eq '00' ) and  ( VTN eq '000828' or  VTN eq '000826')&$format=json";*/
    var AcceptUrl =  that.oDataUrl+"/ApproveTradeReqSet?$filter=RequestingDel eq '"+RequestingDealer+"' and (VehiclesOwningDelear eq '"+RequestingDealer+"'or VehiclesOwningDelear eq '"+RequstedDealer+"' ) and (Suffixcode eq '"+oSuffixcode+"' or Suffixcode eq '"+oWnSuffixcode+"' )and (Modelyear eq '"+oModelyear+"' or Modelyear eq '"+oWnModelyear +"')  and (Modelcode eq '"+oModelcode+"' or Modelcode eq '"+oWnModelcode+"' )and ( Interiorcolorcode eq '"+oIntcolorcode+"' or Interiorcolorcode eq '"+oWnoIntcolorcode+"') and ( Exteriorcolorcode eq '"+oExtcolorcode+"' or Exteriorcolorcode eq '"+oWnoExtcolorcode+"' ) and ( APX eq '"+oApx+"' or APX eq '"+oWnoApx+"' ) and  ( VTN eq '"+oVehTrano+"' or VTN eq '"+oWningVTN+"')&$format=json";
	

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
						var Message=odata.d.results[0].Message.trim();
						sap.m.MessageBox.error(Message);
							that.AcceptFailedComment(Message);
						that.AcceptFailed();
					
						sap.m.MessageBox.error(Message);
					} else if (a == "S") {
						var Message=odata.d.results[0].Message.trim();
						sap.m.MessageBox.success(Message);
						that.AcceptSuccess();
					}

				},
				error: function () {
					alert("Error");
				}
			});

		},
		AcceptFailedComment:function(Message){
			
			/*var Comment = this.getView().byId("oComments").getValue();
			if (Comment == "") {
				sap.m.MessageBox.error("Please enter comment");
			} else {
*/
var Comment = Message;
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
					var TradeId =this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Id;

					var that = this;

					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd'T'HH:mm:ss"
					});
					var oCommentdate = oDateFormat.format(new Date());
				/*	var oCreatedby = this.getView().byId("SimpleFormAproveTrReq").getModel().getData().Created_By;*/
					var Created_By = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');

						function truncateString(str, num) {
							if (num > str.length) {
								return str;
							} else {
								str = str.substring(0, num);
								return str + "...";
							}

						}

						Created_By = truncateString(Created_By, 9);
					
					
					
					
					
					
					

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
		
			
			
			
		},
		AcceptSuccess:function(){
			
		
			var that = this;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var Trade_Id = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Id;
			var Trade_Status = "A";
			var Requesting_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer;
			var Requesting_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer_Name;
			var Requested_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn;
			var Offered_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Offered_Vtn;
			var Trade_Return = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Return;
			var Req_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_From;
			var Req_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_To;
			var Req_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_From;
			var Req_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_To;
			var Off_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_From;
			var Off_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_To;
			var Off_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_From;
			var Off_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_To;
		/*	var Created_By = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_By;*/
			var Created_By = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');

						function truncateString(str, num) {
							if (num > str.length) {
								return str;
							} else {
								str = str.substring(0, num);
								return str + "...";
							}

						}

						Created_By = truncateString(Created_By, 9);
			
			
			
			var Created_On = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_On;
			var Changed_on = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;
			var Requested_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
			var Requested_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer_Name;

			var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
			//	 var Created_On = oDateFormat.format(new Date(ValidTo));
		/*	var Trade_Status = "R";*/
			//	}
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
			var UpdatedTreadeEntity = "/TradeRequest('" + Trade_Id + "')";
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, null, function (s) {
			

			
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
				alert("fail");
			});

		
			
			
		},
		AcceptFailed:function(){
			
		
			var that = this;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var Trade_Id = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Id;
			var Trade_Status = "F";
			var Requesting_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer;
			var Requesting_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer_Name;
			var Requested_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn;
			var Offered_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Offered_Vtn;
			var Trade_Return = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Return;
			var Req_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_From;
			var Req_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_To;
			var Req_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_From;
			var Req_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_To;
			var Off_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_From;
			var Off_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_To;
			var Off_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_From;
			var Off_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_To;
		/*	var Created_By = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_By;*/
			var Created_By = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');

						function truncateString(str, num) {
							if (num > str.length) {
								return str;
							} else {
								str = str.substring(0, num);
								return str + "...";
							}

						}

						Created_By = truncateString(Created_By, 9);
			
			
			
			var Created_On = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_On;
			var Changed_on = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;
			var Requested_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
			var Requested_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer_Name;

			var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
			//	 var Created_On = oDateFormat.format(new Date(ValidTo));
		/*	var Trade_Status = "R";*/
			//	}
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
			var UpdatedTreadeEntity = "/TradeRequest('" + Trade_Id + "')";
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, null, function (s) {
			

			
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
				alert("fail");
			});

		
			
			
		},
		onReject: function () {
		
			var that = this;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var Trade_Id = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Id;
			var Trade_Status = "R";
			var Requesting_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer;
			var Requesting_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer_Name;
			var Requested_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn;
			var Offered_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Offered_Vtn;
			var Trade_Return = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Return;
			var Req_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_From;
			var Req_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_To;
			var Req_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_From;
			var Req_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_To;
			var Off_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_From;
			var Off_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_To;
			var Off_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_From;
			var Off_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_To;
		/*	var Created_By = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_By;*/
			var Created_By = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');

						function truncateString(str, num) {
							if (num > str.length) {
								return str;
							} else {
								str = str.substring(0, num);
								return str + "...";
							}

						}

						Created_By = truncateString(Created_By, 9);
			
			
			
			var Created_On = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_On;
			var Changed_on = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;
			var Requested_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
			var Requested_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer_Name;

			var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
			//	 var Created_On = oDateFormat.format(new Date(ValidTo));
		/*	var Trade_Status = "R";*/
			//	}
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
			var UpdatedTreadeEntity = "/TradeRequest('" + Trade_Id + "')";
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, null, function (s) {
				debugger

			if(dncBlockedDays!=0&&dncBlockedDays!=""){
			that.DNCBlockoutDays();	
			}
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
				alert("fail");
			});

		},
		DNCBlockoutDays: function () {
			
			var that=this;
		/*	var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
		
			pattern: "yyyyMMddTHHmmss"
			});*/
				/*	pattern: "yyyyMMdd'T'HHmmss"*/
			
				var oDateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "ddMMyyyy"
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
												    if(property[0] === "-") {
												        sortOrder = -1;
												        property = property.substr(1);
												    }
												    return function (a,b) {
												        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
												        return result * sortOrder;
												    };
												}
											   
											   ModelBlockSeturl.sort(dynamicSort("ZzblockId"));
											   if(ModelBlockSeturl.length!=0){
											   	var ZzblockId=ModelBlockSeturl[ModelBlockSeturl.length-1].ZzblockId;
											   	
											   	var incrementvalue = (+ZzblockId) + 1;

						// insert leading zeroes with a negative slice
					 that.ZzblockId = incrementvalue = ("0000000" + incrementvalue).slice(-8);
											   	
											   	
											   }
											   else{
											   	that.ZzblockId="00000001";
											   }
					that.BlocIdSuccess(that.ZzblockId);
				},
				error:function()
				{
					
					
				}
			});
},
BlocIdSuccess:function(ZzblockId){
	var that=this;
			var oBlockId = ZzblockId;
			var BlockingDealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
			var BlockedDealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer;
			var oModelRequested = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Model;
			var oSeries = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Series;
		
			var oCommentData = this.getView().byId("tableVrade").getModel().oData;


			var oComment = [];
			for (var i = 0; i < oCommentData.length; i++) {
				oComment.push(oCommentData[i].Comment_Txt);
			}
			if(oComment.length!=0){
			var oComment = oComment.join(".");
			}
			else{
				var oComment = "testing";
			}
			
			
			var BlockStartdate="\/Date(1543449600000)\/";
			var Blockenddate="\/Date(1543536000000)\/";
				var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
		/*	var BlockStartdate = oDateFormat1.format(new Date());
				var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
			var someDate = new Date();
			var numberOfDaysToAdd = Number(dncBlockedDays);
			var Blockenddate = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

			Blockenddate = oDateFormat1.format(new Date(Blockenddate));*/
		/*	var Createdby = sap.ui.getCore().LoginDetails.Username;*/
			var Createdby = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');

						function truncateString(str, num) {
							if (num > str.length) {
								return str;
							} else {
								str = str.substring(0, num);
								return str + "...";
							}

						}

						Createdby = truncateString(Createdby, 9);
		
		/*	var Createdon = oDateFormat.format(new Date());*/
            var Createdon ="";
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
				alert("ok");
			}, function () {

			});
			

			

		},

onCounterTrade:function()

{
	

	var that = this;

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
			var Req_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_To;
			var Req_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_From;
			var Req_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_To;
			var Off_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_From;
			var Off_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_To;
			var Off_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_From;
			var Off_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_To;
		/*	var Created_By = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_By;*/
			var Created_By = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');

						function truncateString(str, num) {
							if (num > str.length) {
								return str;
							} else {
								str = str.substring(0, num);
								return str + "...";
							}

						}

						Created_By = truncateString(Created_By, 9);
			var Created_On = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_On;
			var Changed_on = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;
			var Requested_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
			var Requested_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer_Name;

			var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
			//	 var Created_On = oDateFormat.format(new Date(ValidTo));
		
			//	}
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
			var UpdatedTreadeEntity = "/TradeRequest('" + Trade_Id + "')";
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, null, function (s) {
				debugger

		/*	if(dncBlockedDays!=0&&dncBlockedDays!=""){
			that.DNCBlockoutDays();	
			}*/
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
				alert("fail");
			});

		},
		onCancel:function()
		{
			var that = this;

			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var Trade_Id = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Id;
			var Trade_Status = "X";
			var Requesting_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer;
			var Requesting_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer_Name;
			var Requested_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn;
			var Offered_Vtn = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Offered_Vtn;
			var Trade_Return = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Return;
			var Req_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_From;
			var Req_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Current_ETA_To;
			var Req_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_From;
			var Req_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Req_Proposed_ETA_To;
			var Off_Current_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_From;
			var Off_Current_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Current_ETA_To;
			var Off_Proposed_ETA_From = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_From;
			var Off_Proposed_ETA_To = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Off_Proposed_ETA_To;
		/*	var Created_By = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_By;*/
			var Created_By = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');

						function truncateString(str, num) {
							if (num > str.length) {
								return str;
							} else {
								str = str.substring(0, num);
								return str + "...";
							}

						}

						Created_By = truncateString(Created_By, 9);
			var Created_On = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_On;
			var Changed_on = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;
			var Requested_Dealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
			var Requested_Dealer_Name = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer_Name;

			var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
			//	 var Created_On = oDateFormat.format(new Date(ValidTo));
		
			//	}
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
			var UpdatedTreadeEntity = "/TradeRequest('" + Trade_Id + "')";
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, null, function (s) {
				debugger

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
				alert("fail");
			});

		},	
			
		

		oBack: function () {
	var oPage = this.getView().byId("App_Apprvpage");     //Get Hold of page
        	oPage.scrollTo(0,0); 
			this.getRouter().navTo("VehicleTrade_History");  
			  

		}

	});
});