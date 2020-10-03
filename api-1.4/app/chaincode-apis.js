'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('SampleWebApp');
var jwt = require('jsonwebtoken');
var hfc = require('fabric-client');
var helper = require('./helper.js');
var createChannel = require('./create-channel.js');
const { joinChannel } = require('./join-channel.js');
var join = require('./join-channel.js');
var install = require('./install-chaincode.js');
var instantiate = require('./instantiate-chaincode.js');
var invoke = require('./invoke-transaction.js');
var query = require('./query.js');


var registerUserApi = async function (req, res, app) {
    var username = req.body.username;
    var orgName = req.body.orgName;
    logger.debug('End point : /users');
    logger.debug('User name : ' + username);
    logger.debug('Org name  : ' + orgName);
    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!orgName) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }
    var token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + parseInt(hfc.getConfigSetting('jwt_expiretime')),
        username: username,
        orgName: orgName
    }, app.get('secret'));
    let response = await helper.getRegisteredUser(username, orgName, true);
    logger.debug('-- returned from registering the username %s for organization %s', username, orgName);
    if (response && typeof response !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', username, orgName);
        response.token = token;
        res.json(response);
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
        res.json({ success: false, message: response });
    }
};

var createChannelApi = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< C R E A T E  C H A N N E L >>>>>>>>>>>>>>>>>');
    logger.debug('End point : /channels');
    var channelName = req.body.channelName;
    var channelConfigPath = req.body.channelConfigPath;
    logger.debug('Channel name : ' + channelName);
    logger.debug('channelConfigPath : ' + channelConfigPath); //../artifacts/channel/mychannel.tx
    if (!channelName) {
        res.json(getErrorMessage('\'channelName\''));
        return;
    }
    if (!channelConfigPath) {
        res.json(getErrorMessage('\'channelConfigPath\''));
        return;
    }

    let message = await createChannel.createChannel(channelName, channelConfigPath, req.username, req.orgname);
    res.send(message);
};

var joinChannelApi = async function (req, res) {
    logger.info('<<<<<<<<<<<<<<<<< J O I N  C H A N N E L >>>>>>>>>>>>>>>>>');
    var channelName = req.params.channelName;
    var peers = req.body.peers;
    logger.debug('channelName : ' + channelName);
    logger.debug('peers : ' + peers);
    logger.debug('username :' + req.username);
    logger.debug('orgname:' + req.orgname);

    if (!channelName) {
        res.json(getErrorMessage('\'channelName\''));
        return;
    }
    if (!peers || peers.length == 0) {
        res.json(getErrorMessage('\'peers\''));
        return;
    }

    let message = await join.joinChannel(channelName, peers, req.username, req.orgname);
    res.send(message);
};

var installChaincodeApi = async function (rey, res) {
    ogger.debug('==================== INSTALL CHAINCODE ==================');
    var peers = req.body.peers;
    var chaincodeName = req.body.chaincodeName;
    var chaincodePath = req.body.chaincodePath;
    var chaincodeVersion = req.body.chaincodeVersion;
    var chaincodeType = req.body.chaincodeType;
    logger.debug('peers : ' + peers); // target peers list
    logger.debug('chaincodeName : ' + chaincodeName);
    logger.debug('chaincodePath  : ' + chaincodePath);
    logger.debug('chaincodeVersion  : ' + chaincodeVersion);
    logger.debug('chaincodeType  : ' + chaincodeType);
    if (!peers || peers.length == 0) {
        res.json(getErrorMessage('\'peers\''));
        return;
    }
    if (!chaincodeName) {
        res.json(getErrorMessage('\'chaincodeName\''));
        return;
    }
    if (!chaincodePath) {
        res.json(getErrorMessage('\'chaincodePath\''));
        return;
    }
    if (!chaincodeVersion) {
        res.json(getErrorMessage('\'chaincodeVersion\''));
        return;
    }
    if (!chaincodeType) {
        res.json(getErrorMessage('\'chaincodeType\''));
        return;
    }
    let message = await install.installChaincode(peers, chaincodeName, chaincodePath, chaincodeVersion, chaincodeType, req.username, req.orgname)
    res.send(message);
}

