import mongoose from 'mongoose';

// Define the shape of a single line item
const invoiceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, default: 0 },
});

// Define the main invoice
const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Links to the User model
  invoiceNumber: { type: String, required: true },
  client: {
    name: { type: String, required: true },
    email: { type: String },
    address: { type: String },
  },
  items: [invoiceItemSchema],
  discount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  taxTotal: { type: Number, required: true },
  total: { type: Number, required: true },
  notes: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Paid', 'Pending', 'Overdue'], 
    default: 'Pending' 
  },
  templateStyle: { type: String, default: 'Minimal' },
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);