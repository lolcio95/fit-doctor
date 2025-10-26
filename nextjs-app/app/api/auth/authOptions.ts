import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { SessionStrategy } from "next-auth";
import { callbacks } from "@/lib/next-auth-callbacks";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_AUTH_GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_AUTH_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "••••••••" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const username = credentials.username.toLowerCase();
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: username },
              { name: credentials.username },
            ],
          },
        });

        if (!user) return null;

        if (!user.emailVerified) {
          throw new Error("Musisz najpierw potwierdzić adres e-mail.");
        }

        if (!user.password) return null;

        const passwordValid = await compare(credentials.password, user.password);
        if (!passwordValid) return null;

        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
        } as any;
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "",
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks,
};