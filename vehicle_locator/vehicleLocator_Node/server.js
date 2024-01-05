/*eslint new-cap: 0, no-console: 0, no-shadow: 0, no-unused-vars: 0*/
/*eslint-env es6, node*/

"use strict";

var cors = require("cors");
var CronJob = require("cron").CronJob;
var express = require("express");
var hdbext = require("@sap/hdbext");
var https = require("https");
var logging = require("@sap/logging");
var passport = require("passport");
var tradeReqCleanUpTask = require("./core/trade-req-cleanup-task");
var xsenv = require("@sap/xsenv");
var xssec = require("@sap/xssec");

var server = require("http").createServer();
var port = process.env.PORT || 3000;

// Initialize Express app and set up middleware
var app = express();

// Logging
var appContext = logging.createAppContext();
app.use(logging.middleware({
	appContext: appContext,
	logNetwork: process.env.XS_LOG_NETWORK === "true"
}));
var logger = appContext.createLogContext().getLogger("/Application/Server");

// HANA
// HANA must be set up before passport, otherwise you get an error about session variable
var hanaOptions = xsenv.getServices({
	hana: {
		tag: "hana"
	}
});
var hdbPool = hdbext.getPool(hanaOptions.hana);

// XSUAA
passport.use("JWT", new xssec.JWTStrategy(xsenv.getServices({
	uaa: {
		tag: "xsuaa"
	}
}).uaa));
app.use(passport.initialize());
app.use(passport.authenticate("JWT", {
	session: false
}));

// CORS
app.use(cors());

// Scheduler
var tradeReqCleanUpTaskCronTime = process.env.TRADE_REQ_CLEANUP_TASK_CRON_TIME || "0 59 23 * * *";
var tradeReqCleanUpTaskTimeZone = process.env.TRADE_REQ_CLEANUP_TASK_TIME_ZONE || "America/Toronto";
var job = new CronJob(tradeReqCleanUpTaskCronTime, function () {
	hdbPool.acquire(function (err, client) {
		if (err) {
			logger.error(err.toString());
			return;
		}
		tradeReqCleanUpTask.run(client, appContext).then(() => {
			logger.info("[TRADE_REQ_CLEANUP_TASK] Task ran successfully.");
			hdbPool.release(client);
		}).catch(err => {
			logger.error("[TRADE_REQ_CLEANUP_TASK] Task FAILED: " + err.message);
			hdbPool.release(client);
		});
	});
}, null, true, tradeReqCleanUpTaskTimeZone);

// Router
var router = require("./router")(app, appContext);

// Start server
server.on("request", app);
server.listen(port, function () {
	logger.info("Server is listening on port %d", port);
});