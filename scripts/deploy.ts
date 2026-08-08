import hre from "hardhat";

async function main() {
  console.log("==========================================");
  console.log("DEPLOYING MONADOPOLIS CONTRACT TO MONAD TESTNET");
  console.log("==========================================");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hardhatEthers = (hre as any).ethers;
  const [deployer] = await hardhatEthers.getSigners();
  console.log("Deployer Wallet Address:", deployer.address);

  const balance = await hardhatEthers.provider.getBalance(deployer.address);
  console.log("Deployer MON Balance:", hardhatEthers.formatEther(balance), "MON");

  const Monadopolis = await hardhatEthers.getContractFactory("Monadopolis");
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
