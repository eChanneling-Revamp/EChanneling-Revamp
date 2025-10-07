import { UserRole, Status, PaymentMethod, PaymentStatus, FeeType, DiscountType, InvoiceStatus } from '@/config/constants';

/**
 * API request and response types
 */

// Base API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: any;
  code?: string;
  timestamp: string;
}

// Request types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  search?: string;
  filters?: Record<string, any>;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// User types
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

// Hospital types
export interface CreateHospitalRequest {
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  registrationNumber: string;
  licenseNumber: string;
}

export interface UpdateHospitalRequest {
  name?: string;
  address?: string;
  city?: string;
  province?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL';
}

export interface HospitalResponse {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL';
  registrationNumber: string;
  licenseNumber: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Doctor types
export interface CreateDoctorRequest {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specializationId: string;
  hospitalId: string;
  experience: number;
  qualifications: string[];
  consultationFee: number;
  availableDays: string[];
  availableHours: string[];
  bio?: string;
}

export interface UpdateDoctorRequest {
  name?: string;
  email?: string;
  phone?: string;
  experience?: number;
  qualifications?: string[];
  consultationFee?: number;
  availableDays?: string[];
  availableHours?: string[];
  bio?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED';
}

export interface DoctorResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specializationId: string;
  hospitalId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'REJECTED';
  experience: number;
  qualifications: string[];
  consultationFee: number;
  availableDays: string[];
  availableHours: string[];
  bio?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Specialization types
export interface CreateSpecializationRequest {
  name: string;
  nameSinhala?: string;
  nameTamil?: string;
  description?: string;
}

export interface UpdateSpecializationRequest {
  name?: string;
  nameSinhala?: string;
  nameTamil?: string;
  description?: string;
  status?: Status;
}

export interface SpecializationResponse {
  id: string;
  name: string;
  nameSinhala?: string;
  nameTamil?: string;
  description?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

// Payment types
export interface CreatePaymentRequest {
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  reference?: string;
  description?: string;
  userId: string;
  invoiceId?: string;
}

export interface UpdatePaymentRequest {
  status?: PaymentStatus;
  transactionId?: string;
  reference?: string;
  description?: string;
}

export interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  reference?: string;
  description?: string;
  userId: string;
  invoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

// Invoice types
export interface CreateInvoiceRequest {
  amount: number;
  tax?: number;
  dueDate: string;
  userId: string;
  doctorId?: string;
  hospitalId?: string;
  description?: string;
}

export interface UpdateInvoiceRequest {
  status?: InvoiceStatus;
  amount?: number;
  tax?: number;
  dueDate?: string;
  description?: string;
}

export interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  userId: string;
  doctorId?: string;
  hospitalId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard types
export interface DashboardStats {
  totalUsers: number;
  totalHospitals: number;
  totalDoctors: number;
  totalInvoices: number;
  totalPayments: number;
  pendingApprovals: number;
  monthlyRevenue: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}

// Audit log types
export interface AuditLogResponse {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  hospitalId?: string;
  doctorId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// File upload types
export interface FileUploadRequest {
  file: File;
  type: 'image' | 'document';
  category?: string;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

// Export types
export interface ExportRequest {
  format: 'csv' | 'pdf' | 'excel';
  entity: string;
  filters?: Record<string, any>;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

export interface ExportResponse {
  id: string;
  filename: string;
  url: string;
  expiresAt: string;
  status: 'processing' | 'completed' | 'failed';
}

// Webhook types
export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
  signature?: string;
}

export interface WebhookResponse {
  success: boolean;
  message?: string;
}

// Health check types
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'up' | 'down';
    kafka: 'up' | 'down';
    email: 'up' | 'down';
  };
  version: string;
  uptime: number;
}
