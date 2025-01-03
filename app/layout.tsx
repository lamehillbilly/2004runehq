import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2004Scape Market",
  description: "A market to buy and sell items in 2004scape",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <div className="flex justify-center items-center p-10 max-w-5xl mx-auto">
          <Image src="/2004scape.png" alt="2004Scape Logo" width={400} height={400} />
          </div>
        {children}
      </body>
    </html>
  );
}
