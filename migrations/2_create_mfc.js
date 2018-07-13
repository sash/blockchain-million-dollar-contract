var MFC = artifacts.require("./MFC.sol");

const ETHER = 10 ** 18;
const FINNEY = 10 ** 15;

module.exports = function (deployer) {
    deployer.deploy(MFC, 0.1 * ETHER);
};
