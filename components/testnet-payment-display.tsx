"use client";

import { Wallet, DollarSign, Network, CheckCircle2, Lock, AlertCircle } from "lucide-react";
import type { Payment } from "@/lib/types";

interface TestnetPaymentDisplayProps {
  payment?: Payment;
  rightValue?: number;
  platformFee?: number;
  total?: number;
  recipientWallet?: string;
  reference?: string;
  description?: string;
  executionLocked?: boolean;
}

export function TestnetPaymentDisplay({
  payment,
  rightValue,
  platformFee,
  total,
  recipientWallet,
  reference,
  description,
  executionLocked = true,
}: TestnetPaymentDisplayProps) {
  const displayRightValue = payment?.rightValue || rightValue || 0;
  const displayFee = payment?.platformFee || platformFee || 0;
  const displayTotal = payment?.total || total || 0;
  const displayWallet = payment?.recipientWallet || recipientWallet || "0xPi...Recipient";
  const displayReference = payment?.reference || reference || "";
  const displayDescription = payment?.description || description || "";
  const paymentStatus = payment?.status || "pending";
  const executionStatus = payment?.executionStatus || (executionLocked ? "locked" : "pending");

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Network className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-semibold text-foreground">Pi Testnet Payment</h3>
      </div>

      {/* Wallet Information - Always Visible */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-blue-700">Recipient Wallet</span>
        </div>
        <p className="text-xs font-mono text-blue-900 break-all">{displayWallet}</p>
        <p className="text-xs text-blue-600 mt-1">Pi Testnet Address</p>
      </div>

      {/* Payment Breakdown - Always Visible */}
      <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Right Value</span>
          <span className="text-sm font-medium text-foreground">
            {displayRightValue.toFixed(2)} Pi
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Platform Fee (5%)</span>
          <span className="text-sm font-medium text-foreground">
            {displayFee.toFixed(2)} Pi
          </span>
        </div>
        <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between items-center">
          <span className="text-xs font-semibold text-foreground">Total</span>
          <span className="text-lg font-bold text-primary">
            {displayTotal.toFixed(2)} Pi
          </span>
        </div>
      </div>

      {/* Transaction Details - Always Visible */}
      <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex justify-between items-start gap-2">
          <span className="text-xs text-muted-foreground">Reference</span>
          <span className="text-xs font-mono text-foreground text-right break-all">
            {displayReference}
          </span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-xs text-muted-foreground">Description</span>
          <span className="text-xs text-foreground text-right">{displayDescription}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Network</span>
          <span className="text-xs font-semibold text-blue-600">Pi Testnet</span>
        </div>
      </div>

      {/* Status Fields - Dynamic Based on Payment State */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
        {/* Payment Status */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Payment Status</p>
          {paymentStatus === "pending" && (
            <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded text-center">
              Pending
            </div>
          )}
          {paymentStatus === "processing" && (
            <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded text-center animate-pulse">
              Processing
            </div>
          )}
          {paymentStatus === "paid" && (
            <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded text-center flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Paid
            </div>
          )}
          {paymentStatus === "failed" && (
            <div className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded text-center">
              Failed
            </div>
          )}
        </div>

        {/* Execution Status */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Execution Status</p>
          {executionStatus === "locked" && (
            <div className="px-2 py-1 bg-gray-300 text-gray-700 text-xs font-medium rounded text-center flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Locked
            </div>
          )}
          {executionStatus === "pending" && (
            <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded text-center">
              Pending
            </div>
          )}
          {executionStatus === "ready" && (
            <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded text-center">
              Ready
            </div>
          )}
          {executionStatus === "executed" && (
            <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded text-center flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Executed
            </div>
          )}
          {executionStatus === "failed" && (
            <div className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded text-center">
              Failed
            </div>
          )}
        </div>
      </div>

      {/* Info/Warning Messages */}
      {paymentStatus === "pending" && executionStatus === "locked" && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            <strong>Execution Locked:</strong> Payment must be completed before execution.
          </p>
        </div>
      )}

      {paymentStatus === "paid" && executionStatus === "ready" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-green-700">
            <strong>Payment Complete:</strong> Execution is now ready to proceed.
          </p>
        </div>
      )}

      {executionStatus === "executed" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-green-700">
            <strong>Execution Complete:</strong> Right has been executed and recorded on Pi Testnet.
          </p>
        </div>
      )}

      {paymentStatus === "failed" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">
            <strong>Payment Failed:</strong> Unable to process payment on Pi Testnet. Please retry.
          </p>
        </div>
      )}

      {executionStatus === "failed" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">
            <strong>Execution Failed:</strong> There was an error executing the right.
          </p>
        </div>
      )}
    </div>
  );
}
