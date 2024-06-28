// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
const hre = require("hardhat");

async function main() {
  const initBalance = 1;
  const initialOwner = "0xYourOwnerAddressHere"; // Replace with the actual address of Shivam Gupta
  const initialInterestRate = 700; // 7% in basis points

  const Assessment = await hre.ethers.getContractFactory("Assessment");
  const assessment = await Assessment.deploy(initBalance, initialOwner, initialInterestRate);
  await assessment.deployed();

  console.log(`A contract with balance of ${initBalance} ETH, owner ${initialOwner}, and interest rate ${initialInterestRate / 100}% deployed to ${assessment.address}`);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


