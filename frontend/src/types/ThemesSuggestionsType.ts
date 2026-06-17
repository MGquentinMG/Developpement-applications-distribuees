export interface ThemeSuggestionsProps {
  themes: string[];
  activeTheme: string | null;
  onThemeChange: (theme: string | null) => void;
}