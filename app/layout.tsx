import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AppWrapper } from "@/components/app-wrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "TokenFlowX - Digital Rights Execution",
  description: "Transform digital rights into verifiable execution with TokenFlowX. Accept, execute, and receive instant proof of your actions.",
    generator: 'v0.app'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AppWrapper>{children}</AppWrapper>
        
        {/* Pi Network SDK - Loaded after body to ensure proper injection */}
        <script 
          src="https://sdk.minepi.com/pi-sdk.js"
          async
        ></script>
      </body>
    </html>
  );
}
