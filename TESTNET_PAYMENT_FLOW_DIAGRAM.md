# TokenFlowX - Testnet Payment Flow Diagram

## Complete Payment & Execution State Machine

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     TOKENFLOWX TESTNET PAYMENT FLOW                         │
└─────────────────────────────────────────────────────────────────────────────┘

INITIAL STATE
═════════════════════════════════════════════════════════════════════════════
Right Status: ACTIVE
Payment Status: NONE (not shown)
Execution Status: LOCKED (before payment section visible)
Button State: "Execute Right" enabled


STEP 1: USER CLICKS "EXECUTE RIGHT"
═════════════════════════════════════════════════════════════════════════════
┌─────────────────────────────────────────────┐
│ CHECK: Does right have amount?              │
├─────────────────────────────────────────────┤
│ YES (amount > 0) → Show Payment Section    │
│ NO  (amount = 0) → Skip to Confirmation    │
└─────────────────────────────────────────────┘
         │
         ├─ YES ──→ SHOW PAYMENT SECTION
         │          ┌──────────────────────────────────┐
         │          │ PAYMENT DETAILS DISPLAYED         │
         │          ├──────────────────────────────────┤
         │          │ Recipient Wallet: 0xPi...       │
         │          │ Right Value: 9.99 Pi            │
         │          │ Platform Fee: 0.50 Pi (5%)      │
         │          │ Total: 10.49 Pi                 │
         │          │ Reference: REF-[timestamp]-[x]  │
         │          │ Description: Execution right... │
         │          │ Network: Pi Testnet             │
         │          │                                 │
         │          │ Payment Status: PENDING 🟡      │
         │          │ Execution Status: LOCKED 🔒     │
         │          │                                 │
         │          │ [Proceed to Payment] Button      │
         │          └──────────────────────────────────┘
         │
         └─ NO ──→ SKIP TO EXECUTION CONFIRMATION
                   (Right Value = 0, no payment needed)


STEP 2: USER CLICKS "PROCEED TO PAYMENT"
═════════════════════════════════════════════════════════════════════════════

Payment Section Updates:
┌──────────────────────────────────────────────┐
│ STATE CHANGE                                  │
├──────────────────────────────────────────────┤
│ Payment Status: PENDING → PROCESSING 🔄     │
│ Execution Status: LOCKED → LOCKED 🔒        │
│                                              │
│ UI Change: Show spinner "Processing        │
│ Payment..."                                  │
│                                              │
│ Backend Action: Send to Pi Testnet          │
│ (Currently simulated, 80% success rate)     │
│                                              │
│ Time: ~2000ms (simulated)                   │
└──────────────────────────────────────────────┘


STEP 3: PAYMENT PROCESSING
═════════════════════════════════════════════════════════════════════════════

Loading State (2 seconds):
┌──────────────────────────────────────────────┐
│        PROCESSING PAYMENT...                 │
│                                              │
│            ◌ (animated spinner)              │
│                                              │
│   Sending to Pi Testnet                     │
│                                              │
│   [No user interaction during this phase]   │
└──────────────────────────────────────────────┘


STEP 4A: PAYMENT SUCCESS (80% probability)
═════════════════════════════════════════════════════════════════════════════

STATE CHANGE:
┌────────────────────────────────────────────────┐
│ Payment Status: PROCESSING → PAID ✅           │
│ Execution Status: LOCKED → READY 🟢            │
│ Button: "Execute Right" now ENABLED            │
└────────────────────────────────────────────────┘

Display Success Screen:
┌────────────────────────────────────────────────┐
│ ✓ PAYMENT SUCCESSFUL                           │
│                                                │
│ Amount Transferred: 10.49 Pi                  │
│ To Wallet: 0xPi...Recipient                  │
│ Transaction Ref: REF-[timestamp]-[x]         │
│                                                │
│ Payment Status: PAID ✅                        │
│ Execution Status: READY 🟢                     │
│                                                │
│ ℹ️ Ready to execute the right. Proceed to     │
│    confirmation.                              │
│                                                │
│ [Proceed to Execution] Button (ENABLED)       │
└────────────────────────────────────────────────┘

Flow Continues:
User clicks "Proceed to Execution"
         │
         ↓
    EXECUTION CONFIRMATION DIALOG


