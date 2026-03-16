import { Button } from '@/components/ui/button';
import { Languages, Moon, Sun } from 'lucide-react';
import { useUiPreferences } from '@/contexts/UiPreferencesContext';

interface ThemeLanguageSwitcherProps {
  compact?: boolean;
}

const ThemeLanguageSwitcher = ({ compact = false }: ThemeLanguageSwitcherProps) => {
  const { theme, language, toggleTheme, toggleLanguage } = useUiPreferences();

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size={compact ? 'sm' : 'default'}
        onClick={toggleTheme}
        className="gap-1.5"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size={compact ? 'sm' : 'default'}
        onClick={toggleLanguage}
        className="gap-1.5"
      >
        <Languages className="h-4 w-4" />
        <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
      </Button>
    </div>
  );
};

export default ThemeLanguageSwitcher;
