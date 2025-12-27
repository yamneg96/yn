import type { Metadata } from "next";
import { Inter } from "next/font/google";
// Correct Import for Next.js 14
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { ThemeProvider } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yamlak Negash | Portfolio",
  description: "MERN Stack Developer & Agentic AI Specialist Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/yn.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {/* Vercel Analytics Component */}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
