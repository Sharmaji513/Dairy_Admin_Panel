import { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, User, Calendar, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { dataStore } from '../lib/dataStore';
import { showSuccessToast } from '../lib/toast';

const faqs = [
  {
    id: 1,
    question: 'How do I add a new product to the system?',
    answer: 'To add a new product, navigate to the Products page from the sidebar, click on the "Add Product" button in the top right corner, fill in all the required details including product name, category, price, and stock quantity, then click "Save Product". The product will be immediately available in the system.',
    category: 'Products'
  },
  {
    id: 2,
    question: 'How can I manage user permissions and roles?',
    answer: 'Go to User Management from the sidebar, click on the edit icon next to any user, and you\'ll see the Permissions & Access section. Here you can assign different permissions across Core modules (Dashboard, Orders, Products, etc.), Analytics & Reports, Operations, and Development sections. Each permission controls access to specific features.',
    category: 'User Management'
  },
  {
    id: 3,
    question: 'How do I process and track orders?',
    answer: 'Navigate to the Orders page where you can view all orders. Click "Add Order" to create a new order, or use the edit icon to update order status. You can filter orders by status (Pending, Processing, Completed, Cancelled) and track delivery in real-time. Each order shows customer details, items, payment status, and delivery information.',
    category: 'Orders'
  },
  {
    id: 4,
    question: 'How can I view sales reports and analytics?',
    answer: 'Access the Reports page from the sidebar to view comprehensive sales analytics. You can filter data by branch and date range, view revenue trends, top-selling products, order statistics, and customer insights. Export reports using the export button for further analysis.',
    category: 'Reports & Analytics'
  },
  {
    id: 5,
    question: 'How do I manage multiple branches in the system?',
    answer: 'Go to Branch Management from the sidebar to add, edit, or remove branches. Each branch has its own details including location, contact information, and operational status. You can assign products and delivery staff to specific branches, and view branch-specific analytics in the Reports section.',
    category: 'Branch Management'
  },
  {
    id: 6,
    question: 'What should I do if I forgot my password?',
    answer: 'On the login page, click on "Forgot Password" link. Enter your registered email address, and you\'ll receive password reset instructions. Follow the link in the email to create a new password. If you don\'t receive the email, check your spam folder or contact your system administrator.',
    category: 'Account & Security'
  }
];

export function HelpSupport() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [supportQueries, setSupportQueries] = useState([]);

  // Load support queries from localStorage or dataStore
  useEffect(() => {
    const queries = dataStore.loadSupportQueries([
      {
        id: 'SQ001',
        customerId: 'C001',
        customerName: 'Rajesh Kumar',
        email: 'rajesh@email.com',
        phone: '+91 98765 43210',
        query: 'I am not receiving my daily milk delivery on time. The delivery person comes after 9 AM but I need it by 7 AM for my family breakfast. Please help resolve this issue.',
        images: [
          'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
          'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
          'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400'
        ],
        status: 'pending',
        createdAt: '2025-11-05 08:30 AM'
      },
      {
        id: 'SQ002',
        customerId: 'C002',
        customerName: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 87654 32109',
        query: 'The milk I received yesterday was not fresh. It had an unusual smell and taste. I have attached photos of the product. Please check the quality control.',
        images: [
          'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
          'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'
        ],
        status: 'resolved',
        createdAt: '2025-11-04 06:15 PM'
      },
      {
        id: 'SQ003',
        customerId: 'C003',
        customerName: 'Amit Patel',
        email: 'amit.patel@email.com',
        phone: '+91 76543 21098',
        query: 'I want to increase my daily order from 2 liters to 3 liters. Also, please add 500ml curd to my daily subscription. How can I modify my subscription plan?',
        images: [
          'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400'
        ],
        status: 'pending',
        createdAt: '2025-11-03 10:45 AM'
      }
    ]);
    setSupportQueries(queries);
  }, []);

  const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleStatusChange = (queryId, newStatus) => {
    const updatedQueries = supportQueries.map(q =>
      q.id === queryId ? { ...q, status: newStatus } : q
    );
    setSupportQueries(updatedQueries);
    dataStore.saveSupportQueries(updatedQueries);
    showSuccessToast(`Query marked as ${newStatus}`);
  };

  const pendingQueries = supportQueries.filter(q => q.status === 'pending').length;
  const resolvedQueries = supportQueries.filter(q => q.status === 'resolved').length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2>Help & Support</h2>
        <p className="text-muted-foreground">Find answers and manage customer queries</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Queries</p>
              <h3 className="text-2xl">{supportQueries.length}</h3>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </Card>
        <Card className="p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Pending Queries</p>
              <h3 className="text-2xl">{pendingQueries}</h3>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </Card>
        <Card className="p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Resolved Queries</p>
              <h3 className="text-2xl">{resolvedQueries}</h3>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* FAQs Section */}
      <Card className="mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3>Frequently Asked Questions</h3>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {filteredFaqs.length} FAQs
            </Badge>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3">
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-xs bg-white"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="p-4">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full flex items-start justify-between text-left group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <HelpCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <h4 className="group-hover:text-blue-600 transition-colors">
                      {faq.question}
                    </h4>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                    {faq.category}
                  </Badge>
                </div>
                <div className="ml-4">
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>
              {expandedFaq === faq.id && (
                <div className="mt-3 pl-6 text-sm text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Customer Support Queries Section */}
      <Card>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3>Customer Support Queries</h3>
              <p className="text-xs text-muted-foreground">
                Queries submitted by customers from mobile app
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                {pendingQueries} Pending
              </Badge>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                {resolvedQueries} Resolved
              </Badge>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {supportQueries.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No support queries yet</p>
            </div>
          ) : (
            supportQueries.map((query) => (
              <div key={query.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4>{query.customerName}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-muted-foreground">{query.email}</p>
                        <p className="text-xs text-muted-foreground">{query.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={query.status === 'pending' ? 'destructive' : 'secondary'}
                      className={query.status === 'pending'
                        ? 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                        : 'bg-green-100 text-green-700 hover:bg-green-100'
                      }
                    >
                      {query.status === 'pending' ? 'Pending' : 'Resolved'}
                    </Badge>
                  </div>
                </div>

                <div className="ml-[52px] mb-3">
                  <p className="text-sm mb-2">{query.query}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {query.createdAt}
                  </div>
                </div>

                {/* Images */}
                {query.images && query.images.length > 0 && (
                  <div className="ml-[52px] mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <ImageIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-xs text-muted-foreground">
                        {query.images.length} Image{query.images.length > 1 ? 's' : ''} Attached
                      </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {query.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => window.open(img, '_blank')}
                        >
                          <img
                            src={img}
                            alt={`Query attachment ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="ml-[52px] flex gap-2">
                  {query.status === 'pending' ? (
                    <Button
                      onClick={() => handleStatusChange(query.id, 'resolved')}
                      className="inline-flex items-center justify-center px-3 py-1 rounded text-sm font-medium hover:bg-green-600 bg-green-500 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(query.id, 'pending')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reopen Query
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
