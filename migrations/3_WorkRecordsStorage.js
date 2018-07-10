const TokenContract = artifacts.require("WATT");
const WorkRecordsStorage = artifacts.require("WorkRecordsStorage");

module.exports = async function(deployer) {
  deployer.deploy(WorkRecordsStorage, TokenContract.address);
};
