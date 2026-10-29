import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../../store/uiStore';
import { ToastProvider } from '../ui/toast';
import { AlertTriangle } from 'lucide-react';

export function AdminLayout() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const language = useUIStore((s) => s.language);
  const t = useUIStore((s) => s.t);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F5F7F6] text-[#171717] dark:bg-[#06110C] dark:text-[#F4F6F5] flex flex-col transition-colors">
        <Header />

        {/* Mandatory learning project banner */}
        {/* <div className="bg-[#FBE9E8] border-b border-[#DC2626]/30 text-[#DC2626] dark:bg-[#2A0F0E] dark:border-[#A31C18]/40 dark:text-[#FF5A52] px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 text-center sticky top-16 z-20 shadow-sm transition-colors">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            <strong>LEARNING PROJECT NOTICE:</strong> {t('learningDisclaimer')}
          </span>
        </div> */}

        <div className="flex-1 flex">
          <Sidebar />
          <main
            className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 overflow-x-hidden ${
              sidebarOpen ? 'ml-64' : 'ml-16'
            }`}
          >
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
