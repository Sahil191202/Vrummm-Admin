import { create } from 'zustand';
import { translations } from '../i18n/translations';

// Dark is the default look as specified in brand rules
const SAVED_THEME = (typeof window !== 'undefined' ? localStorage.getItem('vrumm_theme') : null) || 'dark';
const SAVED_LANG = (typeof window !== 'undefined' ? localStorage.getItem('vrumm_lang') : null) || 'en';

export function createTranslator(lang) {
  return (path) => {
    if (!path) return '';
    const keys = path.split('.');

    // Try selected language first
    let val = translations[lang];
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k];
      } else {
        val = null;
        break;
      }
    }

    if (val && typeof val === 'string') return val;

    // Fallback to English
    let fallbackVal = translations.en;
    for (const k of keys) {
      if (fallbackVal && typeof fallbackVal === 'object' && k in fallbackVal) {
        fallbackVal = fallbackVal[k];
      } else {
        return path;
      }
    }

    return typeof fallbackVal === 'string' ? fallbackVal : path;
  };
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useUIStore = create((set, get) => ({
  theme: SAVED_THEME,
  language: SAVED_LANG,
  sidebarOpen: true,
  isMockApi: false, // Live Backend API (:4000) permanently active
  t: createTranslator(SAVED_LANG),

  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vrumm_theme', theme);
    }
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      localStorage.setItem('vrumm_theme', newTheme);
    }
    applyTheme(newTheme);
    set({ theme: newTheme });
  },

  setLanguage: (language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vrumm_lang', language);
    }
    // Updating t with a fresh function reference ensures all components re-render immediately on click
    set({
      language,
      t: createTranslator(language),
    });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (isOpen) => {
    set({ sidebarOpen: isOpen });
  },

  setMockApi: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vrumm_use_mock');
    }
    set({ isMockApi: false });
  },
}));

// Helper hook for full reactivity
export function useTranslation() {
  const language = useUIStore((s) => s.language);
  const t = useUIStore((s) => s.t);
  return { t, language };
}

// Initial theme setup on load (Dark as default)
if (typeof window !== 'undefined') {
  applyTheme(SAVED_THEME);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useUIStore.getState().theme === 'system') {
      applyTheme('system');
    }
  });
}
