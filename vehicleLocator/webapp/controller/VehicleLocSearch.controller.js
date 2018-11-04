sap.ui.define([
	/*"sap/ui/core/mvc/Controller"*/
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleLocSearch", {

		onInit: function () {
			debugger;
			/*-------------afterrendering code----------------*/

			/*	var that = this;
				that._oViewModel = new sap.ui.model.json.JSONModel();

				that._oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle(); // instantiate the resource 

				

				that.oDataUrl = "https://tcid1gwapp1.tci.internal.toyota.ca:44300/sap/opu/odata/sap/Z_VEHICLE_CATALOGUE_SRV";

				var oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
				oDataModel.setHeaders({
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest",
					"DataServiceVersion": "2.0",
					"Accept": "application/json",
					"Method": "GET"
				});
				var BatchUrl = [];
				BatchUrl.push(oDataModel.createBatchOperation("/ZC_MODEL_DETAILS", "GET"));
				BatchUrl.push(oDataModel.createBatchOperation("/zc_exterior_trim", "GET"));

				oDataModel.addBatchReadOperations(BatchUrl);
				oDataModel.setUseBatch(true);
				oDataModel.submitBatch(function(oData, oResponse) {
					var Data = oData.__batchResponses[0].data.results;
					var Data2 = oData.__batchResponses[1].data.results;
					sap.ui.getCore().setModel(Data, "McCmboSuffCmbo");
					that.oJsonModelVLS = new sap.ui.model.json.JSONModel(Data);
					
					sap.ui.getCore().setModel(Data2, "McCmboSuffCmbo2");
					that.oJsonModelVLS2 = new sap.ui.model.json.JSONModel(Data2);

					that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS);
					that.getView().byId("McCmbo").setModel(that.oJsonModelVLS);

				}, function(err) {

				});*/

			/*-------------afterrendering code----------------*/

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
			this.bindMonthYear();
		},
		onAfterRendering: function () {
			debugger;
			var that = this;
			that._oViewModel = new sap.ui.model.json.JSONModel();

			that._oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle(); // instantiate the resource 

			/*	that.oDataUrl = "https://tcid1gwapp1.tci.internal.toyota.ca:44300/sap/opu/odata/sap/Z_VEHICLE_CATALOGUE_SRV";*/
			that.oDataUrl = "https://vehiclelocator_node.cfapps.us10.hana.ondemand.com/node/Z_VEHICLE_CATALOGUE_SRV";
			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var a = new Date();

			that.oSelectedYear = a.getFullYear().toString();
			that.oDataModel.read("/ZC_MODEL_DETAILS?$filter= Modelyear eq '" + that.oSelectedYear, "anisetc", "anisetc", false,

				function (oData) {
					if (oData != undefined) {
						var oResults = oData.results;

						sap.ui.getCore().setModel(oResults, "McCmboSuffCmbo2");
						var oResults = oResults.filter(function (x) {
							return x.Modelyear == that.oSelectedYear;

						});
						var obj = {};
						for (var i = 0, len = oResults.length; i < len; i++)
							obj[oResults[i]['TCISeries']] = oResults[i];
						oResults = new Array();
						for (var key in obj)
							oResults.push(obj[key]);
						that.oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);

						that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS);
					}
				},
				function (oData) {
					alert("Failed to get the Data");
				});
			/*that.oDataModel.read("/zc_exterior_trim", "anisetc", "anisetc", false,

				function (oData) {
					if (oData != undefined) {
						var oResults = oData.results;
						sap.ui.getCore().setModel(oResults, "McCmboSuffCmbo2");
						that.oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);

						that.getView().byId("McCmbo").setModel(that.oJsonModelVLS);
					}
				},
				function (oData) {
					alert("Failed to get Data");
				});*/
			/*oDataModel.setHeaders({
					"Content-Type": "application/json",
					"X-Requested-With": "XMLHttpRequest",
					"DataServiceVersion": "2.0",
					"Accept": "application/json",
					"Method": "",
					"X-CSRF-TOKEN": "Fetch"
				});
				var BatchUrl = [];
				BatchUrl.push(oDataModel.createBatchOperation("/ZC_MODEL_DETAILS", "POST"));
				BatchUrl.push(oDataModel.createBatchOperation("/zc_exterior_trim", "POST"));
			
			
			

				oDataModel.addBatchReadOperations(BatchUrl);
				oDataModel.setUseBatch(true);
				oDataModel.submitBatch(function(oData, oResponse) {
					var Data = oData.__batchResponses[0].data.results;
					var Data2 = oData.__batchResponses[1].data.results;
					sap.ui.getCore().setModel(Data, "McCmboSuffCmbo");
					that.oJsonModelVLS = new sap.ui.model.json.JSONModel(Data);
					sap.ui.getCore().setModel(Data2, "McCmboSuffCmbo2");
					that.oJsonModelVLS2 = new sap.ui.model.json.JSONModel(Data2);

					that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS);
					that.getView().byId("McCmbo").setModel(that.oJsonModelVLS);*/

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

			/*	}, function(err) {
				

				});*/

		},

		SeriesClickedVLS11: function (oEvent) {
			debugger;

			var that = this;

			that.oSelectedYear = that.getView().byId("MoyearCombo").getSelectedKey();

			that.oSelectedSeries = that.getView().byId("SeriesCmbo").getSelectedItem().getText();

			that.oDataUrl = "https://vehiclelocator_node.cfapps.us10.hana.ondemand.com/node/Z_VEHICLE_CATALOGUE_SRV";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

			that.oDataModel.read("/ZC_MODEL_DETAILS?$filter= Modelyear eq '" + that.oSelectedYear + "' and TCISeries eq '" + that.oSelectedSeries +
				"'", "anisetc", "anisetc", false,

				function (oData) {

					var oResults = oData.results;
					var oResults = oResults.filter(function (x) {
						return (x.Modelyear == that.oSelectedYear && x.TCISeries == that.oSelectedSeries);

					});
					var obj = {};
					for (var i = 0, len = oResults.length; i < len; i++)
						obj[oResults[i]['Model']] = oResults[i];
					oResults = new Array();
					for (var key in obj)
						oResults.push(obj[key]);

					var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
					that.getView().byId("McCmbo").setModel(oJsonModelVLS);

				});

		},

		/*	SeriesClickedVLS11: function (oEvent) {
				debugger;

				var that = this;

				that.oSelectedYear = that.getView().byId("MoyearCombo").getSelectedItem().getText();

				that.oSelectedSeries = that.getView().byId("SeriesCmbo").getSelectedItem().getText();

				that.oDataUrl = "https://vehiclelocator_node.cfapps.us10.hana.ondemand.com/node/Z_VEHICLE_CATALOGUE_SRV";

				that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

				that.oDataModel.read("/ZC_MODEL_DETAILS?$filter= Modelyear eq '" + that.oSelectedYear + "' and TCISeries eq '" + that.oSelectedSeries +
					"'", "anisetc", "anisetc", false,

					function (oData) {

						var oResults = oData.results;

						var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
						that.getView().byId("McCmbo").setModel(oJsonModelVLS);

					},

				});

		},*/

		MCClickedVLS11: function ()

		{
			debugger;

			var that = this;

			that.oSelectedYear = that.getView().byId("MoyearCombo").getSelectedKey();

			that.oSelectedSeries = that.getView().byId("SeriesCmbo").getSelectedItem().getText();

			that.oSelectedModel = that.getView().byId("McCmbo").getSelectedItem().getText();

			that.oDataUrl = "https://vehiclelocator_node.cfapps.us10.hana.ondemand.com/node/Z_VEHICLE_CATALOGUE_SRV";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

			/*	that.oDataModel.read("/ZC_MODEL_DETAILS?$filter= Modelyear eq '" + that.oSelectedYear + "' and TCISeries eq '" + that.oSelectedSeries + "' and Model eq '" + that.oSelectedModel +
					"'", "anisetc", "anisetc", false,*/
			that.oDataModel.read("/zc_exterior_trim?$filter= ModelYear eq '" + that.oSelectedYear + "' and TCISeries eq '" + that.oSelectedSeries +
				"' and Model eq '" + that.oSelectedModel.split("-")[0].trim() +
				"'", "anisetc", "anisetc", false,

				/*that.oDataModel.read("/zc_configuration?$filter= ModelYear eq '" + this.oSufModelYear +  "' and Model eq '" + that.oSelectedModel +
			"' and Suffix eq '" + oSufModel +	"'", "anisetc", "anisetc", false,	*/

				function (oData) {

					var oResults = oData.results;
					var oResults = oResults.filter(function (x) {
						return (x.ModelYear == that.oSelectedYear && x.Model == (that.oSelectedModel.split("-")[0]).trim());

					});
					that.Fullurls = oResults;
					/*	this.oSufModelYear = oResults[0].ModelYear;
						this.oSufTCISeries = oResults[0].TCISeries;
						this.oSufModel = oResults[0].Model;*/
					var SufixDescription = that.SuffixDescription(oResults);
					for (var a = 0; a < that.Fullurls.length; a++) {
						for (var b = 0; b < SufixDescription.length; b++) {

							if (that.Fullurls[a].Suffix == SufixDescription[b].Suffix) {
								that.Fullurls[a].SuffixDescriptionEN = SufixDescription[b].SuffixDescriptionEN;
								that.Fullurls[a].SuffixDescriptionFR = SufixDescription[b].SuffixDescriptionFR;

							}
						}

					}
					var obj = {};
					for (var i = 0, len = that.Fullurls.length; i < len; i++)
						obj[that.Fullurls[i]['Suffix']] = that.Fullurls[i];
					that.Fullurls = new Array();
					for (var key in obj)
						that.Fullurls.push(obj[key]);
					var oJsonModelVLS = new sap.ui.model.json.JSONModel(that.Fullurls);
					that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);
					/*	var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
						that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);*/

				});

			/*	that.oDataModel.read("/zc_configuration?$filter= ModelYear eq '" + that.oSelectedYear + "' and TCISeries eq '" + that.oSelectedSeries + "' and Model eq '" + that.oSelectedModel +
						"' and SuffixDescriptionEN eq '" + that.oSelectedSeries +	"'", "anisetc", "anisetc", false,
					
				
							function(oData) {

								var oResults = oData.results;
			                   
							

							});*/

		},
		SuffixDescription: function (Data) {
			var that = this;
			that.SuffixDesc = [];
			var oResults = Data;
			oResults.sort(function (a, b) {
				return a.Model - b.Model;
			});
			var obj = {};
			for (var i = 0, len = oResults.length; i < len; i++)
				obj[oResults[i]['Suffix']] = oResults[i];
			oResults = new Array();
			for (var key in obj)
				oResults.push(obj[key]);
			that.oDataUrl = "https://vehiclelocator_node.cfapps.us10.hana.ondemand.com/node/Z_VEHICLE_CATALOGUE_SRV";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			for (var i = 0; i < oResults.length; i++) {

				that.oDataModel.read("/zc_configuration?$filter= ModelYear eq '" + oResults[i].ModelYear + "' and Model eq '" + oResults[i].Model +
					"' and Suffix eq '" + oResults[i].Suffix + "'", "anisetc", "anisetc", false,

					function (oData) {

						var oResults = oData.results[0];
						if (oResults != undefined) {
							that.SuffixDesc.push(oResults);

						}

						/*var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
					that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);*/
						/*	this.oSufModelYear = oResults[0].ModelYear;
							this.oSufTCISeries = oResults[0].TCISeries;
							this.oSufModel = oResults[0].Model;*/
						/*	that.SuffixDescription(oResults);
							
							var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
							that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);*/

					});

			}

			return that.SuffixDesc;
		},

		/*	onSePress: function() {
			debugger;
			var that = this;
			
			
			
			
*/
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

		/*	this.getRouter().navTo("VehicleSearcResults", {*/
		/*	Selecteddata :  res*/

		/*	});*/

		/*	},*/

		ItemClickedVLS: function (oEvent) {
			debugger;
			var that = this;

			that.getView().byId("McCmbo").setValue("");
			that.getView().byId("SuffCmbo").setValue("");
			/*sap.ui.getCore().getModel("McCmbo").setValue("");*/

			that.oSelectedYear = that.getView().byId("MoyearCombo").getSelectedKey();
			that.oDataUrl = "https://vehiclelocator_node.cfapps.us10.hana.ondemand.com/node/Z_VEHICLE_CATALOGUE_SRV";
			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

			that.oDataModel.read("/ZC_MODEL_DETAILS?$filter= Modelyear eq '" + that.oSelectedYear, "anisetc", "anisetc", false,

				function (oData) {
					if (oData != undefined) {
						var oResults = oData.results;

						//	sap.ui.getCore().setModel(oResults, "McCmboSuffCmbo2");
						var oResults = oResults.filter(function (x) {
							return x.Modelyear == that.oSelectedYear;

						});
						var obj = {};
						for (var i = 0, len = oResults.length; i < len; i++)
							obj[oResults[i]['TCISeries']] = oResults[i];
						oResults = new Array();
						for (var key in obj)
							oResults.push(obj[key]);
						that.oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);

						that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS);
					}
				},
				function (oData) {
					alert("Failed to get the Data");
				});
			/*	sap.ui.getCore().getModel("McCmboSuffCmbo");
				if (sap.ui.getCore().getModel("McCmboSuffCmbo") != undefined) {
					var oResult = sap.ui.getCore().getModel("McCmboSuffCmbo");
					var oResult1 = oResult.filter(function (x) {
						return x.Modelyear == that.oSelectedYear;

					});
					that.oJsonModelVLS = new sap.ui.model.json.JSONModel(oResult1);

					that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS);*/

		},
		bindMonthYear: function () {
			var d = new Date();
			var Monthdata = [{
				"month": "January",
				"key": 0
			}, {
				"month": "February",
				"key": 1
			}, {
				"month": "March",
				"key": 2
			}, {
				"month": "April",
				"key": 3
			}, {
				"month": "May",
				"key": 4
			}, {
				"month": "June",
				"key": 5
			}, {
				"month": "July",
				"key": 6
			}, {
				"month": "August",
				"key": 7
			}, {
				"month": "September",
				"key": 8
			}, {
				"month": "October",
				"key": 9
			}, {
				"month": "November",
				"key": 10
			}, {
				"month": "December",
				"key": 11
			}];

			var yeararray = [];
			var n = (d.getFullYear()) + 1;
			for (var i = 0; i < 4; i++) {
				var obj = {};
				obj.year = n - i;
				yeararray.push(obj);
			}
			var yearmodel = new sap.ui.model.json.JSONModel();
			yearmodel.setData(yeararray);
			this.getView().byId("MoyearCombo").setModel(yearmodel);
			this.getView().byId("MoyearCombo").setSelectedKey(d.getFullYear());
			this.getView().byId("MoyearCombo").setSelectedItem(d.getFullYear())
		},

		//	}

		/*onModleCodeClick: function (oEvent) {
			var oSelectedItems = oEvent.oSource.getSelectedItem().getBindingContext().getObject();

		}*/

	});
});