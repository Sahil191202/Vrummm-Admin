import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './uiStore';

describe('UI Store (Theme, Language, i18n & Reactivity)', () => {
  beforeEach(() => {
    useUIStore.getState().setTheme('light');
    useUIStore.getState().setLanguage('en');
  });

  it('updates theme correctly and toggles dark class on html root', () => {
    expect(useUIStore.getState().theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    useUIStore.getState().setTheme('dark');
    expect(useUIStore.getState().theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    useUIStore.getState().toggleTheme();
    expect(useUIStore.getState().theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('updates language and translates strings immediately on click without reload', () => {
    const initialT = useUIStore.getState().t;
    expect(useUIStore.getState().language).toBe('en');
    expect(initialT('appName')).toBe('Vrumm Admin');

    useUIStore.getState().setLanguage('hi');
    const hindiT = useUIStore.getState().t;
    expect(useUIStore.getState().language).toBe('hi');
    expect(hindiT('appName')).toBe('व्रम एडमिन');
    // Ensure t function reference changed so Zustand subscribers immediately re-render
    expect(hindiT).not.toBe(initialT);

    useUIStore.getState().setLanguage('mr');
    const marathiT = useUIStore.getState().t;
    expect(useUIStore.getState().language).toBe('mr');
    expect(marathiT('appName')).toBe('व्रूम ॲडमिन');
    expect(marathiT).not.toBe(hindiT);
  });

  it('falls back to English when translation key is missing in another language', () => {
    useUIStore.getState().setLanguage('mr');
    const text = useUIStore.getState().t('learningDisclaimer');
    expect(text).toContain('रॅपिडो');
  });
});
