import React from 'react';

export function Table({ children, className = '' }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={`w-full text-left text-xs text-[#171717] dark:text-[#F4F6F5] ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="border-b border-[#E2E8E4] dark:border-[#2A322D] text-[11px] uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0] font-semibold bg-[#F5F7F6] dark:bg-[#0B1A13]/50">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-[#E2E8E4]/80 dark:divide-[#2A322D]/60">{children}</tbody>;
}

export function TableRow({ children, className = '', onClick }) {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors hover:bg-[#F5F7F6] dark:hover:bg-[#0B1A13]/80 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }) {
  return <th className={`py-3.5 px-4 font-semibold ${className}`}>{children}</th>;
}

export function TableCell({ children, className = '' }) {
  return <td className={`py-3.5 px-4 align-middle ${className}`}>{children}</td>;
}
