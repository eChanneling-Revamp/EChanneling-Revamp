'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsGrid } from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui';
import { colors } from '@/styles/design-system';
import {
  HospitalIcon,
  DoctorIcon,
  PaymentIcon,
  UserManagementIcon,
} from '@/components/icons/dashboard';

// Mock data for the dashboard
const dashboardStats = [
  {
    title: 'Total Hospitals',
    value: '247',
    change: {
      value: '+12 this month',
      type: 'increase' as const,
    },
    icon: <HospitalIcon size={24} />,
  },
  {
    title: 'Active Doctors',
    value: '1,429',
    change: {
      value: '+89 this month',
      type: 'increase' as const,
    },
    icon: <DoctorIcon size={24} />,
  },
  {
    title: 'Monthly Revenue',
    value: 'LKR 2.4M',
    change: {
      value: '+15.3% from last month',
      type: 'increase' as const,
    },
    icon: <PaymentIcon size={24} />,
  },
  {
    title: 'Total Users',
    value: '45,231',
    change: {
      value: '+1,205 this month',
      type: 'increase' as const,
    },
    icon: <UserManagementIcon size={24} />,
  },
];

const recentActivities = [
  {
    id: 1,
    action: 'New Hospital Registered',
    description: 'Asiri Hospital Kandy has been registered',
    time: '2 hours ago',
    type: 'hospital',
  },
  {
    id: 2,
    action: 'Doctor Verification',
    description: 'Dr. John Smith has been verified and activated',
    time: '4 hours ago',
    type: 'doctor',
  },
  {
    id: 3,
    action: 'Payment Processed',
    description: 'LKR 15,000 payment received from Corporate Agent',
    time: '6 hours ago',
    type: 'payment',
  },
  {
    id: 4,
    action: 'System Alert',
    description: 'Payment gateway maintenance scheduled for tonight',
    time: '8 hours ago',
    type: 'system',
  },
];

const quickActions = [
  {
    title: 'Register Hospital',
    description: 'Add a new hospital to the platform',
    href: '/admin/hospitals/register',
    color: colors.primary[500],
  },
  {
    title: 'Verify Doctors',
    description: 'Review pending doctor verifications',
    href: '/admin/doctors/verification',
    color: colors.secondary[500],
  },
  {
    title: 'View Payments',
    description: 'Monitor recent transactions',
    href: '/admin/payments',
    color: colors.accent[500],
  },
  {
    title: 'Generate Reports',
    description: 'Create financial and operational reports',
    href: '/admin/reports',
    color: colors.success,
  },
];

export default function AdminDashboard() {
  const chartContainerStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const activitiesListStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  };

  const activityItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: `1px solid ${colors.border.light}`,
    backgroundColor: colors.background.primary,
  };

  const activityIconStyles: React.CSSProperties = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: colors.primary[500],
    marginTop: '0.375rem',
    flexShrink: 0,
  };

  const quickActionsGridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  };

  const quickActionCardStyles: React.CSSProperties = {
    padding: '1.5rem',
    borderRadius: '0.75rem',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
    border: `1px solid ${colors.border.light}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    display: 'block',
  };

  return (
    <DashboardLayout title="Dashboard Overview">
      {/* Stats Grid */}
      <StatsGrid stats={dashboardStats} />

      {/* Charts and Activities */}
      <div style={chartContainerStyles} className="mobile-stack">
        {/* Revenue Chart Placeholder */}
        <Card padding="lg">
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1.125rem', 
            fontWeight: '600',
            color: colors.text.primary 
          }}>
            Revenue Trend
          </h3>
          <div style={{
            height: '300px',
            backgroundColor: colors.background.secondary,
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.secondary,
            fontSize: '0.875rem',
          }}>
            Chart Component Placeholder
            <br />
            (Revenue over last 6 months)
          </div>
        </Card>

        {/* Recent Activities */}
        <Card padding="lg">
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1.125rem', 
            fontWeight: '600',
            color: colors.text.primary 
          }}>
            Recent Activities
          </h3>
          <div style={activitiesListStyles}>
            {recentActivities.map((activity) => (
              <div key={activity.id} style={activityItemStyles}>
                <div style={activityIconStyles} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    margin: '0 0 0.25rem 0', 
                    fontSize: '0.875rem', 
                    fontWeight: '500',
                    color: colors.text.primary 
                  }}>
                    {activity.action}
                  </h4>
                  <p style={{ 
                    margin: '0 0 0.25rem 0', 
                    fontSize: '0.75rem',
                    color: colors.text.secondary 
                  }}>
                    {activity.description}
                  </p>
                  <span style={{ 
                    fontSize: '0.75rem',
                    color: colors.text.tertiary 
                  }}>
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card padding="lg">
        <h3 style={{ 
          margin: '0 0 1.5rem 0', 
          fontSize: '1.125rem', 
          fontWeight: '600',
          color: colors.text.primary 
        }}>
          Quick Actions
        </h3>
        <div style={quickActionsGridStyles}>
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              style={{
                ...quickActionCardStyles,
                borderLeftColor: action.color,
                borderLeftWidth: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                fontSize: '1rem', 
                fontWeight: '600',
                color: colors.text.primary 
              }}>
                {action.title}
              </h4>
              <p style={{ 
                margin: 0, 
                fontSize: '0.875rem',
                color: colors.text.secondary,
                lineHeight: 1.4 
              }}>
                {action.description}
              </p>
            </a>
          ))}
        </div>
      </Card>

      {/* System Status */}
      <Card padding="lg" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ 
          margin: '0 0 1rem 0', 
          fontSize: '1.125rem', 
          fontWeight: '600',
          color: colors.text.primary 
        }}>
          System Status
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {[
            { name: 'Payment Gateway', status: 'operational', uptime: '99.9%' },
            { name: 'SMS Service', status: 'operational', uptime: '99.7%' },
            { name: 'Email Service', status: 'operational', uptime: '99.8%' },
            { name: 'Hospital APIs', status: 'degraded', uptime: '97.2%' },
          ].map((service, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: colors.background.primary,
                border: `1px solid ${colors.border.light}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: service.status === 'operational' ? colors.success : colors.warning,
                  }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.text.primary }}>
                  {service.name}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: colors.text.secondary }}>
                Uptime: {service.uptime}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}
