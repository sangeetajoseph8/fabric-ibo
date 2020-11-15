export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/ibo.com/orderers/orderer.ibo.com/msp/tlscacerts/tlsca.ibo.com-cert.pem
export PEER0_CUSTOMER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/customer.ibo.com/peers/peer0.customer.ibo.com/tls/ca.crt
export PEER0_MANUFACTURER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/manufacturer.ibo.com/peers/peer0.manufacturer.ibo.com/tls/ca.crt
export PEER0_RAWMATERIAL_SUPPLIER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/rawmaterialsupplier.ibo.com/peers/peer0.rawmaterialsupplier.ibo.com/tls/ca.crt
export PEER0_COMPONENT_SUPPLIER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/componentsupplier.ibo.com/peers/peer0.componentsupplier.ibo.com/tls/ca.crt
export PEER1_CUSTOMER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/customer.ibo.com/peers/peer1.customer.ibo.com/tls/ca.crt
export PEER1_MANUFACTURER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/manufacturer.ibo.com/peers/peer1.manufacturer.ibo.com/tls/ca.crt
export PEER1_RAWMATERIAL_SUPPLIER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/rawmaterialsupplier.ibo.com/peers/peer1.rawmaterialsupplier.ibo.com/tls/ca.crt
export PEER1_COMPONENT_SUPPLIER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/componentsupplier.ibo.com/peers/peer1.componentsupplier.ibo.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/artifacts/channel/config/

export PRIVATE_DATA_CONFIG=${PWD}/artifacts/private-data/collections_config.json

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
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_CUSTOMER_CA
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
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_MANUFACTURER_CA
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
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_RAWMATERIAL_SUPPLIER_CA
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
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER1_COMPONENT_SUPPLIER_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/componentsupplier.ibo.com/users/Admin@componentsupplier.ibo.com/msp
    export CORE_PEER_ADDRESS=localhost:9055
    
}

presetup() {
    echo Building Java dependencies ...
    pushd ./artifacts/src/smart-contract/order-pdc
    ./gradlew build
    popd
    pushd ./artifacts/src/smart-contract/product-history
    ./gradlew build
    popd
    echo Finished building Java dependencies
}
# presetup

CC_RUNTIME_LANGUAGE="java"
VERSION_1="1"
CC_SRC_PATH_1="./artifacts/src/smart-contract/order-pdc"
CC_NAME_1="orderdetails"

VERSION_2="1"
CC_SRC_PATH_2="./artifacts/src/smart-contract/product-history"
CC_NAME_2="producthistory"

packageChaincode_1() {
    rm -rf ${CC_NAME_1}.tar.gz
    setGlobalsForPeer0Customer
    peer lifecycle chaincode package ${CC_NAME_1}.tar.gz \
        --path ${CC_SRC_PATH_1} --lang ${CC_RUNTIME_LANGUAGE} \
        --label ${CC_NAME_1}_${VERSION_1}

    echo "===================== Chaincode 1 is packaged on peer0.customer ===================== "

}

packageChaincode_2() {
    rm -rf ${CC_NAME_2}.tar.gz
    setGlobalsForPeer1Customer
     peer lifecycle chaincode package ${CC_NAME_2}.tar.gz \
        --path ${CC_SRC_PATH_2} --lang ${CC_RUNTIME_LANGUAGE} \
        --label ${CC_NAME_2}_${VERSION_2}

    echo "===================== Chaincode 2 is packaged on peer1.customer ===================== "
}
# packageChaincode

installChaincode_1() {
    setGlobalsForPeer0Customer
    peer lifecycle chaincode install ${CC_NAME_1}.tar.gz
    echo "===================== Order Details Chaincode is installed on peer0.customer ===================== "

    setGlobalsForPeer0Manufacturer
    peer lifecycle chaincode install ${CC_NAME_1}.tar.gz
    echo "===================== Order Details Chaincode is installed on peer0.manufacturer ===================== "

    setGlobalsForPeer0RawMaterialSupplier
    peer lifecycle chaincode install ${CC_NAME_1}.tar.gz
    echo "===================== Order Details Chaincode is installed on peer0.rawMaterialsupplier ===================== "
    
    setGlobalsForPeer0ComponentSupplier
    peer lifecycle chaincode install ${CC_NAME_1}.tar.gz
    echo "===================== Order Details Chaincode is installed on peer0.componentsupplier ===================== "
}

