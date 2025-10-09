export const metadata = {
  title: "WealthArc Admin Panel",
  description: "WealthArc admin panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <body>{children}</body>;
}
