import type { Metadata } from "next";
import "@/app/globals.css";

// TODO: come up with a better project name
export const metadata: Metadata = {
  title: "Slot Machine",
  description: "Slot Machine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
