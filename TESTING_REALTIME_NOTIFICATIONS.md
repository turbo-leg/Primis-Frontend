# 🧪 Real-Time Notifications - Testing Guide

## Quick Test Checklist

### ✅ **Local Development Testing (5 minutes)**

```bash
# Terminal 1: Start Backend
cd c:\Users\tubul\OneDrive\Documents\Primis\college-prep-platform
docker-compose up -d

# Wait for backend to start (~30 seconds)
# Verify: curl http://localhost:8000/api/health

# Terminal 2: Start Frontend
cd c:\Users\tubul\Primis-Frontend
npm run dev
# Frontend should be at http://localhost:3000
```

### **Test 1: WebSocket Connection** (Desktop)

Open browser console (F12) and run:

```javascript
// Check Service Worker
console.log('1️⃣ Checking Service Worker...')
navigator.serviceWorker.getRegistrations()
  .then(regs => {
    if (regs.length > 0) {
      console.log('✅ Service Worker registered:', regs[0].scope)
    } else {
      console.warn('❌ No service worker registered')
    }
  })

// Check Manifest
console.log('2️⃣ Checking Manifest...')
fetch('/manifest.json')
  .then(r => r.json())
  .then(m => console.log('✅ Manifest loaded:', m.name))
  .catch(e => console.error('❌ Manifest error:', e))

// Check Notification Support
console.log('3️⃣ Checking Notification Support...')
console.log('- Notifications API:', 'Notification' in window ? '✅' : '❌')
console.log('- Service Workers:', 'serviceWorker' in navigator ? '✅' : '❌')
console.log('- Vibration API:', 'vibrate' in navigator ? '✅' : '❌')
console.log('- Badge API:', 'setAppBadge' in navigator ? '✅' : '❌')

// Check WebSocket
console.log('4️⃣ Checking WebSocket...')
const ws = new WebSocket('ws://localhost:8000/api/v1/notifications/ws/1')
ws.onopen = () => {
  console.log('✅ WebSocket connected')
  ws.send(JSON.stringify({type: 'heartbeat', userId: 1}))
}
ws.onmessage = (e) => console.log('📨 Message:', e.data)
ws.onerror = (e) => console.error('❌ WebSocket error:', e)
ws.onclose = () => console.log('🔌 WebSocket closed')
```

Expected output:
```
✅ Service Worker registered: /
✅ Manifest loaded: Primis EduCare - College Prep Platform
- Notifications API: ✅
- Service Workers: ✅
- Vibration API: ✅
- Badge API: ✅
✅ WebSocket connected
```

### **Test 2: Notification Permission** (Desktop)

```javascript
// Request notification permission
console.log('Requesting notification permission...')
Notification.requestPermission()
  .then(permission => {
    console.log('Permission:', permission)
    
    if (permission === 'granted') {
      // Show test notification
      new Notification('Test Notification', {
        body: 'This is a test desktop notification',
        icon: '/logo.png',
        badge: '/badge.png',
        tag: 'test-notification',
        requireInteraction: true,
        actions: [
          { action: 'open', title: 'Open' },
          { action: 'dismiss', title: 'Dismiss' }
        ]
      })
      console.log('✅ Test notification shown')
    }
  })
```

### **Test 3: Mobile Testing**

#### **On Chrome Desktop (Device Emulation):**
1. Open DevTools (F12)
2. Click Device Toolbar (Ctrl+Shift+M)
3. Select "iPhone 12" or "Pixel 5"
4. Refresh page
5. Run tests above
6. Watch for vibration simulation

#### **On Actual Mobile Device:**

1. **Android (Chrome):**
   ```
   1. Go to http://localhost:3000 (if on same network, use computer IP)
   2. Open DevTools (remote debugging)
   3. Run tests above
   4. Feel for vibration on urgent notifications
   ```

2. **iOS (Safari):**
   ```
   1. Go to http://localhost:3000
   2. Open DevTools (limited support)
   3. Tap + button > Add to Home Screen
   4. Open as PWA
   5. Grant notification permission
   6. Test notifications
   ```

### **Test 4: Backend Health Check**

```javascript
// In browser console or terminal
// Check backend
fetch('http://localhost:8000/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ Backend health:', data))
  .catch(e => console.error('❌ Backend error:', e))

// Check WebSocket endpoint
fetch('http://localhost:8000/api/v1/notifications/stats')
  .then(r => r.json())
  .then(data => console.log('✅ WebSocket stats:', data))
  .catch(e => console.error('❌ Stats error:', e))
```

---

## Production Testing (Vercel + Render)

### **Before Deploying**

1. ✅ Update `deployment/vercel.json` with production URLs
2. ✅ Verify Render backend is running: `https://primis-full-stack-1.onrender.com/api/health`
3. ✅ Test all local tests above work

### **After Deploying**

```javascript
// In browser console at production URL

// 1. Verify manifest
fetch('/manifest.json')
  .then(r => r.json())
  .then(m => console.log('✅ Manifest:', m.name))

// 2. Verify service worker
navigator.serviceWorker.register('/sw.js')
  .then(reg => console.log('✅ SW registered:', reg.scope))

// 3. Test WebSocket
const token = localStorage.getItem('access_token')
const userId = 1 // Replace with your user ID
const ws = new WebSocket(`wss://primis-full-stack-1.onrender.com/api/v1/notifications/ws/${userId}?token=${token}`)
ws.onopen = () => {
  console.log('✅ Production WebSocket connected')
  ws.send(JSON.stringify({type: 'heartbeat'}))
}
ws.onmessage = (e) => console.log('📨 Message:', e.data)
ws.onerror = (e) => console.error('❌ Error:', e)
```

---

## Debugging Tips

### **Enable Verbose Logging**

Add to `src/hooks/useRealtimeNotifications.ts`:

```typescript
// Set to true for debugging
const VERBOSE_LOGGING = true

