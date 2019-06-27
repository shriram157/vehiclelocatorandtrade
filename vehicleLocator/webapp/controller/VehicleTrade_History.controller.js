sap.ui.define([
	"vehicleLocator/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageBox',
	"sap/ui/core/routing/History",
	"vehicleLocator/Formatter/Formatter",
	"sap/ui/Device",
	"sap/ui/model/Sorter"
], function (BaseController, JSONModel, ResourceModel, MessageBox, History, Formatter,Device,Sorter) {
	"use strict";
	var TableData;
	return BaseController.extend("vehicleLocator.controller.VehicleTrade_History", {
        formatter:Formatter,
		onInit: function () {
			var _that = this;
			this._mViewSettingsDialogs = {};
			var LoggedInDealerCode2 = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartner;
			var LoggedInDealer = sap.ui.getCore().getModel("LoginBpDealerModel").getData()[0].BusinessPartnerName.replace(/[^\w\s]/gi, '');
		    this.getView().byId("oDealerCode8").setText(LoggedInDealerCode2);                                
			this.getView().byId("oDealerHistory").setText(LoggedInDealer);
			//Global date format
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			_that.oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd'T'HH:mm:ss"
			});
			
			this._oViewModel = new sap.ui.model.json.JSONModel({
				busy: false,
				delay: 0,
				visibleByDefault: false,
				editAllowed: true,
				onlyShownoEditForChange: true

			});

			this.getView().setModel(this._oViewModel, "detailView");

			/// set the logo and Language. 

			this._setTheLanguage();

			this._setTheLogo();

			//this.getRouter().attachRouteMatched(this.onRouteMatched, this);
			this.getRouter().getRoute("VehicleTrade_History").attachPatternMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function (oEvent) {
			// var dataFrom = oEvent.getParameter("arguments").DataClicked;
			// if (dataFrom != undefined) {

				this.VehicleHistory_Summary();

			// }
		},

		VehicleHistory_Summary: function () {
			var that = this;
			var sLocation = window.location.host;
			var sLocation_conf = sLocation.search("webide");

			if (sLocation_conf == 0) {
				this.sPrefix = "/VehicleLocator_Xsodata";
			} else {
				this.sPrefix = "";

			}
			this.nodeJsUrl = this.sPrefix;
			
			
// for zone user functionality ---------------------			
			
			 var confirmZoneUser = sap.ui.getCore().getModel("LoginBpDealerModel").oData["0"].BusinessPartnerName;	
		 if  (confirmZoneUser.includes("Zone User")  || confirmZoneUser.includes("National") )     {
			  	   this.userType = "Zone";
			  	   
			  	   		this._oViewModel.setProperty("/visibleByDefault", true);
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
			  	
		    } else {   // this is a dealer login, the existing logic as is. 
 	              this._oViewModel.setProperty("/visibleByDefault", false);   // no combobox to be displayed. 
			
		
				var Dealer_No = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].DealerCode;
		    }
			

			
			
			// var Dealer_No = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].DealerCode;
			
			
			
			
			
			// var lang = sap.ui.getCore().getModel("LoginuserAttributesModel").getData()[0].Language.slice(0, 1);  //0104
			var lang;
		                if (this.sCurrentLocaleD == "French") {

                 lang = 'F';
			
	 
                } else{
                 
                   lang = 'E';

                 }

			var oModel = new sap.ui.model.odata.ODataModel(this.nodeJsUrl + "/xsodata/vehicleTrade_SRV.xsodata", true);

			var Filter0 = new sap.ui.model.Filter('Requesting_Dealer', 'EndsWith', Dealer_No);
			var Filter1 = new sap.ui.model.Filter('Requested_Dealer', 'EndsWith', Dealer_No);
			var Filter2 = new sap.ui.model.Filter('Trade_Status', 'EQ', 'A');
			var Filter = new sap.ui.model.Filter([Filter0, Filter1], false);
			var Filterall = new sap.ui.model.Filter([Filter, Filter2], true);
			TableData = [];
			oModel.read("/TradeRequest", {
				
				
				
				 urlParameters: {
									filters: [Filterall],
									"$expand": "TradeVehicles",

								 },
	
				
				async: false,
				success: function (oData, oResponse) {
					//=====Filter on Vehicles=====================	
					TableData = oData.results;
				},
				error: function (e) {

				}
			});
			for (var i = 0; i < TableData.length; i++) {
				TableData[i].Requesting_Dealer = TableData[i].Requesting_Dealer.slice(-5);
				TableData[i].Requested_Dealer = TableData[i].Requested_Dealer.slice(-5);
				if (TableData[i].Requesting_Dealer == Dealer_No) {
					TableData[i].RequestingDealerVisible = true;
				} else {
					TableData[i].RequestingDealerVisible = false;
				}
				oModel.read("/TradeVehicles", {
					filters: [new sap.ui.model.Filter('Trade_Id', 'EQ', TableData[i].Trade_Id)],
					async: false,
					success: function (oData1, oResponse1) {
						for (var x = 0; x < oData1.results.length; x++) {
							if (TableData[i].Requested_Vtn == oData1.results[x].VTN) {
								TableData[i].Model_Year = oData1.results[x].Model_Year;
								TableData[i].Model = oData1.results[x].Model;
								TableData[i].Series = oData1.results[x].Series;
								TableData[i].Suffix = oData1.results[x].Suffix;
								TableData[i].Colour = oData1.results[x].Int_Colour;
								TableData[i].Ext_Colour = oData1.results[x].Ext_Colour;
								TableData[i].Int_Colour_Desc = oData1.results[0].Int_Colour_Desc;
								TableData[i].APX = oData1.results[x].APX;
								TableData[i].Order_Type = oData1.results[x].Order_Type;
								TableData[i].Status = oData1.results[x].Status;

							} else if (TableData[i].Offered_Vtn == oData1.results[x].VTN) {
								TableData[i].OffredVehicle = {};
								TableData[i].OffredVehicle.Requesting_Dealer = TableData[i].Requesting_Dealer;
								TableData[i].OffredVehicle.Requesting_Dealer_Name = TableData[i].Requesting_Dealer_Name;
								TableData[i].OffredVehicle.Model_Year = oData1.results[x].Model_Year;
								TableData[i].OffredVehicle.Model = oData1.results[x].Model;
								TableData[i].OffredVehicle.Series = oData1.results[x].Series;
								TableData[i].OffredVehicle.Suffix = oData1.results[x].Suffix;
								TableData[i].OffredVehicle.Colour = oData1.results[x].Int_Colour;
								TableData[i].Int_Colour_Desc = oData1.results[0].Int_Colour_Desc;
								TableData[i].OffredVehicle.Ext_Colour = oData1.results[x].Ext_Colour;
								TableData[i].OffredVehicle.APX = oData1.results[x].APX;
								TableData[i].OffredVehicle.Order_Type = oData1.results[x].Order_Type;
								TableData[i].OffredVehicle.Status = oData1.results[x].Status;
							}
						}
					},
					error: function (e1) {}
				});
			}

			for (var i = 0; i < TableData.length; i++) {
				if (TableData[i].Requested_Vtn != "") {
					oModel.read("/TradeVehicleDesc", {
						filters: [new sap.ui.model.Filter([new sap.ui.model.Filter('Trade_Id', 'EQ', TableData[i].Trade_Id),
							new sap.ui.model.Filter('VTN', 'EQ', TableData[i].Requested_Vtn),
							new sap.ui.model.Filter('SPRAS', 'EQ', lang)
						], true)],
						async: false,
						success: function (oData2, oResponse1) {
							if (oData2.results.length > 0){
							TableData[i].Model_Desc = oData2.results[0].Model_Desc;
							TableData[i].Series_Desc = oData2.results[0].Series_Desc;
							TableData[i].Suffix_Desc = oData2.results[0].Suffix_Desc;
							TableData[i].Int_Colour_Desc = oData2.results[0].Int_Colour_Desc;   
							TableData[i].Colour = oData2.results[0].Int_Colour;
							TableData[i].Ext_Colour_Desc = oData2.results[0].Ext_Colour_Desc;
							}
						},
						error: function (e) {

						}
					});
				}
				if (TableData[i].Offered_Vtn != "") {
					oModel.read("/TradeVehicleDesc", {
						filters: [new sap.ui.model.Filter([new sap.ui.model.Filter('Trade_Id', 'EQ', TableData[i].Trade_Id),
							new sap.ui.model.Filter('VTN', 'EQ', TableData[i].Offered_Vtn),
							new sap.ui.model.Filter('SPRAS', 'EQ', lang)
						], true)],
						async: false,
						success: function (oData2, oResponse1) {
								if (oData2.results.length > 0){
							TableData[i].OffredVehicle.Model_Desc = oData2.results[0].Model_Desc;
							TableData[i].OffredVehicle.Series_Desc = oData2.results[0].Series_Desc;
							TableData[i].OffredVehicle.Suffix_Desc = oData2.results[0].Suffix_Desc;
							TableData[i].Int_Colour_Desc = oData2.results[0].Int_Colour_Desc;
							TableData[i].OffredVehicle.Colour = oData2.results[0].Int_Colour;
							TableData[i].OffredVehicle.Ext_Colour_Desc = oData2.results[0].Ext_Colour_Desc;
								}
						},
						error: function (e) {

						}
					});
				}
			}
			var model = new sap.ui.model.json.JSONModel(TableData);
			that.getView().byId("tableVTH").setModel(model);
		 
		},
		ExporttoExcellsheet: function () {

			var Context = this.getView().byId("tableVTH").getBinding("items").getContexts();
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
			var zthat = this;
			var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
			var CSV = "";
			if (ShowLabel) {
				var row = "";
				row = row.slice(0, -1);
			}

			var i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
			var RequestNo = i18n.getText("RequestNo");
			var Status = i18n.getText("Status");
			var From_To = i18n.getText("From_To");
			var Dealer = i18n.getText("Dealer");
			var VehicleTrackingNumber = i18n.getText("VehicleTrackingNumber");
			var Model = i18n.getText("Model");
			var Suffix = i18n.getText("Suffix");
			var APX = i18n.getText("APX");
			var ExteriorColor = i18n.getText("ExteriorColor");
			var Accepted = i18n.getText("Accepted");

			row += RequestNo + ",";
			row += Status + ",";
			row += From_To + ",";
			row += Dealer + ",";
			row += VehicleTrackingNumber + ",";
			row += Model + ",";
			row += Suffix + ",";
			row += APX + ",";
			row += ExteriorColor + ",";
			row += Accepted + ",";

			CSV += row + '\r\n';

			//loop is to extract each row
			for (var i = 0; i < arrData.length; i++) {
				var row = "";

				if (arrData[i].RequestingDealerVisible == true) {
					var RequestingDealerVisible = "To";
					var SelectedDealer = arrData[i].Requested_Dealer;
					var SelectedDealerName = arrData[i].Requested_Dealer_Name;
					var DelearData = SelectedDealer + "-" + SelectedDealerName;

				} else {
					var RequestingDealerVisible = "From";

					var SelectedDealer = arrData[i].Requesting_Dealer;
					var SelectedDealerName = arrData[i].Requesting_Dealer_Name;
					var DelearData = SelectedDealer + "-" + SelectedDealerName;
				}

				arrData[i].Model = arrData[i].Model + "-" + arrData[i].Model_Desc;
				arrData[i].Suffix = arrData[i].Suffix + "-" + arrData[i].Suffix_Desc + "/" + arrData[i].Int_Colour_Desc;
				arrData[i].Ext_Colour = arrData[i].Ext_Colour + "-" + arrData[i].Ext_Colour_Desc;
				/*	arrData[i].zzsuffix = arrData[i].zzsuffix + "-" + arrData[i].suffix_desc_en;*/
				var tstatus;
				switch (arrData[i].Trade_Status) {
				case "A":
					tstatus = "Accepted";
					break;
				case "C":
					tstatus = "Countered";
					break;
				case "X": //Update this
					tstatus = "Canceled";
					break;
				case "R": //Update this
					tstatus = "Rejected";
					break;
				case "S": //Update this
					tstatus = "Sent";
					break;
				case "F": //Update this
					tstatus = "Failed";
					break;

				}
				// var dateformated = this.formatoDate(arrData[i].Changed_on);
				
				// var dateformated = this.TradeSummaryoDateTradeHistory(arrData[i].Changed_on);
				
				var dateAsReceived = moment.tz((arrData[i].Changed_on), "GMT");
				var dateformated = moment(dateAsReceived).format("YYYY-MM-DD");
			 
				
				
				
				row += '="' + arrData[i].Trade_Id + '","' + tstatus + '","' + RequestingDealerVisible +
					'",="' + DelearData + '",="' + arrData[i].Requested_Vtn + '",="' + arrData[i].Model + '","' + arrData[i].Suffix +
					'","' + arrData[i].APX +
					'","' + arrData[i].Ext_Colour + '","' + dateformated + '",';
				//}
				row.slice(1, row.length);
				CSV += row + '\r\n';
			}
			if (CSV == "") {
				/*	alert("Invalid data");*/
				return;
			}
			var fileName = "VehicleTradeHistory";
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
		oTradeHistoryLinkPress: function (oEvent) {

			var that = this;
	
			that.oRecTableSelectObj = oEvent.getSource().getBindingContext().getObject();

			if (that.oRecTableSelectObj != undefined) {

	
				var model = new sap.ui.model.json.JSONModel(that.oRecTableSelectObj);
				model.setSizeLimit(1000);
				sap.ui.getCore().setModel(model, "TradeRequestedHistory");
			
				this.getRouter().navTo("VehcTrad_Apprv_Rej_CounTrad", {
					selectedmyTr: "SelectedFromTradeHistory"
				});
				that.oRecTableSelectObj = undefined;
			} else {
				sap.m.MessageBox.warning("Please select the trade");
				that.oRecTableSelectObj = undefined;
			}

			

		},

		VehicleLocSearchPressVH: function () {
			var that = this;
			that.getRouter().navTo("VehicleLocSearch");
		},
		TradeSummaryLinkPressTH: function () {
			// var that = this;
			// that.getRouter().navTo("VehicleTrade_Summary"){
				
				
			// };
			var that = this;
            that.getRouter().navTo("VehicleTrade_Summary", {
                DataClicked: "Yes"
            });
			
			
			

		},
		BlockSummarypressTH: function () {
			var that = this;
			that.getRouter().navTo("VehicleTrade_ModelBlock_Summary");

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
		formatoDate: function (Created_On) {
			if (Created_On != null && Created_On != "" && Created_On != "/Date(0)/") {
				var zdateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "yyyy-MM-dd"
				});
				return zdateFormat.format(Created_On);

			} else {
				return "";
			}
		},
			handleSortButtonPressed: function () {
			this.createViewSettingsDialog("vehicleLocator.fragment.TradeHistorySortDialog").open();
			
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
			var oTable = this.byId("tableVTH"),
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
 		
 			var sSelectedDealer = oEvent.getParameter("\selectedItem").getProperty("key");
			var sSelectedDealerText = oEvent.getParameter("\selectedItem").getProperty("additionalText");
			var sSelectedText = oEvent.getParameter("\selectedItem").getProperty("text");
 		
 	     	this.theFirstDefaultDealerSelected = sSelectedDealer;
 			this._oViewModel.setProperty("/DealerName", sSelectedDealerText);
 	// call the function to get the relevant data to screen again. 
 	              	this.VehicleHistory_Summary();
 		
 		
 		
 	}

	});

});


