"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Auto sign in after successful registration
      const signRes = await signIn('credentials', { redirect: false, email, password });
      setLoading(false);
      if (signRes && (signRes as any).error) {
        router.push('/login');
        return;
      }

      router.push('/checkout');
    } catch (err) {
      console.error(err);
      setError('Server error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Create an account</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name (optional)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Your name" />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" type="email" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" type="password" placeholder="Password" />
          </div>

          <button disabled={loading} className="w-full bg-[#FC6E88] text-white py-2 rounded">{loading ? 'Creating...' : 'Create account'}</button>
        </form>
      </div>
    </div>
  );
}
