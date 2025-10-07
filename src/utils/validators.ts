import { z } from 'zod';
import { VALIDATION_PATTERNS } from '@/config/constants';

/**
 * Validation schemas using Zod
 * Centralized validation logic for all API endpoints
 */

// Base schemas
export const emailSchema = z.string().email('Invalid email format');
export const phoneSchema = z.string().regex(VALIDATION_PATTERNS.PHONE, 'Invalid phone number format');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')
  .regex(VALIDATION_PATTERNS.PASSWORD, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

// User validation schemas
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['ADMIN', 'USER', 'HOSPITAL', 'DOCTOR']),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters').optional(),
  email: emailSchema.optional(),
  role: z.enum(['ADMIN', 'USER', 'HOSPITAL', 'DOCTOR']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: passwordSchema,
});

// Hospital validation schemas
export const createHospitalSchema = z.object({
  name: z.string().min(2, 'Hospital name must be at least 2 characters').max(200, 'Hospital name must be less than 200 characters'),
  address: z.string().min(10, 'Address must be at least 10 characters').max(500, 'Address must be less than 500 characters'),
  city: z.string().min(2, 'City must be at least 2 characters').max(100, 'City must be less than 100 characters'),
  province: z.string().min(2, 'Province must be at least 2 characters').max(100, 'Province must be less than 100 characters'),
  phone: phoneSchema,
  email: emailSchema,
  website: z.string().url('Invalid website URL').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  registrationNumber: z.string().regex(VALIDATION_PATTERNS.REGISTRATION_NUMBER, 'Invalid registration number format'),
  licenseNumber: z.string().regex(VALIDATION_PATTERNS.LICENSE_NUMBER, 'Invalid license number format'),
});

export const updateHospitalSchema = createHospitalSchema.partial();

