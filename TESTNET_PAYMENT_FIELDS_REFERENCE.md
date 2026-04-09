# TokenFlowX - Testnet Payment Fields Quick Reference

## Payment Fields Summary Table

| Field | Type | Current Value | Testnet Format | Required | Notes |
|-------|------|---|---|---|---|
| **Recipient Wallet** | string | `0xPi...Recipient` | `0xPi[40-char hex]` | YES | Payment destination |
| **Right Value** | number | 9.99 | 0.01 - 1000.00 | YES | Base right cost |
| **Platform Fee** | number | 0.50 | 5% of right value | YES | Auto-calculated |
| **Total** | number | 10.49 | rightValue + fee | YES | Final amount |
| **Reference** | string | REF-[ts]-[x] | REF-[unique] | YES | Transaction ID |
| **Description** | string | "Execution right: ..." | Max 255 chars | YES | User-facing info |
| **Network** | string | "Pi Testnet" | "Pi Testnet" | YES | Fixed value |
| **Payment Status** | enum | pending/processing/paid/failed | 4 states | YES | Transaction state |
| **Execution Status** | enum | locked/ready/executed/failed | 4 states | YES | Right execution state |

---

## Field-by-Field Specification

### 1. Recipient Wallet ⏱️ CRITICAL
**Current**: `0xPi...Recipient`
**Real**: `0xPi1234567890abcdef1234567890abcdef123456`

```typescript
type RecipientWallet = string; // Pi Testnet wallet address

// Validation
isValidWallet(wallet: string): boolean {
  return wallet.startsWith("0xPi") && wallet.length === 46;
}

// Current source
const recipientWallet = "0xPi...Recipient";

// Testnet source (after integration)
const recipientWallet = process.env.NEXT_PUBLIC_RECIPIENT_WALLET;

// Environment variable
NEXT_PUBLIC_RECIPIENT_WALLET=0xPi1234567890abcdef1234567890abcdef123456
```

**Display Format**:
```
Recipient Wallet
0xPi1234567890abcdef1234567890abcdef123456
Pi Testnet Address
```

---

### 2. Right Value 💰 CALCULATION
**Current**: `right.amount || 9.99`
**Real**: Retrieved from digital right definition

```typescript
type RightValue = number; // Float with 2 decimals

// Validation
isValidRightValue(value: number): boolean {
  return value >= 0.01 && value <= 1000.00;
}

// Current calculation
const rightValue = right.amount || 9.99;

// Testnet calculation
const rightValue = right.amount || 0; // From database
```

**Display Format**:
```
Right Value
9.99 Pi
```

**Acceptable Range**: 0.01 - 1000.00 Pi

---

### 3. Platform Fee 📊 AUTO-CALCULATED
**Current**: `rightValue * 0.05` (5% fee)
**Real**: Same calculation or config-based percentage

```typescript
type PlatformFee = number; // Float with 2 decimals

// Validation
isValidPlatformFee(fee: number, rightValue: number): boolean {
  const expectedFee = rightValue * 0.05;
  return Math.abs(fee - expectedFee) < 0.01; // Allow rounding
}

// Current calculation (HARDCODED 5%)
const platformFee = rightValue * 0.05;

// Testnet calculation (CONFIGURABLE)
const platformFeePercent = parseFloat(
  process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENT || "5"
);
const platformFee = rightValue * (platformFeePercent / 100);
```

**Display Format**:
```
Platform Fee (5%)
0.50 Pi
```

**Fee Percentage**: 5% (configurable)

---

### 4. Total 🧮 SUM
**Current**: `rightValue + platformFee`
**Real**: Same calculation

```typescript
type Total = number; // Float with 2 decimals

// Validation
isValidTotal(total: number, rightValue: number, fee: number): boolean {
  return Math.abs(total - (rightValue + fee)) < 0.01;
}

// Calculation (never changes)
const total = rightValue + platformFee;
```

**Display Format**:
```
Total
10.49 Pi (bold, primary color)
```

**Formula**: `rightValue + platformFee`

---

### 5. Reference 🔖 UNIQUE IDENTIFIER
**Current**: `REF-${Date.now()}-${random}`
**Real**: Same format or blockchain transaction hash

