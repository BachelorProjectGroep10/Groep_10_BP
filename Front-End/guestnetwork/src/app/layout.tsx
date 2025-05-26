import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./Styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UCLL Guest Network Project",
  description: "Bachelorproef UCLL Guest Network groep 10",
  icons: {
    icon: "/favicon.ico",
  }
};

interface LayoutProps {
  children: React.ReactNode;
  types: any;
}

export default function RootLayout({
  children,
  types
}: LayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
