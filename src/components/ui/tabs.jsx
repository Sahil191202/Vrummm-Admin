import React, { createContext, useContext, useState } from 'react';
import { cn } from './button';

const TabsContext = createContext(null);

export function Tabs({ defaultValue, value, onValueChange, className, children, ...props }) {
  const [activeTab, setActiveTab] = useState(value || defaultValue);

  const currentTab = value !== undefined ? value : activeTab;
  const setTab = onValueChange || setActiveTab;

  return (
    <TabsContext.Provider value={{ currentTab, setTab }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children, ...props }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex min-h-[44px] items-center justify-start rounded-xl p-1',
        'bg-[#F5F7F6] border border-[#E2E8E4] text-[#5E6A64]',
        'dark:bg-[#06110C] dark:border-[#2A3630] dark:text-[#9AA6A0]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, ...props }) {
  const { currentTab, setTab } = useContext(TabsContext);
  const isActive = currentTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setTab(value)}
      className={cn(
        'inline-flex min-h-[38px] items-center justify-center rounded-lg px-4 py-1.5 text-xs font-semibold transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A31C18]',
        isActive
          ? 'bg-[#A31C18] text-white shadow-sm'
          : 'text-[#5E6A64] hover:text-[#171717] hover:bg-white/80 dark:text-[#9AA6A0] dark:hover:text-[#F4F6F5] dark:hover:bg-[#171717]/60',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, ...props }) {
  const { currentTab } = useContext(TabsContext);
  if (currentTab !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn('mt-4 focus-visible:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
}
