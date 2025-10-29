"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Activity, LayoutDashboard, Building2, Users, CalendarDays, BadgeDollarSign, UserCircle,
  Menu, X, LogOut, Bell, Hospital, Stethoscope, FileText, Home, ClipboardList, BookOpen,
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

// --- Dashboard Switcher for Top Bar ---
const dashboardSwitch = [
  { label: "Platform Admin", path: "/admin/dashboard", roles: ["admin"] },
  { label: "Hospital Admin", path: "/hospital/dashboard", roles: ["hospital"] },
  { label: "Doctor", path: "/doctor/dashboard", roles: ["doctor"] },
  { label: "Patient", path: "/user/dashboard", roles: ["user"] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeRole, setActiveRole] = useState('admin'); // Track active role
  const pathname = usePathname();
  const router = useRouter();

  // Set menu items based on active role
  let menuItems = platformAdminMenu; // Default to admin menu
  if (activeRole === 'hospital') menuItems = hospitalAdminMenu;
  else if (activeRole === 'doctor') menuItems = doctorMenu;
  else if (activeRole === 'user') menuItems = patientMenu;

  // Handle dashboard switch
  const handleDashboardSwitch = (role: string, path: string) => {
    setActiveRole(role);
    router.push(path);
    setSidebarOpen(false); // Close mobile sidebar after navigation
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar - update to use activeRole's menu items */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#013e7f] text-white transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-blue-800 flex items-center gap-3">
            <Activity className="h-8 w-8" />
            <span className="text-xl font-bold">eChanneling</span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.path
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-blue-800">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Exit Dashboard</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation - update with role switcher */}
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
              <div className="flex gap-2">
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
    </div>
  );
}