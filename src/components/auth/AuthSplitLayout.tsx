import React from 'react';
import { QBLogoMark } from './QBLogoMark';
import { CheckCircle2 } from 'lucide-react';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthSplitLayout = ({ children, title, subtitle }: AuthSplitLayoutProps) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface-white">
      {/* Left Panel (Dark) */}
      <div className="hidden lg:flex w-1/2 bg-sidebar-bg relative flex-col justify-between p-12 overflow-hidden">
        {/* Subtle diagonal geometric pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)`,
            backgroundSize: '20px 20px'
          }}
        />
        
        <div className="relative z-10">
          <QBLogoMark />
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-8">
            The Intelligence Layer for Your Business
          </h1>
          
          <ul className="space-y-4">
            {[
              "Unified ERP workflows and automation",
              "Real-time analytics and reporting",
              "Enterprise-grade security and compliance"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sidebar-text text-sm">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
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
