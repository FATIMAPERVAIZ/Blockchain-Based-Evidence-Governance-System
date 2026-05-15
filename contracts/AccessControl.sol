// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessControl {

    mapping(address => bool) public officers;

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    function addOfficer(address _officer) public onlyAdmin {
        officers[_officer] = true;
    }

    function isOfficer(address _user) public view returns(bool) {
        return officers[_user];
    }
}