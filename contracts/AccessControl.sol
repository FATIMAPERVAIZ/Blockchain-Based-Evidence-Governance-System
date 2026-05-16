// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessControl {
    address public admin;
    mapping(address => bool) public officers;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can do this");
        _;
    }

    function addOfficer(address _officer) public onlyAdmin {
        officers[_officer] = true;
    }

    function isOfficer(address _user) public view returns (bool) {
        return officers[_user];
    }
}