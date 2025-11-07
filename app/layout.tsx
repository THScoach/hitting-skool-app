import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hits Tempo Analyzer",
  description:
    "Quickly analyze swing phases and tempo ratios with a dark, athletic UI tailored for hitters.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="bg-canvas">
      <body className="min-h-screen bg-transparent text-canvas-foreground">
        {children}
      </body>
    </html>
  );
}
