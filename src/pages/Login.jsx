import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { authService } from '../services/authService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

const SEEDED_ROLES = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', email: 'superadmin@vrumm.dev' },
  { role: 'OPERATIONS', label: 'Operations', email: 'ops@vrumm.dev' },
  { role: 'SUPPORT', label: 'Support', email: 'support@vrumm.dev' },
  { role: 'FINANCE', label: 'Finance', email: 'finance@vrumm.dev' },
  { role: 'MARKETING', label: 'Marketing', email: 'marketing@vrumm.dev' },
  { role: 'COMPLIANCE', label: 'Compliance', email: 'compliance@vrumm.dev' },
];

const DEFAULT_SEED_PASSWORD = 'Vrumm@Dev2026!';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const language = useUIStore((s) => s.language);
  const t = useUIStore((s) => s.t);
  const isMockApi = useUIStore((s) => s.isMockApi);
  const setMockApi = useUIStore((s) => s.setMockApi);

  const [email, setEmail] = useState('superadmin@vrumm.dev');
  const [password, setPassword] = useState(DEFAULT_SEED_PASSWORD);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSelectRole = (roleEmail) => {
    setEmail(roleEmail);
    setPassword(DEFAULT_SEED_PASSWORD);
    setErrorMessage('');
    setFieldErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = t('auth.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = t('auth.passwordRequired');
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // double-submit guard
    if (!validate()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await authService.login({
        email: email.trim(),
        password,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F6] text-[#171717] dark:bg-[#06110C] dark:text-[#F4F6F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 transition-colors">
      {/* Learning project disclaimer banner */}
      <div className="max-w-md mx-auto mb-6 w-full text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FBE9E8] border border-[#DC2626]/30 text-[#DC2626] dark:bg-[#171717] dark:border-[#A31C18]/40 dark:text-[#FF5A52] text-xs font-semibold shadow-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Vrumm Learning System (Mumbai, Maharashtra)</span>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-[#A31C18] flex items-center justify-center font-black text-white text-3xl shadow-button-glow glow-button">
            V
          </div>
        </div>
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-[#171717] dark:text-[#F4F6F5]">
          {t('auth.loginTitle')}
        </h2>
        <p className="mt-1 text-center text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-[#E2E8E4] dark:bg-[#171717] dark:border-[#2A322D] py-8 px-5 shadow-xl rounded-2xl sm:px-10">
          {/* Mock Adapter toggle notice */}
          <div className="mb-6 p-3 rounded-xl bg-[#F5F7F6] border border-[#E2E8E4] dark:bg-[#0B1A13] dark:border-[#2A322D] flex items-center justify-between">
            <div className="text-xs">
              <p className="font-semibold text-[#171717] dark:text-[#F4F6F5]">API Mode</p>
              <p className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">
                {isMockApi ? 'Mock Adapter (Offline)' : 'Backend API (port 4000)'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMockApi(!isMockApi)}
              className="min-h-[36px] flex items-center gap-1.5 text-xs text-[#171717] dark:text-[#F4F6F5] px-3 py-1.5 rounded-lg bg-white border border-[#E2E8E4] hover:bg-[#F5F7F6] dark:bg-[#171717] dark:border-[#2A322D] dark:hover:bg-[#06110C] transition-colors"
            >
              {isMockApi ? (
                <span className="text-[#B45309] dark:text-[#F5B301] font-bold flex items-center gap-1.5">
                  MOCK ON <ToggleRight className="w-4 h-4 text-[#B45309] dark:text-[#F5B301]" />
                </span>
              ) : (
                <span className="text-[#15803D] dark:text-[#1FD88A] font-bold flex items-center gap-1.5">
                  LIVE API <ToggleLeft className="w-4 h-4 text-[#15803D] dark:text-[#1FD88A]" />
                </span>
              )}
            </button>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-5 rounded-xl bg-[#FBE9E8] border border-[#DC2626]/30 dark:bg-[#2A0F0E] dark:border-[#FF5A52]/40 p-3.5 flex items-start gap-2.5 text-[#DC2626] dark:text-[#FF5A52] text-xs"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Authentication Error: </span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              name="email"
              type="email"
              label={t('auth.emailLabel')}
              autoComplete="email"
              value={email}
              icon={Mail}
              error={fieldErrors.email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vrumm.dev"
            />

            <Input
              id="password"
              name="password"
              type="password"
              label={t('auth.passwordLabel')}
              autoComplete="current-password"
              value={password}
              icon={Lock}
              error={fieldErrors.password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="default"
              isLoading={isSubmitting}
              className="w-full mt-2 font-bold text-white shadow-button-glow glow-button"
            >
              {!isSubmitting && (
                <>
                  <span>{t('auth.signInBtn')}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
              {isSubmitting && t('auth.signingInBtn')}
            </Button>
          </form>

          {/* Quick seeded role picker */}
          <div className="mt-6 pt-5 border-t border-[#E2E8E4] dark:border-[#2A322D]">
            <p className="text-[11px] font-semibold text-[#5E6A64] dark:text-[#9AA6A0] mb-2.5">
              {t('auth.demoLoginNotice')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SEEDED_ROLES.map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleSelectRole(r.email)}
                  className={`p-2 rounded-xl text-left text-xs transition-colors border min-h-[44px] ${
                    email === r.email
                      ? 'bg-[#FBE9E8] dark:bg-[#06110C] border-[#A31C18] text-[#171717] dark:text-[#F4F6F5] ring-1 ring-[#A31C18] shadow-button-glow'
                      : 'bg-[#F5F7F6] border-[#E2E8E4] text-[#5E6A64] hover:text-[#171717] hover:bg-white dark:bg-[#0B1A13] dark:border-[#2A322D] dark:text-[#9AA6A0] dark:hover:text-[#F4F6F5] dark:hover:bg-[#06110C]'
                  }`}
                >
                  <div className="font-bold leading-tight text-[#171717] dark:text-[#F4F6F5]">{r.label}</div>
                  <div className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0] truncate">{r.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
