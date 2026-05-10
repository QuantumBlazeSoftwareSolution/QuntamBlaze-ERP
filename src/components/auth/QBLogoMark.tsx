import React from "react";

export const QBLogoMark = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg">
        QB
      </div>
      <span className="font-bold text-white text-xl tracking-tight">Quantum Blaze</span>
    </div>
  );
};
