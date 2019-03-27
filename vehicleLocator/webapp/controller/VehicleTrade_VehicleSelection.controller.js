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
			var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
			var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
		    this.getView().byId("oDealerCode4").setText(LoggedInDealerCode2);                                
			this.getView().byId("oDealerOwnVehiSele").setText(LoggedInDealer);
			if (!this._oResponsivePopover) {
				this._oResponsivePopover = sap.ui.xmlfragment("vehicleLocator.fragment.VehicleSearchResult", this);
				this._oResponsivePopover.setModel(this.getView().getModel());
			}
			var oTable = this.getView().byId("vehicleSelectTable");
			var that = this;

			var oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				tableCount: 40

			});

			this.getView().setModel(oViewModel, "detailView");

			/// set the logo and Language. 

			this._setTheLanguage();

			this._setTheLogo();

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
			this.SelectedVehicleFrom = oEvent.getParameter("arguments").SelectedVehicleFrom;
			var that = this;
			var Model = sap.ui.getCore().getModel("SelectedSeriesFromScreen1");
			
		    if (this.sCurrentLocaleD == "French") {
		    	for (var i=0; i< Model.oData.length; i++){
		    		Model.oData[i].ENModelDesc = Model.oData[i].FRModelDesc;
		    		Model.oData[i].TCISeriesDescriptionEN = Model.oData[i].TCISeriesDescriptionFR;
		    	}
		    	
		    }
			
			
			
			
			
		that.getView().byId("oVt_SeriesCmbo").setSelectedKey("");
			if (Model != undefined) {
					that.getView().byId("oVt_SeriesCmbo").setModel(Model);
				var SeleKey = Model.getProperty("/SelectedSeries");
				that.getView().byId("oVt_SeriesCmbo").setSelectedKey(SeleKey);
				that.handleoVt_SeriesChange();
			} else if(that.getView().byId("oVt_SeriesCmbo").getModel()==undefined&&Model==undefined) {
				
				var that = this;
				/*var Array = [];*/
				sap.ui.core.BusyIndicator.show();

				that.oSelectedYear = new Date().getFullYear();
				//for temporary year 2018-data available for 2018 
				that.oSelectedYear = "2018";
				/*	that.getView().byId("Pacific").setSelected(false);
					that.getView().byId("Prairie").setSelected(false);
					that.getView().byId("Central").setSelected(false);
					that.getView().byId("Atlantic").setSelected(false);
					that.getView().byId("Quebec").setSelected(false);*/
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
				var SeriesUrl = that.oDataUrl + "/ZC_MODEL_DETAILS?$filter=Modelyear eq '" + that.oSelectedYear + "'";
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

			}
			if (sap.ui.getCore().getModel("oVehicleSelectionResults") != undefined) {
				var oVehicleModel = sap.ui.getCore().getModel("oVehicleSelectionResults").getData();
// based on the language set the descriptions. 
                 if (this.sCurrentLocaleD == "French") {
                 	for (var i=0; i<oVehicleModel.length; i++ ){
                 		oVehicleModel[i].mktg_desc_en = oVehicleModel[i].mktg_desc_fr;
                 		oVehicleModel[i].model_desc_en = oVehicleModel[i].model_desc_fr;
                 		oVehicleModel[i].zzseries_desc_en = oVehicleModel[i].zzseries_desc_fr;
                 		oVehicleModel[i].suffix_desc_en  = oVehicleModel[i].suffix_desc_fr; 
                 			oVehicleModel[i].mrktg_int_desc_en  = oVehicleModel[i].mrktg_int_desc_fr;
                 		
                 	}
                 	
                 }
	
				var model = new sap.ui.model.json.JSONModel(oVehicleModel);
				model.setSizeLimit(1000);
				this.getView().setModel(model, "vehicleSelectTableModel");

				// var oModeltemp = 	this.getView().getModel("vehicleSelectTableModel");
				// oModeltemp.updateBindings(true);


				var tableLength = this.getView().getModel("vehicleSelectTableModel").getData().length;
				var oModelDetail = this.getView().getModel("detailView");

				var sExpectedText = this.getView().getModel("i18n").getResourceBundle().getText("tableCount", [tableLength]);
				oModelDetail.setProperty("/tableCount", sExpectedText);

				// replacing this with sap.m table
				// this.getView().byId("table").setModel(oVehicleModel);

				// 	var oProductNameColumn = this.getView().byId("oETAFromId");
				// this.getView().byId("table").sort(oProductNameColumn, SortOrder.Ascending);

			}
		},

		onDescending: function () {

		},

		handleoVt_SeriesChange: function () {
			debugger

			var that = this;
			sap.ui.core.BusyIndicator.show();
			var oDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerKey;
			var Series = this.getView().byId("oVt_SeriesCmbo").getSelectedKey();

 

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

			var SeriesUrl = that.oDataUrl + "/ZVMS_CDS_ETA_consolidate?$filter=zzseries eq'" + Series + "'and kunnr eq '" + oDealer +
				"'&$format=json"

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

					var oExcludeOrdrtype = [];
					for (var i = filtered_ODealer.length - 1; i >= 0; --i) {
						if (ExcludeOrdType.indexOf((filtered_ODealer[i].zzordertype)) == -1) {
							oExcludeOrdrtype.push(filtered_ODealer[i]);
						}
					}

					//        var oJsonModel = new sap.ui.model.json.JSONModel(oExcludeOrdrtype);
					var IncludeOrdertype = oExcludeOrdrtype.filter(function (x) {
						return (x.zzordertype == "SO" || x.zzordertype == "DM");
					});
					var oJsonModel = new sap.ui.model.json.JSONModel(IncludeOrdertype);

					oJsonModel.setSizeLimit(1500);
					sap.ui.getCore().setModel(oJsonModel, "oVehicleSelectionResults");
					that.SeriesFilteredBinding();
					/*  sap.ui.core.BusyIndicator.hide();*/
     	sap.ui.core.BusyIndicator.hide();
				},
				error: function () {
					that.SeriesFilteredBindingNodata();
					sap.ui.core.BusyIndicator.hide();
					/*	 sap.ui.core.BusyIndicator.hide();*/
				}
			});

		},

		SeriesFilteredBinding: function () {
			if (sap.ui.getCore().getModel("oVehicleSelectionResults") != undefined) {
				var oVehicleModel = sap.ui.getCore().getModel("oVehicleSelectionResults");

				// set the model	
				var model = new sap.ui.model.json.JSONModel(oVehicleModel).getData();
			//    var model = oVehicleModel.getData();
				model.setSizeLimit(1000);
				
				// based on the language set the descriptions. 
                 if (this.sCurrentLocaleD == "French") {
                 	for (var i=0; i<model.oData.length; i++ ){
                 		model.oData[i].mktg_desc_en = model.oData[i].mktg_desc_fr;
                 		model.oData[i].model_desc_en = model.oData[i].model_desc_fr;
                 		model.oData[i].zzseries_desc_en = model.oData[i].zzseries_desc_fr;
                 		model.oData[i].suffix_desc_en  = model.oData[i].suffix_desc_fr;
                 			model.oData[i].mrktg_int_desc_en  = model.oData[i].mrktg_int_desc_fr;
                 	}
                 	
                 }
				
				this.getView().setModel(model, "vehicleSelectTableModel");
				
				var oModeltemp = 	this.getView().setModel(model, "vehicleSelectTableModel");
				oModeltemp.updateBindings(true);

				var tableLength = this.getView().getModel("vehicleSelectTableModel").getData().length;
				var oModelDetail = this.getView().getModel("detailView");

				var sExpectedText = this.getView().getModel("i18n").getResourceBundle().getText("tableCount", [tableLength]);
				oModelDetail.setProperty("/tableCount", sExpectedText);

				// this.getView().byId("table").setModel(oVehicleModel);

				// 	var oProductNameColumn = this.getView().byId("oETAFromId");
				// this.getView().byId("table").sort(oProductNameColumn, SortOrder.Ascending);

			}
		},
		SeriesFilteredBindingNodata: function () {
			var oVehicleModel = new sap.ui.model.json.JSONModel([]);
			this.getView().byId("vehicleSelectTable").setModel(oVehicleModel);

			var oProductNameColumn = this.getView().byId("oETAFromId");
			this.getView().byId("vehicleSelectTable").sort(oProductNameColumn, SortOrder.Ascending);
		},

		oTradeLinkPress: function (oEvt) {
			var that = this;
			// that.oSelectedItem = oEvt.getSource().getBindingContext().getObject();

			that.oSelectedItem = oEvt.getSource().getBindingContext("vehicleSelectTableModel").getObject();
			that.oSelectedItem.FromFourth = "FromFourth";
			var VTN = that.oSelectedItem.zzvtn;
			var dealercode = that.oSelectedItem.kunnr.slice(-5);

			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
			} else {
				this.sPrefix = "";

			}

			this.nodeJsUrl = this.sPrefix + "/node";
			that.oDataUrl = this.nodeJsUrl + "/Z_DEALER_TRADE_REQUEST_SRV";
			var SeriesUrl = that.oDataUrl + "/CalculateETASet?$filter=VTN eq '" + VTN + "' and DelearCode eq '" + dealercode + "'&$format=json";
			var ajax = $.ajax({
				dataType: "json",
				xhrFields: //
				{
					withCredentials: true
				},
				url: SeriesUrl,
				async: true,
				success: function (result) {
					debugger;
					var Data = result.d.results[0];
					/*	Data.MessageType="";
						Data.Calculate="20181126";*/
					if (Data.MessageType != "E") {
						var CurrentETAFrom = that.oSelectedItem.zzadddata4;
						if (CurrentETAFrom != null && CurrentETAFrom != "") {

							CurrentETAFrom = CurrentETAFrom.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1');
						}
						var CurrentETATo = that.oSelectedItem.pstsp;

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

if((CurrentETAFrom==""||CurrentETAFrom==null)&&(CurrentETATo!=""&&CurrentETATo!=null)){
	CurrentETAFrom=CurrentETATo
}
else if((CurrentETAFrom!=""&&CurrentETAFrom!=null)&&(CurrentETATo==""||CurrentETATo==null)){
	CurrentETATo=CurrentETAFrom
}
else if((CurrentETAFrom==""||CurrentETAFrom==null)&&(CurrentETATo==""||CurrentETATo==null)){
	/*CurrentETATo=Data.Calculate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1')
	CurrentETAFrom=Data.Calculate.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1')*/
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
						if(Proposed_ETA_To!="Invalid Date"){
						that.oSelectedItem.Proposed_ETA_To = Proposed_ETA_To;
						}
						else{
							that.oSelectedItem.Proposed_ETA_To ="";
						}
						that.oSelectedItem.Proposed_ETA_From = Data.Calculate;
						that.oSelectedItem.FromFourth = "FromFourth";
						//that.selectedTrade=escape(JSON.stringify(that.selectedTrade));
						if (that.SelectedVehicleFrom == "VehileTrade_CreateSingle") {
							sap.ui.getCore().getModel("TradeModel").setProperty("/VehicleTradeVehicle", that.oSelectedItem);
							//	var oSelectedStrItems = JSON.stringify(oSelectedItem);
							that.getRouter().navTo("VehicleTrade_CreateSingle", {
								SelectedTrade: "VehicleTradeVehicle"
							});
						} else if (that.SelectedVehicleFrom == "VehileTrade_UpdtTradReq") {
							//.getProperty("/OffredVehicle")
							that.oSelectedItem.Offered_Vtn = that.oSelectedItem.zzvtn;
							that.oSelectedItem.Model_Year = that.oSelectedItem.zzmoyr;
							that.oSelectedItem.Series_Desc = that.oSelectedItem.zzseries_desc_en;
							that.oSelectedItem.zzseries_desc_fr = that.oSelectedItem.zzseries_desc_fr;
							that.oSelectedItem.zzseries_desc_en = that.oSelectedItem.zzseries_desc_en;
							that.oSelectedItem.Series = that.oSelectedItem.zzseries;
							that.oSelectedItem.Model = that.oSelectedItem.matnr;
							that.oSelectedItem.Model_Desc = that.oSelectedItem.model_desc_en;
							that.oSelectedItem.Suffix = that.oSelectedItem.zzsuffix;
							that.oSelectedItem.Suffix_Desc = that.oSelectedItem.suffix_desc_en;
							that.oSelectedItem.Int_Colour_Desc = that.oSelectedItem.mrktg_int_desc_en;
							that.oSelectedItem.APX = that.oSelectedItem.zzapx;
								that.oSelectedItem.Ext_Colour = that.oSelectedItem.zzextcol;
							that.oSelectedItem.Ext_Colour_Desc = that.oSelectedItem.mktg_desc_en;
							that.oSelectedItem.Status = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Status;
							that.oSelectedItem.Order_Type = that.oSelectedItem.zzordertype;
							//	var Req_Current_ETA_From=Number(that.oSelectedItem.pstsp);
						/*	that.oSelectedItem.Req_Current_ETA_From = that.oSelectedItem.pstsp;*/
							that.oSelectedItem.Off_Current_ETA_To = that.oSelectedItem.pstsp;
							


							var dateString = that.oSelectedItem.zzadddata4;
							if(dateString!=""&&dateString!=undefined&&dateString!=null){
							
							var year = dateString.substring(0, 4);
							var month = dateString.substring(4, 6);
							var day = dateString.substring(6, 8);

							var Off_Current_ETA_From = new Date(year, month - 1, day);
							Off_Current_ETA_From = new Date(Off_Current_ETA_From);
							Off_Current_ETA_From = Date.parse(Off_Current_ETA_From);


							that.oSelectedItem.Off_Current_ETA_From = "/Date(" + Off_Current_ETA_From + ")/";
							}
							else{
									that.oSelectedItem.Off_Current_ETA_From = "/Date(0)/";
							}

							//	var Proposed_ETA_From=Number(that.oSelectedItem.Proposed_ETA_From);
							var dateString = that.oSelectedItem.Proposed_ETA_From;
								if(dateString!=""&&dateString!=undefined&&dateString!=null){
							var year = dateString.substring(0, 4);
							var month = dateString.substring(4, 6);
							var day = dateString.substring(6, 8);

							var Proposed_ETA_From = new Date(year, month - 1, day);
							Proposed_ETA_From = new Date(Proposed_ETA_From);
							Proposed_ETA_From = Date.parse(Proposed_ETA_From);

							that.oSelectedItem.Off_Proposed_ETA_From = "/Date(" + Proposed_ETA_From + ")/";

								}else{
									that.oSelectedItem.Off_Proposed_ETA_From = "/Date(0)/";	
								}

							var Req_Proposed_ETA_To = Number(that.oSelectedItem.Proposed_ETA_To);
							Req_Proposed_ETA_To = new Date(Req_Proposed_ETA_To);
							Req_Proposed_ETA_To = Date.parse(Req_Proposed_ETA_To);

							that.oSelectedItem.Off_Proposed_ETA_To = "/Date(" + Req_Proposed_ETA_To + ")/";

							sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").setProperty("/OffredVehicle", that.oSelectedItem);
							that.getRouter().navTo("VehicleTrade_UpdtTradReq", {
								SelectedTrade: "VehicleTrade_updateTradeVehicle"
							});

						} else if (that.SelectedVehicleFrom == "VehicleTrade_ModelBlock_Summary") {
							//	var Selobj=escape(JSON.stringify(oSelectedItem));
							var model = new sap.ui.model.json.JSONModel(that.oSelectedItem);
							sap.ui.getCore().setModel(model, "VehicleTrade_ModelBlock_SummaryTrade")
							that.getRouter().navTo("VehicleTrade_ModelBlock_Summary", {
								SelectedTrade: "VehicleTradeVehicle"
							});

						}

					} else {
						if (that.SelectedVehicleFrom == "VehileTrade_CreateSingle") {
							sap.ui.getCore().getModel("TradeModel").setProperty("/VehicleTradeVehicle", that.oSelectedItem);
							//	var oSelectedStrItems = JSON.stringify(oSelectedItem);
							that.getRouter().navTo("VehicleTrade_CreateSingle", {
								SelectedTrade: "VehicleTradeVehicle"
							});
						} else if (that.SelectedVehicleFrom == "VehileTrade_UpdtTradReq") {
								that.oSelectedItem.Offered_Vtn = that.oSelectedItem.zzvtn;
							that.oSelectedItem.Model_Year = that.oSelectedItem.zzmoyr;
							that.oSelectedItem.Series_Desc = that.oSelectedItem.zzseries_desc_en;
							that.oSelectedItem.zzseries_desc_fr = that.oSelectedItem.zzseries_desc_fr;
							that.oSelectedItem.zzseries_desc_en = that.oSelectedItem.zzseries_desc_en;
							that.oSelectedItem.Series = that.oSelectedItem.zzseries;
							that.oSelectedItem.Model = that.oSelectedItem.matnr;
							that.oSelectedItem.Model_Desc = that.oSelectedItem.model_desc_en;
							that.oSelectedItem.Suffix = that.oSelectedItem.zzsuffix;
							that.oSelectedItem.Suffix_Desc = that.oSelectedItem.suffix_desc_en;
							that.oSelectedItem.Int_Colour_Desc = that.oSelectedItem.mrktg_int_desc_en;
							that.oSelectedItem.APX = that.oSelectedItem.zzapx;
								that.oSelectedItem.Ext_Colour = that.oSelectedItem.zzextcol;
							that.oSelectedItem.Ext_Colour_Desc = that.oSelectedItem.mktg_desc_en;
							that.oSelectedItem.Status = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Status;
							that.oSelectedItem.Order_Type = that.oSelectedItem.zzordertype;
							//	var Req_Current_ETA_From=Number(that.oSelectedItem.pstsp);

						/*	that.oSelectedItem.Req_Current_ETA_From = that.oSelectedItem.pstsp;*/
							that.oSelectedItem.Off_Current_ETA_To = that.oSelectedItem.pstsp;
							

							var dateString = that.oSelectedItem.zzadddata4;
							if(dateString!=""&&dateString!=undefined&&dateString!=null){
							
							var year = dateString.substring(0, 4);
							var month = dateString.substring(4, 6);
							var day = dateString.substring(6, 8);

							var Off_Current_ETA_From = new Date(year, month - 1, day);
							Off_Current_ETA_From = new Date(Off_Current_ETA_From);
							Off_Current_ETA_From = Date.parse(Off_Current_ETA_From);

							that.oSelectedItem.Off_Current_ETA_From = "/Date(" + Off_Current_ETA_From + ")/";
							}
							else{
									that.oSelectedItem.Off_Current_ETA_From = "/Date(0)/";
							}
							//	var Proposed_ETA_From=Number(that.oSelectedItem.Proposed_ETA_From);
							var dateString = "";
								if(dateString!=""&&dateString!=undefined&&dateString!=null){
							var year = dateString.substring(0, 4);
							var month = dateString.substring(4, 6);
							var day = dateString.substring(6, 8);

							var Proposed_ETA_From = new Date(year, month - 1, day);
							Proposed_ETA_From = new Date(Proposed_ETA_From);
							Proposed_ETA_From = Date.parse(Proposed_ETA_From);

							that.oSelectedItem.Off_Proposed_ETA_From = "/Date(" + Proposed_ETA_From + ")/";
								}else{
									that.oSelectedItem.Off_Proposed_ETA_From = "/Date(0)/";	
								}
						/*	var Req_Proposed_ETA_To = Number(that.oSelectedItem.Proposed_ETA_To);
							Req_Proposed_ETA_To = new Date(Req_Proposed_ETA_To);
							Req_Proposed_ETA_To = Date.parse(Req_Proposed_ETA_To);*/

							that.oSelectedItem.Off_Proposed_ETA_To = "/Date(0)/";
							
							
							
							
							
							
							sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").setProperty("/OffredVehicle", that.oSelectedItem);
							that.getRouter().navTo("VehicleTrade_UpdtTradReq", {
								SelectedTrade: "VehicleTrade_updateTradeVehicle"
							});

						} else if (that.SelectedVehicleFrom == "VehicleTrade_ModelBlock_Summary") {
							//	var Selobj=escape(JSON.stringify(oSelectedItem));
							var model = new sap.ui.model.json.JSONModel(that.oSelectedItem);
							sap.ui.getCore().setModel(model, "VehicleTrade_ModelBlock_SummaryTrade")
							that.getRouter().navTo("VehicleTrade_ModelBlock_Summary", {
								SelectedTrade: "VehicleTradeVehicle"
							});

						}
					}

				},
				error: function () {
					var that = this;
					if (that.SelectedVehicleFrom == "VehileTrade_CreateSingle") {
						sap.ui.getCore().getModel("TradeModel").setProperty("/VehicleTradeVehicle", that.oSelectedItem);
						//	var oSelectedStrItems = JSON.stringify(oSelectedItem);
						that.getRouter().navTo("VehicleTrade_CreateSingle", {
							SelectedTrade: "VehicleTradeVehicle"
						});
					} else if (that.SelectedVehicleFrom == "VehileTrade_UpdtTradReq") {
							that.oSelectedItem.Offered_Vtn = that.oSelectedItem.zzvtn;
							that.oSelectedItem.Model_Year = that.oSelectedItem.zzmoyr;
							that.oSelectedItem.Series_Desc = that.oSelectedItem.zzseries_desc_en;
							that.oSelectedItem.zzseries_desc_fr = that.oSelectedItem.zzseries_desc_fr;
							that.oSelectedItem.zzseries_desc_en = that.oSelectedItem.zzseries_desc_en;
							that.oSelectedItem.Series = that.oSelectedItem.zzseries;
							that.oSelectedItem.Model = that.oSelectedItem.matnr;
							that.oSelectedItem.Model_Desc = that.oSelectedItem.model_desc_en;
							that.oSelectedItem.Suffix = that.oSelectedItem.zzsuffix;
							that.oSelectedItem.Suffix_Desc = that.oSelectedItem.suffix_desc_en;
							that.oSelectedItem.Int_Colour_Desc = that.oSelectedItem.mrktg_int_desc_en;
							that.oSelectedItem.APX = that.oSelectedItem.zzapx;
								that.oSelectedItem.Ext_Colour = that.oSelectedItem.zzextcol;
							that.oSelectedItem.Ext_Colour_Desc = that.oSelectedItem.mktg_desc_en;
							that.oSelectedItem.Status = sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").getData().Status;
							that.oSelectedItem.Order_Type = that.oSelectedItem.zzordertype;
							//	var Req_Current_ETA_From=Number(that.oSelectedItem.pstsp);

						/*	that.oSelectedItem.Req_Current_ETA_From = that.oSelectedItem.pstsp;*/
							that.oSelectedItem.Off_Current_ETA_To = that.oSelectedItem.pstsp;
							

							var dateString = that.oSelectedItem.zzadddata4;
							if(dateString!=""&&dateString!=undefined&&dateString!=null){
							
							var year = dateString.substring(0, 4);
							var month = dateString.substring(4, 6);
							var day = dateString.substring(6, 8);

							var Off_Current_ETA_From = new Date(year, month - 1, day);
							Off_Current_ETA_From = new Date(Off_Current_ETA_From);
							Off_Current_ETA_From = Date.parse(Off_Current_ETA_From);

							that.oSelectedItem.Off_Current_ETA_From = "/Date(" + Off_Current_ETA_From + ")/";
							}
							else{
									that.oSelectedItem.Off_Current_ETA_From = "/Date(0)/";
							}
							//	var Proposed_ETA_From=Number(that.oSelectedItem.Proposed_ETA_From);
							var dateString = "";
								if(dateString!=""&&dateString!=undefined&&dateString!=null){
							var year = dateString.substring(0, 4);
							var month = dateString.substring(4, 6);
							var day = dateString.substring(6, 8);

							var Proposed_ETA_From = new Date(year, month - 1, day);
							Proposed_ETA_From = new Date(Proposed_ETA_From);
							Proposed_ETA_From = Date.parse(Proposed_ETA_From);

							that.oSelectedItem.Off_Proposed_ETA_From = "/Date(" + Proposed_ETA_From + ")/";
								}else{
									that.oSelectedItem.Off_Proposed_ETA_From = "/Date(0)/";	
								}
						/*	var Req_Proposed_ETA_To = Number(that.oSelectedItem.Proposed_ETA_To);
							Req_Proposed_ETA_To = new Date(Req_Proposed_ETA_To);
							Req_Proposed_ETA_To = Date.parse(Req_Proposed_ETA_To);*/

							that.oSelectedItem.Off_Proposed_ETA_To = "/Date(0)/";
							
						sap.ui.getCore().getModel("SelectedSimpleFormAproveTrReq").setProperty("/OffredVehicle", that.oSelectedItem);
						that.getRouter().navTo("VehicleTrade_UpdtTradReq", {
							SelectedTrade: "VehicleTrade_updateTradeVehicle"
						});

					} else if (that.SelectedVehicleFrom == "VehicleTrade_ModelBlock_Summary") {
						//	var Selobj=escape(JSON.stringify(oSelectedItem));
						var model = new sap.ui.model.json.JSONModel(that.oSelectedItem);
						sap.ui.getCore().setModel(model, "VehicleTrade_ModelBlock_SummaryTrade");
						that.getRouter().navTo("VehicleTrade_ModelBlock_Summary", {
							SelectedTrade: "VehicleTradeVehicle"
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

		// onDescending: function () {
		// 	var that = this;
		// 	//	that.getView().byId("table1VSR").destroyItems();
		// 	var oTable = this.getView().byId("table");
		// 	var oItems = oTable.getBinding("items");
		// 	oTable.getBinding("items").aSorters = null;
		// 	var oBindingPath = oItems.getModel().getProperty("/bindingValue");
		// 	var oSorter = new Sorter(oBindingPath, true);
		// 	oItems.sort(oSorter);

		// 	if (this.selooLabelText == "Model") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(true);
		// 		this.getView().byId("senAsIcon").setVisible(false);
		// 		this.getView().byId("senDsIcon").setVisible(false);
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
		// 		this.getView().byId("vtnAsIcon").setVisible(false);
		// 		this.getView().byId("vtnDsIcon").setVisible(false);

		// 	} else if (this.selooLabelText == "Color") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("coAsIcon").setVisible(false);
		// 		this.getView().byId("coDsIcon").setVisible(true);
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
		// 		this.getView().byId("vtnAsIcon").setVisible(false);
		// 		this.getView().byId("vtnDsIcon").setVisible(false);
		// 		this.getView().byId("senAsIcon").setVisible(false);
		// 		this.getView().byId("senDsIcon").setVisible(false);

		// 	} else if (this.selooLabelText == "Series") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("senAsIcon").setVisible(false);
		// 		this.getView().byId("senDsIcon").setVisible(true);
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
		// 		this.getView().byId("vtnAsIcon").setVisible(false);
		// 		this.getView().byId("vtnDsIcon").setVisible(false);

		// 	} else if (this.selooLabelText == "Suffix") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("senAsIcon").setVisible(false);
		// 		this.getView().byId("senDsIcon").setVisible(false);
		// 		this.getView().byId("coAsIcon").setVisible(false);
		// 		this.getView().byId("coDsIcon").setVisible(false);
		// 		this.getView().byId("suAsIcon").setVisible(false);
		// 		this.getView().byId("suDsIcon").setVisible(true);
		// 		this.getView().byId("apAsIcon").setVisible(false);
		// 		this.getView().byId("apDsIcon").setVisible(false);
		// 		this.getView().byId("otAsIcon").setVisible(false);
		// 		this.getView().byId("otDsIcon").setVisible(false);
		// 		this.getView().byId("etfAsIcon").setVisible(false);
		// 		this.getView().byId("etfDsIcon").setVisible(false);
		// 		this.getView().byId("ettAsIcon").setVisible(false);
		// 		this.getView().byId("ettDsIcon").setVisible(false);
		// 		this.getView().byId("vtnAsIcon").setVisible(false);
		// 		this.getView().byId("vtnDsIcon").setVisible(false);
		// 	} else if (this.selooLabelText == "APX") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("senAsIcon").setVisible(false);
		// 		this.getView().byId("senDsIcon").setVisible(false);
		// 		this.getView().byId("coAsIcon").setVisible(false);
		// 		this.getView().byId("coDsIcon").setVisible(false);
		// 		this.getView().byId("suAsIcon").setVisible(false);
		// 		this.getView().byId("suDsIcon").setVisible(false);
		// 		this.getView().byId("apAsIcon").setVisible(false);
		// 		this.getView().byId("apDsIcon").setVisible(true);
		// 		this.getView().byId("otAsIcon").setVisible(false);
		// 		this.getView().byId("otDsIcon").setVisible(false);
		// 		this.getView().byId("etfAsIcon").setVisible(false);
		// 		this.getView().byId("etfDsIcon").setVisible(false);
		// 		this.getView().byId("ettAsIcon").setVisible(false);
		// 		this.getView().byId("ettDsIcon").setVisible(false);
		// 		this.getView().byId("vtnAsIcon").setVisible(false);
		// 		this.getView().byId("vtnDsIcon").setVisible(false);
		// 	} else if (this.selooLabelText == "Order Type") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("senAsIcon").setVisible(false);
		// 		this.getView().byId("senDsIcon").setVisible(false);
		// 		this.getView().byId("coAsIcon").setVisible(false);
		// 		this.getView().byId("coDsIcon").setVisible(false);
		// 		this.getView().byId("suAsIcon").setVisible(false);
		// 		this.getView().byId("suDsIcon").setVisible(false);
		// 		this.getView().byId("apAsIcon").setVisible(false);
		// 		this.getView().byId("apDsIcon").setVisible(false);
		// 		this.getView().byId("otAsIcon").setVisible(false);
		// 		this.getView().byId("otDsIcon").setVisible(true);
		// 		this.getView().byId("etfAsIcon").setVisible(false);
		// 		this.getView().byId("etfDsIcon").setVisible(false);
		// 		this.getView().byId("ettAsIcon").setVisible(false);
		// 		this.getView().byId("ettDsIcon").setVisible(false);
		// 		this.getView().byId("vtnAsIcon").setVisible(false);
		// 		this.getView().byId("vtnDsIcon").setVisible(false);
		// 	} else if (this.selooLabelText == "ETA From") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("senAsIcon").setVisible(false);
		// 		this.getView().byId("senDsIcon").setVisible(false);
		// 		this.getView().byId("coAsIcon").setVisible(false);
		// 		this.getView().byId("coDsIcon").setVisible(false);
		// 		this.getView().byId("suAsIcon").setVisible(false);
		// 		this.getView().byId("suDsIcon").setVisible(false);
		// 		this.getView().byId("apAsIcon").setVisible(false);
		// 		this.getView().byId("apDsIcon").setVisible(false);
		// 		this.getView().byId("otAsIcon").setVisible(false);
		// 		this.getView().byId("otDsIcon").setVisible(false);
		// 		this.getView().byId("etfAsIcon").setVisible(false);
		// 		this.getView().byId("etfDsIcon").setVisible(true);
		// 		this.getView().byId("ettAsIcon").setVisible(false);
		// 		this.getView().byId("ettDsIcon").setVisible(false);
		// 		this.getView().byId("vtnAsIcon").setVisible(false);
		// 		this.getView().byId("vtnDsIcon").setVisible(false);
		// 	} else if (this.selooLabelText == "ETA To") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("senAsIcon").setVisible(false);
		// 		this.getView().byId("senDsIcon").setVisible(false);
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
		// 		this.getView().byId("ettDsIcon").setVisible(true);
		// 		this.getView().byId("vtnAsIcon").setVisible(false);
		// 		this.getView().byId("vtnDsIcon").setVisible(false);
		// 	} else if (this.selooLabelText == "Vehicle Tracking Number") {
		// 		this.getView().byId("moAsIcon").setVisible(false);
		// 		this.getView().byId("moDsIcon").setVisible(false);
		// 		this.getView().byId("senAsIcon").setVisible(false);
		// 		this.getView().byId("senDsIcon").setVisible(false);
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
		// 		this.getView().byId("vtnAsIcon").setVisible(false);
		// 		this.getView().byId("vtnDsIcon").setVisible(true);
		// 	}
		// 	/*	this._oResponsivePopover.close();*/
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
					new Filter("zzvtn", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzseries", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("matnr", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzsuffix", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzapx", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzextcol", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("mktg_desc_en", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
				//	new Filter("zzordertype", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("zzadddata4", sap.ui.model.FilterOperator.Contains, this.sSearchQuery),
					new Filter("pstsp", sap.ui.model.FilterOperator.Contains, this.sSearchQuery)

				], false);
				// this.sSearchQuery);
				aFilters.push(oFilter);
			}

 

			this.byId("vehicleSelectTable")
				.getBinding("items")
				.filter(aFilters)
				.sort(aSorters);
				
 
	// var aFilters = [];
 //      this.sSearchQuery= oEvt.getSource().getValue();
 //      if (this.sSearchQuery && this.sSearchQuery.length > 0) {
 //          var filter = new Filter("vehicleSelectTableModel", sap.ui.model.FilterOperator.Contains, this.sSearchQuery);
 //          aFilters.push(filter);
 //      }

 //      // update list binding
 //      var oTableUpdate = this.getView().byId("vehicleSelectTable");
 //      var binding = oTableUpdate .getBinding("items");
 //      binding.filter(aFilters, "Application");
 //  }			
				
				
				
				
				
				
				
				
				
				
				
				
				
				
		},

		handleViewSettingsDialogButtonPressed: function (oEvt) {

			if (!this._sortDialog) {
				this._sortDialog = sap.ui.xmlfragment("vehicleSelectionSortDialog", "vehicleLocator.fragment.VehicleSelectionSortDialog", this);
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
				.byId("vehicleSelectTable");
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
		SuffixDescrioptionBinding: function () {
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/vehicleLocatorNode";
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
					var SeriesDes = result.d.results;

					var SeriesDesModel = new sap.ui.model.json.JSONModel(SeriesDes);
					sap.ui.getCore().setModel(SeriesDesModel, "SeriesDesModel");
					//	var SelYear = new Date().getFullYear().toString();
					var SelYear = new Date().getFullYear();
					//temporary-2018, data avaialable for 2018, before deploying remove this
					SelYear = "2018"
					that.SeriesBinding(SelYear);

				},

			});
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
								// var SPRAS = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language;  //2603
						var SPRAS = that.sCurrentLocaleD;
				if (SeriesDescription.length != 0) {
					for (var a = 0; a < that.Fullurls.length; a++) {
						for (var b = 0; b < SeriesDescription.length; b++) {

							if (that.Fullurls[a].TCISeries == SeriesDescription[b].ModelSeriesNo) {
								that.Fullurls[a].TCISeriesDescriptionEN = SeriesDescription[b].TCISeriesDescriptionEN;
								that.Fullurls[a].TCISeriesDescriptionFR = SeriesDescription[b].TCISeriesDescriptionFR;
								that.Fullurls[a].Division = SeriesDescription[b].Division;
								that.Fullurls[a].SPRAS = SPRAS;

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
						/*	that.Fullurls.SPRAS = SPRAS;*/
					}
					/*	that.Fullurls.TCISeriesDescriptionFR = "";
						that.Fullurls.Division = "";*/

				}

				/*	var obj = {};
						for (var i = 0, len = that.Fullurls.length; i < len; i++)
							obj[that.Fullurls[i]['Suffix']] = that.Fullurls[i];
						that.Fullurls = new Array();
						for (var key in obj)
							that.Fullurls.push(obj[key]);*/
				// debugger;

				if (sap.ui.getCore().getModel("LoginBpDealerModel") != undefined) {
					if (sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].Division == "10") {
						that.Division = "TOY";
					} else if (sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].Division == "20") {
						that.Division = "LEX";
					}
				}

				that.Fullurls = that.Fullurls.filter(function (x) {
					return x.Division == that.Division;
				});
				var SeriesModel = new sap.ui.model.json.JSONModel(that.Fullurls);
				that.getView().setModel(SeriesModel, "SeriesData");
				that.getView().byId("oVt_SeriesCmbo").setModel(SeriesModel);

			}
			sap.ui.core.BusyIndicator.hide();
		},
		SeriesDescription: function (Data) {
			var that = this;

			if (sap.ui.getCore().getModel("SeriesDesModel") != undefined) {
				var oResults = sap.ui.getCore().getModel("SeriesDesModel").getData();

				that.SeriesDesc = oResults;
			} else {
				that.SeriesDesc = [];
			}

			//	}

			/*var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
					that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);*/
			/*	this.oSufModelYear = oResults[0].ModelYear;
				this.oSufTCISeries = oResults[0].TCISeries;
				this.oSufModel = oResults[0].Model;*/
			/*	that.SuffixDescription(oResults);
				
				var oJsonModelVLS = new sap.ui.model.json.JSONModel(oResults);
				that.getView().byId("SuffCmbo").setModel(oJsonModelVLS);*/

			return that.SeriesDesc;
		},

		TradeSummaryoDate: function (Created_On) {
			if (Created_On != null && Created_On != "" && Created_On != "/Date(0)/") {
				var dateTo = Created_On.split("(")[1];
				if (Created_On.indexOf("+") != -1) {
					/*dateTo = dateTo.split("+")[0];*/
					Created_On = new Date(Created_On.split("(")[1].substring(0, 10) * 1000).toDateString().substring(4, 15);
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyyMMdd"
					});
					return oDateFormat.format(new Date(Created_On));

				} else {
					dateTo = dateTo;
					var dataTo1 = dateTo.substring(0, dateTo.length - 5);
					var ValidTo = new Date(dataTo1 * 1000);
					ValidTo = ValidTo.toGMTString().substring(4, 16);
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyyMMdd"
					});
					return oDateFormat.format(new Date(ValidTo));
				}

			} else {
				return "";
			}
		}

		/*onSelectLink:function(oEvt)
		   
		{
			debugger;
			var data=oEvt;
			
		}*/

	});
});