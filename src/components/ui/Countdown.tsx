"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownProps {
  seconds: number;
  onComplete?: () => void;
  className?: string;
}

export function Countdown({ seconds: initialSeconds, onComplete, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const isWarning = timeLeft <= 10 && timeLeft > 0;

  return (
    <span 
      className={cn(
        "font-mono transition-colors",
        isWarning ? "text-warning animate-pulse" : "text-accent",
        className
      )}
    >
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </span>
  );
}
