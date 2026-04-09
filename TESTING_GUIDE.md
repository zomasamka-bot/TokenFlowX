TokenFlowX - Comprehensive Testing Guide
==========================================

## Quick Start Testing (5 Minutes)

### Step 1: Launch the Application
1. Open TokenFlowX in Pi Browser
2. Verify header displays:
   - "TokenFlowX" title with logo
   - "Digital Rights Execution" subtitle
   - "Connect" button (or "✓ Connected" if wallet already connected)
   - Current view appropriate buttons

### Step 2: Verify Rights List
1. Main page shows 4 digital rights:
   - "Content Distribution License" (ACTIVE)
   - "API Usage Rights" (ACTIVE)
   - "Previous Content License" (EXPIRED)
   - "Data Processing Rights" (ACTIVE)
2. Each right shows:
   - Title and description
   - Right holder name
   - Price (if applicable)
   - Status badge with correct color
   - Expiration date with remaining days (if active)

### Step 3: Execute a Right (Core Test)
1. Tap on "Content Distribution License"
2. Verify Details View shows:
   - Right title: "Content Distribution License"
   - Description: "License to distribute video content across platforms"
   - Right Holder: "Creative Studios Inc"
   - Issued: [date] [time]
   - Expires: [date] with "30 days remaining"
   - Price: "$49.99"
   - Info box about execution proof
   - "Execute Right" button (blue, enabled)
   - "Activity Log" button
   - Mobile layout properly formatted

3. Tap "Execute Right"
4. Confirmation Dialog appears with:
   - Warning: "You are about to execute this right..."
   - "This action will be recorded as verifiable proof"
   - Right title and holder shown
   - Checklist items visible:
     - "Execution proof will be generated automatically"
     - "Activity will be logged permanently"
     - "You can export your proof anytime"
   - Cancel button (left)
   - Execute Right button (blue, right)

5. Tap "Execute Right" in dialog
6. Watch "Executing..." state with spinner
7. Dialog closes, returns to Proof Screen
8. Proof Screen shows:
   - Success checkmark animation
   - "Execution Completed" heading
   - "Your right has been successfully executed and recorded"
   - Proof ID (PROOF-[timestamp]-[random]) - copy button works
   - Reference (REF-[reference]) - copy button works
   - Status: "Completed" (green)
   - Execution Time: (milliseconds in readable format)
   - Date & Time: complete timestamp
   - Associated Right: "Content Distribution License"
   - Copy, Share, Export buttons all visible
   - "View Right Details" button

### Step 4: Test Proof Export
1. From Proof Screen, tap "Export"
2. JSON file downloads as `execution-proof-PROOF-[id].json`
3. File contains:
   - proofId
   - reference
   - status: "completed"
   - timestamp (ISO format)
   - executionTime (milliseconds)
   - right object (full metadata)
   - payment object (if applicable)

### Step 5: Verify Activity Log
1. Tap "View Right Details"
2. Tap "Activity Log"
3. Activity Log shows:
   - "1 action recorded"
   - Execution entry with:
     - "Execution Completed" label
     - "Success" badge (green)
     - Timestamp
     - "View Execution Proof" button
4. Tap "View Execution Proof"
5. Same proof displays as before

---

## Full Feature Testing (20 Minutes)

### Tab Filtering Test
1. Return to Rights List (tap Back)
2. Verify you can see tabs: Active | Used | Processing | Completed | Failed | Expired
3. Tap "Active" - shows 3 active rights
4. Tap "Expired" - shows 1 expired right ("Previous Content License")
5. Tap "Completed" - shows "Content Distribution License" (if you executed it)
6. Tab filtering works without page reload

### Multiple Executions Test
1. From Rights List, tap "API Usage Rights" ($29.99)
2. Verify it's a different right:
   - Description: "Permission to use API for web services"
   - Right Holder: "TechFlow Corp"
   - Price: $29.99
3. Tap "Execute Right"
4. Confirm execution in dialog
5. Watch "Executing..." state
6. Different Proof ID generated
7. Different Reference generated
8. Return to Activity Log
9. Verify BOTH executions show:
   - Different timestamps
   - Different proof IDs (can view both)
   - Both marked "Success"

### Payment Processing Test (If Applicable)
1. Execute "Data Processing Rights" ($39.99)
2. If payment is required:
   - Payment dialog appears
   - Amount shows: "$39.99"
   - "Processing Payment..." appears with spinner
   - Successful payment completes (80% success rate demo)
   - Continues to execution
3. Verify final proof includes:
   - payment object with amount and currency
   - payment status: "success"

### Wallet Connection Test
1. Tap "Connect" button in header
2. Wallet connection panel appears with:
   - Wallet address input/display
   - Connect button
3. Tap Connect
4. Simulate connection (UI shows "✓ Connected")
5. Verify status persists (stays "✓ Connected")
6. Button color changed to green with checkmark
7. New connect actions show wallet-connected UI

---

## State Management Testing

