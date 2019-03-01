sap.ui.define([
			"vehicleLocator/controller/BaseController",
			"sap/ui/model/json/JSONModel",
			'sap/ui/model/resource/ResourceModel',
			'sap/m/MessageBox',
			"sap/ui/core/routing/History",
			"vehicleLocator/Formatter/Formatter",
		], function (BaseController, JSONModel, ResourceModel, MessageBox, History, Formatter) {
			"use strict";

			return BaseController.extend("vehicleLocator.controller.VehicleTrade_ModelBlock_Summary", {

					onInit: function () {
						var _that = this;
						//Global date format
						jQuery.sap.require("sap.ui.core.format.DateFormat");
						_that.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "yyyy-MM-dd'T'HH:mm:ss"
						});
						//***********Language translator functionality**********//
						
									this._setTheLanguage();

				this._setTheLogo();	
 
						
	this.getRouter().getRoute("VehicleTrade_ModelBlock_Summary").attachPatternMatched(this.onRouteMatched, this);
						//this.getRouter().attachRouteMatched(this.onRouteMatched, this);
						/*	this.getRouter().attachRouteMatched(this.onRouteMatched, this);*/
					},

					onRouteMatched: function (oEvent) {
						debugger;
						var that = this;
						var selectedTrade = oEvent.getParameter("arguments").SelectedTrade;
						if (selectedTrade != undefined && sap.ui.getCore().getModel("VehicleTrade_ModelBlock_SummaryTrade") != undefined) {

							var Vtn = sap.ui.getCore().getModel("VehicleTrade_ModelBlock_SummaryTrade").getData().zzvtn;
							this.getView().byId("oVtno").setText(Vtn);
						} else {
							this.getView().byId("oVtno").setText("");

						}
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
						var ModelUrl = that.oDataUrl + "/zc_model";
						/*	var ModelUrl = that.oDataUrl + "/ZC_MODEL_DETAILS";*/

						var ajax1 = $.ajax({
							dataType: "json",
							xhrFields: //
							{
								withCredentials: true
							}

							,
							url: ModelUrl,
							async: true,
							success: function (result) {}
						});

						that.oDataUrl1 = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";
						that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl1, true);
						var ModelBlockSeturl = that.oDataUrl1 + "/ModelBlockSet?$format=json";

						var ajax2 = $.ajax({
							dataType: "json",
							xhrFields: //
							{
								withCredentials: true
							},
							url: ModelBlockSeturl,
							async: true,
							success: function (result) {}
						});
					var LoginBusinessPartnerCode =sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;
						//var LoginBusinessPartnerCode = sap.ui.getCore().LoginDetails.BussinesspartnerCode;
						that.oDataUrl2 = this.nodeJsUrl + "/API_BUSINESS_PARTNER";
						that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl2, true);
						var Businesspartnerurl = that.oDataUrl2 + "/A_BusinessPartner?$filter=(Customer ne '')&$format=json";
						/*(BusinessPartner%20ne%20%27%27)&$format=json*/
						/*/A_BusinessPartner?$filter=(Customer%20ne%20%27%27)&$format=json*/
						var ajax3 = $.ajax({
							dataType: "json",
							xhrFields: //
							{
								withCredentials: true
							},
							url: Businesspartnerurl,
							async: true,
							success: function (result) {}
						});

						this.nodeJsUrl = this.sPrefix + "/node";
						that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
						that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
						/*	var ModelUrl = that.oDataUrl + "/zc_model";*/
						var SeriesDescUrl = that.oDataUrl + "/zc_mmfields";

						var ajax4 = $.ajax({
							dataType: "json",
							xhrFields: //
							{
								withCredentials: true
							}

							,
							url: SeriesDescUrl,
							async: true,
							success: function (result) {}
						});

						var that = this;
						$.when(ajax1, ajax2, ajax3, ajax4).done(function (ModelUrl, ModelBlockSeturl, Businesspartnerurl, SeriesDescUrl) {
									debugger
									var ModelUrl = ModelUrl[0].d.results;

									var ModelBlockSeturl = ModelBlockSeturl[0].d.results;

									var Businesspartnerurl = Businesspartnerurl[0].d.results;

									var SeriesDescUrl = SeriesDescUrl[0].d.results;

									function dynamicSort(property) {
										var sortOrder = 1;
										if (property[0] === "-") {
											sortOrder = -1;
											property = property.substr(1);
										}
										return function (a, b) {
											var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
											return result * sortOrder;
										};
									}

									ModelBlockSeturl.sort(dynamicSort("ZzblockId"));
									if (ModelBlockSeturl.length != 0) {
										var ZzblockId = ModelBlockSeturl[ModelBlockSeturl.length - 1].ZzblockId;

										var incrementvalue = (+ZzblockId) + 1;

										// insert leading zeroes with a negative slice
										that.ZzblockId = incrementvalue = ("0000000" + incrementvalue).slice(-8);

									} else {
										that.ZzblockId = "00000001";
									}
									var LoginBusinessPartnerCode = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;

									var FilteredBlockingDlr = ModelBlockSeturl.filter(function (x) {
										return x.ZzblockingDlr != null;
									});

									var FilteredBlockingDlr = FilteredBlockingDlr.filter(function (x) {
										return (x.ZzblockingDlr).slice(-5) == (LoginBusinessPartnerCode).slice(-5);
									});
									var FiltBusinesspartnerurl = Businesspartnerurl.filter(function (x) {
										return x.BusinessPartner != null;
									});
									var FilterredBusinessUrl = [];
									for (var k = 0; k < FilteredBlockingDlr.length; k++) {
										FilterredBusinessUrl.push(FilteredBlockingDlr[k].ZzblockedDlr);
									}
									/* var FilterredBusinessUrl=FiltBusinesspartnerurl.filter(function (x) {
					return (x.BusinessPartner).slice(-5) == (LoginBusinessPartnerCode).slice(-5);
				});*/
									var FilterredBusinessUrl = FiltBusinesspartnerurl.filter(function (objFromA) {
										return FilterredBusinessUrl.find(function (objFromB) {
											return (objFromA.BusinessPartner).slice(-5) === objFromB.slice(-5);
										});
									});
									/* for(var i=0;len=FilteredBlockingDlr.length;i<len;i++){*/
									for (var i = 0; i < FilteredBlockingDlr.length; i++) {
										for (var j = 0; j < FilterredBusinessUrl.length; j++) {
											if ((FilteredBlockingDlr[i].ZzblockedDlr).slice(-5) == (FilterredBusinessUrl[j].BusinessPartner).slice(-5)) {
												FilteredBlockingDlr[i].OrganizationBPName1 = FilterredBusinessUrl[j].OrganizationBPName1;
											}
										}
									}

									var FilterredSeriesUrl = [];
									for (var k = 0; k < FilteredBlockingDlr.length; k++) {
										FilterredSeriesUrl.push(FilteredBlockingDlr[k].Zzseries);
									}

									var FilterredSeriesUrl = SeriesDescUrl.filter(function (objFromA) {
										return FilterredSeriesUrl.find(function (objFromB) {
											return (objFromA.ModelSeriesNo) === objFromB;
										});
									});
									for (var l = 0; l < FilteredBlockingDlr.length; l++) {
										for (var m = 0; m < FilterredSeriesUrl.length; m++) {
											if (FilteredBlockingDlr[l].Zzseries == FilterredSeriesUrl[m].ModelSeriesNo) {
												FilteredBlockingDlr[l].TCISeriesDescriptionEN = FilterredSeriesUrl[m].TCISeriesDescriptionEN;
												FilteredBlockingDlr[l].TCISeriesDescriptionFR = FilterredSeriesUrl[m].TCISeriesDescriptionFR;
											}
										}
									}

									var FilterredModelUrl = [];
									for (var k = 0; k < FilteredBlockingDlr.length; k++) {
										FilterredModelUrl.push(FilteredBlockingDlr[k].Zzmodel);
									}

									var FilterredModelUrl = ModelUrl.filter(function (objFromA) {
										return FilterredModelUrl.find(function (objFromB) {
											return (objFromA.Model) === objFromB;
										});
									});
									for (var l = 0; l < FilteredBlockingDlr.length; l++) {
										for (var m = 0; m < FilterredModelUrl.length; m++) {
											if (FilteredBlockingDlr[l].Zzmodel == FilterredModelUrl[m].Model) {
												FilteredBlockingDlr[l].ModelDescriptionEN = FilterredModelUrl[m].ModelDescriptionEN;
												FilteredBlockingDlr[l].ModelDescriptionFR = FilterredModelUrl[m].ModelDescriptionFR;
											}
										}
									}

									for (var n = 0; n < FilteredBlockingDlr.length; n++) {
										if ("OrganizationBPName1" in FilteredBlockingDlr[n]) {
											FilteredBlockingDlr[n].OrganizationBPName1 = FilteredBlockingDlr[n].OrganizationBPName1;
										} else {
											FilteredBlockingDlr[n].OrganizationBPName1 = "";
										}

										if ("TCISeriesDescriptionEN" in FilteredBlockingDlr[n]) {
											FilteredBlockingDlr[n].TCISeriesDescriptionEN = FilteredBlockingDlr[n].TCISeriesDescriptionEN;
										} else {
											FilteredBlockingDlr[n].TCISeriesDescriptionEN = "";
										}

										if ("TCISeriesDescriptionFR" in FilteredBlockingDlr[n]) {
											FilteredBlockingDlr[n].TCISeriesDescriptionFR = FilteredBlockingDlr[n].TCISeriesDescriptionFR;
										} else {
											FilteredBlockingDlr[n].TCISeriesDescriptionFR = "";
										}

										if ("ModelDescriptionFR" in FilteredBlockingDlr[n]) {
											FilteredBlockingDlr[n].ModelDescriptionFR = FilteredBlockingDlr[n].ModelDescriptionFR;
										} else {
											FilteredBlockingDlr[n].ModelDescriptionFR = "";
										}
										
											if ("ModelDescriptionEN" in FilteredBlockingDlr[n]) {
											FilteredBlockingDlr[n].ModelDescriptionEN = FilteredBlockingDlr[n].ModelDescriptionEN;
										} else {
											FilteredBlockingDlr[n].ModelDescriptionEN = "";
										}
									}

										var oModel = new sap.ui.model.json.JSONModel(FilteredBlockingDlr);
										that.getView().byId("tableVTMBS").setModel(oModel);

										/*	var Businesspartnerurl = Businesspartnerurl.filter(function (x) {
					return x.BusinessPartner != null;
				});
*/
										var oBussinesspartners = Businesspartnerurl.filter(function (value) {
											return value.Customer.startsWith("24000");
										});

										var oModel = new sap.ui.model.json.JSONModel(oBussinesspartners);
										that.getView().byId("VT_MBSdeal").setModel(oModel);

									});
							},
					
						
				VehicleLocSearchPressMBS:function()
				{
						var that=this;
					that.getRouter().navTo("VehicleLocSearch");	
					
				},
				TradeSummaryLinkPressMBS:function()
				{
					var that=this;
					that.getRouter().navTo("VehicleTrade_Summary");		
					
				},
				TradeHistoryLinkPressMBS : function()
				{
						var that=this;
					that.getRouter().navTo("VehicleTrade_History");	
					
				},
				
						
							
							
							
							
							
							
							oDeletepress: function () {
								var that = this;
								//	var oTable = that.getView().byId("tableVTMBS");

								var oTable = this.getView().byId("tableVTMBS");

								var data = oTable.getSelectedIndices();
								var that = this;
								//.getBindingContext().getObject();
								if (data.length == 0) {
									sap.m.MessageBox.warning("Please select atleast one Dealer");
								} else {
									var Delete_dialog = new sap.m.Dialog({
										title: 'Delete',
										type: 'Message',
										state: 'Warning',
										content: new sap.m.Text({
											text: 'Do you want to delete the selected item?'
										}),
										beginButton: new sap.m.Button({
											text: 'Yes',
											press: function () {
												Delete_dialog.close();
												var oModel = oTable.getModel();
												var oData = oModel.getProperty('/');
												var reverse = [].concat(oTable.getSelectedIndices()).reverse();
												reverse.forEach(function (index) {
													oData.splice(index, 1);
												});
												oModel.refresh();
												oTable.setSelectedIndex(-1);

											}

										}),
										endButton: new sap.m.Button({
											text: 'No',
											press: function () {
												Delete_dialog.close();
											}
										})
									});
									Delete_dialog.open();
								}

							},

							onSubmit: function () {
								debugger
								var that = this;
								/*	var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
		
				pattern: "yyyyMMddTHHmmss"
				});*/
								/*	pattern: "yyyyMMdd'T'HHmmss"*/

								var oDateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({
									pattern: "ddMMyyyy"
								});

								var that = this;
								var sLocation = window.location.host;
								var sLocation_conf = sLocation.search("webide");

								if (sLocation_conf == 0) {
									this.sPrefix = "/vehicleLocatorNode";
								} else {
									this.sPrefix = "";

								}

								this.nodeJsUrl = this.sPrefix + "/node";

								that.oDataUrl1 = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";
								that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl1, true);
								var ModelBlockSeturl = that.oDataUrl1 + "/ModelBlockSet?$format=json";

								var ajax2 = $.ajax({
									dataType: "json",
									xhrFields: //
									{
										withCredentials: true
									},
									url: ModelBlockSeturl,
									async: true,
									success: function (ModelBlockSeturl) {

										var ModelBlockSeturl = ModelBlockSeturl.d.results;

										function dynamicSort(property) {
											var sortOrder = 1;
											if (property[0] === "-") {
												sortOrder = -1;
												property = property.substr(1);
											}
											return function (a, b) {
												var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
												return result * sortOrder;
											};
										}

										ModelBlockSeturl.sort(dynamicSort("ZzblockId"));
										if (ModelBlockSeturl.length != 0) {
											var ZzblockId = ModelBlockSeturl[ModelBlockSeturl.length - 1].ZzblockId;

											var incrementvalue = (+ZzblockId) + 1;

											// insert leading zeroes with a negative slice
											that.ZzblockId = incrementvalue = ("0000000" + incrementvalue).slice(-8);

										} else {
											that.ZzblockId = "00000001";
										}
										that.BlocIdSuccess(that.ZzblockId);
									},
									error: function () {

									}
								});
							},

							BlocIdSuccess: function (ZzblockId) {
								debugger
								var that = this;
								var oBlockId = ZzblockId;
								var BlockingDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
								var BlockedDealer = this.getView().byId("VT_MBSdeal").getSelectedKey();
								var oModelRequested = sap.ui.getCore().getModel("VehicleTrade_ModelBlock_SummaryTrade").getData().matnr;
								var oSeries = sap.ui.getCore().getModel("VehicleTrade_ModelBlock_SummaryTrade").getData().zzseries;

								var oCommentData = this.getView().byId("TypeHerid").getValue();

								var oComment = [];
								for (var i = 0; i < oCommentData.length; i++) {
									oComment.push(oCommentData[i].Comment_Txt);
								}
								if (oComment.length != 0) {
									var oComment = oComment.join(".");
								} else {
									var oComment = "testing";
								}
								var stDate = new Date();
								stDate = Date.parse(stDate);

								var BlockStartdate = "/Date(" + stDate + ")/";

								var dncBlockedDays = this.getView().byId("inputblocknofdays").getValue();
								//	var BlockStartdate = oDateFormat1.format(new Date());
								//	var dncBlockedDays = this.getView().byId("VT_ARCDnc").getValue();
								var someDate = new Date();
								var numberOfDaysToAdd = Number(dncBlockedDays);
								var Blockenddate = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
								Blockenddate = "/Date(" + Blockenddate + ")/";
								//	Blockenddate = oDateFormat1.format(new Date(Blockenddate));
								var Createdby = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');;
								/*	var Createdon = oDateFormat.format(new Date());*/
								var Createdon = "";
								var oDNSBlock = {
									"ZzblockId": oBlockId,
									"ZzblockedDlr": BlockingDealer,
									"ZzblockingDlr": BlockedDealer,
									"Zzmodel": oModelRequested,
									"Zzseries": oSeries,
									"Zzduration": dncBlockedDays,
									"Zzcomment": oComment,
									"ZzblkstartDate": BlockStartdate,
									"ZzblkendDate": Blockenddate,
									"ZcreatedBy": Createdby,
									"ZcreatedOn": Createdon

								};

								var sLocation = window.location.host;
								var sLocation_conf = sLocation.search("webide");

								if (sLocation_conf == 0) {
									that.sPrefix = "/vehicleLocatorNode";
								} else {
									that.sPrefix = "";

								}
								this.nodeJsUrl = this.sPrefix + "/node";
								that.oDataUrl = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";

								//	var AcceptUrl = that.oDataUrl + "/ModelBlockSet?$filter=ZzblockId eq'" + oBlockId + "&$format=json";

								that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
								that.oDataModel.setHeaders({
									"Content-Type": "application/json",
									"X-Requested-With": "XMLHttpRequest",
									"DataServiceVersion": "2.0",
									"Accept": "application/json",
									"Method": "POST"
								});
								//var oBlockId="/ModelBlockSet";
								that.oDataModel.create("/ModelBlockSet", oDNSBlock, null, function (s) {
									that.DncBlockDaysUpdate();
								}, function () {

								});

							},
							DncBlockDaysUpdate: function () {

								var that = this;
								var sLocation = window.location.host;
								var sLocation_conf = sLocation.search("webide");

								if (sLocation_conf == 0) {
									this.sPrefix = "/vehicleLocatorNode";
								} else {
									this.sPrefix = "";

								}

								this.nodeJsUrl = this.sPrefix + "/node";

								that.oDataUrl1 = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";
								that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl1, true);
								var ModelBlockSeturl = that.oDataUrl1 + "/ModelBlockSet?$format=json";

								var ajax2 = $.ajax({
									dataType: "json",
									xhrFields: //
									{
										withCredentials: true
									},
									url: ModelBlockSeturl,
									async: true,
									success: function (ModelBlockSeturl) {

										var ModelBlockSeturl = ModelBlockSeturl.d.results;

										var LoginBusinessPartnerCode = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;

										var FilteredBlockingDlr = ModelBlockSeturl.filter(function (x) {
											return x.ZzblockingDlr != null;
										});

										var FilteredBlockingDlr = FilteredBlockingDlr.filter(function (x) {
											return (x.ZzblockingDlr).slice(-5) == (LoginBusinessPartnerCode).slice(-5);
										});

										var oModel = new sap.ui.model.json.JSONModel(FilteredBlockingDlr);
										that.getView().byId("tableVTMBS").setModel(oModel);
									},
									error: function () {

									}
								});

							},

							onSelect: function () {
								debugger;

								var that = this;
								sap.ui.core.BusyIndicator.show();

								// /vehicleLocatorNode/node/Z_VEHICLE_MASTER_SRV/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'YZ3DCT' and zzsuffix eq 'ML' and zzmoyr eq '2018' and kunnr eq '2400042193'"	
								/*	var McCmbo = "YZ3DCT";
									this.SelectedExteriorColorCode = "";
									this.SelectedTrimInteriorColor = "";
									var SuffCmbo = "ML";
									var MoyearCombo = "2018";
									var oDealer = "2400042193";*/
								var oDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
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

								var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=kunnr eq '" + oDealer + "'";

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

										var Dealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;

										var FilterDelearNotnull = a.filter(function (x) {
											return x.kunnr != null;
										});
										/*	var FilterDeleade_OrderTypefiltered_zone=FilterDeleade_OrderTypefilteNotnull.filter(function(x){return x.kunnr.slice(-5)==Dealer &&(x.zzordertype=="DM" ||x.zzordertype=="SO")});*/

										//	var FilterDeleade_OrderTypefiltered_zone
										var filtered_ODealer = FilterDelearNotnull.filter(function (x) {
											return x.kunnr.slice(-5) == Dealer;
										});
										var ExcludeOrdType = [
											"RS",
											"F1",
											"F2",
											"F3",
											"F4",
											"F5"
										];
										var oExcludeOrdrtype = filtered_ODealer.filter(function (objFromA) {
											return !ExcludeOrdType.find(function (objFromB) {
												return objFromA.zzordertype === objFromB;
											});
										});

										/*var includeDnc = oExcludeOrdrtype.filter(function (x) {
						return x.dnc_ind == "Y";
					});
					var includeHoldStatus = includeDnc.filter(function (x) {
						return x.Hold_stat == "Y";
					});
					var oJsonModel = new sap.ui.model.json.JSONModel(includeHoldStatus);*/
					//comment this line
					var oJsonModel = new sap.ui.model.json.JSONModel(oExcludeOrdrtype);
					///////
										oJsonModel.setSizeLimit(1500);
										sap.ui.getCore().setModel(oJsonModel, "oVehicleSelectionResults");
										that.getRouter().navTo("VehicleTrade_VehicleSelection", {
											SelectedVehicleFrom: "VehicleTrade_ModelBlock_Summary"
										});
										sap.ui.core.BusyIndicator.hide();

									},
									error: function () {
										that.getRouter().navTo("VehicleTrade_VehicleSelection", {
											SelectedVehicleFrom: "VehicleTrade_ModelBlock_Summary"
										});
										sap.ui.core.BusyIndicator.hide();
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

				//selected language.	
				// if (window.location.search == "?language=fr") {
				if (sSelectedLocale == "fr") {
					var i18nModel = new sap.ui.model.resource.ResourceModel({
						bundleUrl: "i18n/i18n.properties",
						bundleLocale: ("fr")

					});
					this.getView().setModel(i18nModel, "i18n");
					this.sCurrentLocale = 'FR';
					// set the right image for logo	 - french		
					/*				var currentImageSource = this.getView().byId("idLexusLogo");
									currentImageSource.setProperty("src", "images/Lexus_FR.png");*/

				} else {
					var i18nModel = new sap.ui.model.resource.ResourceModel({
						bundleUrl: "i18n/i18n.properties",
						bundleLocale: ("en")

					});
					this.getView().setModel(i18nModel, "i18n");
					this.sCurrentLocale = 'EN';
					// set the right image for logo			
					/*				var currentImageSource = this.getView().byId("idLexusLogo");
									currentImageSource.setProperty("src", "images/Lexus_EN.png");*/

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
							
							

					});
			});