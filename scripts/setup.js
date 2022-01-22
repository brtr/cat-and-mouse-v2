const traits = require("../data.json");
const { TRAITS_ADDRESS, HABITAT_ADDRESS, CHEDDAR_ADDRESS, CNMGAME_ADDRESS, CNM_ADDRESS, HOUSEGAME_ADDRESS, HOUSE_ADDRESS, RANDOM_ADDRESS, CNM_CHEDDAR_ADDRESS, HOUSE_TRAITS_ADDRESS } = process.env;
const main = async () => {
  let contractFactory = await hre.ethers.getContractFactory('Traits');
  const traitContract = contractFactory.attach(TRAITS_ADDRESS);

  contractFactory = await hre.ethers.getContractFactory('Habitat');
  const habitatContract = contractFactory.attach(HABITAT_ADDRESS);

  contractFactory = await hre.ethers.getContractFactory('CHEDDAR');
  const cheddarContract = contractFactory.attach(CHEDDAR_ADDRESS);

  contractFactory = await hre.ethers.getContractFactory('CnMGame');
  const cnmGameContract = contractFactory.attach(CNMGAME_ADDRESS);

  contractFactory = await hre.ethers.getContractFactory('CnM');
  const CnMContract = contractFactory.attach(CNM_ADDRESS);

  contractFactory = await hre.ethers.getContractFactory('CnMCheddar');
  const CnMCheddarContract = contractFactory.attach(CNM_CHEDDAR_ADDRESS);

  contractFactory = await hre.ethers.getContractFactory('HouseTraits');
  const houseTraitsContract = contractFactory.attach(HOUSE_TRAITS_ADDRESS);

  contractFactory = await hre.ethers.getContractFactory('HouseGame');
  const houseGameContract = contractFactory.attach(HOUSEGAME_ADDRESS);

  contractFactory = await hre.ethers.getContractFactory('House');
  const houseContract = contractFactory.attach(HOUSE_ADDRESS);

  for (const trait of traits) {
    const traitIds = [...Array(trait.data.length).keys()];
    tx = await traitContract.uploadTraits(trait.id, traitIds, trait.data);
    tx.wait();
  }
  console.log("Uploaded Traits Data");

  let txn = await traitContract.setCnM(CNM_CHEDDAR_ADDRESS);
  txn.wait();
  console.log("set cnm for traits success");
  txn = await habitatContract.setContracts(CNM_CHEDDAR_ADDRESS, CHEDDAR_ADDRESS, CNMGAME_ADDRESS, HOUSEGAME_ADDRESS, RANDOM_ADDRESS, HOUSE_ADDRESS);
  txn.wait();
  txn = await habitatContract.setPaused(false);
  txn.wait();
  console.log("set habitat contract success");
  txn = await cheddarContract.addAdmin(CNMGAME_ADDRESS);
  txn.wait();
  txn = await cheddarContract.addAdmin(HOUSEGAME_ADDRESS);
  txn.wait();
  txn = await cheddarContract.addAdmin(HABITAT_ADDRESS);
  txn.wait();
  console.log("set cheddar admin success");
  txn = await cnmGameContract.addAdmin(CNMGAME_ADDRESS);
  txn.wait();
  txn = await cnmGameContract.setContracts(CHEDDAR_ADDRESS, TRAITS_ADDRESS, CNM_CHEDDAR_ADDRESS, HABITAT_ADDRESS, RANDOM_ADDRESS);
  txn.wait();
  txn = await cnmGameContract.togglePublicSale();
  txn.wait();
  txn = await cnmGameContract.setAllowCommits(true);
  txn.wait();
  txn = await cnmGameContract.setPaused(false);
  txn.wait();
  console.log("set cnm game contract success");
  txn = await CnMContract.setContracts(TRAITS_ADDRESS, HABITAT_ADDRESS, RANDOM_ADDRESS);
  txn.wait();
  txn = await CnMContract.addAdmin(CNMGAME_ADDRESS);
  txn.wait();
  txn = await CnMContract.addAdmin(HABITAT_ADDRESS);
  txn.wait();
  txn = await CnMContract.setPaused(false);
  txn.wait();
  console.log("set cnm contract success");
  txn = await CnMCheddarContract.setContracts(TRAITS_ADDRESS, HABITAT_ADDRESS, RANDOM_ADDRESS, CNM_ADDRESS);
  txn.wait();
  txn = await CnMCheddarContract.addAdmin(CNMGAME_ADDRESS);
  txn.wait();
  txn = await CnMCheddarContract.addAdmin(HABITAT_ADDRESS);
  txn.wait();
  txn = await CnMCheddarContract.setPaused(false);
  txn.wait();
  txn = await CnMCheddarContract.setMinted();
  txn.wait();
  console.log("set cnm cheddar contract success");
  txn = await houseTraitsContract.setCnM(HOUSE_ADDRESS);
  txn.wait();
  console.log("set house traits contract success");
  txn = await houseContract.addAdmin(HOUSEGAME_ADDRESS);
  txn.wait();
  txn = await houseContract.addAdmin(HABITAT_ADDRESS);
  txn.wait();
  txn = await houseContract.setContracts(HOUSE_TRAITS_ADDRESS, HABITAT_ADDRESS, RANDOM_ADDRESS);
  txn.wait();
  txn = await houseContract.setPaused(false);
  txn.wait();
  console.log("set house contract success");
  txn = await houseGameContract.addAdmin(CNMGAME_ADDRESS);
  txn.wait();
  txn = await houseGameContract.setContracts(CHEDDAR_ADDRESS, HOUSE_TRAITS_ADDRESS, HABITAT_ADDRESS, HOUSE_ADDRESS, RANDOM_ADDRESS);
  txn.wait();
  txn = await houseGameContract.setPaused(false);
  txn.wait();
  console.log("set house game contract success");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();