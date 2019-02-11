sap.ui.define([
	/*"sap/ui/core/mvc/Controller"*/
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"vehicleLocator/Formatter/Formatter",
	"sap/ui/table/SortOrder"
], function (BaseController, Sorter, Filter, Formatter, SortOrder) {
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
		this.getRouter().getRoute("VehicleTrade_VehicleSelection").attachPatternMatched(this.onRouteMatched, this);		
 
			//this.getRouter().attachRouteMatched(this.onRouteMatched, this);

			/*	var SelSeriesKey = that.getView().byId("oVt_SeriesCmbo").getSelectedKey();
				var Filter = this.oDumData.filter(function (x) {
					return x.TCISeries == SelSeriesKey;
				});
				var model = new sap.ui.model.json.JSONModel(Filter);
				that.getView().byId("table").setModel(model);*/

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
		onRouteMatched: function (oEvent) {
			debugger;
this.SelectedVehicleFrom=oEvent.getParameter("arguments").SelectedVehicleFrom;
			var that = this;
			var Model = sap.ui.getCore().getModel("SelectedSeriesFromScreen1");
			that.getView().byId("oVt_SeriesCmbo").setModel(Model);
			if (Model != undefined) {
				var SeleKey = Model.getProperty("/SelectedSeries");
				that.getView().byId("oVt_SeriesCmbo").setSelectedKey(SeleKey);
			}
			if (sap.ui.getCore().getModel("oVehicleSelectionResults") != undefined) {
				var oVehicleModel = sap.ui.getCore().getModel("oVehicleSelectionResults");
				this.getView().byId("table").setModel(oVehicleModel);
				
					var oProductNameColumn = this.getView().byId("oETAFromId");
				this.getView().byId("table").sort(oProductNameColumn, SortOrder.Ascending);
		
				
				
			}
		},

		onDescending: function () {

		},

		handleoVt_SeriesChange: function () {
			debugger

			var that = this;
			var McCmbo = this.getOwnerComponent().SelectedMSMData[0].McCmbo;
			this.SelectedExteriorColorCode = "";
			this.SelectedTrimInteriorColor = "";
			var SuffCmbo = this.getOwnerComponent().SelectedMSMData[0].SuffCmbo;
			var MoyearCombo = this.getOwnerComponent().SelectedMSMData[0].MoyearCombo;
				var oDealer=sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;
				var Series=this.getView().byId("oVt_SeriesCmbo").getSelectedKey();
				
		//	var oDealer = this.getView().getModel("TradeModel").getData().kunnr;
		//	var oDealer ="42120";
			this.intercolor="42";

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

			/*var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'" + McCmbo + "' and zzsuffix eq '" + SuffCmbo +
				"' and zzmoyr eq '" + MoyearCombo + "' and kunnr eq '" + oDealer +
				"'";*/
			/*	var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq'" + McCmbo + "' and zzsuffix eq '" + SuffCmbo +
				"' and zzmoyr eq '" + MoyearCombo + "' and kunnr eq '" + oDealer +
				"'and zzseries eq '" +Series+"'";*/
				
				
			var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=zzseries eq'"+Series+ "'and kunnr eq '"+oDealer+"'&$format=json"

				
				
				
				
	/*	var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=matnr eq '"+McCmbo+"' and endswith (zzintcol,'"+this.intercolor+"') and zzsuffix eq '"+SuffCmbo+"' and zzmoyr eq '"+MoyearCombo+"'&$format=json";	*/		

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

					/*var filtered_ODealer = a.filter(function (x) {
							return (x.kunnr==oDealer);
						});*/
					//	var Dealer = sap.ui.getCore().LoginDetails.DealerCode;
					var userAttributesModellen = sap.ui.getCore().getModel("LoginuserAttributesModel").getData();
				/*	var Dealer=userAttributesModellen[0].DealerCode[0];***/
					var Dealer = userAttributesModellen[0].DealerCode;
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
				//		var oJsonModel = new sap.ui.model.json.JSONModel(oExcludeOrdrtype);
					var IncludeOrdertype=oExcludeOrdrtype.filter(function (x) {
						return (x.zzordertype == "SO" || x.zzordertype == "DM");
					});
						var oJsonModel = new sap.ui.model.json.JSONModel(IncludeOrdertype);
	/*var includeDnc = oExcludeOrdrtype.filter(function (x) {
						return x.dnc_ind == "Y";
					});
					var includeHoldStatus = includeDnc.filter(function (x) {
						return x.Hold_stat == "Y";
					});
					var oJsonModel = new sap.ui.model.json.JSONModel(includeHoldStatus);*/
					//comment this line
				
					///////
					oJsonModel.setSizeLimit(1500);
					sap.ui.getCore().setModel(oJsonModel, "oVehicleSelectionResults");
				that.SeriesFilteredBinding();
					/*  sap.ui.core.BusyIndicator.hide();*/

				},
				error: function () {
				that.SeriesFilteredBindingNodata();
					/*	 sap.ui.core.BusyIndicator.hide();*/
				}
			});

			/*	var that = this;
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
			var SeriesUrl = that.oDataUrl + "/zc_mmfields";

			var ajax1 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},

				url: SeriesUrl,
				async: true,
				success: function (result) {}
			});
			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_MASTER_SRV";
			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var ModelUrl = that.oDataUrl + "/zc_c_vehicle?$top=5";

		
			var ajax2 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},

				url: ModelUrl,
				async: true,
				success: function (result) {}
			});

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_MASTER_SRV";
			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var ModelDescUrl = that.oDataUrl + "/zc_model";

			var ajax3 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				}
				
				,
				url: ModelDescUrl,
				async: true,
				success: function (result) {}
			});

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);
			var specificationurl = that.oDataUrl + "/zc_specification";

			var ajax4 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},

				url: specificationurl,
				async: true,
				success: function (result) {}

			});
			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_VEHICLE_CATALOGUE_SRV";
			that.oDataModel = new sap.ui.model.odata.ODataModel(that.oDataUrl, true);

			var SuffixMarktingDesc = that.oDataUrl + "/zc_exterior_trim";
			var ajax5 = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},
				url: SuffixMarktingDesc,
				async: true,
				success: function (result) {}
			});

	
			var that = this;
			$.when(ajax1, ajax2, ajax3, ajax4, ajax5).done(function (SeriesUrl, ModelUrl, ModelDescUrl, specificationurl, SuffixMarktingDesc) {
				debugger
				var SeriesUrl = SeriesUrl[0].d.results;
				var SeriesUrlModel = new sap.ui.model.json.JSONModel(SeriesUrl);
				sap.ui.getCore().setModel(SeriesUrlModel, "VehicleSeleSeries");

				var ModelUrl = ModelUrl[0].d.results;
				var ModelUrlModel = new sap.ui.model.json.JSONModel(ModelUrl);
				sap.ui.getCore().setModel(ModelUrlModel, "VehicleSeleModel");

				var ModelDescUrl = ModelDescUrl[0].d.results;
				var ModelDescUrlModel = new sap.ui.model.json.JSONModel(ModelDescUrl);
				sap.ui.getCore().setModel(ModelDescUrlModel, "VehicleSeleModelDesModel");

				var specificationurl = specificationurl[0].d.results;
				var specificationurlModel = new sap.ui.model.json.JSONModel(specificationurl);
				sap.ui.getCore().setModel(specificationurl, "VehicleSelespecificationurl");

				var SuffixMarktingDesc = SuffixMarktingDesc[0].d.results;
				var SuffixMarktingDescModel = new sap.ui.model.json.JSONModel(SuffixMarktingDesc);
				sap.ui.getCore().setModel(SuffixMarktingDescModel, "VehicleSeleSuffixMarktingDesc");

				that.getRouter().navTo("VehicleTrade_VehicleSelection");

		
			});
*/
		},
		
		SeriesFilteredBinding:function(){
				if (sap.ui.getCore().getModel("oVehicleSelectionResults") != undefined) {
				var oVehicleModel = sap.ui.getCore().getModel("oVehicleSelectionResults");
				this.getView().byId("table").setModel(oVehicleModel);
				
					var oProductNameColumn = this.getView().byId("oETAFromId");
				this.getView().byId("table").sort(oProductNameColumn, SortOrder.Ascending);
			}
		},
		SeriesFilteredBindingNodata:function(){
			var oVehicleModel=new sap.ui.model.json.JSONModel([]);
			this.getView().byId("table").setModel(oVehicleModel);
				
					var oProductNameColumn = this.getView().byId("oETAFromId");
				this.getView().byId("table").sort(oProductNameColumn, SortOrder.Ascending);
		},
		
		oTradeLinkPress: function (oEvt) {
var that=this;
			that.oSelectedItem = oEvt.getSource().getBindingContext().getObject();
			var VTN=that.oSelectedItem.zzvtn;
var dealercode=that.oSelectedItem.kunnr.slice(-5);

var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");
		
			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";
				var SeriesUrl = that.oDataUrl + "/CalculateETASet?$filter=VTN eq '"+VTN+"' and DelearCode eq '"+dealercode+"'&$format=json";
			var ajax = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},
				url:SeriesUrl,
				async: true,
				success: function (result) {
				debugger;
					var Data = result.d.results[0];
				/*	Data.MessageType="";
					Data.Calculate="20181126";*/
					if(Data.MessageType!="E"){
						var CurrentETAFrom=that.oSelectedItem.zzadddata4;
							if (CurrentETAFrom != null && CurrentETAFrom != "") {
				
			CurrentETAFrom=CurrentETAFrom.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1');
			}
				var CurrentETATo=that.oSelectedItem.pstsp;
			
			
			if (CurrentETATo != null && CurrentETATo != "") {
				var dateTo = CurrentETATo.split("(")[1];
				if (CurrentETATo.includes("+") == true) {
					/*dateTo = dateTo.split("+")[0];*/
					CurrentETATo =  new Date(CurrentETATo.split("(")[1].substring(0,10) * 1000).toDateString().substring(4,15);
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "MM/dd/yyyy"
				});
				CurrentETATo= oDateFormat.format(new Date(CurrentETATo));
					
				} else {
					dateTo = dateTo;
				var dataTo1 = dateTo.substring(0, dateTo.length - 5);
				var ValidTo = new Date(dataTo1 * 1000);
				ValidTo = ValidTo.toGMTString().substring(4, 16);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "MM/dd/yyyy"
				});
				CurrentETATo= oDateFormat.format(new Date(ValidTo));
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
var Eta=Data.Calculate;
var Calculate=Eta.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1');
var Proposed_ETA_To=addDays(Calculate,CurrentEtadiff);
that.oSelectedItem.Proposed_ETA_To=Proposed_ETA_To;
that.oSelectedItem.Proposed_ETA_From=Data.Calculate;
that.oSelectedItem.FromFourth="FromFourth";
//that.selectedTrade=escape(JSON.stringify(that.selectedTrade));
if(that.SelectedVehicleFrom=="VehileTrade_CreateSingle"){
			sap.ui.getCore().getModel("TradeModel").setProperty("/VehicleTradeVehicle", that.oSelectedItem);
			//	var oSelectedStrItems = JSON.stringify(oSelectedItem);
			that.getRouter().navTo("VehicleTrade_CreateSingle", {
				SelectedTrade: "VehicleTradeVehicle"
			});
			}
			else if(that.SelectedVehicleFrom=="VehileTrade_UpdtTradReq"){
				sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").setProperty("/VehicleTrade_UpdtTradReqVehicle", that.oSelectedItem);
					that.getRouter().navTo("VehicleTrade_UpdtTradReq", {
				SelectedTrade:"VehicleTrade_updateTradeVehicle"
			});
				
			}
				else if(that.SelectedVehicleFrom=="VehicleTrade_ModelBlock_Summary"){
				//	var Selobj=escape(JSON.stringify(oSelectedItem));
				var model= new sap.ui.model.json.JSONModel(that.oSelectedItem);
				sap.ui.getCore().setModel(model,"VehicleTrade_ModelBlock_SummaryTrade")
					that.getRouter().navTo("VehicleTrade_ModelBlock_Summary", {
				SelectedTrade:"VehicleTradeVehicle"
			});
				
			}
			
			
			
					}
					else{
						if(that.SelectedVehicleFrom=="VehileTrade_CreateSingle"){
			sap.ui.getCore().getModel("TradeModel").setProperty("/VehicleTradeVehicle", that.oSelectedItem);
			//	var oSelectedStrItems = JSON.stringify(oSelectedItem);
			that.getRouter().navTo("VehicleTrade_CreateSingle", {
				SelectedTrade: "VehicleTradeVehicle"
			});
			}
			else if(that.SelectedVehicleFrom=="VehileTrade_UpdtTradReq"){
				sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").setProperty("/VehicleTrade_UpdtTradReqVehicle", that.oSelectedItem);
					that.getRouter().navTo("VehicleTrade_UpdtTradReq", {
				SelectedTrade:"VehicleTrade_updateTradeVehicle"
			});
				
			}
				else if(that.SelectedVehicleFrom=="VehicleTrade_ModelBlock_Summary"){
				//	var Selobj=escape(JSON.stringify(oSelectedItem));
				var model= new sap.ui.model.json.JSONModel(that.oSelectedItem);
				sap.ui.getCore().setModel(model,"VehicleTrade_ModelBlock_SummaryTrade")
					that.getRouter().navTo("VehicleTrade_ModelBlock_Summary", {
				SelectedTrade:"VehicleTradeVehicle"
			});
				
			}
			}

				},
				error:function(){
					var that=this;
					if(that.SelectedVehicleFrom=="VehileTrade_CreateSingle"){
			sap.ui.getCore().getModel("TradeModel").setProperty("/VehicleTradeVehicle", that.oSelectedItem);
			//	var oSelectedStrItems = JSON.stringify(oSelectedItem);
			that.getRouter().navTo("VehicleTrade_CreateSingle", {
				SelectedTrade: "VehicleTradeVehicle"
			});
			}
			else if(that.SelectedVehicleFrom=="VehileTrade_UpdtTradReq"){
				sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").setProperty("/VehicleTrade_UpdtTradReqVehicle", that.oSelectedItem);
					that.getRouter().navTo("VehicleTrade_UpdtTradReq", {
				SelectedTrade:"VehicleTrade_updateTradeVehicle"
			});
				
			}
				else if(that.SelectedVehicleFrom=="VehicleTrade_ModelBlock_Summary"){
				//	var Selobj=escape(JSON.stringify(oSelectedItem));
				var model= new sap.ui.model.json.JSONModel(that.oSelectedItem);
				sap.ui.getCore().setModel(model,"VehicleTrade_ModelBlock_SummaryTrade")
					that.getRouter().navTo("VehicleTrade_ModelBlock_Summary", {
				SelectedTrade:"VehicleTradeVehicle"
			});
				
			}
			}
				
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