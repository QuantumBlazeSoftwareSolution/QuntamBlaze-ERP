"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";

type LoginFormInputs = {
  email: string;
  password: string;
};

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    // Mock authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Log the requested message
    console.log(`[AUTH] Session opened for ${data.email} at 2026-05-07T10:00:00Z`);
    
    setIsLoading(false);
    // Redirect logic would go here (e.g., router.push('/dashboard'))
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
      {/* Email Field */}
      <div className="flex flex-col gap-1.5 group">
        <label
          htmlFor="email"
          className="text-[11px] font-bold tracking-[0.1em] text-text-secondary group-focus-within:text-accent transition-colors uppercase"
        >
          Identification (Email)
        </label>
        <div className="relative">
          <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-secondary group-focus-within:text-accent transition-colors" />
          <input
            id="email"
            type="email"
            placeholder="operator@quantumblaze.net"
            disabled={isLoading}
            className="w-full bg-transparent border-0 border-b border-border hover:border-border-hover focus:border-accent focus:ring-0 text-sm font-medium text-text-primary pl-8 py-2.5 placeholder:text-text-muted transition-all focus:shadow-[0_4px_12px_-4px_rgba(0,229,255,0.3)] disabled:opacity-50"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email format",
              },
            })}
          />
        </div>
        {errors.email && (
          <div className="flex items-center gap-1.5 mt-1 text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-xs">{errors.email.message}</span>
          </div>
        )}
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-1.5 group mt-2">
        <div className="flex justify-between items-center">
          <label
            htmlFor="password"
            className="text-[11px] font-bold tracking-[0.1em] text-text-secondary group-focus-within:text-accent transition-colors uppercase"
          >
            Security Key
          </label>
          <a
            href="#"
            className="text-[11px] font-bold tracking-[0.1em] text-text-secondary hover:text-accent hover:underline transition-colors uppercase"
          >
            Forgot Key?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-secondary group-focus-within:text-accent transition-colors" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            disabled={isLoading}
            className="w-full bg-transparent border-0 border-b border-border hover:border-border-hover focus:border-accent focus:ring-0 text-sm font-medium text-text-primary pl-8 pr-8 py-2.5 placeholder:text-text-muted transition-all focus:shadow-[0_4px_12px_-4px_rgba(0,229,255,0.3)] tracking-widest disabled:opacity-50"
            {...register("password", {
              required: "Security key is required",
              minLength: {
                value: 8,
                message: "Key must be at least 8 characters",
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-text-secondary hover:text-accent transition-colors disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="w-[18px] h-[18px]" />
            ) : (
              <Eye className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>
        {errors.password && (
          <div className="flex items-center gap-1.5 mt-1 text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-xs">{errors.password.message}</span>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.01, filter: "brightness(110%)" }}
        whileTap={{ scale: 0.98 }}
        className="mt-8 w-full py-3.5 rounded-lg border border-accent/50 text-bg-primary font-bold text-[11px] tracking-[0.15em] uppercase bg-accent shadow-[0_0_16px_rgba(0,229,255,0.15)] transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-[16px] h-[16px] animate-spin" />
            AUTHENTICATING...
          </>
        ) : (
          <>
            AUTHENTICATE
            <ArrowRight className="w-[16px] h-[16px] group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </motion.button>
      
      {/* Secondary Actions */}
      <div className="mt-6 text-center">
        <a 
          href="#" 
          className="text-sm text-text-secondary hover:text-accent transition-colors flex items-center justify-center gap-1.5"
        >
          New Operator? <span className="text-accent border-b border-accent/30 pb-[1px] hover:border-accent">Accept Protocol Invite</span>
        </a>
      </div>
    </form>
  );
}
