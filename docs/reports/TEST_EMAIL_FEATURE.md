# Test Email Feature

This document describes the new "Test Email" feature added to the Admin Dashboard.

## Overview

A hidden page has been added to the Admin Dashboard to allow administrators to manually trigger test emails. This is useful for verifying SMTP configuration and checking email templates.

## Access

The page is accessible at:
`/dashboard/admin/test-email`

**Note:** This page is not linked in the main navigation menu to keep it hidden from casual view, but it is protected and requires Admin authentication.

## Features

The page allows you to send the following types of emails to any specified email address:

1.  **Welcome Email**: Simulates the email sent to new users upon registration.
2.  **Verification Email**: Simulates the email sent to verify a user's email address.
3.  **Password Reset**: Simulates the password reset request email.
4.  **Announcement**: Simulates a course announcement email.

## Usage

1.  Navigate to `/dashboard/admin/test-email`.
2.  Enter the **Recipient Email** address.
3.  Select the **Template Type** from the dropdown.
4.  Click **Send Test Email**.

## Backend Implementation

-   **Endpoint**: `POST /api/v1/admin/test-email`
-   **Controller**: `backend/app/api/email_routes.py`
-   **Service**: `backend/app/services/enhanced_email_service.py`

## Troubleshooting

If emails are not being received:
1.  Check the backend logs for SMTP errors.
2.  Verify the SMTP configuration in the `.env` file (`SMTP_USER`, `SMTP_PASSWORD`, etc.).
3.  Ensure the backend container is running and can reach the SMTP server.
