var DefaultSuffix;
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"vehicleLocator/Formatter/Formatter",
	"sap/ui/table/SortOrder"

], function (Controller, BaseController, ResourceModel, JSONModel, Sorter, Filter, Formatter, SortOrder) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleSearcResults", {

		onInit: function () {
			//define JSON model oDealersearchresults
			this._oViewModel = new sap.ui.model.json.JSONModel();

			this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(); // instantiate the resource 

			var that = this;

			if (!this._oResponsivePopover) {
				this._oResponsivePopover = sap.ui.xmlfragment("vehicleLocator.fragment.VehicleSearchResult", this);
				this._oResponsivePopover.setModel(this.getView().getModel());
			}
			var oTable = this.getView().byId("table1VSR");

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



			//	this.getRouter().attachRouteMatched(this.onRouteMatched, this);
			this.getRouter().getRoute("VehicleSearcResults").attachPatternMatched(this.onRouteMatched, this);
		},

		onSuffixChange: function (oEvent) {
			// debugger;
			sap.ui.core.BusyIndicator.show();
			sap.ui.getCore().SelectedStauts = this.getView().byId("VLRStatus").getSelectedKey();
			this.getOwnerComponent().suffixSelectedValue = this.getView().byId("VLRSuffix").getSelectedItem().getText();
			var SuffCmbo = this.getView().byId("VLRSuffix").getSelectedKey();
			if (SuffCmbo != "all") {
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

				var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq '" + SelectedMSMData[0].McCmbo +
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
							return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO")
						});

						//	var FilterDeleade_OrderTypefiltered_zone
						var FilterDeleade_OrderTypefiltered_zone = FilterDeleade_OrderTypefiltered_zone.filter(function (x) {
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
						
						var oExcludeTci=[];
						 for( var i=FilterDeleade_OrderTypefiltered_zone.length-1; i>=0; --i){ 
      if( oTCIcodes.indexOf( (FilterDeleade_OrderTypefiltered_zone[i].kunnr)) == -1 ){ 
        oExcludeTci.push( FilterDeleade_OrderTypefiltered_zone[i] ); 
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

						var FilterZonestock = oExcludeTci.filter(function (x) {
							return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO")
						});
						var tempTabData = FilterZonestock.filter(function (array_el) {
							return oZoneIncludeData.filter(function (anotherOne_el) {
								return (anotherOne_el == array_el.kunnr && array_el.zzordertype == "DM");
							}).length == 0;
						});
						console.log("final searched data", tempTabData);

						console.log("final searched data", tempTabData);

						var suffixField = that.value;
						var oSuffmodel = new sap.ui.model.json.JSONModel(suffixField);
						oSuffmodel.setSizeLimit(10000);
						sap.ui.getCore().setModel(oSuffmodel, "oSuffieldmodel");
						/*var SuffixDataValue*/

						var SuffixDesc = sap.ui.getCore().getModel("VehicleLocatorSuffix").getData();

						var oDumModel = new sap.ui.model.json.JSONModel(tempTabData);
						oDumModel.setSizeLimit(100000);
						sap.ui.getCore().setModel(oDumModel, "SearchedData");
						that.SuffixFilter();
						that.onStatusChange();

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

				var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq '" + SelectedMSMData[0].McCmbo +
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
						//debugger;
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
							var oExcludeTci=[];
						 for( var i=FilterDeleade_OrderTypefiltered_zone.length-1; i>=0; --i){ 
      if( oTCIcodes.indexOf( (FilterDeleade_OrderTypefiltered_zone[i].kunnr)) == -1 ){ 
        oExcludeTci.push( FilterDeleade_OrderTypefiltered_zone[i] ); 
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

						var FilterZonestock = oExcludeTci.filter(function (x) {
							return x.kunnr.slice(-5) != Dealer && (x.zzordertype == "DM" || x.zzordertype == "SO");
						});

						var filteredArray = FilterZonestock.filter(function (array_el) {
							return oZoneIncludeData.filter(function (anotherOne_el) {
								return (anotherOne_el == array_el.kunnr && array_el.zzordertype == "DM");
							}).length == 0;
						});
						console.log("final searched data", filteredArray);

						var suffixField = that.value;
						var oSuffmodel = new sap.ui.model.json.JSONModel(suffixField);
						oSuffmodel.setSizeLimit(10000);
						sap.ui.getCore().setModel(oSuffmodel, "oSuffieldmodel");
						/*var SuffixDataValue*/

						var SuffixDesc = sap.ui.getCore().getModel("VehicleLocatorSuffix").getData();

						var oDumModel = new sap.ui.model.json.JSONModel(filteredArray);
						oDumModel.setSizeLimit(100000);
						sap.ui.getCore().setModel(oDumModel, "SearchedData");
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
					filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, "2"));
					filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, "3"));
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
			if (Suffix != "" && Suffix != "all") {

				filterArray.push(new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, Suffix));
			} else if (Suffix == "all") {
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
					filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, SelColor[i].zzextcol));
				}

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
			// this.getView().byId("table1VSR").getBinding("rows").filter(filterArray);

			// sap.ushell.components.tableSearchResults.getBinding("rows").filter(filterArray);  // guna
			sap.ushell.components.tableSearchResults.getBinding("items").filter(filterArray);
			// var FilterdedTableData=sap.ushell.components.tableSearchResults.getBinding("rows").aIndices;// guna
			var FilterdedTableData = sap.ushell.components.tableSearchResults.getBinding("items").aIndices;
			// var tableData=sap.ushell.components.tableSearchResults.getModel().getData();   // guna

// also lets try to apply the filter data if the value is not initial in the filter field. 

			//debugger;
// trey to push the filter array also here ---------------------------------------------
// searchVehicleList
   //       var sSearchQuery = this.byId("searchVehicleList").getValue(); 
   //      if (sSearchQuery) {
			// 	var oFilter = new Filter([
			// 		new Filter("kunnr", sap.ui.model.FilterOperator.Contains, sSearchQuery),
			// 		new Filter("matnr", sap.ui.model.FilterOperator.Contains, sSearchQuery),
			// 		new Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, sSearchQuery),
			// 		new Filter("zzapx", sap.ui.model.FilterOperator.Contains, sSearchQuery),
			// 		new Filter("zzextcol", sap.ui.model.FilterOperator.Contains, sSearchQuery),
			// 		new Filter("zzordertype", sap.ui.model.FilterOperator.Contains, sSearchQuery),
			// 		new Filter("zzadddata4", sap.ui.model.FilterOperator.Contains, sSearchQuery),
			// 		new Filter("pstsp", sap.ui.model.FilterOperator.Contains, sSearchQuery),
			// 		new Filter("non_D_flag", sap.ui.model.FilterOperator.Contains, sSearchQuery),
			// 		new Filter("ort01", sap.ui.model.FilterOperator.Contains, sSearchQuery),
			// 		new Filter("bezei", sap.ui.model.FilterOperator.Contains, sSearchQuery)
			// 	], false);
			 
			// 	// aFilters.push(oFilter);
			// 	filterArray.push(oFilter);
			// }

			// this.byId("table1VSR")
			// 	.getBinding("items")
			// 	.filter(aFilters)
			// 	.sort(aSorters);

	sap.ushell.components.tableSearchResults.getBinding("items").filter(filterArray);


