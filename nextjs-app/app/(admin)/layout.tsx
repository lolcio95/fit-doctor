"use client";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body style={{ display: "flex", minHeight: "100vh" }}>
      <main className="lg:mt-0" style={{ flex: 1, padding: "2rem" }}>
        {children}
      </main>
    </body>
  );
}
