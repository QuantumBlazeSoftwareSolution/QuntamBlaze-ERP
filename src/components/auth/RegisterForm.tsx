"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2, User, AlertCircle, Shield } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/app/actions/auth";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

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

const ROLES_LIST = [
  { id: "role-admin", name: "Admin", desc: "Full System Access", color: "#10B981" },
  { id: "role-manager", name: "Manager", desc: "Projects & Clients", color: "#3B82F6" },
  { id: "role-operator", name: "Operator", desc: "Operations & Updates", color: "#F59E0B" },
  { id: "role-viewer", name: "Viewer", desc: "Read-Only Viewer", color: "#8B5CF6" },
];

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("role-admin"); // Default to Admin as requested for dev
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await signUpAction({
        ...data,
        roleId: selectedRoleId,
      });

      if (response.success) {
        // Redirect to dashboard after successful registration
        router.push("/dashboard");
      } else {
        setErrorMessage(response.error || "Failed to create account");
        setIsSubmitting(false);
      }
    } catch (err) {
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
              <p className="font-semibold text-red-300">Registration Failed</p>
              <p className="text-xs text-red-400/90 mt-0.5">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Name */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={staggerVariants}>
        <label className="block text-text-primary text-sm font-medium mb-1.5">Full Name</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-text-muted" />
          </div>
          <input
            {...register("name")}
            type="text"
            className="w-full border border-border rounded-lg h-11 pl-10 pr-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-muted bg-white"
            placeholder="John Doe"
          />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
      </motion.div>

      {/* Email */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={staggerVariants}>
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

      {/* Password */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={staggerVariants}>
        <label className="block text-text-primary text-sm font-medium mb-1.5">Password</label>
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

      {/* Luxury Role Selector */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={staggerVariants} className="space-y-2">
        <label className="block text-text-primary text-sm font-medium flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-accent" />
          <span>System Role Assignment</span>
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {ROLES_LIST.map((role) => {
            const isSelected = selectedRoleId === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRoleId(role.id)}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-border bg-white hover:border-text-muted hover:bg-page-bg"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold text-text-primary">{role.name}</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                </div>
                <span className="text-[10px] text-text-secondary leading-tight line-clamp-1">
                  {role.desc}
                </span>

                {/* Elegant active backdrop */}
                {isSelected && (
                  <motion.div
                    layoutId="activeRoleBackdrop"
                    className="absolute inset-0 bg-accent/2 pointer-events-none z-[-1]"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Register Button */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={staggerVariants}>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg h-11 w-full flex items-center justify-center transition-colors mt-2"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </motion.div>

      <motion.div
        custom={5}
        initial="hidden"
        animate="visible"
        variants={staggerVariants}
        className="text-center mt-6"
      >
        <p className="text-text-secondary text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </form>
  );
};
