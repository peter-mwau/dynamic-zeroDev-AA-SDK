import React from "react";
import { useAccount } from "wagmi";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";

function Home(props) {
  const { isConnected, address, chain } = useAccount();
  const { user } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();

  const smartWallet = user?.verifiedCredentials?.find(
    (cred) => cred.walletName === "zerodev"
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-start gap-10">
      {/* Welcome Section (Left) */}
      <div className="w-full lg:w-2/5 flex-shrink-0">
        <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 shadow-2xl">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#20ff96] to-[#00cc75]">
            Welcome to Web3
          </h1>
          <p className="text-gray-300 mb-6 text-lg">
            Your gateway to decentralized applications and smart wallet
            management.
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-[#20ff96]/20 p-2 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-[#20ff96]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Smart Wallets</h3>
                <p className="text-gray-400 text-sm">
                  Manage all your wallets in one place
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-[#20ff96]/20 p-2 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-[#20ff96]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Secure & Private</h3>
                <p className="text-gray-400 text-sm">
                  Your data remains in your control
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-[#20ff96]/20 p-2 rounded-lg mr-4">
                <svg
                  className="w-6 h-6 text-[#20ff96]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Fast Transactions</h3>
                <p className="text-gray-400 text-sm">
                  Execute operations with minimal gas fees
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700/30">
            <p className="text-gray-400 text-sm">
              Connected to:{" "}
              <span className="text-[#20ff96] font-mono">
                {chain?.name || "Unknown Network"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Cards (Right) */}
      <div className="w-full lg:w-3/5 flex-grow space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Connection Status */}
          <div className="bg-gray-900/40 backdrop-blur-md p-5 rounded-xl border border-gray-700/30 hover:border-[#20ff96]/30 transition-all duration-300">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
              Connection Status
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-white">Wallet</span>
              {isLoggedIn ? (
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-[#20ff96] mr-2 animate-pulse"></div>
                  <span className="text-[#20ff96] font-medium">Connected</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-red-400 font-medium">Disconnected</span>
                </div>
              )}
            </div>
          </div>

          {/* Network Status */}
          <div className="bg-gray-900/40 backdrop-blur-md p-5 rounded-xl border border-gray-700/30 hover:border-[#20ff96]/30 transition-all duration-300">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
              Network
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-white">Chain ID</span>
              <span className="text-[#20ff96] font-mono font-bold">
                {chain?.id || "Not connected"}
              </span>
            </div>
          </div>
        </div>

        {/* Smart Wallet Info */}
        <div className="bg-gray-900/40 backdrop-blur-md p-6 rounded-xl border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-[#20ff96]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0v10h12V5H4zm2 2h8v2H6V7zm0 4h5v2H6v-2z" />
            </svg>
            Smart Wallet
          </h3>

          {isLoggedIn ? (
            smartWallet ? (
              <div className="bg-black/20 p-4 rounded-lg border border-gray-700/30">
                <div className="font-mono text-sm text-[#20ff96] break-all p-3 rounded bg-black/30">
                  {smartWallet.publicIdentifier}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">
                No Smart Wallet detected
              </div>
            )
          ) : (
            <div className="text-center py-4 text-gray-400">
              Connect your wallet to view details
            </div>
          )}
        </div>

        {/* User Info */}
        {user?.email && (
          <div className="bg-gray-900/40 backdrop-blur-md p-6 rounded-xl border border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
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
              User Profile
            </h3>
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#20ff96] to-[#00cc75] rounded-full h-12 w-12 flex items-center justify-center mr-4">
                <span className="text-gray-900 font-bold text-lg">
                  {user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{user.email}</p>
                <p className="text-gray-400 text-sm">Connected with Dynamic</p>
              </div>
            </div>
          </div>
        )}

        {/* Wallets Table */}
        <div className="bg-gray-900/40 backdrop-blur-md p-6 rounded-xl border border-gray-700/30">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-[#20ff96]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path
                fillRule="evenodd"
                d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                clipRule="evenodd"
              />
            </svg>
            Connected Wallets
          </h3>

          {user?.verifiedCredentials?.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-700/30">
              <table className="min-w-full divide-y divide-gray-700/30">
                <thead className="bg-black/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Public Identifier
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Wallet Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/30">
                  {user.verifiedCredentials.map((cred, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-black/20 transition-colors duration-200"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-[#20ff96]">
                        {cred.publicIdentifier || (
                          <span className="text-gray-500 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {cred.walletName === "zerodev"
                          ? "Smart Wallet"
                          : cred.walletName || (
                              <span className="text-gray-500 italic">N/A</span>
                            )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            cred.walletName === "zerodev"
                              ? "bg-[#20ff96]/20 text-[#20ff96]"
                              : "bg-gray-600/30 text-gray-300"
                          }`}
                        >
                          {cred.walletName === "zerodev"
                            ? "Smart Wallet"
                            : "Standard Wallet"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <p>No wallets connected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
