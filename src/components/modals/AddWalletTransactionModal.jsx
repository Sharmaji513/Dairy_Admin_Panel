import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// The TypeScript interface 'AddWalletTransactionModalProps' has been removed.
// We now just destructure the props directly.
export function AddWalletTransactionModal({ isOpen, onClose, onAddTransaction }) {
  const [formData, setFormData] = useState({
    customerName: '',
    type: 'credit',
    amount: '',
    description: '',
  });

  // Removed the 'React.FormEvent' type from the event parameter 'e'
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      id: Date.now().toString(),
      type: formData.type, // Removed 'as 'credit' | 'debit''
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: new Date().toISOString().split('T')[0],
      status: 'completed', // Removed 'as const'
      customer: formData.customerName,
    };
    onAddTransaction(newTransaction);
    onClose();
    setFormData({
      customerName: '',
      type: 'credit',
      amount: '',
      description: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0 bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>Add a new wallet transaction</DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <h2 className="text-base font-medium">Add Transaction</h2>
          <button
            type="button"
            onClick={() => onClose()}
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <form onSubmit={handleSubmit} id="add-transaction-form">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="customerName" className="text-xs font-normal">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  className="h-9 text-xs"
                  placeholder="Enter customer name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type" className="text-xs font-normal">
                  Transaction Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit" className="text-xs">Credit</SelectItem>
                    <SelectItem value="debit" className="text-xs">Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-xs font-normal">
                  Amount <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="h-9 text-xs"
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-normal">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.g.target.value })}
                  required
                  className="h-9 text-xs"
                  placeholder="Enter description"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose()}
            className="h-9 text-xs px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-transaction-form"
            className="bg-red-500 hover:bg-red-600 h-9 text-xs px-4"
          >
            Add Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}