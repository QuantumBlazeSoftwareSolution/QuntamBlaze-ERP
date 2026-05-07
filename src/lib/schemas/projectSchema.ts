import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  clientName: z.string().min(1, "Client is required"),
  projectType: z.enum(["Fixed Price", "Retainer", "T&M"]),
  startDate: z.string().min(1, "Start date is required"),
  deadline: z.string().min(1, "Deadline is required"),
  budget: z.number().min(0.01, "Budget must be greater than 0"),
  teamMembers: z.array(z.string()).min(1, "At least one team member is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
}).refine((data) => new Date(data.deadline) > new Date(data.startDate), {
  message: "Deadline must be after start date",
  path: ["deadline"],
});

export type ProjectFormData = z.infer<typeof projectSchema>;
