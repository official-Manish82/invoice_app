import Invoice from '../models/Invoice.js';

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
export const createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice({
      user: req.user._id, // Got this from the protect middleware!
      ...req.body
    });

    const createdInvoice = await invoice.save();
    res.status(201).json(createdInvoice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create invoice', error: error.message });
  }
};

// @desc    Get all logged in user's invoices
// @route   GET /api/invoices
// @access  Private
export const getInvoices = async (req, res) => {
  try {
    // Only find invoices belonging to the currently logged in user
    const invoices = await Invoice.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invoices', error: error.message });
  }
};

// @desc    Update invoice status
// @route   PUT /api/invoices/:id
// @access  Private
export const updateInvoiceStatus = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    // Make sure the invoice exists AND belongs to the user
    if (invoice && invoice.user.toString() === req.user._id.toString()) {
      invoice.status = req.body.status || invoice.status;
      const updatedInvoice = await invoice.save();
      res.json(updatedInvoice);
    } else {
      res.status(404).json({ message: 'Invoice not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
// @access  Private
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (invoice && invoice.user.toString() === req.user._id.toString()) {
      await invoice.deleteOne();
      res.json({ message: 'Invoice removed successfully' });
    } else {
      res.status(404).json({ message: 'Invoice not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete invoice', error: error.message });
  }
};