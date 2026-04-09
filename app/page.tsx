"use client";

import { useState } from "react";
import { RightsList } from "@/components/rights-list";
import { RightDetails } from "@/components/right-details";
import { ProofScreen } from "@/components/proof-screen";
import { ActivityLog } from "@/components/activity-log";
import { Receipt } from "@/components/receipt";
import { ExecutionConfirmation } from "@/components/execution-confirmation";
import { WalletConnectionComponent } from "@/components/wallet-connection";
import type { DigitalRight, RightStatus, Activity, Proof, Payment, WalletConnection } from "@/lib/types";
import { generateProof, generateActivity } from "@/lib/proof-utils";

// Sample digital rights data with pricing
const SAMPLE_RIGHTS: DigitalRight[] = [
  {
    id: "dr001",
    title: "Content Distribution License",
    description: "License to distribute video content across platforms",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active" as RightStatus,
    issuedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    rightHolder: "Creative Studios Inc",
    amount: 49.99,
    currency: "Pi",
  },
  {
    id: "dr002",
    title: "API Usage Rights",
    description: "Permission to use API for web services",
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active" as RightStatus,
    issuedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    rightHolder: "TechFlow Corp",
    amount: 29.99,
    currency: "Pi",
  },
  {
    id: "dr003",
    title: "Previous Content License",
    description: "Archived distribution rights",
    expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "expired" as RightStatus,
    issuedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    rightHolder: "Archive Media",
    amount: 19.99,
    currency: "Pi",
  },
  {
    id: "dr004",
    title: "Data Processing Rights",
    description: "Rights to process customer data",
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active" as RightStatus,
    issuedAt: new Date().toISOString(),
    rightHolder: "DataFlow Systems",
    amount: 39.99,
    currency: "Pi",
  },
];

type View = "list" | "details" | "proof" | "activity";

