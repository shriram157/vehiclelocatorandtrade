/*eslint new-cap: 0, no-console: 0, no-shadow: 0, no-unused-vars: 0*/
/*eslint-env es6, node*/

"use strict";

var apiProxy = require("./routes/api-proxy");
var userDetails = require("./routes/user-details");

module.exports = (app, log) => {
	app.use("/node", apiProxy(log));
	app.use("/userDetails", userDetails(log));
};
