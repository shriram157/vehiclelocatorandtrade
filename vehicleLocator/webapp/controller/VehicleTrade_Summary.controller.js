sap.ui.define([
	/*"sap/ui/core/mvc/Controller"*/
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageBox',
	"sap/ui/core/routing/History",
	"vehicleLocator/Formatter/Formatter",

], function (BaseController, JSONModel, ResourceModel, MessageBox, History, Formatter) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleTrade_Summary", {

		onInit: function () {
			var _that = this;
			//Global date format
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			_that.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			//***********Language translator functionality**********//
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

			} else {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';

			}
			this.getRouter().attachRouteMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function (oEvent) {
			debugger;
			if (sap.ui.getCore().getModel("oVehicleTrade_Summary") != undefined) {
				var Dealer=sap.ui.getCore().LoginDetails.DealerCode;
				if(Dealer.length==10){
					Dealer=Dealer.slice(-5);
				}
				var RequesttingDealer1=sap.ui.getCore().getModel("oVehicleTrade_Summary").getData().filter(function(x){return x.Requesting_Dealer!=null;});
				var RequesttingDealer=RequesttingDealer1.filter(function(x){return x.Requesting_Dealer.slice(-5)==Dealer;});
				var model= new sap.ui.model.json.JSONModel(RequesttingDealer);
				model.setSizeLimit(1000);
				this.getView().setModel(model, "oVehiclTrade_SummaryRequestingData");
				var RequestedDealer1=sap.ui.getCore().getModel("oVehicleTrade_Summary").getData().filter(function(x){return x.Requested_Dealer!=null;});
					var RequestedDealer=RequestedDealer1.filter(function(x){return x.Requested_Dealer.slice(-5)==Dealer;});
				var model= new sap.ui.model.json.JSONModel(RequestedDealer);
					model.setSizeLimit(1000);
				this.getView().setModel(model, "oVehiclTrade_SummaryRequestedData");
			}

		},
		oRequestLinkPress: function (oEvt) {
			var that = this;

			that.oTable = that.getView().byId("table1vts");
			that.oTableSelectObj = oEvt.getSource().getParent().oBindingContexts.oVehiclTrade_SummaryRequestingData.getObject();
    // sap.ui.getCore().VehicheSearcResults=this.getView().byId("table1vts").getModel().getData();
			if (that.oTableSelectObj != undefined) {

				var SelectedPath = oEvt.getSource().getParent().oBindingContexts.oVehiclTrade_SummaryRequestingData.getPath().split("/")[1];
             that.oTableSelectObj.FromRequesting=true;
             	var model = new sap.ui.model.json.JSONModel(that.oTableSelectObj);
             	model.setSizeLimit(1000);
				sap.ui.getCore().setModel(model, "MyTradeRequestSelected");
			sap.ui.getCore().setModel(null,"MyTradeRequested");
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
			that.oRecTableSelectObj =  oEvent.getSource().getParent().oBindingContexts.oVehiclTrade_SummaryRequestedData.getObject();
			
				if (that.oRecTableSelectObj != undefined) {

				var SelectedPath = oEvent.getSource().getParent().oBindingContexts.oVehiclTrade_SummaryRequestedData.getPath().split("/")[1];
              that.oRecTableSelectObj.FromRequesting=false;
             	var model = new sap.ui.model.json.JSONModel(that.oRecTableSelectObj);
             	model.setSizeLimit(1000);
				sap.ui.getCore().setModel(model, "MyTradeRequested");
			//	if(sap.ui.getCore().getModel("MyTradeRequestSelected")!=undefined){
					sap.ui.getCore().setModel(null,"MyTradeRequestSelected");
			//	}
                this.getRouter().navTo("VehcTrad_Apprv_Rej_CounTrad", {
					selectedmyTr: SelectedPath
				});
				that.oRecTableSelectObj= undefined;
			} else {
				sap.m.MessageBox.warning("Please select the trade");
				that.oRecTableSelectObj = undefined;
			}
			
			
			
			/*if(that.oRecTableSelectObj!=){
				
			}else{
				
			}*/
			

		}

	});
});