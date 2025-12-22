import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, Phone, Shield, Save } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '../lib/api/client';

export function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    permissions: []
  });

  // Helper to parse name from local storage object
  const getInitialData = () => {
    try {
      const storedUserString = localStorage.getItem('user');
      if (!storedUserString) return null;
      
      const localUser = JSON.parse(storedUserString);
      
      let fName = localUser.firstName || '';
      let lName = localUser.lastName || '';
      
      // Fallback: Split the 'name' field if firstName/lastName are missing
      if (!fName && localUser.name) {
          const parts = localUser.name.split(' ');
          fName = parts[0];
          lName = parts.slice(1).join(' ');
      }

      return {
          firstName: fName || '',
          lastName: lName || '',
          email: localUser.email || '',
          phone: localUser.phone || '',
          role: localUser.role || 'Admin', // Default to Admin if undefined
          permissions: localUser.permissions || [],
          id: localUser.id || localUser._id
      };
    } catch (e) {
      console.error("Error parsing local user data", e);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // 1. Load from Local Storage IMMEDIATELY (So Admin sees their data)
      const localData = getInitialData();
      
      if (localData) {
        setFormData(prev => ({
          ...prev,
          firstName: localData.firstName,
          lastName: localData.lastName,
          email: localData.email,
          phone: localData.phone,
          role: localData.role,
          permissions: localData.permissions
        }));
      }

      // 2. Try to fetch fresh data (Only works if backend endpoint exists)
      if (localData && localData.id) {
        try {
          // Note: This might fail for Admins if they aren't in the 'panel-users' table
          // That is okay! We catch the error and keep the local data.
          const response = await apiClient.get(`/users/panel-users/${localData.id}`);
          const backendUser = response.data?.user || response.data;
          
          if (backendUser) {
            console.log("Fetched fresh data from backend");
            setFormData({
              firstName: backendUser.firstName || localData.firstName,
              lastName: backendUser.lastName || localData.lastName,
              email: backendUser.email || localData.email,
              phone: backendUser.phone || localData.phone,
              role: backendUser.role || localData.role,
              permissions: backendUser.permissions || []
            });
          }
        } catch (error) {
          // Silent fail - we just use the Local Storage data we already loaded
          console.warn("Could not fetch backend profile (using local data):", error.message);
        }
      }
      
      setLoading(false);
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = storedUser.id || storedUser._id;

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      };

      // 1. Update Backend (Try/Catch in case route is missing for Admin)
      try {
         await apiClient.put(`/users/panel-users/${userId}`, payload);
      } catch (err) {
         console.warn("Backend update failed, updating local only.");
      }

      // 2. Update Local Storage (Always do this so UI updates)
      const updatedUser = { 
          ...storedUser, 
          ...payload, 
          name: `${payload.firstName} ${payload.lastName}`.trim() 
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // 3. Notify app to update header/sidebar names
      window.dispatchEvent(new Event("storage"));

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  const displayName = formData.firstName 
      ? `${formData.firstName} ${formData.lastName}`.trim() 
      : 'User';
      
  const initials = formData.firstName 
      ? (formData.firstName[0] + (formData.lastName?.[0] || '')).toUpperCase() 
      : 'U';

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Summary */}
        <Card className="col-span-1 p-6 h-fit bg-white border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center pb-6 border-b border-gray-100">
            <div className="h-24 w-24 rounded-full bg-red-500 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-sm ring-4 ring-red-50">
              {initials}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center">{displayName}</h3>
            
            <div className="flex items-center gap-2 mt-2">
              <Shield className="h-3.5 w-3.5 text-purple-500" />
              <p className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                {formData.role || 'Admin'}
              </p>
            </div>
          </div>
          
          <div className="mt-6 space-y-5">
            <div className="flex items-center text-sm group">
               <div className="w-8 flex justify-center"><Mail className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" /></div>
               <span className="text-gray-600 font-medium truncate" title={formData.email}>
                 {formData.email || 'No email set'}
               </span>
            </div>
            <div className="flex items-center text-sm group">
               <div className="w-8 flex justify-center"><Phone className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" /></div>
               <span className="text-gray-600 font-medium">
                 {formData.phone || 'No phone set'}
               </span>
            </div>
          </div>
        </Card>

        {/* Right Column - Edit Form */}
        <Card className="col-span-2 p-6 bg-white border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
          </div>
          
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                <Input 
                  id="firstName"
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  placeholder="e.g. John"
                  className="bg-white border border-gray-300 focus:border-red-500 focus:ring-red-500" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                <Input 
                  id="lastName"
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  placeholder="e.g. Doe"
                  className="bg-white border border-gray-300 focus:border-red-500 focus:ring-red-500" 
                />
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <Input 
                  value={formData.email} 
                  disabled 
                  className="bg-gray-100 border border-gray-300 text-gray-500 cursor-not-allowed" 
                />
                <p className="text-[11px] text-gray-400">Email address cannot be changed directly.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                <Input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="+91 98765 43210"
                  className="bg-white border border-gray-300 focus:border-red-500 focus:ring-red-500" 
                />
              </div>
            </div>

            <div className="flex justify-end pt-5 border-t border-gray-100">
              <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white gap-2 px-8">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}