var instantiateChaincodeApi = async function (req, res) {
    logger.debug('==================== INSTANTIATE CHAINCODE ==================');
    var peers = req.body.peers;
    var chaincodeName = req.body.chaincodeName;
    var chaincodeVersion = req.body.chaincodeVersion;
    var channelName = req.params.channelName;
    var chaincodeType = req.body.chaincodeType;
    var fcn = req.body.fcn;
    var args = req.body.args;
    logger.debug('peers  : ' + peers);
    logger.debug('channelName  : ' + channelName);
    logger.debug('chaincodeName : ' + chaincodeName);
    logger.debug('chaincodeVersion  : ' + chaincodeVersion);
    logger.debug('chaincodeType  : ' + chaincodeType);
    logger.debug('fcn  : ' + fcn);
    logger.debug('args  : ' + args);
    if (!chaincodeName) {
        res.json(getErrorMessage('\'chaincodeName\''));
        return;
    }
    if (!chaincodeVersion) {
        res.json(getErrorMessage('\'chaincodeVersion\''));
        return;
    }
    if (!channelName) {
        res.json(getErrorMessage('\'channelName\''));
        return;
    }
    if (!chaincodeType) {
        res.json(getErrorMessage('\'chaincodeType\''));
        return;
    }
    if (!args) {
        res.json(getErrorMessage('\'args\''));
        return;
    }

    let message = await instantiate.instantiateChaincode(peers, channelName, chaincodeName, chaincodeVersion, chaincodeType, fcn, args, req.username, req.orgname);
    res.send(message);
}

var fetchChannelsApi = async function (req, res) {
    logger.debug('================ GET CHANNELS ======================');
    logger.debug('peer: ' + req.query.peer);
    var peer = req.query.peer;
    if (!peer) {
        res.json(getErrorMessage('\'peer\''));
        return;
    }

    let message = await query.getChannels(peer, req.username, req.orgname);
    res.send(message)
}

var fetchChaincodesApi = async function (req, res) {
    var peer = req.query.peer;
    var installType = req.query.type;
    logger.debug('================ GET INSTALLED CHAINCODES ======================');

    let message = await query.getInstalledChaincodes(peer, null, 'installed', req.username, req.orgname)
    res.send(message);
}

var fetchInstantiatedChaincodesApi = async function (req, res) {
    logger.debug('================ GET INSTANTIATED CHAINCODES ======================');
    logger.debug('channelName : ' + req.params.channelName);
    let peer = req.query.peer;

    let message = await query.getInstalledChaincodes(peer, req.params.channelName, 'instantiated', req.username, req.orgname);
    res.send(message);
}

var fetchChannelInformationApi = async function (req, res) {
    logger.debug('================ GET CHANNEL INFORMATION ======================');
    logger.debug('channelName : ' + req.params.channelName);
    let peer = req.query.peer;

    let message = await query.getChainInfo(peer, req.params.channelName, req.username, req.orgname);
    res.send(message);
}

var fetchBlockByHashApi = async function (req, res) {
    logger.debug('================ GET BLOCK BY HASH ======================');
    logger.debug('channelName : ' + req.params.channelName);
    let hash = req.query.hash;
    let peer = req.query.peer;
    if (!hash) {
        res.json(getErrorMessage('\'hash\''));
        return;
    }

    let message = await query.getBlockByHash(peer, req.params.channelName, hash, req.username, req.orgname);
    res.send(message);
}

var fetchTransactionByIdApi = async function (req, res) {
    logger.debug('================ GET TRANSACTION BY TRANSACTION_ID ======================');
    logger.debug('channelName : ' + req.params.channelName);
    let trxnId = req.params.trxnId;
    let peer = req.query.peer;
    if (!trxnId) {
        res.json(getErrorMessage('\'trxnId\''));
        return;
    }

    let message = await query.getTransactionByID(peer, req.params.channelName, trxnId, req.username, req.orgname);
    res.send(message);
}

var fetchBlockByBlockIdApi = async function (req, res) {
    logger.debug('==================== GET BLOCK BY NUMBER ==================');
    let blockId = req.params.blockId;
    let peer = req.query.peer;
    logger.debug('channelName : ' + req.params.channelName);
    logger.debug('BlockID : ' + blockId);
    logger.debug('Peer : ' + peer);
    if (!blockId) {
        res.json(getErrorMessage('\'blockId\''));
        return;
    }

    let message = await query.getBlockByNumber(peer, req.params.channelName, blockId, req.username, req.orgname);
    res.send(message);
}


exports.registerUser = registerUserApi;
exports.createChannel = createChannelApi;
exports.joinChannel = joinChannelApi;
exports.installChaincode = installChaincodeApi;
exports.installChaincode = instantiateChaincodeApi;
exports.fetchChannels = fetchChannelsApi;
exports.fetchChaincodes = fetchChaincodesApi;
exports.fetchInstantiatedChaincodes = fetchInstantiatedChaincodesApi;
exports.fetchChannelInformation = fetchChannelInformationApi;
exports.fetchBlockByHash = fetchBlockByHashApi;
exports.fetchTransactionById = fetchTransactionByIdApi;
exports.fetchBlockByBlockId = fetchBlockByBlockIdApi;


