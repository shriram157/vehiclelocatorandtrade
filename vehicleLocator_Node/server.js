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
var jobsc = require("@sap/jobs-client");

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
app.use(hdbext.middleware(hanaOptions.hana));

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
var jobOptions = xsenv.getServices({
	jobs: {
		tag: "jobscheduler"
	}
});
var schedulerOptions = {
	baseURL: jobOptions.jobs.url,
	user: jobOptions.jobs.user,
	password: jobOptions.jobs.password,
	timeout: 15000
};
var scheduler = new jobsc.Scheduler(schedulerOptions);
var thisApp = JSON.parse(process.env.VCAP_APPLICATION);
var thisAppUri = thisApp.application_uris[0];
if (!thisAppUri.startsWith("https://")) {
	thisAppUri = "https://" + thisAppUri;
}
var jobName = "CleanUpTradeRequests";

// Create job only if it doesn't already exists (by name)
scheduler.fetchJob({
	name: jobName
}, function (err, result) {
	if (err) {
		var req = {
			job: {
				name: jobName,
				description: "Runs the trade request clean-up task",
				action: thisAppUri + "/tasks/clean-up-trade-requests",
				active: true,
				httpMethod: "POST",
				schedules: [{
					description: "Runs daily at 11:00 PM",
					cron: "* * * * 23 0 0",
					data: {},
					active: true
				}]
			}
		};
		scheduler.createJob(req, function (err, body) {
			if (err) {
				throw err;
			} else {
				console.info("Scheduled job created successfully.");
			}
		});
	} else {
		console.info("Scheduled job already exists, skipping creation.")
	}
})

//Setup Routes
var router = require('./router')(app, server);

//Start the Server
server.on('request', app);
server.listen(port, function () {
	console.info(`HTTP Server: ${server.address().port}`);
});
