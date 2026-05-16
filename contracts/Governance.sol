// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Governance {
    struct Proposal {
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;

    event ProposalCreated(uint256 id, string description);

    function createProposal(string memory _desc) public {
        proposals[proposalCount] = Proposal(_desc, 0, 0, false);
        emit ProposalCreated(proposalCount, _desc);
        proposalCount++;
    }

    function vote(uint256 _proposalId, bool _isYes) public {
        Proposal storage p = proposals[_proposalId];
        require(!p.executed, "Proposal already executed");
        
        if (_isYes) {
            p.yesVotes++;
        } else {
            p.noVotes++;
        }
    }
}