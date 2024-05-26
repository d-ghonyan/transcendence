// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

struct TournamentEnrty {
	Match[] matches;

	string winner;
}

struct Match {
	string user1;
	string user2;
	uint256 score1;
	uint256 score2;
	string winner;
}

contract Tournament {

	TournamentEnrty[] tournaments;

    constructor(uint256 _unlockTime) payable {

    }

	function addTournament(Match[] memory _matches, string memory _winner) public {
		TournamentEnrty memory tournament = TournamentEnrty(_matches, _winner);
		tournaments.push(tournament);
	}

	function getTournaments() public view returns (TournamentEnrty[] memory) {
		return tournaments;
	}

}
