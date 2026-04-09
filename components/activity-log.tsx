"use client";

import type { Activity, Proof } from "@/lib/types";
import { formatDateTime } from "@/lib/proof-utils";
import { CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";

interface ActivityLogProps {
  activities: Activity[];
  onBack: () => void;
  onViewReceipt: (proof: Proof) => void;
}

export function ActivityLog({
  activities,
  onBack,
  onViewReceipt,
}: ActivityLogProps) {
  const getActionIcon = (action: string, status: string) => {
    if (status === "failed") {
      return <XCircle className="w-5 h-5 text-destructive" />;
    }

    switch (action) {
      case "executed":
        return <CheckCircle2 className="w-5 h-5 text-primary" />;
      case "payment_initiated":
        return <Clock className="w-5 h-5 text-primary" />;
      case "payment_failed":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "accepted":
        return <Clock className="w-5 h-5 text-primary" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "executed":
        return "Execution Completed";
      case "payment_initiated":
        return "Payment Initiated";
      case "payment_failed":
        return "Payment Failed";
      case "accepted":
        return "Right Accepted";
      case "rejected":
        return "Right Rejected";
      default:
        return action;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="px-4 py-6 space-y-4 pb-20">
      <div>
        <h2 className="text-lg font-bold text-foreground">Activity Log</h2>
        <p className="text-sm text-muted-foreground">
          {activities.length === 0
            ? "No activities yet"
            : `${activities.length} action${activities.length !== 1 ? "s" : ""} recorded`}
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No activities to display</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 rounded-lg border border-border/50 bg-card/50 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">{getActionIcon(activity.action, activity.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {getActionLabel(activity.action)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded inline-block ${getStatusBadge(activity.status)}`}>
                        {activity.status === "success" ? "Success" : activity.status === "failed" ? "Failed" : "Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDateTime(activity.timestamp)}
                    </p>
                    {activity.error && (
                      <p className="text-xs text-destructive mt-1">
                        Error: {activity.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {activity.proof && activity.status === "success" && (
                <button
                  onClick={() => onViewReceipt(activity.proof!)}
                  className="w-full py-2 px-3 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-medium hover:bg-primary/10 transition-all"
                >
                  View Execution Proof
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Back Button */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-background/95 backdrop-blur border-t border-border max-w-md mx-auto">
        <button
          onClick={onBack}
          className="w-full py-3 px-4 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all"
        >
          Back to Right
        </button>
      </div>
    </div>
  );
}
