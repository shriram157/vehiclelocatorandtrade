sap.ui.define([
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"vehicleLocator/model/models"
], function (Dialog, Text, UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("vehicleLocator.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();
			
              this._setTheLanguage();
			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// Get resource bundle
			var bundle = this.getModel('i18n').getResourceBundle();
			
		

			// Attach XHR event handler to detect 401 error responses for handling as timeout
			var sessionExpDialog = new Dialog({
				title: bundle.getText('SESSION_EXP_TITLE'),
				type: 'Message',
				state: 'Warning',
				content: new Text({
					text: bundle.getText('SESSION_EXP_TEXT')
				})
			});
			var origOpen = XMLHttpRequest.prototype.open;
			XMLHttpRequest.prototype.open = function () {
				this.addEventListener('load', function (event) {
					// TODO Compare host name in URLs to ensure only app resources are checked
					if (event.target.status === 401) {
						if (!sessionExpDialog.isOpen()) {
							sessionExpDialog.open();
						}
					}
				});
				origOpen.apply(this, arguments);
			};
				 
			
		},
		
				_setTheLanguage: function (oEvent) {

			// var oI18nModel = new sap.ui.model.resource.ResourceModel({
			// 	bundleUrl: "i18n/i18n.properties"
			// });
			// this.getView().setModel(oI18nModel, "i18n");

			//  get the locale to determine the language. 
			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				var sSelectedLocale = "en"; // default is english 
			}

			if (sSelectedLocale == "fr") {
				// var i18nModel = new sap.ui.model.resource.ResourceModel({
				// 	bundleUrl: "i18n/i18n.properties",
				// 	bundleLocale: ("fr")

				// });
				// this.getView().setModel(i18nModel, "i18n");
						sap.ui.getCore().getConfiguration().setLanguage("fr");

			} else {
				// var i18nModel = new sap.ui.model.resource.ResourceModel({
				// 	bundleUrl: "i18n/i18n.properties",
				// 	bundleLocale: ("en")

				// });
				 sap.ui.getCore().getConfiguration().setLanguage("en");
			}

			// var oModeli18n = this.getView().getModel("i18n");
			// this._oResourceBundle = oModeli18n.getResourceBundle();
		},
	});
});