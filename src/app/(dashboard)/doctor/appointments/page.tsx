"use client";
import {
  Search,
  Eye,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDoctorStatus } from "@/hooks/useDoctorStatus";
import PendingApprovalScreen from "@/components/doctor/PendingApprovalScreen";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Appointment {
  id: string;
  appointmentNumber: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientNIC?: string;
  patientDateOfBirth?: string;
  patientGender?: "MALE" | "FEMALE" | "OTHER";
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalHistory?: string;
  currentMedications?: string;
  allergies?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  isNewPatient: boolean;
  sessionId: string;
  bookedById: string;
  estimatedWaitTime?: number;
  queuePosition?: number;
  status:
    | "WAITING"
    | "CALLED"
    | "SKIPPED"
    | "ABSENT"
    | "SERVED"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED"
    | "NO_SHOW"
    | "RESCHEDULED"
    | "UNPAID";
  paymentStatus:
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "REFUNDED"
    | "CANCELLED"
    | "UNPAID";
  consultationFee: string;
  totalAmount: string;
  notes?: string;
  cancellationReason?: string;
  cancellationDate?: string;
  createdAt: string;
  updatedAt: string;
  session?: {
    id: string;
    location: string;
    startTime: string;
    endTime: string;
    scheduledAt: string;
    status: string;
    hospitals: {
      name: string;
      address: string;
    };
  };
}