installChaincode_2() {
    setGlobalsForPeer1Customer
    peer lifecycle chaincode install ${CC_NAME_2}.tar.gz
    echo "===================== Order Details Chaincode is installed on peer1.customer ===================== "

    setGlobalsForPeer1Manufacturer
    peer lifecycle chaincode install ${CC_NAME_2}.tar.gz
    echo "===================== Order Details Chaincode is installed on peer1.manufacturer ===================== "

    setGlobalsForPeer1RawMaterialSupplier
    peer lifecycle chaincode install ${CC_NAME_2}.tar.gz
    echo "===================== Order Details Chaincode is installed on peer1.rawMaterialsupplier ===================== "
    
    setGlobalsForPeer1ComponentSupplier
    peer lifecycle chaincode install ${CC_NAME_2}.tar.gz
    echo "===================== Order Details Chaincode is installed on peer1.componentsupplier ===================== "
}

# installChaincode

queryInstalled_1() {
    setGlobalsForPeer0Customer
    peer lifecycle chaincode queryinstalled >&log.txt
    cat log.txt
    PACKAGE_ID_1=$(sed -n "/${CC_NAME_1}_${VERSION_1}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    echo PackageID_1 is ${PACKAGE_ID_1}
    echo "===================== Query installed successful on peer0.customer on channel ===================== "
}

queryInstalled_2() {
    setGlobalsForPeer1Customer
    peer lifecycle chaincode queryinstalled >&log.txt
    cat log.txt
    PACKAGE_ID_2=$(sed -n "/${CC_NAME_2}_${VERSION_2}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    echo PackageID_2 is ${PACKAGE_ID_2}
    echo "===================== Query installed successful on peer1.customer on channel ===================== "
}

# queryInstalled

checkCommitReadyness_1() {
    setGlobalsForPeer0Customer
    peer lifecycle chaincode checkcommitreadiness \
        --collections-config $PRIVATE_DATA_CONFIG \
        --channelID ${CHANNEL_NAME_1} --name ${CC_NAME_1} --version ${VERSION_1} \
        --sequence ${VERSION_1} --output json 
    echo "===================== checking commit readyness from org 1 ===================== "
}

checkCommitReadyness_2() {
    setGlobalsForPeer1Customer
    peer lifecycle chaincode checkcommitreadiness \
        --channelID $CHANNEL_NAME_2 --name ${CC_NAME_2} --version ${VERSION_2} \
        --sequence ${VERSION_2} --output json 
    echo "===================== checking commit readyness from org 2 ===================== "
}
# checkCommitReadyness

approveForMyOrg1_1() {
    setGlobalsForPeer0Customer
     peer lifecycle chaincode approveformyorg -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME_1 --name ${CC_NAME_1} \
        --collections-config $PRIVATE_DATA_CONFIG \
        --version ${VERSION_1} --package-id ${PACKAGE_ID_1} --sequence ${VERSION_1}

    echo "===================== chaincode approved from org 1 ===================== "

}

approveForMyOrg2_1() {
    setGlobalsForPeer0Manufacturer

    peer lifecycle chaincode approveformyorg -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME_1 --name ${CC_NAME_1} \
        --collections-config $PRIVATE_DATA_CONFIG \
        --version ${VERSION_1} --package-id ${PACKAGE_ID_1} --sequence ${VERSION_1}

    echo "===================== chaincode approved from org 2 ===================== "
}

approveForMyOrg3_1() {
    setGlobalsForPeer0RawMaterialSupplier

    peer lifecycle chaincode approveformyorg -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME_1 --name ${CC_NAME_1} \
        --collections-config $PRIVATE_DATA_CONFIG \
        --version ${VERSION_1} --package-id ${PACKAGE_ID_1} --sequence ${VERSION_1}

    echo "===================== chaincode approved from org 2 ===================== "
}

approveForMyOrg4_1() {
    setGlobalsForPeer0ComponentSupplier

    peer lifecycle chaincode approveformyorg -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME_1 --name ${CC_NAME_1} \
        --collections-config $PRIVATE_DATA_CONFIG \
        --version ${VERSION_1} --package-id ${PACKAGE_ID_1} \
        --sequence ${VERSION_1}

    echo "===================== chaincode approved from org 2 ===================== "
}

approveForMyOrg1_2() {
    setGlobalsForPeer1Customer
    peer lifecycle chaincode approveformyorg -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME_2 --name ${CC_NAME_2} \
        --package-id ${PACKAGE_ID_2} --sequence ${VERSION_2} \
        --version ${VERSION_2} 

    echo "===================== chaincode approved from org 1 ===================== "

}

approveForMyOrg2_2() {
    setGlobalsForPeer1Manufacturer

    peer lifecycle chaincode approveformyorg -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME_2 --name ${CC_NAME_2} \
        --version ${VERSION_2} --package-id ${PACKAGE_ID_2} --sequence ${VERSION_2}

    echo "===================== chaincode approved from org 2 ===================== "
}

approveForMyOrg3_2() {
    setGlobalsForPeer1RawMaterialSupplier

    peer lifecycle chaincode approveformyorg -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME_2 --name ${CC_NAME_2} \
        --package-id ${PACKAGE_ID_2} --sequence ${VERSION_2} \
        --version ${VERSION_2} 

    echo "===================== chaincode approved from org 2 ===================== "
}

approveForMyOrg4_2() {
    setGlobalsForPeer1ComponentSupplier

    peer lifecycle chaincode approveformyorg -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME_2 --name ${CC_NAME_2} \
        --package-id ${PACKAGE_ID_2} --sequence ${VERSION_2} \
        --version ${VERSION_2} 

    echo "===================== chaincode approved from org 2 ===================== "
}



commitChaincodeDefination_1() {
    setGlobalsForPeer0Customer
    peer lifecycle chaincode commit -o localhost:6050 --ordererTLSHostnameOverride orderer.ibo.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        --channelID $CHANNEL_NAME_1 --name ${CC_NAME_1} \
        --collections-config $PRIVATE_DATA_CONFIG \
        --peerAddresses localhost:6051 --tlsRootCertFiles $PEER0_CUSTOMER_CA \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA \
        --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_RAWMATERIAL_SUPPLIER_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_COMPONENT_SUPPLIER_CA \
        --version ${VERSION_1} --sequence ${VERSION_1} 

}

commitChaincodeDefination_2() {
    setGlobalsForPeer1Customer
    peer lifecycle chaincode commit -o localhost:6050 --ordererTLSHostnameOverride orderer.ibo.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        --channelID $CHANNEL_NAME_2 --name ${CC_NAME_2} \
        --peerAddresses localhost:6055 --tlsRootCertFiles $PEER1_CUSTOMER_CA \
        --peerAddresses localhost:7055 --tlsRootCertFiles $PEER1_MANUFACTURER_CA \
        --peerAddresses localhost:8055 --tlsRootCertFiles $PEER1_RAWMATERIAL_SUPPLIER_CA \
        --peerAddresses localhost:9055 --tlsRootCertFiles $PEER1_COMPONENT_SUPPLIER_CA \
        --version ${VERSION_2} --sequence ${VERSION_2} 
}

queryCommitted_1() {
    setGlobalsForPeer0Customer
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME_1 --name ${CC_NAME_1} 
}

queryCommitted_2() {
    setGlobalsForPeer1Customer
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME_2 --name ${CC_NAME_2} 
}

# queryCommitted

chaincodeInvokeInit_1() {
    setGlobalsForPeer0Customer
    peer chaincode invoke -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        -C $CHANNEL_NAME_1 -n ${CC_NAME_1} \
        --peerAddresses localhost:6051 --tlsRootCertFiles $PEER0_CUSTOMER_CA \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA \
        --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_RAWMATERIAL_SUPPLIER_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_COMPONENT_SUPPLIER_CA \
        -c '{"function": "initLedger","Args":[]}'
}

chaincodeInvokeInit_2() {
    setGlobalsForPeer1Customer
    peer chaincode invoke -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        -C $CHANNEL_NAME_2 -n ${CC_NAME_2} \
        --peerAddresses localhost:6055 --tlsRootCertFiles $PEER1_CUSTOMER_CA \
        --peerAddresses localhost:7055 --tlsRootCertFiles $PEER1_MANUFACTURER_CA \
        --peerAddresses localhost:8055 --tlsRootCertFiles $PEER1_RAWMATERIAL_SUPPLIER_CA \
        --peerAddresses localhost:9055 --tlsRootCertFiles $PEER1_COMPONENT_SUPPLIER_CA \
        -c '{"function": "initLedger","Args":[]}'

}

# chaincodeInvokeInit

chaincodeInvoke() {
    setGlobalsForPeer0Customer
    peer chaincode invoke -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com \
        --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA \
        -C $CHANNEL_NAME_2 -n ${CC_NAME_1}  \
        --peerAddresses localhost:6055 --tlsRootCertFiles $PEER1_CUSTOMER_CA \
        --peerAddresses localhost:7055 --tlsRootCertFiles $PEER1_MANUFACTURER_CA \
        --peerAddresses localhost:8055 --tlsRootCertFiles $PEER1_RAWMATERIAL_SUPPLIER_CA \
        --peerAddresses localhost:9055 --tlsRootCertFiles $PEER1_COMPONENT_SUPPLIER_CA \
         -c '{"function": "createOrderDetails", "Args":["0006"]}' 
    
}

# chaincodeInvoke

chaincodeQuery() {
    setGlobalsForPeer0Customer
    peer chaincode query -C $CHANNEL_NAME_1 -n ${CC_NAME_1} -c '{"function": "getAllOrderForOrgName","Args":["Customer","5","1"]}'
}

#Add private Data

## Add private data
addPrivateData() {
    setGlobalsForPeer0Manufacturer
    export ORDER=$(echo -n "{\"orderId\":\"11122\",\"initiatorOrgName\":\"Customer\",\"payload\":\"dffedfs\"}" | base64 | tr -d \\n)
    peer chaincode invoke -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com \
        --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA \
        -C $CHANNEL_NAME_1 -n ${CC_NAME_1}  \
        --peerAddresses localhost:6051 --tlsRootCertFiles $PEER0_CUSTOMER_CA \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA \
        --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_RAWMATERIAL_SUPPLIER_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_COMPONENT_SUPPLIER_CA \
        -c '{"function": "updateOrderDetails", "Args":[]}' \
         --transient "{\"order\":\"$ORDER\"}"

}

#Query
query(){
    setGlobalsForPeer0Customer
    peer chaincode query -C $CHANNEL_NAME_1 -n ${CC_NAME_1} -c '{"function": "getAllOrderForOrgName","Args":["Customer"]}'
}

# Run this function if you add any new dependency in chaincode
#presetup


packageChaincode_1
installChaincode_1
queryInstalled_1
checkCommitReadyness_1

approveForMyOrg1_1
approveForMyOrg2_1
approveForMyOrg3_1
approveForMyOrg4_1
checkCommitReadyness_1
commitChaincodeDefination_1
queryCommitted_1

chaincodeInvokeInit_1


packageChaincode_2
installChaincode_2
queryInstalled_2
checkCommitReadyness_2

approveForMyOrg1_2
approveForMyOrg2_2
approveForMyOrg3_2
approveForMyOrg4_2
checkCommitReadyness_2
commitChaincodeDefination_2
queryCommitted_2

 chaincodeInvokeInit_2



#addPrivateData
#query
