import { prisma } from "../lib/prisma";

/**
 * Create a new session
 */
export async function createSession(data: any) {
  const session = await prisma.session.create({
    data: {
      doctorId: data.doctorId,
      nurseId: data.nurseId,
      capacity: data.capacity || 5,
      location: data.location,
      hospitalId: data.hospitalId,
      status: data.status || "scheduled",
      scheduledAt: new Date(data.startTime),
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    } as any,
    include: {
      doctors: true,
      nurse_details: true,
      hospitals: true,
    },
  });
  return session;
}

/**
 * Get all sessions with optional filtering
 */
export async function getAllSessions(
  doctorId?: string | null,
  hospitalId?: string | null
) {
  const where: any = {};

  if (doctorId) {
    where.doctorId = doctorId;
  }

  if (hospitalId) {
    where.hospitalId = hospitalId;
  }

  return prisma.session.findMany({
    where,
    include: {
      doctors: true,
      nurse_details: true,
      hospitals: true,
    },
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
    include: {
      doctors: true,
      nurse_details: true,
      hospitals: true,
    },
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
