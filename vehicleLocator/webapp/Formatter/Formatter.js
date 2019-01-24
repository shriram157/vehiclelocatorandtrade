sap.ui.define(function () {
	var Formatter = {
		Status: function (zz_trading_ind) {
			switch (zz_trading_ind) {
			case "1":
				return "Pipeline - Routable";
				break;
			case "2":
				return "Pipeline – non-Routable";
				break;
		/*	case "3": //Update this
				return "Pipeline – non-Routable";
				break;
*/
			}

		},

		OrderType: function (zzordertype) {
			switch (zzordertype) {
			case "SO":
				return "STOCK Open";
				break;
			case "SR":
				return "STOCK Restricted";
				break;
			case "DM":
				return "DEMO";
				break;
			case "BA":
				return "BANK ALLOC";
				break;
			case "LS":
				return "LAUNCH Stock";
				break;
			case "RS":
				return "RETAIL SOLD";
				break;
			case "F1":
				return "DLR RAC";
				break;
			case "F2":
				return "DLR ELITE";
				break;
			case "F3":
				return "NAT RAC";
				break;
			case "F4":
				return "NAT ELITE";
				break;
			case "F5":
				return "MOBILITY";
				break;

			}

		},

		Dealer: function (kunnr) {
			if (kunnr != null) {
				return kunnr.substr(kunnr.length - 5);

			}

		},
		AccessoryInstall: function (z_pd_flag) {
			if (z_pd_flag == false) {
				return "No";
			} else if (z_pd_flag == true) {
				return "Yes";
			}

		},

		DNC: function (DNC) {
			if (DNC == "X") {
				return "Yes";
			} else if (DNC == null || DNC == "N") {
				return "No";
			} else if (DNC == "Y") {

				return "Yes";
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
				return "Accepted";
				break;
			case "C":
				return "Countered";
				break;
			case "X": //Update this
				return "Canceled";
				break;
			case "R": //Update this
				return "Rejected";
				break;
			case "S": //Update this
				return "Sent";
				break;
			case "F": //Update this
				return "Failed";
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
				return "Yes-Single Vehicle";
				break;
			case "N":
				return "No-Single Vehicle";
				break;

			}

		},

		TradeSummaryTrdReturn: function (Trade_Return) {
			switch (Trade_Return) {
			case "Y":
				return "Yes";
				break;
			case "N":
				return "No";
				break;

			}

		},
		TradeSummaryoDealer: function (Requesting_Dealer) {

			if (Requesting_Dealer != null || Requesting_Dealer >= 5) {
				return Requesting_Dealer.substr(Requesting_Dealer.length - 5);

			}

		},

		TradeSummaryoDate: function (Created_On) {
			if (Created_On != null && Created_On != "") {
				var dateTo = Created_On.split("(")[1];
				if (Created_On.includes("+") == true) {
					/*dateTo = dateTo.split("+")[0];*/
					Created_On =  new Date(Created_On.split("(")[1].substring(0,10) * 1000).toDateString().substring(4,15);
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "MM/dd/yyyy"
				});
				return oDateFormat.format(new Date(Created_On));
					
				} else {
					dateTo = dateTo;
				var dataTo1 = dateTo.substring(0, dateTo.length - 5);
				var ValidTo = new Date(dataTo1 * 1000);
				ValidTo = ValidTo.toGMTString().substring(4, 16);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "MM/dd/yyyy"
				});
				return oDateFormat.format(new Date(ValidTo));
				}
			
			}
		},
			TradeSummaryoDate1: function (Created_On) {
			if (Created_On != null && Created_On != "") {
				var dateTo = Created_On.split("(")[1];
				if (Created_On.includes("+") == true) {
					/*dateTo = dateTo.split("+")[0];*/
					Created_On =  new Date(Created_On.split("(")[1].substring(0,10) * 1000).toDateString().substring(4,15);
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
			
			}
		},
		VehicleSelectoinEtaFromDate: function (Created_On) {

			if (Created_On != null && Created_On != "") {
				
			return	Created_On.replace(/(\d{4})(\d{2})(\d{2})/g, '$2/$3/$1');
			}

		},
	VehicleSelectoinEtaFromDate1: function (Created_On) {

			if (Created_On != null && Created_On != "") {
				
			return	Created_On.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
			}

		},

	};


	return Formatter;
}, true);