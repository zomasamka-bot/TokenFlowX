"use client";

import type { Proof } from "@/lib/types";
import { formatDate, formatTime, formatExecutionTime, formatDateTime } from "@/lib/proof-utils";
import {
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Share2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface ProofScreenProps {
  proof: Proof;
  onBack: () => void;
  onViewReceipt: () => void;
}

export function ProofScreen({
  proof,
  onBack,
  onViewReceipt,
}: ProofScreenProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExport = () => {
    const proofData = {
      proofId: proof.proofId,
      status: proof.status,
      reference: proof.reference,
      timestamp: proof.timestamp,
      executionTime: proof.executionTime,
      payment: proof.payment,
      right: proof.right,
    };
    
    const dataStr = JSON.stringify(proofData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `execution-proof-${proof.proofId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isSuccess = proof.status === "executed";

  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      {/* Success/Failed Animation */}
      <div className="flex justify-center pt-8">
        <div className="relative w-24 h-24">
          <div className={`absolute inset-0 ${isSuccess ? 'bg-primary/20' : 'bg-destructive/20'} rounded-full animate-pulse`} />
          <div className={`absolute inset-2 ${isSuccess ? 'bg-primary/10' : 'bg-destructive/10'} rounded-full`} />
          <div className="flex items-center justify-center h-24">
            {isSuccess ? (
              <CheckCircle2 className="w-20 h-20 text-primary" />
            ) : (
              <AlertCircle className="w-20 h-20 text-destructive" />
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center space-y-2">
        <h2 className={`text-2xl font-bold ${isSuccess ? 'text-foreground' : 'text-destructive'}`}>
          {isSuccess ? 'Execution Completed' : 'Execution Failed'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isSuccess 
            ? 'Your right has been successfully executed and recorded'
            : 'There was an error executing your right. Please try again.'}
        </p>
      </div>

      {/* Proof Details Card */}
      <div className={`rounded-lg border p-4 space-y-4 ${
        isSuccess 
          ? 'border-primary/30 bg-primary/5' 
          : 'border-destructive/30 bg-destructive/5'
      }`}>
        {/* Proof ID */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">PROOF ID</p>
          <div className="flex items-center justify-between bg-background/50 rounded p-3 gap-2">
            <code className="text-sm font-mono text-foreground break-all">
              {proof.proofId}
            </code>
            <button
              onClick={() => copyToClipboard(proof.proofId, "proofId")}
              className="text-primary hover:text-primary/80 flex-shrink-0"
              title="Copy Proof ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reference ID */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">REFERENCE</p>
          <div className="flex items-center justify-between bg-background/50 rounded p-3 gap-2">
            <code className="text-sm font-mono text-foreground break-all">
              {proof.reference}
            </code>
            <button
              onClick={() => copyToClipboard(proof.reference, "reference")}
              className="text-primary hover:text-primary/80 flex-shrink-0"
              title="Copy Reference"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Status */}
        <div className="p-3 rounded-lg border border-border/50 bg-card/50">
          <p className="text-xs text-muted-foreground">Status</p>
          <div className="flex items-center gap-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${
              isSuccess ? 'bg-primary' : 'bg-destructive'
            }`} />
            <p className="text-sm font-semibold text-foreground capitalize">
              {proof.status}
            </p>
          </div>
        </div>

        {/* Execution Time */}
        <div className="p-3 rounded-lg border border-border/50 bg-card/50">
          <p className="text-xs text-muted-foreground">Execution Time</p>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">
              {formatExecutionTime(proof.executionTime)}
            </p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="col-span-2 p-3 rounded-lg border border-border/50 bg-card/50">
          <p className="text-xs text-muted-foreground">Date & Time</p>
          <p className="text-sm font-semibold text-foreground mt-2">
            {formatDateTime(proof.timestamp)}
          </p>
        </div>

        {/* Associated Right */}
        {proof.right && (
          <div className="col-span-2 p-3 rounded-lg border border-border/50 bg-card/50">
            <p className="text-xs text-muted-foreground">Associated Right</p>
            <p className="text-sm font-semibold text-foreground mt-2">
              {proof.right.title}
            </p>
          </div>
        )}

        {/* Payment Info */}
        {proof.payment && (
          <div className="col-span-2 p-3 rounded-lg border border-border/50 bg-card/50">
            <p className="text-xs text-muted-foreground">Payment</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {proof.payment.amount.toFixed(2)} {proof.payment.currency}
              </p>
              <p className="text-xs text-muted-foreground">
                {proof.payment.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 fixed bottom-0 left-0 right-0 px-4 py-4 bg-background/95 backdrop-blur border-t border-border max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => copyToClipboard(proof.proofId, "full")}
            className={`py-2 px-3 rounded-lg border transition-all flex items-center justify-center gap-1 text-xs font-medium ${
              copied === "full"
                ? "bg-primary/20 text-primary border-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            <Copy className="w-3 h-3" />
            <span className="hidden sm:inline">Copy</span>
          </button>

          <button
            onClick={() => {
              const proofText = `Proof: ${proof.proofId}\nRef: ${proof.reference}\nStatus: ${proof.status}`;
              if (navigator.share) {
                navigator.share({
                  title: 'TokenFlowX Proof',
                  text: proofText,
                });
              } else {
                copyToClipboard(proofText, "share");
              }
            }}
            className="py-2 px-3 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center justify-center gap-1 text-xs font-medium"
          >
            <Share2 className="w-3 h-3" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={handleExport}
            className="py-2 px-3 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center justify-center gap-1 text-xs font-medium"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        <button
          onClick={onBack}
          className="w-full py-3 px-4 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all"
        >
          View Right Details
        </button>
      </div>
    </div>
  );
}
