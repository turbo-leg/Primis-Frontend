# 🏗️ Real-Time Notifications Architecture & Quick Reference

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                     PRIMIS EDUCARE PLATFORM                            │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    CLIENT DEVICES                                │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │  DESKTOP (Chrome, Firefox, Edge, Safari)                  │  │  │
│  │  │  ├─ Browser Notification API                              │  │  │
│  │  │  ├─ Service Worker (/sw.js)                               │  │  │
│  │  │  ├─ WebSocket Connection (ws/wss)                         │  │  │
│  │  │  ├─ Badge API (taskbar badge)                             │  │  │
│  │  │  └─ Audio API (notification sounds)                       │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │  MOBILE (iOS Safari, Android Chrome)                      │  │  │
│  │  │  ├─ Browser Notification API                              │  │  │
│  │  │  ├─ Service Worker (/sw.js)                               │  │  │
│  │  │  ├─ WebSocket Connection (ws/wss)                         │  │  │
│  │  │  ├─ Vibration API (haptic feedback)                       │  │  │
│  │  │  ├─ PWA Manifest (app installation)                       │  │  │
│  │  │  └─ Home Screen Badge                                      │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                │                                        │
│                    ┌───────────┴───────────┐                          │
│                    │                       │                          │
│               WEBSOCKET (ws/wss)       HTTP API                       │
│               Bidirectional              REST Calls                   │
│                    │                       │                          │
│  ┌─────────────────┼───────────────────────┼──────────────────────┐  │
│  │                 │                       │                      │  │
│  │  ┌─────────────▼───────────────────────▼─────────────┐         │  │
│  │  │                                                   │         │  │
│  │  │         VERCEL (Frontend)                         │         │  │
│  │  │         - Next.js 15.5.4                          │         │  │
│  │  │         - React 18.2.0                            │         │  │
│  │  │         - Tailwind CSS                            │         │  │
│  │  │         - React Query                             │         │  │
│  │  │                                                   │         │  │
│  │  │         /dashboard (main app)                     │         │  │
│  │  │         /public/manifest.json (PWA)              │         │  │
│  │  │         /public/sw.js (Service Worker)           │         │  │
│  │  │                                                   │         │  │
│  │  │         Environment Variables:                    │         │  │
│  │  │         NEXT_PUBLIC_API_URL: Render backend       │         │  │
│  │  │         NEXT_PUBLIC_WS_URL: wss://render/api    │         │  │
│  │  │                                                   │         │  │
│  │  └─────────────────────────────────────────────────┘         │  │
│  │                                                               │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │                                                         │  │  │
│  │  │         RENDER (Backend)                               │  │  │
│  │  │         - FastAPI + Python                             │  │  │
│  │  │         - Docker Container                             │  │  │
│  │  │                                                         │  │  │
│  │  │         ENDPOINTS:                                      │  │  │
│  │  │                                                         │  │  │
│  │  │         WebSocket:                                      │  │  │
│  │  │         ├─ ws://localhost:8000/api/v1/notifications   │  │  │
│  │  │         │  /ws/{user_id}?token=...                     │  │  │
│  │  │         │  ├─ Connection Management                    │  │  │
│  │  │         │  ├─ Heartbeat/Ping-Pong                      │  │  │
│  │  │         │  ├─ Real-time Broadcasting                   │  │  │
│  │  │         │  └─ Pending Notification Queue               │  │  │
│  │  │         │                                               │  │  │
│  │  │         REST API:                                       │  │  │
│  │  │         ├─ GET /api/health                             │  │  │
│  │  │         ├─ GET /api/notifications/stats                │  │  │
│  │  │         ├─ GET /api/notifications/sse/{user_id}       │  │  │
│  │  │         ├─ POST /api/notifications/send               │  │  │
│  │  │         └─ POST /api/notifications/send-bulk          │  │  │
│  │  │                                                         │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
SCENARIO: User Receives a Real-Time Notification

1. TRIGGER EVENT (Backend)
   ├─ Teacher posts announcement
   ├─ Grade is uploaded
   ├─ Course enrollment
   └─ System event

                            │
                            ▼

2. BACKEND PROCESSING
   ├─ Get enrolled students
   ├─ Create notification object
   ├─ Send to real_time_notification_service
   └─ Broadcast to WebSocket connections

                            │
                            ▼

3. WEBSOCKET TRANSMISSION
   ├─ Connection pool finds user
   ├─ Sends JSON notification object
   ├─ Includes metadata (id, type, priority, etc)
   └─ Timestamp and routing info

                            │
                            ▼

4. FRONTEND RECEPTION
   ┌─── WebSocket Handler ──────────────┐
   │  ├─ Parse JSON notification        │
   │  ├─ Update React Query cache       │
   │  ├─ Increment unread count         │
   │  └─ Call handleNotification()       │
   └────────────────────────────────────┘

                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼

