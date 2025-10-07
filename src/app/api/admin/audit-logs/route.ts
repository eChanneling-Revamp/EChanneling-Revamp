import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, getUserSession } from '@/lib/auth';
import { ApiResponse, PaginatedResponse, AuditLogResponse } from '@/types/api';

const prisma = new PrismaClient();

/**
 * GET /api/admin/audit-logs
 * Fetch audit logs with pagination and filtering
 */
export async function GET(request: NextRequest): Promise<NextResponse<PaginatedResponse<AuditLogResponse>>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const action = searchParams.get('action') || '';
    const entityType = searchParams.get('entityType') || '';
    const userId = searchParams.get('userId') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {};
    
    if (action) {
      where.action = action;
    }
    
    if (entityType) {
      where.entityType = entityType;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Get total count
    const total = await prisma.auditLog.count({ where });

    // Get audit logs with pagination
    const auditLogs = await prisma.auditLog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: {
          select: { name: true, email: true, role: true }
        },
        hospital: {
          select: { name: true }
        },
        doctor: {
          select: { name: true }
        }
      }
    });

    // Format response
    const formattedAuditLogs: AuditLogResponse[] = auditLogs.map(log => ({
      id: log.id,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      userId: log.userId,
      hospitalId: log.hospitalId,
      doctorId: log.doctorId,
      oldValues: log.oldValues,
      newValues: log.newValues,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt.toISOString(),
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: formattedAuditLogs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      message: 'Audit logs retrieved successfully',
    });

  } catch (error: any) {
    console.error('Audit logs API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch audit logs',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * POST /api/admin/audit-logs/export
 * Export audit logs to CSV
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    const body = await request.json();
    const { startDate, endDate, entityType, action, userId } = body;

    // Build where clause
    const where: any = {};
    
    if (action) {
      where.action = action;
    }
    
    if (entityType) {
      where.entityType = entityType;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    // Get audit logs for export
    const auditLogs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true, role: true }
        },
        hospital: {
          select: { name: true }
        },
        doctor: {
          select: { name: true }
        }
      }
    });

    // Generate CSV content
    const csvHeaders = [
      'ID',
      'Action',
      'Entity Type',
      'Entity ID',
      'User',
      'User Email',
      'User Role',
      'Hospital',
      'Doctor',
      'IP Address',
      'User Agent',
      'Created At'
    ];

    const csvRows = auditLogs.map(log => [
      log.id,
      log.action,
      log.entityType,
      log.entityId,
      log.user.name || 'N/A',
      log.user.email,
      log.user.role,
      log.hospital?.name || 'N/A',
      log.doctor?.name || 'N/A',
      log.ipAddress || 'N/A',
      log.userAgent || 'N/A',
      log.createdAt.toISOString()
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Create filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `audit-logs-${timestamp}.csv`;

    // Send Kafka event for audit log export
    const kafkaProducer = getKafkaProducer();
    await kafkaProducer.sendAuditLogEvent({
      action: 'EXPORT',
      entityType: 'AUDIT_LOG',
      entityId: 'export',
      userId: (await getUserSession(request))?.userId || 'system',
      newValues: {
        filename,
        recordCount: auditLogs.length,
        filters: { startDate, endDate, entityType, action, userId }
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        filename,
        content: csvContent,
        recordCount: auditLogs.length,
      },
      message: 'Audit logs exported successfully',
    });

  } catch (error: any) {
    console.error('Export audit logs API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to export audit logs',
      message: error.message,
    }, { status: 500 });
  }
}
