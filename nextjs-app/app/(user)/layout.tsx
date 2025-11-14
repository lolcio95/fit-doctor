"use client";

import Sidebar from "./components/Sidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main className="lg:mt-0" style={{ flex: 1, padding: "2rem" }}>
        {children}
      </main>
    </body>
  );
}
