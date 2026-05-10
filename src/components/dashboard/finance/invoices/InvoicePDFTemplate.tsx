"use client";

import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { InvoiceFormData } from "@/types/invoice";
import { calculateTotals } from "@/lib/finance/taxCalculator";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#050505",
  },
  brandName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00E5FF",
  },
  address: {
    fontSize: 8,
    color: "#8A8A8A",
    textAlign: "right",
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  infoLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#8A8A8A",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#050505",
  },
  table: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "#1A1A1A",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#1A1A1A",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: "center" },
  colRate: { flex: 1.5, textAlign: "right" },
  colTax: { flex: 1, textAlign: "center" },
  colAmount: { flex: 1.5, textAlign: "right" },
  totalsSection: {
    marginTop: 30,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    paddingVertical: 4,
  },
  grandTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderColor: "#050505",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export const InvoicePDFTemplate = ({ data }: { data: InvoiceFormData }) => {
  const { subtotal, totalTax, totalDue, taxGroups } = calculateTotals(data.lineItems);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={{ marginTop: 4, color: "#8A8A8A" }}>{data.invoiceId}</Text>
          </View>
          <View>
            <Text style={styles.brandName}>Quantum Blaze</Text>
            <Text style={styles.address}>1010 Nexus Way, Sector 4</Text>
            <Text style={styles.address}>Aethelgard Prime</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View>
            <Text style={styles.infoLabel}>Billed To</Text>
            <Text style={styles.infoValue}>{data.clientName}</Text>
            <Text style={{ fontSize: 9, color: "#3A3A3A", marginTop: 2 }}>{data.clientId}</Text>
            <Text style={{ fontSize: 9, color: "#3A3A3A", marginTop: 2 }}>
              {data.billingAddress}
            </Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.infoLabel}>Issue Date</Text>
              <Text style={styles.infoValue}>{data.issueDate}</Text>
            </View>
            <View>
              <Text style={styles.infoLabel}>Due Date</Text>
              <Text style={styles.infoValue}>{data.dueDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.infoLabel, styles.colDesc]}>Description</Text>
            <Text style={[styles.infoLabel, styles.colQty]}>Qty</Text>
            <Text style={[styles.infoLabel, styles.colRate]}>Rate</Text>
            <Text style={[styles.infoLabel, styles.colTax]}>Tax</Text>
            <Text style={[styles.infoLabel, styles.colAmount]}>Amount</Text>
          </View>

          {data.lineItems.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colRate}>{item.rate.toFixed(2)}</Text>
              <Text style={styles.colTax}>{item.taxPercent}%</Text>
              <Text style={[styles.colAmount, { fontWeight: "bold" }]}>
                {(item.qty * item.rate).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={{ color: "#8A8A8A" }}>Subtotal</Text>
            <Text style={{ fontWeight: "bold" }}>{subtotal.toFixed(2)}</Text>
          </View>
          {Object.values(taxGroups).map((group) => (
            <View key={group.rate} style={styles.totalRow}>
              <Text style={{ color: "#8A8A8A" }}>VAT ({group.rate}%)</Text>
              <Text style={{ fontWeight: "bold" }}>{group.taxAmount.toFixed(2)}</Text>
            </View>
          ))}
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>Total Due</Text>
            <Text>{totalDue.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ marginTop: 60 }}>
          <Text style={styles.infoLabel}>Payment Instructions</Text>
          <Text style={{ fontSize: 9, color: "#3A3A3A" }}>
            Account Name: Quantum Blaze Solutions
          </Text>
          <Text style={{ fontSize: 9, color: "#3A3A3A" }}>IBAN: AE02 4000 0000 1234 5678 901</Text>
          <Text style={{ fontSize: 9, color: "#3A3A3A" }}>Swift: QBZAAEAD</Text>
        </View>
      </Page>
    </Document>
  );
};
