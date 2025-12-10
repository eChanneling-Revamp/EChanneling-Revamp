"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Building2,
  Users,
  CalendarDays,
  BadgeDollarSign,
  UserCircle,
  Menu,
  X,
  LogOut,
  Bell,
  Hospital,
  FileText,
  Home,
  ClipboardList,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Menu Definitions for each role ---
const platformAdminMenu = [
  {
    title: "Platform Overview",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/admin/dashboard",
  },
  {
    title: "All Hospitals",
    icon: <Building2 className="w-5 h-5" />,
    path: "/admin/hospitals",
  },
  {
    title: "All Staff",
    icon: <Users className="w-5 h-5" />,
    path: "/admin/staff",
  },
  {
    title: "All Sessions",
    icon: <CalendarDays className="w-5 h-5" />,
    path: "/admin/sessions",
  },
  {
    title: "All Settlements",
    icon: <BadgeDollarSign className="w-5 h-5" />,
    path: "/admin/settlements",
  },
  {
    title: "My Profile",
    icon: <UserCircle className="w-5 h-5" />,
    path: "/profile",
  },
];

const hospitalAdminMenu = [
  {
    title: "Hospital Dashboard",
    icon: <Hospital className="w-5 h-5" />,
    path: "/hospital/dashboard",
  },
  {
    title: "Our Hospital Profile",
    icon: <Building2 className="w-5 h-5" />,
    path: "/hospital/profile",
  },
  {
    title: "Our Medical Staff",
    icon: <Users className="w-5 h-5" />,
    path: "/hospital/staff",
  },
  {
    title: "Doctor Sessions",
    icon: <CalendarDays className="w-5 h-5" />,
    path: "/hospital/sessions",
  },
  {
    title: "Doctor Settlements",
    icon: <BadgeDollarSign className="w-5 h-5" />,
    path: "/hospital/settlements",
  },
  {
    title: "My Profile",
    icon: <UserCircle className="w-5 h-5" />,
    path: "/profile",
  },
];

const doctorMenu = [
  {
    title: "My Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/doctor/dashboard",
  },
  {
    title: "My Sessions",
    icon: <CalendarDays className="w-5 h-5" />,
    path: "/doctor/sessions",
  },
  {
    title: "My Hospitals",
    icon: <Hospital className="w-5 h-5" />,
    path: "/doctor/hospitals",
  },
  {
    title: "My Appointments",
    icon: <ClipboardList className="w-5 h-5" />,
    path: "/doctor/appointments",
  },
  {
    title: "My Settlements",
    icon: <BadgeDollarSign className="w-5 h-5" />,
    path: "/doctor/settlements",
  },
  {
    title: "My Profile",
    icon: <UserCircle className="w-5 h-5" />,
    path: "/doctor/profile",
  },
];

