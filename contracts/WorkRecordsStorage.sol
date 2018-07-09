pragma solidity ^0.4.23;

import "watt-token/contracts/WATTToken.sol";

contract WorkRecordsStorage {

    WATT public token;

    address owner = msg.sender;
    event WorkRecord(address indexed _subject, uint256 indexed _record_id, bytes16 _hash);

    constructor(address _work_token_address) public {
        require(_work_token_address != address(0));
        token = WATT(_work_token_address);
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    modifier onlyMember(address _target) {
        uint256 balance = token.balanceOf(_target);
        require(balance >= (10 ** uint256(18)));
        _;
    } 

    function addWorkRecord(uint256 _record_id, bytes16 _hash) public onlyMember(msg.sender){
        emit WorkRecord(msg.sender, _record_id, _hash);
    }

    function ownerAddWorkRecord(address _subject, uint256 _record_id, bytes16 _hash) public onlyOwner onlyMember(_subject) {
        emit WorkRecord(_subject, _record_id, _hash);
    }
}