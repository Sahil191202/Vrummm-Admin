import React from 'react';

/**
 * AvatarStack: Overlapping avatar circles with extra count badge
 * Inspired by Image 2 & 3
 */
export function AvatarStack({ users = [], extraCount = 0, size = 'sm' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-8 h-8 text-xs',
  }[size] || 'w-7 h-7 text-[10px]';

  return (
    <div className="flex items-center -space-x-2 overflow-hidden select-none">
      {users.map((user, idx) => (
        <div
          key={idx}
          title={user.name || `User ${idx + 1}`}
          className={`inline-flex items-center justify-center rounded-full font-bold uppercase border-2 border-[#171717] bg-[#2A0F0E] text-[#FF5A52] ${sizeClasses} shadow-sm`}
        >
          {user.initials || user.name?.[0] || 'U'}
        </div>
      ))}
      {extraCount > 0 && (
        <div
          className={`inline-flex items-center justify-center rounded-full font-bold border-2 border-[#171717] bg-[#2A322D] text-[#F4F6F5] ${sizeClasses}`}
          title={`${extraCount} more`}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
}
