import { cn } from "@/lib/utils";
import React from "react";

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "border-4 border-transparent border-t-4 border-t-gray-600 rounded-full w-10 h-10 animate-spin",
        className
      )}
      aria-label="Loading"
      role="status"
    ></div>
  );
};

export default Spinner;
