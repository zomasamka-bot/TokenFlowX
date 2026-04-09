import type { DigitalRight, RightStatus, Activity, Proof, Payment, WalletConnection } from "./types";

export type AppView = "list" | "details" | "proof" | "activity";

export interface AppState {
  rights: DigitalRight[];
  view: AppView;
  selectedRightId: string | null;
  activities: Activity[];
  currentProof: Proof | null;
  wallet: WalletConnection;
  showWallet: boolean;
  isProcessing: boolean;
}

export interface AppActions {
  selectRight: (rightId: string) => void;
  deselectRight: () => void;
  setView: (view: AppView) => void;
  initiatePayment: () => void;
  completePayment: (payment: Payment) => void;
  executeRight: (payment?: Payment) => void;
  viewActivityLog: () => void;
  viewProof: (proof: Proof) => void;
  connectWallet: (connection: WalletConnection) => void;
  toggleWallet: () => void;
}

export class UnifiedCoreEngine {
  private state: AppState;
  private listeners: Array<(state: AppState) => void> = [];

  constructor(initialRights: DigitalRight[]) {
    this.state = {
      rights: initialRights,
      view: "list",
      selectedRightId: null,
      activities: [],
      currentProof: null,
      wallet: { status: "disconnected" },
      showWallet: false,
      isProcessing: false,
    };
  }

  // Getters
  getState(): AppState {
    return { ...this.state };
  }

  getSelectedRight(): DigitalRight | null {
    if (!this.state.selectedRightId) return null;
    return this.state.rights.find((r) => r.id === this.state.selectedRightId) || null;
  }

  // State mutations
  updateRight(rightId: string, updates: Partial<DigitalRight>): void {
    this.state.rights = this.state.rights.map((r) =>
      r.id === rightId ? { ...r, ...updates } : r
    );
    this.notifyListeners();
  }

  addActivity(activity: Activity): void {
    this.state.activities = [activity, ...this.state.activities];
    this.notifyListeners();
  }

  // View management
  selectRight(rightId: string): void {
    this.state.selectedRightId = rightId;
    this.state.view = "details";
    this.notifyListeners();
  }

  deselectRight(): void {
    this.state.selectedRightId = null;
    this.state.view = "list";
    this.notifyListeners();
  }

  setView(view: AppView): void {
    this.state.view = view;
    this.notifyListeners();
  }

  // Wallet management
  connectWallet(connection: WalletConnection): void {
    this.state.wallet = connection;
    this.state.showWallet = false;
    this.notifyListeners();
  }

  toggleWallet(): void {
    this.state.showWallet = !this.state.showWallet;
    this.notifyListeners();
  }

  // Processing state
  setProcessing(isProcessing: boolean): void {
    this.state.isProcessing = isProcessing;
    this.notifyListeners();
  }

  // Proof management
  setCurrentProof(proof: Proof | null): void {
    this.state.currentProof = proof;
    this.notifyListeners();
  }

  // Event listeners
  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  // Utility methods
  getRightsByStatus(status: RightStatus): DigitalRight[] {
    return this.state.rights.filter((r) => r.status === status);
  }

  getActiveRights(): DigitalRight[] {
    return this.state.rights.filter((r) => r.status === "active");
  }

  getCompletedRights(): DigitalRight[] {
    return this.state.rights.filter((r) => r.status === "completed");
  }

  reset(): void {
    this.state = {
      rights: this.state.rights,
      view: "list",
      selectedRightId: null,
      activities: this.state.activities,
      currentProof: null,
      wallet: this.state.wallet,
      showWallet: false,
      isProcessing: false,
    };
    this.notifyListeners();
  }
}