STEP 4B: PAYMENT FAILED (20% probability)
═════════════════════════════════════════════════════════════════════════════

STATE CHANGE:
┌────────────────────────────────────────────────┐
│ Payment Status: PROCESSING → FAILED ❌         │
│ Execution Status: LOCKED → LOCKED 🔒           │
│ Button: "Execute Right" remains DISABLED       │
└────────────────────────────────────────────────┘

Display Failure Screen:
┌────────────────────────────────────────────────┐
│ ✕ PAYMENT FAILED                               │
│                                                │
│ The payment could not be processed on Pi      │
│ Testnet. Please verify your wallet and try    │
│ again.                                        │
│                                                │
│ Payment Status: FAILED ❌                      │
│ Execution Status: LOCKED 🔒                    │
│                                                │
│ [Retry Payment] Button (ENABLED)               │
└────────────────────────────────────────────────┘

User Retry Flow:
[Retry Payment] clicked
         │
         ↓
    Reset to Step 1
    Payment Section shows again
    Payment Status: PENDING
    Execution Status: LOCKED


STEP 5: EXECUTION CONFIRMATION (After Payment Success)
═════════════════════════════════════════════════════════════════════════════

STATE:
Right Status: ACTIVE
Payment Status: PAID ✅
Execution Status: READY 🟢

Display Confirmation Dialog:
┌────────────────────────────────────────────────┐
│ CONFIRM EXECUTION                              │
│                                                │
│ You are about to execute this right. This     │
│ action will be recorded as verifiable proof   │
│ and cannot be undone.                         │
│                                                │
│ Right Details:                                │
│ • Title: [right.title]                        │
│ • Holder: [right.rightHolder]                 │
│                                                │
│ Before you proceed:                           │
│ ✓ Execution proof will be generated          │
│ ✓ Activity will be logged permanently         │
│ ✓ You can export your proof anytime          │
│                                                │
│ [Cancel] [Execute Right]                      │
└────────────────────────────────────────────────┘


STEP 6: USER CLICKS "EXECUTE RIGHT" IN CONFIRMATION
═════════════════════════════════════════════════════════════════════════════

STATE CHANGE:
┌────────────────────────────────────────────────┐
│ Right Status: ACTIVE → PROCESSING              │
│ Execution Status: READY → PROCESSING           │
│                                                │
│ UI: Show "Executing..." state with spinner    │
└────────────────────────────────────────────────┘

Processing (300-500ms):
Dialog shows: "Executing..." with spinner
(Simulated execution processing)


STEP 7: EXECUTION COMPLETE
═════════════════════════════════════════════════════════════════════════════

STATE CHANGE:
┌────────────────────────────────────────────────┐
│ Right Status: ACTIVE → COMPLETED               │
│ Execution Status: PROCESSING → EXECUTED        │
│ Proof Generated: YES ✅                        │
│ Activity Logged: YES ✅                        │
└────────────────────────────────────────────────┘

Show Execution Proof Screen:
┌────────────────────────────────────────────────┐
│ ✓ EXECUTION COMPLETED                         │
│                                                │
│ Your right has been successfully executed     │
│ and recorded.                                 │
│                                                │
│ EXECUTION PROOF                               │
│ ─────────────────                             │
│ Proof ID: PROOF-[timestamp]-[random]          │
│ Status: Completed ✅                          │
│ Reference: REF-[transaction-ref]              │
│ Date & Time: [ISO timestamp]                  │
│ Execution Time: XXXms                         │
│ Associated Right: [right.title]               │
│ Payment Details: 10.49 Pi → 0xPi...Recipient │
│                                                │
│ [Copy] [Share] [Export]                       │
│ [View Right Details]                          │
└────────────────────────────────────────────────┘


STEP 8: PROOF DISPLAY & ACTIVITY LOG
═════════════════════════════════════════════════════════════════════════════

Proof Features:
• Copy Proof ID to clipboard
• Share proof (native share or clipboard)
• Export proof as JSON
• View linked right details
• View activity log entry

Activity Log Updated:
┌────────────────────────────────────────────────┐
│ EXECUTION COMPLETED                           │
│ Status: Success ✅                            │
│ Timestamp: [exact ISO time]                   │
│ [View Execution Proof] Link                   │
└────────────────────────────────────────────────┘


