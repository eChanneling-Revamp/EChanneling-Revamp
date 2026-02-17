import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

export interface MagicLinkPayload {
  email: string;
  name: string;
  phoneNumber: string;
  role: string;
  hospitalId: string;
  hospitalName: string;
  type: "doctor-setup" | "nurse-setup" | "cashier-dashboard";
  createdByHospital: boolean;
}

export interface AuthTokenPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Generate a magic link token for doctor/nurse setup
 */
export function generateMagicLinkToken(payload: MagicLinkPayload): string {
  // Token expires in 7 days
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify and decode a magic link token
 */
export function verifyMagicLinkToken(token: string): MagicLinkPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MagicLinkPayload;
    return decoded;
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return null;
  }
}

/**
 * Generate a JWT auth token for standard logins
 */
export function generateAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify and decode a JWT auth token
 */
export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    return decoded;
  } catch (error) {
    console.error("Invalid or expired auth token:", error);
    return null;
  }
}
