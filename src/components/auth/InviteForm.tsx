"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, ChevronDown, Check } from "lucide-react";
import { UserRole } from "@/types/auth";
import { inviteSchema, InviteFormValues } from "@/lib/schemas/authSchema";
import { useDebounce } from "@/hooks/useDebounce";
import { generateUserId } from "@/lib/idEngine";
import { StepIndicator } from "./StepIndicator";
import { UserIDPreview } from "./UserIDPreview";
import { useRouter } from "next/navigation";

const roleOptions = Object.values(UserRole);

export const InviteForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    control,
    trigger,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "jane.doe@example.com", // Pre-filled mock
      role: UserRole.Client, // Default
    },
  });

  const fullNameValue = watch("fullName");
  const debouncedFullName = useDebounce(fullNameValue, 600);

  useEffect(() => {
    if (debouncedFullName && debouncedFullName.trim().length >= 2) {
      setGeneratedId(generateUserId(debouncedFullName, 4)); // Mock seq 4
    } else {
      setGeneratedId(null);
    }
  }, [debouncedFullName]);

  const onNextStep = async () => {
    const isStep1Valid = await trigger();
    if (isStep1Valid) {
      setCurrentStep(2);
    }
  };

  const onSubmit = async (data: InviteFormValues) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(`[QB-AUTH] Invite accepted for ${data.email} as ${data.role}`);
      // Redirect to dashboard after successful onboarding
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formValues = watch();

  const stepVariants = {
    enter: { x: 24, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -24, opacity: 0 },
  };

  return (
    <div className="w-full">
      <StepIndicator currentStep={currentStep} />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Full Name */}
              <div>
                <label className="block text-text-primary text-sm font-medium mb-1.5">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  type="text"
                  className="w-full border border-border rounded-lg h-11 px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-muted bg-white"
                  placeholder="Jane Doe"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.fullName.message}</p>
                )}
                <UserIDPreview userId={generatedId} />
              </div>

              {/* Email (Pre-filled) */}
              <div>
                <label className="block text-text-primary text-sm font-medium mb-1.5">
                  Email (Invite Sent To)
                </label>
                <div className="relative">
                  <input
                    {...register("email")}
                    type="email"
                    readOnly
                    className="w-full border border-border rounded-lg h-11 pl-4 pr-10 text-sm text-text-muted bg-page-bg cursor-not-allowed focus:outline-none"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-text-muted" />
                  </div>
                </div>
              </div>

              {/* Custom Role Dropdown */}
              <div className="relative">
                <label className="block text-text-primary text-sm font-medium mb-1.5">
                  Assigned Role
                </label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div
                        className="w-full border border-border rounded-lg h-11 px-4 flex items-center justify-between cursor-pointer bg-white"
                        onClick={() => setIsRoleOpen(!isRoleOpen)}
                      >
                        <span className="text-sm text-text-primary">
                          {field.value || "Select Role"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-text-muted" />
                      </div>
                      <AnimatePresence>
                        {isRoleOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg py-1"
                          >
                            {roleOptions.map((role) => (
                              <div
                                key={role}
                                className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between
                                  ${field.value === role ? "bg-accent-light text-accent-text" : "text-text-primary hover:bg-accent-light hover:text-accent-text"}
                                `}
                                onClick={() => {
                                  field.onChange(role);
                                  setIsRoleOpen(false);
                                }}
                              >
                                <span>{role}</span>
                                {field.value === role && <Check className="w-4 h-4 text-accent" />}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                />
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.role.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-text-primary text-sm font-medium mb-1.5">
                  Set Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-border rounded-lg h-11 px-4 pr-10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-muted bg-white"
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
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-text-primary text-sm font-medium mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full border border-border rounded-lg h-11 px-4 pr-10 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all placeholder:text-text-muted bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="button"
                onClick={onNextStep}
                className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg h-11 w-full flex items-center justify-center transition-colors mt-6"
              >
                Continue Setup
              </button>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-page-bg border border-border rounded-xl p-6">
                <h3 className="text-text-primary font-semibold mb-4 border-b border-border pb-3">
                  Review Account Details
                </h3>

                <div className="space-y-4">
                  <div>
                    <span className="block text-text-muted text-xs uppercase tracking-wider mb-1">
                      Full Name
                    </span>
                    <span className="text-text-primary text-sm font-medium">
                      {formValues.fullName}
                    </span>
                  </div>

                  {generatedId && (
                    <div>
                      <span className="block text-text-muted text-xs uppercase tracking-wider mb-1">
                        Assigned ID
                      </span>
                      <span className="bg-accent-light border border-accent-border text-accent-text font-mono text-sm px-2 py-0.5 rounded inline-block">
                        {generatedId}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="block text-text-muted text-xs uppercase tracking-wider mb-1">
                      Email Address
                    </span>
                    <span className="text-text-primary text-sm">{formValues.email}</span>
                  </div>

                  <div>
                    <span className="block text-text-muted text-xs uppercase tracking-wider mb-1">
                      Role
                    </span>
                    <span className="text-text-primary text-sm">{formValues.role}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 border border-border text-text-secondary hover:text-text-primary hover:bg-page-bg font-semibold rounded-lg h-11 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg h-11 flex-1 flex items-center justify-center transition-colors"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Setup"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};