export default function HomePage() {
  const [rights, setRights] = useState<DigitalRight[]>(SAMPLE_RIGHTS);
  const [view, setView] = useState<View>("list");
  const [selectedRightId, setSelectedRightId] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentProof, setCurrentProof] = useState<Proof | null>(null);
  const [receipt, setReceipt] = useState<Proof | null>(null);
  const [wallet, setWallet] = useState<WalletConnection>({ status: "disconnected" });
  const [showExecutionConfirmation, setShowExecutionConfirmation] = useState(false);
  const [pendingPaymentForExecution, setPendingPaymentForExecution] = useState<Payment | null>(null);

  const selectedRight = rights.find((r) => r.id === selectedRightId);

  const handleAcceptRight = (rightId: string) => {
    setSelectedRightId(rightId);
    setView("details");
  };

  const handlePaymentInitiated = () => {
    if (!selectedRight) return;
    // Update status to processing during payment
    setRights((prev) =>
      prev.map((r) =>
        r.id === selectedRight.id ? { ...r, status: "processing" as RightStatus } : r
      )
    );
  };

  const handlePaymentSuccess = (payment: Payment) => {
    if (!selectedRight) return;
    // Update status to reflect payment success - ready for execution
    setRights((prev) =>
      prev.map((r) =>
        r.id === selectedRight.id ? { ...r, status: "processing" as RightStatus } : r
      )
    );
  };

  const handleExecuteRight = (payment?: Payment) => {
    // Store payment and show confirmation
    setPendingPaymentForExecution(payment || null);
    setShowExecutionConfirmation(true);
  };

  const handleConfirmExecution = () => {
    if (!selectedRight) {
      setShowExecutionConfirmation(false);
      return;
    }

    if (!pendingPaymentForExecution) {
      setShowExecutionConfirmation(false);
      return;
    }

    // Verify payment is in successful state
    if (pendingPaymentForExecution.status !== "paid") {
      setShowExecutionConfirmation(false);
      return;
    }

    // Generate proof immediately
    try {
      const proof = generateProof(selectedRight, pendingPaymentForExecution);

      // Set all states together but close modal first
      setShowExecutionConfirmation(false);
      setCurrentProof(proof);
      setReceipt(proof);

      // Generate activity log
      const activity = generateActivity(
        selectedRight,
        "executed",
        "success",
        pendingPaymentForExecution
      );
      setActivities((prev) => [activity, ...prev]);

      // Update right status to completed
      setRights((prev) =>
        prev.map((r) =>
          r.id === selectedRight.id ? { ...r, status: "completed" as RightStatus } : r
        )
      );

      // Navigate to proof view after a small delay to ensure state batching completes
      setTimeout(() => {
        setView("proof");
      }, 50);
    } catch (error) {
      console.error("[v0] ERROR in handleConfirmExecution:", error);
      setShowExecutionConfirmation(false);
      alert("Error executing right: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleViewActivityLog = () => {
    setView("activity");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedRightId(null);
  };

  const handleBackToDetails = () => {
    setView("details");
    // Keep selectedRightId intact for navigation
  };

  const handleViewReceipt = (proof: Proof) => {
    setCurrentProof(proof);
    setReceipt(proof);
    setView("proof");
  };

  const handleWalletConnect = (connection: WalletConnection) => {
    setWallet(connection);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto w-full">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">T</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-foreground">TokenFlowX</h1>
                <p className="text-xs text-muted-foreground -mt-0.5">Digital Rights Execution</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {view !== "list" && (
              <button
                onClick={handleBackToList}
                className="text-xs px-2.5 py-1.5 rounded-lg font-medium border border-border text-foreground hover:bg-card/50 transition-all"
              >
                ← Back
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto w-full flex-1 flex flex-col">
        {view === "list" && (
          <div className="flex flex-col gap-4 p-4">
            <WalletConnectionComponent onConnect={handleWalletConnect} />
            <RightsList rights={rights} onSelectRight={handleAcceptRight} />
          </div>
        )}
        {view === "details" && selectedRight && (
          <RightDetails
            right={selectedRight}
            onExecute={handleExecuteRight}
            onViewActivity={handleViewActivityLog}
            onPaymentInitiated={handlePaymentInitiated}
          />
        )}
        {view === "proof" && (
          currentProof ? (
            <ProofScreen
              proof={currentProof}
              onBack={handleBackToDetails}
              onViewReceipt={() => setReceipt(currentProof)}
            />
          ) : (
            <div className="px-4 py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <span className="text-red-600 text-xl">!</span>
              </div>
              <p className="text-sm font-medium text-foreground">Error generating proof</p>
              <button
                onClick={handleBackToDetails}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
              >
                Back to Details
              </button>
            </div>
          )
        )}
        {view === "activity" && (
          <ActivityLog
            activities={activities}
            onBack={handleBackToDetails}
            onViewReceipt={handleViewReceipt}
          />
        )}
        {/* Fallback for blank screens */}
        {view === "details" && !selectedRight && (
          <div className="px-4 py-6 text-center">
            <p className="text-muted-foreground mb-4">No right selected</p>
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
            >
              Back to List
            </button>
          </div>
        )}
        
        {/* Catch-all for unknown view states */}
        {!["list", "details", "proof", "activity"].includes(view) && (
          <div className="px-4 py-6 text-center">
            <p className="text-red-600 mb-4">Unknown view state: {view}</p>
            <button
              onClick={handleBackToList}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
            >
              Go to List
            </button>
          </div>
        )}
      </main>

      {/* Execution Confirmation Modal */}
      {showExecutionConfirmation && selectedRight && (
        <ExecutionConfirmation
          right={selectedRight}
          onConfirm={handleConfirmExecution}
          onCancel={() => setShowExecutionConfirmation(false)}
        />
      )}

      {/* Receipt Modal */}
      {receipt && view === "proof" && selectedRight && (
        <Receipt
          proof={receipt}
          right={selectedRight}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  );
}
