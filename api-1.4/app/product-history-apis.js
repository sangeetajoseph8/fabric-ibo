'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var query = require('./query.js');
var invoke = require('./invoke-transaction.js');

const channelName = 'product-history'
const chaincodeName = 'producthistory'
const peers = ["peer1.customer.ibo.com", "peer1.manufacturer.ibo.com", "peer1.rawmaterialsupplier.ibo.com", "peer1.componentsupplier.ibo.com"]

var createProductHistoryConnection = async function (req, res) {
    try {
        logger.debug('==================== INVOKE ON CHAINCODE ==================');
        var fcn = 'createProductHistoryConnection'
        var connection = req.body;
        if (!connection.connectionId || !connection.productHistory1 || !connection.productHistory2) {
            res.json(getErrorMessage('\'connectionId or productHistory1 or productHistory2\''));
            return;
        }
        let args = [connection.connectionId, JSON.stringify(connection.productHistory1), JSON.stringify(connection.productHistory2)]
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

var fetchProductHistory = async function (req, res) {
    logger.debug('==================== QUERY BY CHAINCODE ==================');

    let fcn = "getProductHistory";
    let orderId = req.query.orderId;

    if (!orderId) {
        res.json(getErrorMessage('\'orderId\''));
        return;
    }

    let args = [orderId.replace(/'/g, '"')]
    let peer = 'peer1.' + req.orgname.toLowerCase() + '.ibo.com'
    let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, req.username, req.orgname);
    res.send(message);
}

exports.createProductHistoryConnection = createProductHistoryConnection;
exports.fetchProductHistory = fetchProductHistory;