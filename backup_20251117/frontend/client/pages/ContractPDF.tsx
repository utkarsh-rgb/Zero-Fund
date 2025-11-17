// ContractPDF.tsx
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Compact Professional PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 9,
    lineHeight: 1.3,
    fontFamily: "Helvetica",
    color: "#000000",
    border: "2pt solid #000000",
  },
  header: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: "1pt solid #000000",
  },
  title: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 9,
    marginBottom: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  contractInfo: {
    fontSize: 8,
    textAlign: "right",
  },
  section: {
    marginBottom: 12,
  },
  articleTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  subsectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 3,
  },
  paragraph: {
    marginBottom: 4,
    textAlign: "justify",
  },
  boldText: {
    fontWeight: "bold",
  },
  partiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  partyColumn: {
    width: "48%",
  },
  partyTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
    textDecoration: "underline",
  },
  partyDetails: {
    fontSize: 8,
    marginBottom: 2,
  },
  compactMilestone: {
    marginLeft: 10,
    marginBottom: 5,
  },
  milestoneTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 2,
  },
  deliverableItem: {
    fontSize: 7,
    marginLeft: 8,
    marginBottom: 1,
  },
  equityHighlight: {
    textAlign: "center",
    marginBottom: 8,
    paddingTop: 4,
    paddingBottom: 4,
    borderTop: "1pt solid #000000",
    borderBottom: "1pt solid #000000",
  },
  equityAmount: {
    fontSize: 11,
    fontWeight: "bold",
  },
  compactClause: {
    marginBottom: 6,
  },
  clauseTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 2,
  },
  clauseText: {
    fontSize: 8,
    marginBottom: 3,
    textAlign: "justify",
  },
  twoColumnClauses: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clauseColumn: {
    width: "48%",
  },
  signatureRow: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "40%",
    textAlign: "center",
  },
  signatureName: {
    fontWeight: "bold",
    marginBottom: 3,
    fontSize: 8,
  },
  signatureLine: {
    borderTop: "1pt solid #000000",
    marginTop: 20,
    marginBottom: 3,
  },
  signatureLabel: {
    fontSize: 7,
  },
  stampArea: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  stampText: {
    fontSize: 8,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 15,
    paddingTop: 8,
    borderTop: "1pt solid #000000",
    textAlign: "center",
    fontSize: 7,
  },
});

interface ContractData {
  contractNumber?: string;
  entrepreneurName: string;
  entrepreneurEmail: string;
  entrepreneurCompany: string;
  entrepreneurAddress?: string;
  developerName: string;
  developerEmail: string;
  developerAddress?: string;
  projectTitle: string;
  projectDescription: string;
  scope: string;
  timeline: string;
  milestones: Array<{
    id: number;
    title: string;
    duration: string;
    deliverables: string[];
  }>;
  equityPercentage: string;
  ipOwnership: string;
  confidentiality: string;
  terminationClause: string;
  disputeResolution: string;
  governingLaw: string;
  additionalClauses: string[];
}

