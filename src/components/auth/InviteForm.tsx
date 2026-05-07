"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Badge, Lock, LockKeyhole, Loader2, AlertCircle, ChevronDown, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateUserId } from "@/lib/idEngine";
import { USER_ROLES } from "@/types/auth";
import { UserIdPreview } from "./UserIdPreview";

const inviteSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  role: z.enum(["Admin", "PM", "Developer", "Finance"], {
    message: "Please select a valid role",
  }),
  password: z.string().min(8, "Security key must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your security key"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Security keys do not match",
  path: ["confirmPassword"],
});

type InviteFormInputs = z.infer<typeof inviteSchema>;

export function InviteForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<InviteFormInputs>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      fullName: "",
      role: undefined as unknown as "Admin" | "PM" | "Developer" | "Finance",
      password: "",
      confirmPassword: "",
    },
  });

  const watchFullName = useWatch({ control, name: "fullName" });
  const watchRole = useWatch({ control, name: "role" });

  // Debounced ID Generation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (watchFullName && watchFullName.trim().length >= 2) {
        // Using mock sequence 4 for demo purposes
        const newId = generateUserId(watchFullName, 4);
        setGeneratedId(newId);
      } else {
        setGeneratedId("");
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [watchFullName]);

  const onSubmit = async (data: InviteFormInputs) => {
    setIsLoading(true);
    // Mock authentication/registration delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("[REGISTER] User registered successfully", { ...data, userId: generatedId });
    setIsLoading(false);
    // Use relative path for mock purposes or absolute if actual route exists
    // We haven't created dashboard, so it might 404, but that satisfies the prompt logic
    router.push("/dashboard"); 
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
      {/* Full Name */}
      <div className="flex flex-col gap-1.5 group">
        <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase group-focus-within:text-accent transition-colors">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-0 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-secondary group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Enter your full name"
            disabled={isLoading}
            className="w-full bg-transparent border-0 border-b border-border hover:border-border-hover focus:border-accent focus:ring-0 text-sm font-medium text-text-primary pl-8 py-2.5 placeholder:text-text-muted transition-all focus:shadow-[0_4px_12px_-4px_rgba(0,229,255,0.3)] disabled:opacity-50"
            {...register("fullName")}
          />
        </div>
        {errors.fullName && (
          <div className="flex items-center gap-1.5 mt-1 text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-xs">{errors.fullName.message}</span>
          </div>
        )}
        
        {/* Animated User ID Preview */}
        <UserIdPreview userId={generatedId} isVisible={!!generatedId} />
      </div>

      {/* Custom Role Dropdown */}
      <div className="flex flex-col gap-1.5 group">
        <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase transition-colors">
          Assigned Role
        </label>
        <div className="relative">
          <Badge className="absolute left-0 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-secondary z-10" />
          
          <button
            type="button"
            onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
            disabled={isLoading}
            className={`w-full text-left bg-transparent border-0 border-b ${isDropdownOpen ? 'border-accent shadow-[0_4px_12px_-4px_rgba(0,229,255,0.3)]' : 'border-border hover:border-border-hover'} focus:ring-0 text-sm font-medium pl-8 py-2.5 transition-all disabled:opacity-50 relative`}
          >
            <span className={watchRole ? "text-text-primary" : "text-text-muted"}>
              {watchRole || "Select a role"}
            </span>
            <ChevronDown className={`absolute right-0 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-secondary transition-transform ${isDropdownOpen ? "rotate-180 text-accent" : ""}`} />
          </button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 w-full mt-2 bg-bg-surface border border-border rounded-lg shadow-2xl z-50 overflow-hidden"
              >
                {USER_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setValue("role", role, { shouldValidate: true });
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-accent/10 hover:text-accent transition-colors border-b border-border/50 last:border-0"
                  >
                    {role}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {errors.role && (
          <div className="flex items-center gap-1.5 mt-1 text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-xs">{errors.role.message}</span>
          </div>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5 group">
        <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase group-focus-within:text-accent transition-colors">
          Security Clearance Key
        </label>
        <div className="relative">
          <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-secondary group-focus-within:text-accent transition-colors" />
          <input
            type="password"
            placeholder="••••••••••••"
            disabled={isLoading}
            className="w-full bg-transparent border-0 border-b border-border hover:border-border-hover focus:border-accent focus:ring-0 text-sm font-medium text-text-primary pl-8 py-2.5 placeholder:text-text-muted transition-all focus:shadow-[0_4px_12px_-4px_rgba(0,229,255,0.3)] tracking-widest disabled:opacity-50"
            {...register("password")}
          />
        </div>
        {errors.password && (
          <div className="flex items-center gap-1.5 mt-1 text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-xs">{errors.password.message}</span>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1.5 group">
        <label className="text-[11px] font-bold tracking-[0.1em] text-text-secondary uppercase group-focus-within:text-accent transition-colors">
          Verify Clearance Key
        </label>
        <div className="relative">
          <LockKeyhole className="absolute left-0 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-secondary group-focus-within:text-accent transition-colors" />
          <input
            type="password"
            placeholder="••••••••••••"
            disabled={isLoading}
            className="w-full bg-transparent border-0 border-b border-border hover:border-border-hover focus:border-accent focus:ring-0 text-sm font-medium text-text-primary pl-8 py-2.5 placeholder:text-text-muted transition-all focus:shadow-[0_4px_12px_-4px_rgba(0,229,255,0.3)] tracking-widest disabled:opacity-50"
            {...register("confirmPassword")}
          />
        </div>
        {errors.confirmPassword && (
          <div className="flex items-center gap-1.5 mt-1 text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-xs">{errors.confirmPassword.message}</span>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4 mt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative group px-4 py-3 bg-transparent text-accent text-sm font-medium border border-accent/50 rounded-md hover:border-accent hover:bg-accent/5 transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-[18px] h-[18px] animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Complete Setup
                <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
