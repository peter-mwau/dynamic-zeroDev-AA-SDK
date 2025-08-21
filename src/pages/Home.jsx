import React from "react";
import { useAccount } from "wagmi";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";

function Home(props) {
  const { isConnected, address, chain } = useAccount();
  const { user } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  console.log("user", user);

  // console.log("primaryWallet", primaryWallet);

  console.log("Address", address);

  const smartWallet = user?.verifiedCredentials?.find(
    (cred) => cred.walletName === "zerodev"
  );

  return (
    <div className="mt-[100px] max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">
        Welcome to the Home Page
      </h1>
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">Status:</span>
          {isLoggedIn ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
              <svg
                className="w-3 h-3 mr-1 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Logged In
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
              <svg
                className="w-3 h-3 mr-1 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4a1 1 0 112 0v2a1 1 0 11-2 0v-2zm0-8a1 1 0 112 0v4a1 1 0 11-2 0V6z"
                  clipRule="evenodd"
                />
              </svg>
              Logged Out
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">Smart Wallet:</span>
          {isLoggedIn ? (
            smartWallet ? (
              <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200">
                <svg
                  className="w-3 h-3 mr-1 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0v10h12V5H4zm2 2h8v2H6V7zm0 4h5v2H6v-2z" />
                </svg>
                {smartWallet.publicIdentifier}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs font-medium border border-gray-200">
                No Smart Wallet found
              </span>
            )
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs font-medium border border-gray-200">
              Please connect your wallet.
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Network: {chain?.id || "-"}
          </span>
        </div>
      </div>
      <div className="mb-4">
        <span className="text-gray-700 font-medium">Dynamic User Email:</span>
        <span className="ml-2 text-gray-800">{user?.email || "-"}</span>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Wallets</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Public Identifier
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Name
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {user?.verifiedCredentials?.length > 0 ? (
                user.verifiedCredentials.map((cred, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 font-mono text-sm text-gray-800">
                      {cred.publicIdentifier || (
                        <span className="italic text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700">
                      {cred.walletName === "zerodev"
                        ? "Smart Wallet"
                        : cred.walletName || (
                            <span className="italic text-gray-400">N/A</span>
                          )}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500">
                      {cred.walletName === "zerodev"
                        ? "Smart Wallet"
                        : "Standard Wallet"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-3 py-2 text-center text-gray-400"
                  >
                    No wallets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
