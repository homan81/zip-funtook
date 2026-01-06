"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    const res = await signIn('credentials', { redirect: false, email, password });
    if (res && (res as any).error) {
      setError((res as any).error || 'Login failed');
      return;
    }

    router.push(redirect);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Login to continue</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
              type="password"
              placeholder="Password"
            />
          </div>

          <button className="w-full bg-[#FC6E88] text-white py-2 rounded">Login</button>
        </form>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: redirect })}
            className="w-full flex items-center justify-center gap-2 border py-2 rounded bg-white"
          >
            <FcGoogle className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
        <div className="mt-4 text-center text-sm">
          <a href="/register" className="text-[#FC6E88] hover:underline">Create an account</a>
        </div>
      </div>
    </div>
  );
}
