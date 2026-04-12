import { useEffect, useState } from "react";
import { useItemStore } from "../../store/useItemStore";
import ItemForm from "../../components/admin/ItemForm";
import AdminItems from "../../components/admin/AdminItems";

import { PlusCircle } from "lucide-react"

const ItemsDashboard = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

    const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

    const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
  };
    
    const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    basePrice: "",
    storePrices: [], // array of { storeId, price }
    customizations: [], // array of { name, options }
    });
    
    const { fetchItems, items } = useItemStore();
    useEffect(() => {
        fetchItems();
    },[fetchItems]);

    const openAddItemModal = () => {
      setModalOpen(true);
    }
  return (
    <div className="min-h-screen bg-black text-white p-6">
        {/* Header */}
              <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-400">Items Management</h1>
        <button
          className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors"
          onClick={handleAdd}
        >
          <PlusCircle className="h-5 w-5" /> Add Items
        </button>
      </div>
             {showForm ? (
        <ItemForm
          item={editingItem}
          onClose={handleCloseForm}
        />
      ) : (
        <AdminItems
          onEdit={handleEdit}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}

export default ItemsDashboard