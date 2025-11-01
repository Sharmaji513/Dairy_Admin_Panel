import { useState, useEffect } from 'react';
import { Eye, Calendar, Upload, Settings, Edit, Trash2, Copy, Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { products } from '../lib/mockData';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function HomePageManagement() {
  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7c75f461`;

  // Top Banner state
  const [bannerTitle, setBannerTitle] = useState('Welcome to Our Restaurant');
  const [bannerSubtitle, setBannerSubtitle] = useState('Delicious food delivered fresh to your door');
  const [ctaButtonText, setCtaButtonText] = useState('Order Now');
  const [ctaLink, setCtaLink] = useState('/menu');
  const [bannerImage, setBannerImage] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Published state
  const [publishedBanner, setPublishedBanner] = useState({
    title: 'Welcome to Our Restaurant',
    subtitle: 'Delicious food delivered fresh to your door',
    ctaText: 'Order Now',
    ctaLink: '/menu',
    image: null
  });

  // Special Offers state
  const [specialOffer, setSpecialOffer] = useState({
    title: '20% Off Dairy',
    code: 'DAIRY20',
    description: 'Get 20% off on all dairy products',
    visible: true
  });

  // Featured Categories state
  const [showCategorySettings, setShowCategorySettings] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSpecialOfferSettings, setShowSpecialOfferSettings] = useState(false);
  const [showTopProductsSettings, setShowTopProductsSettings] = useState(false);
  const [editSectionId, setEditSectionId] = useState(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');
  const [deleteSectionId, setDeleteSectionId] = useState(null);
  const [categoryVisibility, setCategoryVisibility] = useState('always');
  const [offerVisibility, setOfferVisibility] = useState('date');
  const [offerStartDate, setOfferStartDate] = useState('');
  const [offerEndDate, setOfferEndDate] = useState('');
  const [topProductsVisibility, setTopProductsVisibility] = useState('time');
  const [topProductsStartTime, setTopProductsStartTime] = useState('09:00');
  const [topProductsEndTime, setTopProductsEndTime] = useState('21:00');
  const [featuredCategories] = useState([
    { id: 1, name: 'Milk', icon: '🥛' },
    { id: 2, name: 'Dairy', icon: '🧈' },
    { id: 3, name: 'Beverages', icon: '🥤' }
  ]);

  // Top Products state
  const [topProducts] = useState(products.slice(0, 4));

  // Section management
  const [sections, setSections] = useState([
    { id: 1, name: 'Featured Categories', type: 'categories', visible: true, scheduled: false },
    { id: 2, name: 'Special Offers', type: 'offers', visible: true, scheduled: true },
    { id: 3, name: 'Top Products', type: 'products', visible: true, scheduled: true }
  ]);

  // Load saved content on mount
  useEffect(() => {
    loadHomepageContent();
  }, []);

  const loadHomepageContent = async () => {
    try {
      const response = await fetch(`${API_URL}/homepage-content`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.banner) {
          setPublishedBanner(data.banner);
          setBannerTitle(data.banner.title);
          setBannerSubtitle(data.banner.subtitle);
          setCtaButtonText(data.banner.ctaText);
          setCtaLink(data.banner.ctaLink);
          setBannerImage(data.banner.image);
        }
        if (data.specialOffer) {
          setSpecialOffer(data.specialOffer);
        }
      }
    } catch (error) {
      console.error('Error loading homepage content:', error);
    }
  };

  const saveHomepageContent = async () => {
    try {
      const content = {
        banner: publishedBanner,
        specialOffer
      };

      await fetch(`${API_URL}/homepage-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(content)
      });
    } catch (error) {
      console.error('Error saving homepage content:', error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully!');
  };

  const handlePublish = async () => {
    const newBanner = {
      title: bannerTitle,
      subtitle: bannerSubtitle,
      ctaText: ctaButtonText,
      ctaLink,
      image: bannerImage
    };
    setPublishedBanner(newBanner);
    await saveHomepageContent();
    toast.success('Banner published successfully!');
  };

  const handleSchedule = () => {
    toast.info('Schedule feature coming soon!');
  };

  const handleCategorySettingsSave = () => {
    toast.success('Visibility settings updated!');
    setShowCategorySettings(false);
  };

  const handleSpecialOfferSettingsSave = () => {
    toast.success('Special offer visibility settings updated!');
    setShowSpecialOfferSettings(false);
  };

  const handleTopProductsSettingsSave = () => {
    toast.success('Top products visibility settings updated!');
    setShowTopProductsSettings(false);
  };

  const handleEditSection = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setEditSectionId(sectionId);
      setEditSectionTitle(section.name);
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (editSectionId) {
      setSections(sections.map(s =>
        s.id === editSectionId ? { ...s, name: editSectionTitle } : s
      ));
      toast.success('Section updated successfully!');
      setShowEditModal(false);
      setEditSectionId(null);
      setEditSectionTitle('');
    }
  };

  const handleDeleteSection = (sectionId) => {
    setDeleteSectionId(sectionId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteSectionId) {
      setSections(sections.filter(s => s.id !== deleteSectionId));
      toast.success('Section deleted successfully!');
      setShowDeleteModal(false);
      setDeleteSectionId(null);
    }
  };

  const handleCopySection = (sectionId) => {
    toast.success('Section duplicated!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2>Homepage</h2>
            <p className="text-muted-foreground">Management</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="text-xs"
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview Mode
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              className="text-xs"
            >
              💾 Save Draft
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSchedule}
              className="text-xs"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Schedule
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              className="text-xs bg-red-500 hover:bg-red-600"
            >
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Top Banner Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Top Banner</h3>
            <div className="flex gap-2 text-xs">
              <button className="text-blue-600">📋 Rules</button>
              <button className="text-green-600 flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Preview
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="banner-title" className="text-xs">Title</Label>
                <Input
                  id="banner-title"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="Welcome to Our Restaurant"
                  className="text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner-subtitle" className="text-xs">Subtitle</Label>
                <Input
                  id="banner-subtitle"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="Delicious food delivered fresh to your door"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cta-button" className="text-xs">CTA Button Text</Label>
                <Input
                  id="cta-button"
                  value={ctaButtonText}
                  onChange={(e) => setCtaButtonText(e.target.value)}
                  placeholder="Order Now"
                  className="text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta-link" className="text-xs">CTA Link</Label>
                <Input
                  id="cta-link"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="/menu"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Media Upload</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {bannerImage ? (
                  <div className="space-y-2">
                    <img
                      src={bannerImage}
                      alt="Banner preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="text-xs"
                      >
                        Change
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBannerImage(null)}
                        className="text-xs text-red-500"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-3">
                      Upload image or video • PNG, JPG, MP4 up to 10MB
                    </p>
                    <label htmlFor="file-upload">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById('file-upload')?.click();
                        }}
                      >
                        Choose File
                      </Button>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Banner Preview - Matches reference image exactly */}
          <div className="space-y-2">
            <Label className="text-xs">Banner</Label>
            <div
              className="relative rounded-lg overflow-hidden"
              style={{
                background: publishedBanner.image
                  ? `linear-gradient(90deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%), url(${publishedBanner.image})`
                  : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                minHeight: '80px',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: publishedBanner.image ? 'overlay' : 'normal'
              }}
            >
              <div className="flex items-center justify-between px-6 py-5">
                <div>
                  <h2 style={{
                    color: 'white',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    marginBottom: '0.25rem',
                    lineHeight: '1.2'
                  }}>
                    {publishedBanner.title}
                  </h2>
                  <p style={{
                    color: 'white',
                    fontSize: '0.875rem',
                    opacity: 0.95,
                    lineHeight: '1.4'
                  }}>
                    {publishedBanner.subtitle}
                  </p>
                </div>
                <Button
                  className="bg-white hover:bg-gray-100 font-medium px-6 py-2"
                  style={{
                    color: '#667eea',
                    fontSize: '0.875rem'
                  }}
                >
                  {publishedBanner.ctaText}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Page Sections */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Page Sections</h3>
            <select className="text-xs border border-gray-300 rounded px-3 py-1.5">
              <option>Add Section...</option>
              <option>Featured Categories</option>
              <option>Top Products</option>
              <option>Special Offers</option>
              <option>Promotional Banner</option>
              <option>Custom Content</option>
            </select>
          </div>

          {/* Featured Categories Section */}
          <div className="mb-6 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-600" />
                <h4 className="font-medium text-xs">Featured Categories</h4>
                <span className="text-xs text-muted-foreground">· Featured Categories</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCategorySettings(true)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEditSection(1)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopySection(1)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Duplicate"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button className="text-green-600" title="Visible">
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteSection(1)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold mb-3 text-xs">Featured Categories</h4>
              <div className="flex items-center justify-between">
                {featuredCategories.map((category) => (
                  <div key={category.id} className="bg-white rounded-lg p-4 text-center">
                    <div className="w-20 h-12 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg mx-auto mb-2 flex items-center justify-center text-3xl">
                      {category.icon}
                    </div>
                    <p className="text-xs font-medium">{category.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Special Offers Section */}
          <div className="mb-6 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-600" />
                <h4 className="font-medium text-xs">Special Offers</h4>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Scheduled</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSpecialOfferSettings(true)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEditSection(2)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopySection(2)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Duplicate"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button className="text-green-600" title="Visible">
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteSection(2)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="bg-red-500 rounded-lg p-6 text-white relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">{specialOffer.title}</h3>
                  <p className="text-sm opacity-90 mb-2">{specialOffer.description}</p>
                  <div className="inline-block bg-white text-red-600 px-4 py-1 rounded font-bold text-xs">
                    CODE: {specialOffer.code}
                  </div>
                </div>
                <div className="absolute -right-2 -bottom-5 text-7xl font-bold text-white opacity-20">
                  {specialOffer.title.split(' ')[0]}
                </div>
              </div>
            </div>
          </div>

          {/* Top Products Section */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-green-600" />
                <h4 className="font-medium text-xs">Top Products</h4>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Scheduled</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTopProductsSettings(true)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEditSection(3)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopySection(3)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Duplicate"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button className="text-green-600" title="Visible">
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteSection(3)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-bold mb-3 text-xs">Top Products</h4>
              <div className="flex items-center justify-between gap-3">
                {topProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg overflow-hidden w-48">
                    <div className="w-full h-20 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">₹{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Settings Modal */}
      <Dialog open={showCategorySettings} onOpenChange={setShowCategorySettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Visibility Rules - Featured Categories</DialogTitle>
            <DialogDescription className="text-xs">
              Configure when and how the Featured Categories section should be displayed to customers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs">Visibility Type</Label>
              <Select value={categoryVisibility} onValueChange={setCategoryVisibility}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always" className="text-xs">Always Visible</SelectItem>
                  <SelectItem value="time" className="text-xs">Time-based</SelectItem>
                  <SelectItem value="date" className="text-xs">Date-based</SelectItem>
                  <SelectItem value="special" className="text-xs">Special Occasions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCategorySettings(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCategorySettingsSave}
                className="text-xs bg-blue-500 hover:bg-blue-600"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Special Offer Settings Modal - Date-based */}
      <Dialog open={showSpecialOfferSettings} onOpenChange={setShowSpecialOfferSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Visibility Rules - Special Offers</DialogTitle>
            <DialogDescription className="text-xs">
              Set the date range when this special offer should be visible to customers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs">Visibility Type</Label>
              <Select value={offerVisibility} onValueChange={setOfferVisibility}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always" className="text-xs">Always Visible</SelectItem>
                  <SelectItem value="date" className="text-xs">Date-based</SelectItem>
                  <SelectItem value="time" className="text-xs">Time-based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {offerVisibility === 'date' && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs">Start Date</Label>
                  <Input
                    type="date"
                    value={offerStartDate}
                    onChange={(e) => setOfferStartDate(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">End Date</Label>
                  <Input
                    type="date"
                    value={offerEndDate}
                    onChange={(e) => setOfferEndDate(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSpecialOfferSettings(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSpecialOfferSettingsSave}
                className="text-xs bg-blue-500 hover:bg-blue-600"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Top Products Settings Modal - Time-based */}
      <Dialog open={showTopProductsSettings} onOpenChange={setShowTopProductsSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Visibility Rules - Top Products</DialogTitle>
            <DialogDescription className="text-xs">
              Set the time range when top products should be displayed to customers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs">Visibility Type</Label>
              <Select value={topProductsVisibility} onValueChange={setTopProductsVisibility}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always" className="text-xs">Always Visible</SelectItem>
                  <SelectItem value="time" className="text-xs">Time-based</SelectItem>
                  <SelectItem value="date" className="text-xs">Date-based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {topProductsVisibility === 'time' && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs">Start Time</Label>
                  <Input
                    type="time"
                    value={topProductsStartTime}
                    onChange={(e) => setTopProductsStartTime(e.target.value)}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">End Time</Label>
                  <Input
                    type="time"
                    value={topProductsEndTime}
                    onChange={(e) => setTopProductsEndTime(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTopProductsSettings(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleTopProductsSettingsSave}
                className="text-xs bg-blue-500 hover:bg-blue-600"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Section Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Edit Section</DialogTitle>
            <DialogDescription className="text-xs">
              Update the section title and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="section-title" className="text-xs">Title</Label>
              <Input
                id="section-title"
                value={editSectionTitle}
                onChange={(e) => setEditSectionTitle(e.target.value)}
                placeholder="Featured Categories"
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="text-xs bg-blue-500 hover:bg-blue-600"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Delete Section</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete this section? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={confirmDelete}
              className="text-xs bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}