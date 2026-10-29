import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { Clock, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/card';

export function PlaceholderPage({ title, phase, requiredPermission, description }) {
  const user = useAuthStore((s) => s.user);
  const language = useUIStore((s) => s.language);
  const t = useUIStore((s) => s.t);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#E2E8E4] dark:border-[#2A322D]">
        <h1 className="text-2xl font-bold tracking-tight text-[#171717] dark:text-[#F4F6F5]">
          {title}
        </h1>
        <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0] mt-1">
          {description || 'Vrumm Internal Administration Tool'}
        </p>
      </div>

      <Card className="max-w-xl mx-auto p-8 text-center bg-white border-[#E2E8E4] dark:bg-[#171717] dark:border-[#2A322D]">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#F5F7F6] border border-[#E2E8E4] dark:bg-[#06110C] dark:border-[#2A322D] flex items-center justify-center text-[#15803D] dark:text-[#1FD88A] shadow-card-glow">
          <Clock className="w-6 h-6" />
        </div>

        <h2 className="text-lg font-bold text-[#171717] dark:text-[#F4F6F5] mb-1">
          Scheduled for {phase}
        </h2>

        <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0] mb-6">
          This section is scaffolded with route-level and permission-level guards.
        </p>

        <div className="bg-[#F5F7F6] border border-[#E2E8E4] dark:bg-[#0B1A13] dark:border-[#2A322D] rounded-xl p-3.5 text-xs text-left space-y-1.5 font-mono text-[#5E6A64] dark:text-[#9AA6A0]">
          <div>
            <span className="font-semibold text-[#5E6A64]/70 dark:text-[#9AA6A0]/70">Required Permission:</span>{' '}
            <span className="text-[#15803D] dark:text-[#1FD88A]">{requiredPermission}</span>
          </div>
          <div>
            <span className="font-semibold text-[#5E6A64]/70 dark:text-[#9AA6A0]/70">Your Current Role:</span>{' '}
            <span className="text-[#171717] dark:text-[#F4F6F5]">{user?.role}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#15803D] dark:text-[#1FD88A]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Route Guard Verified (Granted)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
