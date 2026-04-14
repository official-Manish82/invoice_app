import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Polygon } from '@react-pdf/renderer';

// --- STYLES ---
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  // Top and Bottom Geometric Shapes Container
  bgShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  // Header section
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 40,
    paddingHorizontal: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: '#ff0033',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: 10,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
  },
  companyName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  tagline: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  invoiceTitle: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginRight: 20,
    marginTop: -10, // Pulls it up into the black shape
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginHorizontal: 40,
    marginTop: 30,
    marginBottom: 20,
  },
  // Billing Info
  billingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  invoiceToText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#ff0033',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  clientDetails: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 2,
  },
  metaBox: {
    backgroundColor: '#333333',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  metaBoxText: {
    color: '#ffffff',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    marginRight: 15,
  },
  metaValue: {
    fontSize: 9,
    color: '#475569',
    width: 60,
    textAlign: 'right',
  },
  // Table
  table: {
    marginHorizontal: 40,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
  },
  thDesc: {
    width: '45%',
    backgroundColor: '#ff0033',
    padding: 8,
    color: '#ffffff',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  thCol: {
    width: '18.33%',
    backgroundColor: '#333333',
    padding: 8,
    color: '#ffffff',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tdDesc: {
    width: '45%',
    padding: 8,
  },
  tdCol: {
    width: '18.33%',
    padding: 8,
    fontSize: 9,
    textAlign: 'center',
    color: '#334155',
    fontFamily: 'Helvetica-Bold',
  },
  itemName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  itemDesc: {
    fontSize: 8,
    color: '#64748b',
  },
  // Totals & Payment
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  paymentMethodText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 6,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    width: 160,
  },
  grandTotalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ff0033',
    padding: 8,
    marginTop: 5,
    width: 160,
  },
  // Signature
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 40,
  },
  termsTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  termsText: {
    fontSize: 8,
    color: '#64748b',
    maxWidth: 200,
    marginBottom: 10,
  },
  thanksText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    width: 120,
    marginBottom: 5,
  },
  // Footer Data
  footerData: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  footerText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
  }
});

// --- COMPONENT ---
export default function PixelMartTemplate({ invoice, data }) {
  // Use either 'invoice' or 'data' depending on how it was passed from CreateInvoice
  const inv = invoice || data || {};
  const items = inv.items || [];
  const sym = inv.currencySymbol || '$';

  // Safely grab company/client details matching your global store state
  const compName = inv.company?.companyName || 'PIXEL MART';
  const clientName = inv.client?.name || 'Client Name';
  const clientEmail = inv.client?.email || 'client@email.com';
  const clientAddress = inv.client?.address || 'Client Address';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* TOP GEOMETRIC SHAPES */}
        <View style={styles.bgShapes}>
          <Svg height="120" width="595">
            <Polygon points="250,0 595,0 595,120 150,120" fill="#333333" />
            <Polygon points="350,0 595,0 595,30 330,30" fill="#ff0033" />
          </Svg>
        </View>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>{compName.charAt(0).toUpperCase()}</Text>
            </View>
            <View>
              <Text style={styles.companyName}>{compName}</Text>
              <Text style={styles.tagline}>Creative Design House</Text>
            </View>
          </View>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
        </View>

        <View style={styles.divider}></View>

        {/* BILLING INFO */}
        <View style={styles.billingSection}>
          <View>
            <Text style={styles.invoiceToText}>Invoice To:</Text>
            <Text style={styles.clientName}>{clientName}</Text>
            <Text style={styles.clientDetails}>A: {clientAddress}</Text>
            <Text style={styles.clientDetails}>E: {clientEmail}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={styles.metaBox}>
              <Text style={styles.metaBoxText}>INVOICE NO: {inv.invoiceNumber || '#000000'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>
                {inv.date ? new Date(inv.date).toLocaleDateString() : new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* ITEMS TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thDesc}>Item description</Text>
            <Text style={styles.thCol}>Quantity</Text>
            <Text style={styles.thCol}>Unit Price</Text>
            <Text style={styles.thCol}>Total</Text>
          </View>
          
          {items.map((item, index) => (
            <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 !== 0 ? '#f8fafc' : '#ffffff' }]}>
              <View style={styles.tdDesc}>
                <Text style={styles.itemName}>{item.name || 'Item Name'}</Text>
                {item.description && <Text style={styles.itemDesc}>{item.description}</Text>}
              </View>
              <Text style={styles.tdCol}>{item.quantity || 0}</Text>
              <Text style={styles.tdCol}>{sym}{item.price || 0}</Text>
              <Text style={styles.tdCol}>{sym}{(item.quantity * item.price) || 0}</Text>
            </View>
          ))}
        </View>

        {/* TOTALS & PAYMENT */}
        <View style={styles.bottomSection}>
          <View>
            <Text style={styles.paymentMethodText}>Payment Method</Text>
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { width: 50, marginRight: 5 }]}>Notes</Text>
              <Text style={[styles.metaValue, { width: 140, textAlign: 'left' }]}>
                {inv.notes || 'Please pay within 15 days.'}
              </Text>
            </View>
          </View>

          <View>
            <View style={styles.totalsRow}>
              <Text style={styles.metaLabel}>Sub Total</Text>
              <Text style={styles.metaValue}>{sym}{inv.subtotal || 0}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.metaLabel}>Tax ({inv.taxRate || 0}%)</Text>
              <Text style={styles.metaValue}>{sym}{inv.taxTotal || 0}</Text>
            </View>
            {inv.discount > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.metaLabel}>Discount</Text>
                <Text style={styles.metaValue}>-{sym}{inv.discount}</Text>
              </View>
            )}
            <View style={styles.grandTotalBox}>
              <Text style={{ color: '#fff', fontSize: 10, fontFamily: 'Helvetica-Bold' }}>Grand Total</Text>
              <Text style={{ color: '#fff', fontSize: 10, fontFamily: 'Helvetica-Bold' }}>{sym}{inv.total || 0}</Text>
            </View>
          </View>
        </View>

        {/* SIGNATURE & TERMS */}
        <View style={styles.signatureSection}>
          <View>
            <Text style={styles.termsTitle}>Terms & Conditions:</Text>
            <Text style={styles.termsText}>Please make the payment by the due date. Late payments may be subject to additional fees.</Text>
            <Text style={styles.thanksText}>Thanks for your business!</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.signatureLine}></View>
            <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#1e293b' }}>AUTHORISED SIGNATURE</Text>
          </View>
        </View>

        {/* BOTTOM GEOMETRIC SHAPES */}
        <View style={[styles.bgShapes, { top: 'auto', bottom: 0, height: 60 }]}>
          <Svg height="60" width="595">
            <Polygon points="0,15 450,15 550,60 0,60" fill="#333333" />
            <Polygon points="0,45 400,45 420,60 0,60" fill="#ff0033" />
            <Polygon points="480,15 595,15 595,60 550,60" fill="#ff0033" />
          </Svg>
        </View>

        {/* FOOTER DATA */}
        <View style={styles.footerData}>
          <Text style={styles.footerText}>P: {inv.company?.phone || '+000 1234 5678'}</Text>
          <Text style={[styles.footerText, { color: '#ff0033' }]}>E: {inv.company?.email || 'admin@pixelmart.com'}</Text>
          <Text style={styles.footerText}>A: {inv.company?.address || 'Your Company Address'}</Text>
        </View>

      </Page>
    </Document>
  );
}