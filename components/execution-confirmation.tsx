"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import type { DigitalRight } from "@/lib/types";

interface ExecutionConfirmationProps {
  right: DigitalRight;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ExecutionConfirmation({
  right,
  onConfirm,
  onCancel,
}: ExecutionConfirmationProps) {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = () => {
    setIsExecuting(true);
    // Brief delay to show executing state
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background border border-primary/30 rounded-lg max-w-sm w-full space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-border">
          <div className="flex items-start gap-3 flex-1">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-foreground">Confirm Execution</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                This action will be recorded as verifiable proof
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isExecuting}
            className="text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 space-y-4">
          {!isExecuting ? (
            <>
              {/* Message */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-foreground leading-relaxed">
                  You are about to execute this right. This action will be recorded as verifiable proof and cannot be undone.
                </p>
              </div>

              {/* Right Details Summary */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Right Details</p>
                <div className="p-3 bg-card/50 rounded-lg border border-border/50 space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Title</p>
                    <p className="text-sm font-medium text-foreground">{right.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Right Holder</p>
                    <p className="text-sm font-medium text-foreground">{right.rightHolder}</p>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Before you proceed</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground">Execution proof will be generated automatically</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground">Activity will be logged permanently</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-foreground">You can export your proof anytime</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-foreground">Executing...</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isExecuting && (
          <div className="flex gap-2 p-4 border-t border-border">
            <button
              onClick={onCancel}
              className="flex-1 py-2 px-4 rounded-lg font-medium text-sm border border-border text-foreground hover:bg-card/50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              className="flex-1 py-2 px-4 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all"
            >
              Execute Right
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
