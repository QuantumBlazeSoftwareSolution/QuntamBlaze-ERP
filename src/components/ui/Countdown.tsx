"use client";

import React, { useState, useEffect } from "react";

interface CountdownProps {
  initialSeconds: number;
  onComplete?: () => void;
}

export const Countdown = ({ initialSeconds, onComplete }: CountdownProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onComplete]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Turn amber/warning color when less than 60 seconds remain
  const isNearZero = seconds < 60;

  return (
    <span
      className={`font-mono font-medium ${isNearZero ? "text-warning" : "text-text-secondary"}`}
    >
      {formatTime(seconds)}
    </span>
  );
};
