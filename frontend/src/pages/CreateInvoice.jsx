import { useInvoiceStore } from '@/store/useInvoiceStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Eye } from 'lucide-react';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { MinimalModernTemplate } from '@/templates/MinimalModern';
// Added the new PixelMartTemplate import (adjust path if necessary)
import PixelMartTemplate from '@/templates/PixelMartTemplate'; 
// import { DarkProfessionalTemplate, CorporateBlueTemplate, CreativeTemplate, ClassicBusinessTemplate } from '@/templates/PremiumTemplates';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { 
    currentInvoice, 
    setClientDetails, 
    setInvoiceMeta,
    addItem, 
    updateItem, 
    setTemplateStyle, 
    calculateTotals 
  } = useInvoiceStore();
  
  const { subtotal, taxTotal, total } = calculateTotals();

  // --- DYNAMIC CURRENCY & USER INFO LOGIC ---
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const currencyCode = userInfo?.settings?.currency || 'USD';
  const currencySymbols = { USD: '$', INR: '₹', EUR: '€', GBP: '£' };
  const sym = currencySymbols[currencyCode] || '$';

  const getFullInvoiceData = () => ({
    ...currentInvoice,
    company: {
      name: userInfo.name || 'Your Name',
      companyName: userInfo.companyName || 'Your Company',
      address: userInfo.settings?.address || '',
      gstNumber: userInfo.settings?.gstNumber || '',
    }, 
    currencySymbol: sym, // Sending symbol to PDF
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    subtotal,
    taxTotal,
    total
  });

  // --- UPDATED TEMPLATE RENDERER ---
  const renderSelectedTemplate = (invoiceData) => {
    switch (currentInvoice.templateStyle) {
      case 'PixelMart':
        // Passing data as 'data' prop to match our PixelMart component, 
        // and 'invoice' just in case you update it later to match MinimalModern
        return <PixelMartTemplate data={invoiceData} invoice={invoiceData} />;
      case 'Minimal':
      default:
        return <MinimalModernTemplate invoice={invoiceData} />;
    }
  };

  const handleAddBlankItem = () => addItem({ name: '', quantity: 1, price: 0 });

  const handleSaveAndDownload = async () => {
    try {
      if (!userInfo || !userInfo.token) {
        toast.error("Not logged in");
        navigate('/login');
        return;
      }

      const fullInvoiceData = getFullInvoiceData();

      const response = await fetch('http://localhost:5000/api/invoices', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(fullInvoiceData),
      });

      if (!response.ok) throw new Error('Failed to save invoice to database');

      toast.success("Invoice Saved!", { description: "Generating your PDF now..." });
      
      const blob = await pdf(renderSelectedTemplate(fullInvoiceData)).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${fullInvoiceData.client.name || 'Draft'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      toast.error("Error", { description: "Could not save or generate the invoice." });
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Create Invoice</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label className="text-muted-foreground hidden sm:block">Template:</Label>
            <Select value={currentInvoice.templateStyle} onValueChange={setTemplateStyle}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Minimal">Minimal Modern</SelectItem>
                <SelectItem value="Dark">Dark Professional</SelectItem>
                <SelectItem value="Corporate">Corporate Blue</SelectItem>
                {/* --- ADDED PIXELMART TO DROPDOWN --- */}
                <SelectItem value="PixelMart">Pixel Mart (Red)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><Eye className="w-4 h-4 mr-2" /> Preview</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Invoice Preview</DialogTitle>
              </DialogHeader>
              <div className="flex-1 bg-gray-100 rounded-md overflow-hidden">
                <PDFViewer width="100%" height="100%" className="border-0">
                  {renderSelectedTemplate(getFullInvoiceData())}
                </PDFViewer>
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={handleSaveAndDownload}>Save & Download</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader><CardTitle>Client Details</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Client Name</Label>
                  <Input 
                    placeholder="Acme Corp" value={currentInvoice.client.name}
                    onChange={(e) => setClientDetails({ name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    placeholder="billing@acme.com" type="email" value={currentInvoice.client.email}
                    onChange={(e) => setClientDetails({ email: e.target.value })}
                  />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label>Billing Address</Label>
                  <Input 
                    placeholder="123 Business Rd, City, Country" value={currentInvoice.client.address}
                    onChange={(e) => setClientDetails({ address: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <CardTitle>Line Items</CardTitle>
              <Button size="sm" variant="outline" onClick={handleAddBlankItem}>
                <Plus className="w-4 h-4 mr-2"/> Add Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {currentInvoice.items.length === 0 && (
                <div className="text-center p-6 border-2 border-dashed rounded-md text-muted-foreground">
                  No items added yet. Click "Add Item" to start.
                </div>
              )}
              {currentInvoice.items.map((item, index) => (
                <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 items-end border-b pb-4">
                  <div className="flex-1 min-w-[200px] space-y-2">
                    <Label>Description</Label>
                    <Input 
                      placeholder="Web Design Services" value={item.name} 
                      onChange={(e) => updateItem(index, { name: e.target.value })}
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Qty</Label>
                    <Input 
                      type="number" min="1" value={item.quantity} 
                      onChange={(e) => updateItem(index, { quantity: Number(e.target.value) })}
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Price ({sym})</Label>
                    <Input 
                      type="number" min="0" value={item.price} 
                      onChange={(e) => updateItem(index, { price: Number(e.target.value) })}
                    />
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                    const newItems = currentInvoice.items.filter((_, i) => i !== index);
                    useInvoiceStore.setState(state => ({ currentInvoice: { ...state.currentInvoice, items: newItems } }));
                  }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader><CardTitle>Adjustments</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount ({sym})</Label>
                  <Input 
                    type="number" min="0" value={currentInvoice.discount}
                    onChange={(e) => setInvoiceMeta({ discount: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <Input 
                    type="number" min="0" max="100" value={currentInvoice.taxRate}
                    onChange={(e) => setInvoiceMeta({ taxRate: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes / Terms</Label>
                <Textarea 
                  placeholder="Payment due in 15 days..." value={currentInvoice.notes}
                  onChange={(e) => setInvoiceMeta({ notes: e.target.value })}
                  className="resize-none h-24"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 bg-slate-50/50">
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{sym}{subtotal.toFixed(2)}</span>
              </div>
              {currentInvoice.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{sym}{currentInvoice.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({currentInvoice.taxRate}%)</span>
                <span>{sym}{taxTotal.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{sym}{total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}