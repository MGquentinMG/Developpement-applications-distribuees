import Button from "../Button/Button";
import { ThemeSuggestionsProps } from "@/src/types/ThemesSuggestions";

export default function ThemeSuggestions({ themes }: ThemeSuggestionsProps) {
  return (
    <section className="mt-8 pl-4">
      <div className="flex gap-3 overflow-x-auto pr-4 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        {themes.map((theme, index) => (
          <div key={theme} className="shrink-0">
            <Button label={theme} defaultActive={index === 1} />
          </div>
        ))}
      </div>
    </section>
  );
}