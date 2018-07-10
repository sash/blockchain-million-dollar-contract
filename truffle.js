/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  networks: {
      development:{
          host: '127.0.0.1',
          port: 8545,
          network_id: "*",
          gas: 6000000
      },
      coverage: {
          host: "127.0.0.1",
          port: 8555,
          network_id: "*",
          gas: 0xfffffffffff, // <-- Use this high gas value
          gasPrice: 0x01,      // <-- Use this low gas price
          skipFiles: ['strings.sol', 'Migrations.sol', 'StringUtils.sol', 'SafeMath.sol']
      },
      ropsten: {
          network_id: 3,
          provider: () => {
              const PrivateKeyProvider = require("truffle-privatekey-provider");
              const ropstenPrivateKey = "AC9345C8F7BAFF060FC65E9F46C82412499A3A544CFFAC44D87F1E5E4F4E3F2F";
              const ropstenProvider = new PrivateKeyProvider(ropstenPrivateKey, "https://ropsten.infura.io/QqFmemiGVhIX9ku162hM")

              return ropstenProvider;
          },
          gas: 2900000
      }
  }
};
