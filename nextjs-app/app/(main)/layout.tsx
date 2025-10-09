import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import dynamic from "next/dynamic";

import { Footer } from "@/app/components/organisms/Footer";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import { Navbar } from "@/app/components/organisms/Navbar";
import DraftModeToast from "@/app/components/DraftModeToast";
import { SanityLive } from "@/sanity/lib/live";

import { handleError } from "../client-utils";

const VisualEditing = dynamic(() =>
  import("next-sanity").then((mod) => mod.VisualEditing)
);

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });

  return {};
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <body className="flex min-h-screen flex-col">
      {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
      <Toaster />
      {isDraftMode && (
        <>
          <DraftModeToast />
          {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
          <Suspense fallback={null}>
            <VisualEditing />
          </Suspense>
        </>
      )}
      {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
      <SanityLive onError={handleError} />
      <Navbar />
      <main className="grow flex-col flex">{children}</main>
      <Footer />
      <SpeedInsights />
    </body>
  );
}
