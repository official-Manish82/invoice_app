import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// --- Helper Component for Summary & Notes (so we don't repeat code) ---
const InvoiceFooter = ({ invoice, styles }) => (
  <View style={{ marginTop: 20 }}>
    <View style={{ width: '40%', alignSelf: 'flex-end' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={styles.text}>Subtotal:</Text>
        <Text style={styles.text}>${invoice.subtotal.toFixed(2)}</Text>
      </View>
      {invoice.discount > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={styles.text}>Discount:</Text>
          <Text style={styles.text}>-${invoice.discount.toFixed(2)}</Text>
        </View>
      )}
      {invoice.taxRate > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={styles.text}>Tax ({invoice.taxRate}%):</Text>
          <Text style={styles.text}>${invoice.taxTotal.toFixed(2)}</Text>
        </View>
      )}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid #ccc' }}>
        <Text style={[styles.text, { fontWeight: 'bold' }]}>Total:</Text>
        <Text style={[styles.text, { fontWeight: 'bold' }]}>${invoice.total.toFixed(2)}</Text>
      </View>
    </View>
    {invoice.notes && (
      <View style={{ marginTop: 30, paddingTop: 10, borderTop: '1px solid #ccc' }}>
        <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 4 }]}>Notes / Terms</Text>
        <Text style={styles.text}>{invoice.notes}</Text>
      </View>
    )}
  </View>
);

// --- 1. DARK PROFESSIONAL ---
const darkStyles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Helvetica' },
  header: { borderBottom: '2px solid #D4AF37', paddingBottom: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#D4AF37' },
  text: { fontSize: 10, color: '#A3A3A3', lineHeight: 1.5 },
  tableHeader: { flexDirection: 'row', borderBottom: '1px solid #333', paddingBottom: 5, marginBottom: 10 },
  tableRow: { flexDirection: 'row', marginBottom: 8 },
  col1: { width: '50%' }, col2: { width: '15%', textAlign: 'center' }, col3: { width: '15%', textAlign: 'right' }, col4: { width: '20%', textAlign: 'right', color: '#D4AF37' },
});

export const DarkProfessionalTemplate = ({ invoice }) => (
  <Document><Page size="A4" style={darkStyles.page}>
    <View style={darkStyles.header}>
      <View>
        <Text style={darkStyles.title}>INVOICE</Text>
        <Text style={darkStyles.text}>#{invoice.invoiceNumber}</Text>
      </View>
      <View style={{ textAlign: 'right' }}>
        <Text style={[darkStyles.text, { color: '#FFF', fontWeight: 'bold' }]}>{invoice.company?.name}</Text>
        <Text style={darkStyles.text}>{invoice.company?.email}</Text>
        <Text style={darkStyles.text}>{invoice.company?.address}</Text>
      </View>
    </View>
    <View style={{ marginBottom: 20 }}>
      <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>Billed To:</Text>
      <Text style={darkStyles.text}>{invoice.client.name}</Text>
      <Text style={darkStyles.text}>{invoice.client.email}</Text>
    </View>
    <View style={darkStyles.tableHeader}>
      <Text style={[darkStyles.text, darkStyles.col1, { color: '#FFF' }]}>Item</Text>
      <Text style={[darkStyles.text, darkStyles.col2, { color: '#FFF' }]}>Qty</Text>
      <Text style={[darkStyles.text, darkStyles.col3, { color: '#FFF' }]}>Price</Text>
      <Text style={[darkStyles.text, darkStyles.col4, { color: '#FFF' }]}>Total</Text>
    </View>
    {invoice.items.map((item, i) => (
      <View key={i} style={darkStyles.tableRow}>
        <Text style={[darkStyles.text, darkStyles.col1]}>{item.name}</Text>
        <Text style={[darkStyles.text, darkStyles.col2]}>{item.quantity}</Text>
        <Text style={[darkStyles.text, darkStyles.col3]}>${item.price}</Text>
        <Text style={[darkStyles.text, darkStyles.col4]}>${item.quantity * item.price}</Text>
      </View>
    ))}
    <InvoiceFooter invoice={invoice} styles={darkStyles} />
  </Page></Document>
);

