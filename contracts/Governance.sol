// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Governance {

    struct Proposal {
        string description;
        uint yesVotes;
        uint noVotes;
        bool executed;
    }

    mapping(uint => Proposal) public proposals;

    uint public proposalCount;

    function createProposal(string memory _desc) public {

        proposals[proposalCount] = Proposal(
            _desc,
            0,
            0,
            false
        );

        proposalCount++;
    }
}