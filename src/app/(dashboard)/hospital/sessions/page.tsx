"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";

interface Session {
  _id: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  fee: number;
  status: string;
  room?: string;
  currentAppointments?: number;
  maxAppointments?: number;
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
  const [sessions, setSessions] = useState<Session[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [hospitalId, setHospitalId] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterSpecialization, setFilterSpecialization] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    status: "scheduled",
  });

  // Fetch all sessions
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions");
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

  // Fetch nurses for the hospital (placeholder - you'll need to create this API)
  const fetchNurses = async () => {
    try {
      // TODO: Implement nurse API endpoint similar to doctors
      // For now, using mock data
      setNurses([
        { id: "nurse1", name: "Sarah Johnson" },
        { id: "nurse2", name: "Michael Chen" },
        { id: "nurse3", name: "Emily Davis" },
      ]);
    } catch (error) {
      console.error("Error fetching nurses:", error);
    }
  };

  // Cancel session
  const cancelSession = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this session?")) return;
    const res = await fetch(`/api/sessions?id=${id}&action=cancel`, {
      method: "PUT",
    });
    if (res.ok) {
      alert("Session cancelled successfully!");
      fetchSessions();
    } else {
      alert("Failed to cancel session!");
    }
  };

  // Create new session
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.doctorId || !form.nurseId || !form.startTime || !form.endTime) {
      alert("Please fill all required fields");
      return;
    }

    if (!hospitalId) {
      alert("Hospital information not found");
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
        status: form.status || "scheduled",
      }),
    });
    if (res.ok) {
      alert("Session created successfully!");
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
        status: "scheduled",
      });
      setIsDialogOpen(false);
      fetchSessions();
    } else {
      const errorData = await res.json();
      alert(`Error creating session: ${errorData.message || "Unknown error"}`);
    }
  };

  // Filter sessions
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySessions = (sessions || []).filter((s) => {
    const sessionDate = new Date(s.date);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime() && s.status === "active";
  });

  const upcomingSessions = (sessions || []).filter((s) => {
    const sessionDate = new Date(s.date);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() > today.getTime() && s.status === "active";
  });

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
                    placeholder="Search doctor or session"
                    className="bg-white px-2 py-2 text-base focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0"
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
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Specializations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDate} onValueChange={setFilterDate}>
                <SelectTrigger className="w-[180px]">
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
                  <DialogContent className="w-[95vw] max-w-none h-[75vh] overflow-y-auto rounded-xl">
                    <DialogHeader>
                      <DialogTitle>Create New Session</DialogTitle>
                      <DialogDescription>
                        Fill in the details to schedule a new doctor session
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                        {/* Doctor Selection */}
                        <div className="space-y-4">
                          <Label htmlFor="doctorId">Doctor *</Label>
                          <Select
                            value={form.doctorId}
                            onValueChange={(value) => {
                              const selectedDoctor = doctors.find(
                                (d) => d.id === value
                              );
                              if (selectedDoctor) {
                                setForm({
                                  ...form,
                                  doctorId: value,
                                  doctorName: selectedDoctor.name,
                                  specialization: selectedDoctor.specialization,
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a doctor" />
                            </SelectTrigger>
                            <SelectContent>
                              {doctors.length === 0 ? (
                                <SelectItem value="no-doctors" disabled>
                                  No doctors available
                                </SelectItem>
                              ) : (
                                doctors.map((doctor) => (
                                  <SelectItem key={doctor.id} value={doctor.id}>
                                    Dr. {doctor.name} - {doctor.specialization}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Nurse Selection */}
                        <div className="space-y-4">
                          <Label htmlFor="nurseId">Nurse *</Label>
                          <Select
                            value={form.nurseId}
                            onValueChange={(value) => {
                              const selectedNurse = nurses.find(
                                (n) => n.id === value
                              );
                              if (selectedNurse) {
                                setForm({
                                  ...form,
                                  nurseId: value,
                                  nurseName: selectedNurse.name,
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a nurse" />
                            </SelectTrigger>
                            <SelectContent>
                              {nurses.length === 0 ? (
                                <SelectItem value="no-nurses" disabled>
                                  No nurses available
                                </SelectItem>
                              ) : (
                                nurses.map((nurse) => (
                                  <SelectItem key={nurse.id} value={nurse.id}>
                                    {nurse.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Specialization (Read-only) */}
                        <div className="space-y-4">
                          <Label htmlFor="specialization">Specialization</Label>
                          <Input
                            id="specialization"
                            type="text"
                            value={form.specialization}
                            readOnly
                            className="bg-gray-50"
                            placeholder="Auto-filled from doctor"
                          />
                        </div>

                        {/* Start Time */}
                        <div className="space-y-4">
                          <Label htmlFor="startTime">Start Time *</Label>
                          <Input
                            id="startTime"
                            type="datetime-local"
                            value={form.startTime}
                            onChange={(e) =>
                              setForm({ ...form, startTime: e.target.value })
                            }
                            required
                          />
                        </div>

                        {/* End Time */}
                        <div className="space-y-4">
                          <Label htmlFor="endTime">End Time *</Label>
                          <Input
                            id="endTime"
                            type="datetime-local"
                            value={form.endTime}
                            onChange={(e) =>
                              setForm({ ...form, endTime: e.target.value })
                            }
                            required
                          />
                        </div>

                        {/* Capacity */}
                        <div className="space-y-4">
                          <Label htmlFor="capacity">Capacity</Label>
                          <Input
                            id="capacity"
                            type="number"
                            placeholder="20"
                            value={form.capacity}
                            onChange={(e) =>
                              setForm({ ...form, capacity: e.target.value })
                            }
                          />
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                          <Label htmlFor="location">Location/Room</Label>
                          <Input
                            id="location"
                            type="text"
                            placeholder="e.g., Room 204, Building A"
                            value={form.location}
                            onChange={(e) =>
                              setForm({ ...form, location: e.target.value })
                            }
                          />
                        </div>

                        {/* Status */}
                        <div className="space-y-4">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={form.status}
                            onValueChange={(value) =>
                              setForm({ ...form, status: value })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="scheduled">
                                Scheduled
                              </SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          className="h-11 text-base px-6 rounded-lg"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 h-11 text-base px-8 rounded-lg"
                        >
                          Create Session
                        </Button>
                      </DialogFooter>
                    </form>
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

                    return (
                      <div
                        key={session._id}
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
                              Dr. {session.doctorName} -{" "}
                              {session.specialization}
                            </p>
                            <div className="grid grid-cols-3 gap-6 text-sm text-gray-600 mt-1">
                              <div>
                                <p>Time</p>
                                <p className="font-semibold text-gray-800">
                                  {session.time}
                                </p>
                              </div>
                              <div>
                                <p>Room</p>
                                <p className="font-semibold text-gray-800">
                                  {session.room || "Room 204"}
                                </p>
                              </div>
                              <div>
                                <p>Appointments</p>
                                <p className="font-semibold text-gray-800">
                                  {session.currentAppointments || 0}/
                                  {session.maxAppointments || 30}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-blue-200 hover:bg-blue-300 text-blue-600 cursor-pointer"
                          >
                            View
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="bg-red-200 hover:bg-red-300 text-red-700 cursor-pointer"
                            onClick={() => cancelSession(session._id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="rounded-lg bg-white shadow mt-6">
            <CardContent className="p-2">
              <Table>
                <TableHeader>
                  {/* Title row inside the table */}
                  <TableRow className="bg-white">
                    <TableCell
                      colSpan={6}
                      className="text-xl  text-gray-800 text-left py-1"
                    >
                      Upcoming Sessions
                    </TableCell>
                  </TableRow>

                  {/* Column headers */}
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 py-6">
                      DOCTOR
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-6">
                      SPECIALIZATION
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-6">
                      DATE & TIME
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-6">
                      ROOM
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-6">
                      APPOINTMENTS
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 py-6">
                      ACTIONS
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {upcomingSessions.map((session) => (
                    <TableRow key={session._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        Dr. {session.doctorName}
                      </TableCell>
                      <TableCell>{session.specialization}</TableCell>
                      <TableCell>
                        <div>
                          {new Date(session.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.time}
                        </div>
                      </TableCell>
                      <TableCell>{session.room || "Room 204"}</TableCell>
                      <TableCell>
                        {session.currentAppointments || 0}/
                        {session.maxAppointments || 30}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:bg-blue-50 cursor-pointer"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {" "}
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />{" "}
                            </svg>
                            {/* Edit icon SVG */}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:bg-red-50 cursor-pointer"
                            onClick={() => cancelSession(session._id)}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {" "}
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />{" "}
                            </svg>
                            {/* Delete icon SVG */}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
