import { USER_ROLES, UserRole } from '@/config/constants';

/**
 * Role-Based Access Control (RBAC) permission checks
 * Centralized permission management for the healthcare platform
 */

// Permission definitions
export const PERMISSIONS = {
  // User permissions
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Hospital permissions
  HOSPITAL_CREATE: 'hospital:create',
  HOSPITAL_READ: 'hospital:read',
  HOSPITAL_UPDATE: 'hospital:update',
  HOSPITAL_DELETE: 'hospital:delete',
  HOSPITAL_APPROVE: 'hospital:approve',
  
  // Doctor permissions
  DOCTOR_CREATE: 'doctor:create',
  DOCTOR_READ: 'doctor:read',
  DOCTOR_UPDATE: 'doctor:update',
  DOCTOR_DELETE: 'doctor:delete',
  DOCTOR_VERIFY: 'doctor:verify',
  DOCTOR_APPROVE: 'doctor:approve',
  
  // Specialization permissions
  SPECIALIZATION_CREATE: 'specialization:create',
  SPECIALIZATION_READ: 'specialization:read',
  SPECIALIZATION_UPDATE: 'specialization:update',
  SPECIALIZATION_DELETE: 'specialization:delete',
  
  // Hospital function permissions
  HOSPITAL_FUNCTION_CREATE: 'hospital_function:create',
  HOSPITAL_FUNCTION_READ: 'hospital_function:read',
  HOSPITAL_FUNCTION_UPDATE: 'hospital_function:update',
  HOSPITAL_FUNCTION_DELETE: 'hospital_function:delete',
  
  // Corporate agent permissions
  CORPORATE_CREATE: 'corporate:create',
  CORPORATE_READ: 'corporate:read',
  CORPORATE_UPDATE: 'corporate:update',
  CORPORATE_DELETE: 'corporate:delete',
  
  // Payment permissions
  PAYMENT_CREATE: 'payment:create',
  PAYMENT_READ: 'payment:read',
  PAYMENT_UPDATE: 'payment:update',
  PAYMENT_DELETE: 'payment:delete',
  PAYMENT_RECONCILE: 'payment:reconcile',
  
  // Fee permissions
  FEE_CREATE: 'fee:create',
  FEE_READ: 'fee:read',
  FEE_UPDATE: 'fee:update',
  FEE_DELETE: 'fee:delete',
  
  // Discount permissions
  DISCOUNT_CREATE: 'discount:create',
  DISCOUNT_READ: 'discount:read',
  DISCOUNT_UPDATE: 'discount:update',
  DISCOUNT_DELETE: 'discount:delete',
  
  // Branch permissions
  BRANCH_CREATE: 'branch:create',
  BRANCH_READ: 'branch:read',
  BRANCH_UPDATE: 'branch:update',
  BRANCH_DELETE: 'branch:delete',
  
  // Invoice permissions
  INVOICE_CREATE: 'invoice:create',
  INVOICE_READ: 'invoice:read',
  INVOICE_UPDATE: 'invoice:update',
  INVOICE_DELETE: 'invoice:delete',
  INVOICE_GENERATE: 'invoice:generate',
  
  // Audit log permissions
  AUDIT_LOG_READ: 'audit_log:read',
  AUDIT_LOG_EXPORT: 'audit_log:export',
  
  // Dashboard permissions
  DASHBOARD_READ: 'dashboard:read',
  DASHBOARD_STATS: 'dashboard:stats',
  
  // Report permissions
  REPORT_GENERATE: 'report:generate',
  REPORT_EXPORT: 'report:export',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role-permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.ADMIN]: [
    // Admin has all permissions
    ...Object.values(PERMISSIONS),
  ],
  
  [USER_ROLES.HOSPITAL]: [
    // Hospital management
    PERMISSIONS.HOSPITAL_READ,
    PERMISSIONS.HOSPITAL_UPDATE,
    
    // Doctor management
    PERMISSIONS.DOCTOR_CREATE,
    PERMISSIONS.DOCTOR_READ,
    PERMISSIONS.DOCTOR_UPDATE,
    PERMISSIONS.DOCTOR_DELETE,
    
    // Specialization management
    PERMISSIONS.SPECIALIZATION_READ,
    
    // Hospital function management
    PERMISSIONS.HOSPITAL_FUNCTION_CREATE,
    PERMISSIONS.HOSPITAL_FUNCTION_READ,
    PERMISSIONS.HOSPITAL_FUNCTION_UPDATE,
    PERMISSIONS.HOSPITAL_FUNCTION_DELETE,
    
    // Branch management
    PERMISSIONS.BRANCH_CREATE,
    PERMISSIONS.BRANCH_READ,
    PERMISSIONS.BRANCH_UPDATE,
    PERMISSIONS.BRANCH_DELETE,
    
    // Fee management
    PERMISSIONS.FEE_CREATE,
    PERMISSIONS.FEE_READ,
    PERMISSIONS.FEE_UPDATE,
    PERMISSIONS.FEE_DELETE,
    
    // Discount management
    PERMISSIONS.DISCOUNT_CREATE,
    PERMISSIONS.DISCOUNT_READ,
    PERMISSIONS.DISCOUNT_UPDATE,
    PERMISSIONS.DISCOUNT_DELETE,
    
    // Invoice management
    PERMISSIONS.INVOICE_CREATE,
    PERMISSIONS.INVOICE_READ,
    PERMISSIONS.INVOICE_UPDATE,
    PERMISSIONS.INVOICE_GENERATE,
    
    // Payment management
    PERMISSIONS.PAYMENT_CREATE,
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.PAYMENT_UPDATE,
    
    // Dashboard
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.DASHBOARD_STATS,
    
    // Reports
    PERMISSIONS.REPORT_GENERATE,
    PERMISSIONS.REPORT_EXPORT,
  ],
  
  [USER_ROLES.DOCTOR]: [
    // Doctor profile management
    PERMISSIONS.DOCTOR_READ,
    PERMISSIONS.DOCTOR_UPDATE,
    
    // Hospital information
    PERMISSIONS.HOSPITAL_READ,
    
    // Specialization information
    PERMISSIONS.SPECIALIZATION_READ,
    
    // Invoice management
    PERMISSIONS.INVOICE_READ,
    
    // Payment management
    PERMISSIONS.PAYMENT_READ,
    
    // Dashboard
    PERMISSIONS.DASHBOARD_READ,
  ],
  
  [USER_ROLES.USER]: [
    // Basic user permissions
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    
    // Hospital information
    PERMISSIONS.HOSPITAL_READ,
    
    // Doctor information
    PERMISSIONS.DOCTOR_READ,
    
    // Specialization information
    PERMISSIONS.SPECIALIZATION_READ,
    
    // Invoice management
    PERMISSIONS.INVOICE_CREATE,
    PERMISSIONS.INVOICE_READ,
    
    // Payment management
    PERMISSIONS.PAYMENT_CREATE,
    PERMISSIONS.PAYMENT_READ,
    
    // Dashboard
    PERMISSIONS.DASHBOARD_READ,
  ],
};