// --- 2. CORPORATE BLUE ---
const corpStyles = StyleSheet.create({
  page: { padding: 0, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  headerBox: { backgroundColor: '#1E3A8A', padding: 40, color: '#FFF', flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: 'bold' },
  content: { padding: 40 },
  text: { fontSize: 10, color: '#334155', lineHeight: 1.5 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 8, marginBottom: 10 },
  tableRow: { flexDirection: 'row', padding: 8, borderBottom: '1px solid #E2E8F0' },
  col1: { width: '50%' }, col2: { width: '15%', textAlign: 'center' }, col3: { width: '15%', textAlign: 'right' }, col4: { width: '20%', textAlign: 'right', fontWeight: 'bold' },
});

export const CorporateBlueTemplate = ({ invoice }) => (
  <Document><Page size="A4" style={corpStyles.page}>
    <View style={corpStyles.headerBox}>
      <View>
        <Text style={corpStyles.title}>INVOICE</Text>
        <Text>#{invoice.invoiceNumber}</Text>
      </View>
      <View style={{ textAlign: 'right' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{invoice.company?.name}</Text>
        <Text style={{ fontSize: 10 }}>{invoice.company?.email}</Text>
        <Text style={{ fontSize: 10 }}>{invoice.company?.address}</Text>
      </View>
    </View>
    <View style={corpStyles.content}>
      <View style={{ marginBottom: 30 }}>
        <Text style={[corpStyles.text, { fontWeight: 'bold', color: '#1E3A8A' }]}>Invoice For:</Text>
        <Text style={corpStyles.text}>{invoice.client.name}</Text>
        <Text style={corpStyles.text}>{invoice.client.email}</Text>
      </View>
      <View style={corpStyles.tableHeader}>
        <Text style={[corpStyles.text, corpStyles.col1]}>Item</Text>
        <Text style={[corpStyles.text, corpStyles.col2]}>Qty</Text>
        <Text style={[corpStyles.text, corpStyles.col3]}>Price</Text>
        <Text style={[corpStyles.text, corpStyles.col4]}>Total</Text>
      </View>
      {invoice.items.map((item, i) => (
        <View key={i} style={corpStyles.tableRow}>
          <Text style={[corpStyles.text, corpStyles.col1]}>{item.name}</Text>
          <Text style={[corpStyles.text, corpStyles.col2]}>{item.quantity}</Text>
          <Text style={[corpStyles.text, corpStyles.col3]}>${item.price}</Text>
          <Text style={[corpStyles.text, corpStyles.col4]}>${item.quantity * item.price}</Text>
        </View>
      ))}
      <InvoiceFooter invoice={invoice} styles={corpStyles} />
    </View>
  </Page></Document>
);

// --- 3. CREATIVE GRADIENT ---
const creativeStyles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#FAFAFA', fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', borderLeft: '4px solid #8B5CF6', paddingLeft: 15, marginBottom: 40 },
  title: { fontSize: 28, color: '#8B5CF6', fontWeight: 'bold' },
  text: { fontSize: 10, color: '#52525B', lineHeight: 1.5 },
  tableHeader: { flexDirection: 'row', borderBottom: '2px solid #8B5CF6', paddingBottom: 5, marginBottom: 10 },
  tableRow: { flexDirection: 'row', marginBottom: 8, paddingBottom: 8, borderBottom: '1px dashed #E4E4E7' },
  col1: { width: '50%' }, col2: { width: '15%', textAlign: 'center' }, col3: { width: '15%', textAlign: 'right' }, col4: { width: '20%', textAlign: 'right', color: '#8B5CF6', fontWeight: 'bold' },
});

export const CreativeTemplate = ({ invoice }) => (
  <Document><Page size="A4" style={creativeStyles.page}>
    <View style={creativeStyles.header}>
      <View>
        <Text style={creativeStyles.title}>INVOICE</Text>
        <Text style={creativeStyles.text}>#{invoice.invoiceNumber}</Text>
        <View style={{ marginTop: 15 }}>
          <Text style={[creativeStyles.text, { fontWeight: 'bold' }]}>From:</Text>
          <Text style={creativeStyles.text}>{invoice.company?.name}</Text>
          <Text style={creativeStyles.text}>{invoice.company?.email}</Text>
        </View>
      </View>
      <View align="right">
        <Text style={[creativeStyles.text, { fontWeight: 'bold' }]}>To:</Text>
        <Text style={creativeStyles.text}>{invoice.client.name}</Text>
        <Text style={creativeStyles.text}>{invoice.client.email}</Text>
      </View>
    </View>
    <View style={creativeStyles.tableHeader}>
      <Text style={[creativeStyles.text, creativeStyles.col1, { color: '#18181B' }]}>Item</Text>
      <Text style={[creativeStyles.text, creativeStyles.col2, { color: '#18181B' }]}>Qty</Text>
      <Text style={[creativeStyles.text, creativeStyles.col3, { color: '#18181B' }]}>Price</Text>
      <Text style={[creativeStyles.text, creativeStyles.col4]}>Total</Text>
    </View>
    {invoice.items.map((item, i) => (
      <View key={i} style={creativeStyles.tableRow}>
        <Text style={[creativeStyles.text, creativeStyles.col1]}>{item.name}</Text>
        <Text style={[creativeStyles.text, creativeStyles.col2]}>{item.quantity}</Text>
        <Text style={[creativeStyles.text, creativeStyles.col3]}>${item.price}</Text>
        <Text style={[creativeStyles.text, creativeStyles.col4]}>${item.quantity * item.price}</Text>
      </View>
    ))}
    <InvoiceFooter invoice={invoice} styles={creativeStyles} />
  </Page></Document>
);

// --- 4. CLASSIC BUSINESS ---
const classicStyles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#FFFFFF', fontFamily: 'Times-Roman' },
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1px solid #000', paddingBottom: 20, marginBottom: 20 },
  title: { fontSize: 24, letterSpacing: 2 },
  text: { fontSize: 12, color: '#000', lineHeight: 1.5 },
  tableHeader: { flexDirection: 'row', borderTop: '1px solid #000', borderBottom: '1px solid #000', paddingVertical: 5, marginBottom: 10 },
  tableRow: { flexDirection: 'row', marginBottom: 8 },
  col1: { width: '50%' }, col2: { width: '15%', textAlign: 'center' }, col3: { width: '15%', textAlign: 'right' }, col4: { width: '20%', textAlign: 'right' },
});

