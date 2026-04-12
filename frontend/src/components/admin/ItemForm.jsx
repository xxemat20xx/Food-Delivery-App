import { useState, useEffect } from 'react';
import { useCategoryStore } from "../../store/useCategoryStore";
import { useStoreStore } from "../../store/useStoreStore";
import { useItemStore } from '../../store/useItemStore';
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from 'react-toastify';

import CategoryForm from './CategoryForm';

const ItemForm = ({ onClose, item }) => {
    const isEdit = !!item;
    const { fetchCategories, categories } = useCategoryStore();
    const { fetchStores, stores } = useStoreStore();
    const { createItem, updateItem, loading } = useItemStore();
    const [ showCategoryModal, setShowCategoryModal ] = useState(false);

    //Custom Category Dropdown
    const [open, setOpen] = useState(false)
    
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

    return (
        <div className="fixed inset-0 bg-black/80 overflow-y-auto z-50 p-6">
            <form onSubmit={handleSubmit}>
                <div className="max-w-6xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            {isEdit ? 'Edit Item' : 'Create Item'}
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            {isEdit ? 'Modify product details' : 'Add a new product to your menu'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* LEFT SIDE */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <div className="bg-[#2a2a2a] p-5 rounded-2xl border border-gray-700">
                                <h2 className="text-white font-semibold mb-4">Basic Information</h2>
                                                               <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-white font-semibold">Pricing</h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowCategoryModal(true)}
                                        className="text-sm bg-green-600 hover:bg-green-500 px-3 py-1 rounded-lg transition"
                                    >
                                        + Add New Category
                                    </button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Product name"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-[#1f1f1f] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <div className="relative w-full">

                                    {/* Trigger */}
                                    <button
                                        type="button"
                                        onClick={() => setOpen(!open)}
                                        className="w-full px-4 py-3 rounded-xl bg-[#1f1f1f] border border-gray-600 text-white text-left flex justify-between items-center"
                                    >
                                        {categories.find(c => c._id === formData.category)?.name || "Select Category"}
                                        <MoreVertical size={18} />
                                    </button>

                                    {/* Dropdown */}
                                    {open && (
                                        <div className="absolute z-50 mt-2 w-full bg-[#2a2a2a] border border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">

                                        {categories.map((cat) => (
                                            <div
                                            key={cat._id}
                                            className="flex items-center justify-between px-3 py-2 hover:bg-[#3a3a3a] cursor-pointer"
                                            >
                                            {/* Select category */}
                                            <span
                                                onClick={() => {
                                                handleChange("category", cat._id);
                                                setOpen(false);
                                                }}
                                                className="flex-1 text-white"
                                            >
                                                {cat.name}
                                            </span>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <button
                                                type="button"
                                                onClick={() => console.log("edit", cat._id)}
                                                className="text-blue-400 hover:text-blue-300"
                                                >
                                                <Pencil size={16} />
                                                </button>

                                                <button
                                                type="button"
                                                onClick={() => console.log("delete", cat._id)}
                                                className="text-red-400 hover:text-red-300"
                                                >
                                                <Trash2 size={16} />
                                                </button>
                                            </div>
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                    </div>
                                </div>
                                <textarea
                                    rows="3"
                                    placeholder="Description..."
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className="w-full mt-4 px-4 py-3 rounded-xl bg-[#1f1f1f] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Pricing with Add All Stores */}
                            <div className="bg-[#2a2a2a] p-5 rounded-2xl border border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-white font-semibold">Pricing</h2>
                                    <button
                                        type="button"
                                        onClick={addAllStores}
                                        className="text-sm bg-green-600 hover:bg-green-500 px-3 py-1 rounded-lg transition"
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
                                    className="w-full px-4 py-3 rounded-xl bg-[#1f1f1f] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                                />
                                <div className="space-y-3">
                                    {formData.storePrices.map((storePrice, idx) => (
                                        <div key={idx} className="grid md:grid-cols-3 gap-3">
                                            <select
                                                value={storePrice.store}
                                                onChange={(e) => handleChange('storePrices', e.target.value, idx, 'store')}
                                                className="px-4 py-3 rounded-xl bg-[#1f1f1f] border border-gray-600 text-white"
                                            >
                                                <option value="">Select Store</option>
                                                {stores.map(store => (
                                                    <option key={store._id} value={store._id}>{store.name}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="Price"
                                                value={storePrice.price}
                                                onChange={(e) => handleChange('storePrices', e.target.value, idx, 'price')}
                                                className="px-4 py-3 rounded-xl bg-[#1f1f1f] border border-gray-600 text-white"
                                            />
                                            {idx === formData.storePrices.length - 1 && (
                                                <button
                                                    type="button"
                                                    onClick={addStorePrice}
                                                    className="rounded-xl bg-gray-600 text-white hover:bg-orange-500 transition"
                                                >
                                                    + Add Store
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customizations */}
                            <div className="bg-[#2a2a2a] p-5 rounded-2xl border border-gray-700">
                                <h2 className="text-white font-semibold mb-4">Customizations</h2>
                                <div className="space-y-3">
                                    {formData.customizations.map((custom, idx) => (
                                        <div key={idx} className="space-y-2 p-3 bg-[#1f1f1f] rounded-xl">
                                            <input
                                                type="text"
                                                placeholder="Customization name (e.g., Milk type)"
                                                value={custom.name}
                                                onChange={(e) => handleChange('customizations', e.target.value, idx, 'name')}
                                                className="w-full px-4 py-2 rounded-lg bg-[#2a2a2a] border border-gray-600 text-white"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Options (comma separated, e.g., Whole, Oat, Almond)"
                                                value={custom.options}
                                                onChange={(e) => handleChange('customizations', e.target.value, idx, 'options')}
                                                className="w-full px-4 py-2 rounded-lg bg-[#2a2a2a] border border-gray-600 text-white"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addCustomization}
                                        className="px-4 py-2 rounded-xl bg-gray-600 text-white hover:bg-orange-500 transition"
                                    >
                                        + Add Customization
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="space-y-6">
                            <div className="bg-[#2a2a2a] p-5 rounded-2xl border border-gray-700">
                                <h2 className="text-white font-semibold mb-4">Product Image</h2>
                                <label className="flex flex-col items-center justify-center h-52 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-orange-500 transition bg-[#1f1f1f]">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="h-full object-contain rounded-xl" />
                                    ) : (
                                        <p className="text-gray-400 text-sm">Click to upload image</p>
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

                            <div className="bg-[#2a2a2a] p-5 rounded-2xl border border-gray-700">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-500 transition shadow-lg disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : (isEdit ? 'Update Item' : 'Save Item')}
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="mt-3 w-full py-3 rounded-xl bg-gray-700 text-white font-semibold hover:bg-gray-600 transition shadow-lg"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            {showCategoryModal && (
              <CategoryForm onClose={() => setShowCategoryModal(false)} />
            )}
        </div>
    );
};

export default ItemForm;