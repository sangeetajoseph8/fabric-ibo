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
        logger.debug(orderDetails);
        var fcn = 'createOrder'
        var orderDetails = req.body;
        logger.debug(req);
        if (!orderDetails.orderId || !orderDetails.orderType || !orderDetails.orderDate) {
            res.json(getErrorMessage('\'orderId or orderType or orderDate\''));
            return;
        }
        orderDetails.initiatorOrgName = req.orgname;
        orderDetails.orderLastUpdatedByOrgName = req.orgname;

        if (orderDetails.comment) {
            orderDetails.commentList = [
                {
                    commentString: orderDetails.comment,
                    publishedDate: new Date(),
                    orgName: req.orgname,
                    userName: req.username
                }
            ]
        }

        logger.debug("Order Details" + orderDetails);
        var data = {
            order: Buffer.from(JSON.stringify(orderDetails))
        }
        const start = Date.now();
        let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, [JSON.stringify(orderDetails)], req.username, req.orgname, data);
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

        var data = {
            order: Buffer.from(JSON.stringify(orderDetails))
        }

        const start = Date.now();
        let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, [order], req.username, req.orgname, data);
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
        var fcn = 'approveOrderStatus'
        var orderDetails = req.body;
        if (!orderDetails.orderId) {
            res.json(getErrorMessage('\'orderId\''));
            return;
        }
        if (orderDetails.orderStatus === null || orderDetails.orderStatus === '' || !(orderDetails.orderStatus == "APPROVED" || orderDetails.orderStatus == "REJECTED")) {
            res.json(getErrorMessage('\'orderStatus\''));
            return;
        }
        const start = Date.now();

        var data = {
            orderId: Buffer.from(orderDetails.orderId),
            orgName: Buffer.from(req.orgname),
            userName: Buffer.from(req.username),
            approvalStatus: Buffer.from(orderDetails.orderStatus),
            comment: Buffer.from(orderDetails.comment)
        }
        const args = [orderDetails.orderId, req.orgname, req.username, orderDetails.comment, orderDetails.orderStatus]
        let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, req.username, req.orgname, data);
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

var deleteOrderDetails = async function (req, res) {
    try {
        logger.debug('==================== INVOKE ON CHAINCODE ==================');
        var fcn = 'deleteOrderDetails'
        var orderDetails = req.body;
        if (!orderDetails.orderId) {
            res.json(getErrorMessage('\'orderId\''));
            return;
        }

        const args = [orderDetails.orderId, req.orgname]
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
}

var fetchAllOrdersByOrgName = async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        let fcn = "getAllOrderForOrgName";
        let orgName = req.orgname;

        if (!orgName) {
            res.json(getErrorMessage('\'orgName\''));
            return;
        }

        let args = [orgName]
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


var fetchAllTaggedOrders = async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        let fcn = "getAllOrderAsApproverOrg";
        let orgName = req.orgname;

        if (!orgName) {
            res.json(getErrorMessage('\'orgName\''));
            return;
        }

        let args = [orgName]
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

var fetchAllUnapprovedOrders = async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        let fcn = "getAllOrderThatNeedApproval";
        let orgName = req.orgname;

        if (!orgName) {
            res.json(getErrorMessage('\'orgName\''));
            return;
        }

        let args = [orgName]
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

        let args = [orderId.replace(/'/g, '"'), req.orgname]
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

        let args = [orderId.replace(/'/g, '"'), req.orgname]
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
exports.deleteOrderDetails = deleteOrderDetails;
exports.fetchAllTaggedOrders = fetchAllTaggedOrders;
exports.fetchAllUnapprovedOrders = fetchAllUnapprovedOrders;
