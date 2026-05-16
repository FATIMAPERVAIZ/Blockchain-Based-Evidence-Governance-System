// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AuditLog {
    struct Log {
        address user;
        string action;
        uint256 timestamp;
    }

    Log[] public logs;

    event ActionLogged(address user, string action, uint256 timestamp);

    function addLog(string memory _action) public {
        logs.push(Log(msg.sender, _action, block.timestamp));
        emit ActionLogged(msg.sender, _action, block.timestamp);
    }

    function getLogCount() public view returns (uint256) {
        return logs.length;
    }
}