import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const handler = NextAuth({
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
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user) throw new Error("Invalid email or password");

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password || ""
        );
        if (!isValid) throw new Error("Invalid email or password");

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
          where: { email: profile?.email || "" },
        });

        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              name: profile?.name || "",
              email: profile?.email || "",
              password: "", // OAuth users don't have passwords
              role: "AGENT", // default role
            },
          });
        }

        token.userId = existingUser.id;
        token.role = existingUser.role;
        token.name = existingUser.name || "";
        token.email = existingUser.email;
      }

      // Handle Credentials sign-in
      if (account?.provider === "credentials" && user) {
        token.userId = (user as any).id;
        token.role = (user as any).role;
        token.name = user.name || "";
        token.email = user.email || "";
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
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
