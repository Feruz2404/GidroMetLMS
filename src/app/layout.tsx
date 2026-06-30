import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GidroEdu LMS — Malaka Oshirish Platformasi",
  description:
    "Gidrometeorologiya Texnikumining raqamli o'qitish va malaka oshirish platformasi. Kurslar, testlar, kutubxona, sertifikatlar.",
  keywords: [
    "GidroEdu",
    "LMS",
    "Gidrometeorologiya",
    "o'qitish",
    "malaka oshirish",
    "sertifikat",
  ],
  authors: [{ name: "Gidrometeorologiya Texnikumi" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
