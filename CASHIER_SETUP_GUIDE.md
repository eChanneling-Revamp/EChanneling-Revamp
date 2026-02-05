# Cashier Role Implementation Guide

## Overview

A complete cashier role system has been implemented with local authentication, allowing hospital administrators to create and manage cashier accounts.

## Features Implemented

### 1. Database Schema

- **Location**: `prisma/schema.prisma`
- **Model**: `Cashier`
- **Fields**:
  - `id`: Unique identifier (CUID)
  - `name`: Cashier's full name
  - `email`: Unique email address (used for login)
  - `password`: Hashed password (bcrypt with 10 salt rounds)
  - `phonenumber`: Contact number
  - `age`: Age (optional)
  - `gender`: Gender (optional)
  - `nic`: National Identity Card number (optional)
  - `profileImage`: Profile picture URL (optional)
  - `isActive`: Account status (default: true)
  - `hospitalId`: Associated hospital ID
  - `createdAt`: Account creation timestamp
  - `updatedAt`: Last update timestamp

### 2. Authentication System

#### Password Hashing

- **Library**: bcryptjs
- **Salt Rounds**: 10
- **Implementation**: Passwords are hashed before storage in the database

#### Login Flow

- **Endpoint**: `/api/auth/cashier-login`
- **Method**: POST
- **Payload**:
  ```json
  {
    "email": "cashier@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "cashier@example.com",
      "role": "cashier",
      "hospitalId": "...",
      "hospitalName": "City Hospital",
      "profileImage": "..."
    },
    "token": "jwt-token-here"
  }
  ```

#### JWT Token

- **Expiry**: 7 days
- **Payload**:
  - `id`: Cashier ID
  - `email`: Cashier email
  - `role`: "cashier"
  - `hospitalId`: Hospital ID

#### Cookies Set on Login

1. **authToken** (httpOnly): Contains JWT for authentication
2. **user**: Contains user data (accessible to client-side code)

### 3. Cashier Management

#### Create Cashier

- **Location**: `/hospital/staff/add` (Cashier tab)
- **Access**: Hospital role only
- **Process**:
  1. Fill in cashier details (name, email, phone, age, gender, NIC)
  2. System generates a random secure password
  3. Password is hashed and stored in database
  4. Email is sent to cashier with login credentials
  5. Cashier can use email/password to login

#### List/Manage Cashiers

- **Location**: `/hospital/staff` (Cashier tab)
- **Features**:
  - View all cashiers for your hospital
  - Search/filter cashiers
  - Delete cashiers
  - View cashier details

### 4. Cashier Dashboard

- **Location**: `/cashier`
- **Access**: Cashier role only
- **Features**:
  - Welcome message with cashier name
  - Statistics cards:
    - Today's Appointments
    - Pending Patients
    - Completed Today
    - Hospital Name
  - Quick Actions:
    - Create New Appointment (links to `/cashier/appointments/create`)
    - View All Appointments (links to `/cashier/appointments`)
  - Recent Activity section

### 5. API Endpoints

#### POST /api/hospital/cashier

Create a new cashier account

