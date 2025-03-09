const hre = require("hardhat");

async function main() {
  // Get the first account from the local Hardhat network
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const InvestmentContract = await hre.ethers.getContractFactory("InvestmentContract");
  const contract = await InvestmentContract.deploy(
    deployer.address, // Use the deployer's address as the investor
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Use the second account as the startup
    100000, // Investment amount (in wei, e.g., 100000 wei = 0.0001 ETH)
    10 // Equity percentage (e.g., 10%)
  );

  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });