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
				this.sPrefix = "/vehicleLocatorNodenew"; // the destination
				 this.attributeUrl = "/userDetails/attributesforlocaltesting";
				 this.currentScopeUrl = "/userDetails/currentScopesForUserLocaltesting";

				// this.sPrefix = "";
				this.attributeUrl = "/userDetails/attributes";

				this.currentScopeUrl = "/userDetails/currentScopesForUser";

			} else {
				this.sPrefix = "";
				this.attributeUrl = "/userDetails/attributes";

				this.currentScopeUrl = "/userDetails/currentScopesForUser";

			}
			var that = this;
			sap.ui.core.BusyIndicator.show(); // lets wait until the dealer data is received
			$.ajax({
				url: this.sPrefix + this.currentScopeUrl,
				type: "GET",
				dataType: "json",
				success: function (oData) {
					// var userScopes = oData;
					// userScopes.forEach(function (data) {

					var userType = oData.loggedUserType[0];
					//based on what you are fixing on the ui,  enable that flag for user type
					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");
					if (sLocation_conf == 0) {
						//var userType = "Zone_User"; // TODO: Remove before deployment locatyest only - GSR
						var userType = "Dealer_User"; // TODO: Remove before deployment locatyest only - GSR
						// var userType = "TCI_User";		

					}

					switch (userType) {
					case "Dealer_User":
						that.userTypeReceived = "Dealer_User";
						break;

					case "TCI_User":
						// that.userTypeReceived = "TCI_User";
						that.userTypeReceived = "National";
						break;
					case "Zone_User":
						that.userTypeReceived = "Zone_User";
						break;
					default:
						// raise a message, because this should not be allowed. 

					}

					that._makeTheSecondCallForBPDetails();

				},
				error: function (response) {
					sap.ui.core.BusyIndicator.hide();
				}

			});
			// detail view model instantiation. 
			this._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				visibleForNational: false,
				editAllowed: true,
				onlyShownoEditForChange: true,
				texttoshow: ""

			});

			this.getView().setModel(this._oViewModel, "detailView");

			//  ajax call to BP Data and Scope Data
			var oModelDetailview = this.getView().getModel("detailView");
			var that = this;

			//---------------------------------------------security -----------------------------------------------------End

			//	sap.ui.getCore().LoginDetails = oLoginDealer;

			var isLocaleSent = window.location.search.match(/language=([^&]*)/i);
			if (isLocaleSent) {
				var sSelectedLocale = window.location.search.match(/language=([^&]*)/i)[1];
			}

			if (sSelectedLocale == "fr") {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n_fr.properties",
					bundleLocale: ("fr")
				});
				sap.ui.getCore().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'FR';
				this.sCurrentLocaleD = 'French';

			} else {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n_en.properties",
					bundleLocale: ("en")
				});
				sap.ui.getCore().setModel(i18nModel, "i18n");
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';
				this.sCurrentLocaleD = 'English';

			}

			/// set the logo and Language. 

			this._setTheLanguage();

			this._setTheLogo();

			this.bindMonthYear();
			// this.getView().byId("SuffCmbo").setFilterFunction(function (sTerm, oItem) {
			// 	sTerm = sTerm.split("*")[0];
			// 	return oItem.getKey().match(new RegExp("^" + sTerm, "i"));
			// });
			this.getRouter().getRoute("VehicleLocSearch").attachPatternMatched(this.onRouteMatched, this);

		},

		onRouteMatched: function (oEvent) {
			var that = this;
			that.getView().byId("SeriesCmbo").setSelectedKey("");
			//	 that.getView().byId("SeriesCmbo").setSelectedItem("");
			that.getView().byId("McCmbo").setSelectedKey("");
			that.getView().byId("SuffCmbo").setSelectedKey("");
			this.getView().byId("SuffCmbo").setFilterFunction(function (sTerm, oItem) {
				sTerm = sTerm.split("*")[0];
				return oItem.getKey().match(new RegExp("^" + sTerm, "i"));
			});
			this._setTheLanguage();
			//resetting the data to its initial state.	
			var tempTabData = [];
			var oDumModel = new sap.ui.model.json.JSONModel(tempTabData);
			oDumModel.setSizeLimit(100000);
			sap.ui.getCore().setModel(oDumModel, "SearchedData");
			sap.ui.getCore().setModel(oDumModel, "DemoSearchedData");
		},

		_makeTheSecondCallForBPDetails: function () {
			var that = this;
			$.ajax({
				url: this.sPrefix + this.attributeUrl,
				type: "GET",
				dataType: "json",

				success: function (oData) {
					var BpDealer = [];
					var userAttributes = [];
					var userLoginDetails = [];

					//  lets also get the logged in userid details so we can push the same to SAP. 
					// $.each(oData.userProfile, function (i, item) {
					userLoginDetails.push({

						"userId": oData.userProfile.id

					});

					sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(userLoginDetails), "userIDDetails");

					$.each(oData.attributes, function (i, item) {
						var BpLength = item.BusinessPartner.length;

						//if it is a zone user, then put the first record as Zone User	
						if (i == 0 && that.userTypeReceived == "Zone_User") {
							BpDealer.push({
								// "BusinessPartnerKey": item.BusinessPartnerKey,
								// "BusinessPartner": item.BusinessPartner, 
								"BusinessPartnerName": "Zone User"
									// "Division": item.Division,
									// "BusinessPartnerType": item.BusinessPartnerType,
									// "searchTermReceivedDealerName": item.SearchTerm2

							});
						} else if (i == 0 && that.userTypeReceived == "National") {
							BpDealer.push({
								// "BusinessPartnerKey": item.BusinessPartnerKey,
								// "BusinessPartner": item.BusinessPartner, 
								"BusinessPartnerName": "National"
									// "Division": item.Division,
									// "BusinessPartnerType": item.BusinessPartnerType,
									// "searchTermReceivedDealerName": item.SearchTerm2

							});
						}

						// for toyota login show only toyota dealers, for lexus show only lexus. 

						if (item.Division == that.sDivision || item.Division == "Dual") {

							BpDealer.push({
								"BusinessPartnerKey": item.BusinessPartnerKey,
								"BusinessPartner": item.BusinessPartner, //.substring(5, BpLength),
								"BusinessPartnerName": item.BusinessPartnerName, //item.OrganizationBPName1 //item.BusinessPartnerFullName
								"Division": item.Division,
								"BusinessPartnerType": item.BusinessPartnerType,
								"searchTermReceivedDealerName": item.SearchTerm2

							});
						} // TODO: enable this before migration

					});

					var sLocation = window.location.host;
					var sLocation_conf = sLocation.search("webide");
					if (sLocation_conf == 0 && that.userTypeReceived != "Zone_User" && that.userTypeReceived != "National") {
						var BpDealer = [];

						BpDealer.push({
							"BusinessPartnerKey": "2400042120",
							"BusinessPartner": "42120",

							"BusinessPartnerName": "Don Valley North Toyota...", //item.OrganizationBPName1 //item.BusinessPartnerFullName
							"Division": "10",
							"BusinessPartnerType": "Z001",
							"searchTermReceivedDealerName": "42120"
						});

						// Lexus dealer test

						// 						BpDealer.push({
						// 	"BusinessPartnerKey": "2400042357",
						// 	"BusinessPartner": "42357",

						// 	"BusinessPartnerName": "Lexus Dealer...", //item.OrganizationBPName1 //item.BusinessPartnerFullName
						// 	"Division": "20",
						// 	"BusinessPartnerType": "Z001",
						// 	"searchTermReceivedDealerName": "42357"
						// });

						// BpDealer.push({
						//	"BusinessPartnerKey": "2400042193",
						//	"BusinessPartner": "42193",

						//	"BusinessPartnerName": "Bailey toyota...", //item.OrganizationBPName1 //item.BusinessPartnerFullName
						//	"Division": "10",
						//	"BusinessPartnerType": "Z001",
						//	"searchTermReceivedDealerName": "42193"
						//});

					}

					if (BpDealer.length == 0) {
						sap.m.MessageBox.error(
							"The Dealer data not received,  check the URL Division, Logged in ID, clear the Browser Cache, Pick the Right ID and Retry"
						);
					}
					if (that.userTypeReceived == "Dealer_User") {
						that.getView().byId("pushTradeId").setVisible(true);

					} else {
						that.getView().byId("pushTradeId").setVisible(false);

					}
					//  set your model or use the model below - 
					if (that.userTypeReceived != "National") {

						that.getView().setModel(new sap.ui.model.json.JSONModel(BpDealer), "BpDealerModel");
						sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(BpDealer), "LoginBpDealerModel");
						var LoggedInDealerCode1 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
						var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
						that.getView().byId("oDealerCode1").setText(LoggedInDealerCode1);
						that.getView().byId("oDealertitle").setText(LoggedInDealer);
						this._oViewModel.setProperty("/visibleForNational", false);
					} else {
						// var BpDealerTemp = [...BpDealer];
						var BpDealerTemp = BpDealer.slice();
						var confirmStockCode = "";
						for (var i = 0; i < BpDealerTemp.length; i++) {
							if (i == 0) {
								BpDealerTemp.splice(0, 1);

							}

							if (BpDealerTemp[i].BusinessPartnerKey) {
								confirmStockCode = BpDealerTemp[i].BusinessPartnerKey.substring(4, 5);
							}
							if (confirmStockCode == "5") {

								switch (BpDealerTemp[i].BusinessPartnerName) {

								case "Pacific Zone Stock":
									//BpDealer[i].dummyFieldForSort = 1;
									BpDealerTemp[i].dummyFieldForSort = BpDealerTemp.length - (BpDealerTemp.length - 1);
									break;
								case "Prairie Zone Stock":
									BpDealerTemp[i].dummyFieldForSort = BpDealerTemp.length - (BpDealerTemp.length - 2);
									break;
								case "National Demo":
									BpDealerTemp[i].dummyFieldForSort = BpDealerTemp.length - (BpDealerTemp.length - 6);
									break;
								case "Central Zone Stock":
									BpDealerTemp[i].dummyFieldForSort = BpDealerTemp.length - (BpDealerTemp.length - 3);
									break;
								case "Quebec Zone Stock":
									BpDealerTemp[i].dummyFieldForSort = BpDealerTemp.length - (BpDealerTemp.length - 4);
									break;
								case "Atlantic Zone Stock":
									BpDealerTemp[i].dummyFieldForSort = BpDealerTemp.length - (BpDealerTemp.length - 5);
									break;
								}

							} else {

								BpDealerTemp[i].dummyFieldForSort = i + 7;
							}
						}

						that.getView().setModel(new sap.ui.model.json.JSONModel(BpDealer), "BpDealerModel");
						sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(BpDealer), "LoginBpDealerModel");
						that.getView().setModel(new sap.ui.model.json.JSONModel(BpDealerTemp), "BpDealerModelZone");
						this._oViewModel.setProperty("/visibleForNational", true);

					}
					// read the saml attachments the same way 

					$.each(oData.samlAttributes, function (i, item) {
						if (item.DealerCode != undefined) {
							var dealerCode = item.DealerCode[0];
						}
						if (item.Zone != undefined) {
							var Zone = item.Zone[0];
							that.receivedZoneFromSaml = Zone;
						}

						// if running locally, 
						var sLocation = window.location.host;
						var sLocation_conf = sLocation.search("webide");
						if (sLocation_conf == 0) {

							if (that.userTypeReceived == "Zone_User") {

								userAttributes.push({
									// "DealerCode": dealerCode,
									"LoggedinUserFirstName": "Vehicle Locator Trade",
									"Language": "English",
									"LoggedinUserLastName": "Zone Central",
									"UserType": "Zone",
									"Zone": "3"
								});
							} else if (that.userTypeReceived == "National") {

								// DealerCode: undefined
								// Language: "English"
								// LoggedinUserFirstName: "Vehicle Locator Trade"
								// LoggedinUserLastName: "TCI User"
								// UserType: "National"
								// Zone: undefined
								userAttributes.push({
									"DealerCode": undefined,
									"LoggedinUserFirstName": "Vehicle Locator Trade",
									"Language": "English",
									"LoggedinUserLastName": "TCI User",
									"UserType": "National",
									"Zone": undefined
								});

							} else {
								userAttributes.push({
									//	DealerCode: "42193",
									//	Language: "English",
									//	LoggedinUserFirstName: "User",
									//	LoggedinUserLastName: "42193",
									//	UserType: "Dealer",
									//	Zone: undefined

									DealerCode: "42120",
									Language: "English",
									LoggedinUserFirstName: "User",
									LoggedinUserLastName: "42120",
									UserType: "Dealer",
									Zone: undefined
										// // Lexus test
										// 									DealerCode: "42357",
										// 									Language: "English",
										// 									LoggedinUserFirstName: "User",
										// 									LoggedinUserLastName: "42357",
										// 									UserType: "Dealer",
										// 									Zone: undefined
								});
							}
						} else {
							userAttributes.push({
								"UserType": item.UserType[0],
								"DealerCode": dealerCode,
								"Language": item.Language[0],
								"LoggedinUserFirstName": item.FirstName[0],
								"LoggedinUserLastName": item.LastName[0],
								"Zone": Zone //item.Zone[0]

								// "Zone": item.Zone[0]   ---    Not yet available

							});

						}

					});

					that.getView().setModel(new sap.ui.model.json.JSONModel(userAttributes), "userAttributesModel");
					sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(userAttributes), "LoginuserAttributesModel");

					that.security();

					sap.ui.core.BusyIndicator.hide(); // close the Busy indicator
				}.bind(this),
				error: function (response) {
					sap.ui.core.BusyIndicator.hide();
				}
			});

		},

		onAfterRendering: function () {

			var that = this;

			this._setTheLanguage();
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

			var that = this;
			that._oViewModel = new sap.ui.model.json.JSONModel();
			that.getView().byId("SeriesCmbo").setSelectedKey("");
			//	 that.getView().byId("SeriesCmbo").setSelectedItem("");
			that.getView().byId("McCmbo").setSelectedKey("");
			that.getView().byId("SuffCmbo").setSelectedKey("");
			that._oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle(); // instantiate the resource 

			var userType = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].UserType; // for Security*/

			var LoggedinUserFname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserFirstName;
			var LoggedinUserLname = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].LoggedinUserLastName;
			this.TruncUserName = LoggedinUserFname + LoggedinUserLname;

			switch (userType) {
				/*	case "Dealer_User":*/
			case "Dealer":

				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");

				if (sLocation_conf == 0) {
					this.sPrefix = "/vehicleLocatorNodenew";
				} else {
					this.sPrefix = "";

				}
				if (that.getView().getModel("userAttributesModel") != undefined) {
					var userAttributesModellen = that.getView().getModel("userAttributesModel").getData();
					var BpDealer = that.getView().getModel("BpDealerModel").getData();
					var BusinessPartner = BpDealer[0].BusinessPartnerKey;
					//for(var i=0;i<userAttributesModellen.length;i++){
					var oDealer = userAttributesModellen[0].DealerCode;

					this.nodeJsUrl = this.sPrefix + "/node";
					that.oDataUrl = this.nodeJsUrl + "/API_BUSINESS_PARTNER";

					that.Customersales = this.nodeJsUrl + "/A_CustomerSalesArea";

					var Division = this.sDivision;

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
								case "3000":
									that.getView().byId("Central").setSelected(true);
									return;
									break;
								case "4000":
									that.getView().byId("Quebec").setSelected(true);
									return;
									break;
								case "5000":
									that.getView().byId("Atlantic").setSelected(true);
									return;
									break;
								case "6000":
									/*	that.getView().byId("Atlantic").setSelected(true);*/
									return;
									break;
								case "9000":
									that.getView().byId("Lexus").setSelected(true);
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
					this.sPrefix = "/vehicleLocatorNodenew";
				} else {
					this.sPrefix = "";

				}

				this.nodeJsUrl = this.sPrefix + "/node";
				that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
				var SelYear = new Date().getFullYear().toString();
				that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
				var SeriesUrl = that.oDataUrl + "/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + SelYear + "'and visibility eq 'X'";
				var ajax1 = $.ajax({
					dataType: "json",
					xhrFields: //
					{
						withCredentials: true
					},

					url: SeriesUrl,
					async: true,
					success: function (result) {
						var SeriesUrl = result.d.results;
						var SeriesModel = new sap.ui.model.json.JSONModel(SeriesUrl);
						sap.ui.getCore().setModel(SeriesModel, "SeriesModel");
						that.SuffixDescrioptionBinding();
					}
				});

				var allow = {
					allow: true
				};
				that.getView().setModel(new sap.ui.model.json.JSONModel(allow), "editZoneProperty");

				break;

				// case "TCI_User":
			case "National":
				this._oViewModel.setProperty("/visibleForNational", true);
				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");

				if (sLocation_conf == 0) {
					this.sPrefix = "/vehicleLocatorNodenew";
				} else {
					this.sPrefix = "";

				}

				this.nodeJsUrl = this.sPrefix + "/node";
				that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
				var SelYear = new Date().getFullYear().toString();
				that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
				var SeriesUrl = that.oDataUrl + "/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + SelYear + "'and visibility eq 'X'";
				var ajax1 = $.ajax({
					dataType: "json",
					xhrFields: //
					{
						withCredentials: true
					},

					url: SeriesUrl,
					async: true,
					success: function (result) {
						var SeriesUrl = result.d.results;
						var SeriesModel = new sap.ui.model.json.JSONModel(SeriesUrl);
						sap.ui.getCore().setModel(SeriesModel, "SeriesModel");
						that.SuffixDescrioptionBinding();
					}
				});

				break;
			case "Zone":

				//Bussinesspartner zone implementation.----------//

				var sLocation = window.location.host;
				var sLocation_conf = sLocation.search("webide");

				if (sLocation_conf == 0) {
					this.sPrefix = "/vehicleLocatorNodenew";
				} else {
					this.sPrefix = "";

				}

				this.nodeJsUrl = this.sPrefix + "/node";
				that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
				var SelYear = new Date().getFullYear().toString();
				that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
				var SeriesUrl = that.oDataUrl + "/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + SelYear + "'and visibility eq 'X'";
				var ajax1 = $.ajax({
					dataType: "json",
					xhrFields: //
					{
						withCredentials: true
					},

					url: SeriesUrl,
					async: true,
					success: function (result) {
						var SeriesUrl = result.d.results;
						var SeriesModel = new sap.ui.model.json.JSONModel(SeriesUrl);
						sap.ui.getCore().setModel(SeriesModel, "SeriesModel");
						that.SuffixDescrioptionBinding();
					}
				});

				{
					var SelectedZone = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].Zone;
					switch (SelectedZone) {
					case "1": // 1=1000
						that.getView().byId("Pacific").setSelected(true);
						that.zoneDescription = "Pacific";
						that.sapUserZone = "1000";
						that.zoneStockCode = "2400507000";
						that.lexusZoneStockCode = "2400507100";
						break;
					case "2": // 2=2000
						that.getView().byId("Prairie").setSelected(true);
						that.zoneDescription = "Prairie";
						that.sapUserZone = "2000";
						that.zoneStockCode = "2400517000";
						that.lexusZoneStockCode = "2400517100";
						break;
					case "3": // 3=3000
						that.getView().byId("Central").setSelected(true);
						that.zoneDescription = "Central";
						that.sapUserZone = "3000";
						that.zoneStockCode = "2400547000";
						that.lexusZoneStockCode = "2400547100";
						break;
					case "5": // 5=4000 
						that.getView().byId("Quebec").setSelected(true);
						that.zoneDescription = "Quebec";
						that.sapUserZone = "4000";
						that.zoneStockCode = "2400557000";
						that.lexusZoneStockCode = "2400557100";
						break;
					case "4": //4 =5000  
						that.getView().byId("Atlantic").setSelected(true);
						that.zoneDescription = "Atlantic";
						that.sapUserZone = "5000";
						that.zoneStockCode = "2400577000";
						that.lexusZoneStockCode = "2400577100";
						break;
					case "6000": //Update this
						/*	that.getView().byId("Atlantic").setSelected(true);*/

						break;
					case "7": //4 =5000  
						that.getView().byId("Lexus").setSelected(true);
						that.zoneDescription = "Lexus";
						that.sapUserZone = "9000";
						that.zoneStockCode = "2400579000";
						that.lexusZoneStockCode = "2400579100";
						break;
					}
				}

				var allow = {
					allow: true
				};
				that.getView().setModel(new sap.ui.model.json.JSONModel(allow), "editZoneProperty");

				break;
			default:
				// this may not happen
			}

			//  try to append the zone user with the zone data to which he belons 
			// that.zoneDescription

			var loggedinDealerNameSetModel = sap.ui.getCore().getModel("LoginBpDealerModel").getData(); //[0].BusinessPartner;
			for (var i = 0; i < 1; i++) {

				if (loggedinDealerNameSetModel[i].BusinessPartnerName == "Zone User") {
					loggedinDealerNameSetModel[i].BusinessPartnerName = that.zoneDescription + " - " + loggedinDealerNameSetModel[i].BusinessPartnerName;
				}
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
								// exclude landcruiser 26th May
								if (that.Fullurls[a].TCISeries != "L/C") {
									that.Fullurls[a].TCISeriesDescriptionEN = SeriesDescription[b].TCISeriesDescriptionEN;
									that.Fullurls[a].TCISeriesDescriptionFR = SeriesDescription[b].TCISeriesDescriptionFR;
									that.Fullurls[a].Division = SeriesDescription[b].Division;
									that.Fullurls[a].SPRAS = SPRAS;
									that.Fullurls[a].zzzadddata4 = Number(SeriesDescription[b].zzzadddata4);
								}

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

					}

					that.Fullurls[i].zzzadddata4 = Number(that.Fullurls[i].zzzadddata4); //GSR2405
				}

				if (that.sDivision == "10") {

					that.Division = "TOY";
					// } else if (that.getView().getModel("BpDealerModel").getData()[0].Division == "20") {
				} else if (that.sDivision == "20") {

					that.Division = "LEX";
				}
				//	}

				that.Fullurls = that.Fullurls.filter(function (x) {
					return x.Division == that.Division;
				});

				/*global  _:true*/
				// that.Fullurls = _.sortBy(that.Fullurls, "zzzadddata1"); // this is the sort
				that.Fullurls = _.sortBy(that.Fullurls, "zzzadddata4");

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
			that.oSelectedSeries = that.getView().byId("SeriesCmbo").getSelectedKey();
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNodenew";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
			//	var SelYear = new Date().getFullYear().toString();
			//	that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var ModelCode = that.oDataUrl + "/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + that.oSelectedYear +
				"' and TCISeries eq '" + that.oSelectedSeries + "'and visibility eq 'X'";
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

		},

		MCClickedVLS11: function ()

		{
			var that = this;
			that.oJsonModelVLS = new sap.ui.model.json.JSONModel([]);
			that.getView().setModel(that.oJsonModelVLS, "Suffix");
			sap.ui.core.BusyIndicator.show();
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNodenew";
			} else {
				this.sPrefix = "";

			}
			var Model = that.getView().byId("McCmbo").getSelectedKey();
			var Model_Year = that.getView().byId("MoyearCombo").getSelectedKey();
			this.nodeJsUrl = this.sPrefix + "/node";

			// that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
			// var Suffix = that.oDataUrl + "/zc_configuration?$filter=Model eq '" + Model +
			// 	"'and ModelYear eq '" + Model_Year + "'";

			// new suffixes. 23rd May 

			that.oDataUrl = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";
			var Suffix = that.oDataUrl + "/ZC_suffix_VL?$filter=Model eq '" + Model +
				"'and ModelYear eq '" + Model_Year + "'and visibility eq 'X'";

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

						if (that.Fullurls[a].int_trim.substr(2) == SuffixDescription[b].int_c) {
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
						}
						/*	if (that.Fullurls[a].Suffix == SufixDescription[b].Suffix) {
							SufixDescription[b].SuffixDescriptionEN = that.Fullurls[a].SuffixDescriptionEN;
							SufixDescription[b].SuffixDescriptionFR = that.Fullurls[a].SuffixDescriptionFR;
                            SufixDescription[b].SPRAS =SPRAS;
						}*/
					}

				}

			
				var Suffix = new sap.ui.model.json.JSONModel(oCombine);
				that.getView().setModel(Suffix, "Suffix");
				sap.ui.getCore().setModel(Suffix, "VehicleLocatorSuffix");
				sap.ui.core.BusyIndicator.hide();
				/*	var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
					that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);*/

				if (oCombine.length != 0) {
					if (this.sCurrentLocale == 'EN') {
						var allText = 'ALL';

					} else {
						var allText = 'TOUS';

					}

					// var allText = that._oResourceBundle.getText("ALL");
					// if (this.getView().byId("VLRSuffix").getItems().filter(function (x) {
					// 		return x.mProperties.key == "all"
					// 	}).length == 0) {
					var newItem = new sap.ui.core.Item({
						key: allText,
						text: allText
					});

					this.getView().byId("SuffCmbo").insertItem(newItem);
				}

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
				this.sPrefix = "/vehicleLocatorNodenew";
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

			return that.SeriesDesc;
		},

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

			if (that.getView().byId("MoyearCombo").getSelectedItem() != null) {
				that.oSelectedYear = that.getView().byId("MoyearCombo").getSelectedItem().getText();
				that.getView().byId("MoyearCombo").setValueState("None");
			}

			if (that.getView().byId("SeriesCmbo").getSelectedItem() != null) {
				that.oSelectedYear = that.getView().byId("SeriesCmbo").getSelectedItem().getText();
				that.getView().byId("SeriesCmbo").setValueState("None");
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNodenew";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var SeriesUrl = that.oDataUrl + "/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + that.oSelectedYear + "'and visibility eq 'X'";
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
			for (var i = 0; i < 3; i++) {
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
						var plsSelectSeries = that._oResourceBundle.getText("PlsSelectSeries");
						sap.m.MessageBox.warning(plsSelectSeries);
						return;
					}
				});
			that.getView().byId("SuffCmbo").attachBrowserEvent("click",
				function () {
					var McCmbo = that.getView().byId("McCmbo").getSelectedKey();
					var SeriesCmbo = that.getView().byId("SeriesCmbo").getSelectedKey();
					if (SeriesCmbo == "") {
						var plsSelectSeries = that._oResourceBundle.getText("PlsSelectSeries");
						sap.m.MessageBox.warning(plsSelectSeries);
						// sap.m.MessageBox.warning("Please select Series");
						return;
					} else if (McCmbo == "") {
						var PlsSelectModel = that._oResourceBundle.getText("PlsSelectModel");
						sap.m.MessageBox.warning(PlsSelectModel);
						// sap.m.MessageBox.warning("Please select Model Code");
						return;
					}
				});
			//  that.getView().byId("SuffCmbo").setSelectedKey("");
		},

		onSePress: function () {

			var that = this;
			this._setTheLanguage();
			sap.ui.core.BusyIndicator.show();
			var MoyearCombo = that.getView().byId("MoyearCombo").getSelectedKey();
			var SeriesCmbo = that.getView().byId("SeriesCmbo").getSelectedKey();
			//	var oSeries = that.getView().byId("SeriesCmbo").getSelectedKey();
			var McCmbo = that.getView().byId("McCmbo").getSelectedKey();
			var SuffCmbo;
			//	var oMcCmbo  = that.getView().byId("McCmbo").getSelectedKey();
			if (that.getView().byId("SuffCmbo").getValue().includes("*")) {
				SuffCmbo = "";
			} else {
				SuffCmbo = that.getView().byId("SuffCmbo").getSelectedKey();
			}
			if (SuffCmbo == 'undefined' || SuffCmbo == "") {
				var SuffCmbo = that.getView().byId("SuffCmbo").getValue();
				if (SuffCmbo == " - ALL/") { //gsr
					SuffCmbo = "ALL";
				}
			}

			//	var suffix = that.getView().byId("SuffCmbo").getSelectedKey();

			/*var vZone = that.getView().byId("Pacific").getSelected();*/
			var selectMandtFields = that._oResourceBundle.getText("selectMandtFields");

			if (MoyearCombo == "" || MoyearCombo == undefined || MoyearCombo == null) {
				//	sap.m.MessageBox.error("Please select ModelYear");
				that.getView().byId("MoyearCombo").setValueState("Error");

				that.getView().byId("SeriesErrMsgStrip").setText(selectMandtFields); //selectMandtFields  "select mandetory fields"
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
				that.getView().byId("SeriesErrMsgStrip").setText(selectMandtFields);
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
				that.getView().byId("SeriesErrMsgStrip").setText(selectMandtFields);
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
				that.getView().byId("SeriesErrMsgStrip").setText(selectMandtFields);
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
				.getSelected() == false && that.getView().byId("Lexus")
				.getSelected() == false) {
				//	sap.m.MessageBox.error("Please select Zone");
				that.getView().byId("SeriesErrMsgStrip").setText(selectMandtFields);
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

			var SelectedZone = [];

			if (that.getView().byId("Pacific").getSelected() == true) {

				SelectedZone.push("1000");
			}

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
			if (that.getView().byId("Lexus").getSelected() == true) {

				SelectedZone.push("9000");
			}

			this.getOwnerComponent().SelectedZone = SelectedZone;
			if (that.getView().byId("SuffCmbo").getSelectedItem() != null && !(that.getView().byId("SuffCmbo").getValue().includes("*"))) {
				this.getOwnerComponent().suffixSelectedValue = that.getView().byId("SuffCmbo").getSelectedItem().getText();
			} else {
				this.getOwnerComponent().suffixSelectedValue = "";
			}
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
				this.sPrefix = "/vehicleLocatorNodenew";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_MASTER_SRV";

			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			//  the requested dealer is made as a mandatory parameter, so the beloow changes. 
			//1704 requesting dealer is introduced. 

			// 		 	if(Dealer_No.length == 10){
			// 	Dealer_No=Dealer_No.slice(-5);
			// }		
			if (that.userTypeReceived != "National") {
				var userAttributesModellen = that.getView().getModel("userAttributesModel").getData();
				var oDealer = userAttributesModellen[0].DealerCode;
			} else {
				// if the usertype is national , then the bp is from the drop down key	
				if (that.theFirstDefaultDealerSelected) {
					oDealer = that.theFirstDefaultDealerSelected;
				} else {
					sap.m.MessageBox.error(
						"Please select the dealer from the drop down before proceeding to search vehicles"
					);
					sap.ui.core.BusyIndicator.hide();
					return;
				}

			}

			if (oDealer == undefined) {
				// for zone users this will be blank,  so lets send the zone code to fetch the zone inventory. 

				if (this.sDivision == '10') {
					oDealer = that.zoneStockCode;
					oDealer = oDealer.slice(-5);
				} else {

					oDealer = that.lexusZoneStockCode;
					oDealer = oDealer.slice(-5);
				}

			} else {
				if (oDealer.length == 10) {
					// oDealer=oDealer.slice(-6); 
					oDealer = oDealer.slice(-5);
				}
			}
			var Suff = this.getView().byId("SuffCmbo").getValue();
			if (SuffCmbo == 'ALL' || SuffCmbo == 'TOUS' || Suff.includes("*")) {
				// var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq '" + McCmbo + "' and endswith (zzintcol,'" + '' +
				// 	"') and zzmoyr eq '" + MoyearCombo + "'&$format=json";

				var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate('" + oDealer + "')/Set?$filter=matnr eq '" + McCmbo +
					"' and endswith (zzintcol,'" + "" + "') and zzseries eq '" + SeriesCmbo + "' and zzmoyr eq '" + MoyearCombo + "'&$format=json";
				var DemoSeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_VHUSG('" + oDealer + "')/Set?$filter=matnr eq '" + McCmbo +
					"' and endswith (zzintcol,'" + "" + "') and zzseries eq '" + SeriesCmbo + "' and  zzmoyr eq '" + MoyearCombo +
					"' and  vhusg eq '1B' &$format=json";

			} else {
				// var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq '" + McCmbo + "' and endswith (zzintcol,'" + this.intercolor +
				// 	"') and zzsuffix eq '" + SuffCmbo + "' and zzmoyr eq '" + MoyearCombo + "'&$format=json";

				var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate('" + oDealer + "')/Set?$filter=matnr eq '" + McCmbo +
					"' and endswith (zzintcol,'" + this.intercolor + "') and zzseries eq '" + SeriesCmbo + "' and zzmoyr eq '" +
					MoyearCombo + "'&$format=json";
				var DemoSeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_VHUSG('" + oDealer + "')/Set?$filter=matnr eq '" + McCmbo +
					"' and endswith (zzintcol,'" + this.intercolor + "') and zzseries eq '" + SeriesCmbo + "'  and zzmoyr eq '" +
					MoyearCombo + "'&$format=json";
			}

			// var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate(Req_dealer='" + oDealer + "')/Set?$filter=matnr eq '" + McCmbo +
			// 	"' and endswith (zzintcol,'" + this.intercolor +
			// 	"') and zzsuffix eq '" + SuffCmbo + "' and zzmoyr eq '" + MoyearCombo + "'&$format=json";
			$.ajax({
				url: DemoSeriesUrl,
				type: "GET",
				dataType: 'json',
				xhrFields: //
				{
					withCredentials: true
				},

				success: function (odata, oresponse) {
					var a = odata.d.results;

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
					// var Division = BpDealer[0].Division;// TODO: 
					var Division = this.sDivision;
					/*sap.ui.getCore().getModel(new sap.ui.model.json.JSONModel(BpDealer),"LoginBpDealerModel");*/

					var FilterDeleade_OrderTypefilteNotnull = filtered_zone.filter(function (x) {
						return x.kunnr != null;
					});

					// if a zone user then we need more order types. 

					// var userType = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].UserType;

					// if (userType == "Zone" || userType == "National") {
					// 	var FilterZonestockData = FilterDeleade_OrderTypefilteNotnull.filter(function (x) {
					// 		return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO" || x.zzordertype == "RS" || x.zzordertype ==
					// 			"F1" || x.zzordertype == "F2" || x.zzordertype == "F3" || x.zzordertype == "F4" || x.zzordertype == "F5");
					// 	});

					// } else {
					// 	var FilterZonestockData = FilterDeleade_OrderTypefilteNotnull.filter(function (x) {
					// 		return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "SO" || x.zzordertype == "DM");
					// 	});
					// }

					//	var FilterDeleade_OrderTypefiltered_zone
					var FilterDeleade_OrderTypefiltered_zone = FilterDeleade_OrderTypefilteNotnull.filter(function (x) {
						return x.kunnr.slice(-5) != Dealer;
					});

					// var oTCIcodes = [
					// 	"2400500000", "2400542217", "2400500002", "2400500003", "2400500004", "2400500005", "2400500006",
					// 	"2400500007", "2400500008", "2400500010", "2400500011", "2400500012", "2400500013", "2400500014",
					// 	"2400500015", "2400500017", "2400500018", "2400500019", "2400500020", "2400500021", "2400500023",
					// 	"2400500024", "2400500025", "2400500027", "2400500028", "2400500030", "2400500032", "2400500060",
					// 	"2400500064", "2400500070", "2400500072", "2400500074", "2400500076", "2400500078", "2400500099",
					// 	"2400500070", "2400500072", "2400500074", "2400500076", "2400500078"
					// ];

					// var oExcludeTci = [];
					// for (var i = FilterDeleade_OrderTypefiltered_zone.length - 1; i >= 0; --i) {
					// 	if (oTCIcodes.indexOf((FilterDeleade_OrderTypefiltered_zone[i].kunnr)) == -1) {
					// 		oExcludeTci.push(FilterDeleade_OrderTypefiltered_zone[i]);
					// 	}
					// }

					// var oZoneIncludeData = [
					// 	"2400507000", "2400517000", "2400547000", "2400557000", "2400577000", "2400507100", "2400517100", "2400547100",
					// 	"2400557100", "2400577100", "2400500070", "2400500072", "2400500074", "2400500076", "2400500078", "2400517200",
					// 	"2400517300", "2400517600", "2400517400", "2400517500", "2400557200", "2400577200", "2400577300", "2400517210",
					// 	"2400517310", "2400517610", "2400517410", "2400517510"
					// ];

					// if this is a zone user we need additional multiple order types. 

					// if (userType == "Zone") {
					// 	var FilterZonestock = oExcludeTci.filter(function (x) {
					// 		return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO" || x.zzordertype == "RS" || x.zzordertype ==
					// 			"F1" || x.zzordertype == "F2" || x.zzordertype == "F3" || x.zzordertype == "F4" || x.zzordertype == "F5");
					// 	});

					// } else {
					// 	var FilterZonestock = oExcludeTci.filter(function (x) {
					// 		return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO");
					// 	});

					// }

					var FilterZonestock = FilterDeleade_OrderTypefiltered_zone.filter(function (x) {
						return x.kunnr.slice(-5) != Dealer && (x.zzordertype != "SR");
					});
					// var tempTabData = FilterZonestock.filter(function (array_el) {
					// 	return oZoneIncludeData.filter(function (anotherOne_el) {
					// 		return (anotherOne_el == array_el.kunnr && array_el.zzordertype == "DM");
					// 	}).length == 0;
					// });
					var tempTabData = FilterZonestock.filter(function (x) {
							return x.vhusg == "1B" || x.vhusg == "2C";
						}

					);

					//	console.log("final searched data", tempTabData);

					var suffixField = that.value;
					var oSuffmodel = new sap.ui.model.json.JSONModel(suffixField);
					oSuffmodel.setSizeLimit(10000);
					sap.ui.getCore().setModel(oSuffmodel, "oSuffieldmodel");
					/*var SuffixDataValue*/

					// var SuffixDesc = sap.ui.getCore().getModel("VehicleLocatorSuffix").getData();

					var oDumModel = new sap.ui.model.json.JSONModel(tempTabData);
					oDumModel.setSizeLimit(100000);
					sap.ui.getCore().setModel(oDumModel, "DemoSearchedData");
					var Obj = {};
					Obj.selectedSuffix = selectedSuffix.replace(/\//g, "%2F");
					Obj.LoginUser = LoginUser;
					Obj.userTypeReceived = that.userTypeReceived;
					sap.ui.core.BusyIndicator.hide();

				},
				error: function (s, result) {
					
					var a = s;
					sap.ui.core.BusyIndicator.hide();
					/*	sap.m.MessageBox.warning("No Data");*/
				}
			});
			$.ajax({
				url: SeriesUrl,
				type: "GET",
				dataType: 'json',
				xhrFields: //
				{
					withCredentials: true
				},

				success: function (odata, oresponse) {
					var a = odata.d.results;

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
					// var Division = BpDealer[0].Division;// TODO: 
					var Division = this.sDivision;
					/*sap.ui.getCore().getModel(new sap.ui.model.json.JSONModel(BpDealer),"LoginBpDealerModel");*/

					var FilterDeleade_OrderTypefilteNotnull = filtered_zone.filter(function (x) {
						return x.kunnr != null;
					});

					// if a zone user then we need more order types. 

					var userType = sap.ui.getCore().getModel("LoginuserAttributesModel").oData["0"].UserType;

					if (userType == "Zone" || userType == "National") {
						var FilterZonestockData = FilterDeleade_OrderTypefilteNotnull.filter(function (x) {
							return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO" || x.zzordertype == "RS" || x.zzordertype ==
								"F1" || x.zzordertype == "F2" || x.zzordertype == "F3" || x.zzordertype == "F4" || x.zzordertype == "F5");
						});

					} else {
						var FilterZonestockData = FilterDeleade_OrderTypefilteNotnull.filter(function (x) {
							return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "SO" || x.zzordertype == "DM");
						});
					}

					//	var FilterDeleade_OrderTypefiltered_zone
					var FilterDeleade_OrderTypefiltered_zone = FilterZonestockData.filter(function (x) {
						return x.kunnr.slice(-5) != Dealer;
					});

					var oTCIcodes = [
						"2400500000", "2400542217", "2400500002", "2400500003", "2400500004", "2400500005", "2400500006",
						"2400500007", "2400500008", "2400500010", "2400500011", "2400500012", "2400500013", "2400500014",
						"2400500015", "2400500017", "2400500018", "2400500019", "2400500020", "2400500021", "2400500023",
						"2400500024", "2400500025", "2400500027", "2400500028", "2400500030", "2400500032", "2400500060",
						"2400500064", "2400500070", "2400500072", "2400500074", "2400500076", "2400500078", "2400500099",
						"2400500070", "2400500072", "2400500074", "2400500076", "2400500078"
					];

					var oExcludeTci = [];
					for (var i = FilterDeleade_OrderTypefiltered_zone.length - 1; i >= 0; --i) {
						if (oTCIcodes.indexOf((FilterDeleade_OrderTypefiltered_zone[i].kunnr)) == -1) {
							oExcludeTci.push(FilterDeleade_OrderTypefiltered_zone[i]);
						}
					}

					var oZoneIncludeData = [
						"2400507000", "2400517000", "2400547000", "2400557000", "2400577000", "2400507100", "2400517100", "2400547100",
						"2400557100", "2400577100", "2400500070", "2400500072", "2400500074", "2400500076", "2400500078", "2400517200",
						"2400517300", "2400517600", "2400517400", "2400517500", "2400557200", "2400577200", "2400577300", "2400517210",
						"2400517310", "2400517610", "2400517410", "2400517510"
					];

					// if this is a zone user we need additional multiple order types. 

					if (userType == "Zone") {
						var FilterZonestock = oExcludeTci.filter(function (x) {
							return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO" || x.zzordertype == "RS" || x.zzordertype ==
								"F1" || x.zzordertype == "F2" || x.zzordertype == "F3" || x.zzordertype == "F4" || x.zzordertype == "F5");
						});

					} else {
						var FilterZonestock = oExcludeTci.filter(function (x) {
							return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO");
						});

					}

					var tempTabData = FilterZonestock.filter(function (array_el) {
						return oZoneIncludeData.filter(function (anotherOne_el) {
							return (anotherOne_el == array_el.kunnr && array_el.zzordertype == "DM");
						}).length == 0;
					});

					//	console.log("final searched data", tempTabData);

					var suffixField = that.value;
					var oSuffmodel = new sap.ui.model.json.JSONModel(suffixField);
					oSuffmodel.setSizeLimit(10000);
					sap.ui.getCore().setModel(oSuffmodel, "oSuffieldmodel");
					/*var SuffixDataValue*/

					var SuffixDesc = sap.ui.getCore().getModel("VehicleLocatorSuffix").getData();

					var oDumModel = new sap.ui.model.json.JSONModel(tempTabData);
					oDumModel.setSizeLimit(100000);
					sap.ui.getCore().setModel(oDumModel, "SearchedData");
					var Obj = {};
					Obj.selectedSuffix = selectedSuffix.replace(/\//g, "%2F");
					Obj.LoginUser = LoginUser;
					Obj.userTypeReceived = that.userTypeReceived;
					sap.ui.core.BusyIndicator.hide();

					if (that.userTypeReceived == "Zone_User" || that.userTypeReceived == "National") {

						that.getRouter().navTo("VehicleSearcResultsForZoneUser", {
							LoginUser: JSON.stringify(Obj)
						});

					} else {

						that.getRouter().navTo("VehicleSearcResults", {
							LoginUser: JSON.stringify(Obj)
						});
					}

				},
				error: function (s, result) {
					
					var a = s;
					sap.ui.core.BusyIndicator.hide();
					/*	sap.m.MessageBox.warning("No Data");*/
				}
			});

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
			var selectMandtFields = that._oResourceBundle.getText("selectMandtFields");

			if (arr.indexOf(value) < 0 && combo_IdKey == "") {
				combo_Id.setValueState("Error");
				combo_Id.setValue();
				that.getView().byId("SeriesErrMsgStrip").setText(selectMandtFields);
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
			var selectMandtFields = that._oResourceBundle.getText("selectMandtFields");
			if (arr.indexOf(value) < 0 && combo_IdSel == "") {
				combo_Id.setValueState("Error");
				that.getView().byId("SeriesErrMsgStrip").setText(selectMandtFields);
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
				// arr.push(allItem[i].getText());
				if (that.value.includes("*") && that.value.length == 2) {
					// var p= that.value.slice(0,1);
					if (allItem[i].getText().slice(0, 1) == that.value.slice(0, 1)) {
						arr.push(allItem[i].getText());
					}
				} else {
					arr.push(allItem[i].getText());
				}
			}
			var Suffix = sap.ui.getCore().getModel("VehicleLocatorSuffix").getData();
			var SuffixData = [];
			if (that.value.includes("*") && that.value.length == 2) {
				for (var j = 0; j < Suffix.length; j++) {

					var obj = {};
					if (Suffix[j].Suffix.startsWith(that.value.slice(0, 1))) {
						obj.Suffix = Suffix[j].Suffix;
						obj.SuffixDescriptionEN = Suffix[j].SuffixDescriptionEN;
						obj.SuffixDescriptionFR = Suffix[j].SuffixDescriptionFR;
						obj.mrktg_int_desc_en = Suffix[j].mrktg_int_desc_en;
						obj.mrktg_int_desc_fr = Suffix[j].mrktg_int_desc_fr;
						obj.int_c = Suffix[j].int_c;
						obj.SPRAS = Suffix[j].SPRAS;
						SuffixData.push(obj);
					}
				}

				var suffixModel = new sap.ui.model.json.JSONModel(SuffixData);
				sap.ui.getCore().setModel(suffixModel, "VehicleLocatorSuffix");
				this.getOwnerComponent().suffixSelectedValue = "";

			}
			var that = this;
			var selectMandtFields = that._oResourceBundle.getText("selectMandtFields");
			if ((arr.indexOf(that.value) < 0 && combo_IdSel == "") && (that.value != "- ALL/") && !(that.value.includes("*"))) {
				combo_Id.setValueState("Error");
				combo_Id.setValue();
				that.getView().byId("SeriesErrMsgStrip").setText(selectMandtFields);
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
			if (oEvent.getParameter("selectedItem") != null) {
				if (oEvent.getParameter("selectedItem").getText() != "ALL" && oEvent.getParameter("selectedItem").getText() != "TOUS") {
					this.intercolor = oEvent.getParameter("selectedItem").oBindingContexts.Suffix.getObject().int_c;
				}
			} else {
				this.intercolor = "";
			}
			sap.ui.getCore().SuffixSelectedKey = this.getView().byId("SuffCmbo").getSelectedKey();
			if (this.getView().byId("SuffCmbo").getSelectedItem() != null) {
				sap.ui.getCore().SuffixSelectedItem = this.getView().byId("SuffCmbo").getSelectedItem().getText();
				selectedSuffix = this.getView().byId("SuffCmbo").getSelectedItem().getText();
			} else {
				sap.ui.getCore().SuffixSelectedItem = "";
				selectedSuffix = "";
			}
			// selectedSuffix = this.getView().byId("SuffCmbo").getSelectedItem().getText();
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

			//GSR 0505
			// this.getOwnerComponent().suffixSelectedIndex = this.getView().byId("SuffCmbo").getSelectedItem().getBindingContext("Suffix").getPath()
			// 	.split("/")[1] - 0;
			this.getOwnerComponent().suffixSelectedValue = selectedSuffix;
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
						if (TradeRequest[i].Trade_Id == TradeVehicles[j]["Trade_Id"]) {
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
				if (that.sCurrentLocaleD == "French") {
					Spars = "F";
				} else {
					Spars = "E";
				}

				var finalArray = [];
				for (var k = 0; k < filtered.length; k++) {
					for (var l = 0; l < oTradeVehicleDesc.length; l++) {
						if (filtered[k].Trade_Id == oTradeVehicleDesc[l]["Trade_Id"] && filtered[k].VTN == oTradeVehicleDesc[l]["VTN"] &&
							oTradeVehicleDesc[l].SPRAS == Spars) {
							filtered[k].Ext_Colour_Desc = oTradeVehicleDesc[l].Ext_Colour_Desc;
							filtered[k].Int_Colour_Desc = oTradeVehicleDesc[l].Int_Colour_Desc;
							filtered[k].Model_Desc = oTradeVehicleDesc[l].Model_Desc;
							filtered[k].SPRAS = oTradeVehicleDesc[l].SPRAS;
							filtered[k].Series_Desc = oTradeVehicleDesc[l].Series_Desc;
							filtered[k].Suffix_Desc = oTradeVehicleDesc[l].Suffix_Desc;

						}
					}
				}
				// 
				var oModel = new sap.ui.model.json.JSONModel(filtered);
				sap.ui.getCore().setModel(oModel, "oVehicleTrade_Summary");
				//	console(finalArray);
				that.getRouter().navTo("VehicleTrade_Summary");
				sap.ui.core.BusyIndicator.hide();
			});

		},
		BlockSummarypress: function () {
			// 

			var that = this;
			that.getRouter().navTo("VehicleTrade_ModelBlock_Summary");

		},
		TradeSummaryLinkPress: function () {
			// 
			var that = this;
			that.getRouter().navTo("VehicleTrade_Summary", {
				DataClicked: "Yes"
			});

		},
		PushTradeLinkPress: function () {
			var that = this;
			that.getRouter().navTo("PushTrade_VehicleSelection", {
				SelectedVehicleFrom: "VehileTrade_CreateSingle"
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
				this.sPrefix = "/vehicleLocatorNodenew";
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
					//INC0190093 changes done by Minakshi for Filtering zzaddata4 0 values. start
					var seriesList = result.d.results.filter(item => item.zzzadddata4 != "0");
					var SeriesDesModel = new sap.ui.model.json.JSONModel(seriesList);
					sap.ui.getCore().setModel(SeriesDesModel, "SeriesDesModel");
					//INC0190093 end
					//	var SelYear = new Date().getFullYear().toString();
					var SelYear = that.getView().byId("MoyearCombo").getSelectedKey();
					that.SeriesBinding(SelYear);

				}
			});
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
				var sSelectedLocale = "EN"; // default is english 
			}

			if (sSelectedLocale == "fr") {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("fr")

				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'FR';
				this.sCurrentLocaleD = "French";

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

					//  enable the toyota zone 
					var display = {
						forlexus: false,
						fortoyota: true
					};
					this.getView().setModel(new sap.ui.model.json.JSONModel(display), "displayZoneLexus");

				} else { // set the lexus logo
					var currentImageSource = this.getView().byId("idLexusLogo");
					currentImageSource.setProperty("src", "Images/i_lexus_black_full.png");

					//  enable the lexus zone 
					var display = {
						forlexus: true,
						fortoyota: false
					};
					this.getView().setModel(new sap.ui.model.json.JSONModel(display), "displayZoneLexus");

					// }
				}
			}

		},
		onBusinessPartnerSelected: function (oEvent) {
			var sSelectedDealer = oEvent.getParameter("\selectedItem").getProperty("key");

			this.requestedDealerToSAP = sSelectedDealer;
			var sSelectedDealerText = oEvent.getParameter("\selectedItem").getProperty("additionalText");
			var sSelectedText = oEvent.getParameter("\selectedItem").getProperty("text");

			this.theFirstDefaultDealerSelected = sSelectedDealer;
			// this._oViewModel.setProperty("/DealerName", sSelectedDealerText);
			// call the function to get the relevant data to screen again. 

			this._oViewModel.setProperty("/texttoshow", sSelectedDealerText);

		}

	});
});