pragma solidity ^0.4.23;

import "work-token/contracts/WorkToken.sol";

contract WorkRecordsStorage {

    WorkToken public token;

    address owner = msg.sender;
    event WorkRecord(address indexed _subject, uint256 indexed _record_id, bytes32 _hash);

    constructor(address _work_token_address) public {
        require(_work_token_address != address(0));
        token = WorkToken(_work_token_address);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyMember() {
        uint256 balance = token.balanceOf(msg.sender);
        require(balance >= (10 ** uint256(18)));
        _;
    } 

    function addWorkRecord(uint256 _record_id, bytes32 _hash) public onlyMember {
        emit WorkRecord(msg.sender, _record_id, _hash);
    }

    function ownerAddWorkRecord(address _subject, uint256 _record_id, bytes32 _hash) public onlyOwner {
        emit WorkRecord(_subject, _record_id, _hash);
    }
}