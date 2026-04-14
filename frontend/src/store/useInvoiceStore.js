import { create } from 'zustand';

export const useInvoiceStore = create((set, get) => ({
  // Company Profile (Settings)
  companyProfile: {
    name: 'Codesoar Technologies Pvt. Ltd.',
    email: 'contact@codesoar.com',
    address: '',
    gstNumber: '',
    currency: 'USD',
  },
  
  invoices: [],
  
  // Current Invoice Draft
  currentInvoice: {
    client: { name: '', email: '', address: '' },
    items: [],
    discount: 0,
    taxRate: 0, // Global tax rate (e.g., 18 for GST)
    notes: 'Thank you for your business!',
    templateStyle: 'Minimal'
  },
  
  // --- ACTIONS ---
  
  setCompanyProfile: (profileData) => set((state) => ({
    companyProfile: { ...state.companyProfile, ...profileData }
  })),

  setClientDetails: (clientData) => set((state) => ({
    currentInvoice: { ...state.currentInvoice, client: { ...state.currentInvoice.client, ...clientData } }
  })),
  
  setInvoiceMeta: (metaData) => set((state) => ({
    currentInvoice: { ...state.currentInvoice, ...metaData }
  })),

  addItem: (item) => set((state) => ({
    currentInvoice: { ...state.currentInvoice, items: [...state.currentInvoice.items, item] }
  })),
  
  updateItem: (index, itemData) => set((state) => {
    const newItems = [...state.currentInvoice.items];
    newItems[index] = { ...newItems[index], ...itemData };
    return { currentInvoice: { ...state.currentInvoice, items: newItems } };
  }),

  setTemplateStyle: (style) => set((state) => ({
    currentInvoice: { ...state.currentInvoice, templateStyle: style }
  })),
  
  calculateTotals: () => {
    const { items, discount, taxRate } = get().currentInvoice;
    let subtotal = 0;
    
    items.forEach(item => {
      subtotal += (item.quantity * item.price);
    });
    
    const amountAfterDiscount = subtotal - discount;
    const taxTotal = amountAfterDiscount * (taxRate / 100);
    const total = amountAfterDiscount + taxTotal;
    
    return { subtotal, taxTotal, total };
  }
}));