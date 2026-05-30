"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Key,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Countdown } from "@/components/ui/Countdown";
import { requestPasswordResetAction, verifyOtpAndResetPasswordAction } from "@/app/actions/auth";

const requestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    otp: z.string().min(6, "OTP code must be 6 digits").max(6, "OTP code must be 6 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RequestValues = z.infer<typeof requestSchema>;
type ResetValues = z.infer<typeof resetSchema>;

// Inner component to handle Search Params with Suspense
const ForgotPasswordContent = () => {
  const [state, setState] = useState<"idle" | "sent" | "success">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successRedirectTimer, setSuccessRedirectTimer] = useState(5);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Step 1 Form
  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: requestErrors },
    setValue: setRequestValue,
  } = useForm<RequestValues>({
    resolver: zodResolver(requestSchema),
  });

  // Step 2 Form
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
    setValue: setResetValue,
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
  });

  // Check URL parameters for pre-filling simulated email clicks
  useEffect(() => {
    const email = searchParams.get("email");
    const otp = searchParams.get("otp");

    if (email) {
      setSubmittedEmail(email);
      setResetValue("email", email);
      setRequestValue("email", email);
      if (otp) {
        setResetValue("otp", otp);
        setState("sent");
      }
    }
  }, [searchParams, setResetValue, setRequestValue]);

  // Handle countdown redirect on success
  useEffect(() => {
    if (state === "success") {
      const interval = setInterval(() => {
        setSuccessRedirectTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            router.push("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state, router]);

  // Submit Step 1: Send OTP
  const onSubmitRequest = async (data: RequestValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await requestPasswordResetAction(data);
      if (response.success) {
        setSubmittedEmail(data.email);
        setResetValue("email", data.email);
        setState("sent");
      } else {
        setErrorMessage(response.error || "Failed to issue verification code");
      }
    } catch (err) {
      setErrorMessage("System error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Step 2: Verify OTP and reset password
  const onSubmitReset = async (data: ResetValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await verifyOtpAndResetPasswordAction(data);
      if (response.success) {
        setState("success");
      } else {
        setErrorMessage(response.error || "OTP verification failed");
      }
    } catch (err) {
      setErrorMessage("System error occurred. Please verify details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-white border border-border rounded-2xl shadow-sm p-10 w-full max-w-[440px] relative overflow-hidden">
      {/* Error Alert Box */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-3.5 flex items-start gap-3 text-red-400 text-sm overflow-hidden mb-6"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Security Exception</p>
              <p className="text-xs text-red-400/90 mt-0.5">{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {state === "idle" ? (
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
              <h1 className="text-text-primary text-2xl font-bold mb-2">Reset password</h1>
              <p className="text-text-secondary text-sm mb-8 font-sans">
                Enter your email address and we'll send a secure OTP verification code to reset your
                password.
              </p>

              <form onSubmit={handleSubmitRequest(onSubmitRequest)} className="w-full space-y-5">
                <div className="text-left">
                  <label className="block text-text-primary text-sm font-medium mb-1.5">
                    Email Address
                  </label>
                  <input
                    {...registerRequest("email")}
                    type="email"
                    className="w-full border border-border rounded-lg h-11 px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-muted"
                    placeholder="name@company.com"
                  />
                  {requestErrors.email && (
                    <p className="text-red-500 text-xs mt-1.5">{requestErrors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg h-11 w-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Send Verification Code"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        ) : state === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={() => {
                setErrorMessage(null);
                setState("idle");
              }}
              className="absolute top-0 left-0 mt-8 ml-10 flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors bg-transparent border-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Change Email</span>
            </button>

            <div className="flex flex-col items-center text-center mt-6">
              <div className="bg-accent-light rounded-full p-4 mb-6">
                <Key className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-text-primary text-2xl font-bold mb-2">Verify Security Code</h1>
              <p className="text-text-secondary text-sm mb-6">
                We've sent a 6-digit OTP code to <br />
                <span className="font-mono bg-accent-light text-accent-text px-2.5 py-0.5 rounded text-sm inline-block mt-2">
                  {submittedEmail}
                </span>
              </p>

              <form
                onSubmit={handleSubmitReset(onSubmitReset)}
                className="w-full space-y-4 text-left"
              >
                {/* Email (Hidden, but in DOM for react-hook-form schema compatibility) */}
                <input type="hidden" {...registerReset("email")} />

                {/* OTP Code */}
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-1.5">
                    6-Digit OTP Code
                  </label>
                  <input
                    {...registerReset("otp")}
                    type="text"
                    maxLength={6}
                    className="w-full border border-border rounded-lg h-11 px-4 text-center font-mono text-lg tracking-[0.3em] text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-muted"
                    placeholder="000000"
                  />
                  {resetErrors.otp && (
                    <p className="text-red-500 text-xs mt-1.5">{resetErrors.otp.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 h-4 text-text-muted" />
                    </div>
                    <input
                      {...registerReset("password")}
                      type={showPassword ? "text" : "password"}
                      className="w-full border border-border rounded-lg h-11 pl-10 pr-10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-muted bg-white"
                      placeholder="Min 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {resetErrors.password && (
                    <p className="text-red-500 text-xs mt-1.5">{resetErrors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 h-4 text-text-muted" />
                    </div>
                    <input
                      {...registerReset("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      className="w-full border border-border rounded-lg h-11 pl-10 pr-10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-muted bg-white"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {resetErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {resetErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg h-11 w-full flex items-center justify-center transition-colors cursor-pointer mt-4"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
                </button>
              </form>

              <div className="pt-6 mt-6 border-t border-divider w-full space-y-4">
                <p className="text-text-muted text-xs">
                  OTP Code expires in <Countdown initialSeconds={900} />
                </p>
                <p className="text-text-secondary text-sm">
                  Didn't receive the email?{" "}
                  <button
                    onClick={handleSubmitRequest(onSubmitRequest)}
                    className="text-accent hover:underline font-medium bg-transparent border-0 cursor-pointer"
                  >
                    Click to resend
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex flex-col items-center text-center"
          >
            <div className="bg-accent-light rounded-full p-4 mb-6">
              <CheckCircle2 className="w-12 h-12 text-accent" />
            </div>

            <h1 className="text-text-primary text-2xl font-bold mb-2">Password Updated</h1>
            <p className="text-text-secondary text-sm mb-6">
              Your security password was changed successfully. Your session key has been updated.
            </p>

            <div className="bg-accent-light/50 px-4 py-3 rounded-lg border border-accent/20 w-full mb-6">
              <p className="text-text-primary text-xs font-mono font-semibold">
                Redirecting to secure login in {successRedirectTimer} seconds...
              </p>
            </div>

            <Link
              href="/login"
              className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg h-11 w-full flex items-center justify-center transition-colors"
            >
              Sign In Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ForgotPasswordCard = () => {
  return (
    <Suspense
      fallback={
        <div className="bg-surface-white border border-border rounded-2xl shadow-sm p-10 w-full max-w-[440px] flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
};
