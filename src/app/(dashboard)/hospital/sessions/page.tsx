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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({
    doctorName: "",
    specialization: "",
    date: "",
    time: "",
    fee: "",
    room: "",
    maxAppointments: "30",
  });

  // Fetch all sessions
  const fetchSessions = async () => {
    setLoading(true);
    const res = await fetch("/api/sessions");
    const data = await res.json();
    setSessions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

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
    if (
      !form.doctorName ||
      !form.specialization ||
      !form.date ||
      !form.time ||
      !form.fee
    ) {
      alert("Please fill all required fields");
      return;
    }
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorName: form.doctorName,
        specialization: form.specialization,
        date: form.date,
        time: form.time,
        fee: parseFloat(form.fee),
        room: form.room || "Room 204",
        maxAppointments: parseInt(form.maxAppointments) || 30,
        currentAppointments: 0,
      }),
    });
    if (res.ok) {
      alert("Session created successfully!");
      setForm({
        doctorName: "",
        specialization: "",
        date: "",
        time: "",
        fee: "",
        room: "",
        maxAppointments: "30",
      });
      setIsDialogOpen(false);
      fetchSessions();
    } else {
      alert("Error creating session!");
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
                        <div className="space-y-4">
                          <Label htmlFor="doctorName">Doctor Name *</Label>
                          <Input
                            id="doctorName"
                            type="text"
                            placeholder="Enter doctor name"
                            value={form.doctorName}
                            onChange={(e) =>
                              setForm({ ...form, doctorName: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-4">
                          <Label htmlFor="specialization">
                            Specialization *
                          </Label>
                          <Input
                            id="specialization"
                            type="text"
                            placeholder="e.g., Cardiology"
                            value={form.specialization}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                specialization: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-4">
                          <Label htmlFor="date">Date *</Label>
                          <Input
                            id="date"
                            type="date"
                            value={form.date}
                            onChange={(e) =>
                              setForm({ ...form, date: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-4">
                          <Label htmlFor="time">Time *</Label>
                          <Input
                            id="time"
                            type="text"
                            placeholder="e.g., 09:00 AM - 12:00 PM"
                            value={form.time}
                            onChange={(e) =>
                              setForm({ ...form, time: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-4">
                          <Label htmlFor="fee">Fee (LKR) *</Label>
                          <Input
                            id="fee"
                            type="number"
                            placeholder="Enter consultation fee"
                            value={form.fee}
                            onChange={(e) =>
                              setForm({ ...form, fee: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-4">
                          <Label htmlFor="room">Room</Label>
                          <Input
                            id="room"
                            type="text"
                            placeholder="e.g., Room 204"
                            value={form.room}
                            onChange={(e) =>
                              setForm({ ...form, room: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-4">
                          <Label htmlFor="maxAppointments">
                            Max Appointments
                          </Label>
                          <Input
                            id="maxAppointments"
                            type="number"
                            placeholder="30"
                            value={form.maxAppointments}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                maxAppointments: e.target.value,
                              })
                            }
                          />
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
