"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { formatCurrency } from "@/utils/formatters";

// Helvetica is one of react-pdf's built-in standard PDF fonts, so it works
// directly via fontFamily without any Font.register() call — registering it
// with a fake `src` would throw at render time.

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#0A1330" },
  brandBar: { height: 6, backgroundColor: "#1E5EFF", marginBottom: 20, borderRadius: 3 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  title: { fontSize: 18, fontWeight: 700, color: "#0B2A9C" },
  subtitle: { fontSize: 9, color: "#5A6482", marginTop: 2 },
  meta: { fontSize: 9, color: "#5A6482", textAlign: "right" },
  sectionTitle: { fontSize: 12, fontWeight: 700, marginTop: 20, marginBottom: 8, color: "#0A1330" },
  cardsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  card: { width: "31%", borderWidth: 1, borderColor: "#E0E5F0", borderRadius: 6, padding: 10, marginBottom: 8 },
  cardLabel: { fontSize: 8, color: "#5A6482", marginBottom: 4 },
  cardValue: { fontSize: 14, fontWeight: 700, color: "#0A1330" },
  table: { borderWidth: 1, borderColor: "#E0E5F0", borderRadius: 4, overflow: "hidden" },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E0E5F0" },
  tableRowLast: { flexDirection: "row" },
  th: { flex: 1, padding: 6, fontSize: 9, fontWeight: 700, backgroundColor: "#F1F4F9", color: "#5A6482" },
  td: { flex: 1, padding: 6, fontSize: 9, color: "#0A1330" },
  footer: { position: "absolute", bottom: 24, left: 32, right: 32, fontSize: 8, color: "#9CA8C0", textAlign: "center" },
});

export default function ReportPDFDocument({ range, metrics, deptPerformance, currentMonth }) {
  return (
    <Document title="Kuickpay HRMS Report">
      <Page size="A4" style={styles.page}>
        <View style={styles.brandBar} />

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Kuickpay HRMS Report</Text>
            <Text style={styles.subtitle}>Company-wide analytics summary</Text>
          </View>
          <View>
            <Text style={styles.meta}>Range: {range.startDate} to {range.endDate}</Text>
            <Text style={styles.meta}>Generated: {new Date().toLocaleString("en-GB")}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Employees</Text>
            <Text style={styles.cardValue}>{metrics.totalEmployees}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Attendance Rate</Text>
            <Text style={styles.cardValue}>{metrics.attendanceRate}%</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Absent Today</Text>
            <Text style={styles.cardValue}>{metrics.absentToday}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Late Arrivals (range)</Text>
            <Text style={styles.cardValue}>{metrics.lateCount}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Pending Leaves</Text>
            <Text style={styles.cardValue}>{metrics.pendingLeaves}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Payroll ({currentMonth})</Text>
            <Text style={styles.cardValue}>{formatCurrency(metrics.thisMonthPayroll)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Department performance</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.th}>Department</Text>
            <Text style={styles.th}>Headcount</Text>
            <Text style={styles.th}>Attendance Rate</Text>
            <Text style={styles.th}>Pending Leaves</Text>
          </View>
          {deptPerformance.map((d, i) => (
            <View key={d.id} style={i === deptPerformance.length - 1 ? styles.tableRowLast : styles.tableRow}>
              <Text style={styles.td}>{d.name}</Text>
              <Text style={styles.td}>{d.headcount}</Text>
              <Text style={styles.td}>{d.attendanceRate}%</Text>
              <Text style={styles.td}>{d.pendingLeaves}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Kuickpay HRMS — internal prototype. Generated locally, no data leaves your device.</Text>
      </Page>
    </Document>
  );
}
