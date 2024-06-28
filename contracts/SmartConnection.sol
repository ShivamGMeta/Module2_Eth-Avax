// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public interestRate; // in basis points, e.g., 700 = 7%

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event InterestRateChanged(uint256 oldRate, uint256 newRate);

    constructor(uint initBalance, address payable initialOwner, uint256 initialInterestRate) payable {
        owner = initialOwner;
        balance = initBalance;
        interestRate = initialInterestRate;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner of this account");
        _;
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable onlyOwner {
        uint _previousBalance = balance;
        balance += _amount;
        assert(balance == _previousBalance + _amount);
        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public onlyOwner {
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }
        balance -= _withdrawAmount;
        assert(balance == (_previousBalance - _withdrawAmount));
        emit Withdraw(_withdrawAmount);
    }

    function setOwner(address payable _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be the zero address");
        address oldOwner = owner;
        owner = _newOwner;
        emit OwnerChanged(oldOwner, _newOwner);
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function setInterestRate(uint256 _newRate) public onlyOwner {
        require(_newRate >= 0, "Interest rate cannot be negative");
        uint256 oldRate = interestRate;
        interestRate = _newRate;
        emit InterestRateChanged(oldRate, _newRate);
    }

    function getInterestRate() public view returns (uint256) {
        return interestRate;
    }
}
