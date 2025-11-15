# 🔔 Primis Notification System - Complete Overview

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Frontend Components](#frontend-components)
3. [Real-Time Communication](#real-time-communication)
4. [Backend Services](#backend-services)
5. [Data Flow](#data-flow)
6. [Mobile vs Desktop](#mobile-vs-desktop)
7. [Key Files & Structure](#key-files--structure)
8. [Usage Examples](#usage-examples)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   USER'S BROWSER (Frontend)                     │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │  NotificationBell Component (UI)                          │  │
│ │  ├── Dropdown panel for viewing notifications            │  │
│ │  ├── Real-time connection indicator (🟢/🔴)              │  │
│ │  ├── Unread count badge                                 │  │
│ │  └── Mark as read/Delete functions                      │  │
│ └─────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│ ┌─────────────────▼─────────────────────────────────────────┐  │
│ │  useRealtimeNotifications Hook                            │  │
│ │  ├── Manages WebSocket connection                        │  │
│ │  ├── Automatic reconnection with backoff                │  │
│ │  ├── Browser notification display                       │  │
│ │  ├── In-app toast notifications                         │  │
│ │  ├── Invalidates React Query cache on new notifications│  │
│ │  └── Heartbeat every 30 seconds (desktop) / 45s (mobile)│  │
│ └─────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│ ┌─────────────────▼─────────────────────────────────────────┐  │
│ │  Service Worker (/public/sw.js)                          │  │
│ │  ├── Receives notifications via postMessage             │  │
│ │  ├── Shows browser notifications                        │  │
│ │  ├── Handles notification click events                  │  │
│ │  ├── Updates badge count                                │  │
│ │  └── Offline support / caching                          │  │
│ └─────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│ ┌─────────────────▼─────────────────────────────────────────┐  │
│ │  Browser APIs                                             │  │
│ │  ├── Notification API (Browser notifications)           │  │
│ │  ├── Badge API (App badge counter)                      │  │
│ │  ├── Vibration API (Mobile feedback)                    │  │
│ │  └── Service Worker API (Offline support)               │  │
│ └─────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
└───────────────────┼──────────────────────────────────────────────┘
                    │
          WebSocket (ws:// or wss://)
                    │
┌───────────────────▼──────────────────────────────────────────────┐
│              FastAPI Backend (Python)                             │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │  /api/v1/notifications/ws/{user_id}                       │  │
│ │  WebSocket Endpoint - Handles real-time connections      │  │
│ │  ├── Connection manager for each user                   │  │
│ │  ├── Message parsing and routing                        │  │
│ │  ├── Heartbeat response                                 │  │
│ │  └── Auto-disconnect on heartbeat timeout               │  │
│ └─────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│ ┌─────────────────▼─────────────────────────────────────────┐  │
│ │  real_time_notification_service                          │  │
│ │  ├── Broadcasts notifications to connected users        │  │
│ │  ├── JSON serialization of notification objects         │  │
│ │  ├── Error handling and logging                         │  │
│ │  └── Metrics collection                                 │  │
│ └─────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│ ┌─────────────────▼─────────────────────────────────────────┐  │
│ │  Database (PostgreSQL)                                    │  │
│ │  ├── Notifications table                                │  │
│ │  ├── Notification preferences                           │  │
│ │  ├── Notification log/history                           │  │
│ │  └── User preferences & settings                        │  │
│ └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend Components

### 1. **NotificationBell Component** (`src/components/NotificationBell.tsx`)

**Location:** `c:\Users\tubul\Primis-Frontend\src\components\NotificationBell.tsx`

**Responsibilities:**
- Display notification bell icon in header
- Show unread count badge (animated pulse)
- Dropdown panel for viewing notifications
- Filter notifications (All / Unread)
- Real-time connection status indicator

**Key Features:**
```tsx
- Displays real-time connection status (🟢 connected / 🔴 offline)
- Unread count with 9+ cap
- Notification click handling (navigate to action URL)
- Mark as read / Delete buttons
- Mark all as read functionality
- Time-ago formatting (just now, 5m ago, 2h ago, etc.)
- Priority-based color coding
- Toast notifications for real-time updates
```

**User Interactions:**
- Click bell → Opens/closes dropdown
- Click notification → Mark as read + navigate
- Click "Mark all as read" → Marks all unread as read
- Click trash icon → Delete notification
- Click checkmark → Mark single as read

---

### 2. **useRealtimeNotifications Hook** (`src/hooks/useRealtimeNotifications.ts`)

**Location:** `c:\Users\tubul\Primis-Frontend\src\hooks\useRealtimeNotifications.ts`

**Responsibilities:**
- Establish and maintain WebSocket connection
- Handle reconnection logic with exponential backoff
- Parse incoming notification messages
- Show browser notifications
- Show in-app toast notifications
- Handle iOS Safari limitations
- Manage service worker communication

**Connection Flow:**
```
1. Hook initializes when user is authenticated
2. Extracts user_id from auth store (student_id, teacher_id, or admin_id)
3. Constructs WebSocket URL from environment variables
4. Opens WebSocket connection with optional auth token
5. Sends heartbeat every 30 seconds to keep connection alive
6. On disconnect → Attempts reconnection (max 5 times with backoff)
7. On message received → Handles notification or heartbeat echo
```

**Environment Variables Used:**
```
- NEXT_PUBLIC_WS_URL: Direct WebSocket URL (e.g., ws://localhost:8000/api)
- NEXT_PUBLIC_API_URL: HTTP API URL (fallback to derive WebSocket URL)
- access_token: Retrieved from localStorage for authentication
```

**Browser Notification Handling:**
```typescript
// Desktop: Uses Notification API
if (Notification.permission === 'granted') {
  navigator.serviceWorker.controller.postMessage({
    type: 'SHOW_NOTIFICATION',
    title: notification.title,
    options: { /* ... */ }
  })
}

// Mobile: Uses vibration + toast
if (mobile && priority === 'urgent') {
  navigator.vibrate([200, 100, 200])
}
```

**Duplicate Prevention:**
- Tracks shown notifications in Set to avoid showing same notification twice
- Uses notification ID + timestamp as unique key
- Clears tracking set after 1000 entries to prevent memory leak

---

### 3. **useEnhancedRealtimeNotifications Hook** (`src/hooks/useEnhancedRealtimeNotifications.ts`)

**Location:** `c:\Users\tubul\Primis-Frontend\src\hooks\useEnhancedRealtimeNotifications.ts`

**Differences from useRealtimeNotifications:**
- **Mobile-optimized:** Adaptive reconnection delays based on device type
- **Network-aware:** Adjusts heartbeat intervals for poor connections
- **Data saver mode:** Respects system data saver settings
- **Service worker registration:** Handles PWA setup
- **App badge:** Updates notification count on app icon
- **Permission management:** Requests notification permissions automatically

**Adaptive Settings:**
```typescript
// Mobile device (longer timeouts)
reconnectDelay: 5000ms (vs 3000ms for desktop)
heartbeatInterval: 45000ms (vs 30000ms for desktop)
maxReconnectAttempts: 8 (vs 5 for desktop)

// Poor network (2G/3G)
reconnectDelay: 2x multiplier
heartbeatInterval: 1.5x multiplier

// Data saver mode
reconnectDelay: 1.5x multiplier
heartbeatInterval: 2x multiplier
```

---

## 🔌 Real-Time Communication

### WebSocket Connection Lifecycle

```
1. Connection Establishment
   ├── Client: Open WebSocket to ws://localhost:8000/api/v1/notifications/ws/{user_id}
   ├── Backend: Accept connection, add to active connections pool
   └── Status: onopen → isConnected = true

2. Message Flow
   ├── Heartbeat (Client → Server every 30-45s)
   │  └── { type: 'heartbeat', userId: 1 }
   ├── Response (Server → Client)
   │  └── { type: 'ping' } (or similar echo)
   └── Notification (Server → Client, real-time)
      └── { 
      │    type: 'notification',
      │    notification_type: 'assignment',
      │    title: 'New Assignment',
      │    message: 'New math homework posted',
      │    priority: 'high',
      │    metadata: { url: '/assignments/123' },
      │    timestamp: '2025-11-14T10:30:00Z',
      │    id: 'notif_123'
      │  }

3. Reconnection Logic (Exponential Backoff)
   ├── 1st attempt: 3000ms (3 seconds)
   ├── 2nd attempt: 6000ms (6 seconds)
   ├── 3rd attempt: 9000ms (9 seconds)
   ├── 4th attempt: 12000ms (12 seconds)
   ├── 5th attempt: 15000ms (15 seconds)
   └── Max attempts reached → Show error message

4. Disconnection Handling
   ├── Close by user → Stop reconnection attempts
   ├── Network error → Begin automatic reconnection
   ├── Timeout → Treated as network error
   └── Manual disconnect available via disconnect() method
```

### Message Format (JSON)

**Notification Message:**
```json
{
  "type": "notification",
  "notification_type": "assignment",
  "title": "New Assignment Posted",
  "message": "Mr. Smith posted 'Chapter 5 Review' due Nov 20",
  "priority": "high",
  "timestamp": "2025-11-14T10:30:00Z",
  "id": "notif_12345",
  "metadata": {
    "url": "/courses/101/assignments/456",
    "course_id": 101,
    "assignment_id": 456,
    "unread_count": 5
  }
}
```

**Heartbeat Message:**
```json
{
  "type": "heartbeat",
  "userId": 1
}
```

---

## 🖥️ Backend Services

### 1. **Enhanced Notifications API** (`backend/app/api/enhanced_notifications.py`)

**WebSocket Endpoint:**
```python
@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    """
    Real-time WebSocket endpoint for notifications
    - Accepts user connections
    - Broadcasts notifications to connected users
    - Handles heartbeat/keepalive messages
    """
```

**REST Endpoints:**
```python
GET  /api/v1/notifications/              # List notifications (paginated)
GET  /api/v1/notifications/{id}          # Get single notification
GET  /api/v1/notifications/count         # Get unread count
POST /api/v1/notifications/send          # Send notification
POST /api/v1/notifications/{id}/read     # Mark as read
POST /api/v1/notifications/read-all      # Mark all as read
DELETE /api/v1/notifications/{id}        # Delete notification
```

### 2. **Real-Time Notification Service** (`backend/app/services/real_time_notification_service.py`)

**Responsibilities:**
- Maintain active WebSocket connections per user
- Broadcast notifications to specific users or all users
- Message serialization to JSON
- Connection lifecycle management
- Error handling and logging

**Connection Management:**
```python
class RealTimeNotificationService:
    active_connections: dict = {
        user_id: [websocket, websocket, ...],  # Multiple connections per user
        ...
    }
    
    async def connect(user_id, websocket):
        """Add user to active connections"""
        
    async def disconnect(user_id, websocket):
        """Remove user from active connections"""
        
    async def broadcast_to_user(user_id, message):
        """Send notification to specific user"""
        
    async def broadcast_to_all(message):
        """Send system-wide notification"""
```

### 3. **Notification Models** (`backend/app/models/notification_models.py`)

**Database Schema:**
```python
class Notification(Base):
    """Store all notifications"""
    __tablename__ = "notifications"
    
    notification_id: int (PK)
    user_id: int (FK)
    notification_type: str  # enum: 'assignment', 'grade', 'message', etc.
    title: str
    message: str
    priority: str  # enum: 'urgent', 'high', 'medium', 'low'
    is_read: bool
    action_url: Optional[str]
    action_text: Optional[str]
    metadata: JSON
    created_at: datetime
    updated_at: datetime
    
class NotificationPreference(Base):
    """User preferences for notifications"""
    __tablename__ = "notification_preferences"
    
    preference_id: int (PK)
    user_id: int (FK)
    notification_type: str
    channel: str  # 'in_app', 'email', 'sms', 'push'
    enabled: bool
    quiet_hours_start: Optional[time]
    quiet_hours_end: Optional[time]
```

---

## 📊 Data Flow

### Scenario 1: Teacher Posts Assignment

```
1. Teacher clicks "Post Assignment"
   ↓
2. Backend API receives POST /courses/{id}/assignments
   ↓
3. Assignment saved to database
   ↓
4. Backend triggers notification event:
   ├── Create Notification record in DB
   ├── Get all enrolled students
   └── For each student:
       ├── Call real_time_notification_service.broadcast_to_user()
       └── If WebSocket connected:
           └── Send notification via WebSocket (instant)
   ↓
5. Frontend WebSocket receives message
   ├── Parse JSON notification
   ├── Show browser notification (if permission granted)
   ├── Show toast notification (in-app)
   ├── Invalidate React Query cache (notifications, notificationCount)
   └── NotificationBell updates with new unread count
   ↓
6. Student sees:
   ├── Bell icon badge updated (e.g., "1")
   ├── Browser notification (optional)
   ├── Toast notification (in-app)
   └── Notification in dropdown when clicking bell
```

### Scenario 2: No Real-Time Connection

```
1. Student opens app but WebSocket fails to connect
   ↓
2. Frontend falls back to polling via React Query
   ├── Queries GET /api/v1/notifications every 30 seconds
   └── Updates UI from query results
   ↓
3. Student sees notifications (delayed by ~30 seconds)
   ├── Not real-time but eventually consistent
   └── Ensures no notifications are missed
```

### Scenario 3: Student Marks as Read

```
1. Student clicks notification or checkmark icon
   ↓
2. Frontend calls POST /api/v1/notifications/{id}/read
   ↓
3. Backend updates is_read = true in database
   ↓
4. Backend invalidates cached notification count
   ↓
5. Frontend React Query cache invalidated
   ├── Notification removed from "Unread" filter
   ├── Badge count decremented
   └── UI updates immediately
```

---

## 📱 Mobile vs Desktop

### Mobile Optimizations

**Connectivity:**
```typescript
// Mobile devices often have unstable connections
getAdaptiveSettings():
  - Longer reconnection delays (5s vs 3s)
  - More reconnection attempts (8 vs 5)
  - Longer heartbeat intervals (45s vs 30s)
  - Respects data saver mode
```

**Vibration & Sound:**
```typescript
// Mobile doesn't support window vibration API like desktop
if (mobile && priority === 'urgent'):
  navigator.vibrate([200, 100, 200])  // Vibration pattern
```

**Service Worker:**
```typescript
// PWA installation on mobile
- Manifest.json enables "Add to Home Screen"
- Service worker caches notification data
- Supports offline viewing of old notifications
```

**iOS Safari Limitations:**
```typescript
// iOS Safari (10.3+) doesn't support Notification API
isIOSSafari() → 
  - Skip browser notifications
  - Use toast/in-app notifications only
  - Provide fallback visual indicators
```

**App Badge:**
```typescript
// Updates notification count on app icon
navigator.setAppBadge(5)    // Shows "5" on app icon
navigator.clearAppBadge()   // Clears badge
```

### Desktop Features

**Browser Notifications:**
```typescript
// Full Notification API support
new Notification(title, {
  body: message,
  icon: '/logo.png',
  badge: '/badge.png',
  requireInteraction: true,  // Stays until user interacts
  actions: [
    { action: 'open', title: 'Open' },
    { action: 'dismiss', title: 'Dismiss' }
  ]
})
```

**Sound Alerts:**
```typescript
const audio = new Audio('/notification-sound.mp3')
audio.volume = 0.3
audio.play()
```

**Taskbar Integration:**
```typescript
// Browser shows badge on taskbar/dock
// Desktop notif stays visible until interaction
```

---

## 📁 Key Files & Structure

### Frontend

```
Primis-Frontend/
├── src/
│   ├── components/
│   │   └── NotificationBell.tsx          # Main notification UI component
│   │
│   ├── hooks/
│   │   ├── useRealtimeNotifications.ts   # WebSocket hook (basic)
│   │   ├── useEnhancedRealtimeNotifications.ts  # WebSocket hook (mobile-optimized)
│   │   ├── useNotifications.ts           # React Query hooks for REST API
│   │   ├── useNotificationPermission.ts  # Permission handling
│   │   └── usePushNotifications.ts       # Push notification setup
│   │
│   ├── utils/
│   │   └── notificationPermissions.ts    # Permission utilities & device detection
│   │       ├── isNotificationSupported()
│   │       ├── requestNotificationPermission()
│   │       ├── registerServiceWorker()
│   │       ├── getDeviceType()
│   │       ├── isMobileDevice()
│   │       ├── logNotificationCapabilities()
│   │       └── vibrate()
│   │
│   └── store/
│       └── auth.ts                       # Zustand store with user info
│
├── public/
│   ├── sw.js / sw-enhanced.js            # Service worker for offline support
│   ├── manifest.json                     # PWA manifest for mobile install
│   ├── notification-sound.mp3            # Notification sound
│   └── icons/                            # App icons for different sizes
│
└── .env.local
    ├── NEXT_PUBLIC_API_URL=http://localhost:8000
    └── NEXT_PUBLIC_WS_URL=ws://localhost:8000/api
```

### Backend

```
Primis/college-prep-platform/backend/
├── app/
│   ├── api/
│   │   ├── enhanced_notifications.py     # WebSocket + REST endpoints
│   │   ├── notifications.py              # Legacy REST endpoints
│   │   └── browser_notifications.py      # Browser notification endpoints
│   │
│   ├── services/
│   │   ├── real_time_notification_service.py  # WebSocket connection manager
│   │   ├── notification_service.py            # Business logic
│   │   └── enhanced_email_service.py          # Email notifications
│   │
│   ├── models/
│   │   ├── notification_models.py        # Notification, Preference, Log tables
│   │   └── browser_notification_models.py
│   │
│   └── core/
│       └── database.py                   # Database session management
│
└── alembic/versions/
    ├── e65cd20c446e_add_notification_system_tables.py
    └── e03b363c41ca_add_browser_notification_system.py
```

---

## 💡 Usage Examples

### Example 1: Send Notification from Backend

**Route Handler:**
```python
# backend/app/api/enhanced_notifications.py

@router.post("/send")
async def send_notification(
    request: SendNotificationRequest,
    current_user = Depends(get_current_user),
    background_tasks: BackgroundTasks = None,
    db: Session = Depends(get_db)
):
    """Send notification to a user"""
    
    # Save to database
    notification = Notification(
        user_id=request.user_id,
        notification_type=request.notification_type,
        title=request.title,
        message=request.message,
        priority=request.priority,
        metadata=request.metadata
    )
    db.add(notification)
    db.commit()
    
    # Broadcast via WebSocket in real-time
    await real_time_notification_service.broadcast_to_user(
        user_id=request.user_id,
        message={
            "type": "notification",
            "notification_type": request.notification_type,
            "title": request.title,
            "message": request.message,
            "priority": request.priority,
            "metadata": request.metadata,
            "timestamp": datetime.now().isoformat(),
            "id": notification.notification_id
        }
    )
    
    # Send email if requested
    if request.send_email:
        background_tasks.add_task(
            enhanced_email_service.send_notification_email,
            request.user_id,
            request.title,
            request.message
        )
    
    return {"status": "sent", "notification_id": notification.notification_id}
```

**Usage:**
```bash
curl -X POST http://localhost:8000/api/v1/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "user_id": 1,
    "notification_type": "assignment",
    "title": "New Assignment Posted",
    "message": "Math homework - Chapter 5",
    "priority": "high",
    "metadata": {"course_id": 101, "assignment_id": 456}
  }'
```

### Example 2: Listen for Notifications in Component

```typescript
// src/components/MyComponent.tsx

import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications'

export function MyComponent() {
  const { isConnected, connectionError } = useRealtimeNotifications({
    enabled: true,
    showToasts: true,
    onNotification: (notification) => {
      console.log('Received:', notification)
      // Do something custom here
    }
  })
  
  return (
    <div>
      {isConnected ? (
        <p>🟢 Connected to notifications</p>
      ) : (
        <p>🔴 Disconnected - {connectionError}</p>
      )}
    </div>
  )
}
```

### Example 3: Query Notifications with React Query

```typescript
// src/hooks/useNotifications.ts

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: ['notifications', { unreadOnly }],
    queryFn: async () => {
      const response = await api.get('/notifications', {
        params: { unread_only: unreadOnly, limit: 50, offset: 0 }
      })
      return response.data
    },
    staleTime: 1000 * 60 * 5,  // 5 minutes
    refetchInterval: 1000 * 30, // 30 seconds (fallback polling)
  })
}

export function useNotificationCount() {
  return useQuery({
    queryKey: ['notificationCount'],
    queryFn: async () => {
      const response = await api.get('/notifications/count')
      return response.data
    },
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 30, // 30 seconds
  })
}
```

### Example 4: Request Notification Permissions

```typescript
// In any component or effect

import { 
  requestNotificationPermission,
  registerServiceWorker,
  logNotificationCapabilities
} from '@/utils/notificationPermissions'

useEffect(() => {
  async function initNotifications() {
    // Log capabilities
    logNotificationCapabilities()
    
    // Register service worker
    const registration = await registerServiceWorker()
    console.log('Service worker registered:', registration)
    
    // Request permission
    const permission = await requestNotificationPermission()
    console.log('Permission:', permission)
  }
  
  initNotifications()
}, [])
```

---

## 🔍 Testing the System

### Local Testing Checklist

```bash
# 1. Start Backend
cd c:\Users\tubul\OneDrive\Documents\Primis\college-prep-platform
docker-compose up -d

# 2. Start Frontend
cd c:\Users\tubul\Primis-Frontend
npm run dev

# 3. Test WebSocket Connection (browser console)
const ws = new WebSocket('ws://localhost:8000/api/v1/notifications/1')
ws.onopen = () => console.log('✅ Connected!')
ws.onmessage = (e) => console.log('📨 Message:', e.data)

# 4. Send test notification (backend)
curl -X POST http://localhost:8000/api/v1/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "notification_type": "test",
    "title": "Test Notification",
    "message": "This is a test",
    "priority": "high"
  }'

# 5. Check notifications in UI
# - Open http://localhost:3000
# - Click notification bell
# - Should see the test notification
```

---

## 🎯 Key Takeaways

| Aspect | Details |
|--------|---------|
| **Real-Time Protocol** | WebSocket (ws:// for local, wss:// for production) |
| **Connection Heartbeat** | Every 30s (desktop) / 45s (mobile) |
| **Max Reconnect Attempts** | 5 (desktop) / 8 (mobile) |
| **Backoff Strategy** | Exponential (3s × attempt number) |
| **Fallback** | React Query polling every 30s if WebSocket unavailable |
| **Notification Display** | Browser notifications + in-app toasts |
| **Mobile Support** | PWA with Service Worker + vibration + badge |
| **iOS Support** | Limited (Safari doesn't support Notification API) |
| **Data Persistence** | PostgreSQL with full notification history |
| **User Preferences** | Configurable quiet hours, channels, notification types |
| **Security** | Optional JWT token in WebSocket connection string |
| **Scaling** | Each user can have multiple connections (tabs/windows) |

---

## 📚 Related Documentation

- `README_REALTIME_NOTIFICATIONS.md` - Quick start guide
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `MOBILE_DESKTOP_REALTIME_NOTIFICATIONS.md` - Device-specific features
- `DEPLOYMENT_REALTIME_NOTIFICATIONS.md` - Production deployment
- `TESTING_REALTIME_NOTIFICATIONS.md` - Testing procedures
- `ARCHITECTURE_REFERENCE.md` - Technical reference

---

**Last Updated:** November 14, 2025  
**Status:** Production Ready ✅

