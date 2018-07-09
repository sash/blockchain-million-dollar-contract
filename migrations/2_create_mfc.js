var MFC = artifacts.require("./MFC.sol");

const ETHER = 10 ** 18;

module.exports = function (deployer) {
    deployer.deploy(MFC, 1 * ETHER);
};
