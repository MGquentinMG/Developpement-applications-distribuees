import { ElementType, MouseEvent } from "react";

export interface PostActionProps {
  icon: ElementType;
  count: string | number;
  filled?: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}