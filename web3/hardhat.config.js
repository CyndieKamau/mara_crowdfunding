require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config({path: '.env'});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "maratestnet",
  networks: {
    maratestnet: {
      url: "https://mara-testnet.calderachain.xyz/http",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 123456,
    },
  },
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

//0xc05b19326fc9150d6aa5ed188030014dc1b0f55b
