"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function ArticlePage() {
  const { data: session, status } = useSession();

  return (
    <section
      className="bg-background pt-16 md:pt-24"
      aria-labelledby="article-title"
    >
      {status === "unauthenticated" ? (
        <>
          <div className="mb-4">
            <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
              Sign in with Google
            </Button>
          </div>
          <div>
            <Button
              onClick={() =>
                signIn("credentials", {
                  username: "Dave",
                  password: "nextauth",
                  callbackUrl: "/",
                  redirect: true,
                })
              }
            >
              Sign in with credentials
            </Button>
          </div>
        </>
      ) : (
        <Button onClick={() => signOut()}>Sign out</Button>
      )}
    </section>
  );
}
