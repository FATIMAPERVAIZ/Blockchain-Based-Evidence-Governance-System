const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment on Sepolia...");

  // Deploy OfficerToken
  const OfficerToken = await hre.ethers.getContractFactory("OfficerToken");
  const officerToken = await OfficerToken.deploy();
  await officerToken.waitForDeployment();
  console.log("✅ OfficerToken deployed to:", officerToken.target);
 
  // Deploy EvidenceRegistry
  const EvidenceRegistry = await hre.ethers.getContractFactory("EvidenceRegistry");
  const evidenceRegistry = await EvidenceRegistry.deploy();
  await evidenceRegistry.waitForDeployment();
  console.log("✅ EvidenceRegistry deployed to:", evidenceRegistry.target);

  // Deploy Governance
  const Governance = await hre.ethers.getContractFactory("Governance");
  const governance = await Governance.deploy();
  await governance.waitForDeployment();
  console.log("✅ Governance deployed to:", governance.target);

  // Deploy AuditLog
  const AuditLog = await hre.ethers.getContractFactory("AuditLog");
  const auditLog = await AuditLog.deploy();
  await auditLog.waitForDeployment();
  console.log("✅ AuditLog deployed to:", auditLog.target);

  console.log("\n All contracts deployed successfully on Sepolia!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});