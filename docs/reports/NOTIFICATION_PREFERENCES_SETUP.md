# 🔔 Notification Preferences Setup - Complete Guide

## ✅ What Has Been Done

### 1. Database Schema ✓
- **Status**: Verified and ready
- **Tables Created**:
  - `notification_preferences` - User notification preferences
  - `notifications` - Notification history
  - `notification_templates` - Email/SMS templates
  - `notification_logs` - Delivery logs
  - `notification_channels` - Channel routing
  - `browser_notification_preferences` - Browser-specific settings

- **Table Structure** (notification_preferences):
  ```sql
  - preference_id (PK)
  - user_id (FK)
  - user_type (student/teacher/admin/parent)
  - notification_type (enum: 30+ types)
  - in_app_enabled (bool)
  - email_enabled (bool)
  - sms_enabled (bool)
  - push_enabled (bool)
  - quiet_hours_start (time)
  - quiet_hours_end (time)
  - digest_mode (bool)
  - digest_frequency (daily/weekly)
  - created_at, updated_at (timestamps)
  ```

### 2. Backend API Endpoints ✓

**Notification Preferences Endpoints** (in `app/api/notifications.py`):
```
GET  /api/v1/notifications/preferences
     → Get user's notification preferences

PUT  /api/v1/notifications/preferences
     → Update preferences for specific notification type
     Request: {
       notification_type: "assignment_created",
       in_app_enabled: true,
       email_enabled: true,
       sms_enabled: false,
       push_enabled: true,
       quiet_hours_start: "22:00",
       quiet_hours_end: "08:00"
     }
```

**Admin Seeding Endpoints** (NEW - in `app/api/admin_preferences.py`):
```
POST /api/v1/admin/seed-preferences
     → Initialize default preferences for ALL users
     (Admin only - requires auth token)
     Response: {
       success: true,
       total_created: 1850,
       breakdown: {
         students: 500,
         teachers: 150,
         admins: 5,
         parents: 1195
       }
     }

GET  /api/v1/admin/preferences-stats
     → Get statistics about preferences
     (Admin only - requires auth token)
     Response: {
       total_preferences: 12345,
       users_with_preferences: 500,
       by_user_type: {...},
       by_notification_type: {...}
     }
```

### 3. Frontend Settings Page ✓

**File**: `src/app/[locale]/dashboard/settings/page.tsx`

**Features**:
- Load existing preferences on mount
- Toggle notifications by channel:
  - In-App (always ON)
  - Email (ON/OFF)
  - Push (ON/OFF)
  - SMS (optional)
- Save button that updates backend
- Success/error messages
- Multiple notification types supported

**Current Implementation**:
```typescript
// Loads preferences from API
GET /api/v1/notifications/preferences

// Saves preferences for each type
PUT /api/v1/notifications/preferences (for each notification type)
```

### 4. Backend Service Logic ✓

**NotificationService** (`app/services/notification_service.py`):
```python
# Method: update_preference()
def update_preference(
    user_id: int,
    user_type: str,
    notification_type: NotificationType,
    **settings
) -> NotificationPreference:
    """
    Updates or creates notification preference for user
    Automatically creates record if doesn't exist
    """
```

## 🚀 How to Initialize Database

### Option 1: Via API (Recommended)
```bash
# 1. Get admin login token
POST /api/v1/auth/login
Body: {
  "email": "admin@example.com",
  "password": "your_password"
}
Response: { "access_token": "token..." }

# 2. Seed all preferences (admin only)
POST /api/v1/admin/seed-preferences
Headers: {
  "Authorization": "Bearer {token}"
}

# 3. Check stats
GET /api/v1/admin/preferences-stats
Headers: {
  "Authorization": "Bearer {token}"
}
```

### Option 2: Via Database (SQL)
```sql
-- Insert default preferences for a student
INSERT INTO notification_preferences (
  user_id, user_type, notification_type,
  in_app_enabled, email_enabled, push_enabled,
  created_at, updated_at
) VALUES
(1, 'student', 'assignment_created', true, true, true, now(), now()),
(1, 'student', 'grade_posted', true, true, true, now(), now()),
(1, 'student', 'announcement', true, true, true, now(), now());
-- ... repeat for each notification type
```

## 🎯 Current Data Status