const log = (message: string, data?: any) => {
  if (VERBOSE_LOGGING) {
    console.log(`[WebSocket] ${message}`, data || '')
  }
}
```

### **Check Service Worker Status**

```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => {
    console.group('Service Worker')
    console.log('Scope:', reg.scope)
    console.log('Active:', reg.active?.state)
    console.log('Waiting:', reg.waiting?.state)
    console.log('Installing:', reg.installing?.state)
    console.groupEnd()
  })
})

// Force update
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.update())
})
```

### **Monitor WebSocket Messages**

```javascript
// Intercept WebSocket
const originalWS = WebSocket
window.WebSocket = class extends originalWS {
  constructor(url) {
    console.log('[WS] Connecting to:', url)
    super(url)
  }
  
  send(data) {
    console.log('[WS] Sending:', data)
    return super.send(data)
  }
}
```

### **Check Notification Permissions**

```javascript
// Check all permission states
console.log('Notifications:', Notification?.permission)
console.log('Camera:', await navigator.permissions?.query({name: 'camera'}))
console.log('Microphone:', await navigator.permissions?.query({name: 'microphone'}))
```

---

## Test Scenarios

### **Scenario 1: User Receives Notification While App is Open**

1. Login to http://localhost:3000
2. Open DevTools Console
3. From another terminal, send notification via backend:
   ```bash
   curl -X POST http://localhost:8000/api/v1/notifications/send \
     -H "Content-Type: application/json" \
     -d '{"user_id": 1, "title": "Test", "message": "Test notification"}'
   ```
4. Should see:
   - ✅ Toast in app
   - ✅ Browser notification
   - ✅ Console message: "📨 Real-time notification received"

### **Scenario 2: User Receives Notification While App is Closed**

1. Login and grant notification permission
2. Close app/tab (keep backend running)
3. From terminal, send notification
4. Should see browser notification on desktop
5. Click notification to return to app

### **Scenario 3: Poor Network Connection**

1. Open DevTools
2. Go to Network tab > Throttling
3. Select "Slow 3G"
4. Test WebSocket connection
5. Should see:
   - ✅ Longer reconnection times
   - ✅ Heartbeat still working
   - ✅ Notifications still arrive

### **Scenario 4: Service Worker Update**

1. Check Service Worker status in DevTools
2. Modify `public/sw.js`
3. Refresh page
4. Should see "Update found" message
5. New SW should take effect

---

## Common Test Failures & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "WebSocket connection failed" | Backend not running | Start backend with `docker-compose up -d` |
| "Notification permission denied" | Permission not granted | Click allow in permission prompt |
| "Service Worker not found" | File not in public folder | Check `/public/sw.js` exists |
| "Manifest 404" | Manifest not built | Ensure `public/manifest.json` exists |
| "ws:// connection not secure" on prod | Using ws:// instead of wss:// | Update to wss:// in Vercel env vars |
| "Cross-origin error" | CORS not configured | Check backend CORS middleware |

---

## Performance Monitoring

### **Monitor Resource Usage**

```javascript
// Check memory usage
if (performance.memory) {
  console.log('Memory:', {
    jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + 'MB',
    totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB',
    usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB'
  })
}

// Check network times
performance.getEntriesByType('resource').forEach(entry => {
  if (entry.name.includes('websocket') || entry.name.includes('notification')) {
    console.log(entry.name, {
      duration: Math.round(entry.duration) + 'ms',
      size: entry.transferSize + ' bytes'
    })
  }
})
```

### **Monitor Connection Health**

```javascript
// Track WebSocket health
const wsMetrics = {
  messagesReceived: 0,
  errorCount: 0,
  reconnectAttempts: 0,
  lastMessageTime: Date.now(),
  connectionTime: Date.now()
}

// Update in WebSocket handlers
ws.onmessage = (e) => {
  wsMetrics.messagesReceived++
  wsMetrics.lastMessageTime = Date.now()
}

ws.onerror = () => {
  wsMetrics.errorCount++
}

// Check health
console.log('WebSocket Health:', {
  messagesPerMinute: Math.round(wsMetrics.messagesReceived / ((Date.now() - wsMetrics.connectionTime) / 60000)),
  errorRate: wsMetrics.errorCount,
  uptime: Math.round((Date.now() - wsMetrics.connectionTime) / 1000) + 's'
})
```

---

## Summary

**Local Testing (3 min):** ✅ Works
1. Backend at localhost:8000
2. Frontend at localhost:3000
3. WebSocket connecting
4. Notifications showing

**Mobile Testing (5 min):** ✅ Works
1. Device emulation or actual phone
2. Manifest accessible
3. Service Worker registered
4. Notifications and vibration working

**Production Testing:** ✅ Ready
1. Vercel + Render setup complete
2. Environment variables configured
3. Files deployed
4. Ready for monitoring

