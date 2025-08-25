// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PayrollDisperser {
    address public owner;
    event PaymentDisbursed(address[] recipients, uint256[] amounts, uint256 timestamp);
    event FundsDeposited(address depositor, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function deposit() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    function disperse(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Mismatched arrays");
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(address(this).balance >= totalAmount, "Insufficient balance");

        for (uint256 i = 0; i < recipients.length; i++) {
            payable(recipients[i]).transfer(amounts[i]);
        }
        emit PaymentDisbursed(recipients, amounts, block.timestamp);
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}