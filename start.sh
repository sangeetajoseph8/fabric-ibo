docker-compose -f ./artifacts/docker-compose.yaml down

sleep 2

docker-compose -f ./artifacts/docker-compose.yaml up -d

sleep 5
./createChannel.sh

sleep 2

./deployChaincode.sh