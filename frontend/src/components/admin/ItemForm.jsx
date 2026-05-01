import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useCategoryStore } from "../../store/useCategoryStore";
import { useStoreStore } from "../../store/useStoreStore";
import { useItemStore } from '../../store/useItemStore';
import { MoreVertical, Pencil, Trash2, Plus, X } from "lucide-react";
import { toast } from 'react-toastify';
import CategoryForm from './CategoryForm';

// Helper component for portal dropdown
const CategoryDropdown = ({ open, setOpen, categories, selectedCategory, onSelect, onEdit, onDelete }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const updatePosition = useCallback(() => {
    if (buttonRef.current && open) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [open, updatePosition]);

  return (
    <div className="relative" ref={buttonRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-left flex justify-between items-center focus:ring-2 focus:ring-amber-500"
      >
        {categories.find(c => c._id === selectedCategory)?.name || "Select Category"}
        <MoreVertical size={18} className="text-gray-400" />
      </button>
      {open && createPortal(
        <div
          style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            width: position.width,
          }}
          className="z-[100] bg-gray-800 border border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto"
        >
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-700 cursor-pointer transition"
            >
              <span
                onClick={() => {
                  onSelect(cat._id);
                  setOpen(false);
                }}
                className="flex-1 text-white"
              >
                {cat.name}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(cat)}
                  className="text-blue-400 hover:text-blue-300 p-1"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(cat._id)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

const ItemForm = ({ onClose, item }) => {
  const isEdit = !!item;
  const { fetchCategories, categories, deleteCategory } = useCategoryStore();
  const { fetchStores, stores } = useStoreStore();
  const { createItem, updateItem, loading } = useItemStore();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    basePrice: '',
    storePrices: [{ store: '', price: '' }],
    customizations: [{ name: '', options: '' }],
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isEdit && item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        category: item.category?._id || item.category || '',
        basePrice: item.basePrice || '',
        storePrices: item.storePrices?.length ? item.storePrices : [{ store: '', price: '' }],
        customizations: item.customizations?.length 
          ? item.customizations.map(c => ({
              name: c.name,
              options: Array.isArray(c.options) ? c.options.join(', ') : c.options || ''
            }))
          : [{ name: '', options: '' }],
        image: null
      });
      if (item.image) setImagePreview(item.image);
    }
  }, [isEdit, item]);

  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, [fetchCategories, fetchStores]);

  const handleChange = (field, value, index = null, subField = null) => {
    if (index !== null && subField !== null) {
      const updated = [...formData[field]];
      updated[index][subField] = value;
      setFormData({ ...formData, [field]: updated });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const addStorePrice = () => {
    setFormData({ 
      ...formData, 
      storePrices: [...formData.storePrices, { store: '', price: '' }] 
    });
  };

  const removeStorePrice = (index) => {
    const updated = [...formData.storePrices];
    updated.splice(index, 1);
    setFormData({ ...formData, storePrices: updated });
  };

  const addAllStores = () => {
    const existingStoreIds = formData.storePrices.map(sp => sp.store);
    const newStores = stores
      .filter(store => !existingStoreIds.includes(store._id))
      .map(store => ({ store: store._id, price: '' }));
    
    if (newStores.length === 0) {
      toast.info('All stores are already added');
      return;
    }
    
    setFormData({
      ...formData,
      storePrices: [...formData.storePrices, ...newStores]
    });
  };

  const addCustomization = () => {
    setFormData({ 
      ...formData, 
      customizations: [...formData.customizations, { name: '', options: '' }] 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.basePrice && formData.storePrices.every(sp => !sp.price)) {
      toast.error('Please provide a base price or at least one store price');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('category', formData.category);
    if (formData.basePrice) submitData.append('basePrice', formData.basePrice);
    
    const validStorePrices = formData.storePrices.filter(sp => sp.store && sp.price);
    if (validStorePrices.length > 0) {
      submitData.append('storePrices', JSON.stringify(validStorePrices));
    }
    
    const validCustomizations = formData.customizations.filter(c => c.name.trim());
    if (validCustomizations.length > 0) {
      const formattedCustoms = validCustomizations.map(c => ({
        name: c.name,
        options: c.options.split(',').map(opt => opt.trim()),
        extraCost: 0
      }));
      submitData.append('customizations', JSON.stringify(formattedCustoms));
    }
    
    if (formData.image && formData.image instanceof File) {
      submitData.append('image', formData.image);
    }

    try {
      if (isEdit) {
        await updateItem(item._id, submitData);
        toast.success('Item updated successfully!');
      } else {
        await createItem(submitData);
        toast.success('Item created successfully!');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} item`);
    }
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto z-50 p-4 md:p-6">
      <form onSubmit={handleSubmit}>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl">
              {isEdit ? <Pencil className="h-6 w-6 text-amber-400" /> : <Plus className="h-6 w-6 text-amber-400" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                {isEdit ? 'Edit Item' : 'Create Item'}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {isEdit ? 'Modify product details' : 'Add a new product to your menu'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                    <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                    Basic Information
                  </h2>
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="text-sm bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-lg transition"
                  >
                    + New Category
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Product Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Cappuccino"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-1">Category *</label>
                    <CategoryDropdown
                      open={open}
                      setOpen={setOpen}
                      categories={categories}
                      selectedCategory={formData.category}
                      onSelect={(catId) => handleChange('category', catId)}
                      onEdit={handleEditCategory}
                      onDelete={deleteCategory}
                    />
                  </div>
                </div>
                <textarea
                  rows="3"
                  placeholder="Description (optional)"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full mt-4 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Rest of the form unchanged... */}
              {/* Pricing section */}
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                    <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                    Pricing
                  </h2>
                  <button
                    type="button"
                    onClick={addAllStores}
                    className="text-sm bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-lg transition"
                  >
                    + Add All Stores
                  </button>
                </div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Base Price (optional if store-specific prices provided)"
                  value={formData.basePrice}
                  onChange={(e) => handleChange('basePrice', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
                />
                <div className="space-y-3">
                  {formData.storePrices.map((storePrice, idx) => (
                    <div
                      key={idx}
                      className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700"
                    >
                      <div className="flex-1 min-w-[150px]">
                        <select
                          value={storePrice.store}
                          onChange={(e) => handleChange("storePrices", e.target.value, idx, "store")}
                          className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">Select Store</option>
                          {stores.map((store) => (
                            <option key={store._id} value={store._id}>{store.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1 min-w-[120px]">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={storePrice.price}
                          onChange={(e) => handleChange("storePrices", e.target.value, idx, "price")}
                          className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div className="w-24 text-center">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            storePrice.store && storePrice.price
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {storePrice.store && storePrice.price ? "Ready" : "Incomplete"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStorePrice(idx)}
                        className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={addStorePrice}
                      className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black transition font-medium"
                    >
                      + Add Store
                    </button>
                  </div>
                </div>
              </div>

              {/* Customizations (unchanged) */}
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                  <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                  Customizations
                </h2>
                <div className="space-y-3">
                  {formData.customizations.map((custom, idx) => (
                    <div key={idx} className="space-y-2 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                      <input
                        type="text"
                        placeholder="Customization name (e.g., Milk type)"
                        value={custom.name}
                        onChange={(e) => handleChange('customizations', e.target.value, idx, 'name')}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Options (comma separated, e.g., Whole, Oat, Almond)"
                        value={custom.options}
                        onChange={(e) => handleChange('customizations', e.target.value, idx, 'options')}
                        className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addCustomization}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-amber-500 hover:text-black transition"
                  >
                    + Add Customization
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE (unchanged) */}
            <div className="space-y-6">
              <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition">
                <h2 className="text-white font-semibold text-lg flex items-center gap-2 mb-4">
                  <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
                  Product Image
                </h2>
                <label className="flex flex-col items-center justify-center h-52 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-amber-500 transition bg-gray-800/30">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-full object-contain rounded-xl" />
                  ) : (
                    <div className="text-center">
                      <Plus className="h-10 w-10 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Click to upload image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImagePreview(URL.createObjectURL(file));
                        setFormData({ ...formData, image: file });
                      }
                    }}
                  />
                </label>
              </div>

              <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 p-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (isEdit ? 'Update Item' : 'Save Item')}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {showCategoryModal && (
        <CategoryForm
          mode={selectedCategory ? "edit" : "create"}
          initialData={selectedCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default ItemForm;