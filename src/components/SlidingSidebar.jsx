import { useState, useMemo } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, UserCog, 
  Wallet, Crown, Layout, Settings, LogOut, 
  HelpCircle, FolderOpen, BarChart3, Bell
} from 'lucide-react';
import { cn } from './ui/utils';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: UserCog, label: 'User Management', id: 'user-management', permission: 'userManagement' },
  { icon: Package, label: 'Products', id: 'products', permission: 'products' },
  { icon: FolderOpen, label: 'Category', id: 'category-management', permission: 'categoryManagement' },
  { icon: ShoppingCart, label: 'Orders', id: 'orders', permission: 'orders' },
  { icon: Users, label: 'Customers', id: 'customers', permission: 'customers' },
  { icon: Wallet, label: 'Wallet', id: 'wallet', permission: 'wallet' },
  { icon: Crown, label: 'Membership', id: 'membership', permission: 'membership' },
  { icon: BarChart3, label: 'Reports', id: 'reports', permission: 'reports' },
  { icon: Layout, label: 'Home Page', id: 'home-page', permission: 'homepage' },
  { icon: Bell, label: 'Push Notifications', id: 'notifications', permission: 'notifications' },
  { icon: Settings, label: 'Settings', id: 'updated-settings' },
  { icon: HelpCircle, label: 'Help & Support', id: 'help-support' },
];

export function SlidingSidebar({ currentPage, onPageChange, onLogout, userRole = "Admin", currentUser }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredItems = useMemo(() => {
    const userPerms = currentUser?.permissions || [];
    const currentRole = (userRole || '').toLowerCase();
    const isAdmin = currentRole === 'admin' || currentRole === 'super admin';

    return MENU_ITEMS.filter(item => {
      if (isAdmin) return true;
      if (!item.permission) return true;
      return userPerms.includes(item.permission);
    });
  }, [currentUser, userRole]);

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50 flex flex-col shadow-xl",
        isExpanded ? "w-64" : "w-20"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-100 flex items-center h-20 flex-shrink-0 overflow-hidden bg-white relative z-20">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm relative z-10">
          <span className="text-white font-bold text-xl">D</span>
        </div>
        
        {/* FIX 1: Strict Width Control & Overflow Hidden on Header Text */}
        <div className={cn(
          "flex flex-col justify-center transition-all duration-300 overflow-hidden whitespace-nowrap",
          isExpanded ? "ml-3 opacity-100 w-auto" : "ml-0 opacity-0 w-0"
        )}>
          <span className="font-bold text-xl text-red-600">Dynasty Premium</span>
          <span className="text-xs text-gray-500 font-medium">Welcome {userRole}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 custom-scrollbar bg-white relative z-10">
        <div className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-red-50 text-red-600 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={!isExpanded ? item.label : undefined}
              >
                {/* Icon Container - Fixed Width to prevent squishing */}
                <div className={cn(
                  "flex items-center justify-center transition-colors flex-shrink-0 w-6 h-6",
                  isActive ? "text-red-600" : "text-gray-500 group-hover:text-gray-700"
                )}>
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                
                {/* FIX 2: The Glitch Fix 
                   - whitespace-nowrap: Prevents text from breaking into two lines
                   - w-0: Forces width to 0 when collapsed
                   - overflow-hidden: Cuts off any remaining pixels
                */}
                <span className={cn(
                  "font-medium whitespace-nowrap transition-all duration-300 overflow-hidden text-left",
                  isExpanded ? "ml-3 opacity-100 w-32" : "ml-0 opacity-0 w-0"
                )}>
                  {item.label}
                </span>

                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-red-500 rounded-l-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 mt-auto bg-white relative z-20">
        <button
          onClick={onLogout}
          className="w-full flex items-center p-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 group"
        >
          <div className="flex items-center justify-center text-gray-500 group-hover:text-red-600 flex-shrink-0 w-6 h-6">
            <LogOut size={22} strokeWidth={1.5} />
          </div>
          <span className={cn(
            "font-medium whitespace-nowrap transition-all duration-300 overflow-hidden",
            isExpanded ? "ml-3 opacity-100 w-auto" : "ml-0 opacity-0 w-0"
          )}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}