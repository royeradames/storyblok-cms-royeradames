import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TemplateProvider } from "@/components/cms/TemplateProvider";
import "./globals.css";

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
        <TemplateProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </TemplateProvider>
      </body>
    </html>
  );
}
