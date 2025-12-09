import { useState } from 'react';
import { UserPlus, Search, Edit2, Trash2, Download, Filter, Users as UsersIcon, UserCheck, ChevronDown, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { AddUserModal } from '../components/modals/AddUserModal';
import { EditUserModal } from '../components/modals/EditUserModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { showSuccessToast } from '../lib/toast';
import { toast } from 'sonner@2.0.3';
import { useApiUsers } from '../lib/hooks/useApiUsers';

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [moduleFilter, setModuleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [moduleDropdownOpen, setModuleDropdownOpen] = useState(false);
  const [sortByDropdownOpen, setSortByDropdownOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✨ API Hook
  const { 
    users: userList, loading, error, createUser, updateUser, deleteUser, toggleUserStatus 
  } = useApiUsers({ search: searchQuery });

  // ... (handlers remain the same)
  const handleAddUser = async (userData) => { try { await createUser(userData); showSuccessToast('User created!'); setAddModalOpen(false); } catch (err) { toast.error(err.message); } };
  const handleEditUser = async (updatedData) => { try { await updateUser(updatedData.id, updatedData); showSuccessToast('User updated!'); setEditModalOpen(false); } catch (err) { toast.error(err.message); } };
  const handleDeleteUser = async () => { if (selectedUser) { try { await deleteUser(selectedUser.id); showSuccessToast('User deleted!'); setDeleteModalOpen(false); setSelectedUser(null); } catch (err) { toast.error(err.message); } } };
  const handleClearFilters = () => { setRoleFilter('all'); setModuleFilter('all'); setSortBy('name'); setSortOrder('asc'); };

  // Filtering & Sorting (Client-side for now)
  const filteredUsers = userList.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || (roleFilter === 'admin' && (user.role === 'Super Admin' || user.role === 'Admin')) || (roleFilter === 'user' && (user.role === 'Manager' || user.role === 'User'));
    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let compare = 0;
    if (sortBy === 'name') compare = (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'email') compare = (a.email || '').localeCompare(b.email || '');
    if (sortBy === 'role') compare = (a.role || '').localeCompare(b.role || '');
    return sortOrder === 'asc' ? compare : -compare;
  });

  const totalUsers = userList.length;
  const adminUsers = userList.filter(u => u.role === 'Super Admin' || u.role === 'Admin').length;
  const activeUsers = userList.filter(u => 
    u.isActive === true || 
    (u.status && u.status.toLowerCase() === 'active')
  ).length;
  const modules = ['All Modules', 'Dashboard', 'User Management', 'Settings']; // Add more as needed
  const sortOptions = [{ value: 'name', label: 'Sort by Name' }, { value: 'email', label: 'Sort by Email' }, { value: 'role', label: 'Sort by Role' }];

  return (
    <div className="p-6">
      {/* Header & Stats - ✨ RESTORED ORIGINAL LAYOUT */}
      <div className="mb-6 flex items-center justify-between">
        <div><h2>User Management</h2><p className="text-muted-foreground">Manage system users and their roles</p></div>
        <div className="flex gap-3"><Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button><Button className="bg-red-500 hover:bg-red-600" onClick={() => setAddModalOpen(true)}><UserPlus className="h-4 w-4 mr-2" /> Add User</Button></div>
      </div>

      {/* Statistics Cards */}
      {/* ✨ UPDATED: Standardized sizing to match other pages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Users</p>
              <h3 className="text-lg">{totalUsers}</h3>
            </div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center">
              <UsersIcon className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Admin Users</p>
              <h3 className="text-lg">{adminUsers}</h3>
            </div>
            <div className="h-9 w-9 bg-purple-50 rounded-full flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-purple-500" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Active Users</p>
              <h3 className="text-lg">{activeUsers}</h3>
            </div>
            <div className="h-9 w-9 bg-green-50 rounded-full flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Table - ✨ RESTORED ORIGINAL LAYOUT */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search users..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <div className="relative"><Button variant="outline" onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}>{roleFilter === 'all' ? 'All Roles' : roleFilter === 'admin' ? 'Admin' : 'User'}<ChevronDown className="h-4 w-4 ml-2" /></Button>
              {roleDropdownOpen && (<><div className="fixed inset-0 z-40" onClick={() => setRoleDropdownOpen(false)} /><div className="absolute top-full mt-2 left-0 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2"><button onClick={() => { setRoleFilter('all'); setRoleDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">All Roles</button><button onClick={() => { setRoleFilter('admin'); setRoleDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">Admin</button><button onClick={() => { setRoleFilter('user'); setRoleDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">User</button></div></>)}
            </div>
            <div className="relative"><Button variant="outline" onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}><Filter className="h-4 w-4 mr-2" /> More <ChevronDown className="h-4 w-4 ml-2" /></Button></div>
          </div>
          {moreDropdownOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 flex gap-3 items-center">
              <div className="relative"><Button variant="outline" size="sm" onClick={() => setModuleDropdownOpen(!moduleDropdownOpen)}>{moduleFilter === 'all' ? 'All Modules' : moduleFilter}<ChevronDown className="h-4 w-4 ml-2" /></Button>
                {moduleDropdownOpen && (<><div className="fixed inset-0 z-40" onClick={() => setModuleDropdownOpen(false)} /><div className="absolute top-full mt-2 left-0 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2 max-h-64 overflow-y-auto">{modules.map((module) => (<button key={module} onClick={() => { setModuleFilter(module === 'All Modules' ? 'all' : module); setModuleDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">{module}</button>))}</div></>)}
              </div>
              <div className="relative"><Button variant="outline" size="sm" onClick={() => setSortByDropdownOpen(!sortByDropdownOpen)}>{sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort by Name'}<ChevronDown className="h-4 w-4 ml-2" /></Button>
                {sortByDropdownOpen && (<><div className="fixed inset-0 z-40" onClick={() => setSortByDropdownOpen(false)} /><div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">{sortOptions.map((option) => (<button key={option.value} onClick={() => { setSortBy(option.value); setSortByDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50">{option.label}</button>))}</div></>)}
              </div>
              <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>{sortOrder === 'asc' ? <><ArrowUp className="h-4 w-4 mr-2" /> ASC</> : <><ArrowDown className="h-4 w-4 mr-2" /> DESC</>}</Button>
              <Button variant="outline" size="sm" onClick={handleClearFilters} className="ml-auto"><X className="h-4 w-4 mr-2" /> Clear All</Button>
            </div>
          )}
        </div>

        {loading ? <div className="p-8 text-center">Loading users...</div> : (
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Phone</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-gray-100 text-gray-700">{user.role}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{user.phone || 'N/A'}</TableCell>
                  <TableCell className="text-right"><div className="flex gap-1 justify-end"><Button variant="ghost" size="icon" onClick={() => { setSelectedUser(user); setEditModalOpen(true); }}><Edit2 className="h-4 w-4 text-blue-600" /></Button><Button variant="ghost" size="icon" onClick={() => { setSelectedUser(user); setDeleteModalOpen(true); }}><Trash2 className="h-4 w-4 text-red-600" /></Button></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AddUserModal open={addModalOpen} onOpenChange={setAddModalOpen} onSave={handleAddUser} />
      {selectedUser && (<><EditUserModal open={editModalOpen} onOpenChange={setEditModalOpen} onSave={handleEditUser} user={selectedUser} /><DeleteConfirmationModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} onConfirm={handleDeleteUser} title="Delete User" description={`Delete ${selectedUser.name}?`} /></>)}
    </div>
  );
}