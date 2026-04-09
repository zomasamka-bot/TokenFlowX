"use client";

import { useState } from "react";
import type { DigitalRight, Payment } from "@/lib/types";
import { PaymentBox } from "./payment-box";
import {
  formatDate,
  formatTime,
  daysUntilExpiry,
  isExpired,
} from "@/lib/proof-utils";
import { Activity, Calendar, Building2, Info } from "lucide-react";

interface RightDetailsProps {
  right: DigitalRight;
  onExecute: (payment?: Payment) => void;
  onViewActivity: () => void;
  onPaymentInitiated?: () => void;
}

export function RightDetails({
  right,
  onExecute,
  onViewActivity,
  onPaymentInitiated,
}: RightDetailsProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<Payment | null>(null);
  const expired = isExpired(right.expiresAt);
  const daysLeft = daysUntilExpiry(right.expiresAt);

  const handlePaymentSuccess = (payment: Payment) => {
    setShowPayment(false);
    // Store payment and execute
    setPendingPayment(payment);
    onExecute(payment);
  };

  const handleInitiateExecution = () => {
    if (right.amount && right.amount > 0) {
      setShowPayment(true);
    } else {
      // No payment required, execute directly
      onExecute();
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Main scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-32">
        {!showPayment && (
          <>
            {/* Header Card */}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">{right.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {right.description}
                </p>
              </div>

              <div className="inline-flex px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                {right.status === "active" && "Active"}
                {right.status === "used" && "Used"}
                {right.status === "processing" && "Processing"}
                {right.status === "completed" && "Completed"}
                {right.status === "failed" && "Failed"}
                {right.status === "expired" && "Expired"}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid gap-3">
              {/* Right Holder */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/50">
                <Building2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Right Holder</p>
                  <p className="text-sm font-medium text-foreground">
                    {right.rightHolder}
                  </p>
                </div>
              </div>

              {/* Issued Date */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/50">
                <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Issued</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(right.issuedAt)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(right.issuedAt)}
                  </p>
                </div>
              </div>

              {/* Expiration */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/50">
                <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Expires</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatDate(right.expiresAt)}
                  </p>
                  {!expired && (
                    <p className="text-xs text-primary font-medium mt-1">
                      {daysLeft} days remaining
                    </p>
                  )}
                  {expired && (
                    <p className="text-xs text-destructive font-medium mt-1">
                      Expired
                    </p>
                  )}
                </div>
              </div>

              {/* Price if applicable */}
              {right.amount && right.amount > 0 && (
                <div className="flex items-start gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
                  <div className="text-primary font-bold text-lg mt-0.5">₿</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-sm font-medium text-foreground">
                      {right.amount.toFixed(2)} {right.currency || "Pi"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-medium">Execution Proof</p>
                <p className="mt-1">
                  When you execute this right, a unique proof will be generated and recorded permanently.
                </p>
              </div>
            </div>
          </>
        )}

        {showPayment && (
          <>
            {/* Payment Section Header */}
            <div className="flex items-start gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">{right.title}</h2>
                <p className="text-xs text-muted-foreground mt-1">Execute & Pay</p>
              </div>
            </div>

            {/* Payment Box */}
            <PaymentBox
              right={right}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailed={() => setShowPayment(false)}
              onPaymentInitiated={onPaymentInitiated}
            />
          </>
        )}
      </div>

      {/* Fixed Action Buttons at bottom */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-4 py-4 bg-background/95 backdrop-blur border-t border-border space-y-2">
        {!showPayment ? (
          <>
            <button
              onClick={handleInitiateExecution}
              disabled={right.status !== "active" || expired}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                right.status === "active" && !expired
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Execute Right
            </button>

            <button
              onClick={onViewActivity}
              className="w-full py-2 px-4 rounded-lg font-medium text-sm border border-border text-foreground hover:bg-card/50 transition-all flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Activity Log
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowPayment(false)}
            className="w-full py-2 px-4 rounded-lg font-medium text-sm border border-border text-foreground hover:bg-card/50 transition-all"
          >
            Back to Details
          </button>
        )}
      </div>
    </div>
  );
}
