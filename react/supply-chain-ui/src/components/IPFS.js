const IPFS = require('ipfs-api')
const ipfs = new IPFS({
    host: 'ipfs.infura.io', port: 5001, protocol: 'https'
    // , headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    // }
});
export default {

    saveToIpfs(buffer, options = {}) {
        console.log(buffer)
        ipfs.files.add(Buffer.from(buffer), (error, result) => {
            if (error) {
                console.error('Error:', error)
                options(null)
                return
            }
            console.log('ipfsFileHash', result[0].hash)
            options([result[0].hash])
        })
    },

    getIpfsFile(path, options = {}) {
        ipfs.files.get(path)
    }

}
