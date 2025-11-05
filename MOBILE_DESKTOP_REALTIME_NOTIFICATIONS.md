# 🔔 Real-Time Notifications for Mobile & Desktop - Complete Implementation Guide

## 📋 Table of Contents
1. [Current Architecture](#current-architecture)
2. [What's Already Implemented](#whats-already-implemented)
3. [Implementation Plan](#implementation-plan)
4. [Mobile Specific Updates](#mobile-specific-updates)
5. [Desktop Specific Updates](#desktop-specific-updates)
6. [Deployment Configuration](#deployment-configuration)
7. [Testing & Troubleshooting](#testing--troubleshooting)

---

## Current Architecture

### **Technology Stack Being Used:**

**Frontend:**
- ✅ **Next.js 15.5.4** (React framework)
- ✅ **React 18.2.0** with hooks
- ✅ **React Query (TanStack)** for data caching
- ✅ **Tailwind CSS** for styling
- ✅ **Service Worker** for offline support and push notifications
- ✅ **Browser Notification API** for desktop notifications
- ✅ **WebSocket API** for real-time communication

**Backend:**
- ✅ **FastAPI** (Python async web framework)
- ✅ **WebSocket** endpoints for real-time notifications
- ✅ **Server-Sent Events (SSE)** as fallback
- ✅ **Connection Manager** for handling multiple connections
- ✅ **Enhanced Email Service** for email notifications

**Deployment:**
- **Frontend:** Vercel (https://vercel.com)
  - Environment: `NEXT_PUBLIC_API_URL=https://primis-full-stack.onrender.com`
  - Region: iad1 (US East)
  
- **Backend:** Render (https://render.com)
  - URL: `https://primis-full-stack.onrender.com`
  - Framework: FastAPI + Docker

---

## What's Already Implemented

### ✅ 1. **WebSocket Real-Time Connection**
- Location: `src/hooks/useRealtimeNotifications.ts`
- Status: **Fully operational**
- Features:
  - Auto-reconnection logic (5 attempts)
  - Heartbeat every 30 seconds
  - Toast notifications
  - React Query cache invalidation

### ✅ 2. **Notification Bell Component**
- Location: `src/components/NotificationBell.tsx`
- Status: **Fully operational**
- Features:
  - Real-time connection status indicator
  - Unread count badge
  - Priority-based styling
  - Mark as read/delete functionality

### ✅ 3. **Backend WebSocket Endpoint**
- Location: Backend at `/api/v1/notifications/ws/{user_id}`
- Status: **Fully operational**
- Features:
  - Connection management
  - Heartbeat/ping-pong
  - Broadcasting to multiple connections
  - Pending notification queue

### ✅ 4. **Service Worker (Basic)**
- Location: `public/sw.js`
- Status: **Partial - needs enhancement**
- Current Features:
  - Handles push notifications from backend
  - Click/close event handling
  - Message event handling

### ✅ 5. **Environment Configuration**
- Local dev: `.env.local` (ws://localhost:8000/api)
- Production: Vercel + Render (wss protocol)

---

## Implementation Plan

### **Phase 1: Enhanced Service Worker (Desktop + Mobile)**

**Objective:** Create a robust service worker that handles notifications across all platforms.

**File to Update:** `public/sw.js`

**Changes:**
1. Add Web App Manifest support
2. Implement notification actions (open, reply, dismiss)
3. Add badge and icon customization
4. Implement notification tagging for grouping
5. Add background sync for offline notifications

**Estimated Time:** 30 minutes

---

### **Phase 2: Mobile-Specific Optimizations**

**Objective:** Optimize real-time notifications for mobile devices.

**Files to Update:**
- `src/hooks/useRealtimeNotifications.ts`
- `src/components/NotificationBell.tsx`
- `public/manifest.json` (create)

**Changes:**
1. Detect mobile device and adjust reconnection strategy
2. Add vibration feedback for mobile
3. Add adaptive timeout for mobile networks
4. Create manifest.json for PWA support
5. Handle mobile-specific notification permissions

**Estimated Time:** 45 minutes

---

### **Phase 3: Desktop Push Notifications**

**Objective:** Implement native desktop push notifications.

**New Files:**
- `src/utils/notificationPermissions.ts` (new)
- `src/hooks/usePushNotifications.ts` (new)

**Changes:**
1. Request notification permission on first visit
2. Register service worker with push notification support
3. Handle permission states (granted, denied, default)
4. Implement desktop notification queue
5. Add notification sound/vibration

**Estimated Time:** 40 minutes

---

### **Phase 4: Deployment Configuration**

**Objective:** Configure all environments for real-time notifications.

**Files to Update:**
- `.env.local` (local dev)
- `.env.production` (production)
- `deployment/vercel.json` (Vercel config)
- Backend docker/Railway config

**Changes:**
1. Add WebSocket URLs for all environments
2. Configure CORS for WebSocket
3. Set up health checks
4. Add monitoring endpoints

**Estimated Time:** 20 minutes

---

## Mobile Specific Updates

### 1. **Adaptive Reconnection for Mobile**

```typescript
// Mobile networks have higher latency, so adjust timing
const RECONNECT_DELAY = isMobile ? 5000 : 3000  // 5s vs 3s
const MAX_RECONNECT_ATTEMPTS = isMobile ? 8 : 5  // More attempts on mobile
const HEARTBEAT_INTERVAL = isMobile ? 45 : 30    // Longer heartbeat on mobile
```

### 2. **Battery/Data Optimization**

```typescript
// Respect user's data saver mode if available
const dataMode = navigator.connection?.saveData || false
const networkType = navigator.connection?.effectiveType

if (dataMode) {
  // Reduce notification frequency
  NOTIFICATION_BATCH_INTERVAL = 60000  // 1 minute instead of real-time
}
```

### 3. **Mobile Notification Permissions**

```typescript
// iOS and Android require explicit user action
if (Notification.permission === 'default') {
  await Notification.requestPermission()
}
```

### 4. **PWA Manifest Configuration**

Create `public/manifest.json`:
```json
{
  "name": "Primis EduCare",
  "short_name": "Primis",
  "description": "College Prep Platform with Real-Time Notifications",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/logo.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/logo.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["education"],
  "screenshots": [],
  "shortcuts": [
    {
      "name": "View Notifications",
      "short_name": "Notifications",
      "description": "View your latest notifications",
      "url": "/dashboard/notifications",
      "icons": []
    }
  ]
}
```

### 5. **Mobile Network Adaptation**

```typescript
// Check network type and adjust accordingly
const connection = (navigator as any).connection
const effectiveType = connection?.effectiveType // '4g' | '3g' | '2g' | 'slow-2g'

if (effectiveType === '2g' || effectiveType === 'slow-2g') {
  // Reduce notification frequency, smaller payloads
  NOTIFICATION_SIZE_LIMIT = 100  // bytes
}
```

---

## Desktop Specific Updates

### 1. **Native OS Integration**

```typescript
// Request notification permission on desktop
if (Notification.permission === 'default') {
  const permission = await Notification.requestPermission()
  // permission: 'granted' | 'denied' | 'default'
}
```

### 2. **Notification Actions**

```typescript
const browserNotificationOptions: NotificationOptions = {
  title: notification.title,
  body: notification.message,
  icon: '/logo.png',
  badge: '/badge.png',
  tag: `notification-${notification.id}`,
  actions: [
    { action: 'open', title: 'Open' },
    { action: 'dismiss', title: 'Dismiss' }
  ],
  requireInteraction: notification.priority === 'urgent'
}

const notification = new Notification(title, options)
```

### 3. **Notification Click Handling**

```typescript
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  // Handle action clicks
  if (event.action === 'dismiss') {
    // Just close, already done above
  } else if (event.action === 'open' || !event.action) {
    // Open URL
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // Focus existing window or open new one
      })
  }
})
```

### 4. **Notification Sound & Vibration**

```typescript
// Desktop
const audio = new Audio('/notification-sound.mp3')
audio.volume = 0.3
audio.play()

// Mobile (vibration)
if (navigator.vibrate) {
  navigator.vibrate([200, 100, 200])  // [vibrate, pause, vibrate]
}
```

### 5. **Desktop Tray Integration**

```typescript
// Show badge on taskbar/tray
if ('getBadgeCount' in navigator) {
  navigator.setAppBadge(unreadCount)
}

// Clear badge when no unread
if (unreadCount === 0) {
  navigator.clearAppBadge()
}
```

---

## Deployment Configuration

### **Local Development** (localhost:3000)

**Frontend `.env.local`:**
```bash
# Already configured for local development
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Primis EduCare
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS=true
```

**Backend:** Running on Docker at `localhost:8000`

---

### **Production Configuration**

**Frontend on Vercel:**
```json
// deployment/vercel.json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://primis-full-stack-1.onrender.com",
    "NEXT_PUBLIC_WS_URL": "wss://primis-full-stack-1.onrender.com/api",
    "NEXT_PUBLIC_APP_NAME": "College Prep Platform",
    "NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS": "true"
  }
}
```

**Backend on Render:**
- Service: FastAPI + Docker
- URL: `https://primis-full-stack-1.onrender.com`
- WebSocket: Enabled (wss://)
- Health Check: `/api/health`

**CORS Configuration (Backend):**
```python
# app/main.py - should have CORS configured
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",          # Local dev
        "https://*.vercel.app",           # Vercel preview
        "https://your-domain.com",        # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
```

**WebSocket CORS Handling:**
```python
# For WebSocket, need special handling
# In your WebSocket endpoint:
@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    # Check origin header
    origin = websocket.headers.get('origin')
    if origin not in ALLOWED_ORIGINS:
        await websocket.close(code=1008, reason="Origin not allowed")
        return
    
    await websocket.accept()
    # ... rest of logic
```

---

## Testing & Troubleshooting

### **Quick Test Checklist:**

#### ✅ **Local Development (localhost:3000)**
```bash
# 1. Start backend
cd college-prep-platform/backend
docker-compose up -d

# 2. Check WebSocket endpoint
curl http://localhost:8000/api/health

# 3. Test WebSocket manually
# Open browser console and test:
const ws = new WebSocket('ws://localhost:8000/api/v1/notifications/ws/1?token=YOUR_TOKEN')
ws.onmessage = (event) => console.log('Received:', event.data)
ws.send('{"type":"heartbeat"}')

# 4. Frontend should be running on localhost:3000
npm run dev
```

#### ✅ **Desktop Notifications (Chrome/Edge)**
```javascript
// In browser console:
if (Notification.permission === 'granted') {
  new Notification('Test', { 
    body: 'Desktop notification test',
    icon: '/logo.png'
  })
} else {
  Notification.requestPermission()
}
```

#### ✅ **Mobile Testing**
1. Use Chrome DevTools device emulation
2. Test on actual mobile device:
   - iPhone: Safari PWA mode
   - Android: Chrome PWA mode
3. Check service worker registration:
   ```javascript
   navigator.serviceWorker.getRegistrations()
   ```

#### ✅ **Production Testing (Render + Vercel)**
```bash
# Test Render backend
curl https://primis-full-stack-1.onrender.com/api/health

# Test Vercel frontend
# Visit https://your-vercel-domain.vercel.app

# Test WebSocket (in browser console):
const ws = new WebSocket('wss://primis-full-stack-1.onrender.com/api/v1/notifications/ws/1?token=YOUR_TOKEN')
```

### **Common Issues & Solutions:**

| Issue | Cause | Solution |
|-------|-------|----------|
| WebSocket won't connect on production | CORS not configured | Add WebSocket origin to CORS allowed origins |
| Notifications work on desktop but not mobile | Service Worker not registered | Check `manifest.json` and service worker registration |
| Notifications work offline but not in background | Service Worker not active | Ensure app is installed as PWA on mobile |
| WebSocket disconnects every 60 seconds | Network timeout or load balancer | Implement heartbeat (already done) and check load balancer settings |
| Can't request notification permission on iOS | iOS restrictions | Must be installed as PWA or in Safari, requires user gesture |
| Push notifications not working on desktop | Service Worker not handling `push` event | Update `sw.js` to handle push events |

---

## Implementation Checklist

### **Phase 1: Enhanced Service Worker** ✅
- [ ] Update `public/sw.js` with notification actions
- [ ] Add notification grouping/tagging
- [ ] Add badge support
- [ ] Implement background sync

### **Phase 2: Mobile Optimizations** ✅
- [ ] Create `public/manifest.json`
- [ ] Update `useRealtimeNotifications.ts` with mobile detection
- [ ] Add vibration feedback
- [ ] Implement adaptive reconnection

### **Phase 3: Desktop Push** ✅
- [ ] Create `src/utils/notificationPermissions.ts`
- [ ] Create `src/hooks/usePushNotifications.ts`
- [ ] Add desktop notification sounds
- [ ] Implement tray badge

### **Phase 4: Deployment** ✅
- [ ] Update `.env.local` with NEXT_PUBLIC_WS_URL
- [ ] Update `deployment/vercel.json` with WSS URL
- [ ] Verify CORS on backend
- [ ] Test on Render + Vercel

### **Phase 5: Testing** ✅
- [ ] Test on localhost:3000
- [ ] Test on Chrome/Edge desktop
- [ ] Test on Android/iOS mobile
- [ ] Test on production (Render + Vercel)

---

## Quick Start: Running Everything Locally

```bash
# Terminal 1: Backend (Docker)
cd c:\Users\tubul\OneDrive\Documents\Primis\college-prep-platform
docker-compose up -d

# Check backend is running
curl http://localhost:8000/api/health

# Terminal 2: Frontend
cd c:\Users\tubul\Primis-Frontend
npm install  # if needed
npm run dev

# Frontend will be at http://localhost:3000
# Backend WebSocket at ws://localhost:8000/api/v1/notifications/ws/{user_id}
```

**Then test:**
1. Login to http://localhost:3000
2. Open browser DevTools (F12)
3. Check Network > WS tab for WebSocket connection
4. Should see `ws://localhost:8000/api/v1/notifications/ws/...` connection
5. In Console, you'll see real-time connection messages
6. Request notification permission when prompted
7. Send a test notification from backend

---

## Summary

**Current Status:** ✅ 70% Complete
- ✅ WebSocket real-time backend
- ✅ WebSocket hook and connection management
- ✅ Notification Bell component
- ✅ Service Worker (basic)
- ✅ Local development environment

**Still Needed:**
- 🔄 Enhanced Service Worker with notification actions
- 🔄 Mobile-specific optimizations
- 🔄 Desktop push notifications
- 🔄 PWA manifest configuration
- 🔄 Production environment configuration

**Deployment Pipeline:**
- Frontend: Vercel (auto-deploy on git push)
- Backend: Render (auto-deploy on git push)
- WebSocket: Requires `wss://` protocol on production
- Environment: Auto-configured in Vercel dashboard

