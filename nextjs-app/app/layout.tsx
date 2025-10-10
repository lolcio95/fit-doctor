import NextScript from "next/script";
import "./globals.css";

import { Manrope } from "next/font/google";
import AuthProvider from "./context/AuthProvider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} antialiased scroll-smooth`}>
      <head>
        <link
          rel="preconnect"
          href="https://v1.api.service.cmp.usercentrics.eu"
          crossOrigin="anonymous"
        />
        {process.env.NODE_ENV === "production" && (
          <NextScript
            id="usercentrics-cmp"
            src="https://web.cmp.usercentrics.eu/ui/loader.js"
            data-settings-id={process.env.NEXT_PUBLIC_USER_CENTRICS_ID}
          ></NextScript>
        )}
      </head>
      <AuthProvider>{children}</AuthProvider>
    </html>
  );
}
