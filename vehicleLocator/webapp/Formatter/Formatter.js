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
			case "3": //Update this
				return "Pipeline – non-Routable";
				break;

			}

		},
		Dealer: function (kunnr) {
			if (kunnr != null) {
				return kunnr.substr(kunnr.length - 5);

			}

		},
		AccessoryInstall: function(z_pd_flag)
		{
			if(z_pd_flag==false){
				return "No";
			}
			else if(z_pd_flag==true){
				return "Yes";
			}
			
		}
	};
	return Formatter;
}, true);