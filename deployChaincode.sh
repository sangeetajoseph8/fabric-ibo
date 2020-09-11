export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/ibo.com/orderers/orderer.ibo.com/msp/tlscacerts/tlsca.ibo.com-cert.pem
export PEER0_CUSTOMER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/customer.ibo.com/peers/peer0.customer.ibo.com/tls/ca.crt
export PEER0_MANUFACTURER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/manufacturer.ibo.com/peers/peer0.manufacturer.ibo.com/tls/ca.crt
export PEER0_RAWMATERIAL_SUPPLIER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/rawmaterialsupplier.ibo.com/peers/peer0.rawmaterialsupplier.ibo.com/tls/ca.crt
export PEER0_COMPONENT_SUPPLIER_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/componentsupplier.ibo.com/peers/peer0.componentsupplier.ibo.com/tls/ca.crt
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

presetup() {
    echo Building Java dependencies ...
    pushd ./artifacts/src/smart-contracts
    ./gradlew build
    popd
    echo Finished building Java dependencies
}
# presetup

CC_RUNTIME_LANGUAGE="java"
VERSION="1"
CC_SRC_PATH="./artifacts/src/smart-contracts"
CC_NAME="orderdetails"

packageChaincode() {
    rm -rf ${CC_NAME}.tar.gz
    setGlobalsForPeer0Customer
    peer lifecycle chaincode package ${CC_NAME}.tar.gz \
        --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} \
        --label ${CC_NAME}_${VERSION}

    echo "===================== Chaincode is packaged on peer0.customer ===================== "
}
# packageChaincode

installChaincode() {
    setGlobalsForPeer0Customer
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Order Details Chaincode is installed on peer0.customer ===================== "

    setGlobalsForPeer0Manufacturer
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Order Details Chaincode is installed on peer0.manufacturer ===================== "

    setGlobalsForPeer0RawMaterialSupplier
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Order Details Chaincode is installed on peer0.rawMaterialsupplier ===================== "
    
    setGlobalsForPeer0ComponentSupplier
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Order Details Chaincode is installed on peer0.componentsupplier ===================== "
}

# installChaincode

