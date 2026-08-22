import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FC Erlinsbach Admin",
  description: "Admin-Backend für die FC Erlinsbach App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
