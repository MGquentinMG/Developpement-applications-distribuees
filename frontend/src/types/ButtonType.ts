export interface ButtonProps {
  label: string;
  defaultActive?: boolean;
  isHashtag?: boolean;
  variant?: "theme" | "action";
  onClick?: () => void;
}