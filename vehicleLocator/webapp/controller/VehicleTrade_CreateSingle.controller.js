sap.ui.define([
	/*"sap/ui/core/mvc/Controller"*/
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageBox',
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, ResourceModel, MessageBox, History) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleTrade_CreateSingle", {

		onInit: function () {
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

		},
		onAfterRendering: function () {
			debugger;
			var that = this;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";
            }
			this.nodeJsUrl = this.sPrefix + "/node";
            that.oDataUrl =  this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
            that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
		}

	});
});