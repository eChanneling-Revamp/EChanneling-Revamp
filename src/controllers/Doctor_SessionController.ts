import Session, { ISession } from "../models/Doctor_SessionModel";
import { connectDB } from "../lib/mongodb";

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
  return Session.find().sort({ date: 1, startTime: 1 });
}

/**
 * Get a particular session by ID
 */
export async function getSessionById(id: string) {
  await connectDB();
  return Session.findById(id);
}

/**
 * Update a session
 */
export async function updateSession(id: string, data: Partial<ISession>) {
  await connectDB();
  return Session.findByIdAndUpdate(id, data, { new: true });
}

/**
 * Cancel a session (update status)
 */
export async function cancelSession(id: string) {
  await connectDB();
  return Session.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
}