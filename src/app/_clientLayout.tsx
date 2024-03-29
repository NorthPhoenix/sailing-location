"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { env } from "~/env";

export default function RootClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <APIProvider apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      {children}
    </APIProvider>
  );
}
