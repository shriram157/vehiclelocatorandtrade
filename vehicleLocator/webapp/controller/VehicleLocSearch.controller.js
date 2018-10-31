sap.ui.define([
	/*"sap/ui/core/mvc/Controller"*/
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleLocSearch", {

		onInit: function() {
			
			

			
			
			
			
			
			
			
			
			
			
			

			/*	that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			    that.oDataModel.read("/zc_exterior_trim", "anisetc", "anisetc", false,
					function(oData) 
					{
						console.log("/zc_exterior_trim", oData);
						var oResults = oData.results;

						var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
						that.getView().byId("McCmbo").setModel(oJsonModelVLS);
						that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);
				

					},
					function(oError) {

					});

			    	that.oDataModel.read("/zc_mmfields", "anisetc", "anisetc", false,
					function(oData) {
						console.log("zc_mmfields", oData);
						var oResults = oData.results;
						var oJsonModelVLS2 = new sap.ui.model.json.JSONModel(oResults);
						that.getView().byId("SeriesCmbo").setModel(oJsonModelVLS2);
				
					},
					function(oError) {

					});*/

			/*	$.ajax({
						url: "https://tcid1gwapp1.tci.internal.toyota.ca:44300/sap/opu/odata/sap/Z_VEHICLE_CATALOGUE_SRV/zc_myear",
						method: "GET",
						async: false,
						dataType: "json",

						success: function(oData) 
						{
							
				            console.log(oData);
							oData.d.results[0];

							var oJsonModelVLS = new sap.ui.model.json.JSONModel(oData.d);
							that.getView().byId("MoyearCombo").setModel(oJsonModelVLS);
							that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);

						},
						error: function(response) {

						}
					});

					$.ajax({
						url: "https://tcid1gwapp1.tci.internal.toyota.ca:44300/sap/opu/odata/sap/Z_VEHICLE_CATALOGUE_SRV/zc_mmfields",

						method: "GET",
						async: false,
						dataType: "json",

						success: function(oData) {
							console.log(oData);
							oData.d.results[0];
							var oJsonModelVLS2 = new sap.ui.model.json.JSONModel(oData.d);
							that.getView().byId("SeriesCmbo").setModel(oJsonModelVLS2);
							that.getView().byId("McCmbo").setModel(oJsonModelVLS2);

						},
						error: function(response) {

						}
					});*/

			/*	var oSelectedYear = this.getView().byId("MoyearCombo").getSelectedKey();
				var data = sap.ui.getCore().getModel("oJsonModelVLS").getData();
				var filterData = data.filter(function(x) {
					return x.ModelYear == oSelectedYear;
				});

				var obj = {};
				for (var i = 0, len = filterData.length; i < len; i++) obj[filterData[i]['TOMSSeriesDescription']] = filterData[i];
				
				filterData = new Array();
				for (var key in obj) filterData.push(obj[key]);
		

				var model = new sap.ui.model.json.JSONModel(filterData);
				this.getView().byId("SeriesCmbo").setModel(model);
				this.getView().byId("MoyearCombo").setSelectedKey(filterData[0].TOMSSeriesDescription);*/

		},
		onAfterRendering: function() {
			var that = this;
			that._oViewModel = new sap.ui.model.json.JSONModel();

			that._oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle(); // instantiate the resource 

			/*var that = this;*/

		//	that.oDataUrl = "https://tcid1gwapp1.tci.internal.toyota.ca:44300/sap/opu/odata/sap/Z_VEHICLE_CATALOGUE_SRV";
           that.oDataUrl = "/node/Z_VEHICLE_CATALOGUE_SRV";
        //   that.oDataUrl = "https://vehiclelocator_node.cfapps.us10.hana.ondemand.com/node/Z_VEHICLE_CATALOGUE_SRV";
			var oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			// oDataModel.setHeaders({
			// 	"Content-Type": "application/json",
		
			// 	"X-Requested-With": "XMLHttpRequest",
			// 	"DataServiceVersion": "2.0",
			// 	"Accept": "application/json",
			// 	"Method": "GET"
			// });
			var BatchUrl = [];
			BatchUrl.push(oDataModel.createBatchOperation("/zc_model", "GET"));
			BatchUrl.push(oDataModel.createBatchOperation("/zc_exterior_trim", "GET"));
		/*	
		     -------------WORKING ONE---------------------
		    BatchUrl.push(oDataModel.createBatchOperation("/zc_exterior_trim", "GET"));
			BatchUrl.push(oDataModel.createBatchOperation("/zc_mmfields", "GET"));*/
			oDataModel.addBatchReadOperations(BatchUrl);
			oDataModel.setUseBatch(false);
			oDataModel.submitBatch(function(oData, oResponse) {
				var Data = oData.__batchResponses[0].data.results;
				sap.ui.getCore().setModel(Data, "McCmboSuffCmbo");
				that.oJsonModelVLS = new sap.ui.model.json.JSONModel(Data);
				
				that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS);
				that.getView().byId("McCmbo").setModel(that.oJsonModelVLS);
 
				
			/*	
			   -------------WORKING ONE---------------------
				sap.ui.getCore().setModel(Data, "McCmboSuffCmbo");
				that.oJsonModelVLS = new sap.ui.model.json.JSONModel(Data);
				that.getView().byId("McCmbo").setModel(that.oJsonModelVLS);
				that.getView().byId("SuffCmbo").setModel(that.oJsonModelVLS);
				
				var Data2 = oData.__batchResponses[1].data.results;
			    that.oJsonmodel = new sap.ui.model.json.JSONModel(Data2);
			    that.getView().setModel(that.oJsonmodel);*/
	 
			   
			   /* sap.ui.getCore().setModel(Data2, "SeriesModel");
			    that.oJsonModelVLS2 = new sap.ui.model.json.JSONModel(Data2);
				that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS2);*/
				
				
				
				
				
				
				
				
			    /*that.getView().byId("SeriesCmbo").setModel(oJsonModelVLS2);*/
				   /*  that.getView().byId("SeriesCmbo").setModel(new sap.ui.model.json.JSONModel(oJsonModelVLS2,"JsSeriesModel"));*/
				
				
				
			/*	sap.ui.getCore().setModel(Data2, "SeriesCmbo");
				that.oJsonModelVLS2 = new sap.ui.model.json.JSONModel(Data2);
				that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS2);*/
				
				/*	that.oJsonModelVLS2.getData(Data2,"SeriesModel");
					that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS2);*/
			

			}, function(err) {
			/*	alert("error");*/

			});

		},

		SeriesChange: function(oEvent) {
			
		/*	var that = this;
			var oValue = oEvent.getParameter("newValue");
         	var filters = [];
			if (oValue) {
             	filters = [
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("ModelSeriesNo", function(sText) {
							return (sText || "").toUpperCase().indexOf(oValue.toUpperCase()) > -1;
						})

					], false)
				];
			}
			var items = oEvent.getSource().getBinding("items").filter(filters);
			items.suggest();*/

			/*var items = oEvent.getSource().getBinding("items").filter(filters);
			items.suggest();*/

			/*	this.oJsonModelVLS.getBinding("McCmbo").filter(filters);
				this.oJsonModelVLS.suggest();*/

		},

		onSePress: function() {
			
			var that = this;

			/*var string = Data.replace(/[^a-zA-Z0-9]/g,'_');*/
           /* that.oJsonModelVLS;
			var odb = {};
			var oArray = [];
			oArray.push(that.oJsonModelVLS);
			var odb = encodeURIComponent(oArray);
			odb.McCmbo = this.getView().byId("McCmbo").getSelectedKey();
			odb.SuffCmbo = this.getView().byId("SuffCmbo").getSelectedKey();
			odb.SeriesCmbo = this.getView().byId("SeriesCmbo").getSelectedKey();

			var Data = JSON.stringify(odb);

			var res = Data.replace(/✕/g, "red");
			var res2 = res.replace(/\//g, "green");*/

			this.getRouter().navTo("VehicleSearcResults", {
				/*	Selecteddata :  res*/

			});

		},

		ItemClickedVLS: function(oEvent) {
			var that = this;
			that.oSelectedYear = oEvent.oSource.mProperties.value;
		/*	that.oDataUrl = "https://tcid1gwapp1.tci.internal.toyota.ca:44300/sap/opu/odata/sap/Z_VEHICLE_CATALOGUE_SRV";*/
		    that.oDataUrl = "/node/Z_VEHICLE_CATALOGUE_SRV";
            //that.oDataUrl = "https://vehiclelocator_node.cfapps.us10.hana.ondemand.com/node/Z_VEHICLE_CATALOGUE_SRV";
			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			/*	that.oDataModel.read("/zc_mmfields/?$filter(" + that.oSelectedYear + '")', "anisetc", "anisetc", false,*/
			that.oDataModel.read("/zc_exterior_trim/?$filter(" + that.oSelectedYear + '")', "anisetc", "anisetc", false,
				function(oData) {
				/*	console.log("/zc_exterior_trim", oData);*/
					var oResults = oData.results;
					var Oresult = oResults.filter(function(x)
					{
						return x.ModelYear==that.oSelectedYear;
						
					});

				/*	sap.ui.getCore().setModel(oResults, "SeriesCmbo");
					var oJsonModelVLS2 = new sap.ui.model.json.JSONModel(oResults);
					that.getView().byId("SeriesCmbo").setModel(oJsonModelVLS2);*/

					sap.ui.getCore().setModel(Oresult,"McCmboSuffCmbo");
					
					var oJsonModelVLS = new sap.ui.model.json.JSONModel(Oresult);
					that.getView().byId("McCmbo").setModel(oJsonModelVLS);
					that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);

				},
				function(oError) {

				});

		},

		OnYearChange: function() {

			/*	debugger;
        $(".IdYearPicker").IdYearPicker({
            changeMonth: true,
            changeYear: true,
            showButtonPanel: true,
            maxDate: '2017',
            minDate: '2019'
        });*/
		}

		/*OnYearChange: function()
		{
			debugger;
		 	
			
			
		}*/

	});
});