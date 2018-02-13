const Migrations = artifacts.require("./Migrations.sol");
const EventStore = artifacts.require("./EventStore.sol");

module.exports = (deployer) => {
  deployer.deploy(Migrations);
  deployer.deploy(EventStore);
};
