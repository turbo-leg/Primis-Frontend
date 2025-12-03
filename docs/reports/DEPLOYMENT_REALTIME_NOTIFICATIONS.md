# 🚀 Real-Time Notifications - Deployment & Production Setup

## Quick Reference

### **Current Setup Summary:**
| Component | Technology | Status | Location |
|-----------|-----------|--------|----------|
| **Frontend** | Next.js 15.5.4 + React 18 | ✅ Running | Vercel |
| **Backend** | FastAPI + Python | ✅ Running | Render |
| **WebSocket** | Native Web API | ✅ Configured | ws://localhost:8000 |
| **Service Worker** | Browser Native | ✅ Available | /public/sw.js |
| **PWA Support** | Web App Manifest | ✅ Available | /public/manifest.json |
| **Mobile Support** | Responsive Design | ✅ Available | All browsers |

---

## Environment Variables Configuration

### **Local Development (.env.local)**

Already configured:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Primis EduCare
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS=true
```

### **Production on Vercel**

Update `deployment/vercel.json`:
```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://primis-full-stack-1.onrender.com",
    "NEXT_PUBLIC_WS_URL": "wss://primis-full-stack-1.onrender.com/api",
    "NEXT_PUBLIC_APP_NAME": "College Prep Platform",
    "NEXT_PUBLIC_APP_VERSION": "1.0.0",
    "NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS": "true"
  }
}
```

Or set in Vercel Dashboard:
1. Go to Project Settings > Environment Variables
2. Add each variable above
3. Apply to Production, Preview, and Development

### **Production on Render (Backend)**

The backend already has WebSocket support configured. Ensure:

1. **Dockerfile** has proper EXPOSE and CMD
2. **uvicorn** is running with WebSocket support (already configured)
3. **CORS** is properly configured for WebSocket

Backend URL: `https://primis-full-stack-1.onrender.com`
WebSocket URL: `wss://primis-full-stack-1.onrender.com/api`

---

## Files Added/Modified

### ✅ **New Files Created:**

1. **`public/manifest.json`** - PWA manifest for mobile app install
2. **`public/sw-enhanced.js`** - Enhanced service worker with desktop/mobile support
3. **`src/utils/notificationPermissions.ts`** - Notification permission utilities
4. **`src/hooks/useEnhancedRealtimeNotifications.ts`** - Mobile-optimized WebSocket hook
5. **`MOBILE_DESKTOP_REALTIME_NOTIFICATIONS.md`** - This implementation guide

### 🔄 **Files to Update:**

1. **`public/sw.js`** - Replace with `sw-enhanced.js` content
2. **`src/components/NotificationBell.tsx`** - Optional: Use enhanced hook
3. **`next.config.js`** - Add manifest.json support if needed
4. **`src/app/layout.tsx`** - Add manifest link

---

## Step-by-Step Implementation

### **Step 1: Update Service Worker**

Replace `/public/sw.js` with enhanced version:

```bash
# Copy enhanced service worker to main location
cp /public/sw-enhanced.js /public/sw.js
```

Or manually update:
```javascript
// In public/sw.js, replace all content with content from sw-enhanced.js
```

### **Step 2: Register Manifest in HTML Head**