FINAL STATE
═════════════════════════════════════════════════════════════════════════════
Right Status: COMPLETED ✅
Payment Status: PAID ✅
Execution Status: EXECUTED ✅
Proof: Generated and Stored ✅
Activity Log: Updated ✅
```

---

## State Transition Table

| From | To | Trigger | Payment Status | Execution Status | UI Action |
|------|----|---------| ---|---|---|
| Active | Active | "Execute Right" clicked | None | Locked | Show payment |
| Active | Active | Payment proceed | Processing | Locked | Show spinner |
| Active | Active | Payment success | Paid | Ready | Show confirmation |
| Active | Active | Payment failure | Failed | Locked | Show retry |
| Active | Active | "Execute Right" in dialog | Paid | Processing | Show spinner |
| Active | Completed | Execution complete | Paid | Executed | Show proof |
| Active | Failed | Execution error | Paid | Failed | Show error |

---

## Field Values Throughout Flow

```
Initial Payment Section:
├─ Recipient Wallet: 0xPi...Recipient
├─ Right Value: 9.99 Pi
├─ Platform Fee: 0.50 Pi
├─ Total: 10.49 Pi
├─ Reference: REF-1704067200000-A7B2C9D4E
├─ Description: "Execution right: Content Distribution License"
├─ Network: Pi Testnet
├─ Payment Status: Pending 🟡
└─ Execution Status: Locked 🔒

After Successful Payment:
├─ Recipient Wallet: 0xPi...Recipient (same)
├─ Right Value: 9.99 Pi (same)
├─ Platform Fee: 0.50 Pi (same)
├─ Total: 10.49 Pi (same)
├─ Reference: REF-1704067200000-A7B2C9D4E (same)
├─ Description: "Execution right: Content Distribution License" (same)
├─ Network: Pi Testnet (same)
├─ Payment Status: Paid ✅
└─ Execution Status: Ready 🟢

After Execution:
├─ Recipient Wallet: 0xPi...Recipient (same)
├─ Right Value: 9.99 Pi (same)
├─ Platform Fee: 0.50 Pi (same)
├─ Total: 10.49 Pi (same)
├─ Reference: REF-1704067200000-A7B2C9D4E (same)
├─ Description: "Execution right: Content Distribution License" (same)
├─ Network: Pi Testnet (same)
├─ Payment Status: Paid ✅
└─ Execution Status: Executed ✅
```

---

## Error Scenarios

### Scenario 1: Payment Fails (20% in simulation)
```
Payment Proceed → Processing → Failed
                               ↓
                          Retry Button Shown
                               ↓
                    User Clicks Retry
                               ↓
                    Reset to Payment Start
```

### Scenario 2: Right Expires During Payment
```
Payment Proceed → Processing → [TIMEOUT]
                               ↓
                    Right Status Changes to Expired
                               ↓
                    Show Error: "Right Expired"
```

### Scenario 3: Double-Click Prevention
```
[Proceed to Payment] Clicked
↓
Button Disabled (prevent double submission)
↓
Processing happens
↓
Success/Failure shown
↓
Button Re-enabled only if needed (retry case)
```

---

## Real Testnet Integration Points

When replacing simulated payments:

```typescript
// CURRENT (Simulated):
setTimeout(() => {
  const isSuccess = Math.random() > 0.2;
  // ...
}, 2000);

// AFTER (Real Testnet):
const result = await piTestnetSDK.transfer({
  recipient: recipientWallet,
  amount: total,
  reference: reference,
  description: description,
});

if (result.success) {
  // Payment Status → "paid"
  // Execution Status → "ready"
  onPaymentSuccess(newPayment);
} else {
  // Payment Status → "failed"
  // Execution Status → "locked"
  onPaymentFailed();
}
```

---

## Key Design Principles

1. **Execution Locked Before Payment**: ✅ User cannot execute until payment is processed
2. **Clear State Visibility**: ✅ Payment Status and Execution Status always displayed
3. **No Issuer Name**: ✅ Wallet-based only, blockchain native
4. **State Persistence**: ✅ Each state clearly tracked and updated
5. **Error Recovery**: ✅ Retry mechanism for payment failures
6. **Professional UX**: ✅ Clear feedback at each step

---

**Status**: Ready for Testnet Integration ✅
