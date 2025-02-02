"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;//ReactNode is a type in ReactJS that can represent a React element, a string, a number, or a boolean
  className?: string;
  appName: string;
}

export const Button = ({ className, appName, children }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
      {/* what can be chidren here */}
    </button>
  );
};
