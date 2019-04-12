/*eslint new-cap: 0, no-console: 0, no-shadow: 0, no-unused-vars: 0*/
/*eslint-env es6, node*/

"use strict";

module.exports = function (appContext) {

	var express = require('express');
	var request = require('request');
	var xsenv = require("@sap/xsenv");

	var auth64;

	var app = express.Router();

	// Get UPS name from env var UPS_NAME
	var apimServiceName = process.env.UPS_NAME;
	var options = {};
	options = Object.assign(options, xsenv.getServices({
		api: {
			name: apimServiceName
		}
	}));

	var xsenv = require('@sap/xsenv');

	var uaaService = xsenv.getServices({
		uaa: {
			tag: "xsuaa"
		}
	});

	var xsuaaCredentials = uaaService.uaa;
	if (!xsuaaCredentials) {
		return;
	}

	var uname = options.api.user,
		pwd = options.api.password,
		url = options.api.host,
		APIKey = options.api.APIKey,
		client = options.api.client;

	auth64 = 'Basic ' + new Buffer(uname + ':' + pwd).toString('base64');

	var reqHeader = {
		"Authorization": auth64,
		"Content-Type": "application/json",
		"APIKey": APIKey,
		"x-csrf-token": "Fetch"
	};

	// session information. 
	app.get('/sessioninfo', function (req, res) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		return res.type("text/plain").status(200).send(JSON.stringify(req));
	});


