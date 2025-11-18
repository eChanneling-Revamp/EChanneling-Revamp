# Prisma Quick Reference

## Common Operations

### Import Prisma Client

```typescript
import { prisma } from "@/lib/prisma";
```

### User Operations

**Find by email:**

```typescript
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
});
```

**Create user:**

```typescript
const user = await prisma.user.create({
  data: {
    name: "John Doe",
    email: "john@example.com",
    password: hashedPassword,
    role: "user",
  },
});
```

**Update user:**

```typescript
const user = await prisma.user.update({
  where: { id: userId },
  data: { name: "Jane Doe" },
});
```

### Hospital Operations

**Get all hospitals:**

```typescript
const hospitals = await prisma.hospital.findMany({
  where: {
    isActive: true,
    hospitalType: "Private_General_Hospital",
  },
  orderBy: { name: "asc" },
});
```

**Create hospital:**

```typescript
const hospital = await prisma.hospital.create({
  data: {
    name: "General Hospital",
    registrationNumber: "REG123",
    taxId: "TAX456",
    email: "info@hospital.com",
    contactNumber: "+1234567890",
    hospitalType: "Private_General_Hospital",
    addressStreet: "123 Main St",
    addressCity: "Colombo",
    addressZipCode: "10000",
    addressCountry: "Sri Lanka",
    operatingHours: {
      monday: { open: "08:00", close: "17:00", isOpen: true },
      // ... other days
    },
  },
});
```

**Get hospital with sessions:**

```typescript
const hospital = await prisma.hospital.findUnique({
  where: { id: hospitalId },
  include: {
    sessions: true,
    appointments: true,
  },
});
```

### Doctor Operations

**Create doctor:**

```typescript
const doctor = await prisma.doctor.create({
  data: {
    firstName: "Dr. John",
    lastName: "Smith",
    slmcNumber: "SLMC123",
    nicNumber: "NIC456",
    email: "dr.smith@example.com",
    phoneNumber: "+1234567890",
    specialization: "Cardiology",
  },
});
```

**Find doctors by specialization:**

```typescript
const doctors = await prisma.doctor.findMany({
  where: {
    specialization: "Cardiology",
  },
  include: {
    sessions: true,
  },
});
```

### Session Operations

**Create session:**

```typescript
const session = await prisma.session.create({
  data: {
    doctorName: "Dr. Smith",
    specialization: "Cardiology",
    date: new Date("2024-12-01"),
    time: "09:00",
    room: "101",
    maxAppointments: 20,
    status: "active",
  },
});
```

**Get active sessions:**

```typescript
const sessions = await prisma.session.findMany({
  where: {
    status: "active",
    date: {
      gte: new Date(), // sessions from today onwards
    },
  },
  orderBy: { date: "asc" },
});
```

### DoctorSession Operations

**Create doctor session with relations:**

```typescript
const doctorSession = await prisma.doctorSession.create({
  data: {
    doctorId: doctor.id,
    doctorName: doctor.firstName + " " + doctor.lastName,
    hospitalId: hospital.id,
    date: new Date("2024-12-01"),
    startTime: "09:00",
    endTime: "12:00",
    maxAppointments: 20,
    fee: 2000,
    status: "active",
    isRecurring: false,
    createdBy: userId,
  },
});
```

**Get sessions with doctor and hospital:**

```typescript
const sessions = await prisma.doctorSession.findMany({
  where: {
    hospitalId: hospitalId,
    date: {
      gte: new Date(),
    },
  },
  include: {
    doctor: true,
    hospital: true,
    appointments: true,
  },
});
```

### Appointment Operations

**Create appointment:**

```typescript
const appointment = await prisma.appointment.create({
  data: {
    appointmentNumber: "APT-001",
    patientId: "patient-id",
    patientName: "Jane Doe",
    patientPhone: "+1234567890",
    patientEmail: "jane@example.com",
    doctorId: doctor.id,
    sessionId: session.id,
    hospitalId: hospital.id,
    appointmentDate: new Date("2024-12-01"),
    appointmentTime: "09:00",
    appointmentType: "online",
    fee: 2000,
    createdBy: userId,
  },
});
```

**Get appointments with relations:**

```typescript
const appointments = await prisma.appointment.findMany({
  where: {
    patientId: patientId,
    status: "confirmed",
  },
  include: {
    doctor: true,
    hospital: true,
    session: true,
  },
  orderBy: { appointmentDate: "desc" },
});
```

## Advanced Queries

### Filtering

**Multiple conditions:**

```typescript
const hospitals = await prisma.hospital.findMany({
  where: {
    AND: [{ isActive: true }, { hospitalType: "Private_General_Hospital" }],
  },
});
```

**OR conditions:**

```typescript
const users = await prisma.user.findMany({
  where: {
    OR: [{ role: "admin" }, { role: "hospital" }],
  },
});
```

### Pagination

```typescript
const page = 1;
const perPage = 10;

const hospitals = await prisma.hospital.findMany({
  skip: (page - 1) * perPage,
  take: perPage,
  orderBy: { createdAt: "desc" },
});

const total = await prisma.hospital.count();
```

### Aggregation

```typescript
const stats = await prisma.appointment.aggregate({
  where: { hospitalId: hospitalId },
  _count: { id: true },
  _avg: { fee: true },
  _sum: { fee: true },
});
```

### Transactions

```typescript
const result = await prisma.$transaction(async (tx) => {
  // Create appointment
  const appointment = await tx.appointment.create({
    data: {
      /* ... */
    },
  });

  // Update session count
  await tx.doctorSession.update({
    where: { id: sessionId },
    data: {
      currentAppointments: { increment: 1 },
    },
  });

  return appointment;
});
```

## Error Handling

```typescript
try {
  const user = await prisma.user.create({
    data: { email, name, password },
  });
} catch (error) {
  if (error.code === "P2002") {
    // Unique constraint violation
    return { error: "Email already exists" };
  }
  if (error.code === "P2025") {
    // Record not found
    return { error: "User not found" };
  }
  throw error;
}
```

## Common Prisma Error Codes

- `P2002` - Unique constraint violation
- `P2025` - Record not found
- `P2003` - Foreign key constraint violation
- `P2014` - Relation violation

## Select Specific Fields

```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
    // password excluded
  },
});
```

## Include Relations

```typescript
const hospital = await prisma.hospital.findUnique({
  where: { id: hospitalId },
  include: {
    sessions: {
      where: { status: "active" },
      include: {
        doctor: true,
      },
    },
  },
});
```
