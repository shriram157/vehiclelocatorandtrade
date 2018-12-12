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

			//define JSON model
			this._oViewModel = new sap.ui.model.json.JSONModel();

			this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle(); // instantiate the resource 

			var that = this;

			if (!this._oResponsivePopover) {
				this._oResponsivePopover = sap.ui.xmlfragment("vehicleLocator.fragment.VehicleSearchResult", this);
				this._oResponsivePopover.setModel(this.getView().getModel());
			}
			var oTable = this.getView().byId("table1VSR");
			/*oTable.addEventDelegate({
				onAfterRendering: function () {

					var oHeader = this.$().find('.sapMListTblHeaderCell'); //Get hold of table header elements
					for (var i = 0; i < oHeader.length; i++) {
						if (i != 0 && i != 1 & i != 10 & i != 11 & i != oHeader.length) {
							var oID = oHeader[i].id;
						}

						that.onClick(oID);
					}
				}
			}, oTable);*/

			/*			that.oDumData = {
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

							}],*/
			/*	"VehicleTrade": [{
						ZZ_TRADING_IND: "Pipleline - Routable",
						ZZVTN: "TCIL1000545673",
						ZZMOYR: "2018",
						ZZSERIES_DESC_EN: "CAMRY",
						ZZSERIES_DESC_FR: "CAMRY",
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
						ZZVTN: "TCIL100054454",
						ZZMOYR: "2019",
						ZZSERIES_DESC_EN: "SIENNA",
						ZZSERIES_DESC_FR: "SIENNA",
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
						ZZVTN: "TCIL100054433",
						ZZMOYR: "2019",
						ZZSERIES_DESC_EN: "COROLLA",
						ZZSERIES_DESC_FR: "COROLLA",
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
						ZZVTN: "TCIL100044411",
						ZZMOYR: "2018",
						ZZSERIES_DESC_EN: "RC 300",
						ZZSERIES_DESC_FR: "RC 300",
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
						ZZVTN: "TCIL100043432",
						ZZMOYR: "2017",
						ZZSERIES_DESC_EN: "CAMRY",
						ZZSERIES_DESC_FR: "CAMRY",
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
						ZZVTN: "TCIL100043444",
						ZZMOYR: "2019",
						ZZSERIES_DESC_EN: "SIENNA",
						ZZSERIES_DESC_FR: "SIENNA",
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

					}, {
						ZZ_TRADING_IND: "Pipleline - Routable",
						ZZVTN: "TCIL1000545673",
						ZZMOYR: "2018",
						ZZSERIES_DESC_EN: "CAMRY",
						ZZSERIES_DESC_FR: "CAMRY",
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
						ZZVTN: "TCIL100054454",
						ZZMOYR: "2019",
						ZZSERIES_DESC_EN: "SIENNA",
						ZZSERIES_DESC_FR: "SIENNA",
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
						ZZVTN: "TCIL100054433",
						ZZMOYR: "2019",
						ZZSERIES_DESC_EN: "COROLLA",
						ZZSERIES_DESC_FR: "COROLLA",
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
						ZZVTN: "TCIL100044411",
						ZZMOYR: "2018",
						ZZSERIES_DESC_EN: "RC 300",
						ZZSERIES_DESC_FR: "RC 300",
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
						ZZVTN: "TCIL100043432",
						ZZMOYR: "2017",
						ZZSERIES_DESC_EN: "CAMRY",
						ZZSERIES_DESC_FR: "CAMRY",
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
						ZZVTN: "TCIL100043444",
						ZZMOYR: "2019",
						ZZSERIES_DESC_EN: "SIENNA",
						ZZSERIES_DESC_FR: "SIENNA",
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

					}, {
						ZZ_TRADING_IND: "Pipleline - Routable",
						ZZVTN: "TCIL1000545673",
						ZZMOYR: "2018",
						ZZSERIES_DESC_EN: "CAMRY",
						ZZSERIES_DESC_FR: "CAMRY",
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
						ZZVTN: "TCIL100054454",
						ZZMOYR: "2019",
						ZZSERIES_DESC_EN: "SIENNA",
						ZZSERIES_DESC_FR: "SIENNA",
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
						ZZVTN: "TCIL100054433",
						ZZMOYR: "2019",
						ZZSERIES_DESC_EN: "COROLLA",
						ZZSERIES_DESC_FR: "COROLLA",
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
						ZZVTN: "TCIL100044411",
						ZZMOYR: "2018",
						ZZSERIES_DESC_EN: "RC 300",
						ZZSERIES_DESC_FR: "RC 300",
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
						ZZVTN: "TCIL100043432",
						ZZMOYR: "2017",
						ZZSERIES_DESC_EN: "CAMRY",
						ZZSERIES_DESC_FR: "CAMRY",
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
						ZZVTN: "TCIL100043444",
						ZZMOYR: "2019",
						ZZSERIES_DESC_EN: "SIENNA",
						ZZSERIES_DESC_FR: "SIENNA",
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

					},

					{
						ZZ_TRADING_IND: "Pipleline - Routable",
						ZZVTN: "TCIL1000545673",
						ZZMOYR: "2018",
						ZZSERIES_DESC_EN: "CAMRY",
						ZZSERIES_DESC_FR: "CAMRY",
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
						ZZVTN: "TCIL100054454",
						ZZMOYR: "2019",
						ZZSERIES_DESC_EN: "SIENNA",
						ZZSERIES_DESC_FR: "SIENNA",
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
						ZZVTN: "TCIL100054433",
						ZZMOYR: "2019",
						ZZSERIES_DESC_EN: "COROLLA",
						ZZSERIES_DESC_FR: "COROLLA",
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
						ZZVTN: "TCIL100044411",
						ZZMOYR: "2018",
						ZZSERIES_DESC_EN: "RC 300",
						ZZSERIES_DESC_FR: "RC 300",
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
						ZZVTN: "TCIL100043432",
						ZZMOYR: "2017",
						ZZSERIES_DESC_EN: "CAMRY",
						ZZSERIES_DESC_FR: "CAMRY",
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
						ZZVTN: "TCIL100043444",
						ZZMOYR: "2019",
						ZZSERIES_DESC_EN: "SIENNA",
						ZZSERIES_DESC_FR: "SIENNA",
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

				]*/

			/*	};*/

			/*	this.getView().setModel(oModel, "VehicleLocatorScdScr");
				this.getView().byId("table1VSR").setModel(oModel, "VehicleLocatorScdScr");*/

			this.getView().setModel(sap.ui.getCore().getModel("SearchedData"), "VehicleLocatorScdScr");

			$.ajax({

				url: "/node/Z_VEHICLE_CATALOGUE_SRV/VLCVEHICLE",

				method: "GET",
				async: false,
				dataType: "json",

				success: function (oData) {
					/*console.log(oData);*/
					/*	oData.d.results[0];*/
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

			var filterArray = [];
			/*	this.getView().byId("table1VSR").getBinding("items").filter([]);*/
			this.getView().byId("table1VSR").getBinding("rows").filter([]);
			// onVlrCommonChange
			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			if (Status != "") {
				/*this.getView().byId("VLRDealer").setSelectedKey("");
				this.getView().byId("VLRSuffix").setSelectedKey("");
				this.getView().byId("VLRColor").setSelectedKey("");*/
				filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status));
			}
			var Dealer = this.getView().byId("VLRDealer").getSelectedKey();
			if (Dealer != "" && Dealer != "all") {

				filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, Dealer));
			} else if (Dealer == "all") {

				var SelDealers = this.getView().byId("VLRDealer").getModel().getData();
				for (var i = 0; i < SelDealers.length; i++) {
					filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, SelDealers[i].kunnr));
				}

			}
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
			if (Color != "" && Color != "all") {

				filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, Color));
			} else if (Color == "all") {
				var SelColor = this.getView().byId("VLRSuffix").getModel().getData();
				for (var i = 0; i < SelColor.length; i++) {
					filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, SelColor[i].zzextcol));
				}
			}
			var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
			if (ShowDoNotCallVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, "Y"));
			}
			var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
			if (ShowHoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Hold_stat", sap.ui.model.FilterOperator.EQ, "N"));
			}

			this.getView().byId("table1VSR").getBinding("rows").filter(filterArray);
		},
		/*onDealerChange: function () {

			var filterArray = [];
			

			this.getView().byId("table1VSR").getBinding("items").filter([]);
		
			var Status = this.getView().byId("VLRStatus").getSelectedKey();

			if (Status != "") {

				filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status));
			}
			var Dealer = this.getView().byId("VLRDealer").getSelectedKey();
			if (Dealer != "" && Dealer != "all") {
				this.getView().byId("VLRSuffix").setSelectedKey("");
				this.getView().byId("VLRColor").setSelectedKey("");
				filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, Dealer));
			} else if (Dealer == "all") {
				this.getView().byId("VLRSuffix").setSelectedKey("");
				this.getView().byId("VLRColor").setSelectedKey("");
				var SelDealers = this.getView().byId("VLRDealer").getModel().getData();
				for (var i = 0; i < SelDealers.length; i++) {
					filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, SelDealers[i].kunnr));
				}

			}
			var Suffix = this.getView().byId("VLRSuffix").getSelectedKey();
			if (Suffix != "") {

				filterArray.push(new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, Suffix));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, Color));
			}
			
			var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
			if (ShowDoNotCallVehicles == true) {
			
				filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, "Y"));
			}
			var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
			if (ShowHoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_RELEASE_DATE", sap.ui.model.FilterOperator.EQ, "2018-11-18"));
			}
		
			this.getView().byId("table1VSR").getBinding("items").filter(filterArray);

		},
		onSuffixChange: function () {

			var filterArray = [];
			this.getView().byId("table1VSR").getBinding("items").filter([]);
		
			var Status = this.getView().byId("VLRStatus").getSelectedKey();
			if (Status != "") {

				filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status));
			}
			var Dealer = this.getView().byId("VLRDealer").getSelectedKey();
			if (Dealer != "" && Dealer != "all") {

				filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, Dealer));
			} else if (Dealer == "all") {
				this.getView().byId("VLRSuffix").setSelectedKey("");
				this.getView().byId("VLRColor").setSelectedKey("");
				var SelDealers = this.getView().byId("VLRDealer").getModel().getData();
				for (var i = 0; i < SelDealers.length; i++) {
					filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, SelDealers[i].kunnr));
				}

			}
			var Suffix = this.getView().byId("VLRSuffix").getSelectedKey();
			if (Suffix != "") {
				this.getView().byId("VLRColor").setSelectedKey("");
				filterArray.push(new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, Suffix));
			}
			var Color = this.getView().byId("VLRColor").getSelectedKey();
			if (Color != "") {

				filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, Color));
			}
		
			var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
			if (ShowDoNotCallVehicles == true) {
				
				filterArray.push(new sap.ui.model.Filter("dnc_ind", sap.ui.model.FilterOperator.EQ, "Y"));
			}
			var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
			if (ShowHoldVehicles == true) {

				filterArray.push(new sap.ui.model.Filter("Z_RELEASE_DATE", sap.ui.model.FilterOperator.EQ, "2018-11-18"));
			}
			
			this.getView().byId("table1VSR").getBinding("items").filter(filterArray);

		},*/
		/*	onColorChange: function () {

				var filterArray = [];
				this.getView().byId("table1VSR").getBinding("items").filter([]);
			
				var Status = this.getView().byId("VLRStatus").getSelectedKey();
				if (Status != "") {

					filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status));
				}
				var Dealer = this.getView().byId("VLRDealer").getSelectedKey();
				if (Dealer != "" && Dealer != "all") {

					filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, Dealer));
				} else if (Dealer == "all") {
					this.getView().byId("VLRSuffix").setSelectedKey("");
					this.getView().byId("VLRColor").setSelectedKey("");
					var SelDealers = this.getView().byId("VLRDealer").getModel().getData();
					for (var i = 0; i < SelDealers.length; i++) {
						filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, SelDealers[i].kunnr));
					}

				}
				var Suffix = this.getView().byId("VLRSuffix").getSelectedKey();
				if (Suffix != "") {

					filterArray.push(new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, Suffix));
				}
				var Color = this.getView().byId("VLRColor").getSelectedKey();
				if (Color != "") {

					filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, Color));
				}

				var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
				if (ShowDoNotCallVehicles == true) {
					
					filterArray.push(new sap.ui.model.Filter("ZZDNC_IND", sap.ui.model.FilterOperator.EQ, "X"));
				}
				var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
				if (ShowHoldVehicles == true) {

					filterArray.push(new sap.ui.model.Filter("Z_RELEASE_DATE", sap.ui.model.FilterOperator.EQ, "2018-11-18"));
				}
				
				this.getView().byId("table1VSR").getBinding("items").filter(filterArray);

			},*/
		/*	onShowDNCChange: function ()

			{

				var filterArray = [];
				this.getView().byId("table1VSR").getBinding("items").filter([]);
			
				var Status = this.getView().byId("VLRStatus").getSelectedKey();
				if (Status != "") {

					filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status));
				}
				var Dealer = this.getView().byId("VLRDealer").getSelectedKey();
				if (Dealer != "" && Dealer != "all") {

					filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, Dealer));
				} else if (Dealer == "all") {
					this.getView().byId("VLRSuffix").setSelectedKey("");
					this.getView().byId("VLRColor").setSelectedKey("");
					var SelDealers = this.getView().byId("VLRDealer").getModel().getData();
					for (var i = 0; i < SelDealers.length; i++) {
						filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, SelDealers[i].kunnr));
					}

				}
				var Suffix = this.getView().byId("VLRSuffix").getSelectedKey();
				if (Suffix != "") {

					filterArray.push(new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, Suffix));
				}
				var Color = this.getView().byId("VLRColor").getSelectedKey();
				if (Color != "") {

					filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, Color));
				}

				var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
				if (ShowDoNotCallVehicles == true) {
				
					filterArray.push(new sap.ui.model.Filter("ZZDNC_IND", sap.ui.model.FilterOperator.EQ, "X"));
				}
				var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
				if (ShowHoldVehicles == true) {

					filterArray.push(new sap.ui.model.Filter("Z_RELEASE_DATE", sap.ui.model.FilterOperator.EQ, "2018-11-18"));
				}
				
				this.getView().byId("table1VSR").getBinding("items").filter(filterArray);

			},
			onShowHoldChange: function () {
				var filterArray = [];
				this.getView().byId("table1VSR").getBinding("items").filter([]);
			
				var Status = this.getView().byId("VLRStatus").getSelectedKey();
				if (Status != "") {

					filterArray.push(new sap.ui.model.Filter("zz_trading_ind", sap.ui.model.FilterOperator.Contains, Status));
				}
				var Dealer = this.getView().byId("VLRDealer").getSelectedKey();
				if (Dealer != "" && Dealer != "all") {

					filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, Dealer));
				} else if (Dealer == "all") {
					this.getView().byId("VLRSuffix").setSelectedKey("");
					this.getView().byId("VLRColor").setSelectedKey("");
					var SelDealers = this.getView().byId("VLRDealer").getModel().getData();
					for (var i = 0; i < SelDealers.length; i++) {
						filterArray.push(new sap.ui.model.Filter("kunnr", sap.ui.model.FilterOperator.Contains, SelDealers[i].kunnr));
					}

				}
				var Suffix = this.getView().byId("VLRSuffix").getSelectedKey();
				if (Suffix != "") {

					filterArray.push(new sap.ui.model.Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, Suffix));
				}
				var Color = this.getView().byId("VLRColor").getSelectedKey();
				if (Color != "") {

					filterArray.push(new sap.ui.model.Filter("zzextcol", sap.ui.model.FilterOperator.Contains, Color));
				}
				var Color = this.getView().byId("VLRColor").getSelectedKey();
				if (Color != "") {

					filterArray.push(new sap.ui.model.Filter("ZZEXTCOL", sap.ui.model.FilterOperator.Contains, Color));
				}
				var ShowDoNotCallVehicles = this.getView().byId("chknew").getSelected();
				if (ShowDoNotCallVehicles == true) {
				
					filterArray.push(new sap.ui.model.Filter("ZZDNC_IND", sap.ui.model.FilterOperator.EQ, "X"));
				}
				var ShowHoldVehicles = this.getView().byId("chkexi").getSelected();
				if (ShowHoldVehicles == true) {

					filterArray.push(new sap.ui.model.Filter("Z_RELEASE_DATE", sap.ui.model.FilterOperator.EQ, "2018-11-18"));
				}
				
				this.getView().byId("table1VSR").getBinding("items").filter(filterArray);

			},*/
		oTradeLinkPress: function (oEvt) {
			var that = this;
			that.oTableSelectPath = oEvt.getSource().getParent().getBindingContext().getPath().split("/")[1];
         sap.ui.getCore().VehicheSearcResults=this.getView().byId("table1VSR").getModel().getData();
			if (that.oTableSelectPath != undefined) {
				this.getRouter().navTo("VehicleTrade_CreateSingle", {
					SelectedTrade: that.oTableSelectPath
				});
				that.oTableSelect = undefined;
			} else {
				sap.m.MessageBox.warning("Please select the trade");
				that.oTableSelect = undefined;
			}

		},

		onRouteMatched: function (oEvent)

		{

			var loginUser = oEvent.getParameter("arguments").LoginUser;
			if (loginUser == "Dealer") {
				var oTradecolId = this.getView().byId('TradecolId');
				oTradecolId.setVisible(oTradecolId.getVisible());
				this.getView().byId('table1VSR').setSelectionMode("None");
				var oIncsoldve = this.getView().byId('chkmov');
				oIncsoldve.setVisible(!oIncsoldve.getVisible());
				var oIncFleetveh = this.getView().byId('chkadd');
				oIncFleetveh.setVisible(!oIncFleetveh.getVisible());

			}
			if (sap.ui.getCore().getModel("SearchedData") && sap.ui.getCore().getModel("oSuffieldmodel") != undefined) {
				this.getView().setModel(sap.ui.getCore().getModel("SearchedData"), "VehicleLocatorScdScr");

				/*	this.getView().setModel(sap.ui.getCore().getModel("oSuffieldmodel"),"VehicleLocatorScdScr");*/
				var Status = sap.ui.getCore().getModel("SearchedData").getData();
				var model = new sap.ui.model.json.JSONModel(Status);
				this.getView().byId("table1VSR").setModel(model);
				/*	var oProductNameColumn = this.getView().byId("matnr");
					var oSorter = new sap.ui.model.Sorter(oProductNameColumn.getSortProperty(), true);*/

				/* this.getView().byId("table1VSR").getBinding("rows").sort(oSorter);*/
				//		this.getView().byId("table1VSR").sort(oProductNameColumn, SortOrder.Ascending);
				var oProductNameColumn = this.getView().byId("matnr");
				this.getView().byId("table1VSR").sort(oProductNameColumn, SortOrder.Ascending);
				var Dealer = sap.ui.getCore().getModel("SearchedData").getData();
				/* var oStatus = sap.ui.getCore().getModel("oSuffieldmodel").getData();*/
				var Suffix = sap.ui.getCore().getModel("SearchedData").getData();
				var Color = sap.ui.getCore().getModel("SearchedData").getData();
				var obj = {};
				for (var i = 0, len = Color.length; i < len; i++)
					obj[Color[i]['zzextcol']] = Color[i];
				Color = new Array();
				for (var key in obj)
					Color.push(obj[key]);
				var Model = new sap.ui.model.json.JSONModel(Color);
				this.getView().byId("VLRColor").setModel(Model);
				if (Color.length != 0) {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRColor").insertItem(newItem);
					this.getView().byId("VLRColor").setSelectedKey("all");
					this.getView().byId("VLRColor").setSelectedItem("ALL");
				}

				var obj = {};
				for (var i = 0, len = Suffix.length; i < len; i++)
					obj[Suffix[i]['zzsuffix']] = Suffix[i];
				Suffix = new Array();
				for (var key in obj)
					Suffix.push(obj[key]);
				var Model = new sap.ui.model.json.JSONModel(Suffix);
				this.getView().byId("VLRSuffix").setModel(Model);
				if (Suffix.length != 0) {

					this.getView().byId("VLRSuffix").setSelectedKey(Suffix[0].zzsuffix);
					this.getView().byId("VLRSuffix").setSelectedItem(Suffix[0].zzsuffix + "-" + Suffix[0].suffix_desc_en);
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRSuffix").insertItem(newItem);
				}

				/*	this.getView().byId("VLRSuffix").setSelectedItem("ALL");
	this.getView().byId("VLRSuffix").setSelectedKey("all");*/

				var obj = {};
				for (var i = 0, len = Status.length; i < len; i++)
					obj[Status[i]['zz_trading_ind']] = Status[i];
				Status = new Array();
				for (var key in obj)
					Status.push(obj[key]);

				var Model = new sap.ui.model.json.JSONModel(Status);
				this.getView().byId("VLRStatus").setModel(Model);

				var obj = {};
				for (var i = 0, len = Dealer.length; i < len; i++)
					obj[Dealer[i]['kunnr']] = Dealer[i];
				Dealer = new Array();
				for (var key in obj)
					Dealer.push(obj[key]);
				var Model1 = new sap.ui.model.json.JSONModel(Dealer);
				this.getView().byId("VLRDealer").setModel(Model1);
				if (Dealer.length != 0) {
					var newItem = new sap.ui.core.Item({
						key: "all",
						text: "ALL"
					});
					this.getView().byId("VLRDealer").insertItem(newItem);
					this.getView().byId("VLRDealer").setSelectedItem("ALL");
					this.getView().byId("VLRDealer").setSelectedKey("all");
				}
			}
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
			this.onStatusChange();
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

			var Context = this.getView().byId("table1VSR").getBinding("rows").getContexts();
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

			row += '"Dealer",';
			row += '"Model",';
			row += '"Suffix",';
			row += '"APX",';
			row += '"Color",';
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
				arrData[i].kunnr = arrData[i].kunnr + "-" + arrData[i].name1;
				arrData[i].matnr = arrData[i].matnr + "-" + arrData[i].model_desc_en;
				arrData[i].zzextcol = arrData[i].zzextcol + "-" + arrData[i].mktg_desc_en;
				arrData[i].zzsuffix = arrData[i].zzsuffix + "-" + arrData[i].suffix_desc_en;

				row += '="' + arrData[i].kunnr + '","' + arrData[i].matnr + '","' + arrData[i].zzsuffix +
					'",="' + arrData[i].zzapx + '",="' + arrData[i].zzextcol + '",="' + arrData[i].zzordertype + '","' + arrData[i].zzadddata4 +
					'","' + arrData[i].pstsp +
					'","' + arrData[i].z_pd_flag + '","' + arrData[i].ort01 + '","' + arrData[i].bezei + '",';
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
		onClick: function (oID) {

			var that = this;
			$('#' + oID).click(function (oEvent) { //Attach Table Header Element Event
				var oTarget = oEvent.currentTarget;
				//Get hold of Header Element

				var oLabelText = oTarget.childNodes[0].textContent;
				that.selooLabelText = oTarget.childNodes[0].textContent; //Get Column Header text
				var oIndex = oTarget.id.slice(-1);
				if (oIndex == "6") {
					oIndex = 14;
				} else if (oIndex == "3") {
					oIndex = 7;
				} else if (oIndex == "2") {
					oIndex = 9;
				} else if (oIndex == "4") {
					oIndex = 11;
				} else if (oIndex == "8") {
					oIndex = 16;
				} else if (oIndex == "5") {
					oIndex = 13;
				} else if (oIndex == "7") {
					oIndex = 15;
				} else if (oIndex == "9") {
					oIndex = 17;
				}

				var oView = that.getView();
				var oTable = oView.byId("table1VSR");
				var oModel = oTable.getBinding("items").getModel().getData(); //Get Hold of Table Model Values
				var oKeys = Object.keys(oModel[0]); //Get Hold of Model Keys to filter the value
				oTable.getBinding("items").getModel().setProperty("/bindingValue", oKeys[oIndex]); //Save the key value to property
				switch (that.selooLabelText) {
				case "Model":
					if (that.getView().byId("moAsIcon").getVisible() == false) {
						that.onAscending()
					} else if (that.getView().byId("moAsIcon").getVisible() == true) {
						that.onDescending();
					}
					break;
				case "Color":
					if (that.getView().byId("coAsIcon").getVisible() == false) {
						that.onAscending()
					} else if (that.getView().byId("coAsIcon").getVisible() == true) {
						that.onDescending();
					}
					break;
				case "Suffix":
					if (that.getView().byId("suAsIcon").getVisible() == false) {
						that.onAscending();
					} else if (that.getView().byId("suAsIcon").getVisible() == true) {
						that.onDescending();
					}
					break;
				case "APX":
					if (that.getView().byId("apAsIcon").getVisible() == false) {
						that.onAscending();
					} else if (that.getView().byId("apAsIcon").getVisible() == true) {
						that.onDescending();
					}
					break;
				case "Order Type":
					if (that.getView().byId("otAsIcon").getVisible() == false) {
						that.onAscending();
					} else if (that.getView().byId("otAsIcon").getVisible() == true) {
						that.onDescending();
					}
					break;
				case "ETA From":
					if (that.getView().byId("etfAsIcon").getVisible() == false) {
						that.onAscending();
					} else if (that.getView().byId("etfAsIcon").getVisible() == true) {
						that.onDescending();
					}
					break;
				case "ETA To":
					if (that.getView().byId("ettAsIcon").getVisible() == false) {
						that.onAscending();
					} else if (that.getView().byId("ettAsIcon").getVisible() == true) {
						that.onDescending();
					}
					break;
				case "Accessory Install":
					if (that.getView().byId("aiAsIcon").getVisible() == false) {
						that.onAscending();
					} else if (that.getView().byId("aiAsIcon").getVisible() == true) {
						that.onDescending();
					}
					break;

				}

				//	that._oResponsivePopover.openBy(oTarget);
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
				aFilters.push(oFilter);
			}
			var oItems = oTable.getBinding("items");
			oItems.filter(aFilters, "Application");
			//	this._oResponsivePopover.close();
		},

		onAscending: function () {
			var that = this;
			that.getView().byId("table1VSR").destroyItems();
			var oTable = this.getView().byId("table1VSR");
			var oItems = oTable.getBinding("items");
			oTable.getBinding("items").aSorters = null;
			var oBindingPath = oItems.getModel().getProperty("/bindingValue");
			var oSorter = new Sorter(oBindingPath, false);
			oItems.sort(oSorter);
			if (this.selooLabelText == "Model") {
				this.getView().byId("moAsIcon").setVisible(true);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(false);
				this.getView().byId("suAsIcon").setVisible(false);
				this.getView().byId("suDsIcon").setVisible(false);
				this.getView().byId("apAsIcon").setVisible(false);
				this.getView().byId("apDsIcon").setVisible(false);
				this.getView().byId("otAsIcon").setVisible(false);
				this.getView().byId("otDsIcon").setVisible(false);
				this.getView().byId("etfAsIcon").setVisible(false);
				this.getView().byId("etfDsIcon").setVisible(false);
				this.getView().byId("ettAsIcon").setVisible(false);
				this.getView().byId("ettDsIcon").setVisible(false);
				this.getView().byId("aiAsIcon").setVisible(false);
				this.getView().byId("aiDsIcon").setVisible(false);

			} else if (this.selooLabelText == "Color") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("coAsIcon").setVisible(true);
				this.getView().byId("coDsIcon").setVisible(false);
				this.getView().byId("suAsIcon").setVisible(false);
				this.getView().byId("suDsIcon").setVisible(false);
				this.getView().byId("apAsIcon").setVisible(false);
				this.getView().byId("apDsIcon").setVisible(false);
				this.getView().byId("otAsIcon").setVisible(false);
				this.getView().byId("otDsIcon").setVisible(false);
				this.getView().byId("etfAsIcon").setVisible(false);
				this.getView().byId("etfDsIcon").setVisible(false);
				this.getView().byId("ettAsIcon").setVisible(false);
				this.getView().byId("ettDsIcon").setVisible(false);
				this.getView().byId("aiAsIcon").setVisible(false);
				this.getView().byId("aiDsIcon").setVisible(false);

			} else if (this.selooLabelText == "Suffix") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(false);
				this.getView().byId("suAsIcon").setVisible(true);
				this.getView().byId("suDsIcon").setVisible(false);
				this.getView().byId("apAsIcon").setVisible(false);
				this.getView().byId("apDsIcon").setVisible(false);
				this.getView().byId("otAsIcon").setVisible(false);
				this.getView().byId("otDsIcon").setVisible(false);
				this.getView().byId("etfAsIcon").setVisible(false);
				this.getView().byId("etfDsIcon").setVisible(false);
				this.getView().byId("ettAsIcon").setVisible(false);
				this.getView().byId("ettDsIcon").setVisible(false);
				this.getView().byId("aiAsIcon").setVisible(false);
				this.getView().byId("aiDsIcon").setVisible(false);
			} else if (this.selooLabelText == "APX") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(false);
				this.getView().byId("suAsIcon").setVisible(false);
				this.getView().byId("suDsIcon").setVisible(false);
				this.getView().byId("apAsIcon").setVisible(true);
				this.getView().byId("apDsIcon").setVisible(false);
				this.getView().byId("otAsIcon").setVisible(false);
				this.getView().byId("otDsIcon").setVisible(false);
				this.getView().byId("etfAsIcon").setVisible(false);
				this.getView().byId("etfDsIcon").setVisible(false);
				this.getView().byId("ettAsIcon").setVisible(false);
				this.getView().byId("ettDsIcon").setVisible(false);
				this.getView().byId("aiAsIcon").setVisible(false);
				this.getView().byId("aiDsIcon").setVisible(false);
			} else if (this.selooLabelText == "Order Type") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(false);
				this.getView().byId("suAsIcon").setVisible(false);
				this.getView().byId("suDsIcon").setVisible(false);
				this.getView().byId("apAsIcon").setVisible(false);
				this.getView().byId("apDsIcon").setVisible(false);
				this.getView().byId("otAsIcon").setVisible(true);
				this.getView().byId("otDsIcon").setVisible(false);
				this.getView().byId("etfAsIcon").setVisible(false);
				this.getView().byId("etfDsIcon").setVisible(false);
				this.getView().byId("ettAsIcon").setVisible(false);
				this.getView().byId("ettDsIcon").setVisible(false);
				this.getView().byId("aiAsIcon").setVisible(false);
				this.getView().byId("aiDsIcon").setVisible(false);
			} else if (this.selooLabelText == "ETA From") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(false);
				this.getView().byId("suAsIcon").setVisible(false);
				this.getView().byId("suDsIcon").setVisible(false);
				this.getView().byId("apAsIcon").setVisible(false);
				this.getView().byId("apDsIcon").setVisible(false);
				this.getView().byId("otAsIcon").setVisible(false);
				this.getView().byId("otDsIcon").setVisible(false);
				this.getView().byId("etfAsIcon").setVisible(true);
				this.getView().byId("etfDsIcon").setVisible(false);
				this.getView().byId("ettAsIcon").setVisible(false);
				this.getView().byId("ettDsIcon").setVisible(false);
				this.getView().byId("aiAsIcon").setVisible(false);
				this.getView().byId("aiDsIcon").setVisible(false);
			} else if (this.selooLabelText == "ETA To") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(false);
				this.getView().byId("suAsIcon").setVisible(false);
				this.getView().byId("suDsIcon").setVisible(false);
				this.getView().byId("apAsIcon").setVisible(false);
				this.getView().byId("apDsIcon").setVisible(false);
				this.getView().byId("otAsIcon").setVisible(false);
				this.getView().byId("otDsIcon").setVisible(false);
				this.getView().byId("etfAsIcon").setVisible(false);
				this.getView().byId("etfDsIcon").setVisible(false);
				this.getView().byId("ettAsIcon").setVisible(true);
				this.getView().byId("ettDsIcon").setVisible(false);
				this.getView().byId("aiAsIcon").setVisible(false);
				this.getView().byId("aiDsIcon").setVisible(false);
			} else if (this.selooLabelText == "Accessory Install") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(false);
				this.getView().byId("suAsIcon").setVisible(false);
				this.getView().byId("suDsIcon").setVisible(false);
				this.getView().byId("apAsIcon").setVisible(false);
				this.getView().byId("apDsIcon").setVisible(false);
				this.getView().byId("otAsIcon").setVisible(false);
				this.getView().byId("otDsIcon").setVisible(false);
				this.getView().byId("etfAsIcon").setVisible(false);
				this.getView().byId("etfDsIcon").setVisible(false);
				this.getView().byId("ettAsIcon").setVisible(false);
				this.getView().byId("ettDsIcon").setVisible(false);
				this.getView().byId("aiAsIcon").setVisible(true);
				this.getView().byId("aiDsIcon").setVisible(false);
			}
			//
			//	this._oResponsivePopover.close();
		},

		onDescending: function () {
			var that = this;
			that.getView().byId("table1VSR").destroyItems();
			var oTable = this.getView().byId("table1VSR");
			var oItems = oTable.getBinding("items");
			oTable.getBinding("items").aSorters = null;
			var oBindingPath = oItems.getModel().getProperty("/bindingValue");
			var oSorter = new Sorter(oBindingPath, true);
			oItems.sort(oSorter);

			if (this.selooLabelText == "Model") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(true);
			} else if (this.selooLabelText == "Color") {
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(true);
			} else if (this.selooLabelText == "Suffix") {
				this.getView().byId("suAsIcon").setVisible(false);
				this.getView().byId("suDsIcon").setVisible(true);
			} else if (this.selooLabelText == "APX") {
				this.getView().byId("apAsIcon").setVisible(false);
				this.getView().byId("apDsIcon").setVisible(true);
			} else if (this.selooLabelText == "Order Type") {
				this.getView().byId("otAsIcon").setVisible(false);
				this.getView().byId("otDsIcon").setVisible(true);
			} else if (this.selooLabelText == "ETA From") {
				this.getView().byId("etfAsIcon").setVisible(false);
				this.getView().byId("etfDsIcon").setVisible(true);
			} else if (this.selooLabelText == "ETA To") {
				this.getView().byId("ettAsIcon").setVisible(false);
				this.getView().byId("ettDsIcon").setVisible(true);
			} else if (this.selooLabelText == "Accessory Install") {
				this.getView().byId("aiAsIcon").setVisible(false);
				this.getView().byId("aiDsIcon").setVisible(true);
			}
			//	this._oResponsivePopover.close();
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
		populateData: function (start, rowCount) {
			var that = this;

			sap.ui.getCore().byId("Previous").setEnabled(true);
			sap.ui.getCore().byId("Next").setEnabled(true);
			that.getView().byId("table1VSR").destroyItems();

			for (var i = start; i < start + rowCount; i++) {
				var oTableRow = new sap.m.ColumnListItem({

					type: "Active",
					visible: true,
					selected: true,
					cells: [
						new sap.m.Link({
							text: "Trade"

						}),
						new sap.m.Text({
							text: (that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/KUNNR") + "-" + that.getView().getModel(
								"VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/NAME1"))

						}),

						new sap.m.Text({
							text: (that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/MATNR") + "-" + that.getView().getModel(
								"VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/MODEL_DESC_EN"))

						}),
						new sap.m.Text({
							text: (that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/ZZEXTCOL") + "-" + that.getView()
								.getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/MKTG_DESC_EN"))

						}),
						new sap.m.Text({
							text: (that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/ZZSUFFIX") + "-" + that.getView()
								.getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/SUFFIX_DESC_EN"))

						}),
						new sap.m.Text({
							text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/ZZAPX")

						}),
						new sap.m.Text({
							text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/ZZORDERTYPE")

						}),
						new sap.m.Text({
							text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/ZZADDDATA4")

						}),
						new sap.m.Text({
							text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/PSTSP")

						}),
						new sap.m.Text({
							text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/Z_PD_FLAG")

						}),
						new sap.m.Text({
							text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/ORT01")

						}),
						new sap.m.Text({
							text: that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/" + i + "/REGIO")

						})

					]
				});
				that.getView().byId("table1VSR").addItem(oTableRow);

				if (i == that.getView().getModel("VehicleLocatorScdScr").getProperty("/VehicleTrade/length") - 1) {

					sap.ui.getCore().byId("Next").setEnabled(false);

					break;

				}
			}

			if (start == 0) {

				sap.ui.getCore().byId("Previous").setEnabled(false);

			}

		},
		handlebacksearch: function () {
			this.getRouter().navTo("VehicleLocSearch");
		}

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