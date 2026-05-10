# Quantum Blaze ERP - Project Instructions

This project is a comprehensive ERP system built with Next.js 14 App Router, Tailwind CSS, and Framer Motion.

## Design System
- **Hybrid Theme**: 
    - Sidebar: Dark (`#0F0F0F`)
    - Main Content: Light (`#F8FAFC`)
    - Accent: Teal/Green (`#10B981`)
- **Typography**: 'Inter' for UI, 'JetBrains Mono' for IDs.

## Core Components
- `IDChip`: Renders Quantum Blaze IDs with copy-on-click.
- `StatusChip`: Color-coded status pills.
- `idEngine`: Central logic for ID generation.

## Implementation Rules
- Use `lucide-react` for icons.
- Use `framer-motion` for animations.
- Use `react-hook-form` + `zod` for forms.
- Follow the ID Engine patterns strictly.
- All colors must be referenced from `src/lib/theme.ts` (to be created).

## DB Changes
- If you do any DB changes, Please do not try to run drizzle-kit commands, instead notify me at the end of the your response to do that manually.
