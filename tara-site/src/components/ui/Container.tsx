import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export function Container({
  as: Component = "div",
  className,
  children,
}: ContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12", className)}
    >
      {children}
    </Component>
  );
}
