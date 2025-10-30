import Session, { ISession } from "../models/Session";
import { connectDB } from "../lib/mongodb";
//import { getSessionHospitalDB } from "../lib/session_HospitalView";


/**
 * Create a new session
 */
export async function createSession(data: Partial<ISession>) {
  await connectDB();
  const session = await Session.create(data);
  return session;
}

/**
 * Get all sessions
 */
export async function getAllSessions() {
  await connectDB();
  return Session.find().sort({ date: 1 }).lean(); // returns a plain JS array
}

/**
 * Get a particular session by ID
 */
export async function getSessionById(id: string) {
  await connectDB();
  return Session.findById(id);
}

/**
 * Cancel a session (update status)
 */
export async function cancelSession(id: string) {
  await connectDB();
  return Session.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
}

/**
 * Delete a session
 */
export async function deleteSession(id: string) {
  await connectDB();
  return Session.findByIdAndDelete(id);
}


/*import { Model } from "mongoose";
import { getSessionHospitalDB } from "../lib/session_HospitalView";
import { ISession, SessionSchema } from "../models/Session";

/**
 * Helper: Get the Session model for the hospitalView DB
 */
/*async function getSessionModel(): Promise<Model<ISession>> {
  const db = await getSessionHospitalDB();
  // Use `as Model<ISession>` to satisfy TypeScript
  return db.model("Session", SessionSchema) as Model<ISession>;
}

/**
 * Create a new session
 */
/*export async function createSession(data: Partial<ISession>) {
  const Session = await getSessionModel();
  const session = await Session.create(data);
  return session;
}

/**
 * Get all sessions (sorted by date ascending)
 */
/*export async function getAllSessions() {
  const Session = await getSessionModel();
  return Session.find().sort({ date: 1 });
}

/**
 * Get a particular session by ID
 */
/*export async function getSessionById(id: string) {
  const Session = await getSessionModel();
  return Session.findById(id);
}

/**
 * Cancel a session (update status)
 */
/*export async function cancelSession(id: string) {
  const Session = await getSessionModel();
  return Session.findByIdAndUpdate(
    id,
    { status: "cancelled" },
    { new: true }
  );
}

/**
 * Delete a session
 */
/*export async function deleteSession(id: string) {
  const Session = await getSessionModel();
  return Session.findByIdAndDelete(id);
}
*/