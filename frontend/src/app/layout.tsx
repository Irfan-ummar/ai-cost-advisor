import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StagewiseDevToolbar from '@/components/StagewiseDevToolbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CostOptimizer AI Agent",
  description: "AI-powered cost optimization guidance for developers and decision-makers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <StagewiseDevToolbar />
      </body>
    </html>
  );
}

