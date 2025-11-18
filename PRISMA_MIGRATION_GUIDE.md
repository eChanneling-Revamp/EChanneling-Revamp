# MongoDB to PostgreSQL Migration Guide

## Migration Overview

This project has been successfully migrated from MongoDB (using Mongoose) to PostgreSQL (using Prisma ORM).

## What Was Changed

### 1. Database Schema

- Created `prisma/schema.prisma` with all models:
  - User
  - Doctor
  - Hospital
  - Session
  - DoctorSession
  - Appointment

### 2. Dependencies

**Added:**

- `@prisma/client` - Prisma Client for database queries
- `prisma` (dev) - Prisma CLI tools

**To Remove (optional):**

```bash
npm uninstall mongoose mongodb
```

### 3. Files Modified

**Created:**

- `prisma/schema.prisma` - Database schema definition
- `src/lib/prisma.ts` - Prisma client singleton instance
- `.env.example` - Environment variable template

**Updated:**

- `src/app/api/auth/signup/route.ts` - User signup with Prisma
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth authentication with Prisma
- `src/app/api/hospital/route.ts` - Hospital CRUD operations with Prisma
- `src/app/api/hospital/[id]/route.ts` - Individual hospital operations with Prisma
- `src/controllers/sessionController.ts` - Session management with Prisma

**To Delete (optional):**

- `src/lib/mongodb.ts` - MongoDB connection utility (no longer needed)
- `src/models/*.ts` - Mongoose models (replaced by Prisma schema)

## Setup Instructions

### Step 1: Update Environment Variables

Update your `.env` file to use `DATABASE_URL` instead of `MONGODB_URI`:

```env
# Change MONGODB_URI to DATABASE_URL
DATABASE_URL="postgresql://neondb_owner:npg_hS4GMgiPZA5F@ep-billowing-bush-a880wp07-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### Step 2: Generate Prisma Client

```bash
npx prisma generate
```

This generates the Prisma Client based on your schema.

### Step 3: Create Database Tables

Run the initial migration to create tables in PostgreSQL:

```bash
npx prisma migrate dev --name init
```

This will:

- Create all tables in your PostgreSQL database
- Apply indexes and constraints
- Generate migration files in `prisma/migrations/`

### Step 4: (Optional) Migrate Existing Data

If you have existing data in MongoDB that needs to be migrated:

1. Export data from MongoDB
2. Transform the data format (ObjectId → cuid, embedded objects → normalized fields)
3. Import using Prisma Client or SQL scripts

**Note:** Hospital addresses need to be flattened:

- MongoDB: `address.street` → PostgreSQL: `addressStreet`
- MongoDB: `address.city` → PostgreSQL: `addressCity`
- MongoDB: `address.zipCode` → PostgreSQL: `addressZipCode`
- MongoDB: `address.country` → PostgreSQL: `addressCountry`

### Step 5: Test the Application

```bash
npm run dev
```

Test all API endpoints to ensure they work correctly with PostgreSQL.

## Key Differences

### ID Fields

- **MongoDB:** `_id` (ObjectId)
- **PostgreSQL:** `id` (cuid string)

### Queries

**MongoDB/Mongoose:**

```typescript
await User.findOne({ email: "test@example.com" });
await Hospital.find({ isActive: true });
await User.create({ name, email, password });
```

**PostgreSQL/Prisma:**

```typescript
await prisma.user.findUnique({ where: { email: "test@example.com" } });
await prisma.hospital.findMany({ where: { isActive: true } });
await prisma.user.create({ data: { name, email, password } });
```

### Embedded Documents vs Relations

**MongoDB:** Used embedded documents (e.g., `address` object in Hospital)
**PostgreSQL:** Flattened into separate columns with prefixes

### Enums

Enums are now type-safe at the database level:

- `Role`: admin, user, hospital, doctor
- `HospitalType`: Private_General_Hospital, Private_Specialty_Hospital, Government_Hospital
- `AppointmentStatus`: pending, confirmed, cancelled, completed
- etc.

## Database Commands

### View Database

```bash
npx prisma studio
```

Opens a GUI to browse and edit your database.

### Create Migration

```bash
npx prisma migrate dev --name description_of_changes
```

### Deploy to Production

```bash
npx prisma migrate deploy
```

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

## Troubleshooting

### "Cannot find module '@prisma/client'"

Run: `npx prisma generate`

### Migration Errors

- Ensure DATABASE_URL is correct in `.env`
- Check PostgreSQL connection
- Verify database exists and user has permissions

### Type Errors

- Regenerate Prisma Client: `npx prisma generate`
- Restart TypeScript server in VS Code

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [From MongoDB to PostgreSQL](https://www.prisma.io/docs/guides/migrate-to-prisma/migrate-from-mongoose)

## Next Steps

1. ✅ Schema created
2. ✅ Dependencies installed
3. ✅ Route files updated
4. ⏳ Update `.env` with `DATABASE_URL`
5. ⏳ Run `npx prisma generate`
6. ⏳ Run `npx prisma migrate dev --name init`
7. ⏳ Test all API endpoints
8. ⏳ Remove old MongoDB files (optional)
