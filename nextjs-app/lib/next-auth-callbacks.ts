import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

export interface TokenWithExtras extends JWT {
  userId?: string;
  role?: "USER" | "ADMIN";
  passwordChangedAt?: number | null;
  invalid?: boolean;
}

export type SessionWithExtras = Session & {
  error?: string;
  user?: Session["user"] & { id?: string; role?: "USER" | "ADMIN" };
};

export const callbacks: NextAuthOptions["callbacks"] = {
  async jwt({ token, user }): Promise<TokenWithExtras> {
    const t = token as TokenWithExtras;

    if (user) {
      const anyUser = user as any;
      if (anyUser.id) {
        t.userId = String(anyUser.id);
      }

      if (anyUser.role) {
        t.role = anyUser.role as "USER" | "ADMIN";
      } else {
        t.role = "USER";
      }

      if (anyUser.passwordChangedAt) {
        t.passwordChangedAt = Math.floor(new Date(anyUser.passwordChangedAt).getTime() / 1000);
      } else {
        t.passwordChangedAt = null;
      }

      t.invalid = false;

      return t;
    }

    return t;
  },

  async session({ session, token }): Promise<SessionWithExtras> {
    const t = token as TokenWithExtras;
    const s = session as SessionWithExtras;

    if (!s.user) s.user = {};
    if (t.userId) {
      s.user.id = t.userId;
    }

    if (t.role) {
      s.user.role = t.role;
    } else {
      s.user.role = "USER";
    }

    if (t.invalid) {
      s.error = "PasswordChanged";
    }

    return s;
  },
};