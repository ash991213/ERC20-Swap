import { ethers } from 'hardhat';

async function main() {
	const TestToken = await ethers.getContractFactory('TestToken');
	const testToken = await TestToken.deploy('TestToken', 'TT');
	await testToken.deployed();
	console.log(`TestToken deployed to: ${testToken.address}`);

	const TokenSwap = await ethers.getContractFactory('TokenSwap');
	const tokenSwap = await TokenSwap.deploy(testToken.address);
	await tokenSwap.deployed();
	console.log(`TokenSwap deployed to: ${tokenSwap.address}`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
