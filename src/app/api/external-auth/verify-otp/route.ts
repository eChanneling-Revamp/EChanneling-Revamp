import { NextRequest, NextResponse } from "next/server";
import https from "https";
import axios from "axios";

const EXTERNAL_API_URL = "https://dpdlab1.slt.lk:8645/auth/api";

// Create axios instance that bypasses SSL verification
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Allow self-signed certificates
  }),
  timeout: 30000,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await axiosInstance.post(
      `${EXTERNAL_API_URL}/auth/verify-otp`,
      body
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("External API verify OTP error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        {
          error:
            error.response.data?.message ||
            error.response.data?.error ||
            "OTP verification failed",
          details: error.response.data,
        },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to connect to authentication service" },
      { status: 500 }
    );
  }
}