app.get("/currentScopesForUser", (req, res) => {
 		var logger = req.loggingContext.getLogger("/Application/Route/UserDetails/CurrentScopesForUser");
		var tracer = req.loggingContext.getTracer(__filename);

		var parsedData = JSON.stringify(req.authInfo.userAttributes);
		
		var obj_data = JSON.parse(parsedData);
		

     
		let legacyDealerCode;
		try {
			legacyDealerCode = obj_data.DealerCode[0];
			var legacyDealerCodeAvailable = true;
			
		 		logger.info("currentScopes for User Requested");
			logger.info('Dealer code from the SAML Token is %s %s', legacyDealerCodeAvailable, legacyDealerCode);		
			
			
			// req.logMessage("info", Dealer code from the SAML Token is', legacyDealerCodeAvailable, legacyDealerCode)
		} catch (e) {
			logger.info("Dealer Code is blank or is a local testing run");
				// return;
			var legacyDealerCodeAvailable = false;
		}

		var userAttributes = req.authInfo.userAttributes;


		let isItZoneUser;
		try {
			isItZoneUser =  userAttributes.UserType[0];
			if (isItZoneUser == "Zone"){
			var zoneUser = true;	
			} else {
		   	var zoneUser = false;		
			}
			
			logger.info('Dealer code from the SAML Token is a zone User', zoneUser, isItZoneUser);
		} catch (e) {
			logger.info("Not a zone User");
				// return;
			var zoneUser = false;
		}		
		
		

		var scopeData = req.authInfo.scopes;
		var manageVehicles = false;
 
		var viewTradeRequest = false;
		var viewDNC = false;

		var sendUserData = {
			"loggedUserType": []
		};


	var SCOPE = xsuaaCredentials.xsappname ;
          console.log ('The app name', SCOPE);

		for (var i = 0; i < scopeData.length; i++) {
			

			if (scopeData[i] ==  xsuaaCredentials.xsappname + '.Manage_Trade_Request') {
				var userType = "vehicelTradeDealerUser";
				sendUserData.loggedUserType.push(userType);

				return res.type("text/plain").status(200).send(JSON.stringify(sendUserData));
				// break;
			}

			if (scopeData[i] == xsuaaCredentials.xsappname + '.Manage_Vehicles') {
				manageVehicles = true;
				   
			}
			if (scopeData[i] == xsuaaCredentials.xsappname + '.View_Trade_Request') {
				viewTradeRequest = true;
			}
			if (scopeData[i] == xsuaaCredentials.xsappname + '.View_DNC') {
				viewDNC = true;
			}
 

		} // enf for for loop. 

		logger.info('manageVehicles: %s', manageVehicles);
		logger.info('viewTradeRequest: %s', viewTradeRequest);
		logger.info('viewDNC: %s', viewDNC);
 

		if (manageVehicles == true && viewTradeRequest == true && viewDNC == true && zoneUser == false ) {
			// this is an internal TCI User

			var userType = "internalTCIUser";
			sendUserData.loggedUserType.push(userType);

			return res.type("text/plain").status(200).send(JSON.stringify(sendUserData));

		}

		if (manageVehicles == true && viewTradeRequest == true && viewDNC == true && zoneUser == true ) {
			// this is an internal TCI User

			var userType = "ZoneUser";
			sendUserData.loggedUserType.push(userType);

			return res.type("text/plain").status(200).send(JSON.stringify(sendUserData));

		}

 
	});

	app.get("/currentScopesForUserLocaltesting", (req, res) => {

		var sendUserData = {
			"loggedUserType": []
		};

		var userType = "ZoneUser";
		sendUserData.loggedUserType.push(userType);

		return res.type("text/plain").status(200).send(JSON.stringify(sendUserData));

	});

	//the below route for local testing. 

	app.get("/attributesforlocaltesting", (req, res) => {

		var receivedData = {};

		var sendToUi = {
			"attributes": [],
			"samlAttributes": [],
			legacyDealer: "",
			legacyDealerName: ""

		};

		// ===================only for local testing - remove next deploy
		var obj_temp = {
			Language: ['English', 'English'],
			UserType: ['National', 'National'],
			DealerCode: ['42120', '42120'],
			FirstName: ['firstName'],
			LastName: ['LastName']
		};
		
	// The below for Zone User	
		// var obj_temp = {	
		// FirstName: ["Vehicle Locator Trade"],
		// Language: ["English"],
		// LastName: ["Zone Pacific"],
		// UserType: ["Zone"],
		// Zone: ["1"]
		// };				
		
		
		
		
		
		// req.logMessage("info", req.authInfo.userAttributes);
		var parsedData = JSON.stringify(obj_temp);
		//		 req.logMessage("info", 'After Json Stringify', parsedData);
		var obj_parsed = JSON.parse(parsedData);
		sendToUi.samlAttributes.push(obj_parsed);

		// =========================================

		//	var parsedData = JSON.stringify(req.authInfo.userAttributes);

		//	var obj = JSON.stringify(req.authInfo.userAttributes);
		//		var obj_parsed = JSON.parse(obj);
		var csrfToken;
		var obj_data = JSON.parse(parsedData);
		var csrfToken;
		var samlData = parsedData;

		//	req.logMessage("info", 'saml data', samlData);

		//		req.logMessage("info", 'send to ui data', sendToUi);

		let checkSAMLDetails;
		try {
			checkSAMLDetails = obj_data.DealerCode[0];
		} catch (e) {

			// return;
			var nosamlData = true;
		}
		sendToUi.samlAttributes.push(obj_parsed);

		var userType = obj_data.UserType[0];

		if (userType == 'Dealer') {
			var legacyDealer = obj_data.DealerCode[0];
		}

		//	if  usertype eq dealer then just get the details for that dealer,  otherwise get everything else

		if (userType == 'Dealer') {

			var url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner/?$format=json&$filter=SearchTerm2 eq'" + legacyDealer +
				"' &$expand=to_Customer&$format=json&?sap-client=" + client;

		} else {

			var url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner/?$format=json&$expand=to_Customer&?sap-client=" + client +
				"&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004' or BusinessPartnerType eq 'Z005') and zstatus ne 'X' &$orderby=BusinessPartner asc";

		}

		request({
			url: url + url1,
			headers: reqHeader

		}, function (error, response, body) {

			var attributeFromSAP;
			if (!error && response.statusCode == 200) {
				csrfToken = response.headers['x-csrf-token'];

				var json = JSON.parse(body);
				// req.logMessage("info", json);  // // TODO: delete it Guna

				for (var i = 0; i < json.d.results.length; i++) {

					receivedData = {};

					var BpLength = json.d.results[i].BusinessPartner.length;
					receivedData.BusinessPartnerName = json.d.results[i].OrganizationBPName1;
					receivedData.BusinessPartnerKey = json.d.results[i].BusinessPartner;
					receivedData.BusinessPartner = json.d.results[i].BusinessPartner.substring(5, BpLength);
					receivedData.BusinessPartnerType = json.d.results[i].BusinessPartnerType;
					receivedData.SearchTerm2 = json.d.results[i].SearchTerm2;

					let attributeFromSAP;
					try {
						attributeFromSAP = json.d.results[i].to_Customer.Attribute1;
					} catch (e) {

						// return;
					}

					switch (attributeFromSAP) {
					case "01":
						receivedData.Division = "10";
						receivedData.Attribute = "01";
						break;
					case "02":
						receivedData.Division = "20";
						receivedData.Attribute = "02";
						break;
					case "03":
						receivedData.Division = "Dual";
						receivedData.Attribute = "03";
						break;
					case "04":
						receivedData.Division = "10";
						receivedData.Attribute = "04";
						break;
					case "05":
						receivedData.Division = "Dual";
						receivedData.Attribute = "05";
						break;
					default:
						receivedData.Division = "10"; //  lets put that as a toyota dealer
						receivedData.Attribute = "01";

					}

					if ((receivedData.BusinessPartner == legacyDealer || receivedData.SearchTerm2 == legacyDealer) && (userType == 'Dealer')) {
						sendToUi.legacyDealer = receivedData.BusinessPartner,
							sendToUi.legacyDealerName = receivedData.BusinessPartnerName;
						sendToUi.attributes.push(receivedData);
						break;
					}

					if (userType == 'Dealer') {
						continue;
					} else {
						sendToUi.attributes.push(receivedData);
					}
				}

				res.type("application/json").status(200).send(sendToUi);

			} else {

				var result = JSON.stringify(body);
				res.type('application/json').status(400).send(result);
			}
		});

	});

