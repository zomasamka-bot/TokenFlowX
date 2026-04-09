"use client";

import { useState } from "react";
import type { DigitalRight, RightStatus } from "@/lib/types";
import { isExpired, daysUntilExpiry, formatDate } from "@/lib/proof-utils";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface RightsListProps {
  rights: DigitalRight[];
  onSelectRight: (rightId: string) => void;
}

type TabType = "active" | "used" | "expired" | "processing" | "completed" | "failed";

const TABS: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
  { id: "active", label: "Active", icon: <Clock className="w-4 h-4" /> },
  { id: "used", label: "Used", icon: <CheckCircle2 className="w-4 h-4" /> },
  { id: "processing", label: "Processing", icon: <Clock className="w-4 h-4" /> },
  { id: "completed", label: "Completed", icon: <CheckCircle2 className="w-4 h-4" /> },
  { id: "failed", label: "Failed", icon: <AlertCircle className="w-4 h-4" /> },
  { id: "expired", label: "Expired", icon: <AlertCircle className="w-4 h-4" /> },
];

export function RightsList({ rights, onSelectRight }: RightsListProps) {
  const [activeTab, setActiveTab] = useState<TabType>("active");

  const filteredRights = rights.filter((right) => {
    if (activeTab === "expired") {
      return right.status === "expired";
    }
    return right.status === activeTab;
  });

  const getStatusColor = (status: RightStatus): string => {
    switch (status) {
      case "active":
        return "border-primary/30 bg-primary/5";
      case "used":
        return "border-accent/30 bg-accent/5";
      case "processing":
        return "border-blue-300/30 bg-blue-50/50";
      case "completed":
        return "border-green-300/30 bg-green-50/50";
      case "failed":
        return "border-destructive/30 bg-destructive/5";
      case "expired":
        return "border-destructive/30 bg-destructive/5";
      default:
        return "border-border";
    }
  };

  const getStatusBadgeColor = (status: RightStatus): string => {
    switch (status) {
      case "active":
        return "bg-primary/20 text-primary";
      case "used":
        return "bg-accent/20 text-accent";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-destructive/20 text-destructive";
      case "expired":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className="pb-20">
      {/* Tabs */}
      <div className="flex gap-2 px-4 py-4 border-b border-border sticky top-16 bg-background/95 backdrop-blur">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.charAt(0)}</span>
          </button>
        ))}
      </div>

      {/* Rights List */}
      <div className="px-4 py-4 space-y-3">
        {filteredRights.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No {activeTab} rights available
            </p>
          </div>
        ) : (
          filteredRights.map((right) => (
            <div
              key={right.id}
              onClick={() => onSelectRight(right.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${getStatusColor(right.status)}`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {right.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusBadgeColor(right.status)}`}
                  >
                    {right.status === "active" && "Active"}
                    {right.status === "used" && "Used"}
                    {right.status === "processing" && "Processing"}
                    {right.status === "completed" && "Completed"}
                    {right.status === "failed" && "Failed"}
                    {right.status === "expired" && "Expired"}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {right.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    by {right.rightHolder}
                  </span>
                  {right.status === "active" && (
                    <span className="text-primary font-medium">
                      {daysUntilExpiry(right.expiresAt)} days left
                    </span>
                  )}
                  {right.status === "expired" && (
                    <span className="text-destructive font-medium">
                      Expired {formatDate(right.expiresAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
