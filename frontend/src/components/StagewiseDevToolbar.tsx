'use client';

import dynamic from 'next/dynamic';

// Dynamically import Stagewise toolbar only in development
const StagewiseToolbar = dynamic(
  () => {
    if (process.env.NODE_ENV !== 'development') {
      return Promise.resolve(() => null);
    }
    return import('@stagewise/toolbar-next').then(mod => mod.StagewiseToolbar);
  },
  { 
    ssr: false,
    loading: () => null 
  }
);

export default function StagewiseDevToolbar() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const stagewiseConfig = {
    plugins: []
  };

  return <StagewiseToolbar config={stagewiseConfig} />;
} 