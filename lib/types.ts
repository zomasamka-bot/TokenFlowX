export type RightStatus = "active" | "used" | "expired" | "processing" | "completed" | "failed";
export type PaymentStatus = "pending" | "processing" | "paid" | "failed";
export type ExecutionStatus = "pending" | "ready" | "executed" | "failed";
export type WalletStatus = "disconnected" | "loading" | "connected";

export interface DigitalRight {
  id: string;
  title: string;
  description: string;
  expiresAt: string;
  status: RightStatus;
  issuedAt: string;
  rightHolder: string;
  amount?: number;
  currency?: string;
}

export interface Payment {
  id: string;
  rightId: string;
  recipientWallet: string;
  rightValue: number;
  platformFee: number;
  total: number;
  currency: string;
  description: string;
  reference: string;
  network: "Pi Testnet";
  status: PaymentStatus;
  executionStatus: ExecutionStatus;
  timestamp: string;
  processingTime?: number;
}

export interface WalletConnection {
  status: WalletStatus;
  address?: string;
  connectedAt?: string;
}

export interface Proof {
  id: string;
  proofId: string;
  status: ExecutionStatus;
  timestamp: string;
  rightId: string;
  executionTime: number;
  reference: string;
  payment?: Payment;
  right?: DigitalRight;
}

export interface Activity {
  id: string;
  rightId: string;
  action: "accepted" | "executed" | "rejected" | "payment_initiated" | "payment_failed";
  timestamp: string;
  status: "success" | "failed" | "pending";
  proof?: Proof;
  error?: string;
}
