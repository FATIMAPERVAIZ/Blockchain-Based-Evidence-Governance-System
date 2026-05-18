# Blockchain-Based Evidence Governance System

This project is a decentralized application designed for the secure and transparent management of digital evidence using Ethereum smart contracts. By leveraging blockchain technology, it ensures data integrity, auditability, and decentralized governance for evidence handling.

## Project Structure

The repository is structured into two main parts:
- **Root Directory**: Contains the Hardhat project for the Ethereum smart contracts.
- **`/frontend`**: Contains the Vite + React frontend application that interacts with the smart contracts.

## Features & Smart Contracts

- **AccessControl.sol**: Manages roles and permissions within the system, specifically identifying and authorizing 'officers'.
- **EvidenceRegistry.sol**: Allows authorized officers to securely upload and register evidence hashes along with metadata (uploader address and timestamp).
- **Governance.sol**: Implements a voting mechanism where participants can create proposals and vote (Yes/No) on system-related decisions.
- **AuditLog.sol**: Maintains a secure log of critical actions performed within the system for transparency and accountability.
- **OfficerToken.sol**: Represents a tokenized identity or reputation system for officers.

## Getting Started: Smart Contracts (Backend)

The smart contracts are built using [Hardhat](https://hardhat.org/).

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm or yarn

### Installation

Clone the repository and install the backend dependencies in the root directory:

```shell
npm install
```

### Compilation

To compile the smart contracts:

```shell
npx hardhat compile
```

### Testing

To run the provided test suite:

```shell
npx hardhat test
```

### Deployment

To deploy the smart contracts to the **Sepolia** testnet (as configured in the custom scripts):

```shell
npx hardhat run scripts/deploy.js --network sepolia
```

*Note: Ensure you have your environment variables (like Private Key, Alchemy/Infura URLs) properly configured in `.env` before deploying to a public testnet.*

### Scripts

- `scripts/deploy.js`: Main deployment script for all smart contracts.
- `scripts/addOfficer.js`: Script used to interact with the deployed contracts to add a new officer. Run with `npx hardhat run scripts/addOfficer.js --network <network_name>`.

---

## Getting Started: Frontend

The frontend is a React application powered by Vite, located in the `frontend/` directory.

### Installation

Navigate to the frontend directory and install the dependencies:

```shell
cd frontend
npm install
```

### Running Locally

To start the local development server:

```shell
npm run dev
```

This will launch the Vite development server, usually accessible at `http://localhost:5173`. Make sure you have MetaMask or another Web3 wallet installed in your browser to interact with the application.

## License

This project is licensed under the MIT License.