```typescript
type Reference = string; // Format: REF-[timestamp]-[random]

// Validation
isValidReference(ref: string): boolean {
  return /^REF-\d{13}-[A-Z0-9]{9}$/.test(ref);
}

// Current generation
function generateReference(): string {
  return `REF-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase()}`;
}
// Example: REF-1704067200000-A7B2C9D4E

// Testnet generation (after transaction)
const reference = transactionHash || generateReference();
```

**Display Format**:
```
Reference
REF-1704067200000-A7B2C9D4E
(monospace, break-all text)
```

**Format**: `REF-[13-digit timestamp]-[9-char random]`

---

### 6. Description 📝 CONTEXT
**Current**: `"Execution right: ${right.title}"`
**Real**: User input or template-based

```typescript
type Description = string; // Max 255 characters

// Validation
isValidDescription(desc: string): boolean {
  return desc.length > 0 && desc.length <= 255;
}

// Current generation
const description = `Execution right: ${right.title}`;
// Example: "Execution right: Content Distribution License"

// Testnet generation (customizable)
const description = userInput || `Execution right: ${right.title}`;
```

**Display Format**:
```
Description
Execution right: Content Distribution License
(standard text, wrap if needed)
```

**Max Length**: 255 characters
**Template**: `"Execution right: [right.title]"`

---

### 7. Network 🌐 FIXED VALUE
**Current**: `"Pi Testnet"`
**Real**: `"Pi Testnet"` or `"Pi Mainnet"`

```typescript
type Network = "Pi Testnet" | "Pi Mainnet";

// Validation
isValidNetwork(network: string): boolean {
  return network === "Pi Testnet" || network === "Pi Mainnet";
}

// Current (HARDCODED)
const network = "Pi Testnet" as const;

// Testnet (environment-based)
const network = (process.env.NEXT_PUBLIC_NETWORK || "Pi Testnet") as const;
```

**Display Format**:
```
Network
Pi Testnet
(bold, blue color)
```

**Current**: `"Pi Testnet"` (hardcoded)
**Note**: Not user-selectable, fixed per deployment

---

### 8. Payment Status 🔴🟡🟢 STATE ENUM
**Values**: `"pending"` | `"processing"` | `"paid"` | `"failed"`

```typescript
type PaymentStatus = "pending" | "processing" | "paid" | "failed";

// State transitions
pending → processing → paid (success)
                   ↘ failed (error)

// Can only transition forward, not backward
```

**UI Indicators**:
```
Pending:    🟡 Yellow background, "Pending" text
Processing: 🔄 Blue background, animated, "Processing" text
Paid:       🟢 Green background, checkmark, "Paid" text
Failed:     ❌ Red background, "Failed" text
```

**Display Format**:
```
Payment Status
[Status Badge]
```

---

### 9. Execution Status 🔒🟡🟢 STATE ENUM
**Values**: `"pending"` | `"ready"` | `"executed"` | `"failed"`

```typescript
type ExecutionStatus = "pending" | "ready" | "executed" | "failed";

// State transitions
pending (locked) → ready → executed (success)
                        ↘ failed (error)

// Before payment: Shows as "Locked" in UI
// After payment success: Shows as "Ready"
// After execution: Shows as "Executed"
```

**UI Indicators**:
```
Locked (pending):  🔒 Gray background, lock icon, "Locked" text
Ready:             🟢 Blue background, "Ready" text
Executed:          🟢 Green background, checkmark, "Executed" text
Failed:            ❌ Red background, "Failed" text
```

**Display Format**:
```
Execution Status
[Status Badge]
```

---

## Payment Object JSON Structure

### Empty Payment (Before Any Transaction)
```json
null
```

