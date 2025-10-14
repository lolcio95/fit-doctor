export const metadata = {
  title: "FitDoctor Admin Panel",
  description: "FitDoctor admin panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <body>{children}</body>;
}
