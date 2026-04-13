import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./retro.css";
import CrtToggle from "@/app/components/CrtToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aaenz.no"),
  title: {
    default: "aaenz",
    template: "%s · aaenz",
  },
  applicationName: "aaenz",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "aaenz",
    siteName: "aaenz",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary",
    title: "aaenz",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CrtToggle />
        <div className="crt-overlay" aria-hidden="true" />
        <div className="crt-content flex-1">{children}</div>
      </body>
    </html>
  );
}