Add to `src/app/layout.tsx` or your root layout:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Existing meta tags */}
        
        {/* Add PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Primis" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

### **Step 3: Update NotificationBell Component (Optional)**

To use the enhanced hook with mobile optimizations:

```tsx
'use client'

import { useEnhancedRealtimeNotifications } from '@/hooks/useEnhancedRealtimeNotifications'
// ... rest of component
```

### **Step 4: Update Vercel Configuration**

Edit `deployment/vercel.json`:

```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://primis-full-stack-1.onrender.com",
    "NEXT_PUBLIC_WS_URL": "wss://primis-full-stack-1.onrender.com/api",
    "NEXT_PUBLIC_APP_NAME": "College Prep Platform",
    "NEXT_PUBLIC_APP_VERSION": "1.0.0",
    "NEXT_PUBLIC_ENABLE_REALTIME_NOTIFICATIONS": "true"
  },
  "buildCommand": "next build && next-sitemap",
  "outputDirectory": ".next"
}
```

---

## Testing Locally

### **Test 1: Service Worker Registration**

```javascript
// In browser console (F12)
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    console.log('Service Workers:', registrations)
    registrations.forEach(reg => {
      console.log('- Scope:', reg.scope)
      console.log('- Active:', reg.active ? 'Yes' : 'No')
      console.log('- Waiting:', reg.waiting ? 'Yes' : 'No')
      console.log('- Installing:', reg.installing ? 'Yes' : 'No')
    })
  })
```

### **Test 2: Manifest Loading**

```javascript
// In browser console
fetch('/manifest.json')
  .then(r => r.json())
  .then(manifest => console.log('Manifest:', manifest))
```

### **Test 3: WebSocket Connection**

```javascript
// In browser console
const ws = new WebSocket('ws://localhost:8000/api/v1/notifications/ws/1?token=YOUR_TOKEN')
ws.onopen = () => console.log('✅ WebSocket connected')
ws.onmessage = (e) => console.log('📨 Message:', e.data)
ws.onerror = (e) => console.error('❌ Error:', e)
ws.onclose = () => console.log('🔌 Disconnected')
```

### **Test 4: Notification Permission**

```javascript
// In browser console
Notification.requestPermission()
  .then(permission => console.log('Permission:', permission))

// Then test notification
if (Notification.permission === 'granted') {
  new Notification('Test', {
    body: 'This is a test notification',
    icon: '/logo.png'
  })
}
```

### **Test 5: Mobile Testing**

Use Chrome DevTools:
1. Open DevTools (F12)
2. Click Device Toolbar (Ctrl+Shift+M)
3. Select a mobile device
4. Refresh page
5. Test notification permission and WebSocket connection

Or test on actual phone:
1. Connect to same network as dev machine
2. Use `npm run dev -- --host` to expose frontend
3. Visit `http://YOUR_IP:3000` on mobile device
4. Test WebSocket and notifications

---

## Production Deployment Checklist

### **Backend (Render)**

- [ ] Verify backend health: `curl https://primis-full-stack-1.onrender.com/api/health`
- [ ] Check WebSocket endpoint: `curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" https://primis-full-stack-1.onrender.com/api/v1/notifications/ws/1`
- [ ] Verify CORS headers for WebSocket
- [ ] Check environment variables on Render dashboard
- [ ] Verify SSL certificate (wss:// support)
- [ ] Monitor backend logs for WebSocket errors

### **Frontend (Vercel)**

- [ ] Update environment variables in Vercel dashboard
- [ ] Deploy new version with updated files
- [ ] Verify `vercel.json` has correct env vars
- [ ] Check that `public/manifest.json` is deployed
- [ ] Check that `public/sw.js` is deployed
- [ ] Test notifications on production URL

### **CORS Configuration**

Ensure backend has CORS configured for WebSocket:

```python
# In FastAPI backend (app/main.py)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",           # Local dev
        "https://*.vercel.app",            # Vercel preview deployments
        "https://your-production-domain",  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)
```

---

## Monitoring & Debugging

### **Browser Console Logs**

When connected, you should see:
```
✅ [WebSocket] Connected successfully
📨 Real-time notification received: {...}
🟢 Green Wifi icon in notification bell = real-time connected
```

### **Service Worker Debugging**

Chrome DevTools:
1. DevTools > Application > Service Workers
2. Should see `/sw.js` as "activated and running"
3. Check "Update on reload" if debugging

### **Network Tab Analysis**

1. DevTools > Network > WS (WebSocket tab)
2. Should see active WebSocket connection
3. Messages shown in "Messages" column
4. Green circle = active connection

### **Common Issues**

**Issue: WebSocket won't connect in production**
- Solution: Check `NEXT_PUBLIC_WS_URL` in Vercel env vars
- Ensure it's `wss://` not `ws://`
- Check backend CORS configuration

**Issue: Service Worker not registered**
- Solution: Check `manifest.json` is in public folder
- Ensure layout.tsx has manifest link
- Try `navigator.serviceWorker.getRegistrations()` in console

**Issue: Notifications work locally but not in production**
- Solution: Check notification permission is granted
- Verify service worker is active
- Check backend is sending notifications correctly

**Issue: Mobile app won't install as PWA**
- Solution: Ensure manifest.json is valid JSON
- Check all required fields are present
- Verify manifest link in HTML head
- HTTPS is required for PWA on production

---

## Optimization Tips

### **For Mobile Users**

1. Adaptive reconnection delay based on network type
2. Reduce notification frequency on poor networks
3. Batch notifications on slow connections
4. Respect data saver mode
5. Use vibration for important notifications instead of sound

### **For Desktop Users**

1. Higher reconnection attempts
2. Desktop notification actions (Open/Dismiss)
3. Badge count on app icon
4. Sound and visual alerts

### **For Both**

1. Heartbeat every 30-45 seconds to keep connection alive
2. Automatic reconnection with exponential backoff
3. Service worker for offline support
4. Toast notifications in addition to browser notifications

---

## Verification Commands

### **Test Backend WebSocket Health**

```bash
# Terminal
curl -i -N \
  -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
  -H "Sec-WebSocket-Version: 13" \
  https://primis-full-stack-1.onrender.com/api/v1/notifications/ws/1
```

### **Test Frontend Deployment**

```bash
# Terminal
curl -I https://your-vercel-domain.vercel.app
# Should see Cache headers and manifest link

# Check for manifest.json
curl https://your-vercel-domain.vercel.app/manifest.json
```

### **Test Service Worker**

```javascript
// Browser console
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    if (registrations.length) {
      console.log('✅ Service Worker registered')
      registrations[0].update() // Force update check
    } else {
      console.warn('❌ No service worker registered')
    }
  })
```

---

## Summary

**What's Deployed:**
- ✅ WebSocket real-time notifications (ws:/wss://)
- ✅ Service Worker for offline support
- ✅ PWA Manifest for mobile app install
- ✅ Browser Notification API support
- ✅ Mobile & Desktop optimizations

**URLs in Production:**
- **Frontend:** https://your-vercel-domain.vercel.app
- **Backend:** https://primis-full-stack-1.onrender.com
- **WebSocket:** wss://primis-full-stack-1.onrender.com/api/v1/notifications/ws/{user_id}

**Next Steps:**
1. Update Vercel environment variables
2. Deploy frontend with new files
3. Test on production URLs
4. Monitor backend logs
5. Gather user feedback