// Doctor validation schemas
export const createDoctorSchema = z.object({
  name: z.string().min(2, 'Doctor name must be at least 2 characters').max(100, 'Doctor name must be less than 100 characters'),
  email: emailSchema,
  phone: phoneSchema,
  licenseNumber: z.string().regex(VALIDATION_PATTERNS.LICENSE_NUMBER, 'Invalid license number format'),
  specializationId: z.string().min(1, 'Specialization is required'),
  hospitalId: z.string().min(1, 'Hospital is required'),
  experience: z.number().int().min(0, 'Experience must be non-negative').max(50, 'Experience must be less than 50 years'),
  qualifications: z.array(z.string()).min(1, 'At least one qualification is required'),
  consultationFee: z.number().min(500, 'Consultation fee must be at least LKR 500').max(10000, 'Consultation fee must be less than LKR 10,000'),
  availableDays: z.array(z.string()).min(1, 'At least one available day is required'),
  availableHours: z.array(z.string()).min(1, 'At least one available hour is required'),
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial();

// Specialization validation schemas
export const createSpecializationSchema = z.object({
  name: z.string().min(2, 'Specialization name must be at least 2 characters').max(100, 'Specialization name must be less than 100 characters'),
  nameSinhala: z.string().max(100, 'Sinhala name must be less than 100 characters').optional(),
  nameTamil: z.string().max(100, 'Tamil name must be less than 100 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const updateSpecializationSchema = createSpecializationSchema.partial();

// Hospital function validation schemas
export const createHospitalFunctionSchema = z.object({
  name: z.string().min(2, 'Function name must be at least 2 characters').max(100, 'Function name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  hospitalId: z.string().min(1, 'Hospital is required'),
});

export const updateHospitalFunctionSchema = createHospitalFunctionSchema.partial();

// Corporate agent validation schemas
export const createCorporateAgentSchema = z.object({
  name: z.string().min(2, 'Agent name must be at least 2 characters').max(100, 'Agent name must be less than 100 characters'),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().min(2, 'Company name must be at least 2 characters').max(200, 'Company name must be less than 200 characters'),
  address: z.string().min(10, 'Address must be at least 10 characters').max(500, 'Address must be less than 500 characters'),
  contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters').max(100, 'Contact person name must be less than 100 characters'),
  commissionRate: z.number().min(0, 'Commission rate must be non-negative').max(100, 'Commission rate must be less than 100%'),
});

export const updateCorporateAgentSchema = createCorporateAgentSchema.partial();

// Payment validation schemas
export const createPaymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().default('LKR'),
  paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'MOBILE_PAYMENT']),
  transactionId: z.string().optional(),
  reference: z.string().optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  userId: z.string().min(1, 'User is required'),
  invoiceId: z.string().optional(),
});

export const updatePaymentSchema = createPaymentSchema.partial();

// Fee validation schemas
export const createFeeSchema = z.object({
  name: z.string().min(2, 'Fee name must be at least 2 characters').max(100, 'Fee name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  amount: z.number().min(0, 'Amount must be non-negative'),
  type: z.enum(['CONSULTATION', 'REGISTRATION', 'PROCESSING', 'OTHER']),
  hospitalId: z.string().min(1, 'Hospital is required'),
});

export const updateFeeSchema = createFeeSchema.partial();

// Discount validation schemas
export const createDiscountSchema = z.object({
  name: z.string().min(2, 'Discount name must be at least 2 characters').max(100, 'Discount name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  percentage: z.number().min(0, 'Percentage must be non-negative').max(100, 'Percentage must be less than 100%').optional(),
  fixedAmount: z.number().min(0, 'Fixed amount must be non-negative').optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  hospitalId: z.string().min(1, 'Hospital is required'),
  validFrom: z.string().datetime('Invalid valid from date'),
  validTo: z.string().datetime('Invalid valid to date'),
}).refine((data) => {
  if (data.type === 'PERCENTAGE' && !data.percentage) {
    return false;
  }
  if (data.type === 'FIXED_AMOUNT' && !data.fixedAmount) {
    return false;
  }
  return true;
}, {
  message: 'Percentage or fixed amount is required based on discount type',
});

export const updateDiscountSchema = createDiscountSchema.partial();

// Branch validation schemas
export const createBranchSchema = z.object({
  name: z.string().min(2, 'Branch name must be at least 2 characters').max(100, 'Branch name must be less than 100 characters'),
  address: z.string().min(10, 'Address must be at least 10 characters').max(500, 'Address must be less than 500 characters'),
  city: z.string().min(2, 'City must be at least 2 characters').max(100, 'City must be less than 100 characters'),
  province: z.string().min(2, 'Province must be at least 2 characters').max(100, 'Province must be less than 100 characters'),
  phone: phoneSchema,
  email: emailSchema,
  hospitalId: z.string().min(1, 'Hospital is required'),
});

export const updateBranchSchema = createBranchSchema.partial();

// Invoice validation schemas
export const createInvoiceSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  tax: z.number().min(0, 'Tax must be non-negative').default(0),
  dueDate: z.string().datetime('Invalid due date'),
  userId: z.string().min(1, 'User is required'),
  doctorId: z.string().optional(),
  hospitalId: z.string().optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

// Query parameter validation schemas
export const paginationSchema = z.object({
  page: z.string().transform((val) => parseInt(val)).pipe(z.number().int().min(1)).default('1'),
  limit: z.string().transform((val) => parseInt(val)).pipe(z.number().int().min(1).max(100)).default('10'),
});

export const searchSchema = z.object({
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// File upload validation schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File, 'File is required'),
  type: z.enum(['image', 'document']),
});

// API response validation schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const paginatedResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
  error: z.string().optional(),
});

/**
 * Validate data against schema
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Validation result
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', '),
      };
    }
    return {
      success: false,
      error: 'Validation failed',
    };
  }
}

/**
 * Sanitize input data
 * @param data - Data to sanitize
 * @returns Sanitized data
 */
export function sanitizeInput(data: any): any {
  if (typeof data === 'string') {
    return data.trim().replace(/[<>]/g, '');
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const key in data) {
      sanitized[key] = sanitizeInput(data[key]);
    }
    return sanitized;
  }
  return data;
}
