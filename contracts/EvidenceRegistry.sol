// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EvidenceRegistry {

    struct Evidence {
        string hash;
        address uploader;
        uint timestamp;
    }

    mapping(uint => Evidence) public evidences;

    uint public count;

    event EvidenceAdded(uint id, string hash);

    function addEvidence(string memory _hash) public {

        evidences[count] = Evidence(
            _hash,
            msg.sender,
            block.timestamp
        );

        emit EvidenceAdded(count, _hash);

        count++;
    }
}