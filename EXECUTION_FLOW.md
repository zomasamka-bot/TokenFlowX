# TokenFlowX - Execution Flow & Architecture

## Core One-Action Flow

```
START
  ↓
[Browse Rights List]
  - Tab Filter (Active/Used/Processing/Completed/Failed/Expired)
  - Real-time status indicators
  ↓
[Select a Right]
  - View details (holder, dates, price)
  ↓
[Click "Execute Right"]
  - If price > 0 → Show Payment Box
  - If price = 0 → Show Confirmation
  ↓
[Optional: Process Payment]
  - State: "Processing Payment..."
  - Display amount and description
  - Simulate 80% success rate
  ↓
[Confirm Execution]
  - State: "Executing..."
  - Clear messaging about proof recording
  ↓
[Receive Execution Proof]
  - Proof ID (dynamic)
  - Reference number
  - Timestamp
  - Execution duration
  - Payment details (if applicable)
  ↓
[Actions Available]
  - Copy Proof ID
  - Share Proof
  - Export as JSON
  ↓
[Activity Log Updated]
  - Action recorded
  - Timestamp captured
  - Link to proof
  ↓
[Right Status Updated]
  - Active → Completed (visible in list)
  ↓
END
```

## State Machine Diagram

### Right Status Transitions
```
ACTIVE
  ↓
[Execute Right] → PROCESSING
  ↓
[Execution Success] → COMPLETED
  ├─ (visible in "Completed" tab)
  ├─ Can still view proof
  └─ Activity logged

[Execution Fail] → FAILED
  ├─ (visible in "Failed" tab)
  └─ Can retry

EXPIRED
  ├─ (automatically, based on date)
  └─ Cannot execute

USED (legacy, replaced by COMPLETED)
```

### Payment Status Transitions
```
PENDING
  ↓
[Click "Proceed to Payment"] → PROCESSING
  ↓
[Payment Success (80%)] → SUCCESS
  ├─ Continues to execution
  └─ Reference saved to proof

[Payment Failure (20%)] → FAILED
  ├─ User can retry
  └─ Right stays Active
```

### Execution Status Transitions
```
PENDING (initial)
  ↓
[User confirms] → PROCESSING
  ↓
[Proof generated] → COMPLETED
  ├─ Visible on screen
  ├─ Saved to activity
  └─ Exportable

[Error occurs] → FAILED
```

## Component Interaction Map

```
app/page.tsx (State Hub)
  ├─ rights (state)
  ├─ activities (state)
  ├─ currentProof (state)
  ├─ wallet (state)
  │
  ├─→ RightsList
  │   └─ Displays rights with status badges
  │   └─ Handles right selection
  │
  ├─→ RightDetails
  │   ├─ Shows payment box if needed
  │   ├─ Manages execution flow
  │   └─ Calls onExecute handler
  │
  ├─→ PaymentBox
  │   ├─ Shows "Processing Payment..."
  │   ├─ Calls onPaymentInitiated
  │   └─ Returns payment object on success
  │
  ├─→ ExecutionConfirmation
  │   ├─ Shows "Executing..." state
  │   ├─ Clear messaging
  │   └─ Confirms execution
  │
  ├─→ ProofScreen
  │   ├─ Displays proof details
  │   ├─ Export/Copy/Share actions
  │   └─ Links to Activity Log
  │
  ├─→ Receipt
  │   ├─ Modal proof display
  │   ├─ Payment details (if applicable)
  │   └─ Export functionality
  │
  ├─→ ActivityLog
  │   ├─ Lists all actions
  │   ├─ Shows status badges
  │   └─ Links to proofs
  │
  └─→ WalletConnection
      └─ Simulated wallet UI
```

## Data Flow

### Proof Generation Flow
```
ExecuteRight() 
  ↓
generateProof(right, payment)
  ├─ Generate Proof ID (PROOF-[timestamp]-[random])
  ├─ Record timestamp
  ├─ Calculate execution time
  ├─ Link payment (if exists)
  ├─ Link right
  └─ Return Proof object
  ↓
setCurrentProof(proof)
  ↓
setActivities([...activities, activity])
  ↓
setRights([...completed])
  ↓
setView("proof")
  ↓
Display ProofScreen → Receipt Modal available
```

### Activity Logging Flow
```
generateActivity(right, "executed", "success", payment)
  ├─ Record action type
  ├─ Set timestamp
  ├─ Attach proof
  ├─ Mark success
  └─ Return Activity object
  ↓
Add to activities array
  ↓
Activity appears in ActivityLog
  ↓
Clickable "View Execution Proof" links back to proof
```

## Real-Time State Updates

### During Payment Processing
- Right status: Active → Processing
- Payment box shows "Processing Payment..."
- UI is non-interactive (button disabled)
- Simulated 2-4 second delay

### During Execution
- Execution dialog shows "Executing..."
- UI is non-interactive
- Simulated 300ms delay
- Immediate proof generation on completion

### After Completion
- Right status: Processing → Completed
- Activity log updated (same render cycle)
- Proof displayed with export options
- Activity entries show in log with full details

## Proof Export Structure

### JSON Export Format
```json
{
  "proofId": "PROOF-1704067200000-ABC123",
  "status": "completed",
  "reference": "REF-ABC123DEF456",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "executionTime": 1234,
  "right": {
    "id": "dr001",
    "title": "Content Distribution License",
    "rightHolder": "Creative Studios Inc",
    "expiresAt": "2024-02-01T00:00:00.000Z"
  },
  "payment": {
    "id": "pay-12345",
    "amount": 49.99,
    "currency": "USD",
    "description": "License to distribute video content",
    "reference": "REF-ABC123DEF456",
    "status": "success",
    "timestamp": "2024-01-01T11:59:45.000Z"
  }
}
```

## Testing Verification Points

### State Transitions
- [ ] Right changes from Active to Processing during payment
- [ ] Right stays Processing during execution confirmation
- [ ] Right changes to Completed after successful execution
- [ ] Completed rights appear in "Completed" tab
- [ ] Status changes are immediate (no lag)

### Proof Generation
- [ ] Proof ID is unique per execution
- [ ] Timestamp matches execution time
- [ ] Reference is saved
- [ ] Payment details included (if applicable)
- [ ] Export contains all fields

### Activity Logging
- [ ] Each execution creates activity entry
- [ ] Timestamps are accurate
- [ ] Status badges show correctly
- [ ] "View Proof" link works
- [ ] Old activities visible throughout session

### UI Responsiveness
- [ ] All buttons respond to clicks
- [ ] State changes visible immediately
- [ ] No lag during state transitions
- [ ] Mobile layout responsive
- [ ] Touch interactions work smoothly
