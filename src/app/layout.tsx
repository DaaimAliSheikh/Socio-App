import { cn } from "@/lib/utils";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import { Session } from "next-auth";
import React from "react";
import getUserById from "@/lib/getUserById";

const inter = Inter({
  subsets: ["latin"],
  weight: "400",
  variable: "--global-font",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background  font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <Container>{children}</Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
