import React, { use, useState } from "react";
import CONTRACTABI from "../artifacts/funABI.json";
import { isZeroDevConnector } from "@dynamic-labs/ethereum-aa";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useContractRead } from "wagmi";
import { toast, ToastContainer } from "react-toastify";
import { ethers } from "ethers";
import { encodeFunctionData, parseAbi } from "viem";

const contract_address = import.meta.env.VITE_APP_CONTRACT_ADDRESS;
const contractAbi = CONTRACTABI.abi;

function Content(props) {
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
    <div className="mt-[100px] max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <ToastContainer className="absolute top-0 right-0 mt-4 mr-4" />
      <h1 className="text-3xl font-bold mb-2 text-blue-700">The Test Arena</h1>
      <p className="text-gray-600 mb-6">Add Persons to Earn!</p>

      <button
        onClick={debugConnector}
        className="mb-4 px-3 py-1 bg-gray-200 text-sm rounded mr-2"
      >
        Debug Connector
      </button>

      <button
        onClick={loadAllPersons}
        disabled={isLoadingPersons}
        className="mb-4 px-3 py-1 bg-green-200 text-sm rounded"
      >
        {isLoadingPersons ? "Loading..." : "Refresh Persons"}
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-semibold">Your Balance:</span>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-lg border border-blue-100">
            {balance?.toString() || "0"} PRN
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition"
          >
            {showCreateForm ? "Hide Form" : "Create Person"}
          </button>
        </div>
      </div>

      {/* Modal-like form overlay */}
      {showCreateForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
          style={{ background: "rgba(0, 0, 0, 0.6)" }}
        >
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowCreateForm(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Create Person
            </h2>
            <form onSubmit={createPerson} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
                min="0"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-60"
                >
                  {isCreating ? "Creating..." : "Create Person"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Your Details
        </h2>
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-medium text-gray-700">Name:</span>
            <span className="ml-2 text-gray-900">{user?.name || "N/A"}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Address:</span>
            <span className="ml-2 text-gray-900 text-xs">
              {primaryWallet?.address || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Wallet Type:</span>
            <span className="ml-2 text-gray-900">
              {isZeroDev ? "ZeroDev AA" : "Regular"}
            </span>
          </div>
          {isZeroDev && (
            <div>
              <span className="font-medium text-gray-700">EOA Address:</span>
              <span className="ml-2 text-gray-900 text-xs">
                {primaryWallet?.connector?.eoaAddress || "N/A"}
              </span>
            </div>
          )}
        </div>

        {/* All Persons List */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              All Persons ({contractPersons?.length || 0})
            </h2>
            <span className="text-xs text-gray-500">
              Data source: Smart Contract
            </span>
          </div>

          {contractPersons && contractPersons.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {contractPersons.map((person, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div>
                    <span className="font-medium text-gray-800">
                      {person.name || `Person ${index + 1}`}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      Age: {person.age?.toString() || "N/A"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">#{index + 1}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No persons found</p>
              <p className="text-xs mt-1">Create your first person above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Content;
