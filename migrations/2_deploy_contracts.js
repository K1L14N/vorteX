const VorteX = artifacts.require('./VorteX.sol');

module.exports = function (deployer) {
    deployer.deploy(VorteX, 54, 83);
};