const ContractPDF = ({ contractData }: { contractData: ContractData }) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Collaboration Agreement</Text>
          <Text style={styles.subtitle}>Equity-Based Development Partnership</Text>
          <View style={styles.contractInfo}>
            {contractData.contractNumber && (
              <Text>Contract No: {contractData.contractNumber} | </Text>
            )}
            <Text>Date: {currentDate}</Text>
          </View>
        </View>

        {/* Article I - Parties (Two Column Layout) */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article I - Contracting Parties</Text>
          <View style={styles.partiesRow}>
            <View style={styles.partyColumn}>
              <Text style={styles.partyTitle}>The Entrepreneur (Party A):</Text>
              <Text style={styles.partyDetails}><Text style={styles.boldText}>Name:</Text> {contractData.entrepreneurName}</Text>
              <Text style={styles.partyDetails}><Text style={styles.boldText}>Email:</Text> {contractData.entrepreneurEmail}</Text>
              <Text style={styles.partyDetails}><Text style={styles.boldText}>Company:</Text> {contractData.entrepreneurCompany}</Text>
              {contractData.entrepreneurAddress && (
                <Text style={styles.partyDetails}><Text style={styles.boldText}>Address:</Text> {contractData.entrepreneurAddress}</Text>
              )}
            </View>
            <View style={styles.partyColumn}>
              <Text style={styles.partyTitle}>The Developer (Party B):</Text>
              <Text style={styles.partyDetails}><Text style={styles.boldText}>Name:</Text> {contractData.developerName}</Text>
              <Text style={styles.partyDetails}><Text style={styles.boldText}>Email:</Text> {contractData.developerEmail}</Text>
              {contractData.developerAddress && (
                <Text style={styles.partyDetails}><Text style={styles.boldText}>Address:</Text> {contractData.developerAddress}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Article II - Project Scope (Compact) */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article II - Project Scope</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>Project:</Text> {contractData.projectTitle} - {contractData.projectDescription}
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>Scope:</Text> {contractData.scope}
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.boldText}>Timeline:</Text> {contractData.timeline}
          </Text>
          
          <Text style={styles.subsectionTitle}>Milestones:</Text>
          {contractData.milestones.map((milestone, idx) => (
            <View key={milestone.id} style={styles.compactMilestone}>
              <Text style={styles.milestoneTitle}>
                {idx + 1}. {milestone.title} ({milestone.duration})
              </Text>
              {milestone.deliverables.map((deliverable, i) => (
                <Text key={i} style={styles.deliverableItem}>• {deliverable}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Article III - Equity */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article III - Equity Compensation</Text>
          <View style={styles.equityHighlight}>
            <Text style={styles.equityAmount}>
              {contractData.equityPercentage}% Equity Stake in {contractData.entrepreneurCompany}
            </Text>
          </View>
          <Text style={styles.paragraph}>
            Developer receives {contractData.equityPercentage}% equity upon milestone completion, subject to standard vesting and anti-dilution provisions.
          </Text>
        </View>

        {/* Article IV - Legal Terms (Two Column Layout) */}
        <View style={styles.section}>
          <Text style={styles.articleTitle}>Article IV - Terms and Conditions</Text>
          <View style={styles.twoColumnClauses}>
            <View style={styles.clauseColumn}>
              <View style={styles.compactClause}>
                <Text style={styles.clauseTitle}>4.1 Intellectual Property</Text>
                <Text style={styles.clauseText}>{contractData.ipOwnership}</Text>
              </View>
              
              <View style={styles.compactClause}>
                <Text style={styles.clauseTitle}>4.2 Confidentiality</Text>
                <Text style={styles.clauseText}>{contractData.confidentiality}</Text>
              </View>

              <View style={styles.compactClause}>
                <Text style={styles.clauseTitle}>4.3 Termination</Text>
                <Text style={styles.clauseText}>{contractData.terminationClause}</Text>
              </View>
            </View>
            
            <View style={styles.clauseColumn}>
              <View style={styles.compactClause}>
                <Text style={styles.clauseTitle}>4.4 Dispute Resolution</Text>
                <Text style={styles.clauseText}>{contractData.disputeResolution}</Text>
              </View>

              <View style={styles.compactClause}>
                <Text style={styles.clauseTitle}>4.5 Governing Law</Text>
                <Text style={styles.clauseText}>
                 {contractData.governingLaw}.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Article V - Additional Terms */}
        {contractData.additionalClauses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.articleTitle}>Article V - Additional Terms</Text>
            {contractData.additionalClauses.map((clause, idx) => (
              <Text key={idx} style={styles.paragraph}>
                5.{idx + 1} {clause}
              </Text>
            ))}
          </View>
        )}

     

        {/* Signatures */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureName}>{contractData.entrepreneurName}</Text>
            <Text style={styles.signatureLabel}>The Entrepreneur</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Signature & Date</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureName}>{contractData.developerName}</Text>
            <Text style={styles.signatureLabel}>The Developer</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Signature & Date</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This Agreement constitutes the entire understanding between parties. Executed on {currentDate}.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ContractPDF;