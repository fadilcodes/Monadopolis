import hre from "hardhat";

async function main() {
  console.log("==========================================");
  console.log("DEPLOYING MONADOPOLIS CONTRACT TO MONAD TESTNET");
  console.log("==========================================");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer Wallet Address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer MON Balance:", hre.ethers.formatEther(balance), "MON");

  const Monadopolis = await hre.ethers.getContractFactory("Monadopolis");
  console.log("Deploying Monadopolis.sol contract...");

  const contract = await Monadopolis.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("\n✅ DEPLOYMENT SUCCESSFUL!");
  console.log("------------------------------------------");
  console.log("Contract Address :", contractAddress);
  console.log("Network          : Monad Testnet (Chain ID 10143)");
  console.log("Explorer Link    : https://testnet.monadscan.com/address/" + contractAddress);
  console.log("==========================================");
}

main().catch((error) => {
  console.error("❌ Deployment Failed:", error);
  process.exitCode = 1;
});
