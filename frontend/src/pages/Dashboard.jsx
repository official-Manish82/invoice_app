import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, FileText, CheckCircle, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- DYNAMIC CURRENCY LOGIC ---
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
  const currencyCode = userInfo?.settings?.currency || 'USD';
  const currencySymbols = { USD: '$', INR: '₹', EUR: '€', GBP: '£' };
  const sym = currencySymbols[currencyCode] || '$';

  useEffect(() => {
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
          toast.error("Failed to load dashboard data");
        }
      } catch (error) {
        toast.error("Network error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [navigate]);

  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === 'Pending' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);

  const paidInvoicesCount = invoices.filter(inv => inv.status === 'Paid').length;
  const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;
  const recentInvoices = invoices.slice(0, 5);

  const revenueData = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: totalRevenue > 0 ? totalRevenue : 0 },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return <Badge className="bg-green-100 text-green-800 border-0">Paid</Badge>;
      case 'Pending': return <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>;
      case 'Overdue': return <Badge className="bg-red-100 text-red-800 border-0">Overdue</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-muted-foreground">Loading your dashboard...</div>;

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-1">Here is a summary of your business performance.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sym}{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1">From paid invoices</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-slate-500 mt-1">Generated all time</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid Invoices</CardTitle>
            <CheckCircle className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidInvoicesCount}</div>
            <p className="text-xs text-slate-500 mt-1">
              {invoices.length > 0 ? Math.round((paidInvoicesCount / invoices.length) * 100) : 0}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payment</CardTitle>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sym}{pendingAmount.toFixed(2)}</div>
            {overdueCount > 0 ? (
              <p className="text-xs text-red-500 mt-1 font-medium">{overdueCount} overdue invoices!</p>
            ) : (
              <p className="text-xs text-slate-500 mt-1">Awaiting collection</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F172A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${sym}${value}`} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                  <Area type="monotone" dataKey="total" stroke="#0F172A" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentInvoices.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">No activity yet.</div>
              ) : (
                recentInvoices.map((inv) => (
                  <div key={inv._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-slate-100 text-slate-600 font-medium text-xs">
                          {getInitials(inv.client?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none truncate max-w-[120px]">
                          {inv.client?.name || 'Unknown Client'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {inv.invoiceNumber} • {new Date(inv.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-medium">{sym}{(inv.total || 0).toFixed(2)}</span>
                      {getStatusBadge(inv.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}