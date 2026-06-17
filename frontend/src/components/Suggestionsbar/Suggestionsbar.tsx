"use client";

import Button from "../Button/Button";
import { ThemeSuggestionsProps } from "@/src/types/ThemesSuggestionsType";

export default function ThemeSuggestions({ themes, activeTheme, onThemeChange }: ThemeSuggestionsProps) {
  return (
    <section className="mt-8 pl-4">
      <div className="flex gap-3 overflow-x-auto pr-4 pb-2 [&::-webkit-scrollbar]:hidden scrollbar-none">
        {themes.map((theme) => (
          <div key={theme} className="flex flex-col items-center gap-1 shrink-0">
            <Button 
              label={theme} 
              defaultActive={activeTheme === theme}
              onClick={() => onThemeChange(activeTheme === theme ? null : theme)}
            />
            {activeTheme === theme && (
              <div className="h-1 w-6 bg-[#492775] rounded-full animate-in fade-in zoom-in duration-300"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}