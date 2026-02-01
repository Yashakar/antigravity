import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantId: { label: "Tenant ID", type: "text" },
      },
      authorize: async (credentials) => {
        // Mock authorization for now
        // In real app, verify email/password and fetch tenantId from DB
        const parsed = z.object({
            email: z.string().email(),
            password: z.string().min(1),
            tenantId: z.string().optional()
        }).safeParse(credentials);

        if (!parsed.success) return null;

        // Dummy return
        return {
            id: "user-1",
            email: parsed.data.email,
            name: "Test User",
            // We'll attach tenantId in the jwt callback
            tenantId: parsed.data.tenantId || "tenant-1"
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.tenantId = (user as any).tenantId
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).tenantId = token.tenantId
      }
      return session
    },
  },
})
