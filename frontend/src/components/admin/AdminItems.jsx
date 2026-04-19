import { useEffect, useState, useMemo } from 'react';
import { useItemStore } from '../../store/useItemStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { useStoreStore } from '../../store/useStoreStore';
import { Pencil, Trash2, Plus, Package, AlertCircle } from 'lucide-react';

const AdminItems = ({ onEdit, onAdd }) => {
  const { items, fetchItems, deleteItem, loading } = useItemStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { stores, fetchStores } = useStoreStore();
  
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStore, setFilterStore] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchItems(undefined, filterCategory || undefined);
    fetchCategories();
    fetchStores();
  }, [filterCategory]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (filterStore) {
      result = result.filter(item => 
        item.storePrices?.some(sp => sp.store === filterStore)
      );
    }
    return result;
  }, [items, filterStore]);

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setConfirmDelete(null);
    } catch (error) {
      console.log(error);
    }
  };

  const formatPrice = (item) => {
    if (item.storePrices && item.storePrices.length > 0) {
      return `₱${item.storePrices[0].price}`;
    }
    return `₱${item.basePrice || 0}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl">
              <Package className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Products
              </h1>
              <p className="text-gray-400 text-sm mt-1">Manage your menu items</p>
            </div>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-amber-500 text-black px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/20"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-4 mb-8 flex flex-wrap gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Stores</option>
            {stores.map(store => (
              <option key={store._id} value={store._id}>{store.name}</option>
            ))}
          </select>
        </div>

        {/* Loading / Empty / Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800">
            <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No products found for the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="group bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5"
              >
                {/* Image */}
                <div className="h-48 bg-gray-800/50 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <div className="text-gray-500 text-sm flex flex-col items-center gap-2">
                      <Package className="h-8 w-8" />
                      No image
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {item.description || 'No description'}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-amber-400 font-bold text-lg">{formatPrice(item)}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                      {item.category?.name || 'Uncategorized'}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-800">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(item._id)}
                      className="p-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal - Modern */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-full">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminItems;