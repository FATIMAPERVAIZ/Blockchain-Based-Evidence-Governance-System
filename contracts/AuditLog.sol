// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AuditLog {

    struct Log {
        address user;
        string action;
        uint timestamp;
    }

    Log[] public logs;

    function addLog(string memory _action) public {
        logs.push(Log(msg.sender, _action, block.timestamp));
    }
}