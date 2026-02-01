import type { Metadata } from "next";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";
import { components } from "@/components/cms";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

// Initialize Storyblok for server-side (using NEXT_PUBLIC_ so same token works client + server)
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
