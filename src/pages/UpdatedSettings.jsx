import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { apiClient } from '../lib/api/client';

export function UpdatedSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);

  // State for General Tab (Business Info)
  // We map 'Business Name' to the user's Full Name for now, or a specific field if you have one.
  const [formData, setFormData] = useState({
    businessName: '', 
    email: '',
    phone: ''
  });

  // State for Security Tab
  const [securityData, setSecurityData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // ✨ FETCH REAL DATA ON LOAD
  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        setLoading(true);
        
        // 1. Get User ID from Local Storage
        const storedUserString = localStorage.getItem('user');
        if (!storedUserString) {
            setLoading(false);
            return;
        }
        const localUser = JSON.parse(storedUserString);
        const userId = localUser.id || localUser._id;

        // 2. Fetch from Backend
        // Using the same endpoint as Profile Page to ensure consistency
        let userData = localUser; // Fallback
        try {
             const response = await apiClient.get(`/users/panel-users/${userId}`);
             if (response.data) {
                 userData = response.data.user || response.data;
             }
        } catch (apiError) {
             console.warn("API fetch failed, using local storage", apiError);
        }

        // 3. Populate State
        const fullName = userData.firstName 
            ? `${userData.firstName} ${userData.lastName}` 
            : userData.name || '';

        setFormData({
            businessName: fullName, // Using Name as Business Name placeholder
            email: userData.email || '',
            phone: userData.phone || ''
        });

        setSecurityData(prev => ({
            ...prev,
            email: userData.email || ''
        }));

      } catch (error) {
        console.error("Settings load error", error);
        toast.error("Could not load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettingsData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveGeneral = async () => {
    try {
        // Logic to save general settings
        // Note: If you want this to update the User Profile, use the PUT endpoint
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser.id || storedUser._id;
        
        // Example: Updating Phone via API
        await apiClient.put(`/users/panel-users/${userId}`, {
            phone: formData.phone,
            // You might need to split businessName back into first/last name if that's what you're editing
        });

        toast.success("Settings saved successfully!");
    } catch (error) {
        toast.error("Failed to save settings");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
        <p className="text-sm text-gray-500">Manage your application and security settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'general'
              ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'security'
              ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Security
        </button>
      </div>

      {/* GENERAL TAB */}
      {activeTab === 'general' && (
        <Card className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl">
          <h3 className="text-base font-semibold text-gray-900 mb-6">Business Information</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Business Name (User Name)</Label>
              <Input
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                name="email"
                value={formData.email}
                disabled
                className="bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Phone</Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>

            <div className="pt-2">
              <Button 
                onClick={handleSaveGeneral}
                className="bg-red-500 hover:bg-red-600 text-white px-6"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Email Section */}
          <Card className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-6">Account Email</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                <Input
                  value={securityData.email}
                  disabled
                  className="bg-gray-100 text-gray-500 border-gray-200"
                />
              </div>
              <p className="text-xs text-gray-500">
                This email will be used for account notifications and password recovery.
              </p>
              <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                Update Email
              </Button>
            </div>
          </Card>

          {/* Password Section */}
          <Card className="p-8 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h3 className="text-base font-semibold text-gray-900 mb-6">Change Password</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Current Password</Label>
                <Input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  className="bg-gray-50/50 border-gray-200"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">New Password</Label>
                  <Input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    className="bg-gray-50/50 border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Confirm Password</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    className="bg-gray-50/50 border-gray-200"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button className="bg-red-500 hover:bg-red-600 text-white px-6">
                  Update Password
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}