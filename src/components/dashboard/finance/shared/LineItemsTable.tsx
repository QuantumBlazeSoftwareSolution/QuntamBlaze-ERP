"use client";

import { useFieldArray, Control, UseFormRegister, UseFormWatch, FieldValues, Path, ArrayPath } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LineItemsTableProps<T extends FieldValues> {
  control: Control<T>;
  register: UseFormRegister<T>;
  watch: UseFormWatch<T>;
  showHoursColumn?: boolean;
}

export function LineItemsTable<T extends FieldValues>({ control, register, watch, showHoursColumn = false }: LineItemsTableProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems" as ArrayPath<T>,
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">
        <div className={cn(showHoursColumn ? "col-span-4" : "col-span-5")}>Description</div>
        {showHoursColumn && <div className="col-span-2 text-center">Hrs/Qty</div>}
        {!showHoursColumn && <div className="col-span-1 text-center">Qty</div>}
        <div className="col-span-2 text-right">Rate</div>
        <div className="col-span-2 text-center">Tax %</div>
        <div className="col-span-2 text-right">Amount</div>
      </div>

      <AnimatePresence mode="popLayout">
        {fields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 20 }}
            className="grid grid-cols-12 gap-4 items-center bg-bg-card/50 border border-border p-4 rounded-xl group relative"
          >
            <div className={cn(showHoursColumn ? "col-span-4" : "col-span-5")}>
              <input 
                {...register(`lineItems.${index}.description` as Path<T>)}
                placeholder="Service description..."
                className="w-full bg-transparent border-none text-[14px] text-text-primary focus:outline-none placeholder:text-text-muted/50"
              />
            </div>
            {showHoursColumn ? (
              <div className="col-span-2">
                <input 
                  type="number"
                  {...register(`lineItems.${index}.hours` as Path<T>, { valueAsNumber: true })}
                  className="w-full bg-transparent border-none text-[14px] text-text-primary text-center focus:outline-none"
                />
              </div>
            ) : (
              <div className="col-span-1">
                <input 
                  type="number"
                  {...register(`lineItems.${index}.qty` as Path<T>, { valueAsNumber: true })}
                  className="w-full bg-transparent border-none text-[14px] text-text-primary text-center focus:outline-none"
                />
              </div>
            )}
            <div className="col-span-2">
              <input 
                type="number"
                {...register(`lineItems.${index}.rate` as Path<T>, { valueAsNumber: true })}
                className="w-full bg-transparent border-none text-[14px] text-text-primary text-right focus:outline-none font-mono"
              />
            </div>
            <div className="col-span-2 text-center">
              <select 
                {...register(`lineItems.${index}.taxPercent` as Path<T>, { valueAsNumber: true })}
                className="bg-transparent border-none text-[14px] text-text-primary focus:outline-none cursor-pointer"
              >
                {[0, 5, 10, 15, 20].map(val => (
                  <option key={val} value={val} className="bg-bg-card">{val}%</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-[14px] font-bold text-accent font-mono">
                {((watch(`lineItems.${index}.${showHoursColumn ? 'hours' : 'qty'}` as Path<T>) || 0) * (watch(`lineItems.${index}.rate` as Path<T>) || 0)).toFixed(2)}
              </span>
            </div>

            <button 
              type="button"
              onClick={() => remove(index)}
              className="absolute -right-12 p-2 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => append({ description: "", qty: 1, hours: 0, rate: 0, taxPercent: 20, amount: 0 } as any)}
        className="w-full py-4 border-2 border-dashed border-border rounded-xl text-[13px] font-bold text-text-muted hover:border-accent/40 hover:text-accent transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Line Item
      </motion.button>
    </div>
  );
}
