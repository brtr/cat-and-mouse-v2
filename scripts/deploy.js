const hre = require("hardhat");
async function main() {
  let contractFactory = await hre.ethers.getContractFactory("Traits");
  const traitsContract = await contractFactory.deploy();   //CONTRACT INFO
  await traitsContract.deployed();
  console.log("Traits deployed to:", traitsContract.address);

  contractFactory = await hre.ethers.getContractFactory("Randomizer");
  const randomizerContract = await contractFactory.deploy();   //CONTRACT INFO
  await randomizerContract.deployed();
  console.log("Randomizer deployed to:", randomizerContract.address);

  contractFactory = await hre.ethers.getContractFactory("Habitat");
  const habitatContract = await contractFactory.deploy();   //CONTRACT INFO
  await habitatContract.deployed();
  console.log("Habitat deployed to:", habitatContract.address);

  contractFactory = await hre.ethers.getContractFactory("CHEDDAR");
  const CHEDDARContract = await contractFactory.deploy();   //CONTRACT INFO
  await CHEDDARContract.deployed();
  console.log("CHEDDAR deployed to:", CHEDDARContract.address);

  contractFactory = await hre.ethers.getContractFactory("CnMGame");
  const cnmGameContract = await contractFactory.deploy();   //CONTRACT INFO
  await cnmGameContract.deployed();
  console.log("CnMGame deployed to:", cnmGameContract.address);

  contractFactory = await hre.ethers.getContractFactory("CnM");
  const cnmContract = await contractFactory.deploy(50000);   //CONTRACT INFO
  await cnmContract.deployed();
  console.log("CnM deployed to:", cnmContract.address);

  contractFactory = await hre.ethers.getContractFactory("CnMCheddar");
  const cnmCheddarContract = await contractFactory.deploy(50000);   //CONTRACT INFO
  await cnmCheddarContract.deployed();
  console.log("CnM Cheddar deployed to:", cnmCheddarContract.address);

  contractFactory = await hre.ethers.getContractFactory("HouseGame");
  const houseGameContract = await contractFactory.deploy();   //CONTRACT INFO
  await houseGameContract.deployed();
  console.log("HouseGame deployed to:", houseGameContract.address);

  contractFactory = await hre.ethers.getContractFactory("House");
  const houseContract = await contractFactory.deploy(50000);   //CONTRACT INFO
  await houseContract.deployed();
  console.log("House deployed to:", houseContract.address);

  contractFactory = await hre.ethers.getContractFactory("HouseTraits");
  const houseTraitsContract = await contractFactory.deploy();   //CONTRACT INFO
  await houseTraitsContract.deployed();
  console.log("HouseTraits deployed to:", houseTraitsContract.address);
}
main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});
