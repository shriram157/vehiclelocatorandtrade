sap.ui.define(function () {
	var Formatter = {
		Status: function (zz_trading_ind) {
			switch (zz_trading_ind) {
			case "1":

				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("StockNonRoutable");
				return sTextFromi18n;
				// return "Stock-Non-Routable";
				break;
			case "2":
				// return "Pipeline – Routable";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("PipelineRoutable");
				return sTextFromi18n;
				break;
			case "3": //Update this
				// return "Pipeline – Routable";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("PipelineRoutable");
				return sTextFromi18n;
				break;

			}

		},
		oTradeStatusBinding: function (Trade_return) {
			switch (Trade_return) {
			case "Yes":
				// return "Yes-Single Vehicle";  
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("YesSingleVehicle");
				return sTextFromi18n;
				break;
			case "No":
				// return "No";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("No");
				return sTextFromi18n;
				break;
			}
		},
		OrderType: function (zzordertype) {
			switch (zzordertype) {
			case "SO":
				// return "STOCK Open";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Stockopen");
				return sTextFromi18n;

				break;
			case "SR":
				// return "STOCK Restricted";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("StockRestricted");
				return sTextFromi18n;
				break;
			case "DM":
				// return "DEMO";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Demo");
				return sTextFromi18n;
				break;
			case "BA":
				// return "BANK ALLOC";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("BankAllocatation");
				return sTextFromi18n;
				break;
			case "LS":
				// return "LAUNCH Stock";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("LaunchStock");
				return sTextFromi18n;
				break;
			case "RS":
				// return "RETAIL SOLD";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("RetailSold");
				return sTextFromi18n;
				break;
			case "F1":
				// return "DLR RAC";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Dlrrac");
				return sTextFromi18n;
				break;
			case "F2":
				// return "DLR ELITE";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("DlrElite");
				return sTextFromi18n;
				break;
			case "F3":
				// return "NAT RAC";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Natrac");
				return sTextFromi18n;
				break;
			case "F4":
				// return "NAT ELITE";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("NatElite");
				return sTextFromi18n;
				break;
			case "F5":
				// return "MOBILITY";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Mobility");
				return sTextFromi18n;
				break;
			case "DNC":
				// return "DNC";
				var sTextFromi18n = "DNC";     //this.getModel("i18n").getResourceBundle().getText("Mobility");
				return sTextFromi18n;
				break;	

			}

		},

		Dealer: function (kunnr) {
			if (kunnr != null) {
				return kunnr.substr(kunnr.length - 5);

			}

		},
		/*	AccessoryInstall: function (z_pd_flag) {
			 if (z_pd_flag == "D") {
					return "Yes";
				}
				else {
					return "No";
				} 

			},*/
		AccessoryInstall: function (non_D_flag, pd_flag) {
			if (pd_flag == "" && non_D_flag == "") {
					var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("No");
				return sTextFromi18n;
				// return "No";
			} else if (pd_flag == "" && non_D_flag == "X") {
					var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("No");
				return sTextFromi18n;
				// return "No";
			} else if (pd_flag == "D" && non_D_flag == "") {
				// return "Yes";
								var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Yes");
				return sTextFromi18n;
			} else if (pd_flag == "D" && non_D_flag == "X") {
				// return "Yes";
								var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Yes");
				return sTextFromi18n;
			}

		},

		DNC: function (DNC) {
			if (DNC == "X") {
				// return "Yes";
								var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Yes");
				return sTextFromi18n;
			} else if (DNC == null || DNC == "N") {
					var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("No");
				return sTextFromi18n;
				// return "No";
			} else if (DNC == "Y") {

				// return "Yes";
								var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Yes");
				return sTextFromi18n;
			}

		},
		DNCBlockout: function (DNC) {
			switch (DNC) {
			case "X":
				return true;
				break;
			case "":
				return false;
				break;
			case "Y":
				return true;
				break;
			case "N":
				return false;
				break;

			}

			/*	if (DNC == "X") {
				return true;
			} else if (DNC == null || DNC =="") {
				return false;
			}
		*/

		},

		TradeSummaryStatus: function (Trade_Status) {
			switch (Trade_Status) {
			case "A":
				// return "Accepted";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Accepted");
				return sTextFromi18n;
				break;
			case "C":
				// return "Countered";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Countered");
				return sTextFromi18n;
				break;
			case "X": //Update this
				// return "Canceled";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Cancelled");
				return sTextFromi18n;
				break;
			case "R": //Update this
				// return "Rejected";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Rejected");
				return sTextFromi18n;
				break;
			case "S": //Update this
				// return "Sent";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Sent");
				return sTextFromi18n;
				break;
			case "F": //Update this
				// return "Failed";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Failed");
				return sTextFromi18n;
				break;

			}

		},
		/*	AddCommnentButton: function (Trade_Status) {
				if (Trade_Status == "C" || Trade_Status == "S") {
					return true;
				} else {
					return false;

				}

			},*/
		TradeReturn: function (Trade_Return) {
			switch (Trade_Return) {
			case "Y":
				// return "Yes-Single Vehicle";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("YesSingleVehicle");
				return sTextFromi18n;
				break;
			case "N":
				// return "No";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("No");
				return sTextFromi18n;
				break;

			}

		},

		TradeSummaryTrdReturn: function (Trade_Return) {
			switch (Trade_Return) {
			case "Y":
				// return "Yes";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("Yes");
				return sTextFromi18n;
				break;
			case "N":
				// return "No";
				var sTextFromi18n = this.getModel("i18n").getResourceBundle().getText("No");
				return sTextFromi18n;
				break;

			}

		},
		TradeSummaryoDealer: function (Requesting_Dealer) {

			if (Requesting_Dealer != null || Requesting_Dealer >= 5) {
				return Requesting_Dealer.substr(Requesting_Dealer.length - 5);

			}

		},

		TradeSummaryoDateTradeHistory: function (Created_On) {
			if (Created_On != null && Created_On != "" && Created_On != "/Date(0)/" && !Created_On.getMonth) {
				var dateTo = Created_On.split("(")[1];
				if (Created_On.indexOf("+") != -1) {
					/*dateTo = dateTo.split("+")[0];*/
					Created_On = new Date(Created_On.split("(")[1].substring(0, 10) * 1000).toDateString().substring(4, 15);
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd"
					});
					return oDateFormat.format(new Date(Created_On));

				} else {
					dateTo = dateTo;
					var dataTo1 = Number(dateTo.replace(/[^A-Z\d\s]/gi, '').replace(/[^0-9\.]+/g, ""));
					 var ValidTo = new Date(dataTo1);
 
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
				return oDateFormat.format(new Date(ValidTo));
 
				}

			} else if (Created_On != null && Created_On.getMonth) {
				
				
				var dateAsReceived = moment.tz(Created_On, "GMT");
				var returnThisDate = moment(dateAsReceived).format('YYYY-MM-DD');
				
				// var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				// 	pattern: "yyyy-MM-dd"
				// });
			
					return returnThisDate;
			} else {
				return "";
			}
		},
		
			TradeSummaryoDate: function (Created_On) {
			if (Created_On != null && Created_On != "" && Created_On != "/Date(0)/" && !Created_On.getMonth) {
				var dateTo = Created_On.split("(")[1];
				if (Created_On.indexOf("+") != -1) {
					/*dateTo = dateTo.split("+")[0];*/
					Created_On = new Date(Created_On.split("(")[1].substring(0, 10) * 1000).toDateString().substring(4, 15);
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd"
					});
					return oDateFormat.format(new Date(Created_On));

				} else {
					dateTo = dateTo;
					var dataTo1 = Number(dateTo.replace(/[^A-Z\d\s]/gi, '').replace(/[^0-9\.]+/g, ""));
					// var ValidTo = new Date(dataTo1);
					var ValidTo = new Date(dataTo1).toUTCString();
					// var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					// 	pattern: "yyyy-MM-dd"
					// });

					var dateAsReceived = moment.tz(ValidTo, "GMT");

					var returnThisDate = moment(dateAsReceived).format('YYYY-MM-DD');

					return returnThisDate;

					// return ValidTo;
					//return oDateFormat.format(new Date(ValidTo));
					// return oDateFormat.format(new Date(ValidTo).toUTCString());
				}

			} else if (Created_On != null && Created_On.getMonth) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
				return oDateFormat.format(Created_On);
			} else {
				return "";
			}
		},
		ProposedEtaToDate: function (Proposed_ETA_To) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd"
			});
			return oDateFormat.format(new Date(Proposed_ETA_To));
		},
		TradeSummaryoDate1: function (Created_On) {
			if (Created_On != null && Created_On != "" && Created_On != "/Date(0)/") {
				var dateTo = Created_On.split("(")[1];
				if (Created_On.indexOf("+") != -1) {
					/*dateTo = dateTo.split("+")[0];*/
					Created_On = new Date(Created_On.split("(")[1].substring(0, 10) * 1000).toDateString().substring(4, 15);
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd"
					});
					return oDateFormat.format(new Date(Created_On));

				} else {
					dateTo = dateTo;
					var dataTo1 = dateTo.substring(0, dateTo.length - 5);
					var ValidTo = new Date(dataTo1 * 1000);
					ValidTo = ValidTo.toGMTString().substring(4, 16);
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd"
					});
					return oDateFormat.format(new Date(ValidTo));
				}

			} else {
				return "";
			}
		},
		VehicleSelectoinEtaFromDate: function (Created_On) {

			if (Created_On != null && Created_On != "") {

				return Created_On.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
			}

		},
		VehicleSelectoinEtaFromDate1: function (Created_On) {

			if (Created_On != null && Created_On != "") {

				return Created_On.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
			}

		},
		DealerNameFormat: function (Dealer) {
			if (Dealer != null || Dealer.length >= 5) {
				return Dealer.substr(Dealer.length - 5);

			}

		}

	};

	return Formatter;
}, true);