/**
 * Check if user has specific permission
 * @param userRole - User role
 * @param permission - Permission to check
 * @returns Boolean indicating if user has permission
 */
export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 * @param userRole - User role
 * @param permissions - Array of permissions to check
 * @returns Boolean indicating if user has any permission
 */
export function hasAnyPermission(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * Check if user has all of the specified permissions
 * @param userRole - User role
 * @param permissions - Array of permissions to check
 * @returns Boolean indicating if user has all permissions
 */
export function hasAllPermissions(userRole: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * Get all permissions for a role
 * @param userRole - User role
 * @returns Array of permissions
 */
export function getRolePermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole] || [];
}

/**
 * Check if user can perform action on resource
 * @param userRole - User role
 * @param action - Action to perform
 * @param resource - Resource type
 * @returns Boolean indicating if action is allowed
 */
export function canPerformAction(
  userRole: UserRole,
  action: 'create' | 'read' | 'update' | 'delete',
  resource: string
): boolean {
  const permission = `${resource}:${action}` as Permission;
  return hasPermission(userRole, permission);
}

/**
 * Check if user can access admin routes
 * @param userRole - User role
 * @returns Boolean indicating if user can access admin routes
 */
export function canAccessAdmin(userRole: UserRole): boolean {
  return userRole === USER_ROLES.ADMIN;
}

/**
 * Check if user can manage hospitals
 * @param userRole - User role
 * @returns Boolean indicating if user can manage hospitals
 */
