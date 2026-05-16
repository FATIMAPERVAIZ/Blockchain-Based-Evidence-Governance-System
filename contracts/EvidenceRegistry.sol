// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";

contract EvidenceRegistry is AccessControl {
    struct Evidence {
        string hash;
        address uploader;
        uint256 timestamp;
    }

    mapping(uint256 => Evidence) public evidences;
    uint256 public count;

    event EvidenceAdded(uint256 id, string hash, address uploader);

    function addEvidence(string memory _hash) public {
        require(isOfficer(msg.sender), "Only officers can upload evidence");
        
        evidences[count] = Evidence(_hash, msg.sender, block.timestamp);
        emit EvidenceAdded(count, _hash, msg.sender);
        count++;
    }

    function getEvidence(uint256 _id) public view returns (string memory, address, uint256) {
        Evidence memory ev = evidences[_id];
        return (ev.hash, ev.uploader, ev.timestamp);
    }
}