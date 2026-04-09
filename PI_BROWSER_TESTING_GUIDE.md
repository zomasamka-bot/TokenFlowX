# TokenFlowX - Pi Browser Testing Guide

## Pre-Test Checklist

- [ ] Pi Browser installed and updated
- [ ] Internet connection stable
- [ ] Device in landscape mode (optional but recommended)
- [ ] 5 minutes available for complete test
- [ ] Pen/paper for noting results (or note app)

---

## Test Environment Setup

### Starting Fresh
```
1. Close all other Pi Browser tabs
2. Clear browser cache (optional)
3. Open fresh Pi Browser window
4. Navigate to application URL
5. Wait for page to fully load
```

### Network Conditions (Advanced Testing)
- Test on WiFi (normal conditions)
- Test on 4G if available
- Test with reduced connection (if testing tools available)

---

## Test Cases - Quick Reference

| # | Test | Expected | Duration | Status |
|---|------|----------|----------|--------|
| 1 | App loads | No errors, rights visible | 30s | ✓ |
| 2 | Select right | Details display, back button appears | 15s | ✓ |
| 3 | Execute free right | No payment shown, execution direct | 45s | ✓ |
| 4 | Execute paid right | Payment box shown | 30s | ✓ |
| 5 | Process payment | "Processing Payment..." shows | 15s | ✓ |
| 6 | Execute after payment | "Executing..." shows, then proof | 30s | ✓ |
| 7 | Copy proof ID | Text copied to clipboard | 10s | ✓ |
| 8 | Share proof | Share dialog opens | 10s | ✓ |
| 9 | Export proof | JSON file downloads | 15s | ✓ |
| 10 | View activity | All executions listed | 20s | ✓ |

**Total Test Time**: Approximately 3-5 minutes

---

## Detailed Test Procedures

### Test 1: Application Load (Target: 30 seconds)

**Steps**:
1. Open Pi Browser
2. Paste application URL in address bar
3. Press Enter
4. Wait for page to load completely

**Expected Results**:
- [ ] TokenFlowX header visible with icon
- [ ] "Digital Rights Execution" subtitle shown
- [ ] Connect button visible in header
- [ ] 4 rights cards displayed in list
- [ ] No console errors
- [ ] Page fully responsive

**Pass Criteria**: All elements load without errors

---

### Test 2: Select and View Right (Target: 45 seconds)

**Steps**:
1. On rights list, tap "Content Distribution License" card
2. Wait for details page to load
3. Review displayed information
4. Verify back button appears in header

**Expected Results**:
- [ ] Details page loads instantly
- [ ] Right title displays
- [ ] Description visible
- [ ] Right holder shown
- [ ] Issued and expiration dates shown
- [ ] Status badge shows "Active"
- [ ] Execute button visible
- [ ] Activity Log button visible
- [ ] Back button in header

**Pass Criteria**: All details display correctly

---

### Test 3: Execute Free Right (Target: 1 minute)

**Steps**:
1. From rights list, select a right with no payment
2. Tap "Execute Right" button
3. Review confirmation dialog
4. Review the warning message
5. Tap "Execute Right" in dialog
6. Watch for "Executing..." state
7. Wait for proof screen

**Expected Results**:
- [ ] Confirmation dialog shows
- [ ] Message says "You are about to execute this right"
- [ ] Dialog shows right details
- [ ] "Executing..." spinner appears
- [ ] Proof screen loads
- [ ] "Execution Completed" message shown
- [ ] Proof ID visible
- [ ] Reference number visible
- [ ] Timestamp shown

**Pass Criteria**: Flow completes without errors

---

### Test 4: Execute Paid Right (Target: 1 minute)

