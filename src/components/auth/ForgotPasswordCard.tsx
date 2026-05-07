"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle2, User, Send, RefreshCcw, Loader2 } from "lucide-react";
import Link from "next/link";
import { Countdown } from "@/components/ui/Countdown";

const resetSchema = z.object({
  email: z.string().email("Invalid authorization email"),
});

type ResetFormInputs = z.infer<typeof resetSchema>;

type ViewState = "idle" | "sent";

export function ForgotPasswordCard() {
  const [viewState, setViewState] = useState<ViewState>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormInputs>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetFormInputs) => {
    setIsLoading(true);
    // Mock authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Generate a random 4 digit token for the mock
    // eslint-disable-next-line react-hooks/purity
    const randomToken = Math.floor(1000 + Math.random() * 9000);
    console.log(`[AUTH] Password reset requested for ${data.email} — Token: RST-2605-${randomToken}`);
    
    setSubmittedEmail(data.email);
    setViewState("sent");
    setCanResend(false); // Start countdown
    setIsLoading(false);
  };

  const handleReturnToStart = () => {
    setViewState("idle");
  };

  const handleResend = async () => {
    // Mock resend logic
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCanResend(false);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-[420px] bg-bg-surface border border-border rounded-xl p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
      {/* Subtle top inner glow matching the design */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <AnimatePresence mode="wait">
        {viewState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            {/* Back Link */}
            <Link 
              href="/login" 
              className="inline-flex items-center text-text-secondary hover:text-accent transition-colors duration-200 mb-8 font-mono text-xs uppercase"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>

            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center border border-accent/20 mr-4">
                <Mail className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-2xl font-medium text-text-primary">Reset your access</h2>
            </div>
            
            <p className="text-sm text-text-secondary mb-8">
              Enter the email address associated with your Operations Control account to receive a secure reset link.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5 group">
                <label htmlFor="email" className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase">
                  Authorization Email
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-secondary group-focus-within:text-accent transition-colors" />
                  <input
                    id="email"
                    type="email"
                    placeholder="operative@quantumblaze.co"
                    disabled={isLoading}
                    className="w-full bg-bg-card border-0 border-b border-border/50 focus:border-accent focus:ring-0 text-sm text-text-primary pl-10 pr-4 py-3 rounded-md placeholder:text-text-muted transition-all focus:shadow-[0_4px_12px_-4px_rgba(0,229,255,0.3)] disabled:opacity-50"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <span className="text-xs text-danger mt-1">{errors.email.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full group relative px-4 py-3 bg-transparent text-accent text-[11px] font-bold tracking-[0.1em] uppercase border border-accent rounded-md hover:bg-accent/10 transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 shadow-[0_0_12px_0_rgba(0,229,255,0.15)] hover:shadow-[0_0_16px_2px_rgba(0,229,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <Send className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          </motion.div>
        )}

        {viewState === "sent" && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center py-6"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center border border-accent/30 mb-6 shadow-[0_0_12px_0_rgba(0,229,255,0.15)]"
            >
              <CheckCircle2 className="w-8 h-8 text-success drop-shadow-[0_0_8px_rgba(0,200,150,0.4)]" />
            </motion.div>
            
            <h2 className="text-2xl font-medium text-text-primary mb-3">Transmission Sent</h2>
            
            <p className="text-sm text-text-secondary mb-4">
              We&apos;ve dispatched a secure reset link to:
            </p>
            <div className="mb-8">
               <code className="bg-accent/5 text-accent border border-accent/20 px-2 py-1 rounded text-sm font-mono tracking-wide">
                 {submittedEmail}
               </code>
            </div>

            <p className="text-sm text-text-secondary mb-8">
              Check your inbox — link expires in <Countdown seconds={900} className="ml-1 font-bold" />.
            </p>

            <div className="flex flex-col items-center gap-4">
               {canResend ? (
                 <button 
                   onClick={handleResend}
                   disabled={isLoading}
                   className="text-xs font-mono text-text-secondary hover:text-accent transition-colors underline flex items-center disabled:opacity-50"
                 >
                   {isLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                   Resend transmission
                 </button>
               ) : (
                 <span className="text-xs font-mono text-text-secondary flex items-center">
                   Resend available in <Countdown seconds={60} onComplete={() => setCanResend(true)} className="ml-1" />
                 </span>
               )}
              
               <button 
                 onClick={handleReturnToStart}
                 className="inline-flex items-center text-text-secondary hover:text-accent transition-colors duration-200 font-mono text-xs uppercase border-b border-transparent hover:border-accent pb-0.5 mt-2"
               >
                 <RefreshCcw className="w-4 h-4 mr-2" />
                 Return to Start
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