export const ClassicBusinessTemplate = ({ invoice }) => (
  <Document><Page size="A4" style={classicStyles.page}>
    <View style={classicStyles.header}>
      <View>
        <Text style={classicStyles.title}>INVOICE</Text>
        <Text style={classicStyles.text}>No: {invoice.invoiceNumber}</Text>
      </View>
      <View style={{ textAlign: 'right' }}>
        <Text style={[classicStyles.text, { fontWeight: 'bold' }]}>{invoice.company?.name}</Text>
        <Text style={classicStyles.text}>{invoice.company?.email}</Text>
        <Text style={classicStyles.text}>{invoice.company?.address}</Text>
        {invoice.company?.gstNumber && <Text style={classicStyles.text}>GST: {invoice.company?.gstNumber}</Text>}
      </View>
    </View>
    <View style={{ marginBottom: 30 }}>
      <Text style={[classicStyles.text, { fontWeight: 'bold' }]}>Bill To:</Text>
      <Text style={classicStyles.text}>{invoice.client.name}</Text>
      <Text style={classicStyles.text}>{invoice.client.email}</Text>
      <Text style={classicStyles.text}>{invoice.client.address}</Text>
    </View>
    <View style={classicStyles.tableHeader}>
      <Text style={[classicStyles.text, classicStyles.col1, { fontWeight: 'bold' }]}>Description</Text>
      <Text style={[classicStyles.text, classicStyles.col2, { fontWeight: 'bold' }]}>Quantity</Text>
      <Text style={[classicStyles.text, classicStyles.col3, { fontWeight: 'bold' }]}>Unit Price</Text>
      <Text style={[classicStyles.text, classicStyles.col4, { fontWeight: 'bold' }]}>Amount</Text>
    </View>
    {invoice.items.map((item, i) => (
      <View key={i} style={classicStyles.tableRow}>
        <Text style={[classicStyles.text, classicStyles.col1]}>{item.name}</Text>
        <Text style={[classicStyles.text, classicStyles.col2]}>{item.quantity}</Text>
        <Text style={[classicStyles.text, classicStyles.col3]}>${item.price}</Text>
        <Text style={[classicStyles.text, classicStyles.col4]}>${item.quantity * item.price}</Text>
      </View>
    ))}
    <InvoiceFooter invoice={invoice} styles={classicStyles} />
  </Page></Document>
);