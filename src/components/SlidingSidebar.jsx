import { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  UserCog, 
  Bike, 
  Wallet, 
  Crown, 
  Layout, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown, 
  HelpCircle,
  FolderOpen,
  BarChart3,
  Bell
} from 'lucide-react';
import { cn } from '../components/ui/utils';

const menuGroups = [
  {
    title: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    ]
  },
  {
    title: 'Management',
    items: [
      { icon: ShoppingCart, label: 'Orders', id: 'orders' },
      { icon: Package, label: 'Products', id: 'products' },
      { icon: FolderOpen, label: 'Category Management', id: 'category-management' },
      { icon: Users, label: 'Customers', id: 'customers' },
      { icon: Bike, label: 'Delivery Staff', id: 'delivery-staff' },
      { icon: UserCog, label: 'User Management', id: 'user-management' },
      { icon: Wallet, label: 'Wallet', id: 'wallet' },
      { icon: Crown, label: 'Membership', id: 'membership' },
      { icon: BarChart3, label: 'Reports', id: 'reports' },
    ]
  },
  {
    title: 'CMS',
    items: [
      { icon: Layout, label: 'Home Page', id: 'home-page' },
      { icon: Bell, label: 'Push Notifications', id: 'notifications' },
    ]
  },
  {
    title: 'Settings',
    items: [
      { icon: Settings, label: 'Settings', id: 'updated-settings' },
      { icon: User, label: 'Profile', id: 'profile' },
      { icon: HelpCircle, label: 'Help & Support', id: 'help-support' },
    ]
  }
];

export function SlidingSidebar({ currentPage, onPageChange, onLogout, userRole = "Admin" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openGroups, setOpenGroups] = useState({
    'Main': true,
    'Management': true,
    'CMS': true,
    'Settings': true
  });

  const toggleGroup = (title) => {
    setOpenGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div 
      className={cn(
        // ✨ FIX: Added 'bg-white' explicitly and 'shadow-xl' for better separation
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50 flex flex-col shadow-lg",
        isExpanded ? "w-64" : "w-20"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      {/* ✨ FIX: Added 'bg-white' and 'z-20' to ensure header stays on top and solid */}
      <div className="p-4 border-b border-gray-100 flex items-center h-20 flex-shrink-0 overflow-hidden bg-white z-20 relative">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm z-10 relative">
          <span className="text-white font-bold text-xl">D</span>
        </div>
        
        <div className={cn(
          "ml-3 flex flex-col justify-center transition-all duration-300 overflow-hidden whitespace-nowrap min-w-[150px]",
          isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
        )}>
          <span className="font-bold text-xl text-red-600">Dynasty Premium</span>
          <span className="text-xs text-gray-500 font-medium">Welcome {userRole}</span>
        </div>
      </div>

      {/* Navigation */}
      {/* ✨ FIX: Added 'bg-white' to nav container */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 custom-scrollbar bg-white relative z-10">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-2">
            {/* Group Header */}
            <div className={cn(
              "overflow-hidden transition-all duration-300",
              isExpanded ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
            )}>
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors mb-1 whitespace-nowrap"
              >
                <span>{group.title}</span>
                <ChevronDown 
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    openGroups[group.title] ? "transform rotate-0" : "transform -rotate-90"
                  )} 
                />
              </button>
            </div>
            
            {/* Separator for collapsed state */}
            {!isExpanded && (
              <div className="px-3 py-2">
                <div className="h-px bg-gray-100 w-8 mx-auto" />
              </div>
            )}

            {/* Group Items */}
            <div className={cn(
              "space-y-1 overflow-hidden transition-all duration-300",
              isExpanded && !openGroups[group.title] ? "max-h-0 opacity-0" : "max-h-[1000px] opacity-100"
            )}>
              {group.items.map((item) => {
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
                    <div className={cn(
                      "flex items-center justify-center transition-colors flex-shrink-0 w-6 h-6",
                      isActive ? "text-red-600" : "text-gray-500 group-hover:text-gray-700"
                    )}>
                      <Icon size={22} strokeWidth={1.5} />
                    </div>
                    
                    <span className={cn(
                      "ml-3 font-medium whitespace-nowrap transition-all duration-300 overflow-hidden text-left",
                      isExpanded ? "opacity-100 w-32" : "opacity-0 w-0"
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
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 mt-auto bg-white z-20 relative">
        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center p-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 group",
          )}
        >
          <div className="flex items-center justify-center text-gray-500 group-hover:text-red-600 flex-shrink-0 w-6 h-6">
            <LogOut size={22} strokeWidth={1.5} />
          </div>
          <span className={cn(
            "ml-3 font-medium whitespace-nowrap transition-all duration-300 overflow-hidden",
            isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
          )}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}