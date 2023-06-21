// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '../node_modules/@openzeppelin/contracts/access/Ownable.sol';
import '../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract TokenSwap is Ownable {
    IERC20 public swapToken;

    constructor(address _swapToken) {
        swapToken = IERC20(_swapToken);
    }

    modifier onlyRegisteredUser() {
        require(registeredUsers[msg.sender], "TokenSwap: User is not registered");
        _;
    }

    mapping(address => bool) public registeredUsers;

    event SwapCompleted(address indexed sender, uint256 receivedAmount, uint256 swapAmount);

    // Returns the balance of the contract in ETH
    function getContractETHBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Returns the balance of the contract in ERC20
    function getContractERC20Balance() external view returns (uint256) {
        return swapToken.balanceOf(address(this));
    }

    // Allows the owner to register users
    function registerUser(address _user) external {
        require(msg.sender == owner(), "TokenSwap: Only owner can register users");
        registeredUsers[_user] = true;
    }

    // Swaps ETH to ERC20 tokens
    function swapETHToERC20(uint256 _receivedAmount, uint256 _swapAmount) external payable onlyRegisteredUser {
        require(_receivedAmount == msg.value, 'TokenSwap : Received amount does not match msg.value');
        require(swapToken.balanceOf(address(this)) >= _swapAmount, 'TokenSwap : Insufficient swap amount');

        uint256 currencyAmount = msg.value;
        require(currencyAmount >= _receivedAmount, 'TokenSwap : Insufficient currency amount');

        swapToken.transfer(msg.sender, _swapAmount);
        
        emit SwapCompleted(msg.sender, _receivedAmount, _swapAmount);
    }

    // Swaps ERC20 tokens to ETH 
    function swapERC20ToETH(uint256 _receivedAmount, uint256 _swapAmount) external payable onlyRegisteredUser {
        require(address(this).balance >= _swapAmount, 'TokenSwap : Insufficient swap amount');
        require(swapToken.balanceOf(msg.sender) >= _receivedAmount, 'TokenSwap : Insufficient send amount');
        
        swapToken.transferFrom(msg.sender,address(this),_receivedAmount);
        payable(msg.sender).transfer(_swapAmount);
        
        emit SwapCompleted(msg.sender, _receivedAmount, _swapAmount);
    }

    // Withdraws ETH tokens from the contract
    function withdrawETH(uint256 _amount) external payable onlyOwner {
        require(address(this).balance >= _amount, "TokenSwap : Insufficient balance");

        payable(msg.sender).transfer(_amount);
    }
}
