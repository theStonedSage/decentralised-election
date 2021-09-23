var Election = artifacts.require("./Election.sol");

contract("Election",(accounts)=>{
    var electionInstance;

    it("initialize with two candidates",()=>{
        return Election.deployed().then((i)=>{
            return i.candidateCount();
        }).then(count=>{
            assert.equal(count,2);
        })
    })

    it("initialize the candidate with correct values",()=>{
        return Election.deployed().then((i)=>{
            electionInstance = i;
            return electionInstance.candidates(1);
        }).then(candidate=>{
            assert.equal(candidate[0],1,"contains correct id");
            assert.equal(candidate[1],"Candidate 1","contains correct name");
            assert.equal(candidate[2],0,"contains correct votes count");
            return electionInstance.candidates(2);
        }).then(candidate=>{
            assert.equal(candidate[0],2,"contains correct id");
            assert.equal(candidate[1],"Candidate 2","contains correct name");
            assert.equal(candidate[2],0,"contains correct votes count");
        })
    })

    it("allows a voter to cast vote",()=>{
        return Election.deployed().then(i=>{
            electionInstance = i;
            candidateId = 1;
            return electionInstance.vote(candidateId,{from : '0x7a9C47aa996456515a7837c0CE571d70382524fB'});
        }).then(reciept=>{
            return electionInstance.voters('0x7a9C47aa996456515a7837c0CE571d70382524fB');
        }).then(voted=>{
            assert(voted,"candidate voted");
            return electionInstance.candidates(candidateId);
        }).then(candidate=>{
            var voteCount = candidate[2];
            assert.equal(voteCount,1,"vote count also fine");
        })
    })

    it("throws an exception for invalid candiates", function() {
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            return electionInstance.vote(99, { from: accounts[1] })
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function(candidate1) {
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
            return electionInstance.candidates(2);
        }).then(function(candidate2) {
            var voteCount = candidate2[2];
            assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
        });
    });
    
    it("throws an exception for double voting", function() {
        return Election.deployed().then(function(instance) {
            electionInstance = instance;
            candidateId = 2;
            electionInstance.vote(candidateId, { from: accounts[2] });
            return electionInstance.candidates(candidateId);
        }).then(function(candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "accepts first vote");
            // Try to vote again
            return electionInstance.vote(candidateId, { from: accounts[2] });
        }).then(assert.fail).catch(function(error) {
            // assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function(candidate1) {
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
            return electionInstance.candidates(2);
        }).then(function(candidate2) {
            var voteCount = candidate2[2];
            assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
        });
    });
})