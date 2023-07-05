sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/Device",
		'sap/m/MessageBox'
], function (Controller, History, Device, MessageBox) {
	"use strict";

	return Controller.extend("vehicleLocator.controller.BaseController", {
		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		 
		 //test for GIT Commit
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},
		
		ItemClicked: function() {
          /*Base Controller*/
          
			this.oText = this.getView().byId("combo1Menu").getSelectedItem().getText();

		},


     
     
		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

	/*	handleLinkPress: function (oEvent) {
			
			var oGetText = oEvent.getSource().getText();
			if (oGetText === "New Application") {
				this.getRouter().navTo("newECPApp");
			} else if (oGetText === "View/Update Application") {
				this.getRouter().navTo("ApplicationList");
			} else if (oGetText === "Agreement Inquiry") {
				this.getRouter().navTo("AgreementInquiry");
			}
		},*/

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		
		onBack: function() {
			/**/
			this.getRouter().navTo("VehicleLocSearch");
		

		},

		onNavBack: function() {
		/*	*/
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("VehicleLocSearch", {}, true);
			}
		},
		

		onNavBack3: function() {
			var oModel = [];
          	// this.getView().byId("VLRSuffix").setModel(oModel);
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("VehicleLocSearch", {}, true);
			}
		},
		
			handleLinkPress: function (evt) {
			MessageBox.alert("Link was clicked!");
		}


		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
	/*	onNavBack: function () {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("ApplicationList", {}, true);
			}
		}*/

		//     	getListRow: function(proId, control) {
		// 	//var oStandardListItem =control.getParent();

		// 	if (proId % 2 === 0) {

		// 		this.addStyleClass("evenClass");
		// 	}
		// 	else{
		// 		this.addStyleClass("oddClass");
		// 	}
		// 	return proId;
		// }

	});
});