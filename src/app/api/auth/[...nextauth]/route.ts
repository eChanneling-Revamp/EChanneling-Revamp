import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { getSafeKafkaProducer } from "@/kafka/safe-producer";

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // ✅ Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ✅ Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        if (user.status !== 'ACTIVE') {
          throw new Error("Account is not active");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Handle Google sign-in
      if (account?.provider === "google") {
        let existingUser = await prisma.user.findUnique({
          where: { email: profile?.email }
        });

        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              name: profile?.name || 'Google User',
              email: profile?.email || '',
              role: "USER", // default role
              status: "ACTIVE",
            }
          });

          // Send Kafka event for new user (safe - won't block if Kafka fails)
          const kafkaProducer = getSafeKafkaProducer();
          await kafkaProducer.sendUserCreatedEvent({
            userId: existingUser.id,
            email: existingUser.email,
            name: existingUser.name || '',
            role: existingUser.role,
          });
        }

        token.userId = existingUser.id;
        token.role = existingUser.role;
        token.name = existingUser.name || '';
        token.email = existingUser.email;
      }

      // Handle Credentials sign-in
      if (account?.provider === "credentials" && user) {
        token.userId = (user as any).id;
        token.role = (user as any).role;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId;
        (session.user as any).role = token.role;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      (session as any).accessToken = token;
      return session;
    },

    async signIn({ user, account, profile }) {
      // Log sign-in event (safe - won't block if Kafka fails)
      if (user.id) {
        const kafkaProducer = getSafeKafkaProducer();
        await kafkaProducer.sendAuditLogEvent({
          action: 'LOGIN',
          entityType: 'USER',
          entityId: user.id,
          userId: user.id,
          newValues: {
            provider: account?.provider,
            timestamp: new Date().toISOString(),
          },
        });
      }
      return true;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

export { handler as GET, handler as POST };
