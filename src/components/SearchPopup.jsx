import { X, Home, Package, ShoppingCart, Users, UserCog, Bike, Wallet, Crown, Layout, Settings, User, HelpCircle, FolderOpen, BarChart3, Bell } from 'lucide-react'; 
import { Input } from './ui/input';
import { useState } from 'react';

const searchOptions = [
  { id: 'dashboard', label: 'Dashboard', description: 'Main overview and metrics', icon: Home, page: 'dashboard' },
  { id: 'products', label: 'Products', description: 'Manage products', icon: Package, page: 'products' },
  { id: 'category-management', label: 'Category Management', description: 'Manage product categories', icon: FolderOpen, page: 'category-management' },
  { id: 'orders', label: 'Orders', description: 'View all orders', icon: ShoppingCart, page: 'orders' },
  { id: 'customers', label: 'Customers', description: 'Customer list', icon: Users, page: 'customers' },
  // { id: 'delivery-staff', label: 'Delivery Staff', description: 'Manage delivery team', icon: Bike, page: 'delivery-staff' }, // 👈 Commented out as requested
  { id: 'user-management', label: 'User Management', description: 'Manage users and permissions', icon: UserCog, page: 'user-management' },
  { id: 'wallet', label: 'Wallet', description: 'Wallet management', icon: Wallet, page: 'wallet' },
  { id: 'membership', label: 'Membership', description: 'Membership tiers', icon: Crown, page: 'membership' },
  { id: 'reports', label: 'Reports', description: 'Sales and analytics', icon: BarChart3, page: 'reports' },
  { id: 'homepage', label: 'Homepage', description: 'Homepage management', icon: Layout, page: 'home-page' },
  { id: 'notifications', label: 'Push Notifications', description: 'Manage push notifications', icon: Bell, page: 'notifications' },
  { id: 'settings', label: 'Settings', description: 'App settings', icon: Settings, page: 'updated-settings' },
  { id: 'profile', label: 'Profile', description: 'User profile access', icon: User, page: 'profile' },
  { id: 'help-support', label: 'Help and Support', description: 'Get help', icon: HelpCircle, page: 'help-support' },
];

export function SearchPopup({ isOpen, onClose, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredOptions = searchOptions.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOptionClick = (page) => {
    onNavigate(page);
    onClose();
    setSearchQuery('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (action === 'Navigate') {
        // Navigate to first option if available
        if (filteredOptions.length > 0) {
          handleOptionClick(filteredOptions[0].page);
        }
      } else if (action === 'Open') {
        // Open action
      } else if (action === 'Close') {
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Search Modal - Smaller and Centered */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-sm bg-white rounded-lg shadow-xl z-50 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="p-3 border-b border-gray-200 flex items-center gap-2">
          <Input
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-gray-300 h-9"
            autoFocus
            onKeyDown={(e) => handleKeyPress(e, 'Navigate')}
          />
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Options List */}
        <div className="max-h-[320px] overflow-y-auto p-1.5">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.page)}
                  className="w-full flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-md transition-colors text-left group"
                >
                  <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center group-hover:bg-red-50 transition-colors flex-shrink-0">
                    <Icon className="h-4 w-4 text-gray-600 group-hover:text-red-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-500 truncate">{option.description}</p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">No modules found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-2.5 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↵</kbd>
              <span>Open</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">ESC</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </>
  );
}