"use client";

import { useState, useEffect } from "react";
import type { WalletConnection } from "@/lib/types";
import { LogOut, Copy, ChevronDown } from "lucide-react";

interface WalletConnectionProps {
  onConnect: (connection: WalletConnection) => void;
}

interface PiUserInfo {
  uid: string;
  username: string;
  walletAddress?: string;
}

declare global {
  interface Window {
    Pi?: any;
  }
}

export function WalletConnectionComponent({ onConnect }: WalletConnectionProps) {
  const [wallet, setWallet] = useState<WalletConnection>({
    status: "disconnected",
  });
  const [userInfo, setUserInfo] = useState<PiUserInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize Pi SDK on mount - with longer timeout for SDK injection
  useEffect(() => {
    const initPiSDK = async () => {
      // Wait for Pi SDK to be injected into window (up to 3 seconds)
      for (let i = 0; i < 6; i++) {
        if (window.Pi) {
          try {
            await window.Pi.initialize({
              version: "2.0",
              sandbox: true, // Testnet
            });
            return;
          } catch (err) {
            console.error("[v0] Pi SDK initialization error:", err);
          }
        }
        // Wait 500ms and try again
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };

    initPiSDK();
  }, []);

  const handleConnect = async () => {
    if (!window.Pi) {
      setError("Pi SDK not available. Please open this app in Pi Browser.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const scopes = ["username", "payments"];
      const auth = await window.Pi.authenticate(
        scopes,
        handleIncompletePayment
      );

      // Get complete user information
      const userDetails: PiUserInfo = {
        uid: auth.user.uid,
        username: auth.user.username || auth.user.uid,
        walletAddress: auth.user.walletAddress || auth.user.uid,
      };

      setUserInfo(userDetails);

      const connection: WalletConnection = {
        status: "connected",
        address: auth.user.uid,
        connectedAt: new Date().toISOString(),
      };

      setWallet(connection);
      onConnect(connection);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Connection failed";
      setError(errorMsg);
      console.error("Connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setWallet({ status: "disconnected" });
    setUserInfo(null);
    setError(null);
    setShowDetails(false);
    setCopied(false);
  };

  const handleIncompletePayment = (payment: any) => {
    console.log("Incomplete payment recovery:", payment);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  if (!window.Pi) {
    return (
      <div className="w-full p-4 bg-card border border-border rounded-lg">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Pi Wallet Connection
          </h3>
          
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-700 font-medium">
              Pi Browser Required
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              This feature requires Pi Browser. Please download and install Pi Browser to connect your wallet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-card border border-border rounded-lg">
      {wallet.status === "disconnected" ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Pi Wallet Connection
          </h3>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 p-3 rounded border border-red-200">
              {error}
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Pi Wallet"
            )}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            Connect your Pi account to accept and execute digital rights
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Wallet Connected
              </h3>
              {userInfo && (
                <p className="text-xs text-green-600 font-medium mt-1">
                  @{userInfo.username}
                </p>
              )}
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-3 py-2 text-xs text-left text-muted-foreground bg-gray-50 hover:bg-gray-100 rounded border border-border transition-all flex items-center justify-between"
          >
            Wallet Details
            <ChevronDown
              size={14}
              className={`transition-transform ${
                showDetails ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDetails && userInfo && (
            <div className="p-3 bg-gray-50 rounded border border-border space-y-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">User ID</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-white p-2 rounded border border-border flex-1 overflow-hidden text-ellipsis">
                    {userInfo.uid}
                  </code>
                  <button
                    onClick={() => copyToClipboard(userInfo.uid)}
                    className="p-2 hover:bg-white rounded transition-all"
                    title="Copy User ID"
                  >
                    <Copy size={14} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              {userInfo.walletAddress && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Wallet Address
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-white p-2 rounded border border-border flex-1 overflow-hidden text-ellipsis">
                      {userInfo.walletAddress}
                    </code>
                    <button
                      onClick={() => copyToClipboard(userInfo.walletAddress!)}
                      className="p-2 hover:bg-white rounded transition-all"
                      title="Copy Wallet Address"
                    >
                      <Copy size={14} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              )}

              {copied && (
                <p className="text-xs text-green-600 font-medium">
                  Copied to clipboard
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleDisconnect}
            className="w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 rounded border border-red-200 transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={14} />
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
