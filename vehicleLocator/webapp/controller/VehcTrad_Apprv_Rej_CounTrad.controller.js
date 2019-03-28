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
	var oController;
	return BaseController.extend("vehicleLocator.controller.VehcTrad_Apprv_Rej_CounTrad", {
		onInit: function () {
			var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
			var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
		    this.getView().byId("oDealerCode5").setText(LoggedInDealerCode2);                                
			this.getView().byId("oDealerAprvRejCntoffr").setText(LoggedInDealer);
			var _that = this;
			oController = this;
			
					/// set the logo and Language. 

				this._setTheLanguage();

				this._setTheLogo();	
			
			this.getRouter().getRoute("VehcTrad_Apprv_Rej_CounTrad").attachPatternMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function (oEvent) {
			
			    this.getView().byId("oComments").setValue(""); //1803
				 
		
				if(oEvent.getParameter("arguments").selectedmyTr!=undefined){
			this.oSelectedItems = oEvent.getParameter("arguments").selectedmyTr;
			}
// on screen refresh disable the buttons. 
        if (sap.ui.getCore().getModel("MyTradeRequestSelected") == undefined && 
                      sap.ui.getCore().getModel("MyTradeRequested") == undefined){
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
			// local =this;
		
			// local.oViewModel = new sap.ui.model.json.JSONModel({
   //             busy: false,
   //             delay: 0,
   //             additionalComments: ""
   //         });
   //         local.getView().setModel(local.oViewModel, "LocalTradeModel");

			/* SelectedPath	*/
			if (that.oSelectedItems != undefined && that.oSelectedItems != "SelectedFromTradeHistory") {
				if (sap.ui.getCore().getModel("MyTradeRequestSelected") != undefined) {
					//		this.getView().byId("SimpleFormAproveTrReq").setModel(sap.ui.getCore().getModel("MyTradeRequestSelected"));
					var StatusData = sap.ui.getCore().getModel("MyTradeRequestSelected").getData();
					var AcceptVisible = StatusData.FromRequesting;
					var Status = StatusData.Trade_Status;
					this.dnsStatus = StatusData.Trade_Status;
					var TradeId = StatusData.Trade_Id;
					this.VehicleTrade_SummaryData(StatusData);

				
					if (AcceptVisible == false && (Status == "S")) {
						this.getView().byId("oacceptbtn").setVisible(!AcceptVisible);
						this.getView().byId("oRejectbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCounterofrbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCancelbtn").setVisible(AcceptVisible);
						this.getView().byId("oUpdatebtn").setVisible(AcceptVisible);
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
						
						
						this.getView().byId("oComments").setEnabled(AcceptVisible);  //GSR  
						this.getView().byId("oAddbutton").setEnabled(AcceptVisible); //GSR
					}

					var Status = [];
					Status.push(StatusData);
					var oStatusModel = new sap.ui.model.json.JSONModel(Status);
					/*	this.getView().byId("VT_ARCTtrdinStatus").setModel(oStatusModel);*/
					this.getView().byId("VT_ARCTtrdinRet").setModel(oStatusModel);
					/*	this.getView().byId("VT_ARCTDnc").setModel(oStatusModel);*/
					this.getView().byId("VT_ARCDnc").setModel(oStatusModel);
					var Dnc = StatusData.DNC;
					if ((Dnc == "Y" || Dnc == "X") && (this.dnsStatus != "R")) {
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
	// https://tci-dev-vehiclelocatorandtrade-xsjs.cfapps.us10.hana.ondemand.com/xsodata/vehicleTrade_SRV.xsodata/TradeComment?$filter=Trade_Id.Trade_Id%20eq%20%27TR000245%27
	// ttps://tci-dev-vehiclelocatorandtrade-xsjs.cfapps.us10.hana.ondemand.com/xsodata/vehicleTrade_SRV.xsodata/TradeComment?$filter=Trade_Id.Trade_Id eq 'TR000245'
					
					this.nodeJsUrl = this.sPrefix;
					that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeComment?$filter=Trade_Id.Trade_Id eq '"+ this.Tradeid +"'";

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
							
					//		that.getView().byId("tableVrade").setModel(oModel);
							

		
				that.getView().setModel(oModel, "commentsModel");				
							
							
							
							
							
						}
					});
				} else if (sap.ui.getCore().getModel("MyTradeRequested") != undefined) {

					//	this.getView().byId("SimpleFormAproveTrReq").setModel(sap.ui.getCore().getModel("MyTradeRequested"));
					var StatusData = sap.ui.getCore().getModel("MyTradeRequested").getData();
					this.VehicleTrade_SummaryData(StatusData);
					var AcceptVisible = StatusData.FromRequesting;
					var Status = StatusData.Trade_Status;
				
				     if ( StatusData.Trade_Return == "N" ) {  
				     	// this.getView().byId("offervehidContent").setVisible(false);
				   	// Offered = {};
					that.getView().byId("Offerevehid").setText("");
					that.getView().byId("offeredDealer").setVisible(false);
					that.getView().byId("oRequesteddealer").setText("");
					that.getView().byId("oRequesteddealer").setVisible(false);

					that.getView().byId("ofrModellabl").setVisible(false);
					that.getView().byId("ofrmodelyeartext").setText("");
					that.getView().byId("ofrmodelyeartext").setVisible(false);

					that.getView().byId("ofrserieslabl").setVisible(false);
					that.getView().byId("ofrseriestxt").setText("");
					that.getView().byId("ofrseriestxt").setVisible(false);

					that.getView().byId("ofrmodllabl").setVisible(false);
					that.getView().byId("ofrmodltxt").setText("");
					that.getView().byId("ofrmodltxt").setVisible(false);

					that.getView().byId("ofrsuffixlabl").setVisible(false);
					that.getView().byId("ofrsuffixstxt").setText("");
					that.getView().byId("ofrsuffixstxt").setVisible(false);

					that.getView().byId("ofrapxlabl").setVisible(false);
					that.getView().byId("ofrapxtxt").setText("");
					that.getView().byId("ofrapxtxt").setVisible(false);

					that.getView().byId("ofrextcolorlabl").setVisible(false);
					that.getView().byId("ofrexttxt").setText("");
					that.getView().byId("ofrexttxt").setVisible(false);

					that.getView().byId("ofrstatuslabl").setVisible(false);
					that.getView().byId("ofrstatustxt").setText("");
					that.getView().byId("ofrstatustxt").setVisible(false);

					that.getView().byId("ofrordrtypelabl").setVisible(false);
					that.getView().byId("ofrordtypetxt").setText("");
					that.getView().byId("ofrordtypetxt").setVisible(false);

					that.getView().byId("cetalaid").setVisible(false);
					that.getView().byId("ctqtid").setText("");
					that.getView().byId("ctqtid").setVisible(false);

					that.getView().byId("fromqid").setVisible(false);
					that.getView().byId("txlab").setText("");
					that.getView().byId("txlab").setVisible(false);
					
					that.getView().byId("prolabid").setVisible(false);	
					

					that.getView().byId("tobid").setVisible(false);
					that.getView().byId("prptid").setText("");
					that.getView().byId("prptid").setVisible(false);

					that.getView().byId("fmlbid").setVisible(false);
				/*	that.getView().byId("fromlbid").setVisible(false);*/
					that.getView().byId("otxlabel").setText("");
					that.getView().byId("otxlabel").setVisible(false);

					that.getView().byId("idlto").setVisible(false);

				     } else if(StatusData.Trade_Return == "Y" ) {
 
                
                    that.getView().byId("offeredDealer").setVisible(true);
                
                    that.getView().byId("oRequesteddealer").setVisible(true);

                    that.getView().byId("ofrModellabl").setVisible(true);
                
                    that.getView().byId("ofrmodelyeartext").setVisible(true);

                    that.getView().byId("ofrserieslabl").setVisible(true);
                
                    that.getView().byId("ofrseriestxt").setVisible(true);

                    that.getView().byId("ofrmodllabl").setVisible(true);
                    
                    that.getView().byId("ofrmodltxt").setVisible(true);

                    that.getView().byId("ofrsuffixlabl").setVisible(true);
                
                    that.getView().byId("ofrsuffixstxt").setVisible(true);

                    that.getView().byId("ofrapxlabl").setVisible(true);
                    
                    that.getView().byId("ofrapxtxt").setVisible(true);

                    that.getView().byId("ofrextcolorlabl").setVisible(true);
                
                    that.getView().byId("ofrexttxt").setVisible(true);

                    that.getView().byId("ofrstatuslabl").setVisible(true);
                    
                    that.getView().byId("ofrstatustxt").setVisible(true);

                    that.getView().byId("ofrordrtypelabl").setVisible(true);
                    
                    that.getView().byId("ofrordtypetxt").setVisible(true);

                    that.getView().byId("cetalaid").setVisible(true);
                
                    that.getView().byId("ctqtid").setVisible(true);

                    that.getView().byId("fromqid").setVisible(true);
                
                    that.getView().byId("txlab").setVisible(true);
                    
                    that.getView().byId("prolabid").setVisible(true);    
                    

                    that.getView().byId("tobid").setVisible(true);
                
                    that.getView().byId("prptid").setVisible(true);

                    that.getView().byId("fmlbid").setVisible(true);
                
                
                    that.getView().byId("otxlabel").setVisible(true);

                    that.getView().byId("idlto").setVisible(true);
 
				     	
				     }

				
				
					if (AcceptVisible == true && (Status == "S" || Status == "C")) {
						this.getView().byId("oacceptbtn").setVisible(!AcceptVisible);
						this.getView().byId("oRejectbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCounterofrbtn").setVisible(!AcceptVisible);
						this.getView().byId("oCancelbtn").setVisible(AcceptVisible);
						this.getView().byId("oUpdatebtn").setVisible(AcceptVisible);
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
					this.getView().byId("VT_ARCDnc").setModel(oStatusModel);
					//	this.getView().byId("oAddbutton").setModel(oStatusModel);	
					//	this.getView().byId("SimpleFormAproveTrReq").bindElement("/");

					var Dnc = StatusData.DNC;
						if (Dnc == "Y" || Dnc == "X") {
							this.getView().byId("VT_ARCDnc").setVisible(false);
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
					
					
					that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeComment?$filter=Trade_Id.Trade_Id eq '"+ this.Tradeid +"'";		
					
					// that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeComment";
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
							// that.getView().byId("tableVrade").setModel(oModel);
							that.getView().setModel(oModel, "commentsModel");	
						}
					});

				}
			} else if (that.oSelectedItems != undefined && that.oSelectedItems == "SelectedFromTradeHistory") {
				this.getView().byId("SimpleFormAproveTrReq").setModel(sap.ui.getCore().getModel("TradeRequestedHistory"));
				var StatusData = sap.ui.getCore().getModel("TradeRequestedHistory").getData();
				var Status = [];
				Status.push(StatusData);
				
				    if ( StatusData.Trade_Return == "N" ) {  
				     	// this.getView().byId("offervehidContent").setVisible(false);
				   	// Offered = {};
					that.getView().byId("Offerevehid").setText("");
					that.getView().byId("offeredDealer").setVisible(false);
					that.getView().byId("oRequesteddealer").setText("");
					that.getView().byId("oRequesteddealer").setVisible(false);

					that.getView().byId("ofrModellabl").setVisible(false);
					that.getView().byId("ofrmodelyeartext").setText("");
					that.getView().byId("ofrmodelyeartext").setVisible(false);

					that.getView().byId("ofrserieslabl").setVisible(false);
					that.getView().byId("ofrseriestxt").setText("");
					that.getView().byId("ofrseriestxt").setVisible(false);

					that.getView().byId("ofrmodllabl").setVisible(false);
					that.getView().byId("ofrmodltxt").setText("");
					that.getView().byId("ofrmodltxt").setVisible(false);

					that.getView().byId("ofrsuffixlabl").setVisible(false);
					that.getView().byId("ofrsuffixstxt").setText("");
					that.getView().byId("ofrsuffixstxt").setVisible(false);

					that.getView().byId("ofrapxlabl").setVisible(false);
					that.getView().byId("ofrapxtxt").setText("");
					that.getView().byId("ofrapxtxt").setVisible(false);

					that.getView().byId("ofrextcolorlabl").setVisible(false);
					that.getView().byId("ofrexttxt").setText("");
					that.getView().byId("ofrexttxt").setVisible(false);

					that.getView().byId("ofrstatuslabl").setVisible(false);
					that.getView().byId("ofrstatustxt").setText("");
					that.getView().byId("ofrstatustxt").setVisible(false);

					that.getView().byId("ofrordrtypelabl").setVisible(false);
					that.getView().byId("ofrordtypetxt").setText("");
					that.getView().byId("ofrordtypetxt").setVisible(false);

					that.getView().byId("cetalaid").setVisible(false);
					that.getView().byId("ctqtid").setText("");
					that.getView().byId("ctqtid").setVisible(false);

					that.getView().byId("fromqid").setVisible(false);
					that.getView().byId("txlab").setText("");
					that.getView().byId("txlab").setVisible(false);
					
					that.getView().byId("prolabid").setVisible(false);	
					

					that.getView().byId("tobid").setVisible(false);
					that.getView().byId("prptid").setText("");
					that.getView().byId("prptid").setVisible(false);

					that.getView().byId("fmlbid").setVisible(false);
				/*	that.getView().byId("fromlbid").setVisible(false);*/
					that.getView().byId("otxlabel").setText("");
					that.getView().byId("otxlabel").setVisible(false);

					that.getView().byId("idlto").setVisible(false);


				     } else if(StatusData.Trade_Return == "Y" ) {
 
                
                    that.getView().byId("offeredDealer").setVisible(true);
                
                    that.getView().byId("oRequesteddealer").setVisible(true);

                    that.getView().byId("ofrModellabl").setVisible(true);
                
                    that.getView().byId("ofrmodelyeartext").setVisible(true);

                    that.getView().byId("ofrserieslabl").setVisible(true);
                
                    that.getView().byId("ofrseriestxt").setVisible(true);

                    that.getView().byId("ofrmodllabl").setVisible(true);
                    
                    that.getView().byId("ofrmodltxt").setVisible(true);

                    that.getView().byId("ofrsuffixlabl").setVisible(true);
                
                    that.getView().byId("ofrsuffixstxt").setVisible(true);

                    that.getView().byId("ofrapxlabl").setVisible(true);
                    
                    that.getView().byId("ofrapxtxt").setVisible(true);

                    that.getView().byId("ofrextcolorlabl").setVisible(true);
                
                    that.getView().byId("ofrexttxt").setVisible(true);

                    that.getView().byId("ofrstatuslabl").setVisible(true);
                    
                    that.getView().byId("ofrstatustxt").setVisible(true);

                    that.getView().byId("ofrordrtypelabl").setVisible(true);
                    
                    that.getView().byId("ofrordtypetxt").setVisible(true);

                    that.getView().byId("cetalaid").setVisible(true);
                
                    that.getView().byId("ctqtid").setVisible(true);

                    that.getView().byId("fromqid").setVisible(true);
                
                    that.getView().byId("txlab").setVisible(true);
                    
                    that.getView().byId("prolabid").setVisible(true);    
                    

                    that.getView().byId("tobid").setVisible(true);
                
                    that.getView().byId("prptid").setVisible(true);

                    that.getView().byId("fmlbid").setVisible(true);
                
                
                    that.getView().byId("otxlabel").setVisible(true);

                    that.getView().byId("idlto").setVisible(true);
 
				     	
				     }
 
				var oStatusModel = new sap.ui.model.json.JSONModel(Status);
				var Dnc = StatusData.DNC;
				// if (Dnc == "Y" || Dnc == "X") {
					if ((Dnc == "Y" || Dnc == "X") && (this.dnsStatus != "R")) {
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
					that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeComment?$filter=Trade_Id.Trade_Id eq '"+ this.Tradeid +"'";
				// that.oDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeComment";
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
						// that.getView().byId("tableVrade").setModel(oModel);
						that.getView().setModel(oModel, "commentsModel");	
					},
					
					
				error: function(jqXHR, textStatus, errorThrown) {
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
		},
		
		oAddCommentsArea: function () {
			var Comment = this.getView().byId("oComments").getValue();
			if (Comment == "") {
				sap.m.MessageBox.error("Please enter comment");
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
						console.log("TradeId",TradeId);
					var that = this;

					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd'T'HH:mm:ss"
					});
					var oCommentdate = new Date(oDateFormat.format(new Date()));
					 oCommentdate.setDate(oCommentdate.getDate());
					/*	var oCreatedby = this.getView().byId("SimpleFormAproveTrReq").getModel().getData().Created_By;*/
		    var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
			var LoggedinUserLname =  sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
			var Created_By  = LoggedinUserFname+LoggedinUserLname;

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

					that.oDataModel.create("/TradeComment", oTradeComment, null, function (s) 
					{
			/*	var that = this;*/
				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");

				if (sLocation_conf == 0) {
					that.sPrefix = "/VehicleLocator_Xsodata";
				} else {
					that.sPrefix = "";

				}
				that.nodeJsUrl = that.sPrefix;
		that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeComment?$filter=Trade_Id.Trade_Id eq '"+ that.Tradeid +"'";			
				// that.oDataUrl = that.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeComment";
				$.ajax({
					url: that.oDataUrl,
					method: "GET",
					async: false,
					dataType: "json",

					success: function (oData) {

						debugger;
						var Data = oData.d.results;
						
						// console.log("additional Comment", 	local.oViewModel);
						console.log("trade id",TradeId);
						
					var oComTrade_Comment = Data.filter(function (x) {
							return x["Trade_Id.Trade_Id"] == TradeId;
						});
						
					var oModel = new sap.ui.model.json.JSONModel(oComTrade_Comment);
					/*	oModel.updateBindings(true);*/	
					// that.getView().byId("tableVrade").setModel(oModel);
				that.getView().setModel(oModel, "commentsModel");	
					}
				});
						
						
					
						// that.getView().byId("oComments").setValue("");
				/*	var oComModel = new sap.ui.model.json.JSON();*/
					
		
					}, function ()
					{

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
			var CommentTableData = this.getView().byId("tableVrade").getModel("commentsModel");
			sap.ui.getCore().setModel(SimpleFormAproveTrReq, "SelectedSimpleFormAproveTrReq");
			sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").setProperty("/SelectedTradeComment", CommentTableData);
			this.getRouter().navTo("VehicleTrade_UpdtTradReq",{
				SelectedTrade : "VehicleTrade_ApprvTradeVehicle"
			});

		},
		oAccept: function () {
			debugger;

			var that = this;
			
			
			
			
			/*	var OwningDealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;*/

			var RequstedDealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Dealer;
			/*var oVehTrano = this.getView().byId("ovtnId").getText();*/
			var oVehTrano = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.VTN;

			/*var oModelyear = this.getView().byId("oMdlyear").getText();*/
			var oModelyear = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Model_Year;

			var oSuffixcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Suffix;

			var oModelcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Model;

			/*	var oIntcolorcode = this.getView().byId("intdesr").gettext();*/
			var oExtcolorcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Ext_Colour;

			/*	var oApx = this.getView().byId("oapx").getText();*/
			var oApx = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.APX;

			var oIntcolorcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Int_Colour;

			if (sap.ui.getCore().getModel("ApprovRej").getProperty("/OffredVehicle") != {} && Object.keys(sap.ui.getCore().getModel("ApprovRej")
					.getProperty("/OffredVehicle")).length !== 0) {
				var RequestingDealer = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Requesting_Dealer;
				var oWningVTN = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Offered_Vtn;
				var oWnModelyear = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Model_Year;
				var oWnSuffixcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Suffix;
				var oWnModelcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Model;
				var oWnoExtcolorcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Ext_Colour;
				var oWnoApx = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.APX;
				var oWnoIntcolorcode = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.OffredVehicle.Int_Colour;
			} else {
				var RequestingDealer = "";
				var oWningVTN = "";
				var oWnModelyear = "";
				var oWnSuffixcode = "";
				var oWnModelcode = "";
				var oWnoExtcolorcode = "";
				var oWnoApx = "";
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

			/*var AcceptUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'" + McCmbo + "' and zzextcol eq '" + this.SelectedExteriorColorCode +
				"' and zzsuffix eq '" + SuffCmbo + "' and zzmoyr eq '" + MoyearCombo +
				"'";*/
			//https://TCID1GWAPP1.tci.internal.toyota.ca:44300/sap/opu/odata/sap/Z_DEALER_TRADE_REQUEST_SRV/ApproveTradeReqSet?$filter=VehiclesOwningDelear eq '2400042176' and Suffixcode eq 'ML' and Modelyear eq '2018' and Modelcode eq 'YZ3DCT' and Interiorcolorcode eq 'LC14' and Exteriorcolorcode eq '01D6' and APX eq '0' and VTN eq '7'&$format=json
			/*	oVehTrano = "000828";
				oWningVTN = "000826";*/
			/*	var AcceptUrl = that.oDataUrl + "/ApproveTradeReqSet?$filter=VehiclesOwningDelear eq'" + oRequestedDealer + "' and Suffixcode eq '" +
				oSuffixcode +
				"' and Modelyear eq '" + oModelyear + "' and Modelcode eq '" + oModelcode + "' and Interiorcolorcode eq '" + oIntcolorcode +
				"' and Exteriorcolorcode eq '" + oExtcolorcode + "' and APX eq '" + oApx + "' and VTN eq '" + oVehTrano + "'" + "&$format=json";

*/
			/* var AcceptUrl =  that.oDataUrl+"/ApproveTradeReqSet?$filter=RequestingDel eq '2400042193' and (VehiclesOwningDelear eq '2400042193'  or VehiclesOwningDelear eq '2400042176' ) and (Suffixcode eq 'ML' or Suffixcode eq 'ML' ) and (Modelyear eq '2018' or Modelyear eq '2018')  and (Modelcode eq 'YZ3DCT' or Modelcode eq 'YZ3DCT' ) and ( Interiorcolorcode eq 'LC14' or Interiorcolorcode eq 'LC14') and  ( Exteriorcolorcode eq '01D6' or Exteriorcolorcode eq '01D6' ) and ( APX eq '00' or APX eq '00' ) and  ( VTN eq '000828' or  VTN eq '000826')&$format=json";*/
		/*	var AcceptUrl = that.oDataUrl + "/ApproveTradeReqSet?$filter=RequestingDel eq '" + RequestingDealer +
				"' and (VehiclesOwningDelear eq '" + RequestingDealer + "'or VehiclesOwningDelear eq '" + RequstedDealer +
				"' ) and (Suffixcode eq '" + oSuffixcode + "' or Suffixcode eq '" + oWnSuffixcode + "' )and (Modelyear eq '" + oModelyear +
				"' or Modelyear eq '" + oWnModelyear + "')  and (Modelcode eq '" + oModelcode + "' or Modelcode eq '" + oWnModelcode +
				"' )and ( Interiorcolorcode eq '" + oIntcolorcode + "' or Interiorcolorcode eq '" + oWnoIntcolorcode +
				"') and ( Exteriorcolorcode eq '" + oExtcolorcode + "' or Exteriorcolorcode eq '" + oWnoExtcolorcode + "' ) and ( APX eq '" + oApx +
				"' or APX eq '" + oWnoApx + "' ) and  ( VTN eq '" + oVehTrano + "' or VTN eq '" + oWningVTN + "')&$format=json";*/
				
			var AcceptUrl = that.oDataUrl + "/ApproveTradeReqSet?$filter=RequestingDel eq '" + RequstedDealer +
				"' and (VehiclesOwningDelear eq '" + RequstedDealer + "'or VehiclesOwningDelear eq '" + RequestingDealer +
				"' ) and (Suffixcode eq '" + oSuffixcode + "' or Suffixcode eq '" + oWnSuffixcode + "' )and (Modelyear eq '" + oModelyear +
				"' or Modelyear eq '" + oWnModelyear + "')  and (Modelcode eq '" + oModelcode + "' or Modelcode eq '" + oWnModelcode +
				"' )and ( Interiorcolorcode eq '" + oIntcolorcode + "' or Interiorcolorcode eq '" + oWnoIntcolorcode +
				"') and ( Exteriorcolorcode eq '" + oExtcolorcode + "' or Exteriorcolorcode eq '" + oWnoExtcolorcode + "' ) and ( APX eq '" + oApx +
				"' or APX eq '" + oWnoApx + "' ) and  ( VTN eq '" + oVehTrano + "' or VTN eq '" + oWningVTN + "')&$format=json";
	

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

						function fnCallbackMessageBox(oAction) {
							that.getRouter().navTo("VehicleTrade_Summary", {
								DataClicked: "Yes"
							});

						}
						sap.m.MessageBox.information(Message, {

							actions: [sap.m.MessageBox.Action.OK ],
							onClose: fnCallbackMessageBox
						});
						that.AcceptFailedComment(Message);
						that.AcceptFailed();

					//	sap.m.MessageBox.error(Message);
					} else if (a == "S") {
					 
						
						
						var sMessageText = that.getView().getModel("i18n").getResourceBundle().getText("messageTradeAccepted", [that.Tradeid]);
						var Message = sMessageText;
							// var Message =  "Trade " + that.Tradeid + " has been Accepted Succesfully";
							function fnCallbackMessageBox1(oAction) {
						/*	that.getRouter().navTo("VehicleTrade_Summary", {
								DataClicked: "Yes"
							});*/
						
							}
						sap.m.MessageBox.success(Message, {
							actions: [sap.m.MessageBox.Action.OK ],
							onClose: fnCallbackMessageBox1
						});
						debugger;
						that.AcceptSuccess();
					

				}
				},
				error: function () {
				/*	alert("Error");*/
				}
			
			});
			
		},
		AcceptFailedComment: function (Message) {

			/*var Comment = this.getView().byId("oComments").getValue();
			if (Comment == "") {
				sap.m.MessageBox.error("Please enter comment");
			} else {
*/
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
			var LoggedinUserLname =  sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
			var Created_By  = LoggedinUserFname+LoggedinUserLname;

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

					"Trade_Id.Trade_Id": TradeId,
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
				
			//  var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
			// var LoggedinUserLname =  sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
			// var Created_By  = LoggedinUserFname+LoggedinUserLname;
			
			
			

			function truncateString(str, num) {
				if (num > str.length) {
					return str;
				} else {
					str = str.substring(0, num);
					return str;
				}

			}

	Created_By = truncateString(Created_By, 12);

			var Created_On = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Created_On;
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
				"Created_On":Created_On,
				
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
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, {merge:true} , function (s) {
//	that.VehicleTrade_SummaryData();

				that.getView().byId("SimpleFormAproveTrReq").getModel().getData().Trade_Status="A"; 
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
			}, function () {
			
			});

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
		//	Changed_on.setDate(Changed_on.getDate() + 1);
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
				"Created_On":Created_On,
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
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, {merge:true} ,function (s) {

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
		onReject: function () {

			var that = this;
		/*	if (this.getView().byId("VT_CStradinRet").getSelectedKey() == "Yes" && this.getView().byId("FromFourth").getText() == "") {
				sap.m.MessageBox.warning("Please select a vehicle");
				return;
           }*/
           	var textForDialog = this.getView().getModel("i18n").getResourceBundle().getText("rejectTradeRequest");
   
           
           	var dialog = new Dialog({
				title: 'Confirm Trade Request Rejection',
				type: 'Message',
				content: new Text({ text: textForDialog }),    
				beginButton: new Button({
					text: 'Yes',
					icon : 'sap-icon://message-warning',
					type : 'Accept',
					id : 'oYes',
					press: function () {
						/*sap.m.MessageBox.warning('Yes');*/
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			var Trade_Id = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Trade_Id;
			var Trade_Status = "R";
			var Requesting_Dealer = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer;
			var Requesting_Dealer_Name = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requesting_Dealer_Name;
			var Requested_Vtn = that.getView().byId("SimpleFormAproveTrReq").getModel().oData.Requested_Vtn;
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
				"Created_On":Created_On,
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
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, {merge:true} , function (s) {
				debugger

				if (dncBlockedDays != 0 && dncBlockedDays != "") {
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
						
						
						
						
						
						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'No',
				
					type : 'Reject',
					id : 'oNo',
					press: function () {
						/*	sap.m.MessageBox.warning('No');*/
						dialog.close();
					}
				}),
				afterClose: function() {
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

		/*	var oComment = [];
			for (var i = 0; i < oCommentData.length; i++) {
				oComment.push(oCommentData[i].Comment_Txt);
			}
			if (oComment.length != 0) {
				var oComment = oComment.join(".");
			} else {
				var oComment = "testing";
			}

			var BlockStartdate = "\/Date(1543449600000)\/";
			var Blockenddate = "\/Date(1543536000000)\/";*/
			/*	var BlockStartdate = oDateFormat1.format(new Date());
					var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
				var someDate = new Date();
				var numberOfDaysToAdd = Number(dncBlockedDays);
				var Blockenddate = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

				Blockenddate = oDateFormat1.format(new Date(Blockenddate));*/
			/*	var Createdby = sap.ui.getCore().LoginDetails.Username;*/
		/*	var Createdby = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');*/
               var oComment ="Via Trade Request";
     	       var BlockStartdateval = new Date();
		       Date.parse(BlockStartdateval);
		       var BlockStartdate = "/Date(" +Date.parse(BlockStartdateval)+ ")/";
		 
		        var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
		        Date.prototype.addDays = function(days) {
               this.setDate(this.getDate() + parseInt(days));
               return this;
               };
			     var BlockenddateVal2 = new Date();
			     BlockenddateVal2.addDays(dncBlockedDays);
			      Date.parse(BlockenddateVal2);
			      var Blockenddate = "/Date(" +Date.parse(BlockenddateVal2)+ ")/";
			     
		    var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
			var LoggedinUserLname =  sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
			var Createdby  = LoggedinUserFname+LoggedinUserLname;
       
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
				alert("ok");
			}, function () {

			});

		},

		onCounterTrade: function ()

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
				"Created_On":Created_On,
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
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, {merge:true} , function (s) {
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
		onCancel: function () {
			var that = this;

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
		/*	var Changed_on = this.getView().byId("SimpleFormAproveTrReq").getModel().oData.Changed_on;*/
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
				"Created_On":Created_On,
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
			that.oDataModel.update(UpdatedTreadeEntity, oEntry, {merge:true} , function (s) {
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
			/*	alert("fail");*/
			});

		},

		oBack: function () {
			var oPage = this.getView().byId("App_Apprvpage"); //Get Hold of page
			oPage.scrollTo(0, 0);
			//for screen 8
			if(	this.oSelectedItems=="SelectedFromTradeHistory"){
		 	this.getRouter().navTo("VehicleTrade_History");  
		}
		else{
			   this.getRouter().navTo("VehicleTrade_Summary", {
				DataClicked: "Yes"
			});
		}
		},

		VehicleTrade_SummaryData: function (StatusData) {
			var that = this;
			this.StatusData = StatusData;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				this.sPrefix = "";

			}
			this.nodeJsUrl = this.sPrefix;
			that.TradeRequestoDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeRequest";
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
				success: function (result) {}
			});
			that.TradeVehiclesDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeVehicles";
			/*var /zc_mmfields*/
			var ajax2 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				}
				/*,
				      beforeSend: function (request)
				           {
				               request.setRequestHeader('Authorization', 'Basic ' + btoa(''));
				           }*/
				,
				url: that.TradeVehiclesDataUrl,
				async: true,
				success: function (result) {}
			});
			that.oTradeVehicleDescDataUrl = this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata/TradeVehicleDesc";
			/*	var oTradeVehicleDesc = that.oDataUrl + "/TradeVehicleDesc";*/
			var ajax3 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},
				url: that.oTradeVehicleDescDataUrl,
				async: true,
				success: function (result) {}
			});

			sap.ui.core.BusyIndicator.show();
			var that = this;
			$.when(ajax1, ajax2, ajax3).done(function (TradeRequest, TradeVehicles, oTradeVehicleDesc) {
				var Trade_Id = that.StatusData.Trade_Id;
				var TradeRequest = TradeRequest[0].d.results;
				TradeRequest = TradeRequest.filter(function (x) {
					return x.Trade_Id == Trade_Id
				});

				/*	var TradeRequestModel = new sap.ui.model.json.JSONModel(TradeRequest);
					sap.ui.getCore().setModel(TradeRequestModel, "TradeRequestModel");*/

				var TradeVehicles = TradeVehicles[0].d.results;
				TradeVehicles = TradeVehicles.filter(function (x) {
						return x["Trade_Id.Trade_Id"] == Trade_Id
					})
					/*	var TradeVehiclesModel = new sap.ui.model.json.JSONModel(TradeVehicles);
						sap.ui.getCore().setModel(TradeVehiclesModel, "TradeVehiclesModel");*/

				var oTradeVehicleDesc = oTradeVehicleDesc[0].d.results;
				oTradeVehicleDesc = oTradeVehicleDesc.filter(function (x) {
						return x["Trade_Id.Trade_Id"] == Trade_Id
					})
					/*var oTradeVehicleDescModel = new sap.ui.model.json.JSONModel(oTradeVehicleDesc);
					sap.ui.getCore().setModel(oTradeVehicleDescModel, "oTradeVehicleDescModel");*/
					//	var filtered = [];
				for (var i = 0; i < TradeRequest.length; i++) {
					for (var j = 0; j < TradeVehicles.length; j++) {

						if (TradeRequest[i].Trade_Id == TradeVehicles[j]["Trade_Id.Trade_Id"]) {
							/*TradeRequest[i].push(TradeVehicles[j]);*/

							TradeVehicles[j].Requesting_Dealer = TradeRequest[i].Requesting_Dealer;
							TradeVehicles[j].Requesting_Dealer_Name = TradeRequest[i].Requesting_Dealer_Name;
							TradeVehicles[j].Requested_Dealer = TradeRequest[i].Requested_Dealer;
							TradeVehicles[j].Requested_Dealer_Name = TradeRequest[i].Requested_Dealer_Name;
							TradeVehicles[j].Requested_Vtn = TradeRequest[i].Requested_Vtn;
							TradeVehicles[j].Offered_Vtn = TradeRequest[i].Offered_Vtn;
							TradeVehicles[j].Req_Current_ETA_From = TradeRequest[i].Req_Current_ETA_From;
							TradeVehicles[j].Req_Current_ETA_To = TradeRequest[i].Req_Current_ETA_To;
							TradeVehicles[j].Req_Proposed_ETA_From = TradeRequest[i].Req_Proposed_ETA_From;
							TradeVehicles[j].Req_Proposed_ETA_To = TradeRequest[i].Req_Proposed_ETA_To;
							TradeVehicles[j].Off_Current_ETA_From = TradeRequest[i].Off_Current_ETA_From;
							TradeVehicles[j].Off_Current_ETA_To = TradeRequest[i].Off_Current_ETA_To;
							TradeVehicles[j].Off_Proposed_ETA_From = TradeRequest[i].Off_Proposed_ETA_From;
							TradeVehicles[j].Off_Proposed_ETA_To = TradeRequest[i].Off_Proposed_ETA_To;

							TradeVehicles[j].Created_By = TradeRequest[i].Created_By;
							TradeVehicles[j].Created_On = TradeRequest[i].Created_On;
							TradeVehicles[j].Changed_on = TradeRequest[i].Changed_on;
							TradeVehicles[j].Trade_Id = TradeRequest[i].Trade_Id;
							TradeVehicles[j].Trade_Return = TradeRequest[i].Trade_Return;
							TradeVehicles[j].Trade_Status = TradeRequest[i].Trade_Status;

							/*var realMerge = function (to, from) {

    for (var n in from) {

        if (typeof to[n] != 'object') {
            to[n] = from[n];
        } else if (typeof from[n] == 'object') {
            to[n] = realMerge(to[n], from[n]);
        }
    }
    return to;
};
	var merged = realMerge(TradeRequest[i],TradeVehicles[j]);*/

						}
						/*	else{
						     	TradeRequest[i].APX = "";
								TradeRequest[i].DNC = "";
								TradeRequest[i].Ext_Colour = "";
								TradeRequest[i].Int_Colour = "";
								TradeRequest[i].Model = "";
								TradeRequest[i].Model_Year = "";
								TradeRequest[i].Order_Type = "";
								TradeRequest[i].Series = "";
								TradeRequest[i].Status = "";
								TradeRequest[i].Suffix = "";
								TradeRequest[i]["Trade_Id.Trade_Id"] = "";
								TradeRequest[i].VTN ="";	
								
								
								
								
							}*/
					}

				}
				var filtered = TradeVehicles;
		//		var Spars = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language.slice(0, 1);
				//	var Spars = "E";
			     var Spars;
		    if (this.sCurrentLocaleD == "French") {
		    		Spars = "F";
		    } else {
		    		Spars = "E"; 
		    }
 
				var finalArray = [];
				for (var k = 0; k < filtered.length; k++) {
					for (var l = 0; l < oTradeVehicleDesc.length; l++) {
						if (filtered[k].Trade_Id == oTradeVehicleDesc[l]["Trade_Id.Trade_Id"] && filtered[k].VTN == oTradeVehicleDesc[l]["VTN.VTN"] &&
							oTradeVehicleDesc[l].SPRAS == Spars) {
							filtered[k].Ext_Colour_Desc = oTradeVehicleDesc[l].Ext_Colour_Desc;
							filtered[k].Int_Colour_Desc = oTradeVehicleDesc[l].Int_Colour_Desc;
							filtered[k].Model_Desc = oTradeVehicleDesc[l].Model_Desc;
							filtered[k].SPRAS = oTradeVehicleDesc[l].SPRAS;
							filtered[k].Series_Desc = oTradeVehicleDesc[l].Series_Desc;
							filtered[k].Suffix_Desc = oTradeVehicleDesc[l].Suffix_Desc;

							/*Ext_Colour_Desc: "50"
							Int_Colour_Desc: "30"
							Model_Desc: "40"
							SPRAS: "1"
							Series_Desc: "50"
							Suffix_Desc: "30"
							TradeVehicleDescs: {__deferred: {…}}
							Trade_Id.Trade_Id: "8"
							VTN.VTN: "6" */

							/*				var realMerge = function (to, from) {

							    for (var n in from) {

							    s    if (typeof to[n] != 'object') {
							            to[n] = from[n];
							        } else if (typeof from[n] == 'object') {
							            to[n] = realMerge(to[n], from[n]);
							        }
							    }
							    return to;
							};*/
							/*	var merged = realMerge(filtered[k],oTradeVehicleDesc[l]);
												finalArray.push(merged);*/
						}
						/*else {
					filtered[k].Ext_Colour_Desc = "";
							filtered[k].Int_Colour_Desc = "";
							filtered[k].Model_Desc ="";
							filtered[k].SPRAS = "";
							filtered[k].Series_Desc = "";
							filtered[k].Suffix_Desc = "";	
							
							
						}*/
					}
				}

				///	
				/*	TradeVehicles[j].=TradeRequest[i].Requesting_Dealer;
									TradeVehicles[j].=TradeRequest[i].Requesting_Dealer_Name ;
									TradeVehicles[j].=TradeRequest[i].Requested_Dealer;
									TradeVehicles[j].=TradeRequest[i].Requested_Dealer_Name;
									TradeVehicles[j]. = TradeRequest[i].Requested_Vtn;
									TradeVehicles[j]. = TradeRequest[i].Offered_Vtn;
								TradeVehicles[j]. = TradeRequest[i].Req_Current_ETA_From;
								TradeVehicles[j]. = TradeRequest[i].Req_Current_ETA_To;
								TradeVehicles[j]. = TradeRequest[i].Req_Proposed_ETA_From;
								TradeVehicles[j]. = TradeRequest[i].Req_Proposed_ETA_To;
									TradeVehicles[j]. = TradeRequest[i].Off_Current_ETA_From;
										TradeVehicles[j]. = TradeRequest[i].Off_Current_ETA_To;
											TradeVehicles[j]. = TradeRequest[i].Off_Proposed_ETA_From;
												TradeVehicles[j]. = TradeRequest[i].Off_Proposed_ETA_To;
												
												TradeVehicles[j]. = TradeRequest[i].Created_By;
											TradeVehicles[j]. = TradeRequest[i].Created_On;
												TradeVehicles[j]. = TradeRequest[i].Changed_on;
								TradeVehicles[j].=TradeRequest[i].Trade_Id;	*/

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

				var Requested = filtered.filter(function (x) {
					return x.VTN == vtn;
				});
				var Requested = Requested[0];
				var Offered = filtered.filter(function (x) {
					return x.VTN != vtn;
				});
				if (Offered.length != 0 && Offered["0"].Trade_Return != "N") {
					Offered = Offered[0];
					var i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
					var OtherVehicleInformation_text = i18n.getText("OfferVehicleInformation");
					that.getView().byId("Offerevehid").setText(OtherVehicleInformation_text);

					that.getView().byId("oRequesteddealer").setVisible(true);
					that.getView().byId("offeredDealer").setVisible(true);
					that.getView().byId("ofrModellabl").setVisible(true);
					that.getView().byId("ofrserieslabl").setVisible(true);
					that.getView().byId("ofrmodllabl").setVisible(true);
					that.getView().byId("ofrsuffixlabl").setVisible(true);
					that.getView().byId("ofrapxlabl").setVisible(true);
					that.getView().byId("ofrextcolorlabl").setVisible(true);
					that.getView().byId("ofrstatuslabl").setVisible(true);
					that.getView().byId("ofrordrtypelabl").setVisible(true);
					that.getView().byId("cetalaid").setVisible(true);
					that.getView().byId("fromqid").setVisible(true);
				/*	that.getView().byId("fromlbid").setVisible(true);*/
					that.getView().byId("idlto").setVisible(true);
					that.getView().byId("tobid").setVisible(true);
					that.getView().byId("fmlbid").setVisible(true);

					that.getView().byId("oRequesteddealer").setVisible(true);
					that.getView().byId("ofrmodelyeartext").setVisible(true);
					that.getView().byId("ofrseriestxt").setVisible(true);
					that.getView().byId("ofrmodltxt").setVisible(true);
					that.getView().byId("ofrsuffixstxt").setVisible(true);
					that.getView().byId("ofrapxtxt").setVisible(true);
					that.getView().byId("ofrexttxt").setVisible(true);
					that.getView().byId("ofrstatustxt").setVisible(true);
					that.getView().byId("ofrordtypetxt").setVisible(true);
					that.getView().byId("ctqtid").setVisible(true);
					that.getView().byId("txlab").setVisible(true);
					that.getView().byId("prolabid").setVisible(true);
					that.getView().byId("prptid").setVisible(true);
					that.getView().byId("otxlabel").setVisible(true);

				} else {
					Offered = {};
					that.getView().byId("Offerevehid").setText("");
					that.getView().byId("offeredDealer").setVisible(false);
					that.getView().byId("oRequesteddealer").setText("");
					that.getView().byId("oRequesteddealer").setVisible(false);

					that.getView().byId("ofrModellabl").setVisible(false);
					that.getView().byId("ofrmodelyeartext").setText("");
					that.getView().byId("ofrmodelyeartext").setVisible(false);

					that.getView().byId("ofrserieslabl").setVisible(false);
					that.getView().byId("ofrseriestxt").setText("");
					that.getView().byId("ofrseriestxt").setVisible(false);

					that.getView().byId("ofrmodllabl").setVisible(false);
					that.getView().byId("ofrmodltxt").setText("");
					that.getView().byId("ofrmodltxt").setVisible(false);

					that.getView().byId("ofrsuffixlabl").setVisible(false);
					that.getView().byId("ofrsuffixstxt").setText("");
					that.getView().byId("ofrsuffixstxt").setVisible(false);

					that.getView().byId("ofrapxlabl").setVisible(false);
					that.getView().byId("ofrapxtxt").setText("");
					that.getView().byId("ofrapxtxt").setVisible(false);

					that.getView().byId("ofrextcolorlabl").setVisible(false);
					that.getView().byId("ofrexttxt").setText("");
					that.getView().byId("ofrexttxt").setVisible(false);

					that.getView().byId("ofrstatuslabl").setVisible(false);
					that.getView().byId("ofrstatustxt").setText("");
					that.getView().byId("ofrstatustxt").setVisible(false);

					that.getView().byId("ofrordrtypelabl").setVisible(false);
					that.getView().byId("ofrordtypetxt").setText("");
					that.getView().byId("ofrordtypetxt").setVisible(false);

					that.getView().byId("cetalaid").setVisible(false);
					that.getView().byId("ctqtid").setText("");
					that.getView().byId("ctqtid").setVisible(false);

					that.getView().byId("fromqid").setVisible(false);
					that.getView().byId("txlab").setText("");
					that.getView().byId("txlab").setVisible(false);
					
					that.getView().byId("prolabid").setVisible(false);	
					

					that.getView().byId("tobid").setVisible(false);
					that.getView().byId("prptid").setText("");
					that.getView().byId("prptid").setVisible(false);

					that.getView().byId("fmlbid").setVisible(false);
				/*	that.getView().byId("fromlbid").setVisible(false);*/
					that.getView().byId("otxlabel").setText("");
					that.getView().byId("otxlabel").setVisible(false);

					that.getView().byId("idlto").setVisible(false);

				}

				var oModel = new sap.ui.model.json.JSONModel(Requested);
				sap.ui.getCore().setModel(oModel, "ApprovRej");
				sap.ui.getCore().getModel("ApprovRej").setProperty("/OffredVehicle", Offered);
				that.getView().byId("SimpleFormAproveTrReq").setModel(sap.ui.getCore().getModel("ApprovRej"));
				//	that.getView().byId("SimpleFormAproveTrReq").getModel("ApprovRej").setProperty("/OffredVehicle", Offered);
				that.getView().byId("SimpleFormAproveTrReq").bindElement("/");
				that.getView().byId("SimpleFormAproveTrReq").getModel().refresh(true);
				//	sap.ui.getCore().setModel(oModel, "oVehicleTrade_Summary");

				sap.ui.core.BusyIndicator.hide();
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
				handleLiveChangeText: function(oEvent) {
					var oTextArea = oEvent.getSource(),
					iValueLength = oTextArea.getValue().length;
		if(iValueLength>=150) {
        sap.m.MessageBox.warning("Comments not exceed more than 150 characters");
        return;
    } 
				
						/*	iMaxLength = oTextArea.getMaxLength(),
							sState = iValueLength > iMaxLength ? "Warning" : "None";

					oTextArea.setValueState(sState);*/
				}

	/*	onBack :function()
		{
		this.getRouter().navTo("VehicleSearcResults");	
			
		}*/

	});
});