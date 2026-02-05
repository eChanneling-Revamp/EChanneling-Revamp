# Cashier Login Implementation Guide

## Overview

The login system now has **two separate authentication panels**: Normal Login and Cashier Login.

## Features

### 1. Login Type Selection

- **Normal Login (👤)**: For doctors, nurses, patients, hospitals, and admin users
  - Uses external authentication API
  - Supports both Password and OTP login methods
  - Redirects to external auth for account creation

- **Cashier Login (💼)**: For hospital cashier staff
  - Uses local authentication with bcrypt
  - Password-only login (no OTP)
  - Displays "Cashier Email" label
  - Shows green info banner with instructions

### 2. Visual Design

- **Login Type Tabs**:
  - Gradient background (blue to green)
  - Icons for visual distinction
  - Active state: white background with colored border and shadow
  - Hover state: semi-transparent white background

- **Authentication Method Toggle** (Normal Login only):
  - Password or OTP selection
  - Only visible for Normal Login
  - Hidden for Cashier Login

### 3. Authentication Flow

#### Normal Login Flow:

1. User selects "Normal Login" tab
2. Choose authentication method (Password/OTP)
3. For Password:
   - Enter email and password
   - Calls `/api/external-auth/login`
   - Redirects based on user role
4. For OTP:
   - Enter phone number
   - Calls `/api/external-auth/send-otp`
   - Enter 6-digit OTP code
   - Calls `/api/external-auth/verify-otp`

#### Cashier Login Flow:

1. User selects "Cashier Login" tab
2. Green info banner appears with instructions
3. Enter cashier email (label shows "Cashier Email")
4. Enter password
5. Calls `/api/auth/cashier-login`
6. Redirects to `/cashier` dashboard

### 4. State Management

```typescript
const [loginType, setLoginType] = useState<"normal" | "cashier">("normal");
const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
```

### 5. Form Rendering Logic

```typescript
// Show password form for Cashier OR Normal Password login
{(loginType === "cashier" || loginMethod === "password") ? (
  // Email + Password fields
) : (
  // Phone number field for OTP
)}
```

### 6. Submit Handler Logic

```typescript
if (loginType === "cashier") {
  // Local cashier authentication
  await axios.post("/api/auth/cashier-login", { email, password });
} else {
  // External authentication
  if (loginMethod === "password") {
    await axios.post("/api/external-auth/login", { username: email, password });
  } else {
    await axios.post("/api/external-auth/send-otp", {
      phone_number: phoneNumber,
    });
  }
}
```

## API Endpoints

### Cashier Authentication

- **POST** `/api/auth/cashier-login`
  - Request: `{ email, password }`
  - Response: `{ success, user: { id, name, email, role: "cashier", hospitalId, hospitalName }, token }`

### External Authentication

- **POST** `/api/external-auth/login`
  - Request: `{ username, password }`
  - Response: `{ user: { name, email, phone, role, ... }, token }`

- **POST** `/api/external-auth/send-otp`
  - Request: `{ phone_number }`
  - Response: Success/error message

- **POST** `/api/external-auth/verify-otp`
  - Request: `{ phone_number, otp_code }`
  - Response: `{ user: { ... }, token }`

## User Experience

### Normal Users

1. See familiar login interface
2. Can choose Password or OTP
3. External authentication handled seamlessly
4. Role-based dashboard redirection

### Cashiers

1. Clear visual distinction with "Cashier Login" tab
2. Green-themed UI elements
3. Helpful info banner
4. Direct password login
5. Automatic redirect to `/cashier` dashboard

## Security Features

- Separate authentication systems
- No cross-contamination between auth methods
- Cashier passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiry
- Hospital-specific cashier isolation

## Dashboard Redirections

### Normal Login:

- Admin/Super Admin → `/admin/dashboard`
- Doctor → `/doctor/dashboard` or `/doctor-setup` (if new)
- Hospital → `/hospital/dashboard` or `/hospital/setup` (if new)
- Nurse/Patient/User → `/user/dashboard`

### Cashier Login:

- Always → `/cashier` dashboard

## Testing Checklist

- [ ] Normal login with password works
- [ ] Normal login with OTP works
- [ ] Cashier login with valid credentials works
- [ ] Cashier login with invalid credentials shows error
- [ ] Login type tabs switch correctly
- [ ] Login method toggle only appears for normal login
- [ ] Info banner only appears for cashier login
- [ ] Proper redirects for all user roles
- [ ] Token storage in localStorage and cookies
- [ ] Hospital ID included in cashier user data

## File Modifications

- `src/components/login-form.tsx`: Added login type selection, conditional rendering, separate auth flows
- `src/app/api/auth/cashier-login/route.ts`: Cashier authentication endpoint
- `src/app/api/auth/magic-login/route.ts`: Updated to include hospitalId for cashiers
- `prisma/schema.prisma`: Cashier model with password field

## Future Enhancements

- [ ] Remember me functionality for cashiers
- [ ] Password reset for cashiers
- [ ] 2FA for cashier accounts
- [ ] Session timeout warnings
- [ ] Login attempt rate limiting
