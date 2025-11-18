import { prisma } from "../lib/prisma";

/**
 * Create a new session
 */
export async function createSession(data: any) {
  const session = await prisma.session.create({
    data: {
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      nurseId: data.nurseId,
      nurseName: data.nurseName || null,
      capacity: data.capacity || 20,
      location: data.location || null,
      hospitalId: data.hospitalId,
      status: data.status || "scheduled",
      startTime: data.startTime ? new Date(data.startTime) : null,
      endTime: data.endTime ? new Date(data.endTime) : null,
    },
  });
  return session;
}

/**
 * Get all sessions
 */
export async function getAllSessions() {
  return prisma.session.findMany({
    orderBy: {
      startTime: "asc",
    },
  });
}

/**
 * Get a particular session by ID
 */
export async function getSessionById(id: string) {
  return prisma.session.findUnique({
    where: { id },
  });
}

/**
 * Cancel a session (update status)
 */
export async function cancelSession(id: string) {
  return prisma.session.update({
    where: { id },
    data: { status: "cancelled" },
  });
}

/**
 * Delete a session
 */
export async function deleteSession(id: string) {
  try {
    await prisma.session.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return null;
  }
}
