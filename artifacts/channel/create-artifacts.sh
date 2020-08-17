
# chmod -R 0755 ./crypto-config
# # Delete existing artifacts
rm -rf ./crypto-config
rm genesis.block order-details.tx product-history.tx
rm -rf ../../channel-artifacts/*

# #Generate Crypto artifactes for organizations
cryptogen generate --config=./crypto-config.yaml --output=./crypto-config/

# # System channel
SYS_CHANNEL="sys-channel"

# # channel name defaults to "orderdetails"
CHANNEL_NAME_1="order-details"
CHANNEL_NAME_2="product-history"

# # Generate System Genesis block
configtxgen -profile OrdererGenesis -configPath . -channelID $SYS_CHANNEL  -outputBlock ./genesis.block


# # Generate channel configuration block for both channels
configtxgen -profile BasicChannel -configPath . -outputCreateChannelTx ./order-details.tx -channelID $CHANNEL_NAME_1
configtxgen -profile BasicChannel -configPath . -outputCreateChannelTx ./product-history.tx -channelID $CHANNEL_NAME_2

echo "#######    Generating anchor peer update for CustomerMSP  ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./CustomerMSPAnchors.tx -channelID $CHANNEL_NAME_1 -asOrg CustomerMSP
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./CustomerMSPAnchors.tx -channelID $CHANNEL_NAME_2 -asOrg CustomerMSP

echo "#######    Generating anchor peer update for ManufacturerMSP  ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./ManufacturerMSPAnchors.tx -channelID $CHANNEL_NAME_1 -asOrg ManufacturerMSP
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./ManufacturerMSPAnchors.tx -channelID $CHANNEL_NAME_2 -asOrg ManufacturerMSP

echo "#######    Generating anchor peer update for RawMaterialSupplierMSP  ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./RawMaterialSupplierMSPAnchors.tx -channelID $CHANNEL_NAME_1 -asOrg RawMaterialSupplierMSP
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./RawMaterialSupplierMSPAnchors.tx -channelID $CHANNEL_NAME_2 -asOrg RawMaterialSupplierMSP

echo "#######    Generating anchor peer update for ComponentSupplierMSP  ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./ComponentSupplierMSPAnchors.tx -channelID $CHANNEL_NAME_1 -asOrg ComponentSupplierMSP
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./ComponentSupplierMSPAnchors.tx -channelID $CHANNEL_NAME_2 -asOrg ComponentSupplierMSP
