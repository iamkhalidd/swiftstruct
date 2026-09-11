'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockClosedIcon, EnvelopeIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { SwiftStructMark } from '@/components/icons/BrandIcons';
import { adminApi } from '@/lib/adminApi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@swiftstruct.com');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminApi.auth.login(email, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-black/20">
            <SwiftStructMark className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-neutral-900">SwiftStruct Admin</h1>
          <p className="text-neutral-500 text-xs font-medium">
            Sign in to access corporate CMS & project management portal
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address</label>
            <div className="relative">
              <EnvelopeIcon className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:border-black font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Password</label>
            <div className="relative">
              <LockClosedIcon className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:border-black font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black hover:bg-neutral-800 text-white font-bold text-sm rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-black/10 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}{' '}
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-[11px] text-neutral-500 space-y-1">
          <p className="font-bold text-neutral-700">Default Seed Credentials:</p>
          <p>
            Email: <code className="font-mono text-neutral-900">admin@swiftstruct.com</code>
          </p>
          <p>
            Password: <code className="font-mono text-neutral-900">Admin123!</code>
          </p>
        </div>
      </div>
    </div>
  );
}
