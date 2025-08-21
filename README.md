# dynamic-zeroDev-AA-SDK

This project is a minimal implementation of Account Abstraction (AA) in a React + Vite app using the [Dynamic](https://www.dynamic.xyz/) SDK and [ZeroDev](https://www.zerodev.app/) SDK.

It demonstrates how to:

- Integrate Dynamic for wallet connection and user management
- Use ZeroDev for smart contract wallets (Account Abstraction)
- Interact with smart contracts using AA wallets on EVM chains (e.g., Sepolia)
- Provide a modern UI for connecting, viewing, and using AA wallets

---

## Tech Stack

- **React** (with Vite)
- **Tailwind CSS** (for styling)
- **Dynamic SDK** (for wallet connection, user context, and authentication)
- **ZeroDev SDK** (for Account Abstraction smart contract wallets)
- **ethers.js** and **wagmi** (for contract interaction)
- **react-toastify** (for notifications)

---

## Implementation Guidelines

1. **Dynamic Integration:**  
   Handles wallet connection, user session, and exposes wallet context.
2. **ZeroDev Integration:**  
   Enables Account Abstraction (AA) smart contract wallets for users.
3. **Smart Contract Interaction:**  
   Uses wagmi and ethers.js to read/write to contracts using the connected wallet (including AA wallets).
4. **UI:**  
   Built with React, Vite, and Tailwind CSS for a modern developer experience.

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/peter-mwau/dynamic-zeroDev-AA-SDK.git
cd dynamic-zeroDev-AA-SDK
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add your contract address and Dynamic environment ID:

```
VITE_APP_CONTRACT_ADDRESS=your_contract_address_here
VITE_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here
```

> **Note:**  
> You need to visit both the [Dynamic Dashboard](https://app.dynamic.xyz/) and the [ZeroDev Dashboard](https://app.zerodev.app/) to create projects and obtain your project credentials (such as Project ID and Environment ID).

> **NB**
> Just to mention that as of today --`20th Aug 2025`-- the Zerodev's smart wallets & AA feature is available for zeroDev v1, so you should create your project from this domain --`https://dashboard-v1.zerodev.app/`-- and not this one --`https://dashboard.zerodev.app/`-- (whose V2 support coming soon)

### 4. Run the app locally

```sh
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## Contributing

1. **Fork** this repository.
2. **Clone** your fork.
3. Create a new branch for your feature or fix.
4. Make your changes and commit them.
5. Push to your fork and open a **pull request**.

---

## License

MIT

---
