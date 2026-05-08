"use client";

import { useForm } from "react-hook-form";
import { InvoiceFormData } from "@/types/invoice";
import { InvoiceEditorPanel } from "@/components/dashboard/finance/invoices/InvoiceEditorPanel";
import { InvoicePreviewPane } from "@/components/dashboard/finance/invoices/InvoicePreviewPane";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDFTemplate } from "@/components/dashboard/finance/invoices/InvoicePDFTemplate";
import { Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function NewInvoicePage() {
  const form = useForm<InvoiceFormData>({
    defaultValues: {
      invoiceId: "INV-2605-0043",
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lineItems: [
        { id: "1", description: "Quantum Core Integration", qty: 1, rate: 15000, taxPercent: 20, amount: 15000 }
      ],
      clientId: "CLI-XXXX-X",
      clientName: "",
      billingAddress: "",
    }
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formData = form.watch();

  return (
    <div className="h-[calc(100vh-120px)] -m-8 flex overflow-hidden">
      {/* Editor - Left */}
      <InvoiceEditorPanel form={form} />

      {/* Preview - Right */}
      <div className="flex-1 flex flex-col">
        <InvoicePreviewPane data={formData} />
        
        {/* Action Bar */}
        <div className="bg-bg-card border-t border-border p-6 flex justify-center min-h-[100px]">
           {isMounted ? (
             <PDFDownloadLink 
               document={<InvoicePDFTemplate data={formData} />} 
               fileName={`${formData.invoiceId}.pdf`}
               className="no-underline"
             >
               {({ blob, url, loading, error }) => (
                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   disabled={loading}
                   className="flex items-center gap-3 px-12 py-4 bg-accent text-[#050505] font-bold rounded-xl shadow-[0_0_30px_rgba(0,229,255,0.2)] hover:shadow-[0_0_40px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
                 >
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                   {loading ? "Generating PDF..." : "Save as PDF"}
                 </motion.button>
               )}
             </PDFDownloadLink>
           ) : (
             <button disabled className="flex items-center gap-3 px-12 py-4 bg-accent text-[#050505] font-bold rounded-xl opacity-50">
               <Loader2 className="w-5 h-5 animate-spin" />
               Loading...
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
