# Simple Games dApp 🎲

## Overview
This decentralized application (dApp) allows users to participate in betting games on the Ethereum blockchain. Users can place bets, join existing bets, resolve outcomes, and view active bets. It supports games like Coin Toss and Dice Throw.

## Features
- **MetaMask Integration**: Connect your Ethereum wallet via MetaMask.
- **Smart Contracts**: Manage bets securely on the blockchain.
- **Multiple Betting Options**:
  - Coin Toss: Choose heads or tails.
  - Dice Throw: Pick ranges (e.g., 1-3 or 4-6).
- **Real-time Updates**: Fetch open bets dynamically.
- **Blockchain Transparency**: Ensure fairness and traceability.

---

## Technologies Used
- **Frontend**: HTML, CSS (Bootstrap 5), JavaScript.
- **Backend**: Python (Flask), Web3.py for Ethereum interactions.
- **Smart Contract**: Solidity (compiled and deployed to Sepolia Testnet).
- **Blockchain**: Ethereum Sepolia Testnet.
- **Dependencies**: 
  - Web3.js and Web3.py
  - Flask and Flask-CORS
  - MetaMask for wallet interactions

---

## Setup Instructions

### Prerequisites
1. **MetaMask Wallet**: Install and set up [MetaMask](https://metamask.io/).
2. **Python**: Ensure Python 3.x is installed.

### Smart Contract Deployment
1. Use the Solidity file (`final.sol`) to deploy the smart contract.
2. Update the deployed contract address in the following files:
   - `app.js` (`CONTRACT_ADDRESS` variable)
   - `app.py` (`contract_address` variable)

### Backend Setup
1. Install dependencies:
   ```bash
   pip install flask flask-cors web3
   ```
2. Replace `your_infura_key` in `app.py` with your Infura project key.
3. Start the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Place `index.html`, `app.js`, and `style.css` in the appropriate directories (`templates` for Flask templates and `static` for static files).
2. Open the dApp in your browser at `http://127.0.0.1:5000`.

---

## Usage
1. **Connect Wallet**: Click the "Connect to MetaMask" button to link your wallet.
2. **Place a Bet**:
   - Enter the game type, choice, and bet amount.
   - Submit the form to place a new bet.
3. **Join a Bet**:
   - Enter the Bet ID and amount to join an open bet.
4. **Resolve a Bet**:
   - Enter the Bet ID to resolve and distribute rewards.
5. **Cancel a Bet**:
   - Enter the Bet ID to cancel a pending bet.
6. **Fetch Open Bets**: Click "Fetch Open Bets" to view active bets.

---

## Directory Structure
```
- app.py                 # Flask backend
- static/
  - app.js               # JavaScript for frontend logic
  - style.css            # CSS styles
- templates/
  - index.html           # Main HTML page
- contract_abi.json      # ABI of the smart contract
- final.sol              # Solidity smart contract
```

---

## Notes
- **Minimum Bet Amount**: 0.0001 ETH.
- **Gas Fees**: Ensure you have sufficient ETH for gas fees on the Sepolia Testnet.

--- 

## License
This project is open-source and available for educational purposes.