// filter array end --------------------------------------------------------------------
 
			// set the count to screen. 

			var tableLength = FilterdedTableData.length;
			var oModelDetail = this.getView().getModel("detailView");

			var sExpectedText = this.getView().getModel("i18n").getResourceBundle().getText("tableCount", [tableLength]);
			oModelDetail.setProperty("/tableCount", sExpectedText);

			var tableData = sap.ushell.components.tableSearchResults.getModel("vehicleSearchTableModel").getData();

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
			if (Dealer.length != 0) {
				if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
						return x.mProperties.key == "all"
					}).length == 0) {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRDealer").insertItem(newItem);
					//	this.getView().byId("VLRDealer").setSelectedItem("ALL");
					this.getView().byId("VLRDealer").setSelectedKey(SelectedDealer);
				}
			} else {
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

			}

			var Color = FilteredTableData;
			var obj = {};
			for (var i = 0, len = Color.length; i < len; i++)
				obj[Color[i]['zzextcol']] = Color[i];
			Color = new Array();
			for (var key in obj)
				Color.push(obj[key]);
			var Model = new sap.ui.model.json.JSONModel(Color);
			Model.setSizeLimit(1000);
			this.getView().byId("VLRColor").setModel(Model);
			if (Color.length != 0) {
				if (this.getView().byId("VLRColor").getItems().filter(function (x) {
						return x.mProperties.key == "all";
					}).length == 0) {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRColor").insertItem(newItem);
					this.getView().byId("VLRColor").setSelectedKey(SelectedColor);
					//	this.getView().byId("VLRColor").setSelectedItem("ALL");
				}
			} else {
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
			}

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
			var dealercode = that.selectedTrade.kunnr.slice(-5);

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
					//debugger;
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
						sap.ui.getCore().SelectedTrade = that.selectedTrade;
						sap.ui.getCore().SelectedTradeStatus = "";
						if (that.oTableSelectPath != undefined) {
							that.getRouter().navTo("VehicleTrade_CreateSingle", {
								SelectedTrade: that.oTableSelectPath
							});
							that.oTableSelect = undefined;
						} else {
							sap.m.MessageBox.warning("Please select the trade");
							that.oTableSelect = undefined;
						}

					} else {
						sap.ui.getCore().SelectedTrade = that.selectedTrade;
						sap.ui.getCore().SelectedTradeStatus = "";
						if (that.oTableSelectPath != undefined) {
							that.getRouter().navTo("VehicleTrade_CreateSingle", {
								SelectedTrade: that.oTableSelectPath
							});
							that.oTableSelect = undefined;
						} else {
							sap.m.MessageBox.warning("Please select the trade");
							that.oTableSelect = undefined;
						}
					}

				},
				error: function () {
					sap.ui.getCore().SelectedTrade = that.selectedTrade;
					sap.ui.getCore().SelectedTradeStatus = "";
					if (that.oTableSelectPath != undefined) {
						that.getRouter().navTo("VehicleTrade_CreateSingle", {
							SelectedTrade: that.oTableSelectPath
						});
						that.oTableSelect = undefined;
					} else {
						sap.m.MessageBox.warning("Please select the trade");
						that.oTableSelect = undefined;
					}
				}

			});

		},
		//onRouteMatched: function(oEvent) {

		//},
		onRouteMatched: function (oEvent) {
			//debugger;
			var RoutedData = JSON.parse(oEvent.getParameter("arguments").LoginUser);
			DefaultSuffix = (RoutedData.selectedSuffix).replace(/\//g, "%2F");
			//	this.getView().byId("VLRSuffix").removeAllItems();
			var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
			var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
		    this.getView().byId("oDealerCode2").setText(LoggedInDealerCode2);                                
			this.getView().byId("oDealersearchresults").setText(LoggedInDealer);

			var loginUser = oEvent.getParameter("arguments").LoginUser;
			if (loginUser == "vehicelTradeDealerUser") {
				var oTradecolId = this.getView().byId('TradecolId');
				oTradecolId.setVisible(oTradecolId.getVisible());

				this.getView().byId('table1VSR').setSelectionMode("None");

				/*	var oIncsoldve = this.getView().byId('chkmov');
					oIncsoldve.setVisible(!oIncsoldve.getVisible());
					var oIncFleetveh = this.getView().byId('chkadd');
					oIncFleetveh.setVisible(!oIncFleetveh.getVisible());*/

			}
			if (sap.ui.getCore().getModel("SearchedData") && sap.ui.getCore().getModel("oSuffieldmodel") != undefined) {
				this.getView().setModel(sap.ui.getCore().getModel("SearchedData"), "VehicleLocatorScdScr");

				/*	this.getView().setModel(sap.ui.getCore().getModel("oSuffieldmodel"),"VehicleLocatorScdScr");*/
				var Status = sap.ui.getCore().getModel("SearchedData").getData();
				debugger;

				// lets just do a json model and rebind this to ui. 
				// var myTempArray = [];
				// for (var i = 0; i< Status.length; i++){
				// 	myTempArray.push({
				//             	Hold_stat: "N",
				// 				bezei: "Ontario",
				// 				customer_brand: "10",
				// 				dnc_ind: "N",
				// 				kunnr: "2400042120",
				// 				matnr: "YZ3DCT",
				// 				mktg_desc_en: "SILVER ME.",
				// 				mktg_desc_fr: "SILVER ME.",
				// 				model_desc_en: "SIENNA XLE V6 7-PASS 8XXX",
				// 				model_desc_fr: "SIENNA SE V6 7-PASS 8A FRENCH DESC",
				// 				mrktg_int_desc_en: "Black EN",
				// 				mrktg_int_desc_fr: "Black FR",
				// 				name1: "Don Valley North Toyota.",
				// 				name2: "WEINS CANADA",
				// 				non_D_flag: "X",
				// 				ort01: "Markham",
				// 				pd_flag: "",
				// 				pstsp: "/Date(1554307200000+0000)/",
				// 				suffix_desc_en: "Gray int",
				// 				suffix_desc_fr: "GROUPE MOBILITY",
				// 				vguid: "005056a9-218f-1ee9-83e5-e78f3bbd22d7",
				// 				vhcex: "J10S011341",
				// 				vhcle: "0000604026",
				// 				vhvin: "VIN00000000604026",
				// 				vin_brand: "10",
				// 				vkbur: "3000",
				// 				zz_trading_ind: "2",
				// 				zzadddata4: "20190205",
				// 				zzapx: "00",
				// 				zzextcol: "01D6",
				// 				zzintcol: "LC14",
				// 				zzmoyr: "2018",
				// 				zzordertype: "SO",
				// 				zzseries: "SIE",
				// 				zzseries_desc_en: "Sienna-EN",
				// 				zzseries_desc_fr: "Sienna-FR",
				// 				zzsuffix: "ML",
				// 				zzvtn: "002380"
				// });
				// }

				var model = new sap.ui.model.json.JSONModel(Status);
				model.setSizeLimit(1000);
				this.getView().setModel(model, "vehicleSearchTableModel");

				var tableLength = this.getView().getModel("vehicleSearchTableModel").getData().length;
				var oModelDetail = this.getView().getModel("detailView");

				var sExpectedText = this.getView().getModel("i18n").getResourceBundle().getText("tableCount", [tableLength]);
				oModelDetail.setProperty("/tableCount", sExpectedText);

				// instead of setting by id set this to a model and bind it to screen

				//	// TODO: 	
				// var model = new sap.ui.model.json.JSONModel(Status);
				// model.setSizeLimit(1000);
				// this.getView().byId("table1VSR").setModel(model);

				/*	var oProductNameColumn = this.getView().byId("matnr");
					var oSorter = new sap.ui.model.Sorter(oProductNameColumn.getSortProperty(), true);*/

				/* this.getView().byId("table1VSR").getBinding("rows").sort(oSorter);*/
				//		this.getView().byId("table1VSR").sort(oProductNameColumn, SortOrder.Ascending);
				var oProductNameColumn = this.getView().byId("matnr");
				// this.getView().byId("table1VSR").sort(oProductNameColumn, SortOrder.Ascending);   // guna

				var Dealer = sap.ui.getCore().getModel("SearchedData").getData();

				var Suffix = sap.ui.getCore().getModel("VehicleLocatorSuffix").getData();
				var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language;
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
				for (var i = 0, len = Color.length; i < len; i++)
					obj[Color[i]['zzextcol']] = Color[i];
				Color = new Array();
				for (var key in obj)
					Color.push(obj[key]);
				var Model = new sap.ui.model.json.JSONModel(Color);
				Model.setSizeLimit(1000);
				this.getView().byId("VLRColor").setModel(Model);
				if (Color.length != 0) {
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
				} else {
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
				}
			}

			/*var obj = {};
			for (var i = 0, len = Suffix.length; i < len; i++)
			/*	obj[Suffix[i]['zzsuffix']] = Suffix[i];*/
			/*	obj[Suffix[i]['zzsuffix']] = Suffix[i];
			Suffix = new Array();
			for (var key in obj)
				Suffix.push(obj[key]);*/
			//	if (this.getView().byId("table1VSR").getModel().getData().length != 0) {
			/*	var	 Suffix = Suffix.filter(function (a) {
     
      var key = a.zzsuffix + '|' + a.zzintcol;
	
        if (!this[key]) {
            this[key] = true;
            return true;
        }
    }, Object.create(null));*/

			var Model = new sap.ui.model.json.JSONModel(SuffixData);
			Model.setSizeLimit(1000);
			this.getView().byId("VLRSuffix").setModel(Model);
			for (var s = 0; s < SuffixData.length; s++) {
				if (DefaultSuffix == SuffixData[s].zzsuffix + "-" + SuffixData[s].suffix_desc_en + "/" + SuffixData[s].mrktg_int_desc_en) {
					this.getView().byId("VLRSuffix").setSelectedItem(SuffixData[s].zzsuffix + "-" + SuffixData[s].suffix_desc_en + "/" + SuffixData[s]
						.mrktg_int_desc_en);
					/*this.getView().byId("VLRSuffix").setSelectedItem().mAssociations.selectedItem;*/
				}
			}
			//	}/* else {*/
			/*	var Model = new sap.ui.model.json.JSONModel([]);
				Model.setSizeLimit(1000);
				this.getView().byId("VLRSuffix").setModel(Model);*/
			/*	}*/
			if (SuffixData.length != 0) {

				/*	this.getView().byId("VLRSuffix").setSelectedKey(sap.ui.getCore().SuffixSelectedKey);*/
				//	this.getView().byId("VLRSuffix").setSelectedText(sap.ui.getCore().SuffixSelectedItem);
				/*	if(SuffixData[0].SPRAS.slice(0,1)!="E"){
						this.getView().byId("VLRSuffix").setSelectedItem(SuffixData[0].zzsuffix + "-" + SuffixData[0].suffix_desc_fr + SuffixData[0].mrktg_int_desc_fr);
					
					}
					else{
					this.getView().byId("VLRSuffix").setSelectedItem(SuffixData[0].zzsuffix + "-" + SuffixData[0].suffix_desc_en + SuffixData[0].mrktg_int_desc_en);
						
					}*/
				if (this.getView().byId("VLRSuffix").getItems().filter(function (x) {
						return x.mProperties.key == "all"
					}).length == 0) {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRSuffix").insertItem(newItem);
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
			var Model = new sap.ui.model.json.JSONModel(StatusDataFilter);
			Model.setSizeLimit(1000);

			var StatusFilter = StatusDataFilter.filter(function (x) {
				return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3");
			});
			var Statusind1 = StatusDataFilter.filter(function (x) {
				return (x.zz_trading_ind == "1");
			});

			this.getView().byId("VLRStatus").setModel(Model);
			if (StatusFilter.length != 0) {

				this.getView().byId("VLRStatus").setSelectedItem("Pipeline - Routable");
				this.getView().byId("VLRStatus").setSelectedKey("2");

			} else if (StatusDataFilter.length != 0) {
				var newItem = new sap.ui.core.Item({
					key: "2",
					text: "Pipeline - Routable"
				});

				this.getView().byId("VLRStatus").insertItem(newItem);
				this.getView().byId("VLRStatus").setSelectedItem("Pipeline - Routable");
				this.getView().byId("VLRStatus").setSelectedKey("2");
			}
			if (Statusind1.length == 0) {
				var newItem = new sap.ui.core.Item({
					key: "1",
					text: "Stock-Non-Routable"
				});
				this.getView().byId("VLRStatus").insertItem(newItem);
			}
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
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRDealer").insertItem(newItem);
					this.getView().byId("VLRDealer").setSelectedItem("ALL");
					this.getView().byId("VLRDealer").setSelectedKey("all");
				}
			} else {
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

			}

			{

				var filterArray = [];

				// guna commenting the below lines till 1795

				//	this.getView().byId("table1VSR").getBinding("rows").filter([]);  //guna

				var Status = this.getView().byId("VLRStatus").getSelectedKey();
				if (Status != "") {

					filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status));
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

				//	this.onStatusChange();

				/*	this.getView().byId("table1VSR").getBinding("rows").filter(filterArray);*/
			}

			/*this.onStatusChange();*/
			/*	var fb0=this.getView().byId("flexa1")
if(sap.ui.Device.system.phone){
		this.getView().byId("oStatusidLabel").addStyleClass("sapUiMediumMarginTopBottom");
	this.getView().byId("VLRStatus").addStyleClass("sapUiMediumMarginTopBottom");
	this.getView().byId("oDealerid1").addStyleClass("sapUiMediumMarginTopBottom");
	this.getView().byId("VLRDealer").addStyleClass("sapUiMediumMarginTopBottom");
	     
					fb0.setDirection("Column");
				
				}else if(sap.ui.Device.system.desktop || sap.ui.Device.system.tablet){
					fb0.setDirection("Row");
				}*/
			/*	  var oReceivedDataString = oEvent.getParameter("arguments").Selecteddata;
				  var oReceivedData = JSON.parse(oReceivedDataString);	*/
			/*	this.onStatusChange();*/
			//By Sun
			var suffixDropDown = this.getView().byId("VLRSuffix");
			//	this.getOwnerComponent().suffixSelectedValue;
			for (var i = 0; i < suffixDropDown.getItems().length; i++) {
				if (this.getOwnerComponent().suffixSelectedValue == suffixDropDown.getItems()[i].getText()) {
					//suffixDropDown.setSelectedKey(suffixDropDown.getItems()[i].getKey());
					this.suffixSelectedKey = suffixDropDown.getItems()[i].getKey();
					suffixDropDown.setSelectedItem(suffixDropDown.getItems()[i]);

				}
			}
			/*if(this.getOwnerComponent().suffixSelectedIndex >= 0){
				suffixDropDown.setSelectedIndex(this.getOwnerComponent().suffixSelectedIndex-3);
				suffixDropDown.setSelectedItem(suffixDropDown.getItems()[this.getOwnerComponent().suffixSelectedIndex-3]);
			}*/
		},

		onDealerSelected: function (oEvent) {

			var selectedCustomerT = this.getView().byId("dealerID").getValue();
			var sSelectedMatnr = oEvent.getParameter("\selectedItem").getProperty("key");
			var sSelectedMatnrText = oEvent.getParameter("\selectedItem").getProperty("additionalText");

			this._selectedDealerModel.setProperty("/Dealer_No", sSelectedMatnr);
			this._selectedDealerModel.setProperty("/Dealer_Name", sSelectedMatnrText);

			/*this.getView().byId("messageStripError").setProperty("visible", false);*/

		},
		handleExporttohecls: function () {

			// var Context = this.getView().byId("table1VSR").getBinding("rows").getContexts(); //guna
			var Context = this.getView().byId("table1VSR").getBinding("items").getContexts();
			if (Context.length == 0) {
				sap.m.MessageBox.warning("No data is available to export");
				return;
			} else {
				var items = Context.map(function (oEvent) {
					return oEvent.getObject();
				});
				this.JSONToCSVConvertor(items, "ExportGreen", true);
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

			row += Dealer + ",";
			row += Model + ",";
			row += Suffix + ",";
			row += APX + ",";
			row += Color + ",";
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
				// if(arrData[i].DoctypeText == "Credit Note" ) {
				// 	arrData[i].Amount = "-"+arrData[i].Amount;
				// }
				// else if(arrData[i].DoctypeText == "Invoice" ) {
				// 	arrData[i].Amount;
				// }
				/*	arrData[i].Amount = arrData[i].Amount + " " + arrData[i].Currency;
					if (arrData[i].PaymentDate != null) arrData[i].PaymentDate = arrData[i].PaymentDate.split("T")[0];
					else arrData[i].PaymentDate;
					if (arrData[i].DueDate != null) arrData[i].DueDate = arrData[i].DueDate.split("T")[0];
					else arrData[i].DueDate;
					if (arrData[i].DocumentDate != null) arrData[i].DocumentDate = arrData[i].DocumentDate.split("T")[0];
					else arrData[i].DocumentDate;
					if (arrData[i].WhtCertDate != null) arrData[i].WhtCertDate = arrData[i].WhtCertDate.split("T")[0];
					else arrData[i].PaymentDate;*/
				var kunnr = (arrData[i].kunnr).slice(-5) + "-" + arrData[i].name1;
				var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language;
				if (SPRAS != "English") {
					var matnr = arrData[i].matnr + "-" + arrData[i].model_desc_fr;
					var zzextcol = arrData[i].zzextcol + "-" + arrData[i].mktg_desc_fr;
					var zzsuffix = arrData[i].zzsuffix + "-" + arrData[i].suffix_desc_fr + "/" + arrData[i].mrktg_int_desc_fr;
				} else {
					var matnr = arrData[i].matnr + "-" + arrData[i].model_desc_en;
					var zzextcol = arrData[i].zzextcol + "-" + arrData[i].mktg_desc_en;
					var zzsuffix = arrData[i].zzsuffix + "-" + arrData[i].suffix_desc_en + "/" + arrData[i].mrktg_int_desc_en;
				}

				var zzordertype = "";
				switch (arrData[i].zzordertype) {
				case "SO":
					zzordertype = "STOCK Open";

					break;
				case "SR":
					zzordertype = "STOCK Restricted";

					break;
				case "DM":
					zzordertype = "DEMO";

					break;
				case "BA":
					zzordertype = "BANK ALLOC";

					break;
				case "LS":
					zzordertype = "LAUNCH Stock";

					break;
				case "RS":
					zzordertype = "RETAIL SOLD";

					break;
				case "F1":
					zzordertype = "DLR RAC";

					break;
				case "F2":
					zzordertype = "DLR ELITE";

					break;
				case "F3":
					zzordertype = "NAT RAC";

					break;
				case "F4":
					zzordertype = "NAT ELITE";

					break;
				case "F5":
					zzordertype = "MOBILITY";

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

				if (arrData[i].z_pd_flag == false) {
					var z_pd_flag = "No";
				} else if (arrData[i].z_pd_flag == true) {
					var z_pd_flag = "Yes";
				}

				row += '="' + kunnr + '","' + matnr + '","' + zzsuffix +
					'",="' + arrData[i].zzapx + '",="' + zzextcol + '",="' + zzordertype + '","' + zzadddata4 +
					'","' + pstsp +
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
		// onClick: function (oID) {

		// 	var that = this;
		// 	$('#' + oID).click(function (oEvent) { //Attach Table Header Element Event
		// 		var oTarget = oEvent.currentTarget;
		// 		//Get hold of Header Element

		// 		var oLabelText = oTarget.childNodes[0].textContent;
		// 		that.selooLabelText = oTarget.childNodes[0].textContent; //Get Column Header text
		// 		var oIndex = oTarget.id.slice(-1);
		// 		if (oIndex == "6") {
		// 			oIndex = 14;
		// 		} else if (oIndex == "3") {
		// 			oIndex = 7;
		// 		} else if (oIndex == "2") {
		// 			oIndex = 9;
		// 		} else if (oIndex == "4") {
		// 			oIndex = 11;
		// 		} else if (oIndex == "8") {
		// 			oIndex = 16;
		// 		} else if (oIndex == "5") {
		// 			oIndex = 13;
		// 		} else if (oIndex == "7") {
		// 			oIndex = 15;
		// 		} else if (oIndex == "9") {
		// 			oIndex = 17;
		// 		}

		// 		var oView = that.getView();
		// 		var oTable = oView.byId("table1VSR");
		// 		var oModel = oTable.getBinding("items").getModel().getData(); //Get Hold of Table Model Values
		// 		var oKeys = Object.keys(oModel[0]); //Get Hold of Model Keys to filter the value
		// 		oTable.getBinding("items").getModel().setProperty("/bindingValue", oKeys[oIndex]); //Save the key value to property
		// 		switch (that.selooLabelText) {
		// 		case "Model":
		// 			if (that.getView().byId("moAsIcon").getVisible() == false) {
		// 				that.onAscending();
		// 			} else if (that.getView().byId("moAsIcon").getVisible() == true) {
		// 				that.onDescending();
		// 			}
		// 			break;
		// 		case "Color":
		// 			if (that.getView().byId("coAsIcon").getVisible() == false) {
		// 				that.onAscending();
		// 			} else if (that.getView().byId("coAsIcon").getVisible() == true) {
		// 				that.onDescending();
		// 			}
		// 			break;
		// 		case "Suffix":
		// 			if (that.getView().byId("suAsIcon").getVisible() == false) {
		// 				that.onAscending();
		// 			} else if (that.getView().byId("suAsIcon").getVisible() == true) {
		// 				that.onDescending();
		// 			}
		// 			break;
		// 		case "APX":
		// 			if (that.getView().byId("apAsIcon").getVisible() == false) {
		// 				that.onAscending();
		// 			} else if (that.getView().byId("apAsIcon").getVisible() == true) {
		// 				that.onDescending();
		// 			}
		// 			break;
		// 		case "Order Type":
		// 			if (that.getView().byId("otAsIcon").getVisible() == false) {
		// 				that.onAscending();
		// 			} else if (that.getView().byId("otAsIcon").getVisible() == true) {
		// 				that.onDescending();
		// 			}
		// 			break;
		// 		case "ETA From":
		// 			if (that.getView().byId("etfAsIcon").getVisible() == false) {
		// 				that.onAscending();
		// 			} else if (that.getView().byId("etfAsIcon").getVisible() == true) {
		// 				that.onDescending();
		// 			}
		// 			break;
		// 		case "ETA To":
		// 			if (that.getView().byId("ettAsIcon").getVisible() == false) {
		// 				that.onAscending();
		// 			} else if (that.getView().byId("ettAsIcon").getVisible() == true) {
		// 				that.onDescending();
		// 			}
		// 			break;
		// 		case "Accessory Install":
		// 			if (that.getView().byId("aiAsIcon").getVisible() == false) {
		// 				that.onAscending();
		// 			} else if (that.getView().byId("aiAsIcon").getVisible() == true) {
		// 				that.onDescending();
		// 			}
		// 			break;

		// 		}

		// 		//	that._oResponsivePopover.openBy(oTarget);
		// 	});
		// },
		// onChange: function (oEvent) {
		// 	var oValue = oEvent.getParameter("value");
		// 	var oMultipleValues = oValue.split(",");
		// 	var oTable = this.getView().byId("idProductsTable");
		// 	var oBindingPath = this.getView().getModel().getProperty("/bindingValue"); //Get Hold of Model Key value that was saved
		// 	var aFilters = [];
		// 	for (var i = 0; i < oMultipleValues.length; i++) {
		// 		var oFilter = new Filter(oBindingPath, "Contains", oMultipleValues[i]);
		// 		aFilters.push(oFilter);
		// 	}
		// 	var oItems = oTable.getBinding("items");
		// 	oItems.filter(aFilters, "Application");
		// 	//	this._oResponsivePopover.close();
		// },

		// onAscending: function () {
		// 	var that = this;
		// 	that.getView().byId("table1VSR").destroyItems();
		// 	var oTable = this.getView().byId("table1VSR");
		// 	var oItems = oTable.getBinding("items");
		// 	oTable.getBinding("items").aSorters = null;
		// 	var oBindingPath = oItems.getModel().getProperty("/bindingValue");
		// 	var oSorter = new Sorter(oBindingPath, false);
		// 	oItems.sort(oSorter);
		// 	if (this.selooLabelText == "Model") {
		// 		this.getView().byId("moAsIcon").setVisible(true);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("coAsIcon").setVisible(false);
		// 		this.getView().byId("coDsIcon").setVisible(false);
		// 		this.getView().byId("suAsIcon").setVisible(false);
		// 		this.getView().byId("suDsIcon").setVisible(false);
		// 		this.getView().byId("apAsIcon").setVisible(false);
		// 		this.getView().byId("apDsIcon").setVisible(false);
		// 		this.getView().byId("otAsIcon").setVisible(false);
		// 		this.getView().byId("otDsIcon").setVisible(false);
		// 		this.getView().byId("etfAsIcon").setVisible(false);
		// 		this.getView().byId("etfDsIcon").setVisible(false);
		// 		this.getView().byId("ettAsIcon").setVisible(false);
		// 		this.getView().byId("ettDsIcon").setVisible(false);
		// 		this.getView().byId("aiAsIcon").setVisible(false);
		// 		this.getView().byId("aiDsIcon").setVisible(false);

		// 	} else if (this.selooLabelText == "Color") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("coAsIcon").setVisible(true);
		// 		this.getView().byId("coDsIcon").setVisible(false);
		// 		this.getView().byId("suAsIcon").setVisible(false);
		// 		this.getView().byId("suDsIcon").setVisible(false);
		// 		this.getView().byId("apAsIcon").setVisible(false);
		// 		this.getView().byId("apDsIcon").setVisible(false);
		// 		this.getView().byId("otAsIcon").setVisible(false);
		// 		this.getView().byId("otDsIcon").setVisible(false);
		// 		this.getView().byId("etfAsIcon").setVisible(false);
		// 		this.getView().byId("etfDsIcon").setVisible(false);
		// 		this.getView().byId("ettAsIcon").setVisible(false);
		// 		this.getView().byId("ettDsIcon").setVisible(false);
		// 		this.getView().byId("aiAsIcon").setVisible(false);
		// 		this.getView().byId("aiDsIcon").setVisible(false);

		// 	} else if (this.selooLabelText == "Suffix") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("coAsIcon").setVisible(false);
		// 		this.getView().byId("coDsIcon").setVisible(false);
		// 		this.getView().byId("suAsIcon").setVisible(true);
		// 		this.getView().byId("suDsIcon").setVisible(false);
		// 		this.getView().byId("apAsIcon").setVisible(false);
		// 		this.getView().byId("apDsIcon").setVisible(false);
		// 		this.getView().byId("otAsIcon").setVisible(false);
		// 		this.getView().byId("otDsIcon").setVisible(false);
		// 		this.getView().byId("etfAsIcon").setVisible(false);
		// 		this.getView().byId("etfDsIcon").setVisible(false);
		// 		this.getView().byId("ettAsIcon").setVisible(false);
		// 		this.getView().byId("ettDsIcon").setVisible(false);
		// 		this.getView().byId("aiAsIcon").setVisible(false);
		// 		this.getView().byId("aiDsIcon").setVisible(false);
		// 	} else if (this.selooLabelText == "APX") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("coAsIcon").setVisible(false);
		// 		this.getView().byId("coDsIcon").setVisible(false);
		// 		this.getView().byId("suAsIcon").setVisible(false);
		// 		this.getView().byId("suDsIcon").setVisible(false);
		// 		this.getView().byId("apAsIcon").setVisible(true);
		// 		this.getView().byId("apDsIcon").setVisible(false);
		// 		this.getView().byId("otAsIcon").setVisible(false);
		// 		this.getView().byId("otDsIcon").setVisible(false);
		// 		this.getView().byId("etfAsIcon").setVisible(false);
		// 		this.getView().byId("etfDsIcon").setVisible(false);
		// 		this.getView().byId("ettAsIcon").setVisible(false);
		// 		this.getView().byId("ettDsIcon").setVisible(false);
		// 		this.getView().byId("aiAsIcon").setVisible(false);
		// 		this.getView().byId("aiDsIcon").setVisible(false);
		// 	} else if (this.selooLabelText == "Order Type") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("coAsIcon").setVisible(false);
		// 		this.getView().byId("coDsIcon").setVisible(false);
		// 		this.getView().byId("suAsIcon").setVisible(false);
		// 		this.getView().byId("suDsIcon").setVisible(false);
		// 		this.getView().byId("apAsIcon").setVisible(false);
		// 		this.getView().byId("apDsIcon").setVisible(false);
		// 		this.getView().byId("otAsIcon").setVisible(true);
		// 		this.getView().byId("otDsIcon").setVisible(false);
		// 		this.getView().byId("etfAsIcon").setVisible(false);
		// 		this.getView().byId("etfDsIcon").setVisible(false);
		// 		this.getView().byId("ettAsIcon").setVisible(false);
		// 		this.getView().byId("ettDsIcon").setVisible(false);
		// 		this.getView().byId("aiAsIcon").setVisible(false);
		// 		this.getView().byId("aiDsIcon").setVisible(false);
		// 	} else if (this.selooLabelText == "ETA From") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("coAsIcon").setVisible(false);
		// 		this.getView().byId("coDsIcon").setVisible(false);
		// 		this.getView().byId("suAsIcon").setVisible(false);
		// 		this.getView().byId("suDsIcon").setVisible(false);
		// 		this.getView().byId("apAsIcon").setVisible(false);
		// 		this.getView().byId("apDsIcon").setVisible(false);
		// 		this.getView().byId("otAsIcon").setVisible(false);
		// 		this.getView().byId("otDsIcon").setVisible(false);
		// 		this.getView().byId("etfAsIcon").setVisible(true);
		// 		this.getView().byId("etfDsIcon").setVisible(false);
		// 		this.getView().byId("ettAsIcon").setVisible(false);
		// 		this.getView().byId("ettDsIcon").setVisible(false);
		// 		this.getView().byId("aiAsIcon").setVisible(false);
		// 		this.getView().byId("aiDsIcon").setVisible(false);
		// 	} else if (this.selooLabelText == "ETA To") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("coAsIcon").setVisible(false);
		// 		this.getView().byId("coDsIcon").setVisible(false);
		// 		this.getView().byId("suAsIcon").setVisible(false);
		// 		this.getView().byId("suDsIcon").setVisible(false);
		// 		this.getView().byId("apAsIcon").setVisible(false);
		// 		this.getView().byId("apDsIcon").setVisible(false);
		// 		this.getView().byId("otAsIcon").setVisible(false);
		// 		this.getView().byId("otDsIcon").setVisible(false);
		// 		this.getView().byId("etfAsIcon").setVisible(false);
		// 		this.getView().byId("etfDsIcon").setVisible(false);
		// 		this.getView().byId("ettAsIcon").setVisible(true);
		// 		this.getView().byId("ettDsIcon").setVisible(false);
		// 		this.getView().byId("aiAsIcon").setVisible(false);
		// 		this.getView().byId("aiDsIcon").setVisible(false);
		// 	} else if (this.selooLabelText == "Accessory Install") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("coAsIcon").setVisible(false);
		// 		this.getView().byId("coDsIcon").setVisible(false);
		// 		this.getView().byId("suAsIcon").setVisible(false);
		// 		this.getView().byId("suDsIcon").setVisible(false);
		// 		this.getView().byId("apAsIcon").setVisible(false);
		// 		this.getView().byId("apDsIcon").setVisible(false);
		// 		this.getView().byId("otAsIcon").setVisible(false);
		// 		this.getView().byId("otDsIcon").setVisible(false);
		// 		this.getView().byId("etfAsIcon").setVisible(false);
		// 		this.getView().byId("etfDsIcon").setVisible(false);
		// 		this.getView().byId("ettAsIcon").setVisible(false);
		// 		this.getView().byId("ettDsIcon").setVisible(false);
		// 		this.getView().byId("aiAsIcon").setVisible(true);
		// 		this.getView().byId("aiDsIcon").setVisible(false);
		// 	}
		// 	//
		// 	//	this._oResponsivePopover.close();
		// },

		// onDescending: function () {
		// 	var that = this;
		// 	that.getView().byId("table1VSR").destroyItems();
		// 	var oTable = this.getView().byId("table1VSR");
		// 	var oItems = oTable.getBinding("items");
		// 	oTable.getBinding("items").aSorters = null;
		// 	var oBindingPath = oItems.getModel().getProperty("/bindingValue");
		// 	var oSorter = new Sorter(oBindingPath, true);
		// 	oItems.sort(oSorter);

		// 	if (this.selooLabelText == "Model") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(true);
		// 	} else if (this.selooLabelText == "Color") {
		// 		this.getView().byId("coAsIcon").setVisible(false);
		// 		this.getView().byId("coDsIcon").setVisible(true);
		// 	} else if (this.selooLabelText == "Suffix") {
		// 		this.getView().byId("suAsIcon").setVisible(false);
		// 		this.getView().byId("suDsIcon").setVisible(true);
		// 	} else if (this.selooLabelText == "APX") {
		// 		this.getView().byId("apAsIcon").setVisible(false);
		// 		this.getView().byId("apDsIcon").setVisible(true);
		// 	} else if (this.selooLabelText == "Order Type") {
		// 		this.getView().byId("otAsIcon").setVisible(false);
		// 		this.getView().byId("otDsIcon").setVisible(true);
		// 	} else if (this.selooLabelText == "ETA From") {
		// 		this.getView().byId("etfAsIcon").setVisible(false);
		// 		this.getView().byId("etfDsIcon").setVisible(true);
		// 	} else if (this.selooLabelText == "ETA To") {
		// 		this.getView().byId("ettAsIcon").setVisible(false);
		// 		this.getView().byId("ettDsIcon").setVisible(true);
		// 	} else if (this.selooLabelText == "Accessory Install") {
		// 		this.getView().byId("aiAsIcon").setVisible(false);
		// 		this.getView().byId("aiDsIcon").setVisible(true);
		// 	}
		// 	//	this._oResponsivePopover.close();
		// },

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
		// populateData: function (start, rowCount) {
		// 	var that = this;

		// 	sap.ui.getCore().byId("Previous").setEnabled(true);
		// 	sap.ui.getCore().byId("Next").setEnabled(true);
		// 	that.getView().byId("table1VSR").destroyItems();

		// 	for (var i = start; i < start + rowCount; i++) {
		// 		var oTableRow = new sap.m.ColumnListItem({

		// 			type: "Active",
		// 			visible: true,
		// 			selected: true,
		// 			cells: [
		// 				new sap.m.Link({
		// 					text: "Trade"

		// 				}),
		// 				new sap.m.Text({
		// 					text: (that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/KUNNR") + "-" + that.getView().getModel(
		// 						"VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/NAME1"))

		// 				}),

		// 				new sap.m.Text({
		// 					text: (that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/MATNR") + "-" + that.getView().getModel(
		// 						"VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/MODEL_DESC_EN"))

		// 				}),
		// 				new sap.m.Text({
		// 					text: (that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/ZZEXTCOL") + "-" + that.getView()
		// 						.getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/MKTG_DESC_EN"))

		// 				}),
		// 				new sap.m.Text({
		// 					text: (that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/ZZSUFFIX") + "-" + that.getView()
		// 						.getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/SUFFIX_DESC_EN"))

		// 				}),
		// 				new sap.m.Text({
		// 					text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/ZZAPX")

		// 				}),
		// 				new sap.m.Text({
		// 					text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/ZZORDERTYPE")

		// 				}),
		// 				new sap.m.Text({
		// 					text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/ZZADDDATA4")

		// 				}),
		// 				new sap.m.Text({
		// 					text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/PSTSP")

		// 				}),
		// 				new sap.m.Text({
		// 					text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/Z_PD_FLAG")

		// 				}),
		// 				new sap.m.Text({
		// 					text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/ORT01")

		// 				}),
		// 				new sap.m.Text({
		// 					text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/REGIO")

		// 				})

		// 			]
		// 		});
		// 		that.getView().byId("table1VSR").addItem(oTableRow);

		// 		if (i == that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/length") - 1) {

		// 			sap.ui.getCore().byId("Next").setEnabled(false);

		// 			break;

		// 		}
		// 	}

		// 	if (start == 0) {

		// 		sap.ui.getCore().byId("Previous").setEnabled(false);

		// 	}

		// },
		handlebacksearch: function () {
			this.getView().byId("chknew").setSelected(false);
			this.getView().byId("chkexi").setSelected(false);
			this.getRouter().navTo("VehicleLocSearch");
			this.getView().byId("VLRSuffix").updateBindings();
		},
		SuffixFilter: function () {

			if (sap.ui.getCore().getModel("SearchedData") && sap.ui.getCore().getModel("oSuffieldmodel") != undefined) {
				this.getView().setModel(sap.ui.getCore().getModel("SearchedData"), "VehicleLocatorScdScr");

				var Status = sap.ui.getCore().getModel("SearchedData").getData();
				var model = new sap.ui.model.json.JSONModel(Status);
				model.setSizeLimit(1000);
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
				var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language;
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
				for (var i = 0, len = Color.length; i < len; i++)
					obj[Color[i]['zzextcol']] = Color[i];
				Color = new Array();
				for (var key in obj)
					Color.push(obj[key]);
				var Model = new sap.ui.model.json.JSONModel(Color);
				Model.setSizeLimit(1000);
				this.getView().byId("VLRColor").setModel(Model);
				if (Color.length != 0) {
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
				} else {
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
				}
			}

			/*var obj = {};
			for (var i = 0, len = Suffix.length; i < len; i++)
			/*	obj[Suffix[i]['zzsuffix']] = Suffix[i];*/
			/*	obj[Suffix[i]['zzsuffix']] = Suffix[i];
				Suffix = new Array();
				for (var key in obj)
			/*		Suffix.push(obj[key]);*/
			/*if (this.getView().byId("table1VSR").getModel().getData().length != 0) {
			 */

			/*var Model = new sap.ui.model.json.JSONModel(SuffixData);
			Model.setSizeLimit(1000);
			this.getView().byId("VLRSuffix").setModel(Model);*/

			//}/* else {*/
			/*	var Model = new sap.ui.model.json.JSONModel([]);
				Model.setSizeLimit(1000);
				this.getView().byId("VLRSuffix").setModel(Model);*/
			/*	}*/
			if (SuffixData.length != 0) {

				/*	this.getView().byId("VLRSuffix").setSelectedKey(sap.ui.getCore().SuffixSelectedKey);*/
				//	this.getView().byId("VLRSuffix").setSelectedText(sap.ui.getCore().SuffixSelectedItem);
				/*	if(SuffixData[0].SPRAS.slice(0,1)!="E"){
						this.getView().byId("VLRSuffix").setSelectedItem(SuffixData[0].zzsuffix + "-" + SuffixData[0].suffix_desc_fr + SuffixData[0].mrktg_int_desc_fr);
					
					}
					else{
					this.getView().byId("VLRSuffix").setSelectedItem(SuffixData[0].zzsuffix + "-" + SuffixData[0].suffix_desc_en + SuffixData[0].mrktg_int_desc_en);
						
					}*/
				/*	var AllAdd=SuffixData.filter(function())*/

				/*	var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
				
					this.getView().byId("VLRSuffix").insertItem(newItem);*/
			}

			var obj = {};
			for (var i = 0, len = Status.length; i < len; i++)
				obj[Status[i]['zz_trading_ind']] = Status[i];
			Status = new Array();
			for (var key in obj)
				Status.push(obj[key]);

			/*Status.splice(-1,1);*/
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
			var Model = new sap.ui.model.json.JSONModel(StatusDataFilter);
			Model.setSizeLimit(1000);

			var StatusFilter = StatusDataFilter.filter(function (x) {
				return (x.zz_trading_ind == "2" || x.zz_trading_ind == "3");
			});
			var Statusind1 = StatusDataFilter.filter(function (x) {
				return (x.zz_trading_ind == "1");
			});

			this.getView().byId("VLRStatus").setModel(Model);
			if (StatusFilter.length != 0) {

				this.getView().byId("VLRStatus").setSelectedItem("Pipeline - Routable");
				this.getView().byId("VLRStatus").setSelectedKey(sap.ui.getCore().SelectedStauts);
			} else if (StatusDataFilter.length != 0) {
				var newItem = new sap.ui.core.Item({
					key: "2",
					text: "Pipeline - Routable"
				});
				this.getView().byId("VLRStatus").insertItem(newItem);
				this.getView().byId("VLRStatus").setSelectedItem("Pipeline - Routable");
				this.getView().byId("VLRStatus").setSelectedKey(sap.ui.getCore().SelectedStauts);
			}
			if (Statusind1.length == 0) {
				var newItem = new sap.ui.core.Item({
					key: "1",
					text: "Stock-Non-Routable"
				});
				this.getView().byId("VLRStatus").insertItem(newItem);
			}
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
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRDealer").insertItem(newItem);
					this.getView().byId("VLRDealer").setSelectedItem("ALL");
					this.getView().byId("VLRDealer").setSelectedKey("all");
				}
			} else {
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

			}

			this.onStatusChange();
			sap.ui.core.BusyIndicator.hide();
			/*	{

					var filterArray = [];

					this.getView().byId("table1VSR").getBinding("rows").filter([]);
					// onVlrCommonChange
					var Status = this.getView().byId("VLRStatus").getSelectedKey();
					if (Status != "") {

						filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status));
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
			}*/
		},
		Nodata: function () {

			//	if (sap.ui.getCore().getModel("SearchedData") && sap.ui.getCore().getModel("oSuffieldmodel") != undefined) {
			//	this.getView().setModel(sap.ui.getCore().getModel("SearchedData"), "VehicleLocatorScdScr");

			//	var Status = sap.ui.getCore().getModel("SearchedData").getData();
			var model = new sap.ui.model.json.JSONModel([]);
			model.setSizeLimit(1000);
			// this.getView().byId("table1VSR").setModel(model); //guna
			this.getView().setModel(model, "vehicleSearchTableModel");

			var tableLength = this.getView().getModel("vehicleSearchTableModel").getData().length;
			var oModelDetail = this.getView().getModel("detailView");

			var sExpectedText = this.getView().getModel("i18n").getResourceBundle().getText("tableCount", [tableLength]);
			oModelDetail.setProperty("/tableCount", sExpectedText);

			var Model = new sap.ui.model.json.JSONModel([]);
			Model.setSizeLimit(1000);
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
			Model.setSizeLimit(1000);

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
			if (Dealer.length != 0) {
				if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
						return x.mProperties.key == "all"
					}).length == 0) {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRDealer").insertItem(newItem);
					var SelctKey = Dealer.filter(function (x) {
						return x.kunnr == selctedDealer
					});
					if (selctedDealer == "" || SelctKey.length == 0) {
						this.getView().byId("VLRDealer").setSelectedItem("ALL");
						this.getView().byId("VLRDealer").setSelectedKey("all");
					} else {
						this.getView().byId("VLRDealer").setSelectedKey(selctedDealer);
					}
				}
			} else {
				if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
						return x.mProperties.key == "all"
					}).length == 0) {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRDealer").insertItem(newItem);
					if (selctedDealer == "") {
						this.getView().byId("VLRDealer").setSelectedItem("ALL");
						this.getView().byId("VLRDealer").setSelectedKey("all");
					} else {
						this.getView().byId("VLRDealer").setSelectedKey(selctedDealer);
					}
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
			Model.setSizeLimit(1000);
			var selctedColor = this.getView().byId("VLRColor").getSelectedKey();
			this.getView().byId("VLRColor").setModel(Model);
			if (Color.length != 0) {
				if (this.getView().byId("VLRColor").getItems().filter(function (x) {
						return x.mProperties.key == "all"
					}).length == 0) {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					var SelctKey = Color.filter(function (x) {
						return x.zzextcol == selctedColor
					});
					this.getView().byId("VLRColor").insertItem(newItem);

					/*this.getView().byId("VLRColor").setSelectedKey("all");
					this.getView().byId("VLRColor").setSelectedItem("ALL");*/
					if (selctedColor == "" || SelctKey.length == 0) {
						this.getView().byId("VLRColor").setSelectedItem("ALL");
						this.getView().byId("VLRColor").setSelectedKey("all");
					} else {
						this.getView().byId("VLRColor").setSelectedKey(selctedColor);
					}
				}
			} else {
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
			}
			//	}

			this.onStatusChange();

		},

		//  guna custom code ==================================

		onLiveChange: function (oEvent) {
			this.sSearchQuery = oEvent.getSource()
				.getValue();
			this.fnApplyFiltersAndOrdering();
		},
		fnApplyFiltersAndOrdering: function (oEvent) {
			var aFilters = [],
				aSorters = [];

			aSorters.push(new Sorter("dealerId1", this.bDescending));

			if (this.sSearchQuery) {
				var oFilter = new Filter([
					new Filter("kunnr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("matnr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzapx", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzextcol", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzordertype", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzadddata4", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("pstsp", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("non_D_flag", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("ort01", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("bezei", sap.ui.model.FilterOperator.Contains, this.sSearchQuery)
				], false);
				// this.sSearchQuery);
				aFilters.push(oFilter);
			}

			this.byId("table1VSR")
				.getBinding("items")
				.filter(aFilters)
				.sort(aSorters);
		},

		// handleViewSettingsDialogButtonPressed : function(oEvent) {
		//     if (!this._oDialog) {
		//         this._oDialog = sap.ui.xmlfragment("vehicleSortDialog", "vehicleLocator.Dialog",
		//             this);
		//         this._addSortItems();

		//     }
		//     // toggle compact style
		//     jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(),
		//         this._oDialog);
		//     this._oDialog.open();
		// },

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
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRDealer").insertItem(newItem);
					var SelctKey = Dealer.filter(function (x) {
						return x.kunnr == selctedDealer;
					});
					if (selctedDealer == "" || SelctKey.length == 0) {
						this.getView().byId("VLRDealer").setSelectedItem("ALL");
						this.getView().byId("VLRDealer").setSelectedKey("all");
					} else {
						this.getView().byId("VLRDealer").setSelectedKey(selctedDealer);
					}
				}
			} else {
				if (this.getView().byId("VLRDealer").getItems().filter(function (x) {
						return x.mProperties.key == "all";
					}).length == 0) {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRDealer").insertItem(newItem);
					if (selctedDealer == "") {
						this.getView().byId("VLRDealer").setSelectedItem("ALL");
						this.getView().byId("VLRDealer").setSelectedKey("all");
					} else {
						this.getView().byId("VLRDealer").setSelectedKey(selctedDealer);
					}
				}

			}
			this.onStatusChange();

		},
		onDealerChange: function () {

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
			Model.setSizeLimit(1000);
			var selctedColor = this.getView().byId("VLRColor").getSelectedKey();
			this.getView().byId("VLRColor").setModel(Model);
			if (Color.length != 0) {
				if (this.getView().byId("VLRColor").getItems().filter(function (x) {
						return x.mProperties.key == "all";
					}).length == 0) {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					var SelctKey = Color.filter(function (x) {
						return x.zzextcol == selctedColor;
					});
					this.getView().byId("VLRColor").insertItem(newItem);

					/*this.getView().byId("VLRColor").setSelectedKey("all");
					this.getView().byId("VLRColor").setSelectedItem("ALL");*/
					if (selctedColor == "" || SelctKey.length == 0) {
						this.getView().byId("VLRColor").setSelectedItem("ALL");
						this.getView().byId("VLRColor").setSelectedKey("all");
					} else {
						this.getView().byId("VLRColor").setSelectedKey(selctedColor);
					}
				}
			} else {
				if (this.getView().byId("VLRColor").getItems().filter(function (x) {
						return x.mProperties.key == "all";
					}).length == 0) {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRColor").insertItem(newItem);
					this.getView().byId("VLRColor").setSelectedKey("all");
					this.getView().byId("VLRColor").setSelectedItem("ALL");
				}
			}

			this.onStatusChange();
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

			}

		/*	{

				var filterArray = [];

				this.getView().byId("table1VSR").getBinding("rows").filter([]);
				// onVlrCommonChange
				var Status = this.getView().byId("VLRStatus").getSelectedKey();
				if (Status != "") {

					filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status));
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
		}*/

		/*	1000=pacific
			2000=prairie
			3000=central
			4000=qubec
			5000=atlanitc
			6000=Export
			8000=landcriser
			9000=lexus*/

	});
});