export default function DoctorAppointmentsPage() {
  const router = useRouter();
  const { status, isLoading: statusLoading, needsSetup } = useDoctorStatus();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);
  const [doctorId, setDoctorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [completingAppointmentId, setCompletingAppointmentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!statusLoading && needsSetup) {
      router.push("/doctor-setup");
    }
  }, [needsSetup, statusLoading, router]);

  // Fetch appointments for this doctor's sessions
  const fetchAppointments = async () => {
    if (!doctorId) return;

    setLoading(true);
    try {
      // First, get all sessions for this doctor
      const sessionsRes = await fetch(`/api/sessions?doctorId=${doctorId}`);

      if (!sessionsRes.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const sessions = await sessionsRes.json();
      console.log("📅 Fetched sessions for doctor:", sessions.length);

      if (!sessions || sessions.length === 0) {
        console.log("⚠️ No sessions found for doctor");
        setAppointments([]);
        setFilteredAppointments([]);
        setLoading(false);
        return;
      }

      // Get all appointments for these sessions
      const sessionIds = sessions.map((s: any) => s.id);
      console.log("🔍 Fetching appointments for session IDs:", sessionIds);

      const appointmentsPromises = sessionIds.map((sessionId: string) =>
        fetch(`/api/appointments?sessionId=${sessionId}`).then((res) =>
          res.json(),
        ),
      );

      const appointmentsResults = await Promise.all(appointmentsPromises);

      // Extract appointments from the response (API returns {success, data, count})
      const allAppointments = appointmentsResults.flatMap((result) => {
        if (result && result.data && Array.isArray(result.data)) {
          return result.data;
        }
        return Array.isArray(result) ? result : [];
      });

      console.log("✅ Total appointments fetched:", allAppointments.length);

      // Sort by created date (newest first)
      allAppointments.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setAppointments(allAppointments);
      setFilteredAppointments(allAppointments);
      console.log("💾 Appointments state updated successfully");
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
      setAppointments([]);
      setFilteredAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Get doctor info from localStorage
  useEffect(() => {
    const userDataStr = localStorage.getItem("user");

    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        const email = userData.email;
        console.log("👨‍⚕️ Fetching doctor data for email:", email);

        fetch(`/api/hospital/doctor?email=${email}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.data && data.data.id) {
              console.log("✅ Doctor ID found:", data.data.id);
              setDoctorId(data.data.id);
            } else {
              console.error(
                "❌ Doctor not found:",
                data.error || "No doctor data returned",
              );
              alert(
                `Doctor not found for email: ${email}. Please contact administrator.`,
              );
            }
          })
          .catch((err) => {
            console.error("Error fetching doctor info:", err);
            alert("Failed to load doctor information. Please try again.");
          });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  // Filter appointments based on search and filters
  useEffect(() => {
    let filtered = [...appointments];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(query) ||
          apt.patientEmail.toLowerCase().includes(query) ||
          apt.patientPhone.includes(query) ||
          apt.appointmentNumber.toLowerCase().includes(query) ||
          (apt.patientNIC && apt.patientNIC.toLowerCase().includes(query)),
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((apt) => apt.status === filterStatus);
    }

    // Payment status filter
    if (filterPaymentStatus !== "all") {
      filtered = filtered.filter(
        (apt) => apt.paymentStatus === filterPaymentStatus,
      );
    }

    setFilteredAppointments(filtered);
  }, [searchQuery, filterStatus, filterPaymentStatus, appointments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "SERVED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "NO_SHOW":
        return "bg-gray-100 text-gray-800";
      case "RESCHEDULED":
        return "bg-yellow-100 text-yellow-800";
      case "UNPAID":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "REFUNDED":
        return "bg-purple-100 text-purple-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      case "UNPAID":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsViewDialogOpen(true);
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to mark this appointment as completed? An email will be sent to the patient with the appointment details.",
      )
    ) {
      return;
    }

    setCompletingAppointmentId(appointmentId);
    try {
      const response = await fetch(
        `/api/appointments/${appointmentId}/complete`,
        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete appointment");
      }

      // Refresh appointments
      await fetchAppointments();

      alert(
        "Appointment marked as completed successfully! An email has been sent to the patient.",
      );
    } catch (error: any) {
      console.error("Error completing appointment:", error);
      alert(`Failed to complete appointment: ${error.message}`);
    } finally {
      setCompletingAppointmentId(null);
    }
  };

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

  if (status === "PENDING") {
    return <PendingApprovalScreen />;
  }

  if (status === "REJECTED") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-red-600 mb-2">
                Application Rejected
              </h2>
              <p className="text-gray-600">
                Your doctor application has been rejected. Please contact the
                administrator for more information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  My Appointments
                </h1>
                <p className="text-gray-600 mt-2">
                  View and manage all appointments for your sessions
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="rounded-lg bg-white shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {appointments.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg bg-white shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Confirmed</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {
                      appointments.filter((a) => a.status === "CONFIRMED")
                        .length
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg bg-white shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {
                      appointments.filter((a) => a.status === "COMPLETED")
                        .length
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg bg-white shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Pending Payment</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {
                      appointments.filter((a) => a.paymentStatus === "PENDING")
                        .length
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="rounded-lg bg-white shadow mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <InputGroup>
                    <InputGroupAddon>
                      <Search className="h-4 w-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="Search by name, email, phone, or NIC..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="NO_SHOW">No Show</SelectItem>
                      <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>
                      <SelectItem value="UNPAID">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <Select
                    value={filterPaymentStatus}
                    onValueChange={setFilterPaymentStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payment Status</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="UNPAID">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading appointments...</p>
              </div>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <Card className="rounded-lg bg-white shadow">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Appointments Found
                  </h3>
                  <p className="text-gray-600">
                    {appointments.length === 0
                      ? "You don't have any appointments yet."
                      : "No appointments match your search criteria."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appointment, index) => {
                const rowColors = ["bg-blue-50", "bg-cyan-50", "bg-green-50"];
                const colorIndex = index % rowColors.length;

                return (
                  <Card
                    key={appointment.id}
                    className={`rounded-lg ${rowColors[colorIndex]} shadow hover:shadow-lg transition-shadow`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-400 rounded-lg">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {appointment.patientName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Apt #: {appointment.appointmentNumber}
                              </p>
                            </div>
                            <Badge
                              className={getStatusColor(appointment.status)}
                            >
                              {appointment.status}
                            </Badge>
                            <Badge
                              className={getPaymentStatusColor(
                                appointment.paymentStatus,
                              )}
                            >
                              {appointment.paymentStatus}
                            </Badge>
                            {appointment.isNewPatient && (
                              <Badge className="bg-purple-100 text-purple-800">
                                New Patient
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>{appointment.patientPhone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="truncate">
                                {appointment.patientEmail}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>
                                Queue: #{appointment.queuePosition || "N/A"}
                              </span>
                            </div>
                          </div>

                          {appointment.session && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 p-3 bg-white/50 rounded">
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>
                                  {formatDate(appointment.session.scheduledAt)}{" "}
                                  at {formatTime(appointment.session.startTime)}
                                </span>
                              </div>
                              <div className="text-sm text-gray-700">
                                <span className="font-medium">Location:</span>{" "}
                                {appointment.session.location}
                              </div>
                              <div className="text-sm text-gray-700 col-span-2">
                                <span className="font-medium">Hospital:</span>{" "}
                                {appointment.session.hospitals.name}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm">
                            <span className="px-3 py-1 bg-white rounded-full">
                              Fee:{" "}
                              <span className="font-semibold text-gray-900">
                                LKR {appointment.consultationFee}
                              </span>
                            </span>
                            <span className="px-3 py-1 bg-white rounded-full">
                              Total:{" "}
                              <span className="font-semibold text-gray-900">
                                LKR {appointment.totalAmount}
                              </span>
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/doctor/prescriptions?appointmentId=${appointment.id}`,
                              )
                            }
                            className="bg-green-600 hover:bg-green-700 text-white hover:text-white"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Prescription
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAppointment(appointment)}
                            className="bg-blue-900 hover:bg-blue-950 text-white hover:text-white"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {appointment.status !== "SERVED" &&
                            appointment.status !== "CANCELLED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleCompleteAppointment(appointment.id)
                                }
                                disabled={
                                  completingAppointmentId === appointment.id
                                }
                                className="bg-amber-600 hover:bg-amber-700 text-white hover:text-white"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {completingAppointmentId === appointment.id
                                  ? "Completing..."
                                  : "Complete"}
                              </Button>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Complete information about this appointment
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-6">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">
                      {selectedAppointment.patientName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">
                      {selectedAppointment.patientEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">
                      {selectedAppointment.patientPhone}
                    </p>
                  </div>
                  {selectedAppointment.patientNIC && (
                    <div>
                      <p className="text-sm text-gray-600">NIC</p>
                      <p className="font-medium">
                        {selectedAppointment.patientNIC}
                      </p>
                    </div>
                  )}
                  {selectedAppointment.patientDateOfBirth && (
                    <div>
                      <p className="text-sm text-gray-600">Date of Birth</p>
                      <p className="font-medium">
                        {formatDate(selectedAppointment.patientDateOfBirth)}
                      </p>
                    </div>
                  )}
                  {selectedAppointment.patientGender && (
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-medium">
                        {selectedAppointment.patientGender}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              {(selectedAppointment.emergencyContactName ||
                selectedAppointment.emergencyContactPhone) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedAppointment.emergencyContactName && (
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">
                          {selectedAppointment.emergencyContactName}
                        </p>
                      </div>
                    )}
                    {selectedAppointment.emergencyContactPhone && (
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">
                          {selectedAppointment.emergencyContactPhone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Medical Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Medical Information
                </h3>
                <div className="space-y-3">
                  {selectedAppointment.medicalHistory && (
                    <div>
                      <p className="text-sm text-gray-600">Medical History</p>
                      <p className="font-medium">
                        {selectedAppointment.medicalHistory}
                      </p>
                    </div>
                  )}
                  {selectedAppointment.currentMedications && (
                    <div>
                      <p className="text-sm text-gray-600">
                        Current Medications
                      </p>
                      <p className="font-medium">
                        {selectedAppointment.currentMedications}
                      </p>
                    </div>
                  )}
                  {selectedAppointment.allergies && (
                    <div>
                      <p className="text-sm text-gray-600">Allergies</p>
                      <p className="font-medium text-red-600">
                        {selectedAppointment.allergies}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Insurance Information */}
              {(selectedAppointment.insuranceProvider ||
                selectedAppointment.insurancePolicyNumber) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Insurance Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedAppointment.insuranceProvider && (
                      <div>
                        <p className="text-sm text-gray-600">Provider</p>
                        <p className="font-medium">
                          {selectedAppointment.insuranceProvider}
                        </p>
                      </div>
                    )}
                    {selectedAppointment.insurancePolicyNumber && (
                      <div>
                        <p className="text-sm text-gray-600">Policy Number</p>
                        <p className="font-medium">
                          {selectedAppointment.insurancePolicyNumber}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Appointment Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Appointment Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Appointment Number</p>
                    <p className="font-medium">
                      {selectedAppointment.appointmentNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Queue Position</p>
                    <p className="font-medium">
                      #{selectedAppointment.queuePosition || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge
                      className={getStatusColor(selectedAppointment.status)}
                    >
                      {selectedAppointment.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <Badge
                      className={getPaymentStatusColor(
                        selectedAppointment.paymentStatus,
                      )}
                    >
                      {selectedAppointment.paymentStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consultation Fee</p>
                    <p className="font-medium">
                      LKR {selectedAppointment.consultationFee}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium">
                      LKR {selectedAppointment.totalAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created At</p>
                    <p className="font-medium">
                      {formatDateTime(selectedAppointment.createdAt)}
                    </p>
                  </div>
                  {selectedAppointment.estimatedWaitTime && (
                    <div>
                      <p className="text-sm text-gray-600">
                        Estimated Wait Time
                      </p>
                      <p className="font-medium">
                        {selectedAppointment.estimatedWaitTime} minutes
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Session Information */}
              {selectedAppointment.session && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Session Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Hospital</p>
                      <p className="font-medium">
                        {selectedAppointment.session.hospitals.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">
                        {selectedAppointment.session.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-medium">
                        {formatDate(selectedAppointment.session.scheduledAt)} at{" "}
                        {formatTime(selectedAppointment.session.startTime)} -{" "}
                        {formatTime(selectedAppointment.session.endTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Session Status</p>
                      <p className="font-medium">
                        {selectedAppointment.session.status}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedAppointment.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Notes</h3>
                  <p className="text-gray-700">{selectedAppointment.notes}</p>
                </div>
              )}

              {/* Cancellation Information */}
              {selectedAppointment.status === "CANCELLED" &&
                selectedAppointment.cancellationReason && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-red-600">
                      Cancellation Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Reason</p>
                        <p className="font-medium">
                          {selectedAppointment.cancellationReason}
                        </p>
                      </div>
                      {selectedAppointment.cancellationDate && (
                        <div>
                          <p className="text-sm text-gray-600">Cancelled On</p>
                          <p className="font-medium">
                            {formatDateTime(
                              selectedAppointment.cancellationDate,
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
