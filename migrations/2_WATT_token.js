var TokenContract = artifacts.require("WATT");

module.exports = async function(deployer, network, accounts) {

  if (network == "staging") {
    await TokenContract.at('0x0290fb167208af455bb137780163b7b7a9a10c16');
  } else if(network == "live") {
    await TokenContract.at('0x829a4ca1303383f1082b6b1fb937116e4b3b5605');
  } else {
    await deployer.deploy(TokenContract);
  }
};