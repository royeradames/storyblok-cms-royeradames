import type { Metadata } from "next";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";
import { components } from "@repo/cms";
import "./globals.css";

// Initialize Storyblok for server-side
storyblokInit({
  accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  components,
});

export const metadata: Metadata = {
  title: "Gateway - Storyblok CMS",
  description: "CMS testing and development environment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
