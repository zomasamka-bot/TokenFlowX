import type { DigitalRight, Proof, Activity, Payment } from "./types";

export function generateProof(right: DigitalRight, payment?: Payment): Proof {
  const now = new Date();
  const proofId = `PROOF-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
  const executionTime = Math.floor(Math.random() * 2000) + 500; // 500-2500ms

  return {
    id: `proof_${right.id}_${Date.now()}`,
    proofId,
    status: "executed",
    timestamp: now.toISOString(),
    rightId: right.id,
    executionTime,
    reference: payment?.reference || `REF-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
    payment,
    right,
  };
}

export function generateActivity(
  right: DigitalRight,
  action: "accepted" | "executed" | "rejected" | "payment_initiated" | "payment_failed",
  status: "success" | "failed" | "pending" = "success",
  payment?: Payment
): Activity {
  const proof = action === "executed" && status === "success" ? generateProof(right, payment) : undefined;

  return {
    id: `activity_${Date.now()}_${Math.random()}`,
    rightId: right.id,
    action,
    timestamp: new Date().toISOString(),
    status,
    proof,
  };
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatExecutionTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

export function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

export function daysUntilExpiry(expiresAt: string): number {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
