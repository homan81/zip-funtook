"use client";

import React from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  if (!session?.user) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-white border rounded px-3 py-2 shadow flex items-center gap-3 z-50">
      <div className="text-sm">{(session.user as any).email}</div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="text-xs text-[#FC6E88] hover:underline"
      >
        Sign out test
      </button>
    </div>
  );
}
