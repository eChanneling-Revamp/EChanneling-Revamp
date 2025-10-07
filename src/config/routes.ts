/**
 * Route constants for all API endpoints
 * Centralized route management for consistency
 */

// Base API routes
export const API_ROUTES = {
  BASE: '/api',
  AUTH: '/api/auth',
  ADMIN: '/api/admin',
  USER: '/api/user',
  DOCTOR: '/api/doctor',
  HOSPITAL: '/api/hospital',
} as const;

// Authentication routes
export const AUTH_ROUTES = {
  LOGIN: '/api/auth/signin',
  LOGOUT: '/api/auth/signout',
  REGISTER: '/api/auth/register',
  SIGNUP: '/api/auth/signup',
  REFRESH: '/api/auth/refresh',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  VERIFY_EMAIL: '/api/auth/verify-email',
  CHANGE_PASSWORD: '/api/auth/change-password',
} as const;

// Admin routes
export const ADMIN_ROUTES = {
  DASHBOARD: '/api/admin/dashboard',
  HOSPITALS: '/api/admin/hospitals',
  DOCTORS: '/api/admin/doctors',
  SPECIALIZATIONS: '/api/admin/specializations',
  HOSPITAL_FUNCTIONS: '/api/admin/hospital-functions',
  CORPORATE: '/api/admin/corporate',
  PAYMENTS: '/api/admin/payments',
  FEES: '/api/admin/fees',
  DISCOUNTS: '/api/admin/discounts',
  BRANCHES: '/api/admin/branches',
  USERS: '/api/admin/users',
  INVOICES: '/api/admin/invoices',
  AUDIT_LOGS: '/api/admin/audit-logs',
} as const;

// User routes
export const USER_ROUTES = {
  PROFILE: '/api/user/profile',
  APPOINTMENTS: '/api/user/appointments',
  INVOICES: '/api/user/invoices',
  PAYMENTS: '/api/user/payments',
  NOTIFICATIONS: '/api/user/notifications',
} as const;

// Doctor routes
export const DOCTOR_ROUTES = {
  PROFILE: '/api/doctor/profile',
  SCHEDULE: '/api/doctor/schedule',
  APPOINTMENTS: '/api/doctor/appointments',
  PATIENTS: '/api/doctor/patients',
  AVAILABILITY: '/api/doctor/availability',
} as const;

// Hospital routes
export const HOSPITAL_ROUTES = {
  PROFILE: '/api/hospital/profile',
  DOCTORS: '/api/hospital/doctors',
  BRANCHES: '/api/hospital/branches',
  SCHEDULES: '/api/hospital/schedules',
  REPORTS: '/api/hospital/reports',
} as const;

// Public routes (no authentication required)
export const PUBLIC_ROUTES = {
  HOSPITALS: '/api/public/hospitals',
  DOCTORS: '/api/public/doctors',
  SPECIALIZATIONS: '/api/public/specializations',
  SEARCH: '/api/public/search',
  HEALTH_CHECK: '/api/health',
} as const;

// File upload routes
export const UPLOAD_ROUTES = {
  PROFILE_IMAGE: '/api/upload/profile-image',
  DOCUMENT: '/api/upload/document',
  INVOICE_PDF: '/api/upload/invoice-pdf',
} as const;

// Export routes
export const EXPORT_ROUTES = {
  INVOICES_CSV: '/api/export/invoices/csv',
  PAYMENTS_CSV: '/api/export/payments/csv',
  AUDIT_LOGS_CSV: '/api/export/audit-logs/csv',
  REPORTS_PDF: '/api/export/reports/pdf',
} as const;

// Webhook routes
export const WEBHOOK_ROUTES = {
  PAYMENT_SUCCESS: '/api/webhooks/payment/success',
  PAYMENT_FAILED: '/api/webhooks/payment/failed',
  EMAIL_DELIVERED: '/api/webhooks/email/delivered',
  EMAIL_BOUNCED: '/api/webhooks/email/bounced',
} as const;

// Complete routes object for easy access
export const ROUTES = {
  API: API_ROUTES,
  AUTH: AUTH_ROUTES,
  ADMIN: ADMIN_ROUTES,
  USER: USER_ROUTES,
  DOCTOR: DOCTOR_ROUTES,
  HOSPITAL: HOSPITAL_ROUTES,
  PUBLIC: PUBLIC_ROUTES,
  UPLOAD: UPLOAD_ROUTES,
  EXPORT: EXPORT_ROUTES,
  WEBHOOK: WEBHOOK_ROUTES,
} as const;

// Route parameter types
export type RouteParams = {
  [K in keyof typeof ROUTES]: Record<string, string>;
};

// Helper function to build routes with parameters
export const buildRoute = (route: string, params?: Record<string, string>): string => {
  if (!params) return route;
  
  let builtRoute = route;
  Object.entries(params).forEach(([key, value]) => {
    builtRoute = builtRoute.replace(`:${key}`, value);
  });
  
  return builtRoute;
};

// Route validation
export const isValidRoute = (route: string): boolean => {
  const allRoutes = Object.values(ROUTES).flatMap(Object.values);
  return allRoutes.includes(route);
};

// Route permissions mapping
export const ROUTE_PERMISSIONS = {
  [ADMIN_ROUTES.DASHBOARD]: ['ADMIN'],
  [ADMIN_ROUTES.HOSPITALS]: ['ADMIN'],
  [ADMIN_ROUTES.DOCTORS]: ['ADMIN'],
  [ADMIN_ROUTES.SPECIALIZATIONS]: ['ADMIN'],
  [ADMIN_ROUTES.HOSPITAL_FUNCTIONS]: ['ADMIN'],
  [ADMIN_ROUTES.CORPORATE]: ['ADMIN'],
  [ADMIN_ROUTES.PAYMENTS]: ['ADMIN'],
  [ADMIN_ROUTES.FEES]: ['ADMIN'],
  [ADMIN_ROUTES.DISCOUNTS]: ['ADMIN'],
  [ADMIN_ROUTES.BRANCHES]: ['ADMIN'],
  [ADMIN_ROUTES.USERS]: ['ADMIN'],
  [ADMIN_ROUTES.INVOICES]: ['ADMIN'],
  [ADMIN_ROUTES.AUDIT_LOGS]: ['ADMIN'],
  [USER_ROUTES.PROFILE]: ['USER', 'DOCTOR', 'HOSPITAL'],
  [DOCTOR_ROUTES.PROFILE]: ['DOCTOR'],
  [HOSPITAL_ROUTES.PROFILE]: ['HOSPITAL'],
} as const;
