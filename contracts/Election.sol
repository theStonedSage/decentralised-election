pragma solidity ^0.5.16;

contract Election {

    //model a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    //store candidate
    //fetch candidate
    // maping for voters
    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidateCount;

    constructor() public{
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }
    
    //store candidate count

    function addCandidate (string memory _name) private {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount,_name,0);
    }

    function vote(uint _candidateId) public {

        require(!voters[msg.sender]);

        require(_candidateId>0 && _candidateId<=candidateCount);

        //record the voter has voted
        voters[msg.sender] = true;

        //update voters votevount
        candidates[_candidateId].voteCount ++;
    }
}

