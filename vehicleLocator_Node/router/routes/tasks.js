/*eslint no-console: 0, no-shadow: 0, new-cap: 0, quotes: 0*/
"use strict";

var express = require("express");
var moment = require("moment");

module.exports = function () {

	var app = express.Router();

	app.post("/clean-up-trade-requests", function (req, res) {
		// Disable cache and keep-alive in response header
		res.set({
			"Cache-Control": "no-cache, no-store, must-revalidate",
			"Expires": "0",
			"Pragma": "no-cache",
			"Connection": "close"
		});
		if (req.authInfo.checkScope("$XSAPPNAME.JobScheduler")) {
			var today = moment(new Date()).format("YYYY-MM-DD");
			var client = req.db;
			var selectSql = "SELECT \"Trade_Id\", \"Requested_Dealer\", \"Requested_Vtn\" FROM " +
				"\"vehicleTrade.Trade_Request\" WHERE \"Trade_Status\" = 'A' AND \"Changed_on\" = ?";
			client.prepare(selectSql, function (err, selectStmt) {
				if (err) {
					res.type("application/json").status(500).json({
						message: err.toString()
					});
					return;
				}
				selectStmt.exec([today], function (err, selectResults) {
					if (err) {
						res.type("application/json").status(500).json({
							message: err.toString()
						});
						return;
					}
					if (selectResults.length == 0) {
						res.type("application/json").status(200).json({
							message: "No trade requests accepted today found."
						});
						return;
					}
					var updateSql = "UPDATE \"vehicleTrade.Trade_Request\" SET \"Trade_Status\" = 'R', \"Changed_on\" = ?" +
						" WHERE \"Requested_Dealer\" = ? AND \"Requested_Vtn\" = ?";
					client.prepare(updateSql, function (err, updateStmt) {
						if (err) {
							res.type("application/json").status(500).json({
								message: err.toString()
							});
							return;
						}

		  			let updatePromises = [];
		  			for (let i = 0; i < selectResults.length; i++) {
			  			updatePromises.push(new Promise((resolve, reject) => {
				  			var selectResult = selectResults[i];
							  updateStmt.exec([today, selectResult.Requested_Dealer, selectResult.Requested_Vtn], function (err, updateResults) {
									if (err) {
										reject(new Error(err.toString()));
									}
									resolve();
								});
						}));
					}
					Promise.all(updatePromises).then(() => {
						res.type("application/json").status(200).json({
							message: "Cleaned up stale trade requests."
						});
					}).catch(err => {
						res.type("application/json").status(500).json({
							message: err.message
						});
					});
				});
			});
		});
		} else {
			res.type("application/json").status(403).send();
		}
	});
	return app;
};