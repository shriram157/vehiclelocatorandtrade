/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
'use strict';
var express = require('express');
var request = require('request');
var xsenv = require("@sap/xsenv");
var passport = require('passport');
var JWTStrategy = require('@sap/xssec').JWTStrategy;

var async = require('async');

// vehicle Locator Node Module. 
module.exports = function() {
	var app = express.Router();

	// SAP Calls Start from here
	var options = {};
	options = Object.assign(options, xsenv.getServices({
		api: {
			name: "VEHICLE_LOCATOR_APIM_CUPS" 
		}
	}));

	var uname = options.api.user,
		pwd = options.api.password,
		url = options.api.host,
		APIKey = options.api.APIKey,
		client = options.api.client;
     	console.log('The API Management URL', url);


	var auth64 = 'Basic ' + new Buffer(uname + ':' + pwd).toString('base64');

	var reqHeader = {
		"Authorization": auth64,
		"Content-Type": "application/json",
		"APIKey": APIKey,
		"x-csrf-token": "Fetch"
	};

	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});
	
	// simple version of bridge call
	app.all('/*', function(req, res, next) {

    	let headOptions = {};
			var csrfToken;
		// prepare the magic reverse proxy header for odata service to work. 
        // let originalHost = req.hostname;
        // if (!!req.headers.host){
        //     headOptions.host = req.headers.host;
        // }

		//only support the basic auth
        headOptions.Authorization = auth64;

        let method = req.method;
        let xurl = url +req.url;
         console.log('Method', method);
        console.log('Incoming Url', xurl);
        let xRequest = 
			request({
				method : method,
				url : xurl,
				headers: reqHeader
 			}
		);
        
        req.pipe(xRequest);

        xRequest.on('response', (response) => {
        	// delete response.headers['set-cookie'];
        		csrfToken = response.headers['x-csrf-token'];
        	xRequest.pipe(res);
        }).on('error', (error) => {
        	next(error);
       });
	});
	
	return app;
};


