/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { API_KEY, API_URL, PRIVATE_KEY } = process.env;

module.exports = {
   solidity: {
      version: "0.8.4",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
   },
   etherscan: {
      apiKey: API_KEY
   },
   defaultNetwork: "rinkeby",
   networks: {
      hardhat: {},
      rinkeby: {
         url: API_URL,
         accounts: [PRIVATE_KEY]
      }
   },
}


