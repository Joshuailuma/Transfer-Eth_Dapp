// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract SendEth {
    uint256 numOfReceivers = 0;

    /**
     * Send money to an address
     * @param receiver Address of the receiver
     */
    function sendMoney(address receiver) public payable {
        // Transfer the ether to the receiver
        (bool callSuccess, ) = payable(receiver).call{value: msg.value}("");
        // If transfer is not successful, return "Transfer failed"
        require(callSuccess, "Transfer failed");
    }

    /**
     * Increases the number of receivers
     */
    function IncreaseReceivers() public {
        numOfReceivers += 1;
    }

    /**
     * Decreases the number of receivers
     */
    function decreaseReceivers() public {
        numOfReceivers -= 1;
    }

    function getReceivers() public view returns (uint256) {
        return numOfReceivers;
    }
}
