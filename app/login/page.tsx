'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setError('');
    setSuccessMessage('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        // Hard redirect forces Next.js to reload state and land on dashboard
        window.location.assign('/dashboard');
      } else {
        setError('Failed to establish session. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const redirectUrl = `${window.location.origin}/dashboard`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      if (data.session) {
        window.location.assign('/dashboard');
      } else {
        setSuccessMessage('Account created! You can now switch to "Sign In" and log in.');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-base px-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-blue-light mb-4">
            <span className="text-4xl">🧠</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-blue mb-2">
            MindTrace
          </h1>
          <p className="text-lg text-text-muted">
            Your daily cognitive health companion
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-cream-surface rounded-2xl p-8 shadow-lg border border-cream-border">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-lg transition-all ${
                mode === 'login'
                  ? 'bg-slate-blue text-white shadow-sm'
                  : 'bg-cream-card-hover text-text-main hover:bg-cream-border'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('signup')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-lg transition-all ${
                mode === 'signup'
                  ? 'bg-slate-blue text-white shadow-sm'
                  : 'bg-cream-card-hover text-text-main hover:bg-cream-border'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text-main mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 px-4 text-lg rounded-xl border-2 border-cream-border bg-white focus:border-slate-blue focus:outline-none focus:ring-2 focus:ring-slate-blue-light transition-all text-text-main"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text-main mb-2">
                {mode === 'login' ? 'Password' : 'Create Password'}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-14 px-4 pr-12 text-lg rounded-xl border-2 border-cream-border bg-white focus:border-slate-blue focus:outline-none focus:ring-2 focus:ring-slate-blue-light transition-all text-text-main"
                  placeholder={mode === 'login' ? '••••••••' : 'Create a password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-sm text-text-muted mt-2">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-xl border bg-red-50 border-red-200 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-4 rounded-xl border bg-green-50 border-green-200 text-green-700 text-sm font-medium">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-slate-blue hover:bg-slate-blue-hover text-white font-semibold text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading 
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...') 
                : (mode === 'login' ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>
        </div>

        {/* Help Text */}
        <p className="text-center mt-6 text-text-muted text-base">
          Need help? Contact support at{' '}
          <a href="mailto:support@mindtrace.ai" className="text-slate-blue hover:text-slate-blue-hover font-semibold">
            support@mindtrace.ai
          </a>
        </p>
      </div>
    </div>
  );
}