# TokenFlowX Pi Wallet Integration Guide

## Overview

TokenFlowX now supports real Pi Network wallet connection with full testnet support. The application automatically detects whether it's running in Pi Browser and connects to the real wallet, or falls back to demo mode.

---

## How It Works

### 1. **Automatic Detection**
- When the app loads, it checks if `window.Pi` SDK is available
- If available (running in Pi Browser), it initializes the real Pi SDK
- If not available (browser, desktop), it uses demo mode with mock wallet

### 2. **Authentication Scopes**
The wallet requests these specific scopes from the user:
- **`username`**: Access to user's Pi username for display
- **`payments`**: Required for payment transactions

These scopes are required and validated by Pi Network.

### 3. **Connection Flow**
```
User clicks "Connect Wallet"
     ↓
App checks for window.Pi SDK
     ↓
[If SDK exists] → Initialize Pi SDK → Request scopes → Get user ID
     ↓
[If SDK not found] → Use demo mode → Generate mock address
     ↓
Display connected status
```

---

## Setup Instructions

### For Development (Testing)

1. **Install the app locally**
   ```bash
   npm install
   npm run dev
   ```

2. **Test with mock wallet** (any browser)
   - Click "Connect Wallet"
   - App will show "Demo Mode" indicator
   - Connection succeeds immediately with mock address

### For Production (Real Wallet)

1. **Register in Pi Developer Portal**
   - Go to https://develop.pi (open in Pi Browser)
   - Register your application
   - Get your App ID

2. **Configure App for Testnet**
   - In Pi Developer Portal, add your development URL
   - Enable sandbox/testnet mode
   - Get your sandbox URL

3. **Test in Pi Browser**
   - Open the app in Pi Browser
   - Click "Connect Wallet"
   - Authenticate with your Pi account
   - Grant permissions for `username` and `payments` scopes

4. **Deploy to Production**
   - Follow Pi Network's production deployment guide
   - Update your app URL in Developer Portal
   - Switch from sandbox to mainnet in Pi SDK config

---

## Error Handling

### "Invalid scopes found" Error
**Cause:** Wrong scope names being requested  
**Solution:** Ensure scopes are exactly `["username", "payments"]`

### "Pi SDK not initialized" Error
**Cause:** Pi Browser version too old or SDK initialization failed  
**Solution:** Update Pi Browser to latest version

### "Connection failed"
**Cause:** Network error or user denied permissions  
**Solution:** Check error message, retry connection

### Falls back to Demo Mode
**Cause:** App not running in Pi Browser  
**Status:** Normal - demo mode allows testing without Pi Browser
**Action:** Open in Pi Browser to test real wallet connection

---

## Features

### Connected State
- Shows connected user ID
- Displays "Connected" badge
- "Disconnect" button available

### Disconnected State
- Shows "Not Connected" status
- "Connect Wallet" button ready to click

### Demo Mode Indicator
- Shows "Demo Mode" badge when Pi SDK unavailable
- Automatically uses mock connection
- Full app functionality available for testing

---

## Implementation Details

### Scopes Configuration
```javascript
const scopes = ["username", "payments"];
const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
```

### SDK Initialization
```javascript
await window.Pi.initialize({
  version: "2.0",      // Correct format: string, not number
  sandbox: true,       // Testnet mode
});
```

### User Information
The app extracts the user ID:
```javascript
const userID = auth.user.uid;  // App-specific user identifier
const username = auth.user.username; // User's Pi username (if username scope granted)
```

---

## Testing Checklist

- [ ] Test in browser (should show "Demo Mode")
- [ ] Connect wallet in demo mode (should work)
- [ ] Disconnect and reconnect (should work)
- [ ] Open in Pi Browser on testnet
- [ ] Request wallet connection (should show permission dialog)
- [ ] Grant permissions (should authenticate)
- [ ] Verify connected status displays user ID
- [ ] Disconnect in Pi Browser (should reset)
- [ ] Process payment with real wallet (in payment flow)

---

## Troubleshooting

### Pi SDK Not Loading
Check browser console for errors. Pi SDK must be loaded from `https://sdk.minepi.com/pi-sdk.js`

### Scopes Error Persists
Ensure you're using exact scope names: `["username", "payments"]`

### Can't Connect in Pi Browser
1. Verify app is registered in Developer Portal
2. Check that development URL is configured
3. Clear browser cache and try again
4. Check Pi Browser version is up to date

### Payment Not Working After Connection
1. Verify `payments` scope was granted
2. Check that app has permission in Developer Portal
3. Test payment flow in demo mode first

---

## Production Deployment

Before deploying to production:

1. **Get Production App ID** from Pi Developer Portal
2. **Update Pi SDK initialization** (change `sandbox: false`)
3. **Test on mainnet** (requires real Pi tokens)
4. **Configure production URL** in Developer Portal
5. **Deploy to Vercel** and update Portal with final URL

---

## References

- [Pi Network SDK Docs](https://pi-apps.github.io/pi-sdk-docs)
- [Pi Developer Portal](https://develop.pi)
- [Pi Authentication Reference](https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md)

---

## Support

For issues:
- Check Pi Browser console for errors
- Verify app is registered in Developer Portal
- Update Pi Browser to latest version
- Contact Pi Network support: support@pi-network.io