export function canManageHospitals(userRole: UserRole): boolean {
  return hasAnyPermission(userRole, [
    PERMISSIONS.HOSPITAL_CREATE,
    PERMISSIONS.HOSPITAL_UPDATE,
    PERMISSIONS.HOSPITAL_DELETE,
    PERMISSIONS.HOSPITAL_APPROVE,
  ]);
}

/**
 * Check if user can manage doctors
 * @param userRole - User role
 * @returns Boolean indicating if user can manage doctors
 */
export function canManageDoctors(userRole: UserRole): boolean {
  return hasAnyPermission(userRole, [
    PERMISSIONS.DOCTOR_CREATE,
    PERMISSIONS.DOCTOR_UPDATE,
    PERMISSIONS.DOCTOR_DELETE,
    PERMISSIONS.DOCTOR_VERIFY,
    PERMISSIONS.DOCTOR_APPROVE,
  ]);
}

/**
 * Check if user can manage payments
 * @param userRole - User role
 * @returns Boolean indicating if user can manage payments
 */
export function canManagePayments(userRole: UserRole): boolean {
  return hasAnyPermission(userRole, [
    PERMISSIONS.PAYMENT_CREATE,
    PERMISSIONS.PAYMENT_UPDATE,
    PERMISSIONS.PAYMENT_DELETE,
    PERMISSIONS.PAYMENT_RECONCILE,
  ]);
}

/**
 * Check if user can generate reports
 * @param userRole - User role
 * @returns Boolean indicating if user can generate reports
 */
export function canGenerateReports(userRole: UserRole): boolean {
  return hasPermission(userRole, PERMISSIONS.REPORT_GENERATE);
}

/**
 * Check if user can view audit logs
 * @param userRole - User role
 * @returns Boolean indicating if user can view audit logs
 */
export function canViewAuditLogs(userRole: UserRole): boolean {
  return hasPermission(userRole, PERMISSIONS.AUDIT_LOG_READ);
}

/**
 * Check if user can export data
 * @param userRole - User role
 * @returns Boolean indicating if user can export data
 */
export function canExportData(userRole: UserRole): boolean {
  return hasAnyPermission(userRole, [
    PERMISSIONS.AUDIT_LOG_EXPORT,
    PERMISSIONS.REPORT_EXPORT,
  ]);
}

/**
 * Get accessible routes for user role
 * @param userRole - User role
 * @returns Array of accessible route patterns
 */
export function getAccessibleRoutes(userRole: UserRole): string[] {
  const routes: string[] = [];
  
  if (canAccessAdmin(userRole)) {
    routes.push('/admin/*');
  }
  
  if (canManageHospitals(userRole)) {
    routes.push('/hospitals/*');
  }
  
  if (canManageDoctors(userRole)) {
    routes.push('/doctors/*');
  }
  
  if (canManagePayments(userRole)) {
    routes.push('/payments/*');
  }
  
  if (canGenerateReports(userRole)) {
    routes.push('/reports/*');
  }
  
  if (canViewAuditLogs(userRole)) {
    routes.push('/audit-logs/*');
  }
  
  // All authenticated users can access these
  routes.push('/dashboard');
  routes.push('/profile');
  routes.push('/invoices/*');
  
  return routes;
}

/**
 * Check if route is accessible by user role
 * @param userRole - User role
 * @param route - Route to check
 * @returns Boolean indicating if route is accessible
 */
export function isRouteAccessible(userRole: UserRole, route: string): boolean {
  const accessibleRoutes = getAccessibleRoutes(userRole);
  return accessibleRoutes.some(accessibleRoute => {
    if (accessibleRoute.endsWith('/*')) {
      const baseRoute = accessibleRoute.slice(0, -2);
      return route.startsWith(baseRoute);
    }
    return route === accessibleRoute;
  });
}

/**
 * Permission middleware factory
 * @param permission - Required permission
 * @returns Middleware function
 */
export function requirePermission(permission: Permission) {
  return (userRole: UserRole): boolean => {
    return hasPermission(userRole, permission);
  };
}

/**
 * Multiple permissions middleware factory
 * @param permissions - Required permissions
 * @param requireAll - Whether all permissions are required (default: false)
 * @returns Middleware function
 */
export function requirePermissions(
  permissions: Permission[],
  requireAll: boolean = false
) {
  return (userRole: UserRole): boolean => {
    return requireAll 
      ? hasAllPermissions(userRole, permissions)
      : hasAnyPermission(userRole, permissions);
  };
}
