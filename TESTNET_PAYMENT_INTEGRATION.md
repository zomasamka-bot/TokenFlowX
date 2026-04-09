# TokenFlowX - Pi Testnet Payment Integration

## Payment Structure Overview

TokenFlowX has been restructured with a wallet-based, Testnet-ready payment system designed for seamless integration with Pi Network's blockchain payment infrastructure.

---

## Architecture

### Payment Object Structure

```typescript
interface Payment {
  id: string;                          // Unique payment ID
  rightId: string;                     // Associated right ID
  recipientWallet: string;             // Pi Testnet recipient wallet address
  rightValue: number;                  // Base right value (excluding fees)
  platformFee: number;                 // Platform fee (5% of right value)
  total: number;                       // Total amount (rightValue + platformFee)
  currency: string;                    // "Pi" (default)
  description: string;                 // Payment description
  reference: string;                   // Transaction reference (REF-...)
  network: "Pi Testnet";               // Network identifier
  status: PaymentStatus;               // "pending" | "processing" | "paid" | "failed"
  executionStatus: ExecutionStatus;    // "pending" | "ready" | "executed" | "failed"
  timestamp: string;                   // ISO format creation timestamp
  processingTime?: number;             // Processing duration in milliseconds
}
```

### ExecutionStatus Values

- **"pending"** - Initial state, execution locked until payment completes
- **"ready"** - Payment successful, execution can proceed
- **"executed"** - Right has been executed successfully
- **"failed"** - Execution failed

### PaymentStatus Values

- **"pending"** - Awaiting user confirmation
- **"processing"** - Actively processing on Pi Testnet
- **"paid"** - Payment completed successfully
- **"failed"** - Payment failed

---

## Payment Flow

### Step 1: Display Payment Screen
- Recipient wallet displayed (Pi Testnet format: `0xPi...`)
- Right value calculated
- Platform fee (5%) calculated
- Total amount displayed
- Execution locked (visual indicator with lock icon)
- Payment Status: **Pending**
- Execution Status: **Locked**

### Step 2: User Confirms Payment
- Clicks "Proceed to Payment"
- Payment Status → "processing"
- Execution Status → Still "Locked"

### Step 3: Payment Processing
- "Processing Payment..." state shown
- Spinner animation displays
- Message: "Sending to Pi Testnet"
- System simulates Testnet transaction (2 second delay)

### Step 4a: Payment Success
- Payment Status → **"paid"**
- Execution Status → **"ready"**
- Success confirmation displayed
- Transaction reference provided
- User proceeds to execution confirmation

### Step 4b: Payment Failed
- Payment Status → "failed"
- Execution Status → Still "locked"
- Error message displayed
- "Retry Payment" button available

### Step 5: Execution Confirmation
- Pre-execution checklist shown
- User confirms execution
- "Executing..." state shown
- Execution Status → "processing"

### Step 6: Execution Complete
- Execution Status → **"executed"**
- Execution proof generated
- Receipt displays all payment details
- Activity logged

---

## Key Fields Explained

### Recipient Wallet
- **Format**: `0xPi[ADDRESS]` (Pi Testnet format)
- **Purpose**: Destination wallet for payment on Pi Testnet
- **Example**: `0xPi123abc456def789ghi`
- **Note**: Hardcoded for demo; will integrate with real wallet addresses in production

### Right Value
- **Calculation**: From `right.amount` (default: 9.99)
- **Represents**: Base payment for executing the right
- **Currency**: Pi (Pi Network token)

### Platform Fee
- **Calculation**: 5% of right value
- **Example**: $9.99 right → $0.50 fee
- **Total**: $10.49 (right value + fee)
- **Represents**: TokenFlowX service fee

### Reference
- **Format**: `REF-[timestamp]-[random]`
- **Purpose**: Unique transaction identifier
- **Example**: `REF-1704067200000-A7K9M2P5Q`
- **Usage**: Track payment on Testnet blockchain

