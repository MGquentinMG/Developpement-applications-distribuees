export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  variant?: "default" | "messages";
  placeholder?: string;
}