from flask import Flask, jsonify, render_template
from flask_cors import CORS
from web3 import Web3

app = Flask(__name__, template_folder="templates")
CORS(app)

# Connect to Sepolia Testnet or your desired network
infura_url = "https://sepolia.infura.io/v3/your_infura_key"
web3 = Web3(Web3.HTTPProvider(infura_url))

# Replace with your contract details
contract_address = "0x5C495295367e0EC8dFEF55588A78F561E557ED74"
with open("contract_abi.json", "r") as abi_file:
    contract_abi = abi_file.read()

contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# Serve the main page
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_open_bets', methods=['GET'])
def get_open_bets():
    try:
        # Call the contract function to fetch open bets
        open_bets = contract.functions.getOpenBets().call()
        return jsonify({"open_bets": open_bets})
    except Exception as e:
        print(f"Error fetching open bets: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
