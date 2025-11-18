# Migration Checklist

## ✅ Completed

- [x] Created Prisma schema with all models
- [x] Installed Prisma dependencies (@prisma/client, prisma)
- [x] Created Prisma client utility (src/lib/prisma.ts)
- [x] Updated all route files to use Prisma
  - [x] src/app/api/auth/signup/route.ts
  - [x] src/app/api/auth/[...nextauth]/route.ts
  - [x] src/app/api/hospital/route.ts
  - [x] src/app/api/hospital/[id]/route.ts
- [x] Updated controllers
  - [x] src/controllers/sessionController.ts
- [x] Created documentation
  - [x] MIGRATION_SUMMARY.md
  - [x] PRISMA_MIGRATION_GUIDE.md
  - [x] PRISMA_QUICK_REFERENCE.md
  - [x] README_PRISMA.md
- [x] Created helper scripts
  - [x] scripts/migrateData.ts
- [x] Fixed all TypeScript compilation errors

## ⏳ To Do (By You)

### 1. Update Environment Variables

```bash
# In your .env file, change:
MONGODB_URI="..."

# To:
DATABASE_URL="postgresql://neondb_owner:npg_hS4GMgiPZA5F@ep-billowing-bush-a880wp07-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require"
```

Note: Your existing MONGODB_URI already has the PostgreSQL connection string! Just rename it.

### 2. Generate Prisma Client

```bash
cd e:\Projects\EChanneling-Revamp
npx prisma generate
```

### 3. Create Database Tables

```bash
npx prisma migrate dev --name init
```

This will:

- Connect to your PostgreSQL database
- Create all tables (users, doctors, hospitals, sessions, appointments, etc.)
- Apply all indexes and constraints
- Generate migration files

### 4. Test the Application

```bash
npm run dev
```

Test these endpoints:

- [ ] POST /api/auth/signup - Create a user
- [ ] POST /api/auth/signin - Login
- [ ] GET /api/hospital - List hospitals
- [ ] POST /api/hospital - Create hospital (need admin/hospital role)
- [ ] GET /api/sessions - List sessions
- [ ] POST /api/sessions - Create session

### 5. (Optional) Migrate Existing Data

If you have data in MongoDB:

1. Update `scripts/migrateData.ts` with your MongoDB connection
2. Run: `npx ts-node scripts/migrateData.ts`

### 6. (Optional) Clean Up

After confirming everything works:

```bash
# Remove MongoDB files
rm src/lib/mongodb.ts
rm -r src/models/

# Uninstall MongoDB packages
npm uninstall mongoose mongodb
```

## 🧪 Testing Checklist

- [ ] User signup works
- [ ] User login works (credentials)
- [ ] User login works (Google OAuth)
- [ ] Hospital CRUD operations work
- [ ] Sessions can be created
- [ ] Sessions can be listed
- [ ] Sessions can be cancelled
- [ ] Sessions can be deleted
- [ ] All TypeScript types are correct
- [ ] No compilation errors
- [ ] No runtime errors

## 📊 Database Verification

After migration, verify:

```bash
# Open Prisma Studio
npx prisma studio
```

Check that tables exist:

- [ ] users
- [ ] doctors
- [ ] hospitals
- [ ] sessions
- [ ] doctor_sessions
- [ ] appointments

Check that indexes exist for:

- [ ] User email (unique)
- [ ] Doctor slmcNumber (unique)
- [ ] Doctor nicNumber (unique)
- [ ] Hospital registrationNumber (unique)
- [ ] Hospital taxId (unique)
- [ ] Session date
- [ ] Appointment date

## 🚨 Important Notes

1. **Your DATABASE_URL is already PostgreSQL!** It was just labeled as MONGODB_URI
2. **Enum values use underscores:** `"Private General Hospital"` → `Private_General_Hospital`
3. **IDs changed from ObjectId to cuid strings**
4. **Hospital addresses are now flat fields:** addressStreet, addressCity, etc.
5. **Error codes changed:** MongoDB `11000` → Prisma `P2002`

## 📚 Resources

- MIGRATION_SUMMARY.md - Overview of changes
- PRISMA_MIGRATION_GUIDE.md - Detailed guide
- PRISMA_QUICK_REFERENCE.md - Query examples
- README_PRISMA.md - Full documentation

## 🆘 Need Help?

If you encounter issues:

1. **TypeScript errors:** Run `npx prisma generate`
2. **Connection errors:** Check DATABASE_URL in .env
3. **Migration errors:** Ensure PostgreSQL connection works
4. **Query errors:** Check PRISMA_QUICK_REFERENCE.md for examples

## ✨ Next Steps After Migration

1. Consider adding more indexes for performance
2. Set up database backups
3. Configure connection pooling for production
4. Add database seeding scripts
5. Set up CI/CD with automatic migrations

Good luck! 🚀
