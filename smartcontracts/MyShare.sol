pragma solidity ^0.4.24;

import './MyCreditToken.sol';

contract MyShare {
    uint256 public targetETH;
    uint8 public shareNum;
    address public chairman;
    uint256 public minimumInterestETH;
    
    MyCreditToken public token;
    
    uint256 public startDate;

    uint256 public currentDueDate;
    address public currentBeneficiary;
    uint256 public currentPaidNeededNum;
    uint256 public currentPaidNum;
    uint256 public currentPaidETH;
    
    enum Status { Open, WaitStart, WaitTransfer, WaitWithdraw, Closed, Cancelled, Tumbled }
    Status public status;
    
    uint256 public payingRound;
    
    mapping (uint256 => address[]) emptyMap;
    
    struct Participant {
        address addr;
        uint256 lockedTokens;
        bool exists;
        bool isChaired;
        bool isBenefited;
        uint256 interestEth;
        uint256 paidRound;
    }
    
    mapping (address => Participant) public participants;
    address[] public participantAddrs;
    
    constructor (
        uint256 _targetETH,
        uint8 _shareNum,
        address _chairman,
        uint256 _chairmanTokens,
        uint256 _startInMins,
        uint256 _mininumInterestETH,
        MyCreditToken _token
    ) public {
        require (_shareNum > 1);
        targetETH = _targetETH;
        shareNum = _shareNum;
        chairman = _chairman;
        token = _token;
        minimumInterestETH = _mininumInterestETH;
        startDate = now + _startInMins * 1 minutes;
        
        _addParticipant(chairman, _chairmanTokens, true);
        
        status = Status.Open;
    }
    
    function _addParticipant(
        address _addr, 
        uint256 _lockedTokens,
        bool _isChaired) internal {
        
        participantAddrs.push(_addr);
        Participant storage participant = participants[_addr];
        participant.addr = _addr;
        participant.lockedTokens = _lockedTokens;
        participant.exists = true;
        participant.isChaired = _isChaired;
    }
    
    modifier onlyChairman {
        require(msg.sender == chairman);
        _;
    }
    
    modifier openToJoin {
        require (status == Status.Open);
        _;
    }
    
    modifier startDateReached {
        require (now >= startDate);
        _;
    }
    
    modifier dueDateReached {
        require (now >= currentDueDate);
        _;
    }
    
    modifier onlyParticipant {
        require (participants[msg.sender].exists == true);
        _;
    }
    
    modifier onlyBeneficiary {
        require (msg.sender == currentBeneficiary);
        _;
    }
    
    modifier allPaid {
        require (currentPaidNum == currentPaidNeededNum);
        _;
    }
    
    function join() openToJoin public {
        require (participants[msg.sender].exists == false);
        
        uint256 requiredTokens = targetETH * 1 ether / shareNum;
        
        require (token.lockTokens(msg.sender, requiredTokens));
        
        _addParticipant(msg.sender, requiredTokens, false);
        
        token.participateShare(this, msg.sender, false, requiredTokens);
        
        if (participantAddrs.length == shareNum) {
            status = Status.WaitStart;
        }
    }
    
    function start() onlyChairman public {
        currentBeneficiary = msg.sender;
        
        // _nextRound(25 hours);
        _nextRound(1 seconds);
    }
    
    function nextBeneficiary() onlyChairman dueDateReached allPaid public {
        require (currentBeneficiary == 0x0);
        
        // all paid and no beneficiary yet
        _chooseNextBeneficiary();
        currentPaidETH-=_returnInterestToNonBeneficiary();
    }
    
    function _nextRound(uint256 dueIn) internal {
        if (payingRound == shareNum) {
            status = Status.Closed;
            return;
        }
        
        currentDueDate = now + dueIn;
        currentPaidNeededNum = shareNum - 1;
        
        payingRound++;
        
        status = Status.WaitTransfer;
    }
    
    function withdraw() onlyBeneficiary allPaid public {
        require (currentPaidETH > 0);
        
        uint256 toTransferWei = currentPaidETH * 1 ether;
        currentPaidETH = 0;
        msg.sender.transfer(toTransferWei);
        currentBeneficiary = 0x0;
        
        // _nextRound(1 days);
        _nextRound(1 seconds);
    }
    
    function cancelBeforeStart() onlyChairman openToJoin public {
        for (uint256 i=0; i<participantAddrs.length; i++) {
            Participant storage p = participants[participantAddrs[i]];
            token.unlockTokens(p.addr, p.lockedTokens);
        }
        
        status = Status.Cancelled;
    }
    
    function () payable onlyParticipant public {
        require (msg.sender != currentBeneficiary);
        
        Participant storage p = participants[msg.sender];
        
        require (p.paidRound < payingRound);
        
        uint256 basedPay = targetETH / shareNum;
        
        if (p.isBenefited || payingRound == 1) {
            uint256 toPayWei1 = (basedPay + p.interestEth) * 1 ether;
            require (msg.value == toPayWei1);
        } else {
            uint256 toPayWei2 = (basedPay + minimumInterestETH) * 1 ether;
            require (msg.value > toPayWei2);
            p.interestEth = msg.value/1 ether - basedPay + minimumInterestETH;
        }
        
        p.paidRound = payingRound;
        currentPaidNum++;
        currentPaidETH+=msg.value/1 ether;
        
        if (currentPaidNum == currentPaidNeededNum) {
            status = Status.WaitWithdraw;
        }
    }
    
    function _chooseNextBeneficiary() internal {
        uint256 maxInterest = 0;
        mapping (uint256 => address[]) interestEthMap = emptyMap;
        
        for (uint256 i=0; i<participantAddrs.length; i++) {
            Participant memory p = participants[participantAddrs[i]];
            
            if (!p.isBenefited && p.interestEth >= maxInterest) {
                maxInterest = p.interestEth;
                interestEthMap[p.interestEth].push(p.addr);
            }
        }
        
        address[] memory maxInterestAddresses = interestEthMap[maxInterest];
        
        if (maxInterestAddresses.length == 1) {
            currentBeneficiary = maxInterestAddresses[0];
        } else {
            // pick an index
            uint256 randIndex = block.number % (maxInterestAddresses.length - 1);
            currentBeneficiary = maxInterestAddresses[randIndex];
        }
    }
    
    function _returnInterestToNonBeneficiary() internal returns (uint256) {
        uint256 returnedETH = 0;
        
        for (uint256 i=0; i<participantAddrs.length; i++) {
            Participant storage p = participants[participantAddrs[i]];
            
            if (!p.isBenefited && p.addr != currentBeneficiary) {
                uint256 toReturn = p.interestEth;
                p.interestEth = 0;
                p.addr.transfer(toReturn);
                returnedETH+=toReturn;
            }
        }
        
        return returnedETH;
    }
    
}
