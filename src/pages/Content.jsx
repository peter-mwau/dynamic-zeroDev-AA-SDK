import React, { use, useState } from "react";
import CONTRACTABI from "../artifacts/funABI.json";
import { isZeroDevConnector } from "@dynamic-labs/ethereum-aa";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { toast, ToastContainer } from "react-toastify";
import { ethers } from "ethers";
import { encodeFunctionData } from "viem";

const contract_address = import.meta.env.VITE_APP_CONTRACT_ADDRESS;
const contractAbi = CONTRACTABI.abi;

function Content() {
  const [isCreating, setIsCreating] = React.useState(false);
  const { primaryWallet, user } = useDynamicContext();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [allPersons, setAllPersons] = useState([]);
  const [isLoadingPersons, setIsLoadingPersons] = useState(false);
  const [contractPersons, setContractPersons] = useState([]);
  const [isReadingPersons, setIsReadingPersons] = useState(false);
  const [readError, setReadError] = useState(null);
  const [balance, setBalance] = useState(null);

  const isZeroDev = isZeroDevConnector(primaryWallet?.connector);

  const contractInterface = new ethers.Interface(contractAbi);

  //function to get token balance
  const getTokenBalance = async () => {
    if (!primaryWallet?.connector) {
      setReadError("Wallet not connected");
      return;
    }

    try {
      const walletClient = await primaryWallet.connector.getWalletClient();
      const result = await walletClient.request({
        method: "eth_call",
        params: [
          {
            to: contract_address,
            data: contractInterface.encodeFunctionData("balanceOf", [
              primaryWallet?.address,
            ]),
          },
          "latest",
        ],
      });

      const decodedResult = contractInterface.decodeFunctionResult(
        "balanceOf",
        result
      );

      setBalance(Math.floor(Number(ethers.formatEther(decodedResult[0]))));
      console.log("Token balance:", decodedResult);
    } catch (error) {
      console.error("Error getting token balance:", error);
      setReadError(error);
    }
  };

  // Read all persons from contract
  const getAllPersons = async () => {
    if (!primaryWallet?.connector) {
      setReadError("Wallet not connected");
      return;
    }

    setIsReadingPersons(true);
    setReadError(null);

    try {
      const walletClient = await primaryWallet.connector.getWalletClient();

      if (!walletClient) {
        throw new Error("Failed to get wallet client");
      }

      // Encode the function call data
      const data = encodeFunctionData({
        abi: contractAbi,
        functionName: "getAllPersons",
        args: [],
      });

      // Use eth_call to read from contract
      const result = await walletClient.request({
        method: "eth_call",
        params: [
          {
            to: contract_address,
            data: data,
          },
          "latest",
        ],
      });

      // Decode the result
      const decodedData = contractInterface.decodeFunctionResult(
        "getAllPersons",
        result
      );

      console.log("Raw result:", result);
      console.log("Decoded data:", decodedData);
      console.log("Data type:", typeof decodedData);
      console.log("Is array:", Array.isArray(decodedData));

      // The decoded data should be an array where the first element is the actual persons array
      const personsData = decodedData[0] || [];

      if (personsData) {
        console.log("Persons data length:", personsData.length);
        console.log("First person:", personsData[0]);
      }

      setContractPersons(personsData);
    } catch (error) {
      console.error("Error reading contract:", error);
      setReadError(error);
    } finally {
      setIsReadingPersons(false);
    }
  };

  // Alternative method using the wallet's sendTransaction if available
  const createPerson = async (e) => {
    e.preventDefault();

    if (!primaryWallet || !primaryWallet.connector) {
      toast.error("Wallet not connected properly.");
      return;
    }

    setIsCreating(true);

    try {
      if (isZeroDev) {
        // Try to get the wallet's sendTransaction method
        const walletClient = await primaryWallet.connector.getWalletClient();

        if (!walletClient) {
          throw new Error("Failed to get wallet client");
        }

        // Encode the transaction data
        const data = encodeFunctionData({
          abi: contractAbi,
          functionName: "createPerson",
          args: [name, Number(age)],
        });

        // Send transaction using wallet client
        const hash = await walletClient.sendTransaction({
          to: contract_address,
          data,
          value: 0n,
        });

        console.log("Transaction hash:", hash);

        // Create links to check the transaction
        console.log("🔍 Check your transaction:");
        console.log(
          `📍 Sepolia Etherscan: https://sepolia.etherscan.io/tx/${hash}`
        );
        console.log(
          `📍 JiffyScan (AA Explorer): https://jiffyscan.xyz/userOpHash/${hash}?network=sepolia`
        );

        toast.success(
          <div>
            <div>Person created successfully!</div>
            <div className="text-xs mt-1">
              <a
                href={`https://sepolia.etherscan.io/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-100"
              >
                View on Etherscan →
              </a>
            </div>
          </div>,
          { autoClose: 10000 }
        );

        // Reset form
        setName("");
        setAge("");
        setShowCreateForm(false);
      } else {
        toast.error("Unsupported wallet type. Please use a ZeroDev wallet.");
      }
    } catch (error) {
      console.error("Error creating person:", error);
      toast.error(`Failed to create person: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  // Debug function to check available methods
  const debugConnector = async () => {
    if (!primaryWallet?.connector) return;

    console.log("=== CONNECTOR DEBUG ===");
    console.log("Connector methods:", Object.keys(primaryWallet.connector));
    console.log(
      "EOA Address (from connector):",
      primaryWallet.connector.eoaAddress
    );
    console.log("Wallet Address (primaryWallet):", primaryWallet.address);

    // Check if kernelClient is available
    if (primaryWallet.connector.kernelClient) {
      try {
        const kernelClient = await primaryWallet.connector.kernelClient;
        console.log("Kernel client:", kernelClient);
        console.log("Kernel client methods:", Object.keys(kernelClient));
        console.log("Smart Wallet Address:", kernelClient.account?.address);
      } catch (error) {
        console.error("Error getting kernel client:", error);
      }
    }

    // Check if getWalletClient is available
    if (typeof primaryWallet.connector.getWalletClient === "function") {
      try {
        const walletClient = await primaryWallet.connector.getWalletClient();
        console.log("Wallet client:", walletClient);
        console.log("Wallet client account:", walletClient.account?.address);
      } catch (error) {
        console.error("Error getting wallet client:", error);
      }
    }

    console.log("=== END DEBUG ===");
  };

  // Manual function to load all persons
  const loadAllPersons = async () => {
    setIsLoadingPersons(true);
    try {
      await getAllPersons();
      await getTokenBalance();
      toast.success("Persons list refreshed!");
    } catch (error) {
      console.error("Error loading persons:", error);
      toast.error("Failed to load persons");
    } finally {
      setIsLoadingPersons(false);
    }
  };

  // Call this to debug
  React.useEffect(() => {
    if (primaryWallet?.connector && contract_address) {
      getAllPersons();
      getTokenBalance();
    }
  }, [primaryWallet, contract_address]);

  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      <ToastContainer
        className="absolute top-6 right-6 z-50"
        toastClassName="bg-gray-900/80 backdrop-blur-md text-white border border-gray-700/30 rounded-xl"
        progressClassName="bg-gradient-to-r from-[#20ff96] to-[#00cc75]"
      />

      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#20ff96] to-[#00cc75]">
          The Test Arena
        </h1>
        <p className="text-gray-300 text-lg">Add Persons to Earn PRN Tokens!</p>
        <div className="h-1 w-24 bg-gradient-to-r from-[#20ff96] to-[#00cc75] mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Debug and Refresh Buttons */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        <button
          onClick={debugConnector}
          className="px-4 py-2 bg-gray-800/50 backdrop-blur-md text-gray-300 text-sm rounded-lg border border-gray-700/30 hover:border-[#20ff96]/30 transition-all duration-300"
        >
          Debug Connector
        </button>

        <button
          onClick={loadAllPersons}
          disabled={isLoadingPersons}
          className="px-4 py-2 bg-gradient-to-r from-[#20ff96] to-[#00cc75] text-gray-900 text-sm rounded-lg font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50"
        >
          {isLoadingPersons ? "Loading..." : "Refresh Persons"}
        </button>
      </div>

      {/* Balance and Create Button Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 p-6 bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-700/30">
        <div className="flex items-center gap-3">
          <span className="text-gray-300 font-semibold">Your Balance:</span>
          <span className="inline-block px-4 py-2 rounded-xl bg-black/30 text-[#20ff96] font-mono text-lg border border-gray-700/30">
            {balance?.toString() || "0"} PRN
          </span>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#20ff96] to-[#00cc75] text-gray-900 font-semibold shadow-lg hover:shadow-[#20ff96]/20 hover:scale-105 transition-all duration-300"
        >
          {showCreateForm ? "Hide Form" : "Create Person"}
        </button>
      </div>

      {/* Modal-like form overlay */}
      {showCreateForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={() => setShowCreateForm(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-[#20ff96] text-xl font-bold transition-colors"
              onClick={() => setShowCreateForm(false)}
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6 text-white text-center">
              Create Person
            </h2>

            <form onSubmit={createPerson} className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-700/50 bg-gray-800/40 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#20ff96]/50 backdrop-blur-sm"
                required
              />

              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border border-gray-700/50 bg-gray-800/40 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#20ff96]/50 backdrop-blur-sm"
                required
                min="0"
              />

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-gradient-to-r from-[#20ff96] to-[#00cc75] hover:opacity-90 text-gray-900 font-semibold py-3 rounded-xl transition-all duration-300 disabled:opacity-60"
                >
                  {isCreating ? "Creating..." : "Create Person"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Section */}
      <div className="mb-8 p-6 bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-700/30">
        <h2 className="text-xl font-semibold mb-5 text-white flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-[#20ff96]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          Your Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/20 p-4 rounded-xl border border-gray-700/30">
            <span className="text-sm text-gray-400">Name:</span>
            <p className="text-white font-medium">{user?.name || "N/A"}</p>
          </div>

          <div className="bg-black/20 p-4 rounded-xl border border-gray-700/30">
            <span className="text-sm text-gray-400">Address:</span>
            <p className="text-white font-mono text-xs truncate">
              {primaryWallet?.address || "N/A"}
            </p>
          </div>

          <div className="bg-black/20 p-4 rounded-xl border border-gray-700/30">
            <span className="text-sm text-gray-400">Wallet Type:</span>
            <p className="text-white">{isZeroDev ? "ZeroDev AA" : "Regular"}</p>
          </div>

          {isZeroDev && (
            <div className="bg-black/20 p-4 rounded-xl border border-gray-700/30">
              <span className="text-sm text-gray-400">EOA Address:</span>
              <p className="text-white font-mono text-xs truncate">
                {primaryWallet?.connector?.eoaAddress || "N/A"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* All Persons List */}
      <div className="p-6 bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-700/30">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-[#20ff96]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            All Persons ({contractPersons?.length || 0})
          </h2>
          <span className="text-xs text-gray-500 mt-2 md:mt-0">
            Data source: Smart Contract
          </span>
        </div>

        {contractPersons && contractPersons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-1">
            {contractPersons.map((person, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-gray-700/30 hover:border-[#20ff96]/30 transition-all duration-300"
              >
                <div>
                  <span className="font-medium text-white">
                    {person.name || `Person ${index + 1}`}
                  </span>
                  <span className="block text-sm text-gray-400 mt-1">
                    Age: {person.age?.toString() || "N/A"}
                  </span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">
                  #{index + 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 border border-gray-700/30 rounded-xl bg-black/20">
            <svg
              className="w-12 h-12 mx-auto text-gray-600 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v1m0 14v1m-7-7.5h14M5 12h14"
              />
            </svg>
            <p className="text-gray-400">No persons found</p>
            <p className="text-xs mt-1 text-gray-500">
              Create your first person above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Content;
