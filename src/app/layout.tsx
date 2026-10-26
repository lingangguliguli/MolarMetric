import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "MolarMetric — Dental Revenue Recovery OS",
  description:
    "Track patient enquiries, coordinate follow-ups, record appointments, and measure lead-to-revenue conversion for your dental clinic.",
  keywords: ["dental", "clinic", "CRM", "lead management", "revenue", "appointments"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