app.get("/attributes", (req, res) => {
 		var logger = req.loggingContext.getLogger("/Application/Route/UserDetails/Attributes");
		var tracer = req.loggingContext.getTracer(__filename);
		logger.info("attributes fetch started");

		var receivedData = {};

		var sendToUi = {
			"attributes": [],
			"samlAttributes": [],
			legacyDealer: "",
			legacyDealerName: ""

		};

		logger.info(req.authInfo.userAttributes);
		var parsedData = JSON.stringify(req.authInfo.userAttributes);
		logger.info('After Json Stringify: %s', parsedData);

		var obj = JSON.stringify(req.authInfo.userAttributes);
		var obj_parsed = JSON.parse(obj);
		var csrfToken;
		var obj_data = JSON.parse(parsedData);
		var csrfToken;
		var samlData = parsedData;

		logger.info('saml data: %s', samlData);

		logger.info('send to ui data: %s', sendToUi);

		let checkSAMLDetails;
		try {
			checkSAMLDetails = obj_data.DealerCode[0];
		} catch (e) {
			logger.info("Dealer Code is blank or is a local testing run");
				// return;
			var nosamlData = true;
		}

		sendToUi.samlAttributes.push(obj_parsed);

		var userAttributes = req.authInfo.userAttributes;

		var userType = userAttributes.UserType[0];

		logger.info('after json Parse: %s', obj_data);
		//	var userType = obj_data.UserType[0];

		if (userType == 'Dealer') {
			var legacyDealer = obj_data.DealerCode[0];
		}

		if (userType == 'Zone') {
			var tempUSerType = 'Zone';
			//var zoneToWhichUSerBelongs = samlData.Zone[0];
			var zoneToWhichUSerBelongs = userAttributes.Zone[0];
		}

		logger.info('Dealer Number logged in and accessed parts Availability App: %s', legacyDealer);

		//	if  usertype eq dealer then just get the details for that dealer,  otherwise get everything else

		if (userType == 'Dealer') {

			var url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner/?$format=json&$filter=SearchTerm2 eq'" + legacyDealer +
				"' &$expand=to_Customer&$format=json&?sap-client=" + client;

		} else {
			logger.info('Logged in User Type outside: %s', userType);
			if (tempUSerType == 'Zone') {

				// he is a zone user.            	
				var userZone;
				switch (zoneToWhichUSerBelongs) {
				case "1":
					userZone = "1000";
					break;
				case "2":
					userZone = "2000";
					break;
				case "3":
					userZone = "3000";
					break;
				case "4":
					userZone = "5000";
					break;
				case "5":
					userZone = "4000";
					break;
				case "7":
					userZone = "9000";
					break;

				default:

				}

				logger.info('Logged in User Zone before the API Url: %s', userZone);

				url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner?sap-client=" + client + "&$format=json" +
					"&$expand=to_Customer/to_CustomerSalesArea&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004' or BusinessPartnerType eq 'Z005') and zstatus ne 'X'" +
					"&$orderby=BusinessPartner asc";

				// var url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner/?$format=json&$expand=to_Customer&?sap-client=" + client +
				// 	"&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004' or BusinessPartnerType eq 'Z005') and zstatus ne 'X' &$orderby=BusinessPartner asc";

			} else {

				logger.info('Logged in User just before internal user call: %s', userType);

				var url1 = "/API_BUSINESS_PARTNER/A_BusinessPartner/?$format=json&$expand=to_Customer&?sap-client=" + client +
					"&$filter=(BusinessPartnerType eq 'Z001' or BusinessPartnerType eq 'Z004' or BusinessPartnerType eq 'Z005') and zstatus ne 'X' &$orderby=BusinessPartner asc";
			}
		}
		logger.info('Final url being fetched: %s', url + url1);
		request({
			url: url + url1,
			headers: reqHeader

		}, function (error, response, body) {

			var attributeFromSAP;
			if (!error && response.statusCode == 200) {
				csrfToken = response.headers['x-csrf-token'];

				var json = JSON.parse(body);
	
				for (var i = 0; i < json.d.results.length; i++) {


					if (userType != 'Dealer') {
						if (json.d.results[i].to_Customer) {
							if (json.d.results[i].to_Customer.to_CustomerSalesArea.results) {
								var salesOfficeFromSAP;
							try {
								 salesOfficeFromSAP = json.d.results[i].to_Customer.to_CustomerSalesArea.results[0].SalesOffice;
							} catch (e) {
								logger.info("Sales Office is Blank");
									// return;
							 
							}

								// var salesOfficeFromSAP = json.d.results[i].to_Customer.to_CustomerSalesArea.results[0].SalesOffice;
							}
						} else {

							continue;

						}
					}

					if ((userType == 'Zone') && (salesOfficeFromSAP != userZone)) {

						continue;
					} else {

						receivedData = {};

						var BpLength = json.d.results[i].BusinessPartner.length;
						receivedData.BusinessPartnerName = json.d.results[i].OrganizationBPName1;
						receivedData.BusinessPartnerKey = json.d.results[i].BusinessPartner;
						receivedData.BusinessPartner = json.d.results[i].BusinessPartner.substring(5, BpLength);
						receivedData.BusinessPartnerType = json.d.results[i].BusinessPartnerType;
						receivedData.SearchTerm2 = json.d.results[i].SearchTerm2;

						let attributeFromSAP;
						try {
							attributeFromSAP = json.d.results[i].to_Customer.Attribute1;
						} catch (e) {
							logger.info("The Data is sent without Attribute value for the BP: %s", json.d.results[i].BusinessPartner);
								// return;
						}

						switch (attributeFromSAP) {
						case "01":
							receivedData.Division = "10";
							receivedData.Attribute = "01";
							break;
						case "02":
							receivedData.Division = "20";
							receivedData.Attribute = "02";
							break;
						case "03":
							receivedData.Division = "Dual";
							receivedData.Attribute = "03";
							break;
						case "04":
							receivedData.Division = "10";
							receivedData.Attribute = "04";
							break;
						case "05":
							receivedData.Division = "Dual";
							receivedData.Attribute = "05";
							break;
						default:
							receivedData.Division = "10"; //  lets put that as a toyota dealer
							receivedData.Attribute = "01";

						}

						if ((receivedData.BusinessPartner == legacyDealer || receivedData.SearchTerm2 == legacyDealer) && (userType == 'Dealer')) {
							sendToUi.legacyDealer = receivedData.BusinessPartner,
								sendToUi.legacyDealerName = receivedData.BusinessPartnerName;
							sendToUi.attributes.push(receivedData);
							break;
						}

						if (userType == 'Dealer') {
							continue;
						} else {
							sendToUi.attributes.push(receivedData);
						}
					}
				}
				res.type("application/json").status(200).send(sendToUi);
				logger.info('Results sent successfully');
			} else {

				var result = JSON.stringify(body);
				res.type('application/json').status(400).send(result);
			}
		});

	});

	return app;
};