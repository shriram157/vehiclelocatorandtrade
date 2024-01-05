var DefaultSuffix;
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"vehicleLocator/Formatter/Formatter"

], function (Controller, BaseController, ResourceModel, JSONModel, Sorter, Filter, Formatter) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleSearcResults", {

		onInit: function () {
			//define JSON model oDealersearchresults
			/*eslint eqeqeq: ["error", "smart"]*/
			this._oViewModel = new sap.ui.model.json.JSONModel();

			this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(); // instantiate the resource 

			// var that = this;

			if (!this._oResponsivePopover) {
				this._oResponsivePopover = sap.ui.xmlfragment("vehicleLocator.fragment.VehicleSearchResult", this);
				this._oResponsivePopover.setModel(this.getView().getModel());
			}
			// var oTable = this.getView().byId("table1VSR");

			sap.ushell.components.tableSearchResults = this.getView().byId("table1VSR");

			this.getView().setModel(sap.ui.getCore().getModel("SearchedData"), "VehicleLocatorScdScr");

			// initialize  local models and data calls

			var oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				tableCount: 40

			});

			this.getView().setModel(oViewModel, "detailView");

			/// set the logo and Language. 

			this._setTheLanguage();

			this._setTheLogo();
			this.comingFromSuffixChange = false;
			//	this.getRouter().attachRouteMatched(this.onRouteMatched, this);
			this.getRouter().getRoute("VehicleSearcResults").attachPatternMatched(this.onRouteMatched, this);
		},

		onSuffixChange: function (oEvent) {
			// 
			/*eslint eqeqeq: ["error", "smart"]*/
			sap.ui.core.BusyIndicator.show();
			sap.ui.getCore().SelectedStauts = this.getView().byId("VLRStatus").getSelectedKey();
			this.getOwnerComponent().suffixSelectedValue = this.getView().byId("VLRSuffix").getSelectedItem().getText();
			var SuffCmbo = this.getView().byId("VLRSuffix").getSelectedKey();
			if (SuffCmbo != "all" && SuffCmbo != "TOUS") {
				this.intercolor = oEvent.getParameter("selectedItem").getBindingContext().getObject().int_c;
				var that = this;
				that.value = this.getView().byId("VLRSuffix").getSelectedItem().getText();
				var SelectedMSMData = this.getOwnerComponent().SelectedMSMData;
				var SelectedZone = this.getOwnerComponent().SelectedZone;

				var LoginUser = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].UserType[0];
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

				// var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq '" + SelectedMSMData[0].McCmbo +
				// 	"' and endswith (zzintcol,'" + this.intercolor + "') and zzsuffix eq '" + SuffCmbo + "' and zzmoyr eq '" + SelectedMSMData[0].MoyearCombo +
				// 	"'&$format=json";

				var userAttributesModellen = that.getView().getModel("userAttributesModel").getData();
				var oDealer = userAttributesModellen[0].DealerCode;
				if (oDealer == undefined) {
					oDealer = "";
				}

				var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate(Req_dealer='" + oDealer + "')/Set?$filter=matnr eq '" + SelectedMSMData[
						0].McCmbo +
					"' and endswith (zzintcol,'" + this.intercolor + "') and zzsuffix eq '" + SuffCmbo + "' and zzmoyr eq '" + SelectedMSMData[0].MoyearCombo +
					"'&$format=json";

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

						var FilterDeleade_OrderTypefilteNotnull = filtered_zone.filter(function (x) {
							return x.kunnr != null;
						});
						var FilterDeleade_OrderTypefiltered_zone = FilterDeleade_OrderTypefilteNotnull.filter(function (x) {
							return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO");
						});

						//	var FilterDeleade_OrderTypefiltered_zone
						var FilterDeleade_OrderTypefiltered_zone = FilterDeleade_OrderTypefiltered_zone.filter(function (x) {
							return x.kunnr.slice(-5) != Dealer;
						});

						var oTCIcodes = [
							"2400500000", "2400542217", "2400500002", "2400500003", "2400500004", "2400500005",
							"2400500006", "2400500007", "2400500008", "2400500010", "2400500011", "2400500012",
							"2400500013", "2400500014", "2400500015", "2400500017", "2400500018", "2400500019",
							"2400500020", "2400500021", "2400500023", "2400500024", "2400500025", "2400500027",
							"2400500028", "2400500030", "2400500032", "2400500060", "2400500064", "2400500070",
							"2400500072", "2400500074", "2400500076", "2400500078", "2400500099", "2400500070",
							"2400500072", "2400500074", "2400500076", "2400500078"
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
							"2400507000", "2400517000", "2400547000", "2400557000", "2400577000", "2400507100", "2400517100",
							"2400547100", "2400557100", "2400577100", "2400500070", "2400500072", "2400500074", "2400500076",
							"2400500078", "2400517200", "2400517300", "2400517600", "2400517400", "2400517500", "2400557200",
							"2400577200", "2400577300", "2400517210", "2400517310", "2400517610", "2400517410", "2400517510"
						];

						var FilterZonestock = oExcludeTci.filter(function (x) {
							return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO")
						});
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
						that.comingFromSuffixChange = true;
						that.SuffixFilter();
						// that.onStatusChange();  // this is called inside the suffix filter so commenting out 

					},
					error: function (s, result) {
						sap.ui.core.BusyIndicator.hide();
						that.Nodata();
						sap.m.MessageBox.warning("No Data");
					}
				});
			} else {

				this.intercolor = "";
				var that = this;
				that.value = this.getView().byId("VLRSuffix").getSelectedItem().getText();
				var SelectedMSMData = this.getOwnerComponent().SelectedMSMData;
				var SelectedZone = this.getOwnerComponent().SelectedZone;

				var LoginUser = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].UserType[0];
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

				// var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq '" + SelectedMSMData[0].McCmbo +
				// 	"' and endswith (zzintcol,'" + this.intercolor + "') and zzseries eq '" + SelectedMSMData[0].SeriesCmbo + "' and zzmoyr eq '" +
				// 	SelectedMSMData[0].MoyearCombo + "'&$format=json";
				var userAttributesModellen = sap.ui.getCore().getModel("LoginuserAttributesModel").getData();
				var oDealer = userAttributesModellen[0].DealerCode;
				if (oDealer == undefined) {
					oDealer = "";
				}

				var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate(Req_dealer='" + oDealer + "')/Set?$filter=matnr eq '" + SelectedMSMData[
						0].McCmbo +
					"' and endswith (zzintcol,'" + this.intercolor + "') and zzseries eq '" + SelectedMSMData[0].SeriesCmbo + "' and zzmoyr eq '" +
					SelectedMSMData[0].MoyearCombo + "'&$format=json";

				$.ajax({
					url: SeriesUrl,
					type: "GET",
					dataType: 'json',
					xhrFields: //
					{
						withCredentials: true
					},

					success: function (odata, oresponse) {
						//
						var a = odata.d.results;

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
						var FilterDeleade_OrderTypefiltered_zone = FilterDeleade_OrderTypefilteNotnull.filter(function (x) {
							return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO");
						});

						//	var FilterDeleade_OrderTypefiltered_zone
						var FilterDeleade_OrderTypefiltered_zone = FilterDeleade_OrderTypefiltered_zone.filter(function (x) {
							return x.kunnr.slice(-5) != Dealer;
						});

						var oTCIcodes = [
							"2400500000", "2400542217", "2400500002", "2400500003", "2400500004", "2400500005", "2400500006", "2400500007",
							"2400500008", "2400500010", "2400500011", "2400500012", "2400500013", "2400500014", "2400500015", "2400500017",
							"2400500018", "2400500019", "2400500020", "2400500021", "2400500023", "2400500024", "2400500025", "2400500027",
							"2400500028", "2400500030", "2400500032", "2400500060", "2400500064", "2400500070", "2400500072", "2400500074",
							"2400500076", "2400500078", "2400500099", "2400500070", "2400500072", "2400500074", "2400500076", "2400500078"
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
							"2400507000", "2400517000", "2400547000", "2400557000", "2400577000", "2400507100", "2400517100", "2400547100",
							"2400557100", "2400577100", "2400500070", "2400500072", "2400500074", "2400500076", "2400500078", "2400517200",
							"2400517300", "2400517600", "2400517400", "2400517500", "2400557200", "2400577200", "2400577300", "2400517210",
							"2400517310", "2400517610", "2400517410", "2400517510"
						];

						var FilterZonestock = oExcludeTci.filter(function (x) {
							return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO");
						});

						var filteredArray = FilterZonestock.filter(function (array_el) {
							return oZoneIncludeData.filter(function (anotherOne_el) {
								return (anotherOne_el == array_el.kunnr && array_el.zzordertype == "DM");
							}).length == 0;
						});
						// console.log("final searched data", filteredArray);

						var suffixField = that.value;
						var oSuffmodel = new sap.ui.model.json.JSONModel(suffixField);
						oSuffmodel.setSizeLimit(10000);
						sap.ui.getCore().setModel(oSuffmodel, "oSuffieldmodel");
						/*var SuffixDataValue*/

						var SuffixDesc = sap.ui.getCore().getModel("VehicleLocatorSuffix").getData();

						var oDumModel = new sap.ui.model.json.JSONModel(filteredArray);
						oDumModel.setSizeLimit(100000);
						sap.ui.getCore().setModel(oDumModel, "SearchedData");

						var Status = sap.ui.getCore().getModel("SearchedData").getData();

						// 10th May,  if the Hold_stat is received as blank make it "N"

						for (var i = 0; i < Status.length; i++) {
							if (Status[i].Hold_stat == "") {
								Status[i].Hold_stat = "N";
							}
						}

						that.comingFromSuffixChange = true;
						that.SuffixFilter();

					},
					error: function (s, result) {
						sap.ui.core.BusyIndicator.hide();
						that.Nodata();
						sap.m.MessageBox.warning("No Data");
					}
				});

			}

		},
		onStatusChange: function () {

			//  when the control is reached here, we need to clear the filterbox
			this.getView().byId("searchVehicleList").setValue("");

			var filterArray = [];
			/*	this.getView().byId("table1VSR").getBinding("items").filter([]);*/
			// this.getView().byId("table1VSR").getBinding("rows").filter([]); guna

			// onVlrCommonChange
			this.SelectedDealer = this.getView().byId("VLRDealer").getSelectedKey();
			this.SelectedColor = this.getView().byId("VLRColor").getSelectedKey();

			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			if (Status != "") {
				/*this.getView().byId("VLRDealer").setSelectedKey("");
				this.getView().byId("VLRSuffix").setSelectedKey("");
				this.getView().byId("VLRColor").setSelectedKey("");*/
				if (Status == "1") {
					filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status));
				} else {
					filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.NE, "1"));
					// filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, "2"));
					//filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, "3"));

					//filterArray.push(new sap.ui.model.Filter({
					//       and: false,
					//       filters: [
					//          new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.EQ, "2"),
					//          new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.EQ, "3")
					//       ]})
					//  );			

				}
			}

			var Dealer = this.getView().byId("VLRDealer").getSelectedKey();

			if (Dealer != "" && Dealer != "all") {

				filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, Dealer));
			} else if (Dealer == "all") {

				// var SelDealers = this.getView().byId("table1VSR").getBinding("rows").getModel().getData();    //guna
				var SelDealers = this.getView().getModel("vehicleSearchTableModel").getData();

				for (var i = 0; i < SelDealers.length; i++) {
					filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, SelDealers[i].kunnr));
				}

			}
			var Suffix = this.suffixSelectedKey;
			if (Suffix != this.getView().byId("VLRSuffix").getSelectedKey()) {
				Suffix = this.getView().byId("VLRSuffix").getSelectedKey();
			}
			var value = this.getView().byId("VLRSuffix").getValue();
				if(value.includes("*")&& value.length==2)
				{
					var suf = value.slice(0,1);
					filterArray.push(new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.StartsWith, suf));
				}
			else if (Suffix != "" && Suffix != "all") {
				var suffixisNotequaltoAll = true;
			
				filterArray.push(new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, Suffix));
				
			} else if (Suffix == "all" || Suffix == "") {
				var suffixisNotequaltoAll = false;
				var SelSuffix = this.getView().byId("VLRSuffix").getModel().getData();
				for (var i = 0; i < SelSuffix.length; i++) {
					filterArray.push(new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, SelSuffix[i].zzsuffix));
				}
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "" && Color != "all") {

				filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, Color));

			} else if (Color == "all") {

				// var SelColor = this.getView().byId("table1VSR").getBinding("rows").getModel().getData(); //guna
				var SelColor = this.getView().getModel("vehicleSearchTableModel").getData();
				for (var i = 0; i < SelColor.length; i++) {
					// if (Status == "1") {
					// 	if ( SelColor[i].zz_trading_ind == "1") {
					// 		 if (suffixisNotequaltoAll == true && SelColor[i].zzsuffix == Suffix ) {
					// 		filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, SelColor[i].zzextcol));
					// 		 } else if (suffixisNotequaltoAll == false ){
					// 		 	filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, SelColor[i].zzextcol));	
					// 		 }
					// 	}
					// } else {
					// 	if (SelColor[i].zz_trading_ind == "2" || SelColor[i].zz_trading_ind == "3") {
					// 								 if (suffixisNotequaltoAll == true && SelColor[i].zzsuffix == Suffix ) {
					// 		filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, SelColor[i].zzextcol));
					// 		 } else if (suffixisNotequaltoAll == false){
					filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, SelColor[i].zzextcol));
					// 		 }
					// 	}
					// }

				}

			}
