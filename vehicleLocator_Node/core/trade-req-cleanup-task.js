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
				tracer.error("ERROR preparing SQL statement [ %s ] with error [ %s ].", selectSql, err.toString());
				reject(new Error(err.toString()));
				return;
			}
			var selectStmtParams = [today];
			selectStmt.exec(selectStmtParams, function (err, selectResults) {
				if (err) {
					tracer.error("ERROR executing SQL statement [ %s ] with parameters [ %s ] and error [ %s ].", selectSql, JSON.stringify(
						selectStmtParams), err.toString());
					reject(new Error(err.toString()));
					return;
				}
				if (selectResults.length == 0) {
					logger.info("[TRADE_REQ_CLEANUP_TASK] No trade requests accepted today found.");
					resolve();
					return;
				}
				var updateSql = "UPDATE \"vehicleTrade.Trade_Request\" SET \"Trade_Status\" = 'R', \"Changed_on\" = ?" +
					" WHERE \"Requested_Dealer\" = ? AND \"Requested_Vtn\" = ? AND \"Trade_Status\" NOT IN ('A', 'R')";
				client.prepare(updateSql, function (err, updateStmt) {
					if (err) {
						tracer.error("ERROR preparing SQL statement [ %s ] with error [ %s ].", updateSql, err.toString());
						reject(new Error(err.toString()));
						return;
					}

					let updatePromises = [];
					for (let i = 0; i < selectResults.length; i++) {
						updatePromises.push(new Promise((resolve, reject) => {
							var selectResult = selectResults[i];
							var updateStmtParams = [today, selectResult.Requested_Dealer, selectResult.Requested_Vtn];
							updateStmt.exec(updateStmtParams, function (err, updateResults) {
								if (err) {
									tracer.error("ERROR executing SQL statement [ %s ] with parameters [ %s ] and error [ %s ].", updateSql, JSON.stringify(
										updateStmtParams), err.toString());
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