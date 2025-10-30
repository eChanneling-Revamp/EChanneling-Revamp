// "use client";

// import { useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import doctorsData from "@/app/staff/data/doctor";
// import DoctorCard from "@/components/staff/DoctorCard";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function StaffPage() {
//   const router = useRouter();
//   const [q, setQ] = useState("");
//   const [specialty, setSpecialty] = useState("All");
//   const [status, setStatus] = useState("All");
//   const [doctors, setDoctors] = useState(doctorsData);

//   // Add Doctor form state
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     specialty: "",
//     sessions: "",
//     status: "Active",
//   });

//   const specialties = useMemo(
//     () => ["All Specializations", ...Array.from(new Set(doctors.map((d) => d.specialty)))],
//     [doctors]
//   );
//   const statuses = ["All Status", "Active", "On Leave", "Inactive"];

//   const filtered = doctors.filter((d) => {
//     const matchesQ =
//       q === "" || `${d.name} ${d.email} ${d.specialty}`.toLowerCase().includes(q.toLowerCase());
//     const matchesSpecialty = specialty === "All" || d.specialty === specialty;
//     const matchesStatus = status === "All" || d.status === status;
//     return matchesQ && matchesSpecialty && matchesStatus;
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddDoctor = (e: React.FormEvent) => {
//     e.preventDefault();
//     const newDoctor = {
//       id: doctors.length + 1,
//       ...form,
//     };
//     // setDoctors((prev) => [...prev, newDoctor]);
//     setForm({
//       name: "",
//       email: "",
//       phone: "",
//       specialty: "",
//       sessions: "",
//       status: "Active",
//     });
//   };

//   return (
//     <div className="p-4 bg-[#f3f4f6] min-h-screen">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Medical Staff</h2>

//       <div className="flex justify-between gap-3 mb-6">
//         {/* Search and Filters */}
//         <div className="flex flex-row gap-3">
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Search staff..."
//             className="w-[300px] px-4 py-2 rounded shadow border-[1px] border-gray-200 bg-white"
//           />

//           <select
//             value={specialty}
//             onChange={(e) => setSpecialty(e.target.value)}
//             className="px-3 py-2 rounded bg-white border-[1px] border-gray-200"
//           >
//             {specialties.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>

//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="px-3 py-2 rounded bg-white border-[1px] border-gray-200"
//           >
//             {statuses.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Add Doctor Popup */}
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button className="bg-[#013e7f] text-white">+ Add Doctor</Button>
//           </DialogTrigger>

//           <DialogContent className="sm:max-w-[500px]">
//             <DialogHeader>
//               <DialogTitle>Add New Doctor</DialogTitle>
//               <DialogDescription>
//                 Fill out the details below to add a new doctor to your staff.
//               </DialogDescription>
//             </DialogHeader>

//             <form onSubmit={handleAddDoctor} className="space-y-4">
//               <div>
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   placeholder="Dr. John Doe"
//                   value={form.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="doctor@example.com"
//                   value={form.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   placeholder="+94 71 234 5678"
//                   value={form.phone}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="specialty">Specialization</Label>
//                 <Input
//                   id="specialty"
//                   name="specialty"
//                   placeholder="Cardiology, Dermatology..."
//                   value={form.specialty}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="sessions">Sessions</Label>
//                 <Input
//                   id="sessions"
//                   name="sessions"
//                   placeholder="Mon, Wed, Fri"
//                   value={form.sessions}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="status">Status</Label>
//                 <select
//                   id="status"
//                   name="status"
//                   value={form.status}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-3 py-2 w-full"
//                 >
//                   <option value="Active">Active</option>
//                   <option value="On Leave">On Leave</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>
//               </div>

//               <DialogFooter className="mt-4">
//                 <DialogClose asChild>
//                   <Button type="button" variant="outline">
//                     Cancel
//                   </Button>
//                 </DialogClose>
//                 <DialogClose asChild>
//                   <Button type="submit" className="bg-[#013e7f] text-white hover:bg-[#012f5f]">
//                     Save Doctor
//                   </Button>
//                 </DialogClose>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Staff Cards */}
//       <div className="bg-white rounded shadow p-4">
//         <div className="w-full flex justify-start py-2 text-xl">Our medical staff</div>
//         <hr className="border-gray-200 mb-4" />
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filtered.map((d) => (
//             <DoctorCard key={d.id} doctor={d} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }









// "use client";

// import { useMemo, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// // import doctorsData from "@/app/staff/data/doctor";
// import DoctorCard from "@/components/staff/DoctorCard";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function StaffPage() {
//   const router = useRouter();
//   const [q, setQ] = useState("");
//   const [specialty, setSpecialty] = useState("All");
//   const [status, setStatus] = useState("All");

//   const [doctors, setDoctors] = useState<any[]>([]);

//   // 🧠 Load initial doctors from data file
//   // const [doctors, setDoctors] = useState(doctorsData);

//   // 🧠 Load from localStorage (persist data)
//   useEffect(() => {
//     const storedDoctors = localStorage.getItem("doctors");
//     if (storedDoctors) {
//       setDoctors(JSON.parse(storedDoctors));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("doctors", JSON.stringify(doctors));
//   }, [doctors]);

//   // 🧾 Add Doctor form state
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     specialty: "",
//     sessions: "",
//     status: "Active",
//   });

//   const specialties = useMemo(
//     () => ["All Specializations", ...Array.from(new Set(doctors.map((d) => d.specialty)))],
//     [doctors]
//   );
//   const statuses = ["All Status", "Active", "On Leave", "Inactive"];

//   const filtered = doctors.filter((d) => {
//     const matchesQ =
//       q === "" || `${d.name} ${d.email} ${d.specialty}`.toLowerCase().includes(q.toLowerCase());
//     const matchesSpecialty = specialty === "All" || d.specialty === specialty;
//     const matchesStatus = status === "All" || d.status === status;
//     return matchesQ && matchesSpecialty && matchesStatus;
//   });

//   // Handle form input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

  
//   // ✅ Add new doctor and update list
//   const handleAddDoctor = (e: React.FormEvent) => {
//     e.preventDefault();

//     const newDoctor = {
//       id: doctors.length + 1,
//       ...form,
//     };

//     setDoctors((prev) => [...prev, newDoctor]);

//     // Reset form after adding
//     setForm({
//       name: "",
//       email: "",
//       phone: "",
//       specialty: "",
//       sessions: "",
//       status: "Active",
//     });
//   };

//   return (
//     <div className="p-4 bg-[#f3f4f6] min-h-screen">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Medical Staff</h2>

//       <div className="flex justify-between gap-3 mb-6">
//         {/* Search + Filter section */}
//         <div className="flex flex-row gap-3">
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Search staff..."
//             className="w-[300px] px-4 py-2 rounded shadow border-[1px] border-gray-200 bg-white"
//           />

//           <select
//             value={specialty}
//             onChange={(e) => setSpecialty(e.target.value)}
//             className="px-3 py-2 rounded bg-white border-[1px] border-gray-200"
//           >
//             {specialties.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>

//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="px-3 py-2 rounded bg-white border-[1px] border-gray-200"
//           >
//             {statuses.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* ➕ Add Doctor Popup */}
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button className="bg-[#013e7f] text-white">+ Add Doctor</Button>
//           </DialogTrigger>

//           <DialogContent className="sm:max-w-[500px]">
//             <DialogHeader>
//               <DialogTitle>Add New Doctor</DialogTitle>
//               <DialogDescription>
//                 Fill out the details below to add a new doctor to your staff.
//               </DialogDescription>
//             </DialogHeader>

//             <form onSubmit={handleAddDoctor} className="space-y-4">
//               <div>
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   placeholder="Dr. John Doe"
//                   value={form.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="doctor@example.com"
//                   value={form.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   placeholder="+94 71 234 5678"
//                   value={form.phone}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="specialty">Specialization</Label>
//                 <Input
//                   id="specialty"
//                   name="specialty"
//                   placeholder="Cardiology, Dermatology..."
//                   value={form.specialty}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="sessions">Sessions</Label>
//                 <Input
//                   id="sessions"
//                   name="sessions"
//                   placeholder="Mon, Wed, Fri"
//                   value={form.sessions}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="status">Status</Label>
//                 <select
//                   id="status"
//                   name="status"
//                   value={form.status}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-3 py-2 w-full"
//                 >
//                   <option value="Active">Active</option>
//                   <option value="On Leave">On Leave</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>
//               </div>

//               <DialogFooter className="mt-4">
//                 <DialogClose asChild>
//                   <Button type="button" variant="outline">
//                     Cancel
//                   </Button>
//                 </DialogClose>

//                 {/* ✅ Don't wrap Save Doctor inside DialogClose */}
//                 <Button
//                   type="submit"
//                   className="bg-[#013e7f] text-white hover:bg-[#012f5f]"
//                 >
//                   Save Doctor
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* 👨‍⚕️ Staff Cards Section */}
//       <div className="bg-white rounded shadow p-4">
//         <div className="w-full flex justify-start py-2 text-xl font-medium">
//           Our medical staff
//         </div>
//         <hr className="border-gray-200 mb-4" />
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filtered.map((d) => (
//             <DoctorCard key={d.id} doctor={d} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }









// "use client";

// import { useMemo, useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import DoctorCard from "@/components/staff/DoctorCard";

// export default function StaffPage() {
//   const [q, setQ] = useState("");
//   const [specialty, setSpecialty] = useState("All");
//   const [status, setStatus] = useState("All");
//   const [doctors, setDoctors] = useState<any[]>([]);

//   // Load from localStorage on first render
//   useEffect(() => {
//     const stored = localStorage.getItem("doctors");
//     if (stored) setDoctors(JSON.parse(stored));
//   }, []);

//   // Save to localStorage whenever doctors change
//   useEffect(() => {
//     localStorage.setItem("doctors", JSON.stringify(doctors));
//   }, [doctors]);

//   // Form state (used for both add and edit)
//   const [form, setForm] = useState({
//     id: 0,
//     name: "",
//     email: "",
//     phone: "",
//     specialty: "",
//     sessions: "",
//     status: "Active",
//   });

//   // Track editing mode
//   const [editingDoctor, setEditingDoctor] = useState<any | null>(null);

//   // Get unique specialties
//   const specialties = useMemo(
//     () => ["All Specializations", ...Array.from(new Set(doctors.map((d) => d.specialty)))],
//     [doctors]
//   );
//   const statuses = ["All Status", "Active", "On Leave", "Inactive"];

//   // Filter
//   const filtered = doctors.filter((d) => {
//     const matchesQ =
//       q === "" || `${d.name} ${d.email} ${d.specialty}`.toLowerCase().includes(q.toLowerCase());
//     const matchesSpecialty = specialty === "All" || d.specialty === specialty;
//     const matchesStatus = status === "All" || d.status === status;
//     return matchesQ && matchesSpecialty && matchesStatus;
//   });

//   // Handle input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   // ✅ Add Doctor
//   const handleAddDoctor = (e: React.FormEvent) => {
//     e.preventDefault();

//     const newDoctor = {
//       id: doctors.length ? Math.max(...doctors.map((d) => d.id)) + 1 : 1,
//       ...form,
//     };

//     setDoctors((prev) => [...prev, newDoctor]);
//     resetForm();
//   };

//   // ✏️ Edit Doctor
//   const handleEditDoctor = (doctor: any) => {
//     setEditingDoctor(doctor);
//     setForm(doctor);
//   };

//   // ✅ Save Edited Doctor
//   const handleSaveEdit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setDoctors((prev) =>
//       prev.map((d) => (d.id === form.id ? { ...d, ...form } : d))
//     );
//     setEditingDoctor(null);
//     resetForm();
//   };

//   // 🗑️ Delete Doctor
//   const handleDeleteDoctor = (id: number) => {
//     if (confirm("Are you sure you want to delete this doctor?")) {
//       setDoctors((prev) => prev.filter((d) => d.id !== id));
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setForm({
//       id: 0,
//       name: "",
//       email: "",
//       phone: "",
//       specialty: "",
//       sessions: "",
//       status: "Active",
//     });
//   };

//   return (
//     <div className="p-4 bg-[#f3f4f6] min-h-screen">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Medical Staff</h2>

//       <div className="flex justify-between gap-3 mb-6">
//         {/* Search + Filter section */}
//         <div className="flex flex-row gap-3">
//           <input
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             placeholder="Search staff..."
//             className="w-[300px] px-4 py-2 rounded shadow border-[1px] border-gray-200 bg-white"
//           />

//           <select
//             value={specialty}
//             onChange={(e) => setSpecialty(e.target.value)}
//             className="px-3 py-2 rounded bg-white border-[1px] border-gray-200"
//           >
//             {specialties.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>

//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="px-3 py-2 rounded bg-white border-[1px] border-gray-200"
//           >
//             {statuses.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* ➕ Add Doctor Popup */}
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button className="bg-[#013e7f] text-white">+ Add Doctor</Button>
//           </DialogTrigger>

//           <DialogContent className="sm:max-w-[500px]">
//             <DialogHeader>
//               <DialogTitle>{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
//               <DialogDescription>
//                 {editingDoctor
//                   ? "Update the doctor's information below."
//                   : "Fill out the details below to add a new doctor."}
//               </DialogDescription>
//             </DialogHeader>

//             <form
//               onSubmit={editingDoctor ? handleSaveEdit : handleAddDoctor}
//               className="space-y-4"
//             >
//               <div>
//                 <Label htmlFor="name">Full Name</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   placeholder="Dr. John Doe"
//                   value={form.name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="doctor@example.com"
//                   value={form.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="phone">Phone</Label>
//                 <Input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   placeholder="+94 71 234 5678"
//                   value={form.phone}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="specialty">Specialization</Label>
//                 <Input
//                   id="specialty"
//                   name="specialty"
//                   placeholder="Cardiology, Dermatology..."
//                   value={form.specialty}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="sessions">Sessions</Label>
//                 <Input
//                   id="sessions"
//                   name="sessions"
//                   placeholder="Mon, Wed, Fri"
//                   value={form.sessions}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="status">Status</Label>
//                 <select
//                   id="status"
//                   name="status"
//                   value={form.status}
//                   onChange={handleChange}
//                   className="border border-gray-300 rounded px-3 py-2 w-full"
//                 >
//                   <option value="Active">Active</option>
//                   <option value="On Leave">On Leave</option>
//                   <option value="Inactive">Inactive</option>
//                 </select>
//               </div>

//               <DialogFooter className="mt-4">
//                 <DialogClose asChild>
//                   <Button type="button" variant="outline" onClick={() => setEditingDoctor(null)}>
//                     Cancel
//                   </Button>
//                 </DialogClose>

//                 <Button
//                   type="submit"
//                   className="bg-[#013e7f] text-white hover:bg-[#012f5f]"
//                 >
//                   {editingDoctor ? "Save Changes" : "Save Doctor"}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* 👨‍⚕️ Staff Cards Section */}
//       <div className="bg-white rounded shadow p-4">
//         <div className="w-full flex justify-start py-2 text-xl font-medium">
//           Our medical staff
//         </div>
//         <hr className="border-gray-200 mb-4" />
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filtered.map((d) => (
//             <DoctorCard
//               key={d.id}
//               doctor={d}
//               onEdit={() => handleEditDoctor(d)}
//               onDelete={() => handleDeleteDoctor(d.id)}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }












"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DoctorCard from "@/components/staff/DoctorCard";

export default function StaffPage() {
  const [q, setQ] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [status, setStatus] = useState("All");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [open, setOpen] = useState(false); // control dialog open/close

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("doctors");
    if (stored) setDoctors(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("doctors", JSON.stringify(doctors));
  }, [doctors]);

  const [form, setForm] = useState({
    id: 0,
    name: "",
    email: "",
    phone: "",
    specialty: "",
    sessions: "",
    status: "Active",
  });

  const [editingDoctor, setEditingDoctor] = useState<any | null>(null);

  const specialties = useMemo(
    () => ["All Specializations", ...Array.from(new Set(doctors.map((d) => d.specialty)))],
    [doctors]
  );
  const statuses = ["All Status", "Active", "On Leave", "Inactive"];

  const filtered = doctors.filter((d) => {
    const matchesQ =
      q === "" || `${d.name} ${d.email} ${d.specialty}`.toLowerCase().includes(q.toLowerCase());
    const matchesSpecialty = specialty === "All" || d.specialty === specialty;
    const matchesStatus = status === "All" || d.status === status;
    return matchesQ && matchesSpecialty && matchesStatus;
  });

  // Form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add Doctor
  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();

    const maxId = doctors.length > 0
      ? Math.max(...doctors.map((d) => Number(d.id) || 0))
      : 0;

    const newDoctor = { id: maxId + 1, ...form };

    setDoctors((prev) => [...prev, newDoctor]);
    resetForm();
    setOpen(false);
  };

  // ✏️ Open Edit Form
  const handleEditDoctor = (doctor: any) => {
    setEditingDoctor(doctor);
    setForm(doctor);
    setOpen(true);
  };

  // ✅ Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setDoctors((prev) =>
      prev.map((d) => (d.id === form.id ? { ...d, ...form } : d))
    );
    setEditingDoctor(null);
    resetForm();
    setOpen(false);
  };

  // 🗑️ Delete Doctor
  const handleDeleteDoctor = (id: number) => {
    if (confirm("Are you sure you want to delete this doctor?")) {
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const resetForm = () => {
    setForm({
      id: 0,
      name: "",
      email: "",
      phone: "",
      specialty: "",
      sessions: "",
      status: "Active",
    });
  };

  return (
    <div className="p-4 bg-[#f3f4f6] min-h-screen">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Medical Staff</h2>

      <div className="flex justify-between gap-3 mb-6">
        {/* Search + Filter */}
        <div className="flex flex-row gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search staff..."
            className="w-[300px] px-4 py-2 rounded shadow border border-gray-200 bg-white"
          />
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="px-3 py-2 rounded bg-white border border-gray-200"
          >
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded bg-white border border-gray-200"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* ➕ Add Doctor button */}
        <Button
          onClick={() => {
            setEditingDoctor(null);
            resetForm();
            setOpen(true);
          }}
          className="bg-[#013e7f] text-white"
        >
          + Add Doctor
        </Button>
      </div>

      {/* 💬 Add/Edit Doctor Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            </DialogTitle>
            <DialogDescription>
              {editingDoctor
                ? "Update the doctor's information below."
                : "Fill out the details below to add a new doctor."}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={editingDoctor ? handleSaveEdit : handleAddDoctor}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="specialty">Specialization</Label>
              <Input id="specialty" name="specialty" value={form.specialty} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="sessions">Sessions</Label>
              <Input id="sessions" name="sessions" value={form.sessions} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => setEditingDoctor(null)}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-[#013e7f] text-white hover:bg-[#012f5f]">
                {editingDoctor ? "Save Changes" : "Save Doctor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 👨‍⚕️ Doctor Cards */}
      <div className="bg-white rounded shadow p-4">
        <div className="text-xl font-medium mb-2">Our medical staff</div>
        <hr className="border-gray-200 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <DoctorCard
              key={d.id}
              doctor={d}
              onEdit={() => handleEditDoctor(d)}
              onDelete={() => handleDeleteDoctor(d.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
