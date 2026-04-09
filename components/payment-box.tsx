"use client";

import { useState } from "react";
import { Wallet, DollarSign, Lock, RefreshCw, AlertCircle } from "lucide-react";
import type { Payment, DigitalRight } from "@/lib/types";
import { isValidPiWallet } from "@/lib/pi-wallet";

interface PaymentBoxProps {
  right: DigitalRight;
  onPaymentSuccess: (payment: Payment) => void;
  onPaymentFailed: () => void;
  onPaymentInitiated?: () => void;
}

export function PaymentBox({
  right,
  onPaymentSuccess,
  onPaymentFailed,
  onPaymentInitiated,
}: PaymentBoxProps) {
  const [status, setStatus] = useState<"pending" | "processing" | "paid" | "failed">("pending");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);

  // Editable form state - store as strings to allow full editing
  const [formData, setFormData] = useState({
    recipientWallet: "0xPi...Recipient",
    rightValueStr: String(right.amount || 9.99),
    platformFeeStr: String((right.amount || 9.99) * 0.05),
    description: `Execution right: ${right.title}`,
    reference: `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  });

  // Convert string values to numbers for calculations
  const rightValue = parseFloat(formData.rightValueStr) || 0;
  const platformFee = parseFloat(formData.platformFeeStr) || 0;
  const total = rightValue + platformFee;
  const currency = right.currency || "Pi";
  const network = "Pi Testnet" as const;

  // Handle wallet input change
  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, recipientWallet: value }));
    // Validate as user types
    if (value.trim()) {
      const validation = isValidPiWallet(value);
      setWalletError(validation.valid ? null : validation.error || null);
    } else {
      setWalletError(null);
    }
  };

  // Handle right value change
  const handleRightValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      rightValueStr: value,
      // Auto-update platform fee when right value changes
      platformFeeStr: value ? String(parseFloat(value) * 0.05) : "0",
    }));
  };

  // Handle platform fee change
  const handlePlatformFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, platformFeeStr: e.target.value }));
  };

  // Handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  };

  // Handle reference change
  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, reference: e.target.value }));
  };

  // Generate new reference
  const generateNewReference = () => {
    const newRef = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setFormData(prev => ({ ...prev, reference: newRef }));
  };

  const handleProceed = () => {
    // Validate form
    if (!formData.recipientWallet.trim()) {
      setWalletError("Wallet address is required");
      return;
    }

    // Validate Pi wallet format
    const walletValidation = isValidPiWallet(formData.recipientWallet);
    if (!walletValidation.valid) {
      setWalletError(walletValidation.error || "Invalid wallet address");
      return;
    }
    setWalletError(null);

    if (rightValue <= 0) {
      alert("Right value must be greater than 0");
      return;
    }
    if (platformFee < 0) {
      alert("Platform fee cannot be negative");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter a description");
      return;
    }

    setStatus("processing");
    onPaymentInitiated?.();

    // Simulate Testnet payment processing
    setTimeout(() => {
      // 80% success rate for demo
      const isSuccess = Math.random() > 0.2;

      const newPayment: Payment = {
        id: `pay-${Date.now()}`,
        rightId: right.id,
        recipientWallet: formData.recipientWallet,
        rightValue,
        platformFee,
        total,
        currency,
        description: formData.description,
        reference: formData.reference,
        network,
        status: isSuccess ? "paid" : "failed",
        executionStatus: isSuccess ? "ready" : "pending",
        timestamp: new Date().toISOString(),
        processingTime: Math.random() * 3000 + 1000,
      };

      setPayment(newPayment);
      setStatus(isSuccess ? "paid" : "failed");

      if (isSuccess) {
        setTimeout(() => onPaymentSuccess(newPayment), 1500);
      }
    }, 2000);
  };

  const handleRetry = () => {
    setStatus("pending");
    setPayment(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-primary" />
        Payment for Execution
      </h3>

      {status === "pending" && (
        <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
          {/* Recipient Wallet Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              Recipient Wallet
            </label>
            <input
              type="text"
              value={formData.recipientWallet}
              onChange={handleWalletChange}
              placeholder="0xPi... (Pi Testnet address)"
              className={`w-full px-3 py-2 bg-background border rounded-lg text-xs font-mono focus:outline-none focus:ring-2 transition-all ${
                walletError
                  ? "border-red-500 focus:ring-red-500/50"
                  : "border-input focus:ring-primary/50"
              }`}
            />
            {walletError && (
              <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{walletError}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Pi Testnet wallet address (format: 0xPi... or Pi...)
            </p>
          </div>

          {/* Right Value Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Right Value</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.rightValueStr}
                onChange={handleRightValueChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="flex-1 px-3 py-2 bg-background border border-input rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="text-xs font-semibold text-foreground">{currency}</span>
            </div>
            <p className="text-xs text-muted-foreground">Base amount for this execution right</p>
          </div>

          {/* Platform Fee Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Platform Fee</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={formData.platformFeeStr}
                onChange={handlePlatformFeeChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="flex-1 px-3 py-2 bg-background border border-input rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <span className="text-xs font-semibold text-foreground">{currency}</span>
            </div>
            <p className="text-xs text-muted-foreground">Editable platform fee</p>
          </div>

          {/* Total (Auto-calculated) */}
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">
                {total.toFixed(2)} {currency}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {rightValue.toFixed(2)} + {platformFee.toFixed(2)} = {total.toFixed(2)} {currency}
            </div>
          </div>

          {/* Reference Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Reference</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.reference}
                onChange={handleReferenceChange}
                placeholder="REF-..."
                className="flex-1 px-3 py-2 bg-background border border-input rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={generateNewReference}
                className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-foreground transition-all flex items-center gap-1"
                title="Generate new reference"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Unique transaction identifier (editable, auto-generated on load)</p>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Description</label>
            <textarea
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Describe this transaction..."
              rows={3}
              className="w-full px-3 py-2 bg-background border border-input rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <p className="text-xs text-muted-foreground">Transaction description</p>
          </div>

          {/* Network */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700 font-semibold">Network</span>
              <span className="text-xs font-semibold text-blue-900">{network}</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">Fixed network for this testnet session</p>
          </div>

          {/* Status Fields */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-semibold">Payment Status</p>
              <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded text-center">
                Pending
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-semibold">Execution Status</p>
              <div className="px-2 py-1 bg-gray-300 text-gray-700 text-xs font-medium rounded text-center flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Locked
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Testable Form:</strong> All fields are editable. Verify values before proceeding to payment.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleProceed}
            disabled={walletError !== null || !formData.recipientWallet.trim()}
            className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
          >
            Proceed to Payment
          </button>
        </div>
      )}

      {status === "processing" && (
        <div className="flex flex-col items-center justify-center py-6 gap-3 p-4 bg-card border border-border rounded-lg">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-foreground">Processing Payment...</span>
          <p className="text-xs text-muted-foreground text-center">Sending to Pi Testnet</p>
        </div>
      )}

      {status === "paid" && payment && (
        <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          {/* Success Header */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <span className="text-sm font-semibold text-green-700">Payment Successful</span>
          </div>

          {/* Payment Confirmation - All 9 Fields */}
          <div className="space-y-2 pt-2 border-t border-green-300">
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs text-green-700 font-medium">Recipient Wallet</span>
              <span className="text-xs font-mono text-green-900 text-right break-all">{payment.recipientWallet}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-700 font-medium">Right Value</span>
              <span className="text-xs font-semibold text-green-900">
                {payment.rightValue.toFixed(2)} {currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-700 font-medium">Platform Fee</span>
              <span className="text-xs font-semibold text-green-900">
                {payment.platformFee.toFixed(2)} {currency}
              </span>
            </div>
            <div className="flex justify-between items-center font-bold border-t border-green-300 pt-1 mt-1">
              <span className="text-xs text-green-700">Total</span>
              <span className="text-sm text-green-900">
                {payment.total.toFixed(2)} {currency}
              </span>
            </div>
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs text-green-700 font-medium">Reference</span>
              <span className="text-xs font-mono text-green-900 text-right break-all">{payment.reference}</span>
            </div>
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs text-green-700 font-medium">Description</span>
              <span className="text-xs text-green-900 text-right max-w-xs">{payment.description}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-green-700 font-medium">Network</span>
              <span className="text-xs font-semibold text-green-900">{payment.network}</span>
            </div>
          </div>

          {/* Status Update */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-green-300">
            <div>
              <p className="text-xs text-green-700 font-medium mb-1">Payment Status</p>
              <div className="px-2 py-1 bg-green-200 text-green-700 text-xs font-bold rounded text-center">
                Paid
              </div>
            </div>
            <div>
              <p className="text-xs text-green-700 font-medium mb-1">Execution Status</p>
              <div className="px-2 py-1 bg-green-200 text-green-700 text-xs font-bold rounded text-center">
                Ready
              </div>
            </div>
          </div>

          <p className="text-xs text-green-600 text-center pt-2">
            Ready to execute the right. Proceed to confirmation.
          </p>
        </div>
      )}

      {status === "failed" && (
        <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">✕</span>
            </div>
            <span className="text-sm font-semibold text-red-700">Payment Failed</span>
          </div>

          <p className="text-xs text-red-600 pt-2">
            The payment could not be processed on Pi Testnet. Please verify your wallet and try again.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div>
              <p className="text-xs text-red-700 font-medium mb-1">Payment Status</p>
              <div className="px-2 py-1 bg-red-200 text-red-700 text-xs font-bold rounded text-center">
                Failed
              </div>
            </div>
            <div>
              <p className="text-xs text-red-700 font-medium mb-1">Execution Status</p>
              <div className="px-2 py-1 bg-gray-300 text-gray-700 text-xs font-medium rounded text-center flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Locked
              </div>
            </div>
          </div>

          <button
            onClick={handleRetry}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all mt-2"
          >
            Retry Payment
          </button>
        </div>
      )}
    </div>
  );
}
