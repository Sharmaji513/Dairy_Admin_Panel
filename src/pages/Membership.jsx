import { useState } from 'react';
import { Search, Plus, Download, Users, Crown, Star, Award, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { usePersistentCustomers } from '../lib/usePersistentData';
import { AddMembershipModal } from '../components/modals/AddMembershipModal';
import { EditMembershipModal } from '../components/modals/EditMembershipModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { toast } from 'sonner@2.0.3';

export function Membership() {
  const [customerList, setCustomerList] = usePersistentCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddMembershipModalOpen, setIsAddMembershipModalOpen] = useState(false);
  const [isEditMembershipModalOpen, setIsEditMembershipModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Filter customers based on search
  const filteredCustomers = customerList.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate membership stats
  const totalMembers = customerList.length;
  const goldMembers = customerList.filter(c => (c.membership === 'Gold' || c.totalSpent > 10000)).length;
  const silverMembers = customerList.filter(c => (c.membership === 'Silver' || (c.totalSpent >= 5000 && c.totalSpent <= 10000))).length;
  const bronzeMembers = customerList.filter(c => (c.membership === 'Bronze' || c.totalSpent < 5000)).length;

  // Assign membership tier based on total spent if not already assigned
  const getMembershipTier = (customer) => {
    if (customer.membership) return customer.membership;
    if (customer.totalSpent > 10000) return 'Gold';
    if (customer.totalSpent >= 5000) return 'Silver';
    return 'Bronze';
  };

  // Add membership
  const addMembership = (newCustomer) => {
    setCustomerList([...customerList, newCustomer]);
    toast.success('Membership added successfully!');
  };

  // Edit membership
  const editMembership = (updatedCustomer) => {
    const updatedList = customerList.map(c => (c.id === updatedCustomer.id ? updatedCustomer : c));
    setCustomerList(updatedList);
    toast.success('Membership updated successfully!');
  };

  // Delete membership
  const deleteMembership = (customerId) => {
    const updatedList = customerList.filter(c => c.id !== customerId);
    setCustomerList(updatedList);
    toast.success('Membership deleted successfully!');
  };

  return (
    <div className="p-4">
      {/* Action Buttons */}
      <div className="mb-4 flex items-center justify-end">
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="transition-all duration-200 h-9 text-xs border border-gray-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            size="sm"
            className="bg-red-500 hover:bg-red-600 transition-all duration-200 h-9 text-xs border border-red-500"
            onClick={() => setIsAddMembershipModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Membership
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Members</p>
              <h3 className="text-lg">{totalMembers}</h3>
            </div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Gold Members</p>
              <h3 className="text-lg">{goldMembers}</h3>
            </div>
            <div className="h-9 w-9 bg-yellow-50 rounded-full flex items-center justify-center">
              <Crown className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Silver Members</p>
              <h3 className="text-lg">{silverMembers}</h3>
            </div>
            <div className="h-9 w-9 bg-gray-50 rounded-full flex items-center justify-center">
              <Award className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Bronze Members</p>
              <h3 className="text-lg">{bronzeMembers}</h3>
            </div>
            <div className="h-9 w-9 bg-orange-50 rounded-full flex items-center justify-center">
              <Star className="h-4 w-4 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-xs h-9"
            />
          </div>
        </div>
      </Card>

      {/* Members Table */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="text-sm font-semibold">Membership List</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Customer Name</TableHead>
              <TableHead className="text-xs">Email</TableHead>
              <TableHead className="text-xs">Phone</TableHead>
              <TableHead className="text-xs">Membership Tier</TableHead>
              <TableHead className="text-xs">Total Orders</TableHead>
              <TableHead className="text-xs">Total Spent</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => {
              const membershipTier = getMembershipTier(customer);
              return (
                <TableRow key={customer.id}>
                  <TableCell className="text-xs">{customer.name}</TableCell>
                  <TableCell className="text-xs">{customer.email}</TableCell>
                  <TableCell className="text-xs">{customer.phone}</TableCell>
                  <TableCell className="text-xs">
                    <Badge
                      className={
                        membershipTier === 'Gold'
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                          : membershipTier === 'Silver'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                          : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                      }
                    >
                      {membershipTier}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{customer.totalOrders}</TableCell>
                  <TableCell className="text-xs">₹{customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell className="text-xs">
                    <Badge
                      className={
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-100'
                          : 'bg-red-100 text-red-700 hover:bg-red-100'
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 transition-all duration-200 h-9 text-xs border border-blue-500"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsEditMembershipModalOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 transition-all duration-200 h-9 text-xs border border-red-500"
                        onClick={() => {
                          setCustomerToDelete(customer);
                          setIsDeleteConfirmationModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Add Membership Modal */}
      <AddMembershipModal
        isOpen={isAddMembershipModalOpen}
        onClose={() => setIsAddMembershipModalOpen(false)}
        onAddMembership={addMembership}
      />

      {/* Edit Membership Modal */}
      <EditMembershipModal
        isOpen={isEditMembershipModalOpen}
        onClose={() => setIsEditMembershipModalOpen(false)}
        onEditMembership={editMembership}
        customer={selectedCustomer}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
        title="Delete Membership"
        description={`Are you sure you want to delete the membership for ${customerToDelete?.name}? This action cannot be undone.`}
        onConfirm={() => {
          if (customerToDelete) {
            deleteMembership(customerToDelete.id);
          }
        }}
      />
    </div>
  );
}