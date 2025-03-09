// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InvestmentContract {
    address public investor;
    address public startup;
    uint public investmentAmount;
    uint public equityPercentage;
    uint public paymentDate; // Timestamp for the payment date
    bool public investorSigned;
    bool public startupSigned;

    constructor(address _investor, address _startup, uint _investmentAmount, uint _equityPercentage, uint _paymentDate) {
        investor = _investor;
        startup = _startup;
        investmentAmount = _investmentAmount;
        equityPercentage = _equityPercentage;
        paymentDate = _paymentDate;
    }

    // Investor signs the contract
    function signByInvestor() external {
        require(msg.sender == investor, "Only investor can sign");
        investorSigned = true;
    }

    // Startup signs the contract
    function signByStartup() external {
        require(msg.sender == startup, "Only startup can sign");
        startupSigned = true;
    }

    // Optional: Function to release payment on the agreed date
    function releasePayment() external payable {
        require(investorSigned && startupSigned, "Both parties must sign first");
        require(block.timestamp >= paymentDate, "Payment date has not arrived yet");
        require(msg.value == investmentAmount, "Incorrect investment amount");
        payable(startup).transfer(msg.value);
    }
}