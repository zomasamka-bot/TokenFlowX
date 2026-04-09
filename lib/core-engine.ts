import type { DigitalRight, RightStatus, Activity, Proof, Payment } from "./types";
import { generateProof, generateActivity } from "./proof-utils";

export interface AppState {
  rights: DigitalRight[];
  activities: Activity[];
  selectedRightId: string | null;
  currentProof: Proof | null;
  view: "list" | "details" | "proof" | "activity";
}

export interface AppActions {
  selectRight: (id: string) => void;
  deselectRight: () => void;
  navigateTo: (view: AppState["view"]) => void;
  initiatePayment: () => void;
  executeRight: (payment?: Payment) => void;
  recordActivity: (activity: Activity) => void;
  updateRightStatus: (rightId: string, status: RightStatus) => void;
  getRightById: (id: string) => DigitalRight | undefined;
}

export class CoreEngine {
  private state: AppState;
  private listeners: Set<(state: AppState) => void> = new Set();

  constructor(initialRights: DigitalRight[]) {
    this.state = {
      rights: initialRights,
      activities: [],
      selectedRightId: null,
      currentProof: null,
      view: "list",
    };
  }

  getState(): AppState {
    return this.state;
  }

  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  selectRight(rightId: string): void {
    this.state.selectedRightId = rightId;
    this.state.view = "details";
    this.notify();
  }

  deselectRight(): void {
    this.state.selectedRightId = null;
    this.state.view = "list";
    this.notify();
  }

  navigateTo(view: AppState["view"]): void {
    this.state.view = view;
    this.notify();
  }

  initiatePayment(): void {
    if (!this.state.selectedRightId) return;
    const right = this.getRightById(this.state.selectedRightId);
    if (right) {
      this.updateRightStatus(right.id, "processing");
    }
  }

  executeRight(payment?: Payment): void {
    if (!this.state.selectedRightId) return;
    const right = this.getRightById(this.state.selectedRightId);
    if (!right) return;

    // Generate proof
    const proof = generateProof(right, payment);
    this.state.currentProof = proof;

    // Record activity
    const activity = generateActivity(right, "executed", "success", payment);
    this.recordActivity(activity);

    // Update status
    this.updateRightStatus(right.id, "completed");

    // Navigate to proof
    this.state.view = "proof";
    this.notify();
  }

  recordActivity(activity: Activity): void {
    this.state.activities = [activity, ...this.state.activities];
    this.notify();
  }

  updateRightStatus(rightId: string, status: RightStatus): void {
    this.state.rights = this.state.rights.map((r) =>
      r.id === rightId ? { ...r, status } : r
    );
    this.notify();
  }

  getRightById(id: string): DigitalRight | undefined {
    return this.state.rights.find((r) => r.id === id);
  }

  getSelectedRight(): DigitalRight | undefined {
    return this.state.selectedRightId
      ? this.getRightById(this.state.selectedRightId)
      : undefined;
  }

  getActivitiesForRight(rightId: string): Activity[] {
    return this.state.activities.filter((a) => a.rightId === rightId);
  }
}

export function createCoreEngine(initialRights: DigitalRight[]): CoreEngine {
  return new CoreEngine(initialRights);
}
