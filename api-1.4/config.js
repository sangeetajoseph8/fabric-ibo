var util = require('util');
var path = require('path');
var hfc = require('fabric-client');

var file = 'network-config%s.yaml';

var env = process.env.TARGET_NETWORK;
if (env)
	file = util.format(file, '-' + env);
else
	file = util.format(file, '');
// indicate to the application where the setup file is located so it able
// to have the hfc load it to initalize the fabric client instance
hfc.setConfigSetting('network-connection-profile-path',path.join(__dirname, 'artifacts' ,file));
hfc.setConfigSetting('Customer-connection-profile-path',path.join(__dirname, 'artifacts', 'customer.yaml'));
hfc.setConfigSetting('Manufacturer-connection-profile-path',path.join(__dirname, 'artifacts', 'manufacturer.yaml'));
hfc.setConfigSetting('RawMaterialSupplier-connection-profile-path',path.join(__dirname, 'artifacts', 'rawmaterialsupplier.yaml'));
hfc.setConfigSetting('ComponentSupplier-connection-profile-path',path.join(__dirname, 'artifacts', 'componentsupplier.yaml'));

// some other settings the application might need to know
hfc.addConfigFile(path.join(__dirname, 'config.json'));