**Database**: college_prep (PostgreSQL)
- Total notification preferences: 0 (needs seeding)
- All tables exist and are properly migrated
- Schema is correct and matches models

## 📋 Testing the System

### 1. Test Preferences Endpoint
```bash
# Get preferences for current user
curl -X GET http://localhost:8000/api/v1/notifications/preferences \
  -H "Authorization: Bearer {token}"

# Update preference for assignment notifications
curl -X PUT http://localhost:8000/api/v1/notifications/preferences \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "notification_type": "assignment_created",
    "in_app_enabled": true,
    "email_enabled": false,
    "push_enabled": true
  }'
```

### 2. Test Settings Page
1. Login to frontend: http://localhost:3000
2. Go to Dashboard → Settings
3. Scroll to "Notification Preferences" section
4. Toggle email/push/SMS checkboxes
5. Click "Save Preferences"
6. Should see success message

### 3. Test Admin Seeding
```bash
# Get admin token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin_password"
  }'

# Seed preferences
curl -X POST http://localhost:8000/api/v1/admin/seed-preferences \
  -H "Authorization: Bearer {admin_token}"

# Check results
curl -X GET http://localhost:8000/api/v1/admin/preferences-stats \
  -H "Authorization: Bearer {admin_token}"
```

## 🔄 How It Works

### Notification Delivery Flow
```
1. Event Triggered (e.g., assignment created)
   ↓
2. Backend creates Notification record
   ↓
3. Backend checks user's NotificationPreference
   ↓
4. Determines which channels to send via:
   - in_app: Always (stored in DB)
   - email: If email_enabled = true
   - push: If push_enabled = true
   - sms: If sms_enabled = true
   ↓
5. Respects quiet hours if set:
   - If current time is between quiet_hours_start and quiet_hours_end
   - Skip notification (except urgent)
   ↓
6. Sends notification via selected channels
```

### Settings Page Flow
```
1. User opens Settings page
   ↓
2. Page calls GET /api/v1/notifications/preferences
   ↓
3. Backend returns all preferences for current user
   ↓
4. UI loads preferences into form (checkboxes)
   ↓
5. User toggles checkboxes
   ↓
6. User clicks "Save Preferences"
   ↓
7. For each notification type:
   PUT /api/v1/notifications/preferences
   ↓
8. Backend updates or creates preference record
   ↓
9. Success message shown to user
```

## ⚠️ Known Issues & Solutions

### Issue: No preferences data in database
**Solution**: Run the admin seeding endpoint
```bash
POST /api/v1/admin/seed-preferences (with admin token)
```

### Issue: Settings page shows empty checkboxes
**Solution**: 
1. Make sure user has preferences in database
2. Check network tab - GET /preferences should return data
3. If no data, seed preferences for user

### Issue: Preferences not updating
**Solution**:
1. Check token is valid (not expired)
2. Verify notification_type value is correct
3. Check database logs for errors

## 🎓 Next Steps

### Immediate (For Testing)
1. ✅ Seed preferences via admin endpoint
2. ✅ Test settings page updates
3. ✅ Verify preferences respect when notifications sent

### Short Term
1. Add quiet hours UI to settings page
2. Add digest mode configuration
3. Add SMS preferences handling

### Long Term
1. Per-notification-type granular settings UI
2. Quiet hours with timezone support
3. Notification digest email generation
4. Delivery statistics dashboard

## 📞 API Quick Reference

```
# Get preferences
GET /api/v1/notifications/preferences
Auth: Required

# Update preferences
PUT /api/v1/notifications/preferences
Auth: Required
Body: {
  notification_type: string,
  in_app_enabled?: bool,
  email_enabled?: bool,
  sms_enabled?: bool,
  push_enabled?: bool,
  quiet_hours_start?: string (HH:MM),
  quiet_hours_end?: string (HH:MM)
}

# Seed all users (admin only)
POST /api/v1/admin/seed-preferences
Auth: Required (admin)

# Get stats (admin only)
GET /api/v1/admin/preferences-stats
Auth: Required (admin)
```

---

**Database Status**: ✅ Ready
**API Status**: ✅ Ready
**Frontend Status**: ✅ Ready
**Overall Status**: ✅ Fully Prepared for Testing

Run admin seeding endpoint to populate initial data, then test settings page!