5. DISPLAY OPTIONS

   ┌─ BROWSER NOTIFICATION ─┐
   │  (Desktop/Mobile)      │
   │  ├─ System notification│
   │  ├─ Actions (open)     │
   │  ├─ Sound/Vibration    │
   │  └─ Desktop: Sound     │
   │     Mobile: Vibrate    │
   └────────────────────────┘

   ┌─ TOAST MESSAGE ────────┐
   │  (In-app)              │
   │  ├─ Color coded        │
   │  ├─ Priority based     │
   │  ├─ Auto-dismiss       │
   │  └─ Action URL included│
   └────────────────────────┘

   ┌─ BADGE UPDATE ─────────┐
   │  (Desktop/Mobile)      │
   │  ├─ Notification count │
   │  ├─ Desktop: Taskbar   │
   │  ├─ Mobile: Home icon  │
   │  └─ Updates in real-time
   └────────────────────────┘

   ┌─ SERVICE WORKER ───────┐
   │  (Offline support)     │
   │  ├─ Queue if offline   │
   │  ├─ Deliver when online│
   │  └─ Background sync    │
   └────────────────────────┘

                            │
                            ▼

6. USER INTERACTION
   ├─ Click notification → Navigate to page
   ├─ Dismiss notification → Remove from view
   ├─ Mark as read → Update backend
   └─ Delete → Remove from history
