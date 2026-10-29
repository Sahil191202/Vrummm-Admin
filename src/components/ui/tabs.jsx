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
        'inline-flex min-h-[44px] items-center justify-start rounded-xl p-1 bg-[#06110C] border border-[#2A3630] text-[#A3A3A3]',
        'light:bg-[#F3F4F6] light:border-[#E5E7EB] light:text-[#525252]',
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
          : 'text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#171717]/60 light:text-[#525252] light:hover:text-[#171717]',
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
