import { useEffect, useState } from "react";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useStoreStore } from "../../store/useStoreStore";

const CategoryForm = ({ onClose }) => {
  const { createCategory } = useCategoryStore();
  const { fetchStores, stores } = useStoreStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    store: "",
    displayOrder: 1,
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "displayOrder" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createCategory(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1f1f1f]/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl w-[400px] p-6 relative text-white">
        
        <h2 className="text-xl font-semibold mb-4">Create Category</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          {/* Store Dropdown */}
          <select
            name="store"
            value={formData.store}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          >
            <option value="" className="text-gray-400">Select Store</option>
            {stores?.map((store) => (
              <option key={store._id} value={store._id}>
                {store.name}
              </option>
            ))}
          </select>

          {/* Display Order */}
          <input
            type="number"
            name="displayOrder"
            value={formData.displayOrder}
            onChange={handleChange}
            min={1}
            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;