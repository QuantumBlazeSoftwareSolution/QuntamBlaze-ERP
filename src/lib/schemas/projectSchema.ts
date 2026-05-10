import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  clientId: z.string().min(1, "Please select a client"),
  type: z.enum(["Fixed Price", "Retainer", "T&M"]),
  startDate: z.string().min(1, "Start date is required"),
  deadline: z.string().min(1, "Deadline is required"),
  budget: z.coerce.number().min(0, "Budget cannot be negative"),
  teamMembers: z.array(z.string()).min(1, "Assign at least one team member"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