queryInstalled() {
    setGlobalsForPeer0Customer
    peer lifecycle chaincode queryinstalled >&log.txt
    cat log.txt
    PACKAGE_ID=$(sed -n "/${CC_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    echo PackageID is ${PACKAGE_ID}
    echo "===================== Query installed successful on peer0.customer on channel ===================== "
}

# queryInstalled

checkCommitReadyness() {
    setGlobalsForPeer0Customer
    peer lifecycle chaincode checkcommitreadiness \
        --collections-config $PRIVATE_DATA_CONFIG \
        --channelID $CHANNEL_NAME_1 --name ${CC_NAME} --version ${VERSION} \
        --sequence ${VERSION} --output json 
    echo "===================== checking commit readyness from org 1 ===================== "
}

# checkCommitReadyness

# --collections-config ./artifacts/private-data/collections_config.json \
# --signature-policy "OR('Org1MSP.member','Org2MSP.member')" \
# --collections-config $PRIVATE_DATA_CONFIG \

approveForMyOrg1() {
    setGlobalsForPeer0Customer
    # set -x
    peer lifecycle chaincode approveformyorg -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com --tls \
        --collections-config $PRIVATE_DATA_CONFIG \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME_1 --name ${CC_NAME} --version ${VERSION}  --sequence ${VERSION} --package-id ${PACKAGE_ID}
    # set +x

    echo "===================== chaincode approved from org 1 ===================== "

}

# approveForMyOrg1

# --signature-policy "OR ('Org1MSP.member')"
# --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_CUSTOMER_CA --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA
# --peerAddresses peer0.customer.ibo.com:7051 --tlsRootCertFiles $PEER0_CUSTOMER_CA --peerAddresses peer0.org2.ibo.com:9051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA
#--channel-config-policy Channel/Application/Admins
# --signature-policy "OR ('Org1MSP.peer','Org2MSP.peer')"


# --collections-config ./artifacts/private-data/collections_config.json \
# --signature-policy "OR('Org1MSP.member','Org2MSP.member')" \
approveForMyOrg2() {
    setGlobalsForPeer0Manufacturer

    peer lifecycle chaincode approveformyorg -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME_1 --name ${CC_NAME} \
        --collections-config $PRIVATE_DATA_CONFIG \
        --version ${VERSION} --package-id ${PACKAGE_ID} --sequence ${VERSION}

    echo "===================== chaincode approved from org 2 ===================== "
}

approveForMyOrg3() {
    setGlobalsForPeer0RawMaterialSupplier

    peer lifecycle chaincode approveformyorg -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME_1 --name ${CC_NAME} \
        --collections-config $PRIVATE_DATA_CONFIG \
        --version ${VERSION} --package-id ${PACKAGE_ID} --sequence ${VERSION}

    echo "===================== chaincode approved from org 2 ===================== "
}

approveForMyOrg4() {
    setGlobalsForPeer0ComponentSupplier

    peer lifecycle chaincode approveformyorg -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME_1 --name ${CC_NAME} \
        --collections-config $PRIVATE_DATA_CONFIG \
        --version ${VERSION} --package-id ${PACKAGE_ID} --sequence ${VERSION}

    echo "===================== chaincode approved from org 2 ===================== "
}

# checkCommitReadyness() {

#     setGlobalsForPeer0Customer
#     peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME_1 \
#         --peerAddresses localhost:6051 --tlsRootCertFiles $PEER0_CUSTOMER_CA \
#         #--collections-config $PRIVATE_DATA_CONFIG \
#         --name ${CC_NAME} --version ${VERSION} --sequence ${VERSION} --output json --init-required
#     echo "===================== checking commit readyness from org 1 ===================== "
# }

# checkCommitReadyness

commitChaincodeDefination() {
    setGlobalsForPeer0Customer
    peer lifecycle chaincode commit -o localhost:6050 --ordererTLSHostnameOverride orderer.ibo.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        --channelID $CHANNEL_NAME_1 --name ${CC_NAME} \
        --collections-config $PRIVATE_DATA_CONFIG \
        --peerAddresses localhost:6051 --tlsRootCertFiles $PEER0_CUSTOMER_CA \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA \
        --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_RAWMATERIAL_SUPPLIER_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_COMPONENT_SUPPLIER_CA \
        --version ${VERSION} --sequence ${VERSION} 

}

# commitChaincodeDefination

queryCommitted() {
    setGlobalsForPeer0Customer
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME_1 --name ${CC_NAME} 

}

# queryCommitted

chaincodeInvokeInit() {
    setGlobalsForPeer0Customer
    peer chaincode invoke -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        -C $CHANNEL_NAME_1 -n ${CC_NAME} \
        --peerAddresses localhost:6051 --tlsRootCertFiles $PEER0_CUSTOMER_CA \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA \
        --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_RAWMATERIAL_SUPPLIER_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_COMPONENT_SUPPLIER_CA \
        -c '{"Args":[]}'

}

# chaincodeInvokeInit

chaincodeInvoke() {
    setGlobalsForPeer0Customer

    # Create Car
    # peer chaincode invoke -o localhost:7050 \
    #     --ordererTLSHostnameOverride orderer.ibo.com \
    #     --tls $CORE_PEER_TLS_ENABLED \
    #     --cafile $ORDERER_CA \
    #     -C $CHANNEL_NAME_1 -n ${CC_NAME}  \
    #     --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_CUSTOMER_CA \
    #     --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA   \
    #     -c '{"function": "createCar","Args":["Car-ABCDEEE", "Audi", "R8", "Red", "Pavan"]}'

    ## Init ledger
    # peer chaincode invoke -o localhost:6050 \
    #     --ordererTLSHostnameOverride orderer.ibo.com \
    #     --tls $CORE_PEER_TLS_ENABLED \
    #     --cafile $ORDERER_CA \
    #     -C $CHANNEL_NAME_1 -n ${CC_NAME} \
    #     --peerAddresses localhost:6051 --tlsRootCertFiles $PEER0_CUSTOMER_CA \
    #     --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA \
    #     -c '{"function": "initLedger","Args":[]}'

    ## Add private dataCAR=$(echo -n "{\"key\":\"1111\", \"make\":\"Tesla\",\"model\":\"Tesla A1\",\"color\":\"White\",\"owner\":\"pavan\",\"price\":\"10000\"}" | base64 | tr -d \\n)
    peer chaincode invoke -o localhost:6050 \
        --ordererTLSHostnameOverride orderer.ibo.com \
        --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA \
        -C $CHANNEL_NAME_1 -n ${CC_NAME}  \
        --peerAddresses localhost:6051 --tlsRootCertFiles $PEER0_CUSTOMER_CA \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA \
        --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_RAWMATERIAL_SUPPLIER_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_COMPONENT_SUPPLIER_CA \
         -c '{"function": "createOrderDetails", "Args":["0006"]}' 
    
}

# chaincodeInvoke

chaincodeQuery() {
    setGlobalsForPeer0Customer

    # Query all cars
    # peer chaincode query -C $CHANNEL_NAME_1 -n ${CC_NAME} -c '{"Args":["queryAllCars"]}'

    # Query Car by Id
    peer chaincode query -C $CHANNEL_NAME_1 -n ${CC_NAME} -c '{"function": "getAllOrderForOrgName","Args":["Customer","5","1"]}'
    #'{"Args":["GetSampleData","Key1"]}'

    # Query Private Car by Id
    # peer chaincode query -C $CHANNEL_NAME_1 -n ${CC_NAME} -c '{"function": "readPrivateCar","Args":["1111"]}'
    # peer chaincode query -C $CHANNEL_NAME_1 -n ${CC_NAME} -c '{"function": "readCarPrivateDetails","Args":["1111"]}'
}

# chaincodeQuery

# Run this function if you add any new dependency in chaincode
#presetup

#

packageChaincode
installChaincode
queryInstalled
checkCommitReadyness

approveForMyOrg1
approveForMyOrg2
approveForMyOrg3
approveForMyOrg4
checkCommitReadyness
commitChaincodeDefination
queryCommitted

chaincodeInvoke
chaincodeQuery
