import React from "react";
import { QBLogoMark } from "./QBLogoMark";
import { CheckCircle2 } from "lucide-react";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  leftContent?: React.ReactNode;
}

export const AuthSplitLayout = ({
  children,
  title,
  subtitle,
  leftContent,
}: AuthSplitLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface-white">
      {/* Left Panel (Dark) */}
      <div className="hidden lg:flex w-1/2 bg-sidebar-bg relative flex-col justify-between p-12 overflow-hidden">
        {/* Luxury Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85 pointer-events-none transition-opacity duration-1000"
          style={{
            backgroundImage: "url('/login_banner.png')",
          }}
        />

        {/* Dynamic ambient glow overlay to elevate the modern tech aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sidebar-bg/95 via-sidebar-bg/40 to-transparent pointer-events-none z-0" />

        {/* Elegant horizontal gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent pointer-events-none z-0" />

        {/* Subtle diagonal geometric pattern overlay for extra technical depth */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none z-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)`,
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative z-10">
          <QBLogoMark />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-center">
          {leftContent || (
            <div className="max-w-md">
              <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-8">
                The Intelligence Layer for Your Business
              </h1>

              <ul className="space-y-4">
                {[
                  "Unified ERP workflows and automation",
                  "Real-time analytics and reporting",
                  "Enterprise-grade security and compliance",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sidebar-text text-sm">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel (Light) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-surface-white">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h2 className="text-text-primary text-2xl font-bold mb-2">{title}</h2>
            <p className="text-text-secondary text-sm">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
