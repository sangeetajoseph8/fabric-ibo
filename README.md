# Blockchain-based Supply Chain using Hyperledger Fabric 

Component provenance tracing through blockchain-based, trackable data exchange for safety-critical industrial supply chains

## Abstract
Traditional business relations between members in a supply-chain context involve
lengthy and error-prone processes of communication with little reliability and safety,
which result in low trust environments where product and document tampering is
hard to avoid. This is a fatal condition for high-risk manufacturing industries where
product history must be reliable beyond doubt to ensure the end result is to be trusted. In this dissertation, we introduce the concepts of blockchain as the best tamper-proof network for transactions, we show how such technology could benefit private supply chain scenarios by delivering a transparent data flow from the raw material supplier all the way to the end customer while guaranteeing efficient traceability, trust among peers and privacy. 

## Set up 

Node - v10.22.0

Docker - v19.03.5

docker-compose - v1.25.2

Java - v8

[Fabric samples](https://hyperledger-fabric.readthedocs.io/en/latest/install.html)

## Start Fabric Network

```bash
./start.sh
```

## Start Fabric Client

```bash
cd api-1.4
node app.js
```


## Start React Application
```bash
cd react/supply-chain-ui/
npm start
```

## Steps

Register the user to get the authorization token.

Refer to the clips in the video folder.

One can run the smart contracts with the help of HTTP calls using the postman collections

## Components

1. Fabric Network: Refer artifacts and smart-contract folder

2. Fabric Client: Refer api-1.4 folder

3. React UI: Refer react
