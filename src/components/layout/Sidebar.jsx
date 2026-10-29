import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Activity,
  MapPin,
  FileCheck2,
  Sliders,
  TrendingUp,
  TicketPercent,
  Award,
  CreditCard,
  ShieldAlert,
  ClipboardList,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { PERMISSIONS } from '../../contracts/rbac';

export function Sidebar() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const language = useUIStore((s) => s.language);
  const permissions = useAuthStore((s) => s.permissions);
  const t = useUIStore((s) => s.t);

  const hasPerm = (perm) => {
    if (!permissions || !Array.isArray(permissions)) return false;
    return permissions.includes(perm);
  };

  const navSections = [
    {
      title: 'OPERATIONS',
      items: [
        {
          to: '/',
          label: t('nav.dashboard'),
          icon: Activity,
          permission: PERMISSIONS.RIDES_READ,
        },
        {
          to: '/bookings',
          label: t('nav.bookings'),
          icon: MapPin,
          permission: PERMISSIONS.RIDES_READ,
        },
        {
          to: '/documents',
          label: t('nav.documents'),
          icon: FileCheck2,
          permission: PERMISSIONS.DOCUMENTS_REVIEW,
        },
        {
          to: '/incidents',
          label: t('nav.incidents'),
          icon: ShieldAlert,
          permission: PERMISSIONS.INCIDENTS_READ,
        },
      ],
    },
    {
      title: 'TARIFF & REVENUE',
      items: [
        {
          to: '/fares',
          label: t('nav.fares'),
          icon: Sliders,
          permission: PERMISSIONS.FARES_READ,
        },
        {
          to: '/revenue',
          label: t('nav.revenue'),
          icon: TrendingUp,
          permission: PERMISSIONS.REVENUE_PLANS_READ,
        },
        {
          to: '/promotions',
          label: t('nav.promotions'),
          icon: TicketPercent,
          permission: PERMISSIONS.PROMOTIONS_READ,
        },
        {
          to: '/incentives',
          label: t('nav.incentives'),
          icon: Award,
          permission: PERMISSIONS.PROMOTIONS_READ,
        },
        {
          to: '/payments',
          label: t('nav.payments'),
          icon: CreditCard,
          permission: PERMISSIONS.PAYMENTS_READ,
        },
      ],
    },
    {
      title: 'SYSTEM & AUDIT',
      items: [
        {
          to: '/audit',
          label: t('nav.analytics'),
          icon: ClipboardList,
          permission: PERMISSIONS.AUDIT_READ,
        },
        {
          to: '/settings',
          label: t('nav.settings'),
          icon: Settings,
          permission: PERMISSIONS.SETTINGS_READ,
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 pt-16 flex flex-col bg-[#171717] dark:bg-[#0B1A13] text-[#9AA6A0] border-r border-[#E2E8E4] dark:border-[#2A322D] transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex-1 overflow-y-auto py-4 px-2.5 space-y-5">
        {navSections.map((section, sIdx) => {
          const visibleItems = section.items.filter((item) => hasPerm(item.permission));
          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx} className="space-y-1">
              {sidebarOpen && (
                <p className="px-3 text-[10px] font-bold tracking-wider text-[#9AA6A0]/70 uppercase mb-1">
                  {section.title}
                </p>
              )}
              {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    title={!sidebarOpen ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#A31C18] text-white shadow-button-glow glow-button'
                          : 'text-[#9AA6A0] hover:text-[#F4F6F5] hover:bg-black/40'
                      } ${!sidebarOpen ? 'justify-center' : ''}`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </div>

      {sidebarOpen && (
        <div className="p-4 border-t border-white/10 dark:border-[#2A322D] text-[11px] text-[#9AA6A0] leading-relaxed">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#1FD88A] animate-pulse" />
            <p className="font-bold text-[#F4F6F5]">Mumbai Ops Node</p>
          </div>
          <p className="text-[10px]">Learning Project • Rapido inspired</p>
        </div>
      )}
    </aside>
  );
}
