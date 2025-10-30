// TODO: Remove this file after the implement staff add form
export type Doctor = {
    id: string;
    name: string;
    specialty: string;
    email: string;
    phone: string;
    sessions: string; // e.g. "Mon, Wed, Fri"
    status: "Active" | "On Leave" | "Inactive";
    color?: string; // avatar bg color
};

// const doctors: Doctor[] = [
//     {
//         id: "1",
//         name: "Dr. Jayawardena",
//         specialty: "Cardiology",
//         email: "dr.jayawardena@asiri.com",
//         phone: "+94 71 234 5678",
//         sessions: "Mon, Wed, Fri",
//         status: "Active",
//         color: "bg-blue-700",
//     },
//     {
//         id: "2",
//         name: "Dr. Fernando",
//         specialty: "Dermatology",
//         email: "dr.fernando@asiri.com",
//         phone: "+94 71 987 6543",
//         sessions: "Tue, Thu",
//         status: "Active",
//         color: "bg-cyan-400",
//     },
//     {
//         id: "3",
//         name: "Dr. Gunasekara",
//         specialty: "Orthopedics",
//         email: "dr.gunasekara@asiri.com",
//         phone: "+94 71 456 7890",
//         sessions: "Wed, Sat",
//         status: "On Leave",
//         color: "bg-green-500",
//     },
// ];

// export default doctors;
