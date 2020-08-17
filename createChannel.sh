export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/ibo.com/orderers/orderer.ibo.com/msp/tlscacerts/tlsca.ibo.com-cert.pem
export PEER0_CUSTOMER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/customer.ibo.com/peers/peer0.customer.ibo.com/tls/ca.crt
export PEER0_MANUFACTURER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/manufacturer.ibo.com/peers/peer0.manufacturer.ibo.com/tls/ca.crt
export PEER0_RAWMATERIAL_SUPPLIER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/rawmaterialsupplier.ibo.com/peers/peer0.rawmaterialsupplier.ibo.com/tls/ca.crt
export PEER0_COMPONENT_SUPPLIER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/componentsupplier.ibo.com/peers/peer0.componentsupplier.ibo.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/artifacts/channel/config/

export CHANNEL_NAME_1=order-details
export CHANNEL_NAME_2=product-history

setGlobalsForOrderer(){
    export CORE_PEER_LOCALMSPID="OrdererMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/ibo.com/msp/tlscacerts/tlsca.ibo.com-cert.pem
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/ibo.com/users/Admin@ibo.com/msp  
}

setGlobalsForPeer0Customer(){
    export CORE_PEER_LOCALMSPID="CustomerMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_CUSTOMER_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/customer.ibo.com/users/Admin@customer.ibo.com/msp
    export CORE_PEER_ADDRESS=localhost:6051
}

setGlobalsForPeer1Customer(){
    export CORE_PEER_LOCALMSPID="CustomerMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_CUSTOMER_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/customer.ibo.com/users/Admin@customer.ibo.com/msp
    export CORE_PEER_ADDRESS=localhost:6055
    
}

setGlobalsForPeer0Manufacturer(){
    export CORE_PEER_LOCALMSPID="ManufacturerMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_MANUFACTURER_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/manufacturer.ibo.com/users/Admin@manufacturer.ibo.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
    
}

setGlobalsForPeer1Manufacturer(){
    export CORE_PEER_LOCALMSPID="ManufacturerMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_MANUFACTURER_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/manufacturer.ibo.com/users/Admin@manufacturer.ibo.com/msp
    export CORE_PEER_ADDRESS=localhost:7055
    
}

setGlobalsForPeer0RawMaterialSupplier(){
    export CORE_PEER_LOCALMSPID="RawMaterialSupplierMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_RAWMATERIAL_SUPPLIER_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/rawmaterialsupplier.ibo.com/users/Admin@rawmaterialsupplier.ibo.com/msp
    export CORE_PEER_ADDRESS=localhost:8051
    
}

setGlobalsForPeer1RawMaterialSupplier(){
    export CORE_PEER_LOCALMSPID="RawMaterialSupplierMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_RAWMATERIAL_SUPPLIER_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/rawmaterialsupplier.ibo.com/users/Admin@rawmaterialsupplier.ibo.com/msp
    export CORE_PEER_ADDRESS=localhost:8055
    
}

setGlobalsForPeer0ComponentSupplier(){
    export CORE_PEER_LOCALMSPID="ComponentSupplierMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_COMPONENT_SUPPLIER_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/componentsupplier.ibo.com/users/Admin@componentsupplier.ibo.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
    
}

setGlobalsForPeer1ComponentSupplier(){
    export CORE_PEER_LOCALMSPID="ComponentSupplierMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_COMPONENT_SUPPLIER_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/componentsupplier.ibo.com/users/Admin@componentsupplier.ibo.com/msp
    export CORE_PEER_ADDRESS=localhost:9055
    
}

createChannel_1(){
    peer channel create -o localhost:6050 -c $CHANNEL_NAME_1 \
    --ordererTLSHostnameOverride orderer.ibo.com \
    -f ./artifacts/channel/${CHANNEL_NAME_1}.tx --outputBlock ./channel-artifacts/${CHANNEL_NAME_1}.block \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
}

createChannel_2(){
    peer channel create -o localhost:6050 -c $CHANNEL_NAME_2 \
    --ordererTLSHostnameOverride orderer.ibo.com \
    -f ./artifacts/channel/${CHANNEL_NAME_2}.tx --outputBlock ./channel-artifacts/${CHANNEL_NAME_2}.block \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
}

removeOldCrypto(){
    rm -rf ./api-1.4/crypto/*
    rm -rf ./api-1.4/fabric-client-kv-customer/*
    rm -rf ./api-2.0/customer-wallet/*
    rm -rf ./api-2.0/manufacturer-wallet/*
    rm -rf ./channel-artifacts/*  
}

joinChannel_1(){
    setGlobalsForPeer0Customer
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME_1.block
    updateAnchorPeers_1
    
    setGlobalsForPeer0Manufacturer
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME_1.block
    updateAnchorPeers_1

    setGlobalsForPeer0RawMaterialSupplier
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME_1.block
    updateAnchorPeers_1

    setGlobalsForPeer0ComponentSupplier
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME_1.block
    updateAnchorPeers_1
    
}

joinChannel_2(){
    setGlobalsForPeer1Customer
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME_2.block
    updateAnchorPeers_2
    
    setGlobalsForPeer1Manufacturer
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME_2.block
    updateAnchorPeers_2

    setGlobalsForPeer1RawMaterialSupplier
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME_2.block
    updateAnchorPeers_2

    setGlobalsForPeer1ComponentSupplier
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME_2.block
    updateAnchorPeers_2
    
}

updateAnchorPeers_1(){
    peer channel update -o localhost:6050 --ordererTLSHostnameOverride orderer.ibo.com -c $CHANNEL_NAME_1 -f ./artifacts/channel/${CORE_PEER_LOCALMSPID}Anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA    
}

updateAnchorPeers_2(){
    peer channel update -o localhost:6050 --ordererTLSHostnameOverride orderer.ibo.com -c $CHANNEL_NAME_2 -f ./artifacts/channel/${CORE_PEER_LOCALMSPID}Anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA    
}



removeOldCrypto
setGlobalsForPeer0Customer

createChannel_1
joinChannel_1

createChannel_2
joinChannel_2
