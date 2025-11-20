"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Activity, LayoutDashboard, Building2, Users, CalendarDays, BadgeDollarSign, UserCircle,
  Menu, X, LogOut, Bell, Hospital,  FileText, Home, ClipboardList, BookOpen,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// --- Menu Definitions for each role ---
const platformAdminMenu = [
  { title: 'Platform Overview', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin/dashboard' },
  { title: 'All Hospitals', icon: <Building2 className="w-5 h-5" />, path: '/admin/hospitals' },
  { title: 'All Staff', icon: <Users className="w-5 h-5" />, path: '/admin/staff' },
  { title: 'All Sessions', icon: <CalendarDays className="w-5 h-5" />, path: '/admin/sessions' },
  { title: 'All Settlements', icon: <BadgeDollarSign className="w-5 h-5" />, path: '/admin/settlements' },
  { title: 'My Profile', icon: <UserCircle className="w-5 h-5" />, path: '/profile' },
];

const hospitalAdminMenu = [
  { title: 'Hospital Dashboard', icon: <Hospital className="w-5 h-5" />, path: '/hospital/dashboard' },
  { title: 'Our Hospital Profile', icon: <Building2 className="w-5 h-5" />, path: '/hospital/profile' },
  { title: 'Our Medical Staff', icon: <Users className="w-5 h-5" />, path: '/hospital/staff' },
  { title: 'Doctor Sessions', icon: <CalendarDays className="w-5 h-5" />, path: '/hospital/sessions' },
  { title: 'Doctor Settlements', icon: <BadgeDollarSign className="w-5 h-5" />, path: '/hospital/settlements' },
  { title: 'My Profile', icon: <UserCircle className="w-5 h-5" />, path: '/profile' },
];

const doctorMenu = [
  { title: 'My Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/doctor/dashboard' },
  { title: 'My Sessions', icon: <CalendarDays className="w-5 h-5" />, path: '/doctor/sessions' },
  { title: 'My Hospitals', icon: <Hospital className="w-5 h-5" />, path: '/doctor/hospitals' },
  { title: 'My Appointments', icon: <ClipboardList className="w-5 h-5" />, path: '/doctor/appointments' },
  { title: 'My Settlements', icon: <BadgeDollarSign className="w-5 h-5" />, path: '/doctor/settlements' },
  { title: 'My Profile', icon: <UserCircle className="w-5 h-5" />, path: '/profile' },
];

const patientMenu = [
  { title: 'Home', icon: <Home className="w-5 h-5" />, path: '/user/dashboard' },
  { title: 'Hospitals', icon: <Hospital className="w-5 h-5" />, path: '/user/hospitals' },
  { title: 'Book Appointments', icon: <BookOpen className="w-5 h-5" />, path: '/user/book' },
  { title: 'My Bookings', icon: <FileText className="w-5 h-5" />, path: '/user/bookings' },
  { title: 'My Profile', icon: <UserCircle className="w-5 h-5" />, path: '/profile' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Detect active role from pathname
  const activeRole = pathname.startsWith('/admin') ? 'admin'
    : pathname.startsWith('/hospital') ? 'hospital'
    : pathname.startsWith('/doctor') ? 'doctor'
    : pathname.startsWith('/user') ? 'user'
    : 'admin';

  // Set menu items based on active role
  let menuItems = platformAdminMenu;
  if (activeRole === 'hospital') menuItems = hospitalAdminMenu;
  else if (activeRole === 'doctor') menuItems = doctorMenu;
  else if (activeRole === 'user') menuItems = patientMenu;

  // Handle dashboard switch - navigate to the role's dashboard
  const handleDashboardSwitch = (role: string, path: string) => {
    router.push(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-[#013e7f] text-white transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 border-b border-blue-800 flex items-center px-4 relative overflow-hidden">
            <div className="flex items-center gap-3 transition-all duration-300">
              <Activity className={`h-8 w-8 flex-shrink-0 transition-all duration-300 ${
                sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'
              }`} />
              <span className={`text-xl font-bold whitespace-nowrap transition-all duration-300 ${
                sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}>
                eChanneling
              </span>
            </div>
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute right-2 p-6 rounded-lg hover:bg-white/10 transition-all duration-200 hidden lg:block"
            >
              {sidebarCollapsed ? 
                <ChevronRight className="h-5 w-5" /> : 
                <ChevronLeft className="h-5 w-5" />
              }
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === item.path
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? item.title : ''}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className={`whitespace-nowrap transition-all duration-300 ${
                  sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
                }`}>
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-blue-800">
            <button
              onClick={() => router.push('/')}
              className={`flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
              title={sidebarCollapsed ? 'Exit Dashboard' : ''}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={`whitespace-nowrap transition-all duration-300 ${
                sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
              }`}>
                Exit Dashboard
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center gap-4 ml-auto">
              {/* Dashboard Switcher Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={() => handleDashboardSwitch('admin', '/admin/dashboard')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    activeRole === 'admin'
                      ? "bg-[#013e7f] text-white" 
                      : "bg-gray-100 text-[#013e7f] hover:bg-blue-50"
                  }`}
                >
                  Platform Admin
                </button>
                <button 
                  onClick={() => handleDashboardSwitch('hospital', '/hospital/dashboard')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    activeRole === 'hospital'
                      ? "bg-[#013e7f] text-white" 
                      : "bg-gray-100 text-[#013e7f] hover:bg-blue-50"
                  }`}
                >
                  Hospital Admin
                </button>
                <button 
                  onClick={() => handleDashboardSwitch('doctor', '/doctor/dashboard')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    activeRole === 'doctor'
                      ? "bg-[#013e7f] text-white" 
                      : "bg-gray-100 text-[#013e7f] hover:bg-blue-50"
                  }`}
                >
                  Doctor
                </button>
                <button 
                  onClick={() => handleDashboardSwitch('user', '/user/dashboard')}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    activeRole === 'user'
                      ? "bg-[#013e7f] text-white" 
                      : "bg-gray-100 text-[#013e7f] hover:bg-blue-50"
                  }`}
                >
                  Patient
                </button>
              </div>
              <button className="text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {activeRole[0].toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">
                    {activeRole === 'admin' ? 'Admin User' : 
                     activeRole === 'hospital' ? 'Hospital Admin' :
                     activeRole === 'doctor' ? 'Doctor User' : 'Patient User'}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">{activeRole}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}