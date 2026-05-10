import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = ["Account Setup", "Confirm"];

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border -z-10" />
        
        {/* Animated Fill Line */}
        <motion.div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-accent -z-10 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentStep === 1 ? 0 : 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div key={step} className="flex flex-col items-center bg-surface-white px-2">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-300
                  ${isActive ? 'bg-accent text-white' : 
                    isCompleted ? 'bg-surface-white text-accent' : 
                    'bg-border text-text-muted'}`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5 text-accent" /> : stepNumber}
              </div>
              <span className={`text-[11px] mt-2 font-medium uppercase tracking-wider
                ${isActive || isCompleted ? 'text-text-primary' : 'text-text-muted'}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
