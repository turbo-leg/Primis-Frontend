# Database Migration Fix Guide

## Issue Description

The error `psycopg2.errors.UndefinedColumn: column students.school_grade does not exist` occurs when the backend tries to query the `students` table. This is because the SQLAlchemy model defines columns that don't exist in the production database.

## Root Cause

The SQLAlchemy `Student` model in the backend includes these columns that might be missing from the database:
- `school_grade` - Student's school grade level
- `profile_picture` - Cloudinary URL for profile picture  
- `is_verified` - Email verification status
- `verification_token` - Token for email verification

The database migrations weren't applied to the production database.

## Solution

### Option 1: Full Database Reset (Recommended for Fresh Start)

The backend (`Primis_full_stack`) now includes a database reset script that runs automatically on deployment. To trigger this:

1. Go to your Render dashboard
2. Navigate to your backend service (`primis-full-stack-1`)
3. Click "Manual Deploy" → "Deploy latest commit"

This will:
1. Drop all existing tables (wipe the database)
2. Run all migrations from scratch
3. Create default admin user

### Option 2: Manual Database Migration

If you want to preserve existing data, run the migrations manually:

```bash
# Connect to your backend server or run locally with production DATABASE_URL
cd backend
python -m alembic upgrade head
```

### Option 3: Direct SQL Fix

If migrations fail, you can add the missing column directly:

```sql
-- Connect to your PostgreSQL database and run:
ALTER TABLE students ADD COLUMN IF NOT EXISTS school_grade VARCHAR(20);
ALTER TABLE students ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(500);
-- Note: DEFAULT true is used so existing users are considered verified
ALTER TABLE students ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT true NOT NULL;
ALTER TABLE students ADD COLUMN IF NOT EXISTS verification_token VARCHAR(100);

ALTER TABLE teachers ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(500);
ALTER TABLE admins ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(500);

ALTER TABLE parents ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(500);
ALTER TABLE parents ADD COLUMN IF NOT EXISTS password VARCHAR(255);
-- Note: DEFAULT true is used so existing users are considered verified
ALTER TABLE parents ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT true NOT NULL;
ALTER TABLE parents ADD COLUMN IF NOT EXISTS verification_token VARCHAR(100);
```

## Verifying the Fix

After applying the fix, verify by:

1. Check the backend health endpoint:
   ```bash
   curl https://primis-full-stack-1.onrender.com/api/health
   ```

2. Try logging in through the frontend at https://www.primiseducare.com

3. Check the backend logs in Render dashboard for any remaining errors

## Backend Repository

The backend code is located at: https://github.com/turbo-leg/Primis_full_stack

The relevant migration files are in `backend/alembic/versions/`:
- `add_school_grade_to_students.py` - Adds school_grade column
- `add_profile_picture_columns.py` - Adds profile_picture columns
- `f12345678902_add_verification_fields.py` - Adds verification fields
- `ensure_schema_consistency.py` - Catch-all migration ensuring all columns exist

## Notes

- This is a **backend database issue**, not a frontend issue
- The frontend code doesn't need any changes
- The fix must be applied to the `Primis_full_stack` backend repository
