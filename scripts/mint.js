async function main() {
  const NFT = await hre.ethers.getContractFactory("CnMGame");
  const { CNMGAME_ADDRESS } = process.env;
  const contract = NFT.attach(CNMGAME_ADDRESS);
  await contract.mintReveal();
}
main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});