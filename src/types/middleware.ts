import { NextRequest } from 'next/server';
import { UserRole } from '@/config/constants';

/**
 * Middleware types for Next.js middleware
 */

export interface MiddlewareRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
  };
}

export interface MiddlewareResponse {
  success: boolean;
  message?: string;
  redirect?: string;
  status?: number;
}

export interface AuthMiddlewareOptions {
  requireAuth?: boolean;
  requiredRoles?: UserRole[];
  requireAllRoles?: boolean;
  redirectTo?: string;
}

export interface RateLimitOptions {
  limit: number;
  window: number; // in seconds
  identifier?: string;
}

export interface SecurityHeaders {
  'X-Frame-Options'?: string;
  'X-Content-Type-Options'?: string;
  'X-XSS-Protection'?: string;
  'Strict-Transport-Security'?: string;
  'Content-Security-Policy'?: string;
  'Referrer-Policy'?: string;
}

export interface MiddlewareConfig {
  auth: AuthMiddlewareOptions;
  rateLimit?: RateLimitOptions;
  security?: SecurityHeaders;
  cors?: {
    origin: string | string[];
    methods: string[];
    allowedHeaders: string[];
  };
}

export interface RequestContext {
  request: MiddlewareRequest;
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
  };
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface MiddlewareHandler {
  (context: RequestContext): Promise<MiddlewareResponse | void>;
}

export interface MiddlewareChain {
  handlers: MiddlewareHandler[];
  execute(context: RequestContext): Promise<MiddlewareResponse>;
}

export interface RouteProtection {
  path: string;
  methods: string[];
  protection: 'public' | 'authenticated' | 'role-based';
  roles?: UserRole[];
  permissions?: string[];
}

export interface MiddlewareError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

export interface SessionData {
  user: {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
  };
  expires: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name?: string;
  iat?: number;
  exp?: number;
}

export interface ApiKeyData {
  key: string;
  name: string;
  permissions: string[];
  expiresAt?: Date;
  lastUsed?: Date;
  isActive: boolean;
}

export interface RateLimitData {
  identifier: string;
  count: number;
  resetTime: Date;
  blocked: boolean;
}

export interface SecurityEvent {
  type: 'auth_failure' | 'rate_limit_exceeded' | 'suspicious_activity' | 'unauthorized_access';
  userId?: string;
  ip: string;
  userAgent?: string;
  details: any;
  timestamp: Date;
}

export interface MiddlewareMetrics {
  totalRequests: number;
  authenticatedRequests: number;
  unauthorizedRequests: number;
  rateLimitedRequests: number;
  averageResponseTime: number;
  errorRate: number;
}
