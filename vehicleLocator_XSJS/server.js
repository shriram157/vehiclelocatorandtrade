/*eslint no-console: 0, no-unused-vars: 0*/
"use strict";

var xsjs = require("@sap/xsjs");
var xsenv = require("@sap/xsenv");
var port = process.env.PORT || 3000;

var options = {
	redirectUrl: "/index.xsjs"
};

process.env.XS_APP_LOG_LEVEL = 'debug';
process.env.XSODATA_METADATA = 2;
process.env.XSODATA_LOG_SQL_DATA = 2;
process.env.XSODATA_LOG_SQL_DATA_VALUE_SIZE = 20000;
process.env.XSODATA_LOG_SQL_DATA_ARRAY_SIZE = 20000;

// configure HANA
try {
	options = Object.assign(options, xsenv.getServices({
		hana: {
			tag: "hana"
		}
	}));
} catch (err) {
	console.log("[WARN]", err.message);
}

// configure UAA
try {
	options = Object.assign(options, xsenv.getServices({
		uaa: {
			tag: "xsuaa"
		}
	}));
} catch (err) {
	console.log("[WARN]", err.message);
}

// start server
xsjs(options).listen(port);

console.log("Server listening on port %d", port);
