let playerAddress;
const ABI = [
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "betId", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "player1", "type": "address" }
        ],
        "name": "BetCancelled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "betId", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "player2", "type": "address" }
        ],
        "name": "BetJoined",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "betId", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "player1", "type": "address" },
            { "indexed": false, "internalType": "uint8", "name": "gameType", "type": "uint8" },
            { "indexed": false, "internalType": "string", "name": "player1Choice", "type": "string" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
        ],
        "name": "BetPlaced",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "betId", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "winner", "type": "address" },
            { "indexed": false, "internalType": "uint8", "name": "result", "type": "uint8" }
        ],
        "name": "BetResolved",
        "type": "event"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_betId", "type": "uint256" }],
        "name": "cancelBet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_betId", "type": "uint256" }],
        "name": "joinBet",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint8", "name": "_gameType", "type": "uint8" },
            { "internalType": "string", "name": "_choice", "type": "string" }
        ],
        "name": "placeBet",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_betId", "type": "uint256" }],
        "name": "resolveBet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "betCount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "bets",
        "outputs": [
            { "internalType": "address", "name": "player1", "type": "address" },
            { "internalType": "address", "name": "player2", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "uint8", "name": "gameType", "type": "uint8" },
            { "internalType": "string", "name": "player1Choice", "type": "string" },
            { "internalType": "uint8", "name": "result", "type": "uint8" },
            { "internalType": "address", "name": "winner", "type": "address" },
            { "internalType": "bool", "name": "active", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOpenBets",
        "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
        "stateMutability": "view",
        "type": "function"
    }
];

const CONTRACT_ADDRESS = "0x5C495295367e0EC8dFEF55588A78F561E557ED74";

// Connect MetaMask
document.getElementById("connect-wallet").addEventListener("click", async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            playerAddress = accounts[0];
            document.getElementById("wallet-address").innerText = `Connected Wallet: ${playerAddress}`;
        } catch (error) {
            console.error("User rejected connection:", error);
            alert("MetaMask connection rejected!");
        }
    } else {
        alert("MetaMask is not installed. Please install it to use this dApp.");
    }
});

// Place Bet
document.getElementById("place-bet-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!playerAddress) {
        alert("Please connect your wallet first.");
        return;
    }

    const gameType = parseInt(document.getElementById("gameType").value);
    const choice = document.getElementById("choice").value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (amount < 0.0001) {
        alert("Bet amount must be at least 0.0001 ETH.");
        return;
    }

    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

        await contract.methods.placeBet(gameType, choice).send({
            from: playerAddress,
            value: web3.utils.toWei(amount.toString(), "ether"),
            gas: 3000000,
        });

        alert("Bet placed successfully!");
    } catch (error) {
        console.error("Error placing bet:", error);
        alert("Failed to place bet. Check the console for details.");
    }
});

// Join Bet
document.getElementById("join-bet-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!playerAddress) {
        alert("Please connect your wallet first.");
        return;
    }

    const betId = parseInt(document.getElementById("betId").value);
    const amount = parseFloat(document.getElementById("joinAmount").value);

    if (amount < 0.0001) {
        alert("Bet amount must be at least 0.0001 ETH.");
        return;
    }

    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

        await contract.methods.joinBet(betId).send({
            from: playerAddress,
            value: web3.utils.toWei(amount.toString(), "ether"),
            gas: 3000000,
        });

        alert("Bet joined successfully!");
    } catch (error) {
        console.error("Error joining bet:", error);
        alert("Failed to join bet. Check the console for details.");
    }
});

// Resolve Bet
document.getElementById("resolve-bet-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!playerAddress) {
        alert("Please connect your wallet first.");
        return;
    }

    const betId = parseInt(document.getElementById("resolveBetId").value);

    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

        await contract.methods.resolveBet(betId).send({
            from: playerAddress,
            gas: 3000000,
        });

        alert("Bet resolved successfully!");
    } catch (error) {
        console.error("Error resolving bet:", error);
        alert("Failed to resolve bet. Check the console for details.");
    }
});

// Cancel Bet
document.getElementById("cancel-bet-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!playerAddress) {
        alert("Please connect your wallet first.");
        return;
    }

    const betId = parseInt(document.getElementById("cancelBetId").value);

    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

        await contract.methods.cancelBet(betId).send({
            from: playerAddress,
            gas: 3000000,
        });

        alert("Bet cancelled successfully!");
    } catch (error) {
        console.error("Error cancelling bet:", error);
        alert("Failed to cancel bet. Check the console for details.");
    }
});
// Fetch Open Bets
document.getElementById("get-open-bets").addEventListener("click", async () => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

        const openBets = await contract.methods.getOpenBets().call();

        const betsList = document.getElementById("open-bets-list");
        betsList.innerHTML = ""; 

        if (openBets.length === 0) {
            betsList.innerHTML = "<p>No open bets found.</p>";
        } else {
            openBets.forEach((betId) => {
                const betElement = document.createElement("p");
                betElement.textContent = `Open Bet ID: ${betId}`;
                betsList.appendChild(betElement);
            });
        }
    } catch (error) {
        console.error("Error fetching open bets:", error);
        alert("Failed to fetch open bets. Check the console for details.");
    }
});