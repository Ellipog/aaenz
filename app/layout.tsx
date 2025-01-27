import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aaenz Web Portal",
  description: "Web portal for Aaenz subdomains",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