### Real-Time State Updates
1. Execute a right and watch:
   - Processing state appears with spinner (≤300ms)
   - "Executing..." message displays
   - No page reload occurs
   - State update instant (proof appears without delay)

2. Navigate between views:
   - List → Details → Confirmation → Proof → Activity → List
   - All state preserved correctly
   - No state leakage between rights
   - Selected right updates properly

3. Activity Log updates:
   - New activity appears at top of list instantly
   - Timestamps accurate
   - Status badges correct

### Right Status Transitions
1. Execute "Content Distribution License" (ACTIVE)
2. In Rights List, verify status changed to "Completed"
3. Status badge color changed (now completed color)
4. Cannot re-execute the same right (button disabled if already completed)
5. Expired rights cannot be executed (button disabled)

---

## Error Handling & Edge Cases

### Test Expired Right
1. Tap "Previous Content License" (expired)
2. Details view shows status: "Expired"
3. "Execute Right" button is DISABLED (grayed out)
4. Tooltip or message explains why

### Test Duplicate Execution (Same Right, Different Sessions)
1. Execute "Content Distribution License"
2. Go back to list
3. Execute same right again
4. New proof generated with:
   - Different PROOF-ID
   - Different timestamp
   - Both records in Activity Log

### Test Back Navigation
1. From Details, tap Back → Returns to List
2. From Proof, tap "View Right Details" → Back to Details
3. From Activity, tap Back → Back to Details
4. All navigations smooth without state loss

---

## Mobile UX Testing

### Responsive Design Checks
1. App works on narrow screens (375px width)
2. No horizontal scrolling required
3. All buttons easily tappable (44px+ minimum height)
4. Text readable on small screens
5. No overlap of elements
6. Header sticky (always accessible)
7. Scrollable content areas work smoothly

### Touch Interactions
1. All buttons respond to tap immediately
2. No lag on state changes
3. Buttons have hover/active states for feedback
4. Modals/dialogs appear without jank
5. Animations smooth (spinner, success animation)

---

## Performance Testing

### Load Time
- App loads and displays all 4 rights in <2 seconds
- No loading spinner needed after initial load

### State Update Speed
- Tapping "Execute Right" button → proof appears in <500ms
- Activity Log updates instantly
- No noticeable delay in any interaction

### Memory Usage
- Multiple executions don't increase memory noticeably
- App stays responsive after 10+ executions

---

## Security & Data Testing

### Data Integrity
1. Proof data cannot be modified by user
2. Activity records are immutable
3. Each proof has unique ID
4. Timestamps are accurate
5. Export JSON contains all required fields

### Type Safety
1. No TypeScript errors in console
2. All components properly typed
3. No runtime type mismatches

---

## Browser Console Checks

During all testing, verify:
- No console errors (red messages)
- No console warnings (yellow messages)
- No broken images or missing assets
- No network errors

---

## Final Checklist Before Publication

- [ ] All 4 sample rights display correctly
- [ ] Tab filtering works (Active/Used/Processing/Completed/Failed/Expired)
- [ ] Can execute multiple rights successfully
- [ ] Each execution generates unique proof
- [ ] Activity log tracks all actions
- [ ] Proof export works and creates valid JSON
- [ ] Payment processing works (if applicable)
- [ ] Wallet connection UI works
- [ ] Mobile responsive on all screen sizes
- [ ] No console errors
- [ ] App loads in <2 seconds
- [ ] All buttons are responsive
- [ ] State updates in real-time
- [ ] Proof data is complete and accurate
- [ ] Export file names follow pattern `execution-proof-{id}.json`
- [ ] Header branding clear and professional
- [ ] All text terminology standardized
- [ ] Processing states show clear feedback
- [ ] No functionality broken in latest build

---

## Common Issues & Solutions

### Issue: Proof doesn't appear after execution
**Solution:** 
- Verify "Executing..." state appears for ≥300ms
- Check that right had "active" status before execution
- Try executing a different right
- Hard refresh page (Ctrl+Shift+R)

### Issue: Activity log doesn't update
**Solution:**
- Return to list and back to details view
- Activity log should refresh automatically
- Check browser console for errors

### Issue: Export file not downloading
**Solution:**
- Check browser download settings
- Verify JavaScript is enabled
- Try from a different right's proof
- Check file system storage

### Issue: Mobile layout broken
**Solution:**
- Close and reopen browser
- Try on different device if available
- Verify Pi Browser is updated to latest version

---

## Success Criteria

TokenFlowX passes testing when:

1. ✓ All core features work as documented
2. ✓ No console errors or warnings
3. ✓ Mobile responsive and user-friendly
4. ✓ State updates happen in real-time
5. ✓ Proof generation is reliable
6. ✓ Export functionality works
7. ✓ All buttons are responsive
8. ✓ Professional appearance
9. ✓ Professional terminology throughout
10. ✓ Ready for Pi Developer Portal

---

**Testing Duration:** 5-20 minutes depending on thoroughness
**Target Platform:** Pi Browser
**Version:** 1.0.0
