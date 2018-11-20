sap.ui.define([
	/*"sap/ui/core/mvc/Controller"*/

	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageBox',
	"sap/ui/core/routing/History"
], function (BaseController, ResourceModel, JSONModel, MessageBox, History) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleLocSearch", {

		onInit: function () {
			debugger;
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
				// set the right image for logo  - french       
				/*              var currentImageSource = this.getView().byId("idLexusLogo");
				                currentImageSource.setProperty("src", "images/Lexus_FR.png");*/
			} else {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")
				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';
				// set the right image for logo         
				/*              var currentImageSource = this.getView().byId("idLexusLogo");
				                currentImageSource.setProperty("src", "images/Lexus_EN.png");*/
			}

			this.getView().byId("SeriesCmbo").setFilterFunction(function (sTerm, oItem) {
				// A case-insensitive 'string contains' filter
				return oItem.getText().match(new RegExp("^" + sTerm, "i")) || oItem.getKey().match(new RegExp("^" + sTerm, "i"));
			});
			this.getView().byId("McCmbo").setFilterFunction(function (sTerm, oItem) {
				// A case-insensitive 'string contains' filter
				return oItem.getText().match(new RegExp("^" + sTerm, "i")) || oItem.getKey().match(new RegExp("^" + sTerm, "i"));
			});
			this.getView().byId("SuffCmbo").setFilterFunction(function (sTerm, oItem) {
				// A case-insensitive 'string contains' filter
				return oItem.getText().match(new RegExp("^" + sTerm, "i")) || oItem.getKey().match(new RegExp("^" + sTerm, "i"));
			});
			sap.ui.core.BusyIndicator.show();
			/*	this.BusyDialog = new sap.m.BusyDialog("CrtNotifbusyDialog_Text11467", {
					text: ''
				});
				this.BusyDialog.open();*/
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
			var comBoboxName = this.getView().byId("MoyearCombo");
			var MoyearComboId = (this.getView().byId("MoyearCombo").getId()) + "-inner"
			comBoboxName.onAfterRendering = function () {

				if (sap.m.ComboBox.prototype.onAfterRendering) {

					sap.m.ComboBox.prototype.onAfterRendering.apply(this);

				}

				document.getElementById(MoyearComboId).disabled = true;

			}
			that._oViewModel = new sap.ui.model.json.JSONModel();
			that.getView().byId("SeriesCmbo").setSelectedKey("");
			//	 that.getView().byId("SeriesCmbo").setSelectedItem("");
			that.getView().byId("McCmbo").setSelectedKey("");
			that.getView().byId("SuffCmbo").setSelectedKey("");
			that._oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle(); // instantiate the resource 

			/*	that.oDataUrl = "https://tcid1gwapp1.tci.internal.toyota.ca:44300/sap/opu/odata/sap/Z_VEHICLE_CATALOGUE_SRV";*/
			//	that.oDataUrl = "/vehicleLocatorNode/node/Z_VEHICLE_CATALOGUE_SRV";

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var SeriesUrl = that.oDataUrl + "/ZC_MODEL_DETAILS"
			var ajax1 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},

				beforeSend: function (request) {
					request.setRequestHeader('Authorization', 'Basic ' + btoa('anisetc:anisetc'));
				},
				url: SeriesUrl,
				async: true,
				success: function (result) {}
			});
			var SeriesDes = that.oDataUrl + "/zc_mmfields"
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
				url: SeriesDes,
				async: true,
				success: function (result) {}
			});
			var Suffix = that.oDataUrl + "/zc_configuration"
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
				url: Suffix,
				async: true,
				success: function (result) {}
			});
			var SuffixInteriorDesc = that.oDataUrl + "/zc_exterior_trim"
			var ajax4 = $.ajax({
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
				url: SuffixInteriorDesc,
				async: true,
				success: function (result) {}
			});
			//}
			$.when(ajax1, ajax2, ajax3, ajax4).done(function (SeriesUrl, SeriesDes, Suffix, SuffixInteriorDesc) {
				var SeriesUrl = SeriesUrl[0].d.results
				var SeriesModel = new sap.ui.model.json.JSONModel(SeriesUrl)
				sap.ui.getCore().setModel(SeriesModel, "SeriesModel");
				var SeriesDes = SeriesDes[0].d.results;

				var SeriesDesModel = new sap.ui.model.json.JSONModel(SeriesDes)
				sap.ui.getCore().setModel(SeriesDesModel, "SeriesDesModel");
				var SelYear = new Date().getFullYear().toString()
				that.SeriesBinding(SelYear);
				var SuffixInteriorDesc = SuffixInteriorDesc[0].d.results;
				var SuffixDescModel = new sap.ui.model.json.JSONModel(SuffixInteriorDesc)
				sap.ui.getCore().setModel(SuffixDescModel, "SuffixInteriorDesc");
				var Suffix = Suffix[0].d.results;
				var SuffixModel = new sap.ui.model.json.JSONModel(Suffix)
				sap.ui.getCore().setModel(SuffixModel, "SuffixModel");
				/*	that.BusyDialog.close();*/
				sap.ui.core.BusyIndicator.hide();
			});
			var a = new Date();

			/*	that.oSelectedYear = a.getFullYear().toString();
				that.oDataModel.read("/ZC_MODEL_DETAILS", "anisetc", "anisetc", false,
				
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
							that.Fullurls = oResults;
							var SeriesDescription = that.SeriesDescription(oResults);
							if (SeriesDescription.length != 0) {
								for (var a = 0; a < that.Fullurls.length; a++) {
									for (var b = 0; b < SeriesDescription.length; b++) {

										if (that.Fullurls[a].TCISeries == SeriesDescription[b].ModelSeriesNo) {
											that.Fullurls[a].TCISeriesDescriptionEN = SeriesDescription[b].TCISeriesDescriptionEN;
											that.Fullurls[a].TCISeriesDescriptionFR = SeriesDescription[b].TCISeriesDescriptionFR;

										}
									}

								}
							} else {
								for (var i = 0; i < that.Fullurls.length; i++) {
									that.Fullurls.TCISeriesDescriptionEN = "";
									that.Fullurls.TCISeriesDescriptionFR = "";
								}
							}*/
			/*	var obj = {};
				for (var i = 0, len = that.Fullurls.length; i < len; i++)
					obj[that.Fullurls[i]['Suffix']] = that.Fullurls[i];
				that.Fullurls = new Array();
				for (var key in obj)
					that.Fullurls.push(obj[key]);*/

			/*	var oJsonModelVLS = new sap.ui.model.json.JSONModel(that.Fullurls);
				that.getView().byId("SeriesCmbo").setModel(oJsonModelVLS);*/
			//	that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);
			//	that.oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);

			//	that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS);
			/*	}
			},*/
			/*	function (oData) {
					alert("Failed to get the Data");
				});*/
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
		SeriesBinding: function (SelectedYear) {
			var that = this;
			if (sap.ui.getCore().getModel("SeriesModel") != undefined) {

				var oResults = sap.ui.getCore().getModel("SeriesModel").getData();
				that.oSelectedYear = SelectedYear;
				var oResults = oResults.filter(function (x) {
					return x.Modelyear == that.oSelectedYear;

				});
				var obj = {};
				for (var i = 0, len = oResults.length; i < len; i++)
					obj[oResults[i]['TCISeries']] = oResults[i];
				oResults = new Array();
				for (var key in obj)
					oResults.push(obj[key]);
				that.Fullurls = oResults;
				var SeriesDescription = that.SeriesDescription(oResults);
				if (SeriesDescription.length != 0) {
					for (var a = 0; a < that.Fullurls.length; a++) {
						for (var b = 0; b < SeriesDescription.length; b++) {

							if (that.Fullurls[a].TCISeries == SeriesDescription[b].ModelSeriesNo) {
								that.Fullurls[a].TCISeriesDescriptionEN = SeriesDescription[b].TCISeriesDescriptionEN;
								that.Fullurls[a].TCISeriesDescriptionFR = SeriesDescription[b].TCISeriesDescriptionFR;

							}
						}

					}
				} else {
					for (var i = 0; i < that.Fullurls.length; i++) {
						that.Fullurls.TCISeriesDescriptionEN = "";
						that.Fullurls.TCISeriesDescriptionFR = "";
					}
				}
				/*	var obj = {};
						for (var i = 0, len = that.Fullurls.length; i < len; i++)
							obj[that.Fullurls[i]['Suffix']] = that.Fullurls[i];
						that.Fullurls = new Array();
						for (var key in obj)
							that.Fullurls.push(obj[key]);*/

				var SeriesModel = new sap.ui.model.json.JSONModel(that.Fullurls);
				that.getView().setModel(SeriesModel, "SeriesData");

			}
		},
		SeriesClickedVLS11: function (oEvent) {
			debugger;

			var that = this;
			that.oJsonModelVLS = new sap.ui.model.json.JSONModel([]);
			that.getView().byId("McCmbo").setSelectedKey()
			that.getView().byId("SuffCmbo").setSelectedKey()
			that.getView().setModel(that.oJsonModelVLS, "Suffix");
			that.getView().setModel(that.oJsonModelVLS, "ModelCode");
			that.getView().byId("Pacific").setSelected(false)
			that.getView().byId("Prairie").setSelected(false)
			that.getView().byId("Central").setSelected(false)
			that.getView().byId("Atlantic").setSelected(false)
			that.getView().byId("Quebec").setSelected(false)

			/* that.getView().byId("McCmbo").setModel(oJsonModelVLSEmty);
			  that.getView().byId("SuffCmbo").setModel(oJsonModelVLSEmty);*/

			that.oSelectedYear = that.getView().byId("MoyearCombo").getSelectedKey();
			that.SelectedSeriesPath = "SeriesSelected";
			/*  that.SelectedSeriesPath= oEvent.getSource().oModels.undefined.mContexts["/0"].sPath.split("/")[1]*/
			that.oSelectedSeries = that.getView().byId("SeriesCmbo").getSelectedKey();
			if (that.oSelectedSeries != "" && sap.ui.getCore().getModel("SeriesDesModel") != undefined) {

				var oResults = sap.ui.getCore().getModel("SeriesModel").getData();
				var oResults = oResults.filter(function (x) {
					return (x.Modelyear == that.oSelectedYear && x.TCISeries == that.oSelectedSeries);

				});
				var obj = {};
				for (var i = 0, len = oResults.length; i < len; i++)
					obj[oResults[i]['Model']] = oResults[i];
				oResults = new Array();
				for (var key in obj)
					oResults.push(obj[key]);

				/*	oResults.Modelyear;
					oResults.TCISeries;
					oResults.Model;
					oResults.Suffix;*/

				var ModelCode = new sap.ui.model.json.JSONModel(oResults);
				that.getView().setModel(ModelCode, "ModelCode");

			}
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

			var that = this;
			that.oJsonModelVLS = new sap.ui.model.json.JSONModel([]);
			that.getView().setModel(that.oJsonModelVLS, "Suffix");

			that.oSelectedYear = that.getView().byId("MoyearCombo").getSelectedKey();

			that.oSelectedModel = that.getView().byId("McCmbo").getSelectedKey();

			that.getView().byId("Pacific").setSelected(false)
			that.getView().byId("Prairie").setSelected(false)
			that.getView().byId("Central").setSelected(false)
			that.getView().byId("Atlantic").setSelected(false)
			that.getView().byId("Quebec").setSelected(false)
				//	that.getView().byId("McCmbo").setSelectedKey(that.oSelectedModel);
				//	that.oDataUrl = "https://vehiclelocator_node.cfapps.us10.hana.ondemand.com/node/Z_VEHICLE_CATALOGUE_SRV";

			//	that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

			if (that.oSelectedModel != "" && sap.ui.getCore().getModel("SuffixModel") != undefined) {

				var oResults = sap.ui.getCore().getModel("SuffixModel").getData();
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
							that.Fullurls[a].MarktgIntDescEN = SufixDescription[b].MarktgIntDescEN;
							that.Fullurls[a].MarktgIntDescFR = SufixDescription[b].MarktgIntDescFR;

						}
					}

				}
				var obj = {};
				for (var i = 0, len = that.Fullurls.length; i < len; i++)
					obj[that.Fullurls[i]['Suffix']] = that.Fullurls[i];
				that.Fullurls = new Array();
				for (var key in obj)
					that.Fullurls.push(obj[key]);
				var Suffix = new sap.ui.model.json.JSONModel(that.Fullurls);
				that.getView().setModel(Suffix, "Suffix");
				/*	var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
					that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);*/

			}

		},
		SuffixDescription: function (Data) {
			var that = this;

			if (sap.ui.getCore().getModel("SuffixInteriorDesc") != undefined) {
				that.SuffixDesc = sap.ui.getCore().getModel("SuffixInteriorDesc").getData()

			} else {
				that.SuffixDesc = [];
			}

			return that.SuffixDesc;
		},

		SeriesDescription: function (Data) {
			var that = this;

			if (sap.ui.getCore().getModel("SeriesDesModel") != undefined) {
				var oResults = sap.ui.getCore().getModel("SeriesDesModel").getData();

				that.SeriesDesc = oResults;
			} else {
				that.SeriesDesc = [];
			}

			//	}

			/*var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
					that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);*/
			/*	this.oSufModelYear = oResults[0].ModelYear;
				this.oSufTCISeries = oResults[0].TCISeries;
				this.oSufModel = oResults[0].Model;*/
			/*	that.SuffixDescription(oResults);
				
				var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
				that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);*/

			return that.SeriesDesc;
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

		/*	this.getRouter()
		.navTo("VehicleSearcResults", {*/
		/*	Selecteddata :  res*/

		/*	});*/

		/*	},*/

		ItemClickedVLS: function (oEvent) {
			debugger;
			var that = this;
			/*var Array = [];*/
			that.oJsonModelVLS = new sap.ui.model.json.JSONModel([]);
			/*	that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS);
				that.getView().byId("McCmbo").setModel(that.oJsonModelVLS);
				that.getView().byId("SuffCmbo").setModel(that.oJsonModelVLS);*/
			that.getView().setModel(that.oJsonModelVLS, "Suffix");
			that.getView().setModel(that.oJsonModelVLS, "SeriesData");
			that.getView().setModel(that.oJsonModelVLS, "ModelCode");
			that.getView().byId("McCmbo").setValue("");
			that.getView().byId("SuffCmbo").setValue("");
			that.getView().byId("SeriesCmbo").setSelectedKey("");
			//	 that.getView().byId("SeriesCmbo").setSelectedItem("");
			that.getView().byId("McCmbo").setSelectedKey("");

			that.oSelectedYear = that.getView().byId("MoyearCombo").getSelectedKey();
			that.getView().byId("Pacific").setSelected(false)
			that.getView().byId("Prairie").setSelected(false)
			that.getView().byId("Central").setSelected(false)
			that.getView().byId("Atlantic").setSelected(false)
			that.getView().byId("Quebec").setSelected(false)

			that.SeriesBinding(that.oSelectedYear);

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
		onBeforeRendering: function () {
			var that = this;
			//Event for Showing message on selection of Workcenter without Plant
			that.getView().byId("McCmbo").attachBrowserEvent("click",
				function () {
					var SeriesCmbo = that.getView().byId("SeriesCmbo").getSelectedKey();
					if (SeriesCmbo == "") {
						sap.m.MessageBox.warning("Please select Series");
						return
					}
				});
			that.getView().byId("SuffCmbo").attachBrowserEvent("click",
				function () {
					var McCmbo = that.getView().byId("McCmbo").getSelectedKey();
					var SeriesCmbo = that.getView().byId("SeriesCmbo").getSelectedKey();
					if (SeriesCmbo == "") {
						sap.m.MessageBox.warning("Please select Series");
						return
					} else if (McCmbo == "") {
						sap.m.MessageBox.warning("Please select Model Code");
						return
					}
				});
			//  that.getView().byId("SuffCmbo").setSelectedKey("");
		},

		onSePress: function () {
			debugger

			var that = this;
			var MoyearCombo = that.getView().byId("MoyearCombo").getSelectedKey();
			var SeriesCmbo = that.getView().byId("SeriesCmbo").getSelectedKey();
			//	var oSeries = that.getView().byId("SeriesCmbo").getSelectedKey();
			var McCmbo = that.getView().byId("McCmbo").getSelectedKey();
			//	var oMcCmbo  = that.getView().byId("McCmbo").getSelectedKey();
			var SuffCmbo = that.getView().byId("SuffCmbo").getSelectedKey();
			//	var suffix = that.getView().byId("SuffCmbo").getSelectedKey();

			/*var vZone = that.getView().byId("Pacific").getSelected();*/

			if (MoyearCombo == "" || MoyearCombo == undefined || MoyearCombo == null) {
				//	sap.m.MessageBox.error("Please select ModelYear");
				that.getView().byId("MoyearCombo").setValueState("Error");
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
				return;
			} else {
				that.getView().byId("MoyearCombo").setValueState("None");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", false);
			}

			if (SeriesCmbo == "" || SeriesCmbo == undefined || SeriesCmbo == null) {
				//	sap.m.MessageBox.error("Please select Series");
				that.getView().byId("SeriesCmbo").setValueState("Error");
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
				return;
			} else {
				that.getView().byId("SeriesCmbo").setValueState("None");
				//	that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", false);
			}
			if (McCmbo == "" || McCmbo == undefined || McCmbo == null) {
				//	sap.m.MessageBox.error("Please select Model");

				that.getView().byId("McCmbo").setValueState("Error");
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
				return;

			} else {
				that.getView().byId("McCmbo").setValueState("None");
				//	that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", false);
			}

			if (SuffCmbo == "" || SuffCmbo == undefined || SuffCmbo == null) {
				//	sap.m.MessageBox.error("Please select Suffix");

				that.getView().byId("SuffCmbo").setValueState("Error");
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
				return;
			} else {
				//	that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields");
				that.getView().byId("SuffCmbo").setValueState("None");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", false);
			}
			if (that.getView().byId("Pacific").getSelected() == false && that.getView().byId("Prairie").getSelected() == false && that.getView()
				.byId("Central").getSelected() == false && that.getView().byId("Atlantic").getSelected() == false && that.getView().byId("Quebec")
				.getSelected() == false) {
				//	sap.m.MessageBox.error("Please select Zone");
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
				return;
			} else {
				//	that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", false);

			}

			function validateVin(vin) {
				var re = new RegExp("^[A-HJ-NPR-Z\\d]{8}[\\dX][A-HJ-NPR-Z\\d]{2}\\d{6}$");
				return vin.match(re);
			}

			/*	this.getRouter().navTo("VehicleSearcResults");*/
			/*, {
			     from: "VehicleLocSearch",
				 moyearc : MoyearCombo,
				 Seriesco: SeriesCmbo,
				 modelcomb: McCmbo,
				 suffixcom: SuffCmbo

			}*/
			var SelectedZone = [];
			var obj = {};
			if (that.getView().byId("Pacific").getSelected() == true) {
				obj.moyearc = MoyearCombo;
				obj.Seriesco = SeriesCmbo;
				obj.modelcomb = McCmbo;
				obj.suffixcom = SuffCmbo;
				obj.Zone = that.getView().byId("Pacific").getProperty("text");
				SelectedZone.push(obj)
			}
			if (that.getView().byId("Prairie").getSelected() == true) {
				obj.moyearc = MoyearCombo;
				obj.Seriesco = SeriesCmbo;
				obj.modelcomb = McCmbo;
				obj.suffixcom = SuffCmbo;
				obj.Zone = that.getView().byId("Prairie").getProperty("text");
				SelectedZone.push(obj)
			}
			if (that.getView().byId("Central").getSelected() == true) {
				obj.moyearc = MoyearCombo;
				obj.Seriesco = SeriesCmbo;
				obj.modelcomb = McCmbo;
				obj.suffixcom = SuffCmbo;
				obj.Zone = that.getView().byId("Central").getProperty("text");
				SelectedZone.push(obj)
			}
			if (that.getView().byId("Quebec").getSelected() == true) {
				obj.moyearc = MoyearCombo;
				obj.Seriesco = SeriesCmbo;
				obj.modelcomb = McCmbo;
				obj.suffixcom = SuffCmbo;
				obj.Zone = that.getView().byId("Quebec").getProperty("text");
				SelectedZone.push(obj)
			}
			if (that.getView().byId("Atlantic").getSelected() == true) {
				var obj1 = {};
				obj1.moyearc = MoyearCombo;
				obj1.Seriesco = SeriesCmbo;
				obj1.modelcomb = McCmbo;
				obj1.suffixcom = SuffCmbo;
				obj1.Zone = that.getView().byId("Atlantic").getProperty("text");
			
				SelectedZone.push(obj1)
			}
			/*this.getRouter().navTo("VehicleSearcResults");*/

			this.getRouter().navTo("VehicleSearcResults" 
			/*	Details: JSON.stringify(obj)*/
			);

			/*	this.getRouter().navTo("VehicleSearcResults"{
		 obj : SelectedZone[];
		
			
		});*/

			/*from: "VehicleLocSearch",
			 moyearc : MoyearCombo,
			 Seriesco: SeriesCmbo,
			 modelcomb: McCmbo,
			 suffixcom: SuffCmbo*/

			//	that.getView().byId("Atlantic").getSelected() == false	

			/*	this.getRouter().navTo("VehicleSearcResults");*/
			/* var object = {};*/

		},
		handleSeriesChange: function (oEvent) {
			var that = this;

			var combo_Id = this.getView().byId("SeriesCmbo");
			var combo_IdKey = this.getView().byId("SeriesCmbo").getSelectedKey();
			var allItem = combo_Id.getItems();
			var arr = [];
			var value = combo_Id.getValue().trim();
			for (var i = 0; i < allItem.length; i++) {
				arr.push(allItem[i].getText())
			}
			if (arr.indexOf(value) < 0 && combo_IdKey == "") {
				combo_Id.setValueState("Error")
				combo_Id.setValue();
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
			} else {
				combo_Id.setValueState("None");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", false);
			}
		},
		handleModelChange: function () {
			var combo_Id = this.getView().byId("McCmbo");
			var combo_IdSel = this.getView().byId("McCmbo").getSelectedKey();
			var allItem = combo_Id.getItems();
			var arr = [];
			var value = combo_Id.getValue().trim();
			for (var i = 0; i < allItem.length; i++) {
				arr.push(allItem[i].getText())
			}
			var that = this;
			if (arr.indexOf(value) < 0 && combo_IdSel == "") {
				combo_Id.setValueState("Error")
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
				combo_Id.setValue();
			} else {
				combo_Id.setValueState("None");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", false);
			}
		},
		handleSuffixChange: function () {
			var combo_Id = this.getView().byId("SuffCmbo");
			var combo_IdSel = this.getView().byId("SuffCmbo").getSelectedKey();
			var allItem = combo_Id.getItems();
			var arr = [];
			var value = combo_Id.getValue().trim();
			for (var i = 0; i < allItem.length; i++) {
				arr.push(allItem[i].getText())
			}
			var that = this;
			if (arr.indexOf(value) < 0 && combo_IdSel == "") {
				combo_Id.setValueState("Error")
				combo_Id.setValue();
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
			} else {
				combo_Id.setValueState("None")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", false);
			}
		},
		SufficClickedVLS11: function () {
				var that = this;
				that.getView().byId("Pacific").setSelected(false)
				that.getView().byId("Prairie").setSelected(false)
				that.getView().byId("Central").setSelected(false)
				that.getView().byId("Atlantic").setSelected(false)
				that.getView().byId("Quebec").setSelected(false)

			}
			//	}

		/*onModleCodeClick: function (oEvent) {
			var oSelectedItems = oEvent.oSource.getSelectedItem().getBindingContext().getObject();

		}*/

	});
});