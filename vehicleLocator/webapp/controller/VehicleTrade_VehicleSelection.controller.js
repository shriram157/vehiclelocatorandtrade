sap.ui.define([
	/*"sap/ui/core/mvc/Controller"*/
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter"
], function (BaseController, Sorter, Filter) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleTrade_VehicleSelection", {

		onInit: function () {
			debugger;
			if (!this._oResponsivePopover) {
				this._oResponsivePopover = sap.ui.xmlfragment("vehicleLocator.fragment.VehicleSearchResult", this);
				this._oResponsivePopover.setModel(this.getView().getModel());
			}
			var oTable = this.getView().byId("table");
			var that = this;
			
			this.getRouter().attachRouteMatched(this.onRouteMatched, this);

		
			var that = this;
			var Model = sap.ui.getCore().getModel("SelectedSeriesFromScreen1");
			that.getView().byId("oVt_SeriesCmbo").setModel(Model);
			if (Model != undefined) {
				var SeleKey = Model.getProperty("/SelectedSeries");
				that.getView().byId("oVt_SeriesCmbo").setSelectedKey(SeleKey);
			}
			this.oDumData = [{
				ZZVTN: "TCIL1000545673",
				TCISeries: "CAM",
				TCISeriesDescriptionEN: "CAMRY",
				TCISeriesDescriptionFR: "CAMRY",
				Model: "AY5F1T",
				ENModelDesc: "TUNDRA 4X4 CREWMAX EN",
				ZZEXTCOL: "0040",
				MKTG_DESC_EN: "Alphine White",
				Suffix: "AA",
				SuffixDescriptionEN: "AA-SUFFIX",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-02-06",
				PSTSP: "2018-05-01",
				Year: "2017"
			}, {
				ZZVTN: "TCIL1000415666",
				TCISeries: "CAM",
				TCISeriesDescriptionEN: "CAMRY",
				TCISeriesDescriptionFR: "CAMRY",
				Model: "AY5F1T",
				ENModelDesc: "TUNDRA 4X4 CREWMAX EN",
				ZZEXTCOL: "0040",
				MKTG_DESC_EN: "Alphine White",
				Suffix: "AA",
				SuffixDescriptionEN: "AA-SUFFIX",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-02-06",
				PSTSP: "2018-05-01",
				Year: "2017"
			}, {
				ZZVTN: "TCIL1000345623",
				TCISeries: "CAM",
				TCISeriesDescriptionEN: "CAMRY",
				TCISeriesDescriptionFR: "CAMRY",
				Model: "AY5F1T",
				ENModelDesc: "TUNDRA 4X4 CREWMAX EN",
				ZZEXTCOL: "0040",
				MKTG_DESC_EN: "Black",
				Suffix: "AA",
				SuffixDescriptionEN: "AA-SUFFIX",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-02-06",
				PSTSP: "2018-05-01",
				Year: "2017"
			}, {
				ZZVTN: "TCIL100054454",
				TCISeries: "SIE",
				TCISeriesDescriptionEN: "SIENNA",
				TCISeriesDescriptionFR: "SIENNA",
				Model: "BZRFHT",
				ENModelDesc: "HIGHLANDER",
				ZZEXTCOL: "0218",
				MKTG_DESC_EN: "MidLight BlackMetalic",
				Suffix: "DC",
				SuffixDescriptionEN: "DC - LTD 5 PSG - 0070 - LA24",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2018-02-06",
				PSTSP: "2019-05-01",
				Year: "2019"
			}, {
				ZZVTN: "TCIL100054433",
				TCISeries: "COA",
				TCISeriesDescriptionEN: "COROLLA",
				TCISeriesDescriptionFR: "COROLLA",
				Model: "B42HLT",
				ENModelDesc: "COROLLA",
				ZZEXTCOL: "01G3",
				MKTG_DESC_EN: "Black",
				Suffix: "BB",
				SuffixDescriptionEN: "BB-SR5",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-05-01",
				PSTSP: "2019-05-01",
				Year: "2019"

			}, {
				ZZVTN: "TCIL1000545673",
				TCISeries: "CAM",
				TCISeriesDescriptionEN: "CAMRY",
				TCISeriesDescriptionFR: "CAMRY",
				Model: "AY5F1T",
				ENModelDesc: "TUNDRA 4X4 CREWMAX EN",
				ZZEXTCOL: "0040",
				MKTG_DESC_EN: "Alphine White",
				Suffix: "AA",
				SuffixDescriptionEN: "AA-SUFFIX",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-02-06",
				PSTSP: "2018-05-01",
				Year: "2017"
			}, {
				ZZVTN: "TCIL1000542231",
				TCISeries: "CAM",
				TCISeriesDescriptionEN: "CAMRY",
				TCISeriesDescriptionFR: "CAMRY",
				Model: "AY5F1T",
				ENModelDesc: "TUNDRA 4X4 CREWMAX EN",
				ZZEXTCOL: "0040",
				MKTG_DESC_EN: "Black",
				Suffix: "AA",
				SuffixDescriptionEN: "AA-SUFFIX",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-02-06",
				PSTSP: "2018-05-01",
				Year: "2017"
			}, {
				ZZVTN: "TCIL100054454",
				TCISeries: "SIE",
				TCISeriesDescriptionEN: "SIENNA",
				TCISeriesDescriptionFR: "SIENNA",
				Model: "BZRFHT",
				ENModelDesc: "HIGHLANDER",
				ZZEXTCOL: "0218",
				MKTG_DESC_EN: "MidLight BlackMetalic",
				Suffix: "DC",
				SuffixDescriptionEN: "DC - LTD 5 PSG - 0070 - LA24",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2018-02-06",
				PSTSP: "2019-05-01",
				Year: "2018"
			}, {
				ZZVTN: "TCIL100054111",
				TCISeries: "SIE",
				TCISeriesDescriptionEN: "SIENNA",
				TCISeriesDescriptionFR: "SIENNA",
				Model: "BZRFHT",
				ENModelDesc: "HIGHLANDER",
				ZZEXTCOL: "0218",
				MKTG_DESC_EN: "White",
				Suffix: "DC",
				SuffixDescriptionEN: "DC - LTD 5 PSG - 0070 - LA24",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2018-02-06",
				PSTSP: "2019-05-01",
				Year: "2019"
			}, {
				ZZVTN: "TCIL100054433",
				TCISeries: "COA",
				TCISeriesDescriptionEN: "COROLLA",
				TCISeriesDescriptionFR: "COROLLA",
				Model: "B42HLT",
				ENModelDesc: "COROLLA",
				ZZEXTCOL: "01G3",
				MKTG_DESC_EN: "Black",
				Suffix: "BB",
				SuffixDescriptionEN: "BB-SR5",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-05-01",
				PSTSP: "2019-05-01",
				Year: "2019"

			}, {
				ZZVTN: "TCIL100034431",
				TCISeries: "COA",
				TCISeriesDescriptionEN: "COROLLA",
				TCISeriesDescriptionFR: "COROLLA",
				Model: "B42HLT",
				ENModelDesc: "COROLLA",
				ZZEXTCOL: "01G3",
				MKTG_DESC_EN: "Metalic Black",
				Suffix: "BB",
				SuffixDescriptionEN: "BB-SR5",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-05-01",
				PSTSP: "2019-05-01",
				Year: "2019"

			},
			{
				ZZVTN: "TCIL1000545673",
				TCISeries: "CAM",
				TCISeriesDescriptionEN: "CAMRY",
				TCISeriesDescriptionFR: "CAMRY",
				Model: "AY5F1T",
				ENModelDesc: "TUNDRA 4X4 CREWMAX EN",
				ZZEXTCOL: "0040",
				MKTG_DESC_EN: "Alphine White",
				Suffix: "AA",
				SuffixDescriptionEN: "AA-SUFFIX",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-02-06",
				PSTSP: "2018-05-01",
				Year: "2017"
			}, {
				ZZVTN: "TCIL1000415666",
				TCISeries: "CAM",
				TCISeriesDescriptionEN: "CAMRY",
				TCISeriesDescriptionFR: "CAMRY",
				Model: "AY5F1T",
				ENModelDesc: "TUNDRA 4X4 CREWMAX EN",
				ZZEXTCOL: "0040",
				MKTG_DESC_EN: "Alphine White",
				Suffix: "AA",
				SuffixDescriptionEN: "AA-SUFFIX",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-02-06",
				PSTSP: "2018-05-01",
				Year: "2017"
			}, {
				ZZVTN: "TCIL1000345623",
				TCISeries: "CAM",
				TCISeriesDescriptionEN: "CAMRY",
				TCISeriesDescriptionFR: "CAMRY",
				Model: "AY5F1T",
				ENModelDesc: "TUNDRA 4X4 CREWMAX EN",
				ZZEXTCOL: "0040",
				MKTG_DESC_EN: "Black",
				Suffix: "AA",
				SuffixDescriptionEN: "AA-SUFFIX",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-02-06",
				PSTSP: "2018-05-01",
				Year: "2017"
			}, {
				ZZVTN: "TCIL100054454",
				TCISeries: "SIE",
				TCISeriesDescriptionEN: "SIENNA",
				TCISeriesDescriptionFR: "SIENNA",
				Model: "BZRFHT",
				ENModelDesc: "HIGHLANDER",
				ZZEXTCOL: "0218",
				MKTG_DESC_EN: "MidLight BlackMetalic",
				Suffix: "DC",
				SuffixDescriptionEN: "DC - LTD 5 PSG - 0070 - LA24",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2018-02-06",
				PSTSP: "2019-05-01",
				Year: "2019"
			}, {
				ZZVTN: "TCIL100054433",
				TCISeries: "COA",
				TCISeriesDescriptionEN: "COROLLA",
				TCISeriesDescriptionFR: "COROLLA",
				Model: "B42HLT",
				ENModelDesc: "COROLLA",
				ZZEXTCOL: "01G3",
				MKTG_DESC_EN: "Black",
				Suffix: "BB",
				SuffixDescriptionEN: "BB-SR5",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-05-01",
				PSTSP: "2019-05-01",
				Year: "2019"

			}, {
				ZZVTN: "TCIL1000545673",
				TCISeries: "CAM",
				TCISeriesDescriptionEN: "CAMRY",
				TCISeriesDescriptionFR: "CAMRY",
				Model: "AY5F1T",
				ENModelDesc: "TUNDRA 4X4 CREWMAX EN",
				ZZEXTCOL: "0040",
				MKTG_DESC_EN: "Alphine White",
				Suffix: "AA",
				SuffixDescriptionEN: "AA-SUFFIX",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-02-06",
				PSTSP: "2018-05-01",
				Year: "2017"
			}, {
				ZZVTN: "TCIL1000542231",
				TCISeries: "CAM",
				TCISeriesDescriptionEN: "CAMRY",
				TCISeriesDescriptionFR: "CAMRY",
				Model: "AY5F1T",
				ENModelDesc: "TUNDRA 4X4 CREWMAX EN",
				ZZEXTCOL: "0040",
				MKTG_DESC_EN: "Black",
				Suffix: "AA",
				SuffixDescriptionEN: "AA-SUFFIX",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-02-06",
				PSTSP: "2018-05-01",
				Year: "2017"
			}, {
				ZZVTN: "TCIL100054454",
				TCISeries: "SIE",
				TCISeriesDescriptionEN: "SIENNA",
				TCISeriesDescriptionFR: "SIENNA",
				Model: "BZRFHT",
				ENModelDesc: "HIGHLANDER",
				ZZEXTCOL: "0218",
				MKTG_DESC_EN: "MidLight BlackMetalic",
				Suffix: "DC",
				SuffixDescriptionEN: "DC - LTD 5 PSG - 0070 - LA24",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2018-02-06",
				PSTSP: "2019-05-01",
				Year: "2018"
			},  {
				ZZVTN: "TCIL100054433",
				TCISeries: "COA",
				TCISeriesDescriptionEN: "COROLLA",
				TCISeriesDescriptionFR: "COROLLA",
				Model: "B42HLT",
				ENModelDesc: "COROLLA",
				ZZEXTCOL: "01G3",
				MKTG_DESC_EN: "Black",
				Suffix: "BB",
				SuffixDescriptionEN: "BB-SR5",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-05-01",
				PSTSP: "2019-05-01",
				Year: "2019"

			}, {
				ZZVTN: "TCIL100054111",
				TCISeries: "SIE",
				TCISeriesDescriptionEN: "SIENNA",
				TCISeriesDescriptionFR: "SIENNA",
				Model: "BZRFHT",
				ENModelDesc: "HIGHLANDER",
				ZZEXTCOL: "0218",
				MKTG_DESC_EN: "White",
				Suffix: "DC",
				SuffixDescriptionEN: "DC - LTD 5 PSG - 0070 - LA24",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2018-02-06",
				PSTSP: "2019-05-01",
				Year: "2019"
			},{
				ZZVTN: "TCIL100050000",
				TCISeries: "COA",
				TCISeriesDescriptionEN: "COROLLA",
				TCISeriesDescriptionFR: "COROLLA",
				Model: "B42HLT",
				ENModelDesc: "COROLLA",
				ZZEXTCOL: "01G3",
				MKTG_DESC_EN: "Metalic Black",
				Suffix: "BB",
				SuffixDescriptionEN: "BB-SR5",
				ZZAPX: "00",
				ZZORDERTYPE: "Stock - Open",
				ZZADDDATA4: "2017-05-01",
				PSTSP: "2019-05-01",
				Year: "2019"

			}];
			var SelSeriesKey = that.getView().byId("oVt_SeriesCmbo").getSelectedKey();
			var Filter = this.oDumData.filter(function (x) {
				return x.TCISeries == SelSeriesKey;
			});
			var model = new sap.ui.model.json.JSONModel(Filter);
			that.getView().byId("table").setModel(model);

/**************Pagination*******************************/
  


/**************Pagination*******************************/
		
		},
	/*	onClick: function (oID) {

			var that = this;
			if (oID != undefined) {
				$('#' + oID).click(function (oEvent) { 
					var oTarget = oEvent.currentTarget;
				
					var oLabelText = oTarget.childNodes[0].textContent;
					that.selooLabelText = oTarget.childNodes[0].textContent; 
					var oIndex = oTarget.id.slice(-1);
					if (oIndex == "6") {
						oIndex = 8;
					} else if (oIndex == "3") {
						oIndex = 0;
					} else if (oIndex == "2") {
						oIndex = 9;
					} else if (oIndex == "4") {
						oIndex = 1;
					} else if (oIndex == "8") {
						oIndex = 6;
					} else if (oIndex == "5") {
						oIndex = 4;
					} else if (oIndex == "7") {
						oIndex = 10;
					} else if (oIndex == "9") {
						oIndex = 6;
					} else if (oIndex == "0") {
						oIndex = 12;
					} else if (oIndex == "1") {
						oIndex = 13;
					}
					var oView = that.getView();
					var oTable = oView.byId("table");
					var oModel = oTable.getModel().getData(); 
					if (oModel.length != 0) {
						var oKeys = Object.keys(oModel[0]); 
						oTable.getModel().setProperty("/bindingValue", oKeys[oIndex]); 
						switch (that.selooLabelText) {
						case "Model":
							if (that.getView().byId("moAsIcon").getVisible() == false) {
								that.onAscending();
							} else if (that.getView().byId("moAsIcon").getVisible() == true) {
								that.onDescending();
							}
							break;
						case "Color":
							if (that.getView().byId("coAsIcon").getVisible() == false) {
								that.onAscending();
							} else if (that.getView().byId("coAsIcon").getVisible() == true) {
								that.onDescending();
							}
							break;
						case "Series":
							if (that.getView().byId("senAsIcon").getVisible() == false) {
								that.onAscending();
							} else if (that.getView().byId("senAsIcon").getVisible() == true) {
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
						case "Vehicle Tracking Number":
							if (that.getView().byId("vtnAsIcon").getVisible() == false) {
								that.onAscending();
							} else if (that.getView().byId("vtnAsIcon").getVisible() == true) {
								that.onDescending();
							}
							break;

						}
					} else {
						sap.m.MessageBox.warning("No data is available to sort")
					}

					
				});
			}
		},*/
		onRouteMatched: function () {
		
			
		},
		
		onDescending : function()
		{
			
			
			
		},
		
		
		handleoVt_SeriesChange: function () {
			var that = this;
			var SelSeriesKey = that.getView().byId("oVt_SeriesCmbo").getSelectedKey();
			var Filter = this.oDumData.filter(function (x) {
				return x.TCISeries == SelSeriesKey;
			});
			var model = new sap.ui.model.json.JSONModel(Filter);
			that.getView().byId("table").setModel(model);
		},
		onSelectLink: function (oEvt) {

			var oSelectedItem = oEvt.getSource().getBindingContext().getObject();
			sap.ui.getCore().getModel("TradeModel").setProperty("/VehicleTradeVehicle", oSelectedItem);
			//	var oSelectedStrItems = JSON.stringify(oSelectedItem);
			this.getRouter().navTo("VehicleTrade_CreateSingle", {
				SelectedTrade: "VehicleTradeVehicle"
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
			//	that.getView().byId("table").destroyItems();
			var oTable = this.getView().byId("table");
			var oItems = oTable.getBinding("items");
			oTable.getBinding("items").aSorters = null;
			var oBindingPath = oTable.getModel().getProperty("/bindingValue");
			var oSorter = new Sorter(oBindingPath, false);
			oItems.sort(oSorter);
			if (this.selooLabelText == "Model") {
				this.getView().byId("moAsIcon").setVisible(true);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
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
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);

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
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);

			} else if (this.selooLabelText == "Series") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(true);
				this.getView().byId("senDsIcon").setVisible(false);
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
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);

			} else if (this.selooLabelText == "Suffix") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
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
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);
			} else if (this.selooLabelText == "APX") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
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
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);
			} else if (this.selooLabelText == "Order Type") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
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
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);
			} else if (this.selooLabelText == "ETA From") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
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
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);
			} else if (this.selooLabelText == "ETA To") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
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
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);
			} else if (this.selooLabelText == "Vehicle Tracking Number") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
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
				this.getView().byId("vtnAsIcon").setVisible(true);
				this.getView().byId("vtnDsIcon").setVisible(false);
			}
			//
			/*this._oResponsivePopover.close();*/
		},

		onDescending: function () {
			var that = this;
			//	that.getView().byId("table1VSR").destroyItems();
			var oTable = this.getView().byId("table");
			var oItems = oTable.getBinding("items");
			oTable.getBinding("items").aSorters = null;
			var oBindingPath = oItems.getModel().getProperty("/bindingValue");
			var oSorter = new Sorter(oBindingPath, true);
			oItems.sort(oSorter);

			if (this.selooLabelText == "Model") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(true);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
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
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);

			} else if (this.selooLabelText == "Color") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(true);
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
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);

			} else if (this.selooLabelText == "Series") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(true);
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
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);

			} else if (this.selooLabelText == "Suffix") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(false);
				this.getView().byId("suAsIcon").setVisible(false);
				this.getView().byId("suDsIcon").setVisible(true);
				this.getView().byId("apAsIcon").setVisible(false);
				this.getView().byId("apDsIcon").setVisible(false);
				this.getView().byId("otAsIcon").setVisible(false);
				this.getView().byId("otDsIcon").setVisible(false);
				this.getView().byId("etfAsIcon").setVisible(false);
				this.getView().byId("etfDsIcon").setVisible(false);
				this.getView().byId("ettAsIcon").setVisible(false);
				this.getView().byId("ettDsIcon").setVisible(false);
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);
			} else if (this.selooLabelText == "APX") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(false);
				this.getView().byId("suAsIcon").setVisible(false);
				this.getView().byId("suDsIcon").setVisible(false);
				this.getView().byId("apAsIcon").setVisible(false);
				this.getView().byId("apDsIcon").setVisible(true);
				this.getView().byId("otAsIcon").setVisible(false);
				this.getView().byId("otDsIcon").setVisible(false);
				this.getView().byId("etfAsIcon").setVisible(false);
				this.getView().byId("etfDsIcon").setVisible(false);
				this.getView().byId("ettAsIcon").setVisible(false);
				this.getView().byId("ettDsIcon").setVisible(false);
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);
			} else if (this.selooLabelText == "Order Type") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(false);
				this.getView().byId("suAsIcon").setVisible(false);
				this.getView().byId("suDsIcon").setVisible(false);
				this.getView().byId("apAsIcon").setVisible(false);
				this.getView().byId("apDsIcon").setVisible(false);
				this.getView().byId("otAsIcon").setVisible(false);
				this.getView().byId("otDsIcon").setVisible(true);
				this.getView().byId("etfAsIcon").setVisible(false);
				this.getView().byId("etfDsIcon").setVisible(false);
				this.getView().byId("ettAsIcon").setVisible(false);
				this.getView().byId("ettDsIcon").setVisible(false);
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);
			} else if (this.selooLabelText == "ETA From") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
				this.getView().byId("coAsIcon").setVisible(false);
				this.getView().byId("coDsIcon").setVisible(false);
				this.getView().byId("suAsIcon").setVisible(false);
				this.getView().byId("suDsIcon").setVisible(false);
				this.getView().byId("apAsIcon").setVisible(false);
				this.getView().byId("apDsIcon").setVisible(false);
				this.getView().byId("otAsIcon").setVisible(false);
				this.getView().byId("otDsIcon").setVisible(false);
				this.getView().byId("etfAsIcon").setVisible(false);
				this.getView().byId("etfDsIcon").setVisible(true);
				this.getView().byId("ettAsIcon").setVisible(false);
				this.getView().byId("ettDsIcon").setVisible(false);
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);
			} else if (this.selooLabelText == "ETA To") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
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
				this.getView().byId("ettDsIcon").setVisible(true);
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(false);
			} else if (this.selooLabelText == "Vehicle Tracking Number") {
				this.getView().byId("moAsIcon").setVisible(false);
				this.getView().byId("moDsIcon").setVisible(false);
				this.getView().byId("senAsIcon").setVisible(false);
				this.getView().byId("senDsIcon").setVisible(false);
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
				this.getView().byId("vtnAsIcon").setVisible(false);
				this.getView().byId("vtnDsIcon").setVisible(true);
			}
			/*	this._oResponsivePopover.close();*/
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
		
	

		/*onSelectLink:function(oEvt)
		   
		{
			debugger;
			var data=oEvt;
			
		}*/

	});
});