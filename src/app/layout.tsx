import "~/styles/globals.css";

import type { Metadata } from "next";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { TRPCReactProvider } from "~/trpc/react";
import RootClientLayout from "./_clientLayout";

export const metadata: Metadata = {
  title: "Sailing Finder",

  description: "A web app for finding closests sailing races to you.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <TRPCReactProvider>
          <RootClientLayout>{children}</RootClientLayout>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
