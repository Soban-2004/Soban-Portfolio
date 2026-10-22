import { ViewTransition, type ReactNode } from "react";

const transitionClasses = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
};

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={transitionClasses} exit={transitionClasses} default="none">
      {children}
    </ViewTransition>
  );
}
