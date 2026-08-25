import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Generator — Fast, Private, Free",
  description:
    "Generate QR codes instantly in your browser. No data leaves your device. Customize colors, styles, and download as PNG or SVG.",
  keywords: ["QR code generator", "QR code", "free QR code", "private QR code"],
  openGraph: {
    title: "QR Generator — Fast, Private, Free",
    description:
      "Generate QR codes instantly in your browser. No data leaves your device.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0A090F] text-white">
        {children}
      </body>
    </html>
  );
}
