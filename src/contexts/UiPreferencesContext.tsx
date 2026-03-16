import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

type ThemeMode = 'light' | 'dark';
type Language = 'ar' | 'en';

interface UiPreferencesContextType {
  theme: ThemeMode;
  language: Language;
  isArabic: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const UiPreferencesContext = createContext<UiPreferencesContextType | undefined>(undefined);

const THEME_KEY = 'ui-theme';
const LANG_KEY = 'ui-language';

const UI_PAGES = new Set([
  '/',
  '/login',
  '/register',
  '/register/buyer',
  '/register/seller',
]);

export function UiPreferencesProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isUiPage = UI_PAGES.has(location.pathname);

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === 'en' || saved === 'ar' ? saved : 'ar';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isUiPage) {
      root.classList.toggle('dark', theme === 'dark');
      root.setAttribute('data-theme', theme);
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, isUiPage]);

  useEffect(() => {
    const root = document.documentElement;
    if (isUiPage) {
      root.lang = language;
      root.dir = language === 'ar' ? 'rtl' : 'ltr';
    } else {
      root.lang = 'ar';
      root.dir = 'rtl';
    }
    localStorage.setItem(LANG_KEY, language);
  }, [language, isUiPage]);

  const value = useMemo(
    () => ({
      theme,
      language,
      isArabic: language === 'ar',
      setTheme: setThemeState,
      toggleTheme: () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light')),
      setLanguage: setLanguageState,
      toggleLanguage: () => setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar')),
    }),
    [theme, language],
  );

  return <UiPreferencesContext.Provider value={value}>{children}</UiPreferencesContext.Provider>;
}

export function useUiPreferences() {
  const context = useContext(UiPreferencesContext);
  if (!context) {
    throw new Error('useUiPreferences must be used within UiPreferencesProvider');
  }
  return context;
}
