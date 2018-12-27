function initModel() {
	var sUrl = "/xsodata/vehicleTrade_SRV.xsodata/$metadata/vehicleTrade/xsodata/
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}