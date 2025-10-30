// // export default function AddHospital() {
// //   return (
// //     <div>AddHospital</div>
// //   )
// // }


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// export default function AddDoctor() {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     specialty: "",
//     sessions: "",
//     status: "Active",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Doctor added:", form);
//     // TODO: Integrate with backend or local state saving logic
//     router.push("/staff"); // Navigate back to staff list
//   };

//   return (
//     <div className="min-h-screen bg-[#f3f4f6] flex justify-center py-10 px-4">
//       <Card className="w-full max-w-2xl shadow-md border border-gray-200 bg-white">
//         <CardHeader>
//           <CardTitle className="text-2xl font-semibold text-gray-800">
//             Add New Doctor
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Name */}
//             <div className="flex flex-col">
//               <Label htmlFor="name">Full Name</Label>
//               <Input
//                 id="name"
//                 name="name"
//                 placeholder="Dr. John Doe"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Email */}
//             <div className="flex flex-col">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="doctor@example.com"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Phone */}
//             <div className="flex flex-col">
//               <Label htmlFor="phone">Phone</Label>
//               <Input
//                 id="phone"
//                 name="phone"
//                 type="tel"
//                 placeholder="+94 71 234 5678"
//                 value={form.phone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Specialty */}
//             <div className="flex flex-col">
//               <Label htmlFor="specialty">Specialization</Label>
//               <Input
//                 id="specialty"
//                 name="specialty"
//                 placeholder="Cardiology, Dermatology..."
//                 value={form.specialty}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Sessions */}
//             <div className="flex flex-col">
//               <Label htmlFor="sessions">Sessions</Label>
//               <Input
//                 id="sessions"
//                 name="sessions"
//                 placeholder="Mon, Wed, Fri"
//                 value={form.sessions}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Status */}
//             <div className="flex flex-col">
//               <Label htmlFor="status">Status</Label>
//               <select
//                 id="status"
//                 name="status"
//                 value={form.status}
//                 onChange={handleChange}
//                 className="border border-gray-300 rounded px-3 py-2"
//               >
//                 <option value="Active">Active</option>
//                 <option value="On Leave">On Leave</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end gap-3 pt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => router.push("/staff")}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="bg-[#013e7f] text-white hover:bg-[#012f5f]"
//               >
//                 Save Doctor
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




"use client";

import { useState } from "react";

export default function AddStaffPage() {
  const [doctors, setDoctors] = useState<string[]>([]);

  const handleAddDoctor = () => {
    const newDoctor = "Dr. Example"; // test value
    setDoctors((prev) => [...prev, newDoctor]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Add Staff</h1>
      <button
        onClick={handleAddDoctor}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Doctor
      </button>

      <ul className="mt-4">
        {doctors.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
    </div>
  );
}
