import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CostOptimizer AI Agent",
  description: "AI-powered cost optimization guidance for developers and decision-makers",
};

// Stagewise toolbar component that only renders in development
function StagewiseDevToolbar() {
  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  // Dynamic import to ensure it's only loaded in development
  const { StagewiseToolbar } = require('@stagewise/toolbar-next');
  
  const stagewiseConfig = {
    plugins: []
  };

  return <StagewiseToolbar config={stagewiseConfig} />;
}

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
