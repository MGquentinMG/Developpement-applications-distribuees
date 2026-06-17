import { LucideIcon } from "lucide-react";

export interface PostActionProps {
  icon: LucideIcon;
  count: string;
  filled?: boolean;
  onClick?: () => void;
}