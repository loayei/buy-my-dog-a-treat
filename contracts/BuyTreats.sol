//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract BuyTreats {
    // Even when a memo is created is emitted
    event MemoCreated(
        address indexed owner,
        string name,
        string message,
        uint256 timestamp
    );
    // Memo Structure
    struct Memo {
        address owner;
        string name;
        string message;
        uint256 timestamp;
    }

    // The list of all the memos
    Memo[] memos;

    // Contract deployer address
    address payable deployer;

    //logic
    constructor() {
        deployer = payable(msg.sender);
    }

    /*
    * @dev buy a treat for contract deployer
    * @param _name the name of the buyer
    * @param _message the message of the buyer
    */

    function buyTreat(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Treats must be bought for a non-zero amount");

        memos.push(Memo(
            msg.sender,
            _name,
            _message,
            block.timestamp
        ));

        emit MemoCreated(
            msg.sender,
            _name,
            _message,
            block.timestamp
        );
    }

    // Withdraw function
    // @dev withdraws the funds from the contract to the deployer

    function withdrawDonation() public {
        require(deployer.send(address(this).balance));
    }

    // Get memos
    // @dev returns the list of all the memos

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
