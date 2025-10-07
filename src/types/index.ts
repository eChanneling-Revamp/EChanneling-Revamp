/**
 * Central type definitions for the EChanneling application
 * Re-exports and consolidates all type definitions
 */

// Re-export from constants
export type {
  UserRole,
  UserStatus,
  HospitalStatus,
  DoctorStatus,
  Status,
  PaymentMethod,
  PaymentStatus,
  FeeType,
  DiscountType,
  InvoiceStatus,
  Language,
} from '@/config/constants';

// Re-export from API types
export type {
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
  PaginationParams,
  SearchParams,
  DateRangeParams,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  CreateHospitalRequest,
  UpdateHospitalRequest,
  HospitalResponse,
  CreateDoctorRequest,
  UpdateDoctorRequest,
  DoctorResponse,
  CreateSpecializationRequest,
  UpdateSpecializationRequest,
  SpecializationResponse,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  PaymentResponse,
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  InvoiceResponse,
  DashboardStats,
  ActivityItem,
  AuditLogResponse,
  FileUploadRequest,
  FileUploadResponse,
  ExportRequest,
  ExportResponse,
  WebhookPayload,
  WebhookResponse,
  HealthCheckResponse,
} from './api';

// Re-export from middleware types
export type {
  MiddlewareRequest,
  MiddlewareResponse,
  AuthMiddlewareOptions,
  RateLimitOptions,
  SecurityHeaders,
  MiddlewareConfig,
  RequestContext,
  MiddlewareHandler,
  MiddlewareChain,
  RouteProtection,
  MiddlewareError,
  SessionData,
  TokenPayload,
  ApiKeyData,
  RateLimitData,
  SecurityEvent,
  MiddlewareMetrics,
} from './middleware';

// Re-export from permissions
export type {
  Permission,
} from '@/utils/permissions';

// Additional common types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimestampedEntity extends BaseEntity {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeleteEntity extends BaseEntity {
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface AuditableEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
  version: number;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'file';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormSchema {
  fields: FormField[];
  submitText: string;
  resetText?: string;
}

// Table types
export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: any) => React.ReactNode;
}

export interface TableConfig {
  columns: TableColumn[];
  pagination?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  selection?: boolean;
  actions?: TableAction[];
}

export interface TableAction {
  key: string;
  label: string;
  icon?: string;
  type: 'button' | 'link' | 'dropdown';
  onClick?: (record: any) => void;
  href?: (record: any) => string;
  visible?: (record: any) => boolean;
  disabled?: (record: any) => boolean;
}

// Chart types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  data: ChartData;
  options?: any;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
  actionUrl?: string;
  actionText?: string;
}

export interface NotificationRequest {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  userId: string;
  actionUrl?: string;
  actionText?: string;
}

// Search types
export interface SearchResult<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  query: string;
  filters: Record<string, any>;
  facets?: SearchFacet[];
}

export interface SearchFacet {
  field: string;
  values: { value: string; count: number }[];
}

export interface SearchFilters {
  [key: string]: any;
}

// Cache types
export interface CacheEntry<T = any> {
  key: string;
  value: T;
  expiresAt: Date;
  createdAt: Date;
}

export interface CacheConfig {
  ttl: number; // Time to live in seconds
  maxSize?: number;
  strategy: 'lru' | 'lfu' | 'fifo';
}

// Queue types
export interface QueueJob<T = any> {
  id: string;
  type: string;
  data: T;
  priority: number;
  attempts: number;
  maxAttempts: number;
  delay?: number;
  createdAt: Date;
  processedAt?: Date;
  failedAt?: Date;
  error?: string;
}

export interface QueueConfig {
  name: string;
  concurrency: number;
  retryDelay: number;
  maxRetries: number;
}

// Event types
export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  version: number;
  data: any;
  metadata: {
    userId?: string;
    correlationId?: string;
    causationId?: string;
    timestamp: Date;
  };
}

export interface EventHandler<T = any> {
  handle(event: DomainEvent<T>): Promise<void>;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Configuration types
export interface AppConfig {
  environment: 'development' | 'staging' | 'production';
  version: string;
  apiUrl: string;
  database: {
    url: string;
    maxConnections: number;
    timeout: number;
  };
  redis: {
    url: string;
    ttl: number;
  };
  kafka: {
    brokers: string[];
    clientId: string;
  };
  email: {
    provider: string;
    from: string;
    templates: Record<string, string>;
  };
  security: {
    jwtSecret: string;
    jwtExpiresIn: string;
    bcryptRounds: number;
    rateLimit: {
      windowMs: number;
      max: number;
    };
  };
}

// Error types
export interface AppError extends Error {
  code: string;
  statusCode: number;
  details?: any;
  timestamp: Date;
}

export interface ErrorContext {
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  body?: any;
  query?: any;
  params?: any;
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type NonNullable<T> = T extends null | undefined ? never : T;
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Generic response wrapper
export interface ResponseWrapper<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage?: number;
  prevPage?: number;
}

// Sort options
export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// Filter options
export interface FilterOption {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

// Query builder types
export interface QueryOptions {
  pagination?: PaginationParams;
  sorting?: SortOption[];
  filtering?: FilterOption[];
  search?: string;
  includes?: string[];
  excludes?: string[];
}