```

---

## File Structure

```
Primis-Frontend/
│
├── public/
│   ├── sw.js (or sw-enhanced.js)          ← Service Worker
│   ├── manifest.json                       ← PWA Manifest
│   ├── logo.png                            ← Notification icon
│   └── badge.png                           ← Badge icon
│
├── src/
│   ├── app/
│   │   └── layout.tsx                      ← Add manifest link here
│   │
│   ├── components/
│   │   └── NotificationBell.tsx            ← Already uses WebSocket
│   │
│   ├── hooks/
│   │   ├── useRealtimeNotifications.ts     ← Original hook
│   │   └── useEnhancedRealtimeNotifications.ts ← NEW: Mobile-optimized
│   │
│   ├── utils/
│   │   ├── notificationPermissions.ts      ← NEW: Permission utilities
│   │   └── ... (existing utils)
│   │
│   └── store/
│       └── auth.ts                         ← User store
│
├── deployment/
│   ├── vercel.json                         ← UPDATE: Add WSS URL
│   ├── Dockerfile
│   └── ... (other deployment files)
│
├── .env                                    ← Prod env (don't edit)
├── .env.local                              ← Local env (ws://localhost:8000)
├── .env.production                         ← Vercel env
│
└── DOCUMENTATION FILES (NEW):
    ├── MOBILE_DESKTOP_REALTIME_NOTIFICATIONS.md
    ├── DEPLOYMENT_REALTIME_NOTIFICATIONS.md
    ├── TESTING_REALTIME_NOTIFICATIONS.md
    └── IMPLEMENTATION_SUMMARY.md
```

---

## Technology Stack Overview

### **Frontend Technologies**

| Tech | Version | Purpose |
|------|---------|---------|
| Next.js | 15.5.4 | React framework, SSR |
| React | 18.2.0 | UI components |
| React Query | 5.14.2 | Data caching & sync |
| Tailwind CSS | 3.3.6 | Styling |
| TypeScript | 5.3.3 | Type safety |
| Zustand | 4.4.7 | State management |
| Lucide React | 0.294.0 | Icons |

### **Real-Time Technologies**

| Tech | Purpose |
|------|---------|
| WebSocket API | Bidirectional real-time communication |
| Service Worker | Offline support, push notifications |
| Browser Notification API | Desktop notifications |
| Vibration API | Mobile haptic feedback |
| Badge API | App icon badge (notification count) |
| PWA Manifest | Mobile app installation |

### **Backend Technologies**

| Tech | Version | Purpose |
|------|---------|---------|
| FastAPI | - | Async web framework |
| Python | 3.x | Backend language |
| WebSocket | - | Real-time protocol |
| SQLAlchemy | - | ORM |
| Docker | - | Container |

### **Deployment Platforms**

| Platform | Purpose |
|----------|---------|
| Vercel | Frontend hosting (Next.js) |
| Render | Backend hosting (FastAPI) |
| PostgreSQL | Database (on Render) |

---

## Environment Variables Quick Reference

### **Local Development** (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/api
```

### **Production** (Vercel Dashboard)
```bash
NEXT_PUBLIC_API_URL=https://primis-full-stack-1.onrender.com
NEXT_PUBLIC_WS_URL=wss://primis-full-stack-1.onrender.com/api
```

### **Backend Endpoints**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/v1/notifications/ws/{user_id}` | WebSocket | Real-time notifications |
| `/api/v1/notifications/sse/{user_id}` | GET | Server-sent events (fallback) |
| `/api/v1/notifications/stats` | GET | Connection statistics |
| `/api/v1/notifications/send` | POST | Send notification |

---

## Connection Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│ USER OPENS APP (localhost:3000)                        │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 1. Check if logged in (auth store)                     │
└─────────────────────────────────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
         ✅ LOGGED IN          ❌ NOT LOGGED IN
              │                     │
              ▼                     ▼
     Initialize hooks         Redirect to login
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│ 2. useRealtimeNotifications Hook Activates             │
│    ├─ Extract user ID                                 │
│    ├─ Get access token from localStorage              │
│    └─ Register service worker                         │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Request Notification Permission                     │
│    ├─ Check if already granted                        │
│    ├─ If default: request from user                   │
│    └─ Update permission state                         │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 4. WebSocket Connection Established                    │
│    ├─ URL: ws://localhost:8000/api/v1/notifications  │
│    │        /ws/{user_id}?token=...                   │
│    │                                                  │
│    │ Desktop:   ws://host                            │
│    │ Mobile:   ws://host (adaptive delays)           │
│    │ Production: wss://host (secure)                 │
│    │                                                  │
│    └─ Status: CONNECTED ✅                           │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Heartbeat Established                              │
│    ├─ Send heartbeat every 30-45 seconds             │
│    ├─ Desktop: 30 second interval                    │
│    ├─ Mobile: 45 second interval                     │
│    └─ Poor network: Extended interval                │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Ready for Real-Time Notifications                   │
│    ├─ Connection icon: 🟢 Green (connected)           │
│    ├─ Waiting for notifications...                    │
│    └─ Auto-reconnect if disconnected                  │
└─────────────────────────────────────────────────────────┘

WHEN NOTIFICATION ARRIVES:
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ Notification Received via WebSocket                    │
│ {"type": "notification", "title": "...", ...}        │
└─────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼

    Toast              Browser          Badge
    Notification      Notification      Update
    (In-app)          (System)          (Icon)
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
              React Query Cache
              Invalidate & Refresh

WHEN USER DISCONNECTS:
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ Auto-Reconnect Triggered                              │
│ ├─ Wait 3-5 seconds (adaptive)                        │
│ ├─ Retry connection                                   │
│ ├─ Max 5-8 attempts                                   │
│ └─ Fallback to polling if all fail                    │
└─────────────────────────────────────────────────────────┘
```

---

## Priority Levels & Behavior

### **Urgent** (Red)
- `requireInteraction: true` - stays on screen
- Sound alert ✓
- Vibration: `[200, 100, 200]` ms
- Toast: 10 second display
- Desktop: Sound + visual alert
- Mobile: Vibration + visual alert

### **High** (Orange)
- `requireInteraction: true` - stays on screen
- Sound alert ✓
- Vibration: `[100, 50, 100]` ms
- Toast: 7 second display
- Desktop: Sound + visual alert
- Mobile: Vibration + visual alert

### **Medium** (Blue)
- `requireInteraction: false` - auto-closes
- No sound
- Vibration: `[50]` ms (single pulse)
- Toast: 5 second display
- Desktop: Silent alert
- Mobile: Light vibration

### **Low** (Gray)
- `requireInteraction: false` - auto-closes
- No sound
- No vibration
- Toast: 3 second display
- Desktop: Silent alert only
- Mobile: Silent alert only

---

## Mobile vs Desktop Differences

| Feature | Desktop | Mobile |
|---------|---------|--------|
| **Heartbeat Interval** | 30 seconds | 45 seconds |
| **Reconnect Attempts** | 5 | 8 |
| **Reconnect Delay** | 3 seconds base | 5 seconds base |
| **Alert Sound** | ✓ Yes | ✗ No (system controls) |
| **Vibration** | ✗ No | ✓ Yes (if supported) |
| **PWA Install** | ✗ No | ✓ Yes ("Add to Home Screen") |
| **Badge API** | ✓ Taskbar | ✓ Home icon |
| **Network Adapt** | Basic | Advanced (checks 3G/4G) |
| **Data Saver** | Ignored | Respected |

---

## Quick Debugging Commands

### **Browser Console**
```javascript
// Check all systems
logNotificationCapabilities()

// Check connection
getNotificationPermissionState()

// Check device
getDeviceType()

// Check network
getNetworkInfo()

// Manual WebSocket test
const ws = new WebSocket('ws://localhost:8000/api/v1/notifications/ws/1')
ws.onopen = () => ws.send('{"type":"heartbeat"}')
ws.onmessage = (e) => console.log(JSON.parse(e.data))
```

### **Backend Monitoring**
```bash
# Check backend health
curl http://localhost:8000/api/health

# Get connection stats
curl http://localhost:8000/api/v1/notifications/stats

# View logs
docker logs primis-backend
```

---

## Performance Metrics

### **Expected Performance**
- **WebSocket Connection Time:** < 500ms
- **Notification Delivery Latency:** < 100ms
- **Service Worker Activation:** < 1000ms
- **Notification Display Time:** < 200ms
- **Memory Usage:** ~50-100MB per tab
- **CPU Usage:** < 1% idle, < 5% active

### **Optimization Tips**
- Enable compression on backend
- Use HTTP/2 push for service worker
- Minify JavaScript
- Compress notification payloads
- Cache static assets
- Use CDN for static files

---

This architecture supports thousands of concurrent users with proper backend scaling!

