"use client";

import { useEffect, useState } from "react";

interface Session {
  _id: string;
  hospital: string;
  roomNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  maxAppointments: number;
  appointmentDuration: number;
  fee: number;
  bookedAppointments: number;
  status: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    hospital: "",
    roomNumber: "",
    date: "",
    startTime: "",
    endTime: "",
    maxAppointments: "",
    appointmentDuration: "",
    fee: "",
  });

  // Fetch all sessions
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions");
      const data = await res.json();
      setSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Create or update session
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.hospital ||
      !form.roomNumber ||
      !form.date ||
      !form.startTime ||
      !form.endTime ||
      !form.maxAppointments ||
      !form.appointmentDuration ||
      !form.fee
    ) {
      alert("Please fill all fields");
      return;
    }

    const sessionData = {
      hospital: form.hospital,
      roomNumber: form.roomNumber,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      maxAppointments: parseInt(form.maxAppointments),
      appointmentDuration: parseInt(form.appointmentDuration),
      fee: parseFloat(form.fee),
    };

    if (editingId) {
      // Update existing session
      const res = await fetch(`/api/sessions?id=${editingId}&action=update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });
      if (res.ok) {
        alert("Session updated successfully!");
        setEditingId(null);
        resetForm();
        fetchSessions();
      } else {
        alert("Error updating session!");
      }
    } else {
      // Create new session
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });
      if (res.ok) {
        alert("Session created successfully!");
        resetForm();
        fetchSessions();
      } else {
        alert("Error creating session!");
      }
    }
  };

  const resetForm = () => {
    setForm({
      hospital: "",
      roomNumber: "",
      date: "",
      startTime: "",
      endTime: "",
      maxAppointments: "",
      appointmentDuration: "",
      fee: "",
    });
    setEditingId(null);
  };

  // Edit session
  const editSession = (session: Session) => {
    setForm({
      hospital: session.hospital,
      roomNumber: session.roomNumber,
      date: session.date ? new Date(session.date).toISOString().split("T")[0] : "",
      startTime: session.startTime ?? "",
      endTime: session.endTime ?? "",
      maxAppointments:
        session.maxAppointments != null ? session.maxAppointments.toString() : "",
      appointmentDuration:
        session.appointmentDuration != null ? session.appointmentDuration.toString() : "",
      fee: session.fee != null ? session.fee.toString() : "",
    });
    setEditingId(session._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (time: string) => {
    return time;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar on the left */}
      {/* <Sidebar /> */}

      {/* Main area */}
      <div className="flex-1 overflow-auto">
        {/* Header at the top */}
        {/* <Header /> */}

        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              My Sessions
            </h2>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-900 text-white rounded-lg p-6 h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-800 transition">
                <div className="mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div className="text-sm font-medium">Create New Session</div>
              </div>
              <div className="bg-cyan-400 text-white rounded-lg p-6 h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-cyan-500 transition">
                <div className="mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <path
                      d="M16 2v4M8 2v4M3 10h18"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-sm font-medium">View Session Calendar</div>
              </div>
              <div className="bg-green-500 text-white rounded-lg p-6 h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-green-600 transition">
                <div className="mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      d="M17 20h5v-2a4 4 0 00-3-3.87"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 20H4v-2a4 4 0 013-3.87"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="text-sm font-medium">View All Appointments</div>
              </div>
            </div>

            {/* Create/Edit Session Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                {editingId ? "Edit Session" : "Create New Session"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital
                    </label>
                    <select
                      value={form.hospital}
                      onChange={(e) =>
                        setForm({ ...form, hospital: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Hospital</option>
                      <option value="Asiri Hospital">Asiri Hospital</option>
                      <option value="Nawaloka Hospital">
                        Nawaloka Hospital
                      </option>
                      <option value="Durdans Hospital">Durdans Hospital</option>
                      <option value="Lanka Hospitals">Lanka Hospitals</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Room 204"
                      value={form.roomNumber}
                      onChange={(e) =>
                        setForm({ ...form, roomNumber: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Appointments
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 30"
                      value={form.maxAppointments}
                      onChange={(e) =>
                        setForm({ ...form, maxAppointments: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={(e) =>
                        setForm({ ...form, startTime: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Duration (minutes)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      value={form.appointmentDuration}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          appointmentDuration: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={(e) =>
                        setForm({ ...form, endTime: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fee (Rs.)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 2500"
                      value={form.fee}
                      onChange={(e) =>
                        setForm({ ...form, fee: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="bg-blue-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition"
                  >
                    {editingId ? "Update Session" : "Create Session"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-600 transition"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                My Upcoming Sessions
              </h3>
              {loading ? (
                <p className="text-gray-500">Loading sessions...</p>
              ) : sessions.filter((s) => s.status === "active").length === 0 ? (
                <p className="text-gray-500">No upcoming sessions available.</p>
              ) : (
                <div className="space-y-4">
                  {sessions
                    .filter((s) => s.status === "active")
                    .map((session) => (
                      <div
                        key={session._id}
                        className="border-l-4 border-cyan-400 bg-gray-50 rounded-lg p-5 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">🏥</span>
                              <h4 className="text-lg font-bold text-gray-800">
                                {session.hospital} - Room {session.roomNumber}
                              </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600 font-medium">
                                  Date & Time
                                </p>
                                <p className="text-gray-800 font-semibold">
                                  {formatDate(session.date)},{" "}
                                  {formatTime(session.startTime)} -{" "}
                                  {formatTime(session.endTime)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 font-medium">
                                  Appointments
                                </p>
                                <p className="text-gray-800 font-semibold">
                                  {session.bookedAppointments}/
                                  {session.maxAppointments} Booked
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 font-medium">Fee</p>
                                <p className="text-gray-800 font-semibold">
                                  Rs.{" "}
                                  {session.fee
                                    ? session.fee.toLocaleString()
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => editSession(session)}
                              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => cancelSession(session._id)}
                              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
