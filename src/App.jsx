import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { SlidingSidebar } from "./components/SlidingSidebar";
import { UpdatedHeader } from "./components/UpdatedHeader";
import { Dashboard } from "./pages/Dashboard";
import { Orders } from "./pages/Orders";
import { Products } from "./pages/Products";
import { CategoryManagement } from "./pages/CategoryManagement"; // ✨ ADD THIS
import { Customers } from "./pages/Customers";
import { CustomerDetailsPage } from './pages/CustomerDetailsPage';
import { UpdatedSettings } from "./pages/UpdatedSettings";
import { ProfileSettings } from "./pages/ProfileSettings";
import { UserManagement } from "./pages/UserManagement";
import { DeliveryStaff } from "./pages/DeliveryStaff";
import { HomePageManagement } from "./pages/HomePageManagement";
import { Reports } from "./pages/Reports";
import { PushNotifications } from "./pages/PushNotifications";
import { HelpSupport } from "./pages/HelpSupport";
import { Wallet } from "./pages/Wallet";
import { Membership } from "./pages/Membership";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { getCurrentUser, logoutUser } from "./lib/auth";
import { Toaster } from "./components/ui/sonner";

// Wrapper for the Authenticated Dashboard Layout
function DashboardLayout({ currentUser, handleLogout, handleProfileUpdate }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active page for Sidebar highlighting based on URL
  const getCurrentPage = () => {
    const path = location.pathname.split('/')[1];
    // If path is empty (root), default to dashboard
    if (!path) return 'dashboard';
    // Keep 'customers' highlighted even when viewing details
    if (path === 'customers') return 'customers';
    return path;
  };

  const currentPage = getCurrentPage();

  const getPageInfo = () => {
    if (location.pathname.startsWith('/customers/') && location.pathname.split('/').length > 2) {
      return { title: "Customer Details", subtitle: "View Profile" };
    }

    switch (currentPage) {
      case "dashboard":
        return { title: "Dashboard", subtitle: "Overview" };
      case "orders":
        return { title: "Orders", subtitle: "Manage Orders" };
      case "products":
        return { title: "Products", subtitle: "Inventory Management" };
      case "category-management": // ✨ ADD THIS
        return { title: "Category Management", subtitle: "Manage Categories" };
      case "customers":
        return { title: "Customers", subtitle: "Customer Base" };
      case "delivery-staff":
        return { title: "Delivery Staff", subtitle: "Team Management" };
      case "user-management":
        return { title: "User Management", subtitle: "Admin Access" };
      case "home-page":
        return { title: "Home Page", subtitle: "Content Management" };
      case "wallet":
        return { title: "Wallet", subtitle: "Discounts & Transactions" };
      case "membership":
        return { title: "Membership", subtitle: "Tiers & Benefits" };
      case "updated-settings":
        return { title: "Settings", subtitle: "System Configuration" };
      case "profile":
        return { title: "Profile Settings", subtitle: "Your Account" };
      case "reports":
        return { title: "Reports", subtitle: "Analytics & Insights" };
      case "notifications":
        return { title: "Push Notifications", subtitle: "Marketing" };
      case "help-support":
        return { title: "Help & Support", subtitle: "Resources" };
      default:
        return { title: "Dashboard", subtitle: "Overview" };
    }
  };

  const handleNavigation = (pageKey) => {
    if (pageKey === 'dashboard') navigate('/');
    else navigate(`/${pageKey}`);
  };

  return (
    <div className="relative h-screen bg-gray-50">
      <Toaster />
      <SlidingSidebar
        currentPage={currentPage}
        onPageChange={handleNavigation}
        onLogout={handleLogout}
        userRole={currentUser?.role || "User"}
      />
      <div className="flex flex-col h-full ml-20">
        <UpdatedHeader
          onNavigate={handleNavigation}
          onLogout={handleLogout}
          profilePhoto={currentUser?.profilePhoto || ""}
          userName={currentUser?.name || "User"}
          userRole={currentUser?.role || "User"}
          currentPage={currentPage}
          pageTitle={getPageInfo().title}
          pageSubtitle={getPageInfo().subtitle}
        />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/category-management" element={<CategoryManagement />} /> {/* ✨ ADD THIS */}
            
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetailsPage />} />
            
            <Route path="/delivery-staff" element={<DeliveryStaff />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/home-page" element={<HomePageManagement />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/updated-settings" element={<UpdatedSettings />} />
            <Route 
              path="/profile" 
              element={
                <ProfileSettings
                  onProfileUpdate={handleProfileUpdate}
                  currentUser={currentUser}
                />
              } 
            />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<PushNotifications />} />
            <Route path="/help-support" element={<HelpSupport />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AuthLayout({ onLogin, onSignup }) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <Login 
            onLogin={onLogin} 
            onNavigate={(page) => navigate(`/${page}`)} 
          />
        } 
      />
      <Route 
        path="/signup" 
        element={
          <Signup 
            onSignup={onSignup} 
            onNavigate={(page) => navigate(`/${page}`)} 
          />
        } 
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleSignup = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logoutUser();
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  return (
    <BrowserRouter>
      {!isLoggedIn ? (
        <AuthLayout onLogin={handleLogin} onSignup={handleSignup} />
      ) : (
        <DashboardLayout 
          currentUser={currentUser} 
          handleLogout={handleLogout} 
          handleProfileUpdate={handleProfileUpdate} 
        />
      )}
    </BrowserRouter>
  );
}