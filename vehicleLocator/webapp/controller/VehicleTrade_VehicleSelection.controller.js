sap.ui.define([
	/*"sap/ui/core/mvc/Controller"*/
	"vehicleLocator/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("vehicleLocator.controller.VehicleTrade_VehicleSelection", {

		onInit: function(){

			this.getRouter().attachRouteMatched(this.onRouteMatched, this);

		},

		onRouteMatched: function () {
			var that=this;
			var Model=sap.ui.getCore().getModel("SelectedSeriesFromScreen1");
			that.getView().byId("oVt_SeriesCmbo").setModel(Model);
			if(Model!=undefined){
				var SeleKey=Model.getProperty("/SelectedSeries");
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
				Year:"2017"
			},
			{
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
				Year:"2017"
			},
			{
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
				Year:"2017"
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
				Year:"2019"
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
					Year:"2019"

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
				Year:"2017"
			}, 
			{
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
				Year:"2017"
			},{
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
				Year:"2018"
			},
			{
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
				Year:"2019"
			},{
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
					Year:"2019"

			},
			{
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
					Year:"2019"

			}];
			var SelSeriesKey=that.getView().byId("oVt_SeriesCmbo").getSelectedKey();
var Filter=	this.oDumData.filter(function(x){return x.TCISeries==SelSeriesKey;});
var model=new sap.ui.model.json.JSONModel(Filter);
that.getView().byId("table").setModel(model);

		},
		handleoVt_SeriesChange:function(){
			var that=this;
				var SelSeriesKey=that.getView().byId("oVt_SeriesCmbo").getSelectedKey();
var Filter=	this.oDumData.filter(function(x){return x.TCISeries==SelSeriesKey;});
var model=new sap.ui.model.json.JSONModel(Filter);
that.getView().byId("table").setModel(model);
		},
	onSelectLink:function(oEvt)
	{
		debugger;
		var oSelectedItem = oEvt.getSource().getBindingContext().getObject();
			sap.ui.getCore().getModel("TradeModel").setProperty("/VehicleTradeVehicle",oSelectedItem);
	//	var oSelectedStrItems = JSON.stringify(oSelectedItem);
		this.getRouter().navTo("VehicleTrade_CreateSingle",{
		     SelectedTrade : "VehicleTradeVehicle"	
		});
		
	}
		
	
		
	/*onSelectLink:function(oEvt)
	   
	{
		debugger;
		var data=oEvt;
		
	}*/
	

	});
});