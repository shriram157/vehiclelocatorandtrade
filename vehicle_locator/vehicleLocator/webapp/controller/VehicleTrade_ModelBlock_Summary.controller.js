sap.ui.define([
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageBox',
	"sap/ui/core/routing/History",
	"vehicleLocator/Formatter/Formatter",
	"sap/ui/Device",
	"sap/ui/model/Sorter"
], function (BaseController, JSONModel, ResourceModel, MessageBox, History, Formatter, Device, Sorter) {
	"use strict";
	var Dealer_No;
	return BaseController.extend("vehicleLocator.controller.VehicleTrade_ModelBlock_Summary", {
		formatter: Formatter,
		onInit: function () {
			var _that = this;
			this._mViewSettingsDialogs = {};
				this.returningFromBPselect = false;

			var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
			var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
			this.getView().byId("oDealerCode9").setText(LoggedInDealerCode2);
			this.getView().byId("oDealerMdlBlkSumry").setText(LoggedInDealer);

			//Global date format
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			_that.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			
			   this.idCb = this.byId("inputblocknofdays");     ///VT_ARCDnc
               this.bindCombo();
			//***********Language translator functionality**********//
			/// set the logo and Language. 

			this._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				visibleByDefault: false,
				editAllowed: true,
				onlyShownoEditForChange: true,
				texttoshow: ""

			});

			this.getView().setModel(this._oViewModel, "detailView");

			this._setTheLanguage();

			this._setTheLogo();

			this.getRouter().getRoute("VehicleTrade_ModelBlock_Summary").attachPatternMatched(this.onRouteMatched, this);
			//this.getRouter().attachRouteMatched(this.onRouteMatched, this);
			/*	this.getRouter().attachRouteMatched(this.onRouteMatched, this);*/
		},

		onRouteMatched: function (oEvent) {
			// this._setTheLogo();

			//for zone user the below code ========================

			var that = this;
			 that.getView().byId("submitDNCId").setEnabled(true);
			var confirmZoneUser = sap.ui.getCore().getModel("LoginBpDealerModel").oData["0"].BusinessPartnerName;
		 if  (confirmZoneUser.includes("Zone User")  || confirmZoneUser.includes("National") )     {
				this.userType = "Zone";

				this._oViewModel.setProperty("/visibleByDefault", true);
				this._oViewModel.setProperty("/zoneUserDisplay", false);
				this._oViewModel.setProperty("/zoneUserDelete", "None");
				// --------------------
				// if it is first only bind the model, otehrwise do not bind the model again

				if (this.theFirstDefaultDealerSelected == "" || this.theFirstDefaultDealerSelected == undefined) {

					var zoneDealersForLoggedinZone = sap.ui.getCore().getModel("LoginBpDealerModel").getData();
					var BpDealer = [];

					$.each(zoneDealersForLoggedinZone, function (i, item) {

						if (i > 0) {
							BpDealer.push({
								"BusinessPartnerKey": item.BusinessPartnerKey,
								"BusinessPartner": item.BusinessPartner,
								"BusinessPartnerName": item.BusinessPartnerName,
								"Division": item.Division,
								"BusinessPartnerType": item.BusinessPartnerType,
						    	"searchTermReceivedDealerName":item.SearchTerm2,
						    	"dummyFieldForSort" : item.dummyFieldForSort
							});
						}
					});
					// set the model. 
					that.getView().setModel(new sap.ui.model.json.JSONModel(BpDealer), "BpDealerModelZone");

					// set the dealer model to the screen. 

					var theFirstDefaultDealer = this.getView().getModel("BpDealerModelZone").oData["0"].BusinessPartner;

					this.getView().byId("dealerID").setSelectedKey(theFirstDefaultDealer);
					this.theFirstDefaultDealerSelected = this.getView().getModel("BpDealerModelZone").oData["0"].BusinessPartnerKey;
					var dealerName = this.getView().getModel("BpDealerModelZone").oData["0"].BusinessPartnerName;
					this._oViewModel.setProperty("/DealerName", dealerName);
					var Dealer_No = this.theFirstDefaultDealerSelected;
				} else {
					var Dealer_No = this.theFirstDefaultDealerSelected;

				}
			
			 	if(Dealer_No.length == 10){
					Dealer_No=Dealer_No.slice(-5);
				}

				
			} else { // this is a dealer login, the existing logic as is. 
				this._oViewModel.setProperty("/visibleByDefault", false); // no combobox to be displayed. 
				this._oViewModel.setProperty("/zoneUserDisplay", true); //zoneUserDelete
				this._oViewModel.setProperty("/zoneUserDelete", "Delete");
				var Dealer_No = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].DealerCode;
			}

			// ==================================

			if (this.sCurrentLocale == 'FR') {

				var oViewModel = new sap.ui.model.json.JSONModel({
					SPRAS: "French"

				});
			} else {
				var oViewModel = new sap.ui.model.json.JSONModel({

					SPRAS: "English"

				});

			}

			this.getView().setModel(oViewModel, "languageModel");

			var that = this;
			// Dealer_No = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;

			if (oEvent != undefined) {
				var selectedTrade = oEvent.getParameter("arguments").SelectedTrade;
				if (selectedTrade != undefined && sap.ui.getCore().getModel("VehicleTrade_ModelBlock_SummaryTrade") != undefined) {

					var Vtn = sap.ui.getCore().getModel("VehicleTrade_ModelBlock_SummaryTrade").getData().zzvtn;
					this.getView().byId("oVtno").setText(Vtn);
				} else {
					this.getView().byId("oVtno").setText("");
				}
			} else {
				this.getView().byId("oVtno").setText("");
					this._setTheLanguage();
					this._setTheLogo();
			}

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}
			//=================<< Model Dec >>=====================================
			this.nodeJsUrl = this.sPrefix + "/userDetails";

			//=============================<< Model Block Reqs >>==========================================
			var Filter0 = new sap.ui.model.Filter('ZzblockingDlr', 'EQ', "24000" + Dealer_No);
			that.getView().byId('tableVTMBS').getBinding('items').filter([Filter0]);

			//==========================<< Dealers Details >>==========================================
			// var LoginBusinessPartnerCode = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;  //GSR1104
			var LoginBusinessPartnerCode = Dealer_No
			this.dealerNo = Dealer_No;
				//var LoginBusinessPartnerCode = sap.ui.getCore().LoginDetails.BussinesspartnerCode;
			// that.oDataUrl2 = this.nodeJsUrl + "/API_BUSINESS_PARTNER";
			
			that.oDataUrl2 = this.nodeJsUrl + "/dealers";
		
		//	that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl2, yes);// commented INC0234628 VL&T application metadata failure  Model Block  20-July-2023	shriram
                 var Businesspartnerurl = that.oDataUrl2;
			// var Businesspartnerurl = that.oDataUrl2 +
			// 	"/A_BusinessPartner/?$format=json&$expand=to_Customer&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004' or BusinessPartnerType eq 'Z005') and zstatus ne 'X' &$orderby=BusinessPartner asc";
            // if ( this.returningFromBPselect == false) {
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

			var that = this;
			$.when(ajax3).done(function (Businesspartnerurl) {
				

				// var Businesspartnerurl = Businesspartnerurl.d.results;
					var Businesspartnerurl = Businesspartnerurl.attributes;

				//	var LoginBusinessPartnerCode = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;  //GSR1104
				var LoginBusinessPartnerCode = that.dealerNo;

				//  remove the logged in USEr available LoginBusinessPartnerCode in Businesspartnerurl

				// for (var n = 0; n < Businesspartnerurl.length; n++) {
				
				for (var n = Businesspartnerurl.length - 1; n >= 0; n--) {

					let attributeFromSAP;
					try {
						// attributeFromSAP = Businesspartnerurl[n].to_Customer.Attribute1;
								attributeFromSAP = Businesspartnerurl[n].Attribute;  //Businesspartnerurl["0"].BPDivision
					} catch (e) {

						// return;
					}

					// var attributeFromSAP =  Businesspartnerurl[n].to_Customer.Attribute1;   // -  this tell the division   	
					var sapDivision;

					switch (attributeFromSAP) {
					case "01":
						sapDivision = "10";

						break;
					case "02":
						sapDivision = "20";

						break;
					case "03":
						// sapDivision = "Dual";
                      sapDivision =  this.sDivision ;
						break;
					case "04":
						sapDivision = "10";

						break;
					case "05":
						// sapDivision = "Dual";
						 sapDivision =  this.sDivision ;

						break;
					default:
						sapDivision = "10"; //  lets put that as a toyota dealer

					}
					// excclude 2400029000 2400029000 
					if (Businesspartnerurl[n].BusinessPartnerKey == "2400029000" || Businesspartnerurl[n].BusinessPartnerKey == "2400049000") {
							Businesspartnerurl.splice(n, 1);
								continue;;
					}

					if (that.sDivision == sapDivision) {
						// check if it is a logged in dealer remove else just return. 
						if (Businesspartnerurl[n].BusinessPartner == LoginBusinessPartnerCode) {
							// Businesspartnerurl.slice(n, 1);
							Businesspartnerurl.splice(n, 1);
							continue;;
						} else {
							// keep the record
							continue;
						}

					} else {

						if (that.sDivision != undefined) {
							// remove the record
							// Businesspartnerurl.slice(n, 1);
							Businesspartnerurl.splice(n, 1);
						}

					}

				}

				var Businesspartnerurl = Businesspartnerurl.filter(function (x) {
					return x.BusinessPartner != null;
				});

				// var oBussinesspartners = Businesspartnerurl.filter(function (value) {
				// 	return value.Customer.startsWith("24000");
				// });

				if (!that.getView().byId("VT_MBSdeal").getModel()) {
					var oModel = new sap.ui.model.json.JSONModel(Businesspartnerurl);
					that.getView().byId("VT_MBSdeal").setModel(oModel);
				}

			});
			
            // }
			
		},

		VehicleLocSearchPressMBS: function () {
			var that = this;
			that.getRouter().navTo("VehicleLocSearch");

		},
		TradeSummaryLinkPressMBS: function () {

			var that = this;
			that.getRouter().navTo("VehicleTrade_Summary", {
				DataClicked: "Yes"
			});

		},
		TradeHistoryLinkPressMBS: function () {
			var that = this;
			that.getRouter().navTo("VehicleTrade_History");

		},
		//=====================================
		//====<< Delete Rows >>===============
		//=====================================
		onDelete: function (oEvent) {
			var that = this;
			//	var oTable = that.getView().byId("tableVTMBS");

			var oTable = this.getView().byId("tableVTMBS");

			// var data = oTable.getSelectedIndices();
			var that = this;
			//.getBindingContext().getObject();
			var itemdelete = oEvent.getParameter('listItem').getBindingContextPath();
			var textFromi18n = this.getView().getModel("i18n").getResourceBundle().getText("DoyouwanttoDelete");
			var Delete_dialog = new sap.m.Dialog({
				title: 'Delete',
				type: 'Message',
				state: 'Warning',
				content: new sap.m.Text({
					text: textFromi18n
				}),
				beginButton: new sap.m.Button({
					text: 'Yes',
					press: function () {
						Delete_dialog.close();

						that.getView().getModel('ModelBlock').remove(itemdelete, null, function (s) {
							that.DncBlockDaysUpdate();
						}, function () {

						});

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

		},
		//=====================================
		//====<< Create >>===============
		//=====================================
		onSubmit_old: function () {
			
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

		onSubmit: function (oEvent) {
			
			var that = this;
			var oBlockId = 'X';
			var BlockingDealer = '24000' + sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
			var BlockedDealer = this.getView().byId("VT_MBSdeal").getSelectedKey();
			var oModelRequested = sap.ui.getCore().getModel("VehicleTrade_ModelBlock_SummaryTrade").getData().matnr;
			var oSeries = sap.ui.getCore().getModel("VehicleTrade_ModelBlock_SummaryTrade").getData().zzseries;

			var oCommentData = this.getView().byId("TypeHerid").getValue();

			// var oComment = [];
			// for (var i = 0; i < oCommentData.length; i++) {
			// 	oComment.push(oCommentData[i].Comment_Txt);
			// }
			// if (oComment.length != 0) {
			// 	var oComment = oComment.join(".");
			// } else {
			// 	var oComment = "testing";
			// }
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
			var Createdby = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
			/*	var Createdon = oDateFormat.format(new Date());*/
			var Createdon = "";
			var oDNSBlock = {
				"ZzblockId": oBlockId,
				"ZzblockedDlr": BlockedDealer,
				"ZzblockingDlr": BlockingDealer,
				"Zzmodel": oModelRequested,
				"Zzseries": oSeries,
				"Zzduration": dncBlockedDays,
				"Zzcomment": oCommentData,
				"ZzblkstartDate": BlockStartdate,
				"ZzblkendDate": Blockenddate,
				"ZcreatedBy": Createdby.substr(0, 12),
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
			
			that.getView().byId("TypeHerid").setValue("");
				// that.getView().byId("submitDNCId").setEnabled(false);
		    that.getView().byId("submitDNCId").setEnabled(false);
			
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}
			that.getView().byId('tableVTMBS').getBinding('items').refresh();
			// this.nodeJsUrl = this.sPrefix + "/node";

			// that.oDataUrl1 = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";
			// that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl1, true);
			// var ModelBlockSeturl = that.oDataUrl1 + "/ModelBlockSet?$format=json";

			// var ajax2 = $.ajax({
			// 	dataType: "json",
			// 	xhrFields: //
			// 	{
			// 		withCredentials: true
			// 	},
			// 	url: ModelBlockSeturl,
			// 	async: true,
			// 	success: function (ModelBlockSeturl) {

			// 		var ModelBlockSeturl = ModelBlockSeturl.d.results;

			// 		var LoginBusinessPartnerCode = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;

			// 		var FilteredBlockingDlr = ModelBlockSeturl.filter(function (x) {
			// 			return x.ZzblockingDlr != null;
			// 		});

			// 		var FilteredBlockingDlr = FilteredBlockingDlr.filter(function (x) {
			// 			return (x.ZzblockingDlr).slice(-5) == (LoginBusinessPartnerCode).slice(-5);
			// 		});

			// 		// var oModel = new sap.ui.model.json.JSONModel(FilteredBlockingDlr);
			// 		// that.getView().byId("tableVTMBS").setModel(oModel);
			// 	},
			// 	error: function () {

			// 	}
			// });

		},

		onSelect: function () {
			

			var that = this;
			that.getView().byId("submitDNCId").setEnabled(true);
				// var sSelectedDealer =this.getView().byId("").getSelectedKey();
			
			
			// this.requestedDealerToSAP = sSelectedDealer;
			// sap.ui.core.BusyIndicator.show();

			// /vehicleLocatorNode/node/Z_VEHICLE_MASTER_SRV/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'YZ3DCT' and zzsuffix eq 'ML' and zzmoyr eq '2018' and kunnr eq '2400042193'"	
			/*	var McCmbo = "YZ3DCT";
				this.SelectedExteriorColorCode = "";
				this.SelectedTrimInteriorColor = "";
				var SuffCmbo = "ML";
				var MoyearCombo = "2018";
				var oDealer = "2400042193";*/
// 			var oDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
// 			var sLocation = window.location.host;
// 			var sLocation_conf = sLocation.search("webide");

// 			if (sLocation_conf == 0) {
// 				this.sPrefix = "/vehicleLocatorNode";
// 			} else {
// 				this.sPrefix = "";

// 			}

// 			this.nodeJsUrl = this.sPrefix + "/node";
// 			that.oDataUrl = "/Z_VEHICLE_MASTER_SRV";

// 			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

// 			/*	var SeriesUrl= that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq 'YZ3DCT' and zzextcol eq '01D6' and zzintcol eq 'LC14' and zzsuffix eq 'AB' and zzmoyr eq '2018'";*/
// //1704 requesting dealer is introduced. 

// 			// var oDealer1 = userAttributesModellen[0].DealerCode;
// 			// if (oDealer1 == undefined){
// 			// 	oDealer1 = "";
// 			// }
//             var oDealer1 = this.requestedDealerToSAP;
//              if ( oDealer1 !== undefined) {
            
//         		 	if(oDealer1.length == 10){
// 		 	oDealer1=oDealer1.slice(-5);
// 					 } else {
// 					 	oDealer1 = "";
// 					 }		
//              } else {
//              		oDealer1 = "";
//              }
//  // if there is a series change, this needs to be accomodated. 
    			var oViewModel = new sap.ui.model.json.JSONModel({
				dropDownSelectedBP: this.requestedDealerToSAP

			});

			sap.ui.getCore().setModel(oViewModel, "dropDownSelectionData");
  

// 			var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate(Req_dealer='" + oDealer1 + "')/Set?$filter=kunnr eq '" + oDealer + "'";
  

			// $.ajax({
			// 	url: SeriesUrl,
			// 	type: "GET",
			// 	dataType: 'json',
			// 	xhrFields: //
			// 	{
			// 		withCredentials: true
			// 	},

			// 	success: function (odata, oresponse) {

			// 		var a = odata.d.results;

			// 		var Dealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;

			// 		var FilterDelearNotnull = a.filter(function (x) {
			// 			return x.kunnr != null;
			// 		});
			// 		/*	var FilterDeleade_OrderTypefiltered_zone=FilterDeleade_OrderTypefilteNotnull.filter(function(x){return x.kunnr.slice(-5)==Dealer &&(x.zzordertype=="DM" ||x.zzordertype=="SO")});*/

			// 		//	var FilterDeleade_OrderTypefiltered_zone
			// 		var filtered_ODealer = FilterDelearNotnull.filter(function (x) {
			// 			return x.kunnr.slice(-5) == Dealer;
			// 		});
			// 		var ExcludeOrdType = [
			// 			"RS",
			// 			"F1",
			// 			"F2",
			// 			"F3",
			// 			"F4",
			// 			"F5"
			// 		];
			// 		/*	var oExcludeOrdrtype = filtered_ODealer.filter(function (objFromA) {
			// 				return !ExcludeOrdType.find(function (objFromB) {
			// 					return objFromA.zzordertype === objFromB;
			// 				});
			// 			});*/
			// 		var oExcludeOrdrtype = [];
			// 		for (var i = filtered_ODealer.length - 1; i >= 0; --i) {
			// 			if (ExcludeOrdType.indexOf((filtered_ODealer[i].zzordertype)) == -1) {
			// 				ExcludeOrdType.push(filtered_ODealer[i]);
			// 			}
			// 		}

			// 		/*var includeDnc = oExcludeOrdrtype.filter(function (x) {
			// 			return x.dnc_ind == "Y";
			// 		});
			// 		var includeHoldStatus = includeDnc.filter(function (x) {
			// 			return x.Hold_stat == "Y";
			// 		});
			// 		var oJsonModel = new sap.ui.model.json.JSONModel(includeHoldStatus);*/
			// 		//comment this line
			// 		var oJsonModel = new sap.ui.model.json.JSONModel(oExcludeOrdrtype);
			// 		///////
			// 		oJsonModel.setSizeLimit(1500);
			// 		sap.ui.getCore().setModel(oJsonModel, "oVehicleSelectionResults");
			// 		that.getRouter().navTo("VehicleTrade_VehicleSelection", {
			// 			SelectedVehicleFrom: "VehicleTrade_ModelBlock_Summary"
			// 		});
			// 		sap.ui.core.BusyIndicator.hide();

			// 	},
			// 	error: function () {
			// 		that.getRouter().navTo("VehicleTrade_VehicleSelection", {
			// 			SelectedVehicleFrom: "VehicleTrade_ModelBlock_Summary"
			// 		});
			// 		sap.ui.core.BusyIndicator.hide();
			// 	}
			// });
that.getRouter().navTo("VehicleTrade_VehicleSelection", {
						SelectedVehicleFrom: "VehicleTrade_ModelBlock_Summary"
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
								currentImageSource.setProperty("src", "Images/Lexus_FR.png");*/

			} else {
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties",
					bundleLocale: ("en")

				});
				this.getView().setModel(i18nModel, "i18n");
				this.sCurrentLocale = 'EN';
				// set the right image for logo			
				/*				var currentImageSource = this.getView().byId("idLexusLogo");
								currentImageSource.setProperty("src", "Images/Lexus_EN.png");*/

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

		},
		onDealernum: function (oEvent) {
			var oElement = oEvent.getSource();
			var binding = oElement.getBinding("items");
			if (binding) {
				//Binding change event could already be attached
				var Filter = new sap.ui.model.Filter('Customer', 'EQ', oElement.getSelectedKey());
				binding.filter([Filter]);
			}
		},
		onSeriesnum: function (oEvent) {
			var oElement = oEvent.getSource();
			var binding = oElement.getBinding("items");
			if (binding) {
				//Binding change event could already be attached
				var Filter = new sap.ui.model.Filter('ModelSeriesNo', 'EQ', oElement.getSelectedKey());
				binding.filter([Filter]);
			}
		},
		onModelnum: function (oEvent) {
			var oElement = oEvent.getSource();
			var binding = oElement.getBinding("items");
			if (binding) {
				//Binding change event could already be attached
				var Filter = new sap.ui.model.Filter('Model', 'EQ', oElement.getSelectedKey());
				binding.filter([Filter]);
			}
		},
		handleSortButtonPressed: function () {

			this.createViewSettingsDialog("vehicleLocator.fragment.ModelBlockSortDialog").open();

		},
		createViewSettingsDialog: function (sDialogFragmentName) {
			var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;

				if (Device.system.desktop) {
					oDialog.addStyleClass("sapUiSizeCompact");
				}
			}
			this.getView().addDependent(oDialog); //GSR
			return oDialog;
		},
		handleSortDialogConfirm: function (oEvent) {
			var oTable = this.byId("tableVTMBS"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
			oBinding.refresh();
		},
		onBusinessPartnerSelected: function (oEvent) {
			this.getView().byId("submitDNCId").setEnabled(true);        

			var sSelectedDealer = oEvent.getParameter("\selectedItem").getProperty("key");
			
			
			this.requestedDealerToSAP = sSelectedDealer;
			var sSelectedDealerText = oEvent.getParameter("\selectedItem").getProperty("additionalText");
			var sSelectedText = oEvent.getParameter("\selectedItem").getProperty("text");

			this.theFirstDefaultDealerSelected = sSelectedDealer;
			// this._oViewModel.setProperty("/DealerName", sSelectedDealerText);
			// call the function to get the relevant data to screen again. 
			
						this._oViewModel.setProperty("/texttoshow", sSelectedDealerText);
			
			this.returningFromBPselect = true;
			this.onRouteMatched();

		},
		// ----------------------------

    bindCombo: function() {
        var data = [{
            "key": "0",
            "text": "0"
        }, {
            "key": "10",
            "text": "10"
        }, {
            "key": "20",
            "text": "20"
        }, {
            "key": "40",
            "text": "40"
        }];

        var oModel = new sap.ui.model.json.JSONModel(data);
        this.getView().setModel(oModel, "dncDays");
        
        this.idCb.attachBrowserEvent("keyup", function(event) {            
            var len = this.getItems().length;
            var enteredText = this.getValue();
            var bExists = false;
            for(var i=0;i<len;i++){
            	var itemText = this.getItems()[i].getProperty("text");              
              if(itemText == enteredText || itemText.startsWith(enteredText)){
              	bExists = true;
                break;
							}
            }
            if(bExists){
              this.setValueState(sap.ui.core.ValueState.None);
            }else{
              this.setValueState(sap.ui.core.ValueState.Error);
              this.setValue("");
            }
            
        });
    }
				

	});
});