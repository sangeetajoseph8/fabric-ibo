'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var query = require('./query.js');
var invoke = require('./invoke-transaction.js');

const channelName = 'product-history'
const chaincodeName = 'producthistory'
const peers = ["peer1.customer.ibo.com", "peer1.manufacturer.ibo.com", "peer1.rawmaterialsupplier.ibo.com", "peer1.componentsupplier.ibo.com"]

function getErrorMessage(field) {
    var response = {
        result: null,
        error: 'JSON Error',
        errorData: field + ' field is missing or Invalid in the request'
    };
    return response;
}

var createAccessRequest = async function (req, res) {
    try {
        logger.debug('==================== INVOKE ON CHAINCODE ==================');
        var fcn = 'createAccessRequest'
        var accessRequest = req.body;
        if (!accessRequest.accessRequestId || !accessRequest.approvingOrgName || !accessRequest.orderId) {
            res.json(getErrorMessage('\'accessRequestId or approvingOrgName or orderId\''));
            return;
        }
        accessRequest.publishedDate = Date.now()
        accessRequest.requestingOrgName = req.orgname
        let args = [JSON.stringify(accessRequest)]
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

var deleteAccessRequest = async function (req, res) {
    try {
        logger.debug('==================== INVOKE ON CHAINCODE ==================');
        var fcn = 'deleteAccessRequest'
        var accessRequest = req.body;
        if (!accessRequest.accessRequestId) {
            res.json(getErrorMessage('\'accessRequestId\''));
            return;
        }
        let args = [accessRequest.accessRequestId]
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

var updateStatusOfAccessRequest = async function (req, res) {
    try {
        logger.debug('==================== INVOKE ON CHAINCODE ==================');
        var fcn = 'updateAccessRequestStatus'
        var accessRequest = req.body;
        if (!accessRequest.accessRequestId || !accessRequest.status) {
            res.json(getErrorMessage('\'accessRequestId or status\''));
            return;
        }
        let args = [accessRequest.accessRequestId, accessRequest.status, req.orgname]
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

var getAccessRequestListForApprovingOrg = async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        let fcn = "getAccessRequestListForApprovingOrg";
        let pageSize = req.query.pageSize;
        let bookmark = req.query.bookmark;

        if (!pageSize) {
            pageSize = '20';
        }

        if (!bookmark) {
            bookmark = ""
        }

        let args = [req.orgname, pageSize, bookmark]
        let peer = 'peer1.' + req.orgname.toLowerCase() + '.ibo.com'

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

var getAccessRequestListForRequestingOrg = async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        let fcn = "getAccessRequestListForRequestingOrg";
        let pageSize = req.query.pageSize;
        let bookmark = req.query.bookmark;

        if (!pageSize) {
            pageSize = '20';
        }

        if (!bookmark) {
            bookmark = ""
        }

        let args = [req.orgname, pageSize, bookmark]
        let peer = 'peer1.' + req.orgname.toLowerCase() + '.ibo.com'

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


var checkIfAccessRequestExists = async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');

        let fcn = "accessRequestExists";
        let orderId = req.query.orderId
        let requestingOrgName = req.orgname;
        let approvingOrgName = req.query.approvingOrgName;
        if (!orderId || !approvingOrgName) {
            res.json(getErrorMessage('\'approvingOrgName or orderId\''));
            return;
        }

        let args = [requestingOrgName, approvingOrgName, orderId]
        let peer = 'peer1.' + req.orgname.toLowerCase() + '.ibo.com'

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


exports.createAccessRequest = createAccessRequest
exports.deleteAccessRequest = deleteAccessRequest
exports.checkIfAccessRequestExists = checkIfAccessRequestExists
exports.getAccessRequestListForRequestingOrg = getAccessRequestListForRequestingOrg
exports.getAccessRequestListForApprovingOrg = getAccessRequestListForApprovingOrg