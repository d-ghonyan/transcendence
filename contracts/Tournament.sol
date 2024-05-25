// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Tournament {
    // uint256 public unlockTime;
    // address payable public owner;

	mapping (string => string) names;

    constructor(uint256 _unlockTime) payable {
        // if (block.timestamp >= _unlockTime) {
        //     revert InvalidUnlockTime(_unlockTime);
        // }

        // unlockTime = _unlockTime;
        // owner = payable(msg.sender);
    }

	function setName(string memory _name, string memory _value) public {
		names[_name] = _value;
	}

	function getName(string memory _name) public view returns (string memory) {
		return names[_name];
	}

	// function to Hello WOrld
	function helloWorld() public pure returns (string memory) {
		return "Hello, World!";
	}
}
