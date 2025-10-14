'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { colors } from '@/styles/design-system';
import {
  DashboardIcon,
  HospitalIcon,
  DoctorIcon,
  SpecializationIcon,
  CorporateIcon,
  PaymentIcon,
  FeeIcon,
  DiscountIcon,
  InvoiceIcon,
  UserManagementIcon,
  AuditIcon,
  ReportsIcon,
  SettingsIcon,
  LogoutIcon,
  ChevronDownIcon,
} from '@/components/icons/dashboard';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon size={20} />,
    href: '/admin/dashboard',
  },
  {
    id: 'hospitals',
    label: 'Hospital Management',
    icon: <HospitalIcon size={20} />,
    children: [
      { id: 'hospitals-list', label: 'All Hospitals', icon: <></>, href: '/admin/hospitals' },
      { id: 'hospitals-register', label: 'Register Hospital', icon: <></>, href: '/admin/hospitals/register' },
      { id: 'hospitals-groups', label: 'Hospital Groups', icon: <></>, href: '/admin/hospitals/groups' },
      { id: 'hospitals-branches', label: 'Branches', icon: <></>, href: '/admin/hospitals/branches' },
      { id: 'hospitals-functions', label: 'Hospital Functions', icon: <></>, href: '/admin/hospitals/functions' },
    ],
  },
  {
    id: 'doctors',
    label: 'Doctor Management',
    icon: <DoctorIcon size={20} />,
    children: [
      { id: 'doctors-list', label: 'All Doctors', icon: <></>, href: '/admin/doctors' },
      { id: 'doctors-register', label: 'Register Doctor', icon: <></>, href: '/admin/doctors/register' },
      { id: 'doctors-sessions', label: 'Manage Sessions', icon: <></>, href: '/admin/doctors/sessions' },
      { id: 'doctors-verification', label: 'Verification Queue', icon: <></>, href: '/admin/doctors/verification', badge: '3' },
    ],
  },
  {
    id: 'specializations',
    label: 'Specializations',
    icon: <SpecializationIcon size={20} />,
    href: '/admin/specializations',
  },
  {
    id: 'corporate',
    label: 'Corporate & Agents',
    icon: <CorporateIcon size={20} />,
    children: [
      { id: 'corporate-list', label: 'All Agents', icon: <></>, href: '/admin/corporate' },
      { id: 'corporate-register', label: 'Register Agent', icon: <></>, href: '/admin/corporate/register' },
      { id: 'corporate-packages', label: 'Corporate Packages', icon: <></>, href: '/admin/corporate/packages' },
      { id: 'corporate-billing', label: 'Corporate Billing', icon: <></>, href: '/admin/corporate/billing' },
    ],
  },
  {
    id: 'payments',
    label: 'Payments & Finance',
    icon: <PaymentIcon size={20} />,
    children: [
      { id: 'payments-list', label: 'All Transactions', icon: <></>, href: '/admin/payments' },
      { id: 'payments-pending', label: 'Pending Payments', icon: <></>, href: '/admin/payments/pending', badge: '5' },
      { id: 'payments-refunds', label: 'Refunds', icon: <></>, href: '/admin/payments/refunds' },
      { id: 'payments-reports', label: 'Financial Reports', icon: <></>, href: '/admin/payments/reports' },
    ],
  },
  {
    id: 'fees',
    label: 'Fees Management',
    icon: <FeeIcon size={20} />,
    href: '/admin/fees',
  },
  {
    id: 'discounts',
    label: 'Discounts & Offers',
    icon: <DiscountIcon size={20} />,
    href: '/admin/discounts',
  },
  {
    id: 'invoices',
    label: 'Invoice Management',
    icon: <InvoiceIcon size={20} />,
    href: '/admin/invoices',
  },
  {
    id: 'users',
    label: 'User Management',
    icon: <UserManagementIcon size={20} />,
    href: '/admin/users',
  },
  {
    id: 'audit',
    label: 'Audit Logs',
    icon: <AuditIcon size={20} />,
    href: '/admin/audit',
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: <ReportsIcon size={20} />,
    children: [
      { id: 'reports-overview', label: 'Overview', icon: <></>, href: '/admin/reports' },
      { id: 'reports-financial', label: 'Financial Reports', icon: <></>, href: '/admin/reports/financial' },
      { id: 'reports-operational', label: 'Operational Reports', icon: <></>, href: '/admin/reports/operational' },
      { id: 'reports-analytics', label: 'Analytics', icon: <></>, href: '/admin/reports/analytics' },
    ],
  },
  {
    id: 'settings',
    label: 'System & Configuration',
    icon: <SettingsIcon size={20} />,
    children: [
      { id: 'settings-general', label: 'General Settings', icon: <></>, href: '/admin/settings' },
      { id: 'settings-api', label: 'API Integrations', icon: <></>, href: '/admin/settings/api' },
      { id: 'settings-cms', label: 'CMS Content', icon: <></>, href: '/admin/settings/cms' },
      { id: 'settings-loyalty', label: 'Loyalty Points', icon: <></>, href: '/admin/settings/loyalty' },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);
  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const sidebarStyles: React.CSSProperties = {
    width: isCollapsed ? '80px' : '280px',
    height: '100vh',
    backgroundColor: colors.background.primary,
    borderRight: `1px solid ${colors.border.light}`,
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000,
    overflow: 'hidden',
  };

  const logoStyles: React.CSSProperties = {
    padding: '1.5rem',
    borderBottom: `1px solid ${colors.border.light}`,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    minHeight: '80px',
  };

  const menuStyles: React.CSSProperties = {
    flex: 1,
    padding: '1rem 0',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const menuItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.5rem',
    color: colors.text.secondary,
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: 0,
    position: 'relative',
  };

  const activeMenuItemStyles: React.CSSProperties = {
    ...menuItemStyles,
    backgroundColor: colors.primary[50],
    color: colors.primary[600],
    borderRight: `3px solid ${colors.primary[500]}`,
  };

  const userSectionStyles: React.CSSProperties = {
    padding: '1rem 1.5rem',
    borderTop: `1px solid ${colors.border.light}`,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const MenuItem: React.FC<{ item: MenuItem; level?: number }> = ({ item, level = 0 }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const itemIsActive = isActive(item.href);

    const itemStyle = {
      ...menuItemStyles,
      paddingLeft: `${1.5 + level * 1}rem`,
      ...(itemIsActive ? activeMenuItemStyles : {}),
    };

    if (hasChildren) {
      return (
        <div key={item.id}>
          <div
            style={itemStyle}
            onClick={() => toggleExpanded(item.id)}
          >
            {item.icon}
            {!isCollapsed && (
              <>
                <span style={{ flex: 1 }}>{item.label}</span>
                <div
                  style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <ChevronDownIcon size={16} />
                </div>
              </>
            )}
          </div>
          {!isCollapsed && isExpanded && (
            <div>
              {item.children?.map(child => (
                <MenuItem key={child.id} item={child} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link href={item.href || '#'} key={item.id}>
        <div style={itemStyle}>
          {item.icon}
          {!isCollapsed && (
            <>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    backgroundColor: colors.error,
                    color: 'white',
                    fontSize: '0.75rem',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '999px',
                    minWidth: '1.25rem',
                    textAlign: 'center',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div style={sidebarStyles}>
      {/* Logo Section */}
      <div style={logoStyles}>
        <div
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: colors.primary[500],
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.25rem',
          }}
        >
          E
        </div>
        {!isCollapsed && (
          <div>
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              color: colors.text.primary 
            }}>
              EChanneling
            </h2>
            <p style={{ 
              margin: 0, 
              fontSize: '0.75rem', 
              color: colors.text.secondary 
            }}>
              Admin Dashboard
            </p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div style={menuStyles}>
        {menuItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>

      {/* User Section */}
      <div style={userSectionStyles}>
        <div
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: colors.primary[100],
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.primary[600],
            fontWeight: '600',
            fontSize: '0.875rem',
          }}
        >
          {session?.user?.name?.charAt(0) || 'A'}
        </div>
        {!isCollapsed && (
          <div style={{ flex: 1 }}>
            <p style={{ 
              margin: 0, 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: colors.text.primary 
            }}>
              {session?.user?.name || 'Admin'}
            </p>
            <p style={{ 
              margin: 0, 
              fontSize: '0.75rem', 
              color: colors.text.secondary 
            }}>
              Administrator
            </p>
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.text.secondary,
              padding: '0.25rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Logout"
          >
            <LogoutIcon size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