const patientMenu = [
  {
    title: "Home",
    icon: <Home className="w-5 h-5" />,
    path: "/user/dashboard",
  },
  {
    title: "Hospitals",
    icon: <Hospital className="w-5 h-5" />,
    path: "/user/hospitals",
  },
  {
    title: "Book Appointments",
    icon: <BookOpen className="w-5 h-5" />,
    path: "/user/book",
  },
  {
    title: "My Bookings",
    icon: <FileText className="w-5 h-5" />,
    path: "/user/bookings",
  },
  {
    title: "My Profile",
    icon: <UserCircle className="w-5 h-5" />,
    path: "/profile",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("User");
  const [userEmail, setUserEmail] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();

  // Get user data from localStorage
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setUserRole(userData.role?.toLowerCase() || null);
        setUserName(userData.first_name || userData.email || "User");
        setUserEmail(userData.email || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Detect active role from pathname
  const activeRole = pathname.startsWith("/admin")
    ? "admin"
    : pathname.startsWith("/hospital")
    ? "hospital"
    : pathname.startsWith("/doctor")
    ? "doctor"
    : pathname.startsWith("/user")
    ? "user"
    : "admin";

  // Set menu items based on active role
  let menuItems = platformAdminMenu;
  if (activeRole === "hospital") menuItems = hospitalAdminMenu;
  else if (activeRole === "doctor") menuItems = doctorMenu;
  else if (activeRole === "user") menuItems = patientMenu;

  // Handle dashboard switch - navigate to the role's dashboard
  const handleDashboardSwitch = (role: string, path: string) => {
    router.push(path);
    setSidebarOpen(false);
  };

  // Check if user has access to a specific role dashboard
  const canAccessRole = (role: string) => {
    if (!userRole) return false;

    // Super admin and admin can access all dashboards
    if (userRole === "super_admin" || userRole === "admin") {
      return true;
    }

    // Map user roles to accessible dashboards
    const roleAccess: Record<string, string[]> = {
      doctor: ["doctor", "user"],
      hospital: ["hospital"],
      nurse: ["user"],
      patient: ["user"],
      user: ["user"],
    };

    return roleAccess[userRole]?.includes(role) || false;
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    document.cookie = "authToken=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#013e7f] text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 border-b border-blue-800 flex items-center px-4 relative overflow-hidden">
            <div className="flex items-center gap-3 transition-all duration-300">
              <Activity
                className={`h-8 w-8 flex-shrink-0 transition-all duration-300 ${
                  sidebarCollapsed ? "opacity-0 w-0" : "opacity-100"
                }`}
              />
              <span
                className={`text-xl font-bold whitespace-nowrap transition-all duration-300 ${
                  sidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                }`}
              >
                eChanneling
              </span>
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute right-2 p-6 rounded-lg hover:bg-white/10 transition-all duration-200 hidden lg:block"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  pathname === item.path
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                } ${sidebarCollapsed ? "justify-center" : ""}`}
                title={sidebarCollapsed ? item.title : ""}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span
                  className={`whitespace-nowrap transition-all duration-300 ${
                    sidebarCollapsed
                      ? "opacity-0 w-0 overflow-hidden"
                      : "opacity-100 w-auto"
                  }`}
                >
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-blue-800">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
              title={sidebarCollapsed ? "Logout" : ""}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  sidebarCollapsed
                    ? "opacity-0 w-0 overflow-hidden"
                    : "opacity-100 w-auto"
                }`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div className="flex items-center gap-4 ml-auto">
              {/* Dashboard Switcher Buttons - Only show accessible roles */}
              <div className="flex gap-2 flex-wrap">
                {canAccessRole("admin") && (
                  <button
                    onClick={() =>
                      handleDashboardSwitch("admin", "/admin/dashboard")
                    }
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      activeRole === "admin"
                        ? "bg-[#013e7f] text-white"
                        : "bg-gray-100 text-[#013e7f] hover:bg-blue-50"
                    }`}
                  >
                    Platform Admin
                  </button>
                )}
                {canAccessRole("hospital") && (
                  <button
                    onClick={() =>
                      handleDashboardSwitch("hospital", "/hospital/dashboard")
                    }
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      activeRole === "hospital"
                        ? "bg-[#013e7f] text-white"
                        : "bg-gray-100 text-[#013e7f] hover:bg-blue-50"
                    }`}
                  >
                    Hospital Admin
                  </button>
                )}
                {canAccessRole("doctor") && (
                  <button
                    onClick={() =>
                      handleDashboardSwitch("doctor", "/doctor/dashboard")
                    }
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      activeRole === "doctor"
                        ? "bg-[#013e7f] text-white"
                        : "bg-gray-100 text-[#013e7f] hover:bg-blue-50"
                    }`}
                  >
                    Doctor
                  </button>
                )}
                {canAccessRole("user") && (
                  <button
                    onClick={() =>
                      handleDashboardSwitch("user", "/user/dashboard")
                    }
                    className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                      activeRole === "user"
                        ? "bg-[#013e7f] text-white"
                        : "bg-gray-100 text-[#013e7f] hover:bg-blue-50"
                    }`}
                  >
                    Patient
                  </button>
                )}
              </div>
              <button className="text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
              </button>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 focus:outline-none">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src="" alt={userName} />
                      <AvatarFallback className="bg-blue-600 text-white font-semibold">
                        {userName[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {userName}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {userRole === "super_admin"
                          ? "Super Admin"
                          : userRole || "User"}
                      </div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white" align="end">
                  <DropdownMenuLabel className="font-semibold text-gray-900">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{userEmail}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="cursor-pointer text-gray-900"
                  >
                    <UserCircle className="mr-2 h-4 w-4 text-gray-700" />
                    <span className="font-medium text-gray-900">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive"
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-600">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
