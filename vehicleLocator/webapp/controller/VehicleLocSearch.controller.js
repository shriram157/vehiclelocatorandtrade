var selectedSuffix;
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

		

			// ========================================== integrating security ==========================================Begin

			//======================================================================================================================//			
			//  on init method,  get the token attributes and authentication details to the UI from node layer.  - begin
			//======================================================================================================================//		


			// the business partner oData calls should happen onit.
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode"; // the destination
				this.attributeUrl = "/userDetails/attributesforlocaltesting";
				this.currentScopeUrl = "/userDetails/currentScopesForUserLocaltesting";
			} else {
				this.sPrefix = "";
				this.attributeUrl = "/userDetails/attributes";

				this.currentScopeUrl = "/userDetails/currentScopesForUser";

			}

			//  ajax call to BP Data and Scope Data
			var oModelDetailview = this.getView().getModel("detailView");
			var that = this;
			$.ajax({
				url: this.sPrefix + this.currentScopeUrl,
				type: "GET",
				dataType: "json",
				success: function (oData) {
					// var userScopes = oData;
					// userScopes.forEach(function (data) {

					var userType = oData.loggedUserType[0];
					switch (userType) {
					case "vehicelTradeDealerUser":

						break;

					case "internalTCIUser":

						break;
					case "ZoneUser":

						break;
					default:
						// raise a message, because this should not be allowed. 

					}

				}

			});

		

			// get the attributes and BP Details - 	// TODO: 
			$.ajax({
				url: this.sPrefix + this.attributeUrl,
				type: "GET",
				dataType: "json",

				success: function (oData) {
					var BpDealer = [];
					var userAttributes = [];
					/*	BpDealer.push({
											"BusinessPartnerKey": "2400042120",
											"BusinessPartner": "42120",

											"BusinessPartnerName": "Don Valley North Toyota...", //item.OrganizationBPName1 //item.BusinessPartnerFullName
											"Division": "10",
											"BusinessPartnerType": "Z001",
											"searchTermReceivedDealerName": "42120",
											"LoggedinUserFirstName" : "User",
											"LoggedinUserLastName": "42120"
										});*/
					$.each(oData.attributes, function (i, item) {
						var BpLength = item.BusinessPartner.length;

						BpDealer.push({
							"BusinessPartnerKey": item.BusinessPartnerKey,
							"BusinessPartner": item.BusinessPartner, //.substring(5, BpLength),
							"BusinessPartnerName": item.BusinessPartnerName, //item.OrganizationBPName1 //item.BusinessPartnerFullName
							"Division": item.Division,
							"BusinessPartnerType": item.BusinessPartnerType,
							"searchTermReceivedDealerName": item.SearchTerm2
								/*	"LoggedinUserFirstName" : item.FirstName,
									"LoggedinUserLastname": item.LastName*/
						});

					});

					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");
					if (sLocation_conf == 0) {
						var BpDealer = [];

						BpDealer.push({
							"BusinessPartnerKey": "2400042120",
							"BusinessPartner": "42120",

							"BusinessPartnerName": "Don Valley North Toyota...", //item.OrganizationBPName1 //item.BusinessPartnerFullName
							"Division": "10",
							"BusinessPartnerType": "Z001",
							"searchTermReceivedDealerName": "42120"
						});
						
						// 						BpDealer.push({
						// 	"BusinessPartnerKey": "2400042193",
						// 	"BusinessPartner": "42193",

						// 	"BusinessPartnerName": "Bailey toyota...", //item.OrganizationBPName1 //item.BusinessPartnerFullName
						// 	"Division": "10",
						// 	"BusinessPartnerType": "Z001",
						// 	"searchTermReceivedDealerName": "42193"
						// });
						
						
					}

					//  set your model or use the model below - // TODO: 
					that.getView().setModel(new sap.ui.model.json.JSONModel(BpDealer), "BpDealerModel");
					sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(BpDealer), "LoginBpDealerModel");
					var LoggedInDealerCode1 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
					var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
				    that.getView().byId("oDealerCode1").setText(LoggedInDealerCode1); 
					that.getView().byId("oDealertitle").setText(LoggedInDealer);

					// read the saml attachments the same way 
					$.each(oData.samlAttributes, function (i, item) {
						userAttributes.push({
							"UserType": item.UserType[0],
							"DealerCode": item.DealerCode[0],
							"Language": item.Language[0],
							"LoggedinUserFirstName": item.FirstName[0],
							"LoggedinUserLastName": item.LastName[0]

							// "Zone": item.Zone[0]   ---    Not yet available

						});

					});


					that.getView().setModel(new sap.ui.model.json.JSONModel(userAttributes), "userAttributesModel");
					sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(userAttributes), "LoginuserAttributesModel");
				
					that.security();
				}.bind(this),
				error: function (response) {
					sap.ui.core.BusyIndicator.hide();
				}
			});

			//---------------------------------------------security -----------------------------------------------------End

			//	sap.ui.getCore().LoginDetails = oLoginDealer;

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			} else {
				var sSelectedLocale = "EN"; // default is english 
			}
			var sSelectedLocale = "EN";
			//selected language. 
			// if (window.location.search == "?language=fr") {
			if (sSelectedLocale == "fr") {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n_fr.properties",
					bundleLocale: ("fr")
				});
				sap.ui.getCore().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'FR';
				this.sCurrentLocaleD = 'French';
				// set the right image for logo  - french       
				/*              var currentImageSource = this.getView().byId("idLexusLogo");
				                currentImageSource.setProperty("src", "Images/Lexus_FR.png");*/
			} else {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n_en.properties",
					bundleLocale: ("en")
				});
				sap.ui.getCore().setModel(i18nModel, "i18n");
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';
				this.sCurrentLocaleD = 'English';
				// set the right image for logo         
				/*              var currentImageSource = this.getView().byId("idLexusLogo");
				                currentImageSource.setProperty("src", "Images/Lexus_EN.png");*/
			}

			/// set the logo and Language. 

			this._setTheLanguage();

			this._setTheLogo();

			this.bindMonthYear();
		},
		onAfterRendering: function () {

			var that = this;
			var comBoboxName = this.getView().byId("MoyearCombo");
			var MoyearComboId = (this.getView().byId("MoyearCombo").getId()) + "-inner";
			comBoboxName.onAfterRendering = function () {

				if (sap.m.ComboBox.prototype.onAfterRendering) {

					sap.m.ComboBox.prototype.onAfterRendering.apply(this);

				}

				document.getElementById(MoyearComboId).disabled = true;

			};
		},

		security: function () {
			// sap.ui.core.BusyIndicator.show();
			var that = this;
			that._oViewModel = new sap.ui.model.json.JSONModel();
			that.getView().byId("SeriesCmbo").setSelectedKey("");
			//	 that.getView().byId("SeriesCmbo").setSelectedItem("");
			that.getView().byId("McCmbo").setSelectedKey("");
			that.getView().byId("SuffCmbo").setSelectedKey("");
			that._oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle(); // instantiate the resource 

			/*	that.oDataUrl = "https://tcid1gwapp1.tci.internal.toyota.ca:44300/sap/opu/odata/sap/Z_VEHICLE_CATALOGUE_SRV";*/
			//	that.oDataUrl = "/vehicleLocatorNode/node/Z_VEHICLE_CATALOGUE_SRV";
			// debugger;
			//Bussinesspartner zone implementation---------------------//

			/*	var SalesOrganization = 6000;
				var DistributionChannel = 10;
				var Division = sap.ui.getCore().LoginDetails.Division;
				var oDealer = sap.ui.getCore().LoginDetails.BussinesspartnerCode;*/
			/*	var userType=sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].UserType[0];*/ ///for local testing/
			var userType = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].UserType; // for Security*/
			var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
			var LoggedinUserLname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
			this.TruncUserName = LoggedinUserFname + LoggedinUserLname;

			/*	var oTruncLoggedUser  = [];
				oTruncLoggedUser.push(TruncUserName);*/

			switch (userType) {
				/*	case "vehicelTradeDealerUser":*/
			case "Dealer":

				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");

				if (sLocation_conf == 0) {
					this.sPrefix = "/vehicleLocatorNode";
				} else {
					this.sPrefix = "";

				}
				if (that.getView().getModel("userAttributesModel") != undefined) {
					var userAttributesModellen = that.getView().getModel("userAttributesModel").getData();
					var BpDealer = that.getView().getModel("BpDealerModel").getData();
					var BusinessPartner = BpDealer[0].BusinessPartnerKey;
					//for(var i=0;i<userAttributesModellen.length;i++){
					var oDealer = userAttributesModellen[0].DealerCode;
					/*	var SalesOrganization=userAttributesModellen[0].Zone;*/
					var Division = BpDealer[0].Division;
					/* var DistributionChannel="10";*/
					this.nodeJsUrl = this.sPrefix + "/node";
					that.oDataUrl = this.nodeJsUrl + "/API_BUSINESS_PARTNER";

					that.Customersales = this.nodeJsUrl + "/A_CustomerSalesArea";

					that.BussinesspartnerUrl = that.oDataUrl + "/A_CustomerSalesArea?$filter=Customer eq'" + BusinessPartner + "' and Division eq '" +
						Division + "'";

					var ajax = $.ajax({
						dataType: "json",
						xhrFields: {
							withCredentials: true
						},
						url: that.BussinesspartnerUrl,
						async: true,
						success: function (data) {
							var Zone = data.d.results[0];
							if (data.d.results.length != 0) {
								var SelectedZone = Zone.SalesOffice;
								switch (SelectedZone) {
								case "1000":
									that.getView().byId("Pacific").setSelected(true);
									return;
									break;
								case "2000":
									that.getView().byId("Prairie").setSelected(true);
									return;
									break;
								case "3000": //Update this
									that.getView().byId("Central").setSelected(true);
									return;
									break;
								case "4000": //Update this
									that.getView().byId("Quebec").setSelected(true);
									return;
									break;
								case "5000": //Update this
									that.getView().byId("Atlantic").setSelected(true);
									return;
									break;
								case "6000": //Update this
									/*	that.getView().byId("Atlantic").setSelected(true);*/
									return;
									break;
								}
							}

						},
						error: function () {
							// alert("Error");
						}
					});

					//	}
				}

				//Bussinesspartner zone implementation.----------//

				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");

				if (sLocation_conf == 0) {
					this.sPrefix = "/vehicleLocatorNode";
				} else {
					this.sPrefix = "";

				}

				this.nodeJsUrl = this.sPrefix + "/node";
				that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
				var SelYear = new Date().getFullYear().toString();
				that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
				var SeriesUrl = that.oDataUrl + "/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + SelYear + "'";
				var ajax1 = $.ajax({
					dataType: "json",
					xhrFields: //
					{
						withCredentials: true
					},

					// beforeSend: function (request) {
					// 	request.setRequestHeader('Authorization', 'Basic ' + btoa('anisetc:anisetc'));
					// },
					url: SeriesUrl,
					async: true,
					success: function (result) {
						var SeriesUrl = result.d.results;
						var SeriesModel = new sap.ui.model.json.JSONModel(SeriesUrl);
						sap.ui.getCore().setModel(SeriesModel, "SeriesModel");
						that.SuffixDescrioptionBinding();
					}
				});

				/*	var Suffix = that.oDataUrl + "/zc_configuration";
					var ajax3 = $.ajax({
						dataType: "json",
						xhrFields: //
						{
							withCredentials: true
						},
						url: Suffix,
						async: true,
						success: function (result) {}
					});
					var SuffixInteriorDesc = that.oDataUrl + "/zc_exterior_trim";
					var ajax4 = $.ajax({
						dataType: "json",
						xhrFields: 
						{
							withCredentials: true
						},
						url: SuffixInteriorDesc,
						async: true,
						success: function (result) {}
					});*/
				//, ajax3, ajax4,", Suffix, SuffixInteriorDesc"
				/*	$.when(ajax1, ajax2).done(function (SeriesUrl, SeriesDes) {

						var SeriesUrl = SeriesUrl[0].d.results;
						var SeriesModel = new sap.ui.model.json.JSONModel(SeriesUrl);
						sap.ui.getCore().setModel(SeriesModel, "SeriesModel");
						var SeriesDes = SeriesDes[0].d.results;

						var SeriesDesModel = new sap.ui.model.json.JSONModel(SeriesDes);
						sap.ui.getCore().setModel(SeriesDesModel, "SeriesDesModel");
						var SelYear = new Date().getFullYear().toString();
						
						that.SeriesBinding(SelYear);

						var SuffixInteriorDesc = SuffixInteriorDesc[0].d.results;
						var SuffixDescModel = new sap.ui.model.json.JSONModel(SuffixInteriorDesc);
						sap.ui.getCore().setModel(SuffixDescModel, "SuffixInteriorDesc");
						var Suffix = Suffix[0].d.results;

						var SuffixModel = new sap.ui.model.json.JSONModel(Suffix);
						sap.ui.getCore().setModel(SuffixModel, "SuffixModel");
						
						sap.ui.core.BusyIndicator.hide();
					});
					var a = new Date();
								*/

				// add your code here. // TODO: 
				break;

			case "internalTCIUser":
				// add your code here. // TODO:  
				break;
			case "ZoneUser":
				// add your code here. // TODO: 	 
				break;
			default:
				// raise a message, because this should not be allowed. 
				// add your code here. // TODO: 
			}

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
			//	var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language;  //2603
				var SPRAS = that.sCurrentLocaleD;
				
				if (SeriesDescription.length != 0) {
					for (var a = 0; a < that.Fullurls.length; a++) {
						for (var b = 0; b < SeriesDescription.length; b++) {

							if (that.Fullurls[a].TCISeries == SeriesDescription[b].ModelSeriesNo) {
								that.Fullurls[a].TCISeriesDescriptionEN = SeriesDescription[b].TCISeriesDescriptionEN;
								that.Fullurls[a].TCISeriesDescriptionFR = SeriesDescription[b].TCISeriesDescriptionFR;
								that.Fullurls[a].Division = SeriesDescription[b].Division;
								that.Fullurls[a].SPRAS = SPRAS;

							}
						}

					}
				} else {
					for (var i = 0; i < that.Fullurls.length; i++) {
						that.Fullurls.TCISeriesDescriptionEN = "";
						that.Fullurls.TCISeriesDescriptionFR = "";
						that.Fullurls.Division = "";
						that.Fullurls.SPRAS = SPRAS;

					}
				}
				for (var i = 0; i < that.Fullurls.length; i++) {
					if ("TCISeriesDescriptionEN" in that.Fullurls[i]) {
						that.Fullurls[i].TCISeriesDescriptionEN = that.Fullurls[i].TCISeriesDescriptionEN;
					} else {
						that.Fullurls[i].TCISeriesDescriptionEN = "";
					}
					if ("TCISeriesDescriptionFR" in that.Fullurls[i]) {
						that.Fullurls[i].TCISeriesDescriptionFR = that.Fullurls[i].TCISeriesDescriptionFR;
					} else {
						that.Fullurls[i].TCISeriesDescriptionFR = "";
					}
					if ("Division" in that.Fullurls[i]) {
						that.Fullurls[i].Division = that.Fullurls[i].Division;
					} else {
						that.Fullurls[i].Division = "";
					}
					if ("SPRAS" in that.Fullurls[i]) {
						that.Fullurls[i].SPRAS = that.Fullurls[i].SPRAS;
					} else {
						that.Fullurls[i].SPRAS = SPRAS;
						/*	that.Fullurls.SPRAS = SPRAS;*/
					}
					/*	that.Fullurls.TCISeriesDescriptionFR = "";
						that.Fullurls.Division = "";*/

				}

				/*	var obj = {};
						for (var i = 0, len = that.Fullurls.length; i < len; i++)
							obj[that.Fullurls[i]['Suffix']] = that.Fullurls[i];
						that.Fullurls = new Array();
						for (var key in obj)
							that.Fullurls.push(obj[key]);*/
				// debugger;

				if (that.getView().getModel("BpDealerModel") != undefined) {
					if (that.getView().getModel("BpDealerModel").getData()[0].Division == "10") {
						that.Division = "TOY";
					} else if (that.getView().getModel("BpDealerModel").getData()[0].Division == "20") {
						that.Division = "LEX";
					}
				}

				that.Fullurls = that.Fullurls.filter(function (x) {
					return x.Division == that.Division;
				});
				var SeriesModel = new sap.ui.model.json.JSONModel(that.Fullurls);
				that.getView().setModel(SeriesModel, "SeriesData");
				that.getView().byId("SeriesCmbo").setModel(SeriesModel);

			}
			sap.ui.core.BusyIndicator.hide();
		},
		SeriesClickedVLS11: function (oEvent) {
			sap.ui.core.BusyIndicator.show();
			var that = this;
			that.oJsonModelVLS = new sap.ui.model.json.JSONModel([]);
			that.getView().byId("McCmbo").setSelectedKey();
			that.getView().byId("SuffCmbo").setSelectedKey();
			that.getView().setModel(that.oJsonModelVLS, "Suffix");
			that.getView().setModel(that.oJsonModelVLS, "ModelCode");

			that.oSelectedYear = that.getView().byId("MoyearCombo").getSelectedKey();
			that.SelectedSeriesPath = "SeriesSelected";
			/*  that.SelectedSeriesPath= oEvent.getSource().oModels.undefined.mContexts["/0"].sPath.split("/")[1]*/
			that.oSelectedSeries = that.getView().byId("SeriesCmbo").getSelectedKey();
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
			//	var SelYear = new Date().getFullYear().toString();
			//	that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var ModelCode = that.oDataUrl + "/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + that.oSelectedYear +
				"' and TCISeries eq '" + that.oSelectedSeries + "'";
			var ajax1 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},

				// beforeSend: function (request) {
				// 	request.setRequestHeader('Authorization', 'Basic ' + btoa('anisetc:anisetc'));
				// },
				url: ModelCode,
				async: true,
				success: function (result) {
					var oResults = result.d.results;
					var oResults = oResults.filter(function (x) {
						return (x.Modelyear == that.oSelectedYear && x.TCISeries == that.oSelectedSeries);

					});
					var obj = {};
					for (var i = 0, len = oResults.length; i < len; i++)
						obj[oResults[i]['Model']] = oResults[i];
					oResults = new Array();
					for (var key in obj)
						oResults.push(obj[key]);

					// var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language;  //2603
						var SPRAS = that.sCurrentLocaleD;
					
					for (var i = 0; i < oResults.length; i++) {
						oResults[i].SPRAS = SPRAS;
					}
					var ModelCode = new sap.ui.model.json.JSONModel(oResults);
					that.getView().setModel(ModelCode, "ModelCode");
					sap.ui.core.BusyIndicator.hide();
				},
				error: function () {
					sap.ui.core.BusyIndicator.hide();
				}
			});

			/*if (that.oSelectedSeries != "" && sap.ui.getCore().getModel("SeriesDesModel") != undefined) {

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

			
			var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language;
for(var i=0;i<oResults.length;i++){
	oResults[i].SPRAS=SPRAS;
}
				var ModelCode = new sap.ui.model.json.JSONModel(oResults);
				that.getView().setModel(ModelCode, "ModelCode");

			}*/
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
			sap.ui.core.BusyIndicator.show();
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}
			var Model = that.getView().byId("McCmbo").getSelectedKey();
			var Model_Year = that.getView().byId("MoyearCombo").getSelectedKey();
			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
			var Suffix = that.oDataUrl + "/zc_configuration?$filter=Model eq '" + Model +
				"'and ModelYear eq '" + Model_Year + "'";
			var ajax3 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},
				url: Suffix,
				async: true,
				success: function (result) {
					var Suffix = result.d.results;

					var SuffixModel = new sap.ui.model.json.JSONModel(Suffix);
					sap.ui.getCore().setModel(SuffixModel, "SuffixModel");
					that.SuffixDescription();
				},
				error: function () {
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},
		SeriesFilterdData: function (SuffixDescription) {
			var that = this;

			that.FilteredSuffixDesc = SuffixDescription;

			that.oSelectedYear = that.getView().byId("MoyearCombo").getSelectedKey();

			that.oSelectedModel = that.getView().byId("McCmbo").getSelectedKey();

			if (that.oSelectedModel != "" && sap.ui.getCore().getModel("SuffixModel") != undefined) {

				var oResults = sap.ui.getCore().getModel("SuffixModel").getData();
				var oResults = oResults.filter(function (x) {
					return (x.ModelYear == that.oSelectedYear && x.Model == (that.oSelectedModel.split("-")[0]).trim());

				});
				that.Fullurls = oResults;

				var SufixDescription = SuffixDescription;
				// var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language;  //2603
						var SPRAS = that.sCurrentLocaleD; 
				var oCombine = [];
				for (var a = 0; a < that.Fullurls.length; a++) {
					for (var b = 0; b < SufixDescription.length; b++) {
						oCombine.push({
							"Suffix": that.Fullurls[a].Suffix,
							"SuffixDescriptionEN": that.Fullurls[a].SuffixDescriptionEN,
							"SuffixDescriptionFR": that.Fullurls[a].SuffixDescriptionFR,
							/* "MarktgIntDescEN": SufixDescription[b].int_desc_en,*/
							"mrktg_int_desc_en": SufixDescription[b].mrktg_int_desc_en,
							"mrktg_int_desc_fr": SufixDescription[b].mrktg_int_desc_fr,

							"SPRAS": SPRAS,
							"int_c": SufixDescription[b].int_c
								/*"compareField":_that.temp[n].Suffix+_that.temp1[m].int_desc_en*/
						});

						/*	if (that.Fullurls[a].Suffix == SufixDescription[b].Suffix) {
							SufixDescription[b].SuffixDescriptionEN = that.Fullurls[a].SuffixDescriptionEN;
							SufixDescription[b].SuffixDescriptionFR = that.Fullurls[a].SuffixDescriptionFR;
                            SufixDescription[b].SPRAS =SPRAS;
						}*/
					}

				}
				/*	for (var i = 0; i < SufixDescription.length; i++) {
					if("SuffixDescriptionEN" in SufixDescription[i]){
						SufixDescription[i].SuffixDescriptionEN=SufixDescription[i].SuffixDescriptionEN;
					}
					else{
							SufixDescription[i].SuffixDescriptionEN = "";
					}
					if("SuffixDescriptionFR" in SufixDescription[i]){
						SufixDescription[i].SuffixDescriptionFR=SufixDescription[i].SuffixDescriptionFR;
					}
					else{
							SufixDescription[i].SuffixDescriptionFR = "";
					}
					if("SPRAS" in SufixDescription[i]){
						SufixDescription[i].SPRAS=SufixDescription[i].SPRAS;
					}
					else{
							SufixDescription[i].SPRAS = SPRAS;
						
					}
					

						}*/

				/*		var	 result = SufixDescription.filter(function (a) {
      
       var key = a.Suffix + '|' + a.InteriorColor;
			
        if (!this[key]) {
            this[key] = true;
            return true;
        }
    }, Object.create(null));
    
			var result = result.filter(function (objFromA) {
						return that.Fullurls.find(function (objFromB) {
							return (objFromA.Model === objFromB.Model &&objFromA.ModelYear === objFromB.ModelYear &&objFromA.Suffix === objFromB.Suffix);
						});
					});	*/
				//	that.FilteredSuffixDesc 
				/*	var result=result.filter(function(x){
						return x.InteriorColor!=""});*/

				var Suffix = new sap.ui.model.json.JSONModel(oCombine);
				that.getView().setModel(Suffix, "Suffix");
				sap.ui.getCore().setModel(Suffix, "VehicleLocatorSuffix");
				sap.ui.core.BusyIndicator.hide();
				/*	var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
					that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);*/

			} else {
				sap.ui.core.BusyIndicator.hide();
			}

		},
		SuffixDescription: function () {
			var that = this;

			/*if (sap.ui.getCore().getModel("SuffixInteriorDesc") != undefined) {
				that.SuffixDesc = sap.ui.getCore().getModel("SuffixInteriorDesc").getData();

			} else {
				that.SuffixDesc = [];
			}*/
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			var Model_Year = this.getView().byId("MoyearCombo").getSelectedKey();
			var Series = this.getView().byId("SeriesCmbo").getSelectedKey();
			var McCmbo = this.getView().byId("McCmbo").getSelectedKey();
			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			/*	var SeriesUrl = that.oDataUrl + "/zc_exterior_trim?$filter=ModelYear eq'"+Model_Year+"' and Model eq'"+McCmbo+"' and TCISeries eq '"+Series+"' &$format=json";*/

			var SeriesUrl = that.oDataUrl + "/ZVMS_INT_Color?$filter=model_year eq '" + Model_Year +
				"' and tci_series  eq '" + Series + "'";
			var ajax1 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},
				url: SeriesUrl,
				async: true,
				success: function (result) {
					var SuffixDescription = result.d.results;
					that.SeriesFilterdData(SuffixDescription);
				},
				error: function () {
					sap.ui.core.BusyIndicator.hide();
				}
			});
			/*if(that.SuffixDesc==undefined){
				that.SuffixDesc=[];
			}*/

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

			var that = this;
			/*var Array = [];*/
			sap.ui.core.BusyIndicator.show();
			/*	that.getView().byId("SeriesCmbo").getModel().setData([]);*/

			that.oJsonModelVLS = new sap.ui.model.json.JSONModel([]);
			that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS);
			that.getView().byId("SeriesCmbo").getModel().refresh(true);
			/*	that.getView().byId("SeriesCmbo").setModel(that.oJsonModelVLS);
				that.getView().byId("McCmbo").setModel(that.oJsonModelVLS);
				that.getView().byId("SuffCmbo").setModel(that.oJsonModelVLS);*/

			that.getView().setModel(null, "Suffix");

			that.getView().setModel(null, "SeriesData");
			that.getView().setModel(null, "ModelCode");
			that.getView().byId("McCmbo").setValue("");
			that.getView().byId("SuffCmbo").setValue("");
			that.getView().byId("SeriesCmbo").setSelectedKey("");
			//	 that.getView().byId("SeriesCmbo").setSelectedItem("");
			that.getView().byId("McCmbo").setSelectedKey("");

			that.oSelectedYear = that.getView().byId("MoyearCombo").getSelectedItem().getText();
			/*	that.getView().byId("Pacific").setSelected(false);
				that.getView().byId("Prairie").setSelected(false);
				that.getView().byId("Central").setSelected(false);
				that.getView().byId("Atlantic").setSelected(false);
				that.getView().byId("Quebec").setSelected(false);*/
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
			var SeriesUrl = that.oDataUrl + "/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + that.oSelectedYear + "'";
			var ajax1 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},

				// beforeSend: function (request) {
				// 	request.setRequestHeader('Authorization', 'Basic ' + btoa('anisetc:anisetc'));
				// },
				url: SeriesUrl,
				async: true,
				success: function (result) {
					var SeriesUrl = result.d.results;
					var SeriesModel = new sap.ui.model.json.JSONModel(SeriesUrl);
					sap.ui.getCore().setModel(SeriesModel, "SeriesModel");
					that.SuffixDescrioptionBinding();
				}
			});

			//	that.SeriesBinding(that.oSelectedYear);

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
			this.getView().byId("MoyearCombo").setSelectedItem(d.getFullYear());
		},
		onBeforeRendering: function () {
			var that = this;
			//Event for Showing message on selection of Workcenter without Plant
			that.getView().byId("McCmbo").attachBrowserEvent("click",
				function () {
					var SeriesCmbo = that.getView().byId("SeriesCmbo").getSelectedKey();
					if (SeriesCmbo == "") {
						sap.m.MessageBox.warning("Please select Series");
						return;
					}
				});
			that.getView().byId("SuffCmbo").attachBrowserEvent("click",
				function () {
					var McCmbo = that.getView().byId("McCmbo").getSelectedKey();
					var SeriesCmbo = that.getView().byId("SeriesCmbo").getSelectedKey();
					if (SeriesCmbo == "") {
						sap.m.MessageBox.warning("Please select Series");
						return;
					} else if (McCmbo == "") {
						sap.m.MessageBox.warning("Please select Model Code");
						return;
					}
				});
			//  that.getView().byId("SuffCmbo").setSelectedKey("");
		},

		onSePress: function () {

			var that = this;
			sap.ui.core.BusyIndicator.show();
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
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
				sap.ui.core.BusyIndicator.hide();
				return;
			} else {
				that.getView().byId("MoyearCombo").setValueState("None");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", false);
			}

			if (SeriesCmbo == "" || SeriesCmbo == undefined || SeriesCmbo == null) {
				//	sap.m.MessageBox.error("Please select Series");
				that.getView().byId("SeriesCmbo").setValueState("Error");
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
				sap.ui.core.BusyIndicator.hide();
				return;
			} else {
				that.getView().byId("SeriesCmbo").setValueState("None");
				//	that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", false);
			}
			if (McCmbo == "" || McCmbo == undefined || McCmbo == null) {
				//	sap.m.MessageBox.error("Please select Model");

				that.getView().byId("McCmbo").setValueState("Error");
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
				sap.ui.core.BusyIndicator.hide();
				return;

			} else {
				that.getView().byId("McCmbo").setValueState("None");
				//	that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields")
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", false);
			}

			if (SuffCmbo == "" || SuffCmbo == undefined || SuffCmbo == null) {
				//	sap.m.MessageBox.error("Please select Suffix");

				that.getView().byId("SuffCmbo").setValueState("Error");
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
				sap.ui.core.BusyIndicator.hide();
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
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
				sap.ui.core.BusyIndicator.hide();
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

			if (that.getView().byId("Pacific").getSelected() == true) {

				SelectedZone.push("1000");
			}
			/*	1000=pacific
				2000=prairie
				3000=central
				4000=qubec
				5000=atlanitc*/
			if (that.getView().byId("Prairie").getSelected() == true) {

				SelectedZone.push("2000");
			}
			if (that.getView().byId("Central").getSelected() == true) {

				SelectedZone.push("3000");
			}
			if (that.getView().byId("Quebec").getSelected() == true) {

				SelectedZone.push("4000");
			}
			if (that.getView().byId("Atlantic").getSelected() == true) {

				SelectedZone.push("5000");
			}
			this.getOwnerComponent().SelectedZone = SelectedZone;
			this.getOwnerComponent().suffixSelectedValue = that.getView().byId("SuffCmbo").getSelectedItem().getText();
			/*this.getRouter().navTo("VehicleSearcResults");*/
			this.getOwnerComponent().SelectedMSMData = [{
				"MoyearCombo": MoyearCombo,
				"SeriesCmbo": SeriesCmbo,
				"McCmbo": McCmbo,
				"SuffCmbo": SuffCmbo

			}];
			that.getView().getModel("SeriesData").setProperty("/SelectedSeries", that.getView().byId("SeriesCmbo").getSelectedKey());
			sap.ui.getCore().setModel(that.getView().getModel("SeriesData"), "SelectedSeriesFromScreen1");
			var LoginUser = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].UserType[0];
			var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
			var LoggedinUserLname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
			this.TruncUserName = LoggedinUserFname + LoggedinUserLname;

			/*var LoginUser = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].UserType; */ //deployed vesrion latest 

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_MASTER_SRV";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

			/*	var SeriesUrl= that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq 'YZ3DCT' and zzextcol eq '01D6' and zzintcol eq 'LC14' and zzsuffix eq 'AB' and zzmoyr eq '2018'";*/

			/*	var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'" + McCmbo + "' and zzextcol eq '" + this.SelectedExteriorColorCode +
					"' and zzintcol eq '" + this.SelectedTrimInteriorColor + "' and zzsuffix eq '" + SuffCmbo + "' and zzmoyr eq '" + MoyearCombo +
					"'";*/
			/*	var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'" + McCmbo + "' and zzextcol eq '" + this.SelectedExteriorColorCode +
					"' and zzsuffix eq '" + SuffCmbo + "' and zzmoyr eq '" + MoyearCombo +
					"'";*/
			//this.SelectedTrimInteriorColor='';
			/*	var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'" + McCmbo + 
					"' and zzsuffix eq '" + SuffCmbo + "' and zzmoyr eq '" + MoyearCombo +	"'";*/

			/*	var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq '"+McCmbo+"' and endswith (zzintcol,'"+this.intercolor+"') and zzsuffix eq '"+SuffCmbo+"' and zzmoyr eq '"+MoyearCombo+
						"'&$format=json";*/
			/*new url*****/
			var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq '" + McCmbo + "' and endswith (zzintcol,'" + this.intercolor +
				"') and zzsuffix eq '" + SuffCmbo + "' and zzmoyr eq '" + MoyearCombo + "'&$format=json";
			/*new url*/

			/*	var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'" + McCmbo + "' and zzextcol eq '" + this.SelectedExteriorColorCode +
				"' and zzintcol eq '" + this.SelectedTrimInteriorColor + "' and zzsuffix eq '" + SuffCmbo + "' and zzmoyr eq '" + MoyearCombo +"'";*/

			//	var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq 'YZ3DCT' and zzextcol eq '01D6' and zzintcol eq 'LC14' and zzsuffix eq 'AB' and zzmoyr eq '2018'";
			$.ajax({
				url: SeriesUrl,
				type: "GET",
				dataType: 'json',
				xhrFields: //
				{
					withCredentials: true
				},
				// beforeSend: function (request) {
				// 	request.setRequestHeader('Authorization', 'Basic ' + btoa('anisetc:anisetc'));
				// },

				success: function (odata, oresponse) {
					var a = odata.d.results;
					/*	var filtered = a.filter(function(item) {
    return SelectedZone.indexOf(item.id) !== -1 && item.gender==='m';
});*/
					/*	var filtered_zone = a.filter(function (person) {
							return SelectedZone.includes(person.vkbur);
						});*/
					var filtered_zone = [];
					for (var i = 0; i < SelectedZone.length; i++) {
						for (var j = 0; j < a.length; j++) {
							if (SelectedZone[i] == a[j].vkbur) {
								filtered_zone.push(a[j]);

							}

						}

					}

					/*	var Dealer = sap.ui.getCore().LoginDetails.DealerCode;*/
					var userAttributesModellen = that.getView().getModel("userAttributesModel").getData();
					var BpDealer = that.getView().getModel("BpDealerModel").getData();
					//for(var i=0;i<userAttributesModellen.length;i++){
					var Dealer = userAttributesModellen[0].DealerCode;
					var SalesOrganization = userAttributesModellen[0].Zone;
					var Division = BpDealer[0].Division;
					/*sap.ui.getCore().getModel(new sap.ui.model.json.JSONModel(BpDealer),"LoginBpDealerModel");*/

					var FilterDeleade_OrderTypefilteNotnull = filtered_zone.filter(function (x) {
						return x.kunnr != null;
					});
					var FilterZonestockData = FilterDeleade_OrderTypefilteNotnull.filter(function (x) {
						return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "SO" || x.zzordertype == "DM")
					});
					//	var FilterDeleade_OrderTypefiltered_zone
					var FilterDeleade_OrderTypefiltered_zone = FilterZonestockData.filter(function (x) {
						return x.kunnr.slice(-5) != Dealer;
					});

					var oTCIcodes = [
						"2400500000",
						"2400542217",
						"2400500002",
						"2400500003",
						"2400500004",
						"2400500005",
						"2400500006",
						"2400500007",
						"2400500008",
						"2400500010",
						"2400500011",
						"2400500012",
						"2400500013",
						"2400500014",
						"2400500015",
						"2400500017",
						"2400500018",
						"2400500019",
						"2400500020",
						"2400500021",
						"2400500023",
						"2400500024",
						"2400500025",
						"2400500027",
						"2400500028",
						"2400500030",
						"2400500032",
						"2400500060",
						"2400500064",
						"2400500070",
						"2400500072",
						"2400500074",
						"2400500076",
						"2400500078",
						"2400500099",
						"2400500070",
						"2400500072",
						"2400500074",
						"2400500076",
						"2400500078"
					];

					//	var FilterDeleade_OrderTypefiltered_zone
					/*	var oExcludeTci = FilterDeleade_OrderTypefiltered_zone.filter(function (objFromA) {
							return !oTCIcodes.find(function (objFromB) {
								return (objFromA.kunnr).slice(-5) === objFromB.slice(-5);
							});
						});*/
					var oExcludeTci = [];
					for (var i = FilterDeleade_OrderTypefiltered_zone.length - 1; i >= 0; --i) {
						if (oTCIcodes.indexOf((FilterDeleade_OrderTypefiltered_zone[i].kunnr)) == -1) {
							oExcludeTci.push(FilterDeleade_OrderTypefiltered_zone[i]);
						}
					}

					var oZoneIncludeData = [
						"2400507000",
						"2400517000",
						"2400547000",
						"2400557000",
						"2400577000",
						"2400507100",
						"2400517100",
						"2400547100",
						"2400557100",
						"2400577100",
						"2400500070",
						"2400500072",
						"2400500074",
						"2400500076",
						"2400500078",
						"2400517200",
						"2400517300",
						"2400517600",
						"2400517400",
						"2400517500",
						"2400557200",
						"2400577200",
						"2400577300",
						"2400517210",
						"2400517310",
						"2400517610",
						"2400517410",
						"2400517510"
					];
					//Code for Filtering
					/*	var oZoneInclude=[];
						for (var n = 0; n < oZoneIncludeData.length; n++) {
							$.each(oExcludeTci, function (i, item) {
								if (oZoneIncludeData[n] == item.kunnr && item.zzordertype == "SO") {
									console.log("match", item.kunnr);
									oZoneInclude.push(item);
									console.log("matched Data", oZoneInclude);
								}
							});
						}*/
					// var oZoneInclude = oExcludeTci.filter(function (objFromA) {
					// 	return oZoneIncludeData.find(function (objFromB) {
					// 		return ((objFromA.kunnr).slice(-5) === objFromB.slice(-5) && objFromA.zzordertype == "SO");
					// 	});
					// });
					/*	console.log("oZoneInclude", oZoneInclude);
						if (oZoneInclude.length != 0) {
							var FilterZonestock = oZoneInclude.filter(function (x) {
								return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "SO" && x.zzordertype != "DM")
							});

						} else {
							var FilterZonestock = oExcludeTci.filter(function (x) {
								return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO")
							});

						}*/

					var FilterZonestock = oExcludeTci.filter(function (x) {
						return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO");
					});
					var tempTabData = FilterZonestock.filter(function (array_el) {
						return oZoneIncludeData.filter(function (anotherOne_el) {
							return (anotherOne_el == array_el.kunnr && array_el.zzordertype == "DM");
						}).length == 0;
					});
					console.log("final searched data", tempTabData);

					/*var SelectedModel=that.getView().byId("McCmbo").getSelectedKey();
					var SelectedSeries = that.getView().byId("SeriesCmbo").getSelectedKey();
					var Suffix= that.getView().byId("SuffCmbo").getSelectedKey();
					var interioicolor=that.SelectedTrimInteriorColor;*/
					/*var interioicolor="LB43";*/
					/*var FilteredData=oZoneExclude.filter(function(x){
						return x.matnr==SelectedModel&&x.zzseries==SelectedSeries&&x.zzsuffix==Suffix&&x.zzintcol==interioicolor;
					});*/

					var suffixField = that.value;
					var oSuffmodel = new sap.ui.model.json.JSONModel(suffixField);
					oSuffmodel.setSizeLimit(10000);
					sap.ui.getCore().setModel(oSuffmodel, "oSuffieldmodel");
					/*var SuffixDataValue*/

					var SuffixDesc = sap.ui.getCore().getModel("VehicleLocatorSuffix").getData();
					/*	for(var i=0;i<oZoneExclude.length;i++)
						{
							for (var j=0;j<SuffixDesc.length;j++)
							{
							 if(oZoneExclude[i].zzintcol.slice(-2)==SuffixDesc[j].int_c){
							 	oZoneExclude[i].suffix_desc_en=SuffixDesc[j].SuffixDescriptionEN;
							 		oZoneExclude[i].suffix_desc_fr=SuffixDesc[j].SuffixDescriptionFR;
							 			oZoneExclude[i].mrktg_int_desc_en=SuffixDesc[j].mrktg_int_desc_en;
							 				oZoneExclude[i].mrktg_int_desc_fr=SuffixDesc[j].mrktg_int_desc_fr;
							 		
							 }	
								
							}
						}*/

					//paste
					//oZoneInclude
					//	var oDumModel = new sap.ui.model.json.JSONModel(oZoneInclude);
					var oDumModel = new sap.ui.model.json.JSONModel(tempTabData);
					oDumModel.setSizeLimit(100000);
					sap.ui.getCore().setModel(oDumModel, "SearchedData");
					var Obj = {};
					Obj.selectedSuffix = selectedSuffix.replace(/\//g, "%2F");
					Obj.LoginUser = LoginUser;
					sap.ui.core.BusyIndicator.hide();
					that.getRouter().navTo("VehicleSearcResults", {

						LoginUser: JSON.stringify(Obj),

					});
				},
				error: function (s, result) {
					debugger;
					var a = s;
					sap.ui.core.BusyIndicator.hide();
					/*	sap.m.MessageBox.warning("No Data");*/
				}
			});

			/*	Details: JSON.stringify(obj)*/

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
				arr.push(allItem[i].getText());
			}
			if (arr.indexOf(value) < 0 && combo_IdKey == "") {
				combo_Id.setValueState("Error");
				combo_Id.setValue();
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields");
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
				arr.push(allItem[i].getText());
			}
			var that = this;
			if (arr.indexOf(value) < 0 && combo_IdSel == "") {
				combo_Id.setValueState("Error");
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
				combo_Id.setValue();
			} else {
				combo_Id.setValueState("None");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", false);
			}
		},
		handleSuffixChange: function () {
			var that = this;
			var combo_Id = this.getView().byId("SuffCmbo");
			var combo_IdSel = this.getView().byId("SuffCmbo").getSelectedKey();
			var allItem = combo_Id.getItems();
			var arr = [];
			that.value = combo_Id.getValue().trim();
			for (var i = 0; i < allItem.length; i++) {
				arr.push(allItem[i].getText());
			}
			var that = this;
			if (arr.indexOf(that.value) < 0 && combo_IdSel == "") {
				combo_Id.setValueState("Error");
				combo_Id.setValue();
				that.getView().byId("SeriesErrMsgStrip").setText("select mandetory fields");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", true);
			} else {
				combo_Id.setValueState("None");
				that.getView().byId("SeriesErrMsgStrip").setProperty("visible", false);
			}
		},
		SufficClickedVLS11: function (oEvent) {

			/*	var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language;
				if(SPRAS!="English"){*/
			/*this.SelectedExteriorColorCode = oEvent.getParameter("selectedItem").oBindingContexts.Suffix.getObject().ExteriorColorCode;
			this.SelectedTrimInteriorColor = oEvent.getParameter("selectedItem").oBindingContexts.Suffix.getObject().TrimInteriorColor;*/
			this.intercolor = oEvent.getParameter("selectedItem").oBindingContexts.Suffix.getObject().int_c;
			sap.ui.getCore().SuffixSelectedKey = this.getView().byId("SuffCmbo").getSelectedKey();
			sap.ui.getCore().SuffixSelectedItem = this.getView().byId("SuffCmbo").getSelectedItem().getText();
			selectedSuffix = this.getView().byId("SuffCmbo").getSelectedItem().getText();
			/*	}
				else{
					
				}*/
			/*	this.SelectedExteriorColorCode = "0070";
					this.SelectedTrimInteriorColor = "LB43";*/
			/*	this.SelectedExteriorColorCode = "01D6";
				this.SelectedTrimInteriorColor = "LC42";*/
			var that = this;
			/*that.getView().byId("Pacific").setSelected(false);
			that.getView().byId("Prairie").setSelected(false);
			that.getView().byId("Central").setSelected(false);
			that.getView().byId("Atlantic").setSelected(false);
			that.getView().byId("Quebec").setSelected(false);*/
			//By Sun
			this.getOwnerComponent().suffixSelectedIndex = this.getView().byId("SuffCmbo").getSelectedItem().getBindingContext("Suffix").getPath()
				.split("/")[1] - 0;
			this.getOwnerComponent().suffixSelectedValue = this.getView().byId("SuffCmbo").getSelectedItem().getText();
		},
		//	}

		/*onModleCodeClick: function (oEvent) {
			var oSelectedItems = oEvent.oSource.getSelectedItem().getBindingContext().getObject();

		}*/

		DummyPress: function () {
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
			this.nodeJsUrl = this.sPrefix;
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
				var filtered = [];
				for (var i = 0; i < TradeRequest.length; i++) {
					for (var j = 0; j < TradeVehicles.length; j++) {
						if (TradeRequest[i].Trade_Id == TradeVehicles[j]["Trade_Id.Trade_Id"]) {
							/*TradeRequest[i].push(TradeVehicles[j]);*/

							var realMerge = function (to, from) {

								for (var n in from) {

									if (typeof to[n] != 'object') {
										to[n] = from[n];
									} else if (typeof from[n] == 'object') {
										to[n] = realMerge(to[n], from[n]);
									}
								}
								return to;
							};
							var merged = realMerge(TradeRequest[i], TradeVehicles[j]);
							filtered.push(merged);

						}
					}

				}
				
				
				
				// var Spars = "E";
			   			     var Spars;
		    if (this.sCurrentLocaleD == "French") {
		    		Spars = "F";
		    } else {
		    		Spars = "E"; 
		    }

				
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
					}
				}
				// debugger;
				var oModel = new sap.ui.model.json.JSONModel(filtered);
				sap.ui.getCore().setModel(oModel, "oVehicleTrade_Summary");
				//	console(finalArray);
				that.getRouter().navTo("VehicleTrade_Summary");
				sap.ui.core.BusyIndicator.hide();
			});

		},
		BlockSummarypress: function () {
			// debugger;

			var that = this;
			that.getRouter().navTo("VehicleTrade_ModelBlock_Summary");

		},
		TradeSummaryLinkPress: function () {
			// debugger;
			var that = this;
			that.getRouter().navTo("VehicleTrade_Summary", {
				DataClicked: "Yes"
			});

		},

		TradeHistoryLinkPress: function () {
			var that = this;
			that.getRouter().navTo("VehicleTrade_History", {
				DataClicked: "Yes"
			});
		},
		SuffixDescrioptionBinding: function () {
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			var that = this;
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
			//	var SelYear = new Date().getFullYear().toString();
			//	that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var SeriesDes = that.oDataUrl + "/zc_mmfields";

			var ajax2 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},
				url: SeriesDes,
				async: true,
				success: function (result) {
					var SeriesDes = result.d.results;

					var SeriesDesModel = new sap.ui.model.json.JSONModel(SeriesDes);
					sap.ui.getCore().setModel(SeriesDesModel, "SeriesDesModel");
					//	var SelYear = new Date().getFullYear().toString();
					var SelYear = that.getView().byId("MoyearCombo").getSelectedKey();
					that.SeriesBinding(SelYear);

				}
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

		}

		/*	onModelSelectionChange: function (oModel) {
            _that.temp = [];
            _that.temp1 = [];
            sap.ui.core.BusyIndicator.show();
            _that.Modelyear = _that.modelYearPicker.getSelectedKey();
            _that.Model = oModel.getParameters("selectedItem").selectedItem.getKey();
            _that.oGlobalJSONModel.getData().suffixData = [];
            $.ajax({
                dataType: "json",
                url: _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/zc_configuration?$filter=Model eq '" + _that.Model +
                    "'and ModelYear eq '" + _that.Modelyear + "'",
                type: "GET",
                success: function (oData) {
                    _that.temp = oData.d.results;
                    debugger;
                    _that.getAllSuffix();
                    _that.oGlobalJSONModel.updateBindings(true);
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    _that.errorFlag = true;
                }
            });
        },
        getAllSuffix: function () {
            var tempNew=[];
            _that.series = _that.getView().byId("ID_seriesDesc").getSelectedKey();
            _that.Modelyear = _that.modelYearPicker.getSelectedKey();
            var url = _that.nodeJsUrl + "/ZPIPELINE_ETA_INVENT_SUMMARY_SRV/ZVMS_INT_Color?$filter=model_year eq '" + _that.Modelyear +
                "' and tci_series eq '" + _that.series + "'";
            $.ajax({
                dataType: "json",
                url: url,
                type: "GET",
                success: function (oDataInner) {
                    console.log("oDataInner.results", oDataInner.d.results);
                    console.log("suffixes", _that.temp1);
                    _that.temp1 = oDataInner.d.results;
                    for (var n = 0; n < _that.temp.length; n++) {
                        for (var m = 0; m < _that.temp1.length; m++) {
                            console.log("mapping", _that.temp1[m].Suffix);
                            _that.oGlobalJSONModel.getData().suffixData.push({
                                "Suffix": _that.temp[n].Suffix,
                                "SuffixDescriptionEN": _that.temp[n].SuffixDescriptionEN,
                                "MarktgIntDescEN": _that.temp1[m].int_desc_en,
                                "compareField":_that.temp[n].Suffix+_that.temp1[m].int_desc_en
                            });
                            sap.ui.core.BusyIndicator.hide();
                            _that.oGlobalJSONModel.updateBindings(true);
                        }
                    }
                    var b=0;
                    _that.oGlobalJSONModel.getData().suffixData.unshift({
                        "Suffix": "",
                        "SuffixDescriptionEN": "",
                        "MarktgIntDescEN": "Please Select"
                    });
                    _that.oGlobalJSONModel.updateBindings(true);
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    _that.errorFlag = true;
                }
            });
        },
		*/

	});
});