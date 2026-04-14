import express from 'express';
import { createInvoice, getInvoices, updateInvoiceStatus, deleteInvoice } from '../controllers/invoiceController.js';
import { protect } from '../middleware/authMiddleware.js'; // Protects these routes!

const router = express.Router();

// Chain routes that have the same path
router.route('/')
  .post(protect, createInvoice)
  .get(protect, getInvoices);

router.route('/:id')
  .put(protect, updateInvoiceStatus)
  .delete(protect, deleteInvoice);

export default router;