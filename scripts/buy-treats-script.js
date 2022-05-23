// scripts/buy-treats-script.js
const hre = require("hardhat");

// Get the Ether balance of an address
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Prints the balance for a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx ++;
  }
}

// Prints the memos stored in the contract
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.owner;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  // Get example accounts
  const [deployer, donater, donater2, donater3] = await hre.ethers.getSigners();

  // Get the contracts to deploy and deploy them
  const BuyTreats = await hre.ethers.getContractFactory("BuyTreats");
  const buyTreats = await BuyTreats.deploy();
  await buyTreats.deployed();
  console.log("BuyTreats deployed into: ", buyTreats.address);

  // Check balance before transaction
  const address = [deployer.address, donater.address, buyTreats.address];
  console.log("~~ Start ~~");
  await printBalances(address);

  // Buy the deployer a treat
  const donation = {value: hre.ethers.utils.parseEther("1")};
  await buyTreats.connect(donater).buyTreat("Elon", "You rock!",donation);;
  await buyTreats.connect(donater2).buyTreat("Jeff", "Great Contract!",donation);
  await buyTreats.connect(donater3).buyTreat("Bill", "Lets hope this works!",donation);

  // Check balance after transaction
  console.log("~~ Treat bought ~~");
  await printBalances(address);

  // Withdraw the donations
  await buyTreats.connect(deployer).withdrawDonation();

  // Check balance after transaction
  console.log("~~ Donation Withdraw ~~");
  await printBalances(address);

  // Print the memos
  console.log("~~ memos ~~");
  const memos = await buyTreats.getMemos();
  printMemos(memos);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
