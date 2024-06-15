// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

struct Match {
	string user1;
	string user2;
	uint256 score1;
	uint256 score2;
	string winner;
}

struct TournamentEntry {
	mapping(uint256 => Match) matches;
	string winner;

	uint256 matchCount;
}

struct T {
	Match[] matches;
	string winner;
}

contract Tournament {

	TournamentEntry[] tournaments;

    constructor(uint256 _unlockTime) payable { }

	function addTournament(Match[] memory _matches, string memory _winner) public {

		uint256 idx = tournaments.length;

		tournaments.push();

		TournamentEntry storage tournament = tournaments[idx];
		tournament.winner = _winner;

		for (uint256 i = 0; i < _matches.length; i++) {
			tournament.matches[i] = _matches[i];
		}

		tournament.matchCount = _matches.length;
	}

	function getTournaments() public view returns (T[] memory) {

		T[] memory _tournaments = new T[](tournaments.length);

		for (uint256 i = 0; i < tournaments.length; i++) {
			TournamentEntry storage tournament = tournaments[i];

			Match[] memory matches = new Match[](tournament.matchCount);

			for (uint256 j = 0; j < tournament.matchCount; j++) {
				matches[j] = tournament.matches[j];
			}

			_tournaments[i] = T(matches, tournament.winner);
		}

		return _tournaments;
	}
}
