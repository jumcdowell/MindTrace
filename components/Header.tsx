"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Badge } from './Badge';

interface HeaderProps {
  currentPath?: string;
}

export const Header = ({ currentPath = '/' }: HeaderProps) => {
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch user data (streak, notifications)
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // TODO: Fetch actual streak and notification count from database
        setStreak(12); // Mock data
        setNotificationCount(1); // Mock data
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Daily Hub' },
    { path: '/analytics', label: 'Tracking & Analytics' },
    { path: '/notifications', label: 'Alerts' },
  ];

  return (
    <header className="bg-cream-surface border-b border-cream-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-blue-light">
              <span className="text-xl">🧠</span>
            </div>
            <span className="text-xl font-bold text-slate-blue">MindTrace</span>
          </div>

          {/* Streak Indicator */}
          <div className="hidden md:flex items-center">
            <Badge variant="sage" size="md">
              🔥 {streak}-Day Streak
            </Badge>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`text-base font-semibold transition-colors ${
                  currentPath === item.path
                    ? 'text-slate-blue'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                {item.label}
                {item.path === '/notifications' && notificationCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-slate-blue rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-blue text-white font-semibold text-lg"
              aria-label="User menu"
            >
              U
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-cream-border py-2">
                <button
                  onClick={() => {
                    router.push('/settings');
                    setUserMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-base font-semibold text-text-main hover:bg-cream-card-hover transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setUserMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-base font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
