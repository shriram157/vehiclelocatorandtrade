/*eslint no-console: 0, no-unused-vars: 0, no-undef:0*/
/*eslint-env node, es6 */
//  =================== vehicle Locator Node Server============================= //
'use strict';
var https = require('https');
var port = process.env.PORT || 3000;
var xsenv = require('@sap/xsenv');
var server = require('http').createServer();
// https.globalAgent.options.ca = xsenv.loadCertificates();
global.__base = __dirname + '/';

//Initialize Express App for XSA UAA and HDBEXT Middleware
var passport = require('passport');
var hdbext = require("@sap/hdbext");
var express = require('express');
var schedule = require("node-schedule");

//logging
var logging = require('@sap/logging');
var appContext = logging.createAppContext();

//Initialize Express App for XS UAA and HDBEXT Middleware
var app = express();

app.use(logging.expressMiddleware(appContext));

// =======================================For Authorizations and JWT use======================= BEGIN

// Libraries that you require to set up authorization.

// HANA must be set up before passport, otherwise you get an error about session variable
var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});
var hdbPool = hdbext.getPool(hanaOptions.hana);

var JWTStrategy = require('@sap/xssec').JWTStrategy;
var services = xsenv.getServices({
	uaa: {
		tag: "xsuaa"
	}
});
passport.use(new JWTStrategy(services.uaa));
app.use(passport.initialize());
app.use(passport.authenticate('JWT', {
	session: false
}));

// =======================================For Authorizations and JWT use=======================END

// Initialize scheduler job
var tradeReqCleanUpTaskSchSpec = process.env.TRADE_REQ_CLEANUP_TASK_SCH || "0 0 * * *";
var tradeReqCleanUpTask = require("./core/trade-req-cleanup-task");
var job = schedule.scheduleJob(tradeReqCleanUpTaskSchSpec, function () {
	hdbPool.acquire(function (err, client) {
		if (err) {
			console.error(err.toString());
			return;
		}
		tradeReqCleanUpTask.run(client).then(() => {
			console.log("Trade request clean-up task ran successfully.");
			hdbPool.release(client);
		}).catch(err => {
			console.error("Trade request clean-up task FAILED: " + err.message);
			hdbPool.release(client);
		});
	});
});

//Setup Routes
var router = require('./router')(app, server);

//Start the Server
server.on('request', app);
server.listen(port, function () {
	console.info(`HTTP Server: ${server.address().port}`);
});
