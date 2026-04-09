"use client";

import type { Proof, DigitalRight } from "@/lib/types";
import { formatDateTime } from "@/lib/proof-utils";
import { X, Copy, Download, Share2 } from "lucide-react";
import { useState } from "react";

interface ReceiptProps {
  proof: Proof;
  right?: DigitalRight | null;
  onClose: () => void;
}

export function Receipt({ proof, right, onClose }: ReceiptProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleExport = () => {
    const receiptData = {
      proofId: proof.proofId,
      status: proof.status,
      reference: proof.reference,
      timestamp: proof.timestamp,
      executionTime: proof.executionTime,
      right: proof.right,
      payment: proof.payment,
    };
    
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `execution-proof-${proof.proofId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isSuccess = proof.status === "completed";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background border border-primary/30 rounded-lg max-w-sm w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur">
          <h3 className="font-bold text-foreground">Execution Proof</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status */}
          <div className="text-center py-4">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
              isSuccess ? 'bg-primary/20' : 'bg-destructive/20'
            }`}>
              <div className={`w-6 h-6 rounded-full border-2 ${
                isSuccess 
                  ? 'border-primary/30 border-t-primary' 
                  : 'border-destructive/30 border-t-destructive'
              } animate-spin`} />
            </div>
            <p className={`mt-2 font-semibold capitalize ${
              isSuccess ? 'text-foreground' : 'text-destructive'
            }`}>
              {proof.status}
            </p>
          </div>

          {/* Right Info */}
          {right && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
              <p className="text-xs text-muted-foreground font-medium">
                ASSOCIATED RIGHT
              </p>
              <p className="font-medium text-foreground text-sm">{right.title}</p>
              <p className="text-xs text-muted-foreground">{right.description}</p>
            </div>
          )}

          {/* Payment Info */}
          {proof.payment && (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 space-y-3">
              <p className="text-xs text-blue-700 font-bold">PAYMENT DETAILS</p>
              
              {/* Recipient Wallet */}
              <div className="space-y-1">
                <p className="text-xs text-blue-700 font-medium">Recipient Wallet</p>
                <p className="text-xs font-mono text-blue-900 break-all bg-white rounded p-1.5">
                  {proof.payment.recipientWallet}
                </p>
              </div>

              {/* Payment Breakdown */}
              <div className="bg-white rounded p-2 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-700">Right Value</span>
                  <span className="text-xs font-semibold text-blue-900">
                    {proof.payment.rightValue.toFixed(2)} {proof.payment.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-700">Platform Fee</span>
                  <span className="text-xs font-semibold text-blue-900">
                    {proof.payment.platformFee.toFixed(2)} {proof.payment.currency}
                  </span>
                </div>
                <div className="border-t border-blue-200 pt-1 flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-700">Total</span>
                  <span className="text-sm font-bold text-blue-900">
                    {proof.payment.total.toFixed(2)} {proof.payment.currency}
                  </span>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="bg-white rounded p-2 space-y-1">
                <div className="flex justify-between items-start gap-1">
                  <span className="text-xs text-blue-700 font-medium">Reference</span>
                  <span className="text-xs font-mono text-blue-900 text-right break-all">
                    {proof.payment.reference}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-1">
                  <span className="text-xs text-blue-700 font-medium">Network</span>
                  <span className="text-xs font-semibold text-blue-900">
                    {proof.payment.network}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-1">
                  <span className="text-xs text-blue-700 font-medium">Description</span>
                  <span className="text-xs text-blue-900 text-right">
                    {proof.payment.description}
                  </span>
                </div>
              </div>

              {/* Status Fields */}
              <div className="grid grid-cols-2 gap-2 bg-white rounded p-2">
                <div>
                  <p className="text-xs text-blue-700 font-medium mb-1">Payment Status</p>
                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded text-center">
                    {proof.payment.status.charAt(0).toUpperCase() + proof.payment.status.slice(1)}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-blue-700 font-medium mb-1">Execution Status</p>
                  <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded text-center">
                    {proof.payment.executionStatus.charAt(0).toUpperCase() + proof.payment.executionStatus.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Proof Details */}
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                PROOF ID
              </p>
              <div className="flex items-center justify-between bg-background/50 rounded p-2 gap-2">
                <code className="text-xs font-mono text-foreground break-all flex-1">
                  {proof.proofId}
                </code>
                <button
                  onClick={() => copyToClipboard(proof.proofId, "proofId")}
                  className="text-primary hover:text-primary/80 flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                REFERENCE
              </p>
              <div className="flex items-center justify-between bg-background/50 rounded p-2 gap-2">
                <code className="text-xs font-mono text-foreground break-all flex-1">
                  {proof.reference}
                </code>
                <button
                  onClick={() => copyToClipboard(proof.reference, "reference")}
                  className="text-primary hover:text-primary/80 flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-2 rounded bg-background/50 border border-border/50">
              <p className="text-xs text-muted-foreground font-medium">Date & Time</p>
              <p className="text-sm font-semibold text-foreground mt-1">
                {formatDateTime(proof.timestamp)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-background/50 border border-border/50">
                <p className="text-muted-foreground font-medium">Status</p>
                <p className="text-foreground font-semibold mt-1 capitalize">
                  {proof.status}
                </p>
              </div>
              <div className="p-2 rounded bg-background/50 border border-border/50">
                <p className="text-muted-foreground font-medium">Exec Time</p>
                <p className="text-foreground font-semibold mt-1">
                  {(proof.executionTime / 1000).toFixed(2)}s
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => copyToClipboard(proof.proofId, "full")}
              className={`py-2 px-2 rounded border transition-all flex flex-col items-center justify-center gap-1 text-xs font-medium ${
                copied === "full"
                  ? "bg-primary/20 text-primary border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>

            <button
              onClick={() => {
                const proofText = `Proof: ${proof.proofId}\nRef: ${proof.reference}\nStatus: ${proof.status}`;
                if (navigator.share) {
                  navigator.share({
                    title: 'TokenFlowX Receipt',
                    text: proofText,
                  });
                } else {
                  copyToClipboard(proofText, "share");
                }
              }}
              className="py-2 px-2 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex flex-col items-center justify-center gap-1 text-xs font-medium"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              onClick={handleExport}
              className="py-2 px-2 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex flex-col items-center justify-center gap-1 text-xs font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Close Button */}
        <div className="sticky bottom-0 p-4 border-t border-border bg-background/95 backdrop-blur">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-lg font-medium text-sm bg-primary/20 text-primary hover:bg-primary/30 transition-all"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
