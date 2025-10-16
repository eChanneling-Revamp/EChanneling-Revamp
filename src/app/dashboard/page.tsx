"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ApiResponse = {
  status: number;
  data?: any;
  error?: string;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [adminRes, setAdminRes] = useState<ApiResponse | null>(null);
  const [doctorRes, setDoctorRes] = useState<ApiResponse | null>(null);
  const [hospitalRes, setHospitalRes] = useState<ApiResponse | null>(null);
  const [userRes, setUserRes] = useState<ApiResponse | null>(null);
  const router = useRouter();

  if(session?.user?.role == "corporateagent"){
    router.push("https://corporate-agent-frontend.vercel.app/");
  } else{

    router.push(`/${session?.user?.role}`);
  }



  useEffect(() => {
    if (status === "loading") return; // wait until session is loaded
    if (!session) {
      const errorRes = { status: 403, error: "Not logged in" };
      setAdminRes(errorRes);
      setDoctorRes(errorRes);
      setHospitalRes(errorRes);
      setUserRes(errorRes);
      return;
    }

    // Fetch admin API
    fetch("/api/admin")
      .then(async (res) => {
        const data = await res.json();
        setAdminRes({
          status: res.status,
          data: res.status === 200 ? data : undefined,
          error:
            res.status !== 200 ? data?.error || "Access denied" : undefined,
        });
      })
      .catch(() => setAdminRes({ status: 500, error: "Fetch failed" }));

    // Fetch doctor API
    fetch("/api/doctor")
      .then(async (res) => {
        const data = await res.json();
        setDoctorRes({
          status: res.status,
          data: res.status === 200 ? data : undefined,
          error:
            res.status !== 200 ? data?.error || "Access denied" : undefined,
        });
      })
      .catch(() => setDoctorRes({ status: 500, error: "Fetch failed" }));

    // Fetch hospital API
    fetch("/api/hospital")
      .then(async (res) => {
        const data = await res.json();
        setHospitalRes({
          status: res.status,
          data: res.status === 200 ? data : undefined,
          error:
            res.status !== 200 ? data?.error || "Access denied" : undefined,
        });
      })
      .catch(() => setHospitalRes({ status: 500, error: "Fetch failed" }));

    // Fetch user API
    fetch("/api/user")
      .then(async (res) => {
        const data = await res.json();
        setUserRes({
          status: res.status,
          data: res.status === 200 ? data : undefined,
          error:
            res.status !== 200 ? data?.error || "Access denied" : undefined,
        });
      })
      .catch(() => setUserRes({ status: 500, error: "Fetch failed" }));
  }, [session, status]);

  if (status === "loading") return <p>Loading session...</p>;

  return (
    <div>
      <h1>Welcome {session?.user?.name}</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Role: {session?.user?.role}</p>

      <h2>API Responses:</h2>
      <ul>
        <li>
          <strong>/api/admin</strong> - Status: {adminRes?.status} <br />
          {adminRes?.data && (
            <pre>{JSON.stringify(adminRes.data, null, 2)}</pre>
          )}
          {adminRes?.error && <p style={{ color: "red" }}>{adminRes.error}</p>}
        </li>
        <li>
          <strong>/api/doctor</strong> - Status: {doctorRes?.status} <br />
          {doctorRes?.data && (
            <pre>{JSON.stringify(doctorRes.data, null, 2)}</pre>
          )}
          {doctorRes?.error && (
            <p style={{ color: "red" }}>{doctorRes.error}</p>
          )}
        </li>
        <li>
          <strong>/api/hospital</strong> - Status: {hospitalRes?.status} <br />
          {hospitalRes?.data && (
            <pre>{JSON.stringify(hospitalRes.data, null, 2)}</pre>
          )}
          {hospitalRes?.error && (
            <p style={{ color: "red" }}>{hospitalRes.error}</p>
          )}
        </li>
        <li>
          <strong>/api/user</strong> - Status: {userRes?.status} <br />
          {userRes?.data && <pre>{JSON.stringify(userRes.data, null, 2)}</pre>}
          {userRes?.error && <p style={{ color: "red" }}>{userRes.error}</p>}
        </li>
      </ul>

      <button onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>
    </div>
  );
}
