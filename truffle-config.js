require("dotenv").config();
require("babel-register");
require("babel-polyfill");

const HDWalletProvider = require("truffle-hdwallet-provider");

const providerWithMnemonic = (mnemonic, rpcEndpoint) =>
    new HDWalletProvider(mnemonic, rpcEndpoint);

const infuraProvider = network =>
    providerWithMnemonic(
        process.env.MNEMONIC || "",
        `https://${network}.infura.io/${process.env.INFURA_API_KEY}`
    );

const ropstenProvider = process.env.SOLIDITY_COVERAGE
    ? undefined
    : infuraProvider("ropsten");

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    contracts_build_directory: "./src/web3/abis",
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*"
        },
        ropsten: {
            provider: ropstenProvider,
            network_id: 3, // eslint-disable-line camelcase
            gas: 4612388
        },
        coverage: {
            host: "localhost",
            network_id: "*",
            port: 8555,
            gas: 0xfffffffffff,
            gasPrice: 0x01
        }
    }
};
