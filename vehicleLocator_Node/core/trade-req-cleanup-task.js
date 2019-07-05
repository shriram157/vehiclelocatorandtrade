/*eslint no-console: 0, no-shadow: 0, new-cap: 0, quotes: 0*/
"use strict";

var moment = require("moment-timezone");

function run(client, appContext) {
	var logger = appContext.createLogContext().getLogger("/Application/Core/TradeReqCleanupTask");
	var tracer = appContext.createLogContext().getTracer(__filename);
	return new Promise((resolve, reject) => {
		var timeZone = process.env.TRADE_REQ_CLEANUP_TASK_TIME_ZONE || "America/Toronto";
		var today = moment.tz(new Date(), timeZone).format("YYYY-MM-DD");
		var selectSql = "SELECT \"Trade_Id\", \"Requested_Dealer\", \"Requested_Vtn\", \"Requesting_Dealer\", " +
			"\"Offered_Vtn\" FROM \"vehicleTrade.Trade_Request\" WHERE \"Trade_Status\" = 'A' AND \"Changed_on\" = ?";
		client.prepare(selectSql, function (err, selectStmt) {
			if (err) {
				tracer.error("ERROR preparing SQL statement [ %s ] with error [ %s ].", selectSql, err.toString());
				reject(new Error(err.toString()));
				return;
			}
			var selectStmtParams = [today];
			tracer.debug("Executing SQL statement [ %s ] with parameters [ %s ].", selectSql, JSON.stringify(selectStmtParams));
			selectStmt.exec(selectStmtParams, function (err, selectResults) {
				if (err) {
					tracer.error("ERROR executing SQL statement [ %s ] with parameters [ %s ] and error [ %s ].", selectSql, JSON.stringify(
						selectStmtParams), err.toString());
					reject(new Error(err.toString()));
					return;
				}
				if (selectResults.length === 0) {
					logger.info("[TRADE_REQ_CLEANUP_TASK] No trade requests accepted today found.");
					resolve();
					return;
				} else {
					logger.info("[TRADE_REQ_CLEANUP_TASK] Found %s trade requests accepted today to be cleaned up for.", selectResults.length);
				}
				var updateSql = "UPDATE \"vehicleTrade.Trade_Request\" SET \"Trade_Status\" = 'R', \"Changed_on\" = ?" +
					" WHERE ((\"Requested_Dealer\" = ? AND \"Requested_Vtn\" = ?) OR (\"Requesting_Dealer\" = ? AND " +
					"\"Offered_Vtn\" = ? AND '' != ?)) AND \"Trade_Status\" IN ('C', 'S')";
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
							var updateStmtParams = [
								today,
								selectResult.Requested_Dealer,
								selectResult.Requested_Vtn,
								selectResult.Requesting_Dealer,
								selectResult.Offered_Vtn,
								selectResult.Offered_Vtn
							];
							tracer.debug("Executing SQL statement [ %s ] with parameters [ %s ].", updateSql, JSON.stringify(updateStmtParams));
							updateStmt.exec(updateStmtParams, function (err, updateResults) {
								if (err) {
									tracer.error("ERROR executing SQL statement [ %s ] with parameters [ %s ] and error [ %s ].", updateSql, JSON.stringify(
										updateStmtParams), err.toString());
									reject(new Error(err.toString()));
								}
								logger.info("[TRADE_REQ_CLEANUP_TASK] Cleaned up %s stale trade requests associated with trade request %s.",
									updateResults, selectResult.Trade_Id);
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