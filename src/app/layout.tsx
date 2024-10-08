import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "~/styles/globals.css";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "./_components/theme-provider";

import { Toaster } from "~/components/ui/toaster";
import SessionProvider from "~/context/SessionProvider";

export const metadata: Metadata = {
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="relative z-0 h-full w-full">
        <SessionProvider>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader showSpinner={false} color="#22c55e" />
              {children}
              <Toaster />
            </ThemeProvider>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
