import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { USER_ROLES, UserRole } from '@/config/constants';

/**
 * Authentication utilities for session management and token validation
 */

/**
 * Get user session from request
 * @param request - Next.js request object
 * @returns User session or null
 */
export async function getUserSession(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    return token;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @param request - Next.js request object
 * @returns Boolean indicating authentication status
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const session = await getUserSession(request);
  return !!session;
}

/**
 * Check if user has specific role
 * @param request - Next.js request object
 * @param requiredRole - Required user role
 * @returns Boolean indicating role authorization
 */
export async function hasRole(
  request: NextRequest,
  requiredRole: UserRole
): Promise<boolean> {
  const session = await getUserSession(request);
  if (!session) return false;

  const userRole = session.role as UserRole;
  return userRole === requiredRole;
}

/**
 * Check if user has any of the specified roles
 * @param request - Next.js request object
 * @param requiredRoles - Array of required user roles
 * @returns Boolean indicating role authorization
 */
export async function hasAnyRole(
  request: NextRequest,
  requiredRoles: UserRole[]
): Promise<boolean> {
  const session = await getUserSession(request);
  if (!session) return false;

  const userRole = session.role as UserRole;
  return requiredRoles.includes(userRole);
}

/**
 * Check if user is admin
 * @param request - Next.js request object
 * @returns Boolean indicating admin status
 */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  return hasRole(request, USER_ROLES.ADMIN);
}

/**
 * Check if user is doctor
 * @param request - Next.js request object
 * @returns Boolean indicating doctor status
 */
export async function isDoctor(request: NextRequest): Promise<boolean> {
  return hasRole(request, USER_ROLES.DOCTOR);
}

/**
 * Check if user is hospital
 * @param request - Next.js request object
 * @returns Boolean indicating hospital status
 */
export async function isHospital(request: NextRequest): Promise<boolean> {
  return hasRole(request, USER_ROLES.HOSPITAL);
}

/**
 * Check if user is regular user
 * @param request - Next.js request object
 * @returns Boolean indicating user status
 */
export async function isUser(request: NextRequest): Promise<boolean> {
  return hasRole(request, USER_ROLES.USER);
}

/**
 * Get user ID from session
 * @param request - Next.js request object
 * @returns User ID or null
 */
export async function getUserId(request: NextRequest): Promise<string | null> {
  const session = await getUserSession(request);
  return session?.userId || session?.id || null;
}

/**
 * Get user email from session
 * @param request - Next.js request object
 * @returns User email or null
 */
export async function getUserEmail(request: NextRequest): Promise<string | null> {
  const session = await getUserSession(request);
  return session?.email || null;
}

/**
 * Get user role from session
 * @param request - Next.js request object
 * @returns User role or null
 */
export async function getUserRole(request: NextRequest): Promise<UserRole | null> {
  const session = await getUserSession(request);
  return session?.role as UserRole || null;
}

/**
 * Require authentication middleware
 * @param request - Next.js request object
 * @throws Error if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<void> {
  const authenticated = await isAuthenticated(request);
  if (!authenticated) {
    throw new Error('Authentication required');
  }
}

/**
 * Require specific role middleware
 * @param request - Next.js request object
 * @param requiredRole - Required user role
 * @throws Error if not authorized
 */
export async function requireRole(
  request: NextRequest,
  requiredRole: UserRole
): Promise<void> {
  await requireAuth(request);
  const hasRequiredRole = await hasRole(request, requiredRole);
  if (!hasRequiredRole) {
    throw new Error(`Role ${requiredRole} required`);
  }
}

/**
 * Require admin role middleware
 * @param request - Next.js request object
 * @throws Error if not admin
 */
export async function requireAdmin(request: NextRequest): Promise<void> {
  await requireRole(request, USER_ROLES.ADMIN);
}

/**
 * Require doctor role middleware
 * @param request - Next.js request object
 * @throws Error if not doctor
 */
export async function requireDoctor(request: NextRequest): Promise<void> {
  await requireRole(request, USER_ROLES.DOCTOR);
}

/**
 * Require hospital role middleware
 * @param request - Next.js request object
 * @throws Error if not hospital
 */
export async function requireHospital(request: NextRequest): Promise<void> {
  await requireRole(request, USER_ROLES.HOSPITAL);
}

/**
 * Check if user can access resource
 * @param request - Next.js request object
 * @param resourceUserId - User ID who owns the resource
 * @returns Boolean indicating access permission
 */
export async function canAccessResource(
  request: NextRequest,
  resourceUserId: string
): Promise<boolean> {
  const session = await getUserSession(request);
  if (!session) return false;

  const userRole = session.role as UserRole;
  const userId = session.userId || session.id;

  // Admin can access all resources
  if (userRole === USER_ROLES.ADMIN) return true;

  // Users can only access their own resources
  return userId === resourceUserId;
}

/**
 * Generate JWT token for API authentication
 * @param payload - Token payload
 * @param expiresIn - Token expiration time
 * @returns JWT token
 */
export function generateToken(payload: any, expiresIn: string = '24h'): string {
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET, {
    expiresIn,
  });
}

/**
 * Verify JWT token
 * @param token - JWT token
 * @returns Decoded token payload
 */
export function verifyToken(token: string): any {
  const jwt = require('jsonwebtoken');
  return jwt.verify(token, process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET);
}

/**
 * Extract token from Authorization header
 * @param request - Next.js request object
 * @returns Token or null
 */
export function extractTokenFromHeader(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Validate API key
 * @param apiKey - API key to validate
 * @returns Boolean indicating validity
 */
export function validateApiKey(apiKey: string): boolean {
  const validApiKeys = process.env.API_KEYS?.split(',') || [];
  return validApiKeys.includes(apiKey);
}

/**
 * Rate limiting check
 * @param identifier - User identifier (IP, user ID, etc.)
 * @param limit - Request limit
 * @param window - Time window in seconds
 * @returns Boolean indicating if request is allowed
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  window: number = 900
): boolean {
  // In production, you would use Redis or another caching solution
  // For now, this is a simple in-memory implementation
  const now = Date.now();
  const key = `rate_limit:${identifier}`;
  
  // This is a simplified implementation
  // In production, use Redis with sliding window or token bucket algorithm
  return true; // Placeholder
}
