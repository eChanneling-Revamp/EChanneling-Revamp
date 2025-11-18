# EChanneling Revamp - PostgreSQL with Prisma

This project has been migrated from MongoDB (Mongoose) to PostgreSQL (Prisma ORM).

## 🗄️ Database Structure

### Models

- **User** - System users (admin, user, hospital, doctor)
- **Doctor** - Doctor profiles with SLMC and NIC numbers
- **Hospital** - Hospital information with operating hours
- **Session** - Basic appointment sessions
- **DoctorSession** - Advanced sessions with recurring support
- **Appointment** - Patient appointments with payment tracking

### Technology Stack

- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Backend:** Next.js 15 API Routes
- **Auth:** NextAuth.js with Google OAuth

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file (or update existing):

```env
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates all tables, indexes, and constraints in your PostgreSQL database.

### 5. (Optional) View Database

```bash
npx prisma studio
```

Opens a GUI at http://localhost:5555 to view and edit data.

### 6. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
EChanneling-Revamp/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Migration history
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── auth/          # Authentication routes
│   │       ├── hospital/      # Hospital CRUD
│   │       └── sessions/      # Session management
│   ├── lib/
│   │   └── prisma.ts          # Prisma client instance
│   └── controllers/
│       └── sessionController.ts
├── scripts/
│   └── migrateData.ts         # Data migration helper
├── MIGRATION_SUMMARY.md       # What was changed
├── PRISMA_MIGRATION_GUIDE.md  # Detailed migration guide
└── PRISMA_QUICK_REFERENCE.md  # Query examples
```

## 🔧 Common Commands

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name migration_description

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset

# Open database GUI
npx prisma studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate
```

### Database Management

```bash
# Check migration status
npx prisma migrate status

# See what would change
npx prisma migrate diff

# Create migration without applying
npx prisma migrate dev --create-only
```

## 📖 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login (NextAuth)
- `GET /api/auth/signout` - Logout

### Hospitals

- `GET /api/hospital` - List all hospitals
- `POST /api/hospital` - Create hospital (admin/hospital role)
- `GET /api/hospital/[id]` - Get hospital details
- `PUT /api/hospital/[id]` - Update hospital (admin/hospital role)
- `DELETE /api/hospital/[id]` - Delete hospital (admin only)

### Sessions

- `GET /api/sessions` - List all sessions
- `POST /api/sessions` - Create session
- `PUT /api/sessions?id=xyz&action=cancel` - Cancel session
- `DELETE /api/sessions?id=xyz` - Delete session

## 🔑 Environment Variables

| Variable               | Description                  | Required |
| ---------------------- | ---------------------------- | -------- |
| `DATABASE_URL`         | PostgreSQL connection string | Yes      |
| `NEXTAUTH_SECRET`      | Secret for NextAuth.js       | Yes      |
| `NEXTAUTH_URL`         | Base URL of your app         | Yes      |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID       | No       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret          | No       |

## 📚 Documentation

- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Overview of what was migrated
- **[PRISMA_MIGRATION_GUIDE.md](./PRISMA_MIGRATION_GUIDE.md)** - Step-by-step migration process
- **[PRISMA_QUICK_REFERENCE.md](./PRISMA_QUICK_REFERENCE.md)** - Common query patterns

## 🛡️ Type Safety

Prisma provides full type safety. After running `npx prisma generate`, you get:

- Autocomplete for all models and fields
- Type-safe queries
- Compile-time error checking
- IntelliSense support

Example:

```typescript
import { prisma } from "@/lib/prisma";

// TypeScript knows all User fields
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
});

// TypeScript error if field doesn't exist
const x = await prisma.user.findUnique({
  where: { invalidField: "test" }, // ❌ Error
});
```

## 🐛 Troubleshooting

### "Cannot find module '@prisma/client'"

Run: `npx prisma generate`

### Migration fails

- Ensure DATABASE_URL is correct
- Check PostgreSQL connection
- Verify user has CREATE/ALTER permissions

### Type errors in IDE

- Regenerate Prisma Client: `npx prisma generate`
- Restart TypeScript server (VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server")

### Connection pooling issues in development

The `src/lib/prisma.ts` file uses a singleton pattern to prevent connection issues during hot reloads.

## 📦 Deployment

### Vercel / Netlify

1. Add `DATABASE_URL` to environment variables
2. Add build command: `npx prisma generate && npm run build`
3. Migrations run automatically with `prisma migrate deploy`

### Docker

Add to your Dockerfile:

```dockerfile
RUN npx prisma generate
RUN npx prisma migrate deploy
```

## 🔗 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Neon PostgreSQL](https://neon.tech/docs)

## 📝 License

[Your License Here]

## 👥 Contributors

[Your Team Here]
