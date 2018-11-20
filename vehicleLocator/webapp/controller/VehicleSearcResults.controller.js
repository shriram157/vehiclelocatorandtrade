sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/model/json/JSONModel",
      "sap/ui/model/Sorter",
      "sap/ui/model/Filter",
], function (Controller, BaseController, ResourceModel, JSONModel,Sorter,Filter) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleSearcResults", {

		onInit: function () {
			debugger

			//define JSON model
			this._oViewModel = new sap.ui.model.json.JSONModel();

			this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(); // instantiate the resource 

			var that = this;

			if (!this._oResponsivePopover) {
				this._oResponsivePopover = sap.ui.xmlfragment("vehicleLocator.fragment.VehicleSearchResult", this);
				this._oResponsivePopover.setModel(this.getView().getModel());
			}
			var oTable = this.getView().byId("table1VSR");
			oTable.addEventDelegate({
			onAfterRendering: function () {
				
					var oHeader = this.$().find('.sapMListTblHeaderCell'); //Get hold of table header elements
					for (var i = 0; i < oHeader.length; i++) {
						if(i!=0&&i!=1&i!=10&i!=11&i!=oHeader.length)
						var oID = oHeader[i].id;
						that.onClick(oID);
					}
				}
			}, oTable);

			that.oDumData = {
				"Status": [{
					ZZ_TRADING_IND: "Pipleline - Routable"
				}, {
					ZZ_TRADING_IND: "Pipleline - NonRoutable"
				}, {
					ZZ_TRADING_IND: "Pipleline - NonRoutable"
				}],

				"Dealer": [{
						KUNNR: "42120",
						NAME1: "Mendes Toyota"
					}, {
						KUNNR: "01003",
						NAME1: "Sunrise Toyota"
					}, {
						KUNNR: "01092",
						NAME1: "Graveline Toyota"
					}

				],
				"Suffix": [{
						ZZSUFFIX: "AA",
						SUFFIX_DESC_EN: "AA-SUFFIX"

					}, {
						ZZSUFFIX: "DC",
						SUFFIX_DESC_EN: "DC - LTD 5 PSG - 0070 - LA24"

					}, {
						ZZSUFFIX: "BB",
						SUFFIX_DESC_EN: "BB-SR5"

					}

				],
				"Color": [{
					ZZEXTCOL: "0040",
					MKTG_DESC_EN: "Alphine White"
				}, {
					ZZEXTCOL: "0218",
					MKTG_DESC_EN: "MidLight BlackMetalic"
				}, {
					ZZEXTCOL: "01G3",
					MKTG_DESC_EN: "Black"

				}],
				"VehicleTrade": [{
						ZZ_TRADING_IND: "Pipleline - Routable",
						KUNNR: "42120",
						NAME1: "Mendes Toyota",
						ZZEXTCOL: "0040",
						MKTG_DESC_EN: "Alphine White",
						MATNR: "AY5F1T",
						MODEL_DESC_EN: "TUNDRA 4X4 CREWMAX EN",
						ZZSUFFIX: "AA",
						SUFFIX_DESC_EN: "AA-SUFFIX",
						ZZAPX: "00",
						ZZORDERTYPE: "Stock - Open",
						ZZADDDATA4: "2017-02-06",
						PSTSP: "2018-05-01",
						Z_PD_FLAG: "No",
						ORT01: "Ottawa",
						REGIO: "Atlantic Region",
						ZZDNC_IND: "X",
						Z_RELEASE_DATE: "2018-11-18",
						Z_SOLD: "true",
						Z_FLEET: "true"

					}, {
						ZZ_TRADING_IND: "Pipleline - NonRoutable",
						KUNNR: "01003",
						NAME1: "Sunrise Toyota",
						ZZEXTCOL: "0218",
						MKTG_DESC_EN: "MidLight BlackMetalic",
						MATNR: "BZRFHT",
						MODEL_DESC_EN: "HIGHLANDER",
						ZZSUFFIX: "DC",
						SUFFIX_DESC_EN: "DC - LTD 5 PSG - 0070 - LA24",
						ZZAPX: "00",
						ZZORDERTYPE: "Stock - Open",
						ZZADDDATA4: "2018-02-06",
						PSTSP: "2019-05-01",
						Z_PD_FLAG: "No",
						ORT01: "Ontario",
						REGIO: "Central Canada",
						ZZDNC_IND: "",
						Z_RELEASE_DATE: "2018-01-18",
						Z_SOLD: "false",
						Z_FLEET: "true"

					}, {
						ZZ_TRADING_IND: "Pipleline - Routable",
						KUNNR: "01092",
						NAME1: "Graveline Toyota",
						ZZEXTCOL: "01G3",
						MKTG_DESC_EN: "Black",
						MATNR: "B42HLT",
						MODEL_DESC_EN: "COROLLA",
						ZZSUFFIX: "BB",
						SUFFIX_DESC_EN: "BB-SR5",
						ZZAPX: "00",
						ZZORDERTYPE: "Stock - Open",
						ZZADDDATA4: "2017-05-01",
						PSTSP: "2018-11-07",
						Z_PD_FLAG: "Yes",
						ORT01: "Alberta",
						REGIO: "The Prairie Provinces",
						ZZDNC_IND: "X",
						Z_RELEASE_DATE: "2017-10-28",
						Z_SOLD: "true",
						Z_FLEET: "false"

					}, {
						ZZ_TRADING_IND: "Pipleline - NonRoutable",
						KUNNR: "42120",
						NAME1: "Mendes Toyota",
						ZZEXTCOL: "0040",
						MKTG_DESC_EN: "Alphine White",
						MATNR: "AY5F1T",
						MODEL_DESC_EN: "TUNDRA 4X4 CREWMAX EN",
						ZZSUFFIX: "BB",
						SUFFIX_DESC_EN: "BB-SR5",
						ZZAPX: "00",
						ZZORDERTYPE: "Stock - Open",
						ZZADDDATA4: "2017-02-06",
						PSTSP: "2018-05-01",
						Z_PD_FLAG: "Yes",
						ORT01: "Ottawa",
						REGIO: "Atlantic Region",
						ZZDNC_IND: "",
						Z_RELEASE_DATE: "2018-11-18",
						Z_SOLD: "false",
						Z_FLEET: "false"

					}, {
						ZZ_TRADING_IND: "Pipleline - Routable",
						KUNNR: "01003",
						NAME1: "Sunrise Toyota",
						ZZEXTCOL: "0218",
						MKTG_DESC_EN: "MidLight BlackMetalic",
						MATNR: "B42HLT",
						MODEL_DESC_EN: "COROLLA",
						ZZSUFFIX: "DC",
						SUFFIX_DESC_EN: "DC - LTD 5 PSG - 0070 - LA24",
						ZZAPX: "00",
						ZZORDERTYPE: "Stock - Open",
						ZZADDDATA4: "2018-02-06",
						PSTSP: "2019-05-01",
						Z_PD_FLAG: "No",
						ORT01: "Ontario",
						REGIO: "Central Canada",
						ZZDNC_IND: "X",
						Z_RELEASE_DATE: "2019-01-28",
						Z_SOLD: "false",
						Z_FLEET: "true"

					}, {
						ZZ_TRADING_IND: "Pipleline - NonRoutable",
						KUNNR: "01092",
						NAME1: "Graveline Toyota",
						ZZEXTCOL: "01G3",
						MKTG_DESC_EN: "Black",
						MATNR: "BF38KT",
						MODEL_DESC_EN: "SIENNA XLE V6 7-PASS 8A",
						ZZSUFFIX: "AA",
						SUFFIX_DESC_EN: "AA-SUFFIX",
						ZZAPX: "00",
						ZZORDERTYPE: "Stock - Open",
						ZZADDDATA4: "2017-05-01",
						PSTSP: "2018-11-07",
						Z_PD_FLAG: "Yes",
						ORT01: "Alberta",
						REGIO: "The Prairie Provinces",
						ZZDNC_IND: "",
						Z_RELEASE_DATE: "2017-08-08",
						Z_SOLD: "true",
						Z_FLEET: "false"

					}

				]

			};
			var oModel = new sap.ui.model.json.JSONModel(that.oDumData);
			this.getView().setModel(oModel, "VehicleLocatorScdScr");

			$.ajax({

				url: "/node/Z_VEHICLE_CATALOGUE_SRV/zc_myear",

				method: "GET",
				async: false,
				dataType: "json",

				success: function (oData) {
					/*console.log(oData);*/
					oData.d.results[0];
					var oJsonModel = new sap.ui.model.json.JSONModel(oData.d.results);
					that.getView().byId("table1VSR").setModel(oJsonModel);

					/* var oEsets = [];
					$.each(oData.d.results[0], function(i, item) {*/
					/*var oBusparLength = item.BusinessPartner.length;*/

					/*	oEsets.push({
							"ModelYear" : oData.d.results[0]
							
							"BusinessPartner": item.BusinessPartner.substring(5, oBusparLength),
							"BusinessPartnerName": item.OrganizationBPName1 
							//item.BusinessPartnerFullName
						});*/

					/*	});*/
					/*	that.getView().setModel(new sap.ui.model.json.JSONModel(oEsets), "oDealerModel");*/

					var oDealer = [];
					$.each(oData.d.results, function (i, item) {
						var oBusparLength = item.BusinessPartner.length;

						oDealer.push({
							"BusinessPartner": item.BusinessPartner.substring(5, oBusparLength),
							"BusinessPartnerName": item.OrganizationBPName1 //item.BusinessPartnerFullName
						});

					});
					that.getView().setModel(new sap.ui.model.json.JSONModel(oDealer), "oDealerModel");
				},
				error: function (response) {

				}
			});

			this.getRouter().attachRouteMatched(this.onRouteMatched, this);

		},
		onStatusChange: function () {
			debugger
			var filterArray = [];
			this.getView().byId("table1VSR").getBinding("items").filter([]);
			// onVlrCommonChange
			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			if (Status != "") {
				this.getView().byId("VLRDealer").setSelectedKey("");
				this.getView().byId("VLRSuffix").setSelectedKey("");
				this.getView().byId("VLRColor").setSelectedKey("");
				filterArray.push(new sap.ui.model.Filter("ZZ_TRADING_IND", sap.ui.model.FilterOperator.Contains, Status));
			}
			var Dealer = this.getView().byId("VLRDealer").getSelectedKey();
			if (Dealer != "") {

				filterArray.push(new sap.ui.model.Filter("KUNNR", sap.ui.model.FilterOperator.Contains, Dealer));
			}
			var Suffix = this.getView().byId("VLRSuffix").getSelectedKey();
			if (Suffix != "") {

				filterArray.push(new sap.ui.model.Filter("ZZSUFFIX", sap.ui.model.FilterOperator.Contains, Suffix));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("ZZEXTCOL", sap.ui.model.FilterOperator.Contains, Color));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("ZZEXTCOL", sap.ui.model.FilterOperator.Contains, Color));
			}
			var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
			if (ShowDoNotCallVehicles == true) {
				/*	ZZDNC_IND: "",
					Z_RELEASE_DATE: "2017-05-01",
					Z_SOLD: "true",
					Z_FLEET: "false"*/
				filterArray.push(new sap.ui.model.Filter("ZZDNC_IND", sap.ui.model.FilterOperator.EQ, "X"));
			}
			var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
			if (ShowHoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_RELEASE_DATE", sap.ui.model.FilterOperator.EQ, "2018-11-18"));
			}
			var IncludeSoldVehicles = this.getView().byId("chkmov").getSelected();
			if (IncludeSoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_SOLD", sap.ui.model.FilterOperator.EQ, IncludeSoldVehicles));
			}
			var IncludeFleetVehicles = this.getView().byId("chkadd").getSelected();
			if (IncludeFleetVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_FLEET", sap.ui.model.FilterOperator.EQ, IncludeFleetVehicles));
			}
			this.getView().byId("table1VSR").getBinding("items").filter(filterArray);
		},
		onDealerChange: function () {

			var filterArray = [];
			this.getView().byId("table1VSR").getBinding("items").filter([]);
			// onVlrCommonChange
			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			if (Status != "") {

				filterArray.push(new sap.ui.model.Filter("ZZ_TRADING_IND", sap.ui.model.FilterOperator.Contains, Status));
			}
			var Dealer = this.getView().byId("VLRDealer").getSelectedKey();
			if (Dealer != "") {
				this.getView().byId("VLRSuffix").setSelectedKey("");
				this.getView().byId("VLRColor").setSelectedKey("");
				filterArray.push(new sap.ui.model.Filter("KUNNR", sap.ui.model.FilterOperator.Contains, Dealer));
			}
			var Suffix = this.getView().byId("VLRSuffix").getSelectedKey();
			if (Suffix != "") {

				filterArray.push(new sap.ui.model.Filter("ZZSUFFIX", sap.ui.model.FilterOperator.Contains, Suffix));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("ZZEXTCOL", sap.ui.model.FilterOperator.Contains, Color));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("ZZEXTCOL", sap.ui.model.FilterOperator.Contains, Color));
			}
			var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
			if (ShowDoNotCallVehicles == true) {
				/*	ZZDNC_IND: "",
					Z_RELEASE_DATE: "2017-05-01",
					Z_SOLD: "true",
					Z_FLEET: "false"*/
				filterArray.push(new sap.ui.model.Filter("ZZDNC_IND", sap.ui.model.FilterOperator.EQ, "X"));
			}
			var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
			if (ShowHoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_RELEASE_DATE", sap.ui.model.FilterOperator.EQ, "2018-11-18"));
			}
			var IncludeSoldVehicles = this.getView().byId("chkmov").getSelected();
			if (IncludeSoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_SOLD", sap.ui.model.FilterOperator.EQ, IncludeSoldVehicles));
			}
			var IncludeFleetVehicles = this.getView().byId("chkadd").getSelected();
			if (IncludeFleetVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_FLEET", sap.ui.model.FilterOperator.EQ, IncludeFleetVehicles));
			}
			this.getView().byId("table1VSR").getBinding("items").filter(filterArray);

		},
		onSuffixChange: function () {

			var filterArray = [];
			this.getView().byId("table1VSR").getBinding("items").filter([]);
			// onVlrCommonChange
			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			if (Status != "") {

				filterArray.push(new sap.ui.model.Filter("ZZ_TRADING_IND", sap.ui.model.FilterOperator.Contains, Status));
			}
			var Dealer = this.getView().byId("VLRDealer").getSelectedKey();
			if (Dealer != "") {

				filterArray.push(new sap.ui.model.Filter("KUNNR", sap.ui.model.FilterOperator.Contains, Dealer));
			}
			var Suffix = this.getView().byId("VLRSuffix").getSelectedKey();
			if (Suffix != "") {
				this.getView().byId("VLRColor").setSelectedKey("");
				filterArray.push(new sap.ui.model.Filter("ZZSUFFIX", sap.ui.model.FilterOperator.Contains, Suffix));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("ZZEXTCOL", sap.ui.model.FilterOperator.Contains, Color));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("ZZEXTCOL", sap.ui.model.FilterOperator.Contains, Color));
			}
			var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
			if (ShowDoNotCallVehicles == true) {
				/*	ZZDNC_IND: "",
					Z_RELEASE_DATE: "2017-05-01",
					Z_SOLD: "true",
					Z_FLEET: "false"*/
				filterArray.push(new sap.ui.model.Filter("ZZDNC_IND", sap.ui.model.FilterOperator.EQ, "X"));
			}
			var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
			if (ShowHoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_RELEASE_DATE", sap.ui.model.FilterOperator.EQ, "2018-11-18"));
			}
			var IncludeSoldVehicles = this.getView().byId("chkmov").getSelected();
			if (IncludeSoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_SOLD", sap.ui.model.FilterOperator.EQ, IncludeSoldVehicles));
			}
			var IncludeFleetVehicles = this.getView().byId("chkadd").getSelected();
			if (IncludeFleetVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_FLEET", sap.ui.model.FilterOperator.EQ, IncludeFleetVehicles));
			}
			this.getView().byId("table1VSR").getBinding("items").filter(filterArray);

		},
		onColorChange: function () {

			var filterArray = [];
			this.getView().byId("table1VSR").getBinding("items").filter([]);
			// onVlrCommonChange
			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			if (Status != "") {

				filterArray.push(new sap.ui.model.Filter("ZZ_TRADING_IND", sap.ui.model.FilterOperator.Contains, Status));
			}
			var Dealer = this.getView().byId("VLRDealer").getSelectedKey();
			if (Dealer != "") {

				filterArray.push(new sap.ui.model.Filter("KUNNR", sap.ui.model.FilterOperator.Contains, Dealer));
			}
			var Suffix = this.getView().byId("VLRSuffix").getSelectedKey();
			if (Suffix != "") {

				filterArray.push(new sap.ui.model.Filter("ZZSUFFIX", sap.ui.model.FilterOperator.Contains, Suffix));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("ZZEXTCOL", sap.ui.model.FilterOperator.Contains, Color));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("ZZEXTCOL", sap.ui.model.FilterOperator.Contains, Color));
			}
			var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
			if (ShowDoNotCallVehicles == true) {
				/*	ZZDNC_IND: "",
					Z_RELEASE_DATE: "2017-05-01",
					Z_SOLD: "true",
					Z_FLEET: "false"*/
				filterArray.push(new sap.ui.model.Filter("ZZDNC_IND", sap.ui.model.FilterOperator.EQ, "X"));
			}
			var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
			if (ShowHoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_RELEASE_DATE", sap.ui.model.FilterOperator.EQ, "2018-11-18"));
			}
			var IncludeSoldVehicles = this.getView().byId("chkmov").getSelected();
			if (IncludeSoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_SOLD", sap.ui.model.FilterOperator.EQ, IncludeSoldVehicles));
			}
			var IncludeFleetVehicles = this.getView().byId("chkadd").getSelected();
			if (IncludeFleetVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_FLEET", sap.ui.model.FilterOperator.EQ, IncludeFleetVehicles));
			}
			this.getView().byId("table1VSR").getBinding("items").filter(filterArray);

		},
		onShowDNCChange: function ()

		{

			var filterArray = [];
			this.getView().byId("table1VSR").getBinding("items").filter([]);
			// onVlrCommonChange
			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			if (Status != "") {

				filterArray.push(new sap.ui.model.Filter("ZZ_TRADING_IND", sap.ui.model.FilterOperator.Contains, Status));
			}
			var Dealer = this.getView().byId("VLRDealer").getSelectedKey();
			if (Dealer != "") {

				filterArray.push(new sap.ui.model.Filter("KUNNR", sap.ui.model.FilterOperator.Contains, Dealer));
			}
			var Suffix = this.getView().byId("VLRSuffix").getSelectedKey();
			if (Suffix != "") {

				filterArray.push(new sap.ui.model.Filter("ZZSUFFIX", sap.ui.model.FilterOperator.Contains, Suffix));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("ZZEXTCOL", sap.ui.model.FilterOperator.Contains, Color));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("ZZEXTCOL", sap.ui.model.FilterOperator.Contains, Color));
			}
			var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
			if (ShowDoNotCallVehicles == true) {
				/*	ZZDNC_IND: "",
					Z_RELEASE_DATE: "2017-05-01",
					Z_SOLD: "true",
					Z_FLEET: "false"*/
				filterArray.push(new sap.ui.model.Filter("ZZDNC_IND", sap.ui.model.FilterOperator.EQ, "X"));
			}
			var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
			if (ShowHoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_RELEASE_DATE", sap.ui.model.FilterOperator.EQ, "2018-11-18"));
			}
			var IncludeSoldVehicles = this.getView().byId("chkmov").getSelected();
			if (IncludeSoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_SOLD", sap.ui.model.FilterOperator.EQ, IncludeSoldVehicles));
			}
			var IncludeFleetVehicles = this.getView().byId("chkadd").getSelected();
			if (IncludeFleetVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_FLEET", sap.ui.model.FilterOperator.EQ, IncludeFleetVehicles));
			}
			this.getView().byId("table1VSR").getBinding("items").filter(filterArray);

		},
		onShowHoldChange: function () {
			var filterArray = [];
			this.getView().byId("table1VSR").getBinding("items").filter([]);
			// onVlrCommonChange
			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			if (Status != "") {

				filterArray.push(new sap.ui.model.Filter("ZZ_TRADING_IND", sap.ui.model.FilterOperator.Contains, Status));
			}
			var Dealer = this.getView().byId("VLRDealer").getSelectedKey();
			if (Dealer != "") {

				filterArray.push(new sap.ui.model.Filter("KUNNR", sap.ui.model.FilterOperator.Contains, Dealer));
			}
			var Suffix = this.getView().byId("VLRSuffix").getSelectedKey();
			if (Suffix != "") {

				filterArray.push(new sap.ui.model.Filter("ZZSUFFIX", sap.ui.model.FilterOperator.Contains, Suffix));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("ZZEXTCOL", sap.ui.model.FilterOperator.Contains, Color));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("ZZEXTCOL", sap.ui.model.FilterOperator.Contains, Color));
			}
			var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
			if (ShowDoNotCallVehicles == true) {
				/*	ZZDNC_IND: "",
					Z_RELEASE_DATE: "2017-05-01",
					Z_SOLD: "true",
					Z_FLEET: "false"*/
				filterArray.push(new sap.ui.model.Filter("ZZDNC_IND", sap.ui.model.FilterOperator.EQ, "X"));
			}
			var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
			if (ShowHoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_RELEASE_DATE", sap.ui.model.FilterOperator.EQ, "2018-11-18"));
			}
			var IncludeSoldVehicles = this.getView().byId("chkmov").getSelected();
			if (IncludeSoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_SOLD", sap.ui.model.FilterOperator.EQ, IncludeSoldVehicles));
			}
			var IncludeFleetVehicles = this.getView().byId("chkadd").getSelected();
			if (IncludeFleetVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_FLEET", sap.ui.model.FilterOperator.EQ, IncludeFleetVehicles));
			}
			this.getView().byId("table1VSR").getBinding("items").filter(filterArray);

		},
		oTradeLinkPress: function(oEvt)
		{
			debugger;
	    var that = this;
	    that.oTableSelect = that.getView().byId("table1VSR");
	    that.oSelectedItems = that.getView().byId("table1VSR").getSelectedItems();
			
		},

		onRouteMatched: function (oEvent)

		{

			/*	  var oReceivedDataString = oEvent.getParameter("arguments").Selecteddata;
				  var oReceivedData = JSON.parse(oReceivedDataString);	*/

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

			var Context = this.getView().byId("table1VSR").getBinding("items").getContexts();
			if (Context.length == 0) {
				sap.m.MessageBox.warning("No data is available to export");
				return
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
			row += '"Dealer",';
			row += '"Model",';
			row += '"Color",';
			row += '"Suffix",';
			row += '"APX",';
			row += '"OrderType",';
			row += '"ETAFrom",';
			row += '"ETATo",';
			row += '"AccessoryInstall",';
			row += '"City",';
			row += '"Province",';

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
				arrData[i].KUNNR = arrData[i].KUNNR + "-" + arrData[i].NAME1;
				arrData[i].MATNR = arrData[i].MATNR + "-" + arrData[i].MODEL_DESC_EN;
				arrData[i].ZZEXTCOL = arrData[i].ZZEXTCOL + "-" + arrData[i].MKTG_DESC_EN;
				arrData[i].ZZSUFFIX = arrData[i].ZZSUFFIX + "-" + arrData[i].SUFFIX_DESC_EN;

				row += '="' + arrData[i].KUNNR + '","' + arrData[i].MATNR + '","' + arrData[i].ZZEXTCOL + '",="' + arrData[i].ZZSUFFIX +
					'",="' + arrData[i].ZZAPX + '",="' + arrData[i].ZZORDERTYPE + '","' + arrData[i].ZZADDDATA4 + '","' + arrData[i].PSTSP +
					'","' + arrData[i].Z_PD_FLAG + '","' + arrData[i].ORT01 + '","' + arrData[i].REGIO + '",';
				//}
				row.slice(1, row.length);
				CSV += row + '\r\n';
			}
			if (CSV == "") {
				alert("Invalid data");
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
		onClick: function (oID) {
			
			var that = this;
			$('#' + oID).click(function (oEvent) { //Attach Table Header Element Event
				var oTarget = oEvent.currentTarget;
				//Get hold of Header Element
				
				var oLabelText = oTarget.childNodes[0].textContent;
				that.selooLabelText= oTarget.childNodes[0].textContent;//Get Column Header text
				var oIndex = oTarget.id.slice(-1); 
			if(oIndex=="6"){
				oIndex=10;
			}
			else if(oIndex=="4"){
					oIndex=7;
			}
			else if(oIndex=="2"){
					oIndex=5;
			}
			else if(oIndex=="7"){
					oIndex=11;
			}
			else if(oIndex=="8"){
					oIndex=12;
			}
				var oView = that.getView();
				var oTable = oView.byId("table1VSR");
				var oModel = oTable.getBinding("items").getModel().getProperty("/VehicleTrade") //Get Hold of Table Model Values
				var oKeys = Object.keys(oModel[0]); //Get Hold of Model Keys to filter the value
				oTable.getBinding("items").getModel().setProperty("/bindingValue", oKeys[oIndex]); //Save the key value to property
				that._oResponsivePopover.openBy(oTarget);
			});
		},
		onChange: function (oEvent) {
			var oValue = oEvent.getParameter("value");
			var oMultipleValues = oValue.split(",");
			var oTable = this.getView().byId("idProductsTable");
			var oBindingPath = this.getView().getModel().getProperty("/bindingValue"); //Get Hold of Model Key value that was saved
			var aFilters = [];
			for (var i = 0; i < oMultipleValues.length; i++) {
				var oFilter = new Filter(oBindingPath, "Contains", oMultipleValues[i]);
				aFilters.push(oFilter)
			}
			var oItems = oTable.getBinding("items");
			oItems.filter(aFilters, "Application");
			this._oResponsivePopover.close();
		},

		onAscending: function () {
			var oTable = this.getView().byId("table1VSR");
			var oItems = oTable.getBinding("items");
			var oBindingPath = oItems.getModel().getProperty("/bindingValue");
			var oSorter = new Sorter(oBindingPath);
			oItems.sort(oSorter);
			if(this.selooLabelText=="Model"){
				this.getView().byId("moAsIcon").setVisible(true);
				this.getView().byId("moDsIcon").setVisible(false)
			}
			else if(this.selooLabelText=="Color"){
				this.getView().byId("coAsIcon").setVisible(true);
				this.getView().byId("coDsIcon").setVisible(false)
			}
			else if(this.selooLabelText=="Suffix"){
				this.getView().byId("suAsIcon").setVisible(true);
				this.getView().byId("suDsIcon").setVisible(false)
			}
			else if(this.selooLabelText=="APX"){
				this.getView().byId("apAsIcon").setVisible(true);
				this.getView().byId("apDsIcon").setVisible(false)
			}
			else if(this.selooLabelText=="Order Type"){
				this.getView().byId("otAsIcon").setVisible(true);
				this.getView().byId("otDsIcon").setVisible(false)
			}
			else if(this.selooLabelText=="ETA From"){
				this.getView().byId("etfAsIcon").setVisible(true);
				this.getView().byId("etfDsIcon").setVisible(false)
			}
			else if(this.selooLabelText=="ETA To"){
				this.getView().byId("ettAsIcon").setVisible(true);
				this.getView().byId("ettDsIcon").setVisible(false)
			}
			else if(this.selooLabelText=="Accessory Install"){
				this.getView().byId("aiAsIcon").setVisible(true);
				this.getView().byId("aiDsIcon").setVisible(false)
			}
			
			this._oResponsivePopover.close();
		},

		onDescending: function () {
			var oTable = this.getView().byId("table1VSR");
			var oItems = oTable.getBinding("items");
			var oBindingPath = oItems.getModel().getProperty("/bindingValue");
			var oSorter = new Sorter(oBindingPath, true);
			oItems.sort(oSorter);
			if(this.selooLabelText=="Model"){
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(true)
			}
			else if(this.selooLabelText=="Color"){
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(true)
			}
			else if(this.selooLabelText=="Suffix"){
				this.getView().byId("suAsIcon").setVisible(false);
				this.getView().byId("suDsIcon").setVisible(true)
			}
			else if(this.selooLabelText=="APX"){
				this.getView().byId("apAsIcon").setVisible(false);
				this.getView().byId("apDsIcon").setVisible(true)
			}
			else if(this.selooLabelText=="Order Type"){
				this.getView().byId("otAsIcon").setVisible(false);
				this.getView().byId("otDsIcon").setVisible(true)
			}
			else if(this.selooLabelText=="ETA From"){
				this.getView().byId("etfAsIcon").setVisible(false);
				this.getView().byId("etfDsIcon").setVisible(true)
			}
			else if(this.selooLabelText=="ETA To"){
				this.getView().byId("ettAsIcon").setVisible(false);
				this.getView().byId("ettDsIcon").setVisible(true)
			}
			else if(this.selooLabelText=="Accessory Install"){
				this.getView().byId("aiAsIcon").setVisible(false);
				this.getView().byId("aiDsIcon").setVisible(true)
			}
			this._oResponsivePopover.close();
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
		}

	});
});