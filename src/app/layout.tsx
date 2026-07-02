import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
        className="font-sans antialiased bg-background text-foreground"
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
