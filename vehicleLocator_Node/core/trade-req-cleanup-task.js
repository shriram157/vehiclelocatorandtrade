/*eslint no-console: 0, no-shadow: 0, new-cap: 0, quotes: 0*/
"use strict";

var moment = require("moment");

function run(client, appContext) {
	var logger = appContext.createLogContext().getLogger("/Application/Core/TradeReqCleanupTask");
	var tracer = appContext.createLogContext().getTracer(__filename);
	return new Promise((resolve, reject) => {
		var today = moment(new Date()).format("YYYY-MM-DD");
		var selectSql = "SELECT \"Trade_Id\", \"Requested_Dealer\", \"Requested_Vtn\" FROM " +
			"\"vehicleTrade.Trade_Request\" WHERE \"Trade_Status\" = 'A' AND \"Changed_on\" = ?";
		client.prepare(selectSql, function (err, selectStmt) {
			if (err) {
				reject(new Error(err.toString()));
				return;
			}
			selectStmt.exec([today], function (err, selectResults) {
				if (err) {
					reject(new Error(err.toString()));
					return;
				}
				if (selectResults.length == 0) {
					logger.info("[TRADE_REQ_CLEANUP_TASK] No trade requests accepted today found.");
					resolve();
					return;
				}
				var updateSql = "UPDATE \"vehicleTrade.Trade_Request\" SET \"Trade_Status\" = 'R', \"Changed_on\" = ?" +
					" WHERE \"Requested_Dealer\" = ? AND \"Requested_Vtn\" = ?";
				client.prepare(updateSql, function (err, updateStmt) {
					if (err) {
						reject(new Error(err.toString()));
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
								return;
							});
						}));
					}
					Promise.all(updatePromises).then(() => {
						logger.info("[TRADE_REQ_CLEANUP_TASK] Cleaned up stale trade requests.");
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