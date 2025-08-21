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

  const isZeroDev = isZeroDevConnector(primaryWallet?.connector);

  const contractInterface = new ethers.Interface(contractAbi);

  const { data: balance } = useContractRead({
    address: contract_address,
    abi: contractAbi,
    functionName: "balanceOf",
    args: [primaryWallet?.address],
  });

  const createPerson = async (e) => {
    e.preventDefault();

    if (!primaryWallet || !primaryWallet.connector) {
      toast.error("Wallet not connected properly.");
      return;
    }

    setIsCreating(true);

    try {
      if (isZeroDev) {
        console.log("Using alternative ZeroDev approach");

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
        toast.success(`Person created successfully! Hash: ${hash}`);

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

    console.log("Connector methods:", Object.keys(primaryWallet.connector));
    console.log("Full connector:", primaryWallet.connector);

    // Check if kernelClient is available
    if (primaryWallet.connector.kernelClient) {
      try {
        const kernelClient = await primaryWallet.connector.kernelClient;
        console.log("Kernel client:", kernelClient);
        console.log("Kernel client methods:", Object.keys(kernelClient));
      } catch (error) {
        console.error("Error getting kernel client:", error);
      }
    }

    // Check if getWalletClient is available
    if (typeof primaryWallet.connector.getWalletClient === "function") {
      try {
        const walletClient = await primaryWallet.connector.getWalletClient();
        console.log("Wallet client:", walletClient);
        console.log("Wallet client methods:", Object.keys(walletClient));
      } catch (error) {
        console.error("Error getting wallet client:", error);
      }
    }

    // Check if getProvider is available
    if (typeof primaryWallet.connector.getProvider === "function") {
      try {
        const provider = await primaryWallet.connector.getProvider();
        console.log("Provider:", provider);
      } catch (error) {
        console.error("Error getting provider:", error);
      }
    }
  };

  // Call this to debug
  React.useEffect(() => {
    if (primaryWallet?.connector) {
      debugConnector();
    }
  }, [primaryWallet]);

  return (
    <div className="mt-[100px] max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <ToastContainer className="absolute top-0 right-0 mt-4 mr-4" />
      <h1 className="text-3xl font-bold mb-2 text-blue-700">
        Welcome to ABYA Passport
      </h1>
      <p className="text-gray-600 mb-6">
        Your one-stop solution for managing digital identities.
      </p>

      {/* Debug button */}
      <button
        onClick={debugConnector}
        className="mb-4 px-3 py-1 bg-gray-200 text-sm rounded"
      >
        Debug Connector
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-semibold">Your Balance:</span>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-lg border border-blue-100">
            {balance?.toString() || "0"}
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
        </div>
      </div>
    </div>
  );
}

export default Content;
