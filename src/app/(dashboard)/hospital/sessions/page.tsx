"use client";
import { Search, Eye, Edit2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useHospitalStatus } from "@/hooks/useHospitalStatus";
import PendingApprovalScreen from "@/components/hospital/PendingApprovalScreen";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { ToastContainer } from "@/components/ui/toast-container";

interface Session {
  id: string;
  doctorId: string;
  doctorName: string;
  nurseId: string;
  nurseName?: string;
  nurseDetailId?: string;
  capacity?: number;
  location?: string;
  hospitalId: string;
  status?: string;
  createdAt?: string;
  startTime?: string;
  endTime?: string;
}

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  consultationFee: number;
}

interface Nurse {
  id: string;
  name: string;
}

export default function SessionsPage() {
  const { status: hospitalStatus, isLoading: statusLoading } =
    useHospitalStatus();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [hospitalId, setHospitalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    doctorId: "",
    doctorName: "",
    nurseId: "",
    nurseName: "",
    startTime: "",
    endTime: "",
    capacity: "20",
    location: "",
    status: "SCHEDULED",
  });
  const [form, setForm] = useState({
    doctorId: "",
    doctorName: "",
    nurseId: "",
    nurseName: "",
    specialization: "",
    startTime: "",
    endTime: "",
    capacity: "20",
    location: "",
    status: "SCHEDULED",
  });

  // Fetch all sessions for this hospital
  const fetchSessions = async () => {
    setLoading(true);
    try {
      // Get hospital data from localStorage
      const userDataStr = localStorage.getItem("user");
      if (!userDataStr) {
        setSessions([]);
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userDataStr);

      // Fetch hospital ID
      const hospitalResponse = await fetch(
        `/api/hospital/check?email=${userData.email}`
      );
      const hospitalData = await hospitalResponse.json();

      if (!hospitalData.exists || !hospitalData.data) {
        setSessions([]);
        setLoading(false);
        return;
      }

      const currentHospitalId = hospitalData.data.id;

      // Fetch sessions filtered by hospital ID via API
      const res = await fetch(`/api/sessions?hospitalId=${currentHospitalId}`);
      const data = await res.json();

      // Ensure data is always an array
      if (Array.isArray(data)) {
        setSessions(data);
      } else {
        console.error("API returned non-array data:", data);
        setSessions([]);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchDoctors();
    fetchNurses();
  }, []);

  // Fetch doctors for the hospital
  const fetchDoctors = async () => {
    try {
      // Get hospital data from localStorage
      const userDataStr = localStorage.getItem("user");
      if (!userDataStr) return;

      const userData = JSON.parse(userDataStr);

      // Fetch hospital ID
      const hospitalResponse = await fetch(
        `/api/hospital/check?email=${userData.email}`
      );
      const hospitalData = await hospitalResponse.json();

      if (hospitalData.exists && hospitalData.data) {
        const hospitalId = hospitalData.data.id;
        setHospitalId(hospitalId);

        // Fetch doctors for this hospital
        const doctorsResponse = await fetch(
          `/api/hospital/doctor?hospitalId=${hospitalId}`
        );
        const doctorsData = await doctorsResponse.json();

        if (doctorsData.data && Array.isArray(doctorsData.data)) {
          setDoctors(doctorsData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Fetch nurses for the hospital
  const fetchNurses = async () => {
    try {
      // Get hospital data from localStorage
      const userDataStr = localStorage.getItem("user");
      if (!userDataStr) return;

      const userData = JSON.parse(userDataStr);

      // Fetch hospital ID
      const hospitalResponse = await fetch(
        `/api/hospital/check?email=${userData.email}`
      );
      const hospitalData = await hospitalResponse.json();

      if (hospitalData.exists && hospitalData.data) {
        const hospitalId = hospitalData.data.id;

        // Fetch nurses for this hospital
        const nursesResponse = await fetch(
          `/api/hospital/nurse?hospitalId=${hospitalId}`
        );
        const nursesData = await nursesResponse.json();

        if (nursesData.data && Array.isArray(nursesData.data)) {
          setNurses(nursesData.data);
        }
      }
    } catch (error) {
      console.error("Error fetching nurses:", error);
    }
  };

  // Delete session
  const handleDeleteSession = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this session? This action cannot be undone."
      )
    )
      return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/sessions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Session deleted successfully!");
        fetchSessions();
      } else {
        const errorData = await res.json();
        toast.error(
          `Failed to delete session: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session");
    } finally {
      setIsDeleting(null);
    }
  };

  // Update session
  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSession) return;

    setIsUpdating(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updateData = {
        doctorId: formData.get("doctorId") as string,
        nurseId: formData.get("nurseId") as string,
        startTime: new Date(formData.get("startTime") as string).toISOString(),
        endTime: new Date(formData.get("endTime") as string).toISOString(),
        capacity: parseInt(formData.get("capacity") as string) || 20,
        location: (formData.get("location") as string) || null,
        status: (formData.get("status") as string) || "SCHEDULED",
      };

      // Find selected doctor and nurse names
      const selectedDoctor = doctors.find((d) => d.id === updateData.doctorId);
      const selectedNurse = nurses.find((n) => n.id === updateData.nurseId);

      const res = await fetch(`/api/sessions/${selectedSession.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updateData,
          doctorName: selectedDoctor?.name || "",
          nurseName: selectedNurse?.name || "",
          hospitalId: hospitalId,
        }),
      });

      if (res.ok) {
        toast.success("Session updated successfully!");
        setIsEditDialogOpen(false);
        setSelectedSession(null);
        fetchSessions();
      } else {
        const errorData = await res.json();
        toast.error(
          `Error updating session: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error updating session:", error);
      toast.error("Failed to update session");
    } finally {
      setIsUpdating(false);
    }
  };

  // Create new session
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.doctorId || !form.nurseId || !form.startTime || !form.endTime) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!hospitalId) {
      toast.error("Hospital information not found");
      return;
    }

    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId: form.doctorId,
        doctorName: form.doctorName,
        nurseId: form.nurseId,
        nurseName: form.nurseName,
        hospitalId: hospitalId,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        capacity: parseInt(form.capacity) || 20,
        location: form.location || null,
        status: form.status || "SCHEDULED",
      }),
    });
    if (res.ok) {
      toast.success("Session created successfully!");
      setForm({
        doctorId: "",
        doctorName: "",
        nurseId: "",
        nurseName: "",
        specialization: "",
        startTime: "",
        endTime: "",
        capacity: "20",
        location: "",
        status: "SCHEDULED",
      });
      setSelectedSpecialization("");
      setIsDialogOpen(false);
      fetchSessions();
    } else {
      const errorData = await res.json();
      toast.error(
        `Error creating session: ${errorData.message || "Unknown error"}`
      );
    }
  };

  // Filter sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Helper function to check if date matches filter
  const matchesDateFilter = (sessionDate: Date) => {
    if (filterDate === "all") return true;

    const dateToCheck = new Date(sessionDate);
    dateToCheck.setHours(0, 0, 0, 0);

    if (filterDate === "today") {
      return dateToCheck.getTime() === today.getTime();
    }

    if (filterDate === "week") {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
      weekEnd.setHours(23, 59, 59, 999);
      return dateToCheck >= weekStart && dateToCheck <= weekEnd;
    }

    if (filterDate === "month") {
      return (
        dateToCheck.getMonth() === today.getMonth() &&
        dateToCheck.getFullYear() === today.getFullYear()
      );
    }

    return true;
  };

  const todaySessions = (sessions || []).filter((s) => {
    if (!s.startTime) return false;
    const sessionDate = new Date(s.startTime);
    sessionDate.setHours(0, 0, 0, 0);

    // Date filter - only show today's sessions in this section
    if (sessionDate.getTime() !== today.getTime()) return false;

    // Date range filter (today/week/month)
    if (!matchesDateFilter(sessionDate)) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesDoctor = s.doctorName?.toLowerCase().includes(query);
      const matchesNurse = s.nurseName?.toLowerCase().includes(query);
      const matchesLocation = s.location?.toLowerCase().includes(query);
      const doctorSpec = doctors
        .find((d) => d.id === s.doctorId)
        ?.specialization?.toLowerCase();
      const matchesSpecialization = doctorSpec?.includes(query);

      if (
        !matchesDoctor &&
        !matchesNurse &&
        !matchesLocation &&
        !matchesSpecialization
      ) {
        return false;
      }
    }

    // Specialization filter
    if (filterSpecialization !== "all") {
      const doctor = doctors.find((d) => d.id === s.doctorId);
      if (!doctor || doctor.specialization !== filterSpecialization) {
        return false;
      }
    }

    return true;
  });

  const upcomingSessions = (sessions || []).filter((s) => {
    if (!s.startTime) return false;
    const sessionDate = new Date(s.startTime);
    sessionDate.setHours(0, 0, 0, 0);

    // Date filter - only show future sessions in this section
    if (sessionDate.getTime() <= today.getTime()) return false;

    // Date range filter (today/week/month)
    if (!matchesDateFilter(sessionDate)) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesDoctor = s.doctorName?.toLowerCase().includes(query);
      const matchesNurse = s.nurseName?.toLowerCase().includes(query);
      const matchesLocation = s.location?.toLowerCase().includes(query);
      const doctorSpec = doctors
        .find((d) => d.id === s.doctorId)
        ?.specialization?.toLowerCase();
      const matchesSpecialization = doctorSpec?.includes(query);

      if (
        !matchesDoctor &&
        !matchesNurse &&
        !matchesLocation &&
        !matchesSpecialization
      ) {
        return false;
      }
    }

    // Specialization filter
    if (filterSpecialization !== "all") {
      const doctor = doctors.find((d) => d.id === s.doctorId);
      if (!doctor || doctor.specialization !== filterSpecialization) {
        return false;
      }
    }

    return true;
  });

  // Show loading while checking hospital status
  if (statusLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show pending approval screen if hospital status is PENDING
  if (hospitalStatus === "PENDING") {
    return <PendingApprovalScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar on the left */}
      {/* <Sidebar /> */}

      {/* Main area */}
      <div className="flex-1 overflow-auto">
        {/* Header at the top */}
        {/* Header */}
        {/* <Header /> */}

        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Page Title and Controls */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Doctor Sessions Management
            </h2>

            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="grid w-70 gap-4 bg-white p-0 rounded">
                <InputGroup>
                  <InputGroupInput
                    placeholder="Search doctor, nurse, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white px-2 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0"
                  />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <Select
                value={filterSpecialization}
                onValueChange={setFilterSpecialization}
              >
                <SelectTrigger className="w-[200px] text-gray-900">
                  <SelectValue placeholder="All Specializations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {Array.from(new Set(doctors.map((d) => d.specialization)))
                    .sort()
                    .map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select value={filterDate} onValueChange={setFilterDate}>
                <SelectTrigger className="w-[180px] text-gray-900">
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>

              <div className="ml-auto">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-900 hover:bg-blue-950 h-12 w-50 text-lg px-5">
                      <span className="text-3xl mr-2">+</span> Create Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl bg-white p-0 gap-0 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                      <DialogTitle className="text-2xl font-bold text-white">
                        Create New Session
                      </DialogTitle>
                      <DialogDescription className="text-blue-100 text-sm mt-1">
                        Schedule a new doctor session with complete details
                      </DialogDescription>
                    </div>

                    {/* Form Content - Scrollable */}
                    <form
                      onSubmit={handleSubmit}
                      className="flex-1 overflow-y-auto max-h-[calc(90vh-140px)]"
                    >
                      <div className="px-6 py-6 space-y-6">
                        {/* Medical Staff Selection */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Medical Staff
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Specialization Filter */}
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                Filter by Specialization
                              </label>
                              <select
                                value={selectedSpecialization}
                                onChange={(e) => {
                                  setSelectedSpecialization(e.target.value);
                                  setForm({
                                    ...form,
                                    doctorId: "",
                                    doctorName: "",
                                    specialization: "",
                                  });
                                }}
                                className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                              >
                                <option value="all">All Specializations</option>
                                {Array.from(
                                  new Set(doctors.map((d) => d.specialization))
                                ).map((spec) => (
                                  <option key={spec} value={spec}>
                                    {spec}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Doctor Selection */}
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                Select Doctor{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={form.doctorId}
                                onChange={(e) => {
                                  const selectedDoctor = doctors.find(
                                    (d) => d.id === e.target.value
                                  );
                                  if (selectedDoctor) {
                                    setForm({
                                      ...form,
                                      doctorId: e.target.value,
                                      doctorName: selectedDoctor.name,
                                      specialization:
                                        selectedDoctor.specialization,
                                    });
                                  }
                                }}
                                className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                required
                              >
                                <option value="">Choose a doctor</option>
                                {(() => {
                                  const filteredDoctors =
                                    selectedSpecialization &&
                                    selectedSpecialization !== "all"
                                      ? doctors.filter(
                                          (d) =>
                                            d.specialization ===
                                            selectedSpecialization
                                        )
                                      : doctors;

                                  return filteredDoctors.map((doctor) => (
                                    <option key={doctor.id} value={doctor.id}>
                                      Dr. {doctor.name} -{" "}
                                      {doctor.specialization}
                                    </option>
                                  ));
                                })()}
                              </select>
                            </div>

                            {/* Nurse Selection */}
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                Select Nurse{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={form.nurseId}
                                onChange={(e) => {
                                  const selectedNurse = nurses.find(
                                    (n) => n.id === e.target.value
                                  );
                                  if (selectedNurse) {
                                    setForm({
                                      ...form,
                                      nurseId: e.target.value,
                                      nurseName: selectedNurse.name,
                                    });
                                  }
                                }}
                                className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                required
                              >
                                <option value="">Choose a nurse</option>
                                {nurses.map((nurse) => (
                                  <option key={nurse.id} value={nurse.id}>
                                    {nurse.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Session Timing */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Session Timing
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Start Time */}
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                Start Time{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="datetime-local"
                                value={form.startTime}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    startTime: e.target.value,
                                  })
                                }
                                className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                required
                              />
                            </div>

                            {/* End Time */}
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                End Time <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="datetime-local"
                                value={form.endTime}
                                onChange={(e) =>
                                  setForm({ ...form, endTime: e.target.value })
                                }
                                className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Additional Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Capacity */}
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                Patient Capacity
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                placeholder="20"
                                value={form.capacity}
                                onChange={(e) =>
                                  setForm({ ...form, capacity: e.target.value })
                                }
                                className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                              />
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                Location/Room
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., Room 204"
                                value={form.location}
                                onChange={(e) =>
                                  setForm({ ...form, location: e.target.value })
                                }
                                className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                              />
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                Status
                              </label>
                              <select
                                value={form.status}
                                onChange={(e) =>
                                  setForm({ ...form, status: e.target.value })
                                }
                                className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                              >
                                <option value="SCHEDULED">Scheduled</option>
                                <option value="PAUSED">Paused</option>
                                <option value="ONGOING">Ongoing</option>
                                <option value="ENDED">Ended</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setSelectedSpecialization("");
                        }}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create Session
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Today's Sessions */}
          <Card className="rounded-lg bg-white shadow">
            <CardContent className="p-3">
              <h3 className="text-xl  text-gray-800 mb-4">Today's Sessions</h3>
              <hr className="border-gray-300 mb-4" />
              {loading ? (
                <p className="text-gray-600">Loading sessions...</p>
              ) : todaySessions.length === 0 ? (
                <p className="text-gray-600">
                  No sessions scheduled for today.
                </p>
              ) : (
                <div className="space-y-2">
                  {todaySessions.map((session, index) => {
                    const rowColors = [
                      "bg-blue-50",
                      "bg-cyan-50",
                      "bg-green-50",
                    ];
                    const colorIndex = index % rowColors.length;

                    const startTime = session.startTime
                      ? new Date(session.startTime)
                      : null;
                    const endTime = session.endTime
                      ? new Date(session.endTime)
                      : null;
                    const timeString =
                      startTime && endTime
                        ? `${startTime.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} - ${endTime.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : "Time not set";

                    return (
                      <div
                        key={session.id}
                        className={`flex items-center justify-between p-4 rounded ${rowColors[colorIndex]}`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 bg-blue-400 rounded-lg">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <line
                                x1="16"
                                y1="2"
                                x2="16"
                                y2="6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <line
                                x1="8"
                                y1="2"
                                x2="8"
                                y2="6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <line
                                x1="3"
                                y1="10"
                                x2="21"
                                y2="10"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              Dr. {session.doctorName}
                            </p>
                            <div className="grid grid-cols-3 gap-6 text-sm text-gray-600 mt-1">
                              <div>
                                <p>Time</p>
                                <p className="font-semibold text-gray-800">
                                  {timeString}
                                </p>
                              </div>
                              <div>
                                <p>Location</p>
                                <p className="font-semibold text-gray-800">
                                  {session.location || "Not specified"}
                                </p>
                              </div>
                              <div>
                                <p>Capacity</p>
                                <p className="font-semibold text-gray-800">
                                  {session.capacity || 20} patients
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedSession(session);
                              setIsViewDialogOpen(true);
                            }}
                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSession(session);
                              setIsEditDialogOpen(true);
                            }}
                            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                            title="Edit Session"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            disabled={isDeleting === session.id}
                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Session"
                          >
                            {isDeleting === session.id ? (
                              <svg
                                className="animate-spin h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Sessions */}
          <Card className="rounded-lg bg-white shadow mt-6">
            <CardContent className="p-3">
              <h3 className="text-xl text-gray-800 mb-4">Upcoming Sessions</h3>
              <hr className="border-gray-300 mb-4" />
              {loading ? (
                <p className="text-gray-600">Loading sessions...</p>
              ) : upcomingSessions.length === 0 ? (
                <p className="text-gray-600">No upcoming sessions scheduled.</p>
              ) : (
                <div className="space-y-2">
                  {upcomingSessions.map((session, index) => {
                    const rowColors = [
                      "bg-blue-50",
                      "bg-cyan-50",
                      "bg-green-50",
                    ];
                    const colorIndex = index % rowColors.length;
                    const startTime = session.startTime
                      ? new Date(session.startTime)
                      : null;
                    const endTime = session.endTime
                      ? new Date(session.endTime)
                      : null;
                    const timeString =
                      startTime && endTime
                        ? `${startTime.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} - ${endTime.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : "Time not set";
                    const dateString = startTime
                      ? startTime.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Date not set";

                    return (
                      <div
                        key={session.id}
                        className={`flex items-center justify-between p-4 rounded ${rowColors[colorIndex]}`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 bg-blue-400 rounded-lg">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <line
                                x1="16"
                                y1="2"
                                x2="16"
                                y2="6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <line
                                x1="8"
                                y1="2"
                                x2="8"
                                y2="6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <line
                                x1="3"
                                y1="10"
                                x2="21"
                                y2="10"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              Dr. {session.doctorName}
                            </p>
                            <div className="grid grid-cols-4 gap-6 text-sm text-gray-600 mt-1">
                              <div>
                                <p>Date</p>
                                <p className="font-semibold text-gray-800">
                                  {dateString}
                                </p>
                              </div>
                              <div>
                                <p>Time</p>
                                <p className="font-semibold text-gray-800">
                                  {timeString}
                                </p>
                              </div>
                              <div>
                                <p>Location</p>
                                <p className="font-semibold text-gray-800">
                                  {session.location || "Not specified"}
                                </p>
                              </div>
                              <div>
                                <p>Capacity</p>
                                <p className="font-semibold text-gray-800">
                                  {session.capacity || 20} patients
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedSession(session);
                              setIsViewDialogOpen(true);
                            }}
                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSession(session);
                              setIsEditDialogOpen(true);
                            }}
                            className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                            title="Edit Session"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            disabled={isDeleting === session.id}
                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Session"
                          >
                            {isDeleting === session.id ? (
                              <svg
                                className="animate-spin h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Session Dialog */}
      {isViewDialogOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Session Details
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  View session information
                </p>
              </div>
              <button
                onClick={() => setIsViewDialogOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      Doctor
                    </p>
                    <p className="text-base text-gray-900 mt-1">
                      Dr. {selectedSession.doctorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Nurse</p>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedSession.nurseName || "Not assigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      Start Time
                    </p>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedSession.startTime
                        ? new Date(selectedSession.startTime).toLocaleString(
                            "en-US",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )
                        : "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      End Time
                    </p>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedSession.endTime
                        ? new Date(selectedSession.endTime).toLocaleString(
                            "en-US",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )
                        : "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      Location
                    </p>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedSession.location || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      Capacity
                    </p>
                    <p className="text-base text-gray-900 mt-1">
                      {selectedSession.capacity || 20} patients
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      Status
                    </p>
                    <p className="text-base text-gray-900 mt-1 capitalize">
                      {selectedSession.status || "SCHEDULED"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsViewDialogOpen(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Dialog */}
      {isEditDialogOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Edit Session</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Update session information
                </p>
              </div>
              <button
                onClick={() => setIsEditDialogOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form Content - Scrollable */}
            <form
              onSubmit={handleUpdateSession}
              className="flex-1 overflow-y-auto"
            >
              <div className="px-6 py-6 space-y-6">
                {/* Medical Staff Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Medical Staff
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Select Doctor <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="doctorId"
                        defaultValue={selectedSession.doctorId}
                        className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                      >
                        <option value="">Choose a doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            Dr. {doctor.name} - {doctor.specialization}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Select Nurse <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="nurseId"
                        defaultValue={selectedSession.nurseDetailId}
                        className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                      >
                        <option value="">Choose a nurse</option>
                        {nurses.map((nurse) => (
                          <option key={nurse.id} value={nurse.id}>
                            {nurse.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Session Timing */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Session Timing
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Start Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="startTime"
                        type="datetime-local"
                        defaultValue={
                          selectedSession.startTime
                            ? new Date(selectedSession.startTime)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        End Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="endTime"
                        type="datetime-local"
                        defaultValue={
                          selectedSession.endTime
                            ? new Date(selectedSession.endTime)
                                .toISOString()
                                .slice(0, 16)
                            : ""
                        }
                        className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Additional Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Patient Capacity
                      </label>
                      <input
                        name="capacity"
                        type="number"
                        min="1"
                        max="100"
                        defaultValue={selectedSession.capacity || 20}
                        className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Location/Room
                      </label>
                      <input
                        name="location"
                        type="text"
                        placeholder="e.g., Room 204"
                        defaultValue={selectedSession.location || ""}
                        className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Status
                      </label>
                      <select
                        name="status"
                        defaultValue={selectedSession.status || "SCHEDULED"}
                        className="w-full h-11 px-4 text-base text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="PAUSED">Paused</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="ENDED">Ended</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isUpdating}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Update Session"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
