import type { Metadata } from "next";

// TODO: come up with a better project name
export const metadata: Metadata = {
  title: "Slot Machine",
  description: "Slot Machine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
