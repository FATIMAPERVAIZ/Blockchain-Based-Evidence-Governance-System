// scripts/addOfficer.js
const hre = require("hardhat");

async function main() {
  const EVIDENCE_REGISTRY = "0xd0cF937Ea43D9A944708d6a8fD712bcF5263B1Cb"; // from deploy output
  const OFFICER_ADDRESS   = "0xc0159d8628690Eb8D3F9D2d7d1f0dCB2Fb83B22c"; // paste your MetaMask address

  const registry = await hre.ethers.getContractAt("EvidenceRegistry", EVIDENCE_REGISTRY);
  const tx = await registry.addOfficer(OFFICER_ADDRESS);
  await tx.wait();
  console.log("✅ Officer added:", OFFICER_ADDRESS);
}

main().catch(console.error);