sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History"
], function(Controller, BaseController, ResourceModel, JSONModel, History) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleSearcResults", {

		onInit: function()
		{
			debugger;
			this._oViewModel = new sap.ui.model.json.JSONModel();
            this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(); // instantiate the resource
            this.getRouter().attachRouteMatched(this.onRouteMatched, this);
            /*var that = this;
             $.ajax({
			   url:"/node/Z_VEHICLE_CATALOGUE_SRV/zc_myear",
			   	method: "GET",
				async: false,
				dataType: "json",
                success: function(oData) {
				 oData.d.results[0];
			     var oJsonModel = new sap.ui.model.json.JSONModel(oData.d.results);
			     that.getView().byId("table1VSR").setModel(oJsonModel);
				  var oDealer = [];
					$.each(oData.d.results, function(i, item) {
						var oBusparLength = item.BusinessPartner.length;

						oDealer.push({
							"BusinessPartner": item.BusinessPartner.substring(5, oBusparLength),
							"BusinessPartnerName": item.OrganizationBPName1 
						});

					});
					that.getView().setModel(new sap.ui.model.json.JSONModel(oDealer), "oDealerModel");
				},
				error: function(response) {
               }
			});

             this.getRouter().attachRouteMatched(this.onRouteMatched, this);*/
		},
	   
	    
	onRouteMatched: function(oEvent) {
         debugger;
	//	var oParameters = oEvent.getParameters();
	/*	this.empno = oParameters.arguments.empno;
		this.mblno = oParameters.arguments.mblno;
	

	
		this.getView().byId("status").setText(age);
		this.getView().byId("text3").setText(this.lname);
		this.getView().byId("text2").setText(this.empno);
		this.getView().byId("text1").setText(this.fnmae);*/
	

	},
		
		onDealerSelected : function(oEvent)
				{
				
			var selectedCustomerT = this.getView().byId("dealerID").getValue();
			var sSelectedMatnr = oEvent.getParameter("\selectedItem").getProperty("key");
			var sSelectedMatnrText = oEvent.getParameter("\selectedItem").getProperty("additionalText");
            this._selectedDealerModel.setProperty("/Dealer_No", sSelectedMatnr);
			this._selectedDealerModel.setProperty("/Dealer_Name", sSelectedMatnrText);
		     	},
			handlebacksearch:function(){
				this.getRouter().navTo("VehicleLocSearch");
			},
			handleDummyThird:function()
			{
				debugger;
				this.getRouter().navTo("VehicleTrade_CreateSingle");
			}


	});
});