### Network
- **Value**: "Pi Testnet" (constant)
- **Purpose**: Identifies payment network
- **Future**: Will support other networks

### Description
- **Format**: "Execution right: {right.title}"
- **Example**: "Execution right: Content Distribution License"
- **Purpose**: Human-readable payment description

---

## State Transitions Diagram

```
Payment Pending
├─ Payment Status: Pending
└─ Execution Status: Locked
    ↓
User Clicks "Proceed to Payment"
├─ Payment Status: Processing
└─ Execution Status: Locked
    ↓
Payment Processing (2 second delay)
    ├─ Success Path:
    │   ├─ Payment Status: Paid ✓
    │   ├─ Execution Status: Ready
    │   └─ User proceeds to confirmation
    │
    └─ Failed Path:
        ├─ Payment Status: Failed ✗
        ├─ Execution Status: Locked
        └─ User can retry
```

---

## Component Integration

### PaymentBox Component (`components/payment-box.tsx`)

**Responsible for:**
- Displaying wallet information (recipient address)
- Calculating and showing payment breakdown (right value, fee, total)
- Managing payment processing states
- Displaying transaction reference
- Showing network information
- Managing status transitions
- Handling retry logic

**Key Features:**
- Real-time fee calculation
- Wallet address display with formatting
- Payment breakdown with visual hierarchy
- Status badge indicators (Pending/Paid/Locked/Ready)
- Success/failure states with appropriate messaging
- Testnet-ready structure

### Receipt Component (`components/receipt.tsx`)

**Displays:**
- Recipient wallet address
- Payment breakdown (right value, platform fee, total)
- Transaction reference
- Network information
- Payment description
- Payment Status
- Execution Status
- All metadata for blockchain verification

### Proof Screen (`components/proof-screen.tsx`)

**Shows:**
- Execution status: "executed"
- Associated payment details
- Reference information
- Execution proof ID
- Timestamp and execution time

---

## Data Flow

```
PaymentBox Displays Payment Information
    ↓
User Clicks "Proceed to Payment"
    ↓
Payment Processing Starts
    ↓
Payment Object Created:
  {
    recipientWallet: "0xPi...",
    rightValue: 9.99,
    platformFee: 0.50,
    total: 10.49,
    status: "paid",
    executionStatus: "ready",
    reference: "REF-..."
  }
    ↓
Payment Passed to ExecutionConfirmation
    ↓
User Confirms Execution
    ↓
handleExecuteRight(payment) Called
    ↓
Proof Generated with Payment Reference
    ↓
Receipt Displays All Payment Details
    ↓
Activity Logged with Payment Information
```

---

## Testing Payment Flow

### Quick Test (3 minutes)

1. **Open app** → Select a paid right
2. **Click "Execute Right"** → Payment box appears
3. **Verify Display**:
   - [ ] Recipient wallet shows
   - [ ] Right value displayed
   - [ ] Platform fee calculated (5%)
   - [ ] Total correct (value + fee)
   - [ ] Reference shown
   - [ ] Network shows "Pi Testnet"
   - [ ] Payment Status: "Pending"
   - [ ] Execution Status: "Locked"

4. **Click "Proceed to Payment"**:
   - [ ] "Processing Payment..." appears
   - [ ] Spinner animates
   - [ ] Message shows "Sending to Pi Testnet"

5. **Wait for result**:
   - [ ] Either "Paid" or "Failed" appears
   - [ ] Status badges update
   - [ ] Execution Status changes to "Ready" (if success)

6. **Confirm Execution**:
   - [ ] Execution confirmation appears
   - [ ] "Executing..." state shown

7. **View Proof**:
   - [ ] Execution status shows "executed"
   - [ ] Payment details displayed in receipt
   - [ ] All fields correct

### State Verification Test

1. **Test Payment Pending State**:
   - Payment Status badge: Yellow (Pending)
   - Execution Status: Gray with lock (Locked)
   - Lock icon visible
   - Message: "Execution is locked until payment"

2. **Test Payment Processing State**:
   - Spinner animation
   - "Processing Payment..." message
   - "Sending to Pi Testnet" text

3. **Test Payment Success State**:
   - Payment Status badge: Green (Paid)
   - Execution Status badge: Green (Ready)
   - No lock icon
   - Success message visible

4. **Test Execution Ready State**:
   - Can proceed to execution
   - Execution Status still shows "Ready"
   - No lock on execution button

5. **Test Execution Complete State**:
   - Execution Status: "executed"
   - Payment details preserved in receipt
   - All transaction information available

---

## Integration Checklist for Pi Testnet

### Phase 1: Structure (COMPLETE)
- [x] Payment interface with required fields
- [x] Wallet-based structure (no issuer name)
- [x] Testnet network identifier
- [x] Status tracking (payment + execution)
- [x] Execution locked until payment

### Phase 2: Display (COMPLETE)
- [x] Recipient wallet visible
- [x] Fee calculation shown
- [x] Status indicators
- [x] Transaction reference
- [x] Network information

### Phase 3: Logic (COMPLETE)
- [x] Payment status transitions
- [x] Execution status transitions
- [x] Lock/unlock mechanism
- [x] Error handling
- [x] Retry capability

### Phase 4: Testnet Integration (READY FOR)
- [ ] Connect to real Pi Testnet wallet
- [ ] Replace `0xPi...Recipient` with actual wallet
- [ ] Integrate Pi Wallet SDK
- [ ] Implement real transaction signing
- [ ] Add blockchain confirmation
- [ ] Handle Testnet-specific errors

### Phase 5: Production Ready (FUTURE)
- [ ] Mainnet support
- [ ] Multiple network support
- [ ] Enhanced error handling
- [ ] Analytics integration
- [ ] Audit logging

---

## Code Examples

### Accessing Payment Information

```typescript
// In your component
if (payment) {
  console.log("Recipient:", payment.recipientWallet);
  console.log("Total:", payment.total, payment.currency);
  console.log("Network:", payment.network);
  console.log("Status:", payment.status);
  console.log("Execution:", payment.executionStatus);
}
```

### Payment Status Checks

```typescript
// Check if payment completed
const isPaid = payment.status === "paid";

// Check if ready for execution
const isReadyForExecution = payment.executionStatus === "ready";

// Check if currently processing
const isProcessing = payment.status === "processing";
```

### Extracting Transaction Details

```typescript
// For blockchain submission
const transactionData = {
  to: payment.recipientWallet,
  amount: payment.total,
  reference: payment.reference,
  description: payment.description,
  network: payment.network,
};
```

---

## Future Integration Points

### 1. Real Wallet Connection
```typescript
// Replace:
const recipientWallet = "0xPi...Recipient";

// With:
const recipientWallet = await piWallet.getRecipientAddress();
```

### 2. Real Transaction
```typescript
// Replace simulation:
setTimeout(() => { /* fake processing */ }, 2000);

// With:
const tx = await piWallet.sendTransaction({
  to: payment.recipientWallet,
  amount: payment.total,
  reference: payment.reference,
});
```

### 3. Blockchain Confirmation
```typescript
// Check transaction status
const isConfirmed = await piTestnet.getTransactionStatus(tx.hash);
```

### 4. Error Handling
```typescript
try {
  await piWallet.sendTransaction(txData);
} catch (error) {
  if (error.code === "INSUFFICIENT_BALANCE") {
    // Handle insufficient balance
  } else if (error.code === "NETWORK_ERROR") {
    // Handle network error
  }
}
```

---

## Summary

TokenFlowX payment system is now:
- ✅ Wallet-based (no issuer references)
- ✅ Testnet-ready (Pi Testnet identifier)
- ✅ Structured for blockchain (all fields present)
- ✅ Fee-transparent (clear breakdown)
- ✅ State-aware (execution locked until payment)
- ✅ Production-ready for integration

Next step: Connect to real Pi Testnet wallet and implement blockchain transactions.
