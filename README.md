## TokenSwap Contract

TokenSwap is a decentralized smart contract that allows users to swap tokens between two different token types: ETH and ERC20. The contract is built on the Ethereum blockchain and is implemented in Solidity.

### Features

- User Registration: The contract owner can register users to participate in token swaps.

- ETH to ERC20 Swapping: Users can swap ETH tokens for ERC20 tokens by sending a specified amount of ETH tokens.

- ERC20 to ETH Swapping: Users can swap ERC20 tokens for ETH tokens by sending a specified amount of ERC20 tokens.

- Balance Tracking: The contract provides functions to check the balance of ETH and ERC20 tokens held by the contract.

- Withdrawal: The contract owner can withdraw ETH tokens from the contract.

### Requirements

- Solidity version: ^0.8.9

- OpenZeppelin Contracts library: v4.3.2

### Usage

1. Deploy the TokenSwap contract by providing the address of the ETH token as a constructor parameter.

2. Register users by calling the registerUser function, which can only be invoked by the contract owner.

3. Users can swap ETH tokens for ERC20 tokens by calling the swapETHToERC20 function and providing the received and swap amounts.

4. Users can swap ERC20 tokens for ETH tokens by calling the swapERC20ToETH function and providing the received and swap amounts.

5. The contract owner can withdraw ETH tokens from the contract by calling the withdrawETH function and providing the withdrawal amount.

### Testing

To run the unit tests for the TokenSwap contract:

1. Install the required dependencies by running npm install.

2. Run the tests using the command npx hardhat test.

### License

This contract is licensed under the MIT License.

Feel free to modify and use this contract according to your project's requirements.

Please note that this contract is provided as-is without any warranties. Use it at your own risk.

If you have any questions or need further assistance, please don't hesitate to reach out.
