import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Settings, FileText, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  // 1. AUTH GUARD: Check if user is logged in on first load
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login'); // Redirect to login if no token found
    } else {
      try {
        const parsedInfo = JSON.parse(userInfo);
        setUserName(parsedInfo.name); // Set user's name for the profile section
      } catch (e) {
        navigate('/login');
      }
    }
  }, [navigate]);

  // 2. LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem('userInfo'); // Clear the token
    toast.success('Logged out successfully');
    navigate('/login'); // Send back to login screen
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Create Invoice', href: '/create', icon: FilePlus },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
              <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
                <span className="text-white text-sm">S</span>
              </div>
              SaaS Invoice
            </div>
          </div>
          
          <nav className="flex-1 py-6 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-slate-100 text-slate-900 font-medium' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Logout Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold text-xs uppercase border border-slate-200">
                {userName ? userName.charAt(0) : 'U'}
              </div>
              <div className="text-sm font-medium text-slate-900 truncate w-28">
                {userName || 'User'}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}