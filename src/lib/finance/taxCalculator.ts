import { LineItem } from "@/types/invoice";

export interface TaxGroup {
  rate: number;
  taxAmount: number;
  taxableAmount: number;
}

export function calculateTaxGroups(lineItems: LineItem[]): Record<number, TaxGroup> {
  const groups: Record<number, TaxGroup> = {};

  lineItems.forEach((item) => {
    const rate = item.taxPercent;
    const itemTax = (item.qty * item.rate * rate) / 100;
    const taxable = item.qty * item.rate;

    if (!groups[rate]) {
      groups[rate] = {
        rate,
        taxAmount: 0,
        taxableAmount: 0,
      };
    }

    groups[rate].taxAmount += itemTax;
    groups[rate].taxableAmount += taxable;
  });

  return groups;
}

export function calculateTotals(lineItems: LineItem[]) {
  const subtotal = lineItems.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const taxGroups = calculateTaxGroups(lineItems);
  const totalTax = Object.values(taxGroups).reduce((acc, group) => acc + group.taxAmount, 0);
  
  return {
    subtotal,
    totalTax,
    totalDue: subtotal + totalTax,
    taxGroups
  };
}
