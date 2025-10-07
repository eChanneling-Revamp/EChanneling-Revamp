/**
 * Application-wide constants
 * Centralized constants for roles, statuses, and other app-wide values
 */

// User roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  HOSPITAL: 'HOSPITAL',
  DOCTOR: 'DOCTOR',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// User statuses
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

// Hospital statuses
export const HOSPITAL_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
} as const;

export type HospitalStatus = typeof HOSPITAL_STATUS[keyof typeof HOSPITAL_STATUS];

// Doctor statuses
export const DOCTOR_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED',
  REJECTED: 'REJECTED',
} as const;

export type DoctorStatus = typeof DOCTOR_STATUS[keyof typeof DOCTOR_STATUS];

// General statuses
export const STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type Status = typeof STATUS[keyof typeof STATUS];

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  MOBILE_PAYMENT: 'MOBILE_PAYMENT',
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

// Fee types
export const FEE_TYPES = {
  CONSULTATION: 'CONSULTATION',
  REGISTRATION: 'REGISTRATION',
  PROCESSING: 'PROCESSING',
  OTHER: 'OTHER',
} as const;

export type FeeType = typeof FEE_TYPES[keyof typeof FEE_TYPES];

// Discount types
export const DISCOUNT_TYPES = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
} as const;

export type DiscountType = typeof DISCOUNT_TYPES[keyof typeof DISCOUNT_TYPES];

// Invoice statuses
export const INVOICE_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
} as const;

export type InvoiceStatus = typeof INVOICE_STATUS[keyof typeof INVOICE_STATUS];

// Languages supported
export const LANGUAGES = {
  EN: 'en',
  SI: 'si',
  TA: 'ta',
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

// Default language
export const DEFAULT_LANGUAGE = LANGUAGES.EN;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// File upload limits
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

// Email templates
export const EMAIL_TEMPLATES = {
  DOCTOR_VERIFICATION: 'doctor-verification',
  INVOICE_GENERATED: 'invoice-generated',
  PAYMENT_CONFIRMATION: 'payment-confirmation',
  PASSWORD_RESET: 'password-reset',
  WELCOME: 'welcome',
} as const;

// Kafka topics
export const KAFKA_TOPICS = {
  USER_CREATED: 'user-created-successful',
  USER_UPDATED: 'user-updated-successful',
  DOCTOR_VERIFIED: 'doctor-verified',
  INVOICE_GENERATED: 'invoice-generated',
  PAYMENT_COMPLETED: 'payment-completed',
  EMAIL_SENT: 'email-successful',
  AUDIT_LOG: 'audit-log-created',
} as const;

// Audit log actions
export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  VERIFY: 'VERIFY',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  PAYMENT: 'PAYMENT',
  EXPORT: 'EXPORT',
} as const;

export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];

// Audit log entity types
export const AUDIT_ENTITY_TYPES = {
  USER: 'USER',
  HOSPITAL: 'HOSPITAL',
  DOCTOR: 'DOCTOR',
  SPECIALIZATION: 'SPECIALIZATION',
  HOSPITAL_FUNCTION: 'HOSPITAL_FUNCTION',
  CORPORATE_AGENT: 'CORPORATE_AGENT',
  PAYMENT: 'PAYMENT',
  FEE: 'FEE',
  DISCOUNT: 'DISCOUNT',
  BRANCH: 'BRANCH',
  INVOICE: 'INVOICE',
} as const;

export type AuditEntityType = typeof AUDIT_ENTITY_TYPES[keyof typeof AUDIT_ENTITY_TYPES];

// API response messages
export const API_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+94|0)[0-9]{9}$/,
  LICENSE_NUMBER: /^[A-Z]{2}[0-9]{6}$/,
  REGISTRATION_NUMBER: /^[A-Z]{2}[0-9]{8}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
} as const;

// Currency
export const CURRENCY = {
  DEFAULT: 'LKR',
  SYMBOL: 'Rs.',
} as const;

// Time zones
export const TIMEZONE = {
  DEFAULT: 'Asia/Colombo',
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
} as const;

// Cache keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user:profile:',
  HOSPITAL_LIST: 'hospitals:list',
  DOCTOR_LIST: 'doctors:list',
  SPECIALIZATIONS: 'specializations:list',
  DASHBOARD_STATS: 'dashboard:stats',
} as const;

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

// Rate limiting
export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW: 900, // 15 minutes
  API_REQUESTS: 100,
  API_WINDOW: 900, // 15 minutes
} as const;

// Security
export const SECURITY = {
  JWT_EXPIRES_IN: '24h',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  PASSWORD_RESET_EXPIRES_IN: '1h',
  EMAIL_VERIFICATION_EXPIRES_IN: '24h',
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900, // 15 minutes
} as const;

// Business rules
export const BUSINESS_RULES = {
  MIN_CONSULTATION_FEE: 500,
  MAX_CONSULTATION_FEE: 10000,
  DEFAULT_CONSULTATION_DURATION: 30, // minutes
  MAX_APPOINTMENTS_PER_DAY: 50,
  INVOICE_DUE_DAYS: 30,
  PAYMENT_TIMEOUT_MINUTES: 15,
} as const;
