import NextAuth, { SessionStrategy } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
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
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "42", name: "Dave", email: "dave@example.com", password: "nextauth" };
        if (credentials?.username === user.name && credentials?.password === user.password) {
          return user;
        }
        return null;
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
