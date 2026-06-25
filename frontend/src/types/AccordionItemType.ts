import { ReactNode } from "react";

export interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  variant?: "settings" | "legal";
}