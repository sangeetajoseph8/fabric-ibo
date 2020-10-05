/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var util = require('util');
var app = express();
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');
var cors = require('cors');
const prometheus = require('prom-client')

require('./config.js');
var hfc = require('fabric-client');


var chaincodeApis = require('./app/chaincode-apis.js');
var orderDetailsApis = require('./app/order-details-apis.js')
var productHistoryApis = require('./app/product-history-apis.js')
var accessRequestApis = require('./app/access-request-apis.js')

var host = process.env.HOST || hfc.getConfigSetting('host');
var port = process.env.PORT || hfc.getConfigSetting('port');


app.options('*', cors());
app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
	extended: false
}));
// set secret variable
app.set('secret', 'thisismysecret');
app.use(expressJWT({
	secret: 'thisismysecret'
}).unless({
	path: ['/users', '/metrics']
}));
app.use(bearerToken());
app.use(function (req, res, next) {
	logger.debug(' ------>>>>>> new request for %s', req.originalUrl);
	if (req.originalUrl.indexOf('/users') >= 0 || req.originalUrl.indexOf('/metrics') >= 0) {
		return next();
	}

	var token = req.token;
	jwt.verify(token, app.get('secret'), function (err, decoded) {
		if (err) {
			res.send({
				success: false,
				message: 'Failed to authenticate token. Make sure to include the ' +
					'token returned from /users call in the authorization header ' +
					' as a Bearer token'
			});
			return;
		} else {
			// add the decoded user name and org name to the request object
			// for the downstream code to use
			req.username = decoded.username;
			req.orgname = decoded.orgName;
			logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
			return next();
		}
	});
});

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port, function () { });
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************', host, port);
server.timeout = 240000;

function getErrorMessage(field) {
	var response = {
		success: false,
		message: field + ' field is missing or Invalid in the request'
	};
	return response;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////// REST ENDPOINTS START HERE ///////////////////////////
///////////////////////////////////////////////////////////////////////////////
// Register and enroll user
app.post('/users', async function (req, res) {
	chaincodeApis.registerUser(req, res, app)
});
// Create Channel
app.post('/channels', async function (req, res) {
	chaincodeApis.createChannel(req, res)
});
// Join Channel
app.post('/channels/:channelName/peers', async function (req, res) {
	chaincodeApis.createChannel(req, res)
});
// Install chaincode on target peers
app.post('/chaincodes', async function (req, res) {
	chaincodeApis.installChaincode(req, res)
});
// Instantiate chaincode on target peers
app.post('/channels/:channelName/chaincodes', async function (req, res) {
	chaincodeApis.instantiateChaincode(req, res)
});
// Invoke transaction on chaincode on target peers
app.post('/channels/:channelName/chaincodes/:chaincodeName', async function (req, res) {
	try {
		logger.debug('==================== INVOKE ON CHAINCODE ==================');
		var peers = req.body.peers;
		var chaincodeName = req.params.chaincodeName;
		var channelName = req.params.channelName;
		var fcn = req.body.fcn;
		var args = req.body.args;
		logger.debug('channelName  : ' + channelName);
		logger.debug('chaincodeName : ' + chaincodeName);
		logger.debug('fcn  : ' + fcn);
		logger.debug('args  : ' + args);
		if (!chaincodeName) {
			res.json(getErrorMessage('\'chaincodeName\''));
			return;
		}
		if (!channelName) {
			res.json(getErrorMessage('\'channelName\''));
			return;
		}
		if (!fcn) {
			res.json(getErrorMessage('\'fcn\''));
			return;
		}
		if (!args) {
			res.json(getErrorMessage('\'args\''));
			return;
		}

		const start = Date.now();
		let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, req.username, req.orgname);
		const latency = Date.now() - start;


		const response_payload = {
			result: message,
			error: null,
			errorData: null
		}
		res.send(response_payload);

	} catch (error) {
		const response_payload = {
			result: null,
			error: error.name,
			errorData: error.message
		}
		res.send(response_payload)
	}
});


// Query on chaincode on target peers
app.get('/channels/:channelName/chaincodes/:chaincodeName', async function (req, res) {
	logger.debug('==================== QUERY BY CHAINCODE ==================');
	var channelName = req.params.channelName;
	var chaincodeName = req.params.chaincodeName;
	let args = req.query.args;
	let fcn = req.query.fcn;
	let peer = req.query.peer;

	logger.debug('channelName : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('fcn : ' + fcn);
	logger.debug('args : ' + args);

	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!fcn) {
		res.json(getErrorMessage('\'fcn\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}
	args = args.replace(/'/g, '"');
	args = JSON.parse(args);
	logger.debug(args);

	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
	res.send(message);
});

//  Query Get Block by BlockNumber
app.get('/channels/:channelName/blocks/:blockId', async function (req, res) {
	chaincodeApis.fetchBlockByBlockId(rey, res);
});

// Query Get Transaction by Transaction ID
app.get('/channels/:channelName/transactions/:trxnId', async function (req, res) {
	chaincodeApis.fetchTransactionById(req, res);
});
// Query Get Block by Hash
app.get('/channels/:channelName/blocks', async function (req, res) {
	chaincodeApis.fetchBlockByHash(req, res);
});
//Query for Channel Information
app.get('/channels/:channelName', async function (req, res) {
	chaincodeApis.fetchChannelInformation(req, res);
});
//Query for Channel instantiated chaincodes
app.get('/channels/:channelName/chaincodes', async function (req, res) {
	chaincodeApis.fetchInstantiatedChaincodes(req, res)
});
// Query to fetch all Installed/instantiated chaincodes
app.get('/chaincodes', async function (req, res) {
	chaincodeApis.fetchChaincodes(req, res)
});
// Query to fetch channels
app.get('/channels', async function (req, res) {
	chaincodeApis.fetchChannels(req, res)
});


app.post('/createOrderDetails', async function (req, res) {
	orderDetailsApis.createOrderDetails(req, res)
});

app.post('/updateOrderDetails', async function (req, res) {
	orderDetailsApis.updateOrderDetails(req, res)
});

app.post('/updateOrderDetailsStatus', async function (req, res) {
	orderDetailsApis.updateOrderDetailsStatus(req, res)
});

app.get('/ordersByOrgName', async function (req, res) {
	orderDetailsApis.fetchAllOrdersByOrgName(req, res)
});

app.get('/ordersByOrderId', async function (req, res) {
	orderDetailsApis.fetchOrderByOrderId(req, res)
});

app.get('/orderDetailsExists', async function (req, res) {
	orderDetailsApis.orderDetailsExists(req, res)
});

app.post('/createProductHistoryConnection', async function (req, res) {
	productHistoryApis.createProductHistoryConnection(req, res)
});

app.get('/productHistory', async function (req, res) {
	productHistoryApis.fetchProductHistory(req, res)
});

app.post('/createAccessRequest', async function (req, res) {
	accessRequestApis.createAccessRequest(req, res)
});

app.post('/deleteAccessRequest', async function (req, res) {
	accessRequestApis.deleteAccessRequest(req, res)
});

app.get('/accessRequestExists', async function (req, res) {
	accessRequestApis.checkIfAccessRequestExists(req, res)
});

app.get('/getAccessRequestsForApprovingOrg', async function (req, res) {
	accessRequestApis.getAccessRequestListForApprovingOrg(req, res)
});

app.get('/getAccessRequestsForRequestingOrg', async function (req, res) {
	accessRequestApis.getAccessRequestListForRequestingOrg(req, res)
});


module.exports = app
