'use strict';

var { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const yaml = require('js-yaml');

const util = require('util');

const getCCP = async (org) => {
    let ccpPath;
    if (org == "Customer") {
        ccpPath = path.resolve(__dirname, '..', 'config', 'connection-customer.yaml');
    } else if (org == "Manufacturer") {
        ccpPath = path.resolve(__dirname, '..', 'config', 'connection-manufacturer.yaml');
    } else if (org == "ComponentSupplier") {
        ccpPath = path.resolve(__dirname, '..', 'config', 'connection-componentsupplier.yaml');
    } else if (org == "RawMaterialSupplier") {
        ccpPath = path.resolve(__dirname, '..', 'config', 'connection-rawmaterialsupplier.yaml');
    } else
        return null
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
    const ccp = yaml.safeLoad(ccpJSON);
    return ccp
}

const getCaUrl = async (org, ccp) => {
    let caURL ;
    if (org == "Customer") {
        caURL = ccp.certificateAuthorities['ca.customer.ibo.com'].url;
    } else if (org == "Manufacturer") {
        caURL = ccp.certificateAuthorities['ca.manufacturer.ibo.com'].url;
    } else if (org == "ComponentSupplier") {
        caURL = ccp.certificateAuthorities['ca.componentsupplier.ibo.com'].url;
    } else if (org == "RawMaterialSupplier") {
        caURL = ccp.certificateAuthorities['ca.rawmaterialsupplier.ibo.com'].url;
    } else
        return null
    return caURL

}

const getWalletPath = async (org) => {
    let walletPath;
    if (org == "Customer") {
        walletPath = path.join(process.cwd(), 'api-2.0/customer-wallet');
    } else if (org == "Manufacturer") {
        walletPath = path.join(process.cwd(), 'api-2.0/manufacturer-wallet');
    } else if (org == "ComponentSupplier") {
        walletPath = path.join(process.cwd(), 'api-2.0/componentsupplier-wallet');
    } else if (org == "RawMaterialSupplier") {
        walletPath = path.join(process.cwd(), 'api-2.0/rawmaterialsupplier-wallet');
    }else
        return null
    return walletPath

}

const getAffiliation = async (org) => {
    return org == "Customer" ? 'customer.department1' : 'manufaturer.department1'
}

const getRegisteredUser = async (username, userOrg, isJson) => {
    let ccp = await getCCP(userOrg)

    const caURL = await getCaUrl(userOrg, ccp)
    const ca = new FabricCAServices(caURL);

    const walletPath = await getWalletPath(userOrg)
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userIdentity = await wallet.get(username);
    if (userIdentity) {
        console.log(`An identity for the user ${username} already exists in the wallet`);
        var response = {
            success: true,
            message: username + ' enrolled Successfully',
        };
        return response
    }

    // Check to see if we've already enrolled the admin user.
    let adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        console.log('An identity for the admin user "admin" does not exist in the wallet');
        await enrollAdmin(userOrg, ccp);
        adminIdentity = await wallet.get('admin');
        console.log("Admin Enrolled Successfully")
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    let secret;
    try {
        // Register the user, enroll the user, and import the new identity into the wallet.
     secret = await ca.register({  enrollmentID: username, role: 'client' }, adminUser);
    // const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: username, role: 'client', attrs: [{ name: 'role', value: 'approver', ecert: true }] }, adminUser);

    } catch (error) {
        return error.message
    }
    
    const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });
    // const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret, attr_reqs: [{ name: 'role', optional: false }] });

    let x509Identity;
    if (userOrg == "Customer") {
        x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'CustomerMSP',
            type: 'X.509',
        };
    } else if (userOrg == "Manufacturer") {
        x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'ManufacturerMSP',
            type: 'X.509',
        };
    }

    await wallet.put(username, x509Identity);
    console.log(`Successfully registered and enrolled admin user ${username} and imported it into the wallet`);

    var response = {
        success: true,
        message: username + ' enrolled Successfully',
    };
    return response
}


const getCaInfo = async (org, ccp) => {
    let caInfo
    if (org == "Customer") {
        caInfo = ccp.certificateAuthorities['ca.customer.ibo.com'];
    } else if (org == "Manufacturer") {
        caInfo = ccp.certificateAuthorities['ca.manufacturer.ibo.com'];
    } else if (org == "ComponentSupplier") {
        caInfo = ccp.certificateAuthorities['ca.componentsupplier.ibo.com'];
    } else if (org == "RawMaterialSupplier") {
        caInfo = ccp.certificateAuthorities['ca.rawmaterialsupplier.ibo.com'];
    }else
        return null
    return caInfo

}

const enrollAdmin = async (org, ccp) => {

    console.log('calling enroll Admin method')

    try {

        const caInfo = await getCaInfo(org, ccp) //ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = await getWalletPath(org) //path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        let x509Identity;
        if (org == "Customer") {
            x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'CustomerMSP',
                type: 'X.509',
            };
        } else if (org == "Manufacturer") {
            x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'ManufacturerMSP',
                type: 'X.509',
            };
        } else if (org == "RawMaterialSupplier") {
            x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'RawMaterialSupplierMSP',
                type: 'X.509',
            };
    
        } else if (org == "ComponentSupplier") {
            x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'ComponentSupplierMSP',
                type: 'X.509',
            };
    
        }


        await wallet.put('admin', x509Identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
        return


    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
    }


}


exports.getRegisteredUser = getRegisteredUser

module.exports = {
    getCCP: getCCP,
    getWalletPath: getWalletPath,
    getRegisteredUser: getRegisteredUser

}