var selectedAccessInstalled = this.getView().byId("AcceInstalledCobmo").getSelectedKey();
			if (selectedAccessInstalled == "Yes") {
				//filterArray.push(new sap.ui.model.Filter("non_D_flag", sap.ui.model.FilterOperator.Contains,"X" ));
				filterArray.push(new sap.ui.model.Filter("pd_flag", sap.ui.model.FilterOperator.Contains, "D"));
				//filterArray.push(new sap.ui.model.Filter("non_D_flag", sap.ui.model.FilterOperator.Contains," " ));
			} else if ((selectedAccessInstalled == "No")) {
				filterArray.push(new sap.ui.model.Filter("pd_flag", sap.ui.model.FilterOperator.EQ, ""));
				//filterArray.push(new sap.ui.model.Filter("non_D_flag", sap.ui.model.FilterOperator.Contains, "X"));
				//filterArray.push(new sap.ui.model.Filter("non_D_flag", sap.ui.model.FilterOperator.Contains," " ));
			}
			var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
			if (ShowDoNotCallVehicles == true) {

				/*	filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, "Y"));*/
				filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, "Y"));
			} else if (ShowDoNotCallVehicles == false) {

				/*	filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, "Y"));*/
				filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, "N"));
			}

			var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
			if (ShowHoldVehicles == true) {

				/*filterArray.push(new sap.ui.model.Filter("Hold_stat", sap.ui.model.FilterOperator.EQ, "Y"));*/
				filterArray.push(new sap.ui.model.Filter("Hold_stat", sap.ui.model.FilterOperator.EQ, "Y"));
			} else if (ShowHoldVehicles == false) {

				/*filterArray.push(new sap.ui.model.Filter("Hold_stat", sap.ui.model.FilterOperator.EQ, "Y"));*/
				filterArray.push(new sap.ui.model.Filter("Hold_stat", sap.ui.model.FilterOperator.EQ, "N"));
			}

			this.byId("table1VSR")
				.getBinding("items")
				.filter(filterArray);

			var tableData = sap.ushell.components.tableSearchResults.getModel("vehicleSearchTableModel").getData();

			for (var i = 0; i < tableData.length; i++) {
				if (tableData[i].dnc_ind == "Y") {
					tableData[i].zzordertype = "DNC";
					tableData[i].visibleOrderType = true;

				} else {
					tableData[i].visibleOrderType = true;
					//tableData[i].zzordertype = "DNC";
				}
			}

		},

		onUpdateFinished: function (oEvent) {

			var oTable = this.getView().byId("table1VSR");

			if (oTable.getBinding("items").isLengthFinal()) {
				var iCount = oEvent.getParameter("total");
				// iItems = oTable.getItems().length;
				// sTitle += "(" + iItems + "/" + iCount + ")";
			}
			// this.getView().byId("title").setText(sTitle);

			var tableLength = iCount; //tableData.length;
			var oModelDetail = this.getView().getModel("detailView");

			var sExpectedText = this.getView().getModel("i18n").getResourceBundle().getText("tableCount", [tableLength]);
			oModelDetail.setProperty("/tableCount", sExpectedText);

		},

		DealarandColorBinding: function () {
			var SelectedDealer = this.getView().byId("VLRDealer").getSelectedKey();
			var SelectedColor = this.getView().byId("VLRColor").getSelectedKey();
			var Status = this.getView().byId("VLRStatus").getSelectedKey();

			var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
			if (ShowHoldVehicles == true) {
				var ShowHoldVehiclesSel = "Y";
			} else {
				var ShowHoldVehiclesSel = "N";
			}
			var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
			if (ShowDoNotCallVehicles == true) {
				var ShowDoNotCallVehiclesSel = "Y";
			} else {
				var ShowDoNotCallVehiclesSel = "N";
			}
			//var Data=this.getView().byId("table1VSR").getModel().getData();
			if (Status == "1") {

				// var FilteredTableData = this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"&&x.dnc_ind==ShowDoNotCallVehiclesSel&&x.Hold_stat==ShowHoldVehiclesSel});
				var FilteredTableData = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
					return x.zz_trading_ind == "1" && x.dnc_ind == ShowDoNotCallVehiclesSel && x.Hold_stat == ShowHoldVehiclesSel;
				});
			} else {
				var FilteredTableData = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
					return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3") && x.dnc_ind == ShowDoNotCallVehiclesSel && x.Hold_stat ==
						ShowHoldVehiclesSel;
				});
				// var FilteredTableData = this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2" || x.zz_trading_ind=="3")&&x.dnc_ind==ShowDoNotCallVehiclesSel&&x.Hold_stat==ShowHoldVehiclesSel});
			}
			var Dealer = FilteredTableData;
			var obj = {};
			for (var i = 0, len = Dealer.length; i < len; i++)
				obj[Dealer[i]['kunnr']] = Dealer[i];
			Dealer = new Array();
			for (var key in obj)
				Dealer.push(obj[key]);
			var Model1 = new sap.ui.model.json.JSONModel(Dealer);
			Model1.setSizeLimit(1000);
			this.getView().byId("VLRDealer").setModel(Model1);
			// if (Dealer.length != 0) {
			if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
					return x.mProperties.key == "all"
				}).length == 0) {

				if (this.sCurrentLocale == 'EN') {

					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRDealer").insertItem(newItem);
					this.getView().byId("VLRDealer").setSelectedKey(SelectedDealer);

				} else {

					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "TOUS"
					});
					this.getView().byId("VLRDealer").insertItem(newItem);
					this.getView().byId("VLRDealer").setSelectedKey(SelectedDealer);

				}

			}
			// } else {
			// 	if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
			// 			return x.mProperties.key == "all"
			// 		}).length == 0) {
			// 		var newItem = new sap.ui.core.Item({
			// 			key: "all",
			// 			text: "ALL"
			// 		});
			// 		this.getView().byId("VLRDealer").insertItem(newItem);
			// 		this.getView().byId("VLRDealer").setSelectedItem("ALL");
			// 		this.getView().byId("VLRDealer").setSelectedKey("all");
			// 	}

			// }

			var Color = FilteredTableData;
			var obj = {};
			for (var i = 0, len = Color.length; i < len; i++)
				obj[Color[i]['zzextcol']] = Color[i];
			Color = new Array();
			for (var key in obj)
				Color.push(obj[key]);
			var Model = new sap.ui.model.json.JSONModel(Color);
			// Model.setSizeLimit(1000);
			this.getView().byId("VLRColor").setModel(Model);
			//	if (Color.length != 0) {

			if (this.getView().byId("VLRColor").getItems().filter(function (x) {
					return x.mProperties.key == "all";
				}).length == 0) {

				if (this.sCurrentLocale == 'EN') {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRColor").insertItem(newItem);
					this.getView().byId("VLRColor").setSelectedKey(SelectedColor);

				} else {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "TOUS"
					});
					this.getView().byId("VLRColor").insertItem(newItem);
					this.getView().byId("VLRColor").setSelectedKey(SelectedColor);

				}

			}
			// } else {
			// 	if (this.getView().byId("VLRColor").getItems().filter(function (x) {
			// 			return x.mProperties.key == "all"
			// 		}).length == 0) {
			// 		var newItem = new sap.ui.core.Item({
			// 			key: "all",
			// 			text: "ALL"
			// 		});
			// 		this.getView().byId("VLRColor").insertItem(newItem);
			// 		this.getView().byId("VLRColor").setSelectedKey("all");
			// 		this.getView().byId("VLRColor").setSelectedItem("ALL");
			// 	}
			//	}

		},

		oTradeLinkPress: function (oEvt) {
			
			var that = this;
			//that.oTableSelectPath = oEvt.getSource().getParent().getBindingContext().getPath().split("/")[1]; //guna
			that.oTableSelectPath = oEvt.getSource().getParent().getBindingContext("vehicleSearchTableModel").getPath().split("/")[1];
			// sap.ui.getCore().VehicheSearcResults = this.getView().byId("table1VSR").getModel().getData(); //guna
			sap.ui.getCore().VehicheSearcResults = this.getView().byId("table1VSR").getModel("vehicleSearchTableModel").getData();
			// that.selectedTrade = oEvt.getSource().getParent().getBindingContext().getObject(); //guna
			that.selectedTrade = oEvt.getSource().getParent().getBindingContext("vehicleSearchTableModel").getObject();
			var VTN = that.selectedTrade.zzvtn;

			//  this should be the logged in dealer code. 23rd May

			// var dealercode = that.selectedTrade.kunnr.slice(-5);
			var userAttributesModellen = that.getView().getModel("userAttributesModel").getData();
			var dealercode = userAttributesModellen[0].DealerCode;

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}
			/*VTN="000571";
			 dealercode="53170";*/
			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";
			var SeriesUrl = that.oDataUrl + "/CalculateETASet?$filter=VTN eq '" + VTN + "' and DelearCode eq '" + dealercode + "'&$format=json";
			/* /CalculateETASet?$filter=VTN eq '000571' and DelearCode eq '53170'&$format=json*/
			var ajax = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},
				url: SeriesUrl,
				async: true,
				success: function (result) {
					//
					var Data = result.d.results[0];
					/*	if (Data.MessageType == "E") {
							Data.MessageType = "";
							Data.Calculate = "20181126";
						}*/
					if (Data.MessageType != "E") {
						var CurrentETAFrom = that.selectedTrade.zzadddata4;
						if (CurrentETAFrom != null && CurrentETAFrom != "") {

							CurrentETAFrom = CurrentETAFrom.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1');
						}
						var CurrentETATo = that.selectedTrade.pstsp;

						if (CurrentETATo != null && CurrentETATo != "") {
							var dateTo = CurrentETATo.split("(")[1];
							if (CurrentETATo.indexOf("+") != -1) {
								/*dateTo = dateTo.split("+")[0];*/
								CurrentETATo = new Date(CurrentETATo.split("(")[1].substring(0, 10) * 1000).toDateString().substring(4, 15);
								var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
									pattern: "MM/dd/yyyy"
								});
								CurrentETATo = oDateFormat.format(new Date(CurrentETATo));

							} else {
								dateTo = dateTo;
								var dataTo1 = dateTo.substring(0, dateTo.length - 5);
								var ValidTo = new Date(dataTo1 * 1000);
								ValidTo = ValidTo.toGMTString().substring(4, 16);
								var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
									pattern: "MM/dd/yyyy"
								});
								CurrentETATo = oDateFormat.format(new Date(ValidTo));
							}

						}

						var date1 = new Date(CurrentETAFrom);
						var date2 = new Date(CurrentETATo);
						var timeDiff = Math.abs(date2.getTime() - date1.getTime());
						var CurrentEtadiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

						function addDays(date, days) {
							var result = new Date(date);
							result.setDate(result.getDate() + days);
							return result;
						}
						var Eta = Data.Calculate;
						var Calculate = Eta.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1');
						var Proposed_ETA_To = addDays(Calculate, CurrentEtadiff);
						that.selectedTrade.Proposed_ETA_To = Proposed_ETA_To;
						that.selectedTrade.Proposed_ETA_From = Data.Calculate;
						//that.selectedTrade=escape(JSON.stringify(that.selectedTrade));


						var patt1 = /^P/;
						//changes by swetha for DMND0003618 on 9/1/2023
						if (that.selectedTrade.mmsta < "M110"   || patt1.test(that.selectedTrade.mmsta) || that.selectedTrade.vhvin == "") {
						
						// if (that.selectedTrade.mmsta < "M275" || patt1.test(that.selectedTrade.mmsta) || that.selectedTrade.vhvin == "") {
							that.selectedTrade.dispalyVin1 = false;
						} else {
							that.selectedTrade.dispalyVin1 = true;
						}
						that.selectedTrade.dispalyVin = false;
						sap.ui.getCore().SelectedTrade = that.selectedTrade;
						sap.ui.getCore().SelectedTradeStatus = "";
						if (that.oTableSelectPath != undefined) {
							that.getRouter().navTo("VehicleTrade_CreateSingle", {
								SelectedTrade: "VehicleSearchResults"
							});
							that.oTableSelect = undefined;
						} else {
							var plsSelectTrade = that._oResourceBundle.getText("plsSelectTrade");
							sap.m.MessageBox.warning(plsSelectTrade);
							that.oTableSelect = undefined;
						}

					} else {
						sap.ui.getCore().SelectedTrade = that.selectedTrade;
						var plsSelectTrade = that._oResourceBundle.getText("plsSelectTrade");
						sap.ui.getCore().SelectedTradeStatus = "";
						if (that.oTableSelectPath != undefined) {
							that.getRouter().navTo("VehicleTrade_CreateSingle", {
								SelectedTrade: "VehicleSearchResults"
							});
							that.oTableSelect = undefined;
						} else {
							sap.m.MessageBox.warning(plsSelectTrade);
							that.oTableSelect = undefined;
						}
					}

				},
				error: function () {
					sap.ui.getCore().SelectedTrade = that.selectedTrade;
					sap.ui.getCore().SelectedTradeStatus = "";

					var plsSelectTrade = that._oResourceBundle.getText("plsSelectTrade");
					if (that.oTableSelectPath != undefined) {
						that.getRouter().navTo("VehicleTrade_CreateSingle", {
							SelectedTrade: "VehicleSearchResults"
						});
						that.oTableSelect = undefined;
					} else {
						sap.m.MessageBox.warning(plsSelectTrade); //"Please select the trade"
						that.oTableSelect = undefined;
					}
				}

			});

		},
		//onRouteMatched: function(oEvent) {

		//},
		onRouteMatched: function (oEvent) {
			//
			// if the user is retruning by pressing the back button,  then it is better, that we dont refresh the data again. 
		this.getView().byId("VLRSuffix").setFilterFunction(function (sTerm, oItem) {
				sTerm = sTerm.split("*")[0];
				return oItem.getKey().match(new RegExp("^" + sTerm, "i"));
			});
			var Status = sap.ui.getCore().getModel("SearchedData").getData();

			// 10th May,  if the Hold_stat is received as blank make it "N"

			for (var i = 0; i < Status.length; i++) {
				if (Status[i].Hold_stat == "") {
					Status[i].Hold_stat = "N";
				}
			}

			var oModelForSearch = this.getView().getModel("vehicleSearchTableModel");
			if (oModelForSearch != undefined) {
				var searchTableAlreadsyBuilt = this.getView().getModel("vehicleSearchTableModel").getData().length;
				if ((searchTableAlreadsyBuilt != 0) && (Status.length == searchTableAlreadsyBuilt)) {
					return;
				}

			}

			var RoutedData = JSON.parse(oEvent.getParameter("arguments").LoginUser);
			this.RoutedData= RoutedData;
			DefaultSuffix = (RoutedData.selectedSuffix).replace(/\//g, "%2F");
			//	this.getView().byId("VLRSuffix").removeAllItems();
			var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
			var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
			this.getView().byId("oDealerCode2").setText(LoggedInDealerCode2);
			this.getView().byId("oDealersearchresults").setText(LoggedInDealer);

			var loginUser = oEvent.getParameter("arguments").LoginUser;
			if (loginUser == "Dealer_User") {
				var oTradecolId = this.getView().byId('TradecolId');
				oTradecolId.setVisible(oTradecolId.getVisible());

				this.getView().byId("table1VSR").setSelectionMode("None");

			}
			if (sap.ui.getCore().getModel("SearchedData") && sap.ui.getCore().getModel("oSuffieldmodel") != undefined) {
				this.getView().setModel(sap.ui.getCore().getModel("SearchedData"), "VehicleLocatorScdScr");

				/*	this.getView().setModel(sap.ui.getCore().getModel("oSuffieldmodel"),"VehicleLocatorScdScr");*/

				if (this.sCurrentLocaleD == "French") {

					var oViewModel = new sap.ui.model.json.JSONModel({
						SPRAS: "French"

					});
				} else {
					var oViewModel = new sap.ui.model.json.JSONModel({

						SPRAS: "English"

					});

				}

				this.getView().setModel(oViewModel, "languageModel");

				var statusmodel = new sap.ui.model.json.JSONModel(Status);
				// model.setSizeLimit(1000);
				this.getView().setModel(statusmodel, "vehicleSearchTableModel");

				var tableLength = this.getView().getModel("vehicleSearchTableModel").getData().length;
				var oModelDetail = this.getView().getModel("detailView");

				var sExpectedText = this.getView().getModel("i18n").getResourceBundle().getText("tableCount", [tableLength]);
				oModelDetail.setProperty("/tableCount", sExpectedText);

				var oProductNameColumn = this.getView().byId("matnr");
				// this.getView().byId("table1VSR").sort(oProductNameColumn, SortOrder.Ascending);   // guna

				var Dealer = sap.ui.getCore().getModel("SearchedData").getData();

				var Suffix = sap.ui.getCore().getModel("VehicleLocatorSuffix").getData();

				// var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language; //2603
				var SPRAS = this.sCurrentLocaleD;

				/*for(var i=0;i<Suffix.length;i++){
					Suffix[i].SPRAS=SPRAS;
				}*/
				var SuffixData = [];
				for (var i = 0; i < Suffix.length; i++) {
					var obj = {};
					obj.zzsuffix = Suffix[i].Suffix;
					obj.suffix_desc_en = Suffix[i].SuffixDescriptionEN;
					obj.suffix_desc_fr = Suffix[i].SuffixDescriptionFR;
					obj.mrktg_int_desc_en = Suffix[i].mrktg_int_desc_en;
					obj.mrktg_int_desc_fr = Suffix[i].mrktg_int_desc_fr;
					obj.int_c = Suffix[i].int_c;
					obj.SPRAS = Suffix[i].SPRAS;
					SuffixData.push(obj);
				}
				var Color = sap.ui.getCore().getModel("SearchedData").getData();
				var obj = {};

				if (DefaultSuffix == 'ALL' || DefaultSuffix == 'TOUS') {
					for (var i = 0, len = Color.length; i < len; i++)

					{
						if (Color[i].zz_trading_ind == "2" || Color[i].zz_trading_ind == "3") {
							obj[Color[i]['zzextcol']] = Color[i];
						}
					}
				} else {
					// if (DefaultSuffix.substring(0, 2))
					for (var i = 0, len = Color.length; i < len; i++)

					{
						if ((DefaultSuffix.substring(0, 2) == Color[i].zzsuffix) && (Color[i].zz_trading_ind == "2" || Color[i].zz_trading_ind == "3")) {
							obj[Color[i]['zzextcol']] = Color[i];
						}
					}

				}
				Color = new Array();
				for (var key in obj)
					Color.push(obj[key]);
				var Model = new sap.ui.model.json.JSONModel(Color);
				// Model.setSizeLimit(1000);
				this.getView().byId("VLRColor").setModel(Model);
				// if (Color.length != 0) {
				if (this.getView().byId("VLRColor").getItems().filter(function (x) {
						return x.mProperties.key == "all"
					}).length == 0) {

					if (this.sCurrentLocale == "EN") {
						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "ALL"
						});
						this.getView().byId("VLRColor").insertItem(newItem);
						this.getView().byId("VLRColor").setSelectedKey("all");
						this.getView().byId("VLRColor").setSelectedItem("ALL");
					} else {

						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "TOUS"
						});
						this.getView().byId("VLRColor").insertItem(newItem);
						this.getView().byId("VLRColor").setSelectedKey("all");
						this.getView().byId("VLRColor").setSelectedItem("TOUS");

					}

					// }
					// } else {
					// 	if (this.getView().byId("VLRColor").getItems().filter(function (x) {
					// 			return x.mProperties.key == "all"
					// 		}).length == 0) {
					// 		var newItem = new sap.ui.core.Item({
					// 			key: "all",
					// 			text: "ALL"
					// 		});
					// 		this.getView().byId("VLRColor").insertItem(newItem);
					// 		this.getView().byId("VLRColor").setSelectedKey("all");
					// 		this.getView().byId("VLRColor").setSelectedItem("ALL");
					// 	}
				}
			}
			// lets reset the model to initial before setting - the controller is not setting the selected value correctly without this. 
			var oModel = [];
			var oModel = new sap.ui.model.json.JSONModel(oModel);
			this.getView().byId("VLRSuffix").setModel(oModel);

			var suffixModel = new sap.ui.model.json.JSONModel(SuffixData);
			// Model.setSizeLimit(1000);
			this.getView().byId("VLRSuffix").setModel(suffixModel);

			// this.getView().byId("VLRSuffix").setSelectedItem(DefaultSuffix);
			// for (var s = 0; s < SuffixData.length; s++) {
			// 	if (DefaultSuffix == SuffixData[s].zzsuffix + "-" + SuffixData[s].suffix_desc_en + "/" + SuffixData[s].mrktg_int_desc_en) {
			// 		this.getView().byId("VLRSuffix").setSelectedItem(SuffixData[s].zzsuffix + "-" + SuffixData[s].suffix_desc_en + "/" + SuffixData[s]
			// 			.mrktg_int_desc_en);

			// 	}
			// }
			
			if (SuffixData.length != 0) {

				if (this.getView().byId("VLRSuffix").getItems().filter(function (x) {
						return x.mProperties.key == "all"
					}).length == 0) {

					if (this.sCurrentLocale == 'EN') {
						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "ALL"
						});
						this.getView().byId("VLRSuffix").insertItem(newItem);
					} else {

						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "TOUS"
						});
						this.getView().byId("VLRSuffix").insertItem(newItem);

					}

				}
			}

			for (var s = 0; s < SuffixData.length; s++) {
				if (DefaultSuffix == SuffixData[s].zzsuffix + "-" + SuffixData[s].suffix_desc_en + "/" + SuffixData[s].mrktg_int_desc_en) {
					this.getView().byId("VLRSuffix").setSelectedItem(SuffixData[s].zzsuffix + "-" + SuffixData[s].suffix_desc_en + "/" + SuffixData[s]
						.mrktg_int_desc_en);

				}
			}

			var obj = {};
			for (var i = 0, len = Status.length; i < len; i++)
				obj[Status[i]['zz_trading_ind']] = Status[i];
			Status = new Array();
			for (var key in obj)
				Status.push(obj[key]);
			var StatusDataFilter = [];
			for (var i = 0; i < Status.length; i++) {
				if (Status[i].zz_trading_ind == "1" || Status[i].zz_trading_ind == "2") {
					StatusDataFilter.push(Status[i]);
				}
			}
			if (StatusDataFilter.length == 0) {
				StatusDataFilter = [{
					"zz_trading_ind": "1"

				}, {
					"zz_trading_ind": "2"
				}];
			}
			/*Status.splice(-1,1);*/
			var statusDataModel = new sap.ui.model.json.JSONModel(StatusDataFilter);
			// Model.setSizeLimit(1000);

			var StatusFilter = StatusDataFilter.filter(function (x) {
				return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3");
			});
			var Statusind1 = StatusDataFilter.filter(function (x) {
				return (x.zz_trading_ind == "1");
			});

			/*Added changes for accesories installed dropdown start*/
			var accessoryModel = new sap.ui.model.json.JSONModel();
			var accesoriesInstalledFilter = [{
					"zaccesories": "All"

				}, {
					"zaccesories": "Yes"
				}
				, {
					"zaccesories": "No"
				}];
				accessoryModel.setData(accesoriesInstalledFilter);
			this.getView().byId("AcceInstalledCobmo").setModel(accessoryModel);
			this.getView().byId("AcceInstalledCobmo").setSelectedKey("All");
			
			/*Added changes for accesories installed dropdown end*/

			this.getView().byId("VLRStatus").setModel(statusDataModel);
			if (StatusFilter.length != 0) {

				if (this.sCurrentLocale == 'EN') {
					this.getView().byId("VLRStatus").setSelectedItem("Pipeline - Routable");
				} else {
					this.getView().byId("VLRStatus").setSelectedItem("Chaîne d'approvisionnement – acheminable");
				}

				this.getView().byId("VLRStatus").setSelectedKey("2");

			} else if (StatusDataFilter.length != 0) {

				if (this.sCurrentLocale == 'EN') {

					var newItem = new sap.ui.core.Item({
						key: "2",
						text: "Pipeline - Routable"
					});

					this.getView().byId("VLRStatus").insertItem(newItem);
					this.getView().byId("VLRStatus").setSelectedItem("Pipeline - Routable");
					this.getView().byId("VLRStatus").setSelectedKey("2");

				} else {
					var newItem = new sap.ui.core.Item({
						key: "2",
						text: "Chaîne d'approvisionnement – acheminable"
					});

					this.getView().byId("VLRStatus").insertItem(newItem);
					this.getView().byId("VLRStatus").setSelectedItem("Chaîne d'approvisionnement – acheminable");
					this.getView().byId("VLRStatus").setSelectedKey("2");

				}

			}
			if (Statusind1.length == 0) {
				if (this.sCurrentLocale == 'EN') {

					var newItem = new sap.ui.core.Item({
						key: "1",
						text: "Stock-Non-Routable"
					});
					this.getView().byId("VLRStatus").insertItem(newItem);

				} else {

					var newItem = new sap.ui.core.Item({
						key: "1",
						text: "Stock-non-acheminable"
					});
					this.getView().byId("VLRStatus").insertItem(newItem);

				}
			}
			//  the default view (Defect 13856) should build the Dealer drop down on records for the stock routable. 

			var obj = {};
			for (var i = 0, len = Dealer.length; i < len; i++) {
				//  when the app is started just display the dealers with status pipeline - routable.  - GSR 0806 - Defect 13856
				if (Dealer[i].zz_trading_ind == "2" || Dealer[i].zz_trading_ind == "3") {
					obj[Dealer[i]['kunnr']] = Dealer[i];
				}
			}

			Dealer = new Array();
			for (var key in obj) {

				Dealer.push(obj[key]);

			}

			var Model1 = new sap.ui.model.json.JSONModel(Dealer);
			Model1.setSizeLimit(1000);
			this.getView().byId("VLRDealer").setModel(Model1);
			// if (Dealer.length != 0) {
			if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
					return x.mProperties.key == "all"
				}).length == 0) {
				if (this.sCurrentLocale == 'EN') {

					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRDealer").insertItem(newItem);
					this.getView().byId("VLRDealer").setSelectedItem("ALL");
					this.getView().byId("VLRDealer").setSelectedKey("all");
				} else {

					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "TOUS"
					});
					this.getView().byId("VLRDealer").insertItem(newItem);
					this.getView().byId("VLRDealer").setSelectedItem("TOUS");
					this.getView().byId("VLRDealer").setSelectedKey("all");

				}

				// }
				// } else {
				// 	if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
				// 			return x.mProperties.key == "all"
				// 		}).length == 0) {

				// 		var newItem = new sap.ui.core.Item({
				// 			key: "all",
				// 			text: "ALL"
				// 		});
				// 		this.getView().byId("VLRDealer").insertItem(newItem);
				// 		this.getView().byId("VLRDealer").setSelectedItem("ALL");
				// 		this.getView().byId("VLRDealer").setSelectedKey("all");
				// 	}

			}

			{

				var filterArray = [];

				var Status = this.getView().byId("VLRStatus").getSelectedKey();
				if (Status != "") {
					if (Status == "1") {
						filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status));
					} else {

						//filterArray.push(new sap.ui.model.Filter({
						//      and: false,
						//      filters: [
						//         new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.EQ, "2"),
						//         new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.EQ, "3")
						//      ]})
						//);						

						filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.NE, "1"));
						// filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, "2"));
						// filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, "3"));
					}
				}
				var Dealer = this.getView().byId("VLRDealer").getSelectedKey();

				var Suffix = this.getView().byId("VLRSuffix").getSelectedKey();
				if (Suffix != "" && Suffix != "all") {

					filterArray.push(new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, Suffix));
				} else if (Suffix == "all") {
					var SelSuffix = this.getView().byId("VLRSuffix").getModel().getData();
					for (var i = 0; i < SelSuffix.length; i++) {
						filterArray.push(new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, SelSuffix[i].zzsuffix));
					}

				}
				var Color = this.getView().byId("VLRColor").getSelectedKey();

				var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();

				var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();

			}

			var suffixDropDown = this.getView().byId("VLRSuffix");
			//	this.getOwnerComponent().suffixSelectedValue;
			for (var i = 0; i < suffixDropDown.getItems().length; i++) {
				if (this.getOwnerComponent().suffixSelectedValue === suffixDropDown.getItems()[i].getText()) {
					//suffixDropDown.setSelectedKey(suffixDropDown.getItems()[i].getKey());
					this.suffixSelectedKey = suffixDropDown.getItems()[i].getKey();
					suffixDropDown.setSelectedItem(suffixDropDown.getItems()[i]);

					//this.textToSetForDropdown = suffixDropDown.getItems()[i];
					// suffixDropDown.setSelectedItem(this.getOwnerComponent().suffixSelectedValue);

				}
			}
			// just run the status change filter one time on every route matched. 
			//          this.comingFromRoutematchedEvent = true;
			this.onStatusChange();

		},

		onDealerSelected: function (oEvent) {

			var selectedCustomerT = this.getView().byId("dealerID").getValue();
			var sSelectedMatnr = oEvent.getParameter("\selectedItem").getProperty("key");
			var sSelectedMatnrText = oEvent.getParameter("\selectedItem").getProperty("additionalText");

			this._selectedDealerModel.setProperty("/Dealer_No", sSelectedMatnr);
			this._selectedDealerModel.setProperty("/Dealer_Name", sSelectedMatnrText);

		},
		// DemoVehiclepress:function(oEvent){
		// 	that.getRouter().navTo("DemoVehicleSearchResults", {
		// 					LoginUser: JSON.stringify(Obj)
		// 				});
		// },
		DemoVehiclepress:function(oEvent){
				var Obj = {};
				
					// var RoutedData = JSON.parse(oEvent.getParameter("arguments").LoginUser);
					var LoginUser = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].UserType[0];
			DefaultSuffix = (this.RoutedData.selectedSuffix).replace(/\//g, "%2F");
					Obj.selectedSuffix = DefaultSuffix;
					Obj.LoginUser = LoginUser;
					Obj.userTypeReceived = this.userTypeReceived;
						Obj.type = "2C";
					sap.ui.core.BusyIndicator.hide();

					// if (that.userTypeReceived == "Zone_User" || that.userTypeReceived == "National") {

					// 	that.getRouter().navTo("VehicleSearcResultsForZoneUser", {
					// 		LoginUser: JSON.stringify(Obj)
					// 	});

					// } else {

						this.getRouter().navTo("DemoVehicleSearchResults", {
							LoginUser: JSON.stringify(Obj)
						});
					// }
		},
			PreregisteredVehiclepress:function(oEvent){
				var Obj = {};
				
					// var RoutedData = JSON.parse(oEvent.getParameter("arguments").LoginUser);
					var LoginUser = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].UserType[0];
			DefaultSuffix = (this.RoutedData.selectedSuffix).replace(/\//g, "%2F");
					Obj.selectedSuffix = DefaultSuffix;
					Obj.LoginUser = LoginUser;
					Obj.userTypeReceived = this.userTypeReceived;
						Obj.type = "1B";
					sap.ui.core.BusyIndicator.hide();

					// if (that.userTypeReceived == "Zone_User" || that.userTypeReceived == "National") {

					// 	that.getRouter().navTo("VehicleSearcResultsForZoneUser", {
					// 		LoginUser: JSON.stringify(Obj)
					// 	});

					// } else {

						this.getRouter().navTo("DemoVehicleSearchResults", {
							LoginUser: JSON.stringify(Obj)
						});
					// }
		},
		onAccesoriesInstalledsChange: function(){
			this.onStatusChange();
		},
		handleExporttohecls: function () {

			// oTable.getModel().setSizeLimit(1000).

			// var Context = this.getView().byId("table1VSR").getBinding("rows").getContexts(); //guna
			// var Context = this.getView().byId("table1VSR").getBinding("items").getContexts().setSizeLimit(1000);
			var Context = this.getView().byId("table1VSR").getBinding("items").getContexts(0, 3000);
			var SelectedDealer = this.getView().byId("VLRDealer").getSelectedKey();
			var SelectedColor = this.getView().byId("VLRColor").getSelectedKey();
			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			var selectedSuffix = this.getView().byId("VLRSuffix").getSelectedKey();
			var exportNoDataToExcel = this.getView().getModel("i18n").getResourceBundle().getText("exportNoDataToExcel");
			if (Context.length == 0) {

				sap.m.MessageBox.warning(exportNoDataToExcel); //"No data is available to export to excel"
				return;
			} else {

				// if (SelectedDealer == "all" && SelectedColor == "all" && Status == "2" && selectedSuffix == "all") {

				// 	var items = this.getView().getModel("vehicleSearchTableModel").getData();
				// } else {
				var items = Context.map(function (oEvent) {
					return oEvent.getObject();
				});
				// }

				this.JSONToCSVConvertor(items, "Vehicle Trade History", true);
			}
		},
		JSONToCSVConvertor: function (JSONData, ReportTitle, ShowLabel) {
			var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			var CSV = "";
			if (ShowLabel) {
				var row = "";
				row = row.slice(0, -1);
			}

			var i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
			var VTN = i18n.getText("VTN");
			var Dealer = i18n.getText("Dealer");
			var Model = i18n.getText("Model");
			var Suffix = i18n.getText("Suffix");
			var APX = i18n.getText("APX");
			var Color = i18n.getText("Color");
			var OrderType = i18n.getText("OrderType");
			var ETAFrom = i18n.getText("ETAFrom");
			var ETATo = i18n.getText("ETATo");
			var AccessoryInstall = i18n.getText("AccessoryInstall");
			var City = i18n.getText("City");
			var Province = i18n.getText("Province");

			row += VTN + ",";
			row += Dealer + ",";
			row += Model + ",";
			row += Suffix + ",";
			row += Color + ",";
			row += APX + ",";
			
			row += OrderType + ",";
			row += ETAFrom + ",";
			row += ETATo + ",";
			row += AccessoryInstall + ",";
			row += City + ",";
			row += Province + ",";

			CSV += row + '\r\n';

			//loop is to extract each row
			for (var i = 0; i < arrData.length; i++) {
				var row = "";
				var zzvtn = (arrData[i].zzvtn);
				var kunnr = (arrData[i].kunnr).slice(-5) + "-" + arrData[i].name1;
				// var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language; //2603
				var SPRAS = this.sCurrentLocaleD;

				// 
				// if (SPRAS != "English") {
				// 	var matnr = arrData[i].matnr + "-" + arrData[i].model_desc_fr;
				// 	var zzextcol = arrData[i].zzextcol + "-" + arrData[i].mktg_desc_fr;
				// 	var zzsuffix = arrData[i].zzsuffix + "-" + arrData[i].suffix_desc_fr + "/" + arrData[i].mrktg_int_desc_fr;
				// } else {

				if (SPRAS == "English") {
					var matnr = arrData[i].matnr + "-" + arrData[i].model_desc_en;
					var zzextcol = arrData[i].zzextcol + "-" + arrData[i].mktg_desc_en;
					var zzsuffix = arrData[i].zzsuffix + "-" + arrData[i].suffix_desc_en + "/" + arrData[i].mrktg_int_desc_en;
				} else {

					var matnr = arrData[i].matnr + "-" + arrData[i].model_desc_fr;
					var zzextcol = arrData[i].zzextcol + "-" + arrData[i].mktg_desc_fr;
					var zzsuffix = arrData[i].zzsuffix + "-" + arrData[i].suffix_desc_fr + "/" + arrData[i].mrktg_int_desc_fr;
				}

				var zzordertype = "";
				switch (arrData[i].zzordertype) {
				case "SO":
					// zzordertype = "STOCK Open";
					zzordertype = this.getView().getModel("i18n").getResourceBundle().getText("Stockopen");

					break;
				case "SR":
					// zzordertype = "STOCK Restricted";
					zzordertype = this.getView().getModel("i18n").getResourceBundle().getText("StockRestricted");
					break;
				case "DM":
					// zzordertype = "DEMO";
					zzordertype = this.getView().getModel("i18n").getResourceBundle().getText("Demo");

					break;
				case "BA":
					// zzordertype = "BANK ALLOC";
					zzordertype = this.getView().getModel("i18n").getResourceBundle().getText("BankAllocatation");

					break;
				case "LS":
					// zzordertype = "LAUNCH Stock";
					zzordertype = this.getView().getModel("i18n").getResourceBundle().getText("LaunchStock");

					break;
				case "RS":
					// zzordertype = "RETAIL SOLD";
					zzordertype = this.getView().getModel("i18n").getResourceBundle().getText("RetailSold");
					break;
				case "F1":
					// zzordertype = "DLR RAC";
					zzordertype = this.getView().getModel("i18n").getResourceBundle().getText("Dlrrac");
					break;
				case "F2":
					// zzordertype = "DLR ELITE";
					zzordertype = this.getView().getModel("i18n").getResourceBundle().getText("DlrElite");
					break;
				case "F3":
					// zzordertype = "NAT RAC";
					zzordertype = this.getView().getModel("i18n").getResourceBundle().getText("Natrac");
					break;
				case "F4":
					// zzordertype = "NAT ELITE";
					zzordertype = this.getView().getModel("i18n").getResourceBundle().getText("NatElite");
					break;
				case "F5":
					// zzordertype = "MOBILITY";
					zzordertype = this.getView().getModel("i18n").getResourceBundle().getText("Mobility");
					break;

				}

				if (arrData[i].zzadddata4 != null && arrData[i].zzadddata4 != "") {
					//	var zzadddata4 =
					var userDate = arrData[i].zzadddata4;
					/*	arrData[i].zzadddata4=arrData[i].zzadddata4.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1');*/
					//function convertDate(userDate) {
					var DateFor = userDate.substr(4, 2) + "-" + userDate.substr(6, 2) + "-" + userDate.substr(0, 4);
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd"
					});
					var zzadddata4 = oDateFormat.format(new Date(DateFor));

					//	}

				} else {
					var zzadddata4 = "";
					// arrData[i].push(zzadddata4);
				}

				if (arrData[i].pstsp != null && arrData[i].pstsp != "") {
					var dateTo = arrData[i].pstsp.split("(")[1];
					if (arrData[i].pstsp.indexOf("+") != -1) {
						/*dateTo = dateTo.split("+")[0];*/
						var pstsp = new Date(arrData[i].pstsp.split("(")[1].substring(0, 10) * 1000).toDateString().substring(4, 15);
						var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "yyyy-MM-dd"
						});
						pstsp = oDateFormat.format(new Date(pstsp));

					} else {
						dateTo = dateTo;
						var dataTo1 = dateTo.substring(0, dateTo.length - 5);
						var ValidTo = new Date(dataTo1 * 1000);
						ValidTo = ValidTo.toGMTString().substring(4, 16);
						var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
							pattern: "MM-dd-yyyy"
						});
						var pstsp = oDateFormat.format(new Date(ValidTo));

					}

				} else {
					var pstsp = "";
				}

				// if (arrData[i].z_pd_flag == false) {
				// 	var z_pd_flag = "No";
				// } else if (arrData[i].z_pd_flag == true) {
				// 	var z_pd_flag = "Yes";
				// }

				if ((arrData[i].pd_flag == false) || (arrData[i].pd_flag == "")) {
					// var z_pd_flag = "No";
					var z_pd_flag = this.getView().getModel("i18n").getResourceBundle().getText("No");

				} else if ((arrData[i].pd_flag == true) || (arrData[i].pd_flag == "D")) {
					// var z_pd_flag = "Yes";
					var z_pd_flag = this.getView().getModel("i18n").getResourceBundle().getText("Yes");
				}

				row += '="' + zzvtn + '",="' + kunnr + '","' + matnr + '","' + zzsuffix +
					'",="' + zzextcol + '",="' + arrData[i].zzapx + '",="' + zzordertype + '",="' + zzadddata4 +
					'",="' + pstsp +
					'","' + z_pd_flag + '","' + arrData[i].ort01 + '","' + arrData[i].bezei + '",';
				//}
				row.slice(1, row.length);
				CSV += row + '\r\n';
			}
			if (CSV == "") {
				/*	alert("Invalid data");*/
				return;
			}
			var fileName = "VehicleTradeDetailsReport";
			fileName += ReportTitle.replace(/ /g, "_");
			// Initialize file format you want csv or xls

			var blob = new Blob(["\ufeff" + CSV], {
				type: "text/csv;charset=utf-8,"
			});
			if (sap.ui.Device.browser.name === "ie" || sap.ui.Device.browser.name === "ed") { // IE 10+ , Edge (IE 12+)
				navigator.msSaveBlob(blob, "VehicleTradeReport.csv");
			} else {
				var uri = 'data:text/csv;charset=utf-8,' + "\ufeff" + encodeURIComponent(CSV); //'data:application/vnd.ms-excel,' + escape(CSV);
				var link = document.createElement("a");

				link.href = uri;
				link.style = "visibility:hidden";
				link.download = fileName + ".csv";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}

		},
		onAfterRendering: function () {
			var that = this;

		},

		onOpen: function (oEvent) {
			//On Popover open focus on Input control
			var oPopover = sap.ui.getCore().byId(oEvent.getParameter("id"));
			var oPopoverContent = oPopover.getContent()[0];
			var oCustomListItem = oPopoverContent.getItems()[2];
			var oCustomContent = oCustomListItem.getContent()[0];
			var oInput = oCustomContent.getItems()[1];
			oInput.focus();
			//	oInput.$().find('.sapMInputBaseInner')[0].select();
		},

		handlebacksearch: function () {
			this.getView().byId("chknew").setSelected(false);
			this.getView().byId("chkexi").setSelected(false);
			this.getView().byId("VLRSuffix").setValue("");
			this.getRouter().navTo("VehicleLocSearch");
			// this.getView().byId("VLRSuffix").updateBindings();
			//when the back button is presssed, lets reset the existing model. 
			var Status = [];
			var model = new sap.ui.model.json.JSONModel(Status);
			this.getView().setModel(model, "vehicleSearchTableModel");

		},
		SuffixFilter: function () {

			if (sap.ui.getCore().getModel("SearchedData") && sap.ui.getCore().getModel("oSuffieldmodel") != undefined) {
				this.getView().setModel(sap.ui.getCore().getModel("SearchedData"), "VehicleLocatorScdScr");

				var Status = sap.ui.getCore().getModel("SearchedData").getData();
				var model = new sap.ui.model.json.JSONModel(Status);
				// model.setSizeLimit(1000);
				// this.getView().byId("table1VSR").setModel(model); //guna
				this.getView().setModel(model, "vehicleSearchTableModel");

				var tableLength = this.getView().getModel("vehicleSearchTableModel").getData().length;
				var oModelDetail = this.getView().getModel("detailView");

				var sExpectedText = this.getView().getModel("i18n").getResourceBundle().getText("tableCount", [tableLength]);
				oModelDetail.setProperty("/tableCount", sExpectedText);

				var oProductNameColumn = this.getView().byId("matnr");
				// this.getView().byId("table1VSR").sort(oProductNameColumn, SortOrder.Ascending); //guna
				var Dealer = sap.ui.getCore().getModel("SearchedData").getData();

				var Suffix = sap.ui.getCore().getModel("VehicleLocatorSuffix").getData();
				// var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language; //2603
				var SPRAS = this.sCurrentLocaleD;
				/*for(var i=0;i<Suffix.length;i++){
					Suffix[i].SPRAS=SPRAS;
				}*/
				var SuffixData = [];
				for (var i = 0; i < Suffix.length; i++) {
					var obj = {};
					obj.zzsuffix = Suffix[i].Suffix;
					obj.suffix_desc_en = Suffix[i].SuffixDescriptionEN;
					obj.suffix_desc_fr = Suffix[i].SuffixDescriptionFR;
					obj.mrktg_int_desc_en = Suffix[i].mrktg_int_desc_en;
					obj.mrktg_int_desc_fr = Suffix[i].mrktg_int_desc_fr;
					obj.int_c = Suffix[i].int_c;
					obj.SPRAS = Suffix[i].SPRAS;
					SuffixData.push(obj);
				}
				var Color = sap.ui.getCore().getModel("SearchedData").getData();
				var obj = {};

				var Status = this.getView().byId("VLRStatus").getSelectedKey();
				if (Status == "1") {
					for (var i = 0, len = Color.length; i < len; i++) {
						if (Color[i].zz_trading_ind == "1") {
							obj[Color[i]['zzextcol']] = Color[i];
						}

					}
				} else {

					for (var i = 0, len = Color.length; i < len; i++) {
						if ((Color[i].zz_trading_ind == "2") || (Color[i].zz_trading_ind == "3")) {
							obj[Color[i]['zzextcol']] = Color[i];
						}

					}

				}

				Color = new Array();
				for (var key in obj)
					Color.push(obj[key]);
				var Model = new sap.ui.model.json.JSONModel(Color);
				// Model.setSizeLimit(1000);
				this.getView().byId("VLRColor").setModel(Model);
				// if (Color.length != 0) {
				if (this.getView().byId("VLRColor").getItems().filter(function (x) {
						return x.mProperties.key == "all"
					}).length == 0) {

					if (this.sCurrentLocale == "EN") {

						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "ALL"
						});
						this.getView().byId("VLRColor").insertItem(newItem);
						this.getView().byId("VLRColor").setSelectedKey("all");
						this.getView().byId("VLRColor").setSelectedItem("ALL");
					} else {
						// for french
						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "TOUS"
						});
						this.getView().byId("VLRColor").insertItem(newItem);
						this.getView().byId("VLRColor").setSelectedKey("all");
						this.getView().byId("VLRColor").setSelectedItem("TOUS");

					}
				}
			}

			// if (SuffixData.length != 0) {

			// }
			// =========================================================== begin of comment ================== Guna
			// var obj = {};
			// for (var i = 0, len = Status.length; i < len; i++)
			// 	obj[Status[i]['zz_trading_ind']] = Status[i];
			// Status = new Array();
			// for (var key in obj)
			// 	Status.push(obj[key]);

			// /*Status.splice(-1,1);*/
			// var StatusDataFilter = [];
			// for (var i = 0; i < Status.length; i++) {
			// 	if (Status[i].zz_trading_ind == "1" || Status[i].zz_trading_ind == "2") {
			// 		StatusDataFilter.push(Status[i]);
			// 	}
			// }
			// if (StatusDataFilter.length == 0) {
			// 	StatusDataFilter = [{
			// 		"zz_trading_ind": "1"

			// 	}, {
			// 		"zz_trading_ind": "2"
			// 	}];
			// }
			// var Model = new sap.ui.model.json.JSONModel(StatusDataFilter);
			// // Model.setSizeLimit(1000);

			// var StatusFilter = StatusDataFilter.filter(function (x) {
			// 	return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3");
			// });
			// var Statusind1 = StatusDataFilter.filter(function (x) {
			// 	return (x.zz_trading_ind == "1");
			// });

			// this.getView().byId("VLRStatus").setModel(Model);
			// if (StatusFilter.length != 0) {
			// 	if (this.sCurrentLocale == 'EN') {
			// 		this.getView().byId("VLRStatus").setSelectedItem("Pipeline - Routable");
			// 	} else {
			// 		this.getView().byId("VLRStatus").setSelectedItem("Chaîne d'approvisionnement – acheminable");
			// 	}
			// 	this.getView().byId("VLRStatus").setSelectedKey(sap.ui.getCore().SelectedStauts);
			// } else if (StatusDataFilter.length != 0) {
			// 	if (this.sCurrentLocale == 'EN') {

			// 		var newItem = new sap.ui.core.Item({
			// 			key: "2",
			// 			text: "Pipeline - Routable"
			// 		});

			// 		this.getView().byId("VLRStatus").insertItem(newItem);
			// 		this.getView().byId("VLRStatus").setSelectedItem("Pipeline - Routable");
			// 		this.getView().byId("VLRStatus").setSelectedKey("2");

			// 	} else {
			// 		var newItem = new sap.ui.core.Item({
			// 			key: "2",
			// 			text: "Chaîne d'approvisionnement – acheminable"
			// 		});

			// 		this.getView().byId("VLRStatus").insertItem(newItem);
			// 		this.getView().byId("VLRStatus").setSelectedItem("Chaîne d'approvisionnement – acheminable");
			// 		this.getView().byId("VLRStatus").setSelectedKey("2");

			// 	}

			// 	if (Statusind1.length == 0) {
			// 		// var newItem = new sap.ui.core.Item({
			// 		// 	key: "1",
			// 		// 	text: "Stock-Non-Routable"
			// 		// });
			// 		// this.getView().byId("VLRStatus").insertItem(newItem);

			// 		if (this.sCurrentLocale == 'EN') {

			// 			var newItem = new sap.ui.core.Item({
			// 				key: "1",
			// 				text: "Stock-Non-Routable"
			// 			});
			// 			this.getView().byId("VLRStatus").insertItem(newItem);

			// 		} else {

			// 			var newItem = new sap.ui.core.Item({
			// 				key: "1",
			// 				text: "Stock-non-acheminable"
			// 			});
			// 			this.getView().byId("VLRStatus").insertItem(newItem);

			// 		}

			// 	}

			// }
			// =========================================================== end of comment ================== Guna			
			/*	if(StatusFilter.length!=0){
						this.getView().byId("VLRStatus").setSelectedItem("Pipeline - Routable");
	this.getView().byId("VLRStatus").setSelectedKey("1");
				}*/

			var obj = {};
			for (var i = 0, len = Dealer.length; i < len; i++)
				obj[Dealer[i]['kunnr']] = Dealer[i];
			Dealer = new Array();
			for (var key in obj)
				Dealer.push(obj[key]);
			var Model1 = new sap.ui.model.json.JSONModel(Dealer);
			Model1.setSizeLimit(1000);
			this.getView().byId("VLRDealer").setModel(Model1);
			if (Dealer.length != 0) {
				if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
						return x.mProperties.key == "all"
					}).length == 0) {

					if (this.sCurrentLocale == 'EN') {

						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "ALL"
						});
						this.getView().byId("VLRDealer").insertItem(newItem);
						this.getView().byId("VLRDealer").setSelectedKey("all");
						this.getView().byId("VLRDealer").setSelectedItem("ALL");
					} else {
						// for french
						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "TOUS"
						});
						this.getView().byId("VLRDealer").insertItem(newItem);
						this.getView().byId("VLRDealer").setSelectedKey("all");
						this.getView().byId("VLRDealer").setSelectedItem("TOUS");

					}

				}
			} else {
				if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
						return x.mProperties.key == "all"
					}).length == 0) {

					if (this.sCurrentLocale == 'EN') {
						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "ALL"
						});
						this.getView().byId("VLRDealer").insertItem(newItem);
						this.getView().byId("VLRDealer").setSelectedItem("ALL");
						this.getView().byId("VLRDealer").setSelectedKey("all");

					} else {
						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "TOUS"
						});

						this.getView().byId("VLRDealer").insertItem(newItem);
						this.getView().byId("VLRDealer").setSelectedItem("TOUS");
						this.getView().byId("VLRDealer").setSelectedKey("all");

					}

				}

			}

			this.onStatusChange();
			sap.ui.core.BusyIndicator.hide();

		},
		Nodata: function () {

			//	if (sap.ui.getCore().getModel("SearchedData") && sap.ui.getCore().getModel("oSuffieldmodel") != undefined) {
			//	this.getView().setModel(sap.ui.getCore().getModel("SearchedData"), "VehicleLocatorScdScr");

			//	var Status = sap.ui.getCore().getModel("SearchedData").getData();
			var model = new sap.ui.model.json.JSONModel([]);
			// model.setSizeLimit(1000);
			// this.getView().byId("table1VSR").setModel(model); //guna
			this.getView().setModel(model, "vehicleSearchTableModel");

			var tableLength = this.getView().getModel("vehicleSearchTableModel").getData().length;
			var oModelDetail = this.getView().getModel("detailView");

			var sExpectedText = this.getView().getModel("i18n").getResourceBundle().getText("tableCount", [tableLength]);
			oModelDetail.setProperty("/tableCount", sExpectedText);

			var Model = new sap.ui.model.json.JSONModel([]);
			// Model.setSizeLimit(1000);
			this.getView().byId("VLRColor").setModel(Model);
			if (this.getView().byId("VLRColor").getItems().filter(function (x) {
					return x.mProperties.key == "all"
				}).length == 0) {
				var newItem = new sap.ui.core.Item({
					key: "all",
					text: "ALL"
				});
				this.getView().byId("VLRColor").insertItem(newItem);
				this.getView().byId("VLRColor").setSelectedKey("all");
				this.getView().byId("VLRColor").setSelectedItem("ALL");
			}
			/*var Model = new sap.ui.model.json.JSONModel([]);
				Model.setSizeLimit(1000);
*/
			var StatusDataFilter = [{
				"zz_trading_ind": "1"

			}, {
				"zz_trading_ind": "2"
			}];

			/*Status.splice(-1,1);*/
			var Model = new sap.ui.model.json.JSONModel(StatusDataFilter);
			// Model.setSizeLimit(1000);

			this.getView().byId("VLRStatus").setModel(Model);

			var Model1 = new sap.ui.model.json.JSONModel([]);
			Model1.setSizeLimit(1000);
			this.getView().byId("VLRDealer").setModel(Model1);
			if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
					return x.mProperties.key == "all"
				}).length == 0) {
				var newItem = new sap.ui.core.Item({
					key: "all",
					text: "ALL"
				});
				this.getView().byId("VLRDealer").insertItem(newItem);
				this.getView().byId("VLRDealer").setSelectedItem("ALL");
				this.getView().byId("VLRDealer").setSelectedKey("all");
			}
			this.onStatusChange();
			sap.ui.core.BusyIndicator.hide();
		},

		// onStatusChangeMultiple: function () {
		// 	this.comingFromSuffixChange = false;
		// 	var Status = this.getView().byId("VLRStatus").getSelectedKey();
		// 	if (Status == "1") {

		// 		// var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"}) guna
		// 		var Dealer = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
		// 			return x.zz_trading_ind == "1"
		// 		});

		// 	} else {
		// 		var Dealer = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
		// 			return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3")
		// 		});
		// 		//	var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")}) guna
		// 	}
		// 	var obj = {};
		// 	for (var i = 0, len = Dealer.length; i < len; i++)
		// 		obj[Dealer[i]['kunnr']] = Dealer[i];
		// 	Dealer = new Array();
		// 	for (var key in obj)
		// 		Dealer.push(obj[key]);
		// 	var selctedDealer = this.getView().byId("VLRDealer").getSelectedKey();
		// 	var Model1 = new sap.ui.model.json.JSONModel(Dealer);
		// 	Model1.setSizeLimit(1000);
		// 	this.getView().byId("VLRDealer").setModel(Model1);
		// 	// if (Dealer.length != 0) {
		// 	if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
		// 			return x.mProperties.key == "all"
		// 		}).length == 0) {

		// 		if (this.sCurrentLocale == "EN") {
		// 			var newItem = new sap.ui.core.Item({
		// 				key: "all",
		// 				text: "ALL"
		// 			});
		// 		} else {
		// 			var newItem = new sap.ui.core.Item({
		// 				key: "all",
		// 				text: "TOUS"
		// 			});

		// 		}

		// 		this.getView().byId("VLRDealer").insertItem(newItem);
		// 		var SelctKey = Dealer.filter(function (x) {
		// 			return x.kunnr == selctedDealer
		// 		});
		// 		if (selctedDealer == "" || SelctKey.length == 0) {
		// 			if (this.sCurrentLocale == "EN") {
		// 				this.getView().byId("VLRDealer").setSelectedItem("ALL");
		// 			} else {
		// 				this.getView().byId("VLRDealer").setSelectedItem("TOUS");
		// 			}

		// 			this.getView().byId("VLRDealer").setSelectedKey("all");
		// 		} else {
		// 			this.getView().byId("VLRDealer").setSelectedKey(selctedDealer);
		// 		}
		// 	}
		// 	// } else {
		// 	// 	if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
		// 	// 			return x.mProperties.key == "all"
		// 	// 		}).length == 0) {
		// 	// 		var newItem = new sap.ui.core.Item({
		// 	// 			key: "all",
		// 	// 			text: "ALL"
		// 	// 		});
		// 	// 		this.getView().byId("VLRDealer").insertItem(newItem);
		// 	// 		if (selctedDealer == "") {
		// 	// 				 if (this.sCurrentLocale == "EN") {
		// 	// 			this.getView().byId("VLRDealer").setSelectedItem("ALL");
		// 	// 				 } else {
		// 	// 						this.getView().byId("VLRDealer").setSelectedItem("TOUS");	 	
		// 	// 				 }
		// 	// 								this.getView().byId("VLRDealer").setSelectedKey("all");
		// 	// 		} else {
		// 	// 			this.getView().byId("VLRDealer").setSelectedKey(selctedDealer);
		// 	// 		}
		// 	// 	}

		// 	// }

		// 	var Status = this.getView().byId("VLRStatus").getSelectedKey();
		// 	if (Status == "1") {
		// 		// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"})

		// 		var Color = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
		// 			return x.zz_trading_ind == "1"
		// 		});
		// 	} else {
		// 		// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")})
		// 		var Color = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
		// 			return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3")
		// 		});
		// 	}
		// 	//	var Color = sap.ui.getCore().getModel("SearchedData").getData();
		// 	var obj = {};
		// 	for (var i = 0, len = Color.length; i < len; i++)
		// 		obj[Color[i]['zzextcol']] = Color[i];
		// 	Color = new Array();
		// 	for (var key in obj)
		// 		Color.push(obj[key]);
		// 	var Model = new sap.ui.model.json.JSONModel(Color);
		// 	// Model.setSizeLimit(1000);
		// 	var selctedColor = this.getView().byId("VLRColor").getSelectedKey();
		// 	this.getView().byId("VLRColor").setModel(Model);
		// 	// if (Color.length != 0) {
		// 	if (this.getView().byId("VLRColor").getItems().filter(function (x) {
		// 			return x.mProperties.key == "all"
		// 		}).length == 0) {

		// 		if (this.sCurrentLocale == 'EN') {
		// 			var newItem = new sap.ui.core.Item({
		// 				key: "all",
		// 				text: "ALL"
		// 			});

		// 		} else {
		// 			var newItem = new sap.ui.core.Item({
		// 				key: "all",
		// 				text: "TOUS"
		// 			});

		// 		}

		// 		var SelctKey = Color.filter(function (x) {
		// 			return x.zzextcol == selctedColor
		// 		});
		// 		this.getView().byId("VLRColor").insertItem(newItem);

		// 		/*this.getView().byId("VLRColor").setSelectedKey("all");
		// 		this.getView().byId("VLRColor").setSelectedItem("ALL");*/
		// 		if (selctedColor == "" || SelctKey.length == 0) {

		// 			if (this.sCurrentLocale == "EN") {
		// 				this.getView().byId("VLRDealer").setSelectedItem("ALL");
		// 			} else {
		// 				this.getView().byId("VLRDealer").setSelectedItem("TOUS");
		// 			}

		// 			this.getView().byId("VLRColor").setSelectedKey("all");
		// 		} else {
		// 			this.getView().byId("VLRColor").setSelectedKey(selctedColor);
		// 		}
		// 	}
		// 	// } else {
		// 	// 	if (this.getView().byId("VLRColor").getItems().filter(function (x) {
		// 	// 			return x.mProperties.key == "all"
		// 	// 		}).length == 0) {
		// 	// 		var newItem = new sap.ui.core.Item({
		// 	// 			key: "all",
		// 	// 			text: "ALL"
		// 	// 		});
		// 	// 		this.getView().byId("VLRColor").insertItem(newItem);
		// 	// 		this.getView().byId("VLRColor").setSelectedKey("all");
		// 	// 		this.getView().byId("VLRColor").setSelectedItem("ALL");
		// 	// 	}
		// 	// }
		// 	//	}

		// 	this.onStatusChange();

		// },
		onStatusChangeMultiple: function () {
			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			if (Status == "1") {

				// var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"}) guna
				var Dealer = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
					return x.zz_trading_ind == "1"
				});

			} else {
				var Dealer = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
					return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3")
				});
				//	var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")}) guna
			}
			var obj = {};
			for (var i = 0, len = Dealer.length; i < len; i++)
				obj[Dealer[i]['kunnr']] = Dealer[i];
			Dealer = new Array();
			for (var key in obj)
				Dealer.push(obj[key]);
			var selctedDealer = this.getView().byId("VLRDealer").getSelectedKey();
			var Model1 = new sap.ui.model.json.JSONModel(Dealer);
			Model1.setSizeLimit(1000);
			this.getView().byId("VLRDealer").setModel(Model1);
			// if (Dealer.length != 0) {
			if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
					return x.mProperties.key == "all"
				}).length == 0) {

				if (this.sCurrentLocale == "EN") {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
				} else {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "TOUS"
					});

				}

				this.getView().byId("VLRDealer").insertItem(newItem);
				var SelctKey = Dealer.filter(function (x) {
					return x.kunnr == selctedDealer
				});
				if (selctedDealer == "" || SelctKey.length == 0) {
					if (this.sCurrentLocale == "EN") {
						this.getView().byId("VLRDealer").setSelectedItem("ALL");
					} else {
						this.getView().byId("VLRDealer").setSelectedItem("TOUS");
					}

					this.getView().byId("VLRDealer").setSelectedKey("all");
				} else {
					this.getView().byId("VLRDealer").setSelectedKey(selctedDealer);
				}
			}

			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			if (Status == "1") {
				// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"})

				var Color = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
					return x.zz_trading_ind == "1"
				});
			} else {
				// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")})
				var Color = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
					return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3")
				});
			}
			//	var Color = sap.ui.getCore().getModel("SearchedData").getData();
			var obj = {};
			for (var i = 0, len = Color.length; i < len; i++)
				obj[Color[i]['zzextcol']] = Color[i];
			Color = new Array();
			for (var key in obj)
				Color.push(obj[key]);
			var Model = new sap.ui.model.json.JSONModel(Color);
			// Model.setSizeLimit(1000);
			var selctedColor = this.getView().byId("VLRColor").getSelectedKey();
			this.getView().byId("VLRColor").setModel(Model);
			// if (Color.length != 0) {
			if (this.getView().byId("VLRColor").getItems().filter(function (x) {
					return x.mProperties.key == "all"
				}).length == 0) {

				if (this.sCurrentLocale == 'EN') {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});

				} else {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "TOUS"
					});

				}

				var SelctKey = Color.filter(function (x) {
					return x.zzextcol == selctedColor
				});
				this.getView().byId("VLRColor").insertItem(newItem);

				/*this.getView().byId("VLRColor").setSelectedKey("all");
				this.getView().byId("VLRColor").setSelectedItem("ALL");*/
				if (selctedColor == "" || SelctKey.length == 0) {

					if (this.sCurrentLocale == "EN") {
						this.getView().byId("VLRDealer").setSelectedItem("ALL");
					} else {
						this.getView().byId("VLRDealer").setSelectedItem("TOUS");
					}

					this.getView().byId("VLRColor").setSelectedKey("all");
				} else {
					this.getView().byId("VLRColor").setSelectedKey(selctedColor);
				}
			}

			this.onStatusChange();

		},
		onLiveChange: function (oEvent) {

			this.sSearchQuery = oEvent.getSource()
				.getValue();
			this.fnApplyFiltersAndOrdering();

			this.getView().byId("VLRDealer").setSelectedKey("all");
			this.getView().byId("VLRSuffix").setSelectedKey("all");
			this.getView().byId("VLRColor").setSelectedKey("all");
			this.getView().byId("chknew").setSelected(false);
			this.getView().byId("chkexi").setSelected(false);

		},
		fnApplyFiltersAndOrdering: function (oEvent) {
			var aFilters = [],
				aSorters = [];

			aSorters.push(new Sorter("dealerId1", this.bDescending));
			// based on the status that is presnet in the screen apply one more filter. 
			var Status = this.getView().byId("VLRStatus").getSelectedKey();

			if (this.sSearchQuery) {
				var oFilter = new Filter([
					new Filter("zzvtn", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("kunnr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("matnr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("model_desc_en", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("model_desc_fr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("suffix_desc_en", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("suffix_desc_fr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzextcol", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("mktg_desc_en", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("mktg_desc_fr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ort01", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("bezei", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
				], false);

				if (Status == "1") {

					var oFilter1 = new Filter([
						new Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status)
					]);

				} else {

					var oFilter1 = new Filter([
						new Filter("zz_trading_ind", sap.ui.model.FilterOperator.NE, "1")
					]);

				}

				var aFilters = new sap.ui.model.Filter([oFilter1, oFilter], true);

				// aFilters.push(oFilter);
			}

			// based on the status field			

			this.byId("table1VSR")
				.getBinding("items")
				.filter(aFilters);
				// .sort(aSorters);
		},

		handleViewSettingsDialogButtonPressed: function (oEvt) {
			// this._oResponsivePopover = sap.ui.xmlfragment("vehicleLocator.fragment.VehicleSearchResult", this);
			if (!this._sortDialog) {
				this._sortDialog = sap.ui.xmlfragment("vehicleSortDialog", "vehicleLocator.fragment.vehicleSortDialog", this);
			}
			this.getView().addDependent(this._sortDialog);

			this._sortDialog.open();

		},

		//     handleViewSettingsDialogButtonPressed: function (oEvent) {
		//     if (!this._oDialog) {
		//          this._oDialog = sap.ui.xmlfragment("vehicleSortDialog", "vehicleLocator.fragment",
		//             this);
		//     }
		//     // toggle compact style
		//     jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(),
		//         this._oDialog);
		//     this._oDialog.open();
		// },    

		handleConfirm: function (oEvent) {
			// This event is triggered when user
			// clicks on Ok button on
			// fragment popup
			var aSorters = [];
			var oView = this.getView();
			var oTable = oView
				.byId("table1VSR");
			// Get the parameters for sorting
			var mParams = oEvent
				.getParameters();
			var oBinding = oTable
				.getBinding("items");
			var sPath = mParams.sortItem
				.getKey();
			var bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath,
				bDescending));
			oBinding.sort(aSorters);

		},
		handleCancel: function (oEvent) {
			// this._sortDialog.destroy(true);
		},

		onColourChange: function () {
			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			var ColorSel = this.getView().byId("VLRColor").getSelectedKey();
			this.comingFromSuffixChange = false;
			if (ColorSel == "all") {
				if (Status == "1") {

					var Dealer = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
						return x.zz_trading_ind == "1";
					});
					//		var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"})
				} else {
					var Dealer = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
						return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3");
					});
					// var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")})
				}
			} else {
				if (Status == "1") {
					var Dealer = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
						return x.zz_trading_ind == "1" && x.zzextcol == ColorSel;
					});
					// var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1" &&x.zzextcol==ColorSel})
				} else {
					var Dealer = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
						return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3") && x.zzextcol == ColorSel;
					});
					// var Dealer=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3") &&x.zzextcol==ColorSel})
				}

			}
			var obj = {};
			for (var i = 0, len = Dealer.length; i < len; i++)
				obj[Dealer[i]['kunnr']] = Dealer[i];
			Dealer = new Array();
			for (var key in obj)
				Dealer.push(obj[key]);
			var selctedDealer = this.getView().byId("VLRDealer").getSelectedKey();
			var Model1 = new sap.ui.model.json.JSONModel(Dealer);
			Model1.setSizeLimit(1000);
			this.getView().byId("VLRDealer").setModel(Model1);
			if (Dealer.length != 0) {
				if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
						return x.mProperties.key == "all";
					}).length == 0) {

					if (this.sCurrentLocale == 'EN') {
						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "ALL"
						});
					} else {
						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "TOUS"
						});

					}

					this.getView().byId("VLRDealer").insertItem(newItem);
					var SelctKey = Dealer.filter(function (x) {
						return x.kunnr == selctedDealer;
					});
					if (selctedDealer == "" || SelctKey.length == 0) {
						if (this.sCurrentLocale == 'EN') {

							this.getView().byId("VLRDealer").setSelectedItem("ALL");
						} else {
							this.getView().byId("VLRDealer").setSelectedItem("TOUS");
						}
						this.getView().byId("VLRDealer").setSelectedKey("all");
					} else {
						this.getView().byId("VLRDealer").setSelectedKey(selctedDealer);
					}
				}
			} else {
				if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
						return x.mProperties.key == "all";
					}).length == 0) {
					if (this.sCurrentLocale == 'EN') {

						this.getView().byId("VLRColor").setSelectedItem("ALL");
					} else {

						this.getView().byId("VLRColor").setSelectedItem("TOUS");
					}
					this.getView().byId("VLRDealer").insertItem(newItem);
					if (selctedDealer == "") {

						if (this.sCurrentLocale == 'EN') {

							this.getView().byId("VLRColor").setSelectedItem("ALL");
						} else {

							this.getView().byId("VLRColor").setSelectedItem("TOUS");
						}

						this.getView().byId("VLRDealer").setSelectedKey("all");
					} else {
						this.getView().byId("VLRDealer").setSelectedKey(selctedDealer);
					}
				}

			}
			this.onStatusChange();

		},
		onDealerChange: function () {
			this.comingFromSuffixChange = false;
			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			var DealerSel = this.getView().byId("VLRDealer").getSelectedKey();
			if (DealerSel == "all") {
				if (Status == "1") {
					// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"})
					var Color = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
						return x.zz_trading_ind == "1";
					});

				} else {
					// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")})
					var Color = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
						return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3");
					});
				}
			} else {
				if (Status == "1") {
					// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return x.zz_trading_ind=="1"&&x.kunnr==DealerSel})
					var Color = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
						return x.zz_trading_ind == "1" && x.kunnr == DealerSel;
					});
				} else {
					var Color = this.getView().getModel("vehicleSearchTableModel").getData().filter(function (x) {
						return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3") && x.kunnr == DealerSel;
					});
					// var Color=this.getView().byId("table1VSR").getModel().getData().filter(function(x){return (x.zz_trading_ind=="2"||x.zz_trading_ind=="3")&&x.kunnr==DealerSel})
				}

			}
			//	var Color = sap.ui.getCore().getModel("SearchedData").getData();
			var obj = {};
			for (var i = 0, len = Color.length; i < len; i++)
				obj[Color[i]['zzextcol']] = Color[i];
			Color = new Array();
			for (var key in obj)
				Color.push(obj[key]);
			var Model = new sap.ui.model.json.JSONModel(Color);
			// Model.setSizeLimit(1000);
			var selctedColor = this.getView().byId("VLRColor").getSelectedKey();
			this.getView().byId("VLRColor").setModel(Model);
			if (Color.length != 0) {
				if (this.getView().byId("VLRColor").getItems().filter(function (x) {
						return x.mProperties.key == "all";
					}).length == 0) {

					if (this.sCurrentLocale == 'EN') {

						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "ALL"
						});

					} else {

						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "TOUS"
						});

					}

					var SelctKey = Color.filter(function (x) {
						return x.zzextcol == selctedColor;
					});
					this.getView().byId("VLRColor").insertItem(newItem);

					/*this.getView().byId("VLRColor").setSelectedKey("all");
					this.getView().byId("VLRColor").setSelectedItem("ALL");*/
					if (selctedColor == "" || SelctKey.length == 0) {
						if (this.sCurrentLocale == 'EN') {

							this.getView().byId("VLRColor").setSelectedItem("ALL");
						} else {

							this.getView().byId("VLRColor").setSelectedItem("TOUS");
						}

						this.getView().byId("VLRColor").setSelectedKey("all");
					} else {
						this.getView().byId("VLRColor").setSelectedKey(selctedColor);
					}
				}
			} else {
				if (this.getView().byId("VLRColor").getItems().filter(function (x) {
						return x.mProperties.key == "all";
					}).length == 0) {
					if (this.sCurrentLocale == 'EN') {

						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "ALL"
						});

					} else {

						var newItem = new sap.ui.core.Item({
							key: "all",
							text: "TOUS"
						});

					}
					this.getView().byId("VLRColor").insertItem(newItem);
					this.getView().byId("VLRColor").setSelectedKey("all");
					if (this.sCurrentLocale == 'EN') {

						this.getView().byId("VLRColor").setSelectedItem("ALL");
					} else {

						this.getView().byId("VLRColor").setSelectedItem("TOUS");
					}
				}
			}

			this.onStatusChange();
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

		},
		onNavBack2: function () {
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

		TradeHistoryLinkPress: function () {
			var that = this;
			that.getRouter().navTo("VehicleTrade_History", {
				DataClicked: "Yes"
			});
		},

	});
});