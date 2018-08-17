pragma solidity ^0.4.24;

import './MyShare.sol';

contract MyCreditToken {
    // Public variables of the token
    uint8 public decimals = 18;
    // 18 decimals is the strongly suggested default, avoid changing it
    uint256 public totalSupply;

    // This creates an array with all balances
    mapping (address => uint256) public balanceOf;
    mapping (address => uint256) public lockedTokens;
    
    mapping (address => MyShare) public shares;
    mapping (address => bool) internal shareExists;
    address[] public shareAddresses;

    /**
     * Constrctor function
     *
     * Initializes contract with initial supply tokens to the creator of the contract
     */
    constructor (
        uint256 initialSupply,
        address[] recipients
    ) public {
        require (recipients.length > 0);
        
        totalSupply = initialSupply * 10 ** uint256(decimals);  // Update total supply with the decimal amount
        
        uint256 each = totalSupply / recipients.length;
        
        for (uint256 i=0; i<recipients.length; i++) {
            balanceOf[recipients[i]] = each;
        }
    }
    
    modifier onlyListedShare {
        require(shareExists[msg.sender]);
        _;
    }
    
    function lockTokens(address _target, uint256 _tokens) onlyListedShare public returns (bool) {
        return _lockTokens(_target, _tokens);
    }
    
    function _lockTokens(address _target, uint256 _tokens) internal returns (bool) {
        require (balanceOf[_target] >= _tokens);
        
        balanceOf[_target] -= _tokens;
        lockedTokens[_target] += _tokens;
        return true;
    }
    
    function unlockTokens(address _target, uint256 _tokens) onlyListedShare public returns (bool) {
        require (lockedTokens[_target] >= _tokens);
        
        balanceOf[_target] += _tokens;
        lockedTokens[_target] -= _tokens;
        return true;
    }
    
    event ShareCreated(address indexed shareAddr, address indexed chairman, uint256 targetETH, uint256 shareNum, uint256 startInMins, uint256 minimumInterestETH);
    event ShareParticipated (address indexed shareAddr, address indexed participant, bool indexed isChaired, uint256 tokens);
    
    function createShare(
        uint256 _targetETH,
        uint8 _shareNum,
        uint256 _startInMins,
        uint256 _minimumInterestETH) public returns (MyShare share) {
        
        uint256 requiredTokens = _targetETH * 1 ether / _shareNum;
        
        require(_lockTokens(msg.sender, requiredTokens));
        share = new MyShare(_targetETH, _shareNum, msg.sender, requiredTokens, _startInMins, _minimumInterestETH,  this);
        
        shares[share] = share;
        shareExists[share] = true;
        shareAddresses.push(share);
        
        emit ShareCreated(share, msg.sender, _targetETH, _shareNum, _startInMins, _minimumInterestETH);
        emit ShareParticipated(share, msg.sender, true, requiredTokens);
    }
    
    function participateShare(address shareAddr, address participant, bool isChaired, uint256 tokens) onlyListedShare public {
        emit ShareParticipated(shareAddr, participant, isChaired, tokens);
    }
    
    function shareCount() public view returns (uint256 count) {
        count = shareAddresses.length;
    }

}
