import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Laptop,
  Languages,
  LogOut,
  ChevronDown,
  Search,
  Bell,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { authService } from '../../services/authService';
import { Badge } from '../ui/badge';

export function Header() {
  const user = useAuthStore((s) => s.user);
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const language = useUIStore((s) => s.language);
  const setLanguage = useUIStore((s) => s.setLanguage);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const isMockApi = useUIStore((s) => s.isMockApi);
  const setMockApi = useUIStore((s) => s.setMockApi);
  const t = useUIStore((s) => s.t);

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const langRef = useRef(null);
  const themeRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
  };

  return (
    <header className="h-16 border-b border-[#E2E8E4] dark:border-[#2A322D] bg-white dark:bg-[#06110C] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Hamburger and Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar menu"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5E6A64] hover:text-[#171717] hover:bg-[#F5F7F6] dark:text-[#9AA6A0] dark:hover:text-[#F4F6F5] dark:hover:bg-[#171717] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A31C18]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#A31C18] flex items-center justify-center font-black text-white text-lg tracking-wider shadow-button-glow glow-button">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#171717] dark:text-[#F4F6F5] tracking-tight text-base">
                Vrumm
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#F5F7F6] dark:bg-[#171717] text-[#5E6A64] dark:text-[#9AA6A0] font-medium border border-[#E2E8E4] dark:border-[#2A322D]">
                Admin
              </span>
              <Badge variant="forest" className="text-[10px] py-0 px-2 hidden md:inline-flex">
                Mumbai Cluster
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Search / Command Bar */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5E6A64] dark:text-[#9AA6A0]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search bookings, captains, fares (Press ⌘K)..."
            className="w-full bg-[#F5F7F6] dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl pl-9 pr-14 py-2 text-xs text-[#171717] dark:text-[#F4F6F5] placeholder:text-[#5E6A64] dark:placeholder:text-[#9AA6A0] focus:outline-none focus:ring-2 focus:ring-[#A31C18] focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E2E8E4] dark:bg-[#2A322D] text-[#5E6A64] dark:text-[#9AA6A0]">
              ⌘K
            </span>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mock API Mode Indicator */}
        <button
          onClick={() => setMockApi(!isMockApi)}
          title={isMockApi ? 'Mock API active. Click to switch to Live Backend.' : 'Live API mode. Click to enable Mock adapter.'}
          className={`min-h-[36px] px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-2 transition-all ${
            isMockApi
              ? 'bg-[#F5B301]/10 text-[#F5B301] border-[#F5B301]/30 hover:bg-[#F5B301]/20'
              : 'bg-[#15803D]/10 dark:bg-[#0B1A13] text-[#15803D] dark:text-[#1FD88A] border-[#15803D]/30 dark:border-[#1FD88A]/30 hover:shadow-card-glow'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isMockApi ? 'bg-[#F5B301] animate-pulse' : 'bg-[#15803D] dark:bg-[#1FD88A]'}`} />
          <span className="hidden md:inline">{isMockApi ? 'MOCK API' : 'LIVE API :4000'}</span>
        </button>

        {/* Notifications Icon */}
        <button
          aria-label="Notifications"
          className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5E6A64] dark:text-[#9AA6A0] hover:text-[#171717] dark:hover:text-[#F4F6F5] hover:bg-[#F5F7F6] dark:hover:bg-[#171717] transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#A31C18] ring-2 ring-white dark:ring-[#06110C]" />
        </button>

        {/* Language selector (Changes immediately on click) */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangMenuOpen((prev) => !prev)}
            aria-label="Select language"
            className="min-h-[44px] px-2.5 rounded-xl text-[#5E6A64] dark:text-[#9AA6A0] hover:text-[#171717] dark:hover:text-[#F4F6F5] hover:bg-[#F5F7F6] dark:hover:bg-[#171717] flex items-center gap-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#A31C18] transition-colors"
          >
            <Languages className="w-4 h-4 text-[#15803D] dark:text-[#1FD88A]" />
            <span className="uppercase font-bold text-[#171717] dark:text-[#F4F6F5]">{language}</span>
            <ChevronDown className="w-3 h-3 text-[#5E6A64] dark:text-[#9AA6A0]" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#171717] rounded-xl shadow-2xl border border-[#E2E8E4] dark:border-[#2A322D] py-1.5 z-50 text-xs">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी (Hindi)' },
                { code: 'mr', label: 'मराठी (Marathi)' },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-[#F5F7F6] dark:hover:bg-[#06110C] transition-colors ${
                    language === item.code
                      ? 'font-bold text-[#A31C18] dark:text-[#FF5A52]'
                      : 'text-[#171717] dark:text-[#F4F6F5]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle (Click toggles directly or choose from dropdown) */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setThemeMenuOpen((prev) => !prev)}
            onDoubleClick={toggleTheme}
            aria-label="Select theme"
            title={`Current theme: ${theme} (Click to open menu, double-click to toggle)`}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5E6A64] dark:text-[#9AA6A0] hover:text-[#171717] dark:hover:text-[#F4F6F5] hover:bg-[#F5F7F6] dark:hover:bg-[#171717] focus:outline-none focus:ring-2 focus:ring-[#A31C18] transition-colors"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-[#1FD88A]" />
            ) : theme === 'light' ? (
              <Sun className="w-4 h-4 text-[#F5B301]" />
            ) : (
              <Laptop className="w-4 h-4 text-[#15803D] dark:text-[#1FD88A]" />
            )}
          </button>

          {themeMenuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-[#171717] rounded-xl shadow-2xl border border-[#E2E8E4] dark:border-[#2A322D] py-1.5 z-50 text-xs">
              {[
                { key: 'dark', label: t('common.dark'), icon: Moon },
                { key: 'light', label: t('common.light'), icon: Sun },
                { key: 'system', label: t('common.system'), icon: Laptop },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setTheme(item.key);
                    setThemeMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3.5 py-2 hover:bg-[#F5F7F6] dark:hover:bg-[#06110C] transition-colors ${
                    theme === item.key
                      ? 'font-bold text-[#A31C18] dark:text-[#FF5A52]'
                      : 'text-[#171717] dark:text-[#F4F6F5]'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Pill with circular avatar */}
        {user && (
          <div className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8E4] dark:border-[#2A322D]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#A31C18] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#15803D]/40 dark:ring-[#1FD88A]/40 shadow-sm">
                {(user.displayName || user.email)?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-[#171717] dark:text-[#F4F6F5] leading-tight">
                  {user.displayName || user.email}
                </span>
                <span className="text-[10px] font-mono text-[#15803D] dark:text-[#1FD88A] leading-tight">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title={t('auth.logoutBtn')}
              aria-label="Logout"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#5E6A64] hover:text-[#DC2626] hover:bg-[#FBE9E8] dark:text-[#9AA6A0] dark:hover:text-[#FF5A52] dark:hover:bg-[#2A0F0E] transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
