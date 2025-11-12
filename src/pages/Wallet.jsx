import { useState } from 'react';
import { Wallet as WalletIcon, Plus, Download, TrendingUp, TrendingDown, CreditCard, DollarSign, Gift, Tag, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { AddWalletTransactionModal } from '../components/modals/AddWalletTransactionModal';
import { AddDiscountBonusModal } from '../components/modals/AddDiscountBonusModal';
import { EditDiscountBonusModal } from '../components/modals/EditDiscountBonusModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { toast } from 'sonner@2.0.3';

// TypeScript interface 'Transaction' removed

// TypeScript interface 'DiscountBonus' removed

const mockTransactions = [
  {
    id: '1',
    type: 'credit',
    amount: 500,
    description: 'Wallet recharge',
    date: '2025-11-10',
    status: 'completed',
    customer: 'Rajesh Kumar'
  },
  {
    id: '2',
    type: 'debit',
    amount: 150,
    description: 'Order payment',
    date: '2025-11-09',
    status: 'completed',
    customer: 'Priya Sharma'
  },
  {
    id: '3',
    type: 'credit',
    amount: 1000,
    description: 'Refund credited',
    date: '2025-11-08',
    status: 'completed',
    customer: 'Amit Patel'
  },
  {
    id: '4',
    type: 'debit',
    amount: 200,
    description: 'Subscription payment',
    date: '2025-11-07',
    status: 'completed',
    customer: 'Sneha Reddy'
  }
];

const mockDiscountsBonuses = [
  {
    id: '1',
    title: 'Gold Member Discount',
    type: 'discount',
    value: 15,
    valueType: 'percentage',
    membershipTier: 'Gold',
    validFrom: '2025-11-01',
    validUntil: '2025-12-31',
    status: 'active'
  },
  {
    id: '2',
    title: 'Welcome Bonus',
    type: 'bonus',
    value: 100,
    valueType: 'fixed',
    membershipTier: 'All',
    validFrom: '2025-11-01',
    validUntil: '2025-11-30',
    status: 'active'
  },
  {
    id: '3',
    title: 'Silver Member Discount',
    type: 'discount',
    value: 10,
    valueType: 'percentage',
    membershipTier: 'Silver',
    validFrom: '2025-11-01',
    validUntil: '2025-12-31',
    status: 'active'
  },
  {
    id: '4',
    title: 'Festive Bonus',
    type: 'bonus',
    value: 200,
    valueType: 'fixed',
    membershipTier: 'Gold',
    validFrom: '2025-11-15',
    validUntil: '2025-11-20',
    status: 'inactive'
  }
];

export function Wallet() {
  // Removed type annotations from useState
  const [transactions, setTransactions] = useState(mockTransactions);
  const [discountsBonuses, setDiscountsBonuses] = useState(mockDiscountsBonuses);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isAddDiscountBonusModalOpen, setIsAddDiscountBonusModalOpen] = useState(false);
  const [isEditDiscountBonusModalOpen, setIsEditDiscountBonusModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [selectedDiscountBonus, setSelectedDiscountBonus] = useState(null);

  const totalBalance = transactions.reduce((acc, transaction) => {
    if (transaction.status === 'completed') {
      return transaction.type === 'credit' ? acc + transaction.amount : acc - transaction.amount;
    }
    return acc;
  }, 5000);

  const totalCredits = transactions
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDebits = transactions
    .filter(t => t.type === 'debit' && t.status === 'completed')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="p-4">
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
            onClick={() => setIsAddTransactionModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Balance</p>
              <h3 className="text-lg">₹{totalBalance.toLocaleString()}</h3>
            </div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center">
              <WalletIcon className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Credits</p>
              <h3 className="text-lg text-green-600">₹{totalCredits.toLocaleString()}</h3>
            </div>
            <div className="h-9 w-9 bg-green-50 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Debits</p>
              <h3 className="text-lg text-red-600">₹{totalDebits.toLocaleString()}</h3>
            </div>
            <div className="h-9 w-9 bg-red-50 rounded-full flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md mb-4">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="text-sm font-semibold">Recent Transactions</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Transaction ID</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Amount</TableHead>
              <TableHead className="text-xs">Description</TableHead>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Customer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-xs">#{transaction.id}</TableCell>
                <TableCell className="text-xs">
                  <div className="flex items-center gap-2">
                    {transaction.type === 'credit' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs">
                  <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                  </span>
                </TableCell>
                <TableCell className="text-xs">{transaction.description}</TableCell>
                <TableCell className="text-xs">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-xs">
                  <Badge
                    className={
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                        : 'bg-red-100 text-red-700 hover:bg-red-100'
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">{transaction.customer}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Discount & Bonus Management Section */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
          <h3 className="text-sm font-semibold">Discount & Bonus Management</h3>
          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-600 transition-all duration-200 h-9 text-xs border border-red-500"
            onClick={() => setIsAddDiscountBonusModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Discount/Bonus
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Title</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Value</TableHead>
              <TableHead className="text-xs">Membership Tier</TableHead>
              <TableHead className="text-xs">Valid From</TableHead>
              <TableHead className="text-xs">Valid Until</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discountsBonuses.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-xs">{item.title}</TableCell>
                <TableCell className="text-xs">
                  <div className="flex items-center gap-2">
                    {item.type === 'discount' ? (
                      <Tag className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Gift className="h-4 w-4 text-purple-500" />
                    )}
                    <span className={item.type === 'discount' ? 'text-blue-600' : 'text-purple-600'}>
                      {item.type === 'discount' ? 'Discount' : 'Bonus'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium">
                  {item.valueType === 'percentage' ? `${item.value}%` : `₹${item.value}`}
                </TableCell>
                <TableCell className="text-xs">
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    {item.membershipTier}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">{new Date(item.validFrom).toLocaleDateString()}</TableCell>
                <TableCell className="text-xs">{new Date(item.validUntil).toLocaleDateString()}</TableCell>
                <TableCell className="text-xs">
                  <Badge
                    className={
                      item.status === 'active'
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 transition-all duration-200 h-9 text-xs border border-blue-500"
                      onClick={() => {
                        setSelectedDiscountBonus(item);
                        setIsEditDiscountBonusModalOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 transition-all duration-200 h-9 text-xs border border-red-500"
                      onClick={() => {
                        setSelectedDiscountBonus(item);
                        setIsDeleteConfirmationModalOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add Transaction Modal */}
      <AddWalletTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        onAddTransaction={(newTransaction) => {
          setTransactions([...transactions, newTransaction]);
          toast.success('Transaction added successfully!');
        }}
      />

      {/* Add Discount/Bonus Modal */}
      <AddDiscountBonusModal
        isOpen={isAddDiscountBonusModalOpen}
        onClose={() => setIsAddDiscountBonusModalOpen(false)}
        onAdd={(newDiscountBonus) => {
          setDiscountsBonuses([...discountsBonuses, newDiscountBonus]);
          toast.success('Discount/Bonus added successfully!');
        }}
      />

      {/* Edit Discount/Bonus Modal */}
      <EditDiscountBonusModal
        isOpen={isEditDiscountBonusModalOpen}
        onClose={() => setIsEditDiscountBonusModalOpen(false)}
        item={selectedDiscountBonus}
        onEdit={(updatedDiscountBonus) => {
          const updatedList = discountsBonuses.map(item =>
            item.id === updatedDiscountBonus.id ? updatedDiscountBonus : item
          );
          setDiscountsBonuses(updatedList);
          toast.success('Discount/Bonus updated successfully!');
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => setIsDeleteConfirmationModalOpen(false)}
        title="Delete Discount/Bonus"
        description="Are you sure you want to delete this discount/bonus? This action cannot be undone."
        onConfirm={() => {
          if (selectedDiscountBonus) {
            const updatedList = discountsBonuses.filter(item => item.id !== selectedDiscountBonus.id);
            setDiscountsBonuses(updatedList);
            toast.success('Discount/Bonus deleted successfully!');
          }
        }}
      />
    </div>
  );
}