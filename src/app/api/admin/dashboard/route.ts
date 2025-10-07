import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, getUserSession } from '@/lib/auth';
import { ApiResponse, DashboardStats, ActivityItem } from '@/types/api';

const prisma = new PrismaClient();

/**
 * GET /api/admin/dashboard
 * Fetch dashboard statistics and recent activity
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<DashboardStats>>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    // Get dashboard statistics
    const [
      totalUsers,
      totalHospitals,
      totalDoctors,
      totalInvoices,
      totalPayments,
      pendingApprovals,
      monthlyRevenue,
      recentActivity
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.hospital.count(),
      prisma.doctor.count(),
      prisma.invoice.count(),
      prisma.payment.count(),
      
      // Pending approvals
      prisma.hospital.count({ where: { status: 'PENDING_APPROVAL' } }) +
      prisma.doctor.count({ where: { status: 'PENDING' } }),
      
      // Monthly revenue (current month)
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
          },
        },
        _sum: { amount: true },
      }).then(result => result._sum.amount || 0),
      
      // Recent activity (last 10 audit logs)
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          }
        }
      })
    ]);

    // Format recent activity
    const formattedActivity: ActivityItem[] = recentActivity.map(log => ({
      id: log.id,
      type: log.action,
      description: `${log.action} ${log.entityType.toLowerCase()} ${log.entityId}`,
      timestamp: log.createdAt.toISOString(),
      userId: log.userId,
      userName: log.user.name || log.user.email,
    }));

    const dashboardStats: DashboardStats = {
      totalUsers,
      totalHospitals,
      totalDoctors,
      totalInvoices,
      totalPayments,
      pendingApprovals,
      monthlyRevenue,
      recentActivity: formattedActivity,
    };

    return NextResponse.json({
      success: true,
      data: dashboardStats,
      message: 'Dashboard statistics retrieved successfully',
    });

  } catch (error: any) {
    console.error('Dashboard API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      message: error.message,
    }, { status: 500 });
  }
}

/**
 * GET /api/admin/dashboard/stats
 * Get specific statistics with date range
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    // Check admin authentication
    await requireAdmin(request);

    const body = await request.json();
    const { startDate, endDate, metrics } = body;

    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();

    const stats: any = {};

    // Get requested metrics
    if (metrics.includes('revenue')) {
      const revenue = await prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: start, lte: end },
        },
        _sum: { amount: true },
        _count: true,
      });
      stats.revenue = {
        total: revenue._sum.amount || 0,
        count: revenue._count,
        average: revenue._count > 0 ? (revenue._sum.amount || 0) / revenue._count : 0,
      };
    }

    if (metrics.includes('users')) {
      const users = await prisma.user.count({
        where: {
          createdAt: { gte: start, lte: end },
        },
      });
      stats.newUsers = users;
    }

    if (metrics.includes('hospitals')) {
      const hospitals = await prisma.hospital.count({
        where: {
          createdAt: { gte: start, lte: end },
        },
      });
      stats.newHospitals = hospitals;
    }

    if (metrics.includes('doctors')) {
      const doctors = await prisma.doctor.count({
        where: {
          createdAt: { gte: start, lte: end },
        },
      });
      stats.newDoctors = doctors;
    }

    if (metrics.includes('invoices')) {
      const invoices = await prisma.invoice.aggregate({
        where: {
          createdAt: { gte: start, lte: end },
        },
        _sum: { totalAmount: true },
        _count: true,
      });
      stats.invoices = {
        total: invoices._sum.totalAmount || 0,
        count: invoices._count,
      };
    }

    return NextResponse.json({
      success: true,
      data: stats,
      message: 'Statistics retrieved successfully',
    });

  } catch (error: any) {
    console.error('Dashboard stats API error:', error);
    
    if (error.message === 'Authentication required' || error.message.includes('Role ADMIN required')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access',
        message: 'Admin role required',
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message,
    }, { status: 500 });
  }
}
