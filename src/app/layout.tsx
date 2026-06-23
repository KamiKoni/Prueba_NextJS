import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";

import { AppProvider } from "@/components/providers/app-provider";

import "./globals.css";

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pantry Routes",
  description: "Recipe cards, secure authentication, MongoDB storage, and welcome email flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <head>
        <link href="https://res.cloudinary.com" rel="preconnect" />
        <link href="https://images.unsplash.com" rel="preconnect" />
      </head>
      <body className="min-h-full">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
