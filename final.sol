// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleBettingGame {
    struct Bet {
        address player1;
        address player2;
        uint256 amount;
        uint8 gameType; // 1: Coin Toss, 2: Dice Throw
        string player1Choice;
        uint8 result; // 0: Heads, 1: Tails | 1-3: 1, 4-6: 2
        address winner;
        bool active; // Indicates if the bet is active
    }

    mapping(uint256 => Bet) public bets;
    uint256 public betCount;

    event BetPlaced(uint256 indexed betId, address indexed player1, uint8 gameType, string player1Choice, uint256 amount);
    event BetJoined(uint256 indexed betId, address indexed player2);
    event BetResolved(uint256 indexed betId, address indexed winner, uint8 result);
    event BetCancelled(uint256 indexed betId, address indexed player1);

    modifier validChoice(uint8 _gameType, string memory _choice) {
        if (_gameType == 1) {
            require(
                keccak256(abi.encodePacked(_choice)) == keccak256("heads") ||
                keccak256(abi.encodePacked(_choice)) == keccak256("tails"),
                "Invalid choice for Coin Toss"
            );
        } else if (_gameType == 2) {
            require(
                keccak256(abi.encodePacked(_choice)) == keccak256("1-3") ||
                keccak256(abi.encodePacked(_choice)) == keccak256("4-6"),
                "Invalid choice for Dice Throw"
            );
        } else {
            revert("Invalid game type");
        }
        _;
    }

    function placeBet(uint8 _gameType, string memory _choice) external payable validChoice(_gameType, _choice) {
        require(msg.value > 0, "Bet amount must be greater than zero");

        bets[betCount] = Bet({
            player1: msg.sender,
            player2: address(0),
            amount: msg.value,
            gameType: _gameType,
            player1Choice: _choice,
            result: 0,
            winner: address(0),
            active: true
        });

        emit BetPlaced(betCount, msg.sender, _gameType, _choice, msg.value);
        betCount++;
    }

    function joinBet(uint256 _betId) external payable {
        Bet storage bet = bets[_betId];
        require(bet.active, "Bet is not active");
        require(bet.player2 == address(0), "Bet already has two players");
        require(msg.value == bet.amount, "Must send the exact bet amount");

        bet.player2 = msg.sender;

        emit BetJoined(_betId, msg.sender);
    }

    function resolveBet(uint256 _betId) external {
        Bet storage bet = bets[_betId];
        require(bet.active, "Bet is not active");
        require(bet.player2 != address(0), "Bet is not full");

        uint8 result;
        address winner;

        if (bet.gameType == 1) {
            // Coin Toss
            result = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, _betId))) % 2);
            if (
                (result == 0 && keccak256(abi.encodePacked(bet.player1Choice)) == keccak256("heads")) ||
                (result == 1 && keccak256(abi.encodePacked(bet.player1Choice)) == keccak256("tails"))
            ) {
                winner = bet.player1;
            } else {
                winner = bet.player2;
            }
        } else if (bet.gameType == 2) {
            // Dice Throw
            result = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, _betId))) % 6) + 1;
            if (
                (result <= 3 && keccak256(abi.encodePacked(bet.player1Choice)) == keccak256("1-3")) ||
                (result > 3 && keccak256(abi.encodePacked(bet.player1Choice)) == keccak256("4-6"))
            ) {
                winner = bet.player1;
            } else {
                winner = bet.player2;
            }
        }

        bet.result = result;
        bet.winner = winner;
        bet.active = false;
        payable(winner).transfer(bet.amount * 2);

        emit BetResolved(_betId, winner, result);
    }

    function cancelBet(uint256 _betId) external {
        Bet storage bet = bets[_betId];
        require(bet.active, "Bet is not active");
        require(msg.sender == bet.player1, "Only the bet creator can cancel the bet");
        require(bet.player2 == address(0), "Cannot cancel a bet that has been joined");

        bet.active = false;
        payable(bet.player1).transfer(bet.amount);

        emit BetCancelled(_betId, bet.player1);
    }

    function getOpenBets() external view returns (uint256[] memory) {
        uint256[] memory openBetIds = new uint256[](betCount);
        uint256 count = 0;

        for (uint256 i = 0; i < betCount; i++) {
            if (bets[i].active && bets[i].player2 == address(0)) {
                openBetIds[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = openBetIds[j];
        }

        return result;
    }
}
