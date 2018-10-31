sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel"
], function(Controller, BaseController, ResourceModel, JSONModel) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleSearcResults", {

		onInit: function() {
			
			//define JSON model
			this._oViewModel = new sap.ui.model.json.JSONModel();

			this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(); // instantiate the resource 

			var that = this;

			$.ajax({
				
			   url:"/node/Z_VEHICLE_CATALOGUE_SRV/zc_myear",
			   
				method: "GET",
				async: false,
				dataType: "json",

				success: function(oData) {
						/*console.log(oData);*/
					   oData.d.results[0];
			     var oJsonModel = new sap.ui.model.json.JSONModel(oData.d.results);
			     that.getView().byId("table1VSR").setModel(oJsonModel);
				 
				      /* var oEsets = [];
					$.each(oData.d.results[0], function(i, item) {*/
					/*var oBusparLength = item.BusinessPartner.length;*/

					/*	oEsets.push({
							"ModelYear" : oData.d.results[0]
							
							"BusinessPartner": item.BusinessPartner.substring(5, oBusparLength),
							"BusinessPartnerName": item.OrganizationBPName1 
							//item.BusinessPartnerFullName
						});*/

				/*	});*/
				/*	that.getView().setModel(new sap.ui.model.json.JSONModel(oEsets), "oDealerModel");*/		
					
					var oDealer = [];
					$.each(oData.d.results, function(i, item) {
						var oBusparLength = item.BusinessPartner.length;

						oDealer.push({
							"BusinessPartner": item.BusinessPartner.substring(5, oBusparLength),
							"BusinessPartnerName": item.OrganizationBPName1 //item.BusinessPartnerFullName
						});

					});
					that.getView().setModel(new sap.ui.model.json.JSONModel(oDealer), "oDealerModel");
				},
				error: function(response) {

				}
			});

             this.getRouter().attachRouteMatched(this.onRouteMatched, this);


		},
		onRouteMatched : function(oEvent)
		
		{
		
			
	/*	  var oReceivedDataString = oEvent.getParameter("arguments").Selecteddata;
		  var oReceivedData = JSON.parse(oReceivedDataString);	*/
			
			
		},
		
				onDealerSelected : function(oEvent)
				{
				
			var selectedCustomerT = this.getView().byId("dealerID").getValue();
			var sSelectedMatnr = oEvent.getParameter("\selectedItem").getProperty("key");
			var sSelectedMatnrText = oEvent.getParameter("\selectedItem").getProperty("additionalText");

			this._selectedDealerModel.setProperty("/Dealer_No", sSelectedMatnr);
			this._selectedDealerModel.setProperty("/Dealer_Name", sSelectedMatnrText);
		
				/*this.getView().byId("messageStripError").setProperty("visible", false);*/
				
				}
				


	});
});