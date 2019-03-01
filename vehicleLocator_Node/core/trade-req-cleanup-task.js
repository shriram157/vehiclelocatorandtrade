/*eslint no-console: 0, no-shadow: 0, new-cap: 0, quotes: 0*/
"use strict";

var moment = require("moment");

function run(client, log) {
	return new Promise((resolve, reject) => {
		var today = moment(new Date()).format("YYYY-MM-DD");
		var selectSql = "SELECT \"Trade_Id\", \"Requested_Dealer\", \"Requested_Vtn\" FROM " +
			"\"vehicleTrade.Trade_Request\" WHERE \"Trade_Status\" = 'A' AND \"Changed_on\" = ?";
		client.prepare(selectSql, function (err, selectStmt) {
			if (err) {
				log.logMessage("debug", "[TRADE_REQ_CLEANUP_TASK] FAILED at client.prepare() for SELECT with error: %s", err.toString());
				reject(new Error(err.toString()));
				return;
			}
			log.logMessage("debug", "[TRADE_REQ_CLEANUP_TASK] Running SELECT statement [ %s ] with parameters [ %s ]", selectSql, today);
			selectStmt.exec([today], function (err, selectResults) {
				if (err) {
					log.logMessage("debug", "[TRADE_REQ_CLEANUP_TASK] FAILED at executing query with error: %s", err.toString());
					reject(new Error(err.toString()));
					return;
				}
				if (selectResults.length == 0) {
					log.logMessage("info", "[TRADE_REQ_CLEANUP_TASK] No trade requests accepted today found.");
					resolve();
					return;
				}
				log.logMessage("debug", "[TRADE_REQ_CLEANUP_TASK] There are %i trade requests to be processed.", selectResults.length);
				var updateSql = "UPDATE \"vehicleTrade.Trade_Request\" SET \"Trade_Status\" = 'R', \"Changed_on\" = ?" +
					" WHERE \"Requested_Dealer\" = ? AND \"Requested_Vtn\" = ? AND \"Trade_Status\" <> 'A'";
				client.prepare(updateSql, function (err, updateStmt) {
					if (err) {
						log.logMessage("debug", "[TRADE_REQ_CLEANUP_TASK] FAILED at client.prepare() for UPDATE with error: %s", err.toString());
						reject(new Error(err.toString()));
						return;
					}

					let updatePromises = [];
					for (let i = 0; i < selectResults.length; i++) {
						updatePromises.push(new Promise((resolve, reject) => {
							var selectResult = selectResults[i];
							log.logMessage("debug", "[TRADE_REQ_CLEANUP_TASK] Running UPDATE statement [ %s ] with parameters [ %s, %s, %s ]",
								updateSql, today, selectResult.Requested_Dealer, selectResult.Requested_Vtn);
							updateStmt.exec([today, selectResult.Requested_Dealer, selectResult.Requested_Vtn], function (err, updateResults) {
								if (err) {
									log.logMessage("debug", "[TRADE_REQ_CLEANUP_TASK] FAILED at executing query with error: %s", err.toString());
									reject(new Error(err.toString()));
								}
								resolve();
								return;
							});
						}));
					}
					Promise.all(updatePromises).then(() => {
						log.logMessage("info", "[TRADE_REQ_CLEANUP_TASK] Cleaned up stale trade requests.");
						resolve();
						return;
					}).catch(err => {
						reject(err);
						return;
					});
				});
			});
		});
	});
}

module.exports.run = run;