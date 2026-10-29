import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function AccessDenied({
  title,
  message,
  requiredPermission,
  statusCode = 403,
  requestId,
}) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const language = useUIStore((s) => s.language);
  const t = useUIStore((s) => s.t);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-[#FBE9E8] text-[#DC2626] border border-[#DC2626]/30 dark:bg-[#2A0F0E] dark:text-[#FF5A52] dark:border-[#FF5A52]/30 flex items-center justify-center">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <Badge variant="danger" className="mb-3 font-mono">
        HTTP {statusCode} • FORBIDDEN
      </Badge>

      <h1 className="text-2xl font-bold text-[#171717] dark:text-[#F4F6F5] mb-2">
        {title || t('common.accessDenied')}
      </h1>

      <p className="text-[#5E6A64] dark:text-[#9AA6A0] max-w-md mb-4 text-xs leading-relaxed">
        {message || t('common.accessDeniedDesc')}
      </p>

      {requiredPermission && (
        <div className="bg-white border border-[#E2E8E4] dark:bg-[#171717] dark:border-[#2A322D] rounded-xl p-3.5 text-xs font-mono mb-6 text-[#5E6A64] dark:text-[#9AA6A0] text-left max-w-sm space-y-1">
          <div>
            <span className="font-semibold text-[#5E6A64]/70 dark:text-[#9AA6A0]/70">Required Permission:</span>{' '}
            <span className="text-[#DC2626] dark:text-[#FF5A52]">{requiredPermission}</span>
          </div>
          <div>
            <span className="font-semibold text-[#5E6A64]/70 dark:text-[#9AA6A0]/70">Your Role:</span>{' '}
            <span className="text-[#171717] dark:text-[#F4F6F5]">{user?.role || 'Unauthenticated'}</span>
          </div>
          {requestId && (
            <div>
              <span className="font-semibold text-[#5E6A64]/70 dark:text-[#9AA6A0]/70">Request ID:</span> {requestId}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="gap-2 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>

        <Link to="/">
          <Button variant="default" className="text-xs">
            Operations Overview
          </Button>
        </Link>
      </div>
    </div>
  );
}
