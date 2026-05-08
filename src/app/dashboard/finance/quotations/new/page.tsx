"use client";

import { useForm } from "react-hook-form";
import { QuotationFormData } from "@/types/quotation";
import { QuotationEditorPanel } from "@/components/dashboard/finance/quotations/QuotationEditorPanel";
import { QuotationPreviewPane } from "@/components/dashboard/finance/quotations/QuotationPreviewPane";
import { Send, ArrowRight, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { convertQuotationToInvoice } from "@/lib/finance/quotationConverter";

export default function NewQuotationPage() {
  const router = useRouter();
  const form = useForm<QuotationFormData>({
    defaultValues: {
      quotationId: "QTO-2405-0012",
      referenceType: "CLI",
      referenceId: "CLI-8892",
      clientName: "Nexus Corp",
      validityDate: "2024-06-15",
      scopeOfWork: "",
      lineItems: [
        { id: "1", description: "Systems Architecture Design", hours: 40, rate: 150.00, taxPercent: 20, amount: 6000 }
      ],
      discount: 10,
      discountType: "percentage",
      useMilestones: true,
      milestones: [
        { id: "ms1", description: "Initial Deployment", percentage: 50, amount: 0 },
        { id: "ms2", description: "Final Sign-off", percentage: 50, amount: 0 }
      ]
    }
  });

  const formData = form.watch();

  const handleConvertToInvoice = () => {
    const invoiceData = convertQuotationToInvoice(formData);
    // In a real app, we'd save the QTO and then redirect with state or ID
    // For this demo, we'll just show the logic
    console.log("Converting to Invoice:", invoiceData);
    router.push("/dashboard/finance/invoices/new");
  };

  return (
    <div className="h-[calc(100vh-120px)] -m-8 flex overflow-hidden">
      {/* Editor - Left */}
      <QuotationEditorPanel form={form} />

      {/* Preview - Right */}
      <div className="flex-1 flex flex-col">
        <QuotationPreviewPane data={formData} />
        
        {/* Action Bar */}
        <div className="bg-bg-card border-t border-border p-6 flex justify-between items-center">
           <div className="flex gap-4">
              <button className="px-6 py-3 border border-border text-text-muted font-bold text-[13px] rounded-lg hover:bg-white/5 transition-all">
                Save Draft
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-border text-text-primary font-bold text-[13px] rounded-lg hover:bg-white/10 transition-all group">
                <Send className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                Send for Approval
              </button>
           </div>

           <motion.button
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={handleConvertToInvoice}
             className="flex items-center gap-2 px-10 py-3 bg-accent text-[#050505] font-bold rounded-lg shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all"
           >
             <ArrowRight className="w-4 h-4" />
             Convert to Invoice
           </motion.button>
        </div>
      </div>
    </div>
  );
}