**Steps**:
1. Back to list, select "API Usage Rights"
2. Tap "Execute Right"
3. Payment box should appear (don't close)
4. Review payment details

**Expected Results**:
- [ ] Payment box appears instead of direct execution
- [ ] Amount shown: "$29.99 USD"
- [ ] Description visible
- [ ] Reference number shown
- [ ] "Proceed to Payment" button visible

**Pass Criteria**: Payment box displays with correct details

---

### Test 5: Process Payment (Target: 45 seconds)

**Steps**:
1. From payment box (previous test), tap "Proceed to Payment"
2. Watch for "Processing Payment..." message
3. Wait for payment processing to complete
4. Confirmation should appear

**Expected Results**:
- [ ] Spinner shows
- [ ] "Processing Payment..." text visible
- [ ] After ~2 seconds, payment completes
- [ ] Success or failure message shown
- [ ] Confirmation dialog ready

**Pass Criteria**: Payment processes with feedback

---

### Test 6: Complete Execution After Payment (Target: 1 minute)

**Steps**:
1. After payment succeeds, confirm execution
2. Watch for "Executing..." state
3. Wait for proof to generate

**Expected Results**:
- [ ] "Executing..." spinner appears
- [ ] Execution completes
- [ ] Proof screen loads
- [ ] "Execution Completed" shown
- [ ] Payment details visible on proof
- [ ] All proof details visible

**Pass Criteria**: Execution completes with proof

---

### Test 7: Copy Proof ID (Target: 15 seconds)

**Steps**:
1. On proof screen, locate Proof ID field
2. Tap copy icon next to Proof ID
3. Verify button feedback

**Expected Results**:
- [ ] Copy button changes color
- [ ] "Copied!" feedback appears (if implemented)
- [ ] ID copied to clipboard
- [ ] No errors shown

**Pass Criteria**: Copy works without issues

---

### Test 8: Share Proof (Target: 15 seconds)

**Steps**:
1. Locate Share button on proof screen
2. Tap Share button
3. Note if share sheet appears

**Expected Results**:
- [ ] Share button is functional
- [ ] Share sheet appears (or fallback works)
- [ ] Can select share destination
- [ ] No errors

**Pass Criteria**: Share functionality works

---

### Test 9: Export Proof (Target: 30 seconds)

**Steps**:
1. Locate Export button on proof screen
2. Tap Export button
3. Wait for download

**Expected Results**:
- [ ] Export button clickable
- [ ] No errors shown
- [ ] File downloads (if Pi Browser supports)
- [ ] File named "execution-proof-{id}.json"
- [ ] File contains valid JSON with proof data

**Pass Criteria**: Export creates valid JSON file

---

### Test 10: View Activity Log (Target: 1 minute)

**Steps**:
1. Back to details page (tap back or activity log)
2. Tap "Activity Log" button
3. Review activity entries
4. Tap "View Execution Proof" on one entry

**Expected Results**:
- [ ] Activity log loads
- [ ] Shows all executed rights with timestamps
- [ ] Status badge shows "Success" with green color
- [ ] "View Execution Proof" button visible
- [ ] Clicking proof button shows that proof
- [ ] Proof details match the activity entry

**Pass Criteria**: Activity log shows all executions with correct proofs

---

## Wallet Connection Test (Bonus: 30 seconds)

**Steps**:
1. Tap "Connect" button in header
2. Wallet connection panel appears
3. Tap "Connect Wallet"
4. Wait for connection simulation
5. Verify button status changes to "Connected"
6. Tap "Connect" again to see toggle

**Expected Results**:
- [ ] Panel appears and closes smoothly
- [ ] Wallet status updates
- [ ] Button shows "Connected" when connected
- [ ] No errors

---

## Mobile Responsiveness Test (Advanced: 2 minutes)

**Steps**:
1. Test on 375px width (phone)
2. Test on 768px width (tablet)
3. Test on 1024px+ (desktop)
4. On each, verify:
   - Text is readable
   - Buttons are tappable (min 44x44px)
   - No horizontal scrolling
   - Layout adapts properly

**Expected Results**:
- [ ] Phone: Single column, readable
- [ ] Tablet: Optimized spacing
- [ ] Desktop: Full layout
- [ ] All interactive elements accessible

---

## Error Handling Test (Advanced: 2 minutes)

**Steps**:
1. Try rapid button clicks
2. Navigate quickly between views
3. Try edge cases (back multiple times)
4. Open dev tools and check console

**Expected Results**:
- [ ] No errors on rapid clicks
- [ ] Navigation is stable
- [ ] Browser console shows no errors
- [ ] App recovers gracefully

---

## Performance Test (Monitoring: Throughout)

Monitor these during testing:
- App loads in < 1 second
- Navigation is instant (<100ms)
- Buttons respond immediately
- No lag or stuttering
- No memory issues (extended use)

---

## Defect Reporting Template

If you encounter an issue:

```
DEFECT: [Title]

Environment:
- Device: [iPhone/Android/etc]
- Browser: [Pi Browser version]
- URL: [Application URL]

Steps to Reproduce:
1. [First step]
2. [Second step]
3. [Third step]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshots/Video:
[If possible, attach]

Console Errors:
[Any JavaScript errors]
```

---

## Test Result Summary

After completing all tests:

| Category | Pass | Notes |
|----------|------|-------|
| Functionality | [ ] | |
| UX/Navigation | [ ] | |
| Performance | [ ] | |
| Mobile Responsiveness | [ ] | |
| Error Handling | [ ] | |
| Proof System | [ ] | |
| Activity Tracking | [ ] | |

**Overall Result**: [ ] PASS [ ] PASS WITH NOTES [ ] FAIL

---

## Sign-Off

**Tester Name**: ________________  
**Date**: ________________  
**Browser Version**: ________________  
**Device**: ________________  

**Comments**:
```
[Any additional notes about the testing experience]
```

---

## Next Steps After Testing

1. **If PASS**: Ready for Pi Developer Portal submission
2. **If PASS WITH NOTES**: Review notes with team, make any adjustments
3. **If FAIL**: Document issues and coordinate fixes

---

## Quick Links for Tester

- **PI_DEVELOPER_PORTAL_SUBMISSION.md** - Full submission details
- **QUICK_REFERENCE.md** - Quick test scenarios
- **EXECUTION_FLOW.md** - Detailed flow documentation
- **README.md** - General app information
