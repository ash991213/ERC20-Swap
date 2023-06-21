import { ethers } from 'hardhat';
import { Contract, Signer } from 'ethers';
import { expect } from 'chai';

describe('TokenSwap', () => {
	let tokenSwap: Contract;
	let testToken: Contract;
	let owner: Signer;
	let user: Signer;

	const swapTokenAmount = ethers.utils.parseEther('1000');
	const receivedAmount = ethers.utils.parseEther('1');
	const swapAmount = ethers.utils.parseEther('100');

	before(async () => {
		[owner, user] = await ethers.getSigners();

		let TestToken = await ethers.getContractFactory('TestToken');
		testToken = await TestToken.deploy('TestToken', 'TT');

		let TokenSwap = await ethers.getContractFactory('TokenSwap');
		tokenSwap = await TokenSwap.deploy(testToken.address);
	});

	it('should register user', async () => {
		await tokenSwap.connect(owner).registerUser(user.getAddress());

		const isUserRegistered = await tokenSwap.connect(owner).registeredUsers(user.getAddress());

		expect(isUserRegistered).to.be.true;
	});

	it('should swap ETH : ERC20', async () => {
		await testToken.connect(owner).transfer(tokenSwap.address, swapTokenAmount);

		const initialUserBalance = await ethers.provider.getBalance(user.getAddress());

		const transaction = await tokenSwap.connect(user).swapETHToERC20(receivedAmount, swapAmount, { value: receivedAmount });

		const receiptTransaction = await transaction.wait();
		const gasCost = transaction.gasPrice.mul(receiptTransaction.gasUsed);

		const finalUserBalance = await ethers.provider.getBalance(user.getAddress());
		expect(initialUserBalance.sub(finalUserBalance).sub(gasCost)).to.equal(receivedAmount);

		const contractERC20Balance = await testToken.balanceOf(tokenSwap.address);
		expect(contractERC20Balance).to.equal(swapTokenAmount.sub(swapAmount));

		expect(receiptTransaction.events[1].args[0]).to.equal(await user.getAddress());
		expect(receiptTransaction.events[1].args[1]).to.equal(receivedAmount);
		expect(receiptTransaction.events[1].args[2]).to.equal(swapAmount);
	});

	it('should swap ERC20 : ETH', async () => {
		await testToken.connect(owner).transfer(tokenSwap.address, swapTokenAmount);

		const initialUserERC20Balance = await testToken.balanceOf(user.getAddress());
		const initialContractETHBalance = await ethers.provider.getBalance(tokenSwap.address);

		await testToken.connect(user).approve(tokenSwap.address, swapAmount);
		const transaction = await tokenSwap.connect(user).swapERC20ToETH(swapAmount, receivedAmount);
		const receiptTransaction = await transaction.wait();

		const finalUserERC20Balance = await testToken.balanceOf(user.getAddress());
		const finalContractETHBalance = await ethers.provider.getBalance(tokenSwap.address);

		expect(initialUserERC20Balance.sub(swapAmount)).to.equal(finalUserERC20Balance);
		expect(initialContractETHBalance.sub(receivedAmount)).to.equal(finalContractETHBalance);

		expect(receiptTransaction.events[2].args[0]).to.equal(await user.getAddress());
		expect(receiptTransaction.events[2].args[1]).to.equal(swapAmount);
		expect(receiptTransaction.events[2].args[2]).to.equal(receivedAmount);
	});

	it('should withdraw ETH', async () => {
		await testToken.connect(owner).transfer(tokenSwap.address, swapTokenAmount);
		await tokenSwap.connect(user).swapETHToERC20(receivedAmount, swapAmount, { value: receivedAmount });

		const contractETHBalanceBefore = await ethers.provider.getBalance(tokenSwap.address);

		await tokenSwap.connect(owner).withdrawETH(contractETHBalanceBefore);

		const contractETHBalanceAfter = await ethers.provider.getBalance(tokenSwap.address);

		expect(contractETHBalanceBefore).to.equal(receivedAmount);
		expect(contractETHBalanceAfter).to.equal(ethers.BigNumber.from('0'));
	});
});
