import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, Plus, Edit2, Trash2, Shield, Download, RefreshCw, X, ArrowUpDown, Users, UserCheck } from 'lucide-react';
import { AddUserModal } from '../components/modals/AddUserModal';
import { EditUserModal } from '../components/modals/EditUserModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { useApiUsers } from '../lib/hooks/useApiUsers';
import { toast } from 'sonner';

// Full list of permissions matching the "Add User" modal
const PANEL_PERMISSIONS = [
  "dashboard", "inventory", "orders", "delivery", "customers", "reports", 
  "products", "settings", "userManagement", "profile", "membership", 
  "analytics", "auditLogs", "billing", "content", "wallet", 
  "helpSupport", "apiAccess"
];

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc'); 

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { users, loading, error, refetch, createUser, updateUser, deleteUser } = useApiUsers();

  // FILTER LOGIC
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    const fullName = `${user.firstName || ''} ${user.lastName || ''} ${user.name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(query) || (user.email || '').toLowerCase().includes(query);

    const matchesRole = selectedRole === 'all' || 
                        (user.role && user.role.toLowerCase() === selectedRole.toLowerCase());

    const matchesModule = selectedModule === 'all' || 
                          (user.permissions && Array.isArray(user.permissions) && user.permissions.includes(selectedModule));

    return matchesSearch && matchesRole && matchesModule;
  });

  // SORT LOGIC
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const nameA = (a.firstName || a.name || '').toLowerCase();
    const nameB = (b.firstName || b.name || '').toLowerCase();
    return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedModule('all');
    setSelectedRole('all');
    setSortOrder('asc');
  };

  const handleRefresh = () => {
    refetch();
    toast.success("User list refreshed");
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await updateUser(updatedData.id, updatedData);
      setEditModalOpen(false);
      setSelectedUser(null);
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update user");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id || selectedUser._id);
      setDeleteModalOpen(false);
      setSelectedUser(null);
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'Admin' || u.role === 'Super Admin').length;
  const activeCount = users.filter(u => u.isEnabled !== false).length; 

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500">Manage system users and their roles</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button variant="outline" className="gap-2 text-red-500 border-red-200 hover:bg-red-50">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 gap-2" onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4" /> Add User
          </Button>
        </div>
      </div>

      {/* ✨ UPDATED STATS CARDS: Single Row Layout (Flex Row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Card 1: Total Users */}
        <Card className="p-6 flex flex-row items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalUsers}</h3>
          </div>
          <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
            <Users className="h-6 w-6" />
          </div>
        </Card>

        {/* Card 2: Admin Users */}
        <Card className="p-6 flex flex-row items-center justify-between shadow-sm hover:shadow-md transition-shadow">
           <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Admin Users</p>
            <h3 className="text-2xl font-bold text-gray-900">{adminCount}</h3>
          </div>
          <div className="h-12 w-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
            <Shield className="h-6 w-6" />
          </div>
        </Card>

        {/* Card 3: Active Users */}
        <Card className="p-6 flex flex-row items-center justify-between shadow-sm hover:shadow-md transition-shadow">
           <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Active Users</p>
            <h3 className="text-2xl font-bold text-gray-900">{activeCount}</h3>
          </div>
          <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
            <UserCheck className="h-6 w-6" />
          </div>
        </Card>

      </div>

      <Card className="border-none shadow-sm bg-white">
        {/* Filter Bar */}
        <div className="p-4 border-b flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search users..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {PANEL_PERMISSIONS.map(perm => (
                <SelectItem key={perm} value={perm}>
                  {perm.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="PanelUser">Panel User</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={toggleSort} className="gap-2">
            Sort by Name
            <ArrowUpDown className={`h-3.5 w-3.5 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </Button>

          {(searchQuery || selectedModule !== 'all' || selectedRole !== 'all') && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-gray-500">
              <X className="h-4 w-4 mr-1" /> Clear All
            </Button>
          )}
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : sortedUsers.length === 0 ? (
             <div className="p-8 text-center text-gray-500">No users found matching your filters.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.map((user) => (
                  <TableRow key={user.id || user._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-gray-900">
                      {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.name}
                    </TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        user.role === 'Admin' || user.role === 'Super Admin'
                          ? 'bg-purple-50 text-purple-700 border-purple-100'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {user.role || 'PanelUser'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.phone || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEditClick(user)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteClick(user)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        
        {!loading && sortedUsers.length > 0 && (
          <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
            <span>Showing {sortedUsers.length} users</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        )}
      </Card>

      <AddUserModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={createUser} />
      
      {selectedUser && (
        <>
          <EditUserModal 
            open={editModalOpen} 
            onOpenChange={(open) => { setEditModalOpen(open); if(!open) setSelectedUser(null); }} 
            user={selectedUser} 
            onSave={handleSaveEdit}
          />
          <DeleteConfirmationModal
            open={deleteModalOpen}
            onOpenChange={(open) => { setDeleteModalOpen(open); if(!open) setSelectedUser(null); }}
            onConfirm={handleConfirmDelete}
            title="Delete User"
            description={`Are you sure you want to delete ${selectedUser.name || 'this user'}? This action cannot be undone.`}
          />
        </>
      )}
    </div>
  );
}