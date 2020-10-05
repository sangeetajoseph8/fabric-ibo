'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var query = require('./query.js');
const channelName = 'order-details'
const chaincodeName = 'orderdetails'
const peers = ["peer0.customer.ibo.com", "peer0.manufacturer.ibo.com", "peer0.rawmaterialsupplier.ibo.com", "peer0.componentsupplier.ibo.com"]

var invoke = require('./invoke-transaction.js');


function getErrorMessage(field) {
    var response = {
        result: null,
        error: 'JSON Error',
        errorData: field + ' field is missing or Invalid in the request'
    };
    return response;
}

var createOrderDetails = async function (req, res) {
    try {
        logger.debug('==================== INVOKE ON CHAINCODE ==================');
        var fcn = 'createOrderDetails'
        var orderDetails = req.body;
        if (!orderDetails.orderId || !orderDetails.orderType || !orderDetails.orderDate) {
            res.json(getErrorMessage('\'orderId or orderType or orderDate\''));
            return;
        }
        orderDetails.initiatorOrgName = req.orgname;
        orderDetails.orderLastUpdatedByOrgName = req.orgname;

        const start = Date.now();
        let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, [JSON.stringify(orderDetails)], req.username, req.orgname);
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
}

var updateOrderDetails = async function (req, res) {
    try {
        logger.debug('==================== INVOKE ON CHAINCODE ==================');
        var fcn = 'updateOrderDetails'
        var orderDetails = req.body;
        if (!orderDetails.orderId) {
            res.json(getErrorMessage('\'orderId\''));
            return;
        }
        orderDetails.orderLastUpdatedByOrgName = req.orgname;

        const start = Date.now();
        let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, [JSON.stringify(orderDetails)], req.username, req.orgname);
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
}

var updateOrderDetailsStatus = async function (req, res) {
    try {
        logger.debug('==================== INVOKE ON CHAINCODE ==================');
        var fcn = 'updateOrderDetails'
        var orderDetails = req.body;
        if (!orderDetails.orderId) {
            res.json(getErrorMessage('\'orderId\''));
            return;
        }
        if (!orderDetails.orderStatus || !(orderDetails == "APPROVED" || orderDetails == "REJECTED")) {
            res.json(getErrorMessage('\'orderStatus\''));
            return;
        }

        const args = [orderDetails.orderId, req.orgname, orderDetails.comment, orderDetails.orderStatus]
        const start = Date.now();
        let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, [JSON.stringify(orderDetails)], req.username, req.orgname);
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
}

var fetchAllOrdersByOrgName = async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        let fcn = "getAllOrderForOrgName";
        let orgName = req.query.orgName;
        let pageSize = req.query.pageSize;
        let bookmark = req.query.bookmark;

        if (!orgName) {
            res.json(getErrorMessage('\'orgName\''));
            return;
        }

        if (!pageSize) {
            pageSize = '20';
        }

        if (!bookmark) {
            bookmark = ""
        }

        let args = [orgName, pageSize, bookmark]
        let peer = 'peer0.' + req.orgname.toLowerCase() + '.ibo.com'

        let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
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
}

var fetchOrderByOrderId = async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        let fcn = "getOrderDetails";
        let orderId = req.query.orderId;

        if (!orderId) {
            res.json(getErrorMessage('\'orderId\''));
            return;
        }

        let args = [orderId.replace(/'/g, '"')]
        let peer = 'peer0.' + req.orgname.toLowerCase() + '.ibo.com'
        let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
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
}

var orderDetailsExists = async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        let fcn = "orderDetailsExists";
        let orderId = req.query.orderId;

        if (!orderId) {
            res.json(getErrorMessage('\'orderId\''));
            return;
        }

        let args = [orderId.replace(/'/g, '"')]
        let peer = 'peer0.' + req.orgname.toLowerCase() + '.ibo.com'
        let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);

        let response = {
            success: true,
            orderDetailsExists: message,
            orderid: orderId
        };
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
}

exports.createOrderDetails = createOrderDetails;
exports.updateOrderDetails = updateOrderDetails;
exports.updateOrderDetailsStatus = updateOrderDetailsStatus;
exports.fetchAllOrdersByOrgName = fetchAllOrdersByOrgName;
exports.orderDetailsExists = orderDetailsExists;
exports.fetchOrderByOrderId = fetchOrderByOrderId;
