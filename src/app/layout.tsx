import { cn } from "@/lib/utils";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  weight: "400",
  variable: "--global-font",
});

export default function RootLayout({
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
          <Navbar/>
          <Container>{children}</Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
