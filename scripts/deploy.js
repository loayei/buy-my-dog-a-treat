const hre = require("hardhat");

async function main() {
    // Get the contracts to deploy and deploy them
  const BuyTreats = await hre.ethers.getContractFactory("BuyTreats");
  const buyTreats = await BuyTreats.deploy();
  await buyTreats.deployed();
  console.log("BuyTreats deployed into: ", buyTreats.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
