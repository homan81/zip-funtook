"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      const redirect = encodeURIComponent(pathname + (searchParams ? `?${searchParams.toString()}` : ''));
      router.push(`/login?redirect=${redirect}`);
    }
  }, [status, router, pathname, searchParams]);

  if (status === 'loading' || status === 'unauthenticated') return null;
  return <>{children}</>;
}