- **Auth**: Hospital role required
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "plain-text-password",
    "phonenumber": "+1234567890",
    "age": 30,
    "gender": "Male",
    "nic": "123456789V",
    "profileImage": "https://...",
    "hospitalId": "hospital-id"
  }
  ```

#### GET /api/hospital/cashier

List all cashiers for the logged-in hospital

#### GET /api/hospital/cashier/[id]

Get details of a specific cashier

#### PUT /api/hospital/cashier/[id]

Update cashier details

#### DELETE /api/hospital/cashier/[id]

Delete a cashier account

#### POST /api/auth/cashier-login

Authenticate a cashier

- **Body**:
  ```json
  {
    "email": "cashier@example.com",
    "password": "password123"
  }
  ```

### 6. Login System Integration

#### Updated Login Form

- **Location**: `src/components/login-form.tsx`
- **Changes**:
  - Attempts cashier login first when user tries to login
  - If cashier login fails (404/401), falls back to external auth API
  - Routes cashier users to `/cashier` dashboard

#### Middleware

- **Location**: `src/middleware.ts`
- **Changes**:
  - Added cashier role to `roleRoutes`
  - Cashier role has access to `/cashier` routes

#### Role Protection Hook

- **Location**: `src/hooks/useRoleProtection.tsx`
- **Changes**:
  - Added "cashier" to allowed UserRole types

## Usage Guide

### For Hospital Administrators

#### Creating a Cashier Account

1. Login as hospital admin
2. Navigate to `/hospital/staff/add`
3. Click on the "Cashier" tab
4. Fill in the form:
   - **Required**: Name, Email, Phone Number, Age, Gender, NIC
   - **Optional**: Profile Image
5. Click "Add Cashier"
6. System will:
   - Generate a secure password
   - Create the account
   - Send credentials to the cashier's email
7. Cashier can now login using their email and the password sent to them

#### Managing Cashiers

1. Navigate to `/hospital/staff`
2. Click on the "Cashier" tab
3. You can:
   - Search cashiers by name, email, or phone
   - View cashier details
   - Delete cashier accounts

### For Cashiers

#### First Time Login

1. Check your email for login credentials
2. Go to the login page
3. Enter your email and the password from the email
4. You'll be redirected to `/cashier` dashboard

#### Dashboard Features

- View today's appointment statistics
- Access quick actions for creating appointments
- View recent activity

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **JWT Authentication**: Secure token-based authentication
3. **HttpOnly Cookies**: Auth token stored in httpOnly cookie to prevent XSS
4. **Role-Based Access Control**: Middleware ensures only authorized users access protected routes
5. **Hospital Validation**: Hospital admins can only create cashiers for their own hospital
6. **Email Uniqueness**: Each email can only be used once across all cashiers

## Database Migration

The schema has been pushed to the database. If you need to re-migrate:

```bash
npx prisma db push
npx prisma generate
```

## Testing

### Test Cashier Creation

1. Login as a hospital admin
2. Create a test cashier with your own email
3. Check your email for credentials
4. Logout
5. Login with cashier credentials
6. Verify you land on `/cashier` dashboard

### Test Authentication

- Try logging in with incorrect password (should fail)
- Try logging in with non-existent email (should fall back to external auth)
- Verify JWT token is set in cookies
- Verify user data is accessible in localStorage

## Next Steps (Optional Enhancements)

1. **Appointment Management**: Implement `/cashier/appointments/create` and `/cashier/appointments` pages
2. **Password Reset**: Add password reset functionality for cashiers
3. **Profile Management**: Allow cashiers to update their own profile
4. **Activity Logging**: Track cashier actions for audit purposes
5. **Statistics**: Implement real statistics for the dashboard cards
6. **Notifications**: Add real-time notifications for cashiers

## File Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── cashier/
│   │   │   └── page.tsx              # Cashier dashboard
│   │   └── hospital/
│   │       └── staff/
│   │           ├── add/
│   │           │   └── page.tsx      # Add cashier form
│   │           └── page.tsx          # List cashiers
│   └── api/
│       ├── auth/
│       │   └── cashier-login/
│       │       └── route.ts          # Cashier login endpoint
│       └── hospital/
│           └── cashier/
│               ├── route.ts          # Create/List cashiers
│               └── [id]/
│                   └── route.ts      # Get/Update/Delete cashier
├── components/
│   └── login-form.tsx                # Updated login form
├── hooks/
│   └── useRoleProtection.tsx         # Role protection hook
└── middleware.ts                     # Updated middleware

prisma/
└── schema.prisma                     # Cashier model
```

## Troubleshooting

### Cashier can't login

- Verify the email and password are correct
- Check if the cashier account is active (`isActive: true`)
- Check browser console for errors
- Verify cookies are being set

### Email not received

- Check spam folder
- Verify email configuration in `/api/email/send-credentials`
- Check server logs for email sending errors

### Dashboard not loading

- Verify JWT token is valid
- Check if user role is correctly set to "cashier"
- Check browser console for errors
- Verify middleware is allowing access to `/cashier` route

### Can't create cashier

- Verify you're logged in as hospital admin
- Check if email is already in use
- Verify all required fields are filled
- Check API logs for specific errors
