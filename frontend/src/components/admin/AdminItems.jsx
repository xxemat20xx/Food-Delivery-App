import { useEffect, useState, useMemo } from 'react';
import { useItemStore } from '../../store/useItemStore';
import { useCategoryStore } from '../../store/useCategoryStore';
import { useStoreStore } from '../../store/useStoreStore';
import { toast } from 'react-toastify';
import { Pencil, Trash2, Plus } from 'lucide-react';

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
      toast.success('Item deleted successfully');
      setConfirmDelete(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete item');
    }
  };

  const formatPrice = (item) => {
    if (item.storePrices && item.storePrices.length > 0) {
      return `₱${item.storePrices[0].price}`;
    }
    return `₱${item.basePrice || 0}`;
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-gray-400 mt-1">Manage your menu items</p>
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg transition"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        <div className="bg-[#2a2a2a] p-4 rounded-xl mb-6 flex flex-wrap gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
            className="bg-[#1f1f1f] border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="">All Stores</option>
            {stores.map(store => (
              <option key={store._id} value={store._id}>{store.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading products...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-[#1f1f1f] rounded-xl">
            <p className="text-gray-400">No products found for the selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-[#2a2a2a] rounded-xl border border-gray-700 overflow-hidden hover:border-orange-500 transition"
              >
                <div className="h-48 bg-[#1f1f1f] flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-500 text-sm">No image</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {item.description || 'No description'}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-orange-400 font-bold">{formatPrice(item)}</span>
                    <span className="text-xs text-gray-500">
                      {item.category?.name || 'Uncategorized'}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(item._id)}
                      className="p-2 rounded-lg bg-red-600 hover:bg-red-500 transition"
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

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Confirm Delete</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition"
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