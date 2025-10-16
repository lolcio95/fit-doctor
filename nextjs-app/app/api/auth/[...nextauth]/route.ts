import NextAuth, { SessionStrategy } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from "@next-auth/prisma-adapter"; // <--- DODAJ TO
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

const authOptions = {
  adapter: PrismaAdapter(prisma), // <--- DODAJ TO
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_AUTH_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "••••••••" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.username },
              { name: credentials.username }
            ]
          }
        });
        if (!user) return null;
        //@ts-ignore
        const passwordValid = await compare(credentials.password, user.password);
        if (!passwordValid) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
