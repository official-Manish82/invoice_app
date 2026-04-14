import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Download, MoreHorizontal, Plus, Filter, FileSpreadsheet, Trash2, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Invoices() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // --- DYNAMIC CURRENCY LOGIC ---
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const currencyCode = userInfo?.settings?.currency || 'USD';
  const currencySymbols = { USD: '$', INR: '₹', EUR: '€', GBP: '£' };
  const sym = currencySymbols[currencyCode] || '$';

  const fetchInvoices = async () => {
    try {
      if (!userInfo || !userInfo.token) {
        navigate('/login');
        return;
      }
      const response = await fetch('http://localhost:5000/api/invoices', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      } else {
        toast.error("Failed to load invoices");
      }
    } catch (error) {
      toast.error("Network error connecting to server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setInvoices(invoices.map(inv => inv._id === id ? { ...inv, status: newStatus } : inv));
        toast.success(`Status Updated`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/invoices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if (response.ok) {
        setInvoices(invoices.filter(inv => inv._id !== id));
        toast.success("Invoice Deleted");
      } else {
        toast.error("Failed to delete invoice");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    const clientName = inv.client?.name?.toLowerCase() || '';
    const invNumber = inv.invoiceNumber?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = clientName.includes(searchLower) || invNumber.includes(searchLower);
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return <Badge className="bg-green-100 text-green-800 border-0">Paid</Badge>;
      case 'Pending': return <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>;
      case 'Overdue': return <Badge className="bg-red-100 text-red-800 border-0">Overdue</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage and track your billing history.</p>
        </div>
        <Link to="/create">
          <Button><Plus className="w-4 h-4 mr-2" /> New Invoice</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search clients or ID..." className="pl-8" 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" /> {statusFilter === 'All' ? 'All Statuses' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('All')}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Paid')}>Paid</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Overdue')}>Overdue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="w-full sm:w-auto" onClick={() => toast.info("Exporting to CSV...")}>
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="border rounded-md bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-semibold">Invoice ID</TableHead>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Date Issued</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading your invoices...</TableCell></TableRow>
            ) : filteredInvoices.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No invoices found. Go create one!</TableCell></TableRow>
            ) : (
              filteredInvoices.map((inv) => (
                <TableRow key={inv._id}>
                  <TableCell className="font-medium text-slate-900">{inv.invoiceNumber}</TableCell>
                  <TableCell>{inv.client?.name}</TableCell>
                  <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{sym}{(inv.total || 0).toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(inv.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4 text-slate-500" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Change Status</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusChange(inv._id, 'Paid')}>
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Mark as Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(inv._id, 'Pending')}>
                          <Clock className="w-4 h-4 mr-2 text-yellow-600" /> Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(inv._id, 'Overdue')}>
                          <AlertCircle className="w-4 h-4 mr-2 text-red-600" /> Mark as Overdue
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(inv._id)} className="text-red-600 focus:text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}