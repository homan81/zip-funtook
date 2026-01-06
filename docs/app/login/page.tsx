'use client';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the client component (keeps the server page clean)
const LoginClient = dynamic(() => import('./LoginClient'), { ssr: false });

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
