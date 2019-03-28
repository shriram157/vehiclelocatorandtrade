sap.ui.define([
	/*"sap/ui/core/mvc/Controller"*/
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageBox',
	"sap/ui/core/routing/History",
	"vehicleLocator/Formatter/Formatter",
	"sap/ui/table/SortOrder",
	"sap/ui/model/Sorter",

], function (BaseController, JSONModel, ResourceModel, MessageBox, History, Formatter,SortOrder,Sorter) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleTrade_Summary", {

		onInit: function () {
			var _that = this;
			var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
			var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
		    this.getView().byId("oDealerCode7").setText(LoggedInDealerCode2);                                
			this.getView().byId("oDealerSummary").setText(LoggedInDealer);
			//Global date format
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			_that.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			
			/// set the logo and Language. 

				this._setTheLanguage();

				this._setTheLogo();			
			
		this.getRouter().getRoute("VehicleTrade_Summary").attachPatternMatched(this.onRouteMatched, this);		
	
			/*this.getRouter().attachRouteMatched(this.onRouteMatched, this);*/
		},
		onRouteMatched: function (oEvent) {
		var dataFrom=oEvent.getParameter("arguments").DataClicked;
		if(dataFrom!=undefined){
			this.VehicleTrade_Summary();
		
          }
		},
		
			VehicleLocSearchPress : function()
			{
			var that=this;
			that.getRouter().navTo("VehicleLocSearch");	
			
			
			
			},
			
			TradeHistoryLinkPressTS : function()
			{
			var that=this;
		    that.getRouter().navTo("VehicleTrade_History", {
				DataClicked: "Yes"
			});
			
			},
			BlockSummarypressTS : function()
			{
			var that = this;
			that.getRouter().navTo("VehicleTrade_ModelBlock_Summary");	
			},
			
			
			
		
		
		
		oRequestLinkPress: function (oEvt) {
			var that = this;
            
            // empty the comments box. 
            // this.getView().byId("zmessagestrip").setText("");      // 1303
            
			that.oTable = that.getView().byId("table1vts");
			that.oTableSelectObj = oEvt.getSource().getBindingContext("vehicleTradeSummaryTable").getObject();
    // sap.ui.getCore().VehicheSearcResults=this.getView().byId("table1vts").getModel().getData();
			if (that.oTableSelectObj != undefined) {

				var SelectedPath = oEvt.getSource().getBindingContext("vehicleTradeSummaryTable").getPath().split("/")[1];
             that.oTableSelectObj.FromRequesting=true;
             	var model = new sap.ui.model.json.JSONModel(that.oTableSelectObj);
             	model.setSizeLimit(1000);
			/*	sap.ui.getCore().setModel(model, "MyTradeRequestSelected");
		         	sap.ui.getCore().setModel(null,"MyTradeRequested");*/
		         	sap.ui.getCore().setModel(model, "MyTradeRequested");
				    sap.ui.getCore().setModel(null,"MyTradeRequestSelected");
                this.getRouter().navTo("VehcTrad_Apprv_Rej_CounTrad", {
					selectedmyTr: SelectedPath
				});
				that.oTableSelectObj = undefined;
			} else {
				sap.m.MessageBox.warning("Please select the trade");
				that.oTableSelectObj = undefined;
			}

		},
		oMyRequestLinkPress: function (oEvent) {
			debugger;

			var that = this;
			that.oRecTable = that.getView().byId("table1Rts");
			that.oRecTableSelectObj =  oEvent.getSource().getBindingContext("receivedRequestTable").getObject();
			
				if (that.oRecTableSelectObj != undefined) {

				var SelectedPath = oEvent.getSource().getBindingContext("receivedRequestTable").getPath().split("/")[1];
              that.oRecTableSelectObj.FromRequesting=false;
             	var model = new sap.ui.model.json.JSONModel(that.oRecTableSelectObj);
             	model.setSizeLimit(1000);
			/*	sap.ui.getCore().setModel(model, "MyTradeRequested");
				    sap.ui.getCore().setModel(null,"MyTradeRequestSelected");*/
				    	sap.ui.getCore().setModel(model, "MyTradeRequestSelected");
		         	sap.ui.getCore().setModel(null,"MyTradeRequested");
				    
				    
				
			//	if(sap.ui.getCore().getModel("MyTradeRequestSelected")!=undefined){
					
			//	}
                this.getRouter().navTo("VehcTrad_Apprv_Rej_CounTrad", {
					selectedmyTr: SelectedPath
				});
				that.oRecTableSelectObj= undefined;
			} else {
				sap.m.MessageBox.warning("Please select the trade");
				that.oRecTableSelectObj = undefined;
			}

		},
		

		VehicleTrade_Summary: function () {

			var that = this;

			/*$.ajax({
				url: that.oDataUrl,
				method: "GET",
				async: false,
				dataType: "json",

				success: function (oData) {

					debugger;
					var Data = oData.d.results;
				},
		error: function (response) {
					alert("Error");
				}
	
         //   }
//},
			
			});*/

			var that = this;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				this.sPrefix = "";

			}
			this.nodeJsUrl = this.sPrefix ;
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
				}
				/*,
				      beforeSend: function (request)
				           {
				               request.setRequestHeader('Authorization', 'Basic ' + btoa(''));
				           }*/
				,
				url: that.oTradeVehicleDescDataUrl,
				async: true,
				success: function (result) {}
			});

			sap.ui.core.BusyIndicator.show();
			var that = this;
			$.when(ajax1, ajax2, ajax3).done(function (TradeRequest, TradeVehicles, oTradeVehicleDesc) {
   
				var TradeRequest = TradeRequest[0].d.results;
				var TradeRequestModel = new sap.ui.model.json.JSONModel(TradeRequest);
				sap.ui.getCore().setModel(TradeRequestModel, "TradeRequestModel");

				var TradeVehicles = TradeVehicles[0].d.results;
				var TradeVehiclesModel = new sap.ui.model.json.JSONModel(TradeVehicles);
				sap.ui.getCore().setModel(TradeVehiclesModel, "TradeVehiclesModel");

				var oTradeVehicleDesc = oTradeVehicleDesc[0].d.results;
				var oTradeVehicleDescModel = new sap.ui.model.json.JSONModel(oTradeVehicleDesc);
				sap.ui.getCore().setModel(oTradeVehicleDescModel, "oTradeVehicleDescModel");
				//	var filtered = [];
				for (var i = 0; i < TradeRequest.length; i++) {
					for (var j = 0; j < TradeVehicles.length; j++) {
						if (TradeRequest[i].Trade_Id == TradeVehicles[j]["Trade_Id.Trade_Id"] &&TradeRequest[i].Requested_Vtn==TradeVehicles[j].VTN) {
							/*TradeRequest[i].push(TradeVehicles[j]);*/

							TradeRequest[i].APX = TradeVehicles[j].APX;
							TradeRequest[i].DNC = TradeVehicles[j].DNC;
							TradeRequest[i].Ext_Colour = TradeVehicles[j].Ext_Colour;
							TradeRequest[i].Int_Colour = TradeVehicles[j].Int_Colour;
							TradeRequest[i].Model = TradeVehicles[j].Model;
							TradeRequest[i].Model_Year = TradeVehicles[j].Model_Year;
							TradeRequest[i].Order_Type = TradeVehicles[j].Order_Type;
							TradeRequest[i].Series = TradeVehicles[j].Series;
							TradeRequest[i].Status = TradeVehicles[j].Status;
							TradeRequest[i].Suffix = TradeVehicles[j].Suffix;
							TradeRequest[i]["Trade_Id.Trade_Id"] = TradeVehicles[j]["Trade_Id.Trade_Id"];
							TradeRequest[i].VTN = TradeVehicles[j].VTN;

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
				var filtered = TradeRequest;
				var Spars;
				// var Spars = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language.slice(0,1);  //GSR
			if  (this.sCurrentLocaleD == "French" ){
				Spars = "F";
			} else {
				Spars = "E"	;
			}	
				
				
				
			//	var Spars = "E";
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

							        if (typeof to[n] != 'object') {
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
			
				
				
				
				
		for(var n=0;n<filtered.length;n++){
			if ("APX" in filtered[n]) {
        filtered[n].APX=filtered[n].APX;
               } else {
           filtered[n].APX = "";
        }
        
        	if ("DNC" in filtered[n]) {
        filtered[n].DNC=filtered[n].DNC;
               } else {
           filtered[n].DNC = "";
        }
        
        	if ("Ext_Colour" in filtered[n]) {
        filtered[n].Ext_Colour=filtered[n].Ext_Colour;
               } else {
           filtered[n].Ext_Colour = "";
        }
        
        	if ("Int_Colour" in filtered[n]) {
        filtered[n].Int_Colour=filtered[n].Int_Colour;
               } else {
           filtered[n].Int_Colour = "";
        }
        
        	if ("Model" in filtered[n]) {
        filtered[n].Model=filtered[n].Model;
               } else {
           filtered[n].Model = "";
        }
        
        	if ("Model_Year" in filtered[n]) {
        filtered[n].Model_Year=filtered[n].Model_Year;
               } else {
           filtered[n].Model_Year = "";
        }
        
        	if ("Order_Type" in filtered[n]) {
        filtered[n].Order_Type=filtered[n].Order_Type;
               } else {
           filtered[n].Order_Type = "";
        }
        
        	if ("Series" in filtered[n]) {
        filtered[n].Series =filtered[n].Series;
               } else {
           filtered[n].Series = "";
        }
        
        	if ("Status" in filtered[n]) {
        filtered[n].Status=filtered[n].Status;
               } else {
           filtered[n].Status = "";
        }
        
        	if ("Suffix" in filtered[n]) {
        filtered[n].Suffix=filtered[n].Suffix;
               } else {
           filtered[n].Suffix = "";
        }
        
        	if ("Trade_Id.Trade_Id" in filtered[n]) {
        filtered[n]["Trade_Id.Trade_Id"]=filtered[n]["Trade_Id.Trade_Id"];
               } else {
           filtered[n]["Trade_Id.Trade_Id"] = "";
        }
        
        	if ("VTN" in filtered[n]) {
        filtered[n].VTN=filtered[n].VTN;
               } else {
           filtered[n].VTN = "";
        }
        
        	if ("Ext_Colour_Desc" in filtered[n]) {
        filtered[n].Ext_Colour_Desc=filtered[n].Ext_Colour_Desc;
               } else {
           filtered[n].Ext_Colour_Desc = "";
        }
        
        	if ("Int_Colour_Desc" in filtered[n]) {
        filtered[n].Int_Colour_Desc=filtered[n].Int_Colour_Desc;
               } else {
           filtered[n].Int_Colour_Desc = "";
        }
        
        	if ("Model_Desc" in filtered[n]) {
        filtered[n].Model_Desc=filtered[n].Model_Desc;
               } else {
           filtered[n].Model_Desc = "";
        }
        
        	if ("SPRAS" in filtered[n]) {
        filtered[n].SPRAS =filtered[n].SPRAS;
               } else {
           filtered[n].SPRAS = Spars;
        }
        
        	if ("Series_Desc" in filtered[n]) {
        filtered[n].Series_Desc=filtered[n].Series_Desc;
               } else {
           filtered[n].Series_Desc = "";
        }
        
        	if ("Suffix_Desc" in filtered[n]) {
        filtered[n].Suffix_Desc=filtered[n].Suffix_Desc;
               } else {
           filtered[n].Suffix_Desc = "";
        }
        
		}

				var oModel = new sap.ui.model.json.JSONModel(filtered);
				sap.ui.getCore().setModel(oModel, "oVehicleTrade_Summary");
				//	console(finalArray);
					if (sap.ui.getCore().getModel("oVehicleTrade_Summary") != undefined) {
			/*	var Dealer=sap.ui.getCore().LoginDetails.DealerCode;*/
	var userAttributesModellen=sap.ui.getCore().getModel("LoginuserAttributesModel").getData();
 /*var Dealer=userAttributesModellen[0].DealerCode[0];*/
var  Dealer=userAttributesModellen[0].DealerCode; //security login code		
				if(Dealer.length==10){
					Dealer=Dealer.slice(-5);
				}
				var RequesttingDealer1=sap.ui.getCore().getModel("oVehicleTrade_Summary").getData().filter(function(x){return x.Requesting_Dealer!=null;});
				var RequesttingDealer=RequesttingDealer1.filter(function(x){return x.Requesting_Dealer.slice(-5)==Dealer &&(x.Trade_Status=="A"||x.Trade_Status=="S"||x.Trade_Status=="C"||x.Trade_Status=="X" ||x.Trade_Status=="R"||x.Trade_Status=="F")});
				var model= new sap.ui.model.json.JSONModel(RequesttingDealer);
				model.setSizeLimit(1000);
				
							 
				that.getView().setModel(model, "vehicleTradeSummaryTable");
				
				
				
				// that.getView().byId("table1vts").setModel(model);
			/*	sap.ushell.components.model = this.getView().byId("table1vts");*/
				var today = new Date();
var CurrentDate = Date.parse(today);
 CurrentDate = '/Date(' + CurrentDate + ')/';
 var date = new Date();
date.setDate(date.getDate() -30);

//var lastthirtyDays = date.getDate()+'/'+ (date.getMonth()+1) +'/'+date.getFullYear();
var lastthirtyDays=new Date(date);
lastthirtyDays=Date.parse(lastthirtyDays);
 lastthirtyDays = '/Date(' + lastthirtyDays + ')/';
var aTableFilters = [];
var table = that.getView().byId("table1vts");
// var oBinding = table.getBinding("rows");
var oBinding = table.getBinding("items");
var oFilter = new sap.ui.model.Filter('Changed_on',sap.ui.model.FilterOperator.GE,lastthirtyDays);
// var oFilter = new sap.ui.model.Filter('Changed_on',sap.ui.model.FilterOperator.BT,CurrentDate,lastthirtyDays);
//var oFilter = new sap.ui.model.Filter('Changed_on',sap.ui.model.FilterOperator.LE,lastthirtyDays);
// var oFilter1 = new sap.ui.model.Filter('Changed_on',sap.ui.model.FilterOperator.GE,lastthirtyDays);
aTableFilters.push(oFilter);
//aTableFilters.push(oFilter1);
oBinding.filter(aTableFilters);
/*	var oProductNameColumn = that.getView().byId("Changed_on");
				that.getView().byId("table1vts").sort(oProductNameColumn, SortOrder.Descending);*/
//sap.ushell.components.getBinding("rows").filter(aTableFilters);

				that.getView().setModel(model, "oVehiclTrade_SummaryRequestingData");
				var RequestedDealer1=sap.ui.getCore().getModel("oVehicleTrade_Summary").getData().filter(function(x){return x.Requested_Dealer!=null;});
					var RequestedDealer=RequestedDealer1.filter(function(x){return x.Requested_Dealer.slice(-5)==Dealer&&(x.Trade_Status=="A"||x.Trade_Status=="S"||x.Trade_Status=="C"||x.Trade_Status=="X" ||x.Trade_Status=="R"||x.Trade_Status=="F")});
				var model= new sap.ui.model.json.JSONModel(RequestedDealer);
					model.setSizeLimit(1000);
				that.getView().setModel(model, "oVehiclTrade_SummaryRequestedData");
				
				that.getView().setModel(model, "receivedRequestTable");
				
				// that.getView().byId("table1Rts").setModel(model);
				var aTableFilters = [];
var table = that.getView().byId("table1Rts");
// var oBinding = table.getBinding("rows");
  var oBinding = table.getBinding("items");
var oFilter = new sap.ui.model.Filter('Changed_on',sap.ui.model.FilterOperator.GE,lastthirtyDays);
// var oFilter = new sap.ui.model.Filter('Changed_on',sap.ui.model.FilterOperator.BT,CurrentDate,lastthirtyDays);
//var oFilter = new sap.ui.model.Filter('Changed_on',sap.ui.model.FilterOperator.LE,lastthirtyDays);
// var oFilter1 = new sap.ui.model.Filter('Changed_on',sap.ui.model.FilterOperator.GE,lastthirtyDays);
aTableFilters.push(oFilter);
//aTableFilters.push(oFilter1);
oBinding.filter(aTableFilters);
				//.getView().getModel("oVehiclTrade_SummaryRequestedData").refresh(true);
				}
			
				sap.ui.core.BusyIndicator.hide();
			});

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
					handleViewSettingsDialogButtonPressed: function (oEvt) {
			// this._oResponsivePopover = sap.ui.xmlfragment("vehicleLocator.fragment.VehicleSearchResult", this);
			if (!this._sortDialog) {
				this._sortDialog = sap.ui.xmlfragment("VehicleTradeSummarySortDialog", "vehicleLocator.fragment.VehicleTradeSummarySortDialog", this);
			}
			this.getView().addDependent(this._sortDialog);

			this._sortDialog.open();

		},
		
				handleConfirm: function (oEvent) {
			// This event is triggered when user
			// clicks on Ok button on
			// fragment popup
			var aSorters = [];
			var oView = this.getView();
			var oTable = oView
				.byId("table1vts");
			// Get the parameters for sorting
			var mParams = oEvent
				.getParameters();
			var oBinding = oTable
				.getBinding("items");
			var sPath = mParams.sortItem
				.getKey();
			var bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath,
				bDescending));
			oBinding.sort(aSorters);

		},
		handleCancel: function (oEvent) {
			// this._sortDialog.destroy(true);
		},


					receivedTradeRequestSortDialogButtonPressed: function (oEvt) {
			// this._oResponsivePopover = sap.ui.xmlfragment("vehicleLocator.fragment.VehicleSearchResult", this);
			if (!this._sortDialog) {
				this._sortDialog = sap.ui.xmlfragment("ReceivedTradeRequestSortDialog", "vehicleLocator.fragment.ReceivedTradeRequestSortDialog", this);
			}
			this.getView().addDependent(this._sortDialog);

			this._sortDialog.open();

		},
		
				handleConfirmReceiveTradeRequest: function (oEvent) {
			// This event is triggered when user
			// clicks on Ok button on
			// fragment popup
			var aSorters = [];
			var oView = this.getView();
			var oTable = oView
				.byId("table1Rts");
			// Get the parameters for sorting
			var mParams = oEvent
				.getParameters();
			var oBinding = oTable
				.getBinding("items");
			var sPath = mParams.sortItem
				.getKey();
			var bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath,
				bDescending));
			oBinding.sort(aSorters);

		},
 





	});
});