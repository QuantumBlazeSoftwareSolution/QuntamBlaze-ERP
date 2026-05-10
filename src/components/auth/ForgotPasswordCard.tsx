"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Countdown } from '@/components/ui/Countdown';

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordCard = () => {
  const [state, setState] = useState<'idle' | 'sent'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    setIsSubmitting(true);
    try {
      // Mock 1s delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const token = Math.random().toString(36).slice(2, 6).toUpperCase();
      console.log(`[QB-AUTH] Reset token issued · RST-2605-${token} · ${new Date().toISOString()}`);
      
      setSubmittedEmail(data.email);
      setState('sent');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-white border border-border rounded-2xl shadow-sm p-10 w-full max-w-[440px] relative overflow-hidden">
      <AnimatePresence mode="wait">
        {state === 'idle' ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Link 
              href="/login" 
              className="absolute top-0 left-0 mt-8 ml-10 flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>

            <div className="flex flex-col items-center text-center mt-6">
              <div className="bg-accent-light rounded-full p-4 mb-6">
                <Mail className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-text-primary text-2xl font-bold mb-2">Reset your password</h1>
              <p className="text-text-secondary text-sm mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
                <div className="text-left">
                  <label className="block text-text-primary text-sm font-medium mb-1.5">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full border border-border rounded-lg h-11 px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-muted"
                    placeholder="name@company.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg h-11 w-full flex items-center justify-center transition-colors"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-accent-light rounded-full p-4 mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-accent" />
            </motion.div>

            <h1 className="text-text-primary text-2xl font-bold mb-2">Check your inbox</h1>
            <p className="text-text-secondary text-sm mb-6">
              We've sent a password reset link to <br/>
              <span className="font-mono bg-accent-light text-accent-text px-2 py-0.5 rounded text-sm inline-block mt-2">
                {submittedEmail}
              </span>
            </p>

            <div className="space-y-4 mb-8">
              <p className="text-text-muted text-xs">
                Link expires in <Countdown initialSeconds={900} />
              </p>
            </div>

            <div className="pt-6 border-t border-divider w-full">
              <p className="text-text-secondary text-sm">
                Didn't receive the email?{' '}
                <button 
                  onClick={() => setState('idle')}
                  className="text-accent hover:underline font-medium"
                >
                  Click to resend
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
