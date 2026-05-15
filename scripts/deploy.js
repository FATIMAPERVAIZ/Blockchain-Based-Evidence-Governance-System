async function main() {

    const OfficerToken = await ethers.getContractFactory("OfficerToken");

    const token = await OfficerToken.deploy();

    await token.waitForDeployment();

    console.log("OfficerToken deployed to:", await token.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});