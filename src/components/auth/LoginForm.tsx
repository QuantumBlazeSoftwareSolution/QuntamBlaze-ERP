"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInAction } from "@/app/actions/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const staggerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await signInAction(data);
      if (response.success) {
        // Redirect to dashboard after successful login
        router.push("/dashboard");
      } else {
        setErrorMessage(response.error || "Invalid email or password");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage("A network or system error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      {/* Error Alert Box */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-3.5 flex items-start gap-3 text-red-400 text-sm overflow-hidden"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Access Denied</p>
              <p className="text-xs text-red-400/90 mt-0.5">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div custom={0} initial="hidden" animate="visible" variants={staggerVariants}>
        <label className="block text-text-primary text-sm font-medium mb-1.5">Email</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-text-muted" />
          </div>
          <input
            {...register("email")}
            type="email"
            className="w-full border border-border rounded-lg h-11 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-muted bg-white"
            placeholder="name@company.com"
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
      </motion.div>

      <motion.div custom={1} initial="hidden" animate="visible" variants={staggerVariants}>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-text-primary text-sm font-medium">Password</label>
          <Link href="/forgot-password" className="text-accent text-sm hover:underline">
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-text-muted" />
          </div>
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            className="w-full border border-border rounded-lg h-11 pl-10 pr-10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-muted bg-white"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
        )}
      </motion.div>

      <motion.div custom={2} initial="hidden" animate="visible" variants={staggerVariants}>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg h-11 w-full flex items-center justify-center transition-colors mt-2"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Authenticating...</span>
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </motion.div>

      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={staggerVariants}
        className="text-center mt-6"
      >
        <p className="text-text-secondary text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-accent hover:underline font-medium">
            Sign up
          </Link>
        </p>
        <p className="text-text-secondary text-sm mt-2">
          Have an invite?{" "}
          <Link href="/invite/demo-token-001" className="text-accent hover:underline font-medium">
            Accept Invite
          </Link>
        </p>
      </motion.div>
    </form>
  );
};
