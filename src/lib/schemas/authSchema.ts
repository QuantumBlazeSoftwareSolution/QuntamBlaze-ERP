import { z } from 'zod';
import { UserRole } from '@/types/auth';

export const inviteSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email(),
  role: z.nativeEnum(UserRole, {
    message: "Please select a valid role"
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type InviteFormValues = z.infer<typeof inviteSchema>;