### Pending Payment (Ready to Process)
```json
{
  "id": "pay-1704067200000",
  "rightId": "right-4",
  "recipientWallet": "0xPi1234567890abcdef1234567890abcdef123456",
  "rightValue": 9.99,
  "platformFee": 0.50,
  "total": 10.49,
  "currency": "Pi",
  "description": "Execution right: Content Distribution License",
  "reference": "REF-1704067200000-A7B2C9D4E",
  "network": "Pi Testnet",
  "status": "pending",
  "executionStatus": "pending",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Processing Payment
```json
{
  ...
  "status": "processing",
  "executionStatus": "pending",
  // Timestamp unchanged
}
```

### Successful Payment
```json
{
  ...
  "status": "paid",
  "executionStatus": "ready",
  "processingTime": 2345,
  "timestamp": "2024-01-01T12:00:02Z"
}
```

### Failed Payment
```json
{
  ...
  "status": "failed",
  "executionStatus": "pending",
  "processingTime": 1847,
  "timestamp": "2024-01-01T12:00:01Z"
}
```

### After Execution
```json
{
  ...
  "status": "paid",
  "executionStatus": "executed",
  "processingTime": 2345,
  "timestamp": "2024-01-01T12:00:02Z"
}
```

---

## Display Layout Reference

```
┌─────────────────────────────────────────────────┐
│ Pi Testnet Payment (header with icon)          │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Blue Box]                                     │
│ Recipient Wallet                              │
│ 0xPi1234567890abcdef1234567890abcdef123456   │
│ Pi Testnet Address                            │
│                                                 │
├─────────────────────────────────────────────────┤
│ [Gray Box]                                     │
│ Right Value        9.99 Pi                    │
│ Platform Fee (5%)  0.50 Pi                    │
│ ────────────────────────────────              │
│ Total              10.49 Pi [BOLD/PRIMARY]    │
│                                                 │
├─────────────────────────────────────────────────┤
│ [Gray Box]                                     │
│ Reference        REF-1704067200000-A7B2C9D4E │
│ Description      Execution right: ...         │
│ Network          Pi Testnet [BLUE/BOLD]      │
│                                                 │
├─────────────────────────────────────────────────┤
│ [Grid 2 Columns]                               │
│                                                 │
│ Payment Status    │  Execution Status         │
│ [Badge Status]    │  [Badge Status]           │
│                                                 │
├─────────────────────────────────────────────────┤
│ [Info/Warning Box]                             │
│ [Icon] Message text based on state            │
│                                                 │
├─────────────────────────────────────────────────┤
│ [Action Button]                                │
│ Proceed to Payment / Retry / etc.              │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Integration Checklist

### Field Preparation
- [ ] Recipient Wallet: Get from environment (NEXT_PUBLIC_RECIPIENT_WALLET)
- [ ] Right Value: Confirm retrieval from digital right definition
- [ ] Platform Fee: Verify 5% calculation or load percentage from env
- [ ] Total: Confirm sum calculation (no hardcoding)
- [ ] Reference: Generate unique per transaction
- [ ] Description: Create template or accept user input
- [ ] Network: Set to "Pi Testnet" (or "Pi Mainnet" if needed)

### State Management
- [ ] Payment Status: Implement state transitions (pending → processing → paid/failed)
- [ ] Execution Status: Implement state transitions (pending → ready → executed/failed)
- [ ] UI Updates: Reflect status changes in badges and messages
- [ ] Error Handling: Show appropriate messages for failures

### Testnet Integration
- [ ] Connect to Pi Testnet SDK
- [ ] Replace simulated payment with real transaction
- [ ] Verify transaction success/failure handling
- [ ] Implement retry mechanism
- [ ] Test on Pi Browser with Testnet wallet

---

## Common Values During Testing

```
Recipient Wallet:      0xPi1234567890abcdef1234567890abcdef123456
Right Value:           9.99 Pi
Platform Fee (5%):     0.50 Pi
Total:                 10.49 Pi
Reference Example:     REF-1704067200000-A7B2C9D4E
Description Example:   Execution right: Content Distribution License
Network:               Pi Testnet
```

---

## Component References

**Components Using These Fields**:
- `components/payment-box.tsx` - Main payment component
- `components/testnet-payment-display.tsx` - Display-only component
- `components/right-details.tsx` - Integration point
- `app/page.tsx` - State management

**Type Definitions**:
- `lib/types.ts` - Payment interface definition

**Utilities**:
- `lib/proof-utils.ts` - Formatting utilities

---

**Status**: ✅ Testnet Payment Fields - Ready for